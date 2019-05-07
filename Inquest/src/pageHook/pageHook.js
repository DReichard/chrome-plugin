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
        labelElement.innerText +=  msg.Name + ": " + msg.Result;
    } else {
        const subcontainerElement = document.createElement('h2');
        parentNode.appendChild(subcontainerElement);
        const labelElement = document.createElement('span');
        labelElement.innerText = msg.Name + ": " + msg.Result;
        subcontainerElement.appendChild(labelElement);
    }
});

console.log("pageHook online")
const imageElements = {}
const images = document.getElementsByTagName('img'); 
for(let i = 0; i < images.length; i++) {
    processImage(images[i], forwardPort);
}
