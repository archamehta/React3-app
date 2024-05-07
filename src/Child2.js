import React, { Component} from "react";
import * as d3 from 'd3';
import "./App.css"

class Child2 extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
    }

    componentDidMount() {
      console.log("componentDidMount (data is): ", this.props.data2);
        this.updateChart();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data2 !== this.props.data2) {
            this.updateChart();
        }
    }


    updateChart() {
        const { data2 } = this.props;
        const margin = { top: 10, right: 10, bottom: 40, left: 20 };
        const width = 500 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3.select(".child2_svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        svg.selectAll("*").remove(); 

        const container = svg.selectAll(".g_2") 
            .data([null]) 
            .join("g") 
            .attr("class", "g_2")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        
        container.selectAll(".x-axis-label") 
            .data([null]) 
            .join("text") 
            .attr("class", "x-axis-label")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
            .style("text-anchor", "middle")
            .text("X");

        
        container.selectAll(".y-axis-label") 
            .data([null]) 
            .join("text") 
            .attr("class", "y-axis-label")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Y");

        //Add x-axis
        const x_data = data2.map(item => item.x);
        const x_scale = d3.scaleLinear().domain([0, d3.max(x_data)]).range([margin.left, width]);
        container.selectAll(".x_axis_g")
            .data([null])
            .join("g")
            .attr("class", "x_axis_g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x_scale));

        //add y-axis
        const y_data = data2.map(item => item.y);
        const y_scale = d3.scaleLinear().domain([0, d3.max(y_data)]).range([height, 0]);
        container.selectAll(".y_axis_g")
            .data([null])
            .join("g")
            .attr("class", "y_axis_g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y_scale));

        
        container.selectAll(".data-circle") 
            .data(data2) 
            .join("circle") 
            .attr("class", "data-circle")
            .attr("cx", d => x_scale(d.x))
            .attr("cy", d => y_scale(d.y))
            .attr("r", 3)
            .style("fill", "#69b3a2")
            .on("mouseover", this.showTooltip)
            .on("mouseout", this.hideTooltip);
    }
   
    showTooltip(event, d) {
        const tooltip = d3.select(".tooltip");
        const tooltipWidth = 2000; 
        const tooltipHeight = 50; 
        const xOffset = 20; 
        const yOffset = 100; 

        
        let tooltipX = event.pageX + xOffset;
        let tooltipY = event.pageY - yOffset;

        
        const svgWidth = 10000; 
        const svgHeight = 300; 
        if (tooltipX + tooltipWidth > svgWidth) {
            tooltipX = event.pageX - tooltipWidth - xOffset;
        }
        if (tooltipY + tooltipHeight > svgHeight) {
            tooltipY = event.pageY - tooltipHeight - yOffset;
        }

        
        tooltip.style("display", "block")
            .style("left", tooltipX + "px")
            .style("top", tooltipY + "px")
            .style("font-size", "10px") 
            .html(`x is: ${d.x}<br>Y is: ${d.y}`);
    }


    hideTooltip() {
        d3.select(".tooltip").style("display", "none");
    }
    
    render() {
        return (
            <div>
                <svg className="child2_svg">
                    <g className="g_1"></g>
                </svg>
                <div className="tooltip"></div>
            </div>
        );
    }
}

export default Child2;
