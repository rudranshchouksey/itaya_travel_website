import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getMe } from '@/lib/api/users';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { UserProfile } from '@clerk/nextjs';

export default async function ProfilePage() {
  const { getToken, userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const token = await getToken();
  let backendUser = null;
  
  if (token) {
    try {
      backendUser = await getMe(token);
    } catch (e) {
      console.error('Error fetching backend user', e);
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-muted/30">
        <PageContainer className="py-12">
          <h1 className="font-display text-4xl font-bold text-primary mb-8">Your Profile</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-surface rounded-2xl shadow-sm border border-border p-6 flex justify-center">
                <UserProfile routing="hash" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border">
                <h3 className="font-display font-semibold text-xl mb-4">Travel Details</h3>
                {backendUser ? (
                  <div className="space-y-4">
                    <div>
                      <span className="block text-sm text-muted mb-1">Username</span>
                      <p className="font-medium">{backendUser.username}</p>
                    </div>
                    <div>
                      <span className="block text-sm text-muted mb-1">Preferred Currency</span>
                      <p className="font-medium">USD ($)</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted text-sm text-center py-4 bg-muted/30 rounded-lg">
                    Backend profile not linked.
                  </p>
                )}
              </div>
            </div>
          </div>
        </PageContainer>
      </main>
    </>
  );
}
