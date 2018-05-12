const port = 8080;

const serverConf = {
  'logConf': {
    'level': 'VERBOSE'
  },
  'endpoints': [
    {
      'method': 'GET',
      'path': '',
      'callback': (req, res) => {
        res.json(serverConf.endpoints)
      }
    }
  ],
  'proxies': [
      {
          path: 'endpoints',
          destination: `http://localhost:${port}/api`
      }
  ],
  'port': port
};
module.exports = serverConf;