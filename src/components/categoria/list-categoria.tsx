import { Component } from "react";
import CategoriaService from "../../services/categoria.service";
import CategoriaDTO from "../../types/categoria.type";
import { Link } from "react-router-dom";
import Pagination from '@mui/material/Pagination'

type Props = {};

type State = {
  categorias: Array<CategoriaDTO>,
  currentCategoria: CategoriaDTO | null,
  currentIndex: number,
};

export default class CategoriaList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.retrieveCategorias = this.retrieveCategorias.bind(this);
    this.refreshList = this.refreshList.bind(this);

    this.state = {
      categorias: [],
      currentCategoria: null,
      currentIndex: -1,
    };
  }

  componentDidMount() {
    this.retrieveCategorias();
  }

  retrieveCategorias() {
    CategoriaService.getAll()
      .then((response) => {

        this.setState({
          categorias: response.data,
        });

      })
      .catch((e) => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveCategorias();
    this.setState({
      currentCategoria: null,
      currentIndex: -1,
    });
  }

  setActiveCategoria(categoria: CategoriaDTO, index: number) {
    this.setState({
      currentCategoria: categoria,
      currentIndex: index,
    });
  }

  render() {
    const {
      categorias,
      currentCategoria,
      currentIndex,
    } = this.state;

    return (
      <div className="row">
        <div className="col-6">
          <h4>Categorias</h4>
        </div>
        <div className="col-6">
          <div className="mb-3">
            <Link
              to={"/add_categoria/"}
              className="btn btn-success">
              Adicionar novo categoria
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
            {categorias &&
              categorias.map((categoria, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveCategoria(categoria, index)}
                  key={index}
                >
                  <div className="row">
                    <div className="col-4">{categoria.nome}</div>
                    <div className="col-4">{categoria.ordem}</div>
                    <div className="col-4">{categoria.tipo}</div>
                  </div>
                </li>
              ))}
          </ul>


        </div>
        <div className="col-4">
          {currentCategoria ? (
            <div>
              <h4>Categoria</h4>
              <div>
                <label>
                  <strong>Nome:</strong>
                </label>{" "}
                {currentCategoria.nome}
              </div>

              <Link
                to={"/list_categoria/" + currentCategoria.uid}
                className="badge badge-warning"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Selecione um categoria...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}