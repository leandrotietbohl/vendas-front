import ProdutoDTO from "./produto.type";

export default interface PageProdutoDTO {
  content: Array<ProdutoDTO>,
  totalElements: number,
  totalPages: number,
}