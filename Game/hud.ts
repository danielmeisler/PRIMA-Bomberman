namespace Bomberman {
  import fc = FudgeCore;
  import fui = FudgeUserInterface;

  export class GameState extends fc.Mutable {
    public bottomLeft: number;
    public topLeft: number;
    public topRight: number;
    public bottomRight: number;
    public controls: string = "WASD  :  Moving      SPACE  :  Bomb";
    protected reduceMutator(_mutator: fc.Mutator): void {/* */ }
  }

  export let gameState: GameState = new GameState();

  export class Hud {
    private static controller: fui.Controller;

    public static async start(): Promise<void> {
      await communicate("data.json");
      let domHud: HTMLDivElement = document.querySelector("div#hud");

      gameState.bottomLeft = gameSettings.avatarLives;
      gameState.topLeft = gameSettings.enemyLives1;
      gameState.topRight = gameSettings.enemyLives2;
      gameState.bottomRight = gameSettings.enemyLives3;

      this.loop();
      Hud.controller = new fui.Controller(gameState, domHud);
      Hud.controller.updateUserInterface();
    }

    public static loop(): void {
      let time: HTMLInputElement = document.querySelector("[key=time]");
      let date: Date = new Date(fc.Time.game.get());
      time.value =
        String(date.getMinutes()).padStart(2, "0") + ":" +
        String(date.getSeconds()).padStart(2, "0");

      window.requestAnimationFrame(Hud.loop);
    }
  }
}