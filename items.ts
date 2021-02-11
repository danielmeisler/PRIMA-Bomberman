namespace Bomberman {
  import fc = FudgeCore;
  import fcAid = FudgeAid;

  export enum ITEM {
    BOMB_PLUS, FLAME_PLUS, BOMB_CIRCLE, BOMB_DIAGONAL, LIFE_INVINCIBILITY, LIFE_PLUS
  }

  export class Items extends GameObject {
    private static animations: fcAid.SpriteSheetAnimations;
    public job: ITEM;
    public sprite: fcAid.NodeSprite;

    public constructor(_name: string, _position: fc.Vector2) {
      super(_name, new fc.Vector2(0.8, 0.8), _position);

      this.sprite = new fcAid.NodeSprite("ItemSprite");
      this.sprite.addComponent(new fc.ComponentTransform());
      this.sprite.mtxLocal.translateY(-0.25);
      this.sprite.mtxLocal.translateZ(0.0001);
      this.appendChild(this.sprite);

      this.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Items.animations[_name]);
      this.sprite.showFrame(0);
      this.sprite.setFrameDirection(1);
      this.sprite.framerate = 6;

      if (_name == "BOMB_PLUS") {
        this.job = ITEM.BOMB_PLUS;
      } else if (_name == "FLAME_PLUS") {
        this.job = ITEM.FLAME_PLUS;
      } else if (_name == "BOMB_CIRCLE") {
        this.job = ITEM.BOMB_CIRCLE;
      } else if (_name == "BOMB_DIAGONAL") {
        this.job = ITEM.BOMB_DIAGONAL;
      } else if (_name == "LIFE_INVINCIBILITY") {
        this.job = ITEM.LIFE_INVINCIBILITY;
      } else if (_name == "LIFE_PLUS") {
        this.job = ITEM.LIFE_PLUS;
      }
      
    }

    public static generateSprites(_spritesheet: fc.CoatTextured): void {
      Items.animations = {};

      let name: string = "BOMB_PLUS";
      let sprite: fcAid.SpriteSheetAnimation = new fcAid.SpriteSheetAnimation(name, _spritesheet);
      sprite.generateByGrid(fc.Rectangle.GET(0, 0, 32, 32), 1, 82, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(0));
      Items.animations[name] = sprite;

      let name2: string = "FLAME_PLUS";
      let sprite2: fcAid.SpriteSheetAnimation = new fcAid.SpriteSheetAnimation(name2, _spritesheet);
      sprite2.generateByGrid(fc.Rectangle.GET(32, 0, 32, 32), 1, 82, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(0));
      Items.animations[name2] = sprite2;
        
      let name3: string = "BOMB_CIRCLE";
      let sprite3: fcAid.SpriteSheetAnimation = new fcAid.SpriteSheetAnimation(name3, _spritesheet);
      sprite3.generateByGrid(fc.Rectangle.GET(64, 0, 32, 32), 1, 82, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(0));
      Items.animations[name3] = sprite3;

      let name4: string = "BOMB_DIAGONAL";
      let sprite4: fcAid.SpriteSheetAnimation = new fcAid.SpriteSheetAnimation(name4, _spritesheet);
      sprite4.generateByGrid(fc.Rectangle.GET(96, 0, 32, 32), 1, 82, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(0));
      Items.animations[name4] = sprite4;

      let name5: string = "LIFE_INVINCIBILITY";
      let sprite5: fcAid.SpriteSheetAnimation = new fcAid.SpriteSheetAnimation(name5, _spritesheet);
      sprite5.generateByGrid(fc.Rectangle.GET(128, 0, 32, 32), 1, 82, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(0));
      Items.animations[name5] = sprite5;

      let name6: string = "LIFE_PLUS";
      let sprite6: fcAid.SpriteSheetAnimation = new fcAid.SpriteSheetAnimation(name6, _spritesheet);
      sprite6.generateByGrid(fc.Rectangle.GET(160, 0, 32, 32), 1, 82, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(0));
      Items.animations[name6] = sprite6;
    }

    public itemChanger(): void {
      
      switch (this.job) {
        case ITEM.BOMB_PLUS:
            maxBomb++;
            break;
        case ITEM.FLAME_PLUS:
            flameDistance++;
            break;
        case ITEM.BOMB_CIRCLE:
            circleBomb = true;
            break;
        case ITEM.BOMB_DIAGONAL:
            diagonalBomb = true;
            break;
        case ITEM.LIFE_INVINCIBILITY:
            console.log("UNSTERBLICH");
            break;
        case ITEM.LIFE_PLUS:
            
            break;            
          }



    }



  }

}