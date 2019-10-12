const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const backGround = require("../src/background/background");
const fs = require('fs');
const jpeg = require('jpeg-js');

const htmlPath = "D:\\diploma\\gallery\\test\\test_j.html";
const assertedImgArrPath = "D:\\diploma\\gallery\\test\\python.json"
const rawdata = fs.readFileSync(assertedImgArrPath);
const assertedImgArr = JSON.parse(rawdata);
const assertedImgArrFlat = [].concat.apply([], assertedImgArr);

const base64Img = "data:image/jpeg;base64,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";
backGround.ImagePipeline(base64Img).then(actual => {
    // const assertion = isEqual(assertedImgArrFlat, actual)
    const json = JSON.stringify(Object.values(actual))
    fs.writeFileSync("D:\\diploma\\gallery\\test\\js.json", json, 'utf8', function(err) {
        console.log(err)
    }); 
});

function isEqual(a, b) 
{
    let counter = 0;
    if (a.length !== b.length) {
        return false; 
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            counter++;
            console.log(a[i] - b[i])
        }
    }
    console.log(counter);
    if (counter === 0) {
        return true;
    }
    return false;
}
