let width = 800;
let height = 600;
let padding = 40;
let barWidth = width/310;

let svgBarChart= d3.select('.chart')
                   .append('svg')
                   .attr('width',width)
                   .attr('height',height)
let tooltip = d3.select('.chart')
                .append('div')
                .attr('id','tooltip')
                .style('opacity',0)
let overLayout = d3.select('.chart')
               .append('div')
               .attr('id','overLayout')
               .style('opacity',0)
fetch( 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
.then(response=> response.json())
.then(data => {
  let years = data.data.map(d=>{
    let quarter;
    let temp = d[0].substring(5,7);
    if(temp === '01'){
      quarter = 'Q1';
    } else if(temp === '04'){
      quarter = 'Q2';
    } else if(temp === '07'){
      quarter = 'Q3';
    } else if(temp === '10'){
      quarter = 'Q4';
    }
    return d[0].substring(0,4)+ ' ' + quarter;
  })
  svgBarChart.append('text')
             .attr('transform', 'rotate(-90)')
             .attr('x', -300)
             .attr('y', 90)
             .text('Gross Domestic Product');
  svgBarChart.append('text')
             .attr('x', 400)
             .attr('y', 599)
              .text('Year');
  let yearData = data.data.map(d => new Date(d[0]));
  let yearMax = new Date(d3.max(yearData));
    yearMax.setMonth(yearMax.getMonth() + 3);
  let xLinearScale = d3.scaleLinear()
                    .domain([0, data.data.length-1])
                    .range([padding, width-padding])
  let xAxisScale = d3.scaleTime()
      .domain([d3.min(yearData), yearMax])
      .range([padding, width - padding]);
  let GDP = data.data.map(d=> d[1]);
  let gdpMax = d3.max(GDP);
  let linearScale = d3.scaleLinear().domain([0, gdpMax]).range([0, height-(2 * padding)]);
  let  yAxisScale = d3.scaleLinear().domain([0, gdpMax]).range([height-(2 * padding), 0]);
  let xAxis = d3.axisBottom().scale(xAxisScale);
  let yAxis = d3.axisLeft(yAxisScale);
  svgBarChart.append('g')
             .call(xAxis)
             .attr('id', 'x-axis')
             .attr('transform', 'translate(0, '+ (height - padding) + ')');
  svgBarChart.append('g')
             .call(yAxis)
             .attr('id', 'y-axis')
             .attr('transform', 'translate(' + padding + ', ' + padding + ')');
  svgBarChart.selectAll('rect')
             .data(data.data)
             .enter()
             .append('rect')
             .attr('data-date', function (d, i)                   {return data.data[i][0];})
             .attr('data-gdp', function (d, i)                   {return data.data[i][1];})
             .attr('class', 'bar')
             .attr('x', function (d, i) {
                  return xLinearScale([i]) - padding - 20;})
             .attr('y', function (d) {
                   return (height - padding)    - linearScale(d[1]);})
             .attr('width', (width -                             (2*padding)) / data.data.length)
             .attr('height', function (d) {
                  return linearScale(d[1]);})
             .attr('index', (d, i) => i)
                  .style('fill', (d,i) => i % 2                   === 0 ?'#2596be' : '#Be6a25')
             .attr('transform', 'translate(60,                                    0)')
            .on('mouseover', function (event,                       d) {
           let i = this.getAttribute('index');
  overLayout.transition()
            .duration(0)
            .style('height', linearScale(d[1]) + 'px')
          .style('width', (width -                             (2*padding)) / data.data.length + 'px')
          .style('opacity', 0.9)
          .style('left', i * ((width -                             (2*padding)) / data.data.length) + 'px')
          .style('top', height + (2*padding + 34) - linearScale(d[1]) + 'px')
          .style('transform', 'translateX(43px)');
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(
            years[i] +
              '<br>' +
              '$' +
              GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') +
              ' Billion'
          )
          .attr('data-date', data.data[i][0])
          .style('left', i * barWidth - 20  + 'px')
          .style('top',height - 100 + 'px')
          .style('transform', 'translateX(60px)');
      })
      .on('mouseout', function () {
        tooltip.transition().duration(200).style('opacity', 0);
        overLayout.transition().duration(200).style('opacity', 0);
      });
  
}).catch(e => console.log(e));
                