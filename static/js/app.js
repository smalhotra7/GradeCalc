var app = angular.module("app", ["xeditable"]);

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'

});

    app.config(function($interpolateProvider) { 
      $interpolateProvider.startSymbol('[['); 
      $interpolateProvider.endSymbol(']]');
    });

app.controller('GradeCalcCtrl', function($scope) {

  $scope.course = {
    name:'New Course'
  };

  $scope.categories = [];

  $scope.scenarios = false;

  $scope.scenario1 = 90;

  $scope.scenario2 = 90;

  $scope.showExample = function() {
    $scope.categories = [
    {
      name:'Tests', weight:30.0, assignments:[
      {score:48, total:50}, {score:39, total:50}, {score:50, total:50}
      ]
    },
    {
      name:'Quizzes', weight:20.0, assignments:[
      {score:18, total:20}, {score:17, total:20}, {score:21, total:25}
      ]
    },
    {
      name:'Projects', weight:20.0, assignments:[
      {score:68, total:80}, {score:70, total:80}, {score:75, total:80}
      ]
    },
    {
      name:'Participation', weight:10.0, assignments:[
      {score:9, total:10}
      ]
    }
    ];
    $scope.scenarios = true;
    $scope.scenario1 = 90;
    $scope.scenario2 = 90;

  };

  $scope.getScenario1 = function() {
    var weightedAvg = $scope.getCourseAverage() * ((100 - $scope.getRemainingWeight())/100);
    var diff = $scope.scenario1 - weightedAvg;
    return ((diff / $scope.getRemainingWeight()) * 100).toFixed(2);
  };

  $scope.getScenario2 = function() {
    var current = $scope.getCourseAverage() * ((100 - $scope.getRemainingWeight())/100);
    var add = $scope.scenario2 * ($scope.getRemainingWeight()/100);
    return (current + add).toFixed(2);
  };

  $scope.clearAll = function() {
    $scope.categories = [];
    $scope.scenarios = false;
  };

  $scope.toggleScenarios = function() {
    $scope.scenarios = !$scope.scenarios;
  };

  $scope.getRemainingWeight = function() {
    var weight = 0.0;
    for (var i=0; i<$scope.categories.length; i++) {
      weight = weight + $scope.categories[i].weight;
    }
    return 100 - weight;
  };

  $scope.addCategory = function() {
    $scope.categories.push({
      name:'New Category', weight:0.0, assignments:[]
    });
  };

  $scope.addAssignment = function(catIndex) {
    $scope.categories[catIndex].assignments.push({
      score:0.0, total:1.0, isNew:true
    });
  };

  $scope.deleteAssignment = function(catIndex, asgnIndex) {
    $scope.categories[catIndex].assignments[asgnIndex].isDeleted = true;
    //$scope.categories[catIndex].assignments.splice(asgnindex, 1);
  };

  /*$scope.getCategory = function(id) {
    var category = $filter('filter')($scope.categories, {id: id});
    alert('here ' + category.length);
    if (category.length) {
      return category[0];
    }
  };

  $scope.getAssignment = function(catId, asgnId) {
    var category = $scope.getCategory(catId);
    var assignment = $filter('filter')(category.assignments, {asgnId: id});
  };*/

  $scope.filterAssignments = function(assignment) {
    return assignment.isDeleted !== true;
  };

  $scope.cancel = function(index) {

    for (var i=$scope.categories[index].assignments.length; i--;) {
      var assignment = $scope.categories[index].assignments[i];
      if (assignment.isDeleted) {
        delete assignment.isDeleted;
      }
      if (assignment.isNew) {
        $scope.categories[index].assignments.splice(i,1);
      }
    }
  };

  $scope.saveCategory = function(index) {

    for (var i=$scope.categories[index].assignments.length; i--;) {
      var assignment = $scope.categories[index].assignments[i];
      if (assignment.isDeleted) {
        $scope.categories[index].assignments.splice(i,1);
      }
      if (assignment.isNew) {
        assignment.isNew = false;
      }
    }
  };

  $scope.deleteCategory = function(index) {
    $scope.categories.splice(index, 1);
  };

  $scope.checkZero = function(num) {
    if(num === 0) {
      return "Don't want to divide by 0, do we?";
    }
  }

  $scope.checkWeight = function(weight, catIndex) {
    var currentweight = 0;
    for (var i=0; i<$scope.categories.length && i != catIndex; i++) {
      currentweight = currentweight + $scope.categories[i].weight;
    }
    
    if (currentweight + weight > 100) {
      return "Weight total cannot exceed 100!";
    }
  };

  $scope.getCategoryAverage = function(index) {
    var asgncount = $scope.categories[index].assignments.length;
    var total = 0.0;
    if (asgncount === 0) {
      return 0.0;
    }
    else {
          for (var a=0; a<$scope.categories[index].assignments.length; a++) {
            total = total + ($scope.categories[index].assignments[a].score / $scope.categories[index].assignments[a].total);
          }

          total = total / asgncount;
          return (total*100).toFixed(2);
    }

  };

  $scope.getCourseAverage = function() {
    var total = 0.0;
    var totalWeight = 0.0;

    for (var c=0; c<$scope.categories.length; c++) {

      if ($scope.categories[c].assignments.length > 0) {

        var assignmentTotal = 0.0;

        for (var a=0; a<$scope.categories[c].assignments.length; a++) {
          assignmentTotal = assignmentTotal + ($scope.categories[c].assignments[a].score / $scope.categories[c].assignments[a].total);
        }
        var assignmentAverage = assignmentTotal / $scope.categories[c].assignments.length;
        total = total + (assignmentAverage * ($scope.categories[c].weight)/100);
        totalWeight = totalWeight + $scope.categories[c].weight/100;
      }
    }

    if (totalWeight > 0) {
      return ((total / totalWeight)*100).toFixed(2);
    }
    else {
      return total;
    }
    
  };

  $scope.getLetterGrade = function(grade) {
    if (grade >= 90) {
      return 'A';
    }
    if (grade >= 80) {
      return 'B';
    }
    if (grade >= 70) {
      return 'C';
    }
    if (grade >= 60) {
      return 'D';
    }
    if (grade >= 0) {
      return 'F';
    }
  };

  /*$scope.addTodo = function() {
    $scope.todos.push({text:$scope.todoText, done:false});
    $scope.todoText = '';
  };
 
  $scope.remaining = function() {
    var count = 0;
    angular.forEach($scope.todos, function(todo) {
      count += todo.done ? 0 : 1;
    });
    return count;
  };
 
  $scope.archive = function() {
    var oldTodos = $scope.todos;
    $scope.todos = [];
    angular.forEach(oldTodos, function(todo) {
      if (!todo.done) $scope.todos.push(todo);
    });
  };*/

});