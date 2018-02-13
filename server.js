var express = require('express')
//var ws = require('./ws')
var bodyParser = require('body-parser');

var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({port: 40511})



var app = express()
var webs;

var deviceList = [];
var deviceLocations =[
    '12.920114, 77.675813',
    '12.922289, 77.676135',
    '12.925457, 77.676114',
    '12.923767, 77.672296',
    '12.922418, 77.669281',
    '12.920551, 77.665612',
    '12.921569, 77.666953',
    '12.922860, 77.669691',
    '12.924308, 77.672819',
    '12.925479, 77.675346',
    '12.926734, 77.677905',
    '12.927822, 77.680284',
    '12.930290, 77.685048',
    '12.933162, 77.688355',
    '12.935410, 77.690796'
]

var i = 1;

deviceList.push({deviceName:"Device 1",deviceId:1,deviceLocation:'12.920114, 77.675813',deviceLocationHistory:[],isOnline:true});

deviceList.push({deviceName:"Device 2",deviceId:2,deviceLocation:'12.922289, 77.676135',deviceLocationHistory:[],isOnline:false});

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
    console.log(req.body);
    if(deviceList[req.body.deviceId-1].deviceLocation != req.body.deviceLocation){
        deviceList[req.body.deviceId-1].deviceLocationHistory.push(deviceList[req.body.deviceId-1].deviceLocation);
        deviceList[req.body.deviceId-1].deviceLocation = req.body.deviceLocation;
    }
    if(deviceList[req.body.deviceId-1].isOnline != req.body.isOnline){
        deviceList[req.body.deviceId-1].isOnline = req.body.isOnline
    }
    
    //deviceList[req.body.deviceId-1] = req.body;
    //console.log(deviceList[req.body.deviceId-1]);
    if(webs){webs.send(JSON.stringify(deviceList))}
    
    res.send({});
})



app.get('/get', (req,res) => {
    //console.log(deviceList);
    res.send({deviceList:deviceList});
})

app.listen(3000, function () {
  //console.log('Example app listening on port 3000!')
})

wss.on('connection', function (ws) {
  webs = ws;
  ws.send(JSON.stringify(deviceList));
  
  setInterval(() => {
      if(i < 15){
          if(Math.floor((Math.random() * 3)) == 0){
              deviceList[0].isOnline = !deviceList[0].isOnline;
              deviceList[1].isOnline = !deviceList[1].isOnline;
          }
          else{
              deviceList[0].isOnline = true;
              deviceList[1].isOnline = true;
              deviceList[0].deviceLocation = deviceLocations[i];
              deviceList[0].deviceLocationHistory.push(deviceLocations[i-1]);
              deviceList[1].deviceLocation = deviceLocations[deviceLocations.length - 1 - i];
              deviceList[1].deviceLocationHistory.push(deviceLocations[deviceLocations.length - i]);
              i++;
          }
          console.log(deviceList[0]);
          ws.send(JSON.stringify(deviceList));
      }
        
    }, 5000);
})
