import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from 'src/auth/decorator/user.decorator';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get('profile')
  getProfile(@User() user) { 
    return this.userService.getProfile(user);
  }
  @Get('search')
  async searchUsers(
    @User() currentUser,
    @Query('query') query: string,
    @Query('limit') limit = 10
  ) {
    if (!query || query.length < 3) {
      return [];
    }
    
    console.log('Searching for users with query:', query);
    const users = await this.userService.searchUsers(query, limit);
    
    // Filter out current user and add friendship status
    const usersWithStatus = await Promise.all(
      users
        .filter(user => user.id !== currentUser.userId)
        .map(async (user) => {
          const [isFriend, friendRequestSent] = await Promise.all([
            this.userService.checkFriendship(currentUser.userId, user.id),
            this.userService.checkFriendRequest(currentUser.userId, user.id)
          ]);
          
          return {
            ...user,
            username: user.name.toLowerCase().replace(/\s+/g, '_'), // Generate username from name
            avatar: user.name.charAt(0).toUpperCase(), // First letter as avatar
            status: 'offline', // Default status, you can implement real status later
            isFriend,
            friendRequestSent
          };
        })
    );
    
    return usersWithStatus;
  }

}
