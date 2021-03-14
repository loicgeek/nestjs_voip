import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class RoomGateway implements OnGatewayInit {
  private logger: Logger = new Logger('RoomGateway');
  private activeSockets = [];
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    this.logger.log('new connection');
    const existingSocket = this.activeSockets.find(
      (existingSocket) => existingSocket === socket.id,
    );

    if (!existingSocket) {
      this.activeSockets.push(socket.id);

      socket.emit('update-user-list', {
        users: this.activeSockets.filter(
          (existingSocket) => existingSocket !== socket.id,
        ),
      });

      socket.broadcast.emit('update-user-list', {
        users: [socket.id],
      });
    }

    socket.on('call-user', (data: any) => {
      socket.to(data.to).emit('call-made', {
        offer: data.offer,
        socket: socket.id,
      });
    });

    socket.on('make-answer', (data) => {
      socket.to(data.to).emit('answer-made', {
        socket: socket.id,
        answer: data.answer,
      });
    });

    socket.on('reject-call', (data) => {
      socket.to(data.from).emit('call-rejected', {
        socket: socket.id,
      });
    });

    socket.on('disconnect', () => {
      this.activeSockets = this.activeSockets.filter(
        (existingSocket) => existingSocket !== socket.id,
      );
      socket.broadcast.emit('remove-user', {
        socketId: socket.id,
      });
    });
  }

  afterInit(server: any) {
    this.logger.log(`Ws server initialized`);
  }
}
