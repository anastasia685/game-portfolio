import { createBrowserRouter, createHashRouter, NavLink, Outlet } from 'react-router-dom'
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
		path: 'toon-shader',
		element: <ToonShaderDemo />,
	},
])

export default router
