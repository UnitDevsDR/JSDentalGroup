async function load() {
  const settings = await api("/settings");
  for (const { key, value } of settings) {
    const el = document.getElementById(key);
    if (el) el.value = value;
  }
}

document.getElementById("settings-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  await Promise.all([
    api("/settings/gtmId", { method: "PUT", body: JSON.stringify({ value: document.getElementById("gtmId").value }) }),
    api("/settings/gscVerification", {
      method: "PUT",
      body: JSON.stringify({ value: document.getElementById("gscVerification").value }),
    }),
  ]);
  const saved = document.getElementById("saved");
  saved.hidden = false;
  setTimeout(() => (saved.hidden = true), 2500);
});

document.getElementById("logout").addEventListener("click", async () => {
  await api("/auth/logout", { method: "POST" });
  window.location.href = "/admin/login.html";
});

requireSession().then((ok) => ok && load());
