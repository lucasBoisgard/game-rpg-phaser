var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 900,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 }
        }
      },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let cursors;
let player;
let showDebug = false;
let solid;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('tiles', 'assets/map/tiles/terrain_base.png');
    this.load.tilemapTiledJSON('map', 'assets/map/csv/map2.json');

    this.load.atlas("atlas_move", "assets/character/move/BODY_male.png", "assets/character/move/sprites1.json");
}

function create ()
{
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("terrain", "tiles");
    const layer0 = map.createStaticLayer("terrain00", tileset, 0, 0);
    const spawnPoint = map.findObject("Objects", obj => obj.name === "spawn");

    solid = map.createStaticLayer("terrain_solid", tileset, 0, 0);


    solid.setCollisionByProperty({ solid: true });

    player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "atlas_move", "face1")
    this.physics.add.collider(player, solid);


    const anims = this.anims;
    anims.create({
      key: "face",
      frames: anims.generateFrameNames("atlas_move", {
        prefix: "face",
        start: 0,
        end: 9,
      } ),
      frameRate: 15,
      repeat: -1
    });
    anims.create({
      key: "left",
      frames: anims.generateFrameNames("atlas_move", {
        prefix: "left",
        start: 0,
        end: 9,
      }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "right",
      frames: anims.generateFrameNames("atlas_move", {
        prefix: "right",
        start: 0,
        end: 9,
      }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "back",
      frames: anims.generateFrameNames("atlas_move", {
        prefix: "back",
        start: 0,
        end: 9,
      }),
      frameRate: 15,
      repeat: -1
    });


  const camera = this.cameras.main;
  camera.zoom = 2;
  cursors = this.input.keyboard.createCursorKeys();
  camera.startFollow(player);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);


    debugGraphics = this.add.graphics();
    map.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 128), 
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) 
        
      });
      debugGraphics.clear();

      this.input.keyboard.on('keydown_C', function (event)
      {
          showDebug = !showDebug;
          drawDebug();
      });
  

}

function update(time, delta) {
  let speed = 120;
  const prevVelocity = player.body.velocity.clone();

  // Stop any previous movement from the last frame
  player.body.setVelocity(0);

  // Horizontal movement
  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
  }

  // Vertical movement
  if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
  }

  if (cursors.shift.isDown) {
    speed += 100
  } else {
    speed = 120
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);

  // Update the animation last and give left/right animations precedence over up/down animations
  if (cursors.left.isDown) {
    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.anims.play("right", true);
  } else if (cursors.up.isDown) {
    player.anims.play("back", true);
  } else if (cursors.down.isDown) {
    player.anims.play("face", true);
  } else {
    player.anims.stop();
  }
}

function drawDebug ()
{
    debugGraphics.clear();
    if (showDebug)
    {
        // Pass in null for any of the style options to disable drawing that component
        solid.renderDebug(debugGraphics, {
            tileColor: null, // Non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
        });
    }

}