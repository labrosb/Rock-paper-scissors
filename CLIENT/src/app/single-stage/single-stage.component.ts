import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { GameHandlerService } from '../game-handler/game-handler.service';

@Component({
  selector: 'app-single-stage',
  providers: [GameHandlerService],
  templateUrl: './single-stage.component.html',
  styleUrls: ['./single-stage.component.scss']
})
export class SingleStageComponent implements OnInit, OnDestroy  {

  player1_Points:number = 0;  //Current player
  player2_Points:number = 0;  // Opponent
  figure1:number = 1;
  figure2:number = 1;
  result:number = -1;
  gameLoop:any;
  gamePaused:boolean = false;
  switchTime:number = 400; //ms
  historyON:boolean = false;
  history = [];
  playerMove:any = false;

  constructor(
    private router: Router,
    private gameHandler: GameHandlerService
  ) {}

  ngOnInit() {
    // Initializes the loop to perform the main animation
    this.initGameLoop();
  }

  ngOnDestroy() {
    this.gameLoop.unsubscribe();
  }

  initGameLoop() {
    this.gameLoop = Observable.interval(this.switchTime)
    .subscribe( x => { this.switchFigures() } );
  }

  play(move) {
    if( !this.gamePaused ) {
      // Pauses the loop to stop prevent changing data after taking them
      this.pause();
      // Calls service where game logic takes place,
      let botMove = this.gameHandler.botPlay();
      let roundData = this.gameHandler.getRoundResult(move, botMove);
      // returns an object with players move and result
      this.figure1 = roundData.playerMove;  // <-- (No need to be retrieved from the object but just for better concistency)
      this.figure2 = roundData.opponentMove;
      // Returns round's result to calculate and visualise the score
      this.result = roundData.result;
      this.updateScore(this.result);
    }
  }

  pause() {
    this.gamePaused = true;
    this.gameLoop.unsubscribe(); // Stops game loop
  }

  reStart() {
    this.gamePaused = false;
    this.figure1 = 1;
    this.figure2 = 1;
    this.result = -1;
    this.initGameLoop();
  }

  updateScore(result) {
    if(result == 1) {
      this.player1_Points++;
    }
    else if(result == 2) {
      this.player2_Points++;
    }
  }

  switchFigures() {
    // Figure1, figure2 correspond to the 2 animated images
    // and they switch values from 1 to 3 to visualize the different options
    if(this.figure1 == 3) {
      this.figure1 = 1;
      this.figure2 = 1;
    }
    else {
      this.figure1++;
      this.figure2++;
    }
  }

  showHistory() {
    this.history = this.gameHandler.getHistory();
    this.historyON = true;
  }

  hideHistory() {
    this.historyON = false;
  }

  back() {
    this.router.navigate( ['/'] );
  }
}
