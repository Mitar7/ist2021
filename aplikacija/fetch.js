

async function fetchProizvodi() {
    let url = 'http://localhost:5000/';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function renderProizvodi() {
    let proizvodi = await fetchProizvodi();
    let html = '';
    proizvodi.forEach(proizvod => {

        let htmlSegment = `
        <div class="card px-4 pt-4 col-md-4 d-inline-block" style="width: 18rem; margin: 20px; min-height: 18rem;">
            <div class="card-body">
                <h5 class="card-title">Proizvod ${proizvod.id}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${proizvod.kategorija.$t}</h6>
                <p class="card-text pb-4">${proizvod.tekst.$t}</p>
                <p>Cena:</p>
                <p class="d-inline-block" style="color: red; text-decoration: line-through;">${proizvod.cena.$t + proizvod.cena.valuta}a</p>
                <h6 class="d-inline-block" style="color: #292;">${proizvod.akcija.cena + proizvod.cena.valuta}a</h6>
                <p>Datum isteka: ${proizvod.akcija.datum_isteka} </p>
                <br/>
                <button onclick="idiNaEdit(${proizvod.id})" class="btn btn-primary">Edit</button>
                <button onclick="deleteProizvod(${proizvod.id})" class="btn btn-danger d-inline-block">Izbrisi</button>
            </div>
        </div>`;

        html += htmlSegment;
    });
    let prikaz = document.getElementById('prikaz');
    prikaz.innerHTML = html;
}

if (window.location.href.includes("index")){
    renderProizvodi();
}

async function postRequest(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST', 
      mode: 'cors',
      cache: 'no-cache', 
      credentials: 'same-origin', 
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', 
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(data)
    });
    return response.json();
  }

async function deleteProizvod(id) {
    const response = await fetch('http://localhost:5000/izbrisi/' + id, {
        method: 'DELETE', 
        mode: 'cors',
        cache: 'no-cache', 
        credentials: 'same-origin', 
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', 
        referrerPolicy: 'no-referrer', 
      });


      location.reload();
}


async function dodajProizvod() {
    const form = document.getElementById("forma");
    function handleForm(event) { event.preventDefault(); } 
    form.addEventListener('submit', handleForm);


    const kategorija = document.getElementById('kategorija').value;
    const cena = document.getElementById('cena').value;
    const tekst = document.getElementById('tekst').value;
    const oznaka = document.getElementById('oznaka').value;
    const akcija = document.getElementById('akcija').value;

    if (cena == null || cena < 0 || tekst == '' || oznaka == '' || akcija == '') return;

    const proizvod = {
        kategorija: kategorija,
        cena: cena,
        tekst: tekst,
        oznaka: oznaka,
        akcija: akcija
    };
    await postRequest('http://localhost:5000/dodaj', proizvod);
    window.location = "index.html";
}

function idiNaEdit(id) {
    window.location.href = "edit.html?id=" + id;
}


if (window.location.href.includes("edit")){
    const url = window.location.href;
    const id = url.split('?')[1].split('=')[1];

    renderProizvod(id);
}

async function renderProizvod(id){

    let proizvod = {};
    let url = 'http://localhost:5000/' + id;

    try {
        let res = await fetch(url);
        proizvod = await res.json();
    } catch (error) {
        console.log(error);
    }

    document.getElementById('kategorija').value = proizvod.kategorija.$t;
    document.getElementById('cena').value = proizvod.cena.$t;
    document.getElementById('tekst').value = proizvod.tekst.$t;
    document.getElementById('oznaka').value = proizvod.oznaka.$t;
    document.getElementById('akcija').value = proizvod.akcija.$t;
}

async function updateProizvod(){
    const form = document.getElementById("forma");
    function handleForm(event) { event.preventDefault(); } 
    form.addEventListener('submit', handleForm);

    const url = window.location.href;
    const id = url.split('?')[1].split('=')[1];
    

    const kategorija = document.getElementById('kategorija').value;
    const cena = document.getElementById('cena').value;
    const tekst = document.getElementById('tekst').value;
    const oznaka = document.getElementById('oznaka').value;
    const akcija = document.getElementById('akcija').value;

    if (cena == '' || tekst == '' || oznaka == '' || akcija == '' || id == '') return;

    const proizvod = {
        id: id,
        kategorija: kategorija,
        cena: cena,
        tekst: tekst,
        oznaka: oznaka,
        akcija: akcija
    };

    const response = await fetch('http://localhost:5000/edit/' + id, {
        method: 'PATCH', 
        mode: 'cors',
        cache: 'no-cache', 
        credentials: 'same-origin', 
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', 
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(proizvod)
      });

      window.location = "index.html";
}