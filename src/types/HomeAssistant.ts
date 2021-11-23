import {
  getAuth,
  createConnection,
  subscribeEntities,
  ERR_HASS_HOST_REQUIRED,
  ERR_INVALID_AUTH,
  Auth,
  createLongLivedTokenAuth,
  ConnectionOptions,
  ERR_CONNECTION_LOST,
  ERR_CANNOT_CONNECT,

} from "home-assistant-js-websocket";

export const MSG_TYPE_AUTH_REQUIRED = "auth_required";
export const MSG_TYPE_AUTH_INVALID = "auth_invalid";
export const MSG_TYPE_AUTH_OK = "auth_ok";

import { w3cwebsocket as WebSocket } from 'websocket'

export interface HaWebSocket extends WebSocket {
  haVersion: string;
}

async function connect() {
  // let auth;
  // try {
  //   // Try to pick up authentication after user logs in
  //   auth = await getAuth();
  //   console.log(auth)
  // } catch (err) {
  //   if (err === ERR_HASS_HOST_REQUIRED) {
  //     const hassUrl = "http://localhost:8123";
  //     // Redirect user to log in on their instance
  //     // auth = await getAuth({ '' });
  //   } else {
  //     console.log(`Unknown error: ${err}`);
  //     return;
  //   }
  // }
  const auth = await createLongLivedTokenAuth('http://homeassistant.local:8123', "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkMDM4ZjQ2N2IwZWE0Y2Y4YmNhMWUwOTNlZGYxZjg4MiIsImlhdCI6MTYzNTc0MzY2OSwiZXhwIjoxOTUxMTAzNjY5fQ.Ivziw5PpnTW_olFVEP_hke8EnUR8R4q2Wa1zL1KY9Ck")


  const DEBUG = true

  // export type ConnectionOptions = {
  //   setupRetry: number;
  //   auth?: Auth;
  //   createSocket: (options: ConnectionOptions) => Promise<HaWebSocket>;
  // };

  // function createSocket(options: ConnectionOptions): Promise<HaWebSocket> {
  //   if (!options.auth) {
  //     throw ERR_HASS_HOST_REQUIRED;
  //   }
  //   const auth = options.auth;

  //   // Start refreshing expired tokens even before the WS connection is open.
  //   // We know that we will need auth anyway.
  //   // let authRefreshTask = auth.expired
  //   //   ? auth.refreshAccessToken().then(
  //   //     () => {
  //   //       authRefreshTask = undefined;
  //   //     },
  //   //     () => {
  //   //       authRefreshTask = undefined;
  //   //     }
  //   //   )
  //   //   : undefined;

  //   // Convert from http:// -> ws://, https:// -> wss://
  //   const url = auth.wsUrl;

  //   if (DEBUG) {
  //     console.log("[Auth phase] Initializing", url);
  //   }

  //   function connect(
  //     triesLeft: number,
  //     promResolve: (socket: HaWebSocket) => void,
  //     promReject: (err: Error | number) => void
  //   ) {
  //     if (DEBUG) {
  //       console.log("[Auth Phase] New connection", url);
  //     }

  //     const socket = new WebSocket(auth.wsUrl) as HaWebSocket;

  //     // If invalid auth, we will not try to reconnect.
  //     let invalidAuth = false;

  //     // const closeMessage = () => {
  //     //   // If we are in error handler make sure close handler doesn't also fire.
  //     //   socket.removeEventListener("close", closeMessage);
  //     //   if (invalidAuth) {
  //     //     promReject(ERR_INVALID_AUTH);
  //     //     return;
  //     //   }

  //     //   // Reject if we no longer have to retry
  //     //   if (triesLeft === 0) {
  //     //     // We never were connected and will not retry
  //     //     promReject(ERR_CANNOT_CONNECT);
  //     //     return;
  //     //   }

  //     //   const newTries = triesLeft === -1 ? -1 : triesLeft - 1;
  //     //   // Try again in a second
  //     //   setTimeout(() => connect(newTries, promResolve, promReject), 1000);
  //     // };

  //     // Auth is mandatory, so we can send the auth message right away.
  //     const handleOpen = async (event: MessageEventInit) => {
  //       console.log('handling open')
  //       socket.send(JSON.stringify({
  //         type: "auth",
  //         access_token: auth.accessToken,
  //       }));
  //     };

  //     const handleMessage = async (event: any) => {

  //       const message = JSON.parse(event);

  //       if (DEBUG) {
  //         console.log("[Auth phase] Received", message);
  //       }

  //       // switch (message.type) {
  //       //   case MSG_TYPE_AUTH_INVALID:
  //       //     invalidAuth = true;
  //       //     socket.close();
  //       //     break;

  //       //   case MSG_TYPE_AUTH_OK:
  //       //     socket.removeListener("open", handleOpen);
  //       //     socket.removeListener("message", handleMessage);
  //       //     // socket.removeListener("close", closeMessage);
  //       //     // socket.removeListener("error", closeMessage);
  //       //     socket.haVersion = message.ha_version;
  //       //     promResolve(socket);
  //       //     break;

  //       //   default:
  //       //     if (DEBUG) {
  //       //       // We already send response to this message when socket opens
  //       //       if (message.type !== MSG_TYPE_AUTH_REQUIRED) {
  //       //         console.warn("[Auth phase] Unhandled message", message);
  //       //       }
  //       //     }
  //       // }
  //     };

  //     // socket.addEventListener("open", handleOpen);
  //     // socket.on("message", handleMessage);
  //     // socket.on("close", closeMessage);
  //     // socket.on("error", closeMessage);
  //   }

  //   return new Promise((resolve, reject) =>
  //     connect(options.setupRetry, resolve, reject)
  //   );
  // }


  const connection = await createConnection({
    auth,
    createSocket: () => new WebSocket(auth.wsUrl)
  });
  // subscribeEntities(connection, (ent) => console.log(ent));
  // console.log(auth)
}

connect();


// import { find, filter } from 'lodash'


// import Lights from '../lightHandler'


// export class Entity {
//   entityId: string
//   state: string
//   subscribers: any[]

//   constructor({ entity_id, state }: any) {
//     this.entityId = entity_id
//     this.state = state
//     this.subscribers = []

//     const [context, name] = entity_id.split('.')
//     switch (context) {
//       case 'light':
//         // const subscription = Lights.createFromHomeAssistantEntity(this)
//         // this.subscribers.push(subscription)
//         break;

//       default:
//         break;
//     }
//   }

//   sync({ state }: any) {
//     this.state = state
//     this.subscribers.forEach(subscription => subscription(this))
//   }
// }


// export class Instance {
//   private token: string
//   ws: WebSocket
//   isAuth: boolean
//   connected: boolean
//   url: string
//   sentMessageHistory: any[]
//   entities: Entity[]
//   subscribed: boolean

//   constructor(url: string, token: string) {
//     this.token = token
//     this.connected = false
//     this.isAuth = false
//     this.subscribed = false
//     this.url = url
//     this.ws = new WebSocket(`ws://${this.url}/api/websocket`)
//     this.sentMessageHistory = []
//     this.entities = []
//   }

//   callLightService() {

//     const entity: Entity = this.entities[8]
//     let brightness = 255
//     // this.sendMessage({
//     //   type: "call_service",
//     //   domain: "light",
//     //   service: "turn_on",

//     //   service_data: {
//     //     color_name: "purple",
//     //     brightness: 255
//     //   },
//     //   target: {
//     //     entity_id: "light.skyler_room"
//     //   }
//     // })

//     this.sendMessage({
//       type: "call_service",
//       domain: "light",
//       service: "turn_on",


//       service_data: {
//         color_name: "white",
//         brightness: 255,
//         transition: 60,
//       },
//       target: {
//         entity_id: "light.skyler_room"
//       }
//     })

//   }

//   syncEntity = (data: any) => {

//     const entity = find(this.entities, { entityId: data.entity_id })
//     if (entity) {
//       entity.sync(data)
//       console.log(entity)
//     } else {
//       this.entities.push(new Entity(data))
//     }

//   }


//   handleMessage = (data: any) => {
//     const msg = JSON.parse(data)

//     switch (msg.type) {
//       case 'event':
//         if (msg.event.event_type === 'state_changed') {
//           this.syncEntity(msg.event.data.new_state)
//         }
//         break;

//       case 'result':

//         const messageOrigin = find(this.sentMessageHistory, { id: msg.id })

//         switch (messageOrigin.type) {


//           case 'get_states':
//             msg.result.forEach(this.syncEntity)
//             console.log('Home assistant states received!')
//             break;
//           case 'subscribe_events':
//             if (msg.success) {
//               this.subscribed = true
//             }
//             break;
//         }

//         break

//       case 'auth_required':
//         this.ws.send(JSON.stringify({
//           type: "auth",
//           access_token: this.token
//         }));
//         break;

//       case 'auth_invalid':
//         throw new Error('Unable to Authenticate Home Assistant WS!')
//         break;

//       case 'auth_ok':
//         console.log("Home Assistant WS Authenticated!")
//         this.isAuth = true
//         console.log('Fetching states from Home Assistant...')
//         this.sendMessage({ type: "get_states" })
//         this.sendMessage({ type: "subscribe_events", event_type: "state_changed" })
//         break;


//       default:
//         break;
//     }
//   }

//   sendMessage(params: any) {
//     const message = {
//       id: this.sentMessageHistory.length + 1,
//       ...params
//     }
//     this.sentMessageHistory.push(message)
//     this.ws.send(JSON.stringify(message));
//   }

//   async init() {


//     this.ws.on('open', () => {
//       console.log('Home Assistant WS Connected.')
//       this.connected = true
//     });

//     this.ws.on('error', (err: any) => {
//       throw new Error(err)
//     })

//     this.ws.on('message', this.handleMessage)

//     // need better way to resolve instance initialization
//     return new Promise(resolve => setTimeout(resolve, 1000));
//   }

// }