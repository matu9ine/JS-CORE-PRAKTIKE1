let container = document.querySelector('.main-container');
let searchForm = document.querySelector('.search-form');
let searchInput = document.querySelector('.search-form__input');
let optionContextMenu = document.querySelector('.search-form__menu');
let resultsDiv = document.querySelector('.results');

let fragment = document.createDocumentFragment();

async function getRequest(searchText) {
    try {

        if (!searchText.trim()) {
            return optionContextMenu.innerHTML = '';
        }

    const response = await fetch(`https://api.github.com/search/repositories?q=${searchText}`);
    const result = await response.json();
    optionContextMenu.innerHTML = '';

    firstFiveItems = result.items.slice(0, 5);
    firstFiveItems.forEach(el => {
        const item = document.createElement('li');
        item.classList.add("search-form__menu-item");
        item.setAttribute('data-name', `${el.name}`);
        item.setAttribute('data-owner', `${el.owner.login}`);
        item.setAttribute('data-stars', `${el.stargazers_count}`);
        item.textContent = el.name;
        fragment.appendChild(item);
        optionContextMenu.appendChild(fragment);
    })

  } catch(error) {
    console.error('Error in getRequest:', error);
  }
}

const debounce = (fn, debounceTime) => {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
          fn.apply(this, args);
      }, debounceTime)
    }
};

function logSearchValue() {
    return searchInput.value;
}

searchInput.addEventListener('keyup', debounce(function() {
    const searchText = logSearchValue();
    getRequest(searchText);
}, 300));

optionContextMenu.addEventListener('click', function(event) {
    let closestMenuItem = event.target.closest('.search-form__menu-item');
  
    if (closestMenuItem) {
  
      searchInput.value = '';
      optionContextMenu.innerHTML = '';
  
      let name = closestMenuItem.getAttribute('data-name');
      let owner = closestMenuItem.getAttribute('data-owner');
      let star = closestMenuItem.getAttribute('data-stars');
  
      let htmlString = `
      <p>Name: ${name}</p>
      <p>Owner: ${owner}</p>
      <p>Stars: ${star}</p>
    `;
  
      let resultItem = document.createElement('div');
      resultItem.classList.add('results__item');
      resultItem.insertAdjacentHTML('beforeend', htmlString);
      resultsDiv.appendChild(resultItem);
  
      let btn = document.createElement('button');
  
      let img = document.createElement('img');
      img.src = 'img/close.png';
      img.alt = 'close';
  
      resultItem.appendChild(btn);
      btn.appendChild(img);
      btn.addEventListener('click', resultItemRemoveButtonClick);
    }
  })

  
  function resultItemRemoveButtonClick(event) {
    let currentResultDiv = event.target.closest('.results__item');
    if(currentResultDiv) {
        currentResultDiv.remove();
  }
}