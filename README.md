# BNMO PROJECT BACKEND

Steps to run this project on developer mode:

1. Run `npm i` command
2. Run `npm run start:db` command
3. Run `npm start` command

Steps to run this project on production mode:

1. Run `npm run build` command

Technology stack

1. Typescript 4.7.4
2. Express JS 4.17.2
3. Docker 20.10.16
4. MySQL 5.7.10

Endpoint
`/users` => get all users, edit user status
`/transactions` => get all requests, edit requests, create request
`/auth` => login, register, logout
`/history` => get all history of requests and or transfers
`/transfer` => request transfer

Design patern
1. Singleton => Entity Admin in `src/Model/Admin.ts`
2. Facade => In `src/index.ts` App breaks down into several part.

