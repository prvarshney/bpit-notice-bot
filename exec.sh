#! /bin/bash

clear;
tmux new-session -s notice-bot "node index.js" \; \
                    split-window "glances" \; \
                    select-layout even-horizontal \;