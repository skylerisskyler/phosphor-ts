import Style, { StyleProps } from "./Style";
import { Light } from './Light'
import { find, merge } from "lodash";
import Cascade from './Cascade'
import fs from 'fs'
import util from 'util'

interface IScene {
  name: string
  cascade: any
}

interface ICascade {
  [key: string]: any
}

class Scene {

  name: string
  cascade: Cascade

  constructor(config: any, lights: Light[], styles: Style[]) {
    this.name = config.name
    this.cascade = new Cascade(['root'])

    const cascadeConfig = config.cascade

    const compiled = cascadeConfig.map((s: any) => {
      const style = find(styles, { id: s.style })
      if (!style) {
        throw new Error('style does not exist')
      }

      return {
        selector: s.selector,
        style
      }
    })

    // console.log(compiled)

    const sceneLights = lights.filter((light) => {
      const sceneIdx = light.scenes.findIndex((sceneName) => {
        return sceneName === this.name
      })

      if (sceneIdx < 0) {
        throw new Error('Scene does not exist on light')
      }
      light.scenes[sceneIdx] = this
      return true
    })

    sceneLights.forEach((sceneLight: Light) => {
      this.cascade.add(sceneLight.selectors, sceneLight)
    })
  }

  update(props: StyleProps) {

  }
}

export default Scene