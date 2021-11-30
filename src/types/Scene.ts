import Style, { StyleProps } from "./Style";
import { Light } from './Light'

interface IScene {
  name: string
  styleGraph: any
}

class Scene {

  name
  styleGraph

  constructor(config: any, lights: Light[], styles: Style[]) {
    this.name = config.name

    this.styleGraph = {}

    const styleGraph = Object.entries(config.styleGraph)
      .forEach(([key, value]) => {
        this.styleGraph[key] = value
      })
  }

  update(props: StyleProps) {

  }
}

export default Scene