export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function getValidToken() {
  const token = localStorage.getItem("token");
  return token;
}

export function setUid(uid: string) {
  localStorage.setItem("uid", uid);
}

export function getValidUid() {
  const uid = localStorage.getItem("uid");
  return uid;
}

export function getValidRole() {
  const role = localStorage.getItem("role");
  return role;
}

export function logout() {
  localStorage.removeItem("token");
}
