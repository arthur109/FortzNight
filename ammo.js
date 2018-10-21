class Ammo {
  constructor(xpos) {
    this.yspeed = 0
    this.accel = 0.1
    this.ypos = 0
    this.xpos = xpos
  }
  move() {
    this.yspeed = this.yspeed + this.accel
    var temp = collison(this.xpos, this.ypos, 0, this.yspeed, tile * 0.4, tile * 0.6)
    if (temp.y) {
      this.ypos += this.yspeed
    } else {
      this.yspeed = 0
    }
  }
  display() {
    fill(212, 175, 55)
    image(ammoImage, this.xpos, this.ypos, tile, tile)
  }
  check() {
    if (dist(this.xpos, this.ypos, player1.xpos, player1.ypos) <= tile) {
      player1.ammo += 15
      var i = ammos.indexOf(this);
      ammos.splice(i, 1);
    }
    if (dist(this.xpos, this.ypos, player2.xpos, player2.ypos) <= tile) {
      player2.ammo += 15
      var i = ammos.indexOf(this);
      ammos.splice(i, 1);
    }
  }
  update() {
    this.move()
    this.display()
    this.check()
  }
}
