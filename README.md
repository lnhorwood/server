# @horwood/server

This is a simple Node.js module that allows the user to quickly bootstrap a server utilising the Express framework. 

## Getting Started
It is available through the NPM registry by using the following command:
```bash
$ npm install @horwood/server
```
### Running via the CLI
In order to run the server from the CLI, run:
```bash
$ horwood-server
```
The server must be provided with a server.conf module in order to function. By default, it looks in the root directory 
of your project for a module named `server.conf`. If you wish to override this, you can use the following command:
```bash
$ horwood-server --server-conf=./path/to/server.conf
```

### Running Programmatically
To run the server programmatically, you must create a new `Server` instance using a valid `ServerConf`.
```js
const horwoodServer = require('@horwood/server');
const serverConf = new horwoodServer.ServerConf(require('./server.conf'));
const server = new horwoodServer.Server(serverConf);
``` 

### Configuration
Configuration should be provided using the following format:
```js
const serverConf = {
  'logConf': {
    'location': './logs',
    'preserve': false,
    'level': 'INFO'
  },
  'endpoints': [
    {
      'method': 'GET',
      'path': '/',
      'callback': (req, res) => {
        res.json(serverConf.endpoints)
      }
    }
  ],
  'port': 8080,
  'prefix': '/api',
  'staticConf': {
      'prefix': '',
      'root': 'dist'
  }
};
module.exports = serverConf;
```
Valid configuration properties are listed below.

| Property          | Description                                           | Options                                         | Default |
| ----------------- | ----------------------------------------------------- | ----------------------------------------------- | ------- |
| logConf.location  | Where log files will be stored.                       |                                                 | ./logs  |
| logConf.preserve  | Whether or not to preserve old logs.                  | true <br /> false                               | false   |
| logConf.level     | The level of logs to output.                          | VERBOSE <br /> INFO <br /> WARN <br /> ERROR    | INFO    |
| endpoints         | A list of endpoints to be mapped.                     |                                                 | []      |
| endpoint.method   | The HTTP method to use for the endpoint.              | DELETE <br /> GET <br /> POST <br /> PUT <br /> |         |
| endpoint.path     | The path to use for the endpoint.                     |                                                 |         |
| endpoint.callback | The function to call when the endpoint is hit.        |                                                 |         |
| port              | The port to deploy the server on.                     |                                                 | 8080    |
| prefix            | The prefix to prepend all endpoints with.             |                                                 | /api    |
| staticConf.prefix | The prefix to prepend to requests for static content. |                                                 |         |
| staticConf.root   | The root of the static content.                       |                                                 |         |
