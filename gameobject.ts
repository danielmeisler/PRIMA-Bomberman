namespace Bomberman {
  import fc = FudgeCore;

  export class GameObject extends fc.Node {
    public static readonly meshQuad: fc.MeshQuad = new fc.MeshQuad();
    public rect: fc.Rectangle;

    public constructor(_name: string, _size: fc.Vector2, _position: fc.Vector2) {
      super(_name);

      this.rect = new fc.Rectangle(_position.x, _position.y, _size.x, _size.y, fc.ORIGIN2D.CENTER);

      this.addComponent(new fc.ComponentTransform(fc.Matrix4x4.TRANSLATION(_position.toVector3(0))));

      let cmpQuad: fc.ComponentMesh = new fc.ComponentMesh(GameObject.meshQuad);
      this.addComponent(cmpQuad);
      cmpQuad.pivot.scale(_size.toVector3(0));
    }

    public checkCollision(_target: GameObject): boolean {
      let intersection: fc.Rectangle = this.rect.getIntersection(_target.rect);
      if (intersection == null) {
          return false;
      }
      return true;
     }
    
  }
}