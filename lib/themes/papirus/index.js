var fs = require('fs')
var path = require('path')
var Handlebars = require('handlebars')
var moment = require('moment')
var pluralize = require('pluralize')

function render (resume) {
  // In Next.js, we can access the theme files from the public directory
  let css = '';
  let tpl = '';
  let partialsContent = {};
  
  const cssPath = path.join(process.cwd(), 'public', 'themes', 'papirus', 'style.css');
  css = fs.readFileSync(cssPath, 'utf-8');

  const tplPath = path.join(process.cwd(), 'public', 'themes', 'papirus', 'resume.hbs');
  tpl = fs.readFileSync(tplPath, 'utf-8');

  // Register helpers
  Handlebars.registerHelper({
    formatDate: function (date) {
      if (typeof date === 'undefined') {
        return 'now'
      }
      return moment(date).format('MMM YYYY')
    },
    formatDateYear: function (date) {
      if (typeof date === 'undefined') {
        return 'now'
      }
      return moment(date).format('YYYY')
    },
    networkIcon: function (network) {
      if (network === 'StackOverflow') {
        return 'stack-overflow'
      } else {
        return network.toLowerCase()
      }
    },
    wordWrap: function (str) {
      str = str.replace(/\//g, "/ ");
      return str.replace("/ / ", "//");
    },
    dateDiff: function (startDate, endDate) {
      let text = ''
      startDate = moment(startDate)
      if (endDate === null || endDate === '' || endDate === undefined) {
        endDate = moment()
      } else {
        endDate = moment(endDate)
      }
      let years = endDate.diff(startDate, 'years')
      startDate.add(years, 'years')
      let months = endDate.diff(startDate, 'months')

      if (years > 0) {
        text += `${years} ${pluralize('years', years)}`
      }
      if (months > 0) {
        if (years > 0) {
          text += ' '
        }
        text += `${months} ${pluralize('months', months)}`
      }

      return text
    }
  })

  // Load partials
  const loadPartials = (directory) => {
    try {
      const filenames = fs.readdirSync(directory);
      filenames.forEach(function (filename) {
        var matches = /^([^.]+).hbs$/.exec(filename)
        if (!matches) {
          return
        }
        var name = matches[1]
        var filepath = path.join(directory, filename)
        try {
          var template = fs.readFileSync(filepath, 'utf8')
          Handlebars.registerPartial(name, template)
        } catch (error) {
          console.error(`Error reading partial ${filename}:`, error);
          // Continue without this partial
        }
      });
      return true;
    } catch (error) {
      console.error('Error reading partials directory:', error);
      return false;
    }
  };


  loadPartials(path.join(process.cwd(), 'public', 'themes', 'papirus', 'partials'));
  
  return Handlebars.compile(tpl)({
    css: css,
    resume: resume
  })
}

function exportPdf (resumeFile, pageFormat) {
  let resume = require(path.join(__dirname, resumeFile))
  const pdf = require('html-pdf')
  const template = render(resume, pageFormat)

  pdf.create(template, {format: pageFormat}).toFile('./resume.pdf', function (err, res) {
    if (err) return console.log(err)
  })
}

module.exports = {
  render: render,
  exportPdf: exportPdf
}
