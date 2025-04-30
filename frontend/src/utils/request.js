import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:8000",
});
export default request;
// import axios from "axios";

// const request = axios.create({
//   baseURL: "https://quizzbackend-w9ec.onrender.com/",
// });
// export default request;
