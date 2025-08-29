declare namespace PublicModule {
  type CheckInRequest = {
    check_in_code?: StringToNumber;
    email?: string;
    summit_id?: string;
    room_id?: string;
  };

  type CheckInRespone = {
    is_first_time: boolean;
    check_in_code: string;
  };

  type CheckInInfo = {
    rooms: {
      id: string;
      name: string;
      active: boolean;
      summit_id: string;
      guest_id: string;
      checked_in: boolean;
      checked_in_at?: any;
      is_current: boolean;
    }[];
  } & GuestModule.Response;

  type FeedbackRequest = {
    content_rating: number;
    organization_rating: number;
    other_sharing: string;
    attended_previous_summit: boolean;
    it_invest_annually: number;
    it_problem: string;
    service_select: number[];
    service_order: string;
    topic_next_summit: string;
  } & CheckInRequest;
}
