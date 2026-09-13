 Smart Job Drive Queue Management System

 📌 Project Overview

**Smart Job Drive Queue Management System** is a web application designed to simplify campus placement and bulk hiring drives by replacing long physical queues with a digital queue management system.

Students can register for job drives, receive digital token numbers, track their queue status, see the number of candidates ahead of them, and get an estimated waiting time.

Recruiters or HR administrators can manage the candidate queue, call the next candidate, complete or skip candidates, and monitor queue statistics from a centralized dashboard.

---

 ✨ Features

 👨‍🎓 Candidate Features

* Candidate registration
* Automatic digital token generation
* View current queue status
* Track candidates ahead in the queue
* View estimated waiting time
* Real-time queue updates

 👩‍💼 HR / Admin Features

* View the complete candidate queue
* Call the next candidate
* Mark candidates as completed
* Skip candidates when required
* View queue statistics
* Monitor waiting, serving, completed, and skipped candidates

---

 🛠️ Technologies Used

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Python
* Django
* Django REST Framework
* SQLite

---

 📂 Project Structure

```text
Smart-Job-Drive/
│
├── Frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── Backend/
│   ├── manage.py
│   ├── backend/
│   └── queues/
│
├── Documentation/
│   └── SMART JOB DRIVE QUEUE - Documentation.docx
│
├── .gitignore
└── README.md
```

---

 🔗 API Endpoints

| Method | Endpoint                | Purpose                  |
| ------ | ----------------------- | ------------------------ |
| POST   | `/api/register`         | Register a candidate     |
| GET    | `/api/queue`            | View the candidate queue |
| GET    | `/api/next`             | Call the next candidate  |
| POST   | `/api/complete/<token>` | Complete a candidate     |
| GET    | `/api/stats`            | View queue statistics    |

---

 ▶️ How to Run the Project

### 1. Start the Django Backend

Open PowerShell in the `Backend` folder and activate the virtual environment.

```powershell
python manage.py runserver
```

The backend will run on:

```text
http://127.0.0.1:8000/
```

### 2. Start the Frontend

Open another terminal in the `Frontend` folder and start a local server.

```powershell
python -m http.server 5500
```

Then open:

```text
http://127.0.0.1:5500/
```

---

 📄 Project Documentation

Detailed project documentation is available in the `Documentation` folder:

**SMART JOB DRIVE QUEUE - Documentation.docx**

---

 🎯 Project Objective

The main objective of this project is to reduce waiting time, avoid overcrowding, and provide a more organized and transparent queue management experience during campus placement and bulk hiring drives.

---

 👩‍💻 Developed By

**Shardha Hoddur**

BSc Information Technology
