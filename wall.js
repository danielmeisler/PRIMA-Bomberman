"use strict";
var Bomberman;
(function (Bomberman) {
    var fc = FudgeCore;
    class Wall extends Bomberman.GameObject {
        constructor(_size, _position, _material) {
            super("Wall", _size, _position);
            let cmpMaterial = new fc.ComponentMaterial(_material);
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            //this.mtxLocal.translation = new fc.Vector3(_position.x + _size.x / 2, _position.y + _size.y / 2, 0);
            //cmpMaterial.pivot.scale(new fc.Vector2(_size.x / 1, _size.y / 1));
            this.addComponent(cmpMaterial);
        }
    }
    Bomberman.Wall = Wall;
})(Bomberman || (Bomberman = {}));
//# sourceMappingURL=wall.js.map