namespace Bomberman {
  import fc = FudgeCore;

  window.addEventListener("load", hndLoad);

  export const clrWhite: fc.Color = fc.Color.CSS("WHITE");
  export let viewport: fc.Viewport;

  let cmpAudio: fc.ComponentAudio;
  let backgroundTheme: fc.Audio = new fc.Audio("Assets/sounds/theme.mp3");

  export let root: fc.Node = new fc.Node("Root");
  export let levelRoot: fc.Node = new fc.Node("LevelNode");
  export let floorNode: fc.Node = new fc.Node("FloorNode");
  export let wallsNode: fc.Node = new fc.Node("WallsNode");
  export let explodableBlockNode: fc.Node = new fc.Node("ExplodableBlockNode");

  export let avatar: Avatar;
  export let enemies: Enemy;

  export let arenaSize: fc.Vector2 = new fc.Vector2(21, 9);

  async function hndLoad(_event: Event): Promise<void> {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");

    cmpAudio = new fc.ComponentAudio(backgroundTheme, true, false);
    cmpAudio.connect(true);
    cmpAudio.volume = 0.2;
    cmpAudio.setAudio(backgroundTheme);
    cmpAudio.play(true);

    levelRoot.appendChild(floorNode);
    levelRoot.appendChild(wallsNode);
    levelRoot.appendChild(explodableBlockNode);
    root.appendChild(levelRoot);

    avatar = await hndAvatar();
    root.appendChild(avatar);

    enemies = await hndEnemies();
    root.appendChild(enemies);

    await hndBomb();
    await hndFlames();
    await hndPortal();
    await hndItems();

    createArena();

    let cmpCamera: fc.ComponentCamera = new fc.ComponentCamera();
    cmpCamera.projectCentral(1, 45, fc.FIELD_OF_VIEW.DIAGONAL, 0.2, 10000);
    cmpCamera.pivot.translation = new fc.Vector3(arenaSize.x / 2 - 0.5, arenaSize.y / 2 - 0.5, 20);
    cmpCamera.pivot.rotateY(180);
    cmpCamera.backgroundColor = fc.Color.CSS("SkyBlue");

    viewport = new fc.Viewport();
    viewport.initialize("Viewport", root, cmpCamera, canvas);

    fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, hndLoop);
    fc.Loop.start(fc.LOOP_MODE.TIME_GAME, 60);

    Hud.start();

    canvas.addEventListener("click", canvas.requestPointerLock);

  }

  function hndLoop(_event: Event): void {
    enemies.update();
    viewport.draw();
  }

  function createArena(): void {
    let levelTest: LevelBuilder = new LevelBuilder();
    levelTest.createLevel();
  }
  
  async function hndAvatar(): Promise<Avatar> {
    let txtAvatar: fc.TextureImage = new fc.TextureImage();
    txtAvatar.load("Assets/avatar/avatar_sprites.png");
    let coatSprite: fc.CoatTextured = new fc.CoatTextured(clrWhite, txtAvatar);
    Avatar.generateSprites(coatSprite);

    avatar = new Avatar(new fc.Vector2(1, 1));

    return avatar;
  }

  async function hndEnemies(): Promise<Enemy> {
    let txtEnemy: fc.TextureImage = new fc.TextureImage();
    txtEnemy.load("Assets/enemies/enemy_sprites.png");
    let coatSprite: fc.CoatTextured = new fc.CoatTextured(clrWhite, txtEnemy);
    Enemy.generateSprites(coatSprite);

    enemies = new Enemy(new fc.Vector2(arenaSize.x - 2, arenaSize.y - 2));
    //enemies = new Enemy(new fc.Vector2(3, 5));

    return enemies;
  }

  async function hndBomb(): Promise<void> {
    let txtBomb: fc.TextureImage = new fc.TextureImage();
    txtBomb.load("Assets/items/bomb_sprites.png");
    let coatSprite: fc.CoatTextured = new fc.CoatTextured(clrWhite, txtBomb);
    let txtBombExplode: fc.TextureImage = new fc.TextureImage();
    txtBombExplode.load("Assets/items/bomb_explode.png");
    let coatSprite2: fc.CoatTextured = new fc.CoatTextured(clrWhite, txtBombExplode);
    Bomb.generateSprites(coatSprite, coatSprite2);
  }

  async function hndFlames(): Promise<void> {
    let txtFlames: fc.TextureImage = new fc.TextureImage();
    txtFlames.load("Assets/items/flames_sprites.png");
    let coatSprite: fc.CoatTextured = new fc.CoatTextured(clrWhite, txtFlames);
    Flames.generateSprites(coatSprite);
  }

  async function hndPortal(): Promise<void> {
    let txtTeleport: fc.TextureImage = new fc.TextureImage();
    txtTeleport.load("Assets/tiles/portal_sprites.png");
    let coatSprite: fc.CoatTextured = new fc.CoatTextured(clrWhite, txtTeleport);
    Portal.generateSprites(coatSprite);
  }

  async function hndItems(): Promise<void> {
    let txtItems: fc.TextureImage = new fc.TextureImage();
    txtItems.load("Assets/items/items_sprites.png");
    let coatSprite: fc.CoatTextured = new fc.CoatTextured(clrWhite, txtItems);
    Items.generateSprites(coatSprite);
  }

}