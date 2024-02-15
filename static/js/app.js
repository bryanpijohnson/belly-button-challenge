const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

function init() {
  d3.json(url).then(function(data){
    let names = data.names;

    let dropdown = d3.select("#selDataset")
    names.forEach(name => {
      dropdown.append("option").text(name).property("value", name);
    });
    demographics(names[0]);
    barChart(names[0]);
    gaugeChart(names[0]);
    bubbleChart(names[0]);
  });
};

function demographics(ids) {
  let demoBox = d3.select("#sample-metadata");
  d3.json(url).then(function(data){
    function findIdData(person) {
      return person.id == ids;
    }
    let meta = data.metadata.filter(findIdData)[0];
    //console.log(meta);
    let text = `id: ${meta.id}\n
      ethnicity: ${meta.ethnicity}\n
      gender: ${meta.gender}\n
      age: ${meta.age}\n
      location: ${meta.location}\n
      bbtype: ${meta.bbtype}\n
      wfreq: ${meta.wfreq}`
    d3.select("#sample-metadata").text(text);
    return meta;
  })
}

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

function gaugeChart(ids) {

};

function bubbleChart(ids) {
  d3.json(url).then(function(data){
    function findIdData(person) {
      return person.id == ids;
    };
    let samples = data.samples.filter(findIdData)[0];
    console.log(samples);

    var trace1 = {
      x: samples.otu_ids,
      y: samples.sample_values,
      text: samples.otu_labels,
      mode: "markers",
      marker: {
        size: samples.sample_values,
        color: samples.otu_ids
      }
    }

    var data1 = [trace1];

    var layout = {
      xaxis: {title: "OTU ID"},
      showlegend: false,
      height: 600
    };

    Plotly.newPlot("bubble", data1, layout);
  })
};


function optionChanged() {
  let id = d3.select("#selDataset").property("value");
  demographics(id);
  barChart(id);
  gaugeChart(id);
  bubbleChart(id);
  //return id;
}

init();