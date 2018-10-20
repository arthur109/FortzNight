class AnimImage {
  constructor(imagePaths, delay) {
    this.images = []
    this.counter = 0
    this.delay = delay
    this.lastDisplayFrame = 0
    for (var i = 0; i < imagePaths.length; i++) {
      this.images[i] = loadImage(imagePaths[i])
    }
  }
  display(xpos, ypos, width, height) {
    image(this.images[this.counter],xpos,ypos)
    this.increment()
  }
  increment() {
    if (frameCount - this.lastDisplayFrame >= this.delay) {
      if (this.counter == this.images.length - 1) {
        this.counter = -1
      }
      this.counter = this.counter + 1
      this.lastDisplayFrame = frameCount
    }
  }

}
