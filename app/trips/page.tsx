import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getTrips } from '@/lib/api/trips';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import Link from 'next/link';

export default async function TripsPage() {
  const { getToken, userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const token = await getToken();
  let trips: import('@/lib/api/trips').Trip[] = [];
  
  if (token) {
    try {
      trips = await getTrips(token);
    } catch (e) {
      console.error('Error fetching trips', e);
    }
  }

  const upcomingTrips = trips.filter(t => t.status === 'UPCOMING' || t.status === 'ACTIVE');
  const pastTrips = trips.filter(t => t.status === 'PAST');
  const draftTrips = trips.filter(t => t.status === 'DRAFT');

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-muted/30">
        <PageContainer className="py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-display text-4xl font-bold text-primary">My Trips</h1>
            <Link href="/destinations" className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
              Plan a new trip
            </Link>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="font-display text-2xl font-semibold mb-4 text-primary">Upcoming & Active Trips</h2>
              {upcomingTrips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingTrips.map(trip => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              ) : (
                <p className="text-muted text-sm bg-surface p-6 rounded-2xl border border-border">No upcoming trips. Time to plan an adventure!</p>
              )}
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold mb-4 text-primary">Drafts</h2>
              {draftTrips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {draftTrips.map(trip => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              ) : (
                <p className="text-muted text-sm">No draft trips.</p>
              )}
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold mb-4 text-primary">Past Trips</h2>
              {pastTrips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                  {pastTrips.map(trip => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              ) : (
                <p className="text-muted text-sm">No past trips.</p>
              )}
            </section>
          </div>
        </PageContainer>
      </main>
    </>
  );
}

function TripCard({ trip }: { trip: import('@/lib/api/trips').Trip }) {
  return (
    <Link href={`/trips/${trip.id}`} className="group block">
      <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-display font-semibold text-lg line-clamp-1">{trip.name}</h3>
          <span className="text-xs px-2 py-1 bg-surface-muted rounded-full uppercase tracking-wider">{trip.status}</span>
        </div>
        <p className="text-sm text-muted mb-4 line-clamp-2">{trip.description || 'No description provided.'}</p>
        <div className="flex items-center text-xs text-muted">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'Dates TBD'}
        </div>
      </div>
    </Link>
  );
}
