import type { ResumeSchema } from '../../types/json-resume';

// Simple hash function for deterministic variations
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Generate variation seed from resume content
const generateVariationSeed = (resume: ResumeSchema): number => {
  const resumeString = JSON.stringify(resume);
  return hashString(resumeString);
};

// Default variations (no randomization - original style)
const getDefaultVariations = () => {
  return {
    font: "'Segoe UI', Arial, sans-serif",
    titleStyle: { transform: 'uppercase', weight: 700, letterSpacing: '1px' },
    contactSeparator: '|',
    borderStyle: { style: 'solid', width: '1px' },
    bullet: '•',
    colors: {
      text: '#222',
      secondary: '#444',
      link: '#3681b8',
      border: '#bbb'
    },
    fontSize: {
      body: 0.9,
      heading: 1.3,
      sectionTitle: 0.945
    },
    fontWeight: {
      body: 400,
      role: 600
    },
    borderRadius: 3,
    spacingMultiplier: 1.0,
    useNetworkName: false,
    useFullUrlsAndNoBlueLinks: false,
    sectionTitleAlignment: 'left',
    workExperienceTitle: 'Professional Experience'
  };
};

// Variation configuration generator
const generateVariations = (seed: number) => {
  // Use seed to create a pseudo-random number generator
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // Font families (ATS-safe)
  const fonts = [
    "'Segoe UI', Arial, sans-serif",
    "Verdana, 'Segoe UI', Arial, sans-serif",
    "Calibri, Arial, sans-serif",
    "Tahoma, Arial, sans-serif",
    "Arial, sans-serif",
    "'Times New Roman', Georgia, serif",
    "Helvetica, Arial, sans-serif",
    "Georgia, 'Times New Roman', serif"
  ];

  // Section title styles
  const titleStyles = [
    { transform: 'uppercase', weight: 700, letterSpacing: '1px' },
    { transform: 'capitalize', weight: 600, letterSpacing: '0.5px' },
    { transform: 'none', weight: 700, letterSpacing: '1px' },
    { transform: 'uppercase', weight: 600, letterSpacing: '1.2px' }
  ];

  // Contact separator styles
  const contactSeparators = ['|', '•', '·'];

  // Border styles
  const borderStyles = [
    { style: 'solid', width: '1px' },
    { style: 'solid', width: '2px' },
    { style: 'solid', width: '3px' },
    //{ style: 'solid', width: '4px' },
    //{ style: 'dotted', width: '1px' },
    //{ style: 'dashed', width: '1px' }
  ];

  // Bullet styles
  const bulletStyles = ['•', '-'];

  // Color variations (subtle)
  const textColors = ['#222', '#222'];
  const secondaryColors = ['#444', '#444'];
  const linkColors = ['#3681b8', '#3a7ab8'];
  const borderColors = ['#bbb', '#222'];

  // Spacing variations (minor)
  const spacingMultipliers = [1.0, 0.95, 1.05, 1.0];

  const fontIndex = Math.floor(random() * fonts.length);
  const titleStyleIndex = Math.floor(random() * titleStyles.length);
  const separatorIndex = Math.floor(random() * contactSeparators.length);
  const borderStyleIndex = Math.floor(random() * borderStyles.length);
  const bulletIndex = Math.floor(random() * bulletStyles.length);
  const textColorIndex = Math.floor(random() * textColors.length);
  const secondaryColorIndex = Math.floor(random() * secondaryColors.length);
  const linkColorIndex = Math.floor(random() * linkColors.length);
  const borderColorIndex = Math.floor(random() * borderColors.length);
  const spacingIndex = Math.floor(random() * spacingMultipliers.length);

  // Font size variations (±0.05rem)
  const baseFontSize = 0.9;
  const fontSizeVariation = (random() - 0.5) * 0.1;
  const bodyFontSize = baseFontSize + fontSizeVariation;
  const headingFontSize = 1.2 + fontSizeVariation * 1;
  const sectionTitleFontSize = 0.945 + fontSizeVariation;

  // Font weight variations
  const bodyFontWeight = 400 + Math.floor(random() * 3) * 50; // 400, 450, 500
  const roleFontWeight = 600 + Math.floor(random() * 2) * 50; // 600, 650

  // Border radius variations
  const borderRadiusVariations = [3, 4, 5, 3];
  const borderRadius = borderRadiusVariations[Math.floor(random() * borderRadiusVariations.length)];

  // Spacing variations
  const spacingMultiplier = spacingMultipliers[spacingIndex];

  // Variation: Use full URLs and remove blue color from contact links
  const useFullUrlsAndNoBlueLinks = random() < 0.5;

  // Variation: Section title alignment (center vs left)
  const sectionTitleAlignments = ['left', 'center'];
  const sectionTitleAlignment = sectionTitleAlignments[Math.floor(random() * sectionTitleAlignments.length)];

  // Variation: Work experience section title
  const workExperienceTitles = ['Professional Experience', 'Work Experience'];
  const workExperienceTitle = workExperienceTitles[Math.floor(random() * workExperienceTitles.length)];

  return {
    font: fonts[fontIndex],
    titleStyle: titleStyles[titleStyleIndex],
    contactSeparator: contactSeparators[separatorIndex],
    borderStyle: borderStyles[borderStyleIndex],
    bullet: bulletStyles[bulletIndex],
    colors: {
      text: textColors[textColorIndex],
      secondary: secondaryColors[secondaryColorIndex],
      link: linkColors[linkColorIndex],
      border: borderColors[borderColorIndex]
    },
    fontSize: {
      body: bodyFontSize,
      heading: headingFontSize,
      sectionTitle: sectionTitleFontSize
    },
    fontWeight: {
      body: bodyFontWeight,
      role: roleFontWeight
    },
    borderRadius,
    spacingMultiplier,
    useNetworkName: random() < 0.5,
    useFullUrlsAndNoBlueLinks,
    sectionTitleAlignment,
    workExperienceTitle
  };
};

const template = (resume: ResumeSchema): string => {
  const { basics, work, education, skills, awards, publications, certificates, projects, volunteer, languages, interests, references } = resume;
  
  // Check if variations are enabled (default: true for backward compatibility)
  // Can be set via resume.meta?.enableVariations or resume.enableVariations
  const enableVariations = resume.enableVariations;
  
  // Generate variations or use defaults
  const vars = enableVariations 
    ? (() => {
        const seed = resume.variationSeed ? hashString(resume.variationSeed + '') : generateVariationSeed(resume);
        return generateVariations(seed);
      })()
    : getDefaultVariations();
  
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
    const end = endDate ? formatDate(endDate) : (usePresent ? 'Present' : '');
    return `${formatDate(startDate)} - ${end}`;
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
      
      // Check if URL contains special characters
      const hasSpecialChars = /[%&?=#+@]/.test(profile.url);
      
      // Determine display text based on variations
      let displayText;
      if (hasSpecialChars && (network === 'linkedin' || network)) {
        // If URL has special characters, show just the network name
        displayText = network || 'Social';
      } else if (vars.useFullUrlsAndNoBlueLinks && (network === 'linkedin' || network === 'github')) {
        // Show full URL for LinkedIn and GitHub when this variation is active
        displayText = profile.url;
      } else if (vars.useNetworkName) {
        displayText = network || profile.url;
      } else {
        displayText = profile.username || network || profile.url;
      }
      
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
  ].filter(Boolean).join(` <span class="sep">${vars.contactSeparator}</span> `);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${basics?.name || 'Resume'}</title>
      <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
      <style>
        body {
          font-family: ${vars.font};
          background: #fff;
          color: ${vars.colors.text};
          margin: 0;
          padding: 0;
          font-size: ${vars.fontSize.body}rem;
          font-weight: ${vars.fontWeight.body};
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: ${18 * vars.spacingMultiplier}px ${10 * vars.spacingMultiplier}px;
        }
        .header {
          text-align: center;
          margin-bottom: ${2 * vars.spacingMultiplier}px;
        }
        .header h1 {
          font-size: ${vars.fontSize.heading}rem;
          font-weight: 700;
          margin: 0 0 ${2 * vars.spacingMultiplier}px 0;
          letter-spacing: 1px;
        }
        .contact-row {
          text-align: center;
          font-size: ${0.88 * vars.fontSize.body}rem;
          color: ${vars.colors.secondary};
          display: flex;
          flex-wrap: wrap;
          gap: ${8 * vars.spacingMultiplier}px;
          margin-bottom: ${8 * vars.spacingMultiplier}px;
          justify-content: center;
        }
        .contact-row a {
          color: ${vars.useFullUrlsAndNoBlueLinks ? vars.colors.secondary : vars.colors.link};
          text-decoration: none;
        }
        .contact-item {
          text-decoration: none;
        }
        .contact-item .icon {
          vertical-align: middle;
          margin-right: ${4 * vars.spacingMultiplier}px;
        }
        .sep {
          color: ${vars.colors.border};
        }
        .summary {
          margin-bottom: ${10 * vars.spacingMultiplier}px;
          color: ${vars.colors.secondary};
          font-size: ${vars.fontSize.body}rem;
        }
        .section-title {
          font-size: ${vars.fontSize.sectionTitle}rem;
          font-weight: ${vars.titleStyle.weight};
          letter-spacing: ${vars.titleStyle.letterSpacing};
          text-transform: ${vars.titleStyle.transform};
          text-align: ${vars.sectionTitleAlignment};
          border-bottom: ${vars.borderStyle.width} ${vars.borderStyle.style} ${vars.colors.border};
          margin: ${14 * vars.spacingMultiplier}px 0 ${6 * vars.spacingMultiplier}px 0;
          padding-bottom: ${1 * vars.spacingMultiplier}px;
        }
        .entry, .exp-entry, .edu-entry, .award-entry, .pub-entry, .cert-entry, .proj-entry, .vol-entry, .lang-entry, .int-entry, .ref-entry {
          margin-bottom: ${7 * vars.spacingMultiplier}px;
        }
        .entry-header, .exp-header, .edu-header, .award-header, .pub-header, .cert-header, .proj-header, .vol-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .role, .exp-role, .edu-title, .award-title, .pub-title, .cert-title, .proj-title, .vol-title {
          font-weight: ${vars.fontWeight.role};
          font-size: ${vars.fontSize.body}rem;
        }
        .org, .exp-org, .edu-org, .award-org, .pub-org, .cert-org, .proj-org, .vol-org {
          font-style: italic;
          color: ${vars.colors.secondary};
          //font-size: ${0.88 * vars.fontSize.body}rem;
        }
        .exp-summary {
          color: ${vars.colors.secondary};
          //font-size: ${0.855 * vars.fontSize.body}rem;
          margin: ${2 * vars.spacingMultiplier}px 0;
          line-height: 1.4;
        }
        .cert-summary {
          color: ${vars.colors.secondary};
          //font-size: ${0.855 * vars.fontSize.body}rem;
          margin: ${2 * vars.spacingMultiplier}px 0;
          line-height: 1.4;
        }
        .date, .exp-date, .edu-date, .award-date, .pub-date, .cert-date, .proj-date, .vol-date {
          color: #888;
          //font-size: ${0.855 * vars.fontSize.body}rem;
          margin-left: ${10 * vars.spacingMultiplier}px;
          white-space: nowrap;
        }
        .highlights, .exp-highlights, .proj-highlights, .vol-highlights, .pub-highlights {
          margin: ${2 * vars.spacingMultiplier}px 0 0 0;
          padding-left: ${30 * vars.spacingMultiplier}px;
          list-style: none;
        }
        .highlights li, .exp-highlights li, .proj-highlights li, .vol-highlights li, .pub-highlights li {
          margin-bottom: ${0.3 * vars.spacingMultiplier}em;
        }
        .highlights li:before, .exp-highlights li:before, .proj-highlights li:before, .vol-highlights li:before, .pub-highlights li:before {
          content: "${vars.bullet} ";
          margin-right: ${4 * vars.spacingMultiplier}px;
        }
        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: ${6 * vars.spacingMultiplier}px ${12 * vars.spacingMultiplier}px;
        }
        .skill-item {
          color: ${vars.colors.text};
          font-size: ${vars.fontSize.body}rem;
        }
        .skill-keywords {
          display: flex;
          flex-wrap: wrap;
          gap: ${4 * vars.spacingMultiplier}px;
          margin-left: ${8 * vars.spacingMultiplier}px;
        }
        .skill-keyword {
          background: #f0f3f7;
          padding: ${2 * vars.spacingMultiplier}px ${6 * vars.spacingMultiplier}px;
          border-radius: ${vars.borderRadius}px;
          font-size: 0.92em;
        }
        .languages-list, .interests-list {
          display: flex;
          flex-wrap: wrap;
          gap: ${8 * vars.spacingMultiplier}px;
        }
        .language-item, .interest-item {
          background: #f0f3f7;
          padding: ${4 * vars.spacingMultiplier}px ${10 * vars.spacingMultiplier}px;
          border-radius: ${vars.borderRadius}px;
          font-size: ${0.88 * vars.fontSize.body}rem;
          color: ${vars.colors.text};
        }
        .interest-keywords {
          display: flex;
          flex-wrap: wrap;
          gap: ${4 * vars.spacingMultiplier}px;
          margin-left: ${8 * vars.spacingMultiplier}px;
        }
        .interest-keyword {
          background: #f0f3f7;
          padding: ${2 * vars.spacingMultiplier}px ${6 * vars.spacingMultiplier}px;
          border-radius: ${vars.borderRadius}px;
          font-size: 0.92em;
        }
        .reference-item {
          background: #f8f9fa;
          padding: ${10 * vars.spacingMultiplier}px;
          border-radius: ${vars.borderRadius + 2}px;
          margin-bottom: ${7 * vars.spacingMultiplier}px;
        }
        .reference-name {
          font-weight: bold;
          color: ${vars.colors.text};
          margin-bottom: ${3 * vars.spacingMultiplier}px;
        }
        .reference-text {
          color: ${vars.colors.secondary};
          font-style: italic;
        }
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
        @media print {
          .section {
            page-break-inside: avoid;
            break-inside: avoid;
            orphans: 3;
            widows: 3;
          }
          .section-title {
            page-break-after: avoid;
            break-after: avoid;
          }
          .exp-entry, .edu-entry, .award-entry, .pub-entry, 
          .cert-entry, .proj-entry, .vol-entry {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
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
            <div class="section-title">${vars.workExperienceTitle}</div>
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