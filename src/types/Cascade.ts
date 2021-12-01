import { Light } from "./Light";
import Style from "./Style";
import { find } from 'lodash'
import Layer from "./Layer";
import { StyleMap } from "./Scene";




class Cascade {

  selector: string
  layers: Layer[] | undefined
  style: Style | undefined

  inheritors: Cascade[]

  constructor(selectors: string[], layer?: Layer, styleMaps?: StyleMap[]) {


    this.inheritors = []
    this.layers = []

    const selector = selectors.pop()
    if (!selector) {
      throw new Error('selector is not defined')
    } else {
      this.selector = selector
    }

    //check not a root constructor call
    if (layer && styleMaps) {
      const styleMapMatch = styleMaps.find((s) => s.selector === this.selector)
      if (styleMapMatch) {
        this.style = styleMapMatch.style
      } else {
        throw new Error('no style matched to selector')
      }

      if (selectors.length) {
        //this cascade is a node
        this.add(selectors, layer, styleMaps)
      } else {
        //this cascade is a leaf
        this.layers.push(layer)
      }
    }



  }

  add(selectors: string[], layer: Layer, styleMaps: StyleMap[]) {

    //TODO add checks

    const inheritor = new Cascade(selectors, layer, styleMaps)
    this.inheritors.push(inheritor)
  }

  render() {

  }

}

export default Cascade