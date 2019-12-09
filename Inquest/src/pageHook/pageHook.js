const md5 = require("md5");
require('./pageHook.css');
const ImageUtils = require("../image_loading/image_processing")

const forwardPortName = "inquestForward";
const forwardPort = chrome.runtime.connect({name: forwardPortName});
forwardPort.onMessage.addListener(processMessage);
console.log("PageHook online")
const imageElements = {}
const images = document.getElementsByTagName('img'); 
for(let i = 0; i < images.length; i++) {
    if (images[i].height >= 128 && images[i].width >= 128) {
        processImage(images[i], forwardPort);
    }
}

async function processImage(img, port) {
    const dataUrl = await ImageUtils.getDataUrlAsync(img.src);
    const hash = md5(dataUrl);  
    if (!imageElements[hash]) {
        imageElements[hash] = [img];
    } else {
        imageElements[hash].push(img);
    }
    const message = {
        ImageHash: hash,
        ImageDataUrl: dataUrl,
        ImageSrc: img.src
    };
    port.postMessage(message);
}

function processMessage(message) {
    const imageElement = imageElements[message.ImageHash][0];
    if (!message.Alert) {
        return;
    }
    if (!imageElement.parentNode.className.includes("inquest-container")) {
        const containerElement = document.createElement('div');
        containerElement.style.display = "inline-block";
        containerElement.className += "inquest-container";
        imageElement.parentNode.replaceChild(containerElement, imageElement);
        containerElement.appendChild(imageElement);
    }
    const parentNode = imageElement.parentNode;
    let isLabelPresent = false;
    const headerElement = [...parentNode.children].find(x => x.tagName.toUpperCase() === "H2" && 
        parseInt(x.getAttribute("data-inquest-offset-x")) === message.offsetX && 
        parseInt(x.getAttribute("data-inquest-offset-y")) === message.offsetY);
    isLabelPresent = !!headerElement;

    // if ([...parentNode.children].some(x => x.tagName.toUpperCase() === "H2")) {
    if (isLabelPresent) {
        const subContainerElement = [...parentNode.children].find(x => x.tagName.toUpperCase() === "H2" && 
            parseInt(x.getAttribute("data-inquest-offset-x")) === message.offsetX && 
            parseInt(x.getAttribute("data-inquest-offset-y")) === message.offsetY);
        const labelElement = [...subContainerElement.children]
            .find(x => x.tagName.toUpperCase() === "SPAN");
        labelElement.innerText += "\n\ " + message.Name + ": " + message.Result;
    } else {
        const subcontainerElement = document.createElement('h2');
        subcontainerElement.style.left = message.offsetX;
        subcontainerElement.style.top = message.offsetY;
        subcontainerElement.style.width = 128;
        subcontainerElement.setAttribute("data-inquest-offset-x", message.offsetX);
        subcontainerElement.setAttribute("data-inquest-offset-y", message.offsetY);
        parentNode.appendChild(subcontainerElement);

        const reticleElement = document.createElement('div');
        reticleElement.width = 128;
        reticleElement.height = 128;
        subcontainerElement.appendChild(reticleElement);

        const labelElement = document.createElement('span');
        labelElement.style.whiteSpace = "pre";
        labelElement.innerText = message.Name + ": " + message.Result;
        subcontainerElement.appendChild(labelElement);
    }
}
