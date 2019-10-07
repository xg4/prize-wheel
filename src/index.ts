import { query, loadImage } from './utils'
import Prize from './prize'
import Theme from './theme'

export interface ListItem {
  image: string
  text: string
}

export interface Options {
  el: string | HTMLCanvasElement
  list: ListItem[]
  duration?: number
  width?: number
  height?: number
}

export default class Turntable {
  private theme: Theme
  private $el: HTMLCanvasElement
  private $ctx: CanvasRenderingContext2D
  private radius: number // 转盘半径
  private center: { x: number; y: number } // 中心点
  private duration: number // 旋转时间
  private isStart = false // 是否开始旋转
  private count = 1 // 转盘次数
  private prizes: Prize[]
  private totalCount: number

  constructor({ el, list, duration, width, height }: Options) {
    this.theme = new Theme()
    this.$el = query(el)
    this.$ctx = this.$el.getContext('2d') as CanvasRenderingContext2D

    this.$el.width = width || 375
    this.$el.height = height || 375

    this.duration = duration || 6000

    this.totalCount = list.length

    this.center = {
      x: this.width / 2,
      y: this.height / 2
    }
    // 转盘半径
    this.radius = Math.min(this.width, this.height) / 2 - this.theme.outerWidth

    this.prizes = []
    Promise.all(list.map(item => loadImage(item.image))).then(images => {
      this.prizes = images.map((image, index) => {
        return new Prize({
          width: 60,
          height: 60,
          ...list[index],
          radian: (2 * Math.PI) / this.totalCount,
          image
        })
      })

      this.render()
    })
  }

  get width() {
    return this.$el.width
  }

  get height() {
    return this.$el.height
  }

  public random() {
    const index = Math.floor(Math.random() * (this.prizes.length - 1)) + 1
    return this.start(index)
  }

  public start(index: number) {
    return new Promise((resolve, reject) => {
      if (this.isStart) {
        return
      }
      this.isStart = true
      if (!index || index >= this.totalCount || index < 0) {
        const err = new Error('Invalid prizes index')
        reject(err)
      }
      const temp = 360 * 10 * this.count
      this.count++

      const itemAngle = (180 / Math.PI) * this.prizes[0].radian
      const firstAngle = (360 * 3) / 4 - itemAngle / 2
      const indexAngle = index * itemAngle
      const angle = firstAngle - indexAngle + temp
      this.$el.style.transform = `rotate(${angle}deg)`

      setTimeout(() => {
        resolve({
          prize: this.prizes[index],
          count: this.count
        })
        this.isStart = false
      }, this.duration)
    })
  }

  private render() {
    this.initAnimation()

    this.drawBackground()
    this.prizes.forEach(this.drawPrize.bind(this))
    this.drawPointer()
  }

  private initAnimation() {
    this.$el.style.transitionProperty = 'transform'
    this.$el.style.transitionDuration = `${this.duration}ms`
    this.$el.style.transitionTimingFunction = 'cubic-bezier(0.75,0,0.1,1)'
  }

  private drawPointer() {
    // padding
    this.$ctx.save()
    this.$ctx.beginPath()
    this.$ctx.arc(this.center.x, this.center.y, 80, 0 * Math.PI, 2 * Math.PI)
    this.$ctx.closePath()
    this.$ctx.fillStyle = '#400080'
    this.$ctx.fill()
    this.$ctx.restore()

    this.$ctx.save()
    this.$ctx.beginPath()
    this.$ctx.arc(this.center.x, this.center.y, 50, 0 * Math.PI, 2 * Math.PI)
    this.$ctx.closePath()
    this.$ctx.fillStyle = '#330066'
    this.$ctx.fill()
    this.$ctx.restore()

    // margin
    this.$ctx.save()
    this.$ctx.beginPath()
    this.$ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI)
    this.$ctx.closePath()
    this.$ctx.strokeStyle = this.theme.borderColor
    this.$ctx.lineWidth = 3
    this.$ctx.stroke()

    this.$ctx.save()
    this.$ctx.beginPath()
    this.$ctx.arc(
      this.center.x,
      this.center.y,
      this.radius - this.theme.outerWidth,
      0,
      2 * Math.PI
    )
    this.$ctx.closePath()
    this.$ctx.strokeStyle = this.theme.borderColor
    this.$ctx.lineWidth = 1
    this.$ctx.stroke()

    this.$ctx.save()
    this.$ctx.beginPath()
    this.$ctx.arc(this.center.x, this.center.y, 80, 0, 2 * Math.PI)
    this.$ctx.closePath()
    this.$ctx.strokeStyle = this.theme.borderColor
    this.$ctx.lineWidth = 5
    this.$ctx.stroke()

    // pointer
    // this.$ctx.save()
    // this.$ctx.beginPath()
    // this.$ctx.moveTo(this.center.x - 15, this.center.y)
    // this.$ctx.lineTo(this.center.x, this.center.y - (this.radius * 2) / 3)
    // this.$ctx.lineTo(this.center.x, this.center.y)
    // this.$ctx.closePath()
    // this.$ctx.fillStyle = '#ffd400'
    // this.$ctx.fill()

    // this.$ctx.beginPath()
    // this.$ctx.moveTo(this.center.x, this.center.y)
    // this.$ctx.lineTo(this.center.x, this.center.y - (this.radius * 2) / 3)
    // this.$ctx.lineTo(this.center.x + 15, this.center.y)
    // this.$ctx.closePath()
    // this.$ctx.fillStyle = '#ffaa00'
    // this.$ctx.fill()
    // this.$ctx.restore()
  }

  private drawPrize(prize: Prize, index: number) {
    const starRadian = prize.radian * index
    const endRadian = prize.radian * (index + 1)

    // prize arc
    this.$ctx.save()
    this.$ctx.beginPath()
    this.$ctx.moveTo(this.center.x, this.center.y)
    this.$ctx.arc(
      this.center.x,
      this.center.y,
      this.radius,
      starRadian,
      endRadian
    )
    this.$ctx.closePath()
    this.$ctx.fillStyle = '#4d0099'
    this.$ctx.fill()

    // line
    this.$ctx.save()
    this.$ctx.beginPath()
    this.$ctx.moveTo(this.center.x, this.center.y)
    this.$ctx.arc(
      this.center.x,
      this.center.y,
      this.radius,
      starRadian,
      endRadian
    )
    this.$ctx.closePath()
    this.$ctx.strokeStyle = this.theme.borderColor
    this.$ctx.lineWidth = 3
    this.$ctx.stroke()
    this.$ctx.restore()

    // prize text
    this.$ctx.fillStyle = '#a373e6'
    this.$ctx.font = '10px Bold Arial'
    this.$ctx.textBaseline = 'hanging'

    this.$ctx.translate(
      this.center.x +
        Math.cos(starRadian + prize.radian / 2) * (this.radius - 10),
      this.center.y +
        Math.sin(starRadian + prize.radian / 2) * (this.radius - 10)
    )
    this.$ctx.rotate(starRadian + prize.radian / 2 + Math.PI / 2)

    this.$ctx.fillText(
      prize.text,
      -this.$ctx.measureText(prize.text).width / 2,
      0
    )
    this.$ctx.restore()

    // prize image
    this.$ctx.save()
    this.$ctx.translate(
      this.center.x +
        Math.cos(starRadian + prize.radian / 2) * (this.radius - 55),
      this.center.y +
        Math.sin(starRadian + prize.radian / 2) * (this.radius - 55)
    )
    this.$ctx.rotate(starRadian + prize.radian / 2 + Math.PI / 2)
    this.$ctx.drawImage(
      prize.image,
      -prize.width / 2,
      -20,
      prize.width,
      prize.height
    )
    this.$ctx.restore()
  }

  private drawBackground() {
    this.$ctx.save()
    this.$ctx.beginPath()
    this.$ctx.arc(
      this.center.x,
      this.center.y,
      this.radius + this.theme.outerWidth,
      0 * Math.PI,
      2 * Math.PI
    )
    this.$ctx.closePath()
    this.$ctx.fillStyle = '#551295'
    this.$ctx.fill()
    this.$ctx.restore()

    // this.$ctx.save()
    // this.$ctx.beginPath()
    // this.$ctx.arc(
    //   this.center.x,
    //   this.center.y,
    //   this.radius + this.theme.outerWidth + 5,
    //   0 * Math.PI,
    //   2 * Math.PI
    // )
    // this.$ctx.closePath()
    // this.$ctx.strokeStyle = '#551295'
    // this.$ctx.stroke()
    // this.$ctx.restore()

    // this.$ctx.save()
    // this.$ctx.beginPath()
    // this.$ctx.arc(
    //   this.center.x,
    //   this.center.y,
    //   this.radius + this.theme.outerWidth + 30,
    //   0 * Math.PI,
    //   2 * Math.PI
    // )
    // this.$ctx.closePath()
    // this.$ctx.fillStyle = 'rgba(61,13,128,0.3)'
    // this.$ctx.fill()
    // this.$ctx.restore()
  }
}
