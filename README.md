# Marina Russell - Catways Reservation Management

## What's this project for?

The main purpose of this project is to create a working API for the fictional company "Marina Russell" in order to let them manage the reservation of their catways.  
The main goal is to practice using the **Express** framework and improve my web development skills including **HTML, CSS, JavaScript**, as well as the integration of other frameworks and libraries.

---

## Prerequisites

To run this project locally or prepare for hosting, you will need:

- **Node.js** (version 18 or later recommended)
- **npm** (comes with Node.js)
- **MongoDB** database (local installation or cloud instance, e.g., [MongoDB Atlas](https://www.mongodb.com/atlas))
- Internet browser for the frontend interface
- Optional: Git for cloning the repository

> ⚠️ For hosting, the project can be deployed on platforms like **Heroku, Render, or Railway**.  
> - Make sure the MongoDB database is accessible to the hosting platform.  
> - Set the required environment variables:  
>   - `MONGODB_URI` → Connection string to your MongoDB database  
>   - `SECRET_KEY` → A string used for JWT authentication, e.g., `GTGh6rdP54GT76`  

---

## Get Started

### Importing Sample Data

To get started with the API, you can import the provided sample data into your local MongoDB instance:

```bash
mongoimport --db marina_russell --collection users --file data/users.json --jsonArray
mongoimport --db marina_russell --collection catways --file data/catways.json --jsonArray
mongoimport --db marina_russell --collection reservations --file data/reservations.json --jsonArray
```
Or import them directly in your MongoDB database with the **"Add Data"** button > **"Import JSON or CSV File"**

The data folder contain all the json files you'll need.

> After importing, the database will contain the sample users, catways and reservations used in this project.
> You'll need it to be able to login in the database with the given accounts below.

### Running Locally

1. Clone the repository:
```bash
git clone https://github.com/yourusername/marina-russell.git
cd marina-russell
```
2. Install dependencies :
```bash
npm install
```
3. Set up environment variables (create a `.env` file in the root):
```.env
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key
PORT=3000
```
4. Start the application:
```bash
npm start
```
5. Open your browser and go to:
```arduino
http://localhost:3000
```

---

### Default User Accounts

Use these accounts to test different roles and access levels.

#### Administrator
- **Username:** Molière
- **Email:** moliere@jbp.com
- **Password:** NewPassword123

#### Regular user
- **Username:** TestUser
- **Email:** testuser@test.com
- **Password:** password123456

> **Role differences:**
> - "Administrators" can add, modify and delete catways, reservations en users.
> - "Regular users" can only add reservations and see informations about a specific catway, reservation or user.


---

### Main Features
- Manage catways (get, create, update, delete) - Admin: full control; Regular users: limited to get
- Manage reservations (get, create, update, delete) - Admin: full control, Regular users: limited to get and add
- Manage users (get, create, update, delete) - Admin: full control (except delete his own account); Regular users: limited to get
- Search and filter tables for faster data access
- Responsive frontend using **Bootstrap 5**
- Role-based access control (JWT authentication)

---

### Documentation

Detailed documentation of the API, services, controllers and frontend utilities is available via JSDoc:
```swift
public/docs/index.html
```
Open the file in a browser to explore modules, classes and methods.
Or just click on the "Documentation" link in the navbar of the project (always accessible, even if you're connected or not).

---

## Technologies Used
- **Node.js** + **Express** for the backend
- **MongoDB** + **Mongoose** for database management
- **HTML5 / CSS3 / JavaScript** for frontend
- **Bootstrap 5** for styling and responsive desing
- **JSDoc** for code documentation
- **JWT** for authentication

### Deployment Notes
- Ensure your MongoDB instance is reachable from the hosting environment. If you want to deploy on MongoDB Atlas, you'll need to create your own database and import the JSON files given in the data folder.
- Set all environment variables correctly (especially MONGODB_URI and SECRET_KEY).
- Test the application with the default accounts to verify role-based access.

---

## Contact / Support

For any issues, please contact the project owner or open an issue on GitHub.
