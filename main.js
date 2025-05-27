function openWindow(app) {
      const win = document.getElementById(`${app}-window`);
      win.classList.remove('hidden');
      makeDraggable(win);
    }

    function closeWindow(app) {
      document.getElementById(`${app}-window`).classList.add('hidden');
    }

    function makeDraggable(el) {
      const header = el.querySelector(".window-header");
      let offsetX = 0, offsetY = 0, isDragging = false;

      // pc functions
      header.onmousedown = function (e) {
        isDragging = true;
        offsetX = e.clientX - el.offsetLeft;
        offsetY = e.clientY - el.offsetTop;
        document.onmousemove = drag;
        document.onmouseup = stopDrag;
      };

      // phone|tablet functions
      header.ontouchstart = function (e) {
        isDragging = true;
        const touch = e.touches[0];
        offsetX = touch.clientX - el.offsetLeft;
        offsetY = touch.clientY - el.offsetTop;
        document.ontouchmove = touchDrag;
        document.ontouchend = stopTouchDrag;
      };

      function drag(e) {
        if (!isDragging) return;
        el.style.left = e.clientX - offsetX + "px";
        el.style.top = e.clientY - offsetY + "px";
      }

      function stopDrag() {
        isDragging = false;
        document.onmousemove = null;
        document.onmouseup = null;
      }

      function touchDrag(e) {
        if (!isDragging) return;
        const touch = e.touches[0];
        el.style.left = touch.clientX - offsetX + "px";
        el.style.top = touch.clientY - offsetY + "px";
      }

      function stopTouchDrag() {
        isDragging = false;
        document.ontouchmove = null;
        document.ontouchend = null;
      }
    }
