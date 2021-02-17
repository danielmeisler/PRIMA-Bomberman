"use strict";
var Bomberman;
(function (Bomberman) {
    var fc = FudgeCore;
    Bomberman.countBombs = 0;
    Bomberman.countBombsEnemy = 0;
    Bomberman.countBombsEnemy2 = 0;
    Bomberman.countBombsEnemy3 = 0;
    Bomberman.maxBomb = 1;
    Bomberman.maxBombEnemy = 1;
    Bomberman.maxBombEnemy2 = 1;
    Bomberman.maxBombEnemy3 = 1;
    Bomberman.circleBomb = false;
    Bomberman.diagonalBomb = false;
    Bomberman.lifeInvincibility = false;
    Bomberman.lifeLimiter = false;
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
    let soundWalk = new fc.Audio(".../Assets/sounds/walk.wav");
    let soundItems = new fc.Audio(".../Assets/sounds/items.mp3");
    class Avatar extends Bomberman.GameObject {
        constructor(_position) {
            super("Bomberman", new fc.Vector2(0.8, 0.8), _position);
            this.job = Bomberman.WALK.DOWN;
            this.setInvinciblity = () => {
                document.getElementById("hud_bottomLeftInput").style.color = "WHITE";
                Bomberman.lifeInvincibility = false;
            };
            this.setLifeLimiter = () => {
                Bomberman.lifeLimiter = false;
            };
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
                if (Bomberman.gameState.bottomLeft > 0) {
                    if (Bomberman.countBombs < Bomberman.maxBomb) {
                        Bomberman.levelRoot.appendChild(new Bomberman.Bomb(fc.Vector2.ONE(1), new fc.Vector2(Bomberman.avatar.mtxLocal.translation.x, Bomberman.avatar.mtxLocal.translation.y), 0));
                        Bomberman.countBombs++;
                    }
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
                    console.log(Bomberman.lifeLimiter);
                    if (Bomberman.lifeLimiter == false) {
                        if (Bomberman.lifeInvincibility == false) {
                            Bomberman.gameState.bottomLeft--;
                            Bomberman.hndDeaths();
                            Bomberman.lifeLimiter = true;
                            fc.Time.game.setTimer(3000, 1, Bomberman.avatar.setLifeLimiter);
                        }
                    }
                }
            }
            for (let enemies of Bomberman.root.getChildrenByName("Enemies")) {
                if (Bomberman.avatar.checkCollision(enemies)) {
                    Bomberman.avatar.mtxLocal.translation = this.tempPos;
                }
            }
            for (let enemies of Bomberman.root.getChildrenByName("Enemies2")) {
                if (Bomberman.avatar.checkCollision(enemies)) {
                    Bomberman.avatar.mtxLocal.translation = this.tempPos;
                }
            }
            for (let enemies of Bomberman.root.getChildrenByName("Enemies3")) {
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
                    Bomberman.avatar.setShield();
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
        checkPlayerDeath() {
            if (Bomberman.gameState.bottomLeft <= 0) {
                Bomberman.root.removeChild(Bomberman.avatar);
            }
        }
        setShield() {
            document.getElementById("hud_bottomLeftInput").style.color = "BLACK";
            fc.Time.game.setTimer(10000, 1, Bomberman.avatar.setInvinciblity);
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
    let soundBomb = new fc.Audio(".../Assets/sounds/explosion.wav");
    class Bomb extends Bomberman.GameObject {
        constructor(_size, _position, _source) {
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
            };
            this.explodeBombEnemy = () => {
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
                fc.Time.game.setTimer(1000, 1, this.removeBombEnemy);
            };
            this.removeBombEnemy = () => {
                Bomberman.levelRoot.removeChild(this);
                Bomberman.countBombsEnemy--;
            };
            this.explodeBombEnemy2 = () => {
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
                fc.Time.game.setTimer(1000, 1, this.removeBombEnemy2);
            };
            this.removeBombEnemy2 = () => {
                Bomberman.levelRoot.removeChild(this);
                Bomberman.countBombsEnemy2--;
            };
            this.explodeBombEnemy3 = () => {
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
                fc.Time.game.setTimer(1000, 1, this.removeBombEnemy3);
            };
            this.removeBombEnemy3 = () => {
                Bomberman.levelRoot.removeChild(this);
                Bomberman.countBombsEnemy3--;
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
            if (_source == 0)
                fc.Time.game.setTimer(3000, 1, this.explodeBomb);
            if (_source == 1)
                fc.Time.game.setTimer(3000, 1, this.explodeBombEnemy);
            if (_source == 2)
                fc.Time.game.setTimer(3000, 1, this.explodeBombEnemy2);
            if (_source == 3)
                fc.Time.game.setTimer(3000, 1, this.explodeBombEnemy3);
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
    async function communicate(_url) {
        let response = await fetch(_url);
        let gameSettingsJSON = await response.json();
        Bomberman.gameSettings = gameSettingsJSON;
    }
    Bomberman.communicate = communicate;
})(Bomberman || (Bomberman = {}));
///<reference path= "GameObject.ts"/>
var Bomberman;
///<reference path= "GameObject.ts"/>
(function (Bomberman) {
    var fc = FudgeCore;
    var fcAid = FudgeAid;
    let STATE;
    (function (STATE) {
        STATE[STATE["HUNT"] = 0] = "HUNT";
        STATE[STATE["CHECK"] = 1] = "CHECK";
        STATE[STATE["FLEE"] = 2] = "FLEE";
    })(STATE = Bomberman.STATE || (Bomberman.STATE = {}));
    class Enemy extends Bomberman.GameObject {
        constructor(_position) {
            super("Enemies", new fc.Vector2(0.8, 0.8), _position);
            this.state = STATE.HUNT;
            this.job = Bomberman.WALK.DOWN;
            this.findPlayer = () => {
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
                if (this.state == STATE.HUNT) {
                    fc.Time.game.setTimer(1000, 1, this.findPlayer);
                }
            };
            this.setHunt = () => {
                this.changeState(STATE.HUNT);
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
            this.changeState(this.state);
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
            this.checkEnemyDeath();
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
            for (let flames of Bomberman.levelRoot.getChildrenByName("Flames")) {
                if (Bomberman.enemies.checkCollision(flames)) {
                    Bomberman.enemies.mtxLocal.translation = this.tempPos;
                }
            }
            for (let avatar of Bomberman.root.getChildrenByName("Bomberman")) {
                if (Bomberman.enemies.checkCollision(avatar)) {
                    Bomberman.enemies.mtxLocal.translation = this.tempPos;
                }
            }
            for (let enemies2 of Bomberman.root.getChildrenByName("Enemies2")) {
                if (Bomberman.enemies.checkCollision(enemies2)) {
                    Bomberman.enemies.mtxLocal.translation = this.tempPos;
                }
            }
            for (let enemies3 of Bomberman.root.getChildrenByName("Enemies3")) {
                if (Bomberman.enemies.checkCollision(enemies3)) {
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
            for (let bomb of Bomberman.levelRoot.getChildrenByName("Bomb")) {
                if (this.mtxLocal.translation.toVector2().equals(bomb.mtxLocal.translation.toVector2())) {
                    if (this.checkWalls(new fc.Vector2(this.mtxLocal.translation.x + 1, this.mtxLocal.translation.y)) == false) {
                        this.walkEnemies(Bomberman.WALK.RIGHT);
                    }
                    else if (this.checkWalls(new fc.Vector2(this.mtxLocal.translation.x, this.mtxLocal.translation.y - 1)) == false) {
                        this.walkEnemies(Bomberman.WALK.DOWN);
                    }
                    else if (this.checkWalls(new fc.Vector2(this.mtxLocal.translation.x - 1, this.mtxLocal.translation.y)) == false) {
                        this.walkEnemies(Bomberman.WALK.LEFT);
                    }
                    else if (this.checkWalls(new fc.Vector2(this.mtxLocal.translation.x, this.mtxLocal.translation.y + 1)) == false) {
                        this.walkEnemies(Bomberman.WALK.UP);
                    }
                }
            }
            for (let i = 1; i <= Bomberman.flameDistance; i++) {
                positionX = new fc.Vector2(_position.x + i, _position.y);
                if (this.checkWalls(positionX) == true) {
                    break;
                }
                if (this.checkBombs(positionX) == true) {
                    this.fleeBomb("left");
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
                    this.fleeBomb("down");
                }
                if (this.detectPlayer(positionY) == true) {
                    this.bombPlayer();
                }
            }
            for (let i = -1; i >= -Bomberman.flameDistance; i--) {
                positionX = new fc.Vector2(_position.x + i, _position.y);
                if (this.checkWalls(positionX) == true) {
                    break;
                }
                if (this.checkBombs(positionX) == true) {
                    this.fleeBomb("right");
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
                    this.fleeBomb("up");
                }
                if (this.detectPlayer(positionY) == true) {
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
        changeState(_state) {
            this.state = _state;
            switch (this.state) {
                case STATE.HUNT:
                    fc.Time.game.setTimer(1000, 1, this.findPlayer);
                    break;
                case STATE.CHECK:
                    break;
                case STATE.FLEE:
                    break;
            }
        }
        detectPlayer(_position) {
            if (_position.equals(Bomberman.avatar.mtxLocal.translation.toVector2())) {
                return true;
            }
            return false;
        }
        bombPlayer() {
            if (Bomberman.gameState.topLeft > 0) {
                if (Bomberman.countBombsEnemy < Bomberman.maxBombEnemy) {
                    Bomberman.levelRoot.appendChild(new Bomberman.Bomb(fc.Vector2.ONE(1), new fc.Vector2(this.mtxLocal.translation.x, this.mtxLocal.translation.y), 1));
                    Bomberman.countBombsEnemy++;
                    this.state = STATE.FLEE;
                    this.changeState(STATE.FLEE);
                    fc.Time.game.setTimer(6000, 1, this.setHunt);
                }
            }
        }
        fleeBomb(_direction) {
            if (_direction == "up") {
                if (this.checkWalls(new fc.Vector2(Bomberman.enemies.mtxLocal.translation.x + 1, Bomberman.enemies.mtxLocal.translation.y)) == false) {
                    this.walkEnemies(Bomberman.WALK.RIGHT);
                }
                else if (this.checkWalls(new fc.Vector2(Bomberman.enemies.mtxLocal.translation.x - 1, Bomberman.enemies.mtxLocal.translation.y)) == false) {
                    this.walkEnemies(Bomberman.WALK.LEFT);
                }
                else {
                    this.walkEnemies(Bomberman.WALK.UP);
                }
            }
            if (_direction == "right") {
                if (this.checkWalls(new fc.Vector2(Bomberman.enemies.mtxLocal.translation.x, Bomberman.enemies.mtxLocal.translation.y + 1)) == false) {
                    this.walkEnemies(Bomberman.WALK.UP);
                }
                else if (this.checkWalls(new fc.Vector2(Bomberman.enemies.mtxLocal.translation.x, Bomberman.enemies.mtxLocal.translation.y - 1)) == false) {
                    this.walkEnemies(Bomberman.WALK.DOWN);
                }
                else {
                    this.walkEnemies(Bomberman.WALK.RIGHT);
                }
            }
            if (_direction == "down") {
                if (this.checkWalls(new fc.Vector2(Bomberman.enemies.mtxLocal.translation.x + 1, Bomberman.enemies.mtxLocal.translation.y)) == false) {
                    this.walkEnemies(Bomberman.WALK.RIGHT);
                }
                else if (this.checkWalls(new fc.Vector2(Bomberman.enemies.mtxLocal.translation.x - 1, Bomberman.enemies.mtxLocal.translation.y)) == false) {
                    this.walkEnemies(Bomberman.WALK.LEFT);
                }
                else {
                    this.walkEnemies(Bomberman.WALK.DOWN);
                }
            }
            if (_direction == "left") {
                if (this.checkWalls(new fc.Vector2(Bomberman.enemies.mtxLocal.translation.x, Bomberman.enemies.mtxLocal.translation.y + 1)) == false) {
                    this.walkEnemies(Bomberman.WALK.UP);
                }
                else if (this.checkWalls(new fc.Vector2(Bomberman.enemies.mtxLocal.translation.x, Bomberman.enemies.mtxLocal.translation.y - 1)) == false) {
                    this.walkEnemies(Bomberman.WALK.DOWN);
                }
                else {
                    this.walkEnemies(Bomberman.WALK.LEFT);
                }
            }
        }
        checkEnemyDeath() {
            if (Bomberman.gameState.topLeft <= 0) {
                Bomberman.root.removeChild(Bomberman.enemies);
                Bomberman.enemies.removeAllChildren();
            }
        }
    }
    Bomberman.Enemy = Enemy;
})(Bomberman || (Bomberman = {}));
///<reference path= "GameObject.ts"/>
var Bomberman;
///<reference path= "GameObject.ts"/>
(function (Bomberman) {
    var fc = FudgeCore;
    var fcAid = FudgeAid;
    class Enemy2 extends Bomberman.GameObject {
        constructor(_position) {
            super("Enemies2", new fc.Vector2(0.8, 0.8), _position);
            this.state = Bomberman.STATE.HUNT;
            this.job = Bomberman.WALK.DOWN;
            this.findPlayer = () => {
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
                if (this.state == Bomberman.STATE.HUNT) {
                    fc.Time.game.setTimer(1000, 1, this.findPlayer);
                }
            };
            this.setHunt = () => {
                this.changeState(Bomberman.STATE.HUNT);
            };
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            this.sprite = new fcAid.NodeSprite("EnemySprite2");
            this.sprite.addComponent(new fc.ComponentTransform());
            this.sprite.mtxLocal.translateY(-0.25);
            this.sprite.mtxLocal.translateZ(0.001);
            this.appendChild(this.sprite);
            this.sprite.setAnimation(Enemy2.animations["WALK_DOWN"]);
            this.sprite.showFrame(0);
            this.sprite.setFrameDirection(1);
            this.sprite.framerate = 6;
            this.changeState(this.state);
        }
        static generateSprites(_spritesheet) {
            Enemy2.animations = {};
            for (let i = 0; i < 4; i++) {
                let name = "WALK_" + Bomberman.WALK[i];
                let sprite = new fcAid.SpriteSheetAnimation(name, _spritesheet);
                sprite.generateByGrid(fc.Rectangle.GET(0, i * 64, 64, 64), 6, 82, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(64));
                Enemy2.animations[name] = sprite;
            }
        }
        update() {
            this.checkEnemyDanger();
            this.checkEnemyDeath();
        }
        checkEnemyCollision() {
            for (let wall of Bomberman.wallsNode.getChildren()) {
                if (Bomberman.enemies2.checkCollision(wall)) {
                    Bomberman.enemies2.mtxLocal.translation = this.tempPos;
                }
            }
            for (let wall of Bomberman.explodableBlockNode.getChildren()) {
                if (Bomberman.enemies2.checkCollision(wall)) {
                    Bomberman.enemies2.mtxLocal.translation = this.tempPos;
                }
            }
            for (let bomb of Bomberman.levelRoot.getChildrenByName("Bomb")) {
                if (Bomberman.enemies2.checkCollision(bomb)) {
                    Bomberman.enemies2.mtxLocal.translation = this.tempPos;
                }
            }
            for (let flames of Bomberman.levelRoot.getChildrenByName("Flames")) {
                if (Bomberman.enemies2.checkCollision(flames)) {
                    Bomberman.enemies2.mtxLocal.translation = this.tempPos;
                }
            }
            for (let avatar of Bomberman.root.getChildrenByName("Bomberman")) {
                if (Bomberman.enemies2.checkCollision(avatar)) {
                    Bomberman.enemies2.mtxLocal.translation = this.tempPos;
                }
            }
            for (let enemies of Bomberman.root.getChildrenByName("Enemies")) {
                if (Bomberman.enemies2.checkCollision(enemies)) {
                    Bomberman.enemies2.mtxLocal.translation = this.tempPos;
                }
            }
            for (let enemies3 of Bomberman.root.getChildrenByName("Enemies3")) {
                if (Bomberman.enemies2.checkCollision(enemies3)) {
                    Bomberman.enemies2.mtxLocal.translation = this.tempPos;
                }
            }
            for (let portal of Bomberman.levelRoot.getChildrenByName("Portal")) {
                if (Bomberman.enemies2.checkCollision(portal)) {
                    let portals = new Bomberman.Portal(new fc.Vector2(0, 0), -1);
                    portals.teleportPortal(portal);
                }
            }
        }
        checkEnemyDanger() {
            let _position = this.mtxLocal.translation;
            let positionX;
            let positionY;
            for (let bomb of Bomberman.levelRoot.getChildrenByName("Bomb")) {
                if (this.mtxLocal.translation.toVector2().equals(bomb.mtxLocal.translation.toVector2())) {
                    if (this.checkWalls(new fc.Vector2(this.mtxLocal.translation.x + 1, this.mtxLocal.translation.y)) == false) {
                        this.walkEnemies(Bomberman.WALK.RIGHT);
                    }
                    else if (this.checkWalls(new fc.Vector2(this.mtxLocal.translation.x, this.mtxLocal.translation.y - 1)) == false) {
                        this.walkEnemies(Bomberman.WALK.DOWN);
                    }
                    else if (this.checkWalls(new fc.Vector2(this.mtxLocal.translation.x - 1, this.mtxLocal.translation.y)) == false) {
                        this.walkEnemies(Bomberman.WALK.LEFT);
                    }
                    else if (this.checkWalls(new fc.Vector2(this.mtxLocal.translation.x, this.mtxLocal.translation.y + 1)) == false) {
                        this.walkEnemies(Bomberman.WALK.UP);
                    }
                }
            }
            for (let i = 1; i <= Bomberman.flameDistance; i++) {
                positionX = new fc.Vector2(_position.x + i, _position.y);
                if (this.checkWalls(positionX) == true) {
                    break;
                }
                if (this.checkBombs(positionX) == true) {
                    this.fleeBomb("left");
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
                    this.fleeBomb("down");
                }
                if (this.detectPlayer(positionY) == true) {
                    this.bombPlayer();
                }
            }
            for (let i = -1; i >= -Bomberman.flameDistance; i--) {
                positionX = new fc.Vector2(_position.x + i, _position.y);
                if (this.checkWalls(positionX) == true) {
                    break;
                }
                if (this.checkBombs(positionX) == true) {
                    this.fleeBomb("right");
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
                    this.fleeBomb("up");
                }
                if (this.detectPlayer(positionY) == true) {
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
            return false;
        }
        walkEnemies(_job) {
            this.job = _job;
            this.tempPos = Bomberman.enemies2.mtxLocal.translation;
            switch (this.job) {
                case Bomberman.WALK.UP:
                    Bomberman.enemies2.sprite.setAnimation(Enemy2.animations["WALK_UP"]);
                    Bomberman.enemies2.mtxLocal.translateY(1);
                    break;
                case Bomberman.WALK.RIGHT:
                    Bomberman.enemies2.sprite.setAnimation(Enemy2.animations["WALK_RIGHT"]);
                    Bomberman.enemies2.mtxLocal.translateX(1);
                    break;
                case Bomberman.WALK.DOWN:
                    Bomberman.enemies2.sprite.setAnimation(Enemy2.animations["WALK_DOWN"]);
                    Bomberman.enemies2.mtxLocal.translateY(-1);
                    break;
                case Bomberman.WALK.LEFT:
                    Bomberman.enemies2.sprite.setAnimation(Enemy2.animations["WALK_LEFT"]);
                    Bomberman.enemies2.mtxLocal.translateX(-1);
                    break;
            }
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            this.checkEnemyCollision();
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
        }
        changeState(_state) {
            this.state = _state;
            switch (this.state) {
                case Bomberman.STATE.HUNT:
                    fc.Time.game.setTimer(1000, 1, this.findPlayer);
                    break;
                case Bomberman.STATE.CHECK:
                    break;
                case Bomberman.STATE.FLEE:
                    //this.fleeBomb();
                    break;
            }
        }
        detectPlayer(_position) {
            if (_position.equals(Bomberman.avatar.mtxLocal.translation.toVector2())) {
                return true;
            }
            return false;
        }
        bombPlayer() {
            if (Bomberman.gameState.topRight > 0) {
                if (Bomberman.countBombsEnemy2 < Bomberman.maxBombEnemy2) {
                    Bomberman.levelRoot.appendChild(new Bomberman.Bomb(fc.Vector2.ONE(1), new fc.Vector2(this.mtxLocal.translation.x, this.mtxLocal.translation.y), 2));
                    Bomberman.countBombsEnemy2++;
                    this.state = Bomberman.STATE.FLEE;
                    this.changeState(Bomberman.STATE.FLEE);
                    fc.Time.game.setTimer(6000, 1, this.setHunt);
                }
            }
        }
        fleeBomb(_direction) {
            if (_direction == "up") {
                if (this.checkWalls(new fc.Vector2(Bomberman.enemies2.mtxLocal.translation.x + 1, Bomberman.enemies2.mtxLocal.translation.y)) == false) {
                    this.walkEnemies(Bomberman.WALK.RIGHT);
                }
                else if (this.checkWalls(new fc.Vector2(Bomberman.enemies2.mtxLocal.translation.x - 1, Bomberman.enemies2.mtxLocal.translation.y)) == false) {
                    this.walkEnemies(Bomberman.WALK.LEFT);
                }
                else {
                    this.walkEnemies(Bomberman.WALK.UP);
                }
            }
            if (_direction == "right") {
                if (this.checkWalls(new fc.Vector2(Bomberman.enemies2.mtxLocal.translation.x, Bomberman.enemies2.mtxLocal.translation.y + 1)) == false) {
                    this.walkEnemies(Bomberman.WALK.UP);
                }
                else if (this.checkWalls(new fc.Vector2(Bomberman.enemies2.mtxLocal.translation.x, Bomberman.enemies2.mtxLocal.translation.y - 1)) == false) {
                    this.walkEnemies(Bomberman.WALK.DOWN);
                }
                else {
                    this.walkEnemies(Bomberman.WALK.RIGHT);
                }
            }
            if (_direction == "down") {
                if (this.checkWalls(new fc.Vector2(Bomberman.enemies2.mtxLocal.translation.x + 1, Bomberman.enemies2.mtxLocal.translation.y)) == false) {
                    this.walkEnemies(Bomberman.WALK.RIGHT);
                }
                else if (this.checkWalls(new fc.Vector2(Bomberman.enemies2.mtxLocal.translation.x - 1, Bomberman.enemies2.mtxLocal.translation.y)) == false) {
                    this.walkEnemies(Bomberman.WALK.LEFT);
                }
                else {
                    this.walkEnemies(Bomberman.WALK.DOWN);
                }
            }
            if (_direction == "left") {
                if (this.checkWalls(new fc.Vector2(Bomberman.enemies2.mtxLocal.translation.x, Bomberman.enemies2.mtxLocal.translation.y + 1)) == false) {
                    this.walkEnemies(Bomberman.WALK.UP);
                }
                else if (this.checkWalls(new fc.Vector2(Bomberman.enemies2.mtxLocal.translation.x, Bomberman.enemies2.mtxLocal.translation.y - 1)) == false) {
                    this.walkEnemies(Bomberman.WALK.DOWN);
                }
                else {
                    this.walkEnemies(Bomberman.WALK.LEFT);
                }
            }
        }
        checkEnemyDeath() {
            if (Bomberman.gameState.topRight == 0) {
                Bomberman.root.removeChild(Bomberman.enemies2);
                Bomberman.enemies2.removeAllChildren();
            }
        }
    }
    Bomberman.Enemy2 = Enemy2;
})(Bomberman || (Bomberman = {}));
///<reference path= "GameObject.ts"/>
var Bomberman;
///<reference path= "GameObject.ts"/>
(function (Bomberman) {
    var fc = FudgeCore;
    var fcAid = FudgeAid;
    class Enemy3 extends Bomberman.GameObject {
        constructor(_position) {
            super("Enemies3", new fc.Vector2(0.8, 0.8), _position);
            this.state = Bomberman.STATE.HUNT;
            this.job = Bomberman.WALK.DOWN;
            this.findPlayer = () => {
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
                if (this.state == Bomberman.STATE.HUNT) {
                    fc.Time.game.setTimer(1000, 1, this.findPlayer);
                }
            };
            this.setHunt = () => {
                this.changeState(Bomberman.STATE.HUNT);
            };
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            this.sprite = new fcAid.NodeSprite("EnemySprite3");
            this.sprite.addComponent(new fc.ComponentTransform());
            this.sprite.mtxLocal.translateY(-0.25);
            this.sprite.mtxLocal.translateZ(0.001);
            this.appendChild(this.sprite);
            this.sprite.setAnimation(Enemy3.animations["WALK_DOWN"]);
            this.sprite.showFrame(0);
            this.sprite.setFrameDirection(1);
            this.sprite.framerate = 6;
            this.changeState(this.state);
        }
        static generateSprites(_spritesheet) {
            Enemy3.animations = {};
            for (let i = 0; i < 4; i++) {
                let name = "WALK_" + Bomberman.WALK[i];
                let sprite = new fcAid.SpriteSheetAnimation(name, _spritesheet);
                sprite.generateByGrid(fc.Rectangle.GET(0, i * 64, 64, 64), 6, 82, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(64));
                Enemy3.animations[name] = sprite;
            }
        }
        update() {
            this.checkEnemyDanger();
            this.checkEnemyDeath();
        }
        checkEnemyCollision() {
            for (let wall of Bomberman.wallsNode.getChildren()) {
                if (Bomberman.enemies3.checkCollision(wall)) {
                    Bomberman.enemies3.mtxLocal.translation = this.tempPos;
                }
            }
            for (let wall of Bomberman.explodableBlockNode.getChildren()) {
                if (Bomberman.enemies3.checkCollision(wall)) {
                    Bomberman.enemies3.mtxLocal.translation = this.tempPos;
                }
            }
            for (let bomb of Bomberman.levelRoot.getChildrenByName("Bomb")) {
                if (Bomberman.enemies3.checkCollision(bomb)) {
                    Bomberman.enemies3.mtxLocal.translation = this.tempPos;
                }
            }
            for (let flames of Bomberman.levelRoot.getChildrenByName("Flames")) {
                if (Bomberman.enemies3.checkCollision(flames)) {
                    Bomberman.enemies3.mtxLocal.translation = this.tempPos;
                }
            }
            for (let avatar of Bomberman.root.getChildrenByName("Bomberman")) {
                if (Bomberman.enemies3.checkCollision(avatar)) {
                    Bomberman.enemies3.mtxLocal.translation = this.tempPos;
                }
            }
            for (let enemies of Bomberman.root.getChildrenByName("Enemies")) {
                if (Bomberman.enemies3.checkCollision(enemies)) {
                    Bomberman.enemies3.mtxLocal.translation = this.tempPos;
                }
            }
            for (let enemies2 of Bomberman.root.getChildrenByName("Enemies2")) {
                if (Bomberman.enemies3.checkCollision(enemies2)) {
                    Bomberman.enemies3.mtxLocal.translation = this.tempPos;
                }
            }
            for (let portal of Bomberman.levelRoot.getChildrenByName("Portal")) {
                if (Bomberman.enemies3.checkCollision(portal)) {
                    let portals = new Bomberman.Portal(new fc.Vector2(0, 0), -1);
                    portals.teleportPortal(portal);
                }
            }
        }
        checkEnemyDanger() {
            let _position = this.mtxLocal.translation;
            let positionX;
            let positionY;
            for (let bomb of Bomberman.levelRoot.getChildrenByName("Bomb")) {
                if (this.mtxLocal.translation.toVector2().equals(bomb.mtxLocal.translation.toVector2())) {
                    if (this.checkWalls(new fc.Vector2(this.mtxLocal.translation.x + 1, this.mtxLocal.translation.y)) == false) {
                        this.walkEnemies(Bomberman.WALK.RIGHT);
                    }
                    else if (this.checkWalls(new fc.Vector2(this.mtxLocal.translation.x, this.mtxLocal.translation.y - 1)) == false) {
                        this.walkEnemies(Bomberman.WALK.DOWN);
                    }
                    else if (this.checkWalls(new fc.Vector2(this.mtxLocal.translation.x - 1, this.mtxLocal.translation.y)) == false) {
                        this.walkEnemies(Bomberman.WALK.LEFT);
                    }
                    else if (this.checkWalls(new fc.Vector2(this.mtxLocal.translation.x, this.mtxLocal.translation.y + 1)) == false) {
                        this.walkEnemies(Bomberman.WALK.UP);
                    }
                }
            }
            for (let i = 1; i <= Bomberman.flameDistance; i++) {
                positionX = new fc.Vector2(_position.x + i, _position.y);
                if (this.checkWalls(positionX) == true) {
                    break;
                }
                if (this.checkBombs(positionX) == true) {
                    this.fleeBomb("left");
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
                    this.fleeBomb("down");
                }
                if (this.detectPlayer(positionY) == true) {
                    this.bombPlayer();
                }
            }
            for (let i = -1; i >= -Bomberman.flameDistance; i--) {
                positionX = new fc.Vector2(_position.x + i, _position.y);
                if (this.checkWalls(positionX) == true) {
                    break;
                }
                if (this.checkBombs(positionX) == true) {
                    this.fleeBomb("right");
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
                    this.fleeBomb("up");
                }
                if (this.detectPlayer(positionY) == true) {
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
            return false;
        }
        walkEnemies(_job) {
            this.job = _job;
            this.tempPos = Bomberman.enemies3.mtxLocal.translation;
            switch (this.job) {
                case Bomberman.WALK.UP:
                    Bomberman.enemies3.sprite.setAnimation(Enemy3.animations["WALK_UP"]);
                    Bomberman.enemies3.mtxLocal.translateY(1);
                    break;
                case Bomberman.WALK.RIGHT:
                    Bomberman.enemies3.sprite.setAnimation(Enemy3.animations["WALK_RIGHT"]);
                    Bomberman.enemies3.mtxLocal.translateX(1);
                    break;
                case Bomberman.WALK.DOWN:
                    Bomberman.enemies3.sprite.setAnimation(Enemy3.animations["WALK_DOWN"]);
                    Bomberman.enemies3.mtxLocal.translateY(-1);
                    break;
                case Bomberman.WALK.LEFT:
                    Bomberman.enemies3.sprite.setAnimation(Enemy3.animations["WALK_LEFT"]);
                    Bomberman.enemies3.mtxLocal.translateX(-1);
                    break;
            }
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            this.checkEnemyCollision();
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
        }
        changeState(_state) {
            this.state = _state;
            switch (this.state) {
                case Bomberman.STATE.HUNT:
                    fc.Time.game.setTimer(1000, 1, this.findPlayer);
                    break;
                case Bomberman.STATE.CHECK:
                    break;
                case Bomberman.STATE.FLEE:
                    //this.fleeBomb();
                    break;
            }
        }
        detectPlayer(_position) {
            if (_position.equals(Bomberman.avatar.mtxLocal.translation.toVector2())) {
                return true;
            }
            return false;
        }
        bombPlayer() {
            if (Bomberman.gameState.bottomRight > 0) {
                if (Bomberman.countBombsEnemy3 < Bomberman.maxBombEnemy3) {
                    Bomberman.levelRoot.appendChild(new Bomberman.Bomb(fc.Vector2.ONE(1), new fc.Vector2(this.mtxLocal.translation.x, this.mtxLocal.translation.y), 3));
                    Bomberman.countBombsEnemy3++;
                    this.state = Bomberman.STATE.FLEE;
                    this.changeState(Bomberman.STATE.FLEE);
                    fc.Time.game.setTimer(6000, 1, this.setHunt);
                }
            }
        }
        fleeBomb(_direction) {
            if (_direction == "up") {
                if (this.checkWalls(new fc.Vector2(Bomberman.enemies3.mtxLocal.translation.x + 1, Bomberman.enemies3.mtxLocal.translation.y)) == false) {
                    this.walkEnemies(Bomberman.WALK.RIGHT);
                }
                else if (this.checkWalls(new fc.Vector2(Bomberman.enemies3.mtxLocal.translation.x - 1, Bomberman.enemies3.mtxLocal.translation.y)) == false) {
                    this.walkEnemies(Bomberman.WALK.LEFT);
                }
                else {
                    this.walkEnemies(Bomberman.WALK.UP);
                }
            }
            if (_direction == "right") {
                if (this.checkWalls(new fc.Vector2(Bomberman.enemies3.mtxLocal.translation.x, Bomberman.enemies3.mtxLocal.translation.y + 1)) == false) {
                    this.walkEnemies(Bomberman.WALK.UP);
                }
                else if (this.checkWalls(new fc.Vector2(Bomberman.enemies3.mtxLocal.translation.x, Bomberman.enemies3.mtxLocal.translation.y - 1)) == false) {
                    this.walkEnemies(Bomberman.WALK.DOWN);
                }
                else {
                    this.walkEnemies(Bomberman.WALK.RIGHT);
                }
            }
            if (_direction == "down") {
                if (this.checkWalls(new fc.Vector2(Bomberman.enemies3.mtxLocal.translation.x + 1, Bomberman.enemies3.mtxLocal.translation.y)) == false) {
                    this.walkEnemies(Bomberman.WALK.RIGHT);
                }
                else if (this.checkWalls(new fc.Vector2(Bomberman.enemies3.mtxLocal.translation.x - 1, Bomberman.enemies3.mtxLocal.translation.y)) == false) {
                    this.walkEnemies(Bomberman.WALK.LEFT);
                }
                else {
                    this.walkEnemies(Bomberman.WALK.DOWN);
                }
            }
            if (_direction == "left") {
                if (this.checkWalls(new fc.Vector2(Bomberman.enemies3.mtxLocal.translation.x, Bomberman.enemies3.mtxLocal.translation.y + 1)) == false) {
                    this.walkEnemies(Bomberman.WALK.UP);
                }
                else if (this.checkWalls(new fc.Vector2(Bomberman.enemies3.mtxLocal.translation.x, Bomberman.enemies3.mtxLocal.translation.y - 1)) == false) {
                    this.walkEnemies(Bomberman.WALK.DOWN);
                }
                else {
                    this.walkEnemies(Bomberman.WALK.LEFT);
                }
            }
        }
        checkEnemyDeath() {
            if (Bomberman.gameState.bottomRight == 0) {
                Bomberman.root.removeChild(Bomberman.enemies3);
                Bomberman.enemies3.removeAllChildren();
            }
        }
    }
    Bomberman.Enemy3 = Enemy3;
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var fc = FudgeCore;
    class ExplodableBlock extends Bomberman.GameObject {
        constructor(_size, _position) {
            super("ExplodableBlock", _size, _position);
            let txtWall = new fc.TextureImage();
            txtWall.load(".../Assets/tiles/ExplodableBlock.png");
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
    let soundHit = new fc.Audio(".../Assets/sounds/hit.wav");
    Bomberman.flameDistance = 2;
    class Flames extends Bomberman.GameObject {
        constructor(_position) {
            super("Flames", new fc.Vector2(0.8, 0.8), _position);
            this.setLifeLimiter = () => {
                Bomberman.lifeLimiter = false;
            };
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
                    if (Bomberman.lifeLimiter == false) {
                        if (Bomberman.lifeInvincibility == false) {
                            Bomberman.gameState.bottomLeft--;
                            Bomberman.hndDeaths();
                            Bomberman.lifeLimiter = true;
                            fc.Time.game.setTimer(3000, 1, this.setLifeLimiter);
                        }
                    }
                }
            }
            for (let flames of Bomberman.levelRoot.getChildrenByName("Flames")) {
                if (Bomberman.enemies.checkCollision(flames)) {
                    if (Bomberman.gameState.topLeft > 0)
                        Bomberman.gameState.topLeft--;
                    Bomberman.hndDeaths();
                }
            }
            for (let flames of Bomberman.levelRoot.getChildrenByName("Flames")) {
                if (Bomberman.enemies2.checkCollision(flames)) {
                    if (Bomberman.gameState.topRight > 0)
                        Bomberman.gameState.topRight--;
                    Bomberman.hndDeaths();
                }
            }
            for (let flames of Bomberman.levelRoot.getChildrenByName("Flames")) {
                if (Bomberman.enemies3.checkCollision(flames)) {
                    if (Bomberman.gameState.bottomRight > 0)
                        Bomberman.gameState.bottomRight--;
                    Bomberman.hndDeaths();
                }
            }
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
            let txtFloor = new fc.TextureImage();
            txtFloor.load(".../Assets/tiles/BackgroundTile.png");
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
    var fc = FudgeCore;
    var fui = FudgeUserInterface;
    class GameState extends fc.Mutable {
        constructor() {
            super(...arguments);
            this.controls = "WASD  :  Moving      SPACE  :  Bomb";
        }
        reduceMutator(_mutator) { }
    }
    Bomberman.GameState = GameState;
    Bomberman.gameState = new GameState();
    class Hud {
        static async start() {
            await Bomberman.communicate("data.json");
            let domHud = document.querySelector("div#hud");
            Bomberman.gameState.bottomLeft = Bomberman.gameSettings.avatarLives;
            Bomberman.gameState.topLeft = Bomberman.gameSettings.enemyLives1;
            Bomberman.gameState.topRight = Bomberman.gameSettings.enemyLives2;
            Bomberman.gameState.bottomRight = Bomberman.gameSettings.enemyLives3;
            this.loop();
            Hud.controller = new fui.Controller(Bomberman.gameState, domHud);
            Hud.controller.updateUserInterface();
        }
        static loop() {
            let time = document.querySelector("[key=time]");
            let date = new Date(fc.Time.game.get());
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
                    Bomberman.maxBombEnemy++;
                    Bomberman.maxBombEnemy2++;
                    Bomberman.maxBombEnemy3++;
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
                    Bomberman.lifeInvincibility = true;
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
        createLevel(_level) {
            this.createFloor();
            this.createBorder();
            if (_level == 1)
                this.createBlocks();
            if (_level == 2)
                this.createBlocks2();
            if (_level == 3)
                this.createBlocks3();
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
            Bomberman.levelRoot.appendChild(new Bomberman.Items("BOMB_PLUS", new fc.Vector2(5, 7)));
            Bomberman.levelRoot.appendChild(new Bomberman.Items("FLAME_PLUS", new fc.Vector2(15, 1)));
            Bomberman.levelRoot.appendChild(new Bomberman.Items("BOMB_CIRCLE", new fc.Vector2(12, 4)));
            Bomberman.levelRoot.appendChild(new Bomberman.Items("BOMB_DIAGONAL", new fc.Vector2(8, 4)));
            Bomberman.levelRoot.appendChild(new Bomberman.Items("LIFE_INVINCIBILITY", new fc.Vector2(15, 7)));
            Bomberman.levelRoot.appendChild(new Bomberman.Items("LIFE_PLUS", new fc.Vector2(5, 1)));
            Bomberman.levelRoot.appendChild(new Bomberman.Portal(new fc.Vector2(1, 4), 0));
            Bomberman.levelRoot.appendChild(new Bomberman.Portal(new fc.Vector2(10, 7), 1));
            Bomberman.levelRoot.appendChild(new Bomberman.Portal(new fc.Vector2(19, 4), 2));
            Bomberman.levelRoot.appendChild(new Bomberman.Portal(new fc.Vector2(10, 1), 3));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(1, 3)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(1, 5)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 1)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 3)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 5)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 7)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(4, 2)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(4, 6)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(6, 1)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(6, 4)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(6, 7)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(9, 1)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(9, 7)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(10, 4)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(11, 1)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(11, 7)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(14, 1)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(14, 4)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(14, 7)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(16, 2)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(16, 6)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 1)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 3)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 5)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 7)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(19, 3)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(19, 5)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(3, 1)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(3, 4)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(3, 7)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(4, 1)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(4, 3)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(4, 4)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(4, 5)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(4, 7)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(5, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(5, 3)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(5, 5)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(5, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(6, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(6, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(7, 4)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(8, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(8, 3)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(8, 5)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(8, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(9, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(9, 4)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(9, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(10, 3)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(10, 5)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(11, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(11, 4)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(11, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(12, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(12, 3)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(12, 5)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(12, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(13, 4)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(14, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(14, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(15, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(15, 3)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(15, 5)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(15, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 1)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 3)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 4)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 5)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 7)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(17, 1)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(17, 4)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(17, 7)));
        }
        createBlocks2() {
            Bomberman.levelRoot.appendChild(new Bomberman.Items("BOMB_PLUS", new fc.Vector2(1, 4)));
            Bomberman.levelRoot.appendChild(new Bomberman.Items("FLAME_PLUS", new fc.Vector2(13, 1)));
            Bomberman.levelRoot.appendChild(new Bomberman.Items("BOMB_CIRCLE", new fc.Vector2(7, 7)));
            Bomberman.levelRoot.appendChild(new Bomberman.Items("BOMB_DIAGONAL", new fc.Vector2(7, 1)));
            Bomberman.levelRoot.appendChild(new Bomberman.Items("LIFE_INVINCIBILITY", new fc.Vector2(13, 7)));
            Bomberman.levelRoot.appendChild(new Bomberman.Items("LIFE_PLUS", new fc.Vector2(19, 4)));
            Bomberman.levelRoot.appendChild(new Bomberman.Portal(new fc.Vector2(6, 4), 0));
            Bomberman.levelRoot.appendChild(new Bomberman.Portal(new fc.Vector2(14, 4), 1));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 2)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 3)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 5)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 6)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(3, 2)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(3, 6)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(5, 1)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(5, 2)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(5, 4)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(5, 6)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(5, 7)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(7, 3)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(7, 4)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(7, 5)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(8, 1)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(8, 4)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(8, 7)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(10, 1)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(10, 3)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(10, 5)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(10, 7)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(12, 1)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(12, 4)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(12, 7)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(13, 3)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(13, 4)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(13, 5)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(15, 1)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(15, 2)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(15, 4)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(15, 6)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(15, 7)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(17, 2)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(17, 6)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 2)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 3)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 5)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(1, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(1, 3)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(1, 5)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(1, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(3, 4)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(3, 3)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(3, 5)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(4, 4)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(5, 3)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(5, 5)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(6, 1)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(6, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(6, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(6, 7)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(7, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(7, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(8, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(8, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(9, 4)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(10, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(10, 4)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(10, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(11, 4)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(12, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(12, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(13, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(13, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(14, 1)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(14, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(14, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(14, 7)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(15, 3)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(15, 5)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 1)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 4)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 7)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(17, 1)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(17, 7)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(18, 1)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(18, 7)));
        }
        createBlocks3() {
            Bomberman.levelRoot.appendChild(new Bomberman.Items("BOMB_PLUS", new fc.Vector2(7, 3)));
            Bomberman.levelRoot.appendChild(new Bomberman.Items("FLAME_PLUS", new fc.Vector2(13, 5)));
            Bomberman.levelRoot.appendChild(new Bomberman.Items("BOMB_CIRCLE", new fc.Vector2(10, 2)));
            Bomberman.levelRoot.appendChild(new Bomberman.Items("BOMB_DIAGONAL", new fc.Vector2(10, 6)));
            Bomberman.levelRoot.appendChild(new Bomberman.Items("LIFE_INVINCIBILITY", new fc.Vector2(7, 5)));
            Bomberman.levelRoot.appendChild(new Bomberman.Items("LIFE_PLUS", new fc.Vector2(13, 3)));
            Bomberman.levelRoot.appendChild(new Bomberman.Portal(new fc.Vector2(5, 4), 0));
            Bomberman.levelRoot.appendChild(new Bomberman.Portal(new fc.Vector2(15, 4), 1));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 2)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 4)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(2, 6)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(3, 2)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(3, 4)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(3, 6)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(4, 4)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(6, 2)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(6, 4)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(6, 6)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(7, 4)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(8, 4)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(10, 1)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(10, 3)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(10, 5)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(10, 7)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(12, 4)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(13, 4)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(14, 2)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(14, 4)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(14, 6)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(16, 4)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(17, 2)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(17, 4)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(17, 6)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 2)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 4)));
            Bomberman.wallsNode.appendChild(new Bomberman.Wall(fc.Vector2.ONE(1), new fc.Vector2(18, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(1, 4)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(4, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(4, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(6, 3)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(6, 5)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(7, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(7, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(8, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(8, 3)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(8, 5)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(8, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(9, 1)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(9, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(9, 3)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(9, 5)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(9, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(9, 7)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(10, 4)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(11, 1)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(11, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(11, 3)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(11, 5)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(11, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(11, 7)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(12, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(12, 3)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(12, 5)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(12, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(13, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(13, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(14, 3)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(14, 5)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 2)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(16, 6)));
            Bomberman.explodableBlockNode.appendChild(new Bomberman.ExplodableBlock(fc.Vector2.ONE(1), new fc.Vector2(19, 4)));
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
    let backgroundTheme = new fc.Audio(".../Assets/sounds/theme.mp3");
    let soundDeath = new fc.Audio(".../Assets/sounds/death.wav");
    let soundVictory = new fc.Audio(".../Assets/sounds/victory.wav");
    Bomberman.root = new fc.Node("Root");
    Bomberman.levelRoot = new fc.Node("LevelNode");
    Bomberman.floorNode = new fc.Node("FloorNode");
    Bomberman.wallsNode = new fc.Node("WallsNode");
    Bomberman.explodableBlockNode = new fc.Node("ExplodableBlockNode");
    Bomberman.arenaSize = new fc.Vector2(21, 9);
    async function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        await Bomberman.communicate("data.json");
        cmpAudio = new fc.ComponentAudio(backgroundTheme, true, false);
        cmpAudio.connect(true);
        cmpAudio.volume = 0.2;
        cmpAudio.setAudio(backgroundTheme);
        cmpAudio.play(true);
        Bomberman.level = Bomberman.gameSettings.level;
        Bomberman.levelRoot.appendChild(Bomberman.floorNode);
        Bomberman.levelRoot.appendChild(Bomberman.wallsNode);
        Bomberman.levelRoot.appendChild(Bomberman.explodableBlockNode);
        Bomberman.root.appendChild(Bomberman.levelRoot);
        Bomberman.avatar = await hndAvatar();
        Bomberman.root.appendChild(Bomberman.avatar);
        Bomberman.enemies = await hndEnemies();
        Bomberman.root.appendChild(Bomberman.enemies);
        Bomberman.enemies2 = await hndEnemies2();
        Bomberman.root.appendChild(Bomberman.enemies2);
        Bomberman.enemies3 = await hndEnemies3();
        Bomberman.root.appendChild(Bomberman.enemies3);
        await hndBomb();
        await hndFlames();
        await hndPortal();
        await hndItems();
        createArena(Bomberman.level);
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
    }
    function hndLoop(_event) {
        Bomberman.avatar.checkPlayerDeath();
        Bomberman.enemies.update();
        Bomberman.enemies2.update();
        Bomberman.enemies3.update();
        Bomberman.viewport.draw();
    }
    function createArena(_level) {
        let levelTest = new Bomberman.LevelBuilder();
        levelTest.createLevel(_level);
    }
    async function hndAvatar() {
        let txtAvatar = new fc.TextureImage();
        txtAvatar.load(".../Assets/avatar/avatar_sprites.png");
        let coatSprite = new fc.CoatTextured(Bomberman.clrWhite, txtAvatar);
        Bomberman.Avatar.generateSprites(coatSprite);
        Bomberman.avatar = new Bomberman.Avatar(new fc.Vector2(1, 1));
        return Bomberman.avatar;
    }
    async function hndEnemies() {
        let txtEnemy = new fc.TextureImage();
        txtEnemy.load(".../Assets/enemies/enemy_sprites.png");
        let coatSprite = new fc.CoatTextured(Bomberman.clrWhite, txtEnemy);
        Bomberman.Enemy.generateSprites(coatSprite);
        Bomberman.enemies = new Bomberman.Enemy(new fc.Vector2(1, Bomberman.arenaSize.y - 2));
        return Bomberman.enemies;
    }
    async function hndEnemies2() {
        let txtEnemy = new fc.TextureImage();
        txtEnemy.load(".../Assets/enemies/enemy_sprites.png");
        let coatSprite = new fc.CoatTextured(Bomberman.clrWhite, txtEnemy);
        Bomberman.Enemy2.generateSprites(coatSprite);
        Bomberman.enemies2 = new Bomberman.Enemy2(new fc.Vector2(Bomberman.arenaSize.x - 2, Bomberman.arenaSize.y - 2));
        return Bomberman.enemies2;
    }
    async function hndEnemies3() {
        let txtEnemy = new fc.TextureImage();
        txtEnemy.load(".../Assets/enemies/enemy_sprites.png");
        let coatSprite = new fc.CoatTextured(Bomberman.clrWhite, txtEnemy);
        Bomberman.Enemy3.generateSprites(coatSprite);
        Bomberman.enemies3 = new Bomberman.Enemy3(new fc.Vector2(Bomberman.arenaSize.x - 2, 1));
        return Bomberman.enemies3;
    }
    async function hndBomb() {
        let txtBomb = new fc.TextureImage();
        txtBomb.load(".../Assets/items/bomb_sprites.png");
        let coatSprite = new fc.CoatTextured(Bomberman.clrWhite, txtBomb);
        let txtBombExplode = new fc.TextureImage();
        txtBombExplode.load(".../Assets/items/bomb_explode.png");
        let coatSprite2 = new fc.CoatTextured(Bomberman.clrWhite, txtBombExplode);
        Bomberman.Bomb.generateSprites(coatSprite, coatSprite2);
    }
    async function hndFlames() {
        let txtFlames = new fc.TextureImage();
        txtFlames.load(".../Assets/items/flames_sprites.png");
        let coatSprite = new fc.CoatTextured(Bomberman.clrWhite, txtFlames);
        Bomberman.Flames.generateSprites(coatSprite);
    }
    async function hndPortal() {
        let txtTeleport = new fc.TextureImage();
        txtTeleport.load(".../Assets/tiles/portal_sprites.png");
        let coatSprite = new fc.CoatTextured(Bomberman.clrWhite, txtTeleport);
        Bomberman.Portal.generateSprites(coatSprite);
    }
    async function hndItems() {
        let txtItems = new fc.TextureImage();
        txtItems.load(".../Assets/items/items_sprites.png");
        let coatSprite = new fc.CoatTextured(Bomberman.clrWhite, txtItems);
        Bomberman.Items.generateSprites(coatSprite);
    }
    function hndDeaths() {
        if (Bomberman.gameState.bottomLeft <= 0) {
            cmpAudio.play(false);
            cmpAudio = new fc.ComponentAudio(soundDeath, false, false);
            cmpAudio.connect(true);
            cmpAudio.volume = 0.05;
            cmpAudio.setAudio(soundDeath);
            cmpAudio.play(true);
            let gameOver = document.createElement("div");
            gameOver.id = "gameOverContent";
            let gameOverText = document.createElement("p");
            gameOverText.id = "gameOverTextID";
            gameOverText.innerHTML = "GAME OVER";
            gameOver.appendChild(gameOverText);
            let gameOverButton = document.createElement("button");
            gameOverButton.id = "gameOverButtonID";
            gameOverButton.innerHTML = "RESTART";
            gameOver.appendChild(gameOverButton);
            gameOverButton.addEventListener("click", hndRestart);
            document.getElementById("gameOverDIV").appendChild(gameOver);
        }
        if (Bomberman.gameState.topLeft <= 0 && Bomberman.gameState.topRight <= 0 && Bomberman.gameState.bottomRight <= 0) {
            cmpAudio.play(false);
            cmpAudio = new fc.ComponentAudio(soundVictory, false, false);
            cmpAudio.connect(true);
            cmpAudio.volume = 0.05;
            cmpAudio.setAudio(soundVictory);
            cmpAudio.play(true);
            let gameOver = document.createElement("div");
            gameOver.id = "gameOverContent";
            let gameOverText = document.createElement("p");
            gameOverText.id = "gameOverTextID";
            gameOverText.innerHTML = "YOU WON";
            gameOver.appendChild(gameOverText);
            let gameOverButton = document.createElement("button");
            gameOverButton.id = "gameOverButtonID";
            gameOverButton.innerHTML = "RESTART";
            gameOver.appendChild(gameOverButton);
            gameOverButton.addEventListener("click", hndRestart);
            document.getElementById("gameOverDIV").appendChild(gameOver);
        }
    }
    Bomberman.hndDeaths = hndDeaths;
    function hndRestart(_event) {
        location.reload();
    }
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var fc = FudgeCore;
    var fcAid = FudgeAid;
    let cmpAudio;
    let soundTeleport = new fc.Audio(".../Assets/sounds/teleport.wav");
    let portalArray = [];
    class Portal extends Bomberman.GameObject {
        constructor(_position, portalID) {
            super("Portal", new fc.Vector2(0.8, 0.8), _position);
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            this.sprite = new fcAid.NodeSprite("PortalSprite");
            this.sprite.addComponent(new fc.ComponentTransform());
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
            let enemyPos2 = Bomberman.enemies2.mtxLocal.translation;
            let enemyPos3 = Bomberman.enemies3.mtxLocal.translation;
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
            for (let i = 0; i <= portalArray.length - 1; i++) {
                if (enemyPos2.equals(portalArray[i].toVector3())) {
                    if (i == portalArray.length - 1) {
                        Bomberman.enemies2.mtxLocal.translation = portalArray[0].toVector3();
                    }
                    else {
                        Bomberman.enemies2.mtxLocal.translation = portalArray[i + 1].toVector3();
                    }
                }
            }
            for (let i = 0; i <= portalArray.length - 1; i++) {
                if (enemyPos3.equals(portalArray[i].toVector3())) {
                    if (i == portalArray.length - 1) {
                        Bomberman.enemies3.mtxLocal.translation = portalArray[0].toVector3();
                    }
                    else {
                        Bomberman.enemies3.mtxLocal.translation = portalArray[i + 1].toVector3();
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
            txtWall.load(".../Assets/tiles/SolidBlock.png");
            let mtrWall = new fc.Material("BorderWall", fc.ShaderTexture, new fc.CoatTextured(Bomberman.clrWhite, txtWall));
            let cmpMaterial = new fc.ComponentMaterial(mtrWall);
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            this.addComponent(cmpMaterial);
        }
    }
    Bomberman.Wall = Wall;
})(Bomberman || (Bomberman = {}));
//# sourceMappingURL=Bomberman.js.map