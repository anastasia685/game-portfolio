import Vector from '../classes/helpers/Vector'
import Path from '../classes/Path'
import Wall from '../classes/Wall'

export default {
	walls: [
		//--- edge walls
		[new Vector(0, 50), new Vector(100, 2)],
		[new Vector(0, -50), new Vector(100, 2)],
		[new Vector(-50, 0), new Vector(2, 100)],
		[new Vector(50, 0), new Vector(2, 100)],
		//---

		[new Vector(-40, 27.5), new Vector(20, 5)],
		[new Vector(-25, 45), new Vector(10, 10)],
		[new Vector(12.5, 30), new Vector(5, 40)],
		[new Vector(2.5, 12.5), new Vector(25, 5)],
		[new Vector(2.5, 45), new Vector(15, 10)],
		[new Vector(-12.5, 17.5), new Vector(5, 15)],
		[new Vector(-40, 0), new Vector(2, 30)],
		[new Vector(-17.5, -27.5), new Vector(35, 5)],
		[new Vector(-27.5, 5), new Vector(5, 10)],
		[new Vector(-25, 0), new Vector(10, 10)],
		[new Vector(-7.5, -2.5), new Vector(35, 5)],
		[new Vector(-2.5, -25), new Vector(5, 10)],
		[new Vector(-22.5, -45), new Vector(15, 10)],
		[new Vector(20, -40), new Vector(10, 20)],
		[new Vector(32.5, 40), new Vector(5, 20)],
		[new Vector(45, 12.5), new Vector(10, 5)],
		[new Vector(40, -10), new Vector(20, 10)],
		/*[new Vector(35, -32.5), new Vector(2, 15)],*/
	],
	enemies: [
		{
			position: new Vector(-45, 10),
			path: new Path([new Vector(-45, 10), new Vector(-45, -10)], true),
			// virtualBound
		},
		//--- camp 1
		{
			position: new Vector(-5, 18),
			bounds: [
				/*new Wall(new Vector(-10, 25), new Vector(-10, 32)),*/
				new Wall(new Vector(-10, 25), new Vector(10, 25)),
			],
		},
		{
			position: new Vector(0, 23),
			bounds: [
				/*new Wall(new Vector(-10, 25), new Vector(-10, 32)),*/
				new Wall(new Vector(-10, 25), new Vector(10, 25)),
			],
		},
		{
			position: new Vector(5, 17),
			bounds: [
				/*new Wall(new Vector(-10, 25), new Vector(-10, 32)),*/
				new Wall(new Vector(-10, 25), new Vector(10, 25)),
			],
		},
		//---
		{
			position: new Vector(40, -25),
			path: new Path(
				[
					new Vector(45, -25),
					new Vector(40, -45),
					new Vector(30, -40),
					new Vector(40, -45),
				],
				true,
			),
			// virtualBound
		},
		//--- camp 2
		{
			position: new Vector(45, 46),
			bounds: [
				new Wall(new Vector(50, 30), new Vector(35, 30)),
			],
		},
		{
			position: new Vector(40, 37),
			bounds: [
				new Wall(new Vector(50, 30), new Vector(35, 30)),
			],
		},
		//---
		{
			position: new Vector(25, 40),
			path: new Path(
				[
					new Vector(25, 46),
					new Vector(19, 38),
					new Vector(27, 33)
				],
				true,
			),
			// virtualBound
		},
		/*{
			position: new Vector(10, -45),
			path: new Path(
				[
					new Vector(10, -45),
					new Vector(-10, -45),
					new Vector(5, -40),
				],
				true,
			),
			// virtualBound
		},*/
		{
			position: new Vector(5, -35),
			path: new Path(
				[
					new Vector(5, -35),
				],
				true,
			),
			// virtualBound
		},
		//--- camp 3
		{
			position: new Vector(-45, 45),
			bounds: [
				new Wall(new Vector(-30, 40), new Vector(-30, 30)),
			],
		},
		{
			position: new Vector(-40, 37),
			bounds: [
				new Wall(new Vector(-30, 40), new Vector(-30, 30)),
			],
		},
		//---
		/*{
			position: new Vector(45, 2),
			path: new Path(
				[
					new Vector(45, 0),
					new Vector(25, 0),
					new Vector(20, -15),
					new Vector(25, 0),
				],
				true,
			),
			// virtualBound
		},*/
		{
			position: new Vector(20, -3),
			path: new Path(
				[
					new Vector(20, -5)
				],
				true,
			),
			// virtualBound
		},


		/*{
			position: new Vector(-32, -25),
			path: new Path(
				[
					new Vector(-30, -25),
					new Vector(-15, -15),
					new Vector(-10, -20),
				],
				true,
			),
			// virtualBound
		},*/
		{
			position: new Vector(-17, -15),
			path: new Path(
				[
					new Vector(-15, -15),
				],
				true,
			),
			// virtualBound
		},
	],
	objective: new Vector(-45, -35)
}
