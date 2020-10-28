(async () => {
  // Gets the create element
  document.getElementById("create").onclick = async () => {
    // Fetches the createInvite API
    await fetch("/api/createInvite", {
      method: "post",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      // Sets the body
      body: JSON.stringify({
        id: document.getElementById("projectid").attributes.projectid.value,
        uses: document.getElementById("uses").value,
        expiration: new Date().getTime() + document.getElementById("expiration").value * 86400000,
        role: document.getElementById("role").value,
        label: document.getElementById("label").value,
      }),
    });
    $("#content").load(`/main/invites?project=${document.getElementById("projectid").attributes.projectid.value}`);
  };
})();
