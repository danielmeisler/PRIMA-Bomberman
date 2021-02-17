namespace Bomberman {
  import fc = FudgeCore;

  export class ExplodableBlock extends GameObject {

    public constructor(_size: fc.Vector2, _position: fc.Vector2) {
      super("ExplodableBlock", _size, _position);

      let txtWall: fc.TextureImage = new fc.TextureImage();
      txtWall.load("../Assets/tiles/ExplodableBlock.png");
      let mtrWall: fc.Material = new fc.Material("ExplodableBlockMaterial", fc.ShaderTexture, new fc.CoatTextured(clrWhite, txtWall));
      let cmpMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(mtrWall);
      
      this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
      this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;

      this.addComponent(cmpMaterial);
    }
  }
}