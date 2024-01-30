class Node {
	constructor(value, priority) {
		this.value = value
		this.priority = priority
	}
}

class PriorityQueue {
	constructor(values = [] /*, comparator*/) {
		this.values = values
		//this.comparator = comparator
	}

	Enqueue(value, priority) {
		const node = new Node(value, priority)
		let contains = false
		for (let i = 0; i < this.values.length; i++) {
			if (this.values[i].priority >= node.priority) {
				this.values.splice(i, 0, node)
				contains = true
				break
			}
		}
		if (!contains) this.values.push(node)
	}

	Dequeue() {
		if (this.IsEmpty()) return null
		return this.values.shift().value
	}

	Front() {
		if (this.IsEmpty()) return null
		return this.values[0].value
	}

	IsEmpty() {
		return this.values.length === 0
	}

	ChangePriority(value, priority) {
		for (let i = 0; i < this.values.length; i++) {
			const equals =
				/*this.comparator
				? this.comparator(this.values[i].value, value) === 0
				:*/ this.values[i].value === value
			if (equals) {
				this.values[i].priority = priority
				break
			}
		}
		this.values.sort((a, b) => a.priority - b.priority)
	}

	ChangeValue(value, newValue) {
		for (let i = 0; i < this.values.length; i++) {
			const equals =
				/*this.comparator
				? this.comparator(this.values[i].value, value) === 0
				: */ this.values[i].value === value
			if (equals) {
				this.values[i].value = newValue
				break
			}
		}
	}

	/*Contains(value, comparator) {
		for (let i = 0; i < this.values.length; i++) {
			const equals = comparator
				? comparator(this.values[i].value, value) === 0
				: this.values[i].value === value
			if (equals) return this.values[i]
		}
		return null
	}*/
}

export default PriorityQueue
