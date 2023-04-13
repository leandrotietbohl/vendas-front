import VendaItemDTO from "./vendaItem.type";

export default interface VendaDTO {
    uid?: any | null,
    cliente?: any | null,
    itens: Array<VendaItemDTO>,
    valorDesconto: number,
    valorTotal: number,
    valorPago: number,
    valorTroco: number,
    formaPagamento: string,
    create: Date,
  }