import { useCallback, useEffect, useRef, useState } from 'react';

import { ErrorState } from '../../components/common/ErrorState/ErrorState';
import { Skeleton } from '../../components/common/Skeleton/Skeleton';
import { userProfileUpdated } from '../../features/auth/authSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { getMyDetails } from '../../services/meService';
import { getProfileCompletion } from './profileCompletion';
import { AddressesCard } from './sections/AddressesCard';
import { ContactDetailsCard } from './sections/ContactDetailsCard';
import { PaymentCardsCard } from './sections/PaymentCardsCard';
import { PersonalDetailsCard } from './sections/PersonalDetailsCard';
import { ProfileCompletionBar } from './sections/ProfileCompletionBar';
import { ProfileSidebar } from './sections/ProfileSidebar';

export function AccountPage() {
  const dispatch = useAppDispatch();
  const [details, setDetails] = useState(null);
  const [status, setStatus] = useState('loading');
  const [cards, setCards] = useState([]);
  const isMountedRef = useRef(false);

  const loadDetails = useCallback(() => {
    getMyDetails()
      .then((data) => {
        if (isMountedRef.current) {
          setDetails(data);
          setStatus('success');
        }
      })
      .catch(() => {
        if (isMountedRef.current) setStatus('error');
      });
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    loadDetails();
    return () => {
      isMountedRef.current = false;
    };
  }, [loadDetails]);

  const retryDetails = useCallback(() => {
    setStatus('loading');
    loadDetails();
  }, [loadDetails]);

  // Keeps the header's display name in sync with this page — covers the
  // initial GET /me as well as any Personal Details edit, both of which
  // land here through setDetails.
  useEffect(() => {
    if (details) dispatch(userProfileUpdated({ fullName: details.fullName }));
  }, [details, dispatch]);

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-8 w-48" />
        <Skeleton className="mb-6 h-20 rounded-lg" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
          <Skeleton className="h-64 rounded-lg" />
          <div className="flex flex-col gap-6">
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorState
          title="Couldn't load your account"
          message="Something went wrong while fetching your details."
          onRetry={retryDetails}
        />
      </div>
    );
  }

  const completion = getProfileCompletion(details);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900">My Account</h1>

      <ProfileCompletionBar completion={completion} className="mb-6" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
        <ProfileSidebar details={details} />

        <div className="flex flex-col gap-6">
          <PersonalDetailsCard details={details} onUpdated={setDetails} />
          <ContactDetailsCard details={details} onUpdated={setDetails} />
          <AddressesCard
            addresses={details.addresses}
            onAddressesChange={(addresses) => setDetails((current) => ({ ...current, addresses }))}
          />
          <PaymentCardsCard cards={cards} onCardsChange={setCards} />
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
