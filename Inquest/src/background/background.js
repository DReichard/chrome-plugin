var onnxjs = require('onnxjs');
var jimp = require('jimp');
var ndarray = require("ndarray")
var ops = require("ndarray-ops")


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
        const result1 = await analyseXuNet(preprocessedData);
        result1.ImageHash = msg.ImageHash;
        port.postMessage(result1);
        const result2 = analyseRS(preprocessedData);
        result2.ImageHash = msg.ImageHash;
        port.postMessage(result2);
    });
});

hookPage.console.log("background online");

function analyseRS(inputData) {
    return {};
}

async function analyseXuNet(inputData) {
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
