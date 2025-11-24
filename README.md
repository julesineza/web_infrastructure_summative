# Pill Assist – Medicine Information Viewer

Pill Assist is a lightweight, static web application that retrieves drug information from the U.S. FDA open data API. It enables users to quickly access official drug labeling details, including indications, warnings, dosage information, and side effects.

---

## Overview

Pill Assist is entirely client-side and relies on the openFDA Drug Label API to provide reliable public data on prescription and over-the-counter medicines. The application requires only a web browser and an internet connection. Axios is used for handling API requests.

---

## Features

- Search for medicines by brand or generic name
- Live data retrieval from the openFDA API
- Collapsible sections for long FDA text fields
- Warning indicator based on safety information
- Internal search for matching text within displayed drug content
- Loading skeleton while fetching data
- Graceful error handling with clear UI messages
- Fully static front-end application with no backend

---

## Project Structure

pill-assit/
│── index.html
│── style.css
│── script.js
└── README.md

yaml
Copy code

---

## Running Locally

This project is a static web application.

1. Download or clone the repository.
2. Open the file `index.html` directly in a modern web browser.
3. Ensure you have internet access so the app can fetch data from:

https://api.fda.gov/drug/label.json

yaml
Copy code

No backend or server setup is required.

---

## Deployment Guide (Ubuntu + Nginx)
To assess the website from the load balancer visit : http://34.207.164.36
The application was deployed to two Ubuntu servers using Nginx:

| Server | Role                    | IP Address     |
| ------ | ----------------------- | -------------- |
| web-01 | Application Server      | 44.201.180.250 |
| web-02 | Application Server      | 54.208.88.137  |
| lb-01  | Load Balancer (HAProxy) | 34.207.164.36  |

### 1. Connect to Each Server

ssh ubuntu@44.201.180.250
ssh ubuntu@54.208.88.137

shell
Copy code

### 2. Install Nginx

sudo apt update
sudo apt install nginx -y

shell
Copy code

### 3. Upload the Project Folder

Upload the `pill-assit` folder to the server.

### 4. Move the Folder to the Web Root

sudo mv pill-assit /var/www/html/

shell
Copy code

### 5. Configure Nginx

sudo nano /etc/nginx/sites-available/default

pgsql
Copy code

Set the root path:

root /var/www/html/pill-assit;

csharp
Copy code

Ensure the index is set:

index index.html;

shell
Copy code

### 6. Restart Nginx

sudo systemctl restart nginx

yaml
Copy code

Both servers now serve the application.

---

## Load Balancer Setup (HAProxy)

The load balancer uses HAProxy with a round-robin strategy.

### 1. Install HAProxy

sudo apt update
sudo apt install haproxy -y

shell
Copy code

### 2. Edit the Configuration File

sudo nano /etc/haproxy/haproxy.cfg

shell
Copy code

### Example Configuration

frontend http_front
bind \*:80
default_backend web_servers

backend web_servers
balance roundrobin
server web01 44.201.180.250:80 check
server web02 54.208.88.137:80 check

shell
Copy code

### 3. Restart HAProxy

sudo systemctl restart haproxy

csharp
Copy code

Your application is now accessible through the load balancer at:

http://34.207.164.36

yaml
Copy code

---

## API Used

### openFDA Drug Label API

Used to retrieve:

- Description
- Warnings
- Dosage
- Side effects
- Drug interactions

**Endpoint:**  
https://api.fda.gov/drug/label.json

yaml
Copy code

**Documentation:**  
https://open.fda.gov/apis/drug/label/

---

## Libraries Used

### Axios (CDN)

Used for HTTP requests.  
Documentation: https://axios-http.com/

### Vanilla JavaScript and browser DOM APIs

Used for UI rendering and interactive components.

---

## Challenges and Solutions

### Long FDA Text Fields

The API returns large, unformatted text blocks.  
**Solution:** Collapsible sections and show-more toggles.

### Error Handling

Blank pages or browser alerts occurred during early development.  
**Solution:** Implemented structured UI-based error messages.

### Nginx Configuration Issues

The wrong root directory was initially served.  
**Solution:** Updated the Nginx `root` directive to point to `/var/www/html/pill-assit`.

### Load Balancer Health Checks

HAProxy needed to validate both back-end servers.  
**Solution:** Added the `check` parameter in the backend server definitions.

---

## Credits

- openFDA API
- Axios
- Nginx
- HAProxy
- Ubuntu Linux

---

## Medical Disclaimer

This application is for informational and educational purposes only.  
It does not provide medical advice, diagnosis, or treatment.  
Drug information may be incomplete or outdated.  
Always consult a licensed healthcare professional before making decisions about medication.
