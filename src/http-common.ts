import axios from "axios";

export default axios.create({
  baseURL: "http://34.162.203.36:8080/v1",
  headers: {
    "Content-type": "application/json"
  }
});
