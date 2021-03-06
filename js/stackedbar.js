function makeChart(dataset) {
  let w = 700;
  let h = 350;
	
  let marginT = 0;
  let marginL = 40;
  let marginR = 40;
  let marginB = 70;

  let tooltip = d3.select("body").append("div").attr('id', 'tooltip').style("opacity", 0);

  //bar width = (width of chart - margins ) / length of dataset  - padding
  let barwidth = (w - (marginL + marginR)) / (dataset.length) - 15;

  let chart = d3.select('#stackedbar')
    .attr('width', w)
    .attr('height', h);

  let xScale = d3.scaleBand()
    .domain(dataset.map(d => d.country))
    .range([marginL, w - marginR]);

  let yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d.public+d.private)+2])
    .range([h - marginB, marginT]);

  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale);
  yAxis.ticks(5).tickFormat(d => d + "%");

  let stack = d3.stack()
    .keys(['public', 'private'])
    .order(d3.stackOrderAscending);

  let stackedData = stack(dataset);

  //text veriable to hold concated strings
  let text = '';

  //draw the stacked group
  let groups = chart.selectAll('g')
    .data(stackedData)
    .enter()
    .append('g')
    .style('fill', function (d, i) {
      if (i % 2 == 0) {
        return '#92f0f9';
      } else {
        return '#92BCF9';
      }
    })
    .on('mousemove', function (d) {
      //get key
      text = d.key + ": ";
    })

  groups.selectAll('rect')
    .data(d => d)
    .enter()
    .append('rect')
    .attr('x', d => xScale(d.data.country))
    .attr('y', d => yScale(d[1]))
    .attr('width', barwidth)
    .attr('height', d => yScale(d[0]) - yScale(d[1]))
    .attr('transform', `translate(38, 0)`)
    .on('mousemove', function (d) {

      d3.select(this)
        .transition("fill")
        .duration(250)
        .style('cursor', 'pointer');

      //concat key with value
      text += parseFloat((d[1]-d[0]) - d[0]).toPrecision(2);

      tooltip
        .style('left', (d3.event.pageX) - 50 + "px")
        .style('top', (d3.event.pageY) - 40 + "px")
        .text(text + "%")
        .transition("tooltip")
        .duration(200)
        .style("opacity", .8);
    })
    .on('mouseout', function (d) {
      d3.select(this)
        .transition("fill")
        .duration(250);

      tooltip
        .transition("tooltip")
        .duration(500)
        .style("opacity", 0);
    });

  //AXES
  chart.append('g')
    .attr('transform', `translate(30, ${h-marginB})`)
    .attr('color', '#737373')
    .call(xAxis)
    .selectAll('text')
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start");

  chart.append('g')
    .attr('transform', `translate(70, 0)`)
    .attr('color', '#737373')
    .call(yAxis);

  //LABELS

  //x-axis
  chart.append("text")
    .attr("class", "labels")
    .attr("x", w / 2)
    .attr("y", h - 10)
    .style("text-anchor", "middle")
    .text("Countries");

  //y-axis
  chart.append('text')
    .attr('class', 'labels')
    .attr("transform", "rotate(-90)")
    .attr("x", -(h - marginB) / 2)
    .attr("y", 30)
    .style("text-anchor", "middle")
    .text("Percentage Spent");
}


window.onload = function () {
  d3.json('../datasets/health.json')
    .then((json) => {
      makeChart(json);
    });

  chartlink();
}