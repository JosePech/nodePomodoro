#!/bin/bash

# Dependency: This script requires `NodePomodooro` downloaded: https://github.com/JosePech/nodePomodoro

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Pause
# @raycast.packageName NodePomodoro
# @raycast.mode silent

# Optional parameters:
# @raycast.icon 🍅
# @raycast.description Pauses the active Pomodoro

# Documentation:
# @raycast.author Jose Pech
# @raycast.authorURL https://github.com/JosePech

cd /usr/local/bin/nodePomodoro
./pausePomodoro