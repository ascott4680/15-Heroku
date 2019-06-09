function buildMetadata(sample) {

    d3.json(`/metadata/${sample}`).then((Smedata) => {
      console.log(Smedata);
     
      var PANEL = d3.select("#sample-metadata")
      PANEL.html("");
    var setdata = Object.entries(Smedata);
    setdata.forEach((metdata) => {
         PANEL.append("h6").text(`${metdata[0]}: ${metdata[1]}`);
    });
   
    console.log("Meta Working..")
   
   });
}

function buildCharts(sample) {
  d3.json(`/samples/${sample}`).then((Piedata) =>
  {
    // console.log("Piedata")
    // console.log(Piedata.otu_ids);
    // console.log(Piedata.otu_labels);
    // console.log(Piedata.sample_values);

    const otu_ids = Piedata.otu_ids;
    const otu_labels = Piedata.otu_labels;
    const sample_values = Piedata.sample_values;

        var layout = {
          title: "Belly Button Bacteria",
        };
        var data = [{
         values: sample_values.slice(0,10),
         labels : otu_ids.slice(0,10),
         hovertext: otu_labels.slice(0, 10),
         hoverinfo: 'hovertext',
         type: 'pie'
     }]; 

        Plotly.newPlot("pie", data, layout);
    
  });

     d3.json(`/samples/${sample}`).then((Bbldata) =>{
     const otu_ids = Bbldata.otu_ids;
     const otu_labels = Bbldata.otu_labels;
     const sample_values = Bbldata.sample_values;

// plot
    var bubbleLayout = {
      xaxis:{ title: "OTU_ID" }
    };

    var Bdata = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          hovermode: 'closest',
          colorscale: "Electric",
          type: "scatter"
          

        }
  
      }];

      Plotly.newPlot("bubble", Bdata, bubbleLayout);

    });
  }


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);

}

// Initialize the dashboard
init();
