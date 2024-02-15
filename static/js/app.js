const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

function init() {
  d3.json(url).then(function(data){
    let names = data.names;

    let dropdown = d3.select("#selDataset")
    names.forEach(name => {
      dropdown.append("option").text(name).property("value", name);
    });
    demographics(names[0])
  });
};

function demographics(ids) {
  let demoBox = d3.select("#sample-metadata");
  d3.json(url).then(function(data){
    function findIdData(person) {
      return person.id == ids;
    }
    let meta = data.metadata.filter(findIdData)[0];
    console.log(meta);
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

};

function gaugeChart(ids) {

};

function bubbleChart(ids) {

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