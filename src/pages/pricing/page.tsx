import { useState } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { SEOHead } from '@/components/feature/SEOHead';
import { pageSEO, SITE_URL, generateWebPageSchema, generateFAQSchema } from '@/lib/seo';
import RegisterModal from './components/RegisterModal';
import InterpreterGuide from '@/components/feature/InterpreterGuide';

const features = [
  {
    icon: 'ri-book-open-line',
    title: 'Dicionário Completo',
    desc: '146 sinais reais de Libras com fotos, descrições detalhadas e categorias organizadas.',
  },
  {
    icon: 'ri-keyboard-line',
    title: 'Alfabeto 3D Interativo',
    desc: 'Visualize todas as 26 letras do alfabeto manual com imagens reais e instruções passo a passo.',
  },
  {
    icon: 'ri-sparkling-line',
    title: 'IA Assistente Gemini',
    desc: '4 modos especializados: Tutor, Tradutor, Prática e Cultura Surda. Tire todas as suas dúvidas.',
  },
  {
    icon: 'ri-camera-ai-line',
    title: 'Demonstração de Reconhecimento',
    desc: 'Faça upload de uma imagem para testar uma simulação de reconhecimento visual de sinais. Resultados gerados automaticamente para fins didáticos.',
  },
  {
    icon: 'ri-bar-chart-line',
    title: 'Acompanhamento de Progresso',
    desc: 'Veja sua evolução, dias consecutivos de estudo, sinais aprendidos e favoritos.',
  },
  {
    icon: 'ri-graduation-cap-line',
    title: 'Cursos Estruturados',
    desc: 'Conteúdo organizado do Básico ao Avançado com gramática, exercícios e certificados.',
  },
  {
    icon: 'ri-pencil-ruler-2-line',
    title: 'Exercícios Práticos',
    desc: 'Quiz interativo com feedback imediato para fixar o que você aprendeu.',
  },
  {
    icon: 'ri-hand-heart-line',
    title: 'Intérprete Virtual',
    desc: 'Avatar guia que explica contexto sobre Libras conforme você navega pelo site.',
  },
];

const faqs = [
  {
    q: 'O site é realmente 100% gratuito?',
    a: 'Sim! Todos os recursos são gratuitos. A única exigência é fazer o cadastro para ter acesso completo à plataforma.',
  },
  {
    q: 'Quem pode se cadastrar?',
    a: 'Qualquer pessoa! Não importa se você é estudante, profissional, menor de idade ou adulto. A plataforma é aberta a todos que desejam aprender Libras.',
  },
  {
    q: 'Preciso de cartão de crédito?',
    a: 'Não. O cadastro é totalmente gratuito e não exige nenhuma forma de pagamento.',
  },
  {
    q: 'A IA Assistente tem limite de uso?',
    a: 'Não. A IA Gemini está disponível sem restrições para todos os usuários cadastrados.',
  },
  {
    q: 'Recebo certificado ao completar os cursos?',
    a: 'Sim! Ao finalizar os módulos de cada nível, você recebe um certificado de conclusão digital.',
  },
  {
    q: 'Como entro em contato com o criador?',
    a: 'Você pode enviar um e-mail para librasvox@gmail.com. Fernando Mário da Silva Martins responde pessoalmente todas as mensagens.',
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const seo = pageSEO.pricing;
  const canonical = `${SITE_URL}/cadastro`;

  const schema = [
    generateWebPageSchema(seo.title, seo.description, canonical),
    generateFAQSchema(faqs.map((f) => ({ question: f.q, answer: f.a }))),
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
        <section className="pt-28 pb-16 px-4 text-center bg-gradient-to-b from-emerald-50/60 to-white" data-guide="header">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold mb-6">
            <i className="ri-gift-line"></i>
            100% Gratuito para Todos
          </div>
          <h1
            className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Aprenda Libras <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">sem pagar nada</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto mb-8">
            Todos os recursos são gratuitos. Basta fazer o cadastro para começar sua jornada no aprendizado de Libras.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-semibold text-sm shadow-md hover:shadow-emerald-200 hover:shadow-lg transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-user-add-line"></i>
            Cadastrar Gratuitamente
          </button>
        </section>

        {/* Features grid */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="text-center mb-12">
            <h2
              className="text-2xl md:text-3xl font-bold text-slate-900 mb-3"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Tudo incluso, sem limites
            </h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">
              Depois do cadastro, você tem acesso imediato a todos esses recursos — sem planos, sem pagamentos, sem complicação.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-200 group"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-emerald-50 rounded-xl mb-4 group-hover:bg-emerald-100 transition-colors">
                  <i className={`${f.icon} text-emerald-600 text-xl`}></i>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {f.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-slate-50 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-3"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Como começar em 3 passos
            </h2>
            <p className="text-slate-500 text-center text-sm mb-12">Simples, rápido e totalmente gratuito</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  icon: 'ri-user-add-line',
                  title: 'Faça o cadastro',
                  desc: 'Preencha seus dados básicos. Não precisa de cartão de crédito nem comprovante de matrícula.',
                },
                {
                  step: '2',
                  icon: 'ri-mail-send-line',
                  title: 'Confirme seu e-mail',
                  desc: 'Receba um link de confirmação no seu e-mail para ativar sua conta na plataforma.',
                },
                {
                  step: '3',
                  icon: 'ri-hand-heart-line',
                  title: 'Comece a aprender',
                  desc: 'Explore o dicionário, alfabeto, cursos, exercícios e converse com a IA Assistente.',
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mx-auto mb-5 shadow-lg shadow-emerald-200">
                    <i className={`${item.icon} text-white text-2xl`}></i>
                  </div>
                  <div className="w-8 h-8 flex items-center justify-center bg-emerald-100 rounded-full mx-auto mb-3">
                    <span className="text-sm font-bold text-emerald-600">{item.step}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-2xl mx-auto py-16 px-4">
          <h2
            className="text-2xl font-bold text-slate-900 text-center mb-2"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Perguntas frequentes
          </h2>
          <p className="text-slate-500 text-center text-sm mb-10">Tudo que você precisa saber antes de começar</p>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-800 pr-4">{faq.q}</span>
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    <i
                      className={`${openFaq === i ? 'ri-subtract-line' : 'ri-add-line'} text-slate-400 text-lg transition-transform`}
                    ></i>
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-r from-emerald-500 to-teal-500 py-14 px-4 text-center">
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-3"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Pronto para aprender Libras?
          </h2>
          <p className="text-emerald-100 mb-8 max-w-md mx-auto">Cadastre-se gratuitamente agora mesmo e comece sua jornada de aprendizado.</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-3.5 bg-white text-emerald-600 rounded-xl font-semibold text-sm hover:bg-emerald-50 transition-all cursor-pointer whitespace-nowrap"
          >
            <span className="flex items-center gap-2">
              <i className="ri-user-add-line"></i>
              Cadastrar Gratuitamente
            </span>
          </button>
          <p className="text-emerald-200/60 text-xs mt-4">
            Criado por Fernando Mário da Silva Martins · Contato: librasvox@gmail.com
          </p>
        </section>

        <Footer />

        {showModal && <RegisterModal onClose={() => setShowModal(false)} />}
      </main>
      <InterpreterGuide />
    </>
  );
}