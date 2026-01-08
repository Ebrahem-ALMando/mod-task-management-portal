import Header from '@/components/layout/Header';
import LinksGrid from '@/components/cards/LinksGrid';

export default function Home() {
  return (
    <div className="min-h-dvh flex flex-col relative">
      {/* Background pattern layer */}
      <div 
        className="fixed inset-0 bg-pattern pointer-events-none" 
        aria-hidden="true"
      />
      
      {/* Background overlay for readability */}
      <div 
        className="fixed inset-0 bg-pattern-overlay pointer-events-none" 
        aria-hidden="true"
      />
      
      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col">
        {/* Header with Logo and Title */}
        <Header />
        
        {/* Links Grid */}
        <div className="flex-1 px-4 md:px-8 lg:px-12 pb-8">
          <div className="max-w-5xl mx-auto">
            <LinksGrid />
          </div>
        </div>
        
        {/* Footer */}
        <footer className="py-6 md:py-8 text-center">
          <p className="text-sm text-muted-foreground">
            الجمهورية العربية السورية
          </p>
        </footer>
      </main>
    </div>
  );
}
