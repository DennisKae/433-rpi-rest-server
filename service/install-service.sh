#! /bin/sh

echo "Stopping possibly existing services..."
sudo systemctl stop 433-server

echo "Copying the service file..."
sudo cp 433-server.service /etc/systemd/system/433-server.service

echo "Reloading the systemctl daemon..."
sudo systemctl daemon-reload

echo "Starting the service..."
sudo systemctl start 433-server

echo "Showing status information about the service..."
sleep 2s
sudo systemctl status 433-server