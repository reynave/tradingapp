import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io'; 

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  /**
   * DOC https://www.npmjs.com/package/ngx-socket-io
   */
  constructor(private socket: Socket) {}

  sendMessage(data: any) {
    this.socket.emit('data', data);
  }
  getMessage(): any {
    return this.socket.fromEvent('emiter');
  }
  

}
