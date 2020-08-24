const startScreen = document.querySelector('.startScreen');
const inputPointsTotal = document.querySelector('.pointsTotal');
const btnStart = document.querySelector('.btnStart');
const mainContent = document.querySelector('.content');
const usedPointsQuantity = document.querySelector('.count');
const totalPointsQuantity = document.querySelector('.total');
const items = document.querySelector('.items');
const btnAddItem = document.querySelector('.btnAddItem');

const showErrorMessage = (input, message, timeInMilliseconds=3000) => {
  const error = input.nextElementSibling;

  error.innerText = message;
  error.style.visibility = 'visible';
  error.style.opacity = '1';

  setTimeout(() => {
    error.style.opacity = '0';

    setTimeout(() => {
      error.style.visibility = 'hidden';
    }, 500);
  }, timeInMilliseconds);
};

const preventEmpty = input => {
  if (input.value.length === 0) {
    input.value = 0;
  }
};

const removeLastNumber = input => {
  const value = input.value;
  input.value = value.substring(0, value.length - 1);
};

const handlePointsUpdate = input => {
  const itemsPoints = [...items.querySelectorAll('.value')];

  const totalItemsPoints = itemsPoints.reduce((total, {value}) => {
    return total += +value;
  }, 0);

  if (totalItemsPoints <= +totalPointsQuantity.innerText) {
    usedPointsQuantity.innerText = totalItemsPoints;
  } else {
    const message = 'Valor maior que o total';
    const timeInMilliseconds = 2000;

    showErrorMessage(input, message, timeInMilliseconds);
    removeLastNumber(input);
  }

  preventEmpty(input);
};

const updateItemPointsIfKeyAllowed = event => {
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
  const timeInMilliseconds = 2000;

  showErrorMessage(target, message, timeInMilliseconds);

  event.preventDefault();
}

const isNumber = ([...values]) => {
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

const increment = btnPlus => {
  const itemPoints = btnPlus.parentNode.querySelector('.value');

  if (+usedPointsQuantity.innerText < +totalPointsQuantity.innerText) {
    itemPoints.value++;
    usedPointsQuantity.innerText++;
  } else {
    const message = 'Chegou no valor máximo';
    showErrorMessage(itemPoints, message);
  }
};

const decrement = btnMinus => {
  const itemPoints = btnMinus.parentNode.querySelector('.value');

  if (+itemPoints.value > 0) {
    itemPoints.value--;
    usedPointsQuantity.innerText--;
  } else {
    const message = 'Chegou no valor mínimo';
    showErrorMessage(itemPoints, message);
  }
};

const addNemItem = () => {
  const lastItem = items.lastElementChild;
  const lastItemTitle = lastItem
    ? lastItem.querySelector('.title').value
    : 'default value';

  if (lastItemTitle.length) {
    const newItem = `
      <div class="item">
        <button type="button" class="remove" onclick="removeItem(this)">×</button>
        <div class="errorBlock">
          <input type="text" placeholder="Título do item" class="title">
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
  } else {
    const message = 'Preencha antes de continuar';
    const input = items.lastElementChild.querySelector('.title');
    const timeInMilliseconds = 2000;

    showErrorMessage(input, message, timeInMilliseconds);
  }
};

const removeItem = btnRemoveItem => {
  const item = btnRemoveItem.parentNode;
  const itemPoints = item.querySelector('.value');

  if (+itemPoints.value > 0) {
    usedPointsQuantity.innerText -= +itemPoints.value;
  }

  items.removeChild(item);
};

const init = () => {
  const value = inputPointsTotal.value;

  if (value.length && isNumber(value)) {
    totalPointsQuantity.innerText = value;

    startScreen.classList.remove('active');
    mainContent.classList.add('active');
  } else {
    const message = 'O valor deve ser inteiro e maior que 0';
    showErrorMessage(inputPointsTotal, message);
  }
};

inputPointsTotal.addEventListener('keydown', ({ key }) => {
  !(key.toLowerCase() === 'enter') || init();
});
btnStart.addEventListener('click', init);
btnAddItem.addEventListener('click', addNemItem);
