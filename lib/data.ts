import { UniversityData, TurkishUniversity, PartnerUniversityDetail, TurkishPartnerInfo } from "./types";
import universitiesData from "@/data/universities.json";

/**
 * Parses the university data from the JSON file
 * @returns UniversityData object containing all Turkish universities and their partners
 */
export function getUniversityData(): UniversityData {
  return universitiesData as UniversityData;
}

/**
 * Gets a single university by ID
 * @param id - University ID
 * @returns TurkishUniversity object or undefined if not found
 */
export function getUniversityById(id: string): TurkishUniversity | undefined {
  const data = getUniversityData();
  return data.universities.find((uni) => uni.id === id);
}

/**
 * Gets all Turkish universities
 * @returns Array of TurkishUniversity objects
 */
export function getAllUniversities(): TurkishUniversity[] {
  const data = getUniversityData();
  return data.universities;
}

/**
 * Filters universities by city
 * @param city - City name
 * @returns Array of TurkishUniversity objects in the specified city
 */
export function getUniversitiesByCity(city: string): TurkishUniversity[] {
  const data = getUniversityData();
  return data.universities.filter(
    (uni) => uni.city.toLowerCase() === city.toLowerCase()
  );
}

/**
 * Searches universities by name
 * @param query - Search query
 * @returns Array of TurkishUniversity objects matching the query
 */
export function searchUniversities(query: string): TurkishUniversity[] {
  const data = getUniversityData();
  const lowerQuery = query.toLowerCase();
  return data.universities.filter((uni) =>
    uni.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Gets all unique cities
 * @returns Array of city names
 */
export function getAllCities(): string[] {
  const data = getUniversityData();
  const cities = new Set(data.universities.map((uni) => uni.city));
  return Array.from(cities).sort();
}

/**
 * Gets all unique departments across all universities
 * @returns Array of department names
 */
export function getAllDepartments(): string[] {
  const data = getUniversityData();
  const departments = new Set<string>();
  
  data.universities.forEach((uni) => {
    uni.departments.forEach((dept) => {
      departments.add(dept.name);
    });
  });
  
  return Array.from(departments).sort();
}

/**
 * Generates a unique ID for a partner university based on its name
 * @param name - Partner university name
 * @returns Unique ID string
 */
export function generatePartnerId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Gets all unique partner universities across all Turkish universities
 * @returns Array of partner universities with unique IDs
 */
export function getAllPartnerUniversities(): PartnerUniversityDetail[] {
  const data = getUniversityData();
  const partnersMap = new Map<string, PartnerUniversityDetail>();

  data.universities.forEach((uni) => {
    uni.departments.forEach((dept) => {
      dept.partners.forEach((partner) => {
        const partnerId = generatePartnerId(partner.name);
        if (!partnersMap.has(partnerId)) {
          partnersMap.set(partnerId, {
            id: partnerId,
            name: partner.name,
            country: partner.country,
            lat: partner.lat,
            lng: partner.lng,
            turkishPartners: [],
          });
        }
        
        const partnerData = partnersMap.get(partnerId)!;
        partnerData.turkishPartners.push({
          universityId: uni.id,
          universityName: uni.name,
          universityCity: uni.city,
          department: dept.name,
          partnerDepartment: partner.department,
        });
      });
    });
  });

  return Array.from(partnersMap.values());
}

/**
 * Gets a partner university by ID
 * @param id - Partner university ID
 * @returns Partner university data or undefined
 */
export function getPartnerUniversityById(id: string): PartnerUniversityDetail | undefined {
  const partners = getAllPartnerUniversities();
  return partners.find((partner) => partner.id === id);
}

