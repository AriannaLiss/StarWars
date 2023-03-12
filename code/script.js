/*             
            Виконати запит на https://swapi.dev/api/people (https://starwars-visualguide.com) отримати список героїв зіркових воєн.

            Вивести кожного героя окремою карткою із зазначенням. картинки Імені, статевої приналежності, ріст, колір шкіри,
            рік народження та планету на якій народився.
           
            Створити кнопку зберегти на кожній картці. 
            При натисканні кнопки записуйте інформацію у браузері
    */

const URL = 'https://swapi.dev/api/people';
const DATA = 'namegenderheightskin_colorbirth_yearhomeworld';
const requests = [];

function get(url, callback){
    const ajax = new XMLHttpRequest();
    ajax.open("get",url);
    if (requests.includes(url)) return;
    requests.push(url);
    ajax.send();
    ajax.addEventListener('readystatechange',() => {
        if (ajax.readyState === 4){
            if (ajax.status >= 200 && ajax.status < 300) {
                callback(JSON.parse(ajax.response));
                document.querySelector('.loader').classList.add('hide');
            } else {
                throw new error(`error: ${ajax.status}/${ajax.statusText}`);
            }
            requests.splice(requests.indexOf(url), 1);     
        }
    })
}

function showHeros(data){
    const heros = data.results;
    const div = document.createElement('div');
    div.id = 'heros';
    heros.forEach((hero) =>{
        const card = document.createElement('div');
        card.classList.add('card');
        card.appendChild(createImg(hero.name));
        card.appendChild(createInfoCard(hero));
        card.appendChild(createBtn());
        div.appendChild(card);
        document.getElementsByTagName('body')[0].appendChild(div);
     }) 

}

const createInfoCard = (hero) => {
    const info = document.createElement('div');
    info.classList.add('info');
    for (const prop in hero){
        if (DATA.includes(prop)){
            info.appendChild(showProp(prop,hero));
        }
        if (prop === 'homeworld') break;
    };
    return info;
}

const createBtn = () => {
    const btn = document.createElement('input');
    btn.type = 'button';
    btn.value = 'Save';
    btn.classList.add('save-btn');
    btn.addEventListener('click', saveHero);
    return btn;
}

const createImg = (name) => {
    const img = document.createElement("img");
    img.src = './img/'+name+'.jpeg';
    img.classList.add('hero-photo');
    return img;
}

const saveHero = (e) =>{
    let info='Hero saved:\n';
    Array.from(e.target.previousSibling.children).forEach((p) => info+=p.innerText+'\n')
    console.log(info);
}

const showProp = (prop,hero) => {
    const info = document.createElement('p');
    info.classList.add('property');
    info.innerHTML = prop +': ';
    hero[prop].substr(0,8) == 'https://'
        ? info.innerHTML += createLink(hero[prop])
        : info.innerHTML += hero[prop];
    return info;
}

const createLink = (url) => {
    get(url, putName);
    return `<a href=${url} target='blank'>${url}</a>`;
}

const putName = (data) => {
    const links = document.querySelectorAll(`[href='${data.url}']`);
    links.forEach((link) => {
        link.innerHTML = data.name;
    })
}

get(URL, showHeros);
