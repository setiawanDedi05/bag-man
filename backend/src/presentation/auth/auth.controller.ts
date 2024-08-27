import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "src/application/services/auth.service";
import { RegisterDto } from "./dto/register.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('register')
    async register(@Body() registerDto: RegisterDto){
        return this.authService.register(registerDto);
    }
}