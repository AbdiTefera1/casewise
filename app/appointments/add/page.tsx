'use client';

import { useForm } from 'react-hook-form';
import { useCreateAppointment } from '@/hooks/useAppointments';
import { useLawyers } from '@/hooks/useLawyers';
import { useClients } from '@/hooks/useClients';
import { useCases } from '@/hooks/useCases';
import { AppointmentCreateData, AppointmentStatus, AppointmentType } from '@/lib/api/appointments';

type AppointmentFormData = Omit<AppointmentCreateData, 'appointmentDate' | 'startTime' | 'endTime'> & {
    appointmentDate: string;
    startTime: string;
    endTime: string;
  };

function CreateAppointmentModal() {
    const { register, handleSubmit, formState: { errors } } = useForm<AppointmentFormData>({
        defaultValues: {
            title: '',
            description: '',
            appointmentDate: '',
            startTime: '',
            endTime: '',
            status: AppointmentStatus.SCHEDULED,
            location: '',
            type: AppointmentType.IN_PERSON,
            lawyerId: '',
            clientId: '',
            caseId: ''
        }
    });

    const createAppointment = useCreateAppointment();
    const { data: lawyersData } = useLawyers();
    const { data: clientsData } = useClients();
    const { data: casesData } = useCases();

    const onSubmit = async (formData: AppointmentFormData) => {
        try {
            // Convert string dates to Date objects
            const appointmentData: AppointmentCreateData = {
                ...formData,
                appointmentDate: new Date(formData.appointmentDate),
                startTime: new Date(formData.startTime),
                endTime: new Date(formData.endTime)
            };
            
            await createAppointment.mutateAsync(appointmentData);
        } catch (error) {
            console.error("Error creating appointment:", error);
            // Handle error appropriately (e.g., show a notification)
        }
    };

    return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Create Appointment</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                {...register('title', { required: 'Title is required' })}
                                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                aria-invalid={errors.title ? 'true' : 'false'}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select
                                {...register('type')}
                                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                            >
                                <option value="IN_PERSON">In Person</option>
                                <option value="VIRTUAL">Virtual</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                {...register('description')}
                                rows={3}
                                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                            />
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                {...register('appointmentDate', { required: 'Date is required' })}
                                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                aria-invalid={errors.appointmentDate ? 'true' : 'false'}
                            />
                        </div> */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                {...register('appointmentDate', { required: 'Date is required' })}
                                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                aria-invalid={errors.appointmentDate ? 'true' : 'false'}
                            />
                            {errors.appointmentDate && (
                                <p className="text-red-500 text-sm mt-1">{errors.appointmentDate.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                {...register('location')}
                                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                            />
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700">Start Time</label>
                            <input
                                type="datetime-local"
                                {...register('startTime', { required: 'Start time is required' })}
                                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                aria-invalid={errors.startTime ? 'true' : 'false'}
                            />
                        </div> */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start Time</label>
                            <input
                                type="datetime-local"
                                {...register('startTime', { required: 'Start time is required' })}
                                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                aria-invalid={errors.startTime ? 'true' : 'false'}
                            />
                            {errors.startTime && (
                                <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
                            )}
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700">End Time</label>
                            <input
                                type="datetime-local"
                                {...register('endTime', { required: 'End time is required' })}
                                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                aria-invalid={errors.endTime ? 'true' : 'false'}
                            />
                        </div> */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">End Time</label>
                            <input
                                type="datetime-local"
                                {...register('endTime', { required: 'End time is required' })}
                                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                aria-invalid={errors.endTime ? 'true' : 'false'}
                            />
                            {errors.endTime && (
                                <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Lawyer</label>
                            <select
                                {...register('lawyerId')}
                                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                            >
                                <option value="">Select a lawyer</option>
                                {lawyersData?.lawyers?.map(lawyer => (
                                    <option key={lawyer.id} value={lawyer.id}>
                                        {lawyer.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Client</label>
                            <select
                                {...register('clientId')}
                                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                            >
                                <option value="">Select a client</option>
                                {clientsData?.data?.clients?.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.firstName}  {client.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Case</label>
                            <select
                                {...register('caseId')}
                                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                            >
                                <option value="">Select a case</option>
                                {casesData?.cases?.map(caseItem => (
                                    <option key={caseItem.id} value={caseItem.id}>
                                        {caseItem.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Create Appointment
                        </button>
                    </div>
                </form>
            </div>
    );
}

export default CreateAppointmentModal;