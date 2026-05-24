import { useEffect, useRef, useState, useCallback } from 'react';

interface GuideTip {
  title: string;
  message: string;
  icon: string;
}

const TIPS: Record<string, Record<string, GuideTip>> = {
  '/': {
    hero: {
      title: 'Bem-vindo!',
      message: 'Esta é a página inicial do LVP. Aqui você encontra o dicionário, alfabeto, cursos e exercícios. Passe o mouse pelas seções que eu explico mais sobre cada uma!',
      icon: 'ri-hand-heart-line',
    },
    mascot: {
      title: 'Por que aprender Libras?',
      message: 'A Libras (Língua Brasileira de Sinais) é reconhecida pela Lei 10.436/2002 como meio legal de comunicação da comunidade surda brasileira. Não é uma tradução do português — é uma língua completa com gramática própria!',
      icon: 'ri-article-line',
    },
    features: {
      title: 'A Libras é uma língua visual-espacial',
      message: 'Diferente do português (auditivo-linear), a Libras usa o espaço, as expressões faciais e a configuração das mãos para construir sentido. Cada sinal tem localização, movimento e expressão facial!',
      icon: 'ri-eye-line',
    },
    history: {
      title: 'A história da Libras',
      message: 'A Libras tem raízes na LSF (Língua de Sinais Francesa) trazida por Huet em 1857, mas evoluiu com sinais próprios do Brasil. Em 2002 foi reconhecida oficialmente. Hoje existem cursos de Letras-Libras em universidades do país inteiro.',
      icon: 'ri-time-line',
    },
    about: {
      title: 'A comunidade surda',
      message: 'A comunidade surda brasileira é quem melhor conhece a Libras. Intérpretes de Libras são profissionais essenciais para acessibilidade em hospitais, escolas, eventos e muito mais.',
      icon: 'ri-team-line',
    },
    testimonials: {
      title: 'Estudantes de Libras',
      message: 'Muitos estudantes de Letras-Libras, pedagogia e fonoaudiologia usam nossa plataforma para reforçar o aprendizado. A prática constante é a chave para fluência!',
      icon: 'ri-chat-smile-2-line',
    },
    pricing: {
      title: 'Plataforma 100% Gratuita',
      message: 'O cadastro é 100% gratuito para todos! Basta se registrar para ter acesso ao dicionário com 146 sinais, alfabeto manual, IA Assistente, cursos, exercícios e certificados.',
      icon: 'ri-gift-line',
    },
    cta: {
      title: 'Comece agora!',
      message: 'Não precisa pagar nada para começar. Vá até o dicionário e aprenda seus primeiros sinais. Sugiro começar por "Oi", "Obrigado" e "Por favor" — são os mais usados no dia a dia.',
      icon: 'ri-rocket-line',
    },
  },
  '/dictionary': {
    header: {
      title: 'Dicionário de Sinais',
      message: 'Este dicionário tem 146 sinais em Libras organizados em 20 categorias! Use a busca para encontrar sinais específicos ou explore por categoria.',
      icon: 'ri-book-open-line',
    },
    filter: {
      title: 'Categorias de sinais',
      message: 'Os sinais estão organizados em categorias como Saudações, Família, Números, Emoções, Verbos, Animais, Transporte... Clique em uma categoria para filtrar.',
      icon: 'ri-filter-3-line',
    },
    grid: {
      title: 'Fotos reais de mãos',
      message: 'Cada card mostra uma foto real da mão na posição do sinal. Clique em "Ver Passo a Passo" para ver a descrição detalhada com instruções de como fazer.',
      icon: 'ri-image-line',
    },
    progress: {
      title: 'Marque o que aprendeu',
      message: 'Quando dominar um sinal, clique em "Marcar como aprendido". Seu progresso é salvo automaticamente no navegador. Quanto mais sinais você marcar, mais completo fica seu aprendizado!',
      icon: 'ri-checkbox-circle-line',
    },
  },
  '/alphabet': {
    header: {
      title: 'Alfabeto Manual (Datilologia)',
      message: 'A datilologia é a soletração letra por letra usando configurações de mão. Use para nomes próprios, palavras sem sino específico e siglas. É diferente dos sinais normais!',
      icon: 'ri-keyboard-line',
    },
    canvas: {
      title: 'Visualização 3D',
      message: 'A imagem mostra a configuração exata da mão para cada letra. Preste atenção na posição dos dedos, pois pequenas mudanças podem mudar completamente o sentido.',
      icon: 'ri-hand',
    },
    detail: {
      title: 'Passo a passo da letra',
      message: 'Cada letra tem uma "receita" de como posicionar os dedos. Pratique na frente do espelho! Use as setas do teclado ← → para navegar rápido entre as letras.',
      icon: 'ri-file-list-line',
    },
    grid: {
      title: 'Visão geral do alfabeto',
      message: 'Este grid mostra todas as 26 letras de uma vez. As letras que você marcou como aprendidas ficam verdes. Tente aprender 5 letras por dia — em uma semana você domina o alfabeto!',
      icon: 'ri-layout-grid-line',
    },
  },
  '/exercises': {
    header: {
      title: 'Exercícios de Libras',
      message: 'Estes quizzes testam seu conhecimento teórico sobre gramática, história, legislação e vocabulário de Libras. São baseados no currículo acadêmico de cursos de Letras-Libras.',
      icon: 'ri-pencil-ruler-2-line',
    },
    filter: {
      title: 'Níveis de dificuldade',
      message: 'As questões são divididas em Básico, Intermediário e Avançado. Se você está começando, foque nas básicas primeiro. A cada nível, os conceitos ficam mais complexos.',
      icon: 'ri-bar-chart-grouped-line',
    },
    questions: {
      title: 'Preste atenção nos detalhes!',
      message: 'Na Libras, as expressões faciais são componentes GRAMATICAIS obrigatórios — não são apenas emoções. Elas marcam negação, interrogação e topicalização. Isso cai muito nas provas!',
      icon: 'ri-lightbulb-line',
    },
  },
  '/progress': {
    header: {
      title: 'Seu Dashboard',
      message: 'Aqui você acompanha TUDO que já aprendeu: sinais do dicionário, letras do alfabeto, módulos de cursos e exercícios realizados. Tudo salvo automaticamente no seu navegador.',
      icon: 'ri-bar-chart-line',
    },
    stats: {
      title: 'Estatísticas de aprendizado',
      message: 'Cada área tem sua própria barra de progresso. Tente manter uma sequência de dias estudando — consistência vale mais do que intensidade! Mesmo 10 minutos por dia fazem diferença.',
      icon: 'ri-fire-line',
    },
    favorites: {
      title: 'Sinais favoritos',
      message: 'Os sinais que você favoritou no dicionário aparecem aqui. É uma boa forma de criar uma lista personalizada de revisão. Revise seus favoritos antes de dormir!',
      icon: 'ri-heart-line',
    },
  },
  '/cursos': {
    header: {
      title: 'Cursos de Libras',
      message: 'Nossos cursos são divididos em 3 níveis: Básico (vocabulário e gramática fundamental), Intermediário (classificadores e expressões faciais) e Avançado (narrativa, roleshift e interpretação).',
      icon: 'ri-graduation-cap-line',
    },
    modules: {
      title: 'Módulos por nível',
      message: 'Cada módulo tem vídeo-aula, material de leitura e exercício prático. Complete todos os módulos de um nível para desbloquear o próximo. O certificado é emitido ao completar o Avançado.',
      icon: 'ri-stack-line',
    },
  },
  '/grammar': {
    header: {
      title: 'Gramática de Libras',
      message: 'A gramática de Libras é MUITO diferente do português! A ordem predominante é OSV (Objeto-Sujeito-Verbo), usa classificadores, expressões faciais gramaticais e espaço como recurso linguístico.',
      icon: 'ri-book-2-line',
    },
    topics: {
      title: 'Tópicos gramaticais',
      message: 'Classificadores, pronomes de localização, roleshift, expressões faciais gramaticais... Cada tópico tem explicação teórica e exemplos em vídeo. Estude um por vez!',
      icon: 'ri-book-marked-line',
    },
  },
  '/recognition': {
    header: {
      title: 'Demonstração de Reconhecimento',
      message: 'Esta página é uma simulação didática de como uma tecnologia de reconhecimento de sinais poderia funcionar. Envie uma imagem e veja um resultado gerado automaticamente. Não é uma IA real — serve para entender o potencial da tecnologia para o aprendizado de Libras.',
      icon: 'ri-camera-line',
    },
    practice: {
      title: 'Como usar a demonstração',
      message: 'Faça upload de uma imagem mostrando uma configuração de mão em Libras. O sistema retornará um resultado simulado para fins didáticos. Para prática real, nada substitui a orientação de intérpretes e professores de Libras!',
      icon: 'ri-upload-cloud-line',
    },
  },
  '/assistant': {
    header: {
      title: 'Assistente de Libras',
      message: 'Nosso assistente com inteligência artificial responde dúvidas sobre Libras 24 horas por dia. Mas lembre: a comunidade surda e intérpretes profissionais são as maiores especialistas na língua!',
      icon: 'ri-robot-2-line',
    },
    chat: {
      title: 'Como usar o assistente',
      message: 'Pergunte sobre gramática, sinais específicos, história da Libras, legislação... O assistente foi treinado com conteúdo acadêmico. Para dúvidas complexas, consulte também um intérprete ou professor.',
      icon: 'ri-message-3-line',
    },
  },
  '/pricing': {
    header: {
      title: 'Cadastro Gratuito',
      message: 'A plataforma é 100% gratuita para todos! Basta fazer o cadastro para acessar todos os recursos: dicionário com 146 sinais, alfabeto manual, IA Assistente, cursos, exercícios e certificados.',
      icon: 'ri-gift-line',
    },
  },
  '/references': {
    header: {
      title: 'Referências acadêmicas',
      message: 'A área de Libras cresce muito a cada ano! Sempre consulte fontes acadêmicas atualizadas. Nossas referências incluem obras de Quadros, Karnopp, Ferreira-Brito e outras referências da área.',
      icon: 'ri-book-marked-line',
    },
  },
  '/faq': {
    'faq-hero': {
      title: 'Tire todas as suas dúvidas',
      message: 'Esta página tem 34 perguntas frequentes organizadas em 6 categorias: Sobre o Projeto, Cadastro, Recursos, Aprendizado, Técnico e Colaboração. Clique em uma categoria à esquerda e depois expanda as perguntas.',
      icon: 'ri-question-answer-line',
    },
    'faq-content': {
      title: 'Navegação por categorias',
      message: 'O menu lateral organiza as perguntas em tópicos. Assim você encontra rápido o que precisa. Todas as respostas foram escritas para esclarecer dúvidas reais de quem está começando no aprendizado de Libras.',
      icon: 'ri-folder-line',
    },
    'faq-contact': {
      title: 'Fale com o criador',
      message: 'Se não encontrou sua dúvida aqui, envie um e-mail para librasvox@gmail.com. Fernando Mário da Silva Martins responde pessoalmente todas as mensagens em até 48 horas.',
      icon: 'ri-mail-send-line',
    },
    'faq-links': {
      title: 'Links úteis',
      message: 'Esses atalhos levam para as principais páginas do site: cadastro gratuito, dicionário, alfabeto e cursos. Explore todos os recursos — tudo é gratuito!',
      icon: 'ri-links-line',
    },
  },
};

function getCurrentPath(): string {
  const p = window.location.pathname.replace(__BASE_PATH__, '').replace(/\/$/, '') || '/';
  return p;
}

function getTipForSection(path: string, section: string): GuideTip | null {
  const pageTips = TIPS[path];
  if (!pageTips) return null;
  return pageTips[section] || null;
}

export default function InterpreterGuide() {
  const [isMinimized, setIsMinimized] = useState(() => {
    try {
      return localStorage.getItem('lvp_guide_minimized') === 'true';
    } catch { return false; }
  });
  const [currentTip, setCurrentTip] = useState<GuideTip | null>(null);
  const [showBubble, setShowBubble] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(() => {
    try {
      return localStorage.getItem('lvp_guide_interacted') === 'true';
    } catch { return false; }
  });
  const [isVisible, setIsVisible] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentSectionRef = useRef<string>('');

  // Typewriter effect
  const typeText = useCallback((text: string) => {
    setIsTyping(true);
    setTypedText('');
    if (typeTimerRef.current) clearInterval(typeTimerRef.current);
    let i = 0;
    typeTimerRef.current = setInterval(() => {
      i++;
      setTypedText(text.slice(0, i));
      if (i >= text.length) {
        if (typeTimerRef.current) clearInterval(typeTimerRef.current);
        setIsTyping(false);
      }
    }, 18);
  }, []);

  // Detect mouse position over data-guide sections
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const guideEl = el.closest('[data-guide]');
      if (!guideEl) {
        // Keep current tip for a bit before hiding
        return;
      }
      const section = guideEl.getAttribute('data-guide') || '';
      if (section === currentSectionRef.current) return;
      currentSectionRef.current = section;

      const path = getCurrentPath();
      const tip = getTipForSection(path, section);
      if (tip) {
        setCurrentTip(tip);
        setShowBubble(true);
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        typeText(tip.message);
      }
    };

    const handleMouseLeaveSection = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const guideEl = el.closest('[data-guide]');
      if (!guideEl) return;
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setShowBubble(false);
        currentSectionRef.current = '';
      }, 1200);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseout', handleMouseLeaveSection);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseout', handleMouseLeaveSection);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (typeTimerRef.current) clearInterval(typeTimerRef.current);
    };
  }, [typeText]);

  // Welcome tip on first visit to page
  useEffect(() => {
    const path = getCurrentPath();
    const pageTips = TIPS[path];
    if (pageTips && pageTips.hero && !hasInteracted) {
      const t = setTimeout(() => {
        setCurrentTip(pageTips.hero);
        setShowBubble(true);
        typeText(pageTips.hero.message);
        setHasInteracted(true);
        try { localStorage.setItem('lvp_guide_interacted', 'true'); } catch { /* noop */ }
      }, 2000);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMinimize = () => {
    const next = !isMinimized;
    setIsMinimized(next);
    try { localStorage.setItem('lvp_guide_minimized', String(next)); } catch { /* noop */ }
  };

  const closeGuide = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3 pointer-events-none">
      {/* Speech bubble */}
      {showBubble && !isMinimized && currentTip && (
        <div
          className="pointer-events-auto bg-white border border-emerald-100 rounded-2xl p-4 max-w-xs w-72"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
          onMouseEnter={() => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); }}
          onMouseLeave={() => {
            hideTimerRef.current = setTimeout(() => { setShowBubble(false); currentSectionRef.current = ''; }, 1500);
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 flex items-center justify-center bg-emerald-500 rounded-lg flex-shrink-0">
              <i className={`${currentTip.icon} text-white text-xs`}></i>
            </div>
            <p className="text-xs font-bold text-emerald-700">{currentTip.title}</p>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            {typedText}
            {isTyping && <span className="inline-block w-0.5 h-3.5 bg-emerald-400 ml-0.5 align-middle animate-pulse" />}
          </p>
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              onClick={toggleMinimize}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              Minimizar
            </button>
            <button
              onClick={closeGuide}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Avatar */}
      <button
        onClick={() => {
          if (isMinimized) {
            setIsMinimized(false);
            if (currentTip) {
              setShowBubble(true);
              typeText(currentTip.message);
            }
          } else {
            toggleMinimize();
          }
        }}
        className={`pointer-events-auto w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer relative ${
          isMinimized
            ? 'bg-emerald-500 hover:bg-emerald-600'
            : 'bg-emerald-500 hover:bg-emerald-600'
        }`}
        style={{ boxShadow: '0 4px 20px rgba(16,185,129,0.35)' }}
        aria-label="Intérprete virtual de Libras"
      >
        <i className="ri-hand-heart-line text-white text-2xl"></i>
        {/* Pulse ring when minimized */}
        {isMinimized && (
          <span className="absolute inset-0 rounded-full border-2 border-emerald-300 animate-ping opacity-60" />
        )}
      </button>
    </div>
  );
}