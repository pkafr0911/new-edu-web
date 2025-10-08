declare namespace StudentModule {
  type StudentSkillsData = {
    id: string | null;
    skills: string[];
  };

  type JobBannerData = {
    appliedJobs: number;
    savedJobs: number;
    completedJobs: number;
    rating: number;
  };

  type ExpectedJobsData = {
    id: string;
    expectedSalary: string;
    expectedJobType: string;
    expectedLocation: string;
    industry: string;
    level: string;
    isNeedMentor: boolean;
  };

  type EducationItem = {
    id: number;
    universityName: string;
    universityAvatarUrl: string | null;
    division: string;
    gpa: number;
    startTime: string;
    endTime: string;
  };

  type DescriptionData = {
    description: string;
  };

  type CertificateItem = {
    id: number;
    certificateName: string;
    issuer: string;
    issueDate?: string | null;
    expirationDate?: string | null;
    certificateAvatarUrl?: string | null;
  };

  type BannerData = {
    id: string;
    name: string;
    phoneNumber: string;
    email: string;
    location: string;
    education: string;
    avatarUrl?: string;
  };

  type ExperienceItem = {
    id: number;
    companyName: string;
    title: string;
    jobType: string;
    startDate: string;
    endDate: string | null;
    companyAvatarUrl: string | null;
    description: string;
    createdDate?: string | null;
    updatedDate?: string | null;
  };

  type LanguageItem = {
    id: number;
    language: string;
    level: string;
  };

  // 🔹 Full student detail (expanded profile)
  type StudentDetail = {
    id?: string;
    name: string;
    avatarUrl?: string;
    phoneNumber: string;
    location: string;
    email: string;
    education: string;
    firstName?: string;
    lastName?: string;
    description?: string;
    experiences?: ExperienceItem[];
    educations?: EducationItem[];
    languages?: LanguageItem[];
    certificates?: CertificateItem[];
    expectedJobs?: string[]; // just strings in nested structure
  };

  // 🔹 Top-level Student profile response
  type StudentProfileResponse = {
    name: string;
    avatarUrl: string;
    phoneNumber: string;
    location: string;
    email: string;
    education: string;
    firstName: string;
    lastName: string;
    description: string;
    expectedJobs: ExpectedJobItem[];
    _links?: Record<
      string,
      {
        href: string;
        hreflang?: string;
        title?: string;
        type?: string;
        deprecation?: string;
        profile?: string;
        name?: string;
        templated?: boolean;
      }
    >;
  };
}
