
import Card from "../ui/components/Card";
import Loader from "../ui/components/Loader";
import Table from "../ui/components/Table";
import { usePagamentos } from "../hooks/usePagamentos";

export default function ContabilidadeDashboard() {
    const { data, loading } = usePagamentos();

    if (loading) return <Loader />;

    return (
        <div>
            <Card title="Pagamentos">
                <Table data={data} />
            </Card>
        </div>
    );
}
