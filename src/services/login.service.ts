import http from "../http-common";
import LoginDTO from "../types/login.type";

class LoginService {

  create(data: LoginDTO) {
    return http.post<any>("/login", data);
  }

  valida(data: LoginDTO) {
    return http.post<string>("/login/valida", data);
  }

}

export default new LoginService();