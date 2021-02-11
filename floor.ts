namespace Bomberman {
  import fc = FudgeCore;

  export class Floor extends GameObject {
    
    public constructor(_size: fc.Vector2, _position: fc.Vector2) {
      super("Floor", _size, _position);

      let txtFloor: fc.TextureImage = new fc.TextureImage("Assets/tiles/BackgroundTile.png");
      let mtrFloor: fc.Material = new fc.Material("Floor", fc.ShaderTexture, new fc.CoatTextured(clrWhite, txtFloor));
  
      let cmpMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(mtrFloor);
      this.mtxLocal.translation = new fc.Vector3(_position.x + _size.x / 2 - 0.5, _position.y + _size.y / 2 - 0.5, -0.000001);
      cmpMaterial.pivot.scale(new fc.Vector2(_size.x / 1, _size.y / 1));
      this.addComponent(cmpMaterial); 
    }
  }
}