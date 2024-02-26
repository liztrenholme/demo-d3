/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useLayoutEffect } from 'react';
import {getData} from '../../lib/sdk';
import './main.css';
// import Network from '../network';
// import Viz from '../graph3d/index';
// import ForceGraph from '../graph3d/networkD3';
import NetworkChart from '../graph3d/networkD3';
import testData from './test-data.json';

function Main () {
  const [chart, setChart] = useState(null);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState([0, 0]);
  const [cluster, setCluster] = useState(true);

  function useWindowSize() {
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }

  useEffect(() => {
    let dataRes = {};
    // const fetchData = async (page) => {
    //   dataRes = await getData(page);
    //   if (dataRes && dataRes.data) {
    //     setData(dataRes.data);
    //   }
    // };
    if (!data.length) {
      setData(testData);
      // fetchData(page).catch((e) => {
      //   console.log('error fetching', e);
      // });
    }
  }, [page, chart, data.length]);

  const handleAddPage = async () => {
    if (page === 2) {
      return;
    }
    setPage(page + 1);
    await handleFetchData(page + 1);
  };

  const handleFetchData = async (page) => {
    const response = await getData(page);
    const prevData = data;
    if (response && response.data) {
      const newData = prevData.concat(response.data);
      setData(newData);
    }
  };

  const handleSetCluster = (d) => {
    if (cluster[d.id]) {
      setCluster({...cluster, [d.id]: false});
    } else {
      setCluster({...cluster, [d.id]: true});
    }
  };
  // selectNode = (id) => () => {
  //   const {anchored} = this.state;
  //   anchored.push(id);
  //   // this.setState({anchored});
  // }

  console.log('data is', testData);

  const nodesForUse = [];
  // eslint-disable-next-line no-unused-expressions
  // data && data.length 
  //   ? data.forEach(i => {
  //     nodesForUse.push({
  //       id: i.id,
  //       label: i.full_name,
  //       shape: 'circle',
  //       shadow: true,
  //       scaling: {min: 0, max: 100, label: {enabled: true}},
  //       selectable: true,
  //       color: 'orange',
  //       name: i.name,
  //       conference: i.conference,
  //       city: i.city,
  //       abbreviation: i.abbreviation,
  //       division: i.division,
  //       group: i.division
  //     });
  //   })
  //   : null;
  // Object.keys(nodesDivisions).forEach(i => {
  //   nodesForUse.push(nodesDivisions[i]);
  // });

  Object.keys(data).forEach(i => {
    nodesForUse.push({...data[i], group: i, label: i, id: i});
    if (!cluster[i]) {
      Object.keys(data[i]).forEach(j => typeof data[i][j] === 'string' 
        ? nodesForUse.push({...data[i], group: i, label: i})
        : nodesForUse.push({...data[i][j], group: i, label: j, id: j}));
    }
  });

  const allEdges = nodesForUse.length 
    ? nodesForUse.map(i => {return({ source: i.group, target: i.label, value: 2 });}) : [];
  const edges = allEdges;
  const [width, height] = useWindowSize();
  return (
    <div className="main">
      <h1>Sun and Moon Data</h1>
      <div className="main-layout">
        <div className="graph-3d">
          <NetworkChart
            data={{nodes: nodesForUse, links: edges}}
            nodeId={(d) => d.id + d.name} // given d in nodes, returns a unique identifier (string)
            nodeGroup={d => d.group} // given d in nodes, returns an (ordinal) value for color
            nodeGroups={Object.keys(data)} // an array of ordinal values representing the node groups
            nodeTitle={(d) => d.name} // given d in nodes, a title string
            nodeFill={'currentColor'} // node stroke fill (if not using a group color encoding)
            nodeStroke={'#fff'} // node stroke color
            nodeStrokeWidth={1} // node stroke width, in pixels
            nodeStrokeOpacity={1} // node stroke opacity
            nodeRadius={45} // node radius, in pixels
            nodeStrength={90}
            linkSource={({source}) => source} // given d in links, returns a node identifier string
            linkTarget={({target}) => target} // given d in links, returns a node identifier string
            linkStroke={'#999'} // link stroke color
            linkStrokeOpacity={0.6} // link stroke opacity
            linkStrokeWidth={5} // given d in links, returns a stroke width in pixels
            linkStrokeLinecap={'round'} // link stroke linecap
            linkStrength={20}
            colors={10}
            width={width - 100}
            height={height - 100}
            cluster={cluster}
            handleSetCluster={handleSetCluster} />
        </div>
      </div>
    </div>
  );
}


export default Main;
