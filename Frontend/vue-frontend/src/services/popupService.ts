import session from './api';

export interface Popup {
  user: string; 
  scenario: number;
  date_triggered: string; 
  status: string; 
  reaction_time?: number;
  created_at: string; 
}

export interface PopupToday{
  show: boolean;
  scenario: Popup | null;
}
export interface PopupLogStatistics {
  security_score: number;
  popup_count: number;
  total_clicks: number;
  total_closed: number;
  logs: Popup[];
}

export interface PopupTotals {
  total_popups_sent: number;
  total_risky_clicks: number;
  total_safe_closes: number;
  overall_risk_rate: number; // percent
}

const END_POINT = "/api/popup/";

const popupService = {
  get_today: (): Promise<PopupToday> =>
    session.get(END_POINT + 'today-popup/').then(res => res.data),
  get_pending_popups: (): Promise<Popup> =>
    session.get(END_POINT + 'popup-trigger-log/get_pending_popups/').then(res => res.data),
  mark_popup_as_seen: (popupId: number, status: string): Promise<Popup> =>
    session.post(END_POINT + 'popup-trigger-log/mark_popup_as_seen/', { scenario_id: popupId, status }).then(res => res.data),
  popup_trigger_log: (): Promise<Popup[]> =>
    session.get(END_POINT + 'popup-trigger-log/').then(res => res.data),
  popup_trigger_log_by_user: (): Promise<PopupLogStatistics> =>
    session.get(END_POINT + 'popup-trigger-log/get_popup_log_statistics/').then(res => res.data),
  get_totals: (): Promise<PopupTotals> =>
    session.get(END_POINT + 'popup-trigger-log/get_totals/').then(res => res.data),
};

export default popupService;