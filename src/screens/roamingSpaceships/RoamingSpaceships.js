import Container from '../../web-components/container/Container'

import classes from '../ProjectScreen.module.scss'
import Timelapse from '../../assets/videos/roaming_spaceships_playthrough.mp4'

const RoamingSpaceships = () => {
	return (
		<Container className={classes.content}>
			<h1>Roaming Spaceships - Game Programming Fundamentals</h1>
			<div className={classes.mediaContainer}>
				<div>
					<video src={Timelapse} autoPlay={true} loop={true} muted={true} controls={true}></video>
				</div>
				<div/>
			</div>
			<p>
				This was my first game programming project, focusing on learning core
				AI and navigation systems from scratch.
				The main challenge was implementing autonomous NPC behavior
				and pathfinding algorithms for a fundamental architecture. I wrote the codebase in
				JavaScript using Three.js for visualization, which provided a great way to test AI behaviors
				while also allowing me to play around with some small custom shaders for visual presentation.
			</p>
			<p>
				The demo features a main character navigating through an environment populated with
				obstacles and enemy NPCs, with all behavior driven by AI systems rather than player input.
			</p>
			<ul className={classes.listMain}>
				<li>
					<span>Core AI Systems:</span>
					<ul>
						<li>
							Finite State Machine: Implemented behavior states for NPCs including
							roaming, patrolling, chasing, and combat modes with transition logic based on environmental triggers.
						</li>
						<li>
							Steering Behaviors: Built movement patterns including path following, wandering, seek/flee,
							and basic flocking for group NPC coordination.
						</li>
						<li>
							Pathfinding & Navigation: A* algorithm implementation with dynamic navigation mesh generation based on obstacle placement,
							including adaptive path reconstruction when routes become blocked.
						</li>
					</ul>
				</li>
			</ul>

			<p>
				This demonstration can be found{' '}
				<a href={'/#/roaming-spaceships/demo'} target={'_blank'}>
					here
				</a>
				, and the source code for the entire project (alongside this
				portfolio website) <a href={'https://github.com/anastasia685/game-portfolio'} target={'_blank'}>here</a>.
			</p>
		</Container>
	)
}

export default RoamingSpaceships
