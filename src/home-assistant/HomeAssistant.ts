import {
  createConnection,
  subscribeEntities,
  ERR_HASS_HOST_REQUIRED,
  createLongLivedTokenAuth,
  Auth,
  Connection,
  entitiesCollection,
} from "./websocket";

import Entity from '../types/Entity'
import { checkValidationErrors } from "@graphql-tools/utils"

import { getCollection } from "./websocket/collection";
import { getStates } from './websocket/commands'

import { Light } from "../types/Light";
import Trigger from '../types/Trigger'
import Store from "../store";

import { filter, find } from 'lodash'

class HomeAssistant {

  auth: Auth
  connection: Connection | null
  entities: Entity[]
  subscribers: any

  constructor(hassUrl: string, token: string) {
    this.auth = createLongLivedTokenAuth(hassUrl, token)
    this.connection = null
    this.entities = []
    this.subscribers = {}
  }

  handleState(state: any) {

    const subscription = this.subscribers[state.entity_id]
    if (subscription) {
      subscription.forEach((sub: any) => sub(state.state))
    }

  }

  handleStates = (states: any) => {
    Object.keys(states).forEach((key: string) => this.handleState(states[key]))
  }




  subscribeStore(store: Store) {

    const haLights = filter(store.lights, { context: { type: 'home-assistant' } })

    haLights.forEach((light: Light) => {
      const entityId = light.context.props.entityId
      const subscription = this.subscribers[entityId]
      if (!subscription) {
        this.subscribers[entityId] = []
      }
      this.subscribers[entityId].push((state: any) => light.update(state))
    })

    // const haTriggers = (type: string) =>
    //   filter(store.triggers,)

  }

  processEvent(event: any) {
    logger.info('the event', event)
  }

  async stateInit() {
    if (this.connection) {
      this.handleStates(await getStates(this.connection))
      this.connection.subscribeEvents(this.processEvent)
    }
  }

  async connect() {
    this.connection = await createConnection({ auth: this.auth })
    return this
  }
}

export default HomeAssistant

