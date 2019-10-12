const RsFunctions = require("./rs_algorithm")

module.exports = { calculateRS };

function calculateRS(input, imageSize) {
    const result = RsFunctions.rsDetect(input, imageSize, null, null, null);
    return result.toFixed(3);
}