import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Multiplayer() {
	const [roomCode, setRoomCode] = useState('');
	return (
		<div className='main-content'>
			<h1 className='text-5xl'>Select Gamemode</h1>
			<br />
			<br />
			<Link
				to='/multiplayer/elimination'
				className='text-3xl hover:font-medium'>
				Elimination
			</Link>
			<Link to='/multiplayer/attackdefense' className='text-3xl hover:font-medium py-5'>
				Attack & Defense
			</Link>
			<button className='text-3xl hover:font-medium'>Survival</button>
			<br />
			<div className='flex flex-row items-center'>
				<div className='w-32 h-0.5 bg-neutral-400' />
				<span className='text-xl text-neutral-400'>&emsp;or&emsp;</span>
				<div className='w-32 h-0.5 bg-neutral-400' />
			</div>
			<br />
			<div>
				<input
					className='px-3 w-64 h-10 text-black relative rounded border-0 shadow outline-none focus:outline-none focus:ring'
					placeholder='Enter Room Code'
					onChange={(e) => setRoomCode(e.target.value)}
				/>
				<Link className='h-full w-full' to='/multiplayer/join' state={{from:'multiplayer',roomId:roomCode}}>
					<button
						className='rounded border-2 border-white w-10 h-10 ml-2 hover:border-4 hover:font-black '
						onClick={console.log(roomCode)}>
						&gt;
					</button>
				</Link>
			</div>
		</div>
	);
}
