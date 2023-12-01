import AnoTrabalhoDTO from "./anotrabalho.type";

export default interface FuncionarioDTO {
    cpf?: any | null,
    nome: string,
    valorHora: number,
    anos: Array<AnoTrabalhoDTO>,
  }