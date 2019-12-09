
const tf = require('@tensorflow/tfjs');

class ResNetAnalyzer {
    _pathToModel;
    _model;

    constructor(pathToModel) {
        this._pathToModel = pathToModel;
    }

    async Initialize() {
        this._model = await tf.loadLayersModel(this.pathToModel);
    }

    async Analyze(image) {
        const output = (await this._model.predict(inputData).array())[0][1].toFixed(2);
        const detectorName = "ResNet"
        const result = {
            Name: detectorName,
            Result: output
        };
        return result;
    }
}