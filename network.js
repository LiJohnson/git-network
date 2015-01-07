var $ = {};
function() {
    $.fetchPoll = function(e, t) {
        return new Promise(function(n, r) {
            var i;
            return (i = function(o) {
                var a;
                return a = function(e) {
                    switch (e.status) {
                        case 200:
                            return n(e);
                        case 202:
                            return setTimeout(function() {
                                return i(1.5 * o)
                            }, o);
                        default:
                            return r()
                    }
                }, $.fetch(e, t).then(a, r)
            })(1e3)
        })
    }
}.call(this),
function() {
    var t, e, n, i, s, r, a = function(t, e) {
        return function() {
            return t.apply(e, arguments)
        }
    };
    i = function() {
        function i(t, e, n) {
            this.container = t, this.width = e, this.height = n, this.initError = a(this.initError, this), this.init = a(this.init, this), this.loaderInterval = null, this.loaderOffset = 0, this.ctx = this.initCanvas(t, e, n), this.startLoader("Loading graph data"), this.loadMeta()
        }
        return i.prototype.initCanvas = function(t) {
            var e, n, i, s, r, a, o;
            return s = t.getElementsByTagName("canvas")[0], s.style.zIndex = "0", i = s.width, n = s.height, r = s.getContext("2d"), a = window.devicePixelRatio || 1, e = r.webkitBackingStorePixelRatio || r.mozBackingStorePixelRatio || r.msBackingStorePixelRatio || r.oBackingStorePixelRatio || r.backingStorePixelRatio || 1, o = a / e, 1 === o ? r : (s.width = i * o, s.height = n * o, s.style.width = i + "px", s.style.height = n + "px", r.scale(o, o), r)
        }, i.prototype.startLoader = function(t) {
            return this.ctx.save(), this.ctx.font = "14px 'Helvetica Neue', Arial, sans-serif", this.ctx.fillStyle = "#cacaca", this.ctx.textAlign = "center", this.ctx.fillText(t, this.width / 2, 155), this.ctx.restore(), this.displayLoader()
        }, i.prototype.stopLoader = function() {
            var t;
            return t = this.container.querySelector(".large-loading-area"), t.classList.add("is-hidden")
        }, i.prototype.displayLoader = function() {
            var t;
            return t = this.container.querySelector(".large-loading-area"), t.classList.remove("is-hidden")
        }, i.prototype.loadMeta = function() {
            var t, e;
            return t = function(t) {
                return t.json()
            }, e = this.container.getAttribute("data-network-graph-meta-url"), $.fetchPoll(e).then(t, this.initError).then(this.init)
        }, i.prototype.init = function(i) {
            var a, o, c, l, u, d;
            for (this.focus = i.focus, this.nethash = i.nethash, this.spaceMap = i.spacemap, this.userBlocks = i.blocks, this.commits = function() {
                var e, n, s, r;
                for (s = i.dates, r = [], o = e = 0, n = s.length; n > e; o = ++e)
                    a = s[o], r.push(new t(o, a));
                return r
            }(), this.users = {}, d = i.users, l = 0, u = d.length; u > l; l++)
                c = d[l], this.users[c.name] = c;
            return this.chrome = new s(this, this.ctx, this.width, this.height, this.focus, this.commits, this.userBlocks, this.users), this.graph = new r(this, this.ctx, this.width, this.height, this.focus, this.commits, this.users, this.spaceMap, this.userBlocks, this.nethash), this.mouseDriver = new n(this.container, this.chrome, this.graph), this.keyDriver = new e(this.chrome, this.graph), this.stopLoader(), this.graph.drawBackground(), this.chrome.draw(), this.graph.requestInitialChunk()
        }, i.prototype.initError = function() {
            return this.stopLoader(), this.ctx.clearRect(0, 0, this.width, this.height), this.startLoader("Graph could not be drawn due to a network problem.")
        }, i
    }(), t = function() {
        function t(t, e) {
            this.time = t, this.date = new Date(e), this.requested = null, this.populated = null
        }
        return t.prototype.populate = function(t, e, n) {
            return this.user = e, this.author = t.author, this.date = new Date(t.date.replace(" ", "T")), this.gravatar = t.gravatar, this.id = t.id, this.login = t.login, this.message = t.message, this.space = t.space, this.time = t.time, this.parents = this.populateParents(t.parents, n), this.requested = !0, this.populated = new Date
        }, t.prototype.populateParents = function(t, e) {
            var n, i, s;
            return s = function() {
                var s, r, a;
                for (a = [], s = 0, r = t.length; r > s; s++)
                    n = t[s], i = e[n[1]], i.id = n[0], i.space = n[2], a.push(i);
                return a
            }()
        }, t
    }(), s = function() {
        function t(t, e, n, i, s, r, a, o) {
            this.network = t, this.ctx = e, this.width = n, this.height = i, this.commits = r, this.userBlocks = a, this.users = o, this.namesWidth = 120, this.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], this.userBgColors = ["#fff", "#f7f7f7"], this.headerColor = "#f7f7f7", this.dividerColor = "#ddd", this.headerHeight = 40, this.dateRowHeight = 30, this.graphTopOffset = this.headerHeight + this.dateRowHeight, this.nameLineHeight = 24, this.offsetX = this.namesWidth + (n - this.namesWidth) / 2 - s * this.nameLineHeight, this.offsetY = 0, this.contentHeight = this.calcContentHeight(), this.graphMidpoint = this.namesWidth + (n - this.namesWidth) / 2, this.activeUser = null
        }
        return t.prototype.moveX = function(t) {
            return this.offsetX += t, this.offsetX > this.graphMidpoint ? this.offsetX = this.graphMidpoint : this.offsetX < this.graphMidpoint - this.commits.length * this.nameLineHeight ? this.offsetX = this.graphMidpoint - this.commits.length * this.nameLineHeight : void 0
        }, t.prototype.moveY = function(t) {
            return this.offsetY += t, this.offsetY > 0 || this.contentHeight < this.height - this.graphTopOffset ? this.offsetY = 0 : this.offsetY < -this.contentHeight + this.height / 2 ? this.offsetY = -this.contentHeight + this.height / 2 : void 0
        }, t.prototype.calcContentHeight = function() {
            var t, e, n, i, s;
            for (e = 0, s = this.userBlocks, n = 0, i = s.length; i > n; n++)
                t = s[n], e += t.count;
            return e * this.nameLineHeight
        }, t.prototype.hover = function(t, e) {
            var n, i, s, r;
            for (r = this.userBlocks, i = 0, s = r.length; s > i; i++)
                if (n = r[i], t > 0 && t < this.namesWidth && e > this.graphTopOffset + this.offsetY + n.start * this.nameLineHeight && e < this.graphTopOffset + this.offsetY + (n.start + n.count) * this.nameLineHeight)
                    return this.users[n.name];
            return null
        }, t.prototype.draw = function() {
            return this.drawTimeline(this.ctx), this.drawUsers(this.ctx)
        }, t.prototype.drawTimeline = function(t) {
            var e, n, i, s, r, a, o, c, l, u, d;
            for (t.fillStyle = this.headerColor, t.fillRect(0, 0, this.width, this.headerHeight), t.fillStyle = this.dividerColor, t.fillRect(0, this.headerHeight - 1, this.width, 1), c = parseInt((0 - this.offsetX) / this.nameLineHeight), 0 > c && (c = 0), o = c + parseInt(this.width / (this.nameLineHeight - 1)), o > this.commits.length && (o = this.commits.length), t.save(), t.translate(this.offsetX, 0), a = null, r = null, s = d = c; o >= c ? o > d : d > o; s = o >= c ? ++d : --d)
                e = this.commits[s], l = this.months[e.date.getMonth()], l !== a && (t.font = "bold 12px 'Helvetica Neue', Arial, sans-serif", t.fillStyle = "#555", u = this.ctx.measureText(l).width, t.fillText(l, s * this.nameLineHeight - u / 2, this.headerHeight / 2 + 4), a = l), i = e.date.getDate(), i !== r && (t.font = "12px 'Helvetica Neue', Arial, sans-serif", t.fillStyle = "#555", n = this.ctx.measureText(i).width, t.fillText(i, s * this.nameLineHeight - n / 2, this.headerHeight + this.dateRowHeight / 2 + 3), r = i, t.fillStyle = "#ddd", t.fillRect(s * this.nameLineHeight, this.headerHeight, 1, 6));
            return t.restore()
        }, t.prototype.drawUsers = function(t) {
            var e, n, i, s, r, a, o;
            for (t.fillStyle = "#fff", t.fillRect(0, 0, this.namesWidth, this.height), t.save(), t.translate(0, this.headerHeight + this.dateRowHeight + this.offsetY), o = this.userBlocks, n = r = 0, a = o.length; a > r; n = ++r)
                e = o[n], t.fillStyle = this.userBgColors[n % 2], t.fillRect(0, e.start * this.nameLineHeight, this.namesWidth, e.count * this.nameLineHeight), this.activeUser && this.activeUser.name === e.name && (t.fillStyle = "rgba(0, 0, 0, 0.05)", t.fillRect(0, e.start * this.nameLineHeight, this.namesWidth, e.count * this.nameLineHeight)), i = (e.start + e.count / 2) * this.nameLineHeight + 3, t.fillStyle = "rgba(0, 0, 0, 0.1)", t.fillRect(0, e.start * this.nameLineHeight + e.count * this.nameLineHeight - 1, this.namesWidth, 1), t.fillStyle = "#333", t.font = "13px 'Helvetica Neue', Arial, sans-serif", t.textAlign = "center", t.fillText(e.name, this.namesWidth / 2, i, 96);
            return t.restore(), t.fillStyle = this.headerColor, t.fillRect(0, 0, this.namesWidth, this.headerHeight), t.fillStyle = "#777", t.font = "12px 'Helvetica Neue', Arial, sans-serif", t.fillText("Owners", 40, this.headerHeight / 2 + 3), s = 10, t.fillStyle = this.dividerColor, t.fillRect(this.namesWidth - 1, s, 1, this.headerHeight - 2 * s), t.fillStyle = this.dividerColor, t.fillRect(0, this.headerHeight - 1, this.namesWidth, 1), t.fillStyle = this.dividerColor, t.fillRect(this.namesWidth - 1, this.headerHeight, 1, this.height - this.headerHeight)
        }, t
    }(), r = function() {
        function t(t, e, n, i, s, r, a, o, c, l) {
            var u, d, h, f, m, p, g, v, $, b, j, y, w, x, k;
            for (this.network = t, this.ctx = e, this.width = n, this.height = i, this.focus = s, this.commits = r, this.users = a, this.spaceMap = o, this.userBlocks = c, this.nethash = l, this.namesWidth = 120, this.headerHeight = 40, this.dateRowHeight = 30, this.graphTopOffset = 10 + this.headerHeight + this.dateRowHeight, this.bgColors = ["#fff", "#f9f9f9"], this.nameLineHeight = 24, this.spaceColors = ["#c0392b", "#3498db", "#2ecc71", "#8e44ad", "#f1c40f", "#e67e22", "#34495e", "#e74c3c", "#2980b9", "#1abc9c", "#9b59b6", "#f39c12", "#7f8c8d", "#2c3e50", "#d35400", "#e74c3c", "#95a5a6", "#bdc3c7", "#16a085", "#27ae60"], this.offsetX = this.namesWidth + (n - this.namesWidth) / 2 - s * this.nameLineHeight, this.offsetY = 0, this.bgCycle = 0, this.marginMap = {}, this.gravatars = {}, this.activeCommit = null, this.contentHeight = this.calcContentHeight(), this.graphMidpoint = this.namesWidth + (n - this.namesWidth) / 2, this.showRefs = !0, this.lastHotLoadCenterIndex = null, this.connectionMap = {}, this.spaceUserMap = {}, p = 0, b = c.length; b > p; p++)
                for (u = c[p], f = g = w = u.start, x = u.start + u.count; x >= w ? x > g : g > x; f = x >= w ? ++g : --g)
                    this.spaceUserMap[f] = a[u.name];
            for (this.headsMap = {}, v = 0, j = c.length; j > v; v++)
                for (u = c[v], m = a[u.name], k = m.heads, $ = 0, y = k.length; y > $; $++)
                    d = k[$], this.headsMap[d.id] || (this.headsMap[d.id] = []), h = {name: m.name,head: d}, this.headsMap[d.id].push(h)
        }
        return t.prototype.moveX = function(t) {
            return this.offsetX += t, this.offsetX > this.graphMidpoint ? this.offsetX = this.graphMidpoint : this.offsetX < this.graphMidpoint - this.commits.length * this.nameLineHeight && (this.offsetX = this.graphMidpoint - this.commits.length * this.nameLineHeight), this.hotLoadCommits()
        }, t.prototype.moveY = function(t) {
            return this.offsetY += t, this.offsetY > 0 || this.contentHeight < this.height - 40 ? this.offsetY = 0 : this.offsetY < -this.contentHeight + this.height / 2 ? this.offsetY = -this.contentHeight + this.height / 2 : void 0
        }, t.prototype.toggleRefs = function() {
            return this.showRefs = !this.showRefs
        }, t.prototype.calcContentHeight = function() {
            var t, e, n, i, s;
            for (e = 0, s = this.userBlocks, n = 0, i = s.length; i > n; n++)
                t = s[n], e += t.count;
            return e * this.nameLineHeight
        }, t.prototype.hover = function(t, e) {
            var n, i, s, r, a, o, c, l;
            for (a = this.timeWindow(), i = o = c = a.min, l = a.max; l >= c ? l >= o : o >= l; i = l >= c ? ++o : --o)
                if (n = this.commits[i], s = this.offsetX + n.time * this.nameLineHeight, r = this.offsetY + this.graphTopOffset + n.space * this.nameLineHeight, t > s - 5 && s + 5 > t && e > r - 5 && r + 5 > e)
                    return n;
            return null
        }, t.prototype.hotLoadCommits = function() {
            var t, e, n, i, s, r;
            return s = 200, e = parseInt((-this.offsetX + this.graphMidpoint) / this.nameLineHeight), 0 > e && (e = 0), e > this.commits.length - 1 && (e = this.commits.length - 1), this.lastHotLoadCenterIndex && Math.abs(this.lastHotLoadCenterIndex - e) < 10 ? void 0 : (this.lastHotLoadCenterIndex = e, t = this.backSpan(e, s), i = this.frontSpan(e, s), t || i ? (r = t ? t[0] : i[0], n = i ? i[1] : t[1], this.requestChunk(r, n)) : void 0)
        }, t.prototype.backSpan = function(t, e) {
            var n, i, s, r, a, o;
            for (i = null, n = a = t; (0 >= t ? 0 >= a : a >= 0) && n > t - e; n = 0 >= t ? ++a : --a)
                if (!this.commits[n].requested) {
                    i = n;
                    break
                }
            if (null !== i) {
                for (s = null, r = null, n = o = i; (0 >= i ? 0 >= o : o >= 0) && n > i - e; n = 0 >= i ? ++o : --o)
                    if (this.commits[n].requested) {
                        s = n;
                        break
                    }
                return s ? r = s + 1 : (r = i - e, 0 > r && (r = 0)), [r, i]
            }
            return null
        }, t.prototype.frontSpan = function(t, e) {
            var n, i, s, r, a, o, c, l;
            for (i = null, n = a = t, c = this.commits.length; (c >= t ? c > a : a > c) && t + e > n; n = c >= t ? ++a : --a)
                if (!this.commits[n].requested) {
                    i = n;
                    break
                }
            if (null !== i) {
                for (s = null, r = null, n = o = i, l = this.commits.length; (l >= i ? l > o : o > l) && i + e > n; n = l >= i ? ++o : --o)
                    if (this.commits[n].requested) {
                        s = n;
                        break
                    }
                return r = s ? s - 1 : i + e >= this.commits.length ? this.commits.length - 1 : i + e, [i, r]
            }
            return null
        }, t.prototype.chunkUrl = function() {
            return document.querySelector(".js-network-graph-container").getAttribute("data-network-graph-chunk-url")
        }, t.prototype.requestInitialChunk = function() {
            var t;
            return t = this.chunkUrl() + "?" + $.param({nethash: this.nethash}), $.fetchJSON(t).then(function(t) {
                return function(e) {
                    return t.importChunk(e), t.draw(), t.network.chrome.draw()
                }
            }(this))
        }, t.prototype.requestChunk = function(t, e) {
            var n, i, s;
            for (n = s = t; e >= t ? e >= s : s >= e; n = e >= t ? ++s : --s)
                this.commits[n].requested = new Date;
            return i = this.chunkUrl() + "?" + $.param({nethash: this.nethash,start: t,end: e}), $.fetchJSON(i).then(function(t) {
                return function(e) {
                    return t.importChunk(e), t.draw(), t.network.chrome.draw(), t.lastHotLoadCenterIndex = t.focus
                }
            }(this))
        }, t.prototype.importChunk = function(t) {
            var e, n, i, s, r, a, o, c, l;
            if (t.commits) {
                for (c = t.commits, l = [], a = 0, o = c.length; o > a; a++)
                    e = c[a], r = this.spaceUserMap[e.space], n = this.commits[e.time], n.populate(e, r, this.commits), l.push(function() {
                        var t, e, r, a;
                        for (r = n.parents, a = [], t = 0, e = r.length; e > t; t++)
                            s = r[t], a.push(function() {
                                var t, e, r, a;
                                for (a = [], i = t = e = s.time + 1, r = n.time; r >= e ? r > t : t > r; i = r >= e ? ++t : --t)
                                    this.connectionMap[i] = this.connectionMap[i] || [], a.push(this.connectionMap[i].push(n));
                                return a
                            }.call(this));
                        return a
                    }.call(this));
                return l
            }
        }, t.prototype.timeWindow = function() {
            var t, e;
            return e = parseInt((this.namesWidth - this.offsetX + this.nameLineHeight) / this.nameLineHeight), 0 > e && (e = 0), t = e + parseInt((this.width - this.namesWidth) / this.nameLineHeight), t > this.commits.length - 1 && (t = this.commits.length - 1), {min: e,max: t}
        }, t.prototype.draw = function() {
            var t, e, n, i, s, r, a, o, c, l, u, d, h, f, m, p, g, v, $, b, j, y, w, x, k, C, S, T;
            for (this.drawBackground(), h = this.timeWindow(), c = h.min, o = h.max, this.ctx.save(), this.ctx.translate(this.offsetX, this.offsetY + this.graphTopOffset), n = {}, S = this.spaceMap, r = m = 0, $ = S.length; $ > m; r = ++m)
                for (f = S[r], d = this.spaceMap.length - r - 1, a = p = c; o >= c ? o >= p : p >= o; a = o >= c ? ++p : --p)
                    t = this.commits[a], t.populated && t.space === d && (this.drawConnection(t), n[t.id] = !0);
            for (r = g = c; o >= c ? o >= g : g >= o; r = o >= c ? ++g : --g)
                if (e = this.connectionMap[r])
                    for (v = 0, b = e.length; b > v; v++)
                        t = e[v], n[t.id] || (this.drawConnection(t), n[t.id] = !0);
            for (T = this.spaceMap, r = w = 0, j = T.length; j > w; r = ++w)
                for (f = T[r], d = this.spaceMap.length - r - 1, a = x = c; o >= c ? o >= x : x >= o; a = o >= c ? ++x : --x)
                    t = this.commits[a], t.populated && t.space === d && (t === this.activeCommit ? this.drawActiveCommit(t) : this.drawCommit(t));
            if (this.showRefs)
                for (a = k = c; o >= c ? o >= k : k >= o; a = o >= c ? ++k : --k)
                    if (t = this.commits[a], t.populated && (s = this.headsMap[t.id]))
                        for (u = 0, C = 0, y = s.length; y > C; C++)
                            i = s[C], this.spaceUserMap[t.space].name === i.name && (l = this.drawHead(t, i.head, u), u += l);
            return this.ctx.restore(), this.activeCommit ? this.drawCommitInfo(this.activeCommit) : void 0
        }, t.prototype.drawBackground = function() {
            var t, e, n, i, s;
            for (this.ctx.clearRect(0, 0, this.width, this.height), this.ctx.save(), this.ctx.translate(0, this.offsetY + this.graphTopOffset), this.ctx.clearRect(0, -10, this.width, this.height), s = this.userBlocks, e = n = 0, i = s.length; i > n; e = ++n)
                t = s[e], this.ctx.fillStyle = this.bgColors[e % 2], this.ctx.fillRect(0, t.start * this.nameLineHeight - 10, this.width, t.count * this.nameLineHeight), this.ctx.fillStyle = "#DDDDDD", this.ctx.fillRect(0, (t.start + t.count) * this.nameLineHeight - 11, this.width, 1);
            return this.ctx.restore()
        }, t.prototype.drawCommit = function(t) {
            var e, n;
            return e = t.time * this.nameLineHeight, n = t.space * this.nameLineHeight, this.ctx.beginPath(), this.ctx.arc(e, n, 3, 0, 2 * Math.PI, !1), this.ctx.fillStyle = this.spaceColor(t.space), this.ctx.fill()
        }, t.prototype.drawActiveCommit = function(t) {
            var e, n;
            return e = t.time * this.nameLineHeight, n = t.space * this.nameLineHeight, this.ctx.beginPath(), this.ctx.arc(e, n, 6, 0, 2 * Math.PI, !1), this.ctx.fillStyle = this.spaceColor(t.space), this.ctx.fill()
        }, t.prototype.drawCommitInfo = function(t) {
            var e, n, i, s, r, a, o, c, l, u;
            return e = 3, n = 340, u = 56, l = t.message ? this.splitLines(t.message, 48) : [], a = Math.max(u, 38 + 16 * l.length), i = this.offsetX + t.time * this.nameLineHeight, s = this.graphTopOffset + this.offsetY + t.space * this.nameLineHeight, o = 0, c = 0, o = i < this.graphMidpoint ? i + 10 : i - (n + 10), c = s < 40 + (this.height - 40) / 2 ? s + 10 : s - a - 10, this.ctx.save(), this.ctx.translate(o, c), this.ctx.fillStyle = "#fff", this.ctx.strokeStyle = "rgba(0, 0, 0, 0.2)", this.ctx.lineWidth = 1, this.roundRect(0, 0, n, a, e), r = this.gravatars[t.gravatar], r ? this.drawGravatar(r, 10, 10) : (r = new Image, r.src = t.gravatar, r.onload = function(e) {
                return function() {
                    return e.activeCommit === t ? (e.drawGravatar(r, o + 10, c + 10), e.gravatars[t.gravatar] = r) : void 0
                }
            }(this)), this.ctx.fillStyle = "#000", this.ctx.font = "bold 12px 'Helvetica Neue', Arial, sans-serif", this.ctx.fillText(t.author, 55, 24), this.ctx.fillStyle = "#bbb", this.ctx.font = "11px Consolas, Menlo, Courier, monospace", this.ctx.fillText(t.id.slice(0, 7), 280, 24), this.drawMessage(l, 55, 41), this.ctx.restore()
        }, t.prototype.drawGravatar = function(t, e, n) {
            var i;
            return i = 32, this.ctx.save(), this.ctx.fillStyle = "#fff", this.ctx.strokeStyle = "rgba(0, 0, 0, 0.0)", this.ctx.lineWidth = .1, this.roundRect(e + 2, n + 2, i, i, 4), this.ctx.clip(), this.ctx.drawImage(t, e + 2, n + 2, i, i), this.ctx.restore()
        }, t.prototype.roundRect = function(t, e, n, i, s) {
            return this.ctx.beginPath(), this.ctx.moveTo(t, e + s), this.ctx.lineTo(t, e + i - s), this.ctx.quadraticCurveTo(t, e + i, t + s, e + i), this.ctx.lineTo(t + n - s, e + i), this.ctx.quadraticCurveTo(t + n, e + i, t + n, e + i - s), this.ctx.lineTo(t + n, e + s), this.ctx.quadraticCurveTo(t + n, e, t + n - s, e), this.ctx.lineTo(t + s, e), this.ctx.quadraticCurveTo(t, e, t, e + s), this.ctx.fill(), this.ctx.stroke()
        }, t.prototype.drawMessage = function(t, e, n) {
            var i, s, r, a, o;
            for (this.ctx.font = "12px 'Helvetica Neue', Arial, sans-serif", this.ctx.fillStyle = "#000000", o = [], i = r = 0, a = t.length; a > r; i = ++r)
                s = t[i], o.push(this.ctx.fillText(s, e, n + 16 * i));
            return o
        }, t.prototype.splitLines = function(t, e) {
            var n, i, s, r, a, o;
            for (r = t.split(" "), i = [], n = "", a = 0, o = r.length; o > a; a++)
                s = r[a], n.length + 1 + s.length < e ? n = "" === n ? s : n + " " + s : (i.push(n), n = s);
            return i.push(n), i
        }, t.prototype.drawHead = function(t, e, n) {
            var i, s, r, a;
            return this.ctx.font = "11px 'Helvetica Neue', Arial, sans-serif", this.ctx.save(), i = this.ctx.measureText(e.name).width, this.ctx.restore(), r = t.time * this.nameLineHeight, a = t.space * this.nameLineHeight + 5 + n, s = 2.5, this.ctx.save(), this.ctx.translate(r, a - s), this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)", this.ctx.beginPath(), this.ctx.moveTo(0, s), this.ctx.lineTo(-4, 10), this.ctx.quadraticCurveTo(-9, 10, -9, 15), this.ctx.lineTo(-9, 15 + i), this.ctx.quadraticCurveTo(-9, 15 + i + 5, -4, 15 + i + 5), this.ctx.lineTo(4, 15 + i + 5), this.ctx.quadraticCurveTo(9, 15 + i + 5, 9, 15 + i), this.ctx.lineTo(9, 15), this.ctx.quadraticCurveTo(9, 10, 4, 10), this.ctx.lineTo(0, s), this.ctx.fill(), this.ctx.fillStyle = "#fff", this.ctx.font = "12px 'Helvetica Neue', Arial, sans-serif", this.ctx.textBaseline = "middle", this.ctx.scale(.85, .85), this.ctx.rotate(Math.PI / 2), this.ctx.fillText(e.name, 19, -.5), this.ctx.restore(), i + this.nameLineHeight
        }, t.prototype.drawConnection = function(t) {
            var e, n, i, s, r, a;
            for (r = t.parents, a = [], e = i = 0, s = r.length; s > i; e = ++i)
                n = r[e], a.push(0 === e ? n.space === t.space ? this.drawBasicConnection(n, t) : this.drawBranchConnection(n, t) : this.drawMergeConnection(n, t));
            return a
        }, t.prototype.drawBasicConnection = function(t, e) {
            var n;
            return n = this.spaceColor(e.space), this.ctx.strokeStyle = n, this.ctx.lineWidth = 2, this.ctx.beginPath(), this.ctx.moveTo(t.time * this.nameLineHeight, e.space * this.nameLineHeight), this.ctx.lineTo(e.time * this.nameLineHeight, e.space * this.nameLineHeight), this.ctx.stroke()
        }, t.prototype.drawBranchConnection = function(t, e) {
            var n;
            return n = this.spaceColor(e.space), this.ctx.strokeStyle = n, this.ctx.lineWidth = 2, this.ctx.beginPath(), this.ctx.moveTo(t.time * this.nameLineHeight, t.space * this.nameLineHeight), this.ctx.lineTo(t.time * this.nameLineHeight, e.space * this.nameLineHeight), this.ctx.lineTo(e.time * this.nameLineHeight - 10, e.space * this.nameLineHeight), this.ctx.stroke(), this.threeClockArrow(n, e.time * this.nameLineHeight, e.space * this.nameLineHeight)
        }, t.prototype.drawMergeConnection = function(t, e) {
            var n, i, s;
            return n = this.spaceColor(t.space), this.ctx.strokeStyle = n, this.ctx.lineWidth = 2, this.ctx.beginPath(), t.space > e.space ? (this.ctx.moveTo(t.time * this.nameLineHeight, t.space * this.nameLineHeight), s = this.safePath(t.time, e.time, t.space), s ? (this.ctx.lineTo(e.time * this.nameLineHeight - 10, t.space * this.nameLineHeight), this.ctx.lineTo(e.time * this.nameLineHeight - 10, e.space * this.nameLineHeight + 15), this.ctx.lineTo(e.time * this.nameLineHeight - 5.7, e.space * this.nameLineHeight + 7.5), this.ctx.stroke(), this.oneClockArrow(n, e.time * this.nameLineHeight, e.space * this.nameLineHeight)) : (i = this.closestMargin(t.time, e.time, t.space, -1), t.space === e.space + 1 && t.space === i + 1 ? (this.ctx.lineTo(t.time * this.nameLineHeight, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 15, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 9.5, i * this.nameLineHeight + 7.7), this.ctx.stroke(), this.twoClockArrow(n, e.time * this.nameLineHeight, i * this.nameLineHeight), this.addMargin(t.time, e.time, i)) : t.time + 1 === e.time ? (i = this.closestMargin(t.time, e.time, e.space, 0), this.ctx.lineTo(t.time * this.nameLineHeight, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 15, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 15, e.space * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 9.5, e.space * this.nameLineHeight + 7.7), this.ctx.stroke(), this.twoClockArrow(n, e.time * this.nameLineHeight, e.space * this.nameLineHeight), this.addMargin(t.time, e.time, i)) : (this.ctx.lineTo(t.time * this.nameLineHeight + 10, t.space * this.nameLineHeight - 10), this.ctx.lineTo(t.time * this.nameLineHeight + 10, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 10, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 10, e.space * this.nameLineHeight + 15), this.ctx.lineTo(e.time * this.nameLineHeight - 5.7, e.space * this.nameLineHeight + 7.5), this.ctx.stroke(), this.oneClockArrow(n, e.time * this.nameLineHeight, e.space * this.nameLineHeight), this.addMargin(t.time, e.time, i)))) : (i = this.closestMargin(t.time, e.time, e.space, -1), i < e.space ? (this.ctx.moveTo(t.time * this.nameLineHeight, t.space * this.nameLineHeight), this.ctx.lineTo(t.time * this.nameLineHeight, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 12.7, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 12.7, e.space * this.nameLineHeight - 10), this.ctx.lineTo(e.time * this.nameLineHeight - 9.4, e.space * this.nameLineHeight - 7.7), this.ctx.stroke(), this.fourClockArrow(n, e.time * this.nameLineHeight, e.space * this.nameLineHeight), this.addMargin(t.time, e.time, i)) : (this.ctx.moveTo(t.time * this.nameLineHeight, t.space * this.nameLineHeight), this.ctx.lineTo(t.time * this.nameLineHeight, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 12.7, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 12.7, e.space * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 9.4, e.space * this.nameLineHeight + 7.7), this.ctx.stroke(), this.twoClockArrow(n, e.time * this.nameLineHeight, e.space * this.nameLineHeight), this.addMargin(t.time, e.time, i)))
        }, t.prototype.addMargin = function(t, e, n) {
            return this.marginMap[n] || (this.marginMap[n] = []), this.marginMap[n].push([t, e])
        }, t.prototype.oneClockArrow = function(t, e, n) {
            return this.ctx.fillStyle = t, this.ctx.beginPath(), this.ctx.moveTo(e - 3, n + 10.5), this.ctx.lineTo(e - 9, n + 5.5), this.ctx.lineTo(e - 2.6, n + 3.5), this.ctx.fill()
        }, t.prototype.twoClockArrow = function(t, e, n) {
            return this.ctx.fillStyle = t, this.ctx.beginPath(), this.ctx.moveTo(e - 12.4, n + 6.6), this.ctx.lineTo(e - 9.3, n + 10.6), this.ctx.lineTo(e - 3.2, n + 2.4), this.ctx.fill()
        }, t.prototype.threeClockArrow = function(t, e, n) {
            return this.ctx.fillStyle = t, this.ctx.beginPath(), this.ctx.moveTo(e - 10, n - 3.5), this.ctx.lineTo(e - 10, n + 3.5), this.ctx.lineTo(e - 4, n), this.ctx.fill()
        }, t.prototype.fourClockArrow = function(t, e, n) {
            return this.ctx.fillStyle = t, this.ctx.beginPath(), this.ctx.moveTo(e - 12.4, n - 6.6), this.ctx.lineTo(e - 9.3, n - 10.6), this.ctx.lineTo(e - 3.2, n - 2.4), this.ctx.fill()
        }, t.prototype.safePath = function(t, e, n) {
            var i, s, r, a;
            for (a = this.spaceMap[n], s = 0, r = a.length; r > s; s++)
                if (i = a[s], this.timeInPath(t, i))
                    return i[1] === e;
            return !1
        }, t.prototype.closestMargin = function(t, e, n, i) {
            var s, r, a, o, c;
            for (o = this.spaceMap.length, a = i, r = !1, s = !1, c = !1; !s || !r; ) {
                if (n + a >= 0 && this.safeMargin(t, e, n + a))
                    return n + a;
                0 > n + a && (r = !0), n + a > o && (s = !0), c === !1 && 0 === a ? (a = -1, c = !0) : a = 0 > a ? -a - 1 : -a - 2
            }
            return n > 0 ? n - 1 : 0
        }, t.prototype.safeMargin = function(t, e, n) {
            var i, s, r, a;
            if (!this.marginMap[n])
                return !0;
            for (a = this.marginMap[n], s = 0, r = a.length; r > s; s++)
                if (i = a[s], this.pathsCollide([t, e], i))
                    return !1;
            return !0
        }, t.prototype.pathsCollide = function(t, e) {
            return this.timeWithinPath(t[0], e) || this.timeWithinPath(t[1], e) || this.timeWithinPath(e[0], t) || this.timeWithinPath(e[1], t)
        }, t.prototype.timeInPath = function(t, e) {
            return t >= e[0] && t <= e[1]
        }, t.prototype.timeWithinPath = function(t, e) {
            return t > e[0] && t < e[1]
        }, t.prototype.spaceColor = function(t) {
            return 0 === t ? "#000000" : this.spaceColors[t % this.spaceColors.length]
        }, t
    }(), n = function() {
        function t(t, e, n) {
            this.chrome = e, this.graph = n, this.out = a(this.out, this), this.move = a(this.move, this), this.docmove = a(this.docmove, this), this.down = a(this.down, this), this.up = a(this.up, this), this.dragging = !1, this.lastPoint = {x: 0,y: 0}, this.lastHoverCommit = null, this.lastHoverUser = null, this.pressedCommit = null, this.pressedUser = null, this.canvas = t.getElementsByTagName("canvas")[0], this.canvasOffset = $(this.canvas).offset(), this.canvas.style.cursor = "move", document.body.addEventListener("mouseup", this.up), document.body.addEventListener("mousemove", this.docmove), this.canvas.addEventListener("mousedown", this.down), this.canvas.addEventListener("mousemove", this.move), this.canvas.addEventListener("mouseout", this.out)
        }
        return t.prototype.up = function() {
            return this.dragging = !1, this.pressedCommit && this.graph.activeCommit === this.pressedCommit ? window.open("/" + this.graph.activeCommit.user.name + "/" + this.graph.activeCommit.user.repo + "/commit/" + this.graph.activeCommit.id) : this.pressedUser && this.chrome.activeUser === this.pressedUser && (window.location = "/" + this.chrome.activeUser.name + "/" + this.chrome.activeUser.repo + "/network"), this.pressedCommit = null, this.pressedUser = null
        }, t.prototype.down = function() {
            return this.graph.activeCommit ? this.pressedCommit = this.graph.activeCommit : this.chrome.activeUser ? this.pressedUser = this.chrome.activeUser : this.dragging = !0
        }, t.prototype.docmove = function(t) {
            var e, n;
            return e = t.pageX, n = t.pageY, this.dragging && (this.graph.moveX(e - this.lastPoint.x), this.graph.moveY(n - this.lastPoint.y), this.graph.draw(), this.chrome.moveX(e - this.lastPoint.x), this.chrome.moveY(n - this.lastPoint.y), this.chrome.draw()), this.lastPoint.x = e, this.lastPoint.y = n
        }, t.prototype.move = function(t) {
            var e, n, i, s;
            return i = t.pageX, s = t.pageY, this.dragging ? (this.graph.moveX(i - this.lastPoint.x), this.graph.moveY(s - this.lastPoint.y), this.graph.draw(), this.chrome.moveX(i - this.lastPoint.x), this.chrome.moveY(s - this.lastPoint.y), this.chrome.draw()) : (n = this.chrome.hover(i - this.canvasOffset.left, s - this.canvasOffset.top), n !== this.lastHoverUser ? (this.canvas.style.cursor = n ? "pointer" : "move", this.chrome.activeUser = n, this.chrome.draw(), this.lastHoverUser = n) : (e = this.graph.hover(i - this.canvasOffset.left, s - this.canvasOffset.top), e !== this.lastHoverCommit && (this.canvas.style.cursor = e ? "pointer" : "move", this.graph.activeCommit = e, this.graph.draw(), this.chrome.draw(), this.lastHoverCommit = e))), this.lastPoint.x = i, this.lastPoint.y = s
        }, t.prototype.out = function() {
            return this.graph.activeCommit = null, this.chrome.activeUser = null, this.graph.draw(), this.chrome.draw(), this.lastHoverCommit = null, this.lastHoverUser = null
        }, t
    }(), e = function() {
        function t(t, e) {
            this.chrome = t, this.graph = e, this.down = a(this.down, this), this.dirty = !1, document.addEventListener("keydown", this.down)
        }
        return t.prototype.moveBothX = function(t) {
            return this.graph.moveX(t), this.chrome.moveX(t), this.graph.activeCommit = null, this.dirty = !0
        }, t.prototype.moveBothY = function(t) {
            return this.graph.moveY(t), this.chrome.moveY(t), this.graph.activeCommit = null, this.dirty = !0
        }, t.prototype.toggleRefs = function() {
            return this.graph.toggleRefs(), this.dirty = !0
        }, t.prototype.redraw = function() {
            return this.dirty && (this.graph.draw(), this.chrome.draw()), this.dirty = !1
        }, t.prototype.down = function(t) {
            if ($(t.target).is("input"))
                return !0;
            if (t.shiftKey)
                switch (t.which) {
                    case 37:
                    case 72:
                        return this.moveBothX(999999), this.redraw();
                    case 38:
                    case 75:
                        return this.moveBothY(999999), this.redraw();
                    case 39:
                    case 76:
                        return this.moveBothX(-999999), this.redraw();
                    case 40:
                    case 74:
                        return this.moveBothY(-999999), this.redraw()
                }
            else
                switch (t.which) {
                    case 37:
                    case 72:
                        return this.moveBothX(100), this.redraw();
                    case 38:
                    case 75:
                        return this.moveBothY(30), this.redraw();
                    case 39:
                    case 76:
                        return this.moveBothX(-100), this.redraw();
                    case 40:
                    case 74:
                        return this.moveBothY(-30), this.redraw();
                    case 84:
                        return this.toggleRefs(), this.redraw()
                }
        }, t
    }(), 
    
    new i(document.querySelector(".network-graph-container"), 920, 600)
}.call(this);