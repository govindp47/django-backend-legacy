
# 📘 Django Backend Legacy — Bhagwad Gita Learning Platform

This is a personal learning project I built in 2023, when I was learning **Django, HTML, CSS, and JavaScript**.  
At the time, tools like ChatGPT were not widely used or part of my workflow — everything here was written based on my own understanding, documentation, and experimentation.

The repository was created later to preserve the work, document what I learned, and reflect on my early backend and full-stack journey.

The project is centered around the **Bhagwad Gita**, a deeply meaningful spiritual text, and explores how structured content, users, and interactions can be built using Django.

---

## 🎯 Motivation Behind the Project

The goal was not to build a perfect or production-ready platform.

Instead, the goal was to:

- Learn Django by building something end-to-end
- Work with real, structured data (700 shlokas across 18 chapters)
- Understand how users interact with content
- Combine backend logic with frontend behavior and UI decisions

This project represents hands-on learning, not a tutorial clone.

---

## 🗂️ Project Timeline

### Apr–Jun 2023 — Initial Development

- Designed and developed the core Django backend as a learning project
- Implemented Django Admin for basic content management
- Built REST-style APIs using Django REST Framework
- Added ImageField-based models with Pillow for media handling
- Implemented user authentication, profiles, and role-based access
- Integrated media uploads and basic user interactions

### 2026 — Project Revival & Cleanup

- Revived the legacy project and set it up on a modern environment
- Recreated the virtual environment and resolved dependency issues
- Added a clean and reproducible `requirements.txt`
- Initialized Git version control and published the project to GitHub
- Removed hardcoded secrets and moved configuration to environment variables
- Added documentation, cleanup, and basic security fixes

---

## 👤 User Authentication & Profiles

- Users can sign up or log in using Google authentication
- Each user can create and manage a personal profile with:
  - Name
  - Email
  - Social media links
- Certain users can be granted administrative access

### What I learned here

- Django authentication flow
- Social login integration
- Designing user vs admin roles
- Separating profile data from core auth models

---

## 📖 Feature 1 — Shlokas Viewer (Core Feature)

This is the heart of the application.

The platform displays all **700 shlokas of the Bhagwad Gita**, along with explanations, in a slide-based viewer.

### Functional highlights

- Navigate shlokas chapter-wise and verse-wise
- Jump directly to a specific chapter or shloka
- Next / previous navigation
- Slider to move forward or backward
- Maximize and minimize viewing area
- Like and comment on shlokas
- Download shlokas as PDF or ZIP

### Design & UI thinking

- The viewing experience was inspired by media players like YouTube
- Focus was on distraction-free reading
- Controls were grouped logically to reduce cognitive load
- Navigation was designed to feel continuous, not page-based

### What this taught me

- Structuring large datasets for UI consumption
- Designing navigation for non-linear content
- Coordinating backend data with frontend state
- Handling user interactions beyond simple CRUD

---

## 🧠 Feature 2 — Quiz System

The quiz system allows users to test their understanding of Bhagwad Gita concepts.

### Capabilities

- Users can attempt quizzes
- Admin users can:
  - Create quizzes
  - Define questions and answer formats
  - Publish quizzes for others

### Supported question types

- Multiple choice
- Integer answers
- Fill-in-the-blanks
- Free-text / descriptive answers

### What I learned here

- Designing flexible data models
- Handling multiple input types
- Evaluating user responses
- Building admin-controlled content systems

This feature helped me understand how data modeling decisions affect UX and extensibility.

---

## 🏡 Home, Navigation & Footer

The home section acts as an entry point and content hub:

- Leads users to shlokas, quizzes, and announcements
- Keeps navigation simple and predictable

The footer includes:

- Contact information
- Social media links of the site owner

This reinforced the idea that even small details contribute to overall usability.

---

## 🛠️ Technical Stack

- Python
- Django
- Django REST Framework
- HTML, CSS, JavaScript
- SQLite (development)
- Pillow (image handling)

---

## 🧪 Testing, Stability & Scope

This project was tested lightly during development and worked as expected for basic usage.  
However, it was not stress-tested or optimized for large-scale traffic.

This was intentional — the focus was learning and building, not scaling.

---

## 🌱 What This Project Represents

This project shows:

- How I approached learning backend development
- My willingness to build something meaningful instead of toy examples
- Early design thinking, even with limited experience
- Comfort working across backend, frontend, and UI concerns

It is basic, but it is honest, and it reflects real growth.

---

## 📌 Final Note

This repository is not meant to impress with complexity.  
It exists to show how learning happened, how ideas were implemented, and how real skills were built over time.

---

## 👤 Author

**Govind Patidar**
