/**
 * light-currency - v1.0.33
 * https://github.com/yerundong/light-currency.git
 * 
 * Copyright (c) 2021 yerundong
 * Released under MIT license
 */

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var Currency = /*#__PURE__*/function () {
  /**
   * constructor
   * @param {Number, String} value
   * @param {Object} config
   */
  function Currency(value, config) {
    _classCallCheck(this, Currency);

    var parseObj = _parse(value);

    this.number = parseObj.number;
    this.value = parseObj.value;
    this.isNaN = parseObj.isNaN;
    /**
     * Set the config of the instance
     * config here takes precedence over Currency.config
     */

    this.config = Object.assign({}, Currency.config, config);
  }
  /**
   * Static config
   * It is the default config for each instance
   * Modify through currency. Setconfig()
   */


  _createClass(Currency, [{
    key: "setConfig",
    value:
    /**
     * Set the config of the instance
     * @param {Object} config
     * @returns instance
     */
    function setConfig(config) {
      Object.assign(this.config, config);
      return this;
    }
    /**
     * Set the new value of the instance
     * @param {Number, String} value
     * @returns instance
     */

  }, {
    key: "setValue",
    value: function setValue(value) {
      var parseObj = _parse(value);

      this.number = parseObj.number;
      this.value = parseObj.value;
      this.isNaN = parseObj.isNaN;
      return this;
    }
    /**
     * Format numbers as currency strings
     * @param {Object} config
     */

  }, {
    key: "format",
    value: function format(config) {
      var config_ = Object.assign({}, this.config, config);
      var prefix = config_.prefix,
          decimalSeparator = config_.decimalSeparator,
          groupSeparator = config_.groupSeparator,
          groupSize = config_.groupSize,
          suffix = config_.suffix;
      var sign = '',
          ev = this.value;

      if (/^-/.test(ev)) {
        sign = '-';
        ev = ev.replace(/^-/, '');
      }

      if (/\d/g.test(ev)) {
        // Number of numeric type
        var arr = ev.split('.');
        var intStr = arr[0];
        var decStr = arr[1];
        var intArr = intStr.split('').reverse();
        var spArr = [];

        for (var i = groupSize; i < intArr.length; i += groupSize) {
          spArr.push(i);
        }

        for (var _i = 0; _i < spArr.length; _i++) {
          var indx = spArr[_i] + _i;
          intArr.splice(indx, 0, groupSeparator);
        }

        var intStr_ = intArr.reverse().join('');

        if (decStr) {
          return "".concat(sign).concat(prefix).concat(intStr_).concat(decimalSeparator).concat(decStr).concat(suffix);
        } else {
          return "".concat(sign).concat(prefix).concat(intStr_).concat(suffix);
        }
      } else {
        // Alphanumeric, such as infinity
        return "".concat(sign).concat(prefix).concat(ev).concat(suffix);
      }
    }
    /**
     * Set static config
     * @param {Object} config
     * @returns Currency
     */

  }], [{
    key: "setConfig",
    value: function setConfig(config) {
      Object.assign(Currency.config, config);
      return Currency;
    }
    /**
     * Get instance
     * @param {Number, String} value
     * @param {Object} config
     * @returns
     */

  }, {
    key: "getInstance",
    value: function getInstance(value, config) {
      return new Currency(value, config);
    }
    /**
     * Parses a value in a specific format into a number
     * @param {Number, String} value
     * @param {Object} config Parsing rules; If undefined, only the regular amount format (such as $100000.00) can be parsed
     * @returns instance（with static config）
     * P.S: the string of special numeric constants, such as' number. Max ', cannot be parsed_ Value ',' math. Pi ', etc
     */

  }, {
    key: "parse",
    value: function parse(value, config) {
      return new Currency(_parse(value, config).value);
    }
    /**
     * Extended an instance method or an plugin(a collection of several instance methods)
     * @param { Object | Array } options
     */

  }, {
    key: "extend",
    value: function extend(options) {
      var type = getType(options);

      if (type === 'Object') {
        var name = options.name,
            handler = options.handler;

        Currency.prototype[name] = function () {
          for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
          }

          return handler.apply(this, params);
        };
      } else if (type === 'Array') {
        var _loop = function _loop(i, item) {
          var name = item.name,
              handler = item.handler;

          Currency.prototype[name] = function () {
            for (var _len2 = arguments.length, params = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              params[_key2] = arguments[_key2];
            }

            return handler.apply(this, params);
          };
        };

        for (var i = 0, item; item = options[i]; i++) {
          _loop(i, item);
        }
      }
    }
  }]);

  return Currency;
}();

_defineProperty(Currency, "config", {
  prefix: '$',
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
  suffix: ''
});

function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

function isLikeNumber(value) {
  if (!['String', 'Number'].includes(getType(value))) return false;
  if (value === '') return false;
  var value_ = Number(value);
  if (Number.isNaN(value_)) return false;
  return true;
}
/**
 * parse
 * @param {Number, String} value
 * @param {Object} config
 */


function _parse(value, config) {
  var type = getType(value);
  var parseObj = {
    number: null,
    value: null,
    isNaN: null
  };

  if (type === 'Number') {
    parseObj.number = value;

    if (Object.is(value, -0)) {
      // -0 is handled separately because -0.tostring() is' 0 '
      parseObj.value = '-0';
    } else {
      parseObj.value = value.toString();
    }
  } else if (type === 'String') {
    var obj = strValParse(value, config);
    parseObj.number = obj.number;
    parseObj.value = obj.value;
  } else {
    parseObj.number = NaN;
    parseObj.value = 'NaN';
  }

  parseObj.isNaN = Number.isNaN(parseObj.number);
  return parseObj;
}
/**
 * Parse string
 * @param {String} value
 * @param {Object} config
 */


function strValParse(value) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var value_,
      isInfinity = /Infinity/.test(value); // Exclude infinity

  if (isInfinity) {
    if (/-.*(?=Infinity)/.test(value)) {
      return {
        number: -Infinity,
        value: '-Infinity'
      };
    } else {
      return {
        number: Infinity,
        value: 'Infinity'
      };
    }
  }

  var ds = config.decimalSeparator || '.';
  var reg_1 = new RegExp("[^\\d\\".concat(ds, "-]|\\").concat(ds, "(?=.*\\").concat(ds, ")"), 'g');
  var reg_2 = new RegExp("\\".concat(ds), 'g');
  value_ = value.replace(reg_1, '').replace(reg_2, '.');
  var sign = /^-/.test(value_) ? '-' : '';
  value_ = value_.replace(/-/g, '');

  if (!isLikeNumber(value_)) {
    return {
      number: NaN,
      value: 'NaN'
    };
  }

  value_ = value_.replace(/^0+(?=.)|\.+$/g, '').replace(/^\.+/, '0.');
  value_ = sign + value_;
  return {
    number: Number(value_),
    value: value_
  };
}

export { Currency as default };
