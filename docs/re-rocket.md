npm run re-rocket -- newchat

> wa-control@0.1.0 re-rocket
> node src/scripts/re-rocket.js newchat

=== Real newchat / CS desk client simulation (hf4cs live) ===
GET /getInfo -> 200
{
  msg: '操作成功',
  code: 200,
  permissions: [
    'biz:avatarstore:list',
    'biz:avatarstore:remove',
    'biz:friends:query',
    'biz:account:edit',
    'biz:account:scan',
    'biz:avatarstore:query',
    'biz:avatarstore:edit',
    'biz:friends:edit',
    'biz:exporttask:list',
    'biz:nicknamestore:list',
    'biz:nicknamestore:remove',
    'biz:pool:remove',
    'biz:fanslabel:add',
    'biz:send:list',
    'biz:account:query',
    'biz:fanslabel:query',
    'biz:fanslabel:list',
    'biz:smstore:edit',
    'biz:nicknamestore:query',
    'biz:fanslabel:edit',
    'biz:pool:query',
    'biz:send:add',
    'biz:send:query',
    'biz:pool:list',
    'biz:accountregister:list',
    'biz:task:list',
    'biz:friends:list',
    'biz:friends:add',
    'biz:smstore:list',
    'biz:send:edit',
    'biz:pool:edit',
    'biz:fanslabel:delete',
    'biz:task:query',
    'biz:groupchattask:list',
    'biz:tasklog:list',
    'biz:avatarstore:add',
    'biz:pool:add',
    'biz:tasklog:query',
    'biz:account:add',
    'biz:task:remove',
    'biz:send:remove',
    'biz:pool:export',
    'biz:nicknamestore:add',
    'biz:task:add',
    'biz:task:all',
    'biz:account:list',
    'biz:task:edit',
    'biz:smstore:remove',
    'biz:nicknamestore:edit',
    'biz:smstore:add',
    'biz:smstore:query',
    'biz:send:export',
    'biz:chat:all'
  ],
  roles: [ 'csr' ],
  user: {
    createBy: null,
    createTime: '2026-01-15 17:16:55',
    updateBy: null,
    updateTime: null,
    remark: null,
    userId: 39097,
    deptId: 100,
    userName: 'pixiu001',
    nickName: 'pixiu001',
    userType: '00',
    email: '',
    phonenumber: '',
    sex: '0',
    avatar: '',
    password: null,
    status: '0',
    delFlag: '0',
    loginIp: '105.231.54.210',
    loginDate: '2026-06-21T21:37:06.000+08:00',
    chargeId: 33596,
    createId: null,
    fanyiCount: 99999999,
    isFanyi: 1,
    isMoreLogin: 0,
    isIndustry: 0,
    isDeepl: 0,
    groupId: null,
    isTask: 0,
    isTaskOpen: 0,
    isGetAvatar: 0,
    isGetMsg: 1,
    secPassword: null,
    isDelChat: 1,
    isLeadinginApi: 0,
    isTaskApi: 0,
    isSecpass: 0,
    isBlock: 1,
    isSm: 1,
    chargeParent: null,
    isMerchant: 0,
    isWsmerchant: 0,
    dept: {
      createBy: null,
      createTime: null,
      updateBy: null,
      updateTime: null,
      remark: null,
      deptId: 100,
      parentId: 0,
      ancestors: '0',
      deptName: '集团',
      orderNum: 0,
      leader: '',
      phone: null,
      email: null,
      status: '0',
      delFlag: null,
      parentName: null,
      children: []
    },
    roles: [ [Object] ],
    roleIds: null,
    postIds: null,
    roleId: null,
    allocationNum: null,
    online: null,
    outline: null,
    seal: null,
    friendsCount: null,
    friendsNowCount: null,
    notReadCount: null,
    portNum: null,
    portUseNum: null,
    portNum1: null,
    portUseNum1: null,
    handel: null,
    changeCount: null,
    ids: null,
    isAll: null,
    tokenId: null,
    groupName: null,
    orderSort: null,
    saleName: null,
    content: null,
    csCount: null,
    portSale: null,
    moveCount: null,
    isBfTask: null,
    isFansTask: null,
    isDelFans: null,
    isEditAvatar: null,
    isEditNickname: null,
    isAbnormalLogin: null,
    abnormalLoginCode: null,
    lastAbnormalTime: null,
    isIntercept: null,
    isSpecialChannel: null,
    isReplyAPI: null,
    isGroupReadStatus: 0,
    balance: null,
    isLevel2Password: 0,
    isRepeatScope: 1,
    isWsDesensitization: null,
    isAccountGroup: 1,
    isAccountList: null,
    isStirTask: 0,
    isExportWs: 0,
    isFansPwd: 0,
    admin: false,
    notReadChatCount: null
  }
}

--- 1. Load WA accounts this CSR can chat from (biz/chat/getAccountList) ---
total accounts: 57
sample account: {
  "createBy": null,
  "createTime": null,
  "updateBy": null,
  "updateTime": null,
  "remark": "",
  "username": "4473515622158175",
  "createDate": null,
  "cc": null,
  "number": null,
  "language": null,
  "country": null,
  "appType": null,
  "deviceInfo": null,
  "pushName": "",
  "status": 1,
  "working": null,
  "updateDate": null,
  "blockReason": null,
  "blockDate": null,
  "blockIp": null,
  "failedReason": null,
  "mcc": null,
  "mnc": null,
  "socksHost": null,
  "socksPort": null,
  "socksUsername": null,
  "socksPassword": null,
  "loginDate": null,
  "logging": null,
  "pict

--- 2. Load friends/customers for first account (csUsername=4473515622158175) ---
total friends for this cs: 4
sample friend: {"createBy":null,"createTime":"2026-06-25 22:49:57","updateBy":null,"updateTime":null,"remark":null,"id":421321950,"csUsername":"4473515622158175","username":"963937411490","addType":0,"groupSendId":3892,"soucreUsername":null,"isFans":1,"csId":39097,"chargeId":33596,"isBlock":0,"userType":null,"userId":null,"nickname":null,"csName":"pixiu001","labels":"","addTime":null,"addTypeStr":null,"isRepeat":0,"isWsapi":0,"labelId":null,"taskAccounts":null,

--- 3. Load chat history (chatLogList for 4473515622158175 <-> 963937411490) ---
total logs: 1
sample message: {"createBy":null,"createTime":null,"updateBy":null,"updateTime":null,"remark":null,"id":1301827023,"chatContent":null,"sourceContent":null,"chatImage":null,"chatVideo":null,"chatAudio":null,"chatType":2,"csUsername":"4473515622158175","username":"963937411490","isSend":0,"sendTime":"2026-06-25 22:49:57","createId":33596,"csId":39097,"protoBuf":null,"isRead":1,"smId":995936873,"messageId":"ACE58D2E70001AD279126C79A2FF0B53","senderTimestamp":1782398995,"recipientTimestamp":null,"notify":"👍","msgS

--- 4. Other desk primitives ---
notRead: { notReadNum: 0 }

=== Simulation done. Use:
  node ... newchat-chatlog <csUsername> <friendUsername>
  node ... newchat-send <cs> <to> "text"
  



========================

npm run re-rocket -- newchat-chatlog 4473515622158175 963937411490

> wa-control@0.1.0 re-rocket
> node src/scripts/re-rocket.js newchat-chatlog 4473515622158175 963937411490

{
  "total": 1,
  "rows": [
    {
      "createBy": null,
      "createTime": null,
      "updateBy": null,
      "updateTime": null,
      "remark": null,
      "id": 1301827023,
      "chatContent": null,
      "sourceContent": null,
      "chatImage": null,
      "chatVideo": null,
      "chatAudio": null,
      "chatType": 2,
      "csUsername": "4473515622158175",
      "username": "963937411490",
      "isSend": 0,
      "sendTime": "2026-06-25 22:49:57",
      "createId": 33596,
      "csId": 39097,
      "protoBuf": null,
      "isRead": 1,
      "smId": 995936873,
      "messageId": "ACE58D2E70001AD279126C79A2FF0B53",
      "senderTimestamp": 1782398995,
      "recipientTimestamp": null,
      "notify": "👍",
      "msgStatus": 2,
      "msgType": 0,
      "taskId": null,
      "taskChatId": null,
      "soucreUsername": null,
      "quotedMessage": null,
      "quotedId": null,
      "quotedMessageId": null,
      "quotedUsername": null,
      "quotedName": null,
      "quotedContent": null,
      "updateDate": null,
      "buttonId": null,
      "error": null,
      "isCharge": 0,
      "retryStatus": null,
      "retryCount": 0,
      "channel": null,
      "isAi": 0,
      "audioId": null,
      "audioUrl": null,
      "audioSeconds": null,
      "fileUrl": "http://rocketgo04new.oss-ap-southeast-1.aliyuncs.com/assets/other/smstore/20260625/529f35e2-cee2-41b2-b5b5-0506397100fd.ogg",
      "thumbnail": "http://rocketgo04new.oss-ap-southeast-1.aliyuncs.com/assets/other/smstore/20260625/529f35e2-cee2-41b2-b5b5-0506397100fd.ogg",
      "fileName": null,
      "height": null,
      "width": null,
      "seconds": "16",
      "sType": 4,
      "caption": null,
      "displayName": null,
      "vcardPhone": null,
      "text": null,
      "matchedText": null,
      "description": null,
      "title": null,
      "avatarUrl": null,
      "pushName": null,
      "reactionMessageList": null,
      "remarkName": null,
      "wsAvatar": null,
      "chatUserId": null,
      "phone": null,
      "isCs": null,
      "isQuoted": 1,
      "groupTo": null,
      "participant": null,
      "body": null,
      "sourceUrl": null,
      "sendUser": "pixiu001",
      "buttonText": null,
      "chatLogTableName": "chat_log",
      "isScan": null,
      "usernameStr": "963937411490"
    }
  ],
  "code": 200,
  "msg": "查询成功"
}

=========

npm run re-rocket -- newchat-send 4473515622158175 963937411490 "test from re"

> wa-control@0.1.0 re-rocket
> node src/scripts/re-rocket.js newchat-send 4473515622158175 963937411490 test from re

sendMsg response: { id: 1302262712, content: 'test from re' }
## Agent (CSR) newchat desk analysis (hf4cs, pixiu001)

This login is **csr / agent**, not supervisor. Focus is the daily chat desk at /chat/newchat.

### Core load sequence observed (live + bundles)
1. GET /getInfo  (or /biz/chat/getCsList) → current agent info (userId, chargeId, feature flags like isGetMsg, isDelChat, isFanyi, isAccountGroup, etc.)
2. GET /biz/chat/getAccountList → list of WA numbers ("accounts") this agent can use. 
   - Each has "username" (phone), status, per-account **socks proxy** config (socksHost/Port/Username/Password), login time, etc.
   - This populates the account selector in the desk.
3. For selected account (csUsername): GET /biz/friends/list?csUsername=... → the customers/fans for that number.
   - Rows have csUsername (link back), username (fan phone), isFans, isBlock, labels, csName, etc.
4. Chat history: GET /biz/chat/chatLogList?csUsername=...&username=...&pageNum=1&pageSize=N
   - Messages include chatType, isSend, sendTime, notify/chatContent, messageId, isRead, file/audio metadata, quoted, etc.
5. Send: POST /biz/chat/sendMsg with at least {csUsername, username, chatContent, ...}
   - Worked with simple payload in test.

### Realtime
- Bundles contain references to websocket (`/websocket/`), socket, setInterval.
- Also polling via getNotRead.
- UI strings mention socket connection states and message sync.

### Other agent-desk features (from bundles + permissions)
- Quick replies / materialLibrary (from avatarstore, nicknamestore, smstore)
- Translation (fanyi)
- Group chat (chatgroup, chatwsgroup)
- Pull contacts, setBlock, top/pin sessions, revoke, clear unread, robot hosting, auto reply settings.
- Fans labels, sources, address book.
- Per-account proxy (visible in account rows) — key for the local system.

### Notes for local mimic
- Use same token style (Bearer from login).
- Scope everything by csUsername (the WA number the agent is currently using).
- Accounts in desk have built-in proxy config.
- Response envelope mostly {total?, rows?, code, msg} or direct objects for getCsList etc.
- Version mismatch errors on some /getAccountChat calls when using script (frontend build check?); the main ones work fine.

Current script helpers (newchat, newchat-chatlog, newchat-send) successfully exercised the above with live data.

