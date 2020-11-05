# Interview Scheduler
A React application that allows users to book and cancel interviewers with an interviewer of their choice. A concise API together with a WebSocket server enables users to have a real-time experience. The API server has been deployed using Heroku, and the client is deployed on Netlify.

The backend was built using Node.js and Express in combination with PostgreSQL.

The live site can be viewed [here](https://amazing-engelbart-5c8395.netlify.app/). Please note that the app may contain empty data on the first load as the Heroku server is configured to sleep after 30 minutes of inactivity.

## Final Product

### Booking an interview
!["Booking an interview"](https://github.com/shadeemerhi/scheduler/blob/master/docs/booking-appt.gif)

### Editing an interview
!["Editing an interview"](https://github.com/shadeemerhi/scheduler/blob/master/docs/editing-appt.gif)

### Cancelling an interview
!["Cancelling an interview"](https://github.com/shadeemerhi/scheduler/blob/master/docs/deleting-appt.gif)

### Empty field error
!["Empty field error"](https://github.com/shadeemerhi/scheduler/blob/master/docs/error-empty.gif)

### Booking with multiple clients with WebSocket
!["Booking with multiple clients with WebSocket"](https://github.com/shadeemerhi/scheduler/blob/master/docs/ws-book.gif)

### Editing with multiple clients with WebSocket
!["Editing with multiple clients with WebSocket"](https://github.com/shadeemerhi/scheduler/blob/master/docs/ws-edit.gif)

## Dependencies

- React
- Axios
- Express
- node-postgres
- websockets/ws
- dotenv
- body-parser
- cors

## Dev Dependencies

- React Testing Library
- Jest
- Cypress
- Storybook
- jest-websocket-mock

## Setup

Install dependencies with `npm install`.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Cypress Test Framework

```sh
npm run cypress
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
