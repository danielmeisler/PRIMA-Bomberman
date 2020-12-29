namespace Bomberman {
  import fc = FudgeCore;

  export class Wall extends GameObject {

    public constructor(_size: fc.Vector2, _position: fc.Vector2, _material: fc.Material) {
      super("Wall", _size, _position);
      let cmpMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(_material);
      
      this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
      this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;

      //this.mtxLocal.translation = new fc.Vector3(_position.x + _size.x / 2, _position.y + _size.y / 2, 0);
      //cmpMaterial.pivot.scale(new fc.Vector2(_size.x / 1, _size.y / 1));
      this.addComponent(cmpMaterial);
    }
  }
}