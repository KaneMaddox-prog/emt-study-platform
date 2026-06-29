import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import QuizSession from './QuizSession';

const categories = [
  {
    id: 1,
    name: 'Primary Assessment',
    icon: '🫁',
    weight: '39–43%',
    description: 'ABCs, LOC, life threats, interventions',
    priority: true,
  },
  {
    id: 2,
    name: 'Patient Treatment & Transport',
    icon: '🚑',
    weight: '20–24%',
    description: 'Interventions, packaging, transport decisions',
    priority: false,
  },
  {
    id: 3,
    name: 'Scene Size-Up & Safety',
    icon: '🔍',
    weight: '15–19%',
    description: 'Scene safety, MOI, NOI, resource needs',
    priority: false,
  },
  {
    id: 4,
    name: 'Operations',
    icon: '🚒',
    weight: '10–14%',
    description: 'MCI, ICS, ambulance ops, special situations',
    priority: false,
  },
  {
    id: 5,
    name: 'Secondary Assessment',
    icon: '🩺',
    weight: '5–9%',
    description: 'History, vitals, physical exam, reassessment',
    priority: false,
  },
];

const StudentDashboard = () => {
  const { profile, signOut } = useAuth();
  const [activeQuiz, setActiveQuiz] = useState(null);

  if (activeQuiz) {
    return <QuizSession domain={activeQuiz} onExit={() => setActiveQuiz(null)} />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', padding: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ color: '#3b82f6', fontSize: '24px', fontWeight: '700', margin: 0 }}>Certavi</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '4px 0 0' }}>
            Welcome back, {profile?.full_name || 'Student'}
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

      {/* NREMT Readiness progress bar */}
      <div style={{
        backgroundColor: '#111827',
        border: '1px solid #1e3a5f',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '32px',
      }}>
        <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 8px', letterSpacing: '0.05em' }}>NREMT READINESS</p>
        <div style={{ backgroundColor: '#1f2937', borderRadius: '4px', height: '8px' }}>
          <div style={{ backgroundColor: '#3b82f6', width: '0%', height: '8px', borderRadius: '4px' }} />
        </div>
        <p style={{ color: '#6b7280', fontSize: '12px', margin: '8px 0 0' }}>Start studying to track your progress</p>
      </div>

      {/* Domain grid */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
        <h2 style={{ color: '#e5e7eb', fontSize: '16px', fontWeight: '600', margin: 0 }}>NREMT Exam Domains</h2>
        <span style={{ color: '#4b5563', fontSize: '11px', letterSpacing: '0.05em' }}>2025 TEST PLAN</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {categories.map(cat => (
          <div
            key={cat.id}
            onClick={() => setActiveQuiz(cat)}
            style={{
              backgroundColor: cat.priority ? '#0d1b35' : '#111827',
              border: `1px solid ${cat.priority ? '#2563eb' : '#1e3a5f'}`,
              borderRadius: '12px',
              padding: '18px 20px',
              cursor: 'pointer',
              transition: 'border-color 0.2s, background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.backgroundColor = cat.priority ? '#0f2040' : '#131f2e';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = cat.priority ? '#2563eb' : '#1e3a5f';
              e.currentTarget.style.backgroundColor = cat.priority ? '#0d1b35' : '#111827';
            }}
          >
            {cat.priority && (
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

            <div style={{
              fontSize: '26px',
              minWidth: '40px',
              textAlign: 'center',
              marginLeft: cat.priority ? '8px' : '0',
            }}>
              {cat.icon}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <p style={{ color: '#e5e7eb', fontSize: '15px', fontWeight: '600', margin: 0 }}>{cat.name}</p>
                {cat.priority && (
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
              </div>
              <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>{cat.description}</p>
            </div>

            <div style={{ textAlign: 'right', minWidth: '70px' }}>
              <p style={{
                color: cat.priority ? '#60a5fa' : '#9ca3af',
                fontSize: '15px',
                fontWeight: '700',
                margin: '0 0 3px',
              }}>
                {cat.weight}
              </p>
              <p style={{ color: '#4b5563', fontSize: '11px', margin: 0 }}>0% done</p>
            </div>
          </div>
        ))}
      </div>

      <p style={{ color: '#374151', fontSize: '11px', textAlign: 'center', marginTop: '24px', letterSpacing: '0.03em' }}>
        Aligned to the 2025 NREMT EMT Certification Examination Test Plan
      </p>
    </div>
  );
};

export default StudentDashboard;
