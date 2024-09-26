/*
    Extracted from bg2 engine source code: https://github.com/ferserc1/bg2e-js.git
    file: bg2e/math/Mat4.js
 */

import { NumericArray, PI } from "./constants";
import Vec from "./Vec";
import Mat3 from "./Mat3";
import { equals, isZero } from "./functions";

export default class Mat4 extends NumericArray {
    constructor() {
        const inMatrix = [
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ];

        // Create from matrix3
        if (arguments.length === 9) {
            inMatrix[0] = arguments[0]; 
            inMatrix[1] = arguments[1];
            inMatrix[2] = arguments[2];

            inMatrix[4] = arguments[3]; 
            inMatrix[5] = arguments[4];
            inMatrix[6] = arguments[5];

            inMatrix[8] = arguments[6]; 
            inMatrix[9] = arguments[7];
            inMatrix[10] = arguments[8];

            inMatrix[15] = 1;
        }
        else if (arguments.length === 1 && arguments[0].length === 9) {
            inMatrix[0]  = arguments[0][0]; 
            inMatrix[1]  = arguments[0][1];
            inMatrix[2]  = arguments[0][2];

            inMatrix[4]  = arguments[0][3]; 
            inMatrix[5]  = arguments[0][4];
            inMatrix[6]  = arguments[0][5];

            inMatrix[8]  = arguments[0][6]; 
            inMatrix[9]  = arguments[0][7];
            inMatrix[10] = arguments[0][8];

            inMatrix[15] = 1;
        }
        // Create from matrix4
        else if (arguments.length === 16) {
            inMatrix[0 ] = arguments[0];
            inMatrix[1 ] = arguments[1 ];
            inMatrix[2 ] = arguments[2 ];
            inMatrix[3 ] = arguments[3 ];

            inMatrix[4 ] = arguments[4 ];
            inMatrix[5 ] = arguments[5 ];
            inMatrix[6 ] = arguments[6 ];
            inMatrix[7 ] = arguments[7 ];

            inMatrix[8 ] = arguments[8 ];
            inMatrix[9 ] = arguments[9 ];
            inMatrix[10] = arguments[10];
            inMatrix[11] = arguments[11];

            inMatrix[12] = arguments[12];
            inMatrix[13] = arguments[13];
            inMatrix[14] = arguments[14];
            inMatrix[15] = arguments[15];
        }
        else if (arguments.length === 1 && arguments[0].length === 16) {
            inMatrix[0 ] = arguments[0][0];
            inMatrix[1 ] = arguments[0][1 ];
            inMatrix[2 ] = arguments[0][2 ];
            inMatrix[3 ] = arguments[0][3 ];

            inMatrix[4 ] = arguments[0][4 ];
            inMatrix[5 ] = arguments[0][5 ];
            inMatrix[6 ] = arguments[0][6 ];
            inMatrix[7 ] = arguments[0][7 ];

            inMatrix[8 ] = arguments[0][8 ];
            inMatrix[9 ] = arguments[0][9 ];
            inMatrix[10] = arguments[0][10];
            inMatrix[11] = arguments[0][11];

            inMatrix[12] = arguments[0][12];
            inMatrix[13] = arguments[0][13];
            inMatrix[14] = arguments[0][14];
            inMatrix[15] = arguments[0][15];
        }
        else if (arguments.length != 0) {
            throw new Error(`Invalid parameter size in Matrix3 constructor`);
        }

        super(inMatrix);
    }

    ////// Initializers
    identity() {
        this[0 ] = 1; this[1 ] = 0; this[2 ] = 0; this[3 ] = 0
        this[4 ] = 0; this[5 ] = 1; this[6 ] = 0; this[7 ] = 0
        this[8 ] = 0; this[9 ] = 0; this[10] = 1; this[11] = 0
        this[12] = 0; this[13] = 0; this[14] = 0; this[15] = 1
        return this;
    }

    zero() {
        this[ 0] = 0; this[ 1] = 0; this[ 2] = 0; this[ 3] = 0;
        this[ 4] = 0; this[ 5] = 0; this[ 6] = 0; this[ 7] = 0;
        this[ 8] = 0; this[ 9] = 0; this[10] = 0; this[11] = 0;
        this[12] = 0; this[13] = 0; this[14] = 0; this[15] = 0;
        return this;
    }

    perspective(fovy, aspect, nearPlane, farPlane) {
        let fovy2 = Math.tan(fovy * PI / 360.0) * nearPlane;
        let fovy2aspect = fovy2 * aspect;
        this.frustum(-fovy2aspect,fovy2aspect,-fovy2,fovy2,nearPlane,farPlane);
        return this;
    }

    frustum(left, right, bottom, top, nearPlane, farPlane) {
        let A = right - left;
        let B = top-bottom;
        let C = farPlane-nearPlane;
        
        this.setRow(0, new Vec(nearPlane*2.0/A,	0.0,	0.0,	0.0));
        this.setRow(1, new Vec(0.0,	nearPlane*2.0/B,	0.0,	0.0));
        this.setRow(2, new Vec((right+left)/A,	(top+bottom)/B,	-(farPlane+nearPlane)/C,	-1.0));
        this.setRow(3, new Vec(0.0,	0.0,	-(farPlane*nearPlane*2.0)/C,	0.0));
        
        return this;
    }

    ortho(left, right, bottom, top, nearPlane, farPlane) {
        let m = right-left;
        let l = top-bottom;
        let k = farPlane-nearPlane;;
        
        this[0] = 2/m; this[1] = 0;   this[2] = 0;     this[3] = 0;
        this[4] = 0;   this[5] = 2/l; this[6] = 0;     this[7] = 0;
        this[8] = 0;   this[9] = 0;   this[10] = -2/k; this[11]= 0;
        this[12]=-(left+right)/m; this[13] = -(top+bottom)/l; this[14] = -(farPlane+nearPlane)/k; this[15]=1;

        return this;
    }
        
    lookAt(p_eye, p_center, p_up) {
        this.identity();

        const y = new Vec(p_up);
        const z = Vec.Sub(p_eye,p_center);
        z.normalize();
        const x = Vec.Cross(y,z);
        x.normalize();
        y.normalize();

        this.m00 = x.x;
        this.m10 = x.y;
        this.m20 = x.z;
        this.m30 = -Vec.Dot(x, p_eye);
        this.m01 = y.x;
        this.m11 = y.y;
        this.m21 = y.z;
        this.m31 = -Vec.Dot(y, p_eye);
        this.m02 = z.x;
        this.m12 = z.y;
        this.m22 = z.z;
        this.m32 = -Vec.Dot(z, p_eye);
        this.m03 = 0;
        this.m13 = 0;
        this.m23 = 0;
        this.m33 = 1;
    
        return this;
    }




    ///// Setters and getters
    get m00() { return this[0]; }
    get m01() { return this[1]; }
    get m02() { return this[2]; }
    get m03() { return this[3]; }
    get m10() { return this[4]; }
    get m11() { return this[5]; }
    get m12() { return this[6]; }
    get m13() { return this[7]; }
    get m20() { return this[8]; }
    get m21() { return this[9]; }
    get m22() { return this[10]; }
    get m23() { return this[11]; }
    get m30() { return this[12]; }
    get m31() { return this[13]; }
    get m32() { return this[14]; }
    get m33() { return this[15]; }
    
    set m00(v) { this[0] = v; }
    set m01(v) { this[1] = v; }
    set m02(v) { this[2] = v; }
    set m03(v) { this[3] = v; }
    set m10(v) { this[4] = v; }
    set m11(v) { this[5] = v; }
    set m12(v) { this[6] = v; }
    set m13(v) { this[7] = v; }
    set m20(v) { this[8] = v; }
    set m21(v) { this[9] = v; }
    set m22(v) { this[10] = v; }
    set m23(v) { this[11] = v; }
    set m30(v) { this[12] = v; }
    set m31(v) { this[13] = v; }
    set m32(v) { this[14] = v; }
    set m33(v) { this[15] = v; }

    get mat3() {
        return new Mat3(this[0], this[1], this[ 2],
                        this[4], this[5], this[ 6],
                        this[8], this[9], this[10]);
    }

    get forwardVector() {
        return Mat4.TransformDirection(this, new Vec(0.0, 0.0, 1.0));
    }
    
    get rightVector() {
        return Mat4.TransformDirection(this, new Vec(1.0, 0.0, 0.0));
    }
    
    get upVector() {
        return Mat4.TransformDirection(this, new Vec(0.0, 1.0, 0.0));
    }
    
    get backwardVector() {
        return Mat4.TransformDirection(this, new Vec(0.0, 0.0, -1.0));
    }
    
    get leftVector() {
        return Mat4.TransformDirection(this, new Vec(-1.0, 0.0, 0.0));
    }
    
    get downVector() {
        return Mat4.TransformDirection(this, new Vec(0.0, -1.0, 0.0));
    }

    row(i) {
        return new Vec(
            this[i * 4], 
            this[i * 4 + 1],
            this[i * 4 + 2],
            this[i * 4 + 3]);
    }

    setRow(i, a, y = null, z = null, w = null) {
        if (a.length>=4) {
            this[i * 4]      = a[0];
            this[i * 4 + 1]  = a[1];
            this[i * 4 + 2]  = a[2];
            this[i * 4 + 3]  = a[3];
        }
        else if (typeof(a) === "number" && 
            typeof(y) === "number" && 
            typeof(z) === "number" &&
            typeof(w) === "number"
        ) {
            this[i * 4]      = a;
            this[i * 4 + 1]  = y;
            this[i * 4 + 2]  = z;
            this[i * 4 + 3]  = w;
        }
        else {
            throw new Error(`Invalid parameter setting matrix row`);
        }
        return this;
    }

    col(i) {
        return new Vec(
            this[i],
            this[i + 4],
            this[i + 4 * 2],
            this[i + 4 * 3]
        )
    }

    setCol(i, a, y = null, z = null, w = null) {
        if (a.length>=4) {
            this[i]         = a[0];
            this[i + 4]     = a[1];
            this[i + 4 * 2] = a[2];
            this[i + 4 * 3] = a[3];
        }
        else if (typeof(a) === "number" && 
            typeof(y) === "number" && 
            typeof(z) === "number" &&
            typeof(w) === "number"
        ) {
            this[i]         = a;
            this[i + 4]     = y;
            this[i + 4 * 2] = z;
            this[i + 4 * 3] = w;
        }
        else {
            throw new Error(`Invalid parameter setting matrix row`);
        }
        return this;
    }

    assign(a) {
        if (a.length==9) {
            this[0]  = a[0]; this[1]  = a[1]; this[2]  = a[2]; this[3]  = 0;
            this[4]  = a[3]; this[5]  = a[4]; this[6]  = a[5]; this[7]  = 0;
            this[8]  = a[6]; this[9]  = a[7]; this[10] = a[8]; this[11] = 0;
            this[12] = 0;	 this[13] = 0;	  this[14] = 0;	   this[15] = 1;
        }
        else if (a.length==16) {
            this[0]  = a[0];  this[1]  = a[1];  this[2]  = a[2];  this[3]  = a[3];
            this[4]  = a[4];  this[5]  = a[5];  this[6]  = a[6];  this[7]  = a[7];
            this[8]  = a[8];  this[9]  = a[9];  this[10] = a[10]; this[11] = a[11];
            this[12] = a[12]; this[13] = a[13];	this[14] = a[14]; this[15] = a[15];
        }
        return this;
    }

    translate(x, y, z) {
        this.mult(Mat4.MakeTranslation(x, y, z));
        return this;
    }

    rotate(alpha, x, y, z) {
        this.mult(Mat4.MakeRotation(alpha, x, y, z));
        return this;
    }
    
    scale(x, y, z) {
        this.mult(Mat4.MakeScale(x, y, z));
        return this;
    }

    toString() {
        return  `[ ${this[ 0]}, ${this[ 1]}, ${this[ 2]}, ${this[ 3]}\n` +
                `  ${this[ 4]}, ${this[ 5]}, ${this[ 6]}, ${this[ 7]}\n` +
                `  ${this[ 8]}, ${this[ 9]}, ${this[10]}, ${this[11]}\n` +
                `  ${this[12]}, ${this[13]}, ${this[14]}, ${this[15]} ]`;
    }

    setScale(x,y,z) {
        const rx = new Vec(this[0], this[4], this[8]).normalize().scale(x);
        const ry = new Vec(this[1], this[5], this[9]).normalize().scale(y);
        const rz = new Vec(this[2], this[6], this[10]).normalize().scale(z);
        this[0] = rx.x; this[4] = rx.y; this[8] = rx.z;
        this[1] = ry.x; this[5] = ry.y; this[9] = ry.z;
        this[2] = rz.x; this[6] = rz.y; this[10] = rz.z;
        return this;
    }

    setPosition(pos,y,z) {
        if (typeof(pos)=="number") {
            this[12] = pos;
            this[13] = y;
            this[14] = z;
        }
        else {
            this[12] = pos.x;
            this[13] = pos.y;
            this[14] = pos.z;
        }
        return this;
    }

    mult(a) {
        if (typeof(a)=='number') {
            this[ 0] *= a; this[ 1] *= a; this[ 2] *= a; this[ 3] *= a;
            this[ 4] *= a; this[ 5] *= a; this[ 6] *= a; this[ 7] *= a;
            this[ 8] *= a; this[ 9] *= a; this[10] *= a; this[11] *= a;
            this[12] *= a; this[13] *= a; this[14] *= a; this[15] *= a;
            return this;
        }

        const r0 = this.row(0);
        const r1 = this.row(1);
        const r2 = this.row(2);
        const r3 = this.row(3);
        const c0 = a.col(0);
        const c1 = a.col(1);
        const c2 = a.col(2);
        const c3 = a.col(3);

        this[0 ] = Vec.Dot(r0, c0); this[1 ] = Vec.Dot(r0, c1); this[2 ] = Vec.Dot(r0, c2); this[3 ] = Vec.Dot(r0, c3);
        this[4 ] = Vec.Dot(r1, c0); this[5 ] = Vec.Dot(r1, c1); this[6 ] = Vec.Dot(r1, c2); this[7 ] = Vec.Dot(r1, c3);
        this[8 ] = Vec.Dot(r2, c0); this[9 ] = Vec.Dot(r2, c1); this[10] = Vec.Dot(r2, c2); this[11] = Vec.Dot(r2, c3);
        this[12] = Vec.Dot(r3, c0); this[13] = Vec.Dot(r3, c1); this[14] = Vec.Dot(r3, c2); this[15] = Vec.Dot(r3, c3);

        return this;
    }

    multVector(vec) {
        if (vec.length<3) {
            throw new Error("Invalid parameter multiplying Mat4 by vector");
        }

        const x = vec[0];
        const y = vec[1];
        const z = vec[2];
        const w = vec.length >3 ? vec[3] : 1.0;
    
        return new Vec( this[0] * x + this[4] * y + this[ 8] * z + this[12] * w,
                        this[1] * x + this[5] * y + this[ 9] * z + this[13] * w,
                        this[2] * x + this[6] * y + this[10] * z + this[14] * w,
                        this[3] * x + this[7] * y + this[11] * z + this[15] * w);
    }
    
    invert() {
        const a00 = this[0],  a01 = this[1],  a02 = this[2],  a03 = this[3],
                a10 = this[4],  a11 = this[5],  a12 = this[6],  a13 = this[7],
                a20 = this[8],  a21 = this[9],  a22 = this[10], a23 = this[11],
                a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15];

        const b00 = a00 * a11 - a01 * a10,
                b01 = a00 * a12 - a02 * a10,
                b02 = a00 * a13 - a03 * a10,
                b03 = a01 * a12 - a02 * a11,
                b04 = a01 * a13 - a03 * a11,
                b05 = a02 * a13 - a03 * a12,
                b06 = a20 * a31 - a21 * a30,
                b07 = a20 * a32 - a22 * a30,
                b08 = a20 * a33 - a23 * a30,
                b09 = a21 * a32 - a22 * a31,
                b10 = a21 * a33 - a23 * a31,
                b11 = a22 * a33 - a23 * a32;

        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            this.zero();
        }
        else {
            det = 1.0 / det;

            this[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
            this[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
            this[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
            this[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
            this[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
            this[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
            this[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
            this[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
            this[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
            this[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
            this[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
            this[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
            this[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
            this[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
            this[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
            this[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
        }

        return this;
    }
    
    traspose() {
        const r0 = new Vec(this[0], this[4], this[ 8], this[12]);
        const r1 = new Vec(this[1], this[5], this[ 9], this[13]);
        const r2 = new Vec(this[2], this[6], this[10], this[14]);
        const r3 = new Vec(this[3], this[7], this[11], this[15]);
    
        this.setRow(0, r0);
        this.setRow(1, r1);
        this.setRow(2, r2);
        this.setRow(3, r3);
        return this;
    }

    ///////// Factory methods
    static MakeIdentity() {
        const m = new Mat4();
        return m.identity();
    }

    static MakeZero() {
        const m = new Mat4();
        return m.zero();
    }

    static MakeWithQuaternion(q) {
        const m = Mat4.MakeIdentity();
        
        m.setRow(0, new Vec( 1  - 2 * q[1] * q[1] - 2 * q[2] * q[2], 2 * q[0] * q[1] - 2 * q[2] * q[3], 2 * q[0] * q[2] + 2 * q[1] * q[3], 0));
        m.setRow(1, new Vec( 2 * q[0] * q[1] + 2 * q[2] * q[3], 1  - 2.0 * q[0] * q[0] - 2 * q[2] * q[2], 2 * q[1] * q[2] - 2 * q[0] * q[3], 0));
        m.setRow(2, new Vec( 2 * q[0] * q[2] - 2 * q[1] * q[3], 2 * q[1] * q[2] + 2 * q[0] * q[3] , 1 - 2 * q[0] * q[0] - 2 * q[1] * q[1], 0));//
        return m;
    }
    
    static MakeTranslation(x, y, z) {
        if (x instanceof NumericArray && x.length >= 3) {
            y = x[1];
            z = x[2];
            x = x[0];
        }
        return new Mat4(
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
                x,   y,   z, 1.0
        );
    }
        
    static MakeRotation(alpha, x, y, z) {
        const axis = new Vec(x,y,z);
        axis.normalize();
                
        var cosAlpha = Math.cos(alpha);
        var acosAlpha = 1.0 - cosAlpha;
        var sinAlpha = Math.sin(alpha);
        
        return new Mat4(
            axis.x * axis.x * acosAlpha + cosAlpha, axis.x * axis.y * acosAlpha + axis.z * sinAlpha, axis.x * axis.z * acosAlpha - axis.y * sinAlpha, 0,
            axis.y * axis.x * acosAlpha - axis.z * sinAlpha, axis.y * axis.y * acosAlpha + cosAlpha, axis.y * axis.z * acosAlpha + axis.x * sinAlpha, 0,
            axis.z * axis.x * acosAlpha + axis.y * sinAlpha, axis.z * axis.y * acosAlpha - axis.x * sinAlpha, axis.z * axis.z * acosAlpha + cosAlpha, 0,
            0,0,0,1
        );
    }

    static MakeScale(x, y, z) {
        if (x instanceof NumericArray  && x.length >= 3) {
            y = x[1];
            z = x[2];
            x = x[0];
        }
        return new Mat4(
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        )
    }
    

    static MakePerspective(fovy, aspect, nearPlane, farPlane) {
        return (new Mat4()).perspective(fovy, aspect, nearPlane, farPlane);
    }
    
    static MakeFrustum(left, right, bottom, top, nearPlane, farPlane) {
        return (new Mat4()).frustum(left, right, bottom, top, nearPlane, farPlane);
    }
    
    static MakeOrtho(left, right, bottom, top, nearPlane, farPlane) {
        return (new Mat4()).ortho(left, right, bottom, top, nearPlane, farPlane);
    }

    static MakeLookAt(origin, target, up) {
        return (new Mat4()).lookAt(origin,target,up);
    }

    // Other static methods
    static Mult(A,B) {
        const result = new Mat4(A);
        return result.mult(B);
    }

    static Unproject(x, y, depth, mvMat, pMat, viewport) {
        let mvp = new Mat4(pMat);
        mvp.mult(mvMat);
        mvp.invert();

        const vin = new Vec(((x - viewport.y) / viewport.width) * 2.0 - 1.0,
                                ((y - viewport.x) / viewport.height) * 2.0 - 1.0,
                                depth * 2.0 - 1.0,
                                1.0);
        
        const result = new Vec4(mvp.multVector(vin));
        if (result.z==0) {
            result.set(0);
        }
        else {
            result.set(	result.x/result.w,
                        result.y/result.w,
                        result.z/result.w,
                        result.w/result.w);
        }

        return result;
    }

    static GetScale(m) {
        return new Vec(
            Vec.Magnitude([m[1], m[5], m[9]]),
            Vec.Magnitude([m[0], m[4], m[8]]),
            Vec.Magnitude([m[2], m[6], m[10]])
        );
    }

    static GetRotation(m) {
        const scale = Mat4.GetScale(m);
        return new Mat4(
                m[0] / scale.x, m[1] / scale.y, m[ 2] / scale.z, 0,
                m[4] / scale.x, m[5] / scale.y, m[ 6] / scale.z, 0,
                m[8] / scale.x, m[9] / scale.y, m[10] / scale.z, 0,
                0,	   0,	  0, 	1
        );
    }

    static GetPosition(m) {
        return new Vec(m[12], m[13], m[14]);
    }

    static GetInverted(m) {
        const inverted = new Mat4(m);
        inverted.invert();
        return inverted;
    }

    static GetNormalMatrix(m) {
        return new Mat4(m)
            .invert()
            .traspose()
            .mat3;
    }
    
    static Equals(m,n) {
        return	m[ 0] == n[ 0] && m[ 1] == n[ 1] && m[ 2] == n[ 2] && m[ 3] == n[ 3] &&
                m[ 4] == n[ 4] && m[ 5] == n[ 5] && m[ 6] == n[ 6] && m[ 7] == n[ 7] &&
                m[ 8] == n[ 8] && m[ 9] == n[ 9] && m[10] == n[10] && m[11] == n[11] &&
                m[12] == n[12] && m[13] == n[13] && m[14] == n[14] && m[15] == n[15];
    }

    static TransformDirection(M, /* Vec */ dir) {
        const direction = new Vec(dir);
        const trx = new Mat4(M);
        trx.setRow(3, new Vec(0, 0, 0, 1));
        direction.assign(trx.multVector(direction).xyz);
        direction.normalize();
        return direction;
    }

    static IsNan() {
        return	isNaN(this[ 0]) || isNaN(this[ 1]) || isNaN(this[ 2]) || isNaN(this[ 3]) ||
                isNaN(this[ 4]) || isNaN(this[ 5]) || isNaN(this[ 6]) || isNaN(this[ 7]) ||
                isNaN(this[ 8]) || isNaN(this[ 9]) || isNaN(this[10]) || isNaN(this[11]) ||
                isNaN(this[12]) || isNaN(this[13]) || isNaN(this[14]) || isNaN(this[15]);
    }

    static IsZero(m) {
        return	isZero(m[ 0]) && isZero(m[ 1]) && isZero(m[ 2]) && isZero(m[ 3]) &&
                isZero(m[ 4]) && isZero(m[ 5]) && isZero(m[ 6]) && isZero(m[ 7]) &&
                isZero(m[ 8]) && isZero(m[ 9]) && isZero(m[10]) && isZero(m[11]) &&
                isZero(m[12]) && isZero(m[13]) && isZero(m[14]) && isZero(m[15]);
    }
    
    static IsIdentity(m) {
        return	equals(m[ 0],1) && equals(m[ 1],0) && equals(m[ 2],0) && equals(m[ 3],0) &&
                equals(m[ 4],0) && equals(m[ 5],1) && equals(m[ 6],0) && equals(m[ 7],0) &&
                equals(m[ 8],0) && equals(m[ 9],0) && equals(m[10],1) && equals(m[11],0) &&
                equals(m[12],0) && equals(m[13],0) && equals(m[14],0) && equals(m[15],1);
    }
}
