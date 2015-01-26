/**
 * angularSlidesEditor: Angular JS Slide editor
 *
 * @author Alex Slubsky <aslubsky@gmail.com>
 * @url https://github.com/aslubsky/angular-slides-editor/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc directive
 * @name angularSlidesEditor.directive:angularSlidesEditor
 * @restrict A
 *
 * @description
 *
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
            //controller: angularSlidesEditorController,
            link: function ($scope, element, attrs, ngModel) {
                var editorElement = angular.element(document.querySelector('.canvas-wrapper'));

                editorElement.on('click', function () {
                    if (document.activeElement && angular.isDefined(document.activeElement.attributes['slides-editor-object'])) {
                    } else {
                        $scope.$emit('objects.unselected');
                    }
                });


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
                $scope.imageCtrl = false;
                $scope.textCtrl = false;

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

                    editorElement.append($compile(newObject)($scope));
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


                $scope.textProperties = JSON.parse(window.localStorage.getItem('aseTextProperties'));
                if(!$scope.textProperties) {
                    $scope.textProperties = {
                        fontFamily: 'helvetica',
                        fontSize: 46,
                        fill: '#000000',
                        backgroundColor: '',
                        lineHeight: 46,
                        padding: 0,
                        fontWeight: '',
                        fontStyle: '',
                        textAlign: 'left',
                        textDecoration: ''
                    }
                }


                $scope._toPx = function (str) {
                    return str + 'px';
                }
                $scope._fromPx = function (str) {
                    return str.length > 0 ? parseInt(str.replace('px', ''), 0) : str;
                }
                $scope._componentToHex = function(c) {
                    var hex = c.toString(16);
                    return hex.length == 1 ? "0" + hex : hex;
                }

                $scope._fromRgb = function(str) {
                    str = str.replace('rgb(', '');
                    str = str.replace(' ', '');
                    str = str.replace(')', '');
                    var parts = str.split(',');
                    return "#" + $scope._componentToHex(parseInt(parts[0], 10)) +
                        $scope._componentToHex(parseInt(parts[1], 10)) +
                        $scope._componentToHex(parseInt(parts[2], 10));
                }

                var textAttributes = {
                    'fontSize': {
                        convert: $scope._toPx,
                        parse: $scope._fromPx
                    },
                    'padding': {
                        convert: $scope._toPx,
                        parse: $scope._fromPx
                    },
                    'lineHeight': {
                        convert: $scope._toPx,
                        parse: $scope._fromPx
                    },
                    'fontStyle': {},
                    'fontWeight': {},
                    'textDecoration': {},
                    'textAlign': {},
                    'fontFamily': {},
                    'color': {
                        parse: $scope._fromRgb
                    },
                    'backgroundColor': {
                        parse: $scope._fromRgb
                    }
                };

                var textAttr = Object.keys(textAttributes);
                textAttr.forEach(function(attr){
                    $scope.$watch(attr, function(nv, ov){
                        if($scope.selectedObject) {
                            console.log('textAttributes', attr, nv, ov);
                            $scope.selectedObject.css(attr,
                                angular.isDefined(textAttributes[attr].convert) ?
                                    textAttributes[attr].convert(nv) : nv);
                        }
                    });
                });
                $scope._parseCurrentObjectAttributes = function() {
                    if ($scope.selectedObject[0].hasAttribute('contenteditable')) {
                        textAttr.forEach(function(attr){
                            var val = $scope.selectedObject.css(attr);
                            if(!val) {
                                val = $scope.textProperties[attr];
                            }
                            $scope[attr] = angular.isDefined(textAttributes[attr].parse) ? textAttributes[attr].parse(val) : val;
                        });
                    } else {
                        $scope.imageSrc = $scope.selectedObject.attr('src');
                    }
                }




                /* events */
                $scope.$on('objects.unselected', function (e, o) {
                    console.log('objects.unselected', e, o);
                    //$scope.selectedObject
                    //    .attr('contenteditable', 'false')
                    //    .removeClass('edit')
                    //    .addClass('move');
                    $scope.hideInstruments = false;
                    $scope.imageCtrl = false;
                    $scope.textCtrl = false;
                    $scope.selectedObject = null;

                    angular.element(document.getElementsByClassName('object')).removeClass('active');

                    $scope.$apply();
                });
                $scope.$on('object.selected', function (e, o) {
                    $scope.selectedObject = angular.element(o);
                    $scope.hideInstruments = true;
                    $scope.imageCtrl = false;
                    $scope.textCtrl = false;
                    if (o.hasAttribute('contenteditable')) {
                        $scope.textCtrl = true;
                    } else {
                        $scope.imageCtrl = true;
                    }
                    angular.element(document.getElementsByClassName('object')).removeClass('active');
                    $scope.selectedObject.addClass('active');
                    $scope._parseCurrentObjectAttributes();
                    console.log('object.selected', e, o, $scope.selectedObject);
                    $scope.$apply();
                });
                $scope.$on('object.edited', function (e, o) {
                    //$scope.selectedObject = angular.element(o);
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



                //console.info($scope, $scope.$parent);
                dragMaster.makeDraggable(element, document.querySelector('.canvas-wrapper'), $scope.$parent);


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