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
        
        $http.post(baseUrl + '/user/saveEntity.htm', $scope.user).success(function (res) {
            console.info(res);
        })
    };
    var organize = $http.get(baseUrl + '/organize/findAll.htm').success(function (res) {
        if(res && res.code == 200){
            $scope.organizeList = res.doc;
        }
    });
    $http.get(baseUrl + '/company/findAll.htm').success(function (res) {
        if(res && res.code == 200){
            $scope.companyList = res.doc;
        }
    });
    $http.get(baseUrl + '/role/findAll.htm').success(function (res) {
        if(res && res.code == 200){
            $scope.roleList = res.doc;
        }
    });

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    $http.post(baseUrl + '/organize/findNextAllById.htm',{_id:'5795e2e8e1ea987d3ef25e27'}).success(function (res) {
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

    $scope.$on('$load',function () {
        $('.chosen-select').chosen({no_results_text: '没有搜索到此结果'}).change(function (tar, val) {
            $scope.$apply(function () {
                $scope.placeholder = val
            })
        });
    });

=======
>>>>>>> b0ece57ba5804a710060af70a478d2711f5fe03b
=======
>>>>>>> b0ece57ba5804a710060af70a478d2711f5fe03b
=======
>>>>>>> b0ece57ba5804a710060af70a478d2711f5fe03b
}])

.controller('FileUploadCtrl',['$scope','$http',function ($scope,$http) {
    var uploader = WebUploader.create({
        auto:true,
        compress:false,
        server: baseUrl + '/load/profile.htm',
        pick: '#fileUpload',
    })
    uploader.on('uploadSuccess',function(file,res){
        console.info(file)
        console.info(res)
        $scope.$apply(function(){
            $scope.filePath = res.doc[0].path;
        })
    })
}])

.controller('LoginCtrl',['$scope','$http',function ($scope,$http) {
    $scope.user = {user:'admin',password:'666666'}
    $scope.login = function () {
        $http.post(baseUrl + '/user/login.htm',$scope.user).success(function (res) {
            if(res && res.code == 200){
                window.sessionStorage.setItem('token',res.token);
            }
        })
    }
}]);

