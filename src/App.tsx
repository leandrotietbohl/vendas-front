import { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AddProduto from "./components/produto/add-produto";
import ProdutoList from "./components/produto/list-produto";
import EditProduto from "./components/produto/edit-produto";
import AddVenda from "./components/venda/add-venda";
import VendaList from "./components/venda/list-venda";
import AddCaixa from "./components/caixa/add-caixa";
import AddCategoria from "./components/categoria/add-categoria";
import CategoriaList from "./components/categoria/list-categoria";
import EditCategoria from "./components/categoria/edit-categoria";

class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Sorveteria Bom Cream
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/add_venda"} className="nav-link">
                Venda
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/add_caixa"} className="nav-link">
                Caixa
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/list_produto"} className="nav-link">
                Produtos
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/list_categoria"} className="nav-link">
                Categoria
              </Link>
            </li>
          </div>
        </nav>

        <div className="container mt-3 custom-container">
          <Switch>
            <Route exact path={["/", "/add_venda"]} component={AddVenda} />
            <Route exact path="/add_caixa" component={AddCaixa} />
            <Route exact path="/list_vendas" component={VendaList} />
            <Route exact path="/add_produto" component={AddProduto} />
            <Route exact path="/list_produto" component={ProdutoList} />
            <Route path="/list_produto/:id" component={EditProduto} />
            <Route exact path="/add_categoria" component={AddCategoria} />
            <Route exact path="/list_categoria" component={CategoriaList} />
            <Route path="/list_categoria/:id" component={EditCategoria} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
