# nodeMonitoring
public fork of node monitoring written by https://github.com/mamacker (i just got permission to make the fork)



things to edit, all mandatory fields are marked as TODO:

[add your api keys here, Account SID and Auth Token from https://console.twilio.com/ under account info](https://github.com/maxbrand99/nodeMonitoring/blob/main/index.js#L6)

[add the phone numbers of the people that you would like to get texts sent to](https://github.com/maxbrand99/nodeMonitoring/blob/main/index.js#L9)

[add your own messaging service or uncomment the lines to use twillio](https://github.com/maxbrand99/nodeMonitoring/blob/main/index.js#L15)

[add your messagingServiceSid](https://github.com/maxbrand99/nodeMonitoring/blob/main/index.js#L15)

[add your node name here](https://github.com/maxbrand99/nodeMonitoring/blob/main/index.js#L23)

[if you use custom database information (like a different password) update it here](https://github.com/maxbrand99/nodeMonitoring/blob/main/index.js#L58)


to run:
```
docker compose up -d
```
