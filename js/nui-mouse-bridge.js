(function () {
  function wtpPost(payload) {
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

  function tabIndexFromTarget(target) {
    var row = target && target.closest ? target.closest(".VTab") : null;
    if (!row) return -1;
    var list = document.querySelectorAll(".VTabs .VTab");
    for (var i = 0; i < list.length; i++) {
      if (list[i] === row) return i;
    }
    return -1;
  }

  function categoryIndexFromTarget(target) {
    var cat = target && target.closest ? target.closest(".PCategory") : null;
    if (!cat) return -1;
    var list = document.querySelectorAll(".PCategories .PCategory");
    for (var i = 0; i < list.length; i++) {
      if (list[i] === cat) return i;
    }
    return -1;
  }

  function installMouseMenu() {
    if (window.__wtpNuiMouseBridge) return;
    window.__wtpNuiMouseBridge = true;
    document.body.classList.add("wtp-nui-mouse");

    document.addEventListener(
      "click",
      function (ev) {
        var catIdx = categoryIndexFromTarget(ev.target);
        if (catIdx >= 0) {
          ev.preventDefault();
          ev.stopPropagation();
          wtpPost({ action: "category", index: catIdx });
          return;
        }

        var onCheckbox =
          ev.target &&
          ev.target.closest &&
          ev.target.closest(".Checkbox, .VOptions .Checkbox");
        var idx = tabIndexFromTarget(ev.target);
        if (idx < 0) return;

        if (onCheckbox) {
          ev.preventDefault();
          ev.stopPropagation();
          wtpPost({ action: "toggle", index: idx });
          return;
        }

        ev.preventDefault();
        ev.stopPropagation();
        wtpPost({ action: "select", index: idx });
      },
      true
    );

    document.addEventListener(
      "dblclick",
      function (ev) {
        if (tabIndexFromTarget(ev.target) < 0) return;
        ev.preventDefault();
        ev.stopPropagation();
        wtpPost({ action: "enter" });
      },
      true
    );

    document.addEventListener(
      "contextmenu",
      function (ev) {
        if (!ev.target.closest || !ev.target.closest(".VWrapper")) return;
        ev.preventDefault();
        wtpPost({ action: "back" });
      },
      true
    );

    document.addEventListener(
      "wheel",
      function (ev) {
        if (!ev.target.closest || !ev.target.closest(".VTabs")) return;
        ev.preventDefault();
        wtpPost({ action: "scroll", direction: ev.deltaY > 0 ? "down" : "up" });
      },
      { passive: false, capture: true }
    );
  }

  window.__wtpMouseInstall = installMouseMenu;

  window.addEventListener("message", function (event) {
    var data = event.data;
    if (!data || typeof data !== "object") return;
    if (data.action === "setInputMode" && data.mode === "nui") {
      installMouseMenu();
    }
    if (data.action === "setInputMode" && data.mode === "keyboard") {
      document.body.classList.remove("wtp-nui-mouse");
    }
    if (data.action === "showUI" && data.visible && data.inputMode === "nui") {
      installMouseMenu();
    }
  });

  installMouseMenu();
})();
