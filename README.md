# nodeMonitoring
public fork of node monitoring by https://github.com/mamacker

things to edit, all mandatory fields are marked as TODO:
https://github.com/maxbrand99/nodeMonitoring/blob/main/index.js#L6 - add your api keys here, Account SID and Auth Token from https://console.twilio.com/ under account info
https://github.com/maxbrand99/nodeMonitoring/blob/main/index.js#L9 - add the phone numbers of the people that you would like to get texts sent to
https://github.com/maxbrand99/nodeMonitoring/blob/main/index.js#L20 - add your messagingServiceSid
https://github.com/maxbrand99/nodeMonitoring/blob/main/index.js#L55 - if you use custom database information (like a different password) update it here

to run:
```
docker compose up -d
```
