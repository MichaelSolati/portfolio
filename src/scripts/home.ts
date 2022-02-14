import {MDCMenu} from '@material/menu';

let firstClick = true;
let isOpen = false;
const button = document.querySelector('#open-menu');
const experienceCards = Array.from(
  document.querySelector('#experiences-cards')?.children || []
) as Element[];
const experienceTitle = document.querySelector('#experiences-title') as Element;
const menu = document.querySelector('.mdc-menu') as Element;
const menuItems = menu.querySelectorAll('li');
const mdcMenu = new MDCMenu(menu);

const toggleMenu = (propagate = false) => {
  isOpen = !isOpen;
  firstClick = isOpen;

  if (propagate) {
    mdcMenu.open = isOpen;
  }
};

button?.addEventListener('click', () => toggleMenu(true));

document.addEventListener('click', e => {
  if (mdcMenu.open === false) {
    return;
  } else if (firstClick) {
    firstClick = false;
    return;
  }

  let target: ParentNode | null = e.target as ParentNode;
  do {
    if (target === menu) return;
    target = target?.parentNode;
  } while (target);
  toggleMenu(true);
});

menuItems.forEach(menuItem => {
  menuItem.addEventListener('click', e => {
    toggleMenu();

    let target = e.target as Element;

    do {
      if (target === menuItem) break;
      target = target?.parentNode as Element;
    } while (target);

    if (!target) return;

    experienceTitle.innerHTML = `${
      target.querySelector('.mdc-list-item__text')?.innerHTML
    } Experiences`;
    const filterKey = target.getAttribute('data-filter');

    switch (filterKey) {
      case 'work':
      case 'eductaion':
      case 'volunteer':
        experienceCards.forEach(e =>
          e.classList.toggle(
            'hidden',
            e.getAttribute('data-filter') !== filterKey
          )
        );
        break;
      default:
        experienceCards.forEach(e => e.classList.toggle('hidden', false));
        break;
    }
  });
});
