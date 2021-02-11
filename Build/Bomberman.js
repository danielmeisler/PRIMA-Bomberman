"use strict";
var Bomberman;
(function (Bomberman) {
    var fc = FudgeCore;
    Bomberman.countBombs = 0;
    Bomberman.countBombsEnemy = 0;
    Bomberman.maxBomb = 1;
    Bomberman.maxBombEnemy = 1;
    Bomberman.circleBomb = false;
    Bomberman.diagonalBomb = false;
    let WALK;
    (function (WALK) {
        WALK[WALK["DOWN"] = 0] = "DOWN";
        WALK[WALK["UP"] = 1] = "UP";
        WALK[WALK["RIGHT"] = 2] = "RIGHT";
        WALK[WALK["LEFT"] = 3] = "LEFT";
    })(WALK = Bomberman.WALK || (Bomberman.WALK = {}));
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
///<reference path= "GameObject.ts"/>
var Bomberman;
///<reference path= "GameObject.ts"/>
(function (Bomberman) {
    var fc = FudgeCore;
    var fcAid = FudgeAid;
    let cmpAudio;
    let soundWalk = new fc.Audio("Assets/sounds/walk.wav");
    let soundItems = new fc.Audio("Assets/sounds/items.mp3");
    class Avatar extends Bomberman.GameObject {
        constructor(_position) {
            super("Bomberman", new fc.Vector2(0.8, 0.8), _position);
            this.job = Bomberman.WALK.DOWN;
            /*   let cMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(Avatar.mtrColorAvatar);
                 this.addComponent(cMaterial);*/
            this.sprite = new fcAid.NodeSprite("AvatarSprite");
            this.sprite.addComponent(new fc.ComponentTransform());
            this.sprite.mtxLocal.translateY(-0.25);
            this.sprite.mtxLocal.translateZ(0.001);
            this.appendChild(this.sprite);
            this.sprite.setAnimation(Avatar.animations["WALK_DOWN"]);
            this.sprite.showFrame(0);
            this.sprite.setFrameDirection(1);
            this.sprite.framerate = 6;
            document.addEventListener("keydown", this.avatarControls);
        }
        static generateSprites(_spritesheet) {
            Avatar.animations = {};
            for (let i = 0; i < 4; i++) {
                let name = "WALK_" + Bomberman.WALK[i];
                let sprite = new fcAid.SpriteSheetAnimation(name, _spritesheet);
                sprite.generateByGrid(fc.Rectangle.GET(0, i * 128, 64, 128), 8, 82, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(64));
                Avatar.animations[name] = sprite;
            }
        }
        avatarControls(event) {
            cmpAudio = new fc.ComponentAudio(soundWalk, false, false);
            cmpAudio.connect(true);
            cmpAudio.volume = 0.05;
            cmpAudio.setAudio(soundWalk);
            cmpAudio.play(true);
            this.tempPos = Bomberman.avatar.mtxLocal.translation;
            if (event.code == fc.KEYBOARD_CODE.A) {
                Bomberman.avatar.sprite.setAnimation(Avatar.animations["WALK_LEFT"]);
                Bomberman.avatar.mtxLocal.translateX(-1);
            }
            else if (event.code == fc.KEYBOARD_CODE.W) {
                Bomberman.avatar.sprite.setAnimation(Avatar.animations["WALK_UP"]);
                Bomberman.avatar.mtxLocal.translateY(1);
            }
            else if (event.code == fc.KEYBOARD_CODE.D) {
                Bomberman.avatar.sprite.setAnimation(Avatar.animations["WALK_RIGHT"]);
                Bomberman.avatar.mtxLocal.translateX(1);
            }
            else if (event.code == fc.KEYBOARD_CODE.S) {
                Bomberman.avatar.sprite.setAnimation(Avatar.animations["WALK_DOWN"]);
                Bomberman.avatar.mtxLocal.translateY(-1);
            }
            else if (event.code == fc.KEYBOARD_CODE.SPACE) {
                if (Bomberman.countBombs < Bomberman.maxBomb) {
                    Bomberman.levelRoot.appendChild(new Bomberman.Bomb(fc.Vector2.ONE(1), new fc.Vector2(Bomberman.avatar.mtxLocal.translation.x, Bomberman.avatar.mtxLocal.translation.y)));
                    Bomberman.countBombs++;
                }
            }
            Bomberman.avatar.rect.position.x = Bomberman.avatar.mtxLocal.translation.x - Bomberman.avatar.rect.size.x / 2;
            Bomberman.avatar.rect.position.y = Bomberman.avatar.mtxLocal.translation.y - Bomberman.avatar.rect.size.y / 2;
            for (let wall of Bomberman.wallsNode.getChildren()) {
                if (Bomberman.avatar.checkCollision(wall)) {
                    Bomberman.avatar.mtxLocal.translation = this.tempPos;
                }
            }
            for (let wall of Bomberman.explodableBlockNode.getChildren()) {
                if (Bomberman.avatar.checkCollision(wall)) {
                    Bomberman.avatar.mtxLocal.translation = this.tempPos;
                }
            }
            for (let bomb of Bomberman.levelRoot.getChildrenByName("Bomb")) {
                if (Bomberman.avatar.checkCollision(bomb)) {
                    Bomberman.avatar.mtxLocal.translation = this.tempPos;
                }
            }
            for (let flames of Bomberman.levelRoot.getChildrenByName("Flames")) {
                if (Bomberman.avatar.checkCollision(flames)) {
                    console.log("MINUS LEBEN");
                    Bomberman.gameState.bottomLeft--;
                }
            }
            for (let enemies of Bomberman.root.getChildrenByName("Enemies")) {
                if (Bomberman.avatar.checkCollision(enemies)) {
                    Bomberman.avatar.mtxLocal.translation = this.tempPos;
                }
            }
            for (let portal of Bomberman.levelRoot.getChildrenByName("Portal")) {
                if (Bomberman.avatar.checkCollision(portal)) {
                    let portals = new Bomberman.Portal(new fc.Vector2(0, 0), -1);
                    portals.teleportPortal(portal);
                }
            }
            cmpAudio = new fc.ComponentAudio(soundItems, false, false);
            cmpAudio.connect(true);
            cmpAudio.volume = 0.08;
            cmpAudio.setAudio(soundItems);
            for (let items of Bomberman.levelRoot.getChildrenByName("BOMB_PLUS")) {
                if (Bomberman.avatar.checkCollision(items)) {
                    let item = new Bomberman.Items("BOMB_PLUS", new fc.Vector2(0, 0));
                    item.itemChanger();
                    cmpAudio.play(true);
                    Bomberman.levelRoot.removeChild(items);
                }
            }
            for (let items of Bomberman.levelRoot.getChildrenByName("FLAME_PLUS")) {
                if (Bomberman.avatar.checkCollision(items)) {
                    let item = new Bomberman.Items("FLAME_PLUS", new fc.Vector2(0, 0));
                    item.itemChanger();
                    cmpAudio.play(true);
                    Bomberman.levelRoot.removeChild(items);
                }
            }
            for (let items of Bomberman.levelRoot.getChildrenByName("BOMB_CIRCLE")) {
                if (Bomberman.avatar.checkCollision(items)) {
                    let item = new Bomberman.Items("BOMB_CIRCLE", new fc.Vector2(0, 0));
                    item.itemChanger();
                    cmpAudio.play(true);
                    Bomberman.levelRoot.removeChild(items);
                }
            }
            for (let items of Bomberman.levelRoot.getChildrenByName("BOMB_DIAGONAL")) {
                if (Bomberman.avatar.checkCollision(items)) {
                    let item = new Bomberman.Items("BOMB_DIAGONAL", new fc.Vector2(0, 0));
                    item.itemChanger();
                    cmpAudio.play(true);
                    Bomberman.levelRoot.removeChild(items);
                }
            }
            for (let items of Bomberman.levelRoot.getChildrenByName("LIFE_INVINCIBILITY")) {
                if (Bomberman.avatar.checkCollision(items)) {
                    let item = new Bomberman.Items("LIFE_INVINCIBILITY", new fc.Vector2(0, 0));
                    item.itemChanger();
                    cmpAudio.play(true);
                    Bomberman.levelRoot.removeChild(items);
                }
            }
            for (let items of Bomberman.levelRoot.getChildrenByName("LIFE_PLUS")) {
                if (Bomberman.avatar.checkCollision(items)) {
                    Bomberman.gameState.bottomLeft++;
                    cmpAudio.play(true);
                    Bomberman.levelRoot.removeChild(items);
                }
            }
        }
    }
    Bomberman.Avatar = Avatar;
})(Bomberman || (Bomberman = {}));
///<reference path= "GameObject.ts"/>
var Bomberman;
///<reference path= "GameObject.ts"/>
(function (Bomberman) {
    var fc = FudgeCore;
    var fcAid = FudgeAid;
    let cmpAudio;
    let soundBomb = new fc.Audio("Assets/sounds/explosion.wav");
    class Bomb extends Bomberman.GameObject {
        constructor(_size, _position) {
            super("Bomb", _size, _position);
            this.explodeBomb = () => {
                cmpAudio = new fc.ComponentAudio(soundBomb, false, false);
                cmpAudio.connect(true);
                cmpAudio.volume = 0.05;
                cmpAudio.setAudio(soundBomb);
                cmpAudio.play(true);
                this.sprite.setAnimation(Bomb.animations["EXPLODE"]);
                let flames = new Bomberman.Flames(new fc.Vector2(this.mtxLocal.translation.x, this.mtxLocal.translation.y));
                if (Bomberman.circleBomb == true)
                    flames.circleBombFlames(flames.mtxLocal.translation);
                else if (Bomberman.diagonalBomb == true)
                    flames.diagonalBombFlames(flames.mtxLocal.translation);
                else
                    flames.placeFlames(flames.mtxLocal.translation);
                fc.Time.game.setTimer(1000, 1, this.removeBomb);
            };
            this.removeBomb = () => {
                Bomberman.levelRoot.removeChild(this);
                Bomberman.countBombs--;
                Bomberman.countBombsEnemy--;
            };
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            this.sprite = new fcAid.NodeSprite("BombSprite");
            this.sprite.addComponent(new fc.ComponentTransform());
            this.sprite.mtxLocal.translateZ(0.0001);
            this.appendChild(this.sprite);
            this.sprite.setAnimation(Bomb.animations["BOMB"]);
            this.sprite.showFrame(0);
            this.sprite.setFrameDirection(1);
            this.sprite.framerate = 3;
            fc.Time.game.setTimer(3000, 1, this.explodeBomb);
        }
        static generateSprites(_spritesheet, _spritesheet2) {
            Bomb.animations = {};
            let name = "BOMB";
            let sprite = new fcAid.SpriteSheetAnimation(name, _spritesheet);
            sprite.generateByGrid(fc.Rectangle.GET(0, 0, 48, 48), 3, 82, fc.ORIGIN2D.CENTER, fc.Vector2.X(48));
            Bomb.animations[name] = sprite;
            let name2 = "EXPLODE";
            let spriteExplode = new fcAid.SpriteSheetAnimation(name2, _spritesheet2);
            spriteExplode.generateByGrid(fc.Rectangle.GET(0, 0, 200, 200), 1, 82, fc.ORIGIN2D.CENTER, fc.Vector2.X(0));
            Bomb.animations[name2] = spriteExplode;
        }
    }
    Bomberman.Bomb = Bomb;
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var fc = FudgeCore;
    var fcAid = FudgeAid;
    class Enemy extends Bomberman.GameObject {
        constructor(_position) {
            super("Enemies", new fc.Vector2(0.8, 0.8), _position);
            this.job = Bomberman.WALK.DOWN;
            this.findPlayer = () => {
                /*       for (let xSize: number = 0; xSize < arenaSize.x; xSize++) {
                        for (let ySize: number = 0; ySize < arenaSize.y; ySize++) {
                          let destinationVector: fc.Vector3 = new fc.Vector3(xSize, ySize, 0);
                          if (avatar.mtxLocal.translation.equals(destinationVector)) {
                            console.log(destinationVector);
                          }
                        }
                      } */
                let travelVector;
                travelVector = Bomberman.avatar.mtxLocal.translation;
                travelVector.subtract(this.mtxLocal.translation);
                if (travelVector.x < 0) {
                    this.walkEnemies(Bomberman.WALK.LEFT);
                }
                if (travelVector.x > 0) {
                    this.walkEnemies(Bomberman.WALK.RIGHT);
                }
                if (travelVector.y < 0) {
                    this.walkEnemies(Bomberman.WALK.DOWN);
                }
                if (travelVector.y > 0) {
                    this.walkEnemies(Bomberman.WALK.UP);
                }
                fc.Time.game.setTimer(1000, 1, this.findPlayer);
            };
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            this.sprite = new fcAid.NodeSprite("EnemySprite");
            this.sprite.addComponent(new fc.ComponentTransform());
            this.sprite.mtxLocal.translateY(-0.25);
            this.sprite.mtxLocal.translateZ(0.001);
            this.appendChild(this.sprite);
            this.sprite.setAnimation(Enemy.animations["WALK_DOWN"]);
            this.sprite.showFrame(0);
            this.sprite.setFrameDirection(1);
            this.sprite.framerate = 6;
            fc.Time.game.setTimer(1000, 1, this.findPlayer);
        }
        static generateSprites(_spritesheet) {
            Enemy.animations = {};
            for (let i = 0; i < 4; i++) {
                let name = "WALK_" + Bomberman.WALK[i];
                let sprite = new fcAid.SpriteSheetAnimation(name, _spritesheet);
                sprite.generateByGrid(fc.Rectangle.GET(0, i * 64, 64, 64), 6, 82, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(64));
                Enemy.animations[name] = sprite;
            }
        }
        update() {
            this.checkEnemyDanger();
        }
        checkEnemyCollision() {
            for (let wall of Bomberman.wallsNode.getChildren()) {
                if (Bomberman.enemies.checkCollision(wall)) {
                    Bomberman.enemies.mtxLocal.translation = this.tempPos;
                }
            }
            for (let wall of Bomberman.explodableBlockNode.getChildren()) {
                if (Bomberman.enemies.checkCollision(wall)) {
                    Bomberman.enemies.mtxLocal.translation = this.tempPos;
                }
            }
            for (let bomb of Bomberman.levelRoot.getChildrenByName("Bomb")) {
                if (Bomberman.enemies.checkCollision(bomb)) {
                    Bomberman.enemies.mtxLocal.translation = this.tempPos;
                }
            }
            for (let avatar of Bomberman.root.getChildrenByName("Bomberman")) {
                if (Bomberman.enemies.checkCollision(avatar)) {
                    Bomberman.enemies.mtxLocal.translation = this.tempPos;
                }
            }
            for (let portal of Bomberman.levelRoot.getChildrenByName("Portal")) {
                if (Bomberman.enemies.checkCollision(portal)) {
                    let portals = new Bomberman.Portal(new fc.Vector2(0, 0), -1);
                    portals.teleportPortal(portal);
                }
            }
        }
        checkEnemyDanger() {
            let _position = this.mtxLocal.translation;
            let positionX;
            let positionY;
            for (let i = 1; i <= Bomberman.flameDistance; i++) {
                positionX = new fc.Vector2(_position.x + i, _position.y);
                if (this.checkWalls(positionX) == true) {
                    break;
                }
                if (this.checkBombs(positionX) == true) {
                    console.log("Gefahr");
                    this.walkEnemies(Bomberman.WALK.LEFT);
                }
                if (this.detectPlayer(positionX) == true) {
                    this.bombPlayer();
                }
            }
            for (let i = 1; i <= Bomberman.flameDistance; i++) {
                positionY = new fc.Vector2(_position.x, _position.y + i);
                if (this.checkWalls(positionY) == true) {
                    break;
                }
                if (this.checkBombs(positionY) == true) {
                    console.log("Gefahr");
                    this.walkEnemies(Bomberman.WALK.DOWN);
                }
                if (this.detectPlayer(positionX) == true) {
                    this.bombPlayer();
                }
            }
            for (let i = -1; i >= -Bomberman.flameDistance; i--) {
                positionX = new fc.Vector2(_position.x + i, _position.y);
                if (this.checkWalls(positionX) == true) {
                    break;
                }
                if (this.checkBombs(positionX) == true) {
                    console.log("Gefahr");
                    this.walkEnemies(Bomberman.WALK.RIGHT);
                }
                if (this.detectPlayer(positionX) == true) {
                    this.bombPlayer();
                }
            }
            for (let i = -1; i >= -Bomberman.flameDistance; i--) {
                positionY = new fc.Vector2(_position.x, _position.y + i);
                if (this.checkWalls(positionY) == true) {
                    break;
                }
                if (this.checkBombs(positionY) == true) {
                    console.log("Gefahr");
                    this.walkEnemies(Bomberman.WALK.UP);
                }
                if (this.detectPlayer(positionX) == true) {
                    this.bombPlayer();
                }
            }
        }
        checkWalls(_position) {
            for (let wall of Bomberman.wallsNode.getChildren()) {
                if (_position.equals(wall.mtxLocal.translation.toVector2())) {
                    return true;
                }
            }
            for (let explodableBlock of Bomberman.explodableBlockNode.getChildren()) {
                if (_position.equals(explodableBlock.mtxLocal.translation.toVector2())) {
                    return true;
                }
            }
            return false;
        }
        checkBombs(_position) {
            for (let bomb of Bomberman.levelRoot.getChildrenByName("Bomb")) {
                if (_position.equals(bomb.mtxLocal.translation.toVector2())) {
                    return true;
                }
            }
            for (let bomb of Bomberman.levelRoot.getChildrenByName("Flames")) {
                if (_position.equals(bomb.mtxLocal.translation.toVector2())) {
                    return true;
                }
            }
            return false;
        }
        walkEnemies(_job) {
            this.job = _job;
            this.tempPos = Bomberman.enemies.mtxLocal.translation;
            switch (this.job) {
                case Bomberman.WALK.UP:
                    Bomberman.enemies.sprite.setAnimation(Enemy.animations["WALK_UP"]);
                    Bomberman.enemies.mtxLocal.translateY(1);
                    break;
                case Bomberman.WALK.RIGHT:
                    Bomberman.enemies.sprite.setAnimation(Enemy.animations["WALK_RIGHT"]);
                    Bomberman.enemies.mtxLocal.translateX(1);
                    break;
                case Bomberman.WALK.DOWN:
                    Bomberman.enemies.sprite.setAnimation(Enemy.animations["WALK_DOWN"]);
                    Bomberman.enemies.mtxLocal.translateY(-1);
                    break;
                case Bomberman.WALK.LEFT:
                    Bomberman.enemies.sprite.setAnimation(Enemy.animations["WALK_LEFT"]);
                    Bomberman.enemies.mtxLocal.translateX(-1);
                    break;
            }
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            this.checkEnemyCollision();
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
        }
        detectPlayer(_position) {
            if (_position.equals(Bomberman.avatar.mtxLocal.translation.toVector2())) {
                return true;
            }
            return false;
        }
        bombPlayer() {
            console.log("ENTDECKT!");
            if (Bomberman.countBombsEnemy < Bomberman.maxBombEnemy) {
                Bomberman.levelRoot.appendChild(new Bomberman.Bomb(fc.Vector2.ONE(1), new fc.Vector2(this.mtxLocal.translation.x, this.mtxLocal.translation.y)));
                Bomberman.countBombsEnemy++;
            }
        }
    }
    Bomberman.Enemy = Enemy;
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var fc = FudgeCore;
    class ExplodableBlock extends Bomberman.GameObject {
        constructor(_size, _position) {
            super("ExplodableBlock", _size, _position);
            let txtWall = new fc.TextureImage("Assets/tiles/ExplodableBlock.png");
            let mtrWall = new fc.Material("ExplodableBlockMaterial", fc.ShaderTexture, new fc.CoatTextured(Bomberman.clrWhite, txtWall));
            let cmpMaterial = new fc.ComponentMaterial(mtrWall);
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            this.addComponent(cmpMaterial);
        }
    }
    Bomberman.ExplodableBlock = ExplodableBlock;
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var fc = FudgeCore;
    var fcAid = FudgeAid;
    let cmpAudio;
    let soundHit = new fc.Audio("Assets/sounds/hit.wav");
    Bomberman.flameDistance = 2;
    class Flames extends Bomberman.GameObject {
        constructor(_position) {
            super("Flames", new fc.Vector2(0.8, 0.8), _position);
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            this.sprite = new fcAid.NodeSprite("FlamesSprite");
            this.sprite.addComponent(new fc.ComponentTransform());
            this.sprite.mtxLocal.translateZ(0.0001);
            this.appendChild(this.sprite);
            this.sprite.setAnimation(Flames.animations["FLAMES"]);
            this.sprite.showFrame(0);
            this.sprite.setFrameDirection(1);
            this.sprite.framerate = 6;
            //console.log(_position.toVector3());
            //this.placeFlames(_position.toVector3());
            //fc.Time.game.setTimer(1000, 1, this.placeFlames(this.mtxLocal.translate).bind(this));
        }
        static generateSprites(_spritesheet) {
            Flames.animations = {};
            let name = "FLAMES";
            let sprite = new fcAid.SpriteSheetAnimation(name, _spritesheet);
            sprite.generateByGrid(fc.Rectangle.GET(0, 0, 48, 48), 5, 82, fc.ORIGIN2D.CENTER, fc.Vector2.X(48));
            Flames.animations[name] = sprite;
        }
        placeFlames(_position) {
            let positionX;
            let positionY;
            Bomberman.levelRoot.appendChild(new Flames(new fc.Vector2(_position.x, _position.y)));
            for (let i = 1; i <= Bomberman.flameDistance; i++) {
                positionX = new fc.Vector2(_position.x + i, _position.y);
                Bomberman.levelRoot.appendChild(new Flames(positionX));
                if (this.checkFlameCollision(positionX) == true) {
                    break;
                }
            }
            for (let i = 1; i <= Bomberman.flameDistance; i++) {
                positionY = new fc.Vector2(_position.x, _position.y + i);
                Bomberman.levelRoot.appendChild(new Flames(positionY));
                if (this.checkFlameCollision(positionY) == true) {
                    break;
                }
            }
            for (let i = -1; i >= -Bomberman.flameDistance; i--) {
                positionX = new fc.Vector2(_position.x + i, _position.y);
                Bomberman.levelRoot.appendChild(new Flames(positionX));
                if (this.checkFlameCollision(positionX) == true) {
                    break;
                }
            }
            for (let i = -1; i >= -Bomberman.flameDistance; i--) {
                positionY = new fc.Vector2(_position.x, _position.y + i);
                Bomberman.levelRoot.appendChild(new Flames(positionY));
                if (this.checkFlameCollision(positionY) == true) {
                    break;
                }
            }
            this.lowerLife();
        }
        circleBombFlames(_position) {
            for (let i = -Bomberman.flameDistance; i <= Bomberman.flameDistance; i++) {
                for (let j = -Bomberman.flameDistance; j <= Bomberman.flameDistance; j++) {
                    let positionCircle = new fc.Vector2(_position.x + i, _position.y + j);
                    Bomberman.levelRoot.appendChild(new Flames(positionCircle));
                    this.checkFlameCollision(positionCircle);
                }
            }
            this.lowerLife();
            Bomberman.circleBomb = false;
        }
        diagonalBombFlames(_position) {
            for (let i = -Bomberman.flameDistance; i <= Bomberman.flameDistance; i++) {
                let positionDiagonal = new fc.Vector2(_position.x + i, _position.y + i);
                let positionDiagonal2 = new fc.Vector2(_position.x + i, _position.y - i);
                Bomberman.levelRoot.appendChild(new Flames(positionDiagonal));
                Bomberman.levelRoot.appendChild(new Flames(positionDiagonal2));
                this.checkFlameCollision(positionDiagonal);
                this.checkFlameCollision(positionDiagonal2);
            }
            this.lowerLife();
            Bomberman.diagonalBomb = false;
        }
        lowerLife() {
            cmpAudio = new fc.ComponentAudio(soundHit, false, false);
            cmpAudio.connect(true);
            cmpAudio.volume = 0.08;
            cmpAudio.setAudio(soundHit);
            for (let flames of Bomberman.levelRoot.getChildrenByName("Flames")) {
                fc.Time.game.setTimer(3000, 1, this.removeFlames.bind(flames));
                if (Bomberman.avatar.checkCollision(flames)) {
                    cmpAudio.play(true);
                    console.log("MINUS LEBEN" + Bomberman.avatar.mtxLocal.translation);
                    Bomberman.gameState.bottomLeft--;
                }
            }
            /*       for (let flames of levelRoot.getChildrenByName("Flames")) {
                    if (enemies.checkCollision(<GameObject>flames)) {
                      console.log("MINUS LEBEN FÜR BÖSE MANN");
                      gameState.topRight--;
                    }
                  } */
        }
        checkFlameCollision(_position) {
            for (let flames of Bomberman.levelRoot.getChildrenByName("Flames")) {
                for (let wall of Bomberman.wallsNode.getChildren()) {
                    if (flames.checkCollision(wall)) {
                        Bomberman.levelRoot.removeChild(flames);
                        return true;
                    }
                }
            }
            for (let flames of Bomberman.levelRoot.getChildrenByName("Flames")) {
                for (let explodableBlock of Bomberman.explodableBlockNode.getChildren()) {
                    if (flames.checkCollision(explodableBlock)) {
                        Bomberman.explodableBlockNode.removeChild(explodableBlock);
                        return true;
                    }
                }
            }
            return false;
        }
        removeFlames() {
            Bomberman.levelRoot.removeChild(this);
        }
    }
    Bomberman.Flames = Flames;
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var fc = FudgeCore;
    class Floor extends Bomberman.GameObject {
        constructor(_size, _position) {
            super("Floor", _size, _position);
            let txtFloor = new fc.TextureImage("Assets/tiles/BackgroundTile.png");
            let mtrFloor = new fc.Material("Floor", fc.ShaderTexture, new fc.CoatTextured(Bomberman.clrWhite, txtFloor));
            let cmpMaterial = new fc.ComponentMaterial(mtrFloor);
            this.mtxLocal.translation = new fc.Vector3(_position.x + _size.x / 2 - 0.5, _position.y + _size.y / 2 - 0.5, -0.000001);
            cmpMaterial.pivot.scale(new fc.Vector2(_size.x / 1, _size.y / 1));
            this.addComponent(cmpMaterial);
        }
    }
    Bomberman.Floor = Floor;
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var fui = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        constructor() {
            super(...arguments);
            this.topLeft = 3;
            this.topRight = 3;
            this.bottomLeft = 3;
            this.bottomRight = 3;
        }
        //public time: String = "00:00";
        reduceMutator(_mutator) { }
    }
    Bomberman.GameState = GameState;
    Bomberman.gameState = new GameState();
    class Hud {
        static start() {
            let domHud = document.querySelector("div#hud");
            this.loop();
            Hud.controller = new fui.Controller(Bomberman.gameState, domHud);
            Hud.controller.updateUserInterface();
        }
        static loop() {
            let time = document.querySelector("[key=time]");
            let date = new Date(ƒ.Time.game.get());
            time.value =
                String(date.getMinutes()).padStart(2, "0") + ":" +
                    String(date.getSeconds()).padStart(2, "0");
            window.requestAnimationFrame(Hud.loop);
        }
    }
    Bomberman.Hud = Hud;
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var fc = FudgeCore;
    var fcAid = FudgeAid;
    let ITEM;
    (function (ITEM) {
        ITEM[ITEM["BOMB_PLUS"] = 0] = "BOMB_PLUS";
        ITEM[ITEM["FLAME_PLUS"] = 1] = "FLAME_PLUS";
        ITEM[ITEM["BOMB_CIRCLE"] = 2] = "BOMB_CIRCLE";
        ITEM[ITEM["BOMB_DIAGONAL"] = 3] = "BOMB_DIAGONAL";
        ITEM[ITEM["LIFE_INVINCIBILITY"] = 4] = "LIFE_INVINCIBILITY";
        ITEM[ITEM["LIFE_PLUS"] = 5] = "LIFE_PLUS";
    })(ITEM = Bomberman.ITEM || (Bomberman.ITEM = {}));
    class Items extends Bomberman.GameObject {
        constructor(_name, _position) {
            super(_name, new fc.Vector2(0.8, 0.8), _position);
            this.sprite = new fcAid.NodeSprite("ItemSprite");
            this.sprite.addComponent(new fc.ComponentTransform());
            this.sprite.mtxLocal.translateY(-0.25);
            this.sprite.mtxLocal.translateZ(0.0001);
            this.appendChild(this.sprite);
            this.sprite.setAnimation(Items.animations[_name]);
            this.sprite.showFrame(0);
            this.sprite.setFrameDirection(1);
            this.sprite.framerate = 6;
            if (_name == "BOMB_PLUS") {
                this.job = ITEM.BOMB_PLUS;
            }
            else if (_name == "FLAME_PLUS") {
                this.job = ITEM.FLAME_PLUS;
            }
            else if (_name == "BOMB_CIRCLE") {
                this.job = ITEM.BOMB_CIRCLE;
            }
            else if (_name == "BOMB_DIAGONAL") {
                this.job = ITEM.BOMB_DIAGONAL;
            }
            else if (_name == "LIFE_INVINCIBILITY") {
                this.job = ITEM.LIFE_INVINCIBILITY;
            }
            else if (_name == "LIFE_PLUS") {
                this.job = ITEM.LIFE_PLUS;
            }
        }
        static generateSprites(_spritesheet) {
            Items.animations = {};
            let name = "BOMB_PLUS";
            let sprite = new fcAid.SpriteSheetAnimation(name, _spritesheet);
            sprite.generateByGrid(fc.Rectangle.GET(0, 0, 32, 32), 1, 82, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(0));
            Items.animations[name] = sprite;
            let name2 = "FLAME_PLUS";
            let sprite2 = new fcAid.SpriteSheetAnimation(name2, _spritesheet);
            sprite2.generateByGrid(fc.Rectangle.GET(32, 0, 32, 32), 1, 82, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(0));
            Items.animations[name2] = sprite2;
            let name3 = "BOMB_CIRCLE";
            let sprite3 = new fcAid.SpriteSheetAnimation(name3, _spritesheet);
            sprite3.generateByGrid(fc.Rectangle.GET(64, 0, 32, 32), 1, 82, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(0));
            Items.animations[name3] = sprite3;
            let name4 = "BOMB_DIAGONAL";
            let sprite4 = new fcAid.SpriteSheetAnimation(name4, _spritesheet);
            sprite4.generateByGrid(fc.Rectangle.GET(96, 0, 32, 32), 1, 82, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(0));
            Items.animations[name4] = sprite4;
            let name5 = "LIFE_INVINCIBILITY";
            let sprite5 = new fcAid.SpriteSheetAnimation(name5, _spritesheet);
            sprite5.generateByGrid(fc.Rectangle.GET(128, 0, 32, 32), 1, 82, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(0));
            Items.animations[name5] = sprite5;
            let name6 = "LIFE_PLUS";
            let sprite6 = new fcAid.SpriteSheetAnimation(name6, _spritesheet);
            sprite6.generateByGrid(fc.Rectangle.GET(160, 0, 32, 32), 1, 82, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(0));
            Items.animations[name6] = sprite6;
        }
        itemChanger() {
            switch (this.job) {
                case ITEM.BOMB_PLUS:
                    Bomberman.maxBomb++;
                    break;
                case ITEM.FLAME_PLUS:
                    Bomberman.flameDistance++;
                    break;
                case ITEM.BOMB_CIRCLE:
                    Bomberman.circleBomb = true;
                    break;
                case ITEM.BOMB_DIAGONAL:
                    Bomberman.diagonalBomb = true;
                    break;
                case ITEM.LIFE_INVINCIBILITY:
                    console.log("UNSTERBLICH");
                    break;
                case ITEM.LIFE_PLUS:
                    break;
            }
        }
    }
    Bomberman.Items = Items;
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var fc = FudgeCore;
    class LevelBuilder {
        constructor() {
            this.rootNumber = 0;
        }
        createLevel() {
            this.createFloor();
            this.createBorder();
            this.createBlocks();
            return new LevelBuilder();
        }
        createFloor() {
            Bomberman.floorNode.appendChild(new Bomberman.Floor(Bomberman.arenaSize, fc.Vector2.ZERO()));
        }
        createBorder() {
            for (let i = 0; i < Bomberman.arenaSize.x; i++) {
                Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(this.rootNumber + i, this.rootNumber)));
            }
            for (let i = 0; i < Bomberman.arenaSize.y; i++) {
                Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(this.rootNumber, this.rootNumber + i)));
            }
            for (let i = 0; i < Bomberman.arenaSize.x; i++) {
                Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(this.rootNumber + i, Bomberman.arenaSize.y - 1)));
            }
            for (let i = 0; i < Bomberman.arenaSize.y; i++) {
                Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(Bomberman.arenaSize.x - 1, this.rootNumber + i)));
            }
        }
        createBlocks() {
            for (let i = 0; i < Bomberman.arenaSize.x - 1; i = i + 2) {
                for (let j = 0; j < Bomberman.arenaSize.y - 1; j = j + 2) {
                    Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(2 + i, 2 + j)));
                }
            }
            for (let i = 0; i < Bomberman.arenaSize.y - 1; i = i + 2) {
                for (let j = 0; j < Bomberman.arenaSize.x - 1; j = j + 2) {
                    Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(2 + j, 1 + i)));
                }
            }
            Bomberman.levelRoot.appendChild(new Bomberman.Portal(new fc.Vector2(1, 7), 0));
            Bomberman.levelRoot.appendChild(new Bomberman.Portal(new fc.Vector2(7, 1), 1));
            Bomberman.levelRoot.appendChild(new Bomberman.Portal(new fc.Vector2(9, 1), 2));
            Bomberman.levelRoot.appendChild(new Bomberman.Items("BOMB_PLUS", new fc.Vector2(3, 7)));
            Bomberman.levelRoot.appendChild(new Bomberman.Items("FLAME_PLUS", new fc.Vector2(5, 7)));
            Bomberman.levelRoot.appendChild(new Bomberman.Items("BOMB_CIRCLE", new fc.Vector2(7, 7)));
            Bomberman.levelRoot.appendChild(new Bomberman.Items("BOMB_DIAGONAL", new fc.Vector2(9, 7)));
            Bomberman.levelRoot.appendChild(new Bomberman.Items("LIFE_INVINCIBILITY", new fc.Vector2(11, 7)));
            Bomberman.levelRoot.appendChild(new Bomberman.Items("LIFE_PLUS", new fc.Vector2(13, 7)));
        }
    }
    Bomberman.LevelBuilder = LevelBuilder;
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var fc = FudgeCore;
    window.addEventListener("load", hndLoad);
    Bomberman.clrWhite = fc.Color.CSS("WHITE");
    let cmpAudio;
    let backgroundTheme = new fc.Audio("Assets/sounds/theme.mp3");
    Bomberman.root = new fc.Node("Root");
    Bomberman.levelRoot = new fc.Node("LevelNode");
    Bomberman.floorNode = new fc.Node("FloorNode");
    Bomberman.wallsNode = new fc.Node("WallsNode");
    Bomberman.explodableBlockNode = new fc.Node("ExplodableBlockNode");
    Bomberman.arenaSize = new fc.Vector2(21, 9);
    async function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        cmpAudio = new fc.ComponentAudio(backgroundTheme, true, false);
        cmpAudio.connect(true);
        cmpAudio.volume = 0.2;
        cmpAudio.setAudio(backgroundTheme);
        cmpAudio.play(true);
        Bomberman.levelRoot.appendChild(Bomberman.floorNode);
        Bomberman.levelRoot.appendChild(Bomberman.wallsNode);
        Bomberman.levelRoot.appendChild(Bomberman.explodableBlockNode);
        Bomberman.root.appendChild(Bomberman.levelRoot);
        Bomberman.avatar = await hndAvatar();
        Bomberman.root.appendChild(Bomberman.avatar);
        Bomberman.enemies = await hndEnemies();
        Bomberman.root.appendChild(Bomberman.enemies);
        await hndBomb();
        await hndFlames();
        await hndPortal();
        await hndItems();
        createArena();
        let cmpCamera = new fc.ComponentCamera();
        cmpCamera.projectCentral(1, 45, fc.FIELD_OF_VIEW.DIAGONAL, 0.2, 10000);
        cmpCamera.pivot.translation = new fc.Vector3(Bomberman.arenaSize.x / 2 - 0.5, Bomberman.arenaSize.y / 2 - 0.5, 20);
        cmpCamera.pivot.rotateY(180);
        cmpCamera.backgroundColor = fc.Color.CSS("SkyBlue");
        Bomberman.viewport = new fc.Viewport();
        Bomberman.viewport.initialize("Viewport", Bomberman.root, cmpCamera, canvas);
        fc.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, hndLoop);
        fc.Loop.start(fc.LOOP_MODE.TIME_GAME, 60);
        Bomberman.Hud.start();
        canvas.addEventListener("click", canvas.requestPointerLock);
    }
    function hndLoop(_event) {
        Bomberman.enemies.update();
        Bomberman.viewport.draw();
    }
    function createArena() {
        let levelTest = new Bomberman.LevelBuilder();
        levelTest.createLevel();
    }
    async function hndAvatar() {
        let txtAvatar = new fc.TextureImage();
        txtAvatar.load("Assets/avatar/avatar_sprites.png");
        let coatSprite = new fc.CoatTextured(Bomberman.clrWhite, txtAvatar);
        Bomberman.Avatar.generateSprites(coatSprite);
        Bomberman.avatar = new Bomberman.Avatar(new fc.Vector2(1, 1));
        return Bomberman.avatar;
    }
    async function hndEnemies() {
        let txtEnemy = new fc.TextureImage();
        txtEnemy.load("Assets/enemies/enemy_sprites.png");
        let coatSprite = new fc.CoatTextured(Bomberman.clrWhite, txtEnemy);
        Bomberman.Enemy.generateSprites(coatSprite);
        Bomberman.enemies = new Bomberman.Enemy(new fc.Vector2(Bomberman.arenaSize.x - 2, Bomberman.arenaSize.y - 2));
        //enemies = new Enemy(new fc.Vector2(3, 5));
        return Bomberman.enemies;
    }
    async function hndBomb() {
        let txtBomb = new fc.TextureImage();
        txtBomb.load("Assets/items/bomb_sprites.png");
        let coatSprite = new fc.CoatTextured(Bomberman.clrWhite, txtBomb);
        let txtBombExplode = new fc.TextureImage();
        txtBombExplode.load("Assets/items/bomb_explode.png");
        let coatSprite2 = new fc.CoatTextured(Bomberman.clrWhite, txtBombExplode);
        Bomberman.Bomb.generateSprites(coatSprite, coatSprite2);
    }
    async function hndFlames() {
        let txtFlames = new fc.TextureImage();
        txtFlames.load("Assets/items/flames_sprites.png");
        let coatSprite = new fc.CoatTextured(Bomberman.clrWhite, txtFlames);
        Bomberman.Flames.generateSprites(coatSprite);
    }
    async function hndPortal() {
        let txtTeleport = new fc.TextureImage();
        txtTeleport.load("Assets/tiles/portal_sprites.png");
        let coatSprite = new fc.CoatTextured(Bomberman.clrWhite, txtTeleport);
        Bomberman.Portal.generateSprites(coatSprite);
    }
    async function hndItems() {
        let txtItems = new fc.TextureImage();
        txtItems.load("Assets/items/items_sprites.png");
        let coatSprite = new fc.CoatTextured(Bomberman.clrWhite, txtItems);
        Bomberman.Items.generateSprites(coatSprite);
    }
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var fc = FudgeCore;
    var fcAid = FudgeAid;
    let cmpAudio;
    let soundTeleport = new fc.Audio("Assets/sounds/teleport.wav");
    let portalArray = [];
    class Portal extends Bomberman.GameObject {
        constructor(_position, portalID) {
            super("Portal", new fc.Vector2(0.8, 0.8), _position);
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            this.sprite = new fcAid.NodeSprite("PortalSprite");
            this.sprite.addComponent(new fc.ComponentTransform());
            //this.sprite.mtxLocal.translateZ(0.0001);
            this.appendChild(this.sprite);
            this.sprite.setAnimation(Portal.animations["PORTAL"]);
            this.sprite.showFrame(0);
            this.sprite.setFrameDirection(1);
            this.sprite.framerate = 8;
            portalArray[portalID] = _position;
        }
        static generateSprites(_spritesheet) {
            Portal.animations = {};
            let name = "PORTAL";
            let sprite = new fcAid.SpriteSheetAnimation(name, _spritesheet);
            sprite.generateByGrid(fc.Rectangle.GET(960, 0, 64, 64), 1, 82, fc.ORIGIN2D.CENTER, fc.Vector2.X(64));
            Portal.animations[name] = sprite;
            let name2 = "TELEPORT";
            let sprite2 = new fcAid.SpriteSheetAnimation(name2, _spritesheet);
            sprite2.generateByGrid(fc.Rectangle.GET(0, 0, 64, 64), 18, 82, fc.ORIGIN2D.CENTER, fc.Vector2.X(64));
            Portal.animations[name2] = sprite2;
        }
        teleportPortal(_portals) {
            cmpAudio = new fc.ComponentAudio(soundTeleport, false, false);
            cmpAudio.connect(true);
            cmpAudio.volume = 0.05;
            cmpAudio.setAudio(soundTeleport);
            cmpAudio.play(true);
            _portals.sprite.setAnimation(Portal.animations["TELEPORT"]);
            fc.Time.game.setTimer(1000, 1, this.stopAnimation.bind(_portals));
            let avatarPos = Bomberman.avatar.mtxLocal.translation;
            let enemyPos = Bomberman.enemies.mtxLocal.translation;
            for (let i = 0; i <= portalArray.length - 1; i++) {
                if (avatarPos.equals(portalArray[i].toVector3())) {
                    if (i == portalArray.length - 1) {
                        Bomberman.avatar.mtxLocal.translation = portalArray[0].toVector3();
                    }
                    else {
                        Bomberman.avatar.mtxLocal.translation = portalArray[i + 1].toVector3();
                    }
                }
            }
            for (let i = 0; i <= portalArray.length - 1; i++) {
                if (enemyPos.equals(portalArray[i].toVector3())) {
                    if (i == portalArray.length - 1) {
                        Bomberman.enemies.mtxLocal.translation = portalArray[0].toVector3();
                    }
                    else {
                        Bomberman.enemies.mtxLocal.translation = portalArray[i + 1].toVector3();
                    }
                }
            }
        }
        stopAnimation() {
            this.sprite.setAnimation(Portal.animations["PORTAL"]);
        }
    }
    Bomberman.Portal = Portal;
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var fc = FudgeCore;
    class Wall extends Bomberman.GameObject {
        constructor(_size, _position) {
            super("Wall", _size, _position);
            let txtWall = new fc.TextureImage;
            txtWall.load("Assets/tiles/SolidBlock.png");
            let mtrWall = new fc.Material("BorderWall", fc.ShaderTexture, new fc.CoatTextured(Bomberman.clrWhite, txtWall));
            let cmpMaterial = new fc.ComponentMaterial(mtrWall);
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            //this.mtxLocal.translation = new fc.Vector3(_position.x + _size.x / 2, _position.y + _size.y / 2, 0);
            //cmpMaterial.pivot.scale(new fc.Vector2(_size.x / 1, _size.y / 1));
            this.addComponent(cmpMaterial);
        }
    }
    Bomberman.Wall = Wall;
})(Bomberman || (Bomberman = {}));
//# sourceMappingURL=Bomberman.js.map