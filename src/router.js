import { createBrowserRouter, createHashRouter, NavLink, Outlet } from 'react-router-dom'
import SelectiveSDF from './screens/selectiveSDF/SelectiveSDF'
import FluidSim from './screens/fluidSim/FluidSim'
import Dx11Demo from './screens/dx11Demo/Dx11Demo'
import FishEverywhere from './screens/fishEverywhere/FishEverywhere'
import Sockets from './screens/sockets/Sockets'
import RoamingSpaceships from './screens/roamingSpaceships/RoamingSpaceships'
import RoamingSpaceshipsDemo from './screens/roamingSpaceships/demo/RoamingSpaceshipsDemo'
import TerrainGenerator from './screens/terrainGenerator/TerrainGenerator'
import Home from './screens/home/Home'
import Navbar from './web-components/navbar/Navbar'
import ToonShaderDemo from './screens/toonShaderDemo/ToonShaderDemo'

const router = createHashRouter([
	{
		path: '',
		element: (
			<>
				<Navbar />
				<Outlet />
			</>
		),
		children: [
			{ path: '', element: <Home /> },
			{
				path: 'selective-sdf',
				element: <SelectiveSDF />,
			},
			{
				path: 'volumetric-fluid-sim',
				element: <FluidSim />,
			},
			{
				path: 'dx11-demo',
				element: <Dx11Demo />,
			},
			{
				path: 'fish-everywhere',
				element: <FishEverywhere />,
			},
			{
				path: 'socket-demo',
				element: <Sockets />,
			},
			{
				path: 'roaming-spaceships',
				children: [{ path: '', element: <RoamingSpaceships /> }],
			},
			{
				path: 'terrain-generator',
				element: <TerrainGenerator />,
			},
		],
	},
	{ path: 'roaming-spaceships/demo', element: <RoamingSpaceshipsDemo /> },
	{
		path: 'toon-shader/demo',
		element: <ToonShaderDemo />,
	},
])

export default router
