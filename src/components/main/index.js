/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import {getData} from '../../lib/sdk';
import './main.css';
import Network from '../network';
// import Viz from '../graph3d/index';
import ForceGraph from '../graph3d/networkD3';

class Main extends Component {
  state = {
    data: {},
    stateMode: true,
    nationalMode: false,
    selectedState: 'Ohio',
    availableStates: [],
    anchored: [],
    updating: false,
    animationEnabled: true,
    page: 1
  };

  async componentDidMount() {
    const data = await getData(this.state.page);
    if (data && data.data) {
      this.setState({data: data.data});
    }
  }


  handleAddPage = () => {
    const {page} = this.state;
    this.setState({page: page + 1});
    this.handleFetchData(page + 1);
  }

  handleFetchData = async (page) => {
    const data = await getData(page);
    const prevData = this.state.data;
    if (data && data.data) {
      const newData = prevData.concat(data.data);
      this.setState({data: newData});
    }
  }
  clearViz = (e) => this.setState({stateMode: false, nationalMode: false, selectedState: e.currentTarget.value}, () => {
    this.chooseState();
  });
  chooseState = () => {
    this.setState({stateMode: true});
  }

  selectNode = (id) => () => {
    const {anchored} = this.state;
    anchored.push(id);
    // this.setState({anchored});
  }

  updateVis = () => this.setState({updating: true})

  render() {
    const { data, stateMode } = this.state;
    const nodesDivisions = {
      Pacific: {
        id: 'Pacific',
        group: 'Pacific'        
      }, 
      Southwest: {
        id: 'Southwest',
        group: 'Southwest'
      }, 
      Atlantic: {
        id: 'Atlantic',
        group: 'Atlantic'
      }, 
      Central: {
        id: 'Central',
        group: 'Central'
      }, 
      Southeast: {
        id: 'Southeast',
        group: 'Southeast'
      }, 
      Northwest: {
        id: 'Northwest',
        group: 'Northwest',
        name: 'Northwest',
        label: 'Northwest'
      }
    };
    const nodesForUse = [];
    // eslint-disable-next-line no-unused-expressions
    data && data.length 
      ? data.forEach(i => {
        nodesForUse.push({
          id: i.id,
          label: i.full_name,
          shape: 'circle',
          shadow: true,
          scaling: {min: 0, max: 100, label: {enabled: true}},
          selectable: true,
          color: 'orange',
          name: i.name,
          conference: i.conference,
          city: i.city,
          abbreviation: i.abbreviation,
          division: i.division,
          group: i.division
        });
      })
      : null;
    Object.keys(nodesDivisions).forEach(i => {
      nodesForUse.push(nodesDivisions[i]);
    });

    const allEdges = data && data.length 
      ? data.map(i => {return({ source: i.division, target: i.id, value: 2 });}) : [];
    const edges = allEdges;
    const chart = ForceGraph({nodes: nodesForUse, links: edges}, {
      nodeId: d => d.id,
      nodeGroup: d => d.group,
      nodeTitle: d => `${d.name}\n${d.group}`,
      linkStrokeWidth: l => Math.sqrt(l.value),
      width: window.innerWidth,
      height: window.innerHeight,
      invalidation: () => ({then: (d) => console.log(d)}) // a promise to stop the simulation when the cell is re-run
    });
    console.log('ugh', chart);
    return (
      <div className="main">
        <div className="main-layout">
          <div className="graph-3d">
            {/* <div dangerouslySetInnerHTML={{__html: svg}} /> */}
            {chart}
            {/* {svg} */}
          </div>
        </div>
        {/* <footer>Data source: Johns Hopkins University via RapidAPI</footer> */}
      </div>
    );
  }
}

export default Main;
