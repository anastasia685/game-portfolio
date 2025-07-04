import Container from '../../web-components/container/Container'
import Timelapse1 from '../../assets/videos/fishing_minigame1.mp4'
import Timelapse2 from '../../assets/videos/fishing_minigame2.mp4'
import Snap1 from '../../assets/images/fishing_snap1.png'

import classes from '../ProjectScreen.module.scss'

const FishEverywhere = () => {
	return (
		<Container className={classes.content}>
			<h1>Fish Everywhere - Game Development Project</h1>
			<div className={classes.mediaContainer}>
				<div>
					<img src={Snap1} alt={'snapshot 1'}/>
				</div>
				<div style={{display: 'flex'}}>
					<div><video src={Timelapse1} autoPlay={true} loop={true} muted={true}></video></div>
					<div><video src={Timelapse2} autoPlay={true} loop={true} muted={true}></video></div>
				</div>
			</div>
			<p>
				This project involved developing a cozy atmospheric fishing game in Unity,
				focusing on procedural content generation and system architecture.
				The main technical challenges were implementing a flexible data management system
				and creating two distinct minigame mechanics with appropriate difficulty scaling.
				I also contributed to the initial design ideation - both final minigames ended up being my prototypes,
				which was a fun departure from pure programming.
				I emphasized building modular systems to support collaboration with the art and design team.
			</p>
			<h3>List of features:</h3>
			<ul className={classes.listMain}>
				<li>
					<span>Data Management Architecture:</span>
					<ul>
						<li>
							Three-layer system separating static ScriptableObjects, runtime gameplay models, and serializable save data.
						</li>
						<li>
							Automatic UI generation from data models, allowing content addition without touching code.
						</li>
						<li>
							Interface-based persistence system that handles scene transitions and singleton manager lifecycle.
						</li>
					</ul>
				</li>
				<li>
					<span>Minigame Systems:</span>
					<ul>
						<li>
							Procedural maze generation using Reverse Aldous-Broder algorithm with pathfinding to ensure solvability and intelligent enemy patrol routes.
						</li>
						<li>
							Physically-rooted target chasing mechanic with configurable parameters (movement coefficients, scoring rates) exposed through Unity Inspector.
						</li>
						<li>
							Difficulty scaling through parameter adjustment and time constraints, as well as global player stats incremented through progression.
						</li>
					</ul>
				</li>
				<li>
					<span>Gameplay Systems:</span>
					<ul>
						<li>
							Weighted loot pools with environment-specific distributions and rarity scaling.
						</li>
						<li>
							Skill progression system with dynamic buffs affecting RNG, timing, and difficulty.
						</li>
						<li>
							Inventory system tracking catch statistics and progression metrics.
						</li>
					</ul>
				</li>
				<li>
					<span>
						Small Render-Related Tasks:
					</span>
					<ul>
						<li>
							Dithering-based player visibility system that avoids alpha transparency issues with composite meshes.
						</li>
						<li>
							Surface shader enabling 3D lighting on 2D tile sprites (Unity Tilemap limitation workaround).
						</li>
						<li>
							Perlin noise ground mapping shader for visualizing different loot pool regions (early development-only).
						</li>
					</ul>
				</li>
			</ul>
			<p>
				The source code for the project can be found <a href={'https://github.com/anastasia685/FishEverywhere'} target={'_blank'}>here</a>.
			</p>
		</Container>
	)
}

export default FishEverywhere
