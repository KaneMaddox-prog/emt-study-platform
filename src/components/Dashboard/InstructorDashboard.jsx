import { useAuth } from '../../contexts/AuthContext';

const categories = [
  'Medical', 'Trauma', 'Airway', 'Anatomy & Physiology',
  'Cardiology', 'Shock & Resuscitation', 'OB',
  'Special Patient Populations', 'Operations', 'Stroke'
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
        <button onClick={signOut} style={{
          backgroundColor: 'transparent',
          border: '1px solid #1e3a5f',
          color: '#6b7280',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
        }}>
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

      {/* Topic performance */}
      <h2 style={{ color: '#e5e7eb', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Class Performance by Topic</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {categories.map(cat => (
          <div key={cat} style={{
            backgroundColor: '#111827',
            border: '1px solid #1e3a5f',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <p style={{ color: '#e5e7eb', fontSize: '14px', fontWeight: '600', margin: 0 }}>{cat}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '120px', backgroundColor: '#1f2937', borderRadius: '4px', height: '6px' }}>
                <div style={{ backgroundColor: '#3b82f6', width: '0%', height: '6px', borderRadius: '4px' }} />
              </div>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: 0, minWidth: '32px' }}>—</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorDashboard;