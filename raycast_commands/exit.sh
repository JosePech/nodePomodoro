#!/bin/bash

# Dependency: This script requires `NodePomodooro` downloaded: https://github.com/JosePech/nodePomodoro

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Resume
# @raycast.packageName NodePomodoro
# @raycast.mode silent

# Optional parameters:
# @raycast.icon 🍅
# @raycast.description Exits the app

# Documentation:
# @raycast.author Jose Pech
# @raycast.authorURL https://github.com/JosePech

cd /usr/local/bin/nodePomodoro
./stopServer