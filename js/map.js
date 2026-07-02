/* ============================================================
   LYNCHPIN ADVISORY — World Map (jsVectorMap)
   Highlights: 22 African countries, Middle East (UAE/Kuwait/Qatar),
   Europe (Spain/UK/Denmark), United States (NY, DC, Baltimore, Delaware)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const mapEl = document.getElementById('worldMap');
  if (!mapEl || typeof jsVectorMap === 'undefined') return;

  /* ---- Highlighted country codes ---- */

  // 22 African countries (placeholder set — to be finalized/specified by client)
  const africanCountries = [
    'KE', 'NG', 'ZA', 'GH', 'EG', 'MA', 'ET', 'TZ',
    'UG', 'RW', 'SN', 'CI', 'CM', 'ZM', 'ZW', 'BW',
    'NA', 'MZ', 'DZ', 'TN', 'CD', 'AO'
  ];

  // Middle East: Dubai (UAE), Kuwait, Qatar
  const middleEastCountries = ['AE', 'KW', 'QA'];

  // Europe: Spain, United Kingdom (London), Denmark
  const europeCountries = ['ES', 'GB', 'DK'];

  // United States (single country fill; cities marked separately)
  const usCountries = ['US'];

  const regionColors = {};
  africanCountries.forEach(c => { regionColors[c] = '#C8A46A'; });
  middleEastCountries.forEach(c => { regionColors[c] = '#E5C97C'; });
  europeCountries.forEach(c => { regionColors[c] = '#8FA9C7'; });
  usCountries.forEach(c => { regionColors[c] = '#B9CBD8'; });

  /* ---- City / hub markers ---- */
  const markers = [
    // Middle East
    { name: 'Dubai, UAE', label: 'DXB', coords: [25.2048, 55.2708], region: 'Middle East' },
    { name: 'Kuwait City, Kuwait', label: 'KWI', coords: [29.3759, 47.9774], region: 'Middle East' },
    { name: 'Doha, Qatar', label: 'DOH', coords: [25.2854, 51.5310], region: 'Middle East' },
    // Europe
    { name: 'Madrid, Spain', label: 'MAD', coords: [40.4168, -3.7038], region: 'Europe' },
    { name: 'London, UK', label: 'LON', coords: [51.5074, -0.1278], region: 'Europe' },
    { name: 'Copenhagen, Denmark', label: 'CPH', coords: [55.6761, 12.5683], region: 'Europe' },
    // United States
    { name: 'New York, US', label: 'NY', coords: [40.7128, -74.0060], region: 'United States' },
    { name: 'Washington DC, US', label: 'DC', coords: [38.9072, -77.0369], region: 'United States' },
    { name: 'Baltimore, US', label: 'BAL', coords: [39.2904, -76.6122], region: 'United States' },
    { name: 'Delaware, US', label: 'DE', coords: [39.1582, -75.5244], region: 'United States' },
    // Africa highlights
    { name: 'Nairobi, Kenya', label: 'NBO', coords: [-1.2921, 36.8219], region: 'Africa' },
    { name: 'Lagos, Nigeria', label: 'LOS', coords: [6.5244, 3.3792], region: 'Africa' },
    { name: 'Johannesburg, South Africa', label: 'JNB', coords: [-26.2041, 28.0473], region: 'Africa' },
    { name: 'Cairo, Egypt', label: 'CAI', coords: [30.0444, 31.2357], region: 'Africa' },
    { name: 'Accra, Ghana', label: 'ACC', coords: [5.6037, -0.1870], region: 'Africa' }
  ];

  const markerStyleByRegion = {
    'Africa': '#C8A46A',
    'Middle East': '#E5C97C',
    'Europe': '#8FA9C7',
    'United States': '#B9CBD8'
  };

  const map = new jsVectorMap({
    selector: '#worldMap',
    map: 'world',
    backgroundColor: 'transparent',
    zoomButtons: true,
    zoomOnScroll: false,
    regionStyle: {
      initial: {
        fill: 'rgba(255,255,255,0.08)',
        stroke: 'rgba(200,164,106,0.25)',
        strokeWidth: 0.5
      },
      hover: {
        fill: 'rgba(200,164,106,0.5)'
      }
    },
    markers: markers.map(m => ({ name: m.label, coords: m.coords })),
    markerStyle: {
      initial: {
        r: 5,
        fill: '#E5C97C',
        fillOpacity: 1,
        stroke: '#0D1B2A',
        strokeWidth: 2
      },
      hover: {
        fill: '#FFFFFF',
        r: 7
      }
    },
    labels: {
      markers: {
        render: (marker) => marker.name
      }
    },
    onRegionTooltipShow: function (event, tooltip, code) {
      if (regionColors[code]) {
        tooltip.css({
          backgroundColor: '#17263A',
          color: '#F5EDD8',
          border: '1px solid #C8A46A',
          padding: '6px 12px',
          borderRadius: '4px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px'
        });
      } else {
        event.preventDefault();
      }
    },
    onMarkerTooltipShow: function (event, tooltip, index) {
      const m = markers[index];
      tooltip.text(`${m.name} — ${m.region} Hub`);
      tooltip.css({
        backgroundColor: '#17263A',
        color: '#E5C97C',
        border: '1px solid #C8A46A',
        padding: '6px 12px',
        borderRadius: '4px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '12px',
        fontWeight: '600'
      });
    }
  });

  // Apply direct region fill colors (bypassing jsVectorMap's numeric "series" scale system,
  // which is designed for heatmap-style gradients, not literal per-country hex colors).
  Object.keys(regionColors).forEach((code) => {
    const region = map.regions[code];
    if (region && region.element && region.element.shape) {
      region.element.shape.style.initial.fill = regionColors[code];
      region.element.shape.updateStyle();
    }
  });

  // Responsive resize
  window.addEventListener('resize', () => {
    if (map && map.updateSize) map.updateSize();
  });
});
