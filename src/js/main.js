var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 960,
    height: 960,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};


var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('tiles', 'assets/map/tiles/tmw_desert_spacing.png');
    this.load.tilemapCSV("mapCsv", 'assets/map/csv/map2_terrain.csv')
    this.load.tilemapTiledJSON('map', 'assets/map/maps/map1.json');
}

function create ()
{
    // map = this.make.tilemap({ key: 'mapCsv' });

    // var tiles = map.addTilesetImage('Desert', 'tiles');

    // layer = map.createDynamicLayer('Ground', tiles, 0, 0).setVisible(false);

    // rt = this.add.renderTexture(0, 0, 800, 600);
    // console.log(rt)
    // When loading a CSV map, make sure to specify the tileWidth and tileHeight!
    const map = this.make.tilemap({ key: "mapCsv", tileWidth: 32, tileHeight: 32 });
    const tileset = map.addTilesetImage("tiles");
    const tileset = map.addTilesetImage("tiles2");
    const layer = map.createStaticLayer(0, tileset, 0, 0); // layer index, tileset, x, y
}

function update ()
{
    // rt.clear();

    // rt.draw(layer);
}