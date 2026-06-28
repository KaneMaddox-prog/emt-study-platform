import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabaseClient';

const domains = [
  { id: 1, name: 'Primary Assessment', weight: '39–43%', priority: true },
  { id: 2, name: 'Patient Treatment & Transport', weight: '20–24%', priority: false },
  { id: 3, name: 'Scene Size-Up & Safety', weight: '15–19%', priority: false },
  { id: 4, name: 'Operations', weight: '10–14%', priority: false },
  { id: 5, name: 'Secondary Assessment', weight: '5–9%', priority: false },
];

const InstructorDashboard = () => {
  const { profile, signOut } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [questions, setQuestions] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(domains[0].name);

  useEffect(() => {
    const fetchResults = async () => {
      const { data, error } = await supabase.from('quiz_results').select('*');
      if (!error) setResults(data);
      setLoading(false);
    };
    fetchResults();
  }, []);

  useEffect(() => {
    if (activeTab === 'questions') fetchQuestions();
  }, [activeTab]);

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setQuestions(data);
  };

  const generateQuestions = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainName: selectedDomain }),
      });
      const data = await res.json();
      const parsed = typeof data.questions === 'string'
        ? JSON.parse(data.questions)
        : data.questions;

      const rows = parsed.map(q => ({
        domain: selectedDomain,
        question_text: q.question,
        option_a: q.options[0],
        option_b: q.options[1],
        option_c: q.options[2],
        option_d: q.options[3],
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        status: 'pending',
        cert_level: 'EMT',
      }));

      const { error } = await supabase.from('questions').insert(rows);
      if (!error) await fetchQuestions();
    } catch (err) {
      console.error('Generation error:', err);
    }
    setGenerating(false);
  };

  const updateStatus = async (id, status) => {
    await supabase.from('questions').update({ status }).eq('id', id);
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, status } : q));
  };

  const totalStudents = [...new Set(results.map(r => r.user_id))].length;
  const avgReadiness = results.length
    ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
    : null;
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const activeThisWeek = [...new Set(results.filter(r => r.created_at > oneWeekAgo).map(r => r.user_id))].length;

  const domainAvg = (domainName) => {
    const dr = results.filter(r => r.domain_name === domainName);
    if (!dr.length) return null;
    return Math.round(dr.reduce((sum, r) => sum + r.percentage, 0) / dr.length);
  };

  const statusColor = (status) => {
    if (status === 'approved') return '#22c55e';
    if (status === 'rejected') return '#ef4444';
    return '#f59e0b';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', padding: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: '#3b82f6', fontSize: '24px', fontWeight: '700', margin: 0 }}>RescueIQ</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '4px 0 0' }}>
            Instructor: {profile?.full_name || 'Instructor'}
          </p>
        </div>
        <button
          onClick={signOut}
          style={{ backgroundColor: 'transparent', border: '1px solid #1e3a5f', color: '#6b7280', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
        >
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
        {['dashboard', 'questions'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              backgroundColor: activeTab === tab ? '#2563eb' : '#111827',
              color: activeTab === tab ? '#fff' : '#6b7280',
            }}
          >
            {tab === 'dashboard' ? 'Dashboard' : 'Question Review'}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <>
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {[
              { label: 'Total Students', value: loading ? '...' : totalStudents || '0' },
              { label: 'Avg. Readiness', value: loading ? '...' : avgReadiness ? `${avgReadiness}%` : '—' },
              { label: 'Active This Week', value: loading ? '...' : activeThisWeek || '0' },
            ].map(stat => (
              <div key={stat.label} style={{ backgroundColor: '#111827', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
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
            {domains.map(domain => {
              const avg = domainAvg(domain.name);
              const barColor = avg === null ? '#1f2937' : avg >= 70 ? '#22c55e' : '#ef4444';
              return (
                <div key={domain.id} style={{
                  backgroundColor: domain.priority ? '#0d1b35' : '#111827',
                  border: `1px solid ${domain.priority ? '#2563eb' : '#1e3a5f'}`,
                  borderRadius: '12px', padding: '16px 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {domain.priority && (
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', backgroundColor: '#3b82f6', borderRadius: '12px 0 0 12px' }} />
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: domain.priority ? '8px' : '0' }}>
                    <p style={{ color: '#e5e7eb', fontSize: '14px', fontWeight: '600', margin: 0 }}>{domain.name}</p>
                    {domain.priority && (
                      <span style={{ backgroundColor: '#1d4ed8', color: '#93c5fd', fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.05em' }}>HIGH WEIGHT</span>
                    )}
                    <span style={{ color: domain.priority ? '#60a5fa' : '#4b5563', fontSize: '12px', fontWeight: '600' }}>{domain.weight}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '120px', backgroundColor: '#1f2937', borderRadius: '4px', height: '6px' }}>
                      <div style={{ backgroundColor: barColor, width: avg ? `${avg}%` : '0%', height: '6px', borderRadius: '4px', transition: 'width 0.6s ease' }} />
                    </div>
                    <p style={{ color: avg >= 70 ? '#22c55e' : avg ? '#ef4444' : '#6b7280', fontSize: '13px', margin: 0, minWidth: '36px', textAlign: 'right' }}>
                      {avg !== null ? `${avg}%` : '—'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <p style={{ color: '#374151', fontSize: '11px', textAlign: 'center', marginTop: '24px', letterSpacing: '0.03em' }}>
            Aligned to the 2025 NREMT EMT Certification Examination Test Plan
          </p>
        </>
      )}

      {activeTab === 'questions' && (
        <div>
          {/* Generate controls */}
          <div style={{ backgroundColor: '#111827', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <select
              value={selectedDomain}
              onChange={e => setSelectedDomain(e.target.value)}
              style={{ backgroundColor: '#0a0f1e', border: '1px solid #1e3a5f', color: '#e5e7eb', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', flex: 1, minWidth: '200px' }}
            >
              {domains.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
            <button
              onClick={generateQuestions}
              disabled={generating}
              style={{ backgroundColor: generating ? '#1e3a5f' : '#2563eb', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: generating ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' }}
            >
              {generating ? 'Generating...' : 'Generate 10 Questions'}
            </button>
          </div>

          {/* Question list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {questions.length === 0 && (
              <p style={{ color: '#4b5563', textAlign: 'center', marginTop: '40px' }}>No questions yet. Generate some above.</p>
            )}
            {questions.map(q => (
              <div key={q.id} style={{ backgroundColor: '#111827', border: `1px solid ${statusColor(q.status)}44`, borderRadius: '12px', padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span style={{ color: '#6b7280', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em' }}>{q.domain} · {q.cert_level}</span>
                  <span style={{ color: statusColor(q.status), fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{q.status}</span>
                </div>
                <p style={{ color: '#e5e7eb', fontSize: '14px', fontWeight: '600', margin: '0 0 10px' }}>{q.question_text}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                  {[q.option_a, q.option_b, q.option_c, q.option_d].map((opt, i) => {
                    const letter = ['A', 'B', 'C', 'D'][i];
                    const isCorrect = q.correct_answer === letter;
                    return (
                      <p key={i} style={{ color: isCorrect ? '#22c55e' : '#6b7280', fontSize: '13px', margin: 0 }}>
                        {letter}. {opt} {isCorrect && '✓'}
                      </p>
                    );
                  })}
                </div>
                <p style={{ color: '#4b5563', fontSize: '12px', margin: '0 0 14px', fontStyle: 'italic' }}>{q.explanation}</p>
                {q.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => updateStatus(q.id, 'approved')} style={{ backgroundColor: '#14532d', color: '#22c55e', border: '1px solid #22c55e', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                      Approve
                    </button>
                    <button onClick={() => updateStatus(q.id, 'rejected')} style={{ backgroundColor: '#450a0a', color: '#ef4444', border: '1px solid #ef4444', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;