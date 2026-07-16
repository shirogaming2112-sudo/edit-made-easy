import { useForm } from '@tanstack/react-form';
import type { ApplicationData } from '@/types/application';

export const defaultApplicationData: ApplicationData = {
  email: '',
  password: '',
  personalInfo: {
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    dateOfBirth: '',
    phoneNumber: '',
    phoneCountry: '',
    languagesSpoken: '',
    houseStreet: '',
    barangay: '',
    city: '',
    address: '',
    country: '',
    nationality: '',
    valueProposition: '',
    referralLink: '',
    photo: null,
  },
  education: {
    highestLevel: '',
    schoolName: '',
    schoolLocation: '',
    graduationDate: '',
    degreeField: '',
  },
  professionalBackground: {
    preferredIndustry: '',
    preferredRole: '',
    availability: '',
    schedule: '',
    hoursPerDay: '',
  },
  workExperiences: [],
  selectedTools: [],
  selectedSkills: [],
  portfolioLink: '',
  portfolioFiles: [],
  certifications: [],
  workSetup: {
    primaryDevice: '',
    hasNoiseCancellingHeadset: false,
    hasHDWebcam: false,
    secondaryDevice: '',
    primaryInternetProvider: '',
    secondaryInternetProvider: '',
    primaryISPSpeedtest: '',
    secondaryISPSpeedtest: '',
    documents: [],
    deviceScreenshots: [],
    secondaryDeviceScreenshots: [],
    systemSpecs: { cpu: '', ram: '', storage: '', source: '' },
  },
  compliance: {
    authorizeBackgroundCheck: false,
    validId: null,
    nbiClearance: null,
    policeClearance: null,
    proofOfSeparation: null,
    nbiValidity: '',
    policeValidity: '',
    canSubmitNbiPolice: '',
    canSubmitCoe: '',
  },
};

export function useApplicationForm(
  onSubmit: (data: ApplicationData) => Promise<void> | void,
) {
  return useForm({
    defaultValues: defaultApplicationData,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });
}
