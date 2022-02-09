// set endpoint and your access key
endpoint = 'v1/historical'
api_key = '1c83ffb9998b3d2567d9eca13279c7d9';

base = 'USD'
date = '2015-01-14'
symbols   = 'TRY'

// get the most recent exchange rates via the "live" endpoint:
$.ajax({
url: 'https://api.currencyscoop.com/' + endpoint + '?api_key=' + api_key + 
    '&base=' + base + '&date=' + date +'&symbols' + symbols + '&amount=' + amount ,
dataType: 'jsonp',
success: function(json) {

// exchange rata data is stored in json.quotes
alert(json);

}
});