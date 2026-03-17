const gate = document.getElementById("ageGate");
const checkbox = document.getElementById("confirmAge");
const button = document.getElementById("enterBtn");

if (localStorage.getItem("ageConfirmed") === "yes") {
  gate.style.display = "none";
}

checkbox?.addEventListener("change", () => {
  button.disabled = !checkbox.checked;
});

button?.addEventListener("click", () => {
  localStorage.setItem("ageConfirmed", "yes");
  gate.style.display = "none";
});

let roommate = null;

async function loadState() {
  const res = await fetch("https://aiwordpressposter.pythonanywhere.com/load");
  roommate = await res.json();
  render();
}

async function init() {
  await loadState();

  setInterval(loadState, 30000); // refresh from server every 30s
}

function decay() {
  if (!roommate) return;

  roommate.hunger = Math.min(100, roommate.hunger + 1);
  roommate.energy = Math.max(0, roommate.energy - 1);
}

function render() {
  if (!roommate) return;

  document.getElementById("hunger").style.width = roommate.hunger + "%";
  document.getElementById("energy").style.width = roommate.energy + "%";
  document.getElementById("mood").style.width = roommate.mood + "%";
}

async function doAction(action) {
  const res = await fetch("https://aiwordpressposter.pythonanywhere.com/action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: roommate.id,
      action: action
    })
  });

  const data = await res.json();
  roommate = data.roommate;
  render();
}

init();