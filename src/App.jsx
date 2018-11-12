import React, { Component } from 'react';
import { Treemap } from 'react-vis';

const convertValueToTreemapItem = (size, color, name) => ({
  name: name || String(Math.random()),
  size,
  color
});

class App extends Component {
  state = {
    socketStatus: 'Not connected',
    data: {
      title: '',
      color: 0,
      children: [
        convertValueToTreemapItem(0.00000001, 0.0000001),
      ]
    }
  };

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
    this.ws.send('{"op":"unconfirmed_unsub"}');   // TODO check if connected to ws
    this.ws.close();
  }

  componentWillUnmount() {
    this.disconnect();
  }

  onWebSocketMessage = (e) => {
    const outputSum = JSON.parse(e.data).x.out.reduce((s, e) => s + e.value / 10 ** 8, 0);

    this.setState((prevState) => ({
      data: {
        ...prevState.data,
        children: [
          ...prevState.data.children,
          convertValueToTreemapItem(outputSum, outputSum)
        ],
      }
    }));
  }

  render() {
    const { data } = this.state;

    const treeProps = {
      mode: 'circlePack',
      renderMode: 'SVG',
      width: 700,
      height: 600,
      animation: {
        damping: 16,
        stiffness: 80,
      },
      hideRootNode: true,
      colorType: 'linear',
      colorRange: ['#444', '#ccc'],
      padding: 2,
      data: { ...data }
    };

    return (
      <React.Fragment>
        <button onClick={this.connect}>Connect</button>
        <button onClick={this.disconnect}>Disconnect</button>
        <span>{this.state.socketStatus}</span>
        <p>{data.children.length}</p>
        <Treemap {...treeProps} />
      </React.Fragment>
    );
  }
}

export default App;
