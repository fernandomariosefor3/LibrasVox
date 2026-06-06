import { useState, useRef } from 'react';

interface FeedbackFormProps {
  submitUrl: string;
}

export default function FeedbackForm({ submitUrl }: FeedbackFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor, selecione apenas arquivos de imagem (PNG, JPG, GIF).');
      setStatus('error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('A imagem deve ter no máximo 5MB.');
      setStatus('error');
      return;
    }

    setScreenshot(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setStatus('idle');
    setErrorMsg('');
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (screenshot) {
      formData.append('screenshot', screenshot);
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch(submitUrl, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setStatus('success');
        form.reset();
        setScreenshot(null);
        setScreenshotPreview(null);
      } else {
        setStatus('error');
        setErrorMsg('Erro ao enviar. Tente novamente mais tarde.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Erro de conexão. Verifique sua internet e tente novamente.');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
      {status === 'success' ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 flex items-center justify-center bg-emerald-50 rounded-full mx-auto mb-4">
            <i className="ri-check-line text-emerald-600 text-2xl"></i>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Obrigado pelo feedback!
          </h3>
          <p className="text-sm text-slate-500 mb-4 max-w-sm mx-auto">
            Sua mensagem foi enviada com sucesso. Fernando Mário da Silva Martins vai revisar pessoalmente e responder no e-mail informado, se necessário.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-refresh-line"></i>
            Enviar outro feedback
          </button>
        </div>
      ) : (
        <form id="feedback-report" data-readdy-form="feedback-report" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="feedback-name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Seu nome
              </label>
              <input
                id="feedback-name"
                name="name"
                type="text"
                required
                placeholder="Como quer ser chamado"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
              />
            </div>
            <div>
              <label htmlFor="feedback-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                E-mail
              </label>
              <input
                id="feedback-email"
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="feedback-type" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Tipo de mensagem
            </label>
            <select
              id="feedback-type"
              name="type"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all cursor-pointer"
            >
              <option value="">Selecione uma opção</option>
              <option value="duvida-nao-listada">Dúvida não listada no FAQ</option>
              <option value="reportar-erro">Reportar erro ou bug no site</option>
              <option value="sugestao-funcionalidade">Sugestão de nova funcionalidade</option>
              <option value="sugestao-sinal">Sugestão de sinal para o dicionário</option>
              <option value="outro">Outro assunto</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="feedback-message" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Descreva com detalhes
            </label>
            <textarea
              id="feedback-message"
              name="message"
              required
              maxLength={500}
              rows={4}
              placeholder="Conte com detalhes: qual é a dúvida, onde encontrou o erro, ou qual funcionalidade gostaria de ver..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all resize-none"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">Máximo 500 caracteres</p>
          </div>

          {/* Screenshot upload */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Anexar print da tela (opcional)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              name="screenshot"
              accept="image/png,image/jpeg,image/jpg,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />

            {screenshotPreview ? (
              <div className="relative inline-block">
                <img
                  src={screenshotPreview}
                  alt="Print selecionado"
                  className="w-full max-w-xs rounded-xl border border-slate-200 object-cover"
                />
                <button
                  type="button"
                  onClick={removeScreenshot}
                  className="absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors cursor-pointer"
                  aria-label="Remover imagem"
                >
                  <i className="ri-close-line text-sm"></i>
                </button>
                <p className="text-xs text-slate-400 mt-1">Uncollectable</p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-sm text-slate-500 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-600 transition-all cursor-pointer"
              >
                <i className="ri-image-add-line text-lg"></i>
                <span>Clique para anexar uma imagem</span>
              </button>
            )}
            <p className="text-xs text-slate-400 mt-1.5">
              Formatos aceitos: PNG, JPG, GIF · Máx. 5MB · Opcional
            </p>
          </div>

          {status === 'error' && (
            <div className="mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3.5 py-2.5 rounded-xl">
              <i className="ri-error-warning-line"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-emerald-200 hover:shadow-lg transition-all duration-200 cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  Enviando...
                </>
              ) : (
                <>
                  <i className="ri-send-plane-line"></i>
                  Enviar Feedback
                </>
              )}
            </button>
            <p className="text-xs text-slate-400">
              Resposta em até 48 horas · Contato: librasvox@gmail.com
            </p>
          </div>
        </form>
      )}
    </div>
  );
}