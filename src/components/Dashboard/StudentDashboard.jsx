import { useAuth } from '../../contexts/AuthContext';

const categories = [
  { id: 1, name: 'Medical', icon: '🩺' },
  { id: 2, name: 'Trauma', icon: '🚑' },
  { id: 3, name: 'Airway', icon: '💨' },
  { id: 4, name: 'Anatomy & Physiology', icon: '🫀' },
  { id: 5, name: 'Cardiology', icon: '❤️' },
  { id: 6, name: 'Shock & Resuscitation', icon: '⚡' },
  { id: 7, name: 'OB', icon: '👶' },
  { id: 8, name: 'Special Patient Populations', icon: '🧓' },
  { id: 9, name: 'Operations', icon: '🚒' },
  { id: 10, name: 'Stroke', icon: '🧠' },
];

const StudentDashboard = () => {
  const { profile, signOut } = useAuth();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ color: '#3b82f6', fontSize: '24px', fontWeight: '700', margin: 0 }}>RescueIQ</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '4px 0 0' }}>
            Welcome back, {profile?.full_name || 'Student'}
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

      {/* Progress bar placeholder */}
      <div style={{
        backgroundColor: '#111827',
        border: '1px solid #1e3a5f',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '32px',
      }}>
        <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 8px' }}>NREMT Readiness</p>
        <div style={{ backgroundColor: '#1f2937', borderRadius: '4px', height: '8px' }}>
          <div style={{ backgroundColor: '#3b82f6', width: '0%', height: '8px', borderRadius: '4px' }} />
        </div>
        <p style={{ color: '#6b7280', fontSize: '12px', margin: '8px 0 0' }}>Start studying to track your progress</p>
      </div>

      {/* Category grid */}
      <h2 style={{ color: '#e5e7eb', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Study Topics</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
      }}>
        {categories.map(cat => (
          <div key={cat.id} style={{
            backgroundColor: '#111827',
            border: '1px solid #1e3a5f',
            borderRadius: '12px',
            padding: '20px',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1e3a5f'}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{cat.icon}</div>
            <p style={{ color: '#e5e7eb', fontSize: '14px', fontWeight: '600', margin: '0 0 4px' }}>{cat.name}</p>
            <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>0% complete</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;