/**
 * imageDatagrid 图片分页插件 1.0.0  imageDatagrid
 * @author YuPeng	余鹏
 * @param containerId 容器ID
 * @param option 参数列表
 * {
 * 	url:"",
 *  convertor:function(itemData){}	数据转换器
 *  rows:10	,//每页显示的图片数量
 * }
 * @constructor
 */
var ImageDatagrid = function(containerId,option){
    this.containerId=containerId;
    this.container = $(containerId);
    this.option = option;
    this.total=0;
    this.page=option.page || 1;
    this.pages=1;
    this.rows=option.rows || 10;
    this.prevHideFlag=1;
    this.nextHideFlag=0;
    this.selectPics=[];
    this.temp={
        imagecontainer:function(){
            var html='';
            html+="<div class='image_datagrid_image_container'>";
            html+="<div class='image_datagrid_container_image'><img src='{{picUrl}}' /></div>";
            html+="<aside class='image_datagrid_container_title'>{{picTitle}}</aside>";
            html+="</div>";
            return html;
        },
        mainTemp:function(){
            var html='';
            html+="<div class='image_datagrid_list'>";
            html+="			</div>";
            html+="			<div class='image_datagrid_param'>";
            html+="				<span class='image_datagrid_ahead'>";
            html+="					<svg  style='width: 1em; height: 1em;vertical-align: middle;fill: blue;overflow: hidden;' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='1286'><path d='M606.165333 115.498667L209.664 512l396.501333 396.501333a42.666667 42.666667 0 0 1-60.330666 60.330667l-426.666667-426.666667a42.666667 42.666667 0 0 1 0-60.330666l426.666667-426.666667a42.666667 42.666667 0 0 1 60.330666 60.330667z m298.666667 0L508.330667 512l396.501333 396.501333a42.666667 42.666667 0 0 1-60.330667 60.330667l-426.666666-426.666667a42.666667 42.666667 0 0 1 0-60.330666l426.666666-426.666667a42.666667 42.666667 0 0 1 60.330667 60.330667z'></path></svg>";
            html+="				</span>";
            html+="				<span class='image_datagrid_prev'>";
            html+="					<svg  style='width: 1em; height: 1em;vertical-align: middle;fill:blue;overflow: hidden;' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg'  ><path d='M755.498667 115.498667a42.666667 42.666667 0 0 0-60.330667-60.330667l-426.666667 426.666667a42.666667 42.666667 0 0 0 0 60.330666l426.666667 426.666667a42.666667 42.666667 0 0 0 60.330667-60.330667L358.997333 512 755.498667 115.498667z'></path></svg>";
            html+="				</span>";
            html+="				<span class='image_datagrid_current' style='width: 200px;'>第<b class='image_datagrid_current_index'>1</b>页  共<b class='image_datagrid_current_pages'>1</b>页</span>";
            html+="				<span class='image_datagrid_next'>";
            html+="					<svg  style='width: 1em; height: 1em;vertical-align: middle;fill: blue;overflow: hidden;' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg'><path d='M268.501333 908.501333a42.666667 42.666667 0 0 0 60.330667 60.330667l426.666667-426.666667a42.666667 42.666667 0 0 0 0-60.330666l-426.666667-426.666667a42.666667 42.666667 0 0 0-60.330667 60.330667L665.002667 512 268.501333 908.501333z'></path></svg>";
            html+="				</span>";
            html+="				<span class='image_datagrid_last'>";
            html+="					<svg  style='width: 1em; height: 1em;vertical-align: middle;fill: blue;overflow: hidden;' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' ><path d='M119.168 908.501333L515.669333 512 119.168 115.498667a42.666667 42.666667 0 1 1 60.330667-60.330667l426.666666 426.666667a42.666667 42.666667 0 0 1 0 60.330666l-426.666666 426.666667a42.666667 42.666667 0 0 1-60.330667-60.330667z m298.666667 0L814.336 512 417.834667 115.498667a42.666667 42.666667 0 0 1 60.330666-60.330667l426.666667 426.666667a42.666667 42.666667 0 0 1 0 60.330666l-426.666667 426.666667a42.666667 42.666667 0 0 1-60.330666-60.330667z'></path></svg>";
            html+="				</span>";
            html+="				<span class='image_datagrid_statistic'>总计<b class='image_datagrid_total'>0</b>条记录</span>";
            html+="			</div>";
            return html;
        }

    }
    /**
     * 初始化方法
     */
    this.init=function(){
        var $this = this;
        var html = $this.temp.mainTemp();
        $this.container.addClass(".image_datagrid");
        $this.container.html(html);
        $this.container.find(".image_datagrid_ahead").hide();
        $this.container.find(".image_datagrid_prev").hide();
        $this.requestAndUpdate();
        $this.eventHandler();

    }
    /**
     * 生成查询参数
     */
    this.generateParams=function(){
        var $this = this;
        var param = {};
        param.page=this.page;
        param.rows=this.rows;
        param = $.extend(param,$this.option.params || {});
        return param;
    }
    /**
     * 更新分页信息
     */
    this.updateGrid=function(){
        var $this = this;
        $this.container.find(".image_datagrid_current_index").text($this.page);
        $this.container.find(".image_datagrid_current_pages").text($this.pages);
        $this.container.find(".image_datagrid_total").text($this.total);
    }
    /**
     * 格式化数据并转换为html
     */
    this.formatData=function(){
        var $this = this;
        var data = this.data;
        if(data.length>0){
            var list = '';
            $.each(data, function(index, item) {
                item = $this.option.convertor?$this.option.convertor(item):$this.convertor(item);
                list+=replaceHtmlTemplate('',$this.temp.imagecontainer(),item);
            });
            $this.container.find('.image_datagrid_list').html(list);

        }
    }
    /**
     * 重置图片大小
     */
    this.resizeImageContainerHeight=function () {
        var $this = this;
        debugger
        var width = $this.container.find('.image_datagrid_container_image img').width();
        $this.container.find('img').attr("style",'height:'+width+'px');
    }
    /**
     * 数据转换方法
     */
    this.convertor=function(item){
        return item;
    };
    /**
     * 绑定事件
     */
    this.eventHandler=function(){
        var $this = this;
        $(document).delegate($this.containerId+" .image_datagrid_ahead","click",function(){
            $this.ahead();
        });
        $(document).delegate($this.containerId+" .image_datagrid_prev","click",function(){
            $this.prev();
        });
        $(document).delegate($this.containerId+" .image_datagrid_next","click",function(){
            $this.next();
        });
        $(document).delegate($this.containerId+" .image_datagrid_last","click",function(){
            $this.last();
        });
        $(document).delegate($this.containerId+" .image_datagrid_image_container img","click",function(){
            $this.selectPic(this);
        });
    }
    /**
     * 前往第一页
     */
    this.ahead=function(){
        var $this = this;
        $this.page=1;
        $this.requestAndUpdate();
        $this.hidePrev();
        if($this.prevHideFlag==1)$this.showNext();
    }
    /**
     * 前往前一页
     */
    this.prev=function(){
        var $this = this;
        $this.page--;
        $this.requestAndUpdate();
        if($this.nextHideFlag==1)$this.showNext();
        if($this.page==1)$this.hidePrev();
    }
    /**
     * 前往后一页
     */
    this.next=function(){
        var $this = this;
        $this.page++;
        $this.requestAndUpdate();
        if($this.prevHideFlag==1)$this.showPrev();
        if($this.page==$this.pages)$this.hideNext();
    }
    /**
     * 前往最后一页
     */
    this.last=function(){
        var $this = this;
        $this.page=$this.pages;
        $this.requestAndUpdate();
        $this.hideNext();
        if($this.prevHideFlag==1)$this.showPrev();
    }
    /**
     * 隐藏向前按钮
     */
    this.hidePrev=function(){
        var $this = this;
        $this.container.find(".image_datagrid_ahead").hide();
        $this.container.find(".image_datagrid_prev").hide();
        $this.prevHideFlag=1;
    }
    /**
     * 显示向前按钮
     */
    this.showPrev=function(){
        var $this = this;
        $this.container.find(".image_datagrid_ahead").show();
        $this.container.find(".image_datagrid_prev").show();
        $this.prevHideFlag=0;
    }
    /**
     * 隐藏向后按钮
     */
    this.hideNext=function(){
        var $this = this;
        $this.container.find(".image_datagrid_next").hide();
        $this.container.find(".image_datagrid_last").hide();
        $this.nextHideFlag=1;
    }
    /**
     * 显示向后按钮
     */
    this.showNext=function(){
        var $this = this;
        $this.container.find(".image_datagrid_next").show();
        $this.container.find(".image_datagrid_last").show();
        $this.nextHideFlag=0;
    }
    /**
     * 选择图片
     */
    this.selectPic=function (pic) {
        var $this = this;
        var $pic = $(pic);
        var picUrl = $pic.attr("src");
        if($.inArray(picUrl,$this.selectPics)>=0){
            var index = $.inArray(picUrl,$this.selectPics);
            $this.selectPics.splice(index,1);
            $pic.parent().parent().css('background-color',"azure");
        }
        else{
            $this.selectPics.push(picUrl);
            $pic.parent().parent().css('background-color',"cornflowerblue");
        }
    }
    /**
     * 请求并更新数据表
     */
    this.requestAndUpdate=function(){
        var $this =this;
        $.getJSON($this.option.url,$this.generateParams(),function(result){
            $this.data = result.rows;
            $this.total = result.total;
            $this.pages = Math.ceil($this.total/$this.rows);
            if($this.pages<=1)$this.hideNext();
            $this.formatData();
            $this.updateGrid();
            if($this.option.onload)$this.option.onload();
            $this.resizeImageContainerHeight();
        })
    }
    this.clearSelect=function () {
        var $this = this;
        $this.selectPics=[];
        $this.container.find(".image_datagrid_image_container").css('background-color',"azure");
    }
    this.onload=function(){}
    /**
     * 模板替换设值方法
     * @param {Object} scriptId
     * @param {Object} temp
     * @param {Object} obj
     */
    function replaceHtmlTemplate(scriptId,temp,obj){
        var temps = scriptId?$(scriptId).html():temp;
        if(!temps)return '';
        for(var item in obj){
            temps = temps.replace(new RegExp("{{"+item+"}}", 'g'),obj[item]?obj[item]:'');
        }
        return temps;
    }

}

