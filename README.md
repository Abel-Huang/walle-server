# WalleBackEnd
## System Request
`nodejs && npm`
## Step
1. `npm install`
2. `node app.js` or `node calculate.js`

## File Tree Introduction
    /Test : test folder
    /backup : db backup files
    app.js : smart car upload data, via json
    calculate.js : use for generate db
    data : some raw data(useless)
    easymogo : connect to mongodb
    http.js : api
    utils.js : some useful tool function
    (more details is follow)
## More Details
app.js json format:
#### ibeacon
```json
{
    "type": "ibeacon",
    "x": 10,
    "y": 100,
    "uuid": "00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 16",
    "rssi": -100
}
```
#### wifi
```json
{
    "type": "wifi",
    "x": 10,
    "y": 100,
    "data": "+CWLAP:(0,AirJ,-87,74:25:8a:47:3c:50,1,-36)+CWLAP:(4,TP-LINK_7F0A,-90,ec:26:ca:43:7f:0a,1,-14)"
}
```
http.js:
#### getLocationApi
```json
{
    "00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 01":-90,
    "00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 02":-90,
    "00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 03":-90,
    "00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 04":-40
}
```
#### generateDBs(generate the ibeaconDB&&wifiDB)
this will regenerate some dbs, pay attention to use it
```json
{
    "task":"g"
}
```