export interface Question {
  id: number;
  category: number;
  categoryTitle: string;
  categorySubtitle: string;
  title: string;
  type: 'single' | 'multiple' | 'text' | 'single_with_text';
  options?: string[];
  placeholder?: string;
  helperText?: string;
}

export interface CategoryInfo {
  id: number;
  numberRoman: string;
  title: string;
  subtitle: string;
  iconName: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 1,
    numberRoman: 'I',
    title: 'Atendimento Atual',
    subtitle: 'Compreensão do fluxo atual e gargalos na recepção',
    iconName: 'MessageSquare',
  },
  {
    id: 2,
    numberRoman: 'II',
    title: 'Agendamentos e Consultas',
    subtitle: 'Regras de marcação, cancelamento e lembretes',
    iconName: 'Calendar',
  },
  {
    id: 3,
    numberRoman: 'III',
    title: 'Captação e Recuperação de Pacientes',
    subtitle: 'Origem dos pacientes, follow-up e retenção',
    iconName: 'TrendingUp',
  },
  {
    id: 4,
    numberRoman: 'IV',
    title: 'Informações da Clínica',
    subtitle: 'Especialidades, estrutura, valores e WhatsApp',
    iconName: 'Building2',
  },
  {
    id: 5,
    numberRoman: 'V',
    title: 'Operação e Expectativas',
    subtitle: 'Autonomia do bot, transição humana e objetivo principal',
    iconName: 'Sparkles',
  },
];

export const QUESTIONS: Question[] = [
  // CATEGORIA 1 — ATENDIMENTO ATUAL
  {
    id: 1,
    category: 1,
    categoryTitle: 'CATEGORIA 1 — ATENDIMENTO ATUAL',
    categorySubtitle: 'Fluxo e postura de contato',
    title: '1. O bot deve atender apenas quem entrar em contato ou também iniciar conversas automaticamente?',
    type: 'single',
    options: [
      'Apenas atender quem entrar em contato (receptivo)',
      'Iniciar conversas automaticamente também (ativo/proativo)',
      'Ambos os cenários (receptivo no dia a dia e ativo para lembretes e campanhas)',
    ],
    helperText: 'Você pode indicar se além de responder, o robô fará disparos ativos.',
  },
  {
    id: 2,
    category: 1,
    categoryTitle: 'CATEGORIA 1 — ATENDIMENTO ATUAL',
    categorySubtitle: 'Gargalos e dores',
    title: '2. Quais são os maiores problemas do atendimento atual que vocês gostariam de resolver?',
    type: 'text',
    placeholder: 'Ex.: Demora para responder mensagens, acúmulo de conversas fora do horário comercial, perda de pacientes que não recebem resposta rápida, sobrecarga da equipe da recepção...',
  },
  {
    id: 3,
    category: 1,
    categoryTitle: 'CATEGORIA 1 — ATENDIMENTO ATUAL',
    categorySubtitle: 'Equipe de atendimento',
    title: '3. Atualmente, quantas pessoas realizam o atendimento pelo WhatsApp?',
    type: 'single_with_text',
    options: [
      '1 pessoa',
      '2 a 3 pessoas',
      '4 a 5 pessoas',
      'Mais de 5 pessoas',
    ],
    placeholder: 'Outra quantidade ou observação sobre turnos/equipe...',
  },
  {
    id: 4,
    category: 1,
    categoryTitle: 'CATEGORIA 1 — ATENDIMENTO ATUAL',
    categorySubtitle: 'Volume de mensagens',
    title: '4. Em média, quantas mensagens ou novos contatos a clínica recebe por dia?',
    type: 'single_with_text',
    options: [
      'Até 30 contatos por dia',
      '30 a 80 contatos por dia',
      '80 a 150 contatos por dia',
      '150 a 300 contatos por dia',
      'Mais de 300 contatos por dia',
    ],
    placeholder: 'Se preferir, informe um valor estimado mais exato...',
  },
  {
    id: 5,
    category: 1,
    categoryTitle: 'CATEGORIA 1 — ATENDIMENTO ATUAL',
    categorySubtitle: 'Horário de funcionamento',
    title: '5. O bot deverá atender 24 horas por dia ou apenas durante o horário comercial?',
    type: 'single',
    options: [
      '24 horas por dia (ininterrupto, inclusive finais de semana e feriados)',
      'Apenas durante o horário comercial da clínica',
      'Horário comercial completo + plantão de dúvidas frequentes e agendamentos à noite/finais de semana',
    ],
  },
  {
    id: 6,
    category: 1,
    categoryTitle: 'CATEGORIA 1 — ATENDIMENTO ATUAL',
    categorySubtitle: 'Transbordo humano',
    title: '6. Quando o bot não conseguir resolver uma solicitação, deverá transferir a conversa para um atendente humano?',
    type: 'single_with_text',
    options: [
      'Sim, transferir imediatamente para a fila de atendimento da recepção',
      'Sim, coletar os dados principais da solicitação e avisar o paciente que a equipe responderá em seguida',
      'Apenas durante o horário comercial; fora do horário, registrar a solicitação para o próximo dia útil',
      'Não, manter tudo automatizado',
    ],
    placeholder: 'Detalhes adicionais sobre como deve ser essa transição...',
  },
  {
    id: 7,
    category: 1,
    categoryTitle: 'CATEGORIA 1 — ATENDIMENTO ATUAL',
    categorySubtitle: 'Tecnologia de conversa',
    title: '7. O bot deverá utilizar inteligência artificial para conversar naturalmente ou seguir um fluxo de opções e respostas prontas?',
    type: 'single',
    options: [
      'Inteligência Artificial (conversa fluida, natural, humanizada e com entendimento contextual)',
      'Fluxo de opções e respostas prontas (menus numéricos e botões rápidos)',
      'Híbrido (Inteligência Artificial com botões de atalho para ações mais comuns)',
    ],
  },

  // CATEGORIA 2 — AGENDAMENTOS E CONSULTAS
  {
    id: 8,
    category: 2,
    categoryTitle: 'CATEGORIA 2 — AGENDAMENTOS E CONSULTAS',
    categorySubtitle: 'Software de gestão',
    title: '8. A clínica já utiliza algum sistema de agendamento? Se sim, qual?',
    type: 'text',
    placeholder: 'Ex.: Doctoralia, Feegow, iClinic, Clínica nas Nuvens, SimDoctor, Prontmed, agenda em papel, planilha Excel/Google, etc.',
    helperText: 'Informe o nome do sistema atual ou se o controle é feito em planilhas ou agenda física.',
  },
  {
    id: 9,
    category: 2,
    categoryTitle: 'CATEGORIA 2 — AGENDAMENTOS E CONSULTAS',
    categorySubtitle: 'Autoatendimento de agenda',
    title: '9. O paciente poderá consultar horários disponíveis e agendar diretamente pelo WhatsApp?',
    type: 'single',
    options: [
      'Sim, consultar horários e confirmar agendamento diretamente pelo WhatsApp',
      'Apenas pré-agendar (o paciente escolhe o horário e a recepção faz a confirmação final)',
      'Não, o agendamento continuará sendo realizado exclusivamente pela equipe humana',
    ],
  },
  {
    id: 10,
    category: 2,
    categoryTitle: 'CATEGORIA 2 — AGENDAMENTOS E CONSULTAS',
    categorySubtitle: 'Gestão de horários',
    title: '10. O bot deverá permitir remarcar ou cancelar consultas?',
    type: 'single',
    options: [
      'Sim, permitir tanto remarcar quanto cancelar de forma autônoma',
      'Permitir apenas remarcar; cancelamentos devem passar pela recepção',
      'Apenas registrar a solicitação de cancelamento/remarcação e avisar a equipe',
      'Não permitir remarcar nem cancelar pelo WhatsApp',
    ],
  },
  {
    id: 11,
    category: 2,
    categoryTitle: 'CATEGORIA 2 — AGENDAMENTOS E CONSULTAS',
    categorySubtitle: 'Lembretes preventivos',
    title: '11. Com quanto tempo de antecedência vocês gostariam de enviar lembretes? (Ex.: 24h ou 2h antes)',
    type: 'single_with_text',
    options: [
      '24 horas antes da consulta',
      '48 horas antes da consulta',
      '2 horas antes da consulta',
      'Dois lembretes combinados (ex.: 24h antes e 2h antes)',
    ],
    placeholder: 'Ex.: 24 horas antes e reforço 3 horas antes, ou outro padrão...',
  },
  {
    id: 12,
    category: 2,
    categoryTitle: 'CATEGORIA 2 — AGENDAMENTOS E CONSULTAS',
    categorySubtitle: 'Sincronização de status',
    title: '12. Quando o paciente confirmar ou cancelar, essa informação deverá ser atualizada automaticamente na agenda?',
    type: 'single',
    options: [
      'Sim, atualização automática no sistema de agendamento da clínica',
      'Não, a recepção receberá uma notificação e atualizará manualmente',
      'Gostaríamos de avaliar a viabilidade técnica de integração com nosso sistema atual',
    ],
  },

  // CATEGORIA 3 — CAPTAÇÃO E RECUPERAÇÃO DE PACIENTES
  {
    id: 13,
    category: 3,
    categoryTitle: 'CATEGORIA 3 — CAPTAÇÃO E RECUPERAÇÃO DE PACIENTES',
    categorySubtitle: 'Origem de tráfego',
    title: '13. De onde vêm os novos pacientes?',
    type: 'multiple',
    options: [
      'Instagram',
      'Facebook',
      'Google',
      'Site',
      'Indicações',
      'Outros',
    ],
    helperText: 'Você pode selecionar mais de uma opção.',
  },
  {
    id: 14,
    category: 3,
    categoryTitle: 'CATEGORIA 3 — CAPTAÇÃO E RECUPERAÇÃO DE PACIENTES',
    categorySubtitle: 'Follow-up de orçamentos e dúvidas',
    title: '14. Quando alguém pedir informações sobre uma consulta ou procedimento e não agendar, o bot deverá entrar em contato novamente?',
    type: 'single',
    options: [
      'Sim, fazer follow-up automático e amigável para retomar o contato',
      'Não, não entrar em contato novamente',
      'Apenas para consultas/procedimentos específicos de maior valor',
    ],
  },
  {
    id: 15,
    category: 3,
    categoryTitle: 'CATEGORIA 3 — CAPTAÇÃO E RECUPERAÇÃO DE PACIENTES',
    categorySubtitle: 'Janela de retorno',
    title: '15. Após quanto tempo deverá acontecer esse retorno? (Ex.: 1 dia, 3 dias ou 7 dias)',
    type: 'single_with_text',
    options: [
      'Após 1 dia (24 horas)',
      'Após 2 dias (48 horas)',
      'Após 3 dias',
      'Após 7 dias',
    ],
    placeholder: 'Ou informe outra regra (ex.: 24 horas e nova tentativa em 5 dias)...',
  },
  {
    id: 16,
    category: 3,
    categoryTitle: 'CATEGORIA 3 — CAPTAÇÃO E RECUPERAÇÃO DE PACIENTES',
    categorySubtitle: 'Reativação de pacientes',
    title: '16. O bot deverá entrar em contato com pacientes que já fizeram consultas para incentivar novos agendamentos?',
    type: 'single',
    options: [
      'Sim, campanhas periódicas de retorno, revisão ou check-up preventivo (ex.: 6 meses)',
      'Apenas após procedimentos cirúrgicos ou tratamentos que exigem pós-operatório',
      'Não, somente quando o paciente procurar a clínica por conta própria',
    ],
  },
  {
    id: 17,
    category: 3,
    categoryTitle: 'CATEGORIA 3 — CAPTAÇÃO E RECUPERAÇÃO DE PACIENTES',
    categorySubtitle: 'Métricas e conversão',
    title: '17. Vocês desejam acompanhar quantos contatos foram recebidos, quantos agendaram e quantos não concluíram o atendimento?',
    type: 'single',
    options: [
      'Sim, é indispensável ter métricas de conversão e relatórios de desempenho',
      'Sim, um relatório resumido quinzenal ou mensal é suficiente',
      'Não temos essa necessidade imediata',
    ],
  },

  // CATEGORIA 4 — INFORMAÇÕES DA CLÍNICA
  {
    id: 18,
    category: 4,
    categoryTitle: 'CATEGORIA 4 — INFORMAÇÕES DA CLÍNICA',
    categorySubtitle: 'Portfólio de atendimento',
    title: '18. Quais especialidades e serviços a clínica oferece?',
    type: 'text',
    placeholder: 'Ex.: Odontologia (Ortodontia, Implantes, Harmonização Orofacial), Dermatologia, Fisioterapia, Nutrição, Exames laboratoriais...',
  },
  {
    id: 19,
    category: 4,
    categoryTitle: 'CATEGORIA 4 — INFORMAÇÕES DA CLÍNICA',
    categorySubtitle: 'Tabela de preços',
    title: '19. O bot poderá informar valores de consultas e procedimentos?',
    type: 'single',
    options: [
      'Sim, pode informar abertamente os valores de consultas e procedimentos',
      'Apenas valor da consulta inicial/avaliação; procedimentos somente após diagnóstico',
      'Apenas faixas estimadas de preço (ex.: "a partir de R$...")',
      'Não informar valores pelo WhatsApp (convidar para avaliação presencial)',
    ],
  },
  {
    id: 20,
    category: 4,
    categoryTitle: 'CATEGORIA 4 — INFORMAÇÕES DA CLÍNICA',
    categorySubtitle: 'Estrutura física e corpo clínico',
    title: '20. Existe mais de uma unidade ou profissional com agendas diferentes?',
    type: 'single_with_text',
    options: [
      'Sim, mais de uma unidade física e múltiplos profissionais com agendas independentes',
      'Apenas uma unidade física, mas múltiplos profissionais com agendas distintas',
      'Apenas um profissional em uma única unidade',
    ],
    placeholder: 'Se houver particularidades de unidades ou especialidades, detalhe aqui...',
  },
  {
    id: 21,
    category: 4,
    categoryTitle: 'CATEGORIA 4 — INFORMAÇÕES DA CLÍNICA',
    categorySubtitle: 'Canal WhatsApp',
    title: '21. A clínica já possui um número de WhatsApp Business que deseja utilizar na automação?',
    type: 'single',
    options: [
      'Sim, já possuímos conta no WhatsApp Business pronta e operando',
      'Possuímos um número convencional (pessoal/comum) e queremos migrar para Business',
      'Vamos adquirir um número novo exclusivo para a automação',
      'Ainda não temos certeza e gostaríamos de orientação da Localway',
    ],
  },
  {
    id: 22,
    category: 4,
    categoryTitle: 'CATEGORIA 4 — INFORMAÇÕES DA CLÍNICA',
    categorySubtitle: 'Base cadastral e privacidade',
    title: '22. Vocês possuem uma base de pacientes para contatos futuros? Esses pacientes autorizaram receber mensagens?',
    type: 'single',
    options: [
      'Sim, temos base cadastral e os pacientes autorizaram mensagens (conformidade LGPD)',
      'Temos os contatos cadastrados no prontuário/sistema, mas sem consentimento formal explícito',
      'Temos apenas contatos recentes que conversaram conosco',
      'Não temos base estruturada de pacientes',
    ],
  },

  // CATEGORIA 5 — OPERAÇÃO E EXPECTATIVAS
  {
    id: 23,
    category: 5,
    categoryTitle: 'CATEGORIA 5 — OPERAÇÃO E EXPECTATIVAS',
    categorySubtitle: 'Autonomia desejada',
    title: '23. O que vocês esperam que o bot consiga resolver sozinho, sem intervenção da recepção?',
    type: 'text',
    placeholder: 'Ex.: Esclarecer dúvidas de preparo de exames e convênios aceitos, endereço e estacionamento, agendar primeira consulta, disparar confirmações de presença...',
  },
  {
    id: 24,
    category: 5,
    categoryTitle: 'CATEGORIA 5 — OPERAÇÃO E EXPECTATIVAS',
    categorySubtitle: 'Limites de segurança',
    title: '24. Existem situações em que o bot nunca deverá responder sozinho e precisará chamar um funcionário?',
    type: 'text',
    placeholder: 'Ex.: Casos de dor aguda ou urgência médica/odontológica, reclamações de pacientes, cancelamentos recorrentes, negociações financeiras complexas...',
  },
  {
    id: 25,
    category: 5,
    categoryTitle: 'CATEGORIA 5 — OPERAÇÃO E EXPECTATIVAS',
    categorySubtitle: 'Meta primordial',
    title: '25. Qual seria o resultado mais importante para vocês?',
    type: 'single',
    options: [
      'Aumentar os agendamentos',
      'Reduzir o trabalho da recepção',
      'Diminuir faltas em consultas',
      'Recuperar pacientes antigos',
      'Melhorar a velocidade do atendimento',
    ],
  },
];
