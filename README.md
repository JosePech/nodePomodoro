# Welcome to NodePomodoro!

NodePomodoro is a simple **NodeJS** script that launches an Http endpoint that allows you to do the Pomodoro technique and be notified when you need to take a break. It is run locally, no data is shared or sent anywhere.


# Requirements

- NodeJS v16+
- Curl CLI
- UI notifications are written for OS X.

## Usage
Bash scripts are provided to ease the use of the application.

To start a new pomodoro run from the terminal:  **./startPomodoro**  
This script will launch the NodeJS Http server (listens on port 55000) if it is not running yet. Also will resume a paused comodoro.

To pause the current pomodoro run from the terminal: **./pausePomodoro**
this will capture the remaining time.

To show the remaining time in seconds run from the terminal: **./showPomodoro**

To cancel the current pomodoro run from the terminal: **./stopPomodoro**
Cancelled pomodoros does not count towards break time calculation.

For convenience to stop the NodeJS server you can run: **./stopServer**

All record of completed pomodoros is kept in a in-memory array, when you stop the server all records are lost.

## Break times

Every pomodoro the break is for 5 minutes. After 4 pomodoros the break is set for 15 minutes.