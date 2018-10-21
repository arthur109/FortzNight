class Bullet {
  constructor(xpos, ypos, xspeed, yspeed, size) {
    this.xpos = xpos
    this.ypos = ypos
    this.size = size
    this.xspeed = xspeed
    this.yspeed = yspeed
    this.yaccel = 0.1
    if (this.size < 1) {
      this.myImage = bulletImages[1]
    } else {
      this.myImage = bulletImages[int(this.size)]
    }
    this.isDead = false
  }
  move() {
    this.yspeed += this.yaccel
    this.offset = tile / 2
    var probe = whatDidYouHit(this.xpos + this.offset, this.ypos + this.offset)
    if (probe != false) {
      if (probe == true) {
        this.xpos += this.xspeed
        this.ypos += this.yspeed
      } else {
        probe.health -= this.size
        this.killYourself()
      }
    } else {
      this.killYourself()
    }
  }
  display() {
    fill(0, 255, 0)
    image(this.myImage, this.xpos, this.ypos, tile, tile)
  }
  check() {
    if (pixelToIndex(this.xpos) == pixelToIndex(player1.xpos) && pixelToIndex(this.ypos) == pixelToIndex(player1.ypos)) {
      player1.life -= this.size
      this.killYourself()
    } else if (pixelToIndex(this.xpos) == pixelToIndex(player2.xpos) && pixelToIndex(this.ypos) == pixelToIndex(player2.ypos)) {
      player2.life -= this.size
      this.killYourself()
    }
  }
  killYourself() {
    this.isDead = true
  }
  update() {
    this.move()
    this.check()
    this.display()
  }
}
