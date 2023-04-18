import { Component, ChangeEvent } from "react";
import { RouteComponentProps } from 'react-router-dom';
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";

import CategoriaService from "../../services/categoria.service";
import CategoriaDTO from "../../types/categoria.type";

interface RouterProps {
  id: string;
}

type Props = RouteComponentProps<RouterProps>;

type State = {
  currentCategoria: CategoriaDTO;
  message: string;
}

export default class EditCategoria extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.onChangeNome = this.onChangeNome.bind(this);
    this.onChangeOrdem = this.onChangeOrdem.bind(this);
    this.onChangeTipo = this.onChangeTipo.bind(this);
    this.getCategoria = this.getCategoria.bind(this);
    this.updateCategoria = this.updateCategoria.bind(this);
    this.deleteCategoria = this.deleteCategoria.bind(this);
    this.voltarLista = this.voltarLista.bind(this);

    this.state = {
      currentCategoria: {
        uid: null,
        nome: "",
        ordem: 0,
        tipo: "",
      },
      message: "",
    }
  }

  componentDidMount() {
    this.getCategoria(this.props.match.params.id);
  }

  onChangeNome(e: ChangeEvent<HTMLInputElement>) {
    const nome = e.target.value;
    this.setState(function (prevState) {
      return {
        currentCategoria: {
          ...prevState.currentCategoria,
          nome: nome,
        },
      };
    });
  }

  onChangeOrdem(e: ChangeEvent<HTMLInputElement>) {
    const ordem = e.target.valueAsNumber;
    this.setState(function (prevState) {
      return {
        currentCategoria: {
          ...prevState.currentCategoria,
          ordem: ordem,
        },
      };
    });
  }

  onChangeTipo(event: SelectChangeEvent<string>) {
    const tipo = event.target.value as string;
    this.setState(function (prevState) {
      return {
        currentCategoria: {
          ...prevState.currentCategoria,
          tipo: tipo,
        },
      };
    });
  }

  getCategoria(id: string) {
    CategoriaService.get(id)
      .then((response: any) => {
        this.setState({
          currentCategoria: response.data,
        });

      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  updateCategoria() {
    CategoriaService.edit(
      this.state.currentCategoria.uid,
      this.state.currentCategoria
    )
      .then((response: any) => {

        this.setState({
          message: "Sucesso ao alterar o categoria!",
        });
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  deleteCategoria() {
    CategoriaService.delete(this.state.currentCategoria.uid)
      .then((response: any) => {

        this.voltarLista();
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  voltarLista() {
    this.props.history.push("/list_categoria");
  }

  render() {
    const { currentCategoria } = this.state;

    return (
      <div>
        {currentCategoria ? (
          <div className="edit-form">
            <h4>Editar Categoria</h4>
            <form>
              <div className="form-group">
                <label htmlFor="title">ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={currentCategoria.uid}
                  disabled={true}
                />
              </div>
              <div className="form-group">
                <label htmlFor="title">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={currentCategoria.nome}
                  onChange={this.onChangeNome}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Ordem</label>
                <input
                  type="number"
                  className="form-control"
                  id="description"
                  value={currentCategoria.ordem}
                  onChange={this.onChangeOrdem}
                />
              </div>
              <div className="form-group">
                <label htmlFor="tipo">Tipo</label>
                <Select
                  labelId="demo-simple-select-label"
                  id="tipo"
                  className="form-control"
                  value={currentCategoria.tipo}
                  label="Tipo de medida"
                  onChange={this.onChangeTipo} >
                  <MenuItem value={"visivel"}>Visivel</MenuItem>
                  <MenuItem value={"oculto"}>Oculto</MenuItem>
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
              onClick={this.deleteCategoria}
            >
              Remover
            </button>

            <button
              type="submit"
              className="btn btn-success"
              onClick={this.updateCategoria}
            >
              Atualizar
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Selecione um categoria...</p>
          </div>
        )}
      </div>
    );
  }
}
