export const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    localStorage.clear(); // Очищаем токены из localStorage
    window.location.href = "/dashboard/login"; // Перенаправление на страницу логина
  }
};
