function openWindow(app) {
  const win = document.getElementById(`${app}-window`);
  win.classList.remove("hidden");
  bringToFront(win);
  makeDraggable(win);
}

function closeWindow(app) {
  document.getElementById(`${app}-window`).classList.add("hidden");
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
    e.stopPropagation();
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

const closeButtons = document.querySelectorAll(".window-close");
closeButtons.forEach((btn) => {
  btn.addEventListener("pointerup", function (e) {
    e.preventDefault();
    const app = this.dataset.app;
    closeWindow(app);
  });
});

let topZ = 100;

function bringToFront(win) {
  topZ++;
  win.style.zIndex = topZ;
}

document.querySelectorAll('.window').forEach(win => {
  win.addEventListener('pointerdown', () => bringToFront(win));
});
