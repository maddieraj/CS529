loadVis = async () => {

    let usData = await d3.json("https://unpkg.com/us-atlas@3/counties-10m.json");
    let GunDeaths = await d3.csv("freq.csv");
  
    let svg = d3.select("#map");
    let projection = d3.geoAlbersUsa();
    let path = d3.geoPath(projection);
    let state = topojson.feature(usData, usData.objects.states);
  
  
    let shootingBarTip = d3
          .tip()
          .html(function (d) {
              return `
              <div class = 'd3-tip' style='background:Gainsboro;font-size: small'><span style='color:black; margin-top: 5px; margin-left: 5px; margin-right: 5px'><strong>City:</strong> 
              ${d.city_state}</span><br/>
              <span style='color:black; margin-top: 5px; margin-left: 5px; margin-right: 5px'><strong>Male:</strong> 
                  ${d.males}
                  </span><br/>
                  <span style='color:black; margin-top: 5px; margin-left: 5px; margin-right: 5px'><strong>Female:</strong> 
                  ${d.females}
                  </span></div>
                  `
          })
  
  
    let GunDeathsPoints = svg.append("g");
    GunDeathsPoints
      .selectAll("circle")
      .data(GunDeaths)
      .join("circle")
      .attr("cx", (d) => {
          return projection([d.lng, d.lat])[0];
      })
      .attr("cy", (d) => {
          return projection([d.lng, d.lat])[1];
      })
      .attr("r", (d) => 2)
      .attr("fill", "#de2d26" )
      //.attr('transform','translate(' + panX + ',' + panY +')')
    .on('mouseover', shootingBarTip.show)
    .on('mouseout', shootingBarTip.hide);
  
    let stateColored = svg.append("g");
  
  
    stateColored
      .selectAll("path")
      .data(state.features)
      .join("path")
      .attr("d", (f) => path(f))
      .attr("stroke", "grey")
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("id", (d) => `state${d.id}`);
  
      let zoomScale = 1, panX = 0, panY = 0;
  
      var zoom = d3
          .zoom()
          .scaleExtent([1, 8])
          .on('zoom', function () {
              zoomScale = d3.event.transform.k,
              panX = d3.event.transform.x,
              panY = d3.event.transform.y 
  
              //d3.zoomIdentity.scale(zoomScale)
              stateColored.attr('transform', d3.event.transform)
              //GunDeathsPoints.selectAll("circle").attr('transform', translate(d3.event.transform.x,panY = d3.event.transform.y ), scale(zoomScale))
              GunDeathsPoints.selectAll("circle")
              .attr('transform',d3.event.transform)
  
          })
  
  
          // (d) =>
          // `translate(${projection([d.lng, d.lat])[0]+5}, ${
          //     projection([d.lng, d.lat])[1]
          // })`
  
  
    svg.call(zoom)
    svg.call(shootingBarTip)
      
  };
  
  window.onload = () => {
    loadVis();
  };