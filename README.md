# Tasks management (To-Do list)

Tasks management made with [Express](https://expressjs.com/) for the backend and [React](https://es.reactjs.org/) for the frontend plus Material UI [(MUI)](https://mui.com/) for UI layout.
Without databases, information stores locally in server and hasn't persistency. It comes with 3 tasks included by default.

### Third-party packages used
- [NotiStack](https://notistack.com/).
- [Nodemon](https://nodemon.io/).
- [Cors](https://www.npmjs.com/package/cors).
- [Morgan](https://www.npmjs.com/package/morgan).
- [Moment](https://momentjs.com/).
- [Axios](https://axios-http.com/es/docs/intro).

## Install Project

### Requirements
- Node.js -> Make sure you have [Node.js](https://nodejs.org/en/) installed on your computer.
- Git -> In order to clone the project on your computer, you will need [Git](https://git-scm.com/downloads).

### Instructions
- Clone the project on your computer.
- Go to the root directory of the project and run the following command:

```
$ npm install
```

### Server side

To start the local server, while in the root of the project, run the following command:
```
npm run dev
```
This command will start the server on port 4000 by default, but can be changed by modifying the "config.js" file inside the "server" folder.

### Client side

To start the client side, you must position yourself in the console inside the "client" directory, and execute the following command::
```
npm install
```
Then, run the following command and you will be able to access through the browser via the path http://localhost:5173.
```
npm run dev
```
