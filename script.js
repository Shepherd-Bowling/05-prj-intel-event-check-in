const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const storageKey = "eventCheckInCounts";
const teamNames = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};
const savedCounts = JSON.parse(localStorage.getItem(storageKey)) || {
  count: 0,
  water: 0,
  zero: 0,
  power: 0,
  attendees: [],
};
savedCounts.attendees = savedCounts.attendees || [];

let count = savedCounts.count;
const maxCount = 50;

function renderAttendees() {
  const attendeeList = document.getElementById("attendeeList");
  attendeeList.textContent = "";

  if (savedCounts.attendees.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "attendee-empty";
    emptyMessage.textContent = "No attendees checked in yet.";
    attendeeList.appendChild(emptyMessage);
    return;
  }

  for (let index = 0; index < savedCounts.attendees.length; index++) {
    const attendee = savedCounts.attendees[index];
    const attendeeItem = document.createElement("li");
    const attendeeName = document.createElement("span");
    const attendeeTeam = document.createElement("span");

    attendeeItem.className = `attendee-item ${attendee.team}`;
    attendeeName.className = "attendee-name";
    attendeeName.textContent = attendee.name;
    attendeeTeam.className = "attendee-team";
    attendeeTeam.textContent = teamNames[attendee.team];

    attendeeItem.appendChild(attendeeName);
    attendeeItem.appendChild(attendeeTeam);
    attendeeList.appendChild(attendeeItem);
  }
}

function showCelebration() {
  const teamKeys = Object.keys(teamNames);
  let highestCount = 0;

  for (let index = 0; index < teamKeys.length; index++) {
    const team = teamKeys[index];
    highestCount = Math.max(highestCount, savedCounts[team]);
  }

  const winningTeams = [];
  for (let index = 0; index < teamKeys.length; index++) {
    const team = teamKeys[index];
    if (savedCounts[team] === highestCount) {
      winningTeams.push(teamNames[team]);
    }
  }

  greeting.textContent = `🎉 The ${maxCount}-attendee goal is reached! Congratulations to ${winningTeams.join(", ")} for leading attendance!`;
  greeting.className = "celebration-message";
  greeting.style.display = "block";
}

attendeeCount.textContent = count;
progressBar.style.width = `${Math.min((count / maxCount) * 100, 100)}%`;
document.getElementById("waterCount").textContent = savedCounts.water;
document.getElementById("zeroCount").textContent = savedCounts.zero;
document.getElementById("powerCount").textContent = savedCounts.power;
renderAttendees();

if (count >= maxCount) {
  showCelebration();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  if (name === "") {
    greeting.textContent = "Please enter your name to check in.";
    greeting.className = "";
    greeting.style.display = "block";
    return;
  }

  count++;
  attendeeCount.textContent = count;
  progressBar.style.width = `${Math.min((count / maxCount) * 100, 100)}%`;

  const teamCounter = document.getElementById(team + "Count");
  savedCounts[team]++;
  teamCounter.textContent = savedCounts[team];
  savedCounts.attendees.push({ name: name, team: team });
  savedCounts.count = count;
  renderAttendees();
  localStorage.setItem(storageKey, JSON.stringify(savedCounts));

  if (count >= maxCount) {
    showCelebration();
  } else {
    greeting.textContent = `Welcome, ${name} from ${teamName}!`;
    greeting.className = "success-message";
    greeting.style.display = "block";
  }

  form.reset();
});
