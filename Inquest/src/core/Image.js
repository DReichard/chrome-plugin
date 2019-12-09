const ImageUtils = require("../image_loading/image_processing");

class ImageWrapper {

    Image;

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

    async static FromBase64StringAsync(imageBase64str) {
        const parsedImg = await ImageUtils.base64ToImage(imageBase64str);
        const img = tf.browser.fromPixels(parsedImg, 1).toFloat();
        return new ImageWrapper(img);
    }

    static async FromPathAsync(url) {
        const img = await ImageUtils.loadImage(url);
        return new ImageWrapper(img);
    }
}