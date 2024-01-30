import { Link } from 'react-router-dom'
import Container from '../../web-components/container/Container'

import classes from './RoamingSpaceships.module.scss'

const RoamingSpaceships = () => {
	return (
		<Container className={classes.content}>
			<h1>Roaming Spaceships</h1>
			<p>
				With this project I aimed to explore fundamental setup of a game
				program – structuring different game entities and managing
				information exchange in between updates, while also delving into the
				core concepts of autonomous NPC behavior and their implementation.
			</p>
			<p>
				To comprehensively understand the fundamental principles, I made a
				deliberate effort to implement various functionalities from the
				ground up ranging from basic vector and matrix classes to finite
				state machine, path-finding algorithms and steering behavior
				managers.
			</p>
			<p>
				Regarding the technologies I utilized, I chose to rewrite my
				original codebase in C++ to JavasScript. This decision provided some
				technical difficulties (such as lack of various different
				structuring features, to say the least), but it also provided me
				with more ways to quickly and effectively showcase the visual aspect
				of the program.
			</p>
			<p>
				For the visual representation I decided to leverage the capabilities
				of the three.js library as the rendering engine. In the
				implementation, game entities were assigned a corresponding render
				object, which in this case was a three.js mesh responsible for
				representing the entity visually. This design approach allowed for a
				seamless integration of the underlying game logic with the visual
				elements, as well as keeping the core mechanics independent from any
				particular render engine.
			</p>
			<p>
				Furthermore, I opted to use ShaderMaterial for my three.js mesh
				objects, which allowed me to greatly customize the look of the game
				environment, as well as showcase my skills with OpenGL shader
				language.
			</p>
			<p>
				Before I go on to describe what the demo of this program features, I
				should emphasize that this project was in no means crafted with the
				intention of becoming a fully-fledged game in the traditional sense.
				Unlike conventional games, it lacks human interaction and engaging
				goals or objectives. Instead the primary focus of this project was
				educational, serving as a learning endeavor for game programming
				fundamentals. But, despite that original intention, I believe that
				the final product I ended up with still has potential to be used as
				a toolkit or a building block for any future game projects.
			</p>
			<p>
				The demonstration of the game illustrates how a main character
				dynamically navigates through the environment, encountering
				obstacles, enemies and adapting its behavior accordingly. Detailed
				steps are the following:
			</p>
			<ol className={classes.listMain}>
				<li>
					<span>Reading sizes and locations of walls/obstacles:</span>
					<ul>
						<li>
							The game starts by reading the configuration file to obtain
							information about the sizes and locations of any
							obstacles/blocked off areas within the environment.
						</li>
						<li>
							This information is used to initialize game entity objects
							for these obstacles and add them to scene.
						</li>
					</ul>
				</li>
				<li>
					<span>Game entity positions, paths and objectives:</span>
					<ul>
						<li>
							The positions and optional paths or any virtual bounds of
							moving game entities, including the main character and
							enemies, are also defined in the configuration file.
						</li>
						<li>
							The game processes this data to instantiate and position
							entities accordingly and assigning them their default
							behavior, which is to just roam the environment or follow
							their path.
						</li>
						<li>
							The main character is spawned in the game world at a
							specified location, and its objective is set based on
							information provided in the configuration file.
						</li>
					</ul>
				</li>
				<li>
					<span>Navigation mesh generation:</span>
					<ul>
						<li>
							A navigation mesh is generated based on the map and all the
							blocked-off areas the obstacles occupy, allowing for
							efficient path-finding and navigation for the main
							character.
						</li>
					</ul>
				</li>
				<li>
					<span>
						Path-finding to objective and adaptive path reconstruction:
					</span>
					<ul>
						<li>
							The main character calculates the shortest path to its
							objective using the generated navigation mesh and starts to
							follow it.
						</li>
						<li>
							During this process, if the main character finds that the
							originally calculated path is blocked by enemies, it marks
							the surrounding area inaccessible and reconstructs a new
							path.
						</li>
					</ul>
				</li>
				<li>
					<span>Handling blocked paths:</span>
					<ul>
						<li>
							If, at any point, the main character can no longer
							construct a path due to game’s static obstacles or its own
							list of blocked off areas, where enemies were spotted, it
							decides to ignore the blocked-off area with the least
							amount of enemies and most recent encounter and proceeds
							along that route.
						</li>
						<li>
							During this process, if the main character encounters any
							enemies, it engages in combat, shooting the closest one.
						</li>
						<li>
							The main character continuously evaluates its path to
							objective, exiting the ‘combat mode’ as soon as it has
							passed the enemy zone.
						</li>
					</ul>
				</li>
			</ol>

			<p>
				This demonstration can be found{' '}
				<a href={'/roaming-spaceships/demo'} target={'_blank'}>
					here
				</a>
				, and the source code for the entire project (alongside this
				portfolio website) <a href={'https://github.com/a-iosebadze/game-portfolio'} target={'_blank'}>here</a>.
			</p>
		</Container>
	)
}

export default RoamingSpaceships
