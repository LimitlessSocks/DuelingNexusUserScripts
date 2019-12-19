var aa = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
        a != Array.prototype && a != Object.prototype && (a[b] = c.value)
    },
    ba = "undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global : this;

function ca(a) {
    if (a) {
        for (var b = ba, c = ["Array", "prototype", "find"], d = 0; d < c.length - 1; d++) {
            var e = c[d];
            e in b || (b[e] = {});
            b = b[e]
        }
        c = c[c.length - 1];
        d = b[c];
        a = a(d);
        a != d && null != a && aa(b, c, {
            configurable: !0,
            writable: !0,
            value: a
        })
    }
}
ca(function(a) {
    return a ? a : function(a, c) {
        a: {
            var b = this;b instanceof String && (b = String(b));
            for (var e = b.length, g = 0; g < e; g++) {
                var k = b[g];
                if (a.call(c, k, g, b)) {
                    a = k;
                    break a
                }
            }
            a = void 0
        }
        return a
    }
});
var da = !1,
    ea, f, fa, ha;

function ia(a) {
    ea = new ja;
    f = new ka;
    fa = new la;
    ma();
    ha = new na;
    ha.load(function() {
        oa(function() {
            pa(a)
        })
    })
}

function h(a) {
    return "assets/" + a
}

function qa(a) {
    return a.toUpperCase().replace(/[\n\- :\.]/g, "")
}

function pa(a) {
    function b() {
        c || (c = !0, a())
    }
    var c = !1,
        d = new Image;
    d.onload = b;
    d.onerror = function() {
        c || (da = c = !0, a())
    };
    d.src = ra(89631139);
    d.complete && b()
}

function l(a, b) {
    a.off("error");
    a.attr("src", ra(b));
    if (0 < b) a.one("error", function() {
        $(this).attr("src", ra(-1))
    })
}

function sa(a, b) {
    a.off("error");
    a.one("error", function() {
        $(this).attr("src", ra(0))
    });
    a.attr("src", b)
}

function ra(a) {
    return 0 == a ? h("images/cover.png") : -1 == a ? h("images/unknown.png") : da ? "https://raw.githubusercontent.com/DuelingNexus/images/ae49b8b/" + a + ".jpg" : "https://cdn.jsdelivr.net/gh/DuelingNexus/images@ae49b8b/" + a + ".jpg"
}

function ta(a, b) {
    return 1 === b ? a : a + "s"
};
var m = [],
    n = null,
    p = -1,
    ua = null,
    va = null,
    wa = null,
    xa = null,
    ya = null,
    q = [0, 0],
    r = [0, 0],
    za = -1,
    Aa = -1,
    Ba = !1,
    t = !1,
    Ca = !1,
    Da = !1,
    Ea = !1,
    Fa = !1,
    Ga = !1,
    Ha = {},
    Ia = {},
    Ja = !1,
    Ka = !1,
    La = !1,
    Ma = !1,
    Na = !1,
    Oa = !1,
    Pa = !1,
    Qa = null,
    Ra = -1,
    Sa = -1,
    Ta = !1,
    Ua = !1,
    Va = [],
    u = [],
    Wa = [],
    Xa = [],
    Ya = [],
    v = [],
    Za = [],
    $a = [],
    x = [],
    ab = [],
    y = [],
    bb = [],
    cb = -1,
    db = -1,
    eb = -1,
    gb = !1,
    hb = -1,
    ib = -1,
    jb = [],
    kb = 0,
    lb = [],
    mb = 0,
    nb = !1,
    z = !1,
    A = 0,
    B = [],
    ob = -1,
    pb = null,
    qb = null,
    rb = [],
    sb = !1,
    C = 1,
    tb = [],
    ub, D, vb, wb, xb, yb, zb, Ab, Bb, Cb, Db, E, Eb, G, Fb, Gb, Hb, Ib, Jb, H, Kb, I, Lb, J, Mb, Nb, Ob, Pb, Qb, Rb;

function Sb() {
    ub ? Tb() : (ub = !0, Ub(), m.push(new Vb("player")), m.push(new Vb("opponent")), $(window).resize(Wb), Wb(), $("#game-navbar").remove(), $(window.document).contextmenu(function() {
            Xb();
            return !1
        }), $("#game-cancel-button").click(function() {
            Xb()
        }), $(".game-field-zone").mouseenter(function() {
            var a = $(this).data("player"),
                b = $(this).data("location"),
                c = $(this).data("index");
            Yb(a, b, c)
        }).mouseleave(function() {
            var a = $(this).data("player"),
                b = $(this).data("location"),
                c = $(this).data("index");
            Zb(a, b, c)
        }).click(function() {
            var a =
                $(this).data("player"),
                b = $(this).data("location"),
                c = $(this).data("index");
            $b(a, b, c)
        }), $("#game-surrender-button").click(function() {
            ac();
            Nb || (Nb = !0, K({
                type: "Surrender"
            }))
        }), n = {}, n[L.ia] = $("#game-dp-button"), n[L.ka] = $("#game-sp-button"), n[L.ja] = $("#game-mp1-button"), n[L.J] = $("#game-bp-button"), n[L.X] = $("#game-mp2-button"), n[L.R] = $("#game-ep-button"), n[L.J].click(function() {
            t && (M(bc), N())
        }), n[L.X].click(function() {
            t && (M(cc), N())
        }), n[L.R].click(function() {
            t && (p == L.J ? M(dc) : M(ec), N())
        }), va = $("#game-option-button-template").remove().removeAttr("id"),
        wa = $("#game-selection-card-template").remove().removeAttr("id"), xa = $("#game-announce-template").remove().removeAttr("id"), ya = $("#game-announce-card-template").remove().removeAttr("id"), $("#game-action-menu").mouseleave(function() {
            ac()
        }), $("#game-action-view").click(function() {
            ac();
            fc(m[D.controller].c[D.location], !0);
            vb = !0
        }), $("#game-action-view-materials").click(function() {
            ac();
            fc(D.l, !0);
            vb = !0
        }), $("#game-action-summon").click(function() {
            M(gc, Va.indexOf(D));
            N()
        }), $("#game-action-sp-summon").click(function() {
            if (D.location ===
                O.f || D.location === O.h || D.location === O.v || D.location === O.u) {
                Ka = !0;
                for (var a = [], b = 0; b < u.length; ++b) u[b].location === D.location && a.push(u[b]);
                ac();
                fc(a, !0)
            } else M(hc, u.indexOf(D)), N()
        }), $("#game-action-repos").click(function() {
            M(ic, Wa.indexOf(D));
            N()
        }), $("#game-action-set-monster").click(function() {
            M(jc, Xa.indexOf(D));
            N()
        }), $("#game-action-set-spell").click(function() {
            M(kc, Ya.indexOf(D));
            N()
        }), $("#game-action-activate").click(function() {
            if (D.location === O.f || D.location === O.h || D.location === O.v || D.location ===
                O.u) {
                La = !0;
                for (var a = [], b = 0; b < v.length; ++b) v[b].location === D.location && a.push(v[b]);
                ac();
                fc(a, !0)
            } else ac(), lc(D)
        }), $("#game-action-attack").click(function() {
            M(mc, $a.indexOf(D));
            N()
        }), $("#game-position-atk-up").click(function() {
            P(nc);
            N()
        }), $("#game-position-atk-down").click(function() {
            P(oc);
            N()
        }), $("#game-position-def-up").click(function() {
            P(pc);
            N()
        }), $("#game-position-def-down").click(function() {
            P(qc);
            N()
        }), $("#game-yesno-yes-button").click(function() {
            Ja ? (rc(), $("#game-yesno-window").hide()) : (P(1),
                N())
        }), $("#game-yesno-no-button").click(function() {
            P(Ja ? -1 : 0);
            N()
        }), $("#game-announce-card-text").on("input", sc), $("#game-timer-bar-player").hide(), $("#game-timer-player").hide(), $("#game-timer-bar-opponent").hide(), $("#game-timer-opponent").hide(), wb = new Audio(h("musics/14-seal-of-orichalcos.mp3")), wb.loop = !0, tc("music"), $("#game-field").on("dragstart", function() {
            return !1
        }), $("#game-force-chain-button").click(function() {
            mb = (mb + 1) % 3;
            0 === mb ? $("#game-force-chain-button").text("Chaining: Auto").removeClass("engine-button-success").removeClass("engine-button-danger").addClass("engine-button-default") :
                1 === mb ? $("#game-force-chain-button").text("Chaining: Manual").removeClass("engine-button-default").removeClass("engine-button-danger").addClass("engine-button-success") : 2 === mb && $("#game-force-chain-button").text("Chaining: Off").removeClass("engine-button-default").removeClass("engine-button-success").addClass("engine-button-danger")
        }), $(window).mousemove(function(a) {
            xb = a.pageX;
            yb = a.pageY;
            zb ? uc() : vc()
        }))
}

function Tb() {
    for (var a = 0; 2 > a; ++a) m[a].clear();
    wc(null)
}

function Q(a) {
    fa.play(a)
}

function xc(a, b) {
    if (0 >= a) b();
    else {
        var c = !1,
            d = function() {
                c || (c = !0, b())
            },
            e = new Image;
        e.onload = d;
        e.onerror = d;
        e.src = ra(a);
        e.complete && d()
    }
}

function yc(a, b) {
    function c(d) {
        d == a.length ? b() : xc(a[d], function() {
            c(d + 1)
        })
    }
    c(0)
}

function zc(a, b) {
    function c(d) {
        d == a.length ? b() : xc(a[d].code, function() {
            c(d + 1)
        })
    }
    c(0)
}

function vc() {
    null !== ua && $("#game-tooltip").css("left", xb + 10).css("top", yb + 10)
}

function Xb() {
    if (!R())
        if (Ka || La) Ka = La = Ma = !1, $("#game-selection-list").empty(), $("#game-selection-window").hide();
        else if (Na) Na = !1, $("#game-option-list").empty(), $("#game-option-window").hide();
    else if (Ea) {
        if (Ga || Fa) P(-1), N()
    } else if (t) {
        var a = !1;
        !Oa && Ac() ? a = !1 : Fa && (P(-1), a = !0);
        a && N()
    } else Oa && Fa && (P(-1), N())
}

function Bc(a, b, c) {
    Ma || Na || (D = a, null !== a ? (a.location == O.v || a.location == O.u || a.location == O.h ? $("#game-action-view").css("display", "block") : $("#game-action-view").hide(), 0 < a.l.length ? $("#game-action-view-materials").css("display", "block") : $("#game-action-view-materials").hide(), Ha[a.location] || Ia[a.location] ? ($("#game-action-sp-summon").css("display", Ha[a.location] ? "block" : "none"), $("#game-action-activate").css("display", Ia[a.location] ? "block" : "none"), $("#game-action-summon").hide(), $("#game-action-repos").hide(),
        $("#game-action-set-monster").hide(), $("#game-action-set-spell").hide(), $("#game-action-attack").hide(), $("#game-action-menu").css("left", xb - 10).css("top", yb - 10).show()) : (p !== L.J ? ($("#game-action-summon").css("display", -1 !== Va.indexOf(a) ? "block" : "none"), $("#game-action-sp-summon").css("display", -1 !== u.indexOf(a) ? "block" : "none"), $("#game-action-repos").css("display", -1 !== Wa.indexOf(a) ? "block" : "none"), $("#game-action-set-monster").css("display", -1 !== Xa.indexOf(a) ? "block" : "none"), $("#game-action-set-spell").css("display",
        -1 !== Ya.indexOf(a) ? "block" : "none"), $("#game-action-attack").hide()) : ($("#game-action-summon").hide(), $("#game-action-sp-summon").hide(), $("#game-action-repos").hide(), $("#game-action-set-monster").hide(), $("#game-action-set-spell").hide(), $("#game-action-attack").css("display", -1 !== $a.indexOf(a) ? "block" : "none")), $("#game-action-activate").css("display", -1 !== v.indexOf(a) ? "block" : "none"))) : ($("#game-action-view").hide(), $("#game-action-view-materials").hide(), $("#game-action-summon").hide(), $("#game-action-sp-summon").hide(),
        $("#game-action-repos").hide(), $("#game-action-set-monster").hide(), $("#game-action-set-spell").hide(), $("#game-action-attack").hide(), $("#game-action-activate").hide()), a = 0 === b && c === O.f && !z, $("#game-surrender-button").css("display", a ? "block" : "none"), $("#game-action-menu").css("left", xb - 10).css("top", yb - 10).show())
}

function ac() {
    $("#game-action-menu").hide()
}

function S(a, b, c, d, e) {
    m[b].O(a, c, void 0 === d ? -1 : d, e)
}

function T(a, b, c, d) {
    if (-1 === a) return a = T(0, b, c, d), null !== a ? a : T(1, b, 5 == c ? 6 : 5, d);
    a = m[a]; - 1 === c && (c = a.c[b].length - 1);
    b & O.B ? (b &= ~O.B, d = a.c[b][c].l[d]) : d = a.c[b][c];
    return d
}

function Yb(a, b, c) {
    var d = T(a, b, c);
    if (d && 0 !== d.code) {
        var e = $("#game-tooltip");
        null === ua && e.show();
        ua = d;
        Cc(d.code);
        Dc(e, d);
        vc();
        if (b & O.g && d.type & U.C) {
            e = a;
            a = [];
            var g = d.wa; - 1 !== e ? (g & Ec && 0 < c && a.push({
                o: e,
                location: b,
                index: c - 1
            }), g & Fc && 4 > c && a.push({
                o: e,
                location: b,
                index: c + 1
            }), 4 <= Ab && ((g & Gc && 2 === c || g & Hc && 1 === c || g & Ic && 0 === c) && a.push({
                o: e,
                location: b,
                index: 5
            }), (g & Gc && 4 === c || g & Hc && 3 === c || g & Ic && 2 === c) && a.push({
                o: e,
                location: b,
                index: 6
            }))) : (e = d.controller, c = 5 === c ? 0 : 2, 1 === e && (c = 2 - c), g & Jc && a.push({
                    o: e,
                    location: b,
                    index: c
                }),
                g & Kc && a.push({
                    o: e,
                    location: b,
                    index: 1 + c
                }), g & Lc && a.push({
                    o: e,
                    location: b,
                    index: 2 + c
                }), g & Gc && a.push({
                    o: 1 - e,
                    location: b,
                    index: 4 - c
                }), g & Hc && a.push({
                    o: 1 - e,
                    location: b,
                    index: 3 - c
                }), g & Ic && a.push({
                    o: 1 - e,
                    location: b,
                    index: 2 - c
                }));
            for (b = 0; b < a.length; ++b) $(Mc(a[b].o, a[b].location, a[b].index)).addClass("game-field-zone-linked")
        }
    }
}

function Zb(a, b, c) {
    (a = T(a, b, c)) && ua === a && (Nc(), $(".game-field-zone-linked").removeClass("game-field-zone-linked"))
}

function Nc() {
    ua = null;
    Dc(null, null);
    $("#game-tooltip").hide()
}

function Mc(a, b, c) {
    if (b === O.g && 5 <= c) {
        if (5 === c && 0 === a || 6 === c && 1 === a) return "#game-field-extra-monster1";
        if (6 === c && 0 === a || 5 === c && 1 === a) return "#game-field-extra-monster2"
    }
    return m[a].namespace + (b === O.g ? "monster" : "spell") + (c + 1)
}

function $b(a, b, c) {
    if (gb && (-1 === a && b === O.g && 5 <= c && (a = 0, Oc(a, O.g, c) || (a = 1, c = 5 === c ? 6 : 5)), b === O.g || b === O.m)) {
        var d = $(Mc(a, b, c));
        if (d.hasClass("game-field-zone-selectable")) d.removeClass("game-field-zone-selectable").addClass("game-field-zone-selected"), jb.push({
            player: a,
            location: b,
            sequence: c
        }), jb.length === hb && (K({
            type: "GameSendZones",
            zones: jb
        }), N());
        else if (d.hasClass("game-field-zone-selected"))
            for (d.removeClass("game-field-zone-selected").addClass("game-field-zone-selectable"), d = 0; d < jb.length; ++d) jb[d].o ===
                a && jb[d].location === b && jb[d].D === c && jb.splice(d, 1);
        return
    }
    c = T(a, b, c);
    t ? c && (-1 !== cb ? Pc(c) : Bc(c, a, b)) : Pa ? c && (a = x.indexOf(c), -1 < a && 0 < c.Da && (c.Da--, Sa--, Bb[a]++, 0 === Sa ? (K({
        type: "GameSendCounters",
        counters: Bb
    }), N()) : Qc())) : (d = 0 === a && b === O.f && !z, (c || d) && Bc(c, a, b))
}

function Pc(a) {
    if (-1 !== cb) {
        if (-1 !== x.indexOf(a)) {
            var b = y.indexOf(a); - 1 !== b ? (y.splice(b, 1), Ma ? a.Y.removeClass("game-selected-card") : (a.a.removeClass("game-selected-card"), a.a.addClass("game-selectable-card")), Ea || -1 === eb || Ac()) : (y.push(a), Ma ? a.Y.addClass("game-selected-card") : (a.a.addClass("game-selected-card"), a.a.removeClass("game-selectable-card")), Ea || Rc() !== db && -1 === eb || Ac());
            Ea && (b = [], a = x.indexOf(a), b.push(0 > a ? 0 : a), K({
                type: "GameSendSelection",
                indexes: b
            }), N())
        }
    } else if (Oa) Sc(a);
    else if (Ka || La) Ka ?
        (M(hc, u.indexOf(a)), N()) : lc(a)
}

function lc(a) {
    var b = [],
        c = -1;
    do c = v.indexOf(a, c + 1), -1 !== c && b.push({
        index: c,
        qa: Za[c]
    }); while (-1 !== c);
    1 == b.length ? (M(p === L.J ? Tc : Uc, v.indexOf(a)), N()) : 1 < b.length && (Na = !0, Vc(b, !0, !0))
}

function Ac() {
    if (t) {
        if (-1 !== eb) {
            if (Wc()) {
                Xc();
                var a = !0
            } else a = !1;
            return a
        }
        a = Rc();
        if (a >= cb && a <= db) return Ja ? Sc(y[0]) : (Xc(), N()), !0
    }
    return !1
}

function Rc() {
    if (Ca) {
        for (var a = 0, b = 0; b < y.length; ++b) a += y[b].I;
        return a
    }
    return y.length
}

function Sc(a) {
    if (Ja) {
        var b = [],
            c = -1;
        do c = ab.indexOf(a, c + 1), -1 !== c && b.push({
            index: c,
            qa: Za[c]
        }); while (-1 !== c);
        1 === b.length ? (P(x.indexOf(a)), N()) : 1 < b.length && (Na = !0, Vc(b, !0, !0))
    } else P(x.indexOf(a)), N()
}

function Xc() {
    var a = [];
    if (Da) {
        for (var b = 0; b < x.length; ++b) {
            var c = y.indexOf(x[b]);
            a.push(0 > c ? 0 : c)
        }
        K({
            type: "GameSendOrder",
            indexes: a
        })
    } else {
        for (b = 0; b < y.length; ++b) c = x.indexOf(y[b]), a.push(0 > c ? 0 : c);
        K({
            type: "GameSendSelection",
            indexes: a
        })
    }
    N()
}

function Wc() {
    var a = y.length,
        b = cb,
        c = db,
        d = bb.length,
        e = [];
    if (0 < db) {
        if (a < b + d || a > c + d) return !1;
        b = [];
        for (c = 0; c < d; ++c) b[c] = bb[c].I;
        for (c = d; c < a; ++c) {
            var g = x.indexOf(y[c]);
            if (0 > g || e[g]) return !1;
            e[g] = !0;
            b[c] = x[g].I
        }
        return Yc(b, a, 0, eb) ? !0 : !1
    }
    c = b = 0;
    g = 2147483647;
    for (var k = 0; k < d; ++k) {
        var w = bb[k].I,
            F = w & 65535;
        w >>= 16;
        var fb = 0 < w && w < F ? w : F;
        b += fb;
        c += w > F ? w : F;
        fb < g && (g = fb)
    }
    for (; d < a; ++d) {
        k = x.indexOf(y[d]);
        if (0 > k || e[k]) return !1;
        e[k] = !0;
        F = x[k].I;
        k = F & 65535;
        F >>= 16;
        w = 0 < F && F < k ? F : k;
        b += w;
        c += F > k ? F : k;
        w < g && (g = w)
    }
    return c < eb || b - g >= eb ?
        !1 : !0
}

function Yc(a, b, c, d) {
    if (0 == d || c == b) return !1;
    var e = a[c] & 65535,
        g = a[c] >> 16;
    return c == b - 1 ? d == e || d == g : d > e && Yc(a, b, c + 1, d - e) || 0 < g && d > g && Yc(a, b, c + 1, d - g)
}

function Wb() {
    var a = $("#card-column").position().top;
    $("#card-column").css("max-height", $(window).height() - a - 24);
    $("#game-siding-column").css("max-height", $(window).height() - a - 24);
    a = 4 === Ab ? 7 : 6;
    var b = $(window).width() - $("#card-column").width() - 50,
        c = $(window).height() - $("#game-chat-area").height() - 8 - 48;
    9 * c / a < b ? ($("#game-field").css("height", c + "px"), b = c / a, $("#game-field").css("width", 9 * b + "px")) : ($("#game-field").css("width", b + "px"), b /= 9, $("#game-field").css("height", b * a + "px"));
    $(".game-field-zone").css("width",
        b + "px").css("height", b + "px");
    $(".game-field-hand").css("width", 5 * b + "px").css("height", b + "px");
    Cb = b;
    Db = Math.floor(.95 * b);
    E = 177 * Db / 254;
    Zc(m[0]);
    Zc(m[1]);
    $("#game-position-atk-up").css("width", E);
    $("#game-position-atk-up").css("height", Db);
    $("#game-position-atk-up").css("margin-right", Db - E + 3);
    $("#game-position-atk-down").css("width", E);
    $("#game-position-atk-down").css("height", Db);
    $("#game-position-atk-down").css("margin-right", Db - E + 3);
    $("#game-position-def-up").css("width", E);
    $("#game-position-def-up").css("height",
        Db);
    $("#game-position-def-up").css("margin-right", Db - E + 3);
    $("#game-position-def-down").css("width", E);
    $("#game-position-def-down").css("height", Db);
    $(".game-selection-card-image").css("width", E);
    zb && $c()
}

function $c() {
    var a = $("#siding-main-deck").width() / 10 * (254 / 177);
    $("#siding-main-deck").css("height", 4 * a + "px");
    $("#siding-extra-deck").css("height", a + "px");
    $("#siding-side-deck").css("height", a + 3 + "px")
}

function ad() {
    if (Eb)
        if (2 > A || 4 <= A) {
            var a = qb[0];
            var b = qb[1] + 2
        } else a = qb[0] + 2, b = qb[1];
    else a = 2 > A ? A : 0, b = 1 - a;
    if (z) {
        var c = a;
        a = b;
        b = c
    }
    $("#game-player-name").text(B[a].name);
    $("#game-opponent-name").text(B[b].name);
    null !== B[a].ba ? $("#game-avatar-player-image").attr("src", "uploads/avatars/" + B[a].ba) : $("#game-avatar-player-image").attr("src", h("images/avatars/" + B[a].na + ".jpg"));
    null !== B[b].ba ? $("#game-avatar-opponent-image").attr("src", "uploads/avatars/" + B[b].ba) : $("#game-avatar-opponent-image").attr("src",
        h("images/avatars/" + B[b].na + ".jpg"))
}

function tc(a) {
    "sounds" === a ? fa.volume = bd("sounds") / 100 : "music" === a ? wb && (a = bd("music") / 100, wb.volume = a, 0 < a ? wb.paused && wb.play() : wb.paused || wb.pause()) : "speed" === a && (C = 1 / (bd("speed") / 100))
}

function cd() {
    V(fa, "chat-message", 2);
    dd = {};
    $("#options-show-button").click(ed);
    $("#options-hide-button").click(fd);
    $("#options-reset-button").click(gd);
    void 0 === f.options && (f.options = {});
    hd("sounds", 0, 100, 50);
    hd("music", 0, 100, 20);
    hd("speed", 20, 300, 100);
    id("auto-place-monsters", !1);
    id("auto-place-spells", !0);
    f.save();
    tc("sounds");
    tc("speed");
    jd = tc;
    void 0 === f.game && (f.game = {});
    $("#game-start-button").hide();
    $("#game-ready-button").hide();
    $("#game-not-ready-button").click(function() {
        -1 === ob ? kd("Ready check",
            "Please select a deck first, using the drop-down list on the left.") : (K({
            type: "SelectDeck",
            deckId: ob
        }), K({
            type: "RoomReadyChange",
            isReady: !0
        }))
    });
    $("#game-ready-button").click(function() {
        K({
            type: "RoomReadyChange",
            isReady: !1
        })
    });
    $("#game-start-button").click(function() {
        K({
            type: "StartDuel"
        })
    });
    $("#game-room-player1-kick-button").click(function() {
        ld(0)
    });
    $("#game-room-player2-kick-button").click(function() {
        ld(1)
    });
    $("#game-room-player3-kick-button").click(function() {
        ld(2)
    });
    $("#game-room-player4-kick-button").click(function() {
        ld(3)
    });
    $("#game-to-duelist-button").click(function() {
        K({
            type: "RoomMoveToDuelist"
        })
    });
    $("#game-to-spectator-button").click(function() {
        K({
            type: "RoomMoveToObserver"
        })
    });
    setInterval(function() {
        K({
            type: "KeepAlive"
        })
    }, 21500);
    $("#game-alert-button").click(md);
    $("#game-alert-darkener").click(md);
    pb = $("#game-deck-template").remove().removeAttr("id");
    nd();
    od()
}

function nd() {
    $("#game-deck-dropdown").click(function() {
        $("#game-deck-selection").toggle()
    });
    if (f.game.lastDeck)
        for (var a = 0; a < window.Decks.length; ++a) window.Decks[a].id === f.game.lastDeck && (ob = window.Decks[a].id, $("#game-selected-deck-name").text("Deck: " + window.Decks[a].name));
    var b = $("#game-deck-selection");
    for (a = 0; a < window.Decks.length; ++a) {
        var c = pb.clone();
        c.find(".template-button").text(window.Decks[a].name).click(window.Decks[a], function(a) {
            a.preventDefault();
            ob = a.data.id;
            $("#game-selected-deck-name").text("Deck: " +
                a.data.name);
            $("#game-deck-selection").hide();
            f.game.lastDeck = ob;
            f.save()
        });
        b.append(c)
    }
}

function ld(a) {
    K({
        type: "RoomKickPlayer",
        position: a
    })
}

function od() {
    $("#game-loading-text").text("Connecting to the server...");
    G = new WebSocket("wss://" + window.Host + "/gameserver/");
    G.onopen = function() {
        $("#game-loading-text").text("Connected, authenticating...");
        Ta = !0;
        K({
            type: "Authenticate",
            token: window.GameInfo.token
        })
    };
    G.onclose = function() {
        G = null;
        Ta && (Ta = !1, N(), pd("Error!", "You have been disconnected from the server."), $("#game-chat-textbox").remove())
    };
    G.onerror = function() {
        $("#game-loading-text").text("Could not connect to the server. Please check your internet connection or try again later.")
    };
    G.onmessage = function(a) {
        a = JSON.parse(a.data);
        window.Debug && console.log(a);
        Fb || (Fb = {
            ChatMessageReceived: qd,
            TimeLimit: rd,
            KeepAlive: sd
        });
        var b = Fb[a.type];
        b ? b(a) : (rb.push(a), sb || W())
    }
}

function qd(a) {
    Q("chat-message");
    var b = a.playerId;
    a = a.message;
    0 <= b && 3 >= b ? td("[" + B[b].name + "]: " + a) : td(a, "yellow")
}

function td(a, b) {
    a = $("<p>").text(a);
    $("#game-chat-content").append(a);
    b && a.css("color", b);
    10 < $("#game-chat-content").children().length && $("#game-chat-content").find("p:first").remove();
    setTimeout(function(a) {
        a.remove()
    }, 1E4, a)
}

function rd(a) {
    za = a.player;
    r[a.player] = a.time;
    ud(); - 1 !== Aa && clearInterval(Aa);
    Aa = setInterval(function() {
        -1 !== za && (--r[za], ud())
    }, 1E3)
}

function sd() {}

function W() {
    sb = !0;
    if (0 === rb.length) sb = !1;
    else {
        t && N();
        var a = rb.shift();
        Gb || (Gb = {
            Authenticated: vd,
            Disconnected: wd,
            RoomJoined: xd,
            RoomTypeChanged: yd,
            RoomPlayerJoined: zd,
            RoomPlayerLeft: Ad,
            RoomPlayerReadyChanged: Bd,
            DuelStarted: Cd,
            DuelEnded: Dd,
            RequestRpsMove: Ed,
            RpsMoveResult: Fd,
            RequestStartingPlayer: Gd,
            DeckError: Hd,
            SidingRequested: Id,
            WaitingForSide: Jd,
            GameStart: Kd,
            GameDraw: Ld,
            GameUpdateData: Md,
            GameUpdateCard: Nd,
            GameNewTurn: Od,
            GameNewPhase: Pd,
            GameMove: Qd,
            GamePosChange: Rd,
            GameShuffleDeck: Sd,
            GameSet: Td,
            GameSummoning: Ud,
            GameSpSummoning: Vd,
            GameFlipSummoning: Wd,
            GameChaining: Xd,
            GameDamage: Yd,
            GameRecover: Zd,
            GamePayLpCost: $d,
            GameLpUpdate: ae,
            GameAttack: be,
            GameBattle: ce,
            GameReloadField: de,
            GameTagSwap: ee,
            GameFieldDisabled: fe,
            GameWaiting: ge,
            GameEquip: he,
            GameBecomeTarget: ie,
            GameWin: je,
            GameTossCoin: ke,
            GameTossDice: le,
            GameAddCounter: me,
            GameRemoveCounter: ne,
            GameConfirmCards: oe,
            GameConfirmDeckTop: pe,
            GameDeckTop: qe,
            GameRetry: re,
            GameSelectIdleCommand: se,
            GameSelectBattleCommand: te,
            GameSelectCard: ue,
            GameSelectUnselect: ve,
            GameSortCards: we,
            GameSelectTribute: xe,
            GameSelectYesNo: ye,
            GameSelectEffectYesNo: ze,
            GameSelectChain: Ae,
            GameSelectPosition: Be,
            GameSelectOption: Ce,
            GameSelectSum: De,
            GameSelectPlace: Ee,
            GameSelectCounter: Fe,
            GameAnnounceAttrib: Ge,
            GameAnnounceRace: He,
            GameAnnounceNumber: Ie,
            GameAnnounceCard: Je
        });
        Ba && "TimeLimit" !== a.type && (Ba = !1, $("#game-waiting-window").hide());
        tb.push(a);
        10 < tb.length && tb.splice(0, 1);
        var b = Gb[a.type];
        b || window.Debug && console.warn(a);
        var c = 0;
        try {
            c = !b || !b(a)
        } catch (d) {
            a = JSON.stringify(tb), b = d.name + ": " + d.message +
                " at " + d.stack + " frames : " + a, b = btoa(b), K({
                    type: "Error",
                    content: b
                }), $("html").css("background-color", "#153f84").css("background-image", "none"), $("body").empty().css("overflow", "auto"), $("<div>").css("color", "white").css("font-family", "monospace").css("margin", "5px").css("word-wrap", "break-word").html("Sorry, an error occurred. It was not your fault.<br>The error report below was automatically sent to the developers and this problem will hopefully get fixed soon.<br>Meanwhile, you should try to play using another browser or different cards to see if it helps.<br>You can now close this tab.<br><br>Error: " +
                    d.name + "<br><br>Stack: " + d.stack + "<br><br>Frames: " + a).appendTo($("body"))
        }
        c && W()
    }
}

function xd(a) {
    Eb = 2 == a.mode;
    Hb = a.isRanked;
    B = Eb ? [null, null, null, null] : [null, null];
    Eb || $(".game-room-tag-element").remove();
    for (var b = 1; b <= B.length; ++b) $("#game-room-player" + b + "-ready").hide();
    Ke();
    $("#game-loading-container").remove();
    $("#game-room-container").css("display", "flex");
    $("#game-room-menu-container").show();
    $("#game-room-info-gameid").text(window.GameInfo.gameid);
    b = Le(a.banlist);
    var c = "???"; - 1 !== b && (c = ha.b[b].name);
    $("#game-room-info-banlist").text(c);
    Ab = a.masterRule;
    $("#game-room-info-rule").text(Me());
    3 === Ab ? ($(".if-rule4").remove(), $(".game-field-zone-if-rule3").addClass("game-field-zone")) : 4 === Ab && ($(".if-rule3").remove(), $(".game-field-zone-if-rule3").removeAttr("id"));
    b = a.format;
    2 !== b ? ($("#game-room-info-has-custom-format").show(), $("#game-room-info-format").text(Ne(b))) : $("#game-room-info-has-custom-format").hide();
    $("#game-room-info-mode").text((Hb ? "Ranked " : "") + Oe(a.mode));
    $("#game-room-info-startlp").text(a.startingLife);
    $("#game-room-info-timelimit").text(a.timeLimit + " seconds");
    a.noCheckDeck ?
        $("#game-room-info-deck-not-checked").show() : $("#game-room-info-deck-not-checked").hide();
    a.noShuffleDeck ? $("#game-room-info-deck-not-shuffled").show() : $("#game-room-info-deck-not-shuffled").hide();
    b = a.startingHand;
    5 !== b ? ($("#game-room-info-has-custom-starting-hand").show(), $("#game-room-info-starting-hand").text(b)) : $("#game-room-info-has-custom-starting-hand").hide();
    a = a.drawQuantity;
    1 !== a ? ($("#game-room-info-has-custom-cards-per-draw").show(), $("#game-room-info-cards-per-draw").text(a)) : $("#game-room-info-has-custom-cards-per-draw").hide();
    $("#game-chat-area").show();
    $("#game-chat-textbox").keyup(function(a) {
        13 == a.keyCode && (a = $("#game-chat-textbox").val(), $("#game-chat-textbox").val(""), K({
            type: "SendChatMessage",
            message: a
        }), a = "[" + Ib + "]: " + a, 4 > A ? td(a) : td(a, "yellow"))
    });
    Hb && $("#game-room-left-buttons").hide()
}

function Ne(a) {
    switch (a) {
        case 0:
            return "OCG cards only";
        case 1:
            return "TCG cards only"
    }
    return a
}

function Oe(a) {
    switch (a) {
        case 0:
            return "Single";
        case 1:
            return "Match";
        case 2:
            return "Tag"
    }
    return a
}

function Me() {
    var a = Ab;
    switch (a) {
        case 1:
            return "Master Rules 1 (Synchro)";
        case 2:
            return "Master Rules 2 (XYZ)";
        case 3:
            return "Master Rules 3 (Pendulum)";
        case 4:
            return "New Master Rules (Link)"
    }
    return a
}

function vd(a) {
    Ib = a.username;
    $("#game-loading-text").text("Authenticated, joining room...");
    K({
        type: "RoomJoin",
        name: window.GameInfo.gameid
    })
}

function wd() {
    $("#game-chat-textbox").remove();
    null !== G && G.close()
}

function yd(a) {
    nb = a.isHost;
    A = a.position;
    z = 7 == a.position;
    nb && !Hb ? $("#game-start-button").show() : $("#game-start-button").hide();
    Ke();
    z ? ($("#game-to-spectator-button").hide(), $("#game-to-duelist-button").show(), $("#game-ready-button").hide(), $("#game-not-ready-button").hide()) : ($("#game-to-spectator-button").show(), $("#game-to-duelist-button").hide(), $("#game-ready-button").hide(), $("#game-not-ready-button").show());
    Hb && !z && td("This is a ranked match. Your rating will be updated.", "yellow")
}

function Ke() {
    for (var a = 0; a < B.length; ++a) {
        var b = $("#game-room-player" + (a + 1) + "-kick-button");
        !Hb && nb && A !== a && null !== B[a] ? b.show() : b.hide()
    }
}

function zd(a) {
    B[a.position] = {
        name: a.name,
        na: Number(a.avatar),
        ba: a.customAvatarPath,
        oa: a.customSleevePath,
        ready: !1
    };
    $("#game-room-player" + (a.position + 1) + "-username").text(a.name);
    Ke()
}

function Ad(a) {
    B[a.position] = null;
    a = a.position + 1;
    $("#game-room-player" + a + "-username").text("---");
    $("#game-room-player" + a + "-ready").hide();
    $("#game-room-player" + a + "-not-ready").show();
    Ke()
}

function Bd(a) {
    B[a.position].ready = a.isReady;
    var b = a.position + 1;
    a.isReady ? ($("#game-room-player" + b + "-ready").show(), $("#game-room-player" + b + "-not-ready").hide()) : ($("#game-room-player" + b + "-ready").hide(), $("#game-room-player" + b + "-not-ready").show());
    a.position == A && (a.isReady ? ($("#game-ready-button").show(), $("#game-not-ready-button").hide(), $("#game-deck-dropdown").addClass("engine-button-disabled"), $("#game-to-spectator-button").addClass("engine-button-disabled"), $("#game-deck-selection").hide()) :
        ($("#game-ready-button").hide(), $("#game-not-ready-button").show(), $("#game-deck-dropdown").removeClass("engine-button-disabled"), $("#game-to-spectator-button").removeClass("engine-button-disabled")));
    a: {
        for (a = 0; a < B.length; ++a)
            if (!B[a] || !B[a].ready) {
                a = !1;
                break a
            } a = !0
    }
    a ? $("#game-start-button").removeClass("engine-button-disabled") : $("#game-start-button").addClass("engine-button-disabled")
}

function Cd() {
    if (zb) {
        $("#game-siding-column").hide();
        $("#game-siding-column-2").hide();
        $("#game-container").hide();
        $("#game-column").show();
        zb = !1;
        for (var a = ["main", "extra", "side"], b = 0; b < a.length; ++b) {
            for (var c = a[b], d = 0; d < I[c].length; ++d) I[c][d].remove();
            I[c] = []
        }
    }
    $("#game-room-container").remove();
    $("#game-room-menu-container").remove()
}

function Dd() {
    $("#game-end-button").text("End the duel").off("click").one("click", Pe).show()
}

function Pe() {
    null !== G && G.close();
    $("#game-chat-textbox").remove();
    $("#game-container").remove();
    $("#game-end-window").remove();
    $("#game-result-container").show()
}

function Ed() {
    Jb ? ($("#game-rps-rock").show(), $("#game-rps-paper").show(), $("#game-rps-scissors").show()) : (Jb = !0, $("#game-rps-container").show(), $("#game-rps-first").hide(), $("#game-rps-second").hide(), $("#game-rps-rock").click(function() {
        Qe();
        Re(2)
    }), $("#game-rps-paper").click(function() {
        Qe();
        Re(3)
    }), $("#game-rps-scissors").click(function() {
        Qe();
        Re(1)
    }))
}

function Fd(a) {
    Jb || (Jb = !0, $("#game-rps-container").show(), $("#game-rps-first").hide(), $("#game-rps-second").hide());
    Qe();
    var b = h("images/scissors.png");
    2 === a.move ? b = h("images/rock.png") : 3 === a.move && (b = h("images/paper.png"));
    var c = h("images/scissors.png");
    2 === a.opponentMove ? c = h("images/rock.png") : 3 === a.opponentMove && (c = h("images/paper.png"));
    $("#game-rps-move-player").attr("src", b);
    $("#game-rps-move-opponent").attr("src", c);
    $("#game-rps-result").fadeIn();
    setTimeout(function() {
        $("#game-rps-result").hide();
        W()
    }, 1500);
    return !0
}

function Gd() {
    $("#game-rps-container").show();
    $("#game-rps-rock").hide();
    $("#game-rps-paper").hide();
    $("#game-rps-scissors").hide();
    $("#game-rps-first").show();
    $("#game-rps-second").show();
    $("#game-rps-first").click(function() {
        Se(!0)
    });
    $("#game-rps-second").click(function() {
        Se(!1)
    })
}

function Qe() {
    $("#game-rps-rock").hide();
    $("#game-rps-paper").hide();
    $("#game-rps-scissors").hide()
}

function Re(a) {
    K({
        type: "SendRpsMove",
        move: a
    })
}

function Se(a) {
    K({
        type: "SendStartingPlayer",
        isStarting: a
    })
}

function Hd(a) {
    (a = X[a.cardId]) ? kd("Invalid deck", "This deck cannot be used because the card <i>" + a.name + "</i> is banned or limited."): kd("Invalid deck", "This deck is invalid and cannot be used. Please make sure it has the correct amount of cards and is not using an invalid card.")
}

function Id(a) {
    zb = !0;
    Ua = !1;
    H = {
        main: a.main,
        extra: a.extra,
        side: a.side
    };
    Kb = {
        main: a.main.slice(0),
        extra: a.extra.slice(0),
        side: a.side.slice(0)
    };
    I = {
        main: [],
        extra: [],
        side: []
    };
    Lb = {
        main: 0,
        extra: 0,
        side: 0
    };
    J = null;
    $("#game-end-button").text("Play the next round").off("click").one("click", Te).show();
    $("#game-siding-done").off("click").on("click", function() {
        K({
            type: "UpdateDeck",
            main: H.main,
            extra: H.extra,
            side: H.side
        })
    })
}

function Te() {
    $("#game-end-window").hide();
    $("#game-end-button").hide();
    $("#game-column").hide();
    $("#game-siding-column").show();
    $("#game-siding-column-2").show();
    Ue("main");
    Ue("extra");
    Ue("side");
    $c();
    Mb || (Mb = !0, $(window).on("mouseup", function(a) {
        if (1 === a.which && J) return Ve(), !1
    }))
}

function Ue(a) {
    for (var b = 0; b < H[a].length; ++b) We(H[a][b], a, -1);
    b = $("#siding-" + a + "-deck");
    b.data("location", a);
    b.mouseup(function(a) {
        if (J && 1 == a.which) {
            a = J.data("id");
            var b = $(this).data("location");
            Xe(a, b) ? (We(a, b, -1), J && (J.remove(), J = null), Ye()) : Ve();
            return !1
        }
    })
}

function Ye() {
    for (var a = ["main", "extra", "side"], b = 0; b < a.length; ++b) {
        var c = a[b];
        H[c] = [];
        for (var d = 0; d < I[c].length; ++d) H[c].push(I[c][d].data("id"))
    }
    Kb.main.length === H.main.length && Kb.extra.length === H.extra.length && Kb.side.length === H.side.length ? $("#game-siding-done").removeClass("engine-button-disabled") : $("#game-siding-done").addClass("engine-button-disabled")
}

function Xe(a, b) {
    a = X[a];
    if (a.type & U.U) return !1;
    var c = !1;
    if (a.type & U.S || a.type & U.T || a.type & U.G || a.type & U.C) c = !0;
    return c && "main" === b || !c && "extra" === b || I[b].length >= ("main" === b ? 64 : 18) ? !1 : !0
}

function We(a, b, c) {
    var d = X[a],
        e = I[b],
        g = $("#siding-" + b + "-deck"),
        k = $("<img>").css("margin-right", Lb[b]).addClass("editor-card-small");
    l(k, a);
    k.mouseover(function() {
        Cc($(this).data("id"))
    });
    k.mousedown(function(a) {
        if (1 == a.which) {
            a = $(this).data("id");
            var b = $(this).data("location");
            var c = $(this).parent().children().index($(this));
            Ze(b, c);
            Ve();
            var d = $("#siding-main-deck").width() / 10;
            c = 254 / 177 * d;
            J = $("<img>").css("position", "absolute").css("left", 0).css("top", 0).css("width", d + "px").css("height", c + "px").data("id",
                a).data("oldLocation", b);
            l(J, a);
            J.appendTo($("body"));
            uc();
            Ye();
            return !1
        }
        if (3 == a.which) return !1
    });
    k.mouseup(function(a) {
        if (1 == a.which && J) {
            a = J.data("id");
            var b = $(this).data("location"),
                c = $(this).parent().children().index($(this));
            Xe(a, b) ? (We(a, b, c), J && (J.remove(), J = null), Ye()) : Ve();
            return !1
        }
    });
    k.on("contextmenu", function() {
        if (null !== J) return !1;
        var a = $(this).data("id"),
            b = $(this).data("location"),
            c = X[a],
            d = !1;
        if (c.type & U.S || c.type & U.T || c.type & U.G || c.type & U.C) d = !0;
        c = "side" === b ? d ? "extra" : "main" : "side";
        Xe(a, c) && (d = $(this).parent().children().index($(this)), Ze(b, d), We(a, c, -1), Ye());
        return !1
    });
    k.data("id", a);
    k.data("alias", d.A);
    k.data("location", b); - 1 === c ? (g.append(k), e.push(k)) : (0 === c && 0 == g.children().length ? g.append(k) : g.children().eq(c).before(k), e.splice(c, 0, k));
    $e(b)
}

function uc() {
    J && J.css("left", xb + 3).css("top", yb + 3)
}

function Ve() {
    if (J) {
        var a = J.data("id"),
            b = J.data("oldLocation");
        J.remove();
        J = null;
        We(a, b, -1);
        Ye()
    }
}

function Ze(a, b) {
    var c = I[a];
    c[b].remove();
    c.splice(b, 1);
    $e(a)
}

function $e(a) {
    var b = "0";
    I[a].length > ("main" == a ? 60 : 15) ? b = "main" == a ? "-4.05%" : "-4.72%" : I[a].length > ("main" == a ? 40 : 10) && (b = "-3.6%");
    if (Lb[a] !== b) {
        Lb[a] = b;
        for (var c = 0; c < I[a].length; ++c) I[a][c].css("margin-right", b)
    }
}

function Kd(a) {
    Nb = !1;
    $("#game-rps-container").hide();
    $("#game-container").show();
    $("#game-menu-container").show();
    Sb();
    Eb && (qb = [0, 0]);
    ad();
    for (var b = 0; 2 > b; ++b) {
        for (var c = 0; c < a.deckSize[b]; ++c) {
            var d = new Y;
            d.ca = b;
            S(d, b, O.f, -1)
        }
        for (c = 0; c < a.extraDeckSize[b]; ++c) d = new Y, d.ca = b, S(d, b, O.h, -1)
    }
    q[0] = a.lifePoints[0];
    q[1] = a.lifePoints[1];
    af()
}

function Ld(a) {
    yc(a.cards, function() {
        bf(a)
    });
    return !0
}

function bf(a) {
    function b(c) {
        if (c == a.count) W();
        else {
            Q("draw");
            var d = T(a.player, O.f, -1);
            cf(d);
            m[d.controller].P(d, !0);
            S(d, a.player, O.j, -1, !0);
            df(d, a.cards[c], d.position, 200 * C, function() {
                b(c + 1)
            })
        }
    }
    b(0)
}

function Md(a) {
    for (var b = 0; b < a.cards.length; ++b) null !== a.cards[b] && T(a.controller, a.location, b).setData(a.cards[b])
}

function Nd(a) {
    T(a.controller, a.location, a.sequence).setData(a.card)
}

function ef(a) {
    var b = W;
    $("#game-next-turn-text").text(a);
    $("#game-next-turn").css("left", "0%");
    $("#game-next-turn").css("opacity", 0);
    $("#game-next-turn").show();
    $("#game-next-turn").animate({
        left: "50%",
        opacity: 1
    }, {
        duration: 150 * C
    }).delay(300 * C).animate({
        left: "100%",
        opacity: 0
    }, {
        duration: 150 * C,
        complete: function() {
            $("#game-next-turn").hide();
            b()
        }
    })
}

function Od(a) {
    Q("next-turn");
    ef(0 == a.player ? "Your turn" : "Opponent turn");
    return !0
}

function Pd(a) {
    if (p !== a.phase) return -1 !== p && n[p] && n[p].removeClass("engine-button-success").addClass("engine-button-default"), p = a.phase, n[p] && n[p].addClass("engine-button-default").addClass("engine-button-success"), Q("next-phase"), (a = ff[p]) && ef(a), !0
}

function Qd(a) {
    xc(a.cardCode, function() {
        gf(a)
    });
    return !0
}

function gf(a) {
    if (0 === a.previousLocation) {
        var b = new Y(a.cardCode, a.currentPosition);
        S(b, a.currentController, a.currentLocation, a.currentSequence);
        hf(b)
    } else 0 === a.currentLocation ? (b = T(a.previousController, a.previousLocation, a.previousSequence, a.previousPosition), b.fadeOut(300 * C, function() {
        m[b.controller].P(b, void 0);
        W()
    })) : (b = T(a.previousController, a.previousLocation, a.previousSequence, a.previousPosition), a.previousLocation & O.da && a.previousLocation != a.currentLocation && (b.F = {}), cf(b), m[b.controller].P(b,
        !0), S(b, a.currentController, a.currentLocation, a.currentSequence, !0), df(b, a.cardCode, a.currentPosition, 300 * C, W))
}

function Rd(a) {
    xc(a.cardCode, function() {
        var b = T(a.controller, a.location, a.sequence);
        cf(b);
        df(b, a.cardCode, a.currentPosition, 250 * C, W)
    });
    return !0
}

function Sd(a) {
    a = m[a.player];
    for (var b = 0; b < a.c[O.f].length; ++b) jf(a.c[O.f][b], 0);
    Q("shuffle")
}

function Td() {
    Q("set")
}

function Ud(a) {
    xc(a.cardCode, function() {
        Q("summon");
        kf(a.cardCode)
    });
    return !0
}

function Vd(a) {
    xc(a.cardCode, function() {
        Q("summon-special");
        kf(a.cardCode)
    });
    return !0
}

function Wd(a) {
    xc(a.cardCode, function() {
        Q("summon-flip");
        kf(a.cardCode)
    });
    return !0
}

function Xd(a) {
    xc(a.cardCode, function() {
        Q("activate");
        kf(a.cardCode)
    });
    return !0
}

function kf(a) {
    var b = W;
    l($("#game-highlight-card-img"), a);
    $("#game-highlight-card").show().css("opacity", 0).animate({
        opacity: 1
    }, {
        duration: 150 * C
    }).delay(250 * C).animate({
        opacity: 0
    }, {
        duration: 150 * C,
        complete: function() {
            $("#game-highlight-card").hide();
            $("#game-highlight-card-img").attr("src", ra(0));
            b()
        }
    })
}

function af() {
    0 > q[0] && (q[0] = 0);
    0 > q[1] && (q[1] = 0);
    $("#game-life-player").text(q[0]);
    $("#game-life-opponent").text(q[1]);
    var a = 100 * q[0] / 8E3;
    100 < a && (a = 100);
    $("#game-life-bar-player").css("width", a + "%");
    a = 100 * q[1] / 8E3;
    100 < a && (a = 100);
    $("#game-life-bar-opponent").css("width", a + "%")
}

function ud() {
    0 == za ? ($("#game-timer-bar-player").show(), $("#game-timer-player").show(), $("#game-timer-bar-opponent").hide(), $("#game-timer-opponent").hide()) : 1 == za && ($("#game-timer-bar-player").hide(), $("#game-timer-player").hide(), $("#game-timer-bar-opponent").show(), $("#game-timer-opponent").show());
    0 > r[0] && (r[0] = 0);
    0 > r[1] && (r[1] = 0);
    $("#game-timer-player").text(r[0]);
    $("#game-timer-opponent").text(r[1]);
    var a = 100 * r[0] / 240;
    100 < a && (a = 100);
    $("#game-timer-bar-player-part").css("width", a + "%");
    a = 100 *
        r[1] / 240;
    100 < a && (a = 100);
    $("#game-timer-bar-opponent-part").css("width", a + "%")
}

function lf(a, b) {
    var c = W;
    0 != b && ($("#game-life-change-text").text(b), 0 < b ? $("#game-life-change-text").removeClass("game-life-change-bad").addClass("game-life-change-good") : $("#game-life-change-text").removeClass("game-life-change-good").addClass("game-life-change-bad"), $("#game-life-change").css("top", 0 == a ? "70%" : "30%"), $("#game-life-change").css("opacity", 0), $("#game-life-change").show(), $("#game-life-change").animate({
        opacity: 1
    }, {
        duration: 150 * C
    }).delay(700 * C).animate({
        opacity: 0
    }, {
        duration: 150 * C,
        complete: function() {
            $("#game-life-change").hide();
            c()
        }
    }))
}

function Yd(a) {
    q[a.player] -= a.amount;
    af();
    Q("life-damage");
    lf(a.player, -a.amount);
    return !0
}

function Zd(a) {
    q[a.player] += a.amount;
    af();
    Q("life-recover");
    lf(a.player, a.amount);
    return !0
}

function $d(a) {
    return Yd(a)
}

function ae(a) {
    q[a.player] = a.amount;
    af()
}

function be(a) {
    Q("attack");
    var b = $("<img>").attr("src", h("images/attack.png")).addClass("game-attack-animation");
    var c = 0 !== a.attackerLocation ? mf(m[a.attackerController], a.attackerLocation, a.attackerSequence) : mf(m[a.attackerController], O.m, 2);
    (0 !== a.defenderLocation ? mf(m[a.defenderController], a.defenderLocation, a.defenderSequence) : mf(m[1 - a.attackerController], O.m, 2)).append(b);
    a = b.offset();
    b.detach();
    c.append(b);
    c = b.offset();
    var d = a.left - c.left,
        e = a.top - c.top,
        g = 180 / Math.PI * Math.atan2(e, d) + 90;
    $("<div />").animate({
        height: 1
    }, {
        duration: 500 * C,
        step: function(a, c) {
            a = c.pos;
            a = "translate(" + d * a + "px, " + e * a + "px)";
            a += " rotate(" + g + "deg)";
            b.css("transform", a)
        },
        complete: function() {
            b.remove();
            W()
        }
    });
    return !0
}

function ce() {}

function de(a) {
    for (var b = 0; 2 > b; ++b) {
        var c = a.players[b];
        q[b] = c.lifePoints;
        for (var d = 0; d < c.monsters.length; ++d)
            if (null !== c.monsters[d]) {
                var e = new Y,
                    g = e;
                g.position = c.monsters[d].position;
                nf(g);
                S(e, b, O.g, d)
            } for (d = 0; d < c.spells.length; ++d) - 1 !== c.spells[d] && (g = e = new Y, g.position = c.spells[d], nf(g), S(e, b, O.m, d));
        for (d = 0; d < c.deckSize; ++d) S(new Y, b, O.f, -1);
        for (d = 0; d < c.handSize; ++d) S(new Y, b, O.j, -1);
        for (d = 0; d < c.graveyardSize; ++d) S(new Y, b, O.v, -1);
        for (d = 0; d < c.banishedSize; ++d) S(new Y, b, O.u, -1);
        for (d = 0; d < c.extraSize; ++d) S(new Y,
            b, O.h, -1)
    }
    af()
}

function fe(a) {
    wc(a.fields)
}

function wc(a) {
    $(".game-field-zone-disabled").removeClass("game-field-zone-disabled");
    if (null !== a)
        for (var b = 0; 2 > b; ++b) {
            for (var c = a[b], d = 0; 5 > d; ++d) c & 1 << d && $(m[b].namespace + "monster" + (d + 1)).addClass("game-field-zone-disabled");
            for (d = 0; 8 > d; ++d) c & 256 << d && $(m[b].namespace + "spell" + (d + 1)).addClass("game-field-zone-disabled")
        }
}

function ee(a) {
    yc(a.extraCodes.concat(a.handCodes), function() {
        of (a)
    });
    return !0
}

function of (a) {
    var b = a.player;
    qb[b] = 1 - qb[b];
    ad();
    pf(m[b], O.f, !0);
    pf(m[b], O.h, !0);
    pf(m[b], O.j, !0);
    setTimeout(function() {
        for (var c = 0; c < a.deckSize; ++c) S(new Y, b, O.f, -1);
        for (c = 0; c < a.extraSize; ++c) S(new Y(a.extraCodes[c]), b, O.h, -1);
        for (c = 0; c < a.handSize; ++c) S(new Y(a.handCodes[c]), b, O.j, -1);
        W()
    }, 320 * C)
}

function ge() {
    Ba = !0;
    z ? $("#game-waiting-text").text("Waiting for a player...") : Eb ? $("#game-waiting-text").text("Waiting for another player...") : $("#game-waiting-text").text("Waiting for the opponent...");
    $("#game-waiting-window").show()
}

function Jd() {
    Ua = !1;
    $("#game-end-window").hide();
    $("#game-end-button").hide();
    Ba = !0;
    $("#game-waiting-text").text("Waiting for the players to side...");
    $("#game-waiting-window").show()
}

function he() {
    Q("equip")
}

function ie(a) {
    function b(c) {
        if (c == a.cards.length) W();
        else {
            var d = a.cards[c];
            !d.location & O.da ? b(c + 1) : qf(T(d.controller, d.location, d.sequence), function() {
                b(c + 1)
            })
        }
    }
    b(0);
    return !0
}

function je(a) {
    var b = "No winner.";
    0 === a.player ? b = "You win!" : 1 === a.player && (b = "You lose!");
    Ua = !1;
    pd(b, "Reason: " + rf[a.reason])
}

function re() {
    N();
    kd("An error occurred", "An invalid action occurred on the server.")
}

function pd(a, b) {
    N();
    Ua || (Ua = !0, $("#game-end-title").text(a), $("#game-end-text").text(b), $("#game-end-button").hide(), $("#game-end-window").show())
}

function kd(a, b) {
    Ob || (Ob = !0, $("#game-alert-title").text(a), $("#game-alert-text").html(b), $("#game-alert-window").show(), $("#game-alert-darkener").show())
}

function md() {
    Ob && (Ob = !1, $("#game-alert-window").hide(), $("#game-alert-darkener").hide())
}

function ke(a) {
    Q("coin-flip");
    for (var b = ta("Coin", a.coins.length) + " landed on:<br>", c = 0; c < a.coins.length; ++c) 0 !== c && (b += ", "), b += sf[a.coins[c] ? 60 : 61];
    tf(b, 1500 * C, W);
    return !0
}

function le(a) {
    Q("dice-roll");
    for (var b = (1 == a.dice.length ? "Die" : "Dice") + " landed on:<br>", c = 0; c < a.dice.length; ++c) 0 !== c && (b += ", "), b += "[" + a.dice[c] + "]";
    tf(b, 1500 * C, W);
    return !0
}

function me(a) {
    return uf(a, !1)
}

function ne(a) {
    return uf(a, !0)
}

function oe(a) {
    zc(a.cards, function() {
        vf(a)
    });
    return !0
}

function vf(a) {
    function b(c) {
        if (c == a.cards.length) W();
        else {
            var d = a.cards[c],
                e = T(d.controller, d.location, d.sequence);
            !e || d.location & O.f || d.location & O.h ? b(c + 1) : (cf(e), df(e, 1 === d.controller || z ? d.code : 0, e.position, 200 * C, function() {
                setTimeout(function() {
                    cf(e);
                    df(e, 1 === d.controller || z ? 0 : d.code, e.position, 200 * C, function() {
                        b(c + 1)
                    })
                }, 600 * C)
            }))
        }
    }
    b(0)
}

function pe(a) {
    yc(a.cards, function() {
        wf(a)
    });
    return !0
}

function qe(a) {
    xc(a.cardId, function() {
        var b = a.player,
            c = a.cardId,
            d = 0 < c ? nc : oc;
        (b = T(b, O.f, m[b].c[O.f].length - 1 - a.index)) ? (cf(b), jf(b, c), df(b, c, d, 200 * C, W)) : W()
    });
    return !0
}

function wf(a) {
    function b(d) {
        d == a.cards.length ? W() : (cf(c), df(c, a.cards[d], c.position, 200 * C, function() {
            setTimeout(function() {
                cf(c);
                df(c, 0, c.position, 200 * C, function() {
                    b(d + 1)
                })
            }, 600 * C)
        }))
    }
    var c = T(a.player, O.f, -1);
    b(0)
}

function uf(a, b) {
    var c = T(a.controller, a.location, a.sequence),
        d = null,
        e = X[c.code];
    e && (d = e.name);
    qf(c);
    a.counterType in c.F ? (c.F[a.counterType] += b ? -a.counterCount : a.counterCount, 0 >= c.F[a.counterType] && delete c.F[a.counterType]) : b || (c.F[a.counterType] = a.counterCount);
    a = (b ? "Removed " : "Placed ") + (a.counterCount + " \u00d7 " + xf[a.counterType]);
    d && (a += (b ? " from " : " on ") + d);
    Q("counter");
    tf(a, 1500 * C, W);
    return !0
}

function tf(a, b, c) {
    $("#game-message-content").html(a);
    $("#game-message-window").stop(!0, !0).show("fast").delay(b).hide("fast", c)
}

function se(a) {
    R();
    t = !0;
    a.canBattlePhase && n[L.J].removeClass("engine-button-disabled").addClass("engine-button-primary");
    a.canEndPhase && n[L.R].removeClass("engine-button-disabled").addClass("engine-button-primary");
    for (var b = 0; b < a.summonableCards.length; ++b) {
        var c = a.summonableCards[b];
        Va.push(T(c.controller, c.location, c.sequence))
    }
    for (b = 0; b < a.specialSummonableCards.length; ++b) {
        c = a.specialSummonableCards[b];
        if (c.location === O.v || c.location === O.u || c.location === O.h || c.location === O.f) Ha[c.location] = !0;
        var d = T(c.controller, c.location, c.sequence);
        jf(d, c.code);
        u.push(d)
    }
    for (b = 0; b < a.repositionableCards.length; ++b) c = a.repositionableCards[b], Wa.push(T(c.controller, c.location, c.sequence));
    for (b = 0; b < a.monsterSetableCards.length; ++b) c = a.monsterSetableCards[b], Xa.push(T(c.controller, c.location, c.sequence));
    for (b = 0; b < a.spellSetableCards.length; ++b) c = a.spellSetableCards[b], Ya.push(T(c.controller, c.location, c.sequence));
    for (b = 0; b < a.activableCards.length; ++b) {
        c = a.activableCards[b];
        if (c.location === O.v || c.location ===
            O.u || c.location === O.h || c.location === O.f) Ia[c.location] = !0;
        d = T(c.controller, c.location, c.sequence);
        jf(d, c.code);
        v.push(d);
        Za.push(c.effect)
    }(Ha[O.v] || Ia[O.v]) && $("#game-field-player-graveyard-activate").show();
    (Ha[O.u] || Ia[O.u]) && $("#game-field-player-banished-activate").show();
    (Ha[O.h] || Ia[O.h]) && $("#game-field-player-extra-activate").show();
    (Ha[O.f] || Ia[O.f]) && $("#game-field-player-deck-activate").show();
    for (a = 0; a < Va.length; ++a) Va[a].a.addClass("game-selectable-card");
    for (a = 0; a < u.length; ++a) b = u[a].location,
        b !== O.v && b !== O.u && b !== O.h && b !== O.f && u[a].a.addClass("game-selectable-card");
    for (a = 0; a < Wa.length; ++a) Wa[a].a.addClass("game-selectable-card");
    for (a = 0; a < Xa.length; ++a) Xa[a].a.addClass("game-selectable-card");
    for (a = 0; a < Ya.length; ++a) Ya[a].a.addClass("game-selectable-card");
    for (a = 0; a < v.length; ++a) b = v[a].location, b !== O.v && b !== O.u && b !== O.h && b !== O.f && v[a].a.addClass("game-selectable-card")
}

function te(a) {
    R();
    t = !0;
    a.canMainPhase2 && n[L.X].removeClass("engine-button-disabled").addClass("engine-button-primary");
    a.canEndPhase && n[L.R].removeClass("engine-button-disabled").addClass("engine-button-primary");
    for (var b = 0; b < a.attackingCards.length; ++b) {
        var c = a.attackingCards[b];
        $a.push(T(c.controller, c.location, c.sequence))
    }
    for (b = 0; b < a.activableCards.length; ++b) c = a.activableCards[b], v.push(T(c.controller, c.location, c.sequence)), Za.push(c.effect);
    for (b = 0; b < $a.length; ++b) $a[b].a.addClass("game-selectable-card");
    for (b = 0; b < v.length; ++b) v[b].a.addClass("game-selectable-card")
}

function ue(a) {
    return yf(a, !1, !1)
}

function xe(a) {
    return yf(a, !0, !1)
}

function ve(a) {
    return yf(a, !1, !0)
}

function yf(a, b, c) {
    R();
    t = !0;
    Ga = c ? a.isSubmittable : !1;
    Fa = a.isCancellable;
    cb = a.min;
    db = a.max;
    Ca = b;
    Ea = c;
    var d = c ? zf(a.selectableCards) || zf(a.selectedCards) : zf(a.cards);
    if (c) {
        c = [];
        for (var e = 0; e < a.selectableCards.length; ++e) c.push(a.selectableCards[e]);
        for (e = 0; e < a.selectedCards.length; ++e) {
            var g = a.selectedCards[e];
            g.isAlreadySelected = !0;
            c.push(g)
        }
        d ? fc(c, !1) : Af(c, b)
    } else d ? fc(a.cards, !1) : Af(a.cards, b)
}

function zf(a) {
    for (var b = 0; b < a.length; ++b) {
        var c = a[b].location;
        if (c === O.f || c === O.h || c === O.v || c === O.u || c & O.B) return !0
    }
    return !1
}

function we(a) {
    a.isChain && 1 !== mb ? P(-1) : (R(), Fa = t = !0, db = cb = a.cards.length, Da = !0, fc(a.cards, !1))
}

function Af(a, b) {
    for (var c = 0; c < a.length; ++c) {
        var d = a[c],
            e = T(d.controller, d.location, d.sequence);
        d.code && jf(e, d.code);
        b && d.sumValue && (e.I = d.sumValue);
        x.push(e);
        d.isAlreadySelected ? (e.a.addClass("game-selected-card"), y.push(e)) : e.a.addClass("game-selectable-card")
    }
}

function fc(a, b) {
    Ma = !0;
    for (var c = $("#game-selection-list"), d = 0; d < a.length; ++d) {
        var e = a[d],
            g = void 0,
            k = !1;
        b ? g = a[d] : (g = T(e.controller, e.location, e.sequence, e.position), e.sumValue && (g.I = e.sumValue), e.isAlreadySelected && (k = !0));
        var w = wa.clone().data("card-controller", g.controller).data("card-location", g.location).data("card-sequence", g.D).data("card-subsequence", e.position).mouseenter(function() {
            var a = $(this).data("card-controller"),
                b = $(this).data("card-location"),
                c = $(this).data("card-sequence");
            Yb(a,
                b, c)
        }).mouseleave(function() {
            var a = $(this).data("card-controller"),
                b = $(this).data("card-location"),
                c = $(this).data("card-sequence");
            Zb(a, b, c)
        }).click(function() {
            var a = $(this).data("card-controller"),
                b = $(this).data("card-location"),
                c = $(this).data("card-sequence"),
                d = $(this).data("card-subsequence");
            (a = T(a, b, c, d)) && Pc(a)
        });
        b ? e = g.code : (e = 0 !== e.code ? e.code : g.code, jf(g, e));
        l(w.find(".game-selection-card-image"), e);
        w.find(".game-selection-card-text").text(Bf[g.location & ~O.B] + " (" + g.D + ")");
        w.appendTo(c);
        g.Y =
            w.find(".game-selection-card-image");
        x.push(g);
        k && (y.push(g), g.Y.addClass("game-selected-card"))
    }
    $(".game-selection-card-image").css("width", E);
    $("#game-selection-window").show()
}

function Cf(a) {
    if (1E4 > a) return sf[a];
    var b = X[a >> 4];
    return b && (a &= 15, b = 0 <= a && a < b.ra.length ? b.ra[a] : null) ? b : ""
}

function ye(a) {
    R();
    a = Cf(a.effect);
    $("#game-yesno-title").text(a);
    $("#game-yesno-window").fadeIn(250)
}

function ze(a) {
    R();
    var b = "",
        c = X[a.card.code];
    c && (b = "Do you want to activate " + c.name + " (" + Bf[a.card.location] + ")?");
    $("#game-yesno-title").text(b);
    $("#game-yesno-window").fadeIn(250)
}

function Ae(a) {
    R();
    if (a.forced || 2 !== mb)
        if (0 !== mb || a.forced || 0 !== a.cards.length && 0 !== a.specialCount)
            if (a.forced && 1 === a.cards.length) P(0);
            else {
                Ja = !0;
                Pb = !1;
                for (var b = 0; b < a.cards.length; ++b)
                    if (a.cards[b].location === O.f || a.cards[b].location === O.h || a.cards[b].location === O.v || a.cards[b].location === O.u || a.cards[b].location & O.B) {
                        Pb = !0;
                        break
                    } for (b = 0; b < a.cards.length; ++b) {
                    var c = a.cards[b];
                    ab.push(T(c.controller, c.location, c.sequence));
                    Za.push(c.effect)
                }
                a.forced ? rc() : (Fa = !0, $("#game-yesno-title").text("Activate a card? " +
                    a.cards.length + " " + ta("effect", a.cards.length) + " can be chained."), $("#game-yesno-window").fadeIn(250))
            }
    else P(-1);
    else P(-1)
}

function rc() {
    if (Pb) Oa = !0, fc(ab, !0);
    else {
        t = !0;
        db = cb = 1;
        for (var a = 0; a < ab.length; ++a) x.push(ab[a]), ab[a].a.addClass("game-selectable-card")
    }
}

function Be(a) {
    R();
    a.positions & nc ? ($("#game-position-atk-up").show(), $("#game-position-atk-up").show(), l($("#game-position-atk-up"), a.cardCode)) : $("#game-position-atk-up").hide();
    a.positions & oc ? ($("#game-position-atk-down").show(), $("#game-position-atk-down").attr("src", ra(0))) : $("#game-position-atk-down").hide();
    a.positions & pc ? ($("#game-position-def-up").show(), l($("#game-position-def-up"), a.cardCode)) : $("#game-position-def-up").hide();
    a.positions & qc ? ($("#game-position-def-down").show(), $("#game-position-def-down").attr("src",
        ra(0))) : $("#game-position-def-down").hide();
    $("#game-position-window").fadeIn(250)
}

function Ce(a) {
    R();
    t = !0;
    Vc(a.options, !0, !1)
}

function Vc(a, b, c) {
    for (var d = $("#game-option-list"), e = 0; e < a.length; ++e) {
        var g = c ? a[e].index : e,
            k = c ? a[e].qa : a[e];
        va.clone().data("option-index", g).text(b ? Cf(k) : k).click(function() {
            var a = $(this).data("option-index");
            Na ? Ja ? P(a) : M(p === L.J ? Tc : Uc, a) : P(a);
            N()
        }).appendTo(d)
    }
    $("#game-option-window").fadeIn(250)
}

function De(a) {
    R();
    t = !0;
    eb = a.sumValue;
    cb = a.selectMin;
    db = a.selectMax;
    for (var b = !1, c = 0; c < a.cards.length; ++c)
        if (a.cards[c].location === O.f || a.cards[c].location === O.h || a.cards[c].location === O.v || a.cards[c].location === O.u || a.cards[c].location & O.B) {
            b = !0;
            break
        } for (c = 0; c < a.mustSelectCards.length; ++c) {
        var d = a.mustSelectCards[c],
            e = T(d.controller, d.location, d.sequence);
        d.code && jf(e, d.code);
        e.I = d.sumValue;
        e.a.addClass("game-selected-card");
        y.push(e);
        bb.push(e)
    }
    if (b) fc(a.cards, !1);
    else
        for (c = 0; c < a.cards.length; ++c) d =
            a.cards[c], e = T(d.controller, d.location, d.sequence), d.code && jf(e, d.code), e.I = d.sumValue, e.a.addClass("game-selectable-card"), x.push(e)
}

function Ee(a) {
    hb = a.count;
    ib = a.filter;
    if (a = !a.isDisfield && 1 === a.count) {
        for (var b = a = !1, c = 0; 2 > c; ++c) {
            for (var d = 0; d < (4 === Ab ? 7 : 5); ++d)
                if (Oc(c, O.g, d)) {
                    a = !0;
                    break
                } for (d = 0; 8 > d; ++d)
                if (Oc(c, O.m, d)) {
                    b = !0;
                    break
                }
        }
        if (a && !b && bd("auto-place-monsters") || !a && b && bd("auto-place-spells")) {
            a = ib;
            d = c = b = -1;
            var e = !1;
            if (a & 127) {
                b = 0;
                c = O.g;
                var g = a & 127
            } else a & 7936 ? (b = 0, c = O.m, g = a >> 8 & 31) : a & 49152 ? (b = 0, c = O.m, g = a >> 14 & 3, e = !0) : a & 8323072 ? (b = 1, c = O.g, g = a >> 16 & 127) : a & 520093696 ? (b = 1, c = O.m, g = a >> 24 & 31) : a & 3221225472 && (b = 1, c = O.m, g = a >> 30 & 3, e = !0);
            e ? g & 1 ? d = 6 : g & 2 && (d = 7) : g & 64 ? d = 6 : g & 32 ? d = 5 : g & 4 ? d = 2 : g & 2 ? d = 1 : g & 8 ? d = 3 : g & 1 ? d = 0 : g & 16 && (d = 4); - 1 === b || -1 === c || -1 === d ? g = !1 : (K({
                type: "GameSendZones",
                zones: [{
                    player: b,
                    location: c,
                    sequence: d
                }]
            }), g = !0)
        } else g = !1;
        a = g
    }
    if (a) ib = hb = -1;
    else
        for (R(), gb = !0, g = 0; 2 > g; ++g) {
            for (a = 0; a < (4 === Ab ? 7 : 5); ++a) Oc(g, O.g, a) && $(Mc(g, O.g, a)).addClass("game-field-zone-selectable");
            for (a = 0; 8 > a; ++a) Oc(g, O.m, a) && $(m[g].namespace + "spell" + (a + 1)).addClass("game-field-zone-selectable")
        }
}

function Oc(a, b, c) {
    return ib & 1 << c + 16 * a + (b === O.g ? 0 : 8)
}

function Fe(a) {
    var b = a.counterType,
        c = a.counterCount;
    a = a.cards;
    R();
    Pa = !0;
    Qa = b;
    Sa = Ra = c;
    Bb = [];
    for (b = 0; b < a.length; ++b) {
        c = a[b];
        var d = T(c.controller, c.location, c.sequence);
        c.effect && (d.Da = c.effect);
        x.push(d);
        Bb.push(0);
        d.a.addClass("game-selectable-card")
    }
    Qc()
}

function Qc() {
    if (Sa === Ra) tf("Please select " + (Ra + " \u00d7 " + xf[Qa]), 2E3 * C, null);
    else {
        var a = "Selecting " + xf[Qa] + ": ";
        a += Sa + " / " + Ra;
        tf(a, 1E3 * C, null)
    }
}

function Ge(a) {
    R();
    t = !0;
    Qb = a.count;
    Rb = {};
    $("#game-announce-title").text("Select " + (1 == a.count ? "an " : a.count + " ") + ta("attribute", a.count));
    Df(a.availableAttributes, !1)
}

function He(a) {
    R();
    t = !0;
    Qb = a.count;
    Rb = {};
    $("#game-announce-title").text("Select " + (1 == a.count ? "a " : a.count + " ") + ta("race", a.count));
    Df(a.availableRaces, !0)
}

function Df(a, b) {
    for (var c = $("#game-announce-list"), d = 0; d < (b ? 24 : 7); ++d) {
        var e = 1 << d;
        if (e & a) {
            var g = xa.clone();
            g.find(".game-announce-label").text(b ? Ef[e] : Ff[e]);
            g.find(".game-announce-input").data("option-value", e).change(function() {
                Rb[$(this).data("option-value")] = this.checked;
                var a = 0,
                    b = 0,
                    c;
                for (c in Rb) Rb[c] && (a |= c, ++b);
                b === Qb && (P(a), N())
            });
            g.appendTo(c)
        }
    }
    $("#game-announce-window").fadeIn(250)
}

function Ie(a) {
    R();
    t = !0;
    Vc(a.numbers, !1, !1)
}

function Je(a) {
    R();
    t = !0;
    kb = a.declarableType;
    lb = a.opcodes;
    $("#game-announce-card-window").fadeIn(250)
}

function sc() {
    var a = $("#game-announce-card-list");
    a.empty();
    var b = qa($("#game-announce-card-text").val());
    if (0 !== b.length) {
        var c = [],
            d = parseInt(b, 10);
        isNaN(d) || (d = X[d]) && Gf(d) && c.push(d);
        if (0 === c.length)
            for (var e in X) d = X[e], Gf(d) && (d.Z === b ? c.unshift(d) : 3 <= b.length && -1 !== d.Z.indexOf(b) && c.push(d));
        for (b = 0; b < c.length && 10 > b; ++b) Hf(a, c[b])
    }
}

function Gf(a) {
    if (0 < a.A || a.type & U.U || 0 !== kb && !(a.type & kb)) return !1;
    if (lb && 0 < lb.length) {
        for (var b = lb, c = [], d = 0; d < b.length; ++d) {
            var e = b[d];
            switch (e) {
                case If:
                    if (2 <= c.length) {
                        e = c.pop();
                        var g = c.pop();
                        c.push(g + e)
                    }
                    break;
                case Jf:
                    2 <= c.length && (e = c.pop(), g = c.pop(), c.push(g + e));
                    break;
                case Kf:
                    2 <= c.length && (e = c.pop(), g = c.pop(), c.push(g + e));
                    break;
                case Lf:
                    2 <= c.length && (e = c.pop(), g = c.pop(), c.push(g + e));
                    break;
                case Mf:
                    2 <= c.length && (e = c.pop(), g = c.pop(), c.push(g & e));
                    break;
                case Nf:
                    2 <= c.length && (e = c.pop(), g = c.pop(), c.push(g |
                        e));
                    break;
                case Of:
                    1 <= c.length && (e = c.pop(), c.push(-e));
                    break;
                case Pf:
                    1 <= c.length && (e = c.pop(), c.push(0 === e ? 1 : 0));
                    break;
                case Qf:
                    1 <= c.length && (e = c.pop(), c.push(a.id === e ? 1 : 0));
                    break;
                case Rf:
                    if (1 <= c.length) {
                        g = c.pop();
                        e = g & 4095;
                        g &= 61440;
                        for (var k = !1, w = 0; w < a.za.length; ++w) {
                            var F = a.za[w],
                                fb = F & 61440;
                            if ((F & 4095) === e && (0 === g || fb & g)) {
                                k = !0;
                                break
                            }
                        }
                        c.push(k ? 1 : 0)
                    }
                    break;
                case Sf:
                    1 <= c.length && (e = c.pop(), c.push(a.type & e ? 1 : 0));
                    break;
                case Tf:
                    1 <= c.length && (e = c.pop(), c.push(a.race & e ? 1 : 0));
                    break;
                case Uf:
                    1 <= c.length && (e = c.pop(),
                        c.push(a.H & e ? 1 : 0));
                    break;
                default:
                    c.push(e)
            }
        }
        if (1 !== c.length || 0 === c[0]) return !1
    }
    return !0
}

function Hf(a, b) {
    ya.clone().data("card-id", b.id).text(b.name).click(function() {
        P($(this).data("card-id"));
        N()
    }).appendTo(a)
}

function R() {
    return vb ? (vb = Ma = !1, x = [], $("#game-selection-list").empty(), $("#game-selection-window").hide(), Nc(), !0) : !1
}

function N() {
    if (Ma)
        for (var a = 0; a < x.length; ++a) x[a].Y = null;
    Nc();
    vb = Na = Oa = Ma = La = Ka = Ja = Fa = Ga = Da = Ea = Ca = t = !1;
    for (var b in n) n[b].addClass("engine-button-disabled").removeClass("engine-button-primary");
    Ha = {};
    Ia = {};
    ac();
    $(".game-field-zone-content img").removeClass("game-selectable-card").removeClass("game-selected-card");
    $("#game-yesno-window").hide();
    $("#game-position-window").hide();
    $("#game-option-list").empty();
    $("#game-option-window").hide();
    $("#game-selection-list").empty();
    $("#game-selection-window").hide();
    $("#game-announce-list").empty();
    $("#game-announce-window").hide();
    $("#game-announce-card-list").empty();
    $("#game-announce-card-text").val("");
    $("#game-announce-card-window").hide();
    $("#game-field-player-graveyard-activate").hide();
    $("#game-field-player-banished-activate").hide();
    $("#game-field-player-extra-activate").hide();
    $("#game-field-player-deck-activate").hide();
    Va = [];
    u = [];
    Wa = [];
    Xa = [];
    Ya = [];
    v = [];
    Za = [];
    $a = [];
    x = [];
    y = [];
    bb = [];
    ab = [];
    eb = db = cb = -1;
    gb = !1;
    ib = hb = -1;
    jb = [];
    $(".game-field-zone-selectable").removeClass("game-field-zone-selectable");
    $(".game-field-zone-selected").removeClass("game-field-zone-selected");
    Pa = !1;
    Qa = null;
    Sa = Ra = -1
}

function M(a, b) {
    K({
        type: "GameSendAction",
        action: a,
        index: b || 0
    })
}

function P(a) {
    K({
        type: "GameSendResponse",
        response: a
    })
}

function K(a) {
    window.Debug && console.log(a);
    null !== G && G.send(JSON.stringify(a))
}
var jd, dd;

function ed() {
    $("#options-area").hide();
    $("#options-window").show()
}

function fd() {
    $("#options-area").show();
    $("#options-window").hide()
}

function gd() {
    for (var a in dd) {
        var b = dd[a].defaultValue;
        "bar" === dd[a].type ? ($("#options-" + a + "-range").val(b), $("#options-" + a + "-value").text(b + "%")) : "check" === dd[a].type && $("#options-" + a).prop("checked", b);
        f.options[a] = b;
        jd && jd(a, b)
    }
    f.save()
}

function hd(a, b, c, d) {
    void 0 === f.options[a] && (f.options[a] = d);
    var e = f.options[a];
    dd[a] = {
        type: "bar",
        min: b,
        max: c,
        defaultValue: d,
        value: e
    };
    $("#options-" + a + "-range").attr("min", b).attr("max", c).attr("value", e).data("option", a).on("change", function() {
        var a = $(this).data("option"),
            b = $(this).val();
        $("#options-" + a + "-value").text(b + "%");
        f.options[a] = b;
        f.save();
        jd && jd(a, b)
    });
    $("#options-" + a + "-value").text(e + "%")
}

function id(a, b) {
    void 0 === f.options[a] && (f.options[a] = b);
    var c = f.options[a];
    dd[a] = {
        type: "check",
        defaultValue: b,
        value: c
    };
    $("#options-" + a).prop("checked", c).data("option", a).on("change", function() {
        var a = $(this).data("option"),
            b = $(this).prop("checked");
        f.options[a] = b;
        f.save();
        jd && jd(a, b)
    })
}

function bd(a) {
    return f.options[a]
}
$(function() {
    window.GameInfo && ia(cd)
});
var Z = {
    main: [],
    extra: [],
    side: [],
    ha: {
        main: 0,
        extra: 0,
        side: 0
    },
    selection: null,
    Ob: function() {
        for (var a = ["main", "extra", "side"], b = 0; b < a.length; ++b) {
            var c = a[b];
            window.Deck[c] = [];
            for (var d = 0; d < Z[c].length; ++d) window.Deck[c].push(Z[c][d].data("id"))
        }
    },
    Fb: function() {
        Z.Lb = $("#editor-search-result-template").removeAttr("id")[0].outerHTML;
        Z.xa = $("#editor-search-results").empty();
        Z.ga("main");
        Z.ga("extra");
        Z.ga("side");
        $("#editor-save-button").click(Z.save);
        $("#editor-clear-button").click(Z.clear);
        $("#editor-sort-button").click(Z.sort);
        $("#editor-shuffle-button").click(Z.Mb);
        $("#editor-search-text").on("input", Z.Pb);
        $(window).on("mouseup", function(a) {
            if (1 === a.which && Z.selection) return Z.aa(), !1
        });
        $(window).mousemove(function(a) {
            Z.Ib = a.pageX;
            Z.Jb = a.pageY;
            Z.Ba()
        });
        $(window).resize(Z.Ca);
        Z.Ca()
    },
    ea: function() {
        var a = $("#editor-main-deck").width() / 10;
        return {
            width: a,
            height: 254 / 177 * a
        }
    },
    Eb: function(a) {
        for (var b = 0, c = ["main", "extra", "side"], d = 0; d < c.length; ++d)
            for (var e = c[d], g = 0; g < Z[e].length; ++g) Z[e][g].data("id") !== a && Z[e][g].data("alias") !==
                a || ++b;
        return b
    },
    O: function(a, b, c, d) {
        var e = X[a];
        if (e && !(e.type & U.U)) {
            var g = !1;
            if (e.type & U.S || e.type & U.T || e.type & U.G || e.type & U.C) g = !0;
            if (!(g && "main" === b || !g && "extra" === b || Z[b].length >= ("main" === b ? 60 : 15) || (g = d ? 3 : Vf(0 !== e.A ? e.A : e.id), g = 3, Z.Eb(e.A ? e.A : e.id) >= g))) {
                g = Z[b];
                var k = $("#editor-" + b + "-deck");
                d = $("<img>").css("margin-right", Z.ha[b]).addClass("editor-card-small");
                l(d, a);
                d.mouseover(function() {
                    Cc($(this).data("id"))
                });
                d.mousedown(function(a) {
                    if (1 == a.which) {
                        a = $(this).data("id");
                        var b = $(this).data("location"),
                            c = $(this).parent().children().index($(this));
                        Z.P(b, c);
                        Z.ya(a);
                        return !1
                    }
                    if (3 == a.which) return !1
                });
                d.mouseup(function(a) {
                    if (1 == a.which && Z.selection) {
                        a = $(this).data("location");
                        var b = $(this).parent().children().index($(this));
                        Z.O(Z.selection.data("id"), a, b);
                        Z.aa();
                        return !1
                    }
                });
                d.on("contextmenu", function() {
                    var a = $(this).data("location"),
                        b = $(this).parent().children().index($(this));
                    Z.P(a, b);
                    return !1
                });
                d.data("id", a);
                d.data("alias", e.A);
                d.data("location", b); - 1 === c ? (k.append(d), g.push(d)) : (0 === c && 0 == k.children().length ?
                    k.append(d) : k.children().eq(c).before(d), g.splice(c, 0, d));
                g = Vf(0 !== e.A ? e.A : e.id);
                3 !== g ? (a = 2 === g ? "banlist-semilimited.png" : 1 === g ? "banlist-limited.png" : "banlist-banned.png", a = $("<img>").attr("src", "assets/images/" + a), d.data("banlist", a), $("#editor-banlist-icons").append(a)) : d.data("banlist", null);
                Z.Aa(b);
                Z.N(b)
            }
        }
    },
    P: function(a, b) {
        var c = Z[a],
            d = c[b].data("banlist");
        d && d.remove();
        c[b].remove();
        c.splice(b, 1);
        Z.Aa(a);
        Z.N(a)
    },
    ya: function(a) {
        Z.aa();
        var b = Z.ea();
        Z.selection = $("<img>").css("position", "absolute").css("left",
            0).css("top", 0).css("width", b.width + "px").css("height", b.height + "px").data("id", a);
        l(Z.selection, a);
        Z.selection.appendTo($("body"));
        Z.Ba()
    },
    Ba: function() {
        Z.selection && Z.selection.css("left", Z.Ib + 3).css("top", Z.Jb + 3)
    },
    aa: function() {
        Z.selection && (Z.selection.remove(), Z.selection = null)
    },
    ga: function(a) {
        for (var b = 0; b < Deck[a].length; ++b) Z.O(Deck[a][b], a, -1, !0);
        b = $("#editor-" + a + "-deck");
        b.data("location", a);
        b.mouseup(function(a) {
            if (Z.selection && 1 == a.which) return a = $(this).data("location"), Z.O(Z.selection.data("id"),
                a, -1), Z.aa(), !1
        })
    },
    Pb: function() {
        Z.Db();
        var a = qa($("#editor-search-text").val());
        if (0 !== a.length) {
            var b = [],
                c = [],
                d = parseInt(a, 10);
            isNaN(d) || (d = X[d]) && Z.ua(d) && c.push(d);
            if (0 === c.length)
                for (var e in X) d = X[e], Z.ua(d) && (d.Z === a ? b.push(d) : 3 <= a.length && -1 !== d.Z.indexOf(a) && c.push(d));
            b.sort(Z.fa);
            c.sort(Z.fa);
            for (a = 0; a < b.length && 30 > a; ++a) Z.la(b[a].id);
            for (b = 0; b < c.length && 30 > b; ++b) Z.la(c[b].id)
        }
    },
    ua: function(a) {
        return a.type & U.U ? !1 : !0
    },
    la: function(a) {
        var b = X[a];
        a = $(Z.Lb);
        a.find(".template-name").text(b.name);
        l(a.find(".template-picture"), b.id);
        if (b.type & U.L) a.find(".template-if-spell").remove(), a.find(".template-level").text(b.level), a.find(".template-atk").text(b.attack), a.find(".template-def").text(b.i), a.find(".template-race").text(Ef[b.race]), a.find(".template-attribute").text(Ff[b.H]);
        else {
            a.find(".template-if-monster").remove();
            var c = [];
            for (e in U) {
                var d = U[e];
                b.type & d && c.push(Wf[d])
            }
            a.find(".template-types").text(c.join("|"))
        }
        a.data("id", b.id);
        a.mouseover(function() {
            Cc($(this).data("id"))
        });
        a.mousedown(function(a) {
            if (1 ==
                a.which) return a = $(this).data("id"), Z.ya(a), !1;
            if (3 == a.which) return !1
        });
        a.on("contextmenu", function() {
            var a = $(this).data("id");
            a = X[a];
            var b = "main";
            if (a.type & U.S || a.type & U.T || a.type & U.G || a.type & U.C) b = "extra";
            Z.O($(this).data("id"), b, -1);
            return !1
        });
        var e = a.find(".editor-search-banlist-icon");
        b = Vf(0 !== b.A ? b.A : b.id);
        3 !== b ? e.attr("src", "assets/images/" + (2 === b ? "banlist-semilimited.png" : 1 === b ? "banlist-limited.png" : "banlist-banned.png")) : e.remove();
        Z.xa.append(a)
    },
    Ca: function() {
        var a = $("#card-column").position().top;
        $("#card-column").css("max-height", $(window).height() - a - 25);
        $("#editor-decks-column").css("max-height", $(window).height() - a - 25);
        $("#editor-search-column").css("max-height", $(window).height() - a - 25);
        a = Z.ea().height;
        $("#editor-main-deck").css("height", 4 * a + "px");
        $("#editor-extra-deck").css("height", a + "px");
        $("#editor-side-deck").css("height", a + 3 + "px");
        Z.N("main");
        Z.N("extra");
        Z.N("side")
    },
    Aa: function(a) {
        var b = "0";
        Z[a].length > ("main" == a ? 60 : 15) ? b = "main" == a ? "-4.05%" : "-4.72%" : Z[a].length > ("main" == a ? 40 : 10) &&
            (b = "-3.6%");
        if (Z.ha[a] !== b) {
            Z.ha[a] = b;
            for (var c = 0; c < Z[a].length; ++c) Z[a][c].css("margin-right", b)
        }
    },
    N: function(a) {
        var b = "main" === a ? 40 : 10,
            c = $("#editor-" + a + "-deck"),
            d = Z.ea(),
            e = Z[a].length > b ? 15 : 10;
        b = Z[a].length > b ? -.036 * $("#editor-main-deck").width() : 0;
        for (var g = 0; g < Z[a].length; ++g) {
            var k = Z[a][g].data("banlist");
            k && (k.css("left", c.offset().left + g % e * (d.width + b) + "px"), k.css("top", c.offset().top + d.height * Math.floor(g / e) + "px"), k.css("width", .4 * d.width + "px"))
        }
    },
    clear: function() {
        for (var a = ["main", "extra", "side"],
                b = 0; b < a.length; ++b) {
            for (var c = a[b], d = 0; d < Z[c].length; ++d) {
                var e = Z[c][d].data("banlist");
                e && e.remove();
                Z[c][d].remove()
            }
            Z[c] = []
        }
    },
    save: function() {
        Z.Ob();
        $("#editor-save-button").addClass("engine-button-disabled");
        $.post("api/update-deck.php", {
            id: window.Deck.id,
            deck: JSON.stringify({
                main: window.Deck.main,
                extra: window.Deck.extra,
                side: window.Deck.side
            })
        }, function(a) {
            a.success || "no_changes" === a.error ? $("#editor-save-button").text("Saved!").delay(2E3).queue(function() {
                    $(this).removeClass("engine-button-disabled").text("Save").dequeue()
                }) :
                $("#editor-save-button").text("Error while saving: " + a.error).delay(5E3).queue(function() {
                    $(this).removeClass("engine-button-disabled").text("Save").dequeue()
                })
        }, "json")
    },
    sort: function() {
        Z.pa();
        for (var a = ["main", "extra", "side"], b = 0; b < a.length; ++b) {
            var c = a[b];
            Z[c].sort(function(a, b) {
                return Z.fa(X[a.data("id")], X[b.data("id")])
            });
            Z.N(c)
        }
        Z.ma()
    },
    fa: function(a, b) {
        if ((a.type & 7) != (b.type & 7)) return (a.type & 7) - (b.type & 7);
        if (a.type & U.L) {
            var c = a.type & 75505856 ? a.type & 75505857 : a.type & 49,
                d = b.type & 75505856 ? b.type &
                75505857 : b.type & 49;
            if (c != d) return c - d;
            if (a.level != b.level) return b.level - a.level;
            if (a.attack != b.attack) return b.attack - a.attack;
            if (a.i != b.i) return b.i - a.i
        } else if ((a.type & 4294967288) != (b.type & 4294967288)) return (a.type & 4294967288) - (b.type & 4294967288);
        return a.id - b.id
    },
    Mb: function() {
        Z.pa();
        for (var a = ["main", "extra", "side"], b = 0; b < a.length; ++b) {
            var c = a[b];
            Z.Nb(Z[c]);
            Z.N(c)
        }
        Z.ma()
    },
    Nb: function(a) {
        for (var b = a.length; 0 < b;) {
            var c = Math.floor(Math.random() * b);
            b--;
            var d = a[b];
            a[b] = a[c];
            a[c] = d
        }
    },
    ma: function() {
        for (var a = ["main", "extra", "side"], b = 0; b < a.length; ++b)
            for (var c = a[b], d = $("#editor-" + c + "-deck"), e = 0; e < Z[c].length; ++e) Z[c][e].appendTo(d)
    },
    pa: function() {
        for (var a = ["main", "extra", "side"], b = 0; b < a.length; ++b)
            for (var c = a[b], d = 0; d < Z[c].length; ++d) Z[c][d].detach()
    },
    Db: function() {
        Z.xa.empty()
    }
};
$(function() {
    window.Deck && ia(Z.Fb)
});

function la() {
    this.b = {};
    this.volume = 1
}

function Ub() {
    var a = fa;
    V(a, "activate", 2);
    V(a, "attack");
    V(a, "draw", 3);
    V(a, "life-damage", 2);
    V(a, "life-recover", 2);
    V(a, "next-phase");
    V(a, "next-turn");
    V(a, "set", 2);
    V(a, "shuffle");
    V(a, "summon");
    V(a, "summon-flip");
    V(a, "summon-special", 2);
    V(a, "equip", 2);
    V(a, "dice-roll");
    V(a, "coin-flip");
    V(a, "counter", 2)
}
la.prototype.play = function(a) {
    if (!(.001 > this.volume) && a in this.b)
        for (var b = 0; b < this.b[a].length; ++b)
            if (this.b[a][b].paused) {
                this.b[a][b].volume = this.volume;
                this.b[a][b].play();
                break
            }
};

function V(a, b, c) {
    c = void 0 !== c ? c : 1;
    a.b[b] = [];
    for (var d = 0; d < c; ++d) {
        var e = new Audio(h("sounds/" + b + ".wav"));
        a.b[b].push(e)
    }
};

function na() {
    this.b = []
}
na.prototype.load = function(a) {
    jQuery.ajaxSetup({
        beforeSend: function(a) {
            a.overrideMimeType && a.overrideMimeType("application/json")
        }
    });
    var b = this;
    jQuery.getJSON(h("data/banlists.json?v=28"), function(c) {
        b.b = c.banlists;
        a && a()
    })
};

function Le(a) {
    for (var b = ha, c = 0; c < b.b.length; ++c)
        if (b.b[c].hash == a) return c;
    return -1
}

function Vf(a) {
    var b = ha;
    return -1 !== b.b[0].bannedIds.indexOf(a) ? 0 : -1 !== b.b[0].limitedIds.indexOf(a) ? 1 : -1 !== b.b[0].semiLimitedIds.indexOf(a) ? 2 : 3
};

function Xf(a) {
    this.id = a.id;
    this.A = a.als || 0;
    this.za = a.sc || [];
    this.type = a.typ || 0;
    this.attack = a.atk || 0;
    this.i = a.def || 0;
    var b = a.lvl || 0;
    this.race = a.rac || 0;
    this.H = a.att || 0;
    this.level = b & 255
};
var X;

function oa(a) {
    jQuery.ajaxSetup({
        beforeSend: function(a) {
            a.overrideMimeType && a.overrideMimeType("application/json")
        }
    });
    jQuery.getJSON(h("data/cards.json?v=82"), function(b) {
        X = {};
        for (var c = 0; c < b.cards.length; ++c) {
            var d = b.cards[c];
            X[d.id] = new Xf(d)
        }
        jQuery.getJSON(h("data/cards_en.json?v=82"), function(b) {
            for (var c = 0; c < b.texts.length; ++c) {
                var d = b.texts[c];
                if (X[d.id]) {
                    var e = X[d.id];
                    e.name = d.n;
                    e.description = d.d;
                    e.ra = d.s || [];
                    e.Z = qa(e.name)
                }
            }
            a && a()
        })
    })
};
var O = {
        f: 1,
        j: 2,
        g: 4,
        m: 8,
        v: 16,
        u: 32,
        h: 64,
        B: 128,
        da: 12,
        Ub: 256,
        Vb: 512
    },
    nc = 1,
    oc = 2,
    pc = 4,
    qc = 8,
    U = {
        L: 1,
        nb: 2,
        tb: 4,
        cb: 16,
        Sa: 32,
        S: 64,
        kb: 128,
        ub: 256,
        pb: 512,
        wb: 1024,
        Qa: 2048,
        vb: 4096,
        T: 8192,
        U: 16384,
        ib: 65536,
        Ha: 131072,
        Ta: 262144,
        Va: 524288,
        Ia: 1048576,
        Za: 2097152,
        sb: 4194304,
        G: 8388608,
        eb: 16777216,
        qb: 33554432,
        C: 67108864
    },
    Yf = {
        Ra: 1,
        yb: 2,
        Xa: 4,
        zb: 8,
        ab: 16,
        La: 32,
        Na: 64
    },
    Zf = {
        xb: 1,
        ob: 2,
        Ua: 4,
        Wa: 8,
        Cb: 16,
        bb: 32,
        Ea: 64,
        hb: 128,
        lb: 256,
        Ab: 512,
        fb: 1024,
        $a: 2048,
        rb: 4096,
        Pa: 8192,
        Fa: 16384,
        Ga: 32768,
        Ma: 65536,
        Ya: 131072,
        mb: 262144,
        jb: 524288,
        gb: 1048576,
        Oa: 2097152,
        Ja: 4194304,
        Bb: 8388608,
        Ka: 16777216
    },
    Jc = 1,
    Kc = 2,
    Lc = 4,
    Ec = 8,
    Fc = 32,
    Gc = 64,
    Hc = 128,
    Ic = 256,
    L = {
        ia: 1,
        ka: 2,
        ja: 4,
        J: 8,
        Rb: 16,
        Sb: 32,
        Tb: 64,
        Qb: 128,
        X: 256,
        R: 512
    },
    If = 1073741824,
    Jf = 1073741825,
    Kf = 1073741826,
    Lf = 1073741827,
    Mf = 1073741828,
    Nf = 1073741829,
    Of = 1073741830,
    Pf = 1073741831,
    Qf = 1073742080,
    Rf = 1073742081,
    Sf = 1073742082,
    Tf = 1073742083,
    Uf = 1073742084,
    gc = 0,
    hc = 1,
    ic = 2,
    jc = 3,
    kc = 4,
    Uc = 5,
    bc = 6,
    ec = 7,
    Tc = 0,
    mc = 1,
    cc = 2,
    dc = 3;
var Wf = {},
    Ff = {},
    Ef = {},
    sf = {},
    Bf = {},
    ff = {},
    rf, xf;

function ma() {
    for (var a in U) {
        var b = U[a];
        Wf[b] = $f[a]
    }
    Wf[0] = "?";
    for (a in Yf) b = Yf[a], Ff[b] = ag[a];
    Ff[0] = "?";
    for (a in Zf) b = Zf[a], Ef[b] = bg[a];
    Ef[0] = "?";
    for (a in O) b = O[a], Bf[b] = cg[a];
    for (a in L) b = L[a], ff[b] = dg[a];
    sf = eg;
    rf = fg;
    xf = gg
}
var $f = {
        L: "Monster",
        nb: "Spell",
        tb: "Trap",
        cb: "Normal",
        Sa: "Effect",
        S: "Fusion",
        kb: "Ritual",
        ub: "Trap-Monster",
        pb: "Spirit",
        wb: "Union",
        Qa: "Dual",
        vb: "Tuner",
        T: "Synchro",
        U: "Token",
        ib: "Quick-Play",
        Ha: "Continuous",
        Ta: "Equip",
        Va: "Field",
        Ia: "Counter",
        Za: "Flip",
        sb: "Toon",
        G: "Xyz",
        eb: "Pendulum",
        qb: "SpSummon",
        C: "Link"
    },
    ag = {
        Ra: "Earth",
        yb: "Water",
        Xa: "Fire",
        zb: "Wind",
        ab: "Light",
        La: "Dark",
        Na: "Divine"
    },
    bg = {
        xb: "Warrior",
        ob: "Spellcaster",
        Ua: "Fairy",
        Wa: "Fiend",
        Cb: "Zombie",
        bb: "Machine",
        Ea: "Aqua",
        hb: "Pyro",
        lb: "Rock",
        Ab: "Winged Beast",
        fb: "Plant",
        $a: "Insect",
        rb: "Thunder",
        Pa: "Dragon",
        Fa: "Beast",
        Ga: "Beast-Warrior",
        Ma: "Dinosaur",
        Ya: "Fish",
        mb: "Sea Serpent",
        jb: "Reptile",
        gb: "Psychic",
        Oa: "Divine-Beast",
        Ja: "Creator God",
        Bb: "Wyrm",
        Ka: "Cyberse"
    },
    cg = {
        f: "Deck",
        j: "Hand",
        g: "Monster Zone",
        m: "Spell/Trap Zone",
        v: "Graveyard",
        u: "Banished Zone",
        h: "Extra Deck"
    },
    dg = {
        ia: "Draw Phase",
        ka: "Standby Phase",
        ja: "Main Phase 1",
        J: "Battle Phase",
        X: "Main Phase 2",
        R: "End Phase"
    },
    eg = {
        1: "Normal Summon",
        2: "Special Summon",
        3: "Flip Summon",
        4: "Normal Summoned",
        5: "Special Summoned",
        6: "Flip Summoned",
        7: "Activate",
        10: "Remove the Counter(s)",
        11: "Pay LP",
        12: "Remove the Material(s)",
        20: "Draw Phase",
        21: "Standby Phase",
        22: "Main Phase",
        23: "End of Main Phase",
        24: "Battle Phase",
        25: "End of Battle Phase",
        26: "End Phase",
        27: "Before the Draw",
        28: "Start Step of Battle Phase",
        30: "Replay, do you want to continue the Battle?",
        31: "Do you want to Attack Directly?",
        40: "Damage Step",
        41: "Calculating Damage",
        42: "End of Damage Step",
        43: "At the start of the Damage Step",
        60: "Heads",
        61: "Tails",
        62: "Heads\u00a0effect",
        63: "Tails\u00a0effect",
        64: "Gemini",
        70: "Monster Cards",
        71: "Spell Cards",
        72: "Trap Cards",
        80: "Entering the Battle Phase",
        81: "Entering the End Phase",
        90: "Normal Summon without tribute(s)?",
        91: "Use your additional Special Summon?",
        92: "Use Opponent Monster",
        93: "Do you want to continue to choose the material?",
        1050: "Monster",
        1051: "Spell",
        1052: "Trap",
        1054: "Normal",
        1055: "Effect",
        1056: "Fusion",
        1057: "Ritual",
        1058: "Trap\u00a0Monsters",
        1059: "Spirit",
        1060: "Union",
        1061: "Gemini",
        1062: "Tuner",
        1063: "Synchro",
        1066: "Quick-Play",
        1067: "Continuous",
        1068: "Equip",
        1069: "Field",
        1070: "Counter",
        1071: "Flip",
        1072: "Toon",
        1073: "Xyz",
        1074: "Pendulum",
        1075: "Special summon",
        1076: "Link",
        1064: "Token",
        1150: "Activate",
        1151: "Normal\u00a0Summon",
        1152: "Special\u00a0Summon",
        1153: "Set",
        1154: "Flip\u00a0Summon",
        1155: "To\u00a0Defense",
        1156: "To\u00a0Attack",
        1157: "Attack",
        1158: "View",
        1159: "S/T\u00a0Set",
        1160: "Put\u00a0in\u00a0Pendulum\u00a0Zone",
        1161: "Resolve\u00a0effect",
        1162: "Reset\u00a0effect",
        1163: "Spiritual call",
        1213: "Yes",
        1214: "No"
    },
    fg = {
        0: "Surrendered",
        1: "LP reached 0",
        2: "Cards can't be drawn",
        3: "Time limit up",
        4: "Lost connection",
        16: "Victory by the effect of Exodia",
        17: "Victory by the effect of Final Countdown",
        18: "Victory by the effect of Vennominaga",
        19: "Victory by the effect of Horakhty",
        20: "Victory by the effect of Exodius",
        21: "Victory by the effect of Destiny Board",
        22: "Victory by the effect of Last Turn",
        23: "Victory by the effect of Number 88: Gimmick Puppet - Destiny Leo",
        24: "Victory by the effect of Number C88: Gimmick Puppet Disaster Leo",
        25: "Victory by the effect of Jackpot 7",
        26: "Victory by the effect of Relay Soul",
        27: "Victory by the effect of Ghostrick Angel of Mischief",
        28: "Victory by the effect of Phantasm Spiral Assault",
        73: "Victory by the effect of Deuce"
    },
    gg = {
        1: "Spell\u00a0Counter",
        4098: "Wedge\u00a0Counter",
        3: "Bushido\u00a0Counter",
        4: "Psychic\u00a0Counter",
        5: "Shine\u00a0Counter",
        6: "Gem\u00a0Counter",
        7: "Counter(Colosseum\u00a0Cage\u00a0of\u00a0the\u00a0Gladiator\u00a0Beasts)",
        8: "D\u00a0Counter",
        4105: "Venom\u00a0Counter",
        10: "Genex\u00a0Counter",
        11: "Counter(Ancient\u00a0Gear\u00a0Castle)",
        12: "Thunder\u00a0Counter",
        13: "Greed\u00a0Counter",
        4110: "A-Counter",
        15: "Worm\u00a0Counter",
        16: "Black\u00a0Feather\u00a0Counter",
        17: "Hyper\u00a0Venom\u00a0Counter",
        18: "Karakuri\u00a0Counter",
        19: "Chaos\u00a0Counter",
        20: "Counter(Miracle\u00a0Jurassic\u00a0Egg)",
        4117: "Ice\u00a0Counter",
        22: "Spellstone\u00a0Counter",
        23: "Nut\u00a0Counter",
        24: "Flower\u00a0Counter",
        4121: "Fog\u00a0Counter",
        26: "Double\u00a0Counter",
        27: "Clock\u00a0Counter",
        28: "D\u00a0Counter",
        29: "Junk\u00a0Counter",
        30: "Gate\u00a0Counter",
        31: "Counter(B.E.S.)",
        32: "Plant\u00a0Counter",
        4129: "Guard\u00a0Counter",
        34: "Dragonic\u00a0Counter",
        35: "Ocean\u00a0Counter",
        4132: "String\u00a0Counter",
        37: "Chronicle\u00a0Counter",
        38: "Counter(Metal\u00a0Shooter)",
        39: "Counter(Des\u00a0Mosquito)",
        40: "Counter\u00a0(Dark\u00a0Catapulter)",
        41: "Counter(Balloon\u00a0Lizard)",
        4138: "Counter(Magic\u00a0Reflector)",
        43: "Destiny\u00a0Counter",
        44: "You\u00a0Got\u00a0It\u00a0Boss!\u00a0Counter",
        45: "Counter(Kickfire)",
        46: "Shark\u00a0Counter",
        47: "Pumpkin\u00a0Counter",
        48: "Feel\u00a0the\u00a0Flow\u00a0Counter",
        49: "Rising\u00a0Sun\u00a0Counter",
        50: "Balloon\u00a0Counter",
        51: "Yosen\u00a0Counter",
        52: "Counter(BOXer)",
        53: "Symphonic\u00a0Counter",
        54: "Performage\u00a0Counter",
        55: "Kaiju\u00a0Counter",
        4152: "Cubic\u00a0Counter",
        4153: "Zushin\u00a0Counter",
        64: "Counter(Number\u00a051:\u00a0Finish\u00a0Hold\u00a0the\u00a0Amazing)",
        4161: "Predator\u00a0Counter",
        66: "Counter(Fire\u00a0Cracker)",
        67: "Defect Counter",
        144: "Maiden Counter",
        145: "Speed Counter",
        146: "Plasma Counter",
        147: "Sacred Counter",
        148: "Pumpkin Counter",
        149: "Rising Sun Counter"
    };

function ka() {
    this.load()
}
ka.prototype.load = function() {
    var a = localStorage.getItem("engine-storage");
    if (a) {
        a = JSON.parse(a);
        for (var b in a) this[b] = a[b]
    }
};
ka.prototype.save = function() {
    var a = JSON.stringify(this);
    localStorage.setItem("engine-storage", a)
};

function ja() {
    this.w = 0;
    this.b = null
}

function Cc(a) {
    var b = ea;
    if (!(0 >= a) && b.w !== a && (b.w = a, a = X[a])) {
        $("#card-name").text(a.name);
        $("#card-description").html(a.description.replace(/\n/g, "<br>"));
        $("#card-id").text(a.A ? a.id + " [" + a.A + "]" : a.id);
        l($("#card-picture"), a.id);
        b = [];
        for (var c in U) {
            var d = U[c];
            a.type & d && b.push(Wf[d])
        }
        $(".card-types").text(b.join("|"));
        if (a.type & U.L)
            if ($("#card-if-monster").show(), $("#card-if-spell").hide(), $("#card-race").text(Ef[a.race]), $("#card-attribute").text(Ff[a.H]), $("#card-atk").text(a.attack), a.type & U.C) $("#card-def").text("LINK-" +
                a.level), c = "", a.i & Gc && (c += "&#8598;"), a.i & Hc && (c += "&#8593;"), a.i & Ic && (c += "&#8599;"), a.i & Ec && (c += "&#8592;"), a.i & Fc && (c += "&#8594;"), a.i & Jc && (c += "&#8601;"), a.i & Kc && (c += "&#8595;"), a.i & Lc && (c += "&#8600;"), $("#card-level").html(c);
            else {
                $("#card-def").text(a.i);
                c = "";
                for (b = 0; b < a.level; ++b) c += "&#9733;";
                $("#card-level").html(c)
            }
        else $("#card-if-monster").hide(), $("#card-if-spell").show()
    }
}

function Dc(a, b) {
    var c = ea;
    if (c.b !== b && (c.b = b, null !== b))
        if ((c = X[b.code]) ? a.find(".card-name").text(c.name) : a.find(".card-name").text("id: " + b.code), b.type & U.L ? (a.find(".card-if-monster").show(), a.find(".card-race").text(Ef[b.race]), a.find(".card-attribute").text(Ff[b.H]), a.find(".card-attack").text(b.attack), a.find(".card-defence").text(b.type & U.C ? "LINK-" + b.V : b.i), a.find(".card-level").html(b.type & U.G ? b.W : b.level)) : a.find(".card-if-monster").hide(), b.type & U.C ? a.find(".card-if-not-link").hide() : a.find(".card-if-not-link").show(),
            0 < Object.keys(b.F).length) {
            c = "";
            var d = !0,
                e;
            for (e in b.F) d || (c += "<br>"), d = !1, c += b.F[e] + " \u00d7 " + xf[e];
            a.find(".card-counters").text(c).show()
        } else a.find(".card-counters").hide()
};

function Y(a, b) {
    this.code = a || 0;
    this.A = 0;
    this.type = U.L;
    this.controller = this.ca = this.i = this.attack = this.race = this.H = this.W = this.level = 0;
    this.location = O.f;
    this.D = 0;
    this.position = b || nc;
    this.sa = !1;
    this.l = [];
    this.F = {};
    this.wa = this.V = 0;
    this.M = null;
    this.a = $("<img>").addClass("game-field-card");
    this.w = this.K = this.b = null;
    this.I = 0
}

function hg(a, b, c) {
    a = 1 == a ? 180 : 0;
    b & O.g && c & 12 && (a -= 90);
    return a
}

function cf(a) {
    a.ta = a.a.offset();
    a.va = a.Hb;
    a.Kb = a.Gb
}

function df(a, b, c, d, e) {
    var g = a.a.offset(),
        k = a.location & O.j || c & 5 ? b : 0,
        w = hg(a.controller, a.location, c) - a.va,
        F = !1;
    a.Kb !== k && (F = !0);
    null !== a.b && (a.b.hide(), a.K.hide());
    a.code = b;
    a.position = c;
    $("<div />").animate({
        height: 1
    }, {
        duration: d,
        step: function(b, c) {
            b = c.pos;
            c = "translate(" + (a.ta.left - g.left) * (1 - b) + "px, " + (a.ta.top - g.top) * (1 - b) + "px)";
            c += " rotate(" + (a.va + w * b) + "deg)";
            F && (.5 < b && ig(a, k), c += " scalex(" + Math.abs(1 - 2 * b) + ")");
            a.a.css("transform", c)
        },
        complete: function() {
            null !== a.b && (a.b.show(), a.K.show());
            a.a.css("position",
                "");
            nf(a);
            e()
        }
    })
}

function hf(a) {
    var b = 300 * C,
        c = W;
    a.a.css("opacity", 0).animate({
        opacity: 1
    }, {
        duration: b,
        complete: c
    })
}
Y.prototype.fadeOut = function(a, b) {
    this.a.css("opacity", 1).animate({
        opacity: 0
    }, {
        duration: a,
        complete: b
    })
};

function jf(a, b) {
    a.code = b;
    (b = X[b]) ? (a.type = b.type, a.level = a.type & U.G ? 0 : b.level, a.W = a.type & U.G ? b.level : 0, a.V = a.type & U.C ? b.level : 0, a.H = b.H, a.race = b.race, a.attack = b.attack, a.i = b.i) : (a.type = U.L, a.level = 0, a.W = 0, a.V = 0, a.H = 0, a.race = 0, a.attack = 0, a.i = 0)
}

function qf(a, b) {
    a.a.animate({
        opacity: .5
    }, {
        duration: 100 * C
    }).animate({
        opacity: 1
    }, {
        duration: 100 * C
    }).animate({
        opacity: .5
    }, {
        duration: 100 * C
    }).animate({
        opacity: 1
    }, {
        duration: 100 * C
    }).animate({
        opacity: .5
    }, {
        duration: 100 * C
    }).animate({
        opacity: 1
    }, {
        duration: 100 * C,
        complete: b
    })
}
Y.prototype.setData = function(a) {
    this.A = a.alias;
    this.attack = a.attack;
    this.i = a.defence;
    this.level = a.level;
    this.W = a.rank;
    this.H = a.attribute;
    this.race = a.race;
    this.ca = a.owner;
    this.type = a.type;
    this.sa = a.isDisabled;
    this.V = a.link;
    this.wa = a.linkMarkers;
    this.code !== a.code && (this.code = a.code, jg(this));
    null !== a.locationInfo && this.position !== a.locationInfo.position && (this.position = a.locationInfo.position, nf(this));
    kg(this);
    this.sa && this.location & O.da ? null === this.w && (this.w = $("<img>").addClass("game-card-negated").attr("src",
        h("images/negated.png")), this.M.append(this.w)) : null !== this.w && (this.w.remove(), this.w = null)
};

function lg(a, b) {
    a.D = b;
    mg(a);
    for (var c = 0; c < a.l.length; ++c) lg(a.l[c], b)
}

function mg(a) {
    a.a.data("sequence", a.D);
    if (a.location & O.f || a.location & O.v || a.location & O.u || a.location & O.h) {
        var b = 0 == a.controller ? 1 : -1;
        b *= a.location & O.h ? -1 : 1;
        a.a.css("left", b * a.D * .3 + "%");
        a.a.css("top", .3 * -a.D + "%")
    } else a.a.css("left", ""), a.a.css("top", "")
}

function ng(a, b) {
    null !== a.M && (a.M = null, b ? a.a.fadeOut(300 * C, "linear", function() {
        og(a)
    }) : og(a));
    for (b = 0; b < a.l.length; ++b) ng(a.l[b])
}

function og(a) {
    a.a.off("mouseover");
    a.a.off("mouseleave");
    a.a.off("click");
    a.a.detach();
    null !== a.b && (a.b.detach(), a.K.detach());
    null !== a.w && (a.w.remove(), a.w = null)
}

function pg(a, b) {
    ng(a, !1);
    if (-1 !== a.controller) {
        a.M = mf(m[a.controller], a.location & ~O.B, a.D);
        a.M.append(a.a);
        a.location === O.g && (null === a.b && (a.b = $("<p>").addClass("game-field-stats-text"), a.K = $("<p>")), a.M.append(a.b), a.M.append(a.K), 1 == a.controller ? (a.b.css("top", "0px").css("bottom", "auto"), a.K.css("top", "auto").css("bottom", "-10px").css("left", "35%").css("right", "auto")) : (a.b.css("top", "auto").css("bottom", "-10px"), a.K.css("top", "0px").css("bottom", "auto").css("left", "-35%").css("right", "auto")));
        mg(a);
        a.a.data("controller", a.controller).data("location", a.location);
        a.a.off("mouseover").off("mouseleave");
        if (a.location & O.j) a.a.on("mouseover", function() {
            var a = $(this).data("controller"),
                b = $(this).data("location"),
                e = $(this).data("sequence");
            Yb(a, b, e)
        }).on("mouseleave", function() {
            var a = $(this).data("controller"),
                b = $(this).data("location"),
                e = $(this).data("sequence");
            Zb(a, b, e)
        }).on("click", function() {
            var a = $(this).data("controller"),
                b = $(this).data("location"),
                e = $(this).data("sequence");
            $b(a, b, e)
        });
        else a.a.css("margin-left", ""), a.a.css("height", "");
        a.a.css("z-index", a.location & O.B ? "1" : a.location & O.j ? "3" : "2");
        b || (nf(a), kg(a))
    }
}

function nf(a) {
    var b = 1 == a.controller ? 180 : 0;
    a.location & O.g && a.position & 12 && (b -= 90);
    a.Hb = b;
    a.a.data("rotation", b);
    a.a.css("transform", "rotate(" + b + "deg)");
    jg(a)
}

function jg(a) {
    var b = a.location & O.j || a.position & 5 ? a.code : 0;
    a.a.data("code") !== b && (a.a.data("code", b), ig(a, b))
}

function kg(a) {
    a.location === O.g && 0 !== a.code && (a.b.text(a.attack + "/" + (a.type & U.C ? "L-" + a.V : a.i)), a.K.text(a.type & U.G ? "R" + a.W : a.type & U.C ? "" : "L" + a.level))
}

function ig(a, b) {
    a.Gb = b;
    if (0 === b) {
        var c;
        a: {
            b = a.ca;
            if (!Eb && (z ? c = b : c = 0 == b ? A : 1 - A, B[c].oa)) {
                c = "uploads/sleeves/" + B[c].oa;
                break a
            }
            c = ra(0)
        }
        sa(a.a, c)
    } else l(a.a, b)
};

function Vb(a) {
    this.o = "player" == a ? 0 : 1;
    this.namespace = "#game-field-" + a + "-";
    this.b = {};
    this.c = {};
    this.w = {};
    qg(this, O.j, "hand");
    qg(this, O.f, "deck");
    qg(this, O.h, "extra");
    qg(this, O.v, "graveyard");
    qg(this, O.u, "banished");
    rg(this, O.g, "monster", 4 <= Ab ? 7 : 5);
    rg(this, O.m, "spell", 4 <= Ab ? 6 : 8)
}
Vb.prototype.clear = function() {
    pf(this, O.j, !1);
    pf(this, O.f, !1);
    pf(this, O.h, !1);
    pf(this, O.v, !1);
    pf(this, O.u, !1);
    pf(this, O.g, !1);
    pf(this, O.m, !1)
};
Vb.prototype.O = function(a, b, c, d) {
    a.controller = this.o;
    a.location = b;
    for (var e = 0; e < a.l.length; ++e) a.l[e].controller = a.controller, a.l[e].location = a.location | O.B;
    b & O.B ? (b &= ~O.B, this.c[b][c].l.push(a)) : b & O.g || b & O.m ? this.c[b][c] = a : -1 === c ? this.c[b].push(a) : this.c[b].splice(c, 0, a);
    sg(this, b);
    pg(a, d);
    for (e = 0; e < a.l.length; ++e) pg(a.l[e]);
    tg(this, b);
    b & O.j && Zc(this);
    ug(this, b)
};
Vb.prototype.P = function(a, b) {
    var c = a.location,
        d = a.D;
    a.controller = -1;
    a.D = -1;
    a.location = -1;
    if (c & O.B) {
        c &= ~O.B;
        var e = this.c[c][d].l.indexOf(a); - 1 < e && this.c[c][d].l.splice(e, 1)
    } else
        for (c & O.g || c & O.m ? this.c[c][d] = null : (this.c[c].splice(d, 1), sg(this, c)), d = 0; d < a.l.length; ++d) a.l[d].controller = -1, a.l[d].D = -1, a.l[d].location = -1, pg(a.l[d]);
    pg(a, b);
    c & O.j && Zc(this);
    ug(this, c)
};

function pf(a, b, c) {
    for (var d = 0; d < a.c[b].length; ++d) {
        var e = a.c[b][d];
        e && (e.controller = -1, e.D = -1, e.location = -1, ng(e, c));
        if (b === O.g || b === O.m) a.c[b][d] = null
    }
    b !== O.g && b !== O.m && (a.c[b] = []);
    b & O.j && Zc(a);
    ug(a, b)
}

function sg(a, b) {
    for (var c = 0; c < a.c[b].length; ++c) null !== a.c[b][c] && lg(a.c[b][c], c)
}

function tg(a, b) {
    if (b != O.g && b != O.m) {
        var c = 1 == a.o && b == O.j,
            d = a.b[b].children().sort(function(a, b) {
                a = $(a).data("sequence") || -1;
                b = $(b).data("sequence") || -1;
                return c ? b - a : a - b
            });
        a.b[b].append(d)
    }
}

function ug(a, b) {
    if (b == O.f || b == O.h || b == O.v || b == O.u) {
        a.w[b] || (a.w[b] = $("<p>").appendTo(a.b[b]).css("bottom", "-10px"));
        var c = a.c[b].length;
        a.w[b].text(0 == c ? "" : c)
    }
}

function mf(a, b, c) {
    return b & O.g || b & O.m ? a.b[b][c] : a.b[b]
}

function qg(a, b, c) {
    a.c[b] = [];
    c = $(a.namespace + c).data("player", a.o).data("location", b).data("index", -1);
    a.b[b] = $("<div>").addClass("game-field-zone-content").appendTo(c)
}

function rg(a, b, c, d) {
    a.b[b] = [];
    a.c[b] = [];
    for (var e = 0; e < d; ++e)
        if (a.c[b][e] = null, "monster" === c && 5 <= e) {
            var g = e - 5;
            1 === a.o && (g = 1 - g);
            g = $("#game-field-extra-monster" + (g + 1));
            0 === a.o ? (g.data("player", -1).data("location", b).data("index", e), a.b[b].push($("<div>").addClass("game-field-zone-content").appendTo(g))) : a.b[b].push(g.children())
        } else g = $(a.namespace + c + (e + 1)).data("player", a.o).data("location", b).data("index", e), a.b[b].push($("<div>").addClass("game-field-zone-content").appendTo(g))
}

function Zc(a) {
    var b = Math.floor(5 * Cb / (a.c[O.j].length + 1)) - E - 1;
    3 < b && (b = 3);
    for (var c = 0; c < a.c[O.j].length; ++c) a.c[O.j][c].a.css("margin-left", (c == (0 == a.o ? 0 : a.c[O.j].length - 1) ? 0 : b) + "px"), a.c[O.j][c].a.css("height", Math.floor(Db) + "px")
};