
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const generateEvictionNotice = (data: any): string => {
  const currentDate = formatDate(new Date().toISOString());
  
  return `
    <div class="document">
      <div class="header">
        <h1>NOTICE OF EVICTION</h1>
        <p class="date">${currentDate}</p>
      </div>
      
      <div class="address-block">
        <p><strong>To:</strong> ${data.tenantName}</p>
        <p><strong>Property Address:</strong> ${data.propertyAddress}</p>
      </div>
      
      <div class="content">
        <p>Dear ${data.tenantName},</p>
        
        <p>This letter constitutes formal notice that your tenancy at ${data.propertyAddress} will be terminated in ${data.noticePeriod} from the date of this notice. This action is being taken based on the following grounds:</p>
        
        <p class="indented">${data.evictionReason}</p>
        
        <p>According to our records:</p>
        <ul>
          <li>Your lease began on: ${formatDate(data.leaseStartDate)}</li>
          <li>Your lease is set to expire on: ${formatDate(data.leaseEndDate)}</li>
          <li>Monthly rent amount: $${data.rentAmount}</li>
          <li>Rent due date: ${data.rentDueDate} of each month</li>
        </ul>
        
        <p>Please note that this eviction notice is being served in accordance with applicable landlord-tenant laws. You have certain rights under the law, including the right to dispute this eviction through proper legal channels.</p>
        
        <p>You are required to vacate the premises and remove all belongings by the end of the notice period. Failure to do so may result in legal proceedings against you to recover possession of the property and any additional costs incurred.</p>
        
        <p>If you have any questions regarding this notice, please contact me at the information provided below.</p>
        
        <div class="signature">
          <p>Sincerely,</p>
          <p>${data.fullName}</p>
          <p>Phone: ${data.phoneNumber}</p>
          <p>Email: ${data.email}</p>
          <p>Address: ${data.address}, ${data.city}, ${data.state} ${data.zipCode}</p>
        </div>
      </div>
    </div>
  `;
};

export const generateWageTheftComplaint = (data: any): string => {
  const currentDate = formatDate(new Date().toISOString());
  
  return `
    <div class="document">
      <div class="header">
        <h1>WAGE THEFT COMPLAINT</h1>
        <p class="date">${currentDate}</p>
      </div>
      
      <div class="address-block">
        <p><strong>From:</strong> ${data.fullName}</p>
        <p>${data.address}, ${data.city}, ${data.state} ${data.zipCode}</p>
        <p>Phone: ${data.phoneNumber} | Email: ${data.email}</p>
        <br />
        <p><strong>To:</strong> ${data.employerName}</p>
        <p>${data.employerAddress}</p>
      </div>
      
      <div class="content">
        <h2>NOTICE OF WAGE THEFT COMPLAINT</h2>
        
        <p>I, ${data.fullName}, am writing to formally complain about unpaid wages owed to me for work performed while employed at ${data.employerName}.</p>
        
        <h3>Employment Details:</h3>
        <ul>
          <li>Employment start date: ${formatDate(data.employmentStartDate)}</li>
          ${data.employmentEndDate ? `<li>Employment end date: ${formatDate(data.employmentEndDate)}</li>` : ''}
          <li>Total unpaid amount: $${data.unpaidAmount}</li>
        </ul>
        
        <h3>Description of Work Performed:</h3>
        <p>${data.workDescription}</p>
        
        <h3>Payment Agreement:</h3>
        <p>${data.paymentAgreement}</p>
        
        <h3>Wage Violation Details:</h3>
        <p>${data.violationDetails}</p>
        
        <p>Under applicable labor laws, I am entitled to receive complete and timely payment for all work performed. I request that you remedy this situation by providing full payment of the unpaid wages in the amount of $${data.unpaidAmount} within 14 days of receiving this notice.</p>
        
        <p>If this matter is not resolved within the specified timeframe, I intend to pursue all available legal remedies, including but not limited to filing a formal complaint with the appropriate labor authorities and seeking any applicable penalties, interest, and legal fees as provided by law.</p>
        
        <p>Please direct all communication regarding this matter to me using the contact information provided above.</p>
        
        <div class="signature">
          <p>Sincerely,</p>
          <p>${data.fullName}</p>
          <p>Date: ${currentDate}</p>
        </div>
      </div>
    </div>
  `;
};

export const generateEmploymentDiscrimination = (data: any): string => {
  const currentDate = formatDate(new Date().toISOString());
  
  return `
    <div class="document">
      <div class="header">
        <h1>EMPLOYMENT DISCRIMINATION COMPLAINT</h1>
        <p class="date">${currentDate}</p>
      </div>
      
      <div class="address-block">
        <p><strong>From:</strong> ${data.fullName}</p>
        <p>${data.address}, ${data.city}, ${data.state} ${data.zipCode}</p>
        <p>Phone: ${data.phoneNumber} | Email: ${data.email}</p>
        <p>Date of Birth: ${formatDate(data.dateOfBirth)}</p>
        <br />
        <p><strong>To:</strong> ${data.employerName}</p>
        <p>${data.employerAddress}</p>
      </div>
      
      <div class="content">
        <h2>FORMAL COMPLAINT OF DISCRIMINATION</h2>
        
        <p>I, ${data.fullName}, am writing to formally complain about workplace discrimination that I have experienced while employed at ${data.employerName}.</p>
        
        <h3>Employment Details:</h3>
        <ul>
          <li>Employment start date: ${formatDate(data.employmentStartDate)}</li>
          ${data.employmentEndDate ? `<li>Employment end date: ${formatDate(data.employmentEndDate)}</li>` : ''}
          <li>Type of discrimination: ${data.discriminationType}</li>
          <li>Date(s) of discriminatory incident(s): ${formatDate(data.incidentDate)}</li>
        </ul>
        
        <h3>Detailed Description of Discrimination:</h3>
        <p>${data.discriminationDetails}</p>
        
        ${data.witnessNames ? `
        <h3>Witnesses:</h3>
        <p>${data.witnessNames}</p>
        ` : ''}
        
        <h3>Remedies Sought:</h3>
        <p>${data.remedieSought}</p>
        
        <p>This discrimination violates federal and state anti-discrimination laws, including Title VII of the Civil Rights Act of 1964, the Americans with Disabilities Act, the Age Discrimination in Employment Act, and/or applicable state laws.</p>
        
        <p>I request that you investigate this matter promptly and provide a written response to my complaint within 14 days. If this matter is not addressed appropriately, I reserve the right to file a complaint with the Equal Employment Opportunity Commission (EEOC) and/or state civil rights agency, and to pursue all available legal remedies.</p>
        
        <p>Please direct all communication regarding this matter to me using the contact information provided above.</p>
        
        <div class="signature">
          <p>Sincerely,</p>
          <p>${data.fullName}</p>
          <p>Date: ${currentDate}</p>
        </div>
      </div>
    </div>
  `;
};

export const generateContractDispute = (data: any): string => {
  const currentDate = formatDate(new Date().toISOString());
  
  return `
    <div class="document">
      <div class="header">
        <h1>CONTRACT DISPUTE NOTICE</h1>
        <p class="date">${currentDate}</p>
      </div>
      
      <div class="address-block">
        <p><strong>From:</strong> ${data.fullName}</p>
        <p>${data.address}, ${data.city}, ${data.state} ${data.zipCode}</p>
        <p>Phone: ${data.phoneNumber} | Email: ${data.email}</p>
        <br />
        <p><strong>To:</strong> ${data.otherPartyName}</p>
        <p>${data.otherPartyAddress}</p>
      </div>
      
      <div class="content">
        <h2>RE: Notice of Contract Breach and Demand for Resolution</h2>
        
        <p>Dear ${data.otherPartyName},</p>
        
        <p>I am writing to formally notify you of a breach of contract between us dated ${formatDate(data.contractDate)}. This letter serves as formal notice of this breach and a demand for resolution.</p>
        
        <h3>Contract Details:</h3>
        <p>${data.contractDescription}</p>
        
        <h3>Description of Breach:</h3>
        <p>${data.breachDescription}</p>
        
        <h3>Damages:</h3>
        <p>As a result of this breach, I have suffered damages in the amount of $${data.damagesAmount}.</p>
        
        <h3>Requested Resolution:</h3>
        <p>${data.resolutionRequested}</p>
        
        <p>I request that you remedy this breach within 30 days of receiving this notice by providing the resolution outlined above. If this matter is not resolved within the specified timeframe, I will have no choice but to pursue all available legal remedies, including but not limited to filing a lawsuit for breach of contract, specific performance, and/or damages, as well as seeking recovery of any attorney's fees and court costs as permitted by law or our contract.</p>
        
        <p>I hope we can resolve this matter amicably. Please contact me at your earliest convenience to discuss a resolution to this dispute.</p>
        
        <div class="signature">
          <p>Sincerely,</p>
          <p>${data.fullName}</p>
          <p>Date: ${currentDate}</p>
        </div>
      </div>
    </div>
  `;
};

export const generateConsumerRights = (data: any): string => {
  const currentDate = formatDate(new Date().toISOString());
  
  return `
    <div class="document">
      <div class="header">
        <h1>CONSUMER COMPLAINT LETTER</h1>
        <p class="date">${currentDate}</p>
      </div>
      
      <div class="address-block">
        <p><strong>From:</strong> ${data.fullName}</p>
        <p>${data.address}, ${data.city}, ${data.state} ${data.zipCode}</p>
        <p>Phone: ${data.phoneNumber} | Email: ${data.email}</p>
        <br />
        <p><strong>To:</strong> ${data.companyName}</p>
        <p>${data.companyAddress}</p>
      </div>
      
      <div class="content">
        <h2>RE: Consumer Complaint and Request for Resolution</h2>
        
        <p>Dear ${data.companyName} Customer Service Department,</p>
        
        <p>I am writing to file a formal complaint regarding a product/service I purchased from your company.</p>
        
        <h3>Purchase Details:</h3>
        <ul>
          <li>Product/Service: ${data.productOrService}</li>
          <li>Purchase Date: ${formatDate(data.purchaseDate)}</li>
          <li>Purchase Amount: $${data.purchaseAmount}</li>
        </ul>
        
        <h3>Complaint Details:</h3>
        <p>${data.complaintDetails}</p>
        
        <h3>Previous Resolution Attempts:</h3>
        <p>${data.resolutionAttempts}</p>
        
        <h3>Requested Remedy:</h3>
        <p>${data.requestedRemedy}</p>
        
        <p>Under consumer protection laws, I am entitled to products and services that meet reasonable quality standards and conform to the representations made by your company. I request that you address this issue promptly by providing the remedy outlined above within 14 days of receiving this complaint.</p>
        
        <p>If this matter is not resolved satisfactorily within the specified timeframe, I may file complaints with the appropriate consumer protection agencies, including the Federal Trade Commission, the Consumer Financial Protection Bureau, my state's attorney general's office, and/or the Better Business Bureau. I also reserve the right to pursue all available legal remedies.</p>
        
        <p>I hope to resolve this matter amicably and look forward to your prompt response. Please contact me using the information provided above.</p>
        
        <div class="signature">
          <p>Sincerely,</p>
          <p>${data.fullName}</p>
          <p>Date: ${currentDate}</p>
        </div>
      </div>
    </div>
  `;
};

export const generateFamilyLaw = (data: any): string => {
  const currentDate = formatDate(new Date().toISOString());
  
  return `
    <div class="document">
      <div class="header">
        <h1>FAMILY LAW PETITION</h1>
        <p class="date">${currentDate}</p>
      </div>
      
      <div class="address-block">
        <p><strong>Petitioner:</strong> ${data.fullName}</p>
        <p>${data.address}, ${data.city}, ${data.state} ${data.zipCode}</p>
        <p>Phone: ${data.phoneNumber} | Email: ${data.email}</p>
        <p>Date of Birth: ${formatDate(data.dateOfBirth)}</p>
        <br />
        <p><strong>Respondent:</strong> ${data.spouseName}</p>
      </div>
      
      <div class="content">
        <h2>PETITION FOR ${data.petitionType.toUpperCase()}</h2>
        
        <p>I, ${data.fullName}, am filing this petition for ${data.petitionType} in relation to ${data.spouseName}.</p>
        
        <h3>Relationship Details:</h3>
        <ul>
          <li>Relationship: ${data.relationshipType}</li>
          ${data.marriageDate ? `<li>Date of Marriage: ${formatDate(data.marriageDate)}</li>` : ''}
          ${data.separationDate ? `<li>Date of Separation: ${formatDate(data.separationDate)}</li>` : ''}
          ${data.childrenNames ? `<li>Children: ${data.childrenNames}</li>` : ''}
        </ul>
        
        <h3>Petition Details:</h3>
        <p>${data.petitionDetails}</p>
        
        <h3>Requested Relief:</h3>
        <p>${data.requestedRelief}</p>
        
        <p>I declare under penalty of perjury that the foregoing statements are true and correct to the best of my knowledge.</p>
        
        <div class="signature">
          <p>Respectfully submitted,</p>
          <p>${data.fullName}</p>
          <p>Date: ${currentDate}</p>
        </div>
      </div>
    </div>
  `;
};

export const generateImmigrationPetition = (data: any): string => {
  const currentDate = formatDate(new Date().toISOString());
  
  return `
    <div class="document">
      <div class="header">
        <h1>IMMIGRATION PETITION</h1>
        <p class="date">${currentDate}</p>
      </div>
      
      <div class="address-block">
        <p><strong>Petitioner:</strong> ${data.fullName}</p>
        <p>${data.address}, ${data.city}, ${data.state} ${data.zipCode}</p>
        <p>Phone: ${data.phoneNumber} | Email: ${data.email}</p>
        <p>Date of Birth: ${formatDate(data.dateOfBirth)}</p>
      </div>
      
      <div class="content">
        <h2>PETITION FOR ${data.petitionType.toUpperCase()}</h2>
        
        <h3>Petitioner Information:</h3>
        <ul>
          <li>Country of Origin: ${data.countryOfOrigin}</li>
          <li>Current Immigration Status: ${data.immigrationStatus}</li>
          <li>Date of Entry: ${formatDate(data.entryDate)}</li>
          <li>Type of Petition: ${data.petitionType}</li>
          ${data.sponsorName ? `<li>Sponsor Name: ${data.sponsorName}</li>` : ''}
          ${data.sponsorRelationship ? `<li>Relationship to Sponsor: ${data.sponsorRelationship}</li>` : ''}
          ${data.caseNumber ? `<li>Previous Case Number (if applicable): ${data.caseNumber}</li>` : ''}
        </ul>
        
        <h3>Petition Details:</h3>
        <p>${data.petitionDetails}</p>
        
        <p>I declare under penalty of perjury under the laws of the United States of America that the foregoing is true and correct.</p>
        
        <div class="signature">
          <p>Respectfully submitted,</p>
          <p>${data.fullName}</p>
          <p>Date: ${currentDate}</p>
        </div>
      </div>
    </div>
  `;
};

export const generateDocumentByCategory = (category: string, data: any): string => {
  switch (category) {
    case "eviction-notice":
      return generateEvictionNotice(data);
    case "wage-theft":
      return generateWageTheftComplaint(data);
    case "employment-discrimination":
      return generateEmploymentDiscrimination(data);
    case "contract-dispute":
      return generateContractDispute(data);
    case "consumer-rights":
      return generateConsumerRights(data);
    case "family-law":
      return generateFamilyLaw(data);
    case "immigration-petition":
      return generateImmigrationPetition(data);
    default:
      return "<p>No template available for this category.</p>";
  }
};
