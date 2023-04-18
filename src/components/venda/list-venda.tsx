import { Component } from "react";
import VendaDTO from "../../types/venda.type";
import FilterVendaDTO from "../../types/venda-filter.type";
import VendaService from "../../services/venda.service";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/en-gb';
import moment from "moment";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

type Props = {};

type State = {
  vendas: Array<VendaDTO>,
  start: Dayjs | null,
  end: Dayjs | null,
  valorSunTotal: number,
  valorSunPago: number,
  valorSunTroco: number,
  valorPIXTotal: number,
  valorDinheiroTotal: number,
  valorDebitoTotal: number,
  valorCreditoTotal: number,
  currentVenda: VendaDTO | null,
};

export default class VendaList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.retrieveVendas = this.retrieveVendas.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.onChangeStart = this.onChangeStart.bind(this);
    this.setActiveVenda = this.setActiveVenda.bind(this);

    this.state = {
      vendas: [],
      currentVenda: null,
      start: dayjs(new Date()).hour(0).minute(0).second(0),
      end: dayjs(new Date()).hour(23).minute(59).second(59),
      valorSunTotal: 0,
      valorSunPago: 0,
      valorSunTroco: 0,
      valorPIXTotal: 0,
      valorDinheiroTotal: 0,
      valorDebitoTotal: 0,
      valorCreditoTotal: 0,
    };
  }

  componentDidMount() {
    this.retrieveVendas();
  }

  retrieveVendas() {
    const data: FilterVendaDTO = {
      start: this.state.start ? moment(this.state.start.toDate()).format('yyyy-MM-DDTHH:mm:ss') : null,
      end: this.state.end ? moment(this.state.end.toDate()).format('yyyy-MM-DDTHH:mm:ss') : null,
    };
    
    VendaService.filterList(data)
      .then((response) => {

        this.setState({
          vendas: response.data,
          valorSunTotal: response.data.reduce((sum, x) => sum + x.valorTotal, 0),
          valorPIXTotal: response.data.filter(v => v.formaPagamento === "PIX").reduce((sum, x) => sum + x.valorTotal, 0),
          valorDinheiroTotal: response.data.filter(v => v.formaPagamento === "Dinheiro").reduce((sum, x) => sum + x.valorTotal, 0),
          valorDebitoTotal: response.data.filter(v => v.formaPagamento === "Debito").reduce((sum, x) => sum + x.valorTotal, 0),
          valorCreditoTotal: response.data.filter(v => v.formaPagamento === "Credito").reduce((sum, x) => sum + x.valorTotal, 0),
          valorSunPago: response.data.reduce((sum, x) => sum + x.valorPago, 0),
          valorSunTroco: response.data.reduce((sum, x) => sum + x.valorTroco, 0),
        });
        
      })
      .catch((e) => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveVendas();
  }

  onChangeStart(value: Dayjs | null) {
    this.setState({
      start: value,
    });
    this.refreshList();
  }

  onChangeEnd(value: Dayjs | null) {
    this.setState({
      end: value,
    });
    this.refreshList();
  }

  setActiveVenda(venda: VendaDTO) {
    this.setState({
      currentVenda: venda
    });
  }

  render() {
    const {
      vendas,
      start,
      end,
      valorSunTotal,
      valorSunPago,
      valorSunTroco,
      currentVenda,
      valorCreditoTotal,
      valorDebitoTotal,
      valorDinheiroTotal,
      valorPIXTotal,
    } = this.state;

    return (
      <div className="row">
        <div className="col-4">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-gb'}>
            <DateTimePicker
              label="Data de inicio"
              value={start}
              onChange={(newValue) => this.onChangeStart(newValue)}
            />
          </LocalizationProvider>
        </div>
        <div className="col-4">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-gb'}>
            <DateTimePicker
              label="Data de termino"
              value={end}
              onChange={(newValue) => this.onChangeEnd(newValue)}
            />
          </LocalizationProvider>
        </div>
        <div className="col-4">
        </div>
        <div className="col-7 mt-3">
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
                    onClick={() => this.setActiveVenda(venda)}
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
        {currentVenda ? (
          <div className="col-5">
            <h5>Venda</h5>
            <label>ID: {currentVenda.uid}</label><br />
            <label>Cliente: {currentVenda.cliente}</label><br />
            <label>Data: {new Date(currentVenda.create).toLocaleString()}</label><br />
            <label>Itens: {currentVenda.itens.length}</label><br />
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Produto</TableCell>
                    <TableCell>Categoria</TableCell>
                    <TableCell>Valor unitario</TableCell>
                    <TableCell>Quantidade</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentVenda.itens.map((item, index) => (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{item.produto.nome}</TableCell>
                      <TableCell>{item.produto.categoria}</TableCell>
                      <TableCell>R$ {item.produto.valor.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                      <TableCell>{item.quantidade}</TableCell>
                      <TableCell>R$ {item.valorItem.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <label>Forma pagamento: {currentVenda.formaPagamento}</label><br />
            <label>Total: {currentVenda.valorTotal ?
              'R$ ' + currentVenda.valorTotal.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</label><br />
            <label>Pago: {currentVenda.valorPago ?
              'R$ ' + currentVenda.valorPago.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</label><br />
            <label>Troco: {currentVenda.valorTroco ?
              'R$ ' + currentVenda.valorTroco.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</label><br />
          </div>
        ) : (
          <div className="col-5">

          </div>
        )}
        <div className="row col-12 mt-3">
          <div className="col-4">
            <label>
              <strong>Total valor Vendas:</strong>
            </label><strong>{" R$ "}
              {valorSunTotal.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </div>
          <div className="col-4">
            <label>
              <strong>Total valor pago:</strong>
            </label><strong>{" R$ "}
              {valorSunPago.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </div>
          <div className="col-4">
            <label>
              <strong>Total valor troco:</strong>
            </label><strong>{" R$ "}
              {valorSunTroco.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </div>
        </div>
        <div className="row col-12 mt-3">
          <div className="col-3">
            <label>
              <strong>Total PIX:</strong>
            </label><strong>{" R$ "}
              {valorPIXTotal.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </div>
          <div className="col-3">
            <label>
              <strong>Total Debito:</strong>
            </label><strong>{" R$ "}
              {valorDebitoTotal.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </div>
          <div className="col-3">
            <label>
              <strong>Total Credito:</strong>
            </label><strong>{" R$ "}
              {valorCreditoTotal.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </div>
          <div className="col-3">
            <label>
              <strong>Total Dinheiro:</strong>
            </label><strong>{" R$ "}
              {valorDinheiroTotal.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </div>
        </div>
      </div>
    )
  }
}