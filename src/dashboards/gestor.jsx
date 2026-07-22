
import Card from "../ui/components/Card";
import Loader from "../ui/components/Loader";
import Table from "../ui/components/Table";
import { useIncidencias } from "../hooks/useIncidencias";
import { useTarefas } from "../hooks/useTarefas";

export default function GestorDashboard() {
    const { data: incidencias, loading: l1 } = useIncidencias();
    const { data: tarefas, loading: l2 } = useTarefas();

    if (l1 || l2) return <Loader />;

    return (
        <div>
            <Card title="Resumo do Gestor">
                <p>Incidências Abertas: {incidencias.length}</p>
                <p>Tarefas Pendentes: {tarefas.length}</p>
            </Card>

            <Card title="Incidências">
                <Table data={incidencias} />
            </Card>
        </div>
    );
}
