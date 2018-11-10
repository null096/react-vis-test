import React, { Component } from 'react';
import { Treemap } from 'react-vis';

function getRandomData(total) {
  const totalLeaves = total || 400;
  const children = [];
  for (let i = 0; i < totalLeaves; i++) {
    children.push({
      name: total ? total : String(Math.random()).slice(0, 3),
      size: Math.random() * 1000,
      color: Math.random(),
    });
  }
  return {
    title: '',
    color: 2,
    children
  };
}

let data = getRandomData();

class App extends Component {
  state = {
    socketStatus: 'Not connected',
    countOfTransactions: 0,
  }

  connect = () => {
    this.ws = new WebSocket('wss://ws.blockchain.info/inv');
    this.ws.onopen = () => {
      this.ws.send('{"op":"unconfirmed_sub"}');   // TODO rewrite
      this.setState({ socketStatus: 'Connected' });
    };
    this.ws.onerror = () => { this.setState({ socketStatus: 'Error' }); };
    this.ws.onclose = () => { this.setState({ socketStatus: 'Disconnected' }); };
    this.ws.onmessage = this.onWebSocketMessage;
  }

  disconnect = () => {
    this.ws.send('{"op":"unconfirmed_unsub"}');
    this.ws.close();
  }

  onComponentUnmount() {
    this.disconnect();
  }

  onWebSocketMessage = (e) => {
    const data = JSON.parse(e.data);
    const x = 10 ** 8;

    console.log(e, data);
    data.x.inputs.forEach(e => console.log(e.prev_out.value / x));
    data.x.out.forEach(e => console.log(e.value / x));
    this.setState((prevState) => ({
      countOfTransactions:
        prevState.countOfTransactions + 1
    }));
  }

  render() {
    if (data.children.length > 400) {
      data.children.shift();
    }
    data.children.push(getRandomData(1).children[0]);
    const treeProps = {
      mode: 'circlePack',
      renderMode: 'SVG',
      width: 700,
      height: 600,
      animation: {
        damping: 16,
        stiffness: 80,
      },
      style: {
        // stroke: 'rgb(148, 36, 192)',
      },
      colorDomain: [0, 1, 2],
      colorRange: ['white', 'black', 'gray'],
      padding: 2,
      data
    };

    return (
      <React.Fragment>
        <button onClick={() => this.forceUpdate()}>Update</button>
        <button onClick={this.connect}>Connect</button>
        <button onClick={this.disconnect}>Disconnect</button>
        <span>{this.state.socketStatus}</span>
        <p>{this.state.countOfTransactions}</p>
        {/* <Treemap {...treeProps} /> */}
      </React.Fragment>
    );
  }
}

export default App;
