declare namespace CompanyModule {
  type Job = {
    id: number;
    jobTitle: string;
    companyName: string;
    salary: string;
    jobType: string;
    timeLeft: string;
    location: string;
  };

  type Introduction = {
    id: string;
    workingHours: string;
    companyScale: string;
    location: string;
    industry: string;
  };

  type Description = {
    id: string;
    shortDescription: string; // HTML string
    longDescription: string; // HTML string
  };

  type Banner = {
    id: string;
    name: string;
    location: string;
    website: string;
    avatar: string; // image URL or base64
    socialMedialUrl: string; // typo? maybe should be `socialMediaUrl`
    openingJobs: number;
  };
}
