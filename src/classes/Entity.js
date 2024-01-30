import Vector from './helpers/Vector'

import * as THREE from 'three'

class Entity {
	id
	position
	scale
	boundingRadius

	renderObject
	color

	static #nextIdVal = 0

	#nextId() {
		return ++Entity.#nextIdVal
	}

	// -- Constructor -- //
	constructor(
		position = new THREE.Vector3(0, 0, 0),
		scale = new THREE.Vector3(1, 1, 0.6),
		boundingRadius = 1,
		renderObject,
	) {
		this.id = this.#nextId()
		this.position = new Vector(position.x, position.y)
		this.boundingRadius = boundingRadius
		this.scale = new Vector(scale.x, scale.y)

		this.renderObject = renderObject
		this.renderObject.position.x = position.x
		this.renderObject.position.y = position.y
		this.renderObject.position.z = position.z
	}

	// -- Methods -- //
	Update() {
		throw new Error('Update method must be implemented')
	}

	Render() {
		throw new Error('Render method must be implemented')
	}

	HandleMessage() {
		throw new Error('HandleMessage method must be implemented')
	}
}

export default Entity
