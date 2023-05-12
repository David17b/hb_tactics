/* Configuration ***************************************************************/

let cf_Color_A = "red";
let cf_Color_B = "yellow";
let cf_Color_Ball = "black";
let cf_Player_radius = 45;
let cf_Ball_radius = 35;

/* Canvas **********************************************************************/
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let button_5 = document.getElementById("fuenf_1");
let button_6 = document.getElementById("sechs_0");
let button_trace = document.getElementById("trace");
let button_fullscreen = document.getElementById("fullscreen");

canvas.width = window.innerHeight * (4 / 3);
canvas.height = window.innerHeight; // TODO check which aspect ratio to use

canvas.style.border = "0px solid red";

let canvas_width = canvas.width;
let canvas_height = canvas.height;
let aspect_ratio = 0.75;
let traceEnabled = false;

/* Player data *****************************************************************/

let players = [];
players.push({ x: 300, y: 200, color: cf_Color_A, radius: cf_Player_radius });
players.push({ x: 500, y: 200, color: cf_Color_A, radius: cf_Player_radius });
players.push({ x: 700, y: 200, color: cf_Color_A, radius: cf_Player_radius });
players.push({ x: 700, y: 200, color: cf_Color_A, radius: cf_Player_radius });
players.push({ x: 700, y: 200, color: cf_Color_A, radius: cf_Player_radius });
players.push({ x: 700, y: 200, color: cf_Color_A, radius: cf_Player_radius });
players.push({ x: 300, y: 400, color: cf_Color_B, radius: cf_Player_radius });
players.push({ x: 300, y: 400, color: cf_Color_B, radius: cf_Player_radius });
players.push({ x: 300, y: 400, color: cf_Color_B, radius: cf_Player_radius });
players.push({ x: 300, y: 400, color: cf_Color_B, radius: cf_Player_radius });
players.push({ x: 500, y: 400, color: cf_Color_B, radius: cf_Player_radius });
players.push({ x: 700, y: 400, color: cf_Color_B, radius: cf_Player_radius });
players.push({
  x: canvas_width / 2 + 50,
  y: canvas_height * 0.85 - 50,
  color: cf_Color_Ball,
  radius: cf_Ball_radius
});

let markers = [];

/* drag'n'drop *****************************************************************/

let current_shape_index = null;
let is_dragging = false;
let is_buttonDown = false;

let startX = 0;
let startY = 0;

/* *****************************************************************************/
let draw_field = function () {
  let imgField = document.getElementById("feld");
  context.drawImage(imgField, 0, 0, canvas_width, canvas_width * aspect_ratio);
};

/* *****************************************************************************/
let draw_markers = function () {
  for (let mark of markers) {
    context.lineWidth = 3;
    context.fillStyle = "yellow";
    context.beginPath();
    context.arc(mark.x, mark.y, 5, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
  }
};

/* *****************************************************************************/
let draw_players = function () {
  for (let pl of players) {
    // var grd = context.createRadialGradient(pl.x, pl.y, 10, pl.x, pl.y, conf_Player_Size/2);
    // grd.addColorStop(0, "#AA0000");
    // grd.addColorStop(0.5, "#DD0000");
    // grd.addColorStop(0.7, "#AA0000");
    // grd.addColorStop(0.9, "#222222");
    context.shadowBlur = 20;
    context.shadowColor = "#003355";
    context.shadowOffsetX = 3;
    context.shadowOffsetY = 3;

    context.lineWidth = 5;
    context.fillStyle = pl.color; //grd
    context.beginPath();
    context.arc(pl.x, pl.y, pl.radius / 2, 0, 2 * Math.PI);
    // context.stroke();
    context.fill();
  }
};

/* *****************************************************************************/
let draw = function () {
  context.fillStyle = "green";
  //context.clearRect(0, 0, canvas_width, canvas_height);
  //draw_field();
  //draw_players();
  // draw_markers();
};

/* *****************************************************************************/
let is_mouse_in_shape = function (x, y, shape) {
  let shape_left = shape.x - shape.radius / 2;
  let shape_right = shape.x + shape.radius / 2;
  let shape_top = shape.y - shape.radius / 2;
  let shape_bottom = shape.y + shape.radius / 2;

  let in_shape =
    shape_left < x && x < shape_right && shape_top < y && y < shape_bottom;

  return in_shape;
};

/* *****************************************************************************/
let mouse_down = function (event) {
  event.preventDefault();

  startX = parseInt(event.clientX);
  startY = parseInt(event.clientY);

  current_shape_index = null;
  is_dragging = false;

  is_buttonDown = true;

  let index = 0;
  for (let shape of players) {
    if (is_mouse_in_shape(startX, startY, shape)) {
      current_shape_index = index;
      is_dragging = true;
      console.log(is_dragging);
      return;
    }
    index++;
  }
  draw();
};

let touch_down = function (event) {
  event.preventDefault();

  startX = parseInt(event.touches[0].clientX);
  startY = parseInt(event.touches[0].clientY);

  current_shape_index = null;
  is_dragging = false;

  let index = 0;
  for (let shape of players) {
    if (is_mouse_in_shape(startX, startY, shape)) {
      current_shape_index = index;
      is_dragging = true;
      console.log(is_dragging);
      return;
    }
    index++;
  }
  draw();
};

/* *****************************************************************************/
let mouse_move = function (event) {
  event.preventDefault();

  let mouseX = parseInt(event.clientX);
  let mouseY = parseInt(event.clientY);

  if (!is_dragging) {
    return;
  }

  let dx = mouseX - startX;
  let dy = mouseY - startY;

  // if (traceEnabled) {
  //   markers.push({ x: mouseX, y: mouseY });
  // }

  let current_shape = players[current_shape_index];

  current_shape.x += dx;
  current_shape.y += dy;

  startX = mouseX;
  startY = mouseY;

  draw();
};

/* *****************************************************************************/
let touch_move = function (event) {
  event.preventDefault();

  if (!is_dragging) {
    return;
  }

  let mouseX = parseInt(event.touches[0].clientX);
  let mouseY = parseInt(event.touches[0].clientY);

  let dx = mouseX - startX;
  let dy = mouseY - startY;

  let current_shape = players[current_shape_index];

  current_shape.x += dx;
  current_shape.y += dy;

  startX = mouseX;
  startY = mouseY;

  draw();
};

/* *****************************************************************************/
let mouse_out = function (event) {
  event.preventDefault();

  if (!is_dragging) {
    return;
  }

  is_dragging = false;
};

/* *****************************************************************************/
let mouse_up = function (event) {
  event.preventDefault();

  is_buttonDown = false;

  if (!is_dragging) {
    return;
  }

  is_dragging = false;
};

let trace = function (event) {
  traceEnabled = !traceEnabled;
  if (!traceEnabled) {
    markers = [];
  }
};

let fullscreen = function (event) {
  canvas.requestFullscreen();
};

let abwehr_5 = function (event) {
  let current_shape = players[0];
  current_shape.x = canvas_width * 0.05;
  current_shape.y = canvas_height * 0.1;
  current_shape = players[1];
  current_shape.x = canvas_width * 0.1;
  current_shape.y = canvas_height * 0.6;
  current_shape = players[2];
  current_shape.x = canvas_width * 0.5;
  current_shape.y = canvas_height * 0.85;
  current_shape = players[3];
  current_shape.x = canvas_width * 0.9;
  current_shape.y = canvas_height * 0.6;
  current_shape = players[4];
  current_shape.x = canvas_width * 0.95;
  current_shape.y = canvas_height * 0.1;
  current_shape = players[5];
  current_shape.x = canvas_width * 0.5;
  current_shape.y = canvas_height * 0.45;

  current_shape = players[6];
  current_shape.x = canvas_width * 0.17;
  current_shape.y = canvas_height * 0.3;
  current_shape = players[7];
  current_shape.x = canvas_width * 0.28;
  current_shape.y = canvas_height * 0.45;
  current_shape = players[8];
  current_shape.x = canvas_width * 0.5;
  current_shape.y = canvas_height * 0.7;
  current_shape = players[9];
  current_shape.x = canvas_width * 0.72;
  current_shape.y = canvas_height * 0.45;
  current_shape = players[10];
  current_shape.x = canvas_width * 0.83;
  current_shape.y = canvas_height * 0.3;
  current_shape = players[11];
  current_shape.x = canvas_width * 0.5;
  current_shape.y = canvas_height * 0.5;
  draw();
};

let abwehr_6 = function (event) {
  let current_shape = players[0];
  current_shape.x = canvas_width * 0.05;
  current_shape.y = canvas_height * 0.1;
  current_shape = players[1];
  current_shape.x = canvas_width * 0.1;
  current_shape.y = canvas_height * 0.6;
  current_shape = players[2];
  current_shape.x = canvas_width * 0.5;
  current_shape.y = canvas_height * 0.85;
  current_shape = players[3];
  current_shape.x = canvas_width * 0.9;
  current_shape.y = canvas_height * 0.6;
  current_shape = players[4];
  current_shape.x = canvas_width * 0.95;
  current_shape.y = canvas_height * 0.1;
  current_shape = players[5];
  current_shape.x = canvas_width * 0.5;
  current_shape.y = canvas_height * 0.45;

  current_shape = players[6];
  current_shape.x = canvas_width * 0.17;
  current_shape.y = canvas_height * 0.3;
  current_shape = players[7];
  current_shape.x = canvas_width * 0.28;
  current_shape.y = canvas_height * 0.45;
  current_shape = players[8];
  current_shape.x = canvas_width * 0.42;
  current_shape.y = canvas_height * 0.5;
  current_shape = players[9];
  current_shape.x = canvas_width * 0.58;
  current_shape.y = canvas_height * 0.5;
  current_shape = players[10];
  current_shape.x = canvas_width * 0.72;
  current_shape.y = canvas_height * 0.45;
  current_shape = players[11];
  current_shape.x = canvas_width * 0.83;
  current_shape.y = canvas_height * 0.3;

  draw();
};

abwehr_5();

canvas.onmousedown = mouse_down;
canvas.onmouseup = mouse_up;
canvas.onmousemove = mouse_move;
canvas.onmouseout = mouse_out;

canvas.ontouchmove = touch_move;
canvas.ontouchstart = touch_down;
canvas.ontouchend = mouse_up;

button_5.addEventListener("click", abwehr_5);
button_6.addEventListener("click", abwehr_6);
button_trace.addEventListener("click", trace);
button_fullscreen.addEventListener("click", fullscreen);

draw();
