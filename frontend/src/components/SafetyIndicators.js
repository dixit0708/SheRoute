import React from 'react';
import { LightBulbIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const display = (value, max = 1) => {
  if (value == null) return 'N/A';
  // If value looks like a 0-1 fraction, show percent; otherwise show score over max.
  return value <= 1 ? `${Math.round(value * 100)}%` : `${value.toFixed(1)}/${max}`;
};

const SafetyIndicators = ({ safest }) => {
  const stats = safest ? [
    { label: 'Lighting', value: display(safest.lighting, 10), icon: LightBulbIcon, color: '#eab308' },
    { label: 'Police', value: display(safest.police, 1), icon: ShieldCheckIcon, color: '#22c55e' },
    { label: 'Crowd', value: display(safest.crowd, 10), icon: UserGroupIcon, color: '#3b82f6' },
  ] : [
    { label: 'Lighting', value: '92%', icon: LightBulbIcon, color: '#eab308' },
    { label: 'Safe Zone', value: 'High', icon: ShieldCheckIcon, color: '#22c55e' },
    { label: 'Crowd', value: 'Mid', icon: UserGroupIcon, color: '#3b82f6' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
      {stats.map((stat, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
          <stat.icon style={{ height: '16px', width: '16px', color: stat.color, marginBottom: '4px' }} />
          <span style={{ fontSize: '8px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase' }}>{stat.label}</span>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#1f2937' }}>{stat.value}</span>
        </div>
      ))}
    </div>
  );
};

export default SafetyIndicators;
