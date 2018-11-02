# CONTEXT-SCRAPER
## Automatic digging through items to find contextual matches 
This microservice provides the ability to analyize the board items to find contextual matches. These contextual matches can be other board items or things scraped from trusted internet sources.

## Development instructions
### Local Installation / Run / Test
```bash
$ npm install
```

#### Running the app
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# incremental rebuild (webpack)
$ npm run webpack
$ npm run start:hmr

# production mode
$ npm run start:prod
```

#### Testing
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### OpenShift Installation / Run / Test
TBD