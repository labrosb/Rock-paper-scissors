import { Injectable } from '@angular/core'
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable()

export class ConnectorService {

  private socket;
  private url = environment.apiUrl;
  private connectionError: boolean = false;

  constructor() {
    this.socket = io(this.url);
    this.catchConnectionError();
    this.connectToPlayer();
  }

  connectToPlayer() {
    this.socket.emit('connect to player', '');
  }

  sendMove(move) {
    this.socket.emit('move', move);
  }

  checkIfPaired() {
    return Observable.create(observer => {
      this.socket.on('paired', msg => {
        observer.next(msg);
      });
    })
  }

  checkOpponentStatus() {
    return Observable.create(observer => {
      this.socket.on('opponent disconnected', msg => {
        observer.next(msg);
      });
    })
  }

  receiveMoves() {
    return Observable.create(observer => {
      this.socket.on('incoming move', move => {
        observer.next(move);
      });
    })
  }

 catchConnectionError() {
    this.socket.on('connect_error', data => {
      if(!this.connectionError) {
        alert("Connection Error");
        this.connectionError = true;
      }
    });
  }

  disconect() {
    this.socket.disconnect();
  }
}
