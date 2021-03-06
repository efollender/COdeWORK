'use strict';
 
angular.module('core')

	.controller('HomeController', ['$scope', 'Authentication', '$animate',
    	function($scope, Authentication, $animate) {
	            $scope.publish = function(){
	            	$scope.message.user = Authentication.user.displayName;
	            	$scope.message.email = Authentication.user.email;
	            	$scope.message.avatar = Authentication.user.providerData.avatar_url;
	            	$scope.message.timestamp = Date.now();
	                
	                $('#progress_bar').slideToggle();
	                
	                 PUBNUB.publish({
	                        channel : $scope.channel,
	                        message : $scope.message
	                    }); 
	                     
	               $scope.message.text = '';
	            };
	                
	            $scope.history = function(){
	                PUBNUB.history( {
	                    channel : $scope.channel,
	                    limit   : $scope.limit
	                }, function(messages) {
	                    // Shows All Messages
	                    $scope.$apply(function(){
	                        $scope.messages = messages.reverse();          
	                        
	                    }); 
	                } );
	             };
	                 

	           PUBNUB.subscribe({
	                channel    : $scope.channel,
	                restore    : true, 
	            
	                callback   : function(message) { 
	                    
	                    $('#progress_bar').slideToggle();         
	                 
	                    $scope.$apply(function(){
	                        $scope.messages.unshift(message);          
	                        
	                    }); 
	                },
	            
	                disconnect : function() {   
	                    $scope.$apply(function(){
	                        $scope.realtimeStatus = 'Disconnected';
	                    });
	                },
	            
	                reconnect  : function() {   
	                    $scope.$apply(function(){
	                        $scope.realtimeStatus = 'Connected';
	                        $scope.history();
	                    });
	                },
	            
	                connect    : function() {  
	                    $scope.$apply(function(){
	                        $scope.realtimeStatus = 'Connected';

	                        $('#progress_bar').slideToggle();
	                        $scope.history();
	                    });
	            
	                }
	            });
	      		$scope.authentication = Authentication;
	      		$scope.user = Authentication.user;
	            $scope.route = function(){
	            	if($scope.user){
	            		document.location.href = '/#!/settings/profile';
	            	} else {
	            		$scope.signin = true;
	            	}
	            };
	         
	    }  
	]);
