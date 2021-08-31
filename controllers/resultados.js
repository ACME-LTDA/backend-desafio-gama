const axios = require('axios')

const { Resultado } = require('../models/resultados')


async function obtemResultadosAno(ano) {
    const resultados = []
    await axios.get(`http://ergast.com/api/f1/${ano}/results.json`)
        .then(res => {
            const corridas = res.data['MRData']['RaceTable']['Races']
            corridas.forEach(({id, idCorrida, idTemporada, idPiloto, idConstrutor, numeroCarro, posLargada, posChegada, voltas, status}) => {
                const idTemporadaAtual = corrida.season
                const idCorridaAtual = `${corrida.season}${String(corrida.round).padStart(2, '0')}`
                const resultadosCorrida = corrida['Results'].map(resultado => {
                    return resultadoFormatadoModel(resultado, idCorridaAtual, idTemporadaAtual)
                })
                resultados.concat(resultadosCorrida)
            })
        });

    return resultados
}

function resultadoFormatadoModel(resultado, idCorrida, idTemporada) {
    console.log(resultado)
    return ({
        id: `${idCorrida}p${String(resultado.position).padStart(2, '0')}`,
        idCorrida: idCorrida,
        idTemporada: idTemporada,
        idPiloto: resultado.Driver.driverId,
        idConstrutor: resultado.Constructor.constructorId,
        numeroCarro: resultado.number,
        posLargada: resultado.grid,
        posChegada: resultado.position,
        voltas: resultado.laps,
        status: resultado.status,
    })
}

async function populaResultadosPeriodo(anoInicio, anoFim) {
    await Resultado.sync()
    const totalResultados = await Resultado.count()
    if(totalResultados == 0) {
        let resultadosAdicionados = 0
        for (let ano = anoInicio; ano <= anoFim; ano++) {
            const resultados = await obtemResultadosAno(ano)
            const resultadoFormatado = resultadoFormatadoModel(resultados)
            await Resultado.create(resultadoFormatado)
            resultadosAdicionados =+ resultadoFormatado.length
        }
        console.log(`${resultadosAdicionados} resultados de corridas de ${anoInicio} a ${anoFim} salvas no banco`)
    }
}

module.exports = { populaResultadosPeriodo }
