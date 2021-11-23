// Example connect code
import {
  createConnection,
  subscribeEntities,
  ERR_HASS_HOST_REQUIRED,
  createLongLivedTokenAuth,
  Auth,
  Connection
} from "./";



class HomeAssistant {

  auth: Auth
  connection: Connection | null

  constructor(hassUrl: string, token: string) {
    console.log('hassurl', hassUrl)
    this.auth = createLongLivedTokenAuth(hassUrl, token)
    this.connection = null
  }

  handleStateChange(entities: any) {
    console.log(entities)
  }

  subscribeEntities() {
    if (this.connection) {
      subscribeEntities(this.connection, this.handleStateChange);
      //TODO: Use this data for something
    }
  }

  async connect() {
    this.connection = await createConnection({ auth: this.auth })
    return this
  }
}

export default HomeAssistant

