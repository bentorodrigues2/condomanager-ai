
import Card from "../ui/components/Card";
import Loader from "../ui/components/Loader";
import Table from "../ui/components/Table";
import { useTarefas } from "../hooks/useTarefas";

export default function LimpezasDashboard() {
    const { data, loading } = useTarefas();

    if (loading) return <Loader />;

    return (
        <div>
            <Card title="Tarefas de Limpeza">
                <Table data={data} />
            </Card>
        </div>
    );
}
