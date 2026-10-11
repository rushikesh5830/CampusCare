
# CampusCare 🎓

### Campus Complaint Management System

CampusCare is a web-based complaint management system designed to help students report campus-related issues and track their resolution. Administrators can view complaints, manage their status, and monitor complaint statistics.

## ✨ Features

- 👤 Student registration and login
- 🔐 Session-based authentication
- 📝 Submit campus complaints
- 📋 View and track submitted complaints
- 🔄 Complaint status updates
- 📊 Dashboard with complaint statistics
- 🛠️ Admin panel for complaint management
- 💾 JSON file-based data storage
- 📱 Responsive interface using Bootstrap

## 🧰 Tech Stack

- **Frontend:** HTML, CSS, JavaScript, Bootstrap 5
- **Backend:** Node.js, Express.js
- **Authentication:** Express Session, bcryptjs
- **Data Storage:** JSON files
- **Configuration:** dotenv

## 📁 Project Structure

```text
CampusCare/
├── app.js
├── package.json
├── data/
├── middleware/
├── routes/
├── utils/
└── public/
    ├── images/
    └── js/
```

## ⚙️ Installation and Setup

### Prerequisites

- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/rushikesh5830/CampusCare.git
cd CampusCare
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000
SESSION_SECRET=replace_with_a_long_random_secret
```

Do not commit your `.env` file to GitHub.

### 4. Prepare the data files

Create these files inside the `data/` directory if they do not exist:

- `users.json`
- `complaints.json`
- `updates.json`

Initialize each file with an empty JSON array:

```json
[]
```

The application may require an administrator account to be created or initialized separately.

### 5. Start the application

```bash
npm run dev
```

Open your browser at:

http://localhost:3000

## 🔒 Security Notes

- Passwords are hashed using bcryptjs.
- Authentication uses Express sessions.
- Environment secrets and private data files should not be uploaded.
- Change development credentials before using the application beyond local testing.

## 🚀 Future Enhancements

- Faculty-related complaint management
- Enhanced complaint tracking
- Email notifications
- Complaint filtering and search
- Database integration using MongoDB

## 👨‍💻 Author

**Rushikesh**

---

*CampusCare — Small actions. Better campus.*
