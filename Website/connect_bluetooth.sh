#!/bin/sh

sudo systemctl restart bluetooth.service
echo -e 'connect 78:44:05:9F:69:C1' | sudo bluetoothctl
