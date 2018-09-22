# blog

## Simple Blog site with express and vue js

This is a project for Hacktiv 8 Coding Bootcamp

## REST API

List of routes

| Route             | HTTP   | Description         |
| ----------------- | ------ | ------------------- |
| `/users/login`    | POST   | Login               |
| `/users/register` | POST   | Register            |
| `/users/auth`     | GET    | User Authentication |
| `/comments`       | POST   | Create Comment      |
| `/comments/:id`   | PUT    | Update Comment      |
| `/comments`       | GET    | Get all Comment     |
| `/comments/Lid`   | DELETE | Delete Comment      |
| `/comments/:id`   | GET    | Get Comment By ID   |
| `/articles`       | POST   | Create Comment      |
| `/articles/:id`   | PUT    | Update Comment      |
| `/articles`       | GET    | Get all Comment     |
| `/articles/Lid`   | DELETE | Delete Comment      |
| `/articles/:id`   | GET    | Get Comment By ID   |

## Usage

With only npm:

```
cd server
npm install
nodemon app.js

cd client
npm install
yarn serve
```

Access from localhost http://localhost:3000 for API/server side and http://localhost:8080 for client side
