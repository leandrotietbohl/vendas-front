import { Component } from "react";
import FuncionarioService from "../../services/funcionario.service";
import FuncionarioDTO from "../../types/funcionario.type";
import { Link } from "react-router-dom";
import Pagination from '@mui/material/Pagination'

type Props = {};

type State = {
  funcionario: Array<FuncionarioDTO>,
  currentFuncionario: FuncionarioDTO | null,
  currentIndex: number,
};

export default class FuncionarioList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.retrieveFuncionario = this.retrieveFuncionario.bind(this);
    this.refreshList = this.refreshList.bind(this);

    this.state = {
      funcionario: [],
      currentFuncionario: null,
      currentIndex: -1,
    };
  }

  componentDidMount() {
    this.retrieveFuncionario();
  }

  retrieveFuncionario() {
    FuncionarioService.getAll()
      .then((response) => {

        this.setState({
          funcionario: response.data,
        });

      })
      .catch((e) => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveFuncionario();
    this.setState({
      currentFuncionario: null,
      currentIndex: -1,
    });
  }

  setActiveFuncionario(funcionario: FuncionarioDTO, index: number) {
    this.setState({
      currentFuncionario: funcionario,
      currentIndex: index,
    });
  }

  render() {
    const {
      funcionario,
      currentFuncionario,
      currentIndex,
    } = this.state;

    return (
      <div className="row">
        <div className="col-6">
          <h4>Funcionarios</h4>
        </div>
        <div className="col-6">
          <div className="mb-3">
            <Link
              to={"/add_funcionario/"}
              className="btn btn-success">
              Adicionar novo funcionario
            </Link>
          </div>
        </div>

        <div className="col-8">
          <div className="mt-3">
            <Pagination
              className="my-3"
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              shape="rounded"
            />
          </div>
        </div>
        <div className="col-8">
          <ul className="list-group">
            {funcionario &&
              funcionario.map((funcionario, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveFuncionario(funcionario, index)}
                  key={index}
                >
                  <div className="row">
                    <div className="col-4">{funcionario.cpf}</div>
                    <div className="col-4">{funcionario.nome}</div>
                    <div className="col-4 custom-div-valor">R$ {funcionario.valorHora.toLocaleString('pt-br', {minimumFractionDigits: 2})}</div>
                  </div>
                </li>
              ))}
          </ul>


        </div>
        <div className="col-4">
          {currentFuncionario ? (
            <div>
              <h4>Funcionario</h4>
              <div>
                <label>
                  <strong>Nome:</strong>
                </label>{" "}
                {currentFuncionario.nome}
              </div>

              <Link
                to={"/list_Funcionario/" + currentFuncionario.cpf}
                className="badge badge-warning"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Selecione um Funcionario...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}