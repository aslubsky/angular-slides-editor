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
var strtDragObject = false;
var strtResizeObject = false;

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


                /*element.on('dragover', function (e) {
                    //console.log('dragover', e);
                    layerX = e.layerX;
                    layerY = e.layerY;

                    if (e.preventDefault) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                    }
                    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                    return false;
                });*/
               /* element.on('drop', function (e) {
                    //layerX = e.layerX;
                    //layerY = e.layerY;
                    console.log('drop', e.layerX, e.layerY, e);
                    if (e.preventDefault) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                    }
                });*/


                //var clicks = 0;
                /*element.on('click', function(){
                 clicks++;
                 if (clicks == 1) {
                 setTimeout(function() {
                 if(clicks == 1) {
                 console.log('single click!');
                 if(document.activeElement && angular.isDefined(document.activeElement.attributes['slides-editor-object'])) {
                 $scope.$emit('object.selected', document.activeElement);
                 } else {
                 $scope.$emit('objects.unselected');
                 }
                 } else {
                 console.log('double click!');
                 if(document.activeElement && angular.isDefined(document.activeElement.attributes['slides-editor-object'])) {
                 $scope.$emit('object.edited', document.activeElement);
                 } else {
                 $scope.$emit('objects.unselected');
                 }
                 }
                 clicks = 0;
                 }, 300);
                 }
                 });*/


                $scope.loadSlide = function () {
                }


                /* controls for current slide */
                $scope._getObjectsCount = function () {
                    return angular.element(document.querySelectorAll("[slides-editor-object]")).length;
                }
                $scope._getRandomInt = function (max, min) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }
                $scope._getRandomLeftTop = function () {
                    var offset = 50;
                    return {
                        left: $scope._getRandomInt(offset, 700 - offset),
                        top: $scope._getRandomInt(offset, 500 - offset)
                    };
                }

                $scope.selectedObject = null;
                $scope.slideObjectsCount = $scope._getObjectsCount();
                $scope.hideInstruments = false;

                $scope.duplicateCurrentObject = function () {
                }
                $scope.removeCurrentObject = function () {
                }
                $scope.addText = function () {
                    var cnt = ++$scope.slideObjectsCount;
                    var pos = $scope._getRandomLeftTop();
                    var text = 'Text';
                    var newObject = angular.element('<div id="obj_' + cnt + '" class="object edit" draggable="true" slides-editor-object/>');
                    newObject.text(text);
                    newObject.attr('tabindex', cnt);
                    newObject.attr('contenteditable', 'true');
                    newObject.css({
                        zIndex: cnt,
                        width: '100px',
                        lineHeight: '46px',
                        height: '46px',
                        fontSize: '46px',
                        left: pos.left,
                        top: pos.top
                    });
                    //console.log(newObject.html());

                    angular.element(document.querySelector('.canvas-wrapper'))
                        .append($compile(newObject)($scope));
                    document.querySelectorAll("[slides-editor-object]")[cnt - 1].focus();
                    $scope.selectedObject = angular.element(document.activeElement);
                }
                $scope.addImage = function () {
                    var cnt = $scope._getObjectsCount();
                    //cnt
                    var pos = $scope._getRandomLeftTop();

                    //imageSrc = '/themes/default/assets/img/resources/default-image.png';

                    //console.log(cnt, pos, angular.element(document.querySelectorAll("[slides-editor-object]")[cnt-1]));
                    angular.element(document.querySelectorAll("[slides-editor-object]")[cnt - 1]).after($compile('<div class="object" slides-editor-object tabindex="4" draggable="true" style="z-index: 4;background-color: blue; width: 200px; height: 200px; left: 50px; top: 50px">' +
                    'Lorem ipsun dolor Lorem ipsun dolor Lorem ipsun dolor Lorem ipsun dolor Lorem ipsun dolor Lorem ipsun dolor' +
                    '</div>')($scope));
                }
                $scope.sendToBack = function () {
                }
                $scope.bringToFront = function () {
                }
                $scope.$on('objects.unselected', function (e, o) {
                    //console.log('objects.unselected', e, o);
                    //$scope.selectedObject
                    //    .attr('contenteditable', 'false')
                    //    .removeClass('edit')
                    //    .addClass('move');
                });
                $scope.$on('object.selected', function (e, o) {
                    $scope.selectedObject = angular.element(o);
                    console.log('object.selected', e, o);
                });
                $scope.$on('object.edited', function (e, o) {
                    $scope.selectedObject = angular.element(o);
                    console.log('object.edited', e, o);
                });
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
                //
                //var objClientX = 0;
                //var objClientY = 0;

                //console.log(element.get(0)).position().left);
                /*var startDrag = false;
                element.on('mouseup', function (e) {
                    console.log('mouseup', e);
                    startDrag = false;
                });
                element.on('mousedown', function (e) {
                    startDrag = true;
                    objClientX = e.clientX;
                    objClientY = e.clientY;
                    console.log('mousedown', e);
                });
                element.on('mousemove', function (e) {
                    if(startDrag) {
                        console.log('mousemove', e);
                    }
                });*/

                dragMaster.makeDraggable(element, document.querySelector('.canvas-wrapper'));


                //var clicks = 0;
                //element.on('click', function(){
                //    console.log('object click');
                //    clicks++;
                //    if (clicks == 1) {
                //        setTimeout(function() {
                //            if(clicks == 1) {
                //                console.log('single click!');
                //            } else {
                //                console.log('double click!');
                //            }
                //            clicks = 0;
                //        }, 300);
                //    }
                //});




                /*
                var savedRange, isInFocus;

                function saveSelection() {
                    if (window.getSelection)//non IE Browsers
                    {
                        savedRange = window.getSelection().getRangeAt(0);
                    }
                    else if (document.selection)//IE
                    {
                        savedRange = document.selection.createRange();
                    }
                }

                function restoreSelection() {
                    isInFocus = true;
                    //console.log('restoreSelection', isInFocus);
                    element[0].focus();
                    if (savedRange != null) {
                        if (window.getSelection)//non IE and there is already a selection
                        {
                            var s = window.getSelection();
                            if (s.rangeCount > 0)
                                s.removeAllRanges();
                            s.addRange(savedRange);
                        }
                        else if (document.createRange)//non IE and no selection
                        {
                            window.getSelection().addRange(savedRange);
                        }
                        else if (document.selection)//IE
                        {
                            savedRange.select();
                        }
                    }
                }

                //this part onwards is only needed if you want to restore selection onclick
                var isInFocus = false;

                function onDivBlur() {
                    isInFocus = false;
                    //console.log('onDivBlur', isInFocus);
                    element
                        .attr('contenteditable', 'false')
                        .removeClass('edit')
                        .addClass('move');
                }

                function cancelEvent(e) {
                    if (isInFocus == false && savedRange != null) {
                        if (e && e.preventDefault) {
                            //alert("FF");
                            e.stopPropagation(); // DOM style (return false doesn't always work in FF)
                            e.preventDefault();
                        }
                        else {
                            window.event.cancelBubble = true;//IE stopPropagation
                        }
                        restoreSelection();
                        return false; // false = IE style
                    }
                }

                element.on('blur', onDivBlur);
                //element.on('mousedown', cancelEvent);
                //element.on('click', cancelEvent);
                element.on('mouseup', saveSelection);
                element.on('keyup', saveSelection);
                //element.on('focus', restoreSelection);


                var clicks = 0;
                element.on('click', function () {
                    clicks++;
                    if (clicks == 1) {
                        setTimeout(function () {
                            if (clicks == 1) {
                                //console.log('single click!');
                            } else {
                                //console.log('double click!');
                                if (!isInFocus) {
                                    //console.log('EDIT!');
                                    $scope.selectedObject
                                        .attr('contenteditable', 'true')
                                        .removeClass('move')
                                        .addClass('edit');
                                    restoreSelection();
                                }
                            }
                            clicks = 0;
                        }, 300);
                    }
                });*/
            }
        }
    }
]);