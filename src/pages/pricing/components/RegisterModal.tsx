import { useState, useRef } from 'react';

interface RegisterModalProps {
  onClose: () => void;
}

export default function RegisterModal({ onClose }: RegisterModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const body = new URLSearchParams();
    data.forEach((value, key) => body.append(key, value.toString()));

    try {
      const res = await fetch('https://readdy.ai/api/form/d7ucb51jlv0i8kopubcg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError('Erro ao enviar. Tente novamente.');
      }
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 rounded-xl">
              <i className="ri-user-add-line text-emerald-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Criar Conta
              </h2>
              <p className="text-xs text-slate-500">Cadastro 100% gratuito para todos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 flex items-center justify-center bg-emerald-100 rounded-full mx-auto mb-4">
              <i className="ri-check-line text-emerald-600 text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Cadastro enviado!
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Seu cadastro foi recebido com sucesso. Em breve você receberá um e-mail de confirmação e poderá acessar todos os recursos da plataforma gratuitamente.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-sm cursor-pointer whitespace-nowrap"
            >
              Fechar
            </button>
          </div>
        ) : (
          <form
            ref={formRef}
            id="cadastro-gratuito-libras"
            data-readdy-form
            onSubmit={handleSubmit}
            className="p-6 space-y-4"
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Nome completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nome"
                required
                placeholder="Seu nome completo"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Idade <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="idade"
                required
                min={5}
                max={120}
                placeholder="Sua idade"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Institution (optional) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Instituição / Ocupação <span className="text-slate-400">(opcional)</span>
              </label>
              <input
                type="text"
                name="instituicao"
                placeholder="Ex: estudante, professor, intérprete..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Motivation */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Por que deseja aprender Libras?
              </label>
              <textarea
                name="motivacao"
                rows={3}
                maxLength={500}
                placeholder="Conte um pouco sobre sua motivação..."
                onChange={(e) => setCharCount(e.target.value.length)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all resize-none"
              />
              <p className={`text-xs mt-1 text-right ${charCount > 480 ? 'text-red-500' : 'text-slate-400'}`}>
                {charCount}/500
              </p>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="termos"
                id="termos"
                required
                className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-emerald-500 cursor-pointer"
              />
              <label htmlFor="termos" className="text-xs text-slate-500 cursor-pointer leading-relaxed">
                Declaro que as informações fornecidas são verdadeiras e concordo com os{' '}
                <span className="text-emerald-600 underline">Termos de Uso</span> e{' '}
                <span className="text-emerald-600 underline">Política de Privacidade</span>.
              </label>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-sm text-red-600">
                <i className="ri-error-warning-line"></i>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-emerald-200 hover:shadow-lg transition-all duration-200 cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="ri-loader-4-line animate-spin"></i>
                  Enviando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <i className="ri-shield-check-line"></i>
                  Criar Conta Gratuita
                </span>
              )}
            </button>

            <p className="text-xs text-center text-slate-400">
              Criado por Fernando Mário da Silva Martins · librasvox@gmail.com
            </p>
          </form>
        )}
      </div>
    </div>
  );
}