/*!
** Task-Sortable-List Example App
** Licensed under the Apache License v2.0
** http://www.apache.org/licenses/LICENSE-2.0
** Built by Jay Kanakiya ( @techiejayk )
**/
"use strict";

var App = angular.module("task", ["ui.sortable"]);

App.controller("TaskCtrl", function ($scope, $http) {

	$scope.init = function () {

		$scope.requestApi('find', '', function(data){

            var lista = [];
            if(data.data != 'false'){
                $.each(data.data, function(index, element){
                    lista[index] = {id: element.id, title: element.title, description: element.description,  done: element.done}
                });

            }

            $scope.model = [
                {
                    name: "Task", list: lista
                }
            ];

            $scope.show = "All";
            $scope.currentShow = 0;
        }, null);
	};

	$scope.addTask = function () {
		/*Should prepend to array*/
        $scope.requestApi('create', {title: $scope.newTask, description : '', done : 0}, function(data){
            $scope.model[$scope.currentShow].list.splice(0, 0, data.data);
            $scope.newTask = "";
        }, null);
	};

    $scope.editTask = function (task) {
        $scope.requestApi('edit', task, null, null);
    };

    $scope.deleteTask = function (item) {
        $scope.requestApi('delete', item.id, function(){
            var index = $scope.model[$scope.currentShow].list.indexOf(item);
            $scope.model[$scope.currentShow].list.splice(index, 1);
        }, null);

	};

	$scope.taskSortable = {
		containment: "parent",
		cursor: "move",
		tolerance: "pointer",
        stop: function(e, ui) {
			$scope.changeOrder();
		}
	};

	$scope.changeOrder = function () {
		var tasks = {tasks : []};
        for(var index in $scope.model[0].list) {
        	tasks.tasks.push($scope.model[0].list[index].id);
        }
        $scope.requestApi('reorder', tasks, null, null);
	};

	/* Filter Function for All | Incomplete | Complete */
	$scope.showFn = function (task) {
		if ($scope.show === "All") {
			return true;
		}else if(task.done && $scope.show === "Complete"){
			return true;
		}else if(!task.done && $scope.show === "Incomplete"){
			return true;
		}else{
			return false;
		}
	};

	$scope.$watch("model",function (newVal,oldVal) {
		if (newVal !== null && angular.isDefined(newVal) && newVal!==oldVal) {
			// console.log(angular.toJson(oldVal));
		}
	},true);

    /**
	 * Método responsável por realizar as chamadas a api, ele contém os endpoints e endereço do host da api
     * @param action
     * @param data
     * @param successCallback
     * @param errorCallback
     */
	$scope.requestApi = function(action, data, successCallback, errorCallback){
		var host = '../api-tasks/web/api/v1';
		var endpoints = {
			'create' : {
				'path' : '/task',
				'method' : 'POST'
            },
			'edit' : {
                'path' : '/task',
                'method' : 'PUT'
            },
			'delete' : {
                'path' : '/task',
                'method' : 'DELETE'
            },
			'find' : {
                'path' : '/tasks',
                'method' : 'GET'
            },
			'findOne' : {
                'path' : '/task',
                'method' : 'GET'
            },
			'reorder' : {
                'path' : '/tasks',
                'method' : 'PUT'
            }
        };

		var urlData = '';
		if(action == 'delete')
			urlData = '/' + data;

        $http({
            method: endpoints[action].method,
            url: host + endpoints[action].path + urlData,
            headers: {
                'x-api-key': '356a192b7913b04c54574d18c28d46e6395428ab',
                'Content-Type': "application/json"
            },
            data: data
        }).then(successCallback,errorCallback);
	};

});