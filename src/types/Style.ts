import { find } from "lodash"
import Store from "../store"
import Scene from "./Scene"
import Variable from "./Variable"

export interface StyleProps {
  [prop: string]: string
}

class Style {

  id: string
  props: StyleProps
  listeners: any[]

  constructor(config: any, variables: Variable[]) {
    this.id = config.id
    this.props = {}

    Object.entries(config.props as StyleProps).forEach(([prop, value]) => {
      const isVariable = value.includes('$')
      if (isVariable) {
        const namespace = value.replace('$', '')
        const variable = find(variables, { namespace })
        if (!variable) {
          throw new Error('variable does not exist')
        }
        variable.addListener(this, prop)
      }
      Object.assign(this.props, { prop: value })
    })
    this.listeners = []
  }

  addListener(listener: Function) {
    this.listeners.push(listener)
  }

  merge(style: Style) {
    return Object.assign(style.props, this.props)
  }


  update(newProps: StyleProps) {
    Object.assign(this.props, newProps)
    this.listeners.forEach((listener) => listener(this.props))
  }
}

export default Style