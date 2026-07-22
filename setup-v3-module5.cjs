const fs = require("fs");
const path = require("path");

function createFile(file, content) {
    fs.writeFileSync(file, content);
    console.log("Created:", file);
}

const src = path.join(__dirname, "src");
const dashboardsDir = path.join(src, "dashboards");

// DASHBOARD TEMPLATES
const dashboards = {
    admin: `
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
`,

    gestor: `
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
`,

    condomino: `
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
`,

    fornecedor: `
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
`,

    limpezas: `
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
`,

    auditor: `
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
`,

    contabilidade: `
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
`
};

// Generate all dashboards
Object.entries(dashboards).forEach(([name, content]) => {
    const filePath = path.join(dashboardsDir, `${name}.jsx`);
    createFile(filePath, content);
});

console.log("MODULE 5 COMPLETED");
console.log("Dashboards reais instalados e funcionais.");
