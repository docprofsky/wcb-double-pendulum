function update(pendSettings) {
  mu      =  1+pendSettings.m1/pendSettings.m2;
  pendSettings.d2Phi1  =  (g*(Math.sin(pendSettings.Phi2)*Math.cos(pendSettings.Phi1-pendSettings.Phi2)-mu*Math.sin(pendSettings.Phi1))-(l2*pendSettings.dPhi2*pendSettings.dPhi2+l1*pendSettings.dPhi1*pendSettings.dPhi1*Math.cos(pendSettings.Phi1-pendSettings.Phi2))*Math.sin(pendSettings.Phi1-pendSettings.Phi2))/(l1*(mu-Math.cos(pendSettings.Phi1-pendSettings.Phi2)*Math.cos(pendSettings.Phi1-pendSettings.Phi2)));
  pendSettings.d2Phi2  =  (mu*g*(Math.sin(pendSettings.Phi1)*Math.cos(pendSettings.Phi1-pendSettings.Phi2)-Math.sin(pendSettings.Phi2))+(mu*l1*pendSettings.dPhi1*pendSettings.dPhi1+l2*pendSettings.dPhi2*pendSettings.dPhi2*Math.cos(pendSettings.Phi1-pendSettings.Phi2))*Math.sin(pendSettings.Phi1-pendSettings.Phi2))/(l2*(mu-Math.cos(pendSettings.Phi1-pendSettings.Phi2)*Math.cos(pendSettings.Phi1-pendSettings.Phi2)));

  pendSettings.dPhi1   += pendSettings.d2Phi1*time;
  pendSettings.dPhi2   += pendSettings.d2Phi2*time;
  pendSettings.Phi1    += pendSettings.dPhi1*time;
  pendSettings.Phi2    += pendSettings.dPhi2*time;

  var pendEnd = {x: Math.sin(pendSettings.Phi1)+Math.sin(pendSettings.Phi2), y: Math.cos(pendSettings.Phi1)+Math.cos(pendSettings.Phi2)};
  myCircle1.x = X0+l1*Math.sin(pendSettings.Phi1);
  myCircle1.y = Y0+l1*Math.cos(pendSettings.Phi1);
  myCircle2.x = X0+l1*Math.sin(pendSettings.Phi1)+l2*Math.sin(pendSettings.Phi2);
  myCircle2.y = Y0+l1*Math.cos(pendSettings.Phi1)+l2*Math.cos(pendSettings.Phi2);

  myLine1.x  = myCircle1.x;
  myLine1.y  = myCircle1.y;
  myLine2.x0 = myCircle1.x;
  myLine2.y0 = myCircle1.y;
  myLine2.x  = myCircle2.x;
  myLine2.y  = myCircle2.y;

  drawScreen();
  paintCircle(pendEnd);

  return pendSettings;
}

//Physics Constants
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
  'm1Pos': {'x': X0+l1*Math.sin(0), 'y': Y0+l1*Math.cos(0)}
};

currSimSett = $.extend({}, defaultSimSett);

  // Add event listerners on page load
$(function () {
  $('#set_variables_form').on('change', updateSettings);
  $('#start-button').click(uiInput);
  $('#reset-button').click(resetSim);
  updateSettings();
});


function uiInput() {    // When the start/stop/pause simulation button is pressed
  if(!running) {                        // We are not currently running so start running
    $('#start-button').val("Pause");
    $('#reset-button').prop('disabled', true);
    running = true;
    interval = setInterval(function() {
      currSimSett = update(currSimSett);
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
  myCircle2 = {x: X0+l1*Math.sin(currSimSett.Phi1)+l2*Math.sin(currSimSett.Phi2), y: Y0+l1*Math.cos(currSimSett.Phi1)+l2*Math.cos(currSimSett.Phi2), mass: currSimSett.m2};

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
