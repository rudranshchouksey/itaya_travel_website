import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getBooking } from '@/lib/api/bookings';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default async function BookingDetailsPage({ params }: { params: { id: string } }) {
  const { getToken, userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const token = await getToken();
  let booking = null;
  
  if (token) {
    try {
      booking = await getBooking(token, params.id);
    } catch (e) {
      console.error('Error fetching booking details', e);
    }
  }

  if (!booking) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-surface-muted/30">
          <PageContainer className="py-12 text-center">
            <h1 className="font-display text-2xl font-bold mb-4">Booking not found</h1>
            <Link href="/bookings" className="text-primary hover:underline">
              Return to bookings
            </Link>
          </PageContainer>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-muted/30">
        <PageContainer className="py-12 max-w-3xl">
          <Link href="/bookings" className="inline-flex items-center text-sm text-muted hover:text-primary mb-6">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            Back to Bookings
          </Link>

          <div className="bg-surface rounded-3xl p-8 shadow-sm border border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="font-display text-3xl font-bold text-primary mb-2">
                  {booking.item_type} Booking
                </h1>
                <p className="text-sm text-muted font-mono">ID: {booking.id}</p>
              </div>
              <span className={`px-4 py-2 rounded-full uppercase tracking-wider text-sm font-semibold ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-surface-muted'}`}>
                {booking.status}
              </span>
            </div>

            <div className="space-y-6 divide-y divide-border">
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div>
                  <h3 className="text-sm text-muted mb-1">Dates</h3>
                  <p className="font-medium">
                    {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'N/A'} - 
                    {booking.end_date ? new Date(booking.end_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted mb-1">Provider</h3>
                  <p className="font-medium">{booking.provider || 'Itvaya Partners'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6">
                <div>
                  <h3 className="text-sm text-muted mb-1">Payment Status</h3>
                  <p className="font-medium">{booking.payment_status}</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted mb-1">Total Price</h3>
                  <p className="font-medium text-lg">{booking.total_price} {booking.currency}</p>
                </div>
              </div>

              {booking.cancellation_reason && (
                <div className="pt-6">
                  <h3 className="text-sm text-red-500 mb-1">Cancellation Reason</h3>
                  <p className="font-medium">{booking.cancellation_reason}</p>
                </div>
              )}

              {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                <div className="pt-8 flex justify-end">
                  <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200">
                    Cancel Booking
                  </Button>
                </div>
              )}
            </div>
          </div>
        </PageContainer>
      </main>
    </>
  );
}
