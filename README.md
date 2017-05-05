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
#### app.js (used by smart car, the two json end with "\r\n")
ibeacon message format:
```json
{
    "type": "ibeacon",
    "x": 10,
    "y": 100,
    "uuid": "00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 16",
    "rssi": -100
}
```
wifi message format:
```json
{
    "type": "wifi",
    "x": 10,
    "y": 100,
    "data": "+CWLAP:(0,AirJ,-87,74:25:8a:47:3c:50,1,-36)+CWLAP:(4,TP-LINK_7F0A,-90,ec:26:ca:43:7f:0a,1,-14)"
}
```
#### http.js (used by app)
**getLocationApi**

by ibeacon:
>url:/ibeacon

>postdata:

```json
{
    "00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 01":-90,
    "00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 02":-90,
    "00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 03":-90,
    "00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 04":-40
}
```
by wifi:
>url:/wifi

>postdata:

```json
{
    "74:25:8a:47:3c:50":-90,
    "74:25:8a:47:3c:51":-90,
    "74:25:8a:47:3c:52":-90,
    "74:25:8a:47:3c:53":-90
}
```
**generateDBs(generate the ibeaconDB&&wifiDB)**

*this will regenerate some dbs, pay attention to use it*
>url:/

>postdata:

```json
{
    "task":"g"
}
```