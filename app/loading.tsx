import { PageContainer } from '@/components/layout/PageContainer';
import { Header } from '@/components/layout/Header';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <PageContainer className="flex-1 flex items-center justify-center py-20">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground font-medium animate-pulse">Loading...</p>
        </div>
      </PageContainer>
    </div>
  );
}
