import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

import { fetchCountries } from './fetchCountries';

// -----Инициализация-------------

const input = document.getElementById("search-box");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");


const DEBOUNCE_DELAY = 300;


input.addEventListener("input", debounce((event) => {
    const inputValue = event.target.value.trim();

    if (inputValue === '') {
        countryList.innerHTML = "";
        return;
    }

    fetchCountries(inputValue)
        .catch(() => {
            Notiflix.Notify.failure('Oops, there is no country with that name');
        })
        .then(list => {
            if (list.length > 10) {
                Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");

            } else if (list.length > 1) {
                renderCountryList(list);

            } else if (list.length == 1) {
                renderCountryInfo(list[0]);
            }
        });
}, DEBOUNCE_DELAY));

//------------Список-----
function renderCountryList(list) {
    const markup = list
        .map(item => {
            return `<li>
            <img src="${item.flags.svg}"  width="50px" />
            ${item.name.official}
            </li>`;
        })
        .join("");
    countryInfo.innerHTML = "";
    countryList.innerHTML = markup;
}
//-------одна страна--------
function renderCountryInfo(item) {

    const markup = `
            <h1>
            <img src="${item.flags.svg}"  width="50px"/>
            ${item.name.official}
            </h1>
            <p><b>Capital</b>: ${item.capital}</p>
            <p><b>Population</b>: ${item.population}</p>
            <p><b>Languages</b>: ${Object.values(item.languages)}</p>
        `;
    countryList.innerHTML = "";
    countryInfo.innerHTML = markup;
}
