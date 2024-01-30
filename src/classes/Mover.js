import Entity from './Entity'
import Vector from './helpers/Vector'
import Matrix from './helpers/Matrix'

class Mover extends Entity {
	velocity
	maxSpeed
	mass
	maxForce
	heading
	side
	maxTurnRate
	deltaTime

	constructor(
		position,
		scale,
		boundingRadius,
		color,
		velocity = new Vector(0, 0),
		maxSpeed = 0,
		mass = 0,
		maxForce = 0,
		heading = new Vector(0, 0),
		maxTurnRate = 0,
		deltaTime = 0,
	) {
		super(position, scale, boundingRadius, color)
		this.velocity = velocity
		this.maxSpeed = maxSpeed
		this.mass = mass
		this.maxForce = maxForce
		this.heading = heading
		this.side = heading.Perp()
		this.maxTurnRate = maxTurnRate
		this.deltaTime = deltaTime
	}


	Face(target) {
		const toTarget = Vector.Sub(target, this.position)
		toTarget.Normalize()

		let angle = Math.acos(this.heading.Dot(toTarget))

		if (angle < 0.00001) return true

		angle = Math.min(angle, this.maxTurnRate)

		const rotationMatrix = new Matrix()
		rotationMatrix.RotateDeg(angle * this.heading.Sign(toTarget))

		this.heading = Vector.Transform(this.heading, rotationMatrix)
		this.side = this.heading.Perp()
		this.velocity = Vector.Transform(this.velocity, rotationMatrix)

		return false
	}
}

export default Mover
