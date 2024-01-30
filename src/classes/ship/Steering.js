import Vector from '../helpers/Vector'
import Matrix from '../helpers/Matrix'
import { LineIntersection } from '../helpers/geometry'

import * as THREE from 'three'

class Steering {
	static behavior_type = {
		none: 0x00000,
		seek: 0x00002,
		flee: 0x00004,
		arrive: 0x00008,
		wander: 0x00010,
		/*cohesion: 0x00020,
		separation: 0x00040,
		alignment: 0x00080,*/
		entity_avoidance: 0x00100,
		wall_avoidance: 0x00200,
		follow_path: 0x00400,
		/*pursuit: 0x00800,
		evade: 0x01000,
		interpose: 0x02000,*/
		distance: 0x04000,
		/*offset_pursuit: 0x08000,*/
	}
	static deceleration_type = {
		slow: 3,
		normal: 2,
		fast: 1,
	}

	static evade_range = 10

	movingEntity
	steeringForce

	target
	offset

	wanderTargetPos
	wanderTarget
	wanderRadius
	wanderDistance
	wanderTargetRenderObject

	wallDetectors
	wallDetectorLength
	wallDetectorsRenderObject

	viewRadius

	behaviorTypes
	decelerationType

	constructor(movingEntity) {
		this.movingEntity = movingEntity
		this.steeringForce = new Vector()
		this.behaviorTypes = 0
		this.decelerationType = Steering.deceleration_type.normal

		this.viewRadius = 15

		this.wallDetectorLength = 4
		this.wallDetectors = []
		this.wallDetectorsRenderObject = null

		this.wanderRadius = 1.4
		this.wanderDistance = 1.8
		this.wanderJitterAmount = 55

		const theta = Math.random() * Math.PI
		this.wanderTarget = new Vector(Math.cos(theta), Math.sin(theta))

		this.wanderTargetRenderObject = new THREE.Mesh(
			new THREE.BoxGeometry(0.7, 0.7, 0.2),
			new THREE.MeshBasicMaterial({ color: 'red' }),
		)
	}

	Calculate() {
		this.steeringForce.Zero()

		let force

		if (this.IsOn(Steering.behavior_type.wall_avoidance)) {
			this.CreateWallDetectors()
			force = Vector.Mult(this.AvoidWalls(), 15)
			if (!this.AccumulateForce(this.steeringForce, force))
				return this.steeringForce
		}
		if (this.IsOn(Steering.behavior_type.entity_avoidance)) {
			force = Vector.Mult(this.AvoidEntities(), 10)
			if (!this.AccumulateForce(this.steeringForce, force))
				return this.steeringForce
		}
		// evade
		// flee

		/*if (this.IsOn(Steering.behavior_type.separation)) {
      force = Vector.Mult(this.Separate(), 1.0)
      if (!this.AccumulateForce(this.steeringForce, force))
        return this.steeringForce
    }
    if (this.IsOn(Steering.behavior_type.alignment)) {
      force = Vector.Mult(this.Align(), 1.0)
      if (!this.AccumulateForce(this.steeringForce, force))
        return this.steeringForce
    }
    if (this.IsOn(Steering.behavior_type.cohesion)) {
      force = Vector.Mult(this.Cohere(), 2.0)
      if (!this.AccumulateForce(this.steeringForce, force))
        return this.steeringForce
    }*/
		if (
			this.IsOn(Steering.behavior_type.follow_path) &&
			this.movingEntity.path
		) {
			force = Vector.Mult(this.FollowPath(), 0.9)
			if (!this.AccumulateForce(this.steeringForce, force))
				return this.steeringForce
		}

		/*if (
      this.IsOn(Steering.behavior_type.offset_pursuit) &&
      this.movingEntity.target &&
      this.movingEntity.offset
    ) {
      force = Vector.Mult(
        this.OffsetPursuit(
          this.movingEntity.target,
          this.movingEntity.offset,
        ),
        0.9,
      )
      if (!this.AccumulateForce(this.steeringForce, force))
        return this.steeringForce
    }*/
		if (
			this.IsOn(Steering.behavior_type.distance) &&
			this.movingEntity.target &&
			this.movingEntity.offset
		) {
			force = Vector.Mult(
				this.Distance(
					this.movingEntity.target,
					this.movingEntity.offset.Length(),
				),
				2.0,
			)
			if (!this.AccumulateForce(this.steeringForce, force))
				return this.steeringForce
		}

		if (this.IsOn(Steering.behavior_type.wander)) {
			force = Vector.Mult(this.Wander(), 1)
			if (!this.AccumulateForce(this.steeringForce, force))
				return this.steeringForce
		}

		return this.steeringForce
	}

	IsOn(behavior_type) {
		return (this.behaviorTypes & behavior_type) === behavior_type
	}

	On(behavior_type) {
		this.behaviorTypes |= behavior_type
	}

	Off(behavior_type) {
		if (this.IsOn(behavior_type)) this.behaviorTypes ^= behavior_type
	}

	AccumulateForce(currentSum, forceToAdd) {
		// modify currentSum reference, return success flag

		const magnitudeSoFar = currentSum.Length()
		const magnitudeRemaining = this.movingEntity.maxForce - magnitudeSoFar

		if (magnitudeRemaining <= 0) return false

		const magnitudeToAdd = forceToAdd.Length()

		if (magnitudeToAdd < magnitudeRemaining) {
			currentSum.Add(forceToAdd)
		} else {
			const forceToAddClamped = new Vector(forceToAdd.x, forceToAdd.y)
			forceToAddClamped.Normalize()
			forceToAddClamped.Mult(magnitudeRemaining)
			currentSum.Add(forceToAddClamped)
		}
		return true
	}

	CreateWallDetectors() {
		// forward-facing
		this.wallDetectors[0] = Vector.Add(
			this.movingEntity.position,
			Vector.Mult(this.movingEntity.heading, this.wallDetectorLength),
		)

		// left-facing
		let rotationMatrix = new Matrix()
		rotationMatrix.RotateDeg(Math.PI * 1.75)
		let directionVec = Vector.Transform(
			this.movingEntity.heading,
			rotationMatrix,
		)
		this.wallDetectors[1] = Vector.Add(
			this.movingEntity.position,
			Vector.Mult(directionVec, this.wallDetectorLength * 0.5),
		)

		// right-facing
		rotationMatrix = new Matrix()
		rotationMatrix.RotateDeg(Math.PI * 0.25)
		directionVec = Vector.Transform(this.movingEntity.heading, rotationMatrix)
		this.wallDetectors[2] = Vector.Add(
			this.movingEntity.position,
			Vector.Mult(directionVec, this.wallDetectorLength * 0.5),
		)

		if (!this.wallDetectorsRenderObject) return
		for (let i = 0; i < this.wallDetectors.length; i++) {
			const points = [
				new THREE.Vector3(
					this.movingEntity.position.x,
					this.movingEntity.position.y,
					1,
				),
				new THREE.Vector3(
					this.wallDetectors[i].x,
					this.wallDetectors[i].y,
					2,
				),
			]
			if (
				this.wallDetectorsRenderObject.children.length <
				this.wallDetectors.length
			) {
				this.wallDetectorsRenderObject.add(
					new THREE.Line(
						new THREE.BufferGeometry().setFromPoints(points),
						new THREE.LineBasicMaterial({ color: 'red' }),
					),
				)
			} else
				this.wallDetectorsRenderObject.children[i].geometry.setFromPoints(
					points,
				)
		}
	}

	// -- Steering Behaviors -- //
	Seek(targetPos) {
		const desiredVelocity = Vector.Sub(targetPos, this.movingEntity.position)
		desiredVelocity.Normalize()
		desiredVelocity.Mult(this.movingEntity.maxSpeed)
		return Vector.Sub(desiredVelocity, this.movingEntity.velocity)
	}

	Flee(targetPos) {
		if (
			Vector.DistanceSq(this.movingEntity.position, targetPos) >
			Steering.evade_range * Steering.evade_range
		)
			return new Vector(0, 0)

		const desiredVelocity = Vector.Sub(this.movingEntity.position, targetPos)
		desiredVelocity.Normalize()
		desiredVelocity.Mult(this.movingEntity.maxSpeed)
		return Vector.Sub(desiredVelocity, this.movingEntity.velocity)
	}

	Arrive(targetPos, deceleration) {
		const toTarget = Vector.Sub(targetPos, this.movingEntity.position)
		const dist = toTarget.Length()

		if (dist > 0) {
			const decelerationTweaker = 1.0
			let speed = dist / (deceleration * decelerationTweaker)
			speed = Math.min(speed, this.movingEntity.maxSpeed)

			const desiredVelocity = Vector.Mult(toTarget, speed / dist)
			return Vector.Sub(desiredVelocity, this.movingEntity.velocity)
		}
		return new Vector(0, 0)
	}

	Pursuit(target) {
		const direction = Vector.Sub(target.position, this.movingEntity.position)
		const relativeHeading = this.movingEntity.heading.Dot(target.heading)

		// if angle in range (0 - 18deg) -> target is in front - seek to position
		if (
			direction.Dot(this.movingEntity.heading) > 0 &&
			relativeHeading < -0.95 //acos(0.95)=~18 degs
		) {
			return this.Seek(target.position)
		}

		let lookAheadTime =
			direction.Length() /
			(this.movingEntity.maxSpeed + target.velocity.Length())

		//TODO: test this
		/*// factor in turn around time
    lookAheadTime +=
      ((relativeHeading - 1) * -this.movingEntity.maxTurnRate) / Math.PI*/

		return this.Seek(
			Vector.Add(
				target.position,
				Vector.Mult(target.velocity, lookAheadTime),
			),
		)
	}

	Evade(target) {
		const direction = Vector.Sub(target.position, this.movingEntity.position)

		if (direction.LengthSq() > Steering.evade_range * Steering.evade_range)
			return new Vector(0, 0)

		const lookAheadTime =
			direction.Length() /
			(this.movingEntity.maxSpeed + target.velocity.Length())

		return this.Flee(
			Vector.Add(
				target.position,
				Vector.Mult(target.velocity, lookAheadTime),
			),
		)
	}

	Wander() {
		// add jitter
		if (this.movingEntity.wanderRegulator.IsReady()) {
			this.wanderTarget.Add(
				new Vector(
					(Math.random() * 2 - 1) *
						this.wanderJitterAmount *
						this.movingEntity.deltaTime,
					(Math.random() * 2 - 1) *
						this.wanderJitterAmount *
						this.movingEntity.deltaTime,
				),
			)
			this.wanderTarget.Normalize()
		}

		//project direction vector onto circle
		const projected = Vector.Mult(this.wanderTarget, this.wanderRadius)

		// displace circle by wander distance
		projected.Add(new Vector(this.wanderDistance, 0))

		this.wanderTargetPos = Vector.LocalToWorld(
			projected,
			this.movingEntity.heading,
			this.movingEntity.side,
			this.movingEntity.position,
		)

		return Vector.Sub(this.wanderTargetPos, this.movingEntity.position)
	}

	FollowPath() {
		if (
			this.movingEntity.path.index < 0 ||
			this.movingEntity.path.index >= this.movingEntity.path.points.length
		)
			return new Vector(0, 0)

		if (
			this.movingEntity.path.points[this.movingEntity.path.index].DistanceSq(
				this.movingEntity.position,
			) < 3.5
		)
			this.movingEntity.path.Next()

		// re-check after incrementing index
		if (
			this.movingEntity.path.index < 0 ||
			this.movingEntity.path.index >= this.movingEntity.path.points.length
		)
			return new Vector(0, 0)

		if (
			this.movingEntity.path.index <
			this.movingEntity.path.points.length - 1
		)
			return this.Seek(
				this.movingEntity.path.points[this.movingEntity.path.index],
			)
		else {
			return this.Arrive(
				this.movingEntity.path.points[this.movingEntity.path.index],
				Steering.deceleration_type.normal,
			)
		}
	}

	AvoidWalls() {
		this.CreateWallDetectors()

		let closestDist = Infinity
		let closestWall = -1
		let closestPoint = null

		let force = new Vector()

		let walls = this.movingEntity.world.walls
		if (this.movingEntity.bounds)
			walls = walls.concat(this.movingEntity.bounds)

		for (let i = 0; i < this.wallDetectors.length; i++) {
			for (let j = 0; j < walls.length; j++) {
				const intersection = LineIntersection(
					this.movingEntity.position,
					this.wallDetectors[i],
					walls[j].start,
					walls[j].end,
				)
				if (intersection && intersection.dist < closestDist) {
					closestDist = intersection.dist
					closestWall = j
					closestPoint = intersection.point
				}
			}

			if (closestWall > -1) {
				const overShoot = Vector.Sub(this.wallDetectors[i], closestPoint)
				force = Vector.Mult(walls[closestWall].normal, overShoot.Length())
			}
		}
		return force
	}

	AvoidEntities() {
		const force = new Vector()

		let entity
		let closestEntity = null
		let distToClosestEntity = Infinity
		let localPosOfClosest = new Vector()

		for (const entityId of this.movingEntity.neighbors) {
			entity = this.movingEntity.world.ships[entityId]

			const localPos = Vector.WorldToLocal(
				entity.position,
				this.movingEntity.heading,
				this.movingEntity.side,
				this.movingEntity.position,
			)

			if (localPos.x < -this.movingEntity.boundingRadius) continue

			const expandedRadius =
				this.movingEntity.boundingRadius + entity.boundingRadius

			if (localPos.y > expandedRadius) continue

			const sqrtPart = Math.sqrt(
				expandedRadius * expandedRadius - localPos.y * localPos.y,
			)

			let intersection = localPos.x - sqrtPart

			if (intersection <= 0) {
				intersection = localPos.x + sqrtPart
			}

			if (intersection < distToClosestEntity) {
				distToClosestEntity = intersection
				closestEntity = entity
				localPosOfClosest = localPos
			}
		}

		if (closestEntity) {
			const multiplier =
				1 + (this.viewRadius - localPosOfClosest.x) / this.viewRadius
			force.y =
				(closestEntity.boundingRadius - localPosOfClosest.y) * multiplier
			const brakingWeight = 0.2
			force.x =
				(closestEntity.boundingRadius - localPosOfClosest.x) * brakingWeight
		}

		return Vector.VecToWorld(
			force,
			this.movingEntity.heading,
			this.movingEntity.side,
		)
	}

	OffsetPursuit(target, offset) {
		const offsetPos = Vector.LocalToWorld(
			offset,
			target.heading,
			target.side,
			target.position,
		)
		const toOffsetPos = Vector.Sub(offsetPos, this.movingEntity.position)
		const lookAheadTime =
			toOffsetPos.Length() /
			(this.movingEntity.maxSpeed + target.velocity.Length())

		return this.Arrive(
			Vector.Add(offsetPos, Vector.Mult(target.velocity, lookAheadTime)),
			Steering.deceleration_type.fast,
		)
	}

	Distance(target, radius) {
		const toTarget = Vector.Sub(this.movingEntity.position, target.position)
		toTarget.Normalize()
		toTarget.Mult(radius)

		return this.Arrive(
			Vector.Add(target.position, toTarget),
			Steering.deceleration_type.fast,
		)
	}
}

export default Steering
