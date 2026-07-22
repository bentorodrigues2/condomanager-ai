
import { useState } from "react";
import Input from "../../ui/form/Input";
import Button from "../../ui/form/Button";
import { add_documentos } from "../../services/documentos";

export default function CreateDocumentos() {
    const [form, setForm] = useState({});

    const update = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const save = async () => {
        await add_documentos(form);
        alert("Documentos criado com sucesso!");
    };

    return (
        <div>
            <h2>Criar Documentos</h2>

            {Object.keys(form).map((key) => (
                <Input
                    key={key}
                    label={key}
                    value={form[key]}
                    onChange={(v) => update(key, v)}
                />
            ))}

            <Button onClick={save}>Guardar</Button>
        </div>
    );
}
