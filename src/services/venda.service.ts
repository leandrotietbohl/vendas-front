import http from "../http-common";
import VendaDTO from "../types/venda.type";

class VendaService {

  create(data: VendaDTO) {
    return http.post<VendaDTO>("/vendas", data);
  }

}

export default new VendaService();