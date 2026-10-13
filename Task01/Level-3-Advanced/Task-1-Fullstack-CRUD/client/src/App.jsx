import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Activity,
  AlertCircle,
  BookOpen,
  ChevronDown,
  GraduationCap,
  Eye,
  Pencil,
  Power,
  LayoutDashboard,
  LoaderCircle,
  Menu,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function requestStudents(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(result.message || `Request failed (${response.status})`)
  }

  return result
}

function App() {
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [year, setYear] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [editingStudentId, setEditingStudentId] = useState(null)
  const [viewingStudent, setViewingStudent] = useState(null)
  const [changingStatusId, setChangingStatusId] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showStudentForm, setShowStudentForm] = useState(false)
  const [savingStudent, setSavingStudent] = useState(false)
  const [formError, setFormError] = useState('')
  const [studentForm, setStudentForm] = useState({
    registration_number: '',
    first_name: '',
    last_name: '',
    email: '',
    course: '',
    year_of_study: '',
    gender: '',
    date_of_birth: '',
    phone: '',
    address: '',
    enrollment_date: '',
  })

  const loadStudents = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set('search', search.trim())
      if (year) params.set('year', year)

      const query = params.toString()
      const result = await requestStudents(
        `/students${query ? `?${query}` : ''}`,
      )

      setStudents(Array.isArray(result.data) ? result.data : [])
    } catch (requestError) {
      setError(requestError.message || 'Unable to load student records.')
    } finally {
      setLoading(false)
    }
  }, [search, year])

 useEffect(() => {
  const timer = setTimeout(() => {
    loadStudents()
  }, 0)

  return () => clearTimeout(timer)
}, [loadStudents])
  const totalStudents = students.length
  const yearCounts = useMemo(
    () =>
      [1, 2, 3, 4, 5].map((studyYear) => ({
        year: studyYear,
        count: students.filter(
          (student) => Number(student.year_of_study) === studyYear,
        ).length,
      })),
    [students],
  )

  function handleStudentFieldChange(event) {
    const { name, value } = event.target
    setStudentForm((current) => ({ ...current, [name]: value }))
  }

  async function handleAddStudent(event) {
    event.preventDefault()
    setSavingStudent(true)
    setFormError('')
    setError('')
    setNotice('')

    const payload = {
      registration_number: studentForm.registration_number.trim(),
      first_name: studentForm.first_name.trim(),
      last_name: studentForm.last_name.trim(),
      email: studentForm.email.trim(),
      course: studentForm.course.trim(),
      year_of_study: Number(studentForm.year_of_study),
      gender: studentForm.gender || null,
      date_of_birth: studentForm.date_of_birth || null,
      phone: studentForm.phone.trim() || null,
      address: studentForm.address.trim() || null,
      enrollment_date: studentForm.enrollment_date || null,
    }

    try {
      const result = await requestStudents(
        editingStudentId ? `/students/${editingStudentId}` : '/students',
        {
          method: editingStudentId ? 'PUT' : 'POST',
          body: JSON.stringify(payload),
        },
      )

      setNotice(result.message || (editingStudentId
        ? 'Student updated successfully.'
        : 'Student added successfully.'))
      setEditingStudentId(null)
      setStudentForm({
        registration_number: '',
        first_name: '',
        last_name: '',
        email: '',
        course: '',
        year_of_study: '',
        gender: '',
        date_of_birth: '',
        phone: '',
        address: '',
        enrollment_date: '',
      })
      setShowStudentForm(false)
      setSearch('')
      setYear('')

      const refreshed = await requestStudents('/students')
      setStudents(Array.isArray(refreshed.data) ? refreshed.data : [])
    } catch (requestError) {
      setFormError(requestError.message || 'Unable to save this student.')
    } finally {
      setSavingStudent(false)
    }
  }

  async function handleDelete(student) {
    const confirmed = window.confirm(
      `Delete ${student.first_name} ${student.last_name} (${student.registration_number})? This action cannot be undone.`,
    )

    if (!confirmed) return

    setDeletingId(student.id)
    setError('')
    setNotice('')

    try {
      const result = await requestStudents(`/students/${student.id}`, {
        method: 'DELETE',
      })
      setNotice(result.message || 'Student deleted successfully.')
      await loadStudents()
    } catch (requestError) {
      setError(requestError.message || 'Unable to delete this student.')
    } finally {
      setDeletingId(null)
    }
  }


  async function handleViewStudent(student) {
    setError('')
    setNotice('')

    try {
      const result = await requestStudents(`/students/${student.id}`)
      setViewingStudent(result.data || result.student || student)
    } catch (requestError) {
      setError(requestError.message || 'Unable to load student details.')
    }
  }

  async function handleEditStudent(student) {
    setFormError('')
    setError('')
    setNotice('')

    try {
      const result = await requestStudents(`/students/${student.id}`)
      const record = result.data || result.student || student

      setStudentForm({
        registration_number: record.registration_number || '',
        first_name: record.first_name || '',
        last_name: record.last_name || '',
        email: record.email || '',
        course: record.course || '',
        year_of_study: String(record.year_of_study || ''),
        gender: record.gender || '',
        date_of_birth: record.date_of_birth
          ? String(record.date_of_birth).slice(0, 10)
          : '',
        phone: record.phone || '',
        address: record.address || '',
        enrollment_date: record.enrollment_date
          ? String(record.enrollment_date).slice(0, 10)
          : '',
      })

      setEditingStudentId(record.id)
      setViewingStudent(null)
      setShowStudentForm(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (requestError) {
      setError(requestError.message || 'Unable to load student for editing.')
    }
  }

  async function handleToggleStudentStatus(student) {
    const nextStatus = student.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    setChangingStatusId(student.id)
    setError('')
    setNotice('')

    try {
      const result = await requestStudents(`/students/${student.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      })
      setNotice(result.message || `Student status changed to ${nextStatus}.`)
      await loadStudents()
    } catch (requestError) {
      setError(requestError.message || 'Unable to change student status.')
    } finally {
      setChangingStatusId(null)
    }
  }

  return (
    <div className="app-layout">
      <aside className={`sidebar ${mobileMenuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><GraduationCap size={25} /></div>
          <div>
            <strong>StudentHub</strong>
            <span>RECORD MANAGEMENT</span>
          </div>
          <button
            className="icon-button sidebar-close"
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <p className="nav-caption">WORKSPACE</p>
        <nav className="side-nav" aria-label="Main navigation">
          <a className="nav-link" href="#dashboard" onClick={() => setMobileMenuOpen(false)}>
            <LayoutDashboard size={19} /> Dashboard
          </a>
          <a className="nav-link active" href="#students" onClick={() => setMobileMenuOpen(false)}>
            <Users size={19} /> Student Records
            <span className="nav-count">{totalStudents}</span>
          </a>
          <a className="nav-link" href="#reports" onClick={(event) => event.preventDefault()}>
            <Activity size={19} /> Reports
            <span className="coming-soon">Soon</span>
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <BookOpen size={20} />
            <strong>Keep records in order.</strong>
            <p>Manage student information from one place.</p>
          </div>
          <div className="connection-status">
            <span className="status-dot" />
            Student records workspace
          </div>
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            type="button"
            aria-label="Open navigation"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="breadcrumb">Workspace <span>/</span> Student Records</div>
          <div className="topbar-right">
            <span className="today-label">STUDENT ADMINISTRATION</span>
            <div className="profile-avatar">SA</div>
          </div>
        </header>

        <div className="page-content" id="dashboard">
          <section className="welcome-row">
            <div>
              <p className="eyebrow">OVERVIEW</p>
              <h1>Student Records</h1>
              <p className="page-description">
                Manage student information and keep your records up to date.
              </p>
            </div>
            <button
              className="primary-button"
              type="button"
              onClick={() => {
                setShowStudentForm((current) => !current)
                setEditingStudentId(null)
                setFormError('')
                setError('')
                setNotice('')
                setStudentForm({
                  registration_number: '',
                  first_name: '',
                  last_name: '',
                  email: '',
                  course: '',
                  year_of_study: '',
                  gender: '',
                  date_of_birth: '',
                  phone: '',
                  address: '',
                  enrollment_date: '',
                })
              }}
            >
              <Plus size={18} /> Add student
            </button>
          </section>

          {showStudentForm && (
            <section className="student-form-panel" aria-labelledby="student-form-title">
              <div className="student-form-heading">
                <p className="eyebrow">STUDENT DETAILS</p>
                <h2 id="student-form-title">{editingStudentId ? 'Edit student' : 'Add a student'}</h2>
                <p>Enter the student's information below. Fields marked * are required.</p>
              </div>

              {formError && (
                <div className="form-error" role="alert">
                  <AlertCircle size={18} />
                  <span>{formError}</span>
                </div>
              )}

              <form className="student-form" onSubmit={handleAddStudent}>
                <label>
                  Registration number *
                  <input name="registration_number" value={studentForm.registration_number} onChange={handleStudentFieldChange} required maxLength={30} />
                </label>
                <label>
                  First name *
                  <input name="first_name" value={studentForm.first_name} onChange={handleStudentFieldChange} required maxLength={60} />
                </label>
                <label>
                  Last name *
                  <input name="last_name" value={studentForm.last_name} onChange={handleStudentFieldChange} required maxLength={60} />
                </label>
                <label>
                  Email address *
                  <input name="email" type="email" value={studentForm.email} onChange={handleStudentFieldChange} required maxLength={150} />
                </label>
                <label className="form-field-wide">
                  Course *
                  <input name="course" value={studentForm.course} onChange={handleStudentFieldChange} required maxLength={150} />
                </label>
                <label>
                  Year of study *
                  <select name="year_of_study" value={studentForm.year_of_study} onChange={handleStudentFieldChange} required>
                    <option value="">Select year</option>
                    {[1, 2, 3, 4, 5].map((studyYear) => (
                      <option key={studyYear} value={studyYear}>Year {studyYear}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Gender
                  <select name="gender" value={studentForm.gender} onChange={handleStudentFieldChange}>
                    <option value="">Select gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label>
                  Date of birth
                  <input name="date_of_birth" type="date" value={studentForm.date_of_birth} onChange={handleStudentFieldChange} />
                </label>
                <label>
                  Enrollment date
                  <input name="enrollment_date" type="date" value={studentForm.enrollment_date} onChange={handleStudentFieldChange} />
                </label>
                <label>
                  Phone number
                  <input name="phone" type="tel" value={studentForm.phone} onChange={handleStudentFieldChange} maxLength={30} />
                </label>
                <label className="form-field-wide">
                  Address
                  <textarea name="address" rows={3} value={studentForm.address} onChange={handleStudentFieldChange} maxLength={250} />
                </label>
                <div className="form-actions form-field-wide">
                  <button className="secondary-button" type="button" disabled={savingStudent} onClick={() => { setShowStudentForm(false); setEditingStudentId(null); setFormError('') }}>
                    Cancel
                  </button>
                  <button className="primary-button" type="submit" disabled={savingStudent}>
                    {savingStudent ? <LoaderCircle size={18} className="spin" /> : <Plus size={18} />}
                    {savingStudent ? 'Saving...' : editingStudentId ? 'Update student' : 'Save student'}
                  </button>
                </div>
              </form>
            </section>
          )}

          {viewingStudent && (
            <div className="detail-backdrop" role="presentation" onClick={() => setViewingStudent(null)}>
              <section className="student-detail-panel" role="dialog" aria-modal="true" aria-labelledby="student-detail-title" onClick={(event) => event.stopPropagation()}>
                <div className="detail-heading">
                  <div>
                    <p className="eyebrow">STUDENT RECORD</p>
                    <h2 id="student-detail-title">{viewingStudent.first_name} {viewingStudent.last_name}</h2>
                    <p>{viewingStudent.registration_number}</p>
                  </div>
                  <button className="icon-button" type="button" aria-label="Close student details" onClick={() => setViewingStudent(null)}>
                    <X size={19} />
                  </button>
                </div>
                <dl className="student-detail-grid">
                  {[
                    ['Student ID', viewingStudent.id],
                    ['Email', viewingStudent.email],
                    ['Course', viewingStudent.course],
                    ['Year of study', viewingStudent.year_of_study ? `Year ${viewingStudent.year_of_study}` : null],
                    ['Status', viewingStudent.status || 'ACTIVE'],
                    ['Gender', viewingStudent.gender],
                    ['Date of birth', viewingStudent.date_of_birth],
                    ['Phone', viewingStudent.phone],
                    ['Address', viewingStudent.address],
                    ['Enrollment date', viewingStudent.enrollment_date],
                  ].map(([label, value]) => (
                    <div className="detail-field" key={label}>
                      <dt>{label}</dt>
                      <dd>{value || 'Not provided'}</dd>
                    </div>
                  ))}
                </dl>
                <div className="form-actions">
                  <button className="secondary-button" type="button" onClick={() => setViewingStudent(null)}>Close</button>
                  <button className="primary-button" type="button" onClick={() => handleEditStudent(viewingStudent)}>
                    <Pencil size={16} /> Edit student
                  </button>
                </div>
              </section>
            </div>
          )}

          {notice && (
            <div className="notice-banner" role="status">
              <span>{notice}</span>
              <button className="icon-button" type="button" aria-label="Dismiss message" onClick={() => setNotice('')}>
                <X size={17} />
              </button>
            </div>
          )}

          <section className="stats-grid" aria-label="Student summary">
            <article className="stat-card">
              <div className="stat-icon stat-icon-teal"><Users size={21} /></div>
              <p>Total students</p>
              <div className="stat-value">{loading ? '—' : totalStudents}</div>
              <span className="stat-footnote">Records matching current filters</span>
            </article>
            <article className="stat-card">
              <div className="stat-icon stat-icon-blue"><GraduationCap size={21} /></div>
              <p>Courses represented</p>
              <div className="stat-value">
                {loading ? '—' : new Set(students.map((student) => student.course)).size}
              </div>
              <span className="stat-footnote">Distinct courses in this result</span>
            </article>
            <article className="stat-card">
              <div className="stat-icon stat-icon-amber"><BookOpen size={21} /></div>
              <p>Study years represented</p>
              <div className="stat-value">
                {loading ? '—' : yearCounts.filter((item) => item.count > 0).length}
              </div>
              <span className="stat-footnote">Years with student records</span>
            </article>
          </section>

          <section className="records-panel" id="students">
            <div className="panel-heading">
              <div>
                <h2>All students</h2>
                <p>Search, filter, and manage your student records.</p>
              </div>
              <button
                className="secondary-button refresh-button"
                type="button"
                onClick={loadStudents}
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? 'spin' : ''} />
                Refresh
              </button>
            </div>

            <div className="filters-row">
              <label className="search-box">
                <Search size={18} />
                <input
                  type="search"
                  placeholder="Search name, registration number, email..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search students"
                />
                {search && (
                  <button className="clear-search" type="button" aria-label="Clear search" onClick={() => setSearch('')}>
                    <X size={15} />
                  </button>
                )}
              </label>
              <label className="filter-select">
                <SlidersHorizontal size={17} />
                <select value={year} onChange={(event) => setYear(event.target.value)} aria-label="Filter by study year">
                  <option value="">All study years</option>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <option key={item} value={item}>Year {item}</option>
                  ))}
                </select>
                <ChevronDown size={16} />
              </label>
            </div>

            {error && (
              <div className="error-state" role="alert">
                <AlertCircle size={21} />
                <div>
                  <strong>Could not load student records</strong>
                  <p>{error}</p>
                  <button className="text-button" type="button" onClick={loadStudents}>Try again</button>
                </div>
              </div>
            )}

            <div className="table-wrap">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>STUDENT</th>
                    <th>REGISTRATION NO.</th>
                    <th>COURSE</th>
                    <th>YEAR</th>
                    <th>EMAIL</th>
                    <th>STATUS</th>
                    <th className="actions-heading">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7">
                        <div className="table-message">
                          <LoaderCircle size={22} className="spin" />
                          <span>Loading student records...</span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr><td colSpan="7"><div className="table-message">Check the connection and try again.</div></td></tr>
                  ) : students.length === 0 ? (
                    <tr>
                      <td colSpan="7">
                        <div className="empty-state">
                          <div className="empty-icon"><Users size={25} /></div>
                          <strong>No students found</strong>
                          <p>Try another search or change the study-year filter.</p>
                          <button className="secondary-button" type="button" onClick={() => { setSearch(''); setYear('') }}>
                            Clear filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : students.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="student-cell">
                          <div className="student-avatar">
                            {(student.first_name?.[0] || '?').toUpperCase()}
                            {(student.last_name?.[0] || '').toUpperCase()}
                          </div>
                          <div className="student-name">
                            <strong>{student.first_name} {student.last_name}</strong>
                            <span>Student ID: {student.id}</span>
                          </div>
                        </div>
                      </td>
                      <td><span className="registration-number">{student.registration_number}</span></td>
                      <td><span className="course-name">{student.course}</span></td>
                      <td><span className="year-badge">Year {student.year_of_study}</span></td>
                      <td><span className="student-email">{student.email}</span></td>
                      <td>
                        <span className={`status-badge ${(student.status || 'ACTIVE').toLowerCase()}`}>
                          {student.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td>
                        <div className="student-actions">
                          <button className="row-action view-action" type="button"
                            aria-label={`View ${student.first_name} ${student.last_name}`}
                            title="View student" onClick={() => handleViewStudent(student)}>
                            <Eye size={16} />
                          </button>
                          <button className="row-action edit-action" type="button"
                            aria-label={`Edit ${student.first_name} ${student.last_name}`}
                            title="Edit student" onClick={() => handleEditStudent(student)}>
                            <Pencil size={16} />
                          </button>
                          <button className="row-action status-action" type="button"
                            aria-label={`${student.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} ${student.first_name} ${student.last_name}`}
                            title={student.status === 'ACTIVE' ? 'Deactivate student' : 'Activate student'}
                            disabled={changingStatusId === student.id}
                            onClick={() => handleToggleStudentStatus(student)}>
                            {changingStatusId === student.id
                              ? <LoaderCircle size={16} className="spin" />
                              : <Power size={16} />}
                          </button>
                          <button className="row-action delete-button" type="button"
                            aria-label={`Delete ${student.first_name} ${student.last_name}`}
                            title="Delete student" disabled={deletingId === student.id}
                            onClick={() => handleDelete(student)}>
                            {deletingId === student.id
                              ? <LoaderCircle size={16} className="spin" />
                              : <Trash2 size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="table-footer">
              <span>
                {loading ? 'Loading records...' : `Showing ${students.length} student${students.length === 1 ? '' : 's'}`}
              </span>
              <span className="live-data-label"><span className="status-dot" /> Live database records</span>
            </footer>
          </section>

          <footer className="page-footer">
            <span>Student Record Management System</span>
            <span>Connected to the student records API</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
