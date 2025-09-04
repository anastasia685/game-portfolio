import Container from '../../web-components/container/Container'
import Timelapse from '../../assets/videos/selective_sdf_timelapse.mp4'
import Process from '../../assets/videos/selective_sdf_process_breakdown.mp4'
import Snap1 from '../../assets/images/selective_sdf_snap1.png'
import Snap2 from '../../assets/images/selective_sdf_snap2.png'
import Graph1 from '../../assets/images/selective_sdf_frame_times.png'
import Graph2 from '../../assets/images/selective_sdf_memory_breakdown.png'

import classes from '../ProjectScreen.module.scss'

const SelectiveSDF = () => {
	return (
		<Container className={classes.content}>
			<h1>Hybrid Rendering Pipeline for Selective SDF Integration with Polygonal Geometry</h1>
			<div className={classes.mediaContainer}>
				<div className={classes.imageRow}>
					<video src={Timelapse} autoPlay={true} loop={true} muted={true}></video>
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
			</p>
			<p>
				The key insight that inspired this project was the following: smooth blends inherently wash out
				high-frequency
				detail inside the blend zone, so carrying a high-resolution SDF there is wasted effort. The project exploits
				that: use a coarser,
				localized SDF only where blending occurs, and render the original polygonal mesh everywhere else to
				preserve crisp, non-blended features. This hybrid division keeps the blend look you want while trading
				unneeded SDF precision for improvement in performance and memory.
			</p>
			<p>
				In practice, two separate hybrid pipelines were implemented: (1) a conventional SDF path with loose
				per-instance AABBs
				(including padded blend regions), runtime blend evaluation, and sphere tracing;
				and (2) a DXR-oriented path that precomputes updated distances in a compute pass and,
				during ray tracing, solves a cubic (from trilinear interpolation of voxel corners + ray equation)
				to calculate exact surface hit point - no ray marching (runtime iterative stepping) involved.
				Both beat a high-res SDF-only baseline on frame time and memory,
				with the DXR/cubic version reaching ~60% faster frame times in medium-scale scenes; the expected loss of
				very
				fine detail within blend zones stayed modest/acceptable by design.
			</p>
			<p className={classes.externalLinks}>
				The source code for the project can be found <a href={'https://github.com/anastasia685/SelectiveSDF'}
																				target={'_blank'}>here</a>.
			</p>
			<h3>List of features:</h3>
			<ul className={classes.listMain}>
				<li>
					<span>Common:</span>
					<ul>
						<li>
							<span className={classes.bold}>Proximity BVH:</span> CPU-built, uploaded as GPU buffers;
							iterative, stack-based traversal in shaders to collect only nearby
							blend contributors to keep the working set small and relevant.
						</li>
						<li>
							<span className={classes.bold}>Distance mapping & smooth blend:</span> Per-instance distance in
							local space
							(analytic SDFs or texture-sampled) combined via weighted log-sum-exp (LSE).
						</li>
						<li>
							<span className={classes.bold}>SDF-Triangle composition policy:</span> Per ray inside a hybrid
							object, produce two candidates:
							a triangle hit (inline ray query) and an SDF hit (Hybrid-A: sphere tracing; Hybrid-B:
							brick+DDA+cubic).
							A policy then accepts either of those in absence of another, or interpolates them otherwise.
						</li>
					</ul>
				</li>
				<li>
					<span>Hybrid A — Sphere-traced path</span>
					<ul>
						<li>
							Loose per-instance AABBs: Expansion by maximum blend radius to bound work.
						</li>
						<li>
							On-the-fly sphere tracing: Evaluation of the blended distance field at runtime and marching to
							convergence/escape.
						</li>
					</ul>
				</li>
				<li>
					<span>Hybrid B — DXR + SBS + Cubic-solve path:</span>
					<ul>
						<li>
							Narrow-band brick extraction: Surface-centric bricks with padding for blend regions.
						</li>
						<li>
							Compute prepass (distance + mask): Recalculation of brick distances;
							group-shared zero-crossing detection (one thread group per 10×10×10 brick) and emission of a brick
							mask.
						</li>
						<li>
							Ray-tracing stage: Mask-driven skipping of non-surface bricks, DDA voxel traversal within
							candidates,
							and cubic root solve from trilinear corner samples plus ray equation—eliminating iterative
							stepping.
						</li>
					</ul>
				</li>
			</ul>
			<h3 style={{ marginTop: '2.5rem' }}>General Results:</h3>

			<div className={classes.mediaContainer}>
				<div className={classes.imageRow} style={{ gap: '1rem' }}>
					<div><img src={Graph1} alt={'frame time graph'} /></div>
					<div><img src={Graph2} alt={'memory graph'} /></div>
				</div>
			</div>
		</Container>
	)
}

export default SelectiveSDF
