"use strict";

App.directive("ngEnter",function  () {
	return function  (scope,elem) {
		$(elem).keyup(function  (e) {
			//Enter Keycode is 13
			if (e.keyCode === 13) {
				scope.$apply(function  () {
					scope.addTask();//Chama o metodo addTask
				});
			}
		});
	};
});