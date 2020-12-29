"use strict";
var Bomberman;
(function (Bomberman) {
    var fc = FudgeCore;
    window.addEventListener("load", hndLoad);
    Bomberman.clrWhite = fc.Color.CSS("WHITE");
    Bomberman.root = new fc.Node("Root");
    Bomberman.levelRoot = new fc.Node("LevelNode");
    Bomberman.arenaSize = new fc.Vector2(21, 9);
    async function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        Bomberman.root.appendChild(Bomberman.levelRoot);
        Bomberman.avatar = await hndAvatar();
        Bomberman.root.appendChild(Bomberman.avatar);
        createArena();
        let cmpCamera = new fc.ComponentCamera();
        cmpCamera.projectCentral(1, 45, fc.FIELD_OF_VIEW.DIAGONAL, 0.2, 10000);
        cmpCamera.pivot.translation = new fc.Vector3(Bomberman.arenaSize.x / 2 - 0.5, Bomberman.arenaSize.y / 2 - 0.5, 20);
        cmpCamera.pivot.rotateY(180);
        cmpCamera.backgroundColor = fc.Color.CSS("darkblue");
        Bomberman.viewport = new fc.Viewport();
        Bomberman.viewport.initialize("Viewport", Bomberman.root, cmpCamera, canvas);
        fc.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, hndLoop);
        fc.Loop.start(fc.LOOP_MODE.TIME_GAME, 60);
        canvas.addEventListener("click", canvas.requestPointerLock);
    }
    function hndLoop(_event) {
        Bomberman.avatar.update();
        Bomberman.viewport.draw();
    }
    function createArena() {
        let levelTest = new Bomberman.LevelBuilder();
        levelTest.createLevel();
    }
    async function hndAvatar() {
        Bomberman.avatar = new Bomberman.Avatar(new fc.Vector2(0.8, 0.8), new fc.Vector2(2, 2));
        /*     let txtAvatar: fc.TextureImage = new fc.TextureImage();
            txtAvatar.load("../Assets/avatar/avatarSprites.png");
            let coatSprite: fc.CoatTextured = new fc.CoatTextured(clrWhite, txtAvatar);
            Avatar.generateSprites(coatSprite); */
        return Bomberman.avatar;
    }
})(Bomberman || (Bomberman = {}));
//# sourceMappingURL=main.js.map