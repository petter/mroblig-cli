"use strict";
exports.__esModule = true;
exports.colorLog = function (s, ansiColor) {
    return console.log("\u001B[" + ansiColor + "m%s\u001B[0m", s);
};
