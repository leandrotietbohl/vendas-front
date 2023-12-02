import http from "../http-common";
import FuncionarioDTO from "../types/funcionario.type";

class FuncionarioService {

  create(data: FuncionarioDTO) {
    return http.post<FuncionarioDTO>("/funcionario", data);
  }

  get(id: string) {
    return http.get<FuncionarioDTO>(`/funcionario/${id}`);
  }

  getAll() {
    return http.get<Array<FuncionarioDTO>>("/funcionario/all");
  }

  edit(id: string, data: FuncionarioDTO) {
    return http.put<FuncionarioDTO>(`/funcionario/${id}`, data);
  }
  
  delete(id: string) {
    return http.delete<any>(`/funcionario/${id}`);
  }

}

export default new FuncionarioService();