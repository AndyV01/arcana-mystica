// ai/context.store.js

export class AgentContext {
  // Inicializa el contexto compartido con un estado opcional.
  constructor(initialState = {}) {
    // Objeto interno donde se guardan pares clave/valor del contexto.
    this.state = { ...initialState }
  }

  // Actualiza o crea una clave dentro del estado actual.
  update(key, value) {
    this.state[key] = value
  }

  // Devuelve el valor asociado a una clave específica.
  get(key) {
    return this.state[key]
  }

  // Retorna todo el estado acumulado del contexto.
  getAll() {
    return this.state
  }
}
