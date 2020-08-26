const startScreen = document.querySelector('.startScreen');
const inputPointsTotal = document.querySelector('.pointsTotal');
const btnStart = document.querySelector('.btnStart');
const mainContent = document.querySelector('.content');
const btnRedo = document.querySelector('.redo');
const confirmationScreen = document.querySelector('.confirmation');
const btnConfirm = document.querySelector('.confirm');
const btnCancel = document.querySelector('.cancel');
const usedPointsQuantity = document.querySelector('.count');
const totalPointsQuantity = document.querySelector('.total');
const items = document.querySelector('.items');
const btnAddItem = document.querySelector('.btnAddItem');

const ItemsInfo = {
  get() {
    return JSON.parse(localStorage.getItem('itemsInfo'));
  },
  set(info) {
    localStorage.setItem('itemsInfo', JSON.stringify(info));
  },
  remove() {
    localStorage.removeItem('itemsInfo');
  }
};

const PointsQuantity = {
  get() {
    return JSON.parse(localStorage.getItem('pointsQuantity'));
  },
  set(points) {
    localStorage.setItem('pointsQuantity', JSON.stringify(points));
  },
  remove() {
    localStorage.removeItem('pointsQuantity');
  }
};

if (PointsQuantity.get()) {
  usedPointsQuantity.innerText = PointsQuantity.get().used;
  totalPointsQuantity.innerText = PointsQuantity.get().total;

  if (ItemsInfo.get()) {
    for (itemInfo of ItemsInfo.get()) {
      const item = `
        <div class="item">
          <button type="button" class="remove" onclick="removeItem(this)">×</button>
          <div class="errorBlock">
            <input
              type="text"
              placeholder="Título do item"
              class="title"
              value="${itemInfo.title}"
              oninput="ItemsInfo.set(getItemsPresentInDOM())"
            >
            <p class="error">Erro</p>
          </div>
          <button type="button" class="minus" onclick="decrement(this)">-</button>
          <div class="errorBlock">
            <input
              class="value"
              type="number"
              value="${itemInfo.points}"
              min="0"
              onkeydown="updateItemPointsIfKeyAllowed(event)"
              oninput="handlePointsUpdate(this)"
            >
            <p class="error">Erro</p>
          </div>
          <button type="button" class="plus" onclick="increment(this)">+</button>
        </div>
      `;

      items.insertAdjacentHTML('beforeend', item);
    }
  }

  removeClass(startScreen, 'active');
  addClass(mainContent, 'active');
}

function getPointsQuantity() {
  return {
    used: usedPointsQuantity.innerText,
    total: totalPointsQuantity.innerText
  };
}

function getItemsPresentInDOM() {
  const itemsPresentInDOM = [...items.children];

  return itemsPresentInDOM.reduce((itemsPresent, currentItem) => {
    const title = currentItem.querySelector('.title').value;
    const points = currentItem.querySelector('.value').value;

    itemsPresent.push({title: title, points: points});

    return itemsPresent;
  }, []);
}

function addClass(element, elementClass) {
  element.classList.add(elementClass);
};

function removeClass(element, elementClass) {
  element.classList.remove(elementClass);
};

function showErrorMessage(input, message) {
  const error = input.nextElementSibling;

  error.innerText = message;
  error.style.visibility = 'visible';
  error.style.opacity = '1';

  setTimeout(() => {
    error.style.opacity = '0';

    setTimeout(() => {
      error.style.visibility = 'hidden';
    }, 500);
  }, 3000);
};

function preventEmpty(input) {
  if (input.value.length === 0) {
    input.value = 0;
  }
};

function removeLastNumber(input) {
  const value = input.value;
  input.value = value.substring(0, value.length - 1);
};

function handlePointsUpdate(input) {
  const itemsPoints = [...items.querySelectorAll('.value')];

  const totalItemsPoints = itemsPoints.reduce((total, {value}) => {
    return total += +value;
  }, 0);

  if (totalItemsPoints <= +totalPointsQuantity.innerText) {
    usedPointsQuantity.innerText = totalItemsPoints;
  } else {
    const message = 'Valor maior que o total';

    showErrorMessage(input, message);
    removeLastNumber(input);
  }

  preventEmpty(input);

  PointsQuantity.set(getPointsQuantity());
  ItemsInfo.set(getItemsPresentInDOM());
};

function updateItemPointsIfKeyAllowed(event) {
  const { target, key } = event;
  const allowedKeys = [
    'backspace',
    'delete',
    'arrowleft',
    'arrowright'
  ];
  let isAllowedKey = false;

  allowedKeys.forEach(allowedKey => {
    if (key.toLowerCase() === allowedKey) {
      isAllowedKey = true;
    }
  });

  if (isNumber(key)) {
    if (+target.value === 0) {
      target.value = '';
    }

    return;
  }

  if (isAllowedKey) return;

  const message = 'Digite apenas números';
  showErrorMessage(target, message);

  event.preventDefault();
}

function isNumber([...values]) {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let isNumber = true;

  values.forEach(value => {
    if (value !== ' ') {
      const valuesThatAreNumbers = numbers.filter(number => number === +value);

      if (!valuesThatAreNumbers.length) {
        isNumber = false;
      }
    } else {
      isNumber = false;
    }
  });

  return isNumber;
};

function increment(btnPlus) {
  const itemPoints = btnPlus.parentNode.querySelector('.value');

  if (+usedPointsQuantity.innerText < +totalPointsQuantity.innerText) {
    itemPoints.value++;
    usedPointsQuantity.innerText++;

    PointsQuantity.set(getPointsQuantity());
    ItemsInfo.set(getItemsPresentInDOM());
  } else {
    const message = 'Chegou no valor máximo';
    showErrorMessage(itemPoints, message);
  }
};

function decrement(btnMinus) {
  const itemPoints = btnMinus.parentNode.querySelector('.value');

  if (+itemPoints.value > 0) {
    itemPoints.value--;
    usedPointsQuantity.innerText--;

    PointsQuantity.set(getPointsQuantity());
    ItemsInfo.set(getItemsPresentInDOM());
  } else {
    const message = 'Chegou no valor mínimo';
    showErrorMessage(itemPoints, message);
  }
};

function addNemItem() {
  const lastItem = items.lastElementChild;
  const lastItemTitle = lastItem
    ? lastItem.querySelector('.title').value
    : 'default value';

  if (lastItemTitle.length) {
    const newItem = `
      <div class="item">
        <button type="button" class="remove" onclick="removeItem(this)">×</button>
        <div class="errorBlock">
          <input
            type="text"
            placeholder="Título do item"
            class="title"
            oninput="ItemsInfo.set(getItemsPresentInDOM())"
          >
          <p class="error">Erro</p>
        </div>
        <button type="button" class="minus" onclick="decrement(this)">-</button>
        <div class="errorBlock">
          <input
            class="value"
            type="number"
            value="0"
            min="0"
            onkeydown="updateItemPointsIfKeyAllowed(event)"
            oninput="handlePointsUpdate(this)"
          >
          <p class="error">Erro</p>
        </div>
        <button type="button" class="plus" onclick="increment(this)">+</button>
      </div>
    `;

    items.insertAdjacentHTML('beforeend', newItem);
    items.lastElementChild.querySelector('.title').focus();

    ItemsInfo.set(getItemsPresentInDOM());
  } else {
    const message = 'Preencha antes de continuar';
    const input = items.lastElementChild.querySelector('.title');

    showErrorMessage(input, message);
  }
};

function removeItem (btnRemoveItem) {
  const item = btnRemoveItem.parentNode;
  const itemPoints = item.querySelector('.value');

  if (+itemPoints.value > 0) {
    usedPointsQuantity.innerText -= +itemPoints.value;
  }

  items.removeChild(item);

  PointsQuantity.set(getPointsQuantity());
  ItemsInfo.set(getItemsPresentInDOM());
};

function redo() {
  removeClass(confirmationScreen, 'active');
  removeClass(mainContent, 'active');
  addClass(startScreen, 'active');

  items.innerHTML = '';
  usedPointsQuantity.innerText = '0';

  ItemsInfo.remove();
  PointsQuantity.remove();

  inputPointsTotal.focus();
};

function cancel() {
  removeClass(confirmationScreen, 'active')
}

function openConfirmation() {
  addClass(confirmationScreen, 'active')
}

function initIfPressEnter({ key }) {
  !(key.toLowerCase() === 'enter') || init()
}

function init() {
  const value = inputPointsTotal.value;

  if (value.length && isNumber(value)) {
    totalPointsQuantity.innerText = value;

    removeClass(startScreen, 'active');
    addClass(mainContent, 'active');

    PointsQuantity.set({used: 0, total: value});

    inputPointsTotal.blur();
    inputPointsTotal.value = '';
  } else {
    const message = 'O valor deve ser inteiro e maior que 0';
    showErrorMessage(inputPointsTotal, message);
  }
};

inputPointsTotal.addEventListener('keydown', initIfPressEnter);
btnRedo.addEventListener('click', openConfirmation);
btnConfirm.addEventListener('click', redo);
btnCancel.addEventListener('click', cancel);
btnStart.addEventListener('click', init);
btnAddItem.addEventListener('click', addNemItem);
