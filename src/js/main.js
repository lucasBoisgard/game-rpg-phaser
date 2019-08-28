var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 900,
    height: 600,
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

    this.load.atlas("atlas", "assets/character/naked.png", "assets/character/naked.json");

    // this.load.tilemapCSV("terrain00", 'assets/map/csv/map2_terrain00.csv')
    // this.load.tilemapCSV("terrain00", 'assets/map/csv/map2_terrain_solid.csv')
}

function create ()
{

    const map = this.make.tilemap({ key: "map" });

    const tileset = map.addTilesetImage("terrain", "tiles");
    const layer0 = map.createStaticLayer("terrain00", tileset, 0, 0);
    solid = map.createStaticLayer("terrain_solid", tileset, 0, 0);


    solid.setCollisionByProperty({ solid: true });

    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

    // player = this.physics.add
    //     .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
    //     .setSize(30, 40)
    //     .setOffset(0, 24);

    //     this.physics.add.collider(player, worldLayer);







  const camera = this.cameras.main;
  camera.zoom = 2;
  // Set up the arrows to control the camera
  const cursors = this.input.keyboard.createCursorKeys();
  controls = new Phaser.Cameras.Controls.FixedKeyControl({
    camera: camera,
    left: cursors.left,
    right: cursors.right,
    up: cursors.up,
    down: cursors.down,
    speed: 0.5
  });

  // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);


    debugGraphics = this.add.graphics();
    map.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 128), 
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) 
      });

      this.input.keyboard.on('keydown_C', function (event)
      {
          showDebug = !showDebug;
          drawDebug();
      });
  

}

function update(time, delta) {
    // Apply the controls to the camera each update tick of the game
    controls.update(delta);
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