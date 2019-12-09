const Analytics = require("../rs_algorithm/rs")
import AnalysisResult from '../core/AnalysisResult';

export default class RsAnalyzer {
    constructor(threshold) {        
        this._threshold = threshold;
    }

    async Analyze(imageWrapper) {
        const inputArray = await imageWrapper.Image.flatten().array();
        const outputData = Analytics.calculateRS(inputArray, 128).toFixed(2); 
        const detectorName = "RS"
        const result = new AnalysisResult();
        result.Name = detectorName;
        result.Result = outputData;
        if (result.Result >= this._threshold) {
            result.Alert = true;
        } else {
            result.Alert = false;
        }
        return result;
    }
}
