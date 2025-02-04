/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { useCreateLawyer } from '@/hooks/useLawyers';
import { useRouter } from 'next/navigation';
import {LawyerCreateData} from '@/lib/api/lawyers';

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

export default function CreateLawyerPage() {
  const router = useRouter();
  const createLawyer = useCreateLawyer();

  const [formData, setFormData] = useState<LawyerCreateData>({
    email: '',
    password: '',
    name: '',
    specializations: [], // Now correctly inferred as string[]
    barNumber: '',
    licenseStatus: 'Active', // Ensure this is strictly typed
    jurisdictions: {
      regions: [],
      countries: [],
    },
    hourlyRate: 0, // This will be converted to a number before submission
    contactInfo: {
      email: '',
      phone: '', // Optional field
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
    },
    availability: {
      daysAvailable: [], // This should be an array of strings
      hoursAvailable: {
        from: '09:00', // Default time
        to: '17:00',   // Default time
      },
    },
  });

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    try {
      await createLawyer.mutateAsync({
        ...formData,
        hourlyRate: parseFloat(formData.hourlyRate.toString()), // Ensure hourlyRate is a number
      });
      router.push('/lawyers');
      
    } catch (error) {
      console.error('Error creating lawyer:', error);
    }
  };

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle changes for contactInfo fields
  const handleContactInfoChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;

    // const nameParts = name.split(".");
    const nameParts: string[] = name.split(".");

    // setFormData((prev) => ({
    //   ...prev,
    //   [nameParts[0]]: {
    //     ...prev[nameParts[0]],
    //     [nameParts[1]]: value,
    //   },
    // }));
    setFormData((prev) => {
      if (nameParts.length === 2 && nameParts[0] === "contactInfo") {
        return {
          ...prev,
          contactInfo: {
            ...prev.contactInfo,
            [nameParts[1] as keyof LawyerCreateData["contactInfo"]]: value,
          },
        };
      }
      return prev;
    });
  };


   // Handle changes for address fields
  const handleAddressChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        address: {
          ...prev.contactInfo.address,
          [name]: value,
        },
      },
    }));
  };

  const handleSpecializationsChange = (specialization: string) => {
     setFormData((prev) => ({
       ...prev,
       specializations:
         prev.specializations.includes(specialization)
           ? prev.specializations.filter((s) => s !== specialization)
           : [...prev.specializations, specialization],
     }));
   };

   const handleDaysChange = (day: string) => {
     setFormData((prev) => ({
       ...prev,
       availability: {
         ...prev.availability,
         daysAvailable:
           prev.availability.daysAvailable.includes(day)
             ? prev.availability.daysAvailable.filter((d) => d !== day)
             : [...prev.availability.daysAvailable, day],
       },
     }));
   };

   return (
     <div className="max-w-4xl mx-auto p-6">
       <h1 className="text-2xl font-bold mb-6">Create New Lawyer Profile</h1>
       <form onSubmit={handleSubmit} className="space-y-6">
         {/* Basic Information */}
         <div className="bg-white p-6 rounded-lg shadow">
           <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="input-field" required />
             <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} className="input-field" required />
             <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} className="input-field" required />
             <input type="text" name="barNumber" placeholder="Bar Number" value={formData.barNumber} onChange={handleInputChange} className="input-field" required />
             <select name="licenseStatus" value={formData.licenseStatus} onChange={handleInputChange} className="input-field">
               <option value="Active">Active</option>
               <option value="Inactive">Inactive</option>
             </select>
             <input type="number" name="hourlyRate" placeholder="Hourly Rate" value={formData.hourlyRate} onChange={handleInputChange} className="input-field" required min="0" step="0.01" />
           </div>
         </div>

         {/* Specializations */}
         <div className="bg-white p-6 rounded-lg shadow">
           <h2 className="text-xl font-semibold mb-4">Specializations</h2>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
             {SPECIALIZATIONS.map((spec) => (
               <label key={spec} className="flex items-center space-x-2">
                 <input type="checkbox" checked={formData.specializations.includes(spec)} onChange={() => handleSpecializationsChange(spec)} className="rounded" />
                 <span>{spec}</span>
               </label>
             ))}
           </div>
         </div>

         {/* Contact Information */}
         <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="email"
          name="contactInfo.email"
          placeholder="Contact Email"
          value={formData.contactInfo.email}
          onChange={handleContactInfoChange}
          className="input-field"
          required
        />
        <input
          type="tel"
          name="contactInfo.phone"
          placeholder="Phone Number"
          value={formData.contactInfo.phone}
          onChange={handleContactInfoChange}
          className="input-field"
        />
        <input
          type="text"
          name="street"
          placeholder="Street Address"
          value={formData.contactInfo.address.street}
          onChange={handleAddressChange}
          className="input-field"
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.contactInfo.address.city}
          onChange={handleAddressChange}
          className="input-field"
          required
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.contactInfo.address.state}
          onChange={handleAddressChange}
          className="input-field"
          required
        />
        <input
          type="text"
          name="zipCode"
          placeholder="Zip Code"
          value={formData.contactInfo.address.zipCode}
          onChange={handleAddressChange}
          className="input-field"
          required
        />
      </div>
    </div>

         {/* Availability */}
         <div className='bg-white p-6 rounded-lg shadow'>
           <h2 className='text-xl font-semibold mb-4'>Availability</h2>
           <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-4'>
             {DAYS.map((day) => (
               <label key={day} className='flex items-center space-x-2'>
                 <input type='checkbox' checked={formData.availability.daysAvailable.includes(day)} onChange={() => handleDaysChange(day)} className='rounded' />
                 <span>{day}</span>
               </label>
             ))}
           </div>
           <div className='grid grid-cols-2 gap-4'>
             <div>
               <label className='block text-sm font-medium mb-1'>From</label>
               <input type='time' 
                 value={formData.availability.hoursAvailable.from}
                 onChange={(e) =>
                   setFormData((prev) => ({
                     ...prev,
                     availability: {
                       ...prev.availability,
                       hoursAvailable: {
                         ...prev.availability.hoursAvailable,
                         from: e.target.value,
                       },
                     },
                   }))
                 }
                 className='input-field'
               />
             </div>
             <div>
               <label className='block text-sm font-medium mb-1'>To</label>
               <input type='time' 
                 value={formData.availability.hoursAvailable.to}
                 onChange={(e) =>
                   setFormData((prev) => ({
                     ...prev,
                     availability: {
                       ...prev.availability,
                       hoursAvailable: {
                         ...prev.availability.hoursAvailable,
                         to: e.target.value,
                       },
                     },
                   }))
                 }
                 className='input-field'
               />
             </div>
           </div>
         </div>

         {/* Submit Button */}
         <button 
           type='submit' 
           className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors'
           disabled={createLawyer.isPending}
         >
           {createLawyer.isPending ? 'Creating...' : 'Create Lawyer Profile'}
         </button>
       </form>
     </div>
   );
}
