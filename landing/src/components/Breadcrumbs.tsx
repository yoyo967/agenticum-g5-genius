import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface Crumb {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

export function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const all = [{ label: 'Home', path: '/' }, ...crumbs];

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest">
      {all.map((crumb, i) => {
        const isLast = i === all.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i === 0 && <Home size={9} className="text-zinc-700" />}
            {crumb.path && !isLast ? (
              <button
                onClick={() => navigate(crumb.path!)}
                className="text-zinc-600 hover:text-blue-400 transition-colors"
                aria-current={location.pathname === crumb.path ? 'page' : undefined}
              >
                {crumb.label}
              </button>
            ) : (
              <span className={isLast ? 'text-zinc-400' : 'text-zinc-600'} aria-current={isLast ? 'page' : undefined}>
                {crumb.label}
              </span>
            )}
            {!isLast && <ChevronRight size={9} className="text-zinc-800" />}
          </span>
        );
      })}
    </nav>
  );
}
