import { find } from "lodash"
import Scene from "./Scene"

interface IHaContextProps {
  entityId: string
  attributes: string
}

interface ILightContext {
  type: "home-assistant"
  props: IHaContextProps
  selectors: string[]
}

export interface ILight {
  context: ILightContext
  selectors: string[]
}

export class Light implements ILight {

  context
  state: any
  listeners: any[]
  selectors: string[]
  scenes: string[] | Scene[]

  constructor(config: any) {
    this.state = {}
    this.context = config.context
    this.listeners = []
    this.selectors = config.selectors
    this.scenes = config.scenes

  }

  update(state: any) {
    console.log(state)
    this.state = state
  }

}

