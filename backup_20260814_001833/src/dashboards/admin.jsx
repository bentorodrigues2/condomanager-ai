
import Card from "../ui/components/Card";
import Loader from "../ui/components/Loader";
import Table from "../ui/components/Table";
import { useCondominios } from "../hooks/useCondominios";
import { useCondominos } from "../hooks/useCondominos";
import { usePagamentos } from "../hooks/usePagamentos";

export default function AdminDashboard() {
    const { data: condominios, loading: l1 } = useCondominios();
    const { data: pessoas, loading: l2 } = useCondominos();
    const { data: pagamentos, loading: l3 } = usePagamentos();

    if (l1 || l2 || l3) return <Loader />;

    return (
        <div>
            <Card title="Resumo Geral">
                <p>Total de Condomínios: {condominios.length}</p>
                <p>Total de Condóminos: {pessoas.length}</p>
                <p>Total de Pagamentos: {pagamentos.length}</p>
            </Card>

            <Card title="Condomínios">
                <Table data={condominios} />
            </Card>
        </div>
    );
}
