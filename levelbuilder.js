"use strict";
var Bomberman;
(function (Bomberman) {
    var fc = FudgeCore;
    class LevelBuilder {
        createFloor(_size, _position) {
            let txtFloor = new fc.TextureImage("../Assets/tiles/BackgroundTile.png");
            let mtrFloor = new fc.Material("Floor", fc.ShaderTexture, new fc.CoatTextured(Bomberman.clrWhite, txtFloor));
            return new Bomberman.Floor(_size, _position, mtrFloor);
        }
        /*     public createWall(_size: fc.Vector2, _position: fc.Vector2): Wall {
              let txtWall: fc.TextureImage = new fc.TextureImage("../Assets/tiles/SolidBlock.png");
              let mtrWall: fc.Material = new fc.Material("BorderWall", fc.ShaderTexture, new fc.CoatTextured(clrWhite, txtWall));
              return new Wall(_size, _position, mtrWall);
            }  */
        createBorder() {
            let mtrColor = new fc.Material("Color", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("GREEN")));
            let rootNumber = 0;
            for (let i = 0; i < Bomberman.arenaSize.x; i++) {
                Bomberman.levelRoot.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(rootNumber + i, rootNumber), mtrColor));
            }
            for (let i = 0; i < Bomberman.arenaSize.y; i++) {
                Bomberman.levelRoot.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(rootNumber, rootNumber + i), mtrColor));
            }
            for (let i = 0; i < Bomberman.arenaSize.x; i++) {
                Bomberman.levelRoot.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(rootNumber + i, Bomberman.arenaSize.y - 1), mtrColor));
            }
            for (let i = 0; i < Bomberman.arenaSize.y; i++) {
                Bomberman.levelRoot.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(Bomberman.arenaSize.x - 1, rootNumber + i), mtrColor));
            }
        }
        createLevel() {
            Bomberman.levelRoot.appendChild(this.createFloor(Bomberman.arenaSize, fc.Vector2.ZERO()));
            this.createBorder();
            return new LevelBuilder();
        }
    }
    Bomberman.LevelBuilder = LevelBuilder;
})(Bomberman || (Bomberman = {}));
//# sourceMappingURL=levelbuilder.js.map