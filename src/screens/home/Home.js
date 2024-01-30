import classes from './Home.module.scss'
import { Link } from 'react-router-dom'
import Card from '../../web-components/card/Card'
import Container from '../../web-components/container/Container'

import RoamingSpaceshipsImage from '../../assets/images/roaming_ships.png'
import TerrainGeneratorImage from '../../assets/images/terrain_map.png'

const Home = () => {
	return (
		<Container className={classes.container}>
			<h1>Projects</h1>
			<section className={classes.projectsContainer}>
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
							href={'https://github.com/a-iosebadze/game-portfolio'}
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
		</Container>
	)
}

export default Home
