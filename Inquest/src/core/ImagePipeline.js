
export default class ImagePipeline {

    constructor() {
        this._analyzers = new Set();
        this._callbacks = new Set();
    }

    Analyze(image, state) {
        this._analyzers.forEach(async analyzer => {
            const analysisResult = await analyzer.Analyze(image);
            this._callbacks.forEach(callbackFunction => {
                callbackFunction(analysisResult, state);
            });
        });
    }

    RegisterCallback(callback) {
        this._callbacks.add(callback);
    }

    DeregisterCallback(callback) {
        this._callbacks.delete(callback);
    }

    RegisterAnalyzer(analyzer) {
        this._analyzers.add(analyzer);
    }

    DeregisterAnalyzer(analyzer) {
        this._analyzers.delete(analyzer);
    }
}
