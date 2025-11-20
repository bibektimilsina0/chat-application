import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ChatService } from "./chat.service";
import {Server, Socket} from "socket.io";
import * as cookie from 'cookie';
import { ForbiddenException } from "@nestjs/common";

@WebSocketGateway({ 
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  } 
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private jwt: JwtService, private chatService: ChatService) {}

//   handleConnection(client: Socket) {
//        try {
//       const token = client.handshake.auth?.token;
//       if (!token) {
//         throw new ForbiddenException('Authentication token missing');
//       }

//       const payload = this.jwt.verify(token);
//       client.data.user = payload;
//     } catch (error) {
//       client.disconnect();
//     }
//   }


async handleConnection(client: Socket) {
  try {
    const cookies = cookie.parse(client.handshake.headers.cookie || '')
    console.log('Cookies:', cookies);
    const token = cookies['access_token'] 
    console.log('Token:', token);
    if (!token) throw new ForbiddenException('Token missing');

    const payload = await this.jwt.verifyAsync(token);
    console.log('Payload:', payload);
    client.data.user = payload;
    
    // Join the user to their personal room
    const userId = payload.sub;
    await client.join(`user_${userId}`);
    console.log(`User ${userId} joined room: user_${userId}`);
    
  } catch (error) {
    console.error('Connection error:', error);
    client.disconnect();
  }
}

handleDisconnect(client: Socket) {
  const userId = client.data.user?.sub;
  if (userId) {
    console.log(`User ${userId} disconnected`);
  }
}


  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() payload: { to: number; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = client.data.user.sub;
    const receiverId = payload.to;
    
    // Check if users are friends
    const areFriends = await this.chatService.areFriends(senderId, receiverId);
    if (!areFriends) {
      throw new ForbiddenException('You can only message friends');
    }

    const message = await this.chatService.saveMessage(senderId, receiverId, payload.content);
    
    const messageData = {
      id: message.id,
      from: senderId,
      content: message.content,
      timestamp: message.timestamp,
    };

    // Send to receiver
    this.server.to(`user_${receiverId}`).emit('receive_message', messageData);
    
    // Send confirmation back to sender
    client.emit('message_sent', {
      ...messageData,
      to: receiverId,
    });

    console.log(`Message sent from ${senderId} to ${receiverId}: ${message.content}`);
    
    return message;
  }

  @SubscribeMessage('mark_as_read')
  async handleMarkAsRead(
    @MessageBody() payload: { messageIds: number[] },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.sub; // Fixed: was using userId instead of sub
    await this.chatService.markMessagesAsRead(payload.messageIds, userId);
    return { status: 'success' };
  }
}
