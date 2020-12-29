namespace Bomberman {
  import fc = FudgeCore;

  export class Floor extends GameObject {
    
    public constructor(_size: fc.Vector2, _position: fc.Vector2, _material: fc.Material) {
      super("Floor", _size, _position);
  
      let cmpMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(_material);
      this.mtxLocal.translation = new fc.Vector3(_position.x + _size.x / 2 - 0.5, _position.y + _size.y / 2 - 0.5, -0.000001);
      cmpMaterial.pivot.scale(new fc.Vector2(_size.x / 1, _size.y / 1));
      this.addComponent(cmpMaterial); 
    }
  }
}