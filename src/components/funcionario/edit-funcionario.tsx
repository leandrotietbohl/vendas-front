import { Component, ChangeEvent } from "react";
import { RouteComponentProps } from 'react-router-dom';
import { Select, MenuItem, SelectChangeEvent, Tabs, Tab } from "@mui/material";

import FuncionarioService from "../../services/funcionario.service";
import FuncionarioDTO from "../../types/funcionario.type";
import AnoTrabalhoDTO from "../../types/anotrabalho.type";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { FieldChangeHandler } from "@mui/x-date-pickers/internals/hooks/useField";

interface RouterProps {
  id: string;
}

type Props = RouteComponentProps<RouterProps>;

type State = {
  currentFuncionario: FuncionarioDTO,
  anoMes: AnoTrabalhoDTO,
  currentAno: number,
  aba: string,
  message: string;
}

export default class EditFuncionario extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.onChangeNome = this.onChangeNome.bind(this);
    this.onChangeValor = this.onChangeValor.bind(this);
    this.onChangeAno = this.onChangeAno.bind(this);
    this.getFuncionario = this.getFuncionario.bind(this);
    this.updateFuncionario = this.updateFuncionario.bind(this);
    this.deleteFuncionario = this.deleteFuncionario.bind(this);
    this.voltarLista = this.voltarLista.bind(this);
    this.onChangeHoraInicio1 = this.onChangeHoraInicio1.bind(this);
    this.onChangeHoraFim1 = this.onChangeHoraFim1.bind(this);

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
      anoMes: this.state.currentFuncionario.anos[this.state.currentFuncionario.anos.length - 1],
    });
  }

  onChangeHoraInicio1(e: ChangeEvent<HTMLInputElement>, mes: number, dia: number) {
    const tmp = this.state.anoMes;
        for (let i = 0; i < tmp.meses.length; i++) {
          if (tmp.meses[i].numero === mes) {
            for (let j = 0; j < tmp.meses[i].dias.length; i++) {
              if (tmp.meses[i].dias[j].dia === dia) {
                tmp.meses[i].dias[j].horaInicio1 = e.target.value;
                tmp.meses[i].dias[j].valorPeriodo1 = 1;
                break;
              }
            }
          }
        }

    this.setState({
      anoMes: tmp,
    });
  }

  onChangeHoraFim1(e: ChangeEvent<HTMLInputElement>, mes: number, dia: number) {
    const tmp = this.state.anoMes;
        for (let i = 0; i < tmp.meses.length; i++) {
          if (tmp.meses[i].numero === mes) {
            for (let j = 0; j < tmp.meses[i].dias.length; i++) {
              if (tmp.meses[i].dias[j].dia === dia) {
                tmp.meses[i].dias[j].horaFim1 = e.target.value;
                tmp.meses[i].dias[j].valorPeriodo1 = 2;
                console.log(tmp.meses[i].dias[j]);
                break;
              }
            }
          }
        }

    this.setState({
      anoMes: tmp,
    });
  }


  handleChangeAba = (e: React.SyntheticEvent, newValue: string) => {
    this.setState({
        aba: newValue
    });
};

  getFuncionario(id: string) {
    FuncionarioService.get(id)
      .then((response: any) => {
        this.setState({
          currentFuncionario: response.data,
          currentAno: new Date().getFullYear(),
          anoMes: response.data.anos[response.data.anos.length - 1],
          aba: (new Date().getMonth() + 1).toString(),
        });

      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  updateFuncionario() {
    /*FuncionarioService.edit(
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
      });*/
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
    const { currentFuncionario, currentAno, anoMes, aba } = this.state;

    return (
      <div>
        {currentFuncionario ? (
          <div className="edit-form ">
            <h4>Editar Funcionario</h4>
            <form>
              <div className="row">
                <div className="form-group col-2">
                  <label htmlFor="title">Identificador</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={currentFuncionario.cpf}
                    disabled={true}
                  />
                </div>
                <div className="form-group col-6">
                  <label htmlFor="title">Nome</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={currentFuncionario.nome}
                    onChange={this.onChangeNome}
                  />
                </div>
                <div className="form-group col-2">
                  <label htmlFor="description">Valor Hora</label>
                  <input
                    type="number"
                    className="form-control"
                    id="description"
                    value={currentFuncionario.valorHora}
                    onChange={this.onChangeValor}
                  />
                </div>
                <div className="form-group col-2">
                  <label htmlFor="categoria">Ano</label>
                  <Select
                    id="categoria"
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
                  <div className="row">
                    {anoMes.meses.map((mes) => (
                        <TabPanel value={mes.numero.toString()} >
                          {mes.dias.map((dia) => (
                            <div className="row">
                              <div className="col-1">
                                {dia.dia}
                              </div>
                              <div className="col-2">
                                <input type="time" name="incio" value={dia.horaInicio1} onChange={(e) => {this.onChangeHoraInicio1(e, mes.numero, dia.dia)}}/>
                              </div>
                              <div className="col-2">
                                <input type="time" name="fim" value={dia.horaFim1} onChange={(e) => {this.onChangeHoraFim1(e, mes.numero, dia.dia)}}/>
                              </div>
                              <div className="col-1">
                                <input
                                  type="number"
                                  className="form-control"
                                  id="description"
                                  value={dia.valorPeriodo1}
                                />
                              </div>
                              <div className="col-1">
                                -
                              </div>
                              <div className="col-2">
                                <input type="time" name="incio2" value={dia.horaInicio2}/>
                              </div>
                              <div className="col-2">
                                <input type="time" name="fim2" value={dia.horaFim2}/>
                              </div>
                              <div className="col-1">
                              <input
                                  type="number"
                                  className="form-control"
                                  id="description"
                                  value={dia.valorPeriodo2}
                                />
                              </div>
                            </div>
                          ))}
                        </TabPanel>
                    ))}
                  </div>
                </TabContext>
            </form>
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
