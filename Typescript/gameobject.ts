namespace Bomberman {
  import fc = FudgeCore;

  export let countBombs: number = 0;
  export let countBombsEnemy: number = 0;
  export let countBombsEnemy2: number = 0;
  export let countBombsEnemy3: number = 0;
  export let maxBomb: number;
  export let maxBombEnemy: number;
  export let maxBombEnemy2: number;
  export let maxBombEnemy3: number;
  export let lifeInvincibility: boolean;
  export let circleBomb: boolean = false;
  export let diagonalBomb: boolean = false;
  export let lifeLimiter: boolean = false;

  export enum WALK {
    DOWN, UP, RIGHT, LEFT
  }

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

    // Intersection Überprüfung.
    public checkCollision(_target: GameObject): boolean {
      let intersection: fc.Rectangle = this.rect.getIntersection(_target.rect);
      if (intersection == null) {
        return false;
      }
      return true;
    }

    // Startwerte werden übergeben.
    public static async start(): Promise<void> {
      await communicate("../Typescript/data.json");

      maxBomb = gameSettings.maxBomb;
      maxBombEnemy = gameSettings.maxBombEnemy;
      maxBombEnemy2 = gameSettings.maxBombEnemy2;
      maxBombEnemy3 = gameSettings.maxBombEnemy3;
      lifeInvincibility = gameSettings.godmode;

      if (lifeInvincibility == true) {
        (<HTMLDivElement>document.getElementById("hud_bottomLeftInput")).style.color = "YELLOW";
      }

    }

  }
}