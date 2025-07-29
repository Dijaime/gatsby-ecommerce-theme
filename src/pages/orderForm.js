import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import * as styles from './orderForm.module.css';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  deliveryStreet: '',
  deliveryColony: '',
  deliveryState: '',
  deliveryPostal: '',
  pickupStreet: '',
  pickupColony: '',
  pickupState: '',
  pickupPostal: '',
  notes: '',
};

const specialStates = ['CDMX', 'EdoMex', 'Puebla', 'Morelos', 'Hidalgo'];

const OrderFormPage = () => {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  const handleChange = (id, value) => {
    setForm({ ...form, [id]: value });
  };

  const validateStep = () => {
    const err = {};
    if (step === 0) {
      if (!form.name) err.name = 'Requerido';
      if (!form.email) err.email = 'Requerido';
      if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
        err.email = 'Email inválido';
      if (!form.phone) err.phone = 'Requerido';
    }
    if (step === 1) {
      if (!form.deliveryStreet) err.deliveryStreet = 'Requerido';
      if (!form.deliveryColony) err.deliveryColony = 'Requerido';
      if (!form.deliveryState) err.deliveryState = 'Requerido';
      if (!form.deliveryPostal) err.deliveryPostal = 'Requerido';
    }
    if (step === 2) {
      if (!form.pickupStreet) err.pickupStreet = 'Requerido';
      if (!form.pickupColony) err.pickupColony = 'Requerido';
      if (!form.pickupState) err.pickupState = 'Requerido';
      if (!form.pickupPostal) err.pickupPostal = 'Requerido';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const next = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prev = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // send data to backend/shopify
    fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).catch(() => {});
    setStep(step + 1);
  };

  const downloadCSV = () => {
    const csv = Object.entries(form)
      .map(([k, v]) => `${k},"${v}"`)
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pedido.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const showNote =
    specialStates.includes(form.deliveryState) ||
    specialStates.includes(form.pickupState);

  const progress = ((step + 1) / 4) * 100;

  return (
    <Layout disablePaddingBottom>
      <div className={styles.root}>
        <div className={styles.formContainer}>
          <div className={styles.progress}>
            <div
              className={styles.progressBar}
              style={{ width: `${progress}%` }}
            />
          </div>
          <form onSubmit={handleSubmit} noValidate>
            {step === 0 && (
              <div>
                <div className={styles.inputRow}>
                  <label>Nombre completo</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                  {errors.name && (
                    <span className={styles.error}>{errors.name}</span>
                  )}
                </div>
                <div className={styles.inputRow}>
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                  {errors.email && (
                    <span className={styles.error}>{errors.email}</span>
                  )}
                </div>
                <div className={styles.inputRow}>
                  <label>Celular</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                  {errors.phone && (
                    <span className={styles.error}>{errors.phone}</span>
                  )}
                </div>
              </div>
            )}
            {step === 1 && (
              <div>
                <div className={styles.inputRow}>
                  <label>Calle y número</label>
                  <input
                    type="text"
                    value={form.deliveryStreet}
                    onChange={(e) =>
                      handleChange('deliveryStreet', e.target.value)
                    }
                  />
                  {errors.deliveryStreet && (
                    <span className={styles.error}>
                      {errors.deliveryStreet}
                    </span>
                  )}
                </div>
                <div className={styles.inputRow}>
                  <label>Colonia</label>
                  <input
                    type="text"
                    value={form.deliveryColony}
                    onChange={(e) =>
                      handleChange('deliveryColony', e.target.value)
                    }
                  />
                  {errors.deliveryColony && (
                    <span className={styles.error}>
                      {errors.deliveryColony}
                    </span>
                  )}
                </div>
                <div className={styles.inputRow}>
                  <label>Estado</label>
                  <select
                    value={form.deliveryState}
                    onChange={(e) =>
                      handleChange('deliveryState', e.target.value)
                    }
                  >
                    <option value="">Selecciona un estado</option>
                    <option value="CDMX">Ciudad de México</option>
                    <option value="EdoMex">Estado de México</option>
                    <option value="Puebla">Puebla</option>
                    <option value="Morelos">Morelos</option>
                    <option value="Hidalgo">Hidalgo</option>
                  </select>
                  {errors.deliveryState && (
                    <span className={styles.error}>{errors.deliveryState}</span>
                  )}
                </div>
                <div className={styles.inputRow}>
                  <label>Código Postal</label>
                  <input
                    type="text"
                    value={form.deliveryPostal}
                    onChange={(e) =>
                      handleChange('deliveryPostal', e.target.value)
                    }
                  />
                  {errors.deliveryPostal && (
                    <span className={styles.error}>
                      {errors.deliveryPostal}
                    </span>
                  )}
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <div className={styles.inputRow}>
                  <label>Calle y número (recolección)</label>
                  <input
                    type="text"
                    value={form.pickupStreet}
                    onChange={(e) =>
                      handleChange('pickupStreet', e.target.value)
                    }
                  />
                  {errors.pickupStreet && (
                    <span className={styles.error}>{errors.pickupStreet}</span>
                  )}
                </div>
                <div className={styles.inputRow}>
                  <label>Colonia</label>
                  <input
                    type="text"
                    value={form.pickupColony}
                    onChange={(e) =>
                      handleChange('pickupColony', e.target.value)
                    }
                  />
                  {errors.pickupColony && (
                    <span className={styles.error}>{errors.pickupColony}</span>
                  )}
                </div>
                <div className={styles.inputRow}>
                  <label>Estado</label>
                  <select
                    value={form.pickupState}
                    onChange={(e) =>
                      handleChange('pickupState', e.target.value)
                    }
                  >
                    <option value="">Selecciona un estado</option>
                    <option value="CDMX">Ciudad de México</option>
                    <option value="EdoMex">Estado de México</option>
                    <option value="Puebla">Puebla</option>
                    <option value="Morelos">Morelos</option>
                    <option value="Hidalgo">Hidalgo</option>
                  </select>
                  {errors.pickupState && (
                    <span className={styles.error}>{errors.pickupState}</span>
                  )}
                </div>
                <div className={styles.inputRow}>
                  <label>Código Postal</label>
                  <input
                    type="text"
                    value={form.pickupPostal}
                    onChange={(e) =>
                      handleChange('pickupPostal', e.target.value)
                    }
                  />
                  {errors.pickupPostal && (
                    <span className={styles.error}>{errors.pickupPostal}</span>
                  )}
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <h3>Resumen</h3>
                <pre>{JSON.stringify(form, null, 2)}</pre>
                {showNote && (
                  <div className={styles.note}>
                    Los costos de entrega se calcularán posteriormente.
                  </div>
                )}
                <button type="button" onClick={downloadCSV}>
                  Descargar CSV
                </button>
              </div>
            )}
            <div className={styles.buttons}>
              {step > 0 && (
                <button type="button" onClick={prev}>
                  Anterior
                </button>
              )}
              {step < 3 && (
                <button type="button" onClick={next}>
                  Siguiente
                </button>
              )}
              {step === 3 && <button type="submit">Enviar</button>}
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default OrderFormPage;
