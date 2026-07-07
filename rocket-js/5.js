(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["chunk-56503e6a", "chunk-b4ac4ab0", "chunk-b4ac4ab0", "chunk-702761b3", "chunk-17a0b410", "chunk-0df285f1", "chunk-2386087b"], {
    "0505": function(t, e, a) {},
    "0541": function(t, e, a) {
        var s = a("23e7")
          , i = a("1a2d");
        s({
            target: "Object",
            stat: !0
        }, {
            hasOwn: i
        })
    },
    "0b04": function(t, e, a) {},
    "0de8": function(t, e, a) {
        "use strict";
        a("29d6")
    },
    1020: function(t, e, a) {
        "use strict";
        a.d(e, "d", (function() {
            return i
        }
        )),
        a.d(e, "c", (function() {
            return n
        }
        )),
        a.d(e, "a", (function() {
            return o
        }
        )),
        a.d(e, "e", (function() {
            return r
        }
        )),
        a.d(e, "b", (function() {
            return c
        }
        ));
        var s = a("b775");
        function i(t) {
            return Object(s["a"])({
                url: "/biz/fanslabel/list",
                method: "get",
                params: t
            })
        }
        function n(t) {
            return Object(s["a"])({
                url: "/biz/fanslabel/" + t,
                method: "get"
            })
        }
        function o(t) {
            return Object(s["a"])({
                url: "/biz/fanslabel",
                method: "post",
                data: t
            })
        }
        function r(t) {
            return Object(s["a"])({
                url: "/biz/fanslabel",
                method: "put",
                data: t
            })
        }
        function c(t) {
            return Object(s["a"])({
                url: "/biz/fanslabel/" + t,
                method: "delete"
            })
        }
    },
    "102e": function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("div", {
                staticClass: "mian-box",
                class: 0 == t.itemData.isSen ? "left-box" : "right-box"
            }, [1 == t.itemData.isSend ? a("el-card", {
                staticClass: "box-card",
                nativeOn: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onMyContextmenu(e, t.itemData)
                    }
                }
            }, [a("div", {
                staticClass: "card-top"
            }, [a("div", {
                staticClass: "titleTop"
            }, [t._v(t._s(t.$t("newchat.materialLibrary.forwardSuperLink")))]), a("div", {
                staticClass: "title"
            }, [t._v(t._s(t.title))]), a("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(t._s(t.content))])]), a("div", {
                staticClass: "card-bot"
            }, [a("el-button", {
                attrs: {
                    type: "text"
                },
                on: {
                    click: t.getForwardLinkDetail
                }
            }, [t._v(t._s(t.$t("newchat.materialLibrary.viewDetails")))])], 1)]) : a("el-card", {
                staticClass: "box-card",
                nativeOn: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onOtherContextmenu(e, t.itemData)
                    }
                }
            }, [a("div", {
                staticClass: "card-top"
            }, [a("div", {
                staticClass: "titleTop"
            }, [t._v(t._s(t.$t("newchat.materialLibrary.forwardSuperLink")))]), a("div", {
                staticClass: "title"
            }, [t._v(t._s(t.title))]), a("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(t._s(t.content))])]), t.itemData.smId ? a("div", {
                staticClass: "card-bot"
            }, [a("el-button", {
                attrs: {
                    type: "text"
                },
                on: {
                    click: t.getForwardLinkDetail
                }
            }, [t._v(t._s(t.$t("newchat.materialLibrary.viewDetails")))])], 1) : t._e()]), 1 == t.itemData.isSendType ? a("div", {
                staticClass: "loading-icon"
            }, [a("i", {
                staticClass: "el-icon-loading"
            })]) : t._e(), a("el-dialog", {
                attrs: {
                    title: t.$t("newchat.materialLibrary.viewDetails"),
                    visible: t.forwardLinkDetailVisible,
                    width: "400px",
                    "before-close": t.handleClose,
                    "append-to-body": ""
                },
                on: {
                    "update:visible": function(e) {
                        t.forwardLinkDetailVisible = e
                    }
                }
            }, [a("div", [a("el-card", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.forwardLinkLoading,
                    expression: "forwardLinkLoading"
                }],
                staticClass: "box-card"
            }, [a("div", {
                staticClass: "card-top"
            }, [a("div", {
                staticClass: "titleTop"
            }, [t._v(t._s(t.$t("newchat.materialLibrary.forwardSuperLink")))]), a("div", {
                staticClass: "title"
            }, [t._v(t._s(t.forwardLinkDetail.title))]), a("div", {
                staticClass: "content-box"
            }, [t._v(t._s(t.forwardLinkDetail.content))])]), a("div", {
                staticClass: "button_list"
            }, t._l(t.forwardLinkDetail.buttons, (function(e) {
                return a("div", {
                    staticClass: "button_item"
                }, [t._v(" " + t._s(e.text) + " : " + t._s(e.businessOwnerJid) + " ")])
            }
            )), 0)])], 1)])], 1)
        }
          , i = []
          , n = (a("ac1f"),
        a("5319"),
        a("5b81"),
        a("a15b"),
        a("fb6a"),
        a("6b98"))
          , o = a("f77b")
          , r = {
            mixins: [n["a"]],
            props: ["itemData"],
            data: function() {
                return {
                    forwardLinkDetail: {
                        title: "",
                        content: "",
                        buttons: []
                    },
                    title: "",
                    content: "",
                    forwardLinkDetailVisible: !1,
                    forwardLinkLoading: !1
                }
            },
            computed: {},
            mounted: function() {
                this.splitSuperLink()
            },
            methods: {
                splitSuperLink: function() {
                    var t = this.itemData.text.split("\n");
                    this.title = t[0].replaceAll("*", ""),
                    this.content = t.slice(1).join("\n")
                },
                getForwardLinkDetail: function() {
                    var t = this;
                    this.forwardLinkDetailVisible = !0,
                    this.forwardLinkLoading = !0,
                    console.log(this.itemData);
                    var e = {
                        smId: this.itemData.smId,
                        buttonId: this.itemData.buttonId
                    };
                    Object(o["N"])(e).then((function(e) {
                        t.forwardLinkLoading = !1,
                        t.forwardLinkDetail = e.info;
                        var a = e.info.text.split("\n");
                        t.forwardLinkDetail.title = a[0].replaceAll("*", ""),
                        t.forwardLinkDetail.content = a.slice(1).join("\n"),
                        t.forwardLinkDetail.buttons = e.info.buttons
                    }
                    ))
                },
                handleClose: function() {
                    this.forwardLinkDetailVisible = !1,
                    this.forwardLinkDetail = {
                        title: "",
                        content: "",
                        buttons: []
                    }
                }
            }
        }
          , c = r
          , l = (a("faef"),
        a("2877"))
          , u = Object(l["a"])(c, s, i, !1, null, "ea29afe6", null);
        e["default"] = u.exports
    },
    "11a4": function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("div", {
                staticClass: "mian-box",
                class: 0 == t.itemData.isSen ? "left-box" : "right-box"
            }, [1 == t.itemData.isSend ? a("el-card", {
                staticClass: "box-card",
                nativeOn: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onMyContextmenu(e, t.itemData)
                    }
                }
            }, [a("div", {
                staticClass: "card-top"
            }, [a("div", {
                staticStyle: {
                    display: "flex"
                }
            }, [a("div", {
                staticClass: "left"
            }, [t.itemData.thumbnail ? [a("el-image", {
                staticStyle: {
                    width: "60px",
                    height: "60px"
                },
                attrs: {
                    src: t.itemData.thumbnail,
                    fit: "cover"
                }
            })] : [a("div", {
                staticClass: "noImage"
            }, [t._v(t._s(t.$t("newchat.materialLibrary.noImage")))])]], 2), a("div", {
                staticClass: "right"
            }, [a("div", {
                staticClass: "title"
            }, [t._v(t._s(t.itemData.title))]), "12" == t.itemData.sType ? a("div", {
                staticClass: "content-box text-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(t._s(t.itemData.text))]) : t._e(), a("div", {
                staticClass: "content-box body-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(t._s(t.itemData.body))])])])]), a("div", {
                staticClass: "card-bot"
            }, [t.itemData.sourceUrls ? t._l(t.itemData.sourceUrls, (function(e) {
                return a("div", {
                    key: e.sourceUrl
                }, [a("el-link", {
                    attrs: {
                        href: e.sourceUrl || e.text,
                        target: "_blank",
                        type: "info"
                    },
                    nativeOn: {
                        click: function(t) {
                            t.stopPropagation()
                        }
                    }
                }, [t._v(t._s(t.$t("newchat.materialLibrary.link")) + "：" + t._s(e.sourceUrl || e.text || "/"))])], 1)
            }
            )) : [a("el-link", {
                attrs: {
                    href: t.itemData.sourceUrl || t.itemData.text,
                    target: "_blank",
                    type: "info"
                },
                nativeOn: {
                    click: function(t) {
                        t.stopPropagation()
                    }
                }
            }, [t._v(t._s(t.$t("newchat.materialLibrary.link")) + "：" + t._s(t.itemData.sourceUrl || t.itemData.text || "/"))])]], 2)]) : a("el-card", {
                staticClass: "box-card",
                nativeOn: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onOtherContextmenu(e, t.itemData)
                    }
                }
            }, [a("div", {
                staticClass: "card-top"
            }, [a("div", {
                staticStyle: {
                    display: "flex"
                }
            }, [a("div", {
                staticClass: "left"
            }, [t.itemData.thumbnail ? [a("el-image", {
                staticStyle: {
                    width: "60px",
                    height: "60px"
                },
                attrs: {
                    src: t.itemData.thumbnail,
                    fit: "cover"
                }
            })] : [a("div", {
                staticClass: "noImage"
            }, [t._v(t._s(t.$t("newchat.materialLibrary.noImage")))])]], 2), a("div", {
                staticClass: "right"
            }, [a("div", {
                staticClass: "title"
            }, [t._v(t._s(t.itemData.title))]), "12" == t.itemData.sType ? a("div", {
                staticClass: "content-box text-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(t._s(t.itemData.text))]) : t._e(), a("div", {
                staticClass: "content-box body-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(t._s(t.itemData.body))])])])]), a("div", {
                staticClass: "card-bot"
            }, [a("div", {
                staticStyle: {
                    "padding-top": "5px",
                    "text-align": "left"
                },
                on: {
                    click: function(t) {
                        t.stopPropagation()
                    }
                }
            }, [t.itemData.sourceUrls ? t._l(t.itemData.sourceUrls, (function(e) {
                return a("div", {
                    key: e.sourceUrl
                }, [a("el-link", {
                    attrs: {
                        href: e.sourceUrl || e.text,
                        target: "_blank",
                        type: "info"
                    }
                }, [t._v(t._s(t.$t("newchat.materialLibrary.link")) + "：" + t._s(e.sourceUrl || e.text || "/"))])], 1)
            }
            )) : [a("el-link", {
                attrs: {
                    href: t.itemData.sourceUrl || t.itemData.text,
                    target: "_blank",
                    type: "info"
                }
            }, [t._v(t._s(t.$t("newchat.materialLibrary.link")) + "：" + t._s(t.itemData.sourceUrl || t.itemData.text || "/"))])]], 2)])]), 1 == t.itemData.isSendType ? a("div", {
                staticClass: "loading-icon"
            }, [a("i", {
                staticClass: "el-icon-loading"
            })]) : t._e()], 1)
        }
          , i = []
          , n = a("6b98")
          , o = {
            name: "TextImageTemplate",
            mixins: [n["a"]],
            props: ["itemData"],
            data: function() {
                return {}
            },
            computed: {},
            mounted: function() {},
            methods: {}
        }
          , r = o
          , c = (a("34fa"),
        a("2877"))
          , l = Object(c["a"])(r, s, i, !1, null, "eba10ce2", null);
        e["default"] = l.exports
    },
    1275: function(t, e, a) {
        "use strict";
        a("22af")
    },
    "160a": function(t, e, a) {
        "use strict";
        a("edbf")
    },
    "1a99": function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , s = t._self._c || e;
            return s("div", {
                staticClass: "mian-box",
                class: 0 == t.itemData.isSend ? "left-box" : "right-box"
            }, [s("div", {
                staticClass: "lrbox",
                on: {
                    contextmenu: function(e) {
                        e.preventDefault(),
                        0 == t.itemData.isSend ? t.onOtherContextmenu(e, t.itemData) : t.onMyContextmenu(e, t.itemData)
                    }
                }
            }, [s("div", {
                staticClass: "originalOll"
            }, [s("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap"
                }
            }, [t.checkIsUrl(t.itemData.chatVideo ? t.itemData.chatContent : t.itemData.text) ? s("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [s("el-link", {
                staticStyle: {
                    width: "100%"
                },
                attrs: {
                    type: "primary",
                    href: t.itemData.chatVideo ? t.itemData.chatContent : t.itemData.text,
                    target: "_blank"
                },
                nativeOn: {
                    click: function(t) {
                        t.stopPropagation()
                    }
                }
            }, [t._v(t._s(t.itemData.chatVideo ? t.itemData.chatContent : t.itemData.text))])], 1) : s("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t.itemData.chatVideo ? s("div", [t._v(" " + t._s(t.itemData.chatContent) + " ")]) : s("div", t._l(t.parsedContent(), (function(e, a) {
                return s("span", {
                    key: a
                }, [e.isMention ? [s("el-tooltip", {
                    attrs: {
                        content: e.jid,
                        placement: "top"
                    }
                }, [s("el-tag", {
                    staticClass: "mention-tag2",
                    attrs: {
                        type: "primary",
                        size: "mini"
                    }
                }, [t._v(t._s(e.text))])], 1)] : [s("span", {
                    staticClass: "normal-text"
                }, [t._v(t._s(e.text))])]], 2)
            }
            )), 0)])])]), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.chatwindow.translate"),
                    placement: "right"
                }
            }, [0 == t.itemData.isSend && t.chargeId ? s("div", {
                staticClass: "translateIcon"
            }, [t.canTranslateTime ? s("el-image", {
                staticStyle: {
                    width: "15px",
                    height: "15px"
                },
                attrs: {
                    src: a("69b7"),
                    fit: "cover"
                },
                on: {
                    click: function(e) {
                        return t.translateClickLink(t.itemData)
                    }
                }
            }) : s("div", {
                staticClass: "translateWart"
            }, [t._v(t._s(t.translateTime))])], 1) : t._e()])], 1), t.isTranslate || t.itemData.chatVideo || t.itemData.chatOriginal || t.itemData.chatTranslate ? s("div", {
                ref: "item_content_list",
                staticClass: "item_content original",
                on: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onTranslateContextmenu(e, t.itemData.chatVideo)
                    }
                }
            }, [s("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t.isTranslate ? s("i", {
                staticClass: "el-icon-loading"
            }) : [t.itemData.chatVideo || t.itemData.chatOriginal ? s("div", [t._v(" " + t._s(t.$t("newchat.chatwindow.original")) + "：" + t._s(t.itemData.chatVideo || t.itemData.chatOriginal) + " ")]) : t._e(), t.itemData.chatTranslate ? s("div", [t._v(" " + t._s(t.$t("newchat.chatwindow.translate")) + "：" + t._s(t.itemData.chatTranslate) + " ")]) : t._e()]], 2)]) : t._e(), 1 == t.itemData.isSendType ? s("div", {
                staticClass: "loading-icon"
            }, [s("i", {
                staticClass: "el-icon-loading"
            })]) : t._e()])
        }
          , i = []
          , n = (a("b64b"),
        a("d81d"),
        a("ac1f"),
        a("14d9"),
        a("fb6a"),
        a("caad"),
        a("2532"),
        a("7db0"),
        a("d3b7"),
        a("6b98"))
          , o = a("f77b")
          , r = a("61f7")
          , c = {
            mixins: [n["a"]],
            props: ["itemData"],
            data: function() {
                return {
                    isTranslate: !1,
                    canTranslateTime: !0,
                    translateTime: 5
                }
            },
            computed: {
                checkIsUrl: function() {
                    return function(t) {
                        return Object(r["d"])(t)
                    }
                },
                parsedContent: function() {
                    var t = this;
                    return function() {
                        if (!t.itemData.chatExtensionContent)
                            return [{
                                text: t.itemData.text || t.itemData.chatContent,
                                isMention: !1
                            }];
                        var e, a = JSON.parse(t.itemData.chatExtensionContent), s = JSON.parse(a.chatExtensionContent), i = t.itemData.text || t.itemData.chatContent, n = s.map((function(t) {
                            return t.jid
                        }
                        )), o = /@([0-9]+)/g, r = 0, c = [], l = function() {
                            e.index > r && c.push({
                                text: i.slice(r, e.index),
                                isMention: !1
                            });
                            var t = e[1];
                            if (n.includes(t)) {
                                var a = s.find((function(e) {
                                    return e.jid === t
                                }
                                ))
                                  , l = t;
                                a && (l = a.nickName || t),
                                c.push({
                                    text: "@".concat(l),
                                    jid: t,
                                    isMention: !0
                                })
                            } else
                                c.push({
                                    text: e[0],
                                    jid: t,
                                    isMention: !1
                                });
                            r = o.lastIndex
                        };
                        while (null !== (e = o.exec(i)))
                            l();
                        return r < i.length && c.push({
                            text: i.slice(r),
                            isMention: !1
                        }),
                        c
                    }
                }
            },
            mounted: function() {},
            methods: {
                translateClickLink: function(t) {
                    var e = this;
                    if (this.canTranslateTime) {
                        this.canTranslateTime = !1;
                        var a = setInterval((function() {
                            e.translateTime--
                        }
                        ), 1e3);
                        setTimeout((function() {
                            e.canTranslateTime = !0,
                            e.translateTime = 5,
                            clearInterval(a)
                        }
                        ), 5e3);
                        var s = t.text;
                        if (s)
                            if (this.translateSettingData.receive) {
                                this.isTranslate = !0;
                                var i = {
                                    sourceLang: this.translateSettingData.receives,
                                    sourceText: t.text,
                                    targetLang: this.translateSettingData.receive
                                };
                                Object(o["A"])(i).then((function(a) {
                                    t.chatTranslate = a.result,
                                    e.isTranslate = !1,
                                    e.$emit("getFanyiCount")
                                }
                                ))
                            } else
                                this.$store.dispatch("newChat/SET_TRANSLATE_SETTING_VISIBLE", !0);
                        else
                            this.$message.warning(this.$t("newchat.chatwindow.nothingTranslate"))
                    }
                }
            }
        }
          , l = c
          , u = (a("f78e"),
        a("2877"))
          , d = Object(u["a"])(l, s, i, !1, null, "1c4a15a4", null);
        e["default"] = d.exports
    },
    "1c34": function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("div", {
                staticClass: "big-box",
                staticStyle: {
                    height: "75vh"
                }
            }, [a("div", {
                staticClass: "searchTopBox",
                staticStyle: {
                    "margin-bottom": "10px"
                }
            }, [t.isManager ? t._e() : a("el-radio-group", {
                directives: [{
                    name: "hasRole",
                    rawName: "v-hasRole",
                    value: ["csr"],
                    expression: "['csr']"
                }],
                attrs: {
                    size: "small"
                },
                on: {
                    input: t.materialTypeChange
                },
                model: {
                    value: t.materialType,
                    callback: function(e) {
                        t.materialType = e
                    },
                    expression: "materialType"
                }
            }, [a("el-radio-button", {
                attrs: {
                    label: 0
                }
            }, [t._v(t._s(t.$t("newchat.materialLibrary.privateMaterial")))]), a("el-radio-button", {
                attrs: {
                    label: 1
                }
            }, [t._v(t._s(t.$t("newchat.materialLibrary.publicMaterial")))])], 1), "0" !== t.tabsType ? a("div", {
                staticClass: "searchBox"
            }, [a("el-form", {
                ref: "searchForm",
                attrs: {
                    model: t.searchFormData,
                    inline: ""
                }
            }, [a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.smName")
                }
            }, [a("el-input", {
                staticStyle: {
                    width: "200px"
                },
                attrs: {
                    placeholder: t.$t("newchat.materialLibrary.smName"),
                    clearable: "",
                    size: "small"
                },
                on: {
                    change: t.searchForm
                },
                model: {
                    value: t.searchFormData.smName,
                    callback: function(e) {
                        t.$set(t.searchFormData, "smName", e)
                    },
                    expression: "searchFormData.smName"
                }
            })], 1), a("el-form-item", {
                directives: [{
                    name: "hasRole",
                    rawName: "v-hasRole",
                    value: ["charge"],
                    expression: "['charge']"
                }],
                attrs: {
                    label: t.$t("newchat.materialLibrary.isUse")
                }
            }, [a("el-select", {
                staticStyle: {
                    width: "100px"
                },
                attrs: {
                    size: "small",
                    clearable: ""
                },
                on: {
                    change: t.searchForm
                },
                model: {
                    value: t.searchFormData.status,
                    callback: function(e) {
                        t.$set(t.searchFormData, "status", e)
                    },
                    expression: "searchFormData.status"
                }
            }, [a("el-option", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.yes"),
                    value: 1
                }
            }), a("el-option", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.no"),
                    value: 0
                }
            })], 1)], 1), a("el-form-item", [a("el-button", {
                attrs: {
                    size: "mini"
                },
                on: {
                    click: t.resetSearchForm
                }
            }, [t._v(" " + t._s(t.$t("newchat.materialLibrary.reset")) + " ")]), a("el-button", {
                attrs: {
                    type: "primary",
                    size: "mini"
                },
                on: {
                    click: t.searchForm
                }
            }, [t._v(" " + t._s(t.$t("newchat.materialLibrary.search")) + " ")])], 1)], 1)], 1) : t._e()], 1), t.isLockedSType ? a("el-alert", {
                staticStyle: {
                    "margin-bottom": "10px"
                },
                attrs: {
                    type: "info",
                    closable: !1,
                    "show-icon": "",
                    title: t.$t("newchat.chatwindow.onlyVoiceMaterial")
                }
            }) : t._e(), a("el-tabs", {
                staticClass: "tabs-box",
                attrs: {
                    type: "card",
                    "before-leave": t.beforeTabLeave
                },
                on: {
                    "tab-click": t.changeTabs
                },
                model: {
                    value: t.tabsType,
                    callback: function(e) {
                        t.tabsType = e
                    },
                    expression: "tabsType"
                }
            }, [a("el-tab-pane", {
                staticClass: "tab_pane",
                attrs: {
                    label: this.$t("newchat.materialLibrary.image"),
                    name: "1",
                    disabled: t.isTabLocked("1")
                }
            }), 0 != t.materialType || t.hideTextMaterialType ? t._e() : a("el-tab-pane", {
                staticClass: "tab_pane",
                attrs: {
                    label: this.$t("newchat.materialLibrary.text"),
                    name: "0",
                    disabled: t.isTabLocked("0")
                }
            }), a("el-tab-pane", {
                staticClass: "tab_pane",
                attrs: {
                    label: this.$t("newchat.materialLibrary.video"),
                    name: "3",
                    disabled: t.isTabLocked("3")
                }
            }), a("el-tab-pane", {
                staticClass: "tab_pane",
                attrs: {
                    label: this.$t("newchat.materialLibrary.audio"),
                    name: "4",
                    disabled: t.isTabLocked("4")
                }
            }), a("el-tab-pane", {
                staticClass: "tab_pane businessCard",
                attrs: {
                    label: this.$t("newchat.materialLibrary.businessCard"),
                    name: "7",
                    disabled: t.isTabLocked("7")
                }
            }), a("el-tab-pane", {
                staticClass: "tab_pane",
                attrs: {
                    label: this.$t("newchat.materialLibrary.file"),
                    name: "2",
                    disabled: t.isTabLocked("2")
                }
            }), a("el-tab-pane", {
                staticClass: "tab_pane link",
                attrs: {
                    label: this.$t("newchat.materialLibrary.link"),
                    name: "9",
                    disabled: t.isTabLocked("9")
                }
            }), 1 !== t.scene ? a("el-tab-pane", {
                staticClass: "tab_pane",
                attrs: {
                    label: "GIF",
                    name: "8",
                    disabled: t.isTabLocked("8")
                }
            }) : t._e(), 1 !== t.scene ? a("el-tab-pane", {
                staticClass: "tab_pane",
                attrs: {
                    label: this.$t("newchat.materialLibrary.expression"),
                    name: "5",
                    disabled: t.isTabLocked("5")
                }
            }) : t._e(), 1 !== t.scene ? a("el-tab-pane", {
                staticClass: "tab_pane",
                attrs: {
                    label: t.$t("newchat.materialLibrary.forwardSuperLink"),
                    name: "11",
                    disabled: t.isTabLocked("11") || !t.isManager && t.accountUsername && null != t.accountUsername.groupId
                }
            }) : t._e(), 1 !== t.scene ? a("el-tab-pane", {
                staticClass: "tab_pane",
                attrs: {
                    label: t.$t("newchat.materialLibrary.imageLink"),
                    name: "12",
                    disabled: t.isTabLocked("12") || !t.isManager && t.accountUsername && null != t.accountUsername.groupId
                }
            }) : t._e(), 1 !== t.scene ? a("el-tab-pane", {
                staticClass: "tab_pane",
                attrs: {
                    label: t.$t("newchat.materialLibrary.imageTextTemplate"),
                    name: "13",
                    disabled: t.isTabLocked("13") || !t.isManager && t.accountUsername && null != t.accountUsername.groupId
                }
            }) : t._e()], 1), "0" === t.tabsType || t.scene ? t._e() : a("el-tag", {
                directives: [{
                    name: "hasRole",
                    rawName: "v-hasRole",
                    value: ["charge"],
                    expression: "['charge']"
                }],
                staticStyle: {
                    "margin-bottom": "10px"
                },
                attrs: {
                    type: "info"
                }
            }, [a("i", {
                staticClass: "el-icon-info"
            }), t._v(" " + t._s(t.$t("newchat.materialLibrary.materialManagerTip")) + " ")]), a("div", {
                staticClass: "groupTextBox"
            }, [a("div", {
                staticClass: "groupBox"
            }, [a("div", {
                staticClass: "title"
            }, [t._v(t._s(t.$t("newchat.materialLibrary.groupList")))]), a("div", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.textGroupLoading,
                    expression: "textGroupLoading"
                }],
                staticClass: "groupItemBox"
            }, [t._l(t.textGroupList, (function(e) {
                return a("div", {
                    staticClass: "groupItem",
                    class: e.id == t.activeNum ? "active" : "",
                    on: {
                        click: function(a) {
                            return t.groupItemClick(e)
                        }
                    }
                }, [a("el-tooltip", {
                    attrs: {
                        content: e.groupName,
                        placement: "left",
                        "open-delay": 500
                    }
                }, [a("div", {
                    staticClass: "groupName"
                }, [t._v(" " + t._s(e.groupName) + " ")])]), a("div", {
                    staticClass: "groupNum"
                }, [t._v("(" + t._s(e.smCount || 0) + ")")])], 1)
            }
            )), 0 == t.textGroupList.length ? a("el-empty", {
                attrs: {
                    description: t.$t("newchat.notice.nodata")
                }
            }) : t._e()], 2), t.materialType ? t._e() : a("div", {
                staticClass: "butList"
            }, [a("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.materialLibrary.add"),
                    placement: "top"
                }
            }, [a("el-button", {
                attrs: {
                    type: "primary",
                    icon: "el-icon-plus",
                    size: "mini"
                },
                on: {
                    click: t.textGroupAdd
                }
            })], 1), a("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.materialLibrary.edit"),
                    placement: "top"
                }
            }, [a("el-button", {
                attrs: {
                    type: "success",
                    icon: "el-icon-edit",
                    size: "mini",
                    disabled: t.activeNum <= 0
                },
                on: {
                    click: t.textGroupEdit
                }
            })], 1), a("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.materialLibrary.delete"),
                    placement: "top"
                }
            }, [a("el-button", {
                attrs: {
                    type: "danger",
                    icon: "el-icon-close",
                    size: "mini",
                    disabled: t.activeNum <= 0
                },
                on: {
                    click: t.textGroupDel
                }
            })], 1)], 1)]), t.activeNum >= 0 ? a("div", {
                staticClass: "textBoxOut"
            }, [a("div", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.tabsLoading,
                    expression: "tabsLoading"
                }],
                staticStyle: {
                    "min-height": "100px"
                }
            }, ["0" === t.tabsType ? a("div", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.qmessagegroupLoading,
                    expression: "qmessagegroupLoading"
                }],
                staticClass: "textBox"
            }, [t.materialType ? t._e() : a("div", {
                staticClass: "groupText addGroupText",
                on: {
                    click: t.groupTextAdd
                }
            }, [a("i", {
                staticClass: "el-icon-circle-plus-outline",
                staticStyle: {
                    "margin-bottom": "10px",
                    "font-size": "20px",
                    color: "#67C23A"
                }
            }), t._v(t._s(t.$t("newchat.materialLibrary.add")) + " ")]), t._l(t.userLogList, (function(e) {
                return a("div", {
                    staticClass: "groupText",
                    class: t.isManager ? "" : "material-item",
                    staticStyle: {
                        position: "relative"
                    }
                }, [a("div", {
                    staticClass: "groupText-box",
                    staticStyle: {
                        "padding-top": "25px"
                    }
                }, [a("div", {
                    staticClass: "title",
                    staticStyle: {
                        "margin-bottom": "5px"
                    }
                }, [t._v(t._s(e.messageName))]), a("div", {
                    staticClass: "info"
                }, [t._v(t._s(e.messageContent))])]), a("div", {
                    staticClass: "edit-but-list"
                }, [a("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        content: t.$t("newchat.materialLibrary.view"),
                        placement: "top"
                    }
                }, [a("div", {
                    staticClass: "view-icon",
                    on: {
                        click: function(a) {
                            return a.stopPropagation(),
                            t.groupTextClick(e)
                        }
                    }
                }, [a("i", {
                    staticClass: "el-icon-view"
                })])]), a("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        content: t.$t("newchat.materialLibrary.edit"),
                        placement: "top"
                    }
                }, [0 === t.materialType ? a("div", {
                    staticClass: "edit-icon",
                    on: {
                        click: function(a) {
                            return a.stopPropagation(),
                            t.openEditText(e)
                        }
                    }
                }, [a("i", {
                    staticClass: "el-icon-edit"
                })]) : t._e()]), a("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        content: t.$t("newchat.materialLibrary.delete"),
                        placement: "top"
                    }
                }, [0 === t.materialType ? a("div", {
                    staticClass: "del-icon",
                    on: {
                        click: function(a) {
                            return a.stopPropagation(),
                            t.qmessagestoreDel(e)
                        }
                    }
                }, [a("i", {
                    staticClass: "el-icon-delete"
                })]) : t._e()])], 1), a("div", {
                    staticClass: "back-icon",
                    on: {
                        dblclick: function(a) {
                            return t.sendQRText(e)
                        }
                    }
                }, [a("span", [t._v(t._s(t.$t("newchat.materialLibrary.dbSend")))])])])
            }
            ))], 2) : a("div", {
                staticClass: "textBox_ImgBox"
            }, [t.materialType || "1" !== t.tabsType && "2" !== t.tabsType && "3" !== t.tabsType && "4" !== t.tabsType && "7" !== t.tabsType ? t._e() : a("div", {
                staticClass: "groupText addGroupText",
                on: {
                    click: t.groupTextAdd
                }
            }, [a("i", {
                staticClass: "el-icon-circle-plus-outline",
                staticStyle: {
                    "margin-bottom": "10px",
                    "font-size": "20px",
                    color: "#67C23A"
                }
            }), t._v(t._s(t.$t("newchat.materialLibrary.add")) + " ")]), t.materialType || "9" !== t.tabsType && "11" !== t.tabsType && "12" !== t.tabsType && "13" !== t.tabsType ? t._e() : a("div", {
                staticClass: "groupText addGroupText",
                on: {
                    click: function(e) {
                        return t.openLink(t.tabsType)
                    }
                }
            }, [a("i", {
                staticClass: "el-icon-circle-plus-outline",
                staticStyle: {
                    "margin-bottom": "10px",
                    "font-size": "20px",
                    color: "#67C23A"
                }
            }), t._v(t._s(t.$t("newchat.materialLibrary.add")) + " ")]), t._l(t.userLogList, (function(e, s) {
                return a("div", {
                    key: e.id,
                    class: t.isManager ? "" : "material-item",
                    staticStyle: {
                        position: "relative"
                    }
                }, [a("div", {
                    staticClass: "pane-col img-col",
                    staticStyle: {
                        "padding-top": "30px"
                    }
                }, ["1" === t.tabsType ? [a("div", {
                    staticClass: "sm-name"
                }, [a("el-image", {
                    staticStyle: {
                        width: "100%",
                        "flex-grow": "1",
                        cursor: "pointer",
                        "max-height": "200px"
                    },
                    attrs: {
                        src: e.fileUrl + "?x-oss-process=image/resize,w_100,m_lfit",
                        fit: "cover"
                    }
                })], 1)] : "2" === t.tabsType ? [a("LogFile", {
                    attrs: {
                        itemData: e,
                        nolog: !0
                    }
                })] : "3" === t.tabsType ? [a("div", {
                    staticClass: "log-item-video-box"
                }, [a("video", {
                    ref: "log_item_video",
                    refInFor: !0,
                    staticClass: "log-item-video",
                    staticStyle: {
                        background: "#eee"
                    },
                    attrs: {
                        src: e.fileUrl
                    }
                }), a("div", {
                    ref: "log_item_video_icon",
                    refInFor: !0,
                    staticClass: "mask-box"
                }, [a("i", {
                    staticClass: "el-icon-video-play icon"
                })])])] : "4" === t.tabsType ? [a("div", [a("i", {
                    staticClass: "el-icon-mic"
                }), t._v(t._s(e.seconds) + "s")])] : "5" === t.tabsType ? [a("Expression", {
                    attrs: {
                        itemData: e
                    }
                })] : "7" === t.tabsType ? [a("BusinessCard", {
                    attrs: {
                        itemData: e,
                        nolog: !0
                    }
                })] : "8" === t.tabsType ? [a("Expression", {
                    attrs: {
                        itemData: e,
                        nolog: !0
                    }
                })] : "9" === t.tabsType ? [a("div", {
                    staticStyle: {
                        display: "flex",
                        width: "100%"
                    }
                }, [a("el-image", {
                    staticStyle: {
                        width: "80px",
                        height: "80px",
                        "object-fit": "cover",
                        "flex-shrink": "0"
                    },
                    attrs: {
                        src: e.thumbnail,
                        fit: "cover"
                    }
                }), a("div", {
                    staticStyle: {
                        flex: "1",
                        width: "100px"
                    }
                }, [a("div", {
                    staticClass: "title",
                    staticStyle: {
                        "margin-left": "5px",
                        "word-wrap": "break-word"
                    }
                }, [t._v(t._s(e.title))]), a("div", {
                    staticClass: "content-box body-box",
                    staticStyle: {
                        "white-space": "nowrap",
                        "text-align": "left"
                    }
                }, [t._v(t._s(e.body))])])], 1)] : "11" === t.tabsType ? [a("div", {
                    staticStyle: {
                        width: "100%"
                    }
                }, [a("div", {
                    staticClass: "forwardSuperLinkTitle"
                }, [t._v(t._s(t.$t("newchat.materialLibrary.forwardSuperLink")))]), a("div", {
                    staticClass: "forwardSuperLinkContent"
                }, [t._v(t._s(e.text))])])] : "12" === t.tabsType ? [a("div", {
                    staticStyle: {
                        display: "flex",
                        width: "100%"
                    }
                }, [a("el-image", {
                    staticStyle: {
                        width: "80px",
                        height: "80px",
                        "object-fit": "cover",
                        "flex-shrink": "0"
                    },
                    attrs: {
                        src: e.thumbnail,
                        fit: "cover"
                    }
                }), a("div", {
                    staticStyle: {
                        flex: "1",
                        width: "100px"
                    }
                }, [a("div", {
                    staticClass: "title",
                    staticStyle: {
                        "margin-left": "5px",
                        "word-wrap": "break-word"
                    }
                }, [t._v(t._s(e.title))]), a("div", {
                    staticClass: "content-box text-box",
                    staticStyle: {
                        "white-space": "nowrap",
                        "text-align": "left"
                    }
                }, [t._v(t._s(e.text))]), a("div", {
                    staticClass: "content-box body-box",
                    staticStyle: {
                        "white-space": "nowrap",
                        "text-align": "left"
                    }
                }, [t._v(t._s(e.body))])])], 1)] : "13" === t.tabsType ? [a("div", {
                    staticStyle: {
                        display: "flex",
                        width: "100%"
                    }
                }, [a("el-image", {
                    staticStyle: {
                        width: "80px",
                        height: "80px",
                        "object-fit": "cover",
                        "flex-shrink": "0"
                    },
                    attrs: {
                        src: e.thumbnail,
                        fit: "cover"
                    }
                }), a("div", {
                    staticStyle: {
                        flex: "1",
                        width: "100px"
                    }
                }, [a("div", {
                    staticClass: "title",
                    staticStyle: {
                        "margin-left": "5px",
                        "word-wrap": "break-word"
                    }
                }, [t._v(t._s(e.title))]), a("div", {
                    staticClass: "content-box body-box",
                    staticStyle: {
                        "white-space": "nowrap",
                        "text-align": "left"
                    }
                }, [t._v(t._s(e.body))])])], 1)] : t._e(), a("div", {
                    staticClass: "sm-name"
                }, [t._v(t._s(e.smName || "/"))]), a("div", {
                    directives: [{
                        name: "hasRole",
                        rawName: "v-hasRole",
                        value: ["charge"],
                        expression: "['charge']"
                    }],
                    staticClass: "change-status",
                    on: {
                        click: function(t) {
                            t.stopPropagation()
                        }
                    }
                }, [t._v(" " + t._s(t.$t("newchat.materialLibrary.isUse")) + "： "), a("el-switch", {
                    attrs: {
                        "active-value": 1,
                        "inactive-value": 0,
                        size: "mini"
                    },
                    on: {
                        change: function(a) {
                            return t.changeStatus(e)
                        }
                    },
                    model: {
                        value: e.status,
                        callback: function(a) {
                            t.$set(e, "status", a)
                        },
                        expression: "item.status"
                    }
                })], 1)], 2), a("div", {
                    staticClass: "edit-but-list"
                }, [a("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        content: t.$t("newchat.materialLibrary.view"),
                        placement: "top"
                    }
                }, [a("div", {
                    staticClass: "view-icon",
                    on: {
                        click: function(a) {
                            return a.stopPropagation(),
                            t.openVideoDia(e)
                        }
                    }
                }, [a("i", {
                    staticClass: "el-icon-view"
                })])]), a("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        content: t.$t("newchat.materialLibrary.edit"),
                        placement: "top"
                    }
                }, [0 === t.materialType ? a("div", {
                    staticClass: "edit-icon",
                    on: {
                        click: function(a) {
                            return a.stopPropagation(),
                            t.editMaterial(e)
                        }
                    }
                }, [a("i", {
                    staticClass: "el-icon-edit"
                })]) : t._e()]), a("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        content: t.$t("newchat.materialLibrary.delete"),
                        placement: "top"
                    }
                }, [0 === t.materialType ? a("div", {
                    staticClass: "del-icon",
                    on: {
                        click: function(a) {
                            return a.stopPropagation(),
                            t.deleteMaterial(e)
                        }
                    }
                }, [a("i", {
                    staticClass: "el-icon-delete"
                })]) : t._e()])], 1), a("div", {
                    staticClass: "back-icon",
                    on: {
                        dblclick: function(a) {
                            return t.sendDirectlyMaterial(e)
                        }
                    }
                }, [a("span", [t._v(t._s(t.$t("newchat.materialLibrary.dbSend")))])])])
            }
            ))], 2), 0 == t.userLogList.length ? a("el-empty", {
                attrs: {
                    description: t.$t("newchat.notice.nodata")
                }
            }) : t._e()], 1)]) : t._e()]), a("el-pagination", {
                staticClass: "paginationBox",
                attrs: {
                    background: "",
                    "hide-on-single-page": !0,
                    "current-page": t.pageNum,
                    "page-size": t.pageSize,
                    layout: "total, prev, pager, next, jumper",
                    total: t.total
                },
                on: {
                    "size-change": t.sizeChange,
                    "current-change": t.changePage
                }
            }), a("el-dialog", {
                attrs: {
                    visible: t.senTextGroupVisibleMaterial,
                    title: t.textGroupData.messageName,
                    "append-to-body": "",
                    center: "",
                    width: "600px"
                },
                on: {
                    "update:visible": function(e) {
                        t.senTextGroupVisibleMaterial = e
                    }
                }
            }, [a("div", {
                staticClass: "title",
                staticStyle: {
                    "text-align": "center",
                    "font-size": "20px",
                    "margin-bottom": "15px"
                }
            }, [t._v(" " + t._s(t.$t("newchat.materialLibrary.materialName")) + "：" + t._s(t.sendItemData.smName || "/") + " ")]), 3 == t.sendItemData.sType ? a("video", {
                ref: "log_item_video",
                staticClass: "log-item-video",
                staticStyle: {
                    width: "100%",
                    height: "500px"
                },
                attrs: {
                    autoplay: "",
                    controls: "",
                    src: t.sendItemData.fileUrl
                }
            }) : 4 == t.sendItemData.sType ? a("div", {
                staticStyle: {
                    display: "flex",
                    "justify-content": "center"
                }
            }, [a("Audio", {
                attrs: {
                    itemData: t.sendItemData
                }
            })], 1) : 2 == t.sendItemData.sType ? a("div", {
                staticStyle: {
                    display: "flex",
                    "justify-content": "center"
                }
            }, [a("LogFile", {
                attrs: {
                    itemData: t.sendItemData
                }
            })], 1) : 1 == t.sendItemData.sType ? a("div", {
                staticStyle: {
                    display: "flex",
                    "justify-content": "center",
                    "flex-direction": "column"
                }
            }, [a("el-image", {
                staticStyle: {
                    width: "100%",
                    cursor: "pointer",
                    "max-height": "500px"
                },
                attrs: {
                    src: t.sendItemData.fileUrl + "?x-oss-process=image/resize,w_200,m_lfit",
                    fit: "cover",
                    "preview-src-list": [t.sendItemData.fileUrl]
                }
            })], 1) : 5 == t.sendItemData.sType ? a("div", {
                staticStyle: {
                    display: "flex",
                    "justify-content": "center"
                }
            }, [a("Expression", {
                attrs: {
                    itemData: t.sendItemData
                }
            })], 1) : 7 == t.sendItemData.sType ? a("div", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.diaLoading,
                    expression: "diaLoading"
                }],
                staticStyle: {
                    "max-height": "600px",
                    overflow: "auto"
                }
            }, [t._l(t.contactInfo, (function(e) {
                return a("el-card", {
                    key: e.id,
                    staticClass: "box-card",
                    staticStyle: {
                        cursor: "auto",
                        "margin-bottom": "10px"
                    }
                }, [a("div", {
                    staticClass: "card-top"
                }, [a("div", {
                    staticClass: "name"
                }, [t._v(t._s(e.displayName))])]), t._l(t.phonesList(e.phones), (function(e) {
                    return a("div", {
                        staticClass: "phone-box"
                    }, [a("div", {
                        staticClass: "phone"
                    }, [t._v(t._s(e))])])
                }
                ))], 2)
            }
            )), 0 == t.contactInfo.length ? a("el-empty", {
                attrs: {
                    description: t.$t("newchat.notice.nodata")
                }
            }) : t._e()], 2) : 8 == t.sendItemData.sType ? a("div", {
                staticStyle: {
                    display: "flex",
                    "justify-content": "center"
                }
            }, [a("Expression", {
                attrs: {
                    itemData: t.sendItemData
                }
            })], 1) : 9 == t.sendItemData.sType ? a("div", {
                staticStyle: {
                    display: "flex",
                    "justify-content": "center"
                }
            }, [a("ImageLink", {
                attrs: {
                    itemData: t.sendItemData
                }
            })], 1) : 11 == t.sendItemData.sType ? a("div", {
                staticClass: "superLinkBoxIn",
                staticStyle: {
                    display: "flex",
                    "justify-content": "center"
                }
            }, [a("el-card", {
                staticClass: "box-card"
            }, [a("div", {
                staticClass: "card-top"
            }, [a("div", {
                staticClass: "titleTop"
            }, [t._v(t._s(t.$t("newchat.materialLibrary.forwardSuperLink")))]), a("div", {
                staticClass: "title"
            }, [t._v(t._s(t.splitSuperLink(t.sendItemData.text).title))]), a("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(t._s(t.splitSuperLink(t.sendItemData.text).content))])]), a("div", {
                staticClass: "card-bot"
            }, [a("el-button", {
                attrs: {
                    type: "text"
                },
                on: {
                    click: function(e) {
                        return t.getForwardLinkDetail(t.sendItemData)
                    }
                }
            }, [t._v(t._s(t.$t("newchat.materialLibrary.viewDetails")))])], 1)])], 1) : 12 == t.sendItemData.sType ? a("div", {
                staticStyle: {
                    display: "flex",
                    "justify-content": "center"
                }
            }, [a("ImageLink", {
                attrs: {
                    itemData: t.sendItemData
                }
            })], 1) : 13 == t.sendItemData.sType ? a("div", {
                staticStyle: {
                    display: "flex",
                    "justify-content": "center"
                }
            }, [a("TextImageTemplate", {
                attrs: {
                    itemData: t.sendItemData
                }
            })], 1) : t._e(), t.sendItemData.caption ? a("div", {
                staticClass: "title",
                staticStyle: {
                    "margin-top": "10px"
                }
            }, [t._v(t._s(t.$t("newchat.materialLibrary.caption")) + "：" + t._s(t.sendItemData.caption))]) : t._e(), a("div", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [t.isManager ? t._e() : a("el-button", {
                attrs: {
                    type: "primary",
                    loading: t.buttonLoading
                },
                on: {
                    click: t.sendMaterial
                }
            }, [t._v(t._s(t.$t("newchat.dialog.send")))])], 1)]), a("el-dialog", {
                attrs: {
                    visible: t.senTextGroupVisible,
                    title: t.textGroupData.messageName,
                    "append-to-body": "",
                    center: "",
                    width: "600px"
                },
                on: {
                    "update:visible": function(e) {
                        t.senTextGroupVisible = e
                    }
                }
            }, [a("div", {
                staticClass: "senTextGroupVisibleBox"
            }, [a("div", {
                staticClass: "info"
            }, [t._v(t._s(t.textGroupData.messageContent))])]), a("div", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [t.isManager ? t._e() : a("el-button", {
                directives: [{
                    name: "hasRole",
                    rawName: "v-hasRole",
                    value: ["csr"],
                    expression: "['csr']"
                }],
                attrs: {
                    type: "primary",
                    size: "mini"
                },
                on: {
                    click: function(e) {
                        return t.sendQRText(t.textGroupData)
                    }
                }
            }, [t._v(t._s(t.$t("newchat.materialLibrary.send")))])], 1)]), a("el-dialog", {
                attrs: {
                    visible: t.editTextGroupVisible,
                    title: t.groupTextDioTitle,
                    "append-to-body": "",
                    center: "",
                    width: "500px",
                    "close-on-click-modal": !1
                },
                on: {
                    "update:visible": function(e) {
                        t.editTextGroupVisible = e
                    },
                    close: t.clearFileForm
                }
            }, [a("el-form", {
                ref: "editTextForm",
                staticClass: "senTextGroupVisibleBox",
                attrs: {
                    model: t.editTextForm,
                    "label-width": "100px",
                    rules: t.editTextFormRules
                }
            }, [a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.smName"),
                    prop: "messageName"
                }
            }, [a("el-input", {
                attrs: {
                    maxlength: 100,
                    placeholder: t.$t("newchat.materialLibrary.pleaseEnterSmName")
                },
                model: {
                    value: t.editTextForm.messageName,
                    callback: function(e) {
                        t.$set(t.editTextForm, "messageName", "string" === typeof e ? e.trim() : e)
                    },
                    expression: "editTextForm.messageName"
                }
            })], 1), "0" === t.tabsType ? [a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.textContent"),
                    prop: "messageContent"
                }
            }, [a("el-input", {
                staticClass: "textareaInp",
                attrs: {
                    type: "textarea",
                    maxlength: "1000",
                    "show-word-limit": "",
                    placeholder: t.$t("newchat.materialLibrary.pleaseEnterTextContent"),
                    autosize: {
                        minRows: 6,
                        maxRows: 12
                    },
                    resize: "none"
                },
                model: {
                    value: t.editTextForm.messageContent,
                    callback: function(e) {
                        t.$set(t.editTextForm, "messageContent", e)
                    },
                    expression: "editTextForm.messageContent"
                }
            })], 1)] : "1" === t.tabsType ? [a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.image"),
                    prop: "fileUrl"
                }
            }, [a("el-upload", {
                ref: "imgUpload",
                staticClass: "avatar-uploader",
                attrs: {
                    action: t.fileAction,
                    "show-file-list": !1,
                    "on-change": t.fileChange,
                    "auto-upload": !1,
                    accept: ".jpg,.jpeg,.png,.gif"
                }
            }, [t.editTextForm.fileUrl ? a("img", {
                staticClass: "uploadMaterialImg",
                staticStyle: {
                    "max-width": "100%",
                    "max-height": "500px"
                },
                attrs: {
                    src: t.editTextForm.fileUrl
                }
            }) : a("i", {
                staticClass: "el-icon-plus avatar-uploader-icon"
            })]), a("div", {
                staticStyle: {
                    color: "#909399",
                    "font-size": "12px",
                    "margin-top": "10px"
                }
            }, [a("i", {
                staticClass: "el-icon-warning",
                staticStyle: {
                    "margin-right": "5px"
                }
            }), a("span", [t._v(t._s(t.$t("newchat.materialLibrary.imageUploadTips")))])])], 1), a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.caption"),
                    prop: "caption"
                }
            }, [a("el-input", {
                staticClass: "textareaInp",
                attrs: {
                    type: "textarea",
                    maxlength: "1000",
                    "show-word-limit": "",
                    placeholder: t.$t("newchat.materialLibrary.pleaseEnterTextContent"),
                    autosize: {
                        minRows: 6,
                        maxRows: 12
                    },
                    resize: "none"
                },
                model: {
                    value: t.editTextForm.caption,
                    callback: function(e) {
                        t.$set(t.editTextForm, "caption", e)
                    },
                    expression: "editTextForm.caption"
                }
            })], 1)] : "2" === t.tabsType ? [a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.file"),
                    prop: "fileUrl"
                }
            }, [a("el-upload", {
                ref: "imgUpload",
                staticClass: "avatar-uploader",
                attrs: {
                    action: t.fileAction,
                    "auto-upload": !1,
                    "on-change": t.fileChange,
                    accept: "*",
                    limit: 1,
                    "on-exceed": t.handleExceed
                }
            }, [a("el-button", {
                attrs: {
                    size: "small",
                    type: "primary"
                }
            }, [t._v(t._s(t.$t("newchat.materialLibrary.clickCheckFile")))])], 1)], 1)] : "3" === t.tabsType ? [a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.video"),
                    prop: "fileUrl"
                }
            }, [a("el-upload", {
                ref: "imgUpload",
                staticClass: "avatar-uploader",
                attrs: {
                    action: t.fileAction,
                    "show-file-list": !1,
                    "on-change": t.fileChange,
                    "auto-upload": !1,
                    accept: ".mp4"
                }
            }, [t.editTextForm.fileUrl && "mp4" == t.editTextForm.fileType ? a("video", {
                staticStyle: {
                    "max-width": "100%",
                    "max-height": "500px"
                },
                attrs: {
                    controls: ""
                }
            }, [a("source", {
                attrs: {
                    src: t.editTextForm.fileUrl,
                    type: "video/webm"
                }
            }), a("source", {
                attrs: {
                    src: t.editTextForm.fileUrl,
                    type: "video/mp4"
                }
            })]) : a("i", {
                staticClass: "el-icon-plus avatar-uploader-icon"
            })]), a("div", {
                staticStyle: {
                    color: "#909399",
                    "font-size": "12px",
                    "margin-top": "10px"
                }
            }, [a("i", {
                staticClass: "el-icon-warning",
                staticStyle: {
                    "margin-right": "5px"
                }
            }), a("span", [t._v(t._s(t.$t("newchat.materialLibrary.videoUploadTips")))])])], 1), a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.caption"),
                    prop: "caption"
                }
            }, [a("el-input", {
                staticClass: "textareaInp",
                attrs: {
                    type: "textarea",
                    maxlength: "1000",
                    "show-word-limit": "",
                    placeholder: t.$t("newchat.materialLibrary.pleaseEnterTextContent"),
                    autosize: {
                        minRows: 6,
                        maxRows: 12
                    },
                    resize: "none"
                },
                model: {
                    value: t.editTextForm.caption,
                    callback: function(e) {
                        t.$set(t.editTextForm, "caption", e)
                    },
                    expression: "editTextForm.caption"
                }
            })], 1)] : "4" === t.tabsType ? [a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.audio")
                }
            }, [a("el-upload", {
                ref: "imgUpload",
                staticClass: "avatar-uploader",
                attrs: {
                    action: t.fileAction,
                    "auto-upload": !1,
                    "on-change": t.fileChange,
                    accept: ".mp3,.ogg,.wav,.m4a",
                    limit: 1,
                    "on-exceed": t.handleExceed,
                    "on-remove": t.handleRemove
                }
            }, [a("el-button", {
                attrs: {
                    size: "small",
                    type: "primary"
                }
            }, [t._v(t._s(t.$t("newchat.materialLibrary.clickCheckFile")))])], 1), a("div", {
                staticStyle: {
                    color: "#909399",
                    "font-size": "12px",
                    "margin-top": "10px"
                }
            }, [a("i", {
                staticClass: "el-icon-warning",
                staticStyle: {
                    "margin-right": "5px"
                }
            }), a("span", [t._v(t._s(t.$t("newchat.materialLibrary.audioUploadTips")))])])], 1)] : "7" === t.tabsType ? [a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.contacts"),
                    prop: "displayName"
                }
            }, [a("el-input", {
                attrs: {
                    placeholder: t.$t("newchat.materialLibrary.contacts")
                },
                model: {
                    value: t.editTextForm.displayName,
                    callback: function(e) {
                        t.$set(t.editTextForm, "displayName", e)
                    },
                    expression: "editTextForm.displayName"
                }
            })], 1), a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.contactPhone"),
                    prop: "phone"
                }
            }, [a("el-input", {
                attrs: {
                    placeholder: t.$t("newchat.materialLibrary.contactPhone")
                },
                model: {
                    value: t.editTextForm.phone,
                    callback: function(e) {
                        t.$set(t.editTextForm, "phone", e)
                    },
                    expression: "editTextForm.phone"
                }
            })], 1)] : t._e(), t.groupTextDioAdd ? t._e() : a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.textGroup")
                }
            }, [a("el-select", {
                attrs: {
                    placeholder: t.$t("newchat.materialLibrary.pleaseSelectTextGroup")
                },
                model: {
                    value: t.editTextForm.groupId,
                    callback: function(e) {
                        t.$set(t.editTextForm, "groupId", e)
                    },
                    expression: "editTextForm.groupId"
                }
            }, t._l(t.textGroupList, (function(t) {
                return a("el-option", {
                    key: t.id,
                    attrs: {
                        label: t.groupName,
                        value: t.id
                    }
                })
            }
            )), 1)], 1), a("el-form-item", [a("el-button", {
                attrs: {
                    type: "primary",
                    size: "mini",
                    loading: t.buttonLoading
                },
                on: {
                    click: function(e) {
                        return t.addEditMaterial(t.textGroupData)
                    }
                }
            }, [t._v(t._s(t.groupTextDioAdd ? t.$t("newchat.materialLibrary.add") : t.$t("newchat.materialLibrary.modify")))]), a("el-button", {
                attrs: {
                    size: "mini"
                },
                on: {
                    click: function(e) {
                        t.editTextGroupVisible = !1
                    }
                }
            }, [t._v(t._s(t.$t("newchat.dialog.cancel")))])], 1)], 2)], 1), a("el-dialog", {
                attrs: {
                    visible: t.addForwardingLinkVisible,
                    title: t.$t("newchat.materialLibrary.addForwardingLink"),
                    "append-to-body": "",
                    center: "",
                    width: "500px",
                    "close-on-click-modal": !1
                },
                on: {
                    "update:visible": function(e) {
                        t.addForwardingLinkVisible = e
                    },
                    close: function(e) {
                        return t.resetForm("editForwardingLinkForm")
                    }
                }
            }, [a("el-form", {
                ref: "editForwardingLinkForm",
                staticClass: "senTextGroupVisibleBox",
                attrs: {
                    model: t.editForwardingLinkForm,
                    rules: t.editForwardingLinkFormRules,
                    "label-width": "110px"
                }
            }, [a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.smName"),
                    prop: "smName"
                }
            }, [a("el-input", {
                attrs: {
                    maxlength: 100,
                    size: "mini",
                    placeholder: t.$t("newchat.materialLibrary.pleaseEnterSmName")
                },
                model: {
                    value: t.editForwardingLinkForm.smName,
                    callback: function(e) {
                        t.$set(t.editForwardingLinkForm, "smName", "string" === typeof e ? e.trim() : e)
                    },
                    expression: "editForwardingLinkForm.smName"
                }
            })], 1), a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.textTitle"),
                    prop: "messageName"
                }
            }, [a("el-input", {
                attrs: {
                    maxlength: 100,
                    size: "mini",
                    placeholder: t.$t("newchat.materialLibrary.pleaseEnterTextTitle")
                },
                model: {
                    value: t.editForwardingLinkForm.messageName,
                    callback: function(e) {
                        t.$set(t.editForwardingLinkForm, "messageName", "string" === typeof e ? e.trim() : e)
                    },
                    expression: "editForwardingLinkForm.messageName"
                }
            })], 1), a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.textContent"),
                    prop: "messageContent"
                }
            }, [a("el-input", {
                staticClass: "textareaInp",
                attrs: {
                    type: "textarea",
                    maxlength: 500,
                    "show-word-limit": "",
                    placeholder: t.$t("newchat.materialLibrary.pleaseEnterTextContent"),
                    autosize: {
                        minRows: 6,
                        maxRows: 12
                    },
                    resize: "none",
                    size: "mini"
                },
                model: {
                    value: t.editForwardingLinkForm.messageContent,
                    callback: function(e) {
                        t.$set(t.editForwardingLinkForm, "messageContent", e)
                    },
                    expression: "editForwardingLinkForm.messageContent"
                }
            })], 1), a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.forwardingWsAccount"),
                    prop: "forwardingWsAccount"
                }
            }, [a("el-input", {
                attrs: {
                    type: "textarea",
                    autosize: {
                        minRows: 6,
                        maxRows: 12
                    },
                    size: "mini",
                    placeholder: t.$t("newchat.materialLibrary.pleaseEnterForwardingWsAccount")
                },
                model: {
                    value: t.editForwardingLinkForm.forwardingWsAccount,
                    callback: function(e) {
                        t.$set(t.editForwardingLinkForm, "forwardingWsAccount", e)
                    },
                    expression: "editForwardingLinkForm.forwardingWsAccount"
                }
            })], 1), a("el-form-item", [a("el-button", {
                attrs: {
                    type: "primary",
                    size: "mini",
                    loading: t.buttonLoading
                },
                on: {
                    click: t.superLinkSubmit
                }
            }, [t._v(t._s(t.$t("newchat.materialLibrary.add")))]), a("el-button", {
                attrs: {
                    size: "mini"
                },
                on: {
                    click: function(e) {
                        t.addForwardingLinkVisible = !1
                    }
                }
            }, [t._v(t._s(t.$t("newchat.dialog.cancel")))])], 1)], 1)], 1), a("el-dialog", {
                attrs: {
                    title: t.$t("newchat.materialLibrary.viewDetails"),
                    visible: t.forwardLinkDetailVisible,
                    width: "400px",
                    "before-close": t.handleClose,
                    "append-to-body": ""
                },
                on: {
                    "update:visible": function(e) {
                        t.forwardLinkDetailVisible = e
                    }
                }
            }, [a("div", {
                staticClass: "superLinkBoxIn"
            }, [a("el-card", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.forwardLinkLoading,
                    expression: "forwardLinkLoading"
                }],
                staticClass: "box-card"
            }, [a("div", {
                staticClass: "card-top"
            }, [a("div", {
                staticClass: "titleTop"
            }, [t._v(t._s(t.$t("newchat.materialLibrary.forwardSuperLink")))]), a("div", {
                staticClass: "title"
            }, [t._v(t._s(t.forwardLinkDetail.title))]), a("div", {
                staticClass: "content-box"
            }, [t._v(t._s(t.forwardLinkDetail.content))])]), a("div", {
                staticClass: "button_list"
            }, [a("el-tag", {
                staticStyle: {
                    "margin-bottom": "10px"
                },
                attrs: {
                    type: "warning",
                    size: "mini"
                }
            }, [t._v(t._s(t.$t("newchat.materialLibrary.selectRandom")))]), t._l(t.forwardLinkDetail.buttons, (function(e) {
                return a("div", {
                    staticClass: "button_item"
                }, [t._v(" " + t._s(e.text) + " : " + t._s(e.businessOwnerJid) + " ")])
            }
            ))], 2)])], 1)]), a("el-dialog", {
                attrs: {
                    visible: t.imageLinkVisible,
                    title: "add" === t.imageLinkType ? t.$t("newchat.materialLibrary.addImageLink") : t.$t("newchat.materialLibrary.editImageLink"),
                    "append-to-body": "",
                    center: "",
                    width: "600px",
                    "close-on-click-modal": !1,
                    "destroy-on-close": ""
                },
                on: {
                    "update:visible": function(e) {
                        t.imageLinkVisible = e
                    },
                    close: t.closeImageLink
                }
            }, [a("el-form", {
                ref: "imageLinkForm",
                staticClass: "senTextGroupVisibleBox",
                attrs: {
                    model: t.imageLinkForm,
                    rules: t.imageLinkFormRules,
                    "label-width": "110px"
                }
            }, [a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.smName"),
                    prop: "smName"
                }
            }, [a("el-input", {
                attrs: {
                    size: "mini",
                    placeholder: t.$t("newchat.materialLibrary.pleaseEnterSmName")
                },
                model: {
                    value: t.imageLinkForm.smName,
                    callback: function(e) {
                        t.$set(t.imageLinkForm, "smName", "string" === typeof e ? e.trim() : e)
                    },
                    expression: "imageLinkForm.smName"
                }
            })], 1), "12" === t.linkType ? a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.text"),
                    prop: "text"
                }
            }, [a("el-input", {
                staticClass: "textareaInp",
                attrs: {
                    type: "textarea",
                    maxlength: 2e3,
                    "show-word-limit": "",
                    placeholder: t.$t("newchat.materialLibrary.pleaseEnterTextContent"),
                    autosize: {
                        minRows: 6,
                        maxRows: 12
                    },
                    resize: "none",
                    size: "mini"
                },
                model: {
                    value: t.imageLinkForm.text,
                    callback: function(e) {
                        t.$set(t.imageLinkForm, "text", e)
                    },
                    expression: "imageLinkForm.text"
                }
            })], 1) : t._e(), a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.title"),
                    prop: "title"
                }
            }, [a("el-input", {
                attrs: {
                    maxlength: 100,
                    size: "mini",
                    placeholder: t.$t("newchat.materialLibrary.pleaseEnterTitle")
                },
                model: {
                    value: t.imageLinkForm.title,
                    callback: function(e) {
                        t.$set(t.imageLinkForm, "title", "string" === typeof e ? e.trim() : e)
                    },
                    expression: "imageLinkForm.title"
                }
            })], 1), a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.image"),
                    prop: "body"
                }
            }, [a("el-upload", {
                ref: "file1",
                attrs: {
                    "file-list": t.fileList,
                    action: t.fileAction,
                    "on-success": t.handleUploadSuccess,
                    "on-error": t.handleUploadError,
                    headers: t.headers,
                    data: {
                        businessType: 6,
                        type: 4
                    },
                    accept: ".jpg,.jpeg,.png",
                    "on-remove": t.fileOnRemove,
                    "list-type": "picture",
                    limit: 1
                }
            }, [a("el-button", {
                attrs: {
                    size: "small",
                    type: "primary",
                    icon: "el-icon-upload"
                }
            }, [t._v(t._s(t.$t("headPortraitMaterial.clickUpload")))])], 1)], 1), a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.content"),
                    prop: "body"
                }
            }, [a("el-input", {
                staticClass: "textareaInp",
                attrs: {
                    type: "textarea",
                    maxlength: "255",
                    "show-word-limit": "",
                    placeholder: t.$t("newchat.materialLibrary.pleaseEnterContent"),
                    autosize: {
                        minRows: 6,
                        maxRows: 12
                    },
                    resize: "none",
                    size: "mini"
                },
                model: {
                    value: t.imageLinkForm.body,
                    callback: function(e) {
                        t.$set(t.imageLinkForm, "body", e)
                    },
                    expression: "imageLinkForm.body"
                }
            })], 1), a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.link"),
                    prop: "sourceUrls"
                }
            }, [t._l(t.imageLinkForm.sourceUrls, (function(e) {
                return a("div", {
                    key: e.id,
                    staticClass: "source-urls"
                }, [a("el-input", {
                    attrs: {
                        maxlength: "500",
                        size: "mini",
                        placeholder: t.$t("newchat.materialLibrary.pleaseEnterLink")
                    },
                    model: {
                        value: e.sourceUrl,
                        callback: function(a) {
                            t.$set(e, "sourceUrl", "string" === typeof a ? a.trim() : a)
                        },
                        expression: "item.sourceUrl"
                    }
                }), t.imageLinkForm.sourceUrls.length > 1 ? a("el-button", {
                    staticStyle: {
                        "margin-left": "10px"
                    },
                    attrs: {
                        type: "text",
                        size: "mini"
                    },
                    on: {
                        click: function(a) {
                            return t.dlelteSourceUrl(e)
                        }
                    }
                }, [t._v(t._s(t.$t("newchat.materialLibrary.delete")))]) : t._e()], 1)
            }
            )), a("el-button", {
                attrs: {
                    type: "info",
                    size: "mini"
                },
                on: {
                    click: t.addSourceUrl
                }
            }, [t._v(t._s(t.$t("newchat.materialLibrary.addLink")))])], 2), a("el-form-item", [a("el-button", {
                attrs: {
                    type: "primary",
                    size: "mini",
                    loading: t.buttonLoading
                },
                on: {
                    click: t.imageLinkSubmit
                }
            }, [t._v(t._s("add" === t.imageLinkType ? t.$t("newchat.materialLibrary.add") : t.$t("newchat.materialLibrary.modify")))]), a("el-button", {
                attrs: {
                    size: "mini"
                },
                on: {
                    click: function(e) {
                        t.imageLinkVisible = !1
                    }
                }
            }, [t._v(t._s(t.$t("newchat.dialog.cancel")))])], 1)], 1)], 1), a("AddTemplateDialog", {
                ref: "addTemplateDialog",
                attrs: {
                    groupId: t.activeNum,
                    scene: t.scene
                },
                on: {
                    getSmList: t.getSmList,
                    getSmstoreGroup: t.getSmstoreGroup
                }
            })], 1)
        }
          , i = []
          , n = a("c7eb")
          , o = a("1da1")
          , r = a("5530")
          , c = (a("a9e3"),
        a("d3b7"),
        a("159b"),
        a("498a"),
        a("d9e2"),
        a("ac1f"),
        a("5319"),
        a("5b81"),
        a("d81d"),
        a("7db0"),
        a("3ca3"),
        a("ddb0"),
        a("2b3d"),
        a("9861"),
        a("99af"),
        a("b0c0"),
        a("14d9"),
        a("c740"),
        a("a434"),
        a("ed08"))
          , l = a("852e")
          , u = a.n(l)
          , d = a("bc3a")
          , h = a.n(d)
          , m = a("eb37")
          , p = a("84e6")
          , g = a("8b74")
          , f = a("4679")
          , b = a("4ba8")
          , v = a("6e25")
          , w = a("1a99")
          , L = a("805c")
          , C = a("102e")
          , y = a("dd74")
          , x = a("5f87")
          , $ = a("f77b")
          , T = a("eef2")
          , k = a("e350")
          , S = a("fac2")
          , I = a("11a4")
          , _ = {
            components: {
                Audio: m["default"],
                Video: p["default"],
                Content: g["default"],
                LogImage: f["default"],
                BusinessCard: b["default"],
                Expression: v["default"],
                LogLink: w["default"],
                LogFile: L["default"],
                SuperLink: C["default"],
                ImageLink: y["default"],
                AddTemplateDialog: S["default"],
                TextImageTemplate: I["default"]
            },
            props: {
                MTdialogVisible: {
                    type: Boolean,
                    default: !1
                },
                isManager: {
                    type: Boolean,
                    default: !1
                },
                scene: {
                    type: Number,
                    default: 0
                },
                lockedSType: {
                    type: [Number, String, null],
                    default: null
                },
                hideTextMaterialType: {
                    type: Boolean,
                    default: !1
                }
            },
            data: function() {
                var t = this;
                return {
                    userLogList: [],
                    videoVisible: !1,
                    sendItemData: {
                        sType: 0
                    },
                    contactInfo: [],
                    diaLoading: !1,
                    tabsLoading: !1,
                    pageNum: 1,
                    pageSize: 10,
                    total: 0,
                    tabsType: "1",
                    senTextGroupVisibleMaterial: !1,
                    textGroupList: [],
                    textStoreList: [],
                    activeNum: -1,
                    isEdit: !1,
                    textGroupData: {},
                    senTextGroupVisible: !1,
                    textGroupLoading: !1,
                    qmessagegroupLoading: !1,
                    editTextGroupVisible: !1,
                    editTextForm: {
                        messageName: "",
                        messageContent: "",
                        caption: "",
                        groupId: 0,
                        fileUrl: null,
                        fileType: null,
                        file: null,
                        displayName: "",
                        phone: ""
                    },
                    groupTextDioTitle: this.$t("newchat.materialLibrary.addMaterial"),
                    groupTextDioAdd: !0,
                    forwardingLinkList: [],
                    addForwardingLinkVisible: !1,
                    forwardingLinkType: "add",
                    editForwardingLinkForm: {
                        smName: "",
                        messageName: "",
                        messageContent: "",
                        forwardingWsAccount: ""
                    },
                    editForwardingLinkFormRules: {
                        smName: [{
                            required: !0,
                            message: this.$t("newchat.materialLibrary.pleaseEnterSmName"),
                            trigger: "blur"
                        }],
                        messageContent: [{
                            required: !0,
                            message: this.$t("newchat.materialLibrary.pleaseEnterTextContent"),
                            trigger: "blur"
                        }],
                        forwardingWsAccount: [{
                            required: !0,
                            message: this.$t("newchat.materialLibrary.pleaseEnterForwardingWsAccount"),
                            trigger: "blur"
                        }]
                    },
                    forwardLinkDetail: {
                        title: "",
                        content: "",
                        buttons: []
                    },
                    forwardLinkTitle: "",
                    forwardLinkContent: "",
                    forwardLinkDetailVisible: !1,
                    forwardLinkLoading: !1,
                    imageLinkForm: {
                        smName: "",
                        text: "",
                        title: "",
                        body: "",
                        sourceUrls: [{
                            sourceUrl: "",
                            id: 0
                        }],
                        smId: ""
                    },
                    imageLinkVisible: !1,
                    imageLinkType: "add",
                    imageLinkFormRules: {
                        title: [{
                            required: !0,
                            message: this.$t("newchat.materialLibrary.pleaseEnterTitle"),
                            trigger: "blur"
                        }],
                        text: [{
                            required: !0,
                            message: this.$t("newchat.materialLibrary.pleaseEnterTextContent"),
                            trigger: "blur"
                        }],
                        sourceUrls: [{
                            required: !0,
                            validator: function(e, a, s) {
                                a.forEach((function(e, a) {
                                    "" === e.sourceUrl.trim() ? s(new Error(t.$t("newchat.materialLibrary.pleaseEnterSourceUrl"))) : Object(c["l"])(e.sourceUrl) || s(new Error(t.$t("newchat.materialLibrary.sourceUrlError", [a + 1]) + t.$t("newchat.materialLibrary.pleaseEnterCorrectSourceUrl")))
                                }
                                )),
                                s()
                            },
                            trigger: "blur"
                        }]
                    },
                    fileList: [],
                    fileUrl: "",
                    fileAction: "/prod-api" + u.a.get("line") + "/biz/chat/files",
                    headers: {
                        Authorization: "Bearer " + Object(x["b"])()
                    },
                    materialType: 0,
                    searchFormData: {
                        smName: "",
                        status: 1
                    },
                    buttonLoading: !1,
                    fileUpload: !1,
                    editTextFormRules: {
                        messageName: [{
                            required: !0,
                            message: this.$t("newchat.materialLibrary.pleaseEnterSmName"),
                            trigger: "blur"
                        }],
                        messageContent: [{
                            required: !0,
                            message: this.$t("newchat.materialLibrary.pleaseEnterTextContent"),
                            trigger: "blur"
                        }],
                        fileUrl: [{
                            required: !0,
                            validator: function(e, a, s) {
                                t.editTextForm.fileUrl || s(new Error(t.$t("newchat.materialLibrary.pleaseEnterFile"))),
                                s()
                            },
                            trigger: "blur"
                        }],
                        phone: [{
                            required: !0,
                            message: this.$t("newchat.materialLibrary.pleaseEnterContactPhone"),
                            trigger: "blur"
                        }]
                    },
                    linkType: "9"
                }
            },
            mounted: function() {
                var t = this;
                null != this.lockedSType && "" !== this.lockedSType ? this.tabsType = String(this.lockedSType) : this.getSmstoreGroup().then((function(e) {
                    t.groupItemClick(t.textGroupList[0])
                }
                ))
            },
            watch: {
                lockedSType: {
                    handler: function(t) {
                        if (null != t && "" !== t) {
                            var e = String(t);
                            this.tabsType !== e && (this.tabsType = e,
                            this.changeTabs())
                        }
                    },
                    immediate: !0
                }
            },
            computed: {
                isLockedSType: function() {
                    return null != this.lockedSType && "" !== this.lockedSType
                },
                phonesList: function() {
                    return function(t) {
                        return t.split(",")
                    }
                },
                splitSuperLink: function() {
                    return function(t) {
                        var e = t.split("\n");
                        return {
                            title: e[0].replaceAll("*", ""),
                            content: e[1]
                        }
                    }
                },
                accountUsername: function() {
                    return this.$store.state.newChat.accountUserNameData
                }
            },
            methods: {
                checkRole: k["b"],
                isTabLocked: function(t) {
                    return !!this.isLockedSType && String(t) !== String(this.lockedSType)
                },
                beforeTabLeave: function(t) {
                    return null == this.lockedSType || "" === this.lockedSType || String(t) === String(this.lockedSType)
                },
                getSmstoreGroup: function() {
                    var t = this;
                    return new Promise((function(e, a) {
                        if (t.textGroupLoading = !0,
                        "0" === t.tabsType)
                            t.textGroupLoading = !0,
                            Object($["eb"])({
                                smName: t.searchFormData.smName,
                                scene: t.scene
                            }).then((function(a) {
                                t.textGroupList = a.rows.map((function(t) {
                                    return t.smCount = t.messageNum,
                                    t
                                }
                                )),
                                e(a.rows)
                            }
                            )).catch((function(t) {
                                a(t)
                            }
                            )).finally((function() {
                                t.textGroupLoading = !1
                            }
                            ));
                        else {
                            var s = {
                                isCharge: t.materialType,
                                smType: t.tabsType,
                                smName: t.searchFormData.smName,
                                scene: t.scene
                            };
                            Object(k["b"])(["csr"]) ? s.status = 1 : s.status = t.searchFormData.status,
                            Object(T["f"])(s).then((function(a) {
                                t.textGroupList = a.rows,
                                e(a.rows)
                            }
                            )).catch((function(t) {
                                a(t)
                            }
                            )).finally((function() {
                                t.textGroupLoading = !1
                            }
                            ))
                        }
                    }
                    ))
                },
                getSmList: function() {
                    var t = this;
                    this.tabsLoading = !0;
                    var e = {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        sType: this.tabsType,
                        groupId: this.activeNum,
                        isCharge: this.materialType,
                        smName: this.searchFormData.smName,
                        scene: this.scene
                    };
                    Object(k["b"])(["csr"]) ? e.status = 1 : e.status = this.searchFormData.status,
                    Object($["W"])(e).then((function(e) {
                        t.tabsLoading = !1,
                        t.userLogList = e.rows,
                        t.total = e.total
                    }
                    ))
                },
                resetSearchForm: function() {
                    this.searchFormData = {
                        smName: "",
                        status: 1
                    },
                    this.searchForm()
                },
                searchForm: function() {
                    this.getSmstoreGroup(),
                    this.activeNum >= 0 && (this.pageNum = 1,
                    "0" === this.tabsType ? this.qmessagestoreGet() : this.getSmList())
                },
                sendMaterial: function() {
                    this.videoVisible = !1,
                    this.$emit("update:MTdialogVisible", !1),
                    this.$emit("sendMeterial", this.sendItemData),
                    this.sendItemData = null
                },
                openVideoDia: function(t) {
                    var e = this;
                    this.sendItemData = t,
                    this.senTextGroupVisibleMaterial = !0,
                    7 == t.sType && (this.diaLoading = !0,
                    Object($["K"])(t.id).then((function(t) {
                        e.contactInfo = t.contactInfo.contactUsers,
                        e.diaLoading = !1
                    }
                    )))
                },
                changePage: function(t) {
                    this.pageNum = t,
                    "0" === this.tabsType ? this.qmessagestoreGet() : this.getSmList()
                },
                sizeChange: function(t) {
                    this.pageSize = t,
                    "0" === this.tabsType ? this.qmessagestoreGet() : this.getSmList()
                },
                changeTabs: function() {
                    var t = this;
                    this.userLogList = [],
                    this.pageNum = 1,
                    this.pageSize = 10,
                    this.total = 0,
                    this.activeNum = -1,
                    this.getSmstoreGroup().then((function(e) {
                        t.groupItemClick(t.textGroupList[0])
                    }
                    ))
                },
                qmessagegroupGet: function() {
                    var t = this;
                    this.textGroupLoading = !0,
                    Object($["eb"])({
                        scene: this.scene
                    }).then((function(e) {
                        t.textGroupList = e.rows,
                        t.textGroupLoading = !1
                    }
                    )).catch((function(e) {
                        t.textGroupLoading = !1
                    }
                    ))
                },
                groupItemClick: function(t) {
                    this.activeNum = t.id,
                    this.pageNum = 1,
                    this.total = 0,
                    "0" === this.tabsType ? this.qmessagestoreGet() : this.getSmList()
                },
                textGroupAdd: function() {
                    var t = this;
                    this.$prompt(this.$t("newchat.materialLibrary.pleaseEnterAddTextGroupName"), this.$t("newchat.materialLibrary.addTextGroup"), {
                        confirmButtonText: this.$t("newchat.materialLibrary.confirm"),
                        cancelButtonText: this.$t("newchat.materialLibrary.cancel"),
                        closeOnClickModal: !1,
                        inputValidator: function(e) {
                            if (!e)
                                return t.$t("newchat.materialLibrary.pleaseEnterTextGroupName")
                        }
                    }).then((function(e) {
                        var a = e.value;
                        if (a)
                            if ("0" === t.tabsType)
                                Object($["bb"])({
                                    groupName: a,
                                    scene: t.scene
                                }).then((function(e) {
                                    t.$message.success(t.$t("newchat.materialLibrary.addSuccess")),
                                    t.getSmstoreGroup()
                                }
                                ));
                            else {
                                var s = {
                                    groupName: a,
                                    smType: t.tabsType,
                                    scene: t.scene
                                };
                                Object(T["c"])(s).then((function(e) {
                                    t.$message.success(t.$t("newchat.materialLibrary.addSuccess")),
                                    t.getSmstoreGroup()
                                }
                                ))
                            }
                        else
                            t.$message.error(t.$t("newchat.materialLibrary.pleaseEnterTextGroupName"))
                    }
                    )).catch((function() {}
                    ))
                },
                textGroupEdit: function() {
                    var t = this;
                    if (this.activeNum < 0)
                        this.$message.error(this.$t("newchat.materialLibrary.pleaseSelectTextGroup"));
                    else {
                        var e = this.textGroupList.find((function(e) {
                            return e.id === t.activeNum
                        }
                        )).groupName;
                        this.$prompt(this.$t("newchat.materialLibrary.pleaseEnterTextGroupName"), this.$t("newchat.materialLibrary.editTextGroup"), {
                            confirmButtonText: this.$t("newchat.materialLibrary.confirm"),
                            cancelButtonText: this.$t("newchat.materialLibrary.cancel"),
                            closeOnClickModal: !1,
                            inputValue: e,
                            inputValidator: function(e) {
                                if (!e)
                                    return t.$t("newchat.materialLibrary.pleaseEnterTextGroupName")
                            }
                        }).then((function(e) {
                            var a = e.value;
                            a ? "0" === t.tabsType ? Object($["db"])({
                                groupName: a,
                                id: t.activeNum,
                                scene: t.scene
                            }).then((function(e) {
                                t.$message.success(t.$t("newchat.materialLibrary.editTextGroupSuccessInfo")),
                                t.getSmstoreGroup()
                            }
                            )) : Object(T["j"])({
                                groupName: a,
                                id: t.activeNum,
                                smType: t.tabsType,
                                scene: t.scene
                            }).then((function(e) {
                                t.$message.success(t.$t("newchat.materialLibrary.editTextGroupSuccessInfo")),
                                t.getSmstoreGroup()
                            }
                            )) : t.$message.error(t.$t("newchat.materialLibrary.pleaseEnterTextGroupName"))
                        }
                        )).catch((function() {}
                        ))
                    }
                },
                textGroupDel: function() {
                    var t = this;
                    this.activeNum < 0 ? this.$message.error(this.$t("newchat.materialLibrary.pleaseSelectTextGroup")) : this.$confirm(this.$t("newchat.materialLibrary.deleteTextGroupInfo"), this.$t("newchat.materialLibrary.deleteTextGroup"), {
                        confirmButtonText: this.$t("newchat.materialLibrary.confirm"),
                        cancelButtonText: this.$t("newchat.materialLibrary.cancel"),
                        type: "warning"
                    }).then((function() {
                        "0" === t.tabsType ? Object($["cb"])(t.activeNum, {
                            scene: t.scene
                        }).then((function(e) {
                            t.$message.success(t.$t("newchat.materialLibrary.deleteTextGroupSuccessInfo")),
                            t.getSmstoreGroup()
                        }
                        )) : Object(T["e"])(t.activeNum, {
                            scene: t.scene
                        }).then((function(e) {
                            t.$message.success(t.$t("newchat.materialLibrary.deleteTextGroupSuccessInfo")),
                            t.getSmstoreGroup()
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                qmessagestoreGet: function() {
                    var t = this;
                    this.qmessagegroupLoading = !0;
                    var e = {
                        groupId: this.activeNum,
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        smName: this.searchFormData.smName,
                        scene: this.scene
                    };
                    Object($["ib"])(e).then((function(e) {
                        t.userLogList = e.rows,
                        t.total = e.total,
                        t.qmessagegroupLoading = !1
                    }
                    )).catch((function(e) {
                        t.qmessagegroupLoading = !1
                    }
                    ))
                },
                groupTextClick: function(t) {
                    this.textGroupData = t,
                    this.senTextGroupVisible = !0
                },
                sendQRText: function(t) {
                    this.$emit("sendQRText", t),
                    this.senTextGroupVisible = !1,
                    this.$emit("update:MTdialogVisible", !1)
                },
                openEditText: function(t) {
                    this.groupTextDioTitle = this.$t("newchat.materialLibrary.editMaterial"),
                    this.groupTextDioAdd = !1,
                    this.editTextGroupVisible = !0,
                    this.editTextForm.messageName = t.messageName,
                    this.editTextForm.messageContent = t.messageContent,
                    this.editTextForm.groupId = t.groupId,
                    this.editTextForm.id = t.id
                },
                addEditMaterial: function(t) {
                    var e = this;
                    this.$refs.editTextForm.validate((function(a) {
                        if (a)
                            switch (e.tabsType) {
                            case "0":
                                e.editQRText(t);
                                break;
                            case "2":
                                e.addImageOfVideo();
                                break;
                            case "1":
                                e.addImageOfVideo();
                                break;
                            case "3":
                                e.addImageOfVideo();
                                break;
                            case "4":
                                e.addImageOfVideo();
                                break;
                            case "7":
                                e.addBusinessCard();
                                break
                            }
                    }
                    ))
                },
                addImageOfVideo: function() {
                    var t = this;
                    if (this.editTextForm.file) {
                        this.fullLoading = this.$loading({
                            lock: !0,
                            text: "正在上传...",
                            spinner: "el-icon-loading",
                            background: "rgba(0, 0, 0, 0.7)"
                        });
                        var e = new FormData;
                        e.append("file", this.editTextForm.file),
                        "3" === this.tabsType ? (e.append("businessType", 7),
                        e.append("type", 0)) : "1" === this.tabsType ? (e.append("businessType", 6),
                        e.append("type", 0)) : "4" === this.tabsType ? (e.append("businessType", 9),
                        e.append("type", 2),
                        e.append("seconds", this.editTextForm.seconds)) : "2" === this.tabsType && (e.append("businessType", 8),
                        e.append("type", 3)),
                        e.append("caption", this.editTextForm.caption),
                        e.append("smName", this.editTextForm.messageName),
                        e.append("groupId", this.activeNum),
                        e.append("status", 1),
                        e.append("scene", this.scene),
                        h.a.post(this.fileAction, e, {
                            headers: this.headers,
                            timeout: 2e4
                        }).then((function(e) {
                            200 == e.data.code ? (t.fullLoading.close(),
                            URL.revokeObjectURL(t.editTextForm.fileUrl),
                            t.clearFileForm(),
                            t.$message.success("上传成功"),
                            t.getSmstoreGroup(),
                            t.getSmList(),
                            t.editTextGroupVisible = !1) : (t.editTextGroupVisible = !1,
                            t.fullLoading.close(),
                            URL.revokeObjectURL(t.editTextForm.fileUrl),
                            t.clearFileForm(),
                            t.$message.error("上传失败"))
                        }
                        )).catch((function(e) {
                            t.editTextGroupVisible = !1,
                            t.fullLoading.close(),
                            URL.revokeObjectURL(t.editTextForm.fileUrl),
                            t.clearFileForm()
                        }
                        ))
                    } else
                        this.$message.error(this.$t("smStore.enterImageUrl"))
                },
                clearFileForm: function() {
                    this.$refs.imgUpload && this.$refs.imgUpload.clearFiles(),
                    this.editTextForm = {
                        messageName: "",
                        messageContent: "",
                        caption: "",
                        groupId: 0,
                        fileUrl: null,
                        fileType: null,
                        file: null,
                        displayName: "",
                        phone: ""
                    }
                },
                editQRText: function(t) {
                    var e = this;
                    if (this.groupTextDioAdd) {
                        if (!this.editTextForm.messageName || !this.editTextForm.messageContent)
                            return void this.$message.error(this.$t("newchat.materialLibrary.pleaseEnterTextContent"));
                        this.editTextForm.groupId = this.activeNum,
                        this.editTextForm.scene = this.scene,
                        this.buttonLoading = !0,
                        Object($["fb"])(this.editTextForm).then((function(t) {
                            e.$message.success(e.$t("newchat.materialLibrary.addSuccess")),
                            e.qmessagestoreGet(),
                            e.textGroupList.some((function(t, a) {
                                if (t.id == e.activeNum)
                                    return e.textGroupList[a].messageNum += 1,
                                    !0
                            }
                            )),
                            e.getSmstoreGroup()
                        }
                        )).finally((function() {
                            e.editTextGroupVisible = !1,
                            e.senTextGroupVisible = !1,
                            e.buttonLoading = !1
                        }
                        ))
                    } else {
                        if (!this.editTextForm.messageName || !this.editTextForm.messageContent)
                            return void this.$message.error(this.$t("newchat.materialLibrary.pleaseEnterTextContent"));
                        var a = Object(r["a"])({
                            id: t.id,
                            scene: this.scene
                        }, this.editTextForm);
                        this.buttonLoading = !0,
                        Object($["hb"])(a).then((function(t) {
                            e.$message.success(e.$t("newchat.materialLibrary.editTextGroupSuccessInfo")),
                            e.qmessagestoreGet(),
                            e.textGroupList.some((function(t, s) {
                                t.id == e.activeNum && (e.textGroupList[s].messageNum -= 1),
                                t.id == a.groupId && (e.textGroupList[s].messageNum += 1)
                            }
                            )),
                            e.getSmstoreGroup()
                        }
                        )).finally((function() {
                            e.editTextGroupVisible = !1,
                            e.senTextGroupVisible = !1,
                            e.buttonLoading = !1
                        }
                        ))
                    }
                },
                qmessagestoreDel: function(t) {
                    var e = this;
                    this.$confirm(this.$t("newchat.materialLibrary.deleteTextInfo"), this.$t("newchat.materialLibrary.deleteText"), {
                        confirmButtonText: this.$t("newchat.materialLibrary.confirm"),
                        cancelButtonText: this.$t("newchat.materialLibrary.cancel"),
                        type: "warning"
                    }).then((function() {
                        Object($["gb"])(t.id).then((function(t) {
                            e.$message.success(e.$t("newchat.materialLibrary.deleteTextGroupSuccessInfo")),
                            e.qmessagestoreGet(),
                            e.textGroupList.some((function(t, a) {
                                if (t.id == e.activeNum)
                                    return e.textGroupList[a].messageNum -= 1,
                                    !0
                            }
                            )),
                            e.editTextGroupVisible = !1,
                            e.senTextGroupVisible = !1
                        }
                        )).catch((function(t) {
                            e.editTextGroupVisible = !1,
                            e.senTextGroupVisible = !1
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                groupTextAdd: function() {
                    var t = this;
                    this.groupTextDioTitle = this.$t("newchat.materialLibrary.addMaterial"),
                    this.editTextGroupVisible = !0,
                    this.groupTextDioAdd = !0,
                    this.editTextForm.messageName = "",
                    this.editTextForm.messageContent = "",
                    this.editTextForm.caption = "",
                    this.editTextForm.groupId = "",
                    this.editTextForm.fileUrl = null,
                    this.editTextForm.fileType = null,
                    this.editTextForm.file = null,
                    this.editTextForm.displayName = "",
                    this.editTextForm.phone = "",
                    this.$nextTick((function() {
                        t.$refs.editTextForm.clearValidate()
                    }
                    ))
                },
                handleAvatarSuccess: function(t, e) {
                    this.fileUpload = !1,
                    this.fileUrl = t.data.url
                },
                addSuperLink: function() {
                    this.editForwardingLinkForm = {
                        smName: "",
                        messageName: "",
                        messageContent: "",
                        forwardingWsAccount: ""
                    },
                    this.addForwardingLinkVisible = !0,
                    this.forwardingLinkType = "add"
                },
                superLinkSubmit: function() {
                    var t = this;
                    this.$refs.editForwardingLinkForm.validate((function(e) {
                        if (e) {
                            var a = t.editForwardingLinkForm.forwardingWsAccount.split("\n")
                              , s = a.map((function(t) {
                                return {
                                    businessOwnerJid: t,
                                    buttonType: 1
                                }
                            }
                            ))
                              , i = {
                                text: "*".concat(t.editForwardingLinkForm.messageName, "*\n").concat(t.editForwardingLinkForm.messageContent),
                                buttons: s,
                                groupId: t.activeNum,
                                smName: t.editForwardingLinkForm.smName,
                                scene: t.scene
                            };
                            t.buttonLoading = !0,
                            Object($["c"])(i).then((function(e) {
                                t.$message.success(t.$t("newchat.materialLibrary.addSuccess")),
                                t.addForwardingLinkVisible = !1,
                                t.getSmList(),
                                t.getSmstoreGroup()
                            }
                            )).finally((function() {
                                t.buttonLoading = !1
                            }
                            ))
                        }
                    }
                    ))
                },
                getForwardLinkDetail: function(t) {
                    var e = this;
                    this.forwardLinkDetailVisible = !0,
                    this.forwardLinkLoading = !0;
                    var a = {
                        smId: t.id
                    };
                    Object($["N"])(a).then((function(t) {
                        e.forwardLinkLoading = !1,
                        e.forwardLinkDetail = t.info;
                        var a = t.info.text.split("\n");
                        e.forwardLinkDetail.title = a[0].replaceAll("*", ""),
                        e.forwardLinkDetail.content = a[1],
                        e.forwardLinkDetail.buttons = t.info.buttons
                    }
                    ))
                },
                handleClose: function() {
                    this.forwardLinkDetailVisible = !1,
                    this.forwardLinkDetail = {
                        title: "",
                        content: "",
                        buttons: []
                    }
                },
                resetForm: function(t) {
                    this.$refs[t].resetFields()
                },
                openImageLink: function() {
                    this.imageLinkForm = {
                        smName: "",
                        text: "",
                        title: "",
                        body: "",
                        sourceUrls: [{
                            sourceUrl: "",
                            id: 0
                        }],
                        smId: ""
                    },
                    this.imageLinkVisible = !0
                },
                imageLinkSubmit: function() {
                    var t = this;
                    this.$refs.imageLinkForm.validate((function(e) {
                        if (e) {
                            var a = Object(r["a"])(Object(r["a"])({}, t.imageLinkForm), {}, {
                                groupId: t.activeNum,
                                linkType: null,
                                scene: t.scene
                            });
                            "9" === t.linkType && (a.linkType = 1),
                            t.buttonLoading = !0,
                            Object($["f"])(a).then((function(e) {
                                t.$message.success(t.$t("newchat.materialLibrary.addSuccess")),
                                t.getSmList(),
                                t.getSmstoreGroup(),
                                t.imageLinkVisible = !1
                            }
                            )).finally((function() {
                                t.buttonLoading = !1
                            }
                            ))
                        }
                    }
                    ))
                },
                openTextImageTemplate: function() {
                    this.$refs.addTemplateDialog.open()
                },
                handleUploadSuccess: function(t, e, a) {
                    console.log(t),
                    200 == t.code ? (this.fileList = a,
                    this.imageLinkForm.smId = t.smMsg.id,
                    console.log(this.imageLinkForm)) : (this.$message.error(this.$t("headPortraitMaterial.uploadFailed")),
                    e.status = "error",
                    e.name = this.$t("headPortraitMaterial.uploadFailed") + t.msg + "(" + "".concat(e.name, ")"),
                    this.fileList = [])
                },
                handleUploadError: function() {
                    this.$message.error(this.$t("headPortraitMaterial.uploadFailed"))
                },
                closeImageLink: function() {
                    this.fileList = [],
                    this.$refs.imageLinkForm.resetFields(),
                    this.imageLinkForm.smId = ""
                },
                fileOnRemove: function(t, e) {
                    this.imageLinkForm.smId = ""
                },
                sendImageLink: function(t) {
                    var e = this;
                    this.$confirm(this.$t("newchat.materialLibrary.sendImageLinkInfo"), this.$t("newchat.materialLibrary.tip"), {
                        confirmButtonText: this.$t("newchat.materialLibrary.confirm"),
                        cancelButtonText: this.$t("newchat.materialLibrary.cancel"),
                        type: "warning"
                    }).then((function() {
                        e.$emit("update:MTdialogVisible", !1),
                        e.$emit("sendMeterial", t)
                    }
                    )).catch((function() {}
                    ))
                },
                deleteMaterial: function(t) {
                    var e = this;
                    this.$confirm(this.$t("newchat.materialLibrary.deleteMaterialInfo"), this.$t("newchat.materialLibrary.tip"), {
                        confirmButtonText: this.$t("newchat.materialLibrary.confirm"),
                        cancelButtonText: this.$t("newchat.materialLibrary.cancel"),
                        type: "warning"
                    }).then((function() {
                        e.buttonLoading = !0,
                        Object(T["d"])(t.id).then((function(t) {
                            e.$message.success(e.$t("newchat.materialLibrary.deleteSuccess")),
                            e.getSmList(),
                            e.getSmstoreGroup()
                        }
                        )).finally((function() {
                            e.buttonLoading = !1,
                            e.senTextGroupVisibleMaterial = !1
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                sendDirectlyMaterial: function(t) {
                    this.sendItemData = t,
                    this.$emit("update:MTdialogVisible", !1),
                    this.$emit("sendMeterial", this.sendItemData),
                    this.sendItemData = null
                },
                addSourceUrl: function() {
                    var t = this.imageLinkForm.sourceUrls[this.imageLinkForm.sourceUrls.length - 1].id;
                    this.imageLinkForm.sourceUrls.push({
                        sourceUrl: "",
                        id: t + 1
                    })
                },
                dlelteSourceUrl: function(t) {
                    var e = this.imageLinkForm.sourceUrls.findIndex((function(e) {
                        return e.id === t.id
                    }
                    ));
                    this.imageLinkForm.sourceUrls.splice(e, 1),
                    this.$refs.imageLinkForm.validateField("sourceUrls")
                },
                materialTypeChange: function() {
                    if (1 == this.materialType && "0" === this.tabsType)
                        return this.tabsType = "1",
                        void this.changeTabs();
                    this.userLogList = [],
                    this.pageNum = 1,
                    this.pageSize = 10,
                    this.total = 0,
                    this.activeNum = -1,
                    this.getSmstoreGroup()
                },
                fileChange: function(t, e) {
                    var a = this;
                    return Object(o["a"])(Object(n["a"])().mark((function s() {
                        var i, o, r;
                        return Object(n["a"])().wrap((function(s) {
                            while (1)
                                switch (s.prev = s.next) {
                                case 0:
                                    if (i = t.name.substring(t.name.lastIndexOf(".") + 1),
                                    i = i.toLowerCase(),
                                    "3" !== a.tabsType) {
                                        s.next = 7;
                                        break
                                    }
                                    if (o = t.size / 1024 / 1024 < 10,
                                    o) {
                                        s.next = 7;
                                        break
                                    }
                                    return a.$message.error(a.$t("newchat.message.videoSizeExceeds")),
                                    s.abrupt("return", !1);
                                case 7:
                                    if ("4" !== a.tabsType) {
                                        s.next = 19;
                                        break
                                    }
                                    return s.prev = 8,
                                    s.next = 11,
                                    a.getAudioTime(t.raw);
                                case 11:
                                    r = s.sent,
                                    a.editTextForm.seconds = r < 1 ? 1 : Math.round(r),
                                    s.next = 19;
                                    break;
                                case 15:
                                    s.prev = 15,
                                    s.t0 = s["catch"](8),
                                    a.clearFileForm(),
                                    a.$message.error("获取音频时长失败");
                                case 19:
                                    e.length >= 1 && (a.editTextForm.fileUrl = "",
                                    a.editTextForm.file = "",
                                    a.editTextForm.fileType = "",
                                    a.$nextTick((function() {
                                        var e = window.URL.createObjectURL(t.raw);
                                        a.$set(a.editTextForm, "fileUrl", e),
                                        a.$set(a.editTextForm, "file", t.raw),
                                        a.$set(a.editTextForm, "fileType", i),
                                        a.$refs.editTextForm.clearValidate("fileUrl")
                                    }
                                    )));
                                case 20:
                                case "end":
                                    return s.stop()
                                }
                        }
                        ), s, null, [[8, 15]])
                    }
                    )))()
                },
                getAudioTime: function(t) {
                    return new Promise((function(e, a) {
                        var s = document.createElement("audio")
                          , i = URL.createObjectURL(t);
                        s.src = i,
                        s.onloadedmetadata = Object(o["a"])(Object(n["a"])().mark((function t() {
                            return Object(n["a"])().wrap((function(t) {
                                while (1)
                                    switch (t.prev = t.next) {
                                    case 0:
                                        console.log(s.duration),
                                        s.duration && s.duration !== 1 / 0 && NaN !== s.duration ? e(s.duration) : a("音频文件损坏，请上传正确的音频文件");
                                    case 2:
                                    case "end":
                                        return t.stop()
                                    }
                            }
                            ), t)
                        }
                        )))
                    }
                    ))
                },
                addBusinessCard: function() {
                    var t = this;
                    this.buttonLoading = !0;
                    var e = {
                        displayName: this.editTextForm.displayName,
                        phone: this.editTextForm.phone,
                        smName: this.editTextForm.messageName,
                        groupId: this.activeNum,
                        scene: this.scene
                    };
                    Object(T["a"])(e).then((function(e) {
                        t.getSmstoreGroup(),
                        t.getSmList(),
                        t.editTextGroupVisible = !1
                    }
                    )).finally((function() {
                        t.buttonLoading = !1
                    }
                    ))
                },
                changeStatus: function(t) {
                    var e = this
                      , a = t.status > 0 ? this.$t("smStore.enable") : this.$t("smStore.deactivate");
                    this.$modal.confirm(this.$t("smStore.operationInfo", [a])).then((function() {
                        return Object(T["h"])(t.id, t.status)
                    }
                    )).then((function() {
                        e.$modal.msgSuccess(a + "成功")
                    }
                    )).catch((function() {
                        t.status = t.status < 1 ? 1 : 0
                    }
                    ))
                },
                editMaterial: function(t) {
                    var e = this;
                    this.$prompt(this.$t("newchat.materialLibrary.editMaterialInfo"), this.$t("newchat.materialLibrary.tip"), {
                        confirmButtonText: this.$t("newchat.materialLibrary.confirm"),
                        cancelButtonText: this.$t("newchat.materialLibrary.cancel"),
                        inputPattern: /^.{1,}$/,
                        inputValue: t.smName,
                        inputErrorMessage: this.$t("newchat.materialLibrary.inputErrorMessage")
                    }).then((function(a) {
                        var s = a.value
                          , i = {
                            id: t.id,
                            sName: s,
                            sType: e.tabsType,
                            scene: e.scene
                        };
                        Object(T["i"])(i).then((function(t) {
                            e.$modal.msgSuccess(e.$t("smStore.modifySuccess")),
                            e.getSmList()
                        }
                        ))
                    }
                    ))
                },
                handleExceed: function() {
                    this.$message.warning(this.$t("newchat.materialLibrary.fileUploadExceed"))
                },
                handleRemove: function() {
                    this.$refs.imgUpload.clearFiles(),
                    this.editTextForm.fileUrl = "",
                    this.editTextForm.file = "",
                    this.editTextForm.fileType = ""
                },
                openLink: function(t) {
                    "11" === t ? this.addSuperLink() : "12" === t ? (this.linkType = "12",
                    this.openImageLink()) : "9" === t ? (this.linkType = "9",
                    this.openImageLink()) : "13" === t && (this.linkType = "13",
                    this.openTextImageTemplate())
                }
            }
        }
          , D = _
          , A = (a("f099"),
        a("2877"))
          , U = Object(A["a"])(D, s, i, !1, null, "3f1c828f", null);
        e["default"] = U.exports
    },
    "1d45": function(t, e, a) {},
    "1f42": function(t, e, a) {},
    2113: function(t, e, a) {},
    "22af": function(t, e, a) {},
    "29d6": function(t, e, a) {},
    "2db9": function(t, e, a) {},
    "2de3": function(t, e, a) {
        "use strict";
        a.d(e, "c", (function() {
            return i
        }
        )),
        a.d(e, "A", (function() {
            return n
        }
        )),
        a.d(e, "G", (function() {
            return o
        }
        )),
        a.d(e, "f", (function() {
            return r
        }
        )),
        a.d(e, "F", (function() {
            return c
        }
        )),
        a.d(e, "H", (function() {
            return l
        }
        )),
        a.d(e, "I", (function() {
            return u
        }
        )),
        a.d(e, "J", (function() {
            return d
        }
        )),
        a.d(e, "w", (function() {
            return h
        }
        )),
        a.d(e, "a", (function() {
            return m
        }
        )),
        a.d(e, "Y", (function() {
            return p
        }
        )),
        a.d(e, "p", (function() {
            return g
        }
        )),
        a.d(e, "s", (function() {
            return f
        }
        )),
        a.d(e, "q", (function() {
            return b
        }
        )),
        a.d(e, "t", (function() {
            return v
        }
        )),
        a.d(e, "b", (function() {
            return w
        }
        )),
        a.d(e, "D", (function() {
            return L
        }
        )),
        a.d(e, "L", (function() {
            return C
        }
        )),
        a.d(e, "M", (function() {
            return y
        }
        )),
        a.d(e, "n", (function() {
            return x
        }
        )),
        a.d(e, "Q", (function() {
            return $
        }
        )),
        a.d(e, "C", (function() {
            return T
        }
        )),
        a.d(e, "l", (function() {
            return k
        }
        )),
        a.d(e, "m", (function() {
            return S
        }
        )),
        a.d(e, "N", (function() {
            return I
        }
        )),
        a.d(e, "o", (function() {
            return _
        }
        )),
        a.d(e, "K", (function() {
            return D
        }
        )),
        a.d(e, "r", (function() {
            return A
        }
        )),
        a.d(e, "d", (function() {
            return U
        }
        )),
        a.d(e, "P", (function() {
            return N
        }
        )),
        a.d(e, "k", (function() {
            return M
        }
        )),
        a.d(e, "j", (function() {
            return O
        }
        )),
        a.d(e, "e", (function() {
            return F
        }
        )),
        a.d(e, "v", (function() {
            return j
        }
        )),
        a.d(e, "V", (function() {
            return B
        }
        )),
        a.d(e, "x", (function() {
            return E
        }
        )),
        a.d(e, "y", (function() {
            return G
        }
        )),
        a.d(e, "B", (function() {
            return z
        }
        )),
        a.d(e, "O", (function() {
            return V
        }
        )),
        a.d(e, "U", (function() {
            return R
        }
        )),
        a.d(e, "X", (function() {
            return P
        }
        )),
        a.d(e, "W", (function() {
            return Q
        }
        )),
        a.d(e, "R", (function() {
            return q
        }
        )),
        a.d(e, "S", (function() {
            return H
        }
        )),
        a.d(e, "T", (function() {
            return Y
        }
        )),
        a.d(e, "h", (function() {
            return K
        }
        )),
        a.d(e, "E", (function() {
            return W
        }
        )),
        a.d(e, "i", (function() {
            return J
        }
        )),
        a.d(e, "g", (function() {
            return Z
        }
        )),
        a.d(e, "u", (function() {
            return X
        }
        )),
        a.d(e, "z", (function() {
            return tt
        }
        ));
        var s = a("b775");
        function i(t) {
            return Object(s["a"])({
                url: "/biz/account/allocation",
                method: "post",
                data: t
            })
        }
        function n(t) {
            return Object(s["a"])({
                url: "/biz/account/getCsList",
                method: "get",
                params: t
            })
        }
        function o() {
            return Object(s["a"])({
                url: "/biz/account/leadinginInfo",
                method: "get"
            })
        }
        function r(t) {
            return Object(s["a"])({
                url: "/biz/account/batchLeadingin",
                method: "post",
                data: t,
                timeout: 1e7
            })
        }
        function c(t) {
            return Object(s["a"])({
                url: "/biz/account/leadingin007",
                method: "post",
                data: t,
                timeout: 1e7
            })
        }
        function l(t) {
            return Object(s["a"])({
                url: "/biz/account/leadinginOfAllParams1",
                method: "post",
                data: t,
                timeout: 1e7
            })
        }
        function u(t) {
            return Object(s["a"])({
                url: "/biz/account/leadinginOfAppleAllParams1",
                method: "post",
                data: t,
                timeout: 1e7
            })
        }
        function d(t) {
            return Object(s["a"])({
                url: "/biz/account/list",
                method: "get",
                params: t,
                timeout: 2e5
            })
        }
        function h(t) {
            return Object(s["a"])({
                url: "/biz/account/" + t,
                method: "get"
            })
        }
        function m(t) {
            return Object(s["a"])({
                url: "/biz/account",
                method: "post",
                data: t
            })
        }
        function p(t) {
            return Object(s["a"])({
                url: "/biz/account",
                method: "put",
                data: t
            })
        }
        function g(t, e) {
            return Object(s["a"])({
                url: "/biz/account/" + t,
                params: e,
                method: "delete"
            })
        }
        function f(t) {
            return Object(s["a"])({
                url: "/biz/account/editAvatar",
                method: "post",
                data: t
            })
        }
        function b(t) {
            return Object(s["a"])({
                url: "/biz/account/delAvatar",
                method: "post",
                data: t
            })
        }
        function v(t) {
            return Object(s["a"])({
                url: "/biz/account/editNickname",
                method: "post",
                data: t
            })
        }
        function w(t) {
            return Object(s["a"])({
                url: "/biz/account/addGroup",
                method: "post",
                data: t
            })
        }
        function L(t) {
            return Object(s["a"])({
                url: "/biz/account/groupList",
                method: "get",
                params: t
            })
        }
        function C(t) {
            return Object(s["a"])({
                url: "/biz/account/login",
                method: "post",
                data: t
            })
        }
        function y(t) {
            return Object(s["a"])({
                url: "/biz/account/loginput",
                method: "post",
                data: t
            })
        }
        function x(t) {
            return Object(s["a"])({
                url: "/biz/account/changeProxy",
                method: "post",
                data: t
            })
        }
        function $(t) {
            return Object(s["a"])({
                url: "/biz/account/setAbout",
                method: "post",
                data: t
            })
        }
        function T() {
            return Object(s["a"])({
                url: "/biz/account/getLoginUserInfo",
                method: "get"
            })
        }
        function k(t) {
            return Object(s["a"])({
                url: "/biz/account/blogin",
                method: "post",
                data: t
            })
        }
        function S(t) {
            return Object(s["a"])({
                url: "/biz/account/bloginout",
                method: "post",
                data: t
            })
        }
        function I(t) {
            return Object(s["a"])({
                url: "/biz/account/move",
                method: "post",
                data: t,
                timeout: 2e6
            })
        }
        function _(t) {
            return Object(s["a"])({
                url: "/biz/account/dataMove",
                method: "post",
                data: t,
                timeout: 2e6
            })
        }
        function D(t) {
            return Object(s["a"])({
                url: "/biz/account/listAll",
                method: "get",
                params: t
            })
        }
        function A(t) {
            return Object(s["a"])({
                url: "/biz/account/delBlock",
                method: "post",
                data: t,
                timeout: 2e6
            })
        }
        function U(t) {
            return Object(s["a"])({
                url: "/biz/account/allocationAll",
                method: "post",
                data: t,
                timeout: 2e6
            })
        }
        function N(t) {
            return Object(s["a"])({
                url: "/biz/account/scanLogin",
                method: "post",
                data: t
            })
        }
        function M(t) {
            return Object(s["a"])({
                url: "/biz/account/bdel",
                method: "post",
                data: t
            })
        }
        function O(t) {
            return Object(s["a"])({
                url: "/biz/account/setBlock",
                method: "post",
                data: t
            })
        }
        function F(t) {
            return Object(s["a"])({
                url: "/biz/account/allocationCancel",
                method: "post",
                data: t,
                timeout: 2e6
            })
        }
        function j(t) {
            return Object(s["a"])({
                url: "/biz/account/fixIdentityKey",
                method: "post",
                data: t
            })
        }
        function B(t) {
            return Object(s["a"])({
                url: "/biz/account/setPin",
                method: "post",
                data: t
            })
        }
        function E(t) {
            return Object(s["a"])({
                url: "/biz/account/getAvatar",
                method: "post",
                data: t
            })
        }
        function G(t) {
            return Object(s["a"])({
                url: "/biz/account/getAvatarAll",
                method: "post",
                data: t
            })
        }
        function z(t) {
            return Object(s["a"])({
                url: "/biz/account/getLoginInfo",
                method: "get",
                params: t
            })
        }
        function V(t) {
            return Object(s["a"])({
                url: "/biz/account/delCoverPhoto",
                method: "post",
                data: t
            })
        }
        function R(t) {
            return Object(s["a"])({
                url: "/biz/account/setKeepOnline",
                method: "post",
                data: t
            })
        }
        function P(t) {
            return Object(s["a"])({
                url: "/biz/account/setBusiness",
                method: "post",
                data: t
            })
        }
        function Q(t) {
            return Object(s["a"])({
                url: "biz/chat/setAccountRemark",
                method: "post",
                data: t
            })
        }
        function q(t) {
            return Object(s["a"])({
                url: "/biz/account/setChatAIInfo",
                method: "post",
                data: t
            })
        }
        function H(t) {
            return Object(s["a"])({
                url: "/biz/account/setChatAIStatus",
                method: "post",
                data: t
            })
        }
        function Y(t) {
            return Object(s["a"])({
                url: "/biz/account/setChatAITemplate",
                method: "post",
                data: t
            })
        }
        function K(t) {
            return Object(s["a"])({
                url: "/biz/account/batchLeadinginScan",
                method: "post",
                data: t,
                timeout: 1e7
            })
        }
        function W(t) {
            return Object(s["a"])({
                url: "/biz/account/batchLeadinginIos2",
                method: "post",
                data: t,
                timeout: 1e7
            })
        }
        function J(t) {
            return Object(s["a"])({
                url: "/biz/account/batchLeadinginScanJson",
                method: "post",
                data: t,
                timeout: 1e7
            })
        }
        function Z(t) {
            return Object(s["a"])({
                url: "/biz/account/batchLeadinginAndroid3",
                method: "post",
                data: t,
                timeout: 1e7
            })
        }
        function X(t) {
            return Object(s["a"])({
                url: "/biz/account/exportAccount",
                method: "post",
                data: t
            })
        }
        function tt(t) {
            return Object(s["a"])({
                url: "/biz/friends/getCsFansCount",
                method: "get",
                params: t
            })
        }
    },
    "30c1": function(t, e, a) {
        "use strict";
        a.d(e, "v", (function() {
            return i
        }
        )),
        a.d(e, "p", (function() {
            return n
        }
        )),
        a.d(e, "c", (function() {
            return o
        }
        )),
        a.d(e, "d", (function() {
            return r
        }
        )),
        a.d(e, "u", (function() {
            return c
        }
        )),
        a.d(e, "b", (function() {
            return l
        }
        )),
        a.d(e, "w", (function() {
            return u
        }
        )),
        a.d(e, "o", (function() {
            return d
        }
        )),
        a.d(e, "k", (function() {
            return h
        }
        )),
        a.d(e, "t", (function() {
            return m
        }
        )),
        a.d(e, "s", (function() {
            return p
        }
        )),
        a.d(e, "e", (function() {
            return g
        }
        )),
        a.d(e, "x", (function() {
            return f
        }
        )),
        a.d(e, "z", (function() {
            return b
        }
        )),
        a.d(e, "y", (function() {
            return v
        }
        )),
        a.d(e, "g", (function() {
            return w
        }
        )),
        a.d(e, "i", (function() {
            return L
        }
        )),
        a.d(e, "r", (function() {
            return C
        }
        )),
        a.d(e, "l", (function() {
            return y
        }
        )),
        a.d(e, "f", (function() {
            return x
        }
        )),
        a.d(e, "h", (function() {
            return $
        }
        )),
        a.d(e, "j", (function() {
            return T
        }
        )),
        a.d(e, "a", (function() {
            return k
        }
        )),
        a.d(e, "q", (function() {
            return S
        }
        )),
        a.d(e, "n", (function() {
            return I
        }
        )),
        a.d(e, "m", (function() {
            return _
        }
        ));
        var s = a("b775");
        function i(t) {
            return Object(s["a"])({
                url: "/biz/task/list",
                method: "get",
                params: t
            })
        }
        function n(t) {
            return Object(s["a"])({
                url: "/biz/task/" + t,
                method: "get"
            })
        }
        function o(t) {
            return Object(s["a"])({
                url: "/biz/task",
                method: "post",
                data: t,
                timeout: 1e7
            })
        }
        function r(t) {
            return Object(s["a"])({
                url: "/biz/task/" + t,
                method: "delete"
            })
        }
        function c(t) {
            return Object(s["a"])({
                url: "/biz/task/info",
                method: "get",
                params: t
            })
        }
        function l(t) {
            return Object(s["a"])({
                url: "/biz/task/addLabel",
                method: "post",
                data: t
            })
        }
        function u(t, e) {
            var a = {
                id: t,
                status: e
            };
            return Object(s["a"])({
                url: "/biz/task/setStatus",
                method: "put",
                data: a
            })
        }
        function d(t) {
            return Object(s["a"])({
                url: "/biz/smstore/list",
                method: "get",
                params: t
            })
        }
        function h(t) {
            return Object(s["a"])({
                url: "/biz/task/detail/" + t,
                method: "get"
            })
        }
        function m(t) {
            return Object(s["a"])({
                url: "/biz/task/getTjList",
                method: "get",
                params: t
            })
        }
        function p(t) {
            return Object(s["a"])({
                url: "/biz/task/getTjInfo",
                method: "get",
                params: t
            })
        }
        function g(t) {
            return Object(s["a"])({
                url: "/biz/task/exportAccountTasks",
                method: "post",
                data: t
            })
        }
        function f() {
            return Object(s["a"])({
                url: "/biz/task/setStopAll",
                method: "post"
            })
        }
        function b(t) {
            return Object(s["a"])({
                url: "/biz/task/addAccount",
                method: "post",
                data: t
            })
        }
        function v(t) {
            return Object(s["a"])({
                url: "/biz/task/addResource",
                method: "post",
                data: t
            })
        }
        function w(t) {
            return Object(s["a"])({
                url: "/biz/task/getCsAccount",
                method: "get",
                params: t
            })
        }
        function L(t) {
            return Object(s["a"])({
                url: "/biz/task/getCsGroupAccount",
                method: "get",
                params: t
            })
        }
        function C() {
            return Object(s["a"])({
                url: "/biz/userinfo/info",
                method: "get"
            })
        }
        function y(t) {
            return Object(s["a"])({
                url: "/biz/groupchattask/list",
                method: "get",
                params: t
            })
        }
        function x(t) {
            return Object(s["a"])({
                url: "biz/groupchattask/getAccountGroup",
                method: "get",
                params: t
            })
        }
        function $(t) {
            return Object(s["a"])({
                url: "biz/groupchattask/getCsAccountGroup",
                method: "get",
                params: t
            })
        }
        function T(t) {
            return Object(s["a"])({
                url: "biz/groupchattask/getCsGroupAccountGroup",
                method: "get",
                params: t
            })
        }
        function k(t) {
            return Object(s["a"])({
                url: "/biz/groupchattask",
                method: "post",
                data: t
            })
        }
        function S(t) {
            return Object(s["a"])({
                url: "/biz/groupchattasklog/list",
                method: "get",
                params: t
            })
        }
        function I(t) {
            return Object(s["a"])({
                url: "/biz/smstore/".concat(t),
                method: "get"
            })
        }
        function _(t) {
            return Object(s["a"])({
                url: "/biz/task/retryList",
                method: "get",
                params: t
            })
        }
    },
    "34ca": function(t, e, a) {
        "use strict";
        a("0b04")
    },
    "34f1": function(t, e, a) {
        "use strict";
        var s = function() {
            var t = this
              , e = t.$createElement
              , s = t._self._c || e;
            return s("div", [s("el-popover", {
                ref: "popover",
                attrs: {
                    placement: "top-start",
                    width: "466",
                    trigger: "manual"
                },
                model: {
                    value: t.visible,
                    callback: function(e) {
                        t.visible = e
                    },
                    expression: "visible"
                }
            }, [s("div", {
                staticClass: "expreeList"
            }, [s("div", {
                staticClass: "layui-clear"
            }, t._l(t.expreeList, (function(e, a) {
                return s("div", {
                    key: a,
                    on: {
                        click: function(a) {
                            return t.writeIn(e)
                        }
                    }
                }, [t._v(t._s(e))])
            }
            )), 0)]), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    slot: "reference",
                    effect: "dark",
                    content: t.$t("newchat.materialLibrary.expression"),
                    placement: "top-start"
                },
                slot: "reference"
            }, [s("div", {
                staticClass: "icon-box",
                on: {
                    click: function(e) {
                        t.visible = !t.visible
                    }
                }
            }, [s("el-image", {
                staticStyle: {
                    width: "23px",
                    height: "23px"
                },
                attrs: {
                    draggable: "false",
                    src: a("524b"),
                    fit: "cover"
                }
            })], 1)])], 1)], 1)
        }
          , i = []
          , n = {
            name: "WsCssFrontMainIndex",
            data: function() {
                return {
                    visible: !1,
                    expreeList: ["😀", "😄", "😁", "😆", "😅", "😂", "🙂", "🙃", "😉", "😊", "😇", "😍", "🥰", "😘", "😗", "😋", "😛", "🤠", "😷", "😝", "😎", "🥳", "😣", "😭", "😠", "😱", "😥", "😵", "🤢", "🤑", "🤧", "💫", "❤", "💔", "💘", "💯", "💢", "💥", "💤", "👋", "👌", "✌", "🤙", "🤟", "☝", "👇", "👈", "👉", "👍", "✊", "👏", "🤝", "🙏", "👄", "👃", "🦵", "👦", "👧", "👶", "🧒", "👨", "👩", "👴", "👵", "🧑‍🎓", "🧑‍🏫", "🧑‍⚖️", "🧑‍🌾", "🐷", "🐵", "🐶", "🐱", "🐭", "🐻", "🐼", "🐔", "🐸", "🌹", "🥀", "🍉", "🍊", "🍎", "🥭", "🍒", "🍓", "🍇", "🍌", "🥚", "💍", "🕶", "💰", "🔒", "🔓"]
                }
            },
            mounted: function() {
                var t = this
                  , e = this
                  , a = this.$refs.popover;
                document.addEventListener("click", (function(s) {
                    t.visible && (a.$el.contains(s.target) || (e.visible = !1))
                }
                ))
            },
            methods: {
                writeIn: function(t) {
                    this.$emit("writeIn", t)
                }
            }
        }
          , o = n
          , r = (a("dc43"),
        a("2877"))
          , c = Object(r["a"])(o, s, i, !1, null, "74aa4964", null);
        e["a"] = c.exports
    },
    "34fa": function(t, e, a) {
        "use strict";
        a("5a23")
    },
    "38a9": function(t, e, a) {},
    "3c65": function(t, e, a) {
        "use strict";
        var s = a("23e7")
          , i = a("7b0b")
          , n = a("07fa")
          , o = a("3a34")
          , r = a("083a")
          , c = a("3511")
          , l = 1 !== [].unshift(0)
          , u = !function() {
            try {
                Object.defineProperty([], "length", {
                    writable: !1
                }).unshift()
            } catch (t) {
                return t instanceof TypeError
            }
        }();
        s({
            target: "Array",
            proto: !0,
            arity: 1,
            forced: l || u
        }, {
            unshift: function(t) {
                var e = i(this)
                  , a = n(e)
                  , s = arguments.length;
                if (s) {
                    c(a + s);
                    var l = a;
                    while (l--) {
                        var u = l + s;
                        l in e ? e[u] = e[l] : r(e, u)
                    }
                    for (var d = 0; d < s; d++)
                        e[d] = arguments[d]
                }
                return o(e, a + s)
            }
        })
    },
    "425a": function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("div", [a("el-input", {
                attrs: {
                    type: "textarea",
                    rows: 4,
                    placeholder: t.$t("newchat.translate.beTranslated")
                },
                on: {
                    change: t.setDataToFather
                },
                model: {
                    value: t.sourceText,
                    callback: function(e) {
                        t.sourceText = e
                    },
                    expression: "sourceText"
                }
            }), a("div", {
                staticClass: "select-list"
            }, [a("el-select", {
                attrs: {
                    placeholder: t.$t("newchat.chatwindow.selectSourceLanguage")
                },
                on: {
                    change: t.setDataToFather
                },
                model: {
                    value: t.sourceLang,
                    callback: function(e) {
                        t.sourceLang = e
                    },
                    expression: "sourceLang"
                }
            }, t._l(t.sourceLangOptions, (function(t) {
                return a("el-option", {
                    key: t.value,
                    attrs: {
                        label: t.label,
                        value: t.value
                    }
                })
            }
            )), 1), a("el-select", {
                attrs: {
                    placeholder: t.$t("newchat.chatwindow.selectTargetLanguage")
                },
                on: {
                    change: t.setDataToFather
                },
                model: {
                    value: t.targetLang,
                    callback: function(e) {
                        t.targetLang = e
                    },
                    expression: "targetLang"
                }
            }, t._l(t.targetLangOptions, (function(t) {
                return a("el-option", {
                    key: t.value,
                    attrs: {
                        label: t.label,
                        value: t.value
                    }
                })
            }
            )), 1)], 1), a("div", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.translateLoading,
                    expression: "translateLoading"
                }],
                staticClass: "translate-end-box"
            }, [t._v(t._s(t.transitionVal))])], 1)
        }
          , i = []
          , n = {
            props: ["translateDialogVisible", "translateLoading", "targetLanguageVal"],
            data: function() {
                return {
                    sourceText: "",
                    sourceLang: "auto",
                    targetLang: "",
                    sourceLangOptions: [{
                        label: this.$t("newchat.translate.auto"),
                        value: "auto"
                    }, {
                        label: this.$t("newchat.translate.zh"),
                        value: "zh"
                    }, {
                        label: this.$t("newchat.translate.en"),
                        value: "en"
                    }, {
                        label: this.$t("newchat.translate.jp"),
                        value: "jp"
                    }, {
                        label: this.$t("newchat.translate.kor"),
                        value: "kor"
                    }, {
                        label: this.$t("newchat.translate.fra"),
                        value: "fra"
                    }, {
                        label: this.$t("newchat.translate.pt"),
                        value: "pt"
                    }, {
                        label: this.$t("newchat.translate.spa"),
                        value: "spa"
                    }, {
                        label: this.$t("newchat.translate.de"),
                        value: "de"
                    }, {
                        label: this.$t("newchat.translate.it"),
                        value: "it"
                    }, {
                        label: this.$t("newchat.translate.ara"),
                        value: "ara"
                    }, {
                        label: this.$t("newchat.translate.el"),
                        value: "el"
                    }, {
                        label: this.$t("newchat.translate.id"),
                        value: "id"
                    }, {
                        label: this.$t("newchat.translate.hi"),
                        value: "hi"
                    }, {
                        label: this.$t("newchat.translate.vie"),
                        value: "vie"
                    }, {
                        label: this.$t("newchat.translate.th"),
                        value: "th"
                    }, {
                        label: this.$t("newchat.translate.may"),
                        value: "may"
                    }, {
                        label: this.$t("newchat.translate.ben"),
                        value: "ben"
                    }, {
                        label: this.$t("newchat.translate.bur"),
                        value: "bur"
                    }, {
                        label: this.$t("newchat.translate.aze"),
                        value: "aze"
                    }, {
                        label: this.$t("newchat.translate.ru"),
                        value: "ru"
                    }, {
                        label: this.$t("newchat.translate.tr"),
                        value: "tr"
                    }, {
                        label: this.$t("newchat.translate.hkm"),
                        value: "hkm"
                    }, {
                        label: this.$t("newchat.translate.ukr"),
                        value: "ukr"
                    }, {
                        label: this.$t("newchat.translate.ro"),
                        value: "ro"
                    }, {
                        label: this.$t("newchat.translate.pl"),
                        value: "pl"
                    }, {
                        label: this.$t("newchat.translate.hr"),
                        value: "hr"
                    }, {
                        label: this.$t("newchat.translate.hu"),
                        value: "hu"
                    }, {
                        label: this.$t("newchat.translate.nl"),
                        value: "nl"
                    }, {
                        label: this.$t("newchat.translate.fi"),
                        value: "fi"
                    }, {
                        label: this.$t("newchat.translate.sv"),
                        value: "sv"
                    }, {
                        label: this.$t("newchat.translate.kk"),
                        value: "kk"
                    }, {
                        label: this.$t("newchat.translate.bg"),
                        value: "bg"
                    }, {
                        label: this.$t("newchat.translate.hy"),
                        value: "hy"
                    }, {
                        label: this.$t("newchat.translate.lt"),
                        value: "lt"
                    }, {
                        label: this.$t("newchat.translate.cs"),
                        value: "cs"
                    }, {
                        label: this.$t("newchat.translate.ga"),
                        value: "ga"
                    }, {
                        label: this.$t("newchat.translate.uz"),
                        value: "uz"
                    }, {
                        label: this.$t("newchat.translate.ka"),
                        value: "ka"
                    }, {
                        label: this.$t("newchat.translate.sk"),
                        value: "sk"
                    }],
                    targetLangOptions: [{
                        label: this.$t("newchat.translate.zh"),
                        value: "zh"
                    }, {
                        label: this.$t("newchat.translate.en"),
                        value: "en"
                    }, {
                        label: this.$t("newchat.translate.jp"),
                        value: "jp"
                    }, {
                        label: this.$t("newchat.translate.kor"),
                        value: "kor"
                    }, {
                        label: this.$t("newchat.translate.fra"),
                        value: "fra"
                    }, {
                        label: this.$t("newchat.translate.pt"),
                        value: "pt"
                    }, {
                        label: this.$t("newchat.translate.spa"),
                        value: "spa"
                    }, {
                        label: this.$t("newchat.translate.de"),
                        value: "de"
                    }, {
                        label: this.$t("newchat.translate.it"),
                        value: "it"
                    }, {
                        label: this.$t("newchat.translate.ara"),
                        value: "ara"
                    }, {
                        label: this.$t("newchat.translate.el"),
                        value: "el"
                    }, {
                        label: this.$t("newchat.translate.id"),
                        value: "id"
                    }, {
                        label: this.$t("newchat.translate.hi"),
                        value: "hi"
                    }, {
                        label: this.$t("newchat.translate.vie"),
                        value: "vie"
                    }, {
                        label: this.$t("newchat.translate.th"),
                        value: "th"
                    }, {
                        label: this.$t("newchat.translate.may"),
                        value: "may"
                    }, {
                        label: this.$t("newchat.translate.ben"),
                        value: "ben"
                    }, {
                        label: this.$t("newchat.translate.bur"),
                        value: "bur"
                    }, {
                        label: this.$t("newchat.translate.aze"),
                        value: "aze"
                    }, {
                        label: this.$t("newchat.translate.ru"),
                        value: "ru"
                    }, {
                        label: this.$t("newchat.translate.tr"),
                        value: "tr"
                    }, {
                        label: this.$t("newchat.translate.hkm"),
                        value: "hkm"
                    }, {
                        label: this.$t("newchat.translate.ukr"),
                        value: "ukr"
                    }, {
                        label: this.$t("newchat.translate.ro"),
                        value: "ro"
                    }, {
                        label: this.$t("newchat.translate.pl"),
                        value: "pl"
                    }, {
                        label: this.$t("newchat.translate.hr"),
                        value: "hr"
                    }, {
                        label: this.$t("newchat.translate.hu"),
                        value: "hu"
                    }, {
                        label: this.$t("newchat.translate.nl"),
                        value: "nl"
                    }, {
                        label: this.$t("newchat.translate.fi"),
                        value: "fi"
                    }, {
                        label: this.$t("newchat.translate.sv"),
                        value: "sv"
                    }, {
                        label: this.$t("newchat.translate.kk"),
                        value: "kk"
                    }, {
                        label: this.$t("newchat.translate.bg"),
                        value: "bg"
                    }, {
                        label: this.$t("newchat.translate.hy"),
                        value: "hy"
                    }, {
                        label: this.$t("newchat.translate.lt"),
                        value: "lt"
                    }, {
                        label: this.$t("newchat.translate.cs"),
                        value: "cs"
                    }, {
                        label: this.$t("newchat.translate.ga"),
                        value: "ga"
                    }, {
                        label: this.$t("newchat.translate.uz"),
                        value: "uz"
                    }, {
                        label: this.$t("newchat.translate.ka"),
                        value: "ka"
                    }, {
                        label: this.$t("newchat.translate.sk"),
                        value: "sk"
                    }],
                    transitionVal: ""
                }
            },
            mounted: function() {},
            watch: {
                targetLanguageVal: function(t) {
                    this.transitionVal = t
                }
            },
            methods: {
                setDataToFather: function() {
                    var t = {
                        sourceText: this.sourceText,
                        sourceLang: this.sourceLang,
                        targetLang: this.targetLang
                    };
                    this.$emit("getTranslateData", t)
                }
            },
            destroyed: function() {}
        }
          , o = n
          , r = (a("695e"),
        a("2877"))
          , c = Object(r["a"])(o, s, i, !1, null, "19edaecb", null);
        e["default"] = c.exports
    },
    4679: function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , s = t._self._c || e;
            return s("div", {
                staticClass: "mian-box",
                class: 0 == t.itemData.isSen ? "left-box" : "right-box"
            }, [s("div", {
                staticClass: "video-box"
            }, [1 == t.itemData.isSend ? s("div", {
                staticClass: "msg-content-box",
                on: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onMyContextmenu(e, t.itemData)
                    }
                }
            }, [s("div", {
                ref: "item_content_list",
                staticClass: "item_content",
                class: t.itemData.caption ? "back_color" : ""
            }, [t.itemData.thumbnail ? [s("el-image", {
                ref: "img",
                staticStyle: {
                    "max-width": "300px"
                },
                attrs: {
                    src: t.itemData.thumbnail,
                    fit: "cover",
                    "preview-src-list": [t.itemData.fileUrl],
                    draggable: "false"
                },
                on: {
                    click: function(t) {
                        t.stopPropagation()
                    }
                }
            }, [s("div", {
                staticClass: "image-slot placeholder",
                attrs: {
                    slot: "placeholder"
                },
                slot: "placeholder"
            }, [s("i", {
                staticClass: "el-icon-loading"
            })]), s("div", {
                staticClass: "image-slot",
                attrs: {
                    slot: "error"
                },
                on: {
                    click: t.onImageClick
                },
                slot: "error"
            }, [s("i", {
                staticClass: "el-icon-refresh"
            }), s("div", {
                staticClass: "errinfo"
            }, [t._v("加载失败")])])]), s("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(" " + t._s(t.itemData.caption) + " ")])] : [s("div", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.getMaterialMessageLoading,
                    expression: "getMaterialMessageLoading"
                }],
                staticClass: "text_back_color"
            }, [s("div", {
                staticClass: "content-text"
            }, [t._v(t._s(t.$t("newchat.chatwindow.image")))]), s("el-button", {
                attrs: {
                    type: "text",
                    size: "mini"
                },
                on: {
                    click: t.getGroupSm
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.get")))])], 1)]], 2), t.itemData.text ? s("div", {
                staticClass: "item_content original"
            }, [s("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(" " + t._s(t.$t("newchat.chatwindow.original")) + "：" + t._s(t.itemData.text) + " ")])]) : t._e()]) : s("div", {
                staticClass: "msg-content-box",
                on: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onOtherContextmenu(e, t.itemData)
                    }
                }
            }, [s("div", {
                staticStyle: {
                    display: "flex",
                    "align-items": "center"
                }
            }, [s("div", {
                ref: "item_content_list",
                staticClass: "item_content",
                class: t.itemData.caption ? "back_color" : ""
            }, [t.itemData.thumbnail ? [s("el-image", {
                ref: "img",
                staticStyle: {
                    "max-width": "300px"
                },
                attrs: {
                    src: t.itemData.thumbnail,
                    fit: "cover",
                    "preview-src-list": [t.itemData.fileUrl]
                },
                on: {
                    click: function(t) {
                        t.stopPropagation()
                    }
                }
            }, [s("div", {
                staticClass: "image-slot placeholder",
                attrs: {
                    slot: "placeholder"
                },
                slot: "placeholder"
            }, [s("i", {
                staticClass: "el-icon-loading"
            })]), s("div", {
                staticClass: "image-slot error",
                attrs: {
                    slot: "error"
                },
                on: {
                    click: t.onImageClick
                },
                slot: "error"
            }, [s("i", {
                staticClass: "el-icon-refresh"
            }), s("div", {
                staticClass: "errinfo"
            }, [t._v("加载失败")])])]), s("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.itemData.caption,
                    expression: "itemData.caption"
                }],
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left",
                    width: "100%"
                }
            }, [t._v(" " + t._s(t.itemData.caption) + " ")])] : [s("div", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.getMaterialMessageLoading,
                    expression: "getMaterialMessageLoading"
                }],
                staticClass: "text_back_color"
            }, [s("div", {
                staticClass: "content-text"
            }, [t._v(t._s(t.$t("newchat.chatwindow.image")))]), s("el-button", {
                attrs: {
                    type: "text",
                    size: "mini"
                },
                on: {
                    click: t.getGroupSm
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.get")))])], 1)]], 2), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.chatwindow.translate"),
                    placement: "right"
                }
            }, [0 == t.itemData.isSend && t.chargeId ? s("div", {
                staticClass: "translateIcon"
            }, [t.canTranslateTime ? s("el-image", {
                staticStyle: {
                    width: "15px",
                    height: "15px"
                },
                attrs: {
                    src: a("69b7"),
                    fit: "cover"
                },
                on: {
                    click: function(e) {
                        return t.translateClick(t.itemData)
                    }
                }
            }) : s("div", {
                staticClass: "translateWart"
            }, [t._v(t._s(t.translateTime))])], 1) : t._e()])], 1), t.isTranslate || t.itemData.chatVideo || t.itemData.chatTranslate ? s("div", {
                ref: "item_content_list",
                staticClass: "item_content original",
                on: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onTranslateContextmenu(e, t.itemData.chatVideo)
                    }
                }
            }, [s("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t.isTranslateEnd ? [t.itemData.chatVideo ? s("div", [t._v(" " + t._s(t.$t("newchat.chatwindow.original")) + "：" + t._s(t.itemData.chatVideo) + " ")]) : t._e(), t.itemData.chatTranslate ? s("div", [t._v(" " + t._s(t.$t("newchat.chatwindow.translate")) + "：" + t._s(t.itemData.chatTranslate) + " ")]) : t._e()] : s("i", {
                staticClass: "el-icon-loading"
            })], 2)]) : t._e()]), 1 == t.itemData.isSendType ? s("div", {
                staticClass: "loading-icon"
            }, [s("i", {
                staticClass: "el-icon-loading"
            })]) : t._e()])])
        }
          , i = []
          , n = a("5530")
          , o = a("6b98")
          , r = a("f77b")
          , c = a("2f62")
          , l = {
            mixins: [o["a"]],
            props: ["itemData"],
            data: function() {
                return {
                    isTranslate: !1,
                    isTranslateEnd: !1,
                    getMaterialMessageLoading: !1
                }
            },
            mounted: function() {},
            computed: Object(n["a"])({}, Object(c["b"])(["chargeId"])),
            methods: {
                onImageClick: function() {
                    this.$refs.img.loadImage()
                },
                getGroupSm: function() {
                    var t = this;
                    this.getMaterialMessageLoading = !0,
                    this.itemData.sendTime = this.parseTime(this.itemData.sendTime, "{y}-{m}-{d} {h}:{i}:{s}"),
                    Object(r["T"])(this.itemData).then((function(e) {
                        t.$emit("updateMessage", e),
                        t.getMaterialMessageLoading = !1
                    }
                    ))
                }
            }
        }
          , u = l
          , d = (a("1275"),
        a("2877"))
          , h = Object(d["a"])(u, s, i, !1, null, "675925c8", null);
        e["default"] = h.exports
    },
    "46ab": function(t, e, a) {
        "use strict";
        var s = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("div", {
                staticClass: "scroll-box"
            }, [t._t("default"), a("div", {
                staticStyle: {
                    "text-align": "center"
                }
            }, [a("i", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.loadingIconShow,
                    expression: "loadingIconShow"
                }],
                staticClass: "el-icon-loading",
                staticStyle: {
                    margin: "10px 0"
                },
                attrs: {
                    id: "observerTarget"
                }
            })])], 2)
        }
          , i = []
          , n = (a("d3b7"),
        a("159b"),
        {
            name: "BottomLoading",
            props: {
                infiniteDisabled: {
                    type: Boolean,
                    default: !1
                },
                loadingIconShow: {
                    type: Boolean,
                    default: !0
                }
            },
            data: function() {
                return {
                    loadingIcon: null,
                    observer: null
                }
            },
            mounted: function() {
                this.createObserver()
            },
            methods: {
                createObserver: function() {
                    var t = this;
                    this.observer = new IntersectionObserver((function(e) {
                        e.forEach((function(e) {
                            e.isIntersecting && t.loadingMore()
                        }
                        ))
                    }
                    ));
                    var e = document.getElementById("observerTarget");
                    this.observer.observe(e)
                },
                loadingMore: function() {
                    this.infiniteDisabled || this.$emit("load")
                },
                checkLoadMore: function() {
                    var t = this;
                    this.$nextTick((function() {
                        t.isInViewport() && t.loadingMore()
                    }
                    ))
                },
                isInViewport: function() {
                    var t = document.querySelector("#observerTarget")
                      , e = t.getBoundingClientRect();
                    return e.top < window.innerHeight
                }
            },
            beforeDestroy: function() {
                this.observer && this.observer.disconnect()
            }
        })
          , o = n
          , r = (a("e80f"),
        a("2877"))
          , c = Object(r["a"])(o, s, i, !1, null, "26ab6a5f", null);
        e["a"] = c.exports
    },
    "4ba8": function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("div", {
                staticClass: "mian-box",
                class: 0 == t.itemData.isSend ? "left-box" : "right-box"
            }, [1 == t.itemData.isSend ? a("el-card", {
                staticClass: "box-card",
                nativeOn: {
                    click: function(e) {
                        return t.openDia(e)
                    },
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onMyContextmenu(e, t.itemData)
                    }
                }
            }, [a("div", {
                staticClass: "card-top"
            }, [a("el-avatar", {
                staticClass: "item_header",
                attrs: {
                    src: t.hasAvatar(t.itemData)
                }
            }), a("div", {
                staticClass: "name"
            }, [t._v(t._s(t.itemData.displayName))])], 1), a("div", {
                staticClass: "card-bot"
            }, [t._v(" " + t._s(t.$t("newchat.businessCard.businessCard")) + " ")])]) : a("el-card", {
                staticClass: "box-card",
                nativeOn: {
                    click: function(e) {
                        return t.openDia(e)
                    },
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onOtherContextmenu(e, t.itemData)
                    }
                }
            }, [a("div", {
                staticClass: "card-top"
            }, [a("el-avatar", {
                staticClass: "item_header",
                attrs: {
                    src: t.hasAvatar(t.itemData)
                }
            }), a("div", {
                staticClass: "name"
            }, [t._v(t._s(t.itemData.displayName))])], 1), a("div", {
                staticClass: "card-bot"
            }, [t._v(" " + t._s(t.$t("newchat.businessCard.businessCard")) + " ")])]), 1 == t.itemData.isSendType ? a("div", {
                staticClass: "loading-icon"
            }, [a("i", {
                staticClass: "el-icon-loading"
            })]) : t._e(), a("el-dialog", {
                attrs: {
                    title: t.$t("newchat.businessCard.businessCard"),
                    width: "440px",
                    visible: t.dialogCardVisible,
                    "append-to-body": "",
                    center: ""
                },
                on: {
                    "update:visible": function(e) {
                        t.dialogCardVisible = e
                    }
                }
            }, [a("div", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.dialogCardloading,
                    expression: "dialogCardloading"
                }]
            }, [t._l(t.contactInfo, (function(e) {
                return a("el-card", {
                    key: e.id,
                    staticClass: "box-card",
                    staticStyle: {
                        cursor: "auto"
                    }
                }, [a("div", {
                    staticClass: "card-top"
                }, [a("div", {
                    staticClass: "name"
                }, [t._v(t._s(e.displayName))])]), t._l(t.phonesList(e.phones), (function(e) {
                    return a("div", {
                        staticClass: "phone-box"
                    }, [a("div", {
                        staticClass: "phone"
                    }, [t._v(t._s(t.$t("newchat.businessCard.phone")) + "：" + t._s(e))]), a("el-button", {
                        attrs: {
                            icon: "el-icon-document-copy",
                            size: "mini"
                        },
                        on: {
                            click: function(a) {
                                return t.copyText(e)
                            }
                        }
                    }, [t._v(t._s(t.$t("newchat.businessCard.copy")))])], 1)
                }
                ))], 2)
            }
            )), 0 == t.contactInfo.length ? a("el-empty", {
                attrs: {
                    description: t.$t("newchat.notice.nodata")
                }
            }) : t._e()], 2)])], 1)
        }
          , i = []
          , n = (a("0541"),
        a("f77b"))
          , o = a("6b98")
          , r = {
            mixins: [o["a"]],
            props: ["itemData", "nolog"],
            data: function() {
                return {
                    dialogCardVisible: !1,
                    dialogCardloading: !1,
                    contactInfo: []
                }
            },
            computed: {
                phonesList: function() {
                    return function(t) {
                        return t.split(",")
                    }
                },
                hasAvatar: function() {
                    return function(t) {
                        return Object.hasOwn(t, "avatarUrl") && t.avatarUrl ? t.avatarUrl : a("4d41")
                    }
                }
            },
            mounted: function() {},
            methods: {
                openDia: function() {
                    var t = this;
                    this.nolog || (this.dialogCardVisible = !0,
                    this.dialogCardloading = !0,
                    Object(n["K"])(this.itemData.smId).then((function(e) {
                        t.contactInfo = e.contactInfo.contactUsers,
                        t.dialogCardloading = !1
                    }
                    )))
                },
                copyText: function(t) {
                    var e = this;
                    navigator.clipboard.writeText(t).then((function() {
                        e.$message.success(e.$t("newchat.message.successfullyCopy"))
                    }
                    )),
                    this.messageVisible = !1
                }
            }
        }
          , c = r
          , l = (a("90dd"),
        a("2877"))
          , u = Object(l["a"])(c, s, i, !1, null, "73449a24", null);
        e["default"] = u.exports
    },
    "4cbe": function(t, e, a) {},
    "4e28": function(t, e, a) {
        "use strict";
        a("619c")
    },
    "524b": function(t, e, a) {
        t.exports = a.p + "dist-20260618-092121/static/img/icon_expression.png"
    },
    "566f": function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("div", {
                staticClass: "scrollBox"
            }, [a("div", {
                staticClass: "chat_box"
            }, [a("Sidebar", {
                ref: "sidebarBox",
                staticClass: "sidebar",
                on: {
                    changeTab: t.changeTab
                }
            }), "accountChat" == t.chatType ? a("AccountList", {
                ref: "wsListBox",
                staticClass: "account_list",
                attrs: {
                    accountType: "account"
                }
            }) : t._e(), "accountChatGroup" == t.chatType ? a("AccountList", {
                ref: "wsListBox",
                staticClass: "account_list",
                attrs: {
                    accountType: "group"
                }
            }) : t._e(), "accountChat" == t.chatType ? a("div", {
                staticClass: "resizeBox",
                on: {
                    mousedown: function(e) {
                        return t.handleMouseDown(e, "wsListBox")
                    }
                }
            }, [a("i", {
                staticClass: "el-icon-d-caret resizeIcon"
            })]) : t._e(), "accountChat" == t.chatType || "accountChatGroup" == t.chatType ? a("UserList", {
                ref: "userListBox",
                staticClass: "user_list"
            }) : t._e(), "accountChat" == t.chatType || "accountChatGroup" == t.chatType ? a("div", {
                staticClass: "resizeBox",
                on: {
                    mousedown: function(e) {
                        return t.handleMouseDown(e, "userListBox")
                    }
                }
            }, [a("i", {
                staticClass: "el-icon-d-caret resizeIcon"
            })]) : t._e(), "groupChat" == t.chatType ? a("GroupList", {
                ref: "groupListBox",
                staticClass: "group_list"
            }) : t._e(), "groupChat" == t.chatType ? a("div", {
                staticClass: "resizeBox",
                on: {
                    mousedown: function(e) {
                        return t.handleMouseDown(e, "groupListBox")
                    }
                }
            }, [a("i", {
                staticClass: "el-icon-d-caret resizeIcon"
            })]) : t._e(), "groupChat" == t.chatType ? a("GroupUserList", {
                ref: "groupSessionListBox",
                staticClass: "session_list"
            }) : t._e(), "groupChat" == t.chatType ? a("div", {
                staticClass: "resizeBox",
                on: {
                    mousedown: function(e) {
                        return t.handleMouseDown(e, "groupSessionListBox")
                    }
                }
            }, [a("i", {
                staticClass: "el-icon-d-caret resizeIcon"
            })]) : t._e(), t.isSessionChat ? a("sessionList", {
                ref: "sessionListBox",
                staticClass: "session_list"
            }) : t._e(), t.isSessionChat ? a("div", {
                staticClass: "resizeBox",
                on: {
                    mousedown: function(e) {
                        return t.handleMouseDown(e, "sessionListBox")
                    }
                }
            }, [a("i", {
                staticClass: "el-icon-d-caret resizeIcon"
            })]) : t._e(), a("ChatWindow", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.chatwindowShow,
                    expression: "chatwindowShow"
                }],
                staticClass: "chat_window"
            }), a("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: !t.chatwindowShow,
                    expression: "!chatwindowShow"
                }],
                staticClass: "chat_window chat_window_info"
            }, [a("el-empty", {
                staticClass: "infotext",
                attrs: {
                    description: t.$t("newchat.chatwindow.noChat"),
                    "image-size": 300
                }
            })], 1), a("MaterialLibraryIndexRight", {
                staticClass: "material-library-index-right"
            })], 1)])
        }
          , i = []
          , n = a("e7b7")
          , o = a("d896")
          , r = a("766a")
          , c = a("ca52")
          , l = a("9e24")
          , u = a("5a0f")
          , d = a("f99e")
          , h = a("8361")
          , m = {
            name: "newchat",
            components: {
                Sidebar: n["default"],
                AccountList: o["default"],
                UserList: r["default"],
                ChatWindow: l["default"],
                sessionList: c["default"],
                GroupList: u["default"],
                GroupUserList: d["default"],
                MaterialLibraryIndexRight: h["default"]
            },
            data: function() {
                return {
                    chatType: "accountChat",
                    isShowChatWindow: !0,
                    chatwindowShow: !1,
                    boxWidth: 80
                }
            },
            computed: {
                isSessionChat: function() {
                    return "allSessionChat" == this.chatType || "noReadSessionChat" == this.chatType || "topSessionChat" == this.chatType || "archiveSessionChat" == this.chatType
                },
                accountUserNameData: function() {
                    return this.$store.state.newChat.accountUserNameData
                },
                chatUserNameData: function() {
                    return this.$store.state.newChat.chatUserNameData
                }
            },
            watch: {
                accountUserNameData: function(t) {
                    this.chatwindowShow = !!t
                }
            },
            methods: {
                changeTab: function(t) {
                    var e = this;
                    this.chatType = t,
                    this.$nextTick((function() {
                        "groupChat" == t && (localStorage.getItem("groupListBox") && (console.log(localStorage.getItem("groupListBox")),
                        e.$refs["groupListBox"].$el.style.width = localStorage.getItem("groupListBox")),
                        localStorage.getItem("groupSessionListBox") && (console.log(localStorage.getItem("groupSessionListBox")),
                        e.$refs["groupSessionListBox"].$el.style.width = localStorage.getItem("groupSessionListBox"))),
                        e.isSessionChat && localStorage.getItem("sessionListBox") && (console.log(localStorage.getItem("sessionListBox")),
                        e.$refs["sessionListBox"].$el.style.width = localStorage.getItem("sessionListBox"))
                    }
                    )),
                    this.$store.dispatch("newChat/setAccountUsernameData", "")
                },
                handleMouseDown: function(t, e) {
                    var a = this.$refs[e].$el
                      , s = a.offsetWidth
                      , i = t.target
                      , n = t.clientX - i.offsetLeft;
                    document.onmousemove = function(t) {
                        t.preventDefault();
                        var e = t.clientX - n;
                        a.style.width = s + e + "px"
                    }
                    ,
                    document.onmouseup = function(t) {
                        localStorage.setItem(e, a.style.width),
                        document.onmousemove = null,
                        document.onmouseup = null
                    }
                },
                reLoad: function() {
                    window.location.reload()
                }
            },
            mounted: function() {
                var t = {
                    path: "/chat/chat",
                    name: "chat"
                };
                this.$tab.closePage(t),
                localStorage.getItem("sidebarBox") && (this.$refs["sidebarBox"].$el.style.width = localStorage.getItem("sidebarBox")),
                localStorage.getItem("wsListBox") && (console.log(localStorage.getItem("wsListBox")),
                this.$refs["wsListBox"].$el.style.width = localStorage.getItem("wsListBox")),
                localStorage.getItem("userListBox") && (console.log(localStorage.getItem("userListBox")),
                this.$refs["userListBox"].$el.style.width = localStorage.getItem("userListBox"))
            },
            destroyed: function() {
                this.$store.dispatch("newChat/setAccountUsernameData", "")
            }
        }
          , p = m
          , g = (a("0de8"),
        a("2877"))
          , f = Object(g["a"])(p, s, i, !1, null, "2fe859a6", null);
        e["default"] = f.exports
    },
    "5a0f": function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("div", {
                staticClass: "main_box"
            }, [a("div", {
                staticClass: "but-list"
            }, [a("el-input", {
                staticClass: "search_inp",
                attrs: {
                    size: "mini",
                    placeholder: t.$t("newchat.groupList.enterGroupsName"),
                    "suffix-icon": "el-icon-search",
                    clearable: ""
                },
                on: {
                    change: t.getGroupList
                },
                model: {
                    value: t.activeNameVal,
                    callback: function(e) {
                        t.activeNameVal = "string" === typeof e ? e.trim() : e
                    },
                    expression: "activeNameVal"
                }
            }), a("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.userList.refresh"),
                    placement: "top-start"
                }
            }, [a("el-button", {
                staticClass: "addbut",
                attrs: {
                    type: "primary",
                    icon: "el-icon-refresh",
                    circle: ""
                },
                on: {
                    click: t.refreshGroupList
                }
            })], 1)], 1), a("div", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.groupLoading,
                    expression: "groupLoading"
                }],
                staticClass: "groupList"
            }, [t._l(t.groupList, (function(e) {
                return a("div", {
                    staticClass: "groupItem",
                    class: e.id == t.activeId ? "activeItem" : "",
                    on: {
                        click: function(a) {
                            return t.changeGroup(e)
                        },
                        dragover: [function(a) {
                            return t.dragenter(a, e)
                        }
                        , function(t) {
                            t.preventDefault()
                        }
                        ],
                        dragleave: t.dragleave,
                        drop: function(a) {
                            return t.drop(a, e)
                        }
                    }
                }, [a("el-badge", {
                    staticClass: "item",
                    attrs: {
                        value: e.readCount,
                        hidden: e.readCount <= 0,
                        max: 99
                    }
                }, [a("div", [0 == e.id ? [t._v(" " + t._s(t.$t("newchat.groupList.ungrouped")) + " ")] : 100 == e.id ? [t._v(" " + t._s(t.$t("newchat.groupList.noReply")) + " ")] : 1 == e.id ? [t._v(" " + t._s(t.$t("newchat.groupList.reply1")) + " ")] : 2 == e.id ? [t._v(" " + t._s(t.$t("newchat.groupList.reply2")) + " ")] : 3 == e.id ? [t._v(" " + t._s(t.$t("newchat.groupList.reply3")) + " ")] : 4 == e.id ? [t._v(" " + t._s(t.$t("newchat.groupList.block")) + " ")] : [t._v(" " + t._s(e.groupName) + " ")], t._v(" ( " + t._s(e.csCount ? e.csCount : 0) + " ) ")], 2)])], 1)
            }
            )), a("div", {
                staticClass: "groupButList"
            }, [a("el-button", {
                staticClass: "groupBut",
                attrs: {
                    size: "mini",
                    icon: "el-icon-plus"
                },
                on: {
                    click: t.addGroup
                }
            }, [t._v(t._s(t.$t("newchat.groupList.add")))]), a("el-button", {
                staticClass: "groupBut",
                attrs: {
                    size: "mini",
                    icon: "el-icon-edit"
                },
                on: {
                    click: t.editGroup
                }
            }, [t._v(t._s(t.$t("newchat.groupList.edit")))]), a("el-button", {
                staticClass: "groupBut",
                attrs: {
                    size: "mini",
                    icon: "el-icon-close"
                },
                on: {
                    click: t.delGroup
                }
            }, [t._v(t._s(t.$t("newchat.groupList.delete")))])], 1)], 2)])
        }
          , i = []
          , n = (a("4de4"),
        a("d3b7"),
        a("d81d"),
        a("159b"),
        a("a9e3"),
        a("f77b"))
          , o = a("488e")
          , r = {
            name: "WsCssFrontMainGroupList",
            data: function() {
                return {
                    activeNameVal: "",
                    activeId: -1,
                    groupList: [],
                    groupLoading: !1
                }
            },
            mounted: function() {
                this.getGroupList(),
                o["EventBus"].$on("reduceUnread", this.reduceUnread),
                o["EventBus"].$on("addUnread", this.addUnread),
                o["EventBus"].$on("deleteGroupData", this.deleteGroupData),
                o["EventBus"].$on("reduceGroupCount", this.reduceGroupCount),
                o["EventBus"].$on("addGroupCount", this.addGroupCount),
                o["EventBus"].$on("getGroupList", this.getGroupList)
            },
            destroyed: function() {
                o["EventBus"].$off("reduceUnread", this.reduceUnread),
                o["EventBus"].$off("addUnread", this.addUnread),
                o["EventBus"].$off("deleteGroupData", this.deleteGroupData),
                o["EventBus"].$off("reduceGroupCount", this.reduceGroupCount),
                o["EventBus"].$off("addGroupCount", this.addGroupCount),
                o["EventBus"].$off("getGroupList", this.getGroupList)
            },
            methods: {
                getGroupList: function() {
                    var t = this;
                    this.groupLoading = !0,
                    Object(n["Q"])({
                        groupName: this.activeNameVal
                    }).then((function(e) {
                        t.groupList = e.rows,
                        t.groupLoading = !1
                    }
                    ))
                },
                refreshGroupList: function() {
                    this.groupLoading || (this.pageNum = 1,
                    this.getGroupList())
                },
                changeGroup: function(t) {
                    this.activeId = t.id,
                    o["EventBus"].$emit("getGroupUsernameList", t),
                    this.$store.dispatch("newChat/setGroupData", t),
                    this.$store.dispatch("newChat/setAccountUsernameData", ""),
                    this.$store.dispatch("newChat/SET_CHAT_LOG_LIST", [])
                },
                addGroup: function() {
                    var t = this;
                    this.$prompt(this.$t("newchat.groupList.enterNewGroupName"), this.$t("newchat.groupList.newGroup"), {
                        confirmButtonText: this.$t("newchat.groupList.determine"),
                        cancelButtonText: this.$t("newchat.groupList.cancel"),
                        closeOnClickModal: !1,
                        inputValidator: this.inputValidator,
                        inputErrorMessage: this.$t("newchat.groupList.groupNameNoEmpty")
                    }).then((function(e) {
                        var a = e.value
                          , s = {
                            groupName: a
                        };
                        Object(n["d"])(s).then((function(e) {
                            t.getGroupList(),
                            t.$message.success(t.$t("newchat.groupList.successGroup")),
                            o["EventBus"].$emit("getGroupListUser")
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                editGroup: function(t) {
                    var e = this;
                    if (-1 != this.activeId) {
                        var a = this.groupList.filter((function(t) {
                            return t.id == e.activeId
                        }
                        ))[0];
                        if (1 != a.isSys) {
                            var s = this.groupList.filter((function(t) {
                                return t.id == e.activeId
                            }
                            ))[0].groupName;
                            this.$prompt(this.$t("newchat.groupList.editGroupInfo", [s]), this.$t("newchat.groupList.editGroup"), {
                                confirmButtonText: this.$t("newchat.groupList.determine"),
                                cancelButtonText: this.$t("newchat.groupList.cancel"),
                                inputValue: s,
                                closeOnClickModal: !1,
                                inputValidator: this.inputValidator,
                                inputErrorMessage: this.$t("newchat.groupList.groupNameNoEmpty")
                            }).then((function(t) {
                                var a = t.value
                                  , s = {
                                    id: e.activeId,
                                    groupName: a
                                };
                                Object(n["v"])(s).then((function(t) {
                                    e.$message.success(e.$t("newchat.groupList.editGroupSuccess")),
                                    e.getGroupList(),
                                    o["EventBus"].$emit("getGroupListUser")
                                }
                                ))
                            }
                            )).catch((function() {}
                            ))
                        } else
                            this.$message.error(this.$t("newchat.groupList.defaultCannotEdited"))
                    } else
                        this.$message.error(this.$t("newchat.groupList.pleaseSelectGroup"))
                },
                delGroup: function() {
                    var t = this;
                    if (console.log(this.activeId),
                    -1 != this.activeId) {
                        var e = this.groupList.filter((function(e) {
                            return e.id == t.activeId
                        }
                        ))[0];
                        1 != e.isSys ? e.csCount > 0 ? this.$message.error(this.$t("newchat.groupList.noDel")) : this.$confirm(this.$t("newchat.groupList.delGroupInfo", [e.groupName]), this.$t("newchat.groupList.prompt"), {
                            confirmButtonText: this.$t("newchat.groupList.determine"),
                            cancelButtonText: this.$t("newchat.groupList.cancel"),
                            type: "warning"
                        }).then((function() {
                            Object(n["r"])(t.activeId).then((function(e) {
                                t.activeId = "",
                                t.getGroupList(),
                                t.$message.success(t.$t("newchat.groupList.successfullyDeleted")),
                                o["EventBus"].$emit("getGroupListUser")
                            }
                            ))
                        }
                        )).catch((function() {}
                        )) : this.$message.error(this.$t("newchat.groupList.defaultCannotDel"))
                    } else
                        this.$message.error(this.$t("newchat.groupList.pleaseSelectGroup"))
                },
                dragenter: function(t, e) {
                    var a = t.target.closest("div.groupItem")
                      , s = Array.prototype.map.call(a.classList, (function(t, e) {
                        return t
                    }
                    ));
                    s.indexOf("activeItem") > -1 || (a.style.borderBottom = "2px solid #409EFF")
                },
                dragleave: function(t) {
                    var e = t.target.closest("div.groupItem")
                      , a = Array.prototype.map.call(e.classList, (function(t, e) {
                        return t
                    }
                    ));
                    a.indexOf("activeItem") > -1 || (e.style.borderBottom = "none")
                },
                drop: function(t, e) {
                    var a = this
                      , s = t.target.closest("div.groupItem");
                    s.style.borderBottom = "none";
                    var i = Array.prototype.map.call(s.classList, (function(t, e) {
                        return t
                    }
                    ));
                    if (!(i.indexOf("activeItem") > -1))
                        if (1 != e.isSys) {
                            var n = this.groupList.filter((function(t) {
                                return t.id == a.activeId
                            }
                            ));
                            o["EventBus"].$emit("deleteDragged", e, n)
                        } else
                            this.$message.error(this.$t("newchat.groupList.noRemove"))
                },
                inputValidator: function(t) {
                    return !!t
                },
                reduceUnread: function(t) {
                    var e = this;
                    this.groupList.forEach((function(a) {
                        a.id == e.activeId && e.$set(a, "readCount", Number(a.readCount) - Number(t.readNum))
                    }
                    ))
                },
                addUnread: function(t) {
                    null == t.groupId ? this.groupList.forEach((function(t) {
                        0 == t.id && (t.readCount = Number(t.readCount) + 1)
                    }
                    )) : this.groupList.forEach((function(e) {
                        e.id == t.groupId && (e.readCount = Number(e.readCount) + 1)
                    }
                    ))
                },
                deleteGroupData: function() {
                    var t = this;
                    this.groupList.some((function(e) {
                        if (e.id == t.activeId)
                            return t.$set(e, "csCount", e.csCount - 1),
                            !0
                    }
                    ))
                },
                reduceGroupCount: function() {
                    var t = this;
                    this.groupList.forEach((function(e) {
                        e.id == t.activeId && t.$set(e, "csCount", e.csCount - 1)
                    }
                    ))
                },
                addGroupCount: function(t) {
                    var e = this;
                    this.groupList.forEach((function(a) {
                        a.id == t && e.$set(a, "csCount", a.csCount + 1)
                    }
                    ))
                }
            }
        }
          , c = r
          , l = (a("e410"),
        a("2877"))
          , u = Object(l["a"])(c, s, i, !1, null, "06adb954", null);
        e["default"] = u.exports
    },
    "5a23": function(t, e, a) {},
    "5dbb": function(t, e, a) {
        "use strict";
        a("1d45")
    },
    "5df1": function(t, e, a) {},
    "619c": function(t, e, a) {},
    "64c3": function(t, e, a) {},
    "695e": function(t, e, a) {
        "use strict";
        a("86e6")
    },
    "69b7": function(t, e, a) {
        t.exports = a.p + "dist-20260618-092121/static/img/translate.png"
    },
    "6c36": function(t, e, a) {
        "use strict";
        var s = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("div", {
                staticClass: "speed-test"
            }, [a("el-tag", {
                attrs: {
                    type: t.tagtype
                }
            }, [t._v(" " + t._s(0 == t.nowDelays ? t.$t("netWorkConditions.detecting") : t.nowDelaysCom + " ms") + " ")])], 1)
        }
          , i = []
          , n = a("b775");
        function o() {
            return Object(n["a"])({
                url: "/biz/chat/test",
                method: "get"
            })
        }
        var r = {
            data: function() {
                return {
                    nowDelays: 0,
                    setIntervalData: null
                }
            },
            mounted: function() {
                var t = this;
                this.getPing(),
                this.setIntervalData = setInterval((function() {
                    t.getPing()
                }
                ), 15e3)
            },
            computed: {
                nowDelaysCom: function() {
                    return this.nowDelays > 999 ? ">999" : this.nowDelays > 0 ? this.nowDelays : void 0
                },
                tagtype: function() {
                    return this.nowDelays >= 600 ? "danger" : this.nowDelays >= 200 ? "warning" : ""
                }
            },
            methods: {
                getPing: function() {
                    var t = this
                      , e = (new Date).getTime();
                    o().then((function(a) {
                        var s = (new Date).getTime()
                          , i = s - e;
                        t.nowDelays = i
                    }
                    )).catch((function(t) {
                        console.log(t)
                    }
                    ))
                }
            },
            destroyed: function() {
                clearInterval(this.setIntervalData)
            }
        }
          , c = r
          , l = a("2877")
          , u = Object(l["a"])(c, s, i, !1, null, "51c1c7f0", null);
        e["a"] = u.exports
    },
    "6e25": function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , s = t._self._c || e;
            return s("div", {
                staticClass: "mian-box",
                class: 0 == t.itemData.isSend ? "left-box" : "right-box"
            }, [s("div", {
                staticClass: "video-box"
            }, [1 == t.itemData.isSend ? s("div", {
                staticClass: "msg-content-box"
            }, [s("div", {
                ref: "item_content_list",
                staticClass: "item_content",
                class: [t.isLog, t.isBackColor],
                on: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onMyContextmenu(e, t.itemData)
                    }
                }
            }, [t.itemData.fileUrl ? [8 == t.itemData.sType ? [s("video", {
                attrs: {
                    src: t.itemData.fileUrl,
                    autoplay: "",
                    muted: "",
                    loop: "",
                    height: "200",
                    width: "100%"
                },
                domProps: {
                    muted: !0
                }
            }), s("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: !t.nolog && t.itemData.caption,
                    expression: "!nolog && itemData.caption"
                }],
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(" " + t._s(t.itemData.caption) + " ")])] : 5 == t.itemData.sType ? s("el-image", {
                staticStyle: {
                    width: "100px",
                    height: "100px"
                },
                attrs: {
                    src: t.itemData.fileUrl,
                    fit: "cover",
                    "preview-src-list": [t.itemData.fileUrl]
                }
            }, [s("div", {
                staticClass: "image-slot placeholder",
                attrs: {
                    slot: "placeholder"
                },
                slot: "placeholder"
            }, [s("i", {
                staticClass: "el-icon-loading"
            })]), s("div", {
                staticClass: "image-slot",
                attrs: {
                    slot: "error"
                },
                on: {
                    click: t.onImageClick
                },
                slot: "error"
            }, [s("i", {
                staticClass: "el-icon-refresh"
            }), s("div", {
                staticClass: "errinfo"
            }, [t._v("加载失败")])])]) : t._e()] : [s("div", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.getMaterialMessageLoading,
                    expression: "getMaterialMessageLoading"
                }],
                staticClass: "text_back_color"
            }, [s("div", {
                staticClass: "content-text"
            }, [t._v(t._s(8 == t.itemData.sType ? t.$t("newchat.userList.gif") : t.$t("newchat.chatwindow.expression")))]), s("el-button", {
                attrs: {
                    type: "text",
                    size: "mini"
                },
                on: {
                    click: t.getGroupSm
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.get")))])], 1)]], 2)]) : s("div", {
                staticClass: "msg-content-box"
            }, [s("div", {
                staticStyle: {
                    display: "flex",
                    "align-items": "center"
                }
            }, [s("div", {
                ref: "item_content_list",
                staticClass: "item_content",
                class: [t.isLog, t.isBackColor],
                on: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onOtherContextmenu(e, t.itemData)
                    }
                }
            }, [t.itemData.fileUrl ? [8 == t.itemData.sType ? [s("video", {
                staticStyle: {
                    "background-color": "#eee",
                    "border-radius": "5px"
                },
                attrs: {
                    src: t.itemData.fileUrl,
                    autoplay: "",
                    muted: "",
                    loop: "",
                    height: "200",
                    width: "100%"
                },
                domProps: {
                    muted: !0
                }
            }), s("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: !t.nolog && t.itemData.caption,
                    expression: "!nolog && itemData.caption"
                }],
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(" " + t._s(t.itemData.caption) + " ")])] : 5 == t.itemData.sType ? s("el-image", {
                staticStyle: {
                    width: "100px",
                    height: "100px"
                },
                attrs: {
                    src: t.itemData.fileUrl,
                    fit: "cover",
                    "preview-src-list": [t.itemData.fileUrl]
                }
            }, [s("div", {
                staticClass: "image-slot placeholder",
                attrs: {
                    slot: "placeholder"
                },
                slot: "placeholder"
            }, [s("i", {
                staticClass: "el-icon-loading"
            })]), s("div", {
                staticClass: "image-slot",
                attrs: {
                    slot: "error"
                },
                on: {
                    click: t.onImageClick
                },
                slot: "error"
            }, [s("i", {
                staticClass: "el-icon-refresh"
            }), s("div", {
                staticClass: "errinfo"
            }, [t._v("加载失败")])])]) : t._e()] : [s("div", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.getMaterialMessageLoading,
                    expression: "getMaterialMessageLoading"
                }],
                staticClass: "text_back_color"
            }, [s("div", {
                staticClass: "content-text"
            }, [t._v(t._s(8 == t.itemData.sType ? t.$t("newchat.userList.gif") : t.$t("newchat.chatwindow.expression")))]), s("el-button", {
                attrs: {
                    type: "text",
                    size: "mini"
                },
                on: {
                    click: t.getGroupSm
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.get")))])], 1)]], 2), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.chatwindow.translate"),
                    placement: "right"
                }
            }, [0 == t.itemData.isSend && t.itemData.caption ? s("div", {
                staticClass: "translateIcon"
            }, [t.canTranslateTime ? s("el-image", {
                staticStyle: {
                    width: "15px",
                    height: "15px"
                },
                attrs: {
                    src: a("69b7"),
                    fit: "cover"
                },
                on: {
                    click: function(e) {
                        return t.translateClick(t.itemData)
                    }
                }
            }) : s("div", {
                staticClass: "translateWart"
            }, [t._v(t._s(t.translateTime))])], 1) : t._e()])], 1), t.isTranslate ? s("div", {
                ref: "item_content_list",
                staticClass: "item_content original",
                on: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onTranslateContextmenu(e, t.itemData.chatVideo)
                    }
                }
            }, [s("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t.isTranslateEnd ? [t._v(t._s(t.$t("newchat.chatwindow.translate")) + "：" + t._s(t.itemData.chatVideo ? t.itemData.chatVideo : t.itemData.chatContent))] : s("i", {
                staticClass: "el-icon-loading"
            })], 2)]) : t._e()]), 1 == t.itemData.isSendType ? s("div", {
                staticClass: "loading-icon"
            }, [s("i", {
                staticClass: "el-icon-loading"
            })]) : t._e()])])
        }
          , i = []
          , n = a("6b98")
          , o = a("f77b")
          , r = {
            mixins: [n["a"]],
            props: ["itemData", "nolog"],
            data: function() {
                return {
                    isTranslate: !1,
                    isTranslateEnd: !1,
                    getMaterialMessageLoading: !1
                }
            },
            computed: {
                isLog: function() {
                    return this.nolog ? "" : "item_content_back"
                },
                isBackColor: function() {
                    return !this.nolog && this.itemData.caption ? "back_color" : ""
                }
            },
            mounted: function() {},
            methods: {
                onImageClick: function() {
                    var t = this
                      , e = this.itemData.fileUrl;
                    this.itemData.fileUrl = "",
                    this.$nextTick((function() {
                        t.$set(t.itemData, "fileUrl", e)
                    }
                    ))
                },
                getGroupSm: function() {
                    var t = this;
                    this.getMaterialMessageLoading = !0,
                    this.itemData.sendTime = this.parseTime(this.itemData.sendTime, "{y}-{m}-{d} {h}:{i}:{s}"),
                    Object(o["T"])(this.itemData).then((function(e) {
                        t.$emit("updateMessage", e),
                        t.getMaterialMessageLoading = !1
                    }
                    ))
                }
            }
        }
          , c = r
          , l = (a("5dbb"),
        a("2877"))
          , u = Object(l["a"])(c, s, i, !1, null, "ad57d35c", null);
        e["default"] = u.exports
    },
    "6f10": function(t, e, a) {},
    "71b4": function(t, e, a) {
        "use strict";
        var s = a("23e7")
          , i = a("a258").findLastIndex
          , n = a("44d2");
        s({
            target: "Array",
            proto: !0
        }, {
            findLastIndex: function(t) {
                return i(this, t, arguments.length > 1 ? arguments[1] : void 0)
            }
        }),
        n("findLastIndex")
    },
    "766a": function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , s = t._self._c || e;
            return s("div", {
                staticClass: "main_box"
            }, [s("el-tabs", {
                staticClass: "box-card",
                attrs: {
                    type: "border-card"
                },
                on: {
                    "tab-click": t.handleClick
                },
                model: {
                    value: t.activeName,
                    callback: function(e) {
                        t.activeName = e
                    },
                    expression: "activeName"
                }
            }, [s("el-tab-pane", {
                staticClass: "groupTab",
                staticStyle: {
                    height: "100%"
                },
                attrs: {
                    label: t.$t("newchat.userList.currentSession"),
                    name: "accountList"
                }
            }, [s("span", {
                attrs: {
                    slot: "label"
                },
                slot: "label"
            }, [t._v(" " + t._s(t.$t("newchat.userList.currentSession"))), s("el-badge", {
                attrs: {
                    "is-dot": t.accountReadNum > 0
                }
            })], 1), s("div", {
                staticClass: "but-list"
            }, [s("el-input", {
                staticClass: "search_inp",
                attrs: {
                    size: "mini",
                    placeholder: t.$t("newchat.input.enterAccountNickname"),
                    "suffix-icon": "el-icon-search",
                    clearable: ""
                },
                on: {
                    change: t.getUsernameList
                },
                model: {
                    value: t.activeNameVal,
                    callback: function(e) {
                        t.activeNameVal = "string" === typeof e ? e.trim() : e
                    },
                    expression: "activeNameVal"
                }
            }), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.userList.createNewSession"),
                    placement: "top-start"
                }
            }, [s("el-button", {
                staticClass: "addbut",
                attrs: {
                    type: "primary",
                    icon: "el-icon-plus",
                    circle: ""
                },
                on: {
                    click: t.openAddChat
                }
            })], 1), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.userList.filterFans"),
                    placement: "top-start"
                }
            }, [s("el-badge", {
                staticClass: "item",
                style: {
                    color: t.isFilter ? "#fff" : "#409EFF"
                },
                attrs: {
                    "is-dot": t.isFilter
                }
            }, [s("svg-icon", {
                staticClass: "addbut",
                class: t.isFilter ? "" : "addbutClick",
                attrs: {
                    "icon-class": "screen",
                    size: "26",
                    "class-name": "custom-class"
                },
                on: {
                    click: t.openFilterChat
                }
            })], 1)], 1)], 1), s("div", {
                directives: [{
                    name: "infinite-scroll",
                    rawName: "v-infinite-scroll",
                    value: t.load,
                    expression: "load"
                }, {
                    name: "loading",
                    rawName: "v-loading",
                    value: t.accountListLoading,
                    expression: "accountListLoading"
                }],
                ref: "user_listbox",
                staticClass: "user_listbox",
                staticStyle: {
                    overflow: "auto"
                },
                attrs: {
                    id: "user_listbox",
                    "infinite-scroll-disabled": t.disabled,
                    "infinite-scroll-distance": 10
                }
            }, [t._l(t.usernameList, (function(e, i) {
                return s("div", {
                    key: e.id,
                    staticClass: "user_item",
                    class: e.id == t.activeNum ? "user_item_active" : "",
                    attrs: {
                        draggable: ""
                    },
                    on: {
                        contextmenu: function(a) {
                            return a.stopPropagation(),
                            a.preventDefault(),
                            t.onContextmenu(a, e)
                        },
                        click: function(a) {
                            return t.changeAccount(e)
                        }
                    }
                }, [s("div", {
                    staticClass: "tooltopbox"
                }, [t.batchOption ? s("div", {
                    staticStyle: {
                        display: "flex",
                        "align-items": "center",
                        "padding-right": "5px"
                    },
                    on: {
                        click: function(t) {
                            t.stopPropagation()
                        }
                    }
                }, [s("el-checkbox", {
                    model: {
                        value: e.checked,
                        callback: function(a) {
                            t.$set(e, "checked", a)
                        },
                        expression: "item.checked"
                    }
                })], 1) : t._e(), s("el-badge", {
                    staticClass: "item",
                    attrs: {
                        value: e.readNum,
                        hidden: e.readNum <= 0,
                        max: 99
                    }
                }, [s("el-avatar", {
                    staticClass: "item_header",
                    attrs: {
                        src: e.avatarUrl ? e.avatarUrl : a("4d41")
                    },
                    nativeOn: {
                        mousedown: function(t) {
                            t.preventDefault()
                        }
                    }
                })], 1), s("div", {
                    staticClass: "item_info"
                }, [s("div", {
                    staticClass: "nameinfo"
                }, [s("div", {
                    staticClass: "item_name"
                }, [t._v(" " + t._s(e.remarkName ? e.remarkName : e.username) + " ")]), s("div", {
                    staticClass: "time_text"
                }, [t._v(" " + t._s(0 == e.isSend ? t.sendTime(e.senderTimestamp ? t.senderTimestamp : e.sendTime) : t.sendTime(e.sendTime)) + " ")])]), s("div", {
                    staticClass: "ws-account-info"
                }, [t._v(t._s(e.username.toString()))]), s("div", {
                    staticClass: "timeinfo"
                }, [s("span", {
                    directives: [{
                        name: "show",
                        rawName: "v-show",
                        value: 1 == e.isRepeat && 1 == t.$store.getters.isRepeatScope,
                        expression: "item.isRepeat == 1 && $store.getters.isRepeatScope == 1"
                    }],
                    staticClass: "repeat-text"
                }, [t._v("重")]), s("div", {
                    staticClass: "content",
                    class: {
                        "draft-content": t.hasDraft(e.id)
                    }
                }, [t._v(" " + t._s(t.hasDraft(e.id) ? "草稿" : e.content) + " ")]), [s("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        enterable: !1,
                        content: 1 == e.isReplyApi ? t.$t("newchat.chatwindow.robotHosting") : t.$t("newchat.chatwindow.globalRobotHosting"),
                        placement: "right"
                    }
                }, [1 == e.isReplyApi || 2 == e.isReplyApi ? s("svg-icon", {
                    staticStyle: {
                        "margin-bottom": "2px",
                        color: "#67C23A"
                    },
                    style: {
                        color: 1 == e.isReplyApi ? "#67C23A" : "#409EFF"
                    },
                    attrs: {
                        "icon-class": "robot",
                        size: "15",
                        "class-name": "custom-class"
                    }
                }) : t._e()], 1)], s("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        enterable: !1,
                        content: t.$t("newchat.userList.isAI"),
                        placement: "right"
                    }
                }, [1 == e.isChatAi ? s("svg-icon", {
                    staticStyle: {
                        "margin-bottom": "2px",
                        color: "#67C23A"
                    },
                    attrs: {
                        "icon-class": "AI",
                        size: "14",
                        "class-name": "custom-class"
                    },
                    on: {
                        click: function(a) {
                            return t.closeAI(e)
                        }
                    }
                }) : t._e()], 1), s("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        enterable: !1,
                        content: 1 == e.isBlock ? t.$t("newchat.chatwindow.cancelBlack") : t.$t("newchat.chatwindow.setBalck"),
                        placement: "right"
                    }
                }, [s("div", {
                    staticStyle: {
                        "margin-bottom": "3px"
                    },
                    on: {
                        click: function(a) {
                            return a.stopPropagation(),
                            t.pullIntoBlacklist(e)
                        }
                    }
                }, [1 == e.isBlock ? s("div", {
                    staticStyle: {
                        color: "#f56c6c"
                    }
                }, [s("svg-icon", {
                    attrs: {
                        "icon-class": "black",
                        size: "14",
                        "class-name": "custom-class"
                    }
                })], 1) : s("div", {
                    staticStyle: {
                        color: "#909399"
                    }
                }, [s("svg-icon", {
                    attrs: {
                        "icon-class": "black",
                        size: "14",
                        "class-name": "custom-class"
                    }
                })], 1)])]), s("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        enterable: !1,
                        content: 1 == e.isTop ? t.$t("newchat.userList.cancelTop") : t.$t("newchat.userList.top"),
                        placement: "right"
                    }
                }, [s("div", {
                    on: {
                        click: function(a) {
                            return a.stopPropagation(),
                            t.topping(e)
                        }
                    }
                }, [1 == e.isTop ? s("i", {
                    staticClass: "el-icon-download",
                    staticStyle: {
                        color: "rgb(140, 197, 255)"
                    }
                }) : s("i", {
                    staticClass: "el-icon-upload2",
                    staticStyle: {
                        color: "#909399"
                    }
                })])])], 2)])], 1)])
            }
            )), t.loadingIcon ? s("div", {
                staticClass: "icon-loading"
            }, [s("i", {
                staticClass: "el-icon-loading"
            })]) : t._e(), t.noMore && !t.loadingIcon && 0 != t.usernameList.length ? s("div", {
                staticClass: "icon-loading nomoretext"
            }, [t._v(" " + t._s(t.$t("newchat.userList.noMore")) + " ")]) : t._e(), 0 == t.usernameList.length ? s("el-empty", {
                attrs: {
                    description: t.$t("newchat.notice.nodata")
                }
            }) : s("div", {
                staticClass: "listPageBox notranslate"
            }, [t._v(" " + t._s(t.usernameList.length) + " / " + t._s(t.total) + " ")])], 2)]), s("el-tab-pane", {
                staticStyle: {
                    height: "100%"
                },
                attrs: {
                    label: t.$t("newchat.userList.groupChat"),
                    name: "groupChat"
                }
            }, [s("span", {
                attrs: {
                    slot: "label"
                },
                slot: "label"
            }, [t._v(t._s(t.$t("newchat.userList.groupChat"))), s("el-badge", {
                attrs: {
                    "is-dot": t.groupReadNum > 0
                }
            })], 1), s("div", {
                staticClass: "but-list"
            }, [s("el-input", {
                staticClass: "search_inp",
                attrs: {
                    size: "mini",
                    placeholder: t.$t("newchat.userList.enterGroupChatName"),
                    "suffix-icon": "el-icon-search",
                    clearable: ""
                },
                on: {
                    change: t.getChatGroupList
                },
                model: {
                    value: t.groupSubject,
                    callback: function(e) {
                        t.groupSubject = "string" === typeof e ? e.trim() : e
                    },
                    expression: "groupSubject"
                }
            }), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.userList.refresh"),
                    placement: "top-start"
                }
            }, [s("el-button", {
                staticClass: "addbut",
                attrs: {
                    type: "primary",
                    icon: "el-icon-refresh",
                    circle: ""
                },
                on: {
                    click: t.refreshGroupChat
                }
            })], 1), s("el-dropdown", {
                on: {
                    command: t.groupCommand
                }
            }, [s("el-button", {
                staticStyle: {
                    "margin-left": "3px"
                },
                attrs: {
                    icon: "el-icon-more-outline",
                    circle: "",
                    size: "mini"
                }
            }), s("el-dropdown-menu", {
                attrs: {
                    slot: "dropdown"
                },
                slot: "dropdown"
            }, [s("el-dropdown-item", {
                attrs: {
                    command: "addGroupChat"
                }
            }, [t._v(t._s(t.$t("newchat.userList.addGroupChat")))]), s("el-dropdown-item", {
                attrs: {
                    command: "batchExitGroupChat"
                }
            }, [t._v(t._s(t.$t("newchat.userList.batchExitGroupChat")))]), s("el-dropdown-item", {
                attrs: {
                    command: "clearGroupChat"
                }
            }, [t._v(t._s(t.$t("newchat.userList.clearGroupChat")))])], 1)], 1)], 1), s("div", {
                directives: [{
                    name: "infinite-scroll",
                    rawName: "v-infinite-scroll",
                    value: t.getChatGroupListPage,
                    expression: "getChatGroupListPage"
                }, {
                    name: "loading",
                    rawName: "v-loading",
                    value: t.groupChatLoading,
                    expression: "groupChatLoading"
                }],
                ref: "user_listbox",
                staticClass: "user_listbox",
                staticStyle: {
                    overflow: "auto"
                },
                attrs: {
                    "infinite-scroll-disabled": t.groupDisabled,
                    "infinite-scroll-distance": 10
                }
            }, [t._l(t.groupChatList, (function(e, a) {
                return s("div", {
                    key: e.chatId,
                    staticClass: "user_item",
                    class: e.chatId == t.activeNum ? "user_item_active" : "",
                    attrs: {
                        draggable: ""
                    },
                    on: {
                        click: function(a) {
                            return t.changeAccount(e)
                        }
                    }
                }, [s("el-tooltip", {
                    staticStyle: {
                        width: "100%"
                    },
                    attrs: {
                        "open-delay": 800,
                        effect: "dark",
                        content: e.groupCode.toString(),
                        placement: "bottom"
                    }
                }, [s("div", [s("div", {
                    staticClass: "tooltopbox"
                }, [s("el-badge", {
                    staticClass: "item",
                    attrs: {
                        value: e.readCount,
                        hidden: e.readCount <= 0,
                        max: 99
                    }
                }, [s("el-avatar", {
                    staticClass: "item_header",
                    attrs: {
                        src: e.avatarUrl
                    },
                    nativeOn: {
                        mousedown: function(t) {
                            t.preventDefault()
                        }
                    }
                }, [t._v("群")])], 1), s("div", {
                    staticClass: "item_info"
                }, [s("div", {
                    staticClass: "nameinfo"
                }, [s("div", {
                    staticClass: "item_name"
                }, [t._v(" " + t._s(e.subject ? e.subject : e.groupCode) + " ")]), s("div", {
                    staticClass: "time_text"
                }, [s("div", {
                    staticClass: "time_text"
                }, [t._v(t._s(t.sendTime(e.stime)))])])]), s("div", {
                    staticClass: "timeinfo"
                }, [s("div", {
                    staticClass: "content",
                    class: {
                        "draft-content": t.hasDraft(e.chatId)
                    }
                }, [t._v(" " + t._s(t.hasDraft(e.chatId) ? "草稿" : e.content) + " ")]), s("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        enterable: !1,
                        content: 1 == e.isTop ? t.$t("newchat.userList.cancelTop") : t.$t("newchat.userList.top"),
                        placement: "right"
                    }
                }, [s("div", {
                    on: {
                        click: function(a) {
                            return a.stopPropagation(),
                            t.groupTopping(e)
                        }
                    }
                }, [1 == e.isTop ? s("i", {
                    staticClass: "el-icon-download",
                    staticStyle: {
                        color: "rgb(140, 197, 255)"
                    }
                }) : s("i", {
                    staticClass: "el-icon-upload2",
                    staticStyle: {
                        color: "#909399"
                    }
                })])])], 1)])], 1), s("div", {
                    staticStyle: {
                        display: "flex",
                        "margin-top": "5px",
                        "flex-wrap": "wrap",
                        gap: "5px"
                    }
                }, [1 == e.status ? s("el-tag", {
                    attrs: {
                        size: "mini",
                        type: "danger"
                    }
                }, [t._v(t._s(t.$t("newchat.userList.blocked")))]) : t._e(), 1 == e.announcement ? s("el-tag", {
                    attrs: {
                        size: "mini",
                        type: "warning"
                    }
                }, [t._v(t._s(t.$t("newchat.userList.announcementGroup")))]) : t._e(), s("div", {
                    directives: [{
                        name: "show",
                        rawName: "v-show",
                        value: e.memberCount,
                        expression: "item.memberCount"
                    }],
                    staticClass: "member-count"
                }, [t._v(" " + t._s(t.$t("newchat.userList.groupMemberCount")) + "：" + t._s(e.memberCount) + " ")])], 1)])])], 1)
            }
            )), t.groupLoadingIcon ? s("div", {
                staticClass: "icon-loading"
            }, [s("i", {
                staticClass: "el-icon-loading"
            })]) : t._e(), t.groupNoMore && !t.groupLoadingIcon && 0 != t.groupChatList.length ? s("div", {
                staticClass: "icon-loading nomoretext"
            }, [t._v(" " + t._s(t.$t("newchat.userList.noMore")) + " ")]) : t._e(), 0 == t.groupChatList.length ? s("el-empty", {
                attrs: {
                    description: t.$t("newchat.notice.nodata")
                }
            }) : s("div", {
                staticClass: "listPageBox notranslate"
            }, [t._v(" " + t._s(t.groupChatList.length) + " / " + t._s(t.groupChatTotal) + " ")])], 2)]), s("el-tab-pane", {
                staticStyle: {
                    height: "100%"
                },
                attrs: {
                    label: t.bookCount ? t.$t("newchat.userList.addressBook") + "(" + t.bookCount + ")" : t.$t("newchat.userList.addressBook"),
                    name: "addressBook"
                }
            }, [s("div", {
                staticClass: "but-list"
            }, [s("el-input", {
                staticClass: "search_inp",
                attrs: {
                    size: "mini",
                    placeholder: t.$t("newchat.input.enterAccountNickname"),
                    "suffix-icon": "el-icon-search",
                    clearable: ""
                },
                on: {
                    change: t.getAddressBookList
                },
                model: {
                    value: t.addressBookVal,
                    callback: function(e) {
                        t.addressBookVal = "string" === typeof e ? e.trim() : e
                    },
                    expression: "addressBookVal"
                }
            }), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.userList.pullContacts"),
                    placement: "top-start"
                }
            }, [s("el-button", {
                staticClass: "addbut",
                attrs: {
                    type: "primary",
                    icon: "el-icon-mobile",
                    circle: ""
                },
                on: {
                    click: t.openPull
                }
            })], 1), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.userList.refresh"),
                    placement: "top-start"
                }
            }, [s("el-button", {
                staticClass: "addbut",
                attrs: {
                    type: "primary",
                    icon: "el-icon-refresh",
                    circle: ""
                },
                on: {
                    click: t.refresh
                }
            })], 1)], 1), s("div", {
                directives: [{
                    name: "infinite-scroll",
                    rawName: "v-infinite-scroll",
                    value: t.addressBookLoad,
                    expression: "addressBookLoad"
                }, {
                    name: "loading",
                    rawName: "v-loading",
                    value: t.addressBookLoading,
                    expression: "addressBookLoading"
                }],
                ref: "user_listbox",
                staticClass: "user_listbox",
                staticStyle: {
                    overflow: "auto"
                },
                attrs: {
                    "infinite-scroll-distance": 10,
                    "infinite-scroll-disabled": t.disabled
                }
            }, [t._l(t.addressBookList, (function(e, i) {
                return s("div", {
                    key: e.username,
                    staticClass: "user_item",
                    class: e.username == t.activeNum ? "user_item_active" : "",
                    on: {
                        click: function(a) {
                            return t.changeAccount(e)
                        }
                    }
                }, [s("el-badge", {
                    staticClass: "item",
                    attrs: {
                        value: e.readNum,
                        hidden: e.readNum <= 0,
                        max: 99
                    }
                }, [s("el-avatar", {
                    staticClass: "item_header",
                    attrs: {
                        src: e.avatarUrl ? e.avatarUrl : a("4d41")
                    },
                    nativeOn: {
                        mousedown: function(t) {
                            t.preventDefault()
                        }
                    }
                })], 1), s("div", {
                    staticClass: "item_info"
                }, [s("div", {
                    staticClass: "nameinfo"
                }, [s("div", {
                    staticClass: "item_name"
                }, [t._v(t._s(e.username))])]), s("div", {
                    staticClass: "timeinfo"
                }, [s("div", {
                    staticClass: "content"
                }, [t._v(t._s(e.content))])])])], 1)
            }
            )), s("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.loadingIcon,
                    expression: "loadingIcon"
                }],
                staticClass: "icon-loading"
            }, [s("i", {
                staticClass: "el-icon-loading"
            })]), 0 == t.addressBookList.length ? s("el-empty", {
                attrs: {
                    description: t.$t("newchat.notice.nodata")
                }
            }) : t._e()], 2)])], 1), s("el-dialog", {
                staticClass: "add-dialog",
                attrs: {
                    title: t.$t("newchat.userList.createNewSession"),
                    center: "",
                    visible: t.addUserVisible,
                    width: "450px",
                    "destroy-on-close": !0,
                    "close-on-click-modal": !1
                },
                on: {
                    "update:visible": function(e) {
                        t.addUserVisible = e
                    },
                    close: function(e) {
                        t.$refs["addform"].resetFields(),
                        t.checkAccountStatus = -1
                    }
                }
            }, [s("el-form", {
                ref: "addform",
                attrs: {
                    model: t.addForm,
                    "label-width": "80px",
                    rules: {}
                },
                nativeOn: {
                    submit: function(t) {
                        t.preventDefault()
                    }
                }
            }, [s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.userList.number"),
                    prop: "phone",
                    rules: [{
                        required: !0,
                        message: this.$t("newchat.userList.addFormRuleNumber"),
                        trigger: "blur"
                    }, {
                        min: 8,
                        message: this.$t("newchat.userList.addFormRuleNumber2"),
                        trigger: "blur"
                    }]
                }
            }, [s("el-input", {
                staticStyle: {
                    "margin-right": "10px"
                },
                attrs: {
                    placeholder: t.$t("newchat.userList.otherNumber"),
                    size: "mini"
                },
                on: {
                    input: t.inputChangeCheckAccount
                },
                nativeOn: {
                    keydown: function(e) {
                        return !e.type.indexOf("key") && t._k(e.keyCode, "enter", 13, e.key, "Enter") || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey ? null : t.addUser(e)
                    }
                },
                model: {
                    value: t.addForm.phone,
                    callback: function(e) {
                        t.$set(t.addForm, "phone", t._n(e))
                    },
                    expression: "addForm.phone"
                }
            }), [s("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: 1 == t.checkAccountStatus,
                    expression: "checkAccountStatus == 1"
                }],
                staticStyle: {
                    color: "#67c23a"
                }
            }, [t._v(" " + t._s(t.$t("newchat.userList.phoneRegistered")) + " ")]), s("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: 2 == t.checkAccountStatus,
                    expression: "checkAccountStatus == 2"
                }],
                staticStyle: {
                    color: "#f56c6c"
                }
            }, [t._v(" " + t._s(t.$t("newchat.userList.phoneUnregistered")) + " ")]), s("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: 3 == t.checkAccountStatus,
                    expression: "checkAccountStatus == 3"
                }],
                staticStyle: {
                    color: "#f56c6c"
                }
            }, [t._v(" " + t._s(t.$t("newchat.userList.incorrectMobileNumber")) + " ")])]], 2)], 1), s("span", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [s("el-button", {
                on: {
                    click: function(e) {
                        t.addUserVisible = !1
                    }
                }
            }, [t._v(t._s(t.$t("newchat.dialog.cancel")))]), s("el-button", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: 0 != t.checkAccountStatus,
                    expression: "checkAccountStatus != 0"
                }],
                attrs: {
                    type: "primary",
                    loading: t.butLoading,
                    disabled: 2 == t.checkAccountStatus || 3 == t.checkAccountStatus
                },
                on: {
                    click: t.addUserCheck
                }
            }, [t._v(t._s(t.$t("newchat.dialog.add")))]), s("el-button", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: 0 == t.checkAccountStatus,
                    expression: "checkAccountStatus == 0"
                }],
                attrs: {
                    type: "info",
                    disabled: "",
                    icon: "el-icon-loading"
                }
            }, [t._v(t._s(t.$t("newchat.userList.checking")))])], 1)], 1), s("el-dialog", {
                staticClass: "add-dialog",
                attrs: {
                    title: t.$t("newchat.userList.pullContacts"),
                    center: "",
                    visible: t.pullContactsVisible,
                    width: "400px"
                },
                on: {
                    "update:visible": function(e) {
                        t.pullContactsVisible = e
                    }
                }
            }, [s("el-alert", {
                staticStyle: {
                    "margin-bottom": "10px"
                },
                attrs: {
                    title: t.$t("newchat.notice.illustrate") + ":",
                    type: "warning",
                    description: t.$t("newchat.userList.illustrateInfo")
                }
            }), s("el-form", {
                ref: "form",
                attrs: {
                    model: t.pullContactsForm,
                    "label-width": "80px"
                }
            }, [s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.userList.batch")
                }
            }, [s("el-select", {
                attrs: {
                    placeholder: t.$t("newchat.userList.selectBatch"),
                    clearable: ""
                },
                model: {
                    value: t.pullContactsForm.poolId,
                    callback: function(e) {
                        t.$set(t.pullContactsForm, "poolId", e)
                    },
                    expression: "pullContactsForm.poolId"
                }
            }, t._l(t.poolOptions, (function(t, e) {
                return s("el-option", {
                    key: e,
                    attrs: {
                        label: "(剩余" + t.notUseCount + ")" + t.fileName,
                        value: t.id
                    }
                })
            }
            )), 1)], 1), s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.userList.number2")
                }
            }, [s("el-input-number", {
                attrs: {
                    min: 1,
                    label: t.$t("newchat.userList.pullQuantity")
                },
                model: {
                    value: t.pullContactsForm.pullNum,
                    callback: function(e) {
                        t.$set(t.pullContactsForm, "pullNum", e)
                    },
                    expression: "pullContactsForm.pullNum"
                }
            })], 1)], 1), s("span", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [s("el-button", {
                on: {
                    click: function(e) {
                        t.pullContactsVisible = !1
                    }
                }
            }, [t._v(t._s(t.$t("newchat.dialog.cancel")))]), s("el-button", {
                attrs: {
                    type: "primary"
                },
                on: {
                    click: t.pullContacts
                }
            }, [t._v(t._s(t.$t("newchat.dialog.add")))])], 1)], 1), s("el-dialog", {
                staticClass: "add-dialog",
                attrs: {
                    title: t.$t("newchat.userList.filterFans"),
                    center: "",
                    visible: t.filterChatVisible,
                    width: "400px",
                    "close-on-click-modal": !1,
                    "close-on-press-escape": !1,
                    "show-close": !1
                },
                on: {
                    "update:visible": function(e) {
                        t.filterChatVisible = e
                    }
                }
            }, [s("el-form", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.filterLabelsLoading,
                    expression: "filterLabelsLoading"
                }],
                ref: "form",
                attrs: {
                    model: t.filterChatForm,
                    "label-width": "100px",
                    size: "mini"
                }
            }, [s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.userList.fansTag")
                }
            }, [s("el-select", {
                staticStyle: {
                    width: "100%"
                },
                attrs: {
                    multiple: "",
                    filterable: "",
                    placeholder: t.$t("newchat.userList.selectFansTag"),
                    clearable: ""
                },
                model: {
                    value: t.filterChatForm.labels,
                    callback: function(e) {
                        t.$set(t.filterChatForm, "labels", e)
                    },
                    expression: "filterChatForm.labels"
                }
            }, t._l(t.lableList, (function(t, e) {
                return s("el-option", {
                    key: e,
                    attrs: {
                        label: t.labelName,
                        value: t.id
                    }
                })
            }
            )), 1)], 1), s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.userList.fansSource")
                }
            }, [s("el-select", {
                staticStyle: {
                    width: "100%"
                },
                attrs: {
                    placeholder: t.$t("newchat.userList.selectFansSource"),
                    clearable: ""
                },
                model: {
                    value: t.filterChatForm.addType,
                    callback: function(e) {
                        t.$set(t.filterChatForm, "addType", e)
                    },
                    expression: "filterChatForm.addType"
                }
            }, [s("el-option", {
                attrs: {
                    label: t.$t("fanList.newMessageAddition"),
                    value: 0
                }
            }), s("el-option", {
                attrs: {
                    label: t.$t("fanList.fansGroupSending"),
                    value: 1
                }
            }), s("el-option", {
                attrs: {
                    label: t.$t("fanList.import"),
                    value: 2
                }
            }), s("el-option", {
                attrs: {
                    label: t.$t("fanList.pull"),
                    value: 3
                }
            }), s("el-option", {
                attrs: {
                    label: t.$t("fanList.addfan"),
                    value: 4
                }
            })], 1)], 1), s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.userList.isAI")
                }
            }, [s("el-select", {
                staticStyle: {
                    width: "100%"
                },
                attrs: {
                    placeholder: t.$t("newchat.userList.selectAI"),
                    clearable: ""
                },
                model: {
                    value: t.filterChatForm.isChatAi,
                    callback: function(e) {
                        t.$set(t.filterChatForm, "isChatAi", e)
                    },
                    expression: "filterChatForm.isChatAi"
                }
            }, [s("el-option", {
                attrs: {
                    label: t.$t("newchat.userList.yes"),
                    value: 1
                }
            }), s("el-option", {
                attrs: {
                    label: t.$t("newchat.userList.no"),
                    value: 0
                }
            })], 1)], 1)], 1), s("span", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [s("el-button", {
                attrs: {
                    size: "mini"
                },
                on: {
                    click: t.cancelFilterChat
                }
            }, [t._v(t._s(t.$t("newchat.userList.clearFilter")))]), s("el-button", {
                attrs: {
                    type: "primary",
                    size: "mini"
                },
                on: {
                    click: t.filterChat
                }
            }, [t._v(t._s(t.$t("newchat.userList.filter")))])], 1)], 1), s("el-dialog", {
                staticClass: "add-dialog",
                attrs: {
                    title: t.$t("newchat.userList.addGroupChat"),
                    center: "",
                    visible: t.addGroupChatVisible,
                    width: "500px"
                },
                on: {
                    "update:visible": function(e) {
                        t.addGroupChatVisible = e
                    }
                }
            }, [s("el-form", {
                ref: "addGroupChatForm",
                attrs: {
                    model: t.addGroupChatForm,
                    "label-width": "130px"
                },
                nativeOn: {
                    submit: function(t) {
                        t.preventDefault()
                    }
                }
            }, [s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.userList.groupChatLink"),
                    prop: "groupLink",
                    rules: [{
                        required: !0,
                        message: this.$t("newchat.userList.enterGroupChatLink"),
                        trigger: "blur"
                    }]
                }
            }, [s("el-input", {
                staticStyle: {
                    "margin-right": "10px"
                },
                attrs: {
                    placeholder: t.$t("newchat.userList.enterGroupChatLink"),
                    size: "mini",
                    type: "textarea"
                },
                model: {
                    value: t.addGroupChatForm.groupLink,
                    callback: function(e) {
                        t.$set(t.addGroupChatForm, "groupLink", e)
                    },
                    expression: "addGroupChatForm.groupLink"
                }
            })], 1)], 1), s("span", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [s("el-button", {
                on: {
                    click: function(e) {
                        t.addGroupChatVisible = !1
                    }
                }
            }, [t._v(t._s(t.$t("newchat.dialog.cancel")))]), s("el-button", {
                attrs: {
                    type: "primary",
                    loading: t.butLoading
                },
                on: {
                    click: t.addGroupChat
                }
            }, [t._v(t._s(t.$t("newchat.dialog.add")))])], 1)], 1), s("el-dialog", {
                attrs: {
                    title: t.$t("newchat.userList.batchExitGroupChat"),
                    center: "",
                    visible: t.batchExitChatGroupVisible,
                    width: "600px"
                },
                on: {
                    "update:visible": function(e) {
                        t.batchExitChatGroupVisible = e
                    }
                }
            }, [s("div", [s("el-button", {
                staticStyle: {
                    "margin-bottom": "10px"
                },
                attrs: {
                    type: "warning",
                    size: "mini"
                },
                on: {
                    click: t.exitAllGroup
                }
            }, [t._v(t._s(t.$t("newchat.userList.exitAll")))])], 1), s("el-table", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.batchExitGroupListLoading,
                    expression: "batchExitGroupListLoading"
                }],
                ref: "batchExitGroupList",
                staticStyle: {
                    width: "100%"
                },
                attrs: {
                    data: t.batchExitGroupList,
                    border: "",
                    size: "mini"
                }
            }, [s("el-table-column", {
                attrs: {
                    type: "selection",
                    width: "55",
                    align: "center"
                }
            }), s("el-table-column", {
                attrs: {
                    prop: "groupCode",
                    label: "群号",
                    align: "center"
                }
            }), s("el-table-column", {
                attrs: {
                    prop: "subject",
                    label: "群名称",
                    align: "center",
                    width: "200"
                }
            })], 1), s("el-pagination", {
                staticStyle: {
                    "text-align": "center"
                },
                attrs: {
                    layout: "prev, pager, next",
                    "current-page": t.groupChatPage,
                    "page-size": 20,
                    total: t.exitGroupTotal
                },
                on: {
                    "current-change": t.batchExitGroupChange
                }
            }), s("div", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [s("el-button", {
                on: {
                    click: function(e) {
                        t.batchExitChatGroupVisible = !1
                    }
                }
            }, [t._v(" " + t._s(t.$t("newchat.dialog.cancel")) + " ")]), s("el-button", {
                attrs: {
                    type: "primary",
                    loading: t.butLoading
                },
                on: {
                    click: t.batchExitChatGroup
                }
            }, [t._v(" " + t._s(t.$t("newchat.dialog.confirm")) + " ")])], 1)], 1)], 1)
        }
          , i = []
          , n = a("b85c")
          , o = a("c7eb")
          , r = a("1da1")
          , c = (a("b0c0"),
        a("3c65"),
        a("d3b7"),
        a("a434"),
        a("99af"),
        a("159b"),
        a("4de4"),
        a("14d9"),
        a("d81d"),
        a("a15b"),
        a("ac1f"),
        a("5319"),
        a("25f0"),
        a("71b4"),
        a("c740"),
        a("488e"))
          , l = a("c38a")
          , u = a("f77b")
          , d = a("bc19")
          , h = a("eda1")
          , m = a("7f45")
          , p = a.n(m)
          , g = {
            mixins: [h["a"]],
            data: function() {
                return {
                    activeName: "accountList",
                    activeNameVal: "",
                    usernameList: [],
                    accountChatNum: 1,
                    pageSize: 20,
                    total: 0,
                    accountUsername: "",
                    bookCount: 0,
                    poolOptions: [],
                    activeNum: -1,
                    loadingIcon: !1,
                    accountListLoading: !1,
                    addUserVisible: !1,
                    addForm: {
                        phone: ""
                    },
                    groupSubject: "",
                    groupChatList: [],
                    groupChatNum: 1,
                    groupChatTotal: 0,
                    groupChatLoading: !1,
                    groupLoadingIcon: !1,
                    addGroupChatVisible: !1,
                    addGroupChatForm: {
                        groupLink: ""
                    },
                    addressBookList: [],
                    addressBookNum: 0,
                    addressBookLoading: !1,
                    addressBookVal: "",
                    pullContactsVisible: !1,
                    pullContactsForm: {
                        poolId: "",
                        pullNum: 5
                    },
                    noMore: !1,
                    groupNoMore: !1,
                    butLoading: !1,
                    groupActiveName: "0",
                    usernameListExtra: [],
                    groupList: [],
                    menuGroupList: [],
                    filterChatVisible: !1,
                    filterLabelsLoading: !1,
                    lableList: [],
                    filterChatForm: {
                        labels: [],
                        addType: [],
                        isChatAi: ""
                    },
                    filterLabels: "",
                    filterAddType: "",
                    filterIsChatAi: "",
                    checkAccountStatus: -1,
                    checkAccountData: {},
                    checkTimeOut: null,
                    batchExitChatGroupVisible: !1,
                    batchExitGroupList: [],
                    batchExitGroupListLoading: !1,
                    groupChatPage: 1,
                    exitGroupTotal: 0,
                    batchOption: !1
                }
            },
            computed: {
                chatUserNameData: function() {
                    return this.$store.state.newChat.chatUserNameData
                },
                webSocketData: function() {
                    return this.$store.state.newChat.socketData
                },
                userListScoketData: function() {
                    return this.$store.state.newChat.userListScoketData
                },
                otherUsernameData: function() {
                    return this.$store.state.newChat.accountUserNameData
                },
                myUserName: function() {
                    return this.$store.state.newChat.chatUserNameData
                },
                disabled: function() {
                    return this.loadingIcon || this.noMore
                },
                groupDisabled: function() {
                    return this.groupLoadingIcon || this.groupNoMore || this.groupChatLoading
                },
                isFilter: function() {
                    return Boolean("" !== this.filterLabels || "" !== this.filterAddType || "" !== this.filterIsChatAi)
                },
                sendTime: function() {
                    var t = this;
                    return function(e) {
                        if (!e)
                            return "";
                        var a = t.$store.state.newChat.timeArea
                          , s = (new Date).getTime()
                          , i = Object(l["f"])(s, "{y}-{m}-{d}")
                          , n = Object(l["f"])(e, "{y}-{m}-{d}")
                          , o = p.a.utc(e).tz("asia/shanghai").format();
                        return i == n ? p.a.utc(o).tz(a).format("HH:mm") : p.a.utc(o).tz(a).format("MM-DD")
                    }
                },
                accountReadNum: function() {
                    return this.$store.state.newChat.chatUserNameData.readNum
                },
                groupReadNum: function() {
                    return this.$store.state.newChat.chatUserNameData.groupReadCount
                },
                hasDraft: function() {
                    var t = this;
                    return function(e) {
                        return !!t.$store.state.newChat.draftMessages[e]
                    }
                }
            },
            watch: {
                chatUserNameData: function(t) {
                    if (!t)
                        return this.usernameList = [],
                        this.addressBookList = [],
                        this.accountUsername = "",
                        void (this.bookCount = 0);
                    this.usernameList = [],
                    this.addressBookList = [],
                    this.activeNum = -1,
                    this.accountChatNum = 1,
                    this.pageSize = 20,
                    this.total = 0,
                    this.accountUsername = t.username,
                    this.bookCount = 0,
                    "accountList" == this.activeName ? (this.accountListLoading = !0,
                    this.getUsernameList()) : "addressBook" == this.activeName ? (this.addressBookLoading = !0,
                    this.getAddressBookList()) : "groupChat" == this.activeName && (this.addressBookLoading = !0,
                    this.groupChatNum = 1,
                    this.getChatGroupList())
                },
                webSocketData: function(t) {
                    if (2 == t.sendType || 102 == t.sendType)
                        if (2 == t.sendType) {
                            if (1 == t.sendInfo.isSend)
                                return void this.changeSessionContent(t);
                            var e = t.sendInfo
                              , a = {
                                createBy: null,
                                createTime: null,
                                updateBy: null,
                                updateTime: null,
                                remark: e.remark,
                                id: e.csChatUserId,
                                csUsername: e.csUsernameStr,
                                username: e.username,
                                remarkName: e.notify || e.username,
                                country: null,
                                isTop: e.isTop,
                                fanyiSourceSend: null,
                                fanyiTargetSend: null,
                                fanyiSourceGet: null,
                                fanyiTargetGet: null,
                                isAutoSend: null,
                                isAutoGet: null,
                                isBlock: e.isBlock,
                                isReurnId: null,
                                csId: null,
                                chatsType: null,
                                keyword: e.username,
                                labelIds: null,
                                readNum: 0,
                                avatarUrl: e.avatarUrl,
                                sendTime: (new Date).getTime(e.sendTime),
                                senderTimestamp: e.senderTimestamp,
                                content: e.chatContent,
                                friendsId: null,
                                labelIdsArr: null,
                                labelName: null,
                                login: e.login,
                                isRepeat: e.isRepeat
                            };
                            this.addSession(e, a),
                            this.changeSessionContent(t)
                        } else if (102 == t.sendType) {
                            var s = t.groupSendVo
                              , i = {
                                chatId: s.chatId,
                                groupId: s.groupId,
                                groupCode: s.groupCode,
                                subject: s.subject,
                                memberCount: s.memberCount,
                                chatLogId: s.chatLogId,
                                content: s.content,
                                stime: s.sendTimeStr,
                                readCount: 0,
                                avatarUrl: ""
                            };
                            console.log(i),
                            this.addGroupSession(s, i),
                            this.changeGroupSessionContent(t)
                        }
                },
                userListScoketData: function(t) {
                    t.sendType && 11 == t.sendType ? t.username == this.addForm.phone && (this.editCheckAccount(t.status),
                    clearTimeout(this.checkTimeOut),
                    1 == t.status && this.addUserVisible && this.addUser()) : this.changeSessionContent(t)
                }
            },
            mounted: function() {
                c["EventBus"].$on("delSession1", this.delSession1),
                c["EventBus"].$on("delGroupSession", this.delGroupSession),
                c["EventBus"].$on("groupMemberClickChat", this.groupMemberClickChat),
                c["EventBus"].$on("refreshGroupChat", this.refreshGroupChat),
                this.getGroupList()
            },
            methods: {
                handleClick: function(t) {
                    console.log(t),
                    this.$refs.user_listbox.scrollTop = 0,
                    this.accountChatNum = 1,
                    this.bookCount = 0,
                    this.activeNum = -1,
                    this.usernameListExtra = [],
                    this.$store.dispatch("newChat/setAccountUsernameData", ""),
                    "accountList" == t || "accountList" == t.name ? (this.accountListLoading = !0,
                    this.usernameList = [],
                    this.getUsernameList()) : "addressBook" == t || "addressBook" == t.name ? (this.addressBookLoading = !0,
                    this.addressBookList = [],
                    this.getAddressBookList()) : "groupChat" != t && "groupChat" != t.name || (this.groupChatNum = 1,
                    this.getChatGroupList())
                },
                changeAccount: function(t) {
                    if (this.usernameListExtra = [],
                    t.chatId)
                        this.activeNum = t.chatId;
                    else {
                        this.activeNum = t.id || t.username;
                        var e = this.$store.state.newChat.noReadNum
                          , a = e - t.readNum;
                        this.$store.dispatch("newChat/setNoReadNum", a),
                        0 == a && c["EventBus"].$emit("setSiderbarDot", !1)
                    }
                    var s = {
                        activeName: this.activeName,
                        itemData: t
                    };
                    c["EventBus"].$emit("getChatLog", s),
                    this.$store.dispatch("newChat/setAccountUsernameData", ""),
                    this.$store.dispatch("newChat/setAccountUsernameData", t)
                },
                load: function() {
                    this.accountUsername && (this.loadingIcon = !0,
                    this.accountChatNum += 1,
                    this.getPageUsernameList())
                },
                addressBookLoad: function() {
                    this.accountUsername && (this.loadingIcon = !0,
                    this.accountChatNum += 1,
                    this.getAddressBookList())
                },
                addUserCheck: function() {
                    var t = this;
                    this.$refs["addform"].validate((function(e) {
                        if (!e)
                            return !1;
                        t.checkAccount().then((function(e) {
                            0 != t.checkAccountStatus && (1 == t.checkAccountStatus || -1 == t.checkAccountStatus ? t.addUser() : t.$message.error(t.$t("newchat.userList.phoneVerificationFailed")))
                        }
                        ))
                    }
                    ))
                },
                addUser: function() {
                    var t = this;
                    return Object(r["a"])(Object(o["a"])().mark((function e() {
                        return Object(o["a"])().wrap((function(e) {
                            while (1)
                                switch (e.prev = e.next) {
                                case 0:
                                    t.$refs["addform"].validate((function(e) {
                                        if (!e)
                                            return !1;
                                        var a = {
                                            csUsername: t.accountUsername,
                                            username: t.addForm.phone,
                                            login: t.chatUserNameData.login
                                        };
                                        t.butLoading = !0,
                                        t.addSessionSubmit(a)
                                    }
                                    ));
                                case 1:
                                case "end":
                                    return e.stop()
                                }
                        }
                        ), e)
                    }
                    )))()
                },
                addSessionSubmit: function(t) {
                    var e = this;
                    Object(u["a"])(t).then((function(a) {
                        e.$message.success(e.$t("newchat.message.successfullyAdd")),
                        e.addUserVisible = !1,
                        e.butLoading = !1,
                        e.total += 1;
                        var s = {
                            csUsername: t.csUsername,
                            pageNum: 1,
                            pageSize: e.pageSize,
                            keyword: t.username
                        };
                        Object(u["C"])(s).then((function(t) {
                            e.usernameListExtra.unshift(t.chatInfo.chatUsers.rows[0]),
                            e.usernameList.unshift(t.chatInfo.chatUsers.rows[0]),
                            e.activeNum = e.usernameListExtra[0].id || e.usernameListExtra[0].username;
                            var a = {
                                activeName: e.activeName,
                                itemData: e.usernameList[0]
                            };
                            c["EventBus"].$emit("getChatLog", a),
                            e.$store.dispatch("newChat/setAccountUsernameData", ""),
                            e.$store.dispatch("newChat/setAccountUsernameData", e.usernameList[0]),
                            e.accountListLoading = !1
                        }
                        )).catch((function(t) {
                            e.accountListLoading = !1
                        }
                        ))
                    }
                    )).catch((function(a) {
                        e.butLoading = !1;
                        var s = e.usernameList.some((function(a, s) {
                            if (a.username == t.username) {
                                e.usernameList.splice(s, 1),
                                e.usernameList.unshift(a),
                                e.activeNum = e.usernameList[0].id || e.usernameList[0].username;
                                var i = {
                                    activeName: e.activeName,
                                    itemData: e.usernameList[0]
                                };
                                return c["EventBus"].$emit("getChatLog", i),
                                e.$store.dispatch("newChat/setAccountUsernameData", ""),
                                e.$store.dispatch("newChat/setAccountUsernameData", e.usernameList[0]),
                                !0
                            }
                        }
                        ));
                        if (!s) {
                            if (e.accountListLoading = !0,
                            !e.accountUsername)
                                return e.$message.error(e.$t("newchat.message.selectCs")),
                                void (e.accountListLoading = !1);
                            var i = {
                                csUsername: t.csUsername,
                                pageNum: 1,
                                pageSize: e.pageSize,
                                keyword: t.username
                            };
                            Object(u["C"])(i).then((function(t) {
                                if (0 != t.chatInfo.chatUsers.rows.length) {
                                    e.usernameListExtra.unshift(t.chatInfo.chatUsers.rows[0]),
                                    e.usernameList.unshift(t.chatInfo.chatUsers.rows[0]),
                                    e.activeNum = e.usernameListExtra[0].id || e.usernameListExtra[0].username;
                                    var a = {
                                        activeName: e.activeName,
                                        itemData: e.usernameList[0]
                                    };
                                    c["EventBus"].$emit("getChatLog", a),
                                    e.$store.dispatch("newChat/setAccountUsernameData", ""),
                                    e.$store.dispatch("newChat/setAccountUsernameData", e.usernameList[0]),
                                    e.accountListLoading = !1
                                } else
                                    e.accountListLoading = !1
                            }
                            )).catch((function(t) {
                                e.accountListLoading = !1
                            }
                            ))
                        }
                        e.addUserVisible = !1
                    }
                    ))
                },
                refresh: function() {
                    var t = this;
                    if (!this.accountUsername)
                        return this.$message.error(this.$t("newchat.message.selectCs")),
                        void (this.addressBookLoading = !1);
                    if (!this.addressBookLoading) {
                        var e = {
                            csUsername: this.accountUsername,
                            pageNum: this.accountChatNum,
                            pageSize: this.pageSize,
                            keyword: this.addressBookVal
                        };
                        this.noMore = !0,
                        this.addressBookLoading = !0,
                        Object(u["H"])(e).then((function(e) {
                            t.addressBookList = e.list.rows,
                            t.bookCount = e.list.total,
                            t.total = e.list.total,
                            t.poolOptions = e.poolOptions,
                            t.addressBookLoading = !1,
                            t.loadingIcon = !1,
                            t.addressBookList.length >= t.total ? t.noMore = !0 : t.noMore = !1
                        }
                        )).catch((function(e) {
                            t.accountListLoading = !1,
                            t.loadingIcon = !1,
                            t.noMore = !1
                        }
                        ))
                    }
                },
                getChatGroupList: function() {
                    var t = this;
                    if (!this.groupChatLoading) {
                        if (!this.accountUsername)
                            return this.$message.error(this.$t("newchat.message.selectCs")),
                            void (this.groupChatLoading = !1);
                        1 == this.groupChatNum ? this.groupChatLoading = !0 : this.groupLoadingIcon = !0;
                        var e = {
                            username: this.accountUsername,
                            keyword: this.groupSubject,
                            pageNum: this.groupChatNum,
                            pageSize: 10
                        };
                        this.groupNoMore = !0,
                        Object(u["I"])(e).then((function(e) {
                            1 == t.groupChatNum ? t.groupChatList = e.rows : t.groupChatList = t.groupChatList.concat(e.rows),
                            t.groupChatTotal = e.total,
                            t.groupChatList.length >= t.groupChatTotal ? t.groupNoMore = !0 : t.groupNoMore = !1,
                            t.groupChatLoading = !1,
                            t.groupLoadingIcon = !1
                        }
                        )).catch((function(e) {
                            t.groupChatLoading = !1,
                            t.groupNoMore = !0,
                            t.groupLoadingIcon = !1
                        }
                        ))
                    }
                },
                getChatGroupListPage: function() {
                    this.groupLoadingIcon = !0,
                    this.groupChatNum += 1,
                    this.getChatGroupList()
                },
                refreshGroupChat: function() {
                    this.groupChatNum = 1,
                    this.getChatGroupList()
                },
                groupCommand: function(t) {
                    "addGroupChat" == t ? this.openAddChatGroup() : "batchExitGroupChat" == t ? this.openBatchExitChatGroup() : "clearGroupChat" == t && this.clearGroupChat()
                },
                openAddChatGroup: function() {
                    "" != this.accountUsername ? this.addGroupChatVisible = !0 : this.$message.error(this.$t("newchat.message.selectCs"))
                },
                addGroupChat: function() {
                    var t = this
                      , e = {
                        groupLink: this.addGroupChatForm.groupLink + "?",
                        username: this.accountUsername
                    };
                    this.butLoading = !0,
                    Object(u["e"])(e).then((function(e) {
                        t.$message.success(t.$t("newchat.userList.addGroupChatInfo")),
                        t.addGroupChatVisible = !1,
                        t.butLoading = !1,
                        t.groupChatNum = 1,
                        t.getChatGroupList()
                    }
                    )).catch((function(e) {
                        t.butLoading = !1
                    }
                    ))
                },
                openPull: function() {
                    this.accountUsername ? this.pullContactsVisible = !0 : this.$message.error(this.$t("newchat.message.selectCs"))
                },
                pullContacts: function() {
                    var t = this;
                    this.pullContactsForm.username = this.accountUsername,
                    this.pullContactsForm.login = this.chatUserNameData.login,
                    Object(u["ab"])(this.pullContactsForm).then((function(e) {
                        t.$message.success(t.$t("newchat.message.successfullyPull")),
                        t.addressBookList = [],
                        t.getAddressBookList(),
                        t.pullContactsVisible = !1
                    }
                    )).catch((function(e) {
                        t.pullContactsVisible = !1
                    }
                    ))
                },
                onContextmenu: function(t, e) {
                    var a = this;
                    this.menuGroupList.forEach((function(t) {
                        t.userItem = e
                    }
                    ));
                    var s = [];
                    if (this.batchOption) {
                        var i = this.usernameList.filter((function(t) {
                            return t.checked
                        }
                        ));
                        s.push({
                            label: this.$t("newchat.userList.selectAll"),
                            onClick: function() {
                                a.usernameList.forEach((function(t) {
                                    a.$set(t, "checked", !0)
                                }
                                ))
                            }
                        }),
                        i.length > 0 && (s.push({
                            label: this.$t("newchat.userList.cancelAll"),
                            onClick: function() {
                                a.usernameList.forEach((function(t) {
                                    a.$set(t, "checked", !1)
                                }
                                ))
                            }
                        }),
                        s.push({
                            label: this.$t("newchat.userList.batchCloseIsAI"),
                            onClick: function() {
                                a.batchCloseAI()
                            }
                        }),
                        this.menuGroupList.length > 0 ? s.push({
                            label: this.$t("newchat.userList.batchSetGroup"),
                            children: this.menuGroupList
                        }) : s.push({
                            label: this.$t("newchat.userList.noGroupSet"),
                            disabled: !0
                        }),
                        s.push({
                            label: this.$t("newchat.userList.batchSetArchive"),
                            onClick: function() {
                                a.batchSetArchive(null, 1)
                            }
                        }))
                    } else
                        s.push({
                            label: 1 == e.isTop ? this.$t("newchat.userList.cancelTop") : this.$t("newchat.userList.top"),
                            onClick: function() {
                                if (1 == e.isTop) {
                                    var t = {
                                        id: e.id,
                                        isTop: 0
                                    };
                                    Object(u["Gb"])(t).then((function(t) {
                                        e.isTop = 0,
                                        a.$message.success(a.$t("newchat.userList.cancelTop"))
                                    }
                                    ))
                                } else {
                                    var s = {
                                        id: e.id,
                                        isTop: 1
                                    };
                                    Object(u["Gb"])(s).then((function(t) {
                                        e.isTop = 1,
                                        a.$message.success(a.$t("newchat.userList.successfullyTop"))
                                    }
                                    ))
                                }
                            }
                        }),
                        s.push({
                            label: 1 == e.isBlock ? this.$t("newchat.userList.cancelBlack") : this.$t("newchat.userList.setBalck"),
                            onClick: function() {
                                a.pullIntoBlacklist(e)
                            }
                        }),
                        this.menuGroupList.length > 0 ? s.push({
                            label: this.$t("newchat.userList.setGroup"),
                            children: this.menuGroupList
                        }) : s.push({
                            label: this.$t("newchat.userList.noGroupSet"),
                            disabled: !0
                        }),
                        1 == e.isChatAi && s.push({
                            label: this.$t("newchat.userList.closeIsAI"),
                            onClick: function() {
                                a.closeAI(e)
                            }
                        }),
                        s.push({
                            label: this.$t("newchat.userList.archiveSession"),
                            onClick: function() {
                                a.batchSetArchive(e, 1)
                            }
                        });
                    return s.push({
                        label: this.batchOption ? this.$t("newchat.userList.closeBatchOption") : this.$t("newchat.userList.batchOption"),
                        onClick: function() {
                            a.batchOption = !a.batchOption
                        }
                    }),
                    this.$contextmenu({
                        items: s,
                        event: t,
                        customClass: "custom-class",
                        zIndex: 3,
                        minWidth: 100,
                        maxHeight: 500
                    }),
                    !1
                },
                getUsernameList: function() {
                    var t = this;
                    if (!this.accountUsername)
                        return this.$message.error(this.$t("newchat.message.selectCs")),
                        void (this.accountListLoading = !1);
                    this.accountChatNum = 1,
                    this.accountListLoading = !0;
                    var e = {
                        csUsername: this.accountUsername,
                        pageNum: this.accountChatNum,
                        pageSize: this.pageSize,
                        keyword: this.activeNameVal,
                        labelIds: this.filterLabels,
                        addType: this.filterAddType,
                        isChatAi: this.filterIsChatAi
                    };
                    this.noMore = !0,
                    Object(u["C"])(e).then((function(e) {
                        t.usernameListExtra = [],
                        t.usernameList = e.chatInfo.chatUsers.rows,
                        t.total = e.chatInfo.chatUsers.total,
                        t.loadingIcon = !1,
                        t.accountListLoading = !1,
                        t.usernameList.length >= t.total ? t.noMore = !0 : t.noMore = !1
                    }
                    )).catch((function(e) {
                        t.accountListLoading = !1,
                        t.loadingIcon = !1,
                        t.noMore = !1
                    }
                    ))
                },
                getPageUsernameList: function() {
                    var t = this;
                    if (this.accountUsername) {
                        var e = {
                            csUsername: this.accountUsername,
                            pageNum: this.accountChatNum,
                            pageSize: this.pageSize,
                            keyword: this.activeNameVal
                        };
                        this.noMore = !0,
                        Object(u["C"])(e).then((function(e) {
                            var a = e.chatInfo.chatUsers.rows;
                            t.usernameListExtra.forEach((function(t) {
                                a.some((function(e, s) {
                                    if (e.username == t.username)
                                        return a.splice(s, 1),
                                        !0
                                }
                                ))
                            }
                            )),
                            t.usernameList = t.usernameList.concat(a),
                            t.total = e.chatInfo.chatUsers.total,
                            t.loadingIcon = !1,
                            t.accountListLoading = !1,
                            t.usernameList.length >= t.total ? t.noMore = !0 : t.noMore = !1
                        }
                        )).catch((function(e) {
                            t.accountListLoading = !1,
                            t.loadingIcon = !1,
                            t.noMore = !1
                        }
                        ))
                    } else
                        this.$message.error(this.$t("newchat.message.selectCs"))
                },
                openAddChat: function() {
                    var t = this;
                    this.accountUsername ? (this.addUserVisible = !0,
                    this.$nextTick((function() {
                        t.$refs.addform.resetFields()
                    }
                    ))) : this.$message.error(this.$t("newchat.message.selectCs"))
                },
                getAddressBookList: function() {
                    var t = this;
                    if (!this.accountUsername)
                        return this.$message.error(this.$t("newchat.message.selectCs")),
                        void (this.addressBookLoading = !1);
                    var e = {
                        csUsername: this.accountUsername,
                        pageNum: this.accountChatNum,
                        pageSize: this.pageSize,
                        keyword: this.addressBookVal
                    };
                    this.noMore = !0,
                    this.addressBookLoading = !0,
                    Object(u["H"])(e).then((function(e) {
                        t.addressBookList = t.addressBookList.concat(e.list.rows),
                        t.bookCount = e.list.total,
                        t.total = e.list.total,
                        t.poolOptions = e.poolOptions,
                        t.addressBookLoading = !1,
                        t.loadingIcon = !1,
                        t.addressBookList.length >= t.total ? t.noMore = !0 : t.noMore = !1
                    }
                    )).catch((function(e) {
                        t.accountListLoading = !1,
                        t.loadingIcon = !1,
                        t.noMore = !1
                    }
                    ))
                },
                topping: function(t) {
                    var e = this;
                    if (1 == t.isTop) {
                        var a = {
                            id: t.id,
                            isTop: 0
                        };
                        Object(u["Gb"])(a).then((function(a) {
                            t.isTop = 0,
                            e.$message.success(e.$t("newchat.userList.cancelTop"));
                            var s = e.usernameList.filter((function(t) {
                                if (1 == t.isTop)
                                    return !0
                            }
                            ))
                              , i = e.usernameList.indexOf(t)
                              , n = e.usernameList.splice(i, 1)[0];
                            e.usernameList.splice(s.length, 0, n)
                        }
                        ))
                    } else {
                        var s = {
                            id: t.id,
                            isTop: 1
                        };
                        Object(u["Gb"])(s).then((function(a) {
                            t.isTop = 1,
                            e.$message.success(e.$t("newchat.userList.successfullyTop"));
                            var s = e.usernameList.indexOf(t)
                              , i = e.usernameList.splice(s, 1)[0];
                            e.usernameList.unshift(i)
                        }
                        ))
                    }
                },
                groupTopping: function(t) {
                    var e = this;
                    if (1 == t.isTop) {
                        var a = {
                            id: t.chatId,
                            isTop: 0
                        };
                        Object(u["Y"])(a).then((function(a) {
                            t.isTop = 0,
                            e.$message.success(e.$t("newchat.userList.cancelTop"));
                            var s = e.groupChatList.filter((function(t) {
                                if (1 == t.isTop)
                                    return !0
                            }
                            ))
                              , i = e.groupChatList.indexOf(t)
                              , n = e.groupChatList.splice(i, 1)[0];
                            e.groupChatList.splice(s.length, 0, n)
                        }
                        ))
                    } else {
                        var s = {
                            id: t.chatId,
                            isTop: 1
                        };
                        Object(u["Y"])(s).then((function(a) {
                            t.isTop = 1,
                            e.$message.success(e.$t("newchat.userList.successfullyTop"));
                            var s = e.groupChatList.indexOf(t)
                              , i = e.groupChatList.splice(s, 1)[0];
                            e.groupChatList.unshift(i)
                        }
                        ))
                    }
                },
                pullIntoBlacklist: function(t) {
                    var e = this
                      , a = {
                        username: t.username,
                        csUsername: t.csUsername,
                        id: t.id
                    }
                      , s = "";
                    1 == t.isBlock ? (a.setType = 1,
                    s = this.$t("newchat.userList.cancelBlack")) : (a.setType = 0,
                    s = this.$t("newchat.userList.blackSuccess")),
                    Object(u["wb"])(a).then((function(a) {
                        t.isBlock = 1 == t.isBlock ? 0 : 1,
                        e.$store.dispatch("newChat/setBlock", t),
                        e.$message.success(s)
                    }
                    ))
                },
                delSession1: function(t) {
                    var e = this;
                    this.usernameList.some((function(a, s) {
                        if (a.id == t)
                            return e.usernameList.splice(s, 1),
                            e.total -= 1,
                            e.activeNum = -1,
                            !0
                    }
                    ))
                },
                delGroupSession: function(t) {
                    console.log("id", t);
                    var e, a = Object(n["a"])(this.groupChatList);
                    try {
                        for (a.s(); !(e = a.n()).done; ) {
                            var s = e.value;
                            if (s.groupId == t) {
                                this.groupChatList.splice(this.groupChatList.indexOf(s), 1),
                                this.groupChatTotal -= 1,
                                this.activeNum = -1;
                                break
                            }
                        }
                    } catch (i) {
                        a.e(i)
                    } finally {
                        a.f()
                    }
                },
                getGroupList: function() {
                    var t = this;
                    Object(u["Q"])().then((function(e) {
                        t.groupList = e.rows,
                        t.groupList.forEach((function(e) {
                            if (e.id > 6 && 100 != e.id) {
                                var a = {
                                    label: e.groupName,
                                    value: e.id,
                                    onClick: function() {
                                        t.setGroupSub(a)
                                    }
                                };
                                t.menuGroupList.push(a)
                            }
                        }
                        ))
                    }
                    ))
                },
                setGroupSub: function(t) {
                    var e = this
                      , a = {
                        id: t.value
                    };
                    this.batchOption ? a.ids = this.usernameList.filter((function(t) {
                        return t.checked
                    }
                    )).map((function(t) {
                        return t.id
                    }
                    )) : a.ids = [t.userItem.id];
                    var s = a.ids[0];
                    Object(u["zb"])(s, a).then((function(t) {
                        e.$message.success(e.$t("newchat.userList.setGroupSuccess")),
                        e.batchOption = !1
                    }
                    ))
                },
                openFilterChat: function() {
                    var t = this;
                    this.accountUsername ? (this.filterChatVisible = !0,
                    this.filterLabelsLoading = !0,
                    Object(d["j"])().then((function(e) {
                        t.lableList = e.labelOptions,
                        t.filterLabelsLoading = !1
                    }
                    ))) : this.$message.error(this.$t("newchat.message.selectCs"))
                },
                filterChat: function() {
                    this.filterLabels = this.filterChatForm.labels.join(","),
                    this.filterAddType = this.filterChatForm.addType,
                    this.filterIsChatAi = this.filterChatForm.isChatAi,
                    this.getUsernameList(),
                    this.filterChatVisible = !1
                },
                cancelFilterChat: function() {
                    this.filterChatForm.labels = [],
                    this.filterChatForm.addType = [],
                    this.filterChatForm.isChatAi = "",
                    this.filterLabels = "",
                    this.filterAddType = "",
                    this.filterIsChatAi = "",
                    this.getUsernameList(),
                    this.filterChatVisible = !1
                },
                checkAccount: function() {
                    var t = this;
                    return new Promise((function(e, a) {
                        "" == t.addForm.phone && (t.$message.error(t.$t("newchat.message.inputPhone")),
                        a());
                        var s = {
                            username: t.addForm.phone,
                            csUsername: t.accountUsername
                        }
                          , i = t.addForm.phone;
                        t.checkAccountStatus = 0,
                        t.checkAccountData = s,
                        Object(u["j"])(s).then((function(a) {
                            i == t.addForm.phone && t.addUserVisible ? (t.checkAccountStatus = a.result,
                            0 == a.result && (t.checkTimeOut = setTimeout((function() {
                                t.checkAccountStatus = -1,
                                clearTimeout(t.checkTimeOut)
                            }
                            ), 1e4))) : t.checkAccountStatus = -1,
                            e()
                        }
                        )).catch((function(e) {
                            t.checkAccountStatus = -1,
                            a()
                        }
                        ))
                    }
                    ))
                },
                editCheckAccount: function(t) {
                    this.checkAccountStatus = t
                },
                inputChangeCheckAccount: function() {
                    this.addForm.phone = this.addForm.phone.toString().replace(/[^\d]/g, ""),
                    this.checkAccountStatus = -1,
                    this.checkTimeOut && clearTimeout(this.checkTimeOut)
                },
                addSession: function(t, e) {
                    var a = this;
                    if ("" != t.csUsername && "" != t.username && this.accountUsername == t.csUsernameStr) {
                        if (0 == this.usernameList.length)
                            return this.usernameList.unshift(e),
                            void (this.total += 1);
                        var s = this.usernameList.filter((function(e) {
                            if (e.username == t.username && e.csUsername == t.csUsername)
                                return !0
                        }
                        ))
                          , i = this.usernameList.findLastIndex((function(t) {
                            return 1 == t.isTop
                        }
                        ))
                          , n = this.usernameList.filter((function(t) {
                            return 1 == t.isTop
                        }
                        )).length;
                        console.log("findLastIndex", i),
                        0 == s.length ? (1 == t.isTop ? this.usernameList.unshift(e) : i > -1 ? this.usernameList.splice(n, 0, e) : this.usernameList.unshift(e),
                        this.total += 1) : this.usernameList.forEach((function(e, s) {
                            if (e.username == t.username && e.csUsername == t.csUsername) {
                                var o = a.usernameList.splice(s, 1)[0];
                                1 == t.isTop ? a.usernameList.unshift(o) : i > -1 ? a.usernameList.splice(n, 0, o) : a.usernameList.unshift(o)
                            }
                        }
                        ))
                    }
                },
                addGroupSession: function(t, e) {
                    if (this.accountUsername == t.csUsernameStr) {
                        var a = this.groupChatList.findIndex((function(e) {
                            return e.chatId == t.chatId
                        }
                        ));
                        if (a > -1) {
                            var s = this.groupChatList.filter((function(t) {
                                return 1 == t.isTop
                            }
                            )).length
                              , i = this.groupChatList.splice(a, 1)[0];
                            1 == t.isTop ? this.groupChatList.unshift(i) : s > 0 ? this.groupChatList.splice(s, 0, i) : this.groupChatList.unshift(i)
                        } else {
                            var n = this.groupChatList.filter((function(t) {
                                return 1 == t.isTop
                            }
                            )).length;
                            this.groupChatList.splice(n, 0, e),
                            this.total += 1
                        }
                    }
                },
                changeSessionContent: function(t) {
                    var e = this;
                    if (2 == t.sendType) {
                        var a = t.sendInfo;
                        this.usernameList.forEach((function(t, s) {
                            if (t.username == a.username && t.csUsername == a.csUsername) {
                                if (e.$set(t, "sendTime", new Date),
                                1 == a.chatType)
                                    a.latitude ? e.$set(t, "content", e.$t("newchat.userList.position")) : e.$set(t, "content", a.chatContent);
                                else if (2 == a.chatType)
                                    switch (a.sms.type) {
                                    case 4:
                                        e.$set(t, "content", e.$t("newchat.userList.audio"));
                                        break;
                                    case 3:
                                        e.$set(t, "content", e.$t("newchat.userList.video"));
                                        break;
                                    case 1:
                                        e.$set(t, "content", e.$t("newchat.userList.image"));
                                        break;
                                    case 8:
                                        e.$set(t, "content", e.$t("newchat.userList.gif"));
                                        break;
                                    case 5:
                                        e.$set(t, "content", e.$t("newchat.userList.expression"));
                                        break;
                                    case 7:
                                        e.$set(t, "content", e.$t("newchat.userList.businessCard"));
                                        break;
                                    case 9:
                                        e.$set(t, "content", e.$t("newchat.userList.link"));
                                        break;
                                    case 2:
                                        e.$set(t, "content", e.$t("newchat.userList.file"));
                                        break;
                                    case 10:
                                        e.$set(t, "content", e.$t("newchat.userList.position"));
                                        break;
                                    default:
                                        e.$set(t, "content", e.$t("newchat.userList.message"));
                                        break
                                    }
                                else
                                    3 == a.chatType ? e.$set(t, "content", e.$t("newchat.userList.voiceCall")) : 4 == a.chatType ? e.$set(t, "content", e.$t("newchat.userList.voiceVideoCall")) : 6 == a.chatType && e.$set(t, "content", e.$t("newchat.userList.voiceMissedCalls"));
                                e.otherUsernameData.username == a.username && e.otherUsernameData.csUsername == a.csUsername || 0 != a.isSend || (t.readNum += 1),
                                0 != a.isSend || t.groupId || e.$set(t, "moveStatus", 0)
                            }
                        }
                        ))
                    } else if (102 == t.sendType) {
                        var s = t.groupSendVo
                          , i = this.groupChatList.findIndex((function(t, e) {
                            if (t.groupId == s.groupId)
                                return !0
                        }
                        ));
                        i > -1 && this.setSessionContent(s, this.groupChatList[i])
                    }
                },
                changeGroupSessionContent: function(t) {
                    if (t.groupSendVo.csUsernameStr == this.myUserName.username) {
                        var e = t.groupSendVo
                          , a = this.groupChatList.findIndex((function(t, a) {
                            return t.chatId == e.chatId
                        }
                        ));
                        console.log("groupItemIndex", a),
                        a > -1 && (this.setSessionContent(e, this.groupChatList[a]),
                        this.activeNum != e.chatId && (this.groupChatList[a].readCount += 1,
                        this.myUserName.groupReadNum += 1))
                    }
                },
                setSessionContent: function(t, e) {
                    if (this.$set(e, "sendTime", new Date),
                    1 == t.chatType)
                        t.latitude ? this.$set(e, "content", this.$t("newchat.userList.position")) : this.$set(e, "content", t.chatContent);
                    else if (2 == t.chatType)
                        switch (t.sms.type) {
                        case 4:
                            this.$set(e, "content", this.$t("newchat.userList.audio"));
                            break;
                        case 3:
                            this.$set(e, "content", this.$t("newchat.userList.video"));
                            break;
                        case 1:
                            this.$set(e, "content", this.$t("newchat.userList.image"));
                            break;
                        case 8:
                            this.$set(e, "content", this.$t("newchat.userList.gif"));
                            break;
                        case 5:
                            this.$set(e, "content", this.$t("newchat.userList.expression"));
                            break;
                        case 7:
                            this.$set(e, "content", this.$t("newchat.userList.businessCard"));
                            break;
                        case 9:
                            this.$set(e, "content", this.$t("newchat.userList.link"));
                            break;
                        case 2:
                            this.$set(e, "content", this.$t("newchat.userList.file"));
                            break;
                        case 10:
                            this.$set(e, "content", this.$t("newchat.userList.position"));
                            break;
                        default:
                            this.$set(e, "content", this.$t("newchat.userList.message"));
                            break
                        }
                    else
                        3 == t.chatType ? this.$set(e, "content", this.$t("newchat.userList.voiceCall")) : 4 == t.chatType ? this.$set(e, "content", this.$t("newchat.userList.voiceVideoCall")) : 6 == t.chatType && this.$set(e, "content", this.$t("newchat.userList.voiceMissedCalls"))
                },
                openBatchExitChatGroup: function() {
                    "" != this.accountUsername ? (this.batchExitChatGroupVisible = !0,
                    this.getAllChatGroupList()) : this.$message.error(this.$t("newchat.message.selectCs"))
                },
                getAllChatGroupList: function() {
                    var t = this;
                    this.batchExitGroupListLoading = !0;
                    var e = {
                        username: this.accountUsername,
                        pageNum: this.groupChatPage,
                        pageSize: 20
                    };
                    Object(u["I"])(e).then((function(e) {
                        t.batchExitGroupList = e.rows,
                        t.batchExitGroupListLoading = !1
                    }
                    )).catch((function(e) {
                        t.batchExitGroupListLoading = !1
                    }
                    ))
                },
                batchExitChatGroup: function() {
                    var t = this
                      , e = this.$refs.batchExitGroupList.selection.map((function(t) {
                        return t.groupId
                    }
                    ));
                    if (0 != e.length) {
                        var a = {
                            groupIds: e,
                            username: this.accountUsername
                        };
                        this.butLoading = !0,
                        Object(u["jb"])(a).then((function(e) {
                            t.$message({
                                type: "success",
                                message: t.$t("newchat.chatwindow.quitGroupSuccess")
                            }),
                            t.butLoading = !1,
                            t.batchExitChatGroupVisible = !1,
                            t.groupChatNum = 1,
                            t.getChatGroupList()
                        }
                        ))
                    } else
                        this.$message.error(this.$t("newchat.chatwindow.selectGroup"))
                },
                batchExitGroupChange: function(t) {
                    this.groupChatPage = t,
                    this.getAllChatGroupList()
                },
                exitAllGroup: function() {
                    var t = this;
                    this.$confirm(this.$t("newchat.chatwindow.exitAllGroup"), this.$t("newchat.chatwindow.prompt"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        type: "warning"
                    }).then((function() {
                        var e = {
                            username: t.accountUsername,
                            groupIds: [1],
                            isAll: 1
                        };
                        t.butLoading = !0,
                        Object(u["jb"])(e).then((function(e) {
                            t.$message({
                                type: "success",
                                message: t.$t("newchat.chatwindow.quitGroupSuccess")
                            }),
                            t.butLoading = !1,
                            t.batchExitChatGroupVisible = !1,
                            t.groupChatNum = 1,
                            t.getChatGroupList()
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                clearGroupChat: function() {
                    var t = this;
                    this.$prompt(this.$t("newchat.chatwindow.clearGroupChatInfo"), this.$t("newchat.userList.clearGroupChat"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        inputPattern: /confirm/,
                        inputErrorMessage: this.$t("newchat.chatwindow.clearGroupChatErrorInfo")
                    }).then((function(e) {
                        var a = e.value;
                        if ("confirm" == a) {
                            var s = [t.myUserName.username];
                            Object(u["m"])(s).then((function(e) {
                                t.$message.success(t.$t("newchat.chatwindow.clearGroupChatSuccess")),
                                t.refreshGroupChat(),
                                t.$store.state.newChat.accountUserNameData.groupId && t.$store.dispatch("newChat/setAccountUsernameData", "")
                            }
                            )).catch((function(t) {}
                            ))
                        }
                    }
                    )).catch((function() {}
                    ))
                },
                closeAI: function(t) {
                    var e = this;
                    this.$confirm(this.$t("newchat.chatwindow.closeAIInfo"), this.$t("newchat.chatwindow.tip"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        type: "warning"
                    }).then((function() {
                        var a = {
                            isChatAi: 0,
                            ids: [t.id]
                        };
                        Object(u["o"])(a).then((function(a) {
                            e.$message({
                                type: "success",
                                message: e.$t("newchat.chatwindow.closeSuccess")
                            }),
                            t.isChatAi = 0
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                batchCloseAI: function() {
                    var t = this
                      , e = this.usernameList.filter((function(t) {
                        return t.checked
                    }
                    )).map((function(t) {
                        return t.id
                    }
                    ));
                    this.$confirm(this.$t("newchat.chatwindow.closeAIInfo"), this.$t("newchat.chatwindow.tip"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        type: "warning"
                    }).then((function() {
                        var a = {
                            isChatAi: 0,
                            ids: e
                        };
                        Object(u["o"])(a).then((function(e) {
                            t.$message({
                                type: "success",
                                message: t.$t("newchat.chatwindow.closeSuccess")
                            }),
                            t.batchOption = !1,
                            t.getUsernameList()
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                batchSetArchive: function(t, e) {
                    var a = this
                      , s = [];
                    s = this.batchOption ? this.usernameList.filter((function(t) {
                        return t.checked
                    }
                    )).map((function(t) {
                        return t.id
                    }
                    )) : [t.id];
                    var i = e ? this.$t("newchat.chatwindow.setArchiveInfo") : this.$t("newchat.chatwindow.cancelArchiveInfo");
                    this.$confirm(i, this.$t("newchat.chatwindow.tip"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        type: "warning"
                    }).then((function() {
                        var t = {
                            isFile: e,
                            ids: s
                        };
                        Object(u["h"])(t).then((function(t) {
                            a.$message({
                                type: "success",
                                message: e ? a.$t("newchat.chatwindow.setArchiveSuccess") : a.$t("newchat.chatwindow.cancelArchiveSuccess")
                            }),
                            a.batchOption = !1,
                            a.getUsernameList(),
                            c["EventBus"].$emit("getAccountList"),
                            c["EventBus"].$emit("getNotRead")
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                groupMemberClickChat: function(t) {
                    this.activeName = "accountList",
                    this.addSessionSubmit(t)
                }
            },
            destroyed: function() {
                c["EventBus"].$off("getUsernameList"),
                c["EventBus"].$off("delSession1"),
                c["EventBus"].$off("delGroupSession"),
                c["EventBus"].$off("groupMemberClickChat"),
                c["EventBus"].$off("refreshGroupChat")
            }
        }
          , f = g
          , b = (a("dc98"),
        a("2877"))
          , v = Object(b["a"])(f, s, i, !1, null, "182842d9", null);
        e["default"] = v.exports
    },
    "782a": function(t, e, a) {},
    "7aae": function(t, e, a) {},
    "805c": function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("div", {
                staticClass: "mian-box",
                class: 0 == t.itemData.isSen ? "left-box" : "right-box"
            }, [1 == t.itemData.isSend && t.itemData.fileUrl ? a("el-card", {
                staticClass: "box-card",
                nativeOn: {
                    click: function(e) {
                        return t.openDia(e)
                    },
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onMyContextmenu(e, t.itemData)
                    }
                }
            }, [a("div", {
                staticClass: "card-top"
            }, [a("div", {
                staticClass: "name"
            }, [t._v(t._s(t.itemData.fileName))]), a("i", {
                staticClass: "el-icon-document icon"
            })]), a("div", {
                staticClass: "card-bot"
            })]) : 0 == t.itemData.isSend && t.itemData.fileUrl ? a("el-card", {
                staticClass: "box-card",
                nativeOn: {
                    click: function(e) {
                        return t.openDia(e)
                    },
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onOtherContextmenu(e, t.itemData)
                    }
                }
            }, [a("div", {
                staticClass: "card-top"
            }, [a("div", {
                staticClass: "name"
            }, [t._v(t._s(t.itemData.fileName))]), a("i", {
                staticClass: "el-icon-document icon"
            })]), a("div", {
                staticClass: "card-bot"
            })]) : 0 == t.itemData.isSend ? [a("div", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.getMaterialMessageLoading,
                    expression: "getMaterialMessageLoading"
                }],
                staticClass: "text_back_color"
            }, [a("div", {
                staticClass: "content-text"
            }, [t._v(t._s(t.$t("newchat.chatwindow.file")))]), a("el-button", {
                attrs: {
                    type: "text",
                    size: "mini"
                },
                on: {
                    click: t.getGroupSm
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.get")))])], 1)] : [a("div", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.getMaterialMessageLoading,
                    expression: "getMaterialMessageLoading"
                }],
                staticClass: "text_back_color"
            }, [a("div", {
                staticClass: "content-text"
            }, [t._v("[" + t._s(t.itemData.fileName) + "]")]), a("el-button", {
                attrs: {
                    type: "text",
                    size: "mini"
                },
                on: {
                    click: t.openDia
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.download")))])], 1)], 1 == t.itemData.isSendType ? a("div", {
                staticClass: "loading-icon"
            }, [a("i", {
                staticClass: "el-icon-loading"
            })]) : t._e()], 2)
        }
          , i = []
          , n = (a("ac1f"),
        a("5319"),
        a("6b98"))
          , o = a("f77b")
          , r = (a("bc3a"),
        {
            mixins: [n["a"]],
            props: ["itemData", "nolog"],
            data: function() {
                return {
                    getMaterialMessageLoading: !1
                }
            },
            mounted: function() {},
            methods: {
                openDia: function() {
                    var t = this;
                    this.nolog || this.$confirm(this.$t("newchat.chatwindow.sureDownload"), this.$t("newchat.message.prompt"), {
                        confirmButtonText: this.$t("newchat.dialog.confirm"),
                        cancelButtonText: this.$t("newchat.dialog.cancel"),
                        type: "info"
                    }).then((function() {
                        var e = t.itemData.fileUrl;
                        e = e.replace("http://", "https://"),
                        t.$download.saveAs(e),
                        t.$message({
                            type: "success",
                            message: t.$t("newchat.message.downloadSuccessful")
                        })
                    }
                    )).catch((function() {}
                    ))
                },
                getGroupSm: function() {
                    var t = this;
                    this.getMaterialMessageLoading = !0,
                    this.itemData.sendTime = this.parseTime(this.itemData.sendTime, "{y}-{m}-{d} {h}:{i}:{s}"),
                    Object(o["T"])(this.itemData).then((function(e) {
                        t.$emit("updateMessage", e),
                        t.getMaterialMessageLoading = !1
                    }
                    ))
                }
            }
        })
          , c = r
          , l = (a("9363"),
        a("2877"))
          , u = Object(l["a"])(c, s, i, !1, null, "3da766c6", null);
        e["default"] = u.exports
    },
    8149: function(t, e, a) {
        t.exports = a.p + "dist-20260618-092121/static/img/sendbefore.png"
    },
    8273: function(t, e, a) {},
    8361: function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("div", {
                staticClass: "material-library-index-right",
                class: {
                    "is-collapse": t.isCollapse
                }
            }, [a("div", {
                staticClass: "collapse-icon"
            }, [t.isCollapse ? a("i", {
                staticClass: "icon el-icon-d-arrow-left",
                on: {
                    click: t.handleCollapse
                }
            }) : a("i", {
                staticClass: "icon el-icon-d-arrow-right",
                on: {
                    click: t.handleCollapse
                }
            })]), t.isCollapse ? a("div", {
                staticStyle: {
                    "text-align": "center"
                },
                on: {
                    click: t.handleCollapse
                }
            }, [a("span", {
                staticStyle: {
                    "text-align": "center",
                    color: "#303133",
                    "font-size": "14px",
                    cursor: "pointer",
                    "writing-mode": "vertical-lr",
                    "letter-spacing": "2px"
                }
            }, [t._v(" " + t._s(t.$t("newchat.materialLibrary.quickReplyNav")) + " ")])]) : a("div", {
                staticClass: "material-content"
            }, [a("div", {
                staticClass: "material-content-left"
            }, [a("el-radio-group", {
                staticClass: "radio-group",
                attrs: {
                    size: "mini",
                    disabled: 0 === t.activeType
                },
                on: {
                    change: t.tabChange
                },
                model: {
                    value: t.tabPosition,
                    callback: function(e) {
                        t.tabPosition = e
                    },
                    expression: "tabPosition"
                }
            }, [a("el-radio-button", {
                staticStyle: {
                    width: "50%"
                },
                attrs: {
                    label: 0
                }
            }, [t._v(t._s(t.$t("newchat.materialLibrary.private")))]), a("el-radio-button", {
                staticStyle: {
                    width: "50%"
                },
                attrs: {
                    label: 1
                }
            }, [t._v(t._s(t.$t("newchat.materialLibrary.public")))])], 1), a("span", {
                staticStyle: {
                    "font-size": "12px",
                    color: "#909399",
                    "margin-bottom": "10px"
                }
            }, [t._v(t._s(t.typeName))]), a("el-collapse", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.textGroupLoading,
                    expression: "textGroupLoading"
                }],
                staticClass: "collapse-container",
                attrs: {
                    accordion: ""
                },
                on: {
                    change: t.collapseChange
                },
                model: {
                    value: t.activeNames,
                    callback: function(e) {
                        t.activeNames = e
                    },
                    expression: "activeNames"
                }
            }, t._l(t.textGroupList, (function(e) {
                return a("el-collapse-item", {
                    key: e.id,
                    attrs: {
                        name: e.id
                    }
                }, [a("template", {
                    slot: "title"
                }, [a("i", {
                    staticClass: "el-icon-folder"
                }), a("el-tooltip", {
                    attrs: {
                        content: e.groupName,
                        placement: "left",
                        "open-delay": 300
                    }
                }, [a("span", {
                    staticClass: "group-name"
                }, [t._v(t._s(e.groupName))])]), a("span", {
                    staticClass: "group-count"
                }, [t._v("（" + t._s(t.activeType ? e.smCount : e.messageNum) + "）")])], 1), a("div", {
                    directives: [{
                        name: "loading",
                        rawName: "v-loading",
                        value: t.materialLoading,
                        expression: "materialLoading"
                    }]
                }, [0 == t.materialList.length ? a("el-empty") : t._l(t.materialList, (function(e) {
                    return a("div", {
                        key: e.id
                    }, [a("div", {
                        staticClass: "material-item"
                    }, [a("div", {
                        staticClass: "material-item-name"
                    }, [a("span", [t._v(t._s(e.messageName || e.smName || "/"))]), a("el-button", {
                        attrs: {
                            type: "text",
                            size: "mini",
                            disabled: t.sendDisabled
                        },
                        on: {
                            click: function(a) {
                                return t.handleSend(e)
                            }
                        }
                    }, [t._v(t._s(t.$t("newchat.materialLibrary.send")))])], 1), a("div", {
                        staticClass: "material-item-content"
                    }, [0 == t.activeType ? a("div", [t._v(t._s(e.messageContent))]) : 1 == t.activeType || 8 == t.activeType ? a("div", [a("el-image", {
                        staticStyle: {
                            width: "50px",
                            height: "50px"
                        },
                        attrs: {
                            src: e.thumbnail || e.fileUrl
                        }
                    })], 1) : 3 == t.activeType ? a("div", [a("video", {
                        staticStyle: {
                            width: "50px",
                            height: "50px"
                        },
                        attrs: {
                            src: e.fileUrl
                        }
                    })]) : 4 == t.activeType ? a("div", [a("audio", {
                        staticStyle: {
                            width: "100%",
                            height: "30px"
                        },
                        attrs: {
                            src: e.fileUrl,
                            controls: ""
                        }
                    })]) : 5 == t.activeType ? a("div", [a("el-image", {
                        staticStyle: {
                            width: "50px",
                            height: "50px"
                        },
                        attrs: {
                            src: e.fileUrl
                        }
                    })], 1) : 7 == t.activeType ? a("div", [t._v(" " + t._s(e.displayName || "/") + " ")]) : 2 == t.activeType ? a("div", [t._v(" " + t._s(e.fileName) + " ")]) : 11 == t.activeType ? a("div", [a("div", {
                        staticClass: "material-content-text"
                    }, [t._v(t._s(e.text))])]) : 9 == t.activeType || 12 == t.activeType || 13 == t.activeType ? a("div", [a("div", {
                        staticStyle: {
                            display: "flex"
                        }
                    }, [a("el-image", {
                        staticStyle: {
                            width: "50px",
                            height: "50px",
                            "flex-shrink": "0"
                        },
                        attrs: {
                            src: e.thumbnail
                        }
                    }), a("div", {
                        staticStyle: {
                            "margin-left": "5px"
                        }
                    }, [a("div", {
                        staticClass: "material-content-text"
                    }, [t._v(t._s(e.title || "/"))]), a("div", {
                        staticClass: "material-content-text"
                    }, [t._v(t._s(e.text || "/"))]), a("div", {
                        staticClass: "material-content-text"
                    }, [t._v(t._s(e.body || "/"))])])], 1)]) : t._e()])])])
                }
                ))], 2)], 2)
            }
            )), 1)], 1), a("div", {
                staticClass: "material-type-list"
            }, t._l(t.materialTypeList, (function(e) {
                return 13 == e.id && t.$store.state.newChat.accountUserNameData.groupId ? t._e() : a("div", {
                    key: e.id,
                    staticClass: "material-type-item",
                    class: {
                        active: t.activeType == e.id
                    },
                    on: {
                        click: function(a) {
                            return t.handleMaterialType(e)
                        }
                    }
                }, [e.isSvg ? a("svg-icon", {
                    style: {
                        width: e.size + "px",
                        height: e.size + "px"
                    },
                    attrs: {
                        "icon-class": e.icon
                    }
                }) : a("i", {
                    class: e.icon
                })], 1)
            }
            )), 0)])])
        }
          , i = []
          , n = (a("7db0"),
        a("d3b7"),
        a("f77b"))
          , o = a("eef2")
          , r = a("488e")
          , c = {
            name: "MaterialLibraryIndexRight",
            data: function() {
                return {
                    tabPosition: 0,
                    activeNames: "",
                    isCollapse: !0,
                    textGroupList: [],
                    textGroupLoading: !1,
                    materialList: [],
                    materialLoading: !0,
                    pageNum: 1,
                    pageSize: 999999999,
                    activeType: 0
                }
            },
            watch: {
                "accountUsername.groupId": {
                    handler: function(t) {
                        t && 13 == this.activeType && this.handleMaterialType({
                            id: 1
                        })
                    },
                    immediate: !0
                }
            },
            computed: {
                accountUsername: function() {
                    return this.$store.state.newChat.accountUserNameData
                },
                sendDisabled: function() {
                    var t = this.$store.state.newChat.accountUserNameData;
                    return !t.username && !t.groupId || 1 == t.announcement && 2 == t.groupIdentity
                },
                typeName: function() {
                    var t = this;
                    return this.materialTypeList.find((function(e) {
                        return e.id == t.activeType
                    }
                    )).typeName
                },
                materialTypeList: function() {
                    return [{
                        id: 0,
                        typeName: this.$t("newchat.materialLibrary.text"),
                        icon: "el-icon-chat-line-square",
                        size: 20,
                        isSvg: !1
                    }, {
                        id: 1,
                        typeName: this.$t("newchat.materialLibrary.image"),
                        icon: "el-icon-picture-outline",
                        size: 20,
                        isSvg: !1
                    }, {
                        id: 3,
                        typeName: this.$t("newchat.materialLibrary.video"),
                        icon: "el-icon-video-play",
                        size: 20,
                        isSvg: !1
                    }, {
                        id: 4,
                        typeName: this.$t("newchat.materialLibrary.audio"),
                        icon: "el-icon-mic",
                        size: 20,
                        isSvg: !1
                    }, {
                        id: 7,
                        typeName: this.$t("newchat.materialLibrary.businessCard"),
                        icon: "el-icon-postcard",
                        size: 20,
                        isSvg: !1
                    }, {
                        id: 2,
                        typeName: this.$t("newchat.materialLibrary.file"),
                        icon: "el-icon-document",
                        size: 20,
                        isSvg: !1
                    }, {
                        id: 9,
                        typeName: this.$t("newchat.materialLibrary.link"),
                        icon: "el-icon-link",
                        size: 20,
                        isSvg: !1
                    }, {
                        id: 8,
                        typeName: "GIF",
                        icon: "gif",
                        size: 20,
                        isSvg: !0
                    }, {
                        id: 5,
                        typeName: this.$t("newchat.materialLibrary.expression"),
                        icon: "expression",
                        size: 20,
                        isSvg: !0
                    }, {
                        id: 11,
                        typeName: this.$t("newchat.materialLibrary.forwardSuperLink"),
                        icon: "forward",
                        size: 18,
                        isSvg: !0
                    }, {
                        id: 12,
                        typeName: this.$t("newchat.materialLibrary.imageLink"),
                        icon: "imageText",
                        size: 16,
                        isSvg: !0
                    }, {
                        id: 13,
                        typeName: this.$t("newchat.materialLibrary.imageTextTemplate"),
                        icon: "template",
                        size: 16,
                        isSvg: !0
                    }]
                }
            },
            mounted: function() {
                this.getMaterialGroupList();
                var t = localStorage.getItem("isCollapse");
                t && (this.isCollapse = "true" == t)
            },
            methods: {
                collapseChange: function(t) {
                    this.materialList = [],
                    (t || 0 === t) && this.getList()
                },
                tabChange: function(t) {
                    this.activeNames = "",
                    this.materialList = [],
                    this.getMaterialGroupList()
                },
                handleCollapse: function() {
                    this.isCollapse = !this.isCollapse,
                    localStorage.setItem("isCollapse", this.isCollapse),
                    this.isCollapse || this.getMaterialGroupList()
                },
                handleMaterialType: function(t) {
                    this.activeType = t.id,
                    this.activeNames = "",
                    this.materialList = [],
                    this.getMaterialGroupList()
                },
                getList: function() {
                    0 == this.activeType ? this.qmessagestoreGet() : this.getSmList()
                },
                getMaterialGroupList: function() {
                    0 == this.activeType ? this.qmessagegroupGet() : this.getSmstoreGroup()
                },
                getSmstoreGroup: function() {
                    var t = this
                      , e = {
                        isCharge: this.tabPosition,
                        smType: this.activeType,
                        status: 1
                    };
                    this.textGroupLoading = !0,
                    Object(o["f"])(e).then((function(e) {
                        t.textGroupList = e.rows
                    }
                    )).finally((function() {
                        t.textGroupLoading = !1
                    }
                    ))
                },
                getSmList: function() {
                    var t = this;
                    this.materialLoading = !0;
                    var e = {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        sType: this.activeType,
                        groupId: this.activeNames,
                        isCharge: this.tabPosition,
                        status: 1
                    };
                    Object(n["W"])(e).then((function(e) {
                        t.materialList = e.rows
                    }
                    )).finally((function() {
                        t.materialLoading = !1
                    }
                    ))
                },
                qmessagegroupGet: function() {
                    var t = this;
                    this.textGroupLoading = !0,
                    Object(n["eb"])().then((function(e) {
                        t.textGroupList = e.rows,
                        t.textGroupLoading = !1
                    }
                    )).catch((function(e) {
                        t.textGroupLoading = !1
                    }
                    ))
                },
                qmessagestoreGet: function() {
                    var t = this;
                    this.materialLoading = !0;
                    var e = {
                        groupId: this.activeNames,
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    };
                    Object(n["ib"])(e).then((function(e) {
                        t.materialList = e.rows,
                        t.total = e.total
                    }
                    )).finally((function() {
                        t.materialLoading = !1
                    }
                    ))
                },
                handleSend: function(t) {
                    0 == this.activeType ? r["EventBus"].$emit("sendQRText", t) : r["EventBus"].$emit("sendMeterial", t)
                }
            }
        }
          , l = c
          , u = (a("e6ca"),
        a("2877"))
          , d = Object(u["a"])(l, s, i, !1, null, "66c07b33", null);
        e["default"] = d.exports
    },
    "84e6": function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , s = t._self._c || e;
            return s("div", {
                staticClass: "mian-box",
                class: 0 == t.item.isSen ? "left-box" : "right-box"
            }, [s("div", {
                staticClass: "video-box"
            }, [1 == t.item.isSend ? s("div", {
                staticClass: "msg-content-box",
                on: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onMyContextmenu(e, t.item)
                    }
                }
            }, [s("div", {
                ref: "item_content_list",
                staticClass: "item_content",
                class: t.item.caption ? "back_color" : ""
            }, [t.item.fileUrl ? [s("div", {
                staticClass: "log-item-video-box"
            }, [s("video", {
                ref: "log_item_video",
                staticClass: "log-item-video",
                staticStyle: {
                    width: "150px"
                },
                attrs: {
                    src: t.item.fileUrl
                }
            }), s("div", {
                ref: "log_item_video_icon",
                staticClass: "mask-box",
                on: {
                    click: function(e) {
                        return e.stopPropagation(),
                        t.videoPlay(e)
                    }
                }
            }, [s("i", {
                staticClass: "el-icon-video-play icon"
            })])]), t.item.caption ? s("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(" " + t._s(t.item.caption) + " ")]) : t._e()] : [s("div", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.getMaterialMessageLoading,
                    expression: "getMaterialMessageLoading"
                }],
                staticClass: "text_back_color"
            }, [s("div", {
                staticClass: "content-text"
            }, [t._v(t._s(t.$t("newchat.chatwindow.video")))]), s("el-button", {
                attrs: {
                    type: "text",
                    size: "mini"
                },
                on: {
                    click: t.getGroupSm
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.get")))])], 1)]], 2), t.item.text ? s("div", {
                staticClass: "item_content original"
            }, [s("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(" " + t._s(t.$t("newchat.chatwindow.original")) + "：" + t._s(t.item.text) + " ")])]) : t._e()]) : s("div", {
                staticClass: "msg-content-box",
                on: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onOtherContextmenu(e, t.item)
                    }
                }
            }, [s("div", {
                staticStyle: {
                    display: "flex",
                    "align-items": "center"
                }
            }, [s("div", {
                ref: "item_content_list",
                staticClass: "item_content",
                class: t.item.caption ? "back_color" : ""
            }, [t.item.fileUrl ? [s("div", {
                staticClass: "log-item-video-box"
            }, [s("video", {
                ref: "log_item_video",
                staticClass: "log-item-video",
                staticStyle: {
                    width: "150px",
                    "border-radius": "5px"
                },
                attrs: {
                    src: t.item.fileUrl
                }
            }), s("div", {
                ref: "log_item_video_icon",
                staticClass: "mask-box",
                on: {
                    click: function(e) {
                        return e.stopPropagation(),
                        t.videoPlay(e)
                    }
                }
            }, [s("i", {
                staticClass: "el-icon-video-play icon"
            })])]), t.item.caption ? s("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(" " + t._s(t.item.caption) + " ")]) : t._e()] : [s("div", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.getMaterialMessageLoading,
                    expression: "getMaterialMessageLoading"
                }],
                staticClass: "text_back_color"
            }, [s("div", {
                staticClass: "content-text"
            }, [t._v(t._s(t.$t("newchat.chatwindow.video")))]), s("el-button", {
                attrs: {
                    type: "text",
                    size: "mini"
                },
                on: {
                    click: t.getGroupSm
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.get")))])], 1)]], 2), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.chatwindow.translate"),
                    placement: "right"
                }
            }, [0 == t.item.isSend && t.item.caption ? s("div", {
                staticClass: "translateIcon"
            }, [t.canTranslateTime ? s("el-image", {
                staticStyle: {
                    width: "15px",
                    height: "15px"
                },
                attrs: {
                    src: a("69b7"),
                    fit: "cover"
                },
                on: {
                    click: function(e) {
                        return t.translateClick(t.item)
                    }
                }
            }) : s("div", {
                staticClass: "translateWart"
            }, [t._v(t._s(t.translateTime))])], 1) : t._e()])], 1), t.isTranslate ? s("div", {
                ref: "item_content_list",
                staticClass: "item_content original",
                on: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onTranslateContextmenu(e, t.item.chatVideo)
                    }
                }
            }, [s("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t.isTranslateEnd ? [t.item.chatVideo ? s("div", [t._v(" " + t._s(t.$t("newchat.chatwindow.original")) + "：" + t._s(t.item.chatVideo) + " ")]) : t._e(), t.item.chatTranslate ? s("div", [t._v(" " + t._s(t.$t("newchat.chatwindow.translate")) + "：" + t._s(t.item.chatTranslate) + " ")]) : t._e()] : s("i", {
                staticClass: "el-icon-loading"
            })], 2)]) : t._e()]), 1 == t.item.isSendType ? s("div", {
                staticClass: "loading-icon"
            }, [s("i", {
                staticClass: "el-icon-loading"
            })]) : t._e()]), s("el-dialog", {
                attrs: {
                    width: "500px",
                    visible: t.dialogVideoVisible,
                    "append-to-body": ""
                },
                on: {
                    "update:visible": function(e) {
                        t.dialogVideoVisible = e
                    }
                }
            }, [s("video", {
                staticStyle: {
                    "max-height": "700px",
                    width: "100%"
                },
                attrs: {
                    autoplay: "",
                    controls: "",
                    src: t.item.fileUrl
                }
            })])], 1)
        }
          , i = []
          , n = a("6b98")
          , o = a("f77b")
          , r = {
            mixins: [n["a"]],
            props: ["item", "nolog"],
            data: function() {
                return {
                    isTranslate: !1,
                    isTranslateEnd: !1,
                    dialogVideoVisible: !1,
                    getMaterialMessageLoading: !1
                }
            },
            mounted: function() {},
            methods: {
                videoPlay: function() {
                    this.dialogVideoVisible = !0
                },
                getGroupSm: function() {
                    var t = this;
                    this.getMaterialMessageLoading = !0,
                    this.item.sendTime = this.parseTime(this.item.sendTime, "{y}-{m}-{d} {h}:{i}:{s}"),
                    Object(o["T"])(this.item).then((function(e) {
                        t.$emit("updateMessage", e),
                        t.getMaterialMessageLoading = !1
                    }
                    ))
                }
            }
        }
          , c = r
          , l = (a("ad61"),
        a("2877"))
          , u = Object(l["a"])(c, s, i, !1, null, "7e29e87c", null);
        e["default"] = u.exports
    },
    "86e6": function(t, e, a) {},
    "88ec": function(t, e, a) {},
    "8a79": function(t, e, a) {
        "use strict";
        var s = a("23e7")
          , i = a("e330")
          , n = a("06cf").f
          , o = a("50c4")
          , r = a("577e")
          , c = a("5a34")
          , l = a("1d80")
          , u = a("ab13")
          , d = a("c430")
          , h = i("".endsWith)
          , m = i("".slice)
          , p = Math.min
          , g = u("endsWith")
          , f = !d && !g && !!function() {
            var t = n(String.prototype, "endsWith");
            return t && !t.writable
        }();
        s({
            target: "String",
            proto: !0,
            forced: !f && !g
        }, {
            endsWith: function(t) {
                var e = r(l(this));
                c(t);
                var a = arguments.length > 1 ? arguments[1] : void 0
                  , s = e.length
                  , i = void 0 === a ? s : p(o(a), s)
                  , n = r(t);
                return h ? h(e, n, i) : m(e, i - n.length, i) === n
            }
        })
    },
    "8a8f": function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("div", [a("GmapMap", {
                ref: "map",
                staticClass: "map",
                attrs: {
                    center: t.center,
                    zoom: 16,
                    options: {
                        streetViewControl: !1,
                        mapTypeControl: !1
                    }
                }
            }, [a("GmapMarker", {
                attrs: {
                    position: t.center,
                    clickable: !0,
                    draggable: !0
                }
            })], 1)], 1)
        }
          , i = []
          , n = (a("a9e3"),
        a("755e"))
          , o = {
            props: ["itemData"],
            name: "WsCssFrontMainMap",
            computed: {
                google: function() {
                    return Object(n["gmapApi"])()
                }
            },
            data: function() {
                return {
                    center: {
                        lat: Number(this.itemData.latitude),
                        lng: Number(this.itemData.longitude)
                    }
                }
            },
            mounted: function() {
                console.log(this.itemData)
            },
            methods: {}
        }
          , r = o
          , c = (a("b1e3"),
        a("2877"))
          , l = Object(c["a"])(r, s, i, !1, null, "27f554ac", null);
        e["default"] = l.exports
    },
    "8b2c": function(t, e, a) {},
    "8b74": function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , s = t._self._c || e;
            return s("div", {
                staticClass: "mian-box",
                class: 0 == t.item.isSend ? "left-box" : "right-box"
            }, [s("div", {
                staticClass: "video-box"
            }, [1 == t.item.isSend ? s("div", {
                staticClass: "msg-content-box"
            }, [s("div", {
                ref: "item_content_list",
                staticClass: "item_content",
                on: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onMyContextmenu(e, t.item)
                    }
                }
            }, [t.item.quotedContent ? s("div", {
                ref: "item_content_list",
                staticClass: "item_content original quoted",
                on: {
                    click: function(e) {
                        return t.toQuoted(t.item)
                    }
                }
            }, [s("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(" " + t._s(t.item.quotedUsername) + "： "), s("div", {
                staticClass: "qoutedContent",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(t._s(t.item.quotedContent))])])]) : t._e(), s("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(t._s(t.item.chatContent))])]), t.item.chatVideo || t.item.chatOriginal ? s("div", {
                ref: "item_content_list",
                staticClass: "item_content original",
                on: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onTranslateContextmenu(e, t.item.chatVideo)
                    }
                }
            }, [s("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(t._s(t.item.chatVideo || t.item.chatOriginal))])]) : t._e()]) : s("div", {
                staticClass: "msg-content-box"
            }, [s("div", {
                staticStyle: {
                    display: "flex",
                    "align-items": "center"
                }
            }, [s("div", {
                ref: "item_content_list",
                staticClass: "item_content",
                on: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onOtherContextmenu(e, t.item)
                    }
                }
            }, [t.item.quotedContent ? s("div", {
                ref: "item_content_list",
                staticClass: "item_content original quoted leftQouted",
                on: {
                    click: function(e) {
                        return t.toQuoted(t.item)
                    }
                }
            }, [s("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(" " + t._s(t.item.quotedUsername) + "： "), s("div", {
                staticClass: "qoutedContent",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(t._s(t.item.quotedContent))])])]) : t._e(), t.checkIsUrl(t.item.chatContent) ? s("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [s("el-link", {
                staticStyle: {
                    width: "100%"
                },
                attrs: {
                    type: "primary",
                    href: t.item.chatContent,
                    target: "_blank"
                },
                nativeOn: {
                    click: function(t) {
                        t.stopPropagation()
                    }
                }
            }, [t._v(t._s(t.item.chatContent))])], 1) : s("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(t._s(t.item.chatContent))])]), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.chatwindow.translate"),
                    placement: "right"
                }
            }, [0 == t.item.isSend && t.chargeId ? s("div", {
                staticClass: "translateIcon"
            }, [t.canTranslateTime ? s("el-image", {
                staticStyle: {
                    width: "15px",
                    height: "15px"
                },
                attrs: {
                    src: a("69b7"),
                    fit: "cover"
                },
                on: {
                    click: function(e) {
                        return t.translateClick(t.item)
                    }
                }
            }) : s("div", {
                staticClass: "translateWart"
            }, [t._v(t._s(t.translateTime))])], 1) : t._e()])], 1), t.isTranslate || t.item.chatVideo || t.item.chatTranslate ? s("div", {
                ref: "item_content_list",
                staticClass: "item_content original",
                on: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onTranslateContextmenu(e, t.item.chatVideo)
                    }
                }
            }, [s("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t.isTranslateEnd ? [t.item.chatVideo ? s("div", [t._v(" " + t._s(t.$t("newchat.chatwindow.original")) + "：" + t._s(t.item.chatVideo) + " ")]) : t._e(), t.item.chatTranslate ? s("div", [t._v(" " + t._s(t.$t("newchat.chatwindow.translate")) + "：" + t._s(t.item.chatTranslate) + " ")]) : t._e()] : s("i", {
                staticClass: "el-icon-loading"
            })], 2)]) : t._e()]), 1 == t.item.isSendType ? s("div", {
                staticClass: "loading-icon loading-type"
            }, [s("i", {
                staticClass: "el-icon-loading"
            })]) : t._e(), -1 == t.item.isSendType ? s("div", {
                staticClass: "loading-icon loading-type"
            }, [s("i", {
                staticClass: "el-icon-warning",
                staticStyle: {
                    color: "#F56C6C"
                }
            })]) : t._e()])])
        }
          , i = []
          , n = a("5530")
          , o = a("6b98")
          , r = a("61f7")
          , c = a("2f62")
          , l = {
            mixins: [o["a"]],
            props: ["item"],
            data: function() {
                return {
                    isTranslate: !1,
                    isTranslateEnd: !0
                }
            },
            mounted: function() {},
            computed: Object(n["a"])(Object(n["a"])({}, Object(c["b"])(["chargeId"])), {}, {
                checkIsUrl: function() {
                    return function(t) {
                        return Object(r["d"])(t)
                    }
                }
            }),
            methods: {}
        }
          , u = l
          , d = (a("c44b"),
        a("2877"))
          , h = Object(d["a"])(u, s, i, !1, null, "11962635", null);
        e["default"] = h.exports
    },
    "8e0d": function(t, e, a) {
        t.exports = a.p + "dist-20260618-092121/static/img/send.png"
    },
    "90dd": function(t, e, a) {
        "use strict";
        a("782a")
    },
    9363: function(t, e, a) {
        "use strict";
        a("38a9")
    },
    "95b3": function(t, e, a) {
        t.exports = a.p + "dist-20260618-092121/static/media/remind.mp3"
    },
    "960a": function(t, e) {
        t.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAADGVJREFUeF7tnV2InFcZx58zSSTgVxRKe9GL2EqKhXTej02bmgpbbaFeKFQQvFCbxN5oUUkKoaJeCIpV6RasRRDaRsULvahILyy06F60TdrM+zG7VGn6YaWCrRc2RQuRdObIJJvuTnaTmefMnHfePe9voVf7PGfe5/c/vzkzndm8RviBAAQuSsDABgIQuDgBBGF3QOASBBCE7QEBBGEPQMCNACeIGze6GkIAQRoSNGO6EUAQN250NYQAgjQkaMZ0I4AgbtzoaggBBGlI0IzpRgBB3LjR1RACCNKQoBnTjQCCuHGjqyEEEKQhQTOmGwEEceNGV0MIIEhDgmZMNwII4saNroYQQJCGBM2YbgQQxI0bXQ0hgCANCZox3QggiBs3uhpCAEEaEjRjuhFAEDdudDWEAII0JGjGdCOAIG7c6GoIAQRpSNCM6UYAQdy40dUQAgjSkKAZ040Agrhxo6shBBCkIUEzphsBBHHjRldDCCBIQ4JmTDcCCOLGja6GEECQhgTNmG4EEMSNG10NIYAgDQmaMd0IIIgbN7oaQgBBGhI0Y7oRQBA3bnQ1hACCNCRoxnQjgCBu3NZ1RVG0U2TbZb3e6ZeWl5ffnNKyLDNjAggyQQBRlOwXY+4UkWtF5ENrlnrVilmWlv1xN8uemuAhaJ0xAQRxDCCKkydEzC2j2o3IQlFkd4+q4/f1JIAgDrlEcfqCiOwat9WK3Nstsm+NW09dfQggiDKLdjx30Ih9SNkmLWPn8jzPtH3Uz5YAgij4x3HcFtM6bq1sV7StlNonyyK/Vd9HxywJIIiCfjuZO2SsXVC0DJX2e7J3aSl71rWfvuoJIIiCeRSnvxORzytahkqNyDeKInvAtZ++6gkgiIJ5FKeviciVipbhUiu/Kcvsi879NFZOAEEUyKM4tYryjUoXyyK7ecI1aK+QAIIoYCOIAlYgpQiiCBJBFLACKUUQRZAIooAVSCmCKIJEEAWsQEoRRBEkgihgBVKKIIogEUQBK5BSBFEEiSAKWIGUIogiSARRwAqkFEEUQSKIAlYgpQiiCBJBFLACKUUQRZAIooAVSCmCKIKssyDz8/NbT516Oxbp7RMxL/b7Z04sLS39SzEepRsQQBDFtqijIO00vUn65ogR+wkR2TE8jjkmtv+LssyPKsakdA0BBFFsh7oJEsfpfVbk8OgR+GvG0Yw2rkAQBbk6CdKO0x8akXsUl3+yLLJrFPWUigiCKLZBXQRJkiTtW9NRXPrZUivmK92i87C2r8n1CKJIvy6CjPtvcl04mjFyWmx/b1EUXcXYjS5FEEX8dRAkiub2ibHu/1qjsUfKPP+JYuxGlyKIIv5aCJLMHRFrf6S47KFSI+axouh81rW/aX0Ioki8FoLEyR9EzCQb/K2yyC7438EKCA0rRRBF4PUQJP2ziMwrLntdaVlk5D4mQECNCWpQhiAKWIGUIogiSARRwAqkFEEUQSKIAlYgpZtWkOvSNGlZe6OImRO78prcyKKI7fSNObaUZfm0M0KQixOdRR7Tznej9TalICvfQfq6iGy7CKQzRuSBad+4BkE2pj2rPBBkAwJRnL4uIpePCeeNssiuGLN2ZBmCrEc0yzxGBjaFgk11gkRRsiDGHFLNbe39ZZmP8Y3X0asiyDCjWecxOrHJKzaNIEmS3Na35o8uI7eM/XSe54+79K7tQZBVGnXIY9I8x+nfNIJEcfK0iPn4OEOtr7HPlEW+z613tQtB1rKYfR6T5jlO/yYSJB3ce9z1KxKnyiJbe5vmcdisq0GQoSeLmefhFKKyaVMIsnvPnqu2vNN/WTnbUHlva+vq5RMnXplkDQQ5R68ueUyS5bi9m0KQKJqbF2MH30Fy/7Hm5rLsLLovwFdNzrOrSx6TZDluL4KMS4rvYr1LCkEUm6aK0roEwkusc2nXJY8q9h4niIIygiCIYrtUV1qXZywEQZDqdr3ikRBkFVYUz/4PpuqSh2ILOZfyEkuBjhOEE0SxXaorrcszFoIgSHW7XvFICMJLLMV2mWopL7EUODlBOEEU26W6Uk4QTpDqdtvwI3GCKMhzgnCCKLZLdaWcIJwg1e02ThBn1pwgnCDOm8dnIycIJ4jP/XWptXkPoiDPCcIJotgu1ZVygnCCVLfbeA/izJoThBPEefP4bOQE4QTxub94DzIgwJ/cvrsPJr39QV2esKqQhjfpCsq8xOIllmK7VFdal2csBEGQ6na94pEQhPcgiu0y1VJeYilwcoJwgii2S3WlnCCcINXtNj4HcWbNCcIJ4rx5fDZygnCC+NxffA7C5yBDe4DPQcbXjTfp47PiNtArrOpyoiuicy5FEAU63oPwHkSxXaorrcszFoIgSHW7XvFICMKbdMV2mWopL7EUODlBOEEU26W6Uk4QTpDqdtum/KAw2ilmy98mgmR7HynL8tVJ1uAE4QSZZP947Y3i9N8i4nojzjfLIvvwpBeIIAgy6R7y1h/F6VMi4nor56fLIrtp0otDEASZdA9564+iZL8Y84jTA1h7oCzzo069a5oQBEEm3UNe+6M4eULE3KJ7EPtkWeS36no2rkaQc1y4DfQ0dpOnNaI4fUFEdo25/MmyyK4Zs3ZkGYKsIori9L8i8t6R0DYueLsssvc59lbatik+B7mQSDueO9gy9kFrZftGtIyR031r7uoWnYenSRNBVmm247RjRFIXvlYk6xbZnEtv1T2bUpABpDiO232z5ZPG2htFZPDf4OeYNeZYy/b+VBRFd9owEWTNCZLMfVus/b4TY2O+U+adHzj1Vty0aQWpmNPZh0OQYepRnP5FRD6mzOKvZZFdq+yZWTmCKNAjyDCs3bv3XLVla/9lBULpvdO6enn5xCuanlnWIoiCPoKshzU/P7/91Fv/WRCRr45A+fMdH3z/4cXFxdMK5DMvRRBFBAhycVhxPPclK/YzK+8Hr1yp/MfgfaER81hRdH6tQF2bUgRRRFELQaL0UTFyu+KyLyydytduLvX4SZJ8dPD7PM9fmuA6a9GKIIoYaiLI18TIg4rLHio1Yn5bFJ0vuPY3rQ9BFInXQ5A9e8T0n1Nc9gWCyDeLIvupa3/T+hBEkXgdBBlcbhSlx8XIDYpLP196pt+SvUtZljv0NrIFQRSx10WQdju53bTMo4pLP1tqRBaKIrtb29fkegRRpF8XQc6eInH6SxH5suLy3yiL7ApFPaXnnlT4GZdAnQQZXHM7SQ4Ya0Z/38za+8syPzzunNStEkAQxW6omyBnJWlfv8uY3r1i5FMi8oG141iR41uM/V6e548rxqR0DQEEUWyHOgpy/vLTNN3W65nrrbE3tMT8vdWyz2RZ9k/FeJRuQABBFNuizoIoxqBUQQBBFLAQRAErkFIEUQSJIApYgZQiiCJIBFHACqQUQRRBIogCViClCKIIEkEUsAIpRRBFkAiigBVIKYIogkQQBaxAShFEESSCKGAFUoogiiARRAErkFIEUQSJIApYgZQiiCJIBFHACqQUQRRBRnE6uInPTkXLcKmRo2WeHXDup7FyAgiiQB4l6SNiZb+iZajUiLmzKDoPufbTVz0BBFEwj5LkLrHmZ4qWoVLbN0m32ylc++mrngCCKJhfl6ZJqy/HRWSbou1cqZVnyzLbq+6jYaYEEESJP47T+6yI+s9Xbd9+rtvNf698OMpnTABBHAKI4vR1Eblc0fqrssjuUNRTWhMCCOIYRBQlC2LMoVHt1tiD3Tx3u7fiqMX5vXcCCDIB4iRJbutb+a6IGdzvYsf5pazIa8ZKx9ot93S7z52c4CFonTEBBJlSAIMbW5r/9S/r9d7z4vPPHxvc052fAAggSAAhMoI/Agjijy0rB0AAQQIIkRH8EUAQf2xZOQACCBJAiIzgjwCC+GPLygEQQJAAQmQEfwQQxB9bVg6AAIIEECIj+COAIP7YsnIABBAkgBAZwR8BBPHHlpUDIIAgAYTICP4IIIg/tqwcAAEECSBERvBHAEH8sWXlAAggSAAhMoI/Agjijy0rB0AAQQIIkRH8EUAQf2xZOQACCBJAiIzgjwCC+GPLygEQQJAAQmQEfwQQxB9bVg6AAIIEECIj+COAIP7YsnIABBAkgBAZwR8BBPHHlpUDIIAgAYTICP4IIIg/tqwcAAEECSBERvBHAEH8sWXlAAggSAAhMoI/Agjijy0rB0AAQQIIkRH8EUAQf2xZOQACCBJAiIzgjwCC+GPLygEQQJAAQmQEfwQQxB9bVg6AAIIEECIj+CPwf2M5yCNyBTVuAAAAAElFTkSuQmCC"
    },
    "96bf": function(t, e, a) {
        "use strict";
        a("d20b")
    },
    "9e24": function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , s = t._self._c || e;
            return s("div", {
                staticClass: "main_box"
            }, [s("div", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.chatLoading,
                    expression: "chatLoading"
                }],
                staticClass: "box-card",
                attrs: {
                    "element-loading-text": t.$t("newchat.chatwindow.querRecords")
                },
                on: {
                    paste: t.paste
                }
            }, [t.accountUsername.username ? [s("div", {
                staticClass: "chat-header notranslate"
            }, [s("div", {
                staticClass: "left-user notranslate"
            }, [s("div", {
                staticClass: "header-name"
            }, [t._v(t._s(t.myUserName.login))])]), s("div", {
                staticClass: "info"
            }, [t._v(t._s(t.$t("newchat.chatwindow.chattingWith")))]), s("span", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: 1 == t.accountUsername.isRepeat && 1 == t.$store.getters.isRepeatScope,
                    expression: "accountUsername.isRepeat == 1 && $store.getters.isRepeatScope == 1"
                }],
                staticClass: "repeat-text"
            }, [t._v("重")]), s("div", {
                staticClass: "right-user",
                on: {
                    click: t.openEditDia
                }
            }, [s("div", [s("div", {
                staticClass: "header-name"
            }, [t.accountUsername.remarkName ? s("span", [t._v(t._s(t.accountUsername.remarkName) + "(" + t._s(t.accountUsername.username) + ")")]) : s("span", [t._v(t._s(t.accountUsername.username))])]), s("div", {
                staticClass: "header-name-info"
            }, [t._v(t._s(t.accountUsername.remark))])]), s("i", {
                staticClass: "el-icon-edit-outline"
            }), t.addTypeStr ? s("el-tag", {
                staticClass: "add-type-str",
                attrs: {
                    type: "info",
                    size: "mini"
                }
            }, [t._v(t._s(t.addTypeStr))]) : t._e()], 1), s("div", {
                staticClass: "info"
            }, [t._v(t._s(t.$t("newchat.chatwindow.chat")))]), t.accountUsername.isChatAi ? s("div", {
                staticClass: "AI-info",
                on: {
                    click: t.closeAI
                }
            }, [s("svg-icon", {
                staticStyle: {
                    color: "#67C23A"
                },
                attrs: {
                    "icon-class": "AI",
                    size: "15",
                    "class-name": "custom-class"
                }
            }), s("span", [t._v(t._s(t.$t("newchat.chatwindow.isAI")))])], 1) : t._e(), t.accountUsernameData && 1 == t.accountUsernameData.isBlock ? s("div", {
                staticStyle: {
                    color: "#F56C6C",
                    "font-size": "12px",
                    "margin-right": "10px"
                }
            }, [t._v(" [" + t._s(t.$t("newchat.chatwindow.black")) + "] ")]) : t._e(), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.chatwindow.exportChatLog"),
                    placement: "top"
                }
            }, [s("el-button", {
                attrs: {
                    type: "warning",
                    icon: "el-icon-download",
                    circle: "",
                    size: "mini",
                    loading: t.exportChatHistoryLoading
                },
                on: {
                    click: function(e) {
                        return t.exportChatHistory("session")
                    }
                }
            })], 1), s("el-tooltip", {
                attrs: {
                    content: t.$t("newchat.chatwindow.deleteSession"),
                    placement: "top"
                }
            }, [s("div", {
                staticStyle: {
                    "margin-left": "20px",
                    color: "#F56C6C",
                    cursor: "pointer"
                },
                on: {
                    click: t.delChat
                }
            }, [s("i", {
                staticClass: "el-icon-delete"
            })])])], 1)] : t.accountUsername.groupId ? [s("div", {
                staticClass: "chat-header notranslate"
            }, [s("div", {
                staticClass: "right-user group-right-user"
            }, [s("div", {
                staticClass: "group-header-info-box"
            }, [s("el-avatar", {
                staticClass: "item_header",
                attrs: {
                    src: t.accountUsername.avatarUrl
                },
                nativeOn: {
                    mousedown: function(t) {
                        t.preventDefault()
                    }
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.group")))]), s("div", {
                staticClass: "group-header-info"
            }, [s("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.accountUsername.subject,
                    expression: "accountUsername.subject"
                }],
                staticClass: "group-name"
            }, [t._v(t._s(t.accountUsername.subject) + "（" + t._s(t.accountUsername.groupCode) + "）")]), s("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: !t.accountUsername.subject,
                    expression: "!accountUsername.subject"
                }],
                staticClass: "group-name"
            }, [t._v(t._s(t.accountUsername.groupCode))]), s("div", {
                staticStyle: {
                    display: "flex",
                    "align-items": "center",
                    "margin-top": "5px",
                    gap: "10px"
                }
            }, [1 == t.accountUsernameData.status ? s("el-tag", {
                attrs: {
                    size: "mini",
                    type: "danger"
                }
            }, [t._v(t._s(t.$t("newchat.userList.blocked")))]) : t._e(), 1 == t.accountUsernameData.announcement ? s("el-tag", {
                attrs: {
                    size: "mini",
                    effect: "dark",
                    type: "warning"
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.announcementGroup")))]) : t._e(), 1 == t.accountUsernameData.isEphemeral ? s("el-tag", {
                attrs: {
                    size: "mini",
                    type: "warning"
                }
            }, [s("i", {
                staticClass: "el-icon-timer"
            }), t._v(" 限时消息")]) : t._e(), s("el-tag", {
                attrs: {
                    size: "mini",
                    effect: "dark",
                    type: ""
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.groupChat")))]), s("div", {
                staticClass: "header-name-info"
            }, [t._v(t._s(t.$t("newchat.chatwindow.groupMemberCount")) + "：" + t._s(t.accountUsername.memberCount))])], 1)])], 1), s("el-dropdown", {
                attrs: {
                    trigger: "click"
                },
                on: {
                    command: t.groupCommand
                }
            }, [s("span", {
                staticClass: "el-dropdown-link",
                staticStyle: {
                    cursor: "pointer"
                }
            }, [s("i", {
                staticClass: "el-icon-more"
            })]), s("el-dropdown-menu", {
                attrs: {
                    slot: "dropdown"
                },
                slot: "dropdown"
            }, [s("el-dropdown-item", {
                attrs: {
                    command: "groupDetails"
                }
            }, [t._v("群组详情")]), s("el-dropdown-item", {
                attrs: {
                    command: "exportGroupChatLog"
                }
            }, [t._v("导出聊天记录")]), s("el-dropdown-item", {
                attrs: {
                    command: "deleteMessage"
                }
            }, [t._v("删除群消息")])], 1)], 1)], 1)])] : s("div", {
                staticClass: "chat-header notranslate"
            }, [s("div", {
                staticClass: "info"
            }, [t._v(t._s(t.$t("newchat.chatwindow.noSelectedChat")))])]), s("div", {
                staticClass: "content-box"
            }, [s("el-upload", {
                ref: "dragfile",
                staticClass: "upload-demo",
                attrs: {
                    drag: "",
                    "on-change": t.handleChange,
                    action: t.fileAction,
                    "show-file-list": !1,
                    "auto-upload": !1,
                    limit: 1
                },
                nativeOn: {
                    click: function(e) {
                        return e.preventDefault(),
                        t.clickUpload(e)
                    }
                }
            }, [s("div", {
                staticClass: "char-log"
            }, [s("div", {
                ref: "log_inbox",
                staticClass: "log-inbox",
                on: {
                    scroll: t.logScroll
                }
            }, [s("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.isTop,
                    expression: "isTop"
                }],
                staticClass: "loading-box"
            }, [s("i", {
                staticClass: "el-icon-loading"
            })]), s("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.userLogList.length >= t.total,
                    expression: "userLogList.length >= total"
                }],
                staticClass: "noloadingLog"
            }, [t._v(t._s(t.$t("newchat.chatwindow.noMoreRecords")))]), s("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.botButShow,
                    expression: "botButShow"
                }],
                staticClass: "logTotalBox notranslate"
            }, [t._v(t._s(t.userLogList.length) + "/" + t._s(t.total))]), s("div", {
                ref: "que"
            }), t._l(t.userLogList, (function(e, i) {
                return s("div", {
                    key: e.id,
                    class: {
                        "log-right": 1 == e.isSend,
                        "log-left": 0 == e.isSend,
                        "log-item-checked": t.isDeleteMessage
                    },
                    on: {
                        click: function(a) {
                            return t.itemClick(e)
                        }
                    }
                }, [t.isDeleteMessage ? s("el-checkbox", {
                    staticStyle: {
                        padding: "0 10px"
                    },
                    attrs: {
                        disabled: t.canDelete(e)
                    },
                    model: {
                        value: e.isChecked,
                        callback: function(a) {
                            t.$set(e, "isChecked", a)
                        },
                        expression: "item.isChecked"
                    }
                }) : t._e(), s("div", {
                    ref: e.messageId,
                    refInFor: !0,
                    staticClass: "log-item"
                }, [s("div", {
                    staticClass: "log-item-time"
                }, [s("div", {
                    staticClass: "log-username notranslate",
                    class: {
                        "brand-text": 1 == e.isChargeWs
                    }
                }, [t._v(t._s(t.logName(e)))]), s("div", {
                    staticClass: "log-time notranslate"
                }, [t._v(t._s(t.senderTimestamp(e)))]), [-2 == e.msgStatus ? s("span", {
                    staticClass: "log-time",
                    staticStyle: {
                        color: "#F56C6C"
                    }
                }, [t._v("[" + t._s(t.$t("newchat.chatwindow.withdraw2")) + "]")]) : t._e(), -4 == e.msgStatus ? s("span", {
                    staticClass: "log-time",
                    staticStyle: {
                        color: "#F56C6C"
                    }
                }, [t._v("[" + t._s(t.$t("newchat.chatwindow.deleted")) + "]")]) : t._e(), e.soucreUsername ? s("span", {
                    staticClass: "log-time"
                }, [t._v(t._s("[" + t.$t("newchat.chatwindow.fromMessage", [String(e.soucreUsername).slice(0, -4)]) + "]"))]) : t._e(), 1 == e.msgType ? s("span", {
                    staticClass: "log-time"
                }, [t._v(t._s("[" + t.$t("newchat.chatwindow.massMessage") + "]"))]) : t._e(), e.notify && 1 == e.isSend ? s("span", {
                    staticClass: "log-time"
                }, [t._v(t._s("[" + t.$t("newchat.chatwindow.blackTechnologyNews") + "]"))]) : t._e(), 1 == e.isCharge ? s("span", {
                    staticClass: "log-time"
                }, [t._v(t._s("[" + t.$t("newchat.chatwindow.masterSend") + "]"))]) : t._e(), e.channel ? s("span", {
                    staticClass: "log-time"
                }, [t._v(t._s("[" + t.$t("newchat.chatwindow.channel") + e.channel + "]"))]) : t._e(), e.isAi ? s("svg-icon", {
                    staticClass: "log-time",
                    staticStyle: {
                        color: "#409EFF"
                    },
                    attrs: {
                        "icon-class": "AI",
                        "class-name": "custom-class",
                        size: "16"
                    }
                }) : t._e()], 1 == e.isSend ? [e.error ? s("div", {
                    staticClass: "error-box"
                }, ["888" != e.error || e.retryCount ? [s("i", {
                    staticClass: "el-icon-warning",
                    staticStyle: {
                        color: "#F56C6C"
                    }
                }), s("span", {
                    staticClass: "error-text"
                }, [t._v(t._s(t.messageError(e.error)))])] : [s("span", {
                    staticClass: "warning-text"
                }, [t._v("网络波动，正在努力重发…")]), s("div", {
                    staticStyle: {
                        color: "#a8a8a8",
                        height: "16px",
                        display: "flex",
                        "justify-content": "center",
                        "align-items": "center"
                    }
                }, [s("svg-icon", {
                    attrs: {
                        "icon-class": "sending",
                        "class-name": "custom-class",
                        size: "16"
                    }
                })], 1)]], 2) : -1 == e.msgStatus ? s("i", {
                    staticClass: "el-icon-time",
                    staticStyle: {
                        "margin-right": "7px",
                        color: "#a8a8a8"
                    },
                    attrs: {
                        size: "mini"
                    }
                }) : -3 == e.msgStatus ? s("div", {
                    staticStyle: {
                        color: "#a8a8a8",
                        height: "16px",
                        display: "flex",
                        "justify-content": "center",
                        "align-items": "center"
                    }
                }, [s("svg-icon", {
                    attrs: {
                        "icon-class": "sending",
                        "class-name": "custom-class",
                        size: "16"
                    }
                })], 1) : s("span", {
                    staticClass: "status-row"
                }, [t.accountUsername.groupId && e.messageId && 1 == t.$store.getters.isGroupReadStatus ? s("el-button", {
                    staticClass: "read-status-btn",
                    attrs: {
                        type: "text",
                        size: "mini"
                    },
                    on: {
                        click: function(a) {
                            return a.stopPropagation(),
                            t.openReadStatusDialog(e)
                        }
                    }
                }, [t._v(t._s(t.$t("newchat.chatwindow.readStatusView")))]) : t._e(), 0 == e.msgStatus ? s("el-image", {
                    staticStyle: {
                        width: "10px",
                        height: "7px"
                    },
                    attrs: {
                        draggable: "false",
                        src: a("8149"),
                        lazy: "",
                        fit: "cover"
                    }
                }) : t._e(), 1 == e.msgStatus ? s("el-image", {
                    staticStyle: {
                        width: "14px",
                        height: "7px"
                    },
                    attrs: {
                        draggable: "false",
                        lazy: "",
                        src: a("8e0d"),
                        fit: "cover"
                    }
                }) : t._e(), 2 == e.msgStatus ? s("el-image", {
                    staticStyle: {
                        width: "14px",
                        height: "7px"
                    },
                    attrs: {
                        draggable: "false",
                        lazy: "",
                        src: a("e8c9"),
                        fit: "cover"
                    }
                }) : t._e()], 1)] : t._e(), e.messageId ? s("el-tooltip", {
                    attrs: {
                        content: t.$t("newchat.chatwindow.copyMessageId"),
                        placement: "top"
                    }
                }, [s("i", {
                    staticClass: "el-icon-document-copy",
                    staticStyle: {
                        color: "#909399",
                        cursor: "pointer",
                        "font-size": "14px"
                    },
                    on: {
                        click: function(a) {
                            return a.stopPropagation(),
                            t.copyMessageId(e)
                        }
                    }
                })]) : t._e()], 2), s("div", {
                    staticClass: "log-item-top"
                }, [0 == e.isSend ? [e.groupId ? s("el-image", {
                    staticClass: "item_header_img",
                    attrs: {
                        src: e.avatarUrl ? e.avatarUrl : a("4d41"),
                        "preview-src-list": [e.avatarUrl ? e.avatarUrl : a("4d41")]
                    },
                    nativeOn: {
                        mousedown: function(t) {
                            t.preventDefault()
                        }
                    }
                }) : s("el-image", {
                    staticClass: "item_header_img",
                    attrs: {
                        src: t.accountUsername.avatarUrl ? t.accountUsername.avatarUrl : a("4d41"),
                        "preview-src-list": [t.accountUsername.avatarUrl ? t.accountUsername.avatarUrl : a("4d41")]
                    },
                    nativeOn: {
                        mousedown: function(t) {
                            t.preventDefault()
                        }
                    }
                })] : t._e(), 1 == e.isSend ? [s("el-avatar", {
                    staticClass: "item_header",
                    attrs: {
                        src: t.myUserName.avatarUrl ? t.myUserName.avatarUrl : a("4d41")
                    },
                    nativeOn: {
                        mousedown: function(t) {
                            t.preventDefault()
                        }
                    }
                })] : t._e(), s("div", {
                    staticClass: "log-item-content"
                }, [1 == e.chatType || 7 == e.chatType ? s("div", [s("Content", {
                    ref: "messageBox",
                    refInFor: !0,
                    attrs: {
                        item: e
                    },
                    on: {
                        recallMessage: function(a) {
                            return t.recallMessage(e, i)
                        },
                        getFanyiCount: t.getFanyiCount,
                        scrollIntoViewFun: t.scrollIntoViewFun
                    }
                })], 1) : 2 == e.chatType ? s("div", [4 == e.sType ? s("Audio", {
                    ref: "messageBox",
                    refInFor: !0,
                    attrs: {
                        itemData: e
                    },
                    on: {
                        recallMessage: function(a) {
                            return t.recallMessage(e, i)
                        },
                        updateMessage: t.updateMessage
                    }
                }) : 3 == e.sType ? s("Video", {
                    ref: "messageBox",
                    refInFor: !0,
                    attrs: {
                        item: e
                    },
                    on: {
                        recallMessage: function(a) {
                            return t.recallMessage(e, i)
                        },
                        updateMessage: t.updateMessage,
                        getFanyiCount: t.getFanyiCount
                    }
                }) : 1 == e.sType ? s("LogImage", {
                    ref: "messageBox",
                    refInFor: !0,
                    attrs: {
                        itemData: e
                    },
                    on: {
                        recallMessage: function(a) {
                            return t.recallMessage(e, i)
                        },
                        updateMessage: t.updateMessage,
                        getFanyiCount: t.getFanyiCount
                    }
                }) : 5 == e.sType || 8 == e.sType ? s("Expression", {
                    ref: "messageBox",
                    refInFor: !0,
                    attrs: {
                        itemData: e
                    },
                    on: {
                        recallMessage: function(a) {
                            return t.recallMessage(e, i)
                        },
                        updateMessage: t.updateMessage
                    }
                }) : 7 == e.sType ? s("BusinessCard", {
                    ref: "messageBox",
                    refInFor: !0,
                    attrs: {
                        itemData: e
                    },
                    on: {
                        recallMessage: function(a) {
                            return t.recallMessage(e, i)
                        }
                    }
                }) : t._e(), 9 == e.sType ? [e.isSend && !e.chatExtensionContent ? s("ImageLink", {
                    ref: "messageBox",
                    refInFor: !0,
                    staticClass: "messageBox",
                    attrs: {
                        itemData: e
                    },
                    on: {
                        recallMessage: function(a) {
                            return t.recallMessage(e, i)
                        }
                    }
                }) : s("LogLink", {
                    ref: "messageBox",
                    refInFor: !0,
                    attrs: {
                        itemData: e
                    },
                    on: {
                        recallMessage: function(a) {
                            return t.recallMessage(e, i)
                        },
                        getFanyiCount: t.getFanyiCount
                    }
                })] : 2 == e.sType ? s("LogFile", {
                    ref: "messageBox",
                    refInFor: !0,
                    attrs: {
                        itemData: e
                    },
                    on: {
                        updateMessage: t.updateMessage,
                        recallMessage: function(a) {
                            return t.recallMessage(e, i)
                        }
                    }
                }) : 10 == e.sType ? s("Map", {
                    ref: "messageBox",
                    refInFor: !0,
                    attrs: {
                        itemData: e
                    }
                }) : 11 == e.sType ? s("SuperLink", {
                    ref: "messageBox",
                    refInFor: !0,
                    attrs: {
                        itemData: e
                    },
                    on: {
                        recallMessage: function(a) {
                            return t.recallMessage(e, i)
                        }
                    }
                }) : 12 == e.sType ? s("ImageLink", {
                    ref: "messageBox",
                    refInFor: !0,
                    staticClass: "messageBox",
                    attrs: {
                        itemData: e
                    },
                    on: {
                        recallMessage: function(a) {
                            return t.recallMessage(e, i)
                        }
                    }
                }) : 13 == e.sType ? s("TextImageTemplate", {
                    ref: "messageBox",
                    refInFor: !0,
                    attrs: {
                        itemData: e
                    },
                    on: {
                        recallMessage: function(a) {
                            return t.recallMessage(e, i)
                        }
                    }
                }) : t._e()], 2) : 3 == e.chatType || 8 == e.chatType ? s("div", {
                    staticClass: "phoneBox"
                }, [s("el-tag", [s("i", {
                    staticClass: "el-icon-phone-outline",
                    staticStyle: {
                        margin: "0 5px",
                        "font-size": "12px"
                    }
                }), t._v(" 【 " + t._s(t.$t("newchat.chatwindow.calls")) + " 】 ")]), e.audioId ? s("audio", {
                    staticStyle: {
                        height: "38px"
                    },
                    attrs: {
                        src: e.audioUrl,
                        controls: ""
                    }
                }) : t._e()], 1) : 4 == e.chatType ? s("div", {
                    staticClass: "phoneBox"
                }, [s("el-tag", {
                    attrs: {
                        type: "warning"
                    }
                }, [s("i", {
                    staticClass: "el-icon-video-camera",
                    staticStyle: {
                        margin: "0 5px",
                        "font-size": "12px"
                    }
                }), t._v(" 【 " + t._s(t.$t("newchat.chatwindow.videoCall")) + " 】 ")])], 1) : 6 == e.chatType ? s("div", {
                    staticClass: "phoneBox"
                }, [s("el-tag", {
                    attrs: {
                        type: "danger"
                    }
                }, [s("i", {
                    staticClass: "el-icon-phone",
                    staticStyle: {
                        margin: "0 5px",
                        "font-size": "12px"
                    }
                }), t._v(" 【 " + t._s(t.$t("newchat.chatwindow.missedCalls")) + " 】 ")])], 1) : t._e(), s("div", {
                    staticClass: "reaction-box"
                }, [s("el-popover", {
                    key: e.messageId + (e.reactionMessageList ? "_reaction" : ""),
                    attrs: {
                        placement: "right",
                        width: "200",
                        trigger: "hover",
                        "open-delay": 300
                    }
                }, [s("div", t._l(e.reactionMessageList, (function(e) {
                    return s("div", {
                        key: e.messageId
                    }, [s("span", [t._v(t._s(e.sendWsLoginNumber) + "：")]), s("span", [t._v(t._s(e.content))])])
                }
                )), 0), s("div", {
                    attrs: {
                        slot: "reference"
                    },
                    slot: "reference"
                }, [e.reactionMessageList && e.reactionMessageList.length > 0 ? s("div", {
                    staticClass: "reactionMessage",
                    class: 1 == e.isSend ? "right" : "left"
                }, t._l(e.reactionMessageList, (function(e, a) {
                    return s("span", {
                        key: a
                    }, [t._v(" " + t._s(e.content) + " ")])
                }
                )), 0) : t._e()])]), e.messageId ? s("div", {
                    staticClass: "likeBox"
                }, [s("el-popover", {
                    attrs: {
                        placement: "bottom",
                        width: "390",
                        trigger: "hover"
                    }
                }, [s("div", {
                    staticClass: "emoji-list-box"
                }, t._l(t.emojiList, (function(a) {
                    return s("div", {
                        key: a,
                        staticClass: "emoji-list-item",
                        on: {
                            click: function(s) {
                                return t.likeMessage(a, e)
                            }
                        }
                    }, [t._v(t._s(a))])
                }
                )), 0), s("template", {
                    slot: "reference"
                }, [s("i", {
                    staticClass: "el-icon-circle-plus-outline"
                })])], 2)], 1) : t._e()], 1)])], 2)])], 1)
            }
            )), t.accountUsernameData && 1 == t.accountUsernameData.isBlock ? s("div", {
                staticClass: "blockBox"
            }, [s("el-tag", {
                attrs: {
                    type: "danger"
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.blackInfo")))])], 1) : t._e(), 2 == t.$store.state.newChat.chatUserNameData.status ? s("div", {
                staticClass: "blockBox"
            }, [s("el-tag", {
                attrs: {
                    type: "danger"
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.sealedAccountInfo")))])], 1) : t._e(), t.accountUsernameData && 1 == t.accountUsernameData.moveStatus && !t.accountUsernameData.groupId ? s("div", {
                staticClass: "blockBox"
            }, [s("el-tag", {
                attrs: {
                    type: "warning"
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.fanInheritanceRisk")))])], 1) : t._e()], 2), s("el-button", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.botButShow,
                    expression: "botButShow"
                }],
                staticClass: "botBut",
                attrs: {
                    type: "primary",
                    icon: "el-icon-caret-bottom",
                    size: "small",
                    circle: ""
                },
                on: {
                    click: t.scrollToBottom
                }
            })], 1)]), t.isDeleteMessage ? s("div", {
                staticClass: "delete-box"
            }, [s("div", {
                staticClass: "delete-box-left"
            }, [s("i", {
                staticClass: "el-icon-close delete-box-left-icon",
                on: {
                    click: t.closeDeleteMessage
                }
            }), s("span", {
                staticClass: "delete-box-left-text"
            }, [t._v(t._s(t.$t("newchat.chatwindow.deleteMessageCount", [t.deleteMessageCount])))])]), s("div", {
                staticClass: "delete-box-right"
            }, [s("i", {
                staticClass: "el-icon-delete delete-box-right-icon",
                class: {
                    "disabled-icon": 0 == t.deleteMessageCount
                },
                on: {
                    click: t.deleteMessage
                }
            })])]) : t._e(), s("div", {
                staticClass: "resizeBox",
                on: {
                    mousedown: t.handleMouseDown
                }
            }, [s("i", {
                staticClass: "el-icon-d-caret resizeIcon"
            })]), s("div", {
                ref: "sendBox",
                staticClass: "send-box"
            }, [s("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: "{}" !== JSON.stringify(t.quoteData),
                    expression: "JSON.stringify(quoteData) !== '{}'"
                }],
                staticClass: "quote"
            }, [s("div", {
                staticClass: "item_content"
            }, [1 == t.quoteData.isSend ? [s("div", {
                staticClass: "item_name"
            }, [t._v(t._s(t.myUserName.login) + "：")])] : [s("div", {
                staticClass: "item_name"
            }, [t._v(t._s(t.quoteData.notify ? t.quoteData.notify + "(" + t.quoteData.username + ")" : t.quoteData.username) + "：")])], s("div", {
                staticClass: "content-box",
                on: {
                    click: function(e) {
                        return t.scrollIntoViewFun(t.quoteData.messageId)
                    }
                }
            }, [t._v(t._s(t.quoteType(t.quoteData)))]), s("div", {
                staticClass: "item_time"
            }, [t._v(t._s(t.quoteData.sendTime))])], 2), s("div", {
                staticClass: "quote-close"
            }, [s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.chatwindow.cancelQuoteReply"),
                    placement: "top"
                }
            }, [s("i", {
                staticClass: "el-icon-circle-close",
                on: {
                    click: t.closeQuote
                }
            })])], 1)]), s("div", {
                staticClass: "tool-box"
            }, [s("div", {
                staticClass: "tool-box-in"
            }, [s("Emoji", {
                staticClass: "item",
                on: {
                    writeIn: t.writeIn
                }
            }), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.chatwindow.sendPicture"),
                    placement: "top-start"
                }
            }, [s("el-upload", {
                ref: "imgfile",
                staticClass: "icon-box",
                attrs: {
                    action: t.fileAction,
                    "on-change": t.fileChange,
                    "show-file-list": !1,
                    "auto-upload": !1,
                    accept: "image/jpg,image/jpeg,image/png"
                }
            }, [s("i", {
                staticClass: "el-icon-picture-outline icon",
                attrs: {
                    size: "20"
                }
            })])], 1), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.chatwindow.sendVideo"),
                    placement: "top-start"
                }
            }, [s("el-upload", {
                ref: "videofile",
                staticClass: "icon-box",
                attrs: {
                    action: t.fileAction,
                    accept: "video/mp4",
                    "on-change": t.fileChange,
                    "auto-upload": !1,
                    "show-file-list": !1
                }
            }, [s("i", {
                staticClass: "el-icon-video-camera icon"
            })])], 1), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.chatwindow.sendFile"),
                    placement: "top-start"
                }
            }, [s("el-upload", {
                ref: "filefile",
                staticClass: "icon-box",
                attrs: {
                    action: t.fileAction,
                    "on-change": t.fileChange,
                    "auto-upload": !1,
                    "show-file-list": !1
                }
            }, [s("i", {
                staticClass: "el-icon-folder icon"
            })])], 1), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    content: t.$t("newchat.chatwindow.sendBusinessCard"),
                    effect: "dark",
                    placement: "top-start"
                }
            }, [s("div", {
                staticClass: "icon-box",
                on: {
                    click: t.openContact
                }
            }, [s("i", {
                staticClass: "el-icon-postcard icon",
                attrs: {
                    size: "20"
                }
            })])]), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    content: t.$t("newchat.chatwindow.sendAudio"),
                    effect: "dark",
                    placement: "top-start"
                }
            }, [s("el-upload", {
                ref: "audiofile",
                staticClass: "icon-box",
                attrs: {
                    action: t.fileAction,
                    accept: ".mp3,.ogg,.wav",
                    "on-change": t.fileAudioChange,
                    "auto-upload": !1,
                    "show-file-list": !1
                }
            }, [s("i", {
                staticClass: "el-icon-microphone icon"
            })])], 1), this.accountUsername.username ? s("div", [s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.chatwindow.voiceCall"),
                    placement: "top-start"
                }
            }, [s("div", {
                staticClass: "icon-box",
                on: {
                    click: t.openCall
                }
            }, [s("i", {
                staticClass: "el-icon-phone-outline icon",
                attrs: {
                    size: "20"
                }
            })])])], 1) : t._e(), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.chatwindow.materialLibrary"),
                    placement: "top-start"
                }
            }, [s("div", {
                staticClass: "icon-box",
                on: {
                    click: t.openMT
                }
            }, [s("i", {
                staticClass: "el-icon-paperclip icon",
                attrs: {
                    size: "20"
                }
            })])]), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.chatwindow.translate"),
                    placement: "top-start"
                }
            }, [s("div", {
                staticClass: "icon-box",
                on: {
                    click: function(e) {
                        t.translateDialogVisible = !0
                    }
                }
            }, [s("el-image", {
                staticStyle: {
                    width: "20px",
                    height: "20px"
                },
                attrs: {
                    draggable: "false",
                    src: a("69b7"),
                    fit: "cover"
                }
            })], 1)]), t.sendAutoTranslate ? s("el-tag", {
                staticStyle: {
                    "margin-left": "10px",
                    cursor: "pointer"
                },
                attrs: {
                    size: "mini"
                },
                on: {
                    click: t.closeAutoTranslate
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.offAutomaticTranslation")))]) : s("el-tag", {
                staticStyle: {
                    "margin-left": "10px",
                    cursor: "pointer"
                },
                attrs: {
                    type: "info",
                    size: "mini"
                },
                on: {
                    click: t.openAutoTranslate
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.EnableAutoTranslation")))]), this.accountUsername.username ? s("div", [t.isAutoReceive ? s("el-tag", {
                staticStyle: {
                    "margin-left": "10px",
                    cursor: "pointer"
                },
                attrs: {
                    type: "success",
                    size: "mini"
                },
                on: {
                    click: function(e) {
                        return t.setAutoReceive(0)
                    }
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.offAutoTranslationReceive")))]) : s("el-tag", {
                staticStyle: {
                    "margin-left": "10px",
                    cursor: "pointer"
                },
                attrs: {
                    type: "info",
                    size: "mini"
                },
                on: {
                    click: function(e) {
                        return t.setAutoReceive(1)
                    }
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.EnableAutoTranslationReceive")))])], 1) : t._e(), t.accountUsernameData && 2 == t.accountUsernameData.isReplyApi ? [s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.chatwindow.globalRobotHosting"),
                    placement: "top-start"
                }
            }, [s("div", {
                staticClass: "icon-box",
                staticStyle: {
                    color: "#409EFF"
                }
            }, [s("svg-icon", {
                staticStyle: {
                    margin: "0 10px"
                },
                attrs: {
                    "icon-class": "robot"
                }
            })], 1)])] : [s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.chatwindow.robotHosting"),
                    placement: "top-start"
                }
            }, [s("div", {
                staticClass: "icon-box",
                class: {
                    "robot-active": t.accountUsernameData && 1 == t.accountUsernameData.isReplyApi
                },
                staticStyle: {
                    cursor: "pointer",
                    color: "#606366"
                },
                on: {
                    click: t.setRobotHosting
                }
            }, [s("svg-icon", {
                staticStyle: {
                    margin: "0 10px"
                },
                attrs: {
                    "icon-class": "robot"
                }
            })], 1)])]], 2), s("div", {
                staticClass: "link-box"
            }, [s("i", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: 1 == t.webSocketType,
                    expression: "webSocketType==1"
                }],
                staticClass: "el-icon-link success"
            }), s("i", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: 0 == t.webSocketType,
                    expression: "webSocketType==0"
                }],
                staticClass: "el-icon-link error"
            }), s("i", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: 2 == t.webSocketType,
                    expression: "webSocketType==2"
                }],
                staticClass: "el-icon-link error"
            }), s("i", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: 3 == t.webSocketType,
                    expression: "webSocketType==3"
                }],
                staticClass: "el-icon-link error"
            }), s("i", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: 4 == t.webSocketType,
                    expression: "webSocketType==4"
                }],
                staticClass: "el-icon-link error"
            })])]), s("el-upload", {
                ref: "dragfile2",
                staticClass: "upload-demo",
                attrs: {
                    drag: "",
                    "on-change": t.handleChange,
                    action: t.fileAction,
                    "auto-upload": !1,
                    "show-file-list": !1,
                    limit: 1
                },
                nativeOn: {
                    click: function(e) {
                        return e.preventDefault(),
                        t.clickUpload(e)
                    }
                }
            }, [s("div", {
                ref: "contentBoxRef",
                staticClass: "content-box"
            }, [s("div", {
                ref: "textareaInput",
                staticClass: "contenteditable-input notranslate",
                class: {
                    "is-empty": t.contenteditableEmpty
                },
                attrs: {
                    translate: "no",
                    contenteditable: "true",
                    "data-placeholder": t.$t("newchat.chatwindow.enterContent")
                },
                on: {
                    input: t.onTextareaInput,
                    keydown: function(e) {
                        return t.onTextareaKeydown(e)
                    },
                    paste: function(e) {
                        return t.onTextareaPaste(e)
                    }
                }
            }), s("GroupMemberDialog", {
                ref: "groupMemberDialogRef",
                attrs: {
                    visible: t.mentionPopupVisible,
                    groupId: t.accountUsernameData && t.accountUsernameData.groupId,
                    position: t.groupMemberPopupPosition,
                    keyword: t.mentionKeyword
                },
                on: {
                    select: t.onSelectMentionMember
                }
            }), s("div", {
                staticClass: "submit-actions"
            }, [t.scheduledTaskCount > 0 ? [s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.chatwindow.scheduledMsgTitle"),
                    placement: "top"
                }
            }, [s("el-badge", {
                staticClass: "scheduled-msg-badge",
                attrs: {
                    "is-dot": ""
                }
            }, [s("el-button", {
                attrs: {
                    size: "mini",
                    type: "default",
                    icon: "el-icon-time"
                },
                on: {
                    click: t.openScheduledListDialog
                }
            })], 1)], 1)] : t._e(), t.accountUsername.username ? s("el-dropdown", {
                staticClass: "schedule-dropdown",
                attrs: {
                    "split-button": "",
                    type: "primary",
                    disabled: !t.accountUsername.username && !t.accountUsername.groupId || 1 == t.accountUsername.announcement && 2 == t.accountUsername.groupIdentity,
                    size: "mini"
                },
                on: {
                    click: function(e) {
                        return t.contentSubmit(e)
                    },
                    command: t.onScheduleMenuCommand
                }
            }, [t._v(" " + t._s(t.$t("newchat.chatwindow.enterButInfo")) + " "), s("el-dropdown-menu", {
                attrs: {
                    slot: "dropdown"
                },
                slot: "dropdown"
            }, [s("el-dropdown-item", {
                attrs: {
                    command: "text"
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.scheduleSendText")))]), s("el-dropdown-item", {
                attrs: {
                    divided: "",
                    command: "material"
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.scheduleSendMaterial")))])], 1)], 1) : s("el-button", {
                staticClass: "submitBut",
                attrs: {
                    type: "primary",
                    size: "mini",
                    disabled: !t.accountUsername.username && !t.accountUsername.groupId || 1 == t.accountUsername.announcement && 2 == t.accountUsername.groupIdentity
                },
                on: {
                    click: function(e) {
                        return t.contentSubmit(e)
                    }
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.enterButInfo")))])], 2)], 1)])], 1)], 1)], 2), t.MTdialogVisible ? s("el-dialog", {
                attrs: {
                    title: t.$t("newchat.chatwindow.materialLibrary"),
                    visible: t.MTdialogVisible,
                    width: "80vw"
                },
                on: {
                    "update:visible": function(e) {
                        t.MTdialogVisible = e
                    },
                    close: t.onMTDialogClose
                }
            }, [s("MeterialLibrary", {
                attrs: {
                    MTdialogVisible: t.MTdialogVisible,
                    accountUsername: t.accountUsername,
                    lockedSType: t.callMaterialSelectMode ? 4 : null,
                    hideTextMaterialType: t.scheduledMaterialPickMode
                },
                on: {
                    "update:MTdialogVisible": function(e) {
                        t.MTdialogVisible = e
                    },
                    "update:m-tdialog-visible": function(e) {
                        t.MTdialogVisible = e
                    },
                    sendMeterial: t.sendMeterial,
                    sendQRText: t.sendQRText
                }
            })], 1) : t._e(), s("el-dialog", {
                attrs: {
                    title: t.$t("newchat.chatwindow.voiceCallModeTitle"),
                    visible: t.callModeDialogVisible,
                    width: "540px",
                    "append-to-body": ""
                },
                on: {
                    "update:visible": function(e) {
                        t.callModeDialogVisible = e
                    }
                }
            }, [s("el-form", {
                attrs: {
                    "label-width": "110px"
                }
            }, [s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.chatwindow.callMode")
                }
            }, [s("el-radio-group", {
                attrs: {
                    size: "mini"
                },
                on: {
                    change: t.onCallModeChange
                },
                model: {
                    value: t.callModeForm.mode,
                    callback: function(e) {
                        t.$set(t.callModeForm, "mode", e)
                    },
                    expression: "callModeForm.mode"
                }
            }, [s("el-radio-button", {
                attrs: {
                    label: "default"
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.callModeDefault")))]), s("el-radio-button", {
                attrs: {
                    label: "connect"
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.callModeConnect")))]), s("el-radio-button", {
                attrs: {
                    label: "voice"
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.callModeVoice")))])], 1)], 1), s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.chatwindow.tip")
                }
            }, [s("div", {
                staticStyle: {
                    color: "#606266"
                }
            }, ["default" === t.callModeForm.mode ? s("span", [t._v(t._s(t.$t("newchat.chatwindow.callModeDefaultTip")))]) : "connect" === t.callModeForm.mode ? s("span", [t._v(t._s(t.$t("newchat.chatwindow.callModeConnectTip")))]) : s("span", [t._v(t._s(t.$t("newchat.chatwindow.callModeVoiceTip")))])])]), "connect" === t.callModeForm.mode ? s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.chatwindow.answerTime")
                }
            }, [s("el-select", {
                staticStyle: {
                    width: "130px"
                },
                attrs: {
                    placeholder: t.$t("newchat.chatwindow.selectAnswerTime"),
                    size: "mini"
                },
                model: {
                    value: t.callModeForm.callSeconds,
                    callback: function(e) {
                        t.$set(t.callModeForm, "callSeconds", e)
                    },
                    expression: "callModeForm.callSeconds"
                }
            }, t._l(10, (function(e) {
                return s("el-option", {
                    key: e,
                    attrs: {
                        label: "" + e + t.$t("newchat.chatwindow.second"),
                        value: e
                    }
                })
            }
            )), 1)], 1) : t._e(), "voice" === t.callModeForm.mode ? s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.chatwindow.recordingMaterial")
                }
            }, [s("el-button", {
                attrs: {
                    type: "primary",
                    plain: "",
                    size: "mini"
                },
                on: {
                    click: t.openCallMaterialPicker
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.openMaterialLibrary")))]), t.callModeForm.smform && (t.callModeForm.smform.smName || t.callModeForm.smform.sName) ? s("div", {
                staticStyle: {
                    "margin-top": "6px",
                    color: "#909399",
                    "font-size": "12px"
                }
            }, [t._v(" " + t._s(t.callModeForm.smform.smName || t.callModeForm.smform.sName) + " "), null != t.callModeForm.smform.seconds ? [t._v("（" + t._s(t.callModeForm.smform.seconds) + "″）")] : t._e(), t.callModeForm.smId ? s("el-button", {
                attrs: {
                    type: "text",
                    size: "mini"
                },
                on: {
                    click: t.clearCallVoiceMaterial
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.clear")))]) : t._e()], 2) : t._e()], 1) : t._e()], 1), s("span", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [s("el-button", {
                on: {
                    click: function(e) {
                        t.callModeDialogVisible = !1
                    }
                }
            }, [t._v(t._s(t.$t("newchat.dialog.cancel")))]), s("el-button", {
                attrs: {
                    type: "primary"
                },
                on: {
                    click: t.confirmCallMode
                }
            }, [t._v(t._s(t.$t("newchat.dialog.confirm")))])], 1)], 1), s("el-dialog", {
                attrs: {
                    title: t.$t("newchat.chatwindow.sendBusinessCard"),
                    visible: t.contactDialogVisible,
                    width: "500px"
                },
                on: {
                    "update:visible": function(e) {
                        t.contactDialogVisible = e
                    },
                    close: function(e) {
                        return t.$refs.contactForm.resetFields()
                    }
                }
            }, [s("el-form", {
                ref: "contactForm",
                staticClass: "demo-ruleForm",
                attrs: {
                    model: t.contactForm,
                    "label-width": "120px",
                    rules: t.contactRules
                }
            }, [s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.chatwindow.contactName"),
                    prop: "displayName"
                }
            }, [s("el-input", {
                model: {
                    value: t.contactForm.displayName,
                    callback: function(e) {
                        t.$set(t.contactForm, "displayName", "string" === typeof e ? e.trim() : e)
                    },
                    expression: "contactForm.displayName"
                }
            })], 1), s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.chatwindow.phoneNumber"),
                    prop: "phone",
                    rules: [{
                        required: !0,
                        message: t.$t("newchat.chatwindow.enterNumber"),
                        trigger: "blur"
                    }]
                }
            }, [s("el-input", {
                on: {
                    input: t.clearStr
                },
                model: {
                    value: t.contactForm.phone,
                    callback: function(e) {
                        t.$set(t.contactForm, "phone", "string" === typeof e ? e.trim() : e)
                    },
                    expression: "contactForm.phone"
                }
            })], 1)], 1), s("span", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [s("el-button", {
                on: {
                    click: function(e) {
                        t.contactDialogVisible = !1
                    }
                }
            }, [t._v(t._s(t.$t("newchat.dialog.cancel")))]), s("el-button", {
                attrs: {
                    type: "primary"
                },
                on: {
                    click: t.sendContact
                }
            }, [t._v(t._s(t.$t("newchat.dialog.send")))])], 1)], 1), s("el-dialog", {
                attrs: {
                    title: "翻译",
                    visible: t.translateDialogVisible,
                    "destroy-on-close": "",
                    width: "500px",
                    center: ""
                },
                on: {
                    "update:visible": function(e) {
                        t.translateDialogVisible = e
                    }
                }
            }, [s("Translate", {
                attrs: {
                    visible: t.translateDialogVisible,
                    translateLoading: t.translateLoading,
                    targetLanguageVal: t.targetLanguageVal
                },
                on: {
                    "update:visible": function(e) {
                        t.translateDialogVisible = e
                    },
                    getTranslateData: t.getTranslateData
                }
            }), s("span", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [s("el-button", {
                on: {
                    click: function(e) {
                        t.translateDialogVisible = !1
                    }
                }
            }, [t._v(t._s(t.$t("newchat.dialog.cancel")))]), s("el-button", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.targetLanguageVal,
                    expression: "targetLanguageVal"
                }],
                attrs: {
                    type: "success"
                },
                on: {
                    click: t.copyTranslate
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.copyContent")))]), s("el-button", {
                attrs: {
                    type: "primary",
                    disabled: t.canTranslateTime
                },
                on: {
                    click: t.translateSubmit
                }
            }, [t._v(t._s(t.canTranslateTime ? t.canTranslateTimeNum : t.$t("newchat.chatwindow.translate")))])], 1)], 1), s("el-dialog", {
                attrs: {
                    title: t.$t("newchat.chatwindow.modifyInformation"),
                    visible: t.editDialogVisible,
                    width: "500px",
                    center: ""
                },
                on: {
                    "update:visible": function(e) {
                        t.editDialogVisible = e
                    }
                }
            }, [s("el-form", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.editUserLoading,
                    expression: "editUserLoading"
                }],
                ref: "ruleForm",
                staticClass: "demo-ruleForm",
                attrs: {
                    model: t.editUserForm,
                    "label-width": "100px"
                }
            }, [s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.userList.number"),
                    prop: "name"
                }
            }, [s("div", {
                staticClass: "notranslate"
            }, [t._v(t._s(t.accountUsername.username))])]), s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.chatwindow.nickname"),
                    prop: "remarkName"
                }
            }, [s("el-input", {
                attrs: {
                    maxlength: "25"
                },
                model: {
                    value: t.editUserForm.remarkName,
                    callback: function(e) {
                        t.$set(t.editUserForm, "remarkName", "string" === typeof e ? e.trim() : e)
                    },
                    expression: "editUserForm.remarkName"
                }
            })], 1), s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.chatwindow.notes"),
                    prop: "remark"
                }
            }, [s("el-input", {
                attrs: {
                    type: "textarea",
                    rows: 3,
                    maxlength: 100,
                    "show-word-limit": !0
                },
                model: {
                    value: t.editUserForm.remark,
                    callback: function(e) {
                        t.$set(t.editUserForm, "remark", "string" === typeof e ? e.trim() : e)
                    },
                    expression: "editUserForm.remark"
                }
            })], 1), s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.chatwindow.area"),
                    prop: "country"
                }
            }, [s("el-input", {
                model: {
                    value: t.editUserForm.country,
                    callback: function(e) {
                        t.$set(t.editUserForm, "country", "string" === typeof e ? e.trim() : e)
                    },
                    expression: "editUserForm.country"
                }
            })], 1), t.editUserForm.friendsId ? s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.chatwindow.label"),
                    prop: "remarks"
                }
            }, [s("el-select", {
                attrs: {
                    multiple: "",
                    placeholder: t.$t("newchat.chatwindow.selectLabel")
                },
                model: {
                    value: t.editUserForm.labelIdsArr,
                    callback: function(e) {
                        t.$set(t.editUserForm, "labelIdsArr", e)
                    },
                    expression: "editUserForm.labelIdsArr"
                }
            }, t._l(t.labelOptions, (function(t, e) {
                return s("el-option", {
                    key: e,
                    attrs: {
                        label: t.labelName,
                        value: t.id
                    }
                })
            }
            )), 1), s("el-button", {
                staticStyle: {
                    "margin-left": "10px"
                },
                attrs: {
                    type: "primary",
                    icon: "el-icon-plus"
                },
                on: {
                    click: t.openAddTag
                }
            })], 1) : t._e()], 1), s("span", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [s("el-button", {
                on: {
                    click: function(e) {
                        t.editDialogVisible = !1
                    }
                }
            }, [t._v(t._s(t.$t("newchat.dialog.cancel")))]), s("el-button", {
                attrs: {
                    type: "primary"
                },
                on: {
                    click: t.editUserData
                }
            }, [t._v(t._s(t.$t("newchat.dialog.edit")))])], 1)], 1), s("el-dialog", {
                attrs: {
                    title: t.$t("newchat.chatwindow.addCustomerTags"),
                    visible: t.addTagVisible,
                    width: "500px",
                    center: "",
                    "append-to-body": "",
                    "destroy-on-close": !0
                },
                on: {
                    "update:visible": function(e) {
                        t.addTagVisible = e
                    },
                    close: function(e) {
                        return t.$refs["addTagRuleForm"].resetFields()
                    }
                }
            }, [s("el-form", {
                ref: "addTagRuleForm",
                staticClass: "demo-ruleForm",
                attrs: {
                    model: t.tagForm,
                    rules: t.tagRule,
                    "label-width": "100px"
                },
                nativeOn: {
                    submit: function(t) {
                        t.preventDefault()
                    }
                }
            }, [s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.chatwindow.tagName"),
                    prop: "labelName",
                    rules: [{
                        required: !0,
                        message: t.$t("newchat.chatwindow.enterLabelName"),
                        trigger: "blur"
                    }]
                }
            }, [s("el-input", {
                model: {
                    value: t.tagForm.labelName,
                    callback: function(e) {
                        t.$set(t.tagForm, "labelName", "string" === typeof e ? e.trim() : e)
                    },
                    expression: "tagForm.labelName"
                }
            })], 1)], 1), s("span", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [s("el-button", {
                on: {
                    click: function(e) {
                        t.addTagVisible = !1
                    }
                }
            }, [t._v(t._s(t.$t("newchat.dialog.cancel")))]), s("el-button", {
                attrs: {
                    type: "primary",
                    loading: t.butLoading
                },
                on: {
                    "~click": function(e) {
                        return t.addTag(e)
                    }
                }
            }, [t._v(t._s(t.$t("newchat.dialog.add")))])], 1)], 1), s("el-dialog", {
                staticClass: "read-status-dialog",
                attrs: {
                    title: t.$t("newchat.chatwindow.readStatusTitle"),
                    visible: t.readStatusDialogVisible,
                    width: "600px",
                    "append-to-body": ""
                },
                on: {
                    "update:visible": function(e) {
                        t.readStatusDialogVisible = e
                    }
                }
            }, [s("div", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.readStatusLoading,
                    expression: "readStatusLoading"
                }],
                staticStyle: {
                    "min-height": "120px"
                }
            }, [t.readStatusLoading ? t._e() : [t.readStatusList.length ? s("div", {
                staticStyle: {
                    "margin-bottom": "10px",
                    display: "flex",
                    "justify-content": "space-between",
                    "align-items": "flex-end"
                }
            }, [s("span", [t._v(t._s(t.$t("newchat.chatwindow.count")) + ": " + t._s(t.readStatusList.length) + " ")]), s("span", {
                staticStyle: {
                    "font-size": "12px",
                    color: "#F56C6C"
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.noReadStatusTip")))])]) : t._e(), t.readStatusList.length ? s("el-table", {
                attrs: {
                    data: t.readStatusList,
                    border: "",
                    size: "small",
                    "max-height": "320"
                }
            }, [s("el-table-column", {
                attrs: {
                    label: t.$t("newchat.chatwindow.readStatusMember"),
                    "min-width": "120",
                    "show-overflow-tooltip": ""
                },
                scopedSlots: t._u([{
                    key: "default",
                    fn: function(e) {
                        return [t._v(" " + t._s(e.row.nickName || "-") + " ")]
                    }
                }], null, !1, 2622223384)
            }), s("el-table-column", {
                attrs: {
                    label: t.$t("newchat.chatwindow.wsAccount"),
                    "min-width": "120"
                },
                scopedSlots: t._u([{
                    key: "default",
                    fn: function(e) {
                        return [t._v(" " + t._s(e.row.groupMemberUsername || "-") + " ")]
                    }
                }], null, !1, 1382564329)
            }), s("el-table-column", {
                attrs: {
                    label: t.$t("newchat.chatwindow.deliveryTime"),
                    "min-width": "140"
                },
                scopedSlots: t._u([{
                    key: "default",
                    fn: function(e) {
                        return [t._v(" " + t._s(t.formatReadStatusTime(e.row.deliveryTime)) + " ")]
                    }
                }], null, !1, 1904873989)
            }), s("el-table-column", {
                attrs: {
                    label: t.$t("newchat.chatwindow.readTime"),
                    "min-width": "140"
                },
                scopedSlots: t._u([{
                    key: "default",
                    fn: function(e) {
                        return [t._v(" " + t._s(t.formatReadStatusTime(e.row.readTime)) + " ")]
                    }
                }], null, !1, 1796849387)
            })], 1) : s("div", {
                staticClass: "read-status-empty"
            }, [s("div", [t._v(t._s(t.$t("newchat.chatwindow.noReadStatus")))]), s("div", {
                staticClass: "read-status-empty-tip"
            }, [t._v(t._s(t.$t("newchat.chatwindow.noReadStatusTip")))])])]], 2)]), s("el-dialog", {
                attrs: {
                    title: "发送定位",
                    visible: t.mapDialogVisible,
                    width: "500px",
                    center: ""
                },
                on: {
                    "update:visible": function(e) {
                        t.mapDialogVisible = e
                    }
                }
            }, [s("el-autocomplete", {
                staticClass: "inline-input",
                attrs: {
                    "fetch-suggestions": t.querySearch,
                    placeholder: "请输入搜索地点",
                    "trigger-on-focus": !1
                },
                on: {
                    select: t.handleSelect
                },
                model: {
                    value: t.searchMapInput,
                    callback: function(e) {
                        t.searchMapInput = "string" === typeof e ? e.trim() : e
                    },
                    expression: "searchMapInput"
                }
            }), s("GmapMap", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.mapDialogLoading,
                    expression: "mapDialogLoading"
                }],
                ref: "map",
                staticClass: "map",
                attrs: {
                    center: t.center,
                    zoom: 16,
                    options: {
                        streetViewControl: !1,
                        mapTypeControl: !1
                    }
                },
                on: {
                    click: t.centerClick
                }
            }, [s("GmapMarker", {
                attrs: {
                    position: t.center,
                    clickable: !0,
                    draggable: !0
                }
            }), s("el-button", {
                staticClass: "currentPoint",
                attrs: {
                    icon: "el-icon-location"
                },
                on: {
                    click: t.geolocate
                }
            })], 1), s("span", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [s("el-button", {
                on: {
                    click: function(e) {
                        t.mapDialogVisible = !1
                    }
                }
            }, [t._v(t._s(t.$t("newchat.dialog.cancel")))]), s("el-button", {
                attrs: {
                    type: "primary"
                },
                on: {
                    click: t.sendMap
                }
            }, [t._v("发送")])], 1)], 1), s("el-dialog", {
                staticClass: "sendImgDia",
                attrs: {
                    title: "发送" + t.fileTypeStr,
                    visible: t.senFileVisible,
                    width: "500px",
                    center: "",
                    "append-to-body": "",
                    "destroy-on-close": !0
                },
                on: {
                    "update:visible": function(e) {
                        t.senFileVisible = e
                    },
                    closed: t.senFileClose,
                    opened: t.handleDialogOpened
                }
            }, ["mp4" == t.senFileType || "m4v" == t.senFileType || "jpg" == t.senFileType || "png" == t.senFileType || "jpeg" == t.senFileType ? ["mp4" == t.senFileType || "m4v" == t.senFileType ? s("video", {
                staticStyle: {
                    width: "100%"
                },
                attrs: {
                    controls: "",
                    height: "500"
                }
            }, [s("source", {
                attrs: {
                    src: t.senFileUrl,
                    type: "video/webm"
                }
            }), s("source", {
                attrs: {
                    src: t.senFileUrl,
                    type: "video/mp4"
                }
            })]) : "jpg" == t.senFileType || "png" == t.senFileType || "jpeg" == t.senFileType ? s("el-image", {
                staticStyle: {
                    width: "400px",
                    height: "400px"
                },
                attrs: {
                    src: t.senFileUrl,
                    "preview-src-list": [t.senFileUrl],
                    fit: "cover"
                }
            }) : t._e(), s("el-input", {
                attrs: {
                    type: "textarea",
                    rows: 4,
                    placeholder: "请输入内容",
                    "show-word-limit": "",
                    maxlength: 1e3
                },
                model: {
                    value: t.sendFileText,
                    callback: function(e) {
                        t.sendFileText = e
                    },
                    expression: "sendFileText"
                }
            }), s("div", {
                staticStyle: {
                    "margin-top": "10px"
                }
            }, [s("el-checkbox", {
                attrs: {
                    "true-label": 1,
                    "false-label": 0
                },
                model: {
                    value: t.isTrans,
                    callback: function(e) {
                        t.isTrans = e
                    },
                    expression: "isTrans"
                }
            }, [t._v("是否翻译")])], 1)] : "mp3" == t.senFileType || "ogg" == t.senFileType || "wav" == t.senFileType ? [s("audio", {
                attrs: {
                    controls: ""
                }
            }, [s("source", {
                attrs: {
                    src: t.senFileUrl,
                    type: "audio/mpeg"
                }
            }), s("source", {
                attrs: {
                    src: t.senFileUrl,
                    type: "audio/ogg"
                }
            })])] : [s("el-card", {
                staticClass: "file-box-card"
            }, [s("div", {
                staticClass: "card-top"
            }, [s("div", {
                staticClass: "name"
            }, [t._v(t._s(t.pasteFile.name))]), s("i", {
                staticClass: "el-icon-document icon"
            })]), s("div", {
                staticClass: "card-bot"
            }, [t._v(" " + t._s(t.pasteFileSizeString) + " ")])])], s("span", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [s("el-button", {
                on: {
                    click: function(e) {
                        t.senFileVisible = !1
                    }
                }
            }, [t._v(t._s(t.$t("newchat.dialog.cancel")))]), s("el-button", {
                ref: "enterButton",
                attrs: {
                    type: "primary",
                    loading: t.butLoading
                },
                on: {
                    "~click": function(e) {
                        return t.sendFileSubmit(e)
                    }
                }
            }, [t._v("Enther " + t._s(t.$t("newchat.dialog.send")))])], 1)], 2), s("el-dialog", {
                attrs: {
                    title: "text" === t.scheduleSendType ? t.$t("newchat.chatwindow.scheduleDialogTitleText") : t.$t("newchat.chatwindow.scheduleDialogTitleMaterial"),
                    visible: t.scheduleSendDialogVisible,
                    width: "520px",
                    "append-to-body": ""
                },
                on: {
                    "update:visible": function(e) {
                        t.scheduleSendDialogVisible = e
                    },
                    closed: t.onScheduleSendDialogClosed
                }
            }, [s("el-form", {
                ref: "scheduleForm",
                attrs: {
                    "label-width": "100px",
                    size: "small"
                }
            }, ["text" === t.scheduleSendType ? s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.chatwindow.scheduleTextContent"),
                    prop: "scheduleTextContent"
                }
            }, [s("el-input", {
                attrs: {
                    type: "textarea",
                    rows: 4,
                    maxlength: "4000",
                    "show-word-limit": ""
                },
                model: {
                    value: t.scheduleTextContent,
                    callback: function(e) {
                        t.scheduleTextContent = e
                    },
                    expression: "scheduleTextContent"
                }
            })], 1) : s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.chatwindow.scheduleSelectMaterial"),
                    prop: "scheduleMaterialItem"
                }
            }, [s("el-button", {
                attrs: {
                    type: "primary",
                    plain: "",
                    size: "mini"
                },
                on: {
                    click: t.openScheduledMaterialPicker
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.scheduleSelectMaterial")))]), t.scheduleMaterialItem && t.scheduleMaterialItem.id ? s("div", {
                staticClass: "schedule-content-box"
            }, [t.scheduleMaterialItem.smName ? s("div", [t._v(t._s(t.$t("newchat.chatwindow.materialName")) + ": " + t._s(t.scheduleMaterialItem.smName))]) : t._e(), 1 == t.scheduleMaterialItem.sType ? s("div", [s("el-image", {
                staticStyle: {
                    width: "50px",
                    height: "50px"
                },
                attrs: {
                    src: t.scheduleMaterialItem.fileUrl,
                    fit: "cover"
                }
            })], 1) : 2 == t.scheduleMaterialItem.sType ? s("div", [s("el-tag", {
                attrs: {
                    size: "mini"
                }
            }, [t._v("File:" + t._s(t.scheduleMaterialItem.fileName))])], 1) : 4 == t.scheduleMaterialItem.sType ? s("div", [s("audio", {
                staticStyle: {
                    height: "40px",
                    width: "230px"
                },
                attrs: {
                    src: t.scheduleMaterialItem.fileUrl,
                    controls: ""
                }
            })]) : 3 == t.scheduleMaterialItem.sType ? s("div", [s("video", {
                staticStyle: {
                    height: "100px"
                },
                attrs: {
                    src: t.scheduleMaterialItem.fileUrl,
                    controls: ""
                }
            })]) : 7 == t.scheduleMaterialItem.sType ? s("div", [s("BusinessCard", {
                attrs: {
                    itemData: t.scheduleMaterialItem
                }
            })], 1) : 5 == t.scheduleMaterialItem.sType || 8 == t.scheduleMaterialItem.sType ? s("div", [s("Expression", {
                attrs: {
                    itemData: t.scheduleMaterialItem
                }
            })], 1) : 9 == t.scheduleMaterialItem.sType ? s("div", [s("ImageLink", {
                attrs: {
                    itemData: t.scheduleMaterialItem
                }
            })], 1) : 11 == t.scheduleMaterialItem.sType ? s("div", [s("SuperLink", {
                attrs: {
                    itemData: t.scheduleMaterialItem
                }
            })], 1) : 12 == t.scheduleMaterialItem.sType ? s("div", [s("ImageLink", {
                attrs: {
                    itemData: t.scheduleMaterialItem
                }
            })], 1) : 13 == t.scheduleMaterialItem.sType ? s("div", [s("TextImageTemplate", {
                attrs: {
                    itemData: t.scheduleMaterialItem
                }
            })], 1) : t._e(), t.scheduleMaterialItem.caption ? s("div", [t._v(t._s(t.$t("newchat.chatwindow.caption")) + ": " + t._s(t.scheduleMaterialItem.caption))]) : t._e()]) : t._e()], 1), s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.chatwindow.scheduleSendTime"),
                    prop: "scheduleDateTime"
                }
            }, [s("el-date-picker", {
                staticStyle: {
                    width: "100%"
                },
                attrs: {
                    type: "datetime",
                    placeholder: t.$t("newchat.chatwindow.schedulePickTime"),
                    format: "yyyy-MM-dd HH:mm",
                    "value-format": "yyyy-MM-dd HH:mm:ss",
                    "default-time": "12:00:00",
                    "picker-options": t.schedulePickerOptions
                },
                model: {
                    value: t.scheduleDateTime,
                    callback: function(e) {
                        t.scheduleDateTime = e
                    },
                    expression: "scheduleDateTime"
                }
            }), s("span", {
                staticStyle: {
                    color: "#999",
                    "font-size": "12px"
                }
            }, [s("i", {
                staticClass: "el-icon-info"
            }), t._v(" " + t._s(t.$t("newchat.chatwindow.schedulePickTimeInfo")) + " ")])], 1)], 1), s("span", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [s("el-button", {
                on: {
                    click: function(e) {
                        t.scheduleSendDialogVisible = !1
                    }
                }
            }, [t._v(t._s(t.$t("newchat.dialog.cancel")))]), s("el-button", {
                attrs: {
                    type: "primary",
                    loading: t.scheduleSubmitLoading
                },
                on: {
                    click: t.confirmScheduleSend
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.scheduleConfirm")))])], 1)], 1), s("el-dialog", {
                attrs: {
                    title: t.$t("newchat.chatwindow.scheduledListTitle"),
                    visible: t.scheduledListVisible,
                    width: "800px",
                    "append-to-body": ""
                },
                on: {
                    "update:visible": function(e) {
                        t.scheduledListVisible = e
                    }
                }
            }, [s("div", {
                staticStyle: {
                    "margin-bottom": "12px"
                }
            }, [s("el-button", {
                attrs: {
                    type: "danger",
                    size: "mini",
                    disabled: !t.scheduledListSelection.length
                },
                on: {
                    click: t.batchDeleteScheduledRows
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.scheduleBatchDelete")))])], 1), s("el-table", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.scheduledListLoading,
                    expression: "scheduledListLoading"
                }],
                attrs: {
                    data: t.scheduledListRows,
                    border: "",
                    size: "small"
                },
                on: {
                    "selection-change": t.handleScheduledSelectionChange
                }
            }, [s("el-table-column", {
                attrs: {
                    type: "selection",
                    align: "center",
                    width: "45"
                }
            }), s("el-table-column", {
                attrs: {
                    prop: "id",
                    label: "ID",
                    width: "70"
                }
            }), s("el-table-column", {
                attrs: {
                    label: t.$t("newchat.chatwindow.scheduleType"),
                    width: "90"
                },
                scopedSlots: t._u([{
                    key: "default",
                    fn: function(e) {
                        return [t._v(t._s(1 == e.row.chatType ? t.$t("newchat.chatwindow.scheduleTypeText") : t.$t("newchat.chatwindow.scheduleTypeMaterial")))]
                    }
                }])
            }), s("el-table-column", {
                attrs: {
                    label: t.$t("newchat.chatwindow.scheduleContentPreview"),
                    "min-width": "120",
                    "show-overflow-tooltip": ""
                },
                scopedSlots: t._u([{
                    key: "default",
                    fn: function(e) {
                        return [1 == e.row.chatType ? [s("div", {
                            staticClass: "schedule-content-box-text"
                        }, [t._v(" " + t._s(e.row.chatContent) + " ")]), e.row.chatVideo ? s("div", {
                            staticClass: "schedule-content-box-text original-text"
                        }, [t._v(" " + t._s(t.$t("newchat.chatwindow.original")) + ": " + t._s(e.row.chatVideo) + " ")]) : t._e()] : s("div", {
                            staticClass: "schedule-content-box"
                        }, [1 == e.row.sType ? s("el-image", {
                            staticStyle: {
                                width: "50px",
                                height: "50px"
                            },
                            attrs: {
                                src: e.row.fileUrl,
                                fit: "cover"
                            }
                        }) : t._e(), 2 == e.row.sType ? s("div", [s("el-tag", {
                            attrs: {
                                size: "mini"
                            }
                        }, [t._v("File:" + t._s(e.row.fileName))])], 1) : t._e(), 4 == e.row.sType ? s("audio", {
                            staticStyle: {
                                height: "40px",
                                width: "230px"
                            },
                            attrs: {
                                src: e.row.fileUrl,
                                controls: ""
                            }
                        }) : t._e(), 3 == e.row.sType ? s("video", {
                            staticStyle: {
                                height: "100px"
                            },
                            attrs: {
                                src: e.row.fileUrl,
                                controls: ""
                            }
                        }) : t._e(), 7 == e.row.sType ? s("BusinessCard", {
                            staticStyle: {
                                "justify-content": "flex-end"
                            },
                            attrs: {
                                itemData: e.row
                            }
                        }) : 5 == e.row.sType || 8 == e.row.sType ? s("Expression", {
                            attrs: {
                                itemData: e.row
                            }
                        }) : t._e(), 9 == e.row.sType ? s("div", [s("ImageLink", {
                            attrs: {
                                itemData: e.row
                            }
                        })], 1) : t._e(), 11 == e.row.sType ? s("div", [s("SuperLink", {
                            staticStyle: {
                                "justify-content": "flex-end"
                            },
                            attrs: {
                                itemData: e.row
                            }
                        })], 1) : t._e(), 12 == e.row.sType ? s("div", [s("ImageLink", {
                            attrs: {
                                itemData: e.row
                            }
                        })], 1) : t._e(), 13 == e.row.sType ? s("div", [s("TextImageTemplate", {
                            attrs: {
                                itemData: e.row
                            }
                        })], 1) : t._e(), e.row.caption ? s("div", [t._v(t._s(e.row.caption))]) : t._e()], 1)]
                    }
                }])
            }), s("el-table-column", {
                attrs: {
                    label: t.$t("newchat.chatwindow.scheduleSendTime"),
                    width: "140"
                },
                scopedSlots: t._u([{
                    key: "default",
                    fn: function(e) {
                        return [t._v(t._s(e.row.sendTime || e.row.sendTimeStr || e.row.scheduleTime || "-"))]
                    }
                }])
            }), s("el-table-column", {
                attrs: {
                    label: t.$t("newchat.chatwindow.scheduleFailReason"),
                    width: "140",
                    "show-overflow-tooltip": ""
                },
                scopedSlots: t._u([{
                    key: "default",
                    fn: function(e) {
                        return [t._v(t._s(e.row.error || "-"))]
                    }
                }])
            })], 1), t.scheduledListTotal > 0 ? s("el-pagination", {
                staticStyle: {
                    "margin-top": "12px",
                    "text-align": "right"
                },
                attrs: {
                    layout: "prev, pager, next, sizes, total",
                    "current-page": t.scheduledListPage,
                    "page-sizes": [10, 20, 50],
                    "page-size": t.scheduledListPageSize,
                    total: t.scheduledListTotal
                },
                on: {
                    "current-change": t.onScheduledListPageChange,
                    "size-change": t.onScheduledListSizeChange
                }
            }) : t._e()], 1), s("GroupDetailsDrawer", {
                ref: "groupDetailsDrawer",
                attrs: {
                    myGroupIdentity: t.myGroupIdentity,
                    pageType: "newChat"
                }
            })], 1)
        }
          , i = []
          , n = a("2909")
          , o = a("5530")
          , r = a("c7eb")
          , c = a("1da1")
          , l = a("ade3")
          , u = (a("b680"),
        a("a9e3"),
        a("0541"),
        a("99af"),
        a("4de4"),
        a("d3b7"),
        a("14d9"),
        a("a4d3"),
        a("e01a"),
        a("7db0"),
        a("c740"),
        a("a434"),
        a("159b"),
        a("3c65"),
        a("498a"),
        a("e9c4"),
        a("8a79"),
        a("ac1f"),
        a("5319"),
        a("25f0"),
        a("caad"),
        a("a15b"),
        a("d81d"),
        a("b0c0"),
        a("3ca3"),
        a("ddb0"),
        a("2b3d"),
        a("9861"),
        a("2ca0"),
        a("488e"))
          , d = a("eb37")
          , h = a("84e6")
          , m = a("8b74")
          , p = a("4679")
          , g = a("4ba8")
          , f = a("6e25")
          , b = a("1a99")
          , v = a("805c")
          , w = a("1c34")
          , L = a("425a")
          , C = a("8a8f")
          , y = a("34f1")
          , x = a("102e")
          , $ = a("dd74")
          , T = a("11a4")
          , k = a("5f87")
          , S = a("f77b")
          , I = a("bc19")
          , _ = a("c38a")
          , D = a("1020")
          , A = a("bc3a")
          , U = a.n(A)
          , N = a("852e")
          , M = a.n(N)
          , O = a("755e")
          , F = a("2de3")
          , j = a("7f45")
          , B = a.n(j)
          , E = a("46ab")
          , G = a("30c1")
          , z = (a("b64b"),
        {
            data: function() {
                return {
                    webSocket: null,
                    path: "ws://8.222.161.38/websocket/",
                    lockReconnect: !1,
                    intervalTimeObj: null,
                    intervalTime: 5e3,
                    timeoutObj: null,
                    timeout: 6e3,
                    isReconnect: !0,
                    csDataVal: null,
                    reconnectInterval: 1e3,
                    maxReconnectInterval: 3e4,
                    intervalFactor: 1.5,
                    webSocketType: 0,
                    haveDisconnected: !1,
                    initFinish: !1
                }
            },
            computed: {
                csData: function() {
                    return this.csDataVal = this.$store.state.newChat.csData,
                    this.$store.state.newChat.csData
                }
            },
            watch: {
                csData: function(t) {
                    t && !this.webSocket && (this.csDataVal = t,
                    this.initWebSocket(t.csRow.tokenId))
                }
            },
            created: function() {},
            mounted: function() {
                var t = window.location.href
                  , e = t.split("/")[2]
                  , a = t.indexOf("https");
                a > -1 ? (e || -1 == e.indexOf("localhost")) && (this.path = "wss://" + e + "/websocket/") : e && -1 == e.indexOf("localhost") && (this.path = "ws://" + e + "/websocket/")
            },
            methods: {
                initWebSocket: function(t) {
                    if (this.closeWebSocket(),
                    "undefined" == typeof WebSocket)
                        return this.webSocketType = 4,
                        this.$message.error("您的浏览器不支持WebSocket"),
                        !1;
                    this.webSocketType = 2,
                    this.webSocket = new WebSocket(this.path + t),
                    this.webSocket.onopen = this.onopen,
                    this.webSocket.onmessage = this.onmessage,
                    this.webSocket.onerror = this.onerror,
                    this.webSocket.onclose = this.onclose,
                    this.initFinish = !0
                },
                closeWebSocket: function() {
                    this.webSocket && (this.webSocket.onopen = null,
                    this.webSocket.onmessage = null,
                    this.webSocket.onerror = null,
                    this.webSocket.onclose = null,
                    this.webSocket.close(),
                    this.webSocket = null),
                    this.intervalTimeObj && (clearInterval(this.intervalTimeObj),
                    this.intervalTimeObj = null),
                    this.timeoutObj && (clearTimeout(this.timeoutObj),
                    this.timeoutObj = null),
                    this.webSocketType = 0,
                    this.lockReconnect = !1
                },
                reconnect: function() {
                    var t = this;
                    t.lockReconnect || (this.reconnectInterval = Math.min(this.maxReconnectInterval, this.reconnectInterval * this.intervalFactor),
                    t.lockReconnect = !0,
                    this.webSocketType = 2,
                    t.closeWebSocket(),
                    setTimeout((function() {
                        t.haveDisconnected = !0,
                        t.initWebSocket(t.csDataVal.csRow.tokenId),
                        t.lockReconnect = !1
                    }
                    ), this.reconnectInterval))
                },
                start: function() {
                    var t = this;
                    t.intervalTimeObj || (this.intervalTimeObj = setInterval((function() {
                        t.webSocket && 1 == t.webSocket.readyState ? (t.webSocket.send("ping"),
                        t.timeoutObj = setTimeout((function() {
                            t.webSocket.close()
                        }
                        ), t.timeout)) : (t.webSocketType = 3,
                        clearInterval(t.intervalTimeObj),
                        t.intervalTimeObj = null,
                        t.isReconnect && t.reconnect())
                    }
                    ), t.intervalTime))
                },
                onopen: function() {
                    this.webSocket && 1 == this.webSocket.readyState && (this.reconnectInterval = 1e3,
                    this.webSocket.send("ping"),
                    this.webSocketType = 1),
                    this.start()
                },
                onmessage: function(t) {
                    var e = this
                      , a = JSON.parse(t.data);
                    switch (console.log("scoketData", a),
                    a.sendType) {
                    case 1:
                        clearTimeout(this.timeoutObj),
                        this.sockeDataType = t.currentTarget.readyState;
                        break;
                    case 2:
                        if (1 == a.sendInfo.isSend)
                            if (a.sendInfo.isAi)
                                this.$store.dispatch("newChat/SET_SOCKET_DATA", a);
                            else {
                                var s = this.$store.state.newChat.chatLogList;
                                s.forEach((function(t, s) {
                                    t.id == a.sendInfo.id && (t.messageId = a.sendInfo.messageId,
                                    t.msgStatus = a.sendInfo.msgStatus,
                                    t.isQuoted = a.sendInfo.isQuoted,
                                    e.$set(t, "error", a.sendInfo.error),
                                    e.$set(t, "retryCount", a.sendInfo.retryCount),
                                    t.isSendType = 2)
                                }
                                )),
                                this.$store.dispatch("newChat/userListScoketData", a)
                            }
                        else
                            this.$store.dispatch("newChat/SET_SOCKET_DATA", a);
                        break;
                    case 102:
                        if (1 == a.groupSendVo.isSend) {
                            var i = this.$store.state.newChat.chatLogList;
                            i.forEach((function(t, s) {
                                t.messageId == a.groupSendVo.messageId && (a.groupSendVo.currUessageId && (t.messageId = a.groupSendVo.currUessageId),
                                a.groupSendVo.msgStatus > t.msgStatus && e.$set(t, "msgStatus", a.groupSendVo.msgStatus),
                                t.isQuoted = a.groupSendVo.isQuoted,
                                t.error = a.groupSendVo.error,
                                t.retryCount = a.groupSendVo.retryCount,
                                t.isSendType = 2)
                            }
                            )),
                            this.$store.dispatch("newChat/userListScoketData", a)
                        } else
                            this.$store.dispatch("newChat/SET_SOCKET_DATA", a);
                        break;
                    case 5:
                        this.$store.dispatch("newChat/setLoginStatus", a);
                        break;
                    case 6:
                        var n = this.$store.state.newChat.chatLogList;
                        n.forEach((function(t, s) {
                            t.messageId == a.sendInfo.messageId && a.sendInfo.msgStatus > t.msgStatus && e.$set(t, "msgStatus", a.sendInfo.msgStatus)
                        }
                        ));
                        break;
                    case 106:
                        var o = this.$store.state.newChat.chatLogList;
                        o.forEach((function(t, s) {
                            t.messageId == a.groupSendVo.messageId && a.groupSendVo.msgStatus > t.msgStatus && e.$set(t, "msgStatus", a.groupSendVo.msgStatus)
                        }
                        ));
                        break;
                    case 7:
                        var r = this.$store.state.newChat.chatLogList;
                        r.forEach((function(t, s) {
                            t.messageId == a.sendInfo.messageId && a.sendInfo.msgStatus > t.msgStatus && e.$set(t, "msgStatus", a.sendInfo.msgStatus)
                        }
                        ));
                        break;
                    case 107:
                        var c = this.$store.state.newChat.chatLogList;
                        c.forEach((function(t, s) {
                            t.messageId == a.groupSendVo.messageId && a.groupSendVo.msgStatus > t.msgStatus && e.$set(t, "msgStatus", a.groupSendVo.msgStatus)
                        }
                        ));
                        break;
                    case 10:
                        var l = this.$store.state.newChat.chatLogList;
                        l.forEach((function(t, e) {
                            t.id == a.sendInfo.id && (t.messageId = a.sendInfo.messageId,
                            t.msgStatus = -3,
                            t.isQuoted = a.sendInfo.isQuoted,
                            t.isSendType = 2)
                        }
                        ));
                        break;
                    case 11:
                        this.$store.dispatch("newChat/userListScoketData", a);
                        break;
                    case 99:
                        u["EventBus"].$emit("sealedAccount", a);
                        break;
                    case 20:
                        this.$store.dispatch("newChat/SET_SOCKET_DATA", a);
                        break
                    }
                },
                ping: function() {
                    this.webSocket && 1 == this.webSocket.readyState && this.webSocket.send("ping")
                },
                onerror: function(t) {
                    this.webSocketType = 3,
                    console.error("出现错误", t),
                    this.isReconnect && this.reconnect()
                },
                onclose: function(t) {
                    console.log("连接关闭", t),
                    clearTimeout(this.timeoutObj),
                    clearInterval(this.intervalTimeObj),
                    this.intervalTimeObj = null,
                    this.webSocketType = 3,
                    this.isReconnect && this.reconnect()
                }
            },
            beforeDestroy: function() {
                this.isReconnect = !1,
                this.closeWebSocket()
            }
        })
          , V = a("7d60")
          , R = a("b81b")
          , P = a("ed08")
          , Q = {
            mixins: [z],
            components: {
                Audio: d["default"],
                Video: h["default"],
                Content: m["default"],
                LogImage: p["default"],
                BusinessCard: g["default"],
                Expression: f["default"],
                LogLink: b["default"],
                LogFile: v["default"],
                MeterialLibrary: w["default"],
                Translate: L["default"],
                Emoji: y["a"],
                Map: C["default"],
                SuperLink: x["default"],
                BottomLoading: E["a"],
                ImageLink: $["default"],
                TextImageTemplate: T["default"],
                GroupDetailsDrawer: V["default"],
                GroupMemberDialog: R["default"]
            },
            data: function() {
                var t;
                return t = {
                    chatLoading: !1,
                    userLogList: [],
                    pageSize: 10,
                    page: 1,
                    total: 0,
                    canLoading: !1,
                    textareaValue: "",
                    contenteditableEmpty: !0,
                    isBlackTechnologyNews: !1,
                    isTop: !1,
                    MTdialogVisible: !1,
                    callModeDialogVisible: !1,
                    callMaterialSelectMode: !1,
                    callModeForm: {
                        mode: "default",
                        callSeconds: null,
                        smId: null,
                        smform: null
                    },
                    translateDialogVisible: !1,
                    canTranslateTime: !1,
                    canTranslateTimeNum: 5,
                    translateData: {
                        sourceText: "",
                        sourceLang: "auto",
                        targetLang: ""
                    },
                    translateLoading: !1,
                    targetLanguageVal: "",
                    fanyiCount: 0,
                    editDialogVisible: !1,
                    editUserLoading: !1,
                    editUserForm: {
                        name: "",
                        remarkName: "",
                        country: "",
                        labelIds: "",
                        labelIdsArr: [],
                        remark: ""
                    },
                    labelOptions: [],
                    labelOptionsLoading: !1,
                    addTagVisible: !1,
                    tagForm: {
                        labelName: ""
                    },
                    tagRule: {},
                    sendAutoTranslate: !1,
                    accountUsernameData: null,
                    isAutoReceive: !1,
                    fileAction: "/prod-api" + M.a.get("line") + "/biz/chat/files",
                    headers: {
                        Authorization: "Bearer " + Object(k["b"])()
                    },
                    contactDialogVisible: !1,
                    contactForm: {
                        displayName: "",
                        phone: ""
                    },
                    contactRules: {}
                },
                Object(l["a"])(t, "translateData", {}),
                Object(l["a"])(t, "mapDialogVisible", !1),
                Object(l["a"])(t, "center", {
                    lat: 45.508,
                    lng: -73.587
                }),
                Object(l["a"])(t, "searchMapInput", ""),
                Object(l["a"])(t, "autocompleteService", null),
                Object(l["a"])(t, "quoteData", {}),
                Object(l["a"])(t, "mentionPopupVisible", !1),
                Object(l["a"])(t, "mentionKeyword", ""),
                Object(l["a"])(t, "mentionedMemberIdList", []),
                Object(l["a"])(t, "mentionedMemberDataList", []),
                Object(l["a"])(t, "groupMemberPopupPosition", {
                    top: 0,
                    left: 0
                }),
                Object(l["a"])(t, "mapDialogLoading", !1),
                Object(l["a"])(t, "fullLoading", null),
                Object(l["a"])(t, "butLoading", !1),
                Object(l["a"])(t, "botButShow", !1),
                Object(l["a"])(t, "senFileVisible", !1),
                Object(l["a"])(t, "senFileUrl", ""),
                Object(l["a"])(t, "sendFileText", ""),
                Object(l["a"])(t, "isTrans", 0),
                Object(l["a"])(t, "pasteFile", {
                    name: "",
                    size: 0
                }),
                Object(l["a"])(t, "senFileType", ""),
                Object(l["a"])(t, "boxHeight", 250),
                Object(l["a"])(t, "addType", ""),
                Object(l["a"])(t, "followRecordsActivities", []),
                Object(l["a"])(t, "followsUpRrecordsLoading", !1),
                Object(l["a"])(t, "groupMemberListDrawer", !1),
                Object(l["a"])(t, "groupMemberOpenTime", ""),
                Object(l["a"])(t, "infiniteDisabled", !1),
                Object(l["a"])(t, "loadingIconShow", !0),
                Object(l["a"])(t, "listLoading", !1),
                Object(l["a"])(t, "groupMemberPage", 1),
                Object(l["a"])(t, "groupMemberPageSize", 10),
                Object(l["a"])(t, "groupMemberTotal", 0),
                Object(l["a"])(t, "groupMemberListData", []),
                Object(l["a"])(t, "myGroupIdentity", 2),
                Object(l["a"])(t, "channel", 0),
                Object(l["a"])(t, "isSpecialChannel", 0),
                Object(l["a"])(t, "exportChatHistoryLoading", !1),
                Object(l["a"])(t, "scheduledTaskCount", 0),
                Object(l["a"])(t, "scheduledListVisible", !1),
                Object(l["a"])(t, "scheduledListRows", []),
                Object(l["a"])(t, "scheduledListLoading", !1),
                Object(l["a"])(t, "scheduledListPage", 1),
                Object(l["a"])(t, "scheduledListPageSize", 10),
                Object(l["a"])(t, "scheduledListTotal", 0),
                Object(l["a"])(t, "scheduledListSelection", []),
                Object(l["a"])(t, "scheduleSendDialogVisible", !1),
                Object(l["a"])(t, "scheduleSendType", "text"),
                Object(l["a"])(t, "scheduleTextContent", ""),
                Object(l["a"])(t, "scheduleDateTime", null),
                Object(l["a"])(t, "scheduleMaterialItem", null),
                Object(l["a"])(t, "scheduledMaterialPickMode", !1),
                Object(l["a"])(t, "scheduleSubmitLoading", !1),
                Object(l["a"])(t, "schedulePickerOptions", {
                    disabledDate: function(t) {
                        return t.getTime() < Date.now() - 864e5 || t.getTime() > Date.now() + 6048e5
                    }
                }),
                Object(l["a"])(t, "dialogKeyHandler", null),
                Object(l["a"])(t, "dialogSendInProgress", !1),
                Object(l["a"])(t, "isDeleteMessage", !1),
                Object(l["a"])(t, "emojiList", ["😀", "😄", "😁", "😆", "😅", "😂", "🙂", "🙃", "😉", "😊", "😇", "😍", "🥰", "😘", "😗", "😋", "😛", "🤠", "😷", "😝", "😎", "🥳", "😣", "😭", "😠", "😱", "😥", "😵", "🤢", "🤑", "🤧", "💫", "❤", "💔", "💘", "💯", "💢", "💥", "💤", "👋", "👌", "✌", "🤙", "🤟", "☝", "👇", "👈", "👉", "👍", "✊", "👏", "🤝", "🙏", "👄", "👃", "🦵", "👦", "👧", "👶", "🧒", "👨", "👩", "👴", "👵", "🧑‍🎓", "🧑‍🏫", "🧑‍⚖️", "🧑‍🌾", "🐷", "🐵", "🐶", "🐱", "🐭", "🐻", "🐼", "🐔", "🐸", "🌹", "🥀", "🍉", "🍊", "🍎", "🥭", "🍒", "🍓", "🍇", "🍌", "🥚", "💍", "🕶", "💰", "🔒", "🔓"]),
                Object(l["a"])(t, "lastSelection", null),
                Object(l["a"])(t, "readStatusDialogVisible", !1),
                Object(l["a"])(t, "readStatusLoading", !1),
                Object(l["a"])(t, "readStatusList", []),
                t
            },
            computed: {
                accountUsername: function() {
                    return this.$store.state.newChat.accountUserNameData
                },
                fun: function() {
                    return function(t) {
                        return Number(t / 1e4).toFixed(1) + "w"
                    }
                },
                translateSettingData: function() {
                    return this.$store.state.newChat.translateSettingData
                },
                socketData: function() {
                    return this.$store.state.newChat.socketData
                },
                hasAvatar: function() {
                    return function(t) {
                        return Object.hasOwn(t, "avatarUrl") && t.avatarUrl ? t.avatarUrl : a("4d41")
                    }
                },
                myUserName: function() {
                    return this.$store.state.newChat.chatUserNameData
                },
                google: function() {
                    return Object(O["gmapApi"])()
                },
                quoteDataCom: function() {
                    return this.$store.state.newChat.quoteData
                },
                quoteType: function() {
                    var t = this;
                    return function(e) {
                        if (1 == e.chatType)
                            return e.chatContent;
                        switch (e.sType) {
                        case 1:
                            return t.$t("newchat.chatwindow.image");
                        case 2:
                            return t.$t("newchat.chatwindow.file");
                        case 3:
                            return t.$t("newchat.chatwindow.video");
                        case 4:
                            return t.$t("newchat.chatwindow.audio");
                        case 5:
                            return t.$t("newchat.chatwindow.expression");
                        case 7:
                            return t.$t("newchat.chatwindow.businessCard");
                        case 8:
                            return t.$t("newchat.chatwindow.expression");
                        case 9:
                            return console.log("item", e),
                            t.$t("newchat.chatwindow.link");
                        case 11:
                            return "[".concat(t.$t("newchat.chatwindow.forwardSuperLink"), "]");
                        case 12:
                            return "[".concat(t.$t("newchat.chatwindow.imageLink"), "]");
                        case 13:
                            return "[".concat(t.$t("newchat.chatwindow.textImageTemplate"), "]");
                        default:
                            return e.chatContent
                        }
                    }
                },
                setBlock: function() {
                    return this.$store.state.newChat.setBlock
                },
                addTypeStr: function() {
                    switch (this.addType) {
                    case 0:
                        return this.$t("fanList.newMessageAddition");
                    case 1:
                        return this.$t("fanList.fansGroupSending");
                    case 2:
                        return this.$t("fanList.import");
                    case 3:
                        return this.$t("fanList.pull");
                    case 4:
                        return this.$t("fanList.addfan");
                    default:
                        return ""
                    }
                },
                fileTypeStr: function() {
                    switch (this.senFileType) {
                    case "mp4":
                        return "视频";
                    case "jpg":
                        return "图片";
                    case "png":
                        return "图片";
                    case "jpeg":
                        return "图片";
                    case "mp3":
                        return "语音";
                    case "ogg":
                        return "语音";
                    case "wav":
                        return "语音";
                    default:
                        return "文件"
                    }
                },
                pasteFileSizeString: function() {
                    return this.pasteFile.size < 1e6 ? (this.pasteFile.size / 1e3).toFixed(0) + " KB" : (this.pasteFile.size / 1e3 / 1e3).toFixed(2) + " MB"
                },
                senderTimestamp: function() {
                    var t = this;
                    return function(e) {
                        var a = t.$store.state.newChat.timeArea
                          , s = B.a.tz(e.sendTimeStr ? e.sendTimeStr : e.sendTime, "YYYY-MM-DD HH:mm:ss", "Asia/Shanghai").format()
                          , i = B.a.utc(s).tz("asia/shanghai").format();
                        return B.a.utc(i).tz(a).format("MM-DD HH:mm:ss")
                    }
                },
                logName: function() {
                    var t = this;
                    return function(e) {
                        return 1 == e.isSend ? t.accountUsername.groupId ? t.myUserName.login : t.accountUsername.login : 0 == e.isSend ? t.accountUsername.groupId ? e.notify ? "".concat(e.notify, "(").concat(e.username, ")") : e.username : t.accountUsername.remarkName ? "".concat(t.accountUsername.remarkName, "(").concat(t.accountUsername.username, ")") : t.accountUsername.username : void 0
                    }
                },
                showKickOut: function() {
                    var t = this;
                    return function(e) {
                        return t.myUserName.login != e.username && (0 == t.myGroupIdentity || 1 == t.myGroupIdentity && 2 == e.groupIdentity)
                    }
                },
                showSetAdmin: function() {
                    var t = this;
                    return function(e) {
                        return t.myUserName.login != e.username && (0 == t.myGroupIdentity && 2 == e.groupIdentity)
                    }
                },
                messageError: function() {
                    var t = this;
                    return function(e) {
                        switch (e) {
                        case "463":
                            return t.$t("newchat.chatwindow.messageError463");
                        case "888":
                            return t.$t("newchat.chatwindow.messageError888");
                        case "999":
                            return t.$t("newchat.chatwindow.messageError999");
                        default:
                            return t.$t("newchat.chatwindow.messageError") + e
                        }
                    }
                },
                deleteMessageCount: function() {
                    return this.userLogList ? this.userLogList.filter((function(t) {
                        return t.isChecked
                    }
                    )).length : 0
                },
                canDelete: function() {
                    return function(t) {
                        if (-4 == t.msgStatus)
                            return !0;
                        var e = B()(t.sendTimeStr).unix()
                          , a = B()().unix();
                        return a - e > 172800
                    }
                }
            },
            watch: {
                translateSettingData: function(t) {
                    this.translateData = t,
                    t.send ? this.sendAutoTranslate = !0 : this.sendAutoTranslate = !1,
                    t.isAutoReceive ? this.isAutoReceive = !0 : this.isAutoReceive = !1
                },
                socketData: function(t) {
                    var e = this;
                    if (2 == t.sendType) {
                        var a = t.sendInfo;
                        if (!a)
                            return;
                        if (a.csUsername == this.accountUsername.csUsername && a.username == this.accountUsername.username) {
                            var s = this.userLogList.some((function(t) {
                                return t.messageId == a.messageId
                            }
                            ));
                            if (s)
                                return;
                            if (1 == a.chatType)
                                a.sendTime = B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                                a.isQuoted = 1,
                                this.userLogList.push(a),
                                this.total++;
                            else if (6 == a.chatType)
                                a.sendTime = B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                                a.isQuoted = 1,
                                this.userLogList.push(a),
                                this.total++;
                            else {
                                var i = {
                                    avatarUrl: this.hasAvatar(a),
                                    id: a.id,
                                    timeStr: B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                                    sendTime: B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                                    chatType: a.chatType,
                                    chatLogId: a.chatLogId,
                                    chatContent: a.chatContent,
                                    chatVideo: a.chatVideo,
                                    csUsername: a.csUsername,
                                    username: a.username,
                                    isSend: 0,
                                    caption: a.sms.caption,
                                    fileUrl: a.sms.file ? a.sms.file.accessUri : null,
                                    thumbnail: a.sms.file ? a.sms.file.thumbnail : null,
                                    fileName: a.sms.file ? a.sms.file.fileName : null,
                                    height: a.sms.height,
                                    width: a.sms.width,
                                    seconds: a.sms.seconds,
                                    sType: a.sms.file ? parseInt(a.sms.file.fileType) : a.sms.type,
                                    displayName: a.sms.displayName,
                                    smId: a.sms.id,
                                    title: a.sms.title,
                                    text: a.sms.text,
                                    matchedText: a.sms.matchedText,
                                    description: a.sms.description,
                                    notify: a.sms.notify,
                                    latitude: a.sms.degreesLatitude,
                                    longitude: a.sms.degreesLongitude,
                                    addressName: a.sms.addressName,
                                    address: a.sms.address,
                                    isQuoted: 1,
                                    messageId: a.messageId
                                };
                                this.userLogList.push(i),
                                this.total++
                            }
                            Object(S["Eb"])(a.id).then((function(t) {
                                e.$store.commit("newChat/custormStatus", !e.$store.state.newChat.custormStatus)
                            }
                            ))
                        } else {
                            if (1 === a.isSend)
                                return;
                            var n = this.$store.state.newChat.noReadNum;
                            this.$store.dispatch("newChat/setNoReadNum", n + 1)
                        }
                    } else if (102 == t.sendType) {
                        var o = t.groupSendVo;
                        if (!o)
                            return;
                        if (o.groupId == this.accountUsername.groupId && o.csUsernameStr == this.myUserName.username) {
                            var r = this.userLogList.some((function(t) {
                                return t.messageId == o.messageId
                            }
                            ));
                            if (r)
                                return;
                            if (1 == o.chatType)
                                o.sendTime = B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                                o.isQuoted = 1,
                                o.csUsername = o.csUsernameStr,
                                o.isChecked = !1,
                                this.userLogList.push(o),
                                this.total++;
                            else if (6 == o.chatType)
                                o.sendTime = B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                                o.isQuoted = 1,
                                o.csUsername = o.csUsernameStr,
                                o.isChecked = !1,
                                this.userLogList.push(o),
                                this.total++;
                            else {
                                var c = {
                                    avatarUrl: this.hasAvatar(o),
                                    id: o.id,
                                    timeStr: B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                                    sendTime: B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                                    chatType: o.chatType,
                                    chatLogId: o.chatLogId,
                                    groupCode: o.groupCode,
                                    chatContent: o.chatContent,
                                    csUsername: o.csUsernameStr,
                                    username: o.username,
                                    isSend: 0,
                                    caption: o.sms.caption,
                                    fileUrl: o.sms.file ? o.sms.file.accessUri : null,
                                    thumbnail: o.sms.file ? o.sms.file.thumbnail : null,
                                    fileName: o.sms.file ? o.sms.file.fileName : null,
                                    height: o.sms.height,
                                    width: o.sms.width,
                                    seconds: o.sms.seconds,
                                    sType: o.sms.file ? parseInt(o.sms.file.fileType) : o.sms.type,
                                    displayName: o.sms.displayName,
                                    smId: o.sms.id,
                                    title: o.sms.title,
                                    text: o.sms.text,
                                    matchedText: o.sms.matchedText,
                                    description: o.sms.description,
                                    notify: o.sms.notify,
                                    latitude: o.sms.degreesLatitude,
                                    longitude: o.sms.degreesLongitude,
                                    addressName: o.sms.addressName,
                                    address: o.sms.address,
                                    isQuoted: 1,
                                    messageId: o.messageId,
                                    groupId: o.groupId,
                                    isChargeWs: o.isChargeWs,
                                    isChecked: !1,
                                    chatExtensionContent: o.chatExtensionContent
                                };
                                this.userLogList.push(c),
                                this.total++
                            }
                            Object(S["Db"])(o.accountChatLogId).then((function(t) {
                                e.$store.commit("newChat/custormStatus", !e.$store.state.newChat.custormStatus)
                            }
                            ))
                        }
                    } else if (20 == t.sendType) {
                        var l = t.sendInfo || t.groupSendVo;
                        if (!l)
                            return;
                        if (l.groupId) {
                            if (l.groupId != this.accountUsername.groupId)
                                return
                        } else if (l.csUsername != this.accountUsername.csUsername && l.username != this.accountUsername.username)
                            return;
                        var u = this.userLogList.find((function(t) {
                            return t.messageId == l.messageId
                        }
                        ));
                        if (u)
                            if (u.reactionMessageList && u.reactionMessageList.length > 0) {
                                var d = u.reactionMessageList.findIndex((function(t) {
                                    return t.sendWsLoginNumber == l.chatReactionMessage.sendWsLoginNumber
                                }
                                ));
                                -1 != d ? l.chatReactionMessage.content ? u.reactionMessageList[d].content = l.chatReactionMessage.content : u.reactionMessageList.splice(d, 1) : l.chatReactionMessage.content && u.reactionMessageList.push(l.chatReactionMessage)
                            } else
                                l.chatReactionMessage.content && this.$set(u, "reactionMessageList", [l.chatReactionMessage])
                    }
                },
                quoteDataCom: function(t) {
                    this.quoteData = t
                },
                google: function(t) {
                    var e = this;
                    return Object(c["a"])(Object(r["a"])().mark((function a() {
                        var s, i;
                        return Object(r["a"])().wrap((function(a) {
                            while (1)
                                switch (a.prev = a.next) {
                                case 0:
                                    if (!t) {
                                        a.next = 8;
                                        break
                                    }
                                    return a.next = 3,
                                    e.google.maps.importLibrary("places");
                                case 3:
                                    s = a.sent,
                                    i = s.AutocompleteService,
                                    e.autocompleteService = new i,
                                    e.mapDialogLoading = !1,
                                    e.geolocate();
                                case 8:
                                case "end":
                                    return a.stop()
                                }
                        }
                        ), a)
                    }
                    )))()
                },
                setBlock: function(t) {
                    this.accountUsernameData.username == t.username && this.accountUsernameData.csUsername == t.csUsername && (this.accountUsernameData.isBlock = t.isBlock)
                },
                textareaValue: {
                    handler: function(t) {
                        if (this.accountUsernameData && (this.accountUsernameData.id || this.accountUsernameData.chatId)) {
                            var e = this.accountUsernameData.id || this.accountUsernameData.chatId;
                            this.isDraftContentEmpty(t) ? this.$store.dispatch("newChat/clearDraft", e) : this.$store.dispatch("newChat/saveDraft", {
                                sessionId: e,
                                content: t
                            })
                        }
                    },
                    deep: !0
                },
                "accountUsernameData.id": {
                    handler: function(t) {
                        var e = this;
                        if (this.mentionPopupVisible = !1,
                        t) {
                            var a = this.$store.state.newChat.draftMessages[t];
                            this.textareaValue = a || ""
                        }
                        this.$nextTick((function() {
                            e.syncDraftToContenteditable(),
                            e.restoreMentionFromDraftHtml()
                        }
                        ))
                    },
                    immediate: !0
                },
                "accountUsernameData.chatId": {
                    handler: function(t) {
                        var e = this;
                        if (this.mentionPopupVisible = !1,
                        t) {
                            var a = this.$store.state.newChat.draftMessages[t];
                            this.textareaValue = a || ""
                        }
                        this.$nextTick((function() {
                            e.syncDraftToContenteditable(),
                            e.restoreMentionFromDraftHtml()
                        }
                        ))
                    },
                    immediate: !0
                }
            },
            mounted: function() {
                var t = this
                  , e = this;
                this.$refs.log_inbox.addEventListener("scroll", (function(t) {
                    0 == t.target.scrollTop && e.scrollToTop()
                }
                )),
                this.getFanyiCount(),
                this.$nextTick((function() {
                    t.scrollToBottom()
                }
                )),
                u["EventBus"].$on("getChatLog", function() {
                    var e = Object(c["a"])(Object(r["a"])().mark((function e(a) {
                        var s;
                        return Object(r["a"])().wrap((function(e) {
                            while (1)
                                switch (e.prev = e.next) {
                                case 0:
                                    if ("accountList" != a.activeName) {
                                        e.next = 11;
                                        break
                                    }
                                    t.canLoading = !1,
                                    t.userLogList = [],
                                    t.accountUsernameData = a.itemData,
                                    t.page = 1,
                                    t.pageSize = 10,
                                    t.$store.dispatch("newChat/setQuoteData", {}),
                                    t.chatLoading = !0,
                                    t.getChatLogList(),
                                    e.next = 43;
                                    break;
                                case 11:
                                    if ("addressBook" != a.activeName) {
                                        e.next = 23;
                                        break
                                    }
                                    t.canLoading = !1,
                                    t.userLogList = [],
                                    t.accountUsernameData = a.itemData,
                                    t.page = 1,
                                    t.pageSize = 10,
                                    t.$store.dispatch("newChat/setQuoteData", {}),
                                    s = {
                                        csUsername: a.itemData.csUsername,
                                        username: a.itemData.username
                                    },
                                    t.chatLoading = !0,
                                    Object(S["G"])(s).then((function(e) {
                                        t.accountUsernameData = e.chatUser,
                                        t.getChatLogList()
                                    }
                                    )).catch((function(e) {
                                        t.chatLoading = !1
                                    }
                                    )),
                                    e.next = 43;
                                    break;
                                case 23:
                                    if ("groupChat" != a.activeName) {
                                        e.next = 43;
                                        break
                                    }
                                    return t.canLoading = !1,
                                    t.isDeleteMessage = !1,
                                    t.userLogList = [],
                                    t.mentionedMemberIdList = [],
                                    t.mentionedMemberDataList = [],
                                    t.accountUsernameData = a.itemData,
                                    t.page = 1,
                                    t.pageSize = 10,
                                    t.$store.dispatch("newChat/setQuoteData", {}),
                                    t.chatLoading = !0,
                                    e.prev = 34,
                                    e.next = 37,
                                    t.getGroupInfo();
                                case 37:
                                    t.getGroupLogList(),
                                    e.next = 43;
                                    break;
                                case 40:
                                    e.prev = 40,
                                    e.t0 = e["catch"](34),
                                    t.chatLoading = !1;
                                case 43:
                                case "end":
                                    return e.stop()
                                }
                        }
                        ), e, null, [[34, 40]])
                    }
                    )));
                    return function(t) {
                        return e.apply(this, arguments)
                    }
                }()),
                u["EventBus"].$on("sendQRText", this.sendQRText),
                u["EventBus"].$on("sendMeterial", this.sendMeterial),
                this.getTaskPermi()
            },
            methods: {
                getChatLogList: function() {
                    var t = this;
                    this.chatLoading = !0;
                    var e = {
                        pageNum: this.page,
                        pageSize: this.pageSize,
                        csUsername: this.accountUsernameData.csUsername,
                        username: this.accountUsernameData.username,
                        remarkName: this.accountUsernameData.remarkName,
                        chatUserId: this.accountUsernameData.id,
                        isCs: 1
                    };
                    this.accountUsernameData.csUsername && this.accountUsernameData.username ? Object(S["i"])(e).then((function(a) {
                        if (t.accountUsernameData.username == e.username) {
                            t.total = a.total,
                            a.rows.forEach((function(t, e) {
                                t.sendTime = Object(_["f"])(t.sendTime, "{y}-{m}-{d} {h}:{i}:{s}")
                            }
                            )),
                            t.userLogList = a.rows;
                            var s = {
                                id: t.accountUsernameData.id,
                                csUsername: t.accountUsernameData.csUsername,
                                username: t.accountUsernameData.username
                            };
                            Object(S["J"])(s).then((function(e) {
                                t.addType = e.chatInfo.addType,
                                t.chatLoading = !1
                            }
                            )).catch((function(e) {
                                t.chatLoading = !1
                            }
                            )),
                            t.loadScheduledTaskSummary(),
                            t.$store.dispatch("newChat/SET_CHAT_LOG_LIST", t.userLogList),
                            t.userLogList.length < a.total ? t.canLoading = !0 : t.canLoading = !1,
                            1 == t.page && t.$nextTick((function() {
                                t.scrollToBottom()
                            }
                            )),
                            t.$nextTick((function() {
                                t.$refs.textareaInput.focus()
                            }
                            ))
                        }
                    }
                    )).catch((function(e) {
                        t.chatLoading = !1
                    }
                    )) : this.chatLoading = !1
                },
                getGroupLogList: function() {
                    var t = this;
                    this.scheduledTaskCount = 0,
                    this.chatLoading = !0;
                    var e = {
                        pageNum: this.page,
                        pageSize: this.pageSize,
                        chatId: this.accountUsernameData.chatId,
                        readCount: this.accountUsernameData.readCount
                    };
                    this.accountUsernameData.readCount = 0,
                    this.myUserName.groupReadCount -= e.readCount,
                    Object(S["P"])(e).then((function(a) {
                        t.accountUsernameData.chatId == e.chatId && (t.total = a.total,
                        a.rows.forEach((function(t, e) {
                            t.sendTime = Object(_["f"])(t.sendTime, "{y}-{m}-{d} {h}:{i}:{s}"),
                            t.isChecked = !1
                        }
                        )),
                        t.userLogList = a.rows,
                        t.chatLoading = !1,
                        t.$store.dispatch("newChat/SET_CHAT_LOG_LIST", t.userLogList),
                        t.userLogList.length < a.total ? t.canLoading = !0 : t.canLoading = !1,
                        1 == t.page && t.$nextTick((function() {
                            t.scrollToBottom()
                        }
                        )),
                        t.$nextTick((function() {
                            t.$refs.textareaInput.focus()
                        }
                        )))
                    }
                    )).catch((function(e) {
                        t.chatLoading = !1
                    }
                    ))
                },
                getGroupInfo: function() {
                    var t = this
                      , e = {
                        chatId: this.accountUsernameData.chatId,
                        username: this.myUserName.username
                    };
                    return Object(S["O"])(e).then((function(e) {
                        t.accountUsernameData.chatId == e.info.chatId && (t.accountUsernameData.avatarUrl = e.info.avatarUrl,
                        t.accountUsername.announcement = e.info.announcement,
                        t.accountUsername.groupIdentity = e.info.groupIdentity,
                        t.accountUsername.memberCount = e.info.memberCount,
                        t.accountUsername.description = e.info.description,
                        t.accountUsername.isEphemeral = e.info.isEphemeral,
                        t.accountUsername.groupLink = e.info.groupLink,
                        t.accountUsername.groupLinkGetStatus = e.info.groupLinkGetStatus,
                        t.myGroupIdentity = e.info.groupIdentity)
                    }
                    )).catch((function(t) {
                        console.log(t)
                    }
                    ))
                },
                writeIn: function(t) {
                    this.$refs.textareaInput.innerHTML += t,
                    this.contenteditableEmpty = !1,
                    this.textareaValue = this.$refs.textareaInput.innerHTML
                },
                scrollToBottom: function() {
                    var t = this;
                    this.$nextTick((function() {
                        t.$refs.log_inbox.scrollTop = t.$refs.log_inbox.scrollHeight
                    }
                    ))
                },
                scrollToTop: function() {
                    var t = this;
                    if (this.canLoading) {
                        this.canLoading = !1;
                        var e = this;
                        this.isTop = !0,
                        this.page += 1;
                        var a = e.$refs.log_inbox.scrollHeight;
                        if (this.accountUsernameData.username) {
                            var s = {
                                pageNum: this.page,
                                pageSize: this.pageSize,
                                csUsername: this.accountUsernameData.csUsername,
                                username: this.accountUsernameData.username,
                                remarkName: this.accountUsernameData.remarkName,
                                chatUserId: this.accountUsernameData.id,
                                isCs: 1
                            };
                            Object(S["i"])(s).then((function(s) {
                                var i, n = [];
                                if (s.rows.forEach((function(t, a) {
                                    var s = !1;
                                    e.userLogList.forEach((function(e, a) {
                                        t.id == e.id && (s = !0)
                                    }
                                    )),
                                    s || n.push(t)
                                }
                                )),
                                0 == n.length)
                                    return t.canLoading = !0,
                                    void t.scrollToTop();
                                (i = t.userLogList).unshift.apply(i, n),
                                t.$nextTick((function() {
                                    this.$refs.log_inbox.scrollTop = this.$refs.log_inbox.scrollHeight - a
                                }
                                )),
                                t.isTop = !1,
                                t.total = s.total,
                                t.userLogList.length < s.total ? t.canLoading = !0 : t.canLoading = !1
                            }
                            )).catch((function(e) {
                                t.isTop = !1
                            }
                            ))
                        } else if (this.accountUsernameData.groupId) {
                            var i = {
                                pageNum: this.page,
                                pageSize: this.pageSize,
                                chatId: this.accountUsernameData.chatId,
                                readCount: this.accountUsernameData.readCount
                            };
                            Object(S["P"])(i).then((function(s) {
                                var i, n = [];
                                if (s.rows.forEach((function(t, a) {
                                    t.isChecked = !1;
                                    var s = !1;
                                    e.userLogList.forEach((function(e, a) {
                                        t.messageId == e.messageId && (s = !0)
                                    }
                                    )),
                                    s || n.push(t)
                                }
                                )),
                                0 == n.length)
                                    return t.canLoading = !0,
                                    void t.scrollToTop();
                                (i = t.userLogList).unshift.apply(i, n),
                                t.$nextTick((function() {
                                    this.$refs.log_inbox.scrollTop = this.$refs.log_inbox.scrollHeight - a
                                }
                                )),
                                t.isTop = !1,
                                t.total = s.total,
                                t.userLogList.length < s.total ? t.canLoading = !0 : t.canLoading = !1
                            }
                            )).catch((function(e) {
                                t.chatLoading = !1
                            }
                            ))
                        }
                    }
                },
                contentSubmit: function(t) {
                    var e = this;
                    t.preventDefault();
                    var a = this
                      , s = this.$refs.textareaInput
                      , i = s.innerText || s.textContent || "";
                    if (i.trim() && this.accountUsernameData)
                        if (1 != this.accountUsernameData.announcement || 2 != this.accountUsernameData.groupIdentity)
                            if (1 != this.accountUsernameData.status) {
                                if (1 != this.accountUsernameData.isBlock) {
                                    var n = {
                                        csId: this.$store.state.user.userId,
                                        createId: this.$store.state.user.userId,
                                        csChatUserId: this.accountUsernameData.id,
                                        isSend: 1,
                                        isRead: 0,
                                        chatContent: i.trim(),
                                        timeStr: B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                                        sendTime: B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                                        csUsername: this.accountUsernameData.csUsername,
                                        username: this.accountUsernameData.username,
                                        login: this.accountUsernameData.login,
                                        isSendType: 1,
                                        chatIndex: this.userLogList.length,
                                        chatType: 1,
                                        isCharge: 0,
                                        isFakePkmsg: this.isBlackTechnologyNews ? 1 : 0,
                                        isChargeWs: this.accountUsernameData.groupId ? 1 : 0
                                    };
                                    this.isBlackTechnologyNews && (n.notify = "[黑科技消息]");
                                    var o = {
                                        csId: this.$store.state.user.userId,
                                        chatContent: i.trim(),
                                        csUsername: this.accountUsernameData.csUsername,
                                        username: this.accountUsernameData.username,
                                        isSend: 1,
                                        isRead: 1,
                                        chatIndex: this.userLogList.length,
                                        chatType: 1,
                                        csChatUserId: this.accountUsernameData.id,
                                        isFakePkmsg: this.isBlackTechnologyNews ? 1 : 0
                                    };
                                    if ("{}" !== JSON.stringify(this.quoteData) && (1 == this.quoteData.isSend ? n.quotedUsername = this.quoteData.csUsername : n.quotedUsername = this.quoteData.username,
                                    o.quotedId = this.accountUsernameData.groupId ? this.quoteData.chatLogId : this.quoteData.id,
                                    o.quotedName = this.quoteData.notify,
                                    o.quotedContent = this.quoteType(this.quoteData),
                                    n.quotedId = this.accountUsernameData.groupId ? this.quoteData.chatLogId : this.quoteData.id,
                                    n.quotedName = this.quoteData.notify,
                                    n.quotedContent = this.quoteType(this.quoteData),
                                    n.quotedMessageId = this.quoteData.messageId,
                                    n.isQuoted = 0),
                                    i.trim()) {
                                        this.userLogList.push(n),
                                        this.total++;
                                        var r = i;
                                        this.accountUsername.username ? Object(S["sb"])(o).then((function(t) {
                                            e.sendAutoTranslate && (n.chatVideo = r),
                                            n.id = t.id,
                                            n.isSendType = 2,
                                            e.$set(n, "msgStatus", -1),
                                            n.chatContent = t.content,
                                            e.$store.dispatch("newChat/SET_CHAT_LOG_LIST", e.userLogList);
                                            e.userLogList.length;
                                            e.closeQuote(),
                                            setTimeout((function() {
                                                a.checkChatLogType(t)
                                            }
                                            ), 8e3),
                                            setTimeout((function() {
                                                a.checkChatLogType(t)
                                            }
                                            ), 15e3)
                                        }
                                        )).catch((function(t) {
                                            n.isSendType = -1,
                                            e.$store.dispatch("newChat/SET_CHAT_LOG_LIST", e.userLogList)
                                        }
                                        )) : this.accountUsernameData.groupId && (n.csUsername = this.myUserName.username,
                                        n.username = this.myUserName.username,
                                        this.groupChatSendMessage(o, n)),
                                        this.$refs.textareaInput.innerText = "",
                                        this.contenteditableEmpty = !0,
                                        this.textareaValue = "",
                                        this.mentionedMemberIdList = [],
                                        this.mentionedMemberDataList = [],
                                        this.$nextTick((function() {
                                            e.scrollToBottom()
                                        }
                                        ))
                                    }
                                    return this.$store.dispatch("newChat/clearDraft", this.accountUsernameData.username),
                                    !1
                                }
                                this.$message.error(this.$t("newchat.message.blockNoMessage"))
                            } else
                                this.$message.error(this.$t("newchat.message.blockedGroup"));
                        else
                            this.$message.warning(this.$t("newchat.chatwindow.announcementGroupBansSend"))
                },
                groupChatSendMessage: function(t, e) {
                    var a = this
                      , s = this.$refs.textareaInput
                      , i = s.innerText || s.textContent || ""
                      , n = {
                        groupId: this.accountUsernameData.groupId,
                        groupCode: this.accountUsernameData.groupCode,
                        csUsername: this.myUserName.username,
                        chatType: 1,
                        chatContent: i.trim()
                    };
                    if (t.quotedId && (n.quotedId = t.quotedId,
                    n.quotedName = this.quoteData.notify,
                    n.quotedContent = this.quoteType(this.quoteData)),
                    Array.isArray(this.mentionedMemberIdList) && this.mentionedMemberIdList.length > 0 && (n.mentionedMemberIdList = this.mentionedMemberIdList),
                    n.mentionedMemberIdList) {
                        var o = this.getTextareaPlainTextWithMentions();
                        e.chatContent = o,
                        e.text = o,
                        e.chatType = 2,
                        e.sType = 9,
                        e.mentionedMemberIdList = this.mentionedMemberIdList,
                        n.chatType = 1,
                        n.chatContent = o,
                        n.mentionedMemberIdList = this.mentionedMemberIdList;
                        var r = {
                            chatExtensionContent: JSON.stringify(this.mentionedMemberDataList),
                            mentionedMemberIdList: this.mentionedMemberIdList
                        };
                        e.chatExtensionContent = JSON.stringify(r),
                        n.chatExtensionContent = JSON.stringify(r)
                    }
                    Object(S["pb"])(n).then((function(t) {
                        e.messageId = t.chatLog.messageId,
                        e.chatContent = t.chatLog.chatContent,
                        e.text = t.chatLog.chatContent,
                        e.chatOriginal = t.chatLog.chatOriginal,
                        e.groupCode = t.chatLog.groupCode,
                        e.username = t.chatLog.username,
                        e.groupId = t.chatLog.groupId,
                        e.sendTimeStr = e.sendTime,
                        a.$set(e, "isChecked", !1),
                        e.isSendType = 2,
                        e.id = t.id,
                        a.$set(e, "msgStatus", t.chatLog.msgStatus),
                        a.$set(e, "chatLogId", t.chatLog.chatLogId),
                        a.$store.dispatch("newChat/SET_CHAT_LOG_LIST", a.userLogList),
                        a.closeQuote(),
                        a.mentionedMemberIdList = [],
                        a.mentionedMemberDataList = []
                    }
                    )).catch((function(t) {
                        console.log(t)
                    }
                    ))
                },
                onTextareaInput: function() {
                    var t = this.$refs.textareaInput;
                    if (t) {
                        var e = t.innerText || t.textContent || ""
                          , a = this.normalizeTextareaPlainText(e);
                        this.contenteditableEmpty = !(a || "").trim(),
                        this.textareaValue = t.innerHTML || "",
                        this.updateLastSelection(t);
                        var s = this.accountUsernameData && this.accountUsernameData.groupId;
                        if (!s)
                            return this.mentionPopupVisible = !1,
                            void (this.mentionKeyword = "");
                        var i = this.isMentionTriggerByText(a)
                          , n = this.isMentionTriggerBySelection(t);
                        i || n ? (this.mentionPopupVisible = !0,
                        this.mentionKeyword = "",
                        this.updateMentionPopupPosition()) : (this.mentionPopupVisible = !1,
                        this.mentionKeyword = "")
                    }
                },
                updateLastSelection: function(t) {
                    var e = window.getSelection();
                    if (e && 0 !== e.rangeCount) {
                        var a = e.getRangeAt(0);
                        t.contains(a.commonAncestorContainer) && (this.lastSelection = a.cloneRange())
                    }
                },
                isMentionTriggerByText: function(t) {
                    var e = this.normalizeTextareaPlainText(t || "");
                    return e.replace(/[ \t\n\r\u00a0]+$/g, "").endsWith("@")
                },
                isMentionTriggerBySelection: function(t) {
                    var e = window.getSelection();
                    if (!e || 0 === e.rangeCount)
                        return !1;
                    var a = e.getRangeAt(0);
                    if (!t.contains(a.commonAncestorContainer))
                        return !1;
                    var s = a.cloneRange();
                    s.selectNodeContents(t),
                    s.setEnd(a.endContainer, a.endOffset);
                    var i = this.normalizeTextareaPlainText(s.toString() || "");
                    return i.replace(/[ \t\n\r\u00a0]+$/g, "").endsWith("@")
                },
                onTextareaPaste: function(t) {
                    var e = t.clipboardData || window.clipboardData;
                    if (e && !(e.files && e.files.length > 0)) {
                        var a = e.getData && e.getData("text/plain");
                        a && (t.preventDefault(),
                        t.stopPropagation(),
                        this.insertPlainTextInContenteditable(a),
                        this.onTextareaInput())
                    }
                },
                insertPlainTextInContenteditable: function(t) {
                    var e = this.$refs.textareaInput;
                    if (e) {
                        e.focus();
                        var a = window.getSelection();
                        if (a && a.rangeCount) {
                            var s = a.getRangeAt(0);
                            e.contains(s.commonAncestorContainer) ? document.queryCommandSupported && document.queryCommandSupported("insertText") ? document.execCommand("insertText", !1, t) : (s.deleteContents(),
                            s.insertNode(document.createTextNode(t)),
                            s.collapse(!1),
                            a.removeAllRanges(),
                            a.addRange(s)) : e.appendChild(document.createTextNode(t))
                        } else
                            e.appendChild(document.createTextNode(t))
                    }
                },
                getTextareaPlainTextWithMentions: function() {
                    var t = this.$refs.textareaInput;
                    return t ? this.normalizeTextareaPlainText(this.serializeTextareaNode(t)).trim() : ""
                },
                serializeTextareaNode: function(t) {
                    var e = this;
                    if (!t)
                        return "";
                    if (t.nodeType === Node.TEXT_NODE)
                        return t.nodeValue || "";
                    if (t.nodeType !== Node.ELEMENT_NODE && t.nodeType !== Node.DOCUMENT_FRAGMENT_NODE)
                        return "";
                    if (t.nodeType === Node.ELEMENT_NODE) {
                        var a = t;
                        if (a.classList && a.classList.contains("mention-tag"))
                            return "@".concat(a.dataset.jid || a.textContent.replace(/^@/, ""));
                        if ("BR" === a.tagName)
                            return "\n"
                    }
                    var s = "";
                    if (t.childNodes.forEach((function(t) {
                        s += e.serializeTextareaNode(t)
                    }
                    )),
                    t.nodeType === Node.ELEMENT_NODE) {
                        var i = ["DIV", "P", "PRE"];
                        i.includes(t.tagName) && s && !s.endsWith("\n") && (s += "\n")
                    }
                    return s
                },
                normalizeTextareaPlainText: function(t) {
                    return String(t || "").replace(/\u00a0/g, " ").replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n")
                },
                updateMentionPopupPosition: function() {
                    if (this.$refs.contentBoxRef) {
                        var t = this.$refs.contentBoxRef.getBoundingClientRect();
                        this.groupMemberPopupPosition = {
                            top: t.top + window.pageYOffset - 286,
                            left: t.left + window.pageXOffset
                        }
                    }
                },
                onTextareaKeydown: function(t) {
                    if (this.mentionPopupVisible && this.$refs.groupMemberDialogRef) {
                        if ("Escape" === t.key)
                            return this.mentionPopupVisible = !1,
                            void t.preventDefault();
                        if ("ArrowUp" === t.key)
                            return this.$refs.groupMemberDialogRef.moveActive(-1),
                            void t.preventDefault();
                        if ("ArrowDown" === t.key)
                            return this.$refs.groupMemberDialogRef.moveActive(1),
                            void t.preventDefault();
                        if ("Enter" === t.key) {
                            var e = this.$refs.groupMemberDialogRef.getActiveMember();
                            if (e)
                                return this.onSelectMentionMember(e),
                                void t.preventDefault()
                        }
                    }
                    if ("/" !== t.key && 191 !== t.keyCode || t.ctrlKey || t.altKey || t.metaKey || t.shiftKey)
                        return "Enter" === t.key && t.ctrlKey ? (t.preventDefault(),
                        void this.insertLineBreakInContentEditable()) : void ("Enter" !== t.key || t.ctrlKey || this.contentSubmit(t));
                    this.onQuickReply(t)
                },
                insertLineBreakInContentEditable: function() {
                    var t = this.$refs.textareaInput;
                    if (t) {
                        t.focus();
                        var e = window.getSelection();
                        if (e.rangeCount) {
                            var a = e.getRangeAt(0);
                            if (t.contains(a.commonAncestorContainer)) {
                                if (document.queryCommandSupported("insertLineBreak"))
                                    document.execCommand("insertLineBreak", !1, null);
                                else {
                                    var s = document.createElement("br");
                                    a.deleteContents(),
                                    a.insertNode(s),
                                    a.setStartAfter(s),
                                    a.setEndAfter(s),
                                    e.removeAllRanges(),
                                    e.addRange(a)
                                }
                                this.onTextareaInput()
                            }
                        }
                    }
                },
                onSelectMentionMember: function(t) {
                    this.insertMentionTag(t);
                    var e = {
                        nickName: t.nickName,
                        jid: t.jid.toString()
                    };
                    this.mentionedMemberIdList.push(t.id),
                    this.mentionedMemberDataList.push(e),
                    this.mentionPopupVisible = !1
                },
                insertMentionTag: function(t) {
                    if (this.lastSelection) {
                        var e = this.lastSelection.cloneRange()
                          , a = this.$refs.textareaInput;
                        if (a && a.contains(e.commonAncestorContainer)) {
                            var s = document.createElement("span");
                            s.className = "mention-tag",
                            s.contentEditable = !1,
                            s.dataset.id = t.id,
                            s.dataset.jid = t.jid,
                            s.textContent = "@".concat(t.nickName || t.jid);
                            var i = e.startContainer;
                            if (i.nodeType === Node.TEXT_NODE) {
                                var n = i.textContent || ""
                                  , o = e.startOffset - 1;
                                if (o >= 0 && "@" === n.charAt(o)) {
                                    var r = n.substring(0, o)
                                      , c = n.substring(e.startOffset);
                                    i.textContent = r + c,
                                    e.setStart(i, o),
                                    e.setEnd(i, o)
                                }
                            }
                            e.deleteContents(),
                            e.insertNode(s);
                            var l = document.createTextNode(" ");
                            e.setStartAfter(s),
                            e.setEndAfter(s),
                            e.insertNode(l);
                            var u = window.getSelection()
                              , d = document.createRange();
                            d.setStartAfter(l),
                            d.setEndAfter(l),
                            u.removeAllRanges(),
                            u.addRange(d),
                            this.lastSelection = null,
                            this.contenteditableEmpty = !1,
                            this.textareaValue = a.innerHTML || ""
                        }
                    }
                },
                isDraftContentEmpty: function(t) {
                    if (null == t || "" === t)
                        return !0;
                    var e = String(t).replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
                    return !e
                },
                syncDraftToContenteditable: function() {
                    var t = this
                      , e = this.$refs.textareaInput;
                    e && (e.innerHTML = this.textareaValue || "",
                    this.contenteditableEmpty = this.isDraftContentEmpty(this.textareaValue),
                    this.$nextTick((function() {
                        return t.moveCursorToEnd(e)
                    }
                    )))
                },
                moveCursorToEnd: function(t) {
                    if (t && t.childNodes.length) {
                        t.focus();
                        var e = window.getSelection()
                          , a = document.createRange();
                        a.selectNodeContents(t),
                        a.collapse(!1),
                        e.removeAllRanges(),
                        e.addRange(a)
                    }
                },
                restoreMentionFromDraftHtml: function() {
                    var t = this.parseMentionTagsFromHtml(this.textareaValue || "");
                    this.mentionedMemberIdList = t.mentionedMemberIdList || [],
                    this.mentionedMemberDataList = t.mentionedMemberDataList || []
                },
                parseMentionTagsFromHtml: function(t) {
                    var e = []
                      , a = [];
                    if (!t || "string" !== typeof t)
                        return {
                            mentionedMemberIdList: e,
                            mentionedMemberDataList: a
                        };
                    var s, i = /<span class="mention-tag" contenteditable="false" data-id="(\d+)" data-jid="([^"]+)">@([^<]*)<\/span>/g;
                    while (null !== (s = i.exec(t))) {
                        var n = parseInt(s[1], 10)
                          , o = s[2]
                          , r = s[3] || "";
                        e.push(n),
                        a.push({
                            nickName: r,
                            jid: String(o)
                        })
                    }
                    return {
                        mentionedMemberIdList: e,
                        mentionedMemberDataList: a
                    }
                },
                checkChatLogType: function(t) {
                    var e = this
                      , a = t.id || t.chatLog.id
                      , s = e.userLogList.filter((function(t) {
                        return t.id == a
                    }
                    ));
                    s[0] && -1 == s[0].msgStatus && Object(S["k"])(a).then((function(t) {
                        s[0].msgStatus = t.msgStatus,
                        s[0].messageId = t.messageId,
                        s[0].error = t.error,
                        s[0].retryCount = t.retryCount
                    }
                    ))
                },
                messageSendSuccess: function(t) {
                    this.$set(t, "isRead", 0)
                },
                openMT: function() {
                    this.accountUsername.username || this.accountUsernameData.groupId ? 1 != this.accountUsernameData.isBlock ? this.MTdialogVisible = !0 : this.$message.error(this.$t("newchat.message.blockNoMessage")) : this.$message.error(this.$t("newchat.newchat.chatwindow.selectChat"))
                },
                onMTDialogClose: function() {
                    this.callMaterialSelectMode = !1,
                    this.scheduledMaterialPickMode = !1
                },
                sendMeterial: function(t) {
                    var e = this;
                    if (this.callMaterialSelectMode)
                        return 4 !== Number(t.sType) ? void this.$message.warning(this.$t("newchat.chatwindow.onlyVoiceMaterial")) : (this.callModeForm.smId = t.id,
                        this.callModeForm.smform = t,
                        this.MTdialogVisible = !1,
                        void (this.callMaterialSelectMode = !1));
                    if (this.scheduledMaterialPickMode)
                        return this.scheduleMaterialItem = t,
                        this.MTdialogVisible = !1,
                        void (this.scheduledMaterialPickMode = !1);
                    if (1 != this.accountUsernameData.announcement || 2 != this.accountUsernameData.groupIdentity)
                        if (1 != this.accountUsernameData.status) {
                            var a = Object(o["a"])(Object(o["a"])({}, t), {}, {
                                timeStr: B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                                sendTime: B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                                csUsername: this.accountUsernameData.csUsername,
                                username: this.accountUsernameData.username,
                                chatType: 2,
                                isSendType: 1,
                                isSend: 1,
                                isRead: 0,
                                smId: t.id,
                                isCharge: 0
                            });
                            this.userLogList.push(a),
                            this.total++,
                            this.$nextTick((function() {
                                e.scrollToBottom()
                            }
                            )),
                            this.accountUsernameData.username ? this.submitSmMsg(t, a) : this.accountUsernameData.groupId && this.submitGroupSmMsg(t, a)
                        } else
                            this.$message.error(this.$t("newchat.message.blockedGroup"));
                    else
                        this.$message.warning(this.$t("newchat.chatwindow.announcementGroupBansSend"))
                },
                sendQRText: function(t) {
                    var e, a, s = this;
                    console.log(t);
                    if (1 != this.accountUsernameData.isBlock)
                        if (1 != this.accountUsernameData.announcement || 2 != this.accountUsernameData.groupIdentity)
                            if (1 != this.accountUsernameData.status) {
                                var i = {
                                    content: null === t || void 0 === t || null === (e = t.content) || void 0 === e ? void 0 : e.trim(),
                                    csId: this.$store.state.user.userId,
                                    createId: this.$store.state.user.userId,
                                    csChatUserId: this.accountUsernameData.id,
                                    isSend: 1,
                                    isRead: 0,
                                    chatContent: null === t || void 0 === t || null === (a = t.messageContent) || void 0 === a ? void 0 : a.trim(),
                                    timeStr: B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                                    sendTime: B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                                    csUsername: this.accountUsernameData.csUsername,
                                    username: this.accountUsernameData.username,
                                    isSendType: 1,
                                    chatIndex: this.userLogList.length,
                                    chatType: 1,
                                    isCharge: 0
                                }
                                  , n = {
                                    csId: this.$store.state.user.userId,
                                    chatContent: null === t || void 0 === t ? void 0 : t.messageContent.trim(),
                                    csUsername: this.accountUsernameData.csUsername,
                                    username: this.accountUsernameData.username,
                                    isSend: 1,
                                    isRead: 1,
                                    chatIndex: this.userLogList.length,
                                    chatType: 1,
                                    csChatUserId: this.accountUsernameData.id
                                };
                                if ("{}" !== JSON.stringify(this.quoteData) && (1 == this.quoteData.isSend ? i.quotedUsername = this.quoteData.csUsername : i.quotedUsername = this.quoteData.username,
                                n.quotedId = this.quoteData.id,
                                n.quotedName = this.quoteData.notify,
                                n.quotedContent = this.quoteType(this.quoteData),
                                i.quotedId = this.quoteData.id,
                                i.quotedName = this.quoteData.notify,
                                i.quotedContent = this.quoteType(this.quoteData),
                                i.quotedMessageId = this.quoteData.messageId,
                                i.isQuoted = 0),
                                null !== t && void 0 !== t && t.messageContent.trim()) {
                                    this.userLogList.push(i),
                                    this.total++;
                                    var o = t.messageContent;
                                    if (this.accountUsername.username)
                                        Object(S["sb"])(n).then((function(t) {
                                            s.sendAutoTranslate && (i.chatVideo = o),
                                            i.id = t.id,
                                            i.isSendType = 2,
                                            s.$set(i, "msgStatus", -1),
                                            i.chatContent = t.content,
                                            s.$store.dispatch("newChat/SET_CHAT_LOG_LIST", s.userLogList);
                                            s.userLogList.length;
                                            s.closeQuote(),
                                            setTimeout((function() {
                                                that.checkChatLogType(t)
                                            }
                                            ), 8e3),
                                            setTimeout((function() {
                                                that.checkChatLogType(t)
                                            }
                                            ), 15e3)
                                        }
                                        )).catch((function(t) {
                                            i.isSendType = -1,
                                            s.$store.dispatch("newChat/SET_CHAT_LOG_LIST", s.userLogList)
                                        }
                                        ));
                                    else if (this.accountUsernameData.groupId) {
                                        i.csUsername = this.myUserName.username,
                                        i.username = this.myUserName.username;
                                        var r = {
                                            groupId: this.accountUsernameData.groupId,
                                            groupCode: this.accountUsernameData.groupCode,
                                            csUsername: this.myUserName.username,
                                            chatType: 1,
                                            chatContent: o
                                        };
                                        t.quotedId && (r.quotedId = t.quotedId),
                                        Object(S["pb"])(r).then((function(t) {
                                            i.messageId = t.chatLog.messageId,
                                            i.chatContent = t.chatLog.chatContent,
                                            i.chatOriginal = t.chatLog.chatOriginal,
                                            i.groupCode = t.chatLog.groupCode,
                                            i.username = t.chatLog.username,
                                            i.groupId = t.chatLog.groupId,
                                            i.sendTimeStr = i.sendTime,
                                            i.isSendType = 2,
                                            i.id = t.id,
                                            s.$set(i, "msgStatus", t.chatLog.msgStatus),
                                            s.$set(i, "chatLogId", t.chatLog.chatLogId),
                                            s.$store.dispatch("newChat/SET_CHAT_LOG_LIST", s.userLogList),
                                            s.closeQuote()
                                        }
                                        )).catch((function(t) {
                                            console.log(t)
                                        }
                                        ))
                                    }
                                    this.$nextTick((function() {
                                        s.scrollToBottom()
                                    }
                                    ))
                                }
                            } else
                                this.$message.error(this.$t("newchat.message.blockedGroup"));
                        else
                            this.$message.warning(this.$t("newchat.chatwindow.announcementGroupBansSend"));
                    else
                        this.$message.error(this.$t("newchat.message.blockNoMessage"))
                },
                submitSmMsg: function(t, e) {
                    var a = this
                      , s = this
                      , i = {
                        csId: this.$store.state.user.userId,
                        chatType: 2,
                        csUsername: this.accountUsernameData.csUsername,
                        username: this.accountUsernameData.username,
                        isSend: 1,
                        isRead: 1,
                        chatIndex: this.userLogList.length - 1,
                        csChatUserId: this.accountUsernameData.id,
                        smId: t.id,
                        sType: t.sType
                    };
                    Object(S["ub"])(i).then((function(t) {
                        e.id = t.id,
                        e.isSendType = 2,
                        a.$set(e, "msgStatus", -1),
                        e.chatContent = t.content,
                        e.buttonId = t.buttonId,
                        a.$store.dispatch("newChat/SET_CHAT_LOG_LIST", a.userLogList);
                        a.userLogList.length;
                        setTimeout((function() {
                            s.checkChatLogType(t)
                        }
                        ), 8e3),
                        setTimeout((function() {
                            s.checkChatLogType(t)
                        }
                        ), 15e3)
                    }
                    ))
                },
                submitGroupSmMsg: function(t, e) {
                    var a = this
                      , s = this;
                    e.csUsername = this.myUserName.username,
                    e.username = this.myUserName.username;
                    var i = {
                        groupId: this.accountUsernameData.groupId,
                        groupCode: this.accountUsernameData.groupCode,
                        csUsername: this.myUserName.username,
                        chatType: 2,
                        smId: t.id
                    };
                    t.quotedId && (i.quotedId = t.quotedId),
                    Object(S["qb"])(i).then((function(t) {
                        e.messageId = t.chatLog.messageId,
                        e.chatLogId = t.chatLog.chatLogId,
                        e.groupCode = t.chatLog.groupCode,
                        e.username = t.chatLog.username,
                        e.groupId = t.chatLog.groupId,
                        e.buttonId = t.chatLog.buttonId,
                        e.sendTimeStr = e.sendTime,
                        e.isSendType = 2,
                        a.$set(e, "msgStatus", -1),
                        e.chatContent = t.content,
                        a.$store.dispatch("newChat/SET_CHAT_LOG_LIST", a.userLogList);
                        a.userLogList.length;
                        setTimeout((function() {
                            s.checkChatLogType(t)
                        }
                        ), 8e3),
                        setTimeout((function() {
                            s.checkChatLogType(t)
                        }
                        ), 15e3)
                    }
                    ))
                },
                submitSmMsgIMGVideo: function(t, e, a) {
                    var s = this;
                    if (this.accountUsernameData.username) {
                        var i = a.raw.userData.csUsername
                          , n = a.raw.userData.username
                          , o = this
                          , r = {
                            csId: this.$store.state.user.userId,
                            chatType: 2,
                            csUsername: i,
                            username: n,
                            isSend: 1,
                            isRead: 1,
                            chatIndex: this.userLogList.length - 1,
                            csChatUserId: this.accountUsernameData.id,
                            smId: t.id,
                            sType: t.sType
                        };
                        Object(S["ub"])(r).then((function(t) {
                            e.isSendType = 2,
                            s.$set(e, "msgStatus", -1),
                            e.id = t.id,
                            s.$store.dispatch("newChat/SET_CHAT_LOG_LIST", s.userLogList);
                            s.userLogList.length;
                            setTimeout((function() {
                                o.checkChatLogType(t)
                            }
                            ), 8e3),
                            setTimeout((function() {
                                o.checkChatLogType(t)
                            }
                            ), 15e3)
                        }
                        ))
                    } else
                        this.accountUsernameData.groupId && this.submitGroupSmMsg(t, e)
                },
                getTranslateData: function(t) {
                    this.translateData = t
                },
                getFanyiCount: function() {
                    var t = this;
                    Object(S["M"])().then((function(e) {
                        t.fanyiCount = e.fanyiCount
                    }
                    )).catch((function(t) {}
                    ))
                },
                translateSubmit: function() {
                    var t = this;
                    if (this.translateData.sourceText)
                        if (this.translateData.sourceLang)
                            if (this.translateData.targetLang) {
                                if (!this.canTranslateTime) {
                                    var e = 5;
                                    this.canTranslateTime = !0;
                                    var a = setInterval((function() {
                                        e--,
                                        t.canTranslateTimeNum = e
                                    }
                                    ), 1e3);
                                    setTimeout((function() {
                                        t.canTranslateTime = !1,
                                        t.canTranslateTimeNum = 5,
                                        clearInterval(a)
                                    }
                                    ), 5e3)
                                }
                                this.translateLoading = !0,
                                Object(S["A"])(this.translateData).then((function(e) {
                                    t.getFanyiCount(),
                                    t.targetLanguageVal = e.result,
                                    t.translateLoading = !1
                                }
                                )).catch((function(e) {
                                    t.targetLanguageVal = e,
                                    t.translateLoading = !1
                                }
                                ))
                            } else
                                this.$message.error(this.$t("newchat.chatwindow.selectTargetLanguage"));
                        else
                            this.$message.error(this.$t("newchat.chatwindow.selectSourceLanguage"));
                    else
                        this.$message.error(this.$t("newchat.chatwindow.enterTranslationContent"))
                },
                copyTranslate: function() {
                    var t = this;
                    navigator.clipboard.writeText(this.targetLanguageVal).then((function() {
                        t.$message.success(t.$t("newchat.message.successfullyCopy"))
                    }
                    ))
                },
                copyMessageId: function(t) {
                    var e = this
                      , a = t && t.messageId ? String(t.messageId) : "";
                    a ? navigator.clipboard.writeText(a).then((function() {
                        e.$message.success(e.$t("newchat.message.successfullyCopy"))
                    }
                    )).catch((function() {
                        e.$message.error(e.$t("newchat.chatwindow.copyFailed"))
                    }
                    )) : this.$message.warning(this.$t("newchat.chatwindow.messageIdEmpty"))
                },
                sendCallMsgAPI: function() {
                    var t = this
                      , e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
                      , a = this
                      , s = {
                        mode: e.mode || "default",
                        callSeconds: e.callSeconds,
                        smId: e.smId
                    }
                      , i = {
                        isSend: 1,
                        isRead: 0,
                        chatContent: this.$t("newchat.userList.voiceCall"),
                        timeStr: B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                        sendTime: B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                        csUsername: this.accountUsernameData.csUsername,
                        username: this.accountUsernameData.username,
                        chatIndex: this.userLogList.length,
                        chatType: 3,
                        isSendType: 1,
                        isCharge: 0
                    };
                    null != s.callSeconds && "" !== s.callSeconds && (i.callSeconds = s.callSeconds),
                    null != s.smId && "" !== s.smId && (i.smId = s.smId);
                    var n = {
                        csId: this.$store.state.user.userId,
                        chatContent: "[语音电话]",
                        chatType: 3,
                        csUsername: this.accountUsernameData.csUsername,
                        username: this.accountUsernameData.username,
                        isSend: 1,
                        isRead: 1,
                        chatIndex: this.userLogList.length,
                        csChatUserId: this.accountUsernameData.id
                    };
                    null != s.callSeconds && "" !== s.callSeconds && (n.callSeconds = s.callSeconds),
                    null != s.smId && "" !== s.smId && (n.smId = s.smId),
                    this.userLogList.push(i),
                    this.total++,
                    this.$nextTick((function() {
                        t.scrollToBottom()
                    }
                    )),
                    Object(S["nb"])(n).then((function(e) {
                        i.isSendType = 2,
                        t.$set(i, "msgStatus", -1),
                        i.id = e.id,
                        t.$store.dispatch("newChat/SET_CHAT_LOG_LIST", t.userLogList);
                        t.userLogList.length;
                        setTimeout((function() {
                            a.checkChatLogType(e)
                        }
                        ), 8e3),
                        setTimeout((function() {
                            a.checkChatLogType(e)
                        }
                        ), 15e3)
                    }
                    ))
                },
                openCall: function() {
                    this.accountUsername.username ? 1 != this.accountUsernameData.announcement || 2 != this.accountUsernameData.groupIdentity ? 1 != this.accountUsernameData.status ? 1 != this.accountUsernameData.isBlock ? (this.callModeForm = {
                        mode: "default",
                        callSeconds: null,
                        smId: null,
                        smform: null
                    },
                    this.callMaterialSelectMode = !1,
                    this.callModeDialogVisible = !0) : this.$message.error(this.$t("newchat.message.blockNoMessage")) : this.$message.error(this.$t("newchat.message.blockedGroup")) : this.$message.warning(this.$t("newchat.chatwindow.announcementGroupBansSend")) : this.$message.error(this.$t("newchat.message.selectChat"))
                },
                onCallModeChange: function(t) {
                    return "default" === t ? (this.callModeForm.callSeconds = null,
                    this.callModeForm.smId = null,
                    this.callModeForm.smform = null,
                    void (this.callMaterialSelectMode = !1)) : "connect" === t ? (this.callModeForm.smId = null,
                    this.callModeForm.smform = null,
                    void (this.callMaterialSelectMode = !1)) : void ("voice" === t && (this.callModeForm.callSeconds = null))
                },
                openCallMaterialPicker: function() {
                    "voice" === this.callModeForm.mode && (this.callMaterialSelectMode = !0,
                    this.openMT())
                },
                clearCallVoiceMaterial: function() {
                    this.callModeForm.smId = null,
                    this.callModeForm.smform = null
                },
                confirmCallMode: function() {
                    "connect" !== this.callModeForm.mode || null != this.callModeForm.callSeconds && "" !== this.callModeForm.callSeconds ? "voice" !== this.callModeForm.mode || this.callModeForm.smId ? (this.callModeDialogVisible = !1,
                    this.callMaterialSelectMode = !1,
                    this.sendCallMsgAPI({
                        mode: this.callModeForm.mode,
                        callSeconds: "connect" === this.callModeForm.mode ? this.callModeForm.callSeconds : null,
                        smId: "voice" === this.callModeForm.mode ? this.callModeForm.smId : null
                    })) : this.$message.error(this.$t("newchat.chatwindow.smIdRequired")) : this.$message.error(this.$t("newchat.chatwindow.callSecondsRequired"))
                },
                openEditDia: function() {
                    var t = this;
                    return Object(c["a"])(Object(r["a"])().mark((function e() {
                        var a;
                        return Object(r["a"])().wrap((function(e) {
                            while (1)
                                switch (e.prev = e.next) {
                                case 0:
                                    return t.editUserForm = {
                                        name: "",
                                        remarkName: "",
                                        country: "",
                                        labelIds: "",
                                        labelIdsArr: [],
                                        remark: ""
                                    },
                                    t.editDialogVisible = !0,
                                    t.editUserLoading = !0,
                                    a = {
                                        id: t.accountUsernameData.id,
                                        csUsername: t.accountUsernameData.csUsername,
                                        username: t.accountUsernameData.username
                                    },
                                    e.next = 6,
                                    Object(I["j"])().then((function(e) {
                                        t.labelOptionsLoading = !1,
                                        t.labelOptions = e.labelOptions
                                    }
                                    )).catch((function(e) {
                                        t.labelOptionsLoading = !1
                                    }
                                    ));
                                case 6:
                                    return e.next = 8,
                                    Object(S["J"])(a).then((function(e) {
                                        t.editUserForm.friendsId = e.chatInfo.friendsId,
                                        t.editUserForm.labelIds = e.chatInfo.labelIds,
                                        t.editUserForm.labelIdsArr = e.chatInfo.labelIdsArr,
                                        t.editUserForm.remarkName = e.chatInfo.remarkName,
                                        t.editUserForm.country = e.chatInfo.country,
                                        t.editUserForm.remark = e.chatInfo.remark,
                                        t.accountUsername.remark = e.chatInfo.remark,
                                        t.$nextTick((function() {
                                            t.accountUsername.labelIdsArr && t.accountUsername.labelIdsArr.length > 0 && t.editUserForm.labelIdsArr.concat(t.accountUsername.labelIdsArr)
                                        }
                                        )),
                                        t.editUserLoading = !1
                                    }
                                    )).catch((function(e) {
                                        t.editUserLoading = !1
                                    }
                                    ));
                                case 8:
                                    t.getFollowRecords();
                                case 9:
                                case "end":
                                    return e.stop()
                                }
                        }
                        ), e)
                    }
                    )))()
                },
                editUserData: function() {
                    var t = this;
                    this.editUserForm.id = this.accountUsernameData.id,
                    this.editUserForm.username = this.accountUsername.username,
                    this.editUserForm.csUsername = this.accountUsernameData.csUsername,
                    this.editUserForm.labelIdsArr && this.editUserForm.labelIdsArr.length > 0 && (this.editUserForm.labelIds = this.editUserForm.labelIdsArr.join(",")),
                    Object(S["Ib"])(this.editUserForm).then((function(e) {
                        t.accountUsername.username = t.editUserForm.username,
                        t.accountUsername.remarkName = t.editUserForm.remarkName,
                        t.accountUsername.country = t.editUserForm.country,
                        t.accountUsername.remark = t.editUserForm.remark,
                        t.accountUsername.labelIds = t.editUserForm.labelIds,
                        t.accountUsername.labelIdsArr = t.editUserForm.labelIdsArr,
                        t.editDialogVisible = !1,
                        t.$message({
                            type: "success",
                            message: t.$t("newchat.message.successfullyModified")
                        })
                    }
                    ))
                },
                openAutoTranslate: function() {
                    this.$store.dispatch("newChat/SET_TRANSLATE_SETTING_VISIBLE", !0)
                },
                closeAutoTranslate: function() {
                    var t = this
                      , e = Object(o["a"])({}, this.translateData);
                    e.language = "",
                    e.send = "",
                    e.sourceLanguage = "auto",
                    e.setType = 1,
                    Object(S["yb"])(e).then((function(a) {
                        t.$store.dispatch("newChat/setTranslateSettingData", e),
                        t.dialogVisible = !1,
                        t.$message.success(t.$t("newchat.message.successfullyClosed"))
                    }
                    )).catch((function(e) {
                        t.dialogVisible = !1
                    }
                    ))
                },
                setAutoReceive: function(t) {
                    var e = this;
                    if (1 == t)
                        this.$store.dispatch("newChat/SET_TRANSLATE_SETTING_VISIBLE", !0);
                    else {
                        var a = Object(o["a"])({}, this.translateData);
                        a.language = "",
                        a.receive = "",
                        a.sourceLanguage = "auto",
                        a.setType = 0,
                        a.isAutoReceive = t,
                        Object(S["yb"])(a).then((function(t) {
                            e.$store.dispatch("newChat/setTranslateSettingData", a),
                            e.$message.success(e.$t("newchat.message.successfullyModified"))
                        }
                        )).catch((function(t) {}
                        ))
                    }
                },
                recallMessage: function(t, e) {
                    var a = this;
                    this.$confirm(this.$t("newchat.message.recallMessageInfo"), this.$t("newchat.message.prompt"), {
                        confirmButtonText: this.$t("newchat.dialog.confirm"),
                        cancelButtonText: this.$t("newchat.dialog.cancel"),
                        type: "warning"
                    }).then((function() {
                        var e = Object(o["a"])({}, t);
                        t.groupId && (e.id = t.chatLogId,
                        e.groupTo = t.groupCode,
                        e.participant = t.username),
                        e.sendTime = null,
                        Object(S["lb"])(e).then((function(e) {
                            t.msgStatus = -2,
                            a.$message.success(a.$t("newchat.message.recallSuccessfully"))
                        }
                        )).catch((function(t) {}
                        ))
                    }
                    ))
                },
                updateMessage: function(t) {
                    this.userLogList.forEach((function(e) {
                        e.messageId == t.chatLog.messageId && (e.fileUrl = t.chatLog.fileUrl,
                        e.thumbnail = t.chatLog.thumbnail)
                    }
                    ))
                },
                openContact: function() {
                    this.accountUsername.username || this.accountUsernameData.groupId ? 1 != this.accountUsernameData.isBlock ? 1 != this.accountUsernameData.announcement || 2 != this.accountUsernameData.groupIdentity ? 1 != this.accountUsernameData.status ? this.contactDialogVisible = !0 : this.$message.error(this.$t("newchat.message.blockedGroup")) : this.$message.warning(this.$t("newchat.chatwindow.announcementGroupBansSend")) : this.$message.error(this.$t("newchat.message.blockNoMessage")) : this.$message.error(this.$t("newchat.message.selectChat"))
                },
                sendContact: function() {
                    var t = this;
                    this.$refs["contactForm"].validate((function(e) {
                        if (e) {
                            var s = {
                                avatarUrl: a("4d41"),
                                csName: t.accountUsernameData.csUsername + "",
                                timeStr: B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                                sendTime: B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                                chatType: 2,
                                csUsername: t.accountUsernameData.csUsername,
                                username: t.accountUsernameData.username,
                                isSend: 1,
                                sType: 7,
                                isSendType: 1,
                                displayName: t.contactForm.displayName ? t.contactForm.displayName : t.contactForm.phone,
                                smId: null,
                                isCharge: 0
                            };
                            if (t.userLogList.push(s),
                            t.total++,
                            t.$nextTick((function() {
                                t.scrollToBottom()
                            }
                            )),
                            t.contactDialogVisible = !1,
                            t.accountUsername.username) {
                                var i = {
                                    csId: t.$store.state.user.userId,
                                    displayName: t.contactForm.displayName,
                                    phone: t.contactForm.phone,
                                    chatType: 2,
                                    csUsername: t.accountUsernameData.csUsername,
                                    username: t.accountUsernameData.username,
                                    isSend: 1,
                                    isRead: 1,
                                    chatIndex: t.userLogList.length - 1,
                                    csChatUserId: t.accountUsernameData.id
                                };
                                Object(S["ob"])(i).then((function(e) {
                                    s.smId = e.info.sms.id,
                                    s.status = 1,
                                    s.isSendType = 2,
                                    s.messageId = e.info.messageId,
                                    s.id = e.info.id,
                                    t.$set(s, "msgStatus", -1),
                                    t.$store.dispatch("newChat/SET_CHAT_LOG_LIST", t.userLogList)
                                }
                                ))
                            } else if (t.accountUsernameData.groupId) {
                                var n = {
                                    groupId: t.accountUsernameData.groupId,
                                    groupCode: t.accountUsernameData.groupCode,
                                    csUsername: t.myUserName.username,
                                    chatType: 2,
                                    displayName: t.contactForm.displayName,
                                    phone: t.contactForm.phone
                                };
                                s.csUsername = t.myUserName.username,
                                s.username = t.myUserName.username,
                                Object(S["X"])(n).then((function(e) {
                                    s.smId = e.chatLog.sms.id,
                                    s.status = 1,
                                    s.isSendType = 2,
                                    s.messageId = e.chatLog.messageId,
                                    s.username = e.chatLog.username,
                                    s.groupCode = e.chatLog.groupCode,
                                    s.chatLogId = e.chatLog.chatLogId,
                                    t.$set(s, "msgStatus", -1),
                                    t.$store.dispatch("newChat/SET_CHAT_LOG_LIST", t.userLogList)
                                }
                                ))
                            }
                        }
                    }
                    ))
                },
                clearStr: function() {
                    this.contactForm.phone = this.contactForm.phone.replace(/[^\d]/g, "")
                },
                openAddTag: function() {
                    this.addTagVisible = !0
                },
                addTag: function() {
                    var t = this;
                    this.butLoading = !0,
                    Object(D["a"])(this.tagForm).then((function(e) {
                        Object(I["j"])(!0).then((function(e) {
                            t.labelOptions = e.labelOptions;
                            var a = t.labelOptions.filter((function(e) {
                                if (e.labelName == t.tagForm.labelName)
                                    return e
                            }
                            ));
                            t.addTagVisible && (t.editUserForm.labelIdsArr ? t.editUserForm.labelIdsArr.push(a[0].id) : t.editUserForm.labelIdsArr = [a[0].id],
                            t.$modal.msgSuccess(t.$t("newchat.message.successfullyAdd"))),
                            t.butLoading = !1,
                            t.addTagVisible = !1
                        }
                        ))
                    }
                    ))
                },
                openMap: function() {
                    var t = this;
                    return Object(c["a"])(Object(r["a"])().mark((function e() {
                        var a, s;
                        return Object(r["a"])().wrap((function(e) {
                            while (1)
                                switch (e.prev = e.next) {
                                case 0:
                                    if (t,
                                    t.searchMapInput = "",
                                    t.accountUsername.username) {
                                        e.next = 5;
                                        break
                                    }
                                    return t.$message.error(t.$t("newchat.message.selectChat")),
                                    e.abrupt("return");
                                case 5:
                                    if (1 != t.accountUsernameData.isBlock) {
                                        e.next = 8;
                                        break
                                    }
                                    return t.$message.error(t.$t("newchat.message.blockNoMessage")),
                                    e.abrupt("return");
                                case 8:
                                    if (1 != t.accountUsernameData.announcement || 2 != t.accountUsernameData.groupIdentity) {
                                        e.next = 11;
                                        break
                                    }
                                    return t.$message.warning(t.$t("newchat.chatwindow.announcementGroupBansSend")),
                                    e.abrupt("return");
                                case 11:
                                    if (1 != t.accountUsernameData.status) {
                                        e.next = 14;
                                        break
                                    }
                                    return t.$message.error(t.$t("newchat.message.blockedGroup")),
                                    e.abrupt("return");
                                case 14:
                                    if (t.mapDialogVisible = !0,
                                    t.mapDialogLoading = !0,
                                    !t.google) {
                                        e.next = 24;
                                        break
                                    }
                                    return e.next = 19,
                                    t.google.maps.importLibrary("places");
                                case 19:
                                    a = e.sent,
                                    s = a.AutocompleteService,
                                    t.autocompleteService = new s,
                                    t.mapDialogLoading = !1,
                                    t.geolocate();
                                case 24:
                                case "end":
                                    return e.stop()
                                }
                        }
                        ), e)
                    }
                    )))()
                },
                geolocate: function() {
                    var t = this;
                    navigator.geolocation.getCurrentPosition((function(e) {
                        t.center = {
                            lat: e.coords.latitude,
                            lng: e.coords.longitude
                        }
                    }
                    ))
                },
                centerClick: function(t) {
                    var e = this;
                    this.center = {
                        lat: t.latLng.lat(),
                        lng: t.latLng.lng()
                    },
                    this.$refs.map.$mapPromise.then((function(t) {
                        t.panTo(e.center)
                    }
                    ))
                },
                sendMap: function() {
                    var t = this
                      , e = {
                        csId: this.$store.state.user.userId,
                        createId: this.$store.state.user.userId,
                        csChatUserId: this.accountUsernameData.id,
                        isSend: 1,
                        isRead: 1,
                        chatContent: "[定位]",
                        timeStr: B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                        sendTime: B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                        csUsername: this.accountUsernameData.csUsername,
                        username: this.accountUsernameData.username,
                        isSendType: 1,
                        chatIndex: this.userLogList.length - 1,
                        chatType: 2,
                        sType: 10,
                        latitude: this.center.lat,
                        longitude: this.center.lng,
                        addressName: this.searchMapInput,
                        address: this.searchMapInput,
                        messageId: "",
                        isCharge: 0
                    };
                    this.userLogList.push(e),
                    this.total++,
                    this.$nextTick((function() {
                        t.scrollToBottom()
                    }
                    )),
                    this.mapDialogVisible = !1;
                    var a = {
                        csId: this.$store.state.user.userId,
                        csUsername: this.accountUsernameData.csUsername,
                        username: this.accountUsernameData.username,
                        isSend: 1,
                        isRead: 1,
                        chatContent: "[定位]",
                        createId: this.$store.state.user.userId,
                        csChatUserId: this.accountUsernameData.id,
                        chatIndex: this.userLogList.length - 1,
                        chatType: 1,
                        latitude: this.center.lat,
                        longitude: this.center.lng,
                        addressName: this.searchMapInput,
                        address: this.searchMapInput
                    };
                    Object(S["rb"])(a).then((function(a) {
                        var s = t;
                        console.log(a),
                        e.isSendType = 2,
                        t.$set(e, "msgStatus", -1);
                        t.userLogList.length;
                        t.$store.dispatch("newChat/SET_CHAT_LOG_LIST", t.userLogList),
                        setTimeout((function() {
                            s.checkChatLogType(a)
                        }
                        ), 8e3),
                        setTimeout((function() {
                            s.checkChatLogType(a)
                        }
                        ), 15e3)
                    }
                    ))
                },
                searchPoint: function() {
                    console.log(this.autocompleteService),
                    this.autocompleteService.getQueryPredictions({
                        input: this.searchMapInput
                    }, (function(t) {
                        console.log(t)
                    }
                    ))
                },
                querySearch: function(t, e) {
                    this.autocompleteService.getQueryPredictions({
                        input: t
                    }, (function(t) {
                        var a = [];
                        t.forEach((function(t) {
                            var e = Object(o["a"])({
                                value: t.description,
                                address: t.description
                            }, t);
                            a.push(e)
                        }
                        )),
                        e(a)
                    }
                    ))
                },
                handleSelect: function(t) {
                    var e = this;
                    console.log(t),
                    this.$refs.map.$mapPromise.then((function(a) {
                        var s = {
                            query: t.value,
                            fields: ["name", "geometry"]
                        }
                          , i = new e.google.maps.places.PlacesService(a);
                        i.findPlaceFromQuery(s, (function(t, a) {
                            a === google.maps.places.PlacesServiceStatus.OK && (e.center.lat = t[0].geometry.location.lat(),
                            e.center.lng = t[0].geometry.location.lng())
                        }
                        ))
                    }
                    ))
                },
                closeQuote: function() {
                    this.$store.dispatch("newChat/setQuoteData", {})
                },
                scrollIntoViewFun: function(t) {
                    var e = this;
                    return Object(c["a"])(Object(r["a"])().mark((function a() {
                        var s, i, o, c, l, u;
                        return Object(r["a"])().wrap((function(a) {
                            while (1)
                                switch (a.prev = a.next) {
                                case 0:
                                    if (s = e.userLogList.filter((function(e) {
                                        return e.messageId == t
                                    }
                                    )),
                                    !(s.length > 0)) {
                                        a.next = 5;
                                        break
                                    }
                                    return e.chatLoading = !1,
                                    e.$nextTick((function() {
                                        var a = e.$refs.log_inbox.innerHeight || e.$refs.log_inbox.clientHeight || e.$refs.log_inbox.clientHeight;
                                        e.$refs[t][0].scrollIntoView({
                                            behavior: "smooth",
                                            block: "center",
                                            inline: "nearest"
                                        });
                                        var s = e.$refs[t][0].offsetTop - e.$refs.log_inbox.scrollTop
                                          , i = setInterval((function() {
                                            s <= a + 100 && (e.$refs[t][0].style.backgroundColor = "#f5f7fa",
                                            setTimeout((function() {
                                                e.$refs[t][0].style.backgroundColor = "unset"
                                            }
                                            ), 1e4),
                                            clearInterval(i))
                                        }
                                        ), 100)
                                    }
                                    )),
                                    a.abrupt("return", !0);
                                case 5:
                                    if (e.canLoading && !(e.userLogList.length >= e.total)) {
                                        a.next = 8;
                                        break
                                    }
                                    return e.canLoading = !1,
                                    a.abrupt("return", !1);
                                case 8:
                                    if (e.chatLoading = !0,
                                    i = e,
                                    e.isTop = !0,
                                    e.page += 1,
                                    o = i.$refs.log_inbox.scrollHeight - e.$refs.log_inbox.scrollTop,
                                    c = {
                                        pageNum: e.page,
                                        pageSize: e.pageSize,
                                        csUsername: e.accountUsernameData.csUsername,
                                        username: e.accountUsernameData.username,
                                        remarkName: e.accountUsernameData.remarkName,
                                        chatUserId: e.accountUsernameData.id
                                    },
                                    a.prev = 14,
                                    !e.accountUsernameData.groupId) {
                                        a.next = 23;
                                        break
                                    }
                                    return c.chatId = e.accountUsernameData.chatId,
                                    c.readCount = e.accountUsernameData.readCount,
                                    a.next = 20,
                                    Object(S["P"])(c);
                                case 20:
                                    u = a.sent,
                                    a.next = 27;
                                    break;
                                case 23:
                                    return c.isCs = 1,
                                    a.next = 26,
                                    Object(S["i"])(c);
                                case 26:
                                    u = a.sent;
                                case 27:
                                    u.rows.forEach((function(t, e) {
                                        t.sendTime = Object(_["f"])(t.sendTime, "{y}-{m}-{d} {h}:{i}:{s}")
                                    }
                                    )),
                                    (l = e.userLogList).unshift.apply(l, Object(n["a"])(u.rows)),
                                    e.$nextTick((function() {
                                        this.$refs.log_inbox.scrollTop = this.$refs.log_inbox.scrollHeight - o
                                    }
                                    )),
                                    e.isTop = !1,
                                    e.total = u.total,
                                    u.rows.length >= 10 ? e.canLoading = !0 : e.canLoading = !1,
                                    e.scrollIntoViewFun(t),
                                    a.next = 40;
                                    break;
                                case 36:
                                    a.prev = 36,
                                    a.t0 = a["catch"](14),
                                    e.isTop = !1,
                                    e.canLoading = !1;
                                case 40:
                                case "end":
                                    return a.stop()
                                }
                        }
                        ), a, null, [[14, 36]])
                    }
                    )))()
                },
                logScroll: function(t) {
                    t.target.scrollHeight - t.target.scrollTop > 1500 ? this.botButShow = !0 : this.botButShow = !1
                },
                fileChange: function(t, e) {
                    if (!this.accountUsername.username && !this.accountUsernameData.groupId)
                        return this.$message.error(this.$t("newchat.message.selectChat")),
                        !1;
                    if (1 != this.accountUsernameData.isBlock)
                        if (1 != this.accountUsernameData.announcement || 2 != this.accountUsernameData.groupIdentity)
                            if (1 != this.accountUsernameData.status) {
                                var a = t.size / 1024 / 1024 < 10;
                                if (!a)
                                    return this.$message.error(this.$t("newchat.message.fileSizeExceeds")),
                                    !1;
                                var s = t.name.substring(t.name.lastIndexOf(".") + 1);
                                if (s = s.toLowerCase(),
                                this.senFileType = s,
                                e.length >= 1) {
                                    var i = window.URL.createObjectURL(t.raw);
                                    this.senFileUrl = i,
                                    this.pasteFile = t.raw,
                                    this.sendFileText = "",
                                    this.senFileVisible = !0,
                                    this.isTrans = 0
                                }
                                this.$refs.imgfile.clearFiles(),
                                this.$refs.videofile.clearFiles(),
                                this.$refs.filefile.clearFiles()
                            } else
                                this.$message.error(this.$t("newchat.message.blockedGroup"));
                        else
                            this.$message.warning(this.$t("newchat.chatwindow.announcementGroupBansSend"));
                    else
                        this.$message.error(this.$t("newchat.message.blockNoMessage"))
                },
                fileAudioChange: function(t, e) {
                    var a = this;
                    return Object(c["a"])(Object(r["a"])().mark((function s() {
                        var i, n;
                        return Object(r["a"])().wrap((function(s) {
                            while (1)
                                switch (s.prev = s.next) {
                                case 0:
                                    if (console.log(t),
                                    a.accountUsername.username || a.accountUsernameData.groupId) {
                                        s.next = 4;
                                        break
                                    }
                                    return a.$message.error(a.$t("newchat.message.selectChat")),
                                    s.abrupt("return", !1);
                                case 4:
                                    if (1 != a.accountUsernameData.isBlock) {
                                        s.next = 7;
                                        break
                                    }
                                    return a.$message.error(a.$t("newchat.message.blockNoMessage")),
                                    s.abrupt("return");
                                case 7:
                                    if (1 != a.accountUsernameData.announcement || 2 != a.accountUsernameData.groupIdentity) {
                                        s.next = 10;
                                        break
                                    }
                                    return a.$message.warning(a.$t("newchat.chatwindow.announcementGroupBansSend")),
                                    s.abrupt("return");
                                case 10:
                                    if (1 != a.accountUsernameData.status) {
                                        s.next = 13;
                                        break
                                    }
                                    return a.$message.error(a.$t("newchat.message.blockedGroup")),
                                    s.abrupt("return");
                                case 13:
                                    if ("audio/mpeg" == t.raw.type || "audio/ogg" == t.raw.type || "audio/wav" == t.raw.type) {
                                        s.next = 17;
                                        break
                                    }
                                    return a.$message.error(a.$t("newchat.message.fileTypeExceeds")),
                                    a.$refs.audiofile.clearFiles(),
                                    s.abrupt("return", !1);
                                case 17:
                                    return s.prev = 17,
                                    s.next = 20,
                                    a.getAudioTime(t.raw);
                                case 20:
                                    s.sent,
                                    s.next = 28;
                                    break;
                                case 23:
                                    return s.prev = 23,
                                    s.t0 = s["catch"](17),
                                    a.$message.error(s.t0),
                                    a.$refs.audiofile.clearFiles(),
                                    s.abrupt("return", !1);
                                case 28:
                                    i = t.name.substring(t.name.lastIndexOf(".") + 1),
                                    i = i.toLowerCase(),
                                    a.senFileType = i,
                                    e.length >= 1 && (n = window.URL.createObjectURL(t.raw),
                                    a.senFileUrl = n,
                                    a.pasteFile = t.raw,
                                    a.sendFileText = "",
                                    a.senFileVisible = !0,
                                    a.isTrans = 0),
                                    a.$refs.audiofile.clearFiles();
                                case 33:
                                case "end":
                                    return s.stop()
                                }
                        }
                        ), s, null, [[17, 23]])
                    }
                    )))()
                },
                senFileClose: function() {
                    this.senFileVisible = !1,
                    this.handleDialogClosed(),
                    this.senFileUrl = "",
                    this.senFileType = "",
                    this.pasteFile = ""
                },
                handleDialogOpened: function() {
                    var t = this;
                    this.$nextTick((function() {
                        t.$refs.enterButton.$el.focus()
                    }
                    )),
                    this.dialogKeyHandler = function(e) {
                        "Enter" === e.key && t.senFileVisible && (e.preventDefault(),
                        e.stopPropagation(),
                        t.handleDialogClosed(),
                        t.sendFileSubmit())
                    }
                    ,
                    document.addEventListener("keydown", this.dialogKeyHandler, !0)
                },
                handleDialogClosed: function() {
                    this.dialogKeyHandler && (document.removeEventListener("keydown", this.dialogKeyHandler, !0),
                    this.dialogKeyHandler = null)
                },
                paste: function(t) {
                    var e = this;
                    this.$nextTick((function() {
                        var a = t.clipboardData || window.clipboardData;
                        if ("text/plain" != a.types[0]) {
                            t.preventDefault();
                            var s = a.files[0];
                            if (!e.accountUsername.username && !e.accountUsernameData.groupId)
                                return e.$message.error(e.$t("newchat.message.selectChat")),
                                !1;
                            if (1 != e.accountUsernameData.isBlock)
                                if (1 != e.accountUsernameData.announcement || 2 != e.accountUsernameData.groupIdentity)
                                    if (1 != e.accountUsernameData.status) {
                                        var i = s.name.substring(s.name.lastIndexOf(".") + 1);
                                        i = i.toLowerCase(),
                                        e.senFileType = i;
                                        var n = s.size / 1024 / 1024 < 10;
                                        if (!n)
                                            return e.$message.error(e.$t("newchat.message.fileSizeExceeds")),
                                            !1;
                                        var o = new FileReader;
                                        o.readAsDataURL(s),
                                        o.onload = function(t) {
                                            e.pasteFile = s,
                                            e.sendFileText = "",
                                            e.senFileUrl = window.URL.createObjectURL(s),
                                            e.senFileVisible = !0,
                                            e.isTrans = 0
                                        }
                                    } else
                                        e.$message.error(e.$t("newchat.message.blockedGroup"));
                                else
                                    e.$message.warning(e.$t("newchat.chatwindow.announcementGroupBansSend"));
                            else
                                e.$message.error(e.$t("newchat.message.blockNoMessage"))
                        }
                    }
                    ))
                },
                sendFileSubmit: function() {
                    var t = this;
                    return Object(c["a"])(Object(r["a"])().mark((function e() {
                        var a, s, i, n, c, l;
                        return Object(r["a"])().wrap((function(e) {
                            while (1)
                                switch (e.prev = e.next) {
                                case 0:
                                    if (!t.dialogSendInProgress) {
                                        e.next = 2;
                                        break
                                    }
                                    return e.abrupt("return");
                                case 2:
                                    if (t.dialogSendInProgress = !0,
                                    a = t.pasteFile.size / 1024 / 1024 < 2,
                                    a || "jpg" != t.senFileType && "png" != t.senFileType && "jpeg" != t.senFileType) {
                                        e.next = 13;
                                        break
                                    }
                                    return t.fullLoading = t.$loading({
                                        lock: !0,
                                        text: "图片压缩中...",
                                        spinner: "el-icon-loading",
                                        background: "rgba(0, 0, 0, 0.7)"
                                    }),
                                    e.prev = 6,
                                    e.next = 9,
                                    Object(P["b"])(t.pasteFile, 2);
                                case 9:
                                    t.pasteFile = e.sent;
                                case 10:
                                    return e.prev = 10,
                                    t.fullLoading.close(),
                                    e.finish(10);
                                case 13:
                                    if (t.fullLoading = t.$loading({
                                        lock: !0,
                                        text: "正在上传...",
                                        spinner: "el-icon-loading",
                                        background: "rgba(0, 0, 0, 0.7)"
                                    }),
                                    s = new FormData,
                                    i = "file_" + Date.now() + "." + t.senFileType,
                                    n = new File([t.pasteFile],i,{
                                        type: t.pasteFile.type
                                    }),
                                    n.oldName = t.pasteFile.name,
                                    s.append("file", n),
                                    s.append("username", t.myUserName.username),
                                    c = n.oldName + t.sendFileText.substring(0, 30),
                                    s.append("currFileName", c),
                                    s.append("currFileSize", n.size),
                                    s.append("isTrans", t.isTrans),
                                    "jpg" != t.senFileType && "jpeg" != t.senFileType && "png" != t.senFileType) {
                                        e.next = 30;
                                        break
                                    }
                                    s.append("businessType", 6),
                                    s.append("type", 0),
                                    s.append("caption", t.sendFileText),
                                    e.next = 57;
                                    break;
                                case 30:
                                    if ("mp4" != t.senFileType && "m4v" != t.senFileType) {
                                        e.next = 36;
                                        break
                                    }
                                    s.append("businessType", 7),
                                    s.append("type", 0),
                                    s.append("caption", t.sendFileText),
                                    e.next = 57;
                                    break;
                                case 36:
                                    if ("mp3" != t.senFileType && "ogg" != t.senFileType && "wav" != t.senFileType) {
                                        e.next = 55;
                                        break
                                    }
                                    return e.prev = 37,
                                    e.next = 40,
                                    t.getAudioTime(n);
                                case 40:
                                    l = e.sent,
                                    l = l < 1 ? 1 : Math.floor(l),
                                    s.append("seconds", l),
                                    e.next = 51;
                                    break;
                                case 45:
                                    return e.prev = 45,
                                    e.t0 = e["catch"](37),
                                    t.$message.error(e.t0),
                                    t.fullLoading.close(),
                                    t.$refs.audiofile.clearFiles(),
                                    e.abrupt("return", !1);
                                case 51:
                                    s.append("businessType", 9),
                                    s.append("type", 2),
                                    e.next = 57;
                                    break;
                                case 55:
                                    s.append("businessType", 8),
                                    s.append("type", 3);
                                case 57:
                                    U.a.post(t.fileAction, s, {
                                        headers: t.headers,
                                        timeout: 2e5
                                    }).then((function(e) {
                                        if (200 == e.data.code) {
                                            var a = e.data.smMsg;
                                            t.butLoading = !1,
                                            t.senFileVisible = !1,
                                            t.dialogSendInProgress = !1;
                                            var s = Object(o["a"])(Object(o["a"])({}, a), {}, {
                                                smId: a.id,
                                                sType: a.sType
                                            })
                                              , i = t.accountUsernameData.csUsername
                                              , r = t.accountUsernameData.username
                                              , c = Object(o["a"])(Object(o["a"])({}, a), {}, {
                                                timeStr: B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                                                sendTime: B.a.utc().tz("asia/shanghai").format("YYYY-MM-DD HH:mm:ss"),
                                                csUsername: i,
                                                username: r,
                                                chatType: 2,
                                                isSendType: 1,
                                                isSend: 1,
                                                isRead: 0,
                                                fileName: n.oldName
                                            });
                                            i == t.accountUsernameData.csUsername && r == t.accountUsernameData.username && (t.userLogList.push(c),
                                            t.total++),
                                            t.$nextTick((function() {
                                                t.scrollToBottom()
                                            }
                                            )),
                                            t.fullLoading.close(),
                                            URL.revokeObjectURL(t.senFileUrl),
                                            t.$refs.dragfile.clearFiles(),
                                            t.$refs.dragfile2.clearFiles(),
                                            t.sendFileText = "";
                                            var l = t;
                                            if (t.accountUsernameData.username) {
                                                var u = {
                                                    csId: t.$store.state.user.userId,
                                                    chatType: 2,
                                                    csUsername: i,
                                                    username: r,
                                                    isSend: 1,
                                                    isRead: 1,
                                                    chatIndex: t.userLogList.length - 1,
                                                    csChatUserId: t.accountUsernameData.id,
                                                    smId: s.id,
                                                    sType: s.sType
                                                };
                                                Object(S["ub"])(u).then((function(e) {
                                                    c.isSendType = 2,
                                                    t.$set(c, "msgStatus", -1),
                                                    c.id = e.id,
                                                    t.$store.dispatch("newChat/SET_CHAT_LOG_LIST", t.userLogList);
                                                    t.userLogList.length;
                                                    setTimeout((function() {
                                                        l.checkChatLogType(e)
                                                    }
                                                    ), 8e3),
                                                    setTimeout((function() {
                                                        l.checkChatLogType(e)
                                                    }
                                                    ), 15e3)
                                                }
                                                )).catch((function(t) {
                                                    c.isSendType = 0
                                                }
                                                ))
                                            } else
                                                t.accountUsernameData.groupId && t.submitGroupSmMsg(s, c)
                                        } else
                                            t.fullLoading.close(),
                                            t.senFileVisible = !1,
                                            t.dialogSendInProgress = !1,
                                            t.$message.error("发送失败")
                                    }
                                    )).catch((function(e) {
                                        t.fullLoading.close(),
                                        t.dialogSendInProgress = !1,
                                        t.$message.error("发送失败"),
                                        t.senFileVisible = !1,
                                        URL.revokeObjectURL(t.senFileUrl),
                                        t.$refs.dragfile.clearFiles(),
                                        t.$refs.dragfile2.clearFiles(),
                                        t.sendFileText = ""
                                    }
                                    ));
                                case 58:
                                case "end":
                                    return e.stop()
                                }
                        }
                        ), e, null, [[6, , 10, 13], [37, 45]])
                    }
                    )))()
                },
                clickUpload: function() {},
                handleChange: function(t, e) {
                    if (!this.accountUsername.username && !this.accountUsernameData.groupId)
                        return this.$message.error(this.$t("newchat.message.selectChat")),
                        !1;
                    if (1 != this.accountUsernameData.isBlock)
                        if (1 != this.accountUsernameData.announcement || 2 != this.accountUsernameData.groupIdentity)
                            if (1 != this.accountUsernameData.status) {
                                var a = t.name.substring(t.name.lastIndexOf(".") + 1);
                                a = a.toLowerCase(),
                                this.senFileType = a;
                                var s = t.size / 1024 / 1024 < 10;
                                if (!s)
                                    return this.$message.error(this.$t("newchat.message.fileSizeExceeds")),
                                    !1;
                                e.length >= 1 && (this.pasteFile = t.raw,
                                this.sendFileText = "",
                                this.senFileUrl = window.URL.createObjectURL(t.raw),
                                this.senFileVisible = !0,
                                this.isTrans = 0),
                                this.$refs.dragfile.clearFiles(),
                                this.$refs.dragfile2.clearFiles()
                            } else
                                this.$message.error(this.$t("newchat.message.blockedGroup"));
                        else
                            this.$message.warning(this.$t("newchat.chatwindow.announcementGroupBansSend"));
                    else
                        this.$message.error(this.$t("newchat.message.blockNoMessage"))
                },
                handleMouseDown: function(t) {
                    var e = this;
                    this.boxHeight = this.$refs.sendBox.offsetHeight;
                    var a = t.target
                      , s = (t.clientX,
                    a.offsetLeft,
                    t.clientY - a.offsetTop);
                    document.onmousemove = function(t) {
                        t.preventDefault();
                        var a = t.clientY - s;
                        e.$refs.sendBox.style.height = e.boxHeight - a + "px"
                    }
                    ,
                    document.onmouseup = function(t) {
                        document.onmousemove = null,
                        document.onmouseup = null
                    }
                },
                messageRepair: function() {
                    var t = this;
                    this.$confirm(this.$t("newchat.chatwindow.messageRepairInfo"), this.$t("newchat.chatwindow.messageRepairTitle"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        type: "warning"
                    }).then((function() {
                        var e = {
                            ids: [t.myUserName.username]
                        };
                        Object(F["v"])(e).then((function(e) {
                            t.$message.success(t.$t("newchat.chatwindow.messageRepairSuccessInfo"))
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                onQuickReply: function(t) {
                    this.textareaValue || (t.preventDefault(),
                    this.MTdialogVisible = !0)
                },
                getFollowRecords: function() {},
                addFollowRecords: function() {
                    var t = this;
                    this.$prompt("请输入内容", "添加跟进记录", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        inputType: "textarea",
                        inputPattern: /^[\s\S]{1,200}$/,
                        inputErrorMessage: "输入的字符不能超过255个或为空"
                    }).then((function(e) {
                        var a = e.value;
                        Object(S["b"])({
                            recordContent: a,
                            username: t.accountUsername.username
                        }).then((function(e) {
                            t.$message({
                                type: "success",
                                message: "添加成功"
                            }),
                            t.getFollowRecords()
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                editFollowRecords: function(t) {
                    var e = this;
                    this.$prompt("请输入内容", "修改跟进记录", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        inputType: "textarea",
                        inputPattern: /^[\s\S]{1,255}$/,
                        inputErrorMessage: "输入的字符不能超过255个或为空",
                        inputValue: t.recordContent
                    }).then((function(a) {
                        var s = a.value;
                        Object(S["u"])({
                            id: t.id,
                            recordContent: s
                        }).then((function(t) {
                            e.$message({
                                type: "success",
                                message: "修改成功"
                            }),
                            e.getFollowRecords()
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                delFollowRecords: function(t) {
                    var e = this;
                    this.$confirm("此操作将永久删除该跟进记录, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then((function() {
                        Object(S["q"])(t.id).then((function(t) {
                            e.$message({
                                type: "success",
                                message: "删除成功!"
                            }),
                            e.getFollowRecords()
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                delChat: function() {
                    var t = this;
                    this.$confirm("此操作将永久删除该聊天会话, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then((function() {
                        Object(S["p"])(t.accountUsernameData.id).then((function(e) {
                            u["EventBus"].$emit("delSession1", t.accountUsernameData.id),
                            u["EventBus"].$emit("delSession2", t.accountUsernameData.id),
                            u["EventBus"].$emit("delSession3", t.accountUsernameData.id),
                            t.$store.dispatch("newChat/setAccountUsernameData", ""),
                            t.$message({
                                type: "success",
                                message: "删除成功!"
                            })
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                getAudioTime: function(t) {
                    var e = this;
                    return new Promise((function(a, s) {
                        var i = document.createElement("audio")
                          , n = URL.createObjectURL(t);
                        i.src = n,
                        i.onloadedmetadata = Object(c["a"])(Object(r["a"])().mark((function t() {
                            return Object(r["a"])().wrap((function(t) {
                                while (1)
                                    switch (t.prev = t.next) {
                                    case 0:
                                        i.duration && i.duration !== 1 / 0 && NaN !== i.duration ? a(i.duration) : s(e.$t("newchat.chatwindow.audioTimeError"));
                                    case 1:
                                    case "end":
                                        return t.stop()
                                    }
                            }
                            ), t)
                        }
                        )))
                    }
                    ))
                },
                channelChange: function() {
                    var t = this
                      , e = {
                        userId: this.$store.state.user.userId,
                        channel: this.channel
                    };
                    Object(S["xb"])(e).then((function(e) {
                        t.$message({
                            type: "success",
                            message: t.$t("newchat.chatwindow.editSuccess")
                        })
                    }
                    ))
                },
                getTaskPermi: function() {
                    var t = this;
                    Object(G["r"])().then((function(e) {
                        t.isSpecialChannel = e.data.isSpecialChannel,
                        t.channel = e.data.channel
                    }
                    )).catch((function(t) {}
                    ))
                },
                closeAI: function() {
                    var t = this;
                    this.$confirm(this.$t("newchat.chatwindow.closeAIInfo"), this.$t("newchat.chatwindow.tip"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        type: "warning"
                    }).then((function() {
                        var e = {
                            isChatAi: 0,
                            ids: [t.accountUsername.id]
                        };
                        Object(S["o"])(e).then((function(e) {
                            t.$message({
                                type: "success",
                                message: t.$t("newchat.chatwindow.closeSuccess")
                            }),
                            t.accountUsernameData.isChatAi = 0
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                openReadStatusDialog: function(t) {
                    var e = this;
                    return Object(c["a"])(Object(r["a"])().mark((function a() {
                        var s, i;
                        return Object(r["a"])().wrap((function(a) {
                            while (1)
                                switch (a.prev = a.next) {
                                case 0:
                                    if (1 == e.$store.getters.isGroupReadStatus) {
                                        a.next = 2;
                                        break
                                    }
                                    return a.abrupt("return");
                                case 2:
                                    if (e.accountUsername && e.accountUsername.groupId && t.messageId) {
                                        a.next = 4;
                                        break
                                    }
                                    return a.abrupt("return");
                                case 4:
                                    return e.readStatusDialogVisible = !0,
                                    e.readStatusList = [],
                                    e.readStatusLoading = !0,
                                    a.prev = 7,
                                    a.next = 10,
                                    Object(S["S"])({
                                        groupId: e.accountUsername.groupId,
                                        messageId: t.messageId,
                                        msgLoginNumber: t.username
                                    });
                                case 10:
                                    s = a.sent,
                                    i = s && (void 0 !== s.data ? s.data : s),
                                    e.readStatusList = Array.isArray(i) ? i : [],
                                    a.next = 18;
                                    break;
                                case 15:
                                    a.prev = 15,
                                    a.t0 = a["catch"](7),
                                    e.readStatusList = [];
                                case 18:
                                    return a.prev = 18,
                                    e.readStatusLoading = !1,
                                    a.finish(18);
                                case 21:
                                case "end":
                                    return a.stop()
                                }
                        }
                        ), a, null, [[7, 15, 18, 21]])
                    }
                    )))()
                },
                formatReadStatusTime: function(t) {
                    return !t || t.startsWith("1970-01-01") ? "-" : t
                },
                exportChatHistory: function(t) {
                    var e = this;
                    this.$confirm(this.$t("fanList.exportChatLogTip"), this.$t("fanList.tip"), {
                        confirmButtonText: this.$t("fanList.confirm"),
                        cancelButtonText: this.$t("fanList.cancel"),
                        type: "warning"
                    }).then(Object(c["a"])(Object(r["a"])().mark((function a() {
                        var s, i;
                        return Object(r["a"])().wrap((function(a) {
                            while (1)
                                switch (a.prev = a.next) {
                                case 0:
                                    if (e.exportChatHistoryLoading = !0,
                                    a.prev = 1,
                                    null,
                                    "group" != t) {
                                        a.next = 10;
                                        break
                                    }
                                    return s = {
                                        chatId: e.accountUsernameData.chatId
                                    },
                                    a.next = 7,
                                    Object(S["z"])(s);
                                case 7:
                                    a.sent,
                                    a.next = 14;
                                    break;
                                case 10:
                                    return i = {
                                        csUsername: e.accountUsernameData.csUsername,
                                        username: e.accountUsernameData.username
                                    },
                                    a.next = 13,
                                    Object(I["h"])(i);
                                case 13:
                                    a.sent;
                                case 14:
                                    e.$message.success(e.$t("fanList.exportTaskTip"));
                                case 15:
                                    return a.prev = 15,
                                    e.exportChatHistoryLoading = !1,
                                    a.finish(15);
                                case 18:
                                case "end":
                                    return a.stop()
                                }
                        }
                        ), a, null, [[1, , 15, 18]])
                    }
                    )))).catch((function() {}
                    ))
                },
                setRobotHosting: function() {
                    var t = this
                      , e = {
                        ids: [this.accountUsernameData.id],
                        status: 1 == this.accountUsernameData.isReplyApi ? 0 : 1
                    }
                      , a = 1 == e.status ? this.$t("newchat.chatwindow.openRobotHostingInfo") : this.$t("newchat.chatwindow.closeRobotHostingInfo");
                    this.$confirm(a, this.$t("newchat.chatwindow.tip"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        type: "warning"
                    }).then((function() {
                        Object(S["Fb"])(e).then((function(e) {
                            t.$message.success(t.$t("newchat.chatwindow.setSuccess")),
                            t.accountUsernameData.isReplyApi = 1 == t.accountUsernameData.isReplyApi ? 0 : 1
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                groupCommand: function(t) {
                    switch (t) {
                    case "groupDetails":
                        this.$refs.groupDetailsDrawer.open();
                        break;
                    case "deleteMessage":
                        if (2 == this.myGroupIdentity)
                            return void this.$message.error(this.$t("newchat.chatwindow.deleteMessageGroupIdentityError"));
                        this.isDeleteMessage = !0;
                        break;
                    case "exportGroupChatLog":
                        this.exportChatHistory("group");
                        break;
                    default:
                        break
                    }
                },
                itemClick: function(t) {
                    if (this.isDeleteMessage) {
                        if (this.canDelete(t))
                            return void (-4 == t.msgStatus ? this.$t("newchat.chatwindow.deleteMessagedeletedError") : this.$message.warning(this.$t("newchat.chatwindow.deleteMessageOverTimeError")));
                        t.isChecked = !t.isChecked
                    }
                },
                closeDeleteMessage: function() {
                    this.userLogList.forEach((function(t) {
                        t.isChecked = !1
                    }
                    )),
                    this.isDeleteMessage = !1
                },
                deleteMessage: function() {
                    var t = this;
                    0 != this.deleteMessageCount && this.$confirm(this.$t("newchat.chatwindow.deleteMessageInfo"), this.$t("newchat.chatwindow.tip"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        type: "warning"
                    }).then((function() {
                        var e = t.userLogList.filter((function(t) {
                            return t.isChecked
                        }
                        )).map((function(t) {
                            return t.chatLogId
                        }
                        ));
                        console.log(t.myUserName);
                        var a = {
                            csUsername: t.myUserName.username,
                            groupId: t.accountUsernameData.groupId,
                            chatLogIds: e
                        };
                        Object(S["s"])(a).then((function(e) {
                            t.$message.success(t.$t("newchat.chatwindow.deleteMessageSuccessAsync")),
                            t.isDeleteMessage = !1,
                            t.userLogList.forEach((function(t) {
                                t.isChecked = !1
                            }
                            ))
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                onScheduleMenuCommand: function(t) {
                    if ("text" === t) {
                        var e = this.$refs.textareaInput
                          , a = e && (e.innerText || e.textContent) || "";
                        this.scheduleSendType = "text",
                        this.scheduleTextContent = a,
                        this.scheduleDateTime = null,
                        this.scheduleMaterialItem = null,
                        this.scheduleSendDialogVisible = !0
                    } else
                        "material" === t && (this.scheduleSendType = "material",
                        this.scheduleTextContent = "",
                        this.scheduleDateTime = null,
                        this.scheduleMaterialItem = null,
                        this.scheduleSendDialogVisible = !0)
                },
                openScheduledMaterialPicker: function() {
                    this.scheduledMaterialPickMode = !0,
                    this.MTdialogVisible = !0
                },
                onScheduleSendDialogClosed: function() {
                    this.scheduledMaterialPickMode = !1
                },
                confirmScheduleSend: function() {
                    var t = this;
                    if (this.scheduleDateTime)
                        if (new Date(this.scheduleDateTime) < new Date)
                            this.$message.warning(this.$t("newchat.chatwindow.schedulePickTimeLess"));
                        else if ("text" === this.scheduleSendType) {
                            var e = (this.scheduleTextContent || "").trim();
                            if (!e)
                                return void this.$message.warning(this.$t("newchat.chatwindow.scheduleEnterText"));
                            var a = {
                                csId: this.$store.state.user.userId,
                                chatContent: e,
                                csUsername: this.accountUsernameData.csUsername,
                                username: this.accountUsernameData.username,
                                isSend: 1,
                                isRead: 1,
                                chatType: 1,
                                csChatUserId: this.accountUsernameData.id,
                                isFakePkmsg: this.isBlackTechnologyNews ? 1 : 0,
                                scheduleSendTimeStr: this.scheduleDateTime
                            };
                            this.scheduleSubmitLoading = !0,
                            Object(S["tb"])(a).then((function() {
                                t.$message.success(t.$t("newchat.chatwindow.scheduleSuccess")),
                                t.scheduleSendDialogVisible = !1,
                                t.$refs.textareaInput && (t.$refs.textareaInput.innerText = ""),
                                t.contenteditableEmpty = !0,
                                t.textareaValue = "",
                                t.mentionedMemberIdList = [],
                                t.mentionedMemberDataList = [],
                                t.loadScheduledTaskSummary()
                            }
                            )).finally((function() {
                                t.scheduleSubmitLoading = !1
                            }
                            ))
                        } else {
                            if (!this.scheduleMaterialItem)
                                return void this.$message.warning(this.$t("newchat.chatwindow.schedulePickMaterial"));
                            var s = this.scheduleMaterialItem
                              , i = {
                                csId: this.$store.state.user.userId,
                                chatType: 2,
                                csUsername: this.accountUsernameData.csUsername,
                                username: this.accountUsernameData.username,
                                isSend: 1,
                                isRead: 1,
                                csChatUserId: this.accountUsernameData.id,
                                smId: s.id,
                                sType: s.sType,
                                scheduleSendTimeStr: this.scheduleDateTime
                            };
                            this.scheduleSubmitLoading = !0,
                            Object(S["tb"])(i).then((function() {
                                t.$message.success(t.$t("newchat.chatwindow.scheduleSuccess")),
                                t.scheduleSendDialogVisible = !1,
                                t.scheduleMaterialItem = null,
                                t.loadScheduledTaskSummary()
                            }
                            )).finally((function() {
                                t.scheduleSubmitLoading = !1
                            }
                            ))
                        }
                    else
                        this.$message.warning(this.$t("newchat.chatwindow.schedulePickTime"))
                },
                loadScheduledTaskSummary: function() {
                    var t = this
                      , e = this.accountUsernameData && this.accountUsernameData.id;
                    if (!this.accountUsernameData || !this.accountUsernameData.username || !e)
                        return this.scheduledTaskCount = 0,
                        Promise.resolve();
                    var a = {
                        pageNum: this.scheduledListPage,
                        pageSize: this.scheduledListPageSize
                    }
                      , s = {
                        csChatUserId: e
                    };
                    return this.scheduledListLoading = !0,
                    Object(S["mb"])(a, s).then((function(a) {
                        if (t.accountUsernameData && t.accountUsernameData.id === e) {
                            var s = a.rows || a.data || []
                              , i = null != a.total ? a.total : Array.isArray(s) ? s.length : 0;
                            t.scheduledTaskCount = i,
                            t.scheduledListTotal = i,
                            t.scheduledListRows = s
                        }
                    }
                    )).finally((function() {
                        t.scheduledListLoading = !1
                    }
                    ))
                },
                openScheduledListDialog: function() {
                    this.scheduledListVisible = !0,
                    this.scheduledListPage = 1,
                    this.scheduledListSelection = [],
                    this.fetchScheduledListPage()
                },
                fetchScheduledListPage: function() {
                    var t = this
                      , e = this.accountUsernameData && this.accountUsernameData.id;
                    if (e) {
                        this.scheduledListLoading = !0;
                        var a = {
                            pageNum: this.scheduledListPage,
                            pageSize: this.scheduledListPageSize
                        }
                          , s = {
                            csChatUserId: e
                        };
                        Object(S["mb"])(a, s).then((function(a) {
                            if (t.accountUsernameData && t.accountUsernameData.id === e) {
                                var s = a.rows || a.data || [];
                                t.scheduledListTotal = null != a.total ? a.total : s.length,
                                t.scheduledListRows = s
                            }
                        }
                        )).finally((function() {
                            t.scheduledListLoading = !1
                        }
                        ))
                    }
                },
                onScheduledListPageChange: function(t) {
                    this.scheduledListPage = t,
                    this.fetchScheduledListPage()
                },
                onScheduledListSizeChange: function(t) {
                    this.scheduledListPageSize = t,
                    this.scheduledListPage = 1,
                    this.fetchScheduledListPage()
                },
                handleScheduledSelectionChange: function(t) {
                    this.scheduledListSelection = t || []
                },
                batchDeleteScheduledRows: function() {
                    var t = this
                      , e = (this.scheduledListSelection || []).map((function(t) {
                        return t.id
                    }
                    )).filter(Boolean);
                    e.length ? this.$confirm(this.$t("newchat.chatwindow.scheduleDeleteConfirm"), this.$t("newchat.chatwindow.tip"), {
                        confirmButtonText: this.$t("newchat.dialog.confirm"),
                        cancelButtonText: this.$t("newchat.dialog.cancel"),
                        type: "warning"
                    }).then((function() {
                        Object(S["g"])({
                            ids: e
                        }).then((function() {
                            t.$message.success(t.$t("newchat.chatwindow.scheduleDeleteSuccess")),
                            t.loadScheduledTaskSummary(),
                            t.scheduledListSelection = []
                        }
                        ))
                    }
                    )).catch((function() {}
                    )) : this.$message.warning(this.$t("newchat.chatwindow.scheduleSelectRows"))
                },
                likeMessage: function(t, e) {
                    var a, s = this;
                    a = e.groupCode ? {
                        groupCode: e.groupCode,
                        csUsername: e.csUsername,
                        chatContent: t,
                        messageId: e.messageId
                    } : {
                        csUsername: e.csUsername,
                        chatContent: t,
                        username: e.username,
                        messageId: e.messageId
                    },
                    Object(S["Z"])(a).then((function(t) {
                        if (e.reactionMessageList && Array.isArray(e.reactionMessageList)) {
                            var a = e.reactionMessageList.findIndex((function(e) {
                                return e.sendWsLoginNumber == t.sendWsLoginNumber
                            }
                            ));
                            -1 != a ? e.reactionMessageList[a].content = t.content : e.reactionMessageList.push(t)
                        } else
                            s.$set(e, "reactionMessageList", [t])
                    }
                    ))
                }
            },
            destroyed: function() {
                u["EventBus"].$off("getChatLog"),
                u["EventBus"].$off("sendQRText"),
                u["EventBus"].$off("sendMeterial")
            }
        }
          , q = Q
          , H = (a("160a"),
        a("2877"))
          , Y = Object(H["a"])(q, s, i, !1, null, "758d60e8", null);
        e["default"] = Y.exports
    },
    a258: function(t, e, a) {
        var s = a("0366")
          , i = a("44ad")
          , n = a("7b0b")
          , o = a("07fa")
          , r = function(t) {
            var e = 1 == t;
            return function(a, r, c) {
                var l, u, d = n(a), h = i(d), m = s(r, c), p = o(h);
                while (p-- > 0)
                    if (l = h[p],
                    u = m(l, p, d),
                    u)
                        switch (t) {
                        case 0:
                            return l;
                        case 1:
                            return p
                        }
                return e ? -1 : void 0
            }
        };
        t.exports = {
            findLast: r(0),
            findLastIndex: r(1)
        }
    },
    ad61: function(t, e, a) {
        "use strict";
        a("2113")
    },
    b09f: function(t, e, a) {
        "use strict";
        a("1f42")
    },
    b1e3: function(t, e, a) {
        "use strict";
        a("c6b2")
    },
    b55c: function(t, e, a) {
        "use strict";
        a("ef0a")
    },
    b6b8: function(t, e) {
        t.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADCCAMAAAAsP+0DAAAAGFBMVEUAAAAXFxfV8N3e3t4NwUP7+/v+/v573JjOLQtgAAAABHRSTlMAMeh+tyDM4gAAB45JREFUeNrtnIFy2zgQQy1Q0P7/H99FRwWhHWtFUUtac0EaO9PYzD4CoNR2po8//emDlf4VAGYB+Pqd28wOLm9FfDZJSlz2JZD7ji/xs9xIWE4J6c7zi+I2+fETNd6AW1ohA9rFdGMAQdwYQBA3BhBEV4A7Q2AJFfpZEG/EeAsIALYKACrQMdwCwszmX/QFw0Yj4i2A2ezIDKOMSPR3fz4o3w2m7gQ0m6tkxs4McPIze6r3Av0IaPNpGXsx8GoDpL1yM7oGAmiFCC9ECgMQRCxDquhAQCdSIIHNl8p2fIghwHy5EONDis+QZBEMqYsFEi/PUmJ8C0rhagb2CZF/NPFagjlYVzLAqUHXMCGcIJ4hXXQY2dxFdglD4hACMbTXIZogngFjCCRrrXQaRSBZYx04jEBCU5TgnKbDGNAQIxGMZUinY8R5iHg2ShhMIBnP2ZCcKg8+ls6ZgHmYcKbRySHorDNRolOE0VEi602weais2gZWxsiyOkaJtSYcbZt9ig2siZGxS+BQeiAbjplAj0BCvyilK0zQyiOihAoT4BB8ng2oMMG5k4qzgTs2TI+KfdWqknWzgXs5olh3Z9KLOtqg2dIbE6jpPROg1fRFdxv8Mpu3K9RncKHtacOY3paZx3IBvbJwYw6TEsJ3Z9L0dVFgMZId8JV6+HqySBtYJml6myMFxFmPBUT4jblGe39pwDpWno1umbWgYCJtgEbLZ9L05jw6dLxkUhbjM77QAvj1TErbWFuy3dVkQgYIPlcLF7g8uzCVVfCvzPyOnVxgqA2QC2/KALmwfmV7CHzjAkOv0HJh7Wq2QUfqItE5W7DjQmSS5ML68VoFLtRgxC6CXJB3+WuGnknlsTo9VYHlzUWFC98gsTZY4cJrGbB+Tx/udpQuCCMwSYULKoPuLn6WcoG/HZsLXCgOhpYhl47Z86cztSiKj8BM8Z/0zEgXIBdWfc0tJXIbiYuXBttSox1RBDGHyfIuqQxFmxWi9dkNpTwrekFaJILcJ7keSUIAF+Zf9C9QlAlUL8hFBCHSpq0PeGkzlTJ4odT4upgoRlEi5TcXonDh6WSB66hM087IvSCBRYCpPk+PicxTrJ8019GsbbGcqzlWtlU566cLaRsmF9VDALf92Oz4Ei0aIcd3M/1njtJKpiwd2A7tRi5GLIECLM+ZZMOUdMTw0K1absJWaBHEilxN2JTkwrS5wPzs78fWAB3FyxyvhSotyTSpzomqpxDc/cgP2by5jwvf+c0ImQFc9A0SsyuoO5uB1gmBW5yEME0TmCUET5RrG0QPBO0YSRQuSAcRjMLW20Il77NQuiC4hajKpZ6tC4LnghDqbVjYAUHX59IFUnc8hxMBAahEg1yYJu1nTaj1ro1+sXCERR8FAgp/aLV3XcKwUS6AUsVdP76tU5hiEfTTChemx+YCl8rTsTyT4usA/ah3LmTAw2OY3qTjLPjSJi1JCM6lzauDFF0HtW59EILuVJf8UGtt0etAhifHSwSqJnWd5KviGJ5O8RKhVP2fZ6UliqGMrYdg9adEDx/s6UdNbQgStP+HVwBg5xCkEmFqCjMlYcB9Rz0EKhBwenPEggPZsxaEBQUCXIR6Bpr78koIeayL85tr28KGkLrz2entoqTLQlufJfB4mPgsnNwoD+EaBtqhV6LxQGrvsybzIUDyJASqEDg3MyhN5rTmKARL4QkBDkILA2kiWOhAVFfBL0M7g9Yz7utSBMwXMxDmEtAqcqQquGVoZ5BiEdCQJMniEIylIIIrkiRZGAJ2quAkqSdDVY4cBO1I10LU5OgVwU9SPAN8E8ocOWXQlvQK02IVS8oEJ0l9jbDjC+IXBN+GeCNqc1RrQ7wRqFhs+h0BV9ggGYJMUI6cQsuGTmmqKLNy5CWJsxTuhFWYoBy5SbK5G4TVuJmEEGmDZG0Evgm+DfFWoOZskwlOoWVDPIVVmigCxwbtTywFai8w2EVIwf/cYV5U603wbeB8sewbAzCbXdExoa8N0vH/LgCOCa02xMt8E3wbMBSBvgm+DTaSAHxWOoEwmMA3wb/JGF4E34SAv08KIVCXb1QFvmq6V47oxMhDGJ8j+DE6dlmwDyFQjG5TBezE6B5VAJ0YBR2p8QTT4y5VAHeKcIu7C3KnCHeogrUQOFUYR6Ai3OFIxQ7BLXJkHsHH310Y2wjGH6lwCK6sghlpwRZIIrioCmaISJnBJ2i8u9D4EsIzpBSdrYK7TxYLIIKzVThiswWWQARNVdD4QRB7qyeXwL+7MAN9wRpK7BM05AjgYVlDgtoJlKMmwa4xQDXwCa5DEIU1jN9GoCrEY5jy2RAipwrtAuyVxEzTX2uBchQifIl1SrUEursYL98CvwrjJQuiqxAPEFsFICpDIgjMEdaNSggFCMmRxs9KCAOIyhFSnl/ClR0QQTOCP35+x3TdFb0FQFU4On6WIDAUwK8CXseX1IqB82uWivGvo0DS8s0IaW/8ycHPFBUYymc7gKrgh9+nEIY//lXzqwr++D6FON6CAMnx9zSCE/4aCqGsAoC0apKuG185csav5PD1uFgXLz49ek0vBS1fojy0eBjD409/+n/rH+V47JyrltW5AAAAAElFTkSuQmCC"
    },
    b81b: function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("transition", {
                attrs: {
                    name: "el-zoom-in-top"
                }
            }, [a("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.visible,
                    expression: "visible"
                }],
                ref: "popupRef",
                staticClass: "group-member-mention-popup",
                style: t.popupStyle
            }, [a("div", {
                staticClass: "mention-popup-header"
            }, [a("el-input", {
                attrs: {
                    placeholder: t.$t("newchat.chatwindow.enterWsNumber"),
                    size: "mini",
                    clearable: "",
                    "prefix-icon": "el-icon-search"
                },
                on: {
                    input: t.onSearchInput
                },
                model: {
                    value: t.searchKeyword,
                    callback: function(e) {
                        t.searchKeyword = e
                    },
                    expression: "searchKeyword"
                }
            })], 1), a("div", {
                directives: [{
                    name: "infinite-scroll",
                    rawName: "v-infinite-scroll",
                    value: t.loadMore,
                    expression: "loadMore"
                }],
                ref: "listRef",
                staticClass: "mention-list",
                attrs: {
                    "infinite-scroll-disabled": t.scrollDisabled,
                    "infinite-scroll-distance": 50
                }
            }, [t._l(t.filterList, (function(e, s) {
                return a("div", {
                    key: e.id,
                    staticClass: "mention-item",
                    class: {
                        "is-active": s === t.activeIndex
                    },
                    on: {
                        click: function(a) {
                            return t.onSelect(e)
                        },
                        mouseenter: function(e) {
                            t.activeIndex = s
                        }
                    }
                }, [a("el-avatar", {
                    staticClass: "mention-avatar",
                    attrs: {
                        src: e.avatarUrl,
                        size: 32
                    }
                }, [t._v(" " + t._s(String(e.nickName || e.jid || "U").charAt(0)) + " ")]), a("div", {
                    staticClass: "mention-info"
                }, [a("div", {
                    staticClass: "mention-name-row"
                }, [a("span", {
                    staticClass: "mention-nickname"
                }, [t._v(t._s(e.nickName || e.jid || "-"))]), 0 === e.groupIdentity ? a("el-tag", {
                    attrs: {
                        size: "mini",
                        type: "danger"
                    }
                }, [t._v(t._s(t.$t("newchat.chatwindow.lord")))]) : 1 === e.groupIdentity ? a("el-tag", {
                    attrs: {
                        size: "mini",
                        type: "warning"
                    }
                }, [t._v(t._s(t.$t("newchat.chatwindow.administrator")))]) : 2 === e.groupIdentity ? a("el-tag", {
                    attrs: {
                        size: "mini",
                        type: "info"
                    }
                }, [t._v(t._s(t.$t("newchat.chatwindow.member")))]) : t._e()], 1), a("div", {
                    staticClass: "mention-jid"
                }, [t._v(t._s(e.jid || "-"))])])], 1)
            }
            )), t.loading && 0 === t.memberList.length ? a("div", {
                staticClass: "mention-loading"
            }, [a("i", {
                staticClass: "el-icon-loading"
            }), t._v(" " + t._s(t.$t("newchat.chatwindow.loading")) + " ")]) : t.loading || 0 !== t.filterList.length ? t.loading && t.memberList.length > 0 ? a("div", {
                staticClass: "mention-loading mention-loading-more"
            }, [a("i", {
                staticClass: "el-icon-loading"
            }), t._v(" " + t._s(t.$t("newchat.chatwindow.loading")) + " ")]) : t.noMore && t.memberList.length > 0 ? a("div", {
                staticClass: "mention-no-more"
            }, [t._v(" " + t._s(t.$t("newchat.chatwindow.noMore")) + " ")]) : t._e() : a("div", {
                staticClass: "mention-empty"
            }, [t._v(" " + t._s(t.$t("newchat.chatwindow.noData")) + " ")])], 2)])])
        }
          , i = []
          , n = (a("a9e3"),
        a("4de4"),
        a("d3b7"),
        a("498a"),
        a("caad"),
        a("2532"),
        a("ac1f"),
        a("00b4"),
        a("99af"),
        a("f77b"))
          , o = {
            name: "GroupMemberDialog",
            props: {
                visible: {
                    type: Boolean,
                    default: !1
                },
                groupId: {
                    type: [String, Number],
                    default: ""
                },
                position: {
                    type: Object,
                    default: function() {
                        return {
                            top: 0,
                            left: 0
                        }
                    }
                },
                keyword: {
                    type: String,
                    default: ""
                }
            },
            data: function() {
                return {
                    memberList: [],
                    memberTotal: 0,
                    loading: !1,
                    activeIndex: 0,
                    pageNum: 1,
                    pageSize: 20,
                    searchKeyword: ""
                }
            },
            computed: {
                popupStyle: function() {
                    return {
                        top: "".concat(this.position.top, "px"),
                        left: "".concat(this.position.left, "px")
                    }
                },
                myUserName: function() {
                    return this.$store.state.newChat.chatUserNameData || {}
                },
                noMore: function() {
                    return this.memberList.length >= this.memberTotal
                },
                scrollDisabled: function() {
                    return this.loading || this.noMore
                },
                filterList: function() {
                    var t = this.myUserName.login
                      , e = this.memberList.filter((function(e) {
                        var a = e.jid || "";
                        return a !== t
                    }
                    ))
                      , a = (this.keyword || "").trim().toLowerCase()
                      , s = (this.searchKeyword || "").trim().toLowerCase()
                      , i = a || s;
                    return i ? e.filter((function(t) {
                        var e = String(t.nickName || "").toLowerCase()
                          , a = String(t.jid || "").toLowerCase();
                        return e.includes(i) || a.includes(i)
                    }
                    )) : e
                }
            },
            watch: {
                visible: function(t) {
                    t && this.groupId && (this.activeIndex = 0,
                    this.searchKeyword = "",
                    this.pageNum = 1,
                    this.memberList = [],
                    this.memberTotal = 0,
                    this.loadMembers())
                },
                keyword: function() {
                    this.activeIndex = 0
                },
                filterList: function() {
                    this.activeIndex = 0
                }
            },
            methods: {
                onSearchInput: function() {
                    this.activeIndex = 0,
                    this.pageNum = 1,
                    this.memberList = [],
                    this.memberTotal = 0,
                    this.groupId && this.loadMembers()
                },
                loadMembers: function() {
                    var t = this;
                    if (this.groupId) {
                        this.loading = !0;
                        var e = 1 === this.pageNum;
                        e && (this.memberList = []);
                        var a = /^\d+$/.test((this.searchKeyword || "").trim()) ? (this.searchKeyword || "").trim() : "";
                        Object(n["R"])({
                            pageNum: this.pageNum,
                            pageSize: this.pageSize,
                            groupId: this.groupId,
                            jid: a || void 0
                        }).then((function(a) {
                            var s, i = a.rows || [];
                            t.memberTotal = null !== (s = a.total) && void 0 !== s ? s : 0,
                            t.memberList = e ? i : t.memberList.concat(i)
                        }
                        )).catch((function() {
                            e || t.pageNum--
                        }
                        )).finally((function() {
                            t.loading = !1
                        }
                        ))
                    }
                },
                loadMore: function() {
                    !this.scrollDisabled && this.groupId && (this.pageNum++,
                    this.loadMembers())
                },
                onSelect: function(t) {
                    this.$emit("select", t)
                },
                getActiveMember: function() {
                    var t = this.filterList;
                    return t.length && this.activeIndex >= 0 && this.activeIndex < t.length ? t[this.activeIndex] : null
                },
                moveActive: function(t) {
                    var e = this.filterList.length;
                    0 !== e && (this.activeIndex = (this.activeIndex + t + e) % e)
                }
            }
        }
          , r = o
          , c = (a("4e28"),
        a("2877"))
          , l = Object(c["a"])(r, s, i, !1, null, "f68ca3a2", null);
        e["default"] = l.exports
    },
    bc19: function(t, e, a) {
        "use strict";
        a.d(e, "m", (function() {
            return i
        }
        )),
        a.d(e, "i", (function() {
            return n
        }
        )),
        a.d(e, "a", (function() {
            return o
        }
        )),
        a.d(e, "p", (function() {
            return r
        }
        )),
        a.d(e, "d", (function() {
            return c
        }
        )),
        a.d(e, "j", (function() {
            return l
        }
        )),
        a.d(e, "g", (function() {
            return u
        }
        )),
        a.d(e, "l", (function() {
            return d
        }
        )),
        a.d(e, "b", (function() {
            return h
        }
        )),
        a.d(e, "k", (function() {
            return m
        }
        )),
        a.d(e, "n", (function() {
            return p
        }
        )),
        a.d(e, "o", (function() {
            return g
        }
        )),
        a.d(e, "c", (function() {
            return f
        }
        )),
        a.d(e, "f", (function() {
            return b
        }
        )),
        a.d(e, "e", (function() {
            return v
        }
        )),
        a.d(e, "h", (function() {
            return w
        }
        ));
        var s = a("b775");
        function i(t) {
            return Object(s["a"])({
                url: "/biz/friends/list",
                method: "get",
                params: t
            })
        }
        function n(t) {
            return Object(s["a"])({
                url: "/biz/friends/" + t,
                method: "get"
            })
        }
        function o(t) {
            return Object(s["a"])({
                url: "/biz/friends",
                method: "post",
                data: t
            })
        }
        function r(t) {
            return Object(s["a"])({
                url: "/biz/friends",
                method: "put",
                data: t
            })
        }
        function c(t, e) {
            return Object(s["a"])({
                url: "/biz/friends/" + t,
                data: e,
                method: "delete"
            })
        }
        function l() {
            return Object(s["a"])({
                url: "/biz/friends/getLabels",
                method: "get"
            })
        }
        function u(t) {
            return Object(s["a"])({
                url: "/biz/friends/editLabel",
                method: "post",
                data: t
            })
        }
        function d() {
            return Object(s["a"])({
                url: "/biz/friends/info",
                method: "get"
            })
        }
        function h(t) {
            return Object(s["a"])({
                url: "/biz/friends/adds",
                method: "post",
                data: t,
                timeout: 1e7
            })
        }
        function m(t) {
            return Object(s["a"])({
                url: "/biz/friends/getLogList",
                method: "get",
                params: t
            })
        }
        function p(t) {
            return Object(s["a"])({
                url: "/biz/friends/setBlock",
                method: "post",
                data: t
            })
        }
        function g(t) {
            return Object(s["a"])({
                url: "/biz/friends/taskFriends",
                method: "get",
                params: t
            })
        }
        function f(t) {
            return Object(s["a"])({
                url: "/biz/friends/deleteFriends",
                method: "post",
                data: t
            })
        }
        function b(t) {
            return Object(s["a"])({
                url: "/biz/friends/deleteFriendsCount",
                method: "get",
                params: t
            })
        }
        function v(t) {
            return Object(s["a"])({
                url: "/biz/friends/deleteFriendsByParams",
                method: "get",
                params: t
            })
        }
        function w(t) {
            return Object(s["a"])({
                url: "/biz/friends/exportChatLog",
                method: "post",
                data: t
            })
        }
    },
    c04d: function(t, e, a) {
        "use strict";
        a("5df1")
    },
    c2cf: function(t, e, a) {},
    c44b: function(t, e, a) {
        "use strict";
        a("64c3")
    },
    c6b2: function(t, e, a) {},
    ca52: function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , s = t._self._c || e;
            return s("div", {
                staticClass: "main_box"
            }, [s("div", {
                staticClass: "box-card"
            }, [s("div", {
                staticClass: "but-list"
            }, [s("el-input", {
                staticClass: "search_inp",
                attrs: {
                    size: "mini",
                    placeholder: t.$t("newchat.input.enterAccountNickname"),
                    "suffix-icon": "el-icon-search",
                    clearable: ""
                },
                on: {
                    change: t.getUsernameList
                },
                model: {
                    value: t.activeNameVal,
                    callback: function(e) {
                        t.activeNameVal = "string" === typeof e ? e.trim() : e
                    },
                    expression: "activeNameVal"
                }
            }), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.userList.refresh"),
                    placement: "top-start"
                }
            }, [s("el-button", {
                staticClass: "refreshBut",
                attrs: {
                    type: "primary",
                    icon: "el-icon-refresh",
                    circle: ""
                },
                on: {
                    click: t.refreshUsernameList
                }
            })], 1), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    content: t.$t("newchat.userList.clearUnread"),
                    placement: "top-start"
                }
            }, [s("el-button", {
                staticClass: "refreshBut",
                attrs: {
                    type: "warning",
                    icon: "el-icon-brush",
                    circle: "",
                    loading: t.clearUnreadLoading
                },
                on: {
                    click: t.clearUnread
                }
            })], 1), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.userList.filterFans"),
                    placement: "top-start"
                }
            }, [s("el-badge", {
                staticClass: "item",
                style: {
                    color: t.isFilter ? "#fff" : "#409EFF"
                },
                attrs: {
                    "is-dot": t.isFilter
                }
            }, [s("svg-icon", {
                staticClass: "addbut",
                class: t.isFilter ? "" : "addbutClick",
                attrs: {
                    "icon-class": "screen",
                    size: "26",
                    "class-name": "custom-class"
                },
                on: {
                    click: t.openFilterChat
                }
            })], 1)], 1)], 1), s("div", {
                directives: [{
                    name: "infinite-scroll",
                    rawName: "v-infinite-scroll",
                    value: t.load,
                    expression: "load"
                }, {
                    name: "loading",
                    rawName: "v-loading",
                    value: t.accountListLoading,
                    expression: "accountListLoading"
                }],
                ref: "user_listbox",
                staticClass: "user_listbox",
                staticStyle: {
                    overflow: "auto"
                },
                attrs: {
                    id: "user_listbox",
                    "infinite-scroll-disabled": "disabled",
                    "infinite-scroll-distance": 10
                }
            }, [t._l(t.usernameList, (function(e, i) {
                return s("div", {
                    key: e.id,
                    staticClass: "user_item",
                    class: e.id == t.activeNum ? "user_item_active" : "",
                    on: {
                        contextmenu: function(a) {
                            return a.preventDefault(),
                            t.onContextmenu(a, e)
                        },
                        click: function(a) {
                            return t.changeAccount(e, i)
                        }
                    }
                }, [s("div", {
                    staticClass: "tooltopbox"
                }, [t.batchOption ? s("div", {
                    staticStyle: {
                        display: "flex",
                        "align-items": "center",
                        "padding-right": "5px"
                    },
                    on: {
                        click: function(t) {
                            t.stopPropagation()
                        }
                    }
                }, [s("el-checkbox", {
                    model: {
                        value: e.checked,
                        callback: function(a) {
                            t.$set(e, "checked", a)
                        },
                        expression: "item.checked"
                    }
                })], 1) : t._e(), s("el-badge", {
                    staticClass: "item",
                    attrs: {
                        value: e.readNum,
                        hidden: 0 == e.readNum,
                        max: 99
                    }
                }, [s("el-avatar", {
                    staticClass: "item_header",
                    attrs: {
                        src: e.avatarUrl ? e.avatarUrl : a("4d41")
                    },
                    nativeOn: {
                        mousedown: function(t) {
                            t.preventDefault()
                        }
                    }
                })], 1), s("div", {
                    staticClass: "item_info"
                }, [s("div", {
                    staticClass: "nameinfo"
                }, [s("div", {
                    staticClass: "item_name"
                }, [t._v(t._s(e.remarkName ? e.remarkName : e.username))]), s("div", {
                    staticClass: "time_text"
                }, [t._v(t._s(0 == e.isSend ? t.sendTime(e.senderTimestamp ? t.senderTimestamp : e.sendTime) : t.sendTime(e.sendTime)))])]), s("div", {
                    staticClass: "ws-account-info"
                }, [t._v(t._s(e.username.toString()))]), s("div", {
                    staticClass: "timeinfo"
                }, [s("span", {
                    directives: [{
                        name: "show",
                        rawName: "v-show",
                        value: 1 == e.isRepeat && 1 == t.$store.getters.isRepeatScope,
                        expression: "item.isRepeat == 1 && $store.getters.isRepeatScope == 1"
                    }],
                    staticClass: "repeat-text"
                }, [t._v("重")]), s("div", {
                    staticClass: "content",
                    class: {
                        "draft-content": t.hasDraft(e.id)
                    }
                }, [t._v(" " + t._s(t.hasDraft(e.id) ? "草稿" : e.content) + " ")]), [s("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        enterable: !1,
                        content: 1 == e.isReplyApi ? t.$t("newchat.chatwindow.robotHosting") : t.$t("newchat.chatwindow.globalRobotHosting"),
                        placement: "right"
                    }
                }, [1 == e.isReplyApi || 2 == e.isReplyApi ? s("svg-icon", {
                    staticStyle: {
                        "margin-bottom": "2px",
                        color: "#67C23A"
                    },
                    style: {
                        color: 1 == e.isReplyApi ? "#67C23A" : "#409EFF"
                    },
                    attrs: {
                        "icon-class": "robot",
                        size: "15",
                        "class-name": "custom-class"
                    }
                }) : t._e()], 1)], s("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        enterable: !1,
                        content: t.$t("newchat.userList.isAI"),
                        placement: "right"
                    }
                }, [1 == e.isChatAi ? s("svg-icon", {
                    staticStyle: {
                        "margin-bottom": "2px",
                        color: "#67C23A"
                    },
                    attrs: {
                        "icon-class": "AI",
                        size: "15",
                        "class-name": "custom-class"
                    },
                    on: {
                        click: function(a) {
                            return t.closeAI(e)
                        }
                    }
                }) : t._e()], 1), s("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        enterable: !1,
                        content: "拉黑",
                        placement: "right"
                    }
                }, [s("div", {
                    staticStyle: {
                        "margin-bottom": "3px"
                    },
                    on: {
                        click: function(a) {
                            return a.stopPropagation(),
                            t.pullIntoBlacklist(e)
                        }
                    }
                }, [1 == e.isBlock ? s("div", {
                    staticStyle: {
                        color: "#F56C6C"
                    }
                }, [s("svg-icon", {
                    attrs: {
                        "icon-class": "black",
                        size: "14",
                        "class-name": "custom-class"
                    }
                })], 1) : s("div", {
                    staticStyle: {
                        color: "#909399"
                    }
                }, [s("svg-icon", {
                    attrs: {
                        "icon-class": "black",
                        size: "14",
                        "class-name": "custom-class"
                    }
                })], 1)])]), s("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        content: 1 == e.isTop ? t.$t("newchat.userList.cancelTop") : t.$t("newchat.userList.top"),
                        placement: "right"
                    }
                }, [s("div", {
                    on: {
                        click: function(a) {
                            return a.stopPropagation(),
                            t.topping(e)
                        }
                    }
                }, [1 == e.isTop ? s("i", {
                    staticClass: "el-icon-download",
                    staticStyle: {
                        color: "rgb(140, 197, 255)"
                    }
                }) : s("i", {
                    staticClass: "el-icon-upload2",
                    staticStyle: {
                        color: "#909399"
                    }
                })])])], 2)])], 1)])
            }
            )), t.loadingIcon ? s("div", {
                staticClass: "icon-loading"
            }, [s("i", {
                staticClass: "el-icon-loading"
            })]) : t._e(), t.noMore && !t.loadingIcon && 0 != t.usernameList.length ? s("div", {
                staticClass: "icon-loading nomoretext"
            }, [t._v(" " + t._s(t.$t("newchat.userList.noMore")) + " ")]) : t._e(), 0 == t.usernameList.length ? s("el-empty", {
                attrs: {
                    description: t.$t("newchat.notice.nodata")
                }
            }) : s("div", {
                staticClass: "listPageBox notranslate"
            }, [t._v(" " + t._s(t.usernameList.length) + " / " + t._s(t.total) + " ")])], 2)]), s("el-dialog", {
                staticClass: "add-dialog",
                attrs: {
                    title: t.$t("newchat.userList.filterFans"),
                    center: "",
                    visible: t.filterChatVisible,
                    width: "400px",
                    "close-on-click-modal": !1,
                    "close-on-press-escape": !1,
                    "show-close": !1
                },
                on: {
                    "update:visible": function(e) {
                        t.filterChatVisible = e
                    }
                }
            }, [s("el-form", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.filterLabelsLoading,
                    expression: "filterLabelsLoading"
                }],
                ref: "form",
                attrs: {
                    model: t.filterChatForm,
                    "label-width": "100px",
                    size: "mini"
                }
            }, [s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.userList.fansTag")
                }
            }, [s("el-select", {
                staticStyle: {
                    width: "100%"
                },
                attrs: {
                    multiple: "",
                    filterable: "",
                    placeholder: t.$t("newchat.userList.selectFansTag"),
                    clearable: ""
                },
                model: {
                    value: t.filterChatForm.labels,
                    callback: function(e) {
                        t.$set(t.filterChatForm, "labels", e)
                    },
                    expression: "filterChatForm.labels"
                }
            }, t._l(t.lableList, (function(t, e) {
                return s("el-option", {
                    key: e,
                    attrs: {
                        label: t.labelName,
                        value: t.id
                    }
                })
            }
            )), 1)], 1), s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.userList.fansSource")
                }
            }, [s("el-select", {
                staticStyle: {
                    width: "100%"
                },
                attrs: {
                    placeholder: t.$t("newchat.userList.selectFansSource"),
                    clearable: ""
                },
                model: {
                    value: t.filterChatForm.addType,
                    callback: function(e) {
                        t.$set(t.filterChatForm, "addType", e)
                    },
                    expression: "filterChatForm.addType"
                }
            }, [s("el-option", {
                attrs: {
                    label: t.$t("fanList.newMessageAddition"),
                    value: 0
                }
            }), s("el-option", {
                attrs: {
                    label: t.$t("fanList.fansGroupSending"),
                    value: 1
                }
            }), s("el-option", {
                attrs: {
                    label: t.$t("fanList.import"),
                    value: 2
                }
            }), s("el-option", {
                attrs: {
                    label: t.$t("fanList.pull"),
                    value: 3
                }
            }), s("el-option", {
                attrs: {
                    label: t.$t("fanList.addfan"),
                    value: 4
                }
            })], 1)], 1), s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.userList.isAI")
                }
            }, [s("el-select", {
                staticStyle: {
                    width: "100%"
                },
                attrs: {
                    placeholder: t.$t("newchat.userList.selectAI"),
                    clearable: ""
                },
                model: {
                    value: t.filterChatForm.isChatAi,
                    callback: function(e) {
                        t.$set(t.filterChatForm, "isChatAi", e)
                    },
                    expression: "filterChatForm.isChatAi"
                }
            }, [s("el-option", {
                attrs: {
                    label: t.$t("newchat.userList.yes"),
                    value: 1
                }
            }), s("el-option", {
                attrs: {
                    label: t.$t("newchat.userList.no"),
                    value: 0
                }
            })], 1)], 1)], 1), s("span", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [s("el-button", {
                attrs: {
                    size: "mini"
                },
                on: {
                    click: t.cancelFilterChat
                }
            }, [t._v(t._s(t.$t("newchat.userList.clearFilter")))]), s("el-button", {
                attrs: {
                    type: "primary",
                    size: "mini"
                },
                on: {
                    click: t.filterChat
                }
            }, [t._v(t._s(t.$t("newchat.userList.filter")))])], 1)], 1)], 1)
        }
          , i = []
          , n = a("5530")
          , o = (a("4de4"),
        a("d3b7"),
        a("99af"),
        a("c740"),
        a("159b"),
        a("14d9"),
        a("a434"),
        a("3c65"),
        a("d81d"),
        a("a15b"),
        a("71b4"),
        a("488e"))
          , r = a("f77b")
          , c = a("c38a")
          , l = a("bc19")
          , u = a("eda1")
          , d = a("7f45")
          , h = a.n(d)
          , m = {
            mixins: [u["a"]],
            data: function() {
                return {
                    activeNameVal: "",
                    usernameList: [],
                    pageSize: 10,
                    total: 0,
                    accountUsername: "",
                    pageNum: 1,
                    activeNum: -1,
                    loadingIcon: !1,
                    accountListLoading: !0,
                    sidebarNameStr: "",
                    noMore: !1,
                    groupList: [],
                    menuGroupList: [],
                    filterChatVisible: !1,
                    filterLabelsLoading: !1,
                    lableList: [],
                    filterChatForm: {
                        labels: [],
                        addType: [],
                        isChatAi: ""
                    },
                    filterLabels: "",
                    filterAddType: "",
                    filterIsChatAi: "",
                    handleKeydown: null,
                    clearUnreadLoading: !1,
                    batchOption: !1
                }
            },
            computed: {
                chatUserName: function() {
                    return this.$store.state.newChat.chatUserName
                },
                sidebarName: function() {
                    return this.$store.state.newChat.sidebarName
                },
                webSocketData: function() {
                    return this.$store.state.newChat.socketData
                },
                otherUsernameData: function() {
                    return this.$store.state.newChat.accountUserNameData
                },
                userListScoketData: function() {
                    return this.$store.state.newChat.userListScoketData
                },
                disabled: function() {
                    return this.loadingIcon || this.noMore
                },
                isFilter: function() {
                    return Boolean("" !== this.filterLabels || "" !== this.filterAddType || "" !== this.filterIsChatAi)
                },
                sendTime: function() {
                    var t = this;
                    return function(e) {
                        if (!e)
                            return "";
                        var a = t.$store.state.newChat.timeArea
                          , s = (new Date).getTime()
                          , i = Object(c["f"])(s, "{y}-{m}-{d}")
                          , n = Object(c["f"])(e, "{y}-{m}-{d}")
                          , o = h.a.utc(e).tz("asia/shanghai").format();
                        return i == n ? h.a.utc(o).tz(a).format("HH:mm") : h.a.utc(o).tz(a).format("MM-DD")
                    }
                },
                hasDraft: function() {
                    var t = this;
                    return function(e) {
                        return !!t.$store.state.newChat.draftMessages[e]
                    }
                }
            },
            watch: {
                chatUserName: function(t) {
                    this.accountUsername = t
                },
                sidebarName: function(t) {
                    this.pageNum = 1,
                    this.sidebarNameStr = t,
                    this.usernameList = [],
                    this.accountListLoading = !0,
                    this.getUsernameList()
                },
                webSocketData: function(t) {
                    if (console.log("socket", t),
                    t && 2 == t.sendType)
                        if (1 != t.sendInfo.isSend) {
                            var e = t.sendInfo
                              , a = {
                                createBy: null,
                                createTime: null,
                                updateBy: null,
                                updateTime: null,
                                remark: e.remark,
                                id: e.csChatUserId,
                                csUsername: e.csUsernameStr,
                                username: e.username,
                                remarkName: e.notify || e.username,
                                country: null,
                                isTop: e.isTop,
                                fanyiSourceSend: null,
                                fanyiTargetSend: null,
                                fanyiSourceGet: null,
                                fanyiTargetGet: null,
                                isAutoSend: null,
                                isAutoGet: null,
                                isBlock: e.isBlock,
                                isReurnId: null,
                                csId: null,
                                chatsType: null,
                                keyword: e.username,
                                labelIds: null,
                                readNum: 0,
                                avatarUrl: e.avatarUrl,
                                sendTime: (new Date).getTime(e.sendTime),
                                senderTimestamp: e.senderTimestamp,
                                content: e.chatContent,
                                friendsId: null,
                                labelIdsArr: null,
                                labelName: null,
                                login: e.login,
                                isRepeat: e.isRepeat
                            };
                            this.addSession(e, a),
                            this.changeSessionContent(t)
                        } else
                            this.changeSessionContent(t)
                },
                userListScoketData: function(t) {
                    this.changeSessionContent(t)
                }
            },
            mounted: function() {
                var t = this;
                this.accountUsername = this.$store.state.newChat.chatUserName,
                this.sidebarNameStr = this.$store.state.newChat.sidebarName,
                this.getUsernameList(),
                o["EventBus"].$on("getSessionUsernameList", (function(e) {
                    t.getUsernameList()
                }
                )),
                o["EventBus"].$on("delSession2", this.delSession2),
                this.getGroupList(),
                this.handleKeydown = function(e) {
                    e.ctrlKey && "ArrowDown" === e.key ? t.changeAccountDown() : e.ctrlKey && "ArrowUp" === e.key && t.changeAccountUp()
                }
                ,
                document.addEventListener("keydown", this.handleKeydown)
            },
            methods: {
                getUsernameList: function() {
                    var t = this;
                    this.clearChat(),
                    this.accountListLoading = !0,
                    this.pageNum = 1;
                    var e = {
                        csId: this.$store.state.user.userId,
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        chatsType: 0,
                        keyword: this.activeNameVal,
                        labelIds: this.filterLabels,
                        addType: this.filterAddType,
                        isChatAi: this.filterIsChatAi
                    };
                    switch (this.sidebarNameStr) {
                    case "allSessionChat":
                        e.chatsType = 0,
                        this.activeNum = -1,
                        this.noMore = !0,
                        Object(r["D"])(e).then((function(e) {
                            t.usernameList = e.chatInfo.chatUsers.rows,
                            t.total = e.chatInfo.chatUsers.total,
                            t.loadingIcon = !1,
                            t.accountListLoading = !1,
                            t.usernameList.length >= t.total ? t.noMore = !0 : t.noMore = !1
                        }
                        )).catch((function() {
                            t.loadingIcon = !1,
                            t.noMore = !1,
                            t.accountListLoading = !1
                        }
                        ));
                        break;
                    case "noReadSessionChat":
                        e.chatsType = 1,
                        this.activeNum = -1,
                        this.noMore = !0,
                        Object(r["D"])(e).then((function(e) {
                            t.usernameList = e.chatInfo.chatUsers.rows,
                            t.total = e.chatInfo.chatUsers.total,
                            t.loadingIcon = !1,
                            t.accountListLoading = !1,
                            t.usernameList.length >= t.total ? t.noMore = !0 : t.noMore = !1
                        }
                        )).catch((function() {
                            t.loadingIcon = !1,
                            t.noMore = !1,
                            t.accountListLoading = !1
                        }
                        ));
                        break;
                    case "topSessionChat":
                        e.chatsType = 2,
                        this.activeNum = -1,
                        this.noMore = !0,
                        Object(r["D"])(e).then((function(e) {
                            t.usernameList = e.chatInfo.chatUsers.rows,
                            t.total = e.chatInfo.chatUsers.total,
                            t.loadingIcon = !1,
                            t.accountListLoading = !1,
                            t.usernameList.length >= t.total ? t.noMore = !0 : t.noMore = !1
                        }
                        )).catch((function() {
                            t.loadingIcon = !1,
                            t.noMore = !1,
                            t.accountListLoading = !1
                        }
                        ));
                        break;
                    case "archiveSessionChat":
                        e.chatsType = 0,
                        e.groupId = 6,
                        this.activeNum = -1,
                        this.noMore = !0,
                        Object(r["D"])(e).then((function(e) {
                            t.usernameList = e.chatInfo.chatUsers.rows,
                            t.total = e.chatInfo.chatUsers.total,
                            t.loadingIcon = !1,
                            t.accountListLoading = !1,
                            t.usernameList.length >= t.total ? t.noMore = !0 : t.noMore = !1
                        }
                        )).catch((function() {
                            t.loadingIcon = !1,
                            t.noMore = !1,
                            t.accountListLoading = !1
                        }
                        ));
                        break;
                    default:
                        this.loadingIcon = !1,
                        this.accountListLoading = !1,
                        this.noMore = !0
                    }
                },
                getPageUsernameList: function() {
                    var t = {
                        csId: this.$store.state.user.userId,
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        chatsType: 0,
                        keyword: this.activeNameVal
                    };
                    switch (this.sidebarNameStr) {
                    case "allSessionChat":
                        t.chatsType = 0,
                        this.getAccountChats(t);
                        break;
                    case "noReadSessionChat":
                        t.chatsType = 1,
                        this.getAccountChats(t);
                        break;
                    case "topSessionChat":
                        t.chatsType = 2,
                        this.getAccountChats(t);
                        break;
                    case "archiveSessionChat":
                        t.chatsType = 0,
                        t.groupId = 6,
                        this.getAccountChats(t);
                        break;
                    default:
                        this.loadingIcon = !1,
                        this.accountListLoading = !1
                    }
                },
                refreshUsernameList: function() {
                    this.accountListLoading || (this.pageNum = 1,
                    this.getUsernameList())
                },
                getAccountChats: function(t) {
                    var e = this;
                    this.noMore = !0,
                    Object(r["D"])(t).then((function(t) {
                        var a = t.chatInfo.chatUsers.rows.filter((function(t) {
                            return e.usernameList.every((function(e) {
                                return t.id !== e.id
                            }
                            ))
                        }
                        ));
                        e.usernameList = e.usernameList.concat(a),
                        e.total = t.chatInfo.chatUsers.total,
                        e.loadingIcon = !1,
                        e.accountListLoading = !1,
                        e.usernameList.length >= e.total ? e.noMore = !0 : e.noMore = !1
                    }
                    )).catch((function() {
                        e.loadingIcon = !1,
                        e.noMore = !1,
                        e.accountListLoading = !1
                    }
                    ))
                },
                changeAccount: function(t, e) {
                    var a = this
                      , s = this.$store.state.newChat.noReadNum
                      , i = s - t.readNum;
                    this.$store.dispatch("newChat/setNoReadNum", i),
                    0 == i && o["EventBus"].$emit("setSiderbarDot", !1),
                    this.activeNum = t.id,
                    t.readNum = 0;
                    var r = this.usernameList.filter((function(t) {
                        return t.id === a.activeNum
                    }
                    ))[0]
                      , c = {
                        activeName: "accountList",
                        itemData: t
                    };
                    o["EventBus"].$emit("getChatLog", c);
                    var l = Object(n["a"])({}, r);
                    l.avatarUrl = "",
                    this.$store.dispatch("newChat/setChatUsername", l),
                    this.$store.dispatch("newChat/setAccountUsernameData", r)
                },
                changeAccountDown: function() {
                    var t = this;
                    if (0 != this.usernameList.length) {
                        var e = this.usernameList.findIndex((function(e) {
                            return e.id == t.activeNum
                        }
                        ));
                        if (e != this.usernameList.length - 1) {
                            var a = this.usernameList[e + 1];
                            this.changeAccount(a),
                            e > 0 && (document.querySelector("#user_listbox").scrollTop += 72)
                        }
                    }
                },
                changeAccountUp: function() {
                    var t = this
                      , e = this.usernameList.findIndex((function(e) {
                        return e.id == t.activeNum
                    }
                    ));
                    if (0 != e) {
                        var a = this.usernameList[e - 1];
                        this.changeAccount(a),
                        document.querySelector("#user_listbox").scrollTop -= 72
                    }
                },
                clearChat: function() {
                    this.$store.dispatch("newChat/setAccountUsernameData", "")
                },
                load: function() {
                    this.loadingIcon = !0,
                    this.pageNum += 1,
                    this.getPageUsernameList()
                },
                onContextmenu: function(t, e) {
                    var a = this;
                    this.menuGroupList.forEach((function(t) {
                        t.userItem = e
                    }
                    ));
                    var s = [];
                    if (this.batchOption) {
                        var i = this.usernameList.filter((function(t) {
                            if (t.checked)
                                return t.id
                        }
                        ));
                        s.push({
                            label: this.$t("newchat.userList.selectAll"),
                            onClick: function() {
                                a.usernameList.forEach((function(t) {
                                    a.$set(t, "checked", !0)
                                }
                                ))
                            }
                        }),
                        i.length > 0 && (s.push({
                            label: this.$t("newchat.userList.cancelAll"),
                            onClick: function() {
                                a.usernameList.forEach((function(t) {
                                    a.$set(t, "checked", !1)
                                }
                                ))
                            }
                        }),
                        s.push({
                            label: this.$t("newchat.userList.batchCloseIsAI"),
                            onClick: function() {
                                a.batchCloseAI()
                            }
                        }),
                        this.menuGroupList.length > 0 ? s.push({
                            label: this.$t("newchat.userList.batchSetGroup"),
                            children: this.menuGroupList
                        }) : s.push({
                            label: this.$t("newchat.userList.noGroupSet"),
                            disabled: !0
                        }),
                        "archiveSessionChat" == this.sidebarNameStr ? s.push({
                            label: this.$t("newchat.userList.batchCancelArchive"),
                            onClick: function() {
                                a.batchSetArchive(null, 0)
                            }
                        }) : s.push({
                            label: this.$t("newchat.userList.batchSetArchive"),
                            onClick: function() {
                                a.batchSetArchive(null, 1)
                            }
                        }))
                    } else
                        s.push({
                            label: 1 == e.isTop ? this.$t("newchat.userList.cancelTop") : this.$t("newchat.userList.top"),
                            onClick: function() {
                                if (1 == e.isTop) {
                                    var t = {
                                        id: e.id,
                                        isTop: 0
                                    };
                                    Object(r["Gb"])(t).then((function(t) {
                                        e.isTop = 0,
                                        a.$message.success(a.$t("newchat.userList.cancelTop"))
                                    }
                                    ))
                                } else {
                                    var s = {
                                        id: e.id,
                                        isTop: 1
                                    };
                                    Object(r["Gb"])(s).then((function(t) {
                                        e.isTop = 1,
                                        a.$message.success(a.$t("newchat.userList.successfullyTop"))
                                    }
                                    ))
                                }
                            }
                        }),
                        s.push({
                            label: 1 == e.isBlock ? this.$t("newchat.userList.cancelBlack") : this.$t("newchat.userList.setBalck"),
                            onClick: function() {
                                a.pullIntoBlacklist(e)
                            }
                        }),
                        this.menuGroupList.length > 0 ? s.push({
                            label: this.$t("newchat.userList.setGroup"),
                            children: this.menuGroupList
                        }) : s.push({
                            label: this.$t("newchat.userList.noGroupSet"),
                            disabled: !0
                        }),
                        1 == e.isChatAi && s.push({
                            label: this.$t("newchat.userList.closeIsAI"),
                            onClick: function() {
                                a.closeAI(e)
                            }
                        }),
                        "archiveSessionChat" == this.sidebarNameStr ? s.push({
                            label: this.$t("newchat.userList.cancelArchive"),
                            onClick: function() {
                                a.batchSetArchive(e, 0)
                            }
                        }) : s.push({
                            label: this.$t("newchat.userList.archiveSession"),
                            onClick: function() {
                                a.batchSetArchive(e, 1)
                            }
                        });
                    return s.push({
                        label: this.batchOption ? this.$t("newchat.userList.closeBatchOption") : this.$t("newchat.userList.batchOption"),
                        onClick: function() {
                            a.batchOption = !a.batchOption
                        }
                    }),
                    this.$contextmenu({
                        items: s,
                        event: t,
                        customClass: "custom-class",
                        zIndex: 3,
                        minWidth: 100,
                        maxHeight: 500
                    }),
                    !1
                },
                topping: function(t) {
                    var e = this;
                    if (1 == t.isTop) {
                        var a = {
                            id: t.id,
                            isTop: 0
                        };
                        Object(r["Gb"])(a).then((function(a) {
                            t.isTop = 0,
                            e.$message.success(e.$t("newchat.userList.cancelTop"));
                            var s = e.usernameList.filter((function(t) {
                                if (1 == t.isTop)
                                    return !0
                            }
                            ))
                              , i = e.usernameList.indexOf(t)
                              , n = e.usernameList.splice(i, 1)[0];
                            e.usernameList.splice(s.length, 0, n)
                        }
                        ))
                    } else {
                        var s = {
                            id: t.id,
                            isTop: 1
                        };
                        Object(r["Gb"])(s).then((function(a) {
                            t.isTop = 1,
                            e.$message.success(e.$t("newchat.userList.successfullyTop"));
                            var s = e.usernameList.indexOf(t)
                              , i = e.usernameList.splice(s, 1)[0];
                            e.usernameList.unshift(i)
                        }
                        ))
                    }
                },
                pullIntoBlacklist: function(t) {
                    var e = this
                      , a = {
                        username: t.username,
                        csUsername: t.csUsername,
                        id: t.id
                    }
                      , s = "";
                    1 == t.isBlock ? (a.setType = 1,
                    s = this.$t("newchat.userList.cancelBlack")) : (a.setType = 0,
                    s = this.$t("newchat.userList.blackSuccess")),
                    Object(r["wb"])(a).then((function(a) {
                        t.isBlock = 1 == t.isBlock ? 0 : 1,
                        e.$store.dispatch("newChat/setBlock", t),
                        e.$message.success(s)
                    }
                    ))
                },
                dragstart: function(t) {
                    this.dragged = t.target
                },
                deleteDragged: function() {
                    this.dragged.parentNode.removeChild(this.dragged),
                    this.$message.success(this.$t("newchat.userList.moveSuccess"))
                },
                delSession2: function(t) {
                    var e = this;
                    this.usernameList.some((function(a, s) {
                        if (a.id == t)
                            return e.usernameList.splice(s, 1),
                            e.total -= 1,
                            e.activeNum = -1,
                            !0
                    }
                    ))
                },
                getGroupList: function() {
                    var t = this;
                    Object(r["Q"])().then((function(e) {
                        t.groupList = e.rows,
                        t.groupList.forEach((function(e) {
                            if (e.id > 6 && 100 != e.id) {
                                var a = {
                                    label: e.groupName,
                                    value: e.id,
                                    onClick: function() {
                                        t.setGroupSub(a)
                                    }
                                };
                                t.menuGroupList.push(a)
                            }
                        }
                        ))
                    }
                    ))
                },
                setGroupSub: function(t) {
                    var e = this
                      , a = {
                        id: t.value
                    };
                    this.batchOption ? a.ids = this.usernameList.filter((function(t) {
                        return t.checked
                    }
                    )).map((function(t) {
                        return t.id
                    }
                    )) : a.ids = [t.userItem.id];
                    var s = a.ids[0];
                    Object(r["zb"])(s, a).then((function(t) {
                        e.batchOption = !1,
                        e.$message.success(e.$t("newchat.userList.setGroupSuccess"))
                    }
                    ))
                },
                openFilterChat: function() {
                    var t = this;
                    this.filterChatVisible = !0,
                    this.filterLabelsLoading = !0,
                    Object(l["j"])().then((function(e) {
                        t.lableList = e.labelOptions,
                        t.filterLabelsLoading = !1
                    }
                    ))
                },
                filterChat: function() {
                    this.filterLabels = this.filterChatForm.labels.join(","),
                    this.filterAddType = this.filterChatForm.addType,
                    this.filterIsChatAi = this.filterChatForm.isChatAi,
                    this.getUsernameList(),
                    this.filterChatVisible = !1
                },
                cancelFilterChat: function() {
                    this.filterChatForm.labels = [],
                    this.filterChatForm.addType = [],
                    this.filterChatForm.isChatAi = "",
                    this.filterLabels = "",
                    this.filterAddType = "",
                    this.filterIsChatAi = "",
                    this.getUsernameList(),
                    this.filterChatVisible = !1
                },
                addSession: function(t, e) {
                    var a = this;
                    if ("" != t.csUsername && "" != t.username) {
                        if (0 == this.usernameList.length)
                            return this.usernameList.unshift(e),
                            this.total += 1,
                            void o["EventBus"].$emit("setSiderbarDot", !0);
                        var s = this.usernameList.filter((function(e) {
                            if (e.username == t.username && e.csUsername == t.csUsername)
                                return !0
                        }
                        ))
                          , i = this.usernameList.findLastIndex((function(t) {
                            return 1 == t.isTop
                        }
                        ))
                          , n = this.usernameList.filter((function(t) {
                            return 1 == t.isTop
                        }
                        )).length;
                        0 == s.length ? (1 == t.isTop ? this.usernameList.unshift(e) : i > -1 ? this.usernameList.splice(n, 0, e) : this.usernameList.unshift(e),
                        this.total += 1) : this.usernameList.forEach((function(e, s) {
                            if (e.username == t.username && e.csUsername == t.csUsername) {
                                var o = a.usernameList.splice(s, 1)[0];
                                1 == t.isTop ? a.usernameList.unshift(o) : i > -1 ? a.usernameList.splice(n, 0, o) : a.usernameList.unshift(o)
                            }
                        }
                        ))
                    }
                },
                changeSessionContent: function(t) {
                    var e = this
                      , a = t.sendInfo;
                    a && 2 == t.sendType && this.usernameList.forEach((function(t, s) {
                        if (t.username == a.username && t.csUsername == a.csUsername) {
                            if (e.$set(t, "sendTime", new Date),
                            1 == a.chatType)
                                a.latitude ? e.$set(t, "content", e.$t("newchat.userList.position")) : e.$set(t, "content", a.chatContent);
                            else if (2 == a.chatType)
                                switch (a.sms.type) {
                                case 4:
                                    e.$set(t, "content", e.$t("newchat.userList.audio"));
                                    break;
                                case 3:
                                    e.$set(t, "content", e.$t("newchat.userList.video"));
                                    break;
                                case 1:
                                    e.$set(t, "content", e.$t("newchat.userList.image"));
                                    break;
                                case 8:
                                    e.$set(t, "content", e.$t("newchat.userList.gif"));
                                    break;
                                case 5:
                                    e.$set(t, "content", e.$t("newchat.userList.expression"));
                                    break;
                                case 7:
                                    e.$set(t, "content", e.$t("newchat.userList.businessCard"));
                                    break;
                                case 9:
                                    e.$set(t, "content", e.$t("newchat.userList.link"));
                                    break;
                                case 2:
                                    e.$set(t, "content", e.$t("newchat.userList.file"));
                                    break;
                                case 10:
                                    e.$set(t, "content", e.$t("newchat.userList.position"));
                                    break;
                                default:
                                    e.$set(t, "content", e.$t("newchat.userList.message"));
                                    break
                                }
                            else
                                3 == a.chatType ? e.$set(t, "content", e.$t("newchat.userList.voiceCall")) : 4 == a.chatType ? e.$set(t, "content", e.$t("newchat.userList.voiceVideoCall")) : 6 == a.chatType && e.$set(t, "content", e.$t("newchat.userList.voiceMissedCalls"));
                            if (e.otherUsernameData.username != a.username || e.otherUsernameData.csUsername != a.csUsername) {
                                if (1 == a.isSend)
                                    return;
                                t.readNum += 1
                            }
                            0 != a.isSend || t.groupId || e.$set(t, "moveStatus", 0)
                        }
                    }
                    ))
                },
                clearUnread: function() {
                    var t = this;
                    this.$confirm(this.$t("newchat.userList.clearUnreadInfo"), this.$t("newchat.userList.tip"), {
                        confirmButtonText: this.$t("newchat.userList.confirm"),
                        cancelButtonText: this.$t("newchat.userList.cancel"),
                        type: "warning"
                    }).then((function() {
                        t.clearUnreadLoading = !0,
                        Object(r["n"])().then((function(e) {
                            t.$store.dispatch("newChat/setNoReadNum", 0),
                            o["EventBus"].$emit("setSiderbarDot", !1),
                            t.clearUnreadLoading = !1,
                            t.$message.success(t.$t("newchat.userList.clearUnreadSuccess")),
                            t.refreshUsernameList()
                        }
                        )).catch((function() {
                            t.clearUnreadLoading = !1
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                closeAI: function(t) {
                    var e = this;
                    this.$confirm(this.$t("newchat.chatwindow.closeAIInfo"), this.$t("newchat.chatwindow.tip"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        type: "warning"
                    }).then((function() {
                        var a = {
                            isChatAi: 0,
                            ids: [t.id]
                        };
                        Object(r["o"])(a).then((function(a) {
                            e.$message({
                                type: "success",
                                message: e.$t("newchat.chatwindow.closeSuccess")
                            }),
                            t.isChatAi = 0
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                batchCloseAI: function() {
                    var t = this
                      , e = this.usernameList.filter((function(t) {
                        return t.checked
                    }
                    )).map((function(t) {
                        return t.id
                    }
                    ));
                    this.$confirm(this.$t("newchat.chatwindow.closeAIInfo"), this.$t("newchat.chatwindow.tip"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        type: "warning"
                    }).then((function() {
                        var a = {
                            isChatAi: 0,
                            ids: e
                        };
                        Object(r["o"])(a).then((function(e) {
                            t.$message({
                                type: "success",
                                message: t.$t("newchat.chatwindow.closeSuccess")
                            }),
                            t.batchOption = !1,
                            t.getUsernameList()
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                batchSetRobotHosting: function() {
                    var t = this.usernameList.map((function(t) {
                        if (t.checked)
                            return t.id
                    }
                    ));
                    this.$confirm(this.$t("newchat.chatwindow.setRobotHostingInfo"), this.$t("newchat.chatwindow.tip"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        type: "warning"
                    }).then((function() {
                        console.log(t)
                    }
                    ))
                },
                batchSetArchive: function(t, e) {
                    var a = this
                      , s = [];
                    s = this.batchOption ? this.usernameList.filter((function(t) {
                        return t.checked
                    }
                    )).map((function(t) {
                        return t.id
                    }
                    )) : [t.id];
                    var i = e ? this.$t("newchat.chatwindow.setArchiveInfo") : this.$t("newchat.chatwindow.cancelArchiveInfo");
                    this.$confirm(i, this.$t("newchat.chatwindow.tip"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        type: "warning"
                    }).then((function() {
                        var t = {
                            isFile: e,
                            ids: s
                        };
                        Object(r["h"])(t).then((function(t) {
                            a.$message({
                                type: "success",
                                message: e ? a.$t("newchat.chatwindow.setArchiveSuccess") : a.$t("newchat.chatwindow.cancelArchiveSuccess")
                            }),
                            a.batchOption = !1,
                            a.getUsernameList(),
                            o["EventBus"].$emit("getNotRead")
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                }
            },
            destroyed: function() {
                this.$store.dispatch("newChat/setChatUsername", ""),
                this.$off("getSessionUsernameList"),
                this.$off("delSession2"),
                document.removeEventListener("keydown", this.handleKeydown)
            }
        }
          , p = m
          , g = (a("eea9"),
        a("2877"))
          , f = Object(g["a"])(p, s, i, !1, null, "d592bcf6", null);
        e["default"] = f.exports
    },
    cb39: function(t, e, a) {
        "use strict";
        a("4cbe")
    },
    d20b: function(t, e, a) {},
    d83a: function(t, e) {
        t.exports = "data:image/gif;base64,R0lGODlhyADIAOZLAGRlZsvLzI2NjmdoaX5/gEpLTT0+QMXFxePk5ENERTQ1N4yMjdbX19nZ2aipqTc4OU9QUa+wsV9gYbGxskdIST4/QXV2d6OkpWBhYuXl5dTU1XJydNLS087Pz+Dg4bCxsW5vcZGSk729vl1dX3x9ftbW1s/P0Hp6fPHx8a+vsEdISvDw8aenqNfX2Ds8PlFSVOLi4uvr615fYampqoWGh7S0tVlaXLy8vTk6PPv7++3t7Z+gocLCw29vcV1eYOPj5Pn5+ZucnaChoaKjpG9wcaSkpaamp3d3eTw9P/z8/DAxM////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMC1jMDAwIDc5LjE3MWMyN2ZhYiwgMjAyMi8wOC8xNi0yMjozNTo0MSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2NmJlNmQ4OC04NTkzLWJiNDEtYTcxYy04YjVjMmZhNTY3NTQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NkY2MTA1Mzg0MUNBMTFFRUFCNkRBNjY4RUVBMjA3ODYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NkY2MTA1Mzc0MUNBMTFFRUFCNkRBNjY4RUVBMjA3ODYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZjhkYjA5NzAtZTBkNC05YjQyLTg0NzctY2NmNjY5NWNlZjU5IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZDhmY2JhOWItZDU5OS1hMDRkLWFiYjItMjIwYmU4NDkxOTg2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEBRQASwAsAAAAAMgAyAAAB/+AS4KDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wADChxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJEiUDBwQKFCDggEFLSQIUKNnJU4GAm48S8BzKMwFQRguIKlWy4GiiA0uXHnB6SEJUpRKoGjJwlagBrYQQdFWKAKygAGOJBjC7BG1anmv1zbp9qyQu2Llv7WrFm1YvVb5j/ToF3FXwUcJXDQNFHFXxTcZLHbeErFQyS8pq2WIeannlZria6e7srPLz6NCiSac0XRc1XdUoWcM+Kdt1Xtt9cQfWXZh3Yt+NgUcWXpl4ZrmiWyNPbZxzc9BmMyTPwHZJBboVqi/BQBeD9gl0J2hfMiDtgPGCIHSFgH5QhAdKH0RoT6jBBQsUKFi40IC+//8ABijggAQWaOCBCCao4IIMNujggxBGKOGEFFZo4YUYZqjhhhx26OGHIIYo4ogklmjiiSimqOKKLLbo4oswxijjjDTWaOONOOao44489ujjj0BSEwgAIfkEBRQASwAsSwApABEAdgAAB+WAS4KDSxkaKISJghMYFUqPBSAdiksDj5eYAokQmJ2PIYMRnqMlSw0Po54DSxepoxwWrp4sFLKdJ7adALmYu7yPvr/BvMO5xbbHssmuy6nNo8+e0bq/wNVK073X2Zfc1tXe2Nvj4OTC5sToxurI7MruzPDO8tD00vbU5frn++n96//aBXw3MF7BeQfrJby3MB+/h/4gApQokCJBiwYxItSokCNDjw4jipw4smLJiyczpty4smPLj8QKVCNAoFoKB9VaMFDAa4QgAbxEDEpgi0SiBa4+UDogwcAlFRs8UCKEgMMKSoEAACH5BAUXAEsALGwAPgARAEwAAAe4gEuCg0kaRTw6g4qDHSAGSpBKMhOLggKRmJADiyGZnhCDJZ6jEYIDo54PDSaoo0I7rZ49RLGZSAC1mbi5kbu8Sr68wbnDtcWxx63JqMujzZ7Pur+Q0ZjVvdPA2dfU297T3Nrg37/h5uTC6MTqxuzI7srwzPLO9ND20uP65fjW/dj70gVcN7DWhmkVZkw7omGakSUjeClgsEQELwGDSNRKsOhDqwWVlnjY4AKTjwMhB+UwMeRGjEqBAAAh+QQFFABLACyNAEsAEgA3AAAHtYBLgoIMDgQFBQQODIONggIKSpKTCgKOggmTmpMJjguboEoLgwehoQeCEqagEoIGq5sGSwiwoAgBtZsBuLmTu72+vMC/wErEw8K9x8rJucvOzbXP0tGw09bVq9fa2abb3t2h3+LhoOPm5brpmufqxcbrwe/t7PGS9PLF+Pf28PP9+/zpo1UMwRIcwHAIsgHMhqAgwIIMepHrRaMfuX44AkLDFA0glwTVsEBBEgULNUJeggFDZSAAOw=="
    },
    d896: function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , s = t._self._c || e;
            return s("div", {
                staticClass: "main_box"
            }, ["group" == t.accountType ? s("div", {
                staticClass: "group-box"
            }, [s("div", {
                staticStyle: {
                    display: "flex",
                    margin: "5px"
                }
            }, [s("el-input", {
                attrs: {
                    placeholder: t.$t("newchat.input.filterKeywords"),
                    clearable: "",
                    size: "mini"
                },
                model: {
                    value: t.filterText,
                    callback: function(e) {
                        t.filterText = e
                    },
                    expression: "filterText"
                }
            }), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.userList.refresh"),
                    placement: "top-start"
                }
            }, [s("el-button", {
                staticClass: "addbut",
                attrs: {
                    type: "primary",
                    icon: "el-icon-refresh",
                    circle: ""
                },
                on: {
                    click: t.refreshAccountGroupList
                }
            })], 1)], 1), s("el-tree", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.getAccountGroupListLoading,
                    expression: "getAccountGroupListLoading"
                }],
                ref: "tree",
                staticClass: "account_tree",
                attrs: {
                    data: t.accountTreeData,
                    props: t.accountTreeProps,
                    load: t.loadNode,
                    lazy: "",
                    "node-key": "username",
                    "highlight-current": "",
                    "filter-node-method": t.filterNode
                },
                on: {
                    "node-click": t.accountTreeNodeClick
                },
                scopedSlots: t._u([{
                    key: "default",
                    fn: function(e) {
                        var i = e.node
                          , n = e.data;
                        return s("div", {
                            staticStyle: {
                                display: "flex",
                                "align-items": "center",
                                flex: "1",
                                width: "100px"
                            }
                        }, [n.leaf && n.login ? s("el-avatar", {
                            staticStyle: {
                                width: "20px",
                                height: "20px",
                                "margin-right": "5px"
                            },
                            attrs: {
                                src: n.avatarUrl ? n.avatarUrl : a("4d41")
                            },
                            nativeOn: {
                                mousedown: function(t) {
                                    t.preventDefault()
                                }
                            }
                        }) : t._e(), s("el-tooltip", {
                            attrs: {
                                content: i.label.toString(),
                                placement: "right",
                                "open-delay": 500
                            }
                        }, [n.leaf ? s("div", {
                            staticStyle: {
                                "text-overflow": "ellipsis",
                                overflow: "hidden",
                                "font-size": "14px"
                            }
                        }, [t._v(t._s(i.label))]) : s("div", {
                            staticStyle: {
                                "text-overflow": "ellipsis",
                                overflow: "hidden",
                                width: "100%",
                                "font-size": "14px"
                            }
                        }, [t._v(t._s(i.label))])])], 1)
                    }
                }], null, !1, 343655369)
            }), t.accountTreeLoadMore ? s("el-button", {
                staticStyle: {
                    width: "100%",
                    "text-align": "center"
                },
                attrs: {
                    type: "text",
                    size: "mini",
                    loading: t.accountTreeLoading
                },
                on: {
                    click: t.loadMoreAccountGroup
                }
            }, [t._v(" " + t._s(t.accountTreeData.length) + "/" + t._s(t.accountGroupTotal) + " " + t._s(t.$t("newchat.userList.loadMore")) + " ")]) : t._e()], 1) : "account" == t.accountType ? s("el-card", {
                staticClass: "box-card"
            }, [s("el-input", {
                staticClass: "search_inp",
                attrs: {
                    size: "mini",
                    placeholder: t.$t("newchat.input.enterAccount"),
                    "suffix-icon": "el-icon-search",
                    clearable: ""
                },
                on: {
                    change: t.searchChange
                },
                model: {
                    value: t.account,
                    callback: function(e) {
                        t.account = "string" === typeof e ? e.trim() : e
                    },
                    expression: "account"
                }
            }), s("el-radio-group", {
                staticStyle: {
                    "margin-bottom": "15px"
                },
                attrs: {
                    size: "mini"
                },
                on: {
                    input: t.radioChange
                },
                model: {
                    value: t.activeName,
                    callback: function(e) {
                        t.activeName = e
                    },
                    expression: "activeName"
                }
            }, [s("el-radio-button", {
                attrs: {
                    label: "online"
                }
            }, [t._v(" " + t._s(t.$t("newchat.accointLisy.online")) + " "), s("div", {
                staticClass: "notranslate",
                staticStyle: {
                    display: "inline-block"
                }
            }, [t._v("(" + t._s(t.onlineTotle) + ")")])]), s("el-radio-button", {
                attrs: {
                    label: "offline"
                }
            }, [t._v(" " + t._s(t.$t("newchat.accointLisy.offline")) + " "), s("div", {
                staticClass: "notranslate",
                staticStyle: {
                    display: "inline-block"
                }
            }, [t._v("(" + t._s(t.unOnlineTotle) + ")")])])], 1), "online" == t.activeName ? s("div", {
                directives: [{
                    name: "infinite-scroll",
                    rawName: "v-infinite-scroll",
                    value: t.load,
                    expression: "load"
                }, {
                    name: "loading",
                    rawName: "v-loading",
                    value: t.accountListLoading,
                    expression: "accountListLoading"
                }],
                ref: "user_list",
                staticClass: "user_list",
                staticStyle: {
                    overflow: "auto"
                },
                attrs: {
                    "infinite-scroll-delay": 500,
                    "infinite-scroll-distance": 10
                }
            }, [t._l(t.onlineAccountList, (function(e, i) {
                return s("div", {
                    key: e.username,
                    staticClass: "user_item_box"
                }, [s("div", {
                    staticClass: "user_item",
                    class: e.username == t.activeNum ? "user_item_active" : "",
                    on: {
                        click: function(a) {
                            return t.changeAccount(e, i)
                        }
                    }
                }, [s("el-badge", {
                    staticClass: "item",
                    attrs: {
                        value: e.readNum + e.groupReadCount,
                        hidden: e.readNum + e.groupReadCount <= 0,
                        max: 99
                    }
                }, [s("el-avatar", {
                    staticClass: "item_header",
                    attrs: {
                        src: e.avatarUrl ? e.avatarUrl : a("4d41")
                    },
                    nativeOn: {
                        mousedown: function(t) {
                            t.preventDefault()
                        }
                    }
                }), s("div", {
                    staticClass: "indexBox"
                }, [t._v(t._s(i + 1))])], 1), s("div", {
                    staticClass: "item_name"
                }, [e.pushName ? [s("div", {
                    staticClass: "iname"
                }, [t._v(t._s(e.pushName))]), s("div", {
                    staticClass: "inum"
                }, [t._v(t._s(e.login))]), s("div", {
                    staticClass: "notes"
                }, [s("span", [t._v(t._s(t.$t("newchat.accointLisy.notes")) + "：" + t._s(e.remark ? e.remark : "/"))]), s("i", {
                    staticClass: "el-icon-edit notes-hover",
                    staticStyle: {
                        "margin-left": "5px"
                    },
                    on: {
                        click: function(a) {
                            return a.stopPropagation(),
                            t.changeNotes(e)
                        }
                    }
                })])] : [s("div", {
                    staticClass: "iname"
                }, [t._v(t._s(e.login))]), s("div", {
                    staticClass: "notes"
                }, [s("span", [t._v(t._s(t.$t("newchat.accointLisy.notes")) + "：" + t._s(e.remark ? e.remark : "/"))]), s("i", {
                    staticClass: "el-icon-edit notes-hover",
                    staticStyle: {
                        "margin-left": "5px"
                    },
                    on: {
                        click: function(a) {
                            return a.stopPropagation(),
                            t.changeNotes(e)
                        }
                    }
                })])]], 2), 2 == e.status ? [s("el-tooltip", {
                    key: "sealedAccount",
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        content: t.$t("newchat.accointLisy.sealedAccount"),
                        placement: "right"
                    }
                }, [s("el-button", {
                    attrs: {
                        type: "info",
                        circle: "",
                        size: "mini"
                    }
                }, [t._v("封")])], 1)] : [s("el-tooltip", {
                    key: "top",
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        content: 1 == e.isTop ? t.$t("newchat.userList.cancelTop") : t.$t("newchat.userList.top"),
                        placement: "right"
                    }
                }, [s("div", {
                    on: {
                        click: function(a) {
                            return a.stopPropagation(),
                            t.topping(e)
                        }
                    }
                }, [1 == e.isTop ? s("i", {
                    staticClass: "el-icon-download",
                    staticStyle: {
                        color: "rgb(140, 197, 255)"
                    }
                }) : s("i", {
                    staticClass: "el-icon-upload2",
                    staticStyle: {
                        color: "#909399"
                    }
                })])])]], 2)])
            }
            )), s("div", {
                staticClass: "listPageBox notranslate"
            }, [t._v(" " + t._s(t.onlineAccountList.length) + " / " + t._s(t.onlineTotle) + " ")]), s("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.loadingIcon,
                    expression: "loadingIcon"
                }],
                staticClass: "icon-loading"
            }, [s("i", {
                staticClass: "el-icon-loading"
            })]), 0 == t.onlineAccountList.length ? s("el-empty", {
                attrs: {
                    description: t.$t("newchat.notice.nodata")
                }
            }) : t._e()], 2) : s("div", {
                directives: [{
                    name: "infinite-scroll",
                    rawName: "v-infinite-scroll",
                    value: t.load,
                    expression: "load"
                }, {
                    name: "loading",
                    rawName: "v-loading",
                    value: t.accountListLoading,
                    expression: "accountListLoading"
                }],
                ref: "user_list",
                staticClass: "user_list outline",
                staticStyle: {
                    overflow: "auto"
                },
                attrs: {
                    "infinite-scroll-delay": 500,
                    "infinite-scroll-distance": 10
                }
            }, [t._l(t.unOnlineAccountList, (function(e, i) {
                return s("div", {
                    key: e.username,
                    staticClass: "user_item_box"
                }, [s("div", {
                    staticClass: "user_item",
                    class: e.username == t.activeNum ? "user_item_active" : "",
                    on: {
                        click: function(a) {
                            return t.changeAccount(e, i)
                        }
                    }
                }, [s("el-badge", {
                    staticClass: "item",
                    attrs: {
                        value: e.readNum,
                        hidden: e.readNum <= 0,
                        max: 99
                    }
                }, [s("el-avatar", {
                    staticClass: "item_header",
                    attrs: {
                        src: e.avatarUrl ? e.avatarUrl : a("4d41")
                    },
                    nativeOn: {
                        mousedown: function(t) {
                            t.preventDefault()
                        }
                    }
                })], 1), s("div", {
                    staticClass: "item_name"
                }, [e.pushName ? [s("div", {
                    staticClass: "iname"
                }, [t._v(t._s(e.pushName))]), s("div", {
                    staticClass: "inum"
                }, [t._v(t._s(e.login))]), s("div", {
                    staticClass: "notes"
                }, [s("span", [t._v(t._s(t.$t("newchat.accointLisy.notes")) + "：" + t._s(e.remark ? e.remark : "/"))]), s("i", {
                    staticClass: "el-icon-edit notes-hover",
                    staticStyle: {
                        "margin-left": "5px"
                    },
                    on: {
                        click: function(a) {
                            return a.stopPropagation(),
                            t.changeNotes(e)
                        }
                    }
                })])] : [s("div", {
                    staticClass: "iname"
                }, [t._v(t._s(e.login))]), s("div", {
                    staticClass: "notes"
                }, [s("span", [t._v(t._s(t.$t("newchat.accointLisy.notes")) + "：" + t._s(e.remark ? e.remark : "/"))]), s("i", {
                    staticClass: "el-icon-edit notes-hover",
                    staticStyle: {
                        "margin-left": "5px"
                    },
                    on: {
                        click: function(a) {
                            return a.stopPropagation(),
                            t.changeNotes(e)
                        }
                    }
                })])]], 2)], 1), s("div", {
                    staticClass: "loginbut"
                }, [1 == e.status ? s("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        content: t.$t("newchat.accointLisy.login"),
                        placement: "top-start"
                    }
                }, [s("el-button", {
                    attrs: {
                        type: "success",
                        circle: "",
                        loading: e.loadingStatus
                    },
                    on: {
                        click: function(a) {
                            return t.loginAPI(e)
                        }
                    }
                }, [t._v(t._s(e.loadingStatus ? "" : "登"))])], 1) : 2 == e.status ? s("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        content: t.$t("newchat.accointLisy.sealedAccount"),
                        placement: "top-start"
                    }
                }, [s("el-button", {
                    attrs: {
                        type: "info",
                        circle: ""
                    }
                }, [t._v("封")])], 1) : s("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        content: t.$t("newchat.accointLisy.loginFailed"),
                        placement: "top-start"
                    }
                }, [s("el-button", {
                    attrs: {
                        icon: "el-icon-error",
                        type: "warning",
                        circle: "",
                        loading: e.loadingStatus
                    },
                    on: {
                        click: function(a) {
                            return t.loginAPI(e)
                        }
                    }
                })], 1)], 1)])
            }
            )), s("div", {
                staticClass: "listPageBox notranslate"
            }, [t._v(" " + t._s(t.unOnlineAccountList.length) + " / " + t._s(t.unOnlineTotle) + " ")]), s("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.loadingIcon,
                    expression: "loadingIcon"
                }],
                staticClass: "icon-loading"
            }, [s("i", {
                staticClass: "el-icon-loading"
            })]), 0 == t.unOnlineAccountList.length ? s("el-empty", {
                attrs: {
                    description: t.$t("newchat.notice.nodata")
                }
            }) : t._e()], 2)], 1) : t._e()], 1)
        }
          , i = []
          , n = a("c7eb")
          , o = a("1da1")
          , r = (a("d3b7"),
        a("159b"),
        a("4de4"),
        a("3c65"),
        a("99af"),
        a("b0c0"),
        a("d81d"),
        a("25f0"),
        a("c740"),
        a("a434"),
        a("498a"),
        a("488e"))
          , c = a("f77b")
          , l = a("2de3")
          , u = {
            props: {
                accountType: {
                    type: String,
                    default: "account"
                }
            },
            data: function() {
                return {
                    activeName: "online",
                    activeNum: -1,
                    account: "",
                    radioVal: "online",
                    accountList: [],
                    onlineAccountList: [],
                    unOnlineAccountList: [],
                    accountChatNum: 0,
                    accountUsername: "",
                    loadingIcon: !1,
                    cnaloading: !1,
                    accountListLoading: !0,
                    pageNum: 1,
                    pageSize: 100,
                    unOnlineTotle: 0,
                    onlineTotle: 0,
                    getAccountGroupListLoading: !1,
                    accountGroupPageNum: 1,
                    accountGroupPageSize: 50,
                    accountTreeLoadMore: !1,
                    accountGroupTotal: 0,
                    accountTreeLoading: !1,
                    filterText: "",
                    accountTreeData: [],
                    accountTreeProps: {
                        children: "children",
                        label: "name",
                        isLeaf: "leaf"
                    }
                }
            },
            computed: {
                webSocketData: function() {
                    return this.$store.state.newChat.socketData
                },
                chatUserNameData: function() {
                    return this.$store.state.newChat.chatUserNameData
                },
                setLoginStatus: function() {
                    return this.$store.state.newChat.setLoginStatus
                },
                custormStatus: function() {
                    return this.$store.state.newChat.custormStatus
                },
                accountUserNameData: function() {
                    return this.$store.state.newChat.accountUserNameData
                }
            },
            watch: {
                webSocketData: function(t) {
                    var e = this;
                    if (2 == t.sendType) {
                        var a = t.sendInfo;
                        if (!a)
                            return;
                        this.accountList.forEach((function(t, s) {
                            if (t.username == a.csUsername) {
                                if (a.isAi)
                                    return;
                                e.accountUserNameData.username == a.username && e.chatUserNameData.username == a.csUsername || (t.readNum += 1)
                            }
                        }
                        ));
                        var s = this.accountList.filter((function(t) {
                            if (t.username == a.csUsername)
                                return !0
                        }
                        ));
                        if (0 == s.length && "online" == this.activeName) {
                            var i = {
                                avatarUrl: "",
                                login: csUsername,
                                username: csUsernameStr,
                                pushName: csUsernameStr,
                                readNum: 1,
                                status: 1,
                                groupReadCount: 0
                            };
                            this.onlineAccountList.unshift(i),
                            this.onlineTotle += 1
                        }
                    } else if (102 == t.sendType) {
                        var n = t.groupSendVo;
                        if (!n)
                            return;
                        this.accountList.forEach((function(t, a) {
                            t.username == n.csUsernameStr && e.accountUserNameData.groupId != n.groupId && (t.groupReadCount += 1)
                        }
                        ))
                    }
                },
                accountUserNameData: function(t) {
                    this.accountList.forEach((function(e) {
                        if (0 == e.readNum)
                            return !1;
                        e.username == t.csUsername && (e.readNum -= t.readNum,
                        t.readNum = 0)
                    }
                    ))
                },
                setLoginStatus: function(t) {},
                custormStatus: function() {
                    var t = this.accountUserNameData;
                    this.accountList.forEach((function(e) {
                        if (0 == e.readNum)
                            return !1;
                        e.username == t.csUsername && (e.readNum -= t.readNum,
                        t.readNum = 0)
                    }
                    ))
                },
                filterText: function(t) {
                    this.$refs.tree.filter(t)
                }
            },
            mounted: function() {
                this.getAllList(),
                r["EventBus"].$on("sealedAccount", this.sealedAccount),
                r["EventBus"].$on("getAccountList", this.searchChange),
                this.getAccountGroupList()
            },
            methods: {
                getAllList: function() {
                    var t = this;
                    return Object(o["a"])(Object(n["a"])().mark((function e() {
                        var a;
                        return Object(n["a"])().wrap((function(e) {
                            while (1)
                                switch (e.prev = e.next) {
                                case 0:
                                    t.accountListLoading = !0,
                                    a = {
                                        csId: t.$store.state.user.userId,
                                        logged: 0,
                                        pushName: t.$store.state.user.userName,
                                        accountType: 0,
                                        pageSize: t.pageSize,
                                        pageNum: t.pageNum
                                    },
                                    Object(c["F"])(a).then((function(e) {
                                        t.unOnlineAccountList = e.accountList.rows,
                                        t.unOnlineTotle = e.accountList.total,
                                        t.getOnlineAccountListApi()
                                    }
                                    ));
                                case 3:
                                case "end":
                                    return e.stop()
                                }
                        }
                        ), e)
                    }
                    )))()
                },
                getOnlineAccountListApi: function() {
                    var t = this;
                    this.accountListLoading = !0;
                    var e = {
                        csId: this.$store.state.user.userId,
                        logged: 1,
                        pushName: this.$store.state.user.userName,
                        keyword: this.account,
                        accountType: 0,
                        pageSize: this.pageSize,
                        pageNum: this.pageNum
                    };
                    Object(c["F"])(e).then((function(e) {
                        t.onlineAccountList = e.accountList.rows,
                        t.onlineTotle = e.accountList.total,
                        t.onlineAccountList.length < t.onlineTotle ? (t.cnaloading = !0,
                        t.loadingIcon = !0) : (t.cnaloading = !1,
                        t.loadingIcon = !1),
                        t.accountList = e.accountList.rows,
                        t.accountListLoading = !1
                    }
                    ))
                },
                getUnOnlineAccountListApi: function() {
                    var t = this;
                    this.accountListLoading = !0;
                    var e = {
                        csId: this.$store.state.user.userId,
                        logged: 0,
                        pushName: this.$store.state.user.userName,
                        keyword: this.account,
                        accountType: 0,
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    };
                    Object(c["F"])(e).then((function(e) {
                        t.unOnlineAccountList = e.accountList.rows,
                        t.unOnlineTotle = e.accountList.total,
                        t.unOnlineAccountList.length < t.unOnlineTotle ? (t.cnaloading = !0,
                        t.loadingIcon = !0) : (t.cnaloading = !1,
                        t.loadingIcon = !1),
                        t.accountList = e.accountList.rows,
                        t.accountListLoading = !1
                    }
                    ))
                },
                changeAccount: function(t, e) {
                    this.activeNum = t.username,
                    this.accountUsername = t.username,
                    this.$store.dispatch("newChat/setAccountUsernameData", ""),
                    this.$store.dispatch("newChat/SET_CHAT_LOG_LIST", []),
                    this.$store.dispatch("newChat/setChatUsername", t)
                },
                load: function() {
                    var t = this;
                    if ("online" == this.activeName) {
                        if (this.onlineAccountList.length < this.onlineTotle && this.cnaloading) {
                            this.accountListLoading = !1,
                            this.cnaloading = !1,
                            this.pageNum++;
                            var e = {
                                csId: this.$store.state.user.userId,
                                logged: 1,
                                pushName: this.$store.state.user.userName,
                                keyword: this.account,
                                accountType: 0,
                                pageSize: this.pageSize,
                                pageNum: this.pageNum
                            };
                            Object(c["F"])(e).then((function(e) {
                                var a = e.accountList.rows.filter((function(e) {
                                    return t.onlineAccountList.every((function(t) {
                                        return e.username !== t.username
                                    }
                                    ))
                                }
                                ));
                                t.onlineAccountList = t.onlineAccountList.concat(a),
                                t.onlineTotle = e.accountList.total,
                                t.onlineAccountList.length < t.onlineTotle ? (t.loadingIcon = !0,
                                t.cnaloading = !0) : (t.loadingIcon = !1,
                                t.cnaloading = !1),
                                t.accountListLoading = !1
                            }
                            ))
                        }
                    } else if ("offline" == this.activeName && this.unOnlineAccountList.length < this.unOnlineTotle && this.cnaloading) {
                        this.accountListLoading = !1,
                        this.cnaloading = !1,
                        this.pageNum++;
                        var a = {
                            csId: this.$store.state.user.userId,
                            logged: 0,
                            pushName: this.$store.state.user.userName,
                            keyword: this.account,
                            accountType: 0,
                            pageSize: this.pageSize,
                            pageNum: this.pageNum
                        };
                        Object(c["F"])(a).then((function(e) {
                            var a = e.accountList.rows.filter((function(e) {
                                return t.unOnlineAccountList.every((function(t) {
                                    return e.username !== t.username
                                }
                                ))
                            }
                            ));
                            t.unOnlineAccountList = t.unOnlineAccountList.concat(a),
                            t.unOnlineTotle = e.accountList.total,
                            t.unOnlineAccountList.length < t.unOnlineTotle ? (t.loadingIcon = !0,
                            t.cnaloading = !0) : (t.loadingIcon = !1,
                            t.cnaloading = !1),
                            t.accountListLoading = !1
                        }
                        ))
                    }
                },
                radioChange: function(t) {
                    this.activeNum = -1,
                    this.pageNum = 1,
                    this.loadingIcon = !1,
                    this.cnaloading = !1,
                    this.$store.dispatch("newChat/setAccountUsernameData", ""),
                    this.$store.dispatch("newChat/SET_CHAT_LOG_LIST", []),
                    this.$store.dispatch("newChat/setChatUsername", ""),
                    this.$refs.user_list.scrollTop = 0,
                    this.accountListLoading = !0,
                    this.radioVal = t,
                    "online" == t ? this.getOnlineAccountListApi() : "offline" == t && this.getUnOnlineAccountListApi()
                },
                searchChange: function() {
                    this.pageNum = 1,
                    "online" == this.radioVal ? this.getOnlineAccountListApi() : "offline" == this.radioVal && this.getUnOnlineAccountListApi()
                },
                loginAPI: function(t) {
                    var e = this
                      , a = {
                        username: t.username
                    };
                    Object(l["L"])(a).then((function(a) {
                        e.$message.success(e.$t("newchat.accointLisy.loginSucceededInfo")),
                        e.$set(t, "loadingStatus", !0)
                    }
                    ))
                },
                sealedAccount: function(t) {
                    var e = t.accountVo
                      , a = this.onlineAccountList;
                    a.forEach((function(t) {
                        t.username == e.username && (t.status = 2)
                    }
                    ))
                },
                getAccountGroupList: function() {
                    var t = this;
                    this.getAccountGroupListLoading = !0;
                    var e = {
                        pageNum: this.accountGroupPageNum,
                        pageSize: this.accountGroupPageSize
                    };
                    Object(c["E"])(e).then((function(e) {
                        e.rows.forEach((function(t) {
                            t.name = "(".concat(t.online, ") ").concat(t.groupName),
                            t.pageNum = 1,
                            t.pageSize = 999999999,
                            0 == t.online && (t.leaf = !0)
                        }
                        )),
                        t.accountGroupTotal = e.total,
                        t.accountTreeData = e.rows,
                        t.getAccountGroupListLoading = !1,
                        t.accountTreeData.length < e.total ? t.accountTreeLoadMore = !0 : t.accountTreeLoadMore = !1
                    }
                    )).catch((function(e) {
                        t.getAccountGroupListLoading = !1
                    }
                    ))
                },
                loadMoreAccountGroup: function() {
                    var t = this;
                    this.accountTreeLoading = !0,
                    this.accountGroupPageNum++;
                    var e = {
                        pageNum: this.accountGroupPageNum,
                        pageSize: this.accountGroupPageSize
                    };
                    Object(c["E"])(e).then((function(e) {
                        e.rows.forEach((function(t) {
                            t.name = "(".concat(t.online, ") ").concat(t.groupName),
                            t.pageNum = 1,
                            t.pageSize = 999999999,
                            0 == t.online && (t.leaf = !0)
                        }
                        )),
                        t.accountTreeData = t.accountTreeData.concat(e.rows),
                        t.accountTreeLoading = !1,
                        t.accountTreeData.length < e.total ? t.accountTreeLoadMore = !0 : t.accountTreeLoadMore = !1
                    }
                    )).catch((function(e) {
                        t.accountTreeLoading = !1
                    }
                    ))
                },
                refreshAccountGroupList: function() {
                    this.filterText = "",
                    this.accountGroupPageNum = 1,
                    this.getAccountGroupList()
                },
                loadNode: function(t, e) {
                    if (0 === t.level && e(this.accountTreeData),
                    t.level > 0) {
                        var a = {
                            csId: this.$store.state.user.userId,
                            pushName: this.$store.state.user.userName,
                            accountType: 0,
                            pageNum: t.data.pageNum,
                            pageSize: t.data.pageSize,
                            groupId: t.data.id,
                            logged: 1
                        };
                        Object(c["F"])(a).then((function(t) {
                            var a = t.accountList.rows.map((function(t) {
                                return {
                                    username: t.username,
                                    pushName: t.pushName,
                                    login: t.login,
                                    avatarUrl: t.avatarUrl,
                                    readNum: 0,
                                    groupReadCount: 0,
                                    name: t.login,
                                    status: t.status,
                                    leaf: !0
                                }
                            }
                            ));
                            e(a)
                        }
                        ))
                    }
                },
                accountTreeNodeClick: function(t) {
                    t.leaf && (console.log(t),
                    t.login && this.changeAccount(t))
                },
                filterNode: function(t, e) {
                    if (!t)
                        return !0;
                    var a = e.name.toString();
                    return -1 !== a.indexOf(t)
                },
                topping: function(t) {
                    var e = this
                      , a = {
                        username: t.username,
                        isTop: 1 == t.isTop ? 0 : 1
                    };
                    Object(c["vb"])(a).then((function(a) {
                        t.isTop = 1 == t.isTop ? 0 : 1;
                        var s = e.accountList.findIndex((function(e) {
                            return e.username == t.username
                        }
                        ))
                          , i = e.accountList.splice(s, 1);
                        if (1 == t.isTop)
                            e.accountList.unshift(i[0]);
                        else {
                            var n = e.accountList.filter((function(t) {
                                return 1 == t.isTop
                            }
                            )).length;
                            e.accountList.splice(n, 0, i[0])
                        }
                        e.$message.success(1 == t.isTop ? e.$t("newchat.userList.topSucceeded") : e.$t("newchat.userList.cancelTopSucceeded"))
                    }
                    ))
                },
                changeNotes: function(t) {
                    var e = this;
                    this.$prompt(this.$t("newchat.accointLisy.enterRemark"), this.$t("newchat.accointLisy.tip"), {
                        confirmButtonText: this.$t("newchat.accointLisy.confirm"),
                        cancelButtonText: this.$t("newchat.accointLisy.cancel"),
                        inputValue: t.remark,
                        closeOnClickModal: !1
                    }).then((function(a) {
                        var s = a.value
                          , i = {
                            username: t.username,
                            remark: s.trim()
                        };
                        Object(c["Hb"])(i).then((function(a) {
                            t.remark = i.remark,
                            e.$message.success(e.$t("newchat.accointLisy.editSucceeded"))
                        }
                        )).catch((function() {}
                        ))
                    }
                    )).catch((function() {}
                    ))
                }
            },
            destroyed: function() {
                r["EventBus"].$off("sealedAccount"),
                r["EventBus"].$off("getAccountList"),
                this.$store.dispatch("newChat/setChatUsername", "")
            }
        }
          , d = u
          , h = (a("b09f"),
        a("2877"))
          , m = Object(h["a"])(d, s, i, !1, null, "4e54d138", null);
        e["default"] = m.exports
    },
    dc43: function(t, e, a) {
        "use strict";
        a("6f10")
    },
    dc98: function(t, e, a) {
        "use strict";
        a("c2cf")
    },
    dd74: function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("div", {
                staticClass: "mian-box",
                class: 0 == t.itemData.isSen ? "left-box" : "right-box"
            }, [1 == t.itemData.isSend ? a("el-card", {
                staticClass: "box-card",
                nativeOn: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onMyContextmenu(e, t.itemData)
                    }
                }
            }, [a("div", {
                staticClass: "card-top"
            }, [a("div", {
                staticStyle: {
                    display: "flex"
                }
            }, [a("div", {
                staticClass: "left"
            }, [t.itemData.thumbnail ? [a("el-image", {
                staticStyle: {
                    width: "60px",
                    height: "60px"
                },
                attrs: {
                    src: t.itemData.thumbnail,
                    fit: "cover"
                }
            })] : [a("div", {
                staticClass: "noImage"
            }, [t._v(t._s(t.$t("newchat.materialLibrary.noImage")))])]], 2), a("div", {
                staticClass: "right"
            }, [a("div", {
                staticClass: "title"
            }, [t._v(t._s(t.itemData.title))]), "12" == t.itemData.sType ? a("div", {
                staticClass: "content-box text-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(t._s(t.itemData.text))]) : t._e(), a("div", {
                staticClass: "content-box body-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(t._s(t.itemData.body))])])])]), a("div", {
                staticClass: "card-bot"
            }, [t.itemData.sourceUrls ? t._l(t.itemData.sourceUrls, (function(e) {
                return a("div", {
                    key: e.sourceUrl
                }, [a("el-link", {
                    attrs: {
                        href: e.sourceUrl || e.text,
                        target: "_blank",
                        type: "info"
                    },
                    nativeOn: {
                        click: function(t) {
                            t.stopPropagation()
                        }
                    }
                }, [t._v(t._s(t.$t("newchat.materialLibrary.link")) + "：" + t._s(e.sourceUrl || e.text || "/"))])], 1)
            }
            )) : [a("el-link", {
                attrs: {
                    href: t.itemData.sourceUrl || t.itemData.text,
                    target: "_blank",
                    type: "info"
                },
                nativeOn: {
                    click: function(t) {
                        t.stopPropagation()
                    }
                }
            }, [t._v(t._s(t.$t("newchat.materialLibrary.link")) + "：" + t._s(t.itemData.sourceUrl || t.itemData.text || "/"))])]], 2)]) : a("el-card", {
                staticClass: "box-card",
                nativeOn: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onOtherContextmenu(e, t.itemData)
                    }
                }
            }, [a("div", {
                staticClass: "card-top"
            }, [a("div", {
                staticStyle: {
                    display: "flex"
                }
            }, [a("div", {
                staticClass: "left"
            }, [t.itemData.thumbnail ? [a("el-image", {
                staticStyle: {
                    width: "60px",
                    height: "60px"
                },
                attrs: {
                    src: t.itemData.thumbnail,
                    fit: "cover"
                }
            })] : [a("div", {
                staticClass: "noImage"
            }, [t._v(t._s(t.$t("newchat.materialLibrary.noImage")))])]], 2), a("div", {
                staticClass: "right"
            }, [a("div", {
                staticClass: "title"
            }, [t._v(t._s(t.itemData.title))]), "12" == t.itemData.sType ? a("div", {
                staticClass: "content-box text-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(t._s(t.itemData.text))]) : t._e(), a("div", {
                staticClass: "content-box body-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t._v(t._s(t.itemData.body))])])])]), a("div", {
                staticClass: "card-bot"
            }, [a("div", {
                staticStyle: {
                    "padding-top": "5px",
                    "text-align": "left"
                },
                on: {
                    click: function(t) {
                        t.stopPropagation()
                    }
                }
            }, [t.itemData.sourceUrls ? t._l(t.itemData.sourceUrls, (function(e) {
                return a("div", {
                    key: e.sourceUrl
                }, [a("el-link", {
                    attrs: {
                        href: e.sourceUrl || e.text,
                        target: "_blank",
                        type: "info"
                    }
                }, [t._v(t._s(t.$t("newchat.materialLibrary.link")) + "：" + t._s(e.sourceUrl || e.text || "/"))])], 1)
            }
            )) : [a("el-link", {
                attrs: {
                    href: t.itemData.sourceUrl || t.itemData.text,
                    target: "_blank",
                    type: "info"
                }
            }, [t._v(t._s(t.$t("newchat.materialLibrary.link")) + "：" + t._s(t.itemData.sourceUrl || t.itemData.text || "/"))])]], 2)])]), 1 == t.itemData.isSendType ? a("div", {
                staticClass: "loading-icon"
            }, [a("i", {
                staticClass: "el-icon-loading"
            })]) : t._e()], 1)
        }
          , i = []
          , n = a("6b98")
          , o = {
            mixins: [n["a"]],
            props: ["itemData"],
            data: function() {
                return {}
            },
            computed: {},
            mounted: function() {},
            methods: {}
        }
          , r = o
          , c = (a("b55c"),
        a("2877"))
          , l = Object(c["a"])(r, s, i, !1, null, "c27b8636", null);
        e["default"] = l.exports
    },
    e410: function(t, e, a) {
        "use strict";
        a("2db9")
    },
    e6ca: function(t, e, a) {
        "use strict";
        a("0505")
    },
    e7b7: function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("el-card", {
                staticClass: "box-card"
            }, [a("div", {
                staticClass: "bar-list",
                class: 0 == t.activeNum ? "bar-list-active" : "",
                on: {
                    click: function(e) {
                        return t.changeTab(0, "accountChat")
                    }
                }
            }, [a("i", {
                staticClass: "el-icon-user icon"
            }), a("div", {
                staticClass: "title"
            }, [t._v(t._s(t.$t("newchat.sidebar.account")))])]), t.$store.getters.isAccountGroup ? a("div", {
                staticClass: "bar-list",
                class: 5 == t.activeNum ? "bar-list-active" : "",
                on: {
                    click: function(e) {
                        return t.changeTab(5, "accountChatGroup")
                    }
                }
            }, [a("i", {
                staticClass: "el-icon-user icon"
            }), a("div", {
                staticClass: "title"
            }, [t._v(t._s(t.$t("newchat.sidebar.accountGroup")))])]) : t._e(), a("div", {
                staticClass: "bar-list",
                class: 1 == t.activeNum ? "bar-list-active" : "",
                on: {
                    click: function(e) {
                        return t.changeTab(1, "groupChat")
                    }
                }
            }, [a("i", {
                staticClass: "el-icon-copy-document icon"
            }), a("div", {
                staticClass: "title"
            }, [t._v(t._s(t.$t("newchat.sidebar.sessionGrouping")))])]), a("div", {
                staticClass: "bar-list",
                class: 2 == t.activeNum ? "bar-list-active" : "",
                on: {
                    click: function(e) {
                        return t.changeTab(2, "allSessionChat")
                    }
                }
            }, [a("i", {
                staticClass: "el-icon-chat-line-round icon"
            }), a("div", {
                staticClass: "title"
            }, [t._v(t._s(t.$t("newchat.sidebar.allSessions")))])]), a("div", {
                staticClass: "bar-list",
                class: 3 == t.activeNum ? "bar-list-active" : "",
                on: {
                    click: function(e) {
                        return t.changeTab(3, "noReadSessionChat")
                    }
                }
            }, [a("el-badge", {
                staticClass: "item",
                attrs: {
                    "is-dot": t.siderbarDot
                }
            }, [a("i", {
                staticClass: "el-icon-chat-dot-round icon"
            }), a("div", {
                staticClass: "title"
            }, [t._v(t._s(t.$t("newchat.sidebar.unreadSessions")))])])], 1), a("div", {
                staticClass: "bar-list",
                class: 4 == t.activeNum ? "bar-list-active" : "",
                on: {
                    click: function(e) {
                        return t.changeTab(4, "topSessionChat")
                    }
                }
            }, [a("i", {
                staticClass: "el-icon-upload2 icon"
            }), a("div", {
                staticClass: "title"
            }, [t._v(t._s(t.$t("newchat.sidebar.toppingSessions")))])]), a("div", {
                staticClass: "bar-list",
                class: 6 == t.activeNum ? "bar-list-active" : "",
                on: {
                    click: function(e) {
                        return t.changeTab(6, "archiveSessionChat")
                    }
                }
            }, [a("i", {
                staticClass: "el-icon-folder-opened icon"
            }), a("div", {
                staticClass: "title"
            }, [t._v(t._s(t.$t("newchat.sidebar.archiveSessions")))])]), a("div", {
                staticClass: "bar-list",
                on: {
                    click: t.setingTtranslate
                }
            }, [a("i", {
                staticClass: "el-icon-setting icon"
            }), a("div", {
                staticClass: "title"
            }, [t._v(t._s(t.$t("newchat.sidebar.translationSettings")))])]), a("div", {
                ref: "horn-box",
                staticClass: "bar-list horn-box",
                on: {
                    click: t.openAudio
                }
            }, [a("audio", {
                ref: "audio",
                attrs: {
                    src: t.audioSrc
                }
            }), a("svg-icon", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: !t.audioIsOpen,
                    expression: "!audioIsOpen"
                }],
                attrs: {
                    "icon-class": "hornClose"
                }
            }), a("svg-icon", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.audioIsOpen,
                    expression: "audioIsOpen"
                }],
                attrs: {
                    "icon-class": "horn"
                }
            })], 1), a("NetWorkCondition", {
                staticClass: "netWork"
            }), a("el-dialog", {
                attrs: {
                    title: t.$t("newchat.sidebar.translationSettings"),
                    visible: t.translateVisible,
                    center: "",
                    width: "500px"
                },
                on: {
                    "update:visible": function(e) {
                        t.translateVisible = e
                    },
                    open: t.translateopen,
                    close: t.translateclose,
                    "before-close": t.translateclose
                }
            }, [a("el-form", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.translateLoading,
                    expression: "translateLoading"
                }],
                ref: "form",
                attrs: {
                    model: t.form,
                    "label-width": "150px"
                }
            }, [a("el-form-item", {
                staticStyle: {
                    "word-break": "break-word"
                },
                attrs: {
                    label: t.$t("newchat.sidebar.enableTranslation")
                }
            }, [a("el-switch", {
                on: {
                    change: t.sendAutoTranslateChange
                },
                model: {
                    value: t.autoTranslatebutton,
                    callback: function(e) {
                        t.autoTranslatebutton = e
                    },
                    expression: "autoTranslatebutton"
                }
            })], 1), a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.sidebar.sendTranslation")
                }
            }, [a("el-select", {
                staticStyle: {
                    "margin-bottom": "10px"
                },
                attrs: {
                    placeholder: t.$t("newchat.sidebar.selectSourceLang"),
                    clearable: "",
                    filterable: "",
                    loading: t.translateListLoading
                },
                on: {
                    change: function(e) {
                        return t.submitTranslateSetting(1)
                    }
                },
                model: {
                    value: t.form.sendSourceValue,
                    callback: function(e) {
                        t.$set(t.form, "sendSourceValue", e)
                    },
                    expression: "form.sendSourceValue"
                }
            }, t._l(t.sourceLangOptions, (function(e) {
                return a("el-option", {
                    key: e.value,
                    attrs: {
                        label: t.$t("newchat.translate." + e.value),
                        value: e.value
                    }
                })
            }
            )), 1)], 1), a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.sidebar.translateTo")
                }
            }, [a("el-select", {
                attrs: {
                    placeholder: t.$t("newchat.sidebar.selectTargetLang"),
                    clearable: "",
                    filterable: "",
                    loading: t.translateListLoading
                },
                on: {
                    change: function(e) {
                        return t.submitTranslateSetting(1)
                    }
                },
                model: {
                    value: t.form.sendTargetValue,
                    callback: function(e) {
                        t.$set(t.form, "sendTargetValue", e)
                    },
                    expression: "form.sendTargetValue"
                }
            }, t._l(t.targetLangOptions, (function(e) {
                return a("el-option", {
                    key: e.value,
                    attrs: {
                        label: t.$t("newchat.translate." + e.value),
                        value: e.value
                    }
                })
            }
            )), 1)], 1), a("el-form-item", {
                staticStyle: {
                    "word-break": "break-word"
                },
                attrs: {
                    label: t.$t("newchat.sidebar.enableTranslationReceive")
                }
            }, [a("el-switch", {
                on: {
                    change: t.receiveAutoTranslateChange
                },
                model: {
                    value: t.isAutoReceive,
                    callback: function(e) {
                        t.isAutoReceive = e
                    },
                    expression: "isAutoReceive"
                }
            })], 1), a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.sidebar.receiveTranslation")
                }
            }, [a("el-select", {
                staticStyle: {
                    "margin-bottom": "10px"
                },
                attrs: {
                    placeholder: t.$t("newchat.sidebar.selectSourceLang"),
                    clearable: "",
                    filterable: "",
                    loading: t.translateListLoading
                },
                on: {
                    change: function(e) {
                        return t.submitTranslateSetting(0)
                    }
                },
                model: {
                    value: t.form.readSourceValue,
                    callback: function(e) {
                        t.$set(t.form, "readSourceValue", e)
                    },
                    expression: "form.readSourceValue"
                }
            }, t._l(t.sourceLangOptions, (function(e) {
                return a("el-option", {
                    key: e.value,
                    attrs: {
                        label: t.$t("newchat.translate." + e.value),
                        value: e.value
                    }
                })
            }
            )), 1)], 1), a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.sidebar.translateTo")
                }
            }, [a("el-select", {
                attrs: {
                    placeholder: t.$t("newchat.sidebar.selectTargetLang"),
                    clearable: "",
                    filterable: "",
                    loading: t.translateListLoading
                },
                on: {
                    change: function(e) {
                        return t.submitTranslateSetting(0)
                    }
                },
                model: {
                    value: t.form.readTargetValue,
                    callback: function(e) {
                        t.$set(t.form, "readTargetValue", e)
                    },
                    expression: "form.readTargetValue"
                }
            }, t._l(t.targetLangOptions, (function(e) {
                return a("el-option", {
                    key: e.value,
                    attrs: {
                        label: t.$t("newchat.translate." + e.value),
                        value: e.value
                    }
                })
            }
            )), 1)], 1), a("el-divider"), a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.sidebar.timeArea")
                }
            }, [a("el-select", {
                attrs: {
                    placeholder: t.$t("newchat.sidebar.pleaseSelect"),
                    filterable: ""
                },
                on: {
                    change: t.changeTimeArea
                },
                model: {
                    value: t.timeArea,
                    callback: function(e) {
                        t.timeArea = e
                    },
                    expression: "timeArea"
                }
            }, t._l(t.momentTzNames, (function(t) {
                return a("el-option", {
                    key: t,
                    attrs: {
                        label: t,
                        value: t
                    }
                })
            }
            )), 1)], 1), a("el-form-item", [a("el-button", {
                attrs: {
                    type: "warning",
                    size: "mini"
                },
                on: {
                    click: t.clearAllGroupChat
                }
            }, [t._v(t._s(t.$t("newchat.userList.clearAllGroupChat")))])], 1)], 1)], 1)], 1)
        }
          , i = []
          , n = (a("d3b7"),
        a("159b"),
        a("14d9"),
        a("ac1f"),
        a("5319"),
        a("caad"),
        a("2532"),
        a("f77b"))
          , o = a("852e")
          , r = a.n(o)
          , c = a("6c36")
          , l = a("488e")
          , u = a("7f45")
          , d = a.n(u)
          , h = {
            components: {
                NetWorkCondition: c["a"]
            },
            data: function() {
                return {
                    activeNum: 0,
                    dialogVisible: !1,
                    sourceLangOptions: [{
                        label: this.$t("newchat.translate.auto"),
                        value: "auto"
                    }, {
                        label: this.$t("newchat.translate.zh"),
                        value: "zh"
                    }, {
                        label: this.$t("newchat.translate.en"),
                        value: "en"
                    }, {
                        label: this.$t("newchat.translate.jp"),
                        value: "jp"
                    }, {
                        label: this.$t("newchat.translate.kor"),
                        value: "kor"
                    }, {
                        label: this.$t("newchat.translate.fra"),
                        value: "fra"
                    }, {
                        label: this.$t("newchat.translate.pt"),
                        value: "pt"
                    }, {
                        label: this.$t("newchat.translate.spa"),
                        value: "spa"
                    }, {
                        label: this.$t("newchat.translate.de"),
                        value: "de"
                    }, {
                        label: this.$t("newchat.translate.it"),
                        value: "it"
                    }, {
                        label: this.$t("newchat.translate.ara"),
                        value: "ara"
                    }, {
                        label: this.$t("newchat.translate.el"),
                        value: "el"
                    }, {
                        label: this.$t("newchat.translate.id"),
                        value: "id"
                    }, {
                        label: this.$t("newchat.translate.hi"),
                        value: "hi"
                    }, {
                        label: this.$t("newchat.translate.vie"),
                        value: "vie"
                    }, {
                        label: this.$t("newchat.translate.th"),
                        value: "th"
                    }, {
                        label: this.$t("newchat.translate.may"),
                        value: "may"
                    }, {
                        label: this.$t("newchat.translate.ben"),
                        value: "ben"
                    }, {
                        label: this.$t("newchat.translate.bur"),
                        value: "bur"
                    }, {
                        label: this.$t("newchat.translate.aze"),
                        value: "aze"
                    }, {
                        label: this.$t("newchat.translate.ru"),
                        value: "ru"
                    }, {
                        label: this.$t("newchat.translate.tr"),
                        value: "tr"
                    }, {
                        label: this.$t("newchat.translate.hkm"),
                        value: "hkm"
                    }, {
                        label: this.$t("newchat.translate.ukr"),
                        value: "ukr"
                    }, {
                        label: this.$t("newchat.translate.ro"),
                        value: "ro"
                    }, {
                        label: this.$t("newchat.translate.pl"),
                        value: "pl"
                    }, {
                        label: this.$t("newchat.translate.hr"),
                        value: "hr"
                    }, {
                        label: this.$t("newchat.translate.hu"),
                        value: "hu"
                    }, {
                        label: this.$t("newchat.translate.nl"),
                        value: "nl"
                    }, {
                        label: this.$t("newchat.translate.fi"),
                        value: "fi"
                    }, {
                        label: this.$t("newchat.translate.sv"),
                        value: "sv"
                    }, {
                        label: this.$t("newchat.translate.kk"),
                        value: "kk"
                    }, {
                        label: this.$t("newchat.translate.bg"),
                        value: "bg"
                    }, {
                        label: this.$t("newchat.translate.hy"),
                        value: "hy"
                    }, {
                        label: this.$t("newchat.translate.lt"),
                        value: "lt"
                    }, {
                        label: this.$t("newchat.translate.cs"),
                        value: "cs"
                    }, {
                        label: this.$t("newchat.translate.ga"),
                        value: "ga"
                    }, {
                        label: this.$t("newchat.translate.uz"),
                        value: "uz"
                    }, {
                        label: this.$t("newchat.translate.ka"),
                        value: "ka"
                    }, {
                        label: this.$t("newchat.translate.sk"),
                        value: "sk"
                    }],
                    targetLangOptions: [{
                        label: this.$t("newchat.translate.zh"),
                        value: "zh"
                    }, {
                        label: this.$t("newchat.translate.en"),
                        value: "en"
                    }, {
                        label: this.$t("newchat.translate.jp"),
                        value: "jp"
                    }, {
                        label: this.$t("newchat.translate.kor"),
                        value: "kor"
                    }, {
                        label: this.$t("newchat.translate.fra"),
                        value: "fra"
                    }, {
                        label: this.$t("newchat.translate.pt"),
                        value: "pt"
                    }, {
                        label: this.$t("newchat.translate.spa"),
                        value: "spa"
                    }, {
                        label: this.$t("newchat.translate.de"),
                        value: "de"
                    }, {
                        label: this.$t("newchat.translate.it"),
                        value: "it"
                    }, {
                        label: this.$t("newchat.translate.ara"),
                        value: "ara"
                    }, {
                        label: this.$t("newchat.translate.el"),
                        value: "el"
                    }, {
                        label: this.$t("newchat.translate.id"),
                        value: "id"
                    }, {
                        label: this.$t("newchat.translate.hi"),
                        value: "hi"
                    }, {
                        label: this.$t("newchat.translate.vie"),
                        value: "vie"
                    }, {
                        label: this.$t("newchat.translate.th"),
                        value: "th"
                    }, {
                        label: this.$t("newchat.translate.may"),
                        value: "may"
                    }, {
                        label: this.$t("newchat.translate.ben"),
                        value: "ben"
                    }, {
                        label: this.$t("newchat.translate.bur"),
                        value: "bur"
                    }, {
                        label: this.$t("newchat.translate.aze"),
                        value: "aze"
                    }, {
                        label: this.$t("newchat.translate.ru"),
                        value: "ru"
                    }, {
                        label: this.$t("newchat.translate.tr"),
                        value: "tr"
                    }, {
                        label: this.$t("newchat.translate.hkm"),
                        value: "hkm"
                    }, {
                        label: this.$t("newchat.translate.ukr"),
                        value: "ukr"
                    }, {
                        label: this.$t("newchat.translate.ro"),
                        value: "ro"
                    }, {
                        label: this.$t("newchat.translate.pl"),
                        value: "pl"
                    }, {
                        label: this.$t("newchat.translate.hr"),
                        value: "hr"
                    }, {
                        label: this.$t("newchat.translate.hu"),
                        value: "hu"
                    }, {
                        label: this.$t("newchat.translate.nl"),
                        value: "nl"
                    }, {
                        label: this.$t("newchat.translate.fi"),
                        value: "fi"
                    }, {
                        label: this.$t("newchat.translate.sv"),
                        value: "sv"
                    }, {
                        label: this.$t("newchat.translate.kk"),
                        value: "kk"
                    }, {
                        label: this.$t("newchat.translate.bg"),
                        value: "bg"
                    }, {
                        label: this.$t("newchat.translate.hy"),
                        value: "hy"
                    }, {
                        label: this.$t("newchat.translate.lt"),
                        value: "lt"
                    }, {
                        label: this.$t("newchat.translate.cs"),
                        value: "cs"
                    }, {
                        label: this.$t("newchat.translate.ga"),
                        value: "ga"
                    }, {
                        label: this.$t("newchat.translate.uz"),
                        value: "uz"
                    }, {
                        label: this.$t("newchat.translate.ka"),
                        value: "ka"
                    }, {
                        label: this.$t("newchat.translate.sk"),
                        value: "sk"
                    }],
                    form: {
                        auto: !1,
                        sendSourceValue: "",
                        sendTargetValue: "",
                        readSourceValue: "",
                        readTargetValue: ""
                    },
                    translateVisible: !1,
                    siderbarDot: !1,
                    translateLoading: !1,
                    autoTranslatebutton: !1,
                    audioIsOpen: !1,
                    audioSrc: a("95b3"),
                    isAutoReceive: !1,
                    translateListLoading: !1,
                    timeArea: ""
                }
            },
            mounted: function() {
                var t = this;
                this.getCsListAPI(),
                this.$store.dispatch("newChat/SET_SIDEBAR_NAME", "accountChat"),
                this.$store.dispatch("newChat/SET_GET_UNREAD_FUN", this.getNotRead),
                l["EventBus"].$on("getNotRead", this.getNotRead),
                this.getNotRead();
                var e = r.a.get("audioIsOpen");
                "true" == e ? (this.audioIsOpen = !0,
                this.$store.dispatch("newChat/SET_AUDIO_VISIBLE", !0),
                this.$refs["horn-box"].style.color = "#409EFF") : (this.audioIsOpen = !1,
                this.$store.dispatch("newChat/SET_AUDIO_VISIBLE", !1),
                this.$refs["horn-box"].style.color = "#F56C6C"),
                l["EventBus"].$on("setSiderbarDot", (function(e) {
                    t.siderbarDot = e
                }
                )),
                this.translateListLoading = !0,
                this.getDicts("translate_list").then((function(e) {
                    var a = e.data;
                    a.forEach((function(e) {
                        var a = t.sourceLangOptions.some((function(t) {
                            return t.value === e.dictLabel
                        }
                        ));
                        a || t.sourceLangOptions.push({
                            label: t.$t("newchat.translate.".concat(e.dictLabel)),
                            value: e.dictLabel
                        });
                        var s = t.targetLangOptions.some((function(t) {
                            return t.value === e.dictLabel
                        }
                        ));
                        s || t.targetLangOptions.push({
                            label: t.$t("newchat.translate.".concat(e.dictLabel)),
                            value: e.dictLabel
                        })
                    }
                    )),
                    t.translateListLoading = !1
                }
                )).catch((function(e) {
                    t.translateListLoading = !1
                }
                ));
                var a = r.a.get("timeArea");
                a ? (this.$store.dispatch("newChat/setTimeArea", a),
                this.timeArea = a) : (this.$store.dispatch("newChat/setTimeArea", d.a.tz.guess()),
                this.timeArea = d.a.tz.guess())
            },
            watch: {
                translateSettingVisible: function(t) {
                    this.translateVisible = t
                },
                webSocketData: function(t) {
                    var e = t.sendInfo;
                    if (e) {
                        var s = this.$store.state.newChat.audioVisible;
                        s && (console.log("播放声音"),
                        this.$refs.audio.play());
                        var i = document.title.replace("【　　　】", "").replace("【新消息】", "")
                          , n = null
                          , o = null;
                        if ("hidden" == document.visibilityState) {
                            var r = !1;
                            n = setInterval((function() {
                                r ? (document.title = "【新消息】" + l,
                                r = !1) : (document.title = "【　　　】" + l,
                                r = !0)
                            }
                            ), 300),
                            Notification.requestPermission().then((function(t) {
                                console.log(t)
                            }
                            ));
                            var c = window.location.hostname.includes("gxo8c0") || window.location.hostname.includes("fb4et1") || window.location.hostname.includes("r8boa3") || window.location.hostname.includes("c0qbb4") || !window.location.hostname.includes("rocketgo")
                              , l = c ? "客服系统消息提醒" : "火箭客服系统消息提醒"
                              , u = a(c ? "b6b8" : "81a5");
                            o = new Notification(l,{
                                body: (e.notify ? e.notify : e.username) + " -> " + e.csUsername + "：" + e.chatContent,
                                icon: u
                            })
                        }
                        document.addEventListener("visibilitychange", (function() {
                            "visible" === document.visibilityState && (document.title = i,
                            clearInterval(n),
                            o.close())
                        }
                        )),
                        this.otherUsernameData.username == e.username && this.otherUsernameData.csUsername == e.csUsername || (this.siderbarDot = !0)
                    }
                },
                custormStatus: function(t) {},
                autoTranslatebutton: function(t) {
                    var e = this;
                    if (!t) {
                        if (!this.form.sendTargetValue)
                            return;
                        var a = {
                            receive: this.form.readTargetValue,
                            receives: this.form.readSourceValue,
                            send: "",
                            sends: this.form.sendSourceValue,
                            setType: 1,
                            language: ""
                        };
                        Object(n["yb"])(a).then((function(t) {
                            e.$store.dispatch("newChat/setTranslateSettingData", a),
                            e.form.sendTargetValue = ""
                        }
                        ))
                    }
                }
            },
            computed: {
                translateSettingVisible: function() {
                    return this.$store.state.newChat.translateSettingVisible
                },
                webSocketData: function() {
                    return this.$store.state.newChat.socketData
                },
                accountUserNameData: function() {
                    return this.$store.state.newChat.accountUserNameData
                },
                custormStatus: function() {
                    return this.$store.state.newChat.custormStatus
                },
                otherUsernameData: function() {
                    return this.$store.state.newChat.accountUserNameData
                },
                isAutoReceiveButton: function() {
                    return !this.form.readTargetValue || !this.form.readSourceValue
                },
                momentTzNames: function() {
                    return d.a.tz.names()
                }
            },
            methods: {
                getCsListAPI: function() {
                    var t = this;
                    this.translateLoading = !0,
                    Object(n["L"])().then((function(e) {
                        t.$store.dispatch("newChat/setCsData", e),
                        t.translateLoading = !1,
                        t.$store.dispatch("newChat/setTranslateSettingData", e.autoForm),
                        t.form.sendSourceValue = e.autoForm.sends,
                        t.form.sendTargetValue = e.autoForm.send,
                        t.form.readSourceValue = e.autoForm.receives,
                        t.form.readTargetValue = e.autoForm.receive,
                        t.form.isAutoReceive = e.autoForm.isAutoReceive,
                        e.autoForm.send ? t.autoTranslatebutton = !0 : t.autoTranslatebutton = !1,
                        e.autoForm.isAutoReceive ? t.isAutoReceive = !0 : t.isAutoReceive = !1
                    }
                    ))
                },
                changeTab: function(t, e) {
                    this.activeNum = t,
                    this.$emit("changeTab", e),
                    this.$store.dispatch("newChat/SET_SIDEBAR_NAME", e)
                },
                setingTtranslate: function() {
                    this.getCsListAPI(),
                    this.$store.dispatch("newChat/SET_TRANSLATE_SETTING_VISIBLE", !0)
                },
                sendAutoTranslateChange: function(t) {
                    t ? (this.form.sendTargetValue = "en",
                    this.form.sendSourceValue = "auto",
                    this.autoTranslatebutton = !0) : (this.form.sendTargetValue = "",
                    this.autoTranslatebutton = !1),
                    this.submitTranslateSetting(1)
                },
                receiveAutoTranslateChange: function(t) {
                    t ? (this.form.readTargetValue = "zh",
                    this.form.readSourceValue = "auto",
                    this.isAutoReceive = !0) : (this.form.readTargetValue = "",
                    this.isAutoReceive = !1),
                    this.submitTranslateSetting(0)
                },
                submitTranslateSetting: function(t) {
                    var e = this
                      , a = {
                        receive: this.form.readTargetValue,
                        receives: this.form.readSourceValue,
                        send: this.form.sendTargetValue,
                        sends: this.form.sendSourceValue,
                        setType: t,
                        isAutoReceive: this.isAutoReceive ? 1 : 0
                    };
                    1 == t ? (a.language = this.form.sendTargetValue,
                    a.sourceLanguage = this.form.sendSourceValue) : 0 == t && (a.language = this.form.readTargetValue,
                    a.sourceLanguage = this.form.readSourceValue),
                    this.form.readTargetValue && this.form.readSourceValue || (this.isAutoReceive = !1,
                    a.isAutoReceive = 0),
                    Object(n["yb"])(a).then((function(t) {
                        e.$store.dispatch("newChat/setTranslateSettingData", a),
                        e.$message.success(e.$t("newchat.message.successfullySet")),
                        e.form.sendTargetValue ? e.autoTranslatebutton = !0 : e.autoTranslatebutton = !1
                    }
                    ))
                },
                translateclose: function() {
                    this.form = {
                        auto: !1,
                        sendSourceValue: "",
                        sendTargetValue: "",
                        readSourceValue: "",
                        readTargetValue: ""
                    },
                    this.$store.dispatch("newChat/SET_TRANSLATE_SETTING_VISIBLE", !1)
                },
                translateopen: function() {
                    this.getCsListAPI()
                },
                getNotRead: function() {
                    var t = this
                      , e = {
                        csId: this.$store.state.user.userId
                    };
                    Object(n["U"])(e).then((function(e) {
                        t.$store.dispatch("newChat/setNoReadNum", e.notReadNum),
                        e.notReadNum >= 1 ? t.siderbarDot = !0 : t.siderbarDot = !1
                    }
                    ))
                },
                openAudio: function() {
                    this.audioIsOpen = !this.audioIsOpen,
                    this.audioIsOpen ? (this.$store.dispatch("newChat/SET_AUDIO_VISIBLE", !0),
                    r.a.set("audioIsOpen", !0),
                    this.$refs["horn-box"].style.color = "#409EFF") : (this.$store.dispatch("newChat/SET_AUDIO_VISIBLE", !1),
                    r.a.set("audioIsOpen", !1),
                    this.$refs["horn-box"].style.color = "#F56C6C")
                },
                changeTimeArea: function(t) {
                    this.$store.dispatch("newChat/setTimeArea", t),
                    r.a.set("timeArea", t),
                    this.$message.success(this.$t("newchat.message.successfullySet"))
                },
                clearAllGroupChat: function() {
                    var t = this;
                    this.$prompt(this.$t("newchat.chatwindow.clearGroupChatInfo"), this.$t("newchat.userList.clearGroupChat"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        inputPattern: /confirm/,
                        inputErrorMessage: this.$t("newchat.chatwindow.clearGroupChatErrorInfo")
                    }).then((function(e) {
                        var a = e.value;
                        console.log(a),
                        "confirm" == a && Object(n["l"])().then((function(e) {
                            t.$message.success(t.$t("newchat.chatwindow.clearGroupChatSuccess")),
                            t.$store.state.newChat.accountUserNameData.groupId && t.$store.dispatch("newChat/setAccountUsernameData", ""),
                            t.$store.state.newChat.chatUserNameData.login && l["EventBus"].$emit("refreshGroupChat")
                        }
                        )).catch((function(t) {}
                        ))
                    }
                    )).catch((function() {}
                    ))
                }
            },
            destroyed: function() {
                l["EventBus"].$off("setSiderbarDot"),
                l["EventBus"].$off("getNotRead")
            }
        }
          , m = h
          , p = (a("34ca"),
        a("2877"))
          , g = Object(p["a"])(m, s, i, !1, null, "3c0719ee", null);
        e["default"] = g.exports
    },
    e80f: function(t, e, a) {
        "use strict";
        a("ec03")
    },
    e8c9: function(t, e, a) {
        t.exports = a.p + "dist-20260618-092121/static/img/read.png"
    },
    eb37: function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , s = t._self._c || e;
            return s("div", {
                staticClass: "mian-box"
            }, [s("div", {
                class: 0 == t.itemData.isSend ? "left-box" : "right-box"
            }, [t.itemData.fileUrl ? [s("div", {
                staticClass: "item_content",
                on: {
                    click: t.audioPlay
                }
            }, [1 == t.itemData.isSend ? s("div", {
                staticClass: "log-item-voice",
                on: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onMyContextmenu(e, t.itemData)
                    }
                }
            }, [s("audio", {
                ref: "log_item_voice",
                staticClass: "log_item_voice",
                attrs: {
                    id: "myAudio",
                    src: t.itemData.fileUrl
                },
                on: {
                    canplay: t.getAudioTime,
                    ended: t.audioEnd
                }
            }), s("el-image", {
                staticStyle: {
                    width: "20px",
                    height: "20px"
                },
                attrs: {
                    src: t.isAudioPlay ? a("d83a") : a("960a")
                }
            }), s("div", {
                staticClass: "voice-time"
            }, [t._v(t._s(t.vioceTime) + '"')])], 1) : s("div", {
                staticClass: "log-item-voice",
                on: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onOtherContextmenu(e, t.itemData)
                    }
                }
            }, [s("audio", {
                ref: "log_item_voice",
                staticClass: "log_item_voice",
                attrs: {
                    id: "myAudio",
                    src: t.itemData.fileUrl
                },
                on: {
                    canplay: t.getAudioTime,
                    ended: t.audioEnd
                }
            }), s("el-image", {
                staticStyle: {
                    width: "20px",
                    height: "20px"
                },
                attrs: {
                    src: t.isAudioPlay ? a("d83a") : a("960a")
                }
            }), s("div", {
                staticClass: "voice-time"
            }, [t._v(t._s(t.vioceTime) + '"')])], 1)])] : [s("div", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.getMaterialMessageLoading,
                    expression: "getMaterialMessageLoading"
                }],
                staticClass: "text_back_color"
            }, [s("div", {
                staticClass: "content-text"
            }, [t._v(t._s(t.$t("newchat.chatwindow.audio")))]), s("el-button", {
                attrs: {
                    type: "text",
                    size: "mini"
                },
                on: {
                    click: t.getGroupSm
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.get")))])], 1)], s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.chatwindow.translate"),
                    placement: "right"
                }
            }, [0 == t.itemData.isSend && t.chargeId ? s("div", {
                staticClass: "translateIcon"
            }, [t.canTranslateTime ? s("el-image", {
                staticStyle: {
                    width: "15px",
                    height: "15px"
                },
                attrs: {
                    src: a("69b7"),
                    fit: "cover"
                },
                on: {
                    click: t.openAudioTranslateVisible
                }
            }) : s("div", {
                staticClass: "translateWart"
            }, [t._v(t._s(t.translateTime))])], 1) : t._e()]), 1 == t.itemData.isSendType ? s("div", {
                staticClass: "loading-icon"
            }, [s("i", {
                staticClass: "el-icon-loading"
            })]) : t._e()], 2), t.isTranslate || t.itemData.chatVideo ? s("div", {
                ref: "item_content_list",
                staticClass: "item_content original",
                on: {
                    contextmenu: function(e) {
                        return e.preventDefault(),
                        t.onTranslateContextmenu(e, t.itemData.chatVideo)
                    }
                }
            }, [s("div", {
                staticClass: "content-box",
                staticStyle: {
                    "white-space": "pre-wrap",
                    "text-align": "left"
                }
            }, [t.isTranslateEnd || t.itemData.chatVideo ? [s("div", [t._v(" 原文：" + t._s(t.itemData.chatVideo) + " ")]), s("div", [t._v(" " + t._s(t.$t("newchat.chatwindow.translate")) + "：" + t._s(t.itemData.chatTranslate || t.itemData.chatContent) + " ")])] : s("i", {
                staticClass: "el-icon-loading"
            })], 2)]) : t._e(), s("el-dialog", {
                attrs: {
                    title: "语音选择",
                    visible: t.audioTranslateVisible,
                    width: "400px"
                },
                on: {
                    "update:visible": function(e) {
                        t.audioTranslateVisible = e
                    }
                }
            }, [s("el-form", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.translateListLoading,
                    expression: "translateListLoading"
                }],
                attrs: {
                    model: t.audioTranslateData,
                    "label-width": "100px"
                }
            }, [s("el-form-item", {
                attrs: {
                    label: "原文语言"
                }
            }, [s("el-select", {
                attrs: {
                    placeholder: "请选择原文语言",
                    size: "mini",
                    filterable: ""
                },
                model: {
                    value: t.audioTranslateData.sourceLang,
                    callback: function(e) {
                        t.$set(t.audioTranslateData, "sourceLang", e)
                    },
                    expression: "audioTranslateData.sourceLang"
                }
            }, t._l(t.sourceLangOptions, (function(t) {
                return s("el-option", {
                    key: t.value,
                    attrs: {
                        label: t.label,
                        value: t.value
                    }
                })
            }
            )), 1)], 1), s("el-form-item", {
                attrs: {
                    label: "目标语言"
                }
            }, [s("el-select", {
                attrs: {
                    placeholder: "请选择目标语言",
                    size: "mini",
                    filterable: ""
                },
                model: {
                    value: t.audioTranslateData.targetLang,
                    callback: function(e) {
                        t.$set(t.audioTranslateData, "targetLang", e)
                    },
                    expression: "audioTranslateData.targetLang"
                }
            }, t._l(t.targetLangOptions, (function(t) {
                return s("el-option", {
                    key: t.value,
                    attrs: {
                        label: t.label,
                        value: t.value
                    }
                })
            }
            )), 1)], 1)], 1), s("div", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [s("el-button", {
                attrs: {
                    size: "mini"
                },
                on: {
                    click: function(e) {
                        t.audioTranslateVisible = !1
                    }
                }
            }, [t._v("取消")]), s("el-button", {
                attrs: {
                    type: "primary",
                    size: "mini"
                },
                on: {
                    click: function(e) {
                        return t.audioTranslateClick(t.itemData)
                    }
                }
            }, [t._v("翻译")])], 1)], 1)], 1)
        }
          , i = []
          , n = (a("b64b"),
        a("e9c4"),
        a("d3b7"),
        a("159b"),
        a("14d9"),
        a("6b98"))
          , o = a("852e")
          , r = a.n(o)
          , c = a("f77b")
          , l = {
            mixins: [n["a"]],
            props: ["itemData", "nolog"],
            data: function() {
                return {
                    isAudioPlay: !1,
                    vioceTime: 0,
                    isTranslate: !1,
                    isTranslateEnd: !1,
                    audioTranslateVisible: !1,
                    audioTranslateData: {
                        sourceLang: "en",
                        targetLang: "zh"
                    },
                    targetLangOptions: [],
                    sourceLangOptions: [],
                    translateListLoading: !1,
                    getMaterialMessageLoading: !1
                }
            },
            mounted: function() {
                var t = this;
                setTimeout((function() {
                    t.itemData.isSendType = 2,
                    t.$emit("messageSendSuccess", t.itemData)
                }
                ), 2e3)
            },
            methods: {
                audioPlay: function() {
                    this.nolog || (this.$refs.log_item_voice.paused ? (this.isAudioPlay = !0,
                    this.$refs.log_item_voice.currentTime = 0,
                    this.$refs.log_item_voice.play()) : (this.$refs.log_item_voice.pause(),
                    this.isAudioPlay = !1,
                    this.$refs.log_item_voice.currentTime = 0))
                },
                getAudioTime: function() {
                    var t = this.$refs.log_item_voice;
                    this.vioceTime = Math.round(t.duration)
                },
                audioEnd: function() {
                    this.isAudioPlay = !1
                },
                openAudioTranslateVisible: function() {
                    this.audioTranslateVisible = !0,
                    this.getTranslateList();
                    var t = r.a.get("audioTranslateData");
                    t && (this.audioTranslateData = JSON.parse(t))
                },
                audioTranslateClick: function(t) {
                    this.audioTranslateVisible = !1,
                    this.translateClick(t, this.audioTranslateData.sourceLang, this.audioTranslateData.targetLang),
                    r.a.set("audioTranslateData", JSON.stringify(this.audioTranslateData))
                },
                getTranslateList: function() {
                    var t = this;
                    this.translateListLoading = !0,
                    this.getDicts("translate_list").then((function(e) {
                        var a = e.data;
                        a.forEach((function(e) {
                            var a = t.sourceLangOptions.some((function(t) {
                                return t.value === e.dictLabel
                            }
                            ));
                            a || t.sourceLangOptions.push({
                                label: t.$t("newchat.translate.".concat(e.dictLabel)),
                                value: e.dictLabel
                            });
                            var s = t.targetLangOptions.some((function(t) {
                                return t.value === e.dictLabel
                            }
                            ));
                            s || t.targetLangOptions.push({
                                label: t.$t("newchat.translate.".concat(e.dictLabel)),
                                value: e.dictLabel
                            })
                        }
                        )),
                        t.translateListLoading = !1
                    }
                    )).catch((function(e) {
                        t.translateListLoading = !1
                    }
                    ))
                },
                getGroupSm: function() {
                    var t = this;
                    this.getMaterialMessageLoading = !0,
                    this.itemData.sendTime = this.parseTime(this.itemData.sendTime, "{y}-{m}-{d} {h}:{i}:{s}"),
                    Object(c["T"])(this.itemData).then((function(e) {
                        t.$emit("updateMessage", e),
                        t.getMaterialMessageLoading = !1
                    }
                    ))
                }
            }
        }
          , u = l
          , d = (a("c04d"),
        a("2877"))
          , h = Object(d["a"])(u, s, i, !1, null, "ea78502c", null);
        e["default"] = h.exports
    },
    ec03: function(t, e, a) {},
    eda1: function(t, e, a) {
        "use strict";
        a.d(e, "a", (function() {
            return s
        }
        ));
        a("c740");
        var s = {
            data: function() {
                return {
                    keyChangeSessionsHandleKeydown: null
                }
            },
            computed: {},
            created: function() {},
            mounted: function() {
                var t = this;
                this.keyChangeSessionsHandleKeydown = function(e) {
                    e.ctrlKey && "ArrowDown" === e.key ? t.keyChangeSessionsChangeAccountDown() : e.ctrlKey && "ArrowUp" === e.key && t.keyChangeSessionsChangeAccountUp()
                }
                ,
                document.addEventListener("keydown", this.keyChangeSessionsHandleKeydown)
            },
            methods: {
                keyChangeSessionsChangeAccountDown: function() {
                    var t = this;
                    if (0 != this.usernameList.length) {
                        var e = this.usernameList.findIndex((function(e) {
                            return e.id == t.activeNum
                        }
                        ));
                        if (e != this.usernameList.length - 1) {
                            var a = this.usernameList[e + 1];
                            this.changeAccount(a),
                            e > 0 && (document.querySelector("#user_listbox").scrollTop += 72)
                        }
                    }
                },
                keyChangeSessionsChangeAccountUp: function() {
                    var t = this
                      , e = this.usernameList.findIndex((function(e) {
                        return e.id == t.activeNum
                    }
                    ));
                    if (0 != e) {
                        var a = this.usernameList[e - 1];
                        this.changeAccount(a),
                        document.querySelector("#user_listbox").scrollTop -= 72
                    }
                }
            },
            destroyed: function() {
                document.removeEventListener("keydown", this.keyChangeSessionsHandleKeydown)
            }
        }
    },
    edbf: function(t, e, a) {},
    eea9: function(t, e, a) {
        "use strict";
        a("7aae")
    },
    eef2: function(t, e, a) {
        "use strict";
        a.d(e, "g", (function() {
            return i
        }
        )),
        a.d(e, "b", (function() {
            return n
        }
        )),
        a.d(e, "i", (function() {
            return o
        }
        )),
        a.d(e, "d", (function() {
            return r
        }
        )),
        a.d(e, "h", (function() {
            return c
        }
        )),
        a.d(e, "a", (function() {
            return l
        }
        )),
        a.d(e, "f", (function() {
            return u
        }
        )),
        a.d(e, "c", (function() {
            return d
        }
        )),
        a.d(e, "j", (function() {
            return h
        }
        )),
        a.d(e, "e", (function() {
            return m
        }
        ));
        var s = a("b775");
        function i(t) {
            return Object(s["a"])({
                url: "/biz/smstore/list",
                method: "get",
                params: t
            })
        }
        function n(t) {
            return Object(s["a"])({
                url: "/biz/smstore",
                method: "post",
                data: t
            })
        }
        function o(t) {
            return Object(s["a"])({
                url: "/biz/smstore",
                method: "put",
                data: t
            })
        }
        function r(t) {
            return Object(s["a"])({
                url: "/biz/smstore/" + t,
                method: "delete"
            })
        }
        function c(t, e) {
            var a = {
                id: t,
                status: e
            };
            return Object(s["a"])({
                url: "/biz/smstore/setStatus",
                method: "put",
                data: a
            })
        }
        function l(t) {
            return Object(s["a"])({
                url: "/biz/smstore/addContact",
                method: "post",
                data: t
            })
        }
        function u(t) {
            return Object(s["a"])({
                url: "/biz/smgroup/list",
                method: "get",
                params: t
            })
        }
        function d(t) {
            return Object(s["a"])({
                url: "/biz/smgroup/add",
                method: "post",
                data: t
            })
        }
        function h(t) {
            return Object(s["a"])({
                url: "/biz/smgroup/edit",
                method: "post",
                data: t
            })
        }
        function m(t, e) {
            return Object(s["a"])({
                url: "/biz/smgroup/del/" + t,
                method: "post",
                data: e
            })
        }
    },
    ef0a: function(t, e, a) {},
    f099: function(t, e, a) {
        "use strict";
        a("88ec")
    },
    f78e: function(t, e, a) {
        "use strict";
        a("8b2c")
    },
    f99e: function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , s = t._self._c || e;
            return s("div", {
                staticClass: "main_box"
            }, [s("div", {
                staticClass: "box-card"
            }, [s("div", {
                staticClass: "but-list"
            }, [s("el-input", {
                staticClass: "search_inp",
                attrs: {
                    size: "mini",
                    placeholder: t.$t("newchat.input.enterAccountNickname"),
                    "suffix-icon": "el-icon-search",
                    clearable: ""
                },
                on: {
                    change: function(e) {
                        return t.getGroupUsernameList(t.groupItem)
                    }
                },
                model: {
                    value: t.activeNameVal,
                    callback: function(e) {
                        t.activeNameVal = "string" === typeof e ? e.trim() : e
                    },
                    expression: "activeNameVal"
                }
            }), s("el-tooltip", {
                staticClass: "item",
                attrs: {
                    effect: "dark",
                    content: t.$t("newchat.userList.filterFans"),
                    placement: "top-start"
                }
            }, [s("el-badge", {
                staticClass: "item",
                style: {
                    color: t.isFilter ? "#fff" : "#409EFF"
                },
                attrs: {
                    "is-dot": t.isFilter
                }
            }, [s("svg-icon", {
                staticClass: "addbut",
                class: t.isFilter ? "" : "addbutClick",
                attrs: {
                    "icon-class": "screen",
                    size: "26",
                    "class-name": "custom-class"
                },
                on: {
                    click: t.openFilterChat
                }
            })], 1)], 1)], 1), s("div", {
                directives: [{
                    name: "infinite-scroll",
                    rawName: "v-infinite-scroll",
                    value: t.load,
                    expression: "load"
                }, {
                    name: "loading",
                    rawName: "v-loading",
                    value: t.accountListLoading,
                    expression: "accountListLoading"
                }],
                ref: "user_listbox",
                staticClass: "user_listbox",
                staticStyle: {
                    overflow: "auto"
                },
                attrs: {
                    id: "user_listbox",
                    "infinite-scroll-disabled": "disabled",
                    "infinite-scroll-distance": 10
                }
            }, [t._l(t.usernameList, (function(e, i) {
                return s("div", {
                    key: i,
                    staticClass: "user_item",
                    class: e.id == t.activeNum ? "user_item_active" : "",
                    attrs: {
                        "data-id": e.id,
                        draggable: "groupChat" == t.sidebarNameStr && 4 != t.groupItem.id
                    },
                    on: {
                        contextmenu: function(a) {
                            return a.preventDefault(),
                            t.onContextmenu(a, e)
                        },
                        click: function(a) {
                            return t.changeAccount(e, i)
                        },
                        dragstart: function(a) {
                            return t.dragstart(a, e)
                        },
                        dragend: function(a) {
                            return t.dragend(a, e)
                        }
                    }
                }, [s("div", {
                    staticClass: "tooltopbox"
                }, [t.batchOption ? s("div", {
                    staticStyle: {
                        display: "flex",
                        "align-items": "center",
                        "padding-right": "5px"
                    },
                    on: {
                        click: function(t) {
                            t.stopPropagation()
                        }
                    }
                }, [s("el-checkbox", {
                    model: {
                        value: e.checked,
                        callback: function(a) {
                            t.$set(e, "checked", a)
                        },
                        expression: "item.checked"
                    }
                })], 1) : t._e(), s("el-badge", {
                    staticClass: "item",
                    attrs: {
                        value: e.readNum,
                        hidden: 0 == e.readNum,
                        max: 99
                    }
                }, [s("el-avatar", {
                    staticClass: "item_header",
                    attrs: {
                        src: e.avatarUrl ? e.avatarUrl : a("4d41")
                    },
                    nativeOn: {
                        dragstart: function(t) {
                            t.preventDefault()
                        }
                    }
                })], 1), s("div", {
                    staticClass: "item_info"
                }, [s("div", {
                    staticClass: "nameinfo"
                }, [s("div", {
                    staticClass: "item_name"
                }, [t._v(t._s(e.remarkName ? e.remarkName : e.username))]), s("div", {
                    staticClass: "time_text"
                }, [t._v(t._s(0 == e.isSend ? t.sendTime(e.senderTimestamp ? t.senderTimestamp : e.sendTime) : t.sendTime(e.sendTime)))])]), s("div", {
                    staticClass: "ws-account-info"
                }, [t._v(t._s(e.username.toString()))]), s("div", {
                    staticClass: "timeinfo"
                }, [s("span", {
                    directives: [{
                        name: "show",
                        rawName: "v-show",
                        value: 1 == e.isRepeat && 1 == t.$store.getters.isRepeatScope,
                        expression: "item.isRepeat == 1 && $store.getters.isRepeatScope == 1"
                    }],
                    staticClass: "repeat-text"
                }, [t._v("重")]), s("div", {
                    staticClass: "content",
                    class: {
                        "draft-content": t.hasDraft(e.id)
                    }
                }, [t._v(" " + t._s(t.hasDraft(e.id) ? "草稿" : e.content) + " ")]), [s("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        enterable: !1,
                        content: 1 == e.isReplyApi ? t.$t("newchat.chatwindow.robotHosting") : t.$t("newchat.chatwindow.globalRobotHosting"),
                        placement: "right"
                    }
                }, [1 == e.isReplyApi || 2 == e.isReplyApi ? s("svg-icon", {
                    staticStyle: {
                        "margin-bottom": "2px",
                        color: "#67C23A"
                    },
                    style: {
                        color: 1 == e.isReplyApi ? "#67C23A" : "#409EFF"
                    },
                    attrs: {
                        "icon-class": "robot",
                        size: "15",
                        "class-name": "custom-class"
                    }
                }) : t._e()], 1)], s("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        enterable: !1,
                        content: t.$t("newchat.userList.isAI"),
                        placement: "right"
                    }
                }, [1 == e.isChatAi ? s("svg-icon", {
                    staticStyle: {
                        "margin-bottom": "2px",
                        color: "#67C23A"
                    },
                    attrs: {
                        "icon-class": "AI",
                        size: "15",
                        "class-name": "custom-class"
                    },
                    on: {
                        click: function(a) {
                            return t.closeAI(e)
                        }
                    }
                }) : t._e()], 1), s("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        enterable: !1,
                        content: 1 == e.isBlock ? t.$t("newchat.userList.cancelBlack") : t.$t("newchat.userList.setBalck"),
                        placement: "right"
                    }
                }, [s("div", {
                    staticStyle: {
                        "margin-bottom": "3px"
                    },
                    on: {
                        click: function(a) {
                            return a.stopPropagation(),
                            t.pullIntoBlacklist(e)
                        }
                    }
                }, [1 == e.isBlock ? s("div", {
                    staticStyle: {
                        color: "#F56C6C"
                    }
                }, [s("svg-icon", {
                    attrs: {
                        "icon-class": "black",
                        size: "14",
                        "class-name": "custom-class"
                    }
                })], 1) : s("div", {
                    staticStyle: {
                        color: "#909399"
                    }
                }, [s("svg-icon", {
                    attrs: {
                        "icon-class": "black",
                        size: "14",
                        "class-name": "custom-class"
                    }
                })], 1)])]), s("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        content: 1 == e.isTop ? t.$t("newchat.userList.cancelTop") : t.$t("newchat.userList.top"),
                        placement: "right"
                    }
                }, [s("div", {
                    on: {
                        click: function(a) {
                            return a.stopPropagation(),
                            t.topping(e)
                        }
                    }
                }, [1 == e.isTop ? s("i", {
                    staticClass: "el-icon-download",
                    staticStyle: {
                        color: "rgb(140, 197, 255)"
                    }
                }) : s("i", {
                    staticClass: "el-icon-upload2",
                    staticStyle: {
                        color: "#909399"
                    }
                })])])], 2)])], 1)])
            }
            )), t.loadingIcon ? s("div", {
                staticClass: "icon-loading"
            }, [s("i", {
                staticClass: "el-icon-loading"
            })]) : t._e(), t.noMore && !t.loadingIcon && 0 != t.usernameList.length ? s("div", {
                staticClass: "icon-loading nomoretext"
            }, [t._v(" " + t._s(t.$t("newchat.userList.noMore")) + " ")]) : t._e(), 0 == t.usernameList.length ? s("el-empty", {
                attrs: {
                    description: t.$t("newchat.notice.nodata")
                }
            }) : s("div", {
                staticClass: "listPageBox"
            }, [t._v(" " + t._s(t.usernameList.length) + " / " + t._s(t.total) + " ")])], 2)]), s("el-dialog", {
                staticClass: "add-dialog",
                attrs: {
                    title: t.$t("newchat.userList.filterFans"),
                    center: "",
                    visible: t.filterChatVisible,
                    width: "400px",
                    "close-on-click-modal": !1,
                    "close-on-press-escape": !1,
                    "show-close": !1
                },
                on: {
                    "update:visible": function(e) {
                        t.filterChatVisible = e
                    }
                }
            }, [s("el-form", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.filterLabelsLoading,
                    expression: "filterLabelsLoading"
                }],
                ref: "form",
                attrs: {
                    model: t.filterChatForm,
                    "label-width": "100px",
                    size: "mini"
                }
            }, [s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.userList.fansTag")
                }
            }, [s("el-select", {
                staticStyle: {
                    width: "100%"
                },
                attrs: {
                    multiple: "",
                    filterable: "",
                    placeholder: t.$t("newchat.userList.selectFansTag"),
                    clearable: ""
                },
                model: {
                    value: t.filterChatForm.labels,
                    callback: function(e) {
                        t.$set(t.filterChatForm, "labels", e)
                    },
                    expression: "filterChatForm.labels"
                }
            }, t._l(t.lableList, (function(t, e) {
                return s("el-option", {
                    key: e,
                    attrs: {
                        label: t.labelName,
                        value: t.id
                    }
                })
            }
            )), 1)], 1), s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.userList.fansSource")
                }
            }, [s("el-select", {
                staticStyle: {
                    width: "100%"
                },
                attrs: {
                    placeholder: t.$t("newchat.userList.selectFansSource"),
                    clearable: ""
                },
                model: {
                    value: t.filterChatForm.addType,
                    callback: function(e) {
                        t.$set(t.filterChatForm, "addType", e)
                    },
                    expression: "filterChatForm.addType"
                }
            }, [s("el-option", {
                attrs: {
                    label: t.$t("fanList.newMessageAddition"),
                    value: 0
                }
            }), s("el-option", {
                attrs: {
                    label: t.$t("fanList.fansGroupSending"),
                    value: 1
                }
            }), s("el-option", {
                attrs: {
                    label: t.$t("fanList.import"),
                    value: 2
                }
            }), s("el-option", {
                attrs: {
                    label: t.$t("fanList.pull"),
                    value: 3
                }
            }), s("el-option", {
                attrs: {
                    label: t.$t("fanList.addfan"),
                    value: 4
                }
            })], 1)], 1), s("el-form-item", {
                attrs: {
                    label: t.$t("newchat.userList.isAI")
                }
            }, [s("el-select", {
                staticStyle: {
                    width: "100%"
                },
                attrs: {
                    placeholder: t.$t("newchat.userList.selectAI"),
                    clearable: ""
                },
                model: {
                    value: t.filterChatForm.isChatAi,
                    callback: function(e) {
                        t.$set(t.filterChatForm, "isChatAi", e)
                    },
                    expression: "filterChatForm.isChatAi"
                }
            }, [s("el-option", {
                attrs: {
                    label: t.$t("newchat.userList.yes"),
                    value: 1
                }
            }), s("el-option", {
                attrs: {
                    label: t.$t("newchat.userList.no"),
                    value: 0
                }
            })], 1)], 1)], 1), s("span", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [s("el-button", {
                attrs: {
                    size: "mini"
                },
                on: {
                    click: t.cancelFilterChat
                }
            }, [t._v(t._s(t.$t("newchat.userList.clearFilter")))]), s("el-button", {
                attrs: {
                    type: "primary",
                    size: "mini"
                },
                on: {
                    click: t.filterChat
                }
            }, [t._v(t._s(t.$t("newchat.userList.filter")))])], 1)], 1)], 1)
        }
          , i = []
          , n = a("5530")
          , o = (a("4de4"),
        a("d3b7"),
        a("99af"),
        a("159b"),
        a("14d9"),
        a("c740"),
        a("a434"),
        a("3c65"),
        a("d81d"),
        a("a15b"),
        a("71b4"),
        a("488e"))
          , r = a("f77b")
          , c = a("c38a")
          , l = a("bc19")
          , u = a("eda1")
          , d = a("7f45")
          , h = a.n(d)
          , m = {
            mixins: [u["a"]],
            data: function() {
                return {
                    activeNameVal: "",
                    usernameList: [],
                    pageSize: 20,
                    total: 0,
                    accountUsername: "",
                    pageNum: 1,
                    activeNum: -1,
                    loadingIcon: !1,
                    accountListLoading: !1,
                    sidebarNameStr: "",
                    noMore: !1,
                    dragged: null,
                    groupItem: "",
                    draggedListData: null,
                    groupList: [],
                    menuGroupList: [],
                    filterChatVisible: !1,
                    filterLabelsLoading: !1,
                    lableList: [],
                    filterChatForm: {
                        labels: [],
                        addType: [],
                        isChatAi: ""
                    },
                    filterLabels: "",
                    filterAddType: "",
                    filterIsChatAi: "",
                    batchOption: !1
                }
            },
            computed: {
                chatUserName: function() {
                    return this.$store.state.newChat.chatUserName
                },
                sidebarName: function() {
                    return this.$store.state.newChat.sidebarName
                },
                webSocketData: function() {
                    return this.$store.state.newChat.socketData
                },
                otherUsernameData: function() {
                    return this.$store.state.newChat.accountUserNameData
                },
                userListScoketData: function() {
                    return this.$store.state.newChat.userListScoketData
                },
                disabled: function() {
                    return this.loadingIcon || this.noMore
                },
                isFilter: function() {
                    return Boolean("" !== this.filterLabels || "" !== this.filterAddType || "" !== this.filterIsChatAi)
                },
                sendTime: function() {
                    var t = this;
                    return function(e) {
                        if (!e)
                            return "";
                        var a = t.$store.state.newChat.timeArea
                          , s = (new Date).getTime()
                          , i = Object(c["f"])(s, "{y}-{m}-{d}")
                          , n = Object(c["f"])(e, "{y}-{m}-{d}")
                          , o = h.a.utc(e).tz("asia/shanghai").format();
                        return i == n ? h.a.utc(o).tz(a).format("HH:mm") : h.a.utc(o).tz(a).format("MM-DD")
                    }
                },
                hasDraft: function() {
                    var t = this;
                    return function(e) {
                        return !!t.$store.state.newChat.draftMessages[e]
                    }
                }
            },
            watch: {
                chatUserName: function(t) {
                    this.accountUsername = t
                },
                sidebarName: function(t) {
                    this.pageNum = 1,
                    this.sidebarNameStr = t,
                    this.usernameList = [],
                    this.accountListLoading = !0
                },
                webSocketData: function(t) {
                    if (2 == t.sendType)
                        if (1 != t.sendInfo.isSend) {
                            var e = t.sendInfo;
                            if (e) {
                                var a = {
                                    createBy: null,
                                    createTime: null,
                                    updateBy: null,
                                    updateTime: null,
                                    remark: e.remark,
                                    id: e.csChatUserId,
                                    csUsername: e.csUsernameStr,
                                    username: e.username,
                                    remarkName: e.notify || e.username,
                                    country: null,
                                    isTop: e.isTop,
                                    fanyiSourceSend: null,
                                    fanyiTargetSend: null,
                                    fanyiSourceGet: null,
                                    fanyiTargetGet: null,
                                    isAutoSend: null,
                                    isAutoGet: null,
                                    isBlock: e.isBlock,
                                    isReurnId: null,
                                    csId: null,
                                    chatsType: null,
                                    keyword: e.username,
                                    labelIds: null,
                                    readNum: 1,
                                    avatarUrl: e.avatarUrl,
                                    sendTime: (new Date).getTime(e.sendTime),
                                    senderTimestamp: e.senderTimestamp,
                                    content: e.chatContent,
                                    friendsId: null,
                                    labelIdsArr: null,
                                    labelName: null,
                                    login: e.login,
                                    isRepeat: e.isRepeat
                                };
                                this.addSession(e, a),
                                this.changeSessionContent(t)
                            }
                        } else
                            this.changeSessionContent(t)
                },
                userListScoketData: function(t) {
                    this.changeSessionContent(t)
                }
            },
            mounted: function() {
                this.accountUsername = this.$store.state.newChat.chatUserName,
                this.sidebarNameStr = this.$store.state.newChat.sidebarName,
                o["EventBus"].$on("getGroupUsernameList", this.getGroupUsernameList),
                o["EventBus"].$on("deleteDragged", this.deleteDragged),
                o["EventBus"].$on("delSession3", this.delSession3),
                this.getGroupList(),
                o["EventBus"].$on("getGroupListUser", this.getGroupList)
            },
            methods: {
                getPageUsernameList: function() {
                    var t = this
                      , e = {
                        csId: this.$store.state.user.userId,
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        chatsType: 0,
                        keyword: this.activeNameVal,
                        groupId: this.groupItem.id
                    };
                    this.noMore = !0,
                    Object(r["D"])(e).then((function(e) {
                        var a = e.chatInfo.chatUsers.rows.filter((function(e) {
                            return t.usernameList.every((function(t) {
                                return e.id !== t.id
                            }
                            ))
                        }
                        ));
                        t.usernameList = t.usernameList.concat(a),
                        t.total = e.chatInfo.chatUsers.total,
                        t.loadingIcon = !1,
                        t.accountListLoading = !1,
                        t.usernameList.length >= t.total ? t.noMore = !0 : t.noMore = !1
                    }
                    )).catch((function() {
                        t.loadingIcon = !1,
                        t.noMore = !1,
                        t.accountListLoading = !1
                    }
                    ))
                },
                getGroupUsernameList: function(t) {
                    var e = this;
                    if (t && null != t.id) {
                        this.groupItem = t,
                        this.pageNum = 1,
                        this.accountListLoading = !0;
                        var a = {
                            csId: this.$store.state.user.userId,
                            pageNum: this.pageNum,
                            pageSize: this.pageSize,
                            chatsType: 0,
                            keyword: this.activeNameVal,
                            groupId: this.groupItem.id,
                            labelIds: this.filterLabels,
                            addType: this.filterAddType,
                            isChatAi: this.filterIsChatAi
                        };
                        this.activeNum = -1,
                        this.noMore = !0,
                        Object(r["D"])(a).then((function(t) {
                            e.usernameList = t.chatInfo.chatUsers.rows,
                            e.total = t.chatInfo.chatUsers.total,
                            e.loadingIcon = !1,
                            e.accountListLoading = !1,
                            e.usernameList.length >= e.total ? e.noMore = !0 : e.noMore = !1
                        }
                        )).catch((function() {
                            e.loadingIcon = !1,
                            e.noMore = !1,
                            e.accountListLoading = !1
                        }
                        ))
                    }
                },
                changeAccount: function(t, e) {
                    var a = this
                      , s = this.$store.state.newChat.noReadNum
                      , i = s - t.readNum;
                    this.$store.dispatch("newChat/setNoReadNum", i),
                    0 == i && o["EventBus"].$emit("setSiderbarDot", !1),
                    o["EventBus"].$emit("reduceUnread", t),
                    this.activeNum = t.id,
                    t.readNum = 0;
                    var r = this.usernameList.filter((function(t) {
                        return t.id === a.activeNum
                    }
                    ))[0]
                      , c = {
                        activeName: "accountList",
                        itemData: t
                    };
                    o["EventBus"].$emit("getChatLog", c);
                    var l = Object(n["a"])({}, r);
                    l.avatarUrl = "",
                    this.$store.dispatch("newChat/setChatUsername", l),
                    this.$store.dispatch("newChat/setAccountUsernameData", r)
                },
                load: function() {
                    this.groupItem && null != this.groupItem.id && (this.loadingIcon = !0,
                    this.pageNum += 1,
                    this.getPageUsernameList())
                },
                onContextmenu: function(t, e) {
                    var a = this;
                    this.menuGroupList.forEach((function(t) {
                        t.userItem = e
                    }
                    ));
                    var s = [];
                    if (this.batchOption) {
                        var i = this.usernameList.filter((function(t) {
                            if (t.checked)
                                return t.id
                        }
                        ));
                        s.push({
                            label: this.$t("newchat.userList.selectAll"),
                            onClick: function() {
                                a.usernameList.forEach((function(t) {
                                    a.$set(t, "checked", !0)
                                }
                                ))
                            }
                        }),
                        i.length > 0 && (s.push({
                            label: this.$t("newchat.userList.cancelAll"),
                            onClick: function() {
                                a.usernameList.forEach((function(t) {
                                    a.$set(t, "checked", !1)
                                }
                                ))
                            }
                        }),
                        s.push({
                            label: this.$t("newchat.userList.batchCloseIsAI"),
                            onClick: function() {
                                a.batchCloseAI()
                            }
                        }),
                        this.menuGroupList.length > 0 ? s.push({
                            label: this.$t("newchat.userList.batchSetGroup"),
                            children: this.menuGroupList
                        }) : s.push({
                            label: this.$t("newchat.userList.noGroupSet"),
                            disabled: !0
                        }),
                        6 == this.groupItem.id ? s.push({
                            label: this.$t("newchat.userList.batchCancelArchive"),
                            onClick: function() {
                                a.batchSetArchive(null, 0)
                            }
                        }) : s.push({
                            label: this.$t("newchat.userList.batchSetArchive"),
                            onClick: function() {
                                a.batchSetArchive(null, 1)
                            }
                        }))
                    } else
                        s.push({
                            label: 1 == e.isTop ? this.$t("newchat.userList.cancelTop") : this.$t("newchat.userList.top"),
                            onClick: function() {
                                if (1 == e.isTop) {
                                    var t = {
                                        id: e.id,
                                        isTop: 0
                                    };
                                    Object(r["Gb"])(t).then((function(t) {
                                        e.isTop = 0,
                                        a.$message.success(a.$t("newchat.userList.cancelTop"))
                                    }
                                    ))
                                } else {
                                    var s = {
                                        id: e.id,
                                        isTop: 1
                                    };
                                    Object(r["Gb"])(s).then((function(t) {
                                        e.isTop = 1,
                                        a.$message.success(a.$t("newchat.userList.successfullyTop"))
                                    }
                                    ))
                                }
                            }
                        }),
                        s.push({
                            label: 1 == e.isBlock ? this.$t("newchat.userList.cancelBlack") : this.$t("newchat.userList.setBalck"),
                            onClick: function() {
                                a.pullIntoBlacklist(e)
                            }
                        }),
                        this.menuGroupList.length > 0 ? s.push({
                            label: this.$t("newchat.userList.setGroup"),
                            children: this.menuGroupList
                        }) : s.push({
                            label: this.$t("newchat.userList.noGroupSet"),
                            disabled: !0
                        }),
                        1 == e.isChatAi && s.push({
                            label: this.$t("newchat.userList.closeIsAI"),
                            onClick: function() {
                                a.closeAI(e)
                            }
                        }),
                        6 == this.groupItem.id ? s.push({
                            label: this.$t("newchat.userList.cancelArchive"),
                            onClick: function() {
                                a.batchSetArchive(e, 0)
                            }
                        }) : s.push({
                            label: this.$t("newchat.userList.archiveSession"),
                            onClick: function() {
                                a.batchSetArchive(e, 1)
                            }
                        });
                    return s.push({
                        label: this.batchOption ? this.$t("newchat.userList.closeBatchOption") : this.$t("newchat.userList.batchOption"),
                        onClick: function() {
                            a.batchOption = !a.batchOption
                        }
                    }),
                    this.$contextmenu({
                        items: s,
                        event: t,
                        customClass: "custom-class",
                        zIndex: 3,
                        minWidth: 100,
                        maxHeight: 500
                    }),
                    !1
                },
                topping: function(t) {
                    var e = this;
                    if (1 == t.isTop) {
                        var a = {
                            id: t.id,
                            isTop: 0
                        };
                        Object(r["Gb"])(a).then((function(a) {
                            t.isTop = 0,
                            e.$message.success(e.$t("newchat.userList.cancelTop"));
                            var s = e.usernameList.filter((function(t) {
                                if (1 == t.isTop)
                                    return !0
                            }
                            ))
                              , i = e.usernameList.findIndex((function(e) {
                                return e.id == t.id
                            }
                            ));
                            console.log("item1", t),
                            console.log("index1", i);
                            var n = e.usernameList.splice(i, 1)[0];
                            e.usernameList.splice(s.length, 0, n)
                        }
                        ))
                    } else {
                        var s = {
                            id: t.id,
                            isTop: 1
                        };
                        Object(r["Gb"])(s).then((function(a) {
                            t.isTop = 1,
                            e.$message.success(e.$t("newchat.userList.successfullyTop"));
                            var s = e.usernameList.findIndex((function(e) {
                                return e.id == t.id
                            }
                            ));
                            console.log("item2", t),
                            console.log("index2", s);
                            var i = e.usernameList.splice(s, 1)[0];
                            e.usernameList.unshift(i)
                        }
                        ))
                    }
                },
                pullIntoBlacklist: function(t) {
                    var e = this
                      , a = {
                        username: t.username,
                        csUsername: t.csUsername,
                        id: t.id
                    }
                      , s = "";
                    1 == t.isBlock ? (a.setType = 1,
                    s = this.$t("newchat.userList.cancelBlack")) : (a.setType = 0,
                    s = this.$t("newchat.userList.blackSuccess")),
                    Object(r["wb"])(a).then((function(a) {
                        t.isBlock = 1 == t.isBlock ? 0 : 1,
                        e.$store.dispatch("newChat/setBlock", t),
                        e.$message.success(s),
                        o["EventBus"].$emit("getGroupList")
                    }
                    ))
                },
                dragstart: function(t, e) {
                    e.id ? (this.dragged = t.target,
                    this.draggedListData = e) : t.preventDefault()
                },
                deleteDragged: function(t, e) {
                    var a = this;
                    if (this.draggedListData && this.draggedListData.id) {
                        var s = {
                            id: t.id,
                            ids: [this.draggedListData.id]
                        }
                          , i = s.ids[0];
                        Object(r["zb"])(i, s).then((function(s) {
                            a.usernameList = a.usernameList.filter((function(t) {
                                return t.id != i
                            }
                            )),
                            console.log(a.usernameList),
                            a.$set(t, "csCount", t.csCount + 1),
                            a.$set(e[0], "csCount", e[0].csCount - 1),
                            a.$message.success(a.$t("newchat.userList.moveSuccess")),
                            a.usernameList.length < 5 && a.getGroupUsernameList(a.groupItem)
                        }
                        )).catch((function(t) {}
                        ))
                    }
                },
                dragend: function(t, e) {
                    this.dragged = null,
                    this.draggedListData = null
                },
                delSession3: function(t) {
                    var e = this;
                    this.usernameList.some((function(a, s) {
                        if (a.id == t)
                            return e.usernameList.splice(s, 1),
                            o["EventBus"].$emit("deleteGroupData"),
                            e.total -= 1,
                            e.activeNum = -1,
                            !0
                    }
                    ))
                },
                getGroupList: function() {
                    var t = this;
                    Object(r["Q"])().then((function(e) {
                        t.groupList = e.rows;
                        var a = [];
                        t.groupList.forEach((function(e) {
                            if (e.id > 6 && 100 != e.id) {
                                var s = {
                                    label: e.groupName,
                                    value: e.id,
                                    onClick: function() {
                                        t.setGroupSub(s)
                                    }
                                };
                                a.push(s)
                            }
                        }
                        )),
                        t.menuGroupList = a
                    }
                    ))
                },
                setGroupSub: function(t) {
                    var e = this
                      , a = {
                        id: t.value
                    };
                    this.batchOption ? a.ids = this.usernameList.filter((function(t) {
                        return t.checked
                    }
                    )).map((function(t) {
                        return t.id
                    }
                    )) : a.ids = [t.userItem.id];
                    var s = a.ids[0];
                    Object(r["zb"])(s, a).then((function(t) {
                        o["EventBus"].$emit("getGroupList"),
                        e.getGroupUsernameList(e.groupItem),
                        e.$message.success(e.$t("newchat.userList.setGroupSuccess"))
                    }
                    )).finally((function() {
                        e.batchOption = !1
                    }
                    ))
                },
                openFilterChat: function() {
                    var t = this;
                    this.filterChatVisible = !0,
                    this.filterLabelsLoading = !0,
                    Object(l["j"])().then((function(e) {
                        t.lableList = e.labelOptions,
                        t.filterLabelsLoading = !1
                    }
                    ))
                },
                filterChat: function() {
                    this.filterLabels = this.filterChatForm.labels.join(","),
                    this.filterAddType = this.filterChatForm.addType,
                    this.filterIsChatAi = this.filterChatForm.isChatAi,
                    this.getGroupUsernameList(this.groupItem),
                    this.filterChatVisible = !1
                },
                cancelFilterChat: function() {
                    this.filterChatForm.labels = [],
                    this.filterChatForm.addType = [],
                    this.filterChatForm.isChatAi = "",
                    this.filterLabels = "",
                    this.filterAddType = "",
                    this.filterIsChatAi = "",
                    this.getGroupUsernameList(this.groupItem),
                    this.filterChatVisible = !1
                },
                addSession: function(t, e) {
                    var a = this;
                    if ("" != t.csUsername && "" != t.username && this.groupItem.id == t.groupId) {
                        if (0 == this.usernameList.length)
                            return this.usernameList.unshift(e),
                            void (this.total += 1);
                        var s = this.usernameList.filter((function(e) {
                            if (e.username == t.username && e.csUsername == t.csUsername)
                                return !0
                        }
                        ))
                          , i = this.usernameList.findLastIndex((function(t) {
                            return 1 == t.isTop
                        }
                        ));
                        0 == s.length ? (1 == t.isTop ? this.usernameList.unshift(e) : i > -1 ? this.usernameList.splice(i + 1, 0, e) : this.usernameList.unshift(e),
                        this.total += 1) : this.usernameList.forEach((function(e, s) {
                            if (e.username == t.username && e.csUsername == t.csUsername) {
                                var n = a.usernameList.splice(s, 1)[0];
                                1 == t.isTop ? a.usernameList.unshift(n) : i > -1 ? a.usernameList.splice(i + 1, 0, n) : a.usernameList.unshift(n)
                            }
                        }
                        ))
                    }
                },
                changeSessionContent: function(t) {
                    var e = this
                      , a = t.sendInfo;
                    if (a && 2 == t.sendType) {
                        var s = this.usernameList.filter((function(t) {
                            return t.username == a.username && t.csUsername == a.csUsername
                        }
                        )).length;
                        if (0 != s)
                            this.usernameList.forEach((function(t, s) {
                                if (t.username == a.username && t.csUsername == a.csUsername) {
                                    if (e.$set(t, "sendTime", new Date),
                                    1 == a.chatType)
                                        a.latitude ? e.$set(t, "content", e.$t("newchat.userList.position")) : e.$set(t, "content", a.chatContent);
                                    else if (2 == a.chatType)
                                        switch (a.sms.type) {
                                        case 4:
                                            e.$set(t, "content", e.$t("newchat.userList.audio"));
                                            break;
                                        case 3:
                                            e.$set(t, "content", e.$t("newchat.userList.video"));
                                            break;
                                        case 1:
                                            e.$set(t, "content", e.$t("newchat.userList.image"));
                                            break;
                                        case 8:
                                            e.$set(t, "content", e.$t("newchat.userList.gif"));
                                            break;
                                        case 5:
                                            e.$set(t, "content", e.$t("newchat.userList.expression"));
                                            break;
                                        case 7:
                                            e.$set(t, "content", e.$t("newchat.userList.businessCard"));
                                            break;
                                        case 9:
                                            e.$set(t, "content", e.$t("newchat.userList.link"));
                                            break;
                                        case 2:
                                            e.$set(t, "content", e.$t("newchat.userList.file"));
                                            break;
                                        case 10:
                                            e.$set(t, "content", e.$t("newchat.userList.position"));
                                            break;
                                        default:
                                            e.$set(t, "content", e.$t("newchat.userList.message"));
                                            break
                                        }
                                    else
                                        3 == a.chatType ? e.$set(t, "content", e.$t("newchat.userList.voiceCall")) : 4 == a.chatType ? e.$set(t, "content", e.$t("newchat.userList.voiceVideoCall")) : 6 == a.chatType && e.$set(t, "content", e.$t("newchat.userList.voiceMissedCalls"));
                                    if (e.otherUsernameData.username != a.username || e.otherUsernameData.csUsername != a.csUsername) {
                                        if (1 == a.isSend)
                                            return;
                                        t.readNum += 1;
                                        var i = {
                                            groupId: a.isAi ? 5 : a.groupId
                                        };
                                        o["EventBus"].$emit("addUnread", i)
                                    }
                                }
                            }
                            ));
                        else {
                            var i = {
                                groupId: a.isAi ? 5 : a.groupId
                            };
                            o["EventBus"].$emit("addUnread", i)
                        }
                    }
                },
                closeAI: function(t) {
                    var e = this;
                    this.$confirm(this.$t("newchat.chatwindow.closeAIInfo"), this.$t("newchat.chatwindow.tip"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        type: "warning"
                    }).then((function() {
                        var a = {
                            isChatAi: 0,
                            ids: [t.id]
                        };
                        Object(r["o"])(a).then((function(a) {
                            e.$message({
                                type: "success",
                                message: e.$t("newchat.chatwindow.closeSuccess")
                            }),
                            t.isChatAi = 0
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                batchCloseAI: function() {
                    var t = this
                      , e = this.usernameList.filter((function(t) {
                        return t.checked
                    }
                    )).map((function(t) {
                        return t.id
                    }
                    ));
                    this.$confirm(this.$t("newchat.chatwindow.closeAIInfo"), this.$t("newchat.chatwindow.tip"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        type: "warning"
                    }).then((function() {
                        var a = {
                            isChatAi: 0,
                            ids: e
                        };
                        Object(r["o"])(a).then((function(e) {
                            t.$message({
                                type: "success",
                                message: t.$t("newchat.chatwindow.closeSuccess")
                            }),
                            t.batchOption = !1,
                            t.getGroupUsernameList(t.groupItem)
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                batchSetArchive: function(t, e) {
                    var a = this
                      , s = [];
                    s = this.batchOption ? this.usernameList.filter((function(t) {
                        return t.checked
                    }
                    )).map((function(t) {
                        return t.id
                    }
                    )) : [t.id];
                    var i = e ? this.$t("newchat.chatwindow.setArchiveInfo") : this.$t("newchat.chatwindow.cancelArchiveInfo");
                    this.$confirm(i, this.$t("newchat.chatwindow.tip"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        type: "warning"
                    }).then((function() {
                        var t = {
                            isFile: e,
                            ids: s
                        };
                        Object(r["h"])(t).then((function(t) {
                            a.$message({
                                type: "success",
                                message: e ? a.$t("newchat.chatwindow.setArchiveSuccess") : a.$t("newchat.chatwindow.cancelArchiveSuccess")
                            }),
                            a.batchOption = !1,
                            a.getGroupUsernameList(a.groupItem),
                            o["EventBus"].$emit("getGroupList"),
                            o["EventBus"].$emit("getNotRead")
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                }
            },
            destroyed: function() {
                this.$store.dispatch("newChat/setChatUsername", ""),
                o["EventBus"].$off("getGroupUsernameList"),
                o["EventBus"].$off("deleteDragged"),
                o["EventBus"].$off("delSession3"),
                o["EventBus"].$off("getGroupListUser")
            }
        }
          , p = m
          , g = (a("96bf"),
        a("cb39"),
        a("2877"))
          , f = Object(g["a"])(p, s, i, !1, null, "236f095a", null);
        e["default"] = f.exports
    },
    fac2: function(t, e, a) {
        "use strict";
        a.r(e);
        var s = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("div", [a("el-dialog", {
                attrs: {
                    title: t.$t("newchat.materialLibrary.addTextImageTemplate"),
                    visible: t.dialogVisible,
                    width: "50%",
                    "append-to-body": ""
                },
                on: {
                    "update:visible": function(e) {
                        t.dialogVisible = e
                    },
                    close: t.close
                }
            }, [a("el-form", {
                ref: "form",
                staticClass: "senTextGroupVisibleBox",
                attrs: {
                    model: t.form,
                    rules: t.formRules,
                    "label-width": "110px"
                }
            }, [a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.smName"),
                    prop: "smName"
                }
            }, [a("el-input", {
                attrs: {
                    size: "mini",
                    placeholder: t.$t("newchat.materialLibrary.pleaseEnterSmName")
                },
                model: {
                    value: t.form.smName,
                    callback: function(e) {
                        t.$set(t.form, "smName", "string" === typeof e ? e.trim() : e)
                    },
                    expression: "form.smName"
                }
            })], 1), a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.image"),
                    prop: "smId"
                }
            }, [a("el-upload", {
                ref: "file1",
                attrs: {
                    "file-list": t.fileList,
                    action: t.fileAction,
                    "on-success": t.handleUploadSuccess,
                    "on-error": t.handleUploadError,
                    headers: t.headers,
                    data: {
                        businessType: 6,
                        type: 4
                    },
                    accept: ".jpg,.jpeg,.png",
                    "on-remove": t.fileOnRemove,
                    "list-type": "picture",
                    limit: 1
                }
            }, [a("el-button", {
                attrs: {
                    size: "small",
                    type: "primary",
                    icon: "el-icon-upload"
                }
            }, [t._v(t._s(t.$t("headPortraitMaterial.clickUpload")))])], 1)], 1), a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.content"),
                    prop: "body"
                }
            }, [a("el-input", {
                staticClass: "textareaInp",
                attrs: {
                    type: "textarea",
                    maxlength: "2000",
                    "show-word-limit": "",
                    placeholder: t.$t("newchat.materialLibrary.pleaseEnterContent"),
                    autosize: {
                        minRows: 6,
                        maxRows: 12
                    },
                    resize: "none",
                    size: "mini"
                },
                model: {
                    value: t.form.body,
                    callback: function(e) {
                        t.$set(t.form, "body", e)
                    },
                    expression: "form.body"
                }
            })], 1), a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.buttonContent"),
                    prop: "buttonText"
                }
            }, [a("el-input", {
                attrs: {
                    placeholder: t.$t("newchat.materialLibrary.pleaseEnter"),
                    size: "mini"
                },
                model: {
                    value: t.form.buttonText,
                    callback: function(e) {
                        t.$set(t.form, "buttonText", e)
                    },
                    expression: "form.buttonText"
                }
            })], 1), a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.link"),
                    prop: "sourceUrls"
                }
            }, [t._l(t.form.sourceUrls, (function(e) {
                return a("div", {
                    key: e.id,
                    staticClass: "source-urls"
                }, [a("el-input", {
                    attrs: {
                        maxlength: "500",
                        size: "mini",
                        placeholder: t.$t("newchat.materialLibrary.pleaseEnterLink")
                    },
                    model: {
                        value: e.sourceUrl,
                        callback: function(a) {
                            t.$set(e, "sourceUrl", "string" === typeof a ? a.trim() : a)
                        },
                        expression: "item.sourceUrl"
                    }
                }), t.form.sourceUrls.length > 1 ? a("el-button", {
                    staticStyle: {
                        "margin-left": "10px"
                    },
                    attrs: {
                        type: "text",
                        size: "mini"
                    },
                    on: {
                        click: function(a) {
                            return t.dlelteSourceUrl(e)
                        }
                    }
                }, [t._v(t._s(t.$t("newchat.materialLibrary.delete")))]) : t._e()], 1)
            }
            )), a("el-button", {
                attrs: {
                    type: "info",
                    size: "mini"
                },
                on: {
                    click: t.addSourceUrl
                }
            }, [t._v(t._s(t.$t("newchat.materialLibrary.addLink")))])], 2), a("el-form-item", {
                attrs: {
                    label: t.$t("newchat.materialLibrary.isShortLink"),
                    prop: "isShortLink"
                }
            }, [a("el-radio-group", {
                model: {
                    value: t.form.isShortLink,
                    callback: function(e) {
                        t.$set(t.form, "isShortLink", e)
                    },
                    expression: "form.isShortLink"
                }
            }, [a("el-radio", {
                attrs: {
                    label: 0
                }
            }, [t._v(t._s(t.$t("newchat.materialLibrary.no")))]), a("el-radio", {
                attrs: {
                    label: 1
                }
            }, [t._v(t._s(t.$t("newchat.materialLibrary.yes")))])], 1)], 1), a("el-form-item", [a("el-button", {
                attrs: {
                    type: "primary",
                    size: "mini",
                    loading: t.buttonLoading
                },
                on: {
                    click: t.formSubmit
                }
            }, [t._v(t._s("add" === t.dialogType ? t.$t("newchat.materialLibrary.add") : t.$t("newchat.materialLibrary.modify")))]), a("el-button", {
                attrs: {
                    size: "mini"
                },
                on: {
                    click: t.close
                }
            }, [t._v(t._s(t.$t("newchat.dialog.cancel")))])], 1)], 1)], 1)], 1)
        }
          , i = []
          , n = a("5530")
          , o = (a("a9e3"),
        a("d9e2"),
        a("d3b7"),
        a("159b"),
        a("498a"),
        a("b0c0"),
        a("14d9"),
        a("c740"),
        a("a434"),
        a("5f87"))
          , r = a("852e")
          , c = a.n(r)
          , l = a("ed08")
          , u = a("f77b")
          , d = {
            props: {
                dialogType: {
                    type: String,
                    default: "add"
                },
                groupId: {
                    type: String | Number,
                    default: ""
                },
                scene: {
                    type: Number,
                    default: 0
                }
            },
            data: function() {
                var t = this;
                return {
                    dialogVisible: !1,
                    form: {
                        smName: "",
                        smId: "",
                        content: "",
                        buttonText: "",
                        sourceUrls: [{
                            sourceUrl: "",
                            id: 0
                        }],
                        isShortLink: 0
                    },
                    buttonLoading: !1,
                    fileList: [],
                    fileUrl: "",
                    fileAction: "/prod-api" + c.a.get("line") + "/biz/chat/files",
                    headers: {
                        Authorization: "Bearer " + Object(o["b"])()
                    },
                    formRules: {
                        smName: [{
                            required: !0,
                            message: this.$t("newchat.materialLibrary.pleaseEnterSmName"),
                            trigger: "blur"
                        }],
                        body: [{
                            required: !0,
                            message: this.$t("newchat.materialLibrary.pleaseEnterContent"),
                            trigger: "blur"
                        }],
                        buttonText: [{
                            required: !0,
                            message: this.$t("newchat.materialLibrary.pleaseEnter"),
                            trigger: "blur"
                        }],
                        smId: [{
                            required: !0,
                            validator: function(e, a, s) {
                                "" === t.form.smId ? s(new Error(t.$t("newchat.materialLibrary.pleaseEnterImage"))) : s()
                            },
                            trigger: "blur"
                        }],
                        sourceUrls: [{
                            required: !0,
                            validator: function(e, a, s) {
                                a.forEach((function(e, a) {
                                    "" === e.sourceUrl.trim() ? s(new Error(t.$t("newchat.materialLibrary.pleaseEnterSourceUrl"))) : Object(l["l"])(e.sourceUrl) || s(new Error(t.$t("newchat.materialLibrary.sourceUrlError", [a + 1]) + t.$t("newchat.materialLibrary.pleaseEnterCorrectSourceUrl")))
                                }
                                )),
                                s()
                            },
                            trigger: "blur"
                        }]
                    }
                }
            },
            watch: {
                groupId: function(t) {
                    t && (this.form.groupId = t)
                }
            },
            methods: {
                open: function() {
                    this.form = {
                        smName: "",
                        smId: "",
                        content: "",
                        buttonText: "",
                        sourceUrls: [{
                            sourceUrl: "",
                            id: 0
                        }],
                        isShortLink: 0
                    },
                    this.dialogVisible = !0
                },
                close: function() {
                    var t = this;
                    this.$nextTick((function() {
                        t.$refs.file1.clearFiles()
                    }
                    )),
                    this.dialogVisible = !1
                },
                handleUploadSuccess: function(t, e, a) {
                    200 == t.code ? (this.fileList = a,
                    this.form.smId = t.smMsg.id,
                    this.$refs.form.validateField("smId")) : (this.$message.error(this.$t("headPortraitMaterial.uploadFailed")),
                    e.status = "error",
                    e.name = this.$t("headPortraitMaterial.uploadFailed") + t.msg + "(" + "".concat(e.name, ")"),
                    this.fileList = [])
                },
                handleUploadError: function() {
                    this.$message.error(this.$t("headPortraitMaterial.uploadFailed"))
                },
                closeImageLink: function() {
                    this.fileList = [],
                    this.$refs.form.resetFields(),
                    this.form.smId = ""
                },
                fileOnRemove: function(t, e) {
                    this.form.smId = ""
                },
                addSourceUrl: function() {
                    var t = this.form.sourceUrls[this.form.sourceUrls.length - 1].id;
                    this.form.sourceUrls.push({
                        sourceUrl: "",
                        id: t + 1
                    })
                },
                formSubmit: function() {
                    var t = this;
                    this.$refs.form.validate((function(e) {
                        if (e) {
                            var a = Object(n["a"])(Object(n["a"])({}, t.form), {}, {
                                groupId: t.groupId,
                                linkType: 2,
                                scene: t.scene
                            });
                            t.buttonLoading = !0,
                            Object(u["f"])(a).then((function(e) {
                                t.$message.success(t.$t("newchat.materialLibrary.addSuccess")),
                                t.$emit("getSmList"),
                                t.$emit("getSmstoreGroup"),
                                t.dialogVisible = !1
                            }
                            )).finally((function() {
                                t.buttonLoading = !1
                            }
                            ))
                        }
                    }
                    ))
                },
                dlelteSourceUrl: function(t) {
                    var e = this.form.sourceUrls.findIndex((function(e) {
                        return e.id === t.id
                    }
                    ));
                    this.form.sourceUrls.splice(e, 1),
                    this.$refs.form.validateField("sourceUrls")
                }
            }
        }
          , h = d
          , m = a("2877")
          , p = Object(m["a"])(h, s, i, !1, null, null, null);
        e["default"] = p.exports
    },
    faef: function(t, e, a) {
        "use strict";
        a("8273")
    }
}]);
