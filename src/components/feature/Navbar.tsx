import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '@/components/base/Logo';
import { AccessibilityPanel } from './AccessibilityPanel';

const primaryLinks = [
  { path: '/', label: 'Início', icon: 'ri-home-4-line' },
  { path: '/dictionary', label: 'Glossário', icon: 'ri-translate-2' },
  { path: '/assistant', label: 'IA Assistente', icon: 'ri-sparkling-line' },
  { path: '/progress', label: 'Progresso', icon: 'ri-bar-chart-line' },
];

const learnLinks = [
  { path: '/cursos', label: 'Cursos', icon: 'ri-graduation-cap-line', desc: 'Módulos por nível' },
  { path: '/videoaulas', label: 'Videoaulas', icon: 'ri-video-line', desc: 'Aulas em vídeo' },
  { path: '/gramatica', label: 'Gramática', icon: 'ri-book-open-line', desc: 'Estrutura da Libras' },
  { path: '/exercicios', label: 'Exercícios', icon: 'ri-pencil-ruler-2-line', desc: 'Prática com quiz' },
  { path: '/frases', label: 'Frases', icon: 'ri-chat-quote-line', desc: 'Contextos do dia a dia' },
  { path: '/flashcards', label: 'Flashcards', icon: 'ri-stack-line', desc: 'Repetição espaçada' },
  { path: '/alphabet', label: 'Datilologia', icon: 'ri-keyboard-line', desc: 'Alfabeto manual A-Z' },
];

const moreLinks = [
  { path: '/referencias', label: 'Referências', icon: 'ri-file-text-line', desc: 'Bibliografia acadêmica' },
  { path: '/faq', label: 'FAQ', icon: 'ri-question-answer-line', desc: 'Dúvidas frequentes' },
];

type DropdownLink = { path: string; label: string; icon: string; desc: string };

function DropdownMenu({
  label,
  icon,
  links,
  scrolled,
  isHome,
  activePath,
  menuId,
}: {
  label: string;
  icon: string;
  links: DropdownLink[];
  scrolled: boolean;
  isHome: boolean;
  activePath: string;
  menuId: string;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const isLight = scrolled || !isHome;
  const hasActive = links.some((l) => l.path === activePath);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={menuId}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
          hasActive
            ? isLight
              ? 'bg-brand-50 text-brand-600'
              : 'bg-white/15 text-white'
            : isLight
            ? 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
            : 'text-white/80 hover:text-white hover:bg-white/10'
        }`}
      >
        <i className={`${icon} text-base`} aria-hidden="true" />
        {label}
        <i
          className={`ri-arrow-down-s-line text-sm transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute top-full left-0 mt-2 w-56 bg-surface-0 rounded-2xl border border-surface-100 shadow-xl shadow-surface-900/10 overflow-hidden z-50 animate-scale-in"
        >
          {links.map((link) => {
            const active = link.path === activePath;
            return (
              <Link
                key={link.path}
                to={link.path}
                role="menuitem"
                aria-current={active ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-start gap-3 px-4 py-3 transition-colors duration-150 ${
                  active ? 'bg-brand-50' : 'hover:bg-surface-50'
                }`}
              >
                <div
                  className={`mt-0.5 w-7 h-7 flex items-center justify-center rounded-lg shrink-0 ${
                    active ? 'bg-brand-100' : 'bg-surface-100'
                  }`}
                  aria-hidden="true"
                >
                  <i className={`${link.icon} text-sm ${active ? 'text-brand-600' : 'text-surface-500'}`} />
                </div>
                <div>
                  <div className={`text-sm font-semibold ${active ? 'text-brand-600' : 'text-surface-800'}`}>
                    {link.label}
                  </div>
                  <div className="text-xs text-surface-400 leading-tight">{link.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isLight = scrolled || !isHome;

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        id="main-nav"
        aria-label="Navegação principal"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isLight
            ? 'bg-surface-0/95 backdrop-blur-xl shadow-sm border-b border-surface-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-1.5 shrink-0"
            aria-label="LibrasVox — Página inicial"
          >
            <i
              className={`ri-hand-heart-line text-xl transition-colors duration-200 ${
                isLight ? 'text-brand-600' : 'text-white'
              }`}
              aria-hidden="true"
            />
            <Logo size={26} />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5" role="list">
            {primaryLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  role="listitem"
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    active
                      ? isLight
                        ? 'bg-brand-50 text-brand-600'
                        : 'bg-white/15 text-white'
                      : isLight
                      ? 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <i className={`${link.icon} text-base`} aria-hidden="true" />
                  {link.label}
                </Link>
              );
            })}

            <DropdownMenu
              label="Aprender"
              icon="ri-graduation-cap-line"
              links={learnLinks}
              scrolled={scrolled}
              isHome={isHome}
              activePath={location.pathname}
              menuId="nav-aprender-menu"
            />

            <DropdownMenu
              label="Mais"
              icon="ri-more-line"
              links={moreLinks}
              scrolled={scrolled}
              isHome={isHome}
              activePath={location.pathname}
              menuId="nav-mais-menu"
            />
          </div>

          {/* CTA + accessibility + mobile toggle */}
          <div className="flex items-center gap-2">
            <div className={isLight ? '' : '[&_button]:text-white [&_button:hover]:bg-white/10'}>
              <AccessibilityPanel />
            </div>

            <Link
              to="/dictionary"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 hover:-translate-y-px transition-all duration-200 whitespace-nowrap"
            >
              <i className="ri-hand-heart-line" aria-hidden="true" />
              Começar Agora
            </Link>

            <button
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isLight ? 'text-surface-700 hover:bg-surface-100' : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
            >
              <i
                className={`${mobileOpen ? 'ri-close-line' : 'ri-menu-line'} text-2xl`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />

        {/* Panel */}
        <div
          id="mobile-nav-panel"
          role="dialog"
          aria-label="Menu de navegação mobile"
          aria-modal="true"
          className={`absolute top-0 right-0 bottom-0 w-72 bg-surface-0 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-1.5"
              aria-label="LibrasVox — Página inicial"
            >
              <i className="ri-hand-heart-line text-xl text-brand-600" aria-hidden="true" />
              <Logo size={24} />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"
              aria-label="Fechar menu"
            >
              <i className="ri-close-line text-xl" aria-hidden="true" />
            </button>
          </div>

          {/* Scrollable link area */}
          <nav aria-label="Menu mobile" className="flex-1 overflow-y-auto py-3 px-3">
            <p className="section-label px-2 mb-2" aria-hidden="true">Principal</p>
            {primaryLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 mb-0.5 ${
                    active
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                  }`}
                >
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-lg shrink-0 ${
                      active ? 'bg-brand-100' : 'bg-surface-100'
                    }`}
                    aria-hidden="true"
                  >
                    <i className={`${link.icon} text-sm ${active ? 'text-brand-600' : 'text-surface-500'}`} />
                  </div>
                  {link.label}
                </Link>
              );
            })}

            <p className="section-label px-2 mt-4 mb-2" aria-hidden="true">Aprender</p>
            {learnLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 mb-0.5 ${
                    active
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                  }`}
                >
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-lg shrink-0 ${
                      active ? 'bg-brand-100' : 'bg-surface-100'
                    }`}
                    aria-hidden="true"
                  >
                    <i className={`${link.icon} text-sm ${active ? 'text-brand-600' : 'text-surface-500'}`} />
                  </div>
                  {link.label}
                </Link>
              );
            })}

            <p className="section-label px-2 mt-4 mb-2" aria-hidden="true">Mais</p>
            {moreLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 mb-0.5 ${
                    active
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                  }`}
                >
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-lg shrink-0 ${
                      active ? 'bg-brand-100' : 'bg-surface-100'
                    }`}
                    aria-hidden="true"
                  >
                    <i className={`${link.icon} text-sm ${active ? 'text-brand-600' : 'text-surface-500'}`} />
                  </div>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA at bottom */}
          <div className="px-4 py-4 border-t border-surface-100 space-y-2">
            <div className="flex justify-center">
              <AccessibilityPanel />
            </div>
            <Link
              to="/dictionary"
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-brand-500/20"
            >
              <i className="ri-hand-heart-line" aria-hidden="true" />
              Começar Agora
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
