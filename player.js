class Player {
  constructor(xpos, ypos, playerId) {
    this.xpos = xpos
    this.ypos = ypos
    this.playerId = playerId
    this.xspeed = 0
    this.yspeed = 0
    this.xaccel = 0
    this.yaccel = 0.1
    this.xfriction = 0.8
    this.yfriction = 1
    this.size = tile * 0.8
    this.ammo = 10
    this.life = 10
    this.canJump = true
    this.jumping = false
    this.jumpingMovments = collison(this.xpos, this.ypos, this.xspeeed,this.yspeed, 0, this.size, this.size)
  }
  // this.health = 3
   jump() {
     print(this.canJump)
     if(this.canJump){
     this.yspeed = -jumpSpeed
     this.canJump = false
   }
   }
  move() {
    this.xspeed = this.xfriction * this.xspeed
    this.yspeed = this.yfriction * this.yspeed
    this.xspeed = this.xspeed + this.xaccel
    this.yspeed = this.yspeed + this.yaccel
    var possibleMovments = collison(this.xpos, this.ypos, this.xspeed, this.yspeed, this.size, this.size)
    if (possibleMovments.x) {
      this.xpos = this.xpos + this.xspeed
    } else {
      this.xspeed = 0
    }
    if (possibleMovments.y) {
      this.ypos = this.ypos + this.yspeed
    } else {
      this.yspeed = 0
    }
  }
  display() {
    fill(255, 0, 0)
    if(this.yspeed == 0){
      playerIdleImages[this.playerId].display(this.xpos, this.ypos-(tile-this.size))
    }
    else if(this.yspeed < 0){
      image(playerJumpingImages[this.playerId], this.xpos, this.ypos-(tile-this.size))
    }else if(this.yspeed > 0){
      image(playerFallingImages[this.playerId], this.xpos, this.ypos-(tile-this.size))
    }

  }
  update(){
    this.move()
    this.display()
    if(validiatePosition(this.xpos, this.ypos+tile) == false || validiatePosition(this.xpos+this.size, this.ypos+tile) == false ){
      this.canJump = true
    }
  }
}
