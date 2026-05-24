import { Link } from 'react-router-dom';
import Logo from '@/components/base/Logo';

const footerLinks = [
  { path: '/', label: 'Início' },
  { path: '/dictionary', label: 'Dicionário' },
  { path: '/alphabet', label: 'Alfabeto 3D' },
  { path: '/flashcards', label: 'Flashcards' },
  { path: '/exercicios', label: 'Exercícios' },
  { path: '/gramatica', label: 'Gramática' },
  { path: '/cursos', label: 'Cursos' },
  { path: '/assistant', label: 'IA Assistente' },
  { path: '/recognition', label: 'Reconhecimento' },
  { path: '/progress', label: 'Progresso' },
  { path: '/referencias', label: 'Referências' },
  { path: '/faq', label: 'FAQ' },
];

export default function Footer() {
  return (
    <footer className="bg-emerald-900 rounded-t-[40px] mt-20 px-4 md:px-8 pt-16 pb-8 overflow-hidden relative">
      {/* Decorative background text */}
      <div className="absolute bottom-0 left-0 right-0 text-[120px] font-black text-white opacity-[0.03] leading-none select-none pointer-events-none tracking-widest text-center overflow-hidden">
        LVP
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 flex items-center justify-center text-white">
                <i className="ri-hand-heart-line text-xl"></i>
              </div>
              <Logo size={36} className="brightness-[5]" />
            </div>
            <p className="text-emerald-200/70 text-sm leading-relaxed max-w-xs mb-6">
              Transforme sua comunicação com a plataforma educacional mais completa para aprender Libras. Desenvolvido com amor para promover a acessibilidade e inclusão no Brasil.
            </p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-800 text-emerald-200 hover:bg-emerald-700 hover:text-white transition-all duration-200 cursor-pointer">
                <i className="ri-mail-line text-lg"></i>
              </div>
              <span className="text-emerald-200/80 text-sm">librasvox@gmail.com</span>
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
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-800 text-emerald-300 hover:bg-emerald-700 hover:text-white transition-all duration-200 cursor-pointer"
                >
                  <i className={`${social.icon} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              <a href="#navigation" id="navigation">Navegação</a>
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-emerald-200/70 hover:text-white text-sm transition-colors duration-200 cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              <a href="#resources" id="resources">Recursos</a>
            </h4>
            <ul className="space-y-2.5">
              {[
                'Como usar a plataforma',
                'Dicas de aprendizado',
                'Cultura Surda',
                'Acessibilidade',
                'Sobre o projeto',
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    rel="nofollow"
                    className="text-emerald-200/70 hover:text-white text-sm transition-colors duration-200 cursor-pointer"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Creator info */}
        <div className="border-t border-emerald-800 pt-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-emerald-200/60">
              <i className="ri-user-3-line text-emerald-400"></i>
              <span>Criado por <strong className="text-emerald-200">Fernando Mário da Silva Martins</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-200/60">
              <i className="ri-mail-send-line text-emerald-400"></i>
              <span>Contato: <a href="mailto:librasvox@gmail.com" className="text-emerald-300 hover:text-white transition-colors">librasvox@gmail.com</a></span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-emerald-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-emerald-300/50 text-xs">
            © 2026 LVP. Todos os direitos reservados. Desenvolvido com amor para a comunidade surda.
          </p>
          <div className="flex items-center gap-1 text-xs text-emerald-300/50">
            <i className="ri-shield-check-line text-emerald-400"></i>
            <span>Plataforma 100% gratuita e acessível</span>
          </div>
        </div>
      </div>
    </footer>
  );
}