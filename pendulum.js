function animate(myCircle1, myCircle2, myLine1, myLine2) {
  mu      =  1+m1/m2;
  d2Phi1  =  (g*(Math.sin(Phi2)*Math.cos(Phi1-Phi2)-mu*Math.sin(Phi1))-(l2*dPhi2*dPhi2+l1*dPhi1*dPhi1*Math.cos(Phi1-Phi2))*Math.sin(Phi1-Phi2))/(l1*(mu-Math.cos(Phi1-Phi2)*Math.cos(Phi1-Phi2)));
  d2Phi2  =  (mu*g*(Math.sin(Phi1)*Math.cos(Phi1-Phi2)-Math.sin(Phi2))+(mu*l1*dPhi1*dPhi1+l2*dPhi2*dPhi2*Math.cos(Phi1-Phi2))*Math.sin(Phi1-Phi2))/(l2*(mu-Math.cos(Phi1-Phi2)*Math.cos(Phi1-Phi2)));
  dPhi1   += d2Phi1*time;
  dPhi2   += d2Phi2*time;
  Phi1    += dPhi1*time;
  Phi2    += dPhi2*time;

  var pendEnd = {x: Math.sin(Phi1)+Math.sin(Phi2), y: Math.cos(Phi1)+Math.cos(Phi2)};
  myCircle1.x = X0+l1*Math.sin(Phi1);
  myCircle1.y = Y0+l1*Math.cos(Phi1);
  myCircle2.x = X0+l1*Math.sin(Phi1)+l2*Math.sin(Phi2);
  myCircle2.y = Y0+l1*Math.cos(Phi1)+l2*Math.cos(Phi2);

  myLine1.x  = myCircle1.x;
  myLine1.y  = myCircle1.y;
  myLine2.x0 = myCircle1.x;
  myLine2.y0 = myCircle1.y;
  myLine2.x  = myCircle2.x;
  myLine2.y  = myCircle2.y;

  drawScreen();
  paintCircle(pendEnd);
}

//Physics Constants
var d2Phi1 = 0;
var d2Phi2 = 0;
var dPhi1  = 0;
var dPhi2  = 0;
var Phi1   = 0*(Math.PI)/2;
var Phi2   = 2.3*(Math.PI)/2;
var m1     = 10;
var m2     = 10;
var l1     = 150;
var l2     = 150;
var X0     = 350;
var Y0     = 60;
var g      = 9.8;
var time   = 0.05;

var running = false;

var canvas  = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var interval = 0;

function reset() {
  myLine1 = {x0: X0, y0: Y0, x: 0, y: 0};
  myLine2 = {x0: 0, y0: 0, x: 0, y: 0};
  myCircle1 = {x: X0+l1*Math.sin(Phi1), y: Y0+l1*Math.cos(Phi1), mass: m1};
  myCircle2 = {x: X0+l1*Math.sin(Phi1)+l2*Math.sin(Phi2), y: Y0+l1*Math.cos(Phi1)+l2*Math.cos(Phi2), mass: m2};
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function run() {
  clearInterval(interval);
}

defaultSimSett = {
  'm1': 10,
  'm2': 10,
  'Phi1': 0*(Math.PI)/2,
  'Phi2': 2.3*(Math.PI)/2,
  'd2Phi1': 0,
  'd2Phi2': 0,
  'dPhi1': 0,
  'dPhi2': 0,
  'm1Pos': {'x': X0+l1*Math.sin(this.Phi1), 'y': Y0+l1*Math.cos(this.Phi1)}
};

currSimSett = $.extend({}, defaultSimSett);

  // Add event listerners on page load
$(function () {
  $('#set_variables_form').on('change', updateSettings);
  $('#start-button').click(uiInput);
  $('#reset-button').click(resetSim);
});


function uiInput() {    // When the start/stop/pause simulation button is pressed
  if(!running) {                        // We are not currently running so start running
    $('#start-button').val("Pause");
    $('#reset-button').prop('disabled', true);
    running = true;
    updateSettings();
    interval = setInterval(function() {
      animate(myCircle1, myCircle2, myLine1, myLine2);
    }, 5);
  } else {                              // We are running so pause running
    $('#start-button').val("Start");
    $('#reset-button').prop('disabled', false);
    running = false;
    clearInterval(interval);
  }
}

function resetSim() {
  currSimSett = $.extend({}, defaultSimSett);
  updateSettings();
}

function updateSettings() {  // When the simulation settings are changed
  currSimSett.m1   = $('#mass1').val();
  currSimSett.m2   = $('#mass2').val();
  currSimSett.Phi1 = $('#Phi1').val()/180*(Math.PI);
  currSimSett.Phi2 = $('#Phi2').val()/180*(Math.PI);

  myCircle1 = {x: X0+l1*Math.sin(currSimSett.Phi1), y: Y0+l1*Math.cos(currSimSett.Phi1), mass: currSimSett.m1};
  myCircle2 = {x: X0+l1*Math.sin(currSimSett.Phi1)+l2*Math.sin(currSimSett.Phi2), y: Y0+l1*Math.cos(Phi1)+l2*Math.cos(currSimSett.Phi2), mass: currSimSett.m2};

  myLine1 = {x0: X0, y0: Y0, x: myCircle1.x, y: myCircle1.y};
  myLine2 = {x0: myCircle1.x, y0: myCircle1.y, x: myCircle2.x, y: myCircle2.y};

  drawScreen();
}


// Display update functions

function drawScreen() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawLine(myLine1, context);
  drawLine(myLine2, context);
  drawCircle(myCircle1, context);
  drawCircle(myCircle2, context);
}

function drawCircle(circle, context) {
  context.beginPath();
  context.arc(circle.x, circle.y, circle.mass, 0, 2 * Math.PI, false);
  context.fillStyle = 'rgba(0,0,0,1)';
  context.fill();
}

function drawLine(line, context) {
  context.beginPath();
  context.moveTo(line.x0, line.y0);
  context.lineTo(line.x, line.y);
  context.strokeStyle = 'red';
  context.lineWidth = 5;
  context.stroke();
}

function paintCircle(myCircle) {
  cncserver.cmd.run('move',  {x: ((myCircle.x + 2) * 25), y: (myCircle.y + 1) * 25});
}
