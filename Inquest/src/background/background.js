
const ImageUtils = require("../image_loading/image_processing");
const Analytics = require("../rs_algorithm/rs");
const tf = require('@tensorflow/tfjs');

var imageSize = 128;
const url2 = './model.json';

module.exports = { ImagePipeline };

if (!module.parent) {
    // this is the main module
    var hookPage = chrome.extension.getBackgroundPage();
    var model = tf.loadLayersModel(url2).then((result) => {
        model = result;
        chrome.runtime.onConnect.addListener(function(port) {
            this.port = port;
            this.port.onMessage.addListener(ImageMessagePipeline);
            hookPage.console.log("Background listener online");
        });
    })
  } else {
    // we were require()d from somewhere else
  }

async function ImageMessagePipeline(msg) {
	const preprocessedData = await ImagePipeline(msg.ImageDataUrl, imageSize);
	const result2 = await RSwrapper(preprocessedData);
	result2.ImageHash = msg.ImageHash;
	port.postMessage(result2);
	const result3 = await ResNetWrapper(preprocessedData);
	result3.ImageHash = msg.ImageHash;
	port.postMessage(result3);	
}
 
async function ImagePipeline(imageBase64str, imageSize) {
    const parsedImg = await ImageUtils.base64ToImage(imageBase64str);
    const img = tf.browser.fromPixels(parsedImg, 1).toFloat();
    const batched = img.reshape([1, 1, imageSize, imageSize]);
    return batched;
}

async function RSwrapper(inputData) {
    const inputArray = await inputData.flatten().array();
    const outputData = Analytics.calculateRS(inputArray, imageSize).toFixed(2); 
    const detectorName = "RS"
    const result = {
        Name: detectorName,
        Result: outputData + "  "
    };
    return result;
}

async function ResNetWrapper(inputData) {
    const output = (await model.predict(inputData).array())[0][1].toFixed(2);
    const detectorName = "ResNet"
    const result = {
        Name: detectorName,
        Result: output
    };
    return result;
}