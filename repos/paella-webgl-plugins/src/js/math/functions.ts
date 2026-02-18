/*
    Extracted from bg2 engine source code: https://github.com/ferserc1/bg2e-js.git
    file: bg2e/math/functions.js
 */

import {
    EPSILON,
    DEG_TO_RAD,
    RAD_TO_DEG
} from './constants.js';

let s_bg_math_seed: number = Date.now();

export const checkPowerOfTwo = (n: number): boolean => {
    if (typeof n !== 'number') {
        return false;
    }
    else {
        return n !== 0 && (n & (n - 1)) === 0;
    }  
}

export const checkZero = (v: number): number => {
    return v>-EPSILON && v<EPSILON ? 0:v;
}

export const isZero = (v: number): boolean => {
    return checkZero(v) === 0;
}

export const equals = (a: number, b: number): boolean => {
    return Math.abs(a - b) < EPSILON;
}

export const degreesToRadians = (d: number): number => {
    return Math.fround(checkZero(d * DEG_TO_RAD));
}

export const radiansToDegrees = (r: number): number => {
    return Math.fround(checkZero(r * RAD_TO_DEG));
}

export const sin = (val: number): number => {
    return Math.fround(checkZero(Math.sin(val)));
}

export const cos = (val: number): number => {
    return Math.fround(checkZero(Math.cos(val)));
}

export const tan = (val: number): number => {
    return Math.fround(checkZero(Math.tan(val)));
}

export const cotan = (val: number): number => {
    return Math.fround(checkZero(1.0 / tan(val)));
}

export const atan = (val: number): number => {
    return Math.fround(checkZero(Math.atan(val)));
}

export const atan2 = (i: number, j: number): number => {
    return Math.fround(checkZero(Math.atan2(i, j)));
}

export const random = (): number => {
    return Math.random();
}

export const seededRandom = (): number => {
    const max = 1;
    const min = 0;
 
    s_bg_math_seed = (s_bg_math_seed * 9301 + 49297) % 233280;
    const rnd = s_bg_math_seed / 233280;
 
    return min + rnd * (max - min);
}

export const max = (a: number, b: number): number => {
    return Math.fround(Math.max(a,b));
}

export const min = (a: number, b: number): number => {
    return Math.fround(Math.min(a,b));
}

export const abs = (val: number): number => {
    return Math.fround(Math.abs(val));
}

export const sqrt = (val: number): number => {
    return Math.fround(Math.sqrt(val));
}

export const lerp = (from: number, to: number, t: number): number => {
    return Math.fround((1.0 - t) * from + t * to);
}

export const square = (n: number): number => {
    return Math.fround(n * n);
}
