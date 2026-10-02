import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Scale, 
  FileCheck, 
  UserCheck, 
  Calendar, 
  ArrowRight, 
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { Lawyer, Service } from '../types';

interface LegalAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyers: Lawyer[];
  services: Service[];
  onScheduleWithRecommendation: (lawyer: Lawyer, area: string) => void;
}

export const LegalAssistantModal: React.FC<LegalAssistantModalProps> = ({
  isOpen,
  onClose,
  lawyers,
  services,
  onScheduleWithRecommendation
}) => {
  const [query, setQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<{
    area: string;
    recommendedLawyer: Lawyer;
    urgency: 'Alta' | 'Média' | 'Preventiva';
    summary: string;
    documentsNeeded: string[];
  } | null>(null);

  if (!isOpen) return null;

  const sampleScenarios = [
    {
      title: 'Disputa entre Sócios ou Venda de Quotas',
      area: 'Direito Empresarial & Societário',
      lawyerIndex: 0
    },
    {
      title: 'Inventário, Testamento ou Holding Familiar',
      area: 'Planejamento Sucessório & Família',
      lawyerIndex: 1
    },
    {
      title: 'Autuação Fiscal ou Impostos Indevidos',
      area: 'Direito Tributário & Contencioso Fiscal',
      lawyerIndex: 2
    },
    {
      title: 'Passivo Trabalhista ou Rescisão Contratual',
      area: 'Direito do Trabalho & Compliance Trabalhista',
      lawyerIndex: 3
    },
    {
      title: 'Compra de Imóvel ou Despejo Comercial',
      area: 'Direito Civil, Contratos & Imobiliário',
      lawyerIndex: 1
    }
  ];

  const handleAnalyze = (topicTitle?: string) => {
    const textToAnalyze = (topicTitle || query || selectedTopic).toLowerCase();

    let chosenLawyer = lawyers[0];
    let chosenArea = 'Direito Empresarial & Societário';
    let urgency: 'Alta' | 'Média' | 'Preventiva' = 'Preventiva';
    let docs = ['Contrato Social e alterações', 'Demonstrativos contábeis', 'Documentos de identificação dos sócios'];
    let summary = 'Trata-se de matéria societária/corporativa que requer análise dos instrumentos constitutivos e acordos parassociais.';

    if (textToAnalyze.includes('inventário') || textToAnalyze.includes('holding') || textToAnalyze.includes('família') || textToAnalyze.includes('partilha') || textToAnalyze.includes('herança') || textToAnalyze.includes('imóvel') || textToAnalyze.includes('imovel')) {
      chosenLawyer = lawyers[1] || lawyers[0];
      chosenArea = 'Planejamento Sucessório & Família';
      urgency = 'Média';
      docs = ['Certidões de nascimento/casamento', 'Matrículas atualizadas dos imóveis', 'Relação de bens e herdeiros'];
      summary = 'A condução sucessória e patrimonial visa resguardar os ativos com segurança jurídica e economia de tributos como ITCMD.';
    } else if (textToAnalyze.includes('tribut') || textToAnalyze.includes('fiscal') || textToAnalyze.includes('imposto') || textToAnalyze.includes('receita') || textToAnalyze.includes('icms') || textToAnalyze.includes('carf')) {
      chosenLawyer = lawyers[2] || lawyers[0];
      chosenArea = 'Direito Tributário & Contencioso Fiscal';
      urgency = 'Alta';
      docs = ['Auto de Infração ou Notificação Fiscal', 'Comprovantes de recolhimento', 'Planilha de apuração contábil'];
      summary = 'Recomenda-se verificação imediata de prazos para impugnação administrativa ou propositura de ação anulatória de débito fiscal.';
    } else if (textToAnalyze.includes('trabalh') || textToAnalyze.includes('demiss') || textToAnalyze.includes('clt') || textToAnalyze.includes('rescis') || textToAnalyze.includes('funcionário')) {
      chosenLawyer = lawyers[3] || lawyers[0];
      chosenArea = 'Direito do Trabalho & Compliance Trabalhista';
      urgency = 'Média';
      docs = ['Contrato de trabalho e holerites', 'Termo de Rescisão (TRCT)', 'Comunicações internas e e-mails'];
      summary = 'Análise técnica da relação laboral para mitigar riscos de reclamatória trabalhista ou negociar termo de quitação.';
    }

    setAnalysisResult({
      area: chosenArea,
      recommendedLawyer: chosenLawyer,
      urgency,
      summary,
      documentsNeeded: docs
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-xl w-full p-6 sm:p-7 text-slate-100 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-['Cinzel'] text-xl font-bold text-white">
              Triagem Virtual & Orientação Prévia
            </h2>
            <p className="text-xs text-slate-400">
              Descubra a especialidade adequada e documentos recomendados antes de sua consulta.
            </p>
          </div>
        </div>

        {!analysisResult ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-2">
                Selecione o tema principal do seu caso ou digite abaixo:
              </label>
              <div className="space-y-2">
                {sampleScenarios.map((sc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSelectedTopic(sc.title);
                      handleAnalyze(sc.title);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 text-xs text-slate-200 transition-all flex items-center justify-between group"
                  >
                    <span>{sc.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Ou descreva livremente sua dúvida jurídica:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Recebi uma autuação da Receita Federal sobre ICMS..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAnalyze(); }}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => handleAnalyze()}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors shrink-0"
                >
                  Analisar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            {/* Analysis Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Diagnóstico de Triagem</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  analysisResult.urgency === 'Alta' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  Prioridade: {analysisResult.urgency}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Área de Atuação Indicada:</span>
                <strong className="text-white text-sm">{analysisResult.area}</strong>
                <p className="text-slate-300 mt-1 leading-relaxed">{analysisResult.summary}</p>
              </div>

              {/* Recommended Lawyer */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-3">
                <img
                  src={analysisResult.recommendedLawyer.photo}
                  alt={analysisResult.recommendedLawyer.name}
                  className="w-12 h-12 rounded-lg object-cover border border-amber-500/40"
                />
                <div>
                  <span className="text-[10px] text-amber-400 uppercase font-bold block">Sócio Recomendado</span>
                  <strong className="text-white text-sm block">{analysisResult.recommendedLawyer.name}</strong>
                  <span className="text-[11px] text-slate-400">{analysisResult.recommendedLawyer.title} ({analysisResult.recommendedLawyer.oab})</span>
                </div>
              </div>

              {/* Documents to prepare */}
              <div>
                <span className="text-slate-400 block text-[11px] font-semibold mb-1">
                  Documentos recomendados para levar à consulta:
                </span>
                <ul className="space-y-1">
                  {analysisResult.documentsNeeded.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-300 text-[11px]">
                      <FileCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAnalysisResult(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Nova Pesquisa
              </button>

              <button
                type="button"
                onClick={() => {
                  const lawyer = analysisResult.recommendedLawyer;
                  const area = analysisResult.area;
                  onClose();
                  onScheduleWithRecommendation(lawyer, area);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-amber-950/50 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar com {analysisResult.recommendedLawyer.name.split(' ')[0]} {analysisResult.recommendedLawyer.name.split(' ')[1]}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
