import $ from 'jquery';
import * as d3 from 'd3';
import * as d3Symbol from 'd3-symbol-extra';
import { clampIndex } from './utils';
// import d3Ease from 'd3-ease';

var language = 'english'
var loc = window.location.pathname
if (loc.includes('en-espanol')) {
  language = 'espanol'
}

export function runData(datafile) {

 const commas = d3.format(',');

 let h = 200;

  let globalGenderPool = ['female', 'male'];

  let globalReadableGenders = ["FEMALE", "MALE"];
  let another_text_read = 'ANOTHER'
  let unknown_text_read = 'UNKNOWN'
  if (language == "espanol") {
    globalReadableGenders = ["MUJER","HOMBRE"]
    another_text_read = 'OTRO'
    unknown_text_read = 'DESCONOCIDO'
  }

  let genderColors = ['#ef00ae', '#00aeef'];

  if (datafile['another'] != null) {
    globalGenderPool.push('another');
    globalReadableGenders.push(another_text_read);
    genderColors.push('#8531BA');
  }

  if (datafile['unknown'] != null) {
    globalGenderPool.push('unknown');
    globalReadableGenders.push(unknown_text_read);
    genderColors.push('grey');
  }

  console.log("array length: " + Object.keys(datafile).length);
  if (Object.keys(datafile).length == 4) {
    h = 150;
  }

// set the dimensions and margins of the graph
const margin = {top: 0, right: 25, bottom: 130, left: 0},
height = h - margin.top - margin.bottom;
let windowWidth;

if ($(window).width() <= 650 ) {
windowWidth = $('#demographics').width();
} else {
windowWidth = $(window).width()
}

const width = Math.min(625, $(window).width() - margin.left - margin.right);
const barWidth = 25;
const barSpace = 8;
const chartHeight = 200;
const chartWidth = Math.min(600, windowWidth);

const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, chartWidth]);

  let rectangles = globalGenderPool.map(function(gender) {
        return {
            label: gender,
            value: datafile[`${gender}`]/datafile['total'] *100
        };
  })

  const svg = d3.select('#gender-chart')
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom);

var group = svg.selectAll('g')
  .data(rectangles)
  .enter().append("g")
  .attr("transform", (d, i) => {
    return "translate(" + margin.left + "," + ((i * 45) + margin.top) + ")"
  })
  .attr("class", (d, i) => { return d.label })

group.append("rect")
        .attr("class", "dummy-bar")
        .attr("width", chartWidth)
        .attr("y", 0)
        .attr("x", 0)
        .attr("height", barWidth + 20)
        .attr("fill", "white");

group.append("rect")
        .attr("class", "backBar")
        .attr("width", chartWidth)
        .attr("y", 0)
        .attr("x", 0)
        .attr("height", barWidth)
        .attr("fill", "#ebebeb");

group.append("rect")
        .attr("class", "bar-fill")
        .attr("width", 0)
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", barWidth)
        .attr("fill", function (d, i) { return d3.rgb(genderColors[i]).darker(.5)})
        .transition()
        .delay(function (d, i) { 
          return i*40; })
        .attr("width", function (d, i) { 
          return x(d.value); 
        })
group.append("text")
        .attr("class", "bar-label")
        .attr("x", 0)
        .attr("y", 17)
        .text(function(d, i) { 
          if (isNaN(d.value)) {
            return "N/A"
          } else {
            if (Math.round(d.value) == 0) {
                return "< 1%"
            } else {
                return Math.round(d.value) + "%"
            }}
          })
          
        .attr("fill", function (d, i) { 
          if (d.value < 90){
            return "black"; 
          } else if (isNaN(d.value)) {
            return "#c4c4c4"
          } else {
            return "white"; 
          }
        })
        .attr("opacity", 0)
        .transition()
        .delay(function (d, i) { 
          return i*40 + 80; })
        .attr("opacity", 1)
        .attr("x", function (d, i) { 
          if (d.value < 90){
            return x(d.value) + 5; 
          } else if (isNaN(d.value)) {
            return x(50)
          } else {
            return x(d.value) - 40; 
          }
        })
group.append("text")
        .classed("label", true)
        .attr("height", 70)
        .attr("x", 0)
        .attr("y", 38)
        .attr("dy", 0)
        .text((d, i) => { 
          //  + " (" + datafile[globalGenderPool[i]] + ")"
          return globalReadableGenders[i]})
        .attr("opacity", 0)
        .transition()
        .delay(function (d, i) { 
          return i*40 + 500; })
        .attr("opacity", 1)
}

 export default {runData}