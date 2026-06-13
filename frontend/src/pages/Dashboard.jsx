import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
    const [resumes, setResumes] = useState([])
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState('')
    const [jobDesc, setJobDesc] = useState('')
    const [analysisResult, setAnalysisResult] = useState(null)
    const [analyzing, setAnalyzing] = useState(false)
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    useEffect(() => {
        fetchResumes()
    }, [])

    const fetchResumes = async () => {
        try {
            const res = await axios.get('http://localhost:8000/resumes/', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setResumes(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setUploading(true)
        setMessage('')
        const formData = new FormData()
        formData.append('file', file)

        try {
            await axios.post('http://localhost:8000/resumes/upload', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            })
            setMessage('Resume uploaded successfully!')
            fetchResumes()
        } catch (err) {
            setMessage('Upload failed. Please try again.')
        }
        setUploading(false)
    }

    const handleAnalyze = async (resumeId) => {
        if (!jobDesc) {
            setMessage('Please enter a job description to match against.')
            return
        }
        setAnalyzing(true)
        setMessage('')
        setAnalysisResult(null)

        try {
            const res = await axios.post(`http://localhost:8000/analysis/match-job/${resumeId}`,
                { job_description: jobDesc },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setAnalysisResult(res.data)
            setMessage('Analysis complete!')
        } catch (err) {
            setMessage('Analysis failed. Check backend connection.')
        }
        setAnalyzing(false)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        window.location.href = '/login'
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Resume Analyzer</h2>
                <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
            </div>

            <div style={styles.card}>
                <h3>1. Upload Resume</h3>
                <input type="file" accept=".pdf, .docx" onChange={handleUpload} disabled={uploading} />
                {uploading && <p style={styles.info}>Uploading...</p>}
                {message && <p style={styles.info}>{message}</p>}
            </div>

            <div style={styles.card}>
                <h3>2. Match Against Job Description</h3>
                <textarea
                    style={styles.textarea}
                    placeholder="Paste the target job description here before clicking analyze..."
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                />
            </div>

            <div style={styles.card}>
                <h3>3. My Resumes ({resumes.length})</h3>
                {resumes.length === 0 && <p style={styles.hint}>No resumes uploaded yet.</p>}
                {resumes.map(resume => (
                    <div key={resume.id} style={styles.resumeItem}>
                        <span>{resume.filename}</span>
                        <button
                            style={styles.analyzeBtn}
                            onClick={() => handleAnalyze(resume.id)}
                            disabled={analyzing}
                        >
                            {analyzing ? 'Analyzing...' : 'Analyze'}
                        </button>
                    </div>
                ))}
            </div>

            {analysisResult && (
                <div style={styles.card}>
                    <h3>Analysis Results</h3>
                    <h1 style={{color: analysisResult.match_score >= 70 ? '#16a34a' : '#ea580c'}}>
                        Match Score: {analysisResult.match_score}%
                    </h1>
                    <p><strong>Feedback:</strong> {analysisResult.feedback}</p>
                    <p><strong>Matching Skills:</strong> {analysisResult.matching_skills.join(', ') || 'None'}</p>
                    <p><strong>Missing Skills:</strong> {analysisResult.missing_skills.join(', ') || 'None'}</p>
                </div>
            )}
        </div>
    )
}

const styles = {
    container: { maxWidth: '700px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
    title: { color: '#1a1a1a', margin: 0 },
    logoutBtn: { padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    card: { background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '1.5rem' },
    textarea: { width: '100%', height: '100px', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px', marginTop: '0.5rem' },
    hint: { color: '#666', fontSize: '0.9rem' },
    info: { color: '#4f46e5', marginTop: '0.5rem', fontWeight: 'bold' },
    resumeItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #eee' },
    analyzeBtn: { padding: '0.5rem 1rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }
}