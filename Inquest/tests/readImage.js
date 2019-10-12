function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", err => reject(err));
      img.src = src;
    });
  };
const fs = require('fs');
const cv = require('opencv4nodejs');
// const cv2 = require('C:/Users/stani/source/repos/chrome-plugin/Inquest/src/common/assets/js/opencv');

const path = "D:\\diploma\\gallery\\test\\1.jpg"
const url1 = './model_resnet_2020_j_72full.onnx';

var jpegData = fs.readFileSync(path);
const mat = cv.imread(path)
const arr = new Uint8Array(mat);
const tarr = [...arr]
const filteredJjs = []
for (let i = 0; i < tarr.length; i = i + 3) {
    if (i % 3 === 0) {
        filteredJjs.push(tarr[i]);
    }
}
const filteredOcv = cv.imread(path, cv.CV_8UC1).getDataAsArray();
const ocv = [].concat(...filteredOcv)
const expectedJson = JSON.stringify(ocv);
let counter = 0;
for (let i = 0; i < ocv.length; i = i + 1) {
    if (ocv[i] !== filteredJjs[i]) {
        counter++;
        console.log(ocv[i] - filteredJjs[i])
    }
}
console.log("Difference count: " + counter / filteredJjs.length * 100)

