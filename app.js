const http = require('http');
const { exec } = require('child_process');

const POMODORO_LENGTH = 1500000; // 25 minutes
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

var calculateRemaining = function(pomodoroElement){
  if(pomodoroElement){
    return POMODORO_LENGTH - calculateElapsed(pomodoroElement);    
  }
  return undefined;
}

var calculateElapsed = function(pomodoroElement){
  if(pomodoroElement){
    return Date.now() - pomodoroElement.startedAt;
  }
  return undefined;
}

var task = function(){
  var pomodoroElement = db.find( item => item.status==STATUS.RUNNING );
  var timeRemaining = calculateRemaining(pomodoroElement);
  if(timeRemaining !== undefined){
    console.log("Time remaining: " + timeRemaining);
    if(timeRemaining < 0){
      pomodoroElement.status = STATUS.EXPIRED;
      notifyPomodoro();
    }
  }
};

var startOrResumeCommand = function(){
  var pomodoroElement = db.find( item => item.status==STATUS.RUNNING );
  if(pomodoroElement){
    return "Already running";
  }
  pomodoroElement = db.find( item => item.status==STATUS.PAUSED );
  if(pomodoroElement){
    pomodoroElement.status = STATUS.RUNNING;
    pomodoroElement.startedAt = Date.now() - pomodoroElement.elapsed;
    return "Pomodoro resumed";
  } else {
    db.push({ startedAt : Date.now(), status : STATUS.RUNNING });  
    return "Pomodoro started";
  }
};

var pauseCommand = function(){
  var pomodoroElement = db.find( item => item.status==STATUS.RUNNING );
  if(pomodoroElement){
    pomodoroElement.status = STATUS.PAUSED;
    pomodoroElement.elapsed = calculateElapsed(pomodoroElement);
    console.log(pomodoroElement.elapsed);
    return "Pomodoro paused";
  }
  return "Nothing to do";
};

var stopCommand = function(){
  var pomodoroElement = db.find( item => item.status==STATUS.PAUSED );
  var response = "Nothing to do";
  if(pomodoroElement){      
    pomodoroElement.status = STATUS.CANCELLED;
    response = "Pomodoro stoped";
  }

  pomodoroElement = db.find( item => item.status==STATUS.RUNNING );
  if(pomodoroElement){
    pomodoroElement.status = STATUS.CANCELLED;
    response = "Pomodoro stoped";
  }
  return response;
};

var showCommand = function(){
  var pomodoroElement = db.find( item => item.status==STATUS.RUNNING );
  if(pomodoroElement){
    return "Time remaining:" + calculateRemaining(pomodoroElement);
  }
  return "Nothing to do";   
};

var db = [];
var ticker = setInterval(task,1000);


function processCommand(command){
  console.log(command.action)
  if(command.action === "start"){
    return startOrResumeCommand();
  } else if(command.action === "pause"){
    return pauseCommand();
  } else if(command.action === "stop"){
    return stopCommand();
  } else if(command.action === "show"){
    return showCommand();
  }
}

/** handle POST request */
function postHandler(req, res, reqUrl) {
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    res.writeHead(200);    
    res.write('-> ' + processCommand(JSON.parse(chunk)));
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