namespace Bomberman {

  export interface GameSettings {
    level: number;
    avatarLives: number;
    enemyLives1: number;
    enemyLives2: number;
    enemyLives3: number;
    maxBomb: number;
    maxBombEnemy: number;
    maxBombEnemy2: number;
    maxBombEnemy3: number;
    godmode: boolean;
  }

  export let gameSettings: GameSettings;

  export async function communicate(_url: string): Promise<void> {
    let response: Response = await fetch(_url);
    let gameSettingsJSON: GameSettings = await response.json();
    gameSettings = gameSettingsJSON;
  }

}