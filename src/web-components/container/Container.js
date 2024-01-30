import classNames from 'classnames'

import classes from './Container.module.scss'

const Container = ({ className, children, ...props }) => {
	return (
		<div className={classNames(classes.container, className)} {...props}>
			{children}
		</div>
	)
}

export default Container
