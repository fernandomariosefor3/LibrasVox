import Logo from '@/components/base/Logo';
import FooterLinkGroup from './FooterLinkGroup';

const learnLinks = [
  { path: '/dictionary', label: 'Dicionário' },
  { path: '/cursos', label: 'Cursos' },
  { path: '/alphabet', label: 'Alfabeto' },
  { path: '/gramatica', label: 'Gramática' },
  { path: '/frases', label: 'Frases' },
  { path: '/videoaulas', label: 'Videoaulas' },
];

const practiceLinks = [
  { path: '/exercicios', label: 'Exercícios' },
  { path: '/flashcards', label: 'Flashcards' },
  { path: '/recognition', label: 'LibrasVox Vision' },
  { path: '/progress', label: 'Progresso' },
];

const institutionalLinks = [
  { path: '/', label: 'Início' },
  { path: '/atlas', label: 'Atlas da Libras' },
  { path: '/referencias', label: 'Referências' },
  { path: '/faq', label: 'FAQ' },
];

export default function Footer() {
  return (
    <footer className="bg-brand-900 rounded-t-[40px] mt-20 px-4 md:px-8 pt-16 pb-8 overflow-hidden relative">
      {/* Decorative background text */}
      <div className="absolute bottom-0 left-0 right-0 text-[120px] font-black text-white opacity-[0.03] leading-none select-none pointer-events-none tracking-widest text-center overflow-hidden">
        LVP
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 flex items-center justify-center text-white">
                <i className="ri-hand-heart-line text-xl"></i>
              </div>
              <Logo size={36} className="brightness-[5]" />
            </div>
            <p className="text-brand-200/70 text-sm leading-relaxed max-w-xs mb-6">
              Transforme sua comunicação com a plataforma educacional mais completa para aprender Libras. Desenvolvido com amor para promover a acessibilidade e inclusão no Brasil.
            </p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-800 text-brand-200 hover:bg-brand-700 hover:text-white transition-all duration-200 cursor-pointer">
                <i className="ri-mail-line text-lg"></i>
              </div>
              <span className="text-brand-200/80 text-sm">librasvox@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              {[
                { icon: 'ri-instagram-line', label: 'Instagram' },
                { icon: 'ri-youtube-line', label: 'YouTube' },
                { icon: 'ri-twitter-x-line', label: 'Twitter/X' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  rel="nofollow"
                  aria-label={social.label}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-800 text-brand-300 hover:bg-brand-700 hover:text-white transition-all duration-200 cursor-pointer"
                >
                  <i className={`${social.icon} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          <FooterLinkGroup title="Aprender" links={learnLinks} />
          <FooterLinkGroup title="Praticar" links={practiceLinks} />
          <FooterLinkGroup title="Institucional" links={institutionalLinks} />
        </div>

        {/* Creator info */}
        <div className="border-t border-brand-800 pt-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-brand-200/60">
              <i className="ri-user-3-line text-brand-400"></i>
              <span>Criado por <strong className="text-brand-200">Fernando Mário da Silva Martins</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-brand-200/60">
              <i className="ri-mail-send-line text-brand-400"></i>
              <span>Contato: <a href="mailto:librasvox@gmail.com" className="text-brand-300 hover:text-white transition-colors">librasvox@gmail.com</a></span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brand-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-brand-300/50 text-xs">
            © 2026 LVP. Todos os direitos reservados. Desenvolvido com amor para a comunidade surda.
          </p>
          <div className="flex items-center gap-1 text-xs text-brand-300/50">
            <i className="ri-shield-check-line text-brand-400"></i>
            <span>Plataforma 100% gratuita e acessível</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
