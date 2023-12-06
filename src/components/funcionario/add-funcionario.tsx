import { Component, ChangeEvent } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import FuncionarioService from "../../services/funcionario.service";
import FuncionarioDTO from "../../types/funcionario.type";

interface RouterProps {
    id: string;
}

type Props = RouteComponentProps<RouterProps>;

type State = FuncionarioDTO & {
    submitted: boolean,
};

export default class AddFuncionario extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.onChangeUid = this.onChangeUid.bind(this);
        this.onChangeNome = this.onChangeNome.bind(this);
        this.onChangeValor = this.onChangeValor.bind(this);
        this.saveFuncionario = this.saveFuncionario.bind(this);
        this.newFuncionario = this.newFuncionario.bind(this);

        this.state = {
            cpf: "",
            nome: "",
            valorHora: 0,
            anos: [],
            submitted: false,
        };
    }

    onChangeUid(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            cpf: e.target.value
        });
    }

    onChangeNome(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            nome: e.target.value
        });
    }

    onChangeValor(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            valorHora: e.target.valueAsNumber
        });
    }

    saveFuncionario() {
        const data: FuncionarioDTO = {
            cpf: this.state.cpf,
            nome: this.state.nome,
            valorHora: this.state.valorHora,
            anos: [],
        };

        FuncionarioService.create(data)
            .then((response: any) => {
                this.setState({
                    submitted: true,
                });
                this.props.history.push("/list_funcionario/" + response.data.cpf);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    newFuncionario() {
        this.setState({
            cpf: "",
            nome: "",
            valorHora: 0,
            anos: [],
            submitted: false
        });
    }

    render() {
        const { submitted, cpf, nome, valorHora } = this.state;

        return (
            <div className="submit-form">
                <h2>Cadastrar Funcionario</h2>
                {submitted ? (
                    <div>
                        <h4>Funcionario enviado com sucesso!</h4>
                        
                        <button className="btn btn-success" onClick={this.newFuncionario}>
                            Voltar
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="form-group">
                            <label htmlFor="cpf">Identificador</label>
                            <input
                                type="text"
                                className="form-control"
                                id="cpf"
                                required
                                value={cpf}
                                onChange={this.onChangeUid}
                                name="cpf"
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
                            <label htmlFor="ordem">Valor hora</label>
                            <input
                                type="number"
                                className="form-control"
                                id="valorHora"
                                required
                                value={valorHora}
                                onChange={this.onChangeValor}
                                name="ordem"
                            />
                        </div>

                        <Link
                            to={"/list_funcionario/"}
                            className="badge badge-danger mr-2">
                            Voltar
                        </Link>
                        <button onClick={this.saveFuncionario} className="btn btn-success">
                            Salvar
                        </button>
                    </div>

                )}
            </div>
        );
    }
}