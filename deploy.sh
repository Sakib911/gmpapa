#!/bin/bash

# Set working directory
cd /home/gmpapa/htdocs/gmpapa.com

# Ensure correct permissions
sudo chown -R gmpapa:gmpapa .
sudo chmod -R 755 .

# Install dependencies
npm install

# Build the application
npm run build

# Stop existing PM2 process
pm2 stop gmpapa || true
pm2 delete gmpapa || true

# Start the application with PM2
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Configure Nginx
sudo cp nginx.conf /etc/nginx/sites-available/gmpapa.com
sudo ln -sf /etc/nginx/sites-available/gmpapa.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Set up SSL with Let's Encrypt
sudo certbot --nginx -d gmpapa.com -d www.gmpapa.com

echo "Deployment complete!"