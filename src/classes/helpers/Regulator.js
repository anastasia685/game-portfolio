class Regulator {
	updatePeriod
	nextUpdateTime

	constructor(updateRate) {
		this.nextUpdateTime = Date.now()/* + Math.random() * 1000*/
		if (updateRate > 0) this.updatePeriod = 1000 / updateRate
		else if(updateRate === 0) this.updatePeriod = 0
		else this.updatePeriod = -1
	}

	IsReady() {
		if (this.updatePeriod === 0) return true
		if (this.updatePeriod < 0) return false
		if (Date.now() >= this.nextUpdateTime) {
			this.nextUpdateTime = Date.now() + this.updatePeriod
			return true
		}
		return false
	}
}

export default Regulator