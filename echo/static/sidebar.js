// Loads the content when sidebar is clicked
window.addEventListener("load", () => {
  const id = document.getElementById("projectid").attributes.projectid.value;
  ["events", "stats", "members", "invites", "settings"].forEach(e => {
    document.getElementById(e).addEventListener("click", () => {
      $("#content").load(`/main/${e}?project=${id}`);
    });
  });
});
