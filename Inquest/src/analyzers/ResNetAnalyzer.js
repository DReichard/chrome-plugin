
const tf = require('@tensorflow/tfjs');

export default class ResNetAnalyzer {

    constructor(pathToModel) {
        this._pathToModel = pathToModel;
    }

    async Initialize() {
        this._model = await tf.loadLayersModel(this._pathToModel);
    }

    async Analyze(image) {
        const test = image;
        const output = (await this._model.predict(image.Image).array())[0][1].toFixed(2);
        const detectorName = "ResNet"
        const result = {
            Name: detectorName,
            Result: output
        };
        return result;
    }
}
