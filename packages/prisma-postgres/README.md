Navigate into the project directory and (if you haven't done so via the CLI wizard) install dependencies:

```terminal
cd prisma-postgres
pnpm install
```

### Set database connection 

The connection to your database is configured via environment variables in a `.env` file either here or in server

First, rename the existing `.env.example` file to just `.env` (there should be one in server)

```terminal
mv .env.example .env
```

Then, find your database credentials in the **Set up database access** section, copy the `DATABASE_URL` environment variable and paste them into the `.env` file.

For reference, the file should now look similar to this:

```bash
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=ey...."
```

### Create database tables (with a schema migration)

Next, you need to create the tables in your database. You can do this by creating and executing a schema migration with the following command of the Prisma CLI:

```terminal
npx prisma migrate dev --name init
```
OR

```
pnpm run migrate-dev
```

after that run 

```
pnpm run migrate
```

This will setup the tables / run the migrations

### Prisma Studio

Use Prisma Studio to explore what records have been created in the database:

```terminal
npx prisma studio
```