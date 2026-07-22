
import { useState } from "react";
import Input from "../../ui/form/Input";
import Button from "../../ui/form/Button";
import { add_fracoes } from "../../services/fracoes";

export default function CreateFracoes() {
    const [form, setForm] = useState({});

    const update = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const save = async () => {
        await add_fracoes(form);
        alert("Fracoes criado com sucesso!");
    };

    return (
        <div>
            <h2>Criar Fracoes</h2>

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
