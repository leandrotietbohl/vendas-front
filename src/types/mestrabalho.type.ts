import DiaTrabalhoDTO from "./diatrabalho.type";

export default interface MesTrabalhoDTO {
    numero: number,
    mes: string,
    dias: Array<DiaTrabalhoDTO>,
    valorMes: number,
  }