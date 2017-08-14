const date = new Date()

const config = {
  baseUrl: 'http://localhost:5000',
  siteTitle: 'My Awesome Site',  
  targetDirectory: `${date.getFullYear()}-${('0' + Number(date.getMonth() + 1)).substring(-2)}-${date.getDate()}`,
  resolutions: [
    '320x992',
    '480x992',
    '768x992',
    '992x992',
    '1200x992'
  ]
}

module.exports = config
