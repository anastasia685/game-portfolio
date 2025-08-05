import Container from '../../web-components/container/Container'
import Timelapse from '../../assets/videos/sockets_playthrough.mp4'

import classes from '../ProjectScreen.module.scss'

const Sockets = () => {
	return (
		<Container className={classes.content}>
			<h1>2D Networked Shooter</h1>
			<div className={classes.mediaContainer}>
				<div>
					<video src={Timelapse} autoPlay={true} loop={true} muted={true}></video>
				</div>
				<div/>
			</div>
			<p>
				This project involved building a simple 2D multiplayer shooter from scratch with a focus on
				developing custom networking architecture and lag compensation systems.
				The main technical challenge was implementing client-server synchronization using UDP
				with a custom reliability layer, along with prediction and interpolation techniques
				to handle network latency and packet loss.
				The system was built with SFML Sockets.
			</p>
			<p>
				The architecture uses a dedicated headless server running game simulation at 60fps,
				with clients handling input and rendering while sending data at optimized rates
				(about 5x slower than the main gameplay loop).
				For client-side prediction with server reconciliation -
				clients immediately apply local input for responsiveness,
				then correct their simulation when server snapshots arrive by
				replaying cached moves and accounting for acknowledged/missed inputs through bitmap validation.
			</p>
			<p className={classes.externalLinks}>
				The source code for the project can be found <a href={'https://github.com/anastasia685/SFML_Sockets'} target={'_blank'}>here</a>.
			</p>
			<h3>List of features:</h3>
			<ul className={classes.listMain}>
				<li>
					<span>Core Networking Systems:</span>
					<ul>
						<li>
							Custom Reliability Layer: Acknowledgment system on top of UDP using timestamped packets
							and priority queues to handle packet reordering.
						</li>
						<li>
							Bitmap Acknowledgment Protocol: Server snapshots include bitmasks indicating
							which client inputs were received and applied, allowing clients to
							compare against local input cache and automatically resend unacknowledged moves.
						</li>
						<li>
							Message Buffering Architecture: Non-blocking socket operating under read-message limits per frame,
							using circular buffers to accumulate packets for batch processing at lower frequencies than read and/or simulation rate.
						</li>
					</ul>
				</li>
				<li>
					<span>Client-Side Prediction & Reconciliation:</span>
					<ul>
						<li>
							Input Caching System: Maintains ~1 second rolling cache of player inputs with unique sequence IDs,
							enabling replay from any historical point when server corrections arrive.
						</li>
						<li>
							Lag Compensation: Linear prediction using packet timestamps to estimate current server state,
							combined with interpolation between cached positions for smooth remote player movement.
						</li>
						<li>
							State Reconciliation: When server snapshots arrive, client rewinds to snapshot time, applies server position,
							then replays all cached inputs from that point forward to catch up to current simulation time.
						</li>
						<li>
							Projectile Networking: Combined approach where server handles authoritative collision detection but clients simulate
							visual bullet trajectories locally using only transmitted spawn data (position, timestamp, direction), since their movement is deterministic.
						</li>
					</ul>
				</li>
				<li>
					<span>Server-Side Authority:</span>
					<ul>
						<li>
							Time Rewinding: For each received input, server resets simulation to the
							input's timestamp and replays all subsequent cached moves to maintain consistent physics state.
						</li>
						<li>
							Collision Validation: Server maintains bullet instances with affected player sets to prevent duplicate hits, and
							performs collision detection during move replay at the exact historical time.
						</li>
						<li>
							Physics Consistency: Greatly simplified kinetic motion model ensuring identical simulation results between client and server,
							with proper velocity/acceleration integration over variable time steps.
						</li>
					</ul>
				</li>
			</ul>
		</Container>
	)
}

export default Sockets
