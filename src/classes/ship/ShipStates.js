import State from '../fsm/State'
import Steering from './Steering'
import Path from '../Path'
import Vector from '../helpers/Vector'
import PriorityQueue from '../helpers/PriorityQueue'

export class GlobalShipState extends State {
	static Instance = new GlobalShipState()

	Enter(ship) {
		// wall avoidance
		{
			ship.steering.On(Steering.behavior_type.wall_avoidance)
			/*this.wallDetectorsRenderObject = new THREE.Group()
      this.movingEntity.world.scene.add(this.wallDetectorsRenderObject)*/
		}

		// obstacle avoidance
		ship.steering.On(Steering.behavior_type.entity_avoidance)
	}

  Execute(ship) {}

  Exit(ship) {
		// wall avoidance
		{
			ship.steering.Off(Steering.behavior_type.wall_avoidance)
			/*this.wallDetectorsRenderObject = new THREE.Group()
      this.movingEntity.world.scene.add(this.wallDetectorsRenderObject)*/
		}

		// obstacle avoidance
		ship.steering.Off(Steering.behavior_type.entity_avoidance)
	}

	OnMessage(ship, msg) {
		switch (msg.msg) {
			/*case 'returnHome':
        ship.stateMachine.ChangeState(ReturnHomeShipState.Instance)
        return true
      case 'search':
        ship.stateMachine.ChangeState(SearchShipState.Instance)
        return true
      case 'attack':
        ship.stateMachine.ChangeState(AttackShipState.Instance)
        return true*/
			case 'getShot':
				ship.health -= msg.extraInfo?.damage /* || 20*/
				ship.world.messageDispatcher.DispatchMessage(
					0,
					ship.id,
					ship.id,
					'changeColor',
					{ color: 'red' },
				)
				ship.world.messageDispatcher.DispatchMessage(
					50,
					ship.id,
					ship.id,
					'changeColor',
					{ color: '#3765a6' },
				)
				if (ship.health <= 0) {
					ship.world.scene.remove(ship.renderObject)
					delete ship.world.ships[ship.id]
				}
				return true
			case 'changeColor':
				ship.renderObject.material.color.set(msg.extraInfo.color)

				return true
		}
		return false
	}
}

export class IdleShipState extends State {
	static Instance = new IdleShipState()

	Enter(ship) {
		// lower max speed
		ship.maxSpeed *= 0.5

		//--- switch wall avoidance, obstacle avoidance, wander & path following on

		// path following
		ship.steering.On(Steering.behavior_type.follow_path)

		// wander
		{
			ship.steering.On(Steering.behavior_type.wander)
			//this.movingEntity.world.scene.add(this.wanderTargetRenderObject)
		}

		/*//flock
    {
      this.On(Steering.behavior_type.separation)
      this.On(Steering.behavior_type.alignment)
      this.On(Steering.behavior_type.cohesion)
    }*/
	}

	Execute(ship) {}

	Exit(ship) {
		// reset max speed
		ship.maxSpeed /= 0.5

		//--- switch wander & path following off

		// path following
		ship.steering.Off(Steering.behavior_type.follow_path)

		// wander
		{
			ship.steering.Off(Steering.behavior_type.wander)
			//this.movingEntity.world.scene.remove(this.wanderTargetRenderObject)
		}
	}

	/*OnMessage(ship, msg) {}*/
}

export class SearchShipState extends State {
	static Instance = new SearchShipState()

	Enter(ship) {
		if (!ship.dangerZones) ship.dangerZones = new PriorityQueue()
		//--- switch wall avoidance, obstacle avoidance, wander & path following on

		// wander
		{
			ship.steering.On(Steering.behavior_type.wander)
			//this.movingEntity.world.scene.add(this.wanderTargetRenderObject)
		}

		//--- construct path to objective
		if (ship.world.objective) {
			if (ship.path?.renderObject)
				ship.world.scene.remove(ship.path.renderObject)

			ship.path = new Path(
				ship.world.navMesh.SearchAStar(
					ship.world.navMesh.GetNearestNodeIndex(ship.position),
					ship.world.navMesh.GetNearestNodeIndex(ship.world.objective),
					ship.dangerZones.values.flatMap((index) =>
						ship.world.navMesh
							.GetNeighbors(index.value)
							.concat(index.value),
					),
				),
			)
			ship.path.Render(ship.world)
		}

		//--- switch path following on
		ship.steering.On(Steering.behavior_type.follow_path)
	}

	Execute(ship) {
		// if objective reached - set ship state to null
		if (ship.path.index === ship.path.points.length) {
			ship.stateMachine.ChangeState(null)
		}

		if (ship.pathRegulator.IsReady()) {
			// if enemy encountered - reconstruct path to objective
			if (ship.neighbors?.length > 0) {
				const thisNeighbors = ship.neighbors
					.map((id) => ({
						id,
						marked: false,
					}))
					.sort((a, b) => {
						const aPos = ship.world.ships[a.id].position
						const bPos = ship.world.ships[b.id].position
						return (
							Vector.Sub(ship.position, aPos).LengthSq() -
							Vector.Sub(ship.position, bPos).LengthSq()
						)
					})

				for (let neighbor of thisNeighbors) {
					if (neighbor.marked) continue

					const positionIndex = ship.world.navMesh.GetNearestNodeIndex(
						ship.world.ships[neighbor.id].position,
					)
					ship.dangerZones.values = ship.dangerZones.values.filter(
						(v) =>
							!(
								v.value === positionIndex ||
								ship.world.navMesh
									.GetNeighbors(v.value)
									.includes(positionIndex)
							),
					)

					let priority = 1
					thisNeighbors.forEach((n) => {
						if (
							ship.world.navMesh
								.GetNeighbors(positionIndex)
								.includes(
									ship.world.navMesh.GetNearestNodeIndex(
										ship.world.ships[n.id].position,
									),
								)
						) {
							priority++
							n.marked = true
						}
					})

					neighbor.marked = true

					ship.dangerZones.Enqueue(positionIndex, priority)
				}

				// reconstruct path only if path is blocked
				const dangerZonesFlat = ship.dangerZones.values.flatMap((index) =>
					ship.world.navMesh.GetNeighbors(index.value).concat(index.value),
				)
				const pathBlocked = ship.path.points.some((i) =>
					dangerZonesFlat.includes(
						ship.world.navMesh.LocalToIndex(
							ship.world.navMesh.PositionToLocal(i),
						),
					),
				)
				if (pathBlocked) {
					if (ship.path?.renderObject)
						ship.world.scene.remove(ship.path.renderObject)
					ship.path = new Path(
						ship.world.navMesh.SearchAStar(
							ship.world.navMesh.GetNearestNodeIndex(ship.position),
							ship.world.navMesh.GetNearestNodeIndex(
								ship.world.objective,
							),
							dangerZonesFlat,
						),
					)
				}
				if (ship.path.points.length === 0)
					ship.stateMachine.ChangeState(AttackShipState.Instance)
				else ship.path.Render(ship.world)
			}
		}
	}

	Exit(ship) {
		//--- wander & path following off

		// path following
		ship.steering.Off(Steering.behavior_type.follow_path)

		// wander
		{
			ship.steering.Off(Steering.behavior_type.wander)
			//this.movingEntity.world.scene.remove(this.wanderTargetRenderObject)
		}

		//--- clear path
		if (ship.path?.renderObject)
			ship.world.scene.remove(ship.path.renderObject)
		ship.path = null
	}

	/*OnMessage(ship, msg) {}*/
}

export class AttackShipState extends State {
	static Instance = new AttackShipState()

	Enter(ship) {
		//--- wander & path following on

		// wander
		{
			ship.steering.On(Steering.behavior_type.wander)
			//this.movingEntity.world.scene.add(this.wanderTargetRenderObject)
		}

		const tempDangerZones = new PriorityQueue([...ship.dangerZones.values])
		tempDangerZones.Dequeue()
		if (ship.path?.renderObject)
			ship.world.scene.remove(ship.path.renderObject)
		ship.path = new Path(
			ship.world.navMesh.SearchAStar(
				ship.world.navMesh.GetNearestNodeIndex(ship.position),
				ship.world.navMesh.GetNearestNodeIndex(ship.world.objective),
				tempDangerZones.values.flatMap((index) =>
					ship.world.navMesh.GetNeighbors(index.value).concat(index.value),
				),
			),
		)
		ship.path.Render(ship.world, 'blue')

		//--- switch path following on
		ship.steering.On(Steering.behavior_type.follow_path)
	}

	Execute(ship) {
		if (ship.path.index === ship.path.points.length) {
			ship.stateMachine.ChangeState(null)
		}

		// enemies in view range
		if (ship.path?.points?.length > 0 && ship.neighbors?.length > 0) {
			let closestEnemy
			let closestDist = Infinity

			const enemies = ship.neighbors.filter((n) => {
				const dist = ship.position.DistanceSq(ship.world.ships[n].position)
				const shouldTag = dist < ship.dangerRadius ** 2
				if (shouldTag && dist < closestDist) {
					closestDist = dist
					closestEnemy = n
				}
				return shouldTag
			})

			if (enemies.length > 0) {
				// kill enemies

				ship.steering.Off(Steering.behavior_type.follow_path)
				ship.steering.Off(Steering.behavior_type.entity_avoidance)
				ship.target = ship.world.ships[closestEnemy]
				//ship.offset = new Vector(0, 7)
				ship.offset = new Vector(0, 5)

				ship.steering.On(Steering.behavior_type.distance)

				if (ship.weaponRegulator.IsReady() && closestDist < 8 ** 2) {
					ship.world.messageDispatcher.DispatchMessage(
						0,
						ship.id,
						closestEnemy,
						'getShot',
						{ damage: 10 },
					)
				}
			} // if no enemies, check if path is clear
			else {
				ship.steering.Off(Steering.behavior_type.distance)
				ship.steering.On(Steering.behavior_type.follow_path)
				ship.steering.On(Steering.behavior_type.entity_avoidance)

				if (ship.pathRegulator.IsReady()) {
					const path = new Path(
						ship.world.navMesh.SearchAStar(
							ship.world.navMesh.GetNearestNodeIndex(ship.position),
							ship.world.navMesh.GetNearestNodeIndex(
								ship.world.objective,
							),
							ship.dangerZones.values.flatMap((index) =>
								ship.world.navMesh
									.GetNeighbors(index.value)
									.concat(index.value),
							),
						),
					)
					if (path.points.length > 0) {
						ship.dangerZones.Dequeue()
						ship.stateMachine.ChangeState(SearchShipState.Instance)
					}
				}
			}
		} else {
			ship.steering.Off(Steering.behavior_type.distance)
			ship.steering.On(Steering.behavior_type.entity_avoidance)
			ship.steering.On(Steering.behavior_type.follow_path)
		}
	}

	Exit(ship) {
		// switch wall avoidance, obstacle avoidance, wander & path following off
		//--- wander & path following off

		// path following
		ship.steering.Off(Steering.behavior_type.follow_path)

		// wander
		{
			ship.steering.Off(Steering.behavior_type.wander)
			//this.movingEntity.world.scene.remove(this.wanderTargetRenderObject)
		}

		//--- clear path
		if (ship.path?.renderObject)
			ship.world.scene.remove(ship.path.renderObject)
		ship.path = null

		ship.steering.Off(Steering.behavior_type.distance)

		ship.target = null
		ship.offset = null
	}

	/*OnMessage(ship, msg) {}*/
}
