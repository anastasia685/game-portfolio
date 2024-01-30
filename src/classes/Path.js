import Vector from './helpers/Vector'
import Matrix from './helpers/Matrix'
import * as THREE from 'three'

class Path {
	points
	loop
	index

	renderObject

	static direction = {
		clockwise: -1,
		anticlockwise: 1,
	}

	constructor(points = [], loop = false, index = 0) {
		this.points = points
		this.loop = loop
		this.index = index
	}

	Random(
		count,
		range,
		offset,
		direction = Path.direction.clockwise,
		loop = false,
		index = 0,
	) {
		this.points = []
		const mid = new Vector(range.x / 2, range.y / 2)

		const spacing = (Math.PI * 2) / count

		for (let i = 0; i < count; i++) {
			const dist = new Vector(
				Math.random() * 0.8 * mid.x + 0.2 * mid.x,
				Math.random() * 0.8 * mid.y + 0.2 * mid.y,
			)
			//const angle = spacing * (i + Math.floor(Math.random() * count / 3))
			const angle = spacing * i
			const rotationMatrix = new Matrix()
			rotationMatrix.RotateDeg(angle * direction)
			const p = Vector.Transform(dist, rotationMatrix)
			p.Add(Vector.Sub(offset, mid))
			this.points.push(p)
		}

		this.loop = loop
		this.index = index
	}

	Next() {
		if (this.points.length === 0) return

		if (this.index + 1 === this.points.length && this.loop) this.index = 0
		else if (this.index + 1 <= this.points.length) this.index++
	}

	Render(world, color = 'green') {
		if (this.renderObject) world.scene.remove(this.renderObject)

		const renderObject = new THREE.Group()
		for (let point of this.points) {
			const pointObj = new THREE.Mesh(
				new THREE.BoxGeometry(0.5, 0.5, 0.2),
				new THREE.MeshBasicMaterial({ color: color }),
			)
			pointObj.position.x = point.x
			pointObj.position.y = point.y
			renderObject.add(pointObj)
		}

		this.renderObject = renderObject

		world.scene.add(renderObject)
	}
}

export default Path
