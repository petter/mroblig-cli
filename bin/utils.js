"use strict";
exports.__esModule = true;
exports.colorLog = function (s, ansiColor) {
    return console.log("\u001B[" + ansiColor + "m%s\u001B[0m", s);
};
exports.oblig3ExerciseMap = function (n) {
    return [1, 3, 5, 6, 7, 8, 9][n - 1];
};
