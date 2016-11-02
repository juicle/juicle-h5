+function ($) {
    "use strict";

    //全局配置
    var defaults = {
        autoInit: false, //自动初始化页面
        showPageLoadingIndicator: true, //push.js加载页面的时候显示一个加载提示
        router: true, //默认使用router
        swipePanel: "left", //滑动打开侧栏
        swipePanelOnlyClose: true  //只允许滑动关闭，不允许滑动打开侧栏
    };

    $.smConfig = $.extend(defaults, $.config);

}(Zepto);

+ function($) {
    "use strict";
    $.compareVersion = function(a, b) {
        var as = a.split('.');
        var bs = b.split('.');
        if (a === b) return 0;

        for (var i = 0; i < as.length; i++) {
            var x = parseInt(as[i]);
            if (!bs[i]) return 1;
            var y = parseInt(bs[i]);
            if (x < y) return -1;
            if (x > y) return 1;
        }
        return -1;
    };

    $.getCurrentPage = function() {
        return $(".page-current")[0] || $(".page")[0] || document.body;
    };

}(Zepto);

/* global WebKitCSSMatrix:true */

(function($) {
    "use strict";
    ['width', 'height'].forEach(function(dimension) {
        var  Dimension = dimension.replace(/./, function(m) {
            return m[0].toUpperCase();
        });
        $.fn['outer' + Dimension] = function(margin) {
            var elem = this;
            if (elem) {
                var size = elem[dimension]();
                var sides = {
                    'width': ['left', 'right'],
                    'height': ['top', 'bottom']
                };
                sides[dimension].forEach(function(side) {
                    if (margin) size += parseInt(elem.css('margin-' + side), 10);
                });
                return size;
            } else {
                return null;
            }
        };
    });

    //support
    $.support = (function() {
        var support = {
            touch: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch)
        };
        return support;
    })();

    $.touchEvents = {
        start: $.support.touch ? 'touchstart' : 'mousedown',
        move: $.support.touch ? 'touchmove' : 'mousemove',
        end: $.support.touch ? 'touchend' : 'mouseup'
    };

    $.getTranslate = function (el, axis) {
        var matrix, curTransform, curStyle, transformMatrix;

        // automatic axis detection
        if (typeof axis === 'undefined') {
            axis = 'x';
        }

        curStyle = window.getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            // Some old versions of Webkit choke when 'none' is passed; pass
            // empty string instead in this case
            transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
        }
        else {
            transformMatrix = curStyle.MozTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
            matrix = transformMatrix.toString().split(',');
        }

        if (axis === 'x') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m41;
            //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[12]);
            //Normal Browsers
            else
                curTransform = parseFloat(matrix[4]);
        }
        if (axis === 'y') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m42;
            //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[13]);
            //Normal Browsers
            else
                curTransform = parseFloat(matrix[5]);
        }

        return curTransform || 0;
    };
    /* jshint ignore:start */
    $.requestAnimationFrame = function (callback) {
        if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
        else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
        else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);
        else {
            return window.setTimeout(callback, 1000 / 60);
        }
    };
    $.cancelAnimationFrame = function (id) {
        if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
        else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);
        else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);
        else {
            return window.clearTimeout(id);
        }
    };
    /* jshint ignore:end */

    $.fn.dataset = function() {
        var dataset = {},
            ds = this[0].dataset;
        for (var key in ds) { // jshint ignore:line
            var item = (dataset[key] = ds[key]);
            if (item === 'false') dataset[key] = false;
            else if (item === 'true') dataset[key] = true;
            else if (parseFloat(item) === item * 1) dataset[key] = item * 1;
        }
        // mixin dataset and __eleData
        return $.extend({}, dataset, this[0].__eleData);
    };
    $.fn.data = function(key, value) {
        var tmpData = $(this).dataset();
        if (!key) {
            return tmpData;
        }
        // value may be 0, false, null
        if (typeof value === 'undefined') {
            // Get value
            var dataVal = tmpData[key],
                __eD = this[0].__eleData;

            //if (dataVal !== undefined) {
            if (__eD && (key in __eD)) {
                return __eD[key];
            } else {
                return dataVal;
            }

        } else {
            // Set value,uniformly set in extra ```__eleData```
            for (var i = 0; i < this.length; i++) {
                var el = this[i];
                // delete multiple data in dataset
                if (key in tmpData) delete el.dataset[key];

                if (!el.__eleData) el.__eleData = {};
                el.__eleData[key] = value;
            }
            return this;
        }
    };
    function __dealCssEvent(eventNameArr, callback) {
        var events = eventNameArr,
            i, dom = this;// jshint ignore:line

        function fireCallBack(e) {
            /*jshint validthis:true */
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
    }
    $.fn.animationEnd = function(callback) {
        __dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
        return this;
    };
    $.fn.transitionEnd = function(callback) {
        __dealCssEvent.call(this, ['webkitTransitionEnd', 'transitionend'], callback);
        return this;
    };
    $.fn.transition = function(duration) {
        if (typeof duration !== 'string') {
            duration = duration + 'ms';
        }
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransitionDuration = elStyle.MozTransitionDuration = elStyle.transitionDuration = duration;
        }
        return this;
    };
    $.fn.transform = function(transform) {
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransform = elStyle.MozTransform = elStyle.transform = transform;
        }
        return this;
    };
    $.fn.prevAll = function (selector) {
        var prevEls = [];
        var el = this[0];
        if (!el) return $([]);
        while (el.previousElementSibling) {
            var prev = el.previousElementSibling;
            if (selector) {
                if($(prev).is(selector)) prevEls.push(prev);
            }
            else prevEls.push(prev);
            el = prev;
        }
        return $(prevEls);
    };
    $.fn.nextAll = function (selector) {
        var nextEls = [];
        var el = this[0];
        if (!el) return $([]);
        while (el.nextElementSibling) {
            var next = el.nextElementSibling;
            if (selector) {
                if($(next).is(selector)) nextEls.push(next);
            }
            else nextEls.push(next);
            el = next;
        }
        return $(nextEls);
    };

    //重置zepto的show方法，防止有些人引用的版本中 show 方法操作 opacity 属性影响动画执行
    $.fn.show = function(){
        var elementDisplay = {};
        function defaultDisplay(nodeName) {
            var element, display;
            if (!elementDisplay[nodeName]) {
                element = document.createElement(nodeName);
                document.body.appendChild(element);
                display = getComputedStyle(element, '').getPropertyValue("display");
                element.parentNode.removeChild(element);
                display === "none" && (display = "block");
                elementDisplay[nodeName] = display;
            }
            return elementDisplay[nodeName];
        }

        return this.each(function(){
            this.style.display === "none" && (this.style.display = '');
            if (getComputedStyle(this, '').getPropertyValue("display") === "none");
            this.style.display = defaultDisplay(this.nodeName);
        });
    };
})(Zepto);

/*===========================
Device/OS Detection
===========================*/
;(function ($) {
    "use strict";
    var device = {};
    var ua = navigator.userAgent;

    var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

    device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;

    // Android
    if (android) {
        device.os = 'android';
        device.osVersion = android[2];
        device.android = true;
        device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
    }
    if (ipad || iphone || ipod) {
        device.os = 'ios';
        device.ios = true;
    }
    // iOS
    if (iphone && !ipod) {
        device.osVersion = iphone[2].replace(/_/g, '.');
        device.iphone = true;
    }
    if (ipad) {
        device.osVersion = ipad[2].replace(/_/g, '.');
        device.ipad = true;
    }
    if (ipod) {
        device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
        device.iphone = true;
    }
    // iOS 8+ changed UA
    if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
        if (device.osVersion.split('.')[0] === '10') {
            device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
        }
    }

    // Webview
    device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);

    // Minimal UI
    if (device.os && device.os === 'ios') {
        var osVersionArr = device.osVersion.split('.');
        device.minimalUi = !device.webView &&
            (ipod || iphone) &&
            (osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) &&
            $('meta[name="viewport"]').length > 0 && $('meta[name="viewport"]').attr('content').indexOf('minimal-ui') >= 0;
    }

    // Check for status bar and fullscreen app mode
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    device.statusBar = false;
    if (device.webView && (windowWidth * windowHeight === screen.width * screen.height)) {
        device.statusBar = true;
    }
    else {
        device.statusBar = false;
    }

    // Classes
    var classNames = [];

    // Pixel Ratio
    device.pixelRatio = window.devicePixelRatio || 1;
    classNames.push('pixel-ratio-' + Math.floor(device.pixelRatio));
    if (device.pixelRatio >= 2) {
        classNames.push('retina');
    }

    // OS classes
    if (device.os) {
        classNames.push(device.os, device.os + '-' + device.osVersion.split('.')[0], device.os + '-' + device.osVersion.replace(/\./g, '-'));
        if (device.os === 'ios') {
            var major = parseInt(device.osVersion.split('.')[0], 10);
            for (var i = major - 1; i >= 6; i--) {
                classNames.push('ios-gt-' + i);
            }
        }

    }
    // Status bar classes
    if (device.statusBar) {
        classNames.push('with-statusbar-overlay');
    }
    else {
        $('html').removeClass('with-statusbar-overlay');
    }

    // Add html classes
    if (classNames.length > 0) $('html').addClass(classNames.join(' '));

    // keng..
    device.isWeixin = /MicroMessenger/i.test(ua);

    $.device = device;
})(Zepto);

;(function () {
    'use strict';

    /**
     * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
     *
     * @codingstandard ftlabs-jsv2
     * @copyright The Financial Times Limited [All Rights Reserved]
     * @license MIT License (see LICENSE.txt)
     */

    /*jslint browser:true, node:true, elision:true*/
    /*global Event, Node*/


    /**
     * Instantiate fast-clicking listeners on the specified layer.
     *
     * @constructor
     * @param {Element} layer The layer to listen on
     * @param {Object} [options={}] The options to override the defaults
     */
    function FastClick(layer, options) {
        var oldOnClick;

        options = options || {};

        /**
         * Whether a click is currently being tracked.
         *
         * @type boolean
         */
        this.trackingClick = false;


        /**
         * Timestamp for when click tracking started.
         *
         * @type number
         */
        this.trackingClickStart = 0;


        /**
         * The element being tracked for a click.
         *
         * @type EventTarget
         */
        this.targetElement = null;


        /**
         * X-coordinate of touch start event.
         *
         * @type number
         */
        this.touchStartX = 0;


        /**
         * Y-coordinate of touch start event.
         *
         * @type number
         */
        this.touchStartY = 0;


        /**
         * ID of the last touch, retrieved from Touch.identifier.
         *
         * @type number
         */
        this.lastTouchIdentifier = 0;


        /**
         * Touchmove boundary, beyond which a click will be cancelled.
         *
         * @type number
         */
        this.touchBoundary = options.touchBoundary || 10;


        /**
         * The FastClick layer.
         *
         * @type Element
         */
        this.layer = layer;

        /**
         * The minimum time between tap(touchstart and touchend) events
         *
         * @type number
         */
        this.tapDelay = options.tapDelay || 200;

        /**
         * The maximum time for a tap
         *
         * @type number
         */
        this.tapTimeout = options.tapTimeout || 700;

        if (FastClick.notNeeded(layer)) {
            return;
        }

        // Some old versions of Android don't have Function.prototype.bind
        function bind(method, context) {
            return function() { return method.apply(context, arguments); };
        }


        var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
        var context = this;
        for (var i = 0, l = methods.length; i < l; i++) {
            context[methods[i]] = bind(context[methods[i]], context);
        }

        // Set up event handlers as required
        if (deviceIsAndroid) {
            layer.addEventListener('mouseover', this.onMouse, true);
            layer.addEventListener('mousedown', this.onMouse, true);
            layer.addEventListener('mouseup', this.onMouse, true);
        }

        layer.addEventListener('click', this.onClick, true);
        layer.addEventListener('touchstart', this.onTouchStart, false);
        layer.addEventListener('touchmove', this.onTouchMove, false);
        layer.addEventListener('touchend', this.onTouchEnd, false);
        layer.addEventListener('touchcancel', this.onTouchCancel, false);

        // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
        // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
        // layer when they are cancelled.
        if (!Event.prototype.stopImmediatePropagation) {
            layer.removeEventListener = function(type, callback, capture) {
                var rmv = Node.prototype.removeEventListener;
                if (type === 'click') {
                    rmv.call(layer, type, callback.hijacked || callback, capture);
                } else {
                    rmv.call(layer, type, callback, capture);
                }
            };

            layer.addEventListener = function(type, callback, capture) {
                var adv = Node.prototype.addEventListener;
                if (type === 'click') {
                    adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
                        if (!event.propagationStopped) {
                            callback(event);
                        }
                    }), capture);
                } else {
                    adv.call(layer, type, callback, capture);
                }
            };
        }

        // If a handler is already declared in the element's onclick attribute, it will be fired before
        // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
        // adding it as listener.
        if (typeof layer.onclick === 'function') {

            // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
            // - the old one won't work if passed to addEventListener directly.
            oldOnClick = layer.onclick;
            layer.addEventListener('click', function(event) {
                oldOnClick(event);
            }, false);
            layer.onclick = null;
        }
    }

    /**
     * Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
     *
     * @type boolean
     */
    var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

    /**
     * Android requires exceptions.
     *
     * @type boolean
     */
    var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


    /**
     * iOS requires exceptions.
     *
     * @type boolean
     */
    var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


    /**
     * iOS 4 requires an exception for select elements.
     *
     * @type boolean
     */
    var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


    /**
     * iOS 6.0-7.* requires the target element to be manually derived
     *
     * @type boolean
     */
    var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

    /**
     * BlackBerry requires exceptions.
     *
     * @type boolean
     */
    var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

    /**
     * 判断是否组合型label
     * @type {Boolean}
     */
    var isCompositeLabel = false;

    /**
     * Determine whether a given element requires a native click.
     *
     * @param {EventTarget|Element} target Target DOM element
     * @returns {boolean} Returns true if the element needs a native click
     */
    FastClick.prototype.needsClick = function(target) {

        // 修复bug: 如果父元素中有 label
        // 如果label上有needsclick这个类，则用原生的点击，否则，用模拟点击
        var parent = target;
        while(parent && (parent.tagName.toUpperCase() !== "BODY")) {
            if (parent.tagName.toUpperCase() === "LABEL") {
                isCompositeLabel = true;
                if ((/\bneedsclick\b/).test(parent.className)) return true;
            }
            parent = parent.parentNode;
        }

        switch (target.nodeName.toLowerCase()) {

            // Don't send a synthetic click to disabled inputs (issue #62)
            case 'button':
            case 'select':
            case 'textarea':
                if (target.disabled) {
                    return true;
                }

                break;
            case 'input':

                // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
                if ((deviceIsIOS && target.type === 'file') || target.disabled) {
                    return true;
                }

                break;
            case 'label':
            case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
            case 'video':
                return true;
        }

        return (/\bneedsclick\b/).test(target.className);
    };


    /**
     * Determine whether a given element requires a call to focus to simulate click into element.
     *
     * @param {EventTarget|Element} target Target DOM element
     * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
     */
    FastClick.prototype.needsFocus = function(target) {
        switch (target.nodeName.toLowerCase()) {
            case 'textarea':
                return true;
            case 'select':
                return !deviceIsAndroid;
            case 'input':
                switch (target.type) {
                    case 'button':
                    case 'checkbox':
                    case 'file':
                    case 'image':
                    case 'radio':
                    case 'submit':
                        return false;
                }

                // No point in attempting to focus disabled inputs
                return !target.disabled && !target.readOnly;
            default:
                return (/\bneedsfocus\b/).test(target.className);
        }
    };


    /**
     * Send a click event to the specified element.
     *
     * @param {EventTarget|Element} targetElement
     * @param {Event} event
     */
    FastClick.prototype.sendClick = function(targetElement, event) {
        var clickEvent, touch;

        // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
        if (document.activeElement && document.activeElement !== targetElement) {
            document.activeElement.blur();
        }

        touch = event.changedTouches[0];

        // Synthesise a click event, with an extra attribute so it can be tracked
        clickEvent = document.createEvent('MouseEvents');
        clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
        clickEvent.forwardedTouchEvent = true;
        targetElement.dispatchEvent(clickEvent);
    };

    FastClick.prototype.determineEventType = function(targetElement) {

        //Issue #159: Android Chrome Select Box does not open with a synthetic click event
        if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
            return 'mousedown';
        }

        return 'click';
    };


    /**
     * @param {EventTarget|Element} targetElement
     */
    FastClick.prototype.focus = function(targetElement) {
        var length;

        // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
        var unsupportedType = ['date', 'time', 'month', 'number', 'email'];
        if (deviceIsIOS && targetElement.setSelectionRange && unsupportedType.indexOf(targetElement.type) === -1) {
            length = targetElement.value.length;
            targetElement.setSelectionRange(length, length);
        } else {
            targetElement.focus();
        }
    };


    /**
     * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
     *
     * @param {EventTarget|Element} targetElement
     */
    FastClick.prototype.updateScrollParent = function(targetElement) {
        var scrollParent, parentElement;

        scrollParent = targetElement.fastClickScrollParent;

        // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
        // target element was moved to another parent.
        if (!scrollParent || !scrollParent.contains(targetElement)) {
            parentElement = targetElement;
            do {
                if (parentElement.scrollHeight > parentElement.offsetHeight) {
                    scrollParent = parentElement;
                    targetElement.fastClickScrollParent = parentElement;
                    break;
                }

                parentElement = parentElement.parentElement;
            } while (parentElement);
        }

        // Always update the scroll top tracker if possible.
        if (scrollParent) {
            scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
        }
    };


    /**
     * @param {EventTarget} targetElement
     * @returns {Element|EventTarget}
     */
    FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

        // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
        if (eventTarget.nodeType === Node.TEXT_NODE) {
            return eventTarget.parentNode;
        }

        return eventTarget;
    };


    /**
     * On touch start, record the position and scroll offset.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchStart = function(event) {
        var targetElement, touch, selection;

        // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
        if (event.targetTouches.length > 1) {
            return true;
        }

        targetElement = this.getTargetElementFromEventTarget(event.target);
        touch = event.targetTouches[0];

        if (deviceIsIOS) {

            // Only trusted events will deselect text on iOS (issue #49)
            selection = window.getSelection();
            if (selection.rangeCount && !selection.isCollapsed) {
                return true;
            }

            if (!deviceIsIOS4) {

                // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
                // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
                // with the same identifier as the touch event that previously triggered the click that triggered the alert.
                // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
                // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
                // Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
                // which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
                // random integers, it's safe to to continue if the identifier is 0 here.
                if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
                    event.preventDefault();
                    return false;
                }

                this.lastTouchIdentifier = touch.identifier;

                // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
                // 1) the user does a fling scroll on the scrollable layer
                // 2) the user stops the fling scroll with another tap
                // then the event.target of the last 'touchend' event will be the element that was under the user's finger
                // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
                // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
                this.updateScrollParent(targetElement);
            }
        }

        this.trackingClick = true;
        this.trackingClickStart = event.timeStamp;
        this.targetElement = targetElement;

        this.touchStartX = touch.pageX;
        this.touchStartY = touch.pageY;

        // Prevent phantom clicks on fast double-tap (issue #36)
        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
            event.preventDefault();
        }

        return true;
    };


    /**
     * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.touchHasMoved = function(event) {
        var touch = event.changedTouches[0], boundary = this.touchBoundary;

        if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
            return true;
        }

        return false;
    };


    /**
     * Update the last position.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchMove = function(event) {
        if (!this.trackingClick) {
            return true;
        }

        // If the touch has moved, cancel the click tracking
        if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
            this.trackingClick = false;
            this.targetElement = null;
        }

        return true;
    };


    /**
     * Attempt to find the labelled control for the given label element.
     *
     * @param {EventTarget|HTMLLabelElement} labelElement
     * @returns {Element|null}
     */
    FastClick.prototype.findControl = function(labelElement) {

        // Fast path for newer browsers supporting the HTML5 control attribute
        if (labelElement.control !== undefined) {
            return labelElement.control;
        }

        // All browsers under test that support touch events also support the HTML5 htmlFor attribute
        if (labelElement.htmlFor) {
            return document.getElementById(labelElement.htmlFor);
        }

        // If no for attribute exists, attempt to retrieve the first labellable descendant element
        // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
        return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
    };


    /**
     * On touch end, determine whether to send a click event at once.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchEnd = function(event) {
        var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

        if (!this.trackingClick) {
            return true;
        }

        // Prevent phantom clicks on fast double-tap (issue #36)
        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
            this.cancelNextClick = true;
            return true;
        }

        if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
            return true;
        }
        //修复安卓微信下，input type="date" 的bug，经测试date,time,month已没问题
        var unsupportedType = ['date', 'time', 'month'];
        if(unsupportedType.indexOf(event.target.type) !== -1){
            　　　　return false;
            　　}
        // Reset to prevent wrong click cancel on input (issue #156).
        this.cancelNextClick = false;

        this.lastClickTime = event.timeStamp;

        trackingClickStart = this.trackingClickStart;
        this.trackingClick = false;
        this.trackingClickStart = 0;

        // On some iOS devices, the targetElement supplied with the event is invalid if the layer
        // is performing a transition or scroll, and has to be re-detected manually. Note that
        // for this to function correctly, it must be called *after* the event target is checked!
        // See issue #57; also filed as rdar://13048589 .
        if (deviceIsIOSWithBadTarget) {
            touch = event.changedTouches[0];

            // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
            targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
            targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
        }

        targetTagName = targetElement.tagName.toLowerCase();
        if (targetTagName === 'label') {
            forElement = this.findControl(targetElement);
            if (forElement) {
                this.focus(targetElement);
                if (deviceIsAndroid) {
                    return false;
                }

                targetElement = forElement;
            }
        } else if (this.needsFocus(targetElement)) {

            // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
            // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
            if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
                this.targetElement = null;
                return false;
            }

            this.focus(targetElement);
            this.sendClick(targetElement, event);

            // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
            // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
            if (!deviceIsIOS || targetTagName !== 'select') {
                this.targetElement = null;
                event.preventDefault();
            }

            return false;
        }

        if (deviceIsIOS && !deviceIsIOS4) {

            // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
            // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
            scrollParent = targetElement.fastClickScrollParent;
            if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
                return true;
            }
        }

        // Prevent the actual click from going though - unless the target node is marked as requiring
        // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
        if (!this.needsClick(targetElement)) {
            event.preventDefault();
            this.sendClick(targetElement, event);
        }

        return false;
    };


    /**
     * On touch cancel, stop tracking the click.
     *
     * @returns {void}
     */
    FastClick.prototype.onTouchCancel = function() {
        this.trackingClick = false;
        this.targetElement = null;
    };


    /**
     * Determine mouse events which should be permitted.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onMouse = function(event) {

        // If a target element was never set (because a touch event was never fired) allow the event
        if (!this.targetElement) {
            return true;
        }

        if (event.forwardedTouchEvent) {
            return true;
        }

        // Programmatically generated events targeting a specific element should be permitted
        if (!event.cancelable) {
            return true;
        }

        // Derive and check the target element to see whether the mouse event needs to be permitted;
        // unless explicitly enabled, prevent non-touch click events from triggering actions,
        // to prevent ghost/doubleclicks.
        if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

            // Prevent any user-added listeners declared on FastClick element from being fired.
            if (event.stopImmediatePropagation) {
                event.stopImmediatePropagation();
            } else {

                // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
                event.propagationStopped = true;
            }

            // Cancel the event
            event.stopPropagation();
            // 允许组合型label冒泡
            if (!isCompositeLabel) {
                event.preventDefault();
            }
            // 允许组合型label冒泡
            return false;
        }

        // If the mouse event is permitted, return true for the action to go through.
        return true;
    };


    /**
     * On actual clicks, determine whether this is a touch-generated click, a click action occurring
     * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
     * an actual click which should be permitted.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onClick = function(event) {
        var permitted;

        // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
        if (this.trackingClick) {
            this.targetElement = null;
            this.trackingClick = false;
            return true;
        }

        // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
        if (event.target.type === 'submit' && event.detail === 0) {
            return true;
        }

        permitted = this.onMouse(event);

        // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
        if (!permitted) {
            this.targetElement = null;
        }

        // If clicks are permitted, return true for the action to go through.
        return permitted;
    };


    /**
     * Remove all FastClick's event listeners.
     *
     * @returns {void}
     */
    FastClick.prototype.destroy = function() {
        var layer = this.layer;

        if (deviceIsAndroid) {
            layer.removeEventListener('mouseover', this.onMouse, true);
            layer.removeEventListener('mousedown', this.onMouse, true);
            layer.removeEventListener('mouseup', this.onMouse, true);
        }

        layer.removeEventListener('click', this.onClick, true);
        layer.removeEventListener('touchstart', this.onTouchStart, false);
        layer.removeEventListener('touchmove', this.onTouchMove, false);
        layer.removeEventListener('touchend', this.onTouchEnd, false);
        layer.removeEventListener('touchcancel', this.onTouchCancel, false);
    };


    /**
     * Check whether FastClick is needed.
     *
     * @param {Element} layer The layer to listen on
     */
    FastClick.notNeeded = function(layer) {
        var metaViewport;
        var chromeVersion;
        var blackberryVersion;
        var firefoxVersion;

        // Devices that don't support touch don't need FastClick
        if (typeof window.ontouchstart === 'undefined') {
            return true;
        }

        // Chrome version - zero for other browsers
        chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

        if (chromeVersion) {

            if (deviceIsAndroid) {
                metaViewport = document.querySelector('meta[name=viewport]');

                if (metaViewport) {
                    // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
                    if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                        return true;
                    }
                    // Chrome 32 and above with width=device-width or less don't need FastClick
                    if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
                        return true;
                    }
                }

                // Chrome desktop doesn't need FastClick (issue #15)
            } else {
                return true;
            }
        }

        if (deviceIsBlackBerry10) {
            blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

            // BlackBerry 10.3+ does not require Fastclick library.
            // https://github.com/ftlabs/fastclick/issues/251
            if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
                metaViewport = document.querySelector('meta[name=viewport]');

                if (metaViewport) {
                    // user-scalable=no eliminates click delay.
                    if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                        return true;
                    }
                    // width=device-width (or less than device-width) eliminates click delay.
                    if (document.documentElement.scrollWidth <= window.outerWidth) {
                        return true;
                    }
                }
            }
        }

        // IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
        if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
            return true;
        }

        // Firefox version - zero for other browsers
        firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

        if (firefoxVersion >= 27) {
            // Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

            metaViewport = document.querySelector('meta[name=viewport]');
            if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
                return true;
            }
        }

        // IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
        // http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
        if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
            return true;
        }

        return false;
    };


    /**
     * Factory method for creating a FastClick object
     *
     * @param {Element} layer The layer to listen on
     * @param {Object} [options={}] The options to override the defaults
     */
    FastClick.attach = function(layer, options) {
        return new FastClick(layer, options);
    };

    window.FastClick = FastClick;
}());

/*===========================
Swiper
===========================*/
/* global WebKitCSSMatrix:true */
/* global Modernizr:true */
/* global DocumentTouch:true */
+function($){
    "use strict";
    var Swiper = function (container, params) {
        // if (!(this instanceof Swiper)) return new Swiper(container, params);
        var defaults = this.defaults;
        var initalVirtualTranslate = params && params.virtualTranslate;

        params = params || {};
        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
            else if (typeof params[def] === 'object') {
                for (var deepDef in defaults[def]) {
                    if (typeof params[def][deepDef] === 'undefined') {
                        params[def][deepDef] = defaults[def][deepDef];
                    }
                }
            }
        }

        // Swiper
        var s = this;

        // Params
        s.params = params;

        // Classname
        s.classNames = [];

        // Export it to Swiper instance
        s.$ = $;
        /*=========================
          Preparation - Define Container, Wrapper and Pagination
          ===========================*/
        s.container = $(container);
        if (s.container.length === 0) return;
        if (s.container.length > 1) {
            s.container.each(function () {
                new $.Swiper(this, params);
            });
            return;
        }

        // Save instance in container HTML Element and in data
        s.container[0].swiper = s;
        s.container.data('swiper', s);

        s.classNames.push('swiper-container-' + s.params.direction);

        if (s.params.freeMode) {
            s.classNames.push('swiper-container-free-mode');
        }
        if (!s.support.flexbox) {
            s.classNames.push('swiper-container-no-flexbox');
            s.params.slidesPerColumn = 1;
        }
        // Enable slides progress when required
        if (s.params.parallax || s.params.watchSlidesVisibility) {
            s.params.watchSlidesProgress = true;
        }
        // Coverflow / 3D
        if (['cube', 'coverflow'].indexOf(s.params.effect) >= 0) {
            if (s.support.transforms3d) {
                s.params.watchSlidesProgress = true;
                s.classNames.push('swiper-container-3d');
            }
            else {
                s.params.effect = 'slide';
            }
        }
        if (s.params.effect !== 'slide') {
            s.classNames.push('swiper-container-' + s.params.effect);
        }
        if (s.params.effect === 'cube') {
            s.params.resistanceRatio = 0;
            s.params.slidesPerView = 1;
            s.params.slidesPerColumn = 1;
            s.params.slidesPerGroup = 1;
            s.params.centeredSlides = false;
            s.params.spaceBetween = 0;
            s.params.virtualTranslate = true;
            s.params.setWrapperSize = false;
        }
        if (s.params.effect === 'fade') {
            s.params.slidesPerView = 1;
            s.params.slidesPerColumn = 1;
            s.params.slidesPerGroup = 1;
            s.params.watchSlidesProgress = true;
            s.params.spaceBetween = 0;
            if (typeof initalVirtualTranslate === 'undefined') {
                s.params.virtualTranslate = true;
            }
        }

        // Grab Cursor
        if (s.params.grabCursor && s.support.touch) {
            s.params.grabCursor = false;
        }

        // Wrapper
        s.wrapper = s.container.children('.' + s.params.wrapperClass);

        // Pagination
        if (s.params.pagination) {
            s.paginationContainer = $(s.params.pagination);
            if (s.params.paginationClickable) {
                s.paginationContainer.addClass('swiper-pagination-clickable');
            }
        }

        // Is Horizontal
        function isH() {
            return s.params.direction === 'horizontal';
        }

        // RTL
        s.rtl = isH() && (s.container[0].dir.toLowerCase() === 'rtl' || s.container.css('direction') === 'rtl');
        if (s.rtl) {
            s.classNames.push('swiper-container-rtl');
        }

        // Wrong RTL support
        if (s.rtl) {
            s.wrongRTL = s.wrapper.css('display') === '-webkit-box';
        }

        // Columns
        if (s.params.slidesPerColumn > 1) {
            s.classNames.push('swiper-container-multirow');
        }

        // Check for Android
        if (s.device.android) {
            s.classNames.push('swiper-container-android');
        }

        // Add classes
        s.container.addClass(s.classNames.join(' '));

        // Translate
        s.translate = 0;

        // Progress
        s.progress = 0;

        // Velocity
        s.velocity = 0;

        // Locks, unlocks
        s.lockSwipeToNext = function () {
            s.params.allowSwipeToNext = false;
        };
        s.lockSwipeToPrev = function () {
            s.params.allowSwipeToPrev = false;
        };
        s.lockSwipes = function () {
            s.params.allowSwipeToNext = s.params.allowSwipeToPrev = false;
        };
        s.unlockSwipeToNext = function () {
            s.params.allowSwipeToNext = true;
        };
        s.unlockSwipeToPrev = function () {
            s.params.allowSwipeToPrev = true;
        };
        s.unlockSwipes = function () {
            s.params.allowSwipeToNext = s.params.allowSwipeToPrev = true;
        };


        /*=========================
          Set grab cursor
          ===========================*/
        if (s.params.grabCursor) {
            s.container[0].style.cursor = 'move';
            s.container[0].style.cursor = '-webkit-grab';
            s.container[0].style.cursor = '-moz-grab';
            s.container[0].style.cursor = 'grab';
        }
        /*=========================
          Update on Images Ready
          ===========================*/
        s.imagesToLoad = [];
        s.imagesLoaded = 0;

        s.loadImage = function (imgElement, src, checkForComplete, callback) {
            var image;
            function onReady () {
                if (callback) callback();
            }
            if (!imgElement.complete || !checkForComplete) {
                if (src) {
                    image = new Image();
                    image.onload = onReady;
                    image.onerror = onReady;
                    image.src = src;
                } else {
                    onReady();
                }

            } else {//image already loaded...
                onReady();
            }
        };
        s.preloadImages = function () {
            s.imagesToLoad = s.container.find('img');
            function _onReady() {
                if (typeof s === 'undefined' || s === null) return;
                if (s.imagesLoaded !== undefined) s.imagesLoaded++;
                if (s.imagesLoaded === s.imagesToLoad.length) {
                    if (s.params.updateOnImagesReady) s.update();
                    s.emit('onImagesReady', s);
                }
            }
            for (var i = 0; i < s.imagesToLoad.length; i++) {
                s.loadImage(s.imagesToLoad[i], (s.imagesToLoad[i].currentSrc || s.imagesToLoad[i].getAttribute('src')), true, _onReady);
            }
        };

        /*=========================
          Autoplay
          ===========================*/
        s.autoplayTimeoutId = undefined;
        s.autoplaying = false;
        s.autoplayPaused = false;
        function autoplay() {
            s.autoplayTimeoutId = setTimeout(function () {
                if (s.params.loop) {
                    s.fixLoop();
                    s._slideNext();
                }
                else {
                    if (!s.isEnd) {
                        s._slideNext();
                    }
                    else {
                        if (!params.autoplayStopOnLast) {
                            s._slideTo(0);
                        }
                        else {
                            s.stopAutoplay();
                        }
                    }
                }
            }, s.params.autoplay);
        }
        s.startAutoplay = function () {
            if (typeof s.autoplayTimeoutId !== 'undefined') return false;
            if (!s.params.autoplay) return false;
            if (s.autoplaying) return false;
            s.autoplaying = true;
            s.emit('onAutoplayStart', s);
            autoplay();
        };
        s.stopAutoplay = function () {
            if (!s.autoplayTimeoutId) return;
            if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
            s.autoplaying = false;
            s.autoplayTimeoutId = undefined;
            s.emit('onAutoplayStop', s);
        };
        s.pauseAutoplay = function (speed) {
            if (s.autoplayPaused) return;
            if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
            s.autoplayPaused = true;
            if (speed === 0) {
                s.autoplayPaused = false;
                autoplay();
            }
            else {
                s.wrapper.transitionEnd(function () {
                    s.autoplayPaused = false;
                    if (!s.autoplaying) {
                        s.stopAutoplay();
                    }
                    else {
                        autoplay();
                    }
                });
            }
        };
        /*=========================
          Min/Max Translate
          ===========================*/
        s.minTranslate = function () {
            return (-s.snapGrid[0]);
        };
        s.maxTranslate = function () {
            return (-s.snapGrid[s.snapGrid.length - 1]);
        };
        /*=========================
          Slider/slides sizes
          ===========================*/
        s.updateContainerSize = function () {
            s.width = s.container[0].clientWidth;
            s.height = s.container[0].clientHeight;
            s.size = isH() ? s.width : s.height;
        };

        s.updateSlidesSize = function () {
            s.slides = s.wrapper.children('.' + s.params.slideClass);
            s.snapGrid = [];
            s.slidesGrid = [];
            s.slidesSizesGrid = [];

            var spaceBetween = s.params.spaceBetween,
                slidePosition = 0,
                i,
                prevSlideSize = 0,
                index = 0;
            if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
                spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * s.size;
            }

            s.virtualSize = -spaceBetween;
            // reset margins
            if (s.rtl) s.slides.css({marginLeft: '', marginTop: ''});
            else s.slides.css({marginRight: '', marginBottom: ''});

            var slidesNumberEvenToRows;
            if (s.params.slidesPerColumn > 1) {
                if (Math.floor(s.slides.length / s.params.slidesPerColumn) === s.slides.length / s.params.slidesPerColumn) {
                    slidesNumberEvenToRows = s.slides.length;
                }
                else {
                    slidesNumberEvenToRows = Math.ceil(s.slides.length / s.params.slidesPerColumn) * s.params.slidesPerColumn;
                }
            }

            // Calc slides
            var slideSize;
            for (i = 0; i < s.slides.length; i++) {
                slideSize = 0;
                var slide = s.slides.eq(i);
                if (s.params.slidesPerColumn > 1) {
                    // Set slides order
                    var newSlideOrderIndex;
                    var column, row;
                    var slidesPerColumn = s.params.slidesPerColumn;
                    var slidesPerRow;
                    if (s.params.slidesPerColumnFill === 'column') {
                        column = Math.floor(i / slidesPerColumn);
                        row = i - column * slidesPerColumn;
                        newSlideOrderIndex = column + row * slidesNumberEvenToRows / slidesPerColumn;
                        slide
                            .css({
                                '-webkit-box-ordinal-group': newSlideOrderIndex,
                                '-moz-box-ordinal-group': newSlideOrderIndex,
                                '-ms-flex-order': newSlideOrderIndex,
                                '-webkit-order': newSlideOrderIndex,
                                'order': newSlideOrderIndex
                            });
                    }
                    else {
                        slidesPerRow = slidesNumberEvenToRows / slidesPerColumn;
                        row = Math.floor(i / slidesPerRow);
                        column = i - row * slidesPerRow;

                    }
                    slide
                        .css({
                            'margin-top': (row !== 0 && s.params.spaceBetween) && (s.params.spaceBetween + 'px')
                        })
                        .attr('data-swiper-column', column)
                        .attr('data-swiper-row', row);

                }
                if (slide.css('display') === 'none') continue;
                if (s.params.slidesPerView === 'auto') {
                    slideSize = isH() ? slide.outerWidth(true) : slide.outerHeight(true);
                }
                else {
                    slideSize = (s.size - (s.params.slidesPerView - 1) * spaceBetween) / s.params.slidesPerView;
                    if (isH()) {
                        s.slides[i].style.width = slideSize + 'px';
                    }
                    else {
                        s.slides[i].style.height = slideSize + 'px';
                    }
                }
                s.slides[i].swiperSlideSize = slideSize;
                s.slidesSizesGrid.push(slideSize);


                if (s.params.centeredSlides) {
                    slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                    if (i === 0) slidePosition = slidePosition - s.size / 2 - spaceBetween;
                    if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
                    if ((index) % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
                    s.slidesGrid.push(slidePosition);
                }
                else {
                    if ((index) % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
                    s.slidesGrid.push(slidePosition);
                    slidePosition = slidePosition + slideSize + spaceBetween;
                }

                s.virtualSize += slideSize + spaceBetween;

                prevSlideSize = slideSize;

                index ++;
            }
            s.virtualSize = Math.max(s.virtualSize, s.size);

            var newSlidesGrid;

            if (
                s.rtl && s.wrongRTL && (s.params.effect === 'slide' || s.params.effect === 'coverflow')) {
                s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
            }
            if (!s.support.flexbox || s.params.setWrapperSize) {
                if (isH()) s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
                else s.wrapper.css({height: s.virtualSize + s.params.spaceBetween + 'px'});
            }

            if (s.params.slidesPerColumn > 1) {
                s.virtualSize = (slideSize + s.params.spaceBetween) * slidesNumberEvenToRows;
                s.virtualSize = Math.ceil(s.virtualSize / s.params.slidesPerColumn) - s.params.spaceBetween;
                s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
                if (s.params.centeredSlides) {
                    newSlidesGrid = [];
                    for (i = 0; i < s.snapGrid.length; i++) {
                        if (s.snapGrid[i] < s.virtualSize + s.snapGrid[0]) newSlidesGrid.push(s.snapGrid[i]);
                    }
                    s.snapGrid = newSlidesGrid;
                }
            }

            // Remove last grid elements depending on width
            if (!s.params.centeredSlides) {
                newSlidesGrid = [];
                for (i = 0; i < s.snapGrid.length; i++) {
                    if (s.snapGrid[i] <= s.virtualSize - s.size) {
                        newSlidesGrid.push(s.snapGrid[i]);
                    }
                }
                s.snapGrid = newSlidesGrid;
                if (Math.floor(s.virtualSize - s.size) > Math.floor(s.snapGrid[s.snapGrid.length - 1])) {
                    s.snapGrid.push(s.virtualSize - s.size);
                }
            }
            if (s.snapGrid.length === 0) s.snapGrid = [0];

            if (s.params.spaceBetween !== 0) {
                if (isH()) {
                    if (s.rtl) s.slides.css({marginLeft: spaceBetween + 'px'});
                    else s.slides.css({marginRight: spaceBetween + 'px'});
                }
                else s.slides.css({marginBottom: spaceBetween + 'px'});
            }
            if (s.params.watchSlidesProgress) {
                s.updateSlidesOffset();
            }
        };
        s.updateSlidesOffset = function () {
            for (var i = 0; i < s.slides.length; i++) {
                s.slides[i].swiperSlideOffset = isH() ? s.slides[i].offsetLeft : s.slides[i].offsetTop;
            }
        };

        /*=========================
          Slider/slides progress
          ===========================*/
        s.updateSlidesProgress = function (translate) {
            if (typeof translate === 'undefined') {
                translate = s.translate || 0;
            }
            if (s.slides.length === 0) return;
            if (typeof s.slides[0].swiperSlideOffset === 'undefined') s.updateSlidesOffset();

            var offsetCenter = s.params.centeredSlides ? -translate + s.size / 2 : -translate;
            if (s.rtl) offsetCenter = s.params.centeredSlides ? translate - s.size / 2 : translate;

            // Visible Slides
            s.slides.removeClass(s.params.slideVisibleClass);
            for (var i = 0; i < s.slides.length; i++) {
                var slide = s.slides[i];
                var slideCenterOffset = (s.params.centeredSlides === true) ? slide.swiperSlideSize / 2 : 0;
                var slideProgress = (offsetCenter - slide.swiperSlideOffset - slideCenterOffset) / (slide.swiperSlideSize + s.params.spaceBetween);
                if (s.params.watchSlidesVisibility) {
                    var slideBefore = -(offsetCenter - slide.swiperSlideOffset - slideCenterOffset);
                    var slideAfter = slideBefore + s.slidesSizesGrid[i];
                    var isVisible =
                        (slideBefore >= 0 && slideBefore < s.size) ||
                        (slideAfter > 0 && slideAfter <= s.size) ||
                        (slideBefore <= 0 && slideAfter >= s.size);
                    if (isVisible) {
                        s.slides.eq(i).addClass(s.params.slideVisibleClass);
                    }
                }
                slide.progress = s.rtl ? -slideProgress : slideProgress;
            }
        };
        s.updateProgress = function (translate) {
            if (typeof translate === 'undefined') {
                translate = s.translate || 0;
            }
            var translatesDiff = s.maxTranslate() - s.minTranslate();
            if (translatesDiff === 0) {
                s.progress = 0;
                s.isBeginning = s.isEnd = true;
            }
            else {
                s.progress = (translate - s.minTranslate()) / (translatesDiff);
                s.isBeginning = s.progress <= 0;
                s.isEnd = s.progress >= 1;
            }
            if (s.isBeginning) s.emit('onReachBeginning', s);
            if (s.isEnd) s.emit('onReachEnd', s);

            if (s.params.watchSlidesProgress) s.updateSlidesProgress(translate);
            s.emit('onProgress', s, s.progress);
        };
        s.updateActiveIndex = function () {
            var translate = s.rtl ? s.translate : -s.translate;
            var newActiveIndex, i, snapIndex;
            for (i = 0; i < s.slidesGrid.length; i ++) {
                if (typeof s.slidesGrid[i + 1] !== 'undefined') {
                    if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1] - (s.slidesGrid[i + 1] - s.slidesGrid[i]) / 2) {
                        newActiveIndex = i;
                    }
                    else if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1]) {
                        newActiveIndex = i + 1;
                    }
                }
                else {
                    if (translate >= s.slidesGrid[i]) {
                        newActiveIndex = i;
                    }
                }
            }
            // Normalize slideIndex
            if (newActiveIndex < 0 || typeof newActiveIndex === 'undefined') newActiveIndex = 0;
            // for (i = 0; i < s.slidesGrid.length; i++) {
                // if (- translate >= s.slidesGrid[i]) {
                    // newActiveIndex = i;
                // }
            // }
            snapIndex = Math.floor(newActiveIndex / s.params.slidesPerGroup);
            if (snapIndex >= s.snapGrid.length) snapIndex = s.snapGrid.length - 1;

            if (newActiveIndex === s.activeIndex) {
                return;
            }
            s.snapIndex = snapIndex;
            s.previousIndex = s.activeIndex;
            s.activeIndex = newActiveIndex;
            s.updateClasses();
        };

        /*=========================
          Classes
          ===========================*/
        s.updateClasses = function () {
            s.slides.removeClass(s.params.slideActiveClass + ' ' + s.params.slideNextClass + ' ' + s.params.slidePrevClass);
            var activeSlide = s.slides.eq(s.activeIndex);
            // Active classes
            activeSlide.addClass(s.params.slideActiveClass);
            activeSlide.next('.' + s.params.slideClass).addClass(s.params.slideNextClass);
            activeSlide.prev('.' + s.params.slideClass).addClass(s.params.slidePrevClass);

            // Pagination
            if (s.bullets && s.bullets.length > 0) {
                s.bullets.removeClass(s.params.bulletActiveClass);
                var bulletIndex;
                if (s.params.loop) {
                    bulletIndex = Math.ceil(s.activeIndex - s.loopedSlides)/s.params.slidesPerGroup;
                    if (bulletIndex > s.slides.length - 1 - s.loopedSlides * 2) {
                        bulletIndex = bulletIndex - (s.slides.length - s.loopedSlides * 2);
                    }
                    if (bulletIndex > s.bullets.length - 1) bulletIndex = bulletIndex - s.bullets.length;
                }
                else {
                    if (typeof s.snapIndex !== 'undefined') {
                        bulletIndex = s.snapIndex;
                    }
                    else {
                        bulletIndex = s.activeIndex || 0;
                    }
                }
                if (s.paginationContainer.length > 1) {
                    s.bullets.each(function () {
                        if ($(this).index() === bulletIndex) $(this).addClass(s.params.bulletActiveClass);
                    });
                }
                else {
                    s.bullets.eq(bulletIndex).addClass(s.params.bulletActiveClass);
                }
            }

            // Next/active buttons
            if (!s.params.loop) {
                if (s.params.prevButton) {
                    if (s.isBeginning) {
                        $(s.params.prevButton).addClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.disable($(s.params.prevButton));
                    }
                    else {
                        $(s.params.prevButton).removeClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.enable($(s.params.prevButton));
                    }
                }
                if (s.params.nextButton) {
                    if (s.isEnd) {
                        $(s.params.nextButton).addClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.disable($(s.params.nextButton));
                    }
                    else {
                        $(s.params.nextButton).removeClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.enable($(s.params.nextButton));
                    }
                }
            }
        };

        /*=========================
          Pagination
          ===========================*/
        s.updatePagination = function () {
            if (!s.params.pagination) return;
            if (s.paginationContainer && s.paginationContainer.length > 0) {
                var bulletsHTML = '';
                var numberOfBullets = s.params.loop ? Math.ceil((s.slides.length - s.loopedSlides * 2) / s.params.slidesPerGroup) : s.snapGrid.length;
                for (var i = 0; i < numberOfBullets; i++) {
                    if (s.params.paginationBulletRender) {
                        bulletsHTML += s.params.paginationBulletRender(i, s.params.bulletClass);
                    }
                    else {
                        bulletsHTML += '<span class="' + s.params.bulletClass + '"></span>';
                    }
                }
                s.paginationContainer.html(bulletsHTML);
                s.bullets = s.paginationContainer.find('.' + s.params.bulletClass);
            }
        };
        /*=========================
          Common update method
          ===========================*/
        s.update = function (updateTranslate) {
            s.updateContainerSize();
            s.updateSlidesSize();
            s.updateProgress();
            s.updatePagination();
            s.updateClasses();
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.set();
            }
            function forceSetTranslate() {
                newTranslate = Math.min(Math.max(s.translate, s.maxTranslate()), s.minTranslate());
                s.setWrapperTranslate(newTranslate);
                s.updateActiveIndex();
                s.updateClasses();
            }
            if (updateTranslate) {
                var translated, newTranslate;
                if (s.params.freeMode) {
                    forceSetTranslate();
                }
                else {
                    if (s.params.slidesPerView === 'auto' && s.isEnd && !s.params.centeredSlides) {
                        translated = s.slideTo(s.slides.length - 1, 0, false, true);
                    }
                    else {
                        translated = s.slideTo(s.activeIndex, 0, false, true);
                    }
                    if (!translated) {
                        forceSetTranslate();
                    }
                }

            }
        };

        /*=========================
          Resize Handler
          ===========================*/
        s.onResize = function () {
            s.updateContainerSize();
            s.updateSlidesSize();
            s.updateProgress();
            if (s.params.slidesPerView === 'auto' || s.params.freeMode) s.updatePagination();
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.set();
            }
            if (s.params.freeMode) {
                var newTranslate = Math.min(Math.max(s.translate, s.maxTranslate()), s.minTranslate());
                s.setWrapperTranslate(newTranslate);
                s.updateActiveIndex();
                s.updateClasses();
            }
            else {
                s.updateClasses();
                if (s.params.slidesPerView === 'auto' && s.isEnd && !s.params.centeredSlides) {
                    s.slideTo(s.slides.length - 1, 0, false, true);
                }
                else {
                    s.slideTo(s.activeIndex, 0, false, true);
                }
            }

        };

        /*=========================
          Events
          ===========================*/

        //Define Touch Events
        var desktopEvents = ['mousedown', 'mousemove', 'mouseup'];
        if (window.navigator.pointerEnabled) desktopEvents = ['pointerdown', 'pointermove', 'pointerup'];
        else if (window.navigator.msPointerEnabled) desktopEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp'];
        s.touchEvents = {
            start : s.support.touch || !s.params.simulateTouch  ? 'touchstart' : desktopEvents[0],
            move : s.support.touch || !s.params.simulateTouch ? 'touchmove' : desktopEvents[1],
            end : s.support.touch || !s.params.simulateTouch ? 'touchend' : desktopEvents[2]
        };


        // WP8 Touch Events Fix
        if (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) {
            (s.params.touchEventsTarget === 'container' ? s.container : s.wrapper).addClass('swiper-wp8-' + s.params.direction);
        }

        // Attach/detach events
        s.initEvents = function (detach) {
            var actionDom = detach ? 'off' : 'on';
            var action = detach ? 'removeEventListener' : 'addEventListener';
            var touchEventsTarget = s.params.touchEventsTarget === 'container' ? s.container[0] : s.wrapper[0];
            var target = s.support.touch ? touchEventsTarget : document;

            var moveCapture = s.params.nested ? true : false;

            //Touch Events
            if (s.browser.ie) {
                touchEventsTarget[action](s.touchEvents.start, s.onTouchStart, false);
                target[action](s.touchEvents.move, s.onTouchMove, moveCapture);
                target[action](s.touchEvents.end, s.onTouchEnd, false);
            }
            else {
                if (s.support.touch) {
                    touchEventsTarget[action](s.touchEvents.start, s.onTouchStart, false);
                    touchEventsTarget[action](s.touchEvents.move, s.onTouchMove, moveCapture);
                    touchEventsTarget[action](s.touchEvents.end, s.onTouchEnd, false);
                }
                if (params.simulateTouch && !s.device.ios && !s.device.android) {
                    touchEventsTarget[action]('mousedown', s.onTouchStart, false);
                    target[action]('mousemove', s.onTouchMove, moveCapture);
                    target[action]('mouseup', s.onTouchEnd, false);
                }
            }
            window[action]('resize', s.onResize);

            // Next, Prev, Index
            if (s.params.nextButton) {
                $(s.params.nextButton)[actionDom]('click', s.onClickNext);
                if (s.params.a11y && s.a11y) $(s.params.nextButton)[actionDom]('keydown', s.a11y.onEnterKey);
            }
            if (s.params.prevButton) {
                $(s.params.prevButton)[actionDom]('click', s.onClickPrev);
                if (s.params.a11y && s.a11y) $(s.params.prevButton)[actionDom]('keydown', s.a11y.onEnterKey);
            }
            if (s.params.pagination && s.params.paginationClickable) {
                $(s.paginationContainer)[actionDom]('click', '.' + s.params.bulletClass, s.onClickIndex);
            }

            // Prevent Links Clicks
            if (s.params.preventClicks || s.params.preventClicksPropagation) touchEventsTarget[action]('click', s.preventClicks, true);
        };
        s.attachEvents = function () {
            s.initEvents();
        };
        s.detachEvents = function () {
            s.initEvents(true);
        };

        /*=========================
          Handle Clicks
          ===========================*/
        // Prevent Clicks
        s.allowClick = true;
        s.preventClicks = function (e) {
            if (!s.allowClick) {
                if (s.params.preventClicks) e.preventDefault();
                if (s.params.preventClicksPropagation) {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }
            }
        };
        // Clicks
        s.onClickNext = function (e) {
            e.preventDefault();
            s.slideNext();
        };
        s.onClickPrev = function (e) {
            e.preventDefault();
            s.slidePrev();
        };
        s.onClickIndex = function (e) {
            e.preventDefault();
            var index = $(this).index() * s.params.slidesPerGroup;
            if (s.params.loop) index = index + s.loopedSlides;
            s.slideTo(index);
        };

        /*=========================
          Handle Touches
          ===========================*/
        function findElementInEvent(e, selector) {
            var el = $(e.target);
            if (!el.is(selector)) {
                if (typeof selector === 'string') {
                    el = el.parents(selector);
                }
                else if (selector.nodeType) {
                    var found;
                    el.parents().each(function (index, _el) {
                        if (_el === selector) found = selector;
                    });
                    if (!found) return undefined;
                    else return selector;
                }
            }
            if (el.length === 0) {
                return undefined;
            }
            return el[0];
        }
        s.updateClickedSlide = function (e) {
            var slide = findElementInEvent(e, '.' + s.params.slideClass);
            if (slide) {
                s.clickedSlide = slide;
                s.clickedIndex = $(slide).index();
            }
            else {
                s.clickedSlide = undefined;
                s.clickedIndex = undefined;
                return;
            }
            if (s.params.slideToClickedSlide && s.clickedIndex !== undefined && s.clickedIndex !== s.activeIndex) {
                var slideToIndex = s.clickedIndex,
                    realIndex;
                if (s.params.loop) {
                    realIndex = $(s.clickedSlide).attr('data-swiper-slide-index');
                    if (slideToIndex > s.slides.length - s.params.slidesPerView) {
                        s.fixLoop();
                        slideToIndex = s.wrapper.children('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]').eq(0).index();
                        setTimeout(function () {
                            s.slideTo(slideToIndex);
                        }, 0);
                    }
                    else if (slideToIndex < s.params.slidesPerView - 1) {
                        s.fixLoop();
                        var duplicatedSlides = s.wrapper.children('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]');
                        slideToIndex = duplicatedSlides.eq(duplicatedSlides.length - 1).index();
                        setTimeout(function () {
                            s.slideTo(slideToIndex);
                        }, 0);
                    }
                    else {
                        s.slideTo(slideToIndex);
                    }
                }
                else {
                    s.slideTo(slideToIndex);
                }
            }
        };

        var isTouched,
            isMoved,
            touchStartTime,
            isScrolling,
            currentTranslate,
            startTranslate,
            allowThresholdMove,
            // Form elements to match
            formElements = 'input, select, textarea, button',
            // Last click time
            lastClickTime = Date.now(), clickTimeout,
            //Velocities
            velocities = [],
            allowMomentumBounce;

        // Animating Flag
        s.animating = false;

        // Touches information
        s.touches = {
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            diff: 0
        };

        // Touch handlers
        var isTouchEvent, startMoving;
        s.onTouchStart = function (e) {
            if (e.originalEvent) e = e.originalEvent;
            isTouchEvent = e.type === 'touchstart';
            if (!isTouchEvent && 'which' in e && e.which === 3) return;
            if (s.params.noSwiping && findElementInEvent(e, '.' + s.params.noSwipingClass)) {
                s.allowClick = true;
                return;
            }
            if (s.params.swipeHandler) {
                if (!findElementInEvent(e, s.params.swipeHandler)) return;
            }
            isTouched = true;
            isMoved = false;
            isScrolling = undefined;
            startMoving = undefined;
            s.touches.startX = s.touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            s.touches.startY = s.touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            touchStartTime = Date.now();
            s.allowClick = true;
            s.updateContainerSize();
            s.swipeDirection = undefined;
            if (s.params.threshold > 0) allowThresholdMove = false;
            if (e.type !== 'touchstart') {
                var preventDefault = true;
                if ($(e.target).is(formElements)) preventDefault = false;
                if (document.activeElement && $(document.activeElement).is(formElements)) {
                    document.activeElement.blur();
                }
                if (preventDefault) {
                    e.preventDefault();
                }
            }
            s.emit('onTouchStart', s, e);
        };

        s.onTouchMove = function (e) {
            if (e.originalEvent) e = e.originalEvent;
            if (isTouchEvent && e.type === 'mousemove') return;
            if (e.preventedByNestedSwiper) return;
            if (s.params.onlyExternal) {
                isMoved = true;
                s.allowClick = false;
                return;
            }
            if (isTouchEvent && document.activeElement) {
                if (e.target === document.activeElement && $(e.target).is(formElements)) {
                    isMoved = true;
                    s.allowClick = false;
                    return;
                }
            }

            s.emit('onTouchMove', s, e);

            if (e.targetTouches && e.targetTouches.length > 1) return;

            s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

            if (typeof isScrolling === 'undefined') {
                var touchAngle = Math.atan2(Math.abs(s.touches.currentY - s.touches.startY), Math.abs(s.touches.currentX - s.touches.startX)) * 180 / Math.PI;
                isScrolling = isH() ? touchAngle > s.params.touchAngle : (90 - touchAngle > s.params.touchAngle);
            }
            if (isScrolling) {
                s.emit('onTouchMoveOpposite', s, e);
            }
            if (typeof startMoving === 'undefined' && s.browser.ieTouch) {
                if (s.touches.currentX !== s.touches.startX || s.touches.currentY !== s.touches.startY) {
                    startMoving = true;
                }
            }
            if (!isTouched) return;
            if (isScrolling)  {
                isTouched = false;
                return;
            }
            if (!startMoving && s.browser.ieTouch) {
                return;
            }
            s.allowClick = false;
            s.emit('onSliderMove', s, e);
            e.preventDefault();
            if (s.params.touchMoveStopPropagation && !s.params.nested) {
                e.stopPropagation();
            }

            if (!isMoved) {
                if (params.loop) {
                    s.fixLoop();
                }
                startTranslate = s.getWrapperTranslate();
                s.setWrapperTransition(0);
                if (s.animating) {
                    s.wrapper.trigger('webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd');
                }
                if (s.params.autoplay && s.autoplaying) {
                    if (s.params.autoplayDisableOnInteraction) {
                        s.stopAutoplay();
                    }
                    else {
                        s.pauseAutoplay();
                    }
                }
                allowMomentumBounce = false;
                //Grab Cursor
                if (s.params.grabCursor) {
                    s.container[0].style.cursor = 'move';
                    s.container[0].style.cursor = '-webkit-grabbing';
                    s.container[0].style.cursor = '-moz-grabbin';
                    s.container[0].style.cursor = 'grabbing';
                }
            }
            isMoved = true;

            var diff = s.touches.diff = isH() ? s.touches.currentX - s.touches.startX : s.touches.currentY - s.touches.startY;

            diff = diff * s.params.touchRatio;
            if (s.rtl) diff = -diff;

            s.swipeDirection = diff > 0 ? 'prev' : 'next';
            currentTranslate = diff + startTranslate;

            var disableParentSwiper = true;
            if ((diff > 0 && currentTranslate > s.minTranslate())) {
                disableParentSwiper = false;
                if (s.params.resistance) currentTranslate = s.minTranslate() - 1 + Math.pow(-s.minTranslate() + startTranslate + diff, s.params.resistanceRatio);
            }
            else if (diff < 0 && currentTranslate < s.maxTranslate()) {
                disableParentSwiper = false;
                if (s.params.resistance) currentTranslate = s.maxTranslate() + 1 - Math.pow(s.maxTranslate() - startTranslate - diff, s.params.resistanceRatio);
            }

            if (disableParentSwiper) {
                e.preventedByNestedSwiper = true;
            }

            // Directions locks
            if (!s.params.allowSwipeToNext && s.swipeDirection === 'next' && currentTranslate < startTranslate) {
                currentTranslate = startTranslate;
            }
            if (!s.params.allowSwipeToPrev && s.swipeDirection === 'prev' && currentTranslate > startTranslate) {
                currentTranslate = startTranslate;
            }

            if (!s.params.followFinger) return;

            // Threshold
            if (s.params.threshold > 0) {
                if (Math.abs(diff) > s.params.threshold || allowThresholdMove) {
                    if (!allowThresholdMove) {
                        allowThresholdMove = true;
                        s.touches.startX = s.touches.currentX;
                        s.touches.startY = s.touches.currentY;
                        currentTranslate = startTranslate;
                        s.touches.diff = isH() ? s.touches.currentX - s.touches.startX : s.touches.currentY - s.touches.startY;
                        return;
                    }
                }
                else {
                    currentTranslate = startTranslate;
                    return;
                }
            }
            // Update active index in free mode
            if (s.params.freeMode || s.params.watchSlidesProgress) {
                s.updateActiveIndex();
            }
            if (s.params.freeMode) {
                //Velocity
                if (velocities.length === 0) {
                    velocities.push({
                        position: s.touches[isH() ? 'startX' : 'startY'],
                        time: touchStartTime
                    });
                }
                velocities.push({
                    position: s.touches[isH() ? 'currentX' : 'currentY'],
                    time: (new Date()).getTime()
                });
            }
            // Update progress
            s.updateProgress(currentTranslate);
            // Update translate
            s.setWrapperTranslate(currentTranslate);
        };
        s.onTouchEnd = function (e) {
            if (e.originalEvent) e = e.originalEvent;
            s.emit('onTouchEnd', s, e);
            if (!isTouched) return;
            //Return Grab Cursor
            if (s.params.grabCursor && isMoved && isTouched) {
                s.container[0].style.cursor = 'move';
                s.container[0].style.cursor = '-webkit-grab';
                s.container[0].style.cursor = '-moz-grab';
                s.container[0].style.cursor = 'grab';
            }

            // Time diff
            var touchEndTime = Date.now();
            var timeDiff = touchEndTime - touchStartTime;

            // Tap, doubleTap, Click
            if (s.allowClick) {
                s.updateClickedSlide(e);
                s.emit('onTap', s, e);
                if (timeDiff < 300 && (touchEndTime - lastClickTime) > 300) {
                    if (clickTimeout) clearTimeout(clickTimeout);
                    clickTimeout = setTimeout(function () {
                        if (!s) return;
                        if (s.params.paginationHide && s.paginationContainer.length > 0 && !$(e.target).hasClass(s.params.bulletClass)) {
                            s.paginationContainer.toggleClass(s.params.paginationHiddenClass);
                        }
                        s.emit('onClick', s, e);
                    }, 300);

                }
                if (timeDiff < 300 && (touchEndTime - lastClickTime) < 300) {
                    if (clickTimeout) clearTimeout(clickTimeout);
                    s.emit('onDoubleTap', s, e);
                }
            }

            lastClickTime = Date.now();
            setTimeout(function () {
                if (s && s.allowClick) s.allowClick = true;
            }, 0);

            if (!isTouched || !isMoved || !s.swipeDirection || s.touches.diff === 0 || currentTranslate === startTranslate) {
                isTouched = isMoved = false;
                return;
            }
            isTouched = isMoved = false;

            var currentPos;
            if (s.params.followFinger) {
                currentPos = s.rtl ? s.translate : -s.translate;
            }
            else {
                currentPos = -currentTranslate;
            }
            if (s.params.freeMode) {
                if (currentPos < -s.minTranslate()) {
                    s.slideTo(s.activeIndex);
                    return;
                }
                else if (currentPos > -s.maxTranslate()) {
                    s.slideTo(s.slides.length - 1);
                    return;
                }

                if (s.params.freeModeMomentum) {
                    if (velocities.length > 1) {
                        var lastMoveEvent = velocities.pop(), velocityEvent = velocities.pop();

                        var distance = lastMoveEvent.position - velocityEvent.position;
                        var time = lastMoveEvent.time - velocityEvent.time;
                        s.velocity = distance / time;
                        s.velocity = s.velocity / 2;
                        if (Math.abs(s.velocity) < 0.02) {
                            s.velocity = 0;
                        }
                        // this implies that the user stopped moving a finger then released.
                        // There would be no events with distance zero, so the last event is stale.
                        if (time > 150 || (new Date().getTime() - lastMoveEvent.time) > 300) {
                            s.velocity = 0;
                        }
                    } else {
                        s.velocity = 0;
                    }

                    velocities.length = 0;
                    var momentumDuration = 1000 * s.params.freeModeMomentumRatio;
                    var momentumDistance = s.velocity * momentumDuration;

                    var newPosition = s.translate + momentumDistance;
                    if (s.rtl) newPosition = - newPosition;
                    var doBounce = false;
                    var afterBouncePosition;
                    var bounceAmount = Math.abs(s.velocity) * 20 * s.params.freeModeMomentumBounceRatio;
                    if (newPosition < s.maxTranslate()) {
                        if (s.params.freeModeMomentumBounce) {
                            if (newPosition + s.maxTranslate() < -bounceAmount) {
                                newPosition = s.maxTranslate() - bounceAmount;
                            }
                            afterBouncePosition = s.maxTranslate();
                            doBounce = true;
                            allowMomentumBounce = true;
                        }
                        else {
                            newPosition = s.maxTranslate();
                        }
                    }
                    if (newPosition > s.minTranslate()) {
                        if (s.params.freeModeMomentumBounce) {
                            if (newPosition - s.minTranslate() > bounceAmount) {
                                newPosition = s.minTranslate() + bounceAmount;
                            }
                            afterBouncePosition = s.minTranslate();
                            doBounce = true;
                            allowMomentumBounce = true;
                        }
                        else {
                            newPosition = s.minTranslate();
                        }
                    }
                    //Fix duration
                    if (s.velocity !== 0) {
                        if (s.rtl) {
                            momentumDuration = Math.abs((-newPosition - s.translate) / s.velocity);
                        }
                        else {
                            momentumDuration = Math.abs((newPosition - s.translate) / s.velocity);
                        }
                    }

                    if (s.params.freeModeMomentumBounce && doBounce) {
                        s.updateProgress(afterBouncePosition);
                        s.setWrapperTransition(momentumDuration);
                        s.setWrapperTranslate(newPosition);
                        s.onTransitionStart();
                        s.animating = true;
                        s.wrapper.transitionEnd(function () {
                            if (!allowMomentumBounce) return;
                            s.emit('onMomentumBounce', s);

                            s.setWrapperTransition(s.params.speed);
                            s.setWrapperTranslate(afterBouncePosition);
                            s.wrapper.transitionEnd(function () {
                                s.onTransitionEnd();
                            });
                        });
                    } else if (s.velocity) {
                        s.updateProgress(newPosition);
                        s.setWrapperTransition(momentumDuration);
                        s.setWrapperTranslate(newPosition);
                        s.onTransitionStart();
                        if (!s.animating) {
                            s.animating = true;
                            s.wrapper.transitionEnd(function () {
                                s.onTransitionEnd();
                            });
                        }

                    } else {
                        s.updateProgress(newPosition);
                    }

                    s.updateActiveIndex();
                }
                if (!s.params.freeModeMomentum || timeDiff >= s.params.longSwipesMs) {
                    s.updateProgress();
                    s.updateActiveIndex();
                }
                return;
            }

            // Find current slide
            var i, stopIndex = 0, groupSize = s.slidesSizesGrid[0];
            for (i = 0; i < s.slidesGrid.length; i += s.params.slidesPerGroup) {
                if (typeof s.slidesGrid[i + s.params.slidesPerGroup] !== 'undefined') {
                    if (currentPos >= s.slidesGrid[i] && currentPos < s.slidesGrid[i + s.params.slidesPerGroup]) {
                        stopIndex = i;
                        groupSize = s.slidesGrid[i + s.params.slidesPerGroup] - s.slidesGrid[i];
                    }
                }
                else {
                    if (currentPos >= s.slidesGrid[i]) {
                        stopIndex = i;
                        groupSize = s.slidesGrid[s.slidesGrid.length - 1] - s.slidesGrid[s.slidesGrid.length - 2];
                    }
                }
            }

            // Find current slide size
            var ratio = (currentPos - s.slidesGrid[stopIndex]) / groupSize;

            if (timeDiff > s.params.longSwipesMs) {
                // Long touches
                if (!s.params.longSwipes) {
                    s.slideTo(s.activeIndex);
                    return;
                }
                if (s.swipeDirection === 'next') {
                    if (ratio >= s.params.longSwipesRatio) s.slideTo(stopIndex + s.params.slidesPerGroup);
                    else s.slideTo(stopIndex);

                }
                if (s.swipeDirection === 'prev') {
                    if (ratio > (1 - s.params.longSwipesRatio)) s.slideTo(stopIndex + s.params.slidesPerGroup);
                    else s.slideTo(stopIndex);
                }
            }
            else {
                // Short swipes
                if (!s.params.shortSwipes) {
                    s.slideTo(s.activeIndex);
                    return;
                }
                if (s.swipeDirection === 'next') {
                    s.slideTo(stopIndex + s.params.slidesPerGroup);

                }
                if (s.swipeDirection === 'prev') {
                    s.slideTo(stopIndex);
                }
            }
        };
        /*=========================
          Transitions
          ===========================*/
        s._slideTo = function (slideIndex, speed) {
            return s.slideTo(slideIndex, speed, true, true);
        };
        s.slideTo = function (slideIndex, speed, runCallbacks, internal) {
            if (typeof runCallbacks === 'undefined') runCallbacks = true;
            if (typeof slideIndex === 'undefined') slideIndex = 0;
            if (slideIndex < 0) slideIndex = 0;
            s.snapIndex = Math.floor(slideIndex / s.params.slidesPerGroup);
            if (s.snapIndex >= s.snapGrid.length) s.snapIndex = s.snapGrid.length - 1;

            var translate = - s.snapGrid[s.snapIndex];

            // Stop autoplay

            if (s.params.autoplay && s.autoplaying) {
                if (internal || !s.params.autoplayDisableOnInteraction) {
                    s.pauseAutoplay(speed);
                }
                else {
                    s.stopAutoplay();
                }
            }
            // Update progress
            s.updateProgress(translate);

            // Normalize slideIndex
            for (var i = 0; i < s.slidesGrid.length; i++) {
                if (- translate >= s.slidesGrid[i]) {
                    slideIndex = i;
                }
            }

            if (typeof speed === 'undefined') speed = s.params.speed;
            s.previousIndex = s.activeIndex || 0;
            s.activeIndex = slideIndex;

            if (translate === s.translate) {
                s.updateClasses();
                return false;
            }
            s.onTransitionStart(runCallbacks);
            if (speed === 0) {
                s.setWrapperTransition(0);
                s.setWrapperTranslate(translate);
                s.onTransitionEnd(runCallbacks);
            }
            else {
                s.setWrapperTransition(speed);
                s.setWrapperTranslate(translate);
                if (!s.animating) {
                    s.animating = true;
                    s.wrapper.transitionEnd(function () {
                        s.onTransitionEnd(runCallbacks);
                    });
                }

            }
            s.updateClasses();
            return true;
        };

        s.onTransitionStart = function (runCallbacks) {
            if (typeof runCallbacks === 'undefined') runCallbacks = true;
            if (s.lazy) s.lazy.onTransitionStart();
            if (runCallbacks) {
                s.emit('onTransitionStart', s);
                if (s.activeIndex !== s.previousIndex) {
                    s.emit('onSlideChangeStart', s);
                }
            }
        };
        s.onTransitionEnd = function (runCallbacks) {
            s.animating = false;
            s.setWrapperTransition(0);
            if (typeof runCallbacks === 'undefined') runCallbacks = true;
            if (s.lazy) s.lazy.onTransitionEnd();
            if (runCallbacks) {
                s.emit('onTransitionEnd', s);
                if (s.activeIndex !== s.previousIndex) {
                    s.emit('onSlideChangeEnd', s);
                }
            }
            if (s.params.hashnav && s.hashnav) {
                s.hashnav.setHash();
            }

        };
        s.slideNext = function (runCallbacks, speed, internal) {
            if (s.params.loop) {
                if (s.animating) return false;
                s.fixLoop();
                return s.slideTo(s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal);
            }
            else return s.slideTo(s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal);
        };
        s._slideNext = function (speed) {
            return s.slideNext(true, speed, true);
        };
        s.slidePrev = function (runCallbacks, speed, internal) {
            if (s.params.loop) {
                if (s.animating) return false;
                s.fixLoop();
                return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal);
            }
            else return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal);
        };
        s._slidePrev = function (speed) {
            return s.slidePrev(true, speed, true);
        };
        s.slideReset = function (runCallbacks, speed) {
            return s.slideTo(s.activeIndex, speed, runCallbacks);
        };

        /*=========================
          Translate/transition helpers
          ===========================*/
        s.setWrapperTransition = function (duration, byController) {
            s.wrapper.transition(duration);
            if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
                s.effects[s.params.effect].setTransition(duration);
            }
            if (s.params.parallax && s.parallax) {
                s.parallax.setTransition(duration);
            }
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.setTransition(duration);
            }
            if (s.params.control && s.controller) {
                s.controller.setTransition(duration, byController);
            }
            s.emit('onSetTransition', s, duration);
        };
        s.setWrapperTranslate = function (translate, updateActiveIndex, byController) {
            var x = 0, y = 0, z = 0;
            if (isH()) {
                x = s.rtl ? -translate : translate;
            }
            else {
                y = translate;
            }
            if (!s.params.virtualTranslate) {
                if (s.support.transforms3d) s.wrapper.transform('translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)');
                else s.wrapper.transform('translate(' + x + 'px, ' + y + 'px)');
            }

            s.translate = isH() ? x : y;

            if (updateActiveIndex) s.updateActiveIndex();
            if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
                s.effects[s.params.effect].setTranslate(s.translate);
            }
            if (s.params.parallax && s.parallax) {
                s.parallax.setTranslate(s.translate);
            }
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.setTranslate(s.translate);
            }
            if (s.params.control && s.controller) {
                s.controller.setTranslate(s.translate, byController);
            }
            s.emit('onSetTranslate', s, s.translate);
        };

        s.getTranslate = function (el, axis) {
            var matrix, curTransform, curStyle, transformMatrix;

            // automatic axis detection
            if (typeof axis === 'undefined') {
                axis = 'x';
            }

            if (s.params.virtualTranslate) {
                return s.rtl ? -s.translate : s.translate;
            }

            curStyle = window.getComputedStyle(el, null);
            if (window.WebKitCSSMatrix) {
                // Some old versions of Webkit choke when 'none' is passed; pass
                // empty string instead in this case
                transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
            }
            else {
                transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform  || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
                matrix = transformMatrix.toString().split(',');
            }

            if (axis === 'x') {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix)
                    curTransform = transformMatrix.m41;
                //Crazy IE10 Matrix
                else if (matrix.length === 16)
                    curTransform = parseFloat(matrix[12]);
                //Normal Browsers
                else
                    curTransform = parseFloat(matrix[4]);
            }
            if (axis === 'y') {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix)
                    curTransform = transformMatrix.m42;
                //Crazy IE10 Matrix
                else if (matrix.length === 16)
                    curTransform = parseFloat(matrix[13]);
                //Normal Browsers
                else
                    curTransform = parseFloat(matrix[5]);
            }
            if (s.rtl && curTransform) curTransform = -curTransform;
            return curTransform || 0;
        };
        s.getWrapperTranslate = function (axis) {
            if (typeof axis === 'undefined') {
                axis = isH() ? 'x' : 'y';
            }
            return s.getTranslate(s.wrapper[0], axis);
        };

        /*=========================
          Observer
          ===========================*/
        s.observers = [];
        function initObserver(target, options) {
            options = options || {};
            // create an observer instance
            var ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
            var observer = new ObserverFunc(function (mutations) {
                mutations.forEach(function (mutation) {
                    s.onResize();
                    s.emit('onObserverUpdate', s, mutation);
                });
            });

            observer.observe(target, {
                attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
                childList: typeof options.childList === 'undefined' ? true : options.childList,
                characterData: typeof options.characterData === 'undefined' ? true : options.characterData
            });

            s.observers.push(observer);
        }
        s.initObservers = function () {
            if (s.params.observeParents) {
                var containerParents = s.container.parents();
                for (var i = 0; i < containerParents.length; i++) {
                    initObserver(containerParents[i]);
                }
            }

            // Observe container
            initObserver(s.container[0], {childList: false});

            // Observe wrapper
            initObserver(s.wrapper[0], {attributes: false});
        };
        s.disconnectObservers = function () {
            for (var i = 0; i < s.observers.length; i++) {
                s.observers[i].disconnect();
            }
            s.observers = [];
        };
        /*=========================
          Loop
          ===========================*/
        // Create looped slides
        s.createLoop = function () {
            // Remove duplicated slides
            s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass).remove();

            var slides = s.wrapper.children('.' + s.params.slideClass);
            s.loopedSlides = parseInt(s.params.loopedSlides || s.params.slidesPerView, 10);
            s.loopedSlides = s.loopedSlides + s.params.loopAdditionalSlides;
            if (s.loopedSlides > slides.length) {
                s.loopedSlides = slides.length;
            }

            var prependSlides = [], appendSlides = [], i;
            slides.each(function (index, el) {
                var slide = $(this);
                if (index < s.loopedSlides) appendSlides.push(el);
                if (index < slides.length && index >= slides.length - s.loopedSlides) prependSlides.push(el);
                slide.attr('data-swiper-slide-index', index);
            });
            for (i = 0; i < appendSlides.length; i++) {
                s.wrapper.append($(appendSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass));
            }
            for (i = prependSlides.length - 1; i >= 0; i--) {
                s.wrapper.prepend($(prependSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass));
            }
        };
        s.destroyLoop = function () {
            s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass).remove();
            s.slides.removeAttr('data-swiper-slide-index');
        };
        s.fixLoop = function () {
            var newIndex;
            //Fix For Negative Oversliding
            if (s.activeIndex < s.loopedSlides) {
                newIndex = s.slides.length - s.loopedSlides * 3 + s.activeIndex;
                newIndex = newIndex + s.loopedSlides;
                s.slideTo(newIndex, 0, false, true);
            }
            //Fix For Positive Oversliding
            else if ((s.params.slidesPerView === 'auto' && s.activeIndex >= s.loopedSlides * 2) || (s.activeIndex > s.slides.length - s.params.slidesPerView * 2)) {
                newIndex = -s.slides.length + s.activeIndex + s.loopedSlides;
                newIndex = newIndex + s.loopedSlides;
                s.slideTo(newIndex, 0, false, true);
            }
        };
        /*=========================
          Append/Prepend/Remove Slides
          ===========================*/
        s.appendSlide = function (slides) {
            if (s.params.loop) {
                s.destroyLoop();
            }
            if (typeof slides === 'object' && slides.length) {
                for (var i = 0; i < slides.length; i++) {
                    if (slides[i]) s.wrapper.append(slides[i]);
                }
            }
            else {
                s.wrapper.append(slides);
            }
            if (s.params.loop) {
                s.createLoop();
            }
            if (!(s.params.observer && s.support.observer)) {
                s.update(true);
            }
        };
        s.prependSlide = function (slides) {
            if (s.params.loop) {
                s.destroyLoop();
            }
            var newActiveIndex = s.activeIndex + 1;
            if (typeof slides === 'object' && slides.length) {
                for (var i = 0; i < slides.length; i++) {
                    if (slides[i]) s.wrapper.prepend(slides[i]);
                }
                newActiveIndex = s.activeIndex + slides.length;
            }
            else {
                s.wrapper.prepend(slides);
            }
            if (s.params.loop) {
                s.createLoop();
            }
            if (!(s.params.observer && s.support.observer)) {
                s.update(true);
            }
            s.slideTo(newActiveIndex, 0, false);
        };
        s.removeSlide = function (slidesIndexes) {
            if (s.params.loop) {
                s.destroyLoop();
            }
            var newActiveIndex = s.activeIndex,
                indexToRemove;
            if (typeof slidesIndexes === 'object' && slidesIndexes.length) {
                for (var i = 0; i < slidesIndexes.length; i++) {
                    indexToRemove = slidesIndexes[i];
                    if (s.slides[indexToRemove]) s.slides.eq(indexToRemove).remove();
                    if (indexToRemove < newActiveIndex) newActiveIndex--;
                }
                newActiveIndex = Math.max(newActiveIndex, 0);
            }
            else {
                indexToRemove = slidesIndexes;
                if (s.slides[indexToRemove]) s.slides.eq(indexToRemove).remove();
                if (indexToRemove < newActiveIndex) newActiveIndex--;
                newActiveIndex = Math.max(newActiveIndex, 0);
            }

            if (!(s.params.observer && s.support.observer)) {
                s.update(true);
            }
            s.slideTo(newActiveIndex, 0, false);
        };
        s.removeAllSlides = function () {
            var slidesIndexes = [];
            for (var i = 0; i < s.slides.length; i++) {
                slidesIndexes.push(i);
            }
            s.removeSlide(slidesIndexes);
        };


        /*=========================
          Effects
          ===========================*/
        s.effects = {
            fade: {
                fadeIndex: null,
                setTranslate: function () {
                    for (var i = 0; i < s.slides.length; i++) {
                        var slide = s.slides.eq(i);
                        var offset = slide[0].swiperSlideOffset;
                        var tx = -offset;
                        if (!s.params.virtualTranslate) tx = tx - s.translate;
                        var ty = 0;
                        if (!isH()) {
                            ty = tx;
                            tx = 0;
                        }
                        var slideOpacity = s.params.fade.crossFade ?
                                Math.max(1 - Math.abs(slide[0].progress), 0) :
                                1 + Math.min(Math.max(slide[0].progress, -1), 0);
                        if (slideOpacity > 0 && slideOpacity < 1) {
                            s.effects.fade.fadeIndex = i;
                        }
                        slide
                            .css({
                                opacity: slideOpacity
                            })
                            .transform('translate3d(' + tx + 'px, ' + ty + 'px, 0px)');

                    }
                },
                setTransition: function (duration) {
                    s.slides.transition(duration);
                    if (s.params.virtualTranslate && duration !== 0) {
                        var fadeIndex = s.effects.fade.fadeIndex !== null ? s.effects.fade.fadeIndex : s.activeIndex;
                        s.slides.eq(fadeIndex).transitionEnd(function () {
                            var triggerEvents = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'];
                            for (var i = 0; i < triggerEvents.length; i++) {
                                s.wrapper.trigger(triggerEvents[i]);
                            }
                        });
                    }
                }
            },
            cube: {
                setTranslate: function () {
                    var wrapperRotate = 0, cubeShadow;
                    if (s.params.cube.shadow) {
                        if (isH()) {
                            cubeShadow = s.wrapper.find('.swiper-cube-shadow');
                            if (cubeShadow.length === 0) {
                                cubeShadow = $('<div class="swiper-cube-shadow"></div>');
                                s.wrapper.append(cubeShadow);
                            }
                            cubeShadow.css({height: s.width + 'px'});
                        }
                        else {
                            cubeShadow = s.container.find('.swiper-cube-shadow');
                            if (cubeShadow.length === 0) {
                                cubeShadow = $('<div class="swiper-cube-shadow"></div>');
                                s.container.append(cubeShadow);
                            }
                        }
                    }
                    for (var i = 0; i < s.slides.length; i++) {
                        var slide = s.slides.eq(i);
                        var slideAngle = i * 90;
                        var round = Math.floor(slideAngle / 360);
                        if (s.rtl) {
                            slideAngle = -slideAngle;
                            round = Math.floor(-slideAngle / 360);
                        }
                        var progress = Math.max(Math.min(slide[0].progress, 1), -1);
                        var tx = 0, ty = 0, tz = 0;
                        if (i % 4 === 0) {
                            tx = - round * 4 * s.size;
                            tz = 0;
                        }
                        else if ((i - 1) % 4 === 0) {
                            tx = 0;
                            tz = - round * 4 * s.size;
                        }
                        else if ((i - 2) % 4 === 0) {
                            tx = s.size + round * 4 * s.size;
                            tz = s.size;
                        }
                        else if ((i - 3) % 4 === 0) {
                            tx = - s.size;
                            tz = 3 * s.size + s.size * 4 * round;
                        }
                        if (s.rtl) {
                            tx = -tx;
                        }

                        if (!isH()) {
                            ty = tx;
                            tx = 0;
                        }

                        var transform = 'rotateX(' + (isH() ? 0 : -slideAngle) + 'deg) rotateY(' + (isH() ? slideAngle : 0) + 'deg) translate3d(' + tx + 'px, ' + ty + 'px, ' + tz + 'px)';
                        if (progress <= 1 && progress > -1) {
                            wrapperRotate = i * 90 + progress * 90;
                            if (s.rtl) wrapperRotate = -i * 90 - progress * 90;
                        }
                        slide.transform(transform);
                        if (s.params.cube.slideShadows) {
                            //Set shadows
                            var shadowBefore = isH() ? slide.find('.swiper-slide-shadow-left') : slide.find('.swiper-slide-shadow-top');
                            var shadowAfter = isH() ? slide.find('.swiper-slide-shadow-right') : slide.find('.swiper-slide-shadow-bottom');
                            if (shadowBefore.length === 0) {
                                shadowBefore = $('<div class="swiper-slide-shadow-' + (isH() ? 'left' : 'top') + '"></div>');
                                slide.append(shadowBefore);
                            }
                            if (shadowAfter.length === 0) {
                                shadowAfter = $('<div class="swiper-slide-shadow-' + (isH() ? 'right' : 'bottom') + '"></div>');
                                slide.append(shadowAfter);
                            }
                            if (shadowBefore.length) shadowBefore[0].style.opacity = -slide[0].progress;
                            if (shadowAfter.length) shadowAfter[0].style.opacity = slide[0].progress;
                        }
                    }
                    s.wrapper.css({
                        '-webkit-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
                        '-moz-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
                        '-ms-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
                        'transform-origin': '50% 50% -' + (s.size / 2) + 'px'
                    });

                    if (s.params.cube.shadow) {
                        if (isH()) {
                            cubeShadow.transform('translate3d(0px, ' + (s.width / 2 + s.params.cube.shadowOffset) + 'px, ' + (-s.width / 2) + 'px) rotateX(90deg) rotateZ(0deg) scale(' + (s.params.cube.shadowScale) + ')');
                        }
                        else {
                            var shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
                            var multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
                            var scale1 = s.params.cube.shadowScale,
                                scale2 = s.params.cube.shadowScale / multiplier,
                                offset = s.params.cube.shadowOffset;
                            cubeShadow.transform('scale3d(' + scale1 + ', 1, ' + scale2 + ') translate3d(0px, ' + (s.height / 2 + offset) + 'px, ' + (-s.height / 2 / scale2) + 'px) rotateX(-90deg)');
                        }
                    }
                    var zFactor = (s.isSafari || s.isUiWebView) ? (-s.size / 2) : 0;
                    s.wrapper.transform('translate3d(0px,0,' + zFactor + 'px) rotateX(' + (isH() ? 0 : wrapperRotate) + 'deg) rotateY(' + (isH() ? -wrapperRotate : 0) + 'deg)');
                },
                setTransition: function (duration) {
                    s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
                    if (s.params.cube.shadow && !isH()) {
                        s.container.find('.swiper-cube-shadow').transition(duration);
                    }
                }
            },
            coverflow: {
                setTranslate: function () {
                    var transform = s.translate;
                    var center = isH() ? -transform + s.width / 2 : -transform + s.height / 2;
                    var rotate = isH() ? s.params.coverflow.rotate: -s.params.coverflow.rotate;
                    var translate = s.params.coverflow.depth;
                    //Each slide offset from center
                    for (var i = 0, length = s.slides.length; i < length; i++) {
                        var slide = s.slides.eq(i);
                        var slideSize = s.slidesSizesGrid[i];
                        var slideOffset = slide[0].swiperSlideOffset;
                        var offsetMultiplier = (center - slideOffset - slideSize / 2) / slideSize * s.params.coverflow.modifier;

                        var rotateY = isH() ? rotate * offsetMultiplier : 0;
                        var rotateX = isH() ? 0 : rotate * offsetMultiplier;
                        // var rotateZ = 0
                        var translateZ = -translate * Math.abs(offsetMultiplier);

                        var translateY = isH() ? 0 : s.params.coverflow.stretch * (offsetMultiplier);
                        var translateX = isH() ? s.params.coverflow.stretch * (offsetMultiplier) : 0;

                        //Fix for ultra small values
                        if (Math.abs(translateX) < 0.001) translateX = 0;
                        if (Math.abs(translateY) < 0.001) translateY = 0;
                        if (Math.abs(translateZ) < 0.001) translateZ = 0;
                        if (Math.abs(rotateY) < 0.001) rotateY = 0;
                        if (Math.abs(rotateX) < 0.001) rotateX = 0;

                        var slideTransform = 'translate3d(' + translateX + 'px,' + translateY + 'px,' + translateZ + 'px)  rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';

                        slide.transform(slideTransform);
                        slide[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
                        if (s.params.coverflow.slideShadows) {
                            //Set shadows
                            var shadowBefore = isH() ? slide.find('.swiper-slide-shadow-left') : slide.find('.swiper-slide-shadow-top');
                            var shadowAfter = isH() ? slide.find('.swiper-slide-shadow-right') : slide.find('.swiper-slide-shadow-bottom');
                            if (shadowBefore.length === 0) {
                                shadowBefore = $('<div class="swiper-slide-shadow-' + (isH() ? 'left' : 'top') + '"></div>');
                                slide.append(shadowBefore);
                            }
                            if (shadowAfter.length === 0) {
                                shadowAfter = $('<div class="swiper-slide-shadow-' + (isH() ? 'right' : 'bottom') + '"></div>');
                                slide.append(shadowAfter);
                            }
                            if (shadowBefore.length) shadowBefore[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
                            if (shadowAfter.length) shadowAfter[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0;
                        }
                    }

                    //Set correct perspective for IE10
                    if (s.browser.ie) {
                        var ws = s.wrapper[0].style;
                        ws.perspectiveOrigin = center + 'px 50%';
                    }
                },
                setTransition: function (duration) {
                    s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
                }
            }
        };

        /*=========================
          Images Lazy Loading
          ===========================*/
        s.lazy = {
            initialImageLoaded: false,
            loadImageInSlide: function (index) {
                if (typeof index === 'undefined') return;
                if (s.slides.length === 0) return;

                var slide = s.slides.eq(index);
                var img = slide.find('img.swiper-lazy:not(.swiper-lazy-loaded):not(.swiper-lazy-loading)');
                if (img.length === 0) return;

                img.each(function () {
                    var _img = $(this);
                    _img.addClass('swiper-lazy-loading');

                    var src = _img.attr('data-src');

                    s.loadImage(_img[0], src, false, function () {
                        _img.attr('src', src);
                        _img.removeAttr('data-src');
                        _img.addClass('swiper-lazy-loaded').removeClass('swiper-lazy-loading');
                        slide.find('.swiper-lazy-preloader, .preloader').remove();

                        s.emit('onLazyImageReady', s, slide[0], _img[0]);
                    });

                    s.emit('onLazyImageLoad', s, slide[0], _img[0]);
                });

            },
            load: function () {
                if (s.params.watchSlidesVisibility) {
                    s.wrapper.children('.' + s.params.slideVisibleClass).each(function () {
                        s.lazy.loadImageInSlide($(this).index());
                    });
                }
                else {
                    if (s.params.slidesPerView > 1) {
                        for (var i = s.activeIndex; i < s.activeIndex + s.params.slidesPerView ; i++) {
                            if (s.slides[i]) s.lazy.loadImageInSlide(i);
                        }
                    }
                    else {
                        s.lazy.loadImageInSlide(s.activeIndex);
                    }
                }
                if (s.params.lazyLoadingInPrevNext) {
                    var nextSlide = s.wrapper.children('.' + s.params.slideNextClass);
                    if (nextSlide.length > 0) s.lazy.loadImageInSlide(nextSlide.index());

                    var prevSlide = s.wrapper.children('.' + s.params.slidePrevClass);
                    if (prevSlide.length > 0) s.lazy.loadImageInSlide(prevSlide.index());
                }
            },
            onTransitionStart: function () {
                if (s.params.lazyLoading) {
                    if (s.params.lazyLoadingOnTransitionStart || (!s.params.lazyLoadingOnTransitionStart && !s.lazy.initialImageLoaded)) {
                        s.lazy.initialImageLoaded = true;
                        s.lazy.load();
                    }
                }
            },
            onTransitionEnd: function () {
                if (s.params.lazyLoading && !s.params.lazyLoadingOnTransitionStart) {
                    s.lazy.load();
                }
            }
        };


        /*=========================
          Scrollbar
          ===========================*/
        s.scrollbar = {
            set: function () {
                if (!s.params.scrollbar) return;
                var sb = s.scrollbar;
                sb.track = $(s.params.scrollbar);
                sb.drag = sb.track.find('.swiper-scrollbar-drag');
                if (sb.drag.length === 0) {
                    sb.drag = $('<div class="swiper-scrollbar-drag"></div>');
                    sb.track.append(sb.drag);
                }
                sb.drag[0].style.width = '';
                sb.drag[0].style.height = '';
                sb.trackSize = isH() ? sb.track[0].offsetWidth : sb.track[0].offsetHeight;

                sb.divider = s.size / s.virtualSize;
                sb.moveDivider = sb.divider * (sb.trackSize / s.size);
                sb.dragSize = sb.trackSize * sb.divider;

                if (isH()) {
                    sb.drag[0].style.width = sb.dragSize + 'px';
                }
                else {
                    sb.drag[0].style.height = sb.dragSize + 'px';
                }

                if (sb.divider >= 1) {
                    sb.track[0].style.display = 'none';
                }
                else {
                    sb.track[0].style.display = '';
                }
                if (s.params.scrollbarHide) {
                    sb.track[0].style.opacity = 0;
                }
            },
            setTranslate: function () {
                if (!s.params.scrollbar) return;
                var sb = s.scrollbar;
                var newPos;

                var newSize = sb.dragSize;
                newPos = (sb.trackSize - sb.dragSize) * s.progress;
                if (s.rtl && isH()) {
                    newPos = -newPos;
                    if (newPos > 0) {
                        newSize = sb.dragSize - newPos;
                        newPos = 0;
                    }
                    else if (-newPos + sb.dragSize > sb.trackSize) {
                        newSize = sb.trackSize + newPos;
                    }
                }
                else {
                    if (newPos < 0) {
                        newSize = sb.dragSize + newPos;
                        newPos = 0;
                    }
                    else if (newPos + sb.dragSize > sb.trackSize) {
                        newSize = sb.trackSize - newPos;
                    }
                }
                if (isH()) {
                    if (s.support.transforms3d) {
                        sb.drag.transform('translate3d(' + (newPos) + 'px, 0, 0)');
                    }
                    else {
                        sb.drag.transform('translateX(' + (newPos) + 'px)');
                    }
                    sb.drag[0].style.width = newSize + 'px';
                }
                else {
                    if (s.support.transforms3d) {
                        sb.drag.transform('translate3d(0px, ' + (newPos) + 'px, 0)');
                    }
                    else {
                        sb.drag.transform('translateY(' + (newPos) + 'px)');
                    }
                    sb.drag[0].style.height = newSize + 'px';
                }
                if (s.params.scrollbarHide) {
                    clearTimeout(sb.timeout);
                    sb.track[0].style.opacity = 1;
                    sb.timeout = setTimeout(function () {
                        sb.track[0].style.opacity = 0;
                        sb.track.transition(400);
                    }, 1000);
                }
            },
            setTransition: function (duration) {
                if (!s.params.scrollbar) return;
                s.scrollbar.drag.transition(duration);
            }
        };

        /*=========================
          Controller
          ===========================*/
        s.controller = {
            setTranslate: function (translate, byController) {
                var controlled = s.params.control;
                var multiplier, controlledTranslate;
                if (s.isArray(controlled)) {
                    for (var i = 0; i < controlled.length; i++) {
                        if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
                            translate = controlled[i].rtl && controlled[i].params.direction === 'horizontal' ? -s.translate : s.translate;
                            multiplier = (controlled[i].maxTranslate() - controlled[i].minTranslate()) / (s.maxTranslate() - s.minTranslate());
                            controlledTranslate = (translate - s.minTranslate()) * multiplier + controlled[i].minTranslate();
                            if (s.params.controlInverse) {
                                controlledTranslate = controlled[i].maxTranslate() - controlledTranslate;
                            }
                            controlled[i].updateProgress(controlledTranslate);
                            controlled[i].setWrapperTranslate(controlledTranslate, false, s);
                            controlled[i].updateActiveIndex();
                        }
                    }
                }
                else if (controlled instanceof Swiper && byController !== controlled) {
                    translate = controlled.rtl && controlled.params.direction === 'horizontal' ? -s.translate : s.translate;
                    multiplier = (controlled.maxTranslate() - controlled.minTranslate()) / (s.maxTranslate() - s.minTranslate());
                    controlledTranslate = (translate - s.minTranslate()) * multiplier + controlled.minTranslate();
                    if (s.params.controlInverse) {
                        controlledTranslate = controlled.maxTranslate() - controlledTranslate;
                    }
                    controlled.updateProgress(controlledTranslate);
                    controlled.setWrapperTranslate(controlledTranslate, false, s);
                    controlled.updateActiveIndex();
                }
            },
            setTransition: function (duration, byController) {
                var controlled = s.params.control;
                if (s.isArray(controlled)) {
                    for (var i = 0; i < controlled.length; i++) {
                        if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
                            controlled[i].setWrapperTransition(duration, s);
                        }
                    }
                }
                else if (controlled instanceof Swiper && byController !== controlled) {
                    controlled.setWrapperTransition(duration, s);
                }
            }
        };

        /*=========================
          Parallax
          ===========================*/
        function setParallaxTransform(el, progress) {
            el = $(el);
            var p, pX, pY;

            p = el.attr('data-swiper-parallax') || '0';
            pX = el.attr('data-swiper-parallax-x');
            pY = el.attr('data-swiper-parallax-y');
            if (pX || pY) {
                pX = pX || '0';
                pY = pY || '0';
            }
            else {
                if (isH()) {
                    pX = p;
                    pY = '0';
                }
                else {
                    pY = p;
                    pX = '0';
                }
            }
            if ((pX).indexOf('%') >= 0) {
                pX = parseInt(pX, 10) * progress + '%';
            }
            else {
                pX = pX * progress + 'px' ;
            }
            if ((pY).indexOf('%') >= 0) {
                pY = parseInt(pY, 10) * progress + '%';
            }
            else {
                pY = pY * progress + 'px' ;
            }
            el.transform('translate3d(' + pX + ', ' + pY + ',0px)');
        }
        s.parallax = {
            setTranslate: function () {
                s.container.children('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function(){
                    setParallaxTransform(this, s.progress);

                });
                s.slides.each(function () {
                    var slide = $(this);
                    slide.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function () {
                        var progress = Math.min(Math.max(slide[0].progress, -1), 1);
                        setParallaxTransform(this, progress);
                    });
                });
            },
            setTransition: function (duration) {
                if (typeof duration === 'undefined') duration = s.params.speed;
                s.container.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function(){
                    var el = $(this);
                    var parallaxDuration = parseInt(el.attr('data-swiper-parallax-duration'), 10) || duration;
                    if (duration === 0) parallaxDuration = 0;
                    el.transition(parallaxDuration);
                });
            }
        };


        /*=========================
          Plugins API. Collect all and init all plugins
          ===========================*/
        s._plugins = [];
        for (var plugin in s.plugins) {
            if(s.plugins.hasOwnProperty(plugin)){
                var p = s.plugins[plugin](s, s.params[plugin]);
                if (p) s._plugins.push(p);
            }
        }
        // Method to call all plugins event/method
        s.callPlugins = function (eventName) {
            for (var i = 0; i < s._plugins.length; i++) {
                if (eventName in s._plugins[i]) {
                    s._plugins[i][eventName](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                }
            }
        };

        /*=========================
          Events/Callbacks/Plugins Emitter
          ===========================*/
        function normalizeEventName (eventName) {
            if (eventName.indexOf('on') !== 0) {
                if (eventName[0] !== eventName[0].toUpperCase()) {
                    eventName = 'on' + eventName[0].toUpperCase() + eventName.substring(1);
                }
                else {
                    eventName = 'on' + eventName;
                }
            }
            return eventName;
        }
        s.emitterEventListeners = {

        };
        s.emit = function (eventName) {
            // Trigger callbacks
            if (s.params[eventName]) {
                s.params[eventName](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
            }
            var i;
            // 图片浏览器点击关闭后，swiper也关闭了，但会执行到此处
            if (!s) return;
            // Trigger events
            if (s.emitterEventListeners[eventName]) {
                for (i = 0; i < s.emitterEventListeners[eventName].length; i++) {
                    s.emitterEventListeners[eventName][i](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                }
            }
            // Trigger plugins
            if (s.callPlugins) s.callPlugins(eventName, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        };
        s.on = function (eventName, handler) {
            eventName = normalizeEventName(eventName);
            if (!s.emitterEventListeners[eventName]) s.emitterEventListeners[eventName] = [];
            s.emitterEventListeners[eventName].push(handler);
            return s;
        };
        s.off = function (eventName, handler) {
            var i;
            eventName = normalizeEventName(eventName);
            if (typeof handler === 'undefined') {
                // Remove all handlers for such event
                s.emitterEventListeners[eventName] = [];
                return s;
            }
            if (!s.emitterEventListeners[eventName] || s.emitterEventListeners[eventName].length === 0) return;
            for (i = 0; i < s.emitterEventListeners[eventName].length; i++) {
                if(s.emitterEventListeners[eventName][i] === handler) s.emitterEventListeners[eventName].splice(i, 1);
            }
            return s;
        };
        s.once = function (eventName, handler) {
            eventName = normalizeEventName(eventName);
            var _handler = function () {
                handler(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                s.off(eventName, _handler);
            };
            s.on(eventName, _handler);
            return s;
        };

        // Accessibility tools
        s.a11y = {
            makeFocusable: function ($el) {
                $el[0].tabIndex = '0';
                return $el;
            },
            addRole: function ($el, role) {
                $el.attr('role', role);
                return $el;
            },

            addLabel: function ($el, label) {
                $el.attr('aria-label', label);
                return $el;
            },

            disable: function ($el) {
                $el.attr('aria-disabled', true);
                return $el;
            },

            enable: function ($el) {
                $el.attr('aria-disabled', false);
                return $el;
            },

            onEnterKey: function (event) {
                if (event.keyCode !== 13) return;
                if ($(event.target).is(s.params.nextButton)) {
                    s.onClickNext(event);
                    if (s.isEnd) {
                        s.a11y.notify(s.params.lastSlideMsg);
                    }
                    else {
                        s.a11y.notify(s.params.nextSlideMsg);
                    }
                }
                else if ($(event.target).is(s.params.prevButton)) {
                    s.onClickPrev(event);
                    if (s.isBeginning) {
                        s.a11y.notify(s.params.firstSlideMsg);
                    }
                    else {
                        s.a11y.notify(s.params.prevSlideMsg);
                    }
                }
            },

            liveRegion: $('<span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>'),

            notify: function (message) {
                var notification = s.a11y.liveRegion;
                if (notification.length === 0) return;
                notification.html('');
                notification.html(message);
            },
            init: function () {
                // Setup accessibility
                if (s.params.nextButton) {
                    var nextButton = $(s.params.nextButton);
                    s.a11y.makeFocusable(nextButton);
                    s.a11y.addRole(nextButton, 'button');
                    s.a11y.addLabel(nextButton, s.params.nextSlideMsg);
                }
                if (s.params.prevButton) {
                    var prevButton = $(s.params.prevButton);
                    s.a11y.makeFocusable(prevButton);
                    s.a11y.addRole(prevButton, 'button');
                    s.a11y.addLabel(prevButton, s.params.prevSlideMsg);
                }

                $(s.container).append(s.a11y.liveRegion);
            },
            destroy: function () {
                if (s.a11y.liveRegion && s.a11y.liveRegion.length > 0) s.a11y.liveRegion.remove();
            }
        };


        /*=========================
          Init/Destroy
          ===========================*/
        s.init = function () {
            if (s.params.loop) s.createLoop();
            s.updateContainerSize();
            s.updateSlidesSize();
            s.updatePagination();
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.set();
            }
            if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
                if (!s.params.loop) s.updateProgress();
                s.effects[s.params.effect].setTranslate();
            }
            if (s.params.loop) {
                s.slideTo(s.params.initialSlide + s.loopedSlides, 0, s.params.runCallbacksOnInit);
            }
            else {
                s.slideTo(s.params.initialSlide, 0, s.params.runCallbacksOnInit);
                if (s.params.initialSlide === 0) {
                    if (s.parallax && s.params.parallax) s.parallax.setTranslate();
                    if (s.lazy && s.params.lazyLoading) s.lazy.load();
                }
            }
            s.attachEvents();
            if (s.params.observer && s.support.observer) {
                s.initObservers();
            }
            if (s.params.preloadImages && !s.params.lazyLoading) {
                s.preloadImages();
            }
            if (s.params.autoplay) {
                s.startAutoplay();
            }
            if (s.params.keyboardControl) {
                if (s.enableKeyboardControl) s.enableKeyboardControl();
            }
            if (s.params.mousewheelControl) {
                if (s.enableMousewheelControl) s.enableMousewheelControl();
            }
            if (s.params.hashnav) {
                if (s.hashnav) s.hashnav.init();
            }
            if (s.params.a11y && s.a11y) s.a11y.init();
            s.emit('onInit', s);
        };

        // Cleanup dynamic styles
        s.cleanupStyles = function () {
            // Container
            s.container.removeClass(s.classNames.join(' ')).removeAttr('style');

            // Wrapper
            s.wrapper.removeAttr('style');

            // Slides
            if (s.slides && s.slides.length) {
                s.slides
                    .removeClass([
                      s.params.slideVisibleClass,
                      s.params.slideActiveClass,
                      s.params.slideNextClass,
                      s.params.slidePrevClass
                    ].join(' '))
                    .removeAttr('style')
                    .removeAttr('data-swiper-column')
                    .removeAttr('data-swiper-row');
            }

            // Pagination/Bullets
            if (s.paginationContainer && s.paginationContainer.length) {
                s.paginationContainer.removeClass(s.params.paginationHiddenClass);
            }
            if (s.bullets && s.bullets.length) {
                s.bullets.removeClass(s.params.bulletActiveClass);
            }

            // Buttons
            if (s.params.prevButton) $(s.params.prevButton).removeClass(s.params.buttonDisabledClass);
            if (s.params.nextButton) $(s.params.nextButton).removeClass(s.params.buttonDisabledClass);

            // Scrollbar
            if (s.params.scrollbar && s.scrollbar) {
                if (s.scrollbar.track && s.scrollbar.track.length) s.scrollbar.track.removeAttr('style');
                if (s.scrollbar.drag && s.scrollbar.drag.length) s.scrollbar.drag.removeAttr('style');
            }
        };

        // Destroy
        s.destroy = function (deleteInstance, cleanupStyles) {
            // Detach evebts
            s.detachEvents();
            // Stop autoplay
            s.stopAutoplay();
            // Destroy loop
            if (s.params.loop) {
                s.destroyLoop();
            }
            // Cleanup styles
            if (cleanupStyles) {
                s.cleanupStyles();
            }
            // Disconnect observer
            s.disconnectObservers();
            // Disable keyboard/mousewheel
            if (s.params.keyboardControl) {
                if (s.disableKeyboardControl) s.disableKeyboardControl();
            }
            if (s.params.mousewheelControl) {
                if (s.disableMousewheelControl) s.disableMousewheelControl();
            }
            // Disable a11y
            if (s.params.a11y && s.a11y) s.a11y.destroy();
            // Destroy callback
            s.emit('onDestroy');
            // Delete instance
            if (deleteInstance !== false) s = null;
        };

        s.init();



        // Return swiper instance
        return s;
    };
    /*==================================================
        Prototype
    ====================================================*/
    Swiper.prototype = {
        defaults: {
            direction: 'horizontal',
            touchEventsTarget: 'container',
            initialSlide: 0,
            speed: 300,
            // autoplay
            autoplay: false,
            autoplayDisableOnInteraction: true,
            // Free mode
            freeMode: false,
            freeModeMomentum: true,
            freeModeMomentumRatio: 1,
            freeModeMomentumBounce: true,
            freeModeMomentumBounceRatio: 1,
            // Set wrapper width
            setWrapperSize: false,
            // Virtual Translate
            virtualTranslate: false,
            // Effects
            effect: 'slide', // 'slide' or 'fade' or 'cube' or 'coverflow'
            coverflow: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows : true
            },
            cube: {
                slideShadows: true,
                shadow: true,
                shadowOffset: 20,
                shadowScale: 0.94
            },
            fade: {
                crossFade: false
            },
            // Parallax
            parallax: false,
            // Scrollbar
            scrollbar: null,
            scrollbarHide: true,
            // Keyboard Mousewheel
            keyboardControl: false,
            mousewheelControl: false,
            mousewheelForceToAxis: false,
            // Hash Navigation
            hashnav: false,
            // Slides grid
            spaceBetween: 0,
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerColumnFill: 'column',
            slidesPerGroup: 1,
            centeredSlides: false,
            // Touches
            touchRatio: 1,
            touchAngle: 45,
            simulateTouch: true,
            shortSwipes: true,
            longSwipes: true,
            longSwipesRatio: 0.5,
            longSwipesMs: 300,
            followFinger: true,
            onlyExternal: false,
            threshold: 0,
            touchMoveStopPropagation: true,
            // Pagination
            pagination: null,
            paginationClickable: false,
            paginationHide: false,
            paginationBulletRender: null,
            // Resistance
            resistance: true,
            resistanceRatio: 0.85,
            // Next/prev buttons
            nextButton: null,
            prevButton: null,
            // Progress
            watchSlidesProgress: false,
            watchSlidesVisibility: false,
            // Cursor
            grabCursor: false,
            // Clicks
            preventClicks: true,
            preventClicksPropagation: true,
            slideToClickedSlide: false,
            // Lazy Loading
            lazyLoading: false,
            lazyLoadingInPrevNext: false,
            lazyLoadingOnTransitionStart: false,
            // Images
            preloadImages: true,
            updateOnImagesReady: true,
            // loop
            loop: false,
            loopAdditionalSlides: 0,
            loopedSlides: null,
            // Control
            control: undefined,
            controlInverse: false,
            // Swiping/no swiping
            allowSwipeToPrev: true,
            allowSwipeToNext: true,
            swipeHandler: null, //'.swipe-handler',
            noSwiping: true,
            noSwipingClass: 'swiper-no-swiping',
            // NS
            slideClass: 'swiper-slide',
            slideActiveClass: 'swiper-slide-active',
            slideVisibleClass: 'swiper-slide-visible',
            slideDuplicateClass: 'swiper-slide-duplicate',
            slideNextClass: 'swiper-slide-next',
            slidePrevClass: 'swiper-slide-prev',
            wrapperClass: 'swiper-wrapper',
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
            buttonDisabledClass: 'swiper-button-disabled',
            paginationHiddenClass: 'swiper-pagination-hidden',
            // Observer
            observer: false,
            observeParents: false,
            // Accessibility
            a11y: false,
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
            firstSlideMessage: 'This is the first slide',
            lastSlideMessage: 'This is the last slide',
            // Callbacks
            runCallbacksOnInit: true,
            /*
            Callbacks:
            onInit: function (swiper)
            onDestroy: function (swiper)
            onClick: function (swiper, e)
            onTap: function (swiper, e)
            onDoubleTap: function (swiper, e)
            onSliderMove: function (swiper, e)
            onSlideChangeStart: function (swiper)
            onSlideChangeEnd: function (swiper)
            onTransitionStart: function (swiper)
            onTransitionEnd: function (swiper)
            onImagesReady: function (swiper)
            onProgress: function (swiper, progress)
            onTouchStart: function (swiper, e)
            onTouchMove: function (swiper, e)
            onTouchMoveOpposite: function (swiper, e)
            onTouchEnd: function (swiper, e)
            onReachBeginning: function (swiper)
            onReachEnd: function (swiper)
            onSetTransition: function (swiper, duration)
            onSetTranslate: function (swiper, translate)
            onAutoplayStart: function (swiper)
            onAutoplayStop: function (swiper),
            onLazyImageLoad: function (swiper, slide, image)
            onLazyImageReady: function (swiper, slide, image)
            */

        },
        isSafari: (function () {
            var ua = navigator.userAgent.toLowerCase();
            return (ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0);
        })(),
        isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),
        isArray: function (arr) {
            return Object.prototype.toString.apply(arr) === '[object Array]';
        },
        /*==================================================
        Browser
        ====================================================*/
        browser: {
            ie: window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
            ieTouch: (window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 1) || (window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 1),
        },
        /*==================================================
        Devices
        ====================================================*/
        device: (function () {
            var ua = navigator.userAgent;
            var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
            var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
            var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
            return {
                ios: ipad || iphone || ipad,
                android: android
            };
        })(),
        /*==================================================
        Feature Detection
        ====================================================*/
        support: {
            touch : (window.Modernizr && Modernizr.touch === true) || (function () {
                return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
            })(),

            transforms3d : (window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
                var div = document.createElement('div').style;
                return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
            })(),

            flexbox: (function () {
                var div = document.createElement('div').style;
                var styles = ('alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient').split(' ');
                for (var i = 0; i < styles.length; i++) {
                    if (styles[i] in div) return true;
                }
            })(),

            observer: (function () {
                return ('MutationObserver' in window || 'WebkitMutationObserver' in window);
            })()
        },
        /*==================================================
        Plugins
        ====================================================*/
        plugins: {}
    };
    $.Swiper = Swiper;
}(Zepto);

/*===============================================================================
************   Accordion   ************
===============================================================================*/
/* global Zepto:true */
+function ($) {
    "use strict";

    $.accordionToggle = function (item) {
        item = $(item);
        if (item.length === 0) return;
        if (item.hasClass('accordion-item-expanded')) $.accordionClose(item);
        else $.accordionOpen(item);
    };
    $.accordionOpen = function (item) {
        item = $(item);
        var list = item.parents('.accordion-list').eq(0);
        var content = item.children('.accordion-item-content');
        if (content.length === 0) content = item.find('.accordion-item-content');
        var expandedItem = list.length > 0 && item.parent().children('.accordion-item-expanded');
        if (expandedItem.length > 0) {
            $.accordionClose(expandedItem);
        }
        content.css('height', content[0].scrollHeight + 'px').transitionEnd(function () {
            if (item.hasClass('accordion-item-expanded')) {
                //content.transition(0);
                //content.css('height', 'auto');
                //var clientLeft = content[0].clientLeft;
                //content.transition('');
                item.trigger('opened');
            }
            else {
                content.css('height', '');
                item.trigger('closed');
            }
        });
        item.trigger('open');
        item.addClass('accordion-item-expanded');
    };
    $.accordionClose = function (item) {
        item = $(item);
        var content = item.children('.accordion-item-content');
        if (content.length === 0) content = item.find('.accordion-item-content');
        item.removeClass('accordion-item-expanded');
        //content.transition(0);
        content.css('height', content[0].scrollHeight + 'px');
        // Relayout
        //var clientLeft = content[0].clientLeft;
        // Close
        //content.transition('');
        content.css('height', '').transitionEnd(function () {
            if (item.hasClass('accordion-item-expanded')) {
                //content.transition(0);
                //content.css('height', 'auto');
                //var clientLeft = content[0].clientLeft;
                //content.transition('');
                item.trigger('opened');
            }
            else {
                content.css('height', '');
                item.trigger('closed');
            }
        });
        item.trigger('close');
    };

    $(document).on("click", ".accordion-item .item-content, .accordion-item-toggle", function(e) {
        e.preventDefault();
        var clicked = $(this);
        // Accordion
        if (clicked.hasClass('accordion-item-toggle') || (clicked.hasClass('item-link') && clicked.parent().hasClass('accordion-item'))) {
            var accordionItem = clicked.parent('.accordion-item');
            if (accordionItem.length === 0) accordionItem = clicked.parents('.accordion-item');
            if (accordionItem.length === 0) accordionItem = clicked.parents('li');
            $.accordionToggle(accordionItem);
        }
    });
}(Zepto);

/*===============================================================================
************   Autocomplete   ************
===============================================================================*/
/* global Zepto:true */

+ function($) {
    $.autocomplete = function(options) {
        this.limit = "";
        this.data = [];
        this.remoteTimeout = "";
        this.caseSensitive = "";
        _clear();
        if (!_isDataSourceDefined(options)) {
            return;
        }
        if (_isLocal(options)) {
            _initLocal(options.limit, options.data, options.caseSensitive, options.show, options.hide);
            return;
        }
        if (_isRemote(options)) {
            _initRemote(options.limit, options.data, options.caseSensitive, options.show, options.hide);
        }

        function init(limit, data, caseSensitive, showFunc, hideFunc) {
            this.limit = limit;
            this.data = data;
            this.remoteTimeout = 3000;
            this.resultContainer = $('.autocomplete-result');
            this.caseSensitive = typeof caseSensitive !== 'undefined' ? caseSensitive : true;
            showFunction = typeof showFunc == 'function' ? showFunc : function() {
                resultContainer.show();
            };
            hideFunction = typeof hideFunc == 'function' ? hideFunc : function() {
                resultContainer.hide();
            };
            _setSelectionRange();
        }

        function _clear() {
            this.limit = 2;
            this.data = '';
            this.remoteTimeout = 3000;
        }

        function _setSelectionRange() {
            $('.autocomplete-input').click(function(event) {
                this.setSelectionRange(0, this.value.length);
            });
        }

        function _isDataSourceDefined(options) {
            return typeof options !== "undefined" &&
                typeof options.datasource !== "undefined" &&
                options.datasource !== "" &&
                options.datasource;
        }

        function _isRemote(options) {
            return options.datasource === 'remote' && typeof options.data !== "undefined" && options.data;
        }

        function _isLocal(options) {
            return options.datasource === 'local' && typeof options.data !== "undefined" && $.isArray(options.data);
        }

        function _initLocal(limit, data, caseSensitive, showFunc, hideFunc) {
            init(limit, data, caseSensitive, showFunc, hideFunc);
            var searchTextField = $('.autocomplete-input');
            var _this = this;
            searchTextField.bind("keyup", $.proxy(_handleLocalSearch, _this));
        }

        function _initRemote(limit, data, caseSensitive, showFunc, hideFunc) {
            init(limit, data, caseSensitive, showFunc, hideFunc);
            var searchTextField = $('.autocomplete-input');
            var _this = this;
            searchTextField.bind("keyup", $.proxy(_handleRemoteSearch, _this));
        }

        function _isWithinLimit(message) {
            return message !== undefined && message.length > limit;
        }

        function _handleLocalSearch() {
            var message = $('.autocomplete-input').val();
            if (!_isWithinLimit(message)) {
                _clearResults();
                return;
            }
            _successHandler(this.data.filter(function(i) {
                if (!this.caseSensitive) {
                    return i.toLowerCase().indexOf(message.toLowerCase()) > -1;
                } else {
                    return i.indexOf(message) > -1;
                }

            }));
        }

        function _handleRemoteSearch(evt) {
            var message = $('.autocomplete-input').val();
            var url = this.data + message;
            if (!_isWithinLimit(message)) {
                _clearResults();
                return;
            }
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'json',
                success: $.proxy(_successHandler, this),
                error: function(err) {
                    console.log('Request failed to load suggestions.');
                },
                timeout: this.remoteTimeout
            });
        }

        function _successHandler(data) {
            if (data === undefined && data.length <= 0)
                return;
            var autocompleteHTML = "<ol>";
            $.map(data, function(listItem) {
                autocompleteHTML += "<li>" + listItem + "</li>";
            });
            autocompleteHTML += "</ol>";
            resultContainer.html(autocompleteHTML);
            $('.autocomplete-result li').on('click', function(evt) {
                var selectedValue = $(this).text();
                $('.autocomplete-input').val(selectedValue);
                _clearResults();
            });
            showFunction();
        }

        function _clearResults() {
            resultContainer.html('');
            hideFunction();
        }

    }


}(Zepto);
/*======================================================
************   Calendar   ************
======================================================*/
/*jshint unused: false*/
+function ($) {
    "use strict";
    var rtl = false;
    var Calendar = function (params) {
        var p = this;
        var defaults = {
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月' , '九月' , '十月', '十一月', '十二月'],
            monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月' , '九月' , '十月', '十一月', '十二月'],
            dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            firstDay: 1, // First day of the week, Monday
            weekendDays: [0, 6], // Sunday and Saturday
            multiple: false,
            dateFormat: 'yyyy-mm-dd',
            direction: 'horizontal', // or 'vertical'
            minDate: null,
            maxDate: null,
            touchMove: true,
            animate: true,
            closeOnSelect: true,
            monthPicker: true,
            monthPickerTemplate:
                '<div class="picker-calendar-month-picker">' +
                '<a href="#" class="link icon-only picker-calendar-prev-month"><i class="icon icon-prev"></i></a>' +
                '<div class="current-month-value"></div>' +
                '<a href="#" class="link icon-only picker-calendar-next-month"><i class="icon icon-next"></i></a>' +
                '</div>',
            yearPicker: true,
            yearPickerTemplate:
                '<div class="picker-calendar-year-picker">' +
                '<a href="#" class="link icon-only picker-calendar-prev-year"><i class="icon icon-prev"></i></a>' +
                '<span class="current-year-value"></span>' +
                '<a href="#" class="link icon-only picker-calendar-next-year"><i class="icon icon-next"></i></a>' +
                '</div>',
            weekHeader: true,
            // Common settings
            scrollToInput: true,
            inputReadOnly: true,
            toolbar: true,
            toolbarCloseText: 'Done',
            toolbarTemplate:
                '<div class="toolbar">' +
                '<div class="toolbar-inner">' +
                '{{monthPicker}}' +
                '{{yearPicker}}' +
                // '<a href="#" class="link close-picker">{{closeText}}</a>' +
                '</div>' +
                '</div>',
            /* Callbacks
               onMonthAdd
               onChange
               onOpen
               onClose
               onDayClick
               onMonthYearChangeStart
               onMonthYearChangeEnd
               */
        };
        params = params || {};
        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
        }
        p.params = params;
        p.initialized = false;

        // Inline flag
        p.inline = p.params.container ? true : false;

        // Is horizontal
        p.isH = p.params.direction === 'horizontal';

        // RTL inverter
        var inverter = p.isH ? (rtl ? -1 : 1) : 1;

        // Animating flag
        p.animating = false;

        // Format date
        function formatDate(date) {
            date = new Date(date);
            var year = date.getFullYear();
            var month = date.getMonth();
            var month1 = month + 1;
            var day = date.getDate();
            var weekDay = date.getDay();
            return p.params.dateFormat
                .replace(/yyyy/g, year)
                .replace(/yy/g, (year + '').substring(2))
                .replace(/mm/g, month1 < 10 ? '0' + month1 : month1)
                .replace(/m/g, month1)
                .replace(/MM/g, p.params.monthNames[month])
                .replace(/M/g, p.params.monthNamesShort[month])
                .replace(/dd/g, day < 10 ? '0' + day : day)
                .replace(/d/g, day)
                .replace(/DD/g, p.params.dayNames[weekDay])
                .replace(/D/g, p.params.dayNamesShort[weekDay]);
        }


        // Value
        p.addValue = function (value) {
            if (p.params.multiple) {
                if (!p.value) p.value = [];
                var inValuesIndex;
                for (var i = 0; i < p.value.length; i++) {
                    if (new Date(value).getTime() === new Date(p.value[i]).getTime()) {
                        inValuesIndex = i;
                    }
                }
                if (typeof inValuesIndex === 'undefined') {
                    p.value.push(value);
                }
                else {
                    p.value.splice(inValuesIndex, 1);
                }
                p.updateValue();
            }
            else {
                p.value = [value];
                p.updateValue();
            }
        };
        p.setValue = function (arrValues) {
            p.value = arrValues;
            p.updateValue();
        };
        p.updateValue = function () {
            p.wrapper.find('.picker-calendar-day-selected').removeClass('picker-calendar-day-selected');
            var i, inputValue;
            for (i = 0; i < p.value.length; i++) {
                var valueDate = new Date(p.value[i]);
                p.wrapper.find('.picker-calendar-day[data-date="' + valueDate.getFullYear() + '-' + valueDate.getMonth() + '-' + valueDate.getDate() + '"]').addClass('picker-calendar-day-selected');
            }
            if (p.params.onChange) {
                p.params.onChange(p, p.value, p.value.map(formatDate));
            }
            if (p.input && p.input.length > 0) {
                if (p.params.formatValue) inputValue = p.params.formatValue(p, p.value);
                else {
                    inputValue = [];
                    for (i = 0; i < p.value.length; i++) {
                        inputValue.push(formatDate(p.value[i]));
                    }
                    inputValue = inputValue.join(', ');
                }
                $(p.input).val(inputValue);
                $(p.input).trigger('change');
            }
        };

        // Columns Handlers
        p.initCalendarEvents = function () {
            var col;
            var allowItemClick = true;
            var isTouched, isMoved, touchStartX, touchStartY, touchCurrentX, touchCurrentY, touchStartTime, touchEndTime, startTranslate, currentTranslate, wrapperWidth, wrapperHeight, percentage, touchesDiff, isScrolling;
            function handleTouchStart (e) {
                if (isMoved || isTouched) return;
                // e.preventDefault();
                isTouched = true;
                touchStartX = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
                touchStartY = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
                touchStartTime = (new Date()).getTime();
                percentage = 0;
                allowItemClick = true;
                isScrolling = undefined;
                startTranslate = currentTranslate = p.monthsTranslate;
            }
            function handleTouchMove (e) {
                if (!isTouched) return;

                touchCurrentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
                touchCurrentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
                if (typeof isScrolling === 'undefined') {
                    isScrolling = !!(isScrolling || Math.abs(touchCurrentY - touchStartY) > Math.abs(touchCurrentX - touchStartX));
                }
                if (p.isH && isScrolling) {
                    isTouched = false;
                    return;
                }
                e.preventDefault();
                if (p.animating) {
                    isTouched = false;
                    return;
                }
                allowItemClick = false;
                if (!isMoved) {
                    // First move
                    isMoved = true;
                    wrapperWidth = p.wrapper[0].offsetWidth;
                    wrapperHeight = p.wrapper[0].offsetHeight;
                    p.wrapper.transition(0);
                }
                e.preventDefault();

                touchesDiff = p.isH ? touchCurrentX - touchStartX : touchCurrentY - touchStartY;
                percentage = touchesDiff/(p.isH ? wrapperWidth : wrapperHeight);
                currentTranslate = (p.monthsTranslate * inverter + percentage) * 100;

                // Transform wrapper
                p.wrapper.transform('translate3d(' + (p.isH ? currentTranslate : 0) + '%, ' + (p.isH ? 0 : currentTranslate) + '%, 0)');

            }
            function handleTouchEnd (e) {
                if (!isTouched || !isMoved) {
                    isTouched = isMoved = false;
                    return;
                }
                isTouched = isMoved = false;

                touchEndTime = new Date().getTime();
                if (touchEndTime - touchStartTime < 300) {
                    if (Math.abs(touchesDiff) < 10) {
                        p.resetMonth();
                    }
                    else if (touchesDiff >= 10) {
                        if (rtl) p.nextMonth();
                        else p.prevMonth();
                    }
                    else {
                        if (rtl) p.prevMonth();
                        else p.nextMonth();
                    }
                }
                else {
                    if (percentage <= -0.5) {
                        if (rtl) p.prevMonth();
                        else p.nextMonth();
                    }
                    else if (percentage >= 0.5) {
                        if (rtl) p.nextMonth();
                        else p.prevMonth();
                    }
                    else {
                        p.resetMonth();
                    }
                }

                // Allow click
                setTimeout(function () {
                    allowItemClick = true;
                }, 100);
            }

            function handleDayClick(e) {
                if (!allowItemClick) return;
                var day = $(e.target).parents('.picker-calendar-day');
                if (day.length === 0 && $(e.target).hasClass('picker-calendar-day')) {
                    day = $(e.target);
                }
                if (day.length === 0) return;
                if (day.hasClass('picker-calendar-day-selected') && !p.params.multiple) return;
                if (day.hasClass('picker-calendar-day-disabled')) return;
                if (day.hasClass('picker-calendar-day-next')) p.nextMonth();
                if (day.hasClass('picker-calendar-day-prev')) p.prevMonth();
                var dateYear = day.attr('data-year');
                var dateMonth = day.attr('data-month');
                var dateDay = day.attr('data-day');
                if (p.params.onDayClick) {
                    p.params.onDayClick(p, day[0], dateYear, dateMonth, dateDay);
                }
                p.addValue(new Date(dateYear, dateMonth, dateDay).getTime());
                if (p.params.closeOnSelect) p.close();
            }

            p.container.find('.picker-calendar-prev-month').on('click', p.prevMonth);
            p.container.find('.picker-calendar-next-month').on('click', p.nextMonth);
            p.container.find('.picker-calendar-prev-year').on('click', p.prevYear);
            p.container.find('.picker-calendar-next-year').on('click', p.nextYear);

            /**
             * 处理选择年份时的手势操作事件
             * 
             * Start - edit by JSoon
             */
            function handleYearTouchStart (e) {
                if (isMoved || isTouched) return;
                // e.preventDefault();
                isTouched = true;
                touchStartX = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
                touchStartY = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
                touchStartTime = (new Date()).getTime();
                percentage = 0;
                allowItemClick = true;
                isScrolling = undefined;
                startTranslate = currentTranslate = p.yearsTranslate;
            }

            function handleYearTouchMove (e) {
                if (!isTouched) return;

                touchCurrentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
                touchCurrentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
                if (typeof isScrolling === 'undefined') {
                    isScrolling = !!(isScrolling || Math.abs(touchCurrentY - touchStartY) > Math.abs(touchCurrentX - touchStartX));
                }
                if (p.isH && isScrolling) {
                    isTouched = false;
                    return;
                }
                e.preventDefault();
                if (p.animating) {
                    isTouched = false;
                    return;
                }
                allowItemClick = false;
                if (!isMoved) {
                    // First move
                    isMoved = true;
                    wrapperWidth = p.yearsPickerWrapper[0].offsetWidth;
                    wrapperHeight = p.yearsPickerWrapper[0].offsetHeight;
                    p.yearsPickerWrapper.transition(0);
                }
                e.preventDefault();

                touchesDiff = p.isH ? touchCurrentX - touchStartX : touchCurrentY - touchStartY;
                percentage = touchesDiff/(p.isH ? wrapperWidth : wrapperHeight);
                currentTranslate = (p.yearsTranslate * inverter + percentage) * 100;

                // Transform wrapper
                p.yearsPickerWrapper.transform('translate3d(' + (p.isH ? currentTranslate : 0) + '%, ' + (p.isH ? 0 : currentTranslate) + '%, 0)');

            }

            function handleYearTouchEnd (e) {
                if (!isTouched || !isMoved) {
                    isTouched = isMoved = false;
                    return;
                }
                isTouched = isMoved = false;

                touchEndTime = new Date().getTime();
                if (touchEndTime - touchStartTime < 300) {
                    if (Math.abs(touchesDiff) < 10) {
                        p.resetYearsGroup();
                    }
                    else if (touchesDiff >= 10) {
                        if (rtl) p.nextYearsGroup();
                        else p.prevYearsGroup();
                    }
                    else {
                        if (rtl) p.prevYearsGroup();
                        else p.nextYearsGroup();
                    }
                }
                else {
                    if (percentage <= -0.5) {
                        if (rtl) p.prevYearsGroup();
                        else p.nextYearsGroup();
                    }
                    else if (percentage >= 0.5) {
                        if (rtl) p.nextYearsGroup();
                        else p.prevYearsGroup();
                    }
                    else {
                        p.resetYearsGroup();
                    }
                }

                // Allow click
                setTimeout(function () {
                    allowItemClick = true;
                }, 100);
            }

            function handleYearSelector() {
                var curYear = $(this).text(),
                    yearsPicker = p.container.find('.picker-calendar-years-picker');
                yearsPicker.show().transform('translate3d(0, 0, 0)');
                p.updateSelectedInPickers();
                yearsPicker.on('click', '.picker-calendar-year-unit', p.pickYear);
            }

            function handleMonthSelector() {
                var monthsPicker = p.container.find('.picker-calendar-months-picker');
                monthsPicker.show().transform('translate3d(0, 0, 0)');
                p.updateSelectedInPickers();
                monthsPicker.on('click', '.picker-calendar-month-unit', p.pickMonth);
            }

            // 选择年份
            p.container.find('.current-year-value').on('click', handleYearSelector);

            // 选择月份
            p.container.find('.current-month-value').on('click', handleMonthSelector); 
            /**
             * End - edit by JSoon
             */

            p.wrapper.on('click', handleDayClick);
            if (p.params.touchMove) {
                /**
                 * 给年份选择器绑定手势操作事件
                 * 
                 * Start - edit by JSoon
                 */
                p.yearsPickerWrapper.on($.touchEvents.start, handleYearTouchStart);
                p.yearsPickerWrapper.on($.touchEvents.move, handleYearTouchMove);
                p.yearsPickerWrapper.on($.touchEvents.end, handleYearTouchEnd);
                /**
                 * Start - edit by JSoon
                 */

                p.wrapper.on($.touchEvents.start, handleTouchStart);
                p.wrapper.on($.touchEvents.move, handleTouchMove);
                p.wrapper.on($.touchEvents.end, handleTouchEnd);
            }

            p.container[0].f7DestroyCalendarEvents = function () {
                p.container.find('.picker-calendar-prev-month').off('click', p.prevMonth);
                p.container.find('.picker-calendar-next-month').off('click', p.nextMonth);
                p.container.find('.picker-calendar-prev-year').off('click', p.prevYear);
                p.container.find('.picker-calendar-next-year').off('click', p.nextYear);
                p.wrapper.off('click', handleDayClick);
                if (p.params.touchMove) {
                    p.wrapper.off($.touchEvents.start, handleTouchStart);
                    p.wrapper.off($.touchEvents.move, handleTouchMove);
                    p.wrapper.off($.touchEvents.end, handleTouchEnd);
                }
            };


        };
        p.destroyCalendarEvents = function (colContainer) {
            if ('f7DestroyCalendarEvents' in p.container[0]) p.container[0].f7DestroyCalendarEvents();
        };

        // Calendar Methods
        
        /**
         * 1. 生成年份和月份选择器DOM结构
         * 2. 年份选择和月份选择的pick事件函数
         * 3. 年份选择手势操作结束后，更新年分组DOM结构
         *
         * Start - edit by JSoon
         */
        p.yearsGroupHTML = function(date, offset) {
            date = new Date(date);
            var curYear = date.getFullYear(), // 日历上的当前年份
                trueYear = new Date().getFullYear(), // 当前真实年份
                yearNum = 25, // 年份面板年份总数量
                firstYear = curYear - Math.floor(yearNum/2), // 年份面板第一格年份
                yearsHTML = '';
            if (offset === 'next') {
                firstYear = firstYear + yearNum;
            }
            if (offset === 'prev') {
                firstYear = firstYear - yearNum;
            }
            for (var i = 0; i < 5; i += 1) {
                var rowHTML = '';
                var row = i;
                rowHTML += '<div class="picker-calendar-row">';
                for (var j = 0; j < 5; j += 1) {
                    if (firstYear === trueYear) {
                        rowHTML += '<div class="picker-calendar-year-unit current-calendar-year-unit" data-year="'+ firstYear +'"><span>' + firstYear + '</span></div>';
                    } else if (firstYear === curYear) {
                        rowHTML += '<div class="picker-calendar-year-unit picker-calendar-year-unit-selected" data-year="'+ firstYear +'"><span>' + firstYear + '</span></div>';
                    } else {
                        rowHTML += '<div class="picker-calendar-year-unit" data-year="'+ firstYear +'"><span>' + firstYear + '</span></div>';
                    }
                    firstYear += 1;
                }
                rowHTML += '</div>';
                yearsHTML += rowHTML;
            }
            yearsHTML = '<div class="picker-calendar-years-group">' + yearsHTML + '</div>';
            return yearsHTML;
        };

        p.pickYear = function() {
            var year = $(this).text(),
                curYear = p.wrapper.find('.picker-calendar-month-current').attr('data-year');
            p.yearsPickerWrapper.find('.picker-calendar-year-unit').removeClass('picker-calendar-year-unit-selected');
            $(this).addClass('picker-calendar-year-unit-selected');
            if (curYear !== year) {
                p.setYearMonth(year);
                p.container.find('.picker-calendar-years-picker').hide().transform('translate3d(0, 100%, 0)');
            } else {
                p.container.find('.picker-calendar-years-picker').transform('translate3d(0, 100%, 0)');
            }
        };

        p.onYearsChangeEnd = function (dir) {
            p.animating = false;
            var nextYearsHTML, prevYearsHTML, newCurFirstYear;
            var yearNum = p.yearsPickerWrapper.children('.picker-calendar-years-next').find('.picker-calendar-year-unit').length;
            if (dir === 'next') {
                var newCurFirstYear = parseInt(p.yearsPickerWrapper.children('.picker-calendar-years-next').find('.picker-calendar-year-unit').eq(Math.floor(yearNum/2)).text());
                nextYearsHTML = p.yearsGroupHTML(new Date(newCurFirstYear, p.currentMonth), 'next');
                p.yearsPickerWrapper.append(nextYearsHTML);
                p.yearsPickerWrapper.children().first().remove();
                p.yearsGroups = p.container.find('.picker-calendar-years-group');
            }
            if (dir === 'prev') {
                var newCurFirstYear = parseInt(p.yearsPickerWrapper.children('.picker-calendar-years-prev').find('.picker-calendar-year-unit').eq(Math.floor(yearNum/2)).text());
                prevYearsHTML = p.yearsGroupHTML(new Date(newCurFirstYear, p.currentMonth), 'prev');
                p.yearsPickerWrapper.prepend(prevYearsHTML);
                p.yearsPickerWrapper.children().last().remove();
                p.yearsGroups = p.container.find('.picker-calendar-years-group');
            }
            p.setYearsTranslate(p.yearsTranslate);
        };

        p.monthsGroupHTML = function(date) {
            date = new Date(date);
            var curMonth = date.getMonth() + 1, // 日历上的当前月份
                trueMonth = new Date().getMonth() + 1, // 当前真实月份
                monthNum = 12, // 月份面板月份总数量
                firstMonth = 1,
                monthsHTML = '';
            for (var i = 0; i < 3; i += 1) {
                var rowHTML = '';
                var row = i;
                rowHTML += '<div class="picker-calendar-row">';
                for (var j = 0; j < 4; j += 1) {
                    if (firstMonth === trueMonth) {
                        rowHTML += '<div class="picker-calendar-month-unit current-calendar-month-unit" data-month="'+ (firstMonth-1) +'"><span>' + p.params.monthNames[firstMonth-1] + '</span></div>';
                    } else if (firstMonth === curMonth) {
                        rowHTML += '<div class="picker-calendar-month-unit picker-calendar-month-selected" data-month="'+ (firstMonth-1) +'"><span>' + p.params.monthNames[firstMonth-1] + '</span></div>';
                    } else {
                        rowHTML += '<div class="picker-calendar-month-unit" data-month="'+ (firstMonth-1) +'"><span>' + p.params.monthNames[firstMonth-1] + '</span></div>';
                    }
                    firstMonth += 1;
                }
                rowHTML += '</div>';
                monthsHTML += rowHTML;
            }
            monthsHTML = '<div class="picker-calendar-months-group">' + monthsHTML + '</div>';
            return monthsHTML;
        };

        p.pickMonth = function() {
            var month = $(this).attr('data-month'),
                curYear = p.wrapper.find('.picker-calendar-month-current').attr('data-year'),
                curMonth = p.wrapper.find('.picker-calendar-month-current').attr('data-month');
            p.monthsPickerWrapper.find('.picker-calendar-month-unit').removeClass('picker-calendar-month-unit-selected');
            $(this).addClass('picker-calendar-month-unit-selected');
            if (curMonth !== month) {
                p.setYearMonth(curYear, month);
                p.container.find('.picker-calendar-months-picker').hide().transform('translate3d(0, 100%, 0)');
            } else {
                p.container.find('.picker-calendar-months-picker').transform('translate3d(0, 100%, 0)');
            }
        };
        /**
         * End - edit by JSoon
         */ 
        
        p.daysInMonth = function (date) {
            var d = new Date(date);
            return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        };
        p.monthHTML = function (date, offset) {
            date = new Date(date);
            var year = date.getFullYear(),
                month = date.getMonth(),
                day = date.getDate();
            if (offset === 'next') {
                if (month === 11) date = new Date(year + 1, 0);
                else date = new Date(year, month + 1, 1);
            }
            if (offset === 'prev') {
                if (month === 0) date = new Date(year - 1, 11);
                else date = new Date(year, month - 1, 1);
            }
            if (offset === 'next' || offset === 'prev') {
                month = date.getMonth();
                year = date.getFullYear();
            }
            var daysInPrevMonth = p.daysInMonth(new Date(date.getFullYear(), date.getMonth()).getTime() - 10 * 24 * 60 * 60 * 1000),
                daysInMonth = p.daysInMonth(date),
                firstDayOfMonthIndex = new Date(date.getFullYear(), date.getMonth()).getDay();
            if (firstDayOfMonthIndex === 0) firstDayOfMonthIndex = 7;

            var dayDate, currentValues = [], i, j,
                rows = 6, cols = 7,
                monthHTML = '',
                dayIndex = 0 + (p.params.firstDay - 1),
                today = new Date().setHours(0,0,0,0),
                minDate = p.params.minDate ? new Date(p.params.minDate).getTime() : null,
                maxDate = p.params.maxDate ? new Date(p.params.maxDate).getTime() : null;

            if (p.value && p.value.length) {
                for (i = 0; i < p.value.length; i++) {
                    currentValues.push(new Date(p.value[i]).setHours(0,0,0,0));
                }
            }

            for (i = 1; i <= rows; i++) {
                var rowHTML = '';
                var row = i;
                for (j = 1; j <= cols; j++) {
                    var col = j;
                    dayIndex ++;
                    var dayNumber = dayIndex - firstDayOfMonthIndex;
                    var addClass = '';
                    if (dayNumber < 0) {
                        dayNumber = daysInPrevMonth + dayNumber + 1;
                        addClass += ' picker-calendar-day-prev';
                        dayDate = new Date(month - 1 < 0 ? year - 1 : year, month - 1 < 0 ? 11 : month - 1, dayNumber).getTime();
                    }
                    else {
                        dayNumber = dayNumber + 1;
                        if (dayNumber > daysInMonth) {
                            dayNumber = dayNumber - daysInMonth;
                            addClass += ' picker-calendar-day-next';
                            dayDate = new Date(month + 1 > 11 ? year + 1 : year, month + 1 > 11 ? 0 : month + 1, dayNumber).getTime();
                        }
                        else {
                            dayDate = new Date(year, month, dayNumber).getTime();
                        }
                    }
                    // Today
                    if (dayDate === today) addClass += ' picker-calendar-day-today';
                    // Selected
                    if (currentValues.indexOf(dayDate) >= 0) addClass += ' picker-calendar-day-selected';
                    // Weekend
                    if (p.params.weekendDays.indexOf(col - 1) >= 0) {
                        addClass += ' picker-calendar-day-weekend';
                    }
                    // Disabled
                    if ((minDate && dayDate < minDate) || (maxDate && dayDate > maxDate)) {
                        addClass += ' picker-calendar-day-disabled';
                    }

                    dayDate = new Date(dayDate);
                    var dayYear = dayDate.getFullYear();
                    var dayMonth = dayDate.getMonth();
                    rowHTML += '<div data-year="' + dayYear + '" data-month="' + dayMonth + '" data-day="' + dayNumber + '" class="picker-calendar-day' + (addClass) + '" data-date="' + (dayYear + '-' + dayMonth + '-' + dayNumber) + '"><span>'+dayNumber+'</span></div>';
                }
                monthHTML += '<div class="picker-calendar-row">' + rowHTML + '</div>';
            }
            monthHTML = '<div class="picker-calendar-month" data-year="' + year + '" data-month="' + month + '">' + monthHTML + '</div>';
            return monthHTML;
        };
        p.animating = false;
        p.updateCurrentMonthYear = function (dir) {
            if (typeof dir === 'undefined') {
                p.currentMonth = parseInt(p.months.eq(1).attr('data-month'), 10);
                p.currentYear = parseInt(p.months.eq(1).attr('data-year'), 10);
            }
            else {
                p.currentMonth = parseInt(p.months.eq(dir === 'next' ? (p.months.length - 1) : 0).attr('data-month'), 10);
                p.currentYear = parseInt(p.months.eq(dir === 'next' ? (p.months.length - 1) : 0).attr('data-year'), 10);
            }
            p.container.find('.current-month-value').text(p.params.monthNames[p.currentMonth]);
            p.container.find('.current-year-value').text(p.currentYear);

        };
        p.onMonthChangeStart = function (dir) {
            p.updateCurrentMonthYear(dir);
            p.months.removeClass('picker-calendar-month-current picker-calendar-month-prev picker-calendar-month-next');
            var currentIndex = dir === 'next' ? p.months.length - 1 : 0;

            p.months.eq(currentIndex).addClass('picker-calendar-month-current');
            p.months.eq(dir === 'next' ? currentIndex - 1 : currentIndex + 1).addClass(dir === 'next' ? 'picker-calendar-month-prev' : 'picker-calendar-month-next');

            if (p.params.onMonthYearChangeStart) {
                p.params.onMonthYearChangeStart(p, p.currentYear, p.currentMonth);
            }
        };
        p.onMonthChangeEnd = function (dir, rebuildBoth) {
            p.animating = false;
            var nextMonthHTML, prevMonthHTML, newMonthHTML;
            p.wrapper.find('.picker-calendar-month:not(.picker-calendar-month-prev):not(.picker-calendar-month-current):not(.picker-calendar-month-next)').remove();

            if (typeof dir === 'undefined') {
                dir = 'next';
                rebuildBoth = true;
            }
            if (!rebuildBoth) {
                newMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), dir);
            }
            else {
                p.wrapper.find('.picker-calendar-month-next, .picker-calendar-month-prev').remove();
                prevMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), 'prev');
                nextMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), 'next');
            }
            if (dir === 'next' || rebuildBoth) {
                p.wrapper.append(newMonthHTML || nextMonthHTML);
            }
            if (dir === 'prev' || rebuildBoth) {
                p.wrapper.prepend(newMonthHTML || prevMonthHTML);
            }
            p.months = p.wrapper.find('.picker-calendar-month');
            p.setMonthsTranslate(p.monthsTranslate);
            if (p.params.onMonthAdd) {
                p.params.onMonthAdd(p, dir === 'next' ? p.months.eq(p.months.length - 1)[0] : p.months.eq(0)[0]);
            }
            if (p.params.onMonthYearChangeEnd) {
                p.params.onMonthYearChangeEnd(p, p.currentYear, p.currentMonth);
            }
            /**
             * 月历面板结束手势操作后，更新年份/月份选择器中的选中高亮状态
             *
             * Start - edit by JSoon
             */
            p.updateSelectedInPickers();
            /**
             * End - edit by JSoon
             */
        };

        /**
         * 1. 更新年份/月份选择器中的选中高亮状态函数
         * 2. 年份选择器过渡动画函数
         * 3. 下一个/上一个/当前年分组手势操作函数
         *
         * Start - edit by JSoon
         */
        p.updateSelectedInPickers = function() {
            var curYear = parseInt(p.wrapper.find('.picker-calendar-month-current').attr('data-year'), 10),
                trueYear = new Date().getFullYear(),
                curMonth = parseInt(p.wrapper.find('.picker-calendar-month-current').attr('data-month'), 10),
                trueMonth = new Date().getMonth(),
                selectedYear = parseInt(p.yearsPickerWrapper.find('.picker-calendar-year-unit-selected').attr('data-year'), 10),
                selectedMonth = parseInt(p.monthsPickerWrapper.find('.picker-calendar-month-unit-selected').attr('data-month'), 10);
            if (selectedYear !== curYear) {
                p.yearsPickerWrapper.find('.picker-calendar-year-unit').removeClass('picker-calendar-year-unit-selected');
                p.yearsPickerWrapper.find('.picker-calendar-year-unit[data-year="' + curYear + '"]').addClass('picker-calendar-year-unit-selected');
            }
            if (selectedMonth !== curMonth) {
                p.monthsPickerWrapper.find('.picker-calendar-month-unit').removeClass('picker-calendar-month-unit-selected');
                p.monthsPickerWrapper.find('.picker-calendar-month-unit[data-month="' + curMonth + '"]').addClass('picker-calendar-month-unit-selected');
            }
            if (trueYear !== curYear) {
                p.monthsPickerWrapper.find('.picker-calendar-month-unit').removeClass('current-calendar-month-unit');
            } else {
                p.monthsPickerWrapper.find('.picker-calendar-month-unit[data-month="' + trueMonth + '"]').addClass('current-calendar-month-unit');
            }
        };

        p.setYearsTranslate = function (translate) {
            translate = translate || p.yearsTranslate || 0;
            if (typeof p.yearsTranslate === 'undefined') p.yearsTranslate = translate;
            p.yearsGroups.removeClass('picker-calendar-years-current picker-calendar-years-prev picker-calendar-years-next');
            var prevYearTranslate = -(translate + 1) * 100 * inverter;
            var currentYearTranslate = -translate * 100 * inverter;
            var nextYearTranslate = -(translate - 1) * 100 * inverter;
            p.yearsGroups.eq(0).transform('translate3d(' + (p.isH ? prevYearTranslate : 0) + '%, ' + (p.isH ? 0 : prevYearTranslate) + '%, 0)').addClass('picker-calendar-years-prev');
            p.yearsGroups.eq(1).transform('translate3d(' + (p.isH ? currentYearTranslate : 0) + '%, ' + (p.isH ? 0 : currentYearTranslate) + '%, 0)').addClass('picker-calendar-years-current');
            p.yearsGroups.eq(2).transform('translate3d(' + (p.isH ? nextYearTranslate : 0) + '%, ' + (p.isH ? 0 : nextYearTranslate) + '%, 0)').addClass('picker-calendar-years-next');
        };

        p.nextYearsGroup = function (transition) {
            if (typeof transition === 'undefined' || typeof transition === 'object') {
                transition = '';
                if (!p.params.animate) transition = 0;
            }
            var transitionEndCallback = p.animating ? false : true;
            p.yearsTranslate --;
            p.animating = true;
            var translate = (p.yearsTranslate * 100) * inverter;
            p.yearsPickerWrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
            if (transitionEndCallback) {
                p.yearsPickerWrapper.transitionEnd(function () {
                    p.onYearsChangeEnd('next');
                });
            }
            if (!p.params.animate) {
                p.onYearsChangeEnd('next');
            }
        };

        p.prevYearsGroup = function (transition) {
            if (typeof transition === 'undefined' || typeof transition === 'object') {
                transition = '';
                if (!p.params.animate) transition = 0;
            }
            var transitionEndCallback = p.animating ? false : true;
            p.yearsTranslate ++;
            p.animating = true;
            var translate = (p.yearsTranslate * 100) * inverter;
            p.yearsPickerWrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
            if (transitionEndCallback) {
                p.yearsPickerWrapper.transitionEnd(function () {
                    p.onYearsChangeEnd('prev');
                });
            }
            if (!p.params.animate) {
                p.onYearsChangeEnd('prev');
            }
        };

        p.resetYearsGroup = function (transition) {
            if (typeof transition === 'undefined') transition = '';
            var translate = (p.yearsTranslate * 100) * inverter;
            p.yearsPickerWrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
        };
        /**
         * End - edit by JSoon
         */

        p.setMonthsTranslate = function (translate) {
            translate = translate || p.monthsTranslate || 0;
            if (typeof p.monthsTranslate === 'undefined') p.monthsTranslate = translate;
            p.months.removeClass('picker-calendar-month-current picker-calendar-month-prev picker-calendar-month-next');
            var prevMonthTranslate = -(translate + 1) * 100 * inverter;
            var currentMonthTranslate = -translate * 100 * inverter;
            var nextMonthTranslate = -(translate - 1) * 100 * inverter;
            p.months.eq(0).transform('translate3d(' + (p.isH ? prevMonthTranslate : 0) + '%, ' + (p.isH ? 0 : prevMonthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
            p.months.eq(1).transform('translate3d(' + (p.isH ? currentMonthTranslate : 0) + '%, ' + (p.isH ? 0 : currentMonthTranslate) + '%, 0)').addClass('picker-calendar-month-current');
            p.months.eq(2).transform('translate3d(' + (p.isH ? nextMonthTranslate : 0) + '%, ' + (p.isH ? 0 : nextMonthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
        };
        p.nextMonth = function (transition) {
            if (typeof transition === 'undefined' || typeof transition === 'object') {
                transition = '';
                if (!p.params.animate) transition = 0;
            }
            var nextMonth = parseInt(p.months.eq(p.months.length - 1).attr('data-month'), 10);
            var nextYear = parseInt(p.months.eq(p.months.length - 1).attr('data-year'), 10);
            var nextDate = new Date(nextYear, nextMonth);
            var nextDateTime = nextDate.getTime();
            var transitionEndCallback = p.animating ? false : true;
            if (p.params.maxDate) {
                if (nextDateTime > new Date(p.params.maxDate).getTime()) {
                    return p.resetMonth();
                }
            }
            p.monthsTranslate --;
            if (nextMonth === p.currentMonth) {
                var nextMonthTranslate = -(p.monthsTranslate) * 100 * inverter;
                var nextMonthHTML = $(p.monthHTML(nextDateTime, 'next')).transform('translate3d(' + (p.isH ? nextMonthTranslate : 0) + '%, ' + (p.isH ? 0 : nextMonthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
                p.wrapper.append(nextMonthHTML[0]);
                p.months = p.wrapper.find('.picker-calendar-month');
                if (p.params.onMonthAdd) {
                    p.params.onMonthAdd(p, p.months.eq(p.months.length - 1)[0]);
                }
            }
            p.animating = true;
            p.onMonthChangeStart('next');
            var translate = (p.monthsTranslate * 100) * inverter;

            p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
            if (transitionEndCallback) {
                p.wrapper.transitionEnd(function () {
                    p.onMonthChangeEnd('next');
                });
            }
            if (!p.params.animate) {
                p.onMonthChangeEnd('next');
            }
        };
        p.prevMonth = function (transition) {
            if (typeof transition === 'undefined' || typeof transition === 'object') {
                transition = '';
                if (!p.params.animate) transition = 0;
            }
            var prevMonth = parseInt(p.months.eq(0).attr('data-month'), 10);
            var prevYear = parseInt(p.months.eq(0).attr('data-year'), 10);
            var prevDate = new Date(prevYear, prevMonth + 1, -1);
            var prevDateTime = prevDate.getTime();
            var transitionEndCallback = p.animating ? false : true;
            if (p.params.minDate) {
                if (prevDateTime < new Date(p.params.minDate).getTime()) {
                    return p.resetMonth();
                }
            }
            p.monthsTranslate ++;
            if (prevMonth === p.currentMonth) {
                var prevMonthTranslate = -(p.monthsTranslate) * 100 * inverter;
                var prevMonthHTML = $(p.monthHTML(prevDateTime, 'prev')).transform('translate3d(' + (p.isH ? prevMonthTranslate : 0) + '%, ' + (p.isH ? 0 : prevMonthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
                p.wrapper.prepend(prevMonthHTML[0]);
                p.months = p.wrapper.find('.picker-calendar-month');
                if (p.params.onMonthAdd) {
                    p.params.onMonthAdd(p, p.months.eq(0)[0]);
                }
            }
            p.animating = true;
            p.onMonthChangeStart('prev');
            var translate = (p.monthsTranslate * 100) * inverter;
            p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
            if (transitionEndCallback) {
                p.wrapper.transitionEnd(function () {
                    p.onMonthChangeEnd('prev');
                });
            }
            if (!p.params.animate) {
                p.onMonthChangeEnd('prev');
            }
        };
        p.resetMonth = function (transition) {
            if (typeof transition === 'undefined') transition = '';
            var translate = (p.monthsTranslate * 100) * inverter;
            p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
        };
        p.setYearMonth = function (year, month, transition) {
            if (typeof year === 'undefined') year = p.currentYear;
            if (typeof month === 'undefined') month = p.currentMonth;
            if (typeof transition === 'undefined' || typeof transition === 'object') {
                transition = '';
                if (!p.params.animate) transition = 0;
            }
            var targetDate;
            if (year < p.currentYear) {
                targetDate = new Date(year, month + 1, -1).getTime();
            } else {
                targetDate = new Date(year, month).getTime();
            }
            if (p.params.maxDate && targetDate > new Date(p.params.maxDate).getTime()) {
                return false;
            }
            if (p.params.minDate && targetDate < new Date(p.params.minDate).getTime()) {
                return false;
            }
            var currentDate = new Date(p.currentYear, p.currentMonth).getTime();
            var dir = targetDate > currentDate ? 'next' : 'prev';
            var newMonthHTML = p.monthHTML(new Date(year, month));
            p.monthsTranslate = p.monthsTranslate || 0;
            var prevTranslate = p.monthsTranslate;
            var monthTranslate, wrapperTranslate;
            var transitionEndCallback = p.animating ? false : true;
            if (targetDate > currentDate) {
                // To next
                p.monthsTranslate --;
                if (!p.animating) p.months.eq(p.months.length - 1).remove();
                p.wrapper.append(newMonthHTML);
                p.months = p.wrapper.find('.picker-calendar-month');
                monthTranslate = -(prevTranslate - 1) * 100 * inverter;
                p.months.eq(p.months.length - 1).transform('translate3d(' + (p.isH ? monthTranslate : 0) + '%, ' + (p.isH ? 0 : monthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
            }
            else {
                // To prev
                p.monthsTranslate ++;
                if (!p.animating) p.months.eq(0).remove();
                p.wrapper.prepend(newMonthHTML);
                p.months = p.wrapper.find('.picker-calendar-month');
                monthTranslate = -(prevTranslate + 1) * 100 * inverter;
                p.months.eq(0).transform('translate3d(' + (p.isH ? monthTranslate : 0) + '%, ' + (p.isH ? 0 : monthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
            }
            if (p.params.onMonthAdd) {
                p.params.onMonthAdd(p, dir === 'next' ? p.months.eq(p.months.length - 1)[0] : p.months.eq(0)[0]);
            }
            p.animating = true;
            p.onMonthChangeStart(dir);
            wrapperTranslate = (p.monthsTranslate * 100) * inverter;
            p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? wrapperTranslate : 0) + '%, ' + (p.isH ? 0 : wrapperTranslate) + '%, 0)');
            if (transitionEndCallback) {
                p.wrapper.transitionEnd(function () {
                    p.onMonthChangeEnd(dir, true);
                });
            }
            if (!p.params.animate) {
                p.onMonthChangeEnd(dir);
            }
        };
        p.nextYear = function () {
            p.setYearMonth(p.currentYear + 1);
        };
        p.prevYear = function () {
            p.setYearMonth(p.currentYear - 1);
        };


        // HTML Layout
        p.layout = function () {
            var pickerHTML = '';
            var pickerClass = '';
            var i;

            var layoutDate = p.value && p.value.length ? p.value[0] : new Date().setHours(0,0,0,0);
            /**
             * 生成年份组和月份组DOM
             * 
             * Start - edit by JSoon
             */
            var prevYearsHTML = p.yearsGroupHTML(layoutDate, 'prev');
            var currentYearsHTML = p.yearsGroupHTML(layoutDate);
            var nextYearsHTML = p.yearsGroupHTML(layoutDate, 'next');
            var yearsGroupHTML = '<div class="picker-calendar-years-picker"><div class="picker-calendar-years-picker-wrapper">' + (prevYearsHTML + currentYearsHTML + nextYearsHTML) + '</div></div>';

            var monthsGroupHTML = '<div class="picker-calendar-months-picker"><div class="picker-calendar-months-picker-wrapper">' + p.monthsGroupHTML(layoutDate) + '</div></div>';
            /**
             * End - edit by JSoon
             */
            var prevMonthHTML = p.monthHTML(layoutDate, 'prev');
            var currentMonthHTML = p.monthHTML(layoutDate);
            var nextMonthHTML = p.monthHTML(layoutDate, 'next');
            var monthsHTML = '<div class="picker-calendar-months"><div class="picker-calendar-months-wrapper">' + (prevMonthHTML + currentMonthHTML + nextMonthHTML) + '</div></div>';
            // Week days header
            var weekHeaderHTML = '';
            if (p.params.weekHeader) {
                for (i = 0; i < 7; i++) {
                    var weekDayIndex = (i + p.params.firstDay > 6) ? (i - 7 + p.params.firstDay) : (i + p.params.firstDay);
                    var dayName = p.params.dayNamesShort[weekDayIndex];
                    weekHeaderHTML += '<div class="picker-calendar-week-day ' + ((p.params.weekendDays.indexOf(weekDayIndex) >= 0) ? 'picker-calendar-week-day-weekend' : '') + '"> ' + dayName + '</div>';

                }
                weekHeaderHTML = '<div class="picker-calendar-week-days">' + weekHeaderHTML + '</div>';
            }
            pickerClass = 'picker-modal picker-calendar ' + (p.params.cssClass || '');
            var toolbarHTML = p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '';
            if (p.params.toolbar) {
                toolbarHTML = p.params.toolbarTemplate
                    .replace(/{{closeText}}/g, p.params.toolbarCloseText)
                    .replace(/{{monthPicker}}/g, (p.params.monthPicker ? p.params.monthPickerTemplate : ''))
                    .replace(/{{yearPicker}}/g, (p.params.yearPicker ? p.params.yearPickerTemplate : ''));
            }

            /**
             * 将年份组/月份组DOM添加document中
             * 
             * Start - edit by JSoon
             */
            pickerHTML =
                '<div class="' + (pickerClass) + '">' +
                toolbarHTML +
                '<div class="picker-modal-inner">' +
                weekHeaderHTML +
                monthsHTML +
                '</div>' +
                monthsGroupHTML +
                yearsGroupHTML +
                '</div>';
            /**
             * End - edit by JSoon
             */

            p.pickerHTML = pickerHTML;
        };

        // Input Events
        function openOnInput(e) {
            e.preventDefault();
            // 安卓微信webviewreadonly的input依然弹出软键盘问题修复
            if ($.device.isWeixin && $.device.android && p.params.inputReadOnly) {
                /*jshint validthis:true */
                this.focus();
                this.blur();
            }
            if (p.opened) return;
            p.open();
            if (p.params.scrollToInput) {
                var pageContent = p.input.parents('.content');
                if (pageContent.length === 0) return;

                var paddingTop = parseInt(pageContent.css('padding-top'), 10),
                    paddingBottom = parseInt(pageContent.css('padding-bottom'), 10),
                    pageHeight = pageContent[0].offsetHeight - paddingTop - p.container.height(),
                    pageScrollHeight = pageContent[0].scrollHeight - paddingTop - p.container.height(),
                    newPaddingBottom;

                var inputTop = p.input.offset().top - paddingTop + p.input[0].offsetHeight;
                if (inputTop > pageHeight) {
                    var scrollTop = pageContent.scrollTop() + inputTop - pageHeight;
                    if (scrollTop + pageHeight > pageScrollHeight) {
                        newPaddingBottom = scrollTop + pageHeight - pageScrollHeight + paddingBottom;
                        if (pageHeight === pageScrollHeight) {
                            newPaddingBottom = p.container.height();
                        }
                        pageContent.css({'padding-bottom': (newPaddingBottom) + 'px'});
                    }
                    pageContent.scrollTop(scrollTop, 300);
                }
            }
        }
        function closeOnHTMLClick(e) {
            if (p.input && p.input.length > 0) {
                if (e.target !== p.input[0] && $(e.target).parents('.picker-modal').length === 0) p.close();
            }
            else {
                if ($(e.target).parents('.picker-modal').length === 0) p.close();
            }
        }

        if (p.params.input) {
            p.input = $(p.params.input);
            if (p.input.length > 0) {
                if (p.params.inputReadOnly) p.input.prop('readOnly', true);
                if (!p.inline) {
                    p.input.on('click', openOnInput);
                }
                /**
                 * 修复[#308](https://github.com/sdc-alibaba/SUI-Mobile/issues/308)
                 * 场景：内联页面中存在日历控件的input
                 * 问题：因未在关闭时unbind click openOnInput事件导致多次调用p.open()而生成多个日历
                 * 
                 * Start - edit by JSoon
                 */
                $(document).on('beforePageSwitch', function() {
                    p.input.off('click', openOnInput);
                    $(document).off('beforePageSwitch');
                });
                /**
                 * End - edit by JSoon
                 */
            }

        }

        if (!p.inline) $('html').on('click', closeOnHTMLClick);

        // Open
        function onPickerClose() {
            p.opened = false;
            if (p.input && p.input.length > 0) p.input.parents('.content').css({'padding-bottom': ''});
            if (p.params.onClose) p.params.onClose(p);

            // Destroy events
            p.destroyCalendarEvents();
        }

        p.opened = false;
        p.open = function () {
            var updateValue = false;
            if (!p.opened) {
                // Set date value
                if (!p.value) {
                    if (p.params.value) {
                        p.value = p.params.value;
                        updateValue = true;
                    }
                }

                // Layout
                p.layout();

                // Append
                if (p.inline) {
                    p.container = $(p.pickerHTML);
                    p.container.addClass('picker-modal-inline');
                    $(p.params.container).append(p.container);
                }
                else {
                    p.container = $($.pickerModal(p.pickerHTML));
                    $(p.container)
                        .on('close', function () {
                            onPickerClose();
                        });
                }

                // Store calendar instance
                p.container[0].f7Calendar = p;
                p.wrapper = p.container.find('.picker-calendar-months-wrapper');

                /**
                 * 获取全局年份组及其wrapper的zepto对象
                 * 获取全局月份组wrapper的zepto对象
                 * 
                 * Start - edit by JSoon
                 */
                p.yearsPickerWrapper = p.container.find('.picker-calendar-years-picker-wrapper');
                p.yearsGroups = p.yearsPickerWrapper.find('.picker-calendar-years-group');

                p.monthsPickerWrapper = p.container.find('.picker-calendar-months-picker-wrapper');
                /**
                 * End - edit by JSoon
                 */

                // Months
                p.months = p.wrapper.find('.picker-calendar-month');

                // Update current month and year
                p.updateCurrentMonthYear();

                // Set initial translate
                /**
                 * 初始化年份组过渡动画位置
                 * 
                 * Start - edit by JSoon
                 */
                p.yearsTranslate = 0;
                p.setYearsTranslate();
                /**
                 * End - edit by JSoon
                 */
                p.monthsTranslate = 0;
                p.setMonthsTranslate();

                // Init events
                p.initCalendarEvents();

                // Update input value
                if (updateValue) p.updateValue();

            }

            // Set flag
            p.opened = true;
            p.initialized = true;
            if (p.params.onMonthAdd) {
                p.months.each(function () {
                    p.params.onMonthAdd(p, this);
                });
            }
            if (p.params.onOpen) p.params.onOpen(p);
        };

        // Close
        p.close = function () {
            if (!p.opened || p.inline) return;
            $.closeModal(p.container);
            return;
        };

        // Destroy
        p.destroy = function () {
            p.close();
            if (p.params.input && p.input.length > 0) {
                p.input.off('click', openOnInput);
            }
            $('html').off('click', closeOnHTMLClick);
        };

        if (p.inline) {
            p.open();
        }

        return p;
    };
    $.fn.calendar = function (params) {
        return this.each(function() {
            var $this = $(this);
            if(!$this[0]) return;
            var p = {};
            if($this[0].tagName.toUpperCase() === "INPUT") {
                p.input = $this;
            } else {
                p.container = $this;
            }
            new Calendar($.extend(p, params));
        });
    };

    $.initCalendar = function(content) {
        var $content = content ? $(content) : $(document.body);
        $content.find("[data-toggle='date']").each(function() {
            $(this).calendar();
        });
    };
}(Zepto);

// jshint ignore: start
+function($){

$.smConfig.rawCitiesData = [
    {
        "name":"北京",
        "sub":[
            {
                "name":"请选择"
            },
            {
                "name":"东城区"
            },
            {
                "name":"西城区"
            },
            {
                "name":"崇文区"
            },
            {
                "name":"宣武区"
            },
            {
                "name":"朝阳区"
            },
            {
                "name":"海淀区"
            },
            {
                "name":"丰台区"
            },
            {
                "name":"石景山区"
            },
            {
                "name":"房山区"
            },
            {
                "name":"通州区"
            },
            {
                "name":"顺义区"
            },
            {
                "name":"昌平区"
            },
            {
                "name":"大兴区"
            },
            {
                "name":"怀柔区"
            },
            {
                "name":"平谷区"
            },
            {
                "name":"门头沟区"
            },
            {
                "name":"密云县"
            },
            {
                "name":"延庆县"
            },
            {
                "name":"其他"
            }
        ],
        "type":0
    },
    {
        "name":"广东",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"广州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"越秀区"
                    },
                    {
                        "name":"荔湾区"
                    },
                    {
                        "name":"海珠区"
                    },
                    {
                        "name":"天河区"
                    },
                    {
                        "name":"白云区"
                    },
                    {
                        "name":"黄埔区"
                    },
                    {
                        "name":"番禺区"
                    },
                    {
                        "name":"花都区"
                    },
                    {
                        "name":"南沙区"
                    },
                    {
                        "name":"萝岗区"
                    },
                    {
                        "name":"增城市"
                    },
                    {
                        "name":"从化市"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"深圳",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"福田区"
                    },
                    {
                        "name":"罗湖区"
                    },
                    {
                        "name":"南山区"
                    },
                    {
                        "name":"宝安区"
                    },
                    {
                        "name":"龙岗区"
                    },
                    {
                        "name":"盐田区"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"珠海",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"香洲区"
                    },
                    {
                        "name":"斗门区"
                    },
                    {
                        "name":"金湾区"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"汕头",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"金平区"
                    },
                    {
                        "name":"濠江区"
                    },
                    {
                        "name":"龙湖区"
                    },
                    {
                        "name":"潮阳区"
                    },
                    {
                        "name":"潮南区"
                    },
                    {
                        "name":"澄海区"
                    },
                    {
                        "name":"南澳县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"韶关",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"浈江区"
                    },
                    {
                        "name":"武江区"
                    },
                    {
                        "name":"曲江区"
                    },
                    {
                        "name":"乐昌市"
                    },
                    {
                        "name":"南雄市"
                    },
                    {
                        "name":"始兴县"
                    },
                    {
                        "name":"仁化县"
                    },
                    {
                        "name":"翁源县"
                    },
                    {
                        "name":"新丰县"
                    },
                    {
                        "name":"乳源瑶族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"佛山",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"禅城区"
                    },
                    {
                        "name":"南海区"
                    },
                    {
                        "name":"顺德区"
                    },
                    {
                        "name":"三水区"
                    },
                    {
                        "name":"高明区"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"江门",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"蓬江区"
                    },
                    {
                        "name":"江海区"
                    },
                    {
                        "name":"新会区"
                    },
                    {
                        "name":"恩平市"
                    },
                    {
                        "name":"台山市"
                    },
                    {
                        "name":"开平市"
                    },
                    {
                        "name":"鹤山市"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"湛江",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"赤坎区"
                    },
                    {
                        "name":"霞山区"
                    },
                    {
                        "name":"坡头区"
                    },
                    {
                        "name":"麻章区"
                    },
                    {
                        "name":"吴川市"
                    },
                    {
                        "name":"廉江市"
                    },
                    {
                        "name":"雷州市"
                    },
                    {
                        "name":"遂溪县"
                    },
                    {
                        "name":"徐闻县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"茂名",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"茂南区"
                    },
                    {
                        "name":"茂港区"
                    },
                    {
                        "name":"化州市"
                    },
                    {
                        "name":"信宜市"
                    },
                    {
                        "name":"高州市"
                    },
                    {
                        "name":"电白县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"肇庆",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"端州区"
                    },
                    {
                        "name":"鼎湖区"
                    },
                    {
                        "name":"高要市"
                    },
                    {
                        "name":"四会市"
                    },
                    {
                        "name":"广宁县"
                    },
                    {
                        "name":"怀集县"
                    },
                    {
                        "name":"封开县"
                    },
                    {
                        "name":"德庆县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"惠州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"惠城区"
                    },
                    {
                        "name":"惠阳区"
                    },
                    {
                        "name":"博罗县"
                    },
                    {
                        "name":"惠东县"
                    },
                    {
                        "name":"龙门县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"梅州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"梅江区"
                    },
                    {
                        "name":"兴宁市"
                    },
                    {
                        "name":"梅县"
                    },
                    {
                        "name":"大埔县"
                    },
                    {
                        "name":"丰顺县"
                    },
                    {
                        "name":"五华县"
                    },
                    {
                        "name":"平远县"
                    },
                    {
                        "name":"蕉岭县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"汕尾",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"城区"
                    },
                    {
                        "name":"陆丰市"
                    },
                    {
                        "name":"海丰县"
                    },
                    {
                        "name":"陆河县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"河源",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"源城区"
                    },
                    {
                        "name":"紫金县"
                    },
                    {
                        "name":"龙川县"
                    },
                    {
                        "name":"连平县"
                    },
                    {
                        "name":"和平县"
                    },
                    {
                        "name":"东源县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"阳江",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"江城区"
                    },
                    {
                        "name":"阳春市"
                    },
                    {
                        "name":"阳西县"
                    },
                    {
                        "name":"阳东县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"清远",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"清城区"
                    },
                    {
                        "name":"英德市"
                    },
                    {
                        "name":"连州市"
                    },
                    {
                        "name":"佛冈县"
                    },
                    {
                        "name":"阳山县"
                    },
                    {
                        "name":"清新县"
                    },
                    {
                        "name":"连山壮族瑶族自治县"
                    },
                    {
                        "name":"连南瑶族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"东莞",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"中山",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"潮州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"湘桥区"
                    },
                    {
                        "name":"潮安县"
                    },
                    {
                        "name":"饶平县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"揭阳",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"榕城区"
                    },
                    {
                        "name":"普宁市"
                    },
                    {
                        "name":"揭东县"
                    },
                    {
                        "name":"揭西县"
                    },
                    {
                        "name":"惠来县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"云浮",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"云城区"
                    },
                    {
                        "name":"罗定市"
                    },
                    {
                        "name":"云安县"
                    },
                    {
                        "name":"新兴县"
                    },
                    {
                        "name":"郁南县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"上海",
        "sub":[
            {
                "name":"请选择"
            },
            {
                "name":"黄浦区"
            },
            {
                "name":"卢湾区"
            },
            {
                "name":"徐汇区"
            },
            {
                "name":"长宁区"
            },
            {
                "name":"静安区"
            },
            {
                "name":"普陀区"
            },
            {
                "name":"闸北区"
            },
            {
                "name":"虹口区"
            },
            {
                "name":"杨浦区"
            },
            {
                "name":"宝山区"
            },
            {
                "name":"闵行区"
            },
            {
                "name":"嘉定区"
            },
            {
                "name":"松江区"
            },
            {
                "name":"金山区"
            },
            {
                "name":"青浦区"
            },
            {
                "name":"南汇区"
            },
            {
                "name":"奉贤区"
            },
            {
                "name":"浦东新区"
            },
            {
                "name":"崇明县"
            },
            {
                "name":"其他"
            }
        ],
        "type":0
    },
    {
        "name":"天津",
        "sub":[
            {
                "name":"请选择"
            },
            {
                "name":"和平区"
            },
            {
                "name":"河东区"
            },
            {
                "name":"河西区"
            },
            {
                "name":"南开区"
            },
            {
                "name":"河北区"
            },
            {
                "name":"红桥区"
            },
            {
                "name":"塘沽区"
            },
            {
                "name":"汉沽区"
            },
            {
                "name":"大港区"
            },
            {
                "name":"东丽区"
            },
            {
                "name":"西青区"
            },
            {
                "name":"北辰区"
            },
            {
                "name":"津南区"
            },
            {
                "name":"武清区"
            },
            {
                "name":"宝坻区"
            },
            {
                "name":"静海县"
            },
            {
                "name":"宁河县"
            },
            {
                "name":"蓟县"
            },
            {
                "name":"其他"
            }
        ],
        "type":0
    },
    {
        "name":"重庆",
        "sub":[
            {
                "name":"请选择"
            },
            {
                "name":"渝中区"
            },
            {
                "name":"大渡口区"
            },
            {
                "name":"江北区"
            },
            {
                "name":"南岸区"
            },
            {
                "name":"北碚区"
            },
            {
                "name":"渝北区"
            },
            {
                "name":"巴南区"
            },
            {
                "name":"长寿区"
            },
            {
                "name":"双桥区"
            },
            {
                "name":"沙坪坝区"
            },
            {
                "name":"万盛区"
            },
            {
                "name":"万州区"
            },
            {
                "name":"涪陵区"
            },
            {
                "name":"黔江区"
            },
            {
                "name":"永川区"
            },
            {
                "name":"合川区"
            },
            {
                "name":"江津区"
            },
            {
                "name":"九龙坡区"
            },
            {
                "name":"南川区"
            },
            {
                "name":"綦江县"
            },
            {
                "name":"潼南县"
            },
            {
                "name":"荣昌县"
            },
            {
                "name":"璧山县"
            },
            {
                "name":"大足县"
            },
            {
                "name":"铜梁县"
            },
            {
                "name":"梁平县"
            },
            {
                "name":"开县"
            },
            {
                "name":"忠县"
            },
            {
                "name":"城口县"
            },
            {
                "name":"垫江县"
            },
            {
                "name":"武隆县"
            },
            {
                "name":"丰都县"
            },
            {
                "name":"奉节县"
            },
            {
                "name":"云阳县"
            },
            {
                "name":"巫溪县"
            },
            {
                "name":"巫山县"
            },
            {
                "name":"石柱土家族自治县"
            },
            {
                "name":"秀山土家族苗族自治县"
            },
            {
                "name":"酉阳土家族苗族自治县"
            },
            {
                "name":"彭水苗族土家族自治县"
            },
            {
                "name":"其他"
            }
        ],
        "type":0
    },
    {
        "name":"辽宁",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"沈阳",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"沈河区"
                    },
                    {
                        "name":"皇姑区"
                    },
                    {
                        "name":"和平区"
                    },
                    {
                        "name":"大东区"
                    },
                    {
                        "name":"铁西区"
                    },
                    {
                        "name":"苏家屯区"
                    },
                    {
                        "name":"东陵区"
                    },
                    {
                        "name":"于洪区"
                    },
                    {
                        "name":"新民市"
                    },
                    {
                        "name":"法库县"
                    },
                    {
                        "name":"辽中县"
                    },
                    {
                        "name":"康平县"
                    },
                    {
                        "name":"新城子区"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"大连",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"西岗区"
                    },
                    {
                        "name":"中山区"
                    },
                    {
                        "name":"沙河口区"
                    },
                    {
                        "name":"甘井子区"
                    },
                    {
                        "name":"旅顺口区"
                    },
                    {
                        "name":"金州区"
                    },
                    {
                        "name":"瓦房店市"
                    },
                    {
                        "name":"普兰店市"
                    },
                    {
                        "name":"庄河市"
                    },
                    {
                        "name":"长海县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"鞍山",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"铁东区"
                    },
                    {
                        "name":"铁西区"
                    },
                    {
                        "name":"立山区"
                    },
                    {
                        "name":"千山区"
                    },
                    {
                        "name":"海城市"
                    },
                    {
                        "name":"台安县"
                    },
                    {
                        "name":"岫岩满族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"抚顺",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"顺城区"
                    },
                    {
                        "name":"新抚区"
                    },
                    {
                        "name":"东洲区"
                    },
                    {
                        "name":"望花区"
                    },
                    {
                        "name":"抚顺县"
                    },
                    {
                        "name":"清原满族自治县"
                    },
                    {
                        "name":"新宾满族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"本溪",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"平山区"
                    },
                    {
                        "name":"明山区"
                    },
                    {
                        "name":"溪湖区"
                    },
                    {
                        "name":"南芬区"
                    },
                    {
                        "name":"本溪满族自治县"
                    },
                    {
                        "name":"桓仁满族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"丹东",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"振兴区"
                    },
                    {
                        "name":"元宝区"
                    },
                    {
                        "name":"振安区"
                    },
                    {
                        "name":"东港市"
                    },
                    {
                        "name":"凤城市"
                    },
                    {
                        "name":"宽甸满族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"锦州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"太和区"
                    },
                    {
                        "name":"古塔区"
                    },
                    {
                        "name":"凌河区"
                    },
                    {
                        "name":"凌海市"
                    },
                    {
                        "name":"黑山县"
                    },
                    {
                        "name":"义县"
                    },
                    {
                        "name":"北宁市"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"营口",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"站前区"
                    },
                    {
                        "name":"西市区"
                    },
                    {
                        "name":"鲅鱼圈区"
                    },
                    {
                        "name":"老边区"
                    },
                    {
                        "name":"大石桥市"
                    },
                    {
                        "name":"盖州市"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"阜新",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"海州区"
                    },
                    {
                        "name":"新邱区"
                    },
                    {
                        "name":"太平区"
                    },
                    {
                        "name":"清河门区"
                    },
                    {
                        "name":"细河区"
                    },
                    {
                        "name":"彰武县"
                    },
                    {
                        "name":"阜新蒙古族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"辽阳",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"白塔区"
                    },
                    {
                        "name":"文圣区"
                    },
                    {
                        "name":"宏伟区"
                    },
                    {
                        "name":"太子河区"
                    },
                    {
                        "name":"弓长岭区"
                    },
                    {
                        "name":"灯塔市"
                    },
                    {
                        "name":"辽阳县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"盘锦",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"双台子区"
                    },
                    {
                        "name":"兴隆台区"
                    },
                    {
                        "name":"盘山县"
                    },
                    {
                        "name":"大洼县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"铁岭",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"银州区"
                    },
                    {
                        "name":"清河区"
                    },
                    {
                        "name":"调兵山市"
                    },
                    {
                        "name":"开原市"
                    },
                    {
                        "name":"铁岭县"
                    },
                    {
                        "name":"昌图县"
                    },
                    {
                        "name":"西丰县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"朝阳",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"双塔区"
                    },
                    {
                        "name":"龙城区"
                    },
                    {
                        "name":"凌源市"
                    },
                    {
                        "name":"北票市"
                    },
                    {
                        "name":"朝阳县"
                    },
                    {
                        "name":"建平县"
                    },
                    {
                        "name":"喀喇沁左翼蒙古族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"葫芦岛",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"龙港区"
                    },
                    {
                        "name":"南票区"
                    },
                    {
                        "name":"连山区"
                    },
                    {
                        "name":"兴城市"
                    },
                    {
                        "name":"绥中县"
                    },
                    {
                        "name":"建昌县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"江苏",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"南京",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"玄武区"
                    },
                    {
                        "name":"白下区"
                    },
                    {
                        "name":"秦淮区"
                    },
                    {
                        "name":"建邺区"
                    },
                    {
                        "name":"鼓楼区"
                    },
                    {
                        "name":"下关区"
                    },
                    {
                        "name":"栖霞区"
                    },
                    {
                        "name":"雨花台区"
                    },
                    {
                        "name":"浦口区"
                    },
                    {
                        "name":"江宁区"
                    },
                    {
                        "name":"六合区"
                    },
                    {
                        "name":"溧水县"
                    },
                    {
                        "name":"高淳县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"苏州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"金阊区"
                    },
                    {
                        "name":"平江区"
                    },
                    {
                        "name":"沧浪区"
                    },
                    {
                        "name":"虎丘区"
                    },
                    {
                        "name":"吴中区"
                    },
                    {
                        "name":"相城区"
                    },
                    {
                        "name":"常熟市"
                    },
                    {
                        "name":"张家港市"
                    },
                    {
                        "name":"昆山市"
                    },
                    {
                        "name":"吴江市"
                    },
                    {
                        "name":"太仓市"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"无锡",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"崇安区"
                    },
                    {
                        "name":"南长区"
                    },
                    {
                        "name":"北塘区"
                    },
                    {
                        "name":"滨湖区"
                    },
                    {
                        "name":"锡山区"
                    },
                    {
                        "name":"惠山区"
                    },
                    {
                        "name":"江阴市"
                    },
                    {
                        "name":"宜兴市"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"常州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"钟楼区"
                    },
                    {
                        "name":"天宁区"
                    },
                    {
                        "name":"戚墅堰区"
                    },
                    {
                        "name":"新北区"
                    },
                    {
                        "name":"武进区"
                    },
                    {
                        "name":"金坛市"
                    },
                    {
                        "name":"溧阳市"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"镇江",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"京口区"
                    },
                    {
                        "name":"润州区"
                    },
                    {
                        "name":"丹徒区"
                    },
                    {
                        "name":"丹阳市"
                    },
                    {
                        "name":"扬中市"
                    },
                    {
                        "name":"句容市"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"南通",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"崇川区"
                    },
                    {
                        "name":"港闸区"
                    },
                    {
                        "name":"通州市"
                    },
                    {
                        "name":"如皋市"
                    },
                    {
                        "name":"海门市"
                    },
                    {
                        "name":"启东市"
                    },
                    {
                        "name":"海安县"
                    },
                    {
                        "name":"如东县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"泰州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"海陵区"
                    },
                    {
                        "name":"高港区"
                    },
                    {
                        "name":"姜堰市"
                    },
                    {
                        "name":"泰兴市"
                    },
                    {
                        "name":"靖江市"
                    },
                    {
                        "name":"兴化市"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"扬州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"广陵区"
                    },
                    {
                        "name":"维扬区"
                    },
                    {
                        "name":"邗江区"
                    },
                    {
                        "name":"江都市"
                    },
                    {
                        "name":"仪征市"
                    },
                    {
                        "name":"高邮市"
                    },
                    {
                        "name":"宝应县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"盐城",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"亭湖区"
                    },
                    {
                        "name":"盐都区"
                    },
                    {
                        "name":"大丰市"
                    },
                    {
                        "name":"东台市"
                    },
                    {
                        "name":"建湖县"
                    },
                    {
                        "name":"射阳县"
                    },
                    {
                        "name":"阜宁县"
                    },
                    {
                        "name":"滨海县"
                    },
                    {
                        "name":"响水县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"连云港",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"新浦区"
                    },
                    {
                        "name":"海州区"
                    },
                    {
                        "name":"连云区"
                    },
                    {
                        "name":"东海县"
                    },
                    {
                        "name":"灌云县"
                    },
                    {
                        "name":"赣榆县"
                    },
                    {
                        "name":"灌南县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"徐州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"云龙区"
                    },
                    {
                        "name":"鼓楼区"
                    },
                    {
                        "name":"九里区"
                    },
                    {
                        "name":"泉山区"
                    },
                    {
                        "name":"贾汪区"
                    },
                    {
                        "name":"邳州市"
                    },
                    {
                        "name":"新沂市"
                    },
                    {
                        "name":"铜山县"
                    },
                    {
                        "name":"睢宁县"
                    },
                    {
                        "name":"沛县"
                    },
                    {
                        "name":"丰县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"淮安",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"清河区"
                    },
                    {
                        "name":"清浦区"
                    },
                    {
                        "name":"楚州区"
                    },
                    {
                        "name":"淮阴区"
                    },
                    {
                        "name":"涟水县"
                    },
                    {
                        "name":"洪泽县"
                    },
                    {
                        "name":"金湖县"
                    },
                    {
                        "name":"盱眙县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"宿迁",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"宿城区"
                    },
                    {
                        "name":"宿豫区"
                    },
                    {
                        "name":"沭阳县"
                    },
                    {
                        "name":"泗阳县"
                    },
                    {
                        "name":"泗洪县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"湖北",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"武汉",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"江岸区"
                    },
                    {
                        "name":"武昌区"
                    },
                    {
                        "name":"江汉区"
                    },
                    {
                        "name":"硚口区"
                    },
                    {
                        "name":"汉阳区"
                    },
                    {
                        "name":"青山区"
                    },
                    {
                        "name":"洪山区"
                    },
                    {
                        "name":"东西湖区"
                    },
                    {
                        "name":"汉南区"
                    },
                    {
                        "name":"蔡甸区"
                    },
                    {
                        "name":"江夏区"
                    },
                    {
                        "name":"黄陂区"
                    },
                    {
                        "name":"新洲区"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"黄石",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"黄石港区"
                    },
                    {
                        "name":"西塞山区"
                    },
                    {
                        "name":"下陆区"
                    },
                    {
                        "name":"铁山区"
                    },
                    {
                        "name":"大冶市"
                    },
                    {
                        "name":"阳新县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"十堰",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"张湾区"
                    },
                    {
                        "name":"茅箭区"
                    },
                    {
                        "name":"丹江口市"
                    },
                    {
                        "name":"郧县"
                    },
                    {
                        "name":"竹山县"
                    },
                    {
                        "name":"房县"
                    },
                    {
                        "name":"郧西县"
                    },
                    {
                        "name":"竹溪县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"荆州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"沙市区"
                    },
                    {
                        "name":"荆州区"
                    },
                    {
                        "name":"洪湖市"
                    },
                    {
                        "name":"石首市"
                    },
                    {
                        "name":"松滋市"
                    },
                    {
                        "name":"监利县"
                    },
                    {
                        "name":"公安县"
                    },
                    {
                        "name":"江陵县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"宜昌",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"西陵区"
                    },
                    {
                        "name":"伍家岗区"
                    },
                    {
                        "name":"点军区"
                    },
                    {
                        "name":"猇亭区"
                    },
                    {
                        "name":"夷陵区"
                    },
                    {
                        "name":"宜都市"
                    },
                    {
                        "name":"当阳市"
                    },
                    {
                        "name":"枝江市"
                    },
                    {
                        "name":"秭归县"
                    },
                    {
                        "name":"远安县"
                    },
                    {
                        "name":"兴山县"
                    },
                    {
                        "name":"五峰土家族自治县"
                    },
                    {
                        "name":"长阳土家族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"襄樊",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"襄城区"
                    },
                    {
                        "name":"樊城区"
                    },
                    {
                        "name":"襄阳区"
                    },
                    {
                        "name":"老河口市"
                    },
                    {
                        "name":"枣阳市"
                    },
                    {
                        "name":"宜城市"
                    },
                    {
                        "name":"南漳县"
                    },
                    {
                        "name":"谷城县"
                    },
                    {
                        "name":"保康县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"鄂州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"鄂城区"
                    },
                    {
                        "name":"华容区"
                    },
                    {
                        "name":"梁子湖区"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"荆门",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"东宝区"
                    },
                    {
                        "name":"掇刀区"
                    },
                    {
                        "name":"钟祥市"
                    },
                    {
                        "name":"京山县"
                    },
                    {
                        "name":"沙洋县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"孝感",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"孝南区"
                    },
                    {
                        "name":"应城市"
                    },
                    {
                        "name":"安陆市"
                    },
                    {
                        "name":"汉川市"
                    },
                    {
                        "name":"云梦县"
                    },
                    {
                        "name":"大悟县"
                    },
                    {
                        "name":"孝昌县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"黄冈",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"黄州区"
                    },
                    {
                        "name":"麻城市"
                    },
                    {
                        "name":"武穴市"
                    },
                    {
                        "name":"红安县"
                    },
                    {
                        "name":"罗田县"
                    },
                    {
                        "name":"浠水县"
                    },
                    {
                        "name":"蕲春县"
                    },
                    {
                        "name":"黄梅县"
                    },
                    {
                        "name":"英山县"
                    },
                    {
                        "name":"团风县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"咸宁",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"咸安区"
                    },
                    {
                        "name":"赤壁市"
                    },
                    {
                        "name":"嘉鱼县"
                    },
                    {
                        "name":"通山县"
                    },
                    {
                        "name":"崇阳县"
                    },
                    {
                        "name":"通城县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"随州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"曾都区"
                    },
                    {
                        "name":"广水市"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"恩施土家族苗族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"恩施市"
                    },
                    {
                        "name":"利川市"
                    },
                    {
                        "name":"建始县"
                    },
                    {
                        "name":"来凤县"
                    },
                    {
                        "name":"巴东县"
                    },
                    {
                        "name":"鹤峰县"
                    },
                    {
                        "name":"宣恩县"
                    },
                    {
                        "name":"咸丰县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"仙桃",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"天门",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"潜江",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"神农架林区",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"四川",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"成都",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"青羊区"
                    },
                    {
                        "name":"锦江区"
                    },
                    {
                        "name":"金牛区"
                    },
                    {
                        "name":"武侯区"
                    },
                    {
                        "name":"成华区"
                    },
                    {
                        "name":"龙泉驿区"
                    },
                    {
                        "name":"青白江区"
                    },
                    {
                        "name":"新都区"
                    },
                    {
                        "name":"温江区"
                    },
                    {
                        "name":"都江堰市"
                    },
                    {
                        "name":"彭州市"
                    },
                    {
                        "name":"邛崃市"
                    },
                    {
                        "name":"崇州市"
                    },
                    {
                        "name":"金堂县"
                    },
                    {
                        "name":"郫县"
                    },
                    {
                        "name":"新津县"
                    },
                    {
                        "name":"双流县"
                    },
                    {
                        "name":"蒲江县"
                    },
                    {
                        "name":"大邑县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"自贡",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"大安区"
                    },
                    {
                        "name":"自流井区"
                    },
                    {
                        "name":"贡井区"
                    },
                    {
                        "name":"沿滩区"
                    },
                    {
                        "name":"荣县"
                    },
                    {
                        "name":"富顺县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"攀枝花",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"仁和区"
                    },
                    {
                        "name":"米易县"
                    },
                    {
                        "name":"盐边县"
                    },
                    {
                        "name":"东区"
                    },
                    {
                        "name":"西区"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"泸州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"江阳区"
                    },
                    {
                        "name":"纳溪区"
                    },
                    {
                        "name":"龙马潭区"
                    },
                    {
                        "name":"泸县"
                    },
                    {
                        "name":"合江县"
                    },
                    {
                        "name":"叙永县"
                    },
                    {
                        "name":"古蔺县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"德阳",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"旌阳区"
                    },
                    {
                        "name":"广汉市"
                    },
                    {
                        "name":"什邡市"
                    },
                    {
                        "name":"绵竹市"
                    },
                    {
                        "name":"罗江县"
                    },
                    {
                        "name":"中江县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"绵阳",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"涪城区"
                    },
                    {
                        "name":"游仙区"
                    },
                    {
                        "name":"江油市"
                    },
                    {
                        "name":"盐亭县"
                    },
                    {
                        "name":"三台县"
                    },
                    {
                        "name":"平武县"
                    },
                    {
                        "name":"安县"
                    },
                    {
                        "name":"梓潼县"
                    },
                    {
                        "name":"北川羌族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"广元",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"元坝区"
                    },
                    {
                        "name":"朝天区"
                    },
                    {
                        "name":"青川县"
                    },
                    {
                        "name":"旺苍县"
                    },
                    {
                        "name":"剑阁县"
                    },
                    {
                        "name":"苍溪县"
                    },
                    {
                        "name":"市中区"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"遂宁",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"船山区"
                    },
                    {
                        "name":"安居区"
                    },
                    {
                        "name":"射洪县"
                    },
                    {
                        "name":"蓬溪县"
                    },
                    {
                        "name":"大英县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"内江",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"市中区"
                    },
                    {
                        "name":"东兴区"
                    },
                    {
                        "name":"资中县"
                    },
                    {
                        "name":"隆昌县"
                    },
                    {
                        "name":"威远县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"乐山",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"市中区"
                    },
                    {
                        "name":"五通桥区"
                    },
                    {
                        "name":"沙湾区"
                    },
                    {
                        "name":"金口河区"
                    },
                    {
                        "name":"峨眉山市"
                    },
                    {
                        "name":"夹江县"
                    },
                    {
                        "name":"井研县"
                    },
                    {
                        "name":"犍为县"
                    },
                    {
                        "name":"沐川县"
                    },
                    {
                        "name":"马边彝族自治县"
                    },
                    {
                        "name":"峨边彝族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"南充",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"顺庆区"
                    },
                    {
                        "name":"高坪区"
                    },
                    {
                        "name":"嘉陵区"
                    },
                    {
                        "name":"阆中市"
                    },
                    {
                        "name":"营山县"
                    },
                    {
                        "name":"蓬安县"
                    },
                    {
                        "name":"仪陇县"
                    },
                    {
                        "name":"南部县"
                    },
                    {
                        "name":"西充县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"眉山",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"东坡区"
                    },
                    {
                        "name":"仁寿县"
                    },
                    {
                        "name":"彭山县"
                    },
                    {
                        "name":"洪雅县"
                    },
                    {
                        "name":"丹棱县"
                    },
                    {
                        "name":"青神县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"宜宾",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"翠屏区"
                    },
                    {
                        "name":"宜宾县"
                    },
                    {
                        "name":"兴文县"
                    },
                    {
                        "name":"南溪县"
                    },
                    {
                        "name":"珙县"
                    },
                    {
                        "name":"长宁县"
                    },
                    {
                        "name":"高县"
                    },
                    {
                        "name":"江安县"
                    },
                    {
                        "name":"筠连县"
                    },
                    {
                        "name":"屏山县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"广安",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"广安区"
                    },
                    {
                        "name":"华蓥市"
                    },
                    {
                        "name":"岳池县"
                    },
                    {
                        "name":"邻水县"
                    },
                    {
                        "name":"武胜县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"达州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"通川区"
                    },
                    {
                        "name":"万源市"
                    },
                    {
                        "name":"达县"
                    },
                    {
                        "name":"渠县"
                    },
                    {
                        "name":"宣汉县"
                    },
                    {
                        "name":"开江县"
                    },
                    {
                        "name":"大竹县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"雅安",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"雨城区"
                    },
                    {
                        "name":"芦山县"
                    },
                    {
                        "name":"石棉县"
                    },
                    {
                        "name":"名山县"
                    },
                    {
                        "name":"天全县"
                    },
                    {
                        "name":"荥经县"
                    },
                    {
                        "name":"宝兴县"
                    },
                    {
                        "name":"汉源县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"巴中",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"巴州区"
                    },
                    {
                        "name":"南江县"
                    },
                    {
                        "name":"平昌县"
                    },
                    {
                        "name":"通江县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"资阳",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"雁江区"
                    },
                    {
                        "name":"简阳市"
                    },
                    {
                        "name":"安岳县"
                    },
                    {
                        "name":"乐至县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"阿坝藏族羌族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"马尔康县"
                    },
                    {
                        "name":"九寨沟县"
                    },
                    {
                        "name":"红原县"
                    },
                    {
                        "name":"汶川县"
                    },
                    {
                        "name":"阿坝县"
                    },
                    {
                        "name":"理县"
                    },
                    {
                        "name":"若尔盖县"
                    },
                    {
                        "name":"小金县"
                    },
                    {
                        "name":"黑水县"
                    },
                    {
                        "name":"金川县"
                    },
                    {
                        "name":"松潘县"
                    },
                    {
                        "name":"壤塘县"
                    },
                    {
                        "name":"茂县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"甘孜藏族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"康定县"
                    },
                    {
                        "name":"丹巴县"
                    },
                    {
                        "name":"炉霍县"
                    },
                    {
                        "name":"九龙县"
                    },
                    {
                        "name":"甘孜县"
                    },
                    {
                        "name":"雅江县"
                    },
                    {
                        "name":"新龙县"
                    },
                    {
                        "name":"道孚县"
                    },
                    {
                        "name":"白玉县"
                    },
                    {
                        "name":"理塘县"
                    },
                    {
                        "name":"德格县"
                    },
                    {
                        "name":"乡城县"
                    },
                    {
                        "name":"石渠县"
                    },
                    {
                        "name":"稻城县"
                    },
                    {
                        "name":"色达县"
                    },
                    {
                        "name":"巴塘县"
                    },
                    {
                        "name":"泸定县"
                    },
                    {
                        "name":"得荣县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"凉山彝族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"西昌市"
                    },
                    {
                        "name":"美姑县"
                    },
                    {
                        "name":"昭觉县"
                    },
                    {
                        "name":"金阳县"
                    },
                    {
                        "name":"甘洛县"
                    },
                    {
                        "name":"布拖县"
                    },
                    {
                        "name":"雷波县"
                    },
                    {
                        "name":"普格县"
                    },
                    {
                        "name":"宁南县"
                    },
                    {
                        "name":"喜德县"
                    },
                    {
                        "name":"会东县"
                    },
                    {
                        "name":"越西县"
                    },
                    {
                        "name":"会理县"
                    },
                    {
                        "name":"盐源县"
                    },
                    {
                        "name":"德昌县"
                    },
                    {
                        "name":"冕宁县"
                    },
                    {
                        "name":"木里藏族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"陕西",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"西安",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"莲湖区"
                    },
                    {
                        "name":"新城区"
                    },
                    {
                        "name":"碑林区"
                    },
                    {
                        "name":"雁塔区"
                    },
                    {
                        "name":"灞桥区"
                    },
                    {
                        "name":"未央区"
                    },
                    {
                        "name":"阎良区"
                    },
                    {
                        "name":"临潼区"
                    },
                    {
                        "name":"长安区"
                    },
                    {
                        "name":"高陵县"
                    },
                    {
                        "name":"蓝田县"
                    },
                    {
                        "name":"户县"
                    },
                    {
                        "name":"周至县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"铜川",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"耀州区"
                    },
                    {
                        "name":"王益区"
                    },
                    {
                        "name":"印台区"
                    },
                    {
                        "name":"宜君县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"宝鸡",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"渭滨区"
                    },
                    {
                        "name":"金台区"
                    },
                    {
                        "name":"陈仓区"
                    },
                    {
                        "name":"岐山县"
                    },
                    {
                        "name":"凤翔县"
                    },
                    {
                        "name":"陇县"
                    },
                    {
                        "name":"太白县"
                    },
                    {
                        "name":"麟游县"
                    },
                    {
                        "name":"扶风县"
                    },
                    {
                        "name":"千阳县"
                    },
                    {
                        "name":"眉县"
                    },
                    {
                        "name":"凤县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"咸阳",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"秦都区"
                    },
                    {
                        "name":"渭城区"
                    },
                    {
                        "name":"杨陵区"
                    },
                    {
                        "name":"兴平市"
                    },
                    {
                        "name":"礼泉县"
                    },
                    {
                        "name":"泾阳县"
                    },
                    {
                        "name":"永寿县"
                    },
                    {
                        "name":"三原县"
                    },
                    {
                        "name":"彬县"
                    },
                    {
                        "name":"旬邑县"
                    },
                    {
                        "name":"长武县"
                    },
                    {
                        "name":"乾县"
                    },
                    {
                        "name":"武功县"
                    },
                    {
                        "name":"淳化县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"渭南",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"临渭区"
                    },
                    {
                        "name":"韩城市"
                    },
                    {
                        "name":"华阴市"
                    },
                    {
                        "name":"蒲城县"
                    },
                    {
                        "name":"潼关县"
                    },
                    {
                        "name":"白水县"
                    },
                    {
                        "name":"澄城县"
                    },
                    {
                        "name":"华县"
                    },
                    {
                        "name":"合阳县"
                    },
                    {
                        "name":"富平县"
                    },
                    {
                        "name":"大荔县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"延安",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"宝塔区"
                    },
                    {
                        "name":"安塞县"
                    },
                    {
                        "name":"洛川县"
                    },
                    {
                        "name":"子长县"
                    },
                    {
                        "name":"黄陵县"
                    },
                    {
                        "name":"延川县"
                    },
                    {
                        "name":"富县"
                    },
                    {
                        "name":"延长县"
                    },
                    {
                        "name":"甘泉县"
                    },
                    {
                        "name":"宜川县"
                    },
                    {
                        "name":"志丹县"
                    },
                    {
                        "name":"黄龙县"
                    },
                    {
                        "name":"吴起县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"汉中",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"汉台区"
                    },
                    {
                        "name":"留坝县"
                    },
                    {
                        "name":"镇巴县"
                    },
                    {
                        "name":"城固县"
                    },
                    {
                        "name":"南郑县"
                    },
                    {
                        "name":"洋县"
                    },
                    {
                        "name":"宁强县"
                    },
                    {
                        "name":"佛坪县"
                    },
                    {
                        "name":"勉县"
                    },
                    {
                        "name":"西乡县"
                    },
                    {
                        "name":"略阳县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"榆林",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"榆阳区"
                    },
                    {
                        "name":"清涧县"
                    },
                    {
                        "name":"绥德县"
                    },
                    {
                        "name":"神木县"
                    },
                    {
                        "name":"佳县"
                    },
                    {
                        "name":"府谷县"
                    },
                    {
                        "name":"子洲县"
                    },
                    {
                        "name":"靖边县"
                    },
                    {
                        "name":"横山县"
                    },
                    {
                        "name":"米脂县"
                    },
                    {
                        "name":"吴堡县"
                    },
                    {
                        "name":"定边县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"安康",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"汉滨区"
                    },
                    {
                        "name":"紫阳县"
                    },
                    {
                        "name":"岚皋县"
                    },
                    {
                        "name":"旬阳县"
                    },
                    {
                        "name":"镇坪县"
                    },
                    {
                        "name":"平利县"
                    },
                    {
                        "name":"石泉县"
                    },
                    {
                        "name":"宁陕县"
                    },
                    {
                        "name":"白河县"
                    },
                    {
                        "name":"汉阴县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"商洛",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"商州区"
                    },
                    {
                        "name":"镇安县"
                    },
                    {
                        "name":"山阳县"
                    },
                    {
                        "name":"洛南县"
                    },
                    {
                        "name":"商南县"
                    },
                    {
                        "name":"丹凤县"
                    },
                    {
                        "name":"柞水县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"河北",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"石家庄",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"长安区"
                    },
                    {
                        "name":"桥东区"
                    },
                    {
                        "name":"桥西区"
                    },
                    {
                        "name":"新华区"
                    },
                    {
                        "name":"裕华区"
                    },
                    {
                        "name":"井陉矿区"
                    },
                    {
                        "name":"鹿泉市"
                    },
                    {
                        "name":"辛集市"
                    },
                    {
                        "name":"藁城市"
                    },
                    {
                        "name":"晋州市"
                    },
                    {
                        "name":"新乐市"
                    },
                    {
                        "name":"深泽县"
                    },
                    {
                        "name":"无极县"
                    },
                    {
                        "name":"赵县"
                    },
                    {
                        "name":"灵寿县"
                    },
                    {
                        "name":"高邑县"
                    },
                    {
                        "name":"元氏县"
                    },
                    {
                        "name":"赞皇县"
                    },
                    {
                        "name":"平山县"
                    },
                    {
                        "name":"井陉县"
                    },
                    {
                        "name":"栾城县"
                    },
                    {
                        "name":"正定县"
                    },
                    {
                        "name":"行唐县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"唐山",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"路北区"
                    },
                    {
                        "name":"路南区"
                    },
                    {
                        "name":"古冶区"
                    },
                    {
                        "name":"开平区"
                    },
                    {
                        "name":"丰南区"
                    },
                    {
                        "name":"丰润区"
                    },
                    {
                        "name":"遵化市"
                    },
                    {
                        "name":"迁安市"
                    },
                    {
                        "name":"迁西县"
                    },
                    {
                        "name":"滦南县"
                    },
                    {
                        "name":"玉田县"
                    },
                    {
                        "name":"唐海县"
                    },
                    {
                        "name":"乐亭县"
                    },
                    {
                        "name":"滦县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"秦皇岛",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"海港区"
                    },
                    {
                        "name":"山海关区"
                    },
                    {
                        "name":"北戴河区"
                    },
                    {
                        "name":"昌黎县"
                    },
                    {
                        "name":"抚宁县"
                    },
                    {
                        "name":"卢龙县"
                    },
                    {
                        "name":"青龙满族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"邯郸",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"邯山区"
                    },
                    {
                        "name":"丛台区"
                    },
                    {
                        "name":"复兴区"
                    },
                    {
                        "name":"峰峰矿区"
                    },
                    {
                        "name":"武安市"
                    },
                    {
                        "name":"邱县"
                    },
                    {
                        "name":"大名县"
                    },
                    {
                        "name":"魏县"
                    },
                    {
                        "name":"曲周县"
                    },
                    {
                        "name":"鸡泽县"
                    },
                    {
                        "name":"肥乡县"
                    },
                    {
                        "name":"广平县"
                    },
                    {
                        "name":"成安县"
                    },
                    {
                        "name":"临漳县"
                    },
                    {
                        "name":"磁县"
                    },
                    {
                        "name":"涉县"
                    },
                    {
                        "name":"永年县"
                    },
                    {
                        "name":"馆陶县"
                    },
                    {
                        "name":"邯郸县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"邢台",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"桥东区"
                    },
                    {
                        "name":"桥西区"
                    },
                    {
                        "name":"南宫市"
                    },
                    {
                        "name":"沙河市"
                    },
                    {
                        "name":"临城县"
                    },
                    {
                        "name":"内丘县"
                    },
                    {
                        "name":"柏乡县"
                    },
                    {
                        "name":"隆尧县"
                    },
                    {
                        "name":"任县"
                    },
                    {
                        "name":"南和县"
                    },
                    {
                        "name":"宁晋县"
                    },
                    {
                        "name":"巨鹿县"
                    },
                    {
                        "name":"新河县"
                    },
                    {
                        "name":"广宗县"
                    },
                    {
                        "name":"平乡县"
                    },
                    {
                        "name":"威县"
                    },
                    {
                        "name":"清河县"
                    },
                    {
                        "name":"临西县"
                    },
                    {
                        "name":"邢台县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"保定",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"新市区"
                    },
                    {
                        "name":"北市区"
                    },
                    {
                        "name":"南市区"
                    },
                    {
                        "name":"定州市"
                    },
                    {
                        "name":"涿州市"
                    },
                    {
                        "name":"安国市"
                    },
                    {
                        "name":"高碑店市"
                    },
                    {
                        "name":"易县"
                    },
                    {
                        "name":"徐水县"
                    },
                    {
                        "name":"涞源县"
                    },
                    {
                        "name":"顺平县"
                    },
                    {
                        "name":"唐县"
                    },
                    {
                        "name":"望都县"
                    },
                    {
                        "name":"涞水县"
                    },
                    {
                        "name":"高阳县"
                    },
                    {
                        "name":"安新县"
                    },
                    {
                        "name":"雄县"
                    },
                    {
                        "name":"容城县"
                    },
                    {
                        "name":"蠡县"
                    },
                    {
                        "name":"曲阳县"
                    },
                    {
                        "name":"阜平县"
                    },
                    {
                        "name":"博野县"
                    },
                    {
                        "name":"满城县"
                    },
                    {
                        "name":"清苑县"
                    },
                    {
                        "name":"定兴县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"张家口",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"桥东区"
                    },
                    {
                        "name":"桥西区"
                    },
                    {
                        "name":"宣化区"
                    },
                    {
                        "name":"下花园区"
                    },
                    {
                        "name":"张北县"
                    },
                    {
                        "name":"康保县"
                    },
                    {
                        "name":"沽源县"
                    },
                    {
                        "name":"尚义县"
                    },
                    {
                        "name":"蔚县"
                    },
                    {
                        "name":"阳原县"
                    },
                    {
                        "name":"怀安县"
                    },
                    {
                        "name":"万全县"
                    },
                    {
                        "name":"怀来县"
                    },
                    {
                        "name":"赤城县"
                    },
                    {
                        "name":"崇礼县"
                    },
                    {
                        "name":"宣化县"
                    },
                    {
                        "name":"涿鹿县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"承德",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"双桥区"
                    },
                    {
                        "name":"双滦区"
                    },
                    {
                        "name":"鹰手营子矿区"
                    },
                    {
                        "name":"兴隆县"
                    },
                    {
                        "name":"平泉县"
                    },
                    {
                        "name":"滦平县"
                    },
                    {
                        "name":"隆化县"
                    },
                    {
                        "name":"承德县"
                    },
                    {
                        "name":"丰宁满族自治县"
                    },
                    {
                        "name":"宽城满族自治县"
                    },
                    {
                        "name":"围场满族蒙古族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"沧州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"新华区"
                    },
                    {
                        "name":"运河区"
                    },
                    {
                        "name":"泊头市"
                    },
                    {
                        "name":"任丘市"
                    },
                    {
                        "name":"黄骅市"
                    },
                    {
                        "name":"河间市"
                    },
                    {
                        "name":"献县"
                    },
                    {
                        "name":"吴桥县"
                    },
                    {
                        "name":"沧县"
                    },
                    {
                        "name":"东光县"
                    },
                    {
                        "name":"肃宁县"
                    },
                    {
                        "name":"南皮县"
                    },
                    {
                        "name":"盐山县"
                    },
                    {
                        "name":"青县"
                    },
                    {
                        "name":"海兴县"
                    },
                    {
                        "name":"孟村回族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"廊坊",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"安次区"
                    },
                    {
                        "name":"广阳区"
                    },
                    {
                        "name":"霸州市"
                    },
                    {
                        "name":"三河市"
                    },
                    {
                        "name":"香河县"
                    },
                    {
                        "name":"永清县"
                    },
                    {
                        "name":"固安县"
                    },
                    {
                        "name":"文安县"
                    },
                    {
                        "name":"大城县"
                    },
                    {
                        "name":"大厂回族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"衡水",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"桃城区"
                    },
                    {
                        "name":"冀州市"
                    },
                    {
                        "name":"深州市"
                    },
                    {
                        "name":"枣强县"
                    },
                    {
                        "name":"武邑县"
                    },
                    {
                        "name":"武强县"
                    },
                    {
                        "name":"饶阳县"
                    },
                    {
                        "name":"安平县"
                    },
                    {
                        "name":"故城县"
                    },
                    {
                        "name":"景县"
                    },
                    {
                        "name":"阜城县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"山西",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"太原",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"杏花岭区"
                    },
                    {
                        "name":"小店区"
                    },
                    {
                        "name":"迎泽区"
                    },
                    {
                        "name":"尖草坪区"
                    },
                    {
                        "name":"万柏林区"
                    },
                    {
                        "name":"晋源区"
                    },
                    {
                        "name":"古交市"
                    },
                    {
                        "name":"阳曲县"
                    },
                    {
                        "name":"清徐县"
                    },
                    {
                        "name":"娄烦县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"大同",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"城区"
                    },
                    {
                        "name":"矿区"
                    },
                    {
                        "name":"南郊区"
                    },
                    {
                        "name":"新荣区"
                    },
                    {
                        "name":"大同县"
                    },
                    {
                        "name":"天镇县"
                    },
                    {
                        "name":"灵丘县"
                    },
                    {
                        "name":"阳高县"
                    },
                    {
                        "name":"左云县"
                    },
                    {
                        "name":"广灵县"
                    },
                    {
                        "name":"浑源县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"阳泉",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"城区"
                    },
                    {
                        "name":"矿区"
                    },
                    {
                        "name":"郊区"
                    },
                    {
                        "name":"平定县"
                    },
                    {
                        "name":"盂县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"长治",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"城区"
                    },
                    {
                        "name":"郊区"
                    },
                    {
                        "name":"潞城市"
                    },
                    {
                        "name":"长治县"
                    },
                    {
                        "name":"长子县"
                    },
                    {
                        "name":"平顺县"
                    },
                    {
                        "name":"襄垣县"
                    },
                    {
                        "name":"沁源县"
                    },
                    {
                        "name":"屯留县"
                    },
                    {
                        "name":"黎城县"
                    },
                    {
                        "name":"武乡县"
                    },
                    {
                        "name":"沁县"
                    },
                    {
                        "name":"壶关县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"晋城",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"城区"
                    },
                    {
                        "name":"高平市"
                    },
                    {
                        "name":"泽州县"
                    },
                    {
                        "name":"陵川县"
                    },
                    {
                        "name":"阳城县"
                    },
                    {
                        "name":"沁水县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"朔州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"朔城区"
                    },
                    {
                        "name":"平鲁区"
                    },
                    {
                        "name":"山阴县"
                    },
                    {
                        "name":"右玉县"
                    },
                    {
                        "name":"应县"
                    },
                    {
                        "name":"怀仁县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"晋中",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"榆次区"
                    },
                    {
                        "name":"介休市"
                    },
                    {
                        "name":"昔阳县"
                    },
                    {
                        "name":"灵石县"
                    },
                    {
                        "name":"祁县"
                    },
                    {
                        "name":"左权县"
                    },
                    {
                        "name":"寿阳县"
                    },
                    {
                        "name":"太谷县"
                    },
                    {
                        "name":"和顺县"
                    },
                    {
                        "name":"平遥县"
                    },
                    {
                        "name":"榆社县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"运城",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"盐湖区"
                    },
                    {
                        "name":"河津市"
                    },
                    {
                        "name":"永济市"
                    },
                    {
                        "name":"闻喜县"
                    },
                    {
                        "name":"新绛县"
                    },
                    {
                        "name":"平陆县"
                    },
                    {
                        "name":"垣曲县"
                    },
                    {
                        "name":"绛县"
                    },
                    {
                        "name":"稷山县"
                    },
                    {
                        "name":"芮城县"
                    },
                    {
                        "name":"夏县"
                    },
                    {
                        "name":"万荣县"
                    },
                    {
                        "name":"临猗县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"忻州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"忻府区"
                    },
                    {
                        "name":"原平市"
                    },
                    {
                        "name":"代县"
                    },
                    {
                        "name":"神池县"
                    },
                    {
                        "name":"五寨县"
                    },
                    {
                        "name":"五台县"
                    },
                    {
                        "name":"偏关县"
                    },
                    {
                        "name":"宁武县"
                    },
                    {
                        "name":"静乐县"
                    },
                    {
                        "name":"繁峙县"
                    },
                    {
                        "name":"河曲县"
                    },
                    {
                        "name":"保德县"
                    },
                    {
                        "name":"定襄县"
                    },
                    {
                        "name":"岢岚县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"临汾",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"尧都区"
                    },
                    {
                        "name":"侯马市"
                    },
                    {
                        "name":"霍州市"
                    },
                    {
                        "name":"汾西县"
                    },
                    {
                        "name":"吉县"
                    },
                    {
                        "name":"安泽县"
                    },
                    {
                        "name":"大宁县"
                    },
                    {
                        "name":"浮山县"
                    },
                    {
                        "name":"古县"
                    },
                    {
                        "name":"隰县"
                    },
                    {
                        "name":"襄汾县"
                    },
                    {
                        "name":"翼城县"
                    },
                    {
                        "name":"永和县"
                    },
                    {
                        "name":"乡宁县"
                    },
                    {
                        "name":"曲沃县"
                    },
                    {
                        "name":"洪洞县"
                    },
                    {
                        "name":"蒲县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"吕梁",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"离石区"
                    },
                    {
                        "name":"孝义市"
                    },
                    {
                        "name":"汾阳市"
                    },
                    {
                        "name":"文水县"
                    },
                    {
                        "name":"中阳县"
                    },
                    {
                        "name":"兴县"
                    },
                    {
                        "name":"临县"
                    },
                    {
                        "name":"方山县"
                    },
                    {
                        "name":"柳林县"
                    },
                    {
                        "name":"岚县"
                    },
                    {
                        "name":"交口县"
                    },
                    {
                        "name":"交城县"
                    },
                    {
                        "name":"石楼县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"河南",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"郑州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"中原区"
                    },
                    {
                        "name":"金水区"
                    },
                    {
                        "name":"二七区"
                    },
                    {
                        "name":"管城回族区"
                    },
                    {
                        "name":"上街区"
                    },
                    {
                        "name":"惠济区"
                    },
                    {
                        "name":"巩义市"
                    },
                    {
                        "name":"新郑市"
                    },
                    {
                        "name":"新密市"
                    },
                    {
                        "name":"登封市"
                    },
                    {
                        "name":"荥阳市"
                    },
                    {
                        "name":"中牟县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"开封",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"鼓楼区"
                    },
                    {
                        "name":"龙亭区"
                    },
                    {
                        "name":"顺河回族区"
                    },
                    {
                        "name":"禹王台区"
                    },
                    {
                        "name":"金明区"
                    },
                    {
                        "name":"开封县"
                    },
                    {
                        "name":"尉氏县"
                    },
                    {
                        "name":"兰考县"
                    },
                    {
                        "name":"杞县"
                    },
                    {
                        "name":"通许县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"洛阳",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"西工区"
                    },
                    {
                        "name":"老城区"
                    },
                    {
                        "name":"涧西区"
                    },
                    {
                        "name":"瀍河回族区"
                    },
                    {
                        "name":"洛龙区"
                    },
                    {
                        "name":"吉利区"
                    },
                    {
                        "name":"偃师市"
                    },
                    {
                        "name":"孟津县"
                    },
                    {
                        "name":"汝阳县"
                    },
                    {
                        "name":"伊川县"
                    },
                    {
                        "name":"洛宁县"
                    },
                    {
                        "name":"嵩县"
                    },
                    {
                        "name":"宜阳县"
                    },
                    {
                        "name":"新安县"
                    },
                    {
                        "name":"栾川县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"平顶山",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"新华区"
                    },
                    {
                        "name":"卫东区"
                    },
                    {
                        "name":"湛河区"
                    },
                    {
                        "name":"石龙区"
                    },
                    {
                        "name":"汝州市"
                    },
                    {
                        "name":"舞钢市"
                    },
                    {
                        "name":"宝丰县"
                    },
                    {
                        "name":"叶县"
                    },
                    {
                        "name":"郏县"
                    },
                    {
                        "name":"鲁山县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"安阳",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"北关区"
                    },
                    {
                        "name":"文峰区"
                    },
                    {
                        "name":"殷都区"
                    },
                    {
                        "name":"龙安区"
                    },
                    {
                        "name":"林州市"
                    },
                    {
                        "name":"安阳县"
                    },
                    {
                        "name":"滑县"
                    },
                    {
                        "name":"内黄县"
                    },
                    {
                        "name":"汤阴县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"鹤壁",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"淇滨区"
                    },
                    {
                        "name":"山城区"
                    },
                    {
                        "name":"鹤山区"
                    },
                    {
                        "name":"浚县"
                    },
                    {
                        "name":"淇县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"新乡",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"卫滨区"
                    },
                    {
                        "name":"红旗区"
                    },
                    {
                        "name":"凤泉区"
                    },
                    {
                        "name":"牧野区"
                    },
                    {
                        "name":"卫辉市"
                    },
                    {
                        "name":"辉县市"
                    },
                    {
                        "name":"新乡县"
                    },
                    {
                        "name":"获嘉县"
                    },
                    {
                        "name":"原阳县"
                    },
                    {
                        "name":"长垣县"
                    },
                    {
                        "name":"封丘县"
                    },
                    {
                        "name":"延津县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"焦作",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"解放区"
                    },
                    {
                        "name":"中站区"
                    },
                    {
                        "name":"马村区"
                    },
                    {
                        "name":"山阳区"
                    },
                    {
                        "name":"沁阳市"
                    },
                    {
                        "name":"孟州市"
                    },
                    {
                        "name":"修武县"
                    },
                    {
                        "name":"温县"
                    },
                    {
                        "name":"武陟县"
                    },
                    {
                        "name":"博爱县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"濮阳",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"华龙区"
                    },
                    {
                        "name":"濮阳县"
                    },
                    {
                        "name":"南乐县"
                    },
                    {
                        "name":"台前县"
                    },
                    {
                        "name":"清丰县"
                    },
                    {
                        "name":"范县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"许昌",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"魏都区"
                    },
                    {
                        "name":"禹州市"
                    },
                    {
                        "name":"长葛市"
                    },
                    {
                        "name":"许昌县"
                    },
                    {
                        "name":"鄢陵县"
                    },
                    {
                        "name":"襄城县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"漯河",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"源汇区"
                    },
                    {
                        "name":"郾城区"
                    },
                    {
                        "name":"召陵区"
                    },
                    {
                        "name":"临颍县"
                    },
                    {
                        "name":"舞阳县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"三门峡",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"湖滨区"
                    },
                    {
                        "name":"义马市"
                    },
                    {
                        "name":"灵宝市"
                    },
                    {
                        "name":"渑池县"
                    },
                    {
                        "name":"卢氏县"
                    },
                    {
                        "name":"陕县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"南阳",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"卧龙区"
                    },
                    {
                        "name":"宛城区"
                    },
                    {
                        "name":"邓州市"
                    },
                    {
                        "name":"桐柏县"
                    },
                    {
                        "name":"方城县"
                    },
                    {
                        "name":"淅川县"
                    },
                    {
                        "name":"镇平县"
                    },
                    {
                        "name":"唐河县"
                    },
                    {
                        "name":"南召县"
                    },
                    {
                        "name":"内乡县"
                    },
                    {
                        "name":"新野县"
                    },
                    {
                        "name":"社旗县"
                    },
                    {
                        "name":"西峡县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"商丘",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"梁园区"
                    },
                    {
                        "name":"睢阳区"
                    },
                    {
                        "name":"永城市"
                    },
                    {
                        "name":"宁陵县"
                    },
                    {
                        "name":"虞城县"
                    },
                    {
                        "name":"民权县"
                    },
                    {
                        "name":"夏邑县"
                    },
                    {
                        "name":"柘城县"
                    },
                    {
                        "name":"睢县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"信阳",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"浉河区"
                    },
                    {
                        "name":"平桥区"
                    },
                    {
                        "name":"潢川县"
                    },
                    {
                        "name":"淮滨县"
                    },
                    {
                        "name":"息县"
                    },
                    {
                        "name":"新县"
                    },
                    {
                        "name":"商城县"
                    },
                    {
                        "name":"固始县"
                    },
                    {
                        "name":"罗山县"
                    },
                    {
                        "name":"光山县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"周口",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"川汇区"
                    },
                    {
                        "name":"项城市"
                    },
                    {
                        "name":"商水县"
                    },
                    {
                        "name":"淮阳县"
                    },
                    {
                        "name":"太康县"
                    },
                    {
                        "name":"鹿邑县"
                    },
                    {
                        "name":"西华县"
                    },
                    {
                        "name":"扶沟县"
                    },
                    {
                        "name":"沈丘县"
                    },
                    {
                        "name":"郸城县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"驻马店",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"驿城区"
                    },
                    {
                        "name":"确山县"
                    },
                    {
                        "name":"新蔡县"
                    },
                    {
                        "name":"上蔡县"
                    },
                    {
                        "name":"西平县"
                    },
                    {
                        "name":"泌阳县"
                    },
                    {
                        "name":"平舆县"
                    },
                    {
                        "name":"汝南县"
                    },
                    {
                        "name":"遂平县"
                    },
                    {
                        "name":"正阳县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"焦作",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"济源市"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"吉林",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"长春",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"朝阳区"
                    },
                    {
                        "name":"宽城区"
                    },
                    {
                        "name":"二道区"
                    },
                    {
                        "name":"南关区"
                    },
                    {
                        "name":"绿园区"
                    },
                    {
                        "name":"双阳区"
                    },
                    {
                        "name":"九台市"
                    },
                    {
                        "name":"榆树市"
                    },
                    {
                        "name":"德惠市"
                    },
                    {
                        "name":"农安县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"吉林",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"船营区"
                    },
                    {
                        "name":"昌邑区"
                    },
                    {
                        "name":"龙潭区"
                    },
                    {
                        "name":"丰满区"
                    },
                    {
                        "name":"舒兰市"
                    },
                    {
                        "name":"桦甸市"
                    },
                    {
                        "name":"蛟河市"
                    },
                    {
                        "name":"磐石市"
                    },
                    {
                        "name":"永吉县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"四平",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"铁西区"
                    },
                    {
                        "name":"铁东区"
                    },
                    {
                        "name":"公主岭市"
                    },
                    {
                        "name":"双辽市"
                    },
                    {
                        "name":"梨树县"
                    },
                    {
                        "name":"伊通满族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"辽源",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"龙山区"
                    },
                    {
                        "name":"西安区"
                    },
                    {
                        "name":"东辽县"
                    },
                    {
                        "name":"东丰县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"通化",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"东昌区"
                    },
                    {
                        "name":"二道江区"
                    },
                    {
                        "name":"梅河口市"
                    },
                    {
                        "name":"集安市"
                    },
                    {
                        "name":"通化县"
                    },
                    {
                        "name":"辉南县"
                    },
                    {
                        "name":"柳河县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"白山",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"八道江区"
                    },
                    {
                        "name":"江源区"
                    },
                    {
                        "name":"临江市"
                    },
                    {
                        "name":"靖宇县"
                    },
                    {
                        "name":"抚松县"
                    },
                    {
                        "name":"长白朝鲜族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"松原",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"宁江区"
                    },
                    {
                        "name":"乾安县"
                    },
                    {
                        "name":"长岭县"
                    },
                    {
                        "name":"扶余县"
                    },
                    {
                        "name":"前郭尔罗斯蒙古族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"白城",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"洮北区"
                    },
                    {
                        "name":"大安市"
                    },
                    {
                        "name":"洮南市"
                    },
                    {
                        "name":"镇赉县"
                    },
                    {
                        "name":"通榆县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"延边朝鲜族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"延吉市"
                    },
                    {
                        "name":"图们市"
                    },
                    {
                        "name":"敦化市"
                    },
                    {
                        "name":"龙井市"
                    },
                    {
                        "name":"珲春市"
                    },
                    {
                        "name":"和龙市"
                    },
                    {
                        "name":"安图县"
                    },
                    {
                        "name":"汪清县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"黑龙江",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"哈尔滨",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"松北区"
                    },
                    {
                        "name":"道里区"
                    },
                    {
                        "name":"南岗区"
                    },
                    {
                        "name":"平房区"
                    },
                    {
                        "name":"香坊区"
                    },
                    {
                        "name":"道外区"
                    },
                    {
                        "name":"呼兰区"
                    },
                    {
                        "name":"阿城区"
                    },
                    {
                        "name":"双城市"
                    },
                    {
                        "name":"尚志市"
                    },
                    {
                        "name":"五常市"
                    },
                    {
                        "name":"宾县"
                    },
                    {
                        "name":"方正县"
                    },
                    {
                        "name":"通河县"
                    },
                    {
                        "name":"巴彦县"
                    },
                    {
                        "name":"延寿县"
                    },
                    {
                        "name":"木兰县"
                    },
                    {
                        "name":"依兰县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"齐齐哈尔",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"龙沙区"
                    },
                    {
                        "name":"昂昂溪区"
                    },
                    {
                        "name":"铁锋区"
                    },
                    {
                        "name":"建华区"
                    },
                    {
                        "name":"富拉尔基区"
                    },
                    {
                        "name":"碾子山区"
                    },
                    {
                        "name":"梅里斯达斡尔族区"
                    },
                    {
                        "name":"讷河市"
                    },
                    {
                        "name":"富裕县"
                    },
                    {
                        "name":"拜泉县"
                    },
                    {
                        "name":"甘南县"
                    },
                    {
                        "name":"依安县"
                    },
                    {
                        "name":"克山县"
                    },
                    {
                        "name":"泰来县"
                    },
                    {
                        "name":"克东县"
                    },
                    {
                        "name":"龙江县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"鹤岗",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"兴山区"
                    },
                    {
                        "name":"工农区"
                    },
                    {
                        "name":"南山区"
                    },
                    {
                        "name":"兴安区"
                    },
                    {
                        "name":"向阳区"
                    },
                    {
                        "name":"东山区"
                    },
                    {
                        "name":"萝北县"
                    },
                    {
                        "name":"绥滨县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"双鸭山",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"尖山区"
                    },
                    {
                        "name":"岭东区"
                    },
                    {
                        "name":"四方台区"
                    },
                    {
                        "name":"宝山区"
                    },
                    {
                        "name":"集贤县"
                    },
                    {
                        "name":"宝清县"
                    },
                    {
                        "name":"友谊县"
                    },
                    {
                        "name":"饶河县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"鸡西",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"鸡冠区"
                    },
                    {
                        "name":"恒山区"
                    },
                    {
                        "name":"城子河区"
                    },
                    {
                        "name":"滴道区"
                    },
                    {
                        "name":"梨树区"
                    },
                    {
                        "name":"麻山区"
                    },
                    {
                        "name":"密山市"
                    },
                    {
                        "name":"虎林市"
                    },
                    {
                        "name":"鸡东县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"大庆",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"萨尔图区"
                    },
                    {
                        "name":"红岗区"
                    },
                    {
                        "name":"龙凤区"
                    },
                    {
                        "name":"让胡路区"
                    },
                    {
                        "name":"大同区"
                    },
                    {
                        "name":"林甸县"
                    },
                    {
                        "name":"肇州县"
                    },
                    {
                        "name":"肇源县"
                    },
                    {
                        "name":"杜尔伯特蒙古族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"伊春",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"伊春区"
                    },
                    {
                        "name":"带岭区"
                    },
                    {
                        "name":"南岔区"
                    },
                    {
                        "name":"金山屯区"
                    },
                    {
                        "name":"西林区"
                    },
                    {
                        "name":"美溪区"
                    },
                    {
                        "name":"乌马河区"
                    },
                    {
                        "name":"翠峦区"
                    },
                    {
                        "name":"友好区"
                    },
                    {
                        "name":"上甘岭区"
                    },
                    {
                        "name":"五营区"
                    },
                    {
                        "name":"红星区"
                    },
                    {
                        "name":"新青区"
                    },
                    {
                        "name":"汤旺河区"
                    },
                    {
                        "name":"乌伊岭区"
                    },
                    {
                        "name":"铁力市"
                    },
                    {
                        "name":"嘉荫县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"牡丹江",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"爱民区"
                    },
                    {
                        "name":"东安区"
                    },
                    {
                        "name":"阳明区"
                    },
                    {
                        "name":"西安区"
                    },
                    {
                        "name":"绥芬河市"
                    },
                    {
                        "name":"宁安市"
                    },
                    {
                        "name":"海林市"
                    },
                    {
                        "name":"穆棱市"
                    },
                    {
                        "name":"林口县"
                    },
                    {
                        "name":"东宁县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"佳木斯",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"向阳区"
                    },
                    {
                        "name":"前进区"
                    },
                    {
                        "name":"东风区"
                    },
                    {
                        "name":"郊区"
                    },
                    {
                        "name":"同江市"
                    },
                    {
                        "name":"富锦市"
                    },
                    {
                        "name":"桦川县"
                    },
                    {
                        "name":"抚远县"
                    },
                    {
                        "name":"桦南县"
                    },
                    {
                        "name":"汤原县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"七台河",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"桃山区"
                    },
                    {
                        "name":"新兴区"
                    },
                    {
                        "name":"茄子河区"
                    },
                    {
                        "name":"勃利县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"黑河",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"爱辉区"
                    },
                    {
                        "name":"北安市"
                    },
                    {
                        "name":"五大连池市"
                    },
                    {
                        "name":"逊克县"
                    },
                    {
                        "name":"嫩江县"
                    },
                    {
                        "name":"孙吴县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"绥化",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"北林区"
                    },
                    {
                        "name":"安达市"
                    },
                    {
                        "name":"肇东市"
                    },
                    {
                        "name":"海伦市"
                    },
                    {
                        "name":"绥棱县"
                    },
                    {
                        "name":"兰西县"
                    },
                    {
                        "name":"明水县"
                    },
                    {
                        "name":"青冈县"
                    },
                    {
                        "name":"庆安县"
                    },
                    {
                        "name":"望奎县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"大兴安岭地区",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"呼玛县"
                    },
                    {
                        "name":"塔河县"
                    },
                    {
                        "name":"漠河县"
                    },
                    {
                        "name":"大兴安岭辖区"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"内蒙古",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"呼和浩特",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"回民区"
                    },
                    {
                        "name":"玉泉区"
                    },
                    {
                        "name":"新城区"
                    },
                    {
                        "name":"赛罕区"
                    },
                    {
                        "name":"托克托县"
                    },
                    {
                        "name":"清水河县"
                    },
                    {
                        "name":"武川县"
                    },
                    {
                        "name":"和林格尔县"
                    },
                    {
                        "name":"土默特左旗"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"包头",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"昆都仑区"
                    },
                    {
                        "name":"青山区"
                    },
                    {
                        "name":"东河区"
                    },
                    {
                        "name":"九原区"
                    },
                    {
                        "name":"石拐区"
                    },
                    {
                        "name":"白云矿区"
                    },
                    {
                        "name":"固阳县"
                    },
                    {
                        "name":"土默特右旗"
                    },
                    {
                        "name":"达尔罕茂明安联合旗"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"乌海",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"海勃湾区"
                    },
                    {
                        "name":"乌达区"
                    },
                    {
                        "name":"海南区"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"赤峰",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"红山区"
                    },
                    {
                        "name":"元宝山区"
                    },
                    {
                        "name":"松山区"
                    },
                    {
                        "name":"宁城县"
                    },
                    {
                        "name":"林西县"
                    },
                    {
                        "name":"喀喇沁旗"
                    },
                    {
                        "name":"巴林左旗"
                    },
                    {
                        "name":"敖汉旗"
                    },
                    {
                        "name":"阿鲁科尔沁旗"
                    },
                    {
                        "name":"翁牛特旗"
                    },
                    {
                        "name":"克什克腾旗"
                    },
                    {
                        "name":"巴林右旗"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"通辽",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"科尔沁区"
                    },
                    {
                        "name":"霍林郭勒市"
                    },
                    {
                        "name":"开鲁县"
                    },
                    {
                        "name":"科尔沁左翼中旗"
                    },
                    {
                        "name":"科尔沁左翼后旗"
                    },
                    {
                        "name":"库伦旗"
                    },
                    {
                        "name":"奈曼旗"
                    },
                    {
                        "name":"扎鲁特旗"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"鄂尔多斯",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"东胜区"
                    },
                    {
                        "name":"准格尔旗"
                    },
                    {
                        "name":"乌审旗"
                    },
                    {
                        "name":"伊金霍洛旗"
                    },
                    {
                        "name":"鄂托克旗"
                    },
                    {
                        "name":"鄂托克前旗"
                    },
                    {
                        "name":"杭锦旗"
                    },
                    {
                        "name":"达拉特旗"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"呼伦贝尔",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"海拉尔区"
                    },
                    {
                        "name":"满洲里市"
                    },
                    {
                        "name":"牙克石市"
                    },
                    {
                        "name":"扎兰屯市"
                    },
                    {
                        "name":"根河市"
                    },
                    {
                        "name":"额尔古纳市"
                    },
                    {
                        "name":"陈巴尔虎旗"
                    },
                    {
                        "name":"阿荣旗"
                    },
                    {
                        "name":"新巴尔虎左旗"
                    },
                    {
                        "name":"新巴尔虎右旗"
                    },
                    {
                        "name":"鄂伦春自治旗"
                    },
                    {
                        "name":"莫力达瓦达斡尔族自治旗"
                    },
                    {
                        "name":"鄂温克族自治旗"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"巴彦淖尔",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"临河区"
                    },
                    {
                        "name":"五原县"
                    },
                    {
                        "name":"磴口县"
                    },
                    {
                        "name":"杭锦后旗"
                    },
                    {
                        "name":"乌拉特中旗"
                    },
                    {
                        "name":"乌拉特前旗"
                    },
                    {
                        "name":"乌拉特后旗"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"乌兰察布",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"集宁区"
                    },
                    {
                        "name":"丰镇市"
                    },
                    {
                        "name":"兴和县"
                    },
                    {
                        "name":"卓资县"
                    },
                    {
                        "name":"商都县"
                    },
                    {
                        "name":"凉城县"
                    },
                    {
                        "name":"化德县"
                    },
                    {
                        "name":"四子王旗"
                    },
                    {
                        "name":"察哈尔右翼前旗"
                    },
                    {
                        "name":"察哈尔右翼中旗"
                    },
                    {
                        "name":"察哈尔右翼后旗"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"锡林郭勒盟",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"锡林浩特市"
                    },
                    {
                        "name":"二连浩特市"
                    },
                    {
                        "name":"多伦县"
                    },
                    {
                        "name":"阿巴嘎旗"
                    },
                    {
                        "name":"西乌珠穆沁旗"
                    },
                    {
                        "name":"东乌珠穆沁旗"
                    },
                    {
                        "name":"苏尼特左旗"
                    },
                    {
                        "name":"苏尼特右旗"
                    },
                    {
                        "name":"太仆寺旗"
                    },
                    {
                        "name":"正镶白旗"
                    },
                    {
                        "name":"正蓝旗"
                    },
                    {
                        "name":"镶黄旗"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"兴安盟",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"乌兰浩特市"
                    },
                    {
                        "name":"阿尔山市"
                    },
                    {
                        "name":"突泉县"
                    },
                    {
                        "name":"扎赉特旗"
                    },
                    {
                        "name":"科尔沁右翼前旗"
                    },
                    {
                        "name":"科尔沁右翼中旗"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"阿拉善盟",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"阿拉善左旗"
                    },
                    {
                        "name":"阿拉善右旗"
                    },
                    {
                        "name":"额济纳旗"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"山东",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"济南",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"市中区"
                    },
                    {
                        "name":"历下区"
                    },
                    {
                        "name":"天桥区"
                    },
                    {
                        "name":"槐荫区"
                    },
                    {
                        "name":"历城区"
                    },
                    {
                        "name":"长清区"
                    },
                    {
                        "name":"章丘市"
                    },
                    {
                        "name":"平阴县"
                    },
                    {
                        "name":"济阳县"
                    },
                    {
                        "name":"商河县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"青岛",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"市南区"
                    },
                    {
                        "name":"市北区"
                    },
                    {
                        "name":"城阳区"
                    },
                    {
                        "name":"四方区"
                    },
                    {
                        "name":"李沧区"
                    },
                    {
                        "name":"黄岛区"
                    },
                    {
                        "name":"崂山区"
                    },
                    {
                        "name":"胶南市"
                    },
                    {
                        "name":"胶州市"
                    },
                    {
                        "name":"平度市"
                    },
                    {
                        "name":"莱西市"
                    },
                    {
                        "name":"即墨市"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"淄博",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"张店区"
                    },
                    {
                        "name":"临淄区"
                    },
                    {
                        "name":"淄川区"
                    },
                    {
                        "name":"博山区"
                    },
                    {
                        "name":"周村区"
                    },
                    {
                        "name":"桓台县"
                    },
                    {
                        "name":"高青县"
                    },
                    {
                        "name":"沂源县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"枣庄",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"市中区"
                    },
                    {
                        "name":"山亭区"
                    },
                    {
                        "name":"峄城区"
                    },
                    {
                        "name":"台儿庄区"
                    },
                    {
                        "name":"薛城区"
                    },
                    {
                        "name":"滕州市"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"东营",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"东营区"
                    },
                    {
                        "name":"河口区"
                    },
                    {
                        "name":"垦利县"
                    },
                    {
                        "name":"广饶县"
                    },
                    {
                        "name":"利津县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"烟台",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"芝罘区"
                    },
                    {
                        "name":"福山区"
                    },
                    {
                        "name":"牟平区"
                    },
                    {
                        "name":"莱山区"
                    },
                    {
                        "name":"龙口市"
                    },
                    {
                        "name":"莱阳市"
                    },
                    {
                        "name":"莱州市"
                    },
                    {
                        "name":"招远市"
                    },
                    {
                        "name":"蓬莱市"
                    },
                    {
                        "name":"栖霞市"
                    },
                    {
                        "name":"海阳市"
                    },
                    {
                        "name":"长岛县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"潍坊",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"潍城区"
                    },
                    {
                        "name":"寒亭区"
                    },
                    {
                        "name":"坊子区"
                    },
                    {
                        "name":"奎文区"
                    },
                    {
                        "name":"青州市"
                    },
                    {
                        "name":"诸城市"
                    },
                    {
                        "name":"寿光市"
                    },
                    {
                        "name":"安丘市"
                    },
                    {
                        "name":"高密市"
                    },
                    {
                        "name":"昌邑市"
                    },
                    {
                        "name":"昌乐县"
                    },
                    {
                        "name":"临朐县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"济宁",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"市中区"
                    },
                    {
                        "name":"任城区"
                    },
                    {
                        "name":"曲阜市"
                    },
                    {
                        "name":"兖州市"
                    },
                    {
                        "name":"邹城市"
                    },
                    {
                        "name":"鱼台县"
                    },
                    {
                        "name":"金乡县"
                    },
                    {
                        "name":"嘉祥县"
                    },
                    {
                        "name":"微山县"
                    },
                    {
                        "name":"汶上县"
                    },
                    {
                        "name":"泗水县"
                    },
                    {
                        "name":"梁山县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"泰安",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"泰山区"
                    },
                    {
                        "name":"岱岳区"
                    },
                    {
                        "name":"新泰市"
                    },
                    {
                        "name":"肥城市"
                    },
                    {
                        "name":"宁阳县"
                    },
                    {
                        "name":"东平县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"威海",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"环翠区"
                    },
                    {
                        "name":"乳山市"
                    },
                    {
                        "name":"文登市"
                    },
                    {
                        "name":"荣成市"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"日照",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"东港区"
                    },
                    {
                        "name":"岚山区"
                    },
                    {
                        "name":"五莲县"
                    },
                    {
                        "name":"莒县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"莱芜",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"莱城区"
                    },
                    {
                        "name":"钢城区"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"临沂",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"兰山区"
                    },
                    {
                        "name":"罗庄区"
                    },
                    {
                        "name":"河东区"
                    },
                    {
                        "name":"沂南县"
                    },
                    {
                        "name":"郯城县"
                    },
                    {
                        "name":"沂水县"
                    },
                    {
                        "name":"苍山县"
                    },
                    {
                        "name":"费县"
                    },
                    {
                        "name":"平邑县"
                    },
                    {
                        "name":"莒南县"
                    },
                    {
                        "name":"蒙阴县"
                    },
                    {
                        "name":"临沭县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"德州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"德城区"
                    },
                    {
                        "name":"乐陵市"
                    },
                    {
                        "name":"禹城市"
                    },
                    {
                        "name":"陵县"
                    },
                    {
                        "name":"宁津县"
                    },
                    {
                        "name":"齐河县"
                    },
                    {
                        "name":"武城县"
                    },
                    {
                        "name":"庆云县"
                    },
                    {
                        "name":"平原县"
                    },
                    {
                        "name":"夏津县"
                    },
                    {
                        "name":"临邑县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"聊城",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"东昌府区"
                    },
                    {
                        "name":"临清市"
                    },
                    {
                        "name":"高唐县"
                    },
                    {
                        "name":"阳谷县"
                    },
                    {
                        "name":"茌平县"
                    },
                    {
                        "name":"莘县"
                    },
                    {
                        "name":"东阿县"
                    },
                    {
                        "name":"冠县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"滨州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"滨城区"
                    },
                    {
                        "name":"邹平县"
                    },
                    {
                        "name":"沾化县"
                    },
                    {
                        "name":"惠民县"
                    },
                    {
                        "name":"博兴县"
                    },
                    {
                        "name":"阳信县"
                    },
                    {
                        "name":"无棣县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"菏泽",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"牡丹区"
                    },
                    {
                        "name":"鄄城县"
                    },
                    {
                        "name":"单县"
                    },
                    {
                        "name":"郓城县"
                    },
                    {
                        "name":"曹县"
                    },
                    {
                        "name":"定陶县"
                    },
                    {
                        "name":"巨野县"
                    },
                    {
                        "name":"东明县"
                    },
                    {
                        "name":"成武县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"安徽",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"合肥",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"庐阳区"
                    },
                    {
                        "name":"瑶海区"
                    },
                    {
                        "name":"蜀山区"
                    },
                    {
                        "name":"包河区"
                    },
                    {
                        "name":"长丰县"
                    },
                    {
                        "name":"肥东县"
                    },
                    {
                        "name":"肥西县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"芜湖",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"镜湖区"
                    },
                    {
                        "name":"弋江区"
                    },
                    {
                        "name":"鸠江区"
                    },
                    {
                        "name":"三山区"
                    },
                    {
                        "name":"芜湖县"
                    },
                    {
                        "name":"南陵县"
                    },
                    {
                        "name":"繁昌县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"蚌埠",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"蚌山区"
                    },
                    {
                        "name":"龙子湖区"
                    },
                    {
                        "name":"禹会区"
                    },
                    {
                        "name":"淮上区"
                    },
                    {
                        "name":"怀远县"
                    },
                    {
                        "name":"固镇县"
                    },
                    {
                        "name":"五河县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"淮南",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"田家庵区"
                    },
                    {
                        "name":"大通区"
                    },
                    {
                        "name":"谢家集区"
                    },
                    {
                        "name":"八公山区"
                    },
                    {
                        "name":"潘集区"
                    },
                    {
                        "name":"凤台县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"马鞍山",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"雨山区"
                    },
                    {
                        "name":"花山区"
                    },
                    {
                        "name":"金家庄区"
                    },
                    {
                        "name":"当涂县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"淮北",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"相山区"
                    },
                    {
                        "name":"杜集区"
                    },
                    {
                        "name":"烈山区"
                    },
                    {
                        "name":"濉溪县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"铜陵",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"铜官山区"
                    },
                    {
                        "name":"狮子山区"
                    },
                    {
                        "name":"郊区"
                    },
                    {
                        "name":"铜陵县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"安庆",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"迎江区"
                    },
                    {
                        "name":"大观区"
                    },
                    {
                        "name":"宜秀区"
                    },
                    {
                        "name":"桐城市"
                    },
                    {
                        "name":"宿松县"
                    },
                    {
                        "name":"枞阳县"
                    },
                    {
                        "name":"太湖县"
                    },
                    {
                        "name":"怀宁县"
                    },
                    {
                        "name":"岳西县"
                    },
                    {
                        "name":"望江县"
                    },
                    {
                        "name":"潜山县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"黄山",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"屯溪区"
                    },
                    {
                        "name":"黄山区"
                    },
                    {
                        "name":"徽州区"
                    },
                    {
                        "name":"休宁县"
                    },
                    {
                        "name":"歙县"
                    },
                    {
                        "name":"祁门县"
                    },
                    {
                        "name":"黟县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"滁州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"琅琊区"
                    },
                    {
                        "name":"南谯区"
                    },
                    {
                        "name":"天长市"
                    },
                    {
                        "name":"明光市"
                    },
                    {
                        "name":"全椒县"
                    },
                    {
                        "name":"来安县"
                    },
                    {
                        "name":"定远县"
                    },
                    {
                        "name":"凤阳县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"阜阳",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"颍州区"
                    },
                    {
                        "name":"颍东区"
                    },
                    {
                        "name":"颍泉区"
                    },
                    {
                        "name":"界首市"
                    },
                    {
                        "name":"临泉县"
                    },
                    {
                        "name":"颍上县"
                    },
                    {
                        "name":"阜南县"
                    },
                    {
                        "name":"太和县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"宿州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"埇桥区"
                    },
                    {
                        "name":"萧县"
                    },
                    {
                        "name":"泗县"
                    },
                    {
                        "name":"砀山县"
                    },
                    {
                        "name":"灵璧县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"巢湖",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"居巢区"
                    },
                    {
                        "name":"含山县"
                    },
                    {
                        "name":"无为县"
                    },
                    {
                        "name":"庐江县"
                    },
                    {
                        "name":"和县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"六安",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"金安区"
                    },
                    {
                        "name":"裕安区"
                    },
                    {
                        "name":"寿县"
                    },
                    {
                        "name":"霍山县"
                    },
                    {
                        "name":"霍邱县"
                    },
                    {
                        "name":"舒城县"
                    },
                    {
                        "name":"金寨县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"亳州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"谯城区"
                    },
                    {
                        "name":"利辛县"
                    },
                    {
                        "name":"涡阳县"
                    },
                    {
                        "name":"蒙城县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"池州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"贵池区"
                    },
                    {
                        "name":"东至县"
                    },
                    {
                        "name":"石台县"
                    },
                    {
                        "name":"青阳县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"宣城",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"宣州区"
                    },
                    {
                        "name":"宁国市"
                    },
                    {
                        "name":"广德县"
                    },
                    {
                        "name":"郎溪县"
                    },
                    {
                        "name":"泾县"
                    },
                    {
                        "name":"旌德县"
                    },
                    {
                        "name":"绩溪县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"浙江",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"杭州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"拱墅区"
                    },
                    {
                        "name":"西湖区"
                    },
                    {
                        "name":"上城区"
                    },
                    {
                        "name":"下城区"
                    },
                    {
                        "name":"江干区"
                    },
                    {
                        "name":"滨江区"
                    },
                    {
                        "name":"余杭区"
                    },
                    {
                        "name":"萧山区"
                    },
                    {
                        "name":"建德市"
                    },
                    {
                        "name":"富阳市"
                    },
                    {
                        "name":"临安市"
                    },
                    {
                        "name":"桐庐县"
                    },
                    {
                        "name":"淳安县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"宁波",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"海曙区"
                    },
                    {
                        "name":"江东区"
                    },
                    {
                        "name":"江北区"
                    },
                    {
                        "name":"镇海区"
                    },
                    {
                        "name":"北仑区"
                    },
                    {
                        "name":"鄞州区"
                    },
                    {
                        "name":"余姚市"
                    },
                    {
                        "name":"慈溪市"
                    },
                    {
                        "name":"奉化市"
                    },
                    {
                        "name":"宁海县"
                    },
                    {
                        "name":"象山县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"温州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"鹿城区"
                    },
                    {
                        "name":"龙湾区"
                    },
                    {
                        "name":"瓯海区"
                    },
                    {
                        "name":"瑞安市"
                    },
                    {
                        "name":"乐清市"
                    },
                    {
                        "name":"永嘉县"
                    },
                    {
                        "name":"洞头县"
                    },
                    {
                        "name":"平阳县"
                    },
                    {
                        "name":"苍南县"
                    },
                    {
                        "name":"文成县"
                    },
                    {
                        "name":"泰顺县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"嘉兴",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"秀城区"
                    },
                    {
                        "name":"秀洲区"
                    },
                    {
                        "name":"海宁市"
                    },
                    {
                        "name":"平湖市"
                    },
                    {
                        "name":"桐乡市"
                    },
                    {
                        "name":"嘉善县"
                    },
                    {
                        "name":"海盐县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"湖州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"吴兴区"
                    },
                    {
                        "name":"南浔区"
                    },
                    {
                        "name":"长兴县"
                    },
                    {
                        "name":"德清县"
                    },
                    {
                        "name":"安吉县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"绍兴",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"越城区"
                    },
                    {
                        "name":"诸暨市"
                    },
                    {
                        "name":"上虞市"
                    },
                    {
                        "name":"嵊州市"
                    },
                    {
                        "name":"绍兴县"
                    },
                    {
                        "name":"新昌县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"金华",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"婺城区"
                    },
                    {
                        "name":"金东区"
                    },
                    {
                        "name":"兰溪市"
                    },
                    {
                        "name":"义乌市"
                    },
                    {
                        "name":"东阳市"
                    },
                    {
                        "name":"永康市"
                    },
                    {
                        "name":"武义县"
                    },
                    {
                        "name":"浦江县"
                    },
                    {
                        "name":"磐安县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"衢州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"柯城区"
                    },
                    {
                        "name":"衢江区"
                    },
                    {
                        "name":"江山市"
                    },
                    {
                        "name":"龙游县"
                    },
                    {
                        "name":"常山县"
                    },
                    {
                        "name":"开化县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"舟山",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"定海区"
                    },
                    {
                        "name":"普陀区"
                    },
                    {
                        "name":"岱山县"
                    },
                    {
                        "name":"嵊泗县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"台州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"椒江区"
                    },
                    {
                        "name":"黄岩区"
                    },
                    {
                        "name":"路桥区"
                    },
                    {
                        "name":"临海市"
                    },
                    {
                        "name":"温岭市"
                    },
                    {
                        "name":"玉环县"
                    },
                    {
                        "name":"天台县"
                    },
                    {
                        "name":"仙居县"
                    },
                    {
                        "name":"三门县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"丽水",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"莲都区"
                    },
                    {
                        "name":"龙泉市"
                    },
                    {
                        "name":"缙云县"
                    },
                    {
                        "name":"青田县"
                    },
                    {
                        "name":"云和县"
                    },
                    {
                        "name":"遂昌县"
                    },
                    {
                        "name":"松阳县"
                    },
                    {
                        "name":"庆元县"
                    },
                    {
                        "name":"景宁畲族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"福建",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"福州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"鼓楼区"
                    },
                    {
                        "name":"台江区"
                    },
                    {
                        "name":"仓山区"
                    },
                    {
                        "name":"马尾区"
                    },
                    {
                        "name":"晋安区"
                    },
                    {
                        "name":"福清市"
                    },
                    {
                        "name":"长乐市"
                    },
                    {
                        "name":"闽侯县"
                    },
                    {
                        "name":"闽清县"
                    },
                    {
                        "name":"永泰县"
                    },
                    {
                        "name":"连江县"
                    },
                    {
                        "name":"罗源县"
                    },
                    {
                        "name":"平潭县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"厦门",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"思明区"
                    },
                    {
                        "name":"海沧区"
                    },
                    {
                        "name":"湖里区"
                    },
                    {
                        "name":"集美区"
                    },
                    {
                        "name":"同安区"
                    },
                    {
                        "name":"翔安区"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"莆田",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"城厢区"
                    },
                    {
                        "name":"涵江区"
                    },
                    {
                        "name":"荔城区"
                    },
                    {
                        "name":"秀屿区"
                    },
                    {
                        "name":"仙游县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"三明",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"梅列区"
                    },
                    {
                        "name":"三元区"
                    },
                    {
                        "name":"永安市"
                    },
                    {
                        "name":"明溪县"
                    },
                    {
                        "name":"将乐县"
                    },
                    {
                        "name":"大田县"
                    },
                    {
                        "name":"宁化县"
                    },
                    {
                        "name":"建宁县"
                    },
                    {
                        "name":"沙县"
                    },
                    {
                        "name":"尤溪县"
                    },
                    {
                        "name":"清流县"
                    },
                    {
                        "name":"泰宁县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"泉州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"鲤城区"
                    },
                    {
                        "name":"丰泽区"
                    },
                    {
                        "name":"洛江区"
                    },
                    {
                        "name":"泉港区"
                    },
                    {
                        "name":"石狮市"
                    },
                    {
                        "name":"晋江市"
                    },
                    {
                        "name":"南安市"
                    },
                    {
                        "name":"惠安县"
                    },
                    {
                        "name":"永春县"
                    },
                    {
                        "name":"安溪县"
                    },
                    {
                        "name":"德化县"
                    },
                    {
                        "name":"金门县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"漳州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"芗城区"
                    },
                    {
                        "name":"龙文区"
                    },
                    {
                        "name":"龙海市"
                    },
                    {
                        "name":"平和县"
                    },
                    {
                        "name":"南靖县"
                    },
                    {
                        "name":"诏安县"
                    },
                    {
                        "name":"漳浦县"
                    },
                    {
                        "name":"华安县"
                    },
                    {
                        "name":"东山县"
                    },
                    {
                        "name":"长泰县"
                    },
                    {
                        "name":"云霄县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"南平",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"延平区"
                    },
                    {
                        "name":"建瓯市"
                    },
                    {
                        "name":"邵武市"
                    },
                    {
                        "name":"武夷山市"
                    },
                    {
                        "name":"建阳市"
                    },
                    {
                        "name":"松溪县"
                    },
                    {
                        "name":"光泽县"
                    },
                    {
                        "name":"顺昌县"
                    },
                    {
                        "name":"浦城县"
                    },
                    {
                        "name":"政和县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"龙岩",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"新罗区"
                    },
                    {
                        "name":"漳平市"
                    },
                    {
                        "name":"长汀县"
                    },
                    {
                        "name":"武平县"
                    },
                    {
                        "name":"上杭县"
                    },
                    {
                        "name":"永定县"
                    },
                    {
                        "name":"连城县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"宁德",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"蕉城区"
                    },
                    {
                        "name":"福安市"
                    },
                    {
                        "name":"福鼎市"
                    },
                    {
                        "name":"寿宁县"
                    },
                    {
                        "name":"霞浦县"
                    },
                    {
                        "name":"柘荣县"
                    },
                    {
                        "name":"屏南县"
                    },
                    {
                        "name":"古田县"
                    },
                    {
                        "name":"周宁县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"湖南",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"长沙",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"岳麓区"
                    },
                    {
                        "name":"芙蓉区"
                    },
                    {
                        "name":"天心区"
                    },
                    {
                        "name":"开福区"
                    },
                    {
                        "name":"雨花区"
                    },
                    {
                        "name":"浏阳市"
                    },
                    {
                        "name":"长沙县"
                    },
                    {
                        "name":"望城县"
                    },
                    {
                        "name":"宁乡县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"株洲",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"天元区"
                    },
                    {
                        "name":"荷塘区"
                    },
                    {
                        "name":"芦淞区"
                    },
                    {
                        "name":"石峰区"
                    },
                    {
                        "name":"醴陵市"
                    },
                    {
                        "name":"株洲县"
                    },
                    {
                        "name":"炎陵县"
                    },
                    {
                        "name":"茶陵县"
                    },
                    {
                        "name":"攸县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"湘潭",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"岳塘区"
                    },
                    {
                        "name":"雨湖区"
                    },
                    {
                        "name":"湘乡市"
                    },
                    {
                        "name":"韶山市"
                    },
                    {
                        "name":"湘潭县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"衡阳",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"雁峰区"
                    },
                    {
                        "name":"珠晖区"
                    },
                    {
                        "name":"石鼓区"
                    },
                    {
                        "name":"蒸湘区"
                    },
                    {
                        "name":"南岳区"
                    },
                    {
                        "name":"耒阳市"
                    },
                    {
                        "name":"常宁市"
                    },
                    {
                        "name":"衡阳县"
                    },
                    {
                        "name":"衡东县"
                    },
                    {
                        "name":"衡山县"
                    },
                    {
                        "name":"衡南县"
                    },
                    {
                        "name":"祁东县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"邵阳",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"双清区"
                    },
                    {
                        "name":"大祥区"
                    },
                    {
                        "name":"北塔区"
                    },
                    {
                        "name":"武冈市"
                    },
                    {
                        "name":"邵东县"
                    },
                    {
                        "name":"洞口县"
                    },
                    {
                        "name":"新邵县"
                    },
                    {
                        "name":"绥宁县"
                    },
                    {
                        "name":"新宁县"
                    },
                    {
                        "name":"邵阳县"
                    },
                    {
                        "name":"隆回县"
                    },
                    {
                        "name":"城步苗族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"岳阳",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"岳阳楼区"
                    },
                    {
                        "name":"云溪区"
                    },
                    {
                        "name":"君山区"
                    },
                    {
                        "name":"临湘市"
                    },
                    {
                        "name":"汨罗市"
                    },
                    {
                        "name":"岳阳县"
                    },
                    {
                        "name":"湘阴县"
                    },
                    {
                        "name":"平江县"
                    },
                    {
                        "name":"华容县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"常德",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"武陵区"
                    },
                    {
                        "name":"鼎城区"
                    },
                    {
                        "name":"津市市"
                    },
                    {
                        "name":"澧县"
                    },
                    {
                        "name":"临澧县"
                    },
                    {
                        "name":"桃源县"
                    },
                    {
                        "name":"汉寿县"
                    },
                    {
                        "name":"安乡县"
                    },
                    {
                        "name":"石门县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"张家界",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"永定区"
                    },
                    {
                        "name":"武陵源区"
                    },
                    {
                        "name":"慈利县"
                    },
                    {
                        "name":"桑植县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"益阳",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"赫山区"
                    },
                    {
                        "name":"资阳区"
                    },
                    {
                        "name":"沅江市"
                    },
                    {
                        "name":"桃江县"
                    },
                    {
                        "name":"南县"
                    },
                    {
                        "name":"安化县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"郴州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"北湖区"
                    },
                    {
                        "name":"苏仙区"
                    },
                    {
                        "name":"资兴市"
                    },
                    {
                        "name":"宜章县"
                    },
                    {
                        "name":"汝城县"
                    },
                    {
                        "name":"安仁县"
                    },
                    {
                        "name":"嘉禾县"
                    },
                    {
                        "name":"临武县"
                    },
                    {
                        "name":"桂东县"
                    },
                    {
                        "name":"永兴县"
                    },
                    {
                        "name":"桂阳县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"永州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"冷水滩区"
                    },
                    {
                        "name":"零陵区"
                    },
                    {
                        "name":"祁阳县"
                    },
                    {
                        "name":"蓝山县"
                    },
                    {
                        "name":"宁远县"
                    },
                    {
                        "name":"新田县"
                    },
                    {
                        "name":"东安县"
                    },
                    {
                        "name":"江永县"
                    },
                    {
                        "name":"道县"
                    },
                    {
                        "name":"双牌县"
                    },
                    {
                        "name":"江华瑶族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"怀化",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"鹤城区"
                    },
                    {
                        "name":"洪江市"
                    },
                    {
                        "name":"会同县"
                    },
                    {
                        "name":"沅陵县"
                    },
                    {
                        "name":"辰溪县"
                    },
                    {
                        "name":"溆浦县"
                    },
                    {
                        "name":"中方县"
                    },
                    {
                        "name":"新晃侗族自治县"
                    },
                    {
                        "name":"芷江侗族自治县"
                    },
                    {
                        "name":"通道侗族自治县"
                    },
                    {
                        "name":"靖州苗族侗族自治县"
                    },
                    {
                        "name":"麻阳苗族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"娄底",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"娄星区"
                    },
                    {
                        "name":"冷水江市"
                    },
                    {
                        "name":"涟源市"
                    },
                    {
                        "name":"新化县"
                    },
                    {
                        "name":"双峰县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"湘西土家族苗族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"吉首市"
                    },
                    {
                        "name":"古丈县"
                    },
                    {
                        "name":"龙山县"
                    },
                    {
                        "name":"永顺县"
                    },
                    {
                        "name":"凤凰县"
                    },
                    {
                        "name":"泸溪县"
                    },
                    {
                        "name":"保靖县"
                    },
                    {
                        "name":"花垣县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"广西",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"南宁",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"青秀区"
                    },
                    {
                        "name":"兴宁区"
                    },
                    {
                        "name":"西乡塘区"
                    },
                    {
                        "name":"良庆区"
                    },
                    {
                        "name":"江南区"
                    },
                    {
                        "name":"邕宁区"
                    },
                    {
                        "name":"武鸣县"
                    },
                    {
                        "name":"隆安县"
                    },
                    {
                        "name":"马山县"
                    },
                    {
                        "name":"上林县"
                    },
                    {
                        "name":"宾阳县"
                    },
                    {
                        "name":"横县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"柳州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"城中区"
                    },
                    {
                        "name":"鱼峰区"
                    },
                    {
                        "name":"柳北区"
                    },
                    {
                        "name":"柳南区"
                    },
                    {
                        "name":"柳江县"
                    },
                    {
                        "name":"柳城县"
                    },
                    {
                        "name":"鹿寨县"
                    },
                    {
                        "name":"融安县"
                    },
                    {
                        "name":"融水苗族自治县"
                    },
                    {
                        "name":"三江侗族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"桂林",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"象山区"
                    },
                    {
                        "name":"秀峰区"
                    },
                    {
                        "name":"叠彩区"
                    },
                    {
                        "name":"七星区"
                    },
                    {
                        "name":"雁山区"
                    },
                    {
                        "name":"阳朔县"
                    },
                    {
                        "name":"临桂县"
                    },
                    {
                        "name":"灵川县"
                    },
                    {
                        "name":"全州县"
                    },
                    {
                        "name":"平乐县"
                    },
                    {
                        "name":"兴安县"
                    },
                    {
                        "name":"灌阳县"
                    },
                    {
                        "name":"荔浦县"
                    },
                    {
                        "name":"资源县"
                    },
                    {
                        "name":"永福县"
                    },
                    {
                        "name":"龙胜各族自治县"
                    },
                    {
                        "name":"恭城瑶族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"梧州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"万秀区"
                    },
                    {
                        "name":"蝶山区"
                    },
                    {
                        "name":"长洲区"
                    },
                    {
                        "name":"岑溪市"
                    },
                    {
                        "name":"苍梧县"
                    },
                    {
                        "name":"藤县"
                    },
                    {
                        "name":"蒙山县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"北海",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"海城区"
                    },
                    {
                        "name":"银海区"
                    },
                    {
                        "name":"铁山港区"
                    },
                    {
                        "name":"合浦县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"防城港",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"港口区"
                    },
                    {
                        "name":"防城区"
                    },
                    {
                        "name":"东兴市"
                    },
                    {
                        "name":"上思县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"钦州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"钦南区"
                    },
                    {
                        "name":"钦北区"
                    },
                    {
                        "name":"灵山县"
                    },
                    {
                        "name":"浦北县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"贵港",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"港北区"
                    },
                    {
                        "name":"港南区"
                    },
                    {
                        "name":"覃塘区"
                    },
                    {
                        "name":"桂平市"
                    },
                    {
                        "name":"平南县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"玉林",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"玉州区"
                    },
                    {
                        "name":"北流市"
                    },
                    {
                        "name":"容县"
                    },
                    {
                        "name":"陆川县"
                    },
                    {
                        "name":"博白县"
                    },
                    {
                        "name":"兴业县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"百色",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"右江区"
                    },
                    {
                        "name":"凌云县"
                    },
                    {
                        "name":"平果县"
                    },
                    {
                        "name":"西林县"
                    },
                    {
                        "name":"乐业县"
                    },
                    {
                        "name":"德保县"
                    },
                    {
                        "name":"田林县"
                    },
                    {
                        "name":"田阳县"
                    },
                    {
                        "name":"靖西县"
                    },
                    {
                        "name":"田东县"
                    },
                    {
                        "name":"那坡县"
                    },
                    {
                        "name":"隆林各族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"贺州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"八步区"
                    },
                    {
                        "name":"钟山县"
                    },
                    {
                        "name":"昭平县"
                    },
                    {
                        "name":"富川瑶族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"河池",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"金城江区"
                    },
                    {
                        "name":"宜州市"
                    },
                    {
                        "name":"天峨县"
                    },
                    {
                        "name":"凤山县"
                    },
                    {
                        "name":"南丹县"
                    },
                    {
                        "name":"东兰县"
                    },
                    {
                        "name":"都安瑶族自治县"
                    },
                    {
                        "name":"罗城仫佬族自治县"
                    },
                    {
                        "name":"巴马瑶族自治县"
                    },
                    {
                        "name":"环江毛南族自治县"
                    },
                    {
                        "name":"大化瑶族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"来宾",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"兴宾区"
                    },
                    {
                        "name":"合山市"
                    },
                    {
                        "name":"象州县"
                    },
                    {
                        "name":"武宣县"
                    },
                    {
                        "name":"忻城县"
                    },
                    {
                        "name":"金秀瑶族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"崇左",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"江州区"
                    },
                    {
                        "name":"凭祥市"
                    },
                    {
                        "name":"宁明县"
                    },
                    {
                        "name":"扶绥县"
                    },
                    {
                        "name":"龙州县"
                    },
                    {
                        "name":"大新县"
                    },
                    {
                        "name":"天等县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"江西",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"南昌",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"东湖区"
                    },
                    {
                        "name":"西湖区"
                    },
                    {
                        "name":"青云谱区"
                    },
                    {
                        "name":"湾里区"
                    },
                    {
                        "name":"青山湖区"
                    },
                    {
                        "name":"新建县"
                    },
                    {
                        "name":"南昌县"
                    },
                    {
                        "name":"进贤县"
                    },
                    {
                        "name":"安义县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"景德镇",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"珠山区"
                    },
                    {
                        "name":"昌江区"
                    },
                    {
                        "name":"乐平市"
                    },
                    {
                        "name":"浮梁县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"萍乡",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"安源区"
                    },
                    {
                        "name":"湘东区"
                    },
                    {
                        "name":"莲花县"
                    },
                    {
                        "name":"上栗县"
                    },
                    {
                        "name":"芦溪县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"九江",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"浔阳区"
                    },
                    {
                        "name":"庐山区"
                    },
                    {
                        "name":"瑞昌市"
                    },
                    {
                        "name":"九江县"
                    },
                    {
                        "name":"星子县"
                    },
                    {
                        "name":"武宁县"
                    },
                    {
                        "name":"彭泽县"
                    },
                    {
                        "name":"永修县"
                    },
                    {
                        "name":"修水县"
                    },
                    {
                        "name":"湖口县"
                    },
                    {
                        "name":"德安县"
                    },
                    {
                        "name":"都昌县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"新余",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"渝水区"
                    },
                    {
                        "name":"分宜县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"鹰潭",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"月湖区"
                    },
                    {
                        "name":"贵溪市"
                    },
                    {
                        "name":"余江县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"赣州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"章贡区"
                    },
                    {
                        "name":"瑞金市"
                    },
                    {
                        "name":"南康市"
                    },
                    {
                        "name":"石城县"
                    },
                    {
                        "name":"安远县"
                    },
                    {
                        "name":"赣县"
                    },
                    {
                        "name":"宁都县"
                    },
                    {
                        "name":"寻乌县"
                    },
                    {
                        "name":"兴国县"
                    },
                    {
                        "name":"定南县"
                    },
                    {
                        "name":"上犹县"
                    },
                    {
                        "name":"于都县"
                    },
                    {
                        "name":"龙南县"
                    },
                    {
                        "name":"崇义县"
                    },
                    {
                        "name":"信丰县"
                    },
                    {
                        "name":"全南县"
                    },
                    {
                        "name":"大余县"
                    },
                    {
                        "name":"会昌县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"吉安",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"吉州区"
                    },
                    {
                        "name":"青原区"
                    },
                    {
                        "name":"井冈山市"
                    },
                    {
                        "name":"吉安县"
                    },
                    {
                        "name":"永丰县"
                    },
                    {
                        "name":"永新县"
                    },
                    {
                        "name":"新干县"
                    },
                    {
                        "name":"泰和县"
                    },
                    {
                        "name":"峡江县"
                    },
                    {
                        "name":"遂川县"
                    },
                    {
                        "name":"安福县"
                    },
                    {
                        "name":"吉水县"
                    },
                    {
                        "name":"万安县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"宜春",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"袁州区"
                    },
                    {
                        "name":"丰城市"
                    },
                    {
                        "name":"樟树市"
                    },
                    {
                        "name":"高安市"
                    },
                    {
                        "name":"铜鼓县"
                    },
                    {
                        "name":"靖安县"
                    },
                    {
                        "name":"宜丰县"
                    },
                    {
                        "name":"奉新县"
                    },
                    {
                        "name":"万载县"
                    },
                    {
                        "name":"上高县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"抚州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"临川区"
                    },
                    {
                        "name":"南丰县"
                    },
                    {
                        "name":"乐安县"
                    },
                    {
                        "name":"金溪县"
                    },
                    {
                        "name":"南城县"
                    },
                    {
                        "name":"东乡县"
                    },
                    {
                        "name":"资溪县"
                    },
                    {
                        "name":"宜黄县"
                    },
                    {
                        "name":"广昌县"
                    },
                    {
                        "name":"黎川县"
                    },
                    {
                        "name":"崇仁县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"上饶",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"信州区"
                    },
                    {
                        "name":"德兴市"
                    },
                    {
                        "name":"上饶县"
                    },
                    {
                        "name":"广丰县"
                    },
                    {
                        "name":"鄱阳县"
                    },
                    {
                        "name":"婺源县"
                    },
                    {
                        "name":"铅山县"
                    },
                    {
                        "name":"余干县"
                    },
                    {
                        "name":"横峰县"
                    },
                    {
                        "name":"弋阳县"
                    },
                    {
                        "name":"玉山县"
                    },
                    {
                        "name":"万年县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"贵州",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"贵阳",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"南明区"
                    },
                    {
                        "name":"云岩区"
                    },
                    {
                        "name":"花溪区"
                    },
                    {
                        "name":"乌当区"
                    },
                    {
                        "name":"白云区"
                    },
                    {
                        "name":"小河区"
                    },
                    {
                        "name":"清镇市"
                    },
                    {
                        "name":"开阳县"
                    },
                    {
                        "name":"修文县"
                    },
                    {
                        "name":"息烽县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"六盘水",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"钟山区"
                    },
                    {
                        "name":"水城县"
                    },
                    {
                        "name":"盘县"
                    },
                    {
                        "name":"六枝特区"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"遵义",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"红花岗区"
                    },
                    {
                        "name":"汇川区"
                    },
                    {
                        "name":"赤水市"
                    },
                    {
                        "name":"仁怀市"
                    },
                    {
                        "name":"遵义县"
                    },
                    {
                        "name":"绥阳县"
                    },
                    {
                        "name":"桐梓县"
                    },
                    {
                        "name":"习水县"
                    },
                    {
                        "name":"凤冈县"
                    },
                    {
                        "name":"正安县"
                    },
                    {
                        "name":"余庆县"
                    },
                    {
                        "name":"湄潭县"
                    },
                    {
                        "name":"道真仡佬族苗族自治县"
                    },
                    {
                        "name":"务川仡佬族苗族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"安顺",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"西秀区"
                    },
                    {
                        "name":"普定县"
                    },
                    {
                        "name":"平坝县"
                    },
                    {
                        "name":"镇宁布依族苗族自治县"
                    },
                    {
                        "name":"紫云苗族布依族自治县"
                    },
                    {
                        "name":"关岭布依族苗族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"铜仁地区",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"铜仁市"
                    },
                    {
                        "name":"德江县"
                    },
                    {
                        "name":"江口县"
                    },
                    {
                        "name":"思南县"
                    },
                    {
                        "name":"石阡县"
                    },
                    {
                        "name":"玉屏侗族自治县"
                    },
                    {
                        "name":"松桃苗族自治县"
                    },
                    {
                        "name":"印江土家族苗族自治县"
                    },
                    {
                        "name":"沿河土家族自治县"
                    },
                    {
                        "name":"万山特区"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"毕节地区",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"毕节市"
                    },
                    {
                        "name":"黔西县"
                    },
                    {
                        "name":"大方县"
                    },
                    {
                        "name":"织金县"
                    },
                    {
                        "name":"金沙县"
                    },
                    {
                        "name":"赫章县"
                    },
                    {
                        "name":"纳雍县"
                    },
                    {
                        "name":"威宁彝族回族苗族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"黔西南布依族苗族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"兴义市"
                    },
                    {
                        "name":"望谟县"
                    },
                    {
                        "name":"兴仁县"
                    },
                    {
                        "name":"普安县"
                    },
                    {
                        "name":"册亨县"
                    },
                    {
                        "name":"晴隆县"
                    },
                    {
                        "name":"贞丰县"
                    },
                    {
                        "name":"安龙县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"黔东南苗族侗族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"凯里市"
                    },
                    {
                        "name":"施秉县"
                    },
                    {
                        "name":"从江县"
                    },
                    {
                        "name":"锦屏县"
                    },
                    {
                        "name":"镇远县"
                    },
                    {
                        "name":"麻江县"
                    },
                    {
                        "name":"台江县"
                    },
                    {
                        "name":"天柱县"
                    },
                    {
                        "name":"黄平县"
                    },
                    {
                        "name":"榕江县"
                    },
                    {
                        "name":"剑河县"
                    },
                    {
                        "name":"三穗县"
                    },
                    {
                        "name":"雷山县"
                    },
                    {
                        "name":"黎平县"
                    },
                    {
                        "name":"岑巩县"
                    },
                    {
                        "name":"丹寨县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"黔南布依族苗族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"都匀市"
                    },
                    {
                        "name":"福泉市"
                    },
                    {
                        "name":"贵定县"
                    },
                    {
                        "name":"惠水县"
                    },
                    {
                        "name":"罗甸县"
                    },
                    {
                        "name":"瓮安县"
                    },
                    {
                        "name":"荔波县"
                    },
                    {
                        "name":"龙里县"
                    },
                    {
                        "name":"平塘县"
                    },
                    {
                        "name":"长顺县"
                    },
                    {
                        "name":"独山县"
                    },
                    {
                        "name":"三都水族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"云南",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"昆明",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"盘龙区"
                    },
                    {
                        "name":"五华区"
                    },
                    {
                        "name":"官渡区"
                    },
                    {
                        "name":"西山区"
                    },
                    {
                        "name":"东川区"
                    },
                    {
                        "name":"安宁市"
                    },
                    {
                        "name":"呈贡县"
                    },
                    {
                        "name":"晋宁县"
                    },
                    {
                        "name":"富民县"
                    },
                    {
                        "name":"宜良县"
                    },
                    {
                        "name":"嵩明县"
                    },
                    {
                        "name":"石林彝族自治县"
                    },
                    {
                        "name":"禄劝彝族苗族自治县"
                    },
                    {
                        "name":"寻甸回族彝族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"曲靖",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"麒麟区"
                    },
                    {
                        "name":"宣威市"
                    },
                    {
                        "name":"马龙县"
                    },
                    {
                        "name":"沾益县"
                    },
                    {
                        "name":"富源县"
                    },
                    {
                        "name":"罗平县"
                    },
                    {
                        "name":"师宗县"
                    },
                    {
                        "name":"陆良县"
                    },
                    {
                        "name":"会泽县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"玉溪",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"红塔区"
                    },
                    {
                        "name":"江川县"
                    },
                    {
                        "name":"澄江县"
                    },
                    {
                        "name":"通海县"
                    },
                    {
                        "name":"华宁县"
                    },
                    {
                        "name":"易门县"
                    },
                    {
                        "name":"峨山彝族自治县"
                    },
                    {
                        "name":"新平彝族傣族自治县"
                    },
                    {
                        "name":"元江哈尼族彝族傣族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"保山",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"隆阳区"
                    },
                    {
                        "name":"施甸县"
                    },
                    {
                        "name":"腾冲县"
                    },
                    {
                        "name":"龙陵县"
                    },
                    {
                        "name":"昌宁县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"昭通",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"昭阳区"
                    },
                    {
                        "name":"鲁甸县"
                    },
                    {
                        "name":"巧家县"
                    },
                    {
                        "name":"盐津县"
                    },
                    {
                        "name":"大关县"
                    },
                    {
                        "name":"永善县"
                    },
                    {
                        "name":"绥江县"
                    },
                    {
                        "name":"镇雄县"
                    },
                    {
                        "name":"彝良县"
                    },
                    {
                        "name":"威信县"
                    },
                    {
                        "name":"水富县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"丽江",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"古城区"
                    },
                    {
                        "name":"永胜县"
                    },
                    {
                        "name":"华坪县"
                    },
                    {
                        "name":"玉龙纳西族自治县"
                    },
                    {
                        "name":"宁蒗彝族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"普洱",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"思茅区"
                    },
                    {
                        "name":"普洱哈尼族彝族自治县"
                    },
                    {
                        "name":"墨江哈尼族自治县"
                    },
                    {
                        "name":"景东彝族自治县"
                    },
                    {
                        "name":"景谷傣族彝族自治县"
                    },
                    {
                        "name":"镇沅彝族哈尼族拉祜族自治县"
                    },
                    {
                        "name":"江城哈尼族彝族自治县"
                    },
                    {
                        "name":"孟连傣族拉祜族佤族自治县"
                    },
                    {
                        "name":"澜沧拉祜族自治县"
                    },
                    {
                        "name":"西盟佤族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"临沧",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"临翔区"
                    },
                    {
                        "name":"凤庆县"
                    },
                    {
                        "name":"云县"
                    },
                    {
                        "name":"永德县"
                    },
                    {
                        "name":"镇康县"
                    },
                    {
                        "name":"双江拉祜族佤族布朗族傣族自治县"
                    },
                    {
                        "name":"耿马傣族佤族自治县"
                    },
                    {
                        "name":"沧源佤族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"德宏傣族景颇族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"潞西市"
                    },
                    {
                        "name":"瑞丽市"
                    },
                    {
                        "name":"梁河县"
                    },
                    {
                        "name":"盈江县"
                    },
                    {
                        "name":"陇川县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"怒江傈僳族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"泸水县"
                    },
                    {
                        "name":"福贡县"
                    },
                    {
                        "name":"贡山独龙族怒族自治县"
                    },
                    {
                        "name":"兰坪白族普米族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"迪庆藏族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"香格里拉县"
                    },
                    {
                        "name":"德钦县"
                    },
                    {
                        "name":"维西傈僳族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"大理白族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"大理市"
                    },
                    {
                        "name":"祥云县"
                    },
                    {
                        "name":"宾川县"
                    },
                    {
                        "name":"弥渡县"
                    },
                    {
                        "name":"永平县"
                    },
                    {
                        "name":"云龙县"
                    },
                    {
                        "name":"洱源县"
                    },
                    {
                        "name":"剑川县"
                    },
                    {
                        "name":"鹤庆县"
                    },
                    {
                        "name":"漾濞彝族自治县"
                    },
                    {
                        "name":"南涧彝族自治县"
                    },
                    {
                        "name":"巍山彝族回族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"楚雄彝族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"楚雄市"
                    },
                    {
                        "name":"双柏县"
                    },
                    {
                        "name":"牟定县"
                    },
                    {
                        "name":"南华县"
                    },
                    {
                        "name":"姚安县"
                    },
                    {
                        "name":"大姚县"
                    },
                    {
                        "name":"永仁县"
                    },
                    {
                        "name":"元谋县"
                    },
                    {
                        "name":"武定县"
                    },
                    {
                        "name":"禄丰县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"红河哈尼族彝族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"蒙自县"
                    },
                    {
                        "name":"个旧市"
                    },
                    {
                        "name":"开远市"
                    },
                    {
                        "name":"绿春县"
                    },
                    {
                        "name":"建水县"
                    },
                    {
                        "name":"石屏县"
                    },
                    {
                        "name":"弥勒县"
                    },
                    {
                        "name":"泸西县"
                    },
                    {
                        "name":"元阳县"
                    },
                    {
                        "name":"红河县"
                    },
                    {
                        "name":"金平苗族瑶族傣族自治县"
                    },
                    {
                        "name":"河口瑶族自治县"
                    },
                    {
                        "name":"屏边苗族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"文山壮族苗族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"文山县"
                    },
                    {
                        "name":"砚山县"
                    },
                    {
                        "name":"西畴县"
                    },
                    {
                        "name":"麻栗坡县"
                    },
                    {
                        "name":"马关县"
                    },
                    {
                        "name":"丘北县"
                    },
                    {
                        "name":"广南县"
                    },
                    {
                        "name":"富宁县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"西双版纳傣族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"景洪市"
                    },
                    {
                        "name":"勐海县"
                    },
                    {
                        "name":"勐腊县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"西藏",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"拉萨",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"城关区"
                    },
                    {
                        "name":"林周县"
                    },
                    {
                        "name":"当雄县"
                    },
                    {
                        "name":"尼木县"
                    },
                    {
                        "name":"曲水县"
                    },
                    {
                        "name":"堆龙德庆县"
                    },
                    {
                        "name":"达孜县"
                    },
                    {
                        "name":"墨竹工卡县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"那曲地区",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"那曲县"
                    },
                    {
                        "name":"嘉黎县"
                    },
                    {
                        "name":"比如县"
                    },
                    {
                        "name":"聂荣县"
                    },
                    {
                        "name":"安多县"
                    },
                    {
                        "name":"申扎县"
                    },
                    {
                        "name":"索县"
                    },
                    {
                        "name":"班戈县"
                    },
                    {
                        "name":"巴青县"
                    },
                    {
                        "name":"尼玛县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"昌都地区",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"昌都县"
                    },
                    {
                        "name":"江达县"
                    },
                    {
                        "name":"贡觉县"
                    },
                    {
                        "name":"类乌齐县"
                    },
                    {
                        "name":"丁青县"
                    },
                    {
                        "name":"察雅县"
                    },
                    {
                        "name":"八宿县"
                    },
                    {
                        "name":"左贡县"
                    },
                    {
                        "name":"芒康县"
                    },
                    {
                        "name":"洛隆县"
                    },
                    {
                        "name":"边坝县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"林芝地区",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"林芝县"
                    },
                    {
                        "name":"工布江达县"
                    },
                    {
                        "name":"米林县"
                    },
                    {
                        "name":"墨脱县"
                    },
                    {
                        "name":"波密县"
                    },
                    {
                        "name":"察隅县"
                    },
                    {
                        "name":"朗县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"山南地区",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"乃东县"
                    },
                    {
                        "name":"扎囊县"
                    },
                    {
                        "name":"贡嘎县"
                    },
                    {
                        "name":"桑日县"
                    },
                    {
                        "name":"琼结县"
                    },
                    {
                        "name":"曲松县"
                    },
                    {
                        "name":"措美县"
                    },
                    {
                        "name":"洛扎县"
                    },
                    {
                        "name":"加查县"
                    },
                    {
                        "name":"隆子县"
                    },
                    {
                        "name":"错那县"
                    },
                    {
                        "name":"浪卡子县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"日喀则地区",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"日喀则市"
                    },
                    {
                        "name":"南木林县"
                    },
                    {
                        "name":"江孜县"
                    },
                    {
                        "name":"定日县"
                    },
                    {
                        "name":"萨迦县"
                    },
                    {
                        "name":"拉孜县"
                    },
                    {
                        "name":"昂仁县"
                    },
                    {
                        "name":"谢通门县"
                    },
                    {
                        "name":"白朗县"
                    },
                    {
                        "name":"仁布县"
                    },
                    {
                        "name":"康马县"
                    },
                    {
                        "name":"定结县"
                    },
                    {
                        "name":"仲巴县"
                    },
                    {
                        "name":"亚东县"
                    },
                    {
                        "name":"吉隆县"
                    },
                    {
                        "name":"聂拉木县"
                    },
                    {
                        "name":"萨嘎县"
                    },
                    {
                        "name":"岗巴县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"阿里地区",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"噶尔县"
                    },
                    {
                        "name":"普兰县"
                    },
                    {
                        "name":"札达县"
                    },
                    {
                        "name":"日土县"
                    },
                    {
                        "name":"革吉县"
                    },
                    {
                        "name":"改则县"
                    },
                    {
                        "name":"措勤县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"海南",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"海口",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"龙华区"
                    },
                    {
                        "name":"秀英区"
                    },
                    {
                        "name":"琼山区"
                    },
                    {
                        "name":"美兰区"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"三亚",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"三亚市"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"五指山",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"琼海",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"儋州",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"文昌",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"万宁",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"东方",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"澄迈县",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"定安县",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"屯昌县",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"临高县",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"白沙黎族自治县",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"昌江黎族自治县",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"乐东黎族自治县",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"陵水黎族自治县",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"保亭黎族苗族自治县",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"琼中黎族苗族自治县",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"甘肃",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"兰州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"城关区"
                    },
                    {
                        "name":"七里河区"
                    },
                    {
                        "name":"西固区"
                    },
                    {
                        "name":"安宁区"
                    },
                    {
                        "name":"红古区"
                    },
                    {
                        "name":"永登县"
                    },
                    {
                        "name":"皋兰县"
                    },
                    {
                        "name":"榆中县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"嘉峪关",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"嘉峪关市"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"金昌",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"金川区"
                    },
                    {
                        "name":"永昌县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"白银",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"白银区"
                    },
                    {
                        "name":"平川区"
                    },
                    {
                        "name":"靖远县"
                    },
                    {
                        "name":"会宁县"
                    },
                    {
                        "name":"景泰县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"天水",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"清水县"
                    },
                    {
                        "name":"秦安县"
                    },
                    {
                        "name":"甘谷县"
                    },
                    {
                        "name":"武山县"
                    },
                    {
                        "name":"张家川回族自治县"
                    },
                    {
                        "name":"北道区"
                    },
                    {
                        "name":"秦城区"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"武威",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"凉州区"
                    },
                    {
                        "name":"民勤县"
                    },
                    {
                        "name":"古浪县"
                    },
                    {
                        "name":"天祝藏族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"酒泉",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"肃州区"
                    },
                    {
                        "name":"玉门市"
                    },
                    {
                        "name":"敦煌市"
                    },
                    {
                        "name":"金塔县"
                    },
                    {
                        "name":"肃北蒙古族自治县"
                    },
                    {
                        "name":"阿克塞哈萨克族自治县"
                    },
                    {
                        "name":"安西县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"张掖",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"甘州区"
                    },
                    {
                        "name":"民乐县"
                    },
                    {
                        "name":"临泽县"
                    },
                    {
                        "name":"高台县"
                    },
                    {
                        "name":"山丹县"
                    },
                    {
                        "name":"肃南裕固族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"庆阳",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"西峰区"
                    },
                    {
                        "name":"庆城县"
                    },
                    {
                        "name":"环县"
                    },
                    {
                        "name":"华池县"
                    },
                    {
                        "name":"合水县"
                    },
                    {
                        "name":"正宁县"
                    },
                    {
                        "name":"宁县"
                    },
                    {
                        "name":"镇原县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"平凉",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"崆峒区"
                    },
                    {
                        "name":"泾川县"
                    },
                    {
                        "name":"灵台县"
                    },
                    {
                        "name":"崇信县"
                    },
                    {
                        "name":"华亭县"
                    },
                    {
                        "name":"庄浪县"
                    },
                    {
                        "name":"静宁县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"定西",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"安定区"
                    },
                    {
                        "name":"通渭县"
                    },
                    {
                        "name":"临洮县"
                    },
                    {
                        "name":"漳县"
                    },
                    {
                        "name":"岷县"
                    },
                    {
                        "name":"渭源县"
                    },
                    {
                        "name":"陇西县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"陇南",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"武都区"
                    },
                    {
                        "name":"成县"
                    },
                    {
                        "name":"宕昌县"
                    },
                    {
                        "name":"康县"
                    },
                    {
                        "name":"文县"
                    },
                    {
                        "name":"西和县"
                    },
                    {
                        "name":"礼县"
                    },
                    {
                        "name":"两当县"
                    },
                    {
                        "name":"徽县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"临夏回族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"临夏市"
                    },
                    {
                        "name":"临夏县"
                    },
                    {
                        "name":"康乐县"
                    },
                    {
                        "name":"永靖县"
                    },
                    {
                        "name":"广河县"
                    },
                    {
                        "name":"和政县"
                    },
                    {
                        "name":"东乡族自治县"
                    },
                    {
                        "name":"积石山保安族东乡族撒拉族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"甘南藏族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"合作市"
                    },
                    {
                        "name":"临潭县"
                    },
                    {
                        "name":"卓尼县"
                    },
                    {
                        "name":"舟曲县"
                    },
                    {
                        "name":"迭部县"
                    },
                    {
                        "name":"玛曲县"
                    },
                    {
                        "name":"碌曲县"
                    },
                    {
                        "name":"夏河县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"宁夏",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"银川",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"兴庆区"
                    },
                    {
                        "name":"西夏区"
                    },
                    {
                        "name":"金凤区"
                    },
                    {
                        "name":"灵武市"
                    },
                    {
                        "name":"永宁县"
                    },
                    {
                        "name":"贺兰县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"石嘴山",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"大武口区"
                    },
                    {
                        "name":"惠农区"
                    },
                    {
                        "name":"平罗县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"吴忠",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"利通区"
                    },
                    {
                        "name":"青铜峡市"
                    },
                    {
                        "name":"盐池县"
                    },
                    {
                        "name":"同心县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"固原",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"原州区"
                    },
                    {
                        "name":"西吉县"
                    },
                    {
                        "name":"隆德县"
                    },
                    {
                        "name":"泾源县"
                    },
                    {
                        "name":"彭阳县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"中卫",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"沙坡头区"
                    },
                    {
                        "name":"中宁县"
                    },
                    {
                        "name":"海原县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"青海",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"西宁",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"城中区"
                    },
                    {
                        "name":"城东区"
                    },
                    {
                        "name":"城西区"
                    },
                    {
                        "name":"城北区"
                    },
                    {
                        "name":"湟源县"
                    },
                    {
                        "name":"湟中县"
                    },
                    {
                        "name":"大通回族土族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"海东地区",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"平安县"
                    },
                    {
                        "name":"乐都县"
                    },
                    {
                        "name":"民和回族土族自治县"
                    },
                    {
                        "name":"互助土族自治县"
                    },
                    {
                        "name":"化隆回族自治县"
                    },
                    {
                        "name":"循化撒拉族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"海北藏族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"海晏县"
                    },
                    {
                        "name":"祁连县"
                    },
                    {
                        "name":"刚察县"
                    },
                    {
                        "name":"门源回族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"海南藏族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"共和县"
                    },
                    {
                        "name":"同德县"
                    },
                    {
                        "name":"贵德县"
                    },
                    {
                        "name":"兴海县"
                    },
                    {
                        "name":"贵南县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"黄南藏族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"同仁县"
                    },
                    {
                        "name":"尖扎县"
                    },
                    {
                        "name":"泽库县"
                    },
                    {
                        "name":"河南蒙古族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"果洛藏族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"玛沁县"
                    },
                    {
                        "name":"班玛县"
                    },
                    {
                        "name":"甘德县"
                    },
                    {
                        "name":"达日县"
                    },
                    {
                        "name":"久治县"
                    },
                    {
                        "name":"玛多县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"玉树藏族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"玉树县"
                    },
                    {
                        "name":"杂多县"
                    },
                    {
                        "name":"称多县"
                    },
                    {
                        "name":"治多县"
                    },
                    {
                        "name":"囊谦县"
                    },
                    {
                        "name":"曲麻莱县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"海西蒙古族藏族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"德令哈市"
                    },
                    {
                        "name":"格尔木市"
                    },
                    {
                        "name":"乌兰县"
                    },
                    {
                        "name":"都兰县"
                    },
                    {
                        "name":"天峻县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"新疆",
        "sub":[
            {
                "name":"请选择",
                "sub":[

                ]
            },
            {
                "name":"乌鲁木齐",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"天山区"
                    },
                    {
                        "name":"沙依巴克区"
                    },
                    {
                        "name":"新市区"
                    },
                    {
                        "name":"水磨沟区"
                    },
                    {
                        "name":"头屯河区"
                    },
                    {
                        "name":"达坂城区"
                    },
                    {
                        "name":"东山区"
                    },
                    {
                        "name":"乌鲁木齐县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"克拉玛依",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"克拉玛依区"
                    },
                    {
                        "name":"独山子区"
                    },
                    {
                        "name":"白碱滩区"
                    },
                    {
                        "name":"乌尔禾区"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"吐鲁番地区",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"吐鲁番市"
                    },
                    {
                        "name":"托克逊县"
                    },
                    {
                        "name":"鄯善县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"哈密地区",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"哈密市"
                    },
                    {
                        "name":"伊吾县"
                    },
                    {
                        "name":"巴里坤哈萨克自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"和田地区",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"和田市"
                    },
                    {
                        "name":"和田县"
                    },
                    {
                        "name":"洛浦县"
                    },
                    {
                        "name":"民丰县"
                    },
                    {
                        "name":"皮山县"
                    },
                    {
                        "name":"策勒县"
                    },
                    {
                        "name":"于田县"
                    },
                    {
                        "name":"墨玉县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"阿克苏地区",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"阿克苏市"
                    },
                    {
                        "name":"温宿县"
                    },
                    {
                        "name":"沙雅县"
                    },
                    {
                        "name":"拜城县"
                    },
                    {
                        "name":"阿瓦提县"
                    },
                    {
                        "name":"库车县"
                    },
                    {
                        "name":"柯坪县"
                    },
                    {
                        "name":"新和县"
                    },
                    {
                        "name":"乌什县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"喀什地区",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"喀什市"
                    },
                    {
                        "name":"巴楚县"
                    },
                    {
                        "name":"泽普县"
                    },
                    {
                        "name":"伽师县"
                    },
                    {
                        "name":"叶城县"
                    },
                    {
                        "name":"岳普湖县"
                    },
                    {
                        "name":"疏勒县"
                    },
                    {
                        "name":"麦盖提县"
                    },
                    {
                        "name":"英吉沙县"
                    },
                    {
                        "name":"莎车县"
                    },
                    {
                        "name":"疏附县"
                    },
                    {
                        "name":"塔什库尔干塔吉克自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"克孜勒苏柯尔克孜自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"阿图什市"
                    },
                    {
                        "name":"阿合奇县"
                    },
                    {
                        "name":"乌恰县"
                    },
                    {
                        "name":"阿克陶县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"巴音郭楞蒙古自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"库尔勒市"
                    },
                    {
                        "name":"和静县"
                    },
                    {
                        "name":"尉犁县"
                    },
                    {
                        "name":"和硕县"
                    },
                    {
                        "name":"且末县"
                    },
                    {
                        "name":"博湖县"
                    },
                    {
                        "name":"轮台县"
                    },
                    {
                        "name":"若羌县"
                    },
                    {
                        "name":"焉耆回族自治县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"昌吉回族自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"昌吉市"
                    },
                    {
                        "name":"阜康市"
                    },
                    {
                        "name":"奇台县"
                    },
                    {
                        "name":"玛纳斯县"
                    },
                    {
                        "name":"吉木萨尔县"
                    },
                    {
                        "name":"呼图壁县"
                    },
                    {
                        "name":"木垒哈萨克自治县"
                    },
                    {
                        "name":"米泉市"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"博尔塔拉蒙古自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"博乐市"
                    },
                    {
                        "name":"精河县"
                    },
                    {
                        "name":"温泉县"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"石河子",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"阿拉尔",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"图木舒克",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"五家渠",
                "sub":[

                ],
                "type":0
            },
            {
                "name":"伊犁哈萨克自治州",
                "sub":[
                    {
                        "name":"请选择"
                    },
                    {
                        "name":"伊宁市"
                    },
                    {
                        "name":"奎屯市"
                    },
                    {
                        "name":"伊宁县"
                    },
                    {
                        "name":"特克斯县"
                    },
                    {
                        "name":"尼勒克县"
                    },
                    {
                        "name":"昭苏县"
                    },
                    {
                        "name":"新源县"
                    },
                    {
                        "name":"霍城县"
                    },
                    {
                        "name":"巩留县"
                    },
                    {
                        "name":"察布查尔锡伯自治县"
                    },
                    {
                        "name":"塔城地区"
                    },
                    {
                        "name":"阿勒泰地区"
                    },
                    {
                        "name":"其他"
                    }
                ],
                "type":0
            },
            {
                "name":"其他"
            }
        ],
        "type":1
    },
    {
        "name":"香港",
        "sub":[
            {
                "name":"请选择"
            },
            {
                "name":"中西区"
            },
            {
                "name":"湾仔区"
            },
            {
                "name":"东区"
            },
            {
                "name":"南区"
            },
            {
                "name":"深水埗区"
            },
            {
                "name":"油尖旺区"
            },
            {
                "name":"九龙城区"
            },
            {
                "name":"黄大仙区"
            },
            {
                "name":"观塘区"
            },
            {
                "name":"北区"
            },
            {
                "name":"大埔区"
            },
            {
                "name":"沙田区"
            },
            {
                "name":"西贡区"
            },
            {
                "name":"元朗区"
            },
            {
                "name":"屯门区"
            },
            {
                "name":"荃湾区"
            },
            {
                "name":"葵青区"
            },
            {
                "name":"离岛区"
            },
            {
                "name":"其他"
            }
        ],
        "type":0
    },
    {
        "name":"澳门",
        "sub":[
            {
                "name":"请选择"
            },
            {
                "name":"花地玛堂区"
            },
            {
                "name":"圣安多尼堂区"
            },
            {
                "name":"大堂区"
            },
            {
                "name":"望德堂区"
            },
            {
                "name":"风顺堂区"
            },
            {
                "name":"嘉模堂区"
            },
            {
                "name":"圣方济各堂区"
            },
            {
                "name":"路凼"
            },
            {
                "name":"其他"
            }
        ],
        "type":0
    },
    {
        "name":"台湾",
        "sub":[
            {
                "name":"请选择"
            },
            {
                "name":"台北市"
            },
            {
                "name":"高雄市"
            },
            {
                "name":"台北县"
            },
            {
                "name":"桃园县"
            },
            {
                "name":"新竹县"
            },
            {
                "name":"苗栗县"
            },
            {
                "name":"台中县"
            },
            {
                "name":"彰化县"
            },
            {
                "name":"南投县"
            },
            {
                "name":"云林县"
            },
            {
                "name":"嘉义县"
            },
            {
                "name":"台南县"
            },
            {
                "name":"高雄县"
            },
            {
                "name":"屏东县"
            },
            {
                "name":"宜兰县"
            },
            {
                "name":"花莲县"
            },
            {
                "name":"台东县"
            },
            {
                "name":"澎湖县"
            },
            {
                "name":"基隆市"
            },
            {
                "name":"新竹市"
            },
            {
                "name":"台中市"
            },
            {
                "name":"嘉义市"
            },
            {
                "name":"台南市"
            },
            {
                "name":"其他"
            }
        ],
        "type":0
    },
    {
        "name":"海外",
        "sub":[
            {
                "name":"请选择"
            },
            {
                "name":"其他"
            }
        ],
        "type":0
    }
];

}(Zepto);
// jshint ignore: end

/* jshint unused:false*/

+ function($) {
    "use strict";
    var format = function(data) {
        var result = [];
        for(var i=0;i<data.length;i++) {
            var d = data[i];
            if(d.name === "请选择") continue;
            result.push(d.name);
        }
        if(result.length) return result;
        return [""];
    };

    var sub = function(data) {
        if(!data.sub) return [""];
        return format(data.sub);
    };

    var getCities = function(d) {
        for(var i=0;i< raw.length;i++) {
            if(raw[i].name === d) return sub(raw[i]);
        }
        return [""];
    };

    var getDistricts = function(p, c) {
        for(var i=0;i< raw.length;i++) {
            if(raw[i].name === p) {
                for(var j=0;j< raw[i].sub.length;j++) {
                    if(raw[i].sub[j].name === c) {
                        return sub(raw[i].sub[j]);
                    }
                }
            }
        }
        return [""];
    };

    var raw = $.smConfig.rawCitiesData;
    var provinces = raw.map(function(d) {
        return d.name;
    });
    var initCities = sub(raw[0]);
    var initDistricts = [""];

    var currentProvince = provinces[0];
    var currentCity = initCities[0];
    var currentDistrict = initDistricts[0];

    var t;
    var defaults = {

        cssClass: "city-picker",
        rotateEffect: false,  //为了性能

        onChange: function (picker, values, displayValues) {
            var newProvince = picker.cols[0].value;
            var newCity;
            if(newProvince !== currentProvince) {
                // 如果Province变化，节流以提高reRender性能
                clearTimeout(t);

                t = setTimeout(function(){
                    var newCities = getCities(newProvince);
                    newCity = newCities[0];
                    var newDistricts = getDistricts(newProvince, newCity);
                    picker.cols[1].replaceValues(newCities);
                    picker.cols[2].replaceValues(newDistricts);
                    currentProvince = newProvince;
                    currentCity = newCity;
                    picker.updateValue();
                }, 200);
                return;
            }
            newCity = picker.cols[1].value;
            if(newCity !== currentCity) {
                picker.cols[2].replaceValues(getDistricts(newProvince, newCity));
                currentCity = newCity;
                picker.updateValue();
            }
        },

        cols: [
        {
            textAlign: 'center',
            values: provinces,
            cssClass: "col-province"
        },
        {
            textAlign: 'center',
            values: initCities,
            cssClass: "col-city"
        },
        {
            textAlign: 'center',
            values: initDistricts,
            cssClass: "col-district"
        }
        ]
    };

    $.fn.cityPicker = function(params) {
        return this.each(function() {
            if(!this) return;
            var p = $.extend(defaults, params);
            //计算value
            if (p.value) {
                $(this).val(p.value.join(' '));
            } else {
                var val = $(this).val();
                val && (p.value = val.split(' '));
            }

            if (p.value) {
                //p.value = val.split(" ");
                if(p.value[0]) {
                    currentProvince = p.value[0];
                    p.cols[1].values = getCities(p.value[0]);
                }
                if(p.value[1]) {
                    currentCity = p.value[1];
                    p.cols[2].values = getDistricts(p.value[0], p.value[1]);
                } else {
                    p.cols[2].values = getDistricts(p.value[0], p.cols[1].values[0]);
                }
                !p.value[2] && (p.value[2] = '');
                currentDistrict = p.value[2];
            }
            $(this).picker(p);
        });
    };

}(Zepto);

/*===============================================================================
************   Countup   ************
===============================================================================*/
/* global Zepto:true */
+ function($) {
	"use strict";
	$.fn.countup = function(params) {
		var CountUp = function(target, startVal, endVal, decimals, duration, options) {
			var lastTime = 0;
			var vendors = ['webkit', 'moz', 'ms', 'o'];
			for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
				window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
				window.cancelAnimationFrame =
					window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
			}
			if (!window.requestAnimationFrame) {
				window.requestAnimationFrame = function(callback, element) {
					var currTime = new Date().getTime();
					var timeToCall = Math.max(0, 16 - (currTime - lastTime));
					var id = window.setTimeout(function() {
							callback(currTime + timeToCall);
						},
						timeToCall);
					lastTime = currTime + timeToCall;
					return id;
				};
			}
			if (!window.cancelAnimationFrame) {
				window.cancelAnimationFrame = function(id) {
					clearTimeout(id);
				};
			}

			var self = this;

			// default options
			self.options = {
				useEasing: true, // toggle easing
				useGrouping: true, // 1,000,000 vs 1000000
				separator: ',', // character to use as a separator
				decimal: '.', // character to use as a decimal
				easingFn: null, // optional custom easing closure function, default is Robert Penner's easeOutExpo
				formattingFn: null // optional custom formatting function, default is self.formatNumber below
			};
			// extend default options with passed options object
			for (var key in options) {
				if (options.hasOwnProperty(key)) {
					self.options[key] = options[key];
				}
			}
			if (self.options.separator === '') {
				self.options.useGrouping = false;
			}
			if (!self.options.prefix) self.options.prefix = '';
			if (!self.options.suffix) self.options.suffix = '';

			self.d = (typeof target === 'string') ? document.getElementById(target) : target;
			self.startVal = Number(startVal);
			self.endVal = Number(endVal);
			self.countDown = (self.startVal > self.endVal);
			self.frameVal = self.startVal;
			self.decimals = Math.max(0, decimals || 0);
			self.dec = Math.pow(10, self.decimals);
			self.duration = Number(duration) * 1000 || 2000;

			self.formatNumber = function(nStr) {
				nStr = nStr.toFixed(self.decimals);
				nStr += '';
				var x, x1, x2, rgx;
				x = nStr.split('.');
				x1 = x[0];
				x2 = x.length > 1 ? self.options.decimal + x[1] : '';
				rgx = /(\d+)(\d{3})/;
				if (self.options.useGrouping) {
					while (rgx.test(x1)) {
						x1 = x1.replace(rgx, '$1' + self.options.separator + '$2');
					}
				}
				return self.options.prefix + x1 + x2 + self.options.suffix;
			};
			// Robert Penner's easeOutExpo
			self.easeOutExpo = function(t, b, c, d) {
				return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
			};

			self.easingFn = self.options.easingFn ? self.options.easingFn : self.easeOutExpo;
			self.formattingFn = self.options.formattingFn ? self.options.formattingFn : self.formatNumber;

			self.version = function() {
				return '1.7.1';
			};

			// Print value to target
			self.printValue = function(value) {
				var result = self.formattingFn(value);

				if (self.d.tagName === 'INPUT') {
					this.d.value = result;
				} else if (self.d.tagName === 'text' || self.d.tagName === 'tspan') {
					this.d.textContent = result;
				} else {
					this.d.innerHTML = result;
				}
			};

			self.count = function(timestamp) {

				if (!self.startTime) {
					self.startTime = timestamp;
				}

				self.timestamp = timestamp;
				var progress = timestamp - self.startTime;
				self.remaining = self.duration - progress;

				// to ease or not to ease
				if (self.options.useEasing) {
					if (self.countDown) {
						self.frameVal = self.startVal - self.easingFn(progress, 0, self.startVal - self.endVal, self.duration);
					} else {
						self.frameVal = self.easingFn(progress, self.startVal, self.endVal - self.startVal, self.duration);
					}
				} else {
					if (self.countDown) {
						self.frameVal = self.startVal - ((self.startVal - self.endVal) * (progress / self.duration));
					} else {
						self.frameVal = self.startVal + (self.endVal - self.startVal) * (progress / self.duration);
					}
				}

				// don't go past endVal since progress can exceed duration in the last frame
				if (self.countDown) {
					self.frameVal = (self.frameVal < self.endVal) ? self.endVal : self.frameVal;
				} else {
					self.frameVal = (self.frameVal > self.endVal) ? self.endVal : self.frameVal;
				}

				// decimal
				self.frameVal = Math.round(self.frameVal * self.dec) / self.dec;

				// format and print value
				self.printValue(self.frameVal);

				// whether to continue
				if (progress < self.duration) {
					self.rAF = requestAnimationFrame(self.count);
				} else {
					if (self.callback) {
						self.callback();
					}
				}
			};
			// start your animation
			self.start = function(callback) {
				self.callback = callback;
				self.rAF = requestAnimationFrame(self.count);
				return false;
			};
			// toggles pause/resume animation
			self.pauseResume = function() {
				if (!self.paused) {
					self.paused = true;
					cancelAnimationFrame(self.rAF);
				} else {
					self.paused = false;
					delete self.startTime;
					self.duration = self.remaining;
					self.startVal = self.frameVal;
					requestAnimationFrame(self.count);
				}
			};
			// reset to startVal so animation can be run again
			self.reset = function() {
				self.paused = false;
				delete self.startTime;
				self.startVal = startVal;
				cancelAnimationFrame(self.rAF);
				self.printValue(self.startVal);
			};
			// pass a new endVal and start animation
			self.update = function(newEndVal) {
				cancelAnimationFrame(self.rAF);
				self.paused = false;
				delete self.startTime;
				self.startVal = self.frameVal;
				self.endVal = Number(newEndVal);
				self.countDown = (self.startVal > self.endVal);
				self.rAF = requestAnimationFrame(self.count);
			};

			// format startVal on initialization
			self.printValue(self.startVal);
		};
		var defaults = {
			startVal: 0,
			decimals: 0,
			duration: 2,
		};

		if (typeof params === 'number') {
			defaults.endVal = params;
		} else if (typeof params === 'object') {
			$.extend(defaults, params);
		} else {
			console.error('countUp requires its argument to be either an object or number');
			return;
		}
		var countUp = new CountUp(this.attr("id"), defaults.startVal, defaults.endVal, defaults.decimals, defaults.duration, defaults.options);

		countUp.start();



	}
}(Zepto);
/* jshint unused:false*/

+ function($) {
    "use strict";

    var today = new Date();

    var getDays = function(max) {
        var days = [];
        for(var i=1; i<= (max||31);i++) {
            days.push(i < 10 ? "0"+i : i);
        }
        return days;
    };

    var getDaysByMonthAndYear = function(month, year) {
        var int_d = new Date(year, parseInt(month)+1-1, 1);
        var d = new Date(int_d - 1);
        return getDays(d.getDate());
    };

    var formatNumber = function (n) {
        return n < 10 ? "0" + n : n;
    };

    var initMonthes = ('01 02 03 04 05 06 07 08 09 10 11 12').split(' ');

    var initYears = (function () {
        var arr = [];
        for (var i = 1950; i <= 2030; i++) { arr.push(i); }
        return arr;
    })();


    var defaults = {

        rotateEffect: false,  //为了性能

        value: [today.getFullYear(), formatNumber(today.getMonth()+1), formatNumber(today.getDate()), today.getHours(), formatNumber(today.getMinutes())],

        onChange: function (picker, values, displayValues) {
            var days = getDaysByMonthAndYear(picker.cols[1].value, picker.cols[0].value);
            var currentValue = picker.cols[2].value;
            if(currentValue > days.length) currentValue = days.length;
            picker.cols[2].setValue(currentValue);
        },

        formatValue: function (p, values, displayValues) {
            return displayValues[0] + '-' + values[1] + '-' + values[2] + ' ' + values[3] + ':' + values[4];
        },

        cols: [
            // Years
        {
            values: initYears
        },
        // Months
        {
            values: initMonthes
        },
        // Days
        {
            values: getDays()
        },

        // Space divider
        {
            divider: true,
            content: '  '
        },
        // Hours
        {
            values: (function () {
                var arr = [];
                for (var i = 0; i <= 23; i++) { arr.push(i); }
                return arr;
            })(),
        },
        // Divider
        {
            divider: true,
            content: ':'
        },
        // Minutes
        {
            values: (function () {
                var arr = [];
                for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                return arr;
            })(),
        }
        ]
    };

    $.fn.datetimePicker = function(params) {
        return this.each(function() {
            if(!this) return;
            var p = $.extend(defaults, params);
            $(this).picker(p);
            if (params.value) $(this).val(p.formatValue(p, p.value, p.value));
        });
    };

}(Zepto);

/* ===============================================================================
************   Tabs   ************
=============================================================================== */
+function ($) {
    "use strict";
    $.initFixedTab = function(){
        var $fixedTab = $('.fixed-tab');
        if ($fixedTab.length === 0) return;
        $('.fixed-tab').fixedTab();//默认{offset: 0}
    };
    var FixedTab = function(pageContent, _options) {
        var $pageContent = this.$pageContent = $(pageContent);
        var shadow = $pageContent.clone();
        var fixedTop = $pageContent[0].getBoundingClientRect().top;

        shadow.css('visibility', 'hidden');
        this.options = $.extend({}, this._defaults, {
            fixedTop: fixedTop,
            shadow: shadow,
            offset: 0
        }, _options);

        this._bindEvents();
    };

    FixedTab.prototype = {
        _defaults: {
            offset: 0,
        },
        _bindEvents: function() {
            this.$pageContent.parents('.content').on('scroll', this._scrollHandler.bind(this));
            this.$pageContent.on('active', '.tab-link', this._tabLinkHandler.bind(this));
        },
        _tabLinkHandler: function(ev) {
            var isFixed = $(ev.target).parents('.buttons-fixed').length > 0;
            var fixedTop = this.options.fixedTop;
            var offset = this.options.offset;
            $.refreshScroller();
            if (!isFixed) return;
            this.$pageContent.parents('.content').scrollTop(fixedTop - offset);
        },
        // 滚动核心代码
        _scrollHandler: function(ev) {
            var $scroller = $(ev.target);
            var $pageContent = this.$pageContent;
            var shadow = this.options.shadow;
            var offset = this.options.offset;
            var fixedTop = this.options.fixedTop;
            var scrollTop = $scroller.scrollTop();
            var isFixed = scrollTop >= fixedTop - offset;
            if (isFixed) {
                shadow.insertAfter($pageContent);
                $pageContent.addClass('buttons-fixed').css('top', offset);
            } else {
                shadow.remove();
                $pageContent.removeClass('buttons-fixed').css('top', 0);
            }
        }
    };

    //FixedTab PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        var args = Array.apply(null, arguments);
        args.shift();
        this.each(function() {
            var $this = $(this);
            var options = $.extend({}, $this.dataset(), typeof option === 'object' && option);
            var data = $this.data('fixedtab');
            if (!data) {
                //获取data-api的
                $this.data('fixedtab', (data = new FixedTab(this, options)));
            }
        });

    }
    $.fn.fixedTab = Plugin;
    $.fn.fixedTab.Constructor = FixedTab;
    $(document).on('pageInit',function(){
        $.initFixedTab();
    });



}(Zepto);

+ function($) {
    'use strict';

    function handleInfiniteScroll() {
        /*jshint validthis:true */
        var inf = $(this);
        var scroller = $.getScroller(inf);
        var scrollTop = scroller.scrollTop();
        var scrollHeight = scroller.scrollHeight();
        var height = inf[0].offsetHeight;
        var distance = inf[0].getAttribute('data-distance');
        var virtualListContainer = inf.find('.virtual-list');
        var virtualList;
        var onTop = inf.hasClass('infinite-scroll-top');
        if (!distance) distance = 50;
        if (typeof distance === 'string' && distance.indexOf('%') >= 0) {
            distance = parseInt(distance, 10) / 100 * height;
        }
        if (distance > height) distance = height;
        if (onTop) {
            if (scrollTop < distance) {
                inf.trigger('infinite');
            }
        } else {
            if (scrollTop + height >= scrollHeight - distance) {
                if (virtualListContainer.length > 0) {
                    virtualList = virtualListContainer[0].f7VirtualList;
                    if (virtualList && !virtualList.reachEnd) return;
                }
                inf.trigger('infinite');
            }
        }

    }
    $.attachInfiniteScroll = function(infiniteContent) {
        $.getScroller(infiniteContent).on('scroll', handleInfiniteScroll);
    };
    $.detachInfiniteScroll = function(infiniteContent) {
        $.getScroller(infiniteContent).off('scroll', handleInfiniteScroll);
    };

    $.initInfiniteScroll = function(pageContainer) {
        pageContainer = $(pageContainer);
        var infiniteContent = pageContainer.hasClass('infinite-scroll')?pageContainer:pageContainer.find('.infinite-scroll');
        if (infiniteContent.length === 0) return;
        $.attachInfiniteScroll(infiniteContent);
        //如果是顶部无限刷新，要将滚动条初始化于最下端
        pageContainer.forEach(function(v){
            if($(v).hasClass('infinite-scroll-top')){
                var height = v.scrollHeight - v.clientHeight;
                $(v).scrollTop(height);
            }
        });
        function detachEvents() {
            $.detachInfiniteScroll(infiniteContent);
            pageContainer.off('pageBeforeRemove', detachEvents);
        }
        pageContainer.on('pageBeforeRemove', detachEvents);
    };
}(Zepto);

/*jshint unused: false*/
+function($) {
    'use strict';

    var getPage = function() {
        var $page = $(".page-current");
        if (!$page[0]) $page = $(".page").addClass('page-current');
        return $page;
    };

    //初始化页面中的JS组件
    $.initPage = function(page) {
        var $page = getPage();
        if (!$page[0]) $page = $(document.body);
        var $content = $page.hasClass('content') ?
                       $page :
                       $page.find('.content');
        $content.scroller();  //注意滚动条一定要最先初始化

        $.initPullToRefresh($content);
        $.initInfiniteScroll($content);
        $.initCalendar($content);

        //extend
        if ($.initSwiper) $.initSwiper($content);
    };

    if ($.smConfig.showPageLoadingIndicator) {
        //这里的 以 push 开头的是私有事件，不要用
        $(window).on('pageLoadStart', function() {
            $.showIndicator();

        });
        $(window).on('pageAnimationStart', function() {
            $.hideIndicator();
        });
        $(window).on('pageLoadCancel', function() {
            $.hideIndicator();
        });
        $(window).on('pageLoadComplete', function() {
            $.hideIndicator();
        });
        $(window).on('pageLoadError', function() {
            $.hideIndicator();
            $.toast('加载失败');
        });
    }

    $(window).on('pageAnimationStart', function(event,id,page) {
        // 在路由切换页面动画开始前,为了把位于 .page 之外的 popup 等隐藏,此处做些处理
        $.closeModal();
        $.closePanel();
        // 如果 panel 的 effect 是 reveal 时,似乎是 page 的动画或别的样式原因导致了 transitionEnd 时间不会触发
        // 这里暂且处理一下
        $('body').removeClass('panel-closing');
        $.allowPanelOpen = true;  
    });
   
    $(window).on('pageInit', function() {
        $.hideIndicator();
        $.lastPosition({
            needMemoryClass: [
                '.content'
            ]
        });
    });
    // safari 在后退的时候会使用缓存技术，但实现上似乎存在些问题，
    // 导致路由中绑定的点击事件不会正常如期的运行（log 和 debugger 都没法调试），
    // 从而后续的跳转等完全乱了套。
    // 所以，这里检测到是 safari 的 cache 的情况下，做一次 reload
    // 测试路径(后缀 D 表示是 document，E 表示 external，不使用路由跳转）：
    // 1. aD -> bDE
    // 2. back
    // 3. aD -> bD
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            location.reload();
        }
    });

    $.init = function() {
        var $page = getPage();
        var id = $page[0].id;
        $.initPage();
        $page.trigger('pageInit', [id, $page]);
    };

    //DOM READY
    $(function() {
        //直接绑定
        FastClick.attach(document.body);

        if ($.smConfig.autoInit) {
            $.init();
        }

        $(document).on('pageInitInternal', function(e, id, page) {
            $.init();
        });
    });

}(Zepto);

+ function(window) {

    "use strict";

    var rAF = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    /*var cRAF = window.cancelRequestAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame;*/

    var utils = (function() {
        var me = {};

        var _elementStyle = document.createElement('div').style;
        var _vendor = (function() {
            var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
                transform,
                i = 0,
                l = vendors.length;

            for (; i < l; i++) {
                transform = vendors[i] + 'ransform';
                if (transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1);
            }

            return false;
        })();

        function _prefixStyle(style) {
            if (_vendor === false) return false;
            if (_vendor === '') return style;
            return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
        }

        me.getTime = Date.now || function getTime() {
            return new Date().getTime();
        };

        me.extend = function(target, obj) {
            for (var i in obj) {  // jshint ignore:line
                    target[i] = obj[i]; 
            }
        };

        me.addEvent = function(el, type, fn, capture) {
            el.addEventListener(type, fn, !!capture);
        };

        me.removeEvent = function(el, type, fn, capture) {
            el.removeEventListener(type, fn, !!capture);
        };

        me.prefixPointerEvent = function(pointerEvent) {
            return window.MSPointerEvent ?
                'MSPointer' + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10) :
                pointerEvent;
        };

        me.momentum = function(current, start, time, lowerMargin, wrapperSize, deceleration, self) {
            var distance = current - start,
                speed = Math.abs(distance) / time,
                destination,
                duration;

            // var absDistance = Math.abs(distance);
            speed = speed / 2; //slowdown
            speed = speed > 1.5 ? 1.5 : speed; //set max speed to 1
            deceleration = deceleration === undefined ? 0.0006 : deceleration;

            destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1);
            duration = speed / deceleration;

            if (destination < lowerMargin) {
                destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
                distance = Math.abs(destination - current);
                duration = distance / speed;
            } else if (destination > 0) {
                destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
                distance = Math.abs(current) + destination;
                duration = distance / speed;
            }

            //simple trigger, every 50ms
            var t = +new Date();
            var l = t;

            function eventTrigger() {
                if (+new Date() - l > 50) {
                    self._execEvent('scroll');
                    l = +new Date();
                }
                if (+new Date() - t < duration) {
                    rAF(eventTrigger);
                }
            }
            rAF(eventTrigger);

            return {
                destination: Math.round(destination),
                duration: duration
            };
        };

        var _transform = _prefixStyle('transform');

        me.extend(me, {
            hasTransform: _transform !== false,
            hasPerspective: _prefixStyle('perspective') in _elementStyle,
            hasTouch: 'ontouchstart' in window,
            hasPointer: window.PointerEvent || window.MSPointerEvent, // IE10 is prefixed
            hasTransition: _prefixStyle('transition') in _elementStyle
        });

        // This should find all Android browsers lower than build 535.19 (both stock browser and webview)
        me.isBadAndroid = /Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion)) && false; //this will cause many android device scroll flash; so set it to false!

        me.extend(me.style = {}, {
            transform: _transform,
            transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
            transitionDuration: _prefixStyle('transitionDuration'),
            transitionDelay: _prefixStyle('transitionDelay'),
            transformOrigin: _prefixStyle('transformOrigin')
        });

        me.hasClass = function(e, c) {
            var re = new RegExp('(^|\\s)' + c + '(\\s|$)');
            return re.test(e.className);
        };

        me.addClass = function(e, c) {
            if (me.hasClass(e, c)) {
                return;
            }

            var newclass = e.className.split(' ');
            newclass.push(c);
            e.className = newclass.join(' ');
        };

        me.removeClass = function(e, c) {
            if (!me.hasClass(e, c)) {
                return;
            }

            var re = new RegExp('(^|\\s)' + c + '(\\s|$)', 'g');
            e.className = e.className.replace(re, ' ');
        };

        me.offset = function(el) {
            var left = -el.offsetLeft,
                top = -el.offsetTop;

            // jshint -W084
            while (el = el.offsetParent) {
                left -= el.offsetLeft;
                top -= el.offsetTop;
            }
            // jshint +W084

            return {
                left: left,
                top: top
            };
        };

        me.preventDefaultException = function(el, exceptions) {
            for (var i in exceptions) {
                if (exceptions[i].test(el[i])) {
                    return true;
                }
            }

            return false;
        };

        me.extend(me.eventType = {}, {
            touchstart: 1,
            touchmove: 1,
            touchend: 1,

            mousedown: 2,
            mousemove: 2,
            mouseup: 2,

            pointerdown: 3,
            pointermove: 3,
            pointerup: 3,

            MSPointerDown: 3,
            MSPointerMove: 3,
            MSPointerUp: 3
        });

        me.extend(me.ease = {}, {
            quadratic: {
                style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fn: function(k) {
                    return k * (2 - k);
                }
            },
            circular: {
                style: 'cubic-bezier(0.1, 0.57, 0.1, 1)', // Not properly 'circular' but this looks better, it should be (0.075, 0.82, 0.165, 1)
                fn: function(k) {
                    return Math.sqrt(1 - (--k * k));
                }
            },
            back: {
                style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                fn: function(k) {
                    var b = 4;
                    return (k = k - 1) * k * ((b + 1) * k + b) + 1;
                }
            },
            bounce: {
                style: '',
                fn: function(k) {
                    if ((k /= 1) < (1 / 2.75)) {
                        return 7.5625 * k * k;
                    } else if (k < (2 / 2.75)) {
                        return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
                    } else if (k < (2.5 / 2.75)) {
                        return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
                    } else {
                        return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
                    }
                }
            },
            elastic: {
                style: '',
                fn: function(k) {
                    var f = 0.22,
                        e = 0.4;

                    if (k === 0) {
                        return 0;
                    }
                    if (k === 1) {
                        return 1;
                    }

                    return (e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * (2 * Math.PI) / f) + 1);
                }
            }
        });

        me.tap = function(e, eventName) {
            var ev = document.createEvent('Event');
            ev.initEvent(eventName, true, true);
            ev.pageX = e.pageX;
            ev.pageY = e.pageY;
            e.target.dispatchEvent(ev);
        };

        me.click = function(e) {
            var target = e.target,
                ev;

            if (!(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName)) {
                ev = document.createEvent('MouseEvents');
                ev.initMouseEvent('click', true, true, e.view, 1,
                    target.screenX, target.screenY, target.clientX, target.clientY,
                    e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                    0, null);

                ev._constructed = true;
                target.dispatchEvent(ev);
            }
        };

        return me;
    })();

    function IScroll(el, options) {
        this.wrapper = typeof el === 'string' ? document.querySelector(el) : el;
        this.scroller = $(this.wrapper).find('.content-inner')[0]; // jshint ignore:line


        this.scrollerStyle = this.scroller&&this.scroller.style; // cache style for better performance

        this.options = {

            resizeScrollbars: true,

            mouseWheelSpeed: 20,

            snapThreshold: 0.334,

            // INSERT POINT: OPTIONS 

            startX: 0,
            startY: 0,
            scrollY: true,
            directionLockThreshold: 5,
            momentum: true,

            bounce: true,
            bounceTime: 600,
            bounceEasing: '',

            preventDefault: true,
            preventDefaultException: {
                tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
            },

            HWCompositing: true,
            useTransition: true,
            useTransform: true,

            //other options
            eventPassthrough: undefined, //if you  want to use native scroll, you can set to: true or horizontal
        };

        for (var i in options) {
                this.options[i] = options[i];
        }

        // Normalize options
        this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';

        this.options.useTransition = utils.hasTransition && this.options.useTransition;
        this.options.useTransform = utils.hasTransform && this.options.useTransform;

        this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
        this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

        // If you want eventPassthrough I have to lock one of the axes
        this.options.scrollY = this.options.eventPassthrough === 'vertical' ? false : this.options.scrollY;
        this.options.scrollX = this.options.eventPassthrough === 'horizontal' ? false : this.options.scrollX;

        // With eventPassthrough we also need lockDirection mechanism
        this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
        this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

        this.options.bounceEasing = typeof this.options.bounceEasing === 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;

        this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

        if (this.options.tap === true) {
            this.options.tap = 'tap';
        }

        if (this.options.shrinkScrollbars === 'scale') {
            this.options.useTransition = false;
        }

        this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;

        if (this.options.probeType === 3) {
            this.options.useTransition = false;
        }

        // INSERT POINT: NORMALIZATION

        // Some defaults    
        this.x = 0;
        this.y = 0;
        this.directionX = 0;
        this.directionY = 0;
        this._events = {};

        // INSERT POINT: DEFAULTS

        this._init();
        this.refresh();

        this.scrollTo(this.options.startX, this.options.startY);
        this.enable();
    }

    IScroll.prototype = {
        version: '5.1.3',

        _init: function() {
            this._initEvents();

            if (this.options.scrollbars || this.options.indicators) {
                this._initIndicators();
            }

            if (this.options.mouseWheel) {
                this._initWheel();
            }

            if (this.options.snap) {
                this._initSnap();
            }

            if (this.options.keyBindings) {
                this._initKeys();
            }

            // INSERT POINT: _init

        },

        destroy: function() {
            this._initEvents(true);

            this._execEvent('destroy');
        },

        _transitionEnd: function(e) {
            if (e.target !== this.scroller || !this.isInTransition) {
                return;
            }

            this._transitionTime();
            if (!this.resetPosition(this.options.bounceTime)) {
                this.isInTransition = false;
                this._execEvent('scrollEnd');
            }
        },

        _start: function(e) {
            // React to left mouse button only
            if (utils.eventType[e.type] !== 1) {
                if (e.button !== 0) {
                    return;
                }
            }

            if (!this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated)) {
                return;
            }

            if (this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
                e.preventDefault();
            }

            var point = e.touches ? e.touches[0] : e,
                pos;

            this.initiated = utils.eventType[e.type];
            this.moved = false;
            this.distX = 0;
            this.distY = 0;
            this.directionX = 0;
            this.directionY = 0;
            this.directionLocked = 0;

            this._transitionTime();

            this.startTime = utils.getTime();

            if (this.options.useTransition && this.isInTransition) {
                this.isInTransition = false;
                pos = this.getComputedPosition();
                this._translate(Math.round(pos.x), Math.round(pos.y));
                this._execEvent('scrollEnd');
            } else if (!this.options.useTransition && this.isAnimating) {
                this.isAnimating = false;
                this._execEvent('scrollEnd');
            }

            this.startX = this.x;
            this.startY = this.y;
            this.absStartX = this.x;
            this.absStartY = this.y;
            this.pointX = point.pageX;
            this.pointY = point.pageY;

            this._execEvent('beforeScrollStart');
        },

        _move: function(e) {
            if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                return;
            }

            if (this.options.preventDefault) { // increases performance on Android? TODO: check!
                e.preventDefault();
            }

            var point = e.touches ? e.touches[0] : e,
                deltaX = point.pageX - this.pointX,
                deltaY = point.pageY - this.pointY,
                timestamp = utils.getTime(),
                newX, newY,
                absDistX, absDistY;

            this.pointX = point.pageX;
            this.pointY = point.pageY;

            this.distX += deltaX;
            this.distY += deltaY;
            absDistX = Math.abs(this.distX);
            absDistY = Math.abs(this.distY);

            // We need to move at least 10 pixels for the scrolling to initiate
            if (timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
                return;
            }

            // If you are scrolling in one direction lock the other
            if (!this.directionLocked && !this.options.freeScroll) {
                if (absDistX > absDistY + this.options.directionLockThreshold) {
                    this.directionLocked = 'h'; // lock horizontally
                } else if (absDistY >= absDistX + this.options.directionLockThreshold) {
                    this.directionLocked = 'v'; // lock vertically
                } else {
                    this.directionLocked = 'n'; // no lock
                }
            }

            if (this.directionLocked === 'h') {
                if (this.options.eventPassthrough === 'vertical') {
                    e.preventDefault();
                } else if (this.options.eventPassthrough === 'horizontal') {
                    this.initiated = false;
                    return;
                }

                deltaY = 0;
            } else if (this.directionLocked === 'v') {
                if (this.options.eventPassthrough === 'horizontal') {
                    e.preventDefault();
                } else if (this.options.eventPassthrough === 'vertical') {
                    this.initiated = false;
                    return;
                }

                deltaX = 0;
            }

            deltaX = this.hasHorizontalScroll ? deltaX : 0;
            deltaY = this.hasVerticalScroll ? deltaY : 0;

            newX = this.x + deltaX;
            newY = this.y + deltaY;

            // Slow down if outside of the boundaries
            if (newX > 0 || newX < this.maxScrollX) {
                newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
            }
            if (newY > 0 || newY < this.maxScrollY) {
                newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
            }

            this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
            this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

            if (!this.moved) {
                this._execEvent('scrollStart');
            }

            this.moved = true;

            this._translate(newX, newY);

            /* REPLACE START: _move */
            if (timestamp - this.startTime > 300) {
                this.startTime = timestamp;
                this.startX = this.x;
                this.startY = this.y;

                if (this.options.probeType === 1) {
                    this._execEvent('scroll');
                }
            }

            if (this.options.probeType > 1) {
                this._execEvent('scroll');
            }
            /* REPLACE END: _move */

        },

        _end: function(e) {
            if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                return;
            }

            if (this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
                e.preventDefault();
            }

            var /*point = e.changedTouches ? e.changedTouches[0] : e,*/
                momentumX,
                momentumY,
                duration = utils.getTime() - this.startTime,
                newX = Math.round(this.x),
                newY = Math.round(this.y),
                distanceX = Math.abs(newX - this.startX),
                distanceY = Math.abs(newY - this.startY),
                time = 0,
                easing = '';

            this.isInTransition = 0;
            this.initiated = 0;
            this.endTime = utils.getTime();

            // reset if we are outside of the boundaries
            if (this.resetPosition(this.options.bounceTime)) {
                return;
            }

            this.scrollTo(newX, newY); // ensures that the last position is rounded

            // we scrolled less than 10 pixels
            if (!this.moved) {
                if (this.options.tap) {
                    utils.tap(e, this.options.tap);
                }

                if (this.options.click) {
                    utils.click(e);
                }

                this._execEvent('scrollCancel');
                return;
            }

            if (this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100) {
                this._execEvent('flick');
                return;
            }

            // start momentum animation if needed
            if (this.options.momentum && duration < 300) {
                momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration, this) : {
                    destination: newX,
                    duration: 0
                };
                momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration, this) : {
                    destination: newY,
                    duration: 0
                };
                newX = momentumX.destination;
                newY = momentumY.destination;
                time = Math.max(momentumX.duration, momentumY.duration);
                this.isInTransition = 1;
            }


            if (this.options.snap) {
                var snap = this._nearestSnap(newX, newY);
                this.currentPage = snap;
                time = this.options.snapSpeed || Math.max(
                    Math.max(
                        Math.min(Math.abs(newX - snap.x), 1000),
                        Math.min(Math.abs(newY - snap.y), 1000)
                    ), 300);
                newX = snap.x;
                newY = snap.y;

                this.directionX = 0;
                this.directionY = 0;
                easing = this.options.bounceEasing;
            }

            // INSERT POINT: _end

            if (newX !== this.x || newY !== this.y) {
                // change easing function when scroller goes out of the boundaries
                if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
                    easing = utils.ease.quadratic;
                }

                this.scrollTo(newX, newY, time, easing);
                return;
            }

            this._execEvent('scrollEnd');
        },

        _resize: function() {
            var that = this;

            clearTimeout(this.resizeTimeout);

            this.resizeTimeout = setTimeout(function() {
                that.refresh();
            }, this.options.resizePolling);
        },

        resetPosition: function(time) {
            var x = this.x,
                y = this.y;

            time = time || 0;

            if (!this.hasHorizontalScroll || this.x > 0) {
                x = 0;
            } else if (this.x < this.maxScrollX) {
                x = this.maxScrollX;
            }

            if (!this.hasVerticalScroll || this.y > 0) {
                y = 0;
            } else if (this.y < this.maxScrollY) {
                y = this.maxScrollY;
            }

            if (x === this.x && y === this.y) {
                return false;
            }

            if (this.options.ptr && this.y > 44 && this.startY * -1 < $(window).height() && !this.ptrLock) {// jshint ignore:line
                // not trigger ptr when user want to scroll to top
                y = this.options.ptrOffset || 44;
                this._execEvent('ptr');
                // 防止返回的过程中再次触发了 ptr ，导致被定位到 44px（因为可能done事件触发很快，在返回到44px以前就触发done
                this.ptrLock = true;
                var self = this;
                setTimeout(function() {
                    self.ptrLock = false;
                }, 500);
            }

            this.scrollTo(x, y, time, this.options.bounceEasing);

            return true;
        },

        disable: function() {
            this.enabled = false;
        },

        enable: function() {
            this.enabled = true;
        },

        refresh: function() {
            // var rf = this.wrapper.offsetHeight; // Force reflow

            this.wrapperWidth = this.wrapper.clientWidth;
            this.wrapperHeight = this.wrapper.clientHeight;

            /* REPLACE START: refresh */

            this.scrollerWidth = this.scroller.offsetWidth;
            this.scrollerHeight = this.scroller.offsetHeight;

            this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
            this.maxScrollY = this.wrapperHeight - this.scrollerHeight;

            /* REPLACE END: refresh */

            this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
            this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;

            if (!this.hasHorizontalScroll) {
                this.maxScrollX = 0;
                this.scrollerWidth = this.wrapperWidth;
            }

            if (!this.hasVerticalScroll) {
                this.maxScrollY = 0;
                this.scrollerHeight = this.wrapperHeight;
            }

            this.endTime = 0;
            this.directionX = 0;
            this.directionY = 0;

            this.wrapperOffset = utils.offset(this.wrapper);

            this._execEvent('refresh');

            this.resetPosition();

            // INSERT POINT: _refresh

        },

        on: function(type, fn) {
            if (!this._events[type]) {
                this._events[type] = [];
            }

            this._events[type].push(fn);
        },

        off: function(type, fn) {
            if (!this._events[type]) {
                return;
            }

            var index = this._events[type].indexOf(fn);

            if (index > -1) {
                this._events[type].splice(index, 1);
            }
        },

        _execEvent: function(type) {
            if (!this._events[type]) {
                return;
            }

            var i = 0,
                l = this._events[type].length;

            if (!l) {
                return;
            }

            for (; i < l; i++) {
                this._events[type][i].apply(this, [].slice.call(arguments, 1));
            }
        },

        scrollBy: function(x, y, time, easing) {
            x = this.x + x;
            y = this.y + y;
            time = time || 0;

            this.scrollTo(x, y, time, easing);
        },

        scrollTo: function(x, y, time, easing) {
            easing = easing || utils.ease.circular;

            this.isInTransition = this.options.useTransition && time > 0;

            if (!time || (this.options.useTransition && easing.style)) {
                this._transitionTimingFunction(easing.style);
                this._transitionTime(time);
                this._translate(x, y);
            } else {
                this._animate(x, y, time, easing.fn);
            }
        },

        scrollToElement: function(el, time, offsetX, offsetY, easing) {
            el = el.nodeType ? el : this.scroller.querySelector(el);

            if (!el) {
                return;
            }

            var pos = utils.offset(el);

            pos.left -= this.wrapperOffset.left;
            pos.top -= this.wrapperOffset.top;

            // if offsetX/Y are true we center the element to the screen
            if (offsetX === true) {
                offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
            }
            if (offsetY === true) {
                offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
            }

            pos.left -= offsetX || 0;
            pos.top -= offsetY || 0;

            pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
            pos.top = pos.top > 0 ? 0 : pos.top < this.maxScrollY ? this.maxScrollY : pos.top;

            time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x - pos.left), Math.abs(this.y - pos.top)) : time;

            this.scrollTo(pos.left, pos.top, time, easing);
        },

        _transitionTime: function(time) {
            time = time || 0;

            this.scrollerStyle[utils.style.transitionDuration] = time + 'ms';

            if (!time && utils.isBadAndroid) {
                this.scrollerStyle[utils.style.transitionDuration] = '0.001s';
            }


            if (this.indicators) {
                for (var i = this.indicators.length; i--;) {
                    this.indicators[i].transitionTime(time);
                }
            }


            // INSERT POINT: _transitionTime

        },

        _transitionTimingFunction: function(easing) {
            this.scrollerStyle[utils.style.transitionTimingFunction] = easing;


            if (this.indicators) {
                for (var i = this.indicators.length; i--;) {
                    this.indicators[i].transitionTimingFunction(easing);
                }
            }


            // INSERT POINT: _transitionTimingFunction

        },

        _translate: function(x, y) {
            if (this.options.useTransform) {

                /* REPLACE START: _translate */

                this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;

                /* REPLACE END: _translate */

            } else {
                x = Math.round(x);
                y = Math.round(y);
                this.scrollerStyle.left = x + 'px';
                this.scrollerStyle.top = y + 'px';
            }

            this.x = x;
            this.y = y;


            if (this.indicators) {
                for (var i = this.indicators.length; i--;) {
                    this.indicators[i].updatePosition();
                }
            }


            // INSERT POINT: _translate

        },

        _initEvents: function(remove) {
            var eventType = remove ? utils.removeEvent : utils.addEvent,
                target = this.options.bindToWrapper ? this.wrapper : window;

            eventType(window, 'orientationchange', this);
            eventType(window, 'resize', this);

            if (this.options.click) {
                eventType(this.wrapper, 'click', this, true);
            }

            if (!this.options.disableMouse) {
                eventType(this.wrapper, 'mousedown', this);
                eventType(target, 'mousemove', this);
                eventType(target, 'mousecancel', this);
                eventType(target, 'mouseup', this);
            }

            if (utils.hasPointer && !this.options.disablePointer) {
                eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
                eventType(target, utils.prefixPointerEvent('pointermove'), this);
                eventType(target, utils.prefixPointerEvent('pointercancel'), this);
                eventType(target, utils.prefixPointerEvent('pointerup'), this);
            }

            if (utils.hasTouch && !this.options.disableTouch) {
                eventType(this.wrapper, 'touchstart', this);
                eventType(target, 'touchmove', this);
                eventType(target, 'touchcancel', this);
                eventType(target, 'touchend', this);
            }

            eventType(this.scroller, 'transitionend', this);
            eventType(this.scroller, 'webkitTransitionEnd', this);
            eventType(this.scroller, 'oTransitionEnd', this);
            eventType(this.scroller, 'MSTransitionEnd', this);
        },

        getComputedPosition: function() {
            var matrix = window.getComputedStyle(this.scroller, null),
                x, y;

            if (this.options.useTransform) {
                matrix = matrix[utils.style.transform].split(')')[0].split(', ');
                x = +(matrix[12] || matrix[4]);
                y = +(matrix[13] || matrix[5]);
            } else {
                x = +matrix.left.replace(/[^-\d.]/g, '');
                y = +matrix.top.replace(/[^-\d.]/g, '');
            }

            return {
                x: x,
                y: y
            };
        },

        _initIndicators: function() {
            var interactive = this.options.interactiveScrollbars,
                customStyle = typeof this.options.scrollbars !== 'string',
                indicators = [],
                indicator;

            var that = this;

            this.indicators = [];

            if (this.options.scrollbars) {
                // Vertical scrollbar
                if (this.options.scrollY) {
                    indicator = {
                        el: createDefaultScrollbar('v', interactive, this.options.scrollbars),
                        interactive: interactive,
                        defaultScrollbars: true,
                        customStyle: customStyle,
                        resize: this.options.resizeScrollbars,
                        shrink: this.options.shrinkScrollbars,
                        fade: this.options.fadeScrollbars,
                        listenX: false
                    };

                    this.wrapper.appendChild(indicator.el);
                    indicators.push(indicator);
                }

                // Horizontal scrollbar
                if (this.options.scrollX) {
                    indicator = {
                        el: createDefaultScrollbar('h', interactive, this.options.scrollbars),
                        interactive: interactive,
                        defaultScrollbars: true,
                        customStyle: customStyle,
                        resize: this.options.resizeScrollbars,
                        shrink: this.options.shrinkScrollbars,
                        fade: this.options.fadeScrollbars,
                        listenY: false
                    };

                    this.wrapper.appendChild(indicator.el);
                    indicators.push(indicator);
                }
            }

            if (this.options.indicators) {
                // TODO: check concat compatibility
                indicators = indicators.concat(this.options.indicators);
            }

            for (var i = indicators.length; i--;) {
                this.indicators.push(new Indicator(this, indicators[i]));
            }

            // TODO: check if we can use array.map (wide compatibility and performance issues)
            function _indicatorsMap(fn) {
                for (var i = that.indicators.length; i--;) {
                    fn.call(that.indicators[i]);
                }
            }

            if (this.options.fadeScrollbars) {
                this.on('scrollEnd', function() {
                    _indicatorsMap(function() {
                        this.fade();
                    });
                });

                this.on('scrollCancel', function() {
                    _indicatorsMap(function() {
                        this.fade();
                    });
                });

                this.on('scrollStart', function() {
                    _indicatorsMap(function() {
                        this.fade(1);
                    });
                });

                this.on('beforeScrollStart', function() {
                    _indicatorsMap(function() {
                        this.fade(1, true);
                    });
                });
            }


            this.on('refresh', function() {
                _indicatorsMap(function() {
                    this.refresh();
                });
            });

            this.on('destroy', function() {
                _indicatorsMap(function() {
                    this.destroy();
                });

                delete this.indicators;
            });
        },

        _initWheel: function() {
            utils.addEvent(this.wrapper, 'wheel', this);
            utils.addEvent(this.wrapper, 'mousewheel', this);
            utils.addEvent(this.wrapper, 'DOMMouseScroll', this);

            this.on('destroy', function() {
                utils.removeEvent(this.wrapper, 'wheel', this);
                utils.removeEvent(this.wrapper, 'mousewheel', this);
                utils.removeEvent(this.wrapper, 'DOMMouseScroll', this);
            });
        },

        _wheel: function(e) {
            if (!this.enabled) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            var wheelDeltaX, wheelDeltaY,
                newX, newY,
                that = this;

            if (this.wheelTimeout === undefined) {
                that._execEvent('scrollStart');
            }

            // Execute the scrollEnd event after 400ms the wheel stopped scrolling
            clearTimeout(this.wheelTimeout);
            this.wheelTimeout = setTimeout(function() {
                that._execEvent('scrollEnd');
                that.wheelTimeout = undefined;
            }, 400);

            if ('deltaX' in e) {
                if (e.deltaMode === 1) {
                    wheelDeltaX = -e.deltaX * this.options.mouseWheelSpeed;
                    wheelDeltaY = -e.deltaY * this.options.mouseWheelSpeed;
                } else {
                    wheelDeltaX = -e.deltaX;
                    wheelDeltaY = -e.deltaY;
                }
            } else if ('wheelDeltaX' in e) {
                wheelDeltaX = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed;
                wheelDeltaY = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
            } else if ('wheelDelta' in e) {
                wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * this.options.mouseWheelSpeed;
            } else if ('detail' in e) {
                wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed;
            } else {
                return;
            }

            wheelDeltaX *= this.options.invertWheelDirection;
            wheelDeltaY *= this.options.invertWheelDirection;

            if (!this.hasVerticalScroll) {
                wheelDeltaX = wheelDeltaY;
                wheelDeltaY = 0;
            }

            if (this.options.snap) {
                newX = this.currentPage.pageX;
                newY = this.currentPage.pageY;

                if (wheelDeltaX > 0) {
                    newX--;
                } else if (wheelDeltaX < 0) {
                    newX++;
                }

                if (wheelDeltaY > 0) {
                    newY--;
                } else if (wheelDeltaY < 0) {
                    newY++;
                }

                this.goToPage(newX, newY);

                return;
            }

            newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
            newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);

            if (newX > 0) {
                newX = 0;
            } else if (newX < this.maxScrollX) {
                newX = this.maxScrollX;
            }

            if (newY > 0) {
                newY = 0;
            } else if (newY < this.maxScrollY) {
                newY = this.maxScrollY;
            }

            this.scrollTo(newX, newY, 0);

            this._execEvent('scroll');

            // INSERT POINT: _wheel
        },

        _initSnap: function() {
            this.currentPage = {};

            if (typeof this.options.snap === 'string') {
                this.options.snap = this.scroller.querySelectorAll(this.options.snap);
            }

            this.on('refresh', function() {
                var i = 0,
                    l,
                    m = 0,
                    n,
                    cx, cy,
                    x = 0,
                    y,
                    stepX = this.options.snapStepX || this.wrapperWidth,
                    stepY = this.options.snapStepY || this.wrapperHeight,
                    el;

                this.pages = [];

                if (!this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight) {
                    return;
                }

                if (this.options.snap === true) {
                    cx = Math.round(stepX / 2);
                    cy = Math.round(stepY / 2);

                    while (x > -this.scrollerWidth) {
                        this.pages[i] = [];
                        l = 0;
                        y = 0;

                        while (y > -this.scrollerHeight) {
                            this.pages[i][l] = {
                                x: Math.max(x, this.maxScrollX),
                                y: Math.max(y, this.maxScrollY),
                                width: stepX,
                                height: stepY,
                                cx: x - cx,
                                cy: y - cy
                            };

                            y -= stepY;
                            l++;
                        }

                        x -= stepX;
                        i++;
                    }
                } else {
                    el = this.options.snap;
                    l = el.length;
                    n = -1;

                    for (; i < l; i++) {
                        if (i === 0 || el[i].offsetLeft <= el[i - 1].offsetLeft) {
                            m = 0;
                            n++;
                        }

                        if (!this.pages[m]) {
                            this.pages[m] = [];
                        }

                        x = Math.max(-el[i].offsetLeft, this.maxScrollX);
                        y = Math.max(-el[i].offsetTop, this.maxScrollY);
                        cx = x - Math.round(el[i].offsetWidth / 2);
                        cy = y - Math.round(el[i].offsetHeight / 2);

                        this.pages[m][n] = {
                            x: x,
                            y: y,
                            width: el[i].offsetWidth,
                            height: el[i].offsetHeight,
                            cx: cx,
                            cy: cy
                        };

                        if (x > this.maxScrollX) {
                            m++;
                        }
                    }
                }

                this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);

                // Update snap threshold if needed
                if (this.options.snapThreshold % 1 === 0) {
                    this.snapThresholdX = this.options.snapThreshold;
                    this.snapThresholdY = this.options.snapThreshold;
                } else {
                    this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
                    this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold);
                }
            });

            this.on('flick', function() {
                var time = this.options.snapSpeed || Math.max(
                    Math.max(
                        Math.min(Math.abs(this.x - this.startX), 1000),
                        Math.min(Math.abs(this.y - this.startY), 1000)
                    ), 300);

                this.goToPage(
                    this.currentPage.pageX + this.directionX,
                    this.currentPage.pageY + this.directionY,
                    time
                );
            });
        },

        _nearestSnap: function(x, y) {
            if (!this.pages.length) {
                return {
                    x: 0,
                    y: 0,
                    pageX: 0,
                    pageY: 0
                };
            }

            var i = 0,
                l = this.pages.length,
                m = 0;

            // Check if we exceeded the snap threshold
            if (Math.abs(x - this.absStartX) < this.snapThresholdX &&
                Math.abs(y - this.absStartY) < this.snapThresholdY) {
                return this.currentPage;
            }

            if (x > 0) {
                x = 0;
            } else if (x < this.maxScrollX) {
                x = this.maxScrollX;
            }

            if (y > 0) {
                y = 0;
            } else if (y < this.maxScrollY) {
                y = this.maxScrollY;
            }

            for (; i < l; i++) {
                if (x >= this.pages[i][0].cx) {
                    x = this.pages[i][0].x;
                    break;
                }
            }

            l = this.pages[i].length;

            for (; m < l; m++) {
                if (y >= this.pages[0][m].cy) {
                    y = this.pages[0][m].y;
                    break;
                }
            }

            if (i === this.currentPage.pageX) {
                i += this.directionX;

                if (i < 0) {
                    i = 0;
                } else if (i >= this.pages.length) {
                    i = this.pages.length - 1;
                }

                x = this.pages[i][0].x;
            }

            if (m === this.currentPage.pageY) {
                m += this.directionY;

                if (m < 0) {
                    m = 0;
                } else if (m >= this.pages[0].length) {
                    m = this.pages[0].length - 1;
                }

                y = this.pages[0][m].y;
            }

            return {
                x: x,
                y: y,
                pageX: i,
                pageY: m
            };
        },

        goToPage: function(x, y, time, easing) {
            easing = easing || this.options.bounceEasing;

            if (x >= this.pages.length) {
                x = this.pages.length - 1;
            } else if (x < 0) {
                x = 0;
            }

            if (y >= this.pages[x].length) {
                y = this.pages[x].length - 1;
            } else if (y < 0) {
                y = 0;
            }

            var posX = this.pages[x][y].x,
                posY = this.pages[x][y].y;

            time = time === undefined ? this.options.snapSpeed || Math.max(
                Math.max(
                    Math.min(Math.abs(posX - this.x), 1000),
                    Math.min(Math.abs(posY - this.y), 1000)
                ), 300) : time;

            this.currentPage = {
                x: posX,
                y: posY,
                pageX: x,
                pageY: y
            };

            this.scrollTo(posX, posY, time, easing);
        },

        next: function(time, easing) {
            var x = this.currentPage.pageX,
                y = this.currentPage.pageY;

            x++;

            if (x >= this.pages.length && this.hasVerticalScroll) {
                x = 0;
                y++;
            }

            this.goToPage(x, y, time, easing);
        },

        prev: function(time, easing) {
            var x = this.currentPage.pageX,
                y = this.currentPage.pageY;

            x--;

            if (x < 0 && this.hasVerticalScroll) {
                x = 0;
                y--;
            }

            this.goToPage(x, y, time, easing);
        },

        _initKeys: function() {
            // default key bindings
            var keys = {
                pageUp: 33,
                pageDown: 34,
                end: 35,
                home: 36,
                left: 37,
                up: 38,
                right: 39,
                down: 40
            };
            var i;

            // if you give me characters I give you keycode
            if (typeof this.options.keyBindings === 'object') {
                for (i in this.options.keyBindings) {
                    if (typeof this.options.keyBindings[i] === 'string') {
                        this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0);
                    }
                }
            } else {
                this.options.keyBindings = {};
            }

            for (i in keys) { // jshint ignore:line
                    this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i];
            }

            utils.addEvent(window, 'keydown', this);

            this.on('destroy', function() {
                utils.removeEvent(window, 'keydown', this);
            });
        },

        _key: function(e) {
            if (!this.enabled) {
                return;
            }

            var snap = this.options.snap, // we are using this alot, better to cache it
                newX = snap ? this.currentPage.pageX : this.x,
                newY = snap ? this.currentPage.pageY : this.y,
                now = utils.getTime(),
                prevTime = this.keyTime || 0,
                acceleration = 0.250,
                pos;

            if (this.options.useTransition && this.isInTransition) {
                pos = this.getComputedPosition();

                this._translate(Math.round(pos.x), Math.round(pos.y));
                this.isInTransition = false;
            }

            this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;

            switch (e.keyCode) {
                case this.options.keyBindings.pageUp:
                    if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                        newX += snap ? 1 : this.wrapperWidth;
                    } else {
                        newY += snap ? 1 : this.wrapperHeight;
                    }
                    break;
                case this.options.keyBindings.pageDown:
                    if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                        newX -= snap ? 1 : this.wrapperWidth;
                    } else {
                        newY -= snap ? 1 : this.wrapperHeight;
                    }
                    break;
                case this.options.keyBindings.end:
                    newX = snap ? this.pages.length - 1 : this.maxScrollX;
                    newY = snap ? this.pages[0].length - 1 : this.maxScrollY;
                    break;
                case this.options.keyBindings.home:
                    newX = 0;
                    newY = 0;
                    break;
                case this.options.keyBindings.left:
                    newX += snap ? -1 : 5 + this.keyAcceleration >> 0; // jshint ignore:line
                    break;
                case this.options.keyBindings.up:
                    newY += snap ? 1 : 5 + this.keyAcceleration >> 0; // jshint ignore:line
                    break;
                case this.options.keyBindings.right:
                    newX -= snap ? -1 : 5 + this.keyAcceleration >> 0; // jshint ignore:line
                    break;
                case this.options.keyBindings.down:
                    newY -= snap ? 1 : 5 + this.keyAcceleration >> 0; // jshint ignore:line
                    break;
                default:
                    return;
            }

            if (snap) {
                this.goToPage(newX, newY);
                return;
            }

            if (newX > 0) {
                newX = 0;
                this.keyAcceleration = 0;
            } else if (newX < this.maxScrollX) {
                newX = this.maxScrollX;
                this.keyAcceleration = 0;
            }

            if (newY > 0) {
                newY = 0;
                this.keyAcceleration = 0;
            } else if (newY < this.maxScrollY) {
                newY = this.maxScrollY;
                this.keyAcceleration = 0;
            }

            this.scrollTo(newX, newY, 0);

            this.keyTime = now;
        },

        _animate: function(destX, destY, duration, easingFn) {
            var that = this,
                startX = this.x,
                startY = this.y,
                startTime = utils.getTime(),
                destTime = startTime + duration;

            function step() {
                var now = utils.getTime(),
                    newX, newY,
                    easing;

                if (now >= destTime) {
                    that.isAnimating = false;
                    that._translate(destX, destY);

                    if (!that.resetPosition(that.options.bounceTime)) {
                        that._execEvent('scrollEnd');
                    }

                    return;
                }

                now = (now - startTime) / duration;
                easing = easingFn(now);
                newX = (destX - startX) * easing + startX;
                newY = (destY - startY) * easing + startY;
                that._translate(newX, newY);

                if (that.isAnimating) {
                    rAF(step);
                }

                if (that.options.probeType === 3) {
                    that._execEvent('scroll');
                }
            }

            this.isAnimating = true;
            step();
        },

        handleEvent: function(e) {
            switch (e.type) {
                case 'touchstart':
                case 'pointerdown':
                case 'MSPointerDown':
                case 'mousedown':
                    this._start(e);
                    break;
                case 'touchmove':
                case 'pointermove':
                case 'MSPointerMove':
                case 'mousemove':
                    this._move(e);
                    break;
                case 'touchend':
                case 'pointerup':
                case 'MSPointerUp':
                case 'mouseup':
                case 'touchcancel':
                case 'pointercancel':
                case 'MSPointerCancel':
                case 'mousecancel':
                    this._end(e);
                    break;
                case 'orientationchange':
                case 'resize':
                    this._resize();
                    break;
                case 'transitionend':
                case 'webkitTransitionEnd':
                case 'oTransitionEnd':
                case 'MSTransitionEnd':
                    this._transitionEnd(e);
                    break;
                case 'wheel':
                case 'DOMMouseScroll':
                case 'mousewheel':
                    this._wheel(e);
                    break;
                case 'keydown':
                    this._key(e);
                    break;
                case 'click':
                    if (!e._constructed) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    break;
            }
        }
    };

    function createDefaultScrollbar(direction, interactive, type) {
        var scrollbar = document.createElement('div'),
            indicator = document.createElement('div');

        if (type === true) {
            scrollbar.style.cssText = 'position:absolute;z-index:9999';
            indicator.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px';
        }

        indicator.className = 'iScrollIndicator';

        if (direction === 'h') {
            if (type === true) {
                scrollbar.style.cssText += ';height:5px;left:2px;right:2px;bottom:0';
                indicator.style.height = '100%';
            }
            scrollbar.className = 'iScrollHorizontalScrollbar';
        } else {
            if (type === true) {
                scrollbar.style.cssText += ';width:5px;bottom:2px;top:2px;right:1px';
                indicator.style.width = '100%';
            }
            scrollbar.className = 'iScrollVerticalScrollbar';
        }

        scrollbar.style.cssText += ';overflow:hidden';

        if (!interactive) {
            scrollbar.style.pointerEvents = 'none';
        }

        scrollbar.appendChild(indicator);

        return scrollbar;
    }

    function Indicator(scroller, options) {
        this.wrapper = typeof options.el === 'string' ? document.querySelector(options.el) : options.el;
        this.wrapperStyle = this.wrapper.style;
        this.indicator = this.wrapper.children[0];
        this.indicatorStyle = this.indicator.style;
        this.scroller = scroller;

        this.options = {
            listenX: true,
            listenY: true,
            interactive: false,
            resize: true,
            defaultScrollbars: false,
            shrink: false,
            fade: false,
            speedRatioX: 0,
            speedRatioY: 0
        };

        for (var i in options) { // jshint ignore:line
                this.options[i] = options[i];

        }

        this.sizeRatioX = 1;
        this.sizeRatioY = 1;
        this.maxPosX = 0;
        this.maxPosY = 0;

        if (this.options.interactive) {
            if (!this.options.disableTouch) {
                utils.addEvent(this.indicator, 'touchstart', this);
                utils.addEvent(window, 'touchend', this);
            }
            if (!this.options.disablePointer) {
                utils.addEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
                utils.addEvent(window, utils.prefixPointerEvent('pointerup'), this);
            }
            if (!this.options.disableMouse) {
                utils.addEvent(this.indicator, 'mousedown', this);
                utils.addEvent(window, 'mouseup', this);
            }
        }

        if (this.options.fade) {
            this.wrapperStyle[utils.style.transform] = this.scroller.translateZ;
            this.wrapperStyle[utils.style.transitionDuration] = utils.isBadAndroid ? '0.001s' : '0ms';
            this.wrapperStyle.opacity = '0';
        }
    }

    Indicator.prototype = {
        handleEvent: function(e) {
            switch (e.type) {
                case 'touchstart':
                case 'pointerdown':
                case 'MSPointerDown':
                case 'mousedown':
                    this._start(e);
                    break;
                case 'touchmove':
                case 'pointermove':
                case 'MSPointerMove':
                case 'mousemove':
                    this._move(e);
                    break;
                case 'touchend':
                case 'pointerup':
                case 'MSPointerUp':
                case 'mouseup':
                case 'touchcancel':
                case 'pointercancel':
                case 'MSPointerCancel':
                case 'mousecancel':
                    this._end(e);
                    break;
            }
        },

        destroy: function() {
            if (this.options.interactive) {
                utils.removeEvent(this.indicator, 'touchstart', this);
                utils.removeEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
                utils.removeEvent(this.indicator, 'mousedown', this);

                utils.removeEvent(window, 'touchmove', this);
                utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
                utils.removeEvent(window, 'mousemove', this);

                utils.removeEvent(window, 'touchend', this);
                utils.removeEvent(window, utils.prefixPointerEvent('pointerup'), this);
                utils.removeEvent(window, 'mouseup', this);
            }

            if (this.options.defaultScrollbars) {
                this.wrapper.parentNode.removeChild(this.wrapper);
            }
        },

        _start: function(e) {
            var point = e.touches ? e.touches[0] : e;

            e.preventDefault();
            e.stopPropagation();

            this.transitionTime();

            this.initiated = true;
            this.moved = false;
            this.lastPointX = point.pageX;
            this.lastPointY = point.pageY;

            this.startTime = utils.getTime();

            if (!this.options.disableTouch) {
                utils.addEvent(window, 'touchmove', this);
            }
            if (!this.options.disablePointer) {
                utils.addEvent(window, utils.prefixPointerEvent('pointermove'), this);
            }
            if (!this.options.disableMouse) {
                utils.addEvent(window, 'mousemove', this);
            }

            this.scroller._execEvent('beforeScrollStart');
        },

        _move: function(e) {
            var point = e.touches ? e.touches[0] : e,
                deltaX, deltaY,
                newX, newY,
                timestamp = utils.getTime();

            if (!this.moved) {
                this.scroller._execEvent('scrollStart');
            }

            this.moved = true;

            deltaX = point.pageX - this.lastPointX;
            this.lastPointX = point.pageX;

            deltaY = point.pageY - this.lastPointY;
            this.lastPointY = point.pageY;

            newX = this.x + deltaX;
            newY = this.y + deltaY;

            this._pos(newX, newY);


            if (this.scroller.options.probeType === 1 && timestamp - this.startTime > 300) {
                this.startTime = timestamp;
                this.scroller._execEvent('scroll');
            } else if (this.scroller.options.probeType > 1) {
                this.scroller._execEvent('scroll');
            }


            // INSERT POINT: indicator._move

            e.preventDefault();
            e.stopPropagation();
        },

        _end: function(e) {
            if (!this.initiated) {
                return;
            }

            this.initiated = false;

            e.preventDefault();
            e.stopPropagation();

            utils.removeEvent(window, 'touchmove', this);
            utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
            utils.removeEvent(window, 'mousemove', this);

            if (this.scroller.options.snap) {
                var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);

                var time = this.options.snapSpeed || Math.max(
                    Math.max(
                        Math.min(Math.abs(this.scroller.x - snap.x), 1000),
                        Math.min(Math.abs(this.scroller.y - snap.y), 1000)
                    ), 300);

                if (this.scroller.x !== snap.x || this.scroller.y !== snap.y) {
                    this.scroller.directionX = 0;
                    this.scroller.directionY = 0;
                    this.scroller.currentPage = snap;
                    this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.bounceEasing);
                }
            }

            if (this.moved) {
                this.scroller._execEvent('scrollEnd');
            }
        },

        transitionTime: function(time) {
            time = time || 0;
            this.indicatorStyle[utils.style.transitionDuration] = time + 'ms';

            if (!time && utils.isBadAndroid) {
                this.indicatorStyle[utils.style.transitionDuration] = '0.001s';
            }
        },

        transitionTimingFunction: function(easing) {
            this.indicatorStyle[utils.style.transitionTimingFunction] = easing;
        },

        refresh: function() {
            this.transitionTime();

            if (this.options.listenX && !this.options.listenY) {
                this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
            } else if (this.options.listenY && !this.options.listenX) {
                this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
            } else {
                this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
            }

            if (this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll) {
                utils.addClass(this.wrapper, 'iScrollBothScrollbars');
                utils.removeClass(this.wrapper, 'iScrollLoneScrollbar');

                if (this.options.defaultScrollbars && this.options.customStyle) {
                    if (this.options.listenX) {
                        this.wrapper.style.right = '8px';
                    } else {
                        this.wrapper.style.bottom = '8px';
                    }
                }
            } else {
                utils.removeClass(this.wrapper, 'iScrollBothScrollbars');
                utils.addClass(this.wrapper, 'iScrollLoneScrollbar');

                if (this.options.defaultScrollbars && this.options.customStyle) {
                    if (this.options.listenX) {
                        this.wrapper.style.right = '2px';
                    } else {
                        this.wrapper.style.bottom = '2px';
                    }
                }
            }

            // var r = this.wrapper.offsetHeight; // force refresh

            if (this.options.listenX) {
                this.wrapperWidth = this.wrapper.clientWidth;
                if (this.options.resize) {
                    this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
                    this.indicatorStyle.width = this.indicatorWidth + 'px';
                } else {
                    this.indicatorWidth = this.indicator.clientWidth;
                }

                this.maxPosX = this.wrapperWidth - this.indicatorWidth;

                if (this.options.shrink === 'clip') {
                    this.minBoundaryX = -this.indicatorWidth + 8;
                    this.maxBoundaryX = this.wrapperWidth - 8;
                } else {
                    this.minBoundaryX = 0;
                    this.maxBoundaryX = this.maxPosX;
                }

                this.sizeRatioX = this.options.speedRatioX || (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX));
            }

            if (this.options.listenY) {
                this.wrapperHeight = this.wrapper.clientHeight;
                if (this.options.resize) {
                    this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
                    this.indicatorStyle.height = this.indicatorHeight + 'px';
                } else {
                    this.indicatorHeight = this.indicator.clientHeight;
                }

                this.maxPosY = this.wrapperHeight - this.indicatorHeight;

                if (this.options.shrink === 'clip') {
                    this.minBoundaryY = -this.indicatorHeight + 8;
                    this.maxBoundaryY = this.wrapperHeight - 8;
                } else {
                    this.minBoundaryY = 0;
                    this.maxBoundaryY = this.maxPosY;
                }

                this.maxPosY = this.wrapperHeight - this.indicatorHeight;
                this.sizeRatioY = this.options.speedRatioY || (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY));
            }

            this.updatePosition();
        },

        updatePosition: function() {
            var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
                y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;

            if (!this.options.ignoreBoundaries) {
                if (x < this.minBoundaryX) {
                    if (this.options.shrink === 'scale') {
                        this.width = Math.max(this.indicatorWidth + x, 8);
                        this.indicatorStyle.width = this.width + 'px';
                    }
                    x = this.minBoundaryX;
                } else if (x > this.maxBoundaryX) {
                    if (this.options.shrink === 'scale') {
                        this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
                        this.indicatorStyle.width = this.width + 'px';
                        x = this.maxPosX + this.indicatorWidth - this.width;
                    } else {
                        x = this.maxBoundaryX;
                    }
                } else if (this.options.shrink === 'scale' && this.width !== this.indicatorWidth) {
                    this.width = this.indicatorWidth;
                    this.indicatorStyle.width = this.width + 'px';
                }

                if (y < this.minBoundaryY) {
                    if (this.options.shrink === 'scale') {
                        this.height = Math.max(this.indicatorHeight + y * 3, 8);
                        this.indicatorStyle.height = this.height + 'px';
                    }
                    y = this.minBoundaryY;
                } else if (y > this.maxBoundaryY) {
                    if (this.options.shrink === 'scale') {
                        this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
                        this.indicatorStyle.height = this.height + 'px';
                        y = this.maxPosY + this.indicatorHeight - this.height;
                    } else {
                        y = this.maxBoundaryY;
                    }
                } else if (this.options.shrink === 'scale' && this.height !== this.indicatorHeight) {
                    this.height = this.indicatorHeight;
                    this.indicatorStyle.height = this.height + 'px';
                }
            }

            this.x = x;
            this.y = y;

            if (this.scroller.options.useTransform) {
                this.indicatorStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ;
            } else {
                this.indicatorStyle.left = x + 'px';
                this.indicatorStyle.top = y + 'px';
            }
        },

        _pos: function(x, y) {
            if (x < 0) {
                x = 0;
            } else if (x > this.maxPosX) {
                x = this.maxPosX;
            }

            if (y < 0) {
                y = 0;
            } else if (y > this.maxPosY) {
                y = this.maxPosY;
            }

            x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x;
            y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y;

            this.scroller.scrollTo(x, y);
        },

        fade: function(val, hold) {
            if (hold && !this.visible) {
                return;
            }

            clearTimeout(this.fadeTimeout);
            this.fadeTimeout = null;

            var time = val ? 250 : 500,
                delay = val ? 0 : 300;

            val = val ? '1' : '0';

            this.wrapperStyle[utils.style.transitionDuration] = time + 'ms';

            this.fadeTimeout = setTimeout((function(val) {
                this.wrapperStyle.opacity = val;
                this.visible = +val;
            }).bind(this, val), delay);
        }
    };

    IScroll.utils = utils;

    window.IScroll = IScroll;
}(window);

/*======================================================
************   Modals   ************
======================================================*/
/*jshint unused: false*/
+function ($) {
  "use strict";
  $.lastPosition =function(options) {
    if ( !sessionStorage) {
        return;
    }
    // 需要记忆模块的className
    var needMemoryClass = options.needMemoryClass || [];

    $(window).off('beforePageSwitch').on('beforePageSwitch', function(event,id,arg) {
      updateMemory(id,arg);
    });
    $(window).off('pageAnimationStart').on('pageAnimationStart', function(event,id,arg) {
      getMemory(id,arg);
    });
    //让后退页面回到之前的高度
    function getMemory(id,arg){
      needMemoryClass.forEach(function(item, index) {
          if ($(item).length === 0) {
              return;
          }
          var positionName = id ;
          // 遍历对应节点设置存储的高度
          var memoryHeight = sessionStorage.getItem(positionName);
          arg.find(item).scrollTop(parseInt(memoryHeight));

      });
    }
    //记住即将离开的页面的高度
    function updateMemory(id,arg) {
        var positionName = id ;
        // 存储需要记忆模块的高度
        needMemoryClass.forEach(function(item, index) {
            if ($(item).length === 0) {
                return;
            }
            sessionStorage.setItem(
                positionName,
                arg.find(item).scrollTop()
            );

        });
    }
  };
}(Zepto);

/*===============================================================================
************   lazyload   ************
===============================================================================*/
/* global Zepto:true */
+ function($) {
    "use strict";

    var w = window,
        $window = $(w),
        defaultOptions = {
            threshold: 0,
            failure_limit: 0,
            event: 'scroll',
            effect: 'show',
            effect_params: null,
            container: w,
            data_attribute: 'original',
            data_srcset_attribute: 'original-srcset',
            skip_invisible: true,
            appear: emptyFn,
            load: emptyFn,
            vertical_only: false,
            check_appear_throttle_time: 300,
            url_rewriter_fn: emptyFn,
            no_fake_img_loader: false,
            placeholder_data_img: null,
            // for IE6\7 that does not support data image
            placeholder_real_img: null
                // todo : 将某些属性用global来配置，而不是每次在$(selector).lazyload({})内配置
        },
        type // function

    function emptyFn() {}

    type = (function() {
        var object_prototype_toString = Object.prototype.toString
        return function(obj) {
            // todo: compare the speeds of replace string twice or replace a regExp
            return object_prototype_toString.call(obj).replace('[object ', '').replace(']', '')
        }
    })()

    function belowthefold($element, options) {
        var fold
        if (options._$container == $window) {
            fold = ('innerHeight' in w ? w.innerHeight : $window.height()) + $window.scrollTop()
        } else {
            fold = options._$container.offset().top + options._$container.height()
        }
        return fold <= $element.offset().top - options.threshold
    }

    function rightoffold($element, options) {
        var fold
        if (options._$container == $window) {
            // Zepto do not support `$window.scrollLeft()` yet.
            fold = $window.width() + ($.fn.scrollLeft ? $window.scrollLeft() : w.pageXOffset)
        } else {
            fold = options._$container.offset().left + options._$container.width()
        }
        return fold <= $element.offset().left - options.threshold
    }

    function abovethetop($element, options) {
        var fold
        if (options._$container == $window) {
            fold = $window.scrollTop()
        } else {
            fold = options._$container.offset().top
        }
        // console.log('abovethetop fold '+ fold)
        //console.log('abovethetop $element.height() '+ $element.height())
        return fold >= $element.offset().top + options.threshold + $element.height()
    }

    function leftofbegin($element, options) {
        var fold
        if (options._$container == $window) {
            // Zepto do not support `$window.scrollLeft()` yet.
            fold = $.fn.scrollLeft ? $window.scrollLeft() : w.pageXOffset
        } else {
            fold = options._$container.offset().left
        }
        return fold >= $element.offset().left + options.threshold + $element.width()
    }

    function checkAppear($elements, options) {
        var counter = 0
        $elements.each(function(i, e) {
            var $element = $elements.eq(i)
            if (($element.width() <= 0 && $element.height() <= 0) || $element.css('display') === 'none') {
                return
            }

            function appear() {
                $element.trigger('_lazyload_appear')
                    // if we found an image we'll load, reset the counter 
                counter = 0
            }
            // If vertical_only is set to true, only check the vertical to decide appear or not
            // In most situations, page can only scroll vertically, set vertical_only to true will improve performance
            if (options.vertical_only) {
                if (abovethetop($element, options)) {
                    // Nothing. 
                } else if (!belowthefold($element, options)) {
                    appear()
                } else {
                    if (++counter > options.failure_limit) {
                        return false
                    }
                }
            } else {
                if (abovethetop($element, options) || leftofbegin($element, options)) {
                    // Nothing. 
                } else if (!belowthefold($element, options) && !rightoffold($element, options)) {
                    appear()
                } else {
                    if (++counter > options.failure_limit) {
                        return false
                    }
                }
            }
        })
    }

    // Remove image from array so it is not looped next time. 
    function getUnloadElements($elements) {
        return $elements.filter(function(i, e) {
            return !$elements.eq(i)._lazyload_loadStarted
        })
    }

    function createImage($url, $callback) {
        var imgtemp = new Image(); //创建一个image对象
        imgtemp.src = $url;
        imgtemp.onload = $callback;
    }

    // throttle : https://github.com/component/throttle , MIT License
    function throttle(func, wait) {
        var ctx, args, rtn, timeoutID // caching
        var last = 0

        return function throttled() {
            ctx = this
            args = arguments
            var delta = new Date() - last
            if (!timeoutID)
                if (delta >= wait) call()
                else timeoutID = setTimeout(call, wait - delta)
            return rtn
        }

        function call() {
            timeoutID = 0
            last = +new Date()
            rtn = func.apply(ctx, args)
            ctx = null
            args = null
        }
    }
    $.fn.lazyload = function(options) {
        var $elements = this,
            isScrollEvent,
            isScrollTypeEvent,
            throttleCheckAppear

        if (!$.isPlainObject(options)) {
            options = {}
        }

        $.each(defaultOptions, function(k, v) {
            if ($.inArray(k, ['threshold', 'failure_limit', 'check_appear_throttle_time']) != -1) { // these params can be a string
                if (type(options[k]) == 'String') {
                    options[k] = parseInt(options[k], 10)
                } else {
                    options[k] = v
                }
            } else if (k == 'container') { // options.container can be a seletor string \ dom \ jQuery object
                if (options.hasOwnProperty(k)) {
                    if (options[k] == w || options[k] == document) {
                        options._$container = $window
                    } else {
                        options._$container = $(options[k])
                    }
                } else {
                    options._$container = $window
                }
                delete options.container
            } else if (defaultOptions.hasOwnProperty(k) && (!options.hasOwnProperty(k) || (type(options[k]) != type(defaultOptions[k])))) {
                options[k] = v
            }
        })

        isScrollEvent = options.event == 'scroll'
        throttleCheckAppear = options.check_appear_throttle_time == 0 ?
            checkAppear : throttle(checkAppear, options.check_appear_throttle_time)

        // isScrollTypeEvent cantains custom scrollEvent . Such as 'scrollstart' & 'scrollstop'
        // https://github.com/search?utf8=%E2%9C%93&q=scrollstart
        isScrollTypeEvent = isScrollEvent || options.event == 'scrollstart' || options.event == 'scrollstop'

        $elements.each(function(i, e) {
            var element = this,
                $element = $elements.eq(i),
                placeholderSrc = $element.attr('src'),
                originalSrcInAttr = $element.attr('data-' + options.data_attribute), // `data-original` attribute value
                originalSrc = options.url_rewriter_fn == emptyFn ?
                originalSrcInAttr :
                options.url_rewriter_fn.call(element, $element, originalSrcInAttr),
                originalSrcset = $element.attr('data-' + options.data_srcset_attribute),
                isImg = $element.is('img')

            if ($element._lazyload_loadStarted == true || placeholderSrc == originalSrc) {
                $element._lazyload_loadStarted = true
                $elements = getUnloadElements($elements)
                return
            }

            $element._lazyload_loadStarted = false
                // var imgtemp = new Image();//创建一个image对象
                // imgtemp.src = $element.attr("data-original");
                // imgtemp.onload = function(){
                //  console.log(this.width);
                // }
            var loadHtml = '<div style="width:100%;height:100%;background:#fafafa;text-align:center;line-height:200px">';
            loadHtml += '<div class="preloader" style="margin:auto">';
            loadHtml += '</div>';
            loadHtml += '</div>';

            // If element is an img and no src attribute given, use placeholder. 
            if (isImg && !placeholderSrc) {
                // For browsers that do not support data image.
                $element.one('error', function() { // `on` -> `one` : IE6 triggered twice error event sometimes
                    $element.attr('src', options.placeholder_real_img)
                }).attr('src', options.placeholder_data_img)
            } else {

                $element.one('error', function() { // `on` -> `one` : IE6 triggered twice error event sometimes
                    $element.html(loadHtml);
                }).html(loadHtml);

            }

            // When appear is triggered load original image. 
            $element.one('_lazyload_appear', function() {
                var effectParamsIsArray = $.isArray(options.effect_params),
                    effectIsNotImmediacyShow

                function loadFunc() {
                    // In most situations, the effect is immediacy show, at this time there is no need to hide element first
                    // Hide this element may cause css reflow, call it as less as possible
                    if (effectIsNotImmediacyShow) {
                        // todo: opacity:0 for fadeIn effect
                        $element.hide()
                    }
                    if (isImg) {
                        // attr srcset first
                        if (originalSrcset) {
                            $element.attr('srcset', originalSrcset)
                        }
                        if (originalSrc) {
                            $element.attr('src', originalSrc)
                        }
                    } else {
                        $element.html("<img src='" + originalSrc + "' width='100%' height='100%'>")
                            //$element.css('background-image','url("' + originalSrc + '")')
                    }
                    if (effectIsNotImmediacyShow) {
                        $element[options.effect].apply($element, effectParamsIsArray ? options.effect_params : [])
                    }
                    $elements = getUnloadElements($elements)
                }
                if (!$element._lazyload_loadStarted) {
                    effectIsNotImmediacyShow = (options.effect != 'show' && $.fn[options.effect] && (!options.effect_params || (effectParamsIsArray && options.effect_params.length == 0)))
                    if (options.appear != emptyFn) {
                        options.appear.call(element, $element, $elements.length, options)
                    }
                    $element._lazyload_loadStarted = true
                    if (options.no_fake_img_loader || originalSrcset) {
                        if (options.load != emptyFn) {
                            $element.one('load', function() {
                                options.load.call(element, $element, $elements.length, options)
                            })
                        }
                        loadFunc()
                    } else {
                        $('<img />').one('load', function() { // `on` -> `one` : IE6 triggered twice load event sometimes
                            loadFunc()
                            if (options.load != emptyFn) {
                                options.load.call(element, $element, $elements.length, options)
                            }
                        }).attr('src', originalSrc)
                    }
                }
            })

            // When wanted event is triggered load original image 
            // by triggering appear.                              
            if (!isScrollTypeEvent) {
                $element.on(options.event, function() {
                    if (!$element._lazyload_loadStarted) {
                        $element.trigger('_lazyload_appear')
                    }
                })
            }
        })

        // Fire one scroll event per scroll. Not one scroll event per image. 
        if (isScrollTypeEvent) {
            options._$container.on(options.event, function() {
                throttleCheckAppear($elements, options)
            })
        }

        // Check if something appears when window is resized. 
        // Force initial check if images should appear when window is onload. 
        $window.on('resize load', function() {
            throttleCheckAppear($elements, options)
        })

        // Force initial check if images should appear. 
        $(function() {
            throttleCheckAppear($elements, options)
        })

        return this
    }
}(Zepto);
/*======================================================
************   Modals   ************
======================================================*/
/*jshint unused: false*/
+function ($) {
    "use strict";
    var _modalTemplateTempDiv = document.createElement('div');

    $.modalStack = [];

    $.modalStackClearQueue = function () {
        if ($.modalStack.length) {
            ($.modalStack.shift())();
        }
    };
    $.modal = function (params) {
        params = params || {};
        var modalHTML = '';
        var buttonsHTML = '';
        if (params.buttons && params.buttons.length > 0) {
            for (var i = 0; i < params.buttons.length; i++) {
                buttonsHTML += '<span class="modal-button' + (params.buttons[i].bold ? ' modal-button-bold' : '') + '">' + params.buttons[i].text + '</span>';
            }
        }
        var extraClass = params.extraClass || '';
        var titleHTML = params.title ? '<div class="modal-title">' + params.title + '</div>' : '';
        var textHTML = params.text ? '<div class="modal-text">' + params.text + '</div>' : '';
        var afterTextHTML = params.afterText ? params.afterText : '';
        var noButtons = !params.buttons || params.buttons.length === 0 ? 'modal-no-buttons' : '';
        var verticalButtons = params.verticalButtons ? 'modal-buttons-vertical' : '';
        modalHTML = '<div class="modal ' + extraClass + ' ' + noButtons + '"><div class="modal-inner">' + (titleHTML + textHTML + afterTextHTML) + '</div><div class="modal-buttons ' + verticalButtons + '">' + buttonsHTML + '</div></div>';

        _modalTemplateTempDiv.innerHTML = modalHTML;

        var modal = $(_modalTemplateTempDiv).children();

        $(defaults.modalContainer).append(modal[0]);

        // Add events on buttons
        modal.find('.modal-button').each(function (index, el) {
            $(el).on('click', function (e) {
                if (params.buttons[index].close !== false) $.closeModal(modal);
                if (params.buttons[index].onClick) params.buttons[index].onClick(modal, e);
                if (params.onClick) params.onClick(modal, index);
            });
        });
        $.openModal(modal);
        return modal[0];
    };
    $.alert = function (text, title, callbackOk) {
        if (typeof title === 'function') {
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            buttons: [ {text: defaults.modalButtonOk, bold: true, onClick: callbackOk} ]
        });
    };
    $.confirm = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            buttons: [
                {text: defaults.modalButtonCancel, onClick: callbackCancel},
                {text: defaults.modalButtonOk, bold: true, onClick: callbackOk}
            ]
        });
    };
    $.prompt = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            afterText: '<input type="text" class="modal-text-input">',
            buttons: [
                {
                    text: defaults.modalButtonCancel
                },
                {
                    text: defaults.modalButtonOk,
                    bold: true
                }
            ],
            onClick: function (modal, index) {
                if (index === 0 && callbackCancel) callbackCancel($(modal).find('.modal-text-input').val());
                if (index === 1 && callbackOk) callbackOk($(modal).find('.modal-text-input').val());
            }
        });
    };
    $.modalLogin = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            afterText: '<input type="text" name="modal-username" placeholder="' + defaults.modalUsernamePlaceholder + '" class="modal-text-input modal-text-input-double"><input type="password" name="modal-password" placeholder="' + defaults.modalPasswordPlaceholder + '" class="modal-text-input modal-text-input-double">',
            buttons: [
                {
                    text: defaults.modalButtonCancel
                },
                {
                    text: defaults.modalButtonOk,
                    bold: true
                }
            ],
            onClick: function (modal, index) {
                var username = $(modal).find('.modal-text-input[name="modal-username"]').val();
                var password = $(modal).find('.modal-text-input[name="modal-password"]').val();
                if (index === 0 && callbackCancel) callbackCancel(username, password);
                if (index === 1 && callbackOk) callbackOk(username, password);
            }
        });
    };
    $.modalPassword = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            afterText: '<input type="password" name="modal-password" placeholder="' + defaults.modalPasswordPlaceholder + '" class="modal-text-input">',
            buttons: [
                {
                    text: defaults.modalButtonCancel
                },
                {
                    text: defaults.modalButtonOk,
                    bold: true
                }
            ],
            onClick: function (modal, index) {
                var password = $(modal).find('.modal-text-input[name="modal-password"]').val();
                if (index === 0 && callbackCancel) callbackCancel(password);
                if (index === 1 && callbackOk) callbackOk(password);
            }
        });
    };
    $.showPreloader = function (title) {
        $.hidePreloader();
        $.showPreloader.preloaderModal = $.modal({
            title: title || defaults.modalPreloaderTitle,
            text: '<div class="preloader"></div>'
        });

        return $.showPreloader.preloaderModal;
    };
    $.hidePreloader = function () {
        $.showPreloader.preloaderModal && $.closeModal($.showPreloader.preloaderModal);
    };
    $.showIndicator = function () {
        if ($('.preloader-indicator-modal')[0]) return;
        $(defaults.modalContainer).append('<div class="preloader-indicator-overlay"></div><div class="preloader-indicator-modal"><span class="preloader preloader-white"></span></div>');
    };
    $.hideIndicator = function () {
        $('.preloader-indicator-overlay, .preloader-indicator-modal').remove();
    };
    // Action Sheet
    $.actions = function (params) {
        var modal, groupSelector, buttonSelector;
        params = params || [];

        if (params.length > 0 && !$.isArray(params[0])) {
            params = [params];
        }
        var modalHTML;
        var buttonsHTML = '';
        for (var i = 0; i < params.length; i++) {
            for (var j = 0; j < params[i].length; j++) {
                if (j === 0) buttonsHTML += '<div class="actions-modal-group">';
                var button = params[i][j];
                var buttonClass = button.label ? 'actions-modal-label' : 'actions-modal-button';
                if (button.bold) buttonClass += ' actions-modal-button-bold';
                if (button.color) buttonClass += ' color-' + button.color;
                if (button.bg) buttonClass += ' bg-' + button.bg;
                if (button.disabled) buttonClass += ' disabled';
                buttonsHTML += '<span class="' + buttonClass + '">' + button.text + '</span>';
                if (j === params[i].length - 1) buttonsHTML += '</div>';
            }
        }
        modalHTML = '<div class="actions-modal">' + buttonsHTML + '</div>';
        _modalTemplateTempDiv.innerHTML = modalHTML;
        modal = $(_modalTemplateTempDiv).children();
        $(defaults.modalContainer).append(modal[0]);
        groupSelector = '.actions-modal-group';
        buttonSelector = '.actions-modal-button';

        var groups = modal.find(groupSelector);
        groups.each(function (index, el) {
            var groupIndex = index;
            $(el).children().each(function (index, el) {
                var buttonIndex = index;
                var buttonParams = params[groupIndex][buttonIndex];
                var clickTarget;
                if ($(el).is(buttonSelector)) clickTarget = $(el);
                // if (toPopover && $(el).find(buttonSelector).length > 0) clickTarget = $(el).find(buttonSelector);

                if (clickTarget) {
                    clickTarget.on('click', function (e) {
                        if (buttonParams.close !== false) $.closeModal(modal);
                        if (buttonParams.onClick) buttonParams.onClick(modal, e);
                    });
                }
            });
        });
        $.openModal(modal);
        return modal[0];
    };
    $.popup = function (modal, removeOnClose) {
        if (typeof removeOnClose === 'undefined') removeOnClose = true;
        if (typeof modal === 'string' && modal.indexOf('<') >= 0) {
            var _modal = document.createElement('div');
            _modal.innerHTML = modal.trim();
            if (_modal.childNodes.length > 0) {
                modal = _modal.childNodes[0];
                if (removeOnClose) modal.classList.add('remove-on-close');
                $(defaults.modalContainer).append(modal);
            }
            else return false; //nothing found
        }
        modal = $(modal);
        if (modal.length === 0) return false;
        modal.show();
        modal.find(".content").scroller("refresh");
        if (modal.find('.' + defaults.viewClass).length > 0) {
            $.sizeNavbars(modal.find('.' + defaults.viewClass)[0]);
        }
        $.openModal(modal);

        return modal[0];
    };
    $.pickerModal = function (pickerModal, removeOnClose) {
        if (typeof removeOnClose === 'undefined') removeOnClose = true;
        if (typeof pickerModal === 'string' && pickerModal.indexOf('<') >= 0) {
            pickerModal = $(pickerModal);
            if (pickerModal.length > 0) {
                if (removeOnClose) pickerModal.addClass('remove-on-close');
                $(defaults.modalContainer).append(pickerModal[0]);
            }
            else return false; //nothing found
        }
        pickerModal = $(pickerModal);
        if (pickerModal.length === 0) return false;
        pickerModal.show();
        $.openModal(pickerModal);
        return pickerModal[0];
    };
    $.loginScreen = function (modal) {
        if (!modal) modal = '.login-screen';
        modal = $(modal);
        if (modal.length === 0) return false;
        modal.show();
        if (modal.find('.' + defaults.viewClass).length > 0) {
            $.sizeNavbars(modal.find('.' + defaults.viewClass)[0]);
        }
        $.openModal(modal);
        return modal[0];
    };
    //显示一个消息，会在2秒钟后自动消失
    $.toast = function(msg, duration, extraclass) {
        var $toast = $('<div class="modal toast ' + (extraclass || '') + '">' + msg + '</div>').appendTo(document.body);
        $.openModal($toast, function(){
            setTimeout(function() {
                $.closeModal($toast);
            }, duration || 2000);
        });
    };

    $.hint = function(msg, duration, isClosed) {
        var $toast = $('<div class="modal toast hint" id="hint">' + msg + '</div>').appendTo(document.body);
        $.openModal($toast, function(){
            setTimeout(function() {
                $.closeModal($toast);
            }, duration || 2000);
        });
    };
    
    $.openModal = function (modal, cb) {
        modal = $(modal);
        var isModal = modal.hasClass('modal'),
            isNotToast = !modal.hasClass('toast');
        if ($('.modal.modal-in:not(.modal-out)').length && defaults.modalStack && isModal && isNotToast) {
            $.modalStack.push(function () {
                $.openModal(modal, cb);
            });
            return;
        }
        var isPopup = modal.hasClass('popup');
        var isLoginScreen = modal.hasClass('login-screen');
        var isPickerModal = modal.hasClass('picker-modal');
        var isToast = modal.hasClass('toast');
        if (isModal) {
            modal.show();
            modal.css({
                marginTop: - Math.round(modal.outerHeight() / 2) + 'px'
            });
        }
        if (isToast) {
            modal.css({
                marginLeft: - Math.round(modal.outerWidth() / 2 / 1.185) + 'px' //1.185 是初始化时候的放大效果
            });
        }

        var overlay;
        if (!isLoginScreen && !isPickerModal && !isToast) {
            if ($('.modal-overlay').length === 0 && !isPopup) {
                $(defaults.modalContainer).append('<div class="modal-overlay"></div>');
            }
            if ($('.popup-overlay').length === 0 && isPopup) {
                $(defaults.modalContainer).append('<div class="popup-overlay"></div>');
            }
            overlay = isPopup ? $('.popup-overlay') : $('.modal-overlay');
        }

        //Make sure that styles are applied, trigger relayout;
        var clientLeft = modal[0].clientLeft;

        // Trugger open event
        modal.trigger('open');

        // Picker modal body class
        if (isPickerModal) {
            $(defaults.modalContainer).addClass('with-picker-modal');
        }

        // Classes for transition in
        if (!isLoginScreen && !isPickerModal && !isToast) overlay.addClass('modal-overlay-visible');
        modal.removeClass('modal-out').addClass('modal-in').transitionEnd(function (e) {
            if (modal.hasClass('modal-out')) modal.trigger('closed');
            else modal.trigger('opened');
        });
        // excute callback
        if (typeof cb === 'function') {
          cb.call(this);
        }
        return true;
    };
    $.closeModal = function (modal) {
        modal = $(modal || '.modal-in');
        if (typeof modal !== 'undefined' && modal.length === 0) {
            return;
        }
        var isModal = modal.hasClass('modal'),
            isPopup = modal.hasClass('popup'),
            isToast = modal.hasClass('toast'),
            isLoginScreen = modal.hasClass('login-screen'),
            isPickerModal = modal.hasClass('picker-modal'),
            removeOnClose = modal.hasClass('remove-on-close'),
            overlay = isPopup ? $('.popup-overlay') : $('.modal-overlay');
        if (isPopup){
            if (modal.length === $('.popup.modal-in').length) {
                overlay.removeClass('modal-overlay-visible');
            }
        }
        else if (!(isPickerModal || isToast)) {
            overlay.removeClass('modal-overlay-visible');
        }

        modal.trigger('close');

        // Picker modal body class
        if (isPickerModal) {
            $(defaults.modalContainer).removeClass('with-picker-modal');
            $(defaults.modalContainer).addClass('picker-modal-closing');
        }

        modal.removeClass('modal-in').addClass('modal-out').transitionEnd(function (e) {
            if (modal.hasClass('modal-out')) modal.trigger('closed');
            else modal.trigger('opened');

            if (isPickerModal) {
                $(defaults.modalContainer).removeClass('picker-modal-closing');
            }
            if (isPopup || isLoginScreen || isPickerModal) {
                modal.removeClass('modal-out').hide();
                if (removeOnClose && modal.length > 0) {
                    modal.remove();
                }
            }
            else {
                modal.remove();
            }
        });
        if (isModal &&  defaults.modalStack ) {
            $.modalStackClearQueue();
        }

        return true;
    };
    function handleClicks(e) {
        /*jshint validthis:true */
        var clicked = $(this);
        var url = clicked.attr('href');


        //Collect Clicked data- attributes
        var clickedData = clicked.dataset();

        // Popup
        var popup;
        if (clicked.hasClass('open-popup')) {
            if (clickedData.popup) {
                popup = clickedData.popup;
            }
            else popup = '.popup';
            $.popup(popup);
        }
        if (clicked.hasClass('close-popup')) {
            if (clickedData.popup) {
                popup = clickedData.popup;
            }
            else popup = '.popup.modal-in';
            $.closeModal(popup);
        }

        // Close Modal
        if (clicked.hasClass('modal-overlay')) {
            if ($('.modal.modal-in').length > 0 && defaults.modalCloseByOutside)
                $.closeModal('.modal.modal-in');
            if ($('.actions-modal.modal-in').length > 0 && defaults.actionsCloseByOutside)
                $.closeModal('.actions-modal.modal-in');

        }
        if (clicked.hasClass('popup-overlay')) {
            if ($('.popup.modal-in').length > 0 && defaults.popupCloseByOutside)
                $.closeModal('.popup.modal-in');
        }




    }
    $(document).on('click', ' .modal-overlay, .popup-overlay, .close-popup, .open-popup, .close-picker', handleClicks);
    var defaults =  $.modal.prototype.defaults  = {
        modalStack: true,
        modalButtonOk: '确定',
        modalButtonCancel: '取消',
        modalPreloaderTitle: '加载中',
        modalContainer : document.body ? document.body : 'body'
    };
}(Zepto);

/*======================================================
************   Panels   ************
======================================================*/
/*jshint unused: false*/
+function ($) {
    "use strict";
    $.allowPanelOpen = true;
    $.openPanel = function (panel) {
        if (!$.allowPanelOpen) return false;
        if(panel === 'left' || panel === 'right') panel = ".panel-" + panel;  //可以传入一个方向
        panel = panel ? $(panel) : $(".panel").eq(0);
        var direction = panel.hasClass("panel-right") ? "right" : "left";
        if (panel.length === 0 || panel.hasClass('active')) return false;
        $.closePanel(); // Close if some panel is opened
        $.allowPanelOpen = false;
        var effect = panel.hasClass('panel-reveal') ? 'reveal' : 'cover';
        panel.css({display: 'block'}).addClass('active');
        panel.trigger('open');

        // Trigger reLayout
        var clientLeft = panel[0].clientLeft;

        // Transition End;
        var transitionEndTarget = effect === 'reveal' ? $($.getCurrentPage()) : panel;
        var openedTriggered = false;

        function panelTransitionEnd() {
            transitionEndTarget.transitionEnd(function (e) {
                if (e.target === transitionEndTarget[0]) {
                    if (panel.hasClass('active')) {
                        panel.trigger('opened');
                    }
                    else {
                        panel.trigger('closed');
                    }
            $.allowPanelOpen = true;
                }
                else panelTransitionEnd();
            });
        }
        panelTransitionEnd();

        $(document.body).addClass('with-panel-' + direction + '-' + effect);
        return true;
    };
    $.closePanel = function () {
        var activePanel = $('.panel.active');
        if (activePanel.length === 0) return false;
        var effect = activePanel.hasClass('panel-reveal') ? 'reveal' : 'cover';
        var panelPosition = activePanel.hasClass('panel-left') ? 'left' : 'right';
        activePanel.removeClass('active');
        var transitionEndTarget = effect === 'reveal' ? $('.page') : activePanel;
        activePanel.trigger('close');
        $.allowPanelOpen = false;

        transitionEndTarget.transitionEnd(function () {
            if (activePanel.hasClass('active')) return;
            activePanel.css({display: ''});
            activePanel.trigger('closed');
            $('body').removeClass('panel-closing');
            $.allowPanelOpen = true;
        });

        $('body').addClass('panel-closing').removeClass('with-panel-' + panelPosition + '-' + effect);
    };

    $(document).on("click", ".open-panel", function(e) {
        var panel = $(e.target).data('panel');
        $.openPanel(panel);
    });
    $(document).on("click", ".close-panel, .panel-overlay", function(e) {
        $.closePanel();
    });
    /*======================================================
     ************   Swipe panels   ************
     ======================================================*/
    $.initSwipePanels = function () {
        var panel, side;
        var swipePanel = $.smConfig.swipePanel;
        var swipePanelOnlyClose = $.smConfig.swipePanelOnlyClose;
        var swipePanelCloseOpposite = true;
        var swipePanelActiveArea = false;
        var swipePanelThreshold = 2;
        var swipePanelNoFollow = false;

        if(!(swipePanel || swipePanelOnlyClose)) return;

        var panelOverlay = $('.panel-overlay');
        var isTouched, isMoved, isScrolling, touchesStart = {}, touchStartTime, touchesDiff, translate, opened, panelWidth, effect, direction;
        var views = $('.page');

        function handleTouchStart(e) {
            if (!$.allowPanelOpen || (!swipePanel && !swipePanelOnlyClose) || isTouched) return;
            if ($('.modal-in, .photo-browser-in').length > 0) return;
            if (!(swipePanelCloseOpposite || swipePanelOnlyClose)) {
                if ($('.panel.active').length > 0 && !panel.hasClass('active')) return;
            }
            touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            if (swipePanelCloseOpposite || swipePanelOnlyClose) {
                if ($('.panel.active').length > 0) {
                    side = $('.panel.active').hasClass('panel-left') ? 'left' : 'right';
                }
                else {
                    if (swipePanelOnlyClose) return;
                    side = swipePanel;
                }
                if (!side) return;
            }
            panel = $('.panel.panel-' + side);
            if(!panel[0]) return;
            opened = panel.hasClass('active');
            if (swipePanelActiveArea && !opened) {
                if (side === 'left') {
                    if (touchesStart.x > swipePanelActiveArea) return;
                }
                if (side === 'right') {
                    if (touchesStart.x < window.innerWidth - swipePanelActiveArea) return;
                }
            }
            isMoved = false;
            isTouched = true;
            isScrolling = undefined;

            touchStartTime = (new Date()).getTime();
            direction = undefined;
        }
        function handleTouchMove(e) {
            if (!isTouched) return;
            if(!panel[0]) return;
            if (e.f7PreventPanelSwipe) return;
            var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            if (typeof isScrolling === 'undefined') {
                isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(pageX - touchesStart.x));
            }
            if (isScrolling) {
                isTouched = false;
                return;
            }
            if (!direction) {
                if (pageX > touchesStart.x) {
                    direction = 'to-right';
                }
                else {
                    direction = 'to-left';
                }

                if (
                        side === 'left' &&
                        (
                         direction === 'to-left' && !panel.hasClass('active')
                        ) ||
                        side === 'right' &&
                        (
                         direction === 'to-right' && !panel.hasClass('active')
                        )
                   )
                {
                    isTouched = false;
                    return;
                }
            }

            if (swipePanelNoFollow) {
                var timeDiff = (new Date()).getTime() - touchStartTime;
                if (timeDiff < 300) {
                    if (direction === 'to-left') {
                        if (side === 'right') $.openPanel(side);
                        if (side === 'left' && panel.hasClass('active')) $.closePanel();
                    }
                    if (direction === 'to-right') {
                        if (side === 'left') $.openPanel(side);
                        if (side === 'right' && panel.hasClass('active')) $.closePanel();
                    }
                }
                isTouched = false;
                console.log(3);
                isMoved = false;
                return;
            }

            if (!isMoved) {
                effect = panel.hasClass('panel-cover') ? 'cover' : 'reveal';
                if (!opened) {
                    panel.show();
                    panelOverlay.show();
                }
                panelWidth = panel[0].offsetWidth;
                panel.transition(0);
                /*
                   if (panel.find('.' + app.params.viewClass).length > 0) {
                   if (app.sizeNavbars) app.sizeNavbars(panel.find('.' + app.params.viewClass)[0]);
                   }
                   */
            }

            isMoved = true;

            e.preventDefault();
            var threshold = opened ? 0 : -swipePanelThreshold;
            if (side === 'right') threshold = -threshold;

            touchesDiff = pageX - touchesStart.x + threshold;

            if (side === 'right') {
                translate = touchesDiff  - (opened ? panelWidth : 0);
                if (translate > 0) translate = 0;
                if (translate < -panelWidth) {
                    translate = -panelWidth;
                }
            }
            else {
                translate = touchesDiff  + (opened ? panelWidth : 0);
                if (translate < 0) translate = 0;
                if (translate > panelWidth) {
                    translate = panelWidth;
                }
            }
            if (effect === 'reveal') {
                views.transform('translate3d(' + translate + 'px,0,0)').transition(0);
                panelOverlay.transform('translate3d(' + translate + 'px,0,0)');
                //app.pluginHook('swipePanelSetTransform', views[0], panel[0], Math.abs(translate / panelWidth));
            }
            else {
                panel.transform('translate3d(' + translate + 'px,0,0)').transition(0);
                //app.pluginHook('swipePanelSetTransform', views[0], panel[0], Math.abs(translate / panelWidth));
            }
        }
        function handleTouchEnd(e) {
            if (!isTouched || !isMoved) {
                isTouched = false;
                isMoved = false;
                return;
            }
            isTouched = false;
            isMoved = false;
            var timeDiff = (new Date()).getTime() - touchStartTime;
            var action;
            var edge = (translate === 0 || Math.abs(translate) === panelWidth);

            if (!opened) {
                if (translate === 0) {
                    action = 'reset';
                }
                else if (
                        timeDiff < 300 && Math.abs(translate) > 0 ||
                        timeDiff >= 300 && (Math.abs(translate) >= panelWidth / 2)
                        ) {
                            action = 'swap';
                        }
                else {
                    action = 'reset';
                }
            }
            else {
                if (translate === -panelWidth) {
                    action = 'reset';
                }
                else if (
                        timeDiff < 300 && Math.abs(translate) >= 0 ||
                        timeDiff >= 300 && (Math.abs(translate) <= panelWidth / 2)
                        ) {
                            if (side === 'left' && translate === panelWidth) action = 'reset';
                            else action = 'swap';
                        }
                else {
                    action = 'reset';
                }
            }
            if (action === 'swap') {
                $.allowPanelOpen = true;
                if (opened) {
                    $.closePanel();
                    if (edge) {
                        panel.css({display: ''});
                        $('body').removeClass('panel-closing');
                    }
                }
                else {
                    $.openPanel(side);
                }
                if (edge) $.allowPanelOpen = true;
            }
            if (action === 'reset') {
                if (opened) {
                    $.allowPanelOpen = true;
                    $.openPanel(side);
                }
                else {
                    $.closePanel();
                    if (edge) {
                        $.allowPanelOpen = true;
                        panel.css({display: ''});
                    }
                    else {
                        var target = effect === 'reveal' ? views : panel;
                        $('body').addClass('panel-closing');
                        target.transitionEnd(function () {
                            $.allowPanelOpen = true;
                            panel.css({display: ''});
                            $('body').removeClass('panel-closing');
                        });
                    }
                }
            }
            if (effect === 'reveal') {
                views.transition('');
                views.transform('');
            }
            panel.transition('').transform('');
            panelOverlay.css({display: ''}).transform('');
        }
        $(document).on($.touchEvents.start, handleTouchStart);
        $(document).on($.touchEvents.move, handleTouchMove);
        $(document).on($.touchEvents.end, handleTouchEnd);
    };

    $.initSwipePanels();
}(Zepto);

/*======================================================
************   Photo Browser   ************
======================================================*/
+function($){
    'use strict';
    var PhotoBrowser = function (params) {

        var pb = this, i;

        var defaults = this.defaults;

        params = params || {};
        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
        }

        pb.params = params;

        var navbarTemplate = pb.params.navbarTemplate ||
                            '<header class="bar bar-nav">' +
                              '<a class="icon icon-left pull-left photo-browser-close-link' + (pb.params.type === 'popup' ?  " close-popup" : "") + '"></a>' +
                              '<h1 class="title"><div class="center sliding"><span class="photo-browser-current"></span> <span class="photo-browser-of">' + pb.params.ofText + '</span> <span class="photo-browser-total"></span></div></h1>' +
                            '</header>';

        var toolbarTemplate = pb.params.toolbarTemplate ||
                            '<nav class="bar bar-tab">' +
                              '<a class="tab-item photo-browser-prev" href="#">' +
                                '<i class="icon icon-prev"></i>' +
                              '</a>' +
                              '<a class="tab-item photo-browser-next" href="#">' +
                                '<i class="icon icon-next"></i>' +
                              '</a>' +
                            '</nav>';

        var template = pb.params.template ||
                        '<div class="photo-browser photo-browser-' + pb.params.theme + '">' +
                            '{{navbar}}' +
                            '{{toolbar}}' +
                            '<div data-page="photo-browser-slides" class="content">' +
                                '{{captions}}' +
                                '<div class="photo-browser-swiper-container swiper-container">' +
                                    '<div class="photo-browser-swiper-wrapper swiper-wrapper">' +
                                        '{{photos}}' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>';

        var photoTemplate = !pb.params.lazyLoading ?
            (pb.params.photoTemplate || '<div class="photo-browser-slide swiper-slide"><span class="photo-browser-zoom-container"><img src="{{url}}"></span></div>') :
            (pb.params.photoLazyTemplate || '<div class="photo-browser-slide photo-browser-slide-lazy swiper-slide"><div class="preloader' + (pb.params.theme === 'dark' ? ' preloader-white' : '') + '"></div><span class="photo-browser-zoom-container"><img data-src="{{url}}" class="swiper-lazy"></span></div>');

        var captionsTheme = pb.params.captionsTheme || pb.params.theme;
        var captionsTemplate = pb.params.captionsTemplate || '<div class="photo-browser-captions photo-browser-captions-' + captionsTheme + '">{{captions}}</div>';
        var captionTemplate = pb.params.captionTemplate || '<div class="photo-browser-caption" data-caption-index="{{captionIndex}}">{{caption}}</div>';

        var objectTemplate = pb.params.objectTemplate || '<div class="photo-browser-slide photo-browser-object-slide swiper-slide">{{html}}</div>';
        var photosHtml = '';
        var captionsHtml = '';
        for (i = 0; i < pb.params.photos.length; i ++) {
            var photo = pb.params.photos[i];
            var thisTemplate = '';

            //check if photo is a string or string-like object, for backwards compatibility
            if (typeof(photo) === 'string' || photo instanceof String) {

                //check if "photo" is html object
                if (photo.indexOf('<') >= 0 || photo.indexOf('>') >= 0) {
                    thisTemplate = objectTemplate.replace(/{{html}}/g, photo);
                } else {
                    thisTemplate = photoTemplate.replace(/{{url}}/g, photo);
                }

                //photo is a string, thus has no caption, so remove the caption template placeholder
                //otherwise check if photo is an object with a url property
            } else if (typeof(photo) === 'object') {

                //check if "photo" is html object
                if (photo.hasOwnProperty('html') && photo.html.length > 0) {
                    thisTemplate = objectTemplate.replace(/{{html}}/g, photo.html);
                } else if (photo.hasOwnProperty('url') && photo.url.length > 0) {
                    thisTemplate = photoTemplate.replace(/{{url}}/g, photo.url);
                }

                //check if photo has a caption
                if (photo.hasOwnProperty('caption') && photo.caption.length > 0) {
                    captionsHtml += captionTemplate.replace(/{{caption}}/g, photo.caption).replace(/{{captionIndex}}/g, i);
                } else {
                    thisTemplate = thisTemplate.replace(/{{caption}}/g, '');
                }
            }

            photosHtml += thisTemplate;

        }

        var htmlTemplate = template
                            .replace('{{navbar}}', (pb.params.navbar ? navbarTemplate : ''))
                            .replace('{{noNavbar}}', (pb.params.navbar ? '' : 'no-navbar'))
                            .replace('{{photos}}', photosHtml)
                            .replace('{{captions}}', captionsTemplate.replace(/{{captions}}/g, captionsHtml))
                            .replace('{{toolbar}}', (pb.params.toolbar ? toolbarTemplate : ''));

        pb.activeIndex = pb.params.initialSlide;
        pb.openIndex = pb.activeIndex;
        pb.opened = false;

        pb.open = function (index) {
            if (typeof index === 'undefined') index = pb.activeIndex;
            index = parseInt(index, 10);
            if (pb.opened && pb.swiper) {
                pb.swiper.slideTo(index);
                return;
            }
            pb.opened = true;
            pb.openIndex = index;
            // pb.initialLazyLoaded = false;
            if (pb.params.type === 'standalone') {
                $(pb.params.container).append(htmlTemplate);
            }
            if (pb.params.type === 'popup') {
                pb.popup = $.popup('<div class="popup photo-browser-popup">' + htmlTemplate + '</div>');
                $(pb.popup).on('closed', pb.onPopupClose);
            }
            if (pb.params.type === 'page') {
                $(document).on('pageBeforeInit', pb.onPageBeforeInit);
                $(document).on('pageBeforeRemove', pb.onPageBeforeRemove);
                if (!pb.params.view) pb.params.view = $.mainView;
                pb.params.view.loadContent(htmlTemplate);
                return;
            }
            pb.layout(pb.openIndex);
            if (pb.params.onOpen) {
                pb.params.onOpen(pb);
            }

        };
        pb.close = function () {
            pb.opened = false;
            if (!pb.swiperContainer || pb.swiperContainer.length === 0) {
                return;
            }
            if (pb.params.onClose) {
                pb.params.onClose(pb);
            }
            // Detach events
            pb.attachEvents(true);
            // Delete from DOM
            if (pb.params.type === 'standalone') {
                pb.container.removeClass('photo-browser-in').addClass('photo-browser-out').animationEnd(function () {
                    pb.container.remove();
                });
            }
            // Destroy slider
            pb.swiper.destroy();
            // Delete references
            pb.swiper = pb.swiperContainer = pb.swiperWrapper = pb.slides = gestureSlide = gestureImg = gestureImgWrap = undefined;
        };

        pb.onPopupClose = function () {
            pb.close();
            $(pb.popup).off('pageBeforeInit', pb.onPopupClose);
        };
        pb.onPageBeforeInit = function (e) {
            if (e.detail.page.name === 'photo-browser-slides') {
                pb.layout(pb.openIndex);
            }
            $(document).off('pageBeforeInit', pb.onPageBeforeInit);
        };
        pb.onPageBeforeRemove = function (e) {
            if (e.detail.page.name === 'photo-browser-slides') {
                pb.close();
            }
            $(document).off('pageBeforeRemove', pb.onPageBeforeRemove);
        };

        pb.onSliderTransitionStart = function (swiper) {
            pb.activeIndex = swiper.activeIndex;

            var current = swiper.activeIndex + 1;
            var total = swiper.slides.length;
            if (pb.params.loop) {
                total = total - 2;
                current = current - swiper.loopedSlides;
                if (current < 1) current = total + current;
                if (current > total) current = current - total;
            }
            pb.container.find('.photo-browser-current').text(current);
            pb.container.find('.photo-browser-total').text(total);

            $('.photo-browser-prev, .photo-browser-next').removeClass('photo-browser-link-inactive');

            if (swiper.isBeginning && !pb.params.loop) {
                $('.photo-browser-prev').addClass('photo-browser-link-inactive');
            }
            if (swiper.isEnd && !pb.params.loop) {
                $('.photo-browser-next').addClass('photo-browser-link-inactive');
            }

            // Update captions
            if (pb.captions.length > 0) {
                pb.captionsContainer.find('.photo-browser-caption-active').removeClass('photo-browser-caption-active');
                var captionIndex = pb.params.loop ? swiper.slides.eq(swiper.activeIndex).attr('data-swiper-slide-index') : pb.activeIndex;
                pb.captionsContainer.find('[data-caption-index="' + captionIndex + '"]').addClass('photo-browser-caption-active');
            }


            // Stop Video
            var previousSlideVideo = swiper.slides.eq(swiper.previousIndex).find('video');
            if (previousSlideVideo.length > 0) {
                if ('pause' in previousSlideVideo[0]) previousSlideVideo[0].pause();
            }
            // Callback
            if (pb.params.onSlideChangeStart) pb.params.onSlideChangeStart(swiper);
        };
        pb.onSliderTransitionEnd = function (swiper) {
            // Reset zoom
            if (pb.params.zoom && gestureSlide && swiper.previousIndex !== swiper.activeIndex) {
                gestureImg.transform('translate3d(0,0,0) scale(1)');
                gestureImgWrap.transform('translate3d(0,0,0)');
                gestureSlide = gestureImg = gestureImgWrap = undefined;
                scale = currentScale = 1;
            }
            if (pb.params.onSlideChangeEnd) pb.params.onSlideChangeEnd(swiper);
        };

        pb.layout = function (index) {
            if (pb.params.type === 'page') {
                pb.container = $('.photo-browser-swiper-container').parents('.view');
            }
            else {
                pb.container = $('.photo-browser');
            }
            if (pb.params.type === 'standalone') {
                pb.container.addClass('photo-browser-in');
                // $.sizeNavbars(pb.container);
            }
            pb.swiperContainer = pb.container.find('.photo-browser-swiper-container');
            pb.swiperWrapper = pb.container.find('.photo-browser-swiper-wrapper');
            pb.slides = pb.container.find('.photo-browser-slide');
            pb.captionsContainer = pb.container.find('.photo-browser-captions');
            pb.captions = pb.container.find('.photo-browser-caption');

            var sliderSettings = {
                nextButton: pb.params.nextButton || '.photo-browser-next',
                prevButton: pb.params.prevButton || '.photo-browser-prev',
                indexButton: pb.params.indexButton,
                initialSlide: index,
                spaceBetween: pb.params.spaceBetween,
                speed: pb.params.speed,
                loop: pb.params.loop,
                lazyLoading: pb.params.lazyLoading,
                lazyLoadingInPrevNext: pb.params.lazyLoadingInPrevNext,
                lazyLoadingOnTransitionStart: pb.params.lazyLoadingOnTransitionStart,
                preloadImages: pb.params.lazyLoading ? false : true,
                onTap: function (swiper, e) {
                    if (pb.params.onTap) pb.params.onTap(swiper, e);
                },
                onClick: function (swiper, e) {
                    if (pb.params.exposition) pb.toggleExposition();
                    if (pb.params.onClick) pb.params.onClick(swiper, e);
                },
                onDoubleTap: function (swiper, e) {
                    pb.toggleZoom($(e.target).parents('.photo-browser-slide'));
                    if (pb.params.onDoubleTap) pb.params.onDoubleTap(swiper, e);
                },
                onTransitionStart: function (swiper) {
                    pb.onSliderTransitionStart(swiper);
                },
                onTransitionEnd: function (swiper) {
                    pb.onSliderTransitionEnd(swiper);
                },
                onLazyImageLoad: function (swiper, slide, img) {
                    if (pb.params.onLazyImageLoad) pb.params.onLazyImageLoad(pb, slide, img);
                },
                onLazyImageReady: function (swiper, slide, img) {
                    $(slide).removeClass('photo-browser-slide-lazy');
                    if (pb.params.onLazyImageReady) pb.params.onLazyImageReady(pb, slide, img);
                }
            };

            if (pb.params.swipeToClose && pb.params.type !== 'page') {
                sliderSettings.onTouchStart = pb.swipeCloseTouchStart;
                sliderSettings.onTouchMoveOpposite = pb.swipeCloseTouchMove;
                sliderSettings.onTouchEnd = pb.swipeCloseTouchEnd;
            }

            pb.swiper = $.swiper(pb.swiperContainer, sliderSettings);
            if (index === 0) {
                pb.onSliderTransitionStart(pb.swiper);
            }
            pb.attachEvents();
        };
        pb.attachEvents = function (detach) {
            var action = detach ? 'off' : 'on';
            // Slide between photos

            if (pb.params.zoom) {
                var target = pb.params.loop ? pb.swiper.slides : pb.slides;
                // Scale image
                target[action]('gesturestart', pb.onSlideGestureStart);
                target[action]('gesturechange', pb.onSlideGestureChange);
                target[action]('gestureend', pb.onSlideGestureEnd);
                // Move image
                target[action]('touchstart', pb.onSlideTouchStart);
                target[action]('touchmove', pb.onSlideTouchMove);
                target[action]('touchend', pb.onSlideTouchEnd);
            }
            pb.container.find('.photo-browser-close-link')[action]('click', pb.close);
        };

        // Expose
        pb.exposed = false;
        pb.toggleExposition = function () {
            if (pb.container) pb.container.toggleClass('photo-browser-exposed');
            if (pb.params.expositionHideCaptions) pb.captionsContainer.toggleClass('photo-browser-captions-exposed');
            pb.exposed = !pb.exposed;
        };
        pb.enableExposition = function () {
            if (pb.container) pb.container.addClass('photo-browser-exposed');
            if (pb.params.expositionHideCaptions) pb.captionsContainer.addClass('photo-browser-captions-exposed');
            pb.exposed = true;
        };
        pb.disableExposition = function () {
            if (pb.container) pb.container.removeClass('photo-browser-exposed');
            if (pb.params.expositionHideCaptions) pb.captionsContainer.removeClass('photo-browser-captions-exposed');
            pb.exposed = false;
        };

        // Gestures
        var gestureSlide, gestureImg, gestureImgWrap, scale = 1, currentScale = 1, isScaling = false;
        pb.onSlideGestureStart = function () {
            if (!gestureSlide) {
                gestureSlide = $(this);
                gestureImg = gestureSlide.find('img, svg, canvas');
                gestureImgWrap = gestureImg.parent('.photo-browser-zoom-container');
                if (gestureImgWrap.length === 0) {
                    gestureImg = undefined;
                    return;
                }
            }
            gestureImg.transition(0);
            isScaling = true;
        };
        pb.onSlideGestureChange = function (e) {
            if (!gestureImg || gestureImg.length === 0) return;
            scale = e.scale * currentScale;
            if (scale > pb.params.maxZoom) {
                scale = pb.params.maxZoom - 1 + Math.pow((scale - pb.params.maxZoom + 1), 0.5);
            }
            if (scale < pb.params.minZoom) {
                scale =  pb.params.minZoom + 1 - Math.pow((pb.params.minZoom - scale + 1), 0.5);
            }
            gestureImg.transform('translate3d(0,0,0) scale(' + scale + ')');
        };
        pb.onSlideGestureEnd = function () {
            if (!gestureImg || gestureImg.length === 0) return;
            scale = Math.max(Math.min(scale, pb.params.maxZoom), pb.params.minZoom);
            gestureImg.transition(pb.params.speed).transform('translate3d(0,0,0) scale(' + scale + ')');
            currentScale = scale;
            isScaling = false;
            if (scale === 1) gestureSlide = undefined;
        };
        pb.toggleZoom = function () {
            if (!gestureSlide) {
                gestureSlide = pb.swiper.slides.eq(pb.swiper.activeIndex);
                gestureImg = gestureSlide.find('img, svg, canvas');
                gestureImgWrap = gestureImg.parent('.photo-browser-zoom-container');
            }
            if (!gestureImg || gestureImg.length === 0) return;
            gestureImgWrap.transition(300).transform('translate3d(0,0,0)');
            if (scale && scale !== 1) {
                scale = currentScale = 1;
                gestureImg.transition(300).transform('translate3d(0,0,0) scale(1)');
                gestureSlide = undefined;
            }
            else {
                scale = currentScale = pb.params.maxZoom;
                gestureImg.transition(300).transform('translate3d(0,0,0) scale(' + scale + ')');
            }
        };

        var imageIsTouched, imageIsMoved, imageCurrentX, imageCurrentY, imageMinX, imageMinY, imageMaxX, imageMaxY, imageWidth, imageHeight, imageTouchesStart = {}, imageTouchesCurrent = {}, imageStartX, imageStartY, velocityPrevPositionX, velocityPrevTime, velocityX, velocityPrevPositionY, velocityY;

        pb.onSlideTouchStart = function (e) {
            if (!gestureImg || gestureImg.length === 0) return;
            if (imageIsTouched) return;
            if ($.device.os === 'android') e.preventDefault();
            imageIsTouched = true;
            imageTouchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            imageTouchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
        };
        pb.onSlideTouchMove = function (e) {
            if (!gestureImg || gestureImg.length === 0) return;
            pb.swiper.allowClick = false;
            if (!imageIsTouched || !gestureSlide) return;

            if (!imageIsMoved) {
                imageWidth = gestureImg[0].offsetWidth;
                imageHeight = gestureImg[0].offsetHeight;
                imageStartX = $.getTranslate(gestureImgWrap[0], 'x') || 0;
                imageStartY = $.getTranslate(gestureImgWrap[0], 'y') || 0;
                gestureImgWrap.transition(0);
            }
            // Define if we need image drag
            var scaledWidth = imageWidth * scale;
            var scaledHeight = imageHeight * scale;

            if (scaledWidth < pb.swiper.width && scaledHeight < pb.swiper.height) return;

            imageMinX = Math.min((pb.swiper.width / 2 - scaledWidth / 2), 0);
            imageMaxX = -imageMinX;
            imageMinY = Math.min((pb.swiper.height / 2 - scaledHeight / 2), 0);
            imageMaxY = -imageMinY;

            imageTouchesCurrent.x = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            imageTouchesCurrent.y = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

            if (!imageIsMoved && !isScaling) {
                if (
                    (Math.floor(imageMinX) === Math.floor(imageStartX) && imageTouchesCurrent.x < imageTouchesStart.x) ||
                    (Math.floor(imageMaxX) === Math.floor(imageStartX) && imageTouchesCurrent.x > imageTouchesStart.x)
                    ) {
                    imageIsTouched = false;
                    return;
                }
            }
            e.preventDefault();
            e.stopPropagation();
            imageIsMoved = true;
            imageCurrentX = imageTouchesCurrent.x - imageTouchesStart.x + imageStartX;
            imageCurrentY = imageTouchesCurrent.y - imageTouchesStart.y + imageStartY;

            if (imageCurrentX < imageMinX) {
                imageCurrentX =  imageMinX + 1 - Math.pow((imageMinX - imageCurrentX + 1), 0.8);
            }
            if (imageCurrentX > imageMaxX) {
                imageCurrentX = imageMaxX - 1 + Math.pow((imageCurrentX - imageMaxX + 1), 0.8);
            }

            if (imageCurrentY < imageMinY) {
                imageCurrentY =  imageMinY + 1 - Math.pow((imageMinY - imageCurrentY + 1), 0.8);
            }
            if (imageCurrentY > imageMaxY) {
                imageCurrentY = imageMaxY - 1 + Math.pow((imageCurrentY - imageMaxY + 1), 0.8);
            }

            //Velocity
            if (!velocityPrevPositionX) velocityPrevPositionX = imageTouchesCurrent.x;
            if (!velocityPrevPositionY) velocityPrevPositionY = imageTouchesCurrent.y;
            if (!velocityPrevTime) velocityPrevTime = Date.now();
            velocityX = (imageTouchesCurrent.x - velocityPrevPositionX) / (Date.now() - velocityPrevTime) / 2;
            velocityY = (imageTouchesCurrent.y - velocityPrevPositionY) / (Date.now() - velocityPrevTime) / 2;
            if (Math.abs(imageTouchesCurrent.x - velocityPrevPositionX) < 2) velocityX = 0;
            if (Math.abs(imageTouchesCurrent.y - velocityPrevPositionY) < 2) velocityY = 0;
            velocityPrevPositionX = imageTouchesCurrent.x;
            velocityPrevPositionY = imageTouchesCurrent.y;
            velocityPrevTime = Date.now();

            gestureImgWrap.transform('translate3d(' + imageCurrentX + 'px, ' + imageCurrentY + 'px,0)');
        };
        pb.onSlideTouchEnd = function () {
            if (!gestureImg || gestureImg.length === 0) return;
            if (!imageIsTouched || !imageIsMoved) {
                imageIsTouched = false;
                imageIsMoved = false;
                return;
            }
            imageIsTouched = false;
            imageIsMoved = false;
            var momentumDurationX = 300;
            var momentumDurationY = 300;
            var momentumDistanceX = velocityX * momentumDurationX;
            var newPositionX = imageCurrentX + momentumDistanceX;
            var momentumDistanceY = velocityY * momentumDurationY;
            var newPositionY = imageCurrentY + momentumDistanceY;

            //Fix duration
            if (velocityX !== 0) momentumDurationX = Math.abs((newPositionX - imageCurrentX) / velocityX);
            if (velocityY !== 0) momentumDurationY = Math.abs((newPositionY - imageCurrentY) / velocityY);
            var momentumDuration = Math.max(momentumDurationX, momentumDurationY);

            imageCurrentX = newPositionX;
            imageCurrentY = newPositionY;

            // Define if we need image drag
            var scaledWidth = imageWidth * scale;
            var scaledHeight = imageHeight * scale;
            imageMinX = Math.min((pb.swiper.width / 2 - scaledWidth / 2), 0);
            imageMaxX = -imageMinX;
            imageMinY = Math.min((pb.swiper.height / 2 - scaledHeight / 2), 0);
            imageMaxY = -imageMinY;
            imageCurrentX = Math.max(Math.min(imageCurrentX, imageMaxX), imageMinX);
            imageCurrentY = Math.max(Math.min(imageCurrentY, imageMaxY), imageMinY);

            gestureImgWrap.transition(momentumDuration).transform('translate3d(' + imageCurrentX + 'px, ' + imageCurrentY + 'px,0)');
        };

        // Swipe Up To Close
        var swipeToCloseIsTouched = false;
        var allowSwipeToClose = true;
        var swipeToCloseDiff, swipeToCloseStart, swipeToCloseCurrent, swipeToCloseStarted = false, swipeToCloseActiveSlide, swipeToCloseTimeStart;
        pb.swipeCloseTouchStart = function () {
            if (!allowSwipeToClose) return;
            swipeToCloseIsTouched = true;
        };
        pb.swipeCloseTouchMove = function (swiper, e) {
            if (!swipeToCloseIsTouched) return;
            if (!swipeToCloseStarted) {
                swipeToCloseStarted = true;
                swipeToCloseStart = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
                swipeToCloseActiveSlide = pb.swiper.slides.eq(pb.swiper.activeIndex);
                swipeToCloseTimeStart = (new Date()).getTime();
            }
            e.preventDefault();
            swipeToCloseCurrent = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            swipeToCloseDiff = swipeToCloseStart - swipeToCloseCurrent;
            var opacity = 1 - Math.abs(swipeToCloseDiff) / 300;
            swipeToCloseActiveSlide.transform('translate3d(0,' + (-swipeToCloseDiff) + 'px,0)');
            pb.swiper.container.css('opacity', opacity).transition(0);
        };
        pb.swipeCloseTouchEnd = function () {
            swipeToCloseIsTouched = false;
            if (!swipeToCloseStarted) {
                swipeToCloseStarted = false;
                return;
            }
            swipeToCloseStarted = false;
            allowSwipeToClose = false;
            var diff = Math.abs(swipeToCloseDiff);
            var timeDiff = (new Date()).getTime() - swipeToCloseTimeStart;
            if ((timeDiff < 300 && diff > 20) || (timeDiff >= 300 && diff > 100)) {
                setTimeout(function () {
                    if (pb.params.type === 'standalone') {
                        pb.close();
                    }
                    if (pb.params.type === 'popup') {
                        $.closeModal(pb.popup);
                    }
                    if (pb.params.onSwipeToClose) {
                        pb.params.onSwipeToClose(pb);
                    }
                    allowSwipeToClose = true;
                }, 0);
                return;
            }
            if (diff !== 0) {
                swipeToCloseActiveSlide.addClass('transitioning').transitionEnd(function () {
                    allowSwipeToClose = true;
                    swipeToCloseActiveSlide.removeClass('transitioning');
                });
            }
            else {
                allowSwipeToClose = true;
            }
            pb.swiper.container.css('opacity', '').transition('');
            swipeToCloseActiveSlide.transform('');
        };

        return pb;
    };

    PhotoBrowser.prototype = {
        defaults: {
            photos : [],
            container: 'body',
            initialSlide: 0,
            spaceBetween: 20,
            speed: 300,
            zoom: true,
            maxZoom: 3,
            minZoom: 1,
            exposition: true,
            expositionHideCaptions: false,
            type: 'standalone',
            navbar: true,
            toolbar: true,
            theme: 'light',
            swipeToClose: true,
            backLinkText: 'Close',
            ofText: 'of',
            loop: false,
            lazyLoading: false,
            lazyLoadingInPrevNext: false,
            lazyLoadingOnTransitionStart: false,
            /*
            Callbacks:
            onLazyImageLoad(pb, slide, img)
            onLazyImageReady(pb, slide, img)
            onOpen(pb)
            onClose(pb)
            onSlideChangeStart(swiper)
            onSlideChangeEnd(swiper)
            onTap(swiper, e)
            onClick(swiper, e)
            onDoubleTap(swiper, e)
            onSwipeToClose(pb)
            */
        }
    };

    $.photoBrowser = function (params) {
        $.extend(params, $.photoBrowser.prototype.defaults);
        return new PhotoBrowser(params);
    };

    $.photoBrowser.prototype = {
        defaults: {}
    };

}(Zepto);

/*======================================================
************   Picker   ************
======================================================*/
/* jshint unused:false */
/* jshint multistr:true */
+ function($) {
    "use strict";
    var Picker = function (params) {
        var p = this;
        var defaults = {
            updateValuesOnMomentum: false,
            updateValuesOnTouchmove: true,
            rotateEffect: false,
            momentumRatio: 7,
            freeMode: false,
            // Common settings
            scrollToInput: true,
            inputReadOnly: true,
            toolbar: true,
            toolbarCloseText: '确定',
            toolbarTemplate: '<header class="bar bar-nav">\
                <button class="button button-link pull-right close-picker">确定</button>\
                <h1 class="title">请选择</h1>\
                </header>',
        };
        params = params || {};
        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
        }
        p.params = params;
        p.cols = [];
        p.initialized = false;

        // Inline flag
        p.inline = p.params.container ? true : false;

        // 3D Transforms origin bug, only on safari
        var originBug = $.device.ios || (navigator.userAgent.toLowerCase().indexOf('safari') >= 0 && navigator.userAgent.toLowerCase().indexOf('chrome') < 0) && !$.device.android;

        // Value
        p.setValue = function (arrValues, transition) {
            var valueIndex = 0;
            for (var i = 0; i < p.cols.length; i++) {
                if (p.cols[i] && !p.cols[i].divider) {
                    p.cols[i].setValue(arrValues[valueIndex], transition);
                    valueIndex++;
                }
            }
        };
        p.updateValue = function () {
            var newValue = [];
            var newDisplayValue = [];
            for (var i = 0; i < p.cols.length; i++) {
                if (!p.cols[i].divider) {
                    newValue.push(p.cols[i].value);
                    newDisplayValue.push(p.cols[i].displayValue);
                }
            }
            if (newValue.indexOf(undefined) >= 0) {
                return;
            }
            p.value = newValue;
            p.displayValue = newDisplayValue;
            if (p.params.onChange) {
                p.params.onChange(p, p.value, p.displayValue);
            }
            if (p.input && p.input.length > 0) {
                $(p.input).val(p.params.formatValue ? p.params.formatValue(p, p.value, p.displayValue) : p.value.join(' '));
                $(p.input).trigger('change');
            }
        };

        // Columns Handlers
        p.initPickerCol = function (colElement, updateItems) {
            var colContainer = $(colElement);
            var colIndex = colContainer.index();
            var col = p.cols[colIndex];
            if (col.divider) return;
            col.container = colContainer;
            col.wrapper = col.container.find('.picker-items-col-wrapper');
            col.items = col.wrapper.find('.picker-item');

            var i, j;
            var wrapperHeight, itemHeight, itemsHeight, minTranslate, maxTranslate;
            col.replaceValues = function (values, displayValues) {
                col.destroyEvents();
                col.values = values;
                col.displayValues = displayValues;
                var newItemsHTML = p.columnHTML(col, true);
                col.wrapper.html(newItemsHTML);
                col.items = col.wrapper.find('.picker-item');
                col.calcSize();
                col.setValue(col.values[0], 0, true);
                col.initEvents();
            };
            col.calcSize = function () {
                if (p.params.rotateEffect) {
                    col.container.removeClass('picker-items-col-absolute');
                    if (!col.width) col.container.css({width:''});
                }
                var colWidth, colHeight;
                colWidth = 0;
                colHeight = col.container[0].offsetHeight;
                wrapperHeight = col.wrapper[0].offsetHeight;
                itemHeight = col.items[0].offsetHeight;
                itemsHeight = itemHeight * col.items.length;
                minTranslate = colHeight / 2 - itemsHeight + itemHeight / 2;
                maxTranslate = colHeight / 2 - itemHeight / 2;
                if (col.width) {
                    colWidth = col.width;
                    if (parseInt(colWidth, 10) === colWidth) colWidth = colWidth + 'px';
                    col.container.css({width: colWidth});
                }
                if (p.params.rotateEffect) {
                    if (!col.width) {
                        col.items.each(function () {
                            var item = $(this);
                            item.css({width:'auto'});
                            colWidth = Math.max(colWidth, item[0].offsetWidth);
                            item.css({width:''});
                        });
                        col.container.css({width: (colWidth + 2) + 'px'});
                    }
                    col.container.addClass('picker-items-col-absolute');
                }
            };
            col.calcSize();

            col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)').transition(0);


            var activeIndex = 0;
            var animationFrameId;

            // Set Value Function
            col.setValue = function (newValue, transition, valueCallbacks) {
                if (typeof transition === 'undefined') transition = '';
                var newActiveIndex = col.wrapper.find('.picker-item[data-picker-value="' + newValue + '"]').index();
                if(typeof newActiveIndex === 'undefined' || newActiveIndex === -1) {
                    return;
                }
                var newTranslate = -newActiveIndex * itemHeight + maxTranslate;
                // Update wrapper
                col.wrapper.transition(transition);
                col.wrapper.transform('translate3d(0,' + (newTranslate) + 'px,0)');

                // Watch items
                if (p.params.updateValuesOnMomentum && col.activeIndex && col.activeIndex !== newActiveIndex ) {
                    $.cancelAnimationFrame(animationFrameId);
                    col.wrapper.transitionEnd(function(){
                        $.cancelAnimationFrame(animationFrameId);
                    });
                    updateDuringScroll();
                }

                // Update items
                col.updateItems(newActiveIndex, newTranslate, transition, valueCallbacks);
            };

            col.updateItems = function (activeIndex, translate, transition, valueCallbacks) {
                if (typeof translate === 'undefined') {
                    translate = $.getTranslate(col.wrapper[0], 'y');
                }
                if(typeof activeIndex === 'undefined') activeIndex = -Math.round((translate - maxTranslate)/itemHeight);
                if (activeIndex < 0) activeIndex = 0;
                if (activeIndex >= col.items.length) activeIndex = col.items.length - 1;
                var previousActiveIndex = col.activeIndex;
                col.activeIndex = activeIndex;
                /*
                   col.wrapper.find('.picker-selected, .picker-after-selected, .picker-before-selected').removeClass('picker-selected picker-after-selected picker-before-selected');

                   col.items.transition(transition);
                   var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');
                   var prevItems = selectedItem.prevAll().addClass('picker-before-selected');
                   var nextItems = selectedItem.nextAll().addClass('picker-after-selected');
                   */
                //去掉 .picker-after-selected, .picker-before-selected 以提高性能
                col.wrapper.find('.picker-selected').removeClass('picker-selected');
                if (p.params.rotateEffect) {
                    col.items.transition(transition);
                }
                var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');

                if (valueCallbacks || typeof valueCallbacks === 'undefined') {
                    // Update values
                    col.value = selectedItem.attr('data-picker-value');
                    col.displayValue = col.displayValues ? col.displayValues[activeIndex] : col.value;
                    // On change callback
                    if (previousActiveIndex !== activeIndex) {
                        if (col.onChange) {
                            col.onChange(p, col.value, col.displayValue);
                        }
                        p.updateValue();
                    }
                }

                // Set 3D rotate effect
                if (!p.params.rotateEffect) {
                    return;
                }
                var percentage = (translate - (Math.floor((translate - maxTranslate)/itemHeight) * itemHeight + maxTranslate)) / itemHeight;

                col.items.each(function () {
                    var item = $(this);
                    var itemOffsetTop = item.index() * itemHeight;
                    var translateOffset = maxTranslate - translate;
                    var itemOffset = itemOffsetTop - translateOffset;
                    var percentage = itemOffset / itemHeight;

                    var itemsFit = Math.ceil(col.height / itemHeight / 2) + 1;

                    var angle = (-18*percentage);
                    if (angle > 180) angle = 180;
                    if (angle < -180) angle = -180;
                    // Far class
                    if (Math.abs(percentage) > itemsFit) item.addClass('picker-item-far');
                    else item.removeClass('picker-item-far');
                    // Set transform
                    item.transform('translate3d(0, ' + (-translate + maxTranslate) + 'px, ' + (originBug ? -110 : 0) + 'px) rotateX(' + angle + 'deg)');
                });
            };

            function updateDuringScroll() {
                animationFrameId = $.requestAnimationFrame(function () {
                    col.updateItems(undefined, undefined, 0);
                    updateDuringScroll();
                });
            }

            // Update items on init
            if (updateItems) col.updateItems(0, maxTranslate, 0);

            var allowItemClick = true;
            var isTouched, isMoved, touchStartY, touchCurrentY, touchStartTime, touchEndTime, startTranslate, returnTo, currentTranslate, prevTranslate, velocityTranslate, velocityTime;
            function handleTouchStart (e) {
                if (isMoved || isTouched) return;
                e.preventDefault();
                isTouched = true;
                touchStartY = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
                touchStartTime = (new Date()).getTime();

                allowItemClick = true;
                startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
            }
            function handleTouchMove (e) {
                if (!isTouched) return;
                e.preventDefault();
                allowItemClick = false;
                touchCurrentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
                if (!isMoved) {
                    // First move
                    $.cancelAnimationFrame(animationFrameId);
                    isMoved = true;
                    startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
                    col.wrapper.transition(0);
                }
                e.preventDefault();

                var diff = touchCurrentY - touchStartY;
                currentTranslate = startTranslate + diff;
                returnTo = undefined;

                // Normalize translate
                if (currentTranslate < minTranslate) {
                    currentTranslate = minTranslate - Math.pow(minTranslate - currentTranslate, 0.8);
                    returnTo = 'min';
                }
                if (currentTranslate > maxTranslate) {
                    currentTranslate = maxTranslate + Math.pow(currentTranslate - maxTranslate, 0.8);
                    returnTo = 'max';
                }
                // Transform wrapper
                col.wrapper.transform('translate3d(0,' + currentTranslate + 'px,0)');

                // Update items
                col.updateItems(undefined, currentTranslate, 0, p.params.updateValuesOnTouchmove);

                // Calc velocity
                velocityTranslate = currentTranslate - prevTranslate || currentTranslate;
                velocityTime = (new Date()).getTime();
                prevTranslate = currentTranslate;
            }
            function handleTouchEnd (e) {
                if (!isTouched || !isMoved) {
                    isTouched = isMoved = false;
                    return;
                }
                isTouched = isMoved = false;
                col.wrapper.transition('');
                if (returnTo) {
                    if (returnTo === 'min') {
                        col.wrapper.transform('translate3d(0,' + minTranslate + 'px,0)');
                    }
                    else col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)');
                }
                touchEndTime = new Date().getTime();
                var velocity, newTranslate;
                if (touchEndTime - touchStartTime > 300) {
                    newTranslate = currentTranslate;
                }
                else {
                    velocity = Math.abs(velocityTranslate / (touchEndTime - velocityTime));
                    newTranslate = currentTranslate + velocityTranslate * p.params.momentumRatio;
                }

                newTranslate = Math.max(Math.min(newTranslate, maxTranslate), minTranslate);

                // Active Index
                var activeIndex = -Math.floor((newTranslate - maxTranslate)/itemHeight);

                // Normalize translate
                if (!p.params.freeMode) newTranslate = -activeIndex * itemHeight + maxTranslate;

                // Transform wrapper
                col.wrapper.transform('translate3d(0,' + (parseInt(newTranslate,10)) + 'px,0)');

                // Update items
                col.updateItems(activeIndex, newTranslate, '', true);

                // Watch items
                if (p.params.updateValuesOnMomentum) {
                    updateDuringScroll();
                    col.wrapper.transitionEnd(function(){
                        $.cancelAnimationFrame(animationFrameId);
                    });
                }

                // Allow click
                setTimeout(function () {
                    allowItemClick = true;
                }, 100);
            }

            function handleClick(e) {
                if (!allowItemClick) return;
                $.cancelAnimationFrame(animationFrameId);
                /*jshint validthis:true */
                var value = $(this).attr('data-picker-value');
                col.setValue(value);
            }

            col.initEvents = function (detach) {
                var method = detach ? 'off' : 'on';
                col.container[method]($.touchEvents.start, handleTouchStart);
                col.container[method]($.touchEvents.move, handleTouchMove);
                col.container[method]($.touchEvents.end, handleTouchEnd);
                col.items[method]('click', handleClick);
            };
            col.destroyEvents = function () {
                col.initEvents(true);
            };

            col.container[0].f7DestroyPickerCol = function () {
                col.destroyEvents();
            };

            col.initEvents();

        };
        p.destroyPickerCol = function (colContainer) {
            colContainer = $(colContainer);
            if ('f7DestroyPickerCol' in colContainer[0]) colContainer[0].f7DestroyPickerCol();
        };
        // Resize cols
        function resizeCols() {
            if (!p.opened) return;
            for (var i = 0; i < p.cols.length; i++) {
                if (!p.cols[i].divider) {
                    p.cols[i].calcSize();
                    p.cols[i].setValue(p.cols[i].value, 0, false);
                }
            }
        }
        $(window).on('resize', resizeCols);

        // HTML Layout
        p.columnHTML = function (col, onlyItems) {
            var columnItemsHTML = '';
            var columnHTML = '';
            if (col.divider) {
                columnHTML += '<div class="picker-items-col picker-items-col-divider ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '">' + col.content + '</div>';
            }
            else {
                for (var j = 0; j < col.values.length; j++) {
                    columnItemsHTML += '<div class="picker-item" data-picker-value="' + col.values[j] + '">' + (col.displayValues ? col.displayValues[j] : col.values[j]) + '</div>';
                }

                columnHTML += '<div class="picker-items-col ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '"><div class="picker-items-col-wrapper">' + columnItemsHTML + '</div></div>';
            }
            return onlyItems ? columnItemsHTML : columnHTML;
        };
        p.layout = function () {
            var pickerHTML = '';
            var pickerClass = '';
            var i;
            p.cols = [];
            var colsHTML = '';
            for (i = 0; i < p.params.cols.length; i++) {
                var col = p.params.cols[i];
                colsHTML += p.columnHTML(p.params.cols[i]);
                p.cols.push(col);
            }
            pickerClass = 'picker-modal picker-columns ' + (p.params.cssClass || '') + (p.params.rotateEffect ? ' picker-3d' : '');
            pickerHTML =
                '<div class="' + (pickerClass) + '">' +
                (p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '') +
                '<div class="picker-modal-inner picker-items">' +
                colsHTML +
                '<div class="picker-center-highlight"></div>' +
                '</div>' +
                '</div>';

            p.pickerHTML = pickerHTML;
        };

        // Input Events
        function openOnInput(e) {
            e.preventDefault();
            // 安卓微信webviewreadonly的input依然弹出软键盘问题修复
            if ($.device.isWeixin && $.device.android && p.params.inputReadOnly) {
                /*jshint validthis:true */
                this.focus();
                this.blur();
            }
            if (p.opened) return;
            //关闭其他picker
            $.closeModal($('.picker-modal'));
            p.open();
            if (p.params.scrollToInput) {
                var pageContent = p.input.parents('.content');
                if (pageContent.length === 0) return;

                var paddingTop = parseInt(pageContent.css('padding-top'), 10),
                    paddingBottom = parseInt(pageContent.css('padding-bottom'), 10),
                    pageHeight = pageContent[0].offsetHeight - paddingTop - p.container.height(),
                    pageScrollHeight = pageContent[0].scrollHeight - paddingTop - p.container.height(),
                    newPaddingBottom;
                var inputTop = p.input.offset().top - paddingTop + p.input[0].offsetHeight;
                if (inputTop > pageHeight) {
                    var scrollTop = pageContent.scrollTop() + inputTop - pageHeight;
                    if (scrollTop + pageHeight > pageScrollHeight) {
                        newPaddingBottom = scrollTop + pageHeight - pageScrollHeight + paddingBottom;
                        if (pageHeight === pageScrollHeight) {
                            newPaddingBottom = p.container.height();
                        }
                        pageContent.css({'padding-bottom': (newPaddingBottom) + 'px'});
                    }
                    pageContent.scrollTop(scrollTop, 300);
                }
            }
            //停止事件冒泡，主动处理
            e.stopPropagation();
        }
        function closeOnHTMLClick(e) {
            if (!p.opened) return;
            if (p.input && p.input.length > 0) {
                if (e.target !== p.input[0] && $(e.target).parents('.picker-modal').length === 0) p.close();
            }
            else {
                if ($(e.target).parents('.picker-modal').length === 0) p.close();
            }
        }

        if (p.params.input) {
            p.input = $(p.params.input);
            if (p.input.length > 0) {
                if (p.params.inputReadOnly) p.input.prop('readOnly', true);
                if (!p.inline) {
                    p.input.on('click', openOnInput);
                }
            }
        }

        if (!p.inline) $('html').on('click', closeOnHTMLClick);

        // Open
        function onPickerClose() {
            p.opened = false;
            if (p.input && p.input.length > 0) p.input.parents('.content').css({'padding-bottom': ''});
            if (p.params.onClose) p.params.onClose(p);

            // Destroy events
            p.container.find('.picker-items-col').each(function () {
                p.destroyPickerCol(this);
            });
        }

        p.opened = false;
        p.open = function () {
        
            if (!p.opened) {

                // Layout
                p.layout();
                p.opened = true;
                // Append
                if (p.inline) {
                    p.container = $(p.pickerHTML);
                    p.container.addClass('picker-modal-inline');
                    $(p.params.container).append(p.container);
                    
                }
                else {

                    p.container = $($.pickerModal(p.pickerHTML));
                    
                    $(p.container)
                        .on('close', function () {
                            onPickerClose();
                        });
                }

                // Store picker instance
                p.container[0].f7Picker = p;

                // Init Events
                p.container.find('.picker-items-col').each(function () {
                    var updateItems = true;
                    if ((!p.initialized && p.params.value) || (p.initialized && p.value)) updateItems = false;
                    p.initPickerCol(this, updateItems);
                });

                // Set value
                if (!p.initialized) {
                    if (p.params.value) {
                        p.setValue(p.params.value, 0);
                    }
                }
                else {
                    if (p.value) p.setValue(p.value, 0);
                }
            }

            // Set flag
            p.initialized = true;

            if (p.params.onOpen) p.params.onOpen(p);
        };

        // Close
        p.close = function () {
            if (!p.opened || p.inline) return;
            $.closeModal(p.container);
            return;
        };

        // Destroy
        p.destroy = function () {
            p.close();
            if (p.params.input && p.input.length > 0) {
                p.input.off('click', openOnInput);
            }
            $('html').off('click', closeOnHTMLClick);
            $(window).off('resize', resizeCols);
        };

        if (p.inline) {
            p.open();
        }

        return p;
    };

    $(document).on("click", ".close-picker", function() {
        var pickerToClose = $('.picker-modal.modal-in');
        $.closeModal(pickerToClose);
    });

    $.fn.picker = function(params) {
        var args = arguments;
        return this.each(function() {
            if(!this) return;
            var $this = $(this);

            var picker = $this.data("picker");
            if(!picker) {
                var p = $.extend({
                    input: this,
                    value: $this.val() ? $this.val().split(' ') : ''
                }, params);
                picker = new Picker(p);
                $this.data("picker", picker);
            }
            if(typeof params === typeof "a") {
                picker[params].apply(picker, Array.prototype.slice.call(args, 1));
            }
        });
    };
}(Zepto);

+ function($) {
    "use strict";
    //这里实在js滚动时使用的下拉刷新代码。

    var refreshTime = 0;
    var initPullToRefreshJS = function(pageContainer) {
        var eventsTarget = $(pageContainer);
        if (!eventsTarget.hasClass('pull-to-refresh-content')) {
            eventsTarget = eventsTarget.find('.pull-to-refresh-content');
        }
        if (!eventsTarget || eventsTarget.length === 0) return;

        var page = eventsTarget.hasClass('content') ? eventsTarget : eventsTarget.parents('.content');
        var scroller = $.getScroller(page[0]);
        if(!scroller) return;


        var container = eventsTarget;

        function handleScroll() {
            if (container.hasClass('refreshing')) return;
            if (scroller.scrollTop() * -1 >= 44) {
                container.removeClass('pull-down').addClass('pull-up');
            } else {
                container.removeClass('pull-up').addClass('pull-down');
            }
        }

        function handleRefresh() {
            if (container.hasClass('refreshing')) return;
            container.removeClass('pull-down pull-up');
            container.addClass('refreshing transitioning');
            container.trigger('refresh');
            refreshTime = +new Date();
        }
        scroller.on('scroll', handleScroll);
        scroller.scroller.on('ptr', handleRefresh);

        // Detach Events on page remove
        function destroyPullToRefresh() {
            scroller.off('scroll', handleScroll);
            scroller.scroller.off('ptr', handleRefresh);
        }
        eventsTarget[0].destroyPullToRefresh = destroyPullToRefresh;

    };

    var pullToRefreshDoneJS = function(container) {
        container = $(container);
        if (container.length === 0) container = $('.pull-to-refresh-content.refreshing');
        if (container.length === 0) return;
        var interval = (+new Date()) - refreshTime;
        var timeOut = interval > 1000 ? 0 : 1000 - interval; //long than bounce time
        var scroller = $.getScroller(container);
        setTimeout(function() {
            scroller.refresh();
            container.removeClass('refreshing');
            container.transitionEnd(function() {
                container.removeClass("transitioning");
            });
        }, timeOut);
    };
    var pullToRefreshTriggerJS = function(container) {
        container = $(container);
        if (container.length === 0) container = $('.pull-to-refresh-content');
        if (container.hasClass('refreshing')) return;
        container.addClass('refreshing');
        var scroller = $.getScroller(container);
        scroller.scrollTop(44 + 1, 200);
        container.trigger('refresh');
    };

    var destroyPullToRefreshJS = function(pageContainer) {
        pageContainer = $(pageContainer);
        var pullToRefreshContent = pageContainer.hasClass('pull-to-refresh-content') ? pageContainer : pageContainer.find('.pull-to-refresh-content');
        if (pullToRefreshContent.length === 0) return;
        if (pullToRefreshContent[0].destroyPullToRefresh) pullToRefreshContent[0].destroyPullToRefresh();
    };

    $._pullToRefreshJSScroll = {
        "initPullToRefresh": initPullToRefreshJS,
        "pullToRefreshDone": pullToRefreshDoneJS,
        "pullToRefreshTrigger": pullToRefreshTriggerJS,
        "destroyPullToRefresh": destroyPullToRefreshJS,
    };
}(Zepto); // jshint ignore:line

+ function($) {
    'use strict';
    $.initPullToRefresh = function(pageContainer) {
        var eventsTarget = $(pageContainer);
        if (!eventsTarget.hasClass('pull-to-refresh-content')) {
            eventsTarget = eventsTarget.find('.pull-to-refresh-content');
        }
        if (!eventsTarget || eventsTarget.length === 0) return;

        var isTouched, isMoved, touchesStart = {},
            isScrolling, touchesDiff, touchStartTime, container, refresh = false,
            useTranslate = false,
            startTranslate = 0,
            translate, scrollTop, wasScrolled, triggerDistance, dynamicTriggerDistance;

        container = eventsTarget;

        // Define trigger distance
        if (container.attr('data-ptr-distance')) {
            dynamicTriggerDistance = true;
        } else {
            triggerDistance = 44;
        }

        function handleTouchStart(e) {
            if (isTouched) {
                if ($.device.android) {
                    if ('targetTouches' in e && e.targetTouches.length > 1) return;
                } else return;
            }
            isMoved = false;
            isTouched = true;
            isScrolling = undefined;
            wasScrolled = undefined;
            touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            touchStartTime = (new Date()).getTime();
            /*jshint validthis:true */
            container = $(this);
        }

        function handleTouchMove(e) {
            if (!isTouched) return;
            var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            if (typeof isScrolling === 'undefined') {
                isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(pageX - touchesStart.x));
            }
            if (!isScrolling) {
                isTouched = false;
                return;
            }

            scrollTop = container[0].scrollTop;
            if (typeof wasScrolled === 'undefined' && scrollTop !== 0) wasScrolled = true;

            if (!isMoved) {
                /*jshint validthis:true */
                container.removeClass('transitioning');
                if (scrollTop > container[0].offsetHeight) {
                    isTouched = false;
                    return;
                }
                if (dynamicTriggerDistance) {
                    triggerDistance = container.attr('data-ptr-distance');
                    if (triggerDistance.indexOf('%') >= 0) triggerDistance = container[0].offsetHeight * parseInt(triggerDistance, 10) / 100;
                }
                startTranslate = container.hasClass('refreshing') ? triggerDistance : 0;
                if (container[0].scrollHeight === container[0].offsetHeight || !$.device.ios) {
                    useTranslate = true;
                } else {
                    useTranslate = false;
                }
                useTranslate = true;
            }
            isMoved = true;
            touchesDiff = pageY - touchesStart.y;

            if (touchesDiff > 0 && scrollTop <= 0 || scrollTop < 0) {
                // iOS 8 fix
                if ($.device.ios && parseInt($.device.osVersion.split('.')[0], 10) > 7 && scrollTop === 0 && !wasScrolled) useTranslate = true;

                if (useTranslate) {
                    e.preventDefault();
                    translate = (Math.pow(touchesDiff, 0.85) + startTranslate);
                    container.transform('translate3d(0,' + translate + 'px,0)');
                } else {}
                if ((useTranslate && Math.pow(touchesDiff, 0.85) > triggerDistance) || (!useTranslate && touchesDiff >= triggerDistance * 2)) {
                    refresh = true;
                    container.addClass('pull-up').removeClass('pull-down');
                } else {
                    refresh = false;
                    container.removeClass('pull-up').addClass('pull-down');
                }
            } else {

                container.removeClass('pull-up pull-down');
                refresh = false;
                return;
            }
        }

        function handleTouchEnd() {
            if (!isTouched || !isMoved) {
                isTouched = false;
                isMoved = false;
                return;
            }
            if (translate) {
                container.addClass('transitioning');
                translate = 0;
            }
            container.transform('');
            if (refresh) {
                //防止二次触发
                if(container.hasClass('refreshing')) return;
                container.addClass('refreshing');
                container.trigger('refresh');
            } else {
                container.removeClass('pull-down');
            }
            isTouched = false;
            isMoved = false;
        }

        // Attach Events
        eventsTarget.on($.touchEvents.start, handleTouchStart);
        eventsTarget.on($.touchEvents.move, handleTouchMove);
        eventsTarget.on($.touchEvents.end, handleTouchEnd);


        function destroyPullToRefresh() {
            eventsTarget.off($.touchEvents.start, handleTouchStart);
            eventsTarget.off($.touchEvents.move, handleTouchMove);
            eventsTarget.off($.touchEvents.end, handleTouchEnd);
        }
        eventsTarget[0].destroyPullToRefresh = destroyPullToRefresh;

    };
    $.pullToRefreshDone = function(container) {
        $(window).scrollTop(0);//解决微信下拉刷新顶部消失的问题
        container = $(container);
        if (container.length === 0) container = $('.pull-to-refresh-content.refreshing');
        container.removeClass('refreshing').addClass('transitioning');
        container.transitionEnd(function() {
            container.removeClass('transitioning pull-up pull-down');
        });
    };
    $.pullToRefreshTrigger = function(container) {
        container = $(container);
        if (container.length === 0) container = $('.pull-to-refresh-content');
        if (container.hasClass('refreshing')) return;
        container.addClass('transitioning refreshing');
        container.trigger('refresh');
    };

    $.destroyPullToRefresh = function(pageContainer) {
        pageContainer = $(pageContainer);
        var pullToRefreshContent = pageContainer.hasClass('pull-to-refresh-content') ? pageContainer : pageContainer.find('.pull-to-refresh-content');
        if (pullToRefreshContent.length === 0) return;
        if (pullToRefreshContent[0].destroyPullToRefresh) pullToRefreshContent[0].destroyPullToRefresh();
    };

    //这里是否需要写到 scroller 中去？
/*    $.initPullToRefresh = function(pageContainer) {
        var $pageContainer = $(pageContainer);
        $pageContainer.each(function(index, item) {
            if ($.detectScrollerType(item) === 'js') {
                $._pullToRefreshJSScroll.initPullToRefresh(item);
            } else {
                initPullToRefresh(item);
            }
        });
    };


    $.pullToRefreshDone = function(pageContainer) {
        var $pageContainer = $(pageContainer);
        $pageContainer.each(function(index, item) {
            if ($.detectScrollerType(item) === 'js') {
                $._pullToRefreshJSScroll.pullToRefreshDone(item);
            } else {
                pullToRefreshDone(item);
            }
        });
    };


    $.pullToRefreshTrigger = function(pageContainer) {
       var $pageContainer = $(pageContainer);
        $pageContainer.each(function(index, item) {
            if ($.detectScrollerType(item) === 'js') {
                $._pullToRefreshJSScroll.pullToRefreshTrigger(item);
            } else {
                pullToRefreshTrigger(item);
            }
        });
    };

    $.destroyPullToRefresh = function(pageContainer) {
        var $pageContainer = $(pageContainer);
        $pageContainer.each(function(index, item) {
            if ($.detectScrollerType(item) === 'js') {
                $._pullToRefreshJSScroll.destroyPullToRefresh(item);
            } else {
                destroyPullToRefresh(item);
            }
        });
    };
*/

}(Zepto); //jshint ignore:line

/*===============================================================================
************   Rate   ************
===============================================================================*/
/* global Zepto:true */
+ function($) {
	"use strict";
	var methods = {
		init: function(options) {
			return this.each(function() {
				this.self = $(this);

				methods.destroy.call(this.self);

				this.opt = $.extend(true, {}, $.fn.raty.defaults, options);

				methods._adjustCallback.call(this);
				methods._adjustNumber.call(this);
				methods._adjustHints.call(this);

				this.opt.score = methods._adjustedScore.call(this, this.opt.score);

				if (this.opt.starType !== 'img') {
					methods._adjustStarType.call(this);
				}

				methods._adjustPath.call(this);
				methods._createStars.call(this);

				if (this.opt.cancel) {
					methods._createCancel.call(this);
				}

				if (this.opt.precision) {
					methods._adjustPrecision.call(this);
				}

				methods._createScore.call(this);
				methods._apply.call(this, this.opt.score);
				methods._setTitle.call(this, this.opt.score);
				methods._target.call(this, this.opt.score);

				if (this.opt.readOnly) {
					methods._lock.call(this);
				} else {
					this.style.cursor = 'pointer';

					methods._binds.call(this);
				}
			});
		},

		_adjustCallback: function() {
			var options = ['number', 'readOnly', 'score', 'scoreName', 'target', 'path'];

			for (var i = 0; i < options.length; i++) {
				if (typeof this.opt[options[i]] === 'function') {
					this.opt[options[i]] = this.opt[options[i]].call(this);
				}
			}
		},

		_adjustedScore: function(score) {
			if (!score) {
				return score;
			}

			return methods._between(score, 0, this.opt.number);
		},

		_adjustHints: function() {
			if (!this.opt.hints) {
				this.opt.hints = [];
			}

			if (!this.opt.halfShow && !this.opt.half) {
				return;
			}

			var steps = this.opt.precision ? 10 : 2;

			for (var i = 0; i < this.opt.number; i++) {
				var group = this.opt.hints[i];

				if (Object.prototype.toString.call(group) !== '[object Array]') {
					group = [group];
				}

				this.opt.hints[i] = [];

				for (var j = 0; j < steps; j++) {
					var
						hint = group[j],
						last = group[group.length - 1];

					if (last === undefined) {
						last = null;
					}

					this.opt.hints[i][j] = hint === undefined ? last : hint;
				}
			}
		},

		_adjustNumber: function() {
			this.opt.number = methods._between(this.opt.number, 1, this.opt.numberMax);
		},

		_adjustPath: function() {
			this.opt.path = this.opt.path || '';

			if (this.opt.path && this.opt.path.charAt(this.opt.path.length - 1) !== '/') {
				this.opt.path += '/';
			}
		},

		_adjustPrecision: function() {
			this.opt.half = true;
		},

		_adjustStarType: function() {
			var replaces = ['cancelOff', 'cancelOn', 'starHalf', 'starOff', 'starOn'];

			this.opt.path = '';

			for (var i = 0; i < replaces.length; i++) {
				this.opt[replaces[i]] = this.opt[replaces[i]].replace('.', '-');
			}
		},

		_apply: function(score) {
			methods._fill.call(this, score);

			if (score) {
				if (score > 0) {
					this.score.val(score);
				}

				methods._roundStars.call(this, score);
			}
		},

		_between: function(value, min, max) {
			return Math.min(Math.max(parseFloat(value), min), max);
		},

		_binds: function() {
			if (this.cancel) {
				methods._bindOverCancel.call(this);
				methods._bindClickCancel.call(this);
				methods._bindOutCancel.call(this);
			}

			methods._bindOver.call(this);
			methods._bindClick.call(this);
			methods._bindOut.call(this);
		},

		_bindClick: function() {
			var that = this;

			that.stars.on('click.raty', function(evt) {
				var
					execute = true,
					score = (that.opt.half || that.opt.precision) ? that.self.data('score') : (this.alt || $(this).data('alt'));

				if (that.opt.click) {
					execute = that.opt.click.call(that, +score, evt);
				}

				if (execute || execute === undefined) {
					if (that.opt.half && !that.opt.precision) {
						score = methods._roundHalfScore.call(that, score);
					}

					methods._apply.call(that, score);
				}
			});
		},

		_bindClickCancel: function() {
			var that = this;

			that.cancel.on('click.raty', function(evt) {
				that.score.removeAttr('value');

				if (that.opt.click) {
					that.opt.click.call(that, null, evt);
				}
			});
		},

		_bindOut: function() {
			var that = this;

			that.self.on('mouseleave.raty', function(evt) {
				var score = +that.score.val() || undefined;

				methods._apply.call(that, score);
				methods._target.call(that, score, evt);
				methods._resetTitle.call(that);

				if (that.opt.mouseout) {
					that.opt.mouseout.call(that, score, evt);
				}
			});
		},

		_bindOutCancel: function() {
			var that = this;

			that.cancel.on('mouseleave.raty', function(evt) {
				var icon = that.opt.cancelOff;

				if (that.opt.starType !== 'img') {
					icon = that.opt.cancelClass + ' ' + icon;
				}

				methods._setIcon.call(that, this, icon);

				if (that.opt.mouseout) {
					var score = +that.score.val() || undefined;

					that.opt.mouseout.call(that, score, evt);
				}
			});
		},

		_bindOver: function() {
			var that = this,
				action = that.opt.half ? 'mousemove.raty' : 'mouseover.raty';

			that.stars.on(action, function(evt) {
				var score = methods._getScoreByPosition.call(that, evt, this);

				methods._fill.call(that, score);

				if (that.opt.half) {
					methods._roundStars.call(that, score, evt);
					methods._setTitle.call(that, score, evt);

					that.self.data('score', score);
				}

				methods._target.call(that, score, evt);

				if (that.opt.mouseover) {
					that.opt.mouseover.call(that, score, evt);
				}
			});
		},

		_bindOverCancel: function() {
			var that = this;

			that.cancel.on('mouseover.raty', function(evt) {
				var
					starOff = that.opt.path + that.opt.starOff,
					icon = that.opt.cancelOn;

				if (that.opt.starType === 'img') {
					that.stars.attr('src', starOff);
				} else {
					icon = that.opt.cancelClass + ' ' + icon;

					that.stars.attr('class', starOff);
				}

				methods._setIcon.call(that, this, icon);
				methods._target.call(that, null, evt);

				if (that.opt.mouseover) {
					that.opt.mouseover.call(that, null);
				}
			});
		},

		_buildScoreField: function() {
			return $('<input />', {
				name: this.opt.scoreName,
				type: 'hidden'
			}).appendTo(this);
		},

		_createCancel: function() {
			var icon = this.opt.path + this.opt.cancelOff,
				cancel = $('<' + this.opt.starType + ' />', {
					title: this.opt.cancelHint,
					'class': this.opt.cancelClass
				});

			if (this.opt.starType === 'img') {
				cancel.attr({
					src: icon,
					alt: 'x'
				});
			} else {
				// TODO: use $.data
				cancel.attr('data-alt', 'x').addClass(icon);
			}

			if (this.opt.cancelPlace === 'left') {
				this.self.prepend('&#160;').prepend(cancel);
			} else {
				this.self.append('&#160;').append(cancel);
			}

			this.cancel = cancel;
		},

		_createScore: function() {
			var score = $(this.opt.targetScore);

			this.score = score.length ? score : methods._buildScoreField.call(this);
		},

		_createStars: function() {
			for (var i = 1; i <= this.opt.number; i++) {
				var
					name = methods._nameForIndex.call(this, i),
					attrs = {
						alt: i,
						src: this.opt.path + this.opt[name]
					};

				if (this.opt.starType !== 'img') {
					attrs = {
						'data-alt': i,
						'class': attrs.src
					}; // TODO: use $.data.
				}

				attrs.title = methods._getHint.call(this, i);

				$('<' + this.opt.starType + ' />', attrs).appendTo(this);

				if (this.opt.space) {
					this.self.append(i < this.opt.number ? '&#160;' : '');
				}
			}

			this.stars = this.self.children(this.opt.starType);
		},

		_error: function(message) {
			$(this).text(message);

			$.error(message);
		},

		_fill: function(score) {
			var hash = 0;

			for (var i = 1; i <= this.stars.length; i++) {
				var
					icon,
					star = this.stars[i - 1],
					turnOn = methods._turnOn.call(this, i, score);

				if (this.opt.iconRange && this.opt.iconRange.length > hash) {
					var irange = this.opt.iconRange[hash];

					icon = methods._getRangeIcon.call(this, irange, turnOn);

					if (i <= irange.range) {
						methods._setIcon.call(this, star, icon);
					}

					if (i === irange.range) {
						hash++;
					}
				} else {
					icon = this.opt[turnOn ? 'starOn' : 'starOff'];

					methods._setIcon.call(this, star, icon);
				}
			}
		},

		_getFirstDecimal: function(number) {
			var
				decimal = number.toString().split('.')[1],
				result = 0;

			if (decimal) {
				result = parseInt(decimal.charAt(0), 10);

				if (decimal.slice(1, 5) === '9999') {
					result++;
				}
			}

			return result;
		},

		_getRangeIcon: function(irange, turnOn) {
			return turnOn ? irange.on || this.opt.starOn : irange.off || this.opt.starOff;
		},

		_getScoreByPosition: function(evt, icon) {
			var score = parseInt(icon.alt || icon.getAttribute('data-alt'), 10);

			if (this.opt.half) {
				var
					size = methods._getWidth.call(this),
					percent = parseFloat((evt.pageX - $(icon).offset().left) / size);

				score = score - 1 + percent;
			}

			return score;
		},

		_getHint: function(score, evt) {
			if (score !== 0 && !score) {
				return this.opt.noRatedMsg;
			}

			var
				decimal = methods._getFirstDecimal.call(this, score),
				integer = Math.ceil(score),
				group = this.opt.hints[(integer || 1) - 1],
				hint = group,
				set = !evt || this.move;

			if (this.opt.precision) {
				if (set) {
					decimal = decimal === 0 ? 9 : decimal - 1;
				}

				hint = group[decimal];
			} else if (this.opt.halfShow || this.opt.half) {
				decimal = set && decimal === 0 ? 1 : decimal > 5 ? 1 : 0;

				hint = group[decimal];
			}

			return hint === '' ? '' : hint || score;
		},

		_getWidth: function() {
			var width = this.stars[0].width || parseFloat(this.stars.eq(0).css('font-size'));

			if (!width) {
				methods._error.call(this, 'Could not get the icon width!');
			}

			return width;
		},

		_lock: function() {
			var hint = methods._getHint.call(this, this.score.val());

			this.style.cursor = '';
			this.title = hint;

			this.score.prop('readonly', true);
			this.stars.prop('title', hint);

			if (this.cancel) {
				this.cancel.hide();
			}

			this.self.data('readonly', true);
		},

		_nameForIndex: function(i) {
			return this.opt.score && this.opt.score >= i ? 'starOn' : 'starOff';
		},

		_resetTitle: function(star) {
			for (var i = 0; i < this.opt.number; i++) {
				this.stars[i].title = methods._getHint.call(this, i + 1);
			}
		},

		_roundHalfScore: function(score) {
			var integer = parseInt(score, 10),
				decimal = methods._getFirstDecimal.call(this, score);

			if (decimal !== 0) {
				decimal = decimal > 5 ? 1 : 0.5;
			}

			return integer + decimal;
		},

		_roundStars: function(score, evt) {
			var
				decimal = (score % 1).toFixed(2),
				name;

			if (evt || this.move) {
				name = decimal > 0.5 ? 'starOn' : 'starHalf';
			} else if (decimal > this.opt.round.down) { // Up:   [x.76 .. x.99]
				name = 'starOn';

				if (this.opt.halfShow && decimal < this.opt.round.up) { // Half: [x.26 .. x.75]
					name = 'starHalf';
				} else if (decimal < this.opt.round.full) { // Down: [x.00 .. x.5]
					name = 'starOff';
				}
			}

			if (name) {
				var
					icon = this.opt[name],
					star = this.stars[Math.ceil(score) - 1];

				methods._setIcon.call(this, star, icon);
			} // Full down: [x.00 .. x.25]
		},

		_setIcon: function(star, icon) {
			star[this.opt.starType === 'img' ? 'src' : 'className'] = this.opt.path + icon;
		},

		_setTarget: function(target, score) {
			if (score) {
				score = this.opt.targetFormat.toString().replace('{score}', score);
			}

			if (target.is(':input')) {
				target.val(score);
			} else {
				target.html(score);
			}
		},

		_setTitle: function(score, evt) {
			if (score) {
				var
					integer = parseInt(Math.ceil(score), 10),
					star = this.stars[integer - 1];

				star.title = methods._getHint.call(this, score, evt);
			}
		},

		_target: function(score, evt) {
			if (this.opt.target) {
				var target = $(this.opt.target);

				if (!target.length) {
					methods._error.call(this, 'Target selector invalid or missing!');
				}

				var mouseover = evt && evt.type === 'mouseover';

				if (score === undefined) {
					score = this.opt.targetText;
				} else if (score === null) {
					score = mouseover ? this.opt.cancelHint : this.opt.targetText;
				} else {
					if (this.opt.targetType === 'hint') {
						score = methods._getHint.call(this, score, evt);
					} else if (this.opt.precision) {
						score = parseFloat(score).toFixed(1);
					}

					var mousemove = evt && evt.type === 'mousemove';

					if (!mouseover && !mousemove && !this.opt.targetKeep) {
						score = this.opt.targetText;
					}
				}

				methods._setTarget.call(this, target, score);
			}
		},

		_turnOn: function(i, score) {
			return this.opt.single ? (i === score) : (i <= score);
		},

		_unlock: function() {
			this.style.cursor = 'pointer';
			this.removeAttribute('title');

			this.score.removeAttr('readonly');

			this.self.data('readonly', false);

			for (var i = 0; i < this.opt.number; i++) {
				this.stars[i].title = methods._getHint.call(this, i + 1);
			}

			if (this.cancel) {
				this.cancel.css('display', '');
			}
		},

		cancel: function(click) {
			return this.each(function() {
				var self = $(this);

				if (self.data('readonly') !== true) {
					methods[click ? 'click' : 'score'].call(self, null);

					this.score.removeAttr('value');
				}
			});
		},

		click: function(score) {
			return this.each(function() {
				if ($(this).data('readonly') !== true) {
					score = methods._adjustedScore.call(this, score);

					methods._apply.call(this, score);

					if (this.opt.click) {
						this.opt.click.call(this, score, $.Event('click'));
					}

					methods._target.call(this, score);
				}
			});
		},

		destroy: function() {
			return this.each(function() {
				var self = $(this),
					raw = self.data('raw');

				if (raw) {
					self.off('.raty').empty().css({
						cursor: raw.style.cursor
					}).removeData('readonly');
				} else {
					self.data('raw', self.clone()[0]);
				}
			});
		},

		getScore: function() {
			var score = [],
				value;

			this.each(function() {
				value = this.score.val();

				score.push(value ? +value : undefined);
			});

			return (score.length > 1) ? score : score[0];
		},

		move: function(score) {
			return this.each(function() {
				var
					integer = parseInt(score, 10),
					decimal = methods._getFirstDecimal.call(this, score);

				if (integer >= this.opt.number) {
					integer = this.opt.number - 1;
					decimal = 10;
				}

				var
					width = methods._getWidth.call(this),
					steps = width / 10,
					star = $(this.stars[integer]),
					percent = star.offset().left + steps * decimal,
					evt = $.Event('mousemove', {
						pageX: percent
					});

				this.move = true;

				star.trigger(evt);

				this.move = false;
			});
		},

		readOnly: function(readonly) {
			return this.each(function() {
				var self = $(this);

				if (self.data('readonly') !== readonly) {
					if (readonly) {
						self.off('.raty').children(this.opt.starType).off('.raty');

						methods._lock.call(this);
					} else {
						methods._binds.call(this);
						methods._unlock.call(this);
					}

					self.data('readonly', readonly);
				}
			});
		},

		reload: function() {
			return methods.set.call(this, {});
		},

		score: function() {
			var self = $(this);

			return arguments.length ? methods.setScore.apply(self, arguments) : methods.getScore.call(self);
		},

		set: function(options) {
			return this.each(function() {
				$(this).raty($.extend({}, this.opt, options));
			});
		},

		setScore: function(score) {
			return this.each(function() {
				if ($(this).data('readonly') !== true) {
					score = methods._adjustedScore.call(this, score);

					methods._apply.call(this, score);
					methods._target.call(this, score);
				}
			});
		}
	};

	$.fn.raty = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist!');
		}
	};

	$.fn.raty.defaults = {
		cancel: false,
		cancelClass: 'raty-cancel',
		cancelHint: 'Cancel this rating!',
		cancelOff: 'cancel-off.png',
		cancelOn: 'cancel-on.png',
		cancelPlace: 'left',
		click: undefined,
		half: false,
		halfShow: true,
		hints: ['bad', 'poor', 'regular', 'good', 'gorgeous'],
		iconRange: undefined,
		mouseout: undefined,
		mouseover: undefined,
		noRatedMsg: 'Not rated yet!',
		number: 5,
		numberMax: 20,
		path: undefined,
		precision: false,
		readOnly: false,
		round: {
			down: 0.25,
			full: 0.6,
			up: 0.76
		},
		score: undefined,
		scoreName: 'score',
		single: false,
		space: true,
		starHalf: 'star-half.png',
		starOff: 'star-off.png',
		starOn: 'star-on.png',
		starType: 'img',
		target: undefined,
		targetFormat: '{score}',
		targetKeep: false,
		targetScore: undefined,
		targetText: '',
		targetType: 'hint'
	};


}(Zepto);
/**
 * 路由
 *
 * 路由功能将接管页面的链接点击行为，最后达到动画切换的效果，具体如下：
 *  1. 链接对应的是另一个页面，那么则尝试 ajax 加载，然后把新页面里的符合约定的结构提取出来，然后做动画切换；如果没法 ajax 或结构不符合，那么则回退为普通的页面跳转
 *  2. 链接是当前页面的锚点，并且该锚点对应的元素存在且符合路由约定，那么则把该元素做动画切入
 *  3. 浏览器前进后退（history.forward/history.back）时，也使用动画效果
 *  4. 如果链接有 back 这个 class，那么则忽略一切，直接调用 history.back() 来后退
 *
 * 路由功能默认开启，如果需要关闭路由功能，那么在 zepto 之后，msui 脚本之前设置 $.config.router = false 即可（intro.js 中会 extend 到 $.smConfig 中）。
 *
 * 可以设置 $.config.routerFilter 函数来设置当前点击链接是否使用路由功能，实参是 a 链接的 zepto 对象；返回 false 表示不使用 router 功能。
 *
 * ajax 载入新的文档时，并不会执行里面的 js。到目前为止，在开启路由功能时，建议的做法是：
 *  把所有页面的 js 都放到同一个脚本里，js 里面的事件绑定使用委托而不是直接的绑定在元素上（因为动态加载的页面元素还不存在），然后所有页面都引用相同的 js 脚本。非事件类可以通过监控 pageInit 事件，根据里面的 pageId 来做对应区别处理。
 *
 * 如果有需要
 *
 * 对外暴露的方法
 *  - load （原 loadPage 效果一致,但后者已标记为待移除）
 *  - forward
 *  - back
 *
 * 事件
 * pageLoad* 系列在发生 ajax 加载时才会触发；当是块切换或已缓存的情况下，不会发送这些事件
 *  - pageLoadCancel: 如果前一个还没加载完,那么取消并发送该事件
 *  - pageLoadStart: 开始加载
 *  - pageLodComplete: ajax complete 完成
 *  - pageLoadError: ajax 发生 error
 *  - pageAnimationStart: 执行动画切换前，实参是 event，sectionId 和 $section
 *  - pageAnimationEnd: 执行动画完毕，实参是 event，sectionId 和 $section
 *  - beforePageRemove: 新 document 载入且动画切换完毕，旧的 document remove 之前在 window 上触发，实参是 event 和 $pageContainer
 *  - pageRemoved: 新的 document 载入且动画切换完毕，旧的 document remove 之后在 window 上触发
 *  - beforePageSwitch: page 切换前，在 pageAnimationStart 前，beforePageSwitch 之后会做一些额外的处理才触发 pageAnimationStart
 *  - pageInitInternal: （经 init.js 处理后，对外是 pageInit）紧跟着动画完成的事件，实参是 event，sectionId 和 $section
 *
 * 术语
 *  - 文档（document），不带 hash 的 url 关联着的应答 html 结构
 *  - 块（section），一个文档内有指定块标识的元素
 *
 * 路由实现约定
 *  - 每个文档的需要展示的内容必需位于指定的标识（routerConfig.sectionGroupClass）的元素里面，默认是: div.page-group （注意,如果改变这个需要同时改变 less 中的命名）
 *  - 每个块必需带有指定的块标识（routerConfig.pageClass），默认是 .page
 *
 *  即，使用路由功能的每一个文档应当是下面这样的结构（省略 <body> 等）:
 *      <div class="page-group">
 *          <div class="page">xxx</div>
 *          <div class="page">yyy</div>
 *      </div>
 *
 * 另，每一个块都应当有一个唯一的 ID，这样才能通过 #the-id 的形式来切换定位。
 * 当一个块没有 id 时，如果是第一个的默认的需要展示的块，那么会给其添加一个随机的 id；否则，没有 id 的块将不会被切换展示。
 *
 * 通过 history.state/history.pushState 以及用 sessionStorage 来记录当前 state 以及最大的 state id 来辅助前进后退的切换效果，所以在不支持 sessionStorage 的情况下，将不开启路由功能。
 *
 * 为了解决 ajax 载入页面导致重复 ID 以及重复 popup 等功能，上面约定了使用路由功能的所有可展示内容都必需位于指定元素内。从而可以在进行文档间切换时可以进行两个文档的整体移动，切换完毕后再把前一个文档的内容从页面之间移除。
 *
 * 默认地过滤了部分协议的链接，包括 tel:, javascript:, mailto:，这些链接将不会使用路由功能。如果有更多的自定义控制需求，可以在 $.config.routerFilter 实现
 *
 * 注: 以 _ 开头的函数标明用于此处内部使用，可根据需要随时重构变更，不对外确保兼容性。
 *
 */
+function($) {
    'use strict';

    if (!window.CustomEvent) {
        window.CustomEvent = function(type, config) {
            config = config || { bubbles: false, cancelable: false, detail: undefined};
            var e = document.createEvent('CustomEvent');
            e.initCustomEvent(type, config.bubbles, config.cancelable, config.detail);
            return e;
        };

        window.CustomEvent.prototype = window.Event.prototype;
    }

    var EVENTS = {
        pageLoadStart: 'pageLoadStart', // ajax 开始加载新页面前
        pageLoadCancel: 'pageLoadCancel', // 取消前一个 ajax 加载动作后
        pageLoadError: 'pageLoadError', // ajax 加载页面失败后
        pageLoadComplete: 'pageLoadComplete', // ajax 加载页面完成后（不论成功与否）
        pageAnimationStart: 'pageAnimationStart', // 动画切换 page 前
        pageAnimationEnd: 'pageAnimationEnd', // 动画切换 page 结束后
        beforePageRemove: 'beforePageRemove', // 移除旧 document 前（适用于非内联 page 切换）
        pageRemoved: 'pageRemoved', // 移除旧 document 后（适用于非内联 page 切换）
        beforePageSwitch: 'beforePageSwitch', // page 切换前，在 pageAnimationStart 前，beforePageSwitch 之后会做一些额外的处理才触发 pageAnimationStart
        pageInit: 'pageInitInternal' // 目前是定义为一个 page 加载完毕后（实际和 pageAnimationEnd 等同）
    };

    var Util = {
        /**
         * 获取 url 的 fragment（即 hash 中去掉 # 的剩余部分）
         *
         * 如果没有则返回空字符串
         * 如: http://example.com/path/?query=d#123 => 123
         *
         * @param {String} url url
         * @returns {String}
         */
        getUrlFragment: function(url) {
            var hashIndex = url.indexOf('#');
            return hashIndex === -1 ? '' : url.slice(hashIndex + 1);
        },
        /**
         * 获取一个链接相对于当前页面的绝对地址形式
         *
         * 假设当前页面是 http://a.com/b/c
         * 那么有以下情况:
         * d => http://a.com/b/d
         * /e => http://a.com/e
         * #1 => http://a.com/b/c#1
         * http://b.com/f => http://b.com/f
         *
         * @param {String} url url
         * @returns {String}
         */
        getAbsoluteUrl: function(url) {
            var link = document.createElement('a');
            link.setAttribute('href', url);
            var absoluteUrl = link.href;
            link = null;
            return absoluteUrl;
        },
        /**
         * 获取一个 url 的基本部分，即不包括 hash
         *
         * @param {String} url url
         * @returns {String}
         */
        getBaseUrl: function(url) {
            var hashIndex = url.indexOf('#');
            return hashIndex === -1 ? url.slice(0) : url.slice(0, hashIndex);
        },
        /**
         * 把一个字符串的 url 转为一个可获取其 base 和 fragment 等的对象
         *
         * @param {String} url url
         * @returns {UrlObject}
         */
        toUrlObject: function(url) {
            var fullUrl = this.getAbsoluteUrl(url),
                baseUrl = this.getBaseUrl(fullUrl),
                fragment = this.getUrlFragment(url);

            return {
                base: baseUrl,
                full: fullUrl,
                original: url,
                fragment: fragment
            };
        },
        /**
         * 判断浏览器是否支持 sessionStorage，支持返回 true，否则返回 false
         * @returns {Boolean}
         */
        supportStorage: function() {
            var mod = 'sm.router.storage.ability';
            try {
                sessionStorage.setItem(mod, mod);
                sessionStorage.removeItem(mod);
                return true;
            } catch(e) {
                return false;
            }
        }
    };

    var routerConfig = {
        sectionGroupClass: 'page-group',
        // 表示是当前 page 的 class
        curPageClass: 'page-current',
        // 用来辅助切换时表示 page 是 visible 的,
        // 之所以不用 curPageClass，是因为 page-current 已被赋予了「当前 page」这一含义而不仅仅是 display: block
        // 并且，别的地方已经使用了，所以不方便做变更，故新增一个
        visiblePageClass: 'page-visible',
        // 表示是 page 的 class，注意，仅是标志 class，而不是所有的 class
        pageClass: 'page'
    };

    var DIRECTION = {
        leftToRight: 'from-left-to-right',
        rightToLeft: 'from-right-to-left'
    };

    var theHistory = window.history;

    var Router = function() {
        this.sessionNames = {
            currentState: 'sm.router.currentState',
            maxStateId: 'sm.router.maxStateId'
        };

        this._init();
        this.xhr = null;
        window.addEventListener('popstate', this._onPopState.bind(this));
    };

    /**
     * 初始化
     *
     * - 把当前文档内容缓存起来
     * - 查找默认展示的块内容，查找顺序如下
     *      1. id 是 url 中的 fragment 的元素
     *      2. 有当前块 class 标识的第一个元素
     *      3. 第一个块
     * - 初始页面 state 处理
     *
     * @private
     */
    Router.prototype._init = function() {

        this.$view = $('body');

        // 用来保存 document 的 map
        this.cache = {};
        var $doc = $(document);
        var currentUrl = location.href;
        this._saveDocumentIntoCache($doc, currentUrl);

        var curPageId;

        var currentUrlObj = Util.toUrlObject(currentUrl);
        var $allSection = $doc.find('.' + routerConfig.pageClass);
        var $visibleSection = $doc.find('.' + routerConfig.curPageClass);
        var $curVisibleSection = $visibleSection.eq(0);
        var $hashSection;

        if (currentUrlObj.fragment) {
            $hashSection = $doc.find('#' + currentUrlObj.fragment);
        }
        if ($hashSection && $hashSection.length) {
            $visibleSection = $hashSection.eq(0);
        } else if (!$visibleSection.length) {
            $visibleSection = $allSection.eq(0);
        }
        if (!$visibleSection.attr('id')) {
            $visibleSection.attr('id', this._generateRandomId());
        }

        if ($curVisibleSection.length &&
            ($curVisibleSection.attr('id') !== $visibleSection.attr('id'))) {
            // 在 router 到 inner page 的情况下，刷新（或者直接访问该链接）
            // 直接切换 class 会有「闪」的现象,或许可以采用 animateSection 来减缓一下
            $curVisibleSection.removeClass(routerConfig.curPageClass);
            $visibleSection.addClass(routerConfig.curPageClass);
        } else {
            $visibleSection.addClass(routerConfig.curPageClass);
        }
        curPageId = $visibleSection.attr('id');


        // 新进入一个使用 history.state 相关技术的页面时，如果第一个 state 不 push/replace,
        // 那么在后退回该页面时，将不触发 popState 事件
        if (theHistory.state === null) {
            var curState = {
                id: this._getNextStateId(),
                url: Util.toUrlObject(currentUrl),
                pageId: curPageId
            };

            theHistory.replaceState(curState, '', currentUrl);
            this._saveAsCurrentState(curState);
            this._incMaxStateId();
        }
    };

    /**
     * 切换到 url 指定的块或文档
     *
     * 如果 url 指向的是当前页面，那么认为是切换块；
     * 否则是切换文档
     *
     * @param {String} url url
     * @param {Boolean=} ignoreCache 是否强制请求不使用缓存，对 document 生效，默认是 false
     */
    Router.prototype.load = function(url, ignoreCache) {
        if (ignoreCache === undefined) {
            ignoreCache = false;
        }

        if (this._isTheSameDocument(location.href, url)) {
            this._switchToSection(Util.getUrlFragment(url));
        } else {
            this._saveDocumentIntoCache($(document), location.href);
            this._switchToDocument(url, ignoreCache);
        }
    };

    /**
     * 调用 history.forward()
     */
    Router.prototype.forward = function() {
        theHistory.forward();
    };

    /**
     * 调用 history.back()
     */
    Router.prototype.back = function() {
        theHistory.back();
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * @deprecated
     */
    Router.prototype.loadPage = Router.prototype.load;

    /**
     * 切换显示当前文档另一个块
     *
     * 把新块从右边切入展示，同时会把新的块的记录用 history.pushState 来保存起来
     *
     * 如果已经是当前显示的块，那么不做任何处理；
     * 如果没对应的块，那么忽略。
     *
     * @param {String} sectionId 待切换显示的块的 id
     * @private
     */
    Router.prototype._switchToSection = function(sectionId) {
        if (!sectionId) {
            return;
        }

        var $curPage = this._getCurrentSection(),
            $newPage = $('#' + sectionId);

        // 如果已经是当前页，不做任何处理
        if ($curPage === $newPage) {
            return;
        }

        this._animateSection($curPage, $newPage, DIRECTION.rightToLeft);
        this._pushNewState('#' + sectionId, sectionId);
    };

    /**
     * 载入显示一个新的文档
     *
     * - 如果有缓存，那么直接利用缓存来切换
     * - 否则，先把页面加载过来缓存，然后再切换
     *      - 如果解析失败，那么用 location.href 的方式来跳转
     *
     * 注意：不能在这里以及其之后用 location.href 来 **读取** 切换前的页面的 url，
     *     因为如果是 popState 时的调用，那么此时 location 已经是 pop 出来的 state 的了
     *
     * @param {String} url 新的文档的 url
     * @param {Boolean=} ignoreCache 是否不使用缓存强制加载页面
     * @param {Boolean=} isPushState 是否需要 pushState
     * @param {String=} direction 新文档切入的方向
     * @private
     */
    Router.prototype._switchToDocument = function(url, ignoreCache, isPushState, direction) {
        var baseUrl = Util.toUrlObject(url).base;

        if (ignoreCache) {
            delete this.cache[baseUrl];
        }

        var cacheDocument = this.cache[baseUrl];
        var context = this;

        if (cacheDocument) {
            this._doSwitchDocument(url, isPushState, direction);
        } else {
            this._loadDocument(url, {
                success: function($doc) {
                    try {
                        context._parseDocument(url, $doc);
                        context._doSwitchDocument(url, isPushState, direction);
                    } catch (e) {
                        location.href = url;
                    }
                },
                error: function() {
                    location.href = url;
                }
            });
        }
    };

    /**
     * 利用缓存来做具体的切换文档操作
     *
     * - 确定待切入的文档的默认展示 section
     * - 把新文档 append 到 view 中
     * - 动画切换文档
     * - 如果需要 pushState，那么把最新的状态 push 进去并把当前状态更新为该状态
     *
     * @param {String} url 待切换的文档的 url
     * @param {Boolean} isPushState 加载页面后是否需要 pushState，默认是 true
     * @param {String} direction 动画切换方向，默认是 DIRECTION.rightToLeft
     * @private
     */
    Router.prototype._doSwitchDocument = function(url, isPushState, direction) {
        if (typeof isPushState === 'undefined') {
            isPushState = true;
        }

        var urlObj = Util.toUrlObject(url);
        var $currentDoc = this.$view.find('.' + routerConfig.sectionGroupClass);
        var $newDoc = $($('<div></div>').append(this.cache[urlObj.base].$content).html());

        // 确定一个 document 展示 section 的顺序
        // 1. 与 hash 关联的 element
        // 2. 默认的标识为 current 的 element
        // 3. 第一个 section
        var $allSection = $newDoc.find('.' + routerConfig.pageClass);
        var $visibleSection = $newDoc.find('.' + routerConfig.curPageClass);
        var $hashSection;

        if (urlObj.fragment) {
            $hashSection = $newDoc.find('#' + urlObj.fragment);
        }
        if ($hashSection && $hashSection.length) {
            $visibleSection = $hashSection.eq(0);
        } else if (!$visibleSection.length) {
            $visibleSection = $allSection.eq(0);
        }
        if (!$visibleSection.attr('id')) {
            $visibleSection.attr('id', this._generateRandomId());
        }

        var $currentSection = this._getCurrentSection();
        $currentSection.trigger(EVENTS.beforePageSwitch, [$currentSection.attr('id'), $currentSection]);

        $allSection.removeClass(routerConfig.curPageClass);
        $visibleSection.addClass(routerConfig.curPageClass);

        // prepend 而不 append 的目的是避免 append 进去新的 document 在后面，
        // 其里面的默认展示的(.page-current) 的页面直接就覆盖了原显示的页面（因为都是 absolute）
        this.$view.prepend($newDoc);

        this._animateDocument($currentDoc, $newDoc, $visibleSection, direction);

        if (isPushState) {
            this._pushNewState(url, $visibleSection.attr('id'));
        }
    };

    /**
     * 判断两个 url 指向的页面是否是同一个
     *
     * 判断方式: 如果两个 url 的 base 形式（不带 hash 的绝对形式）相同，那么认为是同一个页面
     *
     * @param {String} url
     * @param {String} anotherUrl
     * @returns {Boolean}
     * @private
     */
    Router.prototype._isTheSameDocument = function(url, anotherUrl) {
        return Util.toUrlObject(url).base === Util.toUrlObject(anotherUrl).base;
    };

    /**
     * ajax 加载 url 指定的页面内容
     *
     * 加载过程中会发出以下事件
     *  pageLoadCancel: 如果前一个还没加载完,那么取消并发送该事件
     *  pageLoadStart: 开始加载
     *  pageLodComplete: ajax complete 完成
     *  pageLoadError: ajax 发生 error
     *
     *
     * @param {String} url url
     * @param {Object=} callback 回调函数配置，可选，可以配置 success\error 和 complete
     *      所有回调函数的 this 都是 null，各自实参如下：
     *      success: $doc, status, xhr
     *      error: xhr, status, err
     *      complete: xhr, status
     *
     * @private
     */
    Router.prototype._loadDocument = function(url, callback) {
        if (this.xhr && this.xhr.readyState < 4) {
            this.xhr.onreadystatechange = function() {
            };
            this.xhr.abort();
            this.dispatch(EVENTS.pageLoadCancel);
        }

        this.dispatch(EVENTS.pageLoadStart);

        callback = callback || {};
        var self = this;

        this.xhr = $.ajax({
            url: url,
            success: $.proxy(function(data, status, xhr) {
                // 给包一层 <html/>，从而可以拿到完整的结构
                var $doc = $('<html></html>');
                $doc.append(data);
                callback.success && callback.success.call(null, $doc, status, xhr);
            }, this),
            error: function(xhr, status, err) {
                callback.error && callback.error.call(null, xhr, status, err);
                self.dispatch(EVENTS.pageLoadError);
            },
            complete: function(xhr, status) {
                callback.complete && callback.complete.call(null, xhr, status);
                self.dispatch(EVENTS.pageLoadComplete);
            }
        });
    };

    /**
     * 对于 ajax 加载进来的页面，把其缓存起来
     *
     * @param {String} url url
     * @param $doc ajax 载入的页面的 jq 对象，可以看做是该页面的 $(document)
     * @private
     */
    Router.prototype._parseDocument = function(url, $doc) {
        var $innerView = $doc.find('.' + routerConfig.sectionGroupClass);

        if (!$innerView.length) {
            throw new Error('missing router view mark: ' + routerConfig.sectionGroupClass);
        }

        this._saveDocumentIntoCache($doc, url);
    };

    /**
     * 把一个页面的相关信息保存到 this.cache 中
     *
     * 以页面的 baseUrl 为 key,而 value 则是一个 DocumentCache
     *
     * @param {*} doc doc
     * @param {String} url url
     * @private
     */
    Router.prototype._saveDocumentIntoCache = function(doc, url) {
        var urlAsKey = Util.toUrlObject(url).base;
        var $doc = $(doc);

        this.cache[urlAsKey] = {
            $doc: $doc,
            $content: $doc.find('.' + routerConfig.sectionGroupClass)
        };
    };

    /**
     * 从 sessionStorage 中获取保存下来的「当前状态」
     *
     * 如果解析失败，那么认为当前状态是 null
     *
     * @returns {State|null}
     * @private
     */
    Router.prototype._getLastState = function() {
        var currentState = sessionStorage.getItem(this.sessionNames.currentState);
        try {
            currentState = JSON.parse(currentState);
        } catch(e) {
            currentState = null;
        }

        return currentState;
    };

    /**
     * 把一个状态设为当前状态，保存仅 sessionStorage 中
     *
     * @param {State} state
     * @private
     */
    Router.prototype._saveAsCurrentState = function(state) {
        sessionStorage.setItem(this.sessionNames.currentState, JSON.stringify(state));
    };

    /**
     * 获取下一个 state 的 id
     *
     * 读取 sessionStorage 里的最后的状态的 id，然后 + 1；如果原没设置，那么返回 1
     *
     * @returns {number}
     * @private
     */
    Router.prototype._getNextStateId = function() {
        var maxStateId = sessionStorage.getItem(this.sessionNames.maxStateId);
        return maxStateId ? parseInt(maxStateId, 10) + 1 : 1;
    };

    /**
     * 把 sessionStorage 里的最后状态的 id 自加 1
     *
     * @private
     */
    Router.prototype._incMaxStateId = function() {
        sessionStorage.setItem(this.sessionNames.maxStateId, this._getNextStateId());
    };

    /**
     * 从一个文档切换为显示另一个文档
     *
     * @param $from 目前显示的文档
     * @param $to 待切换显示的新文档
     * @param $visibleSection 新文档中展示的 section 元素
     * @param direction 新文档切入方向
     * @private
     */
    Router.prototype._animateDocument = function($from, $to, $visibleSection, direction) {
        var sectionId = $visibleSection.attr('id');


        var $visibleSectionInFrom = $from.find('.' + routerConfig.curPageClass);
        $visibleSectionInFrom.addClass(routerConfig.visiblePageClass).removeClass(routerConfig.curPageClass);

        $visibleSection.trigger(EVENTS.pageAnimationStart, [sectionId, $visibleSection]);

        this._animateElement($from, $to, direction);

        $from.animationEnd(function() {
            $visibleSectionInFrom.removeClass(routerConfig.visiblePageClass);
            // 移除 document 前后，发送 beforePageRemove 和 pageRemoved 事件
            $(window).trigger(EVENTS.beforePageRemove, [$from]);
            $from.remove();
            $(window).trigger(EVENTS.pageRemoved);
        });

        $to.animationEnd(function() {
            $visibleSection.trigger(EVENTS.pageAnimationEnd, [sectionId, $visibleSection]);
            // 外层（init.js）中会绑定 pageInitInternal 事件，然后对页面进行初始化
            $visibleSection.trigger(EVENTS.pageInit, [sectionId, $visibleSection]);
        });
    };

    /**
     * 把当前文档的展示 section 从一个 section 切换到另一个 section
     *
     * @param $from
     * @param $to
     * @param direction
     * @private
     */
    Router.prototype._animateSection = function($from, $to, direction) {
        var toId = $to.attr('id');
        $from.trigger(EVENTS.beforePageSwitch, [$from.attr('id'), $from]);

        $from.removeClass(routerConfig.curPageClass);
        $to.addClass(routerConfig.curPageClass);
        $to.trigger(EVENTS.pageAnimationStart, [toId, $to]);
        this._animateElement($from, $to, direction);
        $to.animationEnd(function() {
            $to.trigger(EVENTS.pageAnimationEnd, [toId, $to]);
            // 外层（init.js）中会绑定 pageInitInternal 事件，然后对页面进行初始化
            $to.trigger(EVENTS.pageInit, [toId, $to]);
        });
    };

    /**
     * 切换显示两个元素
     *
     * 切换是通过更新 class 来实现的，而具体的切换动画则是 class 关联的 css 来实现
     *
     * @param $from 当前显示的元素
     * @param $to 待显示的元素
     * @param direction 切换的方向
     * @private
     */
    Router.prototype._animateElement = function($from, $to, direction) {
        // todo: 可考虑如果入参不指定，那么尝试读取 $to 的属性，再没有再使用默认的
        // 考虑读取点击的链接上指定的方向
        if (typeof direction === 'undefined') {
            direction = DIRECTION.rightToLeft;
        }

        var animPageClasses = [
            'page-from-center-to-left',
            'page-from-center-to-right',
            'page-from-right-to-center',
            'page-from-left-to-center'].join(' ');

        var classForFrom, classForTo;
        switch(direction) {
            case DIRECTION.rightToLeft:
                classForFrom = 'page-from-center-to-left';
                classForTo = 'page-from-right-to-center';
                break;
            case DIRECTION.leftToRight:
                classForFrom = 'page-from-center-to-right';
                classForTo = 'page-from-left-to-center';
                break;
            default:
                classForFrom = 'page-from-center-to-left';
                classForTo = 'page-from-right-to-center';
                break;
        }

        $from.removeClass(animPageClasses).addClass(classForFrom);
        $to.removeClass(animPageClasses).addClass(classForTo);

        $from.animationEnd(function() {
            $from.removeClass(animPageClasses);
        });
        $to.animationEnd(function() {
            $to.removeClass(animPageClasses);
        });
    };

    /**
     * 获取当前显示的第一个 section
     *
     * @returns {*}
     * @private
     */
    Router.prototype._getCurrentSection = function() {
        return this.$view.find('.' + routerConfig.curPageClass).eq(0);
    };

    /**
     * popState 事件关联着的后退处理
     *
     * 判断两个 state 判断是否是属于同一个文档，然后做对应的 section 或文档切换；
     * 同时在切换后把新 state 设为当前 state
     *
     * @param {State} state 新 state
     * @param {State} fromState 旧 state
     * @private
     */
    Router.prototype._back = function(state, fromState) {
        if (this._isTheSameDocument(state.url.full, fromState.url.full)) {
            var $newPage = $('#' + state.pageId);
            if ($newPage.length) {
                var $currentPage = this._getCurrentSection();
                this._animateSection($currentPage, $newPage, DIRECTION.leftToRight);
                this._saveAsCurrentState(state);
            } else {
                location.href = state.url.full;
            }
        } else {
            this._saveDocumentIntoCache($(document), fromState.url.full);
            this._switchToDocument(state.url.full, false, false, DIRECTION.leftToRight);
            this._saveAsCurrentState(state);
        }
    };

    /**
     * popState 事件关联着的前进处理,类似于 _back，不同的是切换方向
     *
     * @param {State} state 新 state
     * @param {State} fromState 旧 state
     * @private
     */
    Router.prototype._forward = function(state, fromState) {
        if (this._isTheSameDocument(state.url.full, fromState.url.full)) {
            var $newPage = $('#' + state.pageId);
            if ($newPage.length) {
                var $currentPage = this._getCurrentSection();
                this._animateSection($currentPage, $newPage, DIRECTION.rightToLeft);
                this._saveAsCurrentState(state);
            } else {
                location.href = state.url.full;
            }
        } else {
            this._saveDocumentIntoCache($(document), fromState.url.full);
            this._switchToDocument(state.url.full, false, false, DIRECTION.rightToLeft);
            this._saveAsCurrentState(state);
        }
    };

    /**
     * popState 事件处理
     *
     * 根据 pop 出来的 state 和当前 state 来判断是前进还是后退
     *
     * @param event
     * @private
     */
    Router.prototype._onPopState = function(event) {
        var state = event.state;
        // if not a valid state, do nothing
        if (!state || !state.pageId) {
            return;
        }

        var lastState = this._getLastState();

        if (!lastState) {
            console.error && console.error('Missing last state when backward or forward');
            return;
        }

        if (state.id === lastState.id) {
            return;
        }

        if (state.id < lastState.id) {
            this._back(state, lastState);
        } else {
            this._forward(state, lastState);
        }
    };

    /**
     * 页面进入到一个新状态
     *
     * 把新状态 push 进去，设置为当前的状态，然后把 maxState 的 id +1。
     *
     * @param {String} url 新状态的 url
     * @param {String} sectionId 新状态中显示的 section 元素的 id
     * @private
     */
    Router.prototype._pushNewState = function(url, sectionId) {
        var state = {
            id: this._getNextStateId(),
            pageId: sectionId,
            url: Util.toUrlObject(url)
        };

        theHistory.pushState(state, '', url);
        this._saveAsCurrentState(state);
        this._incMaxStateId();
    };

    /**
     * 生成一个随机的 id
     *
     * @returns {string}
     * @private
     */
    Router.prototype._generateRandomId = function() {
        return "page-" + (+new Date());
    };

    Router.prototype.dispatch = function(event) {
        var e = new CustomEvent(event, {
            bubbles: true,
            cancelable: true
        });

        //noinspection JSUnresolvedFunction
        window.dispatchEvent(e);
    };

    /**
     * 判断一个链接是否使用 router 来处理
     *
     * @param $link
     * @returns {boolean}
     */
    function isInRouterBlackList($link) {
        var classBlackList = [
            'external',
            'tab-link',
            'open-popup',
            'close-popup',
            'open-panel',
            'close-panel'
        ];

        for (var i = classBlackList.length -1 ; i >= 0; i--) {
            if ($link.hasClass(classBlackList[i])) {
                return true;
            }
        }

        var linkEle = $link.get(0);
        var linkHref = linkEle.getAttribute('href');

        var protoWhiteList = [
            'http',
            'https'
        ];

        //如果非noscheme形式的链接，且协议不是http(s)，那么路由不会处理这类链接
        if (/^(\w+):/.test(linkHref) && protoWhiteList.indexOf(RegExp.$1) < 0) {
            return true;
        }

        //noinspection RedundantIfStatementJS
        if (linkEle.hasAttribute('external')) {
            return true;
        }

        return false;
    }

    /**
     * 自定义是否执行路由功能的过滤器
     *
     * 可以在外部定义 $.config.routerFilter 函数，实参是点击链接的 Zepto 对象。
     *
     * @param $link 当前点击的链接的 Zepto 对象
     * @returns {boolean} 返回 true 表示执行路由功能，否则不做路由处理
     */
    function customClickFilter($link) {
        var customRouterFilter = $.smConfig.routerFilter;
        if ($.isFunction(customRouterFilter)) {
            var filterResult = customRouterFilter($link);
            if (typeof filterResult === 'boolean') {
                return filterResult;
            }
        }

        return true;
    }

    $(function() {
        // 用户可选关闭router功能
        if (!$.smConfig.router) {
            return;
        }

        if (!Util.supportStorage()) {
            return;
        }

        var $pages = $('.' + routerConfig.pageClass);
        if (!$pages.length) {
            var warnMsg = 'Disable router function because of no .page elements';
            if (window.console && window.console.warn) {
                console.warn(warnMsg);
            }
            return;
        }

        var router = $.router = new Router();

        $(document).on('click', 'a', function(e) {
            var $target = $(e.currentTarget);

            var filterResult = customClickFilter($target);
            if (!filterResult) {
                return;
            }

            if (isInRouterBlackList($target)) {
                return;
            }

            e.preventDefault();

            if ($target.hasClass('back')) {
                router.back();
            } else {
                var url = $target.attr('href');
                if (!url || url === '#') {
                    return;
                }

                var ignoreCache = $target.attr('data-no-cache') === 'true';

                router.load(url, ignoreCache);
            }
        });
    });
}(Zepto);

/**
 * @typedef {Object} State
 * @property {Number} id
 * @property {String} url
 * @property {String} pageId
 */

/**
 * @typedef {Object} UrlObject 字符串 url 转为的对象
 * @property {String} base url 的基本路径
 * @property {String} full url 的完整绝对路径
 * @property {String} origin 转换前的 url
 * @property {String} fragment url 的 fragment
 */

/**
 * @typedef {Object} DocumentCache
 * @property {*|HTMLElement} $doc 看做是 $(document)
 * @property {*|HTMLElement} $content $doc 里的 routerConfig.innerViewClass 元素
 */

/**
 * ScrollFix v0.1
 * http://www.joelambert.co.uk
 *
 * Copyright 2011, Joe Lambert.
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
/* ===============================================================================
************   ScrollFix   ************
=============================================================================== */

+ function($) {
    "use strict";
    //安卓微信中使用scrollfix会有问题，因此只在ios中使用，安卓机器按照原来的逻辑

    if($.device.ios){
        var ScrollFix = function(elem) {

            // Variables to track inputs
            var startY;
            var startTopScroll;

            elem = elem || document.querySelector(elem);

            // If there is no element, then do nothing
            if(!elem)
                return;

            // Handle the start of interactions
            elem.addEventListener('touchstart', function(event){
                startY = event.touches[0].pageY;
                startTopScroll = elem.scrollTop;

                if(startTopScroll <= 0)
                elem.scrollTop = 1;

            if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
                elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
            }, false);
        };

        var initScrollFix = function(){
            var prefix = $('.page-current').length > 0 ? '.page-current ' : '';
            var scrollable = $(prefix + ".content");
            new ScrollFix(scrollable[0]);
        };

        $(document).on($.touchEvents.move, ".page-current .bar",function(){
            event.preventDefault();
        });
        //监听ajax页面跳转
        $(document).on("pageLoadComplete", function(){
             initScrollFix();
        });
        //监听内联页面跳转
        $(document).on("pageAnimationEnd", function(){
             initScrollFix();
        });
        initScrollFix();
    }

}(Zepto);

/* ===============================================================================
************   scroller   ************
=============================================================================== */
+ function($) {
    "use strict";
    //重置zepto自带的滚动条
    var _zeptoMethodCache = {
        "scrollTop": $.fn.scrollTop,
        "scrollLeft": $.fn.scrollLeft
    };
    //重置scrollLeft和scrollRight
    (function() {
        $.extend($.fn, {
            scrollTop: function(top, dur) {
                if (!this.length) return;
                var scroller = this.data('scroller');
                if (scroller && scroller.scroller) { //js滚动
                    return scroller.scrollTop(top, dur);
                } else {
                    return _zeptoMethodCache.scrollTop.apply(this, arguments);
                }
            }
        });
        $.extend($.fn, {
            scrollLeft: function(left, dur) {
                if (!this.length) return;
                var scroller = this.data('scroller');
                if (scroller && scroller.scroller) { //js滚动
                    return scroller.scrollLeft(left, dur);
                } else {
                    return _zeptoMethodCache.scrollLeft.apply(this, arguments);
                }
            }
        });
    })();



    //自定义的滚动条
    var Scroller = function(pageContent, _options) {
        var $pageContent = this.$pageContent = $(pageContent);

        this.options = $.extend({}, this._defaults, _options);

        var type = this.options.type;
        //auto的type,系统版本的小于4.4.0的安卓设备和系统版本小于6.0.0的ios设备，启用js版的iscoll
        var useJSScroller = (type === 'js') || (type === 'auto' && ($.device.android && $.compareVersion('4.4.0', $.device.osVersion) > -1) || (type === 'auto' && ($.device.ios && $.compareVersion('6.0.0', $.device.osVersion) > -1)));

        if (useJSScroller) {

            var $pageContentInner = $pageContent.find('.content-inner');
            //如果滚动内容没有被包裹，自动添加wrap
            if (!$pageContentInner[0]) {
                // $pageContent.html('<div class="content-inner">' + $pageContent.html() + '</div>');
                var children = $pageContent.children();
                if (children.length < 1) {
                    $pageContent.children().wrapAll('<div class="content-inner"></div>');
                } else {
                    $pageContent.html('<div class="content-inner">' + $pageContent.html() + '</div>');
                }
            }

            if ($pageContent.hasClass('pull-to-refresh-content')) {
                //因为iscroll 当页面高度不足 100% 时无法滑动，所以无法触发下拉动作，这里改动一下高度
                //区分是否有.bar容器，如有，则content的top:0，无则content的top:-2.2rem,这里取2.2rem的最大值，近60
                var minHeight = $(window).height() + ($pageContent.prev().hasClass(".bar") ? 1 : 61);
                $pageContent.find('.content-inner').css('min-height', minHeight + 'px');
            }

            var ptr = $(pageContent).hasClass('pull-to-refresh-content');
            //js滚动模式，用transform移动内容区位置，会导致fixed失效，表现类似absolute。因此禁用transform模式
            var useTransform = $pageContent.find('.fixed-tab').length === 0;
            var options = {
                probeType: 1,
                mouseWheel: true,
                //解决安卓js模式下，刷新滚动条后绑定的事件不响应，对chrome内核浏览器设置click:true
                click: $.device.androidChrome,
                useTransform: useTransform,
                //js模式下允许滚动条横向滚动，但是需要注意，滚动容易宽度必须大于屏幕宽度滚动才生效
                scrollX: true
            };
            if (ptr) {
                options.ptr = true;
                options.ptrOffset = 44;
            }
            //如果用js滚动条，用transform计算内容区位置，position：fixed将实效。若有.fixed-tab，强制使用native滚动条；备选方案，略粗暴
            // if($(pageContent).find('.fixed-tab').length>0){
            //     $pageContent.addClass('native-scroll');
            //     return;
            // }
            this.scroller = new IScroll(pageContent, options); // jshint ignore:line
            //和native滚动统一起来
            this._bindEventToDomWhenJs();
            $.initPullToRefresh = $._pullToRefreshJSScroll.initPullToRefresh;
            $.pullToRefreshDone = $._pullToRefreshJSScroll.pullToRefreshDone;
            $.pullToRefreshTrigger = $._pullToRefreshJSScroll.pullToRefreshTrigger;
            $.destroyToRefresh = $._pullToRefreshJSScroll.destroyToRefresh;
            $pageContent.addClass('javascript-scroll');
            if (!useTransform) {
                $pageContent.find('.content-inner').css({
                    width: '100%',
                    position: 'absolute'
                });
            }

            //如果页面本身已经进行了原生滚动，那么把这个滚动换成JS的滚动
            var nativeScrollTop = this.$pageContent[0].scrollTop;
            if(nativeScrollTop) {
                this.$pageContent[0].scrollTop = 0;
                this.scrollTop(nativeScrollTop);
            }
        } else {
            $pageContent.addClass('native-scroll');
        }
    };
    Scroller.prototype = {
        _defaults: {
            type: 'native',
        },
        _bindEventToDomWhenJs: function() {
            //"scrollStart", //the scroll started.
            //"scroll", //the content is scrolling. Available only in scroll-probe.js edition. See onScroll event.
            //"scrollEnd", //content stopped scrolling.
            if (this.scroller) {
                var self = this;
                this.scroller.on('scrollStart', function() {
                    self.$pageContent.trigger('scrollstart');
                });
                this.scroller.on('scroll', function() {
                    self.$pageContent.trigger('scroll');
                });
                this.scroller.on('scrollEnd', function() {
                    self.$pageContent.trigger('scrollend');
                });
            } else {
                //TODO: 实现native的scrollStart和scrollEnd
            }
        },
        scrollTop: function(top, dur) {
            if (this.scroller) {
                if (top !== undefined) {
                    this.scroller.scrollTo(0, -1 * top, dur);
                } else {
                    return this.scroller.getComputedPosition().y * -1;
                }
            } else {
                return this.$pageContent.scrollTop(top, dur);
            }
            return this;
        },
        scrollLeft: function(left, dur) {
            if (this.scroller) {
                if (left !== undefined) {
                    this.scroller.scrollTo(-1 * left, 0);
                } else {
                    return this.scroller.getComputedPosition().x * -1;
                }
            } else {
                return this.$pageContent.scrollTop(left, dur);
            }
            return this;
        },
        on: function(event, callback) {
            if (this.scroller) {
                this.scroller.on(event, function() {
                    callback.call(this.wrapper);
                });
            } else {
                this.$pageContent.on(event, callback);
            }
            return this;
        },
        off: function(event, callback) {
            if (this.scroller) {
                this.scroller.off(event, callback);
            } else {
                this.$pageContent.off(event, callback);
            }
            return this;
        },
        refresh: function() {
            if (this.scroller) this.scroller.refresh();
            return this;
        },
        scrollHeight: function() {
            if (this.scroller) {
                return this.scroller.scrollerHeight;
            } else {
                return this.$pageContent[0].scrollHeight;
            }
        }

    };

    //Scroller PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        var args = Array.apply(null, arguments);
        args.shift();
        var internal_return;

        this.each(function() {

            var $this = $(this);

            var options = $.extend({}, $this.dataset(), typeof option === 'object' && option);

            var data = $this.data('scroller');
            //如果 scroller 没有被初始化，对scroller 进行初始化r
            if (!data) {
                //获取data-api的
                $this.data('scroller', (data = new Scroller(this, options)));

            }
            if (typeof option === 'string' && typeof data[option] === 'function') {
                internal_return = data[option].apply(data, args);
                if (internal_return !== undefined)
            return false;
            }

        });

        if (internal_return !== undefined)
            return internal_return;
        else
            return this;

    }

    var old = $.fn.scroller;

    $.fn.scroller = Plugin;
    $.fn.scroller.Constructor = Scroller;


    // Scroll NO CONFLICT
    // =================

    $.fn.scroller.noConflict = function() {
        $.fn.scroller = old;
        return this;
    };
    //添加data-api
    $(function() {
        $('[data-toggle="scroller"]').scroller();
    });

    //统一的接口,带有 .javascript-scroll 的content 进行刷新
    $.refreshScroller = function(content) {
        if (content) {
            $(content).scroller('refresh');
        } else {
            $('.javascript-scroll').each(function() {
                $(this).scroller('refresh');
            });
        }

    };
    //全局初始化方法，会对页面上的 [data-toggle="scroller"]，.content. 进行滚动条初始化
    $.initScroller = function(option) {
        this.options = $.extend({}, typeof option === 'object' && option);
        $('[data-toggle="scroller"],.content').scroller(option);
    };
    //获取scroller对象
    $.getScroller = function(content) {
        //以前默认只能有一个无限滚动，因此infinitescroll都是加在content上，现在允许里面有多个，因此要判断父元素是否有content
        content = content.hasClass('content') ? content : content.parents('.content');
        if (content) {
            return $(content).data('scroller');
        } else {
            return $('.content.javascript-scroll').data('scroller');
        }
    };
    //检测滚动类型,
    //‘js’: javascript 滚动条
    //‘native’: 原生滚动条
    $.detectScrollerType = function(content) {
        if (content) {
            if ($(content).data('scroller') && $(content).data('scroller').scroller) {
                return 'js';
            } else {
                return 'native';
            }
        }
    };

}(Zepto);

+function ($) {
    "use strict";
    $(function() {
        $(document).on("focus", ".searchbar input", function(e) {
            var $input = $(e.target);
            $input.parents(".searchbar").addClass("searchbar-active");
        });
        $(document).on("click", ".searchbar-cancel", function(e) {
            var $btn = $(e.target);
            $btn.parents(".searchbar").removeClass("searchbar-active");
        });
        $(document).on("blur", ".searchbar input", function(e) {
            var $input = $(e.target);
            $input.parents(".searchbar").removeClass("searchbar-active");
        });
    });
}(Zepto);

/*===============================================================================
************   Shake   ************
===============================================================================*/
/* global Zepto:true */
+ function($) {
	"use strict";
	$.shake = function() {
		if (window.DeviceMotionEvent) {
			//获取移动速度，得到device移动时相对之前某个时间的差值比
			window.addEventListener('devicemotion', deviceMotionHandler, false);
		} else {
			alert('您好，你目前所用的设备好像不支持重力感应哦！');
		}

		//设置临界值,这个值可根据自己的需求进行设定，默认就3000也差不多了
		var shakeThreshold = 400;
		//设置最后更新时间，用于对比
		var lastUpdate = 0;
		//设置位置速率
		var curShakeX,curShakeY,curShakeZ,lastShakeX,lastShakeY,lastShakeZ = 0;

		function deviceMotionHandler(event) {
			//获得重力加速
			var acceleration = event.accelerationIncludingGravity;

			//获得当前时间戳
			var curTime = new Date().getTime();

			if ((curTime - lastUpdate) > 100) {

				//时间差
				var diffTime = curTime - lastUpdate;
				lastUpdate = curTime;


				//x轴加速度
				curShakeX = acceleration.x;
				//y轴加速度
				curShakeY = acceleration.y;
				//z轴加速度
				curShakeZ = acceleration.z;

				var speed = Math.abs(curShakeX + curShakeY + curShakeZ - lastShakeX - lastShakeY - lastShakeZ) / diffTime * 10000;

				if (speed > shakeThreshold) {
					alert("正在摇")
					//TODO 相关方法，比如：

					//播放音效
					//shakeAudio.play();
					//播放动画
					// $('.shake_box').addClass('shake_box_focus');
					// clearTimeout(shakeTimeout);
					// var shakeTimeout = setTimeout(function() {
					// 	$('.shake_box').removeClass('shake_box_focus');
					// }, 1000)

				}

				lastShakeX = curShakeX;
				lastShakeY = curShakeY;
				lastShakeZ = curShakeZ;
			}
		}

		//预加摇一摇声音
		// var shakeAudio = new Audio();
		// shakeAudio.src = 'sound/shake_sound.mp3';
		// var shake_options = {
		// 	preload: 'auto'
		// }
		// for (var key in shake_options) {
		// 	if (shake_options.hasOwnProperty(key) && (key in shakeAudio)) {
		// 		shakeAudio[key] = shake_options[key];
		// 	}
		// }

	};
}(Zepto);
/*===============================================================================
************   SlideNav   ************
===============================================================================*/
/* global Zepto:true */
+ function($) {
	"use strict";
	$.fn.sliderNav = function(options) {
		$(".indexlist-navitem").bind("touchstart", function(event) {
			var target = $(this).text();
			scrollToTarget(target.toLowerCase());
			$.toast(target, 2000, "hint");
		});
		var currentTarget = "";
		$(".indexlist-navlist").bind("touchmove", function(event) {
			event.preventDefault();
			var element = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
			if (!!element&&element.getAttribute("class")=="indexlist-navitem") {
				var target = element.innerHTML;
				if (target != currentTarget) {
					scrollToTarget(target.toLowerCase());
					var $toast = $('<div class="modal toast hint">' + target + '</div>').appendTo(document.body);
					$.openModal($toast);
				}
				currentTarget = target;
				$(".indexlist-navitem").bind("touchend", function(event) {
					$(".hint").remove();
				});
			} else {
                return ;
			}


		});

		function scrollToTarget(target) {
			var offset = $('li[name="' + target + '"]').closest(".list-group").position().top;
			$('.list-index-list').scrollTop($('.list-index-list').scrollTop() + offset);
		}



	}
}(Zepto);
/*===============================================================================
************   Sortable   ************
===============================================================================*/
+function ($) {
    "use strict";

    $.sortableToggle = function (sortableContainer) {
        sortableContainer = $(sortableContainer);
        if (sortableContainer.length === 0) sortableContainer = $('.list-block.sortable');
        sortableContainer.toggleClass('sortable-opened');
        if (sortableContainer.hasClass('sortable-opened')) {
            sortableContainer.trigger('open');
        }
        else {
            sortableContainer.trigger('close');
        }
        return sortableContainer;
    };
    $.sortableOpen = function (sortableContainer) {
        sortableContainer = $(sortableContainer);
        if (sortableContainer.length === 0) sortableContainer = $('.list-block.sortable');
        sortableContainer.addClass('sortable-opened');
        sortableContainer.trigger('open');
        return sortableContainer;
    };
    $.sortableClose = function (sortableContainer) {
        sortableContainer = $(sortableContainer);
        if (sortableContainer.length === 0) sortableContainer = $('.list-block.sortable');
        sortableContainer.removeClass('sortable-opened');
        sortableContainer.trigger('close');
        return sortableContainer;
    };
    $.initSortable = function () {
        var isTouched, isMoved, touchStartY, touchesDiff, sortingEl, sortingElHeight, sortingItems, minTop, maxTop, insertAfter, insertBefore, sortableContainer;

        function handleTouchStart(e) {
            isMoved = false;
            isTouched = true;
            touchStartY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            /*jshint validthis:true */
            sortingEl = $(this).parent();
            sortingItems = sortingEl.parent().find('li');
            sortableContainer = sortingEl.parents('.sortable');
            e.preventDefault();
            $.allowPanelOpen = $.allowSwipeout = false;
        }
        function handleTouchMove(e) {
            if (!isTouched || !sortingEl) return;
            //var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            if (!isMoved) {
                sortingEl.addClass('sorting');
                sortableContainer.addClass('sortable-sorting');
                minTop = sortingEl[0].offsetTop;
                maxTop = sortingEl.parent().height() - sortingEl[0].offsetTop - sortingEl.height();
                sortingElHeight = sortingEl[0].offsetHeight;
            }
            isMoved = true;

            e.preventDefault();
            e.f7PreventPanelSwipe = true;
            touchesDiff = pageY - touchStartY;
            var translate = touchesDiff;
            if (translate < -minTop) translate = -minTop;
            if (translate > maxTop) translate = maxTop;
            sortingEl.transform('translate3d(0,' + translate + 'px,0)');

            insertBefore = insertAfter = undefined;

            sortingItems.each(function () {
                var currentEl = $(this);
                if (currentEl[0] === sortingEl[0]) return;
                var currentElOffset = currentEl[0].offsetTop;
                var currentElHeight = currentEl.height();
                var sortingElOffset = sortingEl[0].offsetTop + translate;

                if ((sortingElOffset >= currentElOffset - currentElHeight / 2) && sortingEl.index() < currentEl.index()) {
                    currentEl.transform('translate3d(0, '+(-sortingElHeight)+'px,0)');
                    insertAfter = currentEl;
                    insertBefore = undefined;
                }
                else if ((sortingElOffset <= currentElOffset + currentElHeight / 2) && sortingEl.index() > currentEl.index()) {
                    currentEl.transform('translate3d(0, '+(sortingElHeight)+'px,0)');
                    insertAfter = undefined;
                    if (!insertBefore) insertBefore = currentEl;
                }
                else {
                    $(this).transform('translate3d(0, 0%,0)');
                }
            });
        }
        function handleTouchEnd(e) {
            $.allowPanelOpen = $.allowSwipeout = true;
            if (!isTouched || !isMoved) {
                isTouched = false;
                isMoved = false;
                return;
            }
            e.preventDefault();
            sortingItems.transform('');
            sortingEl.removeClass('sorting');
            sortableContainer.removeClass('sortable-sorting');
            var virtualList, oldIndex, newIndex;
            if (insertAfter) {
                sortingEl.insertAfter(insertAfter);
                sortingEl.trigger('sort');
            }
            if (insertBefore) {
                sortingEl.insertBefore(insertBefore);
                sortingEl.trigger('sort');
            }
            if ((insertAfter || insertBefore) && sortableContainer.hasClass('virtual-list')) {
                virtualList = sortableContainer[0].f7VirtualList;
                oldIndex = sortingEl[0].f7VirtualListIndex;
                newIndex = insertBefore ? insertBefore[0].f7VirtualListIndex : insertAfter[0].f7VirtualListIndex;
                if (virtualList) virtualList.moveItem(oldIndex, newIndex);
            }
            insertAfter = insertBefore = undefined;
            isTouched = false;
            isMoved = false;
        }
        $(document).on($.touchEvents.start, '.list-block.sortable .sortable-handler', handleTouchStart);
        if ($.support.touch) {
            $(document).on($.touchEvents.move, '.list-block.sortable .sortable-handler', handleTouchMove);
            $(document).on($.touchEvents.end, '.list-block.sortable .sortable-handler', handleTouchEnd);
        }
        else {
            $(document).on($.touchEvents.move, handleTouchMove);
            $(document).on($.touchEvents.end, handleTouchEnd);
        }

    };

    $(document).on("click", ".toggle-sortable, .open-sortable, .close-sortable", function(e) {
        e.preventDefault();
        var clicked = $(this);
        // Collect Clicked data- attributes
        var clickedData = clicked.dataset();
        // Sortable
        if (clicked.hasClass('toggle-sortable')) {
            $.sortableToggle(clickedData.sortable);
        }
        if (clicked.hasClass('open-sortable')) {
            $.sortableOpen(clickedData.sortable);
        }
        if (clicked.hasClass('close-sortable')) {
            $.sortableClose(clickedData.sortable);
        }
    });

}(Zepto);

+function($){
    'use strict';
    $.Swiper.prototype.defaults.pagination = '.page-current .swiper-pagination';

    $.swiper = function (container, params) {
        return new $.Swiper(container, params);
    };
    $.fn.swiper = function (params) {
        return new $.Swiper(this, params);
    };
    $.initSwiper = function (pageContainer) {
        var page = $(pageContainer || document.body);
        var swipers = page.find('.swiper-container');
        if (swipers.length === 0) return;
        function destroySwiperOnRemove(slider) {
            function destroySwiper() {
                slider.destroy();
                page.off('pageBeforeRemove', destroySwiper);
            }
            page.on('pageBeforeRemove', destroySwiper);
        }
        for (var i = 0; i < swipers.length; i++) {
            var swiper = swipers.eq(i);
            var params;
            if (swiper.data('swiper')) {
                swiper.data("swiper").update(true);
                continue;
            }
            else {
                params = swiper.dataset();
            }
            var _slider = $.swiper(swiper[0], params);
            destroySwiperOnRemove(_slider);
        }
    };
    $.reinitSwiper = function (pageContainer) {
        var page = $(pageContainer || '.page-current');
        var sliders = page.find('.swiper-container');
        if (sliders.length === 0) return;
        for (var i = 0; i < sliders.length; i++) {
            var sliderInstance = sliders[0].swiper;
            if (sliderInstance) {
                sliderInstance.update(true);
            }
        }
    };

}(Zepto);

/* ===============================================================================
************   Tabs   ************
=============================================================================== */
+function ($) {
    "use strict";

    var showTab = function (tab, tabLink, force) {
        var newTab = $(tab);
        if (arguments.length === 2) {
            if (typeof tabLink === 'boolean') {
                force = tabLink;
            }
        }
        if (newTab.length === 0) return false;
        if (newTab.hasClass('active')) {
            if (force) newTab.trigger('show');
            return false;
        }
        var tabs = newTab.parent('.tabs');
        if (tabs.length === 0) return false;

        // Animated tabs
        /*var isAnimatedTabs = tabs.parent().hasClass('tabs-animated-wrap');
          if (isAnimatedTabs) {
          tabs.transform('translate3d(' + -newTab.index() * 100 + '%,0,0)');
          }*/

        // Remove active class from old tabs
        var oldTab = tabs.children('.tab.active').removeClass('active');
        // Add active class to new tab
        newTab.addClass('active');
        // Trigger 'show' event on new tab
        newTab.trigger('show');

        // Update navbars in new tab
        /*if (!isAnimatedTabs && newTab.find('.navbar').length > 0) {
        // Find tab's view
        var viewContainer;
        if (newTab.hasClass(app.params.viewClass)) viewContainer = newTab[0];
        else viewContainer = newTab.parents('.' + app.params.viewClass)[0];
        app.sizeNavbars(viewContainer);
        }*/

        // Find related link for new tab
        if (tabLink) tabLink = $(tabLink);
        else {
            // Search by id
            if (typeof tab === 'string') tabLink = $('.tab-link[href="' + tab + '"]');
            else tabLink = $('.tab-link[href="#' + newTab.attr('id') + '"]');
            // Search by data-tab
            if (!tabLink || tabLink && tabLink.length === 0) {
                $('[data-tab]').each(function () {
                    if (newTab.is($(this).attr('data-tab'))) tabLink = $(this);
                });
            }
        }
        if (tabLink.length === 0) return;

        // Find related link for old tab
        var oldTabLink;
        if (oldTab && oldTab.length > 0) {
            // Search by id
            var oldTabId = oldTab.attr('id');
            if (oldTabId) oldTabLink = $('.tab-link[href="#' + oldTabId + '"]');
            // Search by data-tab
            if (!oldTabLink || oldTabLink && oldTabLink.length === 0) {
                $('[data-tab]').each(function () {
                    if (oldTab.is($(this).attr('data-tab'))) oldTabLink = $(this);
                });
            }
        }

        // Update links' classes
        if (tabLink && tabLink.length > 0) tabLink.addClass('active');
        if (oldTabLink && oldTabLink.length > 0) oldTabLink.removeClass('active');
        tabLink.trigger('active');

        //app.refreshScroller();

        return true;
    };

    var old = $.showTab;
    $.showTab = showTab;

    $.showTab.noConflict = function () {
        $.showTab = old;
        return this;
    };
    //a标签上的click事件，在iscroll下响应有问题
    $(document).on("click", ".tab-link", function(e) {
        e.preventDefault();
        var clicked = $(this);
        showTab(clicked.data("tab") || clicked.attr('href'), clicked);
    });


}(Zepto);
