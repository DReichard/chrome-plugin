import ImagePipeline from '../core/ImagePipeline'
import ResNetAnalyzer from "../analyzers/ResNetAnalyzer";
import RsAnalyzer from "../analyzers/RsAnalyzer";
import ImageWrapper from "../core/ImageWrapper";

 
const url = './model.json';


const imagePipeline = new ImagePipeline();
const resNetAnalyzer = new ResNetAnalyzer(url);
const rsAnalyzer = new RsAnalyzer(); 
imagePipeline.RegisterAnalyzer(resNetAnalyzer);
imagePipeline.RegisterAnalyzer(rsAnalyzer);
imagePipeline.RegisterCallback(PostResponse);

var hookPage = chrome.extension.getBackgroundPage();
resNetAnalyzer.Initialize().then(() => {
    chrome.runtime.onConnect.addListener(function(port) {
        this.port = port;
        this.port.onMessage.addListener(ImageMessagePipeline);
        hookPage.console.log("Background listener online");
    });
});

async function ImageMessagePipeline(msg) {
    const image = await ImageWrapper.FromBase64StringAsync(msg.ImageDataUrl);
    imagePipeline.Analyze(image, msg.ImageHash);
}

function PostResponse(analysisResult, hash) {
    analysisResult.ImageHash = hash;
	port.postMessage(analysisResult);	
}