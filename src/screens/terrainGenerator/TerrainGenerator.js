import Container from '../../web-components/container/Container'

import MaterialGraph from '../../assets/images/terrain_generator_material.png'
import TerrainMap from '../../assets/images/terrain_map.png'
import TerrainRender from '../../assets/images/terrain_render.png'

import classes from '../ProjectScreen.module.scss'
import terrainClasses from './TerrainGenerator.module.scss'

const TerrainGenerator = () => {
	return (
		<Container className={classes.content}>
			<h1>Terrain Generator</h1>
			<p>
				This was an early project I worked on out of personal interest in procedural generation techniques.
				The goal was to convert simple painted images into 3D terrain heightmaps.
				The core idea was to take rough color-based sketches (even something as basic as an MS Paint drawing)
				and automatically transform them into landscape features using various noise algorithms.
				I built the system primarily in Adobe Substance Designer with Blender integration,
				resulting in a simple and straightforward workflow.
			</p>
			<p>
				The technical approach involved color separation with adjustable tolerance to create masks for
				different landscape features like mountains, highlands, and rivers.
				Each mask then drove specific procedural transformations using algorithms like Perlin and Voronoi noise,
				with effects scaled based on the mask size so larger mountain ranges would generate proportionally higher peaks.
				The system handled blending and expansion for seamless transitions between different terrain types.
			</p>

			<div className={terrainClasses.imagesWrapper}>
				<div className={terrainClasses.imageContainer}>
					<img src={TerrainMap} alt={'painted-map'} />
				</div>
				<div className={terrainClasses.imageContainer}>
					<img src={TerrainRender} />
				</div>
			</div>
			<p>
				Here’s a quick snapshot of the whole graph in Substance Designer and{' '}
				<a
					href={
						'https://drive.google.com/file/d/1jgNq3_WIxldxmn69wuxQhiLSEpaZ4B0D/view?usp=drive_link'
					}
					target={'_blank'}
				>
					the file itself
				</a>{' '}
				(alongside the{' '}
				<a
					href={
						'https://drive.google.com/file/d/1EKZi98CvqnLOihhtAUdI0_VYtOUIZ0xT/view?usp=drive_link'
					}
					target={'_blank'}
				>
					Blender3D file
				</a>{' '}
				showcasing the end results) can be downloaded for a more
				comprehensive review.
			</p>
			<div className={terrainClasses.imageContainer}>
				<img src={MaterialGraph} alt={'MaterialGraph'} />
			</div>
		</Container>
	)
}

export default TerrainGenerator
