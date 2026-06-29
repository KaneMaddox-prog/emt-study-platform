import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const fetchApprovedQuestions = async (domainName) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('status', 'approved')
    .eq('domain', domainName)
    .eq('cert_level', 'EMT');

  if (error) throw error;
  if (!data || data.length === 0) throw new Error('No approved questions available for this domain.');

  console.log('Raw data from Supabase:', data);

  const letterToIndex = { A: 0, B: 1, C: 2, D: 3 };

  const mapped = data.map(q => ({
    question: q.question_text,
    options: [q.option_a, q.option_b, q.option_c, q.option_d],
    correct: letterToIndex[q.correct_answer],
    explanation: q.explanation,
  }));

  return mapped.sort(() => Math.random() - 0.5).slice(0, 10);
};

const LETTERS = ['A', 'B', 'C', 'D'];

const QuizSession = ({ domain, onExit }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const qs = await fetchApprovedQuestions(domain.name);
        setQuestions(qs);
      } catch (err) {
        setError(err.message || 'Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [domain.name]);

  const saveResult = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('quiz_results').insert({
      user_id: user.id,
      domain_name: domain.name,
      score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100),
    });
  };

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === questions[current].correct;
    if (correct) setScore(s => s + 1);
    setResults(r => [...r, { correct, selected: idx, answer: questions[current].correct }]);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      saveResult();
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const pct = Math.round((score / questions.length) * 100);

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <div style={{ fontSize: '36px' }}>{domain.icon}</div>
      <p style={{ color: '#3b82f6', fontSize: '16px', fontWeight: '600' }}>Loading questions...</p>
      <p style={{ color: '#6b7280', fontSize: '13px' }}>{domain.name}</p>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '24px' }}>
      <p style={{ color: '#ef4444', fontSize: '15px', textAlign: 'center' }}>{error}</p>
      <button onClick={onExit} style={{ backgroundColor: '#1e3a5f', color: '#e5e7eb', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer' }}>
        Back to Dashboard
      </button>
    </div>
  );

  if (finished) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', padding: '24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#111827', border: '1px solid #1e3a5f', borderRadius: '16px', padding: '32px', textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ color: '#6b7280', fontSize: '13px', letterSpacing: '0.05em', margin: '0 0 8px' }}>QUIZ COMPLETE</p>
          <p style={{ color: '#3b82f6', fontSize: '56px', fontWeight: '800', margin: '0 0 4px' }}>{pct}%</p>
          <p style={{ color: '#e5e7eb', fontSize: '15px', margin: '0 0 4px' }}>{score} / {questions.length} correct</p>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>{domain.name}</p>
          <div style={{ marginTop: '20px', backgroundColor: '#1f2937', borderRadius: '4px', height: '8px' }}>
            <div style={{ backgroundColor: pct >= 70 ? '#22c55e' : '#ef4444', width: `${pct}%`, height: '8px', borderRadius: '4px', transition: 'width 0.6s ease' }} />
          </div>
          <p style={{ color: pct >= 70 ? '#22c55e' : '#ef4444', fontSize: '12px', marginTop: '8px' }}>
            {pct >= 70 ? 'Passing — NREMT passing threshold is 70%' : 'Below passing threshold — keep studying'}
          </p>
        </div>

        <h2 style={{ color: '#e5e7eb', fontSize: '15px', fontWeight: '600', marginBottom: '12px' }}>Question Review</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {questions.map((q, i) => (
            <div key={i} style={{
              backgroundColor: '#111827',
              border: `1px solid ${results[i]?.correct ? '#16a34a' : '#dc2626'}`,
              borderRadius: '12px',
              padding: '16px',
            }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                <span style={{ color: results[i]?.correct ? '#22c55e' : '#ef4444', fontSize: '16px' }}>
                  {results[i]?.correct ? '✓' : '✗'}
                </span>
                <p style={{ color: '#e5e7eb', fontSize: '13px', margin: 0 }}>{q.question}</p>
              </div>
              {!results[i]?.correct && (
                <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 4px' }}>
                  Your answer: <span style={{ color: '#ef4444' }}>{LETTERS[results[i]?.selected]} — {q.options[results[i]?.selected]}</span>
                </p>
              )}
              <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 6px' }}>
                Correct: <span style={{ color: '#22c55e' }}>{LETTERS[q.correct]} — {q.options[q.correct]}</span>
              </p>
              <p style={{ color: '#6b7280', fontSize: '12px', margin: 0, fontStyle: 'italic' }}>{q.explanation}</p>
            </div>
          ))}
        </div>

        <button onClick={onExit} style={{ width: '100%', backgroundColor: '#1d4ed8', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  const q = questions[current];
  const isCorrect = selected === q.correct;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', padding: '24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <button onClick={onExit} style={{ backgroundColor: 'transparent', border: '1px solid #1e3a5f', color: '#6b7280', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
            ← Exit
          </button>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>{domain.name}</p>
          <p style={{ color: '#3b82f6', fontSize: '13px', fontWeight: '700', margin: 0 }}>{current + 1} / {questions.length}</p>
        </div>

        <div style={{ backgroundColor: '#1f2937', borderRadius: '4px', height: '4px', marginBottom: '28px' }}>
          <div style={{ backgroundColor: '#3b82f6', width: `${((current + 1) / questions.length) * 100}%`, height: '4px', borderRadius: '4px', transition: 'width 0.3s ease' }} />
        </div>

        <div style={{ backgroundColor: '#111827', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
          <p style={{ color: '#e5e7eb', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>{q.question}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {q.options.map((opt, idx) => {
            let borderColor = '#1e3a5f';
            let bgColor = '#111827';
            let textColor = '#e5e7eb';
            if (answered) {
              if (idx === q.correct) { borderColor = '#16a34a'; bgColor = '#052e16'; textColor = '#4ade80'; }
              else if (idx === selected && !isCorrect) { borderColor = '#dc2626'; bgColor = '#1c0a0a'; textColor = '#f87171'; }
            }
            return (
              <div key={idx} onClick={() => handleSelect(idx)}
                style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}`, borderRadius: '10px', padding: '14px 16px', cursor: answered ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'border-color 0.15s, background-color 0.15s' }}
                onMouseEnter={e => { if (!answered) e.currentTarget.style.borderColor = '#3b82f6'; }}
                onMouseLeave={e => { if (!answered) e.currentTarget.style.borderColor = '#1e3a5f'; }}>
                <span style={{ color: '#4b5563', fontSize: '13px', fontWeight: '700', minWidth: '20px' }}>{LETTERS[idx]}</span>
                <span style={{ color: textColor, fontSize: '14px' }}>{opt}</span>
              </div>
            );
          })}
        </div>

        {answered && (
          <div>
            <div style={{ backgroundColor: isCorrect ? '#052e16' : '#1c0a0a', border: `1px solid ${isCorrect ? '#16a34a' : '#dc2626'}`, borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
              <p style={{ color: isCorrect ? '#4ade80' : '#f87171', fontSize: '13px', fontWeight: '700', margin: '0 0 6px' }}>
                {isCorrect ? '✓ Correct' : `✗ Incorrect — Correct answer: ${LETTERS[q.correct]}`}
              </p>
              <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>{q.explanation}</p>
            </div>
            <button onClick={handleNext} style={{ width: '100%', backgroundColor: '#1d4ed8', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}>
              {current + 1 >= questions.length ? 'See Results' : 'Next Question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSession;