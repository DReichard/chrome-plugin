const md5 = require("md5");
require('./pageHook.css');

const forwardPortName = "inquestForward";

function toDataURL(url, callback){
    const xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.responseType = 'blob';
    xhr.onload = function(){
        const fr = new FileReader();
        fr.onload = function(){
        callback(this.result);
        }; 
        fr.readAsDataURL(xhr.response);
    };
    xhr.send();
}

function processImage(img, port) {
    toDataURL(img.src, function(dataURL){
        const hash = md5(dataURL);  
        if (!imageElements[hash]) {
            imageElements[hash] = [img];
        } else {
            imageElements[hash].push(img);
        }
        const message = {
            ImageHash: hash,
            ImageSrc: dataURL
        };
        port.postMessage(message);
    });
}

const forwardPort = chrome.runtime.connect({name: forwardPortName});

forwardPort.onMessage.addListener(function(msg) {
    const imageElement = imageElements[msg.ImageHash][0];
    const containerElement = document.createElement('span');
    containerElement.className += "inquest-container";
    imageElement.parentNode.replaceChild(containerElement, imageElement);
    containerElement.appendChild(imageElement);
    const subcontainerElement = document.createElement('h2');
    containerElement.appendChild(subcontainerElement);
    const labelElement = document.createElement('span');
    labelElement.innerText = (msg.Result.toFixed(3));
    subcontainerElement.appendChild(labelElement);
    // Result

});

console.log("pageHook online")
const imageElements = {}
const images = document.getElementsByTagName('img'); 
for(let i = 0; i < images.length; i++) {
    processImage(images[i], forwardPort);
}
