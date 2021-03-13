// SVG Dimensions
var svgWidth = 1000;
var svgHeight = 600;

// Margins
const margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
const svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(stateData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    stateData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    // Step 2: Create scale functions
    // ==============================
    let xLinearScale = d3.scaleLinear()
        .domain([(d3.min(stateData, d => d.poverty) - 1), d3.max(stateData, d => d.poverty)])
        .range([0, width]);

    let yLinearScale = d3.scaleLinear()
        .domain([(d3.min(stateData, d => d.healthcare) - 1), d3.max(stateData, d => d.healthcare)])
        .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    let circlesGroup = chartGroup.selectAll("g circle")
        .data(stateData)
        .enter()
        .append("g");

    circlesGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "12")
        .attr("fill", "lightblue")
        .attr("stroke-width", "1")
        .attr("stroke", "black");

    circlesGroup.selectAll("text")
        .data(stateData)
        .enter()
        .append("text")
        .style("font", "9 px comic-sans")
        .attr("text-anchor", "middle")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare) + 4);



    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>Poverty %: ${d.poverty}<br>Healthcare %: ${d.healthcare}`);
        });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
            toolTip.show(data, this);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    // Create axes labels and title elements
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .style("font-size", "20px")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top * 0.75})`)
        .attr("class", "axisText")
        .style("font-size", "20px")
        .text("In Poverty (%)");


    chartGroup.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 1.5))
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .text("Poverty Rate vs. Lack of Healthcare %");

}).catch(function(error) {
    console.log(error);
});
