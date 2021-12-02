
import { find } from "lodash"
import Layer from "./Layer"
import Scene from "./Scene"

import { loggers } from 'winston';
const logger = loggers.get('logger')


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
  layers: Layer[]

  constructor(config: any) {
    this.state = {}
    this.context = config.context
    this.listeners = []
    this.selectors = config.selectors
    this.layers = config.layers.map((layer: Layer) => new Layer(layer.scene, this))

  }

  update(state: any) {
    logger.info(state)
    this.state = state
  }

}

