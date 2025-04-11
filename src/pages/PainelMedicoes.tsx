import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../components/ui/button";

interface RawEntry {
  Projeto: string;
  Contrato: string;
  "Tipo Servico": string;
  "Data Conclusao": number;
  Equipe: string;
  "Codigo Serviço": number;
  "Descrição Serviço": string;
  Unidade: string;
  Quantidade: number;
  Preço: number;
  "Total Valor": number;
}

interface Servico {
  equipe: string;
  tipoServico: string;
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  preco: number;
  total: number;
}

interface Projeto {
  projeto: string;
  contrato: string;
  tipoServico: string;
  equipe: string;
  dataConclusao: string;
  statusEnvio: boolean;
  statusAnalise: string;
  servicos: Servico[];
}

export default function PainelMedicoes() {
  const [dados, setDados] = useState<Projeto[]>([]);
  const [filtro, setFiltro] = useState("");
  const [expandido, setExpandido] = useState<string | null>(null);

  useEffect(() => {
    axios.get("http://localhost:3000/dados").then((res) => {
      const agrupado: Record<string, Projeto> = {};
      const flags = JSON.parse(localStorage.getItem("status_flags") || "{}");

      (res.data as RawEntry[]).forEach((item) => {
       // const chave = `${item.Projeto}-${item.Equipe}`;
        //const dataConclusaoStr = excelDateToString(item["Data Conclusao"]);
        const dataStr = excelDateToString(item["Data Conclusao"]);
        const chave = `${item.Projeto}-${dataStr}`;
        

        if (!agrupado[chave]) {
          agrupado[chave] = {
            projeto: item.Projeto,
            contrato: item.Contrato,
            tipoServico: item["Tipo Servico"],
            equipe: item.Equipe,
            dataConclusao: dataStr,
            statusEnvio: flags[chave]?.statusEnvio || false,
            statusAnalise: flags[chave]?.statusAnalise || "Em Análise",
            servicos: [],
          };
        }

        agrupado[chave].servicos.push({
          equipe: item["Equipe"],
          tipoServico: item["Tipo Servico"],
          codigo: item["Codigo Serviço"].toString(),
          descricao: item["Descrição Serviço"],
          unidade: item.Unidade,
          quantidade: item.Quantidade,
          preco: item["Preço"],
          total: item["Total Valor"],
        });
      });

      setDados(Object.values(agrupado));
    });
  }, []);

  const excelDateToString = (serial: number) => {
    const date = new Date((serial - 25569) * 86400 * 1000);
    return date.toLocaleDateString("pt-BR");
  };

  const salvarFlags = (chave: string, envio: boolean, analise: string) => {
    const flags = JSON.parse(localStorage.getItem("status_flags") || "{}");
    flags[chave] = { statusEnvio: envio, statusAnalise: analise };
    localStorage.setItem("status_flags", JSON.stringify(flags));
  };

  const formatarTipos = (tipos: string[]) => {
    if (tipos.length === 1) return tipos[0];
    if (tipos.length === 2) return `${tipos[0]} e ${tipos[1]}`;
    return `${tipos.slice(0, -1).join(", ")} e ${tipos[tipos.length - 1]}`;
  };




  const marcarComoEnviado = (item: Projeto) => {
    const chave = `${item.projeto}-${item.equipe}`;
    const novos = dados.map((el) =>
      el === item ? { ...el, statusEnvio: true } : el
    );
    setDados(novos);
    salvarFlags(chave, true, item.statusAnalise);
  };

  const cancelarEnvio = (item: Projeto) => {
    const chave = `${item.projeto}-${item.equipe}`;
    const novos = dados.map((el) =>
      el === item ? { ...el, statusEnvio: false } : el
    );
    setDados(novos);
    salvarFlags(chave, false, item.statusAnalise);
  };

  const atualizarAnalise = (item: Projeto, novoStatus: string) => {
    const chave = `${item.projeto}-${item.equipe}`;
    const novos = dados.map((el) =>
      el === item ? { ...el, statusAnalise: novoStatus } : el
    );
    setDados(novos);
    salvarFlags(chave, item.statusEnvio, novoStatus);
  };

  const badgeAnalise = (status: string) => {
    switch (status) {
      case "Aprovado":
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case "Reprovado":
        return <Badge className="bg-red-100 text-red-800">Reprovado</Badge>;
      default:
        return (
          <Badge variant="outline" className="text-gray-600">
            {status}
          </Badge>
        );
    }
  };

  const filtrado = dados.filter(
    (item) =>
      item.projeto.toLowerCase().includes(filtro.toLowerCase()) ||
      item.equipe.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-2 space-y-2">
      <div className="max-w-[100vw] mx-auto overflow-x-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Painel de Medições Técnica</h1>
            <Input
              placeholder="Buscar por projeto ou equipe..."
              className="w-96"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
          
        </div>
      </div>

      {filtrado.map((item) => {
        const chave = `${item.projeto}-${item.equipe}`;
        return (
          <div className="max-w-screen-xl mx-auto" key={chave}>
            <Card className="border shadow-md">
              <CardContent className="p-4 space-y-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setExpandido(expandido === chave ? null : chave)
                  }
                >
                  <div>
                    <h2 className="font-semibold">
                      {item.projeto} - {item.contrato}
                    </h2>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-800 mt-2">
                    {/* Serviços realizados */}
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200">
                      Serviços realizados: {formatarTipos([...new Set(item.servicos.map((s: any) => s.tipoServico || item.tipoServico))])}
                    </span>
                    {/* Equipes */}
                    {(() => {
                      const equipes = [...new Set(item.servicos.map((s: any) => s.equipe || item.equipe))];
                      const qtd = String(equipes.length).padStart(2, "0");
                      return (
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                          {qtd} Equipe{equipes.length > 1 ? "s" : ""} ({equipes.join("; ")})
                        </span>
                      );
                    })()}
                    {/* Data de conclusão */}
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                      Concluído em: {item.dataConclusao}
                    </span>
                  </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">
                      {item.statusEnvio ? "✅ Enviado" : "🕓 Pendente"}
                    </span>
                    {badgeAnalise(item.statusAnalise)}
                    {expandido === chave ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </div>

                {expandido === chave && (
                  <div className="mt-4 space-y-4">
                    <div className="flex gap-4 items-center">
                      <Button
                        variant="outline"
                        onClick={() => marcarComoEnviado(item)}
                        disabled={item.statusEnvio}
                      >
                        📤 Marcar como Enviado
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => cancelarEnvio(item)}
                        disabled={!item.statusEnvio}
                      >
                        ↩ Cancelar Envio
                      </Button>

                      <select
                        className="border rounded p-2"
                        value={item.statusAnalise}
                        onChange={(e) => atualizarAnalise(item, e.target.value)}
                      >
                        <option value="Em Análise">⌛ Em Análise</option>
                        <option value="Aprovado">✔ Aprovado</option>
                        <option value="Reprovado">✖ Reprovado</option>
                      </select>
                    </div>

                    <div className="max-w-screen-xl mx-auto overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Equipe</TableHead>
                            <TableHead>Tipo Servico</TableHead>
                            <TableHead>Código</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Unidade</TableHead>
                            <TableHead>Qtd</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {item.servicos.map((srv, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{srv.equipe}</TableCell>
                              <TableCell>{srv.tipoServico}</TableCell>
                              <TableCell>{srv.codigo}</TableCell>
                              <TableCell>{srv.descricao}</TableCell>
                              <TableCell>{srv.unidade}</TableCell>
                              <TableCell>{srv.quantidade}</TableCell>
                              <TableCell>R$ {srv.preco.toFixed(2)}</TableCell>
                              <TableCell className="text-right">
                                R$ {srv.total.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={7} className="text-left font-semibold">
                              Total Geral
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              R$ {item.servicos
                                .reduce((acc, srv) => acc + srv.total, 0)
                                .toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}

      <div className="flex justify-end"></div>
    </div>
  );
}