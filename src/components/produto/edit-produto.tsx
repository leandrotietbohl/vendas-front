import { Component, ChangeEvent } from "react";
import { RouteComponentProps } from 'react-router-dom';
import { Select , MenuItem, SelectChangeEvent } from "@mui/material";

import ProdutoService from "../../services/produto.service";
import ProdutoDTO from "../../types/produto.type";

interface RouterProps {
    id: string;
}

type Props = RouteComponentProps<RouterProps>;

type State = {
    currentProduto: ProdutoDTO;
    message: string;
}

export default class EditProduto extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.onChangeNome = this.onChangeNome.bind(this);
        this.onChangeValor = this.onChangeValor.bind(this);
        this.onChangeTipoMedida = this.onChangeTipoMedida.bind(this);
        this.getProduto = this.getProduto.bind(this);
        this.updateProduto = this.updateProduto.bind(this);
        this.deleteProduto = this.deleteProduto.bind(this);
        this.voltarLista = this.voltarLista.bind(this);

        this.state = {
            currentProduto: {
                uid: null,
                nome: "",
                valor: 0,
                tipoMedida: "",
            },
            message: "",
        }
    }

    componentDidMount() {
        this.getProduto(this.props.match.params.id);
    }

    onChangeNome(e: ChangeEvent<HTMLInputElement>) {
        const nome = e.target.value;
        this.setState(function (prevState) {
            return {
                currentProduto: {
                ...prevState.currentProduto,
                nome: nome,
              },
            };
        });
    }

    onChangeValor(e: ChangeEvent<HTMLInputElement>) {
        const valor = e.target.valueAsNumber;
        this.setState(function (prevState) {
            return {
                currentProduto: {
                ...prevState.currentProduto,
                valor: valor,
              },
            };
        });
    }

    onChangeTipoMedida(event: SelectChangeEvent<string>) {
      const tipo = event.target.value as string;
      this.setState(function (prevState) {
        return {
            currentProduto: {
            ...prevState.currentProduto,
            tipoMedida: tipo,
          },
        };
    });
    }

    getProduto(id: string) {
        ProdutoService.get(id)
          .then((response: any) => {
            this.setState({
                currentProduto: response.data,
            });
            console.log(response.data);
          })
          .catch((e: Error) => {
            console.log(e);
          });
    }

    updateProduto() {
        ProdutoService.edit(
          this.state.currentProduto.uid,
          this.state.currentProduto
        )
          .then((response: any) => {
            console.log(response.data);
            this.setState({
              message: "Sucesso ao alterar o produto!",
            });
          })
          .catch((e: Error) => {
            console.log(e);
          });
    }
    
    deleteProduto() {
        ProdutoService.delete(this.state.currentProduto.uid)
          .then((response: any) => {
            console.log(response.data);
            this.voltarLista();
          })
          .catch((e: Error) => {
            console.log(e);
          });
    }

    voltarLista() {
        this.props.history.push("/list_produto");
    }

    render() {
        const { currentProduto } = this.state;
    
        return (
          <div>
            {currentProduto ? (
              <div className="edit-form">
                <h4>Produto</h4>
                <form>
                  <div className="form-group">
                    <label htmlFor="title">ID</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      value={currentProduto.uid}
                      disabled={true}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="title">Nome</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      value={currentProduto.nome}
                      onChange={this.onChangeNome}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Valor</label>
                    <input
                      type="number"
                      className="form-control"
                      id="description"
                      value={currentProduto.valor}
                      onChange={this.onChangeValor}
                    />
                  </div>
                  <div className="form-group">
                      <label htmlFor="tipo">Tipo de Medida</label>
                      <Select
                          labelId="demo-simple-select-label"
                          id="tipo"
                          className="form-control"
                          value={currentProduto.tipoMedida}
                          label="Tipo de medida"
                          onChange={this.onChangeTipoMedida} >
                          <MenuItem value={"Unidade"}>Unidade</MenuItem>
                          <MenuItem value={"Kilograma"}>Kilograma</MenuItem>
                          <MenuItem value={"Aleatorio"}>Aleatorio</MenuItem>
                      </Select>
                  </div>
                </form>

                <button
                  className="badge mr-2"
                  onClick={this.voltarLista}
                >
                  Voltar
                </button>
    
                <button
                  className="badge badge-danger mr-2"
                  onClick={this.deleteProduto}
                >
                  Remover
                </button>
    
                <button
                  type="submit"
                  className="btn btn-success"
                  onClick={this.updateProduto}
                >
                  Atualizar
                </button>
                <p>{this.state.message}</p>
              </div>
            ) : (
              <div>
                <br />
                <p>Selecione um produto...</p>
              </div>
            )}
          </div>
        );
    }
}
    