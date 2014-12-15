var selectPicker = {

    common : {
        getItemHeight : function() {
            var selectPickerWrapperSpan = document.querySelector('#selectPickerWrapper span');
            return parseInt(window.getComputedStyle(selectPickerWrapperSpan, null).getPropertyValue('height'));
        },

        getWrapperHeight : function() {
            var selectPickerWrapper = document.getElementById('selectPickerWrapper');
            return parseInt(window.getComputedStyle(selectPickerWrapper, null).getPropertyValue('height')) - (selectPicker.itemHeight);
        },

        hideNativeSelectElement : function(selectPicker) {
            selectPicker.nativeElement.style.display = 'none';
        },

        init : function(selectPicker) {
            selectPicker.itemHeight = this.getItemHeight();
            selectPicker.wrapperHeight = this.getWrapperHeight();
            console.log(selectPicker.wrapperHeight);
            this.hideNativeSelectElement(selectPicker);
        }
    },

    buildHTML : function() {
        var selectPicker = document.createElement("div"),
            selectPickerWrapper = document.createElement("div"),
            selectPickerOverflow = document.createElement("div");

        selectPicker.setAttribute('id', 'selectPicker');
        selectPickerWrapper.setAttribute('id', 'selectPickerWrapper');
        selectPickerOverflow.setAttribute('id', 'selectPickerOverflow');

        // insert before select
        this.nativeElement.parentNode.insertBefore(selectPickerOverflow, this.nativeElement);

        var selectPickerOverflow = document.getElementById('selectPickerOverflow');

        selectPickerOverflow.appendChild(selectPicker);

        var selectPicker = document.getElementById('selectPicker');

        selectPicker.appendChild(selectPickerWrapper);

        this.selectPickerWrapper = selectPickerWrapper;

        for(var i = 0; i < this.nativeElement.children.length; i++) {
            var child = document.createElement("span");
            child.textContent = this.nativeElement.children[i].textContent;
            selectPickerWrapper.appendChild(child)
        }

        this.hammer();
    },

    hammer : function() {
        var $selectPickerWrapper = new Hammer(this.selectPickerWrapper);
        selectPickerWrapper = this.selectPickerWrapper,
            _this = this,
            selectPicker.currentPos = parseInt(window.getComputedStyle(selectPickerWrapper, null).getPropertyValue('top'));

        // trigger touch event on wrapper
        $selectPickerWrapper.get('pan').set({ direction: Hammer.DIRECTION_ALL });

        // listen to events...
        $selectPickerWrapper.on("panup pandown", function(e) {

            _this.stopAtTheEdge.init(true);

            // change position
            _this.changePosition(e);

        });
    },

    stopAtTheEdge : {

        detectEgdge : function() {
            selectPicker.currentPos = parseInt(window.getComputedStyle(selectPickerWrapper, null).getPropertyValue('top'));
            if(selectPicker.currentPos < -selectPicker.wrapperHeight) {
                selectPickerWrapper.style.top = -selectPicker.wrapperHeight + 'px';
            } else if (selectPicker.currentPos > 0) {
                selectPickerWrapper.style.top = 0;
            }
            console.log('d');
        },

        init : function(status) {
            var _this = this;
            if(status) {
                console.log('go');
                this.detectEdgeInterval = setInterval(this.detectEgdge, 200);

            } else {
                console.log('kill');
                clearInterval(this.detectEdgeInterval);
            }
        }
    },

    changePosition : function(e) {

        // get current item position & define delta ratio swip
        var deltaRatio = parseInt((e.deltaY % this.itemHeight)/10) * this.itemHeight,
            switchItem = false;
        _this = this;

        //calcule swipe position
        if((e.type == 'panup' && selectPicker.currentPos > -selectPicker.wrapperHeight) || (e.type == 'pandown' && selectPicker.currentPos < 0)) {

            // arrondir au multiple de la hauteur d'un élément
            if(parseInt(selectPicker.currentPos) > 0)
                selectPicker.currentPos = Math.ceil(parseInt(selectPicker.currentPos)/this.itemHeight) * this.itemHeight;
            else if( parseInt(selectPicker.currentPos) < 0)
                selectPicker.currentPos = Math.floor(parseInt(selectPicker.currentPos)/this.itemHeight) * this.itemHeight;
            else
                selectPicker.currentPos = this.itemHeight;

            // change position;
            selectPickerWrapper.style.top = selectPicker.currentPos + parseInt(deltaRatio) + 'px';
        }

        // detect current item when action is finished
        if(e.isFinal) {

            setTimeout(function(){
                _this.detectCurrentItem(Math.abs(parseInt(window.getComputedStyle(selectPickerWrapper, null).getPropertyValue('top'))));
                _this.stopAtTheEdge.init(false);
            }, 700);

        }
    },

    detectCurrentItem : function(currentPos) {

        // remove old active class
        var listItems = document.querySelectorAll('#selectPickerWrapper span');
        for(var i = 0; i < listItems.length; i++ ) {
            listItems[i].classList.remove('active');
        }

        // add class on new active item
        document.getElementById('selectPickerWrapper').children[currentPos/40].classList.add('active');
    },

    init : function(element) {

        this.nativeElement = document.getElementById(element);
        this.buildHTML();
        this.common.init(this);
        console.log(this.itemHeight);
    }
}

window.onload=function(){
    selectPicker.init('mySelect');
};