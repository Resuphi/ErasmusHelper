export interface PartnerUniversity {
  name: string;
  country: string;
  lat: number;
  lng: number;
  department?: string;
}

export interface TurkishUniversity {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  departments: Department[];
}

export interface Department {
  name: string;
  partners: PartnerUniversity[];
}

export interface UniversityData {
  universities: TurkishUniversity[];
}

export interface TurkishPartnerInfo {
  universityId: string;
  universityName: string;
  universityCity: string;
  department: string;
  partnerDepartment?: string;
}

export interface PartnerUniversityDetail {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  turkishPartners: TurkishPartnerInfo[];
}

