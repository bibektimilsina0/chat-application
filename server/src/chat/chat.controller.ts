import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
    constructor(private readonly chatService: ChatService) {}
    @Get('messages/:otherUserId')
  async getMessages(
    @Req() req,
    @Param('otherUserId') otherUserId: number
  ) {
    // Verify the requesting user is part of the conversation
    return this.chatService.getMessages(req.user.id, Number(otherUserId));
  }
}

