(() => {
  async function getProject(id) {
    let res = await fetch(`/api/getProject?id=${id}`);
    res = await res.json();
    return res;
  }

  const id = document.getElementById("projectid").attributes.projectid.value;
  let cfg = getProject(id).then(c => {
    Object.getOwnPropertyNames(c).forEach(v => {
      const elem = document.getElementById(v);
      if (elem) elem.value = c[v];
    });
    cfg = c;
  });

  document.getElementById("save").onclick = async () => {
    Object.getOwnPropertyNames(cfg).forEach(v => {
      const elem = document.getElementById(v);
      if (elem) cfg[v] = elem.value;
    });
    await fetch(`/api/updateProject`, {
      method: "post",
      credentials: "include",
      body: JSON.stringify(cfg),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });
  };

  document.getElementById("genRandom").onclick = () => {
    let result = "";
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+=_-!@#$%^&*()";
    for (let i = 0; i < 24; i++) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }
    document.getElementById("Authorization").value = result;
  };
})();
