import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function TenantsForm() { return (<PageGuard role='gestor'>) {
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
            {p.name} â€” {p.email}
          </option>
        ))}
      </select>

      {tenant && <p>Inquilino atual: {tenant.profiles.name}</p>}
    </div></PageGuard>)
  );
}
