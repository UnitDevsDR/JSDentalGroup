    let page = 1;
    let status = "";

    const badgeClass = { NEW: "badge-new", CONTACTED: "badge-contacted", ARCHIVED: "badge-archived" };
    const badgeLabel = { NEW: "Nuevo", CONTACTED: "Contactado", ARCHIVED: "Archivado" };

    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    }

    async function load() {
      const q = status ? `?page=${page}&status=${status}` : `?page=${page}`;
      const { items, total, pageSize } = await api(`/leads${q}`);
      const rows = document.getElementById("rows");
      rows.innerHTML = items
        .map(
          (l) => `
        <tr>
          <td>${new Date(l.createdAt).toLocaleString("es-DO", { dateStyle: "medium", timeStyle: "short" })}</td>
          <td>${escapeHtml(l.name)}</td>
          <td>${escapeHtml(l.email)}${l.phone ? "<br>" + escapeHtml(l.phone) : ""}</td>
          <td>${escapeHtml(l.subject)}<br><span style="color:var(--muted)">${escapeHtml(l.message).slice(0, 120)}</span></td>
          <td><span class="badge ${badgeClass[l.status]}">${badgeLabel[l.status]}</span></td>
          <td>
            ${l.status !== "CONTACTED" ? `<button class="ghost small" data-id="${l.id}" data-set="CONTACTED">Contactado</button>` : ""}
            ${l.status !== "ARCHIVED" ? `<button class="ghost small" data-id="${l.id}" data-set="ARCHIVED">Archivar</button>` : ""}
          </td>
        </tr>`,
        )
        .join("");
      document.getElementById("page-label").textContent = `Página ${page} de ${Math.max(1, Math.ceil(total / pageSize))}`;
    }

    document.getElementById("rows").addEventListener("click", async (e) => {
      const btn = e.target.closest("button[data-id]");
      if (!btn) return;
      await api(`/leads/${btn.dataset.id}`, { method: "PATCH", body: JSON.stringify({ status: btn.dataset.set }) });
      load();
    });

    document.getElementById("filters").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-status]");
      if (!btn) return;
      [...document.querySelectorAll("#filters button")].forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      status = btn.dataset.status;
      page = 1;
      load();
    });

    document.getElementById("prev").addEventListener("click", () => { if (page > 1) { page--; load(); } });
    document.getElementById("next").addEventListener("click", () => { page++; load(); });
    document.getElementById("logout").addEventListener("click", async () => {
      await api("/auth/logout", { method: "POST" });
      window.location.href = "/admin/login";
    });

    requireSession().then((ok) => ok && load());
