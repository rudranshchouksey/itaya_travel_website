import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getBookings } from '@/lib/api/bookings';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import Link from 'next/link';

export default async function BookingsPage() {
  const { getToken, userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const token = await getToken();
  let bookings: import('@/lib/api/bookings').Booking[] = [];
  
  if (token) {
    try {
      bookings = await getBookings(token);
    } catch (e) {
      console.error('Error fetching bookings', e);
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-muted/30">
        <PageContainer className="py-12">
          <h1 className="font-display text-4xl font-bold text-primary mb-8">My Bookings</h1>

          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map(booking => (
                <Link key={booking.id} href={`/bookings/${booking.id}`} className="group block">
                  <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-display font-semibold text-lg">{booking.item_type}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wider ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-surface-muted'}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-muted mb-4">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-medium text-foreground">{booking.total_price} {booking.currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment:</span>
                        <span className="font-medium text-foreground">{booking.payment_status}</span>
                      </div>
                      {booking.start_date && (
                        <div className="flex items-center text-xs mt-2">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          {new Date(booking.start_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-surface rounded-2xl border border-border">
              <p className="text-muted text-lg">You don&apos;t have any bookings yet.</p>
              <Link href="/" className="inline-block mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
                Explore Stays & Experiences
              </Link>
            </div>
          )}
        </PageContainer>
      </main>
    </>
  );
}
