var dragMaster = (function () {

    var parentOffset;
    var dragObject;
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
        dragObject = null;

        document.onmousemove = null;
        document.onmouseup = null;
        document.ondragstart = null;
        document.body.onselectstart = null;
    }

    function mouseMove(e) {
        //console.log('dragType', dragType);
        console.log('mouseMove', e.clientX - parentOffset.x, e, dragObject.offsetWidth);
        switch(dragType) {
            case 'resize-br':
                dragObject.style.width = (e.clientX - parentOffset.x) + 'px';
                //dragObject.style.left = (e.clientX - parentOffset.x - mouseOffset.x) + 'px';
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

        console.log('mouseOffset', mouseOffset);
        console.log(e, this.offsetWidth, resizeOffset);

        if(
            (mouseOffset.x >= this.offsetWidth - resizeOffset && mouseOffset.x <= this.offsetWidth) &&
            (mouseOffset.y >= this.offsetHeight - resizeOffset && mouseOffset.y <= this.offsetHeight)) {

            dragType = 'resize-br';
            //console.log('return');
            //ignore this, this is browser resize
            //return false;
        }
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
        makeDraggable: function (element, p) {
            parentOffset = getPosition(p);
            element.on('mousedown', mouseDown);
        }
    }
}());