namespace Bomberman {
  import fc = FudgeCore;

  export class LevelBuilder {

    public rootNumber: number = 0;

    public createLevel(): LevelBuilder {

      this.createFloor();
      this.createBorder();
      this.createBlocks();

      return new LevelBuilder();
    }


    private createFloor(): void {

      floorNode.appendChild(new Floor(arenaSize, fc.Vector2.ZERO()));

    }


    private createBorder(): void {

      for (let i: number = 0; i < arenaSize.x; i++) {
        wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(this.rootNumber + i, this.rootNumber)));
      }
      for (let i: number = 0; i < arenaSize.y; i++) {
        wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(this.rootNumber, this.rootNumber + i)));
      }
      for (let i: number = 0; i < arenaSize.x; i++) {
        wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(this.rootNumber + i, arenaSize.y - 1)));
      }
      for (let i: number = 0; i < arenaSize.y; i++) {
        wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(arenaSize.x - 1, this.rootNumber + i)));
      }

    }


    private createBlocks(): void {

      for (let i: number = 0; i < arenaSize.x - 1; i = i + 2) {
        for (let j: number = 0; j < arenaSize.y - 1; j = j + 2) {
          wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(2 + i, 2 + j)));
        }

      }

      for (let i: number = 0; i < arenaSize.y - 1; i = i + 2) {
        for (let j: number = 0; j < arenaSize.x - 1; j = j + 2) {
          explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(2 + j, 1 + i)));
        }
      }

      levelRoot.appendChild(new Portal(new fc.Vector2(1, 7), 0));
      levelRoot.appendChild(new Portal(new fc.Vector2(7, 1), 1));
      levelRoot.appendChild(new Portal(new fc.Vector2(9, 1), 2));

      levelRoot.appendChild(new Items("BOMB_PLUS", new fc.Vector2(3, 7)));     
      levelRoot.appendChild(new Items("FLAME_PLUS", new fc.Vector2(5, 7)));
      levelRoot.appendChild(new Items("BOMB_CIRCLE", new fc.Vector2(7, 7)));
      levelRoot.appendChild(new Items("BOMB_DIAGONAL", new fc.Vector2(9, 7)));    
      levelRoot.appendChild(new Items("LIFE_INVINCIBILITY", new fc.Vector2(11, 7)));
      levelRoot.appendChild(new Items("LIFE_PLUS", new fc.Vector2(13, 7))); 
      
    }


  }
}