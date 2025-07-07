import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(user: { userId: number; email: string }) {
    const fullUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return fullUser;
  }
    async searchUsers(query: string, limit: number) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });
  }

  async checkFriendship(senderId: number, receiverId: number) {
    // Check both directions for accepted friendship
    const request = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId, status: 'accepted' },
          { senderId: receiverId, receiverId: senderId, status: 'accepted' }
        ]
      }
    });
    return !!request;
  }

  async checkFriendRequest(senderId: number, receiverId: number) {
    const request = await this.prisma.friendRequest.findFirst({
      where: {
        senderId,
        receiverId,
        status: 'pending'
      }
    });
    return !!request;
  }
}
