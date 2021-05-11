var style = document.createElement('style');
style.setAttribute("id","FathGrid_styles");
style.innerHTML = `
.multiselect-dropdown{
  display: inline-block;
  padding: 2px 5px 0px 5px;
  border-radius: 4px;
  border: solid 1px #ced4da;
  background-color: white;
  position: relative;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right .75rem center;
  background-size: 16px 12px;
}
.multiselect-dropdown span.optext, .multiselect-dropdown span.placeholder{
  margin-right:0.5em; 
  margin-bottom:3px;
  padding:1px 0; 
  border-radius: 4px; 
  display:inline-block;
}
.multiselect-dropdown span.optext{
  background-color:lightgray;
  padding:1px 0.75em; 
}
.multiselect-dropdown span.placeholder{
  color:#ced4da;
}
.multiselect-dropdown-list{
  z-index: 100;
  padding:4px;
  border-radius: 4px;
  border: solid 1px #ced4da;
  display: none;
  margin: -1px;
  position: absolute;
  top:0;
  left: 0;
  right: 0;
  height: 15rem;
  overflow-y:auto;
  overflow-x: hidden;
  background: white;
}
.multiselect-dropdown-list div{
  padding: 5px;
}
.multiselect-dropdown-list input{
  height: 1.15em;
  width: 1.15em;
  margin-right: 0.35em;  
}
.multiselect-dropdown-list div.checked{
}
.multiselect-dropdown-list div:hover{
  background-color: #ced4da;
}

`;
document.head.appendChild(style);

function MultiselectDropdown(options){
  var config={
    placeholder:'select',
    ...options
  };
  function newEl(tag,attrs){
    var e=document.createElement(tag);
    if(attrs!==undefined) Object.keys(attrs).forEach(k=>{
      if(k==='class') { Array.isArray(attrs[k]) ? attrs[k].forEach(o=>o!==''?e.classList.add(o):0) : (attrs[k]!==''?e.classList.add(attrs[k]):0)}
      else if(k==='style'){  
        Object.keys(attrs[k]).forEach(ks=>{
          e.style[ks]=attrs[k][ks];
        });
       }
      else if(k==='text'){attrs[k]===''?e.innerHTML='&nbsp;':e.innerText=attrs[k]}
      else e[k]=attrs[k];
    });
    return e;
  }

  
  document.querySelectorAll("select[multiple]").forEach((el,k)=>{
    var div=newEl('div',{class:'multiselect-dropdown',style:{width:el.clientWidth+'px'}});
    el.style.display='none';
    el.parentNode.insertBefore(div,el.nextSibling);
    var list=newEl('div',{class:'multiselect-dropdown-list'});
    div.appendChild(list);

    el.loadOptions=()=>{
      list.innerHTML='';
      Array.from(el.options).map(o=>{
        var op=newEl('div',{class:o.selected?'checked':'',optEl:o})
        var ic=newEl('input',{type:'checkbox',checked:o.selected});
        op.appendChild(ic);
        op.appendChild(newEl('label',{text:o.text}));

        op.addEventListener('click',()=>{
          op.classList.toggle('checked');
          op.querySelector("input").checked=!op.querySelector("input").checked;
          op.optEl.selected=!!!op.optEl.selected;
          el.onchange();
        });
        ic.addEventListener('click',(ev)=>{
          ic.checked=!ic.checked;
        });

        list.appendChild(op);
      });
      div.listEl=list;

      div.refresh=()=>{
        div.querySelectorAll('span.optext, span.placeholder').forEach(t=>div.removeChild(t));
        Array.from(el.selectedOptions).map(x=>{
          var c=newEl('span',{class:'optext',text:x.text});
          div.appendChild(c);
        });
        if(0==el.selectedOptions.length) div.appendChild(newEl('span',{class:'placeholder',text:config.placeholder}));
      };
      div.refresh();
    }
    el.loadOptions();
    
    
    div.addEventListener('click',()=>{
      div.listEl.style.display='block';
    });
    
    document.addEventListener('click', function(event) {
      if (!div.contains(event.target)) {
        list.style.display='none';
        div.refresh();
      }
    });    
  });
}

window.addEventListener('load',()=>{
  MultiselectDropdown(window.MultiselectDropdownOptions);
});
