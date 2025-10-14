$(function () {
    //inicia o calendário
    var $calendario = $('#calendar').calendario({
        weeks: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        months: [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ],

    
});

//navegação entre os meses
var $month = $('#custom-month').html($calendario.getMonthName());
var $year = $('#custom-year').html($calendario.getYear());

$('#custom-next').on('click', function () {
    $calendario.gotoNextMonth(updateMonthYear);
});
$('#custom-prev').on('click', function () {
    $calendario.gotoPreviousMonth(updateMonthYear);
});

function updateMonthYear() {
    $month.html($calendario.getMonthName());
    $year.html($calendario.getYear());
}

const url = `https://www.googleapis.com/calendar/v3/calendars/incentivams@gmail.com/events?key=AIzaSyD8cQUtzErJUZm7ulR5Ms0Fc4v4SHQVEjA`;

fetch(url)
    .then(resposta => resposta.json())
    .then(data => {
        const eventos = data.items || [];
        const eventosFormatados = {};

        eventos.forEach(evento => {
            if (!evento.start) return;

            const dataInicio = new Date(evento.start.date || evento.start.dateTime);
            const dia = String(dataInicio.getUTCDate()).padStart(2, '0');
            const mes = String(dataInicio.getUTCMonth() + 1).padStart(2, '0');
            const ano = dataInicio.getUTCFullYear();

            const chave = `${mes}-${dia}-${ano}`;

            eventosFormatados[chave] = `
            <div class="evento">
              <strong>${evento.summary || 'Evento sem título'}</strong><br>
              ${evento.description ? `<small>${evento.description}</small>` : ''}
            </div>
          `;
        });

        console.log('Eventos formatados: ', eventosFormatados);

        //vai aplicar ao calendário
        $calendario.setData(eventosFormatados);
    })
    .catch(err => console.error('Erro ao buscar eventos: ', err));

});