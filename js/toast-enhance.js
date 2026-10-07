(function () {
  var SVG = {
    success:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    error:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  };

  function parseDurationMs(node) {
    var bar = node.querySelector(".NotificationProgress");
    if (!bar) return 3500;
    var anim = bar.style.animationDuration || window.getComputedStyle(bar).animationDuration;
    if (anim && anim !== "0s") {
      var sec = parseFloat(anim);
      if (!isNaN(sec)) return Math.max(1000, Math.round(sec * 1000));
    }
    var match = (bar.getAttribute("style") || "").match(/animation-duration:\s*([\d.]+)s/i);
    if (match) return Math.round(parseFloat(match[1]) * 1000);
    return 3500;
  }

  function wrapBody(content, titleEl, descEl) {
    if (content.querySelector(".wtp-toast-body")) return;
    var body = document.createElement("div");
    body.className = "wtp-toast-body";
    if (titleEl) body.appendChild(titleEl);
    if (descEl) body.appendChild(descEl);
    content.appendChild(body);
  }

  function enhance(node) {
    if (!node || node.classList.contains("wtp-toast-enhanced")) return;
    node.classList.add("wtp-toast-enhanced");

    var kind = "info";
    if (node.classList.contains("success")) kind = "success";
    else if (node.classList.contains("error")) kind = "error";

    var content = node.querySelector(".NotificationContent");
    if (!content) return;

    if (!content.querySelector(".wtp-toast-icon")) {
      var icon = document.createElement("div");
      icon.className = "wtp-toast-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML = SVG[kind] || SVG.info;
      content.insertBefore(icon, content.firstChild);
    }

    var title = content.querySelector(".NotificationTitle");
    var desc = content.querySelector(".NotificationDesc");
    if (title) {
      var t = (title.textContent || "").trim();
      if (/^(success|error|info)$/i.test(t)) title.textContent = "WTPSHOP";
    }
    if (desc) {
      var d = (desc.textContent || "").trim();
      if (/^WTP Menu loaded\.?$/i.test(d)) desc.textContent = "Menu ready.";
      if (d === "Loaded.") desc.textContent = "Menu ready.";
    }

    wrapBody(content, title, desc);

    var ms = parseDurationMs(node);
    node.style.setProperty("--wtp-toast-ms", ms + "ms");

    var bar = node.querySelector(".NotificationProgress");
    if (bar) {
      bar.style.animation = "none";
      void bar.offsetWidth;
      bar.style.width = "100%";
      bar.style.animation = "";
    }
  }

  function scan(root) {
    (root.querySelectorAll ? root : document).querySelectorAll(".Notification").forEach(enhance);
  }

  scan(document);

  new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      m.addedNodes.forEach(function (n) {
        if (n.nodeType !== 1) return;
        if (n.classList && n.classList.contains("Notification")) enhance(n);
        else scan(n);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
