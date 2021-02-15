///<reference path= "GameObject.ts"/>

namespace Bomberman {
  import fc = FudgeCore;
  import fcAid = FudgeAid;

  let cmpAudio: fc.ComponentAudio;
  let soundBomb: fc.Audio = new fc.Audio("Assets/sounds/explosion.wav");

  export class Bomb extends GameObject {
    private static animations: fcAid.SpriteSheetAnimations;
    public sprite: fcAid.NodeSprite;

    public constructor(_size: fc.Vector2, _position: fc.Vector2, _source: number) {
      super("Bomb", _size, _position);

      this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
      this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;

      this.sprite = new fcAid.NodeSprite("BombSprite");
      this.sprite.addComponent(new fc.ComponentTransform());
      this.sprite.mtxLocal.translateZ(0.0001);
      this.appendChild(this.sprite);

      this.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Bomb.animations["BOMB"]);
      this.sprite.showFrame(0);
      this.sprite.setFrameDirection(1);
      this.sprite.framerate = 3;

      if (_source == 0)
      fc.Time.game.setTimer(3000, 1, this.explodeBomb);
      if (_source == 1)
      fc.Time.game.setTimer(3000, 1, this.explodeBombEnemy);
      if (_source == 2)
      fc.Time.game.setTimer(3000, 1, this.explodeBombEnemy2);
      if (_source == 3)
      fc.Time.game.setTimer(3000, 1, this.explodeBombEnemy3);
    }

    public static generateSprites(_spritesheet: fc.CoatTextured, _spritesheet2: fc.CoatTextured): void {
      Bomb.animations = {};
      
      let name: string = "BOMB";
      let sprite: fcAid.SpriteSheetAnimation = new fcAid.SpriteSheetAnimation(name, _spritesheet);
      sprite.generateByGrid(fc.Rectangle.GET(0, 0, 48, 48), 3, 82, fc.ORIGIN2D.CENTER, fc.Vector2.X(48));
      Bomb.animations[name] = sprite;

      let name2: string = "EXPLODE";
      let spriteExplode: fcAid.SpriteSheetAnimation = new fcAid.SpriteSheetAnimation(name2, _spritesheet2);
      spriteExplode.generateByGrid(fc.Rectangle.GET(0, 0, 200, 200), 1, 82, fc.ORIGIN2D.CENTER, fc.Vector2.X(0));
      Bomb.animations[name2] = spriteExplode;
    }

    private explodeBomb = (): void => {
      cmpAudio = new fc.ComponentAudio(soundBomb, false, false);
      cmpAudio.connect(true);
      cmpAudio.volume = 0.05;
      cmpAudio.setAudio(soundBomb);
      cmpAudio.play(true);

      this.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Bomb.animations["EXPLODE"]);
      let flames: Flames = new Flames(new fc.Vector2(this.mtxLocal.translation.x, this.mtxLocal.translation.y)); 

      if (circleBomb == true)
      flames.circleBombFlames(flames.mtxLocal.translation);
      else if (diagonalBomb == true)
      flames.diagonalBombFlames(flames.mtxLocal.translation);
      else
      flames.placeFlames(flames.mtxLocal.translation);

      fc.Time.game.setTimer(1000, 1, this.removeBomb);
    }

    private removeBomb = (): void => {
      levelRoot.removeChild(this);
      countBombs--;
    }

    private explodeBombEnemy = (): void => {
      cmpAudio = new fc.ComponentAudio(soundBomb, false, false);
      cmpAudio.connect(true);
      cmpAudio.volume = 0.05;
      cmpAudio.setAudio(soundBomb);
      cmpAudio.play(true);

      this.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Bomb.animations["EXPLODE"]);
      let flames: Flames = new Flames(new fc.Vector2(this.mtxLocal.translation.x, this.mtxLocal.translation.y)); 

      if (circleBomb == true)
      flames.circleBombFlames(flames.mtxLocal.translation);
      else if (diagonalBomb == true)
      flames.diagonalBombFlames(flames.mtxLocal.translation);
      else
      flames.placeFlames(flames.mtxLocal.translation);

      fc.Time.game.setTimer(1000, 1, this.removeBombEnemy);
    }

    private removeBombEnemy = (): void => {
      levelRoot.removeChild(this);
      countBombsEnemy--;
    }

    private explodeBombEnemy2 = (): void => {
      cmpAudio = new fc.ComponentAudio(soundBomb, false, false);
      cmpAudio.connect(true);
      cmpAudio.volume = 0.05;
      cmpAudio.setAudio(soundBomb);
      cmpAudio.play(true);

      this.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Bomb.animations["EXPLODE"]);
      let flames: Flames = new Flames(new fc.Vector2(this.mtxLocal.translation.x, this.mtxLocal.translation.y)); 

      if (circleBomb == true)
      flames.circleBombFlames(flames.mtxLocal.translation);
      else if (diagonalBomb == true)
      flames.diagonalBombFlames(flames.mtxLocal.translation);
      else
      flames.placeFlames(flames.mtxLocal.translation);

      fc.Time.game.setTimer(1000, 1, this.removeBombEnemy2);
    }

    private removeBombEnemy2 = (): void => {
      levelRoot.removeChild(this);
      countBombsEnemy2--;
    }

    private explodeBombEnemy3 = (): void => {
      cmpAudio = new fc.ComponentAudio(soundBomb, false, false);
      cmpAudio.connect(true);
      cmpAudio.volume = 0.05;
      cmpAudio.setAudio(soundBomb);
      cmpAudio.play(true);

      this.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Bomb.animations["EXPLODE"]);
      let flames: Flames = new Flames(new fc.Vector2(this.mtxLocal.translation.x, this.mtxLocal.translation.y)); 

      if (circleBomb == true)
      flames.circleBombFlames(flames.mtxLocal.translation);
      else if (diagonalBomb == true)
      flames.diagonalBombFlames(flames.mtxLocal.translation);
      else
      flames.placeFlames(flames.mtxLocal.translation);

      fc.Time.game.setTimer(1000, 1, this.removeBombEnemy3);
    }

    private removeBombEnemy3 = (): void => {
      levelRoot.removeChild(this);
      countBombsEnemy3--;
    }
  }
}