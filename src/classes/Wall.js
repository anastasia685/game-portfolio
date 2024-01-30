import Vector from './helpers/Vector'

import * as THREE from 'three'

class Wall {
	start
	end
	normal

	constructor(start, end) {
		this.start = start
		this.end = end
		this.CalculateNormal()

		/*
    //--- draw edge points
    const startObj = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 5),
      new THREE.MeshBasicMaterial({ color: 'yellow' }),
    )
    startObj.position.x = this.start.x
    startObj.position.y = this.start.y

    const endObj = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 5),
      new THREE.MeshBasicMaterial({ color: 'yellow' }),
    )
    endObj.position.x = this.end.x
    endObj.position.y = this.end.y
    
    const renderObject = new THREE.Group()
    renderObject.add(startObj)
    renderObject.add(endObj)
    //---
    */

		//--- draw normal
		const mid = Vector.Div(Vector.Add(this.start, this.end), 2)
		const renderObject = new THREE.Line(
			new THREE.BufferGeometry().setFromPoints([
				new THREE.Vector3(mid.x, mid.y, 2),
				new THREE.Vector3(
					mid.x + this.normal.x * 1.5,
					mid.y + this.normal.y * 1.5,
					2,
				),
			]),
			new THREE.LineBasicMaterial({ color: 'red' }),
		)
		//---

		//this.renderObject = renderObject
	}

	CalculateNormal() {
		const norm = Vector.Sub(this.end, this.start)
		norm.Normalize()
		this.normal = norm.Perp()
	}
}

export default Wall
