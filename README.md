# Nobleledger 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli)

## Development server

Run `make start` for a dev server. Navigate to `http://localhost:43201/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `make build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `make test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `make e2e` to execute the end-to-end tests via a platform of your choice.  To use this command, you need to first add a package that implements end-to-end testing capabilities.

psql "sslmode=verify-ca sslrootcert=server-ca.pem sslcert=client-cert.pem sslkey=client-key.pem hostaddr=34.46.82.226 port=5432 user=postgres dbname=postgres"