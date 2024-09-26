/*
    Extracted from bg2 engine source code: https://github.com/ferserc1/bg2e-js.git
    file: bg2e/math/Mat3.js
 */

import { NumericArray } from "./constants";
import Vec from "./Vec";
import { isZero, equals } from "./functions";

export default class Mat3 extends NumericArray {
    constructor() {
        if (arguments.length === 9) {
            super(arguments);
        }
        else if (arguments.length === 1 && arguments[0].length === 9) {
            super(arguments[0]);
        }
        else if (arguments.length === 0) {
            super([0,0,0,0,0,0,0,0,0]);
        }
        else {
            throw new Error(`Invalid parameter size in Mat3 constructor`);
        }
    }

    identity() {
        this[0] = 1; this[1] = 0; this[2] = 0;
        this[3] = 0; this[4] = 1; this[5] = 0;
        this[6] = 0; this[7] = 0; this[8] = 1;
        return this;
    }

    zero() {
        this[0] = 0; this[1] = 0; this[2] = 0;
        this[3] = 0; this[4] = 0; this[5] = 0;
        this[6] = 0; this[7] = 0; this[8] = 0;
        return this;
    }

    row(i) {
        return new Vec(
            this[i * 3], 
            this[i * 3 + 1],
            this[ i* 3 + 2]);
    }

    setRow(i, a, y = null, z = null) {
        if (a?.length>=3) {
            this[i * 3]      = a[0];
            this[i * 3 + 1]  = a[1];
            this[i * 3 + 2]  = a[2];
        }
        else if (typeof(a) === "number" && 
            typeof(y) === "number" && 
            typeof(z) === "number"
        ) {
            this[i * 3]      = a;
            this[i * 3 + 1]  = y;
            this[i * 3 + 2]  = z;
        }
        else {
            throw new Error(`Invalid parameter setting matrix row`);
        }
        return this;
    }

    col(i) {
        return new Vec(
            this[i],
            this[i + 3],
            this[i + 3 * 2]
        )
    }

    setCol(i, a, y = null, z = null) {
        if (a?.length>=3) {
            this[i]         = a[0];
            this[i + 3]     = a[1];
            this[i + 3 * 2] = a[2];
        }
        else if (typeof(a) === "number" && 
            typeof(y) === "number" && 
            typeof(z) === "number"
        ) {
            this[i]         = a;
            this[i + 3]     = y;
            this[i + 3 * 2] = z;
        }
        else {
            throw new Error(`Invalid parameter setting matrix row`);
        }
        return this;
    }

    assign(m) {
        if (m.length === 9) {
            this[0] = m[0]; this[1] = m[1]; this[2] = m[2];
			this[3] = m[3]; this[4] = m[4]; this[5] = m[5];
			this[6] = m[6]; this[7] = m[7]; this[8] = m[8];
        }
        else if (m.length === 16) {
            this[0] = m[0]; this[1] = m[1]; this[2] = m[2];
			this[3] = m[4]; this[4] = m[5]; this[5] = m[6];
			this[6] = m[8]; this[7] = m[9]; this[8] = m[10];
        }
        else {
            throw new Error(`Invalid plarameter setting matrix data`);
        }
        return this;
    }

    setScale(x,y,z) { 
		const rx = (new Vec(this[0], this[3], this[6])).normalize().scale(x);
		const ry = (new Vec(this[1], this[4], this[7])).normalize().scale(y);
		const rz = (new Vec(this[2], this[5], this[8])).normalize().scale(z);
		this[0] = rx.x; this[3] = rx.y; this[6] = rx.z;
		this[1] = ry.x; this[4] = ry.y; this[7] = ry.z;
		this[2] = rz.x; this[5] = rz.y; this[8] = rz.z;
		return this;
	}

    traspose() {
        const m3 = this[3];  // 0, 1, 2
        const m7 = this[7];  // 3, 4, 5
        const m6 = this[6];  // 6, 7, 8
        this[3] = this[1];
        this[6] = this[2];
        this[7] = this[5];
        this[1] = m3;
        this[2] = m6;
        this[5] = m7;
        return this;
    }

    mult(a) {
        if (typeof(a) === "number") {
            this[0] *= a; this[1] *= a; this[2] *= a;
            this[3] *= a; this[4] *= a; this[5] *= a;
            this[6] *= a; this[7] *= a; this[8] *= a;
        }
        else if (a instanceof NumericArray && a.length === 9) {
            const r0 = this.row(0);
            const r1 = this.row(1);
            const r2 = this.row(2);
            const c0 = a.col(0);
            const c1 = a.col(1);
            const c2 = a.col(2);
            
            this[0] = Vec.Dot(r0,c0); this[1] = Vec.Dot(r0,c1); this[2] = Vec.Dot(r0,c2);
            this[3] = Vec.Dot(r1,c0); this[4] = Vec.Dot(r1,c1); this[5] = Vec.Dot(r1,c2);
            this[6] = Vec.Dot(r2,c0); this[7] = Vec.Dot(r2,c1); this[8] = Vec.Dot(r2,c2);
        }
        else {
            throw new Error(`Invalid parameter in Mat3.mult()`);
        }
        return this;
    }

    multVector(v) {
        if (v.length === 2 || v.length === 3) {
            const x = v[0];
            const y = v[1];
            const z = v.length === 2 ? 1 : v[2];
        
            return new Vec(	this[0] * x + this[3] * y + this[6] * z,
                            this[1] * x + this[4] * y + this[7] * z,
                            this[2] * x + this[5] * y + this[8] * z);
        }
        else {
            throw new Error(`Invalid parameter in Mat3.multVector()`);
        }
    }

    toString() {
        return  `[ ${this[0]}, ${this[1]}, ${this[2]}\n` +
                `  ${this[3]}, ${this[4]}, ${this[5]}\n` +
                `  ${this[6]}, ${this[7]}, ${this[8]} ]`;
    }

    static MakeIdentity() {
        const m = new Mat3();
        return m.identity();
    }

    static MakeZero() {
        const m = new Mat3();
        return m.zero();
    }

    static MakeWithQuaternion(q) {
        const m = Mat3.MakeIdentity();
        
        m.setRow(0, new Vec( 1  - 2 * q[1] * q[1] - 2 * q[2] * q[2], 2 * q[0] * q[1] - 2 * q[2] * q[3], 2 * q[0] * q[2] + 2 * q[1] * q[3]));
        m.setRow(1, new Vec( 2 * q[0] * q[1] + 2 * q[2] * q[3], 1  - 2.0 * q[0] * q[0] - 2 * q[2] * q[2], 2 * q[1] * q[2] - 2 * q[0] * q[3]));
        m.setRow(2, new Vec( 2 * q[0] * q[2] - 2 * q[1] * q[3], 2 * q[1] * q[2] + 2 * q[0] * q[3] , 1 - 2 * q[0] * q[0] - 2 * q[1] * q[1]));

        return m;
    }

    static IsZero(m) {
        return	isZero(v[0]) && isZero(v[1]) && isZero(v[2]) &&
                isZero(v[3]) && isZero(v[4]) && isZero(v[5]) &&
                isZero(v[6]) && isZero(v[7]) && isZero(v[8]);
    }
    
    static IsIdentity(m) {
        return	equals(v[0], 1) && isZero(v[1]) && isZero(v[2]) &&
                isZero(v[3]) && equals(v[4], 1) && isZero(v[5]) &&
                isZero(v[6]) && isZero(v[7]) && equals(v[8], 1);
    }

    static GetScale(m) {
        return new Vec(
            Vec.Magnitude(new Vec(m[0], m[3], m[6])),
            Vec.Magnitude(new Vec(m[1], m[4], m[7])),
            Vec.Magnitude(new Vec(m[2], m[5], m[8]))
        );
    }

    static Equals(a,b) {
        return	equals(a[0], b[0]) && equals(a[1], b[1])  && equals(a[2], b[2]) &&
                equals(a[3], b[3]) && equals(a[4], b[4])  && equals(a[5], b[5]) &&
                equals(a[6], b[6]) && equals(a[7], b[7])  && equals(a[8], b[8]);
    }

    static IsNaN(m) {
        return	isNaN(m[0]) || isNaN(m[1]) || isNaN(m[2]) &&
                isNaN(m[3]) || isNaN(m[4]) || isNaN(m[5]) &&
                isNaN(m[6]) || isNaN(m[7]) || isNaN(m[8]);
    }
};
