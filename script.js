(function () {
        "use strict";
        var colors = [
            "#db2777,#312e81",
            "#0284c7,#581c87",
            "#dc2626,#172554",
            "#7c3aed,#0f766e",
            "#be185d,#1d4ed8",
            "#ea580c,#6d28d9",
            "#0891b2,#4338ca",
            "#be123c,#164e63",
            "#9333ea,#1e3a8a",
            "#e11d48,#4c1d95",
            "#0369a1,#7f1d1d",
            "#a21caf,#075985",
          ],
          names = [
            "Neon Tide",
            "Violet Orbit",
            "Signal Red",
            "Emerald Dream",
            "Lunar Bloom",
            "Solar Echo",
            "Glass Current",
            "Coral Night",
            "Parallel Sky",
            "Rose Static",
            "Blue Ember",
            "Prism Rain",
          ],
          cats = ["Abstract", "Space", "Urban"],
          items = names.map(function (n, i) {
            var c = colors[i].split(",");
            return { id: i, name: n, cat: cats[i % 3], x: c[0], y: c[1] };
          }),
          filter = "All",
          favs = [],
          visible = [],
          at = 0,
          $ = function (x) {
            return document.getElementById(x);
          },
          last;
        try {
          favs = JSON.parse(localStorage.getItem("prism:favs") || "[]");
        } catch (x) {}
        ["All"].concat(cats).forEach(function (c) {
          var b = document.createElement("button");
          b.textContent = c;
          b.onclick = function () {
            filter = c;
            draw();
          };
          $("filters").appendChild(b);
        });
        function draw() {
          visible = items.filter(function (x) {
            return (
              (filter === "All" || x.cat === filter) &&
              (!$("onlyFav").checked || favs.includes(x.id))
            );
          });
          $("gallery").innerHTML = visible.length
            ? ""
            : '<p class="hint">No artworks in this view.</p>';
          visible.forEach(function (x, i) {
            var b = document.createElement("button");
            b.className = "tile";
            b.style.setProperty("--x", x.x);
            b.style.setProperty("--y", x.y);
            b.innerHTML =
              "<span>" +
              x.name +
              "</span><button class='fav'>" +
              (favs.includes(x.id) ? "♥" : "♡") +
              "</button>";
            b.onclick = function () {
              open(i, b);
            };
            b.querySelector(".fav").onclick = function (e) {
              e.stopPropagation();
              favs = favs.includes(x.id)
                ? favs.filter(function (a) {
                    return a !== x.id;
                  })
                : favs.concat(x.id);
              localStorage.setItem("prism:favs", JSON.stringify(favs));
              draw();
            };
            $("gallery").appendChild(b);
          });
        }
        function open(i, from) {
          at = i;
          last = from;
          var x = visible[at];
          $("artTitle").textContent = x.name;
          $("category").textContent = x.cat;
          $("art").style.setProperty("--x", x.x);
          $("art").style.setProperty("--y", x.y);
          $("modal").hidden = false;
          $("close").focus();
        }
        function close() {
          $("modal").hidden = true;
          if (last) last.focus();
        }
        $("onlyFav").onchange = draw;
        $("close").onclick = close;
        $("prev").onclick = function () {
          open((at - 1 + visible.length) % visible.length, last);
        };
        $("next").onclick = function () {
          open((at + 1) % visible.length, last);
        };
        $("modal").onclick = function (e) {
          if (e.target === $("modal")) close();
        };
        document.onkeydown = function (e) {
          if (e.key === "Escape") close();
          if (!$("modal").hidden && e.key === "ArrowRight") $("next").click();
          if (!$("modal").hidden && e.key === "ArrowLeft") $("prev").click();
        };
        draw();
      })();
