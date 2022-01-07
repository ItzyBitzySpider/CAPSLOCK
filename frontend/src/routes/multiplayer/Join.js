import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function Join() {
	const location = useLocation();
	const URL = 'https://capslock-backend.herokuapp.com/';
	const socket = io(URL, { autoConnect: true });
	const { roomId, from } = location.state;
	const [mode, setMode] = useState('');

	useEffect(() => {
		socket.emit('room join', {
			roomId: roomId,
		});
	}, [roomId, socket]);

	socket.on('room update', (mode) => {
		setMode(mode);
		socket.emit('game start', {roomId});
	});

	socket.onAny((event, ...args) => {
		console.log(event, args);
	});

	return (
		<div className='main-content'>
			<div>
				<div>
					<h1 className='text-3xl p-4'>
						Room Code: <code>{roomId}</code>
					</h1>
				</div>
			</div>
		</div>
	);
}
