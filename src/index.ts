import * as fs from "fs";
import * as https from "https";
import axios from "axios";
import FormData from "form-data";

fs.read;

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
  .then(res => {
    console.log(res.data);
  });
