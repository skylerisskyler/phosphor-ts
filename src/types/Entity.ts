

class Entity {
  entityId: string
  state: string
  attributes: {}
  listeners: []

  constructor(state: any) {

    this.entityId = state.entityId
    this.state = state
    this.attributes = state.attributes
    this.listeners = []

  }
}

export default Entity