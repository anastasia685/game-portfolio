import Container from '../../web-components/container/Container'

import MaterialGraph from '../../assets/images/terrain_generator_material.png'
import TerrainMap from '../../assets/images/terrain_map.png'
import TerrainRender from '../../assets/images/terrain_render.png'

import classes from './TerrainGenerator.module.scss'

const TerrainGenerator = () => {
	return (
		<Container className={classes.content}>
			<h1>Terrain Generator</h1>
			<p>
				The Terrain Generator project aims to transform a given image,
				serving as a crude layout of the landscape, into a dynamic
				heightmap. It separates the image by color and uses the results as
				masks for applying different transformations representing landscape
				features such as mountains, highlands, and rivers. As a result, it
				provides a quick and easy way to lay down the groundwork for a more
				complex and detailed landscape generation. The tool ended up being
				pretty versatile, as it primarily relies on different noise
				algorithms to displace flat geometry, and by adjusting the tolerance
				of color masks, it can use images created in different styles and
				mediums. In the example below, I used Microsoft Paint to create a
				simple map, but a hand-painted scanned image would work just as
				well.
			</p>
			<p>
				In practice, all this was done by creating a custom material in
				Adobe Substance Designer that accepts the image as an input,
				separates it into different sections and applies different
				algorithms like Perlin and Voronoi noises to generate landscape
				geometry. The effects are then scaled according to mask size (a
				smaller mountain range would not generally be as tall as a larger
				spanning one, e.g.), expanded and blurred for better blending and
				added together.
			</p>
			<p>
				As for the practical implementation example, I imported the
				generated map into Blender3D software and used it as a base to
				displace a simple plane geometry. Additionally, I created a shader
				node group, which would again generate different color masks from
				the original image and apply specific detailed materials, to further
				enhance the overall look of the end result.
			</p>
			<p>
				I ended up disregarding this idea and opted instead to go back to
				Substance Designer. In this revised strategy I exported color masks
				that were generated during material creation process directly
				alongside the heightmap. This adjustment allowed from more precise
				results, kept the main work logic concentrated in one place, and the
				workflow proved to be more straightforward and efficient within
				Substance Designer.
			</p>
			<p>
				Back in Blender3D material shader, I imported these newly generated
				masking textures and used them to combine different open-source
				materials in their respective positions and here is the resulting
				render next to the original map made in Microsoft Paint.
			</p>
			<div className={classes.imagesWrapper}>
				<div className={classes.imageContainer}>
					<img src={TerrainMap} alt={'painted-map'} />
				</div>
				<div className={classes.imageContainer}>
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
			<div className={classes.imageContainer}>
				<img src={MaterialGraph} alt={'MaterialGraph'} />
			</div>
		</Container>
	)
}

export default TerrainGenerator
