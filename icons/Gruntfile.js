module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    webfont: {
      icons: {
        src: 'svg/*.svg',
        dest: '../src/fonts/svg-icons/',
        options: {
          //fontFilename: 'icons-{hash}',
          hashes: false,
          stylesheet: 'scss',
          relativeFontPath: '../../fonts/svg-icons/',
          templateOptions: {
            baseClass: 'icon-font',
            classPrefix: 'icon-font-',
            mixinPrefix: 'icon-font-'
          }
        }
      }
    }
  });

  grunt.registerTask('default', ['webfont']);
};