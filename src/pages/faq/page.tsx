import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { SEOHead } from '@/components/feature/SEOHead';
import { pageSEO, SITE_URL, generateWebPageSchema, generateFAQSchema } from '@/lib/seo';
import InterpreterGuide from '@/components/feature/InterpreterGuide';
import FeedbackForm from './components/FeedbackForm';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  title: string;
  icon: string;
  items: FAQItem[];
}

const categories: FAQCategory[] = [
  {
    title: 'Sobre o Projeto',
    icon: 'ri-hand-heart-line',
    items: [
      {
        q: 'O que é o LVP?',
        a: 'O LVP é uma plataforma educacional 100% gratuita para aprender a Língua Brasileira de Sinais (Libras). Criado por Fernando Mário da Silva Martins, o projeto nasceu com o propósito de democratizar o acesso ao aprendizado de Libras e promover a inclusão da comunidade surda no Brasil.',
      },
      {
        q: 'Por que o projeto é gratuito?',
        a: 'Acreditamos que o conhecimento sobre Libras deve ser acessível a todos, sem barreiras econômicas. A língua de sinais é um direito de comunicação da comunidade surda, e seu aprendizado não deveria depender de condições financeiras. O projeto é mantido com recursos próprios do criador e apoio da comunidade.',
      },
      {
        q: 'Quem criou o LVP?',
        a: 'O LVP foi criado por Fernando Mário da Silva Martins, um entusiasta da acessibilidade e defensor da inclusão da comunidade surda. O projeto é uma iniciativa independente, desenvolvida com dedicação pessoal para beneficiar estudantes, profissionais e qualquer pessoa interessada em aprender Libras.',
      },
      {
        q: 'Como posso entrar em contato?',
        a: 'Você pode enviar um e-mail para librasvox@gmail.com. Fernando responde pessoalmente todas as mensagens e está sempre aberto a sugestões, feedbacks e parcerias que possam fortalecer o projeto.',
      },
      {
        q: 'O projeto tem fins lucrativos?',
        a: 'Não. O LVP é uma iniciativa sem fins lucrativos. Não há planos de cobrança, anúncios invasivos ou venda de dados dos usuários. O objetivo é puramente educacional e inclusivo.',
      },
    ],
  },
  {
    title: 'Cadastro e Acesso',
    icon: 'ri-user-add-line',
    items: [
      {
        q: 'Preciso pagar alguma coisa para usar?',
        a: 'Não, nunca. O LVP é 100% gratuito e sempre será. Não existe plano pago, assinatura mensal, versão premium ou qualquer tipo de cobrança. Todos os recursos estão disponíveis para todos os usuários cadastrados.',
      },
      {
        q: 'Por que preciso me cadastrar?',
        a: 'O cadastro é necessário apenas para personalizar sua experiência: salvar seu progresso, marcar sinais como aprendidos, favoritar conteúdos e acompanhar sua evolução no aprendizado. Não usamos seus dados para fins comerciais.',
      },
      {
        q: 'Quem pode se cadastrar?',
        a: 'Qualquer pessoa! Não importa a idade, profissão ou nível de conhecimento prévio. A plataforma é aberta a estudantes, professores, profissionais de saúde, intérpretes em formação, pais de crianças surdas, ou simplesmente curiosos que desejam aprender Libras.',
      },
      {
        q: 'Preciso de cartão de crédito para cadastrar?',
        a: 'De forma alguma. O cadastro é totalmente gratuito e não solicita nenhuma informação financeira. Basta informar nome, e-mail e uma senha para criar sua conta.',
      },
      {
        q: 'Meus dados estão seguros?',
        a: 'Sim. Levamos a privacidade a sério. Seus dados pessoais são armazenados com criptografia e não são compartilhados com terceiros. Você pode excluir sua conta a qualquer momento.',
      },
      {
        q: 'Posso usar sem fazer cadastro?',
        a: 'Parte do conteúdo pode ser visualizada sem cadastro, como algumas páginas informativas. No entanto, para ter acesso completo a todos os recursos (dicionário, exercícios, progresso, IA Assistente, favoritos), é necessário criar uma conta gratuita.',
      },
    ],
  },
  {
    title: 'Recursos e Funcionalidades',
    icon: 'ri-apps-line',
    items: [
      {
        q: 'Quais recursos estão disponíveis?',
        a: 'A plataforma oferece: Dicionário com 146+ sinais reais fotografados, Alfabeto 3D interativo com fotos das mãos, Cursos estruturados do Básico ao Avançado, Exercícios práticos com quiz interativo, IA Assistente Gemini com 4 modos especializados, Demonstração de reconhecimento visual de sinais por upload de imagem, Acompanhamento de progresso pessoal, e um Intérprete Virtual que guia você pelo site.',
      },
      {
        q: 'A IA Assistente tem limite de uso?',
        a: 'Não. A IA Gemini está disponível sem restrições de uso para todos os usuários cadastrados. Você pode fazer quantas perguntas quiser sobre Libras, gramática, cultura surda ou prática de sinais.',
      },
      {
        q: 'Como funciona a demonstração de reconhecimento de sinais?',
        a: 'A demonstração permite que você faça upload de uma imagem mostrando um sinal em Libras e receba um resultado simulado — gerado automaticamente para fins didáticos. Não é uma IA real treinada em Libras, mas uma simulação que mostra como a tecnologia de reconhecimento visual poderia funcionar no futuro. Sempre valide seu aprendizado com um professor ou intérprete qualificado.',
      },
      {
        q: 'Posso salvar meu progresso?',
        a: 'Sim! Após o cadastro, você pode marcar sinais como "aprendidos", favoritar conteúdos, acompanhar dias consecutivos de estudo e visualizar estatísticas de evolução no seu painel de progresso.',
      },
      {
        q: 'Recebo certificado ao completar os cursos?',
        a: 'Sim! Ao finalizar os módulos de cada nível (Básico, Intermediário e Avançado), você recebe um certificado de conclusão digital que pode ser baixado e compartilhado.',
      },
      {
        q: 'O dicionário tem quantos sinais?',
        a: 'Atualmente o dicionário conta com mais de 146 sinais organizados em 20 categorias, como Alimentos, Família, Emoções, Saudações, Animais, Cores, Tempo, Transporte, entre outras. Novos sinais são adicionados periodicamente.',
      },
    ],
  },
  {
    title: 'Aprendizado de Libras',
    icon: 'ri-graduation-cap-line',
    items: [
      {
        q: 'O LVP substitui um curso presencial?',
        a: 'Não. O LVP é uma ferramenta complementar excelente para estudo independente, mas não substitui a interação com falantes nativos de Libras nem aulas com professores surdos qualificados. Recomendamos usar a plataforma como apoio ao aprendizado, combinando com prática presencial quando possível.',
      },
      {
        q: 'Por onde devo começar a aprender?',
        a: 'Sugerimos começar pelo Alfabeto (Datilologia) para aprender a soletrar, depois explorar o Dicionário por categorias básicas como "Saudações" e "Família", e então iniciar o Curso Básico estruturado. O Intérprete Virtual pode te guiar pelo caminho ideal.',
      },
      {
        q: 'Quanto tempo leva para aprender Libras?',
        a: 'O aprendizado de uma língua é um processo contínuo. Com dedicação diária de 15-30 minutos na plataforma, é possível adquirir vocabulário básico em algumas semanas. A fluência, no entanto, exige anos de prática constante e imersão na comunidade surda.',
      },
      {
        q: 'As fotos dos sinais são reais?',
        a: 'Sim! As fotos são imagens profissionais de mãos realizando cada sinal, com fundo neutro para facilitar a visualização. Isso garante uma referência visual precisa e de qualidade para o aprendizado.',
      },
      {
        q: 'Libras é a mesma coisa que mimica ou gestos?',
        a: 'Não. A Libras é uma língua completa e estruturada, com gramática própria, sintaxe, classificadores e expressões faciais que carregam significado gramatical. É tão complexa e rica quanto qualquer língua oral. Os gestos informais são apenas comunicação gestual, não linguagem estruturada.',
      },
      {
        q: 'Posso aprender Libras sozinho?',
        a: 'Você pode começar sozinho usando a plataforma, mas para desenvolver fluência é essencial praticar com a comunidade surda. A língua de sinais é visual e espacial, e o aprendizado presencial acelera muito a aquisição da linguagem.',
      },
    ],
  },
  {
    title: 'Técnico e Acessibilidade',
    icon: 'ri-settings-3-line',
    items: [
      {
        q: 'Em quais dispositivos funciona?',
        a: 'O LVP funciona em computadores, tablets e smartphones. É uma aplicação web responsiva, então basta acessar pelo navegador. A demonstração de reconhecimento de sinais funciona por upload de imagem — basta selecionar uma foto do seu dispositivo.',
      },
      {
        q: 'Preciso instalar algum aplicativo?',
        a: 'Não. O LVP é uma plataforma web. Basta acessar pelo navegador do seu dispositivo — Chrome, Firefox, Safari, Edge ou qualquer navegador moderno. Não há necessidade de download ou instalação.',
      },
      {
        q: 'O site é acessível para pessoas com deficiência visual?',
        a: 'O site foi desenvolvido seguindo boas práticas de acessibilidade web (WCAG), com textos alternativos para imagens, contraste adequado, navegação por teclado e estrutura semântica. Estamos sempre trabalhando para melhorar ainda mais a acessibilidade.',
      },
      {
        q: 'Por que as imagens demoram a carregar?',
        a: 'As fotos dos sinais são imagens de alta qualidade para garantir clareza visual. Se estiver com conexão lenta, tente usar uma rede Wi-Fi ou aguardar o carregamento completo. Estamos otimizando continuamente o desempenho da plataforma.',
      },
      {
        q: 'Encontrei um erro no site. O que faço?',
        a: 'Por favor, reporte o erro enviando um e-mail para librasvox@gmail.com com detalhes do problema, print da tela (se possível) e o dispositivo/navegador utilizado. Sua colaboração ajuda a melhorar a plataforma para todos.',
      },
      {
        q: 'Posso sugerir novos sinais ou funcionalidades?',
        a: 'Com certeza! Envie suas sugestões para librasvox@gmail.com. Adoramos receber feedback da comunidade e priorizar desenvolvimentos que tragam mais valor aos usuários.',
      },
    ],
  },
  {
    title: 'Colaboração e Apoio',
    icon: 'ri-heart-3-line',
    items: [
      {
        q: 'Posso contribuir com o projeto?',
        a: 'Sim! Existem várias formas de contribuir: enviar sugestões de melhorias, reportar erros, compartilhar o site com amigos e colegas, indicar recursos educacionais de Libras, ou simplesmente usar a plataforma e deixar seu feedback.',
      },
      {
        q: 'O projeto aceita doações?',
        a: 'Atualmente o projeto é mantido com recursos próprios do criador. Se futuramente houver necessidade de apoio financeiro para custear servidores ou desenvolvimento, isso será comunicado de forma transparente à comunidade.',
      },
      {
        q: 'Posso divulgar o LVP?',
        a: 'Por favor, divulgue! Quanto mais pessoas conhecerem e usarem a plataforma, mais forte fica o impacto social do projeto. Compartilhe nas redes sociais, grupos de estudo, escolas, universidades e com profissionais da área de surdez.',
      },
      {
        q: 'Posso usar o conteúdo do site em aulas ou apresentações?',
        a: 'Sim, desde que com atribuição ao LVP. O conteúdo educacional é destinado ao aprendizado de Libras e pode ser utilizado em contextos educacionais. Para usos comerciais ou republicação, entre em contato pelo e-mail.',
      },
      {
        q: 'Há parcerias com escolas ou instituições?',
        a: 'Estamos abertos a parcerias educacionais! Se você representa uma escola, universidade, ONG ou instituição que trabalha com surdez e acessibilidade, envie um e-mail para librasvox@gmail.com para conversarmos sobre possibilidades de colaboração.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openCategory, setOpenCategory] = useState<string>('Sobre o Projeto');
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const allFaqs = categories.flatMap((cat) => cat.items.map((item) => ({ category: cat.title, ...item })));

  const seo = pageSEO.faq;

  const canonical = `${SITE_URL}/faq`;

  const schema = [
    generateWebPageSchema(seo.title, seo.description, canonical),
    generateFAQSchema(allFaqs.map((f) => ({ question: f.q, answer: f.a }))),
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
      <main className="min-h-screen bg-white">
        <Navbar />

        {/* Hero */}
        <section className="pt-28 pb-12 px-4 text-center bg-gradient-to-b from-emerald-50/60 to-white" data-guide="faq-hero">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold mb-6">
            <i className="ri-question-answer-line"></i>
            Tire suas dúvidas
          </div>
          <h1
            className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Perguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Frequentes</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Encontre respostas sobre o projeto, cadastro, funcionalidades, aprendizado de Libras e muito mais. 
            Se não encontrar o que procura, envie um e-mail para{' '}
            <a href="mailto:librasvox@gmail.com" className="text-emerald-600 hover:underline font-medium">
              librasvox@gmail.com
            </a>.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-emerald-50 rounded-lg">
                <i className="ri-questionnaire-line text-emerald-600"></i>
              </div>
              <span><strong className="text-slate-700">{allFaqs.length}</strong> perguntas respondidas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-emerald-50 rounded-lg">
                <i className="ri-folder-line text-emerald-600"></i>
              </div>
              <span><strong className="text-slate-700">{categories.length}</strong> categorias</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-emerald-50 rounded-lg">
                <i className="ri-gift-line text-emerald-600"></i>
              </div>
              <span><strong className="text-slate-700">100%</strong> gratuito</span>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="max-w-5xl mx-auto px-4 pb-20" data-guide="faq-content">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
            {/* Sidebar categories */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
                Categorias
              </p>
              {categories.map((cat) => {
                const active = openCategory === cat.title;
                return (
                  <button
                    key={cat.title}
                    onClick={() => {
                      setOpenCategory(cat.title);
                      setOpenQuestion(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left cursor-pointer ${
                      active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 ${active ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                      <i className={`${cat.icon} ${active ? 'text-emerald-600' : 'text-slate-500'}`}></i>
                    </div>
                    <span className="whitespace-nowrap">{cat.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Questions */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 rounded-xl">
                  <i className={`${categories.find((c) => c.title === openCategory)?.icon || 'ri-question-line'} text-emerald-600 text-lg`}></i>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {openCategory}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {categories.find((c) => c.title === openCategory)?.items.length} perguntas nesta categoria
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {categories
                  .find((c) => c.title === openCategory)
                  ?.items.map((item, idx) => {
                    const isOpen = openQuestion === `${openCategory}-${idx}`;
                    return (
                      <div
                        key={`${openCategory}-${idx}`}
                        className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                          isOpen ? 'border-emerald-300 shadow-md shadow-emerald-50' : 'border-slate-200 hover:border-emerald-200'
                        }`}
                      >
                        <button
                          onClick={() => setOpenQuestion(isOpen ? null : `${openCategory}-${idx}`)}
                          className="w-full flex items-start justify-between px-5 py-4 text-left cursor-pointer hover:bg-slate-50/50 transition-colors"
                        >
                          <span className={`text-sm font-semibold pr-4 leading-relaxed ${isOpen ? 'text-emerald-700' : 'text-slate-800'}`}>
                            {item.q}
                          </span>
                          <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <i
                              className={`${isOpen ? 'ri-subtract-line' : 'ri-add-line'} ${isOpen ? 'text-emerald-500' : 'text-slate-400'} text-lg transition-transform`}
                            ></i>
                          </div>
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section className="bg-slate-50 py-14 px-4" data-guide="faq-contact">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mx-auto mb-5 shadow-lg shadow-emerald-200">
                <i className="ri-message-3-line text-white text-2xl"></i>
              </div>
              <h2
                className="text-2xl font-bold text-slate-900 mb-2"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                Ainda tem dúvidas ou encontrou um problema?
              </h2>
              <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
                Envie sua dúvida, reporte um erro ou sugira uma melhoria. 
                Fernando Mário da Silva Martins responde pessoalmente todas as mensagens.
              </p>
            </div>

            <FeedbackForm submitUrl="https://readdy.ai/api/form/d7ucn29jlv0i8kopubl0" />
          </div>
        </section>

        {/* Related links */}
        <section className="max-w-4xl mx-auto py-12 px-4" data-guide="faq-links">
          <h2
            className="text-lg font-bold text-slate-900 text-center mb-8"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Links úteis
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { to: '/planos', icon: 'ri-user-add-line', label: 'Cadastro Gratuito' },
              { to: '/dictionary', icon: 'ri-book-open-line', label: 'Dicionário' },
              { to: '/alphabet', icon: 'ri-keyboard-line', label: 'Alfabeto 3D' },
              { to: '/cursos', icon: 'ri-graduation-cap-line', label: 'Cursos' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-50 transition-all duration-200 group cursor-pointer"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                  <i className={`${link.icon} text-emerald-600`}></i>
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <Footer />
      </main>
      <InterpreterGuide />
    </>
  );
}