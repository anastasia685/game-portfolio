class StateMachine {
	owner
	currentState
	previousState
	globalState

	constructor(owner) {
		this.owner = owner
		this.currentState = null
		this.previousState = null
		this.globalState = null
	}

	Update() {
		if (this.globalState) this.globalState.Execute(this.owner)
		if (this.currentState) this.currentState.Execute(this.owner)
	}

	HandleMessage(msg) {
		if (this.currentState && this.currentState.OnMessage(this.owner, msg))
			return true
		if (this.globalState && this.globalState.OnMessage(this.owner, msg))
			return true
		return false
	}

	ChangeState(newState) {
		this.previousState = this.currentState
		if(this.currentState) this.currentState.Exit(this.owner)

		this.currentState = newState
		if (this.currentState) this.currentState.Enter(this.owner)
	}

	RevertToPreviousState() {
		this.ChangeState(this.previousState)
	}

	IsInState(state) {
		return this.currentState.constructor === state.constructor
	}
}

export default StateMachine
