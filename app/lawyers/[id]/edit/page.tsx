'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

import { useLawyer, useUpdateLawyer } from '@/hooks/useLawyers';
import { LawyerCreateData } from '@/lib/api/lawyers';

const SPECIALIZATIONS = [
  'Criminal Law',
  'Family Law',
  'Corporate Law',
  'Immigration Law',
  'Real Estate Law',
  'Tax Law',
];

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

type UpdateLawyerFormData = Partial<Omit<LawyerCreateData, 'password'>>; // email is still needed

export default function UpdateLawyerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: lawyerId } = use(params);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateLawyerFormData>({
    defaultValues: {
      specializations: [],
      jurisdictions: { regions: [], countries: [] },
      availability: { daysAvailable: [] },
      contactInfo: { address: {} },
    },
  });

  const { data, isLoading } = useLawyer(lawyerId);
  const updateLawyerMutation = useUpdateLawyer();

  const lawyer = data?.lawyer?.lawyer;
  const user = data?.lawyer; // contains name, email

  /* ---------------- Load Initial Values ---------------- */
  useEffect(() => {
    if (lawyer && user) {
      // Top-level fields
      setValue('name', user.name);
      setValue('barNumber', lawyer.barNumber);
      setValue('licenseStatus', lawyer.licenseStatus || 'Active');
      setValue('hourlyRate', lawyer.hourlyRate);

      // Arrays
      setValue('specializations', lawyer.specializations || []);
      setValue('jurisdictions.regions', lawyer.jurisdictions?.regions || []);
      setValue('jurisdictions.countries', lawyer.jurisdictions?.countries || []);
      setValue('availability.daysAvailable', lawyer.availability?.daysAvailable || []);

      // Contact info – email must be included (required by backend)
      setValue('contactInfo.email', user.email); // crucial!
      setValue('contactInfo.phone', lawyer.contactInfo?.phone || '');
      setValue('contactInfo.address.street', lawyer.contactInfo?.address?.street || '');
      setValue('contactInfo.address.city', lawyer.contactInfo?.address?.city || '');
      setValue('contactInfo.address.state', lawyer.contactInfo?.address?.state || '');
      setValue('contactInfo.address.zipCode', lawyer.contactInfo?.address?.zipCode || '');

      // Availability hours
      setValue('availability.hoursAvailable.from', lawyer.availability?.hoursAvailable?.from || '09:00');
      setValue('availability.hoursAvailable.to', lawyer.availability?.hoursAvailable?.to || '17:00');
    }
  }, [lawyer, user, setValue]);

  /* ---------------- Watched Values for Checkboxes ---------------- */
  const watchedSpecializations = watch('specializations', []) as string[];
  const watchedDays = watch('availability.daysAvailable', []) as string[];
  const watchedRegions = watch('jurisdictions.regions', []) as string[];
  const watchedCountries = watch('jurisdictions.countries', []) as string[];

  /* ---------------- Submit ---------------- */
  const onSubmit = (data: UpdateLawyerFormData) => {
    const formattedData: Partial<LawyerCreateData> = {
      ...data,
      hourlyRate: data.hourlyRate !== undefined ? Number(data.hourlyRate) : undefined,

      // Ensure arrays are always sent as arrays
      specializations: Array.isArray(data.specializations) ? data.specializations : [],
      jurisdictions: {
        regions: Array.isArray(data.jurisdictions?.regions) ? data.jurisdictions?.regions : [],
        countries: Array.isArray(data.jurisdictions?.countries) ? data.jurisdictions?.countries : [],
      },
      availability: {
        daysAvailable: Array.isArray(data.availability?.daysAvailable)
          ? data.availability?.daysAvailable
          : [],
        hoursAvailable: data.availability?.hoursAvailable || { from: '09:00', to: '17:00' },
      },

      // Always include contactInfo.email (required by schema)
      contactInfo: {
        email: user?.email || data.contactInfo?.email || '',
        phone: data.contactInfo?.phone,
        address: data.contactInfo?.address,
      },
    };

    updateLawyerMutation.mutate(
      { id: lawyerId, data: formattedData },
      {
        onSuccess: () => router.push('/lawyers'),
        onError: (err) => console.error('Update failed:', err),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Update Lawyer Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name*</label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bar Number*</label>
              <input
                {...register('barNumber', { required: 'Bar number is required' })}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.barNumber && <p className="text-red-500 text-sm mt-1">{errors.barNumber.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">License Status</label>
              <select {...register('licenseStatus')} className="w-full px-3 py-2 border rounded-md">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Hourly Rate</label>
              <input
                type="number"
                step="0.01"
                {...register('hourlyRate', { valueAsNumber: true })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </section>

        {/* Specializations */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Specializations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SPECIALIZATIONS.map((spec) => (
              <label key={spec} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={watchedSpecializations.includes(spec)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...watchedSpecializations, spec]
                      : watchedSpecializations.filter((s) => s !== spec);
                    setValue('specializations', updated);
                  }}
                  className="rounded"
                />
                <span>{spec}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Jurisdictions – Now using checkboxes like specializations */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Jurisdictions (Optional)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Regions</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['California', 'New York', 'Texas', 'Florida', 'Illinois'].map((region) => (
                  <label key={region} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={watchedRegions.includes(region)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...watchedRegions, region]
                          : watchedRegions.filter((r) => r !== region);
                        setValue('jurisdictions.regions', updated);
                      }}
                      className="rounded"
                    />
                    <span>{region}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Countries</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['USA', 'Canada', 'UK', 'Australia'].map((country) => (
                  <label key={country} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={watchedCountries.includes(country)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...watchedCountries, country]
                          : watchedCountries.filter((c) => c !== country);
                        setValue('jurisdictions.countries', updated);
                      }}
                      className="rounded"
                    />
                    <span>{country}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="text-sm text-gray-600 mb-4">
            Email: <span className="font-medium">{user?.email}</span> (cannot be changed)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register('contactInfo.phone')}
              placeholder="Phone Number"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              {...register('contactInfo.address.street')}
              placeholder="Street Address"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              {...register('contactInfo.address.city')}
              placeholder="City"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              {...register('contactInfo.address.state')}
              placeholder="State"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              {...register('contactInfo.address.zipCode')}
              placeholder="Zip Code"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </section>

        {/* Availability */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Availability</h2>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Days Available</label>
            <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
              {DAYS.map((day) => (
                <label key={day} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={watchedDays.includes(day)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...watchedDays, day]
                        : watchedDays.filter((d) => d !== day);
                      setValue('availability.daysAvailable', updated);
                    }}
                    className="rounded"
                  />
                  <span>{day.slice(0, 3)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1">From</label>
              <input
                type="time"
                {...register('availability.hoursAvailable.from')}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">To</label>
              <input
                type="time"
                {...register('availability.hoursAvailable.to')}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update Lawyer'}
          </button>
        </div>
      </form>
    </div>
  );
}