# WalleBackEnd
## System Request
`nodejs && npm`
## Step
1. `npm install`
2. `node walle.js`

## File Tree Introduction
    /Test : test folder
    /backup : db backup files
    app.js : smart car upload data, via json
    calculate.js : use for generate db
    data : some raw data(useless)
    easymogo : connect to mongodb
    http.js : api
    utils.js : some useful tool function
    walle.js : core js
## What you should know
Walle.js:
1. getlocationAPI
2. generateDBs
3. carControl
**getlocationAPI**:
>url: /ibeacon or /wifi
>method: post
>data:

1. ibeacon
```json
{
    "uuid_1":"rssi_1",
    "uuid_2":"rssi_2",
    "uuid_3":"rssi_3",
    "..."
    "uuid_n":"rssi_n"
}
```
2. wifi
```json
{
    "mac_1":"rssi_1",
    "mac_2":"rssi_2",
    "mac_3":"rssi_3",
    "..."
    "mac_n":"rssi_n"
}
```
**generateDBs(generate the ibeaconDB&&wifiDB)**

*this will regenerate some dbs, pay attention to use it*
>url:/
>mothod: post
>data:

```json
{
    "task":"g"
}
```

**carControl**
>url:/ctr
>mothod: post
>data:

```json
{
    "message":"control_content"
}
```
[*control_content*](https://github.com/sytuacmdyh/Indoor-Location-Car#控制命令-control_content)