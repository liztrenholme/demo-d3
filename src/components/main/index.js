/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import {getData} from '../../lib/sdk';
import './main.css';
// import Network from '../network';
// import Viz from '../graph3d/index';
// import ForceGraph from '../graph3d/networkD3';
import NetworkChart from '../graph3d/networkD32';

function Main (props) {
  // state = {
  //   data: {},
  //   stateMode: true,
  //   nationalMode: false,
  //   selectedState: 'Ohio',
  //   availableStates: [],
  //   anchored: [],
  //   updating: false,
  //   animationEnabled: true,
  //   page: 1
  // };
  const [chart, setChart] = useState(null);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let dataRes = {};
    const fetchData = async (page) => {
      dataRes = await getData(page);
      if (dataRes && dataRes.data) {
        setData(dataRes.data);
      }
    };
    fetchData(page).catch((e) => {
      console.log('error fetching', e);
    });
  }, [page, chart, data.length]);

  const handleAddPage = () => {
    setPage(page + 1);
    handleFetchData(page + 1);
  };

  const handleFetchData = async (page) => {
    const data = await getData(page);
    const prevData = data;
    if (data && data.data) {
      const newData = prevData.concat(data.data);
      setData(newData);
    }
  };

  // selectNode = (id) => () => {
  //   const {anchored} = this.state;
  //   anchored.push(id);
  //   // this.setState({anchored});
  // }

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
  console.log('all the nodes?', nodesForUse, data);
  // const newChart = ForceGraph({nodes: nodesForUse, links: edges}, {
  //   nodeId: d => d.id,
  //   nodeGroup: d => d.group,
  //   nodeGroups: Object.keys(nodesDivisions),
  //   nodeTitle: d => `${d.name}\n${d.group}`,
  //   linkStrokeWidth: l => Math.sqrt(l.value),
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  //   // invalidation: () => ({then: (d) => console.log(d)}) // a promise to stop the simulation when the cell is re-run
  // });
  // if (!chart && data.length) {
  //   setChart(newChart);
  // }
  return (
    <div className="main">
      <div className="main-layout">
        <div className="graph-3d">
          {/* <div dangerouslySetInnerHTML={{__html: svg}} /> */}
          {/* {chart} */}
          {/* {svg} */}
          <NetworkChart
            data={{nodes: nodesForUse, links: edges}}
            nodeId={(d) => d.id + d.name} // given d in nodes, returns a unique identifier (string)
            nodeGroup={d => d.group} // given d in nodes, returns an (ordinal) value for color
            nodeGroups={Object.keys(nodesDivisions)} // an array of ordinal values representing the node groups
            nodeTitle={(d) => d.name} // given d in nodes, a title string
            nodeFill={'currentColor'} // node stroke fill (if not using a group color encoding)
            nodeStroke={'#fff'} // node stroke color
            nodeStrokeWidth={1.5} // node stroke width, in pixels
            nodeStrokeOpacity={1} // node stroke opacity
            nodeRadius={15} // node radius, in pixels
            nodeStrength={null}
            linkSource={({source}) => source} // given d in links, returns a node identifier string
            linkTarget={({target}) => target} // given d in links, returns a node identifier string
            linkStroke={'#999'} // link stroke color
            linkStrokeOpacity={0.6} // link stroke opacity
            linkStrokeWidth={9.5} // given d in links, returns a stroke width in pixels
            linkStrokeLinecap={'round'} // link stroke linecap
            linkStrength={2}
            colors={10}
            width={window.innerWidth - 100}
            height={window.innerHeight - 100} />
        </div>
      </div>
      {/* <footer>Data source: Johns Hopkins University via RapidAPI</footer> */}
    </div>
  );
}


export default Main;
