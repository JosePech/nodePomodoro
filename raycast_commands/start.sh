#!/bin/bash

# Dependency: This script requires `NodePomodooro` downloaded: https://github.com/JosePech/nodePomodoro

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Start
# @raycast.packageName NodePomodoro
# @raycast.mode silent

# Optional parameters:
# @raycast.icon 🍅
# @raycast.description Starts a new Pomodoro or resumes the existing one
# @raycast.argument1 { "type": "text", "optional": true, "placeholder": "25", "percentEncoded": false }

# Documentation:
# @raycast.author Jose Pech
# @raycast.authorURL https://github.com/JosePech

cd /usr/local/bin/nodePomodoro
./startPomodoro $1