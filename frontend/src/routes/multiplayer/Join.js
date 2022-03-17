import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import AttackDefense from '../../components/AttackDefense';
import Elimination from '../../components/Elimination';
import { Link } from 'react-router-dom';

const URL = process.env.REACT_APP_SOCKET_URL;
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

	// room full
	useEffect(() => {
		socket.on('room full', () => {
			setMode('Room Full');
		});
	}, []);

	// room does not exist
	useEffect(() => {
		socket.on('room does not exist', () => {
			setMode('Room ' + roomId + ' does not exist');
		});
	}, []);

	if (mode === 'elim') {
		return (
			<>
				<div className='main-content'>
					<Elimination socket={socket} roomId={roomId} />
					<div>
						<h1 className='text-xl p-4'>
							Room Code: <code>{roomId}</code>
						</h1>
					</div>
				</div>
			</>
		);
	} else if (mode === 'ad') {
		return (
			<>
				<div className='main-content'>
					<AttackDefense socket={socket} roomId={roomId} />
					<div>
						<h1 className='text-xl p-4'>
							Room Code: <code>{roomId}</code>
						</h1>
					</div>
				</div>
			</>
		);
	} else {
		return (
			<div className='main-content'>
				<div className='py-4'>
					<h1 className='text-4xl'>{mode}</h1>
				</div>
				<div className='py-4'>
					<Link className='h-full' to='/multiplayer/' state={{ from: 'join' }}>
						<button className='rounded px-6 py-2 border-2 border-slate-200 hover:border-white hover:font-black bg-teal-600 hover:bg-teal-500'>
							Return
						</button>
					</Link>
				</div>
			</div>
		);
	}
}
