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
  ]
};
module.exports = serverConf;