<!--#include file="conn.asp"-->
<%
set rs=server.createobject("adodb.recordset")
sql="select dengji,banben,mima,quhao,id,user,pass,ip,data from admin order by id desc"
rs.open sql,conn,1,3

If session("admin")="" then
    Response.Write "<script>alert('�û�δ��¼�����¼');top.location.href='index.asp';</SCRIPT>"
	Response.End
End If
  if Request.querystring("PageNo")="" then
     PageNo=1
  else
     PageNo=clng(Request.querystring("PageNo"))
  end if
%>
<style type="text/css">
@import url("style.css");

A:link,A:active,A:visited{TEXT-DECORATION:none ;Color:#1FABD3}
A:hover{TEXT-DECORATION: underline;Color:#4455aa}
BODY{
	FONT-SIZE: 12px;
	COLOR: #000000;
	FONT-FAMILY:  ����;
	background-color: #000000;
	background-image: url(../img/b.gif);
}
font{line-height : normal ;}

td { table-layout:fixed;
word-break :break-all; 
font-family:"����"; 
font-size: 12px;
line-height: 15px;
}
th
{
background-color: #877C59;
COLOR: #F4F2EC;
font-size: 12px;
font-weight:bold;
}
.STYLE1 {	font-family: "����";
	font-weight: bold;
	color: #1FABD3;
}
.STYLE5 {color: #FF0000}
</style>
<script language="javascript">
  function mySelectAll()
  {
     if(document.all.SelectAll.checked==true)
	 {
	   if(document.all.IDList!=null)
	   {
			if(document.all.IDList.length==null)
			{
				document.all.IDList.checked=true;
			}else{
				for(i=0;i<document.all.IDList.length;i++)
				{
				   document.all.IDList[i].checked=true;
				}
			}
	   
	   }
	 }else{
	   if(document.all.IDList!=null)
	   {
			if(document.all.IDList.length==null)
			{
				document.all.IDList.checked=false;
			}else{
				for(i=0;i<document.all.IDList.length;i++)
				{
				   document.all.IDList[i].checked=false;
				}
			}
	   
	   }
	 }
  
  }
</script>
<table width="777" height="51" border="1" align="center" cellpadding="0" cellspacing="0" bordercolor="#B6E6FB" >
  <tr>
    <td height="25"><table width="99%"  border="0" style="font-size:12px" cellpadding="0" cellspacing="0">
      <tr>
        <td width="32%" height="25" align="center" valign="middle"><div align="left" class="STYLE5"><strong><span class="STYLE1">&nbsp;</span>����Ա�˺Ź���</strong></div></td>
        <td width="23%">
          <div align="right">
            <span class="STYLE5">ȫѡ��              </span>
            <input name="SelectAll" type="checkbox" id="SelectAll" value="1" onclick="mySelectAll()" />
          </div></td>
        <td width="45%"><div align="right"><a href="" onclick="if(confirm('��ȷ��Ҫɾ����Щ�û���')){document.all.Action.value='DelSome';document.form1.submit();}return false;">����ɾ��</a></div></td>
      </tr>
    </table></td>
  </tr>
  <tr>
    <td><table width="100%" height="133" border="0" align="center" cellpadding="0" cellspacing="0" bordercolor="#B6E6FB" >

      <form name="form1" method="post" action="data_Action.asp" onSubmit="return checkForm();">
        <input type="hidden" name="Action" />
        
        <%
  if rs.recordcount=0 then
	  %>
        <tr>
          <td colspan="2"><div align="center"><span class="STYLE5">û���κ�����</span></div></td>
        </tr>
        <%
  else
      rs.pagesize=12
	  if PageNo<1 then
	     PageNo=1
	  end if
	  if PageNo>rs.pagecount then
	     PageNo=rs.pagecount
	  end if
	  rs.absolutepage=PageNo
	  i=0
	  do while i<rs.pagesize and not rs.eof
		  %>
        <tr>
          <td width="19%" height="25" align="center" valign="middle"><div align="left" class="STYLE5">
            <p></p>
            <div align="left" class="STYLE5">
              <p>�ʺţ�<%=rs("admin")%></p>
              </div>
            <p align="left">&nbsp;</p>
</div>
          </td>
          <td width="18%" align="center" valign="middle"><div align="left" class="STYLE5">
            <p>���룺<%=rs("password")%></p>
<div align="left" class="STYLE5"></div>
            </div></td>
        </tr>
        <tr>
          <td align="center" valign="middle" height="14">&nbsp;</td>
          <td align="center" valign="middle"><div align="left" class="STYLE5">
          </a></div></td>
        </tr> <td colspan="2" bgcolor="#ffffff"><div align="center">&nbsp;</div></td>
        <%
		  rs.movenext
		  i=i+1
	  loop
  end if
  %>        
        <tr>
          <td colspan="2"><div align="right"><span class="STYLE5">��¼������ <%=rs.recordcount%> �� ��ǰҳ��<%=PageNo%>/<%=rs.pagecount%> ҳ��С��<%=rs.pagesize%> <a href="?PageNo=1">��ҳ</a></span> <a href="?PageNo=<%=PageNo-1%>">��ҳ</a> <a href="?PageNo=<%=PageNo+1%>">��ҳ</a> <a href="?PageNo=<%=rs.pagecount%>">ĩҳ</a>
                <input name="goPage" type="text" id="goPage" size="2" value="<%=PageNo%>" maxlength="6" />
                <input name="Submit2" type="button" class="STYLE5" onclick="location='?PageNo='+document.all.goPage.value;" value="GO" />
            </div>
          </div></td>
        </tr>
        <%
	rs.close
	%>
      </form>
    </table></td>
  </tr>
  <script language="javascript">
function checkForm()
{

	if (document.user.admin.value == ""){
		alert ("������Ҫ����û���");
		document.user.admin.focus();
	return false;
	}
 }
</script>
</table>
