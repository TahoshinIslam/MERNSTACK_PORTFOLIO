import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { resolveImg } from '../api';
import FileDrop from './FileDrop';

export default function CrudPage({
  title, api, apiArgs = [],
  columns, fields,
  emptyMsg, imgField, canEdit = true,
}) {
  const toast = useToast();
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false); // false | 'add' | row
  const [form,    setForm]    = useState({});
  const [saving,  setSaving]  = useState(false);
  const [err,     setErr]     = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.getAll(...apiArgs);
      const data = r.data?.data ?? r.data;
      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      toast(
        error.response?.status === 401
          ? 'Session expired. Please login again.'
          : 'Failed to load data',
        'error'
      );
    }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    const blank = {};
    fields.forEach(f => { blank[f.key] = f.type === 'gallery' ? [] : ''; });
    setForm(blank);
    setErr('');
    setModal('add');
  };

  const openEdit = (row) => {
    const filled = {};
    fields.forEach(f => {
      if (f.type === 'gallery') {
        filled[f.key] = Array.isArray(row[f.key]) ? row[f.key] : [];
      } else {
        filled[f.key] = row[f.key] ?? '';
      }
    });
    setForm({ ...filled, _id: row._id });
    setErr('');
    setModal(row);
  };

  const close = () => { setModal(false); setErr(''); };

  const handleSave = async () => {
    setErr('');
    for (const f of fields) {
      const v = form[f.key];
      const empty = f.type === 'gallery' ? !v?.length : !v;
      if (f.required && empty) { setErr(`${f.label} is required.`); return; }
    }
    setSaving(true);
    try {
      if (modal === 'add') {
        await api.create(form);
        toast('Created successfully', 'success');
      } else {
        await api.update(form._id, form);
        toast('Updated successfully', 'success');
      }
      close();
      load();
    } catch(e) {
      setErr(e.response?.data?.message || 'Something went wrong');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await api.remove(id);
      toast('Deleted', 'success');
      load();
    } catch (error) {
      toast(
        error.response?.status === 401
          ? 'Session expired. Please login again.'
          : 'Delete failed',
        'error'
      );
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <div className="section-head">
        <div>
          <div className="section-title">{title}</div>
          <div className="section-count">{rows.length} record{rows.length !== 1 ? 's' : ''}</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add New</button>
      </div>

      {loading ? (
        <div className="spinner"><div className="spin" /></div>
      ) : rows.length === 0 ? (
        <div className="table-wrap">
          <div className="empty">
            <div className="empty-icon">◎</div>
            <p>{emptyMsg || 'No records yet.'}</p>
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {imgField && <th style={{ width: 52 }}>IMG</th>}
                {columns.map(c => <th key={c.key}>{c.label}</th>)}
                <th>DATE</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row._id || i}>
                  {imgField && (
                    <td className="td-img">
                      {row[imgField]
                        ? <img src={resolveImg(row[imgField])} alt="" className="row-img" onError={e => e.target.style.display='none'} />
                        : <div style={{ width: 36, height: 36, background: 'var(--bg3)', borderRadius: 6 }} />
                      }
                    </td>
                  )}
                  {columns.map(c => (
                    <td key={c.key} className={c.main ? 'td-main' : ''}>
                      {c.render ? c.render(row[c.key], row) : (
                        <span className={c.truncate !== false ? 'truncate' : ''} title={row[c.key]}>
                          {row[c.key] || <span className="text-muted">—</span>}
                        </span>
                      )}
                    </td>
                  ))}
                  <td style={{ whiteSpace: 'nowrap', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'}
                  </td>
                  <td className="td-actions">
                    <div className="action-btns">
                      {canEdit && (
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(row)}>Edit</button>
                      )}
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row._id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && close()}>
          <div className="modal">
            <div className="modal-header">
              <h3>{modal === 'add' ? 'Add' : 'Edit'} {title}</h3>
              <button className="close-btn" onClick={close}>✕</button>
            </div>
            <div className="modal-body">
              {err && <div className="error-banner">{err}</div>}
              <div className="form-grid">
                {fields.map(f => (
                  <div key={f.key} className={`form-group ${f.fullWidth || f.type === 'image' || f.type === 'gallery' ? 'full' : ''}`}
                       style={(f.fullWidth || f.type === 'image' || f.type === 'gallery') ? { gridColumn: '1/-1' } : {}}>
                    {f.type !== 'image' && f.type !== 'gallery' && (
                      <label>{f.label}{f.required ? ' *' : ''}</label>
                    )}
                    {f.type === 'textarea' ? (
                      <textarea
                        value={form[f.key] || ''}
                        onChange={e => set(f.key, e.target.value)}
                        rows={f.rows || 3}
                        placeholder={f.placeholder}
                      />
                    ) : f.type === 'select' ? (
                      <select value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)}>
                        <option value="">Select…</option>
                        {(f.options || []).map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    ) : f.type === 'image' ? (
                      <FileDrop
                        mode="single"
                        label={`${f.label}${f.required ? ' *' : ''}`}
                        hint={f.hint || 'Drag & drop, or click to upload'}
                        value={form[f.key] || ''}
                        onChange={(v) => set(f.key, v)}
                        accept={f.accept || 'image/*'}
                      />
                    ) : f.type === 'gallery' ? (
                      <FileDrop
                        mode="multiple"
                        label={`${f.label}${f.required ? ' *' : ''}`}
                        hint={f.hint || 'Add additional images (drag & drop or click)'}
                        value={form[f.key] || []}
                        onChange={(v) => set(f.key, v)}
                        accept={f.accept || 'image/*'}
                        maxFiles={f.maxFiles || 10}
                      />
                    ) : (
                      <input
                        type={f.type || 'text'}
                        value={form[f.key] || ''}
                        onChange={e => set(f.key, e.target.value)}
                        placeholder={f.placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={close}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : (modal === 'add' ? 'Create' : 'Save Changes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
