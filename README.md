# InvestDay platform

This is a fictitious trading platform for the InvestDay contest organized by the IsepInvest association.
It is possible to buy and sell stocks and cryptocurrencies with the real rates of the US market.
- Front-end and back-end made in NextJs
- Database made with Prisma and PostgreSql

This repo is the new version for the second edition of the InvestDay contest.

![trade](https://github.com/TugdualDek/InvestDay/assets/35851118/f0ecf210-5154-4534-8441-72fc93bd1fa2)

## Prerequisites

Docker with compose plugin, npm.

## Installation

```bash
npm install
npm run build-dev
sudo docker exec -it [investday-next container id] npx prisma migrate dev
sudo docker exec -it [investday-next container id] npx prisma db push
```
You will then need to fill the .env file with your own values. You can use the .env.example file as a template.

 ## Usage
 ```bash
 npm run launch-dev
```
Open [http://localhost:3000](http://localhost:3000) to see the app.

Open [http://localhost:5555](http://localhost:555) to see prisma studio.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Authors

- [Hippolyte Bach](https://github.com/HipppB)
- [Tugdual Audren de Kerdrel](https://www.github.com/TugdualDek)

## Thanks

Special thanks to GarageISEP for their hosting services !
