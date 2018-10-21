class Brick {
  constructor(xpos, ypos) {
    this.xpos = xpos
    this.ypos = ypos
    this.health = 4
  }
  display() {
    if (int(this.health) > 0) {
      var imageNum = int(this.health)
      image(bricks[imageNum], this.xpos, this.ypos, tile, tile)
    } else {
      grid[pixelToIndex(this.xpos)][pixelToIndex(this.ypos)] = null
    }
  }
}
