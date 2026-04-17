import CrudPage from '../../components/CrudPage';
import {
  portfolioAPI, serviceAPI, experienceAPI, educationAPI,
  advantageAPI, testimonialAPI, contactAPI, commentAPI
} from '../../api';

// ── Portfolio ─────────────────────────────────────────────────────
export function PortfolioPage() {
  return (
    <CrudPage
      title="Portfolio"
      api={portfolioAPI}
      imgField="img"
      columns={[
        { key: 'title',    label: 'Title',    main: true },
        { key: 'category', label: 'Category', render: v => v ? <span className="badge badge-gold">{v}</span> : '—' },
        { key: 'link',     label: 'Link',     render: v => v ? <a href={v} target="_blank" rel="noreferrer" style={{ color:'var(--info)', fontSize:12 }}>↗ Visit</a> : '—' },
      ]}
      fields={[
        { key: 'title',    label: 'Title',    required: true },
        { key: 'category', label: 'Category', required: true, placeholder: 'e.g. Web Design' },
        { key: 'img',      label: 'Image URL', fullWidth: true, placeholder: 'https://…' },
        { key: 'link',     label: 'Project Link', fullWidth: true, placeholder: 'https://…' },
      ]}
      emptyMsg="No portfolio items yet. Add your first project."
    />
  );
}

// ── Services ──────────────────────────────────────────────────────
export function ServicesPage() {
  return (
    <CrudPage
      title="Services"
      api={serviceAPI}
      imgField="img"
      columns={[
        { key: 'title',       label: 'Title',       main: true },
        { key: 'description', label: 'Description', render: v => <span className="truncate">{v || '—'}</span> },
      ]}
      fields={[
        { key: 'title',       label: 'Title',       required: true },
        { key: 'img',         label: 'Image URL',   fullWidth: true, placeholder: 'https://…' },
        { key: 'description', label: 'Description', type: 'textarea', fullWidth: true },
      ]}
      emptyMsg="No services listed yet."
    />
  );
}

// ── Experience ────────────────────────────────────────────────────
export function ExperiencePage() {
  return (
    <CrudPage
      title="Experience"
      api={experienceAPI}
      columns={[
        { key: 'title',       label: 'Role',       main: true },
        { key: 'company',     label: 'Company' },
        { key: 'time',        label: 'Period',     render: v => <span className="badge badge-info">{v}</span> },
        { key: 'description', label: 'Summary',    render: v => <span className="truncate">{v}</span> },
      ]}
      fields={[
        { key: 'title',       label: 'Job Title',   required: true },
        { key: 'company',     label: 'Company',     required: true },
        { key: 'time',        label: 'Time Period',  required: true, placeholder: 'e.g. 2020 – 2023' },
        { key: 'description', label: 'Description', required: true, type: 'textarea', fullWidth: true },
      ]}
      emptyMsg="No experience records yet."
    />
  );
}

// ── Education ─────────────────────────────────────────────────────
export function EducationPage() {
  return (
    <CrudPage
      title="Education"
      api={educationAPI}
      columns={[
        { key: 'title',       label: 'Degree/Title', main: true },
        { key: 'institute',   label: 'Institution' },
        { key: 'time',        label: 'Period', render: v => <span className="badge badge-info">{v}</span> },
        { key: 'description', label: 'Details', render: v => <span className="truncate">{v}</span> },
      ]}
      fields={[
        { key: 'title',       label: 'Degree / Title', required: true },
        { key: 'institute',   label: 'Institution',    required: true },
        { key: 'time',        label: 'Time Period',    required: true, placeholder: 'e.g. 2016 – 2020' },
        { key: 'description', label: 'Description',   required: true, type: 'textarea', fullWidth: true },
      ]}
      emptyMsg="No education records yet."
    />
  );
}

// ── Advantages / Skills ───────────────────────────────────────────
export function AdvantagesPage() {
  return (
    <CrudPage
      title="Advantages"
      api={advantageAPI}
      columns={[
        { key: 'title',    label: 'Skill',    main: true },
        { key: 'category', label: 'Category', render: v => v ? <span className="badge badge-gold">{v}</span> : '—' },
        { key: 'percent',  label: 'Level',
          render: (v) => (
            <div style={{ minWidth: 80 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--gold)', marginBottom: 2 }}>{v}%</div>
              <div className="pct-bar"><div className="pct-fill" style={{ width: `${Math.min(v,100)}%` }} /></div>
            </div>
          )},
        { key: 'time',     label: 'Since' },
      ]}
      fields={[
        { key: 'title',    label: 'Skill Title', required: true },
        { key: 'category', label: 'Category',    required: true, placeholder: 'e.g. Frontend' },
        { key: 'percent',  label: '% Level',     required: true, type: 'number', placeholder: '0–100' },
        { key: 'time',     label: 'Since',       required: true, placeholder: 'e.g. 2019' },
      ]}
      emptyMsg="No advantages/skills listed yet."
    />
  );
}

// ── Testimonials ──────────────────────────────────────────────────
export function TestimonialsPage() {
  return (
    <CrudPage
      title="Testimonials"
      api={testimonialAPI}
      imgField="img"
      columns={[
        { key: 'clientName', label: 'Client',   main: true },
        { key: 'address',    label: 'Location' },
        { key: 'feedback',   label: 'Feedback', render: v => <span className="truncate">{v}</span> },
      ]}
      fields={[
        { key: 'clientName', label: 'Client Name', required: true },
        { key: 'address',    label: 'Location',    required: true },
        { key: 'img',        label: 'Avatar URL',  fullWidth: true, placeholder: 'https://…' },
        { key: 'feedback',   label: 'Feedback',    required: true, type: 'textarea', fullWidth: true, rows: 4 },
      ]}
      emptyMsg="No testimonials yet."
    />
  );
}

// ── Contacts ──────────────────────────────────────────────────────
export function ContactsPage() {
  return (
    <CrudPage
      title="Contact Messages"
      api={contactAPI}
      canEdit={false}
      columns={[
        { key: 'name',    label: 'Name',    main: true },
        { key: 'email',   label: 'Email' },
        { key: 'website', label: 'Website', render: v => v ? <a href={v} target="_blank" rel="noreferrer" style={{ color:'var(--info)', fontSize:12 }}>↗ Link</a> : '—' },
        { key: 'message', label: 'Message', render: v => <span className="truncate">{v}</span> },
      ]}
      fields={[
        { key: 'name',    label: 'Name',    required: true },
        { key: 'email',   label: 'Email',   required: true, type: 'email' },
        { key: 'website', label: 'Website' },
        { key: 'message', label: 'Message', required: true, type: 'textarea', fullWidth: true },
      ]}
      emptyMsg="No contact messages yet."
    />
  );
}

// ── Comments ──────────────────────────────────────────────────────
export function CommentsPage() {
  return (
    <CrudPage
      title="Blog Comments"
      api={commentAPI}
      canEdit={false}
      columns={[
        { key: 'name',    label: 'Name',    main: true },
        { key: 'email',   label: 'Email' },
        { key: 'comment', label: 'Comment', render: v => <span className="truncate">{v}</span> },
      ]}
      fields={[
        { key: 'name',    label: 'Name',    required: true },
        { key: 'email',   label: 'Email',   required: true, type: 'email' },
        { key: 'blogID',  label: 'Blog ID', required: true },
        { key: 'comment', label: 'Comment', required: true, type: 'textarea', fullWidth: true },
      ]}
      emptyMsg="No comments yet."
    />
  );
}
