export function SkipLinks() {
  return (
    <div className="skip-links" aria-label="Links de acessibilidade">
      <a href="#main-content" className="skip-link">
        Ir para o conteúdo principal
      </a>
      <a href="#main-nav" className="skip-link">
        Ir para a navegação
      </a>
    </div>
  );
}
