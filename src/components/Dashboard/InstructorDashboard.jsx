import { useAuth } from '../../contexts/AuthContext';

const domains = [
  { id: 1, name: 'Primary Assessment', weight: '39–43%', priority: true },
  { id: 2, name: 'Patient Treatment & Transport', weight: '20–24%', priority: false },
  { id: 3, name: 'Scene Size-Up & Safety', weight: '15–19%', priority: false },
  { id: 4, name: 'Operations', weight: '10–14%', priority: false },
  { id: 5, name: 'Secondary Assessment', weight: '5–9%', priority: false },
];

const InstructorDashboard = () => {
  const { profile, signOut } = useAuth();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', padding: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ color: '#3b82f6', fontSize: '24px', fontWeight: '700', margin: 0 }}>RescueIQ</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '4px 0 0' }}>
            Instructor: {profile?.full_name || 'Instructor'}
          </p>
        </div>
        <button
          onClick={signOut}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #1e3a5f',
            color: '#6b7280',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Students', value: '—' },
          { label: 'Avg. Readiness', value: '—' },
          { label: 'Active This Week', value: '—' },
        ].map(stat => (
          <div key={stat.label} style={{
            backgroundColor: '#111827',
            border: '1px solid #1e3a5f',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
          }}>
            <p style={{ color: '#3b82f6', fontSize: '28px', fontWeight: '700', margin: '0 0 4px' }}>{stat.value}</p>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Domain performance */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
        <h2 style={{ color: '#e5e7eb', fontSize: '16px', fontWeight: '600', margin: 0 }}>Class Performance by Domain</h2>
        <span style={{ color: '#4b5563', fontSize: '11px', letterSpacing: '0.05em' }}>2025 TEST PLAN</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {domains.map(domain => (
          <div
            key={domain.id}
            style={{
              backgroundColor: domain.priority ? '#0d1b35' : '#111827',
              border: `1px solid ${domain.priority ? '#2563eb' : '#1e3a5f'}`,
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Priority accent bar */}
            {domain.priority && (
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '3px',
                backgroundColor: '#3b82f6',
                borderRadius: '12px 0 0 12px',
              }} />
            )}

            {/* Domain name + weight */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: domain.priority ? '8px' : '0' }}>
              <p style={{ color: '#e5e7eb', fontSize: '14px', fontWeight: '600', margin: 0 }}>{domain.name}</p>
              {domain.priority && (
                <span style={{
                  backgroundColor: '#1d4ed8',
                  color: '#93c5fd',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  letterSpacing: '0.05em',
                }}>
                  HIGH WEIGHT
                </span>
              )}
              <span style={{ color: domain.priority ? '#60a5fa' : '#4b5563', fontSize: '12px', fontWeight: '600' }}>
                {domain.weight}
              </span>
            </div>

            {/* Progress bar + value */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '120px', backgroundColor: '#1f2937', borderRadius: '4px', height: '6px' }}>
                <div style={{ backgroundColor: '#3b82f6', width: '0%', height: '6px', borderRadius: '4px' }} />
              </div>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: 0, minWidth: '32px', textAlign: 'right' }}>—</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p style={{ color: '#374151', fontSize: '11px', textAlign: 'center', marginTop: '24px', letterSpacing: '0.03em' }}>
        Aligned to the 2025 NREMT EMT Certification Examination Test Plan
      </p>
    </div>
  );
};

export default InstructorDashboard;