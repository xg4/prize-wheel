export interface PrizeOptions {
  image: HTMLImageElement
  text: string
  width?: number
  height?: number
  radian: number
}

export default class Prize {
  public image: HTMLImageElement
  public text: string
  public radian: number

  constructor({ image, text, radian, width, height }: PrizeOptions) {
    this.image = image
    this.text = text
    this.radian = radian

    if (typeof width !== 'undefined') this.image.width = width
    if (typeof height !== 'undefined') this.image.height = height
  }

  get width() {
    return this.image.width
  }

  get height() {
    return this.image.height
  }
}
