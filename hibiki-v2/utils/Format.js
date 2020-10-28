/*
  Hibiki Format Utility

  This changes various things into prettier and
  more readble formats. Ir's all in one big file
  for simplicity's sake. You'll see it used in
  any commands and modules that use dates a lot.
*/

module.exports = {
  // Removes emojis from usernames and replaces them with the user's ID if the name is all emojis
  tag: (user, emojifilter = true) => {
    if (user && emojifilter == true) {
      return `${/[,.\-_a-zA-Z0-9 ]{1,32}/.exec(user.username) !== null ? /[,.\-_a-zA-Z0-9 ]{1,32}/.exec(user.username)[0] : user.id}#${user.discriminator}`;
    } else if (user && emojifilter == false) {
      return `${user.username}#${user.discriminator}`;
    }
    return undefined;
  },

  // Formats the verification level
  verificationlevel: verificationlevel => {
    switch (verificationlevel) {
      case 0:
        return "None";
      case 1:
        return "Low";
      case 2:
        return "Medium";
      case 3:
        return "High";
      case 4:
        return "Highest";
      default:
        return "Unknown";
    }
  },

  // Formats the verification level
  mfaLevel: mfaLevel => {
    switch (mfaLevel) {
      case 0:
        return "Disabled";
      case 1:
        return "Enabled";
      default:
        return "Unknown";
    }
  },

  // Formats the notification settings
  notifsettings: notifsettings => {
    switch (notifsettings) {
      case 0:
        return "All Messages";
      case 1:
        return "Only @mentions";
      default:
        return "Unknown";
    }
  },

  // Formats the content filter setting
  contentfilter: contentfilter => {
    switch (contentfilter) {
      case 0:
        return "Off";
      case 1:
        return "Only Roleless Members";
      case 2:
        return "All Members";
      default:
        return "Unknown";
    }
  },

  // Formats the tierlevel text
  tierlevel: tierlevel => {
    switch (tierlevel) {
      case 0:
        return "Level 0";
      case 1:
        return "Level 1";
      case 2:
        return "Level 2";
      case 3:
        return "Level 3";
      default:
        return "Unknown";
    }
  },

  // Formats the region info
  region: region => {
    switch (region) {
      case "amsterdam":
        return "Amsterdam :flag_nl:";
      case "brazil":
        return "Brazil :flag_br:";
      case "eu-central":
        return "Central Europe :flag_eu:";
      case "europe":
        return "Europe :flag_eu:";
      case "dubai":
        return "Dubai :flag_ae:";
      case "eu-west":
        return "Western Europe :flag_eu:";
      case "frankfurt":
        return "Frankfurt :flag_de:";
      case "hongkong":
        return "Hong Kong :flag_hk:";
      case "london":
        return "London :flag_gb:";
      case "japan":
        return "Japan :flag_jp:";
      case "russia":
        return "Russia :flag_ru:";
      case "singapore":
        return "Singapore :flag_sg:";
      case "southafrica":
        return "South Africa :flag_za:";
      case "sydney":
        return "Sydney :flag_au:";
      case "us-central":
        return "US Central :flag_us:";
      case "us-east":
        return "US East :flag_us:";
      case "us-south":
        return "US South :flag_us:";
      case "us-west":
        return "US West :flag_us:";
      case "india":
        return "India :flag_in:";
      default:
        return region;
    }
  },

  // Formats user status
  status: status => {
    switch (status) {
      case "online":
        return "Online";
      case "idle":
        return "Idle";
      case "dnd":
        return "Do not Disturb";
      case "offline":
        return "Offline/Invisible";
      default:
        return status;
    }
  },

  // Formats dates
  dateParse: (time, options = {
    hours: true,
    days: true,
    months: true,
    years: true,
    autohide: true,
  }) => {
    // Sets constants for date parsing
    if (!time) return undefined;
    let finalstring = "";
    let hour;
    let day;
    let month;
    let year;
    // Parses hours
    if (options.hours) {
      hour = time / 3600;
      if (options.autohide == true) finalstring = `${hour.toFixed(1)} hours`;
      if (!options.autohide) finalstring += `${hour.toFixed(1)} hours `;
    }

    // Parses days
    if (options.days) {
      day = time / 86400;
      if (hour > 24 && options.autohide == true) finalstring = `${day.toFixed(1)} days`;
      if (!options.autohide) finalstring += `${day.toFixed(0)} days `;
    }

    // Parses months
    if (options.months) {
      month = time / 2592000;
      if (day > 31 && options.autohide == true) finalstring = `${month.toFixed(1)} months`;
      if (!options.autohide) finalstring += `${month.toFixed(0)} months `;
    }

    // Parses years
    if (options.years) {
      year = time / 32140800;
      if (month > 12 && options.autohide == true) finalstring = `${year.toFixed(2)} years`;
      if (!options.autohide) finalstring += `${year.toFixed(0)} years`;
    }
    return finalstring;
  },

  // Formats uptime
  uptimeFormat: () => {
    let uptime = process.uptime();
    const date = new Date(uptime * 1000);
    const days = date.getUTCDate() - 1,
      hours = date.getUTCHours(),
      minutes = date.getUTCMinutes();
    let segments = [];
    if (days > 0) segments.push(`${days} day${days == 1 ? "" : "s"}`);
    if (hours > 0) segments.push(`${hours} hour${hours == 1 ? "" : "s"}`);
    if (minutes === 0) segments.push("Less than a minute");
    if (minutes > 0) segments.push(`${minutes} minute${minutes == 1 ? "" : "s"}`);
    const dateString = segments.join(", ");
    return dateString;
  },

  // Makes dates in commands look nicer
  prettyDate: (EpochDate, syear = true) => {
    // Creates the date.
    let date = new Date(EpochDate);
    // Sets the month names. These are their 3-character shortened versions for a much more beautiful and easy-to-read embed
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // Gets the month & date
    let month = monthNames[date.getMonth()];
    let day = date.getDate();
    // Sets the superscript for the dates
    if (day == 1 || day == 21 || day == 31) day = `${date.getDate()}st`;
    else if (day == 2 || day == 22 || day == 32) day = `${date.getDate()}nd`;
    else if (day == 3 || day == 23 || day == 32) day = `${date.getDate()}rd`;
    else day = `${date.getDate()}th`;
    // Gets the year, in full
    let year = date.getFullYear();
    // Gets the date & formats it properly
    let time = `${(date.getHours() < 10 ? "0" : "") + date.getHours()}:${(date.getMinutes() < 10 ? "0" : "") + date.getMinutes()}`;
    // Returns the formatted date/time
    return `${month} ${day}${syear ? ` ${year} ` : " "}${time}`;
  },

  // Formats OS platform
  formatOs: (platform, release) => {
    switch (platform) {
      case "darwin":
        return `macOS ${(parseFloat(release).toFixed(2) - parseFloat("7.6").toFixed(2) + parseFloat("0.03")).toFixed(2)}`;
      case "linux":
        return `Linux ${release}`;
      case "win32":
        return `Windows ${release}`;
      default:
        return platform;
    }
  },

  // Formats Nitro Boost guild features
  featureParse: (features) => {
    if (!features) return undefined;
    return features.map(feature => {
      switch (feature) {
        case "INVITE_SPLASH":
          return "Invite Splash";
        case "VANITY_URL":
          return "Vanity URL";
        case "ANIMATED_ICON":
          return "Animated Icon";
        case "PARTNERED":
          return "Partnered";
        case "VERIFIED":
          return "Verified";
        case "VIP_REGIONS":
          return "High Bitrate Voice Channel";
        case "PUBLIC":
          return "Public";
        case "LURKABLE":
          return "Lurkable";
        case "COMMERCE":
          return "Commerce Features";
        case "NEWS":
          return "News Channel";
        case "DISCOVERABLE":
          return "Searchable";
        case "FEATURABLE":
          return "Featured";
        case "BANNER":
          return "Banner";
        default:
          return feature;
      }
    });
  }
};
