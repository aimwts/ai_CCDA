import axios from "axios";

const API_BASE = "http://localhost:3000";

export const api = {
  getMachineData: () => axios.get(`${API_BASE}/sensors/machine`),
  getSenseHatData: () => axios.get(`${API_BASE}/sensors/sensehat`),
  getAggregateSensors: () => axios.get(`${API_BASE}/aggregate/sensors`),
  getAggregateStatus: () => axios.get(`${API_BASE}/aggregate/status`),
  getSystemStatus: () => axios.get(`${API_BASE}/system/status`),
  getZones: () => axios.get(`${API_BASE}/zones`),
  getZoneById: (id: string) => axios.get(`${API_BASE}/zones/${id}`),
  getHistory: (sensor: string, hours: number) =>
    axios.get(`${API_BASE}/history/${sensor}?hours=${hours}`)
};
