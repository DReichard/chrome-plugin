import ImagePipeline from '../core/ImagePipeline'
import ResNetAnalyzer from "../analyzers/ResNetAnalyzer";
import RsAnalyzer from "../analyzers/RsAnalyzer";
import ImageWrapper from "../core/ImageWrapper";

 
const url = './model.json';


const imagePipeline = new ImagePipeline();
const resNetAnalyzer = new ResNetAnalyzer(url, 0.5);
const rsAnalyzer = new RsAnalyzer(0.5); 
imagePipeline.RegisterAnalyzer(resNetAnalyzer);
imagePipeline.RegisterAnalyzer(rsAnalyzer);
imagePipeline.RegisterCallback(PostResponse);

const hookPage = chrome.extension.getBackgroundPage();
resNetAnalyzer.Initialize().then(() => {
    chrome.runtime.onConnect.addListener(function(port) {
        this.port = port;
        this.port.onMessage.addListener(ImageMessagePipeline);
        hookPage.console.log("Background listener online");
    });
});

async function ImageMessagePipeline(msg) {
    const images = await ImageWrapper.FromBase64StringAsync(msg.ImageDataUrl);
    images.forEach(p => {
        const msgIteration = {};
        Object.assign(msgIteration, msg);
        msgIteration.offsetX = p.offsetX;
        msgIteration.offsetY = p.offsetY;
        imagePipeline.Analyze(p, msgIteration);
    });
}

function PostResponse(analysisResult, msg) {
    analysisResult.ImageHash = msg.ImageHash;
    analysisResult.offsetX = msg.offsetX;
    analysisResult.offsetY = msg.offsetY;
	port.postMessage(analysisResult);	
}