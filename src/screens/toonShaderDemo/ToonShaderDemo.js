import {useEffect, useRef} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls";
import toonVertex from "../../shaders/toon/vertex.glsl";
import toonFragment from "../../shaders/toon/fragment.glsl";

function ToonShaderDemo() {
  const canvasRef = useRef()

  useEffect(() => {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x517a87)
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    })
    renderer.setSize(
      document.documentElement.clientWidth,
      document.documentElement.clientHeight,
    )
    const camera = new THREE.PerspectiveCamera(
      55,
      document.documentElement.clientWidth /
      document.documentElement.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(0, 0, 15)

    const controls = new OrbitControls(camera, renderer.domElement)

    function resizeHandler() {
      const sizes = {}
      sizes.width = document.documentElement.clientWidth
      sizes.height = document.documentElement.clientHeight

      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      renderer.setSize(sizes.width, sizes.height)
    }

    window.addEventListener('resize', resizeHandler)

    const sphere = new THREE.Mesh(
      new THREE.TorusGeometry(5, 2, 16, 32),
      new THREE.ShaderMaterial({
        vertexShader: toonVertex,
        fragmentShader: toonFragment,
      }),
    )
    scene.add(sphere)

    function animate() {
      controls.update()
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default ToonShaderDemo