/* ==========================================================================
   Personal site — site behaviour
   Vanilla JS, no dependencies. Two jobs only:
     1. Stamp the current year into the footer.
     2. Render the project list on projects.html from data/projects.json,
        with simple category filtering and an empty state.

   Everything degrades gracefully: with JS disabled the pages still work,
   only the dynamic project list needs the JSON (see README).
   ========================================================================== */
(function () {
  "use strict";

  /* 1. Footer year
     ======================================================================== */
  var yearSlot = document.getElementById("year");
  if (yearSlot) {
    yearSlot.textContent = String(new Date().getFullYear());
  }

  /* 2. Project list
     ======================================================================== */
  var listEl = document.getElementById("project-list");
  if (!listEl) return;

  var filterBar = document.getElementById("project-filters");
  var statusEl = document.getElementById("project-status");
  var source = listEl.getAttribute("data-source");

  var state = { projects: [], category: "All" };

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function renderEmpty() {
    listEl.innerHTML = "";
    var li = el("li");
    var box = el("div", "notice");
    var p = el("p", null, "Projects will be added soon.");
    var p2 = el(
      "p",
      null,
      "This section is ready to be populated. To add your first entry, " +
        "edit data/projects.json and duplicate projects/template.html — " +
        "see the README for the full walkthrough."
    );
    box.appendChild(p);
    box.appendChild(p2);
    li.appendChild(box);
    listEl.appendChild(li);

    /* The empty-state notice already says everything; hide the filter bar
       and leave the live-status region silent. */
    if (filterBar) filterBar.hidden = true;
    if (statusEl) statusEl.textContent = "";
  }

  function renderList() {
    var visible = state.projects.filter(function (p) {
      return state.category === "All" || p.category === state.category;
    });

    listEl.innerHTML = "";

    if (!visible.length) {
      var li = el("li");
      li.appendChild(
        el("p", "notice", "No projects in this category yet.")
      );
      listEl.appendChild(li);
      return;
    }

    visible.forEach(function (p) {
      var li = el("li", "project-item");

      li.appendChild(el("div", "project-item__date", p.date || ""));

      var body = el("div");

      var title = el("h3", "project-item__title");
      if (p.url) {
        var link = el("a", null, p.title);
        link.href = p.url;
        title.appendChild(link);
      } else {
        title.textContent = p.title;
      }
      body.appendChild(title);

      var cat = el("div", "card__meta", p.category || "");
      body.appendChild(cat);

      if (p.summary) {
        body.appendChild(el("p", "project-item__summary", p.summary));
      }

      if (p.tags && p.tags.length) {
        var tags = el("ul", "tags");
        p.tags.forEach(function (t) {
          var tagLi = el("li", "tag", t);
          tags.appendChild(tagLi);
        });
        body.appendChild(tags);
      }

      li.appendChild(body);
      listEl.appendChild(li);
    });

    if (statusEl) {
      statusEl.textContent =
        visible.length +
        (visible.length === 1 ? " project" : " projects") +
        (state.category === "All" ? "" : " in " + state.category) +
        ".";
    }
  }

  function buildFilters() {
    if (!filterBar) return;

    var categories = ["All"];
    state.projects.forEach(function (p) {
      if (p.category && categories.indexOf(p.category) === -1) {
        categories.push(p.category);
      }
    });

    filterBar.innerHTML = "";

    categories.forEach(function (cat) {
      var btn = el("button", "filter-btn", cat);
      btn.type = "button";
      btn.setAttribute("aria-pressed", cat === state.category ? "true" : "false");
      btn.addEventListener("click", function () {
        state.category = cat;
        Array.prototype.forEach.call(
          filterBar.querySelectorAll(".filter-btn"),
          function (b) {
            b.setAttribute("aria-pressed", b === btn ? "true" : "false");
          }
        );
        renderList();
      });
      filterBar.appendChild(btn);
    });
  }

  fetch(source)
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (data) {
      state.projects = (data && data.projects) || [];
      if (!state.projects.length) {
        renderEmpty();
        return;
      }
      buildFilters();
      renderList();
    })
    .catch(function () {
      listEl.innerHTML = "";
      var li = el("li");
      li.appendChild(
        el(
          "p",
          "notice",
          "The project list could not be loaded. If you are opening this " +
            "file directly from disk, serve the site over a local web server " +
            "instead (see README: Local preview)."
        )
      );
      listEl.appendChild(li);
    });
})();
