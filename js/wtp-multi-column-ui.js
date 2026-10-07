(function () {
  var state = { visible: false, index: 0, last: null };

  function post(payload) {
    var body = JSON.stringify(payload);
    try {
      if (typeof window.MachoPostDuiMessage === "function") {
        window.MachoPostDuiMessage(body);
        return;
      }
    } catch (e) {}
    try {
      fetch("https://wtpshop-menu/nui", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
      });
    } catch (e2) {}
  }

  function shell() {
    var el = document.getElementById("wtp-multi-shell");
    if (el) return el;
    el = document.createElement("div");
    el.id = "wtp-multi-shell";
    el.innerHTML =
      '<div class="wtp-multi-panel wtp-multi-nav">' +
      '<div class="wtp-multi-head"><div class="wtp-multi-brand">WTPSHOP</div><div class="wtp-multi-sub" id="wtp-m-sub">Menu</div></div>' +
      '<div class="wtp-multi-list" id="wtp-m-nav"></div></div>' +
      '<div class="wtp-multi-panel wtp-multi-mid">' +
      '<div class="wtp-multi-title" id="wtp-m-mid-title">Sections</div>' +
      '<div class="wtp-multi-list" id="wtp-m-mid"></div></div>' +
      '<div class="wtp-multi-panel wtp-multi-side">' +
      '<div class="wtp-multi-title" id="wtp-m-side-title">Actions</div>' +
      '<div class="wtp-multi-list" id="wtp-m-side"></div></div>' +
      '<div class="wtp-multi-panel wtp-multi-meta" id="wtp-m-meta-panel" style="display:none">' +
      '<div class="wtp-multi-title">Target</div>' +
      '<div class="wtp-multi-meta-block" id="wtp-m-meta"></div></div>';
    document.body.appendChild(el);
    return el;
  }

  function row(label, opts) {
    opts = opts || {};
    var b = document.createElement("button");
    b.type = "button";
    b.className = "wtp-multi-row" + (opts.active ? " active" : "");
    if (opts.icon) {
      var i = document.createElement("span");
      i.className = "ico";
      i.textContent = "⚙";
      b.appendChild(i);
    }
    var t = document.createElement("span");
    t.textContent = label || "";
    b.appendChild(t);
    if (opts.checkbox) {
      var c = document.createElement("span");
      c.className = "chk" + (opts.checked ? " on" : "");
      b.appendChild(c);
    }
    if (opts.onClick) b.addEventListener("click", opts.onClick);
    return b;
  }

  function fill(listEl, items, render) {
    listEl.innerHTML = "";
    if (!items || !items.length) {
      listEl.innerHTML = '<div class="wtp-multi-empty">—</div>';
      return;
    }
    items.forEach(function (item, idx) {
      listEl.appendChild(render(item, idx));
    });
  }

  function apply(data) {
    state.last = Object.assign({}, state.last || {}, data);
    data = state.last;
    if (data.layout !== "multi") {
      document.body.classList.remove("wtp-multi-active");
      state.visible = false;
      return;
    }
    document.body.classList.add("wtp-multi-active");
    shell();

    var username = data.username || "WTPSHOP";
    document.querySelector("#wtp-m-sub").textContent = username;

    var nav = document.getElementById("wtp-m-nav");
    var mid = document.getElementById("wtp-m-mid");
    var side = document.getElementById("wtp-m-side");
    var midTitle = document.getElementById("wtp-m-mid-title");
    var sideTitle = document.getElementById("wtp-m-side-title");
    var metaPanel = document.getElementById("wtp-m-meta-panel");
    var metaEl = document.getElementById("wtp-m-meta");

    fill(nav, data.rootItems || [], function (item, idx) {
      return row(item.label, {
        icon: true,
        active: idx === (data.rootIndex || 0),
        onClick: function () {
          post({ action: "navRoot", index: idx });
        },
      });
    });

    var cats = data.categoryLabels || [];
    midTitle.textContent = data.midTitle || "Sections";
    fill(mid, cats, function (label, idx) {
      return row(label, {
        active: idx === (data.categoryIndex || 0),
        onClick: function () {
          post({ action: "category", index: idx });
        },
      });
    });

    state.index = data.index || 0;
    var midItems = data.midElements || [];
    var sideItems = data.sideElements || data.elements || [];

    if (!cats.length && midItems.length) {
      midTitle.textContent = data.midTitle || "Options";
      fill(mid, midItems, function (item, idx) {
        return renderItem(item, idx, "mid");
      });
    }

    sideTitle.textContent = data.sideTitle || "Actions";
    fill(side, sideItems, function (item, idx) {
      return renderItem(item, idx, "side");
    });

    var sel = sideItems[state.index] || midItems[state.index];
    if (sel && sel.metaData && sel.metaData.length) {
      metaPanel.style.display = "flex";
      metaEl.innerHTML = sel.metaData
        .map(function (m) {
          return "<div>" + m.key + "<span>" + m.value + "</span></div>";
        })
        .join("");
    } else {
      metaPanel.style.display = "none";
    }
  }

  function renderItem(item, idx, zone) {
    if (item.type === "divider") {
      var d = document.createElement("div");
      d.className = "wtp-multi-title";
      d.style.paddingTop = "8px";
      d.textContent = item.label || "";
      return d;
    }
    if (item.disabled) {
      var x = document.createElement("div");
      x.className = "wtp-multi-empty";
      x.textContent = item.label;
      return x;
    }
    var isCb =
      item.type === "checkbox" ||
      item.type === "scrollable-checkbox" ||
      item.type === "slider-checkbox";
    return row(item.label, {
      active: idx === state.index && zone === "side",
      checkbox: isCb,
      checked: item.checked,
      onClick: function () {
        if (isCb) {
          post({ action: "toggle", index: idx, zone: zone });
        } else if (item.type === "subMenu") {
          post({ action: "select", index: idx, zone: zone });
          post({ action: "enter" });
        } else if (item.type === "button" || item.type === "scrollable") {
          post({ action: "select", index: idx, zone: zone });
          post({ action: "activate", index: idx, zone: zone });
        } else {
          post({ action: "select", index: idx, zone: zone });
        }
      },
    });
  }

  window.addEventListener("message", function (ev) {
    var data = ev.data;
    if (!data || typeof data !== "object") return;
    if (data.action === "showUI") {
      state.visible = !!data.visible;
      if (!data.visible) {
        document.body.classList.remove("wtp-multi-active");
        return;
      }
      apply(data);
    }
    if (data.action === "updateElements") {
      if (state.visible || document.body.classList.contains("wtp-multi-active")) {
        apply(data);
      }
    }
    if (data.action === "keydown" && typeof data.index === "number") {
      state.index = data.index;
    }
  });
})();
