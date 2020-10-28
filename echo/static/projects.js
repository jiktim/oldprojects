// Project name error text switcher
async function switchText(elem, newcolor, text, timeout) {
  const origtext = elem.innerText;
  let origcolor;
  elem.innerText = text;
  if (newcolor) {
    origcolor = elem.style.color;
    elem.style.color = newcolor;
  }
  // Timeout for setting it back
  setTimeout(() => {
    elem.innerText = origtext;
    if (newcolor) elem.style.color = origcolor;
  }, timeout);
}

// Deletion functionality
// eslint-disable-next-line no-unused-vars
function deleteModal(id, name, leave = false) {
  const target = document.getElementById("deletemodal");
  if (leave) {
    target.querySelector(".modal-card-title").innerText = "Are you sure you'd like to leave this project?";
    target.querySelector("#confirm-delete > span:nth-child(2)").innerText = "Leave";
    target.querySelector("#confirm-delete > span.icon.is-small > i").style.width = "0";
    target.querySelector("#confirm-delete > span.icon.is-small > i").style.display = "none";
    target.querySelector("#confirm-delete > span.icon.is-small").style.width = "0";
  } else {
    target.querySelector(".modal-card-title").innerText = "Are you sure you'd like to delete this project?";
    target.querySelector("#confirm-delete > span:nth-child(2)").innerText = "Delete";
    target.querySelector("#confirm-delete > span.icon.is-small > i").style = null;
  }
  const checkName = () => {
    // Looks for the proper element
    document.getElementById("confirm-delete").disabled = document.getElementById("project-name-delete").value !== name;
  };

  // Checks the name
  checkName();

  // Enter/Escape functionality on modals
  const keyfunc = (key) => {
    if (key.key === "Escape") target.querySelector(".delete").click();
    if (key.key === "Enter") document.getElementById("confirm-delete").click();
  };
  document.addEventListener("keydown", keyfunc);

  // Gets the project to delete
  const deleteProject = async () => {
    document.getElementById("confirm-delete").classList.add("is-loading");
    if (!leave) await fetch("/api/deleteProject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name }),
    });
    else await fetch("/api/leaveProject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    });
    // Removes the is-loading class when finished
    document.getElementById("confirm-delete").classList.remove("is-loading");
    // Loads the no projects warning
    if (!document.getElementById("projectlist_") || document.getElementById("projectlist_").children.length / 2 <= 0) setTimeout(() => {
      $("#projectlist").load("/projects .none");
    }, 100);
    // Loads project list
    else $("#projectlist").load("/projects #projectlist_");
    document.removeEventListener("keydown", keyfunc);
    target.querySelector(".delete").click();
  };

  // Gets the project deletion IDs
  document.getElementById("project-name-delete").addEventListener("input", checkName);
  document.getElementById("confirm-delete").addEventListener("click", deleteProject);
  // Marks the target as active
  target.classList.add("is-active");

  // Click event listener
  target.querySelector(".delete").addEventListener("click", function() {
    target.classList.remove("is-active");
    document.getElementById("project-name-delete").value = "";
    document.getElementById("project-name-delete").removeEventListener("input", checkName);
    document.getElementById("confirm-delete").removeEventListener("click", deleteProject);
    document.removeEventListener("keydown", keyfunc);
  });
}

// Project logo functionality
window.addEventListener("load", async () => {
  const logo = document.getElementById("project-logo");
  // eslint-disable-next-line no-unused-vars
  let logob64;
  logo.addEventListener("change", () => {
    if (logo.files && logo.files[0] && logo.files[0].type.startsWith("image")) {
      // If file is bigger than 1mb
      if ((logo.files[0].size + 5) / 1000000 > 1) {
        logo.value = "";
        document.querySelector("#modal > div.modal-card > div > div > label > span.file-name").innerText = "No file selected";
        return switchText(document.querySelector("#modal > div.modal-card > div > p:nth-child(5)"), "#E74C3C", "You can't upload files bigger than 1mb.", 2000);
      }
      // b64 rendering
      const reader = new FileReader();
      reader.onload = () => {
        logob64 = reader.result;
        document.getElementById("logo-preview").src = reader.result;
        document.getElementById("logo-preview").parentElement.style.display = "flex";
      };
      reader.readAsDataURL(logo.files[0]);
    }
  });

  // Project creation functionality
  document.getElementById("confirm").addEventListener("click", async () => {
    const button = document.getElementById("confirm");
    const name = document.getElementById("project-name");
    // Returns an error if needed
    if (!name.value) return switchText(document.querySelector("#modal > div.modal-card > div > p:nth-child(1)"), "#E74C3C", "Provide a project name.", 2000);
    button.classList.add("is-loading");
    let res;
    // Project creation API
    res = await fetch("/api/createProject", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(logob64 ? { name: name.value, logo: logob64 } : { name: name.value }),
      headers: { "Content-Type": "application/json" },
    }).catch(err => res = err);
    $("#projectlist").load("/projects #projectlist_");
    // Shows if project already exists
    if (res.status !== 200) switchText(document.querySelector("#modal > div.modal-card > div > p:nth-child(1)"), "#E74C3C", "Couldn't create project.", 2000);
    else document.querySelector("#modal > div.modal-card > header > button").click();
    button.classList.remove("is-loading");
  });
});
