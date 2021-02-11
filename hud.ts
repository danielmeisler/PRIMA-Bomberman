namespace Bomberman {
  import fc = FudgeCore;
  import fui = FudgeUserInterface;

  export class GameState extends ƒ.Mutable {
    public topLeft: number = 3;
    public topRight: number = 3;
    public bottomLeft: number = 3;
    public bottomRight: number = 3;
    //public time: String = "00:00";
    protected reduceMutator(_mutator: fc.Mutator): void {/* */ }
  }

  export let gameState: GameState = new GameState();

  export class Hud {
    private static controller: fui.Controller;

    public static start(): void {
      let domHud: HTMLDivElement = document.querySelector("div#hud");

      this.loop();
      Hud.controller = new fui.Controller(gameState, domHud);
      Hud.controller.updateUserInterface();
    }

    public static loop(): void {
      let time: HTMLInputElement = document.querySelector("[key=time]");
      let date: Date = new Date(ƒ.Time.game.get());
      time.value =
          String(date.getMinutes()).padStart(2, "0") + ":" +
          String(date.getSeconds()).padStart(2, "0");

      window.requestAnimationFrame(Hud.loop);
  }
  }
}