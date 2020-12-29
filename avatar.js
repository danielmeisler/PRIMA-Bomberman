"use strict";
var Bomberman;
(function (Bomberman) {
    var fc = FudgeCore;
    var fcAid = FudgeAid;
    let controlVertical = new fc.Control("CameraControlVertical", 10, 0 /* PROPORTIONAL */);
    let controlHorizontal = new fc.Control("CameraControlHorizontal", 10, 0 /* PROPORTIONAL */);
    controlVertical.setDelay(100);
    controlHorizontal.setDelay(100);
    /*   let avatarVelocityHorizontal: fc.Vector3 = fc.Vector3.ZERO();
      let avatarVelocityVertical: fc.Vector3 = fc.Vector3.ZERO();
      let avatarVelX: fc.Vector3 = fc.Vector3.ZERO();
      let avatarVelY: fc.Vector3 = fc.Vector3.ZERO(); */
    let JOB;
    (function (JOB) {
        JOB[JOB["WALK_DOWN"] = 0] = "WALK_DOWN";
        JOB[JOB["WALK_LEFT"] = 1] = "WALK_LEFT";
        JOB[JOB["WALK_UP"] = 2] = "WALK_UP";
        JOB[JOB["WALK_RIGHT"] = 3] = "WALK_RIGHT";
    })(JOB = Bomberman.JOB || (Bomberman.JOB = {}));
    class Avatar extends Bomberman.GameObject {
        constructor(_size, _position) {
            super("Bomberman", _size, _position);
            this.speed = new fc.Vector3(0.5, 0.5, 0);
            let cMaterial = new fc.ComponentMaterial(Avatar.mtrColorAvatar);
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
        update() {
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
        avatarControls(event) {
            this.tempPos = Bomberman.avatar.mtxLocal.translation;
            if (event.key == "a") {
                Bomberman.avatar.mtxLocal.translateX(-1);
            }
            else if (event.key == "w") {
                //this.tempPos = avatar.mtxLocal.translation;
                Bomberman.avatar.mtxLocal.translateY(1);
            }
            else if (event.key == "d") {
                //this.tempPos = avatar.mtxLocal.translation;
                Bomberman.avatar.mtxLocal.translateX(1);
            }
            else if (event.key == "s") {
                //this.tempPos = avatar.mtxLocal.translation;
                Bomberman.avatar.mtxLocal.translateY(-1);
            }
            Bomberman.avatar.rect.position.x = Bomberman.avatar.mtxLocal.translation.x - Bomberman.avatar.rect.size.x / 2;
            Bomberman.avatar.rect.position.y = Bomberman.avatar.mtxLocal.translation.y - Bomberman.avatar.rect.size.y / 2;
            for (let wall of Bomberman.levelRoot.getChildrenByName("Wall")) {
                let rect = wall.rect;
                if (Bomberman.avatar.checkCollision(wall)) {
                    Bomberman.avatar.mtxLocal.translation = this.tempPos;
                    //console.log(this.tempPos.x + " " + this.tempPos.y);
                    //console.log(wall.mtxLocal.translation.x + " " + wall.mtxLocal.translation.y);
                    //console.log(rect.position.x + " " + rect.position.y + " " + wall.mtxLocal.translation.x + " " + wall.mtxLocal.translation.y);
                }
            }
        }
    }
    Avatar.mtrColorAvatar = new fc.Material("BallColor", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("YELLOW")));
    Bomberman.Avatar = Avatar;
})(Bomberman || (Bomberman = {}));
//# sourceMappingURL=avatar.js.map