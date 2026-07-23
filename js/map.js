/* ============================================================
   LYNCHPIN ADVISORY — World Map (jsVectorMap)
   Highlights: 22 African countries, Middle East (UAE/Kuwait/Qatar),
   Europe (Spain/UK/Denmark), United States (NY, DC, Baltimore, Delaware)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const mapEl = document.getElementById('worldMap');
  const mapNoteEl = document.querySelector('.map-tooltip-note');
  const mapResetBtn = document.getElementById('mapResetBtn');
  const regionCards = document.querySelectorAll('.region-card[data-region]');
  if (!mapEl || typeof jsVectorMap === 'undefined') return;

  const africanCountries = [
    'KE', 'NG', 'ZA', 'GH', 'EG', 'MA', 'ET', 'TZ',
    'UG', 'RW', 'SN', 'CI', 'CM', 'ZM', 'ZW', 'BW',
    'NA', 'MZ', 'DZ', 'TN', 'CD', 'AO'
  ];

  const middleEastCountries = ['AE', 'KW', 'QA'];
  const europeCountries = ['ES', 'GB', 'DK'];
  const usCountries = ['US'];

  const countriesByRegion = {
    'Africa': africanCountries,
    'Middle East': middleEastCountries,
    'Europe': europeCountries,
    'United States': usCountries
  };

  const countryToRegion = {};
  Object.keys(countriesByRegion).forEach((regionName) => {
    countriesByRegion[regionName].forEach((code) => {
      countryToRegion[code] = regionName;
    });
  });

  const regionColors = {};
  africanCountries.forEach(c => { regionColors[c] = '#C8A46A'; });
  middleEastCountries.forEach(c => { regionColors[c] = '#E5C97C'; });
  europeCountries.forEach(c => { regionColors[c] = '#8FA9C7'; });
  usCountries.forEach(c => { regionColors[c] = '#B9CBD8'; });

  const markers = [
    { name: 'Dubai, UAE', label: 'DXB', coords: [25.2048, 55.2708], region: 'Middle East' },
    { name: 'Kuwait City, Kuwait', label: 'KWI', coords: [29.3759, 47.9774], region: 'Middle East' },
    { name: 'Doha, Qatar', label: 'DOH', coords: [25.2854, 51.5310], region: 'Middle East' },
    { name: 'Madrid, Spain', label: 'MAD', coords: [40.4168, -3.7038], region: 'Europe' },
    { name: 'London, UK', label: 'LON', coords: [51.5074, -0.1278], region: 'Europe' },
    { name: 'Copenhagen, Denmark', label: 'CPH', coords: [55.6761, 12.5683], region: 'Europe' },
    { name: 'New York, US', label: 'NY', coords: [40.7128, -74.0060], region: 'United States' },
    { name: 'Washington DC, US', label: 'DC', coords: [38.9072, -77.0369], region: 'United States' },
    { name: 'Baltimore, US', label: 'BAL', coords: [39.2904, -76.6122], region: 'United States' },
    { name: 'Delaware, US', label: 'DE', coords: [39.1582, -75.5244], region: 'United States' },
    { name: 'Nairobi, Kenya', label: 'NBO', coords: [-1.2921, 36.8219], region: 'Africa' },
    { name: 'Lagos, Nigeria', label: 'LOS', coords: [6.5244, 3.3792], region: 'Africa' },
    { name: 'Johannesburg, South Africa', label: 'JNB', coords: [-26.2041, 28.0473], region: 'Africa' },
    { name: 'Cairo, Egypt', label: 'CAI', coords: [30.0444, 31.2357], region: 'Africa' },
    { name: 'Accra, Ghana', label: 'ACC', coords: [5.6037, -0.1870], region: 'Africa' }
  ];

  const map = new jsVectorMap({
    selector: '#worldMap',
    map: 'world',
    backgroundColor: 'transparent',
    zoomButtons: true,
    zoomOnScroll: true,
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
    },
    onRegionClick: function (event, code) {
      const selectedRegion = countryToRegion[code];
      if (!selectedRegion) {
        event.preventDefault();
        return;
      }
      setActiveRegion(selectedRegion);
    }
  });

  const applyRegionStyles = (activeRegion = null) => {
    Object.keys(regionColors).forEach((code) => {
      const region = map.regions[code];
      if (!(region && region.element && region.element.shape)) return;

      const belongsToActive = !activeRegion || countryToRegion[code] === activeRegion;
      region.element.shape.style.initial.fill = belongsToActive ? regionColors[code] : 'rgba(255,255,255,0.06)';
      region.element.shape.style.initial.fillOpacity = belongsToActive ? 1 : 0.45;
      region.element.shape.updateStyle();
    });
  };

  const applyMarkerStyles = (activeRegion = null) => {
    const markerEntries = map.markers ? Object.values(map.markers) : [];
    markerEntries.forEach((markerObj, idx) => {
      if (!(markerObj && markerObj.element && markerObj.element.shape)) return;
      const markerData = markers[idx];
      const belongsToActive = !activeRegion || (markerData && markerData.region === activeRegion);
      markerObj.element.shape.style.initial.fill = belongsToActive ? '#E5C97C' : 'rgba(229,201,124,0.35)';
      markerObj.element.shape.style.initial.r = belongsToActive ? 5.6 : 4;
      markerObj.element.shape.updateStyle();
    });
  };

  const setActiveCard = (activeRegion = null) => {
    regionCards.forEach((card) => {
      card.classList.toggle('is-active', card.dataset.region === activeRegion);
    });
  };

  const setMapNote = (text) => {
    if (!mapNoteEl) return;
    mapNoteEl.innerHTML = `<i class="fas fa-info-circle"></i> ${text}`;
  };

  const resetMapViewport = () => {
    // Try known jsVectorMap APIs in order; fallback is harmless no-op.
    const resetAttempts = [
      () => (typeof map.reset === 'function' ? map.reset() : null),
      () => (typeof map.setFocus === 'function' ? map.setFocus({ scale: 1, lat: 0, lng: 0, animate: true }) : null),
      () => (typeof map.setFocus === 'function' ? map.setFocus({ scale: 1, x: 0.5, y: 0.5, animate: true }) : null)
    ];

    for (const attempt of resetAttempts) {
      try {
        attempt();
      } catch (_) {
        // Continue to the next fallback.
      }
    }

    if (map && map.updateSize) {
      map.updateSize();
    }
  };

  const setActiveRegion = (activeRegion = null) => {
    applyRegionStyles(activeRegion);
    applyMarkerStyles(activeRegion);
    setActiveCard(activeRegion);

    if (!activeRegion) {
      setMapNote('Hover over highlighted markers to explore our active regions');
      return;
    }

    setMapNote(`Showing ${activeRegion} focus. Click Reset View to show all regions.`);
  };

  applyRegionStyles();
  applyMarkerStyles();

  regionCards.forEach((card) => {
    const regionName = card.dataset.region;
    if (!regionName) return;

    card.addEventListener('click', () => setActiveRegion(regionName));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActiveRegion(regionName);
      }
    });
  });

  if (mapResetBtn) {
    mapResetBtn.addEventListener('click', () => {
      setActiveRegion(null);
      resetMapViewport();
    });
  }

  window.addEventListener('resize', () => {
    if (map && map.updateSize) map.updateSize();
  });
});
