import './content.scss';

console.log('hello from content');

const appBarElement = document.querySelector('#appbar') as HTMLElement;
const wrapperElement = document.createElement('div');
wrapperElement.innerHTML = 'wow';
wrapperElement.classList.add('yolo__content');

appBarElement.after(wrapperElement);
