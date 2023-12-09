🎅🎁🎄 **Secret Santa** 🎄🎁🎅

## Introduction
Welcome to **Secret Santa**, a web application that allows you to organize a Secret Santa gift exchange with your friends, family, or colleagues. The application is built using TypeScript with Next.js framework, nodemailer, Ant Design, Tailwind, Prisma ORM, and TRPC.
The structure of the application was bootstrapped with `create-t3-app`.

## Features
- Create a group and add a list of people and their emails.
- The application matches the people and emails them secretly to tell them who they will be getting a gift for.
- Members of the group can upload hints for their Secret Santa.
- The Secret Santa is notified by email when their receiver uploads hints of want.

## Live Website
You can access the live website at [santa.maravian.com](https://santa.maravian.com).

## Installation
1. Clone the repository.
2. Setup the environment variables for you database and SMTP credentials for email functionality renaming the .env.example to .env and filling the values
2. Install the dependencies using `yarn install`.
3. Updating the database with the schema `yarn db:push`.
4. Run the application using `yarn dev`.

## Usage
1. Create a group and add a list of people and their emails.
2. The application randomly matches the people and emails them secretly to tell them who they will be getting a gift for.
3. Members of the group can upload hints for their Secret Santa.
4. The Secret Santa is notified by email when a member of the group uploads their hints.

## Note
1. If the types of the values depending the database suddenly go missing or invalid, run `npx prisma generate` to make/update the types from the schema and db.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Acknowledgements
- [Next.js](https://nextjs.org/)
- [Prisma ORM](https://www.prisma.io/)
- [TRPC](https://trpc.io/)
- [Create T3 App](https://create.t3.gg/)

🎁🎄🎅 Happy Holidays! 🎅🎄🎁