namespace Bomberman {
  import fc = FudgeCore;
  import fcAid = FudgeAid;

  let cmpAudio: fc.ComponentAudio;
  let soundHit: fc.Audio = new fc.Audio("../Assets/sounds/hit.wav");

  export let flameDistance: number = 2;

  export class Flames extends GameObject {
    private static animations: fcAid.SpriteSheetAnimations;
    public sprite: fcAid.NodeSprite;

    public constructor(_position: fc.Vector2) {
      super("Flames", new fc.Vector2(0.8, 0.8), _position);

      this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
      this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;

      this.sprite = new fcAid.NodeSprite("FlamesSprite");
      this.sprite.addComponent(new fc.ComponentTransform());
      this.sprite.mtxLocal.translateZ(0.0001);
      this.appendChild(this.sprite);

      this.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Flames.animations["FLAMES"]);
      this.sprite.showFrame(0);
      this.sprite.setFrameDirection(1);
      this.sprite.framerate = 6;

      //console.log(_position.toVector3());
      //this.placeFlames(_position.toVector3());

      //fc.Time.game.setTimer(1000, 1, this.placeFlames(this.mtxLocal.translate).bind(this));
    }

    public static generateSprites(_spritesheet: fc.CoatTextured): void {
      Flames.animations = {};

      let name: string = "FLAMES";
      let sprite: fcAid.SpriteSheetAnimation = new fcAid.SpriteSheetAnimation(name, _spritesheet);
      sprite.generateByGrid(fc.Rectangle.GET(0, 0, 48, 48), 5, 82, fc.ORIGIN2D.CENTER, fc.Vector2.X(48));
      Flames.animations[name] = sprite;
    }

    public placeFlames(_position: fc.Vector3): void {

      let positionX: fc.Vector2;
      let positionY: fc.Vector2;

      levelRoot.appendChild(new Flames(new fc.Vector2(_position.x, _position.y)));

      for (let i: number = 1; i <= flameDistance; i++) {
        positionX = new fc.Vector2(_position.x + i, _position.y);

        levelRoot.appendChild(new Flames(positionX));

        if (this.checkFlameCollision(positionX) == true) {
          break;
        }

      }
      for (let i: number = 1; i <= flameDistance; i++) {
        positionY = new fc.Vector2(_position.x, _position.y + i);

        levelRoot.appendChild(new Flames(positionY));

        if (this.checkFlameCollision(positionY) == true) {
          break;
        }
      }

      for (let i: number = -1; i >= -flameDistance; i--) {
        positionX = new fc.Vector2(_position.x + i, _position.y);

        levelRoot.appendChild(new Flames(positionX));

        if (this.checkFlameCollision(positionX) == true) {
          break;
        }
      }
      
      for (let i: number = -1; i >= -flameDistance; i--) {
        positionY = new fc.Vector2(_position.x, _position.y + i);

        levelRoot.appendChild(new Flames(positionY));

        if (this.checkFlameCollision(positionY) == true) {
          break;
        }
      }
      this.lowerLife();
    }

    public circleBombFlames(_position: fc.Vector3): void {
      for (let i: number = -flameDistance; i <= flameDistance; i++) {
        for (let j: number = -flameDistance; j <= flameDistance; j++) {

          let positionCircle: fc.Vector2 = new fc.Vector2(_position.x + i, _position.y + j);

          levelRoot.appendChild(new Flames(positionCircle));
          this.checkFlameCollision(positionCircle);
        }
      }
      this.lowerLife();
      circleBomb = false;
    }

    public diagonalBombFlames(_position: fc.Vector3): void {
      for (let i: number = -flameDistance; i <= flameDistance; i++) {
        let positionDiagonal: fc.Vector2 = new fc.Vector2(_position.x + i, _position.y + i);
        let positionDiagonal2: fc.Vector2 = new fc.Vector2(_position.x + i, _position.y - i);

        levelRoot.appendChild(new Flames(positionDiagonal));
        levelRoot.appendChild(new Flames(positionDiagonal2));

        this.checkFlameCollision(positionDiagonal);
        this.checkFlameCollision(positionDiagonal2);
      }
      this.lowerLife();
      diagonalBomb = false;
    }

    public lowerLife(): void {
      cmpAudio = new fc.ComponentAudio(soundHit, false, false);
      cmpAudio.connect(true);
      cmpAudio.volume = 0.08;
      cmpAudio.setAudio(soundHit);

      for (let flames of levelRoot.getChildrenByName("Flames")) {
        fc.Time.game.setTimer(3000, 1, this.removeFlames.bind(flames));
        if (avatar.checkCollision(<GameObject>flames)) {
          cmpAudio.play(true);
          console.log("MINUS LEBEN" + avatar.mtxLocal.translation);
          gameState.bottomLeft--;
        }
      }
/*       for (let flames of levelRoot.getChildrenByName("Flames")) {
        if (enemies.checkCollision(<GameObject>flames)) {
          console.log("MINUS LEBEN FÜR BÖSE MANN");
          gameState.topRight--;
        }
      } */
    }

    private checkFlameCollision(_position: fc.Vector2): boolean {

      for (let flames of levelRoot.getChildrenByName("Flames") as GameObject[]) {
        for (let wall of wallsNode.getChildren()) {
          if (flames.checkCollision(<GameObject>wall)) {
            levelRoot.removeChild(flames);
            return true;
          }
        }
      }

      for (let flames of levelRoot.getChildrenByName("Flames") as GameObject[]) {
        for (let explodableBlock of explodableBlockNode.getChildren()) {
          if (flames.checkCollision(<GameObject>explodableBlock)) {
            explodableBlockNode.removeChild(explodableBlock);
            return true;
          }
        }
      }
      return false;
    }


    private removeFlames(): void {
      levelRoot.removeChild(this);
    }

  }
}