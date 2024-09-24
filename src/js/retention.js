import $ from 'jquery';
import * as d3 from 'd3';
import tooltip from './tooltip';

var language = "english"
var loc = window.location.pathname
if (loc.includes('en-espanol')) {
  language = 'espanol'
}

const nationalAverage = [[71.85,45.84],[62.60,43.60]]
export function findData(retention, radioValue){
// Detrermine which variable to port in from the school's JSON file

let retentionData;
let chartableRetention = retention.yearly_data.slice(1, 10).reverse();
if (retention.level === 4 || retention.level === 5 || retention.level === 6){
  retentionData = chartableRetention.map(year => {
    $('#retention-placeholder').hide();
    const thisYear = {
      'sector':1,
      'timescale': '20' + year.year.slice(0,2),
      'ftRetentionPct': year.full_time_retention_rate,
      'ptRetentionPct': year.part_time_retention_rate

    }
    return thisYear;
  });
  } else {
    retentionData = chartableRetention.map(year => {
    $('#retention-placeholder').hide();
    const thisYear = {
      'sector':0,
      'timescale': '20' + year.year.slice(0,2),
      'ftRetentionPct': year.full_time_retention_rate,
      'ptRetentionPct': year.part_time_retention_rate

    }
    return thisYear;
  });
  }

  return retentionData;
}

function isitChartable(data){
  for (let d of data){
    if (d.ftRetentionPct){
        return true;
      };
  }
}
 // responsiveness
 let window_width = $(window).width();
 let fullWidth;
 let fullHeight;

export function runData(datafile) {
  var natl_avg_text = "NAT'L AVERAGE"
  if (language == "espanol") {
    natl_avg_text = "PROMEDIO NACIONAL"
  }

  const chartable = isitChartable(datafile);
  if (!chartable) {
    $('#retention-container').hide();
    $('#retention-placeholder').show();
  }

 const commas = d3.format(',');

 // set the dimensions and margins of the graph
 const margin = {top: 15, right: 25, bottom: 130, left: 0},
      height = 100 - margin.top - margin.bottom;

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

  const globalRetPool = ['ft','pt'];
  var globalReadableRet = ["FULL-TIME","PART-TIME"];
  if (language == "espanol") {
    globalReadableRet = ["TIEMPO COMPLETO","TIEMPO PARCIAL"]
  }
  const retColors = ['#000000','#00aeef'];

  let rectangles = globalRetPool.map(function(type) {


      // averageRet += (datafile[i][`${ret}RetentionPct`]['rate']/100)*datafile[i][`${race}RetentionPct`]['cohort'];
      // Need to fix this when you run the data again

    let averageRet = datafile[3][`${type}RetentionPct`]
      // averageCohort += datafile[i][`${ret}RetentionPct`]

    return {
      label: type,
      value: averageRet
    };
  })

  const svg = d3.select('#retention-rates-chart')
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
        .attr("fill", function (d, i) { return d3.rgb(retColors[i]).darker(.5)})
        .transition()
        .delay(function (d, i) { 
          return i*40; })
        .attr("width", function (d, i) { 
          return x(d.value*100); 
        })
group.append("text")
        .attr("class", "bar-label")
        .attr("x", 0)
        .attr("y", 17)
        .text(function(d, i) { 
          if (d.value == null || isNaN(d.value)) {
            return "N/A"
          } else {
            return Math.round(d.value*100) + "%"}
          })
          
        .attr("fill", function (d, i) { 
          if (d.value == null || isNaN(d.value)) {
            return "#c4c4c4"
          }
          else if (d.value < .9){
            return "black"; 
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
          if (d.value == null || isNaN(d.value)) {
            return x(50)
          } 
          else if (d.value < .9){
            return x(d.value*100) + 5; 
          } else {
            return x(d.value*100) - 40; 
          }
        })
group.append("text")
        .classed("label", true)
        .attr("height", 70)
        .attr("x", 0)
        .attr("y", 38)
        .attr("dy", 0)
        .text((d, i) => { 
          return globalReadableRet[i]})
        .attr("opacity", 0)
        .transition()
        .delay(function (d, i) { 
          return i*40 + 500; })
        .attr("opacity", 1)

    
group.append("path")
        .attr("class", "triangle")
      .attr("transform", function(d, i) { return "translate(" + 0 + "," + -10 + ")"; })
      .attr("d", d3.symbol().size(30).type(d3.symbolTriangle))
      .attr("pointer-events", "none")
      .attr("opacity", 0)
        .transition()
        .duration(1050)
        .ease(d3.easeElastic)
        .delay(function (d, i) { 
          return i*40 + 1000; })
        .attr("opacity", function(d, i) {
          if (i < 1) {
            return 1
          } else {
            return 0
          }
        })
        .attr("transform", function(d, i) { 
          return "translate(" + x(nationalAverage[datafile[0].sector][i]) + "," + -10 + ") rotate(-60)"; })
    
    if (language == "espanol") {
      group.append("text")
      .attr("class", "triangle-label")
            .attr("height", 70)
      .attr("x", -30)
      .attr("y", 0)
      .attr("width", chartWidth)
      .attr("pointer-events", "none")
      .attr("transform", function(d, i) { return "translate(" + 10 + "," + -7 + ")"; })
      .attr("dy", 0)
      .text((d, i) => { 
        return natl_avg_text})
      .attr("font-size", 12)
      .attr("opacity", 0)
      .transition()
      .duration(1050)
      .ease(d3.easeElastic)
      .delay(function (d, i) { 
        return i*40 + 1000; })
      .attr("opacity", function(d, i) {
        if (i < 1) {
          return 1
        } else {
          return 0
        }
      })
      .attr("text-anchor", "beginning")
      .attr("transform", function(d, i) { return "translate(" + (x(nationalAverage[datafile[0].sector][i]) - 105) + "," + -4 + ")"; });
    } else {
      group.append("text")
          .attr("class", "triangle-label")
                .attr("height", 70)
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", chartWidth)
          .attr("pointer-events", "none")
          .attr("transform", function(d, i) { return "translate(" + 10 + "," + -7 + ")"; })
          .attr("dy", 0)
          .text((d, i) => { 
            return natl_avg_text})
          .attr("font-size", 12)
          .attr("opacity", 0)
          .transition()
          .duration(1050)
          .ease(d3.easeElastic)
          .delay(function (d, i) { 
            return i*40 + 1000; })
          .attr("opacity", function(d, i) {
            if (i < 1) {
              return 1
            } else {
              return 0
            }
          })
          .attr("text-anchor", "beginning")
          .attr("transform", function(d, i) { return "translate(" + (x(nationalAverage[datafile[0].sector][i]) - 105) + "," + -4 + ")"; });
        }
   setTimeout(function() {
    group.on("mouseover", function(d, i) {
        d3.select(".ft").selectAll(".triangle-label,.triangle")
          .transition()
          .duration(250)
          .attr("opacity", 0)
        d3.select(this).selectAll(".triangle-label,.triangle")
          .transition()
          .delay(60)
          .duration(250)
          .attr("opacity", 1)
      })
        .on("mouseout", function(d, i) {
          d3.select(".ft").selectAll(".triangle-label,.triangle")
            .transition()
            .duration(250)
            .delay(60)
            .attr("opacity", 1)
          d3.select(this).selectAll(".triangle-label,.triangle")
            .transition()
            .duration(250)
            .attr("opacity", 0)
        })
      }, 1500)
 } // end rundata

 export default {findData, runData}