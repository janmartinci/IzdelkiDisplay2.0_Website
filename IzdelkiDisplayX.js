//vrednosti linka
const parms = new URLSearchParams(window.location.search)
const imeBlValue = parms.get('ime')
document.getElementById('title').innerText = imeBlValue
if(imeBlValue){
    document.getElementById('popup-container').style.display = "none";
    document.getElementById('picture-selector-container').style.display = "flex";
}
let firstTime = true;
// od izbire znamk
let list = document.querySelector(".list")
let search = document.querySelector('.search')

const parser = new DOMParser();
const XmlString = '<root></root>';
const XmlDoc = parser.parseFromString(XmlString, 'text/xml');

var znamke = ['Vsi','Bachmann','Baseus','Datech','Digitus','HiLook','KELine','Leviton','Mikrotik','SBOX','Tenda','TP-Link','Triton','UBIQUITI','White Shark']
//od pasice
const pictureSelector = document.getElementById('picture-selecorMain');
const buttonClear = document.getElementById('clear');
const buttonAdd = document.getElementById('add');
const errorMsg = document.getElementById('errorMsg');
let stPasic = false;
let stevecSelect = 0;
let SelectedSlike = [];

//xml
var url = 'https://integration.techtrade.si/IzvozIzdelkovXML?X=711957605';
var xhr = new XMLHttpRequest();
xhr.open('GET', url, true);
xhr.responseType = 'document';


function checkStatus(){
    if(imeBlValue != null && st != false){
        document.getElementById('picture-selector-container').style.display = "none";
        xhr.onload = function(){
            if (xhr.status === 200) {
                var loadingScreen = document.getElementById('loading-screen');
                loadingScreen.style.display = 'none';

                var xml = xhr.responseXML;
                var izdelek = xml.getElementsByTagName('izdelek');
                var prikaz = $('#prikaz');
                var pasica = $('#pasicaa')
                var randomStevec = 0;
                for(var j = 0; j < izdelek.length; j++){
                    randomStevec++
                }
                var izdelkiSet = new Set();
                function izdelekAdd(){
                    izdelkiSet.clear()
                    if(imeBlValue != 'Vsi'){
                        for(var i = 0; i < 5; i++){
                            var random
                            do{
                                random = Math.floor(Math.random() * randomStevec);
                                var blagovnaZnamka = izdelek[random].getElementsByTagName('blagovnaZnamka')[0].textContent;
                                var zaloga = izdelek[random].getElementsByTagName('zaloga')[0].textContent;
                                var zalog = parseInt(zaloga)
                            }while(blagovnaZnamka != imeBlValue || zalog == 0 || izdelkiSet.has(random))
                            izdelkiSet.add(random);
                        }
                    }else{
                        for(var i = 0; i < 5; i++){
                            var random
                            do{
                                random = Math.floor(Math.random() * randomStevec);
                                var blagovnaZnamka = izdelek[random].getElementsByTagName('blagovnaZnamka')[0].textContent;
                                var zaloga = izdelek[random].getElementsByTagName('zaloga')[0].textContent;
                                var zalog = parseInt(zaloga)
                            }while(zalog == 0 || izdelkiSet.has(random))
                            izdelkiSet.add(random);
                        }
                    }
                    var cifra = 0
                    for (let izdelekset of izdelkiSet){
                        var izdelekID = izdelek[izdelekset].getElementsByTagName('izdelekID')[0].textContent;
                        var izdelekIme = izdelek[izdelekset].getElementsByTagName('izdelekIme')[0].textContent;
                        var slikaVelika = izdelek[izdelekset].getElementsByTagName('slikaVelika')[0].textContent;
                        var zaloga = izdelek[izdelekset].getElementsByTagName('zaloga')[0].textContent;
                        var PPC = izdelek[izdelekset].getElementsByTagName('PPC')[0].textContent;

                        var decimal = parseFloat(PPC.replace(",","."));
                        var zDDV = decimal + (0.22 * decimal);
                        var koncnaCena = (zDDV).toFixed(2).replace(".",",");
                        var zalogaVInt = parseInt(zaloga);
                        var barvaZaloga;
                        if(zalogaVInt >= 10){
                            barvaZaloga = "green";
                            zaloga = '+10'
                        }else{
                            barvaZaloga = "orange"
                        }

                        izdelekKartica = `
                        <div class="artikel">
                            <div style="display: flex; justify-content: space-between; align-items: center; background-color: white; border-radius: 5px;  margin-bottom: 1rem; background-color: white; color: black;">
                                <div class="sifra">
                                    <i class="fa-solid fa-tag" style="font-size: 24px;"></i>
                                    <p>${izdelekID}</p>
                                </div>
                                <div class="kolicina">
                                    <i class="fa-solid fa-box-open" style="font-size: 24px; color:${barvaZaloga};"></i>
                                    <p style="color: ${barvaZaloga};" >${zaloga}</p>
                                </div>
                            </div>
                            <div class="content-artikel">
                                <div class="img">
                                    <img id="slika${izdelekID}" style="max-width: 100%; max-height: 100%;" src="${slikaVelika}" alt="">
                                </div>
                            </div>
                            <div style="background-color: white; margin-top: 1rem; border-radius: 5px 5px 0px 0px; height: 93px; overflow: hidden;">
                                <p style="font-size: 30px;">${izdelekIme}</p>
                            </div>
                            <div class="cena">
                                <p>${koncnaCena} <span style="font-size: 25px;">z DDV</span></p>
                            </div>
                        </div>`
                        $('#prikaz').append(izdelekKartica);
                        var imgID = document.getElementById(`slika${izdelekID}`);
                        imgID.addEventListener('error', function(){
                            this.src = "Slike/imgNotFound.png";
                        })
                    }
                }
                
                var pasicaAddCount = 0
                function pasicaAdd(){
                    let arraySiize = SelectedSlike.length
                    var pasicaImg = `<img src="${SelectedSlike[pasicaAddCount]}" alt="">`
                    pasicaAddCount += 1;
                    if(pasicaAddCount == arraySiize){
                        pasicaAddCount = 0;
                    }
                    $('#pasicaa').append(pasicaImg);
                }
                
                function firstRun(){
                    izdelekAdd();
                    pasicaAdd();
                }

                var stevec = 0;
                function RefreshIzdelkov(){
                    stevec+=1
                    prikaz.fadeOut(600, function(){
                        prikaz.empty();
                        izdelekAdd();
                        prikaz.fadeIn(600);
                    })
                }
                function RefreshPasice(){
                    pasica.fadeOut(600, function(){
                        pasica.empty();
                        pasicaAdd();
                        pasica.fadeIn(600);
                    })
                }
                firstRun();
                setInterval(RefreshPasice,20000);
                setInterval(RefreshIzdelkov, 15000);
            }else{
                alert('Error: '+ xhr.status);
            }
        }
        xhr.send();
    }
}
//Koda je namenjena za izbiro znamke
znamke.forEach(element => {
    let li = `<a href="IzdelkiDisplayX.html?ime=${element}" style="display: block; padding: 0.5rem; color: black" onclick="selected(${element})" id="${element}">${element}</a>`
    list.insertAdjacentHTML("beforeend", li)

    const znamkeElement = XmlDoc.createElement('znamka')
    znamkeElement.setAttribute('id', element)

    const imeZnamke = XmlDoc.createElement('imeZnamke')
    imeZnamke.textContent = element

    znamkeElement.appendChild(imeZnamke)

    XmlDoc.documentElement.appendChild(znamkeElement)
});

const updatedXmlString = new XMLSerializer().serializeToString(XmlDoc);
const blob = new Blob([updatedXmlString], { type: 'text/xml' });

search.addEventListener('keyup', function(){
    filter = this.value.toLowerCase();
    var li = list.getElementsByTagName("a");
    for(var j = 0; j < li.length; j++){
        if(li[j].innerText.toLowerCase().indexOf(filter) == 0){
            li[j].style.display = "block"
        }else{
            li[j].style.display = "none"
        }
    }
})

//Spodnja koda je namenjena za izbrio pasice
window.onload = function(){
    for(let i = 1; i <= 10; i++){
        let pictureDisplay = `
        <div id="picture${i}" class="picture">
            <img id="img${i}" onclick="select(${i}, 'slike/slika${i}.png')" src="slike/slika${i}.png" alt="">
        </div> 
        `
        pictureSelector.insertAdjacentHTML('beforeend', pictureDisplay);
    }
}

buttonClear.addEventListener('click', function(){
    let arraySiize = SelectedSlike.length
    for(let i= 0; i <= arraySiize; i++){
        SelectedSlike.pop();
        stevecSelect = 0;
        if(i != arraySiize){
            document.getElementById(`selected${i+1}`).remove();
        }

    }
    console.log(SelectedSlike);
})

buttonAdd.addEventListener('click', function(){
    if(SelectedSlike.length != 0 && SelectedSlike.length == 3){
        st = true;
        localStorage.setItem('slike', JSON.stringify(SelectedSlike))
        checkStatus();
    }else{
        errorMsg.innerHTML = 'Izberi 3 slike'
    }
})


function select(i, j){
    let addselected = document.getElementById(`picture${i}`)
    if(stevecSelect != 3){
        stevecSelect++;
        let textCifra =  `
        <div id="selected${stevecSelect}" onclick="deSelect(${stevecSelect})">
            <div id="krog${stevecSelect}" class="krog">
                <h1 id="cifra${stevecSelect}">${stevecSelect}<h1>
            </div>
            </div>
        `

        addselected.insertAdjacentHTML('beforeend', textCifra);
        let selected = document.getElementById(`selected${stevecSelect}`)
        selected.classList.add('selected');

        let imgSrc = j
        SelectedSlike.push(imgSrc)



    }else{
        return
    }
}

function deSelect(i){
    if(stevecSelect == i){
        document.getElementById(`selected${i}`).remove();
        stevecSelect--
        SelectedSlike.pop();

    }
    console.log(SelectedSlike);

}