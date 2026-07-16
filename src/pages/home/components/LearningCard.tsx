import { Link } from 'react-router-dom';

type LearningCardProps = {
  to: string;
  icon: string;
  title: string;
  description: string;
  bullets?: string[];
  tone?: 'brand' | 'accent';
};

const toneClasses = {
  brand: {
    iconBg: 'bg-brand-50',
    iconText: 'text-brand-600',
    bulletIcon: 'text-brand-500',
    arrowHover: 'group-hover:bg-brand-50 group-hover:text-brand-600',
  },
  accent: {
    iconBg: 'bg-accent-50',
    iconText: 'text-accent-600',
    bulletIcon: 'text-accent-500',
    arrowHover: 'group-hover:bg-accent-50 group-hover:text-accent-600',
  },
};

export default function LearningCard({ to, icon, title, description, bullets, tone = 'brand' }: LearningCardProps) {
  const toneClass = toneClasses[tone];

  return (
    <Link to={to} className="group card-hover relative block p-8">
      <div className={`w-14 h-14 flex items-center justify-center rounded-2xl mb-6 ${toneClass.iconBg}`}>
        <i className={`${icon} text-2xl ${toneClass.iconText}`} aria-hidden="true" />
      </div>

      <h3 className="text-xl font-bold text-surface-900 mb-3">{title}</h3>
      <p className="text-surface-500 text-sm leading-relaxed mb-5">{description}</p>

      {bullets && bullets.length > 0 && (
        <ul className="space-y-2">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-center gap-2 text-sm text-surface-600">
              <i className={`ri-checkbox-circle-fill ${toneClass.bulletIcon}`} aria-hidden="true" />
              {bullet}
            </li>
          ))}
        </ul>
      )}

      <div
        className={`absolute top-8 right-8 w-8 h-8 flex items-center justify-center rounded-xl bg-surface-50 text-surface-400 transition-all duration-200 ${toneClass.arrowHover}`}
        aria-hidden="true"
      >
        <i className="ri-arrow-right-up-line text-base" />
      </div>
    </Link>
  );
}
