export const SITE_NAME = 'LVP';
export const SITE_URL = typeof import.meta.env !== 'undefined' && import.meta.env.VITE_SITE_URL
  ? import.meta.env.VITE_SITE_URL
  : 'https://librasvoxpro.com.br';

// Default SEO data
export const defaultSEO = {
  title: `${SITE_NAME} - Aprenda Libras Gratuitamente com Inteligência Artificial`,
  description: 'LVP é uma plataforma educacional 100% gratuita para aprender Libras. Dicionário de sinais, datilologia 3D, assistente virtual Gemini, demonstração de reconhecimento visual de sinais e sistema de progresso personalizado.',
  keywords: 'aprender Libras, língua brasileira de sinais, dicionário Libras, IA para Libras, datilologia, sinais em Libras, curso de Libras online, tradutor Libras, educação inclusiva, acessibilidade surdos',
  ogImage: `${SITE_URL}/og-image.jpg`,
};

// Page-specific SEO data
export const pageSEO = {
  home: {
    title: `${SITE_NAME} - Aprenda Libras Gratuitamente com Inteligência Artificial`,
    description: 'Plataforma educacional 100% gratuita para aprender Libras com inteligência artificial. Dicionário de sinais, datilologia 3D, assistente Gemini e demonstração de reconhecimento visual de sinais.',
    keywords: 'aprender Libras, língua brasileira de sinais, dicionário Libras, IA para Libras, datilologia, curso de Libras',
  },
  dictionary: {
    title: `Dicionário de Libras - ${SITE_NAME}`,
    description: 'Dicionário completo de sinais em Libras com instruções passo a passo, categorias e busca inteligente. Aprenda sinais de saudações, família, alimentos e muito mais.',
    keywords: 'dicionário Libras, sinais em Libras, glossário Libras, aprender sinais, vocabulário Libras',
  },
  alphabet: {
    title: `Alfabeto Manual em 3D - Datilologia - ${SITE_NAME}`,
    description: 'Aprenda a datilologia em Libras com visualização 3D interativa. As 26 letras do alfabeto manual com animações e instruções detalhadas.',
    keywords: 'alfabeto Libras, datilologia, alfabeto manual, letras em Libras, soletrar em Libras',
  },
  assistant: {
    title: `Assistente IA Gemini para Libras - ${SITE_NAME}`,
    description: 'Assistente virtual com IA Gemini especializado em Libras. Tutor, tradutor, prática e cultura surda em um só lugar.',
    keywords: 'IA Libras, assistente Libras, Gemini Libras, tradutor Libras, tutor de Libras',
  },
  phrases: {
    title: `Frases por Contexto - Survival Libras - ${SITE_NAME}`,
    description: 'Aprenda frases práticas de Libras para situações do cotidiano. Cenários como restaurante, hospital, trabalho e compras com sequência de sinais, glossa e explicações gramaticais.',
    keywords: 'frases Libras, contexto Libras, survival Libras, cenários Libras, conversação Libras, glossa Libras',
  },
  recognition: {
    title: `Demonstração de Reconhecimento Visual de Sinais - ${SITE_NAME}`,
    description: 'Demonstração didática de reconhecimento de sinais em Libras. Faça upload de uma imagem e veja como uma tecnologia de identificação visual poderia funcionar. Resultados simulados para fins educativos.',
    keywords: 'demonstração reconhecimento Libras, identificação visual sinais, tecnologia Libras, simulação sinais',
  },
  progress: {
    title: `Meu Progresso - ${SITE_NAME}`,
    description: 'Acompanhe seu progresso no aprendizado de Libras. Sinais aprendidos, favoritos e estatísticas de estudo.',
    keywords: 'progresso Libras, aprendizado Libras, estatísticas de estudo, acompanhamento Libras',
  },
  pricing: {
    title: `Cadastro Gratuito - ${SITE_NAME}`,
    description: 'Cadastre-se gratuitamente na plataforma LVP e tenha acesso completo a todos os recursos de aprendizado de Libras. 100% gratuito para todos.',
    keywords: 'cadastro Libras, aprender Libras gratuito, curso Libras gratuito, plataforma Libras gratuita',
  },
  courses: {
    title: `Cursos de Libras — Do Básico ao Avançado - ${SITE_NAME}`,
    description: 'Aprenda Libras com módulos acadêmicos estruturados do básico ao avançado. Gramática, vocabulário, classificadores e interpretação com referencial acadêmico.',
    keywords: 'curso Libras, aprender Libras, Libras básico, Libras avançado, gramática Libras, certificado Libras',
  },
  exercises: {
    title: `Exercícios de Libras — Prática e Avaliação - ${SITE_NAME}`,
    description: 'Pratique e avalie seu conhecimento de Libras com exercícios e quizzes acadêmicos sobre gramática, história, legislação e vocabulário.',
    keywords: 'exercícios Libras, quiz Libras, prática Libras, avaliação Libras, teste de Libras',
  },
  grammar: {
    title: `Gramática da Libras — Fonologia, Sintaxe e Classificadores - ${SITE_NAME}`,
    description: 'Estudo acadêmico completo da gramática da Libras: fonologia, morfologia, sintaxe, expressões não-manuais, classificadores e discurso. Baseado em Quadros & Karnopp (2004).',
    keywords: 'gramática Libras, fonologia Libras, sintaxe Libras, classificadores Libras, expressões faciais Libras',
  },
  references: {
    title: `Referências Bibliográficas de Libras - ${SITE_NAME}`,
    description: 'Bibliografia acadêmica completa sobre Libras: livros, artigos, legislação e recursos online para o estudo da Língua Brasileira de Sinais.',
    keywords: 'referências Libras, bibliografia Libras, livros Libras, legislação Libras, artigos científicos Libras',
  },
  flashcards: {
    title: `Flashcards SRS — Memorização de Sinais - ${SITE_NAME}`,
    description: 'Aprenda sinais de Libras com flashcards inteligentes e repetição espaçada. Memorização eficiente baseada em algoritmo SRS adaptativo.',
    keywords: 'flashcards Libras, memorização sinais, SRS, repetição espaçada, aprender Libras, anki Libras',
  },
  faq: {
    title: `Perguntas Frequentes — ${SITE_NAME}`,
    description: 'Tire todas as suas dúvidas sobre o LVP. Saiba como o projeto gratuito funciona, como se cadastrar, quem pode usar, e tudo sobre aprender Libras online.',
    keywords: 'FAQ LVP, dúvidas LVP, como usar LVP, projeto gratuito Libras, cadastro LVP, aprender Libras online',
  },
};

// Schema.org generators
export const generateWebPageSchema = (title: string, description: string, url: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title,
  description,
  url,
});

export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: 'Plataforma educacional para aprendizado de Libras com inteligência artificial',
  sameAs: [],
});

export const generateEducationalOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: SITE_NAME,
  url: SITE_URL,
  description: 'Plataforma educacional para aprendizado da Língua Brasileira de Sinais',
  areaServed: 'BR',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Cursos de Libras',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Course',
          name: 'Libras Básico',
          description: 'Curso introdutório de Libras gratuito para estudantes',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Course',
          name: 'Libras Pro',
          description: 'Curso completo de Libras com recursos avançados de IA',
        },
      },
    ],
  },
});

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const generateCourseSchema = (name: string, description: string, url: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name,
  description,
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    sameAs: SITE_URL,
  },
  url,
  courseMode: 'online',
  inLanguage: 'pt-BR',
  educationalLevel: 'beginner to advanced',
  teaches: 'Língua Brasileira de Sinais (Libras)',
});

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const generateArticleSchema = (title: string, description: string, url: string, datePublished?: string, dateModified?: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  description,
  url,
  datePublished: datePublished || new Date().toISOString(),
  dateModified: dateModified || new Date().toISOString(),
  author: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
    },
  },
});

export const generateLearningResourceSchema = (name: string, description: string, url: string) => ({
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name,
  description,
  url,
  educationalLevel: 'beginner to advanced',
  inLanguage: 'pt-BR',
  learningResourceType: 'interactive',
  isPartOf: {
    '@type': 'Course',
    name: 'Cursos de Libras',
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  },
});