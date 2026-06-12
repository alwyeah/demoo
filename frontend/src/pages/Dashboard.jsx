import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [resumes, setResumes] = useState([])
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
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

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Resume Analyzer</h2>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.card}>
        <h3>Upload Resume</h3>
        <p style={styles.hint}>Supported formats: PDF, DOCX</p>
        <input type="file" accept=".pdf,.docx" onChange={handleUpload} disabled={uploading} />
        {uploading && <p style={styles.info}>Uploading and extracting text...</p>}
        {message && <p style={message.includes('success') ? styles.success : styles.error}>{message}</p>}
      </div>

      <div style={styles.card}>
        <h3>My Resumes ({resumes.length})</h3>
        {resumes.length === 0 && <p style={styles.hint}>No resumes uploaded yet.</p>}
        {resumes.map(resume => (
          <div key={resume.id} style={styles.resumeItem}>
            <span>📄 {resume.filename}</span>
            <span style={styles.date}>{new Date(resume.uploaded_at).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '700px', margin: '0 auto', padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title: { color: '#1a1a1a', margin: 0 },
  logoutBtn: { padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  card: { background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '1.5rem' },
  hint: { color: '#666', fontSize: '0.9rem' },
  info: { color: '#4f46e5', marginTop: '0.5rem' },
  success: { color: '#16a34a', marginTop: '0.5rem' },
  error: { color: '#dc2626', marginTop: '0.5rem' },
  resumeItem: { display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px', marginTop: '0.5rem' },
  date: { color: '#666', fontSize: '0.9rem' }
}