/**
 * Created by Yuan on 2016/7/22.
 */
ApplicationConfig.registerModule("userModule");

angular.module('userModule',[])
    
.controller('UserCtrl',['$scope','$http','$q',function ($scope,$http,$q) {
    
    $scope.user = {};
    $scope.user.sort = 0;
    $scope.save = function () {
        $scope.user.organizeName = $scope.user.organizeId.name;
        $scope.user.organizeId = $scope.user.organizeId._id;

        $scope.user.companyName = $scope.user.companyId.name;
        $scope.user.companyId = $scope.user.companyId._id;

        $scope.user.roleName = $scope.user.roleId.name;
        $scope.user.roleId = $scope.user.roleId._id;
        
        $http.post(baseUrl + '/user/saveEntity.htm', $scope.user).then(function (res) {
            console.info(res);
        })
    };
    var organize = $http.get(baseUrl + '/organize/findAll.htm').then(function (res) {
        if(res && res.code == 200){
            $scope.organizeList = res.doc;
        }
    });
    $http.get(baseUrl + '/company/findAll.htm').then(function (res) {
        if(res && res.code == 200){
            $scope.companyList = res.doc;
        }
    });
    $http.get(baseUrl + '/role/findAll.htm').then(function (res) {
        if(res && res.code == 200){
            $scope.roleList = res.doc;
        }
    });

    $http.post(baseUrl + '/organize/findNextAllById.htm',{_id:'5795e2e8e1ea987d3ef25e27'}).then(function (res) {
        if(res && res.code == 200){
            console.info(res);
        }
    });

    $(function () {
        $q.all([organize]).then(function () {
            setTimeout(function () {
                $scope.$emit('$load')
            })
        })
    });

}])

.controller('FileUploadCtrl',['$scope','$http',function ($scope,$http) {
    var guid = WebUploader.Base.guid();
    var uploader = WebUploader.create({
        auto:true,
        compress:false,
        server: baseUrl + '/load/profile.htm',
        pick: '#fileUpload',
        chunked:true,
        chunkSize:5242880*2,
        threads:5,
        thumb:null,
        formData:{guid:guid},
    })
    uploader.on('uploadSuccess',function(file,res){
        var data = res.doc[0];
        var destination = data.destination;
        var originalname = data.originalname;
        var chunks = data.chunks;
        if(chunks){
            $http.post(baseUrl + '/load/profileCount.htm',data).then(function (res) {
                $scope.filePath = res.doc[0].path;
            });
        }else{
            $scope.$apply(function(){
                $scope.filePath = res.doc[0].path;
            })
        }
    })
    uploader.on('uploadComplete',function(){
        uploader.reset();
    })
}])

.controller('LoginCtrl',['$scope','$http',function ($scope,$http) {
    $scope.user = {user:'admin',password:'666666'}
    $scope.login = function () {
        $http.post(baseUrl + '/user/login.htm',$scope.user).then(function (res) {
            if(res && res.code == 200){
                window.sessionStorage.setItem('token',res.token);
            }
        })
    }
}]);

