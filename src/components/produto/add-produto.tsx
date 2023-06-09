import { Component, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import ProdutoService from "../../services/produto.service";
import ProdutoDTO from "../../types/produto.type";
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";
import CategoriaDTO from "../../types/categoria.type";
import CategoriaService from "../../services/categoria.service";

type Props = {};

type State = ProdutoDTO & {
    categorias: Array<CategoriaDTO>,
    submitted: boolean
};

export default class AddProduto extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.onChangeUid = this.onChangeUid.bind(this);
        this.onChangeNome = this.onChangeNome.bind(this);
        this.onChangeValor = this.onChangeValor.bind(this);
        this.onChangeTipoMedida = this.onChangeTipoMedida.bind(this);
        this.saveProduto = this.saveProduto.bind(this);
        this.newProduto = this.newProduto.bind(this);
        this.onChangeCategoria = this.onChangeCategoria.bind(this);

        this.state = {
            categorias: [],
            uid: "",
            nome: "",
            valor: 0,
            tipoMedida: "Unidade",
            categoria: "",
            submitted: false,
        };
    }

    componentDidMount() {
        this.retrieveCategorias();
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

    onChangeUid(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            uid: e.target.value
        });
    }

    onChangeNome(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            nome: e.target.value
        });
    }

    onChangeValor(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            valor: e.target.valueAsNumber
        });
    }

    onChangeTipoMedida(event: SelectChangeEvent<string>) {
        const tipo = event.target.value as string;
        this.setState({
            tipoMedida: tipo,
        });
    }

    onChangeCategoria(event: SelectChangeEvent<string>) {
        const categoria = event.target.value as string;
        this.setState({
            categoria: categoria,
        });
    }

    saveProduto() {
        const data: ProdutoDTO = {
            uid: this.state.uid,
            nome: this.state.nome,
            valor: this.state.valor,
            tipoMedida: this.state.tipoMedida,
            categoria: this.state.categoria,
        };

        ProdutoService.create(data)
            .then((response: any) => {
                this.setState({
                    submitted: true
                });

            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    newProduto() {
        this.setState({
            uid: "",
            nome: "",
            valor: 0,
            tipoMedida: "Unidade",
            categoria: "",
            submitted: false
        });
    }

    render() {
        const { submitted, uid, nome, valor, tipoMedida, categoria, categorias } = this.state;

        return (
            <div className="submit-form">
                <h2>Cadastrar produto</h2>
                {submitted ? (
                    <div>
                        <h4>Produto enviado com sucesso!</h4>
                        <button className="btn btn-success" onClick={this.newProduto}>
                            Voltar
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="form-group">
                            <label htmlFor="uid">Identificador</label>
                            <input
                                type="text"
                                className="form-control"
                                id="uid"
                                required
                                value={uid}
                                onChange={this.onChangeUid}
                                name="uid"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="nome">Nome</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nome"
                                required
                                value={nome}
                                onChange={this.onChangeNome}
                                name="nome"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="valor">Valor</label>
                            <input
                                type="number"
                                className="form-control"
                                id="valor"
                                required
                                value={valor}
                                onChange={this.onChangeValor}
                                name="valor"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="tipo">Tipo de Medida</label>
                            <Select
                                id="tipo"
                                className="form-control"
                                value={tipoMedida}
                                onChange={this.onChangeTipoMedida}
                            >
                                <MenuItem value={"Unidade"}>Unidade</MenuItem>
                                <MenuItem value={"Kilograma"}>Kilograma</MenuItem>
                                <MenuItem value={"Aleatorio"}>Aleatório</MenuItem>
                            </Select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="categoria">Categoria</label>
                            <Select
                                id="categoria"
                                className="form-control"
                                value={categoria}
                                label="Categoria"
                                onChange={this.onChangeCategoria}
                            >
                                {categorias.map((cat) => (
                                    <MenuItem value={cat.uid}>{cat.nome}</MenuItem>
                                ))}
                            </Select>
                        </div>
                        <Link
                            to={"/list_produto/"}
                            className="badge badge-danger mr-2">
                            Voltar
                        </Link>
                        <button onClick={this.saveProduto} className="btn btn-success">
                            Salvar
                        </button>
                    </div>

                )}
            </div>
        );
    }
}