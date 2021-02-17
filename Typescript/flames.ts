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

    }

    public static generateSprites(_spritesheet: fc.CoatTextured): void {
      Flames.animations = {};

      let name: string = "FLAMES";
      let sprite: fcAid.SpriteSheetAnimation = new fcAid.SpriteSheetAnimation(name, _spritesheet);
      sprite.generateByGrid(fc.Rectangle.GET(0, 0, 48, 48), 5, 82, fc.ORIGIN2D.CENTER, fc.Vector2.X(48));
      Flames.animations[name] = sprite;
    }

    // Flammen werden nach der Bombenexplosion platziert und in alle vier Achsen abhängig von der Flammengröße platziert.
    // Dabei wird überprüft ob sich eine Wand auf dem Weg befindet und abgebrochen. Falls es ein Block ist, wird dieser zerstört.
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

    // Andere Explosionsart. Statt in vier Achsen geht die Explosion im Kreis bzw. Block.
    // Da es ein Item ist und einmalig wird der boolean auch wieder auf false gesetzt.
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

    // Andere Explosionsart. Statt in vier Achsen geht die Explosion in die Diagonalen.
    // Da es ein Item ist und einmalig wird der boolean auch wieder auf false gesetzt.
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

    // Überprüfung ob Flammen mit einem Spieler/Enemy kollidieren und zieht Leben ab.
    public lowerLife(): void {
      cmpAudio = new fc.ComponentAudio(soundHit, false, false);
      cmpAudio.connect(true);
      cmpAudio.volume = 0.08;
      cmpAudio.setAudio(soundHit);

      for (let flames of levelRoot.getChildrenByName("Flames")) {
        fc.Time.game.setTimer(3000, 1, this.removeFlames.bind(flames));
        if (avatar.checkCollision(<GameObject>flames)) {
          if (lifeLimiter == false) {
            if (lifeInvincibility == false) {
              gameState.bottomLeft--;
              hndDeaths();
              lifeLimiter = true;
              fc.Time.game.setTimer(3000, 1, this.setLifeLimiter);
            }
          }
        }
      }
      for (let flames of levelRoot.getChildrenByName("Flames")) {
        if (enemies.checkCollision(<GameObject>flames)) {
          if (gameState.topLeft > 0)
            gameState.topLeft--;
          hndDeaths();
        }
      }
      for (let flames of levelRoot.getChildrenByName("Flames")) {
        if (enemies2.checkCollision(<GameObject>flames)) {
          if (gameState.topRight > 0)
            gameState.topRight--;
          hndDeaths();
        }
      }
      for (let flames of levelRoot.getChildrenByName("Flames")) {
        if (enemies3.checkCollision(<GameObject>flames)) {
          if (gameState.bottomRight > 0)
            gameState.bottomRight--;
          hndDeaths();
        }
      }
    }

    // Überprüfung der Kollision mit Wand/Block.
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

    // Setzt boolean, damit man nicht mehrere Leben verliert, falls man durch die selben Flammen läuft.
    private setLifeLimiter = (): void => {
      lifeLimiter = false;
    }

    // Flammen werden entfernt nach Timerablauf.
    private removeFlames(): void {
      levelRoot.removeChild(this);
    }

  }
}