
const fs = require('fs');
const jpeg = require('jpeg-js');
const ImageUtils = require("../src/common/image_processing");

const jpegFolder = "C:\\datasets\\j-uniward_128_2020\\train\\cover";
const jsonFolder = "C:\\datasets\\j-uniward_128_2020\\train\\cover_json";

const length = fs.readdirSync(jpegFolder).length
let = i = 0;

fs.readdirSync(jpegFolder).forEach(file => {
    const fileName = file.substring(0, file.indexOf('.'))
    const buf = fs.readFileSync(jpegFolder + '\\' + file);
    const image = jpeg.decode(buf);
    const red = ImageUtils.getRedChannel(image, 128);
    const json = JSON.stringify(Array.prototype.slice.call(red, 0));
    const outName = jsonFolder + "\\" + fileName + ".json";
    fs.writeFileSync(outName, json, 'utf8', function(err) {
        console.log(err);
    });
    i++;
    console.log(i + "/" + length + ": " + file);
  });