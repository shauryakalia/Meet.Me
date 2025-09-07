## Meet.Me

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

* [Node.js 10.X](https://nodejs.org/en/download/)
* [PostgreSql](https://www.postgresql.org/download/)

## Database Setup

Create a user meetme: 
`createuser meetme`

Login into postgres as postgres user:
`sudo -i -u postgres psql`

Set password for meetme user:
`\password meetme`

Create Database:
`CREATE DATABASE meetme;`

Grant privileges to meetme:
`GRANT ALL PRIVILEGES ON DATABASE meetme TO meetme;`

Go to backend folder and Run database migrations:
`npm run db-migrate`

Go to backend folder and populate database seeds:
`npm run run-seeds`

## Mailer env setup
`echo "export MAILERSEND_API_KEY='{{ KEY }}'" > mailersend.env`
`echo "mailersend.env" >> .gitignore`
`source ./mailersend.env`


## Start Server

Start the development server:
`npm start`
Start the server in debug mode:
`npm run debug`

Server is running at http://localhost:5000
For Swagger documentation, go to http://localhost:5000/api-docs
