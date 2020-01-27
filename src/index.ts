import * as fs from "fs";
import * as https from "https";
import axios from "axios";
import FormData from "form-data";
import { colorLog } from "./utils";

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

if (typeof require !== "undefined" && require.main === module) {
  console.log(process.argv[2]);
  const ttlFile = fs.createReadStream(process.argv[2]);
  const formData = new FormData();
  formData.append("modelfile", ttlFile);

  const instance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  });

  instance
    .post("https://sws.ifi.uio.no/mroblig/1", formData, {
      headers: {
        ...formData.getHeaders()
      }
    })
    .then(parse)
    .then(([trueMatches, falseMatches]) => {
      if (trueMatches.length === 0 && falseMatches.length === 0)
        return colorLog("Syntax error?", "31");

      colorLog("True matches:", "32");
      colorLog(trueMatches.map(s => `True: ${s}`).join("\n"), "32");

      colorLog("\nFalse matches:", "31");
      colorLog(falseMatches.map(s => `False: ${s}`).join("\n"), "31");
    });
}
