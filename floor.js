"use strict";
var Bomberman;
(function (Bomberman) {
    var fc = FudgeCore;
    class Floor extends Bomberman.GameObject {
        constructor(_size, _position, _material) {
            super("Floor", _size, _position);
            let cmpMaterial = new fc.ComponentMaterial(_material);
            this.mtxLocal.translation = new fc.Vector3(_position.x + _size.x / 2 - 0.5, _position.y + _size.y / 2 - 0.5, -0.000001);
            cmpMaterial.pivot.scale(new fc.Vector2(_size.x / 1, _size.y / 1));
            this.addComponent(cmpMaterial);
        }
    }
    Bomberman.Floor = Floor;
})(Bomberman || (Bomberman = {}));
//# sourceMappingURL=floor.js.map