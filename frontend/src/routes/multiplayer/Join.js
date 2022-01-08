import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import AttackDefense from '../../components/AttackDefense';
import Elimination from '../../components/Elimination';

const URL = 'http://35.240.217.27:3003/';
const socket = io(URL, { autoConnect: true });

export default function Join() {
	const location = useLocation();
	const { roomId, from } = location.state;
	const [mode, setMode] = useState('');

	// run once to join room
	useEffect(() => {
		socket.emit('room join', {
			roomId: roomId,
		});
	}, []);

	// receive game mode and start game
	useEffect(() => {
		socket.on('room update', (mode) => {
			console.log(mode);
			setMode(mode);
			socket.emit('game start', { roomId });
		});
	}, []);

	if (mode === 'elim') {
		return (
			<>
				<div className='main-content'>
					<div>
						<h1 className='text-3xl p-4'>
							Room Code: <code>{roomId}</code>
						</h1>
					</div>
					<Elimination socket={socket} roomId={roomId} />
				</div>
			</>
		);
	} else if (mode === 'ad') {
		return (
			<>
				<div className='main-content'>
					<div>
						<h1 className='text-3xl p-4'>
							Room Code: <code>{roomId}</code>
						</h1>
					</div>
					<AttackDefense socket={socket} roomId={roomId} />
				</div>
			</>
		);
	} else {
		return (
			<div className='main-content'>
				<div>
					<h1 className='text-3xl p-4'>
						Room Code: <code>{roomId}</code>
					</h1>
				</div>
				<div className='rounded w-4/5 h-1/2 grid grid-cols-5 grid-rows-4'></div>
				<br />
				<br />
				<br />
				<div>
					<input
						placeholder='Type here'
						className='bg-slate-100 w-96 text-xl disabled text-neutral-700 rounded px-3 p-2 focus:outline-none'
					/>
				</div>
			</div>
		);
	}
}
