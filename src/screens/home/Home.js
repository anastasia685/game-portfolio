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

import LiderbetImage from '../../assets/images/work/liderbet.png'
import TsignebisTaroImage from '../../assets/images/work/tsignebis_taro.jpg'
import CoinmaniaImage from '../../assets/images/work/coinmania.png'

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
						So I'm very excited for any opportunity to explore this field in greater detail.
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
						title={'Selective SDF'}
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
							Source
						</a>
						<a
							href={'https://anastasia685.github.io/game-portfolio/Dissertation.pdf'}
							onClick={(e) => e.stopPropagation()}
							target={'_blank'}
						>
							Dissertation
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
							Source
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
							Source
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
							Source
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
							Source
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
							Demonstration
						</Link>
						<a
							href={'https://github.com/anastasia685/game-portfolio'}
							onClick={(e) => e.stopPropagation()}
							target={'_blank'}
						>
							Source
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

			<h1>Previous Experience</h1>
			<p style={{marginBottom: '3rem'}}>I've been programming professionally since my senior year of high school and
				have accumulated nearly 8 years of experience with various tech and tech-related solutions.
			</p>
			<div className={classes.experienceContainer}>
				<div>
					<img src={LiderbetImage} alt={'liderbet_logo'}/>
					<p>
						<a href={'https://www.lider-bet.com/'} target={'_blank'}>Leader-bet.com</a> is Georgia's leading sports betting platform, operating land-based totalizators
						and slot clubs across all major cities and regions, ranking first in volume among Georgian totalizators.
						As a senior web application engineer, I focus on system architecture and large-scale data management,
						developing reusable component libraries, designing efficient API structures,
						and building real-time data systems that handle the rapid updates essential to live sports betting operations.
						<br/><br/>
						This role has been particularly significant in developing my architectural thinking and understanding of scalable systems design.
						The complexity of managing high-volume, low-latency data streams while mentoring junior developers has
						deepened my expertise in both technical leadership and building robust, enterprise-level applications.
					</p>
				</div>
				<div>
					<img src={TsignebisTaroImage} alt={'tsignebis_taro_logo'}/>
					<p>
						<a href={'https://www.linkedin.com/company/wignebistaro/about/'} target={'_blank'}>Tsignebis Taro (translates to "Bookcase")</a> is
						a Georgian educational entertainment company best known for
						their literature competition TV show that has been inspiring young readers since 2015.
						During my time there as a software developer, I created multiple project-specific websites and
						developed a cross-platform mobile app to support their various educational initiatives.
						<br/><br/>
						This role was particularly meaningful for several reasons. First off, it was my first experience leading all
						technical decisions and taking full ownership of the development process. Additionally,
						having previously been a semi-finalist on their show, I was deeply connected to company's
						mission - the weekly gatherings for episode filming sessions had given me a community of fellow
						literature enthusiasts during my younger years when reading was my primary passion.
						Being able to give back to a project that had such a positive impact on my life was incredibly inspiring,
						and I eventually expanded my involvement to join their main creative team as well.
					</p>
				</div>
				<div>
					<img src={CoinmaniaImage} alt={'coinmaina_logo'}/>
					<p>
						<a href={'https://coinmania.exchange'} target={'_blank'}>Coinmania.ge</a> is one of
						Georgia's first cryptocurrency exchange platforms. As a software developer,
						I focused on implementing new cryptocurrency transfer systems,
						integrating local bank transaction processing, and maintaining the internal trading infrastructure.
						<br/><br/>
						This was my first "real" job in the industry, so it was, in many ways, a formative experience.
						Especially considering how much additional research it involved into blockchain technologies,
						payment systems, etc.
					</p>
				</div>
			</div>
			{/*<h1>Side Quests</h1>*/}
		</Container>
	)
}

export default Home
