import fs from 'fs'

const CONFIG_PATH = './config.json'

const configSchema: any = {
  lights: []
}

const config = null


const init = () => {
  if (!fs.existsSync(CONFIG_PATH) && config === null) {
    save(configSchema)
  }

  return load()
}

const load = () => {
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
}

const save = (config: any) => {
  return fs.writeFileSync(CONFIG_PATH, JSON.stringify(config))
}

export default {
  load,
  save,
  init
}