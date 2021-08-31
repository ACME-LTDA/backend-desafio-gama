const axios = require('axios')

const { Temporada } = require('../models/temporadas')


async function obtemTemporadaAno(ano) {
    let temporada = null
    await axios.get(`http://ergast.com/api/f1/${ano}/seasons.json`)
        .then(res => {
            temporada = res.data['MRData']['SeasonTable']['Seasons'][0]
        });

    return temporada
}

function temporadaFormatadoModel(temporada) {
    return ({
        id: temporada.season,
        urlWiki: temporada.url
    })
}

async function populaTemporadasPeriodo(anoInicio, anoFim) {
    await Temporada.sync()
    const totalTemporadas = await Temporada.count()
    if(totalTemporadas == 0) {
        for (let ano = anoInicio; ano <= anoFim; ano++) {
            const temporada = await obtemTemporadaAno(ano)
            const temporadaFormatada = temporadaFormatadoModel(temporada)
            await Temporada.create(temporadaFormatada)
        }
        console.log(`Temporadas de ${anoInicio} a ${anoFim} salvas no banco`)
    }
}

module.exports = { populaTemporadasPeriodo }
