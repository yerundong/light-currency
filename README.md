English | [简体中文](./docs/zh-cn/README.md) 

This is a lightweight JavaScript tool class for handling currency.

It aims to solve the problems of currency format and the most basic accuracy.

# Features

- 0 dependencies

* After compression, the file size is about 3KB
* Supports formatting numbers into strings in currency format
* Supports parsing strings in currency format into numbers
* Support chain operation
* Supports expanding instance methods and using plugins to enrich currency operations (such as mathematical operations)

[The sky is a little dark, please light up this star😁](https://github.com/yerundong/light-currency)

# Install

- npm

```cmd
npm i -S light-currency
```

```js
import Currency from 'light-currency'
// or
const Currency = require('light-currency')
```

- script

```js
<script src="./light-currency.min.js"></script
```



# Fast Start

The Currency class accepts Number or String data as constructor parameters.

```
new Currency(1000);// 1000
new Currency('1000');// 1000
```

Js limits the number of digits of Number type. Too many digits may cause precision loss, so * * String type value is recommended for large digits * *.

```
new Currency(123456789123456789);// 123456789123456780
new Currency("123456789123456789");// "123456789123456789"
```

Format operation(see[Format](###Format))：

```js
new Currency(10000).format();// $10,000

new Currency(10000, {
    prefix: '￥', 
    groupSize: 4, 
}).format();// ￥1,0000

new Currency(10000).format({
    prefix: '￥', 
    groupSize: 4, 
});// ￥1,0000
```

Parsing operation(see[Parse](###Parse))：

```js
// Parsing ordinary format
new Currency('$1,000,000').value;// '1000000'
Currency.parse('$1,000,000.12').value;// '1000000.12'

// Parsing special format, need to pass in the config
Currency.parse('$1,000,000*12', {
    decimalSeparator: '*', 
}).value;// '1000000.12'
```

Mathematical operation(Need to load the plugin: light-currency-plugin-math ，see[Extension and plugin](###Extension and plugin))：

```js
new Currency('1000').add('1000').sub(500).value;// 1500
```

Rounding operation(Need to load the plugin: light-currency-plugin-math，see[Extension and plugin](###Extension and plugin))：

```js
new Currency('1000.456').toFixed(2).value;// 1000.46
new Currency('1000').toFixed(2).value;// 1000.00
new Currency('1000.456').toDP(2).value;// 1000.46
new Currency('1000').toDP(2).value;// 1000
```



# Create Instance

- Method
  - Using constructor：`new Currency(value [, config])`
  - Using static method：`Currency.getInstance(value [, config])`

- Parameters

  - value：{Number|String}，support  Number type (1000), String type number ("1000"), String type number in common currency format ("$1000") .

  - config：{Object}，It is used to set the formatting configuration of the instance. If it is not passed in, it defaults to static configuration，see[Format configuration](###Format configuration)

- return

  {Currency}，Return the Currency instance
  
  ```js
  const cry1 = new Currency('123456789.123456789')
  const cry2 = Currency.getInstance('123456789.123456789')
  ```
  
  

# Format

- Method

  `cry.format([config])`

- Parameters

  config：{Object}，it is Instant format configuration， If it is not passed in,  it defaults to the current instance configuration，see[Format configuration](###Format configuration)

- return
  {String}，returns a string in amount format
  
- Example

  ```js
  const cry = new Currency('123456789.123456789')
  
  const foo = cry.format();// '$123,456,789.123456789'
  
  const bar = cry.format({
  	prefix: '￥',
      groupSize: 4
  });// '￥1,2345,6789.123456789'
  
  cry.setConfig({
      prefix: '€',
      groupSize: 3
  }).format();// '€123,456,789.123456789'
  ```



# Format Configuration

Config is a configuration item object for formatting，the item is：

- prefix	
- decimalSeparator
- groupSeparator
- groupSize
- suffix



The light-currency provides three formatting configurations for more flexibility.

 three formatting configurations：

- Static Configuration(Currency.config)
- Instance Configuration(cry.config)
- Instant Configuration(format(config))

When executing the format method, config takes precedence in the following order: Instant Configuration > Instance Configuration > Static Configuration



**Static Configuration：**

Static configuration is stored under Currency.config.

The default value for static configuration is:

```js
{
    prefix: '$', 
    decimalSeparator: '.', 
    groupSeparator: ',', 
    groupSize: 3, 
    suffix: ''
}
```

Modify the static configuration through the static method `setConfig`:

```
Currency.setConfig({
	prefix: '￥',
	 groupSize: 4, 
})
```

If instance configuration and instant configuration are not set, the formatting follows the static configuration rules:

```js
Currency.setConfig({
	prefix: '￥',
	 groupSize: 4, 
}).getInstance('10000').format();// ￥1,0000
```



**Instance Configuration：**

Instance Configuration is stored under cry.config

Modify the instance configuration through instantiating and passing in parameters:

```
const cry = new Currency('10000', {
	prefix: '￥',
	 groupSize: 4, 
})
cry.format();// ￥1,0000
```

can also use the instance method `setconfig `to set:

```js
const cry = new Currency('10000')
cry.setConfig({
	prefix: '￥',
	 groupSize: 4, 
})
cry.format();// ￥1,0000
```



**Instant Configuration：**

Instant configuration is passed in through the parameters of the `format ` method and disappears when used up. Instance configuration and static configuration are not modified. The priority is the highest.

```js
const cry = new Currency('10000');

cry.format({
	prefix: '￥',
	 groupSize: 4, 
});// ￥1,0000

cry.format();// $10,000
```



# Amount Value

### Get Amount Value

- number：{Number}，Numerical value
- value：{String}，Exact value

**P.S. both value and number are used to store the amount value of the instance, but Js limits the number of digits. Too many digits may cause loss of precision. Therefore, String type value is recommended for large digits.**

```
const cry = new Currency('1000')
cry.number;// 1000
cry.value;// '1000'
```

```
const cry = new Currency("123456789123456789.123456789")
cry.number;// 123456789123456780 (Lost accuracy)
cry.value;// "123456789123456789.123456789"
```

### Set Amount Value：

- Method

  `setValue(value)`

- Parameters

  value：{Number|String}，This parameter is consistent with the value of the construction instance，support  Number type (1000), String type number ("1000"), String type number in common currency format ("$1000") .

- Return

  {Currency}，Returns the original instance of the modified value

- Example

```
const cry = new Currency('1000')
cry.setValue('2000')
cry.value;// '2000'
```



# Parse

- Method

  `Currency.parse(value [, config])`

  The parse method supports parsing a currency string in any format into a number and returning an instance

- Parameters

  value：{Number|String}，support  Number type (1000), String type number ("1000"), String type number in currency format ("$1000.00") .

  config：{Object}，The configuration rule followed by value. If value is a Number type (1000) or a String type in common currency format ("$1000"), there is no need to pass the config parameter.

- Return

  {Currency}，Returns the currency instance of the parsed value

- Example

  - If value is a currency value in common format, it can be parsed without passing in config:

    ```js
    Currency.parse('€123,456.123456').value;// 123456.123456
    ```

  - If value is a currency value in unconventional format, you need to pass in the config resolution of the corresponding format:

    ```js
    Currency.parse('€123,456*123456', {
        decimalSeparator: '*', 
    }).value;// 123456.123456
    ```



# Extension And Plugin

Through the extend method, you can freely add more personalized instance methods to enrich the operability of currency.

- Method

  `Currency.extend(options)`

- Parameters

  options： {Object | Array}，If options is Object type, add a single instance method; if Array type, add multiple instance methods (that is using plugin)

  - The options is the object type:

    ```js
    {
        name: 'methodName',
        handler(){
            // The 'this' points to the Currency instance
            ...
        }
    }
    ```

  - The options is the Array type:

    ```js
    [{
        name: 'methodName1',
        handler(){
            // The 'this' points to the Currency instance
            ...
        }
    },{
        name: 'methodName2',
        handler(){
     		// The 'this' points to the Currency instance
            ...
        }
    }]
    ```

- Return

  return：null

- Example

  Add an instance method of exchange rate conversion:

  ```js
  Currency.extend({
  	name: 'exchangeRate',
  	handler(rate){
  		return this.setValue(this.number * rate)
  	}
  })
  
  new Currency(100).exchangeRate(6.45).value;// '645'
  ```

  

P.S.In order to maintain the purity and lightness of the light-currency, the author does not include mathematical operations. If necessary, these methods can be added through extend methods.

The author has encapsulated the commonly used mathematical operation,rounding operation and other methods into the plugin [light-currency-plugin-math](https://www.npmjs.com/package/light-currency-plugin-math), which solves the accuracy problem of Js mathematical operation. The usage is as follows:

```js
npm i -S light-currency-plugin-math
import Currency from '@/cry/light-currency'
import lightCurrencyPluginMath from 'light-currency-plugin-math'

Currency.extend(lightCurrencyPluginMath)
new Currency('10').add('10').sub('5').value;// 15

// accuracy problem
1.1+0.1;// 1.2000000000000002
new Currency(1.1).add(0.1).number;// 1.2

// rounding operation
1.0005.toFixed(3);// '1.000'
new Currency(1.0005).toFixed(3).value;// '1.001'
new Currency(1).toFixed(3).value;// '1.000'
new Currency(1.0005).toDP(3).value;// // '1.001'
new Currency(1).toDP(3).value;// // '1'
```

For details, please see [light-currency-plugin-math](https://www.npmjs.com/package/light-currency-plugin-math).

