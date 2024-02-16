// This is the URL for the API call.
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// This is the initial stage of the page at the beginning, when it initially loads.
function init() {
  d3.json(url).then(function(data){
    let names = data.names;

    let dropdown = d3.select("#selDataset")
    names.forEach(name => {
      dropdown.append("option").text(name).property("value", name);
    });
    // These are the 4 functions that define the demographics table, bar chart, gauge chart, and bubble chart.
    // Since the initial setting is the 1st id value, those 4 are set to the same value when the page loads.
    demographics(names[0]);
    barChart(names[0]);
    gaugeChart(names[0]);
    bubbleChart(names[0]);
  });
};

// This function gets all of the meta data for the specific id that has been chosen in the dropdown menu.
function demographics(ids) {
  let demoBox = d3.select("#sample-metadata");
  d3.json(url).then(function(data){
    function findIdData(person) {
      return person.id == ids;
    }
    let meta = data.metadata.filter(findIdData)[0];
    let text = `id: ${meta.id} <br>
      ethnicity: ${meta.ethnicity} <br>
      gender: ${meta.gender} <br>
      age: ${meta.age} <br>
      location: ${meta.location} <br>
      bbtype: ${meta.bbtype} <br>
      wfreq: ${meta.wfreq}`
    d3.select("#sample-metadata").html(text);
    return meta;
  })
}

// This function gets the data for the bar chart in the samples dictionary. For each id number,
// the OTU id and sample_values arrays are paired and listed in decending order by sample_values.
// We find the top 10 values, which are the same as the first 10 values, and then graph them.
function barChart(ids) {
  d3.json(url).then(function(data){
    function findIdData(person) {
      return person.id == ids;
    }
    let samples = data.samples.filter(findIdData)[0];
    let values = samples.sample_values.slice(0,10).reverse();
    let otuIds = samples.otu_ids.slice(0,10).reverse();
    let labels = samples.otu_labels.slice(0,10).reverse();
    
    let trace1 = {
      x: values,
      y: otuIds.map(item => "OTU " + item),
      text: labels,
      type: "bar",
      orientation: "h"
    };

    let layout = {
      margin: {
        l: 100,
        r: 100,
        t: 0,
        b: 100
      }
    };

    let data1 = [trace1];

    Plotly.newPlot("bar", data1, layout);
  });
};

// This function creates the bubble chart at the bottom of the page. It takes in the samples data,
// and then maps the otu_id and sample_values as the point on the graph, with the sample_values as
// the size of the bubble in the chart.
function bubbleChart(ids) {
  d3.json(url).then(function(data){
    function findIdData(person) {
      return person.id == ids;
    };
    let samples = data.samples.filter(findIdData)[0];

    var trace1 = {
      x: samples.otu_ids,
      y: samples.sample_values,
      text: samples.otu_labels,
      mode: "markers",
      marker: {
        size: samples.sample_values,
        color: samples.otu_ids,
        colorscale: "Portland"
      }
    }

    var data1 = [trace1];

    var layout = {
      xaxis: {title: "OTU ID"},
      showlegend: false,
      margin: {
        l: 50,
        r: 0,
        t: 0,
        b: 100
      }
    };

    Plotly.newPlot("bubble", data1, layout);
  })
};

// This function creates the gauge chart on the page.
function gaugeChart(ids) {
  d3.json(url).then(function(data){
    function findIdData(person) {
      return person.id == ids;
    };
    let wash = data.metadata.filter(findIdData)[0].wfreq;
    
    var trace1 = {
      domain: {
        x: [0, 1],
        y: [0, 1]
      },
      value: wash, //DON'T WANT VALUE IN ORDER TO USE ARROW
      title: `<b>Belly Button Washing Frequency</b><br>Scrubs per Week<br> `,
      type: "indicator",
      mode: "gauge",
      gauge: {
        axis: {range: [0, 9]},
        steps: [ // R-G-B
          {range: [0,1], color: "rgb(247,243,239)"}, // 247-243-239
          {range: [1,2], color: "rgb(244,241,230)"}, // 244-241-230
          {range: [2,3], color: "rgb(233,231,204)"}, //233-231-204
          {range: [3,4], color: "rgb(230,232,182)"}, //230-232-182
          {range: [4,5], color: "rgb(216,229,162)"}, //216-229-162
          {range: [5,6], color: "rgb(187,204,150)"}, //187-204-150
          {range: [6,7], color: "rgb(150,191,139)"}, //150-191-139
          {range: [7,8], color: "rgb(147,186,145)"}, //147-186-145
          {range: [8,9], color: "rgb(142,179,140)"} //142-179-140
        ],
        labels: [
          "0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"
        ]
      }      
    };

    let data1 = [trace1];

    let washAngle = 180 - wash * 20; // (wash / 9 * 180)
    let r = 0.5
    let cos = r * Math.cos(Math.PI / 180 * washAngle);
    let sin = r * Math.sin(Math.PI / 180 * washAngle);

    
    let layout = {
      xaxis: {range: [0,1], showgrid: false, "zeroline": false, "visible": false},
      yaxis: {range: [0,1], showgrid: false, "zeroline": false, "visible": false},
      showlegend: false,
      annotations: [
        {
          ax: r,
          ay: 0.23,
          axref: "x",
          ayref: "y",
          x: cos+r,
          y: sin+0.23,
          xref: "x",
          yref: "y",
          showarrow: true,
          arrowcolor: "red",
          arrowwidth: 3
        }
      ]
    }

    Plotly.newPlot("gauge",data1, layout);

  }
  );
};

// This is the built-in function in the index.html file, and so updates all 4
// items on the page when the dropdown changes.
function optionChanged() {
  let id = d3.select("#selDataset").property("value");
  demographics(id);
  barChart(id);
  gaugeChart(id);
  bubbleChart(id);
}

init();