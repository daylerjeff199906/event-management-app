'use client'
import React, { useState, FormEvent } from 'react'

export default function SendEmail() {
  const [email, setEmail] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const resetForm = () => {
    setName('')
    setEmail('')
  }

  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault()
    setStatus('idle')
    setMessage('')

    if (!name.trim()) {
      setStatus('error')
      setMessage('Por favor ingresa tu nombre.')
      return
    }

    if (!validateEmail(email)) {
      setStatus('error')
      setMessage('Por favor ingresa un correo válido.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: email,
          toName: name,
          subject: 'Hola desde Brevo + Next.js',
          htmlContent: `<h1>Hola ${name}</h1><p>Gracias por registrarte.</p>`,
          textContent: `Hola ${name}, gracias por registrarte.`
        })
      })
      if (!res.ok) {
        const err = await res.text()
        throw new Error(err || 'Error en la petición')
      }

      const data = await res.json()
      setStatus('success')
      setMessage('Email enviado correctamente.')
      resetForm()
      console.log('send-email response:', data)
    } catch (error: unknown) {
      console.error(error)
      setStatus('error')
      if (error instanceof Error && error.message) {
        setMessage(`No se pudo enviar el email: ${error.message}`)
      } else if (typeof error === 'string' && error.length) {
        setMessage(`No se pudo enviar el email: ${error}`)
      } else {
        setMessage('Ocurrió un error inesperado.')
      }
    } finally {
      setLoading(false)
    }
  }

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      maxWidth: 480,
      margin: '2rem auto',
      padding: '1.25rem',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      background: '#fff',
      fontFamily:
        'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial'
    },
    field: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      marginBottom: 12
    },
    label: { fontSize: 14, fontWeight: 600 },
    input: {
      padding: '10px 12px',
      fontSize: 14,
      borderRadius: 6,
      border: '1px solid #d1d5db',
      outline: 'none'
    },
    button: {
      padding: '10px 14px',
      fontSize: 15,
      borderRadius: 6,
      border: 'none',
      background: '#0066ff',
      color: '#fff',
      cursor: 'pointer'
    },
    buttonDisabled: { background: '#9fb7ff', cursor: 'not-allowed' },
    message: { marginTop: 12, padding: '8px 10px', borderRadius: 6 },
    success: {
      background: '#ecfdf5',
      color: '#065f46',
      border: '1px solid #a7f3d0'
    },
    error: {
      background: '#fff1f2',
      color: '#991b1b',
      border: '1px solid #fecaca'
    },
    hint: { fontSize: 13, color: '#6b7280', marginTop: 8 }
  }

  return (
    <form
      style={styles.container}
      onSubmit={handleSend}
      aria-labelledby="send-email-title"
    >
      <h2 id="send-email-title" style={{ margin: 0, marginBottom: 12 }}>
        Enviar correo
      </h2>

      <div style={styles.field}>
        <label htmlFor="name" style={styles.label}>
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          disabled={loading}
          autoComplete="name"
          required
        />
      </div>

      <div style={styles.field}>
        <label htmlFor="email" style={styles.label}>
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="nombre@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          disabled={loading}
          autoComplete="email"
          required
          aria-invalid={email.length > 0 && !validateEmail(email)}
        />
        <div style={styles.hint}>
          Asegúrate de usar un correo válido para recibir la confirmación.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="submit"
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? 'Enviando…' : 'Enviar Email'}
        </button>

        <button
          type="button"
          onClick={() => {
            setName('')
            setEmail('')
            setStatus('idle')
            setMessage('')
          }}
          style={{
            padding: '10px 14px',
            fontSize: 15,
            borderRadius: 6,
            border: '1px solid #d1d5db',
            background: '#fff',
            cursor: 'pointer'
          }}
          disabled={loading}
        >
          Limpiar
        </button>
      </div>

      {message && (
        <div
          role="status"
          aria-live="polite"
          style={{
            ...styles.message,
            ...(status === 'success' ? styles.success : styles.error)
          }}
        >
          {message}
        </div>
      )}
    </form>
  )
}
