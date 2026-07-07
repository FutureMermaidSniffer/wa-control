(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["chunk-24dce2c8", "chunk-2d0c1da7"], {
    4377: function(t, e, i) {
        "use strict";
        i("f908")
    },
    "488e": function(t, e, i) {
        "use strict";
        i.r(e),
        i.d(e, "EventBus", (function() {
            return s
        }
        ));
        var n = i("2b0e")
          , s = new n["default"]
    },
    "7d60": function(t, e, i) {
        "use strict";
        i.r(e);
        var n = function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return t.visible ? i("el-drawer", {
                staticClass: "groupMemberListDrawer",
                attrs: {
                    title: t.$t("newchat.chatwindow.groupDetails"),
                    visible: t.visible,
                    direction: "rtl",
                    "before-close": t.close,
                    "destroy-on-close": "",
                    size: 410
                },
                on: {
                    "update:visible": function(e) {
                        t.visible = e
                    }
                }
            }, [i("div", {
                staticClass: "groupDetailsBox"
            }, [i("div", {
                staticClass: "group-avatar-box"
            }, [i("div", {
                staticClass: "group-avatar-box-left"
            }, [i("el-avatar", {
                staticClass: "avatar",
                attrs: {
                    src: t.accountUsername.avatarUrl
                }
            }, [i("span", {
                staticClass: "avatar-text"
            }, [t._v("群")])]), 2 != t.myGroupIdentity || 0 === t.accountUsername.locked ? i("div", {
                staticClass: "avatar-edit-box",
                on: {
                    click: t.editGroupAvatar
                }
            }, [i("i", {
                staticClass: "el-icon-edit-outline"
            })]) : t._e()], 1), i("div", {
                staticClass: "group-name-box"
            }, [i("div", {
                staticClass: "group-name"
            }, [i("span", {
                staticClass: "group-name-text"
            }, [t._v(t._s(t.accountUsername.subject) + " ")]), 2 != t.myGroupIdentity || 0 === t.accountUsername.locked ? i("i", {
                staticClass: "el-icon-edit-outline edit-icon",
                on: {
                    click: t.editGroupName
                }
            }) : t._e()]), i("div", {
                staticClass: "group-code"
            }, [i("span", [t._v(t._s(t.accountUsername.groupCode))]), "newChat" == t.pageType ? i("el-button", {
                staticStyle: {
                    "margin-left": "10px",
                    color: "#F56C6C"
                },
                attrs: {
                    type: "text",
                    size: "mini"
                },
                on: {
                    click: t.quitGroupChat
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.quitGroup")))]) : t._e()], 1)])]), i("div", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.groupLinkLoading,
                    expression: "groupLinkLoading"
                }],
                staticClass: "group-desc-box"
            }, [i("div", [i("span", {
                staticStyle: {
                    "margin-right": "5px"
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.groupLink")))])]), t.accountUsername.groupLink ? [i("span", {
                staticClass: "primary-text"
            }, [t._v(t._s(t.accountUsername.groupLink))]), i("el-tooltip", {
                attrs: {
                    placement: "right",
                    "open-delay": 200
                }
            }, [i("div", {
                attrs: {
                    slot: "content"
                },
                slot: "content"
            }, [i("vue-qr", {
                ref: "qrCode",
                attrs: {
                    text: t.accountUsername.groupLink,
                    size: 90,
                    margin: 10
                }
            })], 1), i("i", {
                staticClass: "el-icon-picture-outline",
                staticStyle: {
                    "font-size": "14px",
                    color: "#606366",
                    cursor: "pointer",
                    "margin-left": "5px"
                }
            })]), i("el-button", {
                staticStyle: {
                    "margin-left": "10px",
                    color: "#409EFF"
                },
                attrs: {
                    type: "text",
                    size: "mini"
                },
                on: {
                    click: t.copyGroupLink
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.copy")))])] : 2 == t.accountUsername.groupLinkGetStatus ? [i("span", {
                staticClass: "group-link-text"
            }, [t._v(t._s(t.$t("newchat.chatwindow.noAdminTip")))])] : 1 == t.accountUsername.groupLinkGetStatus ? [i("span", {
                staticClass: "group-link-text"
            }, [t._v(t._s(t.$t("newchat.chatwindow.getting")))]), i("el-button", {
                staticStyle: {
                    "margin-left": "10px",
                    color: "#409EFF"
                },
                attrs: {
                    type: "text",
                    size: "mini"
                },
                on: {
                    click: t.getGroupLink
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.refresh")))])] : t._e()], 2), i("div", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.permissionsLoading,
                    expression: "permissionsLoading"
                }],
                staticClass: "group-desc-box"
            }, [i("div", [i("span", {
                staticStyle: {
                    "margin-right": "5px"
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.groupPermissions")))]), 2 == t.myGroupIdentity || t.isEditGroupPermissions ? t._e() : i("i", {
                staticClass: "el-icon-edit-outline edit-icon",
                on: {
                    click: t.openEditGroupPermissions
                }
            }), t.isEditGroupPermissions ? i("i", {
                staticClass: "el-icon-check edit-icon",
                staticStyle: {
                    "font-weight": "bold",
                    color: "#409EFF"
                },
                on: {
                    click: t.closeEditGroupPermissions
                }
            }) : t._e()]), i("div", {
                staticClass: "group-permissions-box"
            }, [t.isEditGroupPermissions ? [i("el-checkbox-group", {
                model: {
                    value: t.groupPermissions,
                    callback: function(e) {
                        t.groupPermissions = e
                    },
                    expression: "groupPermissions"
                }
            }, [i("el-checkbox", {
                attrs: {
                    label: "announcement"
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.announcementGroup")))]), i("el-checkbox", {
                attrs: {
                    label: "locked"
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.groupMemberEditPermissions")))])], 1)] : [1 == t.accountUsername.announcement ? i("el-tag", {
                attrs: {
                    size: "mini",
                    effect: "dark",
                    type: "warning",
                    "disable-transitions": ""
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.announcementGroup")))]) : t._e(), 0 == t.accountUsername.locked ? i("el-tag", {
                attrs: {
                    size: "mini",
                    effect: "dark",
                    "disable-transitions": ""
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.groupMemberEditPermissions")))]) : t._e()]], 2)]), i("div", {
                staticClass: "group-desc-box"
            }, [i("div", [t._v(t._s(t.$t("newchat.chatwindow.groupDescription")) + " "), 2 != t.myGroupIdentity || 0 === t.accountUsername.locked ? i("i", {
                staticClass: "el-icon-edit-outline edit-icon",
                on: {
                    click: t.editGroupDescription
                }
            }) : t._e()]), i("div", {
                staticClass: "groupDescContent"
            }, [t._v(t._s(t.accountUsername.description ? t.accountUsername.description : this.$t("newchat.chatwindow.empty")))])]), i("div", {
                staticClass: "group-member-box"
            }, [i("div", {
                staticClass: "group-member-title",
                staticStyle: {
                    "margin-bottom": "10px",
                    color: "#303133"
                }
            }, [t._v(" " + t._s(t.$t("newchat.chatwindow.groupMemberList")) + "（" + t._s(t.groupMemberTotal) + "）"), i("i", {
                staticClass: "el-icon-download",
                on: {
                    click: t.exportMembersOpen
                }
            })]), i("div", {
                staticClass: "groupMemberListBox"
            }, [i("div", {
                staticClass: "group-member-search-box"
            }, [i("el-input", {
                staticClass: "jid-input",
                attrs: {
                    placeholder: t.$t("newchat.chatwindow.enterWsNumber"),
                    size: "mini",
                    clearable: ""
                },
                on: {
                    change: t.refreshGroupMemberList,
                    input: t.jidInput
                },
                model: {
                    value: t.jid,
                    callback: function(e) {
                        t.jid = e
                    },
                    expression: "jid"
                }
            }), i("el-button", {
                attrs: {
                    type: "primary",
                    icon: "el-icon-refresh",
                    circle: "",
                    size: "mini",
                    loading: t.loading
                },
                on: {
                    click: t.refreshGroupMemberList
                }
            })], 1), i("div", {
                directives: [{
                    name: "infinite-scroll",
                    rawName: "v-infinite-scroll",
                    value: t.load,
                    expression: "load"
                }],
                staticClass: "group-member-list-box",
                attrs: {
                    "infinite-scroll-disabled": t.disabled,
                    "infinite-scroll-distance": 50
                }
            }, [t._l(t.groupMemberListData, (function(e) {
                return i("div", {
                    key: e.id,
                    staticClass: "menberItemBox"
                }, [i("el-avatar", {
                    staticClass: "avatar",
                    attrs: {
                        src: e.avatarUrl
                    }
                }, [t._v("User")]), i("div", {
                    staticClass: "item-right-box"
                }, [i("div", {
                    staticClass: "username-box"
                }, [i("div", {
                    staticClass: "username-box-flex"
                }, [i("div", [i("span", {
                    class: {
                        "brand-text": 1 == e.isChargeWs
                    }
                }, [t._v(t._s(e.nickName || e.jid))]), e.username != t.myUserName.login && t.checkRole(["csr"]) ? i("el-button", {
                    staticStyle: {
                        "margin-left": "5px"
                    },
                    attrs: {
                        icon: "el-icon-chat-line-round",
                        type: "text"
                    },
                    on: {
                        click: function(i) {
                            return t.addSession(e)
                        }
                    }
                }) : t._e()], 1), i("div", {
                    staticClass: "username-box-flex-right"
                }, [e.username == t.myUserName.login ? i("el-tag", {
                    attrs: {
                        size: "mini"
                    }
                }, [t._v(t._s(t.$t("newchat.chatwindow.my")))]) : t._e(), 0 == e.groupIdentity ? i("el-tag", {
                    attrs: {
                        size: "mini"
                    }
                }, [t._v(t._s(t.$t("newchat.chatwindow.lord")))]) : 1 == e.groupIdentity ? i("el-tag", {
                    attrs: {
                        type: "warning",
                        size: "mini"
                    }
                }, [t._v(t._s(t.$t("newchat.chatwindow.administrator")))]) : 2 == e.groupIdentity ? i("el-tag", {
                    attrs: {
                        type: "info",
                        size: "mini"
                    }
                }, [t._v(t._s(t.$t("newchat.chatwindow.member")))]) : t._e()], 1)]), i("div", {
                    staticClass: "username-box-flex"
                }, [i("span", {
                    class: {
                        "brand-text": 1 == e.isChargeWs
                    },
                    staticStyle: {
                        "font-size": "12px",
                        color: "#909399"
                    }
                }, [t._v(t._s(e.jid))]), i("div", {
                    staticClass: "username-box-flex-right"
                }, [i("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        content: t.$t("newchat.chatwindow.setAdmin"),
                        placement: "top",
                        "open-delay": 500
                    }
                }, [t.showSetAdmin(e) ? i("i", {
                    staticClass: "el-icon-user-solid set-group-admin",
                    on: {
                        click: function(i) {
                            return t.setAdminMember(e)
                        }
                    }
                }) : t._e()]), i("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        content: t.$t("newchat.chatwindow.removeAdmin"),
                        placement: "top",
                        "open-delay": 500
                    }
                }, [t.showRemoveAdmin(e) ? i("i", {
                    staticClass: "el-icon-user remove-group-admin",
                    on: {
                        click: function(i) {
                            return t.removeGroupMemberAdmin(e)
                        }
                    }
                }) : t._e()]), i("el-tooltip", {
                    staticClass: "item",
                    attrs: {
                        effect: "dark",
                        content: t.$t("newchat.chatwindow.removeMembers"),
                        placement: "top",
                        "open-delay": 500
                    }
                }, [t.showKickOut(e) ? i("i", {
                    staticClass: "el-icon-close exit-group-buttom",
                    on: {
                        click: function(i) {
                            return t.removeGroupMembers(e)
                        }
                    }
                }) : t._e()])], 1)])])])], 1)
            }
            )), i("div", {
                staticClass: "loading-box"
            }, [t.loading ? i("p", [t._v(t._s(t.$t("newchat.chatwindow.loading")))]) : t.noMore ? i("p", [t._v(t._s(t.$t("newchat.chatwindow.noMore")))]) : t._e()])], 2)])])]), i("el-dialog", {
                attrs: {
                    title: t.$t("newchat.chatwindow.setGroupDescription"),
                    visible: t.setGroupDescriptionVisible,
                    width: "500px",
                    "append-to-body": ""
                },
                on: {
                    "update:visible": function(e) {
                        t.setGroupDescriptionVisible = e
                    }
                }
            }, [i("el-input", {
                attrs: {
                    placeholder: t.$t("newchat.chatwindow.setGroupDescriptionPlaceholder"),
                    type: "textarea",
                    rows: 10,
                    maxlength: 500,
                    "show-word-limit": ""
                },
                model: {
                    value: t.groupDescription,
                    callback: function(e) {
                        t.groupDescription = e
                    },
                    expression: "groupDescription"
                }
            }), i("div", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [i("el-button", {
                on: {
                    click: function(e) {
                        t.setGroupDescriptionVisible = !1
                    }
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.cancel")))]), i("el-button", {
                attrs: {
                    type: "primary",
                    loading: t.subLoading
                },
                on: {
                    click: t.setGroupDescription
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.confirm")))])], 1)], 1), i("el-dialog", {
                attrs: {
                    title: t.$t("newchat.chatwindow.setGroupAvatar"),
                    visible: t.setGroupAvatarVisible,
                    width: "400px",
                    "append-to-body": ""
                },
                on: {
                    "update:visible": function(e) {
                        t.setGroupAvatarVisible = e
                    }
                }
            }, [i("el-upload", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: t.uploading,
                    expression: "uploading"
                }],
                staticClass: "avatar-uploader",
                attrs: {
                    action: t.fileAction,
                    "show-file-list": !1,
                    "on-success": t.handleAvatarSuccess,
                    "on-error": t.handleUploadError,
                    "before-upload": t.beforeAvatarUpload,
                    headers: t.headers,
                    data: {
                        businessType: 1,
                        type: 1
                    }
                }
            }, [t.groupAvatar ? i("img", {
                staticClass: "avatar",
                attrs: {
                    src: t.groupAvatar
                }
            }) : i("i", {
                staticClass: "el-icon-plus avatar-uploader-icon"
            }), i("div", {
                staticClass: "el-upload__tip",
                attrs: {
                    slot: "tip"
                },
                slot: "tip"
            }, [t._v(" " + t._s(t.$t("headPortraitMaterial.uploadTip1"))), i("br"), t._v(" " + t._s(t.$t("headPortraitMaterial.uploadTip2"))), i("br"), t._v(" " + t._s(t.$t("headPortraitMaterial.uploadTip3"))), i("br"), t._v(" " + t._s(t.$t("headPortraitMaterial.uploadTip4"))), i("br"), t._v(" " + t._s(t.$t("headPortraitMaterial.uploadTip5")) + " ")])]), i("div", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [i("el-button", {
                on: {
                    click: function(e) {
                        t.setGroupAvatarVisible = !1
                    }
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.cancel")))]), i("el-button", {
                attrs: {
                    type: "primary",
                    loading: t.subLoading
                },
                on: {
                    click: t.setGroupAvatar
                }
            }, [t._v(t._s(t.$t("newchat.chatwindow.confirm")))])], 1)], 1), i("el-dialog", {
                attrs: {
                    title: "导出群成员",
                    visible: t.exportMembersVisible,
                    width: "440px",
                    "append-to-body": ""
                },
                on: {
                    "update:visible": function(e) {
                        t.exportMembersVisible = e
                    }
                }
            }, [i("div", {
                staticStyle: {
                    "margin-bottom": "8px"
                }
            }, [t._v(t._s(t.$t("accountList.exportSelectFields")) + "：")]), i("el-checkbox-group", {
                model: {
                    value: t.exportMembersSelectedList,
                    callback: function(e) {
                        t.exportMembersSelectedList = e
                    },
                    expression: "exportMembersSelectedList"
                }
            }, [i("el-checkbox", {
                attrs: {
                    label: "nickName"
                }
            }, [t._v("成员名称")])], 1), i("div", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [i("el-button", {
                attrs: {
                    type: "primary",
                    size: "mini"
                },
                on: {
                    click: t.exportMembers
                }
            }, [t._v(t._s(t.$t("dialog.confirm")))]), i("el-button", {
                attrs: {
                    size: "mini"
                },
                on: {
                    click: function(e) {
                        t.exportMembersVisible = !1
                    }
                }
            }, [t._v(t._s(t.$t("dialog.cancel")))])], 1)], 1)], 1) : t._e()
        }
          , s = []
          , a = i("c7eb")
          , o = i("1da1")
          , r = (i("a9e3"),
        i("d3b7"),
        i("ac1f"),
        i("5319"),
        i("99af"),
        i("b0c0"),
        i("3ca3"),
        i("ddb0"),
        i("2b3d"),
        i("9861"),
        i("498a"),
        i("a4d3"),
        i("e01a"),
        i("14d9"),
        i("caad"),
        i("2532"),
        i("488e"))
          , c = i("852e")
          , u = i.n(c)
          , l = i("ed08")
          , p = i("5f87")
          , d = i("f77b")
          , m = i("658f5")
          , h = i.n(m)
          , g = i("e350")
          , w = {
            components: {
                VueQr: h.a
            },
            props: {
                myGroupIdentity: {
                    type: Number,
                    default: 2
                },
                pageType: {
                    type: String,
                    default: "newChat"
                }
            },
            name: "groupDetailsDrawer",
            data: function() {
                return {
                    visible: !1,
                    groupMemberListData: [],
                    groupMemberTotal: 0,
                    loading: !1,
                    groupMemberPage: 1,
                    groupMemberPageSize: 20,
                    jid: "",
                    setGroupDescriptionVisible: !1,
                    setGroupAvatarVisible: !1,
                    groupDescription: "",
                    groupAvatar: "",
                    fileAction: "/prod-api" + u.a.get("line") + "/biz/account/files",
                    headers: {
                        Authorization: "Bearer " + Object(p["b"])()
                    },
                    subLoading: !1,
                    uploading: !1,
                    groupPermissions: [],
                    isEditGroupPermissions: !1,
                    permissionsLoading: !1,
                    groupLinkLoading: !1,
                    exportMembersVisible: !1,
                    exportMembersSelectedList: []
                }
            },
            computed: {
                noMore: function() {
                    return this.groupMemberListData.length >= this.groupMemberTotal
                },
                disabled: function() {
                    return this.loading || this.noMore
                },
                accountUsername: function() {
                    return this.$store.state.newChat.accountUserNameData
                },
                myUserName: function() {
                    return this.$store.state.newChat.chatUserNameData
                },
                showSetAdmin: function() {
                    var t = this;
                    return function(e) {
                        return t.myUserName.login != e.username && ((0 == t.myGroupIdentity || 1 == t.myGroupIdentity) && 2 == e.groupIdentity)
                    }
                },
                showRemoveAdmin: function() {
                    var t = this;
                    return function(e) {
                        return t.myUserName.login != e.username && ((0 == t.myGroupIdentity || 1 == t.myGroupIdentity) && 1 == e.groupIdentity)
                    }
                },
                showKickOut: function() {
                    var t = this;
                    return function(e) {
                        return t.myUserName.login != e.username && (0 == t.myGroupIdentity || 1 == t.myGroupIdentity && 2 == e.groupIdentity)
                    }
                }
            },
            methods: {
                checkRole: g["b"],
                open: function() {
                    this.visible = !0,
                    this.groupMemberPage = 1,
                    this.groupMemberListData = [],
                    this.jid = "",
                    this.isEditGroupPermissions = !1,
                    this.groupPermissions = [],
                    this.getGroupMemberList()
                },
                close: function() {
                    this.visible = !1
                },
                exportMembersOpen: function() {
                    this.exportMembersSelectedList = [],
                    this.exportMembersVisible = !0
                },
                exportMembers: function() {
                    var t = this.exportMembersSelectedList || []
                      , e = {
                        groupCode: this.accountUsername.groupCode,
                        exportNickName: t.length > 0 ? 1 : 0
                    };
                    this.download("biz/chatwsgroup/exportGroupMember", e, "exportMembers" + "".concat((new Date).getTime(), ".txt"), {
                        timeout: 9e5
                    }),
                    this.exportMembersVisible = !1,
                    this.$message({
                        message: this.$t("leadinginlog.exportSuccess"),
                        type: "success"
                    })
                },
                getGroupMemberList: function() {
                    var t = this;
                    this.loading = !0;
                    var e = {
                        pageNum: this.groupMemberPage,
                        pageSize: this.groupMemberPageSize,
                        groupId: this.accountUsername.groupId,
                        jid: this.jid
                    };
                    Object(d["R"])(e).then((function(e) {
                        t.groupMemberListData = e.rows,
                        t.groupMemberTotal = e.total
                    }
                    )).finally((function() {
                        t.loading = !1
                    }
                    ))
                },
                refreshGroupMemberList: function() {
                    this.groupMemberListData = [],
                    this.groupMemberPage = 1,
                    this.getGroupMemberList()
                },
                jidInput: function(t) {
                    this.jid = t.replace(/\D/g, "")
                },
                load: function() {
                    var t = this;
                    this.loading = !0,
                    this.groupMemberPage++;
                    var e = {
                        pageNum: this.groupMemberPage,
                        pageSize: this.groupMemberPageSize,
                        groupId: this.accountUsername.groupId,
                        jid: this.jid
                    };
                    Object(d["R"])(e).then((function(e) {
                        t.groupMemberListData = t.groupMemberListData.concat(e.rows)
                    }
                    )).catch((function() {
                        t.groupMemberPage--
                    }
                    )).finally((function() {
                        t.loading = !1
                    }
                    ))
                },
                quitGroupChat: function() {
                    var t = this;
                    this.$confirm(this.$t("newchat.chatwindow.quitGroupInfo"), this.$t("newchat.chatwindow.tip"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        type: "warning"
                    }).then((function() {
                        var e = {
                            groupId: t.accountUsername.groupId,
                            username: t.myUserName.username
                        };
                        Object(d["jb"])(e).then((function(e) {
                            t.$message({
                                type: "success",
                                message: t.$t("newchat.chatwindow.quitGroupSuccess")
                            }),
                            t.close(),
                            t.$store.dispatch("newChat/setAccountUsernameData", ""),
                            r["EventBus"].$emit("delGroupSession", t.accountUsername.groupId)
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                removeGroupMembers: function(t) {
                    var e = this;
                    this.$confirm(this.$t("newchat.chatwindow.removeGroupMemberInfo"), this.$t("newchat.chatwindow.tip"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        type: "warning"
                    }).then((function() {
                        var i = {
                            groupId: e.accountUsername.groupId,
                            username: e.myUserName.username,
                            memberIds: [t.id]
                        };
                        Object(d["kb"])(i).then((function(t) {
                            e.$message({
                                type: "success",
                                message: e.$t("newchat.chatwindow.removeGroupMemberSuccess")
                            }),
                            e.accountUsername.memberCount -= 1,
                            e.refreshGroupMemberList()
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                setAdminMember: function(t) {
                    var e = this
                      , i = {
                        groupId: this.accountUsername.groupId,
                        username: this.myUserName.username,
                        memberIds: [t.id]
                    };
                    this.$confirm(this.$t("newchat.chatwindow.setAdminInfo"), this.$t("newchat.chatwindow.tip"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        type: "warning"
                    }).then((function() {
                        Object(d["Ab"])(i).then((function(t) {
                            e.$message({
                                type: "success",
                                message: e.$t("newchat.chatwindow.setSuccess")
                            })
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                removeGroupMemberAdmin: function(t) {
                    var e = this
                      , i = {
                        groupId: this.accountUsername.groupId,
                        username: this.myUserName.username,
                        memberIds: [t.id]
                    };
                    this.$confirm(this.$t("newchat.chatwindow.removeAdminInfo"), this.$t("newchat.chatwindow.tip"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        type: "warning"
                    }).then((function() {
                        Object(d["t"])(i).then((function(t) {
                            e.$message({
                                type: "success",
                                message: e.$t("newchat.chatwindow.removeSuccess")
                            })
                        }
                        ))
                    }
                    )).catch((function() {}
                    ))
                },
                editGroupAvatar: function() {
                    this.setGroupAvatarVisible = !0,
                    this.groupAvatar = ""
                },
                resizeImage: function(t, e) {
                    return new Promise((function(i, n) {
                        var s = new Image;
                        s.onload = function() {
                            if (s.width < 300 || s.height < 300)
                                return n("头像尺寸不能小于300*300"),
                                !1;
                            var r = document.createElement("canvas")
                              , c = r.getContext("2d")
                              , u = e;
                            e > s.width && e > s.height && (u = s.width < s.height ? s.width : s.height);
                            var l = Math.max(u / s.width, u / s.height)
                              , p = s.width * l
                              , d = s.height * l
                              , m = 0
                              , h = 0;
                            p > u && (m = (u - p) / 2),
                            d > u && (h = (u - d) / 2),
                            r.width = u,
                            r.height = u,
                            c.fillStyle = "#ffffff",
                            c.fillRect(0, 0, u, u),
                            c.drawImage(s, m, h, p, d);
                            var g = r.getContext("2d");
                            g.fillStyle = "#C0C4CC";
                            var w = Math.floor(Math.random() * u)
                              , b = Math.floor(Math.random() * u);
                            g.fillRect(w, b, 1, 1),
                            r.toBlob(function() {
                                var e = Object(o["a"])(Object(a["a"])().mark((function e(n) {
                                    return Object(a["a"])().wrap((function(e) {
                                        while (1)
                                            switch (e.prev = e.next) {
                                            case 0:
                                                n.name = t.name,
                                                i(n);
                                            case 2:
                                            case "end":
                                                return e.stop()
                                            }
                                    }
                                    ), e)
                                }
                                )));
                                return function(t) {
                                    return e.apply(this, arguments)
                                }
                            }(), "image/jpeg")
                        }
                        ,
                        s.onerror = n,
                        s.src = URL.createObjectURL(t)
                    }
                    ))
                },
                beforeAvatarUpload: function(t) {
                    var e = this;
                    return Object(o["a"])(Object(a["a"])().mark((function i() {
                        var n, s, o, r;
                        return Object(a["a"])().wrap((function(i) {
                            while (1)
                                switch (i.prev = i.next) {
                                case 0:
                                    return e.uploading = !0,
                                    n = Math.floor(300 * Math.random()) + 300,
                                    i.prev = 2,
                                    i.next = 5,
                                    e.resizeImage(t, n);
                                case 5:
                                    if (s = i.sent,
                                    o = new File([s],t.name,{
                                        type: t.type
                                    }),
                                    !(o.size > 104857.6)) {
                                        i.next = 14;
                                        break
                                    }
                                    return i.next = 10,
                                    Object(l["b"])(o, .1);
                                case 10:
                                    return r = i.sent,
                                    i.abrupt("return", r);
                                case 14:
                                    return i.abrupt("return", o);
                                case 15:
                                    i.next = 22;
                                    break;
                                case 17:
                                    return i.prev = 17,
                                    i.t0 = i["catch"](2),
                                    e.$message.error(i.t0),
                                    e.uploading = !1,
                                    i.abrupt("return", Promise.reject(i.t0));
                                case 22:
                                case "end":
                                    return i.stop()
                                }
                        }
                        ), i, null, [[2, 17]])
                    }
                    )))()
                },
                handleAvatarSuccess: function(t, e, i) {
                    200 == t.code ? (this.uploading = !1,
                    this.groupAvatar = t.url) : this.handleUploadError()
                },
                handleUploadError: function() {
                    this.groupAvatar = "",
                    this.uploading = !1,
                    this.$message.error(this.$t("newchat.chatwindow.uploadFailed"))
                },
                setGroupAvatar: function() {
                    var t = this;
                    if (this.groupAvatar) {
                        this.subLoading = !0;
                        var e = {
                            username: this.myUserName.username,
                            groupIds: [this.accountUsername.groupId],
                            avatarUrl: this.groupAvatar
                        };
                        Object(d["w"])(e).then((function(e) {
                            t.accountUsername.avatarUrl = t.groupAvatar,
                            t.setGroupAvatarVisible = !1,
                            t.$message({
                                type: "success",
                                message: t.$t("newchat.chatwindow.requestSuccess")
                            })
                        }
                        )).finally((function() {
                            t.subLoading = !1
                        }
                        ))
                    } else
                        this.$message.error(this.$t("newchat.chatwindow.pleaseUploadAvatar"))
                },
                editGroupName: function() {
                    var t = this;
                    this.$prompt("", this.$t("newchat.chatwindow.editGroupName"), {
                        confirmButtonText: this.$t("newchat.chatwindow.confirm"),
                        cancelButtonText: this.$t("newchat.chatwindow.cancel"),
                        inputValue: this.accountUsername.subject,
                        inputValidator: function(e) {
                            return e.trim() ? e.trim().length > 50 ? t.$t("newchat.chatwindow.groupNameTooLong", [50]) : void 0 : t.$t("newchat.chatwindow.groupNameNoEmpty")
                        }
                    }).then((function(e) {
                        var i = e.value
                          , n = {
                            username: t.myUserName.username,
                            groupIds: [t.accountUsername.groupId],
                            subject: i.trim(),
                            isSubjectNum: 0
                        };
                        Object(d["y"])(n).then((function(e) {
                            t.accountUsername.subject = i.trim(),
                            t.$message({
                                type: "success",
                                message: t.$t("newchat.chatwindow.requestSuccess")
                            })
                        }
                        ))
                    }
                    ))
                },
                editGroupDescription: function() {
                    this.groupDescription = this.accountUsername.description,
                    this.setGroupDescriptionVisible = !0
                },
                setGroupDescription: function() {
                    var t = this
                      , e = {
                        username: this.myUserName.username,
                        groupIds: [this.accountUsername.groupId],
                        description: this.groupDescription
                    };
                    this.subLoading = !0,
                    Object(d["x"])(e).then((function(e) {
                        t.accountUsername.description = t.groupDescription,
                        t.setGroupDescriptionVisible = !1,
                        t.$message({
                            type: "success",
                            message: t.$t("newchat.chatwindow.requestSuccess")
                        })
                    }
                    )).finally((function() {
                        t.subLoading = !1
                    }
                    ))
                },
                openEditGroupPermissions: function() {
                    this.isEditGroupPermissions = !0,
                    this.groupPermissions = [],
                    1 == this.accountUsername.announcement && this.groupPermissions.push("announcement"),
                    0 == this.accountUsername.locked && this.groupPermissions.push("locked")
                },
                closeEditGroupPermissions: function() {
                    var t = this;
                    this.isEditGroupPermissions = !1;
                    var e = [];
                    this.groupPermissions.includes("locked") && 1 == this.accountUsername.locked ? e.push(this.setGroupMemberLocked(0)) : this.groupPermissions.includes("locked") || 0 != this.accountUsername.locked || e.push(this.setGroupMemberLocked(1)),
                    this.groupPermissions.includes("announcement") && 0 == this.accountUsername.announcement ? e.push(this.setGroupMemberAnnouncement(1)) : this.groupPermissions.includes("announcement") || 1 != this.accountUsername.announcement || e.push(this.setGroupMemberAnnouncement(0)),
                    e.length > 0 && (this.permissionsLoading = !0,
                    Promise.all(e).then((function(e) {
                        t.$message({
                            type: "success",
                            message: t.$t("newchat.chatwindow.requestSuccess")
                        })
                    }
                    )).catch((function(t) {
                        console.log(t)
                    }
                    )).finally((function() {
                        t.permissionsLoading = !1
                    }
                    )))
                },
                setGroupMemberLocked: function(t) {
                    var e = this
                      , i = {
                        csUsername: this.myUserName.username,
                        groupId: this.accountUsername.groupId,
                        locked: t
                    };
                    return Object(d["Cb"])(i).then((function(i) {
                        e.accountUsername.locked = t
                    }
                    ))
                },
                setGroupMemberAnnouncement: function(t) {
                    var e = this
                      , i = {
                        csUsername: this.myUserName.username,
                        groupId: this.accountUsername.groupId,
                        announcement: t
                    };
                    return Object(d["Bb"])(i).then((function(i) {
                        e.accountUsername.announcement = t
                    }
                    ))
                },
                copyGroupLink: function() {
                    var t = this;
                    Object(l["c"])(this.accountUsername.groupLink).then((function() {
                        t.$message.success(t.$t("newchat.chatwindow.copySuccess"))
                    }
                    )).catch((function() {
                        t.$message.error(t.$t("newchat.chatwindow.copyFailed"))
                    }
                    ))
                },
                getGroupLink: function() {
                    var t = this;
                    this.groupLinkLoading = !0;
                    var e = {
                        chatId: this.accountUsername.chatId,
                        username: this.myUserName.username
                    };
                    Object(d["O"])(e).then((function(e) {
                        t.accountUsername.groupLink = e.info.groupLink,
                        t.accountUsername.groupLinkGetStatus = e.info.groupLinkGetStatus
                    }
                    )).finally((function() {
                        t.groupLinkLoading = !1
                    }
                    ))
                },
                addSession: function(t) {
                    var e = {
                        csUsername: this.myUserName.username,
                        username: t.username,
                        login: this.myUserName.login,
                        remark: this.accountUsername.subject + "(" + this.accountUsername.groupCode + ")"
                    };
                    r["EventBus"].$emit("groupMemberClickChat", e),
                    this.close()
                }
            }
        }
          , b = w
          , f = (i("4377"),
        i("2877"))
          , v = Object(f["a"])(b, n, s, !1, null, "7565531f", null);
        e["default"] = v.exports
    },
    f908: function(t, e, i) {}
}]);
