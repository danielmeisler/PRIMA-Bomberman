namespace Bomberman {
  import fc = FudgeCore;

  export class LevelBuilder {
    
     public createFloor(_size: fc.Vector2, _position: fc.Vector2): Floor {
      let txtFloor: fc.TextureImage = new fc.TextureImage("../Assets/tiles/BackgroundTile.png");
      let mtrFloor: fc.Material = new fc.Material("Floor", fc.ShaderTexture, new fc.CoatTextured(clrWhite, txtFloor));
      return new Floor(_size, _position, mtrFloor);
    }

/*     public createWall(_size: fc.Vector2, _position: fc.Vector2): Wall {
      let txtWall: fc.TextureImage = new fc.TextureImage("../Assets/tiles/SolidBlock.png");
      let mtrWall: fc.Material = new fc.Material("BorderWall", fc.ShaderTexture, new fc.CoatTextured(clrWhite, txtWall));
      return new Wall(_size, _position, mtrWall);
    }  */

    public createBorder(): void {
      let mtrColor: fc.Material = new fc.Material("Color", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("GREEN")));
      let rootNumber: number = 0;

      for (let i: number = 0; i < arenaSize.x; i++) {
        levelRoot.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(rootNumber + i, rootNumber), mtrColor));
      }
      for (let i: number = 0; i < arenaSize.y; i++) {
        levelRoot.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(rootNumber , rootNumber + i), mtrColor));
      }
      for (let i: number = 0; i < arenaSize.x; i++) {
        levelRoot.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(rootNumber + i, arenaSize.y - 1), mtrColor));
      }
      for (let i: number = 0; i < arenaSize.y; i++) {
        levelRoot.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(arenaSize.x - 1, rootNumber + i), mtrColor));
      }
    }

    public createLevel(): LevelBuilder {
      levelRoot.appendChild(this.createFloor(arenaSize, fc.Vector2.ZERO()));
      this.createBorder();

      return new LevelBuilder();
    }

  }
}