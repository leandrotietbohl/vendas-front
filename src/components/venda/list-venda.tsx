import React, { Component } from "react";
import VendaDTO from "../../types/venda.type";
import FilterVendaDTO from "../../types/venda-filter.type";
import VendaService from "../../services/venda.service";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/en-gb';
import moment from "moment";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

type Props = {};

type State = {
  vendas: Array<VendaDTO>,
  currentVenda: VendaDTO | null,
  currentIndex: number,
  start: Dayjs | null,
  end: Dayjs | null,
};

export default class VendaList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.retrieveVendas = this.retrieveVendas.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveVenda = this.setActiveVenda.bind(this);
    this.onChangeStart = this.onChangeStart.bind(this);

    this.state = {
      vendas: [],
      currentVenda: null,
      currentIndex: -1,
      start: null,
      end: null,
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
    console.log(data);
    VendaService.filterList(data)
      .then((response) => {

        this.setState({
          vendas: response.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveVendas();
    this.setState({
      currentVenda: null,
      currentIndex: -1,
    });
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

  setActiveVenda(venda: VendaDTO, index: number) {
    this.setState({
      currentVenda: venda,
      currentIndex: index,
    });
  }

  render() {
    const {
      vendas,
      currentVenda,
      currentIndex,
      start,
      end,
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
        <div className="col-8">
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
                      'R$ ' + venda.valorTotal.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}</TableCell>
                    <TableCell align="right">{venda.valorPago ? 
                      'R$ ' + venda.valorPago.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-' }</TableCell>
                    <TableCell align="right">{venda.valorTroco ? 
                      'R$ ' + venda.valorTroco.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="col-4">
          {currentVenda ? (
            <div>
              <h4>Venda</h4>
              <div>
                <label>
                  <strong>ID:</strong>
                </label>{" "}
                {currentVenda.uid}
              </div>
            </div>
          ) : (
            <div>
              <br />
              <p>Selecione uma venda...</p>
            </div>
          )}
        </div>
      </div>
    )
  }
}