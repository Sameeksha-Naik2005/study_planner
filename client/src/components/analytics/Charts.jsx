import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { getSubjectComparison, getWeeklySeries } from '../../utils/analytics.js';
import { getSubjectProgress } from '../../utils/progress.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LinearScale, LineElement, PointElement, Tooltip);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#64748b' } } },
  scales: {
    x: { ticks: { color: '#64748b' }, grid: { display: false } },
    y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(100,116,139,0.15)' } }
  }
};

export function WeeklyLineChart({ sessions }) {
  const series = getWeeklySeries(sessions);
  return (
    <div className="panel h-80">
      <h3 className="mb-4 text-lg font-black">Weekly consistency</h3>
      <Line
        options={options}
        data={{
          labels: series.map((point) => point.date.slice(5)),
          datasets: [{ label: 'Study hours', data: series.map((point) => point.hours), borderColor: '#2563EB', backgroundColor: '#2563EB', tension: 0.35 }]
        }}
      />
    </div>
  );
}

export function SubjectDoughnut({ subjects, tasks }) {
  return (
    <div className="panel h-80">
      <h3 className="mb-4 text-lg font-black">Subject completion</h3>
      <Doughnut
        data={{
          labels: subjects.map((subject) => subject.name),
          datasets: [{ data: subjects.map((subject) => getSubjectProgress(subject, tasks)), backgroundColor: subjects.map((subject) => subject.color) }]
        }}
      />
    </div>
  );
}

export function SubjectBarChart({ subjects, tasks }) {
  const comparison = getSubjectComparison(subjects, tasks);
  return (
    <div className="panel h-80">
      <h3 className="mb-4 text-lg font-black">Progress vs priority</h3>
      <Bar
        options={options}
        data={{
          labels: comparison.map((item) => item.name),
          datasets: [
            { label: 'Progress', data: comparison.map((item) => item.progress), backgroundColor: '#20C997' },
            { label: 'Priority', data: comparison.map((item) => item.priority), backgroundColor: '#F9735B' }
          ]
        }}
      />
    </div>
  );
}
