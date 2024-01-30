import * as THREE from 'three'
import Ship from './ship/Ship'
import Wall from './Wall'
import Vector from './helpers/Vector'
import NavGraph from './navigation/NavGraph'
import Path from './Path'
import { IdleShipState, SearchShipState } from './ship/ShipStates'
import { MessageDispatcher } from './fsm/MessageDispatcher'
import Matrix from './helpers/Matrix'

class World {
	scene

	ships
	walls
	objective
	activeShip

	navMesh
	messageDispatcher

	constructor(scene, camera, map, renderHelpers) {
		this.scene = scene
		this.camera = camera
		this.renderHelpers = renderHelpers

		this.ships = {}

		this.walls = []

		if (map?.walls) {
			map.walls.forEach((wall) => {
				this.AddWallBox(wall[0], wall[1], wall[2])
			})
		}
		if (map?.enemies) {
			map.enemies.forEach((enemy) => {
				this.AddShip(
					enemy.position,
					enemy.path,
					enemy.bounds,
					IdleShipState.Instance,
					true,
				)
			})
		}
		if (map?.objective) this.objective = map.objective

		this.navMesh = new NavGraph(20, 20, { walls: map?.walls }, this.scene)
		this.messageDispatcher = new MessageDispatcher(this)

		this.AddShip(
			new Vector(5, -15),
			null,
			null,
			null,
			false,
			true,
		)
	}

	Update(deltaTime) {
		for (const shipId in this.ships) {
			this.ships[shipId].Update(deltaTime)
		}

		this.messageDispatcher.DispatchDelayedMessages()

		if (this.camera && this.activeShip) {
			const target = this.ships[this.activeShip]

			this.camera.up = new THREE.Vector3(0, 0, 1)
			this.camera.lookAt(target.position.x, target.position.y, 3.5)
		}
	}

	AddShip(
		position,
		path,
		bounds,
		initialState,
		enemy = false,
		active = false,
	) {
		const ship = new Ship(
			new THREE.Vector3(position.x, position.y, 2.2),
			new THREE.Vector3(0.8, 1.4, 0.7),
			1.4,
			new Vector(),
			3,
			1,
			3,
			Math.PI / 2,
			0,
			this,
			path,
			bounds,
			initialState,
			enemy,
		)
		this.ships[ship.id] = ship

		this.scene.add(ship.renderObject)

		if (active) {
			if (this.camera)
				this.ships?.[this.activeShip]?.renderObject?.remove(this.camera)

			this.activeShip = ship.id

			if (this.camera) {
				ship.renderObject.add(this.camera)
				this.camera.position.set(0, -15, 10)
			}
		}
	}

	AddWall(position, length, rotation = 0) {
		let points = [
			new Vector(-length / 2, 0.1),
			new Vector(length / 2, 0.1),
			new Vector(length / 2, -0.1),
			new Vector(-length / 2, -0.1),
		]
		const heading = new Vector(Math.cos(rotation), Math.sin(rotation))
		const side = heading.Perp()

		points = points.map((point) => {
			return Vector.LocalToWorld(point, heading, side, position)
		})

		for (let i = 0; i < points.length; i += 2) {
			const w = new Wall(points[i], points[i + 1])
			this.walls.push(w)

			// for wall normal visualization
			if (w.renderObject) this.scene.add(w.renderObject)
		}

		const renderObject = new THREE.Mesh(
			new THREE.BoxGeometry(length, 0.2, 4),
			new THREE.MeshBasicMaterial({ color: 'yellow' }),
		)
		renderObject.position.x = position.x
		renderObject.position.y = position.y
		renderObject.position.z = 2

		renderObject.rotation.z = rotation

		this.scene.add(renderObject)
	}

	AddWallBox(position, dimensions, rotation = 0) {
		let points = [
			new Vector(-dimensions.x / 2, -dimensions.y / 2),
			new Vector(-dimensions.x / 2, dimensions.y / 2),
			new Vector(dimensions.x / 2, dimensions.y / 2),
			new Vector(dimensions.x / 2, -dimensions.y / 2),
		]
		const heading = new Vector(Math.cos(rotation), Math.sin(rotation))
		const side = heading.Perp()

		points = points.map((point) => {
			return Vector.LocalToWorld(point, heading, side, position)
		})

		for (let i = 0; i < points.length; i++) {
			const w = new Wall(points[i], points[(i + 1) % points.length])
			this.walls.push(w)

			// for wall normal visualization
			if (w.renderObject) this.scene.add(w.renderObject)
		}

		const renderObject = new THREE.Mesh(
			new THREE.BoxGeometry(dimensions.x, dimensions.y, 4),
			new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: false }),
		)
		renderObject.position.x = position.x
		renderObject.position.y = position.y
		renderObject.position.z = 2

		renderObject.rotation.z = rotation

		if (this.renderHelpers) this.scene.add(renderObject)
	}
}

export default World
