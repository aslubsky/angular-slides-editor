var dragMaster = (function () {

    var $scope;
    var parentOffset;
    var dragObject;
    var dragObjectRatio;
    var mouseOffset;
    var dragType;
    var resizeOffset = 20;

    function getMouseOffset(target, e) {
        var docPos = getPosition(target);
        return {
            x: e.pageX - docPos.x,
            y: e.pageY - docPos.y
        };
    }

    function getPosition(e) {
        var left = 0
        var top = 0

        while (e.offsetParent) {
            left += e.offsetLeft
            top += e.offsetTop
            e = e.offsetParent
        }

        left += e.offsetLeft
        top += e.offsetTop

        return {x: left, y: top}
    }

    function mouseUp() {
        document.onmousemove = null;
        document.onmouseup = null;
        document.ondragstart = null;
        document.body.onselectstart = null;

        if(dragType != 'move') {
            dragObject.style.width = dragObject.offsetWidth + 'px';
            dragObject.style.height = dragObject.offsetHeight + 'px';
        }
        dragObject = null;
        //$scope.$emit('objects.unselected');
    }

    function mouseMove(e) {
        //console.log('dragType', dragType);
        switch(dragType) {
            case 'resize-br':
                var right = (960 - (e.clientX - parentOffset.x));
                dragObject.style.right = right + 'px';
                var h = dragObject.offsetWidth/dragObjectRatio;
                var top = parseInt(dragObject.style.top.replace('px', ''), 10);
                dragObject.style.bottom = (700 - top - h)  + 'px';
            break;
            case 'resize-bl':
                var left = (e.clientX - parentOffset.x);
                dragObject.style.left = left + 'px';
                var h = dragObject.offsetWidth/dragObjectRatio;
                var top = parseInt(dragObject.style.top.replace('px', ''), 10);
                dragObject.style.bottom = (700 - top - h)  + 'px';
            break;
            case 'resize-tr':
                var right = (960 - (e.clientX - parentOffset.x));
                dragObject.style.right = right + 'px';
                var h = dragObject.offsetWidth/dragObjectRatio;
                var bottom = parseInt(dragObject.style.bottom.replace('px', ''), 10);
                dragObject.style.top = (700 - bottom - h)  + 'px';
            break;
            case 'resize-tl':
                dragObject.style.left = (e.clientX - parentOffset.x) + 'px';
                var h = dragObject.offsetWidth/dragObjectRatio;
                var bottom = parseInt(dragObject.style.bottom.replace('px', ''), 10);
                dragObject.style.top = (700 - bottom - h)  + 'px';
            break;
            case 'resize-ml':
                dragObject.style.left = (e.clientX - parentOffset.x) + 'px';
            break;
            case 'resize-mr':
                dragObject.style.right = (960 - (e.clientX - parentOffset.x)) + 'px';
            break;
            case 'resize-tc':
                dragObject.style.top = (e.clientY - parentOffset.y) + 'px';
            break;
            case 'resize-bc':
                dragObject.style.bottom = (700 - (e.clientY - parentOffset.y))  + 'px';
            break;
            default:
                dragObject.style.top = (e.clientY - parentOffset.y - mouseOffset.y) + 'px';
                dragObject.style.left = (e.clientX - parentOffset.x - mouseOffset.x) + 'px';
        }

        return false;
    }

    function mouseDown(e) {
        dragObject = this;
        dragType = 'move';
        mouseOffset = getMouseOffset(this, e);

        $scope.$emit('object.selected', this);
        //console.log('mouseOffset', mouseOffset);
        if(e.target.classList.toString().indexOf('object-expand-point') != -1) {
            dragType = 'resize-' + e.target.classList.toString().replace('object-expand-point ', '');
        }
        //console.log( dragObject.style.left, dragObject.offsetWidth);
        dragObjectRatio = dragObject.offsetWidth/dragObject.offsetHeight;

        if(dragType != 'move') {
            var left = parseInt(dragObject.style.left.replace('px', ''), 10);
            dragObject.style.right = (960 - left - dragObject.offsetWidth)  + 'px';
            dragObject.style.width = 'auto';

            var top = parseInt(dragObject.style.top.replace('px', ''), 10);
            dragObject.style.bottom = (700 - top - dragObject.offsetHeight)  + 'px';
            dragObject.style.height = 'auto';
        }

        //console.log(dragObject.style.right);
        //console.log(dragObject.style.width);
        console.log('dragType', dragType);

        document.onmousemove = mouseMove;
        document.onmouseup = mouseUp;

        document.ondragstart = function () {
            return false
        }
        document.body.onselectstart = function () {
            return false
        }

        return false;
    }

    return {
        makeDraggable: function (element, p, scope) {
            $scope = scope;
            parentOffset = getPosition(p);
            element.on('mousedown', mouseDown);
        }
    }
}());