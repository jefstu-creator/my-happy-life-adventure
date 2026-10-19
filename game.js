const $ = (s) => document.querySelector(s);

const rounds = [
  {
    title: "What would you like to do?",
    help: "Choose a fun thing to do today.",
    sign: "A lovely new day!",
    choices: [
      { emoji: "🛝", title: "Play outside", note: "Run, jump and smile!", town: "🌷", message: "Playing helps your body grow strong!", reward: "You chose play time!" },
      { emoji: "📚", title: "Read a story", note: "Explore a book!", town: "📚", message: "Stories help your imagination grow!", reward: "A brilliant story choice!" },
      { emoji: "🖍️", title: "Make art", note: "Draw something!", town: "🎨", message: "You made room for creativity!", reward: "What a creative choice!" }
    ]
  },
  {
    title: "How can we help a friend?",
    help: "Every little act of kindness counts.",
    sign: "Kindness lives here!",
    choices: [
      { emoji: "🧸", title: "Share a toy", note: "Take turns together", town: "🧸", message: "Sharing can help a friend feel included.", reward: "That was kind!" },
      { emoji: "🤗", title: "Give a hug", note: "If they want one", town: "💗", message: "A kind hello or a hug (if wanted) can brighten a day.", reward: "You spread kindness!" },
      { emoji: "🧹", title: "Help tidy up", note: "Teamwork time!", town: "🌼", message: "Helping makes jobs easier for everyone.", reward: "Super helper!" }
    ]
  },
  {
    title: "What shall we learn?",
    help: "Pick something you'd like to discover.",
    sign: "Curious minds grow!",
    choices: [
      { emoji: "🔢", title: "Count things", note: "1, 2, 3!", town: "🔢", message: "Counting helps us understand numbers.", reward: "Number superstar!" },
      { emoji: "🌱", title: "Grow a plant", note: "Give it water", town: "🪴", message: "Plants need care, light and water to grow.", reward: "You helped something grow!" },
      { emoji: "🎵", title: "Make music", note: "Clap a rhythm", town: "🎵", message: "Music is a lovely way to express yourself.", reward: "What a happy rhythm!" }
    ]
  },
  {
    title: "Let's make our town lovely!",
    help: "Choose one special thing to add.",
    sign: "Your town is growing!",
    choices: [
      { emoji: "🌳", title: "Plant a tree", note: "A home for birds", town: "🌳", message: "Trees give shade and can help wildlife.", reward: "A tree for your town!" },
      { emoji: "🌈", title: "Paint a rainbow", note: "So many colours", town: "🌈", message: "Colours make your town bright and cheerful.", reward: "Your town looks magical!" },
      { emoji: "🐝", title: "Help a bee", note: "Plant flowers", town: "🌻", message: "Flowers give bees a place to find nectar.", reward: "A little friend says thank you!" }
    ]
  }
];

let roundIndex = 0;
let stars = 0;
let playerName = "";
let townItems = ["🏡", "🌳", "🌷"];
let picked = false;

const safeName = (name) => name.trim().slice(0, 14);
function show(element) { element.classList.remove("hidden"); }
function hide(element) { element.classList.add("hidden"); }

function updateStars() {
  $("#star-count").textContent = stars;
}
function updateProgress() {
  document.querySelectorAll(".bubble").forEach((bubble, index) => {
    bubble.classList.toggle("active", index === roundIndex);
    bubble.classList.toggle("done", index < roundIndex);
  });
}
function renderRound() {
  picked = false;
  const round = rounds[roundIndex];
  $("#choice-eyebrow").textContent = `ROUND ${roundIndex + 1} OF ${rounds.length}`;
  $("#choice-title").textContent = round.title;
  $("#choice-help").textContent = round.help;
  $("#scene-sign").textContent = round.sign;
  $("#step-caption").textContent = `Round ${roundIndex + 1} of ${rounds.length} — choose a picture!`;
  $("#town-items").innerHTML = townItems.map((item, i) => `<span class="${i === 0 ? "town-house" : ""}" aria-hidden="true">${item}</span>`).join("");
  $("#choices").innerHTML = "";
  round.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-card";
    button.setAttribute("aria-label", `${choice.title}. ${choice.note}`);
    button.innerHTML = `<span class="emoji" aria-hidden="true">${choice.emoji}</span><strong>${choice.title}</strong><small>${choice.note}</small>`;
    button.addEventListener("click", () => choose(index));
    $("#choices").appendChild(button);
  });
  hide($("#reward-panel"));
  show($("#choice-area"));
  updateProgress();
}
function choose(choiceIndex) {
  if (picked) return;
  picked = true;
  const choice = rounds[roundIndex].choices[choiceIndex];
  stars += 1;
  townItems.push(choice.town);
  updateStars();
  $("#scene-sign").textContent = choice.reward;
  $("#reward-title").textContent = choice.reward;
  $("#reward-message").textContent = choice.message;
  $("#next-button").innerHTML = roundIndex === rounds.length - 1
    ? 'See my town! <span aria-hidden="true">🏡</span>'
    : 'Next! <span aria-hidden="true">➡️</span>';
  $("#choices").querySelectorAll("button").forEach((button, index) => {
    button.disabled = true;
    if (index === choiceIndex) button.style.borderColor = "#91e4b1";
    else button.style.opacity = ".65";
  });
  show($("#reward-panel"));
  $("#reward-panel").scrollIntoView({ behavior: "smooth", block: "nearest" });
  celebrate();
}
function celebrate() {
  const c = $("#celebration");
  c.textContent = ["⭐", "🌟", "🎉", "💖"][stars % 4];
  c.classList.remove("hidden");
  c.setAttribute("aria-hidden", "false");
  setTimeout(() => {
    c.classList.add("hidden");
    c.setAttribute("aria-hidden", "true");
  }, 850);
}
function startGame() {
  playerName = safeName($("#player-name").value);
  roundIndex = 0;
  stars = 0;
  townItems = ["🏡", "🌳", "🌷"];
  $("#greeting").textContent = playerName ? `Hello, ${playerName}!` : "Hello, little explorer!";
  updateStars();
  hide($("#welcome-screen"));
  hide($("#finish-screen"));
  show($("#game-screen"));
  renderRound();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function nextRound() {
  if (roundIndex < rounds.length - 1) {
    roundIndex += 1;
    renderRound();
  } else {
    finishGame();
  }
}
function finishGame() {
  hide($("#game-screen"));
  show($("#finish-screen"));
  $("#finish-title").textContent = playerName ? `Amazing work, ${playerName}!` : "You made a happy town!";
  $("#finish-message").textContent = `You made ${rounds.length} lovely choices and earned ${stars} stars. You were kind, curious and creative!`;
  $("#finish-stars").textContent = "⭐".repeat(stars);
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function resetGame() {
  const inGame = !$("#game-screen").classList.contains("hidden");
  if (inGame && !window.confirm("Start a new adventure? Your stars will start at zero.")) return;
  $("#player-name").value = playerName;
  hide($("#game-screen"));
  hide($("#finish-screen"));
  show($("#welcome-screen"));
  stars = 0;
  updateStars();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
$("#start-button").addEventListener("click", startGame);
$("#player-name").addEventListener("keydown", (event) => { if (event.key === "Enter") startGame(); });
$("#next-button").addEventListener("click", nextRound);
$("#play-again-button").addEventListener("click", startGame);
$("#reset-button").addEventListener("click", resetGame);
updateStars();
