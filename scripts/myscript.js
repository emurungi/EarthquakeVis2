d3.json("https://raw.githubusercontent.com/aa221/EDAV-EARTHQUAKES-PROJECT/main/earthquake_data.json").then(function(data) {
  const margin = { top: 30, right: 30, bottom: 50, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  // Append SVG
  const svg = d3
    .select('#plot')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  const states = [...new Set(data.map((d) => d.state))];
  const colorScale = d3.scaleSequential(d3.interpolateBlues);

  let selectedDecade = 1630;

  const numRows = 6;
  const numCols = 9;
  const rectWidth = width / numCols;
  const rectHeight = height / numRows;

  const rectangles = svg
    .selectAll('rect')
    .data(states)
    .enter()
    .append('rect')
    .attr('x', (d, i) => (i % numCols) * rectWidth)
    .attr('y', (d, i) => Math.floor(i / numCols) * rectHeight)
    .attr('width', rectWidth)
    .attr('height', rectHeight)
    .style('fill', (state) => {
      const average = data.find((d) => d.state === state && d.decade == selectedDecade)
        .average_earthquakes;
      return colorScale(average / d3.max(data, (d) => d.average_earthquakes));
    })
    .on('mouseover', function (event, state) {
      const average = data.find((d) => d.state === state && d.decade == selectedDecade)
        .average_earthquakes;
      d3.select(this).attr('stroke-width', 2);
      showTooltip(event.pageX, event.pageY, `${state}: ${average} earthquakes`);
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', 0);
      hideTooltip();
    });

  const textLabels = svg
    .selectAll('text')
    .data(states)
    .enter()
    .append('text')
    .attr('x', (d, i) => (i % numCols) * rectWidth + rectWidth / 2)
    .attr('y', (d, i) => Math.floor(i / numCols) * rectHeight + rectHeight / 2)
    .text((d) => d)
    .style('fill', 'black');

  const slider = d3.select('#decade-slider');
  const selectedDecadeText = d3.select('#selected-decade');

  slider.on('input', function () {
    selectedDecade = this.value;
    selectedDecadeText.text(selectedDecade);
    updateRectangles();
  });

  function updateRectangles() {
    rectangles.style('fill', (state) => {
      const average = data.find((d) => d.state === state && d.decade == selectedDecade)
        .average_earthquakes;
      return colorScale(average / d3.max(data, (d) => d.average_earthquakes));
    });
  }

  function showTooltip(x, y, content) {
    d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('left', x + 'px')
      .style('top', y + 'px')
      .style('background-color', 'white')
      .style('padding', '5px')
      .style('border', '1px solid #ddd')
      .text(content);
  }

  function hideTooltip() {
    d3.selectAll('.tooltip').remove();
  }
});
