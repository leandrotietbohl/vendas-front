import React, { Component, ChangeEvent } from "react";
import VendaDTO from "../../types/venda.type";
import Pagination from '@mui/material/Pagination'
import { Select , MenuItem, SelectChangeEvent } from "@mui/material";
import FilterVendaDTO from "../../types/venda-filter.type";
import VendaService from "../../services/venda.service";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/en-gb';
import moment from "moment";

type Props = {};

type State = {
    vendas: Array<VendaDTO>,
    currentVenda: VendaDTO | null,
    currentIndex: number,
    page: number,
    count: number,
    pageSize: number,
    start: Dayjs | null,
    end: Dayjs | null,
};

export default class VendaList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.retrieveVendas = this.retrieveVendas.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
        this.setActiveVenda = this.setActiveVenda.bind(this);
        this.onChangeStart = this.onChangeStart.bind(this);

        this.state = {
            vendas: [],
            currentVenda: null,
            currentIndex: -1,
            start: null,
            end: null,
            page: 1,
            count: 0,
            pageSize: 10,
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
        VendaService.filter(this.state.page - 1, this.state.pageSize, data)
          .then((response) => {
    
            this.setState({
                vendas: response.data.content,
                count: response.data.totalPages,
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

    handlePageChange(event: ChangeEvent<unknown>, page: number) {
        this.setState(
          {
            page: page,
          },
          () => {
            this.retrieveVendas();
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
                this.retrieveVendas();
            }
        );
    }

    onChangeStart(value: Dayjs | null) {
      this.setState({
        start: value,
      })
    }

    onChangeEnd(value: Dayjs | null) {
      this.setState({
        end: value,
      })
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
          page,
          count,
          pageSize,
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
              <div className="col-4"></div>
              <div className="col-8">
                <ul className="list-group">
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-4"><strong>Data</strong></div>
                            <div className="col-2"><strong>Itens</strong></div>
                            <div className="col-2"><strong>Forma de Pagamento</strong></div>
                            <div className="col-2 custom-div-valor"><strong>Valor Total</strong></div>
                        </div>
                    </li>
                    {vendas &&
                    vendas.map((venda, index) => (
                        <li
                        className={
                            "list-group-item " +
                            (index === currentIndex ? "active" : "")
                        }
                        onClick={() => this.setActiveVenda(venda, index)}
                        key={index}
                        >
                          <div className="row">
                            <div className="col-4">{new Date(venda.create).toLocaleString()}</div>
                            <div className="col-2">{venda.itens.length}</div>
                            <div className="col-2">{venda.formaPagamento}</div>
                            <div className="col-2 custom-div-valor">R$ {venda.valorTotal.toLocaleString('pt-br', {minimumFractionDigits: 2})}</div>
                          </div>
                        </li>
                      ))}
                </ul>
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