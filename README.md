# pageres example

Some simple scripts for creating screenshots and checking the mobile friendliness of your site. This script will create a base directory based on the date, then subfolders will be added for each individual site. Based on the resolutions you provide, images will then be created using <a target="_blank" title="pageres" href="//github.com/sindresorhus/pageres">pageres</a>.  Finally an static html file will be created for viewing and sharing.

## Instructions

```bash
npm start
```

```bash
npm run screenshots
```

## Sharing Instructions

- Zip the target directory and send or share
- Unzip and open index.html file to view

> **Note:** If you have a ton of screenshots or sending to a large audience, and don't want to risk the wrath of your Exchange admin, I'd recommend copying to a network drive or hosting on a static server. 😀

### Integrate in your own Project

```bash
npm install rimraf pageres --save-dev
```

- copy the **screenshots** directory
- update **screenshots\config.js**
  - **baseUrl** - base url of your site. Just make sure it is running.
  - **siteTitle** - will populate title tag in the HTML file
  - **targetDirectory** -  used for output directory (default is based on date YYYY-MM-DD)
  - **resolutions** - array of resolutions
- update **screenshots\siteMap.js** (If you have a different format, just tweak the loopSiteMap function in build.js)
- ensure your site is up and running
- add the following to your package.json

```javascript
"scripts": {
  "screenshots": "node ./screenshots/build.js"
}
```

```bash
npm run screenshots
```

## Screenshot

- Open HTML file to view screenshots
- Click on title to navigate to page
- Click on images to see them individually

![screenshot](./readme-img.png)

## References

<a target="_blank" title="pageres" href="//github.com/sindresorhus/pageres">pageres</a>
