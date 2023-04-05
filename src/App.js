import logo from './logo.svg';
import './App.css';
import Venda from './components/venda';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Vendas sorveteria
        </p>
        <div>
          <Venda/>
        </div>
      </header>
    </div>
  );
}

export default App;
