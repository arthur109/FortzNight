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

  ammoImage = loadImage("pixel-art/ammo.png")
  bulletImages[1] = loadImage("pixel-art/bullets/bullet1.png")
  bulletImages[2] = loadImage("pixel-art/bullets/bullet2.png")
  bulletImages[3] = loadImage("pixel-art/bullets/bullet3.png")
  bricks[4] = loadImage("pixel-art/blocks/block1.png")
  bricks[3] = loadImage("pixel-art/blocks/block2.png")
  bricks[2] = loadImage("pixel-art/blocks/block3.png")
  bricks[1] = loadImage("pixel-art/blocks/block4.png")
  grass = loadImage("pixel-art/grass.png")
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
