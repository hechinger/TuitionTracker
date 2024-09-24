import $ from 'jquery';
import * as d3 from 'd3';
import tooltip from './tooltip';

let indexPrice;

var language = 'english'
var loc = window.location.pathname
if (loc.includes('en-espanol')) {
  language = 'espanol'
}
var upper_net_price_text = "upper net price estimation"
var projected_net_price_text = "projected net price"
var lower_net_price_text = "lower net price estimation"
if (language == 'espanol') {
  upper_net_price_text = "ESTIMACIÓN DEL PRECIO NETO MAYOR"
  projected_net_price_text = "ESTIMACIÓN DEL PRECIO NETO"
  lower_net_price_text = "ESTIMACIÓN DEL PRECIO NETO MENOR"
}
export function findData(price, selectedNetPrice){

  indexPrice = selectedNetPrice
  // Determine which variable to port in from the school's JSON file
  let chartablePrice = price.yearly_data.slice(0, 11).reverse();

  let schoolString;
  let schoolPrice;
  let campusLiving;
  let schoolPrices

  // const { schoolNyetPriceA, schoolNyetPriceB, schoolNyetPriceC, schoolNyetPriceD, schoolNyetPriceE } = schoolPrices;

    schoolString = "public"


  if (selectedNetPrice === 1){
    schoolPrice = "0_30000"
  } else if (selectedNetPrice === 2){
    schoolPrice = "30001_48000"
  } else if (selectedNetPrice === 3){
    schoolPrice = "48001_75000"
  } else if (selectedNetPrice === 4){
    schoolPrice = "75001_110000"
  } else {
    schoolPrice = "110001"
  }

  const priceData = chartablePrice.map(year => {
      // Determine most complete trend between on- and off-campus
      let stickerPriceType = 'price_instate_oncampus';
      let campusFlag = 'campus';
      let onCampusCount = 0;
      let offCampusCount = 0;
      for (let priceYear in chartablePrice) {
        if (chartablePrice[priceYear].price_instate_oncampus > 1) {
          onCampusCount += 1;
        }
        if (chartablePrice[priceYear].price_instate_offcampus_nofamily > 1) {
          offCampusCount += 1;
        }
      }

      if (offCampusCount > onCampusCount + 1) {
        stickerPriceType = 'price_instate_offcampus_nofamily'
        campusFlag = 'offcampus'
      } 

      const thisYear = {
        'timescale': year.year,
        'stickerPrice': year[`${stickerPriceType}`],
        'stickerPriceType': stickerPriceType,
        'nyetPriceA': year[`avg_net_price_0_30000_titleiv_privateforprofit`],
        'nyetPriceB': year[`avg_net_price_30001_48000_titleiv_privateforprofit`],
        'nyetPriceC': year[`avg_net_price_48001_75000_titleiv_privateforprofit`],
        'nyetPriceD': year[`avg_net_price_75001_110000_titleiv_privateforprofit`],
        'nyetPriceE': year[`avg_net_price_110001_titleiv_privateforprofit`],
        'netPrice': year[`avg_net_price_${schoolPrice}_titleiv_privateforprofit`],
        'rangeA': year[`min_max_diff_0_30000_titleiv_privateforprofit_${campusFlag}`],
        'rangeB': year[`min_max_diff_30001_48000_titleiv_privateforprofit_${campusFlag}`],
        'rangeC': year[`min_max_diff_48001_75000_titleiv_privateforprofit_${campusFlag}`],
        'rangeD': year[`min_max_diff_75001_110000_titleiv_privateforprofit_${campusFlag}`],
        'rangeE': year[`min_max_diff_110001_titleiv_privateforprofit_${campusFlag}`]
      }
      return thisYear;
  });
  return priceData;
}


function isitChartable(data){
  for (let d of data){
    if ((d.stickerPriceOnCampus || d.stickerPriceOffCampus) && d.netPrice){
        return true;
      };
  }
}

function isFreezeOrReset(data){

  let freeze = false
  let reset = false
  for(var i = 1; i < data.length; i++){
    if (data[i].stickerPrice == data[i-1].stickerPrice) {
      freeze = true
    }
     if (data[i].stickerPrice <= data[i-1].stickerPrice * .9) {
      reset = true
    }
  }
  if (reset == true) {
    return "reset"
  } else if (freeze == true ) {
    return "freeze"
  } else {
    return ""
  }
  
}

export function runData(datafile) {
  const chartable = isitChartable(datafile);
  const freezeOrReset = isFreezeOrReset(datafile);
  if (!chartable) {
    $('#sticker-price-container').hide();
  }

  if (freezeOrReset == "freeze") {
    $('.freeze').addClass("displayed")
  } else if (freezeOrReset == "reset") {
    $('.reset').addClass("displayed");
  } 

 // responsiveness
 let window_width = $(window).width();
 let fullWidth;
 let fullHeight;

 if (window_width >= 650){
   fullWidth = 600;
   fullHeight = 470;
 } else if (window_width <= 350) {
   fullWidth = 200;
   fullHeight = 360;
 } else {
   fullWidth = window_width - 180;
   fullHeight = fullWidth - 50;
 }

 const commas = d3.format(',');

 // set the dimensions and margins of the graph
 const margin = { top: 20, right: 20, bottom: 100, left: 50 };
 const svg = d3.select('#sticker-price-chart');
 const width = fullWidth - margin.left - margin.right;
 const height = $('#sticker-price-chart').height() - margin.top - margin.bottom;

  // set the ranges
 const x = d3.scaleBand().rangeRound([0, width]).padding(1),
     y = d3.scaleLinear().rangeRound([height, 0]),
     z = d3.scaleOrdinal(['#036888','#D2392A','#D2392A','#D2392A']);

 const nx = d3.scaleBand().rangeRound([0, width]).padding(1),
     ny = d3.scaleLinear().rangeRound([height, 0]);

 var svgDefs = svg.append('defs');

 var mainGradient = svgDefs.append('linearGradient')
    .attr('id', 'mainGradient');

// Create the stops of the main gradient. Each stop will be assigned
// a class to style the stop using CSS.
 mainGradient.append('stop')
    .attr('class', 'stop-left')
    .attr('offset', '.95');

 mainGradient.append('stop')
    .attr('class', 'stop-right')
    .attr('offset', '1');

 const g = svg.append("g")
   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 // define the line
 const line = d3.line()
   .x(function(d) { return x(d.timescale); })
   .y(function(d) { return y(d.total); });
 
 const area = d3.area()
   .x(function(d) { 
      if (d.timescale == "24-25") {
        return x(d.timescale) + 18; 
      } else {
        return x(d.timescale); 
      }
    })
   .y1(function(d) { 
    if (d.timescale == "16-17" || d.timescale == "13-14" || d.timescale == "15-16" || d.timescale == "14-15" || d.timescale == "18-19" || d.timescale == "17-18" || d.timescale == "19-20" || d.timescale == "20-21" || d.timescale == "21-22") {
      return y(d.total)
    } else { 
      if (Array.isArray(d.range) && d.range[1] !== undefined) {
         return y(d3.min([(d.range[1] * +d.sticker),d.sticker ]))
       } else {
        return y(d.total)
       }
     }
    })
   .y0(function(d) { 
    if (d.timescale == "16-17" || d.timescale == "13-14" || d.timescale == "15-16" || d.timescale == "14-15" || d.timescale == "18-19" || d.timescale == "17-18" || d.timescale == "19-20" || d.timescale == "20-21" || d.timescale == "21-22") {
      return y(d.total)
    } else { 
         if (Array.isArray(d.range) && d.range[0] !== undefined) { 
         return y(d.range[0] * +d.sticker)
       } else {
        return y(d.total)
       }
     }
    })

 // scale the range of the priceData
 z.domain(d3.keys(datafile[0]).filter(function(key) {
   return key !== "timescale" && key[0] != "r";
 }));

 const trends = z.domain().map(function(name) {
   return {
     name: name,
     values: datafile.map(function(d) {
       return {
         timescale: d.timescale,
         total: +d[name],
         sticker:d["stickerPrice"],
         range: d[name.replace("nyetPrice","range")]
       };
     })
   };
 });


 nx.domain(datafile.map(d => d.timescale));

 ny.domain([0, d3.max(trends, function(c) {
                               return d3.max(c.values, function(v) {return v.total;});
                             }) + 500
          ]).nice();

  const newTrends = trends.map((rate) => {
    rate.values = rate.values.filter(item => !(isNaN(item.total)));
    return rate;
  });

  x.domain(newTrends[0].values.map(d => d.timescale));
  y.domain([0, d3.max(newTrends, function(c) {
    return d3.max(c.values, function(v) {
      return v.total * 1.1;
    });
  })]);

 // Draw the line
 const trend = g.selectAll(".trend")
   .data(newTrends)
   .enter()
   .append("g")
   .attr("class", "trend");

 trend.append("path")
   .attr("class", "line")
   .attr("d", (d) => {
     let keepValues = [];
     for(var i = 0; i < d.values.length; i++){
       if (d.values[i].total){
         keepValues.push(d.values[i]);
       }
     }
     return line(keepValues);
   })
   .style("stroke-dasharray", (d) => {
        if (d.name.includes('nyet')) {
          return 3;
        }
      })




 // Draw the empty value for every point
 const points = g.selectAll('.points')
   .data(trends)
   .enter()
   .append('g')
   .attr('class', (d)=>{
    if (d.name == 'netPrice' || d.name == 'stickerPrice') {
      return 'points'
    } 
   })
   .append('text');

 // Update the colors then draw the circle
 trend
   .style("fill", "#FFF")
   .style("stroke", function(d) { 
    if (d.name == "stickerPrice") {
      return '#036888';
    } else {
      return '#D2392A';
    }
  })
   .attr("class", (d) => {
    if (d.name.includes('nyet')) {
      return "deactivated";
    }
   })
   .selectAll("circle.line")
   .data(function(d){
     let keepValues = [];
     for(var i = 0; i < d.values.length; i++){
       if (isNaN(d.values[i].total) !== false || d.values[i].total !== 0){
         keepValues.push(d.values[i]);
       }
     }
     return keepValues;
   })
   .enter()
   .append("circle")
   .attr("r", 3)
   .attr("opacity", function() { 
      if ($(window).width() <= 360) {
        return 0;
      } else {
        return 1;
      } 
    })
   .style("stroke-width", 3)
   .attr("cx", function(d) { 
    return x(d.timescale); })
   .attr("cy", function(d) { return y(d.total); });

 trend.append("path")
   .attr("class", "area")
   .attr("d", (d) => {
     let keepValues = [];
     for(var i = 0; i < d.values.length; i++){
       if (d.values[i].total){
         keepValues.push(d.values[i]);
       }
     }
     return area(keepValues);
   })
  .attr("display", (d) => {
    const letters = ["A", "B", "C", "D", "E"]
    if (d.name !== "nyetPrice" + letters[indexPrice - 1]) {
      return "none";
    }
   })

console.log(newTrends,trends)
const dx = d3.scaleBand().rangeRound([0, width/2]).padding(1).domain(datafile.map(d => d.timescale));
const dy = d3.scaleLinear().range([100, 0]).domain([0,1])

const sampleData = [{
    "name": "stickerPrice",
    "values": [
        {
            "timescale": "19-20",
            "total": 22446,
            "sticker": 22446,
            "range": 22446
        },
        {
            "timescale": "20-21",
            "total": 23126,
            "sticker": 23126,
            "range": 23126
        },
        {
            "timescale": "21-22",
            "total": 23476,
            "sticker": 23476,
            "range": 23476
        },
        {
            "timescale": "22-23",
            "total": 23780.62,
            "sticker": 23780.62,
            "range": 23780.62
        },
        {
            "timescale": "23-24",
            "total": 24089.2,
            "sticker": 24089.2,
            "range": 24089.2
        }
    ]
}]
 const areaMini = d3.area()
   .x(function(d) { 
      if (d.timescale == "23-24") {
        return dx(d.timescale) + 8; 
      } else {
        return dx(d.timescale); 
      }
    })
   .y1(function(d) { 
    if (d.timescale == "19-20" || d.timescale == "20-21") {
      return dy(0.5)
    } else { 
      return dy(0.7)
     }
    })
   .y0(function(d) { 
    if (d.timescale == "19-20" || d.timescale == "20-21") {
      return dy(0.5)
    } else { 
      return dy(0.3)
     }
    })

 const lineMini = d3.line()
   .x(function(d) { 
    console.log(d)
    return dx(d.timescale); })
   .y(function(d) { return dy(0.5); });

 const gMini = svg.append("g")
   .attr("transform", "translate(" + (-margin.left*2.5) + "," + ((height) + margin.top*2) + ")");

 // Draw the line
 const trendMini = gMini.selectAll(".trendMini")
   .data(sampleData)
   .enter()
   .append("g")
   .attr("class", "trend");

 trendMini.append("path")
   .attr("class", "line")
   .attr("d", (d) => {
     let keepValues = [];
     for(var i = 0; i < d.values.length; i++){
       if (d.values[i].total){
         keepValues.push(d.values[i]);
       }
     }
     return lineMini(keepValues);
   })
   .style("stroke-dasharray", (d) => {
        if (d.name.includes('nyet')) {
          return 3;
        }
      })

 // Update the colors then draw the circle
 trendMini
   .style("fill", "#FFF")
   .style("stroke", function(d) { 
      return '#D2392A';
  })
   .attr("class", (d) => {
    if (d.name.includes('nyet')) {
      return "deactivated";
    }
   })
   .selectAll("circle.line")
   .data(function(d){
     let keepValues = [];
     for(var i = 0; i < d.values.length; i++){
       if (isNaN(d.values[i].total) !== false || d.values[i].total !== 0){
         keepValues.push(d.values[i]);
       }
     }
     return keepValues;
   })
   .enter()
   .append("circle")
   .attr("r", 3)
   .attr("opacity", function() { 
      if ($(window).width() <= 360) {
        return 0;
      } else {
        return 1;
      } 
    })
   .style("stroke-width", 3)
   .attr("cx", function(d) { 
    return dx(d.timescale); })
   .attr("cy", function(d) { return dy(0.5); });

 trendMini.append("path")
   .attr("class", "area")
   .attr("d", (d) => {
     let keepValues = [];
     for(var i = 0; i < d.values.length; i++){
       if (d.values[i].total){
         keepValues.push(d.values[i]);
       }
     }
     return areaMini(keepValues);
   })

 const pointsMini = gMini.selectAll('.text-sample')
   .data(["— " +upper_net_price_text,"—  "+projected_net_price_text,"— "+lower_net_price_text])
   .enter()
   .append('g')
   .attr('class', (d)=>{
    return 'text-sample'})

  pointsMini
      .append('text')
      .attr("x", dx('23-24') + 12)
      .attr("y", (d,i)=>{
        return (i * 19) + 34
      })
      .text(d=>d)
      .style("font-weight", (d,i)=>{
        if (i == 1) {
          return 700
        }
      })
      .style("opacity", 0.6)
      .style("text-transform", "uppercase")
      .attr("font-size", 10)
      

 // Draw the axis
 g.append("g")
   .attr("class", "axis axis-x")
   .attr("transform", "translate(0, " + height + ")")
   .call(d3.axisBottom(x));

 g.append("g")
   .attr("class", "axis axis-y")
   .call(d3.axisLeft(y)
           .ticks(5)
           .tickFormat(function(d){
             return `$${commas(d)}`
            })
         );
 // g.append("text")
 //  .classed("label-projected", true)
 //  .attr("y", height - 10)
 //  .attr("x", width - 5)
 //  .attr("text-anchor", "end")
 //  .text("Net Price Projected")

 const focus = g.append('g')
   .attr('class', 'focus')
   .style('display', 'none');

 focus.append('line')
   .attr('class', 'x-hover-line hover-line')
   .attr('y1' , 0)
   .attr('y2', height);

 svg.append('rect')
   .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
   .attr("class", "overlay")
   .attr("width", width)
   .attr("height", height)
   .on("mouseover", mouseover)
   .on("mouseout", mouseout)
   .on("mousemove", mousemove);

 const timeScales = datafile.map(function(name) { return x(name.timescale); });

 function mouseover() {
   focus.style("display", null);
   d3.selectAll('#sticker-price-chart .points text').style("display", null);
 }
 function mouseout() {
   focus.style("display", "none");
   d3.selectAll('#sticker-price-chart .points text').style("display", "none");
 }
 // TOOLTIP
 function mousemove() {
   tooltip('#sticker-price-chart', this, timeScales, datafile, x, y, z, focus);
 }

 } // end rundata

 export default {findData, runData}
