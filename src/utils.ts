export function loadImage(
  imgUrl: string,
  width?: number,
  height?: number
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image(width, height)
    img.onload = () => {
      resolve(img)
    }
    img.onerror = reject
    img.src = imgUrl
  })
}

export function query(el: string | HTMLCanvasElement): HTMLCanvasElement {
  if (typeof el === 'string') {
    const selected = document.querySelector(el)
    if (!selected || selected.tagName !== 'CANVAS') {
      const canvas = document.createElement('canvas')
      document.body.appendChild(canvas)
      return canvas
    }
    return selected as HTMLCanvasElement
  } else {
    return el
  }
}

export function shuffle(arr: any[]) {
  let length = arr.length
  while (length > 1) {
    const index = Math.floor(Math.random() * length--)
    ;[arr[length], arr[index]] = [arr[index], arr[length]]
  }
  return arr
}
