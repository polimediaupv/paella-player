/*
    Extracted from bg2 engine source code: https://github.com/ferserc1/bg2e-js.git
    file: bg2e/math/constants.js
 */
export const Axis = {
	NONE: 0,
	X: 1,
	Y: 2,
	Z: 3,
    name: (axis) => {
        switch (axis) {
        case Axis.NONE:
            return "NONE";
        case Axis.X:
            return "X";
        case Axis.Y:
            return "Y";
        case Axis.Z:
            return "Z";
        case Axis.W:
            return "W";
        default:
            return "UNKNOWN"
        };
    }
};

export const PI = 3.141592653589793;
export const DEG_TO_RAD = 0.01745329251994;
export const RAD_TO_DEG = 57.29577951308233;
export const PI_2 = 1.5707963267948966;
export const PI_4 = 0.785398163397448;
export const PI_8 = 0.392699081698724;
export const TWO_PI = 6.283185307179586;
export const EPSILON = 0.0000001;

// Default array: 32 bits
export const NumericArray = Float32Array;
export const NumericArrayHighP = Float64Array;
export const FLOAT_MAX = 3.402823e38;
