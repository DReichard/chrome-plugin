import AnalysisResult from '../core/AnalysisResult';

const tf = require('@tensorflow/tfjs');

export default class ResNetAnalyzer {

    constructor(pathToModel, threshold) {
        this._pathToModel = pathToModel;
        this._threshold = threshold;
    }

    async Initialize() {
        this._model = await tf.loadLayersModel(this._pathToModel);
    }

    async Analyze(image) {
        const output = (await this._model.predict(image.Image).array())[0][1].toFixed(2);
        const detectorName = "ResNet"
        const result = new AnalysisResult();
        result.Name = detectorName;
        result.Result = output;
        if (result.Result >= this._threshold) {
            result.Alert = true;
        } else {
            result.Alert = false;
        }
        return result;
    }
}
