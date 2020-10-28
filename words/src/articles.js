const app = require("./app");
const fs = require("fs");

module.exports = {
    getLatestFolder: function() {
        // Hacky. Really hacky. No, hackier than that.
        let files = [];
        fs.readdirSync("./posts").forEach(file => {
            if (!file.startsWith(".git")) {
                files.push(file.replace("-", ""));
            }
        });
        return files.sort((a, b) => b - a)[0].match(/.{1,4}/g).join("-");
    },

    getLatestArticles: function() {
        // How does this work ???
        let articles = [];
        let latestFolder = this.getLatestFolder();
        fs.readdirSync(`./posts/${latestFolder}`).forEach(article => {
            if (article.endsWith(".json")) {
                // TODO: add encoding detection
                let articleContent = fs.readFileSync(`./posts/${latestFolder}/${article}`, "utf8");
                let priority = JSON.parse(articleContent).priority;
                let biggestStory = JSON.parse(articleContent).shouldBeBiggestStory;
                articles.push({priority, article, biggestStory});
            }
        });
        // I am going to call the police
        let sbp = articles.sort((a, b) => b.priority - a.priority);
        let front = sbp.find(element => element.biggestStory == true);
        return [front.article, sbp.map(x => { return x.article; })];
    },

    fetchRecentArticleJSON: function(article) {
        // less hacky
        let latestFolder = this.getLatestFolder();
        return fs.readFileSync(`./posts/${latestFolder}/${article}`, "utf8");
    },

    fetchArticleJSON: function(folder, article) {
        return fs.readFileSync(`./posts/${folder}/${article}`, "utf8");
    }
}