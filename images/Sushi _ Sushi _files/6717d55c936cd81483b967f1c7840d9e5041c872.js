!function(a,b,c){"use strict";function d(a,c){var d=this;return c=c||{},c=b.extend({displayNodePagination:!1,cParentID:0,includeSystemPages:!1,displaySingleLevel:!1},c),d.options=c,d.$element=a,d.setupTree(),d.setupTreeEvents(),Concrete.event.publish("ConcreteSitemap",this),d.$element}d.prototype={getTree:function(){var a=this;return a.$element.dynatree("getTree")},setupTree:function(){var a,c=this,d=!0;c.options.displaySingleLevel?(a=1==c.options.cParentID?2:3,d=!1):a=1,b(c.$element).addClass("ccm-tree-sitemap"),b(c.$element).dynatree({onQueryExpand:function(){(c.options.onQueryExpand||b.noop).apply(this,arguments)},autoFocus:!1,cookieId:"ConcreteSitemap",cookie:{path:CCM_REL+"/"},persist:d,initAjax:{url:CCM_TOOLS_PATH+"/dashboard/sitemap_data",data:{displayNodePagination:c.options.displayNodePagination?1:0,cParentID:c.options.cParentID,displaySingleLevel:c.options.displaySingleLevel?1:0,includeSystemPages:c.options.includeSystemPages?1:0}},onPostInit:function(){c.options.displayNodePagination&&c.setupNodePagination(c.$element,c.options.cParentID)},onRender:function(){c.$element.children(".ccm-pagination-bound").remove()},selectMode:1,minExpandLevel:a,clickFolderMode:2,onLazyRead:function(a){c.options.displaySingleLevel?c.displaySingleLevel(a):c.reloadNode(a)},onExpand:function(a,b){a&&c.options.displaySingleLevel&&c.displaySingleLevel(b)},onClick:function(a,d){if("title"==a.getEventTargetType(d)&&a.data.cID)if(c.options.onSelectNode)c.options.onSelectNode.call(c,a);else{var e=new ConcretePageMenu(b(a.span).find(">a"),{menuOptions:c.options,data:a.data,sitemap:c,onHide:function(a){a.$launcher.each(function(){b(this).unbind("mousemove.concreteMenu")})}});e.show(d)}else a.data.href?window.location.href=a.data.href:a.data.displaySingleLevel&&c.displaySingleLevel(a)},fx:{height:"toggle",duration:200},dnd:{onDragStart:function(a){return a.data.cID?!0:!1},onDragStop:function(a){},autoExpandMS:1e3,preventVoidMoves:!1,onDragEnter:function(a,b){return!0},onDragOver:function(a,b,c){return a.parent.data.cID||"1"===a.data.cID?"over"!=c&&1==a.data.cID?!1:b.data.cID==a.data.cID?!1:a.data.cID||"after"!=c?a.isDescendantOf(b)?!1:!0:!1:!1},onDrop:function(a,b,d,e,f){a.parent.data.cID==b.parent.data.cID&&"over"!=d?(b.move(a,d),c.rescanDisplayOrder(b.parent)):c.selectMoveCopyTarget(b,a,d)}}})},setupTreeEvents:function(){var a=this;ConcreteEvent.unsubscribe("SitemapDeleteRequestComplete.sitemap"),ConcreteEvent.subscribe("SitemapDeleteRequestComplete.sitemap",function(b){var c=a.$element.dynatree("getActiveNode"),d=c.parent;a.reloadNode(d)}),ConcreteEvent.unsubscribe("SitemapAddPageRequestComplete.sitemap"),ConcreteEvent.subscribe("SitemapAddPageRequestComplete.sitemap",function(b,c){var d=a.getTree().getNodeByKey(c.cParentID);d&&a.reloadNode(d),jQuery.fn.dialog.closeAll()}),ConcreteEvent.subscribe("SitemapUpdatePageRequestComplete.sitemap",function(b,c){try{var d=a.getTree().getNodeByKey(c.cID),e=d.parent;e&&a.reloadNode(e)}catch(b){}})},rescanDisplayOrder:function(a){var c,d=a.getChildren(),e=[];for(a.setLazyNodeStatus(DTNodeStatus_Loading),c=0;c<d.length;c++){var f=d[c];e.push({name:"cID[]",value:f.data.cID})}b.concreteAjax({dataType:"json",type:"POST",data:e,url:CCM_TOOLS_PATH+"/dashboard/sitemap_update",success:function(b){a.setLazyNodeStatus(DTNodeStatus_Ok),ConcreteAlert.notify({message:b.message})}})},selectMoveCopyTarget:function(a,c,d){var e=this,f=ccmi18n_sitemap.moveCopyPage;if(!d)var d="";var g=CCM_TOOLS_PATH+"/dashboard/sitemap_drag_request?origCID="+a.data.cID+"&destCID="+c.data.cID+"&dragMode="+d,h=350,i=350;b.fn.dialog.open({title:f,href:g,width:i,modal:!1,height:h}),ConcreteEvent.unsubscribe("SitemapDragRequestComplete.sitemap"),ConcreteEvent.subscribe("SitemapDragRequestComplete.sitemap",function(b,f){var g=c.parent;"over"==d&&(g=c),"MOVE"==f.task&&a.remove(),g.removeChildren(),e.reloadNode(g,function(){c.bExpanded||c.expand(!0)})})},setupNodePagination:function(a,c){var d=a.find("div.ccm-pagination-wrapper");if(a.children(".ccm-pagination-bound").remove(),d.length){d.find("a").unbind("click").on("click",function(){var c=b(this).attr("href");return a.dynatree("option","initAjax",{url:c}),a.dynatree("getTree").reload(),!1});var e=b.ui.dynatree.getNode(d);e&&"function"==typeof e.remove&&e.remove(),d.addClass("ccm-pagination-bound").appendTo(a),a.dynatree("option","onActivate",function(a){b(a.span).hasClass("ccm-sitemap-explore-paging")&&a.deactivate()})}},displaySingleLevel:function(a){var c=this,d=c.options,e=1==a.data.cID?2:3;(c.options.onDisplaySingleLevel||b.noop).call(this,a);var f=c.$element.dynatree("getRoot");b(a.li).closest("[data-sitemap=container]").dynatree("option","minExpandLevel",e),f.removeChildren(),f.appendAjax({url:CCM_TOOLS_PATH+"/dashboard/sitemap_data",data:{displayNodePagination:d.displayNodePagination?1:0,cParentID:a.data.cID,displaySingleLevel:!0,includeSystemPages:d.includeSystemPages?1:0},success:function(){c.setupNodePagination(f.tree.$tree,a.data.key)}})},reloadNode:function(a,b){var c=this,d=c.options,e={url:CCM_TOOLS_PATH+"/dashboard/sitemap_data",data:{cParentID:a.data.cID,includeSystemPages:d.includeSystemPages?1:0,displayNodePagination:d.displayNodePagination?1:0},success:function(){b&&b()}};a.appendAjax(e)}},d.exitEditMode=function(a){b.get(CCM_TOOLS_PATH+"/dashboard/sitemap_check_in?cID="+a+"&ccm_token="+CCM_SECURITY_TOKEN)},d.refreshCopyOperations=function(){ccm_triggerProgressiveOperation(CCM_TOOLS_PATH+"/dashboard/sitemap_copy_all",[],ccmi18n_sitemap.copyProgressTitle,function(){b(".ui-dialog-content").dialog("close"),window.location.reload()})},d.submitDragRequest=function(){var a=b("#origCID").val(),c=(b("#destParentID").val(),b("#destCID").val()),d=b("#dragMode").val(),e=b("#destSibling").val(),f=b("input[name=ctask]:checked").val(),g=b("input[name=copyAll]:checked").val(),h=b("input[name=saveOldPagePath]:checked").val(),i={origCID:a,destCID:c,ctask:f,ccm_token:CCM_SECURITY_TOKEN,copyAll:g,destSibling:e,dragMode:d,saveOldPagePath:h};if(1==g){var j=ccmi18n_sitemap.copyProgressTitle;ccm_triggerProgressiveOperation(CCM_TOOLS_PATH+"/dashboard/sitemap_copy_all",[{name:"origCID",value:a},{name:"destCID",value:c}],j,function(){b(".ui-dialog-content").dialog("close"),ConcreteEvent.publish("SitemapDragRequestComplete",{task:f})})}else jQuery.fn.dialog.showLoader(),b.getJSON(CCM_TOOLS_PATH+"/dashboard/sitemap_drag_request",i,function(a){ccm_parseJSON(a,function(){jQuery.fn.dialog.closeAll(),jQuery.fn.dialog.hideLoader(),ConcreteAlert.notify({message:a.message}),ConcreteEvent.publish("SitemapDragRequestComplete",{task:f}),jQuery.fn.dialog.closeTop(),jQuery.fn.dialog.closeTop()})})},b.fn.concreteSitemap=function(a){return b.each(b(this),function(c,e){new d(b(this),a)})},a.ConcreteSitemap=d}(this,$,_),!function(a,b,c){"use strict";function d(a,d){var e=this,d=d||{};d=b.extend({sitemap:!1,data:{},menuOptions:{}},d),ConcreteMenu.call(e,a,d),0!=d.sitemap&&(e.$menu=b(c.template(ConcretePageAjaxSearchMenu.get(),{item:d.data})))}d.prototype=Object.create(ConcreteMenu.prototype),d.prototype.setupMenuOptions=function(a){var b=this,c=ConcreteMenu.prototype,d=a.attr("data-search-page-menu");b.options.container;c.setupMenuOptions(a),b.options.sitemap&&0!=b.options.sitemap.options.displaySingleLevel||a.find("[data-sitemap-mode=explore]").remove(),a.find("a[data-action=delete-forever]").on("click",function(){return ccm_triggerProgressiveOperation(CCM_TOOLS_PATH+"/dashboard/sitemap_delete_forever",[{name:"cID",value:d}],ccmi18n_sitemap.deletePages,function(){if(b.options.sitemap){var a=b.options.sitemap.getTree(),c=a.getNodeByKey(d);c.remove()}ConcreteAlert.notify({message:ccmi18n_sitemap.deletePageSuccessMsg})}),!1}),a.find("a[data-action=empty-trash]").on("click",function(){return ccm_triggerProgressiveOperation(CCM_TOOLS_PATH+"/dashboard/sitemap_delete_forever",[{name:"cID",value:d}],ccmi18n_sitemap.deletePages,function(){if(b.options.sitemap){var a=b.options.sitemap.getTree(),c=a.getNodeByKey(d);c.removeChildren()}}),!1})},b.fn.concretePageMenu=function(a){return b.each(b(this),function(c,e){new d(b(this),a)})},a.ConcretePageMenu=d}(this,$,_),!function(a,b){"use strict";function c(a,c){var e=this;c=b.extend({mode:"menu"},c),e.options=c,e._templateSearchResultsMenu=_.template(d.get()),ConcreteAjaxSearch.call(e,a,c),e.setupEvents()}c.prototype=Object.create(ConcreteAjaxSearch.prototype),c.prototype.setupEvents=function(){var a=this;ConcreteEvent.subscribe("SitemapDeleteRequestComplete",function(b){a.refreshResults()}),ConcreteEvent.fire("ConcreteSitemapPageSearch",a)},c.prototype.updateResults=function(a){var c=this,d=c.$element;ConcreteAjaxSearch.prototype.updateResults.call(c,a),"choose"==c.options.mode&&(d.find(".ccm-search-results-checkbox").parent().remove(),d.find("select[data-bulk-action]").parent().remove(),d.unbind(".concretePageSearchHoverPage"),d.on("mouseover.concretePageSearchHoverPage","tr[data-launch-search-menu]",function(){b(this).addClass("ccm-search-select-hover")}),d.on("mouseout.concretePageSearchHoverPage","tr[data-launch-search-menu]",function(){b(this).removeClass("ccm-search-select-hover")}),d.unbind(".concretePageSearchChoosePage").on("click.concretePageSearchChoosePage","tr[data-launch-search-menu]",function(){return ConcreteEvent.publish("SitemapSelectPage",{instance:c,cID:b(this).attr("data-page-id"),title:b(this).attr("data-page-name")}),!1}))},c.prototype.handleSelectedBulkAction=function(a,c,d,e){if("movecopy"==a||"Move/Copy"==a){var f,g=[];b.each(e,function(a,c){g.push(b(c).val())}),ConcreteEvent.unsubscribe("SitemapSelectPage.search");var h=function(a,c){Concrete.event.unsubscribe(a),f=CCM_TOOLS_PATH+"/dashboard/sitemap_drag_request?origCID="+g.join(",")+"&destCID="+c.cID,b.fn.dialog.open({width:350,height:350,href:f,title:ccmi18n_sitemap.moveCopyPage,onDirectClose:function(){ConcreteEvent.subscribe("SitemapSelectPage.search",h)}})};ConcreteEvent.subscribe("SitemapSelectPage.search",h)}ConcreteAjaxSearch.prototype.handleSelectedBulkAction.call(this,a,c,d,e)},ConcreteAjaxSearch.prototype.createMenu=function(a){var c=this;a.concretePageMenu({container:c,menu:b("[data-search-menu="+a.attr("data-launch-search-menu")+"]")})},c.launchDialog=function(a){var c=b(window).width()-53;b.fn.dialog.open({width:c,height:"100%",href:CCM_TOOLS_PATH+"/sitemap_search_selector",modal:!0,title:ccmi18n_sitemap.pageLocationTitle,onClose:function(){ConcreteEvent.fire("PageSelectorClose")},onOpen:function(){ConcreteEvent.unsubscribe("SitemapSelectPage"),ConcreteEvent.subscribe("SitemapSelectPage",function(b,c){jQuery.fn.dialog.closeTop(),a(c)})}})},c.getPageDetails=function(a,c){b.ajax({type:"post",dataType:"json",url:CCM_DISPATCHER_FILENAME+"/ccm/system/page/get_json",data:{cID:a},error:function(a){ConcreteAlert.dialog("Error",a.responseText)},success:function(a){c(a)}})};var d={get:function(){return'<div class="ccm-popover-page-menu popover fade" data-search-page-menu="<%=item.cID%>" data-search-menu="<%=item.cID%>"><div class="arrow"></div><div class="popover-inner"><ul class="dropdown-menu"><% if (item.isTrash) { %><li><a data-action="empty-trash" href="javascript:void(0)">'+ccmi18n_sitemap.emptyTrash+'</a></li><% } else if (item.isInTrash) { %><li><a data-action="delete-forever" href="javascript:void(0)">'+ccmi18n_sitemap.deletePageForever+"</a></li><% } else if (item.cAlias == 'LINK' || item.cAlias == 'POINTER') { %><li><a href=\"<%=item.link%>\">"+ccmi18n_sitemap.visitExternalLink+'</a></li><% if (item.cAlias == \'LINK\' && item.canEditPageProperties) { %><li><a class="dialog-launch" dialog-width="350" dialog-height="260" dialog-title="'+ccmi18n_sitemap.editExternalLink+'" dialog-modal="false" dialog-append-buttons="true" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/page/edit_external?cID=<%=item.cID%>">'+ccmi18n_sitemap.editExternalLink+'</a></li><li><a class="dialog-launch" dialog-on-close="ConcreteSitemap.exitEditMode(<%=item.cID%>)" dialog-width="90%" dialog-height="70%" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.pageAttributesTitle+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/page/attributes?cID=<%=item.cID%>">'+ccmi18n_sitemap.pageAttributes+'</a></li><li><a class="dialog-launch" dialog-on-close="ConcreteSitemap.exitEditMode(<%=item.cID%>)" dialog-width="500" dialog-height="630" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.setPagePermissions+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/panels/details/page/permissions?cID=<%=item.cID%>">'+ccmi18n_sitemap.setPagePermissions+'</a></li><% } %><% if (item.canDeletePage) { %><li><a class="dialog-launch" dialog-width="360" dialog-height="150" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.deleteExternalLink+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/page/delete_alias?cID=<%=item.cID%>">'+ccmi18n_sitemap.deleteExternalLink+'</a></li><% } %><% } else { %><li><a href="<%=item.link%>">'+ccmi18n_sitemap.visitPage+'</a></li><% if (item.canEditPageProperties || item.canEditPageSpeedSettings || item.canEditPagePermissions || item.canEditPageDesign || item.canViewPageVersions || item.canDeletePage) { %><li class="divider"></li><% } %><% if (item.canEditPageProperties) { %><li><a class="dialog-launch" dialog-on-close="ConcreteSitemap.exitEditMode(<%=item.cID%>)" dialog-width="640" dialog-height="360" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.seo+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/page/seo?cID=<%=item.cID%>">'+ccmi18n_sitemap.seo+'</a></li><% if (item.cID > 1) { %><li><a class="dialog-launch" dialog-on-close="ConcreteSitemap.exitEditMode(<%=item.cID%>)" dialog-width="500" dialog-height="500" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.pageLocationTitle+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/page/location?cID=<%=item.cID%>">'+ccmi18n_sitemap.pageLocation+'</a></li><% } %><li class="divider"></li><li><a class="dialog-launch" dialog-on-close="ConcreteSitemap.exitEditMode(<%=item.cID%>)" dialog-width="90%" dialog-height="70%" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.pageAttributesTitle+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/page/attributes?cID=<%=item.cID%>">'+ccmi18n_sitemap.pageAttributes+'</a></li><% } %><% if (item.canEditPageSpeedSettings) { %><li><a class="dialog-launch" dialog-on-close="ConcreteSitemap.exitEditMode(<%=item.cID%>)" dialog-width="550" dialog-height="280" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.speedSettingsTitle+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/panels/details/page/caching?cID=<%=item.cID%>">'+ccmi18n_sitemap.speedSettings+'</a></li><% } %><% if (item.canEditPagePermissions) { %><li><a class="dialog-launch" dialog-on-close="ConcreteSitemap.exitEditMode(<%=item.cID%>)" dialog-width="500" dialog-height="630" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.setPagePermissions+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/panels/details/page/permissions?cID=<%=item.cID%>">'+ccmi18n_sitemap.setPagePermissions+'</a></li><% } %><% if (item.canEditPageDesign || item.canEditPageType) { %><li><a class="dialog-launch" dialog-on-close="ConcreteSitemap.exitEditMode(<%=item.cID%>)" dialog-width="350" dialog-height="250" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.pageDesign+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/page/design?cID=<%=item.cID%>">'+ccmi18n_sitemap.pageDesign+'</a></li><% } %><% if (item.canViewPageVersions) { %><li><a class="dialog-launch" dialog-on-close="ConcreteSitemap.exitEditMode(<%=item.cID%>)" dialog-width="640" dialog-height="340" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.pageVersions+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/panels/page/versions?cID=<%=item.cID%>">'+ccmi18n_sitemap.pageVersions+'</a></li><% } %><% if (item.canDeletePage) { %><li><a class="dialog-launch" dialog-on-close="ConcreteSitemap.exitEditMode(<%=item.cID%>)" dialog-width="360" dialog-height="250" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.deletePage+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/page/delete_from_sitemap?cID=<%=item.cID%>">'+ccmi18n_sitemap.deletePage+'</a></li><% } %><li class="divider" data-sitemap-mode="explore"></li><li data-sitemap-mode="explore"><a class="dialog-launch" dialog-width="90%" dialog-height="70%" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.moveCopyPage+'" href="'+CCM_TOOLS_PATH+'/sitemap_search_selector?sitemap_select_mode=move_copy_delete&cID=<%=item.cID%>">'+ccmi18n_sitemap.moveCopyPage+'</a></li><li data-sitemap-mode="explore"><a href="'+CCM_DISPATCHER_FILENAME+'/dashboard/sitemap/explore?cNodeID=<%=item.cID%>&task=send_to_top">'+ccmi18n_sitemap.sendToTop+'</a></li><li data-sitemap-mode="explore"><a href="'+CCM_DISPATCHER_FILENAME+'/dashboard/sitemap/explore?cNodeID=<%=item.cID%>&task=send_to_bottom">'+ccmi18n_sitemap.sendToBottom+'</a></li><% if (item.numSubpages > 0) { %><li class="divider"></li><li><a href="'+CCM_DISPATCHER_FILENAME+'/dashboard/sitemap/search/?selectedSearchField[]=parent&cParentAll=1&cParentIDSearchField=<%=item.cID%>">'+ccmi18n_sitemap.searchPages+'</a></li><li><a href="'+CCM_DISPATCHER_FILENAME+'/dashboard/sitemap/explore/-/<%=item.cID%>">'+ccmi18n_sitemap.explorePages+'</a></li><% } %><% if (item.canAddExternalLinks || item.canAddSubpages) { %><li class="divider"></li><% if (item.canAddSubpages > 0) { %><li><a class="dialog-launch" dialog-width="350" dialog-modal="false" dialog-height="260" dialog-title="'+ccmi18n_sitemap.addPage+'" dialog-modal="false" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/page/add?cID=<%=item.cID%>">'+ccmi18n_sitemap.addPage+'</a></li><% } %><% if (item.canAddExternalLinks > 0) { %><li><a class="dialog-launch" dialog-width="350" dialog-modal="false" dialog-height="260" dialog-title="'+ccmi18n_sitemap.addExternalLink+'" dialog-modal="false" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/page/add_external?cID=<%=item.cID%>">'+ccmi18n_sitemap.addExternalLink+"</a></li><% } %><% } %><% } %></ul></div></div>"}};b.fn.concretePageAjaxSearch=function(a){return b.each(b(this),function(d,e){new c(b(this),a)})},a.ConcretePageAjaxSearch=c,a.ConcretePageAjaxSearchMenu=d}(this,$),!function(a,b){"use strict";function c(a,c){var d=this,c=b.extend({chooseText:ccmi18n_sitemap.choosePage,loadingText:ccmi18n_sitemap.loadingText,inputName:"cID",cID:0},c);d.$element=a,d.options=c,d._chooseTemplate=_.template(d.chooseTemplate,{options:d.options}),d._loadingTemplate=_.template(d.loadingTemplate,{options:d.options}),d._pageLoadedTemplate=_.template(d.pageLoadedTemplate),d._pageMenuTemplate=_.template(ConcretePageAjaxSearchMenu.get()),d.$element.append(d._chooseTemplate),d.$element.on("click","a[data-page-selector-link=choose]",function(a){a.preventDefault(),ConcretePageAjaxSearch.launchDialog(function(a){d.loadPage(a.cID)})}),d.options.cID&&d.loadPage(d.options.cID)}c.prototype={chooseTemplate:'<div class="ccm-page-selector"><input type="hidden" name="<%=options.inputName%>" value="0" /><a href="#" data-page-selector-link="choose"><%=options.chooseText%></a></div>',loadingTemplate:'<div class="ccm-page-selector"><div class="ccm-page-selector-choose"><i class="fa fa-spin fa-spinner"></i> <%=options.loadingText%></div></div>',pageLoadedTemplate:'<div class="ccm-page-selector"><div class="ccm-page-selector-page-selected"><input type="hidden" name="<%=inputName%>" value="<%=page.cID%>" /><a data-page-selector-action="clear" href="#" class="ccm-page-selector-clear"><i class="fa fa-close"></i></a><div class="ccm-page-selector-page-selected-title"><%=page.name%></div></div></div>',loadPage:function(a){var b=this;b.$element.html(b._loadingTemplate),ConcretePageAjaxSearch.getPageDetails(a,function(a){var c=a.pages[0];b.$element.html(b._pageLoadedTemplate({inputName:b.options.inputName,page:c})),b.$element.on("click","a[data-page-selector-action=clear]",function(a){a.preventDefault(),b.$element.html(b._chooseTemplate)})})}},b.fn.concretePageSelector=function(a){return b.each(b(this),function(d,e){new c(b(this),a)})},a.ConcretePageSelector=c}(this,$);

+function(a){"use strict";var b=function(a,b){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null,this.init("tooltip",a,b)};b.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1},b.prototype.init=function(b,c,d){this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d);for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},b.prototype.getDefaults=function(){return b.DEFAULTS},b.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},b.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},b.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);return clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show()},b.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);return clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide()},b.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){if(this.$element.trigger(b),b.isDefaultPrevented())return;var c=this,d=this.tip();this.setContent(),this.options.animation&&d.addClass("fade");var e="function"==typeof this.options.placement?this.options.placement.call(this,d[0],this.$element[0]):this.options.placement,f=/\s?auto?\s?/i,g=f.test(e);g&&(e=e.replace(f,"")||"top"),d.detach().css({top:0,left:0,display:"block"}).addClass(e),this.options.container?d.appendTo(this.options.container):d.insertAfter(this.$element);var h=this.getPosition(),i=d[0].offsetWidth,j=d[0].offsetHeight;if(g){var k=this.$element.parent(),l=e,m=document.documentElement.scrollTop||document.body.scrollTop,n="body"==this.options.container?window.innerWidth:k.outerWidth(),o="body"==this.options.container?window.innerHeight:k.outerHeight(),p="body"==this.options.container?0:k.offset().left;e="bottom"==e&&h.top+h.height+j-m>o?"top":"top"==e&&h.top-m-j<0?"bottom":"right"==e&&h.right+i>n?"left":"left"==e&&h.left-i<p?"right":e,d.removeClass(l).addClass(e)}var q=this.getCalculatedOffset(e,h,i,j);this.applyPlacement(q,e),this.hoverState=null;var r=function(){c.$element.trigger("shown.bs."+c.type)};a.support.transition&&this.$tip.hasClass("fade")?d.one(a.support.transition.end,r).emulateTransitionEnd(150):r()}},b.prototype.applyPlacement=function(b,c){var d,e=this.tip(),f=e[0].offsetWidth,g=e[0].offsetHeight,h=parseInt(e.css("margin-top"),10),i=parseInt(e.css("margin-left"),10);isNaN(h)&&(h=0),isNaN(i)&&(i=0),b.top=b.top+h,b.left=b.left+i,a.offset.setOffset(e[0],a.extend({using:function(a){e.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),e.addClass("in");var j=e[0].offsetWidth,k=e[0].offsetHeight;if("top"==c&&k!=g&&(d=!0,b.top=b.top+g-k),/bottom|top/.test(c)){var l=0;b.left<0&&(l=-2*b.left,b.left=0,e.offset(b),j=e[0].offsetWidth,k=e[0].offsetHeight),this.replaceArrow(l-f+j,j,"left")}else this.replaceArrow(k-g,k,"top");d&&e.offset(b)},b.prototype.replaceArrow=function(a,b,c){this.arrow().css(c,a?50*(1-a/b)+"%":"")},b.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},b.prototype.hide=function(){function b(){"in"!=c.hoverState&&d.detach(),c.$element.trigger("hidden.bs."+c.type)}var c=this,d=this.tip(),e=a.Event("hide.bs."+this.type);return this.$element.trigger(e),e.isDefaultPrevented()?void 0:(d.removeClass("in"),a.support.transition&&this.$tip.hasClass("fade")?d.one(a.support.transition.end,b).emulateTransitionEnd(150):b(),this.hoverState=null,this)},b.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},b.prototype.hasContent=function(){return this.getTitle()},b.prototype.getPosition=function(){var b=this.$element[0];return a.extend({},"function"==typeof b.getBoundingClientRect?b.getBoundingClientRect():{width:b.offsetWidth,height:b.offsetHeight},this.$element.offset())},b.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},b.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},b.prototype.tip=function(){return this.$tip=this.$tip||a(this.options.template)},b.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},b.prototype.validate=function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},b.prototype.enable=function(){this.enabled=!0},b.prototype.disable=function(){this.enabled=!1},b.prototype.toggleEnabled=function(){this.enabled=!this.enabled},b.prototype.toggle=function(b){var c=b?a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type):this;c.tip().hasClass("in")?c.leave(c):c.enter(c)},b.prototype.destroy=function(){clearTimeout(this.timeout),this.hide().$element.off("."+this.type).removeData("bs."+this.type)};var c=a.fn.tooltip;a.fn.tooltip=function(c){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof c&&c;(e||"destroy"!=c)&&(e||d.data("bs.tooltip",e=new b(this,f)),"string"==typeof c&&e[c]())})},a.fn.tooltip.Constructor=b,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=c,this}}(jQuery);

!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):a(window.jQuery)}(function(a){"use strict";var b=0;a.ajaxTransport("iframe",function(c){if(c.async){var d,e,f,g=c.initialIframeSrc||"javascript:false;";return{send:function(h,i){d=a('<form style="display:none;"></form>'),d.attr("accept-charset",c.formAcceptCharset),f=/\?/.test(c.url)?"&":"?","DELETE"===c.type?(c.url=c.url+f+"_method=DELETE",c.type="POST"):"PUT"===c.type?(c.url=c.url+f+"_method=PUT",c.type="POST"):"PATCH"===c.type&&(c.url=c.url+f+"_method=PATCH",c.type="POST"),b+=1,e=a('<iframe src="'+g+'" name="iframe-transport-'+b+'"></iframe>').bind("load",function(){var b,f=a.isArray(c.paramName)?c.paramName:[c.paramName];e.unbind("load").bind("load",function(){var b;try{if(b=e.contents(),!b.length||!b[0].firstChild)throw new Error}catch(c){b=void 0}i(200,"success",{iframe:b}),a('<iframe src="'+g+'"></iframe>').appendTo(d),window.setTimeout(function(){d.remove()},0)}),d.prop("target",e.prop("name")).prop("action",c.url).prop("method",c.type),c.formData&&a.each(c.formData,function(b,c){a('<input type="hidden"/>').prop("name",c.name).val(c.value).appendTo(d)}),c.fileInput&&c.fileInput.length&&"POST"===c.type&&(b=c.fileInput.clone(),c.fileInput.after(function(a){return b[a]}),c.paramName&&c.fileInput.each(function(b){a(this).prop("name",f[b]||c.paramName)}),d.append(c.fileInput).prop("enctype","multipart/form-data").prop("encoding","multipart/form-data")),d.submit(),b&&b.length&&c.fileInput.each(function(c,d){var e=a(b[c]);a(d).prop("name",e.prop("name")),e.replaceWith(d)})}),d.append(e).appendTo(document.body)},abort:function(){e&&e.unbind("load").prop("src",g),d&&d.remove()}}}}),a.ajaxSetup({converters:{"iframe text":function(b){return b&&a(b[0].body).text()},"iframe json":function(b){return b&&a.parseJSON(a(b[0].body).text())},"iframe html":function(b){return b&&a(b[0].body).html()},"iframe xml":function(b){var c=b&&b[0];return c&&a.isXMLDoc(c)?c:a.parseXML(c.XMLDocument&&c.XMLDocument.xml||a(c.body).html())},"iframe script":function(b){return b&&a.globalEval(a(b[0].body).text())}}})}),function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery","jquery.ui.widget"],a):a(window.jQuery)}(function(a){"use strict";a.support.fileInput=!(new RegExp("(Android (1\\.[0156]|2\\.[01]))|(Windows Phone (OS 7|8\\.0))|(XBLWP)|(ZuneWP)|(WPDesktop)|(w(eb)?OSBrowser)|(webOS)|(Kindle/(1\\.0|2\\.[05]|3\\.0))").test(window.navigator.userAgent)||a('<input type="file">').prop("disabled")),a.support.xhrFileUpload=!(!window.ProgressEvent||!window.FileReader),a.support.xhrFormDataFileUpload=!!window.FormData,a.support.blobSlice=window.Blob&&(Blob.prototype.slice||Blob.prototype.webkitSlice||Blob.prototype.mozSlice),a.widget("blueimp.fileupload",{options:{dropZone:a(document),pasteZone:a(document),fileInput:void 0,replaceFileInput:!0,paramName:void 0,singleFileUploads:!0,limitMultiFileUploads:void 0,limitMultiFileUploadSize:void 0,limitMultiFileUploadSizeOverhead:512,sequentialUploads:!1,limitConcurrentUploads:void 0,forceIframeTransport:!1,redirect:void 0,redirectParamName:void 0,postMessage:void 0,multipart:!0,maxChunkSize:void 0,uploadedBytes:void 0,recalculateProgress:!0,progressInterval:100,bitrateInterval:500,autoUpload:!0,messages:{uploadedBytes:"Uploaded bytes exceed file size"},i18n:function(b,c){return b=this.messages[b]||b.toString(),c&&a.each(c,function(a,c){b=b.replace("{"+a+"}",c)}),b},formData:function(a){return a.serializeArray()},add:function(b,c){return b.isDefaultPrevented()?!1:void((c.autoUpload||c.autoUpload!==!1&&a(this).fileupload("option","autoUpload"))&&c.process().done(function(){c.submit()}))},processData:!1,contentType:!1,cache:!1},_specialOptions:["fileInput","dropZone","pasteZone","multipart","forceIframeTransport"],_blobSlice:a.support.blobSlice&&function(){var a=this.slice||this.webkitSlice||this.mozSlice;return a.apply(this,arguments)},_BitrateTimer:function(){this.timestamp=Date.now?Date.now():(new Date).getTime(),this.loaded=0,this.bitrate=0,this.getBitrate=function(a,b,c){var d=a-this.timestamp;return(!this.bitrate||!c||d>c)&&(this.bitrate=(b-this.loaded)*(1e3/d)*8,this.loaded=b,this.timestamp=a),this.bitrate}},_isXHRUpload:function(b){return!b.forceIframeTransport&&(!b.multipart&&a.support.xhrFileUpload||a.support.xhrFormDataFileUpload)},_getFormData:function(b){var c;return"function"===a.type(b.formData)?b.formData(b.form):a.isArray(b.formData)?b.formData:"object"===a.type(b.formData)?(c=[],a.each(b.formData,function(a,b){c.push({name:a,value:b})}),c):[]},_getTotal:function(b){var c=0;return a.each(b,function(a,b){c+=b.size||1}),c},_initProgressObject:function(b){var c={loaded:0,total:0,bitrate:0};b._progress?a.extend(b._progress,c):b._progress=c},_initResponseObject:function(a){var b;if(a._response)for(b in a._response)a._response.hasOwnProperty(b)&&delete a._response[b];else a._response={}},_onProgress:function(b,c){if(b.lengthComputable){var d,e=Date.now?Date.now():(new Date).getTime();if(c._time&&c.progressInterval&&e-c._time<c.progressInterval&&b.loaded!==b.total)return;c._time=e,d=Math.floor(b.loaded/b.total*(c.chunkSize||c._progress.total))+(c.uploadedBytes||0),this._progress.loaded+=d-c._progress.loaded,this._progress.bitrate=this._bitrateTimer.getBitrate(e,this._progress.loaded,c.bitrateInterval),c._progress.loaded=c.loaded=d,c._progress.bitrate=c.bitrate=c._bitrateTimer.getBitrate(e,d,c.bitrateInterval),this._trigger("progress",a.Event("progress",{delegatedEvent:b}),c),this._trigger("progressall",a.Event("progressall",{delegatedEvent:b}),this._progress)}},_initProgressListener:function(b){var c=this,d=b.xhr?b.xhr():a.ajaxSettings.xhr();d.upload&&(a(d.upload).bind("progress",function(a){var d=a.originalEvent;a.lengthComputable=d.lengthComputable,a.loaded=d.loaded,a.total=d.total,c._onProgress(a,b)}),b.xhr=function(){return d})},_isInstanceOf:function(a,b){return Object.prototype.toString.call(b)==="[object "+a+"]"},_initXHRData:function(b){var c,d=this,e=b.files[0],f=b.multipart||!a.support.xhrFileUpload,g=b.paramName[0];b.headers=a.extend({},b.headers),b.contentRange&&(b.headers["Content-Range"]=b.contentRange),f&&!b.blob&&this._isInstanceOf("File",e)||(b.headers["Content-Disposition"]='attachment; filename="'+encodeURI(e.name)+'"'),f?a.support.xhrFormDataFileUpload&&(b.postMessage?(c=this._getFormData(b),b.blob?c.push({name:g,value:b.blob}):a.each(b.files,function(a,d){c.push({name:b.paramName[a]||g,value:d})})):(d._isInstanceOf("FormData",b.formData)?c=b.formData:(c=new FormData,a.each(this._getFormData(b),function(a,b){c.append(b.name,b.value)})),b.blob?c.append(g,b.blob,e.name):a.each(b.files,function(a,e){(d._isInstanceOf("File",e)||d._isInstanceOf("Blob",e))&&c.append(b.paramName[a]||g,e,e.uploadName||e.name)})),b.data=c):(b.contentType=e.type,b.data=b.blob||e),b.blob=null},_initIframeSettings:function(b){var c=a("<a></a>").prop("href",b.url).prop("host");b.dataType="iframe "+(b.dataType||""),b.formData=this._getFormData(b),b.redirect&&c&&c!==location.host&&b.formData.push({name:b.redirectParamName||"redirect",value:b.redirect})},_initDataSettings:function(a){this._isXHRUpload(a)?(this._chunkedUpload(a,!0)||(a.data||this._initXHRData(a),this._initProgressListener(a)),a.postMessage&&(a.dataType="postmessage "+(a.dataType||""))):this._initIframeSettings(a)},_getParamName:function(b){var c=a(b.fileInput),d=b.paramName;return d?a.isArray(d)||(d=[d]):(d=[],c.each(function(){for(var b=a(this),c=b.prop("name")||"files[]",e=(b.prop("files")||[1]).length;e;)d.push(c),e-=1}),d.length||(d=[c.prop("name")||"files[]"])),d},_initFormSettings:function(b){b.form&&b.form.length||(b.form=a(b.fileInput.prop("form")),b.form.length||(b.form=a(this.options.fileInput.prop("form")))),b.paramName=this._getParamName(b),b.url||(b.url=b.form.prop("action")||location.href),b.type=(b.type||"string"===a.type(b.form.prop("method"))&&b.form.prop("method")||"").toUpperCase(),"POST"!==b.type&&"PUT"!==b.type&&"PATCH"!==b.type&&(b.type="POST"),b.formAcceptCharset||(b.formAcceptCharset=b.form.attr("accept-charset"))},_getAJAXSettings:function(b){var c=a.extend({},this.options,b);return this._initFormSettings(c),this._initDataSettings(c),c},_getDeferredState:function(a){return a.state?a.state():a.isResolved()?"resolved":a.isRejected()?"rejected":"pending"},_enhancePromise:function(a){return a.success=a.done,a.error=a.fail,a.complete=a.always,a},_getXHRPromise:function(b,c,d){var e=a.Deferred(),f=e.promise();return c=c||this.options.context||f,b===!0?e.resolveWith(c,d):b===!1&&e.rejectWith(c,d),f.abort=e.promise,this._enhancePromise(f)},_addConvenienceMethods:function(b,c){var d=this,e=function(b){return a.Deferred().resolveWith(d,b).promise()};c.process=function(b,f){return(b||f)&&(c._processQueue=this._processQueue=(this._processQueue||e([this])).pipe(function(){return c.errorThrown?a.Deferred().rejectWith(d,[c]).promise():e(arguments)}).pipe(b,f)),this._processQueue||e([this])},c.submit=function(){return"pending"!==this.state()&&(c.jqXHR=this.jqXHR=d._trigger("submit",a.Event("submit",{delegatedEvent:b}),this)!==!1&&d._onSend(b,this)),this.jqXHR||d._getXHRPromise()},c.abort=function(){return this.jqXHR?this.jqXHR.abort():(this.errorThrown="abort",d._trigger("fail",null,this),d._getXHRPromise(!1))},c.state=function(){return this.jqXHR?d._getDeferredState(this.jqXHR):this._processQueue?d._getDeferredState(this._processQueue):void 0},c.processing=function(){return!this.jqXHR&&this._processQueue&&"pending"===d._getDeferredState(this._processQueue)},c.progress=function(){return this._progress},c.response=function(){return this._response}},_getUploadedBytes:function(a){var b=a.getResponseHeader("Range"),c=b&&b.split("-"),d=c&&c.length>1&&parseInt(c[1],10);return d&&d+1},_chunkedUpload:function(b,c){b.uploadedBytes=b.uploadedBytes||0;var d,e,f=this,g=b.files[0],h=g.size,i=b.uploadedBytes,j=b.maxChunkSize||h,k=this._blobSlice,l=a.Deferred(),m=l.promise();return this._isXHRUpload(b)&&k&&(i||h>j)&&!b.data?c?!0:i>=h?(g.error=b.i18n("uploadedBytes"),this._getXHRPromise(!1,b.context,[null,"error",g.error])):(e=function(){var c=a.extend({},b),m=c._progress.loaded;c.blob=k.call(g,i,i+j,g.type),c.chunkSize=c.blob.size,c.contentRange="bytes "+i+"-"+(i+c.chunkSize-1)+"/"+h,f._initXHRData(c),f._initProgressListener(c),d=(f._trigger("chunksend",null,c)!==!1&&a.ajax(c)||f._getXHRPromise(!1,c.context)).done(function(d,g,j){i=f._getUploadedBytes(j)||i+c.chunkSize,m+c.chunkSize-c._progress.loaded&&f._onProgress(a.Event("progress",{lengthComputable:!0,loaded:i-c.uploadedBytes,total:i-c.uploadedBytes}),c),b.uploadedBytes=c.uploadedBytes=i,c.result=d,c.textStatus=g,c.jqXHR=j,f._trigger("chunkdone",null,c),f._trigger("chunkalways",null,c),h>i?e():l.resolveWith(c.context,[d,g,j])}).fail(function(a,b,d){c.jqXHR=a,c.textStatus=b,c.errorThrown=d,f._trigger("chunkfail",null,c),f._trigger("chunkalways",null,c),l.rejectWith(c.context,[a,b,d])})},this._enhancePromise(m),m.abort=function(){return d.abort()},e(),m):!1},_beforeSend:function(a,b){0===this._active&&(this._trigger("start"),this._bitrateTimer=new this._BitrateTimer,this._progress.loaded=this._progress.total=0,this._progress.bitrate=0),this._initResponseObject(b),this._initProgressObject(b),b._progress.loaded=b.loaded=b.uploadedBytes||0,b._progress.total=b.total=this._getTotal(b.files)||1,b._progress.bitrate=b.bitrate=0,this._active+=1,this._progress.loaded+=b.loaded,this._progress.total+=b.total},_onDone:function(b,c,d,e){var f=e._progress.total,g=e._response;e._progress.loaded<f&&this._onProgress(a.Event("progress",{lengthComputable:!0,loaded:f,total:f}),e),g.result=e.result=b,g.textStatus=e.textStatus=c,g.jqXHR=e.jqXHR=d,this._trigger("done",null,e)},_onFail:function(a,b,c,d){var e=d._response;d.recalculateProgress&&(this._progress.loaded-=d._progress.loaded,this._progress.total-=d._progress.total),e.jqXHR=d.jqXHR=a,e.textStatus=d.textStatus=b,e.errorThrown=d.errorThrown=c,this._trigger("fail",null,d)},_onAlways:function(a,b,c,d){this._trigger("always",null,d)},_onSend:function(b,c){c.submit||this._addConvenienceMethods(b,c);var d,e,f,g,h=this,i=h._getAJAXSettings(c),j=function(){return h._sending+=1,i._bitrateTimer=new h._BitrateTimer,d=d||((e||h._trigger("send",a.Event("send",{delegatedEvent:b}),i)===!1)&&h._getXHRPromise(!1,i.context,e)||h._chunkedUpload(i)||a.ajax(i)).done(function(a,b,c){h._onDone(a,b,c,i)}).fail(function(a,b,c){h._onFail(a,b,c,i)}).always(function(a,b,c){if(h._onAlways(a,b,c,i),h._sending-=1,h._active-=1,i.limitConcurrentUploads&&i.limitConcurrentUploads>h._sending)for(var d=h._slots.shift();d;){if("pending"===h._getDeferredState(d)){d.resolve();break}d=h._slots.shift()}0===h._active&&h._trigger("stop")})};return this._beforeSend(b,i),this.options.sequentialUploads||this.options.limitConcurrentUploads&&this.options.limitConcurrentUploads<=this._sending?(this.options.limitConcurrentUploads>1?(f=a.Deferred(),this._slots.push(f),g=f.pipe(j)):(this._sequence=this._sequence.pipe(j,j),g=this._sequence),g.abort=function(){return e=[void 0,"abort","abort"],d?d.abort():(f&&f.rejectWith(i.context,e),j())},this._enhancePromise(g)):j()},_onAdd:function(b,c){var d,e,f,g,h=this,i=!0,j=a.extend({},this.options,c),k=c.files,l=k.length,m=j.limitMultiFileUploads,n=j.limitMultiFileUploadSize,o=j.limitMultiFileUploadSizeOverhead,p=0,q=this._getParamName(j),r=0;if(!n||l&&void 0!==k[0].size||(n=void 0),(j.singleFileUploads||m||n)&&this._isXHRUpload(j))if(j.singleFileUploads||n||!m)if(!j.singleFileUploads&&n)for(f=[],d=[],g=0;l>g;g+=1)p+=k[g].size+o,(g+1===l||p+k[g+1].size+o>n)&&(f.push(k.slice(r,g+1)),e=q.slice(r,g+1),e.length||(e=q),d.push(e),r=g+1,p=0);else d=q;else for(f=[],d=[],g=0;l>g;g+=m)f.push(k.slice(g,g+m)),e=q.slice(g,g+m),e.length||(e=q),d.push(e);else f=[k],d=[q];return c.originalFiles=k,a.each(f||k,function(e,g){var j=a.extend({},c);return j.files=f?g:[g],j.paramName=d[e],h._initResponseObject(j),h._initProgressObject(j),h._addConvenienceMethods(b,j),i=h._trigger("add",a.Event("add",{delegatedEvent:b}),j)}),i},_replaceFileInput:function(b){var c=b.clone(!0);a("<form></form>").append(c)[0].reset(),b.after(c).detach(),a.cleanData(b.unbind("remove")),this.options.fileInput=this.options.fileInput.map(function(a,d){return d===b[0]?c[0]:d}),b[0]===this.element[0]&&(this.element=c)},_handleFileTreeEntry:function(b,c){var d,e=this,f=a.Deferred(),g=function(a){a&&!a.entry&&(a.entry=b),f.resolve([a])};return c=c||"",b.isFile?b._file?(b._file.relativePath=c,f.resolve(b._file)):b.file(function(a){a.relativePath=c,f.resolve(a)},g):b.isDirectory?(d=b.createReader(),d.readEntries(function(a){e._handleFileTreeEntries(a,c+b.name+"/").done(function(a){f.resolve(a)}).fail(g)},g)):f.resolve([]),f.promise()},_handleFileTreeEntries:function(b,c){var d=this;return a.when.apply(a,a.map(b,function(a){return d._handleFileTreeEntry(a,c)})).pipe(function(){return Array.prototype.concat.apply([],arguments)})},_getDroppedFiles:function(b){b=b||{};var c=b.items;return c&&c.length&&(c[0].webkitGetAsEntry||c[0].getAsEntry)?this._handleFileTreeEntries(a.map(c,function(a){var b;return a.webkitGetAsEntry?(b=a.webkitGetAsEntry(),b&&(b._file=a.getAsFile()),b):a.getAsEntry()})):a.Deferred().resolve(a.makeArray(b.files)).promise()},_getSingleFileInputFiles:function(b){b=a(b);var c,d,e=b.prop("webkitEntries")||b.prop("entries");if(e&&e.length)return this._handleFileTreeEntries(e);if(c=a.makeArray(b.prop("files")),c.length)void 0===c[0].name&&c[0].fileName&&a.each(c,function(a,b){b.name=b.fileName,b.size=b.fileSize});else{if(d=b.prop("value"),!d)return a.Deferred().resolve([]).promise();c=[{name:d.replace(/^.*\\/,"")}]}return a.Deferred().resolve(c).promise()},_getFileInputFiles:function(b){return b instanceof a&&1!==b.length?a.when.apply(a,a.map(b,this._getSingleFileInputFiles)).pipe(function(){return Array.prototype.concat.apply([],arguments)}):this._getSingleFileInputFiles(b)},_onChange:function(b){var c=this,d={fileInput:a(b.target),form:a(b.target.form)};this._getFileInputFiles(d.fileInput).always(function(e){d.files=e,c.options.replaceFileInput&&c._replaceFileInput(d.fileInput),c._trigger("change",a.Event("change",{delegatedEvent:b}),d)!==!1&&c._onAdd(b,d)})},_onPaste:function(b){var c=b.originalEvent&&b.originalEvent.clipboardData&&b.originalEvent.clipboardData.items,d={files:[]};c&&c.length&&(a.each(c,function(a,b){var c=b.getAsFile&&b.getAsFile();c&&d.files.push(c)}),this._trigger("paste",a.Event("paste",{delegatedEvent:b}),d)!==!1&&this._onAdd(b,d))},_onDrop:function(b){b.dataTransfer=b.originalEvent&&b.originalEvent.dataTransfer;var c=this,d=b.dataTransfer,e={};d&&d.files&&d.files.length&&(b.preventDefault(),this._getDroppedFiles(d).always(function(d){e.files=d,c._trigger("drop",a.Event("drop",{delegatedEvent:b}),e)!==!1&&c._onAdd(b,e)}))},_onDragOver:function(b){b.dataTransfer=b.originalEvent&&b.originalEvent.dataTransfer;var c=b.dataTransfer;c&&-1!==a.inArray("Files",c.types)&&this._trigger("dragover",a.Event("dragover",{delegatedEvent:b}))!==!1&&(b.preventDefault(),c.dropEffect="copy")},_initEventHandlers:function(){this._isXHRUpload(this.options)&&(this._on(this.options.dropZone,{dragover:this._onDragOver,drop:this._onDrop}),this._on(this.options.pasteZone,{paste:this._onPaste})),a.support.fileInput&&this._on(this.options.fileInput,{change:this._onChange})},_destroyEventHandlers:function(){this._off(this.options.dropZone,"dragover drop"),this._off(this.options.pasteZone,"paste"),this._off(this.options.fileInput,"change")},_setOption:function(b,c){var d=-1!==a.inArray(b,this._specialOptions);d&&this._destroyEventHandlers(),this._super(b,c),d&&(this._initSpecialOptions(),this._initEventHandlers())},_initSpecialOptions:function(){var b=this.options;void 0===b.fileInput?b.fileInput=this.element.is('input[type="file"]')?this.element:this.element.find('input[type="file"]'):b.fileInput instanceof a||(b.fileInput=a(b.fileInput)),b.dropZone instanceof a||(b.dropZone=a(b.dropZone)),b.pasteZone instanceof a||(b.pasteZone=a(b.pasteZone))},_getRegExp:function(a){var b=a.split("/"),c=b.pop();return b.shift(),new RegExp(b.join("/"),c)},_isRegExpOption:function(b,c){return"url"!==b&&"string"===a.type(c)&&/^\/.*\/[igm]{0,3}$/.test(c)},_initDataAttributes:function(){var b=this,c=this.options;a.each(a(this.element[0].cloneNode(!1)).data(),function(a,d){b._isRegExpOption(a,d)&&(d=b._getRegExp(d)),c[a]=d})},_create:function(){this._initDataAttributes(),this._initSpecialOptions(),this._slots=[],this._sequence=this._getXHRPromise(!0),this._sending=this._active=0,this._initProgressObject(this),this._initEventHandlers()},active:function(){return this._active},progress:function(){return this._progress},add:function(b){var c=this;b&&!this.options.disabled&&(b.fileInput&&!b.files?this._getFileInputFiles(b.fileInput).always(function(a){b.files=a,c._onAdd(null,b)}):(b.files=a.makeArray(b.files),this._onAdd(null,b)))},send:function(b){if(b&&!this.options.disabled){if(b.fileInput&&!b.files){var c,d,e=this,f=a.Deferred(),g=f.promise();return g.abort=function(){return d=!0,c?c.abort():(f.reject(null,"abort","abort"),g)},this._getFileInputFiles(b.fileInput).always(function(a){if(!d){if(!a.length)return void f.reject();b.files=a,c=e._onSend(null,b).then(function(a,b,c){f.resolve(a,b,c)},function(a,b,c){f.reject(a,b,c)})}}),this._enhancePromise(g)}if(b.files=a.makeArray(b.files),b.files.length)return this._onSend(null,b)}return this._getXHRPromise(!1,b&&b.context)}})});

!function(a,b){"use strict";function c(a,c){var e=this;c=b.extend({mode:"menu",uploadElement:"body",bulkParameterName:"fID"},c),e.options=c,e._templateFileProgress=_.template('<div id="ccm-file-upload-progress" class="ccm-ui"><div id="ccm-file-upload-progress-bar"><div class="progress progress-striped active"><div class="progress-bar" style="width: <%=progress%>%;"></div></div></div></div>'),e._templateSearchResultsMenu=_.template(d.get()),ConcreteAjaxSearch.call(e,a,c),e.setupFileDownloads(),e.setupFileUploads(),e.setupEvents(),"menu"===c.mode&&b('.ccm-search-bulk-action option[value="choose"]').remove()}c.prototype=Object.create(ConcreteAjaxSearch.prototype),c.prototype.setupFileDownloads=function(){var a=this;b("#ccm-file-manager-download-target").length?a.$downloadTarget=b("#ccm-file-manager-download-target"):a.$downloadTarget=b("<iframe />",{name:"ccm-file-manager-download-target",id:"ccm-file-manager-download-target"}).appendTo(document.body)},c.prototype.setupFileUploads=function(){var a=this,c=b(".ccm-file-manager-upload"),d=c.filter("#ccm-file-manager-upload-prompt"),e=[],f=[],g=_.template("<ul><% _(errors).each(function(error) { %><li><strong><%- error.name %></strong><p><%- error.error %></p></li><% }) %></ul>"),h={url:CCM_DISPATCHER_FILENAME+"/ccm/system/file/upload",dataType:"json",formData:{ccm_token:CCM_SECURITY_TOKEN},error:function(a){var b=a.responseText;try{b=jQuery.parseJSON(b).errors;var c=this.files[0].name;_(b).each(function(a){e.push({name:c,error:a})})}catch(d){}},progressall:function(c,d){var e=parseInt(d.loaded/d.total*100,10);b("#ccm-file-upload-progress-wrapper").html(a._templateFileProgress({progress:e}))},start:function(){e=[],b("#ccm-file-upload-progress-wrapper").remove(),b("<div />",{id:"ccm-file-upload-progress-wrapper"}).html(a._templateFileProgress({progress:100})).appendTo(document.body),b.fn.dialog.open({title:ccmi18n_filemanager.uploadProgress,width:400,height:50,element:b("#ccm-file-upload-progress-wrapper"),modal:!0})},done:function(a,b){f.push(b.result[0])},stop:function(){jQuery.fn.dialog.closeTop(),e.length?ConcreteAlert.dialog(ccmi18n_filemanager.uploadFailed,g({errors:e})):(a._launchUploadCompleteDialog(f),f=[])}};d=d.length?d:c.first(),d.fileupload(h)},c.prototype._launchUploadCompleteDialog=function(a){var b=this;c.launchUploadCompleteDialog(a,b)},c.prototype.setupEvents=function(){var a=this;ConcreteEvent.unsubscribe("FileManagerAddFilesComplete"),ConcreteEvent.subscribe("FileManagerAddFilesComplete",function(b,c){a._launchUploadCompleteDialog(c.files)}),ConcreteEvent.unsubscribe("FileManagerDeleteFilesComplete"),ConcreteEvent.subscribe("FileManagerDeleteFilesComplete",function(b,c){a.refreshResults()})},c.prototype.setupStarredResults=function(){var a=this;a.$element.unbind(".concreteFileManagerStar").on("click.concreteFileManagerStar","a[data-search-toggle=star]",function(){var c=b(this),d={fID:b(this).attr("data-search-toggle-file-id")};return a.ajaxUpdate(c.attr("data-search-toggle-url"),d,function(a){a.star?c.parent().addClass("ccm-file-manager-search-results-star-active"):c.parent().removeClass("ccm-file-manager-search-results-star-active")}),!1})},c.prototype.updateResults=function(a){var c=this;ConcreteAjaxSearch.prototype.updateResults.call(c,a),c.setupStarredResults(),"choose"==c.options.mode&&(c.$element.unbind(".concreteFileManagerHoverFile"),c.$element.on("mouseover.concreteFileManagerHoverFile","tr[data-file-manager-file]",function(){b(this).addClass("ccm-search-select-hover")}),c.$element.on("mouseout.concreteFileManagerHoverFile","tr[data-file-manager-file]",function(){b(this).removeClass("ccm-search-select-hover")}),c.$element.unbind(".concreteFileManagerChooseFile").on("click.concreteFileManagerChooseFile","tr[data-file-manager-file]",function(a){return"checkbox"!==b(a.target).prop("type")?(ConcreteEvent.publish("FileManagerBeforeSelectFile",{fID:b(this).attr("data-file-manager-file")}),ConcreteEvent.publish("FileManagerSelectFile",{fID:b(this).attr("data-file-manager-file")}),c.$downloadTarget.remove(),!1):void 0}))},c.prototype.handleSelectedBulkAction=function(a,c,d,e){var f=this,g=[];if(b.each(e,function(a,c){g.push({name:"item[]",value:b(c).val()})}),"choose"==a){var h=g.map(function(a){return a.value});ConcreteEvent.publish("FileManagerBeforeSelectFile",{fID:h}),ConcreteEvent.publish("FileManagerSelectFile",{fID:h})}else"download"==a?f.$downloadTarget.get(0).src=CCM_TOOLS_PATH+"/files/download?"+jQuery.param(g):ConcreteAjaxSearch.prototype.handleSelectedBulkAction.call(this,a,c,d,e)},ConcreteAjaxSearch.prototype.createMenu=function(a){var c=this;a.concreteFileMenu({container:c,menu:b("[data-search-menu="+a.attr("data-launch-search-menu")+"]")})},c.launchDialog=function(a,c){var d,e=b(window).width()-53,f={},g={filters:[],multipleSelection:!1};if(b.extend(g,c),g.filters.length>0)for(f["field[]"]=[],d=0;d<g.filters.length;d++){var h=b.extend(!0,{},g.filters[d]);f["field[]"].push(h.field),delete h.field,b.extend(f,h)}b.fn.dialog.open({width:e,height:"100%",href:CCM_DISPATCHER_FILENAME+"/ccm/system/dialogs/file/search",modal:!0,data:f,title:ccmi18n_filemanager.title,onOpen:function(c){ConcreteEvent.unsubscribe("FileManagerSelectFile"),ConcreteEvent.subscribe("FileManagerSelectFile",function(c,d){var e="[object Array]"===Object.prototype.toString.call(d.fID);if(g.multipleSelection&&!e)d.fID=[d.fID];else if(!g.multipleSelection&&e){if(d.fID.length>1)return b(".ccm-search-bulk-action option:first-child").prop("selected","selected"),void alert(ccmi18n_filemanager.chosenTooMany);d.fID=d.fID[0]}jQuery.fn.dialog.closeTop(),a(d)})}})},c.launchUploadCompleteDialog=function(a,c){if(a&&a.length&&a.length>0){var d="";_.each(a,function(a){d+="fID[]="+a.fID+"&"}),d=d.substring(0,d.length-1),b.fn.dialog.open({width:"660",height:"500",href:CCM_DISPATCHER_FILENAME+"/ccm/system/dialogs/file/upload_complete",modal:!0,data:d,onClose:function(){var a={filemanager:c};ConcreteEvent.publish("FileManagerUploadCompleteDialogClose",a)},onOpen:function(){var a={filemanager:c};ConcreteEvent.publish("FileManagerUploadCompleteDialogOpen",a)},title:ccmi18n_filemanager.uploadComplete})}},c.getFileDetails=function(a,c){b.ajax({type:"post",dataType:"json",url:CCM_DISPATCHER_FILENAME+"/ccm/system/file/get_json",data:{fID:a},error:function(a){ConcreteAlert.dialog("Error",a.responseText)},success:function(a){c(a)}})};var d={get:function(){return'<div class="ccm-ui"><div class="ccm-popover-file-menu popover fade" data-search-file-menu="<%=item.fID%>" data-search-menu="<%=item.fID%>"><div class="arrow"></div><div class="popover-inner"><ul class="dropdown-menu"><% if (typeof(displayClear) != \'undefined\' && displayClear) { %><li><a href="#" data-file-manager-action="clear">'+ccmi18n_filemanager.clear+'</a></li><li class="divider"></li><% } %><% if (item.canViewFile && item.canRead) { %><li><a class="dialog-launch" dialog-modal="false" dialog-append-buttons="true" dialog-width="90%" dialog-height="75%" dialog-title="'+ccmi18n_filemanager.view+'" href="'+CCM_TOOLS_PATH+'/files/view?fID=<%=item.fID%>">'+ccmi18n_filemanager.view+"</a></li><% } %><% if (item.canRead) { %><li><a href=\"#\" onclick=\"window.frames['ccm-file-manager-download-target'].location='"+CCM_TOOLS_PATH+"/files/download?fID=<%=item.fID%>'; return false\">"+ccmi18n_filemanager.download+'</a></li><% } %><% if (item.canEditFile && item.canEditFileContents) { %><li><a class="dialog-launch" dialog-modal="true" dialog-width="90%" dialog-height="70%" dialog-title="'+ccmi18n_filemanager.edit+'" href="'+CCM_TOOLS_PATH+'/files/edit?fID=<%=item.fID%>">'+ccmi18n_filemanager.edit+'</a></li><% } %><li><a class="dialog-launch" dialog-modal="true" dialog-width="850" dialog-height="450" dialog-title="'+ccmi18n_filemanager.properties+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/file/properties?fID=<%=item.fID%>">'+ccmi18n_filemanager.properties+'</a></li><% if (item.canReplaceFile) { %><li><a class="dialog-launch" dialog-modal="true" dialog-width="500" dialog-height="200" dialog-title="'+ccmi18n_filemanager.replace+'" href="'+CCM_TOOLS_PATH+'/files/replace?fID=<%=item.fID%>">'+ccmi18n_filemanager.replace+'</a></li><% } %><% if (item.canCopyFile) { %><li><a href="#" data-file-manager-action="duplicate">'+ccmi18n_filemanager.duplicate+'</a></li><% } %><li><a class="dialog-launch" dialog-modal="true" dialog-width="500" dialog-height="400" dialog-title="'+ccmi18n_filemanager.sets+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/file/sets?fID=<%=item.fID%>">'+ccmi18n_filemanager.sets+'</a></li><% if (item.canDeleteFile || item.canEditFilePermissions) { %><li class="divider"></li><% } %><% if (item.canEditFilePermissions) { %><li><a class="dialog-launch" dialog-modal="true" dialog-width="520" dialog-height="450" dialog-title="'+ccmi18n_filemanager.permissions+'" href="'+CCM_TOOLS_PATH+'/files/permissions?fID=<%=item.fID%>">'+ccmi18n_filemanager.permissions+'</a></li><% } %><% if (item.canDeleteFile) { %><li><a class="dialog-launch" dialog-modal="true" dialog-width="500" dialog-height="200" dialog-title="'+ccmi18n_filemanager.deleteFile+'" href="'+CCM_TOOLS_PATH+'/files/delete?fID=<%=item.fID%>">'+ccmi18n_filemanager.deleteFile+"</a></li><% } %></ul></div></div>"}};b.fn.concreteFileManager=function(a){return b.each(b(this),function(d,e){new c(b(this),a)})},a.ConcreteFileManager=c,a.ConcreteFileManagerMenu=d}(window,$),!function(a,b){"use strict";function c(a,c){var d=this,c=b.extend({chooseText:ccmi18n_filemanager.chooseNew,inputName:"concreteFile",fID:!1,filters:[]},c),e={};e.filters=c.filters,d.$element=a,d.options=c,d._chooseTemplate=_.template(d.chooseTemplate,{options:d.options}),d._loadingTemplate=_.template(d.loadingTemplate),d._fileLoadedTemplate=_.template(d.fileLoadedTemplate),d._fileMenuTemplate=_.template(ConcreteFileManagerMenu.get()),d.$element.append(d._chooseTemplate),d.$element.on("click","div.ccm-file-selector-choose-new",function(){return ConcreteFileManager.launchDialog(function(a){d.loadFile(a.fID)},e),!1}),d.options.fID&&d.loadFile(d.options.fID)}c.prototype={chooseTemplate:'<div class="ccm-file-selector-choose-new"><input type="hidden" name="<%=options.inputName%>" value="0" /><%=options.chooseText%></div>',loadingTemplate:'<div class="ccm-file-selector-loading"><img src="'+CCM_IMAGE_PATH+'/throbber_white_16.gif" /></div>',fileLoadedTemplate:'<div class="ccm-file-selector-file-selected"><input type="hidden" name="<%=inputName%>" value="<%=file.fID%>" /><div class="ccm-file-selector-file-selected-thumbnail"><%=file.resultsThumbnailImg%></div><div class="ccm-file-selector-file-selected-title"><div><%=file.title%></div></div><div class="clearfix"></div></div>',loadFile:function(a){var c=this;c.$element.html(c._loadingTemplate),ConcreteFileManager.getFileDetails(a,function(a){var d=a.files[0];c.$element.html(c._fileLoadedTemplate({inputName:c.options.inputName,file:d})),c.$element.append(c._fileMenuTemplate({displayClear:!0,item:d})),c.$element.find(".ccm-file-selector-file-selected").concreteFileMenu({container:c,menu:b("[data-search-file-menu="+d.fID+"]"),menuLauncherHoverClass:"ccm-file-manager-menu-item-hover"})})}},b.fn.concreteFileSelector=function(a){return b.each(b(this),function(d,e){new c(b(this),a)})},a.ConcreteFileSelector=c}(this,$),!function(a,b,c){"use strict";function d(a,c){var d=this,c=c||{};c=b.extend({container:!1},c),ConcreteMenu.call(d,a,c)}d.prototype=Object.create(ConcreteMenu.prototype),d.prototype.setupMenuOptions=function(a){var d=this,e=ConcreteMenu.prototype,f=a.attr("data-search-file-menu"),g=d.options.container;e.setupMenuOptions(a),a.find("a[data-file-manager-action=clear]").on("click",function(){var a=ConcreteMenuManager.getActiveMenu();return a&&a.hide(),c.defer(function(){g.$element.html(g._chooseTemplate)}),!1}),a.find("a[data-file-manager-action=duplicate]").on("click",function(){return b.concreteAjax({url:CCM_DISPATCHER_FILENAME+"/ccm/system/file/duplicate",data:{fID:f},success:function(a){"undefined"!=typeof g.refreshResults&&g.refreshResults()}}),!1})},b.fn.concreteFileMenu=function(a){return b.each(b(this),function(c,e){new d(b(this),a)})},a.ConcreteFileMenu=d}(this,$,_);

$.fn.chiselAccordion = function(options){

	$(this).each(function(){
		var $el = $(this);

		var accordion = {
			$el:$el,
			$toggler:null,
			$content:null,

			settings:{
				startOpen:true,
				toggleSpeed:200,
				accordionClass:'.chisel-accordion',
				togglerClass:'.chisel-accordion-toggler',
				contentClass:'.chisel-accordion-content',
				openClass:'chisel-accordion-open',
				onOpen:function(){},
				onClose:function(){}
			},

			init:function(){
				var proxy = this;

				//allow nesting of accordions by ony binding elements within current instance
				this.$toggler = this.$el.find(this.settings.togglerClass).not(this.$el.find(this.settings.accordionClass).find(this.settings.togglerClass).get());
				this.$content = this.$el.find(this.settings.contentClass).not(this.$el.find(this.settings.accordionClass).find(this.settings.contentClass).get());

				if(this.settings.startOpen){
					this.$el.addClass(this.settings.openClass);
				}else{
					this.$content.hide();
				}

				this.$toggler.click($.proxy(function(){

					if(this.isOpen()){
						this.close();
					}else{
						this.open();
					}

				},this));
			},

			open:function(){
				this.$el.addClass(this.settings.openClass);
				this.$content.slideDown(this.settings.toggleSpeed,$.proxy(function(){
					this.settings.onOpen();
				},this));
			},

			isOpen:function(){
				return this.$el.hasClass(this.settings.openClass);
			},

			close:function(){
				this.$el.removeClass(this.settings.openClass);
				this.$content.slideUp(this.settings.toggleSpeed,$.proxy(function(){
					this.settings.onClose();
				},this));
			}
		}

		accordion.init();

		$.extend(accordion.settings,options);
		return this;
	});
};
/**
 * Created by jsinek on 2/15/15.
 */


﻿/**
 * autoNumeric.js
 * @author: Bob Knothe
 * @author: Sokolov Yura
 * @version: 1.9.37 - 2015-05-24 GMT 7:00 PM / 19:00
 *
 * Created by Robert J. Knothe on 2010-10-25. Please report any bugs to https://github.com/BobKnothe/autoNumeric
 * Contributor by Sokolov Yura on 2010-11-07
 *
 * Copyright (c) 2011 Robert J. Knothe http://www.decorplanit.com/plugin/
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
(function ($) {
    "use strict";
    /*jslint browser: true*/
    /*global jQuery: false*/
    /*Cross browser routine for getting selected range/cursor position
     */

   /**
     * Cross browser routine for getting selected range/cursor position
     */
    function getElementSelection(that) {
        var position = {};
        if (that.selectionStart === undefined) {
            that.focus();
            var select = document.selection.createRange();
            position.length = select.text.length;
            select.moveStart('character', -that.value.length);
            position.end = select.text.length;
            position.start = position.end - position.length;
        } else {
            position.start = that.selectionStart;
            position.end = that.selectionEnd;
            position.length = position.end - position.start;
        }
        return position;
    }

    /**
     * Cross browser routine for setting selected range/cursor position
     */
    function setElementSelection(that, start, end) {
        if (that.selectionStart === undefined) {
            that.focus();
            var r = that.createTextRange();
            r.collapse(true);
            r.moveEnd('character', end);
            r.moveStart('character', start);
            r.select();
        } else {
            that.selectionStart = start;
            that.selectionEnd = end;
        }
    }

    /**
     * run callbacks in parameters if any
     * any parameter could be a callback:
     * - a function, which invoked with jQuery element, parameters and this parameter name and returns parameter value
     * - a name of function, attached to $(selector).autoNumeric.functionName(){} - which was called previously
     */
    function runCallbacks($this, settings) {
        /**
         * loops through the settings object (option array) to find the following
         * k = option name example k=aNum
         * val = option value example val=0123456789
         */
        $.each(settings, function (k, val) {
            if (typeof val === 'function') {
                settings[k] = val($this, settings, k);
            } else if (typeof $this.autoNumeric[val] === 'function') {
                /**
                 * calls the attached function from the html5 data example: data-a-sign="functionName"
                 */
                settings[k] = $this.autoNumeric[val]($this, settings, k);
            }
        });
    }

    /**
     * Converts the vMin, vMax & mDec string to numeric value
     */
    function convertKeyToNumber(settings, key) {
        if (typeof (settings[key]) === 'string') {
            settings[key] *= 1;
        }
    }

    /**
     * Preparing user defined options for further usage
     * merge them with defaults appropriately
     */
    function autoCode($this, settings) {
        runCallbacks($this, settings);
        settings.tagList = ['b', 'caption', 'cite', 'code', 'dd', 'del', 'div', 'dfn', 'dt', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ins', 'kdb', 'label', 'li', 'output', 'p', 'q', 's', 'sample', 'span', 'strong', 'td', 'th', 'u', 'var'];
        var vmax = settings.vMax.toString().split('.'),
            vmin = (!settings.vMin && settings.vMin !== 0) ? [] : settings.vMin.toString().split('.');
        convertKeyToNumber(settings, 'vMax');
        convertKeyToNumber(settings, 'vMin');
        convertKeyToNumber(settings, 'mDec'); /** set mDec if not defined by user */
        settings.mDec = (settings.mRound === 'CHF') ? '2' : settings.mDec;
        settings.allowLeading = true;
        settings.aNeg = settings.vMin < 0 ? '-' : '';
        vmax[0] = vmax[0].replace('-', '');
        vmin[0] = vmin[0].replace('-', '');
        settings.mInt = Math.max(vmax[0].length, vmin[0].length, 1);
        if (settings.mDec === null) {
            var vmaxLength = 0,
                vminLength = 0;
            if (vmax[1]) {
                vmaxLength = vmax[1].length;
            }
            if (vmin[1]) {
                vminLength = vmin[1].length;
            }
            settings.mDec = Math.max(vmaxLength, vminLength);
        } /** set alternative decimal separator key */
        if (settings.altDec === null && settings.mDec > 0) {
            if (settings.aDec === '.' && settings.aSep !== ',') {
                settings.altDec = ',';
            } else if (settings.aDec === ',' && settings.aSep !== '.') {
                settings.altDec = '.';
            }
        }
        /** cache regexps for autoStrip */
        var aNegReg = settings.aNeg ? '([-\\' + settings.aNeg + ']?)' : '(-?)';
        settings.aNegRegAutoStrip = aNegReg;
        settings.skipFirstAutoStrip = new RegExp(aNegReg + '[^-' + (settings.aNeg ? '\\' + settings.aNeg : '') + '\\' + settings.aDec + '\\d]' + '.*?(\\d|\\' + settings.aDec + '\\d)');
        settings.skipLastAutoStrip = new RegExp('(\\d\\' + settings.aDec + '?)[^\\' + settings.aDec + '\\d]\\D*$');
        var allowed = '-' + settings.aNum + '\\' + settings.aDec;
        settings.allowedAutoStrip = new RegExp('[^' + allowed + ']', 'gi');
        settings.numRegAutoStrip = new RegExp(aNegReg + '(?:\\' + settings.aDec + '?(\\d+\\' + settings.aDec + '\\d+)|(\\d*(?:\\' + settings.aDec + '\\d*)?))');
        return settings;
    }

    /**
     * strips all unwanted characters and leave only a number alert
     */
    function autoStrip(s, settings, strip_zero) {
        if (settings.aSign) { /** remove currency sign */
            while (s.indexOf(settings.aSign) > -1) {
                s = s.replace(settings.aSign, '');
            }
        }
        s = s.replace(settings.skipFirstAutoStrip, '$1$2'); /** first replace anything before digits */
        s = s.replace(settings.skipLastAutoStrip, '$1'); /** then replace anything after digits */
        s = s.replace(settings.allowedAutoStrip, ''); /** then remove any uninterested characters */
        if (settings.altDec) {
            s = s.replace(settings.altDec, settings.aDec);
        } /** get only number string */
        var m = s.match(settings.numRegAutoStrip);
        s = m ? [m[1], m[2], m[3]].join('') : '';
        if ((settings.lZero === 'allow' || settings.lZero === 'keep') && strip_zero !== 'strip') {
            var parts = [],
                nSign = '';
            parts = s.split(settings.aDec);
            if (parts[0].indexOf('-') !== -1) {
                nSign = '-';
                parts[0] = parts[0].replace('-', '');
            }
            if (parts[0].length > settings.mInt && parts[0].charAt(0) === '0') { /** strip leading zero if need */
                parts[0] = parts[0].slice(1);
            }
            s = nSign + parts.join(settings.aDec);
        }
        if ((strip_zero && settings.lZero === 'deny') || (strip_zero && settings.lZero === 'allow' && settings.allowLeading === false)) {
            var strip_reg = '^' + settings.aNegRegAutoStrip + '0*(\\d' + (strip_zero === 'leading' ? ')' : '|$)');
            strip_reg = new RegExp(strip_reg);
            s = s.replace(strip_reg, '$1$2');
        }
        return s;
    }

    /**
     * places or removes brackets on negative values
     * works only when with pSign: 'p'
     */
    function negativeBracket(s, settings) {
        if (settings.pSign === 'p') {
            var brackets = settings.nBracket.split(',');
            if (!settings.hasFocus && !settings.removeBrackets) {
                s = s.replace(settings.aNeg, '');
                s = brackets[0] + s + brackets[1];
            } else if ((settings.hasFocus && s.charAt(0) === brackets[0]) || (settings.removeBrackets && s.charAt(0) === brackets[0])) {
                s = s.replace(brackets[0], settings.aNeg);
                s = s.replace(brackets[1], '');
            }
        }
        return s;
    }

    /**
     * function to handle numbers less than 0 that are stored in Exponential notation ex: .0000001 stored as 1e-7
     */
    function checkValue(value, settings) {
        if (value) {
            var checkSmall = +value;
            if (checkSmall < 0.000001 && checkSmall > -1) {
                value = +value;
                if (value < 0.000001 && value > 0) {
                    value = (value + 10).toString();
                    value = value.substring(1);
                }
                if (value < 0 && value > -1) {
                    value = (value - 10).toString();
                    value = '-' + value.substring(2);
                }
                value = value.toString();
            } else {
                var parts = value.split('.');
                if (parts[1] !== undefined) {
                    if (+parts[1] === 0) {
                        value = parts[0];
                    } else {
                        parts[1] = parts[1].replace(/0*$/, '');
                        value = parts.join('.');
                    }
                }
            }
        }
        return (settings.lZero === 'keep') ? value : value.replace(/^0*(\d)/, '$1');
    }

    /**
     * prepare number string to be converted to real number
     */
    function fixNumber(s, aDec, aNeg) {
        if (aDec && aDec !== '.') {
            s = s.replace(aDec, '.');
        }
        if (aNeg && aNeg !== '-') {
            s = s.replace(aNeg, '-');
        }
        if (!s.match(/\d/)) {
            s += '0';
        }
        return s;
    }

    /**
     * prepare real number to be converted to our format
     */
    function presentNumber(s, aDec, aNeg) {
        if (aNeg && aNeg !== '-') {
            s = s.replace('-', aNeg);
        }
        if (aDec && aDec !== '.') {
            s = s.replace('.', aDec);
        }
        return s;
    }

    /**
     * private function to check for empty value
     */
    function checkEmpty(iv, settings, signOnEmpty) {
        if (iv === '' || iv === settings.aNeg) {
            if (settings.wEmpty === 'zero') {
                return iv + '0';
            }
            if (settings.wEmpty === 'sign' || signOnEmpty) {
                return iv + settings.aSign;
            }
            return iv;
        }
        return null;
    }

    /**
     * private function that formats our number
     */
    function autoGroup(iv, settings) {
        iv = autoStrip(iv, settings);
        var testNeg = iv.replace(',', '.'),
            empty = checkEmpty(iv, settings, true);
        if (empty !== null) {
            return empty;
        }
        var digitalGroup = '';
        if (settings.dGroup === 2) {
            digitalGroup = /(\d)((\d)(\d{2}?)+)$/;
        } else if (settings.dGroup === 4) {
            digitalGroup = /(\d)((\d{4}?)+)$/;
        } else {
            digitalGroup = /(\d)((\d{3}?)+)$/;
        } /** splits the string at the decimal string */
        var ivSplit = iv.split(settings.aDec);
        if (settings.altDec && ivSplit.length === 1) {
            ivSplit = iv.split(settings.altDec);
        } /** assigns the whole number to the a variable (s) */
        var s = ivSplit[0];
        if (settings.aSep) {
            while (digitalGroup.test(s)) { /** re-inserts the thousand separator via a regular expression */
                s = s.replace(digitalGroup, '$1' + settings.aSep + '$2');
            }
        }
        if (settings.mDec !== 0 && ivSplit.length > 1) {
            if (ivSplit[1].length > settings.mDec) {
                ivSplit[1] = ivSplit[1].substring(0, settings.mDec);
            } /** joins the whole number with the decimal value */
            iv = s + settings.aDec + ivSplit[1];
        } else { /** if whole numbers only */
            iv = s;
        }
        if (settings.aSign) {
            var has_aNeg = iv.indexOf(settings.aNeg) !== -1;
            iv = iv.replace(settings.aNeg, '');
            iv = settings.pSign === 'p' ? settings.aSign + iv : iv + settings.aSign;
            if (has_aNeg) {
                iv = settings.aNeg + iv;
            }
        }
        if (testNeg < 0 && settings.nBracket !== null) { /** removes the negative sign and places brackets */
            iv = negativeBracket(iv, settings);
        }
        return iv;
    }

    /**
     * round number after setting by pasting or $().autoNumericSet()
     * private function for round the number
     * please note this handled as text - JavaScript math function can return inaccurate values
     * also this offers multiple rounding methods that are not easily accomplished in JavaScript
     */
    function autoRound(iv, settings) { /** value to string */
        iv = (iv === '') ? '0' : iv.toString();
        convertKeyToNumber(settings, 'mDec'); /** set mDec to number needed when mDec set by 'update method */
        if (settings.mRound === 'CHF') {
            iv = (Math.round(iv * 20) / 20).toString();
        }
        var ivRounded = '',
            i = 0,
            nSign = '',
            rDec = (typeof (settings.aPad) === 'boolean' || settings.aPad === null) ? (settings.aPad ? settings.mDec : 0) : +settings.aPad;
        var truncateZeros = function (ivRounded) { /** truncate not needed zeros */
            var regex = (rDec === 0) ? (/(\.(?:\d*[1-9])?)0*$/) : rDec === 1 ? (/(\.\d(?:\d*[1-9])?)0*$/) : new RegExp('(\\.\\d{' + rDec + '}(?:\\d*[1-9])?)0*$');
            ivRounded = ivRounded.replace(regex, '$1'); /** If there are no decimal places, we don't need a decimal point at the end */
            if (rDec === 0) {
                ivRounded = ivRounded.replace(/\.$/, '');
            }
            return ivRounded;
        };
        if (iv.charAt(0) === '-') { /** Checks if the iv (input Value)is a negative value */
            nSign = '-';
            iv = iv.replace('-', ''); /** removes the negative sign will be added back later if required */
        }
        if (!iv.match(/^\d/)) { /** append a zero if first character is not a digit (then it is likely to be a dot)*/
            iv = '0' + iv;
        }
        if (nSign === '-' && +iv === 0) { /** determines if the value is zero - if zero no negative sign */
            nSign = '';
        }
        if ((+iv > 0 && settings.lZero !== 'keep') || (iv.length > 0 && settings.lZero === 'allow')) { /** trims leading zero's if needed */
            iv = iv.replace(/^0*(\d)/, '$1');
        }
        var dPos = iv.lastIndexOf('.'),
            /** virtual decimal position */
            vdPos = (dPos === -1) ? iv.length - 1 : dPos,
            /** checks decimal places to determine if rounding is required */
            cDec = (iv.length - 1) - vdPos; /** check if no rounding is required */
        if (cDec <= settings.mDec) {
            ivRounded = iv; /** check if we need to pad with zeros */
            if (cDec < rDec) {
                if (dPos === -1) {
                    ivRounded += '.';
                }
                var zeros = '000000';
                while (cDec < rDec) {
                    zeros = zeros.substring(0, rDec - cDec);
                    ivRounded += zeros;
                    cDec += zeros.length;
                }
            } else if (cDec > rDec) {
                ivRounded = truncateZeros(ivRounded);
            } else if (cDec === 0 && rDec === 0) {
                ivRounded = ivRounded.replace(/\.$/, '');
            }
            if (settings.mRound !== 'CHF') {
                return (+ivRounded === 0) ? ivRounded : nSign + ivRounded;
            }
            if (settings.mRound === 'CHF') {
                dPos = ivRounded.lastIndexOf('.');
                iv = ivRounded;
            }

        } /** rounded length of the string after rounding */
        var rLength = dPos + settings.mDec,
            tRound = +iv.charAt(rLength + 1),
            ivArray = iv.substring(0, rLength + 1).split(''),
            odd = (iv.charAt(rLength) === '.') ? (iv.charAt(rLength - 1) % 2) : (iv.charAt(rLength) % 2),
            onePass = true;
        if (odd !== 1) {
            odd = (odd === 0 && (iv.substring(rLength + 2, iv.length) > 0)) ? 1 : 0;
        }
        /*jslint white: true*/
        if ((tRound > 4 && settings.mRound === 'S') || /**                      Round half up symmetric */
            (tRound > 4 && settings.mRound === 'A' && nSign === '') || /**      Round half up asymmetric positive values */
            (tRound > 5 && settings.mRound === 'A' && nSign === '-') || /**     Round half up asymmetric negative values */
            (tRound > 5 && settings.mRound === 's') || /**                      Round half down symmetric */
            (tRound > 5 && settings.mRound === 'a' && nSign === '') || /**      Round half down asymmetric positive values */
            (tRound > 4 && settings.mRound === 'a' && nSign === '-') || /**     Round half down asymmetric negative values */
            (tRound > 5 && settings.mRound === 'B') || /**                      Round half even "Banker's Rounding" */
            (tRound === 5 && settings.mRound === 'B' && odd === 1) || /**       Round half even "Banker's Rounding" */
            (tRound > 0 && settings.mRound === 'C' && nSign === '') || /**      Round to ceiling toward positive infinite */
            (tRound > 0 && settings.mRound === 'F' && nSign === '-') || /**     Round to floor toward negative infinite */
            (tRound > 0 && settings.mRound === 'U') || /**                      round up away from zero */
            (settings.mRound === 'CHF')) { /**                                  Round Swiss FRanc */
            /*jslint white: false*/
            for (i = (ivArray.length - 1); i >= 0; i -= 1) { /** Round up the last digit if required, and continue until no more 9's are found */
                if (ivArray[i] !== '.') {
                    if (settings.mRound === 'CHF' && ivArray[i] <= 2 && onePass) {
                        ivArray[i] = 0;
                        onePass = false;
                        break;
                    }
                    if (settings.mRound === 'CHF' && ivArray[i] <= 7 && onePass) {
                        ivArray[i] = 5;
                        onePass = false;
                        break;
                    }
                    if (settings.mRound === 'CHF' && onePass) {
                        ivArray[i] = 10;
                        onePass = false;
                    } else {
                        ivArray[i] = +ivArray[i] + 1;
                    }
                    if (ivArray[i] < 10) {
                        break;
                    }
                    if (i > 0) {
                        ivArray[i] = '0';
                    }
                }
            }
        }
        ivArray = ivArray.slice(0, rLength + 1); /** Reconstruct the string, converting any 10's to 0's */
        ivRounded = truncateZeros(ivArray.join('')); /** return rounded value */
        return (+ivRounded === 0) ? ivRounded : nSign + ivRounded;
    }

    /**
     * truncate decimal part of a number
     */
    function truncateDecimal(s, settings, paste) {
        var aDec = settings.aDec,
            mDec = settings.mDec;
        s = (paste === 'paste') ? autoRound(s, settings) : s;
        if (aDec && mDec) {
            var parts = s.split(aDec);
            /** truncate decimal part to satisfying length
             * cause we would round it anyway */
            if (parts[1] && parts[1].length > mDec) {
                if (mDec > 0) {
                    parts[1] = parts[1].substring(0, mDec);
                    s = parts.join(aDec);
                } else {
                    s = parts[0];
                }
            }
        }
        return s;
    }

    /**
     * checking that number satisfy format conditions
     * and lays between settings.vMin and settings.vMax
     * and the string length does not exceed the digits in settings.vMin and settings.vMax
     */
    function autoCheck(s, settings) {
        s = autoStrip(s, settings);
        s = truncateDecimal(s, settings);
        s = fixNumber(s, settings.aDec, settings.aNeg);
        var value = +s;
        return value >= settings.vMin && value <= settings.vMax;
    }

    /**
     * Holder object for field properties
     */
    function AutoNumericHolder(that, settings) {
        this.settings = settings;
        this.that = that;
        this.$that = $(that);
        this.formatted = false;
        this.settingsClone = autoCode(this.$that, this.settings);
        this.value = that.value;
    }
    AutoNumericHolder.prototype = {
        init: function (e) {
            this.value = this.that.value;
            this.settingsClone = autoCode(this.$that, this.settings);
            this.ctrlKey = e.ctrlKey;
            this.cmdKey = e.metaKey;
            this.shiftKey = e.shiftKey;
            this.selection = getElementSelection(this.that); /** keypress event overwrites meaningful value of e.keyCode */
            if (e.type === 'keydown' || e.type === 'keyup') {
                this.kdCode = e.keyCode;
            }
            this.which = e.which;
            this.processed = false;
            this.formatted = false;
        },
        setSelection: function (start, end, setReal) {
            start = Math.max(start, 0);
            end = Math.min(end, this.that.value.length);
            this.selection = {
                start: start,
                end: end,
                length: end - start
            };
            if (setReal === undefined || setReal) {
                setElementSelection(this.that, start, end);
            }
        },
        setPosition: function (pos, setReal) {
            this.setSelection(pos, pos, setReal);
        },
        getBeforeAfter: function () {
            var value = this.value,
                left = value.substring(0, this.selection.start),
                right = value.substring(this.selection.end, value.length);
            return [left, right];
        },
        getBeforeAfterStriped: function () {
            var parts = this.getBeforeAfter();
            parts[0] = autoStrip(parts[0], this.settingsClone);
            parts[1] = autoStrip(parts[1], this.settingsClone);
            return parts;
        },

        /**
         * strip parts from excess characters and leading zeroes
         */
        normalizeParts: function (left, right) {
            var settingsClone = this.settingsClone;
            right = autoStrip(right, settingsClone); /** if right is not empty and first character is not aDec, */
            /** we could strip all zeros, otherwise only leading */
            var strip = right.match(/^\d/) ? true : 'leading';
            left = autoStrip(left, settingsClone, strip); /** prevents multiple leading zeros from being entered */
            if ((left === '' || left === settingsClone.aNeg) && settingsClone.lZero === 'deny') {
                if (right > '') {
                    right = right.replace(/^0*(\d)/, '$1');
                }
            }
            var new_value = left + right; /** insert zero if has leading dot */
            if (settingsClone.aDec) {
                var m = new_value.match(new RegExp('^' + settingsClone.aNegRegAutoStrip + '\\' + settingsClone.aDec));
                if (m) {
                    left = left.replace(m[1], m[1] + '0');
                    new_value = left + right;
                }
            } /** insert zero if number is empty and io.wEmpty == 'zero' */
            if (settingsClone.wEmpty === 'zero' && (new_value === settingsClone.aNeg || new_value === '')) {
                left += '0';
            }
            return [left, right];
        },

        /**
         * set part of number to value keeping position of cursor
         */
        setValueParts: function (left, right, paste) {
            var settingsClone = this.settingsClone,
                parts = this.normalizeParts(left, right),
                new_value = parts.join(''),
                position = parts[0].length;
            if (autoCheck(new_value, settingsClone)) {
                new_value = truncateDecimal(new_value, settingsClone, paste);
                if (position > new_value.length) {
                    position = new_value.length;
                }
                this.value = new_value;
                this.setPosition(position, false);
                return true;
            }
            return false;
        },

        /**
         * helper function for expandSelectionOnSign
         * returns sign position of a formatted value
         */
        signPosition: function () {
            var settingsClone = this.settingsClone,
                aSign = settingsClone.aSign,
                that = this.that;
            if (aSign) {
                var aSignLen = aSign.length;
                if (settingsClone.pSign === 'p') {
                    var hasNeg = settingsClone.aNeg && that.value && that.value.charAt(0) === settingsClone.aNeg;
                    return hasNeg ? [1, aSignLen + 1] : [0, aSignLen];
                }
                var valueLen = that.value.length;
                return [valueLen - aSignLen, valueLen];
            }
            return [1000, -1];
        },

        /**
         * expands selection to cover whole sign
         * prevents partial deletion/copying/overwriting of a sign
         */
        expandSelectionOnSign: function (setReal) {
            var sign_position = this.signPosition(),
                selection = this.selection;
            if (selection.start < sign_position[1] && selection.end > sign_position[0]) { /** if selection catches something except sign and catches only space from sign */
                if ((selection.start < sign_position[0] || selection.end > sign_position[1]) && this.value.substring(Math.max(selection.start, sign_position[0]), Math.min(selection.end, sign_position[1])).match(/^\s*$/)) { /** then select without empty space */
                    if (selection.start < sign_position[0]) {
                        this.setSelection(selection.start, sign_position[0], setReal);
                    } else {
                        this.setSelection(sign_position[1], selection.end, setReal);
                    }
                } else { /** else select with whole sign */
                    this.setSelection(Math.min(selection.start, sign_position[0]), Math.max(selection.end, sign_position[1]), setReal);
                }
            }
        },

        /**
         * try to strip pasted value to digits
         */
        checkPaste: function () {
            if (this.valuePartsBeforePaste !== undefined) {
                var parts = this.getBeforeAfter(),

                    oldParts = this.valuePartsBeforePaste;
                delete this.valuePartsBeforePaste; /** try to strip pasted value first */
                parts[0] = parts[0].substr(0, oldParts[0].length) + autoStrip(parts[0].substr(oldParts[0].length), this.settingsClone);
                if (!this.setValueParts(parts[0], parts[1], 'paste')) {
                    this.value = oldParts.join('');
                    this.setPosition(oldParts[0].length, false);
                }
            }
        },

        /**
         * process pasting, cursor moving and skipping of not interesting keys
         * if returns true, further processing is not performed
         */
        skipAllways: function (e) {
            var kdCode = this.kdCode,
                which = this.which,
                ctrlKey = this.ctrlKey,
                cmdKey = this.cmdKey,
                shiftKey = this.shiftKey; /** catch the ctrl up on ctrl-v */
            if (((ctrlKey || cmdKey) && e.type === 'keyup' && this.valuePartsBeforePaste !== undefined) || (shiftKey && kdCode === 45)) {
                this.checkPaste();
                return false;
            }
            /** codes are taken from http://www.cambiaresearch.com/c4/702b8cd1-e5b0-42e6-83ac-25f0306e3e25/Javascript-Char-Codes-Key-Codes.aspx
             * skip Fx keys, windows keys, other special keys
             * Thanks Ney Estrabelli for the FF for Mac meta key support "keycode 224"
             */
            if ((kdCode >= 112 && kdCode <= 123) || (kdCode >= 91 && kdCode <= 93) || (kdCode >= 9 && kdCode <= 31) || (kdCode < 8 && (which === 0 || which === kdCode)) || kdCode === 144 || kdCode === 145 || kdCode === 45 || kdCode === 224) {
                return true;
            }
            if ((ctrlKey || cmdKey) && kdCode === 65) { /** if select all (a=65)*/
                return true;
            }
            if ((ctrlKey || cmdKey) && (kdCode === 67 || kdCode === 86 || kdCode === 88)) { /** if copy (c=67) paste (v=86) or cut (x=88) */
                if (e.type === 'keydown') {
                    this.expandSelectionOnSign();
                }
                if (kdCode === 86 || kdCode === 45) { /** try to prevent wrong paste */
                    if (e.type === 'keydown' || e.type === 'keypress') {
                        if (this.valuePartsBeforePaste === undefined) {
                            this.valuePartsBeforePaste = this.getBeforeAfter();
                        }
                    } else {
                        this.checkPaste();
                    }
                }
                return e.type === 'keydown' || e.type === 'keypress' || kdCode === 67;
            }
            if (ctrlKey || cmdKey) {
                return true;
            }
            if (kdCode === 37 || kdCode === 39) { /** jump over thousand separator */
                var aSep = this.settingsClone.aSep,
                    start = this.selection.start,
                    value = this.that.value;
                if (e.type === 'keydown' && aSep && !this.shiftKey) {
                    if (kdCode === 37 && value.charAt(start - 2) === aSep) {
                        this.setPosition(start - 1);
                    } else if (kdCode === 39 && value.charAt(start + 1) === aSep) {
                        this.setPosition(start + 1);
                    }
                }
                return true;
            }
            if (kdCode >= 34 && kdCode <= 40) {
                return true;
            }
            return false;
        },

        /**
         * process deletion of characters
         * returns true if processing performed
         */
        processAllways: function () {
            var parts; /** process backspace or delete */
            if (this.kdCode === 8 || this.kdCode === 46) {
                if (!this.selection.length) {
                    parts = this.getBeforeAfterStriped();
                    if (this.kdCode === 8) {
                        parts[0] = parts[0].substring(0, parts[0].length - 1);
                    } else {
                        parts[1] = parts[1].substring(1, parts[1].length);
                    }
                    this.setValueParts(parts[0], parts[1]);
                } else {
                    this.expandSelectionOnSign(false);
                    parts = this.getBeforeAfterStriped();
                    this.setValueParts(parts[0], parts[1]);
                }
                return true;
            }
            return false;
        },

        /**
         * process insertion of characters
         * returns true if processing performed
         */
        processKeypress: function () {
            var settingsClone = this.settingsClone,
                cCode = String.fromCharCode(this.which),
                parts = this.getBeforeAfterStriped(),
                left = parts[0],
                right = parts[1]; /** start rules when the decimal character key is pressed */
            /** always use numeric pad dot to insert decimal separator */
            if (cCode === settingsClone.aDec || (settingsClone.altDec && cCode === settingsClone.altDec) || ((cCode === '.' || cCode === ',') && this.kdCode === 110)) { /** do not allow decimal character if no decimal part allowed */
                if (!settingsClone.mDec || !settingsClone.aDec) {
                    return true;
                } /** do not allow decimal character before aNeg character */
                if (settingsClone.aNeg && right.indexOf(settingsClone.aNeg) > -1) {
                    return true;
                } /** do not allow decimal character if other decimal character present */
                if (left.indexOf(settingsClone.aDec) > -1) {
                    return true;
                }
                if (right.indexOf(settingsClone.aDec) > 0) {
                    return true;
                }
                if (right.indexOf(settingsClone.aDec) === 0) {
                    right = right.substr(1);
                }
                this.setValueParts(left + settingsClone.aDec, right);
                return true;
            }
            /**
             * start rule on negative sign & prevent minus if not allowed
             */
            if (cCode === '-' || cCode === '+') {
                if (!settingsClone.aNeg) {
                    return true;
                } /** caret is always after minus */
                if (left === '' && right.indexOf(settingsClone.aNeg) > -1) {
                    left = settingsClone.aNeg;
                    right = right.substring(1, right.length);
                } /** change sign of number, remove part if should */
                if (left.charAt(0) === settingsClone.aNeg) {
                    left = left.substring(1, left.length);
                } else {
                    left = (cCode === '-') ? settingsClone.aNeg + left : left;
                }
                this.setValueParts(left, right);
                return true;
            } /** digits */
            if (cCode >= '0' && cCode <= '9') { /** if try to insert digit before minus */
                if (settingsClone.aNeg && left === '' && right.indexOf(settingsClone.aNeg) > -1) {
                    left = settingsClone.aNeg;
                    right = right.substring(1, right.length);
                }
                if (settingsClone.vMax <= 0 && settingsClone.vMin < settingsClone.vMax && this.value.indexOf(settingsClone.aNeg) === -1 && cCode !== '0') {
                    left = settingsClone.aNeg + left;
                }
                this.setValueParts(left + cCode, right);
                return true;
            } /** prevent any other character */
            return true;
        },

        /**
         * formatting of just processed value with keeping of cursor position
         */
        formatQuick: function () {
            var settingsClone = this.settingsClone,
                parts = this.getBeforeAfterStriped(),
                leftLength = this.value;
            if ((settingsClone.aSep === '' || (settingsClone.aSep !== '' && leftLength.indexOf(settingsClone.aSep) === -1)) && (settingsClone.aSign === '' || (settingsClone.aSign !== '' && leftLength.indexOf(settingsClone.aSign) === -1))) {
                var subParts = [],
                    nSign = '';
                subParts = leftLength.split(settingsClone.aDec);
                if (subParts[0].indexOf('-') > -1) {
                    nSign = '-';
                    subParts[0] = subParts[0].replace('-', '');
                    parts[0] = parts[0].replace('-', '');
                }
                if (subParts[0].length > settingsClone.mInt && parts[0].charAt(0) === '0') { /** strip leading zero if need */
                    parts[0] = parts[0].slice(1);
                }
                parts[0] = nSign + parts[0];
            }
            var value = autoGroup(this.value, this.settingsClone),
                position = value.length;
            if (value) {
                /** prepare regexp which searches for cursor position from unformatted left part */
                var left_ar = parts[0].split(''),
                    i = 0;
                for (i; i < left_ar.length; i += 1) { /** thanks Peter Kovari */
                    if (!left_ar[i].match('\\d')) {
                        left_ar[i] = '\\' + left_ar[i];
                    }
                }
                var leftReg = new RegExp('^.*?' + left_ar.join('.*?'));
                /** search cursor position in formatted value */
                var newLeft = value.match(leftReg);
                if (newLeft) {
                    position = newLeft[0].length;
                    /** if we are just before sign which is in prefix position */
                    if (((position === 0 && value.charAt(0) !== settingsClone.aNeg) || (position === 1 && value.charAt(0) === settingsClone.aNeg)) && settingsClone.aSign && settingsClone.pSign === 'p') {
                        /** place caret after prefix sign */
                        position = this.settingsClone.aSign.length + (value.charAt(0) === '-' ? 1 : 0);
                    }
                } else if (settingsClone.aSign && settingsClone.pSign === 's') {
                    /** if we could not find a place for cursor and have a sign as a suffix */
                    /** place carret before suffix currency sign */
                    position -= settingsClone.aSign.length;
                }
            }
            this.that.value = value;
            this.setPosition(position);
            this.formatted = true;
        }
    };

    /**
    * thanks to Anthony & Evan C
    */
    function autoGet(obj) {
        if (typeof obj === 'string') {
            obj = obj.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
            obj = '#' + obj.replace(/(:|\.)/g, '\\$1');
            /** obj = '#' + obj.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1'); */
            /** possible modification to replace the above 2 lines */
        }
        return $(obj);
    }

    /**
    * function to attach data to the element
    * and imitate the holder
    */
    function getHolder($that, settings, update) {
        var data = $that.data('autoNumeric');
        if (!data) {
            data = {};
            $that.data('autoNumeric', data);
        }
        var holder = data.holder;
        if ((holder === undefined && settings) || update) {
            holder = new AutoNumericHolder($that.get(0), settings);
            data.holder = holder;
        }
        return holder;
    }

    var methods = {

        /**
         * Method to initiate autoNumeric and attached the settings (default and options passed as a parameter
         * $(someSelector).autoNumeric('init'); // initiate autoNumeric with defaults
         * $(someSelector).autoNumeric('init', {option}); // initiate autoNumeric with options
         * $(someSelector).autoNumeric(); // initiate autoNumeric with defaults
         * $(someSelector).autoNumeric({option}); // initiate autoNumeric with options
         * options passes as a parameter example '{aSep: '.', aDec: ',', aSign: '€ '}
         */
        init: function (options) {
            return this.each(function () {
                var $this = $(this),
                    settings = $this.data('autoNumeric'), /** attempt to grab 'autoNumeric' settings, if they don't exist returns "undefined". */
                    tagData = $this.data(), /** attempt to grab HTML5 data, if they don't exist we'll get "undefined".*/
                    $input = $this.is('input[type=text], input[type=hidden], input[type=tel], input:not([type])');
                if (typeof settings !== 'object') { /** If we couldn't grab settings, create them from defaults and passed options. */
                    settings = $.extend({}, $.fn.autoNumeric.defaults, tagData, options, {
                        aNum: '0123456789',
                        hasFocus: false,
                        removeBrackets: false,
                        runOnce: false,
                        tagList: ['b', 'caption', 'cite', 'code', 'dd', 'del', 'div', 'dfn', 'dt', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ins', 'kdb', 'label', 'li', 'output', 'p', 'q', 's', 'sample', 'span', 'strong', 'td', 'th', 'u', 'var']
                    }); /** Merge defaults, tagData and options */
                    if (settings.aDec === settings.aSep) {
                        $.error("autoNumeric will not function properly when the decimal character aDec: '" + settings.aDec + "' and thousand separator aSep: '" + settings.aSep + "' are the same character");
                    }
                    $this.data('autoNumeric', settings); /** Save our new settings */
                } else {
                    return this;
                }
                var holder = getHolder($this, settings);
                if (!$input && $this.prop('tagName').toLowerCase() === 'input') { /** checks for non-supported input types */
                    $.error('The input type "' + $this.prop('type') + '" is not supported by autoNumeric()');

                }
                if ($.inArray($this.prop('tagName').toLowerCase(), settings.tagList) === -1 && $this.prop('tagName').toLowerCase() !== 'input') {
                    $.error("The <" + $this.prop('tagName').toLowerCase() + "> is not supported by autoNumeric()");

                }
                if (settings.runOnce === false && settings.aForm) { /** routine to format default value on page load */
                    if ($input) {
                        var setValue = true;
                        if ($this[0].value === '' && settings.wEmpty === 'empty') {
                            $this[0].value = '';
                            setValue = false;
                        }
                        if ($this[0].value === '' && settings.wEmpty === 'sign') {
                            $this[0].value = settings.aSign;
                            setValue = false;
                        }
                         /** checks for page reload from back button
                          * also checks for ASP.net form post back
                          * the following HTML data attribute is REQUIRED (data-an-default="same value as the value attribute")
                          * example: <asp:TextBox runat="server" id="someID" value="1234.56" data-an-default="1234.56">
                          */
                        if (setValue && $this.val() !== '' && ((settings.anDefault === undefined && $this[0].value === $this.prop('defaultValue')) || (settings.anDefault !== undefined && settings.anDefault.toString() === $this.val()))) {
                            $this.autoNumeric('set', $this.val());
                        }
                    }
                    if ($.inArray($this.prop('tagName').toLowerCase(), settings.tagList) !== -1 && $this.text() !== '') {
                        $this.autoNumeric('set', $this.text());
                    }
                }
                settings.runOnce = true;
                if ($this.is('input[type=text], input[type=hidden], input[type=tel], input:not([type])')) { /**added hidden type */
                    $this.on('keydown.autoNumeric', function (e) {
                        holder = getHolder($this);
                        if (holder.settings.aDec === holder.settings.aSep) {
                            $.error("autoNumeric will not function properly when the decimal character aDec: '" + holder.settings.aDec + "' and thousand separator aSep: '" + holder.settings.aSep + "' are the same character");
                        }
                        if (holder.that.readOnly) {
                            holder.processed = true;
                            return true;
                        }
                        /** The below streamed code / comment allows the "enter" keydown to throw a change() event */
                        /** if (e.keyCode === 13 && holder.inVal !== $this.val()){
                            $this.change();
                            holder.inVal = $this.val();
                        }*/
                        holder.init(e);
                        if (holder.skipAllways(e)) {
                            holder.processed = true;
                            return true;
                        }
                        if (holder.processAllways()) {
                            holder.processed = true;
                            holder.formatQuick();
                            e.preventDefault();
                            return false;
                        }
                        holder.formatted = false;
                        return true;
                    });
                    $this.on('keypress.autoNumeric', function (e) {
                        holder = getHolder($this);
                        var processed = holder.processed;
                        holder.init(e);
                        if (holder.skipAllways(e)) {
                            return true;
                        }
                        if (processed) {
                            e.preventDefault();
                            return false;
                        }
                        if (holder.processAllways() || holder.processKeypress()) {
                            holder.formatQuick();
                            e.preventDefault();
                            return false;
                        }
                        holder.formatted = false;
                    });
                    $this.on('keyup.autoNumeric', function (e) {
                        holder = getHolder($this);
                        holder.init(e);
                        var skip = holder.skipAllways(e);
                        holder.kdCode = 0;
                        delete holder.valuePartsBeforePaste;
                        if ($this[0].value === holder.settings.aSign) { /** added to properly place the caret when only the currency is present */
                            if (holder.settings.pSign === 's') {
                                setElementSelection(this, 0, 0);
                            } else {
                                setElementSelection(this, holder.settings.aSign.length, holder.settings.aSign.length);
                            }
                        }
                        if (skip) {
                            return true;
                        }
                        if (this.value === '') {
                            return true;
                        }
                        if (!holder.formatted) {
                            holder.formatQuick();
                        }
                    });
                    $this.on('focusin.autoNumeric', function () {
                        holder = getHolder($this);
                        var $settings = holder.settingsClone;
                        $settings.hasFocus = true;
                        if ($settings.nBracket !== null) {
                            var checkVal = $this.val();
                            $this.val(negativeBracket(checkVal, $settings));
                        }
                        holder.inVal = $this.val();
                        var onEmpty = checkEmpty(holder.inVal, $settings, true);
                        if (onEmpty !== null && onEmpty !== '') {
                            $this.val(onEmpty);
                        }
                    });
                    $this.on('focusout.autoNumeric', function () {
                        holder = getHolder($this);
                        var $settings = holder.settingsClone,
                            value = $this.val(),
                            origValue = value;
                        $settings.hasFocus = false;
                        var strip_zero = ''; /** added to control leading zero */
                        if ($settings.lZero === 'allow') { /** added to control leading zero */
                            $settings.allowLeading = false;
                            strip_zero = 'leading';
                        }
                        if (value !== '') {
                            value = autoStrip(value, $settings, strip_zero);
                            if (checkEmpty(value, $settings) === null && autoCheck(value, $settings, $this[0])) {
                                value = fixNumber(value, $settings.aDec, $settings.aNeg);
                                value = autoRound(value, $settings);
                                value = presentNumber(value, $settings.aDec, $settings.aNeg);
                            } else {
                                value = '';
                            }
                        }
                        var groupedValue = checkEmpty(value, $settings, false);
                        if (groupedValue === null) {
                            groupedValue = autoGroup(value, $settings);
                        }
                        if (groupedValue !== holder.inVal || groupedValue !== origValue) {
                            $this.change();
                            $this.val(groupedValue);
                            delete holder.inVal;
                        }
                    });
                }
            });
        },

        /**
         * method to remove settings and stop autoNumeric() - does not remove the formatting
         * $(someSelector).autoNumeric('destroy'); // destroy autoNumeric
         * no parameters accepted
         */
        destroy: function () {
            return $(this).each(function () {
                var $this = $(this);
                $this.off('.autoNumeric');
                $this.removeData('autoNumeric');
            });
        },

        /**
         * method to update settings - can be call as many times
         * $(someSelector).autoNumeric('update', {options}); // updates the settings
         * options passes as a parameter example '{aSep: '.', aDec: ',', aSign: '€ '}
         */
        update: function (options) {
            return $(this).each(function () {
                var $this = autoGet($(this)),
                    settings = $this.data('autoNumeric');
                if (typeof settings !== 'object') {
                    $.error("You must initialize autoNumeric('init', {options}) prior to calling the 'update' method");
                }
                var strip = $this.autoNumeric('get');
                settings = $.extend(settings, options);
                getHolder($this, settings, true);
                if (settings.aDec === settings.aSep) {
                    $.error("autoNumeric will not function properly when the decimal character aDec: '" + settings.aDec + "' and thousand separator aSep: '" + settings.aSep + "' are the same character");
                }
                $this.data('autoNumeric', settings);
                if ($this.val() !== '' || $this.text() !== '') {
                    return $this.autoNumeric('set', strip);
                }
                return;
            });
        },

        /**
         * method to format value sent as a parameter ""
         * $(someSelector).autoNumeric('set', 'value'}); // formats the value being passed
         * value passed as a string - can be a integer '1234' or double '1234.56789'
         * must contain only numbers and one decimal (period) character
         */
        set: function (valueIn) {
            if (valueIn === null) {
                return;
            }
            return $(this).each(function () {
                var $this = autoGet($(this)),
                    settings = $this.data('autoNumeric'),
                    value = valueIn.toString(),
                    testValue = valueIn.toString(),
                    $input = $this.is('input[type=text], input[type=hidden], input[type=tel], input:not([type])');
                if (typeof settings !== 'object') {
                    $.error("You must initialize autoNumeric('init', {options}) prior to calling the 'set' method");
                }
                /** allows locale decimal separator to be a comma */
                if ((testValue === $this.attr('value') || testValue === $this.text()) && settings.runOnce === false) {
                    value = value.replace(',', '.');
                }
                if (!$.isNumeric(+value)) {
                    $.error("The value (" + value + ") being 'set' is not numeric and has caused a error to be thrown");
                }
                value = checkValue(value, settings);
                settings.setEvent = true;
                value.toString();
                if (value !== '') {
                    value = autoRound(value, settings);
                }
                value = presentNumber(value, settings.aDec, settings.aNeg);
                if (!autoCheck(value, settings)) {
                    value = autoRound('', settings);
                }
                value = autoGroup(value, settings);
                if ($input) {
                    return $this.val(value);
                }
                if ($.inArray($this.prop('tagName').toLowerCase(), settings.tagList) !== -1) {
                    return $this.text(value);
                }
                return false;
            });
        },

        /**
         * method to get the unformatted that accepts up to one parameter
         * $(someSelector).autoNumeric('get'); no parameters accepted
         * values returned as ISO numeric string "1234.56" where the decimal character is a period
         * only the first element in the selector is returned
         */
        get: function () {
            var $this = autoGet($(this)),
                settings = $this.data('autoNumeric');
            if (typeof settings !== 'object') {
                $.error("You must initialize autoNumeric('init', {options}) prior to calling the 'get' method");
            }
            var getValue = '';
            /** determine the element type then use .eq(0) selector to grab the value of the first element in selector */
            if ($this.is('input[type=text], input[type=hidden], input[type=tel], input:not([type])')) { /**added hidden type */
                getValue = $this.eq(0).val();
            } else if ($.inArray($this.prop('tagName').toLowerCase(), settings.tagList) !== -1) {
                getValue = $this.eq(0).text();
            } else {
                $.error("The <" + $this.prop('tagName').toLowerCase() + "> is not supported by autoNumeric()");
            }
            if ((getValue === '' && settings.wEmpty === 'empty') || (getValue === settings.aSign && (settings.wEmpty === 'sign' || settings.wEmpty === 'empty'))) {
                return '';
            }
            if (getValue !== '' && settings.nBracket !== null) {
                settings.removeBrackets = true;
                getValue = negativeBracket(getValue, settings);
                settings.removeBrackets = false;
            }
            if (settings.runOnce || settings.aForm === false) {
                getValue = autoStrip(getValue, settings);
            }
            getValue = fixNumber(getValue, settings.aDec, settings.aNeg);
            if (+getValue === 0 && settings.lZero !== 'keep') {
                getValue = '0';
            }
            if (settings.lZero === 'keep') {
                return getValue;
            }
            getValue = checkValue(getValue, settings);
            return getValue; /** returned Numeric String */
        },

        /**
         * The 'getString' method used jQuerys .serialize() method that creates a text string in standard URL-encoded notation
         * it then loops through the string and un-formats the inputs with autoNumeric
         * $(someSelector).autoNumeric('getString'); no parameter accepted
         * values returned as ISO numeric string "1234.56" where the decimal character is a period
         */
        getString: function () {
            var isAutoNumeric = false,
                $this = autoGet($(this)),
                formFields = $this.serialize(),
                formParts = formFields.split('&'),
                formIndex = $('form').index($this),
                allFormElements = $('form:eq(' + formIndex + ')'),
                aiIndex = [], /* all input index */
                scIndex = [], /* successful control index */
                rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, /* from jQuery serialize method */
                rsubmittable = /^(?:input|select|textarea|keygen)/i, /* from jQuery serialize method */
                rcheckableType = /^(?:checkbox|radio)$/i,
                rnonAutoNumericTypes = /^(?:button|checkbox|color|date|datetime|datetime-local|email|file|image|month|number|password|radio|range|reset|search|submit|time|url|week)/i,
                count = 0;
            /*jslint unparam: true*/
            /* index of successful elements */
            $.each(allFormElements[0], function (i, field) {
                if (field.name !== '' && rsubmittable.test(field.localName) && !rsubmitterTypes.test(field.type) && !field.disabled && (field.checked || !rcheckableType.test(field.type))) {
                    scIndex.push(count);
                    count = count + 1;
                } else {
                    scIndex.push(-1);
                }
            });
            /* index of all inputs tags except checkbox */
            count = 0;
            $.each(allFormElements[0], function (i, field) {
                if (field.localName === 'input' && (field.type === '' || field.type === 'text' || field.type === 'hidden' || field.type === 'tel')) {
                    aiIndex.push(count);
                    count = count + 1;
                } else {
                    aiIndex.push(-1);
                    if (field.localName === 'input' && rnonAutoNumericTypes.test(field.type)) {
                        count = count + 1;
                    }
                }
            });
            $.each(formParts, function (i, miniParts) {
                miniParts = formParts[i].split('=');
                var scElement = $.inArray(i, scIndex);
                if (scElement > -1 && aiIndex[scElement] > -1) {
                    var testInput = $('form:eq(' + formIndex + ') input:eq(' + aiIndex[scElement] + ')'),
                        settings = testInput.data('autoNumeric');
                    if (typeof settings === 'object') {
                        if (miniParts[1] !== null) {
                            miniParts[1] = $('form:eq(' + formIndex + ') input:eq(' + aiIndex[scElement] + ')').autoNumeric('get').toString();
                            formParts[i] = miniParts.join('=');
                            isAutoNumeric = true;
                        }
                    }
                }
            });
            /*jslint unparam: false*/
            if (!isAutoNumeric) {
                $.error("You must initialize autoNumeric('init', {options}) prior to calling the 'getString' method");
            }
            return formParts.join('&');
        },

        /**
         * The 'getString' method used jQuerys .serializeArray() method that creates array or objects that can be encoded as a JSON string
         * it then loops through the string and un-formats the inputs with autoNumeric
         * $(someSelector).autoNumeric('getArray'); no parameter accepted
         * values returned as ISO numeric string "1234.56" where the decimal character is a period
         */
        getArray: function () {
            var isAutoNumeric = false,
                $this = autoGet($(this)),
                formFields = $this.serializeArray(),
                formIndex = $('form').index($this),
                allFormElements = $('form:eq(' + formIndex + ')'),
                aiIndex = [], /* all input index */
                scIndex = [], /* successful control index */
                rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, /* from jQuery serialize method */
                rsubmittable = /^(?:input|select|textarea|keygen)/i, /* from jQuery serialize method */
                rcheckableType = /^(?:checkbox|radio)$/i,
                rnonAutoNumericTypes = /^(?:button|checkbox|color|date|datetime|datetime-local|email|file|image|month|number|password|radio|range|reset|search|submit|time|url|week)/i,
                count = 0;
            /*jslint unparam: true*/
            /* index of successful elements */
            $.each(allFormElements[0], function (i, field) {
                if (field.name !== '' && rsubmittable.test(field.localName) && !rsubmitterTypes.test(field.type) && !field.disabled && (field.checked || !rcheckableType.test(field.type))) {
                    scIndex.push(count);
                    count = count + 1;
                } else {
                    scIndex.push(-1);
                }
            });
            /* index of all inputs tags */
            count = 0;
            $.each(allFormElements[0], function (i, field) {
                if (field.localName === 'input' && (field.type === '' || field.type === 'text' || field.type === 'hidden' || field.type === 'tel')) {
                    aiIndex.push(count);
                    count = count + 1;
                } else {
                    aiIndex.push(-1);
                    if (field.localName === 'input' && rnonAutoNumericTypes.test(field.type)) {
                        count = count + 1;
                    }
                }
            });
            $.each(formFields, function (i, field) {
                var scElement = $.inArray(i, scIndex);
                if (scElement > -1 && aiIndex[scElement] > -1) {
                    var testInput = $('form:eq(' + formIndex + ') input:eq(' + aiIndex[scElement] + ')'),
                        settings = testInput.data('autoNumeric');
                    if (typeof settings === 'object') {
                        field.value = $('form:eq(' + formIndex + ') input:eq(' + aiIndex[scElement] + ')').autoNumeric('get').toString();
                        isAutoNumeric = true;
                    }
                }
            });
            /*jslint unparam: false*/
            if (!isAutoNumeric) {
                $.error("None of the successful form inputs are initialized by autoNumeric.");
            }
            return formFields;
        },

        /**
        * The 'getSteetings returns the object with autoNumeric settings for those who need to look under the hood
        * $(someSelector).autoNumeric('getSettings'); // no parameters accepted
        * $(someSelector).autoNumeric('getSettings').aDec; // return the aDec setting as a string - ant valid setting can be used
        */
        getSettings: function () {
            var $this = autoGet($(this));
            return $this.eq(0).data('autoNumeric');
        }
    };

    /**
    * autoNumeric function
    */
    $.fn.autoNumeric = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        $.error('Method "' + method + '" is not supported by autoNumeric()');
    };

    /**
    * Defaults are public - these can be overridden by the following:
    * HTML5 data attributes
    * Options passed by the 'init' or 'update' methods
    * Use jQuery's $.extend method - great way to pass ASP.NET current culture settings
    */
    $.fn.autoNumeric.defaults = {
        /** allowed thousand separator characters
         * comma = ','
         * period "full stop" = '.'
         * apostrophe is escaped = '\''
         * space = ' '
         * none = ''
         * NOTE: do not use numeric characters
         */
        aSep: ',',
        /** digital grouping for the thousand separator used in Format
         * dGroup: '2', results in 99,99,99,999 common in India for values less than 1 billion and greater than -1 billion
         * dGroup: '3', results in 999,999,999 default
         * dGroup: '4', results in 9999,9999,9999 used in some Asian countries
         */
        dGroup: '3',
        /** allowed decimal separator characters
         * period "full stop" = '.'
         * comma = ','
         */
        aDec: '.',
        /** allow to declare alternative decimal separator which is automatically replaced by aDec
         * developed for countries the use a comma ',' as the decimal character
         * and have keyboards\numeric pads that have a period 'full stop' as the decimal characters (Spain is an example)
         */
        altDec: null,
        /** allowed currency symbol
         * Must be in quotes aSign: '$', a space is allowed aSign: '$ '
         */
        aSign: '',
        /** placement of currency sign
         * for prefix pSign: 'p',
         * for suffix pSign: 's',
         */
        pSign: 'p',
        /** maximum possible value
         * value must be enclosed in quotes and use the period for the decimal point
         * value must be larger than vMin
         */
        vMax: '9999999999999.99',
        /** minimum possible value
         * value must be enclosed in quotes and use the period for the decimal point
         * value must be smaller than vMax
         */
        vMin: '-9999999999999.99',
        /** max number of decimal places = used to override decimal places set by the vMin & vMax values
         * value must be enclosed in quotes example mDec: '3',
         * This can also set the value via a call back function mDec: 'css:#
         */
        mDec: null,
        /** method used for rounding
         * mRound: 'S', Round-Half-Up Symmetric (default)
         * mRound: 'A', Round-Half-Up Asymmetric
         * mRound: 's', Round-Half-Down Symmetric (lower case s)
         * mRound: 'a', Round-Half-Down Asymmetric (lower case a)
         * mRound: 'B', Round-Half-Even "Bankers Rounding"
         * mRound: 'U', Round Up "Round-Away-From-Zero"
         * mRound: 'D', Round Down "Round-Toward-Zero" - same as truncate
         * mRound: 'C', Round to Ceiling "Toward Positive Infinity"
         * mRound: 'F', Round to Floor "Toward Negative Infinity"
         */
        mRound: 'S',
        /** controls decimal padding
         * aPad: true - always Pad decimals with zeros
         * aPad: false - does not pad with zeros.
         * aPad: `some number` - pad decimals with zero to number different from mDec
         * thanks to Jonas Johansson for the suggestion
         */
        aPad: true,
        /** places brackets on negative value -$ 999.99 to (999.99)
         * visible only when the field does NOT have focus the left and right symbols should be enclosed in quotes and seperated by a comma
         * nBracket: null, nBracket: '(,)', nBracket: '[,]', nBracket: '<,>' or nBracket: '{,}'
         */
        nBracket: null,
        /** Displayed on empty string
         * wEmpty: 'empty', - input can be blank
         * wEmpty: 'zero', - displays zero
         * wEmpty: 'sign', - displays the currency sign
         */
        wEmpty: 'empty',
        /** controls leading zero behavior
         * lZero: 'allow', - allows leading zeros to be entered. Zeros will be truncated when entering additional digits. On focusout zeros will be deleted.
         * lZero: 'deny', - allows only one leading zero on values less than one
         * lZero: 'keep', - allows leading zeros to be entered. on fousout zeros will be retained.
         */
        lZero: 'allow',
        /** determine if the default value will be formatted on page ready.
         * true = automatically formats the default value on page ready
         * false = will not format the default value
         */
        aForm: true
    };
}(jQuery));

//! moment.js
//! version : 2.9.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
(function(a){function b(a,b,c){switch(arguments.length){case 2:return null!=a?a:b;case 3:return null!=a?a:null!=b?b:c;default:throw new Error("Implement me")}}function c(a,b){return Bb.call(a,b)}function d(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1}}function e(a){vb.suppressDeprecationWarnings===!1&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+a)}function f(a,b){var c=!0;return o(function(){return c&&(e(a),c=!1),b.apply(this,arguments)},b)}function g(a,b){sc[a]||(e(b),sc[a]=!0)}function h(a,b){return function(c){return r(a.call(this,c),b)}}function i(a,b){return function(c){return this.localeData().ordinal(a.call(this,c),b)}}function j(a,b){var c,d,e=12*(b.year()-a.year())+(b.month()-a.month()),f=a.clone().add(e,"months");return 0>b-f?(c=a.clone().add(e-1,"months"),d=(b-f)/(f-c)):(c=a.clone().add(e+1,"months"),d=(b-f)/(c-f)),-(e+d)}function k(a,b,c){var d;return null==c?b:null!=a.meridiemHour?a.meridiemHour(b,c):null!=a.isPM?(d=a.isPM(c),d&&12>b&&(b+=12),d||12!==b||(b=0),b):b}function l(){}function m(a,b){b!==!1&&H(a),p(this,a),this._d=new Date(+a._d),uc===!1&&(uc=!0,vb.updateOffset(this),uc=!1)}function n(a){var b=A(a),c=b.year||0,d=b.quarter||0,e=b.month||0,f=b.week||0,g=b.day||0,h=b.hour||0,i=b.minute||0,j=b.second||0,k=b.millisecond||0;this._milliseconds=+k+1e3*j+6e4*i+36e5*h,this._days=+g+7*f,this._months=+e+3*d+12*c,this._data={},this._locale=vb.localeData(),this._bubble()}function o(a,b){for(var d in b)c(b,d)&&(a[d]=b[d]);return c(b,"toString")&&(a.toString=b.toString),c(b,"valueOf")&&(a.valueOf=b.valueOf),a}function p(a,b){var c,d,e;if("undefined"!=typeof b._isAMomentObject&&(a._isAMomentObject=b._isAMomentObject),"undefined"!=typeof b._i&&(a._i=b._i),"undefined"!=typeof b._f&&(a._f=b._f),"undefined"!=typeof b._l&&(a._l=b._l),"undefined"!=typeof b._strict&&(a._strict=b._strict),"undefined"!=typeof b._tzm&&(a._tzm=b._tzm),"undefined"!=typeof b._isUTC&&(a._isUTC=b._isUTC),"undefined"!=typeof b._offset&&(a._offset=b._offset),"undefined"!=typeof b._pf&&(a._pf=b._pf),"undefined"!=typeof b._locale&&(a._locale=b._locale),Kb.length>0)for(c in Kb)d=Kb[c],e=b[d],"undefined"!=typeof e&&(a[d]=e);return a}function q(a){return 0>a?Math.ceil(a):Math.floor(a)}function r(a,b,c){for(var d=""+Math.abs(a),e=a>=0;d.length<b;)d="0"+d;return(e?c?"+":"":"-")+d}function s(a,b){var c={milliseconds:0,months:0};return c.months=b.month()-a.month()+12*(b.year()-a.year()),a.clone().add(c.months,"M").isAfter(b)&&--c.months,c.milliseconds=+b-+a.clone().add(c.months,"M"),c}function t(a,b){var c;return b=M(b,a),a.isBefore(b)?c=s(a,b):(c=s(b,a),c.milliseconds=-c.milliseconds,c.months=-c.months),c}function u(a,b){return function(c,d){var e,f;return null===d||isNaN(+d)||(g(b,"moment()."+b+"(period, number) is deprecated. Please use moment()."+b+"(number, period)."),f=c,c=d,d=f),c="string"==typeof c?+c:c,e=vb.duration(c,d),v(this,e,a),this}}function v(a,b,c,d){var e=b._milliseconds,f=b._days,g=b._months;d=null==d?!0:d,e&&a._d.setTime(+a._d+e*c),f&&pb(a,"Date",ob(a,"Date")+f*c),g&&nb(a,ob(a,"Month")+g*c),d&&vb.updateOffset(a,f||g)}function w(a){return"[object Array]"===Object.prototype.toString.call(a)}function x(a){return"[object Date]"===Object.prototype.toString.call(a)||a instanceof Date}function y(a,b,c){var d,e=Math.min(a.length,b.length),f=Math.abs(a.length-b.length),g=0;for(d=0;e>d;d++)(c&&a[d]!==b[d]||!c&&C(a[d])!==C(b[d]))&&g++;return g+f}function z(a){if(a){var b=a.toLowerCase().replace(/(.)s$/,"$1");a=lc[a]||mc[b]||b}return a}function A(a){var b,d,e={};for(d in a)c(a,d)&&(b=z(d),b&&(e[b]=a[d]));return e}function B(b){var c,d;if(0===b.indexOf("week"))c=7,d="day";else{if(0!==b.indexOf("month"))return;c=12,d="month"}vb[b]=function(e,f){var g,h,i=vb._locale[b],j=[];if("number"==typeof e&&(f=e,e=a),h=function(a){var b=vb().utc().set(d,a);return i.call(vb._locale,b,e||"")},null!=f)return h(f);for(g=0;c>g;g++)j.push(h(g));return j}}function C(a){var b=+a,c=0;return 0!==b&&isFinite(b)&&(c=b>=0?Math.floor(b):Math.ceil(b)),c}function D(a,b){return new Date(Date.UTC(a,b+1,0)).getUTCDate()}function E(a,b,c){return jb(vb([a,11,31+b-c]),b,c).week}function F(a){return G(a)?366:365}function G(a){return a%4===0&&a%100!==0||a%400===0}function H(a){var b;a._a&&-2===a._pf.overflow&&(b=a._a[Db]<0||a._a[Db]>11?Db:a._a[Eb]<1||a._a[Eb]>D(a._a[Cb],a._a[Db])?Eb:a._a[Fb]<0||a._a[Fb]>24||24===a._a[Fb]&&(0!==a._a[Gb]||0!==a._a[Hb]||0!==a._a[Ib])?Fb:a._a[Gb]<0||a._a[Gb]>59?Gb:a._a[Hb]<0||a._a[Hb]>59?Hb:a._a[Ib]<0||a._a[Ib]>999?Ib:-1,a._pf._overflowDayOfYear&&(Cb>b||b>Eb)&&(b=Eb),a._pf.overflow=b)}function I(b){return null==b._isValid&&(b._isValid=!isNaN(b._d.getTime())&&b._pf.overflow<0&&!b._pf.empty&&!b._pf.invalidMonth&&!b._pf.nullInput&&!b._pf.invalidFormat&&!b._pf.userInvalidated,b._strict&&(b._isValid=b._isValid&&0===b._pf.charsLeftOver&&0===b._pf.unusedTokens.length&&b._pf.bigHour===a)),b._isValid}function J(a){return a?a.toLowerCase().replace("_","-"):a}function K(a){for(var b,c,d,e,f=0;f<a.length;){for(e=J(a[f]).split("-"),b=e.length,c=J(a[f+1]),c=c?c.split("-"):null;b>0;){if(d=L(e.slice(0,b).join("-")))return d;if(c&&c.length>=b&&y(e,c,!0)>=b-1)break;b--}f++}return null}function L(a){var b=null;if(!Jb[a]&&Lb)try{b=vb.locale(),require("./locale/"+a),vb.locale(b)}catch(c){}return Jb[a]}function M(a,b){var c,d;return b._isUTC?(c=b.clone(),d=(vb.isMoment(a)||x(a)?+a:+vb(a))-+c,c._d.setTime(+c._d+d),vb.updateOffset(c,!1),c):vb(a).local()}function N(a){return a.match(/\[[\s\S]/)?a.replace(/^\[|\]$/g,""):a.replace(/\\/g,"")}function O(a){var b,c,d=a.match(Pb);for(b=0,c=d.length;c>b;b++)d[b]=rc[d[b]]?rc[d[b]]:N(d[b]);return function(e){var f="";for(b=0;c>b;b++)f+=d[b]instanceof Function?d[b].call(e,a):d[b];return f}}function P(a,b){return a.isValid()?(b=Q(b,a.localeData()),nc[b]||(nc[b]=O(b)),nc[b](a)):a.localeData().invalidDate()}function Q(a,b){function c(a){return b.longDateFormat(a)||a}var d=5;for(Qb.lastIndex=0;d>=0&&Qb.test(a);)a=a.replace(Qb,c),Qb.lastIndex=0,d-=1;return a}function R(a,b){var c,d=b._strict;switch(a){case"Q":return _b;case"DDDD":return bc;case"YYYY":case"GGGG":case"gggg":return d?cc:Tb;case"Y":case"G":case"g":return ec;case"YYYYYY":case"YYYYY":case"GGGGG":case"ggggg":return d?dc:Ub;case"S":if(d)return _b;case"SS":if(d)return ac;case"SSS":if(d)return bc;case"DDD":return Sb;case"MMM":case"MMMM":case"dd":case"ddd":case"dddd":return Wb;case"a":case"A":return b._locale._meridiemParse;case"x":return Zb;case"X":return $b;case"Z":case"ZZ":return Xb;case"T":return Yb;case"SSSS":return Vb;case"MM":case"DD":case"YY":case"GG":case"gg":case"HH":case"hh":case"mm":case"ss":case"ww":case"WW":return d?ac:Rb;case"M":case"D":case"d":case"H":case"h":case"m":case"s":case"w":case"W":case"e":case"E":return Rb;case"Do":return d?b._locale._ordinalParse:b._locale._ordinalParseLenient;default:return c=new RegExp($(Z(a.replace("\\","")),"i"))}}function S(a){a=a||"";var b=a.match(Xb)||[],c=b[b.length-1]||[],d=(c+"").match(jc)||["-",0,0],e=+(60*d[1])+C(d[2]);return"+"===d[0]?e:-e}function T(a,b,c){var d,e=c._a;switch(a){case"Q":null!=b&&(e[Db]=3*(C(b)-1));break;case"M":case"MM":null!=b&&(e[Db]=C(b)-1);break;case"MMM":case"MMMM":d=c._locale.monthsParse(b,a,c._strict),null!=d?e[Db]=d:c._pf.invalidMonth=b;break;case"D":case"DD":null!=b&&(e[Eb]=C(b));break;case"Do":null!=b&&(e[Eb]=C(parseInt(b.match(/\d{1,2}/)[0],10)));break;case"DDD":case"DDDD":null!=b&&(c._dayOfYear=C(b));break;case"YY":e[Cb]=vb.parseTwoDigitYear(b);break;case"YYYY":case"YYYYY":case"YYYYYY":e[Cb]=C(b);break;case"a":case"A":c._meridiem=b;break;case"h":case"hh":c._pf.bigHour=!0;case"H":case"HH":e[Fb]=C(b);break;case"m":case"mm":e[Gb]=C(b);break;case"s":case"ss":e[Hb]=C(b);break;case"S":case"SS":case"SSS":case"SSSS":e[Ib]=C(1e3*("0."+b));break;case"x":c._d=new Date(C(b));break;case"X":c._d=new Date(1e3*parseFloat(b));break;case"Z":case"ZZ":c._useUTC=!0,c._tzm=S(b);break;case"dd":case"ddd":case"dddd":d=c._locale.weekdaysParse(b),null!=d?(c._w=c._w||{},c._w.d=d):c._pf.invalidWeekday=b;break;case"w":case"ww":case"W":case"WW":case"d":case"e":case"E":a=a.substr(0,1);case"gggg":case"GGGG":case"GGGGG":a=a.substr(0,2),b&&(c._w=c._w||{},c._w[a]=C(b));break;case"gg":case"GG":c._w=c._w||{},c._w[a]=vb.parseTwoDigitYear(b)}}function U(a){var c,d,e,f,g,h,i;c=a._w,null!=c.GG||null!=c.W||null!=c.E?(g=1,h=4,d=b(c.GG,a._a[Cb],jb(vb(),1,4).year),e=b(c.W,1),f=b(c.E,1)):(g=a._locale._week.dow,h=a._locale._week.doy,d=b(c.gg,a._a[Cb],jb(vb(),g,h).year),e=b(c.w,1),null!=c.d?(f=c.d,g>f&&++e):f=null!=c.e?c.e+g:g),i=kb(d,e,f,h,g),a._a[Cb]=i.year,a._dayOfYear=i.dayOfYear}function V(a){var c,d,e,f,g=[];if(!a._d){for(e=X(a),a._w&&null==a._a[Eb]&&null==a._a[Db]&&U(a),a._dayOfYear&&(f=b(a._a[Cb],e[Cb]),a._dayOfYear>F(f)&&(a._pf._overflowDayOfYear=!0),d=fb(f,0,a._dayOfYear),a._a[Db]=d.getUTCMonth(),a._a[Eb]=d.getUTCDate()),c=0;3>c&&null==a._a[c];++c)a._a[c]=g[c]=e[c];for(;7>c;c++)a._a[c]=g[c]=null==a._a[c]?2===c?1:0:a._a[c];24===a._a[Fb]&&0===a._a[Gb]&&0===a._a[Hb]&&0===a._a[Ib]&&(a._nextDay=!0,a._a[Fb]=0),a._d=(a._useUTC?fb:eb).apply(null,g),null!=a._tzm&&a._d.setUTCMinutes(a._d.getUTCMinutes()-a._tzm),a._nextDay&&(a._a[Fb]=24)}}function W(a){var b;a._d||(b=A(a._i),a._a=[b.year,b.month,b.day||b.date,b.hour,b.minute,b.second,b.millisecond],V(a))}function X(a){var b=new Date;return a._useUTC?[b.getUTCFullYear(),b.getUTCMonth(),b.getUTCDate()]:[b.getFullYear(),b.getMonth(),b.getDate()]}function Y(b){if(b._f===vb.ISO_8601)return void ab(b);b._a=[],b._pf.empty=!0;var c,d,e,f,g,h=""+b._i,i=h.length,j=0;for(e=Q(b._f,b._locale).match(Pb)||[],c=0;c<e.length;c++)f=e[c],d=(h.match(R(f,b))||[])[0],d&&(g=h.substr(0,h.indexOf(d)),g.length>0&&b._pf.unusedInput.push(g),h=h.slice(h.indexOf(d)+d.length),j+=d.length),rc[f]?(d?b._pf.empty=!1:b._pf.unusedTokens.push(f),T(f,d,b)):b._strict&&!d&&b._pf.unusedTokens.push(f);b._pf.charsLeftOver=i-j,h.length>0&&b._pf.unusedInput.push(h),b._pf.bigHour===!0&&b._a[Fb]<=12&&(b._pf.bigHour=a),b._a[Fb]=k(b._locale,b._a[Fb],b._meridiem),V(b),H(b)}function Z(a){return a.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(a,b,c,d,e){return b||c||d||e})}function $(a){return a.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function _(a){var b,c,e,f,g;if(0===a._f.length)return a._pf.invalidFormat=!0,void(a._d=new Date(0/0));for(f=0;f<a._f.length;f++)g=0,b=p({},a),null!=a._useUTC&&(b._useUTC=a._useUTC),b._pf=d(),b._f=a._f[f],Y(b),I(b)&&(g+=b._pf.charsLeftOver,g+=10*b._pf.unusedTokens.length,b._pf.score=g,(null==e||e>g)&&(e=g,c=b));o(a,c||b)}function ab(a){var b,c,d=a._i,e=fc.exec(d);if(e){for(a._pf.iso=!0,b=0,c=hc.length;c>b;b++)if(hc[b][1].exec(d)){a._f=hc[b][0]+(e[6]||" ");break}for(b=0,c=ic.length;c>b;b++)if(ic[b][1].exec(d)){a._f+=ic[b][0];break}d.match(Xb)&&(a._f+="Z"),Y(a)}else a._isValid=!1}function bb(a){ab(a),a._isValid===!1&&(delete a._isValid,vb.createFromInputFallback(a))}function cb(a,b){var c,d=[];for(c=0;c<a.length;++c)d.push(b(a[c],c));return d}function db(b){var c,d=b._i;d===a?b._d=new Date:x(d)?b._d=new Date(+d):null!==(c=Mb.exec(d))?b._d=new Date(+c[1]):"string"==typeof d?bb(b):w(d)?(b._a=cb(d.slice(0),function(a){return parseInt(a,10)}),V(b)):"object"==typeof d?W(b):"number"==typeof d?b._d=new Date(d):vb.createFromInputFallback(b)}function eb(a,b,c,d,e,f,g){var h=new Date(a,b,c,d,e,f,g);return 1970>a&&h.setFullYear(a),h}function fb(a){var b=new Date(Date.UTC.apply(null,arguments));return 1970>a&&b.setUTCFullYear(a),b}function gb(a,b){if("string"==typeof a)if(isNaN(a)){if(a=b.weekdaysParse(a),"number"!=typeof a)return null}else a=parseInt(a,10);return a}function hb(a,b,c,d,e){return e.relativeTime(b||1,!!c,a,d)}function ib(a,b,c){var d=vb.duration(a).abs(),e=Ab(d.as("s")),f=Ab(d.as("m")),g=Ab(d.as("h")),h=Ab(d.as("d")),i=Ab(d.as("M")),j=Ab(d.as("y")),k=e<oc.s&&["s",e]||1===f&&["m"]||f<oc.m&&["mm",f]||1===g&&["h"]||g<oc.h&&["hh",g]||1===h&&["d"]||h<oc.d&&["dd",h]||1===i&&["M"]||i<oc.M&&["MM",i]||1===j&&["y"]||["yy",j];return k[2]=b,k[3]=+a>0,k[4]=c,hb.apply({},k)}function jb(a,b,c){var d,e=c-b,f=c-a.day();return f>e&&(f-=7),e-7>f&&(f+=7),d=vb(a).add(f,"d"),{week:Math.ceil(d.dayOfYear()/7),year:d.year()}}function kb(a,b,c,d,e){var f,g,h=fb(a,0,1).getUTCDay();return h=0===h?7:h,c=null!=c?c:e,f=e-h+(h>d?7:0)-(e>h?7:0),g=7*(b-1)+(c-e)+f+1,{year:g>0?a:a-1,dayOfYear:g>0?g:F(a-1)+g}}function lb(b){var c,d=b._i,e=b._f;return b._locale=b._locale||vb.localeData(b._l),null===d||e===a&&""===d?vb.invalid({nullInput:!0}):("string"==typeof d&&(b._i=d=b._locale.preparse(d)),vb.isMoment(d)?new m(d,!0):(e?w(e)?_(b):Y(b):db(b),c=new m(b),c._nextDay&&(c.add(1,"d"),c._nextDay=a),c))}function mb(a,b){var c,d;if(1===b.length&&w(b[0])&&(b=b[0]),!b.length)return vb();for(c=b[0],d=1;d<b.length;++d)b[d][a](c)&&(c=b[d]);return c}function nb(a,b){var c;return"string"==typeof b&&(b=a.localeData().monthsParse(b),"number"!=typeof b)?a:(c=Math.min(a.date(),D(a.year(),b)),a._d["set"+(a._isUTC?"UTC":"")+"Month"](b,c),a)}function ob(a,b){return a._d["get"+(a._isUTC?"UTC":"")+b]()}function pb(a,b,c){return"Month"===b?nb(a,c):a._d["set"+(a._isUTC?"UTC":"")+b](c)}function qb(a,b){return function(c){return null!=c?(pb(this,a,c),vb.updateOffset(this,b),this):ob(this,a)}}function rb(a){return 400*a/146097}function sb(a){return 146097*a/400}function tb(a){vb.duration.fn[a]=function(){return this._data[a]}}function ub(a){"undefined"==typeof ender&&(wb=zb.moment,zb.moment=a?f("Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.",vb):vb)}for(var vb,wb,xb,yb="2.9.0",zb="undefined"==typeof global||"undefined"!=typeof window&&window!==global.window?this:global,Ab=Math.round,Bb=Object.prototype.hasOwnProperty,Cb=0,Db=1,Eb=2,Fb=3,Gb=4,Hb=5,Ib=6,Jb={},Kb=[],Lb="undefined"!=typeof module&&module&&module.exports,Mb=/^\/?Date\((\-?\d+)/i,Nb=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,Ob=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,Pb=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,Qb=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,Rb=/\d\d?/,Sb=/\d{1,3}/,Tb=/\d{1,4}/,Ub=/[+\-]?\d{1,6}/,Vb=/\d+/,Wb=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,Xb=/Z|[\+\-]\d\d:?\d\d/gi,Yb=/T/i,Zb=/[\+\-]?\d+/,$b=/[\+\-]?\d+(\.\d{1,3})?/,_b=/\d/,ac=/\d\d/,bc=/\d{3}/,cc=/\d{4}/,dc=/[+-]?\d{6}/,ec=/[+-]?\d+/,fc=/^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,gc="YYYY-MM-DDTHH:mm:ssZ",hc=[["YYYYYY-MM-DD",/[+-]\d{6}-\d{2}-\d{2}/],["YYYY-MM-DD",/\d{4}-\d{2}-\d{2}/],["GGGG-[W]WW-E",/\d{4}-W\d{2}-\d/],["GGGG-[W]WW",/\d{4}-W\d{2}/],["YYYY-DDD",/\d{4}-\d{3}/]],ic=[["HH:mm:ss.SSSS",/(T| )\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],jc=/([\+\-]|\d\d)/gi,kc=("Date|Hours|Minutes|Seconds|Milliseconds".split("|"),{Milliseconds:1,Seconds:1e3,Minutes:6e4,Hours:36e5,Days:864e5,Months:2592e6,Years:31536e6}),lc={ms:"millisecond",s:"second",m:"minute",h:"hour",d:"day",D:"date",w:"week",W:"isoWeek",M:"month",Q:"quarter",y:"year",DDD:"dayOfYear",e:"weekday",E:"isoWeekday",gg:"weekYear",GG:"isoWeekYear"},mc={dayofyear:"dayOfYear",isoweekday:"isoWeekday",isoweek:"isoWeek",weekyear:"weekYear",isoweekyear:"isoWeekYear"},nc={},oc={s:45,m:45,h:22,d:26,M:11},pc="DDD w W M D d".split(" "),qc="M D H h m s w W".split(" "),rc={M:function(){return this.month()+1},MMM:function(a){return this.localeData().monthsShort(this,a)},MMMM:function(a){return this.localeData().months(this,a)},D:function(){return this.date()},DDD:function(){return this.dayOfYear()},d:function(){return this.day()},dd:function(a){return this.localeData().weekdaysMin(this,a)},ddd:function(a){return this.localeData().weekdaysShort(this,a)},dddd:function(a){return this.localeData().weekdays(this,a)},w:function(){return this.week()},W:function(){return this.isoWeek()},YY:function(){return r(this.year()%100,2)},YYYY:function(){return r(this.year(),4)},YYYYY:function(){return r(this.year(),5)},YYYYYY:function(){var a=this.year(),b=a>=0?"+":"-";return b+r(Math.abs(a),6)},gg:function(){return r(this.weekYear()%100,2)},gggg:function(){return r(this.weekYear(),4)},ggggg:function(){return r(this.weekYear(),5)},GG:function(){return r(this.isoWeekYear()%100,2)},GGGG:function(){return r(this.isoWeekYear(),4)},GGGGG:function(){return r(this.isoWeekYear(),5)},e:function(){return this.weekday()},E:function(){return this.isoWeekday()},a:function(){return this.localeData().meridiem(this.hours(),this.minutes(),!0)},A:function(){return this.localeData().meridiem(this.hours(),this.minutes(),!1)},H:function(){return this.hours()},h:function(){return this.hours()%12||12},m:function(){return this.minutes()},s:function(){return this.seconds()},S:function(){return C(this.milliseconds()/100)},SS:function(){return r(C(this.milliseconds()/10),2)},SSS:function(){return r(this.milliseconds(),3)},SSSS:function(){return r(this.milliseconds(),3)},Z:function(){var a=this.utcOffset(),b="+";return 0>a&&(a=-a,b="-"),b+r(C(a/60),2)+":"+r(C(a)%60,2)},ZZ:function(){var a=this.utcOffset(),b="+";return 0>a&&(a=-a,b="-"),b+r(C(a/60),2)+r(C(a)%60,2)},z:function(){return this.zoneAbbr()},zz:function(){return this.zoneName()},x:function(){return this.valueOf()},X:function(){return this.unix()},Q:function(){return this.quarter()}},sc={},tc=["months","monthsShort","weekdays","weekdaysShort","weekdaysMin"],uc=!1;pc.length;)xb=pc.pop(),rc[xb+"o"]=i(rc[xb],xb);for(;qc.length;)xb=qc.pop(),rc[xb+xb]=h(rc[xb],2);rc.DDDD=h(rc.DDD,3),o(l.prototype,{set:function(a){var b,c;for(c in a)b=a[c],"function"==typeof b?this[c]=b:this["_"+c]=b;this._ordinalParseLenient=new RegExp(this._ordinalParse.source+"|"+/\d{1,2}/.source)},_months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),months:function(a){return this._months[a.month()]},_monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),monthsShort:function(a){return this._monthsShort[a.month()]},monthsParse:function(a,b,c){var d,e,f;for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),d=0;12>d;d++){if(e=vb.utc([2e3,d]),c&&!this._longMonthsParse[d]&&(this._longMonthsParse[d]=new RegExp("^"+this.months(e,"").replace(".","")+"$","i"),this._shortMonthsParse[d]=new RegExp("^"+this.monthsShort(e,"").replace(".","")+"$","i")),c||this._monthsParse[d]||(f="^"+this.months(e,"")+"|^"+this.monthsShort(e,""),this._monthsParse[d]=new RegExp(f.replace(".",""),"i")),c&&"MMMM"===b&&this._longMonthsParse[d].test(a))return d;if(c&&"MMM"===b&&this._shortMonthsParse[d].test(a))return d;if(!c&&this._monthsParse[d].test(a))return d}},_weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdays:function(a){return this._weekdays[a.day()]},_weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysShort:function(a){return this._weekdaysShort[a.day()]},_weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),weekdaysMin:function(a){return this._weekdaysMin[a.day()]},weekdaysParse:function(a){var b,c,d;for(this._weekdaysParse||(this._weekdaysParse=[]),b=0;7>b;b++)if(this._weekdaysParse[b]||(c=vb([2e3,1]).day(b),d="^"+this.weekdays(c,"")+"|^"+this.weekdaysShort(c,"")+"|^"+this.weekdaysMin(c,""),this._weekdaysParse[b]=new RegExp(d.replace(".",""),"i")),this._weekdaysParse[b].test(a))return b},_longDateFormat:{LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY LT",LLLL:"dddd, MMMM D, YYYY LT"},longDateFormat:function(a){var b=this._longDateFormat[a];return!b&&this._longDateFormat[a.toUpperCase()]&&(b=this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(a){return a.slice(1)}),this._longDateFormat[a]=b),b},isPM:function(a){return"p"===(a+"").toLowerCase().charAt(0)},_meridiemParse:/[ap]\.?m?\.?/i,meridiem:function(a,b,c){return a>11?c?"pm":"PM":c?"am":"AM"},_calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},calendar:function(a,b,c){var d=this._calendar[a];return"function"==typeof d?d.apply(b,[c]):d},_relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},relativeTime:function(a,b,c,d){var e=this._relativeTime[c];return"function"==typeof e?e(a,b,c,d):e.replace(/%d/i,a)},pastFuture:function(a,b){var c=this._relativeTime[a>0?"future":"past"];return"function"==typeof c?c(b):c.replace(/%s/i,b)},ordinal:function(a){return this._ordinal.replace("%d",a)},_ordinal:"%d",_ordinalParse:/\d{1,2}/,preparse:function(a){return a},postformat:function(a){return a},week:function(a){return jb(a,this._week.dow,this._week.doy).week},_week:{dow:0,doy:6},firstDayOfWeek:function(){return this._week.dow},firstDayOfYear:function(){return this._week.doy},_invalidDate:"Invalid date",invalidDate:function(){return this._invalidDate}}),vb=function(b,c,e,f){var g;return"boolean"==typeof e&&(f=e,e=a),g={},g._isAMomentObject=!0,g._i=b,g._f=c,g._l=e,g._strict=f,g._isUTC=!1,g._pf=d(),lb(g)},vb.suppressDeprecationWarnings=!1,vb.createFromInputFallback=f("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.",function(a){a._d=new Date(a._i+(a._useUTC?" UTC":""))}),vb.min=function(){var a=[].slice.call(arguments,0);return mb("isBefore",a)},vb.max=function(){var a=[].slice.call(arguments,0);return mb("isAfter",a)},vb.utc=function(b,c,e,f){var g;return"boolean"==typeof e&&(f=e,e=a),g={},g._isAMomentObject=!0,g._useUTC=!0,g._isUTC=!0,g._l=e,g._i=b,g._f=c,g._strict=f,g._pf=d(),lb(g).utc()},vb.unix=function(a){return vb(1e3*a)},vb.duration=function(a,b){var d,e,f,g,h=a,i=null;return vb.isDuration(a)?h={ms:a._milliseconds,d:a._days,M:a._months}:"number"==typeof a?(h={},b?h[b]=a:h.milliseconds=a):(i=Nb.exec(a))?(d="-"===i[1]?-1:1,h={y:0,d:C(i[Eb])*d,h:C(i[Fb])*d,m:C(i[Gb])*d,s:C(i[Hb])*d,ms:C(i[Ib])*d}):(i=Ob.exec(a))?(d="-"===i[1]?-1:1,f=function(a){var b=a&&parseFloat(a.replace(",","."));return(isNaN(b)?0:b)*d},h={y:f(i[2]),M:f(i[3]),d:f(i[4]),h:f(i[5]),m:f(i[6]),s:f(i[7]),w:f(i[8])}):null==h?h={}:"object"==typeof h&&("from"in h||"to"in h)&&(g=t(vb(h.from),vb(h.to)),h={},h.ms=g.milliseconds,h.M=g.months),e=new n(h),vb.isDuration(a)&&c(a,"_locale")&&(e._locale=a._locale),e},vb.version=yb,vb.defaultFormat=gc,vb.ISO_8601=function(){},vb.momentProperties=Kb,vb.updateOffset=function(){},vb.relativeTimeThreshold=function(b,c){return oc[b]===a?!1:c===a?oc[b]:(oc[b]=c,!0)},vb.lang=f("moment.lang is deprecated. Use moment.locale instead.",function(a,b){return vb.locale(a,b)}),vb.locale=function(a,b){var c;return a&&(c="undefined"!=typeof b?vb.defineLocale(a,b):vb.localeData(a),c&&(vb.duration._locale=vb._locale=c)),vb._locale._abbr},vb.defineLocale=function(a,b){return null!==b?(b.abbr=a,Jb[a]||(Jb[a]=new l),Jb[a].set(b),vb.locale(a),Jb[a]):(delete Jb[a],null)},vb.langData=f("moment.langData is deprecated. Use moment.localeData instead.",function(a){return vb.localeData(a)}),vb.localeData=function(a){var b;if(a&&a._locale&&a._locale._abbr&&(a=a._locale._abbr),!a)return vb._locale;if(!w(a)){if(b=L(a))return b;a=[a]}return K(a)},vb.isMoment=function(a){return a instanceof m||null!=a&&c(a,"_isAMomentObject")},vb.isDuration=function(a){return a instanceof n};for(xb=tc.length-1;xb>=0;--xb)B(tc[xb]);vb.normalizeUnits=function(a){return z(a)},vb.invalid=function(a){var b=vb.utc(0/0);return null!=a?o(b._pf,a):b._pf.userInvalidated=!0,b},vb.parseZone=function(){return vb.apply(null,arguments).parseZone()},vb.parseTwoDigitYear=function(a){return C(a)+(C(a)>68?1900:2e3)},vb.isDate=x,o(vb.fn=m.prototype,{clone:function(){return vb(this)},valueOf:function(){return+this._d-6e4*(this._offset||0)},unix:function(){return Math.floor(+this/1e3)},toString:function(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},toDate:function(){return this._offset?new Date(+this):this._d},toISOString:function(){var a=vb(this).utc();return 0<a.year()&&a.year()<=9999?"function"==typeof Date.prototype.toISOString?this.toDate().toISOString():P(a,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):P(a,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")},toArray:function(){var a=this;return[a.year(),a.month(),a.date(),a.hours(),a.minutes(),a.seconds(),a.milliseconds()]},isValid:function(){return I(this)},isDSTShifted:function(){return this._a?this.isValid()&&y(this._a,(this._isUTC?vb.utc(this._a):vb(this._a)).toArray())>0:!1},parsingFlags:function(){return o({},this._pf)},invalidAt:function(){return this._pf.overflow},utc:function(a){return this.utcOffset(0,a)},local:function(a){return this._isUTC&&(this.utcOffset(0,a),this._isUTC=!1,a&&this.subtract(this._dateUtcOffset(),"m")),this},format:function(a){var b=P(this,a||vb.defaultFormat);return this.localeData().postformat(b)},add:u(1,"add"),subtract:u(-1,"subtract"),diff:function(a,b,c){var d,e,f=M(a,this),g=6e4*(f.utcOffset()-this.utcOffset());return b=z(b),"year"===b||"month"===b||"quarter"===b?(e=j(this,f),"quarter"===b?e/=3:"year"===b&&(e/=12)):(d=this-f,e="second"===b?d/1e3:"minute"===b?d/6e4:"hour"===b?d/36e5:"day"===b?(d-g)/864e5:"week"===b?(d-g)/6048e5:d),c?e:q(e)},from:function(a,b){return vb.duration({to:this,from:a}).locale(this.locale()).humanize(!b)},fromNow:function(a){return this.from(vb(),a)},calendar:function(a){var b=a||vb(),c=M(b,this).startOf("day"),d=this.diff(c,"days",!0),e=-6>d?"sameElse":-1>d?"lastWeek":0>d?"lastDay":1>d?"sameDay":2>d?"nextDay":7>d?"nextWeek":"sameElse";return this.format(this.localeData().calendar(e,this,vb(b)))},isLeapYear:function(){return G(this.year())},isDST:function(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()},day:function(a){var b=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=a?(a=gb(a,this.localeData()),this.add(a-b,"d")):b},month:qb("Month",!0),startOf:function(a){switch(a=z(a)){case"year":this.month(0);case"quarter":case"month":this.date(1);case"week":case"isoWeek":case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===a?this.weekday(0):"isoWeek"===a&&this.isoWeekday(1),"quarter"===a&&this.month(3*Math.floor(this.month()/3)),this},endOf:function(b){return b=z(b),b===a||"millisecond"===b?this:this.startOf(b).add(1,"isoWeek"===b?"week":b).subtract(1,"ms")},isAfter:function(a,b){var c;return b=z("undefined"!=typeof b?b:"millisecond"),"millisecond"===b?(a=vb.isMoment(a)?a:vb(a),+this>+a):(c=vb.isMoment(a)?+a:+vb(a),c<+this.clone().startOf(b))},isBefore:function(a,b){var c;return b=z("undefined"!=typeof b?b:"millisecond"),"millisecond"===b?(a=vb.isMoment(a)?a:vb(a),+a>+this):(c=vb.isMoment(a)?+a:+vb(a),+this.clone().endOf(b)<c)},isBetween:function(a,b,c){return this.isAfter(a,c)&&this.isBefore(b,c)},isSame:function(a,b){var c;return b=z(b||"millisecond"),"millisecond"===b?(a=vb.isMoment(a)?a:vb(a),+this===+a):(c=+vb(a),+this.clone().startOf(b)<=c&&c<=+this.clone().endOf(b))},min:f("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548",function(a){return a=vb.apply(null,arguments),this>a?this:a}),max:f("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548",function(a){return a=vb.apply(null,arguments),a>this?this:a}),zone:f("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779",function(a,b){return null!=a?("string"!=typeof a&&(a=-a),this.utcOffset(a,b),this):-this.utcOffset()}),utcOffset:function(a,b){var c,d=this._offset||0;return null!=a?("string"==typeof a&&(a=S(a)),Math.abs(a)<16&&(a=60*a),!this._isUTC&&b&&(c=this._dateUtcOffset()),this._offset=a,this._isUTC=!0,null!=c&&this.add(c,"m"),d!==a&&(!b||this._changeInProgress?v(this,vb.duration(a-d,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,vb.updateOffset(this,!0),this._changeInProgress=null)),this):this._isUTC?d:this._dateUtcOffset()},isLocal:function(){return!this._isUTC},isUtcOffset:function(){return this._isUTC},isUtc:function(){return this._isUTC&&0===this._offset},zoneAbbr:function(){return this._isUTC?"UTC":""},zoneName:function(){return this._isUTC?"Coordinated Universal Time":""},parseZone:function(){return this._tzm?this.utcOffset(this._tzm):"string"==typeof this._i&&this.utcOffset(S(this._i)),this},hasAlignedHourOffset:function(a){return a=a?vb(a).utcOffset():0,(this.utcOffset()-a)%60===0},daysInMonth:function(){return D(this.year(),this.month())},dayOfYear:function(a){var b=Ab((vb(this).startOf("day")-vb(this).startOf("year"))/864e5)+1;return null==a?b:this.add(a-b,"d")},quarter:function(a){return null==a?Math.ceil((this.month()+1)/3):this.month(3*(a-1)+this.month()%3)},weekYear:function(a){var b=jb(this,this.localeData()._week.dow,this.localeData()._week.doy).year;return null==a?b:this.add(a-b,"y")},isoWeekYear:function(a){var b=jb(this,1,4).year;return null==a?b:this.add(a-b,"y")},week:function(a){var b=this.localeData().week(this);return null==a?b:this.add(7*(a-b),"d")},isoWeek:function(a){var b=jb(this,1,4).week;return null==a?b:this.add(7*(a-b),"d")},weekday:function(a){var b=(this.day()+7-this.localeData()._week.dow)%7;return null==a?b:this.add(a-b,"d")},isoWeekday:function(a){return null==a?this.day()||7:this.day(this.day()%7?a:a-7)},isoWeeksInYear:function(){return E(this.year(),1,4)},weeksInYear:function(){var a=this.localeData()._week;return E(this.year(),a.dow,a.doy)},get:function(a){return a=z(a),this[a]()},set:function(a,b){var c;if("object"==typeof a)for(c in a)this.set(c,a[c]);else a=z(a),"function"==typeof this[a]&&this[a](b);return this},locale:function(b){var c;return b===a?this._locale._abbr:(c=vb.localeData(b),null!=c&&(this._locale=c),this)},lang:f("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",function(b){return b===a?this.localeData():this.locale(b)}),localeData:function(){return this._locale},_dateUtcOffset:function(){return 15*-Math.round(this._d.getTimezoneOffset()/15)}}),vb.fn.millisecond=vb.fn.milliseconds=qb("Milliseconds",!1),vb.fn.second=vb.fn.seconds=qb("Seconds",!1),vb.fn.minute=vb.fn.minutes=qb("Minutes",!1),vb.fn.hour=vb.fn.hours=qb("Hours",!0),vb.fn.date=qb("Date",!0),vb.fn.dates=f("dates accessor is deprecated. Use date instead.",qb("Date",!0)),vb.fn.year=qb("FullYear",!0),vb.fn.years=f("years accessor is deprecated. Use year instead.",qb("FullYear",!0)),vb.fn.days=vb.fn.day,vb.fn.months=vb.fn.month,vb.fn.weeks=vb.fn.week,vb.fn.isoWeeks=vb.fn.isoWeek,vb.fn.quarters=vb.fn.quarter,vb.fn.toJSON=vb.fn.toISOString,vb.fn.isUTC=vb.fn.isUtc,o(vb.duration.fn=n.prototype,{_bubble:function(){var a,b,c,d=this._milliseconds,e=this._days,f=this._months,g=this._data,h=0;g.milliseconds=d%1e3,a=q(d/1e3),g.seconds=a%60,b=q(a/60),g.minutes=b%60,c=q(b/60),g.hours=c%24,e+=q(c/24),h=q(rb(e)),e-=q(sb(h)),f+=q(e/30),e%=30,h+=q(f/12),f%=12,g.days=e,g.months=f,g.years=h},abs:function(){return this._milliseconds=Math.abs(this._milliseconds),this._days=Math.abs(this._days),this._months=Math.abs(this._months),this._data.milliseconds=Math.abs(this._data.milliseconds),this._data.seconds=Math.abs(this._data.seconds),this._data.minutes=Math.abs(this._data.minutes),this._data.hours=Math.abs(this._data.hours),this._data.months=Math.abs(this._data.months),this._data.years=Math.abs(this._data.years),this},weeks:function(){return q(this.days()/7)},valueOf:function(){return this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*C(this._months/12)
},humanize:function(a){var b=ib(this,!a,this.localeData());return a&&(b=this.localeData().pastFuture(+this,b)),this.localeData().postformat(b)},add:function(a,b){var c=vb.duration(a,b);return this._milliseconds+=c._milliseconds,this._days+=c._days,this._months+=c._months,this._bubble(),this},subtract:function(a,b){var c=vb.duration(a,b);return this._milliseconds-=c._milliseconds,this._days-=c._days,this._months-=c._months,this._bubble(),this},get:function(a){return a=z(a),this[a.toLowerCase()+"s"]()},as:function(a){var b,c;if(a=z(a),"month"===a||"year"===a)return b=this._days+this._milliseconds/864e5,c=this._months+12*rb(b),"month"===a?c:c/12;switch(b=this._days+Math.round(sb(this._months/12)),a){case"week":return b/7+this._milliseconds/6048e5;case"day":return b+this._milliseconds/864e5;case"hour":return 24*b+this._milliseconds/36e5;case"minute":return 24*b*60+this._milliseconds/6e4;case"second":return 24*b*60*60+this._milliseconds/1e3;case"millisecond":return Math.floor(24*b*60*60*1e3)+this._milliseconds;default:throw new Error("Unknown unit "+a)}},lang:vb.fn.lang,locale:vb.fn.locale,toIsoString:f("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",function(){return this.toISOString()}),toISOString:function(){var a=Math.abs(this.years()),b=Math.abs(this.months()),c=Math.abs(this.days()),d=Math.abs(this.hours()),e=Math.abs(this.minutes()),f=Math.abs(this.seconds()+this.milliseconds()/1e3);return this.asSeconds()?(this.asSeconds()<0?"-":"")+"P"+(a?a+"Y":"")+(b?b+"M":"")+(c?c+"D":"")+(d||e||f?"T":"")+(d?d+"H":"")+(e?e+"M":"")+(f?f+"S":""):"P0D"},localeData:function(){return this._locale},toJSON:function(){return this.toISOString()}}),vb.duration.fn.toString=vb.duration.fn.toISOString;for(xb in kc)c(kc,xb)&&tb(xb.toLowerCase());vb.duration.fn.asMilliseconds=function(){return this.as("ms")},vb.duration.fn.asSeconds=function(){return this.as("s")},vb.duration.fn.asMinutes=function(){return this.as("m")},vb.duration.fn.asHours=function(){return this.as("h")},vb.duration.fn.asDays=function(){return this.as("d")},vb.duration.fn.asWeeks=function(){return this.as("weeks")},vb.duration.fn.asMonths=function(){return this.as("M")},vb.duration.fn.asYears=function(){return this.as("y")},vb.locale("en",{ordinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(a){var b=a%10,c=1===C(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c}}),Lb?module.exports=vb:"function"==typeof define&&define.amd?(define(function(a,b,c){return c.config&&c.config()&&c.config().noGlobal===!0&&(zb.moment=wb),vb}),ub(!0)):ub()}).call(this);

var CCM_EDITOR_SECURITY_TOKEN = $('.chisel-redactor-editor').eq(0).data('editor-security-token');

var chisel = {
	fieldDefaults:$('#chisel').data('field-defaults'),
	lastScrollPosition:0,
	settings:{
		sortable:{
			axis:'y',
			containment:'parent',
			handle:'.chisel-move-item'
		},
		datePicker:{
			dateFormat: 'MM d, yy',
			changeYear:true,
			showAnim:'fadeIn'
		},
		colorPicker:{
			showInput:true,
			showInitial:true,
			preferredFormat:'hex',
			allowEmpty:true,
			showAlpha:true
		},
		slider:{
			range:'min',
			slide:function(event,ui){
				var $sliderField = $(this).closest('.chisel-slider-field');
				$sliderField.find('input').val(ui.value);
				$sliderField.find('.chisel-slider-value').html(ui.value);
			}
		},
		select2:{

		}
	},
	datepickerCount:0,
	radioCount:1,
	trash:{},

	//hooks
	onAddRepeatable:function(repeatable){},
	onRemoveRepeatale:function(repeatable){},
	onBeforeSave:function(data){},

	getTrash:function(){
		return this.trash;
	},

	addToTrash:function(table,id){

		if(!this.trash[table]){
			this.trash[table] = new Array();
		}

		this.trash[table].push(id);
	},

	removeRepeatable:function($row){
		var $section = $row.closest('.chisel-section');
		var $id = $row.find('*[name*="[id]"]').eq(0);
		var id = $id.val();

		$row.remove();

		if(id){
			//if has id, needs to be removed from database
			var table = $id.parent().data('chisel-table-name');
			this.addToTrash(table,id);
		}

		this.updateSectionItemCount($section);;
	},

	updateSectionItemCount:function($accordion){
		$accordion.each(function(){

			var $toggler = $(this).chiselSectionElements('.chisel-accordion-toggler');
			var $counter = $toggler.find('.chisel-row-count');
			var $rows = $(this).chiselSectionElements('.chisel-row');
			var count = $rows.length;

			$(this).children('.chisel-repeatables').attr('data-repeatable-count',count);
			$counter.html(count);

			if(count && !$toggler.is(':visible')){
				$toggler.show();
			}

			if(!count){
				$toggler.hide();
			}
		});

		return this;
	},

	validate:function(){
		var $fields = $('.chisel-required');

		var success = true;

		$fields.each(function(){
			var $field = $(this).find('*[name]').not('*[type="radio"]');
			var val = $field.val();

			if(!val || val == 0){
				success = false;
				$(this).append('<span class="chisel-submit-failed"><i class="fa fa-exclamation-circle"></i></span>');
			}else{
				$(this).find('.chisel-submit-failed').remove();
			}
		});

		if(!success){
			ConcreteAlert.error({icon:'exclamation',message:'Missing Required Fields'});
		}

		return success;
	},

	getFormData:function($repeatableSections){
		var proxy = this;
		var data = {};

		if(!$repeatableSections){
			//treat as top row
			$repeatableSections = $('#chisel').find('.chisel-section').not('.chisel-section .chisel-section');
		}

		if($repeatableSections.length) {
			//loop through sections
			$repeatableSections.each(function () {

				//check for rows in section
				$repeatableRows = $(this).find('.chisel-row').not($(this).find('.chisel-section .chisel-row').get());

				if ($repeatableRows.length) {
					//loop through rows
					$repeatableRows.each(function (i) {

						//get fields in row
						var table = $(this).find('*[data-chisel-table-name]').eq(0).data('chisel-table-name');
						var $fields = $(this).find('.chisel-field').not($(this).find('.chisel-section .chisel-field').get());

						//create table reference if none created yet
						if (!data[table]) {
							data[table] = new Array();
						}

						//create object for this field
						data[table][i] = {};

						//get fields and store their data
						$fields.each(function () {
							var name = $(this).data('chisel-field-name');
							var value = $(this).find('*[name]').not('input[type="radio"]').val();

							if($(this).hasClass('chisel-price-field') || $(this).hasClass('chisel-number-field') || $(this).hasClass('chisel-decimal-field')){
								value = value.replace(/,/g,'');
							}

							data[table][i][name] = value;
						});

						//get sub-repeatables for this row
						var $subSubRepeatables = $(this).find('.chisel-section .chisel-section').get();
						var $subRepeatables = $(this).find('.chisel-section').has('.chisel-row').not($subSubRepeatables);

						if ($subRepeatables.length) {
							//assign sub-repeatable data to this field
							data[table][i].fields = proxy.getFormData($subRepeatables);
						}
					});
				}

			});
		}
		return data;
	},

	initFilePicker:function($el){
		$el.each(function(){
			var options = {
				chooseText: $(this).data('chisel-file-picker-label'),
				inputName: $(this).data('chisel-input-name'),
				fID: $(this).data('chisel-input-value')
			};

			var typeFilter = $(this).data('chisel-file-type');
			if(typeFilter){
				options.filters = [{
					field: 'type',
					type:typeFilter
				}];
			}

			$(this).concreteFileSelector(options);
		});

		return this;
	},

	initPagePicker:function($el){
		$el.each(function(){
			var options = {
				chooseText: $(this).data('chisel-page-selector-label'),
				loadingText: ccmi18n_sitemap.loadingText,
				inputName: $(this).data('chisel-input-name'),
				cID: parseInt($(this).data('chisel-input-value'))
			};

			$(this).concretePageSelector(options);
		});

		return this;
	},

	initSortable:function($el){
		$el.sortable(chisel.settings.sortable);
		return this;
	},

	initColorPicker:function($el){
		$el.spectrum(chisel.settings.colorPicker);

		//fix for concrete bug that prevents focusing on color picker's input field - thanks totto
		this.settings.colorPicker.appendTo = ".ui-dialog";
		return this;
	},

	initSlider:function($el){
		$el.each(function(){
			$(this).slider($.extend(chisel.settings.slider,$(this).data('options')));
		});
		return this;
	},

	initRedactor:function($el){
		$el.each(function(){

			CCM_EDITOR_SECURITY_TOKEN = $(this).data('editor-security-token');

			$(this).redactor({
				minHeight: '200',
				'concrete5': {
					filemanager: $(this).data('file-manager-access'),
					sitemap: $(this).data('sitemap-access'),
					lightbox: true
				},
				'plugins': ['fontcolor', 'concrete5inline', 'concrete5', 'underline']
			});


			$(this).siblings('textarea').attr('name',$(this).attr('name'));
			$(this).removeAttr('name');
		});
		return this;
	},

	initIconPicker:function($el){
		$el.click(function(){
			var $icon = $('.fa',this).clone();
			var icon = $(this).data('icon');
			var code = $(this).data('code');

			$wrapper = $(this).closest('.chisel-icon-selector');
			$wrapper.find('.selected-icon').html($icon);
			$wrapper.find('input[type="hidden"]').val(code);
		});

		return this;
	},

	initAccordion:function($el){
		$el.chiselAccordion();
		return this;
	},

	initRadioButtons:function($el){
		$el.each(function(){
			$(this).find('input[type="radio"]').attr('name','chisel-radio-group-'+chisel.radioCount).click(function(){
				var val = $(this).val();
				$(this).closest('.chisel-field').find('input[type="hidden"]').val(val);
			});

			chisel.radioCount++;
		});
		return this;
	},

	initColorSwatches:function($el){

		$el.click(function(){

			var $list = $(this).parent();
			var $input = $list.siblings('input');

			$list.children('li').not(this).removeClass('selected');

			if(!$(this).hasClass('selected')){
				$(this).addClass('selected');
				$input.val($(this).data('value'));
			}else{
				$(this).removeClass('selected');
				$input.val('');
			}
		});

		return this;
	},

	initCheckboxes:function($el){
		$el.click(function(){
			$(this).next('input[type="hidden"]').val($(this).prop('checked') ? 1 : 0);
		});

		return this;
	},

	initDatePicker:function($el){
		var proxy = this;

		$el.find('.hasDatepicker').datepicker('destroy');

		$el.each(function(){
			var val = $(this).find('.chisel-date-field-initial-value').html();
				val = moment(val).format('MMMM D, YYYY');

			if(val == 'Invalid date'){
				val = '';
			}

			$(this).find( '.ccm-input-date')
				.val(val)
				.attr('id','chisel-datepicker-'+proxy.datepickerCount)
				.removeAttr('name')
				.datepicker(proxy.settings.datePicker);

			proxy.datepickerCount++;
		});

		return this;
	},

	initDateTimePicker:function($el){
		var proxy = this;

		$el.find('.hasDatepicker').datepicker('destroy');

		$el.each(function(){
			var val = $(this).find('.chisel-date-field-initial-value').html();
				val = moment(val).format('MMMM D, YYYY');

			if(val == 'Invalid date'){
				val = '';
			}

			$(this).find('.ccm-input-date').val(val)
				.attr('id','chisel-datepicker-'+proxy.datepickerCount)
				.datepicker(proxy.settings.datePicker);

			proxy.datepickerCount++;
		});

		$el.find('.form-group *[name]').removeAttr('name');
		return this;
	},

	initTimePicker:function($el){
		$el.each(function(){
			var $this = $(this);
			$(this).find('select').change(function () {
				var hours = $this.find('.chisel-time-hours').val();
				var mins = $this.find('.chisel-time-minutes').val();
				var ampm = $this.find('.chisel-time-ampm').val();

				if (ampm === 'pm') {
					hours = parseInt(hours) + 12;
				}

				$this.find('input[type="hidden"]').val(hours + ':' + mins + ':00');
			});
		});
		return this;
	},

	initPrice:function($el){
		$el.autoNumeric('init');
		return this;
	},

	initDecimal:function($el){
		$el.autoNumeric('init');
		return this;
	},

	initNumber:function($el){
		$el.autoNumeric('init',{mDec:0});
		return this;
	},

	initSpecialFields:function($el){
		this.initFilePicker($el.find('.chisel-file-picker'))
			.initPagePicker($el.find('.chisel-page-selector'))
			.initColorPicker($el.find('.chisel-color-picker'))
			.initDatePicker($el.find('.chisel-date-field'))
			.initDateTimePicker($el.find('.chisel-date-time-field'))
			.initTimePicker($el.find('.chisel-time-field'))
			.initDecimal($el.find('.chisel-decimal-field input'))
			.initPrice($el.find('.chisel-price-field input'))
			.initNumber($el.find('.chisel-number-field input'))
			.initSortable($el.find('.chisel-repeatables'))
			.initSlider($el.find('.chisel-slider'))
			.initRedactor($el.find('.chisel-redactor-editor'))
			.initRadioButtons($el.find('.chisel-radio-field'))
			.initColorSwatches($el.find('.chisel-color-swatches-field li'))
			.initCheckboxes($el.find('input[type="checkbox"]'))
			.initAccordion($el.find('.chisel-accordion'))
			.initIconPicker($el.find('.chisel-icon-selector li'))
			.updateSectionItemCount($el.find('.chisel-accordion'));

		return this;

	},


	submit:function(isBlock,e){
		//set redactor content as it's textarea's value
		$('.chisel-redactor-editor').each(function(){
			var name = $(this).attr('name');
			var content = $(this).html();

			if(content.replace('<p>','').replace('</p>','').length == 1){
				content  = '';
			}

			$(this).siblings('textarea').attr('name',name).val(content);
		});

		//format date/time fields to save
		$('.chisel-date-time-field').each(function(){
			var dateTime = '';
			var $fields = $(this).find('.form-inline').find('input,select');

			if($fields.eq(0).val()){

				var ampm = $fields.eq(4).val();
				var date = $fields.eq(0).val();
				var hours = $fields.eq(2).val();
				var minutes = $fields.eq(3).val();
				var seconds = '00';

				var dateTime =  date+' '+hours+':'+minutes+':'+seconds+' '+ampm;
				dateTime = moment(dateTime).format('YYYY-MM-DD HH:mm:ss');

				if(dateTime == 'Invalid date'){
					dateTime = '';
				}
			}

			$(this).find('input[type="hidden"]').val(dateTime);
		});

		//format date/time fields to save
		$('.chisel-date-field').each(function(){
			var $fields = $(this).find('input');
			var date = $fields.eq(0).val();
			var date = moment(date).format('YYYY-MM-DD');

			if(date == 'Invalid date'){
				date = '';
			}
			$(this).find('*[name]').val(date);
		});

		//validate data
		if(!chisel.validate()){

			if(!isBlock){
				e.preventDefault();
			}

			return false;
		}

		var data = {
			toSave:chisel.getFormData(),
			toDelete:chisel.getTrash()
		};

		var $form = isBlock ? $('#chisel').closest('form') : $('#chisel').find('form');
		var $datafield = $form.find('*[name="chisel-data"]');

		if(!$datafield.length){
			$form.append('<input type="hidden" name="chisel-data" />');
			$datafield = $form.find('*[name="chisel-data"]');
		}

		$datafield.val(JSON.stringify(data));

		$form.submit();
	}
};


$.fn.chiselSectionElements = function(selector){

	var $section = $(this).closest('.chisel-section');

	if($(this).hasClass('chisel-section') || !$section.length){
		$section = $(this);
	}

	return $section.find(selector).not($section.find('.chisel-section').find(selector).get());
};

$(function(){
	if(!$('#chisel-block').length){
		chisel.initSpecialFields($('#chisel'));
	}
});

$(window).on('mousewheel',function(){
	//since the chisel structure is different than normal dashboard pages, the hover proxy element needs to be handled differently to prevent it from shifting on top of other elements
	var $hoverProxy = $('#ccm-menu-click-proxy');
	$hoverProxy.css('height','0');
});

$(document).on('click','.chisel-expand-all',function(){
	$('.chisel-accordion').not('.chisel-accordion-open').find('.chisel-accordion-toggler').click();

}).on('click','.chisel-collapse-all',function(){
	$('.accordion-toggler-close:visible').parent().click();

}).on('click','.chisel-add-item',function(){
	var $this = $(this);

	var data = {
		file: $(this).data('file'),
		type: $(this).closest('#chisel-block').length ? 'block' : 'page',
		path: $(this).closest('#chisel').data('repeatable-path'),
		handle: $(this).closest('#chisel').data('repeatable-path'),
		package: $(this).closest('#chisel').data('chisel-package')
	};

	var buttonText = $(this).html();
	$(this).width($(this).width()).html('Loading...').attr('disabled','disabled');

	$.post(CCM_REL+'/index.php/chisel/ajax/get_repeatable',data,function(r){
		if(r){
			var $repeatable = $(r);
			chisel.initSpecialFields($repeatable);

			$repeatableSection = $this.chiselSectionElements('.chisel-repeatables');
			$repeatableSection.append($repeatable).attr('data-repeatable-count',$repeatableSection.children('.chisel-row').length);
			$this.chiselSectionElements('.chisel-repeatables').append($repeatable);
			$this.html(buttonText).removeAttr('disabled').width('auto');
			var $section = $this.closest('.chisel-accordion');

			if(!$section.hasClass('chisel-accordion-open')){
				$section.chiselSectionElements('.chisel-accordion-toggler').click();
			}

			chisel.updateSectionItemCount($section);
			chisel.onAddRepeatable($repeatable);
		}
	});

}).on('click','.chisel-remove-item',function(){
	var $row = $(this).closest('.chisel-row');
	chisel.removeRepeatable($row);

}).on('click','.chisel-form button.submit',function(e){
	chisel.submit(false,e);
});


