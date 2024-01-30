import Entity from './Entity'

class Obstacle extends Entity {
	/*static obstacle_type = {
    none: 0x00000,
    wall: 0x00002,
    rock: 0x00004,
  }*/

	constructor(
		/*type = Obstacle.obstacle_type.rock,*/
		position,
		scale,
		boundingRadius,
		color,
	) {
		super(position, scale, boundingRadius, color)
		//this.type = type
	}

	Update() {}

	Render() {}
}
