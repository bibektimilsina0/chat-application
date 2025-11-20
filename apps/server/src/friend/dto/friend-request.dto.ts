import { IsNumber, IsNotEmpty } from 'class-validator';

export class SendFriendRequestDto {
  @IsNumber()
  @IsNotEmpty()
  receiverId: number;
}

export class RespondToFriendRequestDto {
  @IsNumber()
  @IsNotEmpty()
  requestId: number;
}