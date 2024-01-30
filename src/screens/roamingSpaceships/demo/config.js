import stageVertex from '../../../shaders/stage/vertex.glsl'
import stageFragment from '../../../shaders/stage/fragment.glsl'
import * as THREE from 'three'
import terrainVertex from '../../../shaders/terrain/vertex.glsl'
import terrainFragment from '../../../shaders/terrain/fragment.glsl'

export const sceneConfigs = {
	debug: {
		shaders: {
			vertex: stageVertex,
			fragment: stageFragment,
		},
		background: new THREE.Color(0x517a87),
		controls: true,
		bindCamera: false,
		indexWalls: false,
		renderHelpers: true,
	},
	demo: {
		shaders: {
			vertex: terrainVertex,
			fragment: terrainFragment,
		},
		background: new THREE.Color(0xf0c9ad),
		controls: true,
		bindCamera: true,
		indexWalls: true,
		fog: new THREE.FogExp2(0xe8c1a9, 0.017),
		renderHelpers: false,
	},
}

export const cameras = [
	{
		object: new THREE.PerspectiveCamera(
			55,
			document.documentElement.clientWidth /
				document.documentElement.clientHeight,
			0.1,
			1000,
		),
		position: {
			x: 0,
			y: 0,
			z: 110,
		},
	},
	{
		object: new THREE.PerspectiveCamera(
			55,
			document.documentElement.clientWidth /
				document.documentElement.clientHeight,
			0.1,
			1000,
		),
		position: {
			x: 0,
			y: 0,
			z: 6,
		},
	},
]
