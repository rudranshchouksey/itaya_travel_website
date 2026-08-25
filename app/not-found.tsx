import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <PageContainer className="flex-1 flex items-center justify-center py-20">
        <div className="text-center max-w-lg mx-auto">
          <h1 className="text-9xl font-display font-bold text-primary/20 mb-4">404</h1>
          <h2 className="text-3xl font-display font-bold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
          <div className="flex justify-center">
            <Link href="/" passHref>
              <Button size="lg">Back to Home</Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
