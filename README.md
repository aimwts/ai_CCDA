
---

# **AI CC/DA Monitoring System**  
A full‑stack, real‑time monitoring and analytics platform integrating machine/plant sensors, SenseHat telemetry, Python microservices, WebSockets, AI analytics, and a modern React dashboard.

---

## **📦 Project Overview**

This system provides:

- Real‑time sensor monitoring (Machine/Plant + SenseHat + Arduino + IMU)
- Historical analytics with zoomable charts
- AI‑powered trend explanations and recommendations
- System health monitoring (backend, Python services, SWIM, Arduino)
- Multi‑sensor aggregation dashboard
- Modular Python microservices for hardware integration
- Modern UI built with React, Vite, Tailwind, Shadcn, and Recharts
- WebSocket‑based live updates
- PostgreSQL‑backed historical storage

The architecture is designed for clarity, modularity, and production scalability.

---

## **🧱 Tech Stack**

### **Frontend**
- React + TypeScript  
- Vite  
- TailwindCSS  
- Shadcn UI  
- Recharts  
- WebSockets  

### **Backend**
- Node.js + Express  
- TypeScript  
- WebSocket server  
- PostgreSQL  
- AI analytics modules (anomaly detection, prediction, recommendations)

### **Hardware Services**
- Python microservices for:
  - Machine/Plant sensors  
  - SenseHat  
  - Arduino bridge  
  - IMU  
  - LED matrix  

### **Database**
- PostgreSQL  
- `sensor_history` table for historical analytics  

---

## **📁 Project Structure**

```
ai-cc-da/
  backend/
    src/
      analytics/
      routes/
      services/
      websocket/
      db/
      index.ts
      AppOrchestrator.ts

  frontend/
    src/
      components/
        ui/          ← custom dashboard UI
        shadcn/      ← Shadcn primitives
        Layout/
      hooks/
      pages/
      api/
      main.tsx
      App.tsx

  hardware/
    envSensorService/
    arduinoBridge/
    imuService/
    ledMatrixService/

  docker-compose.yml
```

---

## **🚀 Getting Started**

### **1. Clone the repository**

```bash
git clone <your-repo-url>
cd ai-cc-da
```

---

## **2. Start PostgreSQL**

If using Docker:

```bash
docker-compose up -d db
```

Create the history table:

```sql
CREATE TABLE sensor_history (
  id SERIAL PRIMARY KEY,
  sensor VARCHAR(50),
  value DOUBLE PRECISION,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## **3. Start the Backend**

```bash
cd backend
npm install
npm run dev
```

Backend runs at:

```
http://localhost:3000
ws://localhost:4000
```

---

## **4. Start the Frontend**

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## **5. Start Python Hardware Services**

Each service runs independently:

```bash
cd hardware/envSensorService
python3 main.py
```

Repeat for:

- `arduinoBridge`
- `imuService`
- `ledMatrixService`

---

## **📡 Real‑Time WebSocket Channels**

| Channel | Purpose |
|--------|---------|
| `plant` | Machine/Plant sensor updates |
| `sensehat` | SenseHat telemetry |
| `aggregate` | Combined sensor stream |
| `system` | System health + uptime |
| `zones` | Zone‑based plant grouping |

Authentication uses a simple token:

```
?token=my-secret-token
```

---

## **📊 Historical Analytics**

The backend stores all readings in PostgreSQL and exposes:

```
GET /history/:sensor?hours=24
```

The frontend displays:

- zoomable line charts  
- multi‑series overlays  
- AI explanations  
- anomaly markers  

---

## **🧠 AI Analytics Engine**

The backend includes:

- **AnomalyDetector** (z‑score based)
- **Predictor** (simple slope projection)
- **RecommendationEngine** (domain‑specific advice)
- **LLMExplain** (trend summaries)

These run automatically on every sensor update.

---

## **🖥️ Frontend Pages**

| Page | Purpose |
|------|---------|
| Home | Overview |
| Machine/Plant Monitor | Moisture, light, temperature, live charts |
| SenseHat Monitor | Temp, humidity, pressure, IMU, joystick |
| Aggregate Dashboard | Combined sensor view |
| System Monitor | Service health + metrics |
| Zones | Machine/Plant grouping |
| History | Historical analytics + charts |

---

## **🧩 UI Component Architecture**

### **Custom Dashboard UI (`components/ui/`)**
- SensorCard  
- StatusCard  
- MiniChart  
- LiveChart  
- IMUOrientation  
- JoystickIndicator  
- MetricCard  
- HealthIndicator  
- HistoricalChart  

### **Shadcn Primitives (`components/shadcn/`)**
- button  
- card  
- input  
- label  
- select  
- textarea  
- dialog  
- dropdown-menu  
- separator  
- tabs  

---

## **🐳 Docker Support**

The project includes a `docker-compose.yml` that can orchestrate:

- backend  
- frontend  
- database  
- python services  

You can start everything with:

```bash
docker-compose up --build
```

---

## **📌 Environment Variables**

Backend:

```
DATABASE_URL=postgres://user:pass@localhost:5432/ccda
WS_TOKEN=my-secret-token
```

Frontend:

```
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:4000
```

---

## **📈 Roadmap**

- User accounts + roles  
- Multi‑zone analytics  
- Predictive watering model  
- Mobile‑optimized UI  
- Alerts + notifications  
- Export to CSV/PDF  

---

## **📄 License**

MIT License (or your preferred license)

---

