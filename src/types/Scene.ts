import Style, { StyleProps } from "./Style";
import { Light } from './Light'
import { find, merge } from "lodash";
import Cascade from './Cascade'
import fs from 'fs'
import util from 'util'
import Layer from "./Layer";

interface IScene {
  name: string
  cascade: any
}

interface ICascade {
  [key: string]: any
}

export interface StyleMap {
  selector: string
  style: Style
}

class Scene {

  name: string
  cascade: Cascade

  constructor(config: any, lights: Light[], styles: Style[]) {
    this.name = config.name
    this.cascade = new Cascade(['root'])

    const cascadeConfig = config.cascade

    const styleMaps: StyleMap[] = cascadeConfig.map((s: any) => {

      const style = find(styles, { id: s.style })
      if (!style) {
        throw new Error('style does not exist')
      }

      return {
        selector: s.selector,
        style
      }
    })

    const layers = lights.reduce((layers, light: Light) => {

      const layerMatch = light.layers.find((layer: Layer) => {
        return layer.setScene(this)
      })

      if (layerMatch) {
        layers.push(layerMatch)
      }

      return layers

    }, [] as Layer[])


    layers.forEach((layer: Layer) => {
      this.cascade.add(layer.light.selectors, layer, styleMaps)
    })

    // console.log(util.inspect(this.cascade, false, null, true /* enable colors */))

    console.log(this.cascade)


  }



  update(props: StyleProps) {

  }
}

export default Scene