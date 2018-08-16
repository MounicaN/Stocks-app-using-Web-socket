import React, { Component } from 'react';
import './App.css';

class Header extends Component {

  addStocks() {
    this.props.addStocks(this.refs.stock.value, Number(this.refs.quantity.value), Number(this.refs.price.value));
  }

  isSubscribed() {
    this.props.isSubscribed();
  }

  render() {
    return (
      <div className="upper">
        <b>STOCKS PORTFOLIO</b>
        <button type="button" className="btn btn-success float-right" data-toggle="modal" data-target="#exampleModal">+</button>
        <div className="modal fade" id="exampleModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Stocks</h5>
                <button type="button" className="close" data-dismiss="modal">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body stock">
                <select className="addStock" ref="stock">
                  <option>SBI</option>
                  <option>Infosys</option>
                  <option>Kotak</option>
                  <option>Reliance</option>
                </select>
                <br />
                <input type="text" placeholder="Price" className="addStock" ref="price" id="price" />
                <br />
                <input type="text" placeholder="Quantity" className="addStock" ref="quantity" id="quantity" />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary float-right" data-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.addStocks.bind(this)}>Add</button>
              </div>
            </div>
          </div>
        </div>
        <button className="btn btn-primary float-right" onClick={this.isSubscribed.bind(this)}>{this.props.subscription}</button>

      </div>
    )
  }
}


class StockList extends Component {

  constructor(props) {
    super(props);
    this.removeStocks = this.removeStocks.bind(this);
  }

  removeStocks(index) {
    this.props.removeStocks(index);
  }

  render() {
    return (
      <div className="lower">
        <table className="table-hover">
          <thead className="font-weight-bold"><tr><td>Stock</td><td>Quantity</td><td>Price</td><td>Average</td><td>P/L</td><td>  </td></tr></thead>
          <tbody>
            {
              this.props.finalData.map((item, i) =>
                <tr style={{ color: item.color, fontWeight: 'bold' }} key={i}><td>{item.stock}</td><td>{item.quantity}</td><td>{item.price}</td><td>{item.average}</td><td><span className="PorL" style={{ backgroundColor: item.color, color: 'white' }}>  {item.ProOrLoss}  </span></td>
                  <td><button type="button" className="close" data-dismiss="modal">
                    <span aria-hidden="true" onClick={() => this.removeStocks(i)}>&times;</span>
                  </button></td></tr>
              )
            }
          </tbody>
        </table>
      </div>
    )
  }
}


class Footer extends Component {

  render() {
    return (
      <div className="total">
        <span className="font-weight-bold Total">Total invested:&nbsp;
          {
            this.props.total
          }
          <span className="font-weight-bold ProOrLoss" style={{ color: 'white', backgroundColor: this.props.ProOrLoss >= 0 ? 'green' : 'red' }}>
            {
              this.props.ProOrLoss
            }
          </span></span>
        <span className="font-weight-bold ProOrLoss">
          Profit/Loss:
        </span>
      </div>
    )
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      finalData: [],
      total: 0,
      ProOrLoss: 0,
      subscription: 'Unsubscribe'
    }

    this.isSubscribed = this.isSubscribed.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
    this.addStocks = this.addStocks.bind(this);
    this.addNewStock = this.addNewStock.bind(this);
    this.updateStocks = this.updateStocks.bind(this);
    this.calcTotal = this.calcTotal.bind(this);
    this.calcProOrLoss = this.calcProOrLoss.bind(this);
    this.removeStocks = this.removeStocks.bind(this);
    this.updatePorL = this.updatePorL.bind(this);
  }

  isSubscribed() {
    this.setState((PrevState) => {
      if (PrevState.subscription === "Subscribe")
        PrevState.subscription = "Unsubscribe";
      else
        PrevState.subscription = "Subscribe";
      return PrevState.subscription;
    })
  }

  updatePrice() {
    var list = this.state.finalData;
    for (var i = 0; i < this.state.data.length; i++) {
      for (var j = 0; j < this.state.finalData.length; j++) {
        if (this.state.data[i].stock === this.state.finalData[j].stock) {
          list[j].price = this.state.data[i].price;
          break;
        }
      }
    }
    this.setState((PrevState) => {
      PrevState.finalData = list
      return PrevState.finalData
    })
  }

  addStocks(_stock, _quantity, _price) {
    var flag = false;
    for (var i = 0; i < this.state.finalData.length; i++) {
      if (_stock === this.state.finalData[i].stock) {
        this.updateStocks(_stock, _quantity, _price)
        flag = true;
        break;
      }
    }
    if (flag === false) {
      this.addNewStock(_stock, _quantity, _price)
    }
    if (this.state.finalData.length === 0) {
      this.addNewStock(_stock, _quantity, _price)
    }
    this.calcTotal();
    this.calcProOrLoss();
  }

  addNewStock(_stock, _quantity, _price) {
    var list = this.state.finalData;
    var stockPrice = 0;
    for (var j = 0; j < this.state.data.length; j++) {
      if (_stock === this.state.data[j].stock) {
        stockPrice = this.state.data[j].price;
        break;
      }
    }
    var ProOrLoss = (stockPrice - _price);
    var colour;
    if (ProOrLoss >= 0)
      colour = 'green';
    else
      colour = 'red';
    list.push({
      stock: _stock,
      quantity: _quantity,
      price: stockPrice,
      average: (_quantity * _price) / _quantity,
      ProOrLoss: ProOrLoss,
      color: colour
    })
    this.setState((PrevState) => {
      PrevState.finalData = list
      return PrevState.finalData
    })
  }

  updateStocks(_stock, _quantity, _price) {
    var list = this.state.finalData;
    for (var i = 0; i < list.length; i++) {
      if (_stock === list[i].stock) {
        var totalPrice = (list[i].average * list[i].quantity) + (_quantity * _price);
        var totalQuantity = list[i].quantity + _quantity;
        list[i].average = totalPrice / totalQuantity;
        list[i].quantity = totalQuantity;
        var ProOrLoss = (list[i].price - list[i].average) * list[i].quantity;
        list[i].ProOrLoss = ProOrLoss;
        if (ProOrLoss >= 0)
          list[i].color = 'green';
        else
          list[i].color = 'red';
        break;
      }
    }
    this.setState((PrevState) => {
      PrevState.finalData = list
      return PrevState.finalData
    })
  }

  calcTotal() {
    var temp_total = 0;
    for (var i = 0; i < this.state.finalData.length; i++) {
      var item = this.state.finalData[i];
      temp_total += (item.average * item.quantity)
    }
    this.setState((PrevState) => {
      PrevState.total = temp_total
      return PrevState.total
    })
  }

  calcProOrLoss() {
    var temp_ProOrLoss = 0;
    var list = this.state.finalData;
    for (var i = 0; i < list.length; i++) {
      temp_ProOrLoss += (list[i].ProOrLoss)
    }
    this.setState((PrevState) => {
      PrevState.ProOrLoss = temp_ProOrLoss
      return PrevState.ProOrLoss
    })
  }

  removeStocks(index) {
    var list = this.state.finalData;
    list.splice(index, 1);
    this.setState((PrevState) => {
      PrevState.finalData = list
      return PrevState.finalData
    })
  }

  updatePorL() {
    var list = this.state.finalData;
    for (var i = 0; i < list.length; i++) {
      list[i].ProOrLoss = (list[i].price - (list[i].average)) * list[i].quantity;
      if (list[i].ProOrLoss >= 0)
        list[i].color = 'green';
      else
        list[i].color = 'red';
    }
    this.setState((PrevState) => {
      PrevState.finalData = list
      return PrevState.finalData
    })
  }

  componentWillMount() {
    var ws = new WebSocket("ws://192.168.2.44:8000");
    ws.onopen = function () {
    };
    ws.onmessage = evt => {
      if (this.state.subscription === 'Unsubscribe') {
        var received_msg = JSON.parse(evt.data);
        this.setState((PrevState) => {
          PrevState.data = received_msg
          return PrevState.data
        })
        if (this.state.subscription === 'Unsubscribe') {
          this.updatePrice();
          this.updatePorL();
          this.calcProOrLoss();
        }
      }
    };
    ws.onclose = function () {
      alert("Connection is closed...");
    };
  }

  render() {
    return (
      <div className="container">
        <div className="App">
          <Header subscription={this.state.subscription} isSubscribed={this.isSubscribed} addStocks={this.addStocks} />
          <StockList finalData={this.state.finalData} removeStocks={this.removeStocks} />
          <Footer total={this.state.total} ProOrLoss={this.state.ProOrLoss} />
        </div>
      </div>
    );
  }
}

export default App;
