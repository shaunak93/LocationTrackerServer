var express = require('express')
//var ws = require('./ws')
var bodyParser = require('body-parser');

var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({port: 40511})



var app = express()
var webs;

var deviceList = [];

deviceList.push({deviceName:"Device 1",deviceId:1,deviceLocation:'12.924025, 77.672938',deviceLocationHistory:[],isOnline:true});

deviceList.push({deviceName:"Device 2",deviceId:2,deviceLocation:'12.924025, 77.67293',deviceLocationHistory:[],isOnline:true});

deviceList.push({deviceName:"Device 3",deviceId:3,deviceLocation:'12.924025, 77.6729',deviceLocationHistory:[],isOnline:true});

deviceList.push({deviceName:"Device 4",deviceId:4,deviceLocation:'12.924025, 77.672',deviceLocationHistory:[],isOnline:true});

deviceList.push({deviceName:"Device 5",deviceId:5,deviceLocation:'12.92402, 77.672938',deviceLocationHistory:[],isOnline:true});

deviceList.push({deviceName:"Device 6",deviceId:6,deviceLocation:'12.9240, 77.672938',deviceLocationHistory:[],isOnline:true});

deviceList.push({deviceName:"Device 7",deviceId:7,deviceLocation:'12.924, 77.672938',deviceLocationHistory:[],isOnline:true});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/ws.html');
// })

app.post('/updateDevice', (req,res) => {
    //if(req)
    if(deviceList[req.body.deviceId-1].deviceLocation != req.body.deviceLocation){
        deviceList[req.body.deviceId-1].deviceLocationHistory.push(deviceList[req.body.deviceId-1].deviceLocation);
        deviceList[req.body.deviceId-1].deviceLocation = req.body.deviceLocation;
    }
    if(deviceList[req.body.deviceId-1].isOnline != req.body.isOnline){
        deviceList[req.body.deviceId-1].isOnline = req.body.isOnline
    }
    //deviceList[req.body.deviceId-1] = req.body;
    console.log(deviceList[req.body.deviceId-1]);
    if(webs){webs.send(JSON.stringify(deviceList))}
})

app.get('/get', (req,res) => {
    console.log(deviceList);
    res.send({deviceList:deviceList});
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

wss.on('connection', function (ws) {
  webs = ws;
  ws.send(JSON.stringify(deviceList));
})
