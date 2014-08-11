module.exports = "mjournal.entries";
if (typeof angular !== "undefined") {
  require("angular-resource");
  require("ng-tags-input");
  angular.module(module.exports, ["ngResource", "ngTagsInput"])
    .config(function entriesConfig($locationProvider) {
      $locationProvider.html5Mode(true);
    })
    .controller("entries", require("./EntriesController"))
    .factory("Entries", require("./EntriesService"))
    .directive("editText", require("./editText"))
    .directive("pagination", require("./pagination"));
}