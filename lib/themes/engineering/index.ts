import type { ResumeSchema } from '../../../types/json-resume';
import * as handlebars from 'handlebars';

// Register helpers
handlebars.registerHelper({
  formatDate: function(date?: string) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
});

// Create a custom implementation of the engineering theme
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

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${basics?.name || 'Resume'}</title>
      <style>
        body {
          font-family: Georgia, serif;
          font-size: 11px;
          line-height: 1.6;
          margin: 24px 48px;
          color: #333;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        h1 {
          font-size: 26px;
          margin: 5px;
          color: #2c3e50;
        }
        
        h2 {
          border-width: 1px;
          border-style: none none solid none;
          margin: 10px 0 2.5px 0;
          color: #2c3e50;
        }
        
        section {
          margin: 3px 0;
        }
        
        .contact-info {
          margin: 15px 0;
          color: #7f8c8d;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .vertical-separator {
          text-align: center;
          padding: 0 10px;
        }
        
        .vertical-separator:not(:first-child) {
          border-left: 1px solid #000;
        }
        
        .item {
          margin-top: 8px;
        }
        
        .item-header {
          float: left;
          display: block;
        }
        
        .item-header-title {
          font-weight: bold;
          color: #2c3e50;
        }
        
        .item-header-subtitle {
          font-style: italic;
          color: #34495e;
        }
        
        .item-details {
          float: right;
          text-align: right;
          color: #7f8c8d;
        }
        
        .item-details-title {
          font-weight: bold;
        }
        
        .clearfix {
          clear: both;
        }
        
        .centered {
          text-align: center;
        }
        
        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .skill-item {
          background: #f0f3f7;
          padding: 5px 10px;
          border-radius: 3px;
          font-size: 14px;
          color: #2c3e50;
        }
        
        .skill-keywords {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 5px;
        }
        
        .skill-keyword {
          background: #e8f0fe;
          padding: 3px 8px;
          border-radius: 3px;
          font-size: 12px;
          color: #3498db;
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
          gap: 12px;
        }
        
        .interest-item {
          background: #f0f3f7;
          padding: 5px 10px;
          border-radius: 3px;
          font-size: 14px;
          color: #2c3e50;
        }
        
        .interest-keywords {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 5px;
        }
        
        .interest-keyword {
          background: #e8f0fe;
          padding: 3px 8px;
          border-radius: 3px;
          font-size: 12px;
          color: #3498db;
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
          margin: 0;
          padding-left: 20px;
        }
        
        li {
          margin-bottom: 3px;
        }
        
        a {
          text-decoration: none;
          color: black;
        }
        
        @media print {
          @page {
            size: portrait;
            margin: 10mm 25mm;
          }
          body {
            margin: 0;
            padding: 0;
            font-size: 11px;
          }
          .resume {
            max-width: 100%;
            border: 0px;
            background: #fff;
            box-shadow: none;
            -webkit-box-shadow: none;
          }
          .controls {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${basics?.name || ''}</h1>
        <div class="contact-info">
          ${basics?.email ? `
            <div class="vertical-separator">
              <a href="mailto:${basics.email}">${basics.email}</a>
            </div>
          ` : ''}
          ${basics?.phone ? `
            <div class="vertical-separator">
              <a href="tel:${basics.phone}">${basics.phone}</a>
            </div>
          ` : ''}
          ${basics?.location?.city ? `
            <div class="vertical-separator">
              ${basics.location.city}, ${basics.location.region || ''} ${basics.location.postalCode || ''}
            </div>
          ` : ''}
        </div>
        ${basics?.summary ? `<p>${basics.summary}</p>` : ''}
      </div>

      ${work?.length ? `
        <section id="work">
          <h2>Work Experience</h2>
          ${work.map(job => `
            <div class="item">
              <div class="item-header">
                <div class="item-header-title">${job.name || ''}</div>
                <div class="item-header-subtitle">${job.position || ''}</div>
              </div>
              <div class="item-details">
                <div class="item-details-title">${handlebars.helpers.formatDate(job.startDate)} - ${job.endDate ? handlebars.helpers.formatDate(job.endDate) : 'Present'}</div>
                ${job.location ? `<div>${job.location}</div>` : ''}
              </div>
              <div class="clearfix"></div>
              ${job.highlights?.length ? `
                <ul>
                  ${job.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}

      ${volunteer?.length ? `
        <section id="volunteer">
          <h2>Volunteer</h2>
          ${volunteer.map(vol => `
            <div class="item">
              <div class="item-header">
                <div class="item-header-title">${vol.organization || ''}</div>
                <div class="item-header-subtitle">${vol.position || ''}</div>
              </div>
              <div class="item-details">
                <div class="item-details-title">${handlebars.helpers.formatDate(vol.startDate)} - ${vol.endDate ? handlebars.helpers.formatDate(vol.endDate) : 'Present'}</div>
              </div>
              <div class="clearfix"></div>
              ${vol.highlights?.length ? `
                <ul>
                  ${vol.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}

      ${education?.length ? `
        <section id="education">
          <h2>Education</h2>
          ${education.map(edu => `
            <div class="item">
              <div class="item-header">
                <div class="item-header-title">${edu.institution || ''}</div>
                <div class="item-header-subtitle">${edu.studyType || ''} ${edu.area ? `in ${edu.area}` : ''}</div>
              </div>
              <div class="item-details">
                <div class="item-details-title">${handlebars.helpers.formatDate(edu.startDate)} - ${edu.endDate ? handlebars.helpers.formatDate(edu.endDate) : 'Present'}</div>
                ${edu.score ? `<div>Score: ${edu.score}</div>` : ''}
              </div>
              <div class="clearfix"></div>
              ${edu.courses?.length ? `
                <div class="courses">
                  <strong>Courses:</strong> ${edu.courses.join(', ')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}

      ${awards?.length ? `
        <section id="awards">
          <h2>Awards</h2>
          ${awards.map(award => `
            <div class="item">
              <div class="item-header">
                <div class="item-header-title">${award.title || ''}</div>
                <div class="item-header-subtitle">${award.awarder || ''}</div>
              </div>
              <div class="item-details">
                <div class="item-details-title">${handlebars.helpers.formatDate(award.date)}</div>
              </div>
              <div class="clearfix"></div>
              ${award.summary ? `<p>${award.summary}</p>` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}

      ${publications?.length ? `
        <section id="publications">
          <h2>Publications</h2>
          ${publications.map(pub => `
            <div class="item">
              <div class="item-header">
                <div class="item-header-title">${pub.name || ''}</div>
                <div class="item-header-subtitle">${pub.publisher || ''}</div>
              </div>
              <div class="item-details">
                <div class="item-details-title">${handlebars.helpers.formatDate(pub.releaseDate)}</div>
              </div>
              <div class="clearfix"></div>
              ${pub.summary ? `<p>${pub.summary}</p>` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}

      ${skills?.length ? `
        <section id="skills">
          <h2>Skills</h2>
          <div class="skills-list">
            ${skills.map(skill => `
              <div class="skill-item">
                ${skill.name}
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
        <section id="languages">
          <h2>Languages</h2>
          <div class="languages-list">
            ${languages.map(lang => `
              <div class="language-item">
                ${lang.language} - ${lang.fluency}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${interests?.length ? `
        <section id="interests">
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
        </section>
      ` : ''}

      ${references?.length ? `
        <section id="references">
          <h2>References</h2>
          ${references.map(ref => `
            <div class="reference-item">
              <div class="reference-name">${ref.name || ''}</div>
              <div class="reference-text">${ref.reference || ''}</div>
            </div>
          `).join('')}
        </section>
      ` : ''}

      ${projects?.length ? `
        <section id="projects">
          <h2>Projects</h2>
          ${projects.map(project => `
            <div class="item">
              <div class="item-header">
                <div class="item-header-title">${project.name || ''}</div>
                <div class="item-header-subtitle">${project.entity || ''} ${project.type ? `- ${project.type}` : ''}</div>
              </div>
              <div class="item-details">
                ${project.startDate ? `
                  <div class="item-details-title">
                    ${handlebars.helpers.formatDate(project.startDate)} - ${project.endDate ? handlebars.helpers.formatDate(project.endDate) : 'Present'}
                  </div>
                ` : ''}
              </div>
              <div class="clearfix"></div>
              ${project.description ? `<p>${project.description}</p>` : ''}
              ${project.highlights?.length ? `
                <ul>
                  ${project.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}
    </body>
    </html>
  `;
};

export const render = template; 