const Pageres = require('pageres')
const rimraf = require('rimraf')
var fs = require('fs')

// Update These
const baseUrl = 'http://localhost:5000'
const siteTitle = 'My Awesome Site'
const siteMap = {
  home: {
    url: '',
    children: {
      album: {
        url: '/album.html'
      },
      cover: {
        url: '/cover.html'
      }
    }
  }
}

const resolutions = [
  '320x992',
  '480x992',
  '768x992',
  '992x992',
  '1200x992'
]

// Optional
const baseDirectory = '/screenshots'
const date = new Date()
const dateFormat = `${date.getFullYear()}-${('0' + Number(date.getMonth() + 1)).substring(-2)}-${date.getDate()}`
const templateName = 'screenshots-template.html'
const templateTarget = `${__dirname}/${baseDirectory}/${dateFormat}/index.html`
let html = ''

const createScreenshots = () => {
  const totalWidth = resolutions.reduce((total, item) => {
    return total = parseFloat(total) + parseFloat(item.split('x')[0])
  })

  const percentages = resolutions.map((item) => {
    return total = (parseFloat(item.split('x')[0] / totalWidth) * (100 - resolutions.length).toFixed(2))
  })

  rimraf(`${__dirname}/${baseDirectory}`, () => {
    fs.mkdirSync(__dirname + '/' + baseDirectory)
    fs.mkdirSync(__dirname + '/' + baseDirectory + '/' + dateFormat)
    fs.createReadStream(templateName).pipe(fs.createWriteStream(templateTarget))
    loopSiteMap(siteMap)
    fs.readFile(templateTarget, 'utf8', function (err, text) {
      if (err) {
        console.log(err)
      } else {
        text = text.replace('SCREENSHOTS_HTML', html)
        text = text.replace('SCREENSHOTS_TITLE', siteTitle + ' - Screenshots')
        fs.writeFile(templateTarget, text, function (err) {
          if (err) {
            console.log(err);
          }
        })
      }
    })
  })

  const updateHtml = (slug, title) => {
    html += `<div><h1><a target="_blank" href="${baseUrl}${slug}">${title} - ${baseUrl}${slug}</a></h1>` + resolutions.map((resolution, index) => {
      return total = `<div class="img-container" style="width:${percentages[index]}%"><h3>${resolution}</h3><a target="_blank" href="./${title}/${resolution}.png"><img src="./${title}/${resolution}.png" /></a></div>`
    }).join('') + '</div>'
  }

  const createScreenshot = (slug, title) => {
    console.log(title + ' - creating screenshot...')
    const dest = `${__dirname}/${baseDirectory}/${dateFormat}/${title}`
    new Pageres({ delay: 2 })
      .src(baseUrl + slug, resolutions, { filename: '<%= size %>' })
      .dest(dest)
      .run()
      .then(() => console.log(title + ' - done'));
  }

  const loopSiteMap = (page) => {
    Object.keys(page).forEach(key => {
      createScreenshot(page[key].url, key)
      updateHtml(page[key].url, key)
      if (page[key].children) {
        loopSiteMap(page[key].children)
      }
    })
  }
}

createScreenshots()
