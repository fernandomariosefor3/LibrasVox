type SectionHeaderProps = {
  icon: string;
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  tone?: 'brand' | 'accent';
};

const toneClasses = {
  brand: {
    badge: 'bg-brand-50 border-brand-100 text-brand-600',
    highlight: 'bg-gradient-to-r from-brand-500 to-brand-600',
  },
  accent: {
    badge: 'bg-accent-50 border-accent-100 text-accent-600',
    highlight: 'bg-gradient-to-r from-accent-500 to-accent-600',
  },
};

export default function SectionHeader({ icon, eyebrow, title, highlight, subtitle, tone = 'brand' }: SectionHeaderProps) {
  const toneClass = toneClasses[tone];

  return (
    <div className="text-center mb-14 max-w-2xl mx-auto">
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 border rounded-full text-sm font-semibold mb-4 ${toneClass.badge}`}>
        <i className={icon} aria-hidden="true" />
        {eyebrow}
      </div>
      <h2 className="text-3xl md:text-5xl font-extrabold text-surface-900 mb-4 leading-tight">
        {title}
        {highlight && (
          <>
            {' '}
            <em className={`not-italic text-transparent bg-clip-text ${toneClass.highlight}`}>{highlight}</em>
          </>
        )}
      </h2>
      {subtitle && <p className="text-surface-500 text-lg leading-relaxed">{subtitle}</p>}
    </div>
  );
}
