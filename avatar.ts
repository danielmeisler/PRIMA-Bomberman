///<reference path= "GameObject.ts"/>

namespace Bomberman {
  import fc = FudgeCore;
  import fcAid = FudgeAid;

  let cmpAudio: fc.ComponentAudio;
  let soundWalk: fc.Audio = new fc.Audio("Assets/sounds/walk.wav");
  let soundItems: fc.Audio = new fc.Audio("Assets/sounds/items.mp3");

  export class Avatar extends GameObject {
    //private static readonly mtrColorAvatar: fc.Material = new fc.Material("BaseColor", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("YELLOW")));
    private static animations: fcAid.SpriteSheetAnimations;
    public job: WALK = WALK.DOWN;
    public tempPos: fc.Vector3;
    public sprite: fcAid.NodeSprite;

    public constructor(_position: fc.Vector2) {
      super("Bomberman", new fc.Vector2(0.8, 0.8), _position);

 /*   let cMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(Avatar.mtrColorAvatar);
      this.addComponent(cMaterial);*/

      this.sprite = new fcAid.NodeSprite("AvatarSprite");
      this.sprite.addComponent(new fc.ComponentTransform());
      this.sprite.mtxLocal.translateY(-0.25);
      this.sprite.mtxLocal.translateZ(0.001);
      this.appendChild(this.sprite);

      this.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Avatar.animations["WALK_DOWN"]);
      this.sprite.showFrame(0);
      this.sprite.setFrameDirection(1);
      this.sprite.framerate = 6;
      document.addEventListener("keydown", this.avatarControls);
    }

    public static generateSprites(_spritesheet: fc.CoatTextured): void {
      Avatar.animations = {};
      for (let i: number = 0; i < 4; i++) {
        let name: string = "WALK_" + WALK[i];
        let sprite: fcAid.SpriteSheetAnimation = new fcAid.SpriteSheetAnimation(name, _spritesheet);
        sprite.generateByGrid(fc.Rectangle.GET(0, i * 128, 64, 128), 8, 82, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(64));
        Avatar.animations[name] = sprite;
      }
    }

    public avatarControls(event: KeyboardEvent): void {
      cmpAudio = new fc.ComponentAudio(soundWalk, false, false);
      cmpAudio.connect(true);
      cmpAudio.volume = 0.05;
      cmpAudio.setAudio(soundWalk);
      cmpAudio.play(true);

      this.tempPos = avatar.mtxLocal.translation;
      if (event.code == fc.KEYBOARD_CODE.A) {
        avatar.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Avatar.animations["WALK_LEFT"]);
        avatar.mtxLocal.translateX(-1);
      }
      else if (event.code == fc.KEYBOARD_CODE.W) {
        avatar.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Avatar.animations["WALK_UP"]);
        avatar.mtxLocal.translateY(1);
      }
      else if (event.code == fc.KEYBOARD_CODE.D) {
        avatar.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Avatar.animations["WALK_RIGHT"]);
        avatar.mtxLocal.translateX(1);
      }
      else if (event.code == fc.KEYBOARD_CODE.S) {
        avatar.sprite.setAnimation(<fcAid.SpriteSheetAnimation>Avatar.animations["WALK_DOWN"]);
        avatar.mtxLocal.translateY(-1);
      }
      else if (event.code == fc.KEYBOARD_CODE.SPACE) {
        if (countBombs < maxBomb) {
          levelRoot.appendChild(new Bomb(fc.Vector2.ONE(1), new fc.Vector2(avatar.mtxLocal.translation.x, avatar.mtxLocal.translation.y)));
          countBombs++;
        }
      }

      avatar.rect.position.x = avatar.mtxLocal.translation.x - avatar.rect.size.x / 2;
      avatar.rect.position.y = avatar.mtxLocal.translation.y - avatar.rect.size.y / 2;

      for (let wall of wallsNode.getChildren()) {
        if (avatar.checkCollision(<GameObject>wall)) {
          avatar.mtxLocal.translation = this.tempPos;
        }
      }
      for (let wall of explodableBlockNode.getChildren()) {
        if (avatar.checkCollision(<GameObject>wall)) {
          avatar.mtxLocal.translation = this.tempPos;
        }
      }
      for (let bomb of levelRoot.getChildrenByName("Bomb")) {
        if (avatar.checkCollision(<GameObject>bomb)) {
          avatar.mtxLocal.translation = this.tempPos;
        }
      }
      for (let flames of levelRoot.getChildrenByName("Flames")) {
        if (avatar.checkCollision(<GameObject>flames)) {
          console.log("MINUS LEBEN");
          gameState.bottomLeft--;
        }
      }
      for (let enemies of root.getChildrenByName("Enemies")) {
        if (avatar.checkCollision(<GameObject>enemies)) {
          avatar.mtxLocal.translation = this.tempPos;
        }
      }
      for (let portal of levelRoot.getChildrenByName("Portal")) {
        if (avatar.checkCollision(<GameObject>portal)) {
          let portals: Portal = new Portal(new fc.Vector2(0, 0), -1);
          portals.teleportPortal(<Portal>portal);
        }
      }

      cmpAudio = new fc.ComponentAudio(soundItems, false, false);
      cmpAudio.connect(true);
      cmpAudio.volume = 0.08;
      cmpAudio.setAudio(soundItems);

      for (let items of levelRoot.getChildrenByName("BOMB_PLUS")) {
        if (avatar.checkCollision(<GameObject>items)) {
          let item: Items = new Items("BOMB_PLUS", new fc.Vector2(0, 0));
          item.itemChanger();
          cmpAudio.play(true);
          levelRoot.removeChild(items);
        }
      }
      for (let items of levelRoot.getChildrenByName("FLAME_PLUS")) {
        if (avatar.checkCollision(<GameObject>items)) {
          let item: Items = new Items("FLAME_PLUS", new fc.Vector2(0, 0));
          item.itemChanger();
          cmpAudio.play(true);
          levelRoot.removeChild(items);
        }
      }
      for (let items of levelRoot.getChildrenByName("BOMB_CIRCLE")) {
        if (avatar.checkCollision(<GameObject>items)) {
          let item: Items = new Items("BOMB_CIRCLE", new fc.Vector2(0, 0));
          item.itemChanger();
          cmpAudio.play(true);
          levelRoot.removeChild(items);
        }
      }
      for (let items of levelRoot.getChildrenByName("BOMB_DIAGONAL")) {
        if (avatar.checkCollision(<GameObject>items)) {
          let item: Items = new Items("BOMB_DIAGONAL", new fc.Vector2(0, 0));
          item.itemChanger();
          cmpAudio.play(true);
          levelRoot.removeChild(items);
        }
      }
      for (let items of levelRoot.getChildrenByName("LIFE_INVINCIBILITY")) {
        if (avatar.checkCollision(<GameObject>items)) {
          let item: Items = new Items("LIFE_INVINCIBILITY", new fc.Vector2(0, 0));
          item.itemChanger();
          cmpAudio.play(true);
          levelRoot.removeChild(items);
        }
      }
      for (let items of levelRoot.getChildrenByName("LIFE_PLUS")) {
        if (avatar.checkCollision(<GameObject>items)) {
          gameState.bottomLeft++;
          cmpAudio.play(true);
          levelRoot.removeChild(items);
        }
      }
      
    }



  }
}