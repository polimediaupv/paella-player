/*
    Extracted from bg2 engine source code: https://github.com/ferserc1/bg2e-js.git
    file: bg2e/math/Vec.js
 */

import { NumericArray } from "./constants";
import { isZero, equals } from "./functions";

const checkEqualLength = (v1,v2) => {
    if (v1.length!=v2.length) throw new Error(`Invalid vector length in operation`);
}

export default class Vec extends NumericArray {
    constructor() {
        switch (arguments.length) {
        case 0:
            super([0, 0]);
            break;
        case 1:
            if (arguments[0].length>1 && arguments[0].length<5)
            {
                super(arguments[0]);
            }
            break;
        case 2:
            if (arguments[0].length === 2 && typeof(arguments[1]) === "number"
            ) {
                super([ arguments[0][0], arguments[0][1], arguments[1]]);
            }
            else if (arguments[0].length === 3 &&
                typeof(arguments[1]) === "number"
            ) {
                super([ arguments[0][0], arguments[0][1], arguments[0][2], arguments[1]]);
            }
            else if (typeof(arguments[0]) === "number" &&
                typeof(arguments[1]) === "number"
            ) {
                super([arguments[0],arguments[1]]);
            }
            break;
        case 3:
            if (arguments[0].length === 2 &&
                typeof(arguments[1]) === "number" && typeof(arguments[2]) === "number"
            ) {
                super([ arguments[0][0], arguments[0][1], arguments[1], arguments[2]])
            }
            else if (typeof(arguments[0]) === "number" &&
                typeof(arguments[1]) === "number" &&
                typeof(arguments[2]) === "number"
            ) {
                super([arguments[0],arguments[1],arguments[2]]);
            }
            break;
        case 4:
            super([arguments[0],arguments[1],arguments[2],arguments[3]]);
            break;
        default:
            throw new Error(`Invalid parameters in Vec constructor`);
        }
    }

    normalize() {
        const m = Vec.Magnitude(this);
        switch (this.length) {
        case 4:
            this[3] = this[3] / m;
        case 3:
            this[2] = this[2] / m;
        case 2:
            this[1] = this[1] / m;            
            this[0] = this[0] / m;
            break;
        default:
            throw new Error(`Invalid vector size: ${ this.length }`);
        }
        return this;
    }

    assign(src) {
        checkEqualLength(this,src);
        switch (this.length) {
        case 4:
            this[3] = src[3];
        case 3:
            this[2] = src[2];
        case 2:
            this[1] = src[1];
            this[0] = src[0];
            break;
        default:
            throw new Error(`Invalid vector size: ${ this.length }`);
        }
    }

    set(x, y, z = null, w = null) {
        if (this.length === 2) {
            this[0] = x;
            this[1] = y;
        }
        else if (this.length === 3 && z !== null) {
            this[0] = x;
            this[1] = y;
            this[2] = z;
        }
        else if (this.length === 4 && w !== null) {
            this[0] = x;
            this[1] = y;
            this[2] = z;
            this[3] = w;
        }
        else {
            throw new Error(`Invalid vector size: ${ this.length }. Trying to set x=${x}, y=${y}, z=${z}, w=${w}`);
        }
    }

    scale(s) {
        switch (this.length) {
        case 4:
            this[3] = this[3] * s;
        case 3:
            this[2] = this[2] * s;
        case 2:
            this[1] = this[1] * s;
            this[0] = this[0] * s;
            break;
        default:
            throw new Error(`Invalid vector size: ${ v.length }`);
        }
        return this;
    }

    get x() {
        return this[0];
    }

    get y() {
        return this[1];
    }

    get z() {
        return this[2];
    }

    get w() {
        return this[3];
    }

    set x(v) {
        this[0] = v;
        return this;
    }

    set y(v) {
        this[1] = v;
        return this;
    }

    set z(v) {
        this[2] = v;
        return this;
    }

    set w(v) {
        this[3] = v;
        return this;
    }

    get r() {
        return this[0];
    }

    get g() {
        return this[1];
    }

    get b() {
        return this[2];
    }

    get a() {
        return this[3];
    }

    set r(v) {
        this[0] = v;
        return this;
    }

    set g(v) {
        this[1] = v;
        return this;
    }

    set b(v) {
        this[2] = v;
        return this;
    }

    set a(v) {
        this[3] = v;
        return this;
    }

    get width() {
        switch (this.length) {
        case 2:
            return this[0];
        case 4:
            return this[2];
        default:
            throw new Error("Vec.width function used on non size or viewport vectors (two or four elements)");
        }
    }

    get height() {
        switch (this.length) {
            case 2:
                return this[1];
            case 4:
                return this[3];
            default:
                throw new Error("Vec.width function used on non size or viewport vectors (two or four elements)");
            }
    }

    set width(w) {
        this[0] = w;
        return this;
    }

    set height(h) {
        this[1] = h;
        return this;
    }
    
    get xy() {
        switch (this.length) {
        case 2:
            return new Vec(this);
        case 3:
        case 4:
            return new Vec(this[0], this[1]);
        default:
            throw new Error(`Invalid vector size: ${ this.length }`);
        }
    }

    get xz() {
        switch (this.length) {
        case 3:
        case 4:
            return new Vec(this[0], this[2]);
        case 2:
        default:
            throw new Error(`Invalid vector size: ${ this.length }`);
        }
    }

    get yz() {
        switch (this.length) {
        case 3:
        case 4:
            return new Vec(this[1], this[2]);
        case 2:
        default:
            throw new Error(`Invalid vector size: ${ this.length }`);
        }
    }

    set xy(v) {
        this[0] = v[0];
        this[1] = v[1];
        return this;
    }

    set xz(v) {
        if (this.length<3) {
            throw new Error('Invalid vector size');
        }
        this[0] = v[0];
        this[2] = v[1];
        return this;
    }

    set yz(v) {
        if (this.length<3) {
            throw new Error('Invalid vector size');
        }
        this[1] = v[0];
        this[2] = v[1];
        return this;
    }

    get xyz() {
        if (this.length < 3) {
            throw new Error(`Invalid vector size: ${ this.length }`);
        }
        return new Vec(this[0], this[1], this[2]);
    }

    set xyz(v) {
        if (v.length<3 || this.length<3) {
            throw new Error(`Invalid vector size to set: l;${ this.length }, r:${v.length}`);
        }
        this[0] = v[0];
        this[1] = v[1];
        this[2] = v[2];
        return this;
    }

    // Copy operator
    get xyzw() {
        if (this.length < 4) {
            throw new Error(`Invalid vector size: ${ this.length }, 4 required`);
        }
        return new Vec(this[0], this[1], this[2], this[3]);
    }

    // Assign operator
    set xyzw(v) {
        if (this.length < 4 || v.length<4) {
            throw new Error(`Invalid vector size to set: l;${ this.length }, r:${v.length}`);
        }
        this[0] = v[0];
        this[1] = v[1];
        this[2] = v[2];
        this[3] = v[3];
        return this;
    }

    get rgb() {
        if (this.length < 3) {
            throw new Error(`Invalid vector size: ${this.length}, but at least 3 required`);
        }
        return new Vec(this[0],this[1],this[2]);
    }

    set rgb(v) {
        if (v.length<3 || this.length<3) {
            throw new Error(`Invalid vector size to set: l;${ this.length }, r:${v.length}`);
        }
        this[0] = v[0];
        this[1] = v[1];
        this[2] = v[2];
        return this;
    }

    get rg() {
        if (v.length<3 || this.length<3) {
            throw new Error(`Invalid vector size to set: l;${ this.length }, r:${v.length}`);
        }
        return new Vec(this[0], this[1]);
    }

    get gb() {
        if (v.length<3 || this.length<3) {
            throw new Error(`Invalid vector size to set: l;${ this.length }, r:${v.length}`);
        }
        return new Vec(this[1], this[2]);
    }

    get rb() {
        if (v.length<3 || this.length<3) {
            throw new Error(`Invalid vector size to set: l;${ this.length }, r:${v.length}`);
        }
        return new Vec(this[0], this[2]);
    }

    get hexColor() {
        const r = Math.round(this.r * 255);
        const g = Math.round(this.g * 255);
        const b = Math.round(this.b * 255);
        const hex = (color) => color.toString(16).toUpperCase();
        return `#${ hex(r) }${ hex(g) }${ hex(b) }`;
    }

    get cssColor() {
        // Return rgb(x,y,z) or rgba(x,y,z,w);
    }

    get aspectRatio() {
        return this.width / this.height;
    }

    toString() {
        switch (this.length) {
        case 2:
            return `[${this[0]}, ${this[1]}]`;
        case 3:
            return `[${this[0]}, ${this[1]}, ${this[2]}]`;
        case 4:
            return `[${this[0]}, ${this[1]}, ${this[2]}, ${this[5]}]`;
        }
    }

    static CheckEqualLength(v1,v2) {
        checkEqualLength(v1,v2);
    }

    static Max(v1,v2) {
        checkEqualLength(v1,v2);
        switch (v1.length) {
        case 2:
            return new Vec([
                v1[0]>v2[0] ? v1[0] : v2[0],
                v1[1]>v2[1] ? v1[1] : v2[1]
            ]);
        case 3:
            return new Vec([
                v1[0]>v2[0] ? v1[0] : v2[0],
                v1[1]>v2[1] ? v1[1] : v2[1],
                v1[2]>v2[2] ? v1[2] : v2[2]
            ]);
        case 4:
            return new Vec([
                v1[0]>v2[0] ? v1[0] : v2[0],
                v1[1]>v2[1] ? v1[1] : v2[1],
                v1[2]>v2[2] ? v1[2] : v2[2],
                v1[3]>v2[3] ? v1[3] : v2[3]
            ]);
        default:
            throw new Error(`Invalid vector size: ${ v1.length }`);
        }
    }

    static Min(v1,v2) {
        checkEqualLength(v1,v2);
        switch (v1.length) {
        case 2:
            return new Vec([
                v1[0]<v2[0] ? v1[0] : v2[0],
                v1[1]<v2[1] ? v1[1] : v2[1]
            ]);
        case 3:
            return new Vec([
                v1[0]<v2[0] ? v1[0] : v2[0],
                v1[1]<v2[1] ? v1[1] : v2[1],
                v1[2]<v2[2] ? v1[2] : v2[2]
            ]);
        case 4:
            return new Vec([
                v1[0]<v2[0] ? v1[0] : v2[0],
                v1[1]<v2[1] ? v1[1] : v2[1],
                v1[2]<v2[2] ? v1[2] : v2[2],
                v1[3]<v2[3] ? v1[3] : v2[3]
            ]);
        default:
            throw new Error(`Invalid vector size: ${ v1.length }`);
        }
    }

    static Add(v1,v2) {
        checkEqualLength(v1,v2);
        switch (v1.length) {
        case 2:
            return new Vec([
                v1[0] + v2[0],
                v1[1] + v2[1]
            ]);
        case 3:
            return new Vec([
                v1[0] + v2[0],
                v1[1] + v2[1],
                v1[2] + v2[2]
            ]);
        case 4:
            return new Vec([
                v1[0] + v2[0],
                v1[1] + v2[1],
                v1[2] + v2[2],
                v1[3] + v2[3]
            ]);
        default:
            throw new Error(`Invalid vector size: ${ v1.length }`);
        }
    }

    static Sub(v1,v2) {
        checkEqualLength(v1,v2);
        switch (v1.length) {
        case 2:
            return new Vec([
                v1[0] - v2[0],
                v1[1] - v2[1]
            ]);
        case 3:
            return new Vec([
                v1[0] - v2[0],
                v1[1] - v2[1],
                v1[2] - v2[2]
            ]);
        case 4:
            return new Vec([
                v1[0] - v2[0],
                v1[1] - v2[1],
                v1[2] - v2[2],
                v1[3] - v2[3]
            ]);
        default:
            throw new Error(`Invalid vector size: ${ v1.length }`);
        }
    }

    static Magnitude(v) {
        switch (v.length) {
        case 2:
            return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        case 3:
            return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        case 4:
            return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3]);
        default:
            throw new Error(`Invalid vector size: ${ v.length }`);
        }
    }

    static Distance(v1,v2) {
        checkEqualLength(v1,v2);
        return Vec.Magnitude(Vec.Sub(v1,v2));
    }

    static Dot(v1,v2) {
        checkEqualLength(v1,v2);
        switch (v1.length) {
        case 2:
            return v1[0] * v2[0] + v1[1] * v2[1];
        case 3:
            return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
        case 4:
            return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2] + v1[3] * v2[3];
        default:
            throw new Error(`Invalid vector size: ${ v1.length }`);
        }
    }

    static Cross(v1,v2) {
        checkEqualLength(v1,v2);
        switch (v1.length) {
        case 2:
            return v1[0] * v2[1] - v1[1] - v2[0];
        case 3:
            return new Vec([
                v1[1] * v2[2] - v1[2] * v2[1],
                v1[2] * v2[0] - v1[0] * v2[2],
                v1[0] * v2[1] - v1[1] * v2[0],
            ]);
        default:
            throw new Error(`Invalid vector size for cross product: ${ v1.length }`);
        }
    }

    static Normalized(v) {
        const m = Vec.Magnitude(v);
        switch (v.length) {
        case 2:
            return new Vec([ v[0] / m, v[1] / m ]);
        case 3:
            return new Vec([ v[0] / m, v[1] / m, v[2] / m ]);
        case 4:
            return new Vec([ v[0] / m, v[1] / m, v[2] / m, v[3] / m ])
        default:
            throw new Error(`Invalid vector size: ${ v.length }`);
        }
    }

    static Mult(v,s) {
        switch (v.length) {
        case 2:
            return new Vec([ v[0] * s, v[1] * s ]);
        case 3:
            return new Vec([ v[0] * s, v[1] * s, v[2] * s ]);
        case 4:
            return new Vec([ v[0] * s, v[1] * s, v[2] * s, v[3] * s ]);
        default:
            throw new Error(`Invalid vector size: ${ v.length }`);
        }
    }

    static Div(v,s) {
        switch (v.length) {
        case 2:
            return new Vec([ v[0] / s, v[1] / s ]);
        case 3:
            return new Vec([ v[0] / s, v[1] / s, v[2] / s ]);
        case 4:
            return new Vec([ v[0] / s, v[1] / s, v[2] / s, v[3] / s ]);
        default:
            throw new Error(`Invalid vector size: ${ v.length }`);
        }
    }

    static Equals(v1,v2) {
        if (v1.length != v2.length) {
            return false;
        }
        else {
            switch (v1.length) {
            case 2:
                return  equals(v1[0], v2[0]) &&
                        equals(v1[1], v2[1]);
            case 3:
                return  equals(v1[0], v2[0]) &&
                        equals(v1[1], v2[1]) &&
                        equals(v1[2], v2[2]);
            case 4:
                return  equals(v1[0], v2[0]) &&
                        equals(v1[1], v2[1]) &&
                        equals(v1[2], v2[2]) &&
                        equals(v1[3], v2[3]);
            default:
                throw new Error(`Invalid vector size: ${ v1.length }`);
            }
        }
    }

    static IsZero(v) {
        switch (v.length) {
        case 2:
            return isZero(v[0]) || isZero(v[1]);
        case 3:
            return isZero(v[0]) || isZero(v[1]) || isZero(v[2]);
        case 4:
            return isZero(v[0]) || isZero(v[1]) || isZero(v[2]) || isZero(v[3]);
        default:
            throw new Error(`Invalid vector size: ${ v.length }`);
        }
    }

    static IsNaN(v) {
        switch (v.length) {
        case 2:
            return isNaN(v[0]) || isNaN(v[1]);
        case 3:
            return isNaN(v[0]) || isNaN(v[1]) || isNaN(v[2]);
        case 4:
            return isNaN(v[0]) || isNaN(v[1]) || isNaN(v[2]) || isNaN(v[3]);
        default:
            throw new Error(`Invalid vector size: ${ v.length }`);
        }
    }

    /////// Constructors
    static Vec2() {
        return new Vec(0,0);
    }

    static Vec3() {
        return new Vec(0,0,0);
    }

    static Vec4() {
        return new Vec(0,0,0,0);
    }
}
    