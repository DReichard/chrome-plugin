class ImageWrapper {
    _image;

    static FromImageData() {

    }

    static FromTensor() {

    }

    static FromHtmlImage() {

    }

    static FromHtmlCanvas() {

    }

    async static FromBase64String(imageBase64str) {
        const parsedImg = await ImageUtils.base64ToImage(imageBase64str);
        const img = tf.browser.fromPixels(parsedImg, 1).toFloat();
        return img;
    }
    static FromPath() {
        
    }
}