var formatDateIntoYear = d3.time.format("%Y");
var formatDate = d3.time.format("%b %Y");
//var parseDate = d3.timeParse("%m/%y");

var startDate = new Date("2010-01-01"),
    endDate = new Date("2019-12-31");

var topic = ["政治", "社會", "影劇", "醫藥", "科技"]

var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    },
    width = 960 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

var svg = d3.select("#vis")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);


////////// plot //////////

var dataset;
var color = d3.scale.category10();

var pack = d3.layout.pack()
    .size([width, height])
    .padding(3)
    .radius(30);

var plot = svg.append("g")
    .attr("class", "plot")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("final_issue_2010_2019.json", function(data) {
    console.log("HELLO");
    dataset = data;
    drawPlot("2010/1", dataset["2010/1"]);
    playButton
        .on("click", function() {
            var button = d3.select(this);
            if (button.text() == "Pause") {
                moving = false;
                clearInterval(timer);
                // timer = 0;
                button.text("Play");
            } else {
                moving = true;
                timer = setInterval(step, 500);
                button.text("Pause");
            }
            console.log("Slider moving: " + moving);
        })
})

function step() {
    update(x.invert(currentValue));
    currentValue = currentValue + (targetValue / 151);
    if (currentValue > targetValue) {
        moving = false;
        currentValue = 0;
        clearInterval(timer);
        // timer = 0;
        playButton.text("Play");
        console.log("Slider moving: " + moving);
    }
}

function drawPlot(time, data) {
    console.log(time, Object.keys(data));
    //console.log(Object.keys(political)[0], Object.values(political)[0]);
    // 建立新的json格式
    var dataStructure = '{"year": "' + time + '", "children": [';
    for (var i = 0; i < topic.length; i++) {
        dataStructure += '{ "topic": "' + topic[i] + '", "children":[';
        var len = Object.keys(data[topic[i]]).length
        for (var j = 0; j < len; j++) {
            var words = JSON.stringify(Object.values(data[topic[i]])[j])
            var value = len - j;
            dataStructure += '{ "name":"' + Object.keys(data[topic[i]])[j] + '","value":' + value.toString() + ',"key":' + words + '}';
            if (j < Object.keys(data[topic[i]]).length - 1) dataStructure += ',';
        }
        dataStructure += ']}';
        if (i < topic.length - 1) dataStructure += ',';
    }
    dataStructure += ']}'
    dataStructure = JSON.parse(dataStructure)
    console.log(dataStructure);
    var political = dataStructure.children[0];
    var social = dataStructure.children[1];
    var entertainment = dataStructure.children[2];
    var medicine = dataStructure.children[3];
    var technique = dataStructure.children[4];

    var nodes = pack.nodes(dataStructure);

    var links = pack.links(nodes);

    nodes = nodes.filter(function(it) { return it.parent; });

    var circle = plot.selectAll("circle").data(nodes);
    var circleEnter = circle.enter();
    var circleExit = circle.exit();
    circle
    // .attr("fill", "rgb(31, 119, 180)")
        .attr("fill", function(d) { return color(d.topic); })
        .attr("fill-opacity", "0.8")
        .transition()
        .duration(1000)
        .attr("r", function(d) {
            //console.log(d.name + "," + d.value);
            //if (d.depth == 2) return d.value * 3 + 20;
            //else 
            return d.r;
        })
        .attr("cx", function(d) {
            return d.x;
        })
        .attr("cy", function(d) {
            return d.y;
        });


    circleEnter.append("circle")
        .attr("fill", function(d) { return color(d.topic); })
        .attr("fill-opacity", "0.8")
        .transition()
        .duration(1000)
        .attr("r", function(d) {
            //console.log(d.name + "," + d.value);
            //if (d.depth == 2) return d.value * 3 + 20;
            //else 
            return d.r;
        })
        .attr("cx", function(d) {
            return d.x;
        })
        .attr("cy", function(d) {
            return d.y;
        });

    circleExit.transition()
        .duration(1000)
        .remove();
    circle.on("mouseover", function(d, i) {
            if (d.depth == 2) {
                d3.select(this)
                    .attr("fill", function(d) { return color(10); })
            }
        })
        .on("mouseout", function(d, i) {
            if (d.depth == 2) {
                d3.select(this)
                    .attr("fill", function(d) { return color(d.topic); });
            }
        });

    var text = plot.selectAll("text").data(nodes);
    var textEnter = text.enter();
    var textExit = text.exit();

    text.attr("font-size", "12px")
        .attr("fill", "white")
        .attr("fill-opacity", function(d) {
            if (d.depth == 2)
                return "0.9";
            else
                return "0";
        })
        .transition()
        .duration(1000)
        .attr("x", function(d) {
            return d.x;
        })
        .attr("y", function(d) {
            return d.y;
        })
        .attr("dx", -12)
        .attr("dy", 1)
        .text(function(d) {
            return d.name;
        });
    textEnter.append("text")
        .attr("font-size", "12px")
        .attr("fill", "white")
        .attr("fill-opacity", function(d) {
            if (d.depth == 2)
                return "0.9";
            else
                return "0";
        })
        .transition()
        .duration(1000)
        .attr("x", function(d) {
            return d.x;
        })
        .attr("y", function(d) {
            return d.y;
        })
        .attr("dx", -12)
        .attr("dy", 1)
        .text(function(d) {
            return d.name;
        });
    textExit.transition()
        .duration(1000)
        .remove();

}
var pretime = "";

function update(h) {
    var year = h.getFullYear();
    var month = (parseInt(h.getMonth()) + 1);
    switch (month) {
        case 2:
        case 3:
            month = 1;
            break;
        case 5:
        case 6:
            month = 4;
            break;
        case 8:
        case 9:
            month = 7;
            break;
        case 11:
        case 12:
            month = 10;
            break;
    }
    var time = year + "/" + month;
    // update position and text of label according to slider scale
    handle.attr("cx", x(h));
    label.attr("x", x(h))
        .text(formatDate(h));

    // filter data set and redraw plot
    if (pretime !== time) {
        var newData = dataset[time]
        drawPlot(time, newData);
    }
    pretime = time;
}
////////// slider //////////

var moving = false;
var currentValue = 0;
var targetValue = width;

var playButton = d3.select("#play-button");

var x = d3.time.scale()
    .domain([startDate, endDate])
    .range([0, targetValue])
    .clamp(true);

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height + ")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
    .select(function() {
        return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "track-inset")
    .select(function() {
        return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "track-overlay")
    .call(d3.behavior.drag()
        .on("dragend", function() {
            slider.interrupt();
        })
        .on("drag", function() {
            currentValue = d3.event.x;
            update(x.invert(currentValue));
        })
    );

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
    .data(x.ticks(10))
    .enter()
    .append("text")
    .attr("x", x)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function(d) {
        return formatDateIntoYear(d);
    });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

var label = slider.append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(formatDate(startDate))
    .attr("transform", "translate(0," + (-25) + ")")