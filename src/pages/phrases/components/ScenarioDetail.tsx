import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Scenario } from '@/mocks/phrases';
import type { Sign } from '@/mocks/signs';

interface EnrichedSign {
  signId: string;
  note?: string;
  sign: Sign | null;
}

interface Props {
  scenario: Omit<Scenario, 'signs'> & { signs: EnrichedSign[] };
  onClose: () => void;
}

export default function ScenarioDetail({ scenario, onClose }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [showGlossa, setShowGlossa] = useState(true);

  const current = scenario.signs[activeStep];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className={`sticky top-0 z-10 ${scenario.bgColor} border-b ${scenario.borderColor} rounded-t-2xl px-6 py-5`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 flex items-center justify-center rounded-xl bg-white border ${scenario.borderColor}`}>
                <i className={`${scenario.icon} text-xl ${scenario.color}`}></i>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {scenario.title}
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">{scenario.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors cursor-pointer flex-shrink-0"
              aria-label="Fechar"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Step Progress */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
            {scenario.signs.map((ps, idx) => (
              <button
                key={ps.signId}
                onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  idx === activeStep
                    ? `${scenario.bgColor} ${scenario.color} border ${scenario.borderColor}`
                    : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${
                  idx === activeStep ? 'bg-white border border-current' : 'bg-slate-200 text-slate-500'
                }`}>
                  {idx + 1}
                </span>
                {ps.sign?.word || ps.signId}
              </button>
            ))}
          </div>

          {/* Active Sign Detail */}
          {current && current.sign && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Image */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                {current.sign.videoThumbnail ? (
                  <img
                    src={current.sign.videoThumbnail}
                    alt={current.sign.word}
                    className="w-full aspect-square object-cover object-top"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center">
                    <i className="ri-image-line text-4xl text-slate-300"></i>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{current.sign.emoji}</span>
                  <h3 className="text-xl font-bold text-slate-900">
                    {current.sign.word}
                  </h3>
                </div>
                <p className="text-sm text-slate-500 mb-4">{current.sign.category}</p>
                <p className="text-sm text-slate-700 leading-relaxed mb-4">{current.sign.description}</p>

                {current.note && (
                  <div className={`inline-flex items-start gap-2 px-3 py-2 rounded-lg ${scenario.bgColor} border ${scenario.borderColor} mb-4`}>
                    <i className={`${scenario.icon} text-sm ${scenario.color} mt-0.5`}></i>
                    <span className="text-sm text-slate-700">{current.note}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Como sinalizar</p>
                  {current.sign.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-slate-700 leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to={`/dictionary?q=${encodeURIComponent(current.sign.word)}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer w-fit"
                >
                  <i className="ri-book-open-line"></i>
                  Ver no Dicionário
                </Link>
              </div>
            </div>
          )}

          {/* Full Sentence */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                Frase Completa
              </h4>
              <button
                onClick={() => setShowGlossa(!showGlossa)}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                {showGlossa ? 'Mostrar em Português' : 'Mostrar Glossa'}
              </button>
            </div>

            {showGlossa ? (
              <p className="text-lg md:text-xl font-semibold text-slate-900 leading-relaxed">
                {scenario.glossa}
              </p>
            ) : (
              <p className="text-lg md:text-xl font-semibold text-slate-700 leading-relaxed italic">
                {scenario.portuguese}
              </p>
            )}
          </div>

          {/* Grammar Notes */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Notas Gramaticais
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scenario.grammarNotes.map((note, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full ${scenario.bgColor} border ${scenario.borderColor} flex-shrink-0 mt-0.5`}>
                    <i className={`${scenario.icon} text-[10px] ${scenario.color}`}></i>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100">
            <button
              onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
              disabled={activeStep === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <i className="ri-arrow-left-line"></i>
              Anterior
            </button>

            <span className="text-sm text-slate-400 font-medium">
              {activeStep + 1} / {scenario.signs.length}
            </span>

            <button
              onClick={() => setActiveStep((s) => Math.min(scenario.signs.length - 1, s + 1))}
              disabled={activeStep === scenario.signs.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-md hover:shadow-emerald-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Próximo
              <i className="ri-arrow-right-line"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}