const toPct = (range: number[], target: number) => {
  return ((target - range[0]) * 100) / (range[1] - range[0]) + '%'
}

const to8bit = (range: number[], target: number) => {
  return ((target - range[0]) * 255) / (range[1] - range[0])
}

// const brightnessAdjustmentFromPercentage = (percentage, brightness) => {


// }


const res = toPct([2700, 3500], 3500)


// brightnessAdjustmentFromPercentage(res)
