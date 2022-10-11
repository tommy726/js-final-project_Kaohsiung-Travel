const areaSelect = document.querySelector('.areaSelect');
const areaList = document.querySelector('.areaList');
const popularBtn = document.querySelectorAll('.popularBtn');
const area = document.querySelector('.area');
const pageClass = document.querySelector('.pagination');
const goTop = document.querySelector('.goTop');

let travelData = {};
let areaArray = [];
let noRepeatArea = [];
let areaListArray = [];
let popularColor = [];

fetch('https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c')
  .then(res =>{
    return res.json();
  }).then(result =>{
    travelData = result.data.XML_Head.Infos.Info;
    getArea(travelData);
    showSelect(noRepeatArea);
    getListArrayData('allArea',travelData);
    pagination(areaListArray,1);}
  ).catch(error => console.error('Error:', error)
);

function getArea(){
  travelData.forEach(item => {
    let address = item.Add;
    let words = address.split("");
    let area = `${words[6]}${words[7]}${words[8]}`;
    if(area == '那瑪夏'){
      area += '區'
    };
    item.Zone = area;
    areaArray.push(area);
    noRepeatArea = [...new Set(areaArray)];
  });
};

function showSelect(data){
  let str = `<option disabled>- - 請選擇行政區 - -</option>
            <option value="allArea">全部行政區</option>`;
  for (let i = 0; i < data.length; i++) {
    str += `<option>${data[i]}</option>`
  };
  areaSelect.innerHTML = str;
};

function getPopularBtn(){
  popularColor = ['#8a82cc','#ffa782','#f5d005','#559ac8'];
  for (let i = 0; i < popularBtn.length; i++) {
    for (let i = 0; i < popularColor.length; i++) {
      popularBtn[i].style.backgroundColor = popularColor[i];
    }
};
  popularBtn.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
      let btnValue = e.target.textContent;
      getListArrayData(btnValue,travelData);
      pagination(areaListArray,1);
    })
  })
};
getPopularBtn();

function getAreaList(e){
  let selectValue = e.target.value;
  getListArrayData(selectValue,travelData);
  pagination(areaListArray,1);
};
areaSelect.addEventListener('change',getAreaList,false);

function getListArrayData(text,data){
  areaListArray = [];
  for (let i = 0; i < data.length; i++) {
    if(text == data[i].Zone){
      areaListArray.push(data[i]);
      area.textContent = `${data[i].Zone}`
    }else if(text == 'allArea'){
      areaListArray.push(data[i]);
      area.textContent = '全部行政區';
    }
  }
};

function pagination(data, nowPage){
  const dataTotal = data.length;
  const perpage = 6;
  const pageTotal = Math.ceil(dataTotal / perpage);
  let currentPage = nowPage;
  if (currentPage > pageTotal){
    currentPage = pageTotal;
  };
  const minData = (currentPage * perpage) - perpage + 1;
  const maxData = (currentPage * perpage);

  const newData = [];
  data.forEach((item, index) => {
    const num = index + 1;
    if( num >= minData && num <= maxData){
      newData.push(item);
    }
  });
  const page ={
    pageTotal,
    currentPage,
    hasPage: currentPage > 1,
    hasNext: currentPage < pageTotal,
  };
  displayAreaList(newData);
  pageBtn(page);
};

function displayAreaList(data) {
  let str = '';
  data.forEach((item) =>{
    if(item.Ticketinfo !== '免費參觀'){
      item.Ticketinfo = '';
    };
    str += `<li>
    <div class="areaImageContent" style="background: url(${item.Picture1}) center / cover">
      <h3>${item.Name}</h3>
      <span class="areaSpan">${item.Zone}</span>
    </div>
    <ul class="areaInfo">
    <li><img src="images/icons_clock.png" alt="clock"/ class="icon">${item.Opentime}</li>
    <li><img src="images/icons_pin.png" alt="pin"/ class="icon">${item.Add}</li>
    <li><a href="tel:+${item.Tel}"><img src="images/icons_phone.png" alt="phone" class="icon"/>${item.Tel}</a></li>
    </ul>
    <span class="freeSpan"><img src="images/icons_tag.png" alt="tag"/ class="icon">${item.Ticketinfo}</span>
  </li>`;
  });
  areaList.innerHTML = str;
}

function pageBtn(page){
  let str = '';
  const total = page.pageTotal;
  if(page.hasPage){
    str += `<li class="page-item-switch"><a class="page-link" href="#" data-page="${Number(page.currentPage) - 1}">< Prev</a></li>`;
  }else{
    str += `<li class="page-item-switch"><span class="page-link"></span></li>`;
  };
  for(let i = 1; i <= total; i++){
    if(Number(page.currentPage) === i){
      str +=`<li class="page-item active"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
    }else{
      str +=`<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
    }
  };
  if(page.hasNext){
    str += `<li class="page-item-switch"><a class="page-link" href="#" data-page="${Number(page.currentPage) + 1}">Next ></a></li>`;
  }else{
    str += `<li class="page-item-switch"><span class="page-link"></span></li>`;
  };
  pageClass.innerHTML = str;
};

function switchPage(e){
  e.preventDefault();
  if(e.target.nodeName !== 'A') return;
  const page = e.target.dataset.page;
  pagination(areaListArray,page);
};
pageClass.addEventListener('click',switchPage);

window.onscroll = (()=>{
  let height = document.documentElement.scrollTop
  if(height > 300){
    goTop.style.display = 'block';
  }else{
    goTop.style.display = 'none';
  };
});

$(document).ready(function(){
  $('.goTop').click(function(e){ 
      e.preventDefault();
      $('html,body').animate({
        scrollTop: 0
      },500); 
  });
  $('.goDown').click(function(e){ 
    e.preventDefault(); 
    $('html,body').animate({
      scrollTop: $("body").height()-$(window).height()
    },500);
  });
});