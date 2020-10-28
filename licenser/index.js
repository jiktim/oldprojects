"use strict";

const inquirer = require("inquirer");
const licenses = require("./licenses.json");

async function creativecommons() {
    // flags
    let BY, SA, NC, ND = 0;

    let credit = await inquirer.prompt([{type:"list",name:"credit",message:"Would you like to be credited?",choices:["Yes","No"]}]);
    let commercial = await inquirer.prompt([{type:"list",name:"commercial",message:"Would you like commercial uses of your work?",choices:["Yes","No"]}]);
    let derivative = await inquirer.prompt([{type:"list",name:"derivative",message:"Would you like derivatives and adaptations of your work?",choices:["Yes","No"]}]);

    let sharealike = {sharealike: "No"};
    if (derivative.derivative === "Yes" || credit.credit === "Yes") {
        sharealike = await inquirer.prompt([{type:"list",name:"sharealike",message:"Should adaptations be shared under the same terms?",choices:["Yes","No"]}]);
    }

    // flags 2
    if (credit.credit === "Yes") BY = 1; 
    if (commercial.commercial === "No") NC = 1;
    if (derivative.derivative === "No") ND = 1;
    if (sharealike.sharealike === "Yes") SA = 1;

    // flags to string
    let licenseCode = "";
    if (BY) licenseCode += "BY ";
    if (NC) licenseCode += "NC ";
    if (ND) licenseCode += "ND ";
    if (SA) licenseCode += "SA ";

    let total = licenseCode.replace(/ /g, "-").slice(0, -1);
    licenseCode = `CC ${total}`;
    if (total == "SA" || total == "" || BY == 0) {
        licenseCode = "CC0"
    }
    console.log("You will need:")
    console.log(licenseCode);
    console.log(`SPDX: ${licenseCode.replace(/ /g, "-")}-${licenseCode == "CC0" ? 1 : 4}.0`)
    console.log(`${licenses[licenseCode].basicDesc}`)
    console.log(`${licenses[licenseCode].licenseSite}`)
    console.log(`${licenses[licenseCode].legalLink}`)
}

async function main() {
    let mediatype = await inquirer.prompt([
        {
        type: "list",
        name: "mediatype",
        message: "What would you like to license?",
        choices: [
            "Software",
            "Datasets",
            "Media",
            "Fonts",
            "Hardware",
            "Other"
        ],
        }
    ]);

    if (mediatype.mediatype == "Datasets" || mediatype.mediatype == "Media" || mediatype.mediatype == "Other") {
        creativecommons();
    }
}

main();
