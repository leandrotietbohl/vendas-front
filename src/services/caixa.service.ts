import http from "../http-common";
import CaixaDTO from "../types/caixa.type";
import LancamentoDTO from "../types/lancamento.type";
import VendaDTO from "../types/venda.type";

class CategoriaService {

  abrir(data: CaixaDTO) {
    return http.post<CaixaDTO>("/caixa/abrir", data);
  }

  fechar(data: CaixaDTO) {
    return http.post<any>("/caixa/fechar", data);
  }

  get() {
    return http.get<CaixaDTO>("/caixa/get");
  }

  last() {
    return http.get<CaixaDTO>("/caixa/last");
  }

  getAll() {
    return http.get<Array<CaixaDTO>>("/caixa/all");
  }

  vendas(id: string) {
    return http.get<Array<VendaDTO>>(`/caixa/vendas/${id}`);
  }

  lancamento(data: LancamentoDTO) {
    return http.post<any>("/caixa/lancamentos/", data);
  }

  lancamentos(id: string) {
    return http.get<Array<LancamentoDTO>>(`/caixa/lancamentos/${id}`);
  }
}

export default new CategoriaService();