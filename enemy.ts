namespace Bomberman {
  import fc = FudgeCore;
  import fcAid = FudgeAid;

  export enum STATE {
    HUNT, CHECK, FLEE
  }
  

  export class Enemy extends GameObject {
    private static animations: fcAid.SpriteSheetAnimations;
    public state: STATE = STATE.HUNT;
    public job: WALK = WALK.DOWN;
    public tempPos: fc.Vector3;
    public sprite: fcAid.NodeSprite;

    public constructor(_position: fc.Vector2) {
      super("Enemies", new fc.Vector2(0.8, 0.8), _position);

      this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
      this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;

      this.sprite = new fcAid.NodeSprite("EnemySprite");
      this.sprite.addComponent(new fc.ComponentTransform());
      this.sprite.mtxLocal.translateY(-0.25);
      this.sprite.mtxLocal.translateZ(0.001);
      this.appendChild(this.sprite);

      this.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Enemy.animations["WALK_DOWN"]);
      this.sprite.showFrame(0);
      this.sprite.setFrameDirection(1);
      this.sprite.framerate = 6;

      this.changeState(this.state);
      //fc.Time.game.setTimer(1000, 1, this.findPlayer);
    }

    public static generateSprites(_spritesheet: fc.CoatTextured): void {
      Enemy.animations = {};
      for (let i: number = 0; i < 4; i++) {
        let name: string = "WALK_" + WALK[i];
        let sprite: fcAid.SpriteSheetAnimation = new fcAid.SpriteSheetAnimation(name, _spritesheet);
        sprite.generateByGrid(fc.Rectangle.GET(0, i * 64, 64, 64), 6, 82, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(64));
        Enemy.animations[name] = sprite;
      }
    }

    public update(): void {
      this.checkEnemyDanger();

    }

    private checkEnemyCollision(): void {
      for (let wall of wallsNode.getChildren()) {
        if (enemies.checkCollision(<GameObject>wall)) {
          enemies.mtxLocal.translation = this.tempPos;
        }
      }
      for (let wall of explodableBlockNode.getChildren()) {
        if (enemies.checkCollision(<GameObject>wall)) {
          enemies.mtxLocal.translation = this.tempPos;
        }
      }
      for (let bomb of levelRoot.getChildrenByName("Bomb")) {
        if (enemies.checkCollision(<GameObject>bomb)) {
          enemies.mtxLocal.translation = this.tempPos;
        }
      }
      for (let flames of levelRoot.getChildrenByName("Flames")) {
        if (enemies.checkCollision(<GameObject>flames)) {
          enemies.mtxLocal.translation = this.tempPos;
        }
      }
      for (let avatar of root.getChildrenByName("Bomberman")) {
        if (enemies.checkCollision(<GameObject>avatar)) {
          enemies.mtxLocal.translation = this.tempPos;
        }
      }
      for (let portal of levelRoot.getChildrenByName("Portal")) {
        if (enemies.checkCollision(<GameObject>portal)) {
          let portals: Portal = new Portal(new fc.Vector2(0, 0), -1);
          portals.teleportPortal(<Portal>portal);
        }
      }
    }

    private checkEnemyDanger(): void {
      let _position: fc.Vector3 = this.mtxLocal.translation;
      let positionX: fc.Vector2;
      let positionY: fc.Vector2;

      for (let bomb of levelRoot.getChildrenByName("Bomb")) {
        if (this.mtxLocal.translation.toVector2().equals(bomb.mtxLocal.translation.toVector2())) {
          
          if (this.checkWalls(new fc.Vector2(this.mtxLocal.translation.x + 1, this.mtxLocal.translation.y)) == false) {
            this.walkEnemies(WALK.RIGHT);
          } else if (this.checkWalls(new fc.Vector2(this.mtxLocal.translation.x, this.mtxLocal.translation.y - 1)) == false) {
            this.walkEnemies(WALK.DOWN);
          } else if (this.checkWalls(new fc.Vector2(this.mtxLocal.translation.x - 1, this.mtxLocal.translation.y)) == false) {
            this.walkEnemies(WALK.LEFT);
          } else if (this.checkWalls(new fc.Vector2(this.mtxLocal.translation.x, this.mtxLocal.translation.y + 1)) == false) {
            this.walkEnemies(WALK.UP);
          }

        }
      }

      for (let i: number = 1; i <= flameDistance; i++) {
        positionX = new fc.Vector2(_position.x + i, _position.y);

        if (this.checkWalls(positionX) == true) {
          break;
        }

        if (this.checkBombs(positionX) == true) {
          this.fleeBomb("left");
        }

        if (this.detectPlayer(positionX) == true) {
          this.bombPlayer();
        }

      }
      for (let i: number = 1; i <= flameDistance; i++) {
        positionY = new fc.Vector2(_position.x, _position.y + i);

        if (this.checkWalls(positionY) == true) {
          break;
        }

        if (this.checkBombs(positionY) == true) {
          this.fleeBomb("down");
        }

        if (this.detectPlayer(positionY) == true) {
          this.bombPlayer();
        }
      }

      for (let i: number = -1; i >= -flameDistance; i--) {
        positionX = new fc.Vector2(_position.x + i, _position.y);

        if (this.checkWalls(positionX) == true) {
          break;
        }

        if (this.checkBombs(positionX) == true) {
          this.fleeBomb("right");
        }

        if (this.detectPlayer(positionX) == true) {
          this.bombPlayer();
        }
      }
      for (let i: number = -1; i >= -flameDistance; i--) {
        positionY = new fc.Vector2(_position.x, _position.y + i);

        if (this.checkWalls(positionY) == true) {
          break;
        }

        if (this.checkBombs(positionY) == true) {
          this.fleeBomb("up");
        }

        if (this.detectPlayer(positionY) == true) {
          this.bombPlayer();
        }
      }

    }

    private checkWalls(_position: fc.Vector2): boolean {
      for (let wall of wallsNode.getChildren()) {
        if (_position.equals(wall.mtxLocal.translation.toVector2())) {
          return true;
        }
      }
      for (let explodableBlock of explodableBlockNode.getChildren()) {
        if (_position.equals(explodableBlock.mtxLocal.translation.toVector2())) {
          return true;
        }
      }
      return false;
    }

    private checkBombs(_position: fc.Vector2): boolean {
      for (let bomb of levelRoot.getChildrenByName("Bomb")) {
        if (_position.equals(bomb.mtxLocal.translation.toVector2())) {
          return true;
        }
      }
/*       for (let bomb of levelRoot.getChildrenByName("Flames")) {
        if (_position.equals(bomb.mtxLocal.translation.toVector2())) {
          return true;
        }
      } */
      return false;
    }

    private walkEnemies(_job: WALK): void {
      this.job = _job;

      this.tempPos = enemies.mtxLocal.translation;

      switch (this.job) {
        case WALK.UP:
          enemies.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Enemy.animations["WALK_UP"]);
          enemies.mtxLocal.translateY(1);
          break;
        case WALK.RIGHT:
          enemies.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Enemy.animations["WALK_RIGHT"]);
          enemies.mtxLocal.translateX(1);
          break;
        case WALK.DOWN:
          enemies.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Enemy.animations["WALK_DOWN"]);
          enemies.mtxLocal.translateY(-1);
          break;
        case WALK.LEFT:
          enemies.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Enemy.animations["WALK_LEFT"]);
          enemies.mtxLocal.translateX(-1);
          break;
      }

      this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
      this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;

      this.checkEnemyCollision();

      this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
      this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
    }

    private changeState(_state: STATE): void {
      this.state = _state;

      switch (this.state) {
        case STATE.HUNT:
          fc.Time.game.setTimer(1000, 1, this.findPlayer);
          break;
        case STATE.CHECK:

          break;
        case STATE.FLEE:
          //this.fleeBomb();
          break;
      }
    }

    private findPlayer = (): void => {

      let travelVector: fc.Vector3;
      travelVector = avatar.mtxLocal.translation;
      travelVector.subtract(this.mtxLocal.translation);

      if (travelVector.x < 0) {
        this.walkEnemies(WALK.LEFT);
      }
      if (travelVector.x > 0) {
        this.walkEnemies(WALK.RIGHT);
      }
      if (travelVector.y < 0) {
        this.walkEnemies(WALK.DOWN);
      }
      if (travelVector.y > 0) {
        this.walkEnemies(WALK.UP);
      }

      if (this.state == STATE.HUNT) {
        fc.Time.game.setTimer(1000, 1, this.findPlayer);
      }

    }

    private detectPlayer(_position: fc.Vector2): boolean {
      if (_position.equals(avatar.mtxLocal.translation.toVector2())) {
        return true;
      }
      return false;
    }

    private bombPlayer(): void {
     if (countBombsEnemy < maxBombEnemy) {
        levelRoot.appendChild(new Bomb(fc.Vector2.ONE(1), new fc.Vector2(this.mtxLocal.translation.x, this.mtxLocal.translation.y), 1));
        countBombsEnemy++;
        this.state = STATE.FLEE;
        this.changeState(STATE.FLEE);
        fc.Time.game.setTimer(6000, 1, this.setHunt);
      }
    }

    private fleeBomb(_direction: string): void {
     
      if (_direction == "up") {
        if (this.checkWalls(new fc.Vector2(enemies.mtxLocal.translation.x + 1, enemies.mtxLocal.translation.y)) == false) {
          this.walkEnemies(WALK.RIGHT);
        } else if (this.checkWalls(new fc.Vector2(enemies.mtxLocal.translation.x - 1, enemies.mtxLocal.translation.y)) == false) {
          this.walkEnemies(WALK.LEFT);
        } else {
          this.walkEnemies(WALK.UP);
        }
      }

      if (_direction == "right") {
        if (this.checkWalls(new fc.Vector2(enemies.mtxLocal.translation.x, enemies.mtxLocal.translation.y + 1)) == false) {
          this.walkEnemies(WALK.UP);
        } else if (this.checkWalls(new fc.Vector2(enemies.mtxLocal.translation.x, enemies.mtxLocal.translation.y - 1)) == false) {
          this.walkEnemies(WALK.DOWN);
        } else {
          this.walkEnemies(WALK.RIGHT);
        }
      }

      if (_direction == "down") {
        if (this.checkWalls(new fc.Vector2(enemies.mtxLocal.translation.x + 1, enemies.mtxLocal.translation.y)) == false) {
          this.walkEnemies(WALK.RIGHT);
        } else if (this.checkWalls(new fc.Vector2(enemies.mtxLocal.translation.x - 1, enemies.mtxLocal.translation.y)) == false) {
          this.walkEnemies(WALK.LEFT);
        } else {
          this.walkEnemies(WALK.DOWN);
        }
      }

      if (_direction == "left") {
        if (this.checkWalls(new fc.Vector2(enemies.mtxLocal.translation.x, enemies.mtxLocal.translation.y + 1)) == false) {
          this.walkEnemies(WALK.UP);
        } else if (this.checkWalls(new fc.Vector2(enemies.mtxLocal.translation.x, enemies.mtxLocal.translation.y - 1)) == false) {
          this.walkEnemies(WALK.DOWN);
        } else {
          this.walkEnemies(WALK.LEFT);
        }
      }
    }

    private setHunt = (): void => {
      this.changeState(STATE.HUNT);
    }
  }
}
