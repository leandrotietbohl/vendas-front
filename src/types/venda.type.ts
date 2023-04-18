import VendaItemDTO from "./vendaItem.type";

export default interface VendaDTO {
    uid?: string | null,
    caixa: string | null,
    cliente?: string | null,
    itens: Array<VendaItemDTO>,
    valorDesconto: number,
    valorTotal: number,
    valorPago: number,
    valorTroco: number,
    formaPagamento: string,
    create: string,
  }