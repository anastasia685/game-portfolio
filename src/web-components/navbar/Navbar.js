import classes from './Navbar.module.scss'
import { NavLink, useLocation } from 'react-router-dom'
import Container from '../container/Container'
import { useEffect } from 'react'

const Navbar = () => {
	const { pathname } = useLocation()
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}, [pathname])
	return (
		<Container>
			<header className={classes.header}>
				<NavLink to='' className={classes.title}>
					Anastasia Iosebadze - Game Development Portfolio
				</NavLink>
				<nav>
					<NavLink
						to='roaming-spaceships'
						className={({ isActive }) =>
							isActive ? classes.active : null
						}
					>
						Roaming Spaceships
					</NavLink>
					<NavLink
						to='terrain-generator'
						className={({ isActive }) =>
							isActive ? classes.active : null
						}
					>
						Terrain Generator
					</NavLink>
				</nav>
			</header>
		</Container>
	)
}

export default Navbar
