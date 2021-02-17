///<reference path= "GameObject.ts"/>
namespace Bomberman {
  import fc = FudgeCore;
  import fcAid = FudgeAid;

  // Kommentare bei Enemy.ts, da alles im Grunde gleich ist.
  // Es gibt drei Enemy.ts, die exakt gleich sind, weil ich am Anfang falsch programmiert habe und somit 
  // nicht so einfach mehrere generieren konnte, weil der Code auf einen einzelnen ausgelegt ist, weil ich
  // immer nur mit einem Enemy getestet habe. Aus Zeitgründen habe ich TypeScript und Variablen einfach kopiert.

  export class Enemy2 extends GameObject {
    private static animations: fcAid.SpriteSheetAnimations;
    public state: STATE = STATE.HUNT;
    public job: WALK = WALK.DOWN;
    public tempPos: fc.Vector3;
    public sprite: fcAid.NodeSprite;

    public constructor(_position: fc.Vector2) {
      super("Enemies2", new fc.Vector2(0.8, 0.8), _position);

      this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
      this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;

      this.sprite = new fcAid.NodeSprite("EnemySprite2");
      this.sprite.addComponent(new fc.ComponentTransform());
      this.sprite.mtxLocal.translateY(-0.25);
      this.sprite.mtxLocal.translateZ(0.001);
      this.appendChild(this.sprite);

      this.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Enemy2.animations["WALK_DOWN"]);
      this.sprite.showFrame(0);
      this.sprite.setFrameDirection(1);
      this.sprite.framerate = 6;

      this.changeState(this.state);
    }

    public static generateSprites(_spritesheet: fc.CoatTextured): void {
      Enemy2.animations = {};
      for (let i: number = 0; i < 4; i++) {
        let name: string = "WALK_" + WALK[i];
        let sprite: fcAid.SpriteSheetAnimation = new fcAid.SpriteSheetAnimation(name, _spritesheet);
        sprite.generateByGrid(fc.Rectangle.GET(0, i * 64, 64, 64), 6, 82, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(64));
        Enemy2.animations[name] = sprite;
      }
    }

    public update(): void {
      this.checkEnemyDanger();
      this.checkEnemyDeath();
    }

    private checkEnemyCollision(): void {
      for (let wall of wallsNode.getChildren()) {
        if (enemies2.checkCollision(<GameObject>wall)) {
          enemies2.mtxLocal.translation = this.tempPos;
        }
      }
      for (let wall of explodableBlockNode.getChildren()) {
        if (enemies2.checkCollision(<GameObject>wall)) {
          enemies2.mtxLocal.translation = this.tempPos;
        }
      }
      for (let bomb of levelRoot.getChildrenByName("Bomb")) {
        if (enemies2.checkCollision(<GameObject>bomb)) {
          enemies2.mtxLocal.translation = this.tempPos;
        }
      }
      for (let flames of levelRoot.getChildrenByName("Flames")) {
        if (enemies2.checkCollision(<GameObject>flames)) {
          enemies2.mtxLocal.translation = this.tempPos;
        }
      }
      for (let avatar of root.getChildrenByName("Bomberman")) {
        if (enemies2.checkCollision(<GameObject>avatar)) {
          enemies2.mtxLocal.translation = this.tempPos;
        }
      }
      for (let enemies of root.getChildrenByName("Enemies")) {
        if (enemies2.checkCollision(<GameObject>enemies)) {
          enemies2.mtxLocal.translation = this.tempPos;
        }
      }
      for (let enemies3 of root.getChildrenByName("Enemies3")) {
        if (enemies2.checkCollision(<GameObject>enemies3)) {
          enemies2.mtxLocal.translation = this.tempPos;
        }
      }
      for (let portal of levelRoot.getChildrenByName("Portal")) {
        if (enemies2.checkCollision(<GameObject>portal)) {
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
      return false;
    }

    private walkEnemies(_job: WALK): void {
      this.job = _job;

      this.tempPos = enemies2.mtxLocal.translation;

      switch (this.job) {
        case WALK.UP:
          enemies2.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Enemy2.animations["WALK_UP"]);
          enemies2.mtxLocal.translateY(1);
          break;
        case WALK.RIGHT:
          enemies2.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Enemy2.animations["WALK_RIGHT"]);
          enemies2.mtxLocal.translateX(1);
          break;
        case WALK.DOWN:
          enemies2.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Enemy2.animations["WALK_DOWN"]);
          enemies2.mtxLocal.translateY(-1);
          break;
        case WALK.LEFT:
          enemies2.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Enemy2.animations["WALK_LEFT"]);
          enemies2.mtxLocal.translateX(-1);
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
        case STATE.FLEE:
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
      if (gameState.topRight > 0) {
        if (countBombsEnemy2 < maxBombEnemy2) {
          levelRoot.appendChild(new Bomb(fc.Vector2.ONE(1), new fc.Vector2(this.mtxLocal.translation.x, this.mtxLocal.translation.y), 2));
          countBombsEnemy2++;
          this.state = STATE.FLEE;
          this.changeState(STATE.FLEE);
          fc.Time.game.setTimer(6000, 1, this.setHunt);
        }
      }
    }

    private fleeBomb(_direction: string): void {

      if (_direction == "up") {
        if (this.checkWalls(new fc.Vector2(enemies2.mtxLocal.translation.x + 1, enemies2.mtxLocal.translation.y)) == false) {
          this.walkEnemies(WALK.RIGHT);
        } else if (this.checkWalls(new fc.Vector2(enemies2.mtxLocal.translation.x - 1, enemies2.mtxLocal.translation.y)) == false) {
          this.walkEnemies(WALK.LEFT);
        } else {
          this.walkEnemies(WALK.UP);
        }
      }

      if (_direction == "right") {
        if (this.checkWalls(new fc.Vector2(enemies2.mtxLocal.translation.x, enemies2.mtxLocal.translation.y + 1)) == false) {
          this.walkEnemies(WALK.UP);
        } else if (this.checkWalls(new fc.Vector2(enemies2.mtxLocal.translation.x, enemies2.mtxLocal.translation.y - 1)) == false) {
          this.walkEnemies(WALK.DOWN);
        } else {
          this.walkEnemies(WALK.RIGHT);
        }
      }

      if (_direction == "down") {
        if (this.checkWalls(new fc.Vector2(enemies2.mtxLocal.translation.x + 1, enemies2.mtxLocal.translation.y)) == false) {
          this.walkEnemies(WALK.RIGHT);
        } else if (this.checkWalls(new fc.Vector2(enemies2.mtxLocal.translation.x - 1, enemies2.mtxLocal.translation.y)) == false) {
          this.walkEnemies(WALK.LEFT);
        } else {
          this.walkEnemies(WALK.DOWN);
        }
      }

      if (_direction == "left") {
        if (this.checkWalls(new fc.Vector2(enemies2.mtxLocal.translation.x, enemies2.mtxLocal.translation.y + 1)) == false) {
          this.walkEnemies(WALK.UP);
        } else if (this.checkWalls(new fc.Vector2(enemies2.mtxLocal.translation.x, enemies2.mtxLocal.translation.y - 1)) == false) {
          this.walkEnemies(WALK.DOWN);
        } else {
          this.walkEnemies(WALK.LEFT);
        }
      }
    }

    private setHunt = (): void => {
      this.changeState(STATE.HUNT);
    }

    private checkEnemyDeath(): void {
      if (gameState.topRight == 0) {
        root.removeChild(enemies2);
        enemies2.removeAllChildren();
      }
    }
  }
}
