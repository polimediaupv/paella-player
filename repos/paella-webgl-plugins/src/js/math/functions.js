/*
    Extracted from bg2 engine source code: https://github.com/ferserc1/bg2e-js.git
    file: bg2e/math/functions.js
 */

import {
    EPSILON,
    DEG_TO_RAD,
    RAD_TO_DEG
} from './constants.js';

let s_bg_math_seed = Date.now();

export const checkPowerOfTwo = (n) => {
    if (typeof n !== 'number') {
        return false;
    }
    else {
        return n && (n & (n - 1)) === 0;
    }  
}

export const checkZero = (v) => {
    return v>-EPSILON && v<EPSILON ? 0:v;
}

export const isZero = (v) => {
    return checkZero(v) === 0;
}

export const equals = (a,b) => {
    return Math.abs(a - b) < EPSILON;
}

export const degreesToRadians = (d) => {
    return Math.fround(checkZero(d * DEG_TO_RAD));
}

export const radiansToDegrees = (r) => {
    return Math.fround(checkZero(r * RAD_TO_DEG));
}

export const sin = (val) => {
    return Math.fround(checkZero(Math.sin(val)));
}

export const cos = (val) => {
    return Math.fround(checkZero(Math.cos(val)));
}

export const tan = (val) => {
    return Math.fround(checkZero(Math.tan(val)));
}

export const cotan = (val) => {
    return Math.fround(checkZero(1.0 / tan(val)));
}

export const atan = (val) => {
    return Math.fround(checkZero(Math.atan(val)));
}

export const atan2 = (i, j) => {
    return Math.fround(checkZero(Math.atan2f(i, j)));
}

export const random = () => {
    return Math.random();
}

export const seededRandom = () => {
    const max = 1;
    const min = 0;
 
    s_bg_math_seed = (s_bg_math_seed * 9301 + 49297) % 233280;
    const rnd = s_bg_math_seed / 233280;
 
    return min + rnd * (max - min);
}

export const max = (a,b) => {
    return Math.fround(Math.max(a,b));
}

export const min = (a,b) => {
    return Math.fround(Math.min(a,b));
}

export const abs = (val) => {
    return Math.fround(Math.abs(val));
}

export const sqrt = (val) => {
    return Math.fround(Math.sqrt(val));
}

export const lerp = (from, to, t) => {
    return Math.fround((1.0 - t) * from + t * to);
}

export const square = (n) => {
    return Math.fround(n * n);
}
