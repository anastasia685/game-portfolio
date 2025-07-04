import classes from './Home.module.scss'
import { Link } from 'react-router-dom'
import Card from '../../web-components/card/Card'
import Container from '../../web-components/container/Container'

import SDFImage from '../../assets/images/sdf_preview.png'
import CloudsImage from '../../assets/images/clouds.png'
import WavesImage from '../../assets/images/waves.png'
import FishingImage from '../../assets/images/fish_everywhere.png'
import SocketsImage from '../../assets/images/shooting_squares.png'
import RoamingSpaceshipsImage from '../../assets/images/roaming_ships.png'
import TerrainGeneratorImage from '../../assets/images/terrain_map.png'

import GithubIcon from '../../assets/icons/github.png'
import LinkedInIcon from '../../assets/icons/linkedin.png'

import Portrait from '../../assets/images/film_portrait.JPG'

const Home = () => {
	return (
		<Container className={classes.container}>
			<h1>About Me</h1>
			<section className={classes.aboutContainer}>
				<div className={classes.imageWrapper}>
					<div
						className={classes.imageContainer}
						style={{ backgroundImage: `url(${Portrait})` }}
					/>
				</div>
				<div className={classes.description}>
					<p>I'm a senior web application engineer transitioning into graphics and game system programming.</p>
					<p>
						Throughout my career, I've found ways to incorporate my interests in
						literature, music, art, and photography into my work,
						which eventually led me to realize that video games
						are the perfect intersection of all these passions -
						combining storytelling, visual design, and technical challenges.
					</p>
					<div>
						<a href={'https://github.com/anastasia685'} target={'_blank'}><img src={GithubIcon}/></a>
						<a href={'https://linkedin.com/in/anastasia-iosebadze-211753174'} target={'_blank'}><img src={LinkedInIcon}/></a>
					</div>
				</div>
			</section>
			<h1>Projects</h1>
			<section className={classes.projectsContainer}>
				<Link to={'/selective-sdf'}>
					<Card
						title={'Selective SDF: WIP'}
						image={SDFImage}
						description={
							'A hybrid SDF-polygon rendering pipeline for selectively applying signed distance-based effects - master\'s thesis research.'
						}
					>
						<a
							href={'https://github.com/anastasia685/SelectiveSDF'}
							onClick={(e) => e.stopPropagation()}
							target={'_blank'}
						>
							Source Page
						</a>
					</Card>
				</Link>
				<Link to={'/volumetric-fluid-sim'}>
					<Card
						title={'Volumetric Fluid Simulation'}
						image={CloudsImage}
						description={
							'A real-time simulation of volumetric clouds flowing over fBm terrain, powered by computer fluid dynamics and procedural noise.'
						}
					>
						<a
							href={'https://github.com/anastasia685/VolumetricFluidSim'}
							onClick={(e) => e.stopPropagation()}
							target={'_blank'}
						>
							Source Page
						</a>
					</Card>
				</Link>
				<Link to={'/dx11-demo'}>
					<Card
						title={'Directx11 Graphics Demo'}
						image={WavesImage}
						description={
							'A real-time DirectX 11 scene featuring procedurally animated water with dynamic tessellation ' +
							'different light types, shadow mapping, post-processing, etc.'
						}
					>
						<a
							href={'https://github.com/anastasia685/Waves'}
							onClick={(e) => e.stopPropagation()}
							target={'_blank'}
						>
							Source Page
						</a>
					</Card>
				</Link>
				<Link to={'/fish-everywhere'}>
					<Card
						title={'Fish Everywhere'}
						image={FishingImage}
						description={
							'A collectathon with procedurally generated minigames made in Unity alongside arts and design undergraduate students.'
						}
					>
						<a
							href={''}
							onClick={(e) => e.stopPropagation()}
							target={'_blank'}
						>
							Source Page
						</a>
					</Card>
				</Link>
				<Link to={'/socket-demo'}>
					<Card
						title={'Async Sockets Demo'}
						image={SocketsImage}
						description={
							'A client-server application exploring asynchronous communication and lag compensation techniques.'
						}
					>
						<a
							href={''}
							onClick={(e) => e.stopPropagation()}
							target={'_blank'}
						>
							Source Page
						</a>
					</Card>
				</Link>
				<Link to={'/roaming-spaceships'}>
					<Card
						title={'Roaming Spaceships'}
						image={RoamingSpaceshipsImage}
						description={
							'A 3D game-like simulation of a spaceship navigating a map, avoiding obstacles and engaging in combat with enemies.'
						}
					>
						<Link
							to={'/roaming-spaceships/demo'}
							onClick={(e) => e.stopPropagation()}
						>
							Demonstration Page
						</Link>
						<a
							href={'https://github.com/anastasia685/game-portfolio'}
							onClick={(e) => e.stopPropagation()}
							target={'_blank'}
						>
							Source Page
						</a>
					</Card>
				</Link>
				<Link to={'/terrain-generator'}>
					<Card
						title={'Terrain Generator'}
						image={TerrainGeneratorImage}
						description={
							'A tool that transforms a given image, serving as a crude layout of the landscape, into a dynamic heightmap.'
						}
					>
						<a
							href={
								'https://drive.google.com/file/d/1jgNq3_WIxldxmn69wuxQhiLSEpaZ4B0D/view?usp=drive_link'
							}
							onClick={(e) => e.stopPropagation()}
							target={'_blank'}
						>
							Source File
						</a>
						<a
							href={
								'https://drive.google.com/file/d/1EKZi98CvqnLOihhtAUdI0_VYtOUIZ0xT/view?usp=drive_link'
							}
							onClick={(e) => e.stopPropagation()}
							target={'_blank'}
						>
							Example Usage File
						</a>
					</Card>
				</Link>
			</section>

			{/*<h1>Previous Experience</h1>
			<h1>Side Quests</h1>*/}
		</Container>
	)
}

export default Home
