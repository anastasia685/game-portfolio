import Mover from '../Mover'
import Steering from './Steering'
import StateMachine from '../fsm/StateMachine'
import Vector from '../helpers/Vector'
import Regulator from '../helpers/Regulator'
import Path from '../Path'
import Smoother from '../helpers/Smoother'
import Matrix from '../helpers/Matrix'

import * as THREE from 'three'
import { GlobalShipState } from './ShipStates'
import { render } from '@testing-library/react'

class Ship extends Mover {
	world

	neighbors
	bounds

	smoothedHeading

	steering
	headingSmoother
	wanderRegulator

	pathRegulator

	path

	dangerRadius
	weaponRegulator
	health

	enemy

	constructor(
		position,
		scale,
		boundingRadius,
		velocity,
		maxSpeed,
		mass,
		maxForce,
		maxTurnRate,
		rotation,
		world,
		path,
		bounds,
		initialState,
		enemy,
	) {
		const renderObject = new THREE.Mesh(
			/*new THREE.BoxGeometry(scale.x, scale.y, scale.z),*/
			new THREE.OctahedronGeometry(1, 0),
			new THREE.MeshLambertMaterial({
				color: enemy ? '#3765a6' : '#623c6e',
				fog: true,
			}),
		)
		renderObject.castShadow = true

		const edges = new THREE.LineSegments(
			new THREE.EdgesGeometry(renderObject.geometry),
			new THREE.LineBasicMaterial({
				color: enemy ? '#46b3b3' : '#98519e',
				linewidth: 2,
			}),
		)

		renderObject.add(edges)
		renderObject.scale.set(scale.x, scale.y, 1)
		super(
			position,
			scale,
			boundingRadius,
			renderObject,
			/*enemy ? 'black' : 'white',*/
			velocity,
			maxSpeed,
			mass,
			maxForce,
			new Vector(Math.sin(rotation), Math.cos(rotation)),
			maxTurnRate,
		)
		this.world = world
		if (path) {
			if (path instanceof Path) this.path = path
			else {
				const newPath = new Path()
				newPath.Random(
					10,
					new Vector(80, 80),
					new Vector(position.x, position.y),
					Path.direction.clockwise,
					true,
				)
				this.path = newPath
			}
			this.path.Render(this.world)
		}

		this.bounds = bounds

		this.enemy = enemy

		/*if(bounds){
      for(let b of bounds){
        const startObj = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, 0.2, 5),
          new THREE.MeshBasicMaterial({ color: 'green' }),
        )
        startObj.position.x = b.start.x
        startObj.position.y = b.start.y

        const endObj = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, 0.2, 5),
          new THREE.MeshBasicMaterial({ color: 'green' }),
        )
        endObj.position.x = b.end.x
        endObj.position.y = b.end.y

        const renderObject = new THREE.Group()
        renderObject.add(startObj)
        renderObject.add(endObj)
        /!*const mid = Vector.Div(Vector.Add(b.start, b.end), 2)
        const renderObject = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(mid.x, mid.y, 2),
            new THREE.Vector3(
              mid.x + b.normal.x * 1.5,
              mid.y + b.normal.y * 1.5,
              2,
            ),
          ]),
          new THREE.LineBasicMaterial({ color: 'red' }),
        )*!/

        this.world.scene.add(renderObject)
      }
    }*/

		this.dangerRadius = 10

		this.wanderRegulator = new Regulator(8)
		this.pathRegulator = new Regulator(3)
		this.weaponRegulator = new Regulator(1)
		this.steering = new Steering(this)

		this.stateMachine = new StateMachine(this)

		this.stateMachine.globalState = GlobalShipState.Instance
		this.stateMachine.globalState.Enter(this)
		if (initialState) {
			this.stateMachine.currentState = initialState
			this.stateMachine.previousState = initialState
			//this.stateMachine.globalState = GlobalShipState.Instance

			this.stateMachine.currentState.Enter(this)
		}

		this.headingSmoother = new Smoother(40)
		this.smoothedHeading = new Vector()

		this.health = 100
	}

	Reset(position, state) {
		if (position) this.position = position
		this.velocity = new Vector()
		if (this.path?.renderObject)
			this.world.scene.remove(this.path.renderObject)
		this.path = null
		if (this.dangerZones) delete this.dangerZones
		this.stateMachine.ChangeState(state)
	}

	Update(deltaTime) {
		this.deltaTime = deltaTime

		this.stateMachine.Update()

		this.steering.viewRadius = 15


		this.TagNeighbors()

		const force = this.steering.Calculate()
		const forceLength = force.LengthSq()

		// add drag force to slowly stop
		if (forceLength < 0.000001) {
			force.Add(Vector.Mult(this.velocity, -0.6))
		}

		const acceleration = Vector.Div(force, this.mass)

		let newVelocity = Vector.Add(
			this.velocity,
			Vector.Mult(acceleration, deltaTime),
		)

		// clamp angle difference
		/*const toTarget = new Vector(newVelocity.x, newVelocity.y)
    toTarget.Normalize()
    const angleDiff = Math.acos(this.heading.Dot(toTarget))
    if (angleDiff > this.maxTurnRate) {
      const rotationMatrix = new Matrix()
      rotationMatrix.RotateDeg(
        (angleDiff - this.maxTurnRate) * this.heading.Sign(toTarget),
      )

      newVelocity = Vector.Transform(newVelocity, rotationMatrix)
    }*/

		// clamp magnitude
		newVelocity.Clamp(this.maxSpeed)

		this.velocity.x = newVelocity.x
		this.velocity.y = newVelocity.y
		this.position.Add(Vector.Mult(this.velocity, deltaTime))

		if (this.velocity.LengthSq() > 0.000001) {
			const heading = new Vector(this.velocity.x, this.velocity.y)
			heading.Normalize()

			this.heading = heading

			this.side = this.heading.Perp()
		}

		this.smoothedHeading = this.headingSmoother.Update(this.heading)

		this.Render()
	}

	Render() {
		this.renderObject.rotation.z = Math.atan2(
			-this.smoothedHeading.x,
			this.smoothedHeading.y,
		)

		this.renderObject.position.x = this.position.x
		this.renderObject.position.y = this.position.y

		if (
			this.steering.IsOn(Steering.behavior_type.wander) &&
			this.steering.wanderTargetPos
		) {
			this.steering.wanderTargetRenderObject.position.x =
				this.steering.wanderTargetPos.x
			this.steering.wanderTargetRenderObject.position.y =
				this.steering.wanderTargetPos.y
		}
	}

	HandleMessage(msg) {
		return this.stateMachine.HandleMessage(msg)
	}

	TagNeighbors() {
		this.neighbors = []
		for (let shipId in this.world.ships) {
			if (shipId === this.id.toString()) continue

			const ship = this.world.ships[shipId]

			const to = Vector.Sub(ship.position, this.position)

			const range = this.steering.viewRadius + ship.boundingRadius
			if (to.LengthSq() < range * range) {
				this.neighbors.push(shipId)
			}
		}
	}
}

export default Ship
