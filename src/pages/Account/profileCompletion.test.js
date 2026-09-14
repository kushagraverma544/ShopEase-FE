import { describe, expect, it } from 'vitest';

import { getProfileCompletion } from './profileCompletion';

describe('getProfileCompletion', () => {
  it('is 0% for a brand-new user with only a username/password', () => {
    const completion = getProfileCompletion({
      fullName: null,
      gender: null,
      dateOfBirth: null,
      preferredLanguage: null,
      mobileNumber: null,
      alternateNumber: null,
      addresses: [],
    });

    expect(completion.percent).toBe(0);
    expect(completion.completedCount).toBe(0);
    expect(completion.totalCount).toBe(7);
    expect(completion.missingLabels).toHaveLength(7);
  });

  it('is 100% once every tracked field and at least one address are filled', () => {
    const completion = getProfileCompletion({
      fullName: 'Rohan Verma',
      gender: 'Male',
      dateOfBirth: '1996-03-14',
      preferredLanguage: 'English',
      mobileNumber: '+91 98765 43210',
      alternateNumber: '+91 87654 32109',
      addresses: [{ id: 1 }],
    });

    expect(completion.percent).toBe(100);
    expect(completion.missingLabels).toEqual([]);
  });

  it('does not count email or otpLoginEnabled toward completion', () => {
    const completion = getProfileCompletion({
      fullName: null,
      gender: null,
      dateOfBirth: null,
      preferredLanguage: null,
      mobileNumber: null,
      alternateNumber: null,
      addresses: [],
      email: 'rohan.verma@example.com',
      otpLoginEnabled: false,
    });

    expect(completion.percent).toBe(0);
  });

  it('rounds a partial score and lists what is missing', () => {
    const completion = getProfileCompletion({
      fullName: 'Rohan Verma',
      gender: null,
      dateOfBirth: null,
      preferredLanguage: null,
      mobileNumber: null,
      alternateNumber: null,
      addresses: [],
    });

    expect(completion.completedCount).toBe(1);
    expect(completion.percent).toBe(14); // 1/7 rounded
    expect(completion.missingLabels).toContain('Gender');
    expect(completion.missingLabels).not.toContain('Full name');
  });
});
