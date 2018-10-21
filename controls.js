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
