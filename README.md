# CoopDone – Co-op Application Tracker

CoopDone is a personal co-op and internship application tracking web application designed to help students stay organized, consistent, and focused throughout the job application process.

It provides a clean dashboard, visual insights, CSV import/export, dark mode, and a complete CRUD workflow, all running fully client-side using modern JavaScript.

---

## Features

### Dashboard

* Total applications count
* Applications by status (Applied, In Process, Interview, Offer, Rejected)
* Weekly application tracking
* Co-op day counter based on start and end dates
* Visual summary using Chart.js

### Application Management (CRUD)

* Add, edit, view, and delete applications
* Track company, role, type, deadlines, confidence level, links, and notes
* Expandable row details for a clean interface

### Visual Insights

* Pie chart showing application status distribution
* Color-coded status badges for quick scanning

### Dark Mode

* One-click dark mode toggle
* Preference saved in localStorage
* Fully styled dark theme

### CSV Import and Export

* Export all applications to a CSV file
* Import applications from a CSV file
* Useful for backups and bulk updates

### Persistent Storage

* Uses browser localStorage
* No backend required
* Data persists across refreshes

### Daily Motivation

* Rotating daily motivational message
* Encourages consistency during the application process

---

## Tech Stack

* HTML5 – semantic structure
* CSS3 – custom design system, responsive layout, dark mode
* Vanilla JavaScript (ES6) – application logic
* Chart.js (via CDN) – data visualization
* Browser localStorage – persistence
* Git and GitHub – version control

---

## Project Structure

```
CoopDone/
│
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── README.md
```

---

## How It Works

* Applications are stored as JavaScript objects in localStorage
* The dashboard and charts update dynamically on every change
* CSV export converts stored data into a downloadable file
* CSV import parses and restores data into the application
* Dark mode toggles a `body.dark` class and persists the preference
* The co-op day counter calculates remaining days based on the selected end date

---

## How to Run Locally

1. Clone the repository:

```bash
git clone https://github.com/<your-username>/coopdone.git
```

2. Navigate to the project folder:

```bash
cd coopdone
```

3. Open `index.html` in your browser
   (No server or build step required)

---

## Use Cases

* Tracking co-op and internship applications
* Organizing job search activities
* Managing preparation and resume links
* Exporting application data for reporting or backup
* Portfolio project for students and early-career developers

---

## Screenshots

Add screenshots here after pushing the project:

* Dashboard view
* Applications table
* Dark mode view
* Status chart

---

## Future Enhancements

* Search and filter functionality
* Deadline reminders and alerts
* Analytics by company or role
* Cloud-based backend storage
* Authentication
* Progressive Web App (PWA) support

---

## Author

Dipesh Raj Joshi
Master of Applied Computing, University of Windsor
Focus areas: Software Development, Cloud, and DevOps

---

## License

This project is intended for educational and personal use.

---

## Notes

This project demonstrates:

* Practical frontend application architecture
* Real-world use of JavaScript
* Strong focus on usability and UI consistency
* End-to-end feature ownership


