import { Component, ChangeEvent } from "react";
import ProdutoService from "../../services/produto.service";
import FilterProdutoDTO from "../../types/produto-filter.type";
import ProdutoDTO from "../../types/produto.type";
import { Link } from "react-router-dom";
import Pagination from '@mui/material/Pagination'
import { Select , MenuItem, SelectChangeEvent } from "@mui/material";

type Props = {};

type State = {
    produtos: Array<ProdutoDTO>,
    currentProduto: ProdutoDTO | null,
    currentIndex: number,
    searchNome: string,
    page: number,
    count: number,
    pageSize: number,
};

export default class ProdutoList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.onChangeSearchNome = this.onChangeSearchNome.bind(this);
        this.retrieveProdutos = this.retrieveProdutos.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handlePageSizeChange = this.handlePageSizeChange.bind(this);

        this.state = {
            produtos: [],
            currentProduto: null,
            currentIndex: -1,
            searchNome: "",
    
            page: 1,
            count: 0,
            pageSize: 10,
        };
    }

    componentDidMount() {
        this.retrieveProdutos();
      }

    onChangeSearchNome(e: ChangeEvent<HTMLInputElement>) {
        const searchNome = e.target.value;
    
        this.setState({
            searchNome: searchNome,
        });
    }

    retrieveProdutos() {
        const data: FilterProdutoDTO = {
            nome: this.state.searchNome,
            start: null,
            end: null,
        };
    
        ProdutoService.filter(this.state.page - 1, this.state.pageSize, data)
          .then((response) => {
    
            this.setState({
                produtos: response.data.content,
                count: response.data.totalPages,
            });
            
          })
          .catch((e) => {
            console.log(e);
          });
      }

      refreshList() {
        this.retrieveProdutos();
        this.setState({
          currentProduto: null,
          currentIndex: -1,
        });
      }

      handlePageChange(event: ChangeEvent<unknown>, page: number) {
        this.setState(
          {
            page: page,
          },
          () => {
            this.retrieveProdutos();
          }
        );
      }
    
      handlePageSizeChange(event: SelectChangeEvent<number>) {
        const pageSize = event.target.value as number;
        this.setState(
          {
            pageSize: pageSize,
            page: 1
          },
          () => {
            this.retrieveProdutos();
          }
        );
      }

      setActiveProduto(produto: ProdutoDTO, index: number) {
        this.setState({
          currentProduto: produto,
          currentIndex: index,
        });
      }

      render() {
        const {
            searchNome,
          produtos,
          currentProduto,
          currentIndex,
          page,
          count,
          pageSize,
        } = this.state;
    
        return (
            <div className="row">
              <div className="col-6">
                <h4>Produtos</h4>
              </div>
              <div className="col-6">
                <div className="mb-3">
                    <Link
                        to={"/add_produto/"}
                        className="btn btn-success">
                        Adicionar novo produto
                    </Link>
                  </div>
              </div>
              <div className="col-8">
                <div className="input-group mb-3">
                  <input
                  type="text"
                  className="form-control"
                  placeholder="Pesquisar por nome"
                  value={searchNome}
                  onChange={this.onChangeSearchNome}
                  />
                  <div className="input-group-append">
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={this.retrieveProdutos} >
                        Pesquisar
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div>
                    {"Quantidade por pagina: "}
                      <Select
                          labelId="demo-simple-select-label"
                          id="pageSize"
                          value={pageSize}
                          label="Quantidade por pagina"
                          onChange={this.handlePageSizeChange} >
                          <MenuItem value={1}>1</MenuItem>
                          <MenuItem value={5}>5</MenuItem>
                          <MenuItem value={10}>10</MenuItem>
                      </Select>
                </div>
              </div>
              <div className="col-8">
                <div className="mt-3">
                  <Pagination
                    className="my-3"
                    count={count}
                    page={page}
                    siblingCount={1}
                    boundaryCount={1}
                    variant="outlined"
                    shape="rounded"
                    onChange={this.handlePageChange}
                  />
                </div>
              </div>
              <div className="col-8">
                <ul className="list-group">
                    {produtos &&
                    produtos.map((produto, index) => (
                        <li
                        className={
                            "list-group-item " +
                            (index === currentIndex ? "active" : "")
                        }
                        onClick={() => this.setActiveProduto(produto, index)}
                        key={index}
                        >
                          <div className="row">
                            <div className="col-4">{produto.nome}</div>
                            <div className="col-4">{produto.categoria}</div>
                            <div className="col-4 custom-div-valor">R$ {produto.valor.toLocaleString('pt-br', {minimumFractionDigits: 2})}</div>
                          </div>
                        </li>
                      ))}
                </ul>

                
                </div>
                <div className="col-4">
                {currentProduto ? (
                    <div>
                    <h4>Produto</h4>
                    <div>
                        <label>
                        <strong>Nome:</strong>
                        </label>{" "}
                        {currentProduto.nome}
                    </div>
                    
                    <Link
                        to={"/list_produto/" + currentProduto.uid}
                        className="badge badge-warning"
                    >
                        Edit
                    </Link>
                    </div>
                ) : (
                    <div>
                    <br />
                    <p>Selecione um produto...</p>
                    </div>
                )}
                </div>
            </div>
        );
    }
}