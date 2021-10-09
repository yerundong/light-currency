 [English](../../README.md)  |简体中文

这是一个轻量的处理货币的Javascript的工具类。

它志在解决Js相关的货币格式、以及最基本的精度问题。

# 特性

* 压缩之后文件大小约为3kb
* 支持将数字格式化成货币格式字符串
* 支持将货币格式字符串解析成数字
* 支持链式操作
* 支持拓展实例方法和使用插件，丰富对货币的操作（比如货币的数学运算）

[如果它对你有帮助，请帮忙点亮一颗星星，谢谢~](https://github.com/yerundong/light-currency)

# 安装

### npm

```cmd
npm i -S light-currency
```

```js
import Currency from 'light-currency'
// or
const Currency = require('light-currency')
```

### script

```js
<script src="./light-currency.min.js"></script
```



# 快速起步

Currency接受数字、字符串类型数据作为构造器的值。

```
new Currency(1000);// 1000
new Currency('1000');// 1000
```

Js 对 Number 类型的数字有数位限制，数位过多可能造成精度丢失，所以**大数位数字推荐使用 String 类型的值**。

```
new Currency(123456789123456789);// 123456789123456780
new Currency("123456789123456789");// "123456789123456789"
```

格式化操作（详见[格式化](###格式化)）：

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

解析操作（详见[解析](###解析)）：

```js
// 寻常格式解析
new Currency('$1,000,000').value;// '1000000'
Currency.parse('$1,000,000.12').value;// '1000000.12'

// 特殊格式需要使用 parse 方法，并传入对应格式
Currency.parse('$1,000,000*12', {
    decimalSeparator: '*', 
}).value;// '1000000.12'
```

数学运算（需要加载 light-currency-plugin-math 插件，详见[拓展与插件](###拓展与插件)）：

```js
new Currency('1000').add('1000').sub(500).value;// 1500
```

取舍操作（需要加载 light-currency-plugin-math 插件，详见[拓展与插件](###拓展与插件)）：

```js
new Currency('1000.456').toFixed(2).value;// 1000.46
new Currency('1000').toFixed(2).value;// 1000.00
new Currency('1000.456').toDP(2).value;// 1000.46
new Currency('1000').toDP(2).value;// 1000
```



# 创建实例

- 方法
  - 使用构造器：`new Currency(value [, config])`
  - 使用静态方法：`Currency.getInstance(value [, config])`

- 参数说明

  - value：{Number|String}，支持**Number类型（1000）、String类型数字（"1000"）、常规货币格式的字符串类型数字（"$1,000"）**。

  - config：{Object}，用于设置该实例的格式化配置，不传默认为静态配置，详见[格式化配置](###格式化配置)

- 返回

  return：{Currency}，返回Currency实例
  
  ```js
  const cry1 = new Currency('123456789.123456789')
  const cry2 = Currency.getInstance('123456789.123456789')
  ```
  
  

# 格式化

- 方法

  `cry.format([config])`

- 参数说明

  config：{Object}，为即时格式化配置，不传使用当前实例的格式化配置，详见[格式化配置](###格式化配置)

- 返回
  return：{String}，返回金额格式的字符串
  
- 示例

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



# 格式化配置

config 是作为格式化的配置项对象，配置项为：

- prefix	前缀
- decimalSeparator	小数符号
- groupSeparator	数位分隔符
- groupSize	数位分隔组的个数，默认每3位分隔，即千位分隔法
- suffix	后缀



light-currency 中提供**三种**格式化配置，以便更灵活的操作。

三种配置为：

- 静态配置（Currency.config）
- 实例配置（cry.config）
- 即时配置（format(config)）

执行format时，采用config的优先顺序是：即时配置 > 实例配置 > 静态配置



**静态配置：**

静态配置存放在 Currency.config 下

静态配置默认值为：

```js
{
    prefix: '$', 
    decimalSeparator: '.', 
    groupSeparator: ',', 
    groupSize: 3, 
    suffix: ''
}
```

通过静态方法 setConfig 修改静态配置：

```
Currency.setConfig({
	prefix: '￥',
	 groupSize: 4, 
})
```

若是没有设置**实例配置**和**即时配置**时，格式化操作时遵循的是**静态配置**规则：

```js
Currency.setConfig({
	prefix: '￥',
	 groupSize: 4, 
}).getInstance('10000').format();// ￥1,0000
```



**实例配置：**

实例配置存放在cry.config 下

设置实例配置通过实例化操作时传入参数：

```
const cry = new Currency('10000', {
	prefix: '￥',
	 groupSize: 4, 
})
cry.format();// ￥1,0000
```

也可以通过实例方法 setConfig 设置：

```js
const cry = new Currency('10000')
cry.setConfig({
	prefix: '￥',
	 groupSize: 4, 
})
cry.format();// ￥1,0000
```



**即时配置：**

即时配置是通过format方法的参数传入，用完即消失，不修改实例配置和静态配置，优先级是最高的。

```js
const cry = new Currency('10000');

cry.format({
	prefix: '￥',
	 groupSize: 4, 
});// ￥1,0000

cry.format();// $10,000
```



# 金额数值

#### 获取金额数值

- number：{Number}，数字数值
- value：{String}，精确数值

**注：value和number都是对实例的金额数值的储存，但Js 对 Number 类型的数字有数位限制，数位过多可能造成精度丢失，所以大数位数字推荐使用 String 类型的 value。**

```
const cry = new Currency('1000')
cry.number;// 1000
cry.value;// '1000'
```

```
const cry = new Currency("123456789123456789.123456789")
cry.number;// 123456789123456780 (精度丢失)
cry.value;// "123456789123456789.123456789"
```

#### 设置金额数值：

- 方法

  `setValue(value)`

- 参数说明

  value：{Number|String}，该参数与构造实例的值一致，支持**Number类型（1000）、String类型数字（"1000"）、常规货币格式的字符串类型数字（"$1,000"）**。

- 返回

  return：{Currency}，返回修改值后的原实例

- 示例

```
const cry = new Currency('1000')
cry.setValue('2000')
cry.value;// '2000'
```



# 解析

- 方法

  `Currency.parse(value [, config]）`

  parse方法支持将任意格式的货币字符串解析成数字，返回实例

- 参数说明

  value：{Number|String}，该参数支持**Number类型（1000）、String类型数字（"1000"）、货币格式的字符串类型数字（"$1,000.00"）**。

  config：{Object}，value所遵循的配置规则，若value 为Number类型（1000）或常规货币格式的字符串类型（"$1,000"）则不需要传config参数

- 返回

  return：{Currency}，返回解析得到的值的Currency实例

- 示例

  - value 如果是常规格式货币值，则不需要传入 config 也可解析：

    ```js
    Currency.parse('€123,456.123456').value;// 123456.123456
    ```

  - value 如果是非常规格式货币值，则需要传入对应格式的 config 解析：

    ```js
    Currency.parse('€123,456*123456', {
        decimalSeparator: '*', 
    }).value;// 123456.123456
    ```



# 拓展与插件

通过extend方法，可以自由地添加更多个性化的实例方法，丰富对货币的操作性。

- 方法

  `Currency.extend(options)`

- 参数说明

  options： {Object | Array}，options 若是Object类型时，则添加单个实例方法，若是Array类型时，则添加多个实例方法(即使用插件)

  - options 是 Object 类型格式：

    ```js
    {
        name: 'methodName',
        handler(){
            // this 指向 Currency 实例
            ...
        }
    }
    ```

  - options 是 Array 类型格式：

    ```js
    [{
        name: 'methodName1',
        handler(){
            // this 指向 Currency 实例
            ...
        }
    },{
        name: 'methodName2',
        handler(){
     		// this 指向 Currency 实例
            ...
        }
    }]
    ```

- 返回

  return：null

- 示例

  添加汇率换算的实例方法：

  ```js
  Currency.extend({
  	name: 'exchangeRate',
  	handler(rate){
  		return this.setValue(this.number * rate)
  	}
  })
  
  new Currency(100).exchangeRate(6.45).value;// '645'
  ```

  

注：为了保持 light-currency 的纯粹性和轻量性，作者并没有将数学运算等操作包含在其中，如果需要，可通过拓展方法添加这些方法。

作者已将常用数学运算、取舍操作等方法封装到[light-currency-plugin-math](https://www.npmjs.com/package/light-currency-plugin-math)插件中，该插件解决了Js数学运算的精度问题，用法如下：

```js
npm i -S light-currency-plugin-math
import Currency from '@/cry/light-currency'
import lightCurrencyPluginMath from 'light-currency-plugin-math'

Currency.extend(lightCurrencyPluginMath)
new Currency('10').add('10').sub('5').value;// 15

// 精度问题
1.1+0.1;// 1.2000000000000002
new Currency(1.1).add(0.1).number;// 1.2

// 取舍操作
1.0005.toFixed(3);// '1.000'
new Currency(1.0005).toFixed(3).value;// '1.001'
new Currency(1).toFixed(3).value;// '1.000'
new Currency(1.0005).toDP(3).value;// // '1.001'
new Currency(1).toDP(3).value;// // '1'
```

详细说明请移步[light-currency-plugin-math](https://www.npmjs.com/package/light-currency-plugin-math)。

# 许可证

[MIT License](https://github.com/yerundong/light-currency/blob/master/license)

