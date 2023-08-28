import { Body, Controller, Post } from '@nestjs/common';
import { AuthService, SignupParams } from './auth.service';

@Controller('auth')
export class AuthController {}
