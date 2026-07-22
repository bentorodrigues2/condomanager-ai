
export function handleError(error: any) {
    console.error("Supabase Error:", error);
    return { error: true, message: error.message || "Erro desconhecido" };
}
