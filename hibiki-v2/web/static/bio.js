/*
  Hibiki Bio Updater

  This updates a user's bio.
*/

let lastInput = new Date().getTime();
let lastText = "";

window.addEventListener("load", async () => {
  // Fetches the API
  let res = await fetch("/api/getBio", { credentials: "include" });
  let bio = await res.text();
  if (bio && res.status == 200) {
    // Sets the bio text
    lastText = bio;
    document.getElementById("bio").value = bio;
  }

  document.getElementById("bio").addEventListener("input", () => {
    lastInput = new Date().getTime()
  })

  setInterval(async () => {
    // Updates the bio if the user hasn't typed for 500ms
    if (new Date().getTime() - lastInput > 500 && document.getElementById("bio").value != lastText) {
      fetch(`/api/updateBio?bio=${encodeURIComponent(document.getElementById("bio").value)}`, { credentials: "include" }).then(r => {
        console.log(`Bio updated (status code ${r.status}).`);
      });
      lastText = document.getElementById("bio").value;
    }
  }, 100);
});
