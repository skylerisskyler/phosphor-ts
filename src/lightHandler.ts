import Light from './types/Light'
import { Entity } from './types/HomeAssistant'

const lights: Light[] = []


//return a function that can be called by subscriber that automatically update light
//1. convert state into format the light can use


// const createFromHomeAssistantEntity = (entity: Entity) => {
//   // const light: Light = new Light()
//   return (entity: Entity) => light.updateState({ state: entity.state })
// }

const remove = (lights: Light) => { }

const getLight = () => {

}

const getLights = () => {
  return lights
}

export default {
  // createFromHomeAssistantEntity,
  remove,
  getLight,
  getLights
}