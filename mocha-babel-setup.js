// https://stackoverflow.com/questions/20049790/how-to-pass-compiler-options-to-mocha

require("babel-register")({
  "presets": ["es2015", "stage-0", "react"],
  ignore: function(path) {
    if (path.match(/react-native/)) {
      return false
    } else if (path.match(/node_modules/)) {
      return true
    } else {
      return false
    }
  },
});
