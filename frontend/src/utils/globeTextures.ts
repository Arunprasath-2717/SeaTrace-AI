// Globe texture utilities with offline procedural fallback textures

// Reliable CDN textures for NASA Blue Marble, Night Lights, and Topology
export const GLOBE_TEXTURES: Record<string, string> = {
  satellite: 'https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg',
  night: 'https://unpkg.com/three-globe@2.31.1/example/img/earth-night.jpg',
  dark: 'https://unpkg.com/three-globe@2.31.1/example/img/earth-dark.jpg',
  topology: 'https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png',
  bathymetric: 'https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png',
  bump: 'https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png',
  nightSky: 'https://unpkg.com/three-globe@2.31.1/example/img/night-sky.png',
};

/**
 * Creates an immediate procedural fallback Earth texture using HTML5 Canvas.
 * Generates dark indigo oceans, cyan atmospheric rim, continents, and geospatial grid.
 * Ensures the globe always displays instantly even before external textures load or in offline demo mode.
 */
export function createProceduralEarthTexture(): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Deep oceanic royal blue gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#060d1f'); // Polar deep royal navy
  oceanGrad.addColorStop(0.3, '#0a1d42');
  oceanGrad.addColorStop(0.5, '#0e2a5c'); // Equatorial rich royal blue
  oceanGrad.addColorStop(0.7, '#0a1d42');
  oceanGrad.addColorStop(1, '#060d1f');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Lat/Long subtle grid lines with Sea Green / Mint glow
  ctx.strokeStyle = 'rgba(20, 184, 166, 0.12)';
  ctx.lineWidth = 1;

  // Parallels (Latitude)
  for (let lat = -80; lat <= 80; lat += 20) {
    const y = ((90 - lat) / 180) * canvas.height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Meridians (Longitude)
  for (let lng = -180; lng <= 180; lng += 30) {
    const x = ((lng + 180) / 360) * canvas.width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Draw simplified high-tech landmass contours with Sea Green and Teal
  ctx.fillStyle = '#0b2440';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.5;

  // Indian Subcontinent approximate triangle
  const toX = (lng: number) => ((lng + 180) / 360) * canvas.width;
  const toY = (lat: number) => ((90 - lat) / 180) * canvas.height;

  // India
  ctx.beginPath();
  ctx.moveTo(toX(68), toY(24)); // Gujarat
  ctx.lineTo(toX(73), toY(19)); // Mumbai
  ctx.lineTo(toX(75), toY(12)); // Mangalore
  ctx.lineTo(toX(77.5), toY(8.1)); // Kanyakumari
  ctx.lineTo(toX(80), toY(13)); // Chennai
  ctx.lineTo(toX(85), toY(20)); // Odisha
  ctx.lineTo(toX(88.5), toY(22)); // Bengal
  ctx.lineTo(toX(92), toY(26)); // Northeast
  ctx.lineTo(toX(78), toY(35)); // Himalayas
  ctx.lineTo(toX(70), toY(30)); // Indus
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Arabian Peninsula
  ctx.beginPath();
  ctx.moveTo(toX(40), toY(28));
  ctx.lineTo(toX(55), toY(25));
  ctx.lineTo(toX(60), toY(22));
  ctx.lineTo(toX(54), toY(16));
  ctx.lineTo(toX(44), toY(12));
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Southeast Asia / Malay Peninsula / Sumatra
  ctx.beginPath();
  ctx.moveTo(toX(98), toY(20));
  ctx.lineTo(toX(102), toY(6));
  ctx.lineTo(toX(104), toY(1.3));
  ctx.lineTo(toX(95), toY(5.5));
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Sri Lanka
  ctx.beginPath();
  ctx.arc(toX(80.7), toY(7.8), 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Add subtle glowing Mint dot markers for major ports
  const majorPorts = [
    { name: 'Mumbai', lng: 72.8, lat: 18.9 },
    { name: 'Kochi', lng: 76.2, lat: 9.9 },
    { name: 'Chennai', lng: 80.3, lat: 13.1 },
    { name: 'Kolkata', lng: 88.3, lat: 22.5 },
    { name: 'Colombo', lng: 79.8, lat: 6.9 },
  ];

  ctx.fillStyle = '#34d399';
  majorPorts.forEach(port => {
    ctx.beginPath();
    ctx.arc(toX(port.lng), toY(port.lat), 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  return canvas.toDataURL('image/png');
}

/**
 * Creates procedural starry celestial background
 */
export function createProceduralStarfield(): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Generate random stars
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 1.5;
    const alpha = 0.2 + Math.random() * 0.8;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add few colored stars (cyan/amber)
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(0, 212, 255, 0.7)' : 'rgba(251, 191, 36, 0.6)';
    ctx.beginPath();
    ctx.arc(x, y, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas.toDataURL('image/png');
}
