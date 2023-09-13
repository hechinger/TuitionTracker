# Getting up and running with Tuition tracker

## Requirements
- Node - `brew install node`

## Installation
Install `gulp-cli` and `imagemagick`
- Gulp `npm install -g gulp-cli`
- Imagemagick `brew install imagemagick`

## Usage

#### Getting started
Once you've downloaded the repo, you'll want to install the dependencies needed. To do so, navigate to the root directory of the project in the command line, then run `npm install`.

For our gulp build process to work, you'll also need to create a generic aws.json file. This file is used for publishing our work to aws, but is needed to run the project locally. Use this:

```js
{
  "accessKeyId": "",
  "secretAccessKey": "",
  "params": {
    "Bucket": ""
  }
}
```

I short aside about hosting. The previous iteration of Tuition Tracker lived on Heroku, but that's likely overkill for this version. All of the data lives within this project, in the form of individual static json files for the individual institutions (not a database). You could host this on aws and use the gulp publishing commands, along with the above aws.json file to publish from gulp to AWS. This would require some editing of the gulp publish commands, but we'd be happy to walk anyone who needs that through it.

#### Developing

To run the project locally, from the root directory of the project, type `gulp`. Gulp should open a browser tab with your live preview. If not, you can open a new tab with `localhost:3000`.

While gulp is running, any changes made to the html or javascript will generate an automatic reload of the page. CSS changes will be reflected with live updates of the page.

All development happens within the `src` directory. Within that directory, you'll find directories for `data`, `images`, `js`, `scss` and `templates`.

##### HTML

Inside `templates`, you'll find `base.html`, `index.html`, `map.html` and `school.html`. Most work happens within the `index.html` (for the home page) and `school.html` for the school pages. Any content changes should happen in these files.

However, there are some things that will need to be edited in `base.html`. Facebook credentials that need to be set that can be found toward the top of this file:

```HTML
<meta property="fb:app_id" content="<<client FB app id>>"/>
<meta property="fb:page_id" content="<<client FB page id>>"/>
<meta property="fb:admins" content="<<client FB admins id>>"/>
```

There's some additional Facebook credentials to be added in `index.html`:

```js
window.fbAsyncInit = function () {
  FB.init({
    appId: '<<EWA or Hechinger FB appId here>>', //change this out with EWA appId
    xfbml: true,
    version: 'v2.5'
  });
};
```

In `school.html`, you'll also want to replace the google maps api key, found here:

```js
<script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBNSM8XPyH4oyPnarlDwQJr-CxpPYkGsgo&callback=initMap">
    </script>
```

##### Metadata

As part of the gulp startup process, values from the json object in the `meta.json` file are used to populate meta properties and specific javascript values in the `index.html` and `school.html` file. This is done through Nunjucks templating, and the template tags are denoted by `{{tagname}}`. Before publishing to production, you should populate the `meta.json` file with the appropriate meta information specific to your organization. You may need to edit some of these by hand on the `school.html` page, as urls will differ from your `index.html`.

Note, this templating system only runs when gulp starts. If you change `meta.json` while gulp is running, you'll need to restart gulp for those changes to apply.

##### Final results

With each save in a working file in the src directory, files are compiled, bundled and minified (in the case of css and js), and then moved over to the `dist` directory. The `dist` directory is the directory that gets pushed up to AWS within our build system using the `gulp publish` command. Depending on how/where you want to host Tuition Tracker, the folders/files in `dist` is what you'd want to publish.

#### Where the data lives

The data that powers the Tuition Tracker lives in the individual `data` directories in the `src` and `dist` folders. Changes to files within the `src/data/school-data` directory will be automatically moved to `dist/data/school-data` while gulp is running.

Within the `school-data` directory, you'll find individual .json files named with each school's corresponding `unitid` number. In addition, there is a `merged-final-data.csv` that the individual .json files are built from, along with a `dump-final.py` script that creates the individual json files. 
