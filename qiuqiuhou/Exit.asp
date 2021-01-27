<%
  if Session("admin")="" then
		   Response.Write("<script>alert('ÓÃ»§Î´µÇÂ¼£¬ÇëµÇÂ¼');top.location='login.asp';</script>")
		   Response.end
  end if
  session.Abandon()
  Response.Redirect("login.asp")
%>