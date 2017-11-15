// 第一种继承方式：原型链继承
	function Super () {
		this.val = 1
		this.arr = [1]
	}
	function Sub () {
		this.count = 1
	}
	Sub.prototype = new Super() // 核心
	var sub1 = new Sub()
	var sub2 = new Sub()
	sub1.val = 2;
	sub2.arr.push(2)
	alert(sub1.val) // 2
	alert(sub2.val) // 1
	alert(sub1.arr) // 1,2
	alert(sub2.arr) // 1,2
/*
	有点：简单，容易实现
	1、缺点：修改sub1.arr后sub.arr也发生改变，因为来自原型对象的引用属性是所有实例共享的
	可以这样理解：执行sub1.arr.push(2);先对sub1进行属性查找，找遍了实例属性（在本例中没有实例属性），
	没找到，就开始顺着原型链向上找，拿到了sub1的原型对象，一搜身，发现有arr属性。于是给arr末尾插入了2，
	所以sub2.arr也变了
	2、创建子类实例时，无法向父类构造函数传参
*/

// 第二种 构造函数继承方式
function Super(val){
    this.val = val;
    this.arr = [1];
    this.fun = function(){
        // ...
    }
}
function Sub(val){
    Super.call(this, val);   // 核心
    // ...
}
var sub1 = new Sub(1);
var sub2 = new Sub(2);
sub1.arr.push(2);
alert(sub1.val);    // 1
alert(sub2.val);    // 2
alert(sub1.arr);    // 1, 2
alert(sub2.arr);    // 1
alert(sub1.fun === sub2.fun);   // false

/*
2.核心

借父类的构造函数来增强子类实例，等于是把父类的实例属性复制了一份给子类实例装上了（完全没有用到原型）
3.优缺点

优点：
解决了子类实例共享父类引用属性的问题

创建子类实例时，可以向父类构造函数传参

P.S.前辈就这么高效，两个缺陷瞬间修复
缺点：
无法实现函数复用，每个子类实例都持有一个新的fun函数，太多了就会影响性能，内存爆炸。。
P.S.好吧，刚修复了共享引用属性的问题，又出现了这个新问题。。
*/

// 第三种继承方式
function Super(){
    // 只在此处声明基本属性和引用属性
    this.val = 1;
    this.arr = [1];
}
//  在此处声明函数
Super.prototype.fun1 = function(){};
Super.prototype.fun2 = function(){};
//Super.prototype.fun3...
function Sub(){
    Super.call(this);   // 核心
    // ...
}
Sub.prototype = new Super();    // 核心
 
var sub1 = new Sub(1);
var sub2 = new Sub(2);
alert(sub1.fun === sub2.fun);   // true

/*
3.优缺点

优点：
不存在引用属性共享问题
可传参
函数可复用
缺点:
（一点小瑕疵）子类原型上有一份多余的父类实例属性，因为父类构造函数被调用了两次，生成了两份，而子类实例上的那一份屏蔽了子类原型上的。。。又是内存浪费，比刚才情况好点，不过确实是瑕疵
P.S.如果无法理解这个”多余“，可以查看黯羽轻扬：JS学习笔记2_面向对象，文章末尾有更详细的解释
*/

// 组合寄生的方式
function beget(obj){   // 生孩子函数 beget：龙beget龙，凤beget凤。
    var F = function(){};
    F.prototype = obj;
    return new F();
}
function Super(){
    // 只在此处声明基本属性和引用属性
    this.val = 1;
    this.arr = [1];
}
//  在此处声明函数
Super.prototype.fun1 = function(){};
Super.prototype.fun2 = function(){};
//Super.prototype.fun3...
function Sub(){
    Super.call(this);   // 核心
    // ...
}
var proto = beget(Super.prototype); // 核心
proto.constructor = Sub;            // 核心
Sub.prototype = proto;              // 核心
 
var sub = new Sub();
alert(sub.val);
alert(sub.arr);
/*
2.核心

用beget(Super.prototype);切掉了原型对象上多余的那份父类实例属性
P.S.啥？没看明白？哦哦~，忘记说原型式和寄生式继承了，就说怎么总觉得忘了锁门。。这记性
P.S.寄生组合式继承，这名字不是很贴切，和寄生式继承关系并不是特别大
3.优缺点

优点：完美了
缺点：理论上没有了（如果用起来麻烦不算缺点的话。。）
P.S.用起来麻烦是一方面，另一方面是因为寄生组合式继承出现的比较晚，是21世纪初的东西，大家等不起这么久，所以组合继承是最常用的，而这个理论上完美的方案却只是课本上的最佳方式了
*/
// 原型式
function beget(obj){   // 生孩子函数 beget：龙beget龙，凤beget凤。
    var F = function(){};
    F.prototype = obj;
    return new F();
}
function Super(){
    this.val = 1;
    this.arr = [1];
}
 
// 拿到父类对象
var sup = new Super();
// 生孩子
var sub = beget(sup);   // 核心
// 增强
sub.attr1 = 1;
sub.attr2 = 2;
//sub.attr3...
 
alert(sub.val);     // 1
alert(sub.arr);     // 1
alert(sub.attr1);   // 1
/*
P.S.诶~看到了没，生孩子函数beget出现了
2.核心

用生孩子函数得到得到一个“纯洁”的新对象（“纯洁”是因为没有实例属性），再逐步增强之（填充实例属性）
P.S.ES5提供了Object.create()函数，内部就是原型式继承，IE9+支持
3.优缺点

优点：
从已有对象衍生新对象，不需要创建自定义类型（更像是对象复制，而不是继承。。）
缺点：
原型引用属性会被所有实例共享，因为是用整个父类对象来充当了子类原型对象，所以这个缺陷无可避免

无法实现代码复用（新对象是现取的，属性是现添的，都没用函数封装，怎么复用）

P.S.这东西和继承有很大关系吗？为什么尼古拉斯把它也列为实现继承的一种方式？关系不大，但有一定关系


*/


let person = {
	name: 'jike',
	init: () => {
		//为body添加一个点击事件，看看这个点击后的this属性有什么不同
		document.body.onclick = () => {
			alert(this.name); //?? this在浏览器默认是调用时的对象,可变的？                  
		}
	}
}
var p = new person()
p.init()






