global.Module = {
    locateFile: (path) => {
        const url = `assets/wasm/${path}`;
        console.log(`⬇️Downloading wasm from ${url}`);
        return url;
    }
};
module.exports = { getRedChannel, base64ToImage, getDataUrlAsync, imageBlockSplit };


function getRedChannel(image, imageSize) {
    if (image.rows !== imageSize || image.cols !== imageSize) {
        throw new Error("Unsupported image length");
    }
    const buffer = [];
    for (let i = 2; i < image.data.length; i = i + 4) {
        buffer.push(image.data[i]);
    }
    return buffer;
}

async function base64ToImage(str) {
    const img = await loadImage(str)
    return img; 
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", err => reject(err));
      img.src = src;
    });
  };

function getDataUrlAsync(url) {
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

function imageBlockSplit(image, blockHeight, blockWidth) {
    const imagePieces = [];
    const numRowsToCut = image.height / blockHeight >> 0;
    const numColsToCut = image.width / blockWidth >> 0;
    const backPage = chrome.extension.getBackgroundPage().document;
    for(var x = 0; x < numColsToCut; ++x) {
        for(var y = 0; y < numRowsToCut; ++y) {
            var canvas = backPage.createElement('canvas');
            canvas.width = blockWidth;
            canvas.height = blockHeight;
            var context = canvas.getContext('2d');
            context.drawImage(image, x * blockWidth, y * blockHeight, blockWidth, blockHeight, 0, 0, canvas.width, canvas.height);
            canvas.inquest_offsetX = x * blockWidth;
            canvas.inquest_offsetY = y * blockHeight;
            imagePieces.push(canvas);
        }
    }
    return imagePieces;
}
  