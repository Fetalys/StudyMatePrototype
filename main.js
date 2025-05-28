document.addEventListener("DOMContentLoaded", function () {
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

    el.style.position = "absolute";
    if (!el.style.left) el.style.left = el.offsetLeft + "px";
    if (!el.style.top) el.style.top = el.offsetTop + "px";

    // mouse drag
    header.onmousedown = function (e) {
      e.preventDefault();
      isDragging = true;
      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;
      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", stopDrag);
    };

    // touch drag
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

  // bring window to front on pointerdown
  document.querySelectorAll(".window").forEach((win) => {
    win.addEventListener("pointerdown", () => bringToFront(win));
  });

  // close window on pointerup/touchend
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

  // expose openWindow globally for HTML onclick
  window.openWindow = openWindow;
});

// --- calculator logic ---
let calcValue = "";
window.calcInput = function (val) {
  calcValue += val;
  const display = document.getElementById("calc-display");
  if (display) display.value = calcValue;
};
window.calcClear = function () {
  calcValue = "";
  const display = document.getElementById("calc-display");
  if (display) display.value = "";
};
window.calcEquals = function () {
  const display = document.getElementById("calc-display");
  try {
    // eslint-disable-next-line no-eval
    calcValue = eval(calcValue).toString();
    if (display) display.value = calcValue;
  } catch {
    if (display) display.value = "Error";
    calcValue = "";
  }
};

// --- to-do list logic with localStorage ---
function saveTodos() {
  const list = document.getElementById("todo-list");
  const todos = [];
  list.querySelectorAll(".todo-item").forEach((li) => {
    todos.push({
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed"),
    });
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  const list = document.getElementById("todo-list");
  list.innerHTML = "";
  const todos = JSON.parse(localStorage.getItem("todos") || "[]");
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";
    if (todo.completed) li.classList.add("completed");

    // checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.completed;
    checkbox.onclick = function () {
      li.classList.toggle("completed", checkbox.checked);
      saveTodos();
    };

    // task text
    const span = document.createElement("span");
    span.textContent = todo.text;

    // remove button
    const removeBtn = document.createElement("button");
    removeBtn.className = "todo-remove";
    removeBtn.innerHTML = "&times;";
    removeBtn.onclick = function () {
      li.remove();
      saveTodos();
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

window.addTodo = function (event) {
  event.preventDefault();
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");
  if (!input || !list) return;
  const text = input.value.trim();
  if (text) {
    const li = document.createElement("li");
    li.className = "todo-item";

    // checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.onclick = function () {
      li.classList.toggle("completed", checkbox.checked);
      saveTodos();
    };

    // task text
    const span = document.createElement("span");
    span.textContent = text;

    // remove button
    const removeBtn = document.createElement("button");
    removeBtn.className = "todo-remove";
    removeBtn.innerHTML = "&times;";
    removeBtn.onclick = function () {
      li.remove();
      saveTodos();
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(removeBtn);
    list.appendChild(li);
    input.value = "";
    saveTodos();
  }
};

document.addEventListener("DOMContentLoaded", loadTodos);

// --- notes logic with localStorage ---
function saveNotes() {
  const textarea = document.getElementById("notes-textarea");
  if (textarea) {
    localStorage.setItem("notes", textarea.value);
  }
}

function loadNotes() {
  const textarea = document.getElementById("notes-textarea");
  if (textarea) {
    textarea.value = localStorage.getItem("notes") || "";
    textarea.addEventListener("input", saveNotes);
  }
}

// load notes on page load
document.addEventListener("DOMContentLoaded", loadNotes);

// --- pomodoro logic ---
let pomodoroInterval = null;
let pomodoroTime = 25 * 60;
let pomodoroRunning = false;

function updatePomodoroDisplay() {
  const display = document.querySelector("#pomodoro-window .window-content p");
  if (display) {
    const min = String(Math.floor(pomodoroTime / 60)).padStart(2, "0");
    const sec = String(pomodoroTime % 60).padStart(2, "0");
    display.textContent = `${min}:${sec}`;
  }
}

function startPomodoro() {
  if (pomodoroRunning) return;
  pomodoroRunning = true;
  pomodoroInterval = setInterval(() => {
    if (pomodoroTime > 0) {
      pomodoroTime--;
      updatePomodoroDisplay();
    } else {
      stopPomodoro();
      alert("Pomodoro finished!");
    }
  }, 1000);
}

function stopPomodoro() {
  pomodoroRunning = false;
  clearInterval(pomodoroInterval);
}

function resetPomodoro() {
  stopPomodoro();
  pomodoroTime = 25 * 60;
  updatePomodoroDisplay();
}

document.addEventListener("DOMContentLoaded", function () {
  updatePomodoroDisplay();
  const startBtn = document.querySelector("#pomodoro-window .start-btn");
  const stopBtn = document.querySelector("#pomodoro-window .stop-btn");
  const resetBtn = document.querySelector("#pomodoro-window .reset-btn");
  if (startBtn) startBtn.onclick = startPomodoro;
  if (stopBtn) stopBtn.onclick = stopPomodoro;
  if (resetBtn) resetBtn.onclick = resetPomodoro;
});
