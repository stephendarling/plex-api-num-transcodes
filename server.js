require('dotenv').config()
const express = require('express');
var axios = require('axios')
const app = express();


tt_url = `http://${process.env.TT_HOST}:${process.env.TT_PORT}/api/v2?apikey=${process.env.API_KEY}&cmd=get_activity`

app.get('/', function (req, res) {
  var stats = {
    lan_badwidth: 0,
    wan_bandwidth: 0,
    total_bandwidth: 0,
    stream_count: 0,
    stream_count_direct_play: 0,
    stream_count_direct_stream: 0,
    stream_count_transcode: 0
  }
  var lan = []
  var wan = []
  function total (array) {
    if (array.length > 0)
      return array.reduce((a,b) => a + b)
    else
      return 0
  }

  axios({
    method: 'get',
    url: tt_url,
    timeout: 10000
    })
    .then(function (response) {
      data = response.data['response']['data']
      sessions = data['sessions']
      sessions.map(session => {
        var bandwidth = Number(session['bandwidth'])
        if (session['bandwidth'] > 999999)
          bandwidth = Number(session['bandwidth'])/1000
        if (session['location'] == 'lan')
          lan.push(bandwidth)
        else
          wan.push(bandwidth)
      })
      stats.lan_badwidth = total(lan)
      stats.wan_bandwidth = total(wan)
      stats.total_bandwidth = total([...lan,...wan])
      stats.stream_count = Number(data.stream_count)
      stats.stream_count_direct_play = data.stream_count_direct_play
      stats.stream_count_direct_stream = data.stream_count_direct_stream
      stats.stream_count_transcode = data.stream_count_transcode
    })
    .catch(function (error) {
      console.log('No response')
    })
    .then(function () {
      res.send(stats)
    })

});

app.listen(process.env.PORT || 8080);
