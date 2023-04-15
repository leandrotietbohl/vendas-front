import { Component, ChangeEvent } from "react";
import VendaDTO from "../../types/venda.type";
import ProdutoDTO from "../../types/produto.type";
import ProdutoService from "../../services/produto.service";
import VendaItemDTO from "../../types/vendaItem.type";
import DeleteIcon from '@mui/icons-material/Delete';
import VendaService from "../../services/venda.service";
import { Select, MenuItem, SelectChangeEvent, Collapse, TextField, InputLabel, FormControl, InputAdornment } from "@mui/material";
import moment from 'moment';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Alert from '@mui/material/Alert';

type Props = {};

type State = VendaDTO & {
    produtos: Array<ProdutoDTO>,
    vendasEmAberto: Array<VendaDTO>,
    currentItem: VendaItemDTO | null,
    produtoID: string,
    categorias: Array<any>,
    open: boolean,
};

export default class AddVenda extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.retrieveProdutos = this.retrieveProdutos.bind(this);
        this.newVenda = this.newVenda.bind(this);
        this.adicionarItem = this.adicionarItem.bind(this)
        this.onChangeQuantidade = this.onChangeQuantidade.bind(this);
        this.onChangeValorItem = this.onChangeValorItem.bind(this);
        this.finalizarVenda = this.finalizarVenda.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.onChangeFormaPagamento = this.onChangeFormaPagamento.bind(this);
        this.onChangeValorPago = this.onChangeValorPago.bind(this);
        this.handleChangeProduto = this.handleChangeProduto.bind(this);
        this.finalizaAlert = this.finalizaAlert.bind(this);
        this.pagamentoPendente = this.pagamentoPendente.bind(this);
        this.setActiveVenda = this.setActiveVenda.bind(this);
        this.onChangeCliente = this.onChangeCliente.bind(this);

        this.state = {
            itens: [],
            vendasEmAberto: [],
            valorDesconto: 0,
            valorTotal: 0,
            produtos: [],
            currentItem: null,
            create: "",
            formaPagamento: "Dinheiro",
            valorPago: 0,
            valorTroco: 0,
            produtoID: "",
            open: false,
            categorias: [
                { id: "expresso", name: "Expresso" },
                { id: "milk", name: "Milkshake" },
                { id: "artesanal", name: "Artesanal" },
                { id: "acai", name: "Açaí" },
                { id: "crepe", name: "Crepe" },
                { id: "aleatorio", name: "Aleatório" }],
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
        const cliente = list.length > 0 ? this.state.cliente :  null;
        if (this.state.currentItem) {
            list.push(this.state.currentItem);
        }

        const sum = list.reduce((sum, x) => sum + x.valorItem, 0);

        this.setState({
            itens: list,
            valorTotal: sum,
            valorPago: sum,
            valorTroco: 0,
            cliente: cliente,
            currentItem: null,
            produtoID: "",
        })
    }

    removeItem(index: number, item: VendaItemDTO) {
        const list = this.state.itens;
        const valorTotal = this.state.valorTotal - item.valorItem;

        list.splice(index, 1);
        this.setState({
            itens: list,
            valorTotal: valorTotal,
            valorPago: valorTotal,
            valorTroco: 0,
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

    onChangeCliente(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            cliente: e.target.value,
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
                    open: true,
                });
                console.log(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
        this.newVenda();
    }

    setActiveVenda(venda: VendaDTO, index: number) {
        const list = this.state.vendasEmAberto;
        list.splice(index, 1);

        this.setState({
            vendasEmAberto: list,
            formaPagamento: venda.formaPagamento,
            itens: venda.itens,
            valorDesconto: venda.valorDesconto,
            valorTotal: venda.valorTotal,
            valorPago: venda.valorPago,
            valorTroco: venda.valorTroco,
            cliente: venda.cliente,
        });

    }

    pagamentoPendente() {
        const data: VendaDTO = {
            itens: this.state.itens,
            valorDesconto: this.state.valorDesconto,
            valorTotal: this.state.valorTotal,
            create: "",
            formaPagamento: this.state.formaPagamento,
            valorPago: this.state.valorPago,
            valorTroco: this.state.valorTroco,
            cliente: this.state.cliente,
        };

        const list = this.state.vendasEmAberto;

        list.push(data);

        this.setState({
            vendasEmAberto: list,
        });
        this.newVenda();
    }

    async finalizaAlert() {
        await new Promise(res => setTimeout(res, 5000));
        this.setState({
            open: false,
        })
    }

    handleChangeProduto(event: React.MouseEvent<HTMLElement>,
        idProduto: string) {
        var prod = null;
        for (let i = 0; i < this.state.produtos.length; i++) {
            if (this.state.produtos[i].uid === idProduto) {
                prod = this.state.produtos[i];
                break;
            }
        }

        if (prod) {
            const item = {
                produto: prod,
                quantidade: prod.tipoMedida === "Kilograma" ? 0 : 1,
                valorItem: prod.tipoMedida === "Kilograma" ? 0 : prod.valor,
            };
            this.setState({
                currentItem: item,
                produtoID: idProduto,
            });
        }
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
            currentItem: null,
            produtoID: "",
        });
    }

    render() {
        const { produtos, currentItem, itens, valorTotal, formaPagamento, cliente,
            valorPago, valorTroco, produtoID, categorias, open, vendasEmAberto } = this.state;

        return (
            <div>
                <FormControl fullWidth>
                    <Collapse in={open} addEndListener={this.finalizaAlert}>
                        <Alert severity="success" color="success">
                            Venda registrada com sucesso!
                        </Alert>
                    </Collapse>
                    <div className="row">
                        <div className="col-6">
                            <div className="row">
                                {categorias.map((categoria) => (
                                    <div className="titulo-central col-4" key={categoria.id}>
                                        <h4 className={"titulo-central " + categoria.id}>{categoria.name}</h4>
                                        <ToggleButtonGroup
                                            color="primary"
                                            orientation="vertical"
                                            value={produtoID}
                                            className="ml-1 custom-botao-tamanho mb-2" 
                                            exclusive
                                            onChange={this.handleChangeProduto}
                                            aria-label="Platform"
                                            key={categoria.id}
                                        >
                                            {produtos &&
                                                produtos.filter(prod => prod.categoria === categoria.id).map((produto, index) => (
                                                    <ToggleButton className={"font-pricipal "  + categoria.id}
                                                        value={produto.uid} key={index}>{produto.nome}</ToggleButton>
                                                ))}
                                        </ToggleButtonGroup>
                                    </div>
                                ))}
                            </div>
                            {currentItem ? (
                                <div className="row mt-2 ml-3">
                                    <div className="col-12">
                                        <h5>Produto: <strong>{currentItem.produto.nome}</strong></h5>
                                    </div>
                                    <div className="col-6">
                                        {!(currentItem.produto.tipoMedida === "Aleatorio") && (
                                            <div>
                                                <label>
                                                    <strong>Valor:</strong>
                                                </label>{" R$ "}
                                                {currentItem.produto.valor.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </div>
                                        )}
                                        {currentItem.produto.tipoMedida === "Unidade" && (
                                            <div>
                                                <TextField id="quantidade" label="Quantidade" variant="outlined"
                                                    type="number"
                                                    value={currentItem.quantidade}
                                                    onChange={this.onChangeQuantidade}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">Un</InputAdornment>,
                                                    }}

                                                />
                                            </div>
                                        )}
                                        {currentItem.produto.tipoMedida === "Kilograma" && (
                                            <div>
                                                <TextField id="quantidade" label="Quantidade" variant="outlined"
                                                    type="number"
                                                    value={currentItem.quantidade}
                                                    onChange={this.onChangeQuantidade}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
                                                    }}

                                                />
                                            </div>
                                        )}
                                        {currentItem.produto.tipoMedida === "Aleatorio" && (
                                            <div>
                                                <TextField id="valor" label="Valor" variant="outlined"
                                                    type="number"
                                                    value={currentItem.valorItem}
                                                    onChange={this.onChangeValorItem}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                                    }}
                                                />
                                            </div>
                                        )}
                                        {!(currentItem.produto.tipoMedida === "Aleatorio") && (
                                            <div>
                                                <label>
                                                    <strong>Valor do item:</strong>
                                                </label><strong>{" R$ "}
                                                    {currentItem.valorItem.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-6">
                                        <button
                                            className="btn btn-success mt-3"
                                            onClick={this.adicionarItem}
                                        >
                                            Adicionar Item
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="row mt-2">
                                </div>
                            )}
                        </div>
                        {itens.length > 0 ? (
                            <div className="col-6">
                                <h3>Carrinho de compras</h3>
                                <ul className="list-group">
                                    <li className="list-group-item">
                                        <div className="row">
                                            <div className="col-4"><strong>Produto</strong></div>
                                            <div className="col-3 custom-div-valor"><strong>Valor unitario</strong></div>
                                            <div className="col-2"><strong>Quantidade</strong></div>
                                            <div className="col-2 custom-div-valor"><strong>Total</strong></div>
                                            <div className="col-1"></div>
                                        </div>
                                    </li>
                                    {itens.map((item, index) => (
                                        <li className="list-group-item" key={index}>
                                            <div className="row">
                                                <div className="col-4">{item.produto.nome}</div>
                                                <div className="col-3 custom-div-valor">R$ {item.produto.valor.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                                <div className="col-2">{item.quantidade.toLocaleString('pt-br', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</div>
                                                <div className="col-2 custom-div-valor">R$ {item.valorItem.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                                <div className="col-1"><DeleteIcon onClick={() => this.removeItem(index, item)} /></div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-1">
                                    <label>
                                        <strong>Valor Total da compra:</strong>
                                    </label><strong>{" R$ "}
                                        {valorTotal.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <InputLabel id="formaPagamento-select-label" className="custom-select-label">Forma de pagamento</InputLabel>
                                        <Select
                                            labelId="formaPagamento-select-label"
                                            id="formaPagamento"
                                            value={formaPagamento}
                                            fullWidth
                                            label="Forma de pagamento"
                                            onChange={this.onChangeFormaPagamento}
                                        >
                                            <MenuItem value={"Dinheiro"}> Dinheiro </MenuItem>
                                            <MenuItem value={"Debito"}> Debito </MenuItem>
                                            <MenuItem value={"Credito"}> Credito </MenuItem>
                                            <MenuItem value={"PIX"}> PIX </MenuItem>
                                        </Select>
                                    </div>
                                    {formaPagamento === "Dinheiro" ? (
                                        <div className="col-md-5">
                                            <TextField id="valorPago" label="Valor Pago" variant="outlined"
                                                type="number"
                                                value={valorPago}
                                                onChange={this.onChangeValorPago}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="col-md-5">
                                            <label>
                                                <strong>Valor Pago:</strong>
                                            </label><strong>{" R$ "}
                                                {valorPago.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                        </div>
                                    )}
                                    <div className="col-md-3">
                                        <label>
                                            <strong>Troco:</strong>
                                        </label><strong>{" R$ "}
                                            {valorTroco.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-4">
                                        <TextField id="valorPago" label="Cliente" variant="outlined"
                                            type="text"
                                            value={cliente}
                                            onChange={this.onChangeCliente}
                                        />
                                    </div>
                                    <div className="col-4">
                                        <button onClick={this.pagamentoPendente} className="btn btn-warning mt-3">
                                            Pagamento pendente
                                        </button>
                                    </div>
                                    <div className="col-4">
                                        <button onClick={this.finalizarVenda} className="btn btn-success mt-3">
                                            Finalizar Compra
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ) : (
                            <div className="col-6">
                                <h4>Carrinho de compras</h4>
                                <ul className="list-group">
                                    <li className="list-group-item">
                                        <div className="row">
                                            <div className="col-4"><strong>Produto</strong></div>
                                            <div className="col-3 custom-div-valor"><strong>Valor unitario</strong></div>
                                            <div className="col-2"><strong>Quantidade</strong></div>
                                            <div className="col-2 custom-div-valor"><strong>Total</strong></div>
                                            <div className="col-1"></div>
                                        </div>
                                    </li>
                                    <li className="list-group-item">
                                        <div className="row">
                                            <div className="col-4">Sem itens adicionados</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        )}
                        {vendasEmAberto.length > 0 && (
                                <div className="col-8">
                                <h4>Pagamentos Pendentes</h4>
                                <ul className="list-group">
                                    <li className="list-group-item">
                                        <div className="row">
                                            <div className="col-4"><strong>Cliente</strong></div>
                                            <div className="col-2"><strong>Itens</strong></div>
                                            <div className="col-3 custom-div-valor"><strong>Valor Total</strong></div>
                                            <div className="col-2 custom-div-valor"><strong>Valor Pago</strong></div>
                                        </div>
                                    </li>
                                    {vendasEmAberto.map((venda, index) => (
                                        <li className="list-group-item"
                                            onClick={() => this.setActiveVenda(venda, index)}
                                            key={index}>
                                            <div className="row">
                                                <div className="col-4">{venda.cliente}</div>
                                                <div className="col-2">{venda.itens.length.toLocaleString('pt-br', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</div>
                                                <div className="col-3 custom-div-valor">R$ {venda.valorTotal.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                                <div className="col-2 custom-div-valor">R$ {venda.valorPago.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>

                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </FormControl>
            </div>
        )
    }
}