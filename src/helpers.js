import Vector from './classes/helpers/Vector'
import * as THREE from 'three'

export function indexWalls(
	geometry,
	walls,
	localCoordinateSize = 100,
	geometrySize = 512,
) {
	const displacement = new Float32Array(geometry.attributes.position.count)

	walls.forEach((wall) => {
		let corners = [
			new Vector(wall[0].x - wall[1].x / 2, wall[0].y + wall[1].y / 2), // top left
			new Vector(wall[0].x + wall[1].x / 2, wall[0].y + wall[1].y / 2), // top right
			new Vector(wall[0].x + wall[1].x / 2, wall[0].y - wall[1].y / 2), // bottom right
			new Vector(wall[0].x - wall[1].x / 2, wall[0].y - wall[1].y / 2), // bottom left
		]
		corners = corners.map((c, i) => {
			const local = new Vector(
				c.x + localCoordinateSize / 2,
				-c.y + localCoordinateSize / 2,
			)
			//trim edges
			/*local.x = Math.min(Math.max(local.x, 0), 100)
      local.y = Math.min(Math.max(local.y, 0), 100)*/
			local.x = (local.x / localCoordinateSize) * geometrySize
			local.y = (local.y / localCoordinateSize) * geometrySize

			local.x = i % 3 === 0 ? Math.ceil(local.x) : Math.floor(local.x)
			local.y = i < 2 ? Math.ceil(local.y) : Math.floor(local.y)

			return local
		})
		const start = corners[0].y * (geometrySize + 1) + corners[0].x
		const amplitude = {
			x: (corners[1].x - corners[0].x) / 2 + 2,
			y: (corners[2].y - corners[1].y) / 2 + 2,
		}
		/*const dMax = Math.sqrt(
      amplitude.x * amplitude.x + amplitude.y * amplitude.y,
    )*/

		for (let i = 0; i < corners[2].y - corners[1].y + 1; i++) {
			for (let j = 0; j < corners[1].x - corners[0].x + 1; j++) {
				//renderWalls.add(start + i * (geometrySize + 1) + j)

				const dx = amplitude.x - j
				const dy = amplitude.y - i

				const d =
					(dx * dx) / (amplitude.x * amplitude.x) +
					(dy * dy) / (amplitude.y * amplitude.y)

				/*const d =
          Math.sqrt(dx * dx + dy * dy) /
          (dx > dy ? amplitude.x : amplitude.y)*/

				displacement[start + i * (geometrySize + 1) + j] = Math.max(
					displacement[start + i * (geometrySize + 1) + j],
					1 - Math.pow(d, 1.2),
				)
			}
		}
	})
	geometry.setAttribute(
		'aDisplacement',
		new THREE.BufferAttribute(displacement, 1),
	)
}
