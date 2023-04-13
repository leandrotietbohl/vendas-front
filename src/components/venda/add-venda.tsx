import { Component, ChangeEvent } from "react";
import VendaDTO from "../../types/venda.type";
import ProdutoDTO from "../../types/produto.type";
import ProdutoService from "../../services/produto.service";
import VendaItemDTO from "../../types/vendaItem.type";
import DeleteIcon from '@mui/icons-material/Delete';
import VendaService from "../../services/venda.service";
import { Select , MenuItem, SelectChangeEvent } from "@mui/material";
import moment, { Moment } from 'moment';

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
        this.onChangeValorItem= this.onChangeValorItem.bind(this);
        this.finalizarVenda = this.finalizarVenda.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.onChangeFormaPagamento = this.onChangeFormaPagamento.bind(this);
        this.onChangeValorPago = this.onChangeValorPago.bind(this);

        this.state = {
            itens: [],
            valorDesconto: 0,
            valorTotal: 0,
            produtos: [],
            submitted: false,
            currentIndex: -1,
            currentItem: null,
            create: "",
            formaPagamento: "Dinheiro",
            valorPago: 0,
            valorTroco: 0,
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
            quantidade: produto.tipoMedida === "Kilograma" ? 0 : 1,
            valorItem: produto.tipoMedida === "Kilograma" ? 0 : produto.valor,
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

    onChangeValorItem(e: ChangeEvent<HTMLInputElement>) {
        const item = this.state.currentItem;
        if (item) {
            item.valorItem = e.target.valueAsNumber;
            item.quantidade = 1;
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
            valorPago: sum,
            currentItem: null,
            currentIndex: -1,
        })
    }

    removeItem(index: number, item: VendaItemDTO) {
        const list = this.state.itens;
        const valorTotal = this.state.valorTotal - item.valorItem;

        list.splice(index, 1);
        this.setState({
            itens: list,
            valorTotal: valorTotal,
        })
    }

    onChangeFormaPagamento(event: SelectChangeEvent<string>) {
        const tipo = event.target.value as string;
        const valorTotal = this.state.valorTotal;
        this.setState({
            formaPagamento: tipo,
            valorPago: valorTotal,
            valorTroco: 0,
        });
    }

    onChangeValorPago(e: ChangeEvent<HTMLInputElement>) {
        const valorTotal = this.state.valorTotal;
        this.setState({
            valorPago: e.target.valueAsNumber,
            valorTroco: e.target.valueAsNumber - valorTotal,
        });
    }

    finalizarVenda() {
        const stringDate = moment(new Date()).format('yyyy-MM-DDTHH:mm:ss');
        console.log(stringDate);
        const data: VendaDTO = {
            itens: this.state.itens,
            valorDesconto: this.state.valorDesconto,
            valorTotal: this.state.valorTotal,
            create: stringDate,
            formaPagamento: this.state.formaPagamento,
            valorPago: this.state.valorPago,
            valorTroco: this.state.valorTroco,
        };

        console.log(data);

        VendaService.create(data)
            .then((response: any) => {
                this.setState({
                    submitted: true,
                });
                console.log(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
        this.newVenda();

    }

    newVenda() {
        this.setState({
            uid: null,
            itens: [],
            valorDesconto: 0,
            valorTotal: 0,
            formaPagamento: "Dinheiro",
            valorPago: 0,
            valorTroco: 0,
            currentIndex: -1,
            currentItem: null,
            submitted: false,
        });
    }

    render() {
        const { submitted, produtos, currentIndex, 
            currentItem, itens, valorTotal, formaPagamento, valorPago, valorTroco } = this.state;

        return (
            <div>
                <h2 className="titulo-venda">Cadastrar venda</h2>
                {submitted ? (
                    <div>
                        <h4>Venda efetuada com sucesso!</h4>
                        <button className="btn btn-success" onClick={this.newVenda}>
                            Nova compra
                        </button>
                    </div>
                ) : (
                    <div className="row">
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
                        <div className="col-md-6">
                        {currentItem ? (
                            <div>
                                <h3>Produto: <strong>{currentItem.produto.nome}</strong></h3>
                                <div>
                                    <label>
                                    <strong>Valor:</strong>
                                    </label>{" R$ "}
                                    {currentItem.produto.valor.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </div>
                                {currentItem.produto.tipoMedida === "Unidade" && (
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
                                        <label>Un</label>
                                    </div>
                                )} 
                                {currentItem.produto.tipoMedida === "Kilograma" && (
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
                                        <label>Kg</label>
                                    </div>
                                )}
                                {currentItem.produto.tipoMedida === "Aleatorio" && (
                                    <div>
                                        <label>
                                        <strong>Informe o valor:</strong>
                                        </label>{"R$ "}
                                        <input
                                            type="number"
                                            id="valor"
                                            required
                                            value={currentItem.valorItem}
                                            onChange={this.onChangeValorItem}
                                            name="valor"
                                            />
                                        <label></label>
                                    </div>
                                )}
                                {!(currentItem.produto.tipoMedida === "Aleatorio") && (
                                <div>
                                    <label>
                                    <strong>Valor do item:</strong>
                                    </label><strong>{" R$ "}
                                    {currentItem.valorItem.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
                                </div>
                                )}
                                <button
                                    className="btn btn-success mt-3"
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
                </div>
                    )}
                
                {itens.length > 0 ? (
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
                                <div className="col-md-3 custom-div-valor">R$ {item.produto.valor.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                                <div className="col-md-2">{item.quantidade.toLocaleString('pt-br', {minimumFractionDigits: 4, maximumFractionDigits: 4})}</div>
                                <div className="col-md-2 custom-div-valor">R$ {item.valorItem.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                                <div className="col-md-1"><DeleteIcon onClick={() => this.removeItem(index, item)}/></div>
                            </div>
                        </li>
                    ))}
                    </ul>
                    <div className="mt-1">
                        <label>
                        <strong>Valor Total da compra:</strong>
                        </label><strong>{" R$ "}
                        {valorTotal.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <label htmlFor="formaPagamento">Forma de pagamento</label>
                            <Select
                                labelId="demo-simple-select-label"
                                id="formaPagamento"
                                value={formaPagamento}
                                label="Forma de pagamento"
                                onChange={this.onChangeFormaPagamento}
                            >
                                <MenuItem value={"Dinheiro"}>Dinheiro</MenuItem>
                                <MenuItem value={"Debito"}>Debito</MenuItem>
                                <MenuItem value={"Credito"}>Credito</MenuItem>
                                <MenuItem value={"PIX"}>PIX</MenuItem>
                            </Select>
                        </div>
                        {formaPagamento === "Dinheiro" ? (
                            <div className="col-md-5">
                                <label>
                                <strong>Valor Pago:</strong>
                                </label>{"R$ "}
                                <input
                                    type="number"
                                    id="valorPago"
                                    required
                                    value={valorPago}
                                    onChange={this.onChangeValorPago}
                                    name="valorPago"
                                    />
                            </div>
                        ) : (
                            <div className="col-md-3">
                                <label>
                                <strong>Valor Pago:</strong>
                                </label><strong>{" R$ "}
                                {valorPago.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
                            </div>
                        )}
                            <div className="col-md-3">
                                <label>
                                <strong>Troco:</strong>
                                </label><strong>{" R$ "}
                                {valorTroco.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
                            </div>
                    </div>
                    <button onClick={this.finalizarVenda} className="btn btn-success mt-3">
                        Finalizar Compra
                    </button>
                </div>
                ) : (<div></div>)}
            </div>
        )
    }
}