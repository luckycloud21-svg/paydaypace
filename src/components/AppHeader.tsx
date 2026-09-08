import type { ReactNode } from 'react';
import { ArrowLeft, MoreHorizontal } from './Icons';
import type { Screen } from '../types';

type AppHeaderProps = {
  title?: string;
  onBack?: () => void;
  onMenu?: () => void;
  right?: ReactNode;
  screen: Screen;
};

export default function AppHeader({ title = '월급까지', onBack, onMenu, right, screen }: AppHeaderProps) {
  return (
    <header className={`app-header ${screen === 'home' ? 'home-header' : ''}`}>
      <div className="header-side">
        {onBack ? (
          <button className="icon-button" onClick={onBack} aria-label="뒤로가기"><ArrowLeft size={22} /></button>
        ) : <span className="header-brand-mark" aria-hidden="true"><SparkMark /></span>}
      </div>
      <span className="header-title">{title}</span>
      <div className="header-side header-side-right">
        {right}
        {onMenu && <button className="icon-button" onClick={onMenu} aria-label="설정 열기"><MoreHorizontal size={23} /></button>}
      </div>
    </header>
  );
}

function SparkMark() {
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><path d="M12.2 2.5 5.8 13h5.1l-.8 8.5L18.2 11h-5.1l-.9-8.5Z" fill="currentColor" /></svg>;
}
