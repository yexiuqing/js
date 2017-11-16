
// 函数节流简单讲就是让一个函数无法在很短的时间间隔内连续调用，只有当上一次函数执行后过了你规定的时间间隔，才能进行下一次该函数的调用。
function throttle(method,context){
    clearTimeout(method,tId);
    method.tId=setTimeout(function(){
        method.call(context);
    },100);
}
//调用
window.onresize=function(){
    throttle(myFunc);
}

//法二：
var throttle=function(fn,delay){
    var timer=null;
    return function(){
        var context=this,args=arguments;
        clearTimeout(timer);
        timer=setTimeout(function(){
            fn.apply(context,args);//context调用fn的方法，指针指向了fn
        },delay);
    }
}
//调用
window.onresize=throttle(myFunc,100);

var throttleV2=function(fn,delay,mustRunDelay){
    var timer=null;
    var t_start;
    return function(){
        var context=this,args=arguments,t_curr=+new Date();
        clearTimeout(timer);
        if(!s_start){
            t_start=t_curr;
        }if(t_curr-t_start>=mustRunDelay){
            fn.apply(context,args);
            t_start=t_curr;
        }else{
            timer=setTimeout(function(){
                fn.apply(context,args);
            },delay);
        }
    }
}
window.onresize=throttleV2(myFunc,50,100);
