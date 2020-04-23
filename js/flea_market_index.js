var body = document.querySelector('body'),
  categories = body.querySelectorAll('.category'),
popupBox = body.querySelector('.main-header-region'),
regionSelect = popupBox.querySelector('.regions-title-selected'),
regionSelectText = regionSelect.querySelector('span'),
popupRegion = popupBox.querySelector('.regions-popup'),
popupRegionItems = popupRegion.querySelectorAll('.regions-list-item');


function activationCategory(){
  if (document.documentElement.clientWidth <= 1100){
    if(this.classList.contains('category--active')){
      this.classList.remove('category--active');
    } else {
      categories.forEach(function (item, i, arr) {
        if(item.classList.contains('category--active')){
          item.classList.remove('category--active');
          return;
        }
      });
      this.classList.add('category--active')
    }
  }
}

categories.forEach(function (item, i, arr) {
  item.addEventListener('click', activationCategory);
});

function activationRegionPopup(e){
  e.stopPropagation();
  popupRegion.classList.toggle('regions-popup--active');
}

regionSelect.addEventListener('click', activationRegionPopup);

function closeRegionPopup(){
  popupRegion.classList.remove('regions-popup--active');
}

body.addEventListener('click', closeRegionPopup);

function setRegion(){
  if (!this.classList.contains('regions-list-item--active')){
    popupRegion.querySelector('.regions-list-item--active').classList.remove('regions-list-item--active');
    this.classList.add('regions-list-item--active');
    regionSelectText.innerHTML = this.querySelector('span').innerHTML;
    popupRegion.classList.remove('regions-popup--active');
  }
}

popupRegionItems.forEach(function (item, i, arr) {
  item.addEventListener('click', setRegion);
});
