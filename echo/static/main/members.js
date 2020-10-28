(() => {
  const projectid = document.getElementById("projectid").attributes.projectid.value;

  function onInput(id, role) {
    return async () => {
      await fetch("/api/updateMember", {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: projectid,
          member: id,
          role: role.value,
        }),
      });
    };
  }
  Array.from(document.getElementById("memberlist").children).forEach(member => {
    const id = member.id;
    const role = document.querySelector(`[id="${id}"] > #name > #role`);
    if (role.disabled) return;
    role.addEventListener("input", onInput(id, role));
  });
})();
