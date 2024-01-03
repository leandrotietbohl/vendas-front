import { Component, ChangeEvent } from "react";
import { RouteComponentProps } from 'react-router-dom';
import { Select, MenuItem, SelectChangeEvent, Tabs, Tab, TextField, InputAdornment } from "@mui/material";

import FuncionarioService from "../../services/funcionario.service";
import FuncionarioDTO from "../../types/funcionario.type";
import AnoTrabalhoDTO from "../../types/anotrabalho.type";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";

interface RouterProps {
  id: string;
}

type Props = RouteComponentProps<RouterProps>;

type State = {
  currentFuncionario: FuncionarioDTO,
  anoMes: AnoTrabalhoDTO,
  currentAno: number,
  newAno: number,
  aba: string,
  message: string;
}

export default class EditFuncionario extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.onChangeNome = this.onChangeNome.bind(this);
    this.onChangeValor = this.onChangeValor.bind(this);
    this.onChangeAno = this.onChangeAno.bind(this);
    this.onChangeNovoAno = this.onChangeNovoAno.bind(this);
    this.getFuncionario = this.getFuncionario.bind(this);
    this.updateFuncionario = this.updateFuncionario.bind(this);
    this.addNewAno = this.addNewAno.bind(this);
    this.deleteFuncionario = this.deleteFuncionario.bind(this);
    this.voltarLista = this.voltarLista.bind(this);
    this.onChangeHoraInicio1 = this.onChangeHoraInicio1.bind(this);
    this.onChangeHoraFim1 = this.onChangeHoraFim1.bind(this);
    this.onChangeHoraInicio2 = this.onChangeHoraInicio2.bind(this);
    this.onChangeHoraFim2 = this.onChangeHoraFim2.bind(this);
    this.onChangeValorVale = this.onChangeValorVale.bind(this);
    this.calculaValorHora = this.calculaValorHora.bind(this);

    this.state = {
      currentFuncionario: {
        cpf: null,
        nome: "",
        valorHora: 0,
        anos: [],
      },
      anoMes: {
        ano: 0,
        meses: [],
      },
      currentAno: 0,
      newAno: 0,
      aba: "",
      message: "",
    }
  }

  componentDidMount() {
    this.getFuncionario(this.props.match.params.id);
  }

  onChangeNome(e: ChangeEvent<HTMLInputElement>) {
    const nome = e.target.value;
    this.setState(function (prevState) {
      return {
        currentFuncionario: {
          ...prevState.currentFuncionario,
          nome: nome,
        },
      };
    });
  }

  onChangeValor(e: ChangeEvent<HTMLInputElement>) {
    const valor = e.target.valueAsNumber;
    this.setState(function (prevState) {
      return {
        currentFuncionario: {
          ...prevState.currentFuncionario,
          valorHora: valor,
        },
      };
    });
  }

  onChangeAno(event: SelectChangeEvent<number>) {
    const ano = event.target.value as number;
    
    this.setState({
      currentAno: ano,
      anoMes: this.state.currentFuncionario.anos.find((a : AnoTrabalhoDTO) => a.ano == ano) as AnoTrabalhoDTO,
    });
  }

  onChangeNovoAno(e: ChangeEvent<HTMLInputElement>) {
    const valor = e.target.valueAsNumber;
    this.setState({
      newAno: valor,
    });
  }

  onChangeHoraInicio1(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, mes: number, dia: number) {
    const tmp = this.state.anoMes;
    tmp.meses[mes-1].dias[dia-1].horaInicio1 = e.target.value;
    this.calculaValorHora(tmp, mes, dia);
    this.setState({
      anoMes: tmp,
    });
  }

  onChangeHoraFim1(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, mes: number, dia: number) {
    const tmp = this.state.anoMes;
    tmp.meses[mes-1].dias[dia-1].horaFim1 = e.target.value;
    this.calculaValorHora(tmp, mes, dia);
    this.setState({
      anoMes: tmp,
    });
  }

  onChangeHoraInicio2(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, mes: number, dia: number) {
    const tmp = this.state.anoMes;
    tmp.meses[mes-1].dias[dia-1].horaInicio2 = e.target.value;
    this.calculaValorHora(tmp, mes, dia);
    this.setState({
      anoMes: tmp,
    });
  }

  onChangeHoraFim2(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, mes: number, dia: number) {
    const tmp = this.state.anoMes;
    tmp.meses[mes-1].dias[dia-1].horaFim2 = e.target.value;
    this.calculaValorHora(tmp, mes, dia);
    this.setState({
      anoMes: tmp,
    });
  }

  onChangeValorVale(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, mes: number, dia: number) {
    const tmp = this.state.anoMes;
    tmp.meses[mes-1].dias[dia-1].valorVale = +e.target.value;
    this.calculaValorHora(tmp, mes, dia);
    this.setState({
      anoMes: tmp,
    });
  }

  calculaValorHora(tmp: AnoTrabalhoDTO, mes: number, dia: number) {
    var valor = this.state.currentFuncionario.valorHora;
    var h1 = tmp.meses[mes-1].dias[dia-1].horaInicio1;
    var h2 = tmp.meses[mes-1].dias[dia-1].horaFim1;
    var h3 = tmp.meses[mes-1].dias[dia-1].horaInicio2;
    var h4 = tmp.meses[mes-1].dias[dia-1].horaFim2;
    var vale = tmp.meses[mes-1].dias[dia-1].valorVale;
    var totalTrabalho: number = 0;
    if (h1 != null && h1.length > 4 && h2 != null && h2.length > 4) {
      var hm1 = h1.split(":");
      var hm2 = h2.split(":");
      var mt =(+hm2[0])*60+(+hm2[1])-(+hm1[0])*60+(+hm1[1]);
      totalTrabalho = mt*valor/60;
    } 
    if (h3 != null && h3.length > 4 && h4 != null && h4.length > 4) {
      var hm1 = h3.split(":");
      var hm2 = h4.split(":");
      var mt =(+hm2[0])*60+(+hm2[1])-(+hm1[0])*60+(+hm1[1]);
      totalTrabalho = totalTrabalho + mt*valor/60;
    }
    var totalDia: number = totalTrabalho;
    if (vale != null && vale > 0) {
      totalDia = totalDia - vale;
    }
    tmp.meses[mes-1].dias[dia-1].valorTrabalho = totalTrabalho;
    tmp.meses[mes-1].dias[dia-1].valorTotalDia = totalDia;
    tmp.meses[mes-1].valorMes = tmp.meses[mes-1].dias.map(d => d.valorTotalDia).reduce((prev, next) => prev + next);
  }


  handleChangeAba = (e: React.SyntheticEvent, newValue: string) => {
    this.setState({
        aba: newValue
    });
};

  getFuncionario(id: string) {
    FuncionarioService.get(id)
      .then((response: any) => {
        var ano = response.data.anos.find((a : AnoTrabalhoDTO) => a.ano == new Date().getFullYear());
        if (ano === undefined){
          FuncionarioService.addAno(response.data.cpf, new Date().getFullYear())
          .then((response: any) => {
            ano = response.data.anos[response.data.anos.length - 1];
            this.setState({
              currentFuncionario: response.data,
              currentAno: 2025,
              anoMes: response.data.anos[response.data.anos.length - 1],
              aba: (new Date().getMonth() + 1).toString(),
            });
          })
          .catch((e: Error) => {
            console.log(e);
          });
        } else {
          this.setState({
            currentFuncionario: response.data,
            currentAno: new Date().getFullYear(),
            anoMes: response.data.anos.find((a : AnoTrabalhoDTO) => a.ano == new Date().getFullYear()),
            aba: (new Date().getMonth() + 1).toString(),
          });
        }
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  updateFuncionario() {
    FuncionarioService.edit(
      this.state.currentFuncionario.cpf,
      this.state.currentFuncionario
    )
      .then((response: any) => {

        this.setState({
          message: "Sucesso ao alterar o funcionario!",
        });
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  addNewAno() {
    FuncionarioService.addAno(this.state.currentFuncionario.cpf, this.state.newAno)
      .then((response: any) => {
        this.setState({
          message: "Sucesso ao adicionar novo ano funcionario!",
          currentFuncionario: response.data,
          currentAno: this.state.newAno,
          anoMes: response.data.anos[response.data.anos.length - 1],
          aba: "1",
        });
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  deleteFuncionario() {
    FuncionarioService.delete(this.state.currentFuncionario.cpf)
      .then((response: any) => {

        this.voltarLista();
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  voltarLista() {
    this.props.history.push("/list_funcionario");
  }

  render() {
    const { currentFuncionario, currentAno, anoMes, aba, newAno } = this.state;

    return (
      <div>
        {currentFuncionario ? (
          <div className="edit-form ">
            <h4>Editar Funcionario</h4>
            <form>
              <div className="row">
                <div className="form-group col-2">
                  <label htmlFor="identificador">Identificador</label>
                  <input
                    type="text"
                    className="form-control"
                    id="identificador"
                    value={currentFuncionario.cpf}
                    disabled={true}
                  />
                </div>
                <div className="form-group col-6">
                  <label htmlFor="nome">Nome</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nome"
                    value={currentFuncionario.nome}
                    onChange={this.onChangeNome}
                  />
                </div>
                <div className="form-group col-2">
                  <label htmlFor="valorHora">Valor Hora</label>
                  <input
                    type="number"
                    className="form-control"
                    id="valorHora"
                    value={currentFuncionario.valorHora}
                    onChange={this.onChangeValor}
                  />
                </div>
                <div className="form-group col-2">
                  <label htmlFor="ano">Ano</label>
                  <Select
                    id="ano"
                    className="form-control"
                    value={currentAno}
                    label="Categoria"
                    onChange={this.onChangeAno}
                  >
                    {currentFuncionario.anos.map((ano) => (
                      <MenuItem value={ano.ano}>{ano.ano}</MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
                <TabContext value={aba}>
                  <div className="row">
                    <Tabs value={aba} onChange={this.handleChangeAba}>
                            {anoMes.meses.map((mes) => (
                                <Tab id={mes.numero.toString()} label={mes.mes} value={mes.numero.toString()} />
                            ))}
                    </Tabs>
                  </div>
                    {anoMes.meses.map((mes) => (
                        <TabPanel value={mes.numero.toString()} style={{width: "1300px"}}>
                          <div className="row mt-2">
                            <div className="col-1" style={{display: "contents"}}></div>
                            <div className="col-1"></div>
                            <div className="col-1"></div>
                            <div className="col-1"></div>
                            <div className="col-1"></div>
                            <div className="col-3"></div>
                            <div className="col-2">Valor Trabalhado</div>
                            <div className="col-2">Valor dia</div>
                          </div>
                          {mes.dias.map((dia) => (
                            <div className="row mt-2">
                              <div className="col-1" style={{display: "contents"}}>
                                <p style={{marginTop: "15px"}}>{dia.dia}</p>
                              </div>
                              <div className="col-1">
                                <TextField id="inicio1" label="Inicio" variant="outlined"
                                                            type="time"
                                                            focused={true}
                                                            value={dia.horaInicio1}
                                                            onChange={(e) => {this.onChangeHoraInicio1(e, mes.numero, dia.dia)}}
                                                        />
                              </div>
                              <div className="col-1">
                                <TextField id="fim1" label="Fim" variant="outlined"
                                                            type="time"
                                                            focused={true}
                                                            value={dia.horaFim1}
                                                            onChange={(e) => {this.onChangeHoraFim1(e, mes.numero, dia.dia)}}
                                                        />
                              </div>
                              <div className="col-1">
                                <TextField id="incio2" label="Inicio" variant="outlined"
                                                            type="time"
                                                            focused={true}
                                                            value={dia.horaInicio2}
                                                            onChange={(e) => {this.onChangeHoraInicio2(e, mes.numero, dia.dia)}}
                                                        />
                              </div>
                              <div className="col-1">
                                <TextField id="fim2" label="Fim" variant="outlined"
                                                            type="time"
                                                            focused={true}
                                                            value={dia.horaFim2}
                                                            onChange={(e) => {this.onChangeHoraFim2(e, mes.numero, dia.dia)}}
                                                        />
                              </div>
                              <div className="col-3">
                                <TextField id="valorVale" label="Valor Vale" variant="outlined"
                                                            type="number"
                                                            value={dia.valorVale}
                                                            onChange={(e) => {this.onChangeValorVale(e, mes.numero, dia.dia)}}
                                                            InputProps={{
                                                                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                                            }}
                                                        />
                              </div>
                              <div className="col-2">
                                <p style={{marginTop: "15px"}}>R$ {dia.valorTrabalho.toLocaleString('pt-br', 
                                  { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                              </div>
                              <div className="col-2">
                                {dia.valorTotalDia < 0 ? (
                                  <p style={{marginTop: "15px", color: "red"}}>R$ {dia.valorTotalDia.toLocaleString('pt-br', 
                                    { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                ) : (
                                  <p style={{marginTop: "15px"}}>R$ {dia.valorTotalDia.toLocaleString('pt-br', 
                                    { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                )}
                              </div>
                            </div>
                          ))}
                          <div className="row">
                            {mes.valorMes< 0 ? (
                              <p style={{marginTop: "15px", color: "red"}}>Valor total no mes: R$ {mes.valorMes.toLocaleString('pt-br', 
                              { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            ) : (
                              <p style={{marginTop: "15px"}}>Valor total no mes: R$ {mes.valorMes.toLocaleString('pt-br', 
                              { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            )}
                          </div>
                        </TabPanel>
                    ))}
                </TabContext>
               
            </form>
            <div className="row">
              <div className="form-group col-2">
                <label htmlFor="novoAno">Novo Ano</label>
                <input
                  type="number"
                  className="form-control"
                  id="novoAno"
                  value={newAno}
                  onChange={this.onChangeNovoAno}
                />
              </div>
              <div className="form-group col-2" style={{alignSelf: "end"}}>
                  <button type="submit"
                    className="btn btn-success"
                    onClick={this.addNewAno}>
                      Adicionar Novo Ano
                  </button>
              </div>
            </div>

            <div className="row">
              <button
                className="badge mr-2"
                onClick={this.voltarLista}
              >
                Voltar
              </button>

              <button
                className="badge badge-danger mr-2"
                onClick={this.deleteFuncionario}
              >
                Remover
              </button>

              <button
                type="submit"
                className="btn btn-success"
                onClick={this.updateFuncionario}
              >
                Atualizar
              </button>
            </div>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Selecione um funcionario...</p>
          </div>
        )}
      </div>
    );
  }
}
