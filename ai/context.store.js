// ai/context.store.js

export class AgentContext {
  // Initializes the shared context with an optional state.
  constructor(initialState = {}) {
    // Internal object where context key-value pairs are stored.
    this.state = { ...initialState }
  }

  // Updates or creates a key within the current state.
  update(key, value) {
    this.state[key] = value
  }

  // Returns the value associated with a specific key.
  get(key) {
    return this.state[key]
  }

  // Returns the entire accumulated state of the context.
  getAll() {
    return this.state
  }
}
