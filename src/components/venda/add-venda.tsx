import { Component, ChangeEvent } from "react";
import VendaDTO from "../../types/venda.type";
import ProdutoDTO from "../../types/produto.type";
import ProdutoService from "../../services/produto.service";
import VendaItemDTO from "../../types/vendaItem.type";
import DeleteIcon from '@mui/icons-material/Delete';
import VendaService from "../../services/venda.service";
import { Select, MenuItem, SelectChangeEvent, Collapse, TextField, InputLabel, FormControl, InputAdornment, Autocomplete, Modal } from "@mui/material";
import moment from 'moment';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Alert from '@mui/material/Alert';
import CategoriaDTO from "../../types/categoria.type";
import CategoriaService from "../../services/categoria.service";
import CaixaService from "../../services/caixa.service";
import logo from "../../logobomcreampretoebranco.png";

type Props = {};

type State = VendaDTO & {
    produtos: Array<ProdutoDTO>,
    vendasEmAberto: Array<VendaDTO>,
    currentItem: VendaItemDTO | null,
    produtoID: string,
    produtoNome: string | null,
    categorias: Array<CategoriaDTO>,
    open: boolean,
    msg: string,
    openModel: boolean,
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
        this.imprimir = this.imprimir.bind(this);
        this.onPressEnterItem = this.onPressEnterItem.bind(this);
        this.onPressEnterPago = this.onPressEnterPago.bind(this);
        this.handleChangeProdutoOculto = this.handleChangeProdutoOculto.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            caixa: null,
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
            cliente: "",
            produtoNome: null,
            open: false,
            msg: "",
            openModel: false,
            categorias: [],
        };
    }

    componentDidMount() {
        this.retrieveCaixa()
        this.retrieveCategorias()
        this.retrieveProdutos();
        let pendentes = localStorage.getItem("pendentes");
        if (pendentes) {
            this.setState({
                vendasEmAberto: JSON.parse(pendentes),
            });
        }
    }

    retrieveCaixa() {
        CaixaService.get()
            .then((response) => {
                this.setState({
                    caixa: response.data.uid ? response.data.uid : "",
                });
            })
            .catch((e) => {
                console.log(e);
            });
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

    retrieveProdutos() {
        ProdutoService.getAll()
            .then((response) => {
                this.setState({
                    produtos: response.data,
                });
            })
            .catch((e) => {
                console.log(e);
            });
    }

    onChangeQuantidade(e: ChangeEvent<HTMLInputElement>) {
        const item = this.state.currentItem;
        if (item) {
            if (e.target.valueAsNumber <= 0 && item.produto.tipoMedida === "Unidade") {
                return;
            }
            if (e.target.valueAsNumber < 0 && item.produto.tipoMedida === "Kilograma") {
                return;
            }
            item.quantidade = e.target.valueAsNumber;
            item.valorItem = new Number((item.produto.valor * item.quantidade).toFixed(2)).valueOf();
        }
        this.setState({
            currentItem: item,
        });
    }

    onPressEnterItem(e: any) {
        if (e.key === 'Enter') {
            this.adicionarItem();
        }
    }

    onChangeValorItem(e: ChangeEvent<HTMLInputElement>) {
        const item = this.state.currentItem;
        if (item) {
            if (e.target.valueAsNumber < 0 && item.produto.tipoMedida === "Aleatorio") {
                return;
            }
            item.valorItem = e.target.valueAsNumber;
            item.quantidade = 1;
        }
        this.setState({
            currentItem: item,
        });
    }

    adicionarItem() {
        if (this.state.currentItem != null) {
            if (!this.state.currentItem.quantidade || this.state.currentItem.quantidade <= 0 ||
                !this.state.currentItem.valorItem || this.state.currentItem.valorItem <= 0) {
                return;
            }
        }

        const list = this.state.itens;
        const cliente = list.length > 0 ? this.state.cliente : "";
        if (this.state.currentItem) {
            var item = list.find((item) => item.produto.uid === this.state.currentItem?.produto.uid);
            if (item && item.produto.tipoMedida === "Unidade") {
                item.quantidade = item.quantidade + this.state.currentItem.quantidade;
                item.valorItem = new Number((item.produto.valor * item.quantidade).toFixed(2)).valueOf();
            } else {
                list.push(this.state.currentItem);
            }
        }

        const sum = list.reduce((sum, x) => sum + x.valorItem, 0);

        this.setState({
            itens: list,
            valorTotal: new Number(sum.toFixed(2)).valueOf(),
            valorPago: new Number(sum.toFixed(2)).valueOf(),
            valorTroco: 0,
            cliente: cliente,
            currentItem: null,
            produtoID: "",
            produtoNome: null,
        });
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
        if (e.target.valueAsNumber <= 0) {
            return;
        }
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

    onPressEnterPago(e: any) {
        if (e.key === 'Enter') {
            this.finalizarVenda();
        }
    }

    finalizarVenda() {
        if (!this.state.valorPago || this.state.valorPago <= 0) {
            this.setState({
                open: true,
                msg: "Valor Pago deve ser maior que zero",
            });
            return;
        }

        const stringDate = moment(new Date()).format('yyyy-MM-DDTHH:mm:ss');
        const data: VendaDTO = {
            caixa: this.state.caixa,
            itens: this.state.itens,
            valorDesconto: this.state.valorDesconto,
            valorTotal: this.state.valorTotal,
            create: stringDate,
            formaPagamento: this.state.formaPagamento,
            valorPago: this.state.valorPago,
            valorTroco: this.state.valorTroco,
            cliente: this.state.cliente
        };

        VendaService.create(data)
            .then((response: any) => {
                this.setState({
                    open: true,
                    msg: "Venda registrada com sucesso!",
                });

            })
            .catch((e: Error) => {
                console.log(e);
            });
        this.newVenda();
    }

    setActiveVenda(venda: VendaDTO, index: number) {
        const list = this.state.vendasEmAberto;
        list.splice(index, 1);

        if (this.state.itens && this.state.itens.length > 0) {
            const data: VendaDTO = {
                caixa: this.state.caixa,
                itens: this.state.itens,
                valorDesconto: this.state.valorDesconto,
                valorTotal: this.state.valorTotal,
                create: "",
                formaPagamento: this.state.formaPagamento,
                valorPago: this.state.valorPago,
                valorTroco: this.state.valorTroco,
                cliente: this.state.cliente,
            };
            list.push(data);
        }

        let obj = JSON.stringify(list);
        localStorage.setItem("pendentes", obj);

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
            caixa: this.state.caixa,
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

        let obj = JSON.stringify(list);
        localStorage.setItem("pendentes", obj);

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

    handleChangeProdutoOculto(event: any, value: string | null) {
        if (!value) {
            this.setState({
                produtoID: "",
                produtoNome: value,
                currentItem: null,
            });
            return;
        }
        var prod = null;
        for (let i = 0; i < this.state.produtos.length; i++) {
            if (this.state.produtos[i].nome === value) {
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
                produtoID: "",
                produtoNome: value,
                openModel: true,
            });
        }
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
                produtoNome: null,
                openModel: true,
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
            produtoNome: null,
        });
    }

    imprimir() {
        window.print();
    }

    handleClose() {
        this.setState({
            openModel: false,
            produtoID: "",
            produtoNome: null,
            currentItem: null,
        });
    }

    render() {
        const { produtos, currentItem, itens, valorTotal, formaPagamento, cliente, caixa, openModel,
            valorPago, valorTroco, produtoID, produtoNome, categorias, open, msg, vendasEmAberto } = this.state;

        return (
            <div>
                <FormControl fullWidth>
                    <Collapse in={open} addEndListener={this.finalizaAlert}>
                        <Alert severity={msg === "Venda registrada com sucesso!" ? "success" : "error"}
                            color={msg === "Venda registrada com sucesso!" ? "success" : "error"}>
                            {msg}
                        </Alert>
                    </Collapse>
                    {caixa ? (
                        <div className="row">
                            <div className="col-6 no-printme">
                                <div className="row">
                                    {categorias.map((categoria) => {
                                        if (categoria.tipo === "visivel") {
                                            return (
                                                <div className="titulo-central col-4" key={categoria.uid}>
                                                    <h4 className={"titulo-central custrom-font-buttom"}>{categoria.nome}</h4>
                                                    <ToggleButtonGroup
                                                        color="primary"
                                                        orientation="vertical"
                                                        value={produtoID}
                                                        className="ml-1 custom-botao-tamanho mb-2"
                                                        exclusive
                                                        onChange={this.handleChangeProduto}
                                                        aria-label="Platform"
                                                        key={categoria.uid}
                                                    >
                                                        {produtos &&
                                                            produtos.filter(prod => prod.categoria === categoria.uid)
                                                                .sort((n1, n2) => {
                                                                    if (n1.valor > n2.valor) {
                                                                        return 1;
                                                                    }

                                                                    if (n1.valor < n2.valor) {
                                                                        return -1;
                                                                    }

                                                                    return 0;
                                                                })
                                                                .map((produto, index) => (
                                                                    <ToggleButton className={"custom-botao-dentro custrom-font-buttom"}
                                                                        value={produto.uid} key={index}>{produto.nome}</ToggleButton>
                                                                ))}
                                                    </ToggleButtonGroup>
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div className="titulo-central col-4" key={categoria.uid}>
                                                    <h4 className={"titulo-central " + categoria.uid}>{categoria.nome}</h4>
                                                    <Autocomplete
                                                        disablePortal
                                                        id="combo-box-demo"
                                                        className="autocomplite-color"
                                                        value={produtoNome}
                                                        onChange={this.handleChangeProdutoOculto}
                                                        options={produtos.filter(prod => prod.categoria === categoria.uid)
                                                            .map((produto) => { return produto.nome })}
                                                        renderInput={(params) => (<TextField {...params} label={categoria.nome} />)}
                                                    />
                                                </div>
                                            )
                                        }
                                    }
                                    )}
                                </div>
                                {currentItem ? (
                                    <Modal
                                        open={openModel}
                                        onClose={this.handleClose}
                                        aria-labelledby="modal-modal-title"
                                        style={{
                                            marginTop: '200px',
                                            marginLeft: '150px',
                                            marginRight: '74%',
                                        }}
                                        aria-describedby="modal-modal-description">
                                        <div className="row pt-2 pb-2 ml-3 mt-3 add-item-color">
                                            <div className="col-12">
                                                <h5>Produto: <strong>{currentItem.produto.nome}</strong></h5>
                                            </div>
                                            <div className="col-12">
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
                                                            onKeyPress={this.onPressEnterItem}
                                                            autoFocus
                                                            InputProps={{
                                                                startAdornment: <InputAdornment position="start">Un</InputAdornment>,
                                                            }}
                                                            required
                                                            helperText="Quantidade deve ser maior ou igual a 1"
                                                        />
                                                    </div>
                                                )}
                                                {currentItem.produto.tipoMedida === "Kilograma" && (
                                                    <div>
                                                        <TextField id="quantidade" label="Quantidade" variant="outlined"
                                                            type="number"
                                                            value={currentItem.quantidade}
                                                            onChange={this.onChangeQuantidade}
                                                            onKeyPress={this.onPressEnterItem}
                                                            autoFocus
                                                            InputProps={{
                                                                startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
                                                            }}
                                                            helperText="Quantidade deve ser maior que zero"
                                                        />
                                                    </div>
                                                )}
                                                {currentItem.produto.tipoMedida === "Aleatorio" && (
                                                    <div>
                                                        <TextField id="valor" label="Valor" variant="outlined"
                                                            type="number"
                                                            value={currentItem.valorItem}
                                                            onChange={this.onChangeValorItem}
                                                            onKeyPress={this.onPressEnterItem}
                                                            autoFocus
                                                            InputProps={{
                                                                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                                            }}
                                                            helperText="Valor deve ser maior que zero"
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
                                            <div className="col-12">
                                                <button
                                                    className="btn btn-success mt-3"
                                                    onClick={this.adicionarItem}
                                                >
                                                    Adicionar Item
                                                </button>
                                            </div>
                                        </div>
                                    </Modal>
                                ) : (
                                    <div className="row mt-2">
                                    </div>
                                )}
                            </div>
                            {itens.length > 0 ? (
                                <div className="col-6 no-printme">
                                    <h3 className="titulo-central">Carrinho de compras</h3>
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
                                    <div className="row pt-3">
                                        <div className="col-md-4">
                                            <InputLabel id="formaPagamento-select-label" className="custom-select-label">Forma de pagamento</InputLabel>
                                            <Select
                                                labelId="formaPagamento-select-label"
                                                id="formaPagamento"
                                                value={formaPagamento}
                                                fullWidth
                                                label="Forma de pagamento"
                                                onChange={this.onChangeFormaPagamento}
                                                required
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
                                                    onKeyPress={this.onPressEnterPago}
                                                    autoFocus
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                                    }}
                                                    required
                                                    helperText="Valor Pago deve ser maior que zero"
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
                                        <div className="col-4">
                                            <button onClick={this.imprimir} className="btn btn-success mt-3">
                                                Imprimir
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            ) : (
                                <div className="col-6">
                                    <h4 className="titulo-central">Carrinho de compras</h4>
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
                            <div className="printme">
                                <img src={logo} alt={"logo"} style={{ width: '100%' }} />
                                <h1 className="titulo-central" style={{ fontSize: 'xxx-large', fontWeight: '600' }}>Compras</h1>
                                <ul className="list-group">
                                    <li className="list-group-item">
                                        <div className="row">
                                            <div className="col-5"><strong>Produto</strong></div>
                                            <div className="col-3 custom-div-valor"><strong>Valor item</strong></div>
                                            <div className="col-1 custom-div-center"><strong>Quant</strong></div>
                                            <div className="col-3 custom-div-valor"><strong>Total</strong></div>
                                        </div>
                                    </li>
                                    {itens.map((item, index) => (
                                        <li className="list-group-item" key={index}>
                                            <div className="row">
                                                <div className="col-5">{item.produto.nome}</div>
                                                <div className="col-3 custom-div-valor">R$ {item.produto.valor.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                                <div className="col-1 custom-div-center">{item.quantidade.toLocaleString('pt-br', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</div>
                                                <div className="col-3 custom-div-valor">R$ {item.valorItem.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
                                <div className="mt-1" style={{ textAlign: 'center' }}>
                                    <label>{new Date().toLocaleString()}</label>
                                </div>
                            </div>
                            {vendasEmAberto.length > 0 && (
                                <div className="col-8">
                                    <h4 className="titulo-central">Pagamentos Pendentes</h4>
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
                    ) : (
                        <div className="row">
                            Necessário abrir o caixa para efetuar vendas!
                        </div>
                    )}

                </FormControl>
            </div>
        )
    }
}