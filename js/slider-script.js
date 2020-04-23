/**
 * Created by Admin on 24.02.20.
 */
'use strict';
var slideShow = (function () {
  return function (selector, config) {
    var
      _slider = document.querySelector(selector), // основный элемент блока
      _sliderContainer = _slider.querySelector('.slider__items'), // контейнер для .slider-item
      _sliderItems = _slider.querySelectorAll('.slider__item'), // коллекция .slider-item
      _sliderControls = _slider.querySelectorAll('.slider__control'), // элементы управления
      _currentPosition = 0, // позиция левого активного элемента
      _transformValue = 0, // значение транфсофрмации .slider_wrapper
      _transformStep = 100, // величина шага (для трансформации)
      _itemsArray = [], // массив элементов
      _timerId,
      _indicatorItems,
      _indicatorIndex = 0,
      _indicatorIndexMax = _sliderItems.length - 1,
      _config = {
        isAutoplay: false, // автоматическая смена слайдов
        directionAutoplay: 'next', // направление смены слайдов
        delayAutoplay: 30000000, // интервал между автоматической сменой слайдов
        isPauseOnHover: true // устанавливать ли паузу при поднесении курсора к слайдеру
      },
      header = document.querySelector('.header'),
      menu = header.querySelector('.menu'),
      menuBtn = menu.querySelector('.menu-btn'),
      about = header.querySelector('.about'),
      allSlider = document.querySelectorAll('.slider__item');

    // настройка конфигурации слайдера в зависимости от полученных ключей
    for (var key in config) {
      if (key in _config) {
        _config[key] = config[key];
      }
    }

    // наполнение массива _itemsArray
    for (var i = 0; i < _sliderItems.length; i++) {
      _itemsArray.push({ item: _sliderItems[i], position: i, transform: 0 });
    }

    // переменная position содержит методы с помощью которой можно получить минимальный и максимальный индекс элемента, а также соответствующему этому индексу позицию
    var position = {
      getItemIndex: function (mode) {
        var index = 0;
        for (var i = 0; i < _itemsArray.length; i++) {
          if ((_itemsArray[i].position < _itemsArray[index].position && mode === 'min') || (_itemsArray[i].position > _itemsArray[index].position && mode === 'max')) {
            index = i;
          }
        }
        return index;
      },
      getItemPosition: function (mode) {
        return _itemsArray[position.getItemIndex(mode)].position;
      }
    };

    // функция, выполняющая смену слайда в указанном направлении
    var _move = function (direction) {
      var nextItem, currentIndicator = _indicatorIndex;
      if (direction === 'next') {
        _currentPosition++;
        if (_currentPosition > position.getItemPosition('max')) {
          nextItem = position.getItemIndex('min');
          _itemsArray[nextItem].position = position.getItemPosition('max') + 1;
          _itemsArray[nextItem].transform += _itemsArray.length * 100;
          _itemsArray[nextItem].item.style.transform = 'translateX(' + _itemsArray[nextItem].transform + '%)';
        }
        _transformValue -= _transformStep;
        _indicatorIndex = _indicatorIndex + 1;
        if (_indicatorIndex > _indicatorIndexMax) {
          _indicatorIndex = 0;
        }
      } else {
        _currentPosition--;
        if (_currentPosition < position.getItemPosition('min')) {
          nextItem = position.getItemIndex('max');
          _itemsArray[nextItem].position = position.getItemPosition('min') - 1;
          _itemsArray[nextItem].transform -= _itemsArray.length * 100;
          _itemsArray[nextItem].item.style.transform = 'translateX(' + _itemsArray[nextItem].transform + '%)';
        }
        _transformValue += _transformStep;
        _indicatorIndex = _indicatorIndex - 1;
        if (_indicatorIndex < 0) {
          _indicatorIndex = _indicatorIndexMax;
        }
      }
      _sliderContainer.style.transform = 'translateX(' + _transformValue + '%)';
      // console.log(_transformValue);
      _indicatorItems[currentIndicator].classList.remove('active');
      _indicatorItems[_indicatorIndex].classList.add('active');
      // console.log(_indicatorIndex);

      colorMenu(_indicatorIndex);
      toggleCurrentSlider(_indicatorIndex);
    };

    // фун-я, окрашивающая кнопку меню и само меню в зависимости от слайда
    function colorMenu(slideIndex) {
      var colorAbout = {
        0: '#ff9007',
        1: 'violet',
        2: '#43803c',
        3: 'coral'
      };

      function hoverAbout(e) {
        if(e.type == 'mouseover'){
          e.target.style.color = colorAbout[slideIndex];
        }else if(e.type == 'mouseout'){
          e.target.style.color = 'white';
        }
      }
      about.onmouseover = about.onmouseout = hoverAbout;

      if (slideIndex == 0){
        menu.style.backgroundColor = '#ff9007';
        menuBtn.style.backgroundColor = '#ff9007';
      }else if(slideIndex == 1){
        menu.style.backgroundColor = 'violet';
        menuBtn.style.backgroundColor = 'violet';
      }else if(slideIndex == 2){
        menu.style.backgroundColor = '#43803c';
        menuBtn.style.backgroundColor = '#43803c';
      }else if(slideIndex == 3){
        menu.style.backgroundColor = 'coral';
        menuBtn.style.backgroundColor = 'coral';
      }
    }

    //ф-я активирующая слейдер
    function toggleCurrentSlider(sliderIndex) {
      var currentSlider = document.querySelector('.slider__item--active');

      currentSlider.classList.remove('slider__item--active');
      allSlider[sliderIndex].classList.add('slider__item--active');
    }
    
    // ф-я, осуществляющая переход к слайду после обработки touch событий
    (function handlerTouchEvents() {
      var startTouchX;

      function handleStart(e){
        startTouchX = e.changedTouches[0]['clientX'];
      }

      function handleEnd(e){
        if ((startTouchX - e.changedTouches[0]['clientX']) > 20){
          _move('next');
        } else if((startTouchX - e.changedTouches[0]['clientX']) < -20){
          _move('prev');
        }
      }

      allSlider.forEach(function (item, i, arr) {
        item.addEventListener('touchstart', handleStart);
        item.addEventListener('touchend', handleEnd);
      });

    })();

    // функция, осуществляющая переход к слайду по его порядковому номеру
    var _moveTo = function (index) {
      var i = 0, direction = (index > _indicatorIndex) ? 'next' : 'prev';
      while (index !== _indicatorIndex && i <= _indicatorIndexMax) {
        _move(direction);
        i++;
      }
    };

    // функция для запуска автоматической смены слайдов через промежутки времени
    var _startAutoplay = function () {
      if (!_config.isAutoplay) {
        return;
      }
      _stopAutoplay();
      _timerId = setInterval(function () {
        _move(_config.directionAutoplay);
      }, _config.delayAutoplay);
    };

    // функция, отключающая автоматическую смену слайдов
    var _stopAutoplay = function () {
      clearInterval(_timerId);
    };

    // функция, добавляющая индикаторы к слайдеру
    var _addIndicators = function () {
      var indicatorsContainer = document.createElement('ol');
      indicatorsContainer.classList.add('slider__indicators');
      for (var i = 0; i < _sliderItems.length; i++) {
        var sliderIndicatorsItem = document.createElement('li');
        if (i === 0) {
          sliderIndicatorsItem.classList.add('active');
        }
        sliderIndicatorsItem.setAttribute("data-slide-to", i);
        indicatorsContainer.appendChild(sliderIndicatorsItem);
      }
      _slider.appendChild(indicatorsContainer);
      _indicatorItems = _slider.querySelectorAll('.slider__indicators > li')
    };

    // функция, осуществляющая установку обработчиков для событий
    var _setUpListeners = function () {
      _slider.addEventListener('click', function (e) {
        if (e.target.classList.contains('slider__control')) {
          e.preventDefault();
          _move(e.target.classList.contains('slider__control_next') ? 'next' : 'prev');
          _startAutoplay();
        } else if (e.target.getAttribute('data-slide-to')) {
          e.preventDefault();
          _moveTo(parseInt(e.target.getAttribute('data-slide-to')));
          _startAutoplay();
        }
      });
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === "hidden") {
          _stopAutoplay();
        } else {
          _startAutoplay();
        }
      }, false);
      if (_config.isPauseOnHover && _config.isAutoplay) {
        _slider.addEventListener('mouseenter', function () {
          _stopAutoplay();
        });
        _slider.addEventListener('mouseleave', function () {
          _startAutoplay();
        });
      }
    };

    // добавляем индикаторы к слайдеру
    _addIndicators();
    // установливаем обработчики для событий
    _setUpListeners();
    // запускаем автоматическую смену слайдов, если установлен соответствующий ключ
    _startAutoplay();

    return {
      // метод слайдера для перехода к следующему слайду
      next: function () {
        _move('next');
      },
      // метод слайдера для перехода к предыдущему слайду
      left: function () {
        _move('prev');
      },
      // метод отключающий автоматическую смену слайдов
      stop: function () {
        _config.isAutoplay = false;
        _stopAutoplay();
      },
      // метод запускающий автоматическую смену слайдов
      cycle: function () {
        _config.isAutoplay = true;
        _startAutoplay();
      }
    }
  }
}());
