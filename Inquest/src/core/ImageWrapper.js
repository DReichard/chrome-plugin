const ImageUtils = require("../image_loading/image_processing");
const tf = require('@tensorflow/tfjs');

export default class ImageWrapper {

    constructor(tensor) {
        this.Image = tensor;
    }

    static FromImageData() {
        const img = tf.browser.fromPixels(parsedImg, 1).toFloat();
        return new ImageWrapper(img);
    }

    static FromTensor(tensor) {
        return new ImageWrapper(tensor);
    }

    static FromHtmlImage() {
        const img = tf.browser.fromPixels(parsedImg, 1).toFloat();
        return new ImageWrapper(img);
    }

    static FromHtmlCanvas() {
        const img = tf.browser.fromPixels(parsedImg, 1).toFloat();
        return new ImageWrapper(img);
    }

    static async FromBase64StringAsync(imageBase64str) {
        const parsedImg = await ImageUtils.base64ToImage(imageBase64str);
        const imageBlocks = ImageUtils.imageBlockSplit(parsedImg, 128, 128);
        const results = imageBlocks.map(p => {
            const img = tf.browser.fromPixels(p, 1).toFloat();
            const reshapedArray = img.reshape([1, 1, 128, 128]);
            const result = ImageWrapper.FromTensor(reshapedArray);
            result.offsetX = p.inquest_offsetX;
            result.offsetY = p.inquest_offsetY;
            return result;
        });
        return results;
    }

    static async FromPathAsync(url) {
        const img = await ImageUtils.loadImage(url);
        return new ImageWrapper(img);
    }
}
