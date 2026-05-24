import { useState, useEffect } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { SEOHead } from '@/components/feature/SEOHead';
import { pageSEO, SITE_URL, generateWebPageSchema, generateLearningResourceSchema } from '@/lib/seo';
import InterpreterGuide from '@/components/feature/InterpreterGuide';

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  level: 'basico' | 'intermediario' | 'avancado';
  topic: string;
};

const questions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Em que ano foi fundado o Imperial Instituto de Surdos-Mudos, origem do INES?',
    options: ['1822', '1857', '1889', '1902'],
    correct: 1,
    explanation: 'O Imperial Instituto de Surdos-Mudos foi fundado em 1857 pelo professor francês Ernest Huet, a convite do imperador Dom Pedro II.',
    level: 'basico',
    topic: 'História da Libras',
  },
  {
    id: 'q2',
    question: 'Qual lei reconheceu oficialmente a Libras como meio legal de comunicação no Brasil?',
    options: ['Lei 9.394/1996', 'Lei 10.098/2000', 'Lei 10.436/2002', 'Lei 13.146/2015'],
    correct: 2,
    explanation: 'A Lei nº 10.436, de 24 de abril de 2002, reconheceu a Libras como meio legal de comunicação e expressão da comunidade surda brasileira.',
    level: 'basico',
    topic: 'Legislação',
  },
  {
    id: 'q3',
    question: 'Qual é a ordem sintática predominante na Libras?',
    options: ['SVO (Sujeito-Verbo-Objeto)', 'OSV (Objeto-Sujeito-Verbo)', 'VSO (Verbo-Sujeito-Objeto)', 'SOV (Sujeito-Objeto-Verbo)'],
    correct: 1,
    explanation: 'A Libras utiliza predominantemente a ordem OSV (Objeto-Sujeito-Verbo), diferente do português que usa SVO. Porém, a ordem pode variar conforme o contexto discursivo.',
    level: 'intermediario',
    topic: 'Gramática',
  },
  {
    id: 'q4',
    question: 'O que são "classificadores" na Libras?',
    options: [
      'Sinais usados apenas para classificar pessoas surdas',
      'Configurações de mão que representam categorias de objetos, pessoas e movimentos',
      'Expressões faciais que indicam categorias gramaticais',
      'Sinais numéricos usados para classificar informações',
    ],
    correct: 1,
    explanation: 'Classificadores são configurações de mão que representam categorias de referentes (pessoas, veículos, objetos) e descrevem sua localização, movimento e forma no espaço.',
    level: 'intermediario',
    topic: 'Classificadores',
  },
  {
    id: 'q5',
    question: 'Qual é a função das expressões faciais na Libras?',
    options: [
      'São apenas expressões emocionais, sem função gramatical',
      'São componentes gramaticais obrigatórios que marcam negação, interrogação e outros elementos',
      'São usadas apenas por surdos oralizados',
      'Substituem os sinais manuais em contextos formais',
    ],
    correct: 1,
    explanation: 'As expressões faciais na Libras são componentes não-manuais com função gramatical obrigatória. Elas marcam interrogação (sim/não e QU-), negação, topicalização e outros elementos sintáticos.',
    level: 'intermediario',
    topic: 'Expressões Faciais',
  },
  {
    id: 'q6',
    question: 'O que é "datilologia" na Libras?',
    options: [
      'O estudo científico da Libras',
      'A soletração de palavras usando o alfabeto manual',
      'Um tipo de classificador para letras',
      'A transcrição escrita da Libras',
    ],
    correct: 1,
    explanation: 'Datilologia é a soletração de palavras letra por letra usando o alfabeto manual (configurações de mão para cada letra). É usada principalmente para nomes próprios e termos sem sinal específico.',
    level: 'basico',
    topic: 'Datilologia',
  },
  {
    id: 'q7',
    question: 'O que é "roleshift" (troca de perspectiva) no discurso em Libras?',
    options: [
      'A mudança de nível de formalidade no discurso',
      'A técnica de incorporar personagens no discurso, assumindo sua perspectiva corporal',
      'A alternância entre Libras e português sinalizado',
      'O uso de classificadores para indicar papéis sociais',
    ],
    correct: 1,
    explanation: 'Roleshift é um recurso discursivo em que o sinalizante assume a perspectiva corporal de um personagem, inclinando o corpo e alterando o olhar para indicar que está "sendo" aquele personagem no discurso.',
    level: 'avancado',
    topic: 'Discurso',
  },
  {
    id: 'q8',
    question: 'Qual decreto regulamentou a Lei de Libras e tornou obrigatório o ensino de Libras em cursos de licenciatura?',
    options: ['Decreto 3.298/1999', 'Decreto 5.296/2004', 'Decreto 5.626/2005', 'Decreto 7.611/2011'],
    correct: 2,
    explanation: 'O Decreto nº 5.626/2005 regulamentou a Lei 10.436/2002 e determinou a inclusão da Libras como disciplina curricular obrigatória nos cursos de formação de professores e fonoaudiologia, além de criar os cursos de Letras-Libras.',
    level: 'basico',
    topic: 'Legislação',
  },
];

type FilterLevel = 'todos' | 'basico' | 'intermediario' | 'avancado';

const levelColors = {
  basico: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700' },
  intermediario: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700' },
  avancado: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-700' },
};

const levelLabel = { basico: 'Básico', intermediario: 'Intermediário', avancado: 'Avançado' };

export default function ExercisesPage() {
  const [filter, setFilter] = useState<FilterLevel>('todos');
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const filtered = filter === 'todos' ? questions : questions.filter((q) => q.level === filter);

  const handleAnswer = (qId: string, optIdx: number) => {
    if (revealed[qId]) return;
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleReveal = (qId: string) => {
    setRevealed((prev) => ({ ...prev, [qId]: true }));
  };

  const handleSubmitAll = () => {
    const answeredFiltered = filtered.filter((q) => answers[q.id] !== undefined);
    const correct = answeredFiltered.filter((q) => answers[q.id] === q.correct).length;
    setScore({ correct, total: answeredFiltered.length });
    const newRevealed: Record<string, boolean> = {};
    filtered.forEach((q) => { newRevealed[q.id] = true; });
    setRevealed((prev) => ({ ...prev, ...newRevealed }));
    // Salvar contagem no progresso
    const prevCount = parseInt(localStorage.getItem('librasvox_exercises_count') || '0', 10);
    localStorage.setItem('librasvox_exercises_count', String(prevCount + 1));
  };

  const handleReset = () => {
    setAnswers({});
    setRevealed({});
    setScore(null);
  };

  const answeredCount = filtered.filter((q) => answers[q.id] !== undefined).length;

  const seo = pageSEO.exercises;
  const canonical = `${SITE_URL}/exercicios`;

  const schema = [
    generateWebPageSchema(seo.title, seo.description, canonical),
    generateLearningResourceSchema('Exercícios de Libras', 'Quiz interativo acadêmico de Libras com feedback imediato.', canonical),
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
          <div className="max-w-4xl mx-auto">
            <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-sm font-semibold mb-5">
                <i className="ri-pencil-ruler-2-line"></i>
                Exercícios e Avaliação
              </div>
              <h1
                className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                Pratique seu{' '}
                <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                  conhecimento
                </em>
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed">
                Questões de múltipla escolha com feedback imediato e explicações detalhadas. Baseadas no currículo acadêmico de Libras.
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 px-4 md:px-8 pb-20">
          <div className="max-w-4xl mx-auto">

            {/* Score banner */}
            {score && (
              <div className={`mb-6 p-5 rounded-2xl border-2 flex items-center gap-4 ${
                score.correct === score.total ? 'bg-emerald-50 border-emerald-300' :
                score.correct >= score.total / 2 ? 'bg-amber-50 border-amber-300' :
                'bg-rose-50 border-rose-300'
              }`}>
                <div className={`w-14 h-14 flex items-center justify-center rounded-2xl text-white text-2xl font-bold flex-shrink-0 ${
                  score.correct === score.total ? 'bg-emerald-500' :
                  score.correct >= score.total / 2 ? 'bg-amber-500' : 'bg-rose-500'
                }`}>
                  {score.correct}/{score.total}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-base">
                    {score.correct === score.total ? 'Excelente! Acertou tudo!' :
                     score.correct >= score.total / 2 ? 'Bom resultado! Continue praticando.' :
                     'Continue estudando! Você vai melhorar.'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {score.correct} de {score.total} questões corretas ({Math.round((score.correct / score.total) * 100)}%)
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="ml-auto px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold hover:border-slate-300 transition-all cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-refresh-line mr-1"></i>
                  Refazer
                </button>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6" data-guide="filter">
              {(['todos', 'basico', 'intermediario', 'avancado'] as FilterLevel[]).map((f) => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); handleReset(); }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    filter === f
                      ? f === 'todos' ? 'bg-slate-800 text-white border-slate-800'
                        : `${levelColors[f as keyof typeof levelColors].bg} ${levelColors[f as keyof typeof levelColors].text} ${levelColors[f as keyof typeof levelColors].border}`
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {f === 'todos' ? 'Todos os níveis' : levelLabel[f as keyof typeof levelLabel]}
                  <span className="ml-1.5 text-xs opacity-70">
                    ({f === 'todos' ? questions.length : questions.filter((q) => q.level === f).length})
                  </span>
                </button>
              ))}
            </div>

            {/* Questions */}
            <div className="space-y-6" data-guide="questions">
              {filtered.map((q, idx) => {
                const selected = answers[q.id];
                const isRevealed = revealed[q.id];
                const isCorrect = selected === q.correct;
                const lc = levelColors[q.level];

                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl border-2 overflow-hidden transition-all duration-500 ${
                      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    } ${isRevealed && isCorrect ? 'border-emerald-300' : isRevealed && !isCorrect ? 'border-rose-300' : 'border-slate-200'}`}
                    style={{ transitionDelay: `${idx * 60}ms` }}
                  >
                    {/* Question header */}
                    <div className="px-6 py-4 bg-white">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${lc.badge}`}>
                              {levelLabel[q.level]}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">{q.topic}</span>
                          </div>
                          <p className="text-base font-semibold text-slate-900 leading-snug">{q.question}</p>
                        </div>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="px-6 pb-4 bg-white space-y-2">
                      {q.options.map((opt, oi) => {
                        let optStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300';
                        if (selected === oi && !isRevealed) optStyle = `${lc.bg} ${lc.border} ${lc.text}`;
                        if (isRevealed && oi === q.correct) optStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800';
                        if (isRevealed && selected === oi && oi !== q.correct) optStyle = 'bg-rose-50 border-rose-400 text-rose-800';

                        return (
                          <button
                            key={oi}
                            onClick={() => handleAnswer(q.id, oi)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium text-left transition-all duration-200 cursor-pointer ${optStyle}`}
                          >
                            <div className={`w-6 h-6 flex items-center justify-center rounded-full border-2 flex-shrink-0 text-xs font-bold ${
                              isRevealed && oi === q.correct ? 'border-emerald-500 bg-emerald-500 text-white' :
                              isRevealed && selected === oi && oi !== q.correct ? 'border-rose-500 bg-rose-500 text-white' :
                              selected === oi ? `${lc.border} ${lc.text}` : 'border-slate-300 text-slate-400'
                            }`}>
                              {isRevealed && oi === q.correct ? <i className="ri-check-line text-xs"></i> :
                               isRevealed && selected === oi && oi !== q.correct ? <i className="ri-close-line text-xs"></i> :
                               String.fromCharCode(65 + oi)}
                            </div>
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Reveal / Explanation */}
                    {selected !== undefined && !isRevealed && (
                      <div className="px-6 pb-4 bg-white">
                        <button
                          onClick={() => handleReveal(q.id)}
                          className="w-full py-2.5 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-all cursor-pointer"
                        >
                          Ver resposta e explicação
                        </button>
                      </div>
                    )}

                    {isRevealed && (
                      <div className={`px-6 py-4 border-t ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 ${isCorrect ? 'bg-emerald-500' : 'bg-rose-500'} text-white`}>
                            <i className={`${isCorrect ? 'ri-check-line' : 'ri-close-line'} text-sm`}></i>
                          </div>
                          <div>
                            <p className={`text-sm font-bold mb-1 ${isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                              {isCorrect ? 'Correto!' : 'Incorreto'}
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed">{q.explanation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit all */}
            {!score && answeredCount > 0 && (
              <div className="mt-8 flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-sm text-slate-600">
                  <strong>{answeredCount}</strong> de <strong>{filtered.length}</strong> questões respondidas
                </p>
                <button
                  onClick={handleSubmitAll}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-send-plane-line mr-2"></i>
                  Finalizar e ver resultado
                </button>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
      <InterpreterGuide />
    </>
  );
}
