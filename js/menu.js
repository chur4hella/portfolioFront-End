var $menu = $('.menu'),
$menuBtn = $menu.children('.menu-btn'),
  $menuList = $menu.children('.menu-list');

$menuBtn.click(function () {
  var menuOpen = $(this).hasClass('menu-btn--active');
  $(this).toggleClass('menu-btn--active');
  $menu.toggleClass('menu--open');
});
