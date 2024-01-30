import Vector from './Vector'

export function LineIntersection(a, b, c, d) {
	const rTop = (a.y - c.y) * (d.x - c.x) - (a.x - c.x) * (d.y - c.y)
	const rBot = (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)

	const sTop = (a.y - c.y) * (b.x - a.x) - (a.x - c.x) * (b.y - a.y)
	const sBot = (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)

	if (rBot === 0 || sBot === 0) {
		//lines are parallel
		return null
	}

	const r = rTop / rBot
	const s = sTop / sBot

	if (r > 0 && r < 1 && s > 0 && s < 1) {
		const dist = Vector.Distance(a, b) * r
		const point = Vector.Add(a, Vector.Mult(Vector.Sub(b, a), r))

		return { dist, point }
	}

	return null
}
