const axios = require('axios')

const { Corrida } = require('../models/corridas')


async function obtemCorridasAno(ano) {
    let corridas = null
    await axios.get(`http://ergast.com/api/f1/${ano}/races.json`)
        .then(res => {
            corridas = res.data['MRData']['RaceTable']['Races']
        });
    return corridas
}

function corridaFormatadoModel(corrida) {
    return ({
        id: `${corrida.season}${String(corrida.round).padStart(2, '0')}`,
        idTemporada: corrida.season,
        urlWiki: corrida.url,
        nomeCircuito: corrida.raceName,
        dataCorrida: new Date(corrida.date).toISOString()
    })
}

async function populaCorridasPeriodo(anoInicio, anoFim) {
    await Corrida.sync()
    const totalCorridas = await Corrida.count()
    if(totalCorridas == 0) {
        for (let ano = anoInicio; ano <= anoFim; ano++) {
            const corridas = await obtemCorridasAno(ano)
            const corridasFormatadas = corridas.map(corrida => {
                return corridaFormatadoModel(corrida)
            })
            await Corrida.bulkCreate(corridasFormatadas)
        }
        console.log(`Corridas de ${anoInicio} a ${anoFim} salvas no banco`)
    }
}

module.exports = { populaCorridasPeriodo }
