import fs from 'fs'
import { Light, ILight } from './types/Light'
import { filter } from 'lodash'
import Trigger from './types/Trigger'
import Variable from './types/Variable'
import Style from './types/Style'
import Scene from './types/Scene'


interface IStore {
  lights: Light[]
  triggers: Trigger[]
  variables: Variable[]
  styles: Style[]
  scenes: Scene[]
}


class Store implements IStore {

  lights: Light[]
  triggers: Trigger[]
  variables: Variable[]
  styles: Style[]
  scenes: Scene[]

  configPath: string

  constructor(configPath: string) {

    this.configPath = configPath

    this.lights = []
    this.triggers = []
    this.triggers = []
    this.variables = []
    this.styles = []
    this.scenes = []


  }

  //TODO create a config schema or apply null checks in the case of missing
  async loadConfig() {
    const config: IStore = JSON.parse(await fs.readFileSync("./config.json", "utf8"))


    this.lights = config.lights.map((lightConfig: any) =>
      new Light(lightConfig))

    this.triggers = config.triggers.map((triggerConfig: any) =>
      new Trigger(triggerConfig))

    this.variables = config.variables.map((variableConfig: any) =>
      new Variable(variableConfig))

    this.styles = config.styles.map((styleConfig: any) =>
      new Style(styleConfig, this.variables))

    this.scenes = config.scenes.map((sceneConfig: any) =>
      new Scene(sceneConfig, this.lights, this.styles))

  }



}

export default Store