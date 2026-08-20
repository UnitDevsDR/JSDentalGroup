document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById("error");
  errorEl.hidden = true;
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
      credentials: "same-origin",
      body: JSON.stringify({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
      }),
    });
    if (!res.ok) throw new Error();
    window.location.href = "/admin";
  } catch {
    errorEl.textContent = "Correo o contraseña incorrectos.";
    errorEl.hidden = false;
  }
});
