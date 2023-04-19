import loginService from "../services/login.service";
import LoginDTO from "../types/login.type";


class AuthService {
    login(username: string, password: string) {
        const data: LoginDTO = {
            login: username,
            pass: password,
            tipo: "",
        };
        return loginService.valida(data).then(response => {
            if (response.data) {
                localStorage.setItem("user", response.data);
            }
            return response.data;
        }).catch((e) => {
            return e;
        });
    }

    logout() {
        localStorage.removeItem("user");
    }

    register(username: string, password: string) {
        const data: LoginDTO = {
            login: username,
            pass: password,
            tipo: "usuario",
        };
        return loginService.create(data);
    }

    getCurrentUser() {
        const userStr = localStorage.getItem("user");
        if (userStr) return userStr;
    
        return null;
      }
    }
    
    export default new AuthService();