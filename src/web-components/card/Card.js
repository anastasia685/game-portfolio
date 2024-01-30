import classes from './Card.module.scss'

const Card = ({ title, image, description, ...props }) => {
	return (
		<>
			<h2 className={classes.title}>{title}</h2>
			<div className={classes.imageWrapper}>
				<div
					className={classes.imageContainer}
					style={{ backgroundImage: `url(${image})` }}
				/>
			</div>
			<div className={classes.links}>
				{props.children}
			</div>
			<p className={classes.description}>{description}</p>
		</>
	)
}

export default Card
