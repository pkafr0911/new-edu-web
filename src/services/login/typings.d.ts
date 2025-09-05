// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    avatar?: string;
    token?: string;
  } & UserModule.Response;

  type LoginResult = {
    token: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    email?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type UserRequest = {
    fullName: string; // user's full name (First + Last)
    dob: string; // date of birth, ISO format (YYYY-MM-DD) recommended
    location: string; // user's location

    student?: {
      intern?: {
        university: string;
        degree: string;
        major: string;
      };
      experienced?: {
        companyName: string;
        position: string;
        jobType: 'FULLTIME' | 'PARTTIME';
        location: string;
      };
      interestedTopics: string[]; // list of interested topics
    };

    company?: {
      companyName: string;
      location: string;
      typeOfBusiness: string;
      purpose: string; // purpose of using Edu Platform
      position: string; // user's position in company
      hasExperiencedWorkWithStudentBefore: boolean;
    };
  };
}
