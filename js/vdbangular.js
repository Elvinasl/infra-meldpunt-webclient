var vdbApp = angular.module('vdbApp', ['ngRoute','angularSpinner','angularUtils.directives.dirPagination'])
var APIURL = "https://staging.verbeterdebuurt.nl/api.php/json_1_3/";
var geocoder = new google.maps.Geocoder();
var infoWindow = new google.maps.InfoWindow();
var infoWindowContent = [];
var latlngChange;
var issuesService = new Object();
var registerService = new Object();
var loginService  = new Object();
var reportService = new Object();
var loginService = new Object();
var commentService = new Object();
var forgotService = new Object();
var myIssuesService = new Object();
var commentSubmitService = new Object();
var profileService = new Object();
var workLogService = new Object();


//google map
window.onload = function(){
      var mainLat = 52.158367;
      var mainLng = 4.492999;
      this._map_center = {lat: mainLat , lng: mainLng};
      this._marker_positions = [{lat: 27.1959742, lng: 78.02423269999100}, {lat: 27.1959733, lng: 78.02423269999992}] ;
      var mapOptions = {
        zoom: 15, // initialize zoom level - the max value is 21
        disableDefaultUI: true,
        streetViewControl: false, // hide the yellow Street View pegman
        /*scaleControl: false, // allow users to zoom the Google Map*/
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center:  this._map_center,
        zoomControlOptions : { 
          position :google.maps.ControlPosition.RIGHT_CENTER }
      };
     map = new google.maps.Map(document.getElementById('googlemaps'), mapOptions);
     getLocation(map);
     var geocoder = new google.maps.Geocoder();
     
     if(cityName!=null){
        geocodeAddress(geocoder, map);
        cityName=null;
     }
  	 getLatLng(map);
      //start location picker
    
}
function getLatLng (map){
	google.maps.event.addListener(map,'bounds_changed',function(){
		latlngChange = map.getCenter();
	})
}
function googleMapIssue(lat,lng){
	var location = {lat: lat , lng: lng};
	var mapOption2 = {
		center : location,
		zoom : 18,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var markerOption2 = {
		 position : location
	}
	var map2=new google.maps.Map(document.getElementById("googleMapIssue"),mapOption2);
	map2.setOptions({draggable:false,zoomControl:false,scrollwheel: false, disableDoubleClickZoom: true,streetViewControl: false,disableDefaultUI:true});
	var marker = new google.maps.Marker(markerOption2);
	marker.setMap(map2);
}

function googleMapCreateIssue(latlng){
	var mapOption3 = {
		center : latlng,
		zoom : 17,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	 map3 = new google.maps.Map(document.getElementById("googleMapCreateIssue"),mapOption3);
	 marker = new google.maps.Marker();
	 marker.setMap(map3);
	 marker.setPosition(map3.getCenter());
	 marker.setOptions({draggable:true});
	 map3.setOptions({draggable:true,zoomControl:true,scrollwheel: true, disableDoubleClickZoom: true,streetViewControl: false,disableDefaultUI:true});
	 markerLat = marker.getPosition().lat();
	 markerLng = marker.getPosition().lng();
	
	 sycGoogleMap(map3);
	 markerCenter(map3,marker);
	 getMarkerLocation(marker);
	  
}
//to make other map syncronise
function sycGoogleMap(map3){
	google.maps.event.addListener(map3,'bounds_changed',function (e){
                    map.setCenter(map3.getCenter());
                    map.setZoom(map3.getZoom()-2);
              });
}
//marker at center
function markerCenter (map3,marker){
	google.maps.event.addListener(map3,'bounds_changed',function (e){
				marker.setPosition(map3.getCenter());
				markerLat = marker.getPosition().lat();
	 			markerLng = marker.getPosition().lng();
	 			
	});
}
//get location marker
function getMarkerLocation(marker){
	google.maps.event.addListener(marker,'dragend',function (e){
			markerLat = marker.getPosition().lat();
	 		markerLng = marker.getPosition().lng();
	});
}
// get location search at create issue
function geocodeAddressCreateIssue(geocoder, resultsMap, address) {
        var address = address;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            resultsMap.setCenter(results[0].geometry.location);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
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
	.when('/myIssues/:id', {
		templateUrl: 'myIssueDetail.html',
		controller: 'myIssuesDetailCtrl'
	})
    
    .when('/login', {
		templateUrl: 'login.html'
		
	})
    
    .when('/register', {
		templateUrl: 'register.html'
        
    })
    
    .when('/regisconf',{
        templateUrl: 'regisconf.html',
        controller : 'regisconfCtrl'
	})
    .when('/forgotpass',{
        templateUrl: 'forgotpass.html',
        controller : 'forgotCtrl'
	})
    .when('/forgotconf',{
        templateUrl: 'forgotconf.html',
        controller : 'forgotconfCtrl'
	})
    .when('/createissue',{
        templateUrl: 'createissues.html',
        controller : 'createissueCtrl'
	})
    .when('/profile',{
        templateUrl: 'profile.html',
        controller : 'profileCtrl'
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
				return $http.post(APIURL+'comments', jsondata).success(function(data){
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


vdbApp.factory('forgotService', ['$http',function ($http) {
		return {
			getForgot : function( jsondata ){
				return $http.post(APIURL+'resetPassword', jsondata)
				.success(function(data){
					if(angular.isObject(data)){
						forgotService.data=data;
						return forgotService.data;
					}
				});
				return forgotService.data;

    			}
	};
}])
vdbApp.factory('myIssuesService', ['$http',function ($http) {
	return {
			getMyIssues  : function( jsondata ){
				return $http.post(APIURL+'myIssues', jsondata)
				.success(function (data){
					if(angular.isObject(data)){
						myIssuesService.data = data ; 
						return myIssuesService.data;
					}
				});
				return myIssuesService.data;

			}
	};
}])

vdbApp.factory('commentSubmitService', ['$http',function ($http) {
	return {
		getCommentSubmit : function( jsondata ){
			return $http.post(APIURL+'commentSubmit' , jsondata)
			.success(function (data){
				if(angular.isObject(data)){
					commentSubmitService.data = data;
					return commentSubmitService.data;
				}
			});
			return commentSubmitService.data;
		}
	};
}])


vdbApp.factory('profileService', ['$http',function ($http) {
		return {
			getProfile : function( jsondata ){
				return $http.post(APIURL+'editSettings', jsondata)
				.success(function(data){
					if(angular.isObject(data)){
						profileService.data=data;
						return profileService.data;
					}
				});
				return profileService.data;

    			}
	};
}])

vdbApp.factory('workLogService', ['$http',function ($http) {
	return {
			getWorkLog : function( jsondata ){
				return $http.post(APIURL+'worklogs', jsondata)
				.success(function(data){
					if(angular.isObject(data)){
						workLogService.data = data;
						return workLogService.data;
					}
				});
				return workLogService.data;
			}
	};
}])

vdbApp.controller('mainCtrl', ['$scope','$window','$location','$rootScope','$routeParams','$http','issuesService','reportService',function ($scope,$window,$location,$rootScope,$routeParams,$http,issuesService,reportService) {
						menuSelected($rootScope,'home');
						var jsondata = JSON.stringify({"council" : "Groningen"});
						$rootScope.urlBefore = $location.path();
						$window.cityName = $routeParams.cityName;
						$scope.searchCity = $routeParams.cityName;
						$rootScope.errorSession="";

						//promise for make asyncronise data factory to be syncronis first load
						var getIssues = issuesService.getIssues( jsondata ).then(function (data){
								var getdata = data.data;
								$rootScope.newProblemList = getdata.issues;
								//initial google map marker
								$window.issuesData = getdata;
								showIssue(infoWindow,infoWindowContent);
						});
						
						var getReport = reportService.getReport( jsondata ).then(function (data){
								var getdata = data.data;
								$rootScope.reportList = getdata.report;
						});
						
						
						//click function at map
						$scope.alrCity = function(){
							if($window.city.long_name !=null){
							
							//url change validation	
							if($location.path().includes("/city/") || $location.path().endsWith("/") ){
								$location.path("/city/"+$window.city.long_name);
								$rootScope.lastUrl = $location.path();
								$scope.searchCity = city.long_name;	
							}
							
							//Get city problem when click/drag
							jsondata = JSON.stringify({"council" : "Groningen"});
							getIssues = issuesService.getIssues( jsondata ).then(function (data){
								var getdata = data.data;
								$rootScope.newProblemList = getdata.issues; 
								$window.issuesData = getdata;
								});
							}
							
						}
						//login session
						$scope.loginStatus = function(){
							if($window.sessionStorage.username == null){
								return false;
							}
							else{
								$rootScope.lusername = $window.sessionStorage.username;
								return true;
							}
						}
						//logOut
						$scope.logout = function(){
							$window.sessionStorage.clear();
							$location.path('/');
						}
						//search
						$scope.clickSearch= function(){
							$window.cityName = null;
							city.long_name = $scope.searchCity;
							getIssues = issuesService.getIssues( jsondata ).then(function (data){
							var getdata = data.data;
							$rootScope.newProblemList = getdata.issues; 
							$window.issuesData = getdata;
								});
							
							geocodeAddress(geocoder, map);
							$location.path("city/"+$scope.searchCity);
						}
						//move page
						$scope.clickMenu = function(selected){
								$location.path('/'+selected);
						}


						
					}]);
//Retrieving issues




// vdbApp.controller('mainCtrl', ['$scope','issues', function ($scope,issues) {

// }]);
vdbApp.controller('issuesCtrl', ['$scope','$rootScope','$window','$routeParams','issuesService','reportService','usSpinnerService','$location','$anchorScroll','workLogService','commentService', function ($scope,$rootScope,$window,$routeParams,issuesService,reportService,usSpinnerService,$location,$anchorScroll,workLogService,commentService) {
	$scope.hide = "ng-hide";
	$scope.overlay = "overlay";
	$scope.hideStatus = "ng-hide";

	var jsondata = JSON.stringify({"council" : "Groningen"});
	
		if($rootScope.lastUrl==null){
			$rootScope.lastUrl=='/';
		}
	$rootScope.urlBefore = $location.path();
	var getIssues = issuesService.getIssues( jsondata ).then(function (data){
								var getdata = data.data;
								$rootScope.newProblemList = getdata.issues;
								$scope.hide = "";
								usSpinnerService.stop('spinner-1');
						});

	var getReport = reportService.getReport( jsondata ).then(function (data){
								var getdata = data.data;
								$rootScope.reportList = getdata.report;
						});
	$scope.id = function(){
		return $routeParams.id;
	}

	//validity must login when comment
	$scope.sessionValid = function(){
		if(!$window.sessionStorage.username){
			$location.path("/login");
			$scope.stemModal = "";
			$rootScope.errorSession="je moet ingelogd zijn om commentaar te geven of de snelheid"
		}
		else{
			$scope.stemModal = "#StemModal";
		}	
	};
	
	//close the detail;
	$scope.close = function(){
		$scope.hide = "ng-hide";
	}

	//googlemap
	$scope.googleMapIssue = function(lat,lng){
		googleMapIssue(lat,lng);
	}
	//hide log Status
	if($window.sessionStorage.username){
		var logjsondata = JSON.stringify({"user":{
											"username":""+$window.sessionStorage.username+"",
											"password_hash":""+$window.sessionStorage.password_hash+""
										},
											"issue_id":""+$routeParams.id+""	
									});
		var getWorkLog = workLogService.getWorkLog( logjsondata ).then(function (data){
				var getdata = data.data;
				if(!getdata.success){
					$scope.hideLogStatus = "ng-hide";
				}else if(getdata.success&&getdata.count==0){
					$scope.hideLogStatus = "ng-hide";
				}else{
					$scope.hideLogStatus = "";
					$scope.WorkLogList = getdata.worklogs;
				}
		});
	}
	else{
	$scope.hideLogStatus = "ng-hide";
	}
					
	//to hide and show log status
	$scope.logStatus = function(){
		if($scope.hideStatus=="ng-hide"){
			$scope.hideStatus="";
		}
		else{
			$scope.hideStatus="ng-hide";
		}
	}
	//show Comment
	var commentjsondata = JSON.stringify({"issue_id" : ""+$routeParams.id+""});
	var getComment = commentService.getComment( commentjsondata ).then(function (data){
		var getComment = data.data;
		$scope.commentList = getComment.comments;
		console.log(getComment);
	});


}])


vdbApp.controller('mentionCtrl', ['$scope','$rootScope','$window','$location', function ($scope,$rootScope,$window,$location) {
	menuSelected($rootScope,'mention');
		if($window.sessionStorage.username==null){
				$rootScope.urlBefore = $location.path();
				$location.path('/login');
		}
}])

vdbApp.controller('myIssuesCtrl', ['$scope','$rootScope','$window','$location','myIssuesService', function ($scope,$rootScope,$window,$location,myIssuesService) {
		$scope.hide = "";
		menuSelected($rootScope,'myIssues');

		$rootScope.currentPage = 1;
  		$scope.totalPage = 3;
		if($window.sessionStorage.username==null){
				$rootScope.urlBefore = $location.path();
				$location.path('/login');
		}
		var jsondata = JSON.stringify({"user":{ "username":""+$window.sessionStorage.username+"",
												"password_hash":""+$window.sessionStorage.password_hash+""

											}});
		//to get hash password
		// console.log(jsondata);
		var getMyIssues = myIssuesService.getMyIssues( jsondata ).then(function (data){
			var getdata = data.data;
			$scope.count = getdata.count;
			$scope.myIssuesList = getdata.issues;
		})

}])

vdbApp.controller('myIssuesDetailCtrl', ['$scope','$routeParams','$http','$rootScope','$location','$window','myIssuesService','usSpinnerService', function ($scope,$routeParams,$http,$rootScope,$location,$window,myIssuesService,usSpinnerService) {
		$scope.hide = "";
		$scope.id = function(){
			return $routeParams.id;
		}
		if($window.sessionStorage.username==null){
				$rootScope.urlBefore = $location.path();
				$location.path('/login');
		}
		var jsondata = JSON.stringify({"user":{ "username":""+$window.sessionStorage.username+"",
												"password_hash":""+$window.sessionStorage.password_hash+""

												}});

		var getMyIssues = myIssuesService.getMyIssues( jsondata ).then(function (data){
			var getdata = data.data;
			$scope.count = getdata.count;
			$scope.myIssuesList = getdata.issues
			usSpinnerService.stop('spinner-1');
		})

		//call googlemap
		$scope.googleMapIssue = function(lat,lng){
		googleMapIssue(lat,lng);
	}

}])

vdbApp.controller('loginCtrl', ['$scope','$rootScope','$window','loginService','$location','usSpinnerService', function ($scope,$rootScope,$window,loginService,$location,usSpinnerService) {
	$scope.hide = "ng-hide";
	//$scope.overlay ACTIVE WHENclick and overlay when no event
	$scope.overlay="overlay";
	
	
	if($rootScope.urlBefore==null || $rootScope.urlBefore == '/login'){
			$rootScope.urlBefore='/' ;
	}
	if($window.sessionStorage.username !=null){
			$location.path('/');
	}
	//error session
	if($rootScope.errorSession){
		$scope.hide = "";
	}
	$scope.login = function(){
		usSpinnerService.spin('spinner-1');
		$scope.overlay = "overlayactive";
		var jsondata = JSON.stringify({"user":{"username":""+$scope.lusername+"","password":""+$scope.lpassword+""}});
		var getLogin = loginService.getLogin(jsondata).then(function (data){
				var getLogin = data.data;
				if(!getLogin.success){
					$scope.errorMessage = getLogin.error;
					usSpinnerService.stop('spinner-1');
					$scope.overlay = "overlay";
					$scope.hide = "";
				}else if(getLogin.success){
					//temp for data session
					$window.sessionStorage.username = getLogin.user.username;
					$window.sessionStorage.email = getLogin.user.email;
					$window.sessionStorage.password_hash = getLogin.user.password_hash;
					$window.sessionStorage.name = getLogin.user_profile.name;
					$window.sessionStorage.initials = getLogin.user_profile.initials;
					$window.sessionStorage.surname = getLogin.user_profile.surname;
					$window.sessionStorage.tussenvoegsel = getLogin.user_profile.tussenvoegsel;
					$window.sessionStorage.sex = getLogin.user_profile.sex;
					$window.sessionStorage.address = getLogin.user_profile.address;
					$window.sessionStorage.address_number = getLogin.user_profile.address_number;
					$window.sessionStorage.address_suffix = getLogin.user_profile.address_suffix;
					$window.sessionStorage.postcode = getLogin.user_profile.postcode;
					$window.sessionStorage.city = getLogin.user_profile.city;
					$window.sessionStorage.phone = getLogin.user_profile.phone;
					$rootScope.loginStatus = function(){
						return true;
					}
					usSpinnerService.stop('spinner-1');
					$scope.overlay = "overlay";
					$rootScope.errorSession="";
					if($rootScope.urlBefore == '/register'){
						$location.path('/map');
					}
					else{
						$location.path($rootScope.urlBefore);
					}
					
				}	
		})
		
	}
	$scope.close = function(){
		$scope.hide="ng-hide";
		$rootScope.errorSession="";
	}
	//move to register page
	$scope.register = function(){
		$location.path('/register');
	}
    
      $scope.forgotpass=function()
    {
        $location.path('/forgotpass');
        
    }
    
}])

vdbApp.controller('registerCtrl', ['$scope','$rootScope','$window','registerService','usSpinnerService','$location', function ($scope,$rootScope,$window,registerService,usSpinnerService,$location) {
	$scope.hide = "ng-hide";
    $scope.overlay="overlay";
    $rootScope.errorSession ="";
	$scope.register = function(sex){
        usSpinnerService.spin('spinner-1');
        $scope.overlay = "overlayactive";
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
        
          

        $rootScope.tempemail=$scope.email;
        console.log($rootScope.tempemail);

                                   
       
		var getRegister = registerService.getRegister(jsondata).then(function (data){
				var getRegister = data.data;
                console.log(getRegister.errors);
                $scope.errorPassword = ""
        
                
                
            if($scope.password != $scope.password2)
                {
                    $scope.errorPassword = "Wachtwoord niet overeen"
                    $scope.hide = "";
                }
          
            if (!getRegister.success){
                      
            if(getRegister.errors.sex !== ''){
                    $scope.errorSex = "Sex "+getRegister.errors.sex;
                    }else{
                    $scope.errorSex="";
                    }
            
                   
					$scope.errorEmail = getRegister.errors.email;
                    $scope.errorNewPassword =  getRegister.errors.password;
                    $scope.errorPassword1= getRegister.errors.password_repeat;
                    $scope.errorNewUsername = getRegister.errors.username;
                    $scope.errorSurname = getRegister.errors.surname;
                    $scope.errorAddress = getRegister.errors.address;
                    $scope.errorAddressN = getRegister.errors.address_number;
                    $scope.errorPost= getRegister.errors.postcode;
                    $scope.errorCity = getRegister.errors.city;
                    $scope.errorMiddle = getRegister.errors.tussenvoegsel;
                    $scope.errorPost = getRegister.errors.postcode;
                    $scope.errorCity = getRegister.errors.city;
                    $scope.errorInitials = getRegister.errors.initials;
                
                    usSpinnerService.stop('spinner-1');
					$scope.hide = "";
					$scope.overlay="overlay";

				}	
            
            if(getRegister.success)
                {
                    $location.path('/regisconf');
                    
                    usSpinnerService.stop('spinner-1');
					$scope.overlay = "overlay";
                     
                }
		});
		
	}
  
    
}])


vdbApp.controller('regisconfCtrl', ['$scope','$rootScope','$window','usSpinnerService','$location', function ($scope,$rootScope,$window,usSpinnerService,$location) {
	
            	$scope.home = function(){
		        $location.path('/');
	                                   
                }
                                       
                                       
                                      }]);
 vdbApp.controller('commentSubmitCtrl', ['$scope','$route','$rootScope','$window','$routeParams','$location','usSpinnerService','commentSubmitService', function ($scope,$route,$rootScope,$window,$routeParams,$location,usSpinnerService,commentSubmitService) {
 	//comment Service :v
	$scope.commentSubmit = function( issueType ){
			// validation for issue type
			if(issueType == "problem"){
				$scope.tempIssueType = "problem";
			}
			else {
				$scope.tempIssueType = "reaction";
			}
			usSpinnerService.spin('spinner-2');
			console.log( issueType );
			var jsondata = JSON.stringify(
				{"user":{"username":""+$window.sessionStorage.username+"",
				"password_hash":""+$window.sessionStorage.password_hash+""
				},
				"issue_id":""+$routeParams.id+"",
				"type":""+$scope.tempIssueType+"",
				"body":""+$scope.comment+""
			});

			var getCommentSubmit = commentSubmitService.getCommentSubmit( jsondata ).then(function (data){
				var getCommentSubmit = data.data;
				if(!getCommentSubmit.success){
				usSpinnerService.stop('spinner-2');
				console.log(getCommentSubmit);
				}
				else{
				usSpinnerService.stop('spinner-2');
				$scope.dissmissModal="modal";
				//bad practice hide modal
				$('#StemModal').modal('hide');
				$('.modal-backdrop').hide();
				console.log(getCommentSubmit);
				}

			})
			
	}
	$scope.close = function(){
		$scope.hide="ng-hide";
	}
 }])

vdbApp.controller('forgotCtrl', ['$scope','$rootScope','$window','forgotService','usSpinnerService','$location', function ($scope,$rootScope,$window,forgotService,usSpinnerService,$location) { 
    $scope.hide = "ng-hide";
    $scope.overlay="overlay";
    
    
        
    
    $scope.forgotpass = function(){
        usSpinnerService.spin('spinner-1');
        $scope.overlay = "overlayactive";
		var jsondata = JSON.stringify({"email":""+$scope.femail+""});
        
        $rootScope.tempemail1=$scope.femail;
        console.log($rootScope.tempemail1);
      
    
     var getForgot = forgotService.getForgot(jsondata).then(function (data){
         
				var getForgot = data.data;
                console.log(getForgot.error);
                $scope.errorFEmail = ""
                console.log(getForgot)
                
                
                if (getForgot.success=="false"){
                $scope.errorFEmail = getForgot.error;
                usSpinnerService.stop("spinner-1");
                $scope.overlay="overlay";
                $scope.hide = "";
                }

                else{
                        
                        $location.path('/forgotconf');
                        
                    }
               

                
         usSpinnerService.stop('spinner-1');
					$scope.overlay = "overlay";
         });
        
        
    }
    
    $scope.close = function(){
		$scope.hide="ng-hide";
        
         
	}
  
}])
	
                            
 
vdbApp.controller('forgotconfCtrl', ['$scope','$rootScope','$window','usSpinnerService','$location', function ($scope,$rootScope,$window,usSpinnerService,$location) {
	
            	$scope.home = function(){
		        $location.path('/');
	                                   
                }
                        
}]);


    
vdbApp.controller('profileCtrl', ['$scope','$rootScope','$window','profileService','$location','usSpinnerService', function ($scope,$rootScope,$window,profileService,$location,usSpinnerService) {
	$scope.hide = "ng-hide";
	//$scope.overlay ACTIVE WHENclick and overlay when no event
	$scope.overlay="overlay";
	
	
	//error session
	if($rootScope.errorSession){
		$scope.hide = "";
	}
    
    $scope.username = $window.sessionStorage.username ;
    $scope.email = $window.sessionStorage.email;
    if($window.sessionStorage.sex == 'man')
        {
            $scope.selected1='selected'
            $scope.selected2=' '
        }
    else{
            $scope.selected2='selected'
            $scope.selected1=' '
        
    }
    
    $scope.sex = $window.sessionStorage.sex;
    $scope.initials = $window.sessionStorage.initials;
    if($window.sessionStorage.tussenvoegsel == 'null')
        { 
            $scope.tussenvoegsel=" ";
        }
    else{
        $scope.tussenvoegsel = $window.sessionStorage.tussenvoegsel;
        }
    
    $scope.surname = $window.sessionStorage.surname;
    $scope.address = $window.sessionStorage.address;
    $scope.address_number = $window.sessionStorage.address_number;
    $scope.postcode = $window.sessionStorage.postcode;
    $scope.city = $window.sessionStorage.city;
    $scope.phone = $window.sessionStorage.phone;
    
    
	$scope.profile = function(){
		usSpinnerService.spin('spinner-1');
		$scope.overlay = "overlayactive";
		var jsondata = JSON.stringify({"user":{"username":""+$scope.username+"",
                                               "password_hash":""+$scope.password_hash+""},
                                      
                                       "password":{"password_old":""+$scope.password_old+"",
                                                   "password_new":""+$scope.password_new+""},
                                      
                                      "user_profile":{"initials":""+$scope.intials+"",
                                                       "tussenvoegsel":""+$scope.tussenvoegsel+"",
                                                       "surname":""+$scope.surname+"",
                                                       "email":""+$scope.email+"",
                                                        "sex":""+$scope.sex+"",
                                                        "address_old":""+$scope.address_old+"",
                                                        "address":""+$scope.address+"",
                                                     "address_number":""+$scope.address_number+"",
                                                     "address_suffix":""+$scope.address_suffix+"",
                                                     "postcode":""+$scope.postcode+"",
                                                     "city":""+$scope.city+"",
                                                     "phone":""+$scope.phone+""}
                                      
                                      
                                      
                                      
                                      
                                      
                                      
                                      });
		var getProfile = profileService.getProfile(jsondata).then(function (data){
				var getProfile = data.data;
				if(!getProfile.success){
					$scope.errorMessage = getProfile.error;
					usSpinnerService.stop('spinner-1');
					$scope.overlay = "overlay";
					$scope.hide = "";
				}else if(getProfile.success){
					//temp for data session
					$scope.username = $window.sessionStorage.username ;
					$scope.email = $window.sessionStorage.email;
					$window.sessionStorage.password_hash = getLogin.user.password_hash;
					$window.sessionStorage.name = getLogin.user_profile.name;
					$window.sessionStorage.initials = getLogin.user_profile.initials;
					$window.sessionStorage.surname = getLogin.user_profile.surname;
					$window.sessionStorage.tussenvoegsel = getLogin.user_profile.tussenvoegsel;
					$window.sessionStorage.sex = getLogin.user_profile.sex;
					$window.sessionStorage.address = getLogin.user_profile.address;
					$window.sessionStorage.address_number = getLogin.user_profile.address_number;
					$window.sessionStorage.address_suffix = getLogin.user_profile.address_suffix;
					$window.sessionStorage.postcode = getLogin.user_profile.postcode;
					$window.sessionStorage.city = getLogin.user_profile.city;
					$window.sessionStorage.phone = getLogin.user_profile.phone;
					$rootScope.loginStatus = function(){
						return true;
					}
					usSpinnerService.stop('spinner-1');
					$scope.overlay = "overlay";
					$location.path($rootScope.urlBefore);
				}	
		})
		
	}
	$scope.close = function(){
		$scope.hide="ng-hide";
		$rootScope.errorSession="";
	}
	//move to register page
	$scope.register = function(){
		$location.path('/register');
	}
    
      $scope.forgotpass=function()
    {
        $location.path('/forgotpass');
        
    }
    
	$scope.close = function(){
		$scope.hide="ng-hide";
	}
    
}])

vdbApp.controller('createissueCtrl', ['$scope','$window', function ($scope,$window) {	
		if(latlngChange){
			googleMapCreateIssue(latlngChange);
			latlngChange = null;
		}else{
			latlngChange = {lat: 52.158367,lng: 4.492999};
			googleMapCreateIssue(latlngChange);
			latlngChange = null;
		}

		$scope.clickSearchCreateIssue= function(){
							geocodeAddressCreateIssue(geocoder, map3, $scope.searchCity);
							city.long_name = $scope.searchCity;
						}

}])