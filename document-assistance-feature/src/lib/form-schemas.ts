import * as z from "zod";

// Base schema shared by all forms
const baseSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter your full address"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Please enter a valid ZIP code"),
  dateOfBirth: z.string(),
});

// Eviction Notice schema
export const evictionNoticeSchema = baseSchema.extend({
  tenantName: z.string().min(2, "Tenant name is required"),
  propertyAddress: z.string().min(5, "Property address is required"),
  leaseStartDate: z.string(),
  leaseEndDate: z.string(),
  evictionReason: z.string().optional(),
  rentAmount: z.string().min(1, "Rent amount is required"),
  rentDueDate: z.string(),
  noticePeriod: z.string().min(1, "Notice period is required"),
});

// Wage Theft Complaint schema
export const wageTheftSchema = baseSchema.extend({
  employerName: z.string().min(2, "Employer name is required"),
  employerAddress: z.string().min(5, "Employer address is required"),
  employmentStartDate: z.string(),
  employmentEndDate: z.string().optional(),
  unpaidAmount: z.string().min(1, "Unpaid amount is required"),
  workDescription: z.string().optional(),
  paymentAgreement: z.string().optional(),
  violationDetails: z.string().optional(),
});

// Employment Discrimination schema
export const employmentDiscriminationSchema = baseSchema.extend({
  employerName: z.string().min(2, "Employer name is required"),
  employerAddress: z.string().min(5, "Employer address is required"),
  employmentStartDate: z.string(),
  employmentEndDate: z.string().optional(),
  discriminationType: z.string().min(1, "Type of discrimination is required"),
  discriminationDetails: z.string().optional(),
  witnessNames: z.string().optional(),
  incidentDate: z.string(),
  remedieSought: z.string().optional(),
});

// Contract Dispute schema
export const contractDisputeSchema = baseSchema.extend({
  otherPartyName: z.string().min(2, "Other party name is required"),
  otherPartyAddress: z.string().min(5, "Other party address is required"),
  contractDate: z.string(),
  contractDescription: z.string().optional(),
  breachDescription: z.string().optional(),
  damagesAmount: z.string().min(1, "Damages amount is required"),
  resolutionRequested: z.string().optional(),
});

// Consumer Rights schema
export const consumerRightsSchema = baseSchema.extend({
  companyName: z.string().min(2, "Company name is required"),
  companyAddress: z.string().min(5, "Company address is required"),
  purchaseDate: z.string(),
  productOrService: z.string().min(5, "Product or service description is required"),
  purchaseAmount: z.string().min(1, "Purchase amount is required"),
  complaintDetails: z.string().optional(),
  resolutionAttempts: z.string().optional(),
  requestedRemedy: z.string().optional(),
});

// Family Law schema
export const familyLawSchema = baseSchema.extend({
  spouseName: z.string().min(2, "Spouse/other party name is required"),
  relationshipType: z.string().min(2, "Relationship type is required"),
  marriageDate: z.string().optional(),
  separationDate: z.string().optional(),
  childrenNames: z.string().optional(),
  petitionType: z.string().min(2, "Petition type is required"),
  petitionDetails: z.string().optional(),
  requestedRelief: z.string().optional(),
});

// Immigration Petition schema
export const immigrationPetitionSchema = baseSchema.extend({
  countryOfOrigin: z.string().min(2, "Country of origin is required"),
  immigrationStatus: z.string().min(2, "Current immigration status is required"),
  entryDate: z.string(),
  petitionType: z.string().min(2, "Petition type is required"),
  sponsorName: z.string().optional(),
  sponsorRelationship: z.string().optional(),
  caseNumber: z.string().optional(),
  petitionDetails: z.string().optional(),
});

// Get schema by category ID
export const getSchemaByCategory = (category: string): z.ZodObject<any> => {
  switch (category) {
    case "eviction-notice":
      return evictionNoticeSchema;
    case "wage-theft":
      return wageTheftSchema;
    case "employment-discrimination":
      return employmentDiscriminationSchema;
    case "contract-dispute":
      return contractDisputeSchema;
    case "consumer-rights":
      return consumerRightsSchema;
    case "family-law":
      return familyLawSchema;
    case "immigration-petition":
      return immigrationPetitionSchema;
    default:
      return baseSchema;
  }
};

// Get default values by category ID
export const getDefaultValuesByCategory = (category: string): Record<string, any> => {
  const today = new Date().toISOString().split("T")[0];
  
  const baseValues = {
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    dateOfBirth: "",
  };

  switch (category) {
    case "eviction-notice":
      return {
        ...baseValues,
        tenantName: "",
        propertyAddress: "",
        leaseStartDate: "",
        leaseEndDate: "",
        evictionReason: "",
        rentAmount: "",
        rentDueDate: "",
        noticePeriod: "30 days",
      };
    case "wage-theft":
      return {
        ...baseValues,
        employerName: "",
        employerAddress: "",
        employmentStartDate: "",
        employmentEndDate: "",
        unpaidAmount: "",
        workDescription: "",
        paymentAgreement: "",
        violationDetails: "",
      };
    case "employment-discrimination":
      return {
        ...baseValues,
        employerName: "",
        employerAddress: "",
        employmentStartDate: "",
        employmentEndDate: "",
        discriminationType: "",
        discriminationDetails: "",
        witnessNames: "",
        incidentDate: "",
        remedieSought: "",
      };
    case "contract-dispute":
      return {
        ...baseValues,
        otherPartyName: "",
        otherPartyAddress: "",
        contractDate: "",
        contractDescription: "",
        breachDescription: "",
        damagesAmount: "",
        resolutionRequested: "",
      };
    case "consumer-rights":
      return {
        ...baseValues,
        companyName: "",
        companyAddress: "",
        purchaseDate: "",
        productOrService: "",
        purchaseAmount: "",
        complaintDetails: "",
        resolutionAttempts: "",
        requestedRemedy: "",
      };
    case "family-law":
      return {
        ...baseValues,
        spouseName: "",
        relationshipType: "",
        marriageDate: "",
        separationDate: "",
        childrenNames: "",
        petitionType: "",
        petitionDetails: "",
        requestedRelief: "",
      };
    case "immigration-petition":
      return {
        ...baseValues,
        countryOfOrigin: "",
        immigrationStatus: "",
        entryDate: "",
        petitionType: "",
        sponsorName: "",
        sponsorRelationship: "",
        caseNumber: "",
        petitionDetails: "",
      };
    default:
      return baseValues;
  }
};

// Get form fields by category
export const getFormFieldsByCategory = (category: string): any[] => {
  const baseFields = [
    {
      name: "personalDetails",
      title: "Personal Information",
      description: "Enter your personal details",
      fields: [
        { name: "fullName", label: "Full Legal Name", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "phoneNumber", label: "Phone Number", type: "tel", required: true },
        { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
        { name: "address", label: "Street Address", type: "text", required: true },
        { name: "city", label: "City", type: "text", required: true },
        { name: "state", label: "State", type: "text", required: true },
        { name: "zipCode", label: "ZIP Code", type: "text", required: true },
      ],
    }
  ];

  switch (category) {
    case "eviction-notice":
      return [
        ...baseFields,
        {
          name: "tenantDetails",
          title: "Tenant & Property Information",
          description: "Enter details about the tenant and property",
          fields: [
            { name: "tenantName", label: "Tenant Full Name", type: "text", required: true },
            { name: "propertyAddress", label: "Rental Property Address", type: "text", required: true },
            { name: "leaseStartDate", label: "Lease Start Date", type: "date", required: true },
            { name: "leaseEndDate", label: "Lease End Date", type: "date", required: true },
            { name: "rentAmount", label: "Monthly Rent Amount", type: "text", required: true },
            { name: "rentDueDate", label: "Rent Due Date", type: "text", required: true },
            { name: "noticePeriod", label: "Notice Period", type: "text", required: true },
          ],
        },
        {
          name: "evictionDetails",
          title: "Eviction Details",
          description: "Provide information about the reason for eviction",
          fields: [
            { name: "evictionReason", label: "Detailed Reason for Eviction", type: "textarea", required: true },
          ],
        }
      ];
    case "wage-theft":
      return [
        ...baseFields,
        {
          name: "employerDetails",
          title: "Employer Information",
          description: "Enter details about your employer",
          fields: [
            { name: "employerName", label: "Employer/Company Name", type: "text", required: true },
            { name: "employerAddress", label: "Employer Address", type: "text", required: true },
            { name: "employmentStartDate", label: "Employment Start Date", type: "date", required: true },
            { name: "employmentEndDate", label: "Employment End Date (if applicable)", type: "date", required: false },
            { name: "unpaidAmount", label: "Total Unpaid Amount", type: "text", required: true },
          ],
        },
        {
          name: "claimDetails",
          title: "Wage Claim Details",
          description: "Provide information about your wage claim",
          fields: [
            { name: "workDescription", label: "Description of Work Performed", type: "textarea", required: true },
            { name: "paymentAgreement", label: "Payment Agreement Details", type: "textarea", required: true },
            { name: "violationDetails", label: "Wage Violation Details", type: "textarea", required: true },
          ],
        }
      ];
    case "employment-discrimination":
      return [
        ...baseFields,
        {
          name: "employerDetails",
          title: "Employer Information",
          description: "Enter details about your employer",
          fields: [
            { name: "employerName", label: "Employer/Company Name", type: "text", required: true },
            { name: "employerAddress", label: "Employer Address", type: "text", required: true },
            { name: "employmentStartDate", label: "Employment Start Date", type: "date", required: true },
            { name: "employmentEndDate", label: "Employment End Date (if applicable)", type: "date", required: false },
            { name: "discriminationType", label: "Type of Discrimination", type: "text", required: true },
          ],
        },
        {
          name: "discriminationDetails",
          title: "Discrimination Details",
          description: "Provide information about the discrimination",
          fields: [
            { name: "incidentDate", label: "Date of Discrimination Incident(s)", type: "date", required: true },
            { name: "discriminationDetails", label: "Detailed Description of Discrimination", type: "textarea", required: true },
            { name: "witnessNames", label: "Witness Names (if any)", type: "text", required: false },
            { name: "remedieSought", label: "Remedies Being Sought", type: "textarea", required: true },
          ],
        }
      ];
    case "contract-dispute":
      return [
        ...baseFields,
        {
          name: "contractDetails",
          title: "Contract Information",
          description: "Enter details about the contract and other party",
          fields: [
            { name: "otherPartyName", label: "Other Party Name", type: "text", required: true },
            { name: "otherPartyAddress", label: "Other Party Address", type: "text", required: true },
            { name: "contractDate", label: "Contract Date", type: "date", required: true },
            { name: "contractDescription", label: "Contract Description", type: "textarea", required: true },
          ],
        },
        {
          name: "disputeDetails",
          title: "Dispute Details",
          description: "Provide information about the contract dispute",
          fields: [
            { name: "breachDescription", label: "Description of Contract Breach", type: "textarea", required: true },
            { name: "damagesAmount", label: "Damages Amount", type: "text", required: true },
            { name: "resolutionRequested", label: "Requested Resolution", type: "textarea", required: true },
          ],
        }
      ];
    case "consumer-rights":
      return [
        ...baseFields,
        {
          name: "companyDetails",
          title: "Company Information",
          description: "Enter details about the company and purchase",
          fields: [
            { name: "companyName", label: "Company Name", type: "text", required: true },
            { name: "companyAddress", label: "Company Address", type: "text", required: true },
            { name: "purchaseDate", label: "Purchase Date", type: "date", required: true },
            { name: "productOrService", label: "Product or Service Description", type: "text", required: true },
            { name: "purchaseAmount", label: "Purchase Amount", type: "text", required: true },
          ],
        },
        {
          name: "complaintDetails",
          title: "Complaint Details",
          description: "Provide information about your consumer complaint",
          fields: [
            { name: "complaintDetails", label: "Detailed Description of Complaint", type: "textarea", required: true },
            { name: "resolutionAttempts", label: "Previous Resolution Attempts", type: "textarea", required: true },
            { name: "requestedRemedy", label: "Requested Remedy", type: "textarea", required: true },
          ],
        }
      ];
    case "family-law":
      return [
        ...baseFields,
        {
          name: "familyDetails",
          title: "Family Relationship Information",
          description: "Enter details about the family relationship",
          fields: [
            { name: "spouseName", label: "Spouse/Other Party Name", type: "text", required: true },
            { name: "relationshipType", label: "Relationship Type", type: "text", required: true },
            { name: "marriageDate", label: "Marriage Date (if applicable)", type: "date", required: false },
            { name: "separationDate", label: "Separation Date (if applicable)", type: "date", required: false },
            { name: "childrenNames", label: "Names and Ages of Children (if applicable)", type: "text", required: false },
          ],
        },
        {
          name: "petitionDetails",
          title: "Petition Details",
          description: "Provide information about your family law petition",
          fields: [
            { name: "petitionType", label: "Type of Petition", type: "text", required: true },
            { name: "petitionDetails", label: "Detailed Description of Petition", type: "textarea", required: true },
            { name: "requestedRelief", label: "Requested Relief", type: "textarea", required: true },
          ],
        }
      ];
    case "immigration-petition":
      return [
        ...baseFields,
        {
          name: "immigrationDetails",
          title: "Immigration Information",
          description: "Enter details about your immigration status",
          fields: [
            { name: "countryOfOrigin", label: "Country of Origin", type: "text", required: true },
            { name: "immigrationStatus", label: "Current Immigration Status", type: "text", required: true },
            { name: "entryDate", label: "Date of Entry to Country", type: "date", required: true },
            { name: "petitionType", label: "Type of Immigration Petition", type: "text", required: true },
          ],
        },
        {
          name: "petitionDetails",
          title: "Petition Details",
          description: "Provide information about your immigration petition",
          fields: [
            { name: "sponsorName", label: "Sponsor Name (if applicable)", type: "text", required: false },
            { name: "sponsorRelationship", label: "Relationship to Sponsor", type: "text", required: false },
            { name: "caseNumber", label: "Previous Case Number (if applicable)", type: "text", required: false },
            { name: "petitionDetails", label: "Detailed Description of Petition", type: "textarea", required: true },
          ],
        }
      ];
    default:
      return baseFields;
  }
};
