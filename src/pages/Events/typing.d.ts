declare namespace EventsModule {
  type Response = {
    id: string;
    name: string;
    description: string;
    created_at: number;
    created_by: string;
    last_updated_at?: number;
    last_updated_by?: string;
    is_deleted: boolean;
    deleted_at?: number;
    deleted_by?: string;
    active: boolean;
    start_time: number;
    end_time: number;
    room_count: number;
    total_guest: number;
    checked_guest: number;
  };

  type Request = {
    id?: string;
    name: string;
    description: string;
    active: boolean;
    start_time: number;
    end_time: number;
  };

  type AccessRequest = {
    key: string;
    description?: string;
    value: string;
  };
  type AccessResponse = {
    summit_id: string;
    summit_name: string;
    created_at: number;
    created_by: string;
    last_updated_at?: number;
    last_updated_by?: string;
    active: boolean;
  } & AccessRequest;
}
