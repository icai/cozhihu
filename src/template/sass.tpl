// define variables
<%if(!data.orginal){%>
$base-color: #<%= data.color %>;
@import "../base/<%if(data.nightmod){%>inverse-<%}%>variable";
@import "../base/<%if(data.nightmod){%>inverse-<%}%>template";
<%}%>