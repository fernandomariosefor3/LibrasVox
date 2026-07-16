import { Link } from 'react-router-dom';

type FooterLink = { path: string; label: string };

type FooterLinkGroupProps = {
  title: string;
  links: FooterLink[];
};

export default function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div>
      <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className="text-brand-200/70 hover:text-white text-sm transition-colors duration-200 cursor-pointer"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
