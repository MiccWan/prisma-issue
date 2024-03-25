# Prisma Issue #23606

## Description

This repository is a minimal reproduction of a Prisma issue:

When the PostgreSQL runs in a non-UTC timezone, the `$queryRaw` method does not find the correct row with the given timestamp while `findMany` does.

## Steps to reproduce

1. Setup a PostgreSQL database with a testing schema in a non-UTC timezone.
2. Clone this repo and initialize with `yarn install`.
3. Copy `.env.example` to `.env` and fill in the database connection string.
4. Run `npx prisma db push` to create the schema.
5. Run `node index.js`. It will create a record with the timestamp `2023-01-01T00:00:00Z` and try to find the message.
6. See the output. `findMany` returns the correct message, while `$queryRaw` does not.

## Expected behavior

The `PrismaClient.$queryRaw` should find the row with the time `2023-01-01T00:00:00Z`.

## Actual behavior

It does not find the row with the time `2023-01-01T00:00:00Z`, while `findMany` does.

## Additional example

You could try `node timezones.js` to see the timestamp didn't translate correctly.
- It creates records in different timezones and tries to find them with `$queryRaw`.
- The result depends on the timezone of the database.