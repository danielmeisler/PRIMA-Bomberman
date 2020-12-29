"use strict";
var Bomberman;
(function (Bomberman) {
    var fc = FudgeCore;
    class GameObject extends fc.Node {
        constructor(_name, _size, _position) {
            super(_name);
            this.rect = new fc.Rectangle(_position.x, _position.y, _size.x, _size.y, fc.ORIGIN2D.CENTER);
            this.addComponent(new fc.ComponentTransform(fc.Matrix4x4.TRANSLATION(_position.toVector3(0))));
            let cmpQuad = new fc.ComponentMesh(GameObject.meshQuad);
            this.addComponent(cmpQuad);
            cmpQuad.pivot.scale(_size.toVector3(0));
        }
        checkCollision(_target) {
            let intersection = this.rect.getIntersection(_target.rect);
            if (intersection == null) {
                return false;
            }
            return true;
        }
    }
    GameObject.meshQuad = new fc.MeshQuad();
    Bomberman.GameObject = GameObject;
})(Bomberman || (Bomberman = {}));
//# sourceMappingURL=gameobject.js.map