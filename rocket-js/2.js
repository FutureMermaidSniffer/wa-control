(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["chunk-6e09fcd5", "chunk-0cd87756", "chunk-2d22d452"], {
    "5b81": function(t, e, n) {
        "use strict";
        var r = n("23e7")
          , a = n("c65b")
          , u = n("e330")
          , c = n("1d80")
          , o = n("1626")
          , i = n("7234")
          , s = n("44e7")
          , d = n("577e")
          , h = n("dc4a")
          , l = n("90d8")
          , b = n("0cb2")
          , f = n("b622")
          , p = n("c430")
          , m = f("replace")
          , g = TypeError
          , O = u("".indexOf)
          , j = u("".replace)
          , z = u("".slice)
          , w = Math.max
          , T = function(t, e, n) {
            return n > t.length ? -1 : "" === e ? n : O(t, e, n)
        };
        r({
            target: "String",
            proto: !0
        }, {
            replaceAll: function(t, e) {
                var n, r, u, f, C, v, y, S, k, I = c(this), A = 0, L = 0, x = "";
                if (!i(t)) {
                    if (n = s(t),
                    n && (r = d(c(l(t))),
                    !~O(r, "g")))
                        throw g("`.replaceAll` does not allow non-global regexes");
                    if (u = h(t, m),
                    u)
                        return a(u, t, I, e);
                    if (p && n)
                        return j(d(I), t, e)
                }
                f = d(I),
                C = d(t),
                v = o(e),
                v || (e = d(e)),
                y = C.length,
                S = w(1, y),
                A = T(f, C, 0);
                while (-1 !== A)
                    k = v ? d(e(C, A, f)) : b(C, f, A, [], void 0, e),
                    x += z(f, L, A) + k,
                    L = A + y,
                    A = T(f, C, A + S);
                return L < f.length && (x += z(f, L)),
                x
            }
        })
    },
    "6b98": function(t, e, n) {
        "use strict";
        n.d(e, "a", (function() {
            return o
        }
        ));
        var r = n("5530")
          , a = (n("d3b7"),
        n("159b"),
        n("14d9"),
        n("f77b"))
          , u = n("2f62")
          , c = n("e350")
          , o = {
            data: function() {
                return {
                    canTranslateTime: !0,
                    translateTime: 5,
                    userRoleId: ""
                }
            },
            computed: Object(r["a"])(Object(r["a"])({}, Object(u["b"])(["chargeId"])), {}, {
                translateSettingData: function() {
                    return this.$store.state.newChat.translateSettingData
                }
            }),
            created: function() {},
            mounted: function() {},
            methods: {
                checkRole: c["b"],
                translateClick: function(t, e, n) {
                    var r = this;
                    if (this.canTranslateTime) {
                        this.canTranslateTime = !1;
                        var u = setInterval((function() {
                            r.translateTime--
                        }
                        ), 1e3);
                        setTimeout((function() {
                            r.canTranslateTime = !0,
                            r.translateTime = 5,
                            clearInterval(u)
                        }
                        ), 5e3);
                        var c = 1 == t.chatType ? t.chatContent : t.caption;
                        if (c || 4 == t.sType)
                            if (this.translateSettingData.receive)
                                if (this.isTranslate = !0,
                                this.isTranslateEnd = !1,
                                2 == t.chatType && 4 == t.sType) {
                                    var o = {
                                        sourceLang: e,
                                        targetLang: n,
                                        chatLogId: t.id,
                                        oggUrl: t.fileUrl,
                                        fileType: t.fileType,
                                        isGroup: 0
                                    };
                                    Object(a["B"])(o).then((function(e) {
                                        r.isTranslateEnd = !0;
                                        var n = ""
                                          , a = "";
                                        e.result.result.forEach((function(t) {
                                            t.translatedText.length > n.length && (n = t.translatedText,
                                            a = t.sourceText)
                                        }
                                        )),
                                        t.chatTranslate = n,
                                        t.chatVideo = a,
                                        r.$emit("getFanyiCount")
                                    }
                                    ))
                                } else {
                                    var i = {
                                        sourceLang: this.translateSettingData.receives,
                                        sourceText: 1 == t.chatType ? t.chatContent : t.caption,
                                        targetLang: this.translateSettingData.receive
                                    };
                                    Object(a["A"])(i).then((function(e) {
                                        r.isTranslateEnd = !0,
                                        t.chatTranslate = e.result,
                                        r.$emit("getFanyiCount")
                                    }
                                    ))
                                }
                            else
                                this.$store.dispatch("newChat/SET_TRANSLATE_SETTING_VISIBLE", !0);
                        else
                            this.$message.warning(this.$t("newchat.chatwindow.nothingTranslate"))
                    }
                },
                onMyContextmenu: function(t, e) {
                    var n = this
                      , r = [];
                    if (null != this.chargeId && r.push({
                        label: this.$t("newchat.chatwindow.translate"),
                        onClick: function() {
                            var t = 1 == e.chatType ? e.chatContent : e.caption || e.chatContent;
                            if (t)
                                if (n.translateSettingData.receive) {
                                    n.isTranslate = !0,
                                    n.isTranslateEnd = !1;
                                    var r = {
                                        sourceLang: n.translateSettingData.receives,
                                        sourceText: 1 == e.chatType ? e.chatContent : e.caption || e.chatContent,
                                        targetLang: n.translateSettingData.receive
                                    };
                                    Object(a["A"])(r).then((function(t) {
                                        e.chatTranslate = t.result,
                                        n.$emit("getFanyiCount")
                                    }
                                    )).finally((function() {
                                        n.isTranslate = !1,
                                        n.isTranslateEnd = !0
                                    }
                                    ))
                                } else
                                    n.$store.dispatch("newChat/SET_TRANSLATE_SETTING_VISIBLE", !0);
                            else
                                n.$message.warning(n.$t("newchat.chatwindow.nothingTranslate"))
                        }
                    }),
                    1 == e.isQuoted && null != this.chargeId && r.push({
                        label: this.$t("newchat.chatwindow.quoteReply"),
                        onClick: function() {
                            n.$store.dispatch("newChat/setQuoteData", e)
                        }
                    }),
                    e.msgStatus >= 0 && this.checkRole(["csr"]) && (null != this.chargeId && e.isCharge || r.push({
                        label: this.$t("newchat.chatwindow.withdraw"),
                        onClick: function() {
                            n.$emit("recallMessage")
                        }
                    })),
                    0 != r.length)
                        return this.$contextmenu({
                            items: r,
                            event: t,
                            customClass: "custom-class",
                            zIndex: 3,
                            minWidth: 100
                        }),
                        !1
                },
                onOtherContextmenu: function(t, e) {
                    var n = this
                      , r = [];
                    if (null != this.chargeId && 4 != e.sType && r.push({
                        label: this.$t("newchat.chatwindow.translate"),
                        onClick: function() {
                            var t = 1 == e.chatType ? e.chatContent : e.caption || e.chatContent;
                            if (t)
                                if (console.log(n.translateSettingData),
                                n.translateSettingData.receive) {
                                    n.isTranslate = !0,
                                    n.isTranslateEnd = !1;
                                    var r = {
                                        sourceLang: n.translateSettingData.receives,
                                        sourceText: 1 == e.chatType ? e.chatContent : e.caption || e.chatContent,
                                        targetLang: n.translateSettingData.receive
                                    };
                                    Object(a["A"])(r).then((function(t) {
                                        e.chatTranslate = t.result,
                                        n.$emit("getFanyiCount")
                                    }
                                    )).finally((function() {
                                        n.isTranslate = !1,
                                        n.isTranslateEnd = !0
                                    }
                                    ))
                                } else
                                    n.$store.dispatch("newChat/SET_TRANSLATE_SETTING_VISIBLE", !0);
                            else
                                n.$message.warning(n.$t("newchat.chatwindow.nothingTranslate"))
                        }
                    }),
                    1 == e.isQuoted && null != this.chargeId && r.push({
                        label: this.$t("newchat.chatwindow.quoteReply"),
                        onClick: function() {
                            n.$store.dispatch("newChat/setQuoteData", e)
                        }
                    }),
                    0 != r.length)
                        return this.$contextmenu({
                            items: r,
                            event: t,
                            customClass: "custom-class",
                            zIndex: 3,
                            minWidth: 100
                        }),
                        !1
                },
                onTranslateContextmenu: function(t, e) {
                    var n = this;
                    return this.$contextmenu({
                        items: [{
                            label: this.$t("newchat.businessCard.copy"),
                            onClick: function() {
                                navigator.clipboard.writeText(e).then((function() {
                                    n.$message.success(n.$t("newchat.message.successfullyCopy"))
                                }
                                ))
                            }
                        }],
                        event: t,
                        customClass: "custom-class",
                        zIndex: 3,
                        minWidth: 100
                    }),
                    !1
                },
                toQuoted: function(t) {
                    this.$emit("scrollIntoViewFun", t.quotedMessageId)
                }
            }
        }
    },
    e350: function(t, e, n) {
        "use strict";
        n.d(e, "a", (function() {
            return a
        }
        )),
        n.d(e, "b", (function() {
            return u
        }
        ));
        n("d3b7"),
        n("caad"),
        n("2532");
        var r = n("4360");
        function a(t) {
            if (t && t instanceof Array && t.length > 0) {
                var e = r["a"].getters && r["a"].getters.permissions
                  , n = t
                  , a = "*:*:*"
                  , u = e.some((function(t) {
                    return a === t || n.includes(t)
                }
                ));
                return !!u
            }
            return console.error("need roles! Like checkPermi=\"['system:user:add','system:user:edit']\""),
            !1
        }
        function u(t) {
            if (t && t instanceof Array && t.length > 0) {
                var e = r["a"].getters && r["a"].getters.roles
                  , n = t
                  , a = "admin"
                  , u = e.some((function(t) {
                    return a === t || n.includes(t)
                }
                ));
                return !!u
            }
            return console.error("need roles! Like checkRole=\"['admin','editor']\""),
            !1
        }
    },
    f77b: function(t, e, n) {
        "use strict";
        n.d(e, "L", (function() {
            return o
        }
        )),
        n.d(e, "F", (function() {
            return i
        }
        )),
        n.d(e, "C", (function() {
            return s
        }
        )),
        n.d(e, "a", (function() {
            return h
        }
        )),
        n.d(e, "sb", (function() {
            return l
        }
        )),
        n.d(e, "ub", (function() {
            return b
        }
        )),
        n.d(e, "tb", (function() {
            return f
        }
        )),
        n.d(e, "mb", (function() {
            return p
        }
        )),
        n.d(e, "g", (function() {
            return m
        }
        )),
        n.d(e, "nb", (function() {
            return g
        }
        )),
        n.d(e, "ob", (function() {
            return O
        }
        )),
        n.d(e, "X", (function() {
            return j
        }
        )),
        n.d(e, "i", (function() {
            return z
        }
        )),
        n.d(e, "Eb", (function() {
            return w
        }
        )),
        n.d(e, "Db", (function() {
            return T
        }
        )),
        n.d(e, "K", (function() {
            return C
        }
        )),
        n.d(e, "W", (function() {
            return v
        }
        )),
        n.d(e, "A", (function() {
            return y
        }
        )),
        n.d(e, "G", (function() {
            return S
        }
        )),
        n.d(e, "H", (function() {
            return k
        }
        )),
        n.d(e, "ab", (function() {
            return I
        }
        )),
        n.d(e, "Ib", (function() {
            return A
        }
        )),
        n.d(e, "yb", (function() {
            return L
        }
        )),
        n.d(e, "J", (function() {
            return x
        }
        )),
        n.d(e, "lb", (function() {
            return $
        }
        )),
        n.d(e, "D", (function() {
            return M
        }
        )),
        n.d(e, "U", (function() {
            return D
        }
        )),
        n.d(e, "Gb", (function() {
            return R
        }
        )),
        n.d(e, "M", (function() {
            return q
        }
        )),
        n.d(e, "k", (function() {
            return G
        }
        )),
        n.d(e, "wb", (function() {
            return F
        }
        )),
        n.d(e, "rb", (function() {
            return B
        }
        )),
        n.d(e, "Q", (function() {
            return _
        }
        )),
        n.d(e, "d", (function() {
            return N
        }
        )),
        n.d(e, "v", (function() {
            return Q
        }
        )),
        n.d(e, "r", (function() {
            return V
        }
        )),
        n.d(e, "zb", (function() {
            return W
        }
        )),
        n.d(e, "eb", (function() {
            return H
        }
        )),
        n.d(e, "bb", (function() {
            return U
        }
        )),
        n.d(e, "db", (function() {
            return J
        }
        )),
        n.d(e, "cb", (function() {
            return P
        }
        )),
        n.d(e, "ib", (function() {
            return K
        }
        )),
        n.d(e, "fb", (function() {
            return X
        }
        )),
        n.d(e, "hb", (function() {
            return Y
        }
        )),
        n.d(e, "gb", (function() {
            return Z
        }
        )),
        n.d(e, "b", (function() {
            return tt
        }
        )),
        n.d(e, "u", (function() {
            return et
        }
        )),
        n.d(e, "q", (function() {
            return nt
        }
        )),
        n.d(e, "p", (function() {
            return rt
        }
        )),
        n.d(e, "j", (function() {
            return at
        }
        )),
        n.d(e, "I", (function() {
            return ut
        }
        )),
        n.d(e, "e", (function() {
            return ot
        }
        )),
        n.d(e, "O", (function() {
            return it
        }
        )),
        n.d(e, "P", (function() {
            return st
        }
        )),
        n.d(e, "pb", (function() {
            return dt
        }
        )),
        n.d(e, "qb", (function() {
            return ht
        }
        )),
        n.d(e, "c", (function() {
            return lt
        }
        )),
        n.d(e, "N", (function() {
            return bt
        }
        )),
        n.d(e, "T", (function() {
            return ft
        }
        )),
        n.d(e, "R", (function() {
            return pt
        }
        )),
        n.d(e, "S", (function() {
            return mt
        }
        )),
        n.d(e, "jb", (function() {
            return gt
        }
        )),
        n.d(e, "f", (function() {
            return Ot
        }
        )),
        n.d(e, "Y", (function() {
            return jt
        }
        )),
        n.d(e, "n", (function() {
            return zt
        }
        )),
        n.d(e, "kb", (function() {
            return wt
        }
        )),
        n.d(e, "E", (function() {
            return Tt
        }
        )),
        n.d(e, "V", (function() {
            return Ct
        }
        )),
        n.d(e, "vb", (function() {
            return vt
        }
        )),
        n.d(e, "xb", (function() {
            return yt
        }
        )),
        n.d(e, "Hb", (function() {
            return St
        }
        )),
        n.d(e, "o", (function() {
            return kt
        }
        )),
        n.d(e, "B", (function() {
            return It
        }
        )),
        n.d(e, "Fb", (function() {
            return At
        }
        )),
        n.d(e, "h", (function() {
            return Lt
        }
        )),
        n.d(e, "Ab", (function() {
            return xt
        }
        )),
        n.d(e, "t", (function() {
            return $t
        }
        )),
        n.d(e, "y", (function() {
            return Mt
        }
        )),
        n.d(e, "x", (function() {
            return Et
        }
        )),
        n.d(e, "w", (function() {
            return Dt
        }
        )),
        n.d(e, "Cb", (function() {
            return Rt
        }
        )),
        n.d(e, "Bb", (function() {
            return qt
        }
        )),
        n.d(e, "s", (function() {
            return Gt
        }
        )),
        n.d(e, "z", (function() {
            return Ft
        }
        )),
        n.d(e, "Z", (function() {
            return Bt
        }
        )),
        n.d(e, "m", (function() {
            return _t
        }
        )),
        n.d(e, "l", (function() {
            return Nt
        }
        ));
        var r = n("c7eb")
          , a = n("1da1")
          , u = n("b775")
          , c = n("61f7");
        function o(t) {
            return Object(u["a"])({
                url: "/biz/chat/getCsList",
                method: "get",
                params: t
            })
        }
        function i(t) {
            return Object(u["a"])({
                url: "/biz/chat/getAccountList",
                method: "get",
                params: t
            })
        }
        function s(t) {
            return d.apply(this, arguments)
        }
        function d() {
            return d = Object(a["a"])(Object(r["a"])().mark((function t(e) {
                var n;
                return Object(r["a"])().wrap((function(t) {
                    while (1)
                        switch (t.prev = t.next) {
                        case 0:
                            return t.next = 2,
                            Object(u["c"])();
                        case 2:
                            return n = Math.floor(1e10 * Math.random()),
                            e.ab = n,
                            t.abrupt("return", Object(u["a"])({
                                url: "/biz/chat/getAccountChat",
                                method: "get",
                                params: e,
                                headers: {
                                    abcCode: Object(c["b"])()
                                }
                            }));
                        case 5:
                        case "end":
                            return t.stop()
                        }
                }
                ), t)
            }
            ))),
            d.apply(this, arguments)
        }
        function h(t) {
            return Object(u["a"])({
                url: "/biz/chat/addChat",
                method: "post",
                data: t
            })
        }
        function l(t) {
            return Object(u["a"])({
                url: "/biz/chat/sendMsg",
                method: "post",
                data: t
            })
        }
        function b(t) {
            return Object(u["a"])({
                url: "/biz/chat/sendSmMsg",
                method: "post",
                data: t
            })
        }
        function f(t) {
            return Object(u["a"])({
                url: "/biz/chat/sendScheduledMsg",
                method: "post",
                data: t
            })
        }
        function p(t, e) {
            return Object(u["a"])({
                url: "/biz/chat/scheduledMessageList",
                method: "post",
                params: t,
                data: e
            })
        }
        function m(t) {
            return Object(u["a"])({
                url: "/biz/chat/batchDelScheduledMessage",
                method: "delete",
                data: t
            })
        }
        function g(t) {
            return Object(u["a"])({
                url: "/biz/chat/sendCallMsg",
                method: "post",
                data: t
            })
        }
        function O(t) {
            return Object(u["a"])({
                url: "/biz/chat/sendContactMsg",
                method: "post",
                data: t
            })
        }
        function j(t) {
            return Object(u["a"])({
                url: "/biz/chatwsgroup/sendContactMsg",
                method: "post",
                data: t
            })
        }
        function z(t) {
            return Object(u["a"])({
                url: "/biz/chat/chatLogList",
                method: "get",
                params: t
            })
        }
        function w(t) {
            return Object(u["a"])({
                url: "/biz/chat/setRead/" + t,
                method: "post"
            })
        }
        function T(t) {
            return Object(u["a"])({
                url: "/biz/chatwsgroup/setRead/" + t,
                method: "post"
            })
        }
        function C(t) {
            return Object(u["a"])({
                url: "/biz/chat/getContactInfo/" + t,
                method: "get"
            })
        }
        function v(t) {
            return Object(u["a"])({
                url: "/biz/chat/getSmList",
                method: "get",
                params: t
            })
        }
        function y(t) {
            return Object(u["a"])({
                url: "/biz/chat/fanyi",
                method: "post",
                data: t
            })
        }
        function S(t) {
            return Object(u["a"])({
                url: "/biz/chat/getAddressBookChat",
                method: "get",
                params: t
            })
        }
        function k(t) {
            return Object(u["a"])({
                url: "/biz/chat/getAddressBookList",
                method: "get",
                params: t
            })
        }
        function I(t) {
            return Object(u["a"])({
                url: "/biz/chat/pullContact",
                method: "post",
                data: t,
                timeout: 2e6
            })
        }
        function A(t) {
            return Object(u["a"])({
                url: "/biz/chat/setting",
                method: "post",
                data: t
            })
        }
        function L(t) {
            return Object(u["a"])({
                url: "/biz/chat/setFanyi",
                method: "post",
                data: t
            })
        }
        function x(t) {
            return Object(u["a"])({
                url: "/biz/chat/getChatUserInfo",
                method: "get",
                params: t
            })
        }
        function $(t) {
            return Object(u["a"])({
                url: "/biz/chat/revokeMsg",
                method: "post",
                data: t
            })
        }
        function M(t) {
            return E.apply(this, arguments)
        }
        function E() {
            return E = Object(a["a"])(Object(r["a"])().mark((function t(e) {
                var n;
                return Object(r["a"])().wrap((function(t) {
                    while (1)
                        switch (t.prev = t.next) {
                        case 0:
                            return t.next = 2,
                            Object(u["c"])();
                        case 2:
                            return n = Math.floor(1e10 * Math.random()),
                            e.ab = n,
                            t.abrupt("return", Object(u["a"])({
                                url: "/biz/chat/getAccountChats",
                                method: "get",
                                params: e,
                                headers: {
                                    abcCode: Object(c["b"])()
                                }
                            }));
                        case 5:
                        case "end":
                            return t.stop()
                        }
                }
                ), t)
            }
            ))),
            E.apply(this, arguments)
        }
        function D(t) {
            return Object(u["a"])({
                url: "/biz/chat/getNotRead",
                method: "get",
                params: t
            })
        }
        function R(t) {
            return Object(u["a"])({
                url: "/biz/chat/setTop",
                method: "post",
                data: t
            })
        }
        function q() {
            return Object(u["a"])({
                url: "/biz/chat/getFanyiCount",
                method: "get"
            })
        }
        function G(t) {
            return Object(u["a"])({
                url: "/biz/chat/checkChatLogType/" + t,
                method: "post"
            })
        }
        function F(t) {
            return Object(u["a"])({
                url: "/biz/chat/setBlock",
                method: "post",
                data: t
            })
        }
        function B(t) {
            return Object(u["a"])({
                url: "/biz/chat/sendLocationMsg",
                method: "post",
                data: t
            })
        }
        function _(t) {
            return Object(u["a"])({
                url: "/biz/chatgroup/list",
                method: "get",
                params: t
            })
        }
        function N(t) {
            return Object(u["a"])({
                url: "/biz/chatgroup/add",
                method: "post",
                data: t
            })
        }
        function Q(t) {
            return Object(u["a"])({
                url: "biz/chatgroup/edit",
                method: "post",
                data: t
            })
        }
        function V(t) {
            return Object(u["a"])({
                url: "biz/chatgroup/delete/" + t,
                method: "post"
            })
        }
        function W(t, e) {
            return Object(u["a"])({
                url: "/biz/chatgroup/chat/" + t,
                method: "post",
                data: e
            })
        }
        function H(t) {
            return Object(u["a"])({
                url: "/biz/qmessagegroup/list",
                method: "get",
                params: t
            })
        }
        function U(t) {
            return Object(u["a"])({
                url: "/biz/qmessagegroup/add",
                method: "post",
                data: t
            })
        }
        function J(t) {
            return Object(u["a"])({
                url: "/biz/qmessagegroup/edit",
                method: "post",
                data: t
            })
        }
        function P(t, e) {
            return Object(u["a"])({
                url: "/biz/qmessagegroup/delete/" + t,
                method: "post",
                data: e
            })
        }
        function K(t) {
            return Object(u["a"])({
                url: "/biz/qmessagestore/list",
                method: "get",
                params: t
            })
        }
        function X(t) {
            return Object(u["a"])({
                url: "/biz/qmessagestore/add",
                method: "post",
                data: t
            })
        }
        function Y(t) {
            return Object(u["a"])({
                url: "/biz/qmessagestore/edit",
                method: "post",
                data: t
            })
        }
        function Z(t) {
            return Object(u["a"])({
                url: "/biz/qmessagestore/delete/" + t,
                method: "post"
            })
        }
        function tt(t) {
            return Object(u["a"])({
                url: "/biz/records/add",
                method: "post",
                data: t
            })
        }
        function et(t) {
            return Object(u["a"])({
                url: "/biz/records/edit",
                method: "post",
                data: t
            })
        }
        function nt(t) {
            return Object(u["a"])({
                url: "/biz/records/delete/" + t,
                method: "post"
            })
        }
        function rt(t) {
            return Object(u["a"])({
                url: "/biz/chat/delChat/" + t,
                method: "post"
            })
        }
        function at(t) {
            return Object(u["a"])({
                url: "/biz/chat/checkAccount",
                method: "get",
                params: t
            })
        }
        function ut(t) {
            return ct.apply(this, arguments)
        }
        function ct() {
            return ct = Object(a["a"])(Object(r["a"])().mark((function t(e) {
                var n;
                return Object(r["a"])().wrap((function(t) {
                    while (1)
                        switch (t.prev = t.next) {
                        case 0:
                            return t.next = 2,
                            Object(u["c"])();
                        case 2:
                            return n = Math.floor(1e10 * Math.random()),
                            e.ab = n,
                            t.abrupt("return", Object(u["a"])({
                                url: "/biz/chatwsgroup/chats",
                                method: "get",
                                params: e,
                                headers: {
                                    abcCode: Object(c["b"])()
                                }
                            }));
                        case 5:
                        case "end":
                            return t.stop()
                        }
                }
                ), t)
            }
            ))),
            ct.apply(this, arguments)
        }
        function ot(t) {
            return Object(u["a"])({
                url: "/biz/chatwsgroup/addGroupChat",
                method: "post",
                data: t
            })
        }
        function it(t) {
            return Object(u["a"])({
                url: "/biz/chatwsgroup/getGroupChatinfo",
                method: "get",
                params: t
            })
        }
        function st(t) {
            return Object(u["a"])({
                url: "/biz/chatwsgroup/chatLogList",
                method: "get",
                params: t
            })
        }
        function dt(t) {
            return Object(u["a"])({
                url: "/biz/chatwsgroup/sendMsg",
                method: "post",
                data: t
            })
        }
        function ht(t) {
            return Object(u["a"])({
                url: "/biz/chatwsgroup/sendSmMsg",
                method: "post",
                data: t
            })
        }
        function lt(t) {
            return Object(u["a"])({
                url: "/biz/smstore/addForwardHyperlink",
                method: "post",
                data: t
            })
        }
        function bt(t) {
            return Object(u["a"])({
                url: "/biz/chat/getForwardHyperlinkInfo",
                method: "get",
                params: t
            })
        }
        function ft(t) {
            return Object(u["a"])({
                url: "/biz/chat/getSm",
                method: "post",
                data: t
            })
        }
        function pt(t, e) {
            return Object(u["a"])({
                url: "/biz/chatwsgroup/members",
                method: "get",
                params: t
            })
        }
        function mt(t) {
            return Object(u["a"])({
                url: "/biz/wsgroup/readStatus/list",
                method: "get",
                params: t
            })
        }
        function gt(t) {
            return Object(u["a"])({
                url: "/biz/chatwsgroup/quitGroup",
                method: "post",
                data: t
            })
        }
        function Ot(t) {
            return Object(u["a"])({
                url: "/biz/smstore/addImageTextlink",
                method: "post",
                data: t
            })
        }
        function jt(t) {
            return Object(u["a"])({
                url: "/biz/chatwsgroup/setTop",
                method: "post",
                data: t
            })
        }
        function zt(t) {
            return Object(u["a"])({
                url: "/biz/chat/setReadAll",
                method: "post",
                data: t
            })
        }
        function wt(t) {
            return Object(u["a"])({
                url: "/biz/chatwsgroup/removeMembers",
                method: "post",
                data: t
            })
        }
        function Tt(t) {
            return Object(u["a"])({
                url: "/biz/chat/csAccountGroups",
                method: "get",
                params: t
            })
        }
        function Ct(t) {
            return Object(u["a"])({
                url: "biz/chatgroup/list",
                method: "get",
                params: t
            })
        }
        function vt(t) {
            return Object(u["a"])({
                url: "biz/chat/setAccountTop",
                method: "post",
                data: t
            })
        }
        function yt(t) {
            return Object(u["a"])({
                url: "biz/userinfo/edit",
                method: "post",
                data: t
            })
        }
        function St(t) {
            return Object(u["a"])({
                url: "biz/chat/setAccountRemark",
                method: "post",
                data: t
            })
        }
        function kt(t) {
            return Object(u["a"])({
                url: "/biz/chat/setChatAIStatus",
                method: "post",
                data: t
            })
        }
        function It(t) {
            return Object(u["a"])({
                url: "/biz/chat/fanyiOgg",
                method: "post",
                data: t
            })
        }
        function At(t) {
            return Object(u["a"])({
                url: "/biz/chat/setReplyApiStatus",
                method: "post",
                data: t
            })
        }
        function Lt(t) {
            return Object(u["a"])({
                url: "/biz/chat/chatFile",
                method: "post",
                data: t
            })
        }
        function xt(t) {
            return Object(u["a"])({
                url: "/biz/chatwsgroup/setAdmin",
                method: "post",
                data: t
            })
        }
        function $t(t) {
            return Object(u["a"])({
                url: "/biz/chatwsgroup/demoteAdmin",
                method: "post",
                data: t
            })
        }
        function Mt(t) {
            return Object(u["a"])({
                url: "/biz/chatwsgroup/setGroupSubject",
                method: "post",
                data: t
            })
        }
        function Et(t) {
            return Object(u["a"])({
                url: "/biz/chatwsgroup/setGroupDescription",
                method: "post",
                data: t
            })
        }
        function Dt(t) {
            return Object(u["a"])({
                url: "/biz/chatwsgroup/setGroupAvatar",
                method: "post",
                data: t
            })
        }
        function Rt(t) {
            return Object(u["a"])({
                url: "/biz/chatwsgroup/locked",
                method: "post",
                data: t
            })
        }
        function qt(t) {
            return Object(u["a"])({
                url: "/biz/chatwsgroup/announcement",
                method: "post",
                data: t
            })
        }
        function Gt(t) {
            return Object(u["a"])({
                url: "/biz/chatwsgroup/revokeMsg",
                method: "post",
                data: t
            })
        }
        function Ft(t) {
            return Object(u["a"])({
                url: "/biz/chatwsgroup/exportChatLog",
                method: "post",
                data: t
            })
        }
        function Bt(t) {
            return Object(u["a"])({
                url: "/biz/chat/sendReactionMsg",
                method: "post",
                data: t
            })
        }
        function _t(t) {
            return Object(u["a"])({
                url: "/biz/groupchat/cleanup/cleanByWsIds",
                method: "post",
                data: t
            })
        }
        function Nt(t) {
            return Object(u["a"])({
                url: "/biz/groupchat/cleanup/cleanAllByCharge",
                method: "post",
                data: t
            })
        }
    }
}]);
