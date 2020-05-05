import * as fs from "fs";
import * as https from "https";
import axios from "axios";
import FormData from "form-data";
import { colorLog, oblig3ExerciseMap } from "./utils";

const extract = (res, trueOrFalse: "true" | "false") => {
  const re = new RegExp(`<li class="${trueOrFalse}">(.*)<\/li>`, "g");
  const matches = res.data.matchAll(re);
  return Array.from(matches).map(match => match[1]);
};

const parse = res => {
  const trueMatches = extract(res, "true");
  const falseMatches = extract(res, "false");

  return [trueMatches, falseMatches];
};

const printUsageAndDie = () => {
  console.log(
    "Usage:   mroblig-cli OBLIGNR FILENAME [OBLIG3 EXERCISE NUMBER]\nmroblig-cli 1 simpsons.ttl"
  );
  process.exit(0);
};

const usageCheck = (argv: string[]) =>
  argv.length >= 4 && ["1", "2", "3", "7"].includes(argv[2]);

export const main = argv => {
  if (!usageCheck(argv)) printUsageAndDie();

  const obligNr = argv[2];
  const ttlFile = fs.createReadStream(argv[3]);

  const formData = new FormData();
  formData.append(obligNr == "3" ? "sparqlfile" : "modelfile", ttlFile);
  if (argv[4]) {
    formData.append("exercise", oblig3ExerciseMap(argv[4]));
  }

  const instance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  });

  instance
    .post(`https://sws.ifi.uio.no/mroblig/${obligNr}`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    })
    .then(result => {
      console.log(result.data);
      return result;
    })
    .then(parse)
    .then(([trueMatches, falseMatches]) => {
      if (trueMatches.length === 0 && falseMatches.length === 0)
        return colorLog("Syntax error?", "31");

      colorLog(
        trueMatches.length === 0
          ? "No tests passed"
          : trueMatches.map(s => `True: ${s}`).join("\n"),
        "32"
      );

      console.log();
      colorLog(
        falseMatches.length === 0
          ? "No tests failed"
          : falseMatches.map(s => `False: ${s}`).join("\n"),
        "31"
      );

      const totalTests = trueMatches.length + falseMatches.length;
      console.log(
        `\nPassed (${trueMatches.length}/${totalTests}) - Failed (${falseMatches.length}/${totalTests})`
      );
    });
};

module.exports = main;
