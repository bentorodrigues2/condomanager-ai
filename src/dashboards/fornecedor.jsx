
import Card from "../ui/components/Card";
import Loader from "../ui/components/Loader";
import Table from "../ui/components/Table";
import { useFornecedores } from "../hooks/useFornecedores";

export default function FornecedorDashboard() {
    const { data, loading } = useFornecedores();

    if (loading) return <Loader />;

    return (
        <div>
            <Card title="Registo de Fornecedores">
                <Table data={data} />
            </Card>
        </div>
    );
}
