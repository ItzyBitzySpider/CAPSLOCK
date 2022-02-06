import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Elimination from '../../components/Elimination';

const URL = process.env.REACT_APP_SOCKET_URL;
const socket = io(URL, { autoConnect: true });

export default function MElimination() {
	const [roomId, setId] = useState('');

	// run once to create room
	useEffect(() => {
		socket.emit('room create', { type: 'double elim' }, (id) => {
			setId(id);
		});
	}, []);

	return (
		<div className='main-content'>
			<Elimination socket={socket} roomId={roomId} />
			<div>
				<h1 className='text-xl p-4'>
					Room Code: <code>{roomId}</code>
				</h1>
			</div>
		</div>
	);
}
