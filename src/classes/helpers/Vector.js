import Matrix from './Matrix'

class Vector {
	constructor(x = 0, y = 0) {
		this.x = x
		this.y = y
	}

	static Add(v1, v2) {
		return new Vector(v1.x + v2.x, v1.y + v2.y)
	}

	static Sub(v1, v2) {
		return new Vector(v1.x - v2.x, v1.y - v2.y)
	}

	static Mult(v, n) {
		return new Vector(v.x * n, v.y * n)
	}

	static Div(v, n) {
		return new Vector(v.x / n, v.y / n)
	}

	static DistanceSq(v1, v2) {
		const dx = v2.x - v1.x
		const dy = v2.y - v1.y
		return dx * dx + dy * dy
	}

	static Distance(v1, v2) {
		return Math.sqrt(Vector.DistanceSq(v1, v2))
	}

	Add(v) {
		this.x += v.x
		this.y += v.y
	}

	Sub(v) {
		this.x -= v.x
		this.y -= v.y
	}

	Mult(n) {
		this.x *= n
		this.y *= n
	}

	Div(n) {
		this.x /= n
		this.y /= n
	}

	Zero() {
		this.x = 0
		this.y = 0
	}

	LengthSq() {
		return this.x * this.x + this.y * this.y
	}

	Length() {
		return Math.sqrt(this.LengthSq())
	}

	Normalize() {
		let m = this.Length()
		if (m !== 0) {
			this.x /= m
			this.y /= m
		}
	}

	Clamp(max) {
		if (this.Length() > max) {
			this.Normalize()
			this.Mult(max)
		}
	}

	Perp() {
		return new Vector(this.y, -this.x)
	}

	DistanceSq(v) {
		const dx = v.x - this.x
		const dy = v.y - this.y
		return dx * dx + dy * dy
	}

	Distance(v) {
		return Math.sqrt(this.DistanceSq(v))
	}

	Dot(v) {
		return this.x * v.x + this.y * v.y
	}

	Sign(v) {
		return this.Perp().Dot(v) < 0 ? 1 : -1
	}

	static Transform(vec, mat) {
		const vec_res = new Vector()
		vec_res.x = vec.x * mat.m11 + vec.y * mat.m21 + mat.m31
		vec_res.y = vec.x * mat.m12 + vec.y * mat.m22 + mat.m32
		return vec_res
	}

	static LocalToWorld(vec, heading, side, position) {
		const mat_transform = new Matrix()
		mat_transform.RotateVec(heading, side)
		mat_transform.Translate(position.x, position.y)
		return Vector.Transform(vec, mat_transform)
	}

	static LocalToWorldDeg(vec, angle, position) {
		const mat_transform = new Matrix()
		mat_transform.RotateDeg(angle)
		mat_transform.Translate(position.x, position.y)
		return Vector.Transform(vec, mat_transform)
	}

	static WorldToLocal(vec, heading, side, position) {
		const mat_transform = new Matrix()

		/*mat_transform.m11 = heading.y
		mat_transform.m12 = -side.y
		mat_transform.m21 = -heading.x
		mat_transform.m22 = side.x*/
		mat_transform.m11 = heading.x
		mat_transform.m12 = side.x
		mat_transform.m21 = heading.y
		mat_transform.m22 = side.y

    /*mat_transform.m31 = -position.Dot(side)
    mat_transform.m32 = -position.Dot(heading)*/
		mat_transform.m31 = -position.Dot(heading)
    mat_transform.m32 = -position.Dot(side)

		return Vector.Transform(vec, mat_transform)
	}

	static VecToWorld(vec, heading, side) {
		const mat_transform = new Matrix()
		mat_transform.RotateVec(heading, side)
		return Vector.Transform(vec, mat_transform)
	}
}

export default Vector
