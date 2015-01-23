/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc directive
 * @name ngTable.directive:ngTable
 * @restrict A
 *
 * @description
 * Directive that instantiates {@link ngTable.directive:ngTable.ngTableController ngTableController}.
 */

var layerX = 0;
var layerY = 0;

app.directive('angularSlidesEditor', ['$compile', '$q', '$parse',
    function ($compile, $q, $parse) {
        'use strict';

        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'angular-slides-editor/main.html',
            controller: angularSlidesEditorController,
            link: function ($scope, element, attrs, ngModel) {

                //console.log(element.find('.canvas-wrapper div'));
                //element.find('.canvas-wrapper div').on('dragstart', function(e){
                //    console.log('dragstart', e);
                //    //this.style.opacity = '0.1';  // this / e.target is the source node.
                //});


                element.on('dragover', function (e) {
                    //console.log('dragover', e);
                    if (e.preventDefault) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                    }
                    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                    return false;
                });
                element.on('drop', function (e) {
                    layerX = e.layerX;
                    layerY = e.layerY;
                    //console.log('drop', e);
                    this.style.opacity = '1';  // this / e.target is the source node.
                    if (e.preventDefault) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                    }
                });


                $scope.loadSlide = function () {
                }
            }
        }
    }
]);

app.directive('slidesEditorObject', ['$compile', '$q', '$parse',
    function ($compile, $q, $parse) {
        'use strict';

        return {
            restrict: 'A',
            scope: true,
            link: function ($scope, element, attrs) {
                //console.log(element);

                var objLayerX = 0;
                var objLayerY = 0;

                //console.log(element.get(0)).position().left);
                element.on('dragstart', function (e) {
                    objLayerX = e.layerX;
                    objLayerY = e.layerY;

                    //console.log('dragstart', e);
                    e.dataTransfer.effectAllowed = 'move';  // See the section on the DataTransfer object.
                    //e.dataTransfer.effectAllowed = 'move';  // See the section on the DataTransfer object.
                    this.style.opacity = '0.8';  // this / e.target is the source node.
                    //this.style.top = e.clientY+'px';
                    //this.style.left = e.clientX+'px';
                    e.dataTransfer.setData('Text', '1111'); // required otherwise doesn't work

                    //console.log(e.clientX, e.layerX, e.pageX);
                });
                element.on('dragend', function (e) {
                    //console.log('dragend', e, e.layerX, layerX);
                    this.style.left = (layerX - objLayerX ) + 'px';
                    this.style.top = (layerY - objLayerY) + 'px';
                    this.style.opacity = '1';  // this / e.target is the source node.
                });


                element.find('.object-expand-point').on('dragstart', function (e) {
                    /*objLayerX = e.layerX;
                    objLayerY = e.layerY;*/

                    console.log('dragstart', e);
                    e.dataTransfer.effectAllowed = 'move';  // See the section on the DataTransfer object.
                    //e.dataTransfer.effectAllowed = 'move';  // See the section on the DataTransfer object.
                    //this.style.opacity = '0.8';  // this / e.target is the source node.
                    //this.style.top = e.clientY+'px';
                    //this.style.left = e.clientX+'px';
                    e.dataTransfer.setData('Text', '22222'); // required otherwise doesn't work

                    //console.log(e.clientX, e.layerX, e.pageX);
                });


            }
        }
    }
]);