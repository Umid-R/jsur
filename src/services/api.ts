const API_BASE_URL = 'https://fast-api-p3ci.onrender.com';

export interface QazaTotal {
  total_qazas: number;
}

export interface QazaBreakdown {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface PrayerStats {
  completed_today: number;
  daily_goal: number;
  cleared_this_week: number;
  total_prayers_logged: number;
  current_streak: number;
}

export interface WeeklyActivity {
  day: string;
  active: boolean;
}

export interface MonthSummary {
  ada_prayers: number;
  missed: number;
  qaza_done: number;
  most_missed_prayer: string;
  most_common_reason: string;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
};

export const api = {
  async getTotalQaza(userId: number): Promise<QazaTotal> {
    const response = await fetch(`${API_BASE_URL}/qaza/total/${userId}`);
    return handleResponse(response);
  },

  async getQazaBreakdown(userId: number): Promise<QazaBreakdown> {
    const response = await fetch(`${API_BASE_URL}/qaza/breakdown/${userId}`);
    return handleResponse(response);
  },

  async getPrayerStats(userId: number): Promise<PrayerStats> {
    const response = await fetch(`${API_BASE_URL}/stats/${userId}`);
    return handleResponse(response);
  },

  async getWeeklyActivity(userId: number): Promise<WeeklyActivity[]> {
    const response = await fetch(`${API_BASE_URL}/activity/weekly/${userId}`);
    return handleResponse(response);
  },

  async getMonthSummary(userId: number, year: number, month: number): Promise<MonthSummary> {
    const response = await fetch(`${API_BASE_URL}/calendar/summary/${userId}?year=${year}&month=${month}`);
    return handleResponse(response);
  },

  async logAdaPrayer(userId: number, data: any) {
    const response = await fetch(`${API_BASE_URL}/log/ada`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, ...data }),
    });
    return handleResponse(response);
  },

  async logQazaPrayer(userId: number, data: any) {
    const response = await fetch(`${API_BASE_URL}/log/qaza`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, ...data }),
    });
    return handleResponse(response);
  },
};
