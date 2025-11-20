// using cookies for JWT authentication
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies['access_token'];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    return { userId: payload.sub, email: payload.email };
  }
}


// using bearer token strategy for JWT authentication

// import { Injectable } from "@nestjs/common";
// import { PassportStrategy } from "@nestjs/passport";
// import { ExtractJwt, Strategy } from "passport-jwt";
// import { ConfigService } from "@nestjs/config";
// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//     constructor(config: ConfigService) {
//         super(
//                 {
//                     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//                     ignoreExpiration: false,
//                     secretOrKey: config.get('JWT_SECRET') 
//                 }
//         )
//     }
//     // async validate(payload: any) {
//     //     return { userId: payload.userId, email: payload.email };
//     //   }
//     async validate(payload: { sub: number; email: string }) {
//   return { userId: payload.sub, email: payload.email }; 
// }

// }