import http from "../http-common";
import FilterVendaDTO from "../types/venda-filter.type";
import PageVendaDTO from "../types/venda-page.type";
import VendaDTO from "../types/venda.type";

class VendaService {

  create(data: VendaDTO) {
    return http.post<VendaDTO>("/vendas", data);
  }

  filter(page: number, size: number,data: FilterVendaDTO) {
    return http.post<PageVendaDTO>(`/vendas/filter?page=${page}&size=${size}`, data);
  }

  filterList(data: FilterVendaDTO) {
    return http.post<Array<VendaDTO>>("/vendas/filter_all", data);
  }

  delete(id: string) {
    return http.delete<any>(`/vendas/${id}`);
  }

  edit(id: string, data: VendaDTO) {
    return http.put<VendaDTO>(`/vendas/${id}`, data);
  }

}

export default new VendaService();