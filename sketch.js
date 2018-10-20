// bulletInfo[
//   {
//   areaDamage:false,
//   directDamage:true,
//   directDamageAmount:0.5,
//   ammoUsage:0.5,
//   image[1],
//   weight:0,
//   rechargeTime:2
// },{
//   areaDamage:false,
//   directDamage:true,
//   directDamageAmount:2
//   ammoUsage:0.5
//   image[1]
//   weight:0.05
// },{
//   areaDamage:false,
//   directDamage:true,
//   directDamageAmount:0.5,
//   ammoUsage:0.5,
//   image[1],
//   weight:0,
//   rechargeTime:2
// },{
//]

class Ammo {
  constructor(xpos) {
    this.yspeed = 0
    this.accel = 0.1
    this.ypos = 0
    this.xpos = xpos
  }
  move() {
    this.yspeed = this.yspeed + this.accel
    var temp = collison(this.xpos, this.ypos, 0, this.yspeed, tile * 0.75, tile * 0.75)
    if (temp.y) {
      this.ypos += this.yspeed
    } else {
      this.yspeed = 0
    }
  }
  display() {
    fill(212, 175, 55)
    image(ammoImage, this.xpos, this.ypos, tile * 0.75, tile * 0.75)
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
    this.jumping = false
    this.jumpingMovments = collison(this.xpos, this.ypos, this.xspeeed,this.yspeed, 0, this.size, this.size)
  }
  // this.health = 3
   jump() {
     this.yspeed = -jumpSpeed
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
    if(this.yspeed <= -0.2){
      image(playerJumpingImages[this.playerId], this.xpos, this.ypos-(tile-this.size))
    }else if(this.yspeed >= 0.2){
      image(playerFallingImages[this.playerId], this.xpos, this.ypos-(tile-this.size))
    }else{
      playerIdleImages[this.playerId].display(this.xpos, this.ypos-(tile-this.size))
  }

  }
  update() {
    if(this.yspeed >= 0){
      this.jumpingMovments = collison(this.xpos, this.ypos, this.xspeed, this.yspeed, this.size, this.size)
    }else{
      this.jumpingMovments = collison(this.xpos, this.ypos, this.xspeed, -this.yspeed, this.size, this.size)
    }
    this.move()
    this.display()
    if(this.jumpingMovments.down == false){
      this.jumping = false
      print("on the ground")
    }else{
      this.jumping = true
      print("not")
    }
  }
}


var placeCannon = false
var speed = 3
var gravity = 0.9
var tile = 50
var player1
var player2
var jumpSpeed = 6
var ammocount = 0
var ammos = []
var bricks = []
var bullets = []
var bulletImages = []
var playerIdleImages = []
var playerJumpingImages = []
var playerFallingImages = []
var grass = 0
var selectedCannonSize

function setup() {
  noSmooth
  var width = int(1050 / tile) * tile
  var height = int(600 / tile) * tile
  createCanvas(width, height)
  player1 = new Player(200, 200, 1)
  player2 = new Player(width - 200, 200, 2)
  grid = twoDArray(int(width / tile), int(height / tile) - 1)
}

function draw() {
  background(244, 255, 196)
  fill(0, 100, 0)
  text(player1.ammo, 20, 20)
  text(player2.ammo, width - 20, 20)
  text(player1.life, 20, 40)
  text(player2.life, width - 20, 40)
  drawMap()
  controlls()
  player1.update()
  player2.update()
  if (frameCount % 500 == 0) {
    ammos.push(new Ammo(int(random(20, width - 20))))
  }
  for (var i = ammos.length - 1; i >= 0; i--) {
    ammos[i].update()
  }
  for (var i = 0; i < bullets.length; i++) {
      bullets[i].update()
      if(bullets[i].isDead){
        bullets.splice(i,1)
        i = i-1
      }
  }
  for (var x = 0; x < grid.length; x++) {
    image(grass, x * tile, (grid[0].length - 1) * tile, tile, tile)
  }
  fill(0)
  rect(0, (grid[0].length) * tile, width, tile)
}

function preload() {
  playerIdleImages[1] = new AnimImage(
    [
      "players/player1/idle1.png",
      "players/player1/idle2.png",
      "players/player1/idle3.png",
      "players/player1/idle4.png",
      "players/player1/idle5.png"

], 5)
  playerIdleImages[2] = new AnimImage(
    [
      "players/player2/idle1.png",
      "players/player2/idle2.png",
      "players/player2/idle3.png",
      "players/player2/idle4.png",
      "players/player2/idle5.png"

], 5)

  playerJumpingImages[1] = loadImage("players/player1/jumping.png")
  playerJumpingImages[2] = loadImage("players/player2/jumping.png")

  playerFallingImages[1] = loadImage("players/player1/falling.png")
  playerFallingImages[2] = loadImage("players/player2/falling.png")

  ammoImage = loadImage("ammo.png")
  bulletImages[1] = loadImage("bullet1.png")
  bulletImages[2] = loadImage("bullet2.png")
  bulletImages[3] = loadImage("bullet3.png")
  bricks[4] = loadImage("block1.png")
  bricks[3] = loadImage("block2.png")
  bricks[2] = loadImage("block3.png")
  bricks[1] = loadImage("block4.png")
  grass = loadImage("grass.png")
}

function controlls() {
  if (keyIsDown(68)) {
    player1RightMove()
  }

  if (keyIsDown(65)) {
    player1.xspeed = -speed
  }
  if (keyIsDown(87)) {
    if(player1.jumping == false){
      player1UpMove()
      player1.jumping=true
    }
  }
  if (keyIsDown(83)) {
    player1DownMove()
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player2.xspeed = speed
  }
  if (keyIsDown(LEFT_ARROW)) {
    player2LeftMove()
  }
  if (keyIsDown(UP_ARROW)) {
    if(player2.jumping == false){
      player2UpMove()
      player2.jumping = true
    }
  }
  if (keyIsDown(DOWN_ARROW)) {
    player2DownMove()
  }
  if (keyIsDown(67)) {
    placeCannon = true
    selectedCannonSize = 0.5
  }
  if (keyIsDown(86)) {
    placeCannon = true
    selectedCannonSize = 1
  }
  if (keyIsDown(66)) {
    placeCannon = true
    selectedCannonSize = 1.5
  }
}

function whatDidYouHit(x, y) {
  x = pixelToIndex(x)
  y = pixelToIndex(y)
  if (x >= 0 && x < grid.length && y >= 0 && y < grid[1].length) {
    if (grid[x][y] == null) {
      return (true)
    } else {
      return grid[x][y]
    }
  } else {
    return (false)
  }
}

function validiatePosition(x, y) {
  x = pixelToIndex(x)
  y = pixelToIndex(y)
  if (x >= 0 && x < grid.length && y >= 0 && y < grid[1].length) {
    if (grid[x][y] == null) {
      return (true)

    } else {

      return (false)
    }
  } else {

    return (false)
  }
}

function drawMap() {
  for (w = 0; w < grid.length; w++) {
    for (l = 0; l < grid[0].length; l++) {
      if (grid[w][l] != null) {
        grid[w][l].display()
      }
    }
  }
}

function mouseClicked() {
  if (placeCannon) {
    //fill(138,43,226)
    //rect(int(mouseX/tile)*tile,int(mouseY/tile)*tile,tile*2,tile)
    //fill(255)
    grid[pixelToIndex(mouseX)][pixelToIndex(mouseY)] = new Turret(roundToTile(mouseX), roundToTile(mouseY), selectedCannonSize)
    placeCannon = false
  } else {
    //rect(int(mouseX/tile)*tile,int(mouseY/tile)*tile,tile,tile)
    grid[pixelToIndex(mouseX)][pixelToIndex(mouseY)] = new Brick(roundToTile(mouseX), roundToTile(mouseY))
  }
}

function twoDArray(lenght, depth) {
  var temp = new Array(lenght);

  for (var i = 0; i < temp.length; i++) {
    temp[i] = new Array(depth);
  }
  return temp
}

function collison(xcord, ycord, xspeed, yspeed, wd, ht, applyX, applyY) {
  movementsPossible = {
    x: false,
    y: false,
    up:false,
    down:false,
    right:false,
    left:false
  }
  if (xspeed < 0) {
    if (validiatePosition(xcord + xspeed, ycord) && validiatePosition(xcord + xspeed, ycord + ht)) {
      movementsPossible.x = true
      movementsPossible.left = true
    }
  } else if (xspeed > 0) {
    if (validiatePosition(xcord + xspeed + wd, ycord) && validiatePosition(xcord + xspeed + wd, ycord + ht)) {
      movementsPossible.x = true
      movementsPossible.right = true
    }
  }
  if (yspeed < 0) {
    if (validiatePosition(xcord, ycord + yspeed) && validiatePosition(xcord + wd, ycord + yspeed)) {
      movementsPossible.y = true
      movementsPossible.up = true
    }
  }
  if (yspeed > 0) {
    if (validiatePosition(xcord, ycord + yspeed + ht) && validiatePosition(xcord + ht, ycord + yspeed + ht)) {
      movementsPossible.y = true
      movementsPossible.down = true
    }
  }
  return (movementsPossible)
}


player1RightMoveBackup = function() {
  player1.xspeed = speed
}
player1RightMove = function(){
  player1RightMoveBackup()
}
player1UpMoveBackup = function() {
  player1.jump()
}
player1UpMove = function() {
  player1UpMoveBackup()
}
player1DownMoveBackup = function() {
  if (validiatePosition(player1.xpos + (tile / 2), player1.ypos - tile)) {
    grid[int((player1.xpos + (tile / 2)) / tile)][int((player1.ypos - tile) / tile)] = new Brick(roundToTile(player1.xpos + (tile / 2)), roundToTile(player1.ypos - tile))
  }
}
player1DownMove = function() {
  player1DownMoveBackup()
}


player2LeftMoveBackup = function() {
  player2.xspeed = -speed
}
player2LeftMove = function(){
  player2LeftMoveBackup()
}
player2UpMoveBackup = function() {
  player2.jump()
}
player2UpMove = function() {
  player2UpMoveBackup()
}
player2DownMoveBackup = function() {
  if (validiatePosition(player2.xpos + (tile / 2), player2.ypos - tile)) {
    grid[int((player2.xpos + (tile / 2)) / tile)][int((player2.ypos - tile) / tile)] = new Brick(roundToTile(player2.xpos + (tile / 2)), roundToTile(player2.ypos - tile))
  }
}
player2DownMove = function() {
  player2DownMoveBackup()
}

function pixelToIndex(pixel) {
  return (int(pixel / tile))
}

function indexToPixel(index) {
  return (index * tile)
}

function roundToTile(pixel) {
  return indexToPixel(pixelToIndex(pixel))
}

function angleToVector(angle, length) {
  length = typeof length !== 'undefined' ? length : 10;
  angle = angle * Math.PI / 180; // if you're using degrees instead of radians
  return [length * Math.cos(angle), length * Math.sin(angle)]
}
