<h1>NestJS REST API With Typescript Prisma Postgresql Railway</h1>

<h2>A fully functional Event project written in NestJS showing how to create a REST API and deploy to Railway!</h2>


<p>This project is an events project that was developed alongside Nest Documentation and a YouTube series demonstrating how to create a custom REST API in NestJS. It was collaboratively built with @Walid (Frontend part with Vanilla JS) to facilitate AdaTechSchool students in organizing various events such as study sessions, movie screenings, and more. Every section of this project illustrates how to accomplish the following:</p>
<ul>
  <li>Create a custom web server with NestJS using Express</li>
  <li>Connect Prisma to a PostgreSQL database server</li>
  <li>Define models in Prisma Schema using Prisma</li>
  <li>Perform CRUD operations with the generated Prisma API</li>
  <li>Utilize Guards, Pipes, Interceptor, and DTOs in Nestjs</li>
  <li>Hash your passwords with NestJS using Bcrypt</li>
  <li>Enhance your Authentification with NestJS using JsonWebToken</li>
  <li>Manage images with Nest using Cloudinary</li>
  <li>Implement a chat feature with NestJS using Websockets</li>
  <li>Document your API with Nest using Swagger</li>
</ul>

## How to install this project

```bash
$ git clone git@github.com:hkonate/Social-Gather.git
$ npm install
$ npm install prisma --save-dev
$ npx prisma db push
$ npx prisma studio
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## How to tweak this project for your own uses

Since this is an simple Events project, I'd encourage you to clone and rename this project to use for your own puposes. It's a good starter boilerplate

## Find a bug?

If you found an issue or would like to submit an improvement to this project, please submit an issue using the issues tab above. If you would like to submit a PR with a fix, reference the issue you created!

## Known issues (Work in progress)

This project is till ongoing, you may encounter some issue with chat endpoints. In addition, handle images in chat has not been completed yet. This is coming soon!

## Contributors
Marius Espejo https://www.youtube.com/watch?v=atbdpX4CViM

## Like this project?

If you are feeling generous, buy me a coffee! - https://www.buymeacoffee.com/hkonate
