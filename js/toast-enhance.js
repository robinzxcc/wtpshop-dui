(function () {
  var ICON = { success: "✓", info: "i", error: "!" };

  function enhance(node) {
    if (!node || node.classList.contains("wtp-toast-enhanced")) return;
    node.classList.add("wtp-toast-enhanced");

    var kind = "info";
    if (node.classList.contains("success")) kind = "success";
    else if (node.classList.contains("error")) kind = "error";

    var content = node.querySelector(".NotificationContent");
    if (content && !content.querySelector(".wtp-toast-icon")) {
      var icon = document.createElement("div");
      icon.className = "wtp-toast-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = ICON[kind] || "•";
      content.insertBefore(icon, content.firstChild);
    }

    var title = node.querySelector(".NotificationTitle");
    if (title) {
      var t = (title.textContent || "").trim();
      if (/^success$/i.test(t)) title.textContent = "WTPSHOP";
      else if (/^error$/i.test(t)) title.textContent = "WTPSHOP";
      else if (/^info$/i.test(t)) title.textContent = "WTPSHOP";
    }

    var bar = node.querySelector(".NotificationProgress");
    if (bar && !bar.style.animationDuration) {
      node.style.setProperty("--wtp-toast-ms", "4000ms");
    }
  }

  function scan(root) {
    (root.querySelectorAll ? root : document).querySelectorAll(".Notification").forEach(enhance);
  }

  scan(document);

  var obs = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      m.addedNodes.forEach(function (n) {
        if (n.nodeType !== 1) return;
        if (n.classList && n.classList.contains("Notification")) enhance(n);
        else scan(n);
      });
    });
  });

  obs.observe(document.documentElement, { childList: true, subtree: true });
})();
