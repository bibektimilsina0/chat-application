import { Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/decorator/user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('friend')
export class FriendController {
    constructor(private friendService: FriendService) { }

    @Post('send/:receiverId')
    sendFriendRequest(@User() user, @Param('receiverId', ParseIntPipe) receiverId: number) {
        return this.friendService.sendFriendRequest(user.userId, receiverId);
    }
    @Post('accept/:requestId')
    acceptFriendRequest(@User() user, @Param('requestId', ParseIntPipe) requestId: number) {
        return this.friendService.acceptFriendRequest(user.userId, requestId);
    }
    @Post('reject/:requestId')
    rejectFriendRequest(@User() user, @Param('requestId', ParseIntPipe) requestId: number) {
        return this.friendService.rejectFriendRequest(user.userId, requestId);
    }
    // @Get()
    // listFriends(@User() user) {
    //     return this.friendService.listFriends(user.userId);
    // }
    @Get()
    listFriends(
        @User() user,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        return this.friendService.listFriends(user.userId, page, limit);
    }
    @Get('requests')
    listFriendRequests(@User() user) {
        return this.friendService.listFriendRequests(user.userId);
    }
}
