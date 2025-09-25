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
    certificateAvatarUrl: string | null;
    issuer: string;
    issueDate: string;
  };

  type BannerData = {
    id: string;
    name: string;
    phoneNumber: string;
    email: string;
    location: string;
    education: string;
  };
}
