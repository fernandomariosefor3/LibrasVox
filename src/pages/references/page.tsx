import { useState, useEffect } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { SEOHead } from '@/components/feature/SEOHead';
import { pageSEO, SITE_URL, generateWebPageSchema, generateLearningResourceSchema } from '@/lib/seo';
import InterpreterGuide from '@/components/feature/InterpreterGuide';

type RefCategory = 'todos' | 'livros' | 'legislacao' | 'artigos' | 'online';

const references = [
  {
    id: 1,
    category: 'livros' as const,
    authors: 'QUADROS, Ronice Müller de; KARNOPP, Lodenir Becker',
    year: '2004',
    title: 'Língua de Sinais Brasileira: Estudos Linguísticos',
    publisher: 'Artmed',
    location: 'Porto Alegre',
    description: 'Obra de referência fundamental para o estudo linguístico da Libras. Aborda fonologia, morfologia, sintaxe e aspectos discursivos da língua.',
    tags: ['Gramática', 'Linguística', 'Referência Essencial'],
    icon: 'ri-book-3-line',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 2,
    category: 'livros' as const,
    authors: 'FERREIRA BRITO, Lucinda',
    year: '1995',
    title: 'Por uma Gramática de Línguas de Sinais',
    publisher: 'Tempo Brasileiro / UFRJ',
    location: 'Rio de Janeiro',
    description: 'Pioneira no estudo gramatical da Libras no Brasil. Apresenta análise detalhada da estrutura fonológica, morfológica e sintática da língua.',
    tags: ['Gramática', 'Pioneiro', 'Fonologia'],
    icon: 'ri-book-3-line',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 3,
    category: 'livros' as const,
    authors: 'SKLIAR, Carlos (org.)',
    year: '1997',
    title: 'Educação e Exclusão: Abordagens Sócio-Antropológicas em Educação Especial',
    publisher: 'Mediação',
    location: 'Porto Alegre',
    description: 'Coletânea que discute a educação de surdos sob perspectiva sócio-antropológica, questionando o modelo clínico-terapêutico.',
    tags: ['Educação', 'Cultura Surda', 'Inclusão'],
    icon: 'ri-book-3-line',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 4,
    category: 'livros' as const,
    authors: 'STROBEL, Karin',
    year: '2008',
    title: 'As Imagens do Outro sobre a Cultura Surda',
    publisher: 'Editora UFSC',
    location: 'Florianópolis',
    description: 'Análise da cultura surda e da identidade surda, questionando representações ouvintistas e afirmando a cultura surda como legítima.',
    tags: ['Cultura Surda', 'Identidade', 'Comunidade'],
    icon: 'ri-book-3-line',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 5,
    category: 'livros' as const,
    authors: 'GESSER, Audrei',
    year: '2009',
    title: 'LIBRAS? Que língua é essa?',
    publisher: 'Parábola Editorial',
    location: 'São Paulo',
    description: 'Livro acessível que desmistifica crenças sobre a Libras e apresenta seus aspectos linguísticos de forma didática para iniciantes.',
    tags: ['Iniciante', 'Desmistificação', 'Didático'],
    icon: 'ri-book-3-line',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 6,
    category: 'legislacao' as const,
    authors: 'BRASIL',
    year: '2002',
    title: 'Lei nº 10.436, de 24 de abril de 2002',
    publisher: 'Diário Oficial da União',
    location: 'Brasília',
    description: 'Dispõe sobre a Língua Brasileira de Sinais – Libras e dá outras providências. Reconhece a Libras como meio legal de comunicação e expressão.',
    tags: ['Legislação', 'Reconhecimento', 'Fundamental'],
    icon: 'ri-government-line',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
  {
    id: 7,
    category: 'legislacao' as const,
    authors: 'BRASIL',
    year: '2005',
    title: 'Decreto nº 5.626, de 22 de dezembro de 2005',
    publisher: 'Diário Oficial da União',
    location: 'Brasília',
    description: 'Regulamenta a Lei nº 10.436/2002 e o art. 18 da Lei nº 10.098/2000. Determina a inclusão da Libras como disciplina curricular obrigatória.',
    tags: ['Legislação', 'Educação', 'Intérpretes'],
    icon: 'ri-government-line',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
  {
    id: 8,
    category: 'legislacao' as const,
    authors: 'BRASIL',
    year: '2015',
    title: 'Lei nº 13.146, de 6 de julho de 2015 — Lei Brasileira de Inclusão',
    publisher: 'Diário Oficial da União',
    location: 'Brasília',
    description: 'Institui a Lei Brasileira de Inclusão da Pessoa com Deficiência (Estatuto da Pessoa com Deficiência), reforçando direitos linguísticos dos surdos.',
    tags: ['Inclusão', 'Acessibilidade', 'Direitos'],
    icon: 'ri-government-line',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
  {
    id: 9,
    category: 'artigos' as const,
    authors: 'QUADROS, Ronice Müller de',
    year: '1997',
    title: 'Educação de Surdos: A Aquisição da Linguagem',
    publisher: 'Artmed',
    location: 'Porto Alegre',
    description: 'Estudo sobre a aquisição da Libras como primeira língua por crianças surdas, com implicações para a educação bilíngue.',
    tags: ['Aquisição', 'Educação Bilíngue', 'Infância'],
    icon: 'ri-article-line',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    id: 10,
    category: 'artigos' as const,
    authors: 'LACERDA, Cristina B. F. de',
    year: '1998',
    title: 'Um pouco da história das diferentes abordagens na educação dos surdos',
    publisher: 'Cadernos CEDES, v. 19, n. 46',
    location: 'Campinas',
    description: 'Revisão histórica das abordagens educacionais para surdos: oralismo, comunicação total e bilinguismo.',
    tags: ['História', 'Educação', 'Bilinguismo'],
    icon: 'ri-article-line',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    id: 11,
    category: 'online' as const,
    authors: 'INES — Instituto Nacional de Educação de Surdos',
    year: '2024',
    title: 'Portal do INES — Materiais Pedagógicos e Pesquisas',
    publisher: 'Ministério da Educação',
    location: 'ines.gov.br',
    description: 'Portal oficial do INES com materiais pedagógicos, dicionários de Libras, pesquisas acadêmicas e recursos para educadores.',
    tags: ['Recurso Online', 'Oficial', 'Materiais'],
    icon: 'ri-global-line',
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    url: 'https://www.ines.gov.br',
  },
  {
    id: 12,
    category: 'online' as const,
    authors: 'SPREAD THE SIGN',
    year: '2024',
    title: 'Spread the Sign — Dicionário Internacional de Línguas de Sinais',
    publisher: 'European Sign Language Centre',
    location: 'spreadthesign.com',
    description: 'Dicionário online multilíngue de línguas de sinais, incluindo Libras, com vídeos de sinais em mais de 40 línguas.',
    tags: ['Dicionário', 'Internacional', 'Vídeos'],
    icon: 'ri-global-line',
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    url: 'https://www.spreadthesign.com',
  },
  {
    id: 13,
    category: 'livros' as const,
    authors: 'SKLIAR, Carlos; LAMPERT, Karina',
    year: '2001',
    title: 'A Surdez: Um Olhar sobre as Diferenças',
    publisher: 'Mediação',
    location: 'Porto Alegre',
    description: 'Obra que reflete sobre a surdez como diferença, longe do modelo de deficiência. Discute identidade surda, educação bilíngue e os direitos linguísticos dos surdos.',
    tags: ['Identidade Surda', 'Direitos Linguísticos', 'Educação'],
    icon: 'ri-book-3-line',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 14,
    category: 'livros' as const,
    authors: 'SKLIAR, Carlos (org.)',
    year: '2009',
    title: 'Bilinguismo e Educação de Surdos: Reflexões sobre a Inclusão',
    publisher: 'Mediação',
    location: 'Porto Alegre',
    description: 'Organizado por Skliar, reúne textos sobre bilinguismo Libras-Português e as contradições entre a educação bilíngue e as políticas de inclusão escolar.',
    tags: ['Bilinguismo', 'Inclusão', 'Política Educacional'],
    icon: 'ri-book-3-line',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 15,
    category: 'livros' as const,
    authors: 'STROBEL, Karin',
    year: '2000',
    title: 'Surdos no Bilinguismo',
    publisher: 'Editora da UFSC',
    location: 'Florianópolis',
    description: 'Estudo pionero sobre a experiência de surdos no contexto bilíngue Libras-Português. Analisa as práticas linguísticas da comunidade surda e a educação bilíngue.',
    tags: ['Bilinguismo', 'Comunidade Surda', 'Educação'],
    icon: 'ri-book-3-line',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 16,
    category: 'livros' as const,
    authors: 'STROBEL, Karin; FELIPE, Tanya A.',
    year: '2006',
    title: 'Dicionário de Surdos: Termos para a Compreensão da Surdez',
    publisher: 'Arte & Letra',
    location: 'Florianópolis',
    description: 'Dicionário conceitual que organiza e explica termos fundamentais para compreender a surdez, a cultura surda e a língua de sinais no contexto brasileiro.',
    tags: ['Dicionário Conceitual', 'Terminologia', 'Referência'],
    icon: 'ri-book-3-line',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 17,
    category: 'artigos' as const,
    authors: 'LACERDA, Cristina B. F. de',
    year: '2003',
    title: 'A bilinguização e a educação de surdos: possibilidades e impossibilidades',
    publisher: 'Cadernos CEDES, v. 23, n. 62',
    location: 'Campinas',
    description: 'Discussão crítica sobre as possibilidades e limites da educação bilíngue para surdos no Brasil, analisando políticas públicas e práticas escolares.',
    tags: ['Educação Bilíngue', 'Políticas Públicas', 'Crítica'],
    icon: 'ri-article-line',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    id: 18,
    category: 'artigos' as const,
    authors: 'LACERDA, Cristina B. F. de; CORAZZA, Sergio; DELGADO, Cristina',
    year: '2005',
    title: 'Sinais em Libras: Comunicação, Identidade e Linguagem',
    publisher: 'Artmed',
    location: 'São Paulo',
    description: 'Artigo que discute os sinais em Libras como forma de comunicação, expressão de identidade cultural surda e sistema linguístico estruturado.',
    tags: ['Identidade', 'Comunicação', 'Linguística'],
    icon: 'ri-article-line',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    id: 19,
    category: 'livros' as const,
    authors: 'LIDDELL, Scott K.; JOHNSON, Robert E.',
    year: '2011',
    title: 'American Sign Language: The Phonological Base',
    publisher: 'Gallaudet University Press',
    location: 'Washington, D.C.',
    description: 'Obra de referência internacional sobre a estrutura fonológica das línguas de sinais. Fundamenta a compreensão dos parâmetros fonológicos aplicáveis também à Libras.',
    tags: ['Fonologia', 'Referência Internacional', 'Linguística'],
    icon: 'ri-book-3-line',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 20,
    category: 'artigos' as const,
    authors: 'LIDDELL, Scott K.',
    year: '2003',
    title: 'Sources of Meaning in ASL Classifier Predicates',
    publisher: 'Sign Language Studies, v. 3, n. 3',
    location: 'Gallaudet University Press',
    description: 'Artigo seminal sobre classificadores e a gramática das línguas de sinais. As análises de Liddell são fundamentais para o estudo dos classificadores na Libras.',
    tags: ['Classificadores', 'Gramática', 'Referência Internacional'],
    icon: 'ri-article-line',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    id: 21,
    category: 'artigos' as const,
    authors: 'LIDDELL, Scott K.',
    year: '1995',
    title: 'Real, Surrogate and Token Space: Grammatical Consequences in ASL',
    publisher: 'Sign Language & Linguistics, v. 1, n. 2',
    location: 'Amsterdam',
    description: 'Análise das categorias de espaço na língua de sinais e suas consequências gramaticais. Referência essencial para o estudo de roleshift e direção do olhar na Libras.',
    tags: ['Roleshift', 'Espaço Signado', 'Gramática'],
    icon: 'ri-article-line',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    id: 22,
    category: 'livros' as const,
    authors: 'SACKS, Oliver',
    year: '2009',
    title: 'Vendo Vozes: Uma Jornada no Mundo dos Surdos',
    publisher: 'Record',
    location: 'Rio de Janeiro',
    description: 'Obra clássica do neurologista Oliver Sacks que explora a cultura surda, a identidade linguística e a história das línguas de sinais com profundidade humanista.',
    tags: ['Cultura Surda', 'Neurologia', 'Identidade'],
    icon: 'ri-book-3-line',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 23,
    category: 'livros' as const,
    authors: 'CAPOVILLA, Fernando C.; RAPHAEL, Walkiria D.',
    year: '2001',
    title: 'Dicionário Enciclopédico da Língua Brasileira de Sinais — Libras',
    publisher: 'Edusp / Feneis',
    location: 'São Paulo',
    description: 'Referência absoluta para a lexicografia da Libras. O dicionário apresenta mais de 3.000 sinais ilustrados com fotos sequenciais, além de informações sobre etimologia, variação regional e contextos de uso.',
    tags: ['Dicionário', 'Lexicografia', 'Referência Essencial'],
    icon: 'ri-book-3-line',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 24,
    category: 'livros' as const,
    authors: 'CAPOVILLA, Fernando C.',
    year: '2004',
    title: 'Noções de Semântica Lexical da Libras: Uma Abordagem para Dicionários',
    publisher: 'Edusp',
    location: 'São Paulo',
    description: 'Análise semântica da estrutura lexical da Libras, discutindo categorias gramaticais, composição de sinais e critérios de lematização para dicionários bilíngues Libras-Português.',
    tags: ['Semântica', 'Lexicografia', 'Linguística'],
    icon: 'ri-book-3-line',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 25,
    category: 'artigos' as const,
    authors: 'CAPOVILLA, Fernando C.; DUDUCHI, Marcelo; RAPHAEL, Walkiria D.',
    year: '2010',
    title: 'Libras em Contexto: Uso e Aquisição da Língua de Sinais no Brasil',
    publisher: 'Psicologia USP, v. 21, n. 3',
    location: 'São Paulo',
    description: 'Estudo empírico sobre os padrões de uso da Libras entre surdos e ouvintes no Brasil, analisando fatores sociolinguísticos que influenciam a aquisição e manutenção da língua.',
    tags: ['Aquisição', 'Sociolinguística', 'Empírico'],
    icon: 'ri-article-line',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    id: 26,
    category: 'livros' as const,
    authors: 'SUTTON-SPENCE, Rachel; WOLL, Bencie',
    year: '1999',
    title: 'The Linguistics of British Sign Language: An Introduction',
    publisher: 'Cambridge University Press',
    location: 'Cambridge',
    description: 'Texto introdutório fundamental sobre linguística de línguas de sinais. Apesar de focar na BSL, os conceitos de fonologia, morfologia e sintaxe são diretamente aplicáveis ao estudo da Libras.',
    tags: ['Introdução', 'Linguística', 'Referência Internacional'],
    icon: 'ri-book-3-line',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 27,
    category: 'livros' as const,
    authors: 'SUTTON-SPENCE, Rachel; BOYES-BRAEM, Penny',
    year: '2013',
    title: 'Introduction to Sign Language Linguistics',
    publisher: 'De Gruyter Mouton',
    location: 'Berlin / Boston',
    description: 'Compilação comparativa de conceitos linguísticos aplicados a diversas línguas de sinais. Cobre fonologia, morfologia, sintaxe e semântica com dados de Libras, ASL, BSL e outras línguas de sinais.',
    tags: ['Linguística Comparada', 'Fonologia', 'Referência Internacional'],
    icon: 'ri-book-3-line',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 28,
    category: 'artigos' as const,
    authors: 'SUTTON-SPENCE, Rachel',
    year: '2010',
    title: 'Visual Poetry in Sign Language: Metaphor and Iconicity',
    publisher: 'Sign Language Studies, v. 10, n. 2',
    location: 'Gallaudet University Press',
    description: 'Análise da poesia visual em línguas de sinais, discutindo metáfora e iconicidade. Referência importante para o estudo da criação artística e dos recursos visuais-gestuais na Libras.',
    tags: ['Poesia em Sinais', 'Metáfora', 'Iconicidade'],
    icon: 'ri-article-line',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    id: 29,
    category: 'livros' as const,
    authors: 'KLIMA, Edward S.; BELLUGI, Ursula',
    year: '1979',
    title: 'The Signs of Language',
    publisher: 'Harvard University Press',
    location: 'Cambridge, MA',
    description: 'Obra fundadora da linguística de línguas de sinais. Demonstra que as línguas de sinais são línguas naturais completas, com estrutura gramatical independente do idioma oral circundante. Base para toda a literatura subsequente sobre Libras.',
    tags: ['Linguística', 'Pioneiro', 'Referência Internacional'],
    icon: 'ri-book-3-line',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 30,
    category: 'artigos' as const,
    authors: 'NEIVA, Maria de Lourdes M.',
    year: '1997',
    title: 'Educação Bilíngue para Surdos no Brasil: Desafios e Possibilidades',
    publisher: 'Perspectiva, v. 15, n. 1',
    location: 'Florianópolis',
    description: 'Artigo pioneiro que sistematiza os princípios da educação bilíngue para surdos no contexto brasileiro, discutindo a relação entre Libras como L1 e Português como L2.',
    tags: ['Educação Bilíngue', 'L1 e L2', 'Pioneiro'],
    icon: 'ri-article-line',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    id: 31,
    category: 'artigos' as const,
    authors: 'CAPOVILLA, Fernando C.; RAPHAEL, Walkiria D.',
    year: '2005',
    title: 'Teste de Percepção de Sinais de Libras (TPS-Libras): Manual Técnico',
    publisher: 'Psicologia USP, v. 16, n. 2',
    location: 'São Paulo',
    description: 'Apresentação do TPS-Libras, instrumento psicolinguístico padronizado para avaliar a percepção de sinais em Libras. Desenvolvido para surdos e ouvintes fluentes, o teste mede a competência receptiva em língua de sinais brasileira.',
    tags: ['Psicolinguística', 'Avaliação', 'Instrumento Padronizado'],
    icon: 'ri-article-line',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    id: 32,
    category: 'artigos' as const,
    authors: 'CAPOVILLA, Fernando C.; RAPHAEL, Walkiria D.',
    year: '2006',
    title: 'Teste de Fluência de Sinais de Libras (TWF-Libras): Avaliação da Produção de Sinais',
    publisher: 'Psicologia USP, v. 17, n. 2',
    location: 'São Paulo',
    description: 'Desenvolvimento e validação do TWF-Libras, instrumento que avalia a fluência de produção de sinais em Libras. Mede a velocidade, precisão e criatividade na geração de sinais por usuários da língua.',
    tags: ['Fluência', 'Avaliação', 'Psicolinguística'],
    icon: 'ri-article-line',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    id: 33,
    category: 'livros' as const,
    authors: 'CAPOVILLA, Fernando C.; RAPHAEL, Walkiria D.',
    year: '2007',
    title: 'Instrumentos de Avaliação Psicolinguística da Libras: Manual Completo',
    publisher: 'Edusp',
    location: 'São Paulo',
    description: 'Manual completo dos instrumentos de avaliação psicolinguística da Libras desenvolvidos pelo grupo de pesquisa do ILL. Inclui TPS-Libras, TWF-Libras, Teste de Vocabulário e outros instrumentos padronizados para avaliação linguística de surdos.',
    tags: ['Avaliação', 'Instrumento Padronizado', 'Psicolinguística'],
    icon: 'ri-book-3-line',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 34,
    category: 'livros' as const,
    authors: 'ROZANES, Rachel',
    year: '2011',
    title: 'Tradução e Interpretação em Libras: Questões Teóricas e Práticas',
    publisher: 'Arte & Letra',
    location: 'Florianópolis',
    description: 'Obra fundamental sobre a teoria e prática da tradução e interpretação em Libras. Discute o papel do intérprete como mediador linguístico-cultural, processos de transferência entre Libras e Português, e a formação profissional de tradutores e intérpretes.',
    tags: ['Tradução e Interpretação', 'Formação', 'Referência Essencial'],
    icon: 'ri-book-3-line',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 35,
    category: 'artigos' as const,
    authors: 'ROZANES, Rachel; MELO, Debora de Oliveira',
    year: '2013',
    title: 'O Intérprete de Libras no Contexto da Educação Inclusiva: Desafios e Possibilidades',
    publisher: 'Revista Brasileira de Educação Especial, v. 19, n. 1',
    location: 'Marília',
    description: 'Análise do papel do intérprete de Libras na educação inclusiva, discutindo a tensão entre a função de intérprete e a de educador, e os desafios éticos e linguísticos da mediação em sala de aula.',
    tags: ['Intérpretes', 'Educação Inclusiva', 'Ética Profissional'],
    icon: 'ri-article-line',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    id: 36,
    category: 'livros' as const,
    authors: 'GUARINELLO, Maria Luiza',
    year: '2004',
    title: 'A Cultura Surda e a Intervenção do Intérprete de Libras',
    publisher: 'Universidade Federal de Santa Catarina',
    location: 'Florianópolis',
    description: 'Estudo sobre a intervenção do intérprete de Libras como mediador entre culturas surda e ouvinte. Analisa a identidade profissional do intérprete, as demandas da comunidade surda e os desafios da mediação linguístico-cultural.',
    tags: ['Intérpretes', 'Cultura Surda', 'Identidade Profissional'],
    icon: 'ri-book-3-line',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 37,
    category: 'artigos' as const,
    authors: 'GUARINELLO, Maria Luiza',
    year: '2007',
    title: 'O Intérprete de Libras como Tradutor: Reflexões sobre a Prática Interpretativa',
    publisher: 'Revista Linguagem em (Dis)curso, v. 7, n. 3',
    location: 'Tubarão',
    description: 'Reflexões teóricas sobre a prática da interpretação em Libras sob a ótica dos Estudos da Tradução. Discute estratégias de transferência, equivalência linguística e a especificidade da tradução entre modalidades distintas (visual-gestual e oral-auditiva).',
    tags: ['Tradução', 'Estudos da Tradução', 'Prática Interpretativa'],
    icon: 'ri-article-line',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    id: 38,
    category: 'artigos' as const,
    authors: 'MELO, Debora de Oliveira; ROZANES, Rachel',
    year: '2015',
    title: 'A Profissionalização do Intérprete de Libras no Brasil: Avanços e Tensões',
    publisher: 'Cadernos CEDES, v. 35, n. 95',
    location: 'Campinas',
    description: 'Análise do processo de profissionalização do intérprete de Libras no Brasil, desde a Lei 10.436/2002 até a regulamentação profissional. Discute avanços na formação e as tensões entre mercado de trabalho e qualificação técnica.',
    tags: ['Intérpretes', 'Regulamentação', 'Formação Profissional'],
    icon: 'ri-article-line',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    id: 39,
    category: 'artigos' as const,
    authors: 'QUADROS, Ronice Müller de; LILLO-MARTIN, Diane',
    year: '2010',
    title: 'Bimodal Bilingualism: Code-Blending between a Signed and a Spoken Language',
    publisher: 'Language & Linguistics Compass, v. 4, n. 10',
    location: 'Oxford',
    description: 'Estudo sobre bilinguismo bimodal (Libras e Português), analisando o fenômeno do code-blending — mistura simultânea de sinais e palavras. Referência essencial para intérpretes e pesquisadores que trabalham com alternância de línguas em contextos bilíngues.',
    tags: ['Bilinguismo Bimodal', 'Code-Blending', 'Referência Internacional'],
    icon: 'ri-article-line',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
];

const categoryInfo = {
  todos: { label: 'Todas', icon: 'ri-list-check', count: references.length },
  livros: { label: 'Livros', icon: 'ri-book-3-line', count: references.filter((r) => r.category === 'livros').length },
  legislacao: { label: 'Legislação', icon: 'ri-government-line', count: references.filter((r) => r.category === 'legislacao').length },
  artigos: { label: 'Artigos', icon: 'ri-article-line', count: references.filter((r) => r.category === 'artigos').length },
  online: { label: 'Recursos Online', icon: 'ri-global-line', count: references.filter((r) => r.category === 'online').length },
};

export default function ReferencesPage() {
  const [filter, setFilter] = useState<RefCategory>('todos');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const filtered = filter === 'todos' ? references : references.filter((r) => r.category === filter);

  const seo = pageSEO.references;
  const canonical = `${SITE_URL}/referencias`;

  const schema = [
    generateWebPageSchema(seo.title, seo.description, canonical),
    generateLearningResourceSchema('Referências Bibliográficas de Libras', 'Bibliografia acadêmica selecionada para aprofundamento no estudo da Libras.', canonical),
  ];

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonical={canonical}
        ogTitle={seo.title}
        ogDescription={seo.description}
        ogType="website"
        ogUrl={canonical}
        schema={schema}
      />

      <div className="min-h-screen bg-white">
        <Navbar />

        {/* Hero */}
        <section className="pt-28 pb-12 px-4 md:px-8 bg-gradient-to-b from-slate-50 to-white" data-guide="header">
          <div className="max-w-5xl mx-auto">
            <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-50 border border-teal-200 rounded-full text-teal-700 text-sm font-semibold mb-5">
                <i className="ri-file-text-line"></i>
                Referências Bibliográficas
              </div>
              <h1
                className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4"
               
              >
                Materiais de{' '}
                <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">
                  Estudo
                </em>
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
                Referências acadêmicas selecionadas para aprofundamento no estudo da Libras. Obras fundamentais, legislação vigente, artigos científicos e recursos digitais.
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 px-4 md:px-8 pb-20" data-guide="references">
          <div className="max-w-5xl mx-auto">

            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              {(Object.entries(categoryInfo) as [RefCategory, typeof categoryInfo.todos][]).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    filter === key
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <i className={`${info.icon} text-sm`}></i>
                  {info.label}
                  <span className="text-xs opacity-70">({info.count})</span>
                </button>
              ))}
            </div>

            {/* References grid */}
            <div className="space-y-4">
              {filtered.map((ref, idx) => (
                <div
                  key={ref.id}
                  className={`rounded-2xl border-2 ${ref.border} bg-white overflow-hidden transition-all duration-500 ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${idx * 60}ms` }}
                >
                  <div className="p-5 md:p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 flex items-center justify-center rounded-xl ${ref.bg} border ${ref.border} flex-shrink-0`}>
                        <i className={`${ref.icon} ${ref.color} text-lg`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Citation */}
                        <p className="text-xs text-slate-400 font-mono mb-2 leading-relaxed">
                          {ref.authors}. <strong className="text-slate-600">{ref.title}</strong>. {ref.location}: {ref.publisher}, {ref.year}.
                        </p>
                        {/* Description */}
                        <p className="text-sm text-slate-600 leading-relaxed mb-3">{ref.description}</p>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {ref.tags.map((tag) => (
                            <span key={tag} className={`text-xs px-2.5 py-1 rounded-full font-medium ${ref.bg} ${ref.color} border ${ref.border}`}>
                              {tag}
                            </span>
                          ))}
                          {'url' in ref && ref.url && (
                            <a
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition-colors flex items-center gap-1"
                            >
                              <i className="ri-external-link-line text-xs"></i>
                              Acessar
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ABNT note */}
            <div className="mt-10 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-slate-200 rounded-lg flex-shrink-0">
                  <i className="ri-information-line text-slate-600 text-base"></i>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 mb-1">Norma de Citação</p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    As referências acima seguem a norma <strong>ABNT NBR 6023:2018</strong>. Para trabalhos acadêmicos, recomenda-se verificar a edição mais recente das obras e consultar as normas institucionais de cada universidade.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
      <InterpreterGuide />
    </>
  );
}
