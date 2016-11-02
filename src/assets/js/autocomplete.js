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