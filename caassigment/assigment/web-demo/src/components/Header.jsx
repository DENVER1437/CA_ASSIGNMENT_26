export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant/15 px-6 py-4 flex flex-col md:flex-row justify-between items-center shadow-sm">
      <div className="flex items-center space-x-2">
        <h1 className="font-display font-bold text-2xl text-primary tracking-tight">CacheCtrl <span className="text-secondary">⚡</span></h1>
      </div>
      <div className="mt-2 md:mt-0 text-sm font-body text-on-surface-variant font-medium text-center md:text-right">
        Meet Kotecha 24BCE380 | Dhruvraj Rathod 24BCE374 &middot; 2CS504 &middot; Nirma University
      </div>
    </header>
  );
}
