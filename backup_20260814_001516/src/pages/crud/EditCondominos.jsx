
import { useState, useEffect } from "react";
import Input from "../../ui/form/Input";
import Button from "../../ui/form/Button";
import { update_condominos, get_condominos } from "../../services/condominos";
import { useParams } from "react-router-dom";

export default function EditCondominos() {
    const { id } = useParams();
    const [form, setForm] = useState(null);

    useEffect(() => {
        async function load() {
            const data = await get_condominos();
            const item = data.find((i) => i.id === id);
            setForm(item);
        }
        load();
    }, [id]);

    if (!form) return <p>A carregar...</p>;

    const update = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const save = async () => {
        await update_condominos(id, form);
        alert("Condominos atualizado com sucesso!");
    };

    return (
        <div>
            <h2>Editar Condominos</h2>

            {Object.keys(form).map((key) => (
                <Input
                    key={key}
                    label={key}
                    value={form[key]}
                    onChange={(v) => update(key, v)}
                />
            ))}

            <Button onClick={save}>Guardar Alterações</Button>
        </div>
    );
}
