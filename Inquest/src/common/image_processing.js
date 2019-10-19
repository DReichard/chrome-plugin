global.Module = {
    locateFile: (path) => {
        const url = `assets/wasm/${path}`;
        console.log(`⬇️Downloading wasm from ${url}`);
        return url;
    }
};
const cv = require('./assets/js/opencv.js');

module.exports = { getRedChannel, base64ToImage, base64ToMat };


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

async function base64ToMat(str) {
    const img = await loadImage(str)
    const mat = cv.imread(img)
    return mat; 
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