import { useState, useEffect } from 'react';
import { blogAPI } from '../../api';
import { useToast } from '../../context/ToastContext';

export default function BlogPage() {
  const toast = useToast();
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState({});
  const [saving,  setSaving]  = useState(false);
  const [err,     setErr]     = useState('');
  const PER = 10;

  const load = async () => {
    setLoading(true);
    try {
      const r = await blogAPI.getAll(page, PER);
      const data = r.data?.data ?? r.data;
      setRows(Array.isArray(data) ? data : []);
    } catch { toast('Failed to load blogs', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page]);

  const openAdd = () => {
    setForm({ title: '', category: '', img: '', shortDescription: '', description: '' });
    setErr('');
    setModal('add');
  };

  const openEdit = (row) => {
    setForm({ _id: row._id, title: row.title || '', category: row.category || '', img: row.img || '', shortDescription: row.shortDescription || '', description: row.description || '' });
    setErr('');
    setModal('edit');
  };

  const close = () => { setModal(false); setErr(''); };

  const handleSave = async () => {
    setErr('');
    if (!form.title || !form.category || !form.shortDescription || !form.description) {
      setErr('Title, category, short description and description are required.'); return;
    }
    setSaving(true);
    try {
      if (modal === 'add') {
        await blogAPI.create(form);
        toast('Blog created!', 'success');
      } else {
        await blogAPI.update(form._id, form);
        toast('Blog updated!', 'success');
      }
      close();
      load();
    } catch(e) {
      setErr(e.response?.data?.message || 'Something went wrong');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      await blogAPI.remove(id);
      toast('Deleted', 'success');
      load();
    } catch { toast('Delete failed', 'error'); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <div className="section-head">
        <div>
          <div className="section-title">Blog Posts</div>
          <div className="section-count">{rows.length} on this page</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add New</button>
      </div>

      {loading ? (
        <div className="spinner"><div className="spin" /></div>
      ) : rows.length === 0 ? (
        <div className="table-wrap">
          <div className="empty">
            <div className="empty-icon">✦</div>
            <p>No blog posts yet. Write your first article.</p>
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 52 }}>IMG</th>
                <th>TITLE</th>
                <th>CATEGORY</th>
                <th>EXCERPT</th>
                <th>DATE</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row._id}>
                  <td className="td-img">
                    {row.img
                      ? <img src={row.img.startsWith('http') ? row.img : `/api/v1/get-file/${row.img}`} alt="" className="row-img" onError={e => e.target.style.display='none'} />
                      : <div style={{ width:36, height:36, background:'var(--bg3)', borderRadius:6 }} />
                    }
                  </td>
                  <td className="td-main"><span className="truncate">{row.title}</span></td>
                  <td><span className="badge badge-gold">{row.category}</span></td>
                  <td><span className="truncate">{row.shortDescription}</span></td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'2-digit' }) : '—'}
                  </td>
                  <td className="td-actions">
                    <div className="action-btns">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(row)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row._id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div style={{ display:'flex', gap:8, marginTop:16, justifyContent:'center' }}>
        <button className="btn btn-outline btn-sm" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page <= 1}>← Prev</button>
        <span style={{ padding:'5px 14px', fontFamily:'var(--mono)', fontSize:12, color:'var(--muted)' }}>Page {page}</span>
        <button className="btn btn-outline btn-sm" onClick={() => setPage(p => p+1)} disabled={rows.length < PER}>Next →</button>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && close()}>
          <div className="modal" style={{ maxWidth: 720 }}>
            <div className="modal-header">
              <h3>{modal === 'add' ? 'New Blog Post' : 'Edit Blog Post'}</h3>
              <button className="close-btn" onClick={close}>✕</button>
            </div>
            <div className="modal-body">
              {err && <div className="error-banner">{err}</div>}
              <div className="form-grid">
                <div className="form-group">
                  <label>Title *</label>
                  <input value={form.title || ''} onChange={e => set('title', e.target.value)} placeholder="Blog post title" />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <input value={form.category || ''} onChange={e => set('category', e.target.value)} placeholder="e.g. Technology" />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Image URL</label>
                  <input value={form.img || ''} onChange={e => set('img', e.target.value)} placeholder="https://…" />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Short Description *</label>
                  <textarea value={form.shortDescription || ''} onChange={e => set('shortDescription', e.target.value)} rows={2} placeholder="Brief summary for cards…" />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Full Content *</label>
                  <textarea value={form.description || ''} onChange={e => set('description', e.target.value)} rows={8} placeholder="Full article content…" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={close}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : (modal === 'add' ? 'Publish' : 'Save Changes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
