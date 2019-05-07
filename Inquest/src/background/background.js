var onnxjs = require('onnxjs');
var jimp = require('jimp');
var ndarray = require("ndarray")
var ops = require("ndarray-ops")
var nj = require('numjs');

var hookPage = chrome.extension.getBackgroundPage();

const session = new onnxjs.InferenceSession();
const url = './model_xu_10_onnx.onnx';
(async () => {await session.loadModel(url)})();

chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(async function(msg) {
        const dataString = msg.ImageSrc.substring(msg.ImageSrc.indexOf('base64,') + 7);
        const buffer = Buffer.from(dataString, 'base64');
        const parsedImg = await Jimp.read(buffer);
        const arr = getRedChannel(parsedImg);
        const preprocessedData = preprocess(arr, 256, 256);
        // const inputTensor = new onnx.Tensor(preprocessedData, 'float32', [1, 3, width, height]);
        const result1 = await xuNetWrapper(preprocessedData);
        result1.ImageHash = msg.ImageHash;
        port.postMessage(result1);
        const result2 = RSwrapper(preprocessedData);
        result2.ImageHash = msg.ImageHash;
        port.postMessage(result2);
    });
});
hookPage.console.log("Background listener online");

function RSwrapper(inputData) {
    const outputData = calculateRS(inputData);
    const detectorName = "RS"
    const result = {
        Name: detectorName,
        Result: outputData
    };
    return result;
}

function calculateRS(input) {
    const result = rsDetect(input, 256, null, null, null);
    return result.toFixed(3);
}

async function xuNetWrapper(inputData) {
    const inputTensor = new onnx.Tensor(inputData, 'float32', [1, 1, 256, 256]);
    const outputMap = await session.run([inputTensor]);
    const outputData = outputMap.values().next().value.data[1].toFixed(3);
    const detectorName = "XuNet"
    const result = {
        Name: detectorName,
        Result: outputData
    };
    return result;
}

function getRedChannel(image) {
    const buffer = [];
    for (let i = 0; i < image.bitmap.data.length; i = i + 4) {
        buffer.push(image.bitmap.data[i]);
    } 
    if (buffer.length != 65536) {
        hookPage.console.log("Unsupported image length");
        return;
    }
    return buffer;
}

function preprocess(data, width, height) {
    const dataFromImage = ndarray(new Float32Array(data), [width, height, 1]);
    // const dataProcessed = ndarray(new Float32Array(width * height * 3), [1, 3, height, width]);
    const dataProcessed = ndarray(new Float32Array(width * height * 1), [1, 1, height, width]);
  
    // ops.divseq(dataFromImage, 255.0);
  
    // Realign imageData from [224*224*4] to the correct dimension [1*3*224*224].
    // ndarray.ops.assign(dataProcessed.pick(0, 0, null, null), dataFromImage.pick(null, null, 2));
    // ndarray.ops.assign(dataProcessed.pick(0, 1, null, null), dataFromImage.pick(null, null, 1));
    // ndarray.ops.assign(dataProcessed.pick(0, 2, null, null), dataFromImage.pick(null, null, 0));
    ops.assign(dataProcessed.pick(0, 0, null, null), dataFromImage.pick(null, null, 0));
    return dataProcessed.data;
}



function getGroup(p, mask){
	let pf = [];
	for (let i = 0; i < mask.length; i++) {
		if (mask[i] == 1){
			pf[i] = flip(p[i]);
		} else if (mask[i] == -1){
			pf[i] = iflip(p[i]);
		} else {
			pf[i] = p[i];
		}
	}
	const d1 = pixelDisc(p);
	const d2 = pixelDisc(pf);
	if (d1 == d2) return 'U';
	if (d1 < d2) return 'R';
	return 'S';
}

function lsbFlip(p){
	const ret = [];
	for (let i = 0; i < p.length; i++) {
		ret[i] = p[i] ^ 1;
	}

	return ret;
}

function pixelDisc(p){
	let sum = 0;
	for (let i = 0; i < p.length - 1; i++) {
		sum += Math.abs(p[i + 1] - p[i]);
	}
	return sum;
}

function flip(val){
	if(val & 1){
		return val - 1;
	}
	return val + 1;
}

function iflip(val){
	if(val & 1){
		return val + 1;
	}
	return val - 1;
}

function solve(gc){
	const d0  = gc.R   - gc.S;
	const dm0 = gc.mR  - gc.mS;
	const d1  = gc.iR  - gc.iS;
	const dm1 = gc.imR - gc.imS;
	const a = 2 * (d1 + d0);
	let b = dm0 - dm1 - d1 - d0 * 3;
	const c = d0 - dm0;
    let D = b * b - 4 * a * c;
    
	if (D < 0) return null;
	b *= -1;

    if (D === 0) return (b / 2 / a) / (b / 2 / a - 0.5);
    
	D = Math.sqrt(D);
	const x1 = (b + D) / 2 / a;
	const x2 = (b - D) / 2 / a;

	if (Math.abs(x1) < Math.abs(x2)) return x1 / (x1 - 0.5);

	return x2 / (x2 - 0.5);
}

function rsDetect(data, width, mask, bw, bh){
	mask = mask || [1, 0, 0, 1];
	bw = bw || 2;
	bh = bh || 2;

	const imask = mask.map(function(x) {
        return x ? -x : 0;
    });
	// const height = data.length / 4 / width;
	const height = data.length / width;
	const blocksInRow = Math.floor(width / bw);
	const blocksInCol = Math.floor(height / bh);

	const gc = {'R': 0, 'S': 0, 'U': 0, 'mR': 0, 'mS': 0, 'mU': 0, 'iR': 0, 'iS': 0, 'iU': 0, 'imR': 0, 'imS': 0, 'imU': 0};

	for (let y = 0; y < blocksInCol; y++){
		for (let x = 0; x < blocksInRow; x++){

			ch = [];

			for (let v = 0; v < bh; v++){
				for (let h = 0; h < bw; h++){
					// const offset = (width * (y * bh + v) + x * bw + h) * 4;
					const offset = width * (y * bh + v) + x * bw + h;
					ch.push(data[offset]);
				}
			}

			gc[getGroup(ch, mask)]++;
			gc['m' + getGroup(ch, imask)]++;

			ch = lsbFlip(ch);

			gc['i' + getGroup(ch, mask)]++;
			gc['im' + getGroup(ch, imask)]++;
		}
	}

    const result = solve(gc);
    if (result == null) {
        let ac = 0;
    }
    return result;
}