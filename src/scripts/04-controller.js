/**
 * angularSlidesEditor: Angular JS Slide editor
 *
 * @author Alex Slubsky <aslubsky@gmail.com>
 * @url https://github.com/aslubsky/angular-slides-editor/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc object
 * @name angularSlidesEditor.directive:angularSlidesEditor.angularSlidesEditorController
 *
 * @description
 *
 */
var angularSlidesEditorController = ['$scope', '$timeout', function ($scope, $timeout) {
    console.info('angularSlidesEditorController');


    function Naviation() {
        this.currentV = 0;
        this.currentH = 0;
        this.countH = 0;
        this.countV = 0;
    }
    Naviation.prototype.current = function (type) {
        return this['current' + type];
    }
    $scope.naviation = new Naviation();

    $scope.slides = [
        [{id: 1}]
    ];
}];


app.filter('translate', ['$rootScope', function ($rootScope) {
    return function (string) {
        //var translateBundle = $rootScope.$localeBundle || {};
        //return translateBundle[string] || string;
        return string;
    };
}]);