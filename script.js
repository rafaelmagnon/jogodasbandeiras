let allCountries = [];
let correctCountry;

const countryName = document.getElementById('country-name');
const flagsContainer = document.getElementById('flags-container');
const feedback = document.getElementById('feedback');
const nextButton = document.getElementById('next-button');

async function fetchCountries() {
  feedback.textContent = 'Carregando bandeiras...';

  try {
    const response = await fetch('https://restcountries.com/v3.1/all');

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();

    allCountries = data
      .filter(country => country.flags && country.flags.svg)
      .map(country => ({
        name: country.translations?.por?.common || country.name.common,
        flag: country.flags.svg
      }));

    feedback.textContent = '';
    loadRound();

  } catch (error) {
    console.error('Erro ao buscar países:', error);
    feedback.textContent = 'Erro ao carregar as bandeiras. Atualize a página.';
  }
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function loadRound() {
  feedback.textContent = '';
  nextButton.classList.add('hidden');
  flagsContainer.innerHTML = '';

  const options = shuffle([...allCountries]).slice(0, 4);

  correctCountry = options[Math.floor(Math.random() * options.length)];

  countryName.textContent = correctCountry.name;

  options.forEach(country => {
    const img = document.createElement('img');

    img.src = country.flag;
    img.alt = country.name;

    img.addEventListener('click', () => checkAnswer(country));

    flagsContainer.appendChild(img);
  });
}

function checkAnswer(selectedCountry) {
  if (selectedCountry.name === correctCountry.name) {
    feedback.textContent = '🎉 Acertou!';
    feedback.style.color = 'lime';
  } else {
    feedback.textContent = `❌ Errou! Era a bandeira de ${correctCountry.name}.`;
    feedback.style.color = 'red';
  }

  nextButton.classList.remove('hidden');
}

nextButton.addEventListener('click', loadRound);

fetchCountries();