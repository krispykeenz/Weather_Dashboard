// DEMO MODE ONLY: This demo does not call any APIs.
// Remove the /demo folder when publishing a real deployment.

const CITIES = [
  {
    name: 'Cape Town',
    country: 'ZA',
    condition: 'Partly cloudy',
    tempC: 22,
    humidity: 61,
    windKph: 18,
    pressureHpa: 1016,
    trend: [18, 19, 20, 22, 21, 23, 22],
  },
  {
    name: 'Johannesburg',
    country: 'ZA',
    condition: 'Clear',
    tempC: 27,
    humidity: 42,
    windKph: 11,
    pressureHpa: 1012,
    trend: [24, 25, 26, 27, 28, 27, 27],
  },
  {
    name: 'London',
    country: 'GB',
    condition: 'Rain',
    tempC: 9,
    humidity: 88,
    windKph: 24,
    pressureHpa: 1004,
    trend: [10, 9, 8, 9, 11, 10, 9],
  },
];

const els = {
  citySelect: document.getElementById('citySelect'),
  tempNow: document.getElementById('tempNow'),
  conditionPill: document.getElementById('conditionPill'),
  humidityNow: document.getElementById('humidityNow'),
  windNow: document.getElementById('windNow'),
  pressureNow: document.getElementById('pressureNow'),
  chart: document.getElementById('trendChart'),
};

function renderCityOptions() {
  els.citySelect.innerHTML = '';
  for (let i = 0; i < CITIES.length; i++) {
    const c = CITIES[i];
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = `${c.name}, ${c.country}`;
    els.citySelect.appendChild(opt);
  }
}

function drawTrend(ctx, w, h, values) {
  ctx.clearRect(0, 0, w, h);

  // background grid
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(0, 0, w, h);

  const pad = 30;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);

  // grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad + (innerH * i) / 4;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(pad + innerW, y);
    ctx.stroke();
  }

  // axis labels
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '12px ui-sans-serif, system-ui';
  ctx.fillText(`${max}°C`, 8, pad + 12);
  ctx.fillText(`${min}°C`, 8, pad + innerH);

  // line
  ctx.strokeStyle = 'rgba(254, 202, 87, 0.95)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  values.forEach((v, idx) => {
    const x = pad + (innerW * idx) / (values.length - 1);
    const y = pad + innerH - ((v - min) / range) * innerH;
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // points
  ctx.fillStyle = 'rgba(255, 107, 107, 0.95)';
  values.forEach((v, idx) => {
    const x = pad + (innerW * idx) / (values.length - 1);
    const y = pad + innerH - ((v - min) / range) * innerH;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderCity(index) {
  const c = CITIES[index];
  els.tempNow.textContent = `${c.tempC}°C`;
  els.conditionPill.textContent = c.condition;
  els.humidityNow.textContent = `${c.humidity}%`;
  els.windNow.textContent = `${c.windKph} km/h`;
  els.pressureNow.textContent = `${c.pressureHpa} hPa`;

  const ctx = els.chart.getContext('2d');
  drawTrend(ctx, els.chart.width, els.chart.height, c.trend);
}

renderCityOptions();
els.citySelect.addEventListener('change', (e) => renderCity(Number(e.target.value)));
renderCity(0);
