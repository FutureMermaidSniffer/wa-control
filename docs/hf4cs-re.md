BASE and token setup for hf4cs.rocketgo.vip
# hf4cs.rocketgo.vip Reverse Engineering (live data)

Base: https://hf4cs.rocketgo.vip
Token: set via `node src/scripts/re-rocket.js set-token <bearer>`

## Key endpoints discovered from bundles + live probing (newchat CS desk)

### Accounts the CSR can use
GET /prod-api/biz/chat/getAccountList
- Returns { accountList: { total, rows: [ { username: "44735...", status, socksHost/Port/Username/Password, pushName, ... } ] } }

### Customers / Fans for an account
GET /prod-api/biz/friends/list?csUsername=44735...&pageNum=1&pageSize=...
- Linked by csUsername (the WA number) → username (customer phone)
- Fields: id, csUsername, username, isFans, isBlock, labels, csName, chargeId, csId, ...

### Chat history
GET /prod-api/biz/chat/chatLogList?csUsername=...&username=...&pageNum=1&pageSize=5
- Messages with: chatType, isSend, sendTime, notify (or chatContent), messageId, isRead, smId, ...

### Other important
- /biz/chat/sendMsg  (POST { csUsername, username, chatContent, chatType, ... })
- /biz/chat/addChat
- /biz/chat/setRead/{id}
- /biz/chat/getNotRead
- /biz/chat/revokeMsg
- Group: /biz/chatgroup/* and /biz/chatwsgroup/*

## Current user (csr)
userId: 39097
chargeId: 33596
userName: pixiu001

See src/scripts/re-rocket.js for helpers:
  npm run re-rocket -- newchat
  npm run re-rocket -- newchat-chatlog <cs> <friend>
  npm run re-rocket -- newchat-send <cs> <to> "hi"

Bundles for deeper static analysis are in rocket-js/

