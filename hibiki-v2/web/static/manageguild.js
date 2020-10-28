/*
  Hibiki Dashboard Communicator

  This tells the bot how to communicate
  between the frontend and the backend.
*/

// Gets the config's ID
async function getConfig(id) {
  let res = await fetch(`/api/getconfig/${id}`, { credentials: "include" });
  let body = await res.json();
  return body;
}

// Update config function
async function updateConfig(id, cfg) {
  return await fetch(`/api/updateconfig/${id}`, {
    method: "post",
    credentials: "include",
    body: JSON.stringify(cfg),
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
  })
}

// Creates a copy of the original config
let ocfg;

// Adds the event listener
window.addEventListener("load", async () => {
  let id = /manage\/([\d]{17,19})/.exec(document.URL)[1];
  // Sets the setup items
  let res = await fetch(`/api/getitems`, { credentials: "include" });
  let dbitems = await res.json();
  res = await fetch(`/api/getitems?commands=true`, {
    credentials: "include"
  });
  let cmds = await res.json();
  const items = dbitems.map(p => p.id);
  // Returns if it's an invalid id
  if (!id) return;
  // Looks for the config
  let cfg = await getConfig(id);
  ocfg = { ...cfg };

  // Logic to make some elements hidden when they aren't needed
  function visibilityLogic() {
    // Checks if the type of AntiSpam is a bool incase it isn't set
    if (typeof cfg.AntiSpam == "boolean") {
      document.getElementById("spamPunishments").parentElement.parentElement.children[2].hidden = !cfg.AntiSpam
      document.getElementById("spamPunishments").parentElement.hidden = !cfg.AntiSpam
    }

    if (typeof cfg.AntiInvite == "boolean") {
      document.getElementById("invitePunishments").parentElement.parentElement.children[2].hidden = !cfg.AntiInvite
      document.getElementById("invitePunishments").parentElement.hidden = !cfg.AntiInvite
    }

    document.getElementById("joinMessage").parentElement.parentElement.hidden = document.querySelector("#leavejoin > select").value == "None";
    document.getElementById("leaveMessage").parentElement.parentElement.hidden = document.querySelector("#leavejoin > select").value == "None";
  }

  // Sets the config to be blank if needed
  if (!cfg) cfg = {};

  visibilityLogic();
  // Limits the length of the textboxes
  [document.getElementById("prefix"), document.getElementById("joinMessage"), document.getElementById("leaveMessage")].forEach(d => {
    d.addEventListener("input", (starget) => {
      let e = starget.target;
      if (e.id == "prefix" && e.value.length > 15) e.value = e.value.substring(0, 15);
      if (e.id == "joinMessage" && e.value.length > 100) e.value = e.value.substring(0, 100);
      if (e.id == "leaveMessage" && e.value.length > 100) e.value = e.value.substring(0, 100);
    });
  });
  // Gets each element & type
  Object.keys(cfg).forEach(p => {
    let element = document.getElementById(p);
    // Returns if there's no element
    if (!element && p != "disabledCategories") return;
    // Finds the type
    let type = dbitems.find(pr => pr.id == p).type;
    // Boolean handler
    if (type == "bool") {
      if (cfg[p] === true) document.getElementById(p).children[0].children[0].checked = true;
      else document.getElementById(p).children[1].children[0].checked = true;
      // Number handler
    } else if (type == "number") {
      document.getElementById(p).children[0].value = Array.from(document.getElementById(p).children[0].children).find(n => n.innerText.split(" ")[0] == cfg[p]).innerText;
      // Punishment handler
    } else if (type == "punishment") {
      cfg[p].forEach(punishment => {
        if (punishment == "Purge") document.getElementById(p).children[0].checked = true;
        if (punishment == "Mute") document.getElementById(p).children[2].checked = true;
        if (punishment == "Strike") document.getElementById(p).children[4].checked = true;
      });
      // Channel ID/Role ID handler
    } else if (type == "channelID" || type == "roleID") {
      let opt = Array.from(element.children[0].children).find(a => a.id == cfg[p]);
      if (!opt) return;
      document.getElementById(p).children[0].value = opt.innerText;
      // String handler
    } else if (type == "string") {
      element.value = cfg[p];
    } else if (type == "roleArray") {
      if (typeof cfg[p] != "object") cfg[p] = [cfg[p]];
      let roles = [];
      let cc = [];
      let aSelects = Array.from(document.querySelector(`#${p} > div > div > ul`).children);
      aSelects.forEach(e => {
        if (!e.children[0]) return;
        roles.push(e.children[0].children[0].value)
      })
      roles.forEach(r => {
        let id = /.{1,32} \(([0-9]{16,19})\)/.exec(r)[1];
        if (cfg[p] && cfg[p].includes(id)) cc.push(r);
      });
      $(document.getElementById("autorole").children[0]).multipleSelect("setSelects", cc)
    } else if (p == "disabledCmds") {
      $("#disabledCmds > select").multipleSelect("setSelects", [...cfg[p], ...$("#disabledCmds > select").multipleSelect("getSelects")]);
    } else if (p == "disabledCategories") {
      let cc = $("#disabledCmds > select").multipleSelect("getSelects");
      cfg[p].forEach(cat => {
        let ccmds = cmds.find(cmd => cmd.label == cat).children.map(child => child.value);
        cc = [...ccmds, ...cc];
      });
      $("#disabledCmds > select").multipleSelect("setSelects", cc);
    }
  });

  function refreshLocalConfig() {
    items.forEach(p => {
      // Gets the items
      let type = dbitems.find(c => c.id == p).type;
      let element = document.getElementById(p);
      // Returns if it's an invalid element
      if (!element) return;
      // Boolean handler
      if (type == "bool") {
        cfg[p] = document.getElementById(p).children[0].children[0].checked;
        // Number handler
      } else if (type == "number") {
        cfg[p] = parseInt(document.getElementById(p).children[0].value.split(" ")[0]);
        // Punishment handler
      } else if (type == "punishment") {
        let Purge = document.getElementById(p).children[0].checked;
        let Mute = document.getElementById(p).children[2].checked;
        let Strike = document.getElementById(p).children[4].checked;
        cfg[p] = [];
        if (Purge) cfg[p].push("Purge");
        if (Mute) cfg[p].push("Mute");
        if (Strike) cfg[p].push("Strike");
        // Channel/Role ID handler
      } else if (type == "channelID" || type == "roleID") {
        let r = Array.from(element.children[0].children).find(a => a.innerText == element.children[0].value).id;
        cfg[p] = !r || r.toLowerCase() == "none" ? null : r;
      } else if (type == "string") {
        cfg[p] = element.value;
        // RoleArray handler
      } else if (type == "roleArray") {
        let values = $(document.getElementById(p).children[0]).val();
        let ids = [];
        values.forEach(v => {
          // bestest dev
          ids.push(/.{1,32} \(([0-9]{16,19})\)/.exec(v)[1]);
        });
        cfg[p] = ids;
      }
    });
    // Disabled commands/categories
    let disabledcats = [];
    let disabledcmds = $("#disabledCmds > select").multipleSelect("getSelects");
    document.querySelector("#disabledCmds > div > div > ul").children.forEach(c => {
      if (c.children.length && c.children[0].classList[0] && c.children[0].children[0].checked)
        disabledcats.push(c.children[0].innerText.replace(/\s/g, ""));
    });
    cfg.disabledCmds = disabledcmds.filter(cmd => !disabledcats.includes(cmds.find(c => c.children.find(child => child.value == cmd)).label));
    cfg.disabledCategories = disabledcats;
  }

  // Submission handler
  document.getElementById("submit").addEventListener("click", async () => {
    let button = document.getElementById("submit");
    button.classList.add("is-loading");
    refreshLocalConfig();
    // Updates the original config
    ocfg = { ...cfg };
    // Updates the config
    updateConfig(id, cfg).then((res) => {
      if (res.status == 200) {
        button.classList.remove("is-loading");
        button.classList.remove("is-light");
        button.classList.add("is-success");
        document.getElementById("saved").innerText = "Configuration saved";
        setTimeout(() => {
          document.getElementById("saved").innerText = "Save configuration";
          button.classList.add("is-light");
          button.classList.remove("is-success");
        }, 2000);
      } else {
        document.getElementById("saved").innerText = "An error occurred, please refresh";
        button.classList.add("is-error");
        button.classList.remove("is-success");
      }
    });
  });

  // Checks for differences between the original and the local config
  function cfgDiff() {
    refreshLocalConfig();
    visibilityLogic();
    // Compares the stringified objects because you can't compare arrays/objects in js
    if (JSON.stringify(ocfg) != JSON.stringify(cfg)) window.onbeforeunload = function() {
      return "Do you really want to leave?";
    };
    else window.onbeforeunload = null;
  }
  document.addEventListener("click", cfgDiff);
  document.addEventListener("input", cfgDiff);
});
