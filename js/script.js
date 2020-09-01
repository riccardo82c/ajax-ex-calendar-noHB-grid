/* Descrizione: Creiamo un calendario dinamico con le festività.
	Il calendario partirà da gennaio 2018 e si concluderà a dicembre 2018(unici dati disponibili sull’ API).
	Milestone 1
	Creiamo il mese di Gennaio,
	e con la chiamata all 'API inseriamo le festività.

	Milestone 2
	Diamo la possibilità di cambiare mese,
	gestendo il caso in cui l’ API non possa ritornare festività.

	Attenzione!
	Ogni volta che cambio mese dovrò: Controllare se il mese è valido(per ovviare al problema che l’ API non carichi holiday non del 2018)
	Controllare quanti giorni ha il mese scelto formando così una lista
	Chiedere all’ API quali sono le festività per il mese scelto
	Evidenziare le festività nella lista */

$(function () {
	/* inizializzazione locale di moment per la lingua italiana */
	const lang = 'it'
	moment.locale(lang);

	// setto data iniziale del calendario e la inserirsco nel DOM
	const initDate = moment("2018-01-01");
	const thisYear = initDate.format('YYYY');
	$('h1').append(thisYear);

	// oggetto MOMENT da appendere nel DOM
	let meseAnno = initDate.format('MMMM YYYY').toUpperCase();


	// carico il template dell 'oggetto in una variabile html inserendovi il nuovo meseAnno
	let html = `<h3 class="mese">${meseAnno}</h3>`;

	// la appendo nel DOM in container
	$('.container').append(html);

	// al click del bottone aggiungo o tolgo un mese e ristampo i giorni
	$('#prev').click(function () {
		prev(initDate);
	})

	$('#next').click(function () {
		next(initDate);
	})

	printDay();
	setHolidays(initDate.format('M') - 1, thisYear);


	/* funzioni */

	function setHolidays(m, y) {

		// chiamata AJAX
		$.ajax({
			method: 'GET',
			url: 'https://flynn.boolean.careers/exercises/api/holidays',
			data: {
				year: y,
				month: m
			},
			success: function (obj) {

				for (let i = 0; i < obj.response.length; i++) {
					let currentday = $(`p[data-set='${obj.response[i].date}'`)
					currentday.addClass('holiday').append(`<span>${obj.response[i].name}</span>`);
				}

				/*  Posso utilizzare anche forEach ed JQuery*/
				/* col forEach JS */
				/* 	obj.response.forEach(value => {
					let currentday = $(`p[data-set='${value.date}'`);
					currentday.addClass('holiday').append(value.name);
				});
 				*/
				/* col each JQuery */
				/* $(obj.response).each((index, value) => {
					let currentday = $(`p[data-set='${value.date}'`);
					currentday.addClass('holiday').append(value.name);
				}); */

				/*  */

			},
			error: function () {

			}
		});

	};

	// addZero, aggiunge zero ad un numero se minore di 10
	function addZero(int) {
		return int < 10 ? '0' + int : int;
	}


	// cambio mese
	function changeMonth(int) {
		initDate.add(int, 'M');
		/* meseAnno = initDate.format('MMMM YYYY').toUpperCase(); */

		$('.container').empty();

		meseAnno = initDate.format('MMMM YYYY').toUpperCase();

		let html = `<h3 class="mese">${meseAnno}</h3>`;
		$('.container').append(html);
		setHolidays(initDate.format('M') - 1, thisYear);
	}


	// stampa i giorni
	function printDay() {
		$('.days').empty();
		// salvo in una var i giorni del mese corrente
		let dayInMonth = moment(initDate, 'MMMM YYYY').daysInMonth();
		// creo un ciclo per stampare i giorni correnti
		for (let i = 1; i <= dayInMonth; i++) {
			$('.days').append(`<p data-set='${initDate.format('YYYY-MM')}-${addZero(i)}'><span>${addZero(i)}</span><span> ${initDate.format('MMMM')}</span> </p>`);
		}
	}

	// funzione avantamento/decremento mese
	function prev(date) {
		if (date.format('MM') !== '01') {
			changeMonth('-1');
			printDay();
		} else {
			alert('errore');
		}
	}

	function next(date) {
		if (date.format('MM') !== '12') {
			changeMonth('1');
			printDay();
		} else {
			alert('errore');
		}
	}

});