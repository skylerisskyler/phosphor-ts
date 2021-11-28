import {
  createConnection,
  subscribeEntities,
  ERR_HASS_HOST_REQUIRED,
  createLongLivedTokenAuth,
  Auth,
  Connection,
} from "./websocket";

import Entity from '../types/Entity'
import { checkValidationErrors } from "@graphql-tools/utils"
import { find } from 'lodash'

class HomeAssistant {

  auth: Auth
  connection: Connection | null
  entities: Entity[]

  constructor(hassUrl: string, token: string) {
    this.auth = createLongLivedTokenAuth(hassUrl, token)
    this.connection = null
    this.entities = []
  }

  handleState(state: any) {
    let entity: Entity | any
    entity = find(this.entities, { id: state.id })
    if (!entity) {
      entity = new Entity(state)
      this.entities.push(entity)
    }
  }

  handleStates = (states: any) => {
    Object.keys(states).forEach((key: string) => this.handleState(states[key]))
  }

  async stateInit() {
    if (this.connection) {
      await subscribeEntities(this.connection, this.handleStates)
    }
  }

  async connect() {
    this.connection = await createConnection({ auth: this.auth })
    return this
  }
}

export default HomeAssistant

