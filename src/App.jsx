import React, { useState } from 'react'
import './App.css';

const severityLevels = ['All', 'Low', 'Medium', 'High']

const initialIncidents = [
  { 
    id: 1, 
    title: "Biased Recommendation Algorithm", 
    description: "The recommendation algorithm consistently favored certain demographics over others, leading to unfair exposure and reduced diversity in content distribution.", 
    severity: "Medium", 
    reported_at: "2025-03-15T10:00:00Z" 
  },
  { 
    id: 2, 
    title: "LLM Hallucination in Critical Info", 
    description: "The large language model provided incorrect safety procedure information during a critical advisory session, potentially putting users at risk.", 
    severity: "High", 
    reported_at: "2025-04-01T14:30:00Z" 
  },
  { 
    id: 3, 
    title: "Minor Data Leak via Chatbot", 
    description: "The chatbot inadvertently exposed non-sensitive user metadata, such as login timestamps and general location information, due to improper session handling.", 
    severity: "Low", 
    reported_at: "2025-03-20T09:15:00Z" 
  }
];


const App = () => {
  const [incidents, setIncidents] = useState(initialIncidents)
  const [filterSeverity, setFilterSeverity] = useState('All')
  const [sortOrder, setSortOrder] = useState('Newest')
  const [expandedIds, setExpandedIds] = useState(new Set())
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'Low'
  })
  const [formErrors, setFormErrors] = useState({
    title: '',
    description: ''
  })

  const [theme, setTheme] = useState('light')

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  const toggleExpand = (id) => {
    const newSet = new Set(expandedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setExpandedIds(newSet)
  }

  const filteredIncidents = incidents.filter(i => filterSeverity === 'All' || i.severity === filterSeverity)

  const sortedIncidents = filteredIncidents.sort((a, b) => {
    if (sortOrder === 'Newest') {
      return new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime()
    } else {
      return new Date(a.reported_at).getTime() - new Date(b.reported_at).getTime()
    }
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    let valid = true
    const errors = { title: '', description: '' }
    if (!formData.title.trim()) {
      errors.title = 'Title is required'
      valid = false
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required'
      valid = false
    }
    setFormErrors(errors)
    return valid
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    const newIncident = {
      id: incidents.length ? Math.max(...incidents.map(i => i.id)) + 1 : 1,
      title: formData.title.trim(),
      description: formData.description.trim(),
      severity: formData.severity,
      reported_at: new Date().toISOString()
    }
    setIncidents([newIncident, ...incidents])
    setFormData({ title: '', description: '', severity: 'Low' })
    setFormErrors({ title: '', description: '' })
  }

  return (
    <div className={`container my-4 ${theme === 'dark' ? 'bg-dark text-light' : ''}`} style={{minHeight: '100vh'}}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-center flex-grow-1 ai-safety-heading">AI Safety Incident Dashboard</h1>
        <button className={`btn btn-outline-${theme === 'light' ? 'dark' : 'light'}`} onClick={toggleTheme}>
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>

      <div className="d-flex flex-wrap justify-content-between mb-3 gap-3">
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="severityFilter" className="form-label mb-0 fw-semibold">Filter by Severity:</label>
          <select id="severityFilter" className="form-select" style={{width: '150px', color: filterSeverity === 'Low' ? '#2e7d32' : filterSeverity === 'Medium' ? '#f9a825' : filterSeverity === 'High' ? '#c62828' : 'inherit', backgroundColor: filterSeverity === 'Low' ? '#dcedc8' : filterSeverity === 'Medium' ? '#fff9c4' : filterSeverity === 'High' ? '#ffcdd2' : 'inherit'}} value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
            {severityLevels.map(level => (
              <option key={level} value={level} style={{color: level === 'Low' ? '#2e7d32' : level === 'Medium' ? '#f9a825' : level === 'High' ? '#c62828' : 'inherit', backgroundColor: level === 'Low' ? '#dcedc8' : level === 'Medium' ? '#fff9c4' : level === 'High' ? '#ffcdd2' : 'inherit'}}>{level}</option>
            ))}
          </select>
        </div>

        <div className="d-flex align-items-center gap-2">
          <label htmlFor="sortOrder" className="form-label mb-0 fw-semibold">Sort by Reported Date:</label>
          <select id="sortOrder" className="form-select" style={{width: '150px'}} value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
            <option value="Newest">Newest First</option>
            <option value="Oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <ul className="list-group mb-4">
        {sortedIncidents.map(incident => (
          <li key={incident.id} className={`list-group-item ${theme === 'dark' ? 'bg-secondary text-light' : ''}`}>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div className="fw-semibold flex-grow-1">{incident.title}</div>
              <div>
                <span className={`badge ${
                  incident.severity === 'Low' ? 'bg-success' :
                  incident.severity === 'Medium' ? 'bg-warning text-dark' :
                  'bg-danger'
                } me-3`}>
                  {incident.severity}
                </span>
                <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>{new Date(incident.reported_at).toLocaleString()}</small>
              </div>
              <button className={`btn btn-primary btn-sm`} onClick={() => toggleExpand(incident.id)}>
                {expandedIds.has(incident.id) ? 'Hide Details' : 'View Details'}
              </button>
            </div>
            {expandedIds.has(incident.id) && (
              <div className="mt-2 fst-italic p-3 rounded" style={{
                backgroundColor: theme === 'dark' ? '#444' : '#e0f7fa',
                color: theme === 'dark' ? '#ddd' : '#00796b'
              }}>
                {incident.description}
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="card p-3">
        <h2 className="mb-3">Report New Incident</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="title" className="form-label fw-semibold">Title:</label>
            <input
              id="title"
              name="title"
              type="text"
              className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
              value={formData.title}
              onChange={handleInputChange}
            />
            {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label fw-semibold">Description:</label>
            <textarea
              id="description"
              name="description"
              className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
            />
            {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="severity" className="form-label fw-semibold">Severity:</label>
          <select id="severity" name="severity" className="form-select" value={formData.severity} onChange={handleInputChange} style={{color: formData.severity === 'Low' ? '#2e7d32' : formData.severity === 'Medium' ? '#f9a825' : '#c62828', backgroundColor: formData.severity === 'Low' ? '#dcedc8' : formData.severity === 'Medium' ? '#fff9c4' : '#ffcdd2'}}>
            <option value="Low" style={{color: '#2e7d32', backgroundColor: '#dcedc8'}}>Low</option>
            <option value="Medium" style={{color: '#f9a825', backgroundColor: '#fff9c4'}}>Medium</option>
            <option value="High" style={{color: '#c62828', backgroundColor: '#ffcdd2'}}>High</option>
          </select>
          </div>

          <button type="submit" className="btn btn-primary">Report Incident</button>
        </form>
      </div>
    </div>
  )
}

export default App
