import { GLOBAL_PREFIX } from '@/consants';
import { request } from '@umijs/max';

const target = '/students';
const prefix = GLOBAL_PREFIX + target;

/**
 * Fetch student's banner data (basic info)
 */
export const fetchStudentBanner = (id: string) =>
  request<Res<StudentModule.BannerData>>(prefix + `/${id}/banner`, {
    method: 'GET',
  }).then(({ data }) => data);

/**
 * Fetch student's skills
 */
export const fetchStudentSkills = (id: string) =>
  request<Res<StudentModule.StudentSkillsData>>(prefix + `/${id}/skills`, {
    method: 'GET',
  }).then(({ data }) => data);

/**
 * Fetch student's expected jobs preferences
 */
export const fetchStudentExpectedJobs = (id: string) =>
  request<Res<StudentModule.ExpectedJobsData>>(prefix + `/${id}/expectedJobs`, {
    method: 'GET',
  }).then(({ data }) => data);

/**
 * Fetch student's education history
 */
export const fetchStudentEducation = (
  id: string,
  { current = 1, pageSize = 5, ...rest }: { current?: number; pageSize?: number },
) =>
  request<Res<ResListData<StudentModule.EducationItem>>>(prefix + `/${id}/education`, {
    method: 'GET',
    params: {
      offset: current,
      limit: pageSize,
      ...rest,
    },
  }).then(({ data }) => ({
    data: data.content,
    total: data.totalElements,
  }));

/**
 * Fetch student's description/bio
 */
export const fetchStudentDescription = (id: string) =>
  request<Res<StudentModule.DescriptionData>>(prefix + `/${id}/description`, {
    method: 'GET',
  }).then(({ data }) => data);

/**
 * Fetch student's certificates
 */
export const fetchStudentCertificates = (id: string) =>
  request<Res<StudentModule.CertificateItem[]>>(prefix + `/${id}/certificate`, {
    method: 'GET',
  }).then(({ data }) => data);

/**
 * Fetch student's job banner stats (applied/saved/completed/rating)
 */
export const fetchStudentJobBanner = (id: string) =>
  request<Res<StudentModule.JobBannerData>>(prefix + `/${id}/jobbanner`, {
    method: 'GET',
  }).then(({ data }) => data);
