$(document).ready(function() {
	/*  GLOBAL VARIABLES    */
	const PREVIEW_TIME = 2000;
	let gameDifficulty;
	let maxTime = 0;
	let currTime = 0;
	let timeRemaining = 0;
	let grid = 0;
	let flipCounter = 0;
	let timer = null;

	/*  LEADERBOARD VARIABLES    */
	const advisory = $('#advisoryModal');
	const leaderboardBTN = $('.leaderboardBTN');
	const leaderboard = $('#leaderboardModal');
	const scoreLoader = $('#scoreLoader');
	const scoreTable = $('#scoreTable');
	const scoreData = $('#scoreData');

	scoreLoader.hide();
	scoreTable.hide();

	/*  MAIN GAME VARIABLES    */
	const startBTN = $('#startBTN');
	const startScreen = $('#startScreen');
	const restartBTN = $('#restartBTN');
	const soundBTN = $('#soundBTN')
	const gameOver = $('#gameOverScreen');
	const gameStatus = $('#gameStatus');
	const scoreDetails = $('#scoreDetails');
	const submitScoreBTN = $('#submitScoreBTN')

	$(startScreen).modal('show')

	/*  SOUND VARIABLES    */
	const backgroundSound = new Audio('../assets/sounds/background.mp3')
        backgroundSound.load();
        backgroundSound.loop = true;
	const flipSound = new Audio('../assets/sounds/flip.mp3');
        flipSound.load();
        flipSound.volume = 0.5;
	const gameOverSound = new Audio('../assets/sounds/gameover.mp3');
	    gameOverSound.load();
	const gameStartSound = new Audio('../assets/sounds/gameStart.mp3');
	    gameStartSound.load();
	const matchSound = new Audio('../assets/sounds/match.mp3');
	    matchSound.load();
	const gameWinSound = new Audio('../assets/sounds/win.mp3');
	    gameWinSound.load();
	const wrongSound = new Audio('../assets/sounds/wrong.mp3');
	    wrongSound.load();

	/*  FUNCTION RESPONSIBLE TO SHOW THE GAME OVER SCREEN    */
	const isTimeOut = isTimeOut => {
		$('#card_div').addClass('disableClick')
		setTimeout(() => {
			/*  CODE BLOCK THAT RUNS WHEN THE GAME TIMER RUNS OUT    */
			if (isTimeOut) {
				$(gameStatus).html("Times Up! You lost");
				$(gameStatus).css('color', 'darkred');
				scoreDetails.hide();
				$(submitScoreBTN).attr('disabled', true)
				gameStartSound.play();
				Array.from($('.card_container')).forEach(element => {
					$(element).addClass('active');
				});
				setTimeout(() => {
					$(gameOver).modal('show');
					backgroundSound.pause();
					gameOverSound.play();
				}, PREVIEW_TIME)

			}
			/*  CODE BLOCK THAT RUNS WHEN ALL THE CARDS HAVE BEEN PAIRED    */
			else {
				$(gameStatus).html("You Win. Congratulations.");
				$(gameStatus).css('color', 'darkgreen');
				$('#finalFlipCount').html(flipCounter);
				$('#finalTimeRemaining').html(timeRemaining)
				scoreDetails.show();
				$(submitScoreBTN).removeAttr('disabled');
				$(gameOver).modal('show');
				backgroundSound.pause();
				gameWinSound.play();
			}

		}, 200)
	}

	/*  CHECKS IF ALL CARDS HAVE BEEN PAIRED    */
	const checkIfOver = () => {
		/*  GET ALL THE CARDS WITH .MATCH CLASS TO BE CHECKED    */
		let match = $('.card_container.match')
		if (match.length == Math.pow(grid, 2)) {
			clearInterval(timer)
			isTimeOut(false)
		}
	}

	/*  CHECKS IF THE CARD PAIR THE USER CHOSE MATCH    */
	const checkPairs = (a, b) => {
		flipCounter++;
		$('#flipCounter').html(flipCounter);
		/*  DISABLES CARDS CONTAINER IF THEY ARE EVALUATED    */
		$('#card_div').addClass('disableClick')

		setTimeout(() => {
			/*  CODE BLOCK THAT RUNS IF THE CARDS ARE MATCH  */
			if ($(a).attr('data-card-value') == $(b).attr('data-card-value')) {
				matchSound.play();
				$(a).addClass('match')
				$(b).addClass('match')
				checkIfOver();
				$('#card_div').removeClass('disableClick')
			}
			/*  CODE BLOCK THAT RUNS IF THE CARDS ARE'NT MATCH  */
			else {
				wrongSound.play();
				$(a).addClass('wrong')
				$(b).addClass('wrong')
				setTimeout(() => {
					$(a).removeClass('wrong active disableClick')
					$(b).removeClass('wrong active disableClick')
					$('#card_div').removeClass('disableClick')
				}, 500)
			}
			/*  RE-ENABLE CARD CONTAINER  */
		}, 300)
	}

	/*  FUNCTION RESPONSIBLE FOR THE TIMER    */
	const countdown = () => {
		currTime--;
		let min = Math.floor(currTime / 60);
		let sec = currTime % 60;

		formattedMin = min < 10 ? `0${min}` : min;
		formattedSec = sec < 10 ? `0${sec}` : sec;

		$('#gameTime').html(`${formattedMin}:${formattedSec}`);
		timeRemaining = `${formattedMin}:${formattedSec}`

		/*  CODE BLOCK USE TO STOP THIS FUNCTION FROM RUNNING IF TIMER REACH 0  */
		if (currTime == 0) {
			isTimeOut(true)
			clearInterval(timer)
		}
	}

	/*  MAIN GAME START FUNCTION    */
	const gameStart = () => {
		/*  STARTS TIMER. CALLS COUNTDOWN FUNCTION EVERY 1 SECOND  */
		timer = setInterval(countdown, 1000)

		let isFlipped = false;
		let card_one;
		let card_two;

		$('#card_div').removeClass('disableClick')

		flipSound.play();

		/*  ADDS CLICK EVENT LISTENER TO EACH CARD  */
		Array.from($('.card_container')).forEach(element => {
			$(element).removeClass('active');
			gameStartSound.play();
			$(element).click(function(e) {
				e.preventDefault();
				if (!isFlipped) {
					card_one = e.target.parentNode;
					isFlipped = true;
				} else {
					card_two = e.target.parentNode;
					isFlipped = false;
					checkPairs(card_one, card_two)
				}
				flipSound.play();
				$(e.target.parentNode).addClass('active disableClick');
			});
		})
	}

	/*  FUNCTION THAT APPENDS THE CARD IN THE DOM    */
	const displayCard = cardArr => {
		$('#flipCounter').html(flipCounter);
		let content = '';
		/*  LOOPS THROUGH ALL OF THE CARD ARRAY  */
		cardArr.forEach(element => {
			content +=
				`<div class="card_container" data-card-value="${element.card}">
                <img src="${element.src}" alt="card_up" class="card_face card_up">
                <img src="../assets/images/card_00.png" alt="card_down" class="card_face card_down">
            </div>`
		})
		$('#card_div').append(content);

		$(startScreen).modal('hide');
		$(gameOver).modal('hide');

		/*  ADD ACTIVE CLASS ON EACH CARD SO THEY ARE FLIPPED BEFORE GAME STARTS  */
		setTimeout(() => {
			flipSound.play();
			Array.from($('.card_container')).forEach(element => {
				$(element).addClass('active');
			})
			setTimeout(() => {
				gameStart();
			}, PREVIEW_TIME)
		}, 500)
	}

	/*  FUNCTION THAT GENERATES ARRAY OF CARD PAIRS    */
	const generatePairs = gridSize => {
		const NUM_OF_PAIRS = (gridSize / 2) * gridSize;
		let history = [];
		let pairings = [];

		/*  FOR LOOP STATEMENT THAT RUNS BASED ON HOW MANY CARD PAIRS ARE NEEDED  */
		for (let i = 0; i < NUM_OF_PAIRS; i++) {
			let randNum = Math.floor(Math.random() * CARD_SET.length);

			/*  IF CARD ISN'T PICKED UP PREVIOUSLY, THEN IT IS ADDED TO THE CARD ARRAY  */
			if (!history.includes(randNum)) {
				history.push(randNum);
				pairings.push(CARD_SET[randNum]);
			}
			/*  OTHERWISE, IT WILL LOOP BACK SO THAT IT WILL PICK DIFFERENT CARD AGAIN  */
			else {
				i--;
			}
			/*  RESETS HISTORY, IF ALL THE CARD IN CARD SET HAVE BEEN PICKED  */
			if (history.length == CARD_SET.length) {
				history = [];
			}
		}
		pairings = pairings.concat(pairings);

		displayCard(pairings.sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5))

	}

	/*  EVENT LISTENER FOR START BUTTON    */
	$(startBTN).click(function(e) {
		e.preventDefault();
		gameDifficulty = $(startBTN).attr('data-difficulty')
		grid = $(startBTN).attr('data-grid-size')
		maxTime = parseInt($(startBTN).attr('data-time-limit'));
		currTime = maxTime + 1;
		$('#card_div').attr('data-grid-size', grid)
		$('#card_div').addClass('disableClick')
		$('#card_div').empty();

		backgroundSound.play();
		flipCounter = 0;
		countdown();
		generatePairs(grid)
	});

	/*  EVENT LISTENER FOR RESTART BUTTON    */
	$(restartBTN).click(function(e) {
		e.preventDefault();
		startBTN.click();
	});

	const isMute = isMute => {
		if (isMute) {
			backgroundSound.muted = true;
			flipSound.muted = true;
			gameOverSound.muted = true;
			gameStartSound.muted = true;
			matchSound.muted = true;
			gameWinSound.muted = true;
			wrongSound.muted = true;
		} else {
			backgroundSound.muted = false;
			flipSound.muted = false;
			gameOverSound.muted = false;
			gameStartSound.muted = false;
			matchSound.muted = false;
			gameWinSound.muted = false;
			wrongSound.muted = false;
		}
	}

	/*  EVENT LISTENER FOR SOUND BUTTON    */
	$(soundBTN).click(function(e) {
		e.preventDefault();
		$('#soundBTN i').toggleClass('fa-volume-high fa-volume-xmark')
		if ($('#soundBTN i').hasClass('fa-volume-high')) {
			isMute(false)
		} else {
			isMute(true)
		}
	});

	/*  FUNCTION RESPONSIBLE TO SUBMIT RECORD IN FIREBASE    */
	$('#modalSubmitScore').click(function(e) {
		e.preventDefault();
		let text = $('#scoreUsername').val();
		if (text.length != 0) {
			$('#scoreUsername').val('')
			$('#submitScoreModal').modal('hide');
			$(submitScoreBTN).attr('disabled', true);
			db.collection(gameDifficulty).add({
				username: text,
				flipCount: flipCounter
			})
		}
	});

	/*  RENDER SCORE TO LEADERBOARD TABLE    */
	const renderScore = (el, index) => {
		let tr =
			`<tr id="${el.id}">
                <th scope="row">${index}</th>
                <td>${el.data().username}</td>
                <td>${el.data().flipCount}</td>
            </tr>`
		$(scoreData).append(tr);
	}

	/*  FUNCTION RESPONSIBLE TO FETCH LEADERBOARD RECORD    */
	const fetchRecord = difficulty => {
		scoreData.empty();
		scoreTable.hide();
		scoreLoader.show();
		let content = '';
		let index = 1;
		/*  SETS LEADERBOARD TITLE APPROPRIATELY  */
		switch (difficulty) {
			case 'Easy':
				content = "Easy Leaderboard"
				break;
			case 'Intermediate':
				content = "Intermediate Leaderboard"
				break;
			case 'Expert':
				content = "Expert Leaderboard"
				break;
		}
		$('#leaderboardTitleID').html(content)

		db.collection(difficulty).orderBy('flipCount').get().then(snapshot => {
			snapshot.forEach(doc => {
				renderScore(doc, index)
				index++;
			})

			scoreLoader.hide();
			scoreTable.show();
		})

		$(leaderboard).modal('show')

	}

	/*  EVENT LISTENER TO WHICH VIEW LEADERBOARD BUTTON IS CLICKED    */
	Array.from(leaderboardBTN).forEach(element => {
		$(element).click(function(e) {
			e.preventDefault();
			fetchRecord($(e.currentTarget).attr('data-difficulty'))
		});
	})

	/*  FUNCTION USE TO REMOVE LEADERBOARD SYSTEM IN THE GAME    */
	const removeLeaderboard = () => {
		$(advisory).modal('hide');
		leaderboardBTN.hide();
		$(submitScoreBTN).hide();
	}

	/*  FUNCTION USE TO CHECK DATE    */
	const checkDate = date => {
		const d = new Date();
		let today = `${d.getFullYear()}-${(d.getMonth())+1}-${d.getDate()}`
		if (today >= date) {
			removeLeaderboard();
		} else {
			$(advisory).modal('show')
		}
	}
	checkDate('2023-01-05')

	/*  SNOW PARTICLE, PROVIDED BY PARTICLE.JS    */
	particlesJS.load('snowyBG', 'particles.json', function() {});
});