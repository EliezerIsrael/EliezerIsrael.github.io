
///////////////////////////////////
// Easily configurable variables //
///////////////////////////////////

const h = 700;                        // (px) Height of visualization
const graph_top = 2/3;                // (0..1)  How far down from the top line is the area graph?
const initial_area_delay = 1000;      // (ms) Delay before first animation of area graph
const pause = 6500;                   // (ms) Time between transitions of area graph
const initial_bubble_delay = 4000;    // (ms) Delay before bubbles fade in
const initial_bubble_duration = 8000; // (ms) Length of initial bubble fade in
const transition_duration = 1500;     // (ms) Duration of each active transition of area graph
const background_color = "#126bcd";   // Background color



/////////////////////////
// Data for area graph //
/////////////////////////

// Array of objects.  Each object is one state of graph.
// Each object has keys "title" and "values" - an array of numbers

// Graphs are totally responsive to this data.
// There can be any number of objects, and any number of data points within "values".
// It works best if each object has the same number of data points.

const data = [{title: "website visits", values: [7060309, 7324365, 7656326, 6390242, 5945494, 5938188, 6191221]},
    {title: "qualified sales prospects", values: [12033, 14268, 16717, 16725, 15671, 15750, 16567]},
    {title: "leads saved", values: [1492, 1697, 2550, 2647, 2302, 2405, 2894]},
    {title: "dynamic emails sent", values: [173243, 193458, 205296, 216979, 198229, 202007, 215451]},
    {title: "inventory changes monitored", values: [520082, 469083, 480548, 786334, 567338, 639586, 884198]}];

/////////////////////
// Data for people //
/////////////////////

// Array of objects.  Each object is one person.
// Configurable Attributes of each object:
// - text       Array of two strings
// - x_factor   At what fraction of visualization's width this circle renders (Left: 0, Right: 1)
// - y_factor   At what fraction of visualization's height this circle renders (Top : 0, Bottom : 1)
// - img        The picture used for this person

// All objects get decorated with numbers that control its trajectory, fade, etc.  Documented below.

const people = [
    {
        text: ["What type of car", "is Liz looking for?"],
        x_factor: .10,
        y_factor: .55,
        img: "img/brunette_woman_png.png"
    },
    {
        text: ["Is Malcolm logged","in our CRM?"],
        x_factor: .15,
        y_factor: .1,
        img: "img/bald_man_png.png"
    },
    {
        text: ["What did Hannah", "search for last month?"],
        x_factor: .62,
        y_factor: .17,
        img: "img/shorthaired_woman_png.png"
    },
    {
        text: ["Did we return","Michael's call?"],
        x_factor: .9,
        y_factor: .5,
        img: "img/tan_man_png.png"
    },
    {
        text: ["What price range is Gina","searching within?"],
        x_factor: .4,
        y_factor: .35,
        img: "img/older_brunette_woman_png.png"
    },
    {
        text: ["What marketing channels are","most profitable this month?"],
        x_factor: .75,
        y_factor: .1,
        img: "img/glasses_man_png.png"
    },
    {
        text: ["How do our sales compare","to others in the area?"],
        x_factor: .90,
        y_factor: .25,
        img: "img/greyhaired_man_png.png"
    }
].map(o => {
    o.t = Math.random() * 2 * Math.PI;  // Initial trajectory
    o.o = Math.random() * 2 * Math.PI;  // Initial opacity
    o.dt = Math.random() * .1 - .05;    // Change in trajectory & fade at each step
    o.dx = 0;   // Accumulated change in X from start
    o.dy = 0;   // Accumulated change in Y from start
    return o;
});

/////////////////////
//      Canvas     //
/////////////////////

let w = window.innerWidth;
const svg = d3.select("body").append("svg").attr("width",w).attr("height",h);
const background = svg.append("rect").attr("width", w).attr("height", h).attr("fill", background_color);
let current_graph = -1;


/////////////////////////////////////
////  Data Processing Functions  ////
/////////////////////////////////////

const number_of_points = () => data[(current_graph === -1)?0:current_graph].values.length;
const values = () => (current_graph === -1) ? new Array(number_of_points()).fill(0) : data[current_graph]["values"];
const points = () => [values().map((y, i) => [i, y])];
const title = () => (current_graph === -1) ? "" : data[current_graph]["title"];
const point_val = () => values()[4];

const x = d3.scaleLinear()
    .domain([0, number_of_points() - 1])
    .range([0, w]);

const y = d3.scaleLinear()
    .domain([d3.min(values()) * .85, d3.max(values()) + 1])
    .range([h, h * graph_top]);

const area = d3.area()
    .curve(d3.curveCardinal)
    .x(d => x(d[0]))
    .y0(y(0))
    .y1(d => y(d[1]));

//////////////////////////
////  Initial Render  ////
//////////////////////////

const path = svg.selectAll("path")
    .data(points)
    .enter()
    .append("path")
    .attr("d", area)
    .attr("fill", "#fff");

const label = svg
    .append("text")
    .attr("class", "label")
    .attr("x", w * .8)
    .attr("y", h / 2)
    .text("")
    .attr("text-anchor", "end")
    .attr("font-family", "sans-serif")
    .attr("font-size", "22px")
    .attr("font-weight", "bold")
    .attr("fill", "white");

const point_value = svg
    .append("text")
    .attr("class", "pointval")
    .attr("x", w * .8)
    .attr("y", h / 2 - 32)
    .text("0")
    .attr("text-anchor", "end")
    .attr("font-family", "sans-serif")
    .attr("font-size", "40px")
    .attr("font-weight", "bold")
    .attr("fill", "white");

const last_week = svg
    .append("text")
    .attr("x", w * .8)
    .attr("y", h / 2 + 26)
    .text("last week")
    .attr("text-anchor", "end")
    .attr("font-family", "sans-serif")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .attr("fill", background_color);

const person_bubble_group = svg.selectAll("g.person")
    .data(people)
    .enter()
    .append("g")
    .attr("class", "person")
    .attr("opacity", 0);
person_bubble_group
    .append("image")
    .attr("xlink:href", d => d.img)
    .attr("x", d => (w * d.x_factor) - 28)
    .attr("y", d => (h * d.y_factor) - 28)
    .attr("width", 56)
    .attr("height", 56);
person_bubble_group
    .append("circle")
    .attr("cx", d => (w * d.x_factor))
    .attr("cy", d => (h * d.y_factor))
    .attr("r", "27")
    .attr("fill", "none")
    .attr("stroke", "#4e8fdb")
    .attr("stroke-opacity", "0.5")
    .attr("stroke-width", "2");
person_bubble_group
    .append("circle")
    .attr("cx", d => (w * d.x_factor))
    .attr("cy", d => (h * d.y_factor))
    .attr("r", "37")
    .attr("fill", "none")
    .attr("stroke", "#206ece")
    .attr("stroke-opacity", "1")
    .attr("stroke-width", "2");
person_bubble_group
    .append("text")
    .attr("class", "question")
    .attr("text-anchor", "middle")
    .attr("x", d => (w * d.x_factor))
    .attr("y", d => (h * d.y_factor) + 40)
    .text(d => d.text[0])
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("fill", "#5286e3");
person_bubble_group
    .append("text")
    .attr("class", "question")
    .attr("text-anchor", "middle")
    .attr("x", d => (w * d.x_factor))
    .attr("y", d => (h * d.y_factor) + 60)
    .text(d => d.text[1])
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("fill", "#5286e3");

/////////////////////
////  Animation  ////
/////////////////////

const unit = .1;        // How far each bubble moves, at each clock tick
normalize_opacity  = d => Math.sin(d) / 4 + .75;
function bubble_tick() {
    people.forEach(person => {
        person.dx = person.dx + (unit * Math.cos(person.t));
        person.dy = person.dy + (unit * Math.sin(person.t));
        person.t = person.t + person.dt;
    });
    svg.selectAll("g.person")
        .data(people)
        .attr("transform", d => `translate(${d.dx},${d.dy})`);
}
function bubble_opacity_tick() {
    people.forEach(person => {
        person.o = person.o + person.dt;
    });
    svg.selectAll("g.person")
        .data(people)
        .attr("opacity", d => normalize_opacity(d.o));
}

function area_tick() {
    const old_val = point_val();

    current_graph = (current_graph === data.length - 1) ? 0 : current_graph + 1;
    y.domain([d3.min(values()) * .85, d3.max(values())]);
    x.domain([0, number_of_points() - 1]);

    const new_val = point_val();

    path
        .data(points)
        .transition()
        .duration(transition_duration)
        .attr("d", area)
        .tween("fifth", function () {
            const ival = d3.interpolateNumber(old_val, new_val);
            return t => point_value.text(ival(t).toLocaleString(undefined, {maximumFractionDigits: 0}));
        });

    label
        .transition()
          .duration(200)
          .style("fill", background_color)
        .transition()
          .text("")
        .transition()
          .delay(d3.max([transition_duration - 350, 0]))
          .duration(100)
          .style("fill", "#fff")
          .text(title());

    last_week
        .transition()
          .duration(200)
          .style("fill", background_color)
        .transition()
          .delay(transition_duration + 200)
          .duration(200)
          .style("fill", "#04bcfc");

}

// The process of all animations is controlled here.

setTimeout(area_tick, initial_area_delay);  // Delay before initial transition of area graph
d3.interval(area_tick, pause);              // All subsequent transitions of area graph
d3.interval(bubble_tick, 66);
svg.selectAll("g.person")
    .data(people)
    .transition()
    .delay(initial_bubble_delay)
    .duration(initial_bubble_duration)
    .attr("opacity", d => normalize_opacity(d.o));
setTimeout(function(){d3.interval(bubble_opacity_tick, 66);}, initial_bubble_delay + initial_bubble_duration);

// Redraw when browser window resized.
window.addEventListener("resize", redraw);
function redraw() {
    w = window.innerWidth;

    x.range([0, w]);
    svg.attr("width", w);
    background.attr("width", w);
    person_bubble_group.select("image").attr("x", d => (w * d.x_factor) - 28);
    person_bubble_group.selectAll("circle").attr("cx", d => (w * d.x_factor));
    person_bubble_group.selectAll("text").attr("x", d => (w * d.x_factor));
    path.attr("d", area);
    label.attr("x", w * .8);
    point_value.attr("x", w * .8);
    last_week.attr("x", w * .8);
}