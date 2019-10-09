import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { GameHandlerService } from '../game-handler/game-handler.service';
import { ConnectorService } from '../connector/connector.service';

@Component({
  selector: 'app-single-stage',
  providers: [GameHandlerService, ConnectorService],
  templateUrl: './multi-stage.component.html',
  styleUrls: ['./multi-stage.component.scss']
})

export class MultiStageComponent implements OnInit, OnDestroy  {

  player1_Points:number = 0;  //Current player
  player2_Points:number = 0;  // Opponent
  figure1:number = 1;
  figure2:number = 1;
  result:number = -1;
  receiver:any;
  pairMonitor:any;
  opponentStatus:any;
  isPaired:boolean = false;
  isDisconnected:boolean = false;
  gameLoop:any;
  gamePaused:boolean = false;
  switchTime:number = 400; //ms
  historyON:boolean = false;
  history = [];
  playerMove:number;
  opponentMove:number;
  opponentPlayed:boolean = false;
  playerPlayed:boolean = false;

  constructor(
    private router: Router,
    private gameHandler: GameHandlerService,
    private connector: ConnectorService
  ) {}

  ngOnInit() {
    // Checks if another user is yet connected to the game
    this.pairMonitor = this.connector.checkIfPaired()
    .subscribe(data => {
      this.isPaired = true;
      // Initializes the loop to perform the main animation
      this.initGameLoop();
    });

    // Checks for incoming moves from the other user
    this.receiver = this.connector.receiveMoves()
    .subscribe(move => {
      this.distantMove(move);
    });

    // Checks for incoming moves from the other user
    this.opponentStatus = this.connector.checkOpponentStatus()
    .subscribe(data => {
      this.isDisconnected = true;
      this.result = -2;
      this.pause();
    });
  }

  ngOnDestroy() {
    if(this.isPaired) {
      this.gameLoop.unsubscribe();
    }
    this.receiver.unsubscribe();
    this.pairMonitor.unsubscribe();
    this.opponentStatus.unsubscribe();
    this.connector.disconect();
  }

  initGameLoop() {
    // The main Game's loop
    this.gameLoop = Observable.interval(this.switchTime)
    .subscribe( x => {(
      this.checkMoves(),
      this.switchPlayerFigure(),
      this.switchOpponentFigure()
    )});
  }

  play(move) {
    if( !this.playerPlayed && this.isPaired ) {
      // Sends the move to server to be forwarded to the other player
      this.connector.sendMove(move);
      // Stops the player's figure and prevents from playing again in this round
      this.playerMove = move;
      // Sets the move ready for calculation
      this.playerPlayed = true;
      // Sets the figure to the selected one
      this.figure1 = move;
    }
  }

  distantMove(move) {
    // Sets the move ready for calculation
    this.opponentMove = move;
    // Informs that move is received so if player has also played results are shown
    this.opponentPlayed = true;
  }

  checkMoves() {
    if(this.playerPlayed && this.opponentPlayed) {
      this.pause();
      // Sets the figures to the selected moves
      this.figure1 = this.playerMove;
      this.figure2 = this.opponentMove;
      // Calls service where game logic takes place,
      const roundData = this.gameHandler.getRoundResult(this.playerMove, this.opponentMove);
      // returns an object with players move and result
      this.result = roundData.result;
      // and updates Score
      this.updateScore(this.result);

      // Resets values for next round (timeout: after the results are rendered)
      setTimeout(() => {
        this.playerPlayed = false;
        this.opponentPlayed = false;
      }, 0)
    }
  }

  pause() {
    this.gamePaused = true;
    this.gameLoop.unsubscribe();   // Stops game loop
  }

  reStart() {
    //this.playerPlayed = false;
    //this.opponentPlayed = false;
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

  switchPlayerFigure() {
    // Figure1 correspond to the player's animated image
    // and it switches values from 1 to 3 to visualize the different options
    if(!this.playerPlayed) {
      if(this.figure1 == 3) {
        this.figure1 = 1;
      }
      else {
        this.figure1++;
      }
    }
  }

  switchOpponentFigure() {
    // Stops only when both players have played
    if(!this.playerPlayed || !this.opponentPlayed) {
      if(this.figure2 == 3) {
        this.figure2 = 1;
      }
      else {
        this.figure2++;
      }
    }
  }

  showHistory() {
    this.history = this.gameHandler.getHistory()
    this.historyON = true;
  }

  hideHistory() {
    this.historyON = false;
  }

  back() {
    this.router.navigate( ['/'] );
  }
}
