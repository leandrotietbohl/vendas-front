import { Component, ChangeEvent } from "react";
import VendaDTO from "../../types/venda.type";
import ProdutoDTO from "../../types/produto.type";
import ProdutoService from "../../services/produto.service";
import VendaItemDTO from "../../types/vendaItem.type";
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {};

type State = VendaDTO & {
    produtos: Array<ProdutoDTO>,
    submitted: boolean,
    currentItem: VendaItemDTO | null,
    currentIndex: number,
};

export default class AddVenda extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.retrieveProdutos = this.retrieveProdutos.bind(this);
        this.newVenda = this.newVenda.bind(this);
        this.adicionarItem = this.adicionarItem.bind(this)
        this.onChangeQuantidade = this.onChangeQuantidade.bind(this);
        this.finalizarVenda = this.finalizarVenda.bind(this);
        this.removeItem = this.removeItem.bind(this);

        this.state = {
            itens: [],
            valorDesconto: 0,
            valorTotal: 0,
            produtos: [],
            submitted: false,
            currentIndex: -1,
            currentItem: null,
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
        const item = {
            produto: produto,
            quantidade: 1,
            valorItem: produto.valor
        };
        this.setState({
          currentItem: item,
          currentIndex: index,
        });
    }

    onChangeQuantidade(e: ChangeEvent<HTMLInputElement>) {
        const item = this.state.currentItem;
        if (item) {
            item.quantidade = e.target.valueAsNumber;
            item.valorItem = item.produto.valor * item.quantidade;
        }
        this.setState({
            currentItem: item,
        });
    }

    adicionarItem() {
        const list = this.state.itens;

        if (this.state.currentItem) {
            list.push(this.state.currentItem);
        }

        const sum = list.reduce((sum, x) => sum + x.valorItem, 0);

        this.setState({
            itens: list,
            valorTotal: sum,
            currentItem: null,
            currentIndex: -1,
        })
    }

    removeItem(index: number) {
        const list = this.state.itens;

        list.splice(index, 1);
        this.setState({
            itens: list,
        })
    }

    finalizarVenda() {

    }

    newVenda() {
        this.setState({
            itens: [],
            valorDesconto: 0,
            valorTotal: 0,
            produtos: [],
            currentIndex: -1,
            currentItem: null,
            submitted: false,
        });
    }

    render() {
        const { submitted, produtos, currentIndex, 
            currentItem, itens, valorTotal } = this.state;

        return (
            <div className="row">
                {submitted ? (
                    <div>
                        <h4>Venda efetuada com sucesso!</h4>
                        <button className="btn btn-success" onClick={this.newVenda}>
                            Voltar
                        </button>
                    </div>
                ) : (
                    <div className="col-md-6" id="flex">
                        {produtos &&
                          produtos.map((produto, index) => (
                            <div className={
                                    "m-1 list-group-item " +
                                    (index === currentIndex ? "active" : "")
                                }
                                onClick={() => this.setActiveProduto(produto, index)}>{produto.nome}</div>
                        ))}
                    </div>
                    )}
                <div className="col-md-6">
                    {currentItem ? (
                        <div>
                            <h3>Produto: <strong>{currentItem.produto.nome}</strong></h3>
                            <div>
                                <label>
                                <strong>Valor:</strong>
                                </label>{" R$ "}
                                {currentItem.produto.valor.toLocaleString('pt-br', {minimumFractionDigits: 2})}
                            </div>
                            {currentItem.produto.tipoMedida === "Unidade" ? (
                                <div>
                                    <label>
                                    <strong>Informe a Quantidade:</strong>
                                    </label>{" "}
                                    <input
                                        type="number"
                                        id="quantidade"
                                        required
                                        value={currentItem.quantidade}
                                        onChange={this.onChangeQuantidade}
                                        name="quantidade"
                                        />
                                </div>
                            ):(
                                <div>teste</div>
                            )}
                            <div>
                                <label>
                                <strong>Valor do item:</strong>
                                </label><strong>{" R$ "}
                                {currentItem.valorItem.toLocaleString('pt-br', {minimumFractionDigits: 2})}</strong>
                            </div>
                            <button
                                className="badge badge-success mr-2"
                                onClick={this.adicionarItem}
                                >
                                Adicionar Item
                            </button>
                        </div>
                    ) : (
                        <div>
                        <br />
                        <p>Selecione um produto...</p>
                        </div>
                    )}
                </div>
                {itens.length > 0 && (
                <div className="col-md-10">
                    <h3>Carrinho de compras</h3>
                    <ul className="list-group">
                        <li className="list-group-item">
                            <div className="row">
                                <div className="col-md-4"><strong>Produto</strong></div>
                                <div className="col-md-3 custom-div-valor"><strong>Valor unitario</strong></div>
                                <div className="col-md-2"><strong>Quantidade</strong></div>
                                <div className="col-md-2 custom-div-valor"><strong>Valor total</strong></div>
                                <div className="col-md-1"></div>
                            </div>
                        </li>
                    {itens.map((item, index) => (
                        <li className="list-group-item">
                            <div className="row">
                                <div className="col-md-4">{item.produto.nome}</div>
                                <div className="col-md-3 custom-div-valor">R$ {item.produto.valor.toLocaleString('pt-br', {minimumFractionDigits: 2})}</div>
                                <div className="col-md-2">{item.quantidade}</div>
                                <div className="col-md-2 custom-div-valor">R$ {item.valorItem.toLocaleString('pt-br', {minimumFractionDigits: 2})}</div>
                                <div className="col-md-1"><DeleteIcon onClick={() => this.removeItem(index)}/></div>
                            </div>
                        </li>
                    ))}
                    </ul>
                    <div className="mt-1">
                        <label>
                        <strong>Valor Total da compra:</strong>
                        </label><strong>{" R$ "}
                        {valorTotal.toLocaleString('pt-br', {minimumFractionDigits: 2})}</strong>
                    </div>
                    <button onClick={this.finalizarVenda} className="btn btn-success mt-3">
                        Finalizar Compra
                    </button>
                </div>
                )}
            </div>
        )
    }
}