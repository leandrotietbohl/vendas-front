import { Component, ChangeEvent } from "react";
import CaixaDTO from "../../types/caixa.type";
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/en-gb';
import moment from "moment";
import FormControl from "@mui/material/FormControl/FormControl";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import caixaService from "../../services/caixa.service";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, InputAdornment, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, InputLabel, Select, MenuItem, SelectChangeEvent, Collapse, Alert } from "@mui/material";
import VendaDTO from "../../types/venda.type";
import LancamentoDTO from "../../types/lancamento.type";

type Props = {};

type State = CaixaDTO & {
    start: Dayjs | null,
    end: Dayjs | null,
    lancamentos: Array<LancamentoDTO>,
    descricaoLancamento: string,
    tipoLancamento: string,
    valorLancamento: number,
    userLancamento: string,
    vendas: Array<VendaDTO>,
    valorCaixaAnterior: number,
    valorSunTotal: number,
    valorSunPago: number,
    valorSunTroco: number,
    valorPIXTotal: number,
    valorDinheiroTotal: number,
    valorDebitoCreditoTotal: number,
    valorTotalCaixa: number,
    openLancamentoSucess: boolean,
};

export default class AddCaixa extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.fecharCaixa = this.fecharCaixa.bind(this);
        this.abrirCaixa = this.abrirCaixa.bind(this);
        this.onChangeUser = this.onChangeUser.bind(this);
        this.onChangeValorLancamento = this.onChangeValorLancamento.bind(this);
        this.adicionarLancamento = this.adicionarLancamento.bind(this);
        this.finalizaAlert = this.finalizaAlert.bind(this);
        this.onChangeDescricaoLancamento = this.onChangeDescricaoLancamento.bind(this);
        this.onChangeTipoLancamento = this.onChangeTipoLancamento.bind(this);
        this.onChangeUserLancamento = this.onChangeUserLancamento.bind(this);

        this.state = {
            start: dayjs(new Date().toISOString()),
            end: dayjs(new Date().toISOString()),
            lancamentos: [],
            descricaoLancamento: "",
            tipoLancamento: "",
            valorLancamento: 0,
            userLancamento: "",
            openLancamentoSucess: false,
            vendas: [],
            valorCaixaAnterior: 0,
            user: "",
            inicio: null,
            userInicio: null,
            valorInicioDinheiro: null,
            fim: null,
            userFim: null,
            valorFimDinheiro: null,
            valorSunTotal: 0,
            valorSunPago: 0,
            valorSunTroco: 0,
            valorPIXTotal: 0,
            valorDinheiroTotal: 0,
            valorDebitoCreditoTotal: 0,
            valorTotalCaixa: 0,
        };
    }

    componentDidMount() {
        this.retrieveUltimoCaixa();
        this.retrieveCaixa();
    }

    retrieveCaixa() {
        caixaService.get()
            .then((response) => {
                this.setState({
                    uid: response.data.uid,
                });
                this.retrieveVendas();
                this.retrieveLancamentos();
            })
            .catch((e) => {
                console.log(e);
            });
    }

    calculaValorNoCaixa() {
        const lancamentos = this.state.lancamentos;
        const valorAdicionado = lancamentos.filter(v => v.tipo === "Credito")
            .reduce((sum, x) => sum + x.valor, 0);
        const valorRetirado = lancamentos.filter(v => v.tipo === "Debito")
            .reduce((sum, x) => sum + x.valor, 0);
        const valorPagoDinheiro = this.state.vendas.filter(v => v.formaPagamento === "Dinheiro")
            .reduce((sum, x) => sum + x.valorPago, 0);
        const valorNoCaixa = this.state.valorCaixaAnterior + valorAdicionado - valorRetirado - this.state.valorSunTroco + valorPagoDinheiro;

        this.setState({
            valorTotalCaixa: valorNoCaixa,
        });
    }

    retrieveUltimoCaixa() {
        caixaService.last()
            .then((response) => {
                this.setState({
                    valorCaixaAnterior: response.data.valorFimDinheiro ?
                        response.data.valorFimDinheiro : 0,
                });
            })
            .catch((e) => {
                console.log(e);
            });
    }

    retrieveVendas() {
        const id = this.state.uid;

        if (id) {
            caixaService.vendas(id)
                .then((response) => {
                    this.setState({
                        vendas: response.data,
                        valorSunTotal: response.data.reduce((sum, x) => sum + x.valorTotal, 0),
                        valorPIXTotal: response.data.filter(v => v.formaPagamento === "PIX")
                            .reduce((sum, x) => sum + x.valorTotal, 0),
                        valorDinheiroTotal: response.data.filter(v => v.formaPagamento === "Dinheiro")
                            .reduce((sum, x) => sum + x.valorTotal, 0),
                        valorDebitoCreditoTotal: response.data.filter(v => v.formaPagamento === "Debito" || v.formaPagamento === "Credito")
                            .reduce((sum, x) => sum + x.valorTotal, 0),

                        valorSunPago: response.data.reduce((sum, x) => sum + x.valorPago, 0),
                        valorSunTroco: response.data.reduce((sum, x) => sum + x.valorTroco, 0),
                    });
                    this.calculaValorNoCaixa();
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }

    retrieveLancamentos() {
        const id = this.state.uid;

        if (id) {
            caixaService.lancamentos(id)
                .then((response) => {
                    this.setState({
                        lancamentos: response.data,
                    });
                    this.calculaValorNoCaixa();
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }

    onChangeUser(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            user: e.target.value,
        });
    }

    onChangeUserLancamento(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            userLancamento: e.target.value,
        });
    }

    abrirCaixa() {
        const data: CaixaDTO = {
            uid: this.state.uid,
            user: this.state.user,
            inicio: this.state.start ? moment(this.state.start.toDate()).format('yyyy-MM-DDTHH:mm:ss') : null,
            userInicio: null,
            valorInicioDinheiro: null,
            fim: null,
            userFim: null,
            valorFimDinheiro: null,

        };
        caixaService.abrir(data)
            .then((response) => {
                this.setState({
                    uid: response.data.uid,
                    valorInicioDinheiro: response.data.valorInicioDinheiro,
                });
            })
            .catch((e) => {
                console.log(e);
            });
    }

    fecharCaixa() {
        const data: CaixaDTO = {
            uid: this.state.uid,
            user: this.state.user,
            inicio: null,
            userInicio: null,
            valorInicioDinheiro: null,
            fim: this.state.end ? moment(this.state.end.toDate()).format('yyyy-MM-DDTHH:mm:ss') : null,
            userFim: null,
            valorFimDinheiro: this.state.valorTotalCaixa,

        };
        caixaService.fechar(data)
            .then((response) => {
                this.setState({
                    uid: null
                });
                this.retrieveUltimoCaixa();
            })
            .catch((e) => {
                console.log(e);
            });
    }

    adicionarLancamento() {
        const data: LancamentoDTO = {
            caixa: this.state.uid ? this.state.uid : "",
            user: this.state.userLancamento,
            create: moment(new Date()).format('yyyy-MM-DDTHH:mm:ss'),
            descricao: this.state.descricaoLancamento,
            tipo: this.state.tipoLancamento,
            valor: this.state.valorLancamento,
        };

        caixaService.lancamento(data)
            .then((response) => {
                this.setState({
                    descricaoLancamento: "",
                    tipoLancamento: "",
                    valorLancamento: 0,
                    userLancamento: "",
                    openLancamentoSucess: true,
                });
                this.retrieveLancamentos();
            })
            .catch((e) => {
                console.log(e);
            });

    }

    onChangeStart(value: Dayjs | null) {
        this.setState({
            start: value,
        });
    }

    onChangeEnd(value: Dayjs | null) {
        this.setState({
            end: value,
        });
    }

    onChangeValorLancamento(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            valorLancamento: e.target.valueAsNumber,
        });
    }

    onChangeDescricaoLancamento(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            descricaoLancamento: e.target.value,
        });
    }

    onChangeTipoLancamento(event: SelectChangeEvent<string>) {
        this.setState({
            tipoLancamento: event.target.value,
        });
    }

    async finalizaAlert() {
        await new Promise(res => setTimeout(res, 5000));
        this.setState({
            openLancamentoSucess: false,
        })
    }

    render() {
        const { uid, user, start, end, valorCaixaAnterior, vendas, lancamentos,
            valorLancamento, descricaoLancamento, tipoLancamento, userLancamento,
            valorSunTotal, valorSunPago, openLancamentoSucess,
            valorSunTroco, valorDebitoCreditoTotal,
            valorTotalCaixa, valorDinheiroTotal,
            valorPIXTotal, } = this.state;

        return (
            <div>
                <FormControl fullWidth>
                    <Collapse in={openLancamentoSucess} addEndListener={this.finalizaAlert}>
                        <Alert severity="success" color="success">
                            Lançamento registrado com sucesso!
                        </Alert>
                    </Collapse>
                    {uid ? (
                        <div className="row">
                            <h4 className="titulo-central">Lançamentos no Caixa</h4>
                            <div className="row col-12">
                                <div className="col-3">
                                    <TextField id="descricaoLancamento" label="Descrição" variant="outlined"
                                        type="text"
                                        sx={{ width: 'inherit' }}
                                        value={descricaoLancamento}
                                        onChange={this.onChangeDescricaoLancamento}
                                    />
                                </div>
                                <div className="col-2">
                                    <TextField id="userLancamento" label="Usuário" variant="outlined"
                                        type="text"
                                        value={userLancamento}
                                        onChange={this.onChangeUserLancamento}
                                    />
                                </div>
                                <div className="col-2">
                                    <InputLabel id="formaPagamento-select-label" className="custom-select-label">Tipo de Lançamento</InputLabel>
                                    <Select
                                        labelId="formaPagamento-select-label"
                                        id="formaPagamento"
                                        value={tipoLancamento}
                                        fullWidth
                                        label="Tipo de Lançamento"
                                        onChange={this.onChangeTipoLancamento}
                                    >
                                        <MenuItem value={"Credito"}>Adicionar</MenuItem>
                                        <MenuItem value={"Debito"}>Retirar</MenuItem>
                                    </Select>
                                </div>
                                <div className="col-2">
                                    <TextField id="valor" label="Valor" variant="outlined"
                                        type="number"
                                        value={valorLancamento}
                                        onChange={this.onChangeValorLancamento}
                                        autoFocus
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                        }}
                                    />
                                </div>
                                <div className="col-3">
                                    <button onClick={this.adicionarLancamento} className="btn btn-success mt-3">
                                        Adicionar Lançamento
                                    </button>
                                </div>
                            </div>

                            <div className="col-7 mt-3">
                                <h4 className="titulo-central">Vendas efetuadas</h4>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Data da venda</TableCell>
                                                <TableCell align="right">Itens</TableCell>
                                                <TableCell>Forma de pagamento</TableCell>
                                                <TableCell align="right">Valor Total</TableCell>
                                                <TableCell align="right">Valor Pago</TableCell>
                                                <TableCell align="right">Valor Troco</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {vendas.map((venda) => (
                                                <TableRow
                                                    key={venda.uid}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {new Date(venda.create).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell align="right">{venda.itens.length}</TableCell>
                                                    <TableCell>{venda.formaPagamento}</TableCell>
                                                    <TableCell align="right">{venda.valorTotal ?
                                                        'R$ ' + venda.valorTotal.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</TableCell>
                                                    <TableCell align="right">{venda.valorPago ?
                                                        'R$ ' + venda.valorPago.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</TableCell>
                                                    <TableCell align="right">{venda.valorTroco ?
                                                        'R$ ' + venda.valorTroco.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                            <div className="col-5 mt-3">
                                <h4 className="titulo-central">Lançamentos efetuadas</h4>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 450 }} size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Data do lançamento</TableCell>
                                                <TableCell>Descrição</TableCell>
                                                <TableCell>Tipo</TableCell>
                                                <TableCell align="right">Valor</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {lancamentos.map((lancamento) => (
                                                <TableRow
                                                    key={lancamento.uid}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {new Date(lancamento.create).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>{lancamento.descricao}</TableCell>
                                                    <TableCell>{lancamento.tipo}</TableCell>
                                                    <TableCell align="right">{lancamento.valor ?
                                                        'R$ ' + lancamento.valor.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</TableCell>

                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                            <div className="row col-12 mt-3">
                                <div className="col-3">
                                    <label>
                                        <strong>Valor Inicio:</strong>
                                    </label><strong>{" R$ "}
                                        {valorCaixaAnterior.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                </div>
                                <div className="col-3">
                                    <label>
                                        <strong>Venda PIX:</strong>
                                    </label><strong>{" R$ "}
                                        {valorPIXTotal.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                </div>
                                <div className="col-3">
                                    <label>
                                        <strong>Venda Debito/Credito:</strong>
                                    </label><strong>{" R$ "}
                                        {valorDebitoCreditoTotal.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                </div>
                                <div className="col-3">
                                    <label>
                                        <strong>Venda Dinheiro:</strong>
                                    </label><strong>{" R$ "}
                                        {valorDinheiroTotal.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                </div>

                                <div className="col-3">
                                    <label>
                                        <strong>Total Vendas:</strong>
                                    </label><strong>{" R$ "}
                                        {valorSunTotal.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                </div>
                                <div className="col-3">
                                    <label>
                                        <strong>Total pago:</strong>
                                    </label><strong>{" R$ "}
                                        {valorSunPago.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                </div>
                                <div className="col-3">
                                    <label>
                                        <strong>Total troco:</strong>
                                    </label><strong>{" R$ "}
                                        {valorSunTroco.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                </div>
                                <div className="col-3">
                                    <label>
                                        <strong>Total no caixa:</strong>
                                    </label><strong>{" R$ "}
                                        {valorTotalCaixa.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                </div>
                            </div>
                            <div className="row col-12 mt-3">
                                <div className="col-3">
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-gb'}>
                                        <DateTimePicker
                                            label="Data de inicio"
                                            value={start}
                                            disabled
                                            onChange={(newValue) => this.onChangeStart(newValue)}
                                        />
                                    </LocalizationProvider>
                                </div>
                                <div className="col-3">
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-gb'}>
                                        <DateTimePicker
                                            label="Data de termino"
                                            value={end}
                                            onChange={(newValue) => this.onChangeEnd(newValue)}
                                        />
                                    </LocalizationProvider>
                                </div>
                                <div className="col-3">
                                    <TextField id="user" label="Usuário" variant="outlined"
                                        type="text"
                                        value={user}
                                        onChange={this.onChangeUser}
                                    />
                                </div>
                                <div className="col-3">
                                    <button onClick={this.fecharCaixa} className="btn btn-success mt-3">
                                        Fechar Caixa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="row">
                            <div className="col-3">
                                <TextField id="valorCaixaAnterior" label="Caixa anterior" variant="outlined"
                                    type="number"
                                    value={valorCaixaAnterior}
                                    disabled
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                    }}
                                />
                            </div>
                            <div className="col-3">
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-gb'}>
                                    <DateTimePicker
                                        label="Data de inicio"
                                        value={start}
                                        onChange={(newValue) => this.onChangeStart(newValue)}
                                    />
                                </LocalizationProvider>
                            </div>
                            <div className="col-3">
                                <TextField id="user" label="Usuário" variant="outlined"
                                    type="text"
                                    value={user}
                                    onChange={this.onChangeUser}
                                />
                            </div>
                            <div className="col-3">
                                <button onClick={this.abrirCaixa} className="btn btn-success mt-3">
                                    Abrir Caixa
                                </button>
                            </div>
                        </div>
                    )}

                </FormControl>
            </div>
        )
    }
}