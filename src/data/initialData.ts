import { Lawyer, Service, User, Appointment, SiteAnalytics } from '../types';

export const OFFICE_INFO = {
  name: "Moraes & Associados Advocacia",
  tagline: "Excelência jurídica, integridade e soluções estratégicas personalizadas há mais de 25 anos.",
  oabNumber: "OAB/SP nº 14.892 (Sociedade de Advogados)",
  address: {
    street: "Avenida Paulista, 1842",
    complement: "Torre Sul, 14º e 15º Andar - Conj. 1401",
    neighborhood: "Bela Vista / Cerqueira César",
    city: "São Paulo",
    state: "SP",
    cep: "01310-200",
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.106573516599!2d-46.66129882379761!3d-23.56281786171804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59ceb1eb771f%3A0xe5de4c68b16fa744!2sAv.%20Paulista%2C%201842%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001310-200!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr",
    parking: "Estacionamento com manobrista no local (acesso pela Alameda Santos)"
  },
  contact: {
    phone: "(11) 3456-7890",
    phoneSecondary: "(11) 3456-7899",
    whatsapp: "+55 11 98765-4321",
    whatsappLink: "https://wa.me/5511987654321?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20atendimento%20jur%C3%ADdico%20na%20Moraes%20%26%20Associados.",
    email: "contato@moraesassociados.adv.br",
    adminEmail: "admin@moraes.adv.br",
    instagram: "@moraesassociados.adv",
    instagramUrl: "https://instagram.com/moraesassociados.adv",
    linkedin: "moraes-e-associados-advocacia",
    hours: "Segunda a Sexta: 08:30 às 18:30 | Plantão de Urgência 24h para Clientes Corporativos"
  }
};

export const INITIAL_LAWYERS: Lawyer[] = [
  {
    id: "lawyer-1",
    name: "Dr. Roberto Moraes",
    oab: "OAB/SP 112.450",
    title: "Sócio Fundador & Diretor Jurídico",
    specialty: "Direito Empresarial, Societário & Fusões e Aquisições (M&A)",
    bio: "Mais de 28 anos de atuação na liderança de litígios societários de alta complexidade e reestruturações empresariais. Parecerista em câmaras arbitrais internacionais.",
    experienceYears: 28,
    education: [
      "Doutor em Direito Comercial pela USP",
      "Mestre em Direito Societário pela Pontifícia Universidade Católica (PUC-SP)",
      "Especialização em Negociações Estratégicas por Harvard Law School"
    ],
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    email: "roberto.moraes@moraesassociados.adv.br",
    instagram: "@dr.robertomoraes",
    phone: "(11) 3456-7891",
    availableDays: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
    availableHours: ["09:00", "10:30", "14:00", "16:00", "17:30"]
  },
  {
    id: "lawyer-2",
    name: "Dra. Helena Silveira Moraes",
    oab: "OAB/SP 148.920",
    title: "Sócia Coordenadora de Direito Civil & Sucessório",
    specialty: "Direito Civil, Planejamento Sucessório & Família",
    bio: "Especialista em proteção patrimonial, holdings familiares, inventários solenes e mediações familiares complexas. Autora de artigos renomados na área de Sucessões.",
    experienceYears: 22,
    education: [
      "Mestre em Direito Civil Comparado pela PUC-SP",
      "Pós-graduada em Planejamento Patrimonial e Sucessório pelo Insper",
      "Membro do Instituto Brasileiro de Direito de Família (IBDFAM)"
    ],
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    email: "helena.moraes@moraesassociados.adv.br",
    instagram: "@dra.helenasilveira",
    phone: "(11) 3456-7892",
    availableDays: ["Segunda", "Quarta", "Quinta", "Sexta"],
    availableHours: ["09:30", "11:00", "14:30", "16:30"]
  },
  {
    id: "lawyer-3",
    name: "Dr. Carlos Eduardo Braga",
    oab: "OAB/SP 205.811",
    title: "Sócio Coordenador de Direito Tributário & Fiscal",
    specialty: "Direito Tributário, Contencioso Fiscal & Planejamento Tributário",
    bio: "Ex-conselheiro do CARF e consultor de conglomerados industriais e do setor de serviços. Especialista em recuperação de créditos fiscais e defesas em execuções fiscais.",
    experienceYears: 18,
    education: [
      "Mestre em Direito Tributário pela Fundação Getúlio Vargas (FGV-SP)",
      "Especialização em Direito Internacional e Fiscal pelo IBDT",
      "Bacharel em Direito pela USP"
    ],
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
    email: "carlos.braga@moraesassociados.adv.br",
    instagram: "@braga.tributario",
    phone: "(11) 3456-7893",
    availableDays: ["Terça", "Quarta", "Quinta", "Sexta"],
    availableHours: ["10:00", "11:30", "15:00", "17:00"]
  },
  {
    id: "lawyer-4",
    name: "Dra. Mariana Paiva Mendonça",
    oab: "OAB/SP 267.439",
    title: "Sócia Responsável por Direito Trabalhista & Compliance",
    specialty: "Direito do Trabalho Estratégico & Relações Sindicais",
    bio: "Foco em consultoria preventiva para prevenção de passivos trabalhistas corporativos, negociações sindicais e defesa em ações coletivas de repercussão geral.",
    experienceYears: 14,
    education: [
      "Pós-Graduada em Direito Material e Processual do Trabalho pela EPD",
      "Certificação Internacional em Compliance & Ética Corporativa (CCEP-I)",
      "Bacharel em Direito pela Universidade Presbiteriana Mackenzie"
    ],
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
    email: "mariana.paiva@moraesassociados.adv.br",
    instagram: "@dra.marianapaiva",
    phone: "(11) 3456-7894",
    availableDays: ["Segunda", "Terça", "Quarta", "Quinta"],
    availableHours: ["09:00", "10:30", "14:00", "15:30", "17:00"]
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: "serv-empresarial",
    title: "Direito Empresarial & Societário",
    iconName: "Building2",
    category: "Corporativo",
    shortDesc: "Estruturação societária, fusões, aquisições (M&A), acordos de acionistas e resolução de conflitos corporativos.",
    fullDesc: "Oferecemos assessoria consultiva e contenciosa integral para empresas de todos os portes. Desde a fundação e governança corporativa até auditorias jurídicas de due diligence, reestruturações patrimoniais e contratos de alta complexidade.",
    highlights: [
      "Contratos comerciais nacionais e internacionais",
      "Fusões, cisões, incorporações e Due Diligence",
      "Elaboração de acordos de sócios e governança",
      "Recuperação judicial e mediação de conflitos societários"
    ]
  },
  {
    id: "serv-civil",
    title: "Direito Civil, Contratos & Imobiliário",
    iconName: "Scale",
    category: "Patrimonial",
    shortDesc: "Elaboração e revisão minuciosa de contratos, transações imobiliárias, responsabilidade civil e litígios cíveis.",
    fullDesc: "Defesa dos interesses cíveis com abordagem preventiva e estratégica. Atuação em regularização fundiária, incorporações, rescisões contratuais, indenizações e execuções de títulos com rigor técnico.",
    highlights: [
      "Transações imobiliárias seguras e auditoria de títulos",
      "Contratos de locação comercial, compra e venda",
      "Ações indenizatórias e responsabilidade civil",
      "Cobrança e execução de títulos judiciais e extrajudiciais"
    ]
  },
  {
    id: "serv-sucessorio",
    title: "Planejamento Sucessório & Família",
    iconName: "Users",
    category: "Patrimonial & Pessoal",
    shortDesc: "Proteção patrimonial, constituição de holdings familiares, testamentos, inventários judiciais e extrajudiciais.",
    fullDesc: "Blindagem e transmissão patrimonial intergeracional harmoniosa com minimização tributária lícita e preservação do legado familiar. Condução humana e sigilosa de processos de família.",
    highlights: [
      "Estruturação de Holdings Patrimoniais e Familiares",
      "Inventários judiciais e em cartório (extrajudiciais)",
      "Testamentos, doações com reserva de usufruto",
      "Pactos antenupciais e regimes de bens"
    ]
  },
  {
    id: "serv-tributario",
    title: "Direito Tributário & Contencioso Fiscal",
    iconName: "Landmark",
    category: "Fiscal",
    shortDesc: "Planejamento tributário estratégico, recuperação de tributos pagos indevidamente e defesas contra autuações fiscais.",
    fullDesc: "Diagnóstico fiscal apurado para otimizar a carga tributária dentro da legalidade. Defesas consistentes no CARF, tribunais de impostos e taxas estaduais e na Justiça Federal.",
    highlights: [
      "Auditoria para recuperação de créditos tributários",
      "Defesa em autos de infração e execuções fiscais",
      "Consultoria sobre regimes especiais e incentivos",
      "Pareceres técnicos preventivos para operações atípicas"
    ]
  },
  {
    id: "serv-trabalhista",
    title: "Direito do Trabalho & Compliance Trabalhista",
    iconName: "Briefcase",
    category: "Trabalhista",
    shortDesc: "Consultoria preventiva para redução de passivos, adequação às normas vigentes, defesas em reclamatórias e negociação coletiva.",
    fullDesc: "Atuação patronal estratégica para mitigar contingências trabalhistas, estruturação de planos de cargos e salários, auditoria de rotinas de RH e defesa em ações com altos valores envolvidos.",
    highlights: [
      "Elaboração de programas de compliance trabalhista",
      "Defesa patronal em reclamações trabalhistas complexas",
      "Assessoria em acordos e convenções coletivas",
      "Adequação de contratos de prestação de serviços (PJ) e teletrabalho"
    ]
  },
  {
    id: "serv-penal-economico",
    title: "Direito Penal Econômico & Compliance",
    iconName: "ShieldCheck",
    category: "Penal & Governança",
    shortDesc: "Atuação especializada em crimes contra o sistema financeiro, ordem tributária, lavagem de capitais e investigações corporativas.",
    fullDesc: "Defesa técnica de executivos e empresas em investigações policiais, inquéritos e ações penais econômicas, prezando pelo sigilo absoluto e garantias fundamentais.",
    highlights: [
      "Defesa em inquéritos policiais e procedimentos investigatórios",
      "Crimes contra a ordem tributária e sistema financeiro",
      "Investigações corporativas internas e gestão de crises",
      "Implementação de canal de denúncias e código de conduta"
    ]
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: "user-client-1",
    name: "Dra. Beatriz Fontana",
    email: "beatriz.fontana@hospitalcentral.com.br",
    phone: "(11) 99123-4567",
    cpf: "123.456.789-00",
    role: "client",
    createdAt: "2026-06-15T10:00:00.000Z",
    city: "São Paulo - SP",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "user-client-2",
    name: "Marcio Rezende Alvarenga",
    email: "marcio.rezende@holdingalvarenga.com.br",
    phone: "(11) 98234-5678",
    cpf: "234.567.890-11",
    role: "client",
    createdAt: "2026-07-02T14:30:00.000Z",
    city: "Campinas - SP",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "user-client-3",
    name: "Renata Vasconcelos Prado",
    email: "renata.prado@inovartech.io",
    phone: "(11) 97345-6789",
    cpf: "345.678.901-22",
    role: "client",
    createdAt: "2026-08-10T09:15:00.000Z",
    city: "São Paulo - SP",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "user-admin",
    name: "Administrador Moraes",
    email: "admin@moraes.adv.br",
    phone: "(11) 3456-7890",
    cpf: "000.000.000-00",
    role: "admin",
    createdAt: "2026-01-01T00:00:00.000Z",
    city: "São Paulo - SP"
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-101",
    protocolNumber: "MA-2026-8891",
    userId: "user-client-1",
    clientName: "Dra. Beatriz Fontana",
    clientEmail: "beatriz.fontana@hospitalcentral.com.br",
    clientPhone: "(11) 99123-4567",
    clientCpf: "123.456.789-00",
    lawyerId: "lawyer-1",
    lawyerName: "Dr. Roberto Moraes",
    practiceArea: "Direito Empresarial & Societário",
    date: "2026-09-02",
    time: "10:30",
    format: "presencial",
    status: "confirmada",
    notes: "Consulta para revisão e elaboração de novo Acordo de Sócios e estruturação de clínica médica.",
    historyLog: [
      {
        action: "Consulta agendada pelo cliente",
        date: "2026-08-25T11:20:00.000Z",
        by: "Dra. Beatriz Fontana"
      },
      {
        action: "Consulta aprovada e confirmada",
        date: "2026-08-25T14:10:00.000Z",
        by: "Secretaria Jurídica Moraes & Associados"
      }
    ],
    createdAt: "2026-08-25T11:20:00.000Z"
  },
  {
    id: "apt-102",
    protocolNumber: "MA-2026-8892",
    userId: "user-client-2",
    clientName: "Marcio Rezende Alvarenga",
    clientEmail: "marcio.rezende@holdingalvarenga.com.br",
    clientPhone: "(11) 98234-5678",
    clientCpf: "234.567.890-11",
    lawyerId: "lawyer-2",
    lawyerName: "Dra. Helena Silveira Moraes",
    practiceArea: "Planejamento Sucessório & Família",
    date: "2026-09-04",
    time: "14:30",
    format: "online",
    status: "pendente",
    notes: "Análise prévia para constituição de holding patrimonial familiar e doação de cotas.",
    historyLog: [
      {
        action: "Solicitação de agendamento recebida",
        date: "2026-08-27T16:45:00.000Z",
        by: "Marcio Rezende Alvarenga"
      }
    ],
    createdAt: "2026-08-27T16:45:00.000Z"
  },
  {
    id: "apt-103",
    protocolNumber: "MA-2026-8875",
    userId: "user-client-3",
    clientName: "Renata Vasconcelos Prado",
    clientEmail: "renata.prado@inovartech.io",
    clientPhone: "(11) 97345-6789",
    clientCpf: "345.678.901-22",
    lawyerId: "lawyer-3",
    lawyerName: "Dr. Carlos Eduardo Braga",
    practiceArea: "Direito Tributário & Contencioso Fiscal",
    date: "2026-09-08",
    time: "11:30",
    format: "online",
    status: "reagendada",
    notes: "Defesa de autuação fiscal estadual ICMS-ST e pedidos de parcelamento especial.",
    rescheduleReason: "Conflito de agenda com audiência no Tribunal de Justiça de SP da parte do Dr. Carlos Eduardo Braga. Reagendada com anuência da cliente.",
    historyLog: [
      {
        action: "Agendada inicialmente para 29/08",
        date: "2026-08-20T10:00:00.000Z",
        by: "Renata Vasconcelos Prado"
      },
      {
        action: "Reagendada para 08/09 às 11:30",
        date: "2026-08-26T15:20:00.000Z",
        by: "Administração Moraes & Associados",
        reason: "Conflito de agenda com audiência no Tribunal de Justiça de SP."
      }
    ],
    createdAt: "2026-08-20T10:00:00.000Z"
  },
  {
    id: "apt-104",
    protocolNumber: "MA-2026-8860",
    userId: "user-client-1",
    clientName: "Dra. Beatriz Fontana",
    clientEmail: "beatriz.fontana@hospitalcentral.com.br",
    clientPhone: "(11) 99123-4567",
    clientCpf: "123.456.789-00",
    lawyerId: "lawyer-4",
    lawyerName: "Dra. Mariana Paiva Mendonça",
    practiceArea: "Direito do Trabalho & Compliance Trabalhista",
    date: "2026-08-18",
    time: "15:30",
    format: "presencial",
    status: "concluida",
    notes: "Consulta realizada com entrega de parecer sobre regime de plantão médico e teletrabalho.",
    historyLog: [
      {
        action: "Agendamento realizado",
        date: "2026-08-10T14:00:00.000Z",
        by: "Dra. Beatriz Fontana"
      },
      {
        action: "Consulta realizada e concluída com sucesso",
        date: "2026-08-18T16:30:00.000Z",
        by: "Dra. Mariana Paiva Mendonça"
      }
    ],
    createdAt: "2026-08-10T14:00:00.000Z"
  }
];

export const INITIAL_ANALYTICS: SiteAnalytics = {
  totalVisits: 14280,
  pageViews: 38450,
  uniqueVisitors: 9640,
  registeredUsersCount: 148,
  totalAppointmentsCount: 412,
  confirmedAppointmentsCount: 384,
  cancelledAppointmentsCount: 18,
  visitsByDay: [
    { date: "22/08", visits: 620, bookings: 14 },
    { date: "23/08", visits: 580, bookings: 12 },
    { date: "24/08", visits: 740, bookings: 19 },
    { date: "25/08", visits: 810, bookings: 22 },
    { date: "26/08", visits: 890, bookings: 25 },
    { date: "27/08", visits: 950, bookings: 28 },
    { date: "28/08", visits: 1040, bookings: 31 }
  ],
  popularAreas: [
    { area: "Direito Empresarial & Societário", count: 135 },
    { area: "Planejamento Sucessório & Família", count: 98 },
    { area: "Direito Tributário & Fiscal", count: 84 },
    { area: "Direito do Trabalho & Compliance", count: 62 },
    { area: "Direito Civil & Imobiliário", count: 33 }
  ]
};
