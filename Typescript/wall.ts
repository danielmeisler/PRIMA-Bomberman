namespace Bomberman {
  import fc = FudgeCore;

  export class Wall extends GameObject {

    public constructor(_size: fc.Vector2, _position: fc.Vector2) {
      super("Wall", _size, _position);

      let txtWall: fc.TextureImage = new fc.TextureImage;
      txtWall.load("../Assets/tiles/SolidBlock.png");
      let mtrWall: fc.Material = new fc.Material("BorderWall", fc.ShaderTexture, new fc.CoatTextured(clrWhite, txtWall));
      let cmpMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(mtrWall);
      
      this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
      this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;

      this.addComponent(cmpMaterial);
    }
  }
}