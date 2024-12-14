'use client';

import { useForm } from 'react-hook-form';
import { CompanyType, ClientStatus, CreateClientData } from '@/lib/api/clients';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useCreateClient } from '@/hooks/useClients'; // Adjust the import path as necessary
import Spinner from '@/components/Spinner'; // Adjust the import path as necessary

const CreateClientPage = () => {
    const router = useRouter();
    const createClientMutation = useCreateClient();

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<CreateClientData>({
        defaultValues: {
            type: CompanyType.INDIVIDUAL,
            status: ClientStatus.ACTIVE,
        },
    });

    const onSubmit = async (data: CreateClientData) => {
        try {
            const clientData: CreateClientData = {
                firstName: data.firstName,
                middleName: data.middleName || "",
                lastName: data.lastName || "",
                email: data.email || "",
                type: data.type || CompanyType.INDIVIDUAL,
                gender: data.gender || undefined,
                contactInfo: {
                    phone: data.contactInfo?.phone || "",
                    alternateEmail: data.contactInfo?.alternateEmail || "",
                    address: {
                        street: data.contactInfo?.address?.street || "",
                        city: data.contactInfo?.address?.city || "",
                        state: data.contactInfo?.address?.state || "",
                        country: data.contactInfo?.address?.country || "",
                        postalCode: data.contactInfo?.address?.postalCode || "",
                    },
                },
                companyName: data.type === CompanyType.COMPANY ? data.companyName || undefined : undefined,
                industry: data.type === CompanyType.COMPANY ? data.industry || undefined : undefined,
                website: data.type === CompanyType.COMPANY ? data.website || undefined : undefined,
                notes: data.notes || "",
                customFields: data.customFields || "",
                status: data.status || ClientStatus.ACTIVE,
            };

            await createClientMutation.mutateAsync(clientData, {
                onSuccess: () => {
                    toast.success('Client created successfully');
                    reset();
                    router.push('/clients');
                },
                onError: (error) => {
                    toast.error(error.message || 'Failed to create client');
                },
            });
        } catch (error) {
            toast.error('Something went wrong');
            console.error('Create client error:', error);
        }
    };

    const selectedType = watch('type');
    const isCompany = selectedType === CompanyType.COMPANY;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Add Client</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                    {/* Basic Information */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name *</label>
                        <input
                            type="text"
                            {...register('firstName', { required: 'First Name is required' })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                        {errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                        <input
                            type="text"
                            {...register('middleName')}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                        <input
                            type="text"
                            {...register('lastName', { required: 'Last Name is required' })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                        {errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Email ID</label>
                        <input
                            type="email"
                            {...register('email')}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Client Type */}
                    <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Client Type</label>
                        <select
                            {...register('type', { required: 'Client Type is required' })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                            {Object.values(CompanyType).map((type) => (
                                <option key={type} value={type}>
                                    {type.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                        {errors.type && (
                            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                        )}
                    </div>

                    {/* Company Information (shown only when type is COMPANY) */}
                    {isCompany && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                <input
                                    type="text"
                                    {...register('companyName')}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Industry</label>
                                <input
                                    type="text"
                                    {...register('industry')}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Website</label>
                                <input
                                    type="url"
                                    {...register('website')}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                        </>
                    )}

                    {/* Contact Information */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="tel"
                            {...register('contactInfo.phone', { required: 'Phone is required' })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                        {errors.contactInfo?.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.contactInfo.phone.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Alternate Email</label>
                        <input
                            type="email"
                            {...register('contactInfo.alternateEmail')}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                        {errors.contactInfo?.alternateEmail && (
                            <p className="text-red-500 text-sm mt-1">{errors.contactInfo.alternateEmail.message}</p>
                        )}
                    </div>

                    {/* Address Information */}
                    <div className="col-span-3">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Address</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {/* Street */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Street</label>
                                <input
                                    type="text"
                                    {...register('contactInfo.address.street', { required: 'Street is required' })}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                                {errors.contactInfo?.address?.street && (
                                    <p className="text-red-500 text-sm mt-1">{errors.contactInfo.address.street.message}</p>
                                )}
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">City</label>
                                <input
                                    type="text"
                                    {...register('contactInfo.address.city', { required: 'City is required' })}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                                {errors.contactInfo?.address?.city && (
                                    <p className="text-red-500 text-sm mt-1">{errors.contactInfo.address.city.message}</p>
                                )}
                            </div>

                            {/* State */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">State</label>
                                <input
                                    type="text"
                                    {...register('contactInfo.address.state', { required: 'State is required' })}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                                {errors.contactInfo?.address?.state && (
                                    <p className="text-red-500 text-sm mt-1">{errors.contactInfo.address.state.message}</p>
                                )}
                            </div>

                            {/* Country */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Country</label>
                                <input
                                    type="text"
                                    {...register('contactInfo.address.country', { required: 'Country is required' })}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                                {errors.contactInfo?.address?.country && (
                                    <p className="text-red-500 text-sm mt-1">{errors.contactInfo.address.country.message}</p>
                                )}
                            </div>

                            {/* Postal Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                                <input
                                    type="text"
                                    {...register('contactInfo.address.postalCode', { required: 'Postal Code is required' })}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                                {errors.contactInfo?.address?.postalCode && (
                                    <p className="text-red-500 text-sm mt-1">{errors.contactInfo.address.postalCode.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <textarea
                            {...register('notes')}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Custom Fields</label>
                        <input
                            type="text"
                            {...register('customFields')}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => router.push('/clients')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        {isSubmitting ? <Spinner /> : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateClientPage;