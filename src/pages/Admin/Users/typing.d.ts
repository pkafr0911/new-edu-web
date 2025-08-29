declare namespace UserModule {
  type Response = {
    id: string;
    full_name: string;
    created_at: number;
    created_by: string;
    last_updated_at?: number;
    last_updated_by?: string;
    is_deleted: boolean;
    deleted_at?: number;
    deleted_by?: string;
    username: string;
    password: string;
    email: string;
    phone_number: string;
    active: boolean;
    locked_to?: number;
    role_id: number;
    twofa_status: boolean;
    twofa_had_inactive: boolean;
    twofa_secret: string;
    twofa_url: string;
  };
  type Request = {
    full_name: string;
    username: string;
    password: string;
    email: string;
    phone_number: string;
    active: boolean;
    locked_to?: number;
    role_id: number;
    twofa_status?: boolean;
    twofa_had_inactive?: boolean;
    twofa_secret?: string;
    twofa_url?: string;
  };

  type ChangePasswordReq = {
    current_password?: string;
    new_password: string;
  };
}
