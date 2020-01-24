import * as fs from "fs";
import * as https from "https";
import axios from "axios";
import FormData from "form-data";

const extract = (res, trueOrFalse: "true" | "false") => {
  const re = new RegExp(`<li class="${trueOrFalse}">(.*)<\/li>`, "g");
  const matches = res.data.matchAll(re);
  return Array.from(matches).map(match => match[1]);
};

const parse = res => {
  console.log(extract(res, "true"));
};

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
  .then(parse);
