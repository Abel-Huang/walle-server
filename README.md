# WalleBackEnd
## 系统需求
    统一用云端mongodb，无需本地配置
    本地需要安装nodejs环境以及npm
## 使用步骤
    npm install
    node app.js 或者 node calculate.js
## 文档介绍
    app.js:小车采集数据上传路径，采用socket连接，上传json格式的数据
    calculate.js:生成ibeacon && wifi 指纹库
## 补充说明
app.js上传json格式:
### ibeacon
    {
        "type": "ibeacon",
        "x": "10",
        "y": "100",
        "uuid": "00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 16",
        "rssi": -100
    }
### wifi
    {
        "type": "wifi",
        "x": "10",
        "y": "100",
        "data": "+CWLAP:(0,AirJ,-87,74:25:8a:47:3c:50,1,-36)+CWLAP:(4,TP-LINK_7F0A,-90,ec:26:ca:43:7f:0a,1,-14)"
    }