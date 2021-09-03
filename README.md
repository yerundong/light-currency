## 介绍

这是一个轻量的处理货币的js库。

#### #特性

* 压缩之后文件大小约为3kb
* 支持将数字格式化成货币格式字符串
* 支持将货币格式字符串解析成数字
* 支持链式操作
* 支持拓展实例方法，丰富对货币的操作（比如货币的数学运算）

## 安装

#### #npm

```cmd
npm i light-currency -S
```

```js
import Currency from 'light-currency'
const Currency = require('light-currency')
```

#### script

<script src="./light-currency.min.js"></script>

## 用法

Currency接受数字、字符串类型数据作为值。

```
new Currency(1000);// 1000
new Currency('1000');// 1000
```

JS 对 Number 类型的数字有数位限制，数位过多可能造成精度丢失，所以**大数位数字推荐使用 String 类型的值**。

```
new Currency(123456789123456789);// 123456789123456780
new Currency("123456789123456789");// "123456789123456789"
```



### 创建实例

`new Currency(value [, config])`

`Currency.getInstance(value [, config])`

构造器和Currency.getInstance()支持解析**数字（1000）、字符串类型数字（"1000"）、常规货币格式的字符串类型数字（"$1,000"）**。

config 参数用以覆盖实例的 config 选项，实例的 config 的默认值来自于静态 config（Currency.config）

如果需要解析**特殊货币格式的字符串类型数字**，则使用Currency.parse()，并传入对应格式的config，详见[解析](### 解析)。

```js
const cry1 = new Currency('123456789.123456789')
const cry2 = Currency.getInstance('123456789.123456789')
const cry3 = Currency.parse('123456789.123456789')
```



### 格式化

`cry.format(value [, config])`

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



### 配置

Currency.config 为静态配置，也是实例配置的默认值，配置项：

- prefix	前缀
- decimalSeparator	小数符号
- groupSeparator	数位分隔符
- groupSize	数位分隔组的个数，默认每3位分隔，即千位分隔法
- suffix	后缀

Currency.config默认值为：

```js
{
    prefix: '$', 
    decimalSeparator: '.', 
    groupSeparator: ',', 
    groupSize: 3, 
    suffix: ''
}
```

设置静态配置：

```
Currency.setConfig({
	prefix: '￥'
})
```

设置实例配置：

```
const cry = new Currency('123456789.123456789')
cry.setConfig({
	prefix: '￥'
})
```



### 实例值

- `number` number值，Number类型
- `value` 精确值，String类型

注意：JS 对 Number 类型的数字有数位限制，数位过多可能造成精度丢失，所以大数位数字推荐使用 String 类型的 value。

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

设置实例的值：

```
const cry = new Currency('1000')
cry.setValue('2000')
cry.value;// 2000

// 返回原实例，支持链式写法：
cry.setValue('3000').format();
```



### 解析

`Currency.parse(value [, config]）`

支持将任意格式的货币字符串解析成数字，返回实例



value 如果是常规格式货币值，则不需要传入 config 也可解析：

```
Currency.parse('€123,456.123456').value;// 123456.123456
```

value 如果是非常规格式货币值，则需要传入对应格式的 config 解析：

```
Currency.parse('€123,456*123456', {
    decimalSeparator: '*', 
}).value;// 123456.123456
```



### 拓展

`Currency.extend(methodName, handler)`

支持拓展实例方法，丰富对货币的操作性。

为了保持 light-currency 的纯粹性和轻量性，作者并没有将数学运算包含在其中，如果需要，可通过拓展方法添加数学运算方法。

比如，将 [decimal.js](https://github.com/MikeMcl/decimal.js) 数学库中的 `add` 和 `toFixed` 方法添加如实例方法中：

```
import Decimal from 'decimal.js'
import Currency from 'light-currency'

const add = Decimal.add.bind(Decimal)
const toFixed = (value, dp, rm) => new Decimal(value).toFixed(dp, rm).valueOf()

Currency.extend('add', function(value){
	return this.setValue(add(this.value, value).valueOf())
})

Currency.extend('toFixed', function(dp){
	return this.setValue(toFixed(this.value, dp))
})

new Currency('123.456').toFixed(2).value;// '123.46'
new Currency('0.1').add('0.2').value;// '0.3'

```

