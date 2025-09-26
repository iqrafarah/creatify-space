# Creatify Space

## Description

Creatify Space is a web-based platform that allows users to generate a professional online portfolio using their existing LinkedIn data. With just a PDF upload or pasted text, users can publish a personal portfolio hosted at a unique URL (e.g. `localhost:3000/username`). 

This project aims to lower the barrier for professionals, students, and freelancers to build a portfolio without design or coding skills. It combines automation with customization, allowing each user to personalize the look and feel of their portfolio via an intuitive dashboard.

---

## Key Features

- **Magic Link Login**  
  Simple, secure authentication with email only.

- **LinkedIn Import**  
  Upload a PDF or paste your LinkedIn content to auto-generate your profile.

- **Editable Dashboard**  
  Customize your profile, skills, experience, and appearance in real-time.

- **Responsive Design**  
  Optimized for mobile, tablet, and desktop.

- **One-Click Publishing**  
  Instantly deploy your portfolio to a live, shareable link.

- **Clean UI & Notifications**  
  Simple design with real-time toast feedback for actions.

---

## Target Audience

- Students and graduates
- Job seekers and career switchers
- Freelancers and solopreneurs
- Creatives or developers with no time to design

---

## Tech Stack

| Layer         | Stack                             |
|---------------|-----------------------------------|
| Frontend      | Next.js (App Router), Tailwind CSS |
| Backend       | Next.js API Routes                |
| Auth          | Magic link with email             |
| Database      | PostgreSQL + Prisma ORM           |
| PDF Parsing   | `pdf-parse` npm package           |


---

## Setup Instructions

### Prerequisites
- Node.js
- PostgreSQL
- Vercel account (optional for deployment)

### Installation

```bash
git clone https://github.com/iqrafarah/creatify-space.git
cd creatify-space
npm install
