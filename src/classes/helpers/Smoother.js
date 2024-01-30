import Vector from './Vector'

class Smoother {
	history
	nextUpdateSlot

	constructor(sampleSize) {
		this.history = new Array(sampleSize).fill(new Vector())
		this.nextUpdateSlot = 0
	}

	Update(sample) {
		this.history[this.nextUpdateSlot++] = sample
		if (this.nextUpdateSlot === this.history.length) this.nextUpdateSlot = 0

		let sum = new Vector()

		this.history.forEach((sample) => {
			sum.Add(sample)
		})

		return Vector.Div(sum, this.history.length)
	}
}

export default Smoother
