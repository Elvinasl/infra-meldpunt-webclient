var vdbApp = angular.module('vdbApp', ['ngRoute','angularSpinner'])
var APIURL = "http://staging.​verbeterdebuurt.nl/api.php/json_1_3/";

var issuesService = new Object();
var registerService = new Object();
var loginService  = new Object();
var reportService = new Object();
var loginService = new Object();
var commentService = new Object();

//change menu selected
function menuSelected($scope,selected){
	$scope.homeSelected = "";
	$scope.mentionSelected = "";
	$scope.myIssuesSelected = "";

	switch(selected) {
		case 'home':
			$scope.homeSelected = "active"
			break;
		case 'mention':
			$scope.mentionSelected = "active"
			break;
		case 'myIssues':
			$scope.myIssuesSelected = "active"
			break;
	}
};

vdbApp.config(['$routeProvider','$locationProvider','$httpProvider','$sceDelegateProvider', function ($routeProvider,$locationProvider,$httpProvider,$sceDelegateProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'map.html',
		controller: 'mainCtrl'
		
	})
	.when('/city/:cityName', {
		templateUrl: 'map.html',
		controller: 'mainCtrl'
	})
	.when('/issues/:id',{
		templateUrl :'issues.html',
		controller : 'issuesCtrl'
	})
	.when('/mention', {
		templateUrl: 'mention.html',
		controller : 'mentionCtrl'
	})

    .when('/myissues', {
		templateUrl: 'myissues.html',
		controller : 'myIssuesCtrl'	
	})
    
    .when('/login', {
		templateUrl: 'login.html'
		
	})
    
    .when('/register', {
		templateUrl: 'register.html'
		
	})
	 $locationProvider.html5Mode(true);
	 $sceDelegateProvider.resourceUrlWhitelist([
		// Allow same origin resource loads.
		'self'
	]);
}]);


vdbApp.factory('issuesService', ['$http',function ($http) {
			return {
				getIssues : function( jsondata){
					return $http.post(APIURL+'issues',jsondata)
					.success(function(data){
						if(angular.isObject(data)){
						issuesService.data = data;
						return issuesService.data;
						}	
												
					});
					return issuesService.data;					
				}

			}

}]);

vdbApp.factory('reportService', ['$http',function ($http) {
		return {
			getReport : function ( jsondata ){
				return $http.post(APIURL+'reports',jsondata)
					.success(function(data){
						if(angular.isObject(data)){
						reportService.data =data;
						return reportService.data;
						}
					});
					return reportService.data;
				
			}
		}

}]);
vdbApp.factory('loginService', ['$http',function ($http) {
		return {
			getLogin : function( jsondata ){
				return $http.post(APIURL+'login', jsondata)
				.success(function(data){
					if(angular.isObject(data)){
						loginService.data=data;
						return loginService.data;
					}
				});
				return loginService.data;
			}
	};
}])

vdbApp.factory('commentService', ['$http',function ($http) {
		return {
			getComment : function( jsondata ){
				return $http.post(APIURL+'"comments').success(function(data){
					if(angular.isObject){
						commentService.data = data;
						return commentService.data;
					}
				});
				return commentService.data;
			}
		};
}])

vdbApp.factory('registerService', ['$http',function ($http) {
		return {
			getRegister : function( jsondata ){
				return $http.post(APIURL+'register', jsondata)
				.success(function(data){
					if(angular.isObject(data)){
						registerService.data=data;
						return registerService.data;
					}
				});
				return registerService.data;
			}
	};
}])




vdbApp.controller('mainCtrl', ['$scope','$window','$location','$rootScope','$routeParams','$http','issuesService','reportService','commentService', function ($scope,$window,$location,$rootScope,$routeParams,$http,issuesService,reportService,commentService) {
						menuSelected($rootScope,'home');
						var jsondata = JSON.stringify({"council" : "Groningen"});

						//promise for make asyncronise data factory to be syncronis
						var getIssues = issuesService.getIssues( jsondata ).then(function (data){
								var getdata = data.data;
								$rootScope.newProblemList = getdata.issues;
								// console.log(getdata.data.issues); 
						});
						
						var getReport = reportService.getReport( jsondata ).then(function (data){
								var getdata = data.data;
								$rootScope.reportList = getdata.report;
						});
						
						//click function at map
						$scope.alrCity = function(){
							if(city.long_name !=null){
							
							//url change validation	
							if($location.path().includes("/city/") || $location.path().endsWith("/") ){
								$location.path("/city/"+city.long_name);
								$rootScope.lastUrl = $location.path();	
							}
							
							//Get city problem when click/drag
							jsondata = JSON.stringify({"council" : "Groningen"});
							getIssues = issuesService.getIssues( jsondata ).then(function (data){
								var getdata = data.data;
								$rootScope.newProblemList = getdata.issues; 
								
								});
							}
							
						}

						
					}]);
//Retrieving issues




// vdbApp.controller('mainCtrl', ['$scope','issues', function ($scope,issues) {

// }]);
vdbApp.controller('issuesCtrl', ['$scope','$rootScope','$routeParams','issuesService','reportService','usSpinnerService','$location','$anchorScroll', function ($scope,$rootScope,$routeParams,issuesService,reportService,usSpinnerService,$location,$anchorScroll) {
	$scope.hide = "ng-hide";
	var jsondata = JSON.stringify({"council" : "Groningen"});
		if($rootScope.lastUrl==null){
			$rootScope.lastUrl=='/';
		}

	var getIssues = issuesService.getIssues( jsondata ).then(function (data){
								var getdata = data.data;
								$rootScope.newProblemList = getdata.issues;
								$scope.hide = "";
								usSpinnerService.stop('spinner-1');
								var temp = $location.hash();
								$location.hash('main-main-content');
								$anchorScroll();
								
								// console.log(getdata.data.issues); 
						});

	var getReport = reportService.getReport( jsondata ).then(function (data){
								var getdata = data.data;
								$rootScope.reportList = getdata.report;
						});
	$scope.id = function(){
		return $routeParams.id;
	}

}])


vdbApp.controller('mentionCtrl', ['$scope','$rootScope', function ($scope,$rootScope) {
	menuSelected($rootScope,'mention');
}])
vdbApp.controller('myIssuesCtrl', ['$scope','$rootScope', function ($scope,$rootScope) {
	menuSelected($rootScope,'myIssues');
}])

vdbApp.controller('loginCtrl', ['$scope','$rootScope','$window','loginService', function ($scope,$rootScope,$window,loginService) {
	$scope.hide = "ng-hide";

	$scope.login = function(){
		var jsondata = JSON.stringify({"user":{"username":""+$scope.username+"","password":""+$scope.password+""}});
		var getLogin = loginService.getLogin(jsondata).then(function (data){
				var getLogin = data.data;
				if(!getLogin.success){
					$scope.errorMessage = getLogin.error;
					$scope.hide = "";
				}	
		})
		
	}
	$scope.close = function(){
		$scope.hide="ng-hide";
		location.path("/city/");
	}
}])

vdbApp.controller('registerCtrl', ['$scope','$rootScope','$window','registerService', function ($scope,$rootScope,$window,registerService) {
	$scope.hide = "ng-hide";

	$scope.register = function(){
		var jsondata = JSON.stringify({"user":{"username":""+$scope.username+""
                                               ,"password":""+$scope.password+""
                                               ,"email":""+$scope.email+""},
                                       
                                       "user_profile":{"initials":""+$scope.initials+""
                                                      ,"tussenvoegsel":""+$scope.tussenvoegsel+""
                                                      ,"surname":""+$scope.surname+""
                                                      ,"sex":""+$scope.sex+""
                                                      ,"address":""+$scope.address+""
                                                      ,"address_number":""+$scope.address_number+""
                                                      ,"address_suffix":""+$scope.address_suffix+""
                                                      ,"postcode":""+$scope.postcode+""
                                                      ,"city":""+$scope.city+""
                                                      ,"phone":""+$scope.phone+""}
                                      
        
                                       
                                       
                                      });
                                   
        
        console.log(jsondata);
		var getRegister = registerService.getRegister(jsondata).then(function (data){
				var getRegister = data.data;
                console.log(getRegister.errors);

            
//            if($scope.password != $scope.password2)
//                {
//                    $scope.errorPassword = "Password not match"
//                    
//                }
//            
//            else if($scope.password == "undefined")
//                {
//                     $scope.errorPassword1 = "Tidak boleh kosong"
//                    
//                }
        
				if(!getRegister.success){
					$scope.errorEmail = getRegister.errors.email;
                    $scope.errorNewPassword = getRegister.errors.password;
                    //$scope.errorPassword1= getRegister.errors.password_repeat;
                    $scope.errorNewUsername = getRegister.errors.username;
                    $scope.errorSurname = getRegister.errors.surname;
                    $scope.errorSex = getRegister.errors.sex;
                    $scope.errorAddress = getRegister.errors.address;
                    $scope.errorAddressN = getRegister.errors.address_number;
                    $scope.errorPost= getRegister.errors.postcode;
                    $scope.errorCity = getRegister.errors.city;
                    $scope.errorInit = getRegister.errors.initials;
                    $scope.errorMiddle = getRegister.errors.tussenvoegsel;
                    $scope.errorPost = getRegister.errors.postcode;
                    $scope.errorCity = getRegister.errors.city;
                
                
                    
					$scope.hide = "";
				}	
		})
		
	}
	$scope.close = function(){
		$scope.hide="ng-hide";
	}
}])