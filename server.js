require('dotenv').config()
const express = require('express');
var axios = require('axios')
const app = express();


tt_url = `http://${process.env.TT_HOST}:${process.env.TT_PORT}/api/v2?apikey=${process.env.API_KEY}&cmd=get_activity`

app.get('/', function (req, res) {
  var transcode_count = 0
  axios({
    method: 'get',
    url: tt_url,
    timeout: 10000
    })
    .then(function (response) {
      sessions = response.data['response']['data']['sessions']
      transcodes = sessions.filter(session => session['stream_video_decision'] == 'transcode')
      if (transcodes.length > 0) 
        transcode_count = transcodes.length
    })
    .catch(function (error) {
      console.log('No connection')
    })
    .then(function () {
      res.send({
        'num_transcodes': transcode_count
      })
    })

});

app.listen(process.env.PORT || 8080);
