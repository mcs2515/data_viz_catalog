function makeChart(dataset) {
	let w = 700;
	let h = 350;
	let marginT = 20;
	let marginL = 40;
	let marginR = 50;
	let marginB = 50;

	let tooltip = d3.select("body").append("div").attr('id', 'tooltip').style("opacity", 0);

	let parseDate = d3.timeParse("%Y-%m");

	let chart = d3.select('#areachart')
		.attr('width', w)
		.attr('height', h);

	let xScale = d3.scaleTime()
		.domain(d3.extent(dataset, d => parseDate(d.date)))
		.range([marginL, w - marginR]);

	let yScale = d3.scaleLinear()
		.domain([0, d3.max(dataset, d => d.drinks_sold)])
		.range([h - marginB, marginT]);

	let xAxis = d3.axisBottom(xScale);
	let yAxis = d3.axisLeft(yScale);
	xAxis.tickFormat(d3.timeFormat("%b"));
	yAxis.tickFormat(d => (d / 1000) + "k");

	let area = d3.area()
		.x(d => xScale(parseDate(d.date)))
		.y0(d => yScale(d.drinks_sold))
		.y1(yScale.range()[0]); //difference between line and area graph

	//optional
	//create line function
	let line = d3.line()
		.x(d => xScale(parseDate(d.date)))
		.y(d => yScale(d.drinks_sold));


	//draw area
	chart.selectAll('.area')
		.data(dataset)
		.enter()
		.append('path')
		.style('fill', '#92f0f9')
		.style('opacity', .08)
		.attr('transform', `translate(30, 0)`)
		.attr('d', d => area(dataset));

	//optional draw line
	chart.selectAll(".line")
		.data(dataset)
		.enter()
		.append('path')
		.attr('class', 'line')
		.style('stroke', '#8adae2')
		.style('opacity', .08)
		.attr("stroke-width", 5)
		.style('fill', 'none')
		.attr('transform', `translate(30, 0)`)
		.attr("stroke-linejoin", "round")
		.attr('d', d => line(dataset));

	//optional
	chart.selectAll(".circle")
		.data(dataset)
		.enter()
		.append('circle')
		.attr('class', 'circle')
		.attr('r', 8)
		.attr('cx', d => xScale(parseDate(d.date)))
		.attr('cy', d => yScale(d.drinks_sold))
		.attr('transform', `translate(30, 0)`)
		.style('opacity', 0)
		.on('mousemove', function (d) {

			d3.select(this)
				.transition("fill")
				.duration(250)
				.style('fill', '#f99b92')
				.style('opacity', 1)
				.style('cursor', 'pointer');

			tooltip
				.style('left', (d3.event.pageX) - 50 + "px")
				.style('top', (d3.event.pageY) - 60 + "px")
				.text(d.drinks_sold.toLocaleString() + " drinks")
				.transition("tooltip")
				.duration(200)
				.style("opacity", .8);
		})
		.on('mouseout', function (d) {
			d3.select(this)
				.transition("fill")
				.duration(250)
				.style('opacity', 0)
				.style('stroke', "none");

			tooltip
				.transition("tooltip")
				.duration(500)
				.style("opacity", 0);
		});


	//AXES
	chart.append('g')
		.attr('transform', `translate(30, ${h-marginB})`)
		.attr('color', '#737373')
		.call(xAxis);

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
		.text("Months");

	//y-axis
	chart.append('text')
		.attr('class', 'labels')
		.attr("transform", "rotate(-90)")
		.attr("x", -(h - marginB) / 2)
		.attr("y", 30)
		.style("text-anchor", "middle")
		.text("Coffees Sold");
}


window.onload = function () {
	d3.json('../datasets/brewed_coffee.json')
		.then((json) => {
			dataset = json;
			makeChart(dataset);
		});
	chartlink();
}