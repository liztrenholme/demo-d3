/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import {drag} from 'd3-drag';
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

const NetworkChart = (props) => {
  let {data,
    nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
    nodeGroup, // given d in nodes, returns an (ordinal) value for color
    nodeGroups, // an array of ordinal values representing the node groups
    nodeTitle = (d) => d.name, // given d in nodes, a title string
    nodeFill = 'currentColor', // node stroke fill (if not using a group color encoding)
    nodeStroke = '#fff', // node stroke color
    nodeStrokeWidth = 1.5, // node stroke width, in pixels
    nodeStrokeOpacity = 1, // node stroke opacity
    nodeRadius = 25, // node radius, in pixels
    nodeStrength,
    linkSource = ({source}) => source, // given d in links, returns a node identifier string
    linkTarget = ({target}) => target, // given d in links, returns a node identifier string
    linkStroke = '#999', // link stroke color
    linkStrokeOpacity = 0.6, // link stroke opacity
    linkStrokeWidth = 9.5, // given d in links, returns a stroke width in pixels
    linkStrokeLinecap = 'round', // link stroke linecap
    linkStrength,
    width,
    height,
    cluster,
    handleSetCluster
  } = props;
  const colors = d3.schemeTableau10;
  const [contextmenuData, setContextmenuData] = useState({});
  const svgRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    // D3 Code

    // Dimensions
    let dimensions = {
      width: props.width,
      height: props.height,
      margins: 50,
    };

    dimensions.containerWidth = dimensions.width - dimensions.margins * 2;
    dimensions.containerHeight = dimensions.height - dimensions.margins * 2;

    // SELECTIONS
    const svg = d3
      .select(svgRef.current)
      .classed('network-chart', true)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .style('background-color', '#f5f5f5');


    // clear all previous content on refresh
    const everything = svg.selectAll('*');
    everything.remove();
    
    const container = svg
      .append('g')
      .classed('container', true)
      .attr('transform', `translate(${dimensions.margins}, ${dimensions.margins})`);


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
    
    console.log('nodes', nodes);
    console.log('links', links);
    // Compute default domains.
    if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);
  
    // Construct the scales.
    const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

    // Construct the forces.
    const forceNode = forceManyBody();
    const forceLink1 = forceLink(links).id(({index: i}) => N[i]);
    if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
    if (linkStrength !== undefined) forceLink1.strength(linkStrength);
  
    const simulation = forceSimulation(nodes)
      .force('link', forceLink(links).id(d => d.id).distance(100))
      .force('charge', forceManyBody().distanceMin(200).distanceMax(1000))
      .force('center', forceCenter(width / 2, height / 2))
      .on('tick', ticked);
    
    const link = container.append('g')
      .attr('stroke', typeof linkStroke !== 'function' ? linkStroke : null)
      .attr('stroke-opacity', linkStrokeOpacity)
      .attr('stroke-width', typeof linkStrokeWidth !== 'function' ? linkStrokeWidth : null)
      .attr('stroke-linecap', linkStrokeLinecap)
      .selectAll('line')
      .data(links)
      .join( // join takes 3 args: enter, update, exit
        enter => enter.append('line')
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y)
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
  
    const node = container.append('g')
      .attr('fill', nodeFill)
      .attr('fill-opacity', 1)
      .attr('stroke', nodeStroke)
      .attr('stroke-opacity', nodeStrokeOpacity)
      .attr('stroke-width', nodeStrokeWidth)
      .selectAll('circle')
      .data(nodes)
      .join( // join takes 3 args: enter, update, exit
        enter =>  enter.append('circle')
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
          .transition().duration(100)
          // .style('opacity', d => d.group === d.label ? cluster ? 1 : 0 : 0)
          
        // Note that as of v6, we have to call .selection() here
        // This is because without it, we are returning the transition we've created,
        // but selection.join() requires us to return a selection for enter and update groups
        // (but not exit groups)
          .selection()
          .on('click', (d) => console.log('d', d))
          .on('dblclick', (event, d) => {
            event.stopPropagation(); // auto zoom when double clicking node
            handleSetCluster(d);
          })
          .on('contextmenu', (event, d) => {
            console.log('context!', event, d);
            event.preventDefault();
            setContextmenuData(d);
            d3.select('context-container')
              .style('position', 'absolute')
              .attr('position', 'absolute')
              .style('left', event.pageX + 50 + 'px')
              .style('top', event.pageY +'px');
            var contextContainer = d3.select('g').append('div');
            contextContainer
              .append('div')
              .style('position', 'absolute')
              .attr('position', 'absolute')
              .style('left', event.pageX + 50 + 'px')
              .style('top', event.pageY +'px')
              .classed('context-info', true)
              .html(`${d.label} <br> Division: ${d.division} <br> Conference: ${d.conference}`);
          }),
        //   .on('mouseover', function (d) {
        //     console.log('mouseover');
        //     var div = d3.select(node).append('div')
        //       .attr('pointer-events', 'none')
        //       .attr('class', 'tooltip')
        //       .style('opacity', 1)
        //       .html('FIRST LINE <br> SECOND LINE')
        //       .style('left', (d.x + 50 + 'px'))
        //       .style('top', (d.y +'px'));
        //   }),
        update => update
          .transition().duration(1000)
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
          .selection(),
        exit => exit
          .remove()
      )
      .attr('r', nodeRadius);

    node.append('title')
      .text(d => (d.city || d.group) + ' ' + (d.name || ''));

    const textElems = container
      .append('g')
      .selectAll('text')
      .data(nodes)
      .join( // join takes 3 args: enter, update, exit
        enter => 
          enter
            .append('text')
            .text(node => node.label)
            .attr('font-size',12)//font size
            .attr('text-anchor', 'middle')
            .attr('dx', node => node.x - 100)//positions text towards the left of the center of the circle
            .attr('dy',node => node.y)
            .attr('background-color', 'white')
          // Note that as of v6, we have to call .selection() here
          // This is because without it, we are returning the transition we've created,
          // but selection.join() requires us to return a selection for enter and update groups
          // (but not exit groups)
            .selection(),
        //   .on('mouseover', function (d) {
        //     console.log('mouseover');
        //     var div = d3.select(node).append('div')
        //       .attr('pointer-events', 'none')
        //       .attr('class', 'tooltip')
        //       .style('opacity', 1)
        //       .html('FIRST LINE <br> SECOND LINE')
        //       .style('left', (d.x + 50 + 'px'))
        //       .style('top', (d.y +'px'));
        //   }),
        update => update
          .transition().duration(1000)
          .attr('dx', d => d.x)
          .attr('dy', d => d.y)
          .selection(),
        exit => exit
          .remove()
      );
  
    if (W) link.attr('stroke-width', ({index: i}) => W[i]);
    if (L) link.attr('stroke', ({index: i}) => L[i]);
    if (G) node.attr('fill', ({index: i}) => color(G[i]));
    if (T) node.append('title').text(({index: i}) => T[i]);
    // if (invalidation != null) invalidation.then(() => simulation.stop());
  
    function intern(value) {
      return value !== null && typeof value === 'object' ? value.valueOf() : value;
    }
  
    function ticked() {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended))
        .append('text', true)
        .text(d => (d.city || d.group) + ' ' + (d.name || ''));
      svg     
        .call(zoom().on('zoom', (event) => {   // <-- `event` argument attaches to svg
          svg.select('g').attr('transform', event.transform); // <-- use `event` here on svg child
        }))
        .call(
          drag().on('drag', (evt) => {
            svg.attr('cx', evt.x).attr('cy', evt.y);
          })
        );
      // .on('click', (d) => setContextmenuData({}));
      textElems
        .attr('dx', d => d.x)
        .attr('dy', d => d.y)
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended))
        .append('text', true)
        .text(d => (d.city || d.group) + ' ' + (d.name || ''));
    }
  

    // Reheat the simulation when drag starts, and fix the subject position.
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
  
    // Update the subject (dragged node) position during drag.
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
  
    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    const menuItems = [
      {
        title: 'First action',
        action: (d) => {
          // TODO: add any action you want to perform
          console.log(d);
        }
      },
      {
        title: 'Second action',
        action: (d) => {
          // TODO: add any action you want to perform
          console.log(d);
        }
      }
    ];

    const contextContainer = d3.select(contextRef.current)
      .classed('context-div', true)
      .attr('width',100)
      .attr('height', 200);
    if (contextmenuData && Object.keys(contextmenuData).length) {
      // console.log(d3.select('context.info'));
      // console.log('context coords:', contextmenuData, contextmenuData.x);
      // .attr('x', contextmenuData.x)
      // .attr('y', contextmenuData.y);
      contextContainer
        .append('div')
        .classed('context-info', true)
        .html(`${contextmenuData.label} <br> Division: ${contextmenuData.division} <br> Conference: ${contextmenuData.conference}`)
        .style('left', (contextmenuData.x + 50 + 'px'))
        .style('top', (contextmenuData.y +'px'));
    } else {
      svg.selectAll('context-div').style('display', 'none');
    }
  }, [props.data, svgRef.current, contextRef.current, contextmenuData]); // redraw chart if data changes
  return (<div>
    <div className="context-container" style={{position: 'absolute'}} ref={contextRef} />
    <svg ref={svgRef} />
  </div>);
};

export default NetworkChart;