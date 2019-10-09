import { Injectable } from '@angular/core';

@Injectable()
export class GameHandlerService {

  history = [];

  constructor() {}

  getRoundResult(playerMove, opponentMove) {
    let roundResult = this.calculateResult(playerMove, opponentMove)
    let roundData = { 'playerMove' : playerMove,
                      'opponentMove' : opponentMove,
                      'result': roundResult
                    }
    // Saves round data to history
    this.history.push(roundData);
    // And returns them to stage for visualization
    return (roundData);
  }

  calculateResult(playerMove, opponentMove) {
    // 0 = draw,
    // 1 = player wins,
    // 2 = opponent wins
    let result = 0;
    if(playerMove == 1 && opponentMove == 2) {
      result = 2;
    }
    else if(playerMove == 1 && opponentMove == 3) {
      result = 1;
    }
    else if(playerMove == 2 && opponentMove == 1) {
      result = 1;
    }
    else if(playerMove == 2 && opponentMove == 3) {
      result = 2;
    }
    else if(playerMove == 3 && opponentMove == 1) {
      result = 2;
    }
    else if(playerMove == 3 && opponentMove == 2) {
      result = 1;
    }
    return result;
  }

                // !! Architecture-wise the bot should be an independent class
  botPlay() {   // However in this case the code for it is just a single line 
    // Generates the bot's move
    return Math.floor(Math.random() * 3) + 1;
  }

  getHistory() {
    return this.history;
  }

}
