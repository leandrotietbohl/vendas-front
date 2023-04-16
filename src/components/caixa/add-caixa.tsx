import { Component, ChangeEvent } from "react";
import CaixaDTO from "../../types/caixa.type";

type Props = {};

type State = CaixaDTO & {
    
};

export default class AddCaixa extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {

        };
    }

    render() {
        const {} = this.state;

        return (
            <div></div>
        )
    }
}