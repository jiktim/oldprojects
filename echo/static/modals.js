// Modal functionality
document.querySelectorAll(".modal-button").forEach(function(el) {
  const target = document.querySelector(el.getAttribute("data-target"));
  const keyfunc = (key) => {
    if (key.key === "Escape") target.querySelector(".delete").click();
    if (key.key === "Enter") target.querySelector("#confirm").click();
  };
  // Key functionality on modals
  document.addEventListener("keydown", keyfunc);
  el.addEventListener("click", function() {
    target.classList.add("is-active");
    target.querySelector(".delete").addEventListener("click", function() {
      target.classList.remove("is-active");
      document.removeEventListener("keydown", keyfunc);
    });
  });
});

// Fineinput functionality
const fileInput = document.getElementById("project-logo");
fileInput.onchange = () => {
  if (fileInput.files.length > 0) {
    const fileName = document.getElementsByClassName("file-name")[0];
    fileName.textContent = fileInput.files[0].name;
  }
};
