
const h = 500;
const w = window.innerWidth;

const transition_duration = 1500;
const pause = 6500;

const background_color = "#126bcd";

// Array of objects
// Each object with keys "title" and "values"
const data = [{title: "website visits", values: [7060309, 7324365, 7656326, 6390242, 5945494, 5938188, 6191221]},
    {title: "qualified sales prospects", values: [12033, 14268, 16717, 16725, 15671, 15750, 16567]},
    {title: "leads saved", values: [1492, 1697, 2550, 2647, 2302, 2405, 2894]},
    {title: "dynamic emails sent", values: [173243, 193458, 205296, 216979, 198229, 202007, 215451]},
    {title: "inventory changes monitored", values: [520082, 469083, 480548, 786334, 567338, 639586, 884198]}];

const people = [
    {
        text: ["What type of car", "is Liz looking for?"],
        x: w * .10,
        y: h * .55,
        img: "img/brunette_woman_png.png"
    },
    {
        text: ["Is Malcolm logged","in our CRM?"],
        x: w * .15,
        y: h * .1,
        img: "img/bald_man_png.png"
    },
    {
        text: ["What did Hannah", "search for last month?"],
        x: w * .62,
        y: h * .17,
        img: "img/shorthaired_woman_png.png"
    },
    {
        text: ["Did we return","Michael's call?"],
        x: w * .9,
        y: h * .5,
        img: "img/tan_man_png.png"
    },
    {
        text: ["What price range is Gina","searching within?"],
        x: w * .4,
        y: h * .35,
        img: "img/older_brunette_woman_png.png"
    },
    {
        text: ["What marketing channels are","most profitable this month?"],
        x: w * .75,
        y: h * .1,
        img: "img/glasses_man_png.png"
    },
    {
        text: ["How do our sales compare","to others in the area?"],
        x: w * .90,
        y: h * .25,
        img: "img/greyhaired_man_png.png"
    }
].map(o => {
    o.t = Math.random() * 2 * Math.PI;
    o.dt = Math.random() * .1 - .05;
    o.o = Math.random() * 2 * Math.PI; // opacity seed
    o.dx = 0;
    o.dy = 0;
    return o;
});

////  Canvas  ////
const svg = d3.select("body").append("svg").attr("width",w).attr("height",h);
svg.append("rect").attr("width", w).attr("height", h).attr("fill", background_color);

////  Data Manipulation  ////
let current_graph = -1;
const number_of_points = data[0].values.length;
const values = () => (current_graph === -1) ? new Array(number_of_points).fill(0) : data[current_graph]["values"];
const points = () => [values().map((y, i) => [i, y])];
const title = () => (current_graph === -1) ? "" : data[current_graph]["title"];
const point_val = () => values()[4];

const x = d3.scaleLinear()
    .domain([0, number_of_points - 1])
    .range([0, w]);

const y = d3.scaleLinear()
    .domain([d3.min(values()) * .85, d3.max(values()) + 1])
    .range([h, 2 * h / 3]);

const area = d3.area()
    .curve(d3.curveCardinal)
    .x(d => x(d[0]))
    .y0(y(0))
    .y1(d => y(d[1]));


////  Initial Render  ////
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

/*
const line = svg
    .append("line")
    .attr("x1", x(4))
    .attr("y1", h / 2 + 20)
    .attr("x2", x(4))
    .attr("y2", y(point_val()) - 5)
    .attr("stroke", "white");
*/
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

/*
const fifth = svg
    .append("circle")
    .attr("cx", x(4))
    .attr("cy", y(point_val()))
    .attr("r", 8)
    .attr("stroke", "#4e8fdb")
    .attr("stroke-opacity", "0.0")
    .attr("stroke-width", "2")
    .attr("fill", "none");
*/

const person_bubble_group = svg.selectAll("g.person")
    .data(people)
    .enter()
    .append("g")
    .attr("class", "person")
    .attr("opacity", 0);
person_bubble_group
    .append("image")
    .attr("xlink:href", d => d.img)
    .attr("x", d => d.x - 28)
    .attr("y", d => d.y - 28)
    .attr("width", 56)
    .attr("height", 56);
person_bubble_group
    .append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", "27")
    .attr("fill", "none")
    .attr("stroke", "#4e8fdb")
    .attr("stroke-opacity", "0.5")
    .attr("stroke-width", "2");
person_bubble_group
    .append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", "37")
    .attr("fill", "none")
    .attr("stroke", "#206ece")
    .attr("stroke-opacity", "1")
    .attr("stroke-width", "2");
person_bubble_group
    .append("text")
    .attr("class", "question")
    .attr("text-anchor", "middle")
    .attr("x", d => d.x)
    .attr("y", d => d.y + 40)
    .text(d => d.text[0])
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("fill", "#5286e3");
person_bubble_group
    .append("text")
    .attr("class", "question")
    .attr("text-anchor", "middle")
    .attr("x", d => d.x)
    .attr("y", d => d.y + 60)
    .text(d => d.text[1])
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("fill", "#5286e3");

////  Animation  ////
const unit = .1;
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
    //const old_y = y(old_val);

    current_graph = (current_graph === data.length - 1) ? 0 : current_graph + 1;
    y.domain([d3.min(values()) * .85, d3.max(values())]);

    const new_val = point_val();
    const new_y = y(point_val());

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
/*
    fifth
        .transition()
          .duration(200)
          .attr("stroke-opacity", 0.0)
        .transition()
          .delay(transition_duration)
          .attr("cy", new_y)
        .transition()
          .duration(200)
          .attr("stroke-opacity", 1.0);
*/

    last_week
        .transition()
          .duration(200)
          .style("fill", background_color)
        .transition()
          .delay(transition_duration + 200)
          .duration(200)
          .style("fill", "#04bcfc");

}

setTimeout(area_tick, 1000);  // Initial transition of area graph
d3.interval(area_tick, pause);  // All subsequent transitions of area graph
d3.interval(bubble_tick, 66);
svg.selectAll("g.person")
    .data(people)
    .transition()
    .delay(4000)
    .duration(8000)
    .attr("opacity", d => normalize_opacity(d.o));
setTimeout(function(){d3.interval(bubble_opacity_tick, 66);}, 12000);
