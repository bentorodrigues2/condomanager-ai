
export function required(value: any, field: string) {
    if (!value) throw new Error(`${field} é obrigatório`);
}
