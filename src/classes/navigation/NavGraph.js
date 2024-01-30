import Vector from '../helpers/Vector'
import PriorityQueue from '../helpers/PriorityQueue'

import * as THREE from 'three'

class NavGraphNode {
	position
	extraInfo

	constructor(position, extraInfo = null) {
		this.position = position
		this.extraInfo = extraInfo
	}
}

class NavGraphEdge {
	from
	to
	cost

	constructor(from, to, cost = 1) {
		this.from = from
		this.to = to
		this.cost = cost
	}

	Equals(other) {
		return (
			this.from === other.from &&
			this.to === other.to &&
			this.cost === other.cost
		)
	}
}

export const UNIT_SIZE = 5

class NavGraph {
	width
	height

	nodes
	edges

	/*constructor() {
    this.nodes = [0, 1, 2, 3, 4, 5]
    this.edges = {
      0: [new NavGraphEdge(0, 4, 2.9), new NavGraphEdge(0, 5)],
      1: [new NavGraphEdge(1, 2, 3.1)],
      2: [new NavGraphEdge(2, 4, 0.8)],
      3: [new NavGraphEdge(3, 2, 3.7)],
      4: [new NavGraphEdge(4, 1, 1.9), new NavGraphEdge(4, 5, 3)],
      5: [new NavGraphEdge(5, 3, 1.1)],
    }
  }*/
	constructor(w = 20, h = 20, deadZones, scene) {
		this.width = w
		this.height = h

		this.nodes = new Array((this.width + 1) * (this.height + 1))
		this.edges = {}

		const blockedNodes = new Set()
		if (deadZones?.walls) {
			deadZones.walls.forEach((wall) => {
				// calculate local bounds
				let corners = [
					new Vector(wall[0].x - wall[1].x / 2, wall[0].y + wall[1].y / 2), // top left
					new Vector(wall[0].x + wall[1].x / 2, wall[0].y + wall[1].y / 2), // top right
					new Vector(wall[0].x + wall[1].x / 2, wall[0].y - wall[1].y / 2), // bottom right
					new Vector(wall[0].x - wall[1].x / 2, wall[0].y - wall[1].y / 2), // bottom left
				]

				corners = corners.map((c, i) => {
					const local = this.PositionToLocal(c)
					//trim edges
					local.x = Math.min(Math.max(local.x, 0), this.width)
					local.y = Math.min(Math.max(local.y, 0), this.height)

					local.x = i % 3 === 0 ? Math.ceil(local.x) : Math.floor(local.x)
					local.y = i < 2 ? Math.ceil(local.y) : Math.floor(local.y)

					return local
				})

				const start = this.LocalToIndex(corners[0])
				for (let i = 0; i < corners[2].y - corners[1].y + 1; i++) {
					for (let j = 0; j < corners[1].x - corners[0].x + 1; j++) {
						blockedNodes.add(start + i * (this.width + 1) + j)
					}
				}
			})
		}

		for (let i = 0; i < this.nodes.length; i++) {
			if (blockedNodes.has(i)) continue
			this.nodes[i] = new NavGraphNode(
				this.LocalToPosition(this.IndexToLocal(i)),
			)

			//--- add edges
			const neighbours = this.GetNeighbors(i)
			for (let j = 0; j < neighbours.length; j++) {
				if (neighbours[j] < 0 || neighbours[j] >= this.nodes.length)
					continue
				if (blockedNodes.has(neighbours[j])) continue

				if (!this.edges[i]) this.edges[i] = []
				if (!this.edges[i].find((e) => e?.to === neighbours[j])) {
					this.edges[i].push(
						new NavGraphEdge(i, neighbours[j], j < 4 ? 1 : 1.4),
					)
				}

				/*// non-directed graph
        if (!this.edges[neighbours[j]]) this.edges[neighbours[j]] = []
        if (!this.edges[neighbours[j]].find((e) => e?.to === i)) {
          this.edges[neighbours[j]][i] = new NavGraphEdge(
            neighbours[j],
            i,
            j < 4 ? 1 : 1.4,
          )
        }*/
			}
			//---

			//--- render test
			const pointObj = new THREE.Mesh(
				new THREE.BoxGeometry(0.5, 0.5, 0.2),
				new THREE.MeshBasicMaterial({ color: 'lime' }),
			)
			pointObj.position.x = this.nodes[i].position.x
			pointObj.position.y = this.nodes[i].position.y
			//scene.add(pointObj)
			//---
		}
	}

	PositionToLocal(v) {
		return new Vector((v.x + 50) / UNIT_SIZE, (-v.y + 50) / UNIT_SIZE)
	}

	LocalToPosition(v) {
		return new Vector(v.x * UNIT_SIZE - 50, -v.y * UNIT_SIZE + 50)
	}

	LocalToIndex(v) {
		// x = 0 -> colCount, y = 0 -> rowCount
		if (v.x < 0 || v.x > this.width || v.y < 0 || v.y > this.height) return -1
		return v.y * (this.width + 1) + v.x
	}

	IndexToLocal(i) {
		return new Vector(i % (this.width + 1), Math.floor(i / (this.width + 1)))
	}

	GetNearestNodeIndex(position) {
		const circle = [
			new Vector(
				Math.floor(position.x / UNIT_SIZE) * UNIT_SIZE,
				Math.floor(position.y / UNIT_SIZE) * UNIT_SIZE,
			),
			new Vector(
				Math.floor(position.x / UNIT_SIZE) * UNIT_SIZE,
				Math.ceil(position.y / UNIT_SIZE) * UNIT_SIZE,
			),
			new Vector(
				Math.ceil(position.x / UNIT_SIZE) * UNIT_SIZE,
				Math.floor(position.y / UNIT_SIZE) * UNIT_SIZE,
			),
			new Vector(
				Math.ceil(position.x / UNIT_SIZE) * UNIT_SIZE,
				Math.ceil(position.y / UNIT_SIZE) * UNIT_SIZE,
			),
		].sort((a, b) => a.DistanceSq(position) - b.DistanceSq(position))

		for (let i = 0; i < circle.length; i++) {
			const local = this.PositionToLocal(circle[i])
			const index = this.LocalToIndex(local)
			if (index > 0 && index < this.nodes.length && !!this.nodes[index])
				return index
		}

		return -1
	}

	GetNeighbors(i) {
		return [
			// weight = 1
			i - this.width - 1, // top
			(i + 1) % (this.width + 1) === 0 ? -1 : i + 1, // right
			i + this.width + 1, // bottom
			i % (this.width + 1) === 0 ? -1 : i - 1, // left

			//weight = 1.4
			i % (this.width + 1) === 0 ? -1 : i - this.width - 2, // top left
			(i + 1) % (this.width + 1) === 0 ? -1 : i - this.width, // top right
			(i + 1) % (this.width + 1) === 0 ? -1 : i + this.width + 2, // bottom right
			i % (this.width + 1) === 0 ? -1 : i + this.width, //bottom left
		].filter((j) => j >= 0 && j < this.nodes.length)
	}

	SearchDijkstra(source, target, indexed) {
		if (!this.nodes[source]) return []
		const spt = {}
		const frontier = {}
		const costs = {}
		const pq = new PriorityQueue()
		pq.Enqueue(source, 0)

		while (!pq.IsEmpty()) {
			const currNode = pq.Dequeue()

			spt[currNode] = frontier[currNode]

			if (currNode === target) {
				return this.GetPathFromSPT(spt, source, target, indexed)
			}

			for (let edge of this.edges[currNode]) {
				const newCost = costs[currNode] + edge.cost

				if (!frontier[edge.to]) {
					frontier[edge.to] = currNode
					costs[edge.to] = newCost
					pq.Enqueue(edge.to, newCost)
				} else if (newCost < costs[edge.to] && !spt[edge.to]) {
					frontier[edge.to] = currNode
					costs[edge.to] = newCost
					pq.ChangePriority(edge.to, newCost)
				}
			}
		}
		return this.GetPathFromSPT(spt, source, target, indexed)
	}

	SearchAStar(source, target, exclude = [], indexed = false) {
		// heuristic optimization only works when target is provided
		if (!this.nodes[source] || !this.nodes[target]) return []

		const spt = {}
		const frontier = {}
		//const finalCosts = {}
		const costs = {}
		const pq = new PriorityQueue()
		pq.Enqueue(source, 0)

		while (!pq.IsEmpty()) {
			const currNode = pq.Dequeue()

			spt[currNode] = frontier[currNode]

			if (currNode === target) {
				return this.GetPathFromSPT(spt, source, target, indexed)
			}

			for (let edge of this.edges[currNode]) {
				if (exclude.includes(edge.to)) continue

				const heuristicCost = this.nodes[edge.to].position.DistanceSq(
					this.nodes[target].position,
				)
				const graphCost = costs[currNode] + edge.cost

				const finalCost = graphCost + heuristicCost

				if (!frontier[edge.to]) {
					frontier[edge.to] = currNode
					costs[edge.to] = graphCost
					//finalCosts[edge.to] = finalCost
					pq.Enqueue(edge.to, finalCost)
				} else if (graphCost < costs[edge.to] && !spt[edge.to]) {
					frontier[edge.to] = currNode
					costs[edge.to] = graphCost
					//finalCosts[edge.to] = finalCost
					pq.ChangePriority(edge.to, finalCost)
				}
			}
		}
		return this.GetPathFromSPT(spt, source, target, indexed)
	}

	GetPathFromSPT(spt, source, target, indexed = false) {
		if (target) {
			const path = []
			let key = target
			if (!spt[target]) return []
			while (key && key !== source) {
				path.push(
					indexed ? key : this.LocalToPosition(this.IndexToLocal(key)),
				)
				key = spt[key]
			}
			path.push(
				indexed ? source : this.LocalToPosition(this.IndexToLocal(source)),
			)
			return path.reverse()
		} else {
			//construct paths to all nodes
			const paths = {}
			for (let key in spt) {
				const path = []
				let i = parseInt(key)
				if (!spt[i]) continue
				while (i !== source) {
					path.push(
						indexed ? i : this.LocalToPosition(this.IndexToLocal(i)),
					)
					i = spt[i]
				}
				path.push(
					indexed
						? source
						: this.LocalToPosition(this.IndexToLocal(source)),
				)
				paths[key] = path.reverse()
			}
			return paths
		}
	}
}

export default NavGraph
