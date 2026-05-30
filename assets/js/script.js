var data1 = [
    { "label": "Đặng Hoàng Thiện Nhân", "value": 1, "question": "Đặng Hoàng Thiện Nhân" },
    { "label": "Văn Thương", "value": 2, "question": "Văn Thương" },
    { "label": "Lương Nguyễn Gia Bảo", "value": 3, "question": "Lương Nguyễn Gia Bảo" },
    { "label": "Nguyễn Đình Phương Trâm", "value": 4, "question": "Nguyễn Đình Phương Trâm" },
    { "label": "Phạm Trần Anh Thư", "value": 5, "question": "Phạm Trần Anh Thư" },
    { "label": "Phạm Thị Khánh Hạ", "value": 6, "question": "Phạm Thị Khánh Hạ" },
    { "label": "Bùi Ngọc Uyên Thi", "value": 7, "question": "Bùi Ngọc Uyên Thi" },
    { "label": "Huỳnh Việt Kha", "value": 8, "question": "Huỳnh Việt Kha" },
];

var data2 = [
    { "label": "Nguyễn Lê Nhật Uyên", "value": 1, "question": "Nguyễn Lê Nhật Uyên" },
    { "label": "Phan Đặng Thuỷ Tiên", "value": 2, "question": "Phan Đặng Thuỷ Tiên" },
    { "label": "Trương Như Cao Anh", "value": 3, "question": "Trương Như Cao Anh" },
    { "label": "Trương Như Quốc Thịnh", "value": 4, "question": "Trương Như Quốc Thịnh" },
    { "label": "Bùi Phước Tài", "value": 5, "question": "Bùi Phước Tài" },
    { "label": "Nguyễn Phước Cảnh Tâm", "value": 6, "question": "Nguyễn Phước Cảnh Tâm" },
    { "label": "Nguyễn Thị Thanh Thơm", "value": 7, "question": "Nguyễn Thị Thanh Thơm" },
    { "label": "Huỳnh Thanh Thân", "value": 0, "question": "Lương Văn Đức" },
    { "label": "Trương Ngọc Quỳnh Anh", "value": 0, "question": "Lương Văn Đức" },
    { "label": "Trần Đăng Lộc Phú", "value": 0, "question": "Lương Văn Đức" },
    { "label": "Hoàng Huyền Trang", "value": 0, "question": "Lương Văn Đức" },
    { "label": "Nguyễn Minh Được", "value": 0, "question": "Lương Văn Đức" },
    { "label": "Đào Kim Sơn Tùng", "value": 0, "question": "Lương Văn Đức" },
    { "label": "Nguyễn Hà Việt Bảo", "value": 0, "question": "Lương Văn Đức" },
    { "label": "Nguyễn Hiếu Đức", "value": 0, "question": "Lương Văn Đức" },
    { "label": "Lưu Chấn Phát", "value": 0, "question": "Lương Văn Đức" },
    { "label": "Nguyễn Ngọc Trân", "value": 0, "question": "Lương Văn Đức" },
    { "label": "Nguyễn Vũ Huyền Gia", "value": 0, "question": "Lương Văn Đức" },
    { "label": "Đỗ Văn Linh", "value": 0, "question": "Lương Văn Đức" },
    { "label": "Trần Dự Thanh Thắng", "value": 0, "question": "Lương Văn Đức" },
];
// round state
var round = { w1: null, w2: null };

// wheel instances — populated after createWheel
var wheels = {};

function markRound(key, label) {
    round[key] = label;
    document.getElementById(key === "w1" ? "dot1" : "dot2").classList.add("done");
    if (round.w1 !== null && round.w2 !== null) {
        setTimeout(function () {
            showModal(round.w1, round.w2);
            round.w1 = null; round.w2 = null;
            document.getElementById("dot1").classList.remove("done");
            document.getElementById("dot2").classList.remove("done");
        }, 400);
    }
}

document.getElementById("modal-close").addEventListener("click", function () {
    document.getElementById("modal-overlay").classList.remove("show");
    stopConfetti();
    wheels["w1"].unlockRound();
    wheels["w2"].unlockRound();
});

function showModal(label1, label2) {
    document.getElementById("modal-label1").textContent = label1;
    document.getElementById("modal-label2").textContent = label2;
    var overlay = document.getElementById("modal-overlay");
    overlay.classList.remove("show");
    void overlay.offsetWidth;
    overlay.classList.add("show");
    startConfetti();
}

function createWheel(svgId, questionId, progressId, hintId, data, wheelKey, linkedKey) {
    var padding = { top: 20, right: 40, bottom: 0, left: 0 },
        w = 700 - padding.left - padding.right,
        h = 700 - padding.top - padding.bottom,
        r = Math.min(w, h) / 2,
        oldrotation = 0,
        spinning = false,
        spunThisRound = false,
        usedIndexes = [],
        color = d3.scale.category20();

    var svg = d3.select('#' + svgId).data([data])
        .attr("width", w + padding.left + padding.right)
        .attr("height", h + padding.top + padding.bottom);

    var container = svg.append("g").attr("class", "chartholder")
        .attr("transform", "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")");
    var vis = container.append("g");
    var pie = d3.layout.pie().sort(null).value(function () { return 1; });
    var arc = d3.svg.arc().outerRadius(r);
    var arcs = vis.selectAll("g.slice").data(pie).enter().append("g").attr("class", "slice");

    arcs.append("path").attr("fill", function (d, i) { return color(i); }).attr("d", function (d) { return arc(d); });
    arcs.append("text")
        .attr("transform", function (d) {
            d.innerRadius = 0; d.outerRadius = r;
            d.angle = (d.startAngle + d.endAngle) / 2;
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 10) + ")";
        })
        .attr("text-anchor", "end").attr("font-size", "20px").attr("fill", "#fff")
        .text(function (d, i) { return data[i].label; });

    svg.append("g")
        .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + (h / 2 + padding.top) + ")")
        .append("path")
        .attr("d", "M-" + (r * 0.15) + ",0L0," + (r * 0.05) + "L0,-" + (r * 0.05) + "Z")
        .style("fill", "#333");

    container.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 36)
        .style({ "fill": "white", "cursor": "pointer", "stroke": "#dee2e6", "stroke-width": "1.5px" });
    var spinText = container.append("text")
        .attr("x", 0).attr("y", 8).attr("text-anchor", "middle").text("SPIN")
        .style({ "font-weight": "700", "font-size": "14px", "fill": "#0d6efd", "cursor": "pointer", "pointer-events": "none" });

    function updateProgress() {
        var el = document.getElementById(progressId);
        el.textContent = usedIndexes.length + " / " + data.length;
        el.className = "badge " + (usedIndexes.length === data.length ? "bg-danger" : "bg-secondary");
    }
    function getAvailable() {
        var a = [];
        for (var i = 0; i < data.length; i++) if (usedIndexes.indexOf(i) === -1) a.push(i);
        return a;
    }
    function canSpin() { return !spinning && !spunThisRound && getAvailable().length > 0; }

    // spin đến một index cụ thể (dùng khi bị trigger từ bánh kia)
    function spinToIndex(targetIdx, onEnd) {
        if (spinning) return;
        spinning = true; spunThisRound = true;
        spinText.text("...").style("fill", "#6c757d");
        document.getElementById(hintId).textContent = "Đang tự động quay...";
        document.getElementById(questionId).textContent = "";

        var ps = 360 / data.length;
        var extraSpins = (Math.floor(Math.random() * 3) + 4) * 360;
        var stopAngle = 360 - ps * targetIdx + 90 - Math.round(ps / 2);
        var rotation = extraSpins + stopAngle;

        vis.transition().duration(3000).ease("cubic-out")
            .attrTween("transform", (function (rot) {
                return function () { var i = d3.interpolate(oldrotation % 360, rot); return function (t) { return "rotate(" + i(t) + ")"; }; };
            })(rotation))
            .each("end", function () {
                oldrotation = rotation;
                usedIndexes.push(targetIdx);
                vis.selectAll("g.slice").each(function (d, i) {
                    if (usedIndexes.indexOf(i) !== -1) d3.select(this).select("path").attr("fill", "#adb5bd");
                });
                d3.select("#" + svgId + " .slice:nth-child(" + (targetIdx + 1) + ") path").attr("fill", "#212529");
                // document.getElementById(questionId).textContent = data[targetIdx].label + ": " + data[targetIdx].question;
                document.getElementById(hintId).textContent = "";
                updateProgress();
                spinning = false;
                spinText.text("✓").style("fill", "#198754");
                if (onEnd) onEnd(targetIdx);
            });
    }

    // spin ngẫu nhiên — sau đó trigger bánh kia khớp value
    function spinRandom() {
        if (!canSpin()) return;
        var available = getAvailable();
        spinning = true; spunThisRound = true;
        spinText.text("...").style("fill", "#6c757d");
        document.getElementById(hintId).textContent = "";
        document.getElementById(questionId).textContent = "";

        var picked = available[Math.floor(Math.random() * available.length)];
        var ps = 360 / data.length;
        var extraSpins = (Math.floor(Math.random() * 3) + 4) * 360;
        var stopAngle = 360 - ps * picked + 90 - Math.round(ps / 2);
        var rotation = extraSpins + stopAngle;

        vis.transition().duration(3000).ease("cubic-out")
            .attrTween("transform", (function (rot) {
                return function () { var i = d3.interpolate(oldrotation % 360, rot); return function (t) { return "rotate(" + i(t) + ")"; }; };
            })(rotation))
            .each("end", function () {
                oldrotation = rotation;
                usedIndexes.push(picked);
                vis.selectAll("g.slice").each(function (d, i) {
                    if (usedIndexes.indexOf(i) !== -1) d3.select(this).select("path").attr("fill", "#adb5bd");
                });
                d3.select("#" + svgId + " .slice:nth-child(" + (picked + 1) + ") path").attr("fill", "#212529");
                // document.getElementById(questionId).textContent = data[picked].label + ": " + data[picked].question;
                updateProgress();
                spinning = false;
                spinText.text("✓").style("fill", "#198754");

                var pickedValue = data[picked].value;
                markRound(wheelKey, data[picked].label);

                // trigger bánh kia khớp value — nếu bánh kia chưa quay lượt này
                var linked = wheels[linkedKey];
                if (linked && !linked.spunThisRound()) {
                    var linkedIdx = linked.indexOfValue(pickedValue);
                    if (linkedIdx !== -1 && linked.isAvailable(linkedIdx)) {
                        setTimeout(function () {
                            linked.spinToIndex(linkedIdx, function (idx) {
                                markRound(linkedKey, linked.labelAt(idx));
                            });
                        }, 500);
                    }
                }
            });
    }

    container.on("click", function () { if (canSpin()) spinRandom(); });
    updateProgress();

    // public API
    var api = {
        spinToIndex: spinToIndex,
        spunThisRound: function () { return spunThisRound; },
        isAvailable: function (idx) { return usedIndexes.indexOf(idx) === -1; },
        indexOfValue: function (val) {
            for (var i = 0; i < data.length; i++) if (data[i].value === val) return i;
            return -1;
        },
        labelAt: function (idx) { return data[idx].label; },
        unlockRound: function () {
            spunThisRound = false;
            var avail = getAvailable().length;
            spinText.text(avail === 0 ? "DONE" : "SPIN").style("fill", avail === 0 ? "#dc3545" : "#0d6efd");
            document.getElementById(hintId).textContent = avail === 0 ? "Đã quay hết!" : "Nhấn SPIN để quay";
        }
    };
    wheels[wheelKey] = api;
    return api;
}

createWheel("chart1", "question1", "progress1", "hint1", data1, "w1", "w2");
createWheel("chart2", "question2", "progress2", "hint2", data2, "w2", "w1");

/* ---- Confetti ---- */
var confettiAnim = null, particles = [];
var COLORS = ["#0d6efd", "#198754", "#dc3545", "#ffc107", "#0dcaf0", "#6f42c1", "#fd7e14"];
function startConfetti() {
    var canvas = document.getElementById("confetti-canvas"), ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; particles = [];
    for (var i = 0; i < 130; i++) particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height * 0.2 - 30,
        w: Math.random() * 10 + 5, h: Math.random() * 5 + 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        vx: (Math.random() - 0.5) * 3, vy: Math.random() * 3 + 2, rot: Math.random() * 360, vrot: (Math.random() - 0.5) * 6
    });
    function frame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); var alive = false;
        particles.forEach(function (p) {
            if (p.y < canvas.height + 20) alive = true;
            p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.rot += p.vrot;
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
            ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
        });
        if (alive) confettiAnim = requestAnimationFrame(frame);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (confettiAnim) cancelAnimationFrame(confettiAnim);
    confettiAnim = requestAnimationFrame(frame);
}
function stopConfetti() {
    if (confettiAnim) { cancelAnimationFrame(confettiAnim); confettiAnim = null; }
    document.getElementById("confetti-canvas").getContext("2d").clearRect(0, 0, 9999, 9999);
}