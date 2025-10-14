$(function () {
    //inicia o calendário
    var calendário = $('#calendar').calendario({
        weeks: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        months: [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ],

    })
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
        console.log("Objeto completo: ", data);

        const eventos = data.items || []; //lista de eventos
        console.log("Eventos: ", eventos);

        const eventosFormatados = {};

        eventos.forEach(evento => {
            //verifica se o evento tem uma data válida
            if (!evento.start || (!evento.start.date && !evento.start.dateTime)) return;

            const dataInicio = new Date(evento.start.date || evento.start.dateTime);

            //para ficar no formato do template
            const dia = String(dataInicio.getDate()).padStart(2, '0');
            const mes = String(dataInicio.getMonth() + 1).padStart(2, '0');
            const ano = dataInicio.getFullYear();

            const chaveData = `${mes}-${dia}-${ano}`;

            // Adiciona o evento nessa data
            eventosFormatados[chaveData] = `
        <div class="evento">
          <strong>${evento.summary || "Evento sem título"}</strong><br>
          ${evento.description ? `<small>${evento.description}</small>` : ""}
        </div>
      `;
        });

        console.log("Eventos formatados: ", eventosFormatados);

        aplicarEventosNoCalendario(eventosFormatados);
    })
    .catch(err => console.error("Erro ao buscar eventos: ", err));


//função para aplicar os eventos no calendário
function aplicarEventosNoCalendario(eventos) {
    const dias = document.querySelectorAll('.fc-date');

    dias.forEach(span => {
        const dia = span.textContent.trim().padStart(2, '0');
        const mes = String(document.querySelector('#custom-month').dataset.month).padStart(2, '0');
        const ano = document.querySelector('#custom-year').textContent;

        const chave = `${mes}-${dia}-${ano}`;

        // se houver evento nessa data
        if (eventos[chave]) {
            //destca o dia
            span.parentElement.classList.add('tem-evento');

            span.parentElement.addEventListener('click', () => {
                mostrarInfoEvento(eventos[chave]);
            });
        }
    });
}

//cria info window
function mostrarInfoEvento(conteudo) {
    // Remove janela anterior se existir
    const antiga = document.querySelector('.info-window');
    if (antiga) antiga.remove();

    // Cria nova janela
    const info = document.createElement('div');
    info.classList.add('info-window');
    info.innerHTML = conteudo;

    // Botão para fechar
    const fechar = document.createElement('button');
    fechar.textContent = 'Fechar';
    fechar.classList.add('btn-fechar');
    fechar.addEventListener('click', () => info.remove());
    info.appendChild(fechar);

    // Adiciona ao corpo
    document.body.appendChild(info);
}