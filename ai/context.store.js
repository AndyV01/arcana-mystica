// ai/context.store.js

export class AgentContext {
  constructor(initialState = {}) {
    this.state = { ...initialState }
  }

  update(key, value) {
    this.state[key] = value
  }

  get(key) {
    return this.state[key]
  }

  getAll() {
    return this.state
  }
}
