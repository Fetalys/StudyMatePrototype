document.addEventListener("DOMContentLoaded", function() {
  let topZ = 100;

  function openWindow(app) {
    const win = document.getElementById(`${app}-window`);
    win.classList.remove("hidden");
    bringToFront(win);
    makeDraggable(win);
  }

  function closeWindow(app) {
    document.getElementById(`${app}-window`).classList.add("hidden");
  }

  function bringToFront(win) {
    topZ++;
    win.style.zIndex = topZ;
  }

  function makeDraggable(el) {
    const header = el.querySelector(".window-header");
    let offsetX = 0,
      offsetY = 0,
      isDragging = false;

    // position can vary on the screen so the user can put it anywhere
    el.style.position = "absolute";
    if (!el.style.left) el.style.left = el.offsetLeft + "px";
    if (!el.style.top) el.style.top = el.offsetTop + "px";

    // pc mouse functions
    header.onmousedown = function (e) {
      e.preventDefault();
      isDragging = true;
      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;
      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", stopDrag);
    };

    // tablet touch functions
    header.addEventListener("touchstart", function (e) {
      e.preventDefault();
      isDragging = true;
      const touch = e.touches[0];
      offsetX = touch.clientX - el.offsetLeft;
      offsetY = touch.clientY - el.offsetTop;
      document.addEventListener("touchmove", touchDrag, { passive: false });
      document.addEventListener("touchend", stopTouchDrag);
    });

    function drag(e) {
      if (!isDragging) return;
      el.style.left = e.clientX - offsetX + "px";
      el.style.top = e.clientY - offsetY + "px";
    }

    function stopDrag() {
      isDragging = false;
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDrag);
    }

    function touchDrag(e) {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      el.style.left = touch.clientX - offsetX + "px";
      el.style.top = touch.clientY - offsetY + "px";
    }

    function stopTouchDrag() {
      isDragging = false;
      document.removeEventListener("touchmove", touchDrag);
      document.removeEventListener("touchend", stopTouchDrag);
    }
  }

  // window will come to front on pointerdown (works for mouse and touch)
  document.querySelectorAll('.window').forEach(win => {
    win.addEventListener('pointerdown', () => bringToFront(win));
  });

  // will close on pointerup (works for mouse and touch)
  document.querySelectorAll(".window-close").forEach((btn) => {
    btn.addEventListener("pointerup", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const app = this.dataset.app;
      closeWindow(app);
    });
    btn.addEventListener("touchend", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const app = this.dataset.app;
      closeWindow(app);
    });
  });

  // Expose openWindow globally
  window.openWindow = openWindow;
});
