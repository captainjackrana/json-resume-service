import type { ResumeSchema } from '../../types/json-resume';

const template = (resume: ResumeSchema): string => {
  const { basics, work, education, skills, awards, publications, certificates, projects, volunteer, languages, interests, references } = resume;
  
  // Random font selection
  const fonts = [
    "'Segoe UI', Arial, sans-serif",
    "Verdana, 'Segoe UI', Arial, sans-serif"
  ];
  const selectedFont = fonts[Math.floor(Math.random() * fonts.length)];
  
  // Random social network display preference
  const useNetworkName = Math.random() < 0.5;
  
  // Helper function to format dates
  const formatDate = (date?: string) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatDateRange = (startDate?: string, endDate?: string, usePresent = false) => {
    if(!startDate && !endDate) return '';
    if(!startDate) return formatDate(endDate);
    return `${formatDate(startDate)} - ${endDate ? formatDate(endDate) : usePresent ? 'Present' : ''}`;
  };

  const processEducation = (edu) => {
    if (!edu) return '';
    let score = edu.score || edu.gpa;
    if (score) {
      edu.score = `${score.match(/GPA|%/i) ? `${score}` : `${score} GPA`}`;
    }
  };
  if(education) {
    education.forEach(processEducation);
  }
  if(work){
    work.forEach(job => {
      job.name = job.name || (job.company as string);
    });
  }

  // Compact contact info row
  const contactInfo = [
    basics?.email && `<a href="mailto:${basics.email}" class="contact-item">${basics.email}</a>`,
    basics?.phone && `<span class="contact-item">${basics.phone}</span>`,
    ...(basics?.profiles?.map(profile => {
      if (!profile.url) return null;
      
      const network = profile.network?.toLowerCase();
      const iconMap = {
        'linkedin': 'fa-linkedin-square',
        'github': 'fa-github',
        'twitter': 'fa-twitter',
        'facebook': 'fa-facebook',
        'instagram': 'fa-instagram',
        'youtube': 'fa-youtube',
        'stackoverflow': 'fa-stack-overflow',
        'medium': 'fa-medium',
        'dev.to': 'fa-dev',
        'codepen': 'fa-codepen',
        'dribbble': 'fa-dribbble',
        'behance': 'fa-behance'
      };
      
      const icon = iconMap[network] || 'fa-globe';
      const displayText = useNetworkName ? (network || profile.url) : (profile.username || network || profile.url);
      
      return `<a href="${profile.url}" class="contact-item" target="_blank"><i class='fa ${icon} icon'></i>${displayText}</a>`;
    }) || []),
    basics?.location && (() => {
      const locationParts = [];
      
      // Add address if available
      if (basics.location.address) {
        locationParts.push(basics.location.address);
      }
      
      // Add region only if not already in address
      if (basics.location.region && (!basics.location.address || !basics.location.address.toLowerCase().includes(basics.location.region.toLowerCase()))) {
        locationParts.push(basics.location.region);
      }
      
      // Add city only if not already in address or region
      if (basics.location.city) {
        const addressAndRegion = [basics.location.address, basics.location.region].filter(Boolean).join(' ').toLowerCase();
        if (!addressAndRegion.includes(basics.location.city.toLowerCase())) {
          locationParts.push(basics.location.city);
        }
      }
      
      return locationParts.length > 0 ? `<span class="contact-item">${locationParts.join(', ')}</span>` : null;
    })()
  ].filter(Boolean).join(' <span class="sep">|</span> ');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${basics?.name || 'Resume'}</title>
      <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
      <style>
        body {
          font-family: ${selectedFont};
          background: #fff;
          color: #222;
          margin: 0;
          padding: 0;
          font-size: 0.9rem;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 18px 10px;
        }
        .header {
          text-align: center;
          margin-bottom: 2px;
        }
        .header h1 {
          font-size: 1.89rem;
          font-weight: 700;
          margin: 0 0 2px 0;
          letter-spacing: 1px;
        }
        .contact-row {
          text-align: center;
          font-size: 0.88rem;
          color: #444;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 8px;
          justify-content: center;
        }
        .contact-row a {
          color: #3681b8;
          text-decoration: none;
        }
        .contact-item {
          // color: #3681b8;
          text-decoration: none;
        }
        .contact-item .icon {
          vertical-align: middle;
          margin-right: 4px;
        }
        .sep {
          color: #bbb;
        }
        .summary {
          margin-bottom: 10px;
          color: #444;
          font-size: 0.9rem;
        }
        .section-title {
          font-size: 0.945rem;
          font-weight: bold;
          letter-spacing: 1px;
          text-transform: uppercase;
          border-bottom: 1px solid #bbb;
          margin: 14px 0 6px 0;
          padding-bottom: 1px;
        }
        .entry, .exp-entry, .edu-entry, .award-entry, .pub-entry, .cert-entry, .proj-entry, .vol-entry, .lang-entry, .int-entry, .ref-entry {
          margin-bottom: 7px;
        }
        .entry-header, .exp-header, .edu-header, .award-header, .pub-header, .cert-header, .proj-header, .vol-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .role, .exp-role, .edu-title, .award-title, .pub-title, .cert-title, .proj-title, .vol-title {
          font-weight: 600;
          font-size: 0.9rem;
        }
        .org, .exp-org, .edu-org, .award-org, .pub-org, .cert-org, .proj-org, .vol-org {
          font-style: italic;
          color: #555;
          font-size: 0.88rem;
        }
        .exp-summary {
          color: #444;
          font-size: 0.855rem;
          margin: 2px 0;
          line-height: 1.4;
        }
        .cert-summary {
          color: #444;
          font-size: 0.855rem;
          margin: 2px 0;
          line-height: 1.4;
        }
        .date, .exp-date, .edu-date, .award-date, .pub-date, .cert-date, .proj-date, .vol-date {
          color: #888;
          font-size: 0.855rem;
          margin-left: 10px;
          white-space: nowrap;
        }
        .highlights, .exp-highlights, .proj-highlights, .vol-highlights, .pub-highlights {
          margin: 2px 0 0 0;
          padding-left: 30px;
        }
        .highlights li, .exp-highlights li, .proj-highlights li, .vol-highlights li, .pub-highlights li {
          margin-bottom: 0.3em;
        }
        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 12px;
        }
        .skill-item {
          color: #222;
          font-size: 0.9rem;
        }
        .skill-keywords {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-left: 8px;
        }
        .skill-keyword {
          background: #f0f3f7;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.92em;
        }
        .languages-list, .interests-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .language-item, .interest-item {
          background: #f0f3f7;
          padding: 4px 10px;
          border-radius: 3px;
          font-size: 0.88rem;
          color: #2c3e50;
        }
        .interest-keywords {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-left: 8px;
        }
        .interest-keyword {
          background: #f0f3f7;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.92em;
        }
        .reference-item {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 7px;
        }
        .reference-name {
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 3px;
        }
        .reference-text {
          color: #34495e;
          font-style: italic;
        }
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${basics?.name || ''}</h1>
        </div>
        <div class="contact-row">
          ${contactInfo}
        </div>
        ${basics?.summary ? `
          <div class="section">
            <div class="section-title">Summary</div>
            <div class="summary">${basics.summary}</div>
          </div>
        ` : ''}
        ${work?.length ? `
          <div class="section">
            <div class="section-title">Professional Experience</div>
            ${work.map(job => `
              <div class="exp-entry">
                <div class="exp-header">
                  <span class="exp-role">${job.position || ''}, ${job.name || ''}</span>
                  <span class="exp-date">${formatDateRange(job.startDate, job.endDate, true)}</span>
                </div>
                ${job.location ? `<div class="exp-org">${job.location}</div>` : ''}
                ${job.summary ? `<div class="exp-summary">${job.summary}</div>` : ''}
                ${job.highlights?.length ? `
                  <ul class="exp-highlights">
                    ${job.highlights.map(h => `<li>${h}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${education?.length ? `
          <div class="section">
            <div class="section-title">Education</div>
            ${education.map(edu => `
              <div class="edu-entry">
                <div class="edu-header">
                  <span class="edu-title">${edu.institution || ''}${edu.location ? ', ' + edu.location : ''}</span>
                  <span class="edu-date">${formatDateRange(edu.startDate, edu.endDate, true)}</span>
                </div>
                <div class="edu-org">${edu.studyType || ''}${edu.area ? ' in ' + edu.area : ''}${edu.score ? ' | ' + edu.score : ''}</div>
                ${edu.specialization ? `<div class='edu-specialization'>${edu.specialization}</div>` : ''}
                ${edu.courses?.length ? `<div class='edu-courses'>Courses: ${edu.courses.join(', ')}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${skills?.length ? `
          <div class="section">
            <div class="section-title">Skills</div>
            ${typeof skills[0] === 'string' ? `
              <div>${skills.join(', ')}</div>
            ` : `
              <div>
                ${skills.map(skill => `
                  <div><b>${skill.name || ''}:</b>${skill.keywords?.length ? `&nbsp;&nbsp;${skill.keywords.join(', ')}` : ''}</div>
                `).join('')}
              </div>
            `}
          </div>
        ` : ''}
        ${awards?.length ? `
          <div class="section">
            <div class="section-title">Awards & Honors</div>
            ${awards.map(award => `
              <div class="award-entry">
                <div class="award-header">
                  <span class="award-title">${award.title || ''}</span>
                  <span class="award-date">${formatDate(award.date)}</span>
                </div>
                <div class="award-org">${award.awarder || ''}</div>
                ${award.summary ? `<div class="award-summary">${award.summary}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${certificates?.length ? `
          <div class="section">
            <div class="section-title">Certifications</div>
            ${certificates.map(cert => `
              <div class="cert-entry">
                <div class="cert-header">
                  <span class="cert-title">${cert.name || cert.title || ''}</span>
                  <span class="cert-date">${formatDate(cert.date)}</span>
                </div>
                <div class="cert-org">${cert.issuer || ''}</div>
                ${cert.summary ? `<div class="cert-summary">${cert.summary}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${publications?.length ? `
          <div class="section">
            <div class="section-title">Publications</div>
            ${publications.map(pub => `
              <div class="pub-entry">
                <div class="pub-header">
                  <span class="pub-title">${pub.name || ''}</span>
                  <span class="pub-date">${formatDate(pub.releaseDate)}</span>
                </div>
                <div class="pub-org">${pub.publisher || ''}</div>
                ${pub.summary ? `<div class="pub-highlights">${pub.summary}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${projects?.length ? `
          <div class="section">
            <div class="section-title">Projects</div>
            ${projects.map(project => `
              <div class="proj-entry">
                <div class="proj-header">
                  <span class="proj-title">${project.name || ''}</span>
                  <span class="proj-date">${project.startDate ? formatDate(project.startDate) : ''}${project.endDate ? ' - ' + formatDate(project.endDate) : ''}</span>
                </div>
                ${project.description ? `<div class="proj-desc">${project.description}</div>` : ''}
                ${project.highlights?.length ? `<ul class="proj-highlights">${project.highlights.map(h => `<li>${h}</li>`).join('')}</ul>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${volunteer?.length ? `
          <div class="section">
            <div class="section-title">Volunteer</div>
            ${volunteer.map(vol => `
              <div class="vol-entry">
                <div class="vol-header">
                  <span class="vol-title">${vol.position || ''}, ${vol.organization || ''}</span>
                  <span class="vol-date">${formatDateRange(vol.startDate, vol.endDate, true)}</span>
                </div>
                ${vol.highlights?.length ? `<ul class="vol-highlights">${vol.highlights.map(h => `<li>${h}</li>`).join('')}</ul>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${languages?.length ? `
          <div class="section">
            <div class="section-title">Languages</div>
            ${typeof languages[0] === 'string' ? `
              <div>${languages.join(', ')}</div>
            ` : `
              <div>
                ${languages.map(lang => `
                  <div><b>${lang.language || ''}${lang.fluency ? ':</b>&nbsp;&nbsp;' + lang.fluency : '</b>'}</div>
                `).join('')}
              </div>
            `}
          </div>
        ` : ''}
        ${interests?.length ? `
          <div class="section">
            <div class="section-title">Interests</div>
            ${typeof interests[0] === 'string' ? `
              <div>${interests.join(', ')}</div>
            ` : `
              <div>
                ${interests.map(interest => `
                  <div><b>${interest.name || ''}${interest.keywords?.length ? ':</b>&nbsp;&nbsp;' + interest.keywords.join(', ') : '</b>'}</div>
                `).join('')}
              </div>
            `}
          </div>
        ` : ''}
        ${references?.length ? `
          <div class="section">
            <div class="section-title">References</div>
            ${references.map(ref => `<div class="reference-item"><div class="reference-text">${ref.reference || ''}</div><div class="reference-name">${ref.name || ''}</div></div>`).join('')}
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
};

export const render = template; 