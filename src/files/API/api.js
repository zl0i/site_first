import axios from "axios";

export function getMenuData() {
  return axios.get("https://zloi.space/restaurant/api/shops");
}

export function authByPass(login, password) {
  return axios.post("https://zloi.space/restaurant/api/auth/password", {
    login: login,
    password: password,
  });
}

export function authByPhone(phone) {
  return axios.post("https://zloi.space/restaurant/api/auth/phone", {
    phone: phone,
  });
}

export function authPhoneCode(phone, code) {
  return axios.post("https://zloi.space/restaurant/api/auth/code", {
    phone: phone,
    code: code,
  });
}
export function authByToken(method) {
  let url =
    "https://zloi.space/restaurant/api/oauth?method=" + method + "&device=web";
  window.open(url, "", "width=700,height=500,left=200,top=200");
}