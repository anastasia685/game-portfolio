import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import World from '../../../classes/World'
import Map0 from '../../../maps/map0'
import { sceneConfigs, cameras } from './config'

import { indexWalls } from '../../../helpers'

import classes from './RoamingSpaceshipsDemo.module.scss'
import Vector from '../../../classes/helpers/Vector'
import { SearchShipState } from '../../../classes/ship/ShipStates'

function RoamingSpaceshipsDemo() {
	const canvasRef = useRef()

	const [displayMode, setDisplayMode] = useState('debug')
	const [activeCamera, setActiveCamera] = useState(cameras[0])
	const [isRunning, setIsRunning] = useState()

	const renderer = useRef()
	const controls = useRef()
	const world = useRef()

	const changeDisplayMode = (e) => {
		setDisplayMode(e.target.value)
		setIsRunning(false)
	}
	const changeCamera = (e) => {
		if (displayMode === 'demo') {
			setActiveCamera(cameras[e.target.value === 'overhead' ? 0 : 1])
		}
	}

	const resizeHandler = useCallback(() => {
		const sizes = {}
		sizes.width = document.documentElement.clientWidth
		sizes.height = document.documentElement.clientHeight

		activeCamera.object.aspect = sizes.width / sizes.height
		activeCamera.object.updateProjectionMatrix()
		//helper.update()

		renderer.current.setSize(sizes.width, sizes.height)
	}, [activeCamera])

	useEffect(() => {
		window.addEventListener('resize', resizeHandler)
		return () => {
			window.removeEventListener('resize', resizeHandler)
		}
	}, [resizeHandler])

	useEffect(() => {
		const config = sceneConfigs[displayMode]

		const scene = new THREE.Scene()
		scene.background = config.background
		if (config.fog) scene.fog = config.fog

		const ambientLight = new THREE.AmbientLight('white', 0.55)
		//scene.add(ambientLight)

		const directionalLight = new THREE.DirectionalLight('white', 10)
		directionalLight.castShadow = true
		directionalLight.position.set(-1, 1.75, 1)
		directionalLight.position.multiplyScalar(40)
		const directionalLightHelper = new THREE.DirectionalLightHelper(
			directionalLight,
		)
		directionalLight.shadow.mapSize.width = 1024 // default
		directionalLight.shadow.mapSize.height = 1024 // default
		directionalLight.shadow.camera.near = 0.5 // default
		directionalLight.shadow.camera.far = 200
		directionalLight.shadow.camera.left = -50
		directionalLight.shadow.camera.right = 50
		directionalLight.shadow.camera.top = 50
		directionalLight.shadow.camera.bottom = -50
		scene.add(directionalLight)
		//scene.add(directionalLightHelper)

		const { object: cameraObj, position: cameraPos } = cameras[0]

		renderer.current = new THREE.WebGLRenderer({
			canvas: canvasRef.current,
			antialias: true,
		})
		renderer.current.shadowMap.enabled = true
		renderer.current.shadowMap.type = THREE.PCFSoftShadowMap

		renderer.current.setSize(
			document.documentElement.clientWidth,
			document.documentElement.clientHeight,
		)

		controls.current = config.controls
			? new OrbitControls(cameraObj, renderer.current.domElement)
			: null

		cameraObj.position.set(cameraPos.x, cameraPos.y, cameraPos.z)
		cameraObj.updateProjectionMatrix()
		//helper.update()

		if (controls.current) controls.current.update()

		world.current = new World(
			scene,
			config.bindCamera ? cameras[1].object : null,
			Map0,
			config.renderHelpers,
		)

		const stageGeometry = new THREE.PlaneGeometry(100, 100, 512, 512)
		if (config.indexWalls) indexWalls(stageGeometry, Map0?.walls)

		const stageMaterial = new THREE.ShaderMaterial({
			vertexShader: config.shaders.vertex,
			fragmentShader: config.shaders.fragment,
			wireframe: false,
			/*...(config.fog && {
        fog: true,
        uniforms: THREE.UniformsUtils.merge([
          THREE.UniformsLib['fog'],
          THREE.UniformsLib['lights'],
        ]),
      }),*/
			fog: !!config.fog,
			uniforms: THREE.UniformsUtils.merge([
				config.fog && THREE.UniformsLib['fog'],
				THREE.UniformsLib['lights'],
			]),
			lights: true,
		})

		const stageMesh = new THREE.Mesh(stageGeometry, stageMaterial)
		stageMesh.receiveShadow = true
		scene.add(stageMesh)

		setActiveCamera(cameras[0])

		const helper = new THREE.CameraHelper(directionalLight.shadow.camera)
		//scene.add(helper)

		return () => {
			renderer.current.dispose()
			controls.current.dispose()
		}
	}, [displayMode])

	useEffect(() => {
		let requestId

		const clock = new THREE.Clock()
		const animate = () => {
			const delta = clock.getDelta()

			activeCamera.object.updateProjectionMatrix()
			//helper.update()

			world.current.Update(delta)

			if (controls.current) controls.current.update()
			renderer.current.render(world.current.scene, activeCamera.object)

			requestId = window.requestAnimationFrame(animate)
		}
		animate()

		return () => {
			window.cancelAnimationFrame(requestId)
		}
	}, [activeCamera])

	return (
		<div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
			<div className={classes.actions}>
				<section>
					<h3>DisplayMode</h3>
					<div>
						<input
							type={'radio'}
							value={'debug'}
							checked={displayMode === 'debug'}
							onChange={changeDisplayMode}
						/>
						<label>Debug</label>
					</div>
					<div>
						<input
							type={'radio'}
							value={'demo'}
							checked={displayMode === 'demo'}
							onChange={changeDisplayMode}
						/>
						<label>Demo</label>
					</div>
				</section>
				<section>
					<h3>ActiveCamera</h3>
					<div>
						<input
							type={'radio'}
							value={'overhead'}
							checked={activeCamera === cameras[0]}
							onChange={changeCamera}
						/>
						<label>Overhead</label>
					</div>
					<div>
						<input
							type={'radio'}
							value={'following'}
							checked={activeCamera === cameras[1]}
							onChange={changeCamera}
						/>
						<label
							style={{ color: displayMode === 'debug' ? '#444' : null }}
						>
							Following
						</label>
					</div>
				</section>
				<button
					onClick={() => {
						setIsRunning((prevState) => {
							const activeShip =
								world.current.ships?.[world.current?.activeShip]
							if (activeShip) {
								activeShip.Reset(
									new Vector(5, -15),
									prevState ? null : SearchShipState.Instance,
								)
							}

							return !prevState
						})
					}}
				>
					{isRunning ? 'Stop' : 'Start'}
				</button>
			</div>
			<canvas ref={canvasRef} />
		</div>
	)
}

export default RoamingSpaceshipsDemo
