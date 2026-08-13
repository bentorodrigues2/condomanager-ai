
import Card from "../ui/components/Card";
import Loader from "../ui/components/Loader";
import Table from "../ui/components/Table";
import { useAuditoria } from "../hooks/useAuditoria";

export default function AuditorDashboard() {
    const { data, loading } = useAuditoria();

    if (loading) return <Loader />;

    return (
        <div>
            <Card title="Registos de Auditoria">
                <Table data={data} />
            </Card>
        </div>
    );
}
