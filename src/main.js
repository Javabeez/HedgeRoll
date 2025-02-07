const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/lilhog.png");
ASSET_MANAGER.queueDownload("./sprites/grass.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	const debug = document.getElementById("debug");

	debug.addEventListener("click", function () {
		PARAMS.DEBUG = debug.checked;
		gameEngine.options = { debugging: debug.checked };
	});

	PARAMS.BLOCKWIDTH = PARAMS.BITWIDTH * PARAMS.SCALE;

	gameEngine.init(ctx);

	// set platform box
	gameEngine.addEntity(new Base(ASSET_MANAGER.getAsset("./sprites/grass.png"), gameEngine, 0, 512));
	// set lil hog
	gameEngine.addEntity(new Hog(ASSET_MANAGER.getAsset("./sprites/lilhog.png"), gameEngine, 300, 512 - 256));

	gameEngine.start();
});
