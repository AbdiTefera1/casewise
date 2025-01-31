'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useCreateCase } from '@/hooks/useCases'; 
import { CaseFormData} from '@/lib/api/cases';
import { useClients } from '@/hooks/useClients'; // Adjust import path as necessary
import { useLawyers } from '@/hooks/useLawyers';


export default function AddCasePage() {
    const router = useRouter();
    
    const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<CaseFormData>({
        defaultValues: {
            courts: [{ courtNo: '', courtType: '', court: '', judgeType: '', judgeName: '', remarks: '' }],
            status: 'ACTIVE',
            priority: 'MEDIUM'
        }
    });
    
    const { fields, append, remove } = useFieldArray({
        control,
        name: "courts"
    });

    const createCaseMutation = useCreateCase(); // Using the custom hook

    const onSubmit = (data: CaseFormData) => {
        createCaseMutation.mutate(data, {
            onSuccess: () => {
                router.push('/cases');
            },
            onError: (error) => {
                console.error("Error creating case:", error);
            }
        });
    };

    // Fetch clients and lawyers
    const { data: clientsData, isLoading: isLoadingClients } = useClients();
    const { data: lawyersData, isLoading: isLoadingLawyers } = useLawyers();

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Add Case</h1>
        </div>
  
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-medium mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Title*</label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  className="form-input w-full"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>
  
              <div>
                <label className="block text-sm mb-1">Client*</label>
                <select {...register('clientId', { required: 'Client is required' })} className="form-select w-full" disabled={isLoadingClients}>
                                <option value="">Select Client</option>
                                {clientsData?.data?.clients?.map(client => (
                                    <option key={client.id} value={client.id}>{client.firstName + " " + client.middleName}</option>
                                ))}
                            </select>
                            {isLoadingClients && <p>Loading clients...</p>}
              </div>
  
              <div className="col-span-2">
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="form-textarea w-full"
                />
              </div>
            </div>
          </section>
  
          {/* Case Details */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-medium mb-4">Case Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Case Type*</label>
                <select
                  {...register('caseType', { required: 'Case type is required' })}
                  className="form-select w-full"
                >
                  <option value="">Select Case Type</option>
                  <option value="Criminal">Criminal</option>
                  <option value="Civil">Civil</option>
                  {/* Add more options */}
                </select>
              </div>
  
              <div>
                <label className="block text-sm mb-1">Case Sub Type</label>
                <select
                  {...register('caseSubType')}
                  className="form-select w-full"
                >
                  <option value="">Select Sub Type</option>
                  <option value="Theft">Theft</option>
                  {/* Add more options */}
                </select>
              </div>
  
              <div>
                <label className="block text-sm mb-1">Stage of Case</label>
                <select
                  {...register('stageOfCase')}
                  className="form-select w-full"
                >
                  <option value="">Select Stage</option>
                  <option value="Investigation">Investigation</option>
                  <option value="Trial">Trial</option>
                  {/* Add more options */}
                </select>
              </div>
  
              <div>
                <label className="block text-sm mb-1">Status</label>
                <select
                  {...register('status')}
                  className="form-select w-full"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">InActive</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
  
              <div>
                <label className="block text-sm mb-1">Priority</label>
                <select
                  {...register('priority')}
                  className="form-select w-full"
                >
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="URGENT">URGENT</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
  
              <div>
                <label className="block text-sm mb-1">Start Date</label>
                <input
                  type="date"
                  {...register('startDate')}
                  className="form-input w-full"
                />
              </div>
  
              <div>
                <label className="block text-sm mb-1">End Date</label>
                <input
                  type="date"
                  {...register('endDate')}
                  className="form-input w-full"
                />
              </div>
            </div>
          </section>
  
          {/* Filing Details */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-medium mb-4">Filing Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Filing Number</label>
                <input
                  {...register('filingNumber')}
                  className="form-input w-full"
                />
              </div>
  
              <div>
                <label className="block text-sm mb-1">Filing Date</label>
                <input
                  type="date"
                  {...register('filingDate')}
                  className="form-input w-full"
                />
              </div>
  
              <div>
                <label className="block text-sm mb-1">First Hearing Date</label>
                <input
                  type="date"
                  {...register('firstHearingDate')}
                  className="form-input w-full"
                />
              </div>
  
              <div>
                <label className="block text-sm mb-1">Act</label>
                <input
                  {...register('act')}
                  className="form-input w-full"
                />
              </div>
            </div>
          </section>
  
          {/* FIR Details */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-medium mb-4">FIR Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Police Station</label>
                <input
                  {...register('policeStation')}
                  className="form-input w-full"
                />
              </div>
  
              <div>
                <label className="block text-sm mb-1">FIR Number</label>
                <input
                  {...register('firNumber')}
                  className="form-input w-full"
                />
              </div>
  
              <div>
                <label className="block text-sm mb-1">FIR Date</label>
                <input
                  type="date"
                  {...register('firDate')}
                  className="form-input w-full"
                />
              </div>
            </div>
          </section>
  
          {/* Courts */}
          <section className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Courts</h2>
              <button
                type="button"
                onClick={() => append({ courtNo: '', courtType: '', court: '', judgeType: '', judgeName: '', remarks: '' })}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Add Court
              </button>
            </div>
  
            {fields.map((field, index) => (
              <div key={field.id} className="border p-4 mb-4 rounded">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Court No</label>
                    <input
                      {...register(`courts.${index}.courtNo`)}
                      className="form-input w-full"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm mb-1">Court Type</label>
                    <select
                      {...register(`courts.${index}.courtType`)}
                      className="form-select w-full"
                    >
                      <option value="">Select Court Type</option>
                      <option value="District Court">District Court</option>
                      <option value="High Court">High Court</option>
                      {/* Add more options */}
                    </select>
                  </div>
  
                  <div>
                    <label className="block text-sm mb-1">Court</label>
                    <input
                      {...register(`courts.${index}.court`)}
                      className="form-input w-full"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm mb-1">Judge Type</label>
                    <input
                      {...register(`courts.${index}.judgeType`)}
                      className="form-input w-full"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm mb-1">Judge Name</label>
                    <input
                      {...register(`courts.${index}.judgeName`)}
                      className="form-input w-full"
                    />
                  </div>
  
                  <div className="col-span-2">
                    <label className="block text-sm mb-1">Remarks</label>
                    <textarea
                      {...register(`courts.${index}.remarks`)}
                      className="form-textarea w-full"
                    />
                  </div>
  
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 text-sm"
                    >
                      Remove Court
                    </button>
                  )}
                </div>
              </div>
            ))}
          </section>
  
          {/* Assigned To */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-medium mb-4">Assignment</h2>
            <div>
              <label className="block text-sm mb-1">Assigned To</label>
              <select {...register('assignedToId')} className="form-select w-full" disabled={isLoadingLawyers}>
                            <option value="">Select User</option>
                            {lawyersData?.lawyers.map(lawyer => (
                                <option key={lawyer.id} value={lawyer.id}>{lawyer.name}</option>
                            ))}
                        </select>
                        {isLoadingLawyers && <p>Loading lawyers...</p>}
            </div>
          </section>
  
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Case'}
            </button>
          </div>
        </form>
      </div>
    );
}
