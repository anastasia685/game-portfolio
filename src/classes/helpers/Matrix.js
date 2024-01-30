class Matrix {
	// -- Constructor -- //
	constructor() {
		this.Identity()
	}
	Copy(matrix) {
		this.m11 = matrix.m11
		this.m12 = matrix.m12
		this.m13 = matrix.m13
		this.m21 = matrix.m21
		this.m22 = matrix.m22
		this.m23 = matrix.m23
		this.m31 = matrix.m31
		this.m32 = matrix.m32
		this.m33 = matrix.m33
	}

	// -- Methods -- //
	Zero() {
		this.m11 = 0
		this.m12 = 0
		this.m13 = 0
		this.m21 = 0
		this.m22 = 0
		this.m23 = 0
		this.m31 = 0
		this.m32 = 0
		this.m33 = 0
	}

	Identity() {
		this.Zero()
		this.m11 = 1
		this.m22 = 1
		this.m33 = 1
	}

	Translate(x, y) {
		const mat_trans = new Matrix()
		mat_trans.m31 = x
		mat_trans.m32 = y

		this.Copy(Matrix.MatrixMultiply(this, mat_trans))
	}

	Scale(x, y) {
		const mat_scale = new Matrix()
		mat_scale.Identity()
		mat_scale.m11 = x
		mat_scale.m22 = y

		this.Copy(Matrix.MatrixMultiply(this, mat_scale))
	}

	RotateDeg(deg) {
		const mat_rot = new Matrix()
		mat_rot.m11 = Math.cos(deg)
		mat_rot.m12 = -Math.sin(deg)
		mat_rot.m21 = Math.sin(deg)
		mat_rot.m22 = Math.cos(deg)

		this.Copy(Matrix.MatrixMultiply(this, mat_rot))
	}

	RotateVec(fwd, side) {
		const mat_rot = new Matrix()
		mat_rot.m11 = fwd.x
		mat_rot.m12 = fwd.y
		mat_rot.m21 = side.x
		mat_rot.m22 = side.y

		this.Copy(Matrix.MatrixMultiply(this, mat_rot))
	}

	// -- Static Methods -- //
	static MatrixMultiply(mat1, mat2) {
		const mat_res = new Matrix()

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				let tmp = 0.0

				for (let k = 0; k < 3; k++) {
					tmp += mat1[`m${i + 1}${k + 1}`] * mat2[`m${k + 1}${j + 1}`]
				}

				mat_res[`m${i + 1}${j + 1}`] = tmp
			}
		}

		return mat_res
	}
}

export default Matrix
