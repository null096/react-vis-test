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

class App extends Component {
  render() {
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
        stroke: 'rgb(148, 36, 192)',
      },
      colorDomain: [0, 1, 2],
      colorRange: ['white', 'black', 'gray'],
      padding: 2,
      data: getRandomData(),
    };

    return (
      <React.Fragment>
        <button onClick={() => this.forceUpdate()}>Update</button>
        <Treemap {...treeProps} />
      </React.Fragment>
    );
  }
}

export default App;
