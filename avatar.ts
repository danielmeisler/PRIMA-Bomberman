namespace Bomberman {
  import fc = FudgeCore;
  import fcAid = FudgeAid;
  let controlVertical: fc.Control = new fc.Control("CameraControlVertical", 10, fc.CONTROL_TYPE.PROPORTIONAL);
  let controlHorizontal: fc.Control = new fc.Control("CameraControlHorizontal", 10, fc.CONTROL_TYPE.PROPORTIONAL);
  controlVertical.setDelay(100);
  controlHorizontal.setDelay(100);
/*   let avatarVelocityHorizontal: fc.Vector3 = fc.Vector3.ZERO();
  let avatarVelocityVertical: fc.Vector3 = fc.Vector3.ZERO();
  let avatarVelX: fc.Vector3 = fc.Vector3.ZERO();
  let avatarVelY: fc.Vector3 = fc.Vector3.ZERO(); */


  export enum JOB {
    WALK_DOWN, WALK_LEFT, WALK_UP, WALK_RIGHT
  }

  export class Avatar extends GameObject {
    private static readonly mtrColorAvatar: fc.Material = new fc.Material("BallColor", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("YELLOW")));
    public speed: fc.Vector3 = new fc.Vector3(0.5, 0.5, 0);
    public tempPos: fc.Vector3;
    private show: fc.Node;
    private sprite: fcAid.NodeSprite;

    public constructor(_size: fc.Vector2, _position: fc.Vector2) {
      super("Bomberman", _size, _position);

      let cMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(Avatar.mtrColorAvatar);
      this.addComponent(cMaterial);

      this.show = new fcAid.Node("Show", fc.Matrix4x4.IDENTITY());
      this.appendChild(this.show);

      this.sprite = new fcAid.NodeSprite("Sprite");
      this.sprite.addComponent(new fc.ComponentTransform());
      this.show.appendChild(this.sprite);


      //this.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Avatar.animations["WALK"]);
      // this.sprite.showFrame(0);
      this.sprite.setFrameDirection(1);
      this.sprite.framerate = 2;
      document.addEventListener("keydown", this.avatarControls);
    }

    /*     public static generateSprites(_spritesheet: fc.CoatTextured): void {
          Avatar.animations = {};
          let name: string = "WALK";
          let sprite: fcAid.SpriteSheetAnimation = new fcAid.SpriteSheetAnimation(name, _spritesheet);
          sprite.generateByGrid(fc.Rectangle.GET(0, 0, 64, 128), 8, 64, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(0));
          Avatar.animations[name] = sprite;
        } */

    public update(): void {
      //this.avatarControls();


      //this.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Avatar.animations["WALK"]);

    }

    /*     public avatarControls(_distance: fc.Vector3): void {
          controlHorizontal.setInput(
            fc.Keyboard.mapToValue(-_distance.x, 0, [fc.KEYBOARD_CODE.A])
            + fc.Keyboard.mapToValue(_distance.x, 0, [fc.KEYBOARD_CODE.D])
          );
          controlVertical.setInput(
            fc.Keyboard.mapToValue(_distance.y, 0, [fc.KEYBOARD_CODE.W])
            + fc.Keyboard.mapToValue(-_distance.x, 0, [fc.KEYBOARD_CODE.S])
          );
          avatarVelocityHorizontal = fc.Vector3.X(controlHorizontal.getOutput());
          avatarVelocityVertical = fc.Vector3.Y(controlVertical.getOutput());
    
          let frameTime: number = fc.Loop.timeFrameGame / 1000;
    
          avatarVelX = fc.Vector3.SCALE(avatarVelocityHorizontal, frameTime);
          avatarVelY = fc.Vector3.SCALE(avatarVelocityVertical, frameTime);
          this.rect.position.x = this.mtxLocal.translation.x;
          this.rect.position.y = this.mtxLocal.translation.y;
          this.mtxLocal.translate(avatarVelX);
          this.mtxLocal.translate(avatarVelY);
         } */
        
    public avatarControls(event: KeyboardEvent): void {
      this.tempPos = avatar.mtxLocal.translation;
      if (event.key == "a") {
          avatar.mtxLocal.translateX(-1);
      }
      else if (event.key == "w") {
          //this.tempPos = avatar.mtxLocal.translation;
          avatar.mtxLocal.translateY(1);
      }
      else if (event.key == "d") {
          //this.tempPos = avatar.mtxLocal.translation;
          avatar.mtxLocal.translateX(1);
      }
      else if (event.key == "s") {
          //this.tempPos = avatar.mtxLocal.translation;
          avatar.mtxLocal.translateY(-1);
       }

      avatar.rect.position.x = avatar.mtxLocal.translation.x - avatar.rect.size.x / 2;
      avatar.rect.position.y = avatar.mtxLocal.translation.y - avatar.rect.size.y / 2;

      for (let wall of levelRoot.getChildrenByName("Wall")) {
        let rect: fc.Rectangle = (<Wall>wall).rect;
        if (avatar.checkCollision(<GameObject>wall)) {
          avatar.mtxLocal.translation = this.tempPos;
          //console.log(this.tempPos.x + " " + this.tempPos.y);
          //console.log(wall.mtxLocal.translation.x + " " + wall.mtxLocal.translation.y);
          //console.log(rect.position.x + " " + rect.position.y + " " + wall.mtxLocal.translation.x + " " + wall.mtxLocal.translation.y);


        }
      }
    }
    
/*     private avatarCollision(): void {
      
    } */
  }
}