const axios = require('axios')

async function testeAxios() {
    let total = 0
    await axios.get('http://ergast.com/api/f1/drivers.json?limit=1').then(res => {
        total = res.data['MRData']['total']
        console.log(`Total de pilotos: ${total}`)
    });
    await axios.get(`http://ergast.com/api/f1/drivers.json?limit=${total}`).then(res => {
        const lista_drivers = res.data['MRData']['DriverTable']['Drivers']
        console.log('Dentro da chamada:')
        console.log(lista_drivers.length)
    });
}

async function testeAxios2() {
    let total = 0
    await axios.get(`http://ergast.com/api/f1/2008/results.json?limit=368`).then(res => {
        console.log('Dentro da chamada:')
        // console.log(res.data['MRData']['SeasonTable']['Seasons'])
        console.log(res.data['MRData']['RaceTable']['Races'][0])
    });
}

async function testeAxios3() {
    let temporadas = []
    for (let ano = 2019; ano < 2022; ano++) {
        let temporada = null
        await axios.get(`http://ergast.com/api/f1/${ano}/results.json?limit=400`).then(res => {
            temporada = {ano: ano, corridas: []}
            res.data['MRData']['RaceTable']['Races'].forEach(corrida => {
                temporada['corridas'].push({
                    circuito: corrida['Circuit']['circuitId'],
                    resultados: corrida['Results']
                })
                })
            })
        temporadas.push(temporada)
    };
    console.log('Dados:')
    console.log(`temporadas: ${temporadas.length}`)
    temporadas.forEach(temporada => {
        console.log(`ano: ${temporada.ano}`)
        console.log(`\tcircuito: ${temporada.corridas[0].circuito}`)
        console.log(`\ttotal de resultados: ${temporada.corridas[0].resultados.length}`)
        console.log(`\t\tnúmero do vencedor: ${temporada.corridas[0].resultados[0]['number']}`)
        console.log(`\t\tposição do vencedor: ${temporada.corridas[0].resultados[0]['position']}`)
        console.log(`\t\tvolta mais rápida: ${temporada.corridas[0].resultados[0]['fastestLap']}`)
    })
}


// testeAxios()
// testeAxios2()
testeAxios3()
