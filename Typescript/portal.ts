namespace Bomberman {
  import fc = FudgeCore;
  import fcAid = FudgeAid;

  let cmpAudio: fc.ComponentAudio;
  let soundTeleport: fc.Audio = new fc.Audio("../Assets/sounds/teleport.wav");

  let portalArray: fc.Vector2[] = [];

  export class Portal extends GameObject {
    private static animations: fcAid.SpriteSheetAnimations;
    public sprite: fcAid.NodeSprite;

    public constructor(_position: fc.Vector2, portalID: number) {
      super("Portal", new fc.Vector2(0.8, 0.8), _position);

      this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
      this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;


      this.sprite = new fcAid.NodeSprite("PortalSprite");
      this.sprite.addComponent(new fc.ComponentTransform());
      this.appendChild(this.sprite);

      this.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Portal.animations["PORTAL"]);
      this.sprite.showFrame(0);
      this.sprite.setFrameDirection(1);
      this.sprite.framerate = 8;

      portalArray[portalID] = _position;
    }

    public static generateSprites(_spritesheet: fc.CoatTextured): void {
      Portal.animations = {};
      
      let name: string = "PORTAL";
      let sprite: fcAid.SpriteSheetAnimation = new fcAid.SpriteSheetAnimation(name, _spritesheet);
      sprite.generateByGrid(fc.Rectangle.GET(960, 0, 64, 64), 1, 82, fc.ORIGIN2D.CENTER, fc.Vector2.X(64));
      Portal.animations[name] = sprite;

      let name2: string = "TELEPORT";
      let sprite2: fcAid.SpriteSheetAnimation = new fcAid.SpriteSheetAnimation(name2, _spritesheet);
      sprite2.generateByGrid(fc.Rectangle.GET(0, 0, 64, 64), 18, 82, fc.ORIGIN2D.CENTER, fc.Vector2.X(64));
      Portal.animations[name2] = sprite2;

    }

    // Teleportation und Verbindung der Portale bei Kollision mit Spieler/Enemy.
    public teleportPortal(_portals: Portal): void {
      cmpAudio = new fc.ComponentAudio(soundTeleport, false, false);
      cmpAudio.connect(true);
      cmpAudio.volume = 0.05;
      cmpAudio.setAudio(soundTeleport);
      cmpAudio.play(true);

      _portals.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Portal.animations["TELEPORT"]);
      fc.Time.game.setTimer(1000, 1, this.stopAnimation.bind(_portals));

      let avatarPos: fc.Vector3 = avatar.mtxLocal.translation;
      let enemyPos: fc.Vector3 = enemies.mtxLocal.translation;
      let enemyPos2: fc.Vector3 = enemies2.mtxLocal.translation;
      let enemyPos3: fc.Vector3 = enemies3.mtxLocal.translation;

      for (let i: number = 0; i <= portalArray.length - 1; i++) {
        if (avatarPos.equals(portalArray[i].toVector3())) {
          if (i == portalArray.length - 1) {
            avatar.mtxLocal.translation = portalArray[0].toVector3();
          } else {
            avatar.mtxLocal.translation = portalArray[i + 1].toVector3();
          }
        }
      }

      for (let i: number = 0; i <= portalArray.length - 1; i++) {
        if (enemyPos.equals(portalArray[i].toVector3())) {
          if (i == portalArray.length - 1) {
            enemies.mtxLocal.translation = portalArray[0].toVector3();
          } else {
            enemies.mtxLocal.translation = portalArray[i + 1].toVector3();
          }
        }
      }

      for (let i: number = 0; i <= portalArray.length - 1; i++) {
        if (enemyPos2.equals(portalArray[i].toVector3())) {
          if (i == portalArray.length - 1) {
            enemies2.mtxLocal.translation = portalArray[0].toVector3();
          } else {
            enemies2.mtxLocal.translation = portalArray[i + 1].toVector3();
          }
        }
      }

      for (let i: number = 0; i <= portalArray.length - 1; i++) {
        if (enemyPos3.equals(portalArray[i].toVector3())) {
          if (i == portalArray.length - 1) {
            enemies3.mtxLocal.translation = portalArray[0].toVector3();
          } else {
            enemies3.mtxLocal.translation = portalArray[i + 1].toVector3();
          }
        }
      }
    }

    // Nach Beendigung des Teleports wird das Portal wieder normal.
    private stopAnimation(): void {
      this.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Portal.animations["PORTAL"]);
    }

  }
}