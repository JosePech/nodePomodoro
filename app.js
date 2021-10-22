const http = require('http');
const { exec } = require('child_process');

const POMODORO_LENGTH = 20000;
const STATUS = {
  RUNNING: 0,  PAUSED: 1, EXPIRED: 2, CANCELLED: 3
}

function notifyPomodoro(){
  var expires = db.filter( item => item.status==STATUS.EXPIRED ).length;
  var fourPomodoroPassed = expires % 4 == 0;
  var rest = fourPomodoroPassed ? "Rest 15 minutes." : "Rest 5 minutes.";
  var message = "Pomodoro ended. " + rest;
  console.log(message);
  
  exec('sh appleNotification \"'+ message +'\"', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stdout) {
      console.log(`stdout: ${stdout}`);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);     
    }
  });

}

var calculateRemaining = function(wanted){
  if(wanted){
    let timediff = Date.now() - wanted.startedAt;
    return POMODORO_LENGTH - timediff;    
  }
  return undefined;
}

var task = function(){
  var wanted = db.find( item => item.status==STATUS.RUNNING );
  var timeRemaining = calculateRemaining(wanted);
  if(timeRemaining !== undefined){
    console.log("Time remaining: " + timeRemaining);
    if(timeRemaining < 0){
      wanted.status = STATUS.EXPIRED;
      notifyPomodoro();
    }
  }
};

var startOrResumeCommand = function(){
  var wanted = db.find( item => item.status==STATUS.RUNNING );
  if(wanted){
    console.log("Already running");
    console.log("No operation");
    return;
  }
  wanted = db.find( item => item.status==STATUS.PAUSED );
  if(wanted){
    wanted.status = STATUS.RUNNING;
    console.log("Resumed");
  } else {
    var pomodoro = { startedAt : Date.now(), status : STATUS.RUNNING };
    db.push(pomodoro);  
    console.log("Created");
  }
};

var pauseCommand = function(){
  var wanted = db.find( item => item.status==STATUS.RUNNING );
  if(wanted){
    wanted.status = STATUS.PAUSED;
    console.log("Paused");
  } else {
    console.log("No operation");
  }  
};

var stopCommand = function(){
  var wanted = db.find( item => item.status==STATUS.PAUSED );
  if(wanted){      
    wanted.status = STATUS.CANCELLED;
    console.log("Stoped paused");
  } else {
    console.log("No operation");
  }

  wanted = db.find( item => item.status==STATUS.RUNNING );
  if(wanted){
    wanted.status = STATUS.CANCELLED;
    console.log("Stoped running");
  } else {
    console.log("No operation");
  }
};

var showCommand = function(){
  var wanted = db.find( item => item.status==STATUS.RUNNING );
  if(wanted){
    var msg = "Time remaining:" + calculateRemaining(wanted);
    console.log(msg);
    return msg;
  } else {
    var msg = "No operation";
    console.log(msg);
    return msg;
  } 
};

var db = [];
var ticker = setInterval(task,1000);


function processCommand(command){
  console.log(command.action)
  if(command.action === "start"){
    startOrResumeCommand();
  } else if(command.action === "pause"){
    pauseCommand();
  } else if(command.action === "stop"){
    stopCommand();
  } else if(command.action === "show"){
    return showCommand();
  }
}

/** handle POST request */
function postHandler(req, res, reqUrl) {
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    res.writeHead(200);    
    res.write('OK: ' + processCommand(JSON.parse(chunk)));
    res.end();
  });
}

/** if there is no related function which handles the request, then show error message */
function noResponse(req, res) {
  res.writeHead(404);
  res.write('Sorry, but we have no response..\n');
  res.end();
}

http.createServer((req, res) => {
  // create an object for all redirection options
  const router = {
    'POST/pomodoro': postHandler,
    'default': noResponse
  };
  // parse the url by using WHATWG URL API
  var reqUrl = new URL(req.url, 'http://127.0.0.1/');
  // find the related function by searching "method + pathname" and run it
  var redirectedFunc = router[req.method + reqUrl.pathname] || router['default'];
  redirectedFunc(req, res, reqUrl);
}).listen(8080, () => {
  console.log('Server is running at http://127.0.0.1:8080/');
});