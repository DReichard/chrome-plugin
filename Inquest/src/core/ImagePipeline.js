
export default class ImagePipeline {

    constructor() {
        this._analyzers = [];
        this._callbacks = [];
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
