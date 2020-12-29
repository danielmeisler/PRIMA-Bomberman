namespace Bomberman {
  import fc = FudgeCore;

  window.addEventListener("load", hndLoad);

  export const clrWhite: fc.Color = fc.Color.CSS("WHITE");
  export let viewport: fc.Viewport;
  export let root: fc.Node = new fc.Node("Root");
  export let levelRoot: fc.Node = new fc.Node("LevelNode");
  export let avatar: Avatar;
  export let arenaSize: fc.Vector2 = new fc.Vector2(21, 9);

  async function hndLoad(_event: Event): Promise<void> {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");

    root.appendChild(levelRoot);

    avatar = await hndAvatar();
    root.appendChild(avatar);

    createArena();

    let cmpCamera: fc.ComponentCamera = new fc.ComponentCamera();
    cmpCamera.projectCentral(1, 45, fc.FIELD_OF_VIEW.DIAGONAL, 0.2, 10000);
    cmpCamera.pivot.translation = new fc.Vector3(arenaSize.x / 2 - 0.5, arenaSize.y / 2 - 0.5, 20);
    cmpCamera.pivot.rotateY(180);
    cmpCamera.backgroundColor = fc.Color.CSS("darkblue");

    viewport = new fc.Viewport();
    viewport.initialize("Viewport", root, cmpCamera, canvas);

    fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, hndLoop);
    fc.Loop.start(fc.LOOP_MODE.TIME_GAME, 60);

    canvas.addEventListener("click", canvas.requestPointerLock);

  }

  function hndLoop(_event: Event): void {
    avatar.update();
    viewport.draw();
  }

  function createArena(): void {
    let levelTest: LevelBuilder = new LevelBuilder();
    levelTest.createLevel();
  }
  
  async function hndAvatar(): Promise<Avatar> {
    avatar = new Avatar(new fc.Vector2(0.8, 0.8), new fc.Vector2(2, 2));
  
/*     let txtAvatar: fc.TextureImage = new fc.TextureImage();
    txtAvatar.load("../Assets/avatar/avatarSprites.png");
    let coatSprite: fc.CoatTextured = new fc.CoatTextured(clrWhite, txtAvatar);
    Avatar.generateSprites(coatSprite); */

    return avatar;
  }

}