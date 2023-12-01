import MesTrabalhoDTO from "./mestrabalho.type";

export default interface AnoTrabalhoDTO {
    ano: number,
    meses: Array<MesTrabalhoDTO>,
  }