import { api } from "../api"
import { endpoint } from "../endpoints";
import { LoginDto } from "./dto/loginDto"
import { RegisterDto } from "./dto/registerDto";

export const authService = {
    login  : async (credentials: LoginDto) => {
        return api.post(endpoint.auth.login, credentials);
    },
    register : async (user: RegisterDto) => {
        return api.post(endpoint.auth.register, user);
    },
    logout: async () => {
        return api.post(endpoint.auth.logout);
    },
    verifyEmail: async(token: string) => {
        return api.get(`${endpoint.auth.verifyEmail}?token=${token}`)
    }
}