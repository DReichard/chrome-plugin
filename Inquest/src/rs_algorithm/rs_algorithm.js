
module.exports = { rsDetect };

function getGroup(p, mask){
	let pf = [];
	for (let i = 0; i < mask.length; i++) {
		if (mask[i] == 1){
			pf[i] = flip(p[i]);
		} else if (mask[i] == -1){
			pf[i] = iflip(p[i]);
		} else {
			pf[i] = p[i];
		}
	}
	const d1 = pixelDisc(p);
	const d2 = pixelDisc(pf);
	if (d1 == d2) {
		return 'U';
	}
	if (d1 < d2) {
		return 'R';
	}
	return 'S';
}

function lsbFlip(p){
	const ret = [];
	for (let i = 0; i < p.length; i++) {
		ret[i] = p[i] ^ 1;
	}

	return ret;
}

function pixelDisc(p){
	let sum = 0;
	for (let i = 0; i < p.length - 1; i++) {
		sum += Math.abs(p[i + 1] - p[i]);
	}
	return sum;
}

function flip(val){
	if(val & 1){
		return val - 1;
	}
	return val + 1;
}

function iflip(val){
	if(val & 1){
		return val + 1;
	}
	return val - 1;
}

function solve(gc){
	const d0  = gc.R   - gc.S;
	const dm0 = gc.mR  - gc.mS;
	const d1  = gc.iR  - gc.iS;
	const dm1 = gc.imR - gc.imS;
	const a = 2 * (d1 + d0);
	let b = dm0 - dm1 - d1 - d0 * 3;
	const c = d0 - dm0;
    let D = b * b - 4 * a * c;
    
	if (D < 0) return null;
	b *= -1;

    if (D === 0) return (b / 2 / a) / (b / 2 / a - 0.5);
    
	D = Math.sqrt(D);
	const x1 = (b + D) / 2 / a;
	const x2 = (b - D) / 2 / a;

	if (Math.abs(x1) < Math.abs(x2)) return x1 / (x1 - 0.5);

	return x2 / (x2 - 0.5);
}

function rsDetect(data, width){
	const mask =  [1, 0, 0, 1];
	const bw = 2;
	const bh = 2;

	const imask = mask.map(function(x) {
        return x ? -x : 0;
    });
	// const height = data.length / 4 / width;
	const height = data.length / width;
	const blocksInRow = Math.floor(width / bw);
	const blocksInCol = Math.floor(height / bh);

	const gc = {'R': 0, 'S': 0, 'U': 0, 'mR': 0, 'mS': 0, 'mU': 0, 'iR': 0, 'iS': 0, 'iU': 0, 'imR': 0, 'imS': 0, 'imU': 0};

	for (let y = 0; y < blocksInCol; y++){
		for (let x = 0; x < blocksInRow; x++){

			let ch = [];

			for (let v = 0; v < bh; v++){
				for (let h = 0; h < bw; h++){
					// const offset = (width * (y * bh + v) + x * bw + h) * 4;
					const offset = width * (y * bh + v) + x * bw + h;
					ch.push(data[offset]);
				}
			}

			gc[getGroup(ch, mask)]++;
			gc['m' + getGroup(ch, imask)]++;

			ch = lsbFlip(ch);

			gc['i' + getGroup(ch, mask)]++;
			gc['im' + getGroup(ch, imask)]++;
		}
	}

	const result = solve(gc);
	if (result == null | result > 1) {
		return 1;
	}
    if (result < 0) {
        return 0;
    }
    return result;
}