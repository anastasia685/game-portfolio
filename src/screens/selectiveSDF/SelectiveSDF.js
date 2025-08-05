import Container from '../../web-components/container/Container'
import Timelapse from '../../assets/videos/selective_sdf_timelapse.mp4'
import Process from '../../assets/videos/selective_sdf_process_breakdown.mp4'
import Snap1 from '../../assets/images/selective_sdf_snap1.png'
import Snap2 from '../../assets/images/selective_sdf_snap2.png'

import classes from '../ProjectScreen.module.scss'

const SelectiveSDF = () => {
	return (
		<Container className={classes.content}>
			<h1>Hybrid Rendering Pipeline for Selective SDF Integration with Polygonal Geometry</h1>
			<div className={classes.mediaContainer}>
				<div>
					<video src={Timelapse} autoPlay={true} loop={true} muted={true}></video>
				</div>
				<div className={classes.imageColumn}>
					{/*<div><img src={Snap1} alt={'snapshot 1'}/></div>
					<div><img src={Snap2} alt={'snapshot 2'}/></div>*/}
					<video src={Process} autoPlay={true} loop={true} muted={true}></video>
				</div>
			</div>
			<p>
				This is my current master's thesis research project,
				exploring a novel hybrid rendering approach that combines the strengths of
				both Signed Distance Field (SDF) operations and traditional ray traced polygonal geometry.
			</p>
			<p>
				The proposed pipeline aims to solve the fundamental trade-off between the smooth blending
				and procedural capabilities of SDF rendering and the computational efficiency
				and sharp feature representation of traditional polygon-based approaches.
				By selectively applying SDF operations only in localized regions
				where they provide meaningful visual contribution, the system seeks to
				maintain the benefits of both techniques while mitigating their respective drawbacks.
				It is built using DirectX 12 and DXR, with sphere tracing used for evaluating SDFs.
				Development process is currently focused on exploring multiple approaches to
				SDF rendering, their associated data and pipeline structures, and how well they adapt to
				blending tasks specifically.
			</p>
			<p>
				This work is currently in progress as part of my master's degree program,
				with ongoing investigation into the technical feasibility and performance characteristics of the hybrid approach.
			</p>
			<p className={classes.externalLinks}>
				The source code for the project can be found <a href={'https://github.com/anastasia685/SelectiveSDF'} target={'_blank'}>here</a>.
			</p>
		</Container>
	)
}

export default SelectiveSDF
