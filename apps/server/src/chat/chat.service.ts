import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async saveMessage(senderId: number, receiverId: number, content: string) {
    return this.prisma.message.create({
      data: { senderId, receiverId, content },
    });
  }

  async getMessages(userA: number, userB: number) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userA, receiverId: userB },
          { senderId: userB, receiverId: userA },
        ],
      },
      orderBy: { timestamp: 'asc' },
    });
  }
  async areFriends(userA: number, userB: number): Promise<boolean> {
    const friendRequest = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: userA, receiverId: userB, status: 'accepted' },
          { senderId: userB, receiverId: userA, status: 'accepted' },
        ],
      },
    });
    return !!friendRequest;
  }
    async markMessagesAsRead(messageIds: number[], userId: number) {
    return this.prisma.message.updateMany({
      where: {
        id: { in: messageIds },
        receiverId: userId,
      },
      data: { read: true },
    });
  }
}

