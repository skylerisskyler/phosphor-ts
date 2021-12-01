import { extendResolversFromInterfaces } from "@graphql-tools/schema";
import { Light } from "./Light";
import Style from "./Style";


class Cascade {

  selector: string
  lights: Light[]
  // style: Style
  inheritors: Cascade[]

  constructor(selectors: string[], light?: Light) {
    const selector = selectors.pop()

    if (!selector) {
      throw new Error('selector is not defined')
    }

    this.selector = selector
    this.lights = []
    this.inheritors = []

    if (selectors.length && light) {
      this.add(selectors, light)
    } else if (selectors.length === 0 && light) {
      console.log('ssss')
      this.lights.push(light)
    }


    // this.lights = []
    // this.style = style
    // this.inheritors = []
  }

  add(selectors: string[], light: Light) {
    const inheritor = new Cascade(selectors, light)
    this.inheritors.push(inheritor)
  }

}

export default Cascade