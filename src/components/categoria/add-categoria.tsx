import { Component, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import CategoriaService from "../../services/categoria.service";
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";
import CategoriaDTO from "../../types/categoria.type";

type Props = {};

type State = CategoriaDTO & {
    submitted: boolean
};

export default class AddCategoria extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.onChangeUid = this.onChangeUid.bind(this);
        this.onChangeNome = this.onChangeNome.bind(this);
        this.onChangeOrdem = this.onChangeOrdem.bind(this);
        this.onChangeTipo = this.onChangeTipo.bind(this);
        this.saveCategoria = this.saveCategoria.bind(this);
        this.newCategoria = this.newCategoria.bind(this);

        this.state = {
            uid: "",
            nome: "",
            ordem: 0,
            tipo: "visivel",
            submitted: false,
        };
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

    onChangeOrdem(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            ordem: e.target.valueAsNumber
        });
    }

    onChangeTipo(event: SelectChangeEvent<string>) {
        const tipo = event.target.value as string;
        this.setState({
            tipo: tipo,
        });
    }

    saveCategoria() {
        const data: CategoriaDTO = {
            uid: this.state.uid,
            nome: this.state.nome,
            ordem: this.state.ordem,
            tipo: this.state.tipo,
        };

        CategoriaService.create(data)
            .then((response: any) => {
                this.setState({
                    submitted: true
                });

            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    newCategoria() {
        this.setState({
            uid: "",
            nome: "",
            ordem: 0,
            tipo: "visivel",
            submitted: false
        });
    }

    render() {
        const { submitted, uid, nome, ordem, tipo } = this.state;

        return (
            <div className="submit-form">
                <h2>Cadastrar Categoria</h2>
                {submitted ? (
                    <div>
                        <h4>Categoria enviado com sucesso!</h4>
                        <button className="btn btn-success" onClick={this.newCategoria}>
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
                            <label htmlFor="ordem">Ordem</label>
                            <input
                                type="number"
                                className="form-control"
                                id="ordem"
                                required
                                value={ordem}
                                onChange={this.onChangeOrdem}
                                name="ordem"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="tipo">Tipo</label>
                            <Select
                                id="tipo"
                                className="form-control"
                                value={tipo}
                                onChange={this.onChangeTipo}
                            >
                                <MenuItem value={"visivel"}>Visivel</MenuItem>
                                <MenuItem value={"oculto"}>Oculto</MenuItem>
                            </Select>
                        </div>

                        <Link
                            to={"/list_categoria/"}
                            className="badge badge-danger mr-2">
                            Voltar
                        </Link>
                        <button onClick={this.saveCategoria} className="btn btn-success">
                            Salvar
                        </button>
                    </div>

                )}
            </div>
        );
    }
}