import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}

  async sendFriendRequest(senderId: number, receiverId: number) {
    // Prevent self-friending
    if (senderId === receiverId) {
      throw new ForbiddenException('Cannot send friend request to yourself');
    }

    // Check if user exists
    const receiverExists = await this.prisma.user.findUnique({
      where: { id: receiverId }
    });
    if (!receiverExists) {
      throw new NotFoundException('receiving user not found');
    }

    // Check for existing requests
    const existingRequest = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      }
    });

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        throw new ForbiddenException('Friend request already pending');
      }
      if (existingRequest.status === 'accepted') {
        throw new ForbiddenException('Already friends');
      }
    }

    return this.prisma.friendRequest.create({
      data: {
        senderId,
        receiverId,
        status: 'pending',
      },
    });
  }


  async acceptFriendRequest(userId: number, requestId: number) {
    const request = await this.prisma.friendRequest.findUnique({
      where: { id: requestId }
    });

    if (!request) {
      throw new NotFoundException('Friend request not found');
    }

    if (request.receiverId !== userId) {
      throw new ForbiddenException('Not authorized to accept this request');
    }

    if (request.status !== 'pending') {
      throw new ForbiddenException('Friend request is not pending');
    }

    return this.prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'accepted' },
    });
  }
  async rejectFriendRequest(userId: number, requestId: number) {
        const request = await this.prisma.friendRequest.findUnique({
      where: { id: requestId }
    });

    if (!request) {
      throw new NotFoundException('Friend request not found');
    }

    if (request.receiverId !== userId) {
      throw new ForbiddenException('Not authorized to reject this request');
    }
        if (request.status !== 'pending') {
      throw new ForbiddenException('Friend request is not pending');
    }
    const updateRequest = await this.prisma.friendRequest.update({
      where: {
        id: requestId,
        receiverId: userId,
      },
      data: {
        status: 'rejected',
      },
    });
    return updateRequest;
  }
//   async listFriends(userId: number) {
//     const friends = await this.prisma.friendRequest.findMany({
//       where: {
//         OR: [
//           { senderId: userId, status: 'accepted' },
//           { receiverId: userId, status: 'accepted' },
//         ],
//       },
//       select: {
//         sender: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         receiver: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//       },
//     });

//     return friends;
//   }
  // chat.service.ts
async listFriends(userId: number) {
  const friendRequests = await this.prisma.friendRequest.findMany({
    where: {
      OR: [
        { senderId: userId, status: 'accepted' },
        { receiverId: userId, status: 'accepted' },
      ],
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Transform the data to return just the friend (other user)
  return friendRequests.map(request => {
    // Determine who is the friend (the other user)
    const friend = request.senderId === userId ? request.receiver : request.sender;
    
    return {
      id: friend.id,
      name: friend.name,
      email: friend.email,
    };
  });
}
  async listFriendRequests(userId: number) {
    const requests = await this.prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: 'pending',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    return requests.map(request => ({
      id: request.id,
      senderId: request.sender.id,
      senderName: request.sender.name,
      senderEmail: request.sender.email,
      CreatedAt: request.sender.createdAt,
    }));
  }
}
