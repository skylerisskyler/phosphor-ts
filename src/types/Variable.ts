import Style from "./Style"

interface Context {

}
interface IHaContextProps {
  entityId: string
  attributes: string
}

interface IHaContext {
  type: "home-assistant"
  props: IHaContextProps
}

export interface IVariable {
  context: IHaContext
}

class Variable implements IVariable {

  namespace: string
  context: IHaContext
  value: any
  listeners: any[]

  constructor(config: any) {
    this.namespace = config.namespace
    this.context = config.context
    this.value = undefined
    this.listeners = []
  }

  addListener(style: Style, prop: string) {
    this.listeners.push(
      (value: any) => style.update({ [prop]: value }
      ))
  }


}

export default Variable