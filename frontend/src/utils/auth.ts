export function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

export function getRole() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("role");
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
}