import http from "../http-common";
import ProdutoDTO from "../types/produto.type";
import FilterProdutoDTO from "../types/produto-filter.type";
import PageProdutoDTO from "../types/produto-page.type";

class ProdutoService {

  create(data: ProdutoDTO) {
    return http.post<ProdutoDTO>("/produto", data);
  }

  filter(page: number, size: number,data: FilterProdutoDTO) {
    return http.post<PageProdutoDTO>(`/produto/filter2?page=${page}&size=${size}`, data);
  }

  get(id: string) {
    return http.get<ProdutoDTO>(`/produto/${id}`);
  }

  getAll() {
    return http.get<Array<ProdutoDTO>>("/produto/all");
  }

  edit(id: string, data: ProdutoDTO) {
    return http.put<ProdutoDTO>(`/produto/${id}`, data);
  }
  delete(id: string) {
    return http.delete<any>(`/produto/${id}`);
  }

}

export default new ProdutoService();