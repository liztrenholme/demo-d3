/* eslint-disable no-unused-vars */
// Copyright 2021-2023 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/force-directed-graph
import * as d3 from 'd3';
// import 'd3-force';
import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceCollide,
  forceX,
  forceY,
  // forceProperties,
} from 'd3-force';
import { zoom, zoomidentity } from 'd3-zoom';
import {drag} from 'd3-drag';
import {selection} from 'd3-selection';
import React from 'react';

function createMarkup(html) {
  return { __html: html };
}

// export default function chart(data) {
//   // Specify the dimensions of the chart.
//   const width = 928;
//   const height = 600;
  
//   // Specify the color scale.
//   const color = d3.scaleOrdinal(d3.schemeCategory10);
  
//   // The force simulation mutates links and nodes, so create a copy
//   // so that re-evaluating this cell produces the same result.
//   const links = data.links.map(d => ({...d}));
//   const nodes = data.nodes.map(d => ({...d}));
  
//   // Create a simulation with several forces.
//   const simulation = d3.forceSimulation(nodes)
//     .force('link', d3.forceLink(links).id(d => d.id))
//     .force('charge', d3.forceManyBody())
//     .force('center', d3.forceCenter(width / 2, height / 2))
//     .on('tick', ticked);
  
//   // Create the SVG container.
//   const svg = d3.create('svg')
//     .attr('width', width)
//     .attr('height', height)
//     .attr('viewBox', [0, 0, width, height])
//     .attr('style', 'max-width: 100%; height: auto;');

//   // // **************************
//   // let myCircles = svg.selectAll('circle')
//   //   .data([32, 57, 112, 293]);//binds the data
    
//   // myCircles.enter().append('circle');//enter selection
    
//   // myCircles.attr('cy', 60)
//   //   .attr('cx', function (d, i) {
//   //     return i * 100 + 30;
//   //   })
//   //   .attr('r', function(d) {
//   //     return Math.sqrt(d);
//   //   });//updates all circles

//   // // ****************************
  
//   // Add a line for each link, and a circle for each node.
//   const link = svg.append('g')
//     .attr('stroke', '#999')
//     .attr('stroke-opacity', 0.6)
//     .selectAll()
//     .data(links)
//   // .enter()
//     .join('line')
//     .attr('stroke-width', d => Math.sqrt(d.value));
  
//   const node = svg.append('g')
//     .attr('stroke', '#fff')
//     .attr('stroke-width', 1.5)
//     .selectAll()
//     .data(nodes)
//   // .enter()
//     .join(enter => enter.append('circle')
//       .attr('cx', d => d.x)
//       .attr('cy', d => d.y)
      
//       // .attr('transform', (d,i) => `translate(${ 10 },${ i * 30 })`)
//       // .attr('x', 5)
//       // .attr('dy', '1.25em')
//       // .style('font-size', 14)
//       // .style('font-family', 'sans-serif')
//       // .style('color', 'blue')
//       // .style('opacity', 0)
//       // .text(d => d.name)
//       // .transition().duration(1000)
//       // .style('opacity', 1)
//     // Note that as of v6, we have to call .selection() here
//     // This is because without it, we are returning the transition we've created,
//     // but selection.join() requires us to return a selection for enter and update groups
//     // (but not exit groups)
//       .selection()
//     ,
//     update => update
//       .transition().duration(1000)
//       // .attr('transform', (d,i) => `translate(${ 10 },${ i * 30 })`)
//       .attr('cx', d => d.x)
//       .attr('cy', d => d.y)
//       .style('color', 'black')
//       .selection(),
//     exit => exit
//       .style('fill', 'red')
//       .transition().duration(1000)
//       .attr('transform', (d,i) => `translate(${ 100 },${ i * 30 })`)
//       .remove())
//     .attr('r', 5)
//     .attr('fill', d => color(d.group));
  
    
//   node.append('title')
//     .text(d => d.id);
  
//   // Add a drag behavior.
//   node.call(d3.drag()
//     .on('start', dragstarted)
//     .on('drag', dragged)
//     .on('end', dragended));
  
//   // Set the position attributes of links and nodes each time the simulation ticks.
//   function ticked() {
//     // link.enter()
//     link
//       .attr('x1', d => d.source.x)
//       .attr('y1', d => d.source.y)
//       .attr('x2', d => d.target.x)
//       .attr('y2', d => d.target.y);
//     // node.enter()
//     node
//       .attr('cx', d => d.x)
//       .attr('cy', d => d.y);
//   }
  
//   // Reheat the simulation when drag starts, and fix the subject position.
//   function dragstarted(event) {
//     if (!event.active) simulation.alphaTarget(0.3).restart();
//     event.subject.fx = event.subject.x;
//     event.subject.fy = event.subject.y;
//   }
  
//   // Update the subject (dragged node) position during drag.
//   function dragged(event) {
//     event.subject.fx = event.x;
//     event.subject.fy = event.y;
//   }
  
//   // Restore the target alpha so the simulation cools after dragging ends.
//   // Unfix the subject position now that it’s no longer being dragged.
//   function dragended(event) {
//     if (!event.active) simulation.alphaTarget(0);
//     event.subject.fx = null;
//     event.subject.fy = null;
//   }
  
//   // When this cell is re-run, stop the previous simulation. (This doesn’t
//   // really matter since the target alpha is zero and the simulation will
//   // stop naturally, but it’s a good practice.)
//   // invalidation.then(() => simulation.stop());
  
//   // return svg.node();
//   return  <div style={{backgroundColor: 'lightyellow', width: window.innerWidth - 100}}
//     dangerouslySetInnerHTML={createMarkup(Object.assign(svg.node(), {scales: {color}}).outerHTML)}
//   />;
// }

export default function ForceGraph(data, {
  nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
  nodeGroup, // given d in nodes, returns an (ordinal) value for color
  nodeGroups, // an array of ordinal values representing the node groups
  nodeTitle = (d) => d.name, // given d in nodes, a title string
  nodeFill = 'currentColor', // node stroke fill (if not using a group color encoding)
  nodeStroke = '#fff', // node stroke color
  nodeStrokeWidth = 1.5, // node stroke width, in pixels
  nodeStrokeOpacity = 1, // node stroke opacity
  nodeRadius = 7, // node radius, in pixels
  nodeStrength,
  linkSource = ({source}) => source, // given d in links, returns a node identifier string
  linkTarget = ({target}) => target, // given d in links, returns a node identifier string
  linkStroke = '#999', // link stroke color
  linkStrokeOpacity = 0.6, // link stroke opacity
  linkStrokeWidth = 9.5, // given d in links, returns a stroke width in pixels
  linkStrokeLinecap = 'round', // link stroke linecap
  linkStrength,
  colors = d3.schemeTableau10, // an array of color strings, for the node groups
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  // invalidation // when this promise resolves, stop the simulation
} = {}) {
  console.log('what are all of these???',
    nodeGroup,
    nodeGroups,
    nodeStrength,
    linkStrength,
    nodeTitle,
    data);
  // Compute values.
  const N = d3.map(data.nodes, nodeId).map(intern);
  const LS = d3.map(data.links, linkSource).map(intern);
  const LT = d3.map(data.links, linkTarget).map(intern);
  if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
  const T = nodeTitle == null ? null : d3.map(data.nodes, nodeTitle);
  const G = nodeGroup == null ? null : d3.map(data.nodes, nodeGroup).map(intern);
  const W = typeof linkStrokeWidth !== 'function' ? null : d3.map(data.links, linkStrokeWidth);
  const L = typeof linkStroke !== 'function' ? null : d3.map(data.links, linkStroke);
  
  // Replace the input nodes and links with mutable objects for the simulation.
  const links = data.links.map(d => ({...d}));
  const nodes = data.nodes.map(d => ({...d}));
    
  console.log('AAAAAA', nodes);
  console.log('BBBBBB', links);
  // Compute default domains.
  if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);
  
  // Construct the scales.
  const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);
  console.log('CCCCCC');
  // Construct the forces.
  const forceNode = forceManyBody();
  const forceLink1 = forceLink(links).id(({index: i}) => N[i]);
  if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
  if (linkStrength !== undefined) forceLink1.strength(linkStrength);
  
  const simulation = forceSimulation(nodes)
    .force('link', forceLink(links).id(d => d.id))
    .force('charge', forceManyBody())
    .force('center', forceCenter(width / 2, height / 2))
    .on('tick', ticked);
  
  console.log('DDDDDDD', simulation);
  const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-width / 2, -height / 2, width, height])
    .attr('style', 'max-width: 100%; height: auto;')
    .call(zoom().on('zoom', (event) => {   // <-- `event` argument
      console.log('hello hello is this thing on?');
      svg.attr('transform', event.transform); // <-- use `event` here
    }));
  
  const link = svg.append('g')
    .attr('stroke', typeof linkStroke !== 'function' ? linkStroke : null)
    .attr('stroke-opacity', linkStrokeOpacity)
    .attr('stroke-width', typeof linkStrokeWidth !== 'function' ? linkStrokeWidth : null)
    .attr('stroke-linecap', linkStrokeLinecap)
    .selectAll('line')
    .data(links)
    .join( // join takes 3 args: enter, update, exit
      enter => enter.append('line')
        .attr('x1', d => {
        // console.log('heyo', d)
          return d.source.x;})
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        // .attr('transform', (d,i) => `translate(${ 10 },${ i * 30 })`)
        // .attr('x', 5)
        // .attr('dy', '1.25em')
        // .style('font-size', 14)
        // .style('font-family', 'sans-serif')
        // .style('fill', 'blue')
        // .style('opacity', 0)
        // .text(d => d.name)
        .transition().duration(1000)
        .style('opacity', 1)
      // Note that as of v6, we have to call .selection() here
      // This is because without it, we are returning the transition we've created,
      // but selection.join() requires us to return a selection for enter and update groups
      // (but not exit groups)
        .selection()
      ,
      update => update
        .transition().duration(1000)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .selection(),
      exit => exit
        .remove()
    );
  
  console.log('EEEEEEE');
  const node = svg.append('g')
    .attr('fill', nodeFill)
    .attr('stroke', nodeStroke)
    .attr('stroke-opacity', nodeStrokeOpacity)
    .attr('stroke-width', nodeStrokeWidth)
    .selectAll('circle')
    .data(nodes)
    .join(
      enter => enter.append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .text(d => d.name)
        .transition().duration(1000)
        .style('opacity', 1)
      // Note that as of v6, we have to call .selection() here
      // This is because without it, we are returning the transition we've created,
      // but selection.join() requires us to return a selection for enter and update groups
      // (but not exit groups)
        .selection()
        // .call(drag(simulation))
        .call(
          drag().on('drag', function (evt) {
            node.attr('cx', evt.x).attr('cy', evt.y);
          })
        )
        .on('click', (d) => console.log('d', d))
      ,
      update => update
        .transition().duration(1000)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .selection()
        // .call(drag(simulation))
        .on('click', (d) => console.log('d', d))
        .call(
          drag().on('drag', function (evt) {
            node.attr('cx', evt.x).attr('cy', evt.y);
          })
        ),
      // exit => exit
      //   // .style('fill', 'red')
      //   // .transition().duration(1000)
      //   // .attr('transform', (d,i) => `translate(${ 100 },${ i * 30 })`)
      //   .remove()
    )
    .attr('r', nodeRadius);
    // .call(drag(simulation));

  node.append('title')
    .text(d => d.id);

  // Add a drag behavior.
  node.call(drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended));
  
  console.log('FffffFff');
  if (W) link.attr('stroke-width', ({index: i}) => W[i]);
  if (L) link.attr('stroke', ({index: i}) => L[i]);
  if (G) node.attr('fill', ({index: i}) => color(G[i]));
  if (T) node.append('title').text(({index: i}) => T[i]);
  // if (invalidation != null) invalidation.then(() => simulation.stop());
  
  console.log('GGGGgGGG');
  function intern(value) {
    console.log('what??', value);
    return value !== null && typeof value === 'object' ? value.valueOf() : value;
  }
  
  console.log('HHHHHHHH');
  function ticked() {
    link
      .attr('x1', d => {
        // console.log('heyo', d)
        return d.source.x;})
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .call(
        drag().on('drag', function (evt) {
          node.attr('cx', evt.x).attr('cy', evt.y);
        })
      );
  }
  console.log('link losing coords?', link);
  console.log('node losing coords?', node);
  
  console.log('IIIIIIII');
  // function drag(simulation) {  
  // console.log('hi hi hi hi hi');  
  // function dragstarted(event) {
  //   console.log('drag started?');
  //   if (!event.active) simulation.alphaTarget(0.3).restart();
  //   event.subject.fx = event.subject.x;
  //   event.subject.fy = event.subject.y;
  // }
      
  // function dragged(event) {
  //   event.subject.fx = event.x;
  //   event.subject.fy = event.y;
  // }
      
  // function dragended(event) {
  //   if (!event.active) simulation.alphaTarget(0);
  //   event.subject.fx = null;
  //   event.subject.fy = null;
  // }
      
  // return d3.drag()
  //   .on('start', dragstarted)
  //   .on('drag', dragged)
  // .on('end', dragended);
  // }
  // Reheat the simulation when drag starts, and fix the subject position.
  function dragstarted(event) {
    console.log('dragstarted(event)', event);
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }
  
  // Update the subject (dragged node) position during drag.
  function dragged(event) {
    console.log('dragged(event)', event);
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }
  
  // Restore the target alpha so the simulation cools after dragging ends.
  // Unfix the subject position now that it’s no longer being dragged.
  function dragended(event) {
    console.log('dragended(event)', event);
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
  // const svg = d3.create('svg')
  //   .attr('width', width)
  //   .attr('height', height)
  //   .attr('viewBox', [-width / 2, -height / 2, width, height])
  //   .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');
  
  function zoomFunc(event) {
    svg.attr('transform', event.transform);
  }


  let c = svg.append('circle')
    .attr('cx', 100)
    .attr('cy', 100)
    .attr('r', 8)
    .attr('fill', 'black');
  
  c.call(
    drag().on('drag', function (evt) {
      console.log('event', evt);
      c.attr('cx', evt.x).attr('cy', evt.y);
    })
    // drag().on('drag', function(evt) {
    //   d3.select(this).attr('transform', 'translate(' + (c.x = evt.x) + ',' + (c.y = evt.y) + ')');
    // })
  );
  console.log('c???', c);
  // const svg = d3.create('svg')
  //   .attr('width', width)
  //   .attr('height', height)
  //   .attr('viewBox', [-width / 2, -height / 2, width, height])
  //   .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');
  // // width = +svg.node().getBoundingClientRect().width,
  // // height = +svg.node().getBoundingClientRect().height;

  // // svg objects
  // let link;
  // let node;
  // // the data - an object with nodes and links
  // let graph = data;

  // // load the data
  // // d3.json('miserables.json', function(error, _graph) {
  // //   if (error) throw error;
  // //   graph = _graph;
  // //   initializeDisplay();
  // //   initializeSimulation();
  // // });



  // //////////// FORCE SIMULATION //////////// 

  // // force simulator
  // let simulation = d3.forceSimulation();

  // // set up the simulation and event to update locations after each tick
  // function initializeSimulation() {
  //   simulation.nodes(graph.nodes);
  //   initializeForces();
  //   simulation.on('tick', ticked);
  // }

  // // values for all forces
  // const forceProperties = {
  //   center: {
  //     x: 0.5,
  //     y: 0.5
  //   },
  //   charge: {
  //     enabled: true,
  //     strength: -30,
  //     distanceMin: 1,
  //     distanceMax: 2000
  //   },
  //   collide: {
  //     enabled: true,
  //     strength: .7,
  //     iterations: 1,
  //     radius: 5
  //   },
  //   forceX: {
  //     enabled: false,
  //     strength: .1,
  //     x: .5
  //   },
  //   forceY: {
  //     enabled: false,
  //     strength: .1,
  //     y: .5
  //   },
  //   link: {
  //     enabled: true,
  //     distance: 30,
  //     iterations: 1
  //   }
  // };

  // // add forces to the simulation
  // function initializeForces() {
  //   // add forces and associate each with a name
  //   simulation
  //     .force('link', forceLink())
  //     .force('charge', forceManyBody())
  //     .force('collide', forceCollide())
  //     .force('center', forceCenter())
  //     .force('forceX', forceX())
  //     .force('forceY', forceY());
  //   // apply properties to each of the forces
  //   updateForces();
  // }

  // // apply new force properties
  // function updateForces() {
  //   // get each force by name and update the properties
  //   simulation.force('center')
  //     .x(width * forceProperties.center.x)
  //     .y(height * forceProperties.center.y);
  //   simulation.force('charge')
  //     .strength(forceProperties.charge.strength * forceProperties.charge.enabled)
  //     .distanceMin(forceProperties.charge.distanceMin)
  //     .distanceMax(forceProperties.charge.distanceMax);
  //   simulation.force('collide')
  //     .strength(forceProperties.collide.strength * forceProperties.collide.enabled)
  //     .radius(forceProperties.collide.radius)
  //     .iterations(forceProperties.collide.iterations);
  //   simulation.force('forceX')
  //     .strength(forceProperties.forceX.strength * forceProperties.forceX.enabled)
  //     .x(width * forceProperties.forceX.x);
  //   simulation.force('forceY')
  //     .strength(forceProperties.forceY.strength * forceProperties.forceY.enabled)
  //     .y(height * forceProperties.forceY.y);
  //   simulation.force('link')
  //     .id(function(d) {return d.id;})
  //     .distance(forceProperties.link.distance)
  //     .iterations(forceProperties.link.iterations)
  //     .links(forceProperties.link.enabled ? graph.links : []);

  //   // updates ignored until this is run
  //   // restarts the simulation (important if simulation has already slowed down)
  //   simulation.alpha(1).restart();
  // }



  // //////////// DISPLAY ////////////

  // // generate the svg objects and force simulation
  // function initializeDisplay() {
  // // set the data and properties of link lines
  //   link = svg.append('g')
  //     .attr('class', 'links')
  //     .selectAll('line')
  //     .data(graph.links)
  //     .enter().append('line');

  //   // set the data and properties of node circles
  //   node = svg.append('g')
  //     .attr('class', 'nodes')
  //     .selectAll('circle')
  //     .data(graph.nodes)
  //     .enter().append('circle')
  //     .call(d3.drag()
  //       .on('start', dragstarted)
  //       .on('drag', dragged)
  //       .on('end', dragended));

  //   // node tooltip
  //   node.append('title')
  //     .text(function(d) { return d.id; });
  //   // visualize the graph
  //   updateDisplay();
  // }

  // // update the display based on the forces (but not positions)
  // function updateDisplay() {
  //   node
  //     .attr('r', forceProperties.collide.radius)
  //     .attr('stroke', forceProperties.charge.strength > 0 ? 'blue' : 'red')
  //     .attr('stroke-width', forceProperties.charge.enabled==false ? 0 : Math.abs(forceProperties.charge.strength)/15);

  //   link
  //     .attr('stroke-width', forceProperties.link.enabled ? 1 : .5)
  //     .attr('opacity', forceProperties.link.enabled ? 1 : 0);
  // }

  // // update the display positions after each simulation tick
  // function ticked() {
  //   link
  //     .attr('x1', function(d) { return d.source.x; })
  //     .attr('y1', function(d) { return d.source.y; })
  //     .attr('x2', function(d) { return d.target.x; })
  //     .attr('y2', function(d) { return d.target.y; });

  //   node
  //     .attr('cx', function(d) { return d.x; })
  //     .attr('cy', function(d) { return d.y; });
  //   d3.select(svg).style('flex-basis', (simulation.alpha()*100) + '%');
  // }



  // //////////// UI EVENTS ////////////

  // function dragstarted(event, d) {
  //   if (!event.active) simulation.alphaTarget(0.3).restart();
  //   d.fx = d.x;
  //   d.fy = d.y;
  // }

  // function dragged(event, d) {
  //   console.log('event is...', event);
  //   d.fx = event.x;
  //   d.fy = event.y;
  // }

  // function dragended(event, d) {
  //   if (!event.active) simulation.alphaTarget(0.0001);
  //   d.fx = null;
  //   d.fy = null;
  // }

  // // update size-related forces
  // d3.select(window).on('resize', function(){
  //   width = +svg.node().getBoundingClientRect().width;
  //   height = +svg.node().getBoundingClientRect().height;
  //   updateForces();
  // });

  // // convenience function to update everything (run after UI input)
  // function updateAll() {
  //   updateForces();
  //   updateDisplay();
  // }
  // console.log('svg???', svg);
  return (
  //   <div
  //  dangerouslySetInnerHTML={createMarkup(
  //   Object.assign(svg.node(), {scales: {color}}).dangerouslySetInnerHTML
  //  )}
  //  />
    // <div style={{backgroundColor: '#f3f3f3', width: window.innerWidth - 100}}
    //   dangerouslySetInnerHTML={createMarkup(svg.node()).outerHTML}
    // />
    <div style={{backgroundColor: '#f3f3f3', width: window.innerWidth - 100}}
      dangerouslySetInnerHTML={createMarkup(Object.assign(svg.node(), {scales: {color}}).outerHTML)}
    />
  );
}