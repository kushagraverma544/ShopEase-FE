import { useState } from 'react';

import { FAKE_USER } from '../../constants/fakeUser.constants';
import { AddressesCard } from './sections/AddressesCard';
import { ContactDetailsCard } from './sections/ContactDetailsCard';
import { PaymentCardsCard } from './sections/PaymentCardsCard';
import { PersonalDetailsCard } from './sections/PersonalDetailsCard';
import { ProfileSidebar } from './sections/ProfileSidebar';

export function AccountPage() {
  const user = FAKE_USER;
  const [addresses, setAddresses] = useState(user.addresses);
  const [cards, setCards] = useState(user.cards);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900">My Account</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
        <ProfileSidebar user={user} />

        <div className="flex flex-col gap-6">
          <PersonalDetailsCard personal={user.personal} />
          <ContactDetailsCard contact={user.contact} />
          <AddressesCard addresses={addresses} onAddressesChange={setAddresses} />
          <PaymentCardsCard cards={cards} onCardsChange={setCards} />
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
