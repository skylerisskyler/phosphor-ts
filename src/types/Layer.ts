import { Light } from "./Light"
import Scene from "./Scene"

class Layer {

  scene: Scene | string
  light: Light

  isActive: boolean

  constructor(scene: Scene | string, light: Light) {
    this.scene = scene
    this.light = light
    this.isActive = false
  }

  setScene(scene: Scene) {
    if (typeof this.scene === 'string' && this.scene === scene.name) {
      this.scene = scene
      return true
    }
    return false
  }

  activate() {
    this.isActive = true
  }

  deactivate() {
    this.isActive = false
  }

}

export default Layer