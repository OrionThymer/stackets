angular.module('stackets.editSnippet', ['ui.ace'])
  .controller('EditSnippetController', function ($scope, $location, Snippets, $stateParams, $state, $http) {
    $scope.topics = {};
    $scope.tags = {};
    $scope.languages = {};
    $scope.code = '';
    $scope.ace = 'javascript';

    Snippets.getSnippetById($stateParams.id).then(function (snippet) {
      console.log(snippet)
      $scope.code = JSON.parse(snippet.snippet);
      $scope.title = snippet.title;
      $scope.shortDescription = snippet.shortDescription;
      $scope.explanation = JSON.parse(snippet.explanation);

    });

    Snippets.getAllTopics().then(function (topics) {
      $scope.topics = topics;
      //console.log('Metadata retrieved from Snippets service: ', JSON.stringify(topics));
    });

    Snippets.getAllTags().then(function (tags) {
      $scope.tags = tags;
    });

    Snippets.getAllLanguages().then(function (languages) {
      $scope.languages = languages;
    });
//the method below will add a snippet using the add snippet form.
    $scope.addSnippet = function (form) {
      this.snippet.snippet = JSON.stringify($scope.code);
      this.snippet.explanation = JSON.stringify(this.snippet.explanation);
      Snippets.addSnippet(this.snippet).then(function(data) {
        $location.path('/snippets/' + data.data.id);
      });
      form.$setPristine();
      form.$setUntouched();
    };
//the method below ties the language selected for the snippet to the ace editor's style guide for that language.
    $scope.setAceEditorLang = function (form) {
      var languageId = Number(this.snippet.LanguageId);
      console.log('Language ID: ', languageId);
      var language;
      for (var i = 0; i < $scope.languages.length; i++) {
        if ($scope.languages[i].id === languageId) {
          language = $scope.languages[i];
          break;
        }
      }
      $scope.ace = language.name;
      $scope._editor.getSession().setMode("ace/mode/" + $scope.ace);
    };
// the method below will modify the text input field for the snippet on the add snippet page to embed the ace editor in its place.
    $scope.aceLoaded = function (_editor) {
      // Ace @ https://ace.c9.io/
    // Ace @ https://github.com/ajaxorg/ace
    // ui-ace @ https://www.npmjs.com/package/angular-ui-ace
    // CDN @ https://cdnjs.com/libraries/ace/
    // Editor font size
      $scope._editor = _editor;
      document.getElementById('editor').style.fontSize='15px';
      // Options
      var _session = _editor.getSession();
      var _renderer = _editor.renderer;
      _editor.setHighlightActiveLine(true);
      _editor.setShowPrintMargin(true);
      _editor.setReadOnly(false);
      // _editor.autoScrollEditorIntoView(true);
      _session.setUseWrapMode(true);
      // Theme @ https://github.com/ajaxorg/ace/tree/master/lib/ace/theme
      _editor.setTheme("ace/theme/cobalt");
      // Mode @ https://github.com/ajaxorg/ace/tree/master/lib/ace/mode
      _session.setMode("ace/mode/" + $scope.ace);
      // Load the snippet's code
      _session.setValue('');
      // Events
      _session.on("change", function(e) {
        // $scope.code = _session.getValue();
      });
    };


//upload edited data to database 
      $scope.update = function() {
        return $http.put('/api/snippets/' + $stateParams.id + '/edit', $scope.snippet)
        console.log('Controller is working')
        $state.go('snippet', {id:$stateParams.id})
      }


  });