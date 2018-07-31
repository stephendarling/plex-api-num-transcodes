require('dotenv').config()
const express = require('express');
var request = require('request');
const app = express();

tt_url = `http://${process.env.TT_HOST}:${process.env.TT_PORT}/api/v2?apikey=${process.env.API_KEY}&cmd=get_activity`

app.get('/', function (req, res) {

  request(tt_url, function (error, response, body) {
    data = JSON.parse(body)
    sessions = data['response']['data']['sessions']

    transcodes = sessions.filter(session => session['transcode_decision'] == 'transcode')
    if (transcodes.length > 0 )
      res.send({
        'num_transcodes': transcodes.length
      })
    else 
      res.send({
        'num_transcodes': 0
      })

  });

});

app.listen(process.env.PORT || 8080);
