# BOARDS
## Storing and managing the boards
This microservice provides the ability to add/remove and list boards along with the items in the boards. It stores the data in a MongoDB.

## API Documentation
The API has been visually designed via [Apicurio][1], it's based on the OpenAPI Specification. The item type is our main data class and it can be grouped via the board datatype.

## Developer instructions

### Env Vars
* TBD

### Local Installation / Run / Test
```bash
$ npm install
```

#### Running locally
Start the service:
```bash
$ npm start
```

### Running on OpenShift
```bash
TBD
```

### Developer Tips
MongoDB is being accessed via a thin helper library on top called monk. [Read how to use it here][2].

[1]: https://www.apicur.io/
[2]: https://automattic.github.io/monk/