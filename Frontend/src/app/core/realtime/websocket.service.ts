import { Injectable, signal } from '@angular/core';
import { Observable, Subject, timer, retryWhen, delayWhen, tap } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<any> | null = null;
  private messagesSubject = new Subject<ChatMessage>();

  // Connection State
  private _isConnected = signal<boolean>(false);
  readonly isConnected = this._isConnected.asReadonly();

  // Config
  private readonly WS_URL = 'ws://localhost:3000/ws'; // Env var in real app
  private readonly RECONNECT_INTERVAL = 5000;

  public messages$ = this.messagesSubject.asObservable();

  connect() {
    if (this.socket$ && !this.socket$.closed) {
      return;
    }

    this.socket$ = webSocket({
      url: this.WS_URL,
      openObserver: {
        next: () => {
          console.log('WS Connected');
          this._isConnected.set(true);
        }
      },
      closeObserver: {
        next: () => {
          console.log('WS Closed');
          this._isConnected.set(false);
          this.socket$ = null;
        }
      }
    });

    this.socket$.pipe(
      retryWhen(errors =>
        errors.pipe(
          tap(err => console.error('WS Error', err)),
          delayWhen(() => timer(this.RECONNECT_INTERVAL))
        )
      )
    ).subscribe({
      next: (msg) => this.messagesSubject.next(msg as ChatMessage),
      error: (err) => console.error('WS Fatal Error', err)
    });
  }

  sendMessage(msg: any) {
    if (this.socket$) {
      this.socket$.next(msg);
    }
  }

  close() {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }
  }
}
