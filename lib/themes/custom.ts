import type { ResumeSchema } from '../../types/json-resume';

const template = (resume: ResumeSchema): string => {
  const { 
    basics, 
    work, 
    education, 
    skills, 
    projects,
    volunteer,
    awards,
    publications,
    languages,
    interests,
    references
  } = resume;

  // Helper function to format dates
  const formatDate = (date?: string) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Contact info row with icons
  const contactInfo = [
    basics?.email && `
      <a href="mailto:${basics.email}" class="contact-item">
        <svg class="icon" viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M20,4H4C2.895,4,2,4.895,2,6V18C2,19.105,2.895,20,4,20H20C21.105,20,22,19.105,22,18V6C22,4.895,21.105,4,20,4M20,8L12,13L4,8V6L12,11L20,6V8Z"/>
        </svg>
        ${basics.email}
      </a>
    `,
    basics?.phone && `
      <a href="tel:${basics.phone}" class="contact-item">
        <svg class="icon" viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M6.62,10.79C8.06,13.62,10.38,15.94,13.21,17.38L15.41,15.18C15.69,14.9,16.08,14.82,16.43,14.93C17.55,15.3,18.75,15.5,20,15.5A1,1,0,0,1,21,16.5V20A1,1,0,0,1,20,21A17,17,0,0,1,3,4A1,1,0,0,1,4,3H7.5A1,1,0,0,1,8.5,4C8.5,5.25,8.7,6.45,9.07,7.57C9.18,7.92,9.1,8.31,8.82,8.59L6.62,10.79Z"/>
        </svg>
        ${basics.phone}
      </a>
    `,
    basics?.profiles?.find(p => p.network?.toLowerCase() === 'linkedin')?.url && `
      <a href="${basics.profiles.find(p => p.network?.toLowerCase() === 'linkedin')?.url}" class="contact-item" target="_blank">
        <svg class="icon" viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z"/>
        </svg>
        LinkedIn
      </a>
    `
  ].filter(Boolean).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${basics?.name || 'Resume'}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          max-width: 800px;
          margin: 40px auto;
          padding: 0 20px;
          color: #333;
        }
        
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        
        h1 {
          margin: 0 0 5px 0;
          color: #2c3e50;
          font-size: 36px;
        }
        
        .contact-info {
          margin: 5px 0;
          color: #7f8c8d;
          display: flex;
          justify-content: center;
          gap: 20px;
        }
        
        .contact-item {
          color: #3498db;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .contact-item:hover {
          text-decoration: underline;
        }
        
        .icon {
          width: 16px;
          height: 16px;
        }
        
        .section {
          margin: 25px 0;
        }
        
        h2 {
          color: #2c3e50;
          border-bottom: 2px solid #3498db;
          padding-bottom: 5px;
          margin-bottom: 15px;
        }
        
        .entry {
          margin-bottom: 20px;
        }
        
        .entry-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        
        .entry-title {
          font-weight: bold;
          color: #2c3e50;
        }
        
        .entry-date {
          color: #7f8c8d;
        }
        
        .entry-subtitle {
          color: #34495e;
          font-style: italic;
        }
        
        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .skill-item {
          padding: 5px 10px;
          border-radius: 3px;
          font-size: 14px;
          color: #2c3e50;
          font-weight: bold;
        }
        
        .skill-keywords {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 5px;
        }
        
        .skill-keyword {
          background: #f0f3f7;
          padding: 3px 8px;
          border-radius: 3px;
          font-size: 12px;
          font-weight: normal;
          color: #2c3e50;
        }
        
        .languages-list {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .language-item {
          background: #f0f3f7;
          padding: 5px 10px;
          border-radius: 3px;
          font-size: 14px;
          color: #2c3e50;
        }
        
        .interests-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .interest-item {
          padding: 5px 10px;
          border-radius: 3px;
          font-size: 14px;
          color: #2c3e50;
          font-weight: bold;
        }
        
        .interest-keywords {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 5px;
        }
        
        .interest-keyword {
          background: #f0f3f7;
          padding: 3px 8px;
          border-radius: 3px;
          font-size: 12px;
          font-weight: normal;
          color: #2c3e50;
        }
        
        .reference-item {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 15px;
        }
        
        .reference-name {
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 5px;
        }
        
        .reference-text {
          color: #34495e;
          font-style: italic;
        }
        
        ul {
          margin: 5px 0;
          padding-left: 20px;
        }
        
        li {
          margin-bottom: 3px;
        }
        
        .entry p {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${basics?.name || ''}</h1>
        <div class="contact-info">
          ${contactInfo}
        </div>
        ${basics?.summary ? `<p>${basics.summary}</p>` : ''}
      </div>

      ${work?.length ? `
        <div class="section">
          <h2>Experience</h2>
          ${work.map(job => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${job.position || ''}</span>
                <span class="entry-date">
                  ${formatDate(job.startDate)} - ${job.endDate ? formatDate(job.endDate) : 'Present'}
                </span>
              </div>
              <div class="entry-subtitle">${job.name || ''}${job.location ? ` - ${job.location}` : ''}</div>
              ${job.summary ? `<p>${job.summary}</p>` : ''}
              ${job.highlights?.length ? `
                <ul>
                  ${job.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${education?.length ? `
        <div class="section">
          <h2>Education</h2>
          ${education.map(edu => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${edu.institution || ''}</span>
                <span class="entry-date">
                  ${formatDate(edu.startDate)} - ${edu.endDate ? formatDate(edu.endDate) : 'Present'}
                </span>
              </div>
              <div class="entry-subtitle">${edu.studyType || ''} ${edu.area ? `in ${edu.area}` : ''}</div>
              ${edu.courses?.length ? `
                <div class="courses">
                  <strong>Courses:</strong> ${edu.courses.join(', ')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${volunteer?.length ? `
        <div class="section">
          <h2>Volunteer</h2>
          ${volunteer.map(vol => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${vol.position || ''}</span>
                <span class="entry-date">
                  ${formatDate(vol.startDate)} - ${vol.endDate ? formatDate(vol.endDate) : 'Present'}
                </span>
              </div>
              <div class="entry-subtitle">${vol.organization || ''}</div>
              ${vol.highlights?.length ? `
                <ul>
                  ${vol.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${awards?.length ? `
        <div class="section">
          <h2>Awards</h2>
          ${awards.map(award => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${award.title || ''}</span>
                <span class="entry-date">${formatDate(award.date)}</span>
              </div>
              <div class="entry-subtitle">${award.awarder || ''}</div>
              ${award.summary ? `<p>${award.summary}</p>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${publications?.length ? `
        <div class="section">
          <h2>Publications</h2>
          ${publications.map(pub => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${pub.name || ''}</span>
                <span class="entry-date">${formatDate(pub.releaseDate)}</span>
              </div>
              <div class="entry-subtitle">${pub.publisher || ''}</div>
              ${pub.summary ? `<p>${pub.summary}</p>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${skills?.length ? `
        <section id="skills">
          <h2>Skills</h2>
          <div class="skills-list">
            ${skills.map(skill => `
              <div class="skill-item">
                ${skill.name || ''}
                ${skill.keywords?.length ? `
                  <div class="skill-keywords">
                    ${skill.keywords.map(keyword => `
                      <span class="skill-keyword">${keyword}</span>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${languages?.length ? `
        <div class="section">
          <h2>Languages</h2>
          <div class="languages-list">
            ${languages.map(lang => `
              <div class="language-item">
                ${lang.language} - ${lang.fluency}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${interests?.length ? `
        <div class="section">
          <h2>Interests</h2>
          <div class="interests-list">
            ${interests.map(interest => `
              <div class="interest-item">
                ${interest.name}
                ${interest.keywords?.length ? `
                  <div class="interest-keywords">
                    ${interest.keywords.map(keyword => `
                      <span class="interest-keyword">${keyword}</span>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${references?.length ? `
        <div class="section">
          <h2>References</h2>
          ${references.map(ref => `
            <div class="reference-item">
              <div class="reference-name">${ref.name || ''}</div>
              <div class="reference-text">${ref.reference || ''}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${projects?.length ? `
        <div class="section">
          <h2>Projects</h2>
          ${projects.map(project => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${project.name || ''}</span>
                ${project.startDate ? `
                  <span class="entry-date">
                    ${formatDate(project.startDate)} - ${project.endDate ? formatDate(project.endDate) : 'Present'}
                  </span>
                ` : ''}
              </div>
              ${project.description ? `<p>${project.description}</p>` : ''}
              ${project.highlights?.length ? `
                <ul>
                  ${project.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </body>
    </html>
  `;
};

export const render = template; 