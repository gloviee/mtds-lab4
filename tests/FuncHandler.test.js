const { loadHistory, clearHistory, showRegister, showLogin } = require('../public/FuncHandler');

global.fetch = jest.fn();

describe('History functions', () => {
  beforeEach(() => {
    fetch.mockClear();

    // Відновлюємо DOM елементи
    document.body.innerHTML = `
      <div id="history"></div>
      <div id="register-container" style="display:none"></div>
      <div id="login-container" style="display:none"></div>
      <div class="main_part" style="display:flex"></div>
      <div id="register-result"></div>
      <div id="login-result"></div>
    `;

    // Мокаємо localStorage для user
    localStorage.setItem('user', JSON.stringify({ username: 'testuser' }));

    // Мокаємо confirm, щоб автоматично погоджуватися
    global.confirm = jest.fn(() => true);

    // Мокаємо alert, щоб уникнути помилок у тестах
    global.alert = jest.fn();
  });

  test('showRegister hides login and main parts, shows register container', () => {
    showRegister();
    expect(document.getElementById('register-container').style.display).toBe('flex');
    expect(document.getElementById('login-container').style.display).toBe('none');
    expect(document.querySelector('.main_part').style.display).toBe('none');
    expect(document.getElementById('register-result').textContent).toBe('');
  });

  test('showLogin hides register and main parts, shows login container', () => {
    showLogin();
    expect(document.getElementById('register-container').style.display).toBe('none');
    expect(document.getElementById('login-container').style.display).toBe('flex');
    expect(document.querySelector('.main_part').style.display).toBe('none');
    expect(document.getElementById('login-result').textContent).toBe('');
  });

  test('loadHistory fetches and renders history items', async () => {
    const mockItems = [
      { image: 'img1.png', name: 'Item 1', rarity: 'common' },
      { image: 'img2.png', name: 'Item 2', rarity: 'rare' },
    ];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ items: mockItems }),
    });

    await loadHistory();

    const history = document.getElementById('history');
    expect(history.children.length).toBe(2);
    expect(history.children[0].querySelector('span').textContent).toBe('Item 2');
    expect(history.children[1].querySelector('span').textContent).toBe('Item 1');
    expect(global.alert).not.toHaveBeenCalled();
  });

  test('loadHistory alerts if no items', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ items: [] }),
    });

    await loadHistory();

    expect(global.alert).toHaveBeenCalledWith('No history found.');
  });

  test('clearHistory clears the history and DOM', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ message: 'History cleared' }),
    });

    document.getElementById('history').innerHTML = '<div>item</div>';

    await clearHistory();

    expect(document.getElementById('history').innerHTML).toBe('');
  });

  test('confirm returns false cancels loadHistory and clearHistory', () => {
    global.confirm = jest.fn(() => false);

    loadHistory();
    clearHistory();

    expect(fetch).not.toHaveBeenCalled();
  });
});
