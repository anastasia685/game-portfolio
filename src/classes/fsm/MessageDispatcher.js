import PriorityQueue from '../helpers/PriorityQueue'

export class Message {
	constructor(sender, receiver, msg, dispatchTime, extraInfo) {
		this.sender = sender
		this.receiver = receiver
		this.msg = msg
		this.dispatchTime = dispatchTime
		this.extraInfo = extraInfo
	}
}

export class MessageDispatcher {
	//static Instance = new MessageDispatcher()

	world

	messages

	constructor(world) {
		this.world = world
		this.messages = new PriorityQueue()
	}

	Send(receiver, message) {
		if (!this.world.ships[receiver]) return

		const handled = this.world.ships[receiver].HandleMessage(message)

		if (!handled) console.warn('Message not handled', message)
	}

	DispatchMessage(delay, sender, receiver, msg, extraInfo) {
		if (!this.world.ships[receiver]) return

		const message = new Message(sender, receiver, msg, delay, extraInfo)

		if (delay <= 0) {
			this.Send(receiver, message)
		} else {
			const currentTime = Date.now()
			message.dispatchTime = currentTime + delay
			this.messages.Enqueue(message, message.dispatchTime)
		}
	}

	DispatchDelayedMessages() {
		const currentTime = Date.now()

		while (
			!this.messages.IsEmpty() &&
			this.messages.Front().dispatchTime < currentTime
		) {
			const message = this.messages.Dequeue()

			this.Send(message.receiver, message)
		}
	}
}
