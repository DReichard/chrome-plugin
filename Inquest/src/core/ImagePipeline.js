class ImagePipeline {
    _analyzers;
    _callbacks;

    constructor() {
        this._analyzers = [];
        this._callbacks = [];
    }

    Analyze(image) {

        const batched = image.reshape([1, 1, imageSize, imageSize]);

        this._analyzers.forEach(analyzer => {
            const analysisResult = analyzer.Analyze(batched);
            this._callbacks.forEach(callbackFunction => {
                callbackFunction(analysisResult);
            });
        });
    }

    RegisterCallback(callback) {
        this._callbacks.push(callback);
    }

    DeregisterCallback() {
        this._callbacks = this._callbacks.filter(p => p !== callback);
    }

    RegisterAnalyzer(analyzer) {
        this._analyzers.push(analyzer);
    }

    DeregisterAnalyzer(analyzer) {
        this._analyzers = this._analyzers.filter(p => p !== analyzer);
    }
}