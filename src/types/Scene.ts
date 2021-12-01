import Style, { StyleProps } from "./Style";
import { Light } from './Light'
import { find, merge } from "lodash";

interface IScene {
  name: string
  styleGraph: any
}

interface StyleGraph {
  [key: string]: any
}

class Scene {

  name: string
  styleGraph: StyleGraph

  constructor(config: any, lights: Light[], styles: Style[]) {
    this.name = config.name
    this.styleGraph = {}

    const styleGraph = config.styleGraph

    const compiled = styleGraph.map((s: any) => {
      const style = find(styles, { id: s.style })
      if (!style) {
        throw new Error('style does not exist')
      }

      return {
        selector: s.selector,
        style
      }
    })

    console.log(compiled)

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

    const res = sceneLights.reduce((acc: any, sceneLight: Light) => {

      const zz = sceneLight.selectors.reverse().reduce((acc: any, selector: string) => {
        if (Object.keys(acc).length === 0) {
          if (!acc.lights) {
            acc.lights = []
          }
          if (!acc.style) {
            const style = compiled.find((c: any) => {
              return c.selector === selector
            })
            if (!style) {
              throw new Error('style does not exist')
            }
            acc.style = style
          }
          acc.lights.push(sceneLight)
        }
        return { [selector]: acc }
      }, {})


      return merge(zz, acc)
    }, {})
    console.log('REZZ', res)

  }

  update(props: StyleProps) {

  }
}

export default Scene