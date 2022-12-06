# Backend Challenge

## Description

This app is using PostgreSQL for Database and yarn as package manager.

## Assumptions & Comments

- The solution is architected to store common values on database, for example: Countries, Same IP Trace. So if someone make the same requests with a gap of a few seconds, we only need to go one time to the provider.  
- For currencies, I'm saving values for a fixed (configurable) amount on minutes.
- The model supports country with multi-currency, but because ip-api return only the official currency for a given country, I only get that value.
- In a real world scenario, it's preferable to add a first layer of cache on something like redis. 

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start
```

## Test

```bash
# unit tests (only one in this case)
$ yarn test

# e2e tests (both REST endpoints)
$ yarn test:e2e
```
