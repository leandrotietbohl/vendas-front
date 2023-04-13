
import VendaDTO from "./venda.type";

export default interface PageVendaDTO {
  content: Array<VendaDTO>,
  totalElements: number,
  totalPages: number,
}