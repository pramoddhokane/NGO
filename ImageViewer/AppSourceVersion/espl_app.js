'use strict';
angular.module('APP', ['ngAnimate', 'ngTouch', 'naif.base64'])
	.controller('MainCtrl', ['$scope', '$http', '$window', '$rootScope', 'CommonService', function ($scope, $http, $window, $rootScope, CommonService)
{
	// Set of Photos
	$scope.photos = [];
	// initial image index
	$scope._Index = 0;
	$scope.currentNote = null;
//	$scope.showDefault=true;
	//	$scope.selectedFileName = null;
	//	$scope.selectedFilesize = null;
	//	$scope.selectedFileDesc = null;
	// if a current image is the same as requested image
	$scope.files = [];
	$scope.file = {};
	$scope.master = {};
	$scope.isEditMode = false;
	var uploadedCount = 0;
	$scope.isDragdrop = true;
	$scope.isActive = function (index)
	{
		return $scope._Index === index;
	};
	// show prev image
	$scope.showPrev = function ()
	{
		$scope.clearZoomContainer();
		if ($scope.isEditMode)
		{
			if ($scope.showconfirmbox())
			{
				$scope.isEditMode = false;
				$scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
				$scope.currentNote = $scope.photos[$scope._Index];
			}
		}
		else if ($scope.files.length)
		{
			if ($scope.showconfirmbox())
			{
				$scope.files = [];
				$scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
				$scope.currentNote = $scope.photos[$scope._Index];
			}
		}
		else
		{
			$scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
			$scope.currentNote = $scope.photos[$scope._Index];
		}
	};
	// show next image
	$scope.showNext = function ()
	{
		$scope.clearZoomContainer();
		if ($scope.isEditMode)
		{
			if ($scope.showconfirmbox())
			{
				$scope.isEditMode = false;
				$scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
				$scope.currentNote = $scope.photos[$scope._Index];
			}
		}
		else if ($scope.files.length)
		{
			if ($scope.showconfirmbox())
			{
				$scope.files = [];
				$scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
				$scope.currentNote = $scope.photos[$scope._Index];
			}
		}
		else
		{
			$scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
			$scope.currentNote = $scope.photos[$scope._Index];
		}
	};
	// show a certain image
	$scope.showPhoto = function (index)
	{
		$scope.clearZoomContainer();
		if ($scope.isEditMode)
		{
			if ($scope.showconfirmbox())
			{
				$scope.isEditMode = false;
				$scope._Index = index;
				$scope.currentNote = $scope.photos[index];
			}
		}
		else if ($scope.files.length)
		{
			if ($scope.showconfirmbox())
			{
				$scope.files = [];
				$scope._Index = index;
				$scope.currentNote = $scope.photos[index];
			}
		}
		else
		{
			$scope._Index = index;
			$scope.currentNote = $scope.photos[index];
		}
	};
	$scope.onChange = function (e, fileList)
	{
		$scope.isDragdrop = false;
		//alert('this is on-change handler!');
		//console.log(fileList);
	};
	$scope.showconfirmbox = function ()
	{
		if ($window.confirm("Do you want to continue?")) return true;
		else return false;
	};
	$scope.deleteThis = function (file)
	{
		var files = $scope.files;
		files.splice(files.indexOf(file), 1);
	}
	$scope.editDetails = function ()
	{
		//$scope.isEditMode = true;
		if ($scope.files.length)
		{
			if ($scope.showconfirmbox())
			{
				$scope.files = [];
				$scope.isEditMode = true;
			}
		}
		else $scope.isEditMode = true;
	}
	$scope.save = function (currentNote)
	{
		//		if ($scope.showconfirmbox())
		//		{
		var UpdateNote = {
			filename: currentNote.filename,
			notetext: currentNote.notetext,
		}
		//var index = $scope.photos.indexOf(item);     	 			
		var currentIndex = $scope._Index;
		var annotationID = $scope.photos[currentIndex].annotationid;
		//console.log("annotationID : "+ annotationID);
		$http(
		{
			method: 'PATCH',
			url: $scope.clientURL + '/api/data/v8.1/annotations(' + annotationID + ')',
			data: UpdateNote,
		}).then(

		function (response)
		{
			alert("Note Updated Successfully");
			$scope.getImages();
			$scope.isEditMode = false;
		},

		function (response)
		{
			console.log("Note is not updated ");
		});
		//		}
	}
	$scope.deleteImage = function ()
	{
		if ($scope.showconfirmbox())
		{
			//var index = $scope.photos.indexOf(item);     	 			
			var currentIndex = $scope._Index;
			var annotationID = $scope.photos[currentIndex].annotationid;
			//console.log("annotationID : "+ annotationID);
			$http(
			{
				method: 'DELETE',
				url: $scope.clientURL + '/api/data/v8.1/annotations(' + annotationID + ')',
			}).then(

			function (response)
			{
				alert("Image deleted successfully");
				//$scope.getImages();
				$scope.photos.splice(currentIndex, 1);
				if ($scope.photos.length === currentIndex)
				{
					$scope.isEditMode = false;
					$scope.showNext();
				}
			},

			function (response)
			{
				console.log("Image not deleted");
			});
		}
	};

	function getDataParam()
	{
		var vals = new Array();
		if (location.search != "")
		{
			vals = location.search.substr(1).split("&");
			for (var i in vals)
			{
				vals[i] = vals[i].replace(/\+/g, " ").split("=");
			}
			for (var i in vals)
			{
				if (vals[i][0].toLowerCase() == "data")
				{
					parseDataValue(vals[i][1]);
					break;
				}
			}
		}
		else
		{
			$scope.entityId = "";
			$scope.clientURL = "";
			console.log("EntityID & clientURL not found ");
		}
	}

	function parseDataValue(datavalue)
	{
		if (datavalue != "")
		{
			var vals = new Array();
			vals = decodeURIComponent(datavalue).split("&");
			for (var i in vals)
			{
				vals[i] = vals[i].replace(/\+/g, " ").split("=");
			}
			$scope.entityId = vals[0][1].replace('{', '').replace('}', '');
			$scope.clientURL = vals[1][1];
			$scope.entityName = vals[2][1];
			$scope.entitySetName = vals[3][1];
		}
	}
	$scope.getImages = function ()
	{
		getDataParam();
		if ($scope.entityId !== null && $scope.clientURL !== null)
		{
			return $http(
			{
				method: 'GET',
				url: $scope.clientURL + '/api/data/v8.1/annotations?$filter=_objectid_value eq ' + $scope.entityId
			}).then(function (response)
			{
				$scope.photos = response.data.value;
				if ($scope.photos.length > 0)
				{
					$scope.currentNote = $scope.photos[0];
//					$scope.showDefault=false;
				}
				console.log($scope.currentNote);
			});
		}
	};
	$scope.getImages();
	$scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj)
	{
		$scope.base64text = fileObj.base64;
		$scope.imageFileName = fileObj.filename;
	};
	$scope.uploadFile = function ()
	{
		$scope.progressVisible = true;
		for (var i = 0; i < $scope.files.length; i++)
		{
			var file = $scope.files[i];
			if ($scope.isDragdrop) getBase64(file);
			else postData("", file, false)
		}
	};
	$scope.removeAll = function ()
	{
		$scope.files = [];
	}
	$scope.clearZoomContainer = function ()
	{
		var myEl = angular.element(document.getElementsByClassName('zoomContainer')); //document.querySelector('.zoomContainer')
		if (myEl) myEl.remove();
	};
	$scope.onMouseOver = function ()
	{
		
		var id = '#' + $scope.currentNote.annotationid;
		$(id).elevateZoom(
		{
			zoomType: "inner",
			cursor: "crosshair",
			zoomWindowFadeIn: 500,
			zoomWindowFadeOut: 750
		});
	};

	function getBase64(file)
	{
		var r = new FileReader();
		r.readAsDataURL(file);
		r.onloadend = function (e)
		{
			var data = e.target.result;
			//console.log(data)
			postData(data, file, true);
		}
		r.onerror = function (e)
		{
			console.log("error");
		}
	}

	function postData(data, file, isDragdrop)
	{
		if ($scope.entityId !== null && $scope.clientURL !== null)
		{
			var objectId = 'objectid_' + $scope.entityName + '@odata.bind';
			var objectIdValue = $scope.entitySetName + '@odata.bind';
			if (isDragdrop)
			{
				var annnotationdata = (
				{
					'filename': file.name,
					'documentbody': data.split(',')[1],
					'mimetype': file.type,
				});
			}
			else
			{
				var annnotationdata = (
				{
					'filename': file.filename,
					'documentbody': file.base64,
					'mimetype': file.filetype,
				});
			}
			annnotationdata[objectId] = '/' + $scope.entitySetName + '(' + $scope.entityId + ')';
			$http.post($scope.clientURL + '/api/data/v8.1/annotations', annnotationdata)
				.success(function (res)
			{
				uploadedCount++;
				$scope.progress = Math.round(uploadedCount * 100 / $scope.files.length);
				if (uploadedCount == $scope.files.length)
				{
					//	$window.alert('View uploaded files?');
					$scope.files = [];
					uploadedCount = 0;
					$scope.progressVisible = false;
					alert('Files Uploaded Successfully');
					$scope.getImages();
				}
			})
				.error(function (data, status)
			{
				alert("There was an error attempting to upload the file.");
				console.error('Repos error', status, data);
			});
		}
	}

	function dragEnterLeave(evt)
	{
		evt.stopPropagation();
		evt.preventDefault();
		$scope.$apply(function ()
		{
			if ($scope.isEditMode)
			{
				if ($scope.showconfirmbox())
				{
					$scope.isEditMode = false;
					$scope.dropClass = '';
				}
			}
			else if ($scope.files.length)
			{
				if ($scope.showconfirmbox())
				{
					$scope.files = [];
					$scope.dropClass = '';
				}
			}
			else
			{
				$scope.dropClass = '';
			}
		})
	}
	var dropbox;
	dropbox = document.getElementById("dropbox");
	dropbox.addEventListener("dragenter", dragEnterLeave, false)
	dropbox.addEventListener("dragleave", dragEnterLeave, false)
	dropbox.addEventListener("dragover", function (evt)
	{
		evt.stopPropagation();
		evt.preventDefault();
		$scope.isEditMode = false;
		var ok = evt.dataTransfer && evt.dataTransfer.types //evt.dataTransfer.types.indexOf('Files') >= 0
		var DragDataType = evt.dataTransfer.types;
		if (ok)
		{
			if (DragDataType.constructor == DOMStringList)
			{
				if (DragDataType.contains('Files'))
				{
					$scope.$apply(function ()
					{
						//$scope.dropText = ok ? 'Drop files here...' : 'Only files are allowed!'
						$scope.dropClass = ok ? 'over' : 'not-available';
					})
				}
			}
			else if (evt.dataTransfer.types.indexOf('Files') >= 0)
			{
				$scope.$apply(function ()
				{
					//$scope.dropText = ok ? 'Drop files here...' : 'Only files are allowed!'
					if ($scope.isEditMode)
					{
						if ($scope.showconfirmbox())
						{
							$scope.isEditMode = false;
							$scope.dropClass = ok ? 'over' : 'not-available';
						}
					}
					else if ($scope.files.length)
					{
						if ($scope.showconfirmbox())
						{
							$scope.files = [];
							$scope.dropClass = ok ? 'over' : 'not-available';
						}
					}
					else
					{
						$scope.dropClass = ok ? 'over' : 'not-available';
					}
				})
			}
		}
	}, false)
	dropbox.addEventListener("drop", function (evt)
	{
		console.log('drop evt:', JSON.parse(JSON.stringify(evt.dataTransfer)))
		evt.stopPropagation()
		evt.preventDefault()
		$scope.$apply(function ()
		{
			//$scope.dropText = 'Drop files here...'
			if ($scope.isEditMode)
			{
				if ($scope.showconfirmbox())
				{
					$scope.isEditMode = false;
					$scope.dropClass = '';
				}
			}
			else if ($scope.files.length)
			{
				if ($scope.showconfirmbox())
				{
					$scope.files = [];
					$scope.dropClass = '';
				}
			}
			else
			{
				$scope.dropClass = '';
			}
		})
		var files = evt.dataTransfer.files;
		console.log(files);
		if (files.length > 0)
		{
			$scope.$apply(function ()
			{
				//$scope.files = [];
				var nonImageFiles = 0;
				for (var i = 0; i < files.length; i++)
				{
					if (files[i].type.match('image.*')) $scope.files.push(files[i])
					else nonImageFiles++;
				};
				if (nonImageFiles > 0) alert("Only image files are accepted")
			})
		}
	}, false)}]).factory('httpRequestInterceptor', function ()
{
	return {
		request: function (config)
		{
			config.headers['Accept'] = 'application/json';
			config.headers['Content-Type'] = 'application/json; charset=utf-8';
			config.headers['OData-MaxVersion'] = '4.0';
			config.headers['Prefer'] = 'odata.include-annotations="*"';
			config.headers['OData-Version'] = '4.0';
			return config;
		}
	};
}).config(function ($httpProvider)
{
	$httpProvider.interceptors.push('httpRequestInterceptor');
}).service('CommonService', function ()
{});