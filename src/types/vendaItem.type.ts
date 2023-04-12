import ProdutoDTO from "./produto.type";

export default interface VendaItemDTO {
    produto: ProdutoDTO,
    quantidade: number,
    valorItem: number,
  }