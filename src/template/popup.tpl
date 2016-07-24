<!DOCTYPE html>
<html>

<head lang="en">
    <meta charset="UTF-8">
    <title>Set Color</title>
    <style>
    body {
        overflow: hidden;
        margin: 0;
        padding: 0;
        background: white;
    }
    
    td,
    th {
        border: 0.5px solid white;
    }
    
    table {
        border-collapse: collapse;
    }
    
    div:first-child {
        margin-top: 0;
    }
    
    div {
        cursor: pointer;
        text-align: center;
        padding: 1px 3px;
        width: 50px;
        height: 20px;
        margin-top: 1px;
        position: relative;
    }
    
    div:hover {
        opacity: 0.5;
    }

    div.active:before{
        content: "●";
        position: absolute;
        top: -2px;
        left: 2px;
        color: #fff;
        line-height: 1;
    }


    .night-mod {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUE5NjQzRkZGOTVCMTFFNUIxM0FBMDdFMzlGN0RFQzYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUE5NjQ0MDBGOTVCMTFFNUIxM0FBMDdFMzlGN0RFQzYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFQTk2NDNGREY5NUIxMUU1QjEzQUEwN0UzOUY3REVDNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFQTk2NDNGRUY5NUIxMUU1QjEzQUEwN0UzOUY3REVDNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmyCsyUAAAC6SURBVHjaYvz//z8DJYCRUgMYQAYQwOpA3A/ETtjkiTFA8z8EfAbiWnIM0AHiq0AsDjWoiVQDpgLxeSibH2qIFbEGqEA1aCKJHQDiHbgMkAJiLiBWhDoVBNLQ1ExGchGGAYuhgXUbiE8BsREWV20H4v24DPCB2orPW/+h6nCGwTYgvo9FnAmIvwHxQmRxXClxExA7QOlHQKwMxL5AvAaI44hNyj5AnATEokD8HIhnAPE+queFgTcAIMAA2JzkIFsN1xcAAAAASUVORK5CYII=);
        background-repeat: no-repeat;
        background-position: right bottom;
    }

    .orginal {
         background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MEIxRkQ1MkNGOUM2MTFFNUEyRUZFRjM3NzNCMjVENzMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MEIxRkQ1MkRGOUM2MTFFNUEyRUZFRjM3NzNCMjVENzMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowQjFGRDUyQUY5QzYxMUU1QTJFRkVGMzc3M0IyNUQ3MyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowQjFGRDUyQkY5QzYxMUU1QTJFRkVGMzc3M0IyNUQ3MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pm/IWWsAAAHESURBVHjapFM9a8JgEH5Tu7noPxDaQilIwUUogg01TatOtfoPRBAXS4cmiwWLRSpVcNe5UGhXHRUcHUwdivoLHETEj8RoeheaoEnTxQdecsl9vHfPPaEURSG7YM/KsV6v/7SN2NeMYrFIWq0Wmc/nxOPxHN4A3G73KQXoAJrN5kcsFvt2Op3EZrOpRwWOgCcUCqnvqVTqfjgczhQDJpPJolqtci6Xi8TjcT1PN1iWJclk8g6DV6vVslwuv4bDYRYKX5ZKpRdJkkT0QQzn8/nMBXiePxiPxwtRFOfBYJAxzsowjH82m00BS47jjrcKIEmCIHB4A95sRVihUHjGGIh9hC63O4Dzhk4Y5cKqAE3Tvl9KPrU80xqVf4Sx4aO2dIDf2+12B22Y/9qqwBUAnxira0NrpV6vH8myLIEOpkiYMdnv958BgRNIlGu12olpC71ej+RyuQdsE1a2QMKgEB0IBM7z+fwTFFa1kc1mM91u17zGfr+v3pROp/nRaCQZhQQF5EqlkkEhDQYDPY/SeAH1kUQiQUBxxOv1nkSj0VuUMvpAyUKj0XiPRCJfDoeD2O12fTTKinTcs6b3TdsIatff+UeAAQBzn3sI3AduogAAAABJRU5ErkJggg==);
;
            background-repeat: no-repeat;
            background-position: right bottom;
    }


    </style>
    <script src="popup/popup.js"></script>
</head>
<body>
<table>
    <tr>
    <% [].forEach.call(colors, function(item, index) { %>
        <% if(index && index%4 == 0) {%>
        </tr><tr>
        <% } %>
        <td><div id="#<%= item.color %>" data-name="<%= item.name %>" <%if (item.nightmod){%>class="night-mod"<%}%> <%if (item.orginal){%>class="orginal"<%}%> ></div></td>
    <% }); %>
    </tr>
</table>
</body>
</html>
