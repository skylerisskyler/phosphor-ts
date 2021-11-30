import { find } from "lodash"
import Store from "../store"
import Scene from "./Scene"
import Variable from "./Variable"

export interface StyleProps {
  brightness?: number
  color?: string
}

class Style {

  props: StyleProps
  listeners: any[]

  constructor(styleConfig: any, variables: Variable[]) {
    this.props = {}
    Object.entries(styleConfig.props).forEach(([prop, value]) => {
      const isVariable = (value as string).includes('$')
      if (prop === "brightness") {
        if (isVariable) {
          const namespace = (value as string).replace('$', '')
          const variable = find(variables, { namespace })
          if (variable) {
            variable.addListener(this, prop)
          } else {
            throw new Error('variable does not exist')
          }
        }
      }
    })
    this.listeners = []
  }

  addListener(listener: Function) {
    this.listeners.push(listener)
  }


  update(newProps: StyleProps) {
    Object.assign(this.props, newProps)
    this.listeners.forEach((listener) => listener(this.props))
  }
}

export default Style