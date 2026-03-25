import axios from "axios";

const BASE_URL = "https://saavn.sumit.co/api/";

export const saavnApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});
