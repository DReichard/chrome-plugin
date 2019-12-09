class RsAnalyzer {
    async Analyze(imageWrapper) {
        const inputArray = await imageWrapper.Image.flatten().array();
        const outputData = Analytics.calculateRS(inputArray, imageSize).toFixed(2); 
        const detectorName = "RS"
        const result = {
            Name: detectorName,
            Result: outputData + "  "
        };
        return result;
    }
}