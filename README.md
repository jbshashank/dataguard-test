# Dataguard test
This template can be used for creating services that expose a rest interface. It is a bootstrap project to keep the codebases in different Getir components consistent. It aims to promote well separated layers of responsibilities, testable coding, documentation, good development practices (custom errors & events, lint, input validation etc.).

The same methodologies used in this template, can be find within other templates such as lambda and consumers. The only part that should be changed is the interface that exposes the inner services. In this rest api example, this is the [./src/server](./src/server) folder.

## Environment Variables
Below are the environment variables used by the application, and what they mean.

- **`NAME`** the application name. Default: `name` in [`package.json`](./package.json).
- **`VERSION`** the application version. It's automatically set by deployment script as the deploy tag. Default: `version` in [`package.json`](./package.json).
- **`NODE_ENV`** the environment the application will be running in. Default: `dev`.
- **`SERVER_PORT`** or **`PORT`** the port the application will be running on. Default: `8080`.
- **`SERVER_KEEP_ALIVE_TIMEOUT`** the keep alive timeout. Default: `120000` (2 mins).
- **`SERVER_RETURN_VALIDATION_INFO_ERROR`** whether to return verbose information to client on invalid request/response schema. Default: `true` for `dev`, `false` for else.
- **`MONGODB_URL`** the connection string to MongoDB. 
- **`MONGODB_POOL_SIZE`** the number of DB connections to maintain. 
- **`MONGODB_SERVER_SELECTION_TIMEOUT`** the time MongoDB try server selection for. 


## Technologies
- Node.js (14.17.2)
- Hapi
- Mongoose (5.x)
- Eslint
- Awilix for DI
- Winston for logging
- Jest for testing
- Joi, Swagger, Hapi Swagger for Input Validation & Documentation
- Ramda for Functional Programming

## Structure
Below is the project structure and what are the responsibilities of each layer.
```
./__tests__                       # jest tests
├── integration                   # integration tests
├── mocks                         # mocks
│   ├── bootstrap                 # bootstrap mocks
│   └── data-access               # data-access mocks
└── helper.js                     # helper to bootstrap test environment

./bin                             # scripts
└── index.js                      # entrypoint for the app

./src                             # source code
├── bootstrap                     # bootstrap
│   ├── modules                   # bootstrap modules
│   │   ├── events.js             # events bootstrap module
│   │   ├── mongoose.js           # mongoose bootstrap module
│   ├── container.js              # container setup
│   ├── index.js                  # bootstrap function
│   └── utils.js                  # utils for container
├── config                        # app config
│   ├── environments              # environment related configs
│   ├── default.js                # default config
│   └── index.js                  # globally exposed config
├── constants                     # magic constant values used, not connected to environment, version controller
│   ├── error-messages.js         # globally exposed error messages
│   └── index.js                  # globally exposed contants
├── data-access                   # dao layer, aimed to be database agnostic
├── errors                        # custom errors for different business logic errors
│   ├── generic                   # definition of generic error classes
│   │   └── index.js              # globally exposed generic errors
│   ├── getir-error.js            # base class for all errors
│   ├── types.js                  # globally exposed custom errors, created automatically based on constants/error-messages.js
│   └── utils.js                  # utils for errors
├── formatters                    # data formatters for dao
├── logger                        # winston logger with custom format
│   └── index.js                  # globally exposed logger
├── logic                         # business logic components that may be seperated from services, think of pure business logic functions
├── models                        # model definitions for dao, mongoose specific
├── schemas                       # joi schemas for input validation
│   ├── controllers               # schemas for rest api controllers
│   └── models                    # schemas for models
├── server                        # hapi server
│   ├── controllers               # controllers that handle requests and rbac, call services
│   ├── plugins                   # plugins for rest api interface
│   ├── routes                    # routes defined on the rest api and input validations
│   └── index.js                  # server bootstrap module
├── service-callers               # service callers to communicate other microservices
├── services                      # services that use logic and DAO layers
├── utils                         # various util functions
│   ├── joi.js                    # custom joi extension
│   └── service-caller.js         # service caller helper class
└── index.js                      # entrypoint for the app, responsible for bootstrapping
```

Each part of the structure is describe below in detail.

### Bootstrapping (bootstrap/modules/, server/index.js)
Some dependencies require bootstrapping before they are registered to the container. For example, the *Data Access* layer stuff will not work, until we connect to a database. This is done by creating individual files for each of the dependencies with some special functions, and starting them up with a utility function. See [index.js](./src/index.js) for simple init.

- Each dependency that needs to be bootstrapped, should expose *start*, *stop* and an optional *register* function. Start is called when the bootstrap operation starts, stop is called when there is an error in further bootstrap process or when the application is gracefully shutting down. Register is called when you would like to register a dependency into the container for this bootstrap component.

### Configuration
Configuration files are separated according to the environment and stores in the [config](./src/config) folder. There is a default environment file, that is shared between environments. And configuration file specific to your environment overrides this. For example you would have `dev.js` which would merge with the `default.js` to create the final config object for the *dev* environment. Every key in `dev.js` would recursively override `default.js`.

### Logger
A winston logger with custom format is used. This logger is registered into the dependency injection container.

Example logging:
```javascript
logger.info('hello', { additional: 'info' });
logger.error('some error message', new Error('test'));
```

### Models
These are your plain old mongoose objects, registered in dependency injection. You should abstain from using mongoose specific features, but just define the general structure of data. Real querying should be done in *Data Access* layer.

- Will be used by the *Data Access* only.
- No business logic or data retrieving/storing related code should be here. Just the type definitions!
- Export the output of `mongoose.model` for the specific model.
- Use only in the *Data Access* layer, no where else.
- File names should be lowercase.

### Data Access
This layer is for data retrieving and storing, using the mongoose models. You should define each meaningful query with its own function, and export a single class/function that returns object.

- Will be used by the *Service* layer only.
- Abstain from returning mongoose objects from *Data Access* layer to the *Service* layer. Use `.lean` or `.toObject` to return plain objects. Returning mongoose objects complicates things. (default values, population etc.)
- Define separate queries for reading/updating/creating/deleting records. Every functions should do one of these.
- In principle, data access layer should be re-written to use another database without needing a refactor of other layers.

### Logic
There are some parts of the system, that may be written as pure functions. These are your business logic that should not be tainted with async operations. For example whether to show a promo in the basket of a user, given the current basket status and a basket show criteria for a promo. Or whether a dynamic pricing rule affects a given store or not, if so what kind of a price change is done etc. These can be written as pure functions.

Separate these kind of functions into this layer. In the best case scenario, these code should have a well defined structure to be used in other projects via code sharing (maybe npm packages).

- Will be used by the *Service* layer.
- Abstain from creating functions that accept/returns promises.
- Prefer to write pure functions, that do not mutate.

### Service
You can think of the service layer as the real tasks/jobs that this project should be able to do. It does not matter where the request comes from (it could be rest, queue, lambda). For example, if we are coding a service for doing CRUD on basket related configs, there should be a service function for each CRUD function.

- Will be used by the edge points of the system. For example, a controller will call a service to create a new bag constraint. There should be no business logic after this layer. It should be all input validation, handling communication according to env/protocol etc (routes/controller/lambda/queue).
- Should export a class that accepts dependencies (Data Access, other services etc.) as constructor parameter.
- You should create and separate services according to the job they are doing. For example for the bag service, you could have 2 different service files for BagConstraint CRUD and BagPacking. And one of them could depend on another. Don't hesitate to separate and share services among themselves.
- Trust the parameters that you accept as input, the validation should be in controller.
- No authorization in the service, trust the caller has enough access. It should be controllers/routes job to validate.
- No formatting in the services, it kills the re-usability.
- Should return plain objects, that will validated with route response schemas, and returned with an 200 ok response code.
- At the start of the service method you can extract dependencies with this syntax: `const { ClientDataAccess } = this;` then use it like `ClientDataAccess.doSomething` further down the service.

### Input Validation
Input validation is done using Joi schemas. Define your general entities in the root of the [schemas](./src/schemas) folder, model entities in the [schemas/models](./src/schemas/models) folder, and re-use them in [schemas/controllers](./src/schemas/controllers) to define controller request/response payloads.

- Will be used by the *Route* layer.
- Abstain from using required etc. in the general definitions in the root of schemas folder. The required parameters should be set in *schemas/controllers* to increase re-usability of general models.
- All input validation should be done if it does not depend on database checks, before calling anything from the service layer. And if the input validation requires data access, make sure you separate it into its own service. e.g. *AuthorizationService*.

### Routes
Routes are where we define the endpoints of our rest api. Use REST api best practices when deciding on the method. The input validation config, description, endpoint, method, api tags should be set here. In the handler, you will decide which controller to call.

- Pass all the request data into the controllers.
- Use meaningful rest methods.
- Use joi schemas to do input validation.

### Controllers
Controllers are where rest api requests are translated into a service call. They should clean out the request, get the path/query/payload parameters from it, do some additional validation/authorization if it is required. Then call the service they are interested in.

- Controllers should be exposed as classes, that accept dependencies in constructors.
- They should not include any business logic, their sole purpose is to call a service.
- They can call multiple services for example for authorization and to do a job. But if your use case is to merge results of two services, prefer creating a new service that depends on the other two service and calls them in a single function.

### Errors
Any unexpected error (js errors) that happens inside our services are sent to sentry and the dev team is notified. For business logic errors that we except (such as wrong password) we return custom errors. These custom errors are called *GetirError*

- Will be used by *Service* layer.
- Errors are created in [errors/types.js](src/errors/types.js).
- They can extend custom error groups to return meaningful status codes such as 401, 403, 404 etc.
- Return codes should be unique among all project.
- They can accept parameters to format the response message.


## Swagger Documentation
This template gives you free auto generated documentation, if you define your joi schemas and use them in your route definitions. See `http://localhost:8080/documentation` after you start the application.

## Application Deployment
App is deployed in Heroku with swagger enabled status. The application can be accessed with the URL.  `https://dataguard-test.herokuapp.com/documentation`

## Application start
App can be cloned into system and started with below steps. Rest api can be accessed in localhost @ `http://localhost:8080/documentation`

- git clone <git_url>
- cd <repo_main_folder>
- npm start
 
     OR

App is dockerizable with the below commands.

- docker run --rm -it $(docker build -q .)
