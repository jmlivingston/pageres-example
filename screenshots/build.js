const Pageres = require('pageres')
const rimraf = require('rimraf')
const fs = require('fs')

const config = require('./config')
const siteMap = require('./siteMap')

const baseDirectory = `${__dirname}/output`
const targetDirectory = `${baseDirectory}/${config.targetDirectory}`
const templateName = `${__dirname}/template.html`
const templateTarget = `${targetDirectory}/index.html`
let html = ''
const totalWidth = config.resolutions.reduce((total, item) => {
  return total = parseFloat(total) + parseFloat(item.split('x')[0])
})

const percentages = config.resolutions.map((item) => {
  const percent = item.split('x')[0] / totalWidth
  return parseFloat(percent) * (100 - config.resolutions.length).toFixed(2)
})

const rebuildDirectory = cb => {
  if (!fs.existsSync(baseDirectory)) {
    fs.mkdirSync(baseDirectory)
  }
  rimraf(targetDirectory, () => {
    fs.mkdirSync(targetDirectory)
    cb()
  })
}

const buildHtmlFile = () => {
  fs.createReadStream(templateName)
    .pipe(fs.createWriteStream(templateTarget))
  fs.readFile(templateTarget, 'utf8', function (err, text) {
    if (err) {
      console.log(err)
    } else {
      text = text.replace('SCREENSHOTS_HTML', html)
      text = text.replace('SCREENSHOTS_TITLE', config.siteTitle + ' - Screenshots')
      fs.writeFile(templateTarget, text, function (err) {
        if (err) {
          console.log(err)
        }
      })
    }
  })
}

const updateHtml = (slug, title) => {
  html += `<div>`
  html += `<h1>
              <a target="_blank" href="${config.baseUrl}${slug}">
                ${title} - ${config.baseUrl}${slug}
              </a>
            </h1>`
  html += config.resolutions.map((resolution, index) => (
    `<div class="img-container" style="width:${percentages[index]}%">
      <h3>${resolution}</h3>
      <a target="_blank" href="./${title}/${resolution}.png">
        <img src="./${title}/${resolution}.png" />
      </a>
    </div>`
  )).join('')
  html += '</div>'
}

const createScreenshot = (slug, title) => {
  console.log(title + ' - creating screenshot...')
  const dest = `${targetDirectory}/${title}`
  new Pageres({ delay: 2 })
    .src(config.baseUrl + slug, config.resolutions, { filename: '<%= size %>' })
    .dest(dest)
    .run()
    .then(() => console.log(title + ' - done'))
}

const loopSiteMap = (pages) => {
  pages.forEach(page => {
    createScreenshot(page.url, page.title)
    updateHtml(page.url, page.title)
    if (page.children) {
      loopSiteMap(page.children)
    }
  })
}

rebuildDirectory(() => {
  loopSiteMap(siteMap)
  buildHtmlFile()
  console.log('HTML File Available Here:')
  console.log(templateTarget)
})
