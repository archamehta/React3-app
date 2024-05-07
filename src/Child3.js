import React, { Component } from "react";
import * as d3 from 'd3';
import "./App.css"

class Child1 extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
    }

    componentDidMount() {
        this.updateChart();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data1 !== this.props.data1) {
            this.updateChart();
        }
    }


    updateChart() {
        const { data1 } = this.props;
        const margin = { top: 10, right: 10, bottom: 40, left: 20 };
        const width = 500 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3.select(".child1_svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        svg.selectAll("*").remove(); // Clear previous contents

        const container = svg.selectAll(".g_1") // Changed append to selectAll
            .data([null]) // Bind data
            .join("g") // Join
            .attr("class", "g_1")
            .attr("transform", `translate(${margin.left},${margin.top})`); // Transform

        // Add x-axis label
        container.selectAll(".x-axis-label") // Changed append to selectAll
            .data([null]) // Bind data
            .join("text") // Join
            .attr("class", "x-axis-label")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
            .style("text-anchor", "middle")
            .text("Total Bill");

        // Add y-axis label
        container.selectAll(".y-axis-label") // Changed append to selectAll
            .data([null]) // Bind data
            .join("text") // Join
            .attr("class", "y-axis-label")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Tips");

        //Add x-axis
        const x_data = data1.map(item => item.total_bill);
        const x_scale = d3.scaleLinear().domain([0, d3.max(x_data)]).range([margin.left, width]);
        container.selectAll(".x_axis_g")
            .data([null])
            .join("g")
            .attr("class", "x_axis_g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x_scale));

        //add y-axis
        const y_data = data1.map(item => item.tip);
        const y_scale = d3.scaleLinear().domain([0, d3.max(y_data)]).range([height, 0]);
        container.selectAll(".y_axis_g")
            .data([null])
            .join("g")
            .attr("class", "y_axis_g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y_scale));

        // Add circles representing data points
        container.selectAll(".data-circle") // Select existing circles
            .data(data1) // Bind data
            .join("circle") // Join
            .attr("class", "data-circle")
            .attr("cx", d => x_scale(d.total_bill))
            .attr("cy", d => y_scale(d.tip))
            .attr("r", 3)
            .style("fill", "#69b3a2")
            .on("mouseover", this.showTooltip)
            .on("mouseout", this.hideTooltip);
    }

    showTooltip(event, d) {
        const tooltip = d3.select(".tooltip");
        const tooltipWidth = 2000; // Adjust the width of the tooltip as needed
        const tooltipHeight = 50; // Adjust the height of the tooltip as needed
        const xOffset = 20; // Offset from the mouse pointer
        const yOffset = 100; // Offset from the data point

        // Calculate the position of the tooltip
        let tooltipX = event.pageX + xOffset;
        let tooltipY = event.pageY - yOffset;

        // Adjust tooltip position to keep it within the bounds of the SVG
        const svgWidth = 10000; // Adjust according to your SVG width
        const svgHeight = 300; // Adjust according to your SVG height
        if (tooltipX + tooltipWidth > svgWidth) {
            tooltipX = event.pageX - tooltipWidth - xOffset;
        }
        if (tooltipY + tooltipHeight > svgHeight) {
            tooltipY = event.pageY - tooltipHeight - yOffset;
        }

        // Update the tooltip content and position
        tooltip.style("display", "block")
            .style("left", tooltipX + "px")
            .style("top", tooltipY + "px")
            .style("font-size", "10px") // Adjust font size as needed
            .html(`Total Bill: ${d.total_bill.toFixed(2)}<br>Tips: ${d.tip.toFixed(2)}`);
    }


    hideTooltip() {
        d3.select(".tooltip").style("display", "none");
    }

    render() {
        return (
            <div>
                <svg className="child1_svg">
                    <g className="g_1"></g>
                </svg>
                <div className="tooltip"></div>
            </div>
        );
    }
}

export default Child1;
