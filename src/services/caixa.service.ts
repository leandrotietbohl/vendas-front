import http from "../http-common";
import CaixaDTO from "../types/caixa.type";

class CategoriaService {

  abrir(data: CaixaDTO) {
    return http.post<any>("/caixa/abrir", data);
  }

  fechar(data: CaixaDTO) {
    return http.post<any>("/caixa/fechar", data);
  }

  get() {
    return http.get<CaixaDTO>("/caixa/get");
  }

  getAll() {
    return http.get<Array<CaixaDTO>>("/caixa/all");
  }
}

export default new CategoriaService();