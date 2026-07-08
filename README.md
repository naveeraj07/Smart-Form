# Smart-Form

A robust MERN-stack smart form builder application that allows users to seamlessly create custom forms, share public links to gather responses, and analyze submitted data through an intuitive dashboard.

---

## 🚀 Features

- ✨ **Custom Form Builder** – Create and customize forms with different input fields.
- 🔗 **Public Form Sharing** – Generate unique shareable links to collect responses.
- 📊 **Response Dashboard** – View and analyze submitted responses in real time.
- 🔐 **Secure Authentication** – User signup and login with JWT authentication.
- 📱 **Responsive UI** – Modern and user-friendly interface that works across devices.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript (ES6+)

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Authentication
- JSON Web Token (JWT)
- bcrypt

---

## 📦 Installation & Setup

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB (Local or MongoDB Atlas)

---

### 1. Clone the Repository

```bash
git clone https://github.com/naveeraj07/Smart-Form.git
cd Smart-Form
```

---

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
npm start
```

---

### 3. Frontend Setup

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm start
```

---

## 📂 Project Structure

```text
Smart-Form/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── App.js
│   └── package.json
│
├── README.md
└── package.json
```

---

## 📸 Screenshots

You can add screenshots here.

```text
Home Page

Form Builder

Response Dashboard

Login Page
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/AmazingFeature
```

3. Commit your changes.

```bash
git commit -m "Add some AmazingFeature"
```

4. Push the branch.

```bash
git push origin feature/AmazingFeature
```

5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

See the `LICENSE` file for more information.

---

## 👨‍💻 Author

**Naveenraj R**

- GitHub: https://github.com/naveeraj07
