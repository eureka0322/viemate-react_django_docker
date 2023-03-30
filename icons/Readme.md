## Installation

This plugin requires Grunt 0.4. Note that `ttfautohint` is optional, but your generated font will not be properly hinted if it’s not installed. And make sure you don’t use `ttfautohint` 0.97 because that version won’t work.

### OS X

```
brew install ttfautohint fontforge --with-python
```

*You may need to use `sudo` for `brew`, depending on your setup.*

*`fontforge` isn’t required for `node` engine (see below).*

:skull: [Notes on experimental WOFF2 support](https://github.com/sapegin/grunt-webfont/wiki/WOFF2-support).

### Linux

```
sudo apt-get install fontforge ttfautohint
```


### RUN
```
npm install
grunt
```

