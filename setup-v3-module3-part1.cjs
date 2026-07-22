const fs = require("fs");
const path = require("path");

function createDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log("Created:", dir);
    }
}

function createFile(file, content) {
    fs.writeFileSync(file, content);
    console.log("Created:", file);
}

const src = path.join(__dirname, "src");

// Ensure supabase folder exists
const supabaseDir = path.join(src, "supabase");
createDir(supabaseDir);

// Ensure services folder exists
const servicesDir = path.join(src, "services");
createDir(servicesDir);

// Ensure hooks folder exists
const hooksDir = path.join(src, "hooks");
createDir(hooksDir);

// SERVICES TO GENERATE
const tables = [
    "condominios",
    "fracoes",
    "condominos",
    "fornecedores",
    "pagamentos",
    "incidencias",
    "auditoria",
    "tarefas",
    "assembleias",
    "documentos"
];

// Generate service files
tables.forEach((table) => {
    const filePath = path.join(servicesDir, `${table}.ts`);
    createFile(
        filePath,
        `
import { supabase } from "../supabase/supabaseClient";

export async function get_${table}() {
    const { data, error } = await supabase
        .from("${table}")
        .select("*")
        .order("criado_em", { ascending: false });

    if (error) throw error;
    return data;
}

export async function add_${table}(payload: any) {
    const { data, error } = await supabase
        .from("${table}")
        .insert(payload)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function update_${table}(id: string, payload: any) {
    const { data, error } = await supabase
        .from("${table}")
        .update(payload)
        .eq("id", id)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function delete_${table}(id: string) {
    const { error } = await supabase
        .from("${table}")
        .delete()
        .eq("id", id);

    if (error) throw error;
    return true;
}
`
    );
});

// Generate hooks
tables.forEach((table) => {
    const pascal =
        table.charAt(0).toUpperCase() + table.slice(1);
    const filePath = path.join(hooksDir, `use${pascal}.ts`);
    createFile(
        filePath,
        `
import { useEffect, useState } from "react";
import { get_${table} } from "../services/${table}";

export function use${pascal}() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await get_${table}();
                setData(res);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return { data, loading };
}
`
    );
});

// Create API index
createFile(
    path.join(servicesDir, "index.ts"),
    tables.map((t) => `export * from "./${t}";`).join("\n")
);

console.log("MODULE 3 — PART 1 COMPLETED");
console.log("Agora corre: node setup-v3-module3-part1.cjs");
