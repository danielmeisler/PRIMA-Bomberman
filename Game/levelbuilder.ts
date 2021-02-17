namespace Bomberman {
  import fc = FudgeCore;

  export class LevelBuilder {

    public rootNumber: number = 0;

    public createLevel(_level: number): LevelBuilder {

      this.createFloor();
      this.createBorder();

      if (_level == 1)
        this.createBlocks();

      if (_level == 2)
        this.createBlocks2();

      if (_level == 3)
        this.createBlocks3();

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

      levelRoot.appendChild(new Items("BOMB_PLUS", new fc.Vector2(5, 7)));
      levelRoot.appendChild(new Items("FLAME_PLUS", new fc.Vector2(15, 1)));
      levelRoot.appendChild(new Items("BOMB_CIRCLE", new fc.Vector2(12, 4)));
      levelRoot.appendChild(new Items("BOMB_DIAGONAL", new fc.Vector2(8, 4)));
      levelRoot.appendChild(new Items("LIFE_INVINCIBILITY", new fc.Vector2(15, 7)));
      levelRoot.appendChild(new Items("LIFE_PLUS", new fc.Vector2(5, 1)));

      levelRoot.appendChild(new Portal(new fc.Vector2(1, 4), 0));
      levelRoot.appendChild(new Portal(new fc.Vector2(10, 7), 1));
      levelRoot.appendChild(new Portal(new fc.Vector2(19, 4), 2));
      levelRoot.appendChild(new Portal(new fc.Vector2(10, 1), 3));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(1, 3)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(1, 5)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 1)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 3)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 5)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 7)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(4, 2)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(4, 6)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(6, 1)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(6, 4)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(6, 7)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(9, 1)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(9, 7)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(10, 4)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(11, 1)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(11, 7)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(14, 1)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(14, 4)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(14, 7)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(16, 2)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(16, 6)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 1)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 3)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 5)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 7)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(19, 3)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(19, 5)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(3, 1)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(3, 4)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(3, 7)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(4, 1)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(4, 3)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(4, 4)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(4, 5)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(4, 7)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(5, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(5, 3)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(5, 5)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(5, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(6, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(6, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(7, 4)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(8, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(8, 3)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(8, 5)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(8, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(9, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(9, 4)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(9, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(10, 3)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(10, 5)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(11, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(11, 4)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(11, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(12, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(12, 3)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(12, 5)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(12, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(13, 4)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(14, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(14, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(15, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(15, 3)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(15, 5)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(15, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 1)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 3)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 4)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 5)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 7)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(17, 1)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(17, 4)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(17, 7)));

    }

    private createBlocks2(): void {

      levelRoot.appendChild(new Items("BOMB_PLUS", new fc.Vector2(1, 4)));
      levelRoot.appendChild(new Items("FLAME_PLUS", new fc.Vector2(13, 1)));
      levelRoot.appendChild(new Items("BOMB_CIRCLE", new fc.Vector2(7, 7)));
      levelRoot.appendChild(new Items("BOMB_DIAGONAL", new fc.Vector2(7, 1)));
      levelRoot.appendChild(new Items("LIFE_INVINCIBILITY", new fc.Vector2(13, 7)));
      levelRoot.appendChild(new Items("LIFE_PLUS", new fc.Vector2(19, 4)));

      levelRoot.appendChild(new Portal(new fc.Vector2(6, 4), 0));
      levelRoot.appendChild(new Portal(new fc.Vector2(14, 4), 1));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 2)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 3)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 5)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 6)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(3, 2)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(3, 6)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(5, 1)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(5, 2)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(5, 4)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(5, 6)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(5, 7)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(7, 3)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(7, 4)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(7, 5)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(8, 1)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(8, 4)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(8, 7)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(10, 1)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(10, 3)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(10, 5)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(10, 7)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(12, 1)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(12, 4)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(12, 7)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(13, 3)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(13, 4)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(13, 5)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(15, 1)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(15, 2)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(15, 4)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(15, 6)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(15, 7)));


      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(17, 2)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(17, 6)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 2)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 3)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 5)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(1, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(1, 3)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(1, 5)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(1, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(3, 4)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(3, 3)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(3, 5)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(4, 4)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(5, 3)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(5, 5)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(6, 1)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(6, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(6, 6)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(6, 7)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(7, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(7, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(8, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(8, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(9, 4)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(10, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(10, 4)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(10, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(11, 4)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(12, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(12, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(13, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(13, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(14, 1)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(14, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(14, 6)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(14, 7)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(15, 3)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(15, 5)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 1)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 4)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 6)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 7)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(17, 1)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(17, 7)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(18, 1)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(18, 7)));

    }

    private createBlocks3(): void {

      levelRoot.appendChild(new Items("BOMB_PLUS", new fc.Vector2(7, 3)));
      levelRoot.appendChild(new Items("FLAME_PLUS", new fc.Vector2(13, 5)));
      levelRoot.appendChild(new Items("BOMB_CIRCLE", new fc.Vector2(10, 2)));
      levelRoot.appendChild(new Items("BOMB_DIAGONAL", new fc.Vector2(10, 6)));
      levelRoot.appendChild(new Items("LIFE_INVINCIBILITY", new fc.Vector2(7, 5)));
      levelRoot.appendChild(new Items("LIFE_PLUS", new fc.Vector2(13, 3)));

      levelRoot.appendChild(new Portal(new fc.Vector2(5, 4), 0));
      levelRoot.appendChild(new Portal(new fc.Vector2(15, 4), 1));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 2)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 4)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 6)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(3, 2)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(3, 4)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(3, 6)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(4, 4)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(6, 2)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(6, 4)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(6, 6)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(7, 4)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(8, 4)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(10, 1)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(10, 3)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(10, 5)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(10, 7)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(12, 4)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(13, 4)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(14, 2)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(14, 4)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(14, 6)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(16, 4)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(17, 2)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(17, 4)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(17, 6)));

      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 2)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 4)));
      wallsNode.appendChild(new Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(1, 4)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(4, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(4, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(6, 3)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(6, 5)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(7, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(7, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(8, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(8, 3)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(8, 5)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(8, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(9, 1)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(9, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(9, 3)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(9, 5)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(9, 6)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(9, 7)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(10, 4)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(11, 1)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(11, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(11, 3)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(11, 5)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(11, 6)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(11, 7)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(12, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(12, 3)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(12, 5)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(12, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(13, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(13, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(14, 3)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(14, 5)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 2)));
      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 6)));

      explodableBlockNode.appendChild(new ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(19, 4)));
    }

  }
}