import { Component, ChangeEvent } from "react";
import VendaDTO from "../../types/venda.type";
import ProdutoDTO from "../../types/produto.type";
import ProdutoService from "../../services/produto.service";

type Props = {};

type State = VendaDTO & {
    produtos: Array<ProdutoDTO>,
    submitted: boolean,
    currentProduto: ProdutoDTO | null,
    currentIndex: number,
};

export default class AddVenda extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.retrieveProdutos = this.retrieveProdutos.bind(this);
        this.newVenda = this.newVenda.bind(this);

        this.state = {
            itens: [],
            valorDesconto: 0,
            valorTotal: 0,
            produtos: [],
            submitted: false,
            currentIndex: -1,
            currentProduto: null,
        };
    }

    componentDidMount() {
        this.retrieveProdutos();
    }

    retrieveProdutos() { 
        ProdutoService.getAll()
          .then((response) => {
    
            this.setState({
                produtos: response.data,
            });
            console.log(response.data);
          })
          .catch((e) => {
            console.log(e);
          });
    }

    setActiveProduto(produto: ProdutoDTO, index: number) {
        this.setState({
          currentProduto: produto,
          currentIndex: index,
        });
    }

    newVenda() {
        this.setState({
            itens: [],
            valorDesconto: 0,
            valorTotal: 0,
            produtos: [],
            currentIndex: -1,
            currentProduto: null,
            submitted: false,
        });
    }

    render() {
        const { submitted, produtos, currentIndex, currentProduto } = this.state;

        return (
            <div>
                {submitted ? (
                    <div>
                        <h4>Venda efetuada com sucesso!</h4>
                        <button className="btn btn-success" onClick={this.newVenda}>
                            Voltar
                        </button>
                    </div>
                ) : (
                    <div id="flex">
                        {produtos &&
                          produtos.map((produto, index) => (
                            <div className={
                                    "list-group-item " +
                                    (index === currentIndex ? "active" : "")
                                }
                                onClick={() => this.setActiveProduto(produto, index)}>{produto.nome}</div>
                        ))}
                    </div>
                    )}
                <div className="col-md-12">
                    {currentProduto ? (
                        <div>
                            <h4>Produto</h4>
                            <div>
                                <label>
                                <strong>Nome:</strong>
                                </label>{" "}
                                {currentProduto.nome}
                            </div>
                            <div>
                                <label>
                                <strong>Valor:</strong>
                                </label>{" "}
                                {currentProduto.valor}
                            </div>
                            <div>
                                <label>
                                <strong>Medida:</strong>
                                </label>{" "}
                                {currentProduto.tipoMedida}
                            </div>
                        </div>
                    ) : (
                        <div>
                        <br />
                        <p>Selecione um produto...</p>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}