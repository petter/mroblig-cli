"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs = __importStar(require("fs"));
var https = __importStar(require("https"));
var axios_1 = __importDefault(require("axios"));
var form_data_1 = __importDefault(require("form-data"));
var utils_1 = require("./utils");
var extract = function (res, trueOrFalse) {
    var re = new RegExp("<li class=\"" + trueOrFalse + "\">(.*)</li>", "g");
    var matches = res.data.matchAll(re);
    return Array.from(matches).map(function (match) { return match[1]; });
};
var parse = function (res) {
    var trueMatches = extract(res, "true");
    var falseMatches = extract(res, "false");
    return [trueMatches, falseMatches];
};
var printUsageAndDie = function () {
    console.log("Usage:   mroblig-cli OBLIGNR FILENAME [OBLIG3 EXERCISE NUMBER]\nmroblig-cli 1 simpsons.ttl");
    process.exit(0);
};
var usageCheck = function (argv) {
    return argv.length >= 4 && ["1", "2", "3"].includes(argv[2]);
};
exports.main = function (argv) {
    if (!usageCheck(argv))
        printUsageAndDie();
    var obligNr = argv[2];
    var ttlFile = fs.createReadStream(argv[3]);
    var formData = new form_data_1["default"]();
    formData.append(obligNr == "3" ? "sparqlfile" : "modelfile", ttlFile);
    if (argv[4]) {
        formData.append("exercise", utils_1.oblig3ExerciseMap(argv[4]));
    }
    var instance = axios_1["default"].create({
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        })
    });
    instance
        .post("https://sws.ifi.uio.no/mroblig/" + obligNr, formData, {
        headers: __assign({}, formData.getHeaders())
    })
        .then(function (result) {
        console.log(result.data);
        return result;
    })
        .then(parse)
        .then(function (_a) {
        var trueMatches = _a[0], falseMatches = _a[1];
        if (trueMatches.length === 0 && falseMatches.length === 0)
            return utils_1.colorLog("Syntax error?", "31");
        utils_1.colorLog(trueMatches.length === 0
            ? "No tests passed"
            : trueMatches.map(function (s) { return "True: " + s; }).join("\n"), "32");
        console.log();
        utils_1.colorLog(falseMatches.length === 0
            ? "No tests failed"
            : falseMatches.map(function (s) { return "False: " + s; }).join("\n"), "31");
        var totalTests = trueMatches.length + falseMatches.length;
        console.log("\nPassed (" + trueMatches.length + "/" + totalTests + ") - Failed (" + falseMatches.length + "/" + totalTests + ")");
    });
};
module.exports = exports.main;
