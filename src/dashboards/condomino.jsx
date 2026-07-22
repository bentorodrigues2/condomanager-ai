
import Card from "../ui/components/Card";
import Loader from "../ui/components/Loader";
import Table from "../ui/components/Table";
import { usePagamentos } from "../hooks/usePagamentos";

export default function CondominoDashboard() {
    const { data: pagamentos, loading } = usePagamentos();

    if (loading) return <Loader />;

    return (
        <div>
            <Card title="Os Meus Pagamentos">
                <Table data={pagamentos} />
            </Card>
        </div>
    );
}
