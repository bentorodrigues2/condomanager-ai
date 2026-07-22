# Criar diretórios
New-Item -ItemType Directory -Force -Path "src/services" | Out-Null
New-Item -ItemType Directory -Force -Path "src/pages" | Out-Null

# Função para escrever ficheiros sem BOM
function Write-File($path, $content) {
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
}

# 1) fractionsService.ts
Write-File "src/services/fractionsService.ts" @'
import { supabase } from "../supabaseClient";

export async function getFractions(buildingId) {
  if (buildingId) {
    return await supabase
      .from("fractions")
      .select("*")
      .eq("building_id", buildingId)
      .order("code");
  }
  return await supabase.from("fractions").select("*").order("code");
}

export async function getFraction(id) {
  return await supabase.from("fractions").select("*").eq("id", id).single();
}

export async function createFraction(data) {
  return await supabase.from("fractions").insert(data);
}

export async function updateFraction(id, data) {
  return await supabase.from("fractions").update(data).eq("id", id);
}

export async function deleteFraction(id) {
  return await supabase.from("fractions").delete().eq("id", id);
}
'@

# 2) FractionsList.tsx
Write-File "src/pages/FractionsList.tsx" @'
import React, { useEffect, useState } from "react";
import { getFractions, deleteFraction } from "../services/fractionsService";
import { Link, useParams } from "react-router-dom";

export default function FractionsList() {
  const { buildingId } = useParams();
  const [fractions, setFractions] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await getFractions(buildingId);
    setFractions(data || []);
  }

  async function remove(id) {
    await deleteFraction(id);
    load();
  }

  return (
    <div>
      <h1>Frações</h1>
      <Link to={`/fractions/new?building=${buildingId}`}>Nova Fração</Link>

      <ul>
        {fractions.map((f) => (
          <li key={f.id}>
            {f.code} — {f.typology} — {f.area} m²
            <Link to={`/fractions/${f.id}`}>Editar</Link>
            <button onClick={() => remove(f.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
'@

# 3) FractionForm.tsx
Write-File "src/pages/FractionForm.tsx" @'
import React, { useEffect, useState } from "react";
import { createFraction, getFraction, updateFraction } from "../services/fractionsService";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export default function FractionForm() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const buildingId = params.get("building");

  const navigate = useNavigate();

  const [form, setForm] = useState({
    code: "",
    typology: "",
    area: "",
    floor: "",
    building_id: buildingId
  });

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function load() {
    const { data } = await getFraction(id);
    setForm(data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function save() {
    if (id) await updateFraction(id, form);
    else await createFraction(form);

    navigate(`/buildings/${buildingId}/fractions`);
  }

  return (
    <div>
      <h1>{id ? "Editar Fração" : "Nova Fração"}</h1>

      <input name="code" placeholder="Código" value={form.code} onChange={handleChange} />
      <input name="typology" placeholder="Tipologia" value={form.typology} onChange={handleChange} />
      <input name="area" placeholder="Área (m²)" value={form.area} onChange={handleChange} />
      <input name="floor" placeholder="Piso" value={form.floor} onChange={handleChange} />

      <button onClick={save}>Guardar</button>
    </div>
  );
}
'@

# 4) OwnersForm.tsx
Write-File "src/pages/OwnersForm.tsx" @'
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function OwnersForm() {
  const { fractionId } = useParams();
  const [owners, setOwners] = useState([]);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    loadOwners();
    loadProfiles();
  }, []);

  async function loadOwners() {
    const { data } = await supabase
      .from("fraction_owners")
      .select("*, profiles(*)")
      .eq("fraction_id", fractionId);
    setOwners(data || []);
  }

  async function loadProfiles() {
    const { data } = await supabase.from("profiles").select("*");
    setProfiles(data || []);
  }

  async function addOwner(profileId) {
    await supabase.from("fraction_owners").insert({
      fraction_id: fractionId,
      profile_id: profileId
    });
    loadOwners();
  }

  async function removeOwner(id) {
    await supabase.from("fraction_owners").delete().eq("id", id);
    loadOwners();
  }

  return (
    <div>
      <h1>Proprietários</h1>

      <select onChange={(e) => addOwner(e.target.value)}>
        <option value="">Adicionar proprietário...</option>
        {profiles.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} — {p.email}
          </option>
        ))}
      </select>

      <ul>
        {owners.map((o) => (
          <li key={o.id}>
            {o.profiles.name}
            <button onClick={() => removeOwner(o.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
'@

# 5) TenantsForm.tsx
Write-File "src/pages/TenantsForm.tsx" @'
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function TenantsForm() {
  const { fractionId } = useParams();
  const [tenant, setTenant] = useState(null);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    loadTenant();
    loadProfiles();
  }, []);

  async function loadTenant() {
    const { data } = await supabase
      .from("fraction_tenants")
      .select("*, profiles(*)")
      .eq("fraction_id", fractionId)
      .single();
    setTenant(data);
  }

  async function loadProfiles() {
    const { data } = await supabase.from("profiles").select("*");
    setProfiles(data || []);
  }

  async function setNewTenant(profileId) {
    await supabase.from("fraction_tenants").delete().eq("fraction_id", fractionId);
    await supabase.from("fraction_tenants").insert({
      fraction_id: fractionId,
      profile_id: profileId
    });
    loadTenant();
  }

  return (
    <div>
      <h1>Inquilino</h1>

      <select onChange={(e) => setNewTenant(e.target.value)}>
        <option value="">Selecionar inquilino...</option>
        {profiles.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} — {p.email}
          </option>
        ))}
      </select>

      {tenant && <p>Inquilino atual: {tenant.profiles.name}</p>}
    </div>
  );
}
'@

# 6) Rotas
Add-Content -Path "src/router/AppRouter.tsx" -Value @'
<Route path="/buildings/:buildingId/fractions" element={<FractionsList />} />
<Route path="/fractions/new" element={<FractionForm />} />
<Route path="/fractions/:id" element={<FractionForm />} />
<Route path="/fractions/:fractionId/owners" element={<OwnersForm />} />
<Route path="/fractions/:fractionId/tenant" element={<TenantsForm />} />
'@

Write-Host "CRUD das Frações criado com sucesso!"
