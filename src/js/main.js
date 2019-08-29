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
let spacebar;
let orientation = "face";
var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('tiles', 'assets/map/tiles/terrain_base.png');
    this.load.tilemapTiledJSON('map', 'assets/map/csv/map2.json');
    this.load.spritesheet('sword', 'assets/character/attack/sword.png',{ frameWidth: 192, frameHeight: 192 });
    this.load.atlas("atlas_attack", "assets/character/attack/BODY_human.png", "assets/character/attack/attack.json");
    this.load.atlas("atlas_attack_sword", "assets/character/attack/sword.png", "assets/character/attack/sword.json");
    this.load.atlas("atlas_move", "assets/character/move/BODY_male.png", "assets/character/move/sprites1.json");

}

function create ()
{
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("terrain", "tiles");
    const layer0 = map.createStaticLayer("terrain00", tileset, 0, 0);
    const spawnPoint = map.findObject("Objects", obj => obj.name === "spawn");
    solid = map.createStaticLayer("terrain_solid", tileset, 0, 0);

    this.sword = this.add.sprite(100, 100, 'sword');

    this.sword.setScale(0.5);
    this.sword.setSize(8, 8);
    this.physics.world.enable(this.sword);

    solid.setCollisionByProperty({ solid: true });

    player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "atlas_move", "face1")
    weapon = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "atlas_attack_sword", "sword_face1")
    this.physics.add.overlap(this.sword, this.spawns, false, this);
    // player.add(this.sword);

    this.physics.add.collider(player, solid);


    const anims = this.anims;
    // --- move ---
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
    // --- end move ---
    // --- attack ---
    anims.create({
      key: "attack_face",
      frames: anims.generateFrameNames("atlas_attack", {
        prefix: "attack_face",
        start: 0,
        end: 6,
      }),
      frameRate: 15,
      repeat: -1
    });
    anims.create({
      key: "attack_left",
      frames: anims.generateFrameNames("atlas_attack", {
        prefix: "attack_left",
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "attack_right",
      frames: anims.generateFrameNames("atlas_attack", {
        prefix: "attack_right",
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "attack_back",
      frames: anims.generateFrameNames("atlas_attack", {
        prefix: "attack_back",
        start: 0,
        end: 6,
      }),
      frameRate: 15,
      repeat: -1
    });
    // --- end attack ---
    // --- sword ---
    anims.create({
      key: "sword_face",
      frames: anims.generateFrameNames("atlas_attack_sword", {
        prefix: "sword_face",
        start: 0,
        end: 6,
      }),
      frameRate: 15,
      repeat: -1
    });
    anims.create({
      key: "sword_left",
      frames: anims.generateFrameNames("atlas_attack_sword", {
        prefix: "sword_left",
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "sword_right",
      frames: anims.generateFrameNames("atlas_attack_sword", {
        prefix: "sword_right",
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "sword_back",
      frames: anims.generateFrameNames("atlas_attack_sword", {
        prefix: "sword_back",
        start: 0,
        end: 6,
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
  if (cursors.space.isDown) {
    player_attack(player)
  } else {
    player_move(player);
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


function player_move(player) {
  let speed = 120;
  player.body.setVelocity(0);
  weapon.body.setVelocity(0);

  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
    // weapon.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
    // weapon.body.setVelocityX(speed);
  }
  if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
    // weapon.body.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
    // weapon.body.setVelocityY(speed); 
  }
  // Running
  if (cursors.shift.isDown) {
    speed += 100
  } else {
    speed = 120
  }
  player.body.velocity.normalize().scale(speed);

  if (cursors.left.isDown) {
    orientation = "left";
    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    orientation = "right";
    player.anims.play("right", true);
  } else if (cursors.up.isDown) {
    orientation = "back";
    player.anims.play("back", true);
  } else if (cursors.down.isDown) {
    orientation = "face";
    player.anims.play("face", true);
  } else {
    player.anims.stop();
  }
}

function player_attack(player) {
  player.body.setVelocity(0);
  weapon.body.setVelocity(0);

  if (cursors.space.isDown) {
    if (orientation == "left") {
      player.anims.play("attack_left", true);
      weapon.anims.play("sword_left", true);

    } else if (orientation == "right") {
      player.anims.play("attack_right", true);
      weapon.anims.play("sword_right", true);

    } else if (orientation == "back") {
      player.anims.play("attack_back", true);
      weapon.anims.play("sword_back", true);

    } else if (orientation == "face") {
      player.anims.play("attack_face", true);
      weapon.anims.play("sword_face");

    }
  }
  // else{
    // player.anims.stop();
  // }
}