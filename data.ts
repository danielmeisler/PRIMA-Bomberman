namespace Bomberman {

  export interface GameSettings {
    level: number;
    avatarLives: number;
    enemyLives1: number;
    enemyLives2: number;
    enemyLives3: number;
  }

  export interface Data {
    settings: GameSettings;
  }

  export let gameSettings: GameSettings;

  export async function communicate(_url: string): Promise<void> {
    let response: Response = await fetch(_url);
    let gameSettingsJSON: GameSettings = await response.json();
    gameSettings = gameSettingsJSON;
  }

}