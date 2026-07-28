import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function OwnersForm() { return (<PageGuard role='gestor'>) {
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
      <h1>ProprietÃ¡rios</h1>

      <select onChange={(e) => addOwner(e.target.value)}>
        <option value="">Adicionar proprietÃ¡rio...</option>
        {profiles.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} â€” {p.email}
          </option>
        ))}
      </select>

      <ul>
        {owners.map((o) => (
          <li key={o.id}>
            {o.profiles.name}
            {canAccess('gestor') && <button onClick={() => removeOwner(o.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div></PageGuard>)
  );
}
