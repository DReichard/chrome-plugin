import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function onRsThresholdUpdate(event) {
    chrome.storage.sync.set({"RsThreshold": event.target.valueAsNumber}, function() {
        document.getElementById("rsThresholdDisplay").innerText = event.target.valueAsNumber; 
    });
}
function onResNetThresholdUpdate(event) {
    chrome.storage.sync.set({"ResNetThreshold": event.target.valueAsNumber}, function() {
        document.getElementById("resNetThresholdDisplay").innerText = event.target.valueAsNumber; 
    });
}
function onEnableRsSwitch(event) {
    chrome.storage.sync.set({"EnableRs": event.target.checked}, function() {
    });
}
function onEnableResNetSwitch(event) {
    chrome.storage.sync.set({"EnableResNet": event.target.checked}, function() {
    });
}
function onShowAllReticlesSwitch(event) {
    chrome.storage.sync.set({"ShowAllReticles": event.target.checked}, function() {
    });
}

//setup listeners
document.getElementById("rsThreshold").addEventListener("input", onRsThresholdUpdate);
document.getElementById("rsThreshold").addEventListener("change", onRsThresholdUpdate);

document.getElementById("resNetThreshold").addEventListener("input", onResNetThresholdUpdate);
document.getElementById("resNetThreshold").addEventListener("change", onResNetThresholdUpdate);

document.getElementById("enableRsSwitch").addEventListener("change", onEnableRsSwitch);
document.getElementById("enableResNetSwitch").addEventListener("change", onEnableResNetSwitch);
document.getElementById("showAllReticlesSwitch").addEventListener("change", onShowAllReticlesSwitch);

//init ranges from storage
chrome.storage.sync.get("RsThreshold", function(result) {
    document.getElementById("rsThreshold").value = result.RsThreshold; 
    document.getElementById("rsThresholdDisplay").innerText = result.RsThreshold;
});
chrome.storage.sync.get("ResNetThreshold", function(result) {
    document.getElementById("resNetThreshold").value = result.ResNetThreshold;
    document.getElementById("resNetThresholdDisplay").innerText = result.ResNetThreshold;
});
//init switches from storage
chrome.storage.sync.get("EnableRs", function(result) {
    document.getElementById("enableRsSwitch").checked = result.EnableRs;
});
chrome.storage.sync.get("EnableResNet", function(result) {
    document.getElementById("enableResNetSwitch").checked = result.EnableResNet;
});
chrome.storage.sync.get("ShowAllReticles", function(result) {
    document.getElementById("showAllReticlesSwitch").checked = result.ShowAllReticles;
});