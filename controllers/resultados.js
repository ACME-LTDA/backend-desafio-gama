const axios = require('axios')

const { Resultado } = require('../models/resultados')


async function obtemResultadosAno(ano) {
    let corridas = null
    await axios.get(`http://ergast.com/api/f1/${ano}/results.json?limit=500`)
        .then(res => {
            corridas = res.data['MRData']['RaceTable']['Races']
        });

    return corridas
}

function formataListaResultados(corridas, resultados) {
    let resultadosFormatados = []
    let resultadosCorrida = null
    corridas.forEach(({ season, round, Results }) => {
        const idTemporadaAtual = season;
        const idCorridaAtual = `${season}${String(round).padStart(2, '0')}`
        resultadosCorrida = Results.map((resultado) => {
            return resultadoFormatadoModel(
                resultado, idCorridaAtual, idTemporadaAtual)
        })
        Array.prototype.push.apply(resultadosFormatados, resultadosCorrida)
    });

    return resultadosFormatados
}

function resultadoFormatadoModel(resultado, idCorrida, idTemporada) {
    console.log(`${idCorrida} ${resultado.position}`)
    if (resultado != undefined)
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
            const corridas = await obtemResultadosAno(ano)
            const resultadosFormatados = formataListaResultados(corridas)
            await Resultado.bulkCreate(resultadosFormatados)
            resultadosAdicionados += resultadosFormatados.length
        }
        console.log(`${resultadosAdicionados} resultados de corridas de ${anoInicio} a ${anoFim} salvas no banco`)
    }
}

module.exports = { populaResultadosPeriodo }
