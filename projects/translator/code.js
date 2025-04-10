const selectorContainer = document.getElementById('selector-container');
const containerKeeper = document.getElementById('container-keeper');
const input = document.getElementById('input');
const output = document.getElementById('output');
const translate = document.getElementById('translate');
const langSelect = document.getElementById('lang-select');

let langsObj = {};
let lang = 'en';

translate.addEventListener('click', translateText);
addLanguages();
langSelect.addEventListener('click', showLanguages);

function showLanguages() {
    containerKeeper.classList.toggle('hidden');
}

async function addLanguages() {
    langsObj = await getLanguages();
    Object.keys(langsObj)
        .sort()
        .forEach((key) => {
            const selectItem = document.createElement('button');
            selectItem.classList.add('select-item');
            selectItem.textContent = key[0].toUpperCase() + key.slice(1);
            selectItem.addEventListener('click', selectLanguage);
            selectorContainer.append(selectItem);
        })
}

function selectLanguage(event) {
    const button = event.target;
    langSelect.textContent = button.textContent;
    containerKeeper.classList.toggle('hidden');
}

async function getLanguages() {
    const url = 'https://google-translate-unlimited.p.rapidapi.com/support';
const options = {
    method: 'GET',
    headers: {
		'x-rapidapi-key': '088295e1dcmsh2ee398cd1c41c89p1af9b5jsnc777fce3ef2f',
		'x-rapidapi-host': 'google-translate-unlimited.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.json();
	return result;
} catch (error) {
	console.error(error);
}
}

async function getTranslation(text, lang) {
    const url = 'https://google-translate-unlimited.p.rapidapi.com/translate';
    const data = new FormData();
    data.append('text', text);
    data.append('source', 'auto');
    data.append('target', lang);
    
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '088295e1dcmsh2ee398cd1c41c89p1af9b5jsnc777fce3ef2f',
            'x-rapidapi-host': 'google-translate-unlimited.p.rapidapi.com'
        },
        body: data
    };
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}

async function translateText() {
    const lang = langsObj[langSelect.textContent.trim().toLowerCase()];
    const text = input.value;
    const res =  await getTranslation(text, lang); 
    output.textContent = res['translated'];  
}

