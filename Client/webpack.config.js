var path = require("path");

module.exports = {
    mode: "development",
    entry: "./Program.fs.js",
    watch: true,
    output: {
        path: path.join(__dirname, "../ElmRemoting/Public"),
        filename: "bundle.js",
    },
}