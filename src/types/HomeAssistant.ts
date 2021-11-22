import { find, filter } from 'lodash'

import WebSocket from 'ws'
import Lights from '../lightHandler'


export class Entity {
  entityId: string
  state: string
  subscribers: any[]

  constructor({ entity_id, state }: any) {
    this.entityId = entity_id
    this.state = state
    this.subscribers = []

    const [context, name] = entity_id.split('.')
    switch (context) {
      case 'light':
        // const subscription = Lights.createFromHomeAssistantEntity(this)
        // this.subscribers.push(subscription)
        break;

      default:
        break;
    }
  }

  sync({ state }: any) {
    this.state = state
    this.subscribers.forEach(subscription => subscription(this))
  }
}


export class Instance {
  private token: string
  ws: WebSocket
  isAuth: boolean
  connected: boolean
  url: string
  sentMessageHistory: any[]
  entities: Entity[]
  subscribed: boolean

  constructor(url: string, token: string) {
    this.token = token
    this.connected = false
    this.isAuth = false
    this.subscribed = false
    this.url = url
    this.ws = new WebSocket(`ws://${this.url}/api/websocket`)
    this.sentMessageHistory = []
    this.entities = []
  }

  callLightService() {

    const entity: Entity = this.entities[8]
    let brightness = 255
    // this.sendMessage({
    //   type: "call_service",
    //   domain: "light",
    //   service: "turn_on",

    //   service_data: {
    //     color_name: "purple",
    //     brightness: 255
    //   },
    //   target: {
    //     entity_id: "light.skyler_room"
    //   }
    // })

    this.sendMessage({
      type: "call_service",
      domain: "light",
      service: "turn_on",


      service_data: {
        color_name: "white",
        brightness: 255,
        transition: 60,
      },
      target: {
        entity_id: "light.skyler_room"
      }
    })

  }

  syncEntity = (data: any) => {

    const entity = find(this.entities, { entityId: data.entity_id })
    if (entity) {
      entity.sync(data)
      console.log(entity)
    } else {
      this.entities.push(new Entity(data))
    }

  }


  handleMessage = (data: any) => {
    const msg = JSON.parse(data)

    switch (msg.type) {
      case 'event':
        if (msg.event.event_type === 'state_changed') {
          this.syncEntity(msg.event.data.new_state)
        }
        break;

      case 'result':

        const messageOrigin = find(this.sentMessageHistory, { id: msg.id })

        switch (messageOrigin.type) {


          case 'get_states':
            msg.result.forEach(this.syncEntity)
            console.log('Home assistant states received!')
            break;
          case 'subscribe_events':
            if (msg.success) {
              this.subscribed = true
            }
            break;
        }

        break

      case 'auth_required':
        this.ws.send(JSON.stringify({
          type: "auth",
          access_token: this.token
        }));
        break;

      case 'auth_invalid':
        throw new Error('Unable to Authenticate Home Assistant WS!')
        break;

      case 'auth_ok':
        console.log("Home Assistant WS Authenticated!")
        this.isAuth = true
        console.log('Fetching states from Home Assistant...')
        this.sendMessage({ type: "get_states" })
        this.sendMessage({ type: "subscribe_events", event_type: "state_changed" })
        break;


      default:
        break;
    }
  }

  sendMessage(params: any) {
    const message = {
      id: this.sentMessageHistory.length + 1,
      ...params
    }
    this.sentMessageHistory.push(message)
    this.ws.send(JSON.stringify(message));
  }

  async init() {


    this.ws.on('open', () => {
      console.log('Home Assistant WS Connected.')
      this.connected = true
    });

    this.ws.on('error', (err) => {
      console.log(err)
    })

    this.ws.on('message', this.handleMessage)

    // need better way to resolve instance initialization
    return new Promise(resolve => setTimeout(resolve, 1000));
  }

}