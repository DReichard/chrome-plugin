const md5 = require("md5");
require('./pageHook.css');

const forwardPortName = "inquestForward";
const forwardPort = chrome.runtime.connect({name: forwardPortName});
forwardPort.onMessage.addListener(processMessage);
console.log("pageHook online")
const imageElements = {}
const images = document.getElementsByTagName('img'); 
for(let i = 0; i < images.length; i++) {
    processImage(images[i], forwardPort);
}

async function processImage(img, port) {
    const dataUrl = await awaitDataUrl(img.src);
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
    // toDataURL(img.src, function(dataURL){
    //     const hash = md5(dataURL);  
    //     if (!imageElements[hash]) {
    //         imageElements[hash] = [img];
    //     } else {
    //         imageElements[hash].push(img);
    //     }
    //     const message = {
    //         ImageHash: hash,
    //         ImageSrc: dataURL
    //     };
    //     port.postMessage(message);
    // });
}

function processMessage(message) {
    const imageElement = imageElements[message.ImageHash][0];
    if (!imageElement.parentNode.className.includes("inquest-container")) {
        const containerElement = document.createElement('div');
        containerElement.style.display = "inline-block";
        containerElement.className += "inquest-container";
        imageElement.parentNode.replaceChild(containerElement, imageElement);
        containerElement.appendChild(imageElement);
    }
    const parentNode = imageElement.parentNode;
    if ([...parentNode.children].some(x => x.tagName.toUpperCase() === "H2")) {
        const subContainerElement = [...parentNode.children].find(x => x.tagName.toUpperCase() === "H2");
        const labelElement = [...subContainerElement.children].find(x => x.tagName.toUpperCase() === "SPAN");
        labelElement.innerText += "\n\ " + message.Name + ": " + message.Result;
    } else {
        const subcontainerElement = document.createElement('h2');
        parentNode.appendChild(subcontainerElement);
        const labelElement = document.createElement('span');
        labelElement.style.whiteSpace = "pre";
        labelElement.innerText = message.Name + ": " + message.Result;
        subcontainerElement.appendChild(labelElement);
    }
}
function awaitDataUrl(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('get', url);
        xhr.responseType = 'blob';
        xhr.onload = function(){
            const fr = new FileReader();
            fr.onload = function(){
                resolve(this.result);
            }; 
            fr.readAsDataURL(xhr.response);
        };
        xhr.send();
      });
}