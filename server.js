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
  axios({
    method: 'get',
    url: tt_url,
    timeout: 10000
    })
    .then(function (response) {
      data = response.data['response']['data']
      stats.lan_badwidth = data.lan_bandwidth
      stats.wan_bandwidth = data.wan_bandwidth
      stats.total_bandwidth = data.total_bandwidth
      stats.stream_count = data.stream_count
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
