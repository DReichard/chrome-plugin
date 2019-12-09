const Analytics = require("../rs_algorithm/rs")

export default class RsAnalyzer {

    async Analyze(imageWrapper) {
        const inputArray = await imageWrapper.Image.flatten().array();
        const outputData = Analytics.calculateRS(inputArray, 128).toFixed(2); 
        const detectorName = "RS"
        const result = {
            Name: detectorName,
            Result: outputData + "  "
        };
        return result;
    }
}
