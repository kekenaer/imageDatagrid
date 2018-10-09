# imageDatagrid
基于jquery的图片分页列表插件
---------------------------
![](https://github.com/kekenaer/imageDatagrid/blob/master/imageDatagrid.png?raw=true)  
    使用简单，样式可随自己的方式调整，基于ES5语法,即插即用，方便快捷
一、使用步骤：
------------
    1.引入Jquery：<script type="text/javascript" src="js/jquery.min.js" ></script>
    2.引入本插件JS：<script type="text/javascript" src="js/imgPage.js" ></script>
    3.引入CSS：<link rel="stylesheet" href="css/imgPage.css" />
    4.新建imageDatagrid对象，设置参数：
    var imageGrid = new ImageDatagrid('.picShow',{
        url:"/file/list", //服务器图片列表的请求地址
        params:{type:1}, //查询参数
        rows:10,          //每页的图片数量
        convertor:function(item){ //请求数据数据对象转换器
          var obj = {};
          obj.picUrl = fileServer+item.guid;
          obj.picTitle=item.fileName;
          return obj;
        },
        onload:function () {    //加载后执行的方法
          $(".picShow img").removeAttr("style");
        }
      });
      imageGrid.init(); //初始化
二、构造方法参数解释：
--------------------
      ImageDatagrid(containerId,options);
      1.containerId:需要加载图片列表的容器选择器
      2.options:  参数列表对象
      {
        url:'', 服务器图片列表请求地址
        params:{type:1}, //查询参数
        page:1,         //显示第几页的图片
        rows:10,          //每页的图片数量
        convertor:function(){}  //数据转换
        onload:function(){}   //列表加载完毕后执行的方法 
      }
三、服务器图片分页列表返回数据格式，图片对象如与下面的属性名称不一致，可通过convertor回调函数进行转换：
--------------------
      {
        total:100,    //查询结果总数量
        rows:[{       //图片的分页对象列表
          picUrl:'',  //图片地址
          picTitle:'' //图片标题
        }]       
      }
四、获取选中的图片数组：
---------------------------------
 var pics = imageGrid.selectPics;
 if(pics.length>0){
    var html='';
    $.each(pics, function(index, item) {
        html+="<img src='"+item+"'>";
    });
    console.log(html);
    }
