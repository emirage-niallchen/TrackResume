```JS
// 使用BigInt:
console.log(1234567n + 3456789n); // OK
console.log(1234567n / 789n); // 1564, 除法运算结果仍然是BigInt
console.log(1234567n % 789n); // 571, 求余
console.log(1234567n + 3456789); // Uncaught TypeError: Cannot mix BigInt and other types
```

<mark style="background: #BBFABBA6;">有些GBK的编码是和ASCII码重叠的</mark>

![](https://picture-bed.artithm.com/picture-bed/2025/04/20250429001540139.png)

# 闪念
**前序和后序不能唯一确定一棵二叉树！**，因为没有中序遍历无法确定左右部分，也就是无法分割。![[Pasted image 20231016090357.png]]
通过属性名进行自动依赖注入的相对比通过属性类型进行自动依赖注入要稍微简单一些.  

**BeanFactory 只能管理  单例（Singleton）Bean 的生命周期**。它不能管理原型(prototype,非单例)Bean 的生命周期。这是因为  原型 Bean 实例被创建之后便被传给了客户端,容器失去了对它们的引用。

### 相较于BeanFactorty，ApplicationContext还提供了以下的功能：
相较于BeanFactorty，ApplicationContext还提供了以下的功能：
（1）MessageSource, 提供国际化的消息访问
（2）资源访问，如URL和文件
（3）事件传播特性，即支持aop特性
（4）载入多个（有继承关系）上下文 ，使得每一个上下文都专注于一个特定的层次，比如应用的web层

###  AOP动态代理的优劣
其实Cglib代理的性能是要远远好于JDK代理的。其实从原理也能理解，直接通过类的方法调用，肯定要比通过反射调用的时间更短。
大部分的Java类都会以接口-实现的方式来完成，因此，在这个方面上，JDK Proxy实际上是比Cglib Proxy要更胜一筹的。因为**如果一个类被final修饰，则Cglib Proxy无法进行代理。**

springMVC中，一般Controller、service、DAO层的scope均是singleton；

### 避免controller出现线程安全问题
我们在使用spring mvc 的contrller时，应避免在controller中定义实例变量。多线程的话可能对变量进行修改。
	解决方法：
		不声明实例变量
		使用**原型模式**
		使用ThreadLocal


"Spring AOP采用了Aspectj包提供的注解，但是底层编译器和织入器并不是Aspectj"


### spring中用到哪些设计模式？
1.**工厂模式**，这个很明显，在各种BeanFactory以及ApplicationContext创建中都用到了；
2.**模版模式**，这个也很明显，在各种BeanFactory以及ApplicationContext实现中也都用到了；
3.**代理模式**，在Aop实现中用到了JDK的动态代理；
4.**单例模式**，这个比如在创建bean的时候。
5.Tomcat中有很多场景都使用到了外观模式，因为Tomcat中有很多不同的组件，每个组件需要相互通信，但又不能将自己内部数据过多地暴露给其他组件。用外观模式隔离数据是个很好的方法。
6.**策略模式**在Java中的应用，这个太明显了，因为Comparator这个接口简直就是为策略模式而生的。Comparable和Comparator的区别一文中，详细讲了Comparator的使用。比方说Collections里面有一个sort方法，因为集合里面的元素有可能是复合对象，复合对象并不像基本数据类型，可以根据大小排序，复合对象怎么排序呢？基于这个问题考虑，Java要求如果定义的复合对象要有排序的功能，就自行实现Comparable接口或Comparator接口.
7.**原型模式**：使用原型模式创建对象比直接new一个对象在性能上好得多，因为**Object类的clone()方法是一个native方法，它直接操作内存中的二进制流，特别是复制大对象时，性能的差别非常明显。**
8.迭代器模式：Iterable接口和Iterator接口 这两个都是迭代相关的接口，可以这么认为，实现了Iterable接口，则表示某个对象是可被迭代的；Iterator接口相当于是一个迭代器，实现了Iterator接口，等于具体定义了这个可被迭代的对象时如何进行迭代的

# Linux
CC:对页面的访问
DDOS 分布式攻击
只能用硬件防火墙来解决。比如引入黑洞。

文件管理命令 cat 命令：
	cat > filename
	cat file2 file1 > file 合并文件
chmod u g o a
chown  修改拥有者
find 文件树中查找文件。
head  
more
tail
rm -r 是删除目录  -i 是询问 -f 是不用询问
touch  修改文件或者目录的时间属性
df 磁盘使用情况
rmdir   
netstat 
	Linux netstat命令用于**显示网络状态**。  
	查看端口：netstat -lnp  
**lsof(list open files)是一个查看进程打开的文件的工具。**
lsof -i:80  查看端口号占用
free
top
ps

退出当前命令：ctrl+c 彻底退出执行睡眠 ：ctrl+z 挂起当前进程   

vi vim  cat tail more  less 
	**我经常用 kate 查看文件**

黑洞文件 /dev/null

### 应用程序的主类一 定要求是public类
为什么是  public static void main





### 单词:

## 错误解决 ：

### 复盘：


