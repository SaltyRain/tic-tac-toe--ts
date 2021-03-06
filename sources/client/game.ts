import { openScreen } from './screens.js';
import * as GameScreen from './screens/game.js';
import * as ResultScreen from './screens/result.js';
import { PlayerGameState, PlayerRole, CellState } from "../common/messages";

GameScreen.setTurnHandler( turnHandler );
ResultScreen.setRestartHandler( restartHandler );

/**
 * Отправляет сообщение на сервер
 */
let sendMessage: typeof import( './connection.js' ).sendMessage;

/**
 * Устанавливает функцию отправки сообщений на сервер
 * 
 * @param sendMessageFunction Функция отправки сообщений
 */
function setSendMessage( sendMessageFunction: typeof sendMessage ): void
{
	sendMessage = sendMessageFunction;
}

/**
 * Обрабатывает ход игрока
 * 
 * @param move Ход игрока
 */
function turnHandler( move: PlayerGameState ): void
{
	sendMessage( {
		type: 'playerMove',
		move: move,
	} );
}

/**
 * Обрабатывает перезапуск игры
 */
function restartHandler(): void
{
	sendMessage( {
		type: 'repeatGame',
	} );
}

/**
 * Начинает игру
 */
function startGame(): void
{
	clearField();
	openScreen( 'game' );
	
}

function clearField(): void
{
	console.log('Очистка поля');
	let cell: HTMLElement;
	for (let i: number = 0; i <= 2; i++)
	{
		for (let j: number = 0; j <= 2; j++)
		{
			cell = document.getElementById((i + '-' + j))!;
			cell.children[0].classList.remove('mark-visible');
			cell.children[1].classList.remove('mark-visible');
		}
	}
}

/**
 * Меняет активного игрока
 * 
 * @param myTurn Ход текущего игрока?
 * @param gameField Игровое поле
 * @param role Роль игрока
 */
function changePlayer( myTurn: boolean, gameField: Array<Array<CellState>>, role: PlayerRole ): void
{
	GameScreen.update( myTurn, gameField, role );
}

/**
 * Завершает игру
 * 
 * @param result Результат игры
 */
function endGame( result: 'win' | 'loose' | 'abort'  ): void
{
	ResultScreen.update( result );
	openScreen( 'result' );
}

export {
	startGame,
	changePlayer,
	endGame,
	setSendMessage,
};
