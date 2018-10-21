class Turret {
  constructor(xpos, ypos, size) {
    this.playerOffset = 0
    this.size = size
    if (xpos < width / 2) {
      this.player = player1
      this.playerId = "player1"
      this.playerOffset = -1
      this.angle = 0
    }
    if (xpos > width / 2) {
      this.player = player2
      this.playerId = "player2"
      this.playerOffset = 1
      this.angle = 180
    }
    this.xpos = xpos
    this.ypos = ypos
    this.xindex = pixelToIndex(xpos)
    this.yindex = pixelToIndex(ypos)
    this.shootDelay = 5
    this.delayCount = 0
    this.CurrentlyHijacking = false;
  }
  display() {
    this.update()
    fill(0, 0, 255, 100)
    rect(this.xpos, this.ypos, tile, tile)
    fill(0, 255, 0)
    push()
    rectMode(CENTER)
    translate(this.xpos + tile / 2, this.ypos + tile / 2)
    rotate(radians(this.angle))
    rect(tile / 3, 0, tile * 2, tile / 2)
    rectMode(CORNER)
    pop()
  }
  shoot() {
    if (this.delayCount > this.shootDelay) {
      var direction = angleToVector(this.angle, 1)
      bullets.push(new Bullet(this.xpos + (direction[0] * tile), this.ypos + (direction[1] * tile), direction[0] * 10, direction[1] * 10, this.size))
      this.delayCount = 0
    }
  }
  update() {
    this.delayCount = this.delayCount + 1
    // console.log("checking for Hijack")
    if (pixelToIndex(this.player.xpos) == this.xindex + this.playerOffset && pixelToIndex(this.player.ypos) == this.yindex) {
      if (this.playerId == "player1") {
        player1RightMove = () => {
          this.shoot()
        }
        player1UpMove = () => {
          this.angle = this.angle - 1
        }
        player1DownMove = () => {
          this.angle = this.angle + 1
        }
      } else if (this.playerId == "player2") {
        player2LeftMove = () => {
          this.shoot()
        }
        player2UpMove = () => {
          this.angle = this.angle + 1
        }
        player2DownMove = () => {
          this.angle = this.angle - 1
        }
      }
      this.CurrentlyHijacking = true
    } else if (this.CurrentlyHijacking) {
      if (this.playerId == "player1") {
        player1RightMove = function() {
          player1RightMoveBackup()
        }
        player1UpMove = function() {
          player1UpMoveBackup()
        }
        player1DownMove = function() {
          player1DownMoveBackup()
        }
      } else if (this.playerId == "player2") {
        player2LeftMove = function() {
          player2LeftMoveBackup()
        }
        player2UpMove = function() {
          player2UpMoveBackup()
        }
        player2DownMove = function() {
          player2DownMoveBackup()
        }
      }
      this.CurrentlyHijacking = false
    }

  }
}
