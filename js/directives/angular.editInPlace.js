App.directive( 'editInPlace', function($http) {
  return {
    restrict: 'E',
    scope: {
        value: '=',
        onupdate: '&onupdate'
    },
    template: '<div class="taskName" ng-dblclick="edit()" ng-bind="value.title"></div><input class="taskField" ng-model="value.title"></input>',
    link: function ( $scope, element, attrs ) {
      //Vamos fazer uma referência ao elemento de entrada.
      var inputElement = angular.element( element.children()[1] );
      //Esta diretiva deve ter uma classe definida para que possamos modelá-la.
      element.addClass( 'edit-in-place' );

      // Iniciamos não editando
      $scope.editing = false;

      // funcao do ng-dblclick para ativar o edit-in-place
      $scope.edit = function () {
        $scope.editing = true;
        // Controlamos a exibição através de uma classe na própria diretiva.
        element.addClass( 'active' );

        inputElement.focus();
      };

      // Quando sair do input executa as funcões de update.
      inputElement.on("blur",function  () {
        $scope.onupdate();
        $scope.editing = false;
        element.removeClass( 'active' );
      });

    }
  };
});