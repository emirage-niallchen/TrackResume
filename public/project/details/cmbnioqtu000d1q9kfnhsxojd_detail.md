---
author: Emirage NiallChen
created: 2023-11-30 08:38
 155+
tag: 日记
password: e_x&712
---
---
> If you'll not settle for anything less than your best, you will be amazed at what you can accomplish in your lives.
> — <cite>Vince Lombardi</cite>

最后修改日期： 2023-11-30 08:38
### 状态：
- [ ] ☆☆☆☆☆
- [ ] ☆☆☆☆
- [ ] ☆☆☆
- [ ] ☆☆
- [ ] ☆
categorical features  分类特征
# 闪念
# python
```python
class A(object): 
	a = 'a' 
	@staticmethod 
	def foo1(name): 
		print 'hello', name 
	def foo2(self, name): 
		print 'hello', name 
	@classmethod 
	def foo3(cls, name): 
		print 'hello', name

对于 foo1
a = A()
a.foo1('mamq') # 输出: hello mamq
A.foo1('mamq')# 输出: hello mamq
```
foo2为正常的函数，是类的实例的函数，只能通过a调用。

```python
a.foo2('mamq') # 输出: hello mamq
A.foo2('mamq') # 报错: unbound method foo2() must be called with A instance as first argument (got str instance instead)
```

foo3为类函数，cls作为第一个参数用来表示类本身. 在类方法中用到，类方法是只与类本身有关而与实例无关的方法。如下两种方法都可以正常输出。

```python
a.foo3('mamq') # 输出: hello mamq
A.foo3('mamq') # 输出: hello mamq
```
@staticmethod和@classmethod都可以直接类名.方法名()来调用，那他们有什么区别呢   从它们的使用上来看,  
@staticmethod不需要表示自身对象的self和自身类的cls参数，就跟使用函数一样。  
 @classmethod也不需要[self参数](https://www.zhihu.com/search?q=self%E5%8F%82%E6%95%B0&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A335991541%7D)，但第一个参数需要是表示自身类的[cls参数](https://www.zhihu.com/search?q=cls%E5%8F%82%E6%95%B0&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A335991541%7D)。  
 如果在@staticmethod中要调用到这个类的一些属性方法，只能直接类名.属性名或类名.方法名。  
 而@classmethod因为持有cls参数，**可以来调用类的属性，类的方法，实例化对象等，避免硬编码。**

也就是说在classmethod中可以调用类中定义的其他方法、类的属性，但staticmethod只能通过A.a调用类的属性，但无法通过在该函数[内部调用](https://www.zhihu.com/search?q=%E5%86%85%E9%83%A8%E8%B0%83%E7%94%A8&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A335991541%7D)A.foo2()。

  
  
### 偏函数
通过设定参数的默认值，可以降低函数调用的难度。
```
int('12345')
12345
```
`int()`函数还提供额外的`base`参数，默认值为`10`。如果传入`base`参数，就可以做N进制的转换：

```
>>> int('12345', base=8)
5349
>>> int('12345', 16)
74565
```
假设要转换大量的二进制字符串，每次都传入`int(x, base=2)`非常麻烦，于是，我们想到，可以定义一个`int2()`的函数，默认把`base=2`传进去：

```
def int2(x, base=2):
    return int(x, base)
```

`functools.partial`就是帮助我们创建一个偏函数的，不需要我们自己定义`int2()`，可以直接使用下面的代码创建一个新的函数`int2`：

```
>>> import functools
>>> int2 = functools.partial(int, base=2)
>>> int2('1000000')
64
```

简单总结`functools.partial`的作用就是，把一个函数的某些参数给固定住（也就是设置默认值），返回一个新的函数

当传入：

```
max2 = functools.partial(max, 10)
```

实际上会把`10`作为`*args`的一部分自动加到左边，也就是：

```
max2(5, 6, 7)
```

相当于：

```
args = (10, 5, 6, 7)
max(*args)
```
结果为`10`。

##  args  kw
*args就是就是传递一个可变参数列表给函数实参，这个参数列表的数目未知，甚至长度可以为0。下面这段代码演示了如何使用args

```python
def test_args(first, *args):
    print('Required argument: ', first)
    print(type(args))
    for v in args:
        print ('Optional argument: ', v)

test_args(1, 2, 3, 4)
```

第一个参数是必须要传入的参数，所以使用了第一个形参，而后面三个参数则作为可变参数列表传入了实参，并且是作为元组tuple来使用的。代码的运行结果如下

```cpp
Required argument:  1
<class 'tuple'>
Optional argument:  2
Optional argument:  3
Optional argument:  4
```

## **kwargs

而`**kwargs`则是将一个<mark style="background: #FF5582A6;">可变</mark>的关键字参数的字典传给函数实参，同样参数列表长度可以为0或为其他值。
```python
def test_kwargs(first, *args, **kwargs):
   print('Required argument: ', first)
   print(type(kwargs))
   for v in args:
      print ('Optional argument (args): ', v)
   for k, v in kwargs.items():
      print ('Optional argument %s (kwargs): %s' % (k, v))

test_kwargs(1, 2, 3, 4, k1=5, k2=6)
```

正如前面所说的，args类型是一个tuple，而kwargs则是一个字典dict，并且args只能位于kwargs的前面。代码的运行结果如下

```text
Required argument:  1
<class 'dict'>
Optional argument (args):  2
Optional argument (args):  3
Optional argument (args):  4
Optional argument k2 (kwargs): 6
Optional argument k1 (kwargs): 5
```



---
# mybatis count(id)   count(* )
1、COUNT(expr) ，返回SELECT语句检索的行中expr的值不为NULL的数量。结果是一个BIGINT值。  
2、如果查询结果没有命中任何记录，则返回0  
3、但是，值得注意的是，COUNT(*) 的统计结果中，会包含值为NULL的行数。

```python
create table #bla(id int,id2 int)
insert #bla values(null,null)
insert #bla values(1,null)
insert #bla values(null,1)
insert #bla values(1,null)
insert #bla values(null,1)
insert #bla values(1,null)
insert #bla values(null,null)
```


使用语句count(*),count(id),count(id2)查询结果如下：

```python
select count(*),count(id),count(id2)
from #bla
results 7 3 2
```


常量 是一个固定值，肯定不为NULL。*可以理解为查询整行，所以肯定也不为NULL，那么就只有列名的查询结果有可能是NULL了。所以， COUNT(常量) 和 COUNT(*)表示的是直接查询符合条件的数据库表的行数。而COUNT(列名)表示的是查询符合条件的列的值不为NULL的行数。

除了查询得到结果集有区别之外，COUNT(*)相比COUNT(常量) 和 COUNT(列名)来讲，COUNT(*)是SQL92定义的标准统计行数的语法，因为他是标准语法，所以MySQL数据库对他进行过很多优化。SQL92，是数据库的一个ANSI/ISO标准。


# Pandas

Pandas 是一个基于 Python 构建的专门进行数据操作和分析的开源软件库，可提供数据结构和运算。
Pandas 为热门编程语言赋予了处理类似电子表格的数据的能力

加快了加载、对齐、操作和合并的速度。

“Pandas”的名称源自计量经济学术语“panel data”

用于描述包含多个时间段观察结果的数据集。

它已跻身于最热门、广泛使用的数据整理工具之列

Pandas 的优势在于可轻松处理表格、矩阵和时间序列数据等结构化数据格式。

对 [R](https://www.r-project.org/) 编程语言熟悉的数据科学家和编程人员都知道，可以使用 DataFrame 将数据存储在易于概述的网格中。这表明 Pandas 主要用于 DataFrame 形式的机器学习。

Pandas 支持导入和导出不同格式的表格数据，如 CSV 或 JSON 文件。
此外，Pandas 还支持各种数据操作运算和数据清理功能，包括选择子集、创建衍生列、排序、连接、填充、替换、汇总统计数据和绘图。

- 可轻松将其他 Python 和 Numpy 数据结构中参差不齐、索引不同的数据转换为 DataFrame 对象

 Pandas 是基于 [Python](https://www.python.org/) 编程语言构建的

#### GPU 加速的 DataFrames
CPU 由专为按序串行处理优化的几个核心组成，而 GPU 则拥有一个大规模并行架构，当中包含数千个更小、更高效的核心，专为同时处理多重任务而设计。与仅包含 CPU 的配置相比，GPU 的数据处理速度快得多。它们还因其超低浮点运算（性能）单价深受欢迎，其还可通过加快多核服务器的并行处理速度，解决当前的计算性能瓶颈问题。


