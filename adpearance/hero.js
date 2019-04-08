
const h = 500;
const w = window.innerWidth;

const transition_duration = 1000;
const pause = 4000;

// Array of objects
// Each object with keys "title" and "values"
const data = [{title: "Website Visits", values: [7060309, 7324365, 7656326, 6390242, 5945494, 5938188, 6191221]},
    {title: "Qualified Sales Prospects", values: [12033, 14268, 16717, 16725, 15671, 15750, 16567]},
    {title: "Leads Saved", values: [1492, 1697, 2550, 2647, 2302, 2405, 2894]},
    {title: "Dynamic Emails Sent", values: [173243, 193458, 205296, 216979, 198229, 202007, 215451]},
    {title: "Inventory Changes Monitored", values: [520082, 469083, 480548, 786334, 567338, 639586, 884198]}];

const people = [
    {
        text: "What type of car is Liz looking for?",
        x: w * .15,
        y: h * .55,
        img: "img/brunette_woman_png.png"
    },
    {
        text: "Is Malcolm logged in our CRM?",
        x: w * .2,
        y: h * .1,
        img: "img/bald_man_png.png"
    },
    {
        text: "What did Hannah search for last month?",
        x: w * .72,
        y: h * .17,
        img: "img/shorthaired_woman_png.png"
    },
    {
        text: "Did we return Michael's call?",
        x: w * .6,
        y: h * .6,
        img: "img/tan_man_png.png"
    },
    {
        text: "What price range is Gina searching within?",
        x: w * .7,
        y: h * .35,
        img: "img/older_brunette_woman_png.png"
    },
    {
        text: "What marketing channels are most profitable this month?",
        x: w * .82,
        y: h * .1,
        img: "img/glasses_man_png.png"
    },
    {
        text: "How do our sales compare to others in the area?",
        x: w * .92,
        y: h * .25,
        img: "img/greyhaired_man_png.png"
    }
].map(o => {
    o.t = Math.random() * 2 * Math.PI;
    o.dt = Math.random() * .1 - .05;
    o.dx = 0;
    o.dy = 0;
    return o;
});

////  Canvas  ////
const svg = d3.select("body").append("svg").attr("width",w).attr("height",h);
svg.append("rect").attr("width", w).attr("height", h).attr("fill", "#126bcd");

////  Data Manipulation  ////
let current_graph = 0;

const x = d3.scaleLinear()
    .domain([0, data[0].values.length - 1])
    .range([0, w]);

const y = d3.scaleLinear()
//.domain([0, d3.max(data[0].values)])
    .domain([d3.min(data[current_graph].values) * .85, d3.max(data[current_graph].values)])
    .range([h, 2 * h / 3]);

const area = d3.area()
    .curve(d3.curveCardinal)
    .x(d => x(d[0]))
    .y0(y(0))
    .y1(d => y(d[1]));

function points() {
    return [data[current_graph]["values"].map((y, i) => [i, y])];
}

function title() {
    return data[current_graph]["title"];
}

function point_val() {
    return data[current_graph]["values"][4];
}

function presentable_point_val() {
    const n = point_val();
    return n.toLocaleString();
}

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
    .attr("x", w * .5)
    .attr("y", h / 2)
    .text(title())
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("font-weight", "bold")
    .attr("fill", "white");

const line = svg
    .append("line")
    .attr("x1", x(4))
    .attr("y1", h / 2 + 20)
    .attr("x2", x(4))
    .attr("y2", y(point_val()) - 5)
    .attr("stroke", "white");

const point_value = svg
    .append("text")
    .attr("class", "pointval")
    .attr("x", w * .5)
    .attr("y", h / 2 - 20)
    .text(presentable_point_val())
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("font-weight", "bold")
    .attr("fill", "white");

const person_bubble_group = svg.selectAll("g.person")
    .data(people)
    .enter()
    .append("g")
    .attr("class", "person");
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

////  Animation  ////
const unit = .1;

function bubble_tick(people) {
    people.forEach(person => {
        person.dx = person.dx + (unit * Math.cos(person.t));
        person.dy = person.dy + (unit * Math.sin(person.t));
        person.t = person.t + person.dt;
    });
    svg.selectAll("g.person")
        .data(people)
        .attr("transform", d => `translate(${d.dx},${d.dy})`);
}

const bubble_interval = d3.interval(() => {
    bubble_tick(people);
}, 66);


const area_interval = d3.interval(() => {
    const old_val = point_val();
    const old_y = y(old_val);

    current_graph = (current_graph === data.length - 1) ? 0 : current_graph + 1;
    y.domain([d3.min(data[current_graph].values) * .85, d3.max(data[current_graph].values)]);

    const new_val = point_val();
    const new_y = y(point_val());

    path
        .data(points)
        .transition()
        .duration(transition_duration)
        .attr("d", area)
        .tween("fifth", function () {
            const iy = d3.interpolateNumber(old_y, new_y);
            const ival = d3.interpolateNumber(old_val, new_val);

            return t => {
                line.attr("y2", iy(t) - 5);
                point_value.text(ival(t).toLocaleString(undefined, {maximumFractionDigits: 0}));
            }
            //return t => console.log(i(t));
        });

    label
        .transition()
        .delay(d3.max([transition_duration - 350, 0]))
        .text(title());

}, pause);

// invalidation.then(() => area_interval.stop()).then(() => bubble_interval.stop());
